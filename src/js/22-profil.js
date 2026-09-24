/* Portes d'accès et profil de l'élève.
 *
 * L'application a deux entrées distinctes :
 *   « prof »  — trombinoscope, import, tableau de bord. Protégée par le mot de
 *               passe : la clé de déchiffrement n'est dérivée que par ici.
 *   « eleve » — paquets de contenu uniquement. Aucune donnée personnelle, donc
 *               aucun mot de passe. Les photos restent chiffrées et illisibles.
 *
 * Le cloisonnement visible (le menu) n'est qu'un confort ; la garantie réelle
 * reste le chiffrement, qu'aucun écran élève ne peut lever.
 */

const NIVEAUX = [
  ['seconde', 'Seconde'],
  ['premiere', 'Première'],
  ['terminale', 'Terminale'],
];

function nomNiveau(cle) {
  const trouve = NIVEAUX.find(([valeur]) => valeur === cle);
  return trouve ? trouve[1] : 'Niveau non précisé';
}

const Porte = {
  /** 'prof', 'eleve', ou null tant que rien n'est choisi. */
  courante: null,

  async choisir(nom) {
    this.courante = nom;
    await Base.ecrireMeta('porte', nom);
  },

  /** Revenir au choix de porte. La porte prof exigera de nouveau le mot de passe. */
  async quitter() {
    if (Porte.courante === 'prof') Verrou.verrouiller();
    this.courante = null;
    await Base.ecrireMeta('porte', null);
    location.hash = '';
    afficher();
  },

  accueil() {
    return this.courante === 'eleve' ? 'accueil-eleve' : 'accueil';
  },

  /** Un écran sans mention de porte appartient au prof : tous les écrans
   *  existants manipulent le trombinoscope. */
  autorise(ecran) {
    const portes = ecran.porte || 'prof';
    return portes === 'tous' || portes === this.courante;
  },
};

/* ---------- Profil élève ---------- */

const PROFIL_DEFAUT = Object.freeze({
  pseudo: '',
  niveau: null,
  cree: null,
  nouvellesParJour: 10,
  tailleSession: 15,
  format: 'mixte',
});

const Profil = {
  donnees: { ...PROFIL_DEFAUT },

  async charger() {
    this.donnees = { ...PROFIL_DEFAUT, ...(await Base.lireMeta('profil')) };
  },

  /** Un profil est utilisable dès qu'un niveau est choisi ; le pseudo est facultatif. */
  defini() {
    return Boolean(this.donnees.niveau);
  },

  async enregistrer(changements) {
    Object.assign(this.donnees, changements);
    if (!this.donnees.cree) this.donnees.cree = Dates.aujourdhui();
    await Base.ecrireMeta('profil', { ...this.donnees });
  },

  async effacer() {
    this.donnees = { ...PROFIL_DEFAUT };
    await Base.ecrireMeta('profil', null);
  },

  get niveau() {
    return this.donnees.niveau;
  },
};
