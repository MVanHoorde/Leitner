/* Paquet « Diffraction » (terminale, Ondes et signaux 1.B).
 *
 * Programme (BO spécial n° 8 du 25/07/2019) : caractériser la diffraction dans
 * des situations variées et en citer des conséquences concrètes ; exploiter
 * θ = λ / a ; le cas d'une onde lumineuse diffractée par une fente. On se
 * limite aux ondes progressives sinusoïdales.
 *
 * Notations : λ longueur d'onde, a largeur de la fente (ou diamètre du fil),
 * θ demi-angle caractéristique en radians, D distance fente-écran, L largeur
 * de la tache centrale. Petits angles : tan θ ≈ θ = L / (2D), donc L = 2λD / a.
 * Niveau 2 : valeurs choisies pour un calcul de tête.
 *
 * PROPOSITION à auditer par Loïc (audit: 'brouillon', 35-contenu-chapitres.js).
 * RÈGLE ABSOLUE (32-paquets.js) : un identifiant de carte ne change jamais.
 */

/* ---------- Niveau 1 · Vocabulaire, définitions, formules ---------- */

const DIFFRACTION_N1 = [
  {
    id: 'diffraction.n1.definition',
    question: 'Qu’est-ce que la diffraction d’une onde ?',
    formats: ['retournement', 'qcm'],
    reponse: 'L’étalement des directions de propagation d’une onde qui rencontre une ouverture ou un obstacle',
    distracteurs: [
      'Le changement de fréquence d’une onde dont l’émetteur se déplace',
      'L’addition de deux ondes qui se renforcent ou s’annulent',
      'L’affaiblissement d’une onde au cours de sa propagation',
    ],
  },
  {
    id: 'diffraction.n1.condition',
    question: 'À quelle condition la diffraction est-elle marquée ?',
    formats: ['qcm', 'retournement'],
    reponse: 'Quand la taille a de l’ouverture est du même ordre de grandeur que λ, ou plus petite',
    distracteurs: [
      'Quand l’ouverture est beaucoup plus grande que λ',
      'Quand l’onde a une grande amplitude',
      'Seulement quand l’onde est lumineuse',
    ],
  },
  {
    id: 'diffraction.n1.formule-theta',
    question: 'Quelle relation donne l’angle caractéristique de diffraction θ ?',
    formats: ['qcm', 'retournement'],
    reponse: '$\\theta = \\dfrac{\\lambda}{a}$',
    distracteurs: ['$\\theta = \\dfrac{a}{\\lambda}$', '$\\theta = \\lambda \\times a$', '$\\theta = \\dfrac{2\\lambda}{a}$'],
    aide: 'λ longueur d’onde et a largeur de l’ouverture, dans la même unité ; θ en radians.',
  },
  {
    id: 'diffraction.n1.unite-theta',
    question: 'Dans $\\theta = \\dfrac{\\lambda}{a}$, en quelle unité s’exprime θ ?',
    formats: ['qcm', 'retournement'],
    reponse: 'En radians (rad)',
    distracteurs: ['En degrés (°)', 'En mètres (m)', 'En m⁻¹'],
    aide: 'λ / a est un rapport de deux longueurs : le résultat est un angle en radians, jamais en degrés.',
  },
  {
    id: 'diffraction.n1.unites-lambda-a',
    question: 'Pour calculer λ / a, comment exprimer λ et a ?',
    formats: ['qcm', 'retournement'],
    reponse: 'Dans la même unité, par exemple les deux en mètres',
    distracteurs: ['λ en nm et a en mm', 'λ en m et a en mm', 'Peu importe : θ n’a pas d’unité'],
    aide: '600 nm = 6,00 × 10^{-7} m et 0,20 mm = 2,0 × 10^{-4} m.',
  },
  {
    id: 'diffraction.n1.frequence-inchangee',
    question: '« Après une fente, l’onde diffractée a la même fréquence et la même longueur d’onde que l’onde incidente. »',
    formats: ['vraifaux'],
    vrai: true,
    reponse: 'Vrai : la diffraction change les directions de propagation, ni la fréquence, ni la longueur d’onde, ni la célérité.',
  },
  {
    id: 'diffraction.n1.ouverture-petite',
    question: 'On rétrécit la fente. La tache centrale de diffraction…',
    formats: ['qcm', 'retournement'],
    reponse: '…s’élargit : θ = λ / a augmente quand a diminue',
    distracteurs: ['…rétrécit : θ diminue', '…ne change pas : seule λ compte', '…disparaît'],
  },
  {
    id: 'diffraction.n1.couleur',
    question: 'Même fente, laser rouge puis laser bleu. Quelle lumière est la plus diffractée ?',
    formats: ['qcm', 'retournement'],
    reponse: 'La rouge : sa longueur d’onde est plus grande',
    distracteurs: ['La bleue : sa longueur d’onde est plus grande', 'La bleue : elle est plus énergétique', 'Les deux autant : seule a compte'],
    aide: 'λ rouge ≈ 650 nm, λ bleu ≈ 450 nm : θ = λ / a est plus grand pour le rouge.',
  },
  {
    id: 'diffraction.n1.figure-fente',
    question: 'Une fente fine verticale éclairée par un laser : la figure de diffraction s’étale…',
    formats: ['qcm', 'retournement'],
    reponse: '…horizontalement, perpendiculairement à la fente',
    distracteurs: ['…verticalement, le long de la fente', '…en anneaux concentriques', '…dans toutes les directions à la fois'],
    aide: 'La diffraction est marquée dans la direction où l’ouverture est étroite.',
  },
  {
    id: 'diffraction.n1.tache-centrale',
    question: 'Dans la figure de diffraction d’une fente, comment est la tache centrale ?',
    formats: ['qcm', 'retournement'],
    reponse: 'La plus large et la plus lumineuse, deux fois plus large que les taches voisines',
    distracteurs: ['La plus petite et la plus sombre', 'Aussi large que les autres taches', 'Noire : l’onde s’y annule'],
  },
  {
    id: 'diffraction.n1.largeur-tache',
    question: 'Largeur L de la tache centrale sur un écran à la distance D (petits angles) ?',
    formats: ['qcm', 'retournement'],
    reponse: '$L = \\dfrac{2 \\lambda D}{a}$',
    distracteurs: ['$L = \\dfrac{\\lambda D}{a}$', '$L = \\dfrac{2 a D}{\\lambda}$', '$L = \\dfrac{\\lambda a}{2 D}$'],
    aide: 'tan θ ≈ θ = (L / 2) / D, et θ = λ / a : L = 2λD / a.',
  },
  {
    id: 'diffraction.n1.petits-angles',
    question: 'Pour un petit angle exprimé en radians, $\\tan\\theta \\approx \\;$?',
    formats: ['qcm', 'retournement'],
    reponse: '$\\theta$',
    distracteurs: ['$1$', '$\\dfrac{1}{\\theta}$', '$\\theta^{2}$'],
    aide: 'C’est ce qui permet d’écrire θ = L / (2D) sur l’écran.',
  },
  {
    id: 'diffraction.n1.toutes-ondes',
    question: '« La diffraction ne concerne que la lumière. »',
    formats: ['vraifaux'],
    vrai: false,
    reponse: 'Faux : toutes les ondes diffractent, la houle, le son, les ondes radio comme la lumière.',
  },
  {
    id: 'diffraction.n1.consequence-son',
    question: 'Pourquoi entend-on quelqu’un qui parle dans le couloir, porte ouverte, sans le voir ?',
    formats: ['qcm', 'retournement'],
    reponse: 'Le son, de longueur d’onde proche de la largeur de la porte, est diffracté ; la lumière, de λ bien plus petite, presque pas',
    distracteurs: [
      'Le son va plus vite que la lumière',
      'La lumière est absorbée par l’air du couloir',
      'Le son est réfléchi par le plafond, jamais diffracté',
    ],
  },
  {
    id: 'diffraction.n1.consequence-digue',
    question: 'Derrière l’entrée étroite d’un port, la houle s’étale en demi-cercles. Comment s’appelle ce phénomène ?',
    formats: ['qcm', 'retournement'],
    reponse: 'La diffraction',
    distracteurs: ['Les interférences', 'L’effet Doppler', 'L’atténuation'],
  },
  {
    id: 'diffraction.n1.fil',
    question: '« Un fil fin de diamètre a donne la même figure de diffraction qu’une fente de largeur a. »',
    formats: ['vraifaux'],
    vrai: true,
    reponse: 'Vrai : on l’utilise pour mesurer le diamètre d’un cheveu ou d’un fil avec θ = λ / a.',
  },
];

