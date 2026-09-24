/* Moteur Leitner et files de révision.
 *
 * La mécanique (compartiments, échéances, tri par fragilité) ne sait rien de ce
 * qu'il y a sur les cartes : elle sert aussi bien aux visages du trombinoscope
 * qu'aux paquets de contenu, qui apportent seulement leur propre rythme. */

/** Trombinoscope : calibré pour reconnaître une classe en trois semaines. */
const INTERVALLES = [1, 2, 3, 5, 8];
const SECONDES_PAR_CARTE = 8;
const MAX_REPRISES = 2;

const MODES = {
  photo: 'Photo → identité',
  identite: 'Identité → photo',
  qcm: 'QCM',
};

function estimerDuree(nombreCartes) {
  const minutes = Math.ceil((nombreCartes * SECONDES_PAR_CARTE) / 60);
  return nombreCartes === 0 ? '0 min' : `≈ ${minutes} min`;
}

const Leitner = {
  /** Résultat d'une réponse notée. Fonction pure. */
  appliquer(carte, reussi, jour, intervalles = INTERVALLES) {
    const compartiment = reussi ? Math.min(5, carte.compartiment + 1) : 1;
    return {
      ...carte,
      compartiment,
      introduite: carte.introduite ?? jour,
      echeance: Dates.ajouter(jour, intervalles[compartiment - 1]),
      passages: carte.passages + 1,
      reussites: carte.reussites + (reussi ? 1 : 0),
      dernierPassage: jour,
      dernierEchec: reussi ? carte.dernierEchec : jour,
    };
  },

  /** Nombre minimal de jours avant d'atteindre le compartiment 5 sans aucun échec. */
  joursAvantMaitrise(carte, jour) {
    if (carte.introduite === null) return INTERVALLES.slice(1, 4).reduce((a, b) => a + b, 0);
    if (carte.compartiment === 5) return 0;
    const attente = Math.max(0, Dates.ecart(jour, carte.echeance));
    return attente + INTERVALLES.slice(carte.compartiment, 4).reduce((a, b) => a + b, 0);
  },

  /** Révisions restantes (sans échec) pour atteindre le compartiment 5. */
  revisionsRestantes(carte) {
    if (carte.introduite === null) return 4;
    return 5 - carte.compartiment;
  },

  quotaNouvelles(jour) {
    const { nouvellesDuJour } = Etat.suivi;
    const dejaIntroduites = nouvellesDuJour && nouvellesDuJour.date === jour ? nouvellesDuJour.n : 0;
    return Math.max(0, Etat.reglages.nouvellesParJour - dejaIntroduites);
  },

  sessionAlgoFaite(jour) {
    return Boolean(Etat.suivi.sessionAlgo && Etat.suivi.sessionAlgo.date === jour);
  },

  cartesDeClasse(classe) {
    return Etat.listeEleves(classe).map((e) => Etat.cartes.get(e.id)).filter(Boolean);
  },

  /** Situation du jour pour n'importe quelle liste de cartes. Fonction pure. */
  bilanListe(cartes, jour, quotaNouvelles) {
    const dues = cartes
      .filter((c) => c.introduite !== null && c.echeance <= jour)
      .sort((a, b) => (a.echeance < b.echeance ? -1 : a.echeance > b.echeance ? 1 : a.compartiment - b.compartiment));
    const nouvelles = cartes.filter((c) => c.introduite === null);
    return {
      cartes,
      dues,
      enRetard: dues.filter((c) => c.echeance < jour).length,
      nouvelles,
      nouvellesDuJour: Math.min(quotaNouvelles, nouvelles.length),
    };
  },

  /** Situation du jour pour une classe (ou toutes). */
  bilan(classe, jour = Dates.aujourdhui()) {
    return {
      ...this.bilanListe(this.cartesDeClasse(classe), jour, this.quotaNouvelles(jour)),
      sessionAlgoFaite: this.sessionAlgoFaite(jour),
    };
  },


  /** Cartes les plus fragiles d'abord : compartiment bas, échec récent. */
  trierParFragilite(cartes) {
    const rang = (c) => (c.introduite === null ? 1.5 : c.compartiment);
    return [...cartes].sort((a, b) => rang(a) - rang(b)
      || (b.dernierEchec || '').localeCompare(a.dernierEchec || '')
      || (a.echeance || '').localeCompare(b.echeance || ''));
  },

  fileLibre(classe) {
    const cartes = this.cartesDeClasse(classe);
    const etudiees = cartes.filter((c) => c.introduite !== null);
    return this.trierParFragilite(etudiees.length ? etudiees : cartes).map((c) => c.id);
  },
};

