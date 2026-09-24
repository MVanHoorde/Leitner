/* État de l'application en mémoire, synchronisé avec IndexedDB. */

const REGLAGES_DEFAUT = Object.freeze({
  nouvellesParJour: 15,
  tailleSession: 20,
  plafondRetard: 40,
  objectif: null,
  modeRevision: 'photo',
  decalageJours: 0,
});

const SUIVI_DEFAUT = Object.freeze({
  premierImport: null,
  persistanceDemandee: false,
  /** Première session du jour : { date, id }. Les suivantes sont en entraînement libre. */
  sessionAlgo: null,
  /** Nouvelles cartes introduites : { date, n }. */
  nouvellesDuJour: null,
});

const MOTIF_PHOTO = /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/;

/**
 * Liste blanche : seuls id, nom, prénom, classe et photo d'un élève
 * sont conservés. Tout autre champ (date de naissance, téléphone,
 * entreprise…) est écarté ici, avant toute écriture en base.
 */
function nettoyerEleve(source) {
  const texte = (valeur) => String(valeur ?? '').replace(/\s+/g, ' ').trim().slice(0, 80);
  return {
    id: typeof source.id === 'string' && source.id ? source.id : nouvelId(),
    nom: texte(source.nom),
    prenom: texte(source.prenom),
    classe: texte(source.classe),
    photo: typeof source.photo === 'string' && MOTIF_PHOTO.test(source.photo) ? source.photo : '',
  };
}

/** Valide une carte venant d'une sauvegarde. */
function nettoyerCarte(source) {
  const date = (v) => (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : null);
  const entier = (v, min, max, defaut) => (Number.isInteger(v) ? Math.min(max, Math.max(min, v)) : defaut);
  const introduite = date(source.introduite);
  return {
    id: String(source.id),
    compartiment: entier(source.compartiment, 1, 5, 1),
    introduite,
    echeance: introduite ? (date(source.echeance) || introduite) : null,
    passages: entier(source.passages, 0, 1e6, 0),
    reussites: entier(source.reussites, 0, 1e6, 0),
    dernierPassage: date(source.dernierPassage),
    dernierEchec: date(source.dernierEchec),
  };
}

function nouvelleCarte(id) {
  return {
    id,
    compartiment: 1,
    introduite: null,
    echeance: null,
    passages: 0,
    reussites: 0,
    dernierPassage: null,
    dernierEchec: null,
  };
}

async function demanderPersistance() {
  if (!navigator.storage || !navigator.storage.persist) return false;
  try {
    if (await navigator.storage.persisted()) return true;
    return await navigator.storage.persist();
  } catch {
    return false;
  }
}

