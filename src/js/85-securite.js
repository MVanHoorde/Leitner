/* Verrouillage par mot de passe, chiffrement AES-GCM, sauvegarde JSON. */

const ITERATIONS_PBKDF2 = 600000;
const LONGUEUR_MIN_MOT_DE_PASSE = 6;
const DELAI_INACTIVITE_MS = 5 * 60 * 1000;
const TEMOIN = 'reconnaitre-mes-eleves';
const FORMAT_SAUVEGARDE = 'reconnaitre-mes-eleves';

/* ---------- Primitives Web Crypto ---------- */

const Chiffrement = {
  async deriverCle(motDePasse, sel, iterations) {
    const materiau = await crypto.subtle.importKey(
      'raw', new TextEncoder().encode(motDePasse), 'PBKDF2', false, ['deriveKey']);
    return crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt: sel, iterations, hash: 'SHA-256' },
      materiau,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']);
  },

  async chiffrer(cle, objet) {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const clair = new TextEncoder().encode(JSON.stringify(objet));
    const ct = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, cle, clair));
    return { iv, ct };
  },

  async dechiffrer(cle, { iv, ct }) {
    const clair = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, cle, ct);
    return JSON.parse(new TextDecoder().decode(clair));
  },
};

function versBase64(octets) {
  let binaire = '';
  for (let i = 0; i < octets.length; i += 0x8000) {
    binaire += String.fromCharCode.apply(null, octets.subarray(i, i + 0x8000));
  }
  return btoa(binaire);
}

function depuisBase64(texte) {
  const binaire = atob(texte);
  const octets = new Uint8Array(binaire.length);
  for (let i = 0; i < binaire.length; i++) octets[i] = binaire.charCodeAt(i);
  return octets;
}

const CODEC_VERROUILLE = {
  encoder: async () => { throw new Error('Application verrouillée.'); },
  decoder: async () => { throw new Error('Application verrouillée.'); },
};

/* ---------- Verrou ---------- */

const Verrou = {
  verrouille: true,
  cle: null,
  parametres: null,
  dernierMouvement: Date.now(),
  echecs: 0,

  disponible() {
    return Boolean(window.isSecureContext && window.crypto && crypto.subtle);
  },

  activer(cle, parametres) {
    this.cle = cle;
    this.parametres = parametres;
    Base.codec = {
      encoder: (objet) => Chiffrement.chiffrer(cle, objet),
      decoder: (donnees) => Chiffrement.dechiffrer(cle, donnees),
    };
  },

  async nouveauxParametres(motDePasse) {
    const sel = crypto.getRandomValues(new Uint8Array(16));
    const cle = await Chiffrement.deriverCle(motDePasse, sel, ITERATIONS_PBKDF2);
    const temoin = await Chiffrement.chiffrer(cle, TEMOIN);
    return { cle, parametres: { version: 1, sel, iterations: ITERATIONS_PBKDF2, temoin } };
  },

  /** Premier lancement : crée le mot de passe et chiffre les données déjà présentes. */
  async creer(motDePasse) {
    Base.codec = { encoder: async (o) => o, decoder: async (d) => d };
    const [eleves, cartes] = await Promise.all([Base.lireTout('eleves'), Base.lireTout('cartes')]);
    const { cle, parametres } = await this.nouveauxParametres(motDePasse);
    this.activer(cle, parametres);
    await Base.modifier({ ecritures: { eleves, cartes }, metas: [{ cle: 'chiffrement', valeur: parametres }] });
  },

  async verifier(motDePasse, parametres = this.parametres) {
    const cle = await Chiffrement.deriverCle(motDePasse, parametres.sel, parametres.iterations);
    try {
      return (await Chiffrement.dechiffrer(cle, parametres.temoin)) === TEMOIN ? cle : null;
    } catch {
      return null;
    }
  },

  async deverrouiller(motDePasse) {
    const parametres = await Base.lireMeta('chiffrement');
    const cle = await this.verifier(motDePasse, parametres);
    if (!cle) return false;
    this.activer(cle, parametres);
    await Etat.chargerDonnees();
    this.verrouille = false;
    this.echecs = 0;
    this.signalerActivite();
    return true;
  },

  /** Rechiffre toutes les données avec une clé dérivée du nouveau mot de passe. */
  async changer(ancien, nouveau) {
    if (!(await this.verifier(ancien))) return false;
    const eleves = [...Etat.eleves.values()];
    const cartes = [...Etat.cartes.values()];
    const { cle, parametres } = await this.nouveauxParametres(nouveau);
    this.activer(cle, parametres);
    await Base.modifier({ ecritures: { eleves, cartes }, metas: [{ cle: 'chiffrement', valeur: parametres }] });
    return true;
  },

  verrouiller() {
    if (this.verrouille) return;
    this.verrouille = true;
    this.cle = null;
    Base.codec = CODEC_VERROUILLE;
    Session.arreter();
    Import.reinitialiser();
    Etat.viderDonnees();
    const { nom } = lireRoute();
    if (['session', 'import', 'eleve'].includes(nom)) history.replaceState(null, '', '#/accueil');
    afficherVerrou('deverrouiller');
  },

  signalerActivite() {
    this.dernierMouvement = Date.now();
  },

  verifierInactivite() {
    if (!this.verrouille && Date.now() - this.dernierMouvement > DELAI_INACTIVITE_MS) this.verrouiller();
  },
};

