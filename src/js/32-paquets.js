/* Paquets de cartes de contenu, progression et session de révision associée.
 *
 * Les cartes vivent dans le code (33-…, 34-…) et jamais en base : ce ne sont
 * pas des données personnelles, et elles se mettent à jour avec l'application.
 * Seule la progression est stockée, dans le magasin « progression ».
 *
 * RÈGLE ABSOLUE : un identifiant de carte ne change jamais. La progression des
 * élèves y est attachée ; renommer un identifiant efface leur travail sur cette
 * carte. Pour corriger une carte, on modifie son texte, pas son identifiant ;
 * pour la remplacer vraiment, on en crée une nouvelle.
 *
 * Une carte :
 *   id            identifiant définitif
 *   question      énoncé ; les formules y sont écrites en texte simple
 *   reponse       réponse de référence, affichée après coup
 *   aide          explication facultative, affichée avec la réponse
 *   saisie        [] autres formulations acceptées à l'écrit
 *   nombre        réponse numérique attendue, comparée avec une tolérance
 *   unite         unité rappelée à côté du champ de saisie
 *   distracteurs  [] fausses réponses du QCM ; sinon, prises dans la section
 *   qcm: false    interdit le QCM pour cette carte
 *   generer()     carte générative : renvoie { question, reponse, nombre|saisie }
 */

const FORMATS = {
  mixte: 'Défis variés',
  retournement: 'Carte retournée',
  qcm: 'QCM',
  saisie: 'À écrire',
};

/** Rythme par défaut des paquets de contenu : plus étalé que le trombinoscope,
 *  parce qu'une notion doit tenir jusqu'à l'examen, pas jusqu'au prochain cours. */
const INTERVALLES_CONTENU = [1, 3, 7, 14, 30];

const Paquets = {
  liste: [],
  index: new Map(),

  /** Enregistre un paquet et relie chaque carte à sa section. */
  inscrire(paquet) {
    const complet = { intervalles: INTERVALLES_CONTENU, ...paquet, cartes: [] };
    for (const section of complet.sections) {
      section.paquet = complet.cle;
      for (const carte of section.cartes) {
        if (this.index.has(carte.id)) throw new Error('Identifiant de carte en double : ' + carte.id);
        carte.paquet = complet.cle;
        carte.section = section.cle;
        this.index.set(carte.id, carte);
        complet.cartes.push(carte);
      }
    }
    this.liste.push(complet);
    return complet;
  },

  get(cle) {
    return this.liste.find((p) => p.cle === cle) || null;
  },

  section(paquet, cleSection) {
    return paquet.sections.find((s) => s.cle === cleSection) || null;
  },

  pourNiveau(niveau) {
    return this.liste.filter((p) => !niveau || p.niveaux.includes(niveau));
  },

  /** Cartes d'un paquet, ou d'une seule de ses sections. */
  cartesDe(paquet, cleSection = null) {
    if (!cleSection) return paquet.cartes;
    const section = this.section(paquet, cleSection);
    return section ? section.cartes : [];
  },

  /** Formats praticables pour une carte donnée. */
  formatsDe(carte) {
    const formats = ['retournement'];
    if (carte.qcm !== false && !carte.generer) formats.push('qcm');
    if (carte.generer || carte.nombre !== undefined || (carte.saisie && carte.saisie.length)) formats.push('saisie');
    return formats;
  },

  /** Le QCM a besoin de trois fausses réponses crédibles : celles de la carte,
   *  sinon celles de sa section, et à défaut celles du paquet entier. */
  distracteurs(carte) {
    if (carte.distracteurs && carte.distracteurs.length >= 3) {
      return melanger([...carte.distracteurs]).slice(0, 3);
    }
    const paquet = this.get(carte.paquet);
    const reponses = (liste) => melanger([...new Set(liste
      .filter((c) => c.id !== carte.id && c.reponse && c.reponse !== carte.reponse)
      .map((c) => c.reponse))]);
    const voisines = reponses(this.cartesDe(paquet, carte.section));
    return (voisines.length >= 3 ? voisines : reponses(paquet.cartes)).slice(0, 3);
  },

  /** Formats proposables pour un ensemble de cartes. */
  formatsCommuns(cartes) {
    const presents = new Set();
    for (const carte of cartes) for (const format of this.formatsDe(carte)) presents.add(format);
    // Le QCM a besoin de distracteurs crédibles pris dans la même sélection.
    const qcmables = cartes.filter((c) => c.qcm !== false && !c.generer);
    const autonomes = qcmables.filter((c) => c.distracteurs && c.distracteurs.length >= 3);
    if (qcmables.length < 4 && !autonomes.length) presents.delete('qcm');
    const simples = Object.keys(FORMATS).filter((f) => f !== 'mixte' && presents.has(f));
    return simples.length > 1 ? ['mixte', ...simples] : simples;
  },
};

