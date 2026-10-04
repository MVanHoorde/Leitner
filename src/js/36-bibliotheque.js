/* Bibliothèque personnelle, paquets créés dans l'application, réglages Leitner.
 *
 * Trois sortes de paquets se côtoient dans la bibliothèque d'un élève :
 *   « integre » — écrits dans le code (33-…, 34-…), livrés avec l'application ;
 *   « prof »    — publiés par un enseignant dans la bibliothèque commune
 *                 (leitner_paquets.public), que l'élève ajoute chez lui ;
 *   « perso »   — créés par l'élève lui-même, visibles de lui seul (et de ses
 *                 enseignants, qui peuvent vérifier ce qui s'y trouve).
 *
 * Les paquets en ligne sont convertis au format des paquets intégrés et
 * inscrits dans Paquets : la révision, les statistiques et le moteur Leitner
 * les traitent tous de la même façon.
 */

/* ---------- Rythmes Leitner ---------- */

const RYTHMES = {
  intensif: {
    titre: 'Intensif',
    resume: 'Évaluation dans les jours qui viennent',
    intervalles: [1, 2, 3, 5, 8],
  },
  standard: {
    titre: 'Standard',
    resume: 'Retenir pour le trimestre',
    intervalles: [1, 3, 7, 14, 30],
  },
  long: {
    titre: 'Long terme',
    resume: 'Garder jusqu’au bac',
    intervalles: [2, 5, 12, 30, 60],
  },
};

const BORNES_INTERVALLE = [1, 365];

function intervallesValides(liste) {
  if (!Array.isArray(liste) || liste.length !== 5) return null;
  const propres = liste.map((n) => Math.round(Number(n)));
  if (propres.some((n) => !Number.isFinite(n) || n < BORNES_INTERVALLE[0] || n > BORNES_INTERVALLE[1])) return null;
  return propres;
}

/** « demain », « dans 3 jours », « dans 2 semaines »… */
function decrireDelai(jours) {
  if (jours === 1) return 'le lendemain';
  if (jours < 14) return `${jours} jours après`;
  if (jours < 60 && jours % 7 === 0) return `${jours / 7} semaines après`;
  if (jours < 60) return `${jours} jours après`;
  return `${Math.round(jours / 30)} mois après`;
}

/* ---------- Réglages par paquet (propres à chaque élève) ---------- */

const ReglagesPaquet = {
  donnees: {},

  async charger() {
    this.donnees = (await Depot.lire('reglagesPaquets')) || {};
  },

  brut(cle) {
    return this.donnees[cle] || {};
  },

  /** { rythme, intervalles, nouvellesParJour, dateEvaluation } effectifs. */
  de(paquet) {
    const r = this.brut(paquet.cle);
    let intervalles = paquet.intervalles || INTERVALLES_CONTENU;
    let rythme = 'paquet';
    if (r.rythme && RYTHMES[r.rythme]) {
      rythme = r.rythme;
      intervalles = RYTHMES[r.rythme].intervalles;
    } else if (r.rythme === 'perso' && intervallesValides(r.intervalles)) {
      rythme = 'perso';
      intervalles = intervallesValides(r.intervalles);
    }
    const dateEvaluation = typeof r.dateEvaluation === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(r.dateEvaluation)
      ? r.dateEvaluation : null;
    return {
      algorithme: ALGORITHMES[r.algorithme] ? r.algorithme : 'leitner',
      rythme,
      intervalles,
      nouvellesParJour: Number.isInteger(r.nouvellesParJour) ? r.nouvellesParJour : Profil.donnees.nouvellesParJour,
      dateEvaluation,
    };
  },

  /** Évaluation encore à venir, ou null. */
  evaluation(paquet, jour = Dates.aujourdhui()) {
    const { dateEvaluation } = this.de(paquet);
    return dateEvaluation && dateEvaluation > jour ? dateEvaluation : null;
  },

  /**
   * Nouvelles cartes du jour. Avec une évaluation à venir, le quota grimpe si
   * besoin pour que toutes les cartes aient été vues trois jours avant :
   * une carte découverte la veille n'a aucune chance d'être retenue.
   */
  nouvellesParJour(paquet, jour = Dates.aujourdhui()) {
    const reglage = this.de(paquet);
    const evaluation = this.evaluation(paquet, jour);
    if (!evaluation) return reglage.nouvellesParJour;
    const restantes = Progression.repartition(paquet.cartes).jamaisVues;
    const jours = Math.max(1, Dates.ecart(jour, evaluation) - 3);
    return Math.max(reglage.nouvellesParJour, Math.ceil(restantes / jours));
  },

  async enregistrer(cle, changements) {
    const suivant = { ...this.brut(cle), ...changements };
    for (const [k, v] of Object.entries(suivant)) if (v === null || v === undefined) delete suivant[k];
    this.donnees = { ...this.donnees, [cle]: suivant };
    await Depot.ecrire('reglagesPaquets', this.donnees);
  },
};

