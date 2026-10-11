/* Paquet « Conversions et puissances de dix » : cinq niveaux, de la seconde à
 * la terminale, ouverts un à un (37-niveaux.js).
 *
 * Les explications reprennent les formulations des outils de seconde (O1
 * « Puissances de dix et écriture scientifique », O6 « Présenter un calcul »)
 * pour que l'élève retrouve le vocabulaire du cours.
 *
 * La plupart des cartes sont des familles : generer() tire de nouvelles
 * valeurs à chaque passage, l'élève ne peut pas retenir la réponse par cœur.
 * Pour Leitner, une famille reste une seule carte.
 *
 * RÈGLE ABSOLUE (32-paquets.js) : un identifiant de carte ne change jamais.
 */

/* ---------- Outils de tirage et d'écriture ---------- */

/** [nom, symbole, exposant] : le tableau des préfixes de l'outil O1. */
const PREFIXES_SI = [
  ['giga', 'G', 9], ['méga', 'M', 6], ['kilo', 'k', 3], ['hecto', 'h', 2], ['déca', 'da', 1],
  ['déci', 'd', -1], ['centi', 'c', -2], ['milli', 'm', -3], ['micro', 'µ', -6], ['nano', 'n', -9],
  ['pico', 'p', -12], ['femto', 'f', -15],
];

function auHasard(liste) {
  return liste[Math.floor(Math.random() * liste.length)];
}

