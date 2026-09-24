/* Espace élève : profil local, accueil, réglages de charge de travail.
 *
 * Rien d'identifiant n'est demandé : un prénom ou un surnom, un niveau. Le
 * fichier est destiné à l'appareil personnel de l'élève, et sa progression ne
 * quitte jamais cet appareil.
 */

function bilanGlobalEleve() {
  const jour = Dates.aujourdhui();
  let dues = 0;
  let nouvelles = 0;
  for (const paquet of Paquets.pourNiveau(Profil.niveau)) {
    const bilan = SessionContenu.bilan(paquet, null, jour);
    dues += bilan.dues.length;
    nouvelles += bilan.nouvellesDuJour;
  }
  return { dues, nouvelles, total: dues + nouvelles };
}

function selecteurNiveau(valeurInitiale, auChangement) {
  return selecteur(NIVEAUX, valeurInitiale, auChangement, 'Niveau');
}

/** Ligne d'accroche de l'accueil : ce qui donne envie de ne pas casser la série. */
function serieDuJour() {
  const serie = Journal.serie();
  const total = Journal.total();
  if (!total.vues) return 'Régularité, avancement, points faibles';
  const fait = Journal.du(Dates.aujourdhui()).vues;
  if (!serie) return `${pluriel(total.vues, 'carte vue', 'cartes vues')} en tout · série interrompue`;
  return `${pluriel(serie, 'jour')} d’affilée${fait ? '' : ' · à confirmer aujourd’hui'}`;
}

/* ---------- Première ouverture : création du profil ---------- */

function formulaireProfil(surValidation) {
  const pseudo = el('input', {
    type: 'text', value: Profil.donnees.pseudo, autocomplete: 'off', maxlength: 30,
    placeholder: 'Prénom ou surnom',
  });
  let niveau = Profil.niveau;
  const erreur = el('p', { class: 'erreur', role: 'alert' });

  const formulaire = el('form', { class: 'panneau pile' },
    el('h2', { text: Profil.defini() ? 'Mon profil' : 'Avant de commencer' }),
    champ('Comment veux-tu être appelé ?', pseudo, 'Facultatif. Rien n’est envoyé nulle part.'),
    el('div', { class: 'champ' },
      el('span', { class: 'champ-libelle', text: 'Ta classe' }),
      selecteurNiveau(niveau, (valeur) => { niveau = valeur; }),
      el('span', { class: 'champ-aide', text: 'Détermine les paquets proposés en premier.' })),
    erreur,
    el('button', { type: 'submit', class: 'bouton principal bloc grand' },
      Profil.defini() ? 'Enregistrer' : 'C’est parti'));

  formulaire.addEventListener('submit', async (evenement) => {
    evenement.preventDefault();
    if (!niveau) {
      erreur.textContent = 'Choisis ta classe pour continuer.';
      return;
    }
    await Profil.enregistrer({ pseudo: pseudo.value.trim().slice(0, 30), niveau });
    surValidation();
  });
  return formulaire;
}

/* ---------- Accueil élève ---------- */