/* ---------- Progression sur les cartes de contenu ---------- */

const Progression = {
  cartes: new Map(),

  async charger() {
    const liste = await Base.lireTout('progression');
    this.cartes = new Map(liste.map((c) => [String(c.id), nettoyerCarte(c)]));
  },

  /** Une carte jamais révisée n'est pas écrite en base. */
  obtenir(id) {
    return this.cartes.get(id) || nouvelleCarte(id);
  },

  etats(cartes) {
    return cartes.map((c) => this.obtenir(c.id));
  },

  async enregistrer(carte) {
    await Base.modifier({ ecritures: { progression: [carte] } });
    this.cartes.set(carte.id, carte);
  },

  async remettreAZero(cartes) {
    const ids = cartes.map((c) => c.id).filter((id) => this.cartes.has(id));
    if (!ids.length) return 0;
    await Base.modifier({ suppressions: { progression: ids } });
    for (const id of ids) this.cartes.delete(id);
    return ids.length;
  },

  /** Répartition dans les cinq compartiments, pour les écrans de suivi. */
  repartition(cartes) {
    const compte = [0, 0, 0, 0, 0];
    let jamaisVues = 0;
    for (const etat of this.etats(cartes)) {
      if (etat.introduite === null) jamaisVues += 1;
      else compte[etat.compartiment - 1] += 1;
    }
    return { compte, jamaisVues, total: cartes.length, acquises: compte[4] };
  },
};

/* ---------- Quota quotidien de nouvelles cartes, par paquet ---------- */

const SuiviContenu = {
  donnees: {},

  async charger() {
    this.donnees = (await Base.lireMeta('contenu')) || {};
  },

  pour(cle) {
    return this.donnees[cle] || { nouvelles: null };
  },

  async noterNouvelles(cle, jour) {
    const courant = this.pour(cle).nouvelles;
    const n = (courant && courant.date === jour ? courant.n : 0) + 1;
    this.donnees[cle] = { ...this.pour(cle), nouvelles: { date: jour, n } };
    await Base.ecrireMeta('contenu', this.donnees);
  },

  quotaNouvelles(paquet, jour) {
    const courant = this.pour(paquet.cle).nouvelles;
    const deja = courant && courant.date === jour ? courant.n : 0;
    return Math.max(0, Profil.donnees.nouvellesParJour - deja);
  },
};

/* ---------- Session de révision de contenu ---------- */

