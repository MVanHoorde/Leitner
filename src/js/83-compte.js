/* Compte en ligne : connexion, création, démarrage et synchronisation.
 *
 * Les élèves se connectent avec le compte du site du cours. Ceux qui n'en ont
 * pas encore le créent ici, avec le code de classe donné par le professeur :
 * c'est le même compte, valable ensuite sur le site.
 */

/** Sans compte : choix explicite, retenu sur l'appareil. */
const ModeLocal = {
  actif: false,

  async charger() {
    this.actif = Boolean(await Base.lireMeta('mode-local'));
  },

  async choisir(actif) {
    this.actif = actif;
    await Base.ecrireMeta('mode-local', actif);
  },
};

/** Recharge tout ce qui dépend du dépôt (appareil ou compte). */
async function rechargerDonnees() {
  await Promise.all([Profil.charger(), Progression.charger(), SuiviContenu.charger(), Journal.charger(),
    ReglagesPaquet.charger(), Bibliotheque.charger()]);
  Perso.inscrire();
}

/** Écrans qu'une synchronisation peut redessiner sans gêner l'élève. */
const ECRANS_RAFRAICHISSABLES = new Set(['accueil-eleve', 'paquets', 'paquet', 'statistiques', 'cartes']);

let synchronisationEnCours = null;

async function synchroniserTout() {
  if (!Depot.uid) return;
  if (synchronisationEnCours) return synchronisationEnCours;
  synchronisationEnCours = (async () => {
    const uid = Depot.uid;
    try {
      await Depot.envoyer();
      await Depot.recevoir();
      await Perso.synchroniser();
      if (Depot.uid !== uid) return;
      await rechargerDonnees();
      Depot.relancerSiBesoin();
      const { nom } = lireRoute();
      if (Porte.courante === 'eleve' && !SessionContenu.active && ECRANS_RAFRAICHISSABLES.has(nom || 'accueil-eleve')) {
        afficher();
      }
      Photos.precharger(Bibliotheque.paquets());
    } catch (erreur) {
      if (erreur.code === 'PAS_DE_SESSION') Depot.changerStatut('session');
      else if (estHorsLigne(erreur)) Depot.changerStatut('attente');
      else {
        console.error(erreur);
        Depot.changerStatut('erreur');
      }
    }
  })().finally(() => { synchronisationEnCours = null; });
  return synchronisationEnCours;
}

/** Après connexion ou création de compte. */
async function ouvrirCompte(compte) {
  await Depot.ouvrir(compte.uid);
  await ModeLocal.choisir(false);
  await rechargerDonnees();
  await synchroniserTout();
  // Le niveau sert à proposer les bons paquets : on le déduit de la classe.
  if (!Profil.niveau && compte.classe) {
    const niveau = /term/i.test(compte.classe) ? 'terminale' : /(1re|1ère|premi)/i.test(compte.classe) ? 'premiere'
      : /(2nde|seconde|snt)/i.test(compte.classe) ? 'seconde' : null;
    if (niveau) await Profil.enregistrer({ niveau, pseudo: compte.pseudo });
  }
}

async function fermerCompte() {
  await Depot.envoyer().catch(() => {});
  if (Depot.enAttente()) {
    annoncer('Des révisions n’ont pas encore été sauvegardées : elles partiront à ta prochaine connexion.');
  }
  Nuage.seDeconnecter();
  Depot.fermer();
  await rechargerDonnees();
  location.hash = '';
  afficher();
}

/* ---------- Formulaire de connexion ---------- */

function champMotDePasseCompte(placeholder, autocomplete) {
  const entree = el('input', { type: 'password', autocomplete, placeholder, autocapitalize: 'off', spellcheck: 'false' });
  const basculer = el('button', {
    type: 'button',
    class: 'bouton discret-bouton',
    'aria-label': 'Afficher le mot de passe',
    onclick: () => {
      entree.type = entree.type === 'password' ? 'text' : 'password';
      basculer.textContent = entree.type === 'password' ? 'Voir' : 'Cacher';
    },
  }, 'Voir');
  return { entree, bloc: el('div', { class: 'rangee saisie mot-de-passe' }, entree, basculer) };
}