Ecrans['accueil-eleve'] = {
  titre: NOM_APP,
  titreCourt: 'Accueil',
  parent: null,
  porte: 'eleve',
  rendre(zone) {
    const pile = el('div', { class: 'pile' });
    zone.append(pile);

    if (!Profil.defini()) {
      pile.append(
        el('p', { text: 'Ces cartes servent à retenir durablement : chaque notion revient juste '
          + 'avant que tu l’oublies, de plus en plus espacée.' }),
        formulaireProfil(() => afficher()));
      return;
    }

    const { dues, nouvelles, total } = bilanGlobalEleve();
    const pseudo = Profil.donnees.pseudo;
    definirTitre(pseudo ? `Bonjour ${pseudo}` : NOM_APP);

    const detail = total
      ? `${pluriel(dues, 'carte due', 'cartes dues')} · ${pluriel(nouvelles, 'nouvelle')} · ${estimerDuree(total, Journal.secondesParCarte())}`
      : 'Tout est à jour pour aujourd’hui';

    pile.append(
      el('p', { class: 'discret', text: `${nomNiveau(Profil.niveau)} · ${pluriel(Paquets.pourNiveau(Profil.niveau).length, 'paquet')} à ton niveau` }),
      boutonMenu('Réviser', detail, () => aller('paquets'), total ? 'principal' : ''),
      boutonMenu('Ma progression', serieDuJour(), () => aller('statistiques')),
      boutonMenu('Mon profil', 'Classe, rythme de travail, remise à zéro', () => aller('profil-eleve')));

    if (!total) {
      pile.append(el('div', { class: 'panneau' },
        el('p', { text: 'Rien n’est dû aujourd’hui. Tu peux quand même t’entraîner librement '
          + 'depuis un paquet : cela ne dérègle pas le calendrier.' })));
    }
    pile.append(boutonChangerPorte());
  },
};

/* ---------- Profil et réglages ---------- */

function champReglageProfil(libelle, cle, min, max, aide) {
  const entree = el('input', { type: 'number', inputmode: 'numeric', min, max, step: 1, value: Profil.donnees[cle] });
  entree.addEventListener('change', async () => {
    let valeur = Math.round(Number(entree.value));
    if (!Number.isFinite(valeur) || entree.value === '') valeur = PROFIL_DEFAUT[cle];
    valeur = Math.min(max, Math.max(min, valeur));
    entree.value = valeur;
    await Profil.enregistrer({ [cle]: valeur });
    annoncer('Réglage enregistré.');
  });
  return champ(libelle, entree, aide);
}

Ecrans['profil-eleve'] = {
  titre: 'Mon profil',
  titreCourt: 'Profil',
  parent: 'accueil-eleve',
  porte: 'eleve',
  rendre(zone) {
    const pile = el('div', { class: 'pile' });
    zone.append(pile);

    pile.append(
      formulaireProfil(() => {
        annoncer('Profil enregistré.');
        afficher();
      }),

      el('section', { class: 'panneau pile' },
        el('h2', { text: 'Rythme de travail' }),
        champReglageProfil('Nouvelles cartes par jour et par paquet', 'nouvellesParJour', 1, 60,
          'Au-delà de 15, les révisions des jours suivants s’alourdissent vite.'),
        champReglageProfil('Cartes par série', 'tailleSession', 5, 100,
          'Un bouton « continuer » permet d’enchaîner une nouvelle série.')),

      el('section', { class: 'panneau pile' },
        el('h2', { text: 'Recommencer un paquet' }),
        el('p', { class: 'discret', text: 'Efface la progression d’un paquet : toutes ses cartes '
          + 'redeviennent nouvelles. Les autres paquets ne bougent pas.' }),
        ...Paquets.liste.map((paquet) => {
          const repartition = Progression.repartition(paquet.cartes);
          const entamees = repartition.total - repartition.jamaisVues;
          if (!entamees) return el('p', { class: 'discret', text: `${paquet.titre} : jamais commencé.` });
          return confirmationDeuxTemps({
            libelle: `Recommencer « ${paquet.titre} » (${entamees} cartes entamées)`,
            question: `Effacer la progression de « ${paquet.titre} » ?`,
            detail: 'Les compartiments et les dates de révision de ce paquet seront perdus.',
            libelleConfirmer: 'Oui, recommencer',
            classeBouton: 'bouton bloc',
            action: async () => {
              const efface = await Progression.remettreAZero(paquet.cartes);
              annoncer(`${pluriel(efface, 'carte')} remises à zéro.`);
              afficher();
            },
          });
        })),

      el('section', { class: 'panneau pile' },
        el('h2', { text: 'Effacement' }),
        el('p', { text: 'Supprime toute la base locale de cet appareil : profil, progression, '
          + 'et, si l’application sert aussi à un enseignant, son trombinoscope.' }),
        effacementComplet()),

      boutonChangerPorte());
  },
};