/* ---------- Trois algorithmes de répétition espacée ---------- */

const ALGORITHMES = {
  leitner: {
    titre: 'Leitner classique',
    resume: 'Réussie : la carte monte d’une boîte. Ratée : retour en boîte 1.',
  },
  progressif: {
    titre: 'Leitner progressif',
    resume: 'Ratée, la carte ne redescend que d’une boîte et revient le lendemain. Moins punitif.',
  },
  sm2: {
    titre: 'SM-2 (comme Anki)',
    resume: 'Tu notes chaque réponse sur 4 niveaux. Chaque carte a sa propre facilité : '
      + 'les faciles s’espacent vite, les difficiles reviennent souvent.',
  },
};

/** Notes de SM-2 : la qualité de la réponse, de 0 à 5 dans l'article d'origine. */
const NOTES_SM2 = {
  revoir: { libelle: 'À revoir', qualite: 1 },
  difficile: { libelle: 'Difficile', qualite: 3 },
  bien: { libelle: 'Bien', qualite: 4 },
  facile: { libelle: 'Facile', qualite: 5 },
};

/** Avant une évaluation, aucune échéance au-delà de la veille. */
function plafonnerEcheance(echeance, jour, dateEvaluation) {
  if (!dateEvaluation || jour >= dateEvaluation) return echeance;
  const veille = Dates.ajouter(dateEvaluation, -1);
  const auPlusTard = veille > jour ? veille : Dates.ajouter(jour, 1);
  return echeance > auPlusTard ? auPlusTard : echeance;
}

/** SM-2 n'a pas de boîtes : on en déduit une du délai, pour les barres et les statistiques. */
function boiteDepuisDelai(jours) {
  if (jours <= 1) return 1;
  if (jours <= 3) return 2;
  if (jours <= 8) return 3;
  if (jours <= 21) return 4;
  return 5;
}

/**
 * SM-2 (Wozniak, 1987), avec des premiers délais adaptés au lycée : 1 jour,
 * puis 3 (ou 6 si « Facile »), puis délai × facilité. La facilité de la carte
 * baisse quand elle résiste et monte quand elle est facile, sans passer sous
 * 1,3. « Difficile » réussit, mais allonge moins le délai.
 */