/* ---------- Niveau 2 · Situations, calculs de tête ---------- */

/** Combinaisons (λ en nm, a en mm) qui donnent un θ rond. */
const DIFFRACTION_COUPLES = [[500, 0.10], [600, 0.10], [500, 0.20], [600, 0.20], [500, 0.050], [600, 0.30]];

const DIFFRACTION_N2 = [
  {
    id: 'diffraction.n2.theta',
    question: 'Calculer l’angle caractéristique de diffraction',
    formats: ['saisie', 'qcm'],
    generer() {
      const [l, a] = auHasard(DIFFRACTION_COUPLES);
      const theta = (l * 1e-9) / (a * 1e-3);
      return {
        question: `Un laser de longueur d’onde ${l} nm éclaire une fente de largeur ${chNombre(a, 2)} mm. Angle caractéristique θ, en radians ?`,
        reponse: `${chSci(theta)} rad`,
        nombre: theta,
        tolerance: 0.01,
        unite: 'rad',
        distracteurs: [`${chSci(theta * 1000)} rad`, `${chSci(1 / theta)} rad`, `${chSci(theta / 1000)} rad`, `${chSci(2 * theta)} rad`],
        aide: `θ = λ / a = ${l} × 10^{-9} / (${chNombre(a, 2)} × 10^{-3}) = ${chSci(theta)} rad. λ et a d’abord en mètres.`,
      };
    },
  },
  {
    id: 'diffraction.n2.largeur-tache',
    question: 'Largeur de la tache centrale sur l’écran',
    formats: ['saisie', 'qcm'],
    generer() {
      const [l, a, D] = auHasard([[500, 0.10, 1.0], [500, 0.10, 2.0], [600, 0.20, 1.0], [600, 0.20, 2.0], [500, 0.20, 2.0], [600, 0.10, 1.0]]);
      const L = (2 * l * 1e-9 * D) / (a * 1e-3) * 1e3; // en mm
      return {
        question: `λ = ${l} nm, fente de largeur a = ${chNombre(a, 2)} mm, écran à D = ${chNombre(D, 2)} m. `
          + 'Avec $L = \\dfrac{2 \\lambda D}{a}$, largeur L de la tache centrale en mm ?',
        reponse: `${chNombre(L)} mm`,
        nombre: L,
        tolerance: 0.01,
        unite: 'mm',
        distracteurs: [`${chNombre(L / 2)} mm`, `${chNombre(L * 10)} mm`, `${chNombre(L / 1000)} mm`],
        aide: `L = 2 × ${l} × 10^{-9} × ${chNombre(D)} / (${chNombre(a, 2)} × 10^{-3}) = ${chNombre(L / 1000)} m = ${chNombre(L)} mm.`,
      };
    },
  },
  {
    id: 'diffraction.n2.theta-ecran',
    question: 'Angle de diffraction mesuré sur l’écran',
    formats: ['saisie', 'qcm'],
    generer() {
      const [Lmm, D] = auHasard([[10, 1.0], [12, 1.0], [20, 2.0], [6, 1.0], [24, 2.0]]);
      const theta = (Lmm * 1e-3) / (2 * D);
      return {
        question: `Tache centrale de largeur L = ${Lmm} mm sur un écran à D = ${chNombre(D, 2)} m. `
          + 'Avec $\\theta \\approx \\dfrac{L}{2D}$, combien vaut θ en radians ?',
        reponse: `${chSci(theta)} rad`,
        nombre: theta,
        tolerance: 0.01,
        unite: 'rad',
        distracteurs: [`${chSci(2 * theta)} rad`, `${chSci(theta * 1000)} rad`, `${chSci(theta / 2)} rad`],
        aide: `θ = L / (2D) = ${chNombre(Lmm)} × 10^{-3} / (2 × ${chNombre(D)}) = ${chSci(theta)} rad. L / 2 est la demi-largeur.`,
      };
    },
  },
  {
    id: 'diffraction.n2.lambda',
    question: 'Retrouver la longueur d’onde d’un laser',
    formats: ['saisie', 'qcm'],
    generer() {
      const [Lmm, a, D, l] = auHasard([[12, 0.10, 1.0, 600], [10, 0.10, 1.0, 500], [6, 0.20, 1.0, 600], [10, 0.20, 2.0, 500]]);
      return {
        question: `Fente de largeur a = ${chNombre(a, 2)} mm, écran à D = ${chNombre(D, 2)} m : la tache centrale mesure L = ${Lmm} mm. `
          + 'Avec $\\lambda = \\dfrac{a L}{2 D}$, longueur d’onde en nm ?',
        reponse: `${l} nm`,
        nombre: l,
        tolerance: 0.01,
        unite: 'nm',
        distracteurs: [`${2 * l} nm`, `${l / 2} nm`, `${l * 1000} nm`],
        aide: `λ = ${chNombre(a, 2)} × 10^{-3} × ${Lmm} × 10^{-3} / (2 × ${chNombre(D)}) = ${l} × 10^{-9} m = ${l} nm.`,
      };
    },
  },
  {
    id: 'diffraction.n2.largeur-fente',
    question: 'Retrouver la largeur d’une fente',
    formats: ['saisie', 'qcm'],
    generer() {
      const [l, theta, a] = auHasard([[500, 5.0e-3, 0.10], [600, 3.0e-3, 0.20], [500, 1.0e-2, 0.050], [600, 6.0e-3, 0.10]]);
      return {
        question: `Laser de ${l} nm ; on mesure θ = ${chSci(theta)} rad. Largeur a de la fente, en mm ?`,
        reponse: `${chNombre(a, 2)} mm`,
        nombre: a,
        tolerance: 0.01,
        unite: 'mm',
        distracteurs: [`${chNombre(a * 10)} mm`, `${chNombre(a / 10)} mm`, `${chNombre(a * 1000)} mm`],
        aide: `a = λ / θ = ${l} × 10^{-9} / ${chSci(theta)} = ${chSci(a * 1e-3)} m = ${chNombre(a, 2)} mm.`,
      };
    },
  },
  {
    id: 'diffraction.n2.changer-a',
    question: 'Effet de la largeur de la fente sur la tache',
    formats: ['qcm', 'saisie'],
    generer() {
      const L = auHasard([6, 10, 12]);
      const [mot, k, effet] = auHasard([
        ['deux fois plus étroite', 2, 'a divisée par 2 donne L multipliée par 2'],
        ['trois fois plus étroite', 3, 'a divisée par 3 donne L multipliée par 3'],
        ['deux fois plus large', 0.5, 'a multipliée par 2 donne L divisée par 2'],
      ]);
      const L2 = L * k;
      return {
        question: `Avec une fente, la tache centrale mesure ${L} mm. On la remplace par une fente ${mot}, sans rien changer d’autre. Nouvelle largeur, en mm ?`,
        reponse: `${chNombre(L2)} mm`,
        nombre: L2,
        tolerance: 0.01,
        unite: 'mm',
        distracteurs: pieges(`${chNombre(L2)} mm`, [`${chNombre(L / k)} mm`, `${chNombre(L)} mm`, `${chNombre(L2 * 2)} mm`, `${chNombre(L + 2)} mm`]),
        aide: `L = 2λD / a est inversement proportionnelle à a : ${effet}.`,
      };
    },
  },
  {
    id: 'diffraction.n2.changer-lambda',
    question: 'Effet de la longueur d’onde sur la tache',
    formats: ['qcm', 'saisie'],
    generer() {
      const [l1, l2, L1] = auHasard([[600, 400, 12], [400, 600, 8], [500, 600, 10], [600, 300, 12]]);
      const L2 = (L1 * l2) / l1;
      return {
        question: `Avec un laser de ${l1} nm, la tache centrale mesure ${L1} mm. Même fente, même écran, laser de ${l2} nm : largeur, en mm ?`,
        reponse: `${chNombre(L2)} mm`,
        nombre: L2,
        tolerance: 0.01,
        unite: 'mm',
        distracteurs: pieges(`${chNombre(L2)} mm`, [`${chNombre((L1 * l1) / l2, 2)} mm`, `${chNombre(L1)} mm`, `${chNombre(L1 + (l2 - l1) / 100)} mm`]),
        aide: `L est proportionnelle à λ : × ${chNombre(l2 / l1, 3)} → ${chNombre(L2)} mm.`,
      };
    },
  },
  {
    id: 'diffraction.n2.changer-d',
    question: 'On éloigne l’écran de 1,0 m à 2,0 m, sans toucher à la fente ni au laser. Que deviennent θ et L ?',
    formats: ['qcm', 'retournement'],
    reponse: 'θ ne change pas ; L double',
    distracteurs: ['θ double ; L double', 'θ ne change pas ; L ne change pas', 'θ diminue de moitié ; L ne change pas'],
    aide: 'θ = λ / a ne dépend pas de l’écran ; L = 2Dθ est proportionnelle à D.',
  },
  {
    id: 'diffraction.n2.son-porte',
    question: 'Diffraction du son par une porte',
    formats: ['vraifaux'],
    generer() {
      const [f, lambda, marquee] = auHasard([[170, '2,0 m', true], [340, '1,0 m', true], [425, '0,80 m', true], [3400, '10 cm', false], [17000, '2,0 cm', false]]);
      const vrai = pileOuFace();
      const annonce = vrai === marquee ? 'est très marquée' : 'est négligeable';
      return {
        question: `« Un son de ${chNombre(f)} Hz (c = 340 m·s⁻¹) traverse une porte de 0,80 m de large : sa diffraction ${annonce}. »`,
        vrai,
        reponse: `${vrai ? 'Vrai' : 'Faux'} : λ = c / f = ${lambda}, `
          + (marquee ? 'du même ordre que la porte ou plus : diffraction marquée.' : 'bien plus petite que la porte : diffraction faible.'),
      };
    },
  },
  {
    id: 'diffraction.n2.houle',
    question: 'Houle de longueur d’onde 20 m devant l’entrée d’un port. Pour quelle largeur d’entrée la diffraction est-elle la plus marquée ?',
    formats: ['qcm'],
    reponse: '15 m',
    distracteurs: ['200 m', '500 m', '1 km'],
    aide: 'Diffraction marquée quand a est du même ordre que λ, ou plus petite.',
  },
  {
    id: 'diffraction.n2.conversion',
    question: 'Écrire λ et a en mètres',
    formats: ['qcm', 'saisie'],
    generer() {
      const l = auHasard([400, 500, 633, 650]);
      return {
        question: `λ = ${l} nm : combien de mètres ?`,
        reponse: `${chSci(l * 1e-9, 3)} m`,
        nombre: l * 1e-9,
        tolerance: 0.001,
        unite: 'm',
        distracteurs: [`${chSci(l * 1e-6, 3)} m`, `${chSci(l * 1e-3, 3)} m`, `${chSci(l * 1e-12, 3)} m`],
        aide: '1 nm = 10^{-9} m.',
      };
    },
  },
];