function formulaireConnexion() {
  let mode = 'connexion';
  const zone = el('div', { class: 'pile' });

  const dessiner = () => {
    const identifiant = el('input', {
      type: 'text', autocomplete: 'username', autocapitalize: 'off', spellcheck: 'false',
      placeholder: mode === 'connexion' ? 'ton identifiant (ou adresse du professeur)' : 'ex. : lea-m2',
    });
    const mdp = champMotDePasseCompte(mode === 'connexion' ? 'mot de passe' : 'choisis un mot de passe',
      mode === 'connexion' ? 'current-password' : 'new-password');
    const code = el('input', { type: 'text', autocomplete: 'off', autocapitalize: 'characters', placeholder: 'code donné en classe' });
    const erreur = el('p', { class: 'erreur', role: 'alert' });
    const valider = el('button', { type: 'submit', class: 'bouton principal bloc grand' },
      mode === 'connexion' ? 'Me connecter' : 'Créer mon compte');

    const formulaire = el('form', { class: 'panneau pile' },
      selecteur([['connexion', 'J’ai déjà un compte'], ['creation', 'Créer mon compte']], mode, (v) => {
        mode = v;
        dessiner();
      }, 'Connexion ou création'),
      el('p', { class: 'discret', text: mode === 'connexion'
        ? 'Le même identifiant et le même mot de passe que sur le site du cours.'
        : 'Ton compte servira aussi sur le site du cours. N’utilise pas ton vrai nom : un surnom suffit.' }),
      champ('Identifiant', identifiant, mode === 'creation' ? 'Minuscules, chiffres et tirets, de 3 à 32 caractères.' : null),
      champ('Mot de passe', mdp.bloc, mode === 'creation' ? REGLE_MOT_DE_PASSE : null),
      mode === 'creation'
        ? champ('Code de classe', code, 'Ton professeur te le donne.')
        : champ('Code du groupe (facultatif)', code, 'Seulement si ton professeur t’a donné un nouveau code, par exemple pour l’AP.'),
      erreur,
      valider);

    formulaire.addEventListener('submit', async (evenement) => {
      evenement.preventDefault();
      erreur.textContent = '';
      valider.disabled = true;
      valider.textContent = 'Un instant…';
      try {
        const compte = mode === 'connexion'
          ? await Nuage.seConnecter(identifiant.value, mdp.entree.value)
          : await Nuage.creerCompte(identifiant.value, mdp.entree.value, code.value);
        // Connexion réussie : un code de groupe refusé ne doit pas l'annuler.
        let avertissement = null;
        if (mode === 'connexion' && code.value.trim() && !compte.prof) {
          try {
            const groupe = await Nuage.rejoindreGroupe(code.value);
            avertissement = groupe ? `Groupe ajouté : ${groupe}` : null;
          } catch (e) {
            avertissement = `Connecté, mais le code n’a pas marché : ${messageNuage(e)}`;
          }
        }
        await ouvrirCompte(compte);
        annoncer(avertissement || (compte.prof ? `Connecté : ${compte.libelle || compte.identifiant}` : `Bienvenue ${compte.pseudo} !`));
        location.hash = '';
        afficher();
      } catch (e) {
        erreur.textContent = messageNuage(e);
        valider.disabled = false;
        valider.textContent = mode === 'connexion' ? 'Me connecter' : 'Créer mon compte';
      }
    });
    zone.replaceChildren(formulaire);
    identifiant.focus();
  };
  dessiner();
  return zone;
}

/** Accueil d'un élève non connecté. */
function ecranConnexion(zone) {
  definirTitre(NOM_APP);
  zone.append(el('div', { class: 'pile' },
    el('div', { class: 'accroche' },
      el('h2', { text: 'Tes flashcards, ta méthode' }),
      el('p', { text: 'Crée tes paquets de cartes, même à partir d’une photo de ta fiche. Ajoute ceux du prof. '
        + 'La boîte de Leitner te ramène chaque carte juste avant que tu l’oublies.' })),
    formulaireConnexion(),
    el('details', { class: 'panneau' },
      el('summary', { text: 'Utiliser sans compte' }),
      el('div', { class: 'pile' },
        el('p', { class: 'discret', text: 'Sans compte, tu peux réviser les paquets livrés avec l’application, '
          + 'mais pas créer tes cartes. Ta progression reste sur cet appareil seulement.' }),
        el('button', {
          type: 'button',
          class: 'bouton bloc',
          onclick: async () => {
            await ModeLocal.choisir(true);
            afficher();
          },
        }, 'Continuer sans compte'))),
    boutonChangerPorte()));
}

/* ---------- Jauge des photos ---------- */

