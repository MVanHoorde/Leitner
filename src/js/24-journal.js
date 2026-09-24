/* Journal des révisions de contenu, jour par jour.
 *
 * Trois compteurs par date : cartes vues, cartes justes, secondes passées.
 * C'est ce qui permet la régularité (séries de jours), le calendrier et une
 * estimation de durée fondée sur le rythme réel plutôt que sur une moyenne
 * inventée. Aucune donnée personnelle : des nombres et des dates.
 */

const JOURS_CONSERVES = 400;
/** Une carte laissée à l'écran ne doit pas gonfler le temps passé. */
const SECONDES_MAX_PAR_CARTE = 120;

const Journal = {
  jours: {},

  async charger() {
    this.jours = (await Base.lireMeta('journal')) || {};
  },

  du(date) {
    return this.jours[date] || { vues: 0, justes: 0, secondes: 0 };
  },

  async noter(jour, reussi, secondes) {
    const courant = this.du(jour);
    this.jours[jour] = {
      vues: courant.vues + 1,
      justes: courant.justes + (reussi ? 1 : 0),
      secondes: courant.secondes + Math.min(SECONDES_MAX_PAR_CARTE, Math.max(0, Math.round(secondes || 0))),
    };
    const dates = Object.keys(this.jours).sort();
    for (const date of dates.slice(0, Math.max(0, dates.length - JOURS_CONSERVES))) delete this.jours[date];
    await Base.ecrireMeta('journal', this.jours);
  },

  /** Jours consécutifs travaillés. La journée en cours ne casse la série
   *  qu'une fois passée : tant qu'elle est vide, on compte jusqu'à hier. */
  serie(jour = Dates.aujourdhui()) {
    let date = this.du(jour).vues ? jour : Dates.ajouter(jour, -1);
    let n = 0;
    while (this.du(date).vues) {
      n += 1;
      date = Dates.ajouter(date, -1);
    }
    return n;
  },

  meilleureSerie() {
    const dates = Object.keys(this.jours).filter((d) => this.jours[d].vues).sort();
    let record = 0;
    let courante = 0;
    let precedente = null;
    for (const date of dates) {
      courante = precedente && Dates.ecart(precedente, date) === 1 ? courante + 1 : 1;
      precedente = date;
      record = Math.max(record, courante);
    }
    return record;
  },

  /** Les `nombre` derniers jours, du plus ancien au plus récent. */
  derniers(nombre, jour = Dates.aujourdhui()) {
    const liste = [];
    for (let i = nombre - 1; i >= 0; i -= 1) {
      const date = Dates.ajouter(jour, -i);
      liste.push({ date, ...this.du(date) });
    }
    return liste;
  },

  total() {
    let vues = 0;
    let justes = 0;
    let secondes = 0;
    let jours = 0;
    for (const j of Object.values(this.jours)) {
      vues += j.vues;
      justes += j.justes;
      secondes += j.secondes;
      if (j.vues) jours += 1;
    }
    return { vues, justes, secondes, jours };
  },

  /** Durée moyenne observée, pour estimer une séance. null tant que l'échantillon
   *  est trop maigre pour valoir mieux que la valeur par défaut. */
  secondesParCarte() {
    const { vues, secondes } = this.total();
    if (vues < 20 || !secondes) return null;
    return Math.min(30, Math.max(3, secondes / vues));
  },
};

/** « 4 min », « 1 h 20 ». */
function formaterDuree(secondes) {
  const minutes = Math.round(secondes / 60);
  if (minutes < 60) return `${minutes} min`;
  const heures = Math.floor(minutes / 60);
  const reste = minutes % 60;
  return reste ? `${heures} h ${String(reste).padStart(2, '0')}` : `${heures} h`;
}
