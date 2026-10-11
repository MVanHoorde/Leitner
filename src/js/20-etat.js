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
 * Liste blanche : seuls id, nom, prénom, classe, groupes et photo d'un élève
 * sont conservés. Tout autre champ (date de naissance, téléphone,
 * entreprise…) est écarté ici, avant toute écriture en base.
 *
 * classe : la classe d'origine ; groupes : les autres classes ou groupes où
 * l'élève figure aussi (« TSP », un groupe de spécialité). Un même élève reste
 * une seule fiche et une seule carte Leitner, quel que soit le nombre de groupes.
 */
function nettoyerEleve(source) {
  const texte = (valeur) => String(valeur ?? '').replace(/\s+/g, ' ').trim().slice(0, 80);
  const classe = texte(source.classe);
  const groupes = [...new Set((Array.isArray(source.groupes) ? source.groupes : []).map(texte))]
    .filter((g) => g && g !== classe)
    .slice(0, 10);
  return {
    id: typeof source.id === 'string' && source.id ? source.id : nouvelId(),
    nom: texte(source.nom),
    prenom: texte(source.prenom),
    classe: classe || groupes.shift() || '',
    groupes,
    photo: typeof source.photo === 'string' && MOTIF_PHOTO.test(source.photo) ? source.photo : '',
  };
}

/** Toutes les classes et tous les groupes d'un élève, la classe d'origine en tête. */
function classesEleve(eleve) {
  return [eleve.classe, ...(eleve.groupes || [])].filter(Boolean);
}

/** « Terminale 3 · TSP » */
function libelleClasses(eleve) {
  return classesEleve(eleve).join(' · ');
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
    // SM-2 (36-bibliotheque.js) : facilité, délai courant, réussites d'affilée.
    ...(typeof source.ef === 'number' ? { ef: Math.min(3.5, Math.max(1.3, source.ef)) } : {}),
    ...(Number.isInteger(source.intervalle) ? { intervalle: entier(source.intervalle, 0, 3650, 0) } : {}),
    ...(Number.isInteger(source.repetitions) ? { repetitions: entier(source.repetitions, 0, 1e6, 0) } : {}),
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
    for (const e of this.eleves.values()) for (const c of classesEleve(e)) noms.add(c);
    return [...noms].sort(comparerFr);
  },

  listeEleves(classe = null) {
    return [...this.eleves.values()]
      .filter((e) => !classe || classesEleve(e).includes(classe))
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
    await this.supprimerEleves([id]);
  },

  /** Supprime des élèves et leurs cartes en une seule écriture. */
  async supprimerEleves(ids) {
    if (!ids.length) return;
    await Base.modifier({ suppressions: { eleves: ids, cartes: ids } });
    for (const id of ids) {
      this.eleves.delete(id);
      this.cartes.delete(id);
    }
    if (this.filtreClasse && !this.classes().includes(this.filtreClasse)) this.filtreClasse = null;
  },

  /** Renomme une classe ou un groupe ; vers un nom existant, les deux sont fusionnés. */
  async renommerClasse(ancienne, nouvelle) {
    const remplacer = (c) => (c === ancienne ? nouvelle : c);
    const eleves = this.listeEleves(ancienne).map((e) => nettoyerEleve({
      ...e, classe: remplacer(e.classe), groupes: (e.groupes || []).map(remplacer),
    }));
    await Base.modifier({ ecritures: { eleves } });
    for (const e of eleves) this.eleves.set(e.id, e);
    if (this.filtreClasse === ancienne) this.filtreClasse = nouvelle;
  },

  /**
   * Supprime une classe ou un groupe : un élève qui n'y figurait que là est
   * effacé ; un élève qui appartient aussi à un autre groupe y reste.
   */
  async supprimerClasse(classe) {
    const eleves = this.listeEleves(classe);
    const aEffacer = eleves.filter((e) => classesEleve(e).length === 1).map((e) => e.id);
    const aGarder = eleves.filter((e) => classesEleve(e).length > 1).map((e) => {
      const restantes = classesEleve(e).filter((c) => c !== classe);
      return nettoyerEleve({ ...e, classe: restantes[0], groupes: restantes.slice(1) });
    });
    if (aGarder.length) {
      await Base.modifier({ ecritures: { eleves: aGarder } });
      for (const e of aGarder) this.eleves.set(e.id, e);
    }
    await this.supprimerEleves(aEffacer);
    if (this.filtreClasse === classe) this.filtreClasse = null;
    return { effaces: aEffacer.length, gardes: aGarder.length };
  },

  /** Ajoute un élève déjà enregistré à une autre classe ou à un groupe. */
  async ajouterAuGroupe(id, groupe) {
    const eleve = this.eleves.get(id);
    if (!eleve || classesEleve(eleve).includes(groupe)) return eleve;
    return this.modifierEleve({ ...eleve, groupes: [...(eleve.groupes || []), groupe] });
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