function jaugePhotos() {
  const zone = el('div', { class: 'pile serree' }, el('p', { class: 'discret', text: 'Photos : calcul…' }));
  Nuage.mesPhotos()
    .then(({ nombre, octets }) => {
      const part = Math.min(1, nombre / QUOTA_PHOTOS);
      const classe = part >= 0.9 ? 'faible' : part >= 0.7 ? 'moyen' : 'bon';
      zone.replaceChildren(
        el('div', { class: 'ligne-entete' },
          el('span', { class: 'ligne-titre', text: 'Photos' }),
          el('span', { class: `ligne-taux ${classe}`, text: `${nombre} / ${QUOTA_PHOTOS}` })),
        el('div', { class: 'jauge' }, el('span', { class: `remplissage ${classe}`, style: `width:${Math.max(2, part * 100)}%` })),
        el('span', { class: 'discret', text: `${formaterOctets(octets || 1)} utilisés. `
          + (part >= 0.9 ? 'Presque plein : supprime des cartes photo dont tu n’as plus besoin.' : 'Chaque photo est allégée avant l’envoi.') }));
    })
    .catch(() => zone.replaceChildren(el('p', { class: 'discret', text: 'Photos : jauge indisponible hors connexion.' })));
  return zone;
}

/** Ajouter un groupe (AP…) à un compte déjà inscrit. */
function formulaireGroupe() {
  const code = el('input', { type: 'text', autocomplete: 'off', autocapitalize: 'characters', placeholder: 'code du groupe' });
  const message = el('p', { class: 'discret', role: 'status' });
  const bouton = el('button', { type: 'submit', class: 'bouton' }, 'Rejoindre');
  const formulaire = el('form', { class: 'pile serree' },
    el('span', { class: 'champ-libelle', text: 'Rejoindre un groupe' }),
    el('div', { class: 'rangee saisie' }, code, bouton),
    message);
  formulaire.addEventListener('submit', async (evenement) => {
    evenement.preventDefault();
    if (!code.value.trim()) return;
    bouton.disabled = true;
    try {
      const groupe = await Nuage.rejoindreGroupe(code.value);
      message.textContent = `Groupe ajouté${groupe ? ` : ${groupe}` : ''}.`;
      code.value = '';
    } catch (e) {
      message.textContent = messageNuage(e);
    }
    bouton.disabled = false;
  });
  return formulaire;
}

/** Panneau « Mon compte » de l'écran de profil. */
function panneauCompte() {
  const compte = Nuage.compte();
  if (!compte) {
    return el('section', { class: 'panneau pile' },
      el('h2', { text: 'Compte' }),
      el('p', { text: 'Tu utilises l’application sans compte : ta progression reste sur cet appareil.' }),
      el('button', {
        type: 'button',
        class: 'bouton principal bloc',
        onclick: async () => {
          await ModeLocal.choisir(false);
          location.hash = '';
          afficher();
        },
      }, 'Me connecter ou créer un compte'));
  }
  return el('section', { class: 'panneau pile' },
    el('h2', { text: 'Mon compte' }),
    el('p', {}, el('strong', { text: compte.prof ? (compte.libelle || compte.identifiant) : compte.pseudo }),
      compte.classe ? ` · ${compte.classe}` : '', compte.prof ? ' · compte enseignant' : ''),
    el('p', { class: 'discret', text: `${STATUTS_DEPOT[Depot.statut]}.` }),
    jaugePhotos(),
    !compte.prof && formulaireGroupe(),
    el('div', { class: 'rangee' },
      el('button', {
        type: 'button',
        class: 'bouton',
        onclick: async () => {
          await synchroniserTout();
          annoncer(STATUTS_DEPOT[Depot.statut]);
          afficher();
        },
      }, 'Synchroniser maintenant'),
      el('button', { type: 'button', class: 'bouton', onclick: fermerCompte }, 'Me déconnecter')));
}

/* ---------- Pied de page : état de la sauvegarde ---------- */

function majPied() {
  const zone = $('.confidentialite');
  if (!zone) return;
  zone.classList.toggle('alerte-pied', ['erreur', 'session'].includes(Depot.statut));
  if (Porte.courante !== 'eleve') {
    zone.textContent = 'Trombinoscope : données enregistrées uniquement sur cet appareil, jamais envoyées.';
    return;
  }
  const compte = Nuage.compte();
  zone.textContent = compte
    ? `${STATUTS_DEPOT[Depot.statut]} · ${compte.prof ? (compte.libelle || compte.identifiant) : compte.pseudo}`
    : 'Sans compte : progression enregistrée sur cet appareil seulement.';
}

Depot.surStatut = majPied;