function entierEntre(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

/** Un entier non nul entre min et max. */
function exposantNonNul(min, max) {
  let n = 0;
  while (n === 0) n = entierEntre(min, max);
  return n;
}

function pileOuFace() {
  return Math.random() < 0.5;
}

/** Retire le bruit des flottants : 0,1 × 3 = 0,30000000000000004. */
function net(x) {
  return Number(x.toPrecision(12));
}

/** Écriture française : virgule, espaces des milliers, vrai signe moins. */
function nombreFr(x) {
  return net(x).toLocaleString('fr-FR', { maximumFractionDigits: 12 }).replace('-', '−');
}

function p10(n) {
  return `10^{${n}}`;
}

function sci(m, n) {
  return `${nombreFr(m)} × 10^{${n}}`;
}

/** Écriture scientifique a × 10ⁿ, 1 ⩽ a < 10 ; « 10ⁿ » quand a = 1. */
function enScientifique(x) {
  if (x === 0) return '0';
  let n = Math.floor(Math.log10(Math.abs(x)));
  let m = net(x / 10 ** n);
  if (Math.abs(m) >= 10) {
    m = net(m / 10);
    n += 1;
  }
  if (Math.abs(m) < 1) {
    m = net(m * 10);
    n -= 1;
  }
  if (n === 0) return nombreFr(m);
  return Math.abs(m) === 1 ? `${m < 0 ? '−' : ''}${p10(n)}` : sci(m, n);
}

/** Résultat lisible : décimal entre 10⁻³ et 10⁶, écriture scientifique ailleurs. */
function valeurFr(x) {
  const a = Math.abs(x);
  return x === 0 || (a >= 1e-3 && a < 1e6) ? nombreFr(x) : enScientifique(x);
}

/** Valeurs d'énoncé : un ou deux chiffres significatifs, rarement un nombre rond. */
function mesure() {
  return auHasard([1.2, 1.5, 2.5, 3, 3.6, 4.2, 4.5, 6, 6.4, 7.5, 8, 9.6, 12, 15, 25, 36, 45, 64, 75, 120, 250, 350, 480]);
}

/**
 * Famille de conversions : paires = [[[départ, exposant], [arrivée, exposant]], …],
 * l'exposant étant celui de la puissance de dix par rapport à une même unité
 * (déjà doublé ou triplé pour les surfaces et les volumes).
 */
function familleConversion(id, question, paires, aide) {
  return {
    id,
    question,
    formats: ['saisie'],
    aide,
    generer() {
      const [[de, eDe], [vers, eVers]] = auHasard(paires);
      const v = mesure();
      const resultat = net(v * 10 ** (eDe - eVers));
      return { question: `${nombreFr(v)} ${de} = ? ${vers}`, reponse: `${valeurFr(resultat)} ${vers}`, nombre: resultat, unite: vers };
    },
  };
}

/** Toutes les paires ordonnées d'une liste d'unités : [[a, b], [b, a], …]. */
function toutesPaires(unites) {
  return unites.flatMap((a) => unites.filter((b) => b !== a).map((b) => [a, b]));
}

/** Famille de conversions d'unités composées : [départ, arrivée, facteur]. */
function familleComposee(id, question, specs, aide) {
  return {
    id,
    question,
    formats: ['saisie'],
    aide,
    generer() {
      const [de, vers, facteur] = auHasard(specs);
      const v = mesure();
      const resultat = net(v * facteur);
      return { question: `${nombreFr(v)} ${de} = ? ${vers}`, reponse: `${valeurFr(resultat)} ${vers}`, nombre: resultat, unite: vers };
    },
  };
}

const AIDE_SENS = 'Vers une unité plus petite, le nombre grossit ; vers une unité plus grande, il rétrécit. '
  + 'Si ton résultat va dans l’autre sens, tu as inversé le signe.';
const AIDE_EXPOSANTS = 'Produit : les exposants s’ajoutent. Quotient : ils se soustraient. '
  + 'Puissance : ils se multiplient. Ce qui passe sous la barre de fraction change de signe.';
const AIDE_SCIENTIFIQUE = 'Écriture scientifique : a × 10ⁿ avec 1 ⩽ a < 10 et n entier. '
  + 'L’exposant dit de combien de rangs la virgule s’est déplacée, son signe dit dans quel sens.';
const AIDE_ORDRE = 'a < 5 → 10ⁿ ; a ⩾ 5 → 10ⁿ⁺¹ (« 5 monte »). Un ordre de grandeur ne porte jamais de chiffre devant.';
const AIDE_SURFACES = '×1 longueur · ×2 surface · ×3 volume : pour les m², on double l’exposant du préfixe ; pour les m³, on le triple.';

/* ---------- Niveau 1 : préfixes et puissances de dix ---------- */

const UNITES_SIMPLES = ['m', 'g', 'L', 's', 'Hz', 'W'];

const NIVEAU_1 = [
  {
    id: 'conversions.n1.prefixe-valeur',
    question: 'Que vaut un préfixe ?',
    formats: ['qcm'],
    generer() {
      const [nom, symbole, e] = auHasard(PREFIXES_SI);
      return {
        question: `Que vaut le préfixe ${nom} (${symbole}) ?`,
        reponse: p10(e),
        distracteurs: pieges(p10(e), [-e, e + 1, e - 1, e + 3, e - 3, 2 * e, e === 1 ? 2 : -e * 2].map(p10)),
        aide: 'Un préfixe n’est rien d’autre qu’une puissance de dix qu’on a baptisée.',
      };
    },
  },
  {
    id: 'conversions.n1.prefixe-nom',
    question: 'Quel préfixe pour cette puissance de dix ?',
    formats: ['saisie'],
    generer() {
      const [nom, symbole, e] = auHasard(PREFIXES_SI);
      const sansAccent = nom.normalize('NFD').replace(/[̀-ͯ]/g, '');
      return {
        question: `Quel préfixe correspond à ${p10(e)} ?`,
        reponse: `${nom} (${symbole})`,
        saisie: [nom, sansAccent, symbole, `${nom} ${symbole}`],
      };
    },
  },
  {
    id: 'conversions.n1.prefixe-symbole',
    question: 'Quel est le symbole de ce préfixe ?',
    formats: ['qcm'],
    generer() {
      const [nom, symbole] = auHasard(PREFIXES_SI);
      const casse = symbole === symbole.toLowerCase() ? symbole.toUpperCase() : symbole.toLowerCase();
      const autres = melanger(PREFIXES_SI.map((p) => p[1]).filter((s) => s !== symbole));
      return {
        question: `Quel est le symbole du préfixe ${nom} ?`,
        reponse: symbole,
        distracteurs: pieges(symbole, [casse, nom.slice(0, 2), ...autres.slice(0, 4)]),
        aide: 'Attention à la casse : M est le méga, m le milli.',
      };
    },
  },
  {
    id: 'conversions.n1.prefixe-vrai-faux',
    question: 'Préfixe et puissance de dix : vrai ou faux ?',
    formats: ['vraifaux'],
    generer() {
      const [, symbole, e] = auHasard(PREFIXES_SI);
      const unite = auHasard(UNITES_SIMPLES);
      const vrai = pileOuFace();
      const annonce = vrai ? e : auHasard([-e, e + 3, e - 3, e + 1, e - 1].filter((x) => x !== e));
      return {
        question: `« 1 ${symbole}${unite} = ${p10(annonce)} ${unite} »`,
        vrai,
        reponse: `${vrai ? 'Vrai' : 'Faux'} : 1 ${symbole}${unite} = ${p10(e)} ${unite}`,
      };
    },
  },
  {
    id: 'conversions.n1.casse-m',
    question: '« M et m désignent le même préfixe, en majuscule ou non »',
    formats: ['vraifaux'],
    vrai: false,
    reponse: 'Faux : M est le méga (10^{6}), m le milli (10^{-3}).',
    aide: 'Un mW est un milliard de fois plus petit qu’un MW.',
  },
  {
    id: 'conversions.n1.mw-dans-mw',
    question: 'Combien de mW dans 1 MW ?',
    formats: ['qcm'],
    reponse: '10^{9}',
    distracteurs: ['10^{6}', '10^{3}', '10^{12}', '1', '10^{-9}', '10^{-3}'],
    aide: 'De 10^{6} à 10^{-3} : 6 − (−3) = 9 rangs.',
  },
  {
    id: 'conversions.n1.rapport-prefixes',
    question: 'Combien de fois une unité est-elle plus grande qu’une autre ?',
    formats: ['qcm'],
    generer() {
      const usuels = PREFIXES_SI.filter((p) => ['G', 'M', 'k', 'c', 'm', 'µ', 'n'].includes(p[1]));
      let a;
      let b;
      do {
        a = auHasard(usuels);
        b = auHasard(usuels);
      } while (a[2] <= b[2]);
      const unite = auHasard(UNITES_SIMPLES);
      const d = a[2] - b[2];
      return {
        question: `Combien de fois 1 ${a[1]}${unite} est-il plus grand que 1 ${b[1]}${unite} ?`,
        reponse: p10(d),
        distracteurs: pieges(p10(d), [-d, d - 3, d + 3, a[2] + b[2], d - 1, d + 1].map(p10)),
        aide: `On soustrait les exposants : ${a[2]} − (${b[2]}) = ${d}.`,
      };
    },
  },
  {
    id: 'conversions.n1.pas-de-prefixe-10-4',
    question: '« Il existe un préfixe pour 10^{4} »',
    formats: ['vraifaux'],
    vrai: false,
    reponse: 'Faux : il n’y a pas de préfixe pour 10^{4} ni pour 10^{5}.',
  },
  {
    id: 'conversions.n1.produit-puissances',
    question: 'Produit de deux puissances de dix',
    formats: ['saisie'],
    aide: AIDE_EXPOSANTS,
    generer() {
      const a = exposantNonNul(-9, 9);
      const b = exposantNonNul(-9, 9);
      return { question: `${p10(a)} × ${p10(b)} = ?`, reponse: p10(a + b), nombre: 10 ** (a + b) };
    },
  },
  {
    id: 'conversions.n1.quotient-puissances',
    question: 'Quotient de deux puissances de dix',
    formats: ['saisie'],
    aide: AIDE_EXPOSANTS,
    generer() {
      const a = exposantNonNul(-9, 9);
      const b = exposantNonNul(-9, 9);
      return { question: `${p10(a)} / ${p10(b)} = ?`, reponse: p10(a - b), nombre: 10 ** (a - b) };
    },
  },
  {
    id: 'conversions.n1.puissance-de-puissance',
    question: 'Puissance d’une puissance de dix',
    formats: ['qcm'],
    aide: AIDE_EXPOSANTS,
    generer() {
      const a = exposantNonNul(-5, 5);
      const b = auHasard([-3, -2, 2, 3]);
      const bonne = p10(a * b);
      return {
        question: `(${p10(a)})^{${b}} = ?`,
        reponse: bonne,
        distracteurs: pieges(bonne, [a + b, a - b, -a * b, a, b, a * b + 1].map(p10)),
      };
    },
  },
  {
    id: 'conversions.n1.inverse-puissance',
    question: 'Inverse d’une puissance de dix',
    formats: ['saisie'],
    aide: 'Ce qui passe sous la barre de fraction change de signe : 1 / 10ⁿ = 10⁻ⁿ.',
    generer() {
      const a = exposantNonNul(-9, 9);
      return { question: `1 / ${p10(a)} = ?`, reponse: p10(-a), nombre: 10 ** -a };
    },
  },
  {
    id: 'conversions.n1.trois-puissances',
    question: 'Produit et quotient de puissances de dix',
    formats: ['saisie'],
    aide: AIDE_EXPOSANTS,
    generer() {
      const a = exposantNonNul(-8, 8);
      const b = exposantNonNul(-8, 8);
      const c = exposantNonNul(-8, 8);
      return { question: `${p10(a)} × ${p10(b)} / ${p10(c)} = ?`, reponse: p10(a + b - c), nombre: 10 ** (a + b - c) };
    },
  },
  {
    id: 'conversions.n1.dix-puissance-zero',
    question: '10^{0} = ?',
    formats: ['qcm'],
    reponse: '1',
    distracteurs: ['0', '10', '0,1', 'n’existe pas'],
    aide: '10^{3} / 10^{3} = 10^{0}, et c’est aussi 1000 / 1000 = 1.',
  },
  {
    id: 'conversions.n1.scientifique-petit',
    question: 'Écriture scientifique d’un petit nombre',
    formats: ['qcm'],
    aide: AIDE_SCIENTIFIQUE,
    generer() {
      const m = auHasard([4.7, 9.2, 1.2, 8.2, 4.8, 5.6, 2.5, 3.1, 6.3]);
      const n = entierEntre(-7, -2);
      const ecrit = net(m * 10 ** n).toLocaleString('fr-FR', { maximumFractionDigits: 12 });
      const bonne = sci(m, n);
      return {
        question: `Écriture scientifique de ${ecrit} ?`,
        reponse: bonne,
        distracteurs: pieges(bonne, [sci(m, n + 1), sci(m, n - 1), sci(m, -n), `${nombreFr(m * 10)} × 10^{${n - 1}}`,
          `${nombreFr(m / 10)} × 10^{${n + 1}}`, sci(m, n - 2)]),
      };
    },
  },
  {
    id: 'conversions.n1.scientifique-grand',
    question: 'Écriture scientifique d’un grand nombre',
    formats: ['saisie'],
    ecritureScientifique: true,
    aide: AIDE_SCIENTIFIQUE,
    generer() {
      const m = auHasard([6.2, 1.25, 5.25, 9.6, 3.8, 1.5, 7.2, 2.4]);
      const n = entierEntre(3, 8);
      const x = net(m * 10 ** n);
      return { question: `Écris ${nombreFr(x)} en écriture scientifique.`, reponse: sci(m, n), nombre: x };
    },
  },
  {
    id: 'conversions.n1.normaliser',
    question: 'Remettre en écriture scientifique',
    formats: ['qcm'],
    aide: AIDE_SCIENTIFIQUE,
    generer() {
      const m = auHasard([1.2, 1.04, 4.75, 3.6, 2.5, 8.4]);
      const n = entierEntre(-8, 8);
      const bonne = sci(m, n);
      // Mantisse trop petite (0,12 × 10⁻⁶) ou trop grande (10,4 × 10²).
      const tropPetite = pileOuFace();
      const ecrit = tropPetite ? `${nombreFr(m / 10)} × 10^{${n + 1}}` : `${nombreFr(m * 10)} × 10^{${n - 1}}`;
      return {
        question: `${ecrit} en écriture scientifique ?`,
        reponse: bonne,
        distracteurs: pieges(bonne, [tropPetite ? sci(m, n + 2) : sci(m, n - 2), sci(m, n + 1), sci(m, n - 1), ecrit, sci(m, -n)]),
      };
    },
  },
  {
    id: 'conversions.n1.est-scientifique',
    question: 'Est-ce une écriture scientifique ?',
    formats: ['vraifaux'],
    aide: AIDE_SCIENTIFIQUE,
    generer() {
      const cas = auHasard([
        [sci(4.5, 3), true, 'Vrai : 1 ⩽ 4,5 < 10 et l’exposant est entier.'],
        [sci(1.6, -19), true, 'Vrai : 1 ⩽ 1,6 < 10 et l’exposant est entier.'],
        [sci(10.4, 2), false, 'Faux : 10,4 n’est pas inférieur à 10 ; on écrit 1,04 × 10^{3}.'],
        [sci(0.12, -6), false, 'Faux : 0,12 est inférieur à 1 ; on écrit 1,2 × 10^{-7}.'],
        [`${nombreFr(4.5)} × 10^{2,3}`, false, 'Faux : l’exposant doit être entier. On ne la corrige pas, on la refuse.'],
        [sci(47.5, 3), false, 'Faux : 47,5 dépasse 10 ; on écrit 4,75 × 10^{4}.'],
        [sci(9.99, 8), true, 'Vrai : 9,99 est bien inférieur à 10.'],
      ]);
      return { question: `« ${cas[0]} est une écriture scientifique »`, vrai: cas[1], reponse: cas[2] };
    },
  },
  {
    id: 'conversions.n1.exposant-non-entier',
    question: 'Pourquoi 4,5 × 10^{2,3} n’est-elle pas une écriture scientifique ?',
    formats: ['retournement'],
    reponse: 'L’exposant doit être un entier.',
    aide: 'On ne la corrige pas, on la refuse.',
  },
  {
    id: 'conversions.n1.virgule',
    question: 'De combien de rangs se déplace la virgule ?',
    formats: ['qcm'],
    aide: 'L’exposant porte l’échelle : il dit de combien de rangs la virgule s’est déplacée, et son signe dit dans quel sens.',
    generer() {
      const m = auHasard([3.2, 5.6, 1.8, 7.4]);
      const n = exposantNonNul(-6, 6);
      const k = Math.abs(n);
      const sens = n < 0 ? 'gauche' : 'droite';
      const autre = n < 0 ? 'droite' : 'gauche';
      const rangs = (r, s) => `${pluriel(r, 'rang')} vers la ${s}`;
      const bonne = rangs(k, sens);
      return {
        question: `Pour passer de ${nombreFr(m)} à ${sci(m, n)}, la virgule se déplace de…`,
        reponse: bonne,
        distracteurs: pieges(bonne, [rangs(k, autre), rangs(k + 1, sens), rangs(k + 1, autre), k > 1 ? rangs(k - 1, sens) : rangs(k + 2, sens)]),
      };
    },
  },
  {
    id: 'conversions.n1.ordre-de-grandeur',
    question: 'Ordre de grandeur d’un nombre',
    formats: ['qcm'],
    aide: AIDE_ORDRE,
    generer() {
      const a = auHasard([1.6, 2.5, 3.8, 4.2, 6.0, 6.4, 9.1, 7.5, 1.2, 8.3]);
      const n = entierEntre(-30, 30);
      const k = a < 5 ? n : n + 1;
      const bonne = p10(k);
      return {
        question: `Ordre de grandeur de ${sci(a, n)} ?`,
        reponse: bonne,
        distracteurs: pieges(bonne, [p10(a < 5 ? n + 1 : n), sci(a, n), p10(k - 1), p10(k + 1), p10(-k)]),
      };
    },
  },
  {
    id: 'conversions.n1.ordre-de-grandeur-vrai-faux',
    question: 'Ordre de grandeur : vrai ou faux ?',
    formats: ['vraifaux'],
    aide: AIDE_ORDRE,
    generer() {
      const [a, n, unite] = auHasard([[9.1, -31, 'kg'], [6.0, 23, ''], [1.6, -19, 'C'], [2.5, 3, 'm'], [3.8, 8, 'm'], [4.2, 5, 'Hz'], [6.4, 6, 'm']]);
      const k = a < 5 ? n : n + 1;
      const vrai = pileOuFace();
      const annonce = vrai ? k : (a < 5 ? n + 1 : n);
      const u = unite ? ` ${unite}` : '';
      return {
        question: `« L’ordre de grandeur de ${sci(a, n)}${u} est ${p10(annonce)}${u} »`,
        vrai,
        reponse: `${vrai ? 'Vrai' : 'Faux'} : ${p10(k)}${u}, car ${nombreFr(a)} ${a < 5 ? '<' : '⩾'} 5.`,
      };
    },
  },
  {
    id: 'conversions.n1.produit-scientifique',
    question: 'Produit en écriture scientifique',
    formats: ['saisie'],
    aide: 'On multiplie les nombres entre eux, puis les puissances de dix entre elles.',
    generer() {
      const [a, b] = auHasard([[2, 3], [2, 4], [3, 3], [2, 2], [1.5, 4], [4, 2], [1.2, 5], [2.5, 2]]);
      const m = exposantNonNul(-8, 8);
      const n = exposantNonNul(-8, 8);
      return { question: `(${sci(a, m)}) × (${sci(b, n)}) = ?`, reponse: sci(a * b, m + n), nombre: net(a * b * 10 ** (m + n)) };
    },
  },
  {
    id: 'conversions.n1.quotient-scientifique',
    question: 'Quotient en écriture scientifique',
    formats: ['saisie'],
    aide: 'On divise les nombres entre eux, puis les puissances de dix entre elles.',
    generer() {
      const [a, b] = auHasard([[8, 4], [6, 3], [9, 3], [6, 2], [8, 2], [4, 2], [9, 1.5]]);
      const m = exposantNonNul(-8, 8);
      const n = exposantNonNul(-8, 8);
      return { question: `(${sci(a, m)}) / (${sci(b, n)}) = ?`, reponse: sci(a / b, m - n), nombre: net((a / b) * 10 ** (m - n)) };
    },
  },
  {
    id: 'conversions.n1.carre-scientifique',
    question: 'Carré en écriture scientifique',
    formats: ['qcm'],
    aide: 'Le nombre est élevé au carré, et l’exposant multiplié par 2.',
    generer() {
      const a = auHasard([2, 3]);
      const n = exposantNonNul(-6, 6);
      const bonne = sci(a * a, 2 * n);
      return {
        question: `(${sci(a, n)})^{2} = ?`,
        reponse: bonne,
        distracteurs: pieges(bonne, [sci(a, 2 * n), sci(a * a, n), sci(2 * a, 2 * n), sci(2 * a, n), sci(a * a, 2 * n + 1),
          sci(a * a, 2 * n - 1), sci(a, n + 2)]),
      };
    },
  },
  {
    id: 'conversions.n1.calculatrice',
    question: 'Sur la calculatrice, quelle saisie donne 1 ÷ 6,02 × 10^{23} ?',
    formats: ['retournement'],
    reponse: '1 ÷ 6,02 ×10ˣ 23, avec la touche ×10ˣ (ou EXP) : 1,66 × 10^{-24}',
    aide: 'Avec ^ sans parenthèses, la calculatrice fait (1 ÷ 6,02) × 10^{23} = 1,66 × 10^{22} : '
      + '46 ordres de grandeur d’erreur. Toujours la touche ×10ˣ.',
  },
];

/* ---------- Niveau 2 : conversions simples ---------- */

const MASSES = [['kg', 3], ['g', 0], ['mg', -3], ['µg', -6]];
const VOLUMES = [['L', 0], ['dL', -1], ['cL', -2], ['mL', -3], ['µL', -6]];
const DUREES = [['s', 0], ['ms', -3], ['µs', -6], ['ns', -9]];

const NIVEAU_2 = [
  familleConversion('conversions.n2.multiple-vers-base', 'D’un multiple vers l’unité', [
    [['km', 3], ['m', 0]], [['hm', 2], ['m', 0]], [['dam', 1], ['m', 0]], [['kg', 3], ['g', 0]], [['hL', 2], ['L', 0]],
    [['kW', 3], ['W', 0]], [['MW', 6], ['W', 0]], [['GHz', 9], ['Hz', 0]], [['kJ', 3], ['J', 0]], [['kV', 3], ['V', 0]],
  ], AIDE_SENS),
  familleConversion('conversions.n2.sous-multiple-vers-base', 'D’un sous-multiple vers l’unité', [
    [['cm', -2], ['m', 0]], [['mm', -3], ['m', 0]], [['µm', -6], ['m', 0]], [['nm', -9], ['m', 0]], [['dm', -1], ['m', 0]],
    [['mg', -3], ['g', 0]], [['µg', -6], ['g', 0]], [['mL', -3], ['L', 0]], [['cL', -2], ['L', 0]], [['dL', -1], ['L', 0]],
  ], AIDE_SENS),
  familleConversion('conversions.n2.base-vers-prefixe', 'De l’unité vers un préfixe', [
    [['m', 0], ['cm', -2]], [['m', 0], ['mm', -3]], [['m', 0], ['µm', -6]], [['m', 0], ['km', 3]], [['g', 0], ['mg', -3]],
    [['g', 0], ['kg', 3]], [['L', 0], ['mL', -3]], [['L', 0], ['cL', -2]], [['s', 0], ['ms', -3]], [['W', 0], ['kW', 3]],
  ], AIDE_SENS),
  familleConversion('conversions.n2.masses', 'Conversions de masses', toutesPaires(MASSES), AIDE_SENS),
  familleConversion('conversions.n2.volumes-litres', 'Conversions de litres', toutesPaires(VOLUMES), AIDE_SENS),
  familleConversion('conversions.n2.electricite', 'Intensités, tensions, puissances, fréquences', [
    ...toutesPaires([['A', 0], ['mA', -3], ['µA', -6]]), ...toutesPaires([['V', 0], ['mV', -3], ['kV', 3]]),
    ...toutesPaires([['W', 0], ['kW', 3], ['MW', 6]]), ...toutesPaires([['Hz', 0], ['kHz', 3], ['MHz', 6], ['GHz', 9]]),
  ], AIDE_SENS),
  familleConversion('conversions.n2.durees-prefixes', 'Millisecondes, microsecondes, nanosecondes', toutesPaires(DUREES), AIDE_SENS),
  familleConversion('conversions.n2.entre-prefixes', 'D’un préfixe à un autre', [
    [['mm', -3], ['µm', -6]], [['km', 3], ['cm', -2]], [['cm', -2], ['mm', -3]], [['mg', -3], ['µg', -6]], [['kg', 3], ['mg', -3]],
    [['mL', -3], ['µL', -6]], [['km', 3], ['mm', -3]], [['nm', -9], ['µm', -6]], [['ms', -3], ['µs', -6]], [['GHz', 9], ['MHz', 6]],
  ], 'On passe par la différence des exposants des deux préfixes.'),
  {
    id: 'conversions.n2.vers-unite-scientifique',
    question: 'Conversion, résultat en écriture scientifique',
    formats: ['qcm'],
    aide: AIDE_SENS,
    generer() {
      const v = auHasard([56, 37, 3.49, 964, 0.63, 4.5, 72, 250, 358]);
      const [[de, eDe], [vers, eVers]] = auHasard([
        [['mm', -3], ['m', 0]], [['g', 0], ['kg', 3]], [['g', 0], ['mg', -3]], [['GHz', 9], ['Hz', 0]],
        [['cm', -2], ['km', 3]], [['mV', -3], ['kV', 3]], [['µm', -6], ['m', 0]], [['kW', 3], ['W', 0]],
      ]);
      const d = eDe - eVers;
      const r = net(v * 10 ** d);
      const bonne = enScientifique(r);
      return {
        question: `${nombreFr(v)} ${de} = ? ${vers}`,
        reponse: bonne,
        distracteurs: pieges(bonne, [enScientifique(v * 10 ** -d), enScientifique(r * 10), enScientifique(r / 10),
          enScientifique(r * 1000), `${nombreFr(v)} × 10^{${-d}}`, enScientifique(r / 100)]),
      };
    },
  },
  {
    id: 'conversions.n2.conversion-vrai-faux',
    question: 'Une conversion : vraie ou fausse ?',
    formats: ['vraifaux'],
    aide: AIDE_SENS,
    generer() {
      const v = auHasard([3.49, 56, 2.5, 450, 0.8, 12]);
      const [[de, eDe], [vers, eVers]] = auHasard([
        [['g', 0], ['mg', -3]], [['mm', -3], ['m', 0]], [['kg', 3], ['g', 0]], [['mL', -3], ['L', 0]],
        [['km', 3], ['m', 0]], [['ms', -3], ['s', 0]], [['m', 0], ['µm', -6]],
      ]);
      const d = eDe - eVers;
      const vrai = pileOuFace();
      const juste = enScientifique(v * 10 ** d);
      return {
        question: `« ${nombreFr(v)} ${de} = ${vrai ? juste : enScientifique(v * 10 ** -d)} ${vers} »`,
        vrai,
        reponse: `${vrai ? 'Vrai' : 'Faux'} : ${nombreFr(v)} ${de} = ${juste} ${vers}`,
      };
    },
  },
  {
    id: 'conversions.n2.sens-du-nombre',
    question: 'Vers une unité plus petite, le nombre…',
    formats: ['qcm'],
    reponse: 'grossit',
    distracteurs: ['rétrécit', 'ne change pas', 'change de signe'],
    aide: 'Il faut plus de petites unités pour mesurer la même chose : 1 m = 100 cm.',
  },
  {
    id: 'conversions.n2.verifier-le-sens',
    question: 'En passant de grammes en kilogrammes, ton nombre a grandi. Est-ce normal ?',
    formats: ['retournement'],
    reponse: 'Non : le kilogramme est plus grand que le gramme, le nombre doit rétrécir. Tu as multiplié au lieu de diviser.',
    aide: 'Réflexe : le nombre a-t-il grandi ou rétréci — et est-ce normal ?',
  },
  {
    id: 'conversions.n2.litre-dm3',
    question: '1 L = ?',
    formats: ['qcm'],
    reponse: '1 dm³',
    distracteurs: ['1 m³', '1 cm³', '10 cm³', '100 cm³', '1 mm³', '10 dm³'],
    aide: '1 dm³ = 1 L · 1 m³ = 1000 L · 1 cm³ = 1 mL.',
  },
  {
    id: 'conversions.n2.equivalences-volumes',
    question: 'Litres et mètres cubes : vrai ou faux ?',
    formats: ['vraifaux'],
    aide: '1 dm³ = 1 L · 1 m³ = 1000 L · 1 cm³ = 1 mL.',
    generer() {
      const cas = auHasard([
        ['1 mL = 1 cm³', true, 'Vrai'], ['1 L = 1 dm³', true, 'Vrai'], ['1 m³ = 1 000 L', true, 'Vrai'],
        ['1 cL = 10 cm³', true, 'Vrai : 1 cL = 10 mL = 10 cm³'], ['1 L = 1 m³', false, 'Faux : 1 m³ = 1 000 L'],
        ['1 mL = 1 dm³', false, 'Faux : 1 mL = 1 cm³'], ['1 cm³ = 1 L', false, 'Faux : 1 cm³ = 1 mL'],
        ['1 L = 100 cm³', false, 'Faux : 1 L = 1 000 cm³'], ['1 m³ = 100 L', false, 'Faux : 1 m³ = 1 000 L'],
      ]);
      return { question: `« ${cas[0]} »`, vrai: cas[1], reponse: cas[2] };
    },
  },
  familleConversion('conversions.n2.cm3-et-ml', 'cm³, dm³, mL et L', [
    [['cm³', -3], ['mL', -3]], [['dm³', 0], ['L', 0]], [['mL', -3], ['cm³', -3]], [['L', 0], ['dm³', 0]],
    [['cm³', -3], ['L', 0]], [['L', 0], ['cm³', -3]], [['dm³', 0], ['mL', -3]], [['mL', -3], ['dm³', 0]],
  ], '1 dm³ = 1 L et 1 cm³ = 1 mL.'),
  {
    id: 'conversions.n2.minutes-en-heures',
    question: 'Des minutes en heures',
    formats: ['saisie'],
    aide: 'Une heure compte 60 minutes, pas 100 : on divise par 60.',
    generer() {
      const m = auHasard([6, 12, 15, 18, 24, 30, 36, 42, 45, 48, 54, 75, 90, 150]);
      return { question: `${m} min = ? h`, reponse: `${nombreFr(m / 60)} h`, nombre: net(m / 60), unite: 'h' };
    },
  },
  {
    id: 'conversions.n2.heures-minutes-decimal',
    question: 'Des heures et minutes en heures décimales',
    formats: ['qcm'],
    aide: '2 h 30 ne vaut pas 2,30 h : 30 min, c’est une demi-heure, donc 2,5 h.',
    generer() {
      const h = entierEntre(1, 5);
      const m = auHasard([15, 30, 45, 6, 12, 18, 24, 36, 48, 54]);
      const bonne = `${nombreFr(h + m / 60)} h`;
      return {
        question: `${h} h ${m} min = ? h`,
        reponse: bonne,
        distracteurs: pieges(bonne, [`${h},${String(m).padStart(2, '0')} h`, `${nombreFr(h * 60 + m)} h`,
          `${nombreFr((h * 60 + m) / 100)} h`, `${h}${String(m).padStart(2, '0')} h`, `${nombreFr(h + m / 600)} h`]),
      };
    },
  },
  {
    id: 'conversions.n2.heures-minutes-secondes',
    question: 'Des heures et minutes en secondes',
    formats: ['saisie'],
    aide: '1 h = 3 600 s ; 2 h 30 = 2,5 × 3 600 = 9 000 s.',
    generer() {
      const h = entierEntre(1, 3);
      const m = auHasard([10, 15, 20, 30, 40, 45]);
      const s = (h * 60 + m) * 60;
      return { question: `${h} h ${m} min = ? s`, reponse: `${nombreFr(s)} s`, nombre: s, unite: 's' };
    },
  },
  {
    id: 'conversions.n2.heures-minutes',
    question: 'Heures, minutes, secondes',
    formats: ['saisie'],
    aide: '1 h = 60 min ; 1 min = 60 s.',
    generer() {
      if (pileOuFace()) {
        const h = auHasard([1.5, 2.5, 0.5, 0.25, 0.75, 1.2, 3.5]);
        return { question: `${nombreFr(h)} h = ? min`, reponse: `${nombreFr(h * 60)} min`, nombre: net(h * 60), unite: 'min' };
      }
      const m = auHasard([2.5, 1.5, 0.5, 10, 12, 4, 0.25]);
      return { question: `${nombreFr(m)} min = ? s`, reponse: `${nombreFr(m * 60)} s`, nombre: net(m * 60), unite: 's' };
    },
  },
  {
    id: 'conversions.n2.secondes-par-jour',
    question: 'Combien de secondes dans une journée ?',
    formats: ['qcm'],
    reponse: '86 400',
    distracteurs: ['3 600', '1 440', '8 640', '864 000', '24 000'],
    aide: '24 × 3 600 = 86 400 s.',
  },
  familleConversion('conversions.n2.tonnes', 'Tonnes et kilogrammes', [[['t', 3], ['kg', 0]], [['kg', 0], ['t', 3]], [['t', 6], ['g', 0]]],
    '1 t = 1 000 kg.'),
  {
    id: 'conversions.n2.unites-si',
    question: 'Unité du Système international',
    formats: ['qcm'],
    aide: 'Pour un calcul, on convertit d’abord en unités SI : mètre, kilogramme, seconde…',
    generer() {
      const [grandeur, bonne, autres] = auHasard([
        ['de la masse', 'kg', ['g', 'mg', 't', 'N', 'lb']],
        ['de la longueur', 'm', ['km', 'cm', 'mm', 'pouce', 'L']],
        ['de la durée', 's', ['min', 'h', 'ms', 'Hz', 'j']],
        ['de la température', 'K', ['°C', '°F', 'J', 'k']],
        ['de l’intensité électrique', 'A', ['mA', 'V', 'W', 'Ω', 'C']],
        ['de la quantité de matière', 'mol', ['g', 'mol/L', 'L', 'g/mol', 'M']],
      ]);
      return { question: `Unité SI ${grandeur} ?`, reponse: bonne, distracteurs: autres };
    },
  },
  {
    id: 'conversions.n2.celsius-kelvin',
    question: 'Degrés Celsius et kelvins',
    formats: ['saisie'],
    tolerance: 0.01,
    aide: 'T (K) = θ (°C) + 273 (273,15 pour être précis).',
    generer() {
      if (pileOuFace()) {
        const c = auHasard([25, 20, 37, 100, -10, 0, -196, 15]);
        return { question: `${nombreFr(c)} °C = ? K`, reponse: `${nombreFr(c + 273)} K`, nombre: c + 273, unite: 'K' };
      }
      const k = auHasard([300, 310, 373, 250, 77, 293]);
      return { question: `${k} K = ? °C`, reponse: `${nombreFr(k - 273)} °C`, nombre: k - 273, unite: '°C' };
    },
  },
  {
    id: 'conversions.n2.zero-kelvin',
    question: '« 0 K = 0 °C »',
    formats: ['vraifaux'],
    vrai: false,
    reponse: 'Faux : 0 K = −273 °C, le zéro absolu.',
  },
  familleConversion('conversions.n2.pressions', 'Pascals, hectopascals, bars', [
    [['hPa', 2], ['Pa', 0]], [['kPa', 3], ['Pa', 0]], [['Pa', 0], ['hPa', 2]], [['bar', 5], ['Pa', 0]],
    [['bar', 5], ['hPa', 2]], [['MPa', 6], ['Pa', 0]], [['Pa', 0], ['kPa', 3]],
  ], '1 hPa = 10^{2} Pa ; 1 bar = 10^{5} Pa = 1 000 hPa.'),
];

/* ---------- Niveau 3 : conversions piégeuses ---------- */

const NIVEAU_3 = [
  {
    id: 'conversions.n3.ms-vers-kmh-facteur',
    question: 'Pour passer de m/s à km/h, on…',
    formats: ['qcm'],
    reponse: 'multiplie par 3,6',
    distracteurs: ['divise par 3,6', 'multiplie par 1 000', 'multiplie par 60', 'multiplie par 3 600', 'divise par 1 000', 'multiplie par 36'],
    aide: '1 m/s = 3 600 m/h = 3,6 km/h. Un résultat en km/h est toujours plus grand.',
  },
  {
    id: 'conversions.n3.kmh-vers-ms-facteur',
    question: 'Pour passer de km/h à m/s, on…',
    formats: ['qcm'],
    reponse: 'divise par 3,6',
    distracteurs: ['multiplie par 3,6', 'divise par 1 000', 'divise par 60', 'divise par 3 600', 'multiplie par 1 000'],
    aide: '90 km/h = 90 000 m / 3 600 s = 25 m/s. Un résultat en m/s est toujours plus petit.',
  },
  {
    id: 'conversions.n3.ms-vers-kmh',
    question: 'Des m/s en km/h',
    formats: ['saisie'],
    aide: 'On multiplie par 3,6.',
    generer() {
      const v = auHasard([5, 10, 15, 20, 25, 30, 40, 50, 2.5, 100, 340]);
      return { question: `${nombreFr(v)} m/s = ? km/h`, reponse: `${nombreFr(v * 3.6)} km/h`, nombre: net(v * 3.6), unite: 'km/h' };
    },
  },
  {
    id: 'conversions.n3.kmh-vers-ms',
    question: 'Des km/h en m/s',
    formats: ['saisie'],
    aide: 'On divise par 3,6.',
    generer() {
      const v = auHasard([18, 36, 54, 72, 90, 108, 126, 144, 180, 360, 900]);
      return { question: `${v} km/h = ? m/s`, reponse: `${nombreFr(v / 3.6)} m/s`, nombre: net(v / 3.6), unite: 'm/s' };
    },
  },
  {
    id: 'conversions.n3.origine-3-6',
    question: 'D’où vient le facteur 3,6 entre m/s et km/h ?',
    formats: ['retournement'],
    reponse: '1 km/h = 1 000 m / 3 600 s, et 3 600 / 1 000 = 3,6.',
  },
  {
    id: 'conversions.n3.vraisemblance-vitesses',
    question: 'Cette vitesse est-elle vraisemblable ?',
    formats: ['vraifaux'],
    aide: 'Une valeur absurde vient presque toujours d’une conversion : des km/h pris pour des m/s.',
    generer() {
      const cas = auHasard([
        ['Un piéton marche à 5 000 m/s', false, 'Faux : un piéton marche à environ 1,4 m/s (5 km/h).'],
        ['Un piéton marche à 1,4 m/s', true, 'Vrai : 1,4 × 3,6 ≈ 5 km/h.'],
        ['Un TGV roule à 300 m/s', false, 'Faux : 300 km/h ≈ 83 m/s.'],
        ['Un TGV roule à 83 m/s', true, 'Vrai : 83 × 3,6 ≈ 300 km/h.'],
        ['Le son se propage dans l’air à 340 m/s', true, 'Vrai : environ 1 200 km/h.'],
        ['Le son se propage dans l’air à 340 km/h', false, 'Faux : 340 m/s, soit environ 1 200 km/h.'],
        ['Un cycliste roule à 6 m/s', true, 'Vrai : environ 22 km/h.'],
        ['Une voiture sur autoroute roule à 130 m/s', false, 'Faux : 130 km/h ≈ 36 m/s.'],
      ]);
      return { question: `« ${cas[0]} »`, vrai: cas[1], reponse: cas[2] };
    },
  },
  {
    id: 'conversions.n3.m2-en-cm2',
    question: '1 m² = ? cm²',
    formats: ['qcm'],
    reponse: '10^{4}',
    distracteurs: ['10^{2}', '10^{3}', '10^{6}', '10^{-4}', '10^{-2}', '200'],
    aide: `1 m² = 100 cm × 100 cm = 10^{4} cm². ${AIDE_SURFACES}`,
  },
  familleConversion('conversions.n3.surfaces-m2', 'Surfaces : du m² vers plus petit', [
    [['m²', 0], ['cm²', -4]], [['m²', 0], ['dm²', -2]], [['m²', 0], ['mm²', -6]], [['dm²', -2], ['cm²', -4]],
  ], AIDE_SURFACES),
  familleConversion('conversions.n3.surfaces-km2', 'Surfaces : km², hectares et m²', [
    [['km²', 6], ['m²', 0]], [['m²', 0], ['km²', 6]], [['hm²', 4], ['m²', 0]], [['km²', 6], ['hm²', 4]],
  ], `${AIDE_SURFACES} Un hm² est un hectare.`),
  familleConversion('conversions.n3.surfaces-vers-m2', 'Surfaces : vers le m²', [
    [['cm²', -4], ['m²', 0]], [['mm²', -6], ['m²', 0]], [['dm²', -2], ['m²', 0]], [['mm²', -6], ['cm²', -4]],
  ], AIDE_SURFACES),
  {
    id: 'conversions.n3.m3-en-cm3',
    question: '1 m³ = ? cm³',
    formats: ['qcm'],
    reponse: '10^{6}',
    distracteurs: ['10^{3}', '10^{2}', '10^{9}', '10^{4}', '10^{-6}', '300'],
    aide: `Les exposants se multiplient par 3 : 1 m³ = (10^{2} cm)³ = 10^{6} cm³. ${AIDE_SURFACES}`,
  },
  {
    id: 'conversions.n3.regle-1-2-3',
    question: 'Longueurs, surfaces, volumes : que devient l’exposant du préfixe ?',
    formats: ['retournement'],
    reponse: '×1 pour une longueur · ×2 pour une surface · ×3 pour un volume',
    aide: '1 km = 10^{3} m ; 1 km² = 10^{6} m² ; 1 km³ = 10^{9} m³.',
  },
  familleConversion('conversions.n3.m3-vers-litres', 'Des m³ vers les litres', [
    [['m³', 3], ['L', 0]], [['m³', 3], ['dm³', 0]], [['m³', 3], ['hL', 2]],
  ], '1 m³ = 1 000 L. Ne jamais mélanger les litres et les m³ dans un même calcul.'),
  familleConversion('conversions.n3.litres-vers-m3', 'Des litres vers les m³', [
    [['L', 0], ['m³', 3]], [['mL', -3], ['m³', 3]], [['cm³', -3], ['m³', 3]], [['dm³', 0], ['m³', 3]],
  ], 'La conversion la plus oubliée de l’année : 1,2 L = 1,2 × 10^{-3} m³.'),
  familleConversion('conversions.n3.m3-et-ml', 'm³, mL et cm³', [
    [['m³', 3], ['mL', -3]], [['m³', 3], ['cm³', -3]], [['mm³', -6], ['mL', -3]], [['mL', -3], ['mm³', -6]],
  ], '1 m³ = 10^{6} cm³ = 10^{6} mL.'),
  {
    id: 'conversions.n3.g-cm3-en-kg-m3',
    question: '1 g/cm³ = ? kg/m³',
    formats: ['qcm'],
    reponse: '1 000',
    distracteurs: ['1', '0,001', '100', '10^{6}', '10', '10^{-6}'],
    aide: '1 g/cm³ = 10^{-3} kg / 10^{-6} m³ = 10^{3} kg/m³. L’eau : 1,0 g/cm³ = 1 000 kg/m³.',
  },
  {
    id: 'conversions.n3.g-ml-en-g-l',
    question: '1 g/mL = ? g/L',
    formats: ['qcm'],
    reponse: '1 000',
    distracteurs: ['1', '0,001', '100', '10', '10^{6}'],
    aide: 'Il y a 1 000 mL dans un litre : 1 000 fois plus de grammes.',
  },
  familleComposee('conversions.n3.composees-g-kg', 'Unités composées : g, kg, L, cL, m³', [
    ['g/L', 'kg/L', 1e-3], ['kg/L', 'g/L', 1e3], ['g/L', 'g/mL', 1e-3], ['g/cL', 'kg/L', 1e-1],
    ['kg/m³', 'g/L', 1], ['g/L', 'kg/m³', 1], ['g/cm³', 'kg/L', 1], ['kg/L', 'g/cL', 10],
  ], 'On convertit le haut et le bas séparément, puis on contrôle : le nombre doit-il grandir ou rétrécir ?'),
  familleComposee('conversions.n3.composees-mg', 'Unités composées : mg, µg, mL', [
    ['mg/L', 'g/mL', 1e-6], ['mg/L', 'g/L', 1e-3], ['µg/mL', 'mg/L', 1], ['g/L', 'mg/mL', 1],
    ['mg/mL', 'g/L', 1], ['µg/L', 'mg/L', 1e-3], ['g/L', 'µg/mL', 1e3],
  ], '2,5 mg/L = 2,5 × 10^{-3} g / 10^{3} mL = 2,5 × 10^{-6} g/mL.'),
  {
    id: 'conversions.n3.eau-equivalences',
    question: '« Pour l’eau, 1,0 g/mL = 1,0 kg/L = 1 000 g/L »',
    formats: ['vraifaux'],
    vrai: true,
    reponse: 'Vrai : trois écritures de la même masse volumique.',
    aide: 'Pour l’eau, 1 g ↔ 1 mL : bien pratique pour vérifier un résultat.',
  },
  {
    id: 'conversions.n3.masse-eau',
    question: 'Masse d’un volume d’eau',
    formats: ['qcm'],
    aide: 'L’eau a une masse volumique de 1,0 g/mL : 1 mL d’eau pèse 1 g.',
    generer() {
      const v = auHasard([250, 500, 150, 330, 750, 1500, 20]);
      const bonne = `${nombreFr(v)} g`;
      return {
        question: `Masse de ${nombreFr(v)} mL d’eau ?`,
        reponse: bonne,
        distracteurs: pieges(bonne, [`${nombreFr(v / 1000)} g`, `${nombreFr(v / 10)} g`, `${nombreFr(v)} kg`,
          `${nombreFr(v * 1000)} g`, `${nombreFr(v / 100)} g`]),
      };
    },
  },
  {
    id: 'conversions.n3.masse-dissoute',
    question: 'Masse dissoute dans une solution',
    formats: ['saisie'],
    aide: 'm = C_{m} × V, avec V en litres : on convertit les mL d’abord.',
    generer() {
      const c = auHasard([10, 20, 40, 50, 5, 2.5, 100]);
      const v = auHasard([50, 100, 200, 250, 20, 500]);
      const m = net((c * v) / 1000);
      return { question: `Une solution à ${nombreFr(c)} g/L. Masse dissoute dans ${v} mL ?`, reponse: `${nombreFr(m)} g`, nombre: m, unite: 'g' };
    },
  },
  {
    id: 'conversions.n3.mol-l-mmol-ml',
    question: '« 1 mol/L = 1 mmol/mL »',
    formats: ['vraifaux'],
    vrai: true,
    reponse: 'Vrai : on divise le haut et le bas par 1 000.',
  },
  {
    id: 'conversions.n3.debits',
    question: 'Des L/min en m³/h',
    formats: ['saisie'],
    aide: '1 L/min = 10^{-3} m³ / (1/60) h = 0,06 m³/h.',
    generer() {
      const q = auHasard([5, 10, 15, 20, 25, 50, 100]);
      return { question: `${q} L/min = ? m³/h`, reponse: `${nombreFr(q * 0.06)} m³/h`, nombre: net(q * 0.06), unite: 'm³/h' };
    },
  },
  {
    id: 'conversions.n3.kwh-en-joules',
    question: '1 kWh = ? J',
    formats: ['qcm'],
    reponse: '3,6 × 10^{6}',
    distracteurs: ['1 000', '3 600', '3,6 × 10^{3}', '10^{6}', '3,6 × 10^{9}'],
    aide: '1 kWh = 1 000 W × 3 600 s = 3,6 × 10^{6} J.',
  },
  familleComposee('conversions.n3.energies-massiques', 'Énergies massiques et molaires', [
    ['kJ/kg', 'J/kg', 1e3], ['MJ/kg', 'J/kg', 1e6], ['kJ/mol', 'J/mol', 1e3], ['J/kg', 'kJ/kg', 1e-3], ['MJ/kg', 'kJ/kg', 1e3],
  ], 'L = −270 kJ/kg = −270 000 J/kg : une masse laissée en g donnerait un résultat mille fois trop grand.'),
  {
    id: 'conversions.n3.bar-en-pa',
    question: '1 bar = ? Pa',
    formats: ['qcm'],
    reponse: '10^{5}',
    distracteurs: ['10^{3}', '1 013', '10^{6}', '760', '10^{2}'],
    aide: 'La pression atmosphérique vaut environ 1 013 hPa ≈ 1 bar.',
  },
];

/* ---------- Niveau 4 : calcul de tête (terminale) ---------- */

const NIVEAU_4 = [
  {
    id: 'conversions.n4.quotient',
    question: 'Quotient de tête',
    formats: ['saisie'],
    aide: 'On sépare les chiffres des puissances de dix, on calcule chaque partie, puis on réassemble.',
    generer() {
      const [a, b] = auHasard([[6, 3], [8, 4], [9, 3], [8, 2], [6, 2], [4, 2], [9, 4.5]]);
      const m = exposantNonNul(-12, 12);
      const n = exposantNonNul(-12, 12);
      const x = net((a / b) * 10 ** (m - n));
      return { question: `\\frac{${sci(a, m)}}{${sci(b, n)}} = ?`, reponse: enScientifique(x), nombre: x };
    },
  },
  {
    id: 'conversions.n4.fraction-trois-termes',
    question: 'Fraction à trois termes',
    formats: ['saisie'],
    aide: 'Chiffres d’un côté, puissances de dix de l’autre : ce qui passe sous la barre change de signe.',
    generer() {
      const [a, b, c] = auHasard([[4, 3, 6], [2, 6, 4], [3, 8, 6], [5, 6, 3], [2, 9, 6], [4, 5, 2], [6, 6, 4], [8, 3, 6], [2, 4, 8]]);
      const m = exposantNonNul(-8, 8);
      const n = exposantNonNul(-8, 8);
      const p = exposantNonNul(-8, 8);
      const x = net(((a * b) / c) * 10 ** (m + n - p));
      return { question: `\\frac{${sci(a, m)} × ${sci(b, n)}}{${sci(c, p)}} = ?`, reponse: enScientifique(x), nombre: x };
    },
  },
  {
    id: 'conversions.n4.fraction-quatre-termes',
    question: 'Fraction à quatre termes',
    formats: ['saisie'],
    aide: 'Chiffres d’un côté, puissances de dix de l’autre : ce qui passe sous la barre change de signe.',
    generer() {
      const [a, b, c, d] = auHasard([[2, 9, 3, 2], [4, 6, 3, 2], [6, 5, 3, 2], [8, 3, 4, 2], [3, 8, 2, 6], [9, 4, 6, 2], [5, 8, 4, 5]]);
      const [m, n, p, q] = [exposantNonNul(-8, 8), exposantNonNul(-8, 8), exposantNonNul(-8, 8), exposantNonNul(-8, 8)];
      const x = net(((a * b) / (c * d)) * 10 ** (m + n - p - q));
      return { question: `\\frac{${sci(a, m)} × ${sci(b, n)}}{${sci(c, p)} × ${sci(d, q)}} = ?`, reponse: enScientifique(x), nombre: x };
    },
  },
  {
    id: 'conversions.n4.puissance-negative',
    question: 'Puissance d’une puissance de dix négative',
    formats: ['qcm'],
    aide: AIDE_EXPOSANTS,
    generer() {
      const a = entierEntre(-9, -1);
      const b = auHasard([2, 3, -2]);
      const bonne = p10(a * b);
      return {
        question: `(${p10(a)})^{${b}} = ?`,
        reponse: bonne,
        distracteurs: pieges(bonne, [a + b, a - b, -a * b, a * b - 1, b - a].map(p10)),
      };
    },
  },
  {
    id: 'conversions.n4.regles-vrai-faux',
    question: 'Règles des puissances : vrai ou faux ?',
    formats: ['vraifaux'],
    aide: AIDE_EXPOSANTS,
    generer() {
      const a = exposantNonNul(-6, 6);
      const b = exposantNonNul(-6, 6);
      const cas = auHasard([
        [`${p10(a)} / ${p10(b)} = ${p10(a - b)}`, true],
        [`${p10(a)} / ${p10(b)} = ${p10(a + b)}`, a + b === a - b],
        [`${p10(a)} × ${p10(b)} = ${p10(a * b)}`, a * b === a + b],
        [`${p10(a)} × ${p10(b)} = ${p10(a + b)}`, true],
        [`1 / ${p10(a)} = ${p10(-a)}`, true],
        [`(${p10(a)})^{2} = ${p10(a + 2)}`, a === 2],
      ]);
      return { question: `« ${cas[0]} »`, vrai: cas[1], reponse: cas[1] ? 'Vrai' : 'Faux' };
    },
  },
  {
    id: 'conversions.n4.sommes-vrai-faux',
    question: 'Sommes et produits de puissances : vrai ou faux ?',
    formats: ['vraifaux'],
    aide: 'On n’additionne les exposants que pour un produit. Une somme se calcule en revenant au même exposant.',
    generer() {
      const a = exposantNonNul(-6, 6);
      const cas = auHasard([
        [`${p10(a)} + ${p10(a)} = ${p10(2 * a)}`, false, `Faux : ${p10(a)} + ${p10(a)} = 2 × ${p10(a)}`],
        [`${p10(a)} + ${p10(a)} = 2 × ${p10(a)}`, true, 'Vrai'],
        [`${p10(a)} × ${p10(a)} = ${p10(2 * a)}`, true, 'Vrai'],
        [`${p10(a)} × ${p10(a)} = 2 × ${p10(a)}`, false, `Faux : ${p10(a)} × ${p10(a)} = ${p10(2 * a)}`],
      ]);
      return { question: `« ${cas[0]} »`, vrai: cas[1], reponse: cas[2] };
    },
  },
  {
    id: 'conversions.n4.somme-scientifique',
    question: 'Somme de deux nombres en écriture scientifique',
    formats: ['qcm'],
    aide: 'On écrit les deux termes avec la même puissance de dix, puis on additionne les nombres.',
    generer() {
      const a = entierEntre(1, 8);
      const b = entierEntre(1, 9);
      const m = exposantNonNul(-6, 6);
      const bonne = sci(net(a + b / 10), m);
      return {
        question: `${sci(a, m)} + ${sci(b, m - 1)} = ?`,
        reponse: bonne,
        distracteurs: pieges(bonne, [`${nombreFr(a + b)} × 10^{${2 * m - 1}}`, `${nombreFr(a + b)} × 10^{${m}}`,
          `${nombreFr(a * b)} × 10^{${2 * m - 1}}`, sci(net(a + b / 10), m - 1), `${nombreFr(a + b)} × 10^{${m - 1}}`]),
      };
    },
  },
  {
    id: 'conversions.n4.carre',
    question: 'Carré d’un nombre en écriture scientifique',
    formats: ['qcm'],
    aide: 'Le nombre est élevé au carré, l’exposant multiplié par 2.',
    generer() {
      const a = auHasard([2, 3, 1.5, 1.2]);
      const n = exposantNonNul(-9, 9);
      const bonne = enScientifique(a * a * 10 ** (2 * n));
      return {
        question: `(${sci(a, n)})^{2} = ?`,
        reponse: bonne,
        distracteurs: pieges(bonne, [sci(a, 2 * n), sci(net(a * a), n), sci(2 * a, 2 * n), sci(net(a * a), n * n), sci(2 * a, n),
          sci(net(a * a), 2 * n + 1), sci(a, n + 2)]),
      };
    },
  },
  {
    id: 'conversions.n4.inverse',
    question: 'Inverse d’un nombre en écriture scientifique',
    formats: ['saisie'],
    aide: '1 / (a × 10ⁿ) = (1/a) × 10⁻ⁿ : l’exposant change de signe.',
    generer() {
      const a = auHasard([2, 4, 5, 8, 2.5]);
      const n = exposantNonNul(-9, 9);
      const x = net((1 / a) * 10 ** -n);
      return { question: `\\frac{1}{${sci(a, n)}} = ?`, reponse: enScientifique(x), nombre: x };
    },
  },
  {
    id: 'conversions.n4.racine',
    question: 'Racine carrée de tête',
    formats: ['saisie'],
    aide: '√(a × 10^{2n}) = √a × 10ⁿ : l’exposant doit être pair pour se diviser par 2.',
    generer() {
      const a = entierEntre(2, 9);
      const n = exposantNonNul(-8, 8);
      const x = net(a * 10 ** n);
      return { question: `\\sqrt{${sci(a * a, 2 * n)}} = ?`, reponse: enScientifique(x), nombre: x };
    },
  },
  {
    id: 'conversions.n4.racine-exposant-impair',
    question: '\\sqrt{10^{7}} ≈ ?',
    formats: ['qcm'],
    reponse: '3,2 × 10^{3}',
    distracteurs: ['10^{3}', '3,5 × 10^{3}', '10^{4}', '5 × 10^{3}', '10^{3,5}'],
    aide: 'On rend l’exposant pair : 10^{7} = 10 × 10^{6}, donc √ = √10 × 10^{3} ≈ 3,2 × 10^{3}.',
  },
  {
    id: 'conversions.n4.rapport-echelles',
    question: 'Combien de fois plus grand ?',
    formats: ['saisie'],
    aide: 'Un rapport de deux puissances de dix : on soustrait les exposants.',
    generer() {
      const [grand, eg, petit, ep] = auHasard([
        ['un atome (10^{-10} m)', -10, 'son noyau (10^{-15} m)', -15],
        ['la Terre (10^{7} m)', 7, 'un humain (1 m)', 0],
        ['une cellule (10^{-5} m)', -5, 'un atome (10^{-10} m)', -10],
        ['le Soleil (10^{9} m)', 9, 'la Terre (10^{7} m)', 7],
        ['un virus (10^{-7} m)', -7, 'un atome (10^{-10} m)', -10],
        ['un cheveu d’épaisseur (10^{-4} m)', -4, 'une bactérie (10^{-6} m)', -6],
      ]);
      return { question: `Combien de fois ${grand} est-il plus grand que ${petit} ?`, reponse: p10(eg - ep), nombre: 10 ** (eg - ep) };
    },
  },
  {
    id: 'conversions.n4.photon',
    question: 'Énergie d’un photon, de tête',
    formats: ['saisie'],
    tolerance: 0.12,
    aide: 'E = hc/λ : on calcule 6,6 × 3 / … d’un côté, les puissances de dix de l’autre. Un ordre de grandeur juste suffit.',
    generer() {
      const l = auHasard([300, 400, 500, 600]);
      const e = net((6.6e-34 * 3e8) / (l * 1e-9));
      return {
        question: `E = hc/λ avec h = 6,6 × 10^{-34} J·s, c = 3 × 10^{8} m/s, λ = ${l} nm. E ≈ ?`,
        reponse: `≈ ${enScientifique(Number(e.toPrecision(2)))} J`,
        nombre: e,
        unite: 'J',
      };
    },
  },
  {
    id: 'conversions.n4.frequence',
    question: 'Fréquence d’une radiation',
    formats: ['saisie'],
    aide: 'f = c/λ, avec λ en mètres : 1 nm = 10^{-9} m.',
    generer() {
      const l = auHasard([300, 600, 500, 400, 750, 200]);
      const f = net(3e8 / (l * 1e-9));
      return { question: `f = c/λ avec c = 3 × 10^{8} m/s et λ = ${l} nm. f = ?`, reponse: `${enScientifique(f)} Hz`, nombre: f, unite: 'Hz' };
    },
  },
  {
    id: 'conversions.n4.duree-lumiere',
    question: 'Durée de trajet de la lumière',
    formats: ['saisie'],
    tolerance: 0.05,
    aide: 'Δt = d/c, avec c = 3 × 10^{8} m/s.',
    generer() {
      const [objet, d] = auHasard([['du Soleil à la Terre', 1.5e11], ['de la Lune à la Terre', 3.6e8], ['sur 3 × 10^{8} m', 3e8],
        ['sur 9 × 10^{8} m', 9e8], ['de Neptune au Soleil', 4.5e12]]);
      const t = net(d / 3e8);
      return { question: `Durée du trajet de la lumière ${objet} (d = ${enScientifique(d)} m) ?`, reponse: `${valeurFr(t)} s`, nombre: t, unite: 's' };
    },
  },
  {
    id: 'conversions.n4.nombre-entites',
    question: 'Nombre d’entités',
    formats: ['saisie'],
    aide: 'N = n × N_{A}, avec N_{A} = 6 × 10^{23} mol^{-1}.',
    generer() {
      const [a, e] = auHasard([[2, -3], [5, -2], [5, -1], [3, -4], [1.5, -1], [2, -2]]);
      const n = net(a * 10 ** e);
      const x = net(n * 6e23);
      return { question: `Nombre d’entités dans ${sci(a, e)} mol (N_{A} = 6 × 10^{23} mol^{-1}) ?`, reponse: enScientifique(x), nombre: x };
    },
  },
  {
    id: 'conversions.n4.mc2',
    question: 'E = mc²',
    formats: ['saisie'],
    aide: 'La masse en kg, c = 3 × 10^{8} m/s, donc c² = 9 × 10^{16} m²/s².',
    generer() {
      const [texte, m] = auHasard([['1 g', 1e-3], ['1 kg', 1], ['2 g', 2e-3], ['1 mg', 1e-6], ['10 g', 1e-2]]);
      const e = net(m * 9e16);
      return { question: `E = mc² pour m = ${texte} (c = 3 × 10^{8} m/s). E = ?`, reponse: `${enScientifique(e)} J`, nombre: e, unite: 'J' };
    },
  },
  {
    id: 'conversions.n4.electronvolts',
    question: 'Des électronvolts en joules',
    formats: ['saisie'],
    aide: '1 eV = 1,6 × 10^{-19} J.',
    generer() {
      const e = auHasard([2, 1.5, 3, 5, 10, 0.5]);
      const j = net(e * 1.6e-19);
      return { question: `${nombreFr(e)} eV = ? J (1 eV = 1,6 × 10^{-19} J)`, reponse: `${enScientifique(j)} J`, nombre: j, unite: 'J' };
    },
  },
  {
    id: 'conversions.n4.produit-ionique',
    question: '[HO⁻] à partir de [H₃O⁺]',
    formats: ['saisie'],
    aide: 'À 25 °C, [H₃O⁺] × [HO⁻] = 10^{-14} : on soustrait les exposants.',
    generer() {
      const k = entierEntre(1, 13);
      return {
        question: `[H_{3}O^{+}] = 10^{-${k}} mol/L. [HO^{-}] = 10^{-14} / [H_{3}O^{+}] = ?`,
        reponse: `${p10(k - 14)} mol/L`,
        nombre: 10 ** (k - 14),
        unite: 'mol/L',
      };
    },
  },
  {
    id: 'conversions.n4.produit-a-renormaliser',
    question: 'Produit à remettre en écriture scientifique',
    formats: ['qcm'],
    aide: '15 × 10ⁿ = 1,5 × 10ⁿ⁺¹ : la virgule recule d’un rang, l’exposant monte d’un.',
    generer() {
      const [a, b] = auHasard([[3, 5], [4, 5], [2, 6], [5, 5], [4, 4], [8, 2], [6, 5]]);
      const m = exposantNonNul(-9, 9);
      const n = exposantNonNul(-9, 9);
      const bonne = sci(net((a * b) / 10), m + n + 1);
      return {
        question: `(${sci(a, m)}) × (${sci(b, n)}) = ?`,
        reponse: bonne,
        distracteurs: pieges(bonne, [`${a * b} × 10^{${m * n}}`, sci(net((a * b) / 10), m + n), `${a + b} × 10^{${m + n}}`,
          sci(net((a * b) / 10), m + n - 1), `${a * b} × 10^{${m + n + 1}}`]),
      };
    },
  },
  {
    id: 'conversions.n4.calculatrice-erreur',
    question: 'La calculatrice affiche 1,66 × 10^{22} pour 1 ÷ 6,02 ^ 23. Pourquoi est-ce faux ?',
    formats: ['retournement'],
    reponse: 'Elle a calculé (1 ÷ 6,02) × 10^{23}. Il fallait la touche ×10ˣ : 1,66 × 10^{-24}.',
    aide: 'L’écart : 46 ordres de grandeur. Un ordre de grandeur estimé de tête avant de taper l’aurait signalé.',
  },
];

/* ---------- Niveau 5 : logarithme décimal et premières équations ---------- */

const FORMULES_A_ISOLER = [
  ['v = d / t', 't', 't = d / v', ['t = v / d', 't = d × v', 't = v − d', 't = 1 / (d × v)']],
  ['v = d / t', 'd', 'd = v × t', ['d = v / t', 'd = t / v', 'd = v + t', 'd = v − t']],
  ['n = m / M', 'm', 'm = n × M', ['m = n / M', 'm = M / n', 'm = n + M', 'm = n − M']],
  ['n = m / M', 'M', 'M = m / n', ['M = n / m', 'M = m × n', 'M = n − m', 'M = 1 / (m n)']],
  ['C = n / V', 'V', 'V = n / C', ['V = C / n', 'V = n × C', 'V = C − n', 'V = 1 / (n C)']],
  ['U = R × I', 'I', 'I = U / R', ['I = R / U', 'I = U × R', 'I = U − R', 'I = R − U']],
  ['U = R × I', 'R', 'R = U / I', ['R = I / U', 'R = U × I', 'R = U − I', 'R = I − U']],
  ['P = U × I', 'I', 'I = P / U', ['I = U / P', 'I = P × U', 'I = P − U', 'I = U − P']],
  ['ρ = m / V', 'V', 'V = m / ρ', ['V = ρ / m', 'V = m × ρ', 'V = m − ρ', 'V = 1 / (m ρ)']],
  ['E = P × Δt', 'Δt', 'Δt = E / P', ['Δt = P / E', 'Δt = E × P', 'Δt = E − P', 'Δt = P − E']],
  ['λ = c / f', 'f', 'f = c / λ', ['f = λ / c', 'f = c × λ', 'f = c − λ', 'f = 1 / (c λ)']],
];

const NIVEAU_5 = [
  {
    id: 'conversions.n5.log-puissance',
    question: 'Logarithme d’une puissance de dix',
    formats: ['saisie'],
    aide: 'log(10ⁿ) = n : le logarithme décimal rend l’exposant.',
    generer() {
      const n = entierEntre(-12, 12);
      return { question: `log(${p10(n)}) = ?`, reponse: nombreFr(n), nombre: n };
    },
  },
  {
    id: 'conversions.n5.log-decimal',
    question: 'Logarithme d’un nombre décimal',
    formats: ['saisie'],
    aide: 'On écrit d’abord le nombre comme une puissance de dix : 0,01 = 10^{-2}.',
    generer() {
      const n = auHasard([-4, -3, -2, -1, 1, 2, 3, 4, 6]);
      return { question: `log(${nombreFr(10 ** n)}) = ?`, reponse: nombreFr(n), nombre: n };
    },
  },
  {
    id: 'conversions.n5.exposant-inconnu',
    question: '10^{x} = … : que vaut x ?',
    formats: ['saisie'],
    aide: 'x = log(…) : c’est le nombre de rangs dont la virgule s’est déplacée.',
    generer() {
      const n = auHasard([-6, -4, -3, -2, -1, 2, 3, 5]);
      return { question: `10^{x} = ${nombreFr(10 ** n)}. Que vaut x ?`, reponse: nombreFr(n), nombre: n };
    },
  },
  {
    id: 'conversions.n5.log-de-1',
    question: 'log(1) = ?',
    formats: ['qcm'],
    reponse: '0',
    distracteurs: ['1', '10', '−1', 'n’existe pas'],
    aide: '1 = 10^{0}, donc log(1) = 0.',
  },
  {
    id: 'conversions.n5.signe-du-log',
    question: 'Signe d’un logarithme : vrai ou faux ?',
    formats: ['vraifaux'],
    aide: 'log(x) < 0 pour 0 < x < 1 ; log(x) > 0 pour x > 1.',
    generer() {
      const x = auHasard([0.5, 0.02, 2, 50, 0.9, 1.5, 300]);
      const vrai = x > 1;
      return { question: `« log(${nombreFr(x)}) > 0 »`, vrai, reponse: `${vrai ? 'Vrai' : 'Faux'} : ${nombreFr(x)} est ${vrai ? 'supérieur' : 'inférieur'} à 1.` };
    },
  },
  {
    id: 'conversions.n5.log-negatif',
    question: '« log(−2) existe »',
    formats: ['vraifaux'],
    vrai: false,
    reponse: 'Faux : le logarithme n’est défini que pour un nombre strictement positif.',
  },
  {
    id: 'conversions.n5.log-somme',
    question: '« log(a + b) = log a + log b »',
    formats: ['vraifaux'],
    vrai: false,
    reponse: 'Faux : c’est log(a × b) = log a + log b.',
  },
  {
    id: 'conversions.n5.log-2-et-5',
    question: 'Logarithme avec log 2 ≈ 0,3',
    formats: ['saisie'],
    tolerance: 0.02,
    aide: 'log(a × 10ⁿ) = log a + n ; log 2 ≈ 0,3 et log 5 = 1 − log 2 ≈ 0,7.',
    generer() {
      const a = auHasard([2, 5]);
      const n = entierEntre(-3, 3);
      const l = net((a === 2 ? 0.3 : 0.7) + n);
      return { question: `Sachant log 2 ≈ 0,3, que vaut log(${nombreFr(a * 10 ** n)}) ?`, reponse: `≈ ${nombreFr(l)}`, nombre: l };
    },
  },
  {
    id: 'conversions.n5.ph-vers-concentration',
    question: 'Du pH à la concentration',
    formats: ['qcm'],
    aide: '[H₃O⁺] = 10^{−pH} mol/L.',
    generer() {
      const k = entierEntre(1, 13);
      const bonne = `${p10(-k)} mol/L`;
      return {
        question: `pH = ${k}. Que vaut [H_{3}O^{+}] ?`,
        reponse: bonne,
        distracteurs: pieges(bonne, [`${k} mol/L`, `${p10(k)} mol/L`, `${p10(k - 14)} mol/L`, `−${k} mol/L`, `${nombreFr(k / 10)} mol/L`]),
      };
    },
  },
  {
    id: 'conversions.n5.concentration-vers-ph',
    question: 'De la concentration au pH',
    formats: ['saisie'],
    aide: 'pH = −log [H₃O⁺].',
    generer() {
      const k = entierEntre(1, 13);
      return { question: `[H_{3}O^{+}] = 10^{-${k}} mol/L. pH = ?`, reponse: nombreFr(k), nombre: k };
    },
  },
  {
    id: 'conversions.n5.ph-approche',
    question: 'pH avec log 2 ≈ 0,3',
    formats: ['saisie'],
    tolerance: 0.02,
    aide: 'pH = −log(a × 10^{−k}) = k − log a.',
    generer() {
      const a = auHasard([2, 5]);
      const k = entierEntre(2, 11);
      const ph = net(k - (a === 2 ? 0.3 : 0.7));
      return { question: `[H_{3}O^{+}] = ${sci(a, -k)} mol/L. pH ≈ ? (log 2 ≈ 0,3)`, reponse: `≈ ${nombreFr(ph)}`, nombre: ph };
    },
  },
  {
    id: 'conversions.n5.ph-dilution-10',
    question: 'Si [H₃O⁺] est divisée par 10, le pH…',
    formats: ['qcm'],
    reponse: 'augmente de 1',
    distracteurs: ['diminue de 1', 'est multiplié par 10', 'est divisé par 10', 'augmente de 10'],
    aide: 'Diviser par 10, c’est retirer 1 à l’exposant ; et pH = −exposant.',
  },
  {
    id: 'conversions.n5.dilution-acide-fort',
    question: 'Dilution d’un acide fort',
    formats: ['qcm'],
    aide: 'Diluer 10ᵈ fois divise [H₃O⁺] par 10ᵈ : le pH augmente de d.',
    generer() {
      const [texte, d] = auHasard([['10', 1], ['100', 2], ['1 000', 3]]);
      const bonne = `augmente de ${d}`;
      return {
        question: `On dilue ${texte} fois une solution d’acide fort. Le pH…`,
        reponse: bonne,
        distracteurs: pieges(bonne, [`augmente de ${texte}`, `diminue de ${d}`, `est multiplié par ${texte}`, 'ne change pas', `est divisé par ${texte}`]),
      };
    },
  },
  {
    id: 'conversions.n5.niveau-sonore',
    question: 'Niveau sonore',
    formats: ['saisie'],
    aide: 'L = 10 log(I / I₀) : I / I₀ est une puissance de dix, son log est l’exposant.',
    generer() {
      const k = entierEntre(2, 12);
      return {
        question: `L = 10 log(I / I_{0}) avec I = 10^{-${k}} W/m² et I_{0} = 10^{-12} W/m². L = ?`,
        reponse: `${10 * (12 - k)} dB`,
        nombre: 10 * (12 - k),
        unite: 'dB',
      };
    },
  },
  {
    id: 'conversions.n5.intensite-fois-10',
    question: 'L’intensité sonore est multipliée par 10. Le niveau…',
    formats: ['qcm'],
    reponse: 'augmente de 10 dB',
    distracteurs: ['est multiplié par 10', 'augmente de 1 dB', 'augmente de 3 dB', 'double'],
    aide: '10 log(10 × I / I₀) = 10 log(I / I₀) + 10.',
  },
  {
    id: 'conversions.n5.intensite-double',
    question: 'L’intensité sonore double. Le niveau…',
    formats: ['qcm'],
    reponse: 'augmente de 3 dB',
    distracteurs: ['double', 'augmente de 2 dB', 'augmente de 6 dB', 'augmente de 10 dB'],
    aide: '10 × log 2 ≈ 10 × 0,3 = 3 dB.',
  },
  {
    id: 'conversions.n5.intensite-depuis-niveau',
    question: 'Intensité sonore à partir du niveau',
    formats: ['saisie'],
    aide: 'I = I₀ × 10^{L/10}.',
    generer() {
      const l = auHasard([20, 30, 40, 50, 60, 70, 80, 90, 100, 120]);
      return {
        question: `L = ${l} dB. I = ? (I_{0} = 10^{-12} W/m²)`,
        reponse: `${p10(l / 10 - 12)} W/m²`,
        nombre: 10 ** (l / 10 - 12),
        unite: 'W/m²',
      };
    },
  },
  {
    id: 'conversions.n5.isoler',
    question: 'Isoler une grandeur dans une formule',
    formats: ['qcm'],
    aide: 'Ce qui divise d’un côté multiplie de l’autre, et inversement.',
    generer() {
      const [formule, grandeur, bonne, autres] = auHasard(FORMULES_A_ISOLER);
      return { question: `Isoler ${grandeur} dans ${formule}`, reponse: bonne, distracteurs: autres };
    },
  },
  {
    id: 'conversions.n5.isoler-vitesse-ec',
    question: 'Isoler v dans E_{c} = \\frac{1}{2} m v^{2}',
    formats: ['retournement'],
    reponse: 'v = \\sqrt{\\frac{2E_{c}}{m}}',
    aide: 'On multiplie par 2, on divise par m, puis on prend la racine carrée.',
  },
  {
    id: 'conversions.n5.isoler-temperature',
    question: 'Isoler T dans PV = nRT',
    formats: ['qcm'],
    reponse: 'T = \\frac{PV}{nR}',
    distracteurs: ['T = \\frac{nR}{PV}', 'T = PVnR', 'T = PV − nR', 'T = \\frac{P}{VnR}'],
  },
  {
    id: 'conversions.n5.equation-puissances',
    question: 'Résoudre une équation avec des puissances de dix',
    formats: ['saisie'],
    aide: 'x = (b × 10ⁿ) / (a × 10ᵐ) : on divise les nombres, on soustrait les exposants.',
    generer() {
      const [a, b] = auHasard([[3, 6], [2, 8], [4, 8], [3, 9], [5, 5], [2, 6]]);
      const m = exposantNonNul(-8, 8);
      const n = exposantNonNul(-8, 8);
      const x = net((b / a) * 10 ** (n - m));
      return { question: `${sci(a, m)} × x = ${sci(b, n)}. x = ?`, reponse: enScientifique(x), nombre: x };
    },
  },
];

/** Pièges distincts de la bonne réponse et entre eux. */
function pieges(bonne, liste) {
  return [...new Set(liste)].filter((p) => p !== bonne);
}

Paquets.inscrire({
  cle: 'conversions',
  theme: 'Calcul',
  titre: 'Conversions et puissances de dix',
  resume: 'Cinq niveaux, des préfixes de seconde au logarithme de terminale. Chaque niveau s’ouvre quand le précédent est '
    + 'maîtrisé, ou par un test de positionnement. Les valeurs changent à chaque passage.',
  niveaux: ['seconde', 'premiere', 'terminale'],
  progression: 'niveaux',
  formatFixe: 'mixte',
  consignesParFormat: true,
  sections: [
    { cle: 'n1', titre: 'Niveau 1 · Préfixes et puissances de dix', consigne: null, cartes: NIVEAU_1 },
    { cle: 'n2', titre: 'Niveau 2 · Conversions simples', consigne: null, cartes: NIVEAU_2 },
    { cle: 'n3', titre: 'Niveau 3 · Conversions piégeuses', consigne: null, cartes: NIVEAU_3 },
    { cle: 'n4', titre: 'Niveau 4 · Calcul de tête (terminale)', consigne: null, cartes: NIVEAU_4 },
    { cle: 'n5', titre: 'Niveau 5 · Logarithme et premières équations', consigne: null, cartes: NIVEAU_5 },
  ],
});