/* ---------- Niveau 3 · Pièges et type bac, calculatrice permise ---------- */

const DIFFRACTION_N3 = [
  {
    id: 'diffraction.n3.cheveu',
    question: 'Diamètre d’un cheveu par diffraction',
    formats: ['saisie', 'qcm'],
    generer() {
      const [Lcm, a] = auHasard([[3.9, 50], [2.6, 75], [1.95, 100], [6.5, 30]]);
      return {
        question: `Un cheveu est éclairé par un laser de 650 nm ; sur un écran à D = 1,50 m, la tache centrale mesure L = ${chNombre(Lcm)} cm. `
          + 'Diamètre du cheveu, en µm ?',
        reponse: `${a} µm`,
        nombre: a,
        tolerance: 0.02,
        unite: 'µm',
        distracteurs: [`${chNombre(a / 2)} µm`, `${a * 2} µm`, `${chNombre(a / 1000)} µm`],
        aide: `a = 2λD / L = 2 × 650 × 10^{-9} × 1,50 / (${chNombre(Lcm)} × 10^{-2}) = ${chSci(a * 1e-6)} m = ${a} µm.`,
      };
    },
  },
  {
    id: 'diffraction.n3.lambda-laser',
    question: 'Longueur d’onde d’un laser, mesure sur l’écran',
    formats: ['saisie'],
    generer() {
      const D = auHasard([1.20, 1.60, 2.00]);
      const l = auHasard([532, 633, 650]);
      const a = 0.10e-3;
      const L = Math.round(((2 * l * 1e-9 * D) / a) * 1000) / 10; // en cm, au mm près
      const lCalc = ((a * L * 1e-2) / (2 * D)) * 1e9;
      return {
        question: `Fente de 0,10 mm, écran à D = ${chNombre(D, 3)} m : la tache centrale mesure L = ${chNombre(L, 2)} cm. Longueur d’onde du laser, en nm ?`,
        reponse: `${chNombre(Math.round(lCalc))} nm`,
        nombre: lCalc,
        tolerance: 0.02,
        unite: 'nm',
        aide: `λ = a L / (2D) = 1,0 × 10^{-4} × ${chNombre(L, 2)} × 10^{-2} / (2 × ${chNombre(D)}) ≈ ${chNombre(lCalc, 3)} nm.`,
      };
    },
  },
  {
    id: 'diffraction.n3.pente',
    question: 'Exploiter la droite θ = f(1/a)',
    formats: ['saisie', 'qcm'],
    generer() {
      const l = auHasard([532, 633, 650]);
      const x = auHasard([1.0e4, 2.0e4]);
      const theta = Number((l * 1e-9 * x).toPrecision(3));
      return {
        question: `On trace θ en fonction de 1/a pour plusieurs fentes : une droite passant par l’origine et par le point (1/a = ${chSci(x)} m⁻¹ ; θ = ${chSci(theta, 3)} rad). `
          + 'Longueur d’onde du laser, en nm ?',
        reponse: `${l} nm : c’est la pente de la droite`,
        nombre: l,
        tolerance: 0.02,
        unite: 'nm',
        distracteurs: [`${chNombre(l * 2)} nm`, `${chNombre(Math.round(l / 2))} nm`, `${chSci(x / theta, 3)} nm`],
        aide: `θ = λ × (1/a) : la pente vaut λ = ${chSci(theta, 3)} / ${chSci(x)} = ${chSci(l * 1e-9, 3)} m = ${l} nm.`,
      };
    },
  },
  {
    id: 'diffraction.n3.pente-sens',
    question: 'Pourquoi trace-t-on θ en fonction de 1/a, et non de a, pour exploiter θ = λ / a ?',
    formats: ['qcm', 'retournement'],
    reponse: 'Pour obtenir une droite passant par l’origine, dont la pente est λ',
    distracteurs: [
      'Parce que θ augmente avec a',
      'Pour que les points soient plus espacés',
      'Parce que θ en fonction de a est aussi une droite, mais de pente 1/λ',
    ],
    aide: 'θ en fonction de a est une hyperbole : on ne lit pas λ dessus. En fonction de 1/a, c’est une fonction linéaire.',
  },
  {
    id: 'diffraction.n3.copie-degres',
    consigne: 'Corrige la copie.',
    formats: ['qcm', 'retournement'],
    question: 'Copie d’élève : « θ = λ / a = 633 × 10⁻⁹ / 1,0 × 10⁻⁴ = 6,3 × 10⁻³ °. » Où est l’erreur ?',
    reponse: 'L’unité : θ = λ / a donne un angle en radians, pas en degrés',
    distracteurs: [
      'Il fallait calculer a / λ',
      'Il fallait garder λ en nanomètres',
      'Aucune erreur',
    ],
  },
  {
    id: 'diffraction.n3.copie-facteur-2',
    consigne: 'Corrige la copie.',
    formats: ['qcm', 'retournement'],
    question: 'Copie d’élève : « tan θ ≈ θ = L / D, donc L = λD / a. » Où est l’erreur ?',
    reponse: 'θ se mesure sur une demi-tache : θ = L / (2D), donc L = 2λD / a',
    distracteurs: [
      'tan θ ≈ θ n’est pas permis',
      'Il fallait écrire L = λa / D',
      'Aucune erreur',
    ],
    aide: 'θ est l’angle entre le centre de la tache et sa première extinction : le côté opposé vaut L / 2.',
  },
  {
    id: 'diffraction.n3.copie-nm',
    consigne: 'Corrige la copie.',
    formats: ['qcm', 'retournement'],
    question: 'Copie d’élève : « λ = 600 nm et a = 0,20 mm, donc θ = 600 / 0,20 = 3 000 rad. » Où est l’erreur ?',
    reponse: 'λ et a ne sont pas dans la même unité : θ = 6,00 × 10⁻⁷ / 2,0 × 10⁻⁴ = 3,0 × 10⁻³ rad',
    distracteurs: [
      'Il fallait diviser 0,20 par 600',
      'Il fallait multiplier par 2',
      'Aucune : 3 000 rad est un angle possible',
    ],
    aide: 'Un angle de 3 000 rad n’a aucun sens physique : c’est le signal d’une erreur de conversion.',
  },
  {
    id: 'diffraction.n3.copie-demi-tache',
    consigne: 'Corrige la copie.',
    formats: ['qcm', 'retournement'],
    question: 'Copie d’élève : « Je mesure 1,2 cm du centre de la tache centrale à sa première extinction ; c’est L. Donc λ = aL / (2D). » Où est l’erreur ?',
    reponse: '1,2 cm est la demi-largeur : L = 2,4 cm, sinon λ est deux fois trop petite',
    distracteurs: [
      'Il fallait mesurer jusqu’à la deuxième extinction',
      'La formule est λ = 2aL / D',
      'Aucune erreur',
    ],
    aide: 'L se mesure d’une extinction à l’autre, de part et d’autre du centre. Mesurer plusieurs taches réduit l’incertitude.',
  },
  {
    id: 'diffraction.n3.copie-chiffres',
    consigne: 'Corrige la copie.',
    formats: ['qcm', 'retournement'],
    question: 'Copie d’élève, données a = 0,10 mm, D = 1,60 m, L = 2,1 cm : « λ = 6,5625 × 10⁻⁷ m. » Qu’en dit le correcteur ?',
    reponse: 'Trop de chiffres significatifs : λ ≈ 6,6 × 10⁻⁷ m',
    distracteurs: ['C’est parfait', 'Il faut écrire λ = 7 × 10⁻⁷ nm', 'Il faut écrire λ = 656,25 nm'],
  },
  {
    id: 'diffraction.n3.longueur-onde-change',
    question: '« La lumière diffractée par une fente a une longueur d’onde plus grande, puisque la tache s’élargit. »',
    formats: ['vraifaux'],
    vrai: false,
    reponse: 'Faux : λ ne change pas. Ce sont les directions de propagation qui s’étalent.',
  },
  {
    id: 'diffraction.n3.blu-ray',
    question: 'Pourquoi un Blu-ray (laser à 405 nm) contient-il plus de données qu’un DVD (laser à 650 nm) ?',
    formats: ['qcm', 'retournement'],
    reponse: 'Plus λ est petite, moins le faisceau focalisé est élargi par la diffraction : la tache lue est plus petite, les données plus serrées',
    distracteurs: [
      'Le laser bleu est plus puissant et grave plus profond',
      'Plus λ est petite, plus la diffraction est marquée',
      'La diffraction ne joue aucun rôle dans la lecture optique',
    ],
  },
  {
    id: 'diffraction.n3.telescope',
    question: 'Pourquoi construit-on des télescopes à très grand miroir pour distinguer deux étoiles proches ?',
    formats: ['qcm', 'retournement'],
    reponse: 'Plus l’ouverture est grande, plus θ = λ / a est petit : la diffraction brouille moins l’image',
    distracteurs: [
      'Plus l’ouverture est petite, moins la lumière est diffractée',
      'Un grand miroir supprime la diffraction',
      'Seulement pour capter plus de lumière : la diffraction ne joue pas',
    ],
    aide: 'Capter plus de lumière compte aussi, mais c’est la diffraction qui limite la résolution.',
  },
  {
    id: 'diffraction.n3.petit-angle',
    question: '« Avec θ = 5,0 × 10⁻³ rad, on peut écrire tan θ ≈ θ. »',
    formats: ['vraifaux'],
    vrai: true,
    reponse: 'Vrai : θ est très petit devant 1 rad ; tan θ et θ diffèrent de moins de 0,01 %.',
  },
  {
    id: 'diffraction.n3.precision',
    question: 'Pour mesurer λ au mieux avec une fente, quel réglage choisir ?',
    formats: ['qcm', 'retournement'],
    reponse: 'Un écran éloigné et une fente fine : la tache est large, l’incertitude relative sur L petite',
    distracteurs: [
      'Un écran très proche, pour que la tache soit nette et petite',
      'Une fente large, pour avoir plus de lumière',
      'Peu importe : L ne dépend que de λ',
    ],
  },
];

inscrireChapitre({
  cle: 'diffraction',
  theme: 'Ondes et signaux',
  titre: 'Diffraction',
  resume: 'Trois niveaux : vocabulaire et formules ; petites situations à calculer de tête ; pièges, copies '
    + 'd’élèves et exercices type bac, calculatrice permise. Les valeurs changent à chaque passage.',
  n1: DIFFRACTION_N1,
  n2: DIFFRACTION_N2,
  n3: DIFFRACTION_N3,
});