for (const evenement of ['pointerdown', 'keydown', 'touchstart', 'wheel', 'input']) {
  document.addEventListener(evenement, () => Verrou.signalerActivite(), { capture: true, passive: true });
}
setInterval(() => Verrou.verifierInactivite(), 10000);
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') Verrou.verifierInactivite();
});

/* ---------- Écran de verrouillage ---------- */

function champMotDePasse(autocomplete) {
  return el('input', {
    type: 'password', autocomplete, autocapitalize: 'off', spellcheck: 'false', minlength: LONGUEUR_MIN_MOT_DE_PASSE, required: true,
  });
}

function afficherVerrou(mode) {
  toucheEcran = null;
  document.body.classList.remove('plein');
  $('#retour').hidden = true;
  majBandeauDate();
  const zone = $('#ecran');
  zone.replaceChildren();
  window.scrollTo(0, 0);

  if (!Verrou.disponible()) {
    definirTitre('Reconnaître mes élèves');
    zone.append(el('div', { class: 'alerte danger pile' },
      el('h2', { text: 'Chiffrement indisponible' }),
      el('p', { text: 'Le navigateur n’autorise le chiffrement que pour une page ouverte en local (fichier), '
        + 'sur localhost ou en https. Ouvrez le fichier directement plutôt que via une adresse http://.' })));
    return;
  }

  const erreur = el('p', { class: 'erreur', role: 'alert' });
  const pile = el('div', { class: 'pile verrou' });
  zone.append(pile);

  const rappel = rappelConservation();
  if (rappel) pile.append(rappel);

  if (mode === 'creer') {
    definirTitre('Créer un mot de passe');
    const mdp = champMotDePasse('new-password');
    const confirmation = champMotDePasse('new-password');
    const bouton = el('button', { type: 'submit', class: 'bouton principal bloc grand' }, 'Créer le mot de passe');
    const formulaire = el('form', { class: 'panneau pile' },
      el('h2', { text: 'Protéger les données' }),
      el('p', { text: 'Les noms et les photos sont chiffrés sur cet appareil. Le mot de passe sera demandé '
        + 'à chaque ouverture et après 5 minutes d’inactivité.' }),
      el('p', { class: 'discret', text: 'Sans ce mot de passe, les données sont illisibles : s’il est oublié, '
        + 'la seule solution est de tout effacer.' }),
      champ('Mot de passe', mdp, `${LONGUEUR_MIN_MOT_DE_PASSE} caractères minimum.`),
      champ('Confirmation', confirmation),
      erreur,
      bouton);
    formulaire.addEventListener('submit', async (e) => {
      e.preventDefault();
      erreur.textContent = '';
      if (mdp.value.length < LONGUEUR_MIN_MOT_DE_PASSE) {
        erreur.textContent = `Le mot de passe doit contenir au moins ${LONGUEUR_MIN_MOT_DE_PASSE} caractères.`;
        return;
      }
      if (mdp.value !== confirmation.value) {
        erreur.textContent = 'Les deux saisies ne correspondent pas.';
        return;
      }
      bouton.disabled = true;
      bouton.textContent = 'Chiffrement…';
      try {
        await Verrou.creer(mdp.value);
        await Verrou.deverrouiller(mdp.value);
        afficher();
      } catch (err) {
        erreur.textContent = `Échec : ${err.message}`;
        bouton.disabled = false;
        bouton.textContent = 'Créer le mot de passe';
      }
    });
    pile.append(formulaire);
    mdp.focus();
    return;
  }

  definirTitre('Application verrouillée');
  const mdp = champMotDePasse('current-password');
  const bouton = el('button', { type: 'submit', class: 'bouton principal bloc grand' }, 'Déverrouiller');
  const formulaire = el('form', { class: 'panneau pile' },
    champ('Mot de passe', mdp), erreur, bouton);
  formulaire.addEventListener('submit', async (e) => {
    e.preventDefault();
    bouton.disabled = true;
    bouton.textContent = 'Vérification…';
    erreur.textContent = '';
    try {
      if (await Verrou.deverrouiller(mdp.value)) {
        afficher();
        return;
      }
      Verrou.echecs += 1;
      await new Promise((r) => setTimeout(r, Math.min(5, Verrou.echecs) * 1000));
      erreur.textContent = 'Mot de passe incorrect.';
    } catch (err) {
      erreur.textContent = `Échec : ${err.message}`;
    }
    bouton.disabled = false;
    bouton.textContent = 'Déverrouiller';
    mdp.select();
  });

  pile.append(formulaire);
  if (Etat.suivi.premierImport) {
    const jours = Dates.ecart(Etat.suivi.premierImport, Dates.aujourdhui());
    pile.append(el('p', { class: 'discret', text: `Premier import le ${Dates.formater(Etat.suivi.premierImport)} (${Dates.depuis(jours)}).` }));
  }
  pile.append(el('details', { class: 'panneau' },
    el('summary', { text: 'Mot de passe oublié ?' }),
    el('div', { class: 'pile' },
      el('p', { text: 'Les données sont chiffrées : sans le mot de passe, elles ne peuvent pas être récupérées. '
        + 'Vous pouvez tout effacer, puis réimporter les trombinoscopes ou une sauvegarde.' }),
      effacementComplet())));
  mdp.focus();
}