const SessionContenu = {
  active: null,

  /**
   * type 'jour'  : cartes dues, puis nouvelles dans la limite du quota ;
   * type 'libre' : toute la sélection, les plus fragiles d'abord.
   *
   * Dans les deux cas, seules les cartes réellement dues (ou nouvelles dans le
   * quota) modifient les compartiments : reprendre dix fois la même carte dans
   * la journée ne la propulse pas artificiellement au compartiment 5.
   */
  demarrer({ paquet, section = null, format, type = 'jour' }) {
    this.active = {
      id: nouvelId(),
      paquet,
      section,
      format,
      type,
      jour: Dates.aujourdhui(),
      vues: new Set(),
      lot: 0,
      file: [],
      position: 0,
      resultats: [],
    };
    return this.chargerLot();
  },

  /** Situation du jour pour une sélection de cartes. */
  bilan(paquet, section, jour = Dates.aujourdhui()) {
    const cartes = Paquets.cartesDe(paquet, section);
    return Leitner.bilanListe(Progression.etats(cartes), jour, SuiviContenu.quotaNouvelles(paquet, jour));
  },

  chargerLot() {
    const s = this.active;
    const taille = Profil.donnees.tailleSession;
    const bilan = this.bilan(s.paquet, s.section, s.jour);
    const aNoter = new Set([...bilan.dues, ...bilan.nouvelles.slice(0, bilan.nouvellesDuJour)].map((c) => c.id));

    let ids;
    if (s.type === 'jour') {
      ids = [...aNoter].filter((id) => !s.vues.has(id)).slice(0, taille);
    } else {
      let restantes = Leitner.trierParFragilite(bilan.cartes).filter((c) => !s.vues.has(c.id));
      if (!restantes.length) {
        s.vues.clear();
        restantes = Leitner.trierParFragilite(bilan.cartes);
      }
      ids = restantes.slice(0, taille).map((c) => c.id);
    }
    melanger(ids);

    s.file = ids.map((id) => this.preparer(id, aNoter.has(id)));
    s.position = 0;
    s.resultats = [];
    s.lot += 1;
    for (const id of ids) s.vues.add(id);
    return ids.length;
  },

  /** Fige l'énoncé d'une carte pour ce passage : une carte générative tire des
   *  valeurs neuves à chaque apparition, sinon l'élève mémorise le résultat
   *  au lieu d'apprendre la conversion. */
  preparer(id, compte, reprises = 0) {
    const carte = Paquets.index.get(id);
    const formats = Paquets.formatsDe(carte);
    const format = this.active.format === 'mixte'
      ? formats[Math.floor(Math.random() * formats.length)]
      : (formats.includes(this.active.format) ? this.active.format : 'retournement');
    return {
      id,
      compte,
      reprises,
      reprise: reprises > 0,
      format,
      tirage: carte.generer ? carte.generer() : null,
    };
  },

  elementCourant() {
    const s = this.active;
    return s && s.position < s.file.length ? s.file[s.position] : null;
  },

  /** Cartes que « continuer » proposerait encore. */
  restant() {
    const s = this.active;
    if (!s) return 0;
    const bilan = this.bilan(s.paquet, s.section, s.jour);
    if (s.type === 'jour') {
      const aNoter = [...bilan.dues, ...bilan.nouvelles.slice(0, bilan.nouvellesDuJour)];
      return aNoter.filter((c) => !s.vues.has(c.id)).length;
    }
    return bilan.cartes.length;
  },

  async repondre(reussi) {
    const s = this.active;
    const element = this.elementCourant();
    if (!element) return;

    if (!element.reprise) {
      const carte = Paquets.index.get(element.id);
      const enonce = element.tirage || carte;
      s.resultats.push({ id: element.id, reussi, question: enonce.question, reponse: enonce.reponse });
      if (element.compte) {
        const etat = Progression.obtenir(element.id);
        const nouvelle = etat.introduite === null;
        // Conservé pour permettre de rejouer la notation si l'élève conteste.
        element.etatAvant = etat;
        await Progression.enregistrer(Leitner.appliquer(etat, reussi, s.jour, s.paquet.intervalles));
        if (nouvelle) await SuiviContenu.noterNouvelles(s.paquet.cle, s.jour);
      }
    }
    // Une carte ratée revient en fin de lot, sans nouvelle notation.
    if (!reussi && element.reprises < MAX_REPRISES) {
      s.file.push(this.preparer(element.id, false, element.reprises + 1));
    }
    s.position += 1;
  },

  arreter() {
    this.active = null;
  },
};
