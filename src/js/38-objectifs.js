/* Objectifs de révision : plusieurs paquets révisés ensemble.
 *
 * Un objectif (bac blanc, contrôle commun…) réunit les paquets des chapitres
 * au programme. La séance tire les cartes de tous ces paquets, mélangées ;
 * chaque carte garde son paquet, donc son algorithme, son rythme, son quota
 * de nouvelles et sa progression : la réviser ici ou dans son paquet, c'est
 * la même chose. Une date d'évaluation posée sur l'objectif vaut pour tous
 * ses paquets.
 *
 * Rangés avec le profil (clé « objectifs ») : synchronisés avec le compte,
 * sans table supplémentaire.
 */

const Objectifs = {
  liste: [],

  async charger() {
    const stocke = await Depot.lire('objectifs');
    this.liste = stocke && Array.isArray(stocke.liste)
      ? stocke.liste.filter((o) => o && typeof o.id === 'string' && Array.isArray(o.cles))
      : [];
  },

  get(id) {
    return this.liste.find((o) => o.id === id) || null;
  },

  /** Paquets de l'objectif encore dans la bibliothèque. */
  paquets(objectif) {
    return objectif.cles.filter((cle) => Bibliotheque.contient(cle)).map((cle) => Paquets.get(cle)).filter(Boolean);
  },

  /** Dates d'évaluation (aujourd'hui compris) des objectifs qui contiennent ce paquet. */
  datesPour(cle, jour = Dates.aujourdhui()) {
    return this.liste
      .filter((o) => o.dateEvaluation && o.dateEvaluation >= jour && o.cles.includes(cle))
      .map((o) => o.dateEvaluation)
      .sort();
  },

  async enregistrer(source) {
    const objectif = {
      id: source.id || nouvelId(),
      titre: texteCourt(source.titre, 80) || 'Mon objectif',
      cles: [...new Set(source.cles)],
      dateEvaluation: /^\d{4}-\d{2}-\d{2}$/.test(source.dateEvaluation || '') ? source.dateEvaluation : null,
    };
    const existe = this.liste.some((o) => o.id === objectif.id);
    this.liste = existe ? this.liste.map((o) => (o.id === objectif.id ? objectif : o)) : [...this.liste, objectif];
    await Depot.ecrire('objectifs', { liste: this.liste });
    return objectif;
  },

  async supprimer(id) {
    this.liste = this.liste.filter((o) => o.id !== id);
    await Depot.ecrire('objectifs', { liste: this.liste });
  },
};