/* ---------- Session de révision en cours ---------- */

const Session = {
  active: null,

  /**
   * type : 'jour' (algorithmique si c'est la première du jour), 'libre' ou 'cours'.
   */
  demarrer({ type, mode, classe, limiteDues = null }) {
    const jour = Dates.aujourdhui();
    const algo = type === 'jour' && !Leitner.sessionAlgoFaite(jour);
    this.active = {
      id: nouvelId(),
      type,
      mode,
      classe,
      algo,
      jour,
      limiteDues,
      duesPrises: 0,
      vues: new Set(),
      lot: 0,
      file: [],
      position: 0,
      resultats: [],
    };
    return this.chargerLot();
  },

  /** Cartes encore disponibles pour la session algorithmique : dues les plus anciennes, puis nouvelles. */
  resteAlgo() {
    const s = this.active;
    const b = Leitner.bilan(s.classe, s.jour);
    let dues = b.dues.filter((c) => !s.vues.has(c.id));
    if (s.limiteDues !== null) dues = dues.slice(0, Math.max(0, s.limiteDues - s.duesPrises));
    const nouvelles = b.nouvelles.filter((c) => !s.vues.has(c.id)).slice(0, b.nouvellesDuJour);
    return { dues: dues.map((c) => c.id), nouvelles: nouvelles.map((c) => c.id) };
  },

  /** Prépare le lot suivant. Renvoie le nombre de cartes ajoutées. */
  chargerLot() {
    const s = this.active;
    const taille = Etat.reglages.tailleSession;
    let ids;
    if (s.algo) {
      const { dues, nouvelles } = this.resteAlgo();
      ids = [...dues, ...nouvelles].slice(0, taille);
      s.duesPrises += ids.filter((id) => dues.includes(id)).length;
    } else {
      let candidats = Leitner.fileLibre(s.classe).filter((id) => !s.vues.has(id));
      if (!candidats.length) {
        s.vues.clear();
        candidats = Leitner.fileLibre(s.classe);
      }
      ids = s.type === 'cours' && s.lot === 0 ? candidats : candidats.slice(0, taille);
    }
    melanger(ids);
    s.file = ids.map((id) => ({ id, reprises: 0, reprise: false }));
    s.position = 0;
    s.resultats = [];
    s.lot += 1;
    for (const id of ids) s.vues.add(id);
    return ids.length;
  },

  /** Nombre de cartes que « continuer » proposerait. */
  restant() {
    const s = this.active;
    if (!s) return 0;
    if (s.algo) {
      const { dues, nouvelles } = this.resteAlgo();
      return dues.length + nouvelles.length;
    }
    return Leitner.fileLibre(s.classe).length;
  },

  elementCourant() {
    const s = this.active;
    return s && s.position < s.file.length ? s.file[s.position] : null;
  },

  async repondre(reussi) {
    const s = this.active;
    const element = this.elementCourant();
    if (!element) return;

    if (!element.reprise) {
      s.resultats.push({ id: element.id, reussi });
      const carte = Etat.cartes.get(element.id);
      if (s.algo && carte) {
        const nouvelle = carte.introduite === null;
        await Etat.enregistrerCarte(Leitner.appliquer(carte, reussi, s.jour));
        const suivi = {};
        if (!Leitner.sessionAlgoFaite(s.jour)) suivi.sessionAlgo = { date: s.jour, id: s.id };
        if (nouvelle) {
          const courant = Etat.suivi.nouvellesDuJour;
          suivi.nouvellesDuJour = { date: s.jour, n: (courant && courant.date === s.jour ? courant.n : 0) + 1 };
        }
        if (Object.keys(suivi).length) await Etat.enregistrerSuivi(suivi);
      }
    }
    // Une carte ratée revient en fin de lot, sans nouvelle notation.
    if (!reussi && element.reprises < MAX_REPRISES) {
      s.file.push({ id: element.id, reprises: element.reprises + 1, reprise: true });
    }
    s.position += 1;
  },

  arreter() {
    this.active = null;
  },
};
