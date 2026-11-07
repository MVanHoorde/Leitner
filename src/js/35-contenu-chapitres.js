/* Outils communs aux paquets de chapitres de terminale (35-contenu-son.js,
 * -diffraction, -interferences, -doppler, -incertitudes, -dosages).
 *
 * Trois niveaux par chapitre (décision de Loïc, 31/10/2026) :
 *   n1  vocabulaire, définitions, formules ;
 *   n2  calcul direct et exploitation en situation : mini-problèmes, calculs
 *       toujours faisables de tête, sans calculatrice ;
 *   n3  pièges, raisonnement, type bac, copies d'élèves à corriger :
 *       calculatrice permise.
 *
 * Notions : programme de spécialité de terminale, BO spécial n° 8 du
 * 25/07/2019 (« Ondes et signaux » 1 ; « Mesure et incertitudes » ;
 * « Constitution et transformations de la matière » 1.B, dosages par
 * étalonnage seulement, pas les titrages).
 *
 * Un paquet neuf porte audit: 'brouillon' : seul un compte enseignant le voit,
 * dans l'écran « Audit des paquets » (89-audit-ecrans.js). Une fois validé par
 * Loïc, on retire la propriété. audit: 'ouvert' : visible des élèves, mais
 * encore listé dans l'écran d'audit.
 *
 * Ce fichier ne dépend que d'auHasard, entierEntre, pileOuFace, melanger et
 * pieges, pour que outils/audit-paquet.mjs puisse l'exécuter seul.
 * RÈGLE ABSOLUE (32-paquets.js) : un identifiant de carte ne change jamais.
 */

/** Le titre du niveau s'affiche en tête de chaque carte : il dit si la calculatrice est permise. */
const TITRES_NIVEAUX_CHAPITRE = [
  'Niveau 1 · Vocabulaire, définitions, formules',
  'Niveau 2 · Situations, calculs de tête',
  'Niveau 3 · Pièges et type bac, calculatrice permise',
];

/** Écriture française : virgule, espace des milliers, vrai signe moins ; cs chiffres significatifs si demandé. */
function chNombre(x, cs = null) {
  if (cs === null) {
    return Number(x.toPrecision(12)).toLocaleString('fr-FR', { maximumFractionDigits: 10 }).replace('-', '−');
  }
  const brut = Number(x).toPrecision(cs);
  if (/e/.test(brut)) return chSci(x, cs);
  return brut.replace('.', ',').replace('-', '−');
}

/** a × 10^{n}, avec cs chiffres significatifs (2 par défaut). */
function chSci(x, cs = 2) {
  if (x === 0) return '0';
  let n = Math.floor(Math.log10(Math.abs(x)));
  let m = Number((x / 10 ** n).toFixed(cs - 1));
  if (Math.abs(m) >= 10) {
    m /= 10;
    n += 1;
  }
  const mantisse = m.toFixed(cs - 1).replace('.', ',').replace('-', '−');
  return n === 0 ? mantisse : `${mantisse} × 10^{${n}}`;
}

/** Un piège tiré peut tomber sur la bonne réponse ou sur un autre piège : on les écarte. */
function piegesDistincts(carte) {
  if (!carte.generer) return carte;
  const tirer = carte.generer;
  carte.generer = () => {
    const tirage = tirer();
    if (tirage.distracteurs) tirage.distracteurs = pieges(tirage.reponse, tirage.distracteurs);
    return tirage;
  };
  return carte;
}

/** Inscrit un chapitre en trois niveaux, ouverts un à un (37-niveaux.js). */
function inscrireChapitre({ cle, theme, titre, resume, n1, n2, n3, audit = 'brouillon' }) {
  return Paquets.inscrire({
    cle,
    theme,
    titre,
    resume,
    niveaux: ['terminale'],
    progression: 'niveaux',
    formatFixe: 'mixte',
    consignesParFormat: true,
    audit,
    sections: [n1, n2, n3].map((cartes, i) => ({
      cle: `n${i + 1}`,
      titre: TITRES_NIVEAUX_CHAPITRE[i],
      consigne: null,
      cartes: cartes.map(piegesDistincts),
    })),
  });
}