function appliquerSM2(etat, note, jour, dateEvaluation) {
  const q = (NOTES_SM2[note] || NOTES_SM2.bien).qualite;
  const reussi = q >= 3;
  let ef = typeof etat.ef === 'number' ? etat.ef : 2.5;
  let repetitions = etat.repetitions || 0;
  let intervalle = etat.intervalle || 0;
  if (!reussi) {
    repetitions = 0;
    intervalle = 1;
  } else {
    repetitions += 1;
    if (repetitions === 1) intervalle = q === 5 ? 3 : 1;
    else if (repetitions === 2) intervalle = q === 5 ? 6 : 3;
    else intervalle = Math.max(intervalle + 1, Math.round(intervalle * ef * (q === 3 ? 0.8 : q === 5 ? 1.3 : 1)));
  }
  ef = Math.max(1.3, ef + 0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  return {
    ...etat,
    compartiment: reussi ? boiteDepuisDelai(intervalle) : 1,
    introduite: etat.introduite ?? jour,
    echeance: plafonnerEcheance(Dates.ajouter(jour, intervalle), jour, dateEvaluation),
    passages: etat.passages + 1,
    reussites: etat.reussites + (reussi ? 1 : 0),
    dernierPassage: jour,
    dernierEchec: reussi ? etat.dernierEchec : jour,
    ef: Math.round(ef * 100) / 100,
    intervalle,
    repetitions,
  };
}

/**
 * Note une réponse selon l'algorithme, le rythme et l'évaluation propres au
 * paquet. note : 'revoir' | 'difficile' | 'bien' | 'facile', pour SM-2 ; les
 * QCM et réponses écrites, corrigés automatiquement, valent « bien » ou
 * « à revoir ».
 */
function appliquerReglages(etat, reussi, jour, paquet, note = null) {
  const reglage = ReglagesPaquet.de(paquet);
  const evaluation = ReglagesPaquet.evaluation(paquet, jour);
  if (reglage.algorithme === 'sm2') return appliquerSM2(etat, note || (reussi ? 'bien' : 'revoir'), jour, evaluation);
  if (reglage.algorithme === 'progressif' && !reussi) {
    return {
      ...etat,
      compartiment: Math.max(1, etat.compartiment - 1),
      introduite: etat.introduite ?? jour,
      echeance: plafonnerEcheance(Dates.ajouter(jour, 1), jour, evaluation),
      passages: etat.passages + 1,
      reussites: etat.reussites,
      dernierPassage: jour,
      dernierEchec: jour,
    };
  }
  return Leitner.appliquer(etat, reussi, jour, reglage.intervalles, evaluation);
}

/** Délai, en jours, qu'une note donnerait à cette carte : affiché sous les boutons de SM-2. */
function delaiPrevu(etat, note, jour, paquet) {
  return Dates.ecart(jour, appliquerReglages(etat, note !== 'revoir', jour, paquet, note).echeance);
}

/**
 * Passages prévus d'une carte découverte aujourd'hui et toujours réussie,
 * jusqu'à l'évaluation (ou sur deux mois sans évaluation).
 */
function calendrierCarte(paquet, jour, dateEvaluation) {
  const fin = dateEvaluation || Dates.ajouter(jour, 60);
  const passages = [jour];
  let etat = { ...nouvelleCarte('simulation') };
  let date = jour;
  // Toujours réussie, notée « Bien » en SM-2. La date d'évaluation passée en
  // paramètre l'emporte sur celle enregistrée : la frise suit la saisie.
  const reglage = ReglagesPaquet.de(paquet);
  for (let i = 0; i < 40; i += 1) {
    etat = reglage.algorithme === 'sm2'
      ? appliquerSM2(etat, 'bien', date, dateEvaluation)
      : Leitner.appliquer(etat, true, date, reglage.intervalles, dateEvaluation);
    if (etat.echeance >= fin) break;
    date = etat.echeance;
    passages.push(date);
  }
  return { passages, fin };
}

/* ---------- Bibliothèque personnelle ---------- */

const Bibliotheque = {
  /** Clés des paquets ajoutés (intégrés ou publiés par un enseignant). */
  adoptes: null,

  async charger() {
    const stocke = await Depot.lire('bibliotheque');
    this.adoptes = stocke && Array.isArray(stocke.paquets) ? stocke.paquets : null;
  },

  /** Tant que l'élève n'a rien choisi : les paquets intégrés de son niveau. */
  cles() {
    if (this.adoptes) return this.adoptes;
    return Paquets.liste.filter((p) => p.origine === 'integre'
      && (!Profil.niveau || p.niveaux.includes(Profil.niveau))).map((p) => p.cle);
  },

  contient(cle) {
    const paquet = Paquets.get(cle);
    if (paquet && paquet.proprietaire) return true;
    return this.cles().includes(cle);
  },

  /** Paquets de la bibliothèque, ses propres paquets en tête. */
  paquets() {
    const miens = Paquets.liste.filter((p) => p.proprietaire);
    const adoptes = this.cles().map((cle) => Paquets.get(cle)).filter((p) => p && !p.proprietaire);
    return [...miens, ...adoptes];
  },

  async enregistrer(cles) {
    this.adoptes = [...new Set(cles)];
    await Depot.ecrire('bibliotheque', { paquets: this.adoptes });
  },

  async ajouter(cle) {
    await this.enregistrer([...this.cles(), cle]);
  },

  async retirer(cle) {
    await this.enregistrer(this.cles().filter((c) => c !== cle));
  },
};

/* ---------- Modèles de cartes ---------- */

const MODELES = {
  simple: {
    titre: 'Question → réponse',
    resume: 'La carte classique : on se pose la question, on retourne.',
    icone: 'Q→R',
  },
  double: {
    titre: 'Dans les deux sens',
    resume: 'Deux cartes en une : mot ↔ définition, nom ↔ formule.',
    icone: 'A⇄B',
  },
  qcm: {
    titre: 'QCM',
    resume: 'Une bonne réponse et jusqu’à sept pièges que tu choisis.',
    icone: 'ABCD',
  },
  saisie: {
    titre: 'Réponse à écrire',
    resume: 'Il faudra taper la réponse exacte : un mot, un nombre.',
    icone: 'Aa_',
  },
  masques: {
    titre: 'Photo à trous',
    resume: 'Photographie ta fiche, cache des zones : une carte par zone.',
    icone: '▦?',
  },
};

const COULEURS_PAQUET = ['#1B2A4A', '#E8792E', '#3FA9F5', '#2E9E6A', '#8A4FD8', '#D64570', '#C9A227', '#56647D'];

function texteCourt(valeur, max) {
  return String(valeur ?? '').replace(/\r\n/g, '\n').trim().slice(0, max);
}

/** Nettoie le contenu d'une carte avant envoi : rien d'autre que les champs prévus. */
function nettoyerContenu(modele, source) {
  const contenu = {
    recto: texteCourt(source.recto, 1000),
    verso: texteCourt(source.verso, 1500),
    aide: texteCourt(source.aide, 600),
  };
  for (const cle of ['photoRecto', 'photoVerso', 'photo']) {
    if (typeof source[cle] === 'string' && source[cle]) contenu[cle] = source[cle].slice(0, 200);
  }
  if (modele === 'qcm') {
    contenu.faux = (source.faux || []).map((f) => texteCourt(f, 200)).filter(Boolean).slice(0, 7);
  }
  if (modele === 'saisie') {
    contenu.acceptees = (source.acceptees || []).map((f) => texteCourt(f, 200)).filter(Boolean).slice(0, 10);
  }
  if (modele === 'masques') {
    const borne = (v) => Math.min(1, Math.max(0, Math.round(Number(v) * 10000) / 10000));
    contenu.zones = (source.zones || []).slice(0, 40).map((z) => ({ x: borne(z.x), y: borne(z.y), l: borne(z.l), h: borne(z.h) }))
      .filter((z) => z.l > 0.005 && z.h > 0.005);
  }
  return contenu;
}

/** Photos référencées par une ligne de carte. */
function photosDeLigne(ligne) {
  const c = ligne.contenu || {};
  return [c.photoRecto, c.photoVerso, c.photo].filter(Boolean);
}

/** Une ligne leitner_cartes → une ou plusieurs cartes de révision. */
function cartesDeLigne(ligne) {
  const c = ligne.contenu || {};
  const commun = { source: ligne.id, aide: c.aide || null };
  const courte = (texte) => Boolean(texte) && texte.length <= 90 && !texte.includes('\n');
  const formatsTexte = (reponse, photo) => (courte(reponse) && !photo ? ['retournement', 'qcm'] : ['retournement']);

  switch (ligne.modele) {
    case 'double':
      return [
        { ...commun, id: ligne.id, question: c.recto, reponse: c.verso, photoQuestion: c.photoRecto,
          photoReponse: c.photoVerso, formats: formatsTexte(c.verso, c.photoVerso) },
        { ...commun, id: `${ligne.id}~inverse`, question: c.verso, reponse: c.recto, photoQuestion: c.photoVerso,
          photoReponse: c.photoRecto, formats: formatsTexte(c.recto, c.photoRecto), inverse: true },
      ];
    case 'qcm':
      return [{ ...commun, id: ligne.id, question: c.recto, reponse: c.verso, photoQuestion: c.photoRecto,
        distracteurs: c.faux || [], formats: ['qcm', 'retournement'] }];
    case 'saisie': {
      const nombre = nombreSaisi(c.verso);
      const carte = { ...commun, id: ligne.id, question: c.recto, reponse: c.verso, photoQuestion: c.photoRecto,
        saisie: c.acceptees || [], formats: ['saisie', 'retournement'] };
      if (nombre !== null && !(c.acceptees || []).length) carte.nombre = nombre;
      return [carte];
    }
    case 'masques':
      return (c.zones || []).map((zone, index) => ({
        ...commun,
        id: `${ligne.id}#${index}`,
        question: c.recto || '',
        reponse: '',
        masque: { photo: c.photo, zones: c.zones, index },
        formats: ['retournement'],
      }));
    default:
      return [{ ...commun, id: ligne.id, question: c.recto, reponse: c.verso, photoQuestion: c.photoRecto,
        photoReponse: c.photoVerso, formats: formatsTexte(c.verso, c.photoVerso) }];
  }
}

/** Le QCM a besoin d'au moins trois pièges : ceux de la carte, sinon le paquet. */
function convertirPaquet(ligne, lignesCartes, { origine, proprietaire }) {
  const cartes = lignesCartes
    .filter((c) => c.paquet_id === ligne.id)
    .sort((a, b) => a.ordre - b.ordre || a.cree_le.localeCompare(b.cree_le))
    .flatMap(cartesDeLigne)
    .map((carte) => ({ ...carte, qcm: carte.formats.includes('qcm') }));
  const reglages = ligne.reglages || {};
  return {
    cle: `p:${ligne.id}`,
    id: ligne.id,
    titre: ligne.titre,
    resume: ligne.description || '',
    theme: ligne.theme || '',
    couleur: ligne.couleur || '',
    niveaux: ligne.niveaux || [],
    public: ligne.public,
    auteur: ligne.auteur,
    origine,
    proprietaire,
    intervalles: intervallesValides(reglages.intervalles) || INTERVALLES_CONTENU,
    maj: ligne.maj_le,
    sections: [{ cle: 'cartes', titre: 'Toutes les cartes', consigne: null, cartes }],
  };
}

/* ---------- Paquets en ligne ---------- */

const COLONNES_PAQUET = 'id,auteur,titre,theme,description,couleur,public,niveaux,reglages,cree_le,maj_le';
const COLONNES_CARTE = 'id,paquet_id,auteur,modele,contenu,ordre,cree_le,maj_le';

const Perso = {
  /** Réinscrit dans Paquets les paquets en ligne de la copie locale. */
  inscrire() {
    for (const paquet of [...Paquets.liste]) if (paquet.origine !== 'integre') Paquets.retirer(paquet.cle);
    const { paquets, cartes, publics, cartesPubliques } = Depot.contenu;
    const uid = Depot.uid;
    for (const ligne of paquets) {
      Paquets.inscrire(convertirPaquet(ligne, cartes, { origine: ligne.public ? 'prof' : 'perso', proprietaire: true }));
    }
    for (const ligne of publics) {
      if (ligne.auteur === uid) continue;
      Paquets.inscrire(convertirPaquet(ligne, cartesPubliques, { origine: 'prof', proprietaire: false }));
    }
  },

  /** Récupère ses paquets et ceux de la bibliothèque commune qu'on a ajoutés. */
  async synchroniser() {
    if (!Depot.uid) return;
    const uid = Depot.uid;
    const adoptes = Bibliotheque.cles().filter((c) => c.startsWith('p:')).map((c) => c.slice(2))
      .filter((id) => /^[0-9a-f-]{36}$/.test(id));
    const [paquets, cartes] = await Promise.all([
      Nuage.tout(`leitner_paquets?select=${COLONNES_PAQUET}&auteur=eq.${uid}&order=cree_le`),
      Nuage.tout(`leitner_cartes?select=${COLONNES_CARTE}&auteur=eq.${uid}&order=ordre,cree_le`),
    ]);
    let publics = [];
    let cartesPubliques = [];
    if (adoptes.length) {
      const liste = adoptes.join(',');
      [publics, cartesPubliques] = await Promise.all([
        Nuage.tout(`leitner_paquets?select=${COLONNES_PAQUET}&public=eq.true&id=in.(${liste})`),
        Nuage.tout(`leitner_cartes?select=${COLONNES_CARTE}&paquet_id=in.(${liste})&order=ordre,cree_le`),
      ]);
    }
    if (Depot.uid !== uid) return;
    await Depot.enregistrerContenu({ paquets, cartes, publics, cartesPubliques });
    this.inscrire();
  },

  /** Paquets publiés par les enseignants, avec leur nombre de cartes. */
  async catalogue() {
    return Nuage.tout(`leitner_paquets?select=${COLONNES_PAQUET},leitner_cartes(count)&public=eq.true&order=theme,titre`);
  },

  /** Aperçu des cartes d'un paquet public, avant de l'ajouter. */
  async cartesPubliques(id) {
    return Nuage.tout(`leitner_cartes?select=${COLONNES_CARTE}&paquet_id=eq.${id}&order=ordre,cree_le`);
  },

  ligne(id) {
    return Depot.contenu.paquets.find((p) => p.id === id) || null;
  },

  lignesCartes(paquetId) {
    return Depot.contenu.cartes
      .filter((c) => c.paquet_id === paquetId)
      .sort((a, b) => a.ordre - b.ordre || a.cree_le.localeCompare(b.cree_le));
  },

  themes() {
    const themes = new Set(Paquets.liste.map((p) => p.theme).filter(Boolean));
    return [...themes].sort(comparerFr);
  },

  /* Chaque écriture met à jour la copie locale à partir de la réponse du
   * serveur : on n'affiche que ce qui a vraiment été enregistré. */

  async enregistrerPaquet(id, donnees) {
    const corps = {
      titre: texteCourt(donnees.titre, 80) || 'Sans titre',
      theme: texteCourt(donnees.theme, 60),
      description: texteCourt(donnees.description, 400),
      couleur: COULEURS_PAQUET.includes(donnees.couleur) ? donnees.couleur : '',
      public: Boolean(donnees.public && Nuage.compte() && Nuage.compte().prof),
      niveaux: (donnees.niveaux || []).filter((n) => NIVEAUX.some(([v]) => v === n)),
    };
    if (donnees.intervalles !== undefined) {
      corps.reglages = donnees.intervalles ? { intervalles: intervallesValides(donnees.intervalles) } : {};
    }
    const contenu = Depot.contenu;
    let ligne;
    if (id) {
      [ligne] = await Nuage.api(`leitner_paquets?id=eq.${id}&select=${COLONNES_PAQUET}`, {
        method: 'PATCH', corps, prefer: 'return=representation',
      });
      contenu.paquets = contenu.paquets.map((p) => (p.id === id ? ligne : p));
    } else {
      [ligne] = await Nuage.api(`leitner_paquets?select=${COLONNES_PAQUET}`, {
        method: 'POST', corps: { ...corps, auteur: Depot.uid }, prefer: 'return=representation',
      });
      contenu.paquets = [...contenu.paquets, ligne];
    }
    await Depot.enregistrerContenu(contenu);
    this.inscrire();
    return ligne;
  },

  async supprimerPaquet(id) {
    const photos = this.lignesCartes(id).flatMap(photosDeLigne);
    await Nuage.api(`leitner_paquets?id=eq.${id}`, { method: 'DELETE', prefer: 'return=minimal' });
    const contenu = Depot.contenu;
    contenu.paquets = contenu.paquets.filter((p) => p.id !== id);
    contenu.cartes = contenu.cartes.filter((c) => c.paquet_id !== id);
    await Depot.enregistrerContenu(contenu);
    await Photos.supprimer(photos);
    this.inscrire();
  },

  async enregistrerCarte(paquetId, id, modele, source) {
    const contenu = nettoyerContenu(modele, source);
    const store = Depot.contenu;
    let ligne;
    if (id) {
      const avant = store.cartes.find((c) => c.id === id);
      [ligne] = await Nuage.api(`leitner_cartes?id=eq.${id}&select=${COLONNES_CARTE}`, {
        method: 'PATCH', corps: { modele, contenu }, prefer: 'return=representation',
      });
      store.cartes = store.cartes.map((c) => (c.id === id ? ligne : c));
      // Photos remplacées ou retirées : on libère la place.
      if (avant) {
        const gardees = new Set(photosDeLigne(ligne));
        await Photos.supprimer(photosDeLigne(avant).filter((p) => !gardees.has(p)));
      }
    } else {
      const ordre = this.lignesCartes(paquetId).reduce((m, c) => Math.max(m, c.ordre), 0) + 1;
      [ligne] = await Nuage.api(`leitner_cartes?select=${COLONNES_CARTE}`, {
        method: 'POST', corps: { paquet_id: paquetId, auteur: Depot.uid, modele, contenu, ordre }, prefer: 'return=representation',
      });
      store.cartes = [...store.cartes, ligne];
    }
    await Depot.enregistrerContenu(store);
    this.inscrire();
    return ligne;
  },

  /** Création en lot (import de texte). */
  async creerCartes(paquetId, liste) {
    const store = Depot.contenu;
    let ordre = this.lignesCartes(paquetId).reduce((m, c) => Math.max(m, c.ordre), 0);
    const corps = liste.map(({ modele, contenu }) => {
      ordre += 1;
      return { paquet_id: paquetId, auteur: Depot.uid, modele, contenu: nettoyerContenu(modele, contenu), ordre };
    });
    const lignes = [];
    for (let i = 0; i < corps.length; i += 200) {
      lignes.push(...await Nuage.api(`leitner_cartes?select=${COLONNES_CARTE}`, {
        method: 'POST', corps: corps.slice(i, i + 200), prefer: 'return=representation',
      }));
    }
    store.cartes = [...store.cartes, ...lignes];
    await Depot.enregistrerContenu(store);
    this.inscrire();
    return lignes.length;
  },

  async supprimerCarte(id) {
    const store = Depot.contenu;
    const ligne = store.cartes.find((c) => c.id === id);
    await Nuage.api(`leitner_cartes?id=eq.${id}`, { method: 'DELETE', prefer: 'return=minimal' });
    store.cartes = store.cartes.filter((c) => c.id !== id);
    await Depot.enregistrerContenu(store);
    if (ligne) await Photos.supprimer(photosDeLigne(ligne));
    this.inscrire();
  },
};
