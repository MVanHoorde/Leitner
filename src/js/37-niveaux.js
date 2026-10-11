/* Paquets à niveaux : une montée en compétence régulière.
 *
 * Les sections d'un paquet « progression: 'niveaux' » sont des niveaux,
 * ouverts un à un. Tout le monde commence au niveau 1, même un élève de
 * terminale : revoir ses bases ne coûte que quelques séances, parce qu'une
 * carte réussie du premier coup saute directement en boîte 3 (36-…,
 * appliquerReglages) et que le quota de nouvelles double tant que tout réussit.
 *
 * - Un niveau s'ouvre quand 80 % des cartes du précédent ont atteint la
 *   boîte 3 : réussies au moins deux fois, à quelques jours d'écart.
 * - Ou par un test de positionnement : 10 cartes du niveau suivant, 8 justes
 *   l'ouvrent tout de suite ; une tentative par niveau et par jour.
 * - Les cartes des niveaux franchis restent dans le circuit Leitner : elles
 *   reviennent à leur échéance, mêlées à celles du niveau en cours.
 * - Garde-fou : si plus d'un tiers des cartes vues d'un niveau franchi sont
 *   retombées en boîte 1, plus de nouvelle carte du niveau en cours tant que
 *   ce niveau n'est pas consolidé.
 *
 * Un niveau ouvert le reste. Rangé avec le profil (clé « niveaux »).
 */

const SEUIL_NIVEAU = 0.8;
const SEUIL_CONSOLIDATION = 1 / 3;
const TAILLE_TEST_NIVEAU = 10;
const REUSSITE_TEST_NIVEAU = 8;

const Niveaux = {
  /** { [clé du paquet]: { ouvert: index du plus haut niveau ouvert, tests: { [index]: date } } } */
  donnees: {},

  async charger() {
    this.donnees = (await Depot.lire('niveaux')) || {};
  },

  actif(paquet) {
    return Boolean(paquet && paquet.progression === 'niveaux');
  },

  suivi(paquet) {
    return this.donnees[paquet.cle] || { ouvert: 0, tests: {} };
  },

  async enregistrer(paquet, changements) {
    this.donnees = { ...this.donnees, [paquet.cle]: { ...this.suivi(paquet), ...changements } };
    await Depot.ecrire('niveaux', this.donnees);
  },

  /** Où en est chaque niveau : cartes, part en boîte 3 ou plus, part retombée en boîte 1. */
  detail(paquet) {
    return paquet.sections.map((section) => {
      const etats = Progression.etats(section.cartes);
      const vues = etats.filter((e) => e.introduite !== null);
      return {
        section,
        total: etats.length,
        vues: vues.length,
        maitrise: etats.length ? vues.filter((e) => e.compartiment >= 3).length / etats.length : 0,
        rechute: vues.length >= 5 ? vues.filter((e) => e.compartiment === 1).length / vues.length : 0,
      };
    });
  },

  /** Plus haut niveau ouvert : celui qu'on a enregistré, ou celui que la maîtrise atteint. */
  ouvert(paquet, detail = this.detail(paquet)) {
    let atteint = 0;
    while (atteint < detail.length - 1 && detail[atteint].maitrise >= SEUIL_NIVEAU) atteint += 1;
    return Math.min(detail.length - 1, Math.max(this.suivi(paquet).ouvert || 0, atteint));
  },

  /** Niveau franchi à consolider avant d'avancer, ou null. */
  aConsolider(paquet, detail = this.detail(paquet)) {
    const ouvert = this.ouvert(paquet, detail);
    return detail.slice(0, ouvert).find((n) => n.rechute > SEUIL_CONSOLIDATION) || null;
  },

  /** Enregistre un niveau nouvellement atteint ; renvoie sa section pour l'annoncer. */
  async verifier(paquet) {
    const ouvert = this.ouvert(paquet);
    if (ouvert <= (this.suivi(paquet).ouvert || 0)) return null;
    await this.enregistrer(paquet, { ouvert });
    return paquet.sections[ouvert];
  },

  /** Tant que l'élève réussit plus de 90 % de ses cartes récentes, les nouvelles arrivent deux fois plus vite. */
  accelere(etats, jour) {
    const semaine = Dates.ajouter(jour, -7);
    const recentes = etats.filter((e) => e.dernierPassage && e.dernierPassage >= semaine);
    const passages = recentes.reduce((n, e) => n + e.passages, 0);
    const reussites = recentes.reduce((n, e) => n + e.reussites, 0);
    return passages >= 10 && reussites / passages >= 0.9;
  },

  /** Bilan du jour (même forme que Leitner.bilanListe), limité aux niveaux ouverts. */
  bilan(paquet, jour = Dates.aujourdhui()) {
    const detail = this.detail(paquet);
    const ouvert = this.ouvert(paquet, detail);
    const consolider = this.aConsolider(paquet, detail);
    // Les nouvelles viennent dans l'ordre des niveaux : les bases d'abord.
    const sections = paquet.sections.slice(0, ouvert + 1);
    const etats = Progression.etats(sections.flatMap((s) => s.cartes));
    const parJour = ReglagesPaquet.nouvellesParJour(paquet, jour) * (this.accelere(etats, jour) ? 2 : 1);
    const courant = SuiviContenu.pour(paquet.cle).nouvelles;
    const quota = Math.max(0, parJour - (courant && courant.date === jour ? courant.n : 0));
    const bilan = Leitner.bilanListe(etats, jour, quota);
    if (consolider) {
      // Les cartes jamais vues des niveaux franchis restent permises, pas celles du niveau en cours.
      const enCours = new Set(paquet.sections[ouvert].cartes.map((c) => c.id));
      bilan.nouvelles = bilan.nouvelles.filter((e) => !enCours.has(e.id));
      bilan.nouvellesDuJour = Math.min(quota, bilan.nouvelles.length);
    }
    return bilan;
  },

  /** Niveau qu'un test de positionnement peut ouvrir aujourd'hui, ou null. */
  testPossible(paquet, jour = Dates.aujourdhui()) {
    const suivant = this.ouvert(paquet) + 1;
    if (suivant >= paquet.sections.length) return null;
    if ((this.suivi(paquet).tests || {})[suivant] === jour) return null;
    return suivant;
  },

  /**
   * Fin d'un test : 8 bonnes réponses sur 10 ouvrent le niveau, et les cartes
   * réussies y entrent directement en boîte 3. Renvoie { reussies, total, ouvert }.
   */
  async terminerTest(paquet, index, resultats, jour) {
    const reussies = resultats.filter((r) => r.reussi);
    const ouvert = reussies.length >= REUSSITE_TEST_NIVEAU;
    const tests = { ...(this.suivi(paquet).tests || {}), [index]: jour };
    if (ouvert) {
      for (const { id } of reussies) {
        const etat = Progression.obtenir(id);
        if (etat.introduite === null) await Progression.enregistrer(appliquerReglages(etat, true, jour, paquet));
      }
      await this.enregistrer(paquet, { tests, ouvert: Math.max(index, this.suivi(paquet).ouvert || 0) });
    } else {
      await this.enregistrer(paquet, { tests });
    }
    return { reussies: reussies.length, total: resultats.length, ouvert };
  },
};