/* ---------- Réglages : mot de passe ---------- */

function sectionMotDePasse() {
  const ancien = champMotDePasse('current-password');
  const nouveau = champMotDePasse('new-password');
  const confirmation = champMotDePasse('new-password');
  const erreur = el('p', { class: 'erreur', role: 'alert' });
  const bouton = el('button', { type: 'submit', class: 'bouton bloc' }, 'Changer le mot de passe');
  const formulaire = el('form', { class: 'pile' },
    champ('Mot de passe actuel', ancien),
    champ('Nouveau mot de passe', nouveau, `${LONGUEUR_MIN_MOT_DE_PASSE} caractères minimum.`),
    champ('Confirmation', confirmation),
    erreur,
    bouton);
  formulaire.addEventListener('submit', async (e) => {
    e.preventDefault();
    erreur.textContent = '';
    if (nouveau.value.length < LONGUEUR_MIN_MOT_DE_PASSE) {
      erreur.textContent = `Au moins ${LONGUEUR_MIN_MOT_DE_PASSE} caractères.`;
      return;
    }
    if (nouveau.value !== confirmation.value) {
      erreur.textContent = 'Les deux saisies ne correspondent pas.';
      return;
    }
    bouton.disabled = true;
    try {
      if (await Verrou.changer(ancien.value, nouveau.value)) {
        formulaire.reset();
        annoncer('Mot de passe changé.');
      } else {
        erreur.textContent = 'Mot de passe actuel incorrect.';
      }
    } catch (err) {
      erreur.textContent = `Échec : ${err.message}`;
    }
    bouton.disabled = false;
  });

  return el('section', { class: 'panneau pile' },
    el('h2', { text: 'Mot de passe' }),
    el('p', { class: 'discret', text: 'Verrouillage automatique après 5 minutes d’inactivité.' }),
    el('button', { type: 'button', class: 'bouton bloc', onclick: () => Verrou.verrouiller() }, 'Verrouiller maintenant'),
    el('details', {}, el('summary', { text: 'Changer le mot de passe' }), formulaire));
}