const Etat = {
  eleves: new Map(),
  cartes: new Map(),
  reglages: { ...REGLAGES_DEFAUT },
  suivi: { ...SUIVI_DEFAUT },
  /** Classe choisie dans le filtre, partagée par tous les écrans. */
  filtreClasse: null,

  /** Réglages et suivi : lisibles avant le déverrouillage (aucune donnée personnelle). */
  async chargerMeta() {
    const [reglages, suivi] = await Promise.all([Base.lireMeta('reglages'), Base.lireMeta('suivi')]);
    this.reglages = { ...REGLAGES_DEFAUT, ...reglages };
    this.suivi = { ...SUIVI_DEFAUT, ...suivi };
  },

  /** Élèves et cartes : nécessitent la clé de déchiffrement. */
  async chargerDonnees() {
    const [eleves, cartes] = await Promise.all([Base.lireTout('eleves'), Base.lireTout('cartes')]);
    this.eleves = new Map(eleves.map((e) => [e.id, e]));
    this.cartes = new Map(cartes.map((c) => [c.id, c]));

    const manquantes = eleves.filter((e) => !this.cartes.has(e.id)).map((e) => nouvelleCarte(e.id));
    if (manquantes.length) {
      await Base.modifier({ ecritures: { cartes: manquantes } });
      for (const c of manquantes) this.cartes.set(c.id, c);
    }
  },

  classes() {
    const noms = new Set();
    for (const e of this.eleves.values()) if (e.classe) noms.add(e.classe);
    return [...noms].sort(comparerFr);
  },

  listeEleves(classe = null) {
    return [...this.eleves.values()]
      .filter((e) => !classe || e.classe === classe)
      .sort((a, b) => comparerFr(a.nom, b.nom) || comparerFr(a.prenom, b.prenom));
  },

  async ajouterEleves(sources) {
    const eleves = sources.map(nettoyerEleve);
    const cartes = eleves.map((e) => nouvelleCarte(e.id));
    await Base.modifier({ ecritures: { eleves, cartes } });
    for (const e of eleves) this.eleves.set(e.id, e);
    for (const c of cartes) this.cartes.set(c.id, c);
    if (!this.suivi.premierImport) await this.enregistrerSuivi({ premierImport: Dates.aujourdhui() });
    demanderPersistance();
    return eleves;
  },

  async modifierEleve(source) {
    const eleve = nettoyerEleve(source);
    await Base.modifier({ ecritures: { eleves: [eleve] } });
    this.eleves.set(eleve.id, eleve);
    return eleve;
  },

  async supprimerEleve(id) {
    await Base.modifier({ suppressions: { eleves: [id], cartes: [id] } });
    this.eleves.delete(id);
    this.cartes.delete(id);
  },

  /** Oublie les données déchiffrées (verrouillage). */
  viderDonnees() {
    this.eleves = new Map();
    this.cartes = new Map();
    this.filtreClasse = null;
  },

  /**
   * Restaure une sauvegarde. mode 'remplacer' : efface d'abord toutes les données ;
   * mode 'ajouter' : fusionne (un même identifiant est remplacé).
   */
  async restaurer(contenu, mode) {
    const eleves = contenu.eleves.map(nettoyerEleve);
    const ids = new Set(eleves.map((e) => e.id));
    const cartesSauvees = new Map(contenu.cartes
      .filter((c) => c && ids.has(String(c.id)))
      .map((c) => [String(c.id), nettoyerCarte(c)]));
    const cartes = eleves.map((e) => cartesSauvees.get(e.id) || nouvelleCarte(e.id));

    const suppressions = mode === 'remplacer'
      ? { eleves: [...this.eleves.keys()], cartes: [...this.cartes.keys()] }
      : {};
    const dates = [this.suivi.premierImport, contenu.suivi && contenu.suivi.premierImport]
      .filter((d) => typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d)).sort();
    const suivi = { ...this.suivi, premierImport: dates[0] || Dates.aujourdhui() };
    const metas = [{ cle: 'suivi', valeur: suivi }];
    let reglages = this.reglages;
    if (mode === 'remplacer' && contenu.reglages) {
      reglages = { ...REGLAGES_DEFAUT, ...contenu.reglages, decalageJours: this.reglages.decalageJours };
      metas.push({ cle: 'reglages', valeur: reglages });
    }

    await Base.modifier({ ecritures: { eleves, cartes }, suppressions, metas });
    if (mode === 'remplacer') this.viderDonnees();
    for (const e of eleves) this.eleves.set(e.id, e);
    for (const c of cartes) this.cartes.set(c.id, c);
    this.suivi = suivi;
    this.reglages = reglages;
    return eleves.length;
  },

  async enregistrerCarte(carte) {
    await Base.modifier({ ecritures: { cartes: [carte] } });
    this.cartes.set(carte.id, carte);
  },

  async enregistrerReglages(changements) {
    Object.assign(this.reglages, changements);
    await Base.ecrireMeta('reglages', { ...this.reglages });
  },

  async enregistrerSuivi(changements) {
    Object.assign(this.suivi, changements);
    await Base.ecrireMeta('suivi', { ...this.suivi });
  },
};