/* ---------- Réglages : sauvegarde ---------- */

async function exporterSauvegarde(protegee) {
  const contenu = {
    format: FORMAT_SAUVEGARDE,
    version: 1,
    exporteLe: new Date().toISOString(),
    eleves: [...Etat.eleves.values()],
    cartes: [...Etat.cartes.values()],
    reglages: Etat.reglages,
    suivi: Etat.suivi,
  };
  let fichier = contenu;
  if (protegee) {
    const { sel, iterations } = Verrou.parametres;
    const { iv, ct } = await Chiffrement.chiffrer(Verrou.cle, contenu);
    fichier = {
      format: FORMAT_SAUVEGARDE,
      version: 1,
      chiffre: true,
      kdf: { algorithme: 'PBKDF2-SHA256', iterations, sel: versBase64(sel) },
      chiffrement: 'AES-GCM-256',
      iv: versBase64(iv),
      donnees: versBase64(ct),
    };
  }
  const blob = new Blob([JSON.stringify(fichier)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const lien = el('a', { href: url, download: `eleves-sauvegarde-${Dates.aujourdhui()}.json`, hidden: true });
  document.body.append(lien);
  lien.click();
  lien.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
  return blob.size;
}

async function lireSauvegarde(texte, demanderMotDePasse) {
  let fichier;
  try {
    fichier = JSON.parse(texte);
  } catch {
    throw new Error('Ce fichier n’est pas une sauvegarde JSON valide.');
  }
  if (!fichier || fichier.format !== FORMAT_SAUVEGARDE) throw new Error('Ce fichier ne provient pas de cette application.');
  let contenu = fichier;
  if (fichier.chiffre) {
    const parametres = { sel: depuisBase64(fichier.kdf.sel), iterations: fichier.kdf.iterations };
    for (;;) {
      const motDePasse = await demanderMotDePasse();
      if (motDePasse === null) return null;
      const cle = await Chiffrement.deriverCle(motDePasse, parametres.sel, parametres.iterations);
      try {
        contenu = await Chiffrement.dechiffrer(cle, { iv: depuisBase64(fichier.iv), ct: depuisBase64(fichier.donnees) });
        break;
      } catch {
        demanderMotDePasse.erreur('Mot de passe incorrect pour cette sauvegarde.');
      }
    }
  }
  if (!Array.isArray(contenu.eleves) || !Array.isArray(contenu.cartes)) throw new Error('Sauvegarde incomplète.');
  return contenu;
}

function sectionSauvegarde() {
  const protegee = el('input', { type: 'checkbox', checked: true });
  const avertissement = el('p', { class: 'erreur', hidden: true,
    text: 'Fichier non chiffré : noms et photos seront lisibles par quiconque obtient ce fichier.' });
  protegee.addEventListener('change', () => { avertissement.hidden = protegee.checked; });

  const exporter = el('button', { type: 'button', class: 'bouton principal bloc', disabled: !Etat.eleves.size }, 'Exporter une sauvegarde');
  exporter.addEventListener('click', async () => {
    exporter.disabled = true;
    try {
      const taille = await exporterSauvegarde(protegee.checked);
      annoncer(`Sauvegarde créée (${formaterOctets(taille)}).`);
    } catch (err) {
      annoncer(`Échec de l’export : ${err.message}`);
    }
    exporter.disabled = false;
  });

  const zoneImport = el('div', { class: 'pile' });
  const etapeFichier = () => {
    const entree = el('input', { type: 'file', accept: 'application/json,.json', id: 'fichier-sauvegarde', class: 'visuellement-cache' });
    const etat = el('p', { class: 'discret', role: 'status' });
    entree.addEventListener('change', async () => {
      const fichier = entree.files[0];
      if (!fichier) return;
      etat.textContent = 'Lecture…';
      try {
        const contenu = await lireSauvegarde(await fichier.text(), demanderMotDePasse);
        if (contenu) etapeChoix(contenu);
        else etapeFichier();
      } catch (err) {
        etat.textContent = err.message;
      }
      entree.value = '';
    });
    zoneImport.replaceChildren(
      el('label', { for: 'fichier-sauvegarde', class: 'bouton bloc' }, 'Réimporter une sauvegarde'), entree, etat);
  };

  const demanderMotDePasse = () => new Promise((resoudre) => {
    const mdp = champMotDePasse('off');
    const formulaire = el('form', { class: 'pile' },
      champ('Mot de passe de la sauvegarde', mdp), demanderMotDePasse.zoneErreur,
      el('div', { class: 'rangee' },
        el('button', { type: 'submit', class: 'bouton principal' }, 'Ouvrir'),
        el('button', { type: 'button', class: 'bouton', onclick: () => resoudre(null) }, 'Annuler')));
    formulaire.addEventListener('submit', (e) => {
      e.preventDefault();
      demanderMotDePasse.zoneErreur.textContent = 'Déchiffrement…';
      resoudre(mdp.value);
    });
    zoneImport.replaceChildren(formulaire);
    mdp.focus();
  });
  demanderMotDePasse.zoneErreur = el('p', { class: 'erreur', role: 'alert' });
  demanderMotDePasse.erreur = (texte) => { demanderMotDePasse.zoneErreur.textContent = texte; };

  const etapeChoix = (contenu) => {
    const classes = new Set(contenu.eleves.map((e) => e && e.classe).filter(Boolean));
    const appliquer = async (mode) => {
      const n = await Etat.restaurer(contenu, mode);
      annoncer(`${pluriel(n, 'élève restauré', 'élèves restaurés')}.`);
      aller('accueil');
    };
    zoneImport.replaceChildren(el('div', { class: 'pile' },
      el('p', {}, el('strong', { text: `${pluriel(contenu.eleves.length, 'élève')}, ${pluriel(classes.size, 'classe')}` }),
        contenu.exporteLe ? ` — sauvegarde du ${Dates.formater(Dates.versIso(new Date(contenu.exporteLe)))}` : ''),
      el('button', { type: 'button', class: 'bouton principal bloc', onclick: () => appliquer('ajouter') },
        'Ajouter aux données actuelles'),
      confirmationDeuxTemps({
        libelle: 'Remplacer toutes les données',
        question: 'Remplacer toutes les données actuelles ?',
        detail: `Les ${pluriel(Etat.eleves.size, 'élève')} actuels et leur progression seront remplacés par la sauvegarde.`,
        libelleConfirmer: 'Oui, remplacer',
        action: () => appliquer('remplacer'),
      }),
      el('button', { type: 'button', class: 'bouton bloc', onclick: etapeFichier }, 'Annuler')));
  };

  etapeFichier();
  return el('section', { class: 'panneau pile' },
    el('h2', { text: 'Sauvegarde' }),
    el('p', { class: 'discret', text: 'Fichier JSON complet : élèves, photos, progression et réglages.' }),
    el('label', { class: 'case' }, protegee, el('span', { text: 'Chiffrer le fichier avec le mot de passe (recommandé)' })),
    avertissement,
    exporter,
    zoneImport);
}
