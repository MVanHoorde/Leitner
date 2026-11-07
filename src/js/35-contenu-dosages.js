/* Paquet « Dosages par étalonnage » (terminale, Constitution et transformations
 * de la matière 1.B, avec les acquis de première).
 *
 * Programme (BO spécial n° 8 du 25/07/2019) : exploiter la loi de Beer-Lambert
 * ou la loi de Kohlrausch pour déterminer une concentration ; citer leurs
 * domaines de validité ; mesurer une conductance et tracer une courbe
 * d'étalonnage pour déterminer une concentration.
 *
 * Dosages seulement, jamais de titrage (décision de Loïc, 31/10/2026) : ni
 * équivalence, ni suivi pH-métrique ou conductimétrique d'un titrage.
 *
 * Notations : A absorbance, ε coefficient d'absorption molaire, ℓ longueur de
 * cuve, c concentration en quantité de matière ; G conductance, σ conductivité,
 * λ_i conductivité ionique molaire, [X_i] en mol·m⁻³ dans la loi de Kohlrausch.
 * Niveau 2 : valeurs choisies pour un calcul de tête.
 *
 * PROPOSITION à auditer par Loïc (audit: 'brouillon', 35-contenu-chapitres.js).
 * RÈGLE ABSOLUE (32-paquets.js) : un identifiant de carte ne change jamais.
 */

/* ---------- Niveau 1 · Vocabulaire, définitions, formules ---------- */

/** Couleur absorbée → couleur perçue (cercle chromatique simplifié). */
const DOSAGES_COULEURS = [
  ['le bleu', 'jaune-orangé'],
  ['le vert', 'magenta (pourpre)'],
  ['le rouge', 'cyan (bleu-vert)'],
  ['le violet', 'jaune-vert'],
];

const DOSAGES_N1 = [
  {
    id: 'dosages.n1.absorbance-unite',
    question: 'Quelle est l’unité de l’absorbance A ?',
    formats: ['qcm', 'retournement'],
    reponse: 'Aucune : l’absorbance est sans unité',
    distracteurs: ['Le mol·L⁻¹', 'Le L·mol⁻¹·cm⁻¹', 'Le nanomètre'],
  },
  {
    id: 'dosages.n1.beer-lambert',
    question: 'Quelle est l’expression de la loi de Beer-Lambert ?',
    formats: ['qcm', 'retournement'],
    reponse: '$A = \\varepsilon \\, \\ell \\, c$',
    distracteurs: ['$A = \\dfrac{\\varepsilon \\, c}{\\ell}$', '$A = \\dfrac{c}{\\varepsilon \\, \\ell}$', '$A = \\varepsilon + \\ell + c$'],
    aide: 'ε coefficient d’absorption molaire (L·mol⁻¹·cm⁻¹), ℓ longueur de cuve traversée (cm), c concentration (mol·L⁻¹).',
  },
  {
    id: 'dosages.n1.couleur',
    question: 'Couleur perçue d’une solution',
    formats: ['qcm', 'retournement'],
    generer() {
      const [absorbee, percue] = auHasard(DOSAGES_COULEURS);
      return {
        question: `Une solution absorbe surtout ${absorbee}. De quelle couleur la voit-on ?`,
        reponse: percue,
        distracteurs: DOSAGES_COULEURS.map((c) => c[1]).filter((c) => c !== percue),
        aide: 'On voit la couleur complémentaire de celle qui est absorbée : elles sont opposées sur le cercle chromatique.',
      };
    },
  },
  {
    id: 'dosages.n1.lambda-max',
    question: 'Pourquoi règle-t-on le spectrophotomètre sur la longueur d’onde $\\lambda_{max}$ du maximum d’absorption ?',
    formats: ['qcm', 'retournement'],
    reponse: 'L’absorbance y est la plus grande : la mesure est la plus sensible et la plus précise',
    distracteurs: [
      'C’est la seule longueur d’onde où la loi de Beer-Lambert s’applique',
      'Pour que l’absorbance soit nulle avec le blanc',
      'Parce que la solution y est transparente',
    ],
  },
  {
    id: 'dosages.n1.validite-beer-lambert',
    question: 'Dans quelles conditions la loi de Beer-Lambert est-elle valable ?',
    formats: ['qcm', 'retournement'],
    reponse: 'Solutions diluées, lumière monochromatique, absorbance pas trop grande',
    distracteurs: [
      'Solutions concentrées, en lumière blanche',
      'Seulement pour les solutions incolores',
      'Pour toute solution, quelle que soit sa concentration',
    ],
  },
  {
    id: 'dosages.n1.proportionnalite',
    question: '« Dans le domaine de validité de la loi de Beer-Lambert, si la concentration double, l’absorbance double. »',
    formats: ['vraifaux'],
    vrai: true,
    reponse: 'Vrai : A = k × c, l’absorbance est proportionnelle à la concentration.',
  },
  {
    id: 'dosages.n1.une-seule-espece',
    question: '« Pour un dosage spectrophotométrique, l’espèce dosée doit être la seule à absorber à la longueur d’onde choisie. »',
    formats: ['vraifaux'],
    vrai: true,
    reponse: 'Vrai : sinon l’absorbance mesurée additionne les contributions de plusieurs espèces.',
  },
  {
    id: 'dosages.n1.conductance',
    question: 'Comment la conductance G d’une portion de solution est-elle liée à sa résistance R ?',
    formats: ['qcm', 'retournement'],
    reponse: '$G = \\dfrac{1}{R}$, en siemens (S)',
    distracteurs: ['$G = R$, en ohms (Ω)', '$G = \\dfrac{1}{R}$, en ohms (Ω)', '$G = U \\times I$, en watts (W)'],
  },
  {
    id: 'dosages.n1.conductivite-unite',
    question: 'Quelle est l’unité SI de la conductivité σ ?',
    formats: ['qcm', 'retournement'],
    reponse: 'Le S·m⁻¹',
    distracteurs: ['Le S', 'Le S·m²·mol⁻¹', 'Le Ω·m'],
  },
  {
    id: 'dosages.n1.kohlrausch',
    question: 'Quelle est l’expression de la loi de Kohlrausch ?',
    formats: ['qcm', 'retournement'],
    reponse: '$\\sigma = \\sum_i \\lambda_i \\, [X_i]$',
    distracteurs: ['$\\sigma = \\sum_i \\dfrac{\\lambda_i}{[X_i]}$', '$\\sigma = \\dfrac{1}{R}$', '$\\sigma = \\varepsilon \\, \\ell \\, c$'],
    aide: 'On somme sur tous les ions de la solution : λ_i est la conductivité ionique molaire de l’ion X_i.',
  },
  {
    id: 'dosages.n1.kohlrausch-unites',
    question: 'Dans $\\sigma = \\sum \\lambda_i [X_i]$, en quelle unité exprimer les concentrations $[X_i]$ ?',
    formats: ['qcm', 'retournement'],
    reponse: 'En mol·m⁻³',
    distracteurs: ['En mol·L⁻¹', 'En g·L⁻¹', 'En mmol·m⁻³'],
    aide: 'σ en S·m⁻¹ et λ_i en S·m²·mol⁻¹ : il faut des mol·m⁻³. 1 mol·L⁻¹ = 1 000 mol·m⁻³.',
  },
  {
    id: 'dosages.n1.lambda-ionique',
    question: 'Unité de la conductivité ionique molaire $\\lambda_i$ ?',
    formats: ['qcm', 'retournement'],
    reponse: 'Le S·m²·mol⁻¹',
    distracteurs: ['Le S·m⁻¹', 'Le S·mol·m⁻³', 'Le nanomètre'],
  },
  {
    id: 'dosages.n1.validite-kohlrausch',
    question: '« La loi de Kohlrausch reste valable pour des solutions très concentrées. »',
    formats: ['vraifaux'],
    vrai: false,
    reponse: 'Faux : elle n’est valable que pour des solutions diluées.',
  },
  {
    id: 'dosages.n1.sucre',
    question: '« On peut doser une solution de sucre (saccharose) par conductimétrie. »',
    formats: ['vraifaux'],
    vrai: false,
    reponse: 'Faux : le saccharose ne libère pas d’ions en solution, il ne conduit pas le courant.',
  },
  {
    id: 'dosages.n1.gamme',
    question: 'Qu’est-ce qu’une gamme d’étalonnage ?',
    formats: ['qcm', 'retournement'],
    reponse: 'Une série de solutions de concentrations connues de l’espèce à doser',
    distracteurs: [
      'Une série de mesures répétées sur l’échantillon inconnu',
      'L’ensemble des longueurs d’onde du spectre',
      'Une série de solutions de concentrations inconnues',
    ],
    aide: 'On la prépare souvent par dilutions d’une solution mère.',
  },
  {
    id: 'dosages.n1.courbe',
    question: 'Dans le domaine de validité, à quoi ressemble la courbe d’étalonnage A = f(c) ou σ = f(c) ?',
    formats: ['qcm', 'retournement'],
    reponse: 'Une droite qui passe par l’origine',
    distracteurs: ['Une droite qui ne passe pas par l’origine', 'Une exponentielle décroissante', 'Une parabole'],
  },
  {
    id: 'dosages.n1.concentration-masse',
    question: 'Quelle relation entre concentration en masse $c_m$, concentration en quantité de matière c et masse molaire M ?',
    formats: ['qcm', 'retournement'],
    reponse: '$c_m = c \\times M$',
    distracteurs: ['$c_m = \\dfrac{c}{M}$', '$c_m = \\dfrac{M}{c}$', '$c_m = c + M$'],
    aide: 'g·L⁻¹ = mol·L⁻¹ × g·mol⁻¹.',
  },
];

/* ---------- Niveau 2 · Situations, calculs de tête ---------- */

const DOSAGES_N2 = [
  {
    id: 'dosages.n2.c-depuis-a',
    question: 'Concentration à partir de l’absorbance',
    formats: ['saisie', 'qcm'],
    generer() {
      const k = auHasard([100, 200]);
      const A = auHasard([0.2, 0.3, 0.4, 0.6, 0.8]);
      const c = (A / k) * 1000;
      return {
        question: `Étalonnage : A = k × c avec k = ${k} L·mol⁻¹. L’échantillon a une absorbance A = ${chNombre(A, 2)}. `
          + 'Concentration, en mmol·L⁻¹ ?',
        reponse: `${chNombre(c)} mmol·L⁻¹`,
        nombre: c,
        unite: 'mmol·L⁻¹',
        distracteurs: [`${chNombre(A * k)} mmol·L⁻¹`, `${chNombre(c / 1000)} mmol·L⁻¹`, `${chNombre(c * 10)} mmol·L⁻¹`],
        aide: `c = A / k = ${chNombre(A, 2)} / ${k} = ${chNombre(A / k)} mol·L⁻¹ = ${chNombre(c)} mmol·L⁻¹.`,
      };
    },
  },
  {
    id: 'dosages.n2.a-depuis-c',
    question: 'Absorbance attendue',
    formats: ['saisie', 'qcm'],
    generer() {
      const k = auHasard([100, 150, 200, 250]);
      const cm = auHasard([1, 2, 4]);
      const A = (k * cm) / 1000;
      return {
        question: `A = k × c avec k = ${k} L·mol⁻¹. Absorbance d’une solution à ${cm} mmol·L⁻¹ ?`,
        reponse: chNombre(A),
        nombre: A,
        distracteurs: [chNombre(k * cm), chNombre(A * 10), chNombre(A / 10)],
        aide: `${cm} mmol·L⁻¹ = ${chNombre(cm / 1000)} mol·L⁻¹, donc A = ${k} × ${chNombre(cm / 1000)} = ${chNombre(A)}, sans unité.`,
      };
    },
  },
  {
    id: 'dosages.n2.epsilon',
    question: 'Absorbance par la loi de Beer-Lambert',
    formats: ['saisie', 'qcm'],
    generer() {
      const eps = auHasard([1000, 2000, 5000]);
      const c = auHasard(eps === 5000 ? [1, 2] : [1, 2, 3]) * 1e-4;
      const A = eps * c;
      return {
        question: `ε = ${chNombre(eps)} L·mol⁻¹·cm⁻¹, cuve de ℓ = 1,0 cm, c = ${chSci(c)} mol·L⁻¹. Absorbance ?`,
        reponse: chNombre(A),
        nombre: A,
        distracteurs: [chNombre(A * 10), chNombre(A / 10), chNombre(eps / (c * 1e4))],
        aide: `A = ε ℓ c = ${chNombre(eps)} × 1,0 × ${chSci(c)} = ${chNombre(A)}.`,
      };
    },
  },
  {
    id: 'dosages.n2.lecture-droite',
    question: 'Lire la courbe d’étalonnage par proportionnalité',
    formats: ['saisie', 'qcm'],
    generer() {
      const [cRef, aRef] = auHasard([[4, 0.8], [5, 1.0], [2, 0.6], [10, 0.5]]);
      const rapport = auHasard([0.5, 0.25, 0.75]);
      const A = aRef * rapport;
      const c = cRef * rapport;
      return {
        question: `La droite d’étalonnage passe par l’origine et par le point (c = ${chNombre(cRef)} mmol·L⁻¹ ; A = ${chNombre(aRef, 2)}). `
          + `L’échantillon donne A = ${chNombre(A, 2)}. Concentration, en mmol·L⁻¹ ?`,
        reponse: `${chNombre(c)} mmol·L⁻¹`,
        nombre: c,
        unite: 'mmol·L⁻¹',
        distracteurs: [`${chNombre(Math.round((cRef / rapport) * 10) / 10)} mmol·L⁻¹`, `${chNombre(cRef)} mmol·L⁻¹`, `${chNombre(c * 10)} mmol·L⁻¹`],
        aide: `L’absorbance vaut ${chNombre(rapport)} fois celle du point de référence : la concentration aussi, ${chNombre(rapport)} × ${chNombre(cRef)} = ${chNombre(c)} mmol·L⁻¹.`,
      };
    },
  },
  {
    id: 'dosages.n2.dilution',
    question: 'Remonter à la concentration de l’échantillon dilué',
    formats: ['saisie', 'qcm'],
    generer() {
      const F = auHasard([10, 20]);
      const cDil = auHasard([1.5, 2, 2.5, 4]);
      const c = F * cDil;
      return {
        question: `L’échantillon a été dilué ${F} fois avant la mesure ; la courbe d’étalonnage donne ${chNombre(cDil)} mmol·L⁻¹ pour la solution diluée. `
          + 'Concentration de l’échantillon d’origine, en mmol·L⁻¹ ?',
        reponse: `${chNombre(c)} mmol·L⁻¹`,
        nombre: c,
        unite: 'mmol·L⁻¹',
        distracteurs: [`${chNombre(cDil)} mmol·L⁻¹`, `${chNombre(cDil / F)} mmol·L⁻¹`, `${chNombre(cDil + F)} mmol·L⁻¹`],
        aide: `L’échantillon est ${F} fois plus concentré que la solution mesurée : c = ${F} × ${chNombre(cDil)} = ${chNombre(c)} mmol·L⁻¹.`,
      };
    },
  },
  {
    id: 'dosages.n2.conversion',
    question: 'Convertir une concentration pour la loi de Kohlrausch',
    formats: ['saisie', 'qcm'],
    generer() {
      const c = auHasard([1.0e-3, 2.5e-3, 5.0e-2, 0.1, 2.0e-2]);
      const m3 = c * 1000;
      return {
        question: `c = ${c >= 0.01 ? chNombre(c) : chSci(c)} mol·L⁻¹. Combien de mol·m⁻³ ?`,
        reponse: `${chNombre(m3)} mol·m⁻³`,
        nombre: m3,
        unite: 'mol·m⁻³',
        distracteurs: [`${chSci(c / 1000, 2)} mol·m⁻³`, `${chNombre(m3 / 10)} mol·m⁻³`, `${chNombre(m3 * 1000)} mol·m⁻³`],
        aide: '1 m³ = 1 000 L : il y a 1 000 fois plus de matière dans un mètre cube que dans un litre. On multiplie par 1 000.',
      };
    },
  },
  {
    id: 'dosages.n2.kohlrausch',
    question: 'Conductivité d’une solution, loi de Kohlrausch',
    formats: ['saisie', 'qcm'],
    generer() {
      const [sel, somme] = auHasard([['chlorure de sodium (Na⁺ + Cl⁻)', 12.6], ['chlorure de potassium (K⁺ + Cl⁻)', 15]]);
      const c = auHasard([1, 2, 5]);
      const sigma = somme * c;
      return {
        question: `Solution de ${sel} à c = ${c} mmol·L⁻¹. λ(cation) + λ(anion) = ${chNombre(somme)} mS·m²·mol⁻¹. `
          + 'Conductivité σ, en mS·m⁻¹ ?',
        reponse: `${chNombre(sigma)} mS·m⁻¹`,
        nombre: sigma,
        unite: 'mS·m⁻¹',
        distracteurs: [`${chNombre(sigma / 1000)} mS·m⁻¹`, `${chNombre(sigma * 1000)} mS·m⁻¹`, `${chNombre(sigma / 10)} mS·m⁻¹`],
        aide: `${c} mmol·L⁻¹ = ${c} mol·m⁻³. σ = (λ₊ + λ₋) × c = ${chNombre(somme)} × ${c} = ${chNombre(sigma)} mS·m⁻¹.`,
      };
    },
  },
  {
    id: 'dosages.n2.sigma-kc',
    question: 'Concentration à partir de la conductivité',
    formats: ['saisie', 'qcm'],
    generer() {
      const c = auHasard([2, 2.5, 3, 5]);
      const sigma = 12 * c;
      return {
        question: `Droite d’étalonnage : σ = 12 × c (σ en mS·m⁻¹, c en mmol·L⁻¹). On mesure σ = ${chNombre(sigma)} mS·m⁻¹. c = ? (mmol·L⁻¹)`,
        reponse: `${chNombre(c)} mmol·L⁻¹`,
        nombre: c,
        unite: 'mmol·L⁻¹',
        distracteurs: [`${chNombre(sigma * 12)} mmol·L⁻¹`, `${chNombre(c * 10)} mmol·L⁻¹`, `${chNombre(sigma - 12)} mmol·L⁻¹`],
        aide: `c = σ / 12 = ${chNombre(sigma)} / 12 = ${chNombre(c)} mmol·L⁻¹.`,
      };
    },
  },
  {
    id: 'dosages.n2.conductance',
    question: 'Conductance à partir de la résistance',
    formats: ['saisie', 'qcm'],
    generer() {
      const R = auHasard([200, 250, 500, 1000]);
      const G = 1000 / R;
      return {
        question: `Le conductimètre mesure une résistance R = ${chNombre(R)} Ω entre ses électrodes. Conductance G, en mS ?`,
        reponse: `${chNombre(G)} mS`,
        nombre: G,
        unite: 'mS',
        distracteurs: [`${chNombre(R)} mS`, `${chNombre(G / 1000)} mS`, `${chNombre(G * 10)} mS`],
        aide: `G = 1 / R = 1 / ${chNombre(R)} = ${chNombre(G / 1000)} S = ${chNombre(G)} mS.`,
      };
    },
  },
  {
    id: 'dosages.n2.concentration-masse',
    question: 'Concentration en masse',
    formats: ['saisie', 'qcm'],
    generer() {
      const c = auHasard([0.05, 0.1, 0.2]);
      const M = auHasard([50, 100, 200, 250]);
      const cm = c * M;
      return {
        question: `Le dosage donne c = ${chNombre(c)} mol·L⁻¹ pour une espèce de masse molaire M = ${M} g·mol⁻¹. Concentration en masse, en g·L⁻¹ ?`,
        reponse: `${chNombre(cm)} g·L⁻¹`,
        nombre: cm,
        unite: 'g·L⁻¹',
        distracteurs: [`${chNombre(M / c)} g·L⁻¹`, `${chNombre(c / M)} g·L⁻¹`, `${chNombre(cm * 10)} g·L⁻¹`],
        aide: `c_m = c × M = ${chNombre(c)} × ${M} = ${chNombre(cm)} g·L⁻¹.`,
      };
    },
  },
  {
    id: 'dosages.n2.hors-gamme',
    question: 'L’échantillon est-il dans la gamme ?',
    formats: ['vraifaux'],
    generer() {
      const Amax = auHasard([1.0, 1.2]);
      const A = auHasard([0.45, 0.8, 1.6, 2.1]);
      const dans = A <= Amax;
      const vrai = pileOuFace();
      const annonce = vrai === dans;
      return {
        question: `« Les étalons vont de A = 0 à A = ${chNombre(Amax, 2)}. L’échantillon donne A = ${chNombre(A)} : `
          + (annonce ? 'on peut lire sa concentration sur la droite. »' : 'il faut le diluer avant de conclure. »'),
        vrai,
        reponse: `${vrai ? 'Vrai' : 'Faux'} : ` + (dans
          ? 'son absorbance est dans la gamme, la lecture sur la droite est fiable.'
          : 'son absorbance dépasse la gamme : on dilue l’échantillon (puis on remultiplie par le facteur de dilution).'),
      };
    },
  },
];

/* ---------- Niveau 3 · Pièges et type bac, calculatrice permise ---------- */

const DOSAGES_N3 = [
  {
    id: 'dosages.n3.serum',
    question: 'Sérum physiologique : dosage conductimétrique',
    formats: ['saisie', 'qcm'],
    generer() {
      const sigma = auHasard([94, 96, 97, 99]);
      const cDil = sigma / 12.6;
      const cm = ((cDil * 20) / 1000) * 58.5;
      return {
        question: `Un sérum physiologique (chlorure de sodium, M = 58,5 g·mol⁻¹) est dilué 20 fois. La solution diluée a σ = ${sigma} mS·m⁻¹ ; `
          + 'λ(Na⁺) + λ(Cl⁻) = 12,6 mS·m²·mol⁻¹. Concentration en masse du sérum, en g·L⁻¹ ?',
        reponse: `${chNombre(cm, 2)} g·L⁻¹`,
        nombre: cm,
        tolerance: 0.03,
        unite: 'g·L⁻¹',
        distracteurs: [`${chNombre(cm / 20, 2)} g·L⁻¹`, `${chNombre(cm * 1000, 2)} g·L⁻¹`, `${chNombre((cDil * 20) / 1000, 2)} g·L⁻¹`],
        aide: `c_dil = σ / (λ₊ + λ₋) = ${sigma} / 12,6 ≈ ${chNombre(cDil, 3)} mol·m⁻³ = ${chNombre(cDil / 1000, 3)} mol·L⁻¹ ; `
          + `× 20 pour l’échantillon ; × 58,5 g·mol⁻¹ : ≈ ${chNombre(cm, 3)} g·L⁻¹. L’étiquette annonce 0,9 % (9,0 g·L⁻¹).`,
      };
    },
  },
  {
    id: 'dosages.n3.dakin',
    question: 'Permanganate dans le Dakin : dosage spectrophotométrique',
    formats: ['saisie', 'qcm'],
    generer() {
      const A = auHasard([0.14, 0.15, 0.16]);
      const c = A / 2300;
      const mg = c * 158 * 1000;
      return {
        question: `Le Dakin contient des ions permanganate $\\ce{MnO4^-}$ (apportés par $\\ce{KMnO4}$, M = 158 g·mol⁻¹). `
          + `À 530 nm, l’étalonnage donne A = k × c avec k = 2,3 × 10^{3} L·mol⁻¹ ; le Dakin a A = ${chNombre(A, 2)}. `
          + 'Concentration en masse de $\\ce{KMnO4}$, en mg·L⁻¹ ?',
        reponse: `${chNombre(mg, 2)} mg·L⁻¹`,
        nombre: mg,
        tolerance: 0.03,
        unite: 'mg·L⁻¹',
        distracteurs: [`${chNombre(mg / 1000, 2)} mg·L⁻¹`, `${chNombre(c * 1e6, 2)} mg·L⁻¹`, `${chNombre(A * 2300 * 158, 2)} mg·L⁻¹`],
        aide: `c = A / k = ${chNombre(A, 2)} / 2,3 × 10^{3} ≈ ${chSci(c, 2)} mol·L⁻¹ ; c_m = c × M ≈ ${chSci(c * 158, 2)} g·L⁻¹ = ${chNombre(mg, 2)} mg·L⁻¹.`,
      };
    },
  },
  {
    id: 'dosages.n3.ecart-etiquette',
    question: 'Comparer le résultat à l’étiquette',
    formats: ['saisie', 'qcm'],
    generer() {
      const ref = 9.0;
      const mes = auHasard([8.6, 8.8, 9.3, 9.5]);
      const ecart = (Math.abs(mes - ref) / ref) * 100;
      return {
        question: `Étiquette : 9,0 g·L⁻¹ de chlorure de sodium. Le dosage donne ${chNombre(mes)} g·L⁻¹. Écart relatif à l’étiquette, en % ?`,
        reponse: `${chNombre(ecart, 2)} %`,
        nombre: ecart,
        tolerance: 0.05,
        unite: '%',
        distracteurs: [`${chNombre(Math.abs(mes - ref), 2)} %`, `${chNombre((Math.abs(mes - ref) / mes) * 1000, 2)} %`, `${chNombre(ecart * 10, 2)} %`],
        aide: `|${chNombre(mes)} − 9,0| / 9,0 × 100 ≈ ${chNombre(ecart, 2)} %.`,
      };
    },
  },
  {
    id: 'dosages.n3.menthe',
    question: 'Sirop de menthe : tartrazine E102 (jaune, λ_max ≈ 430 nm) et bleu patenté E131 (λ_max ≈ 640 nm). Où mesurer pour doser le bleu patenté ?',
    formats: ['qcm', 'retournement'],
    reponse: 'À 640 nm, où la tartrazine n’absorbe pratiquement pas',
    distracteurs: [
      'À 430 nm, où le sirop absorbe le plus',
      'À 530 nm, entre les deux maximums',
      'En lumière blanche, pour voir la couleur verte',
    ],
    aide: 'Il faut à la fois une absorbance forte pour E131 et une seule espèce absorbante à cette longueur d’onde.',
  },
  {
    id: 'dosages.n3.eau-minerale',
    question: '« La conductivité d’une eau minérale suffit, avec la loi de Kohlrausch, à trouver sa concentration en ions calcium. »',
    formats: ['vraifaux'],
    vrai: false,
    reponse: 'Faux : la conductivité additionne la contribution de tous les ions présents ; elle ne distingue pas le calcium des autres.',
  },
  {
    id: 'dosages.n3.blanc',
    question: 'À quoi sert le « blanc » avant les mesures d’absorbance ?',
    formats: ['qcm', 'retournement'],
    reponse: 'À régler A = 0 avec le solvant seul, pour ne mesurer que l’absorption de l’espèce dosée',
    distracteurs: [
      'À vérifier que la cuve est propre en mesurant une solution étalon',
      'À choisir la longueur d’onde de travail',
      'À mesurer l’absorbance maximale de l’appareil',
    ],
    aide: 'C’est ce qui fait passer la droite d’étalonnage par l’origine.',
  },
  {
    id: 'dosages.n3.grande-absorbance',
    question: '« Une absorbance de 2,5 se mesure aussi bien qu’une absorbance de 0,5. »',
    formats: ['vraifaux'],
    vrai: false,
    reponse: 'Faux : à A = 2,5, il ne passe que 0,3 % de la lumière ; la mesure est imprécise et la loi de Beer-Lambert n’est souvent plus vérifiée. On dilue.',
  },
  {
    id: 'dosages.n3.copie-kohlrausch',
    consigne: 'Corrige la copie.',
    formats: ['qcm', 'retournement'],
    question: 'Copie d’élève : « c = 2,0 × 10⁻³ mol/L, λ(Na⁺) + λ(Cl⁻) = 12,6 × 10⁻³ S·m²·mol⁻¹, '
      + 'σ = 12,6 × 10⁻³ × 2,0 × 10⁻³ = 2,5 × 10⁻⁵ S/m. » Où est l’erreur ?',
    reponse: 'La concentration doit être en mol·m⁻³ : c = 2,0 mol·m⁻³, donc σ ≈ 2,5 × 10⁻² S·m⁻¹',
    distracteurs: [
      'Il fallait diviser λ par c',
      'Il fallait additionner λ et c',
      'Aucune : le calcul est juste',
    ],
    aide: 'Avec des mol·L⁻¹, le résultat est 1 000 fois trop petit.',
  },
  {
    id: 'dosages.n3.copie-dilution',
    consigne: 'Corrige la copie.',
    formats: ['qcm', 'retournement'],
    question: 'Copie d’élève : « J’ai dilué le jus 10 fois. Sur la courbe, je lis c = 2,4 mmol/L. Le jus contient donc 2,4 mmol/L. » Où est l’erreur ?',
    reponse: 'Le facteur de dilution est oublié : le jus contient 10 × 2,4 = 24 mmol/L',
    distracteurs: [
      'Il fallait diviser par 10 : 0,24 mmol/L',
      'On ne peut pas lire une concentration sur une courbe d’étalonnage',
      'Aucune : la dilution ne change pas la concentration',
    ],
  },
  {
    id: 'dosages.n3.copie-longueur-onde',
    consigne: 'Corrige la copie.',
    formats: ['qcm', 'retournement'],
    question: 'Copie d’élève : « La solution de sulfate de cuivre est bleue, je règle donc le spectrophotomètre sur le bleu, vers 450 nm. » Où est l’erreur ?',
    reponse: 'Une solution bleue absorbe surtout dans l’orangé-rouge : on mesure vers 600 à 800 nm',
    distracteurs: [
      'Il faut mesurer en lumière blanche',
      'Il faut mesurer dans l’ultraviolet, à 200 nm',
      'Aucune : on mesure toujours à la couleur de la solution',
    ],
    aide: 'On voit la couleur qui n’est pas absorbée : à 450 nm, la solution bleue absorbe peu.',
  },
  {
    id: 'dosages.n3.copie-unite-absorbance',
    consigne: 'Corrige la copie.',
    formats: ['qcm', 'retournement'],
    question: 'Copie d’élève : « A = k × c = 150 L/mol × 3,0 × 10⁻³ mol/L = 0,45 L/mol. » Où est l’erreur ?',
    reponse: 'L’absorbance est sans unité : A = 0,45',
    distracteurs: ['Il fallait diviser : A = 0,000 02', 'L’absorbance s’exprime en mol/L', 'Aucune : l’unité vient de k'],
    aide: 'L·mol⁻¹ × mol·L⁻¹ : les unités se simplifient.',
  },
  {
    id: 'dosages.n3.copie-extrapolation',
    consigne: 'Corrige la copie.',
    formats: ['qcm', 'retournement'],
    question: 'Copie d’élève : « Mes étalons vont jusqu’à A = 1,0. Mon échantillon a A = 1,8 : je prolonge la droite et je lis c = 9,0 mmol/L. » Qu’en dit le correcteur ?',
    reponse: 'On ne prolonge pas la droite hors de la gamme : on dilue l’échantillon pour revenir dans la gamme',
    distracteurs: [
      'C’est la bonne méthode : la droite est valable partout',
      'Il faut refaire le blanc avec l’échantillon',
      'Il faut changer de longueur d’onde jusqu’à trouver A = 1,0',
    ],
    aide: 'Rien ne garantit que la proportionnalité tienne au-delà du dernier étalon.',
  },
  {
    id: 'dosages.n3.choix-methode',
    question: 'Quelle méthode convient pour doser le glucose d’une boisson incolore ?',
    formats: ['qcm', 'retournement'],
    reponse: 'Aucune des deux telle quelle : le glucose n’est ni coloré ni ionique',
    distracteurs: [
      'La conductimétrie, car la boisson conduit le courant',
      'La spectrophotométrie dans le visible, à λ_max',
      'Les deux, au choix',
    ],
    aide: 'La spectrophotométrie visible demande une espèce colorée ; la conductimétrie, une espèce ionique. Ici, il faudrait une autre méthode.',
  },
  {
    id: 'dosages.n3.pente',
    question: 'Coefficient directeur de la droite d’étalonnage',
    formats: ['saisie', 'qcm'],
    generer() {
      const k = auHasard([1150, 1250, 1380, 2240]);
      const c = auHasard([2.0e-4, 4.0e-4, 5.0e-4]);
      const A = k * c;
      return {
        question: `Un étalon à c = ${chSci(c, 2)} mol·L⁻¹ donne A = ${chNombre(A, 3)} (droite passant par l’origine). `
          + 'Coefficient k de A = k × c, en L·mol⁻¹ ?',
        reponse: `${chNombre(k, 3)} L·mol⁻¹`,
        nombre: k,
        tolerance: 0.02,
        unite: 'L·mol⁻¹',
        distracteurs: [`${chSci(c / A, 2)} L·mol⁻¹`, `${chSci(A * c, 2)} L·mol⁻¹`, `${chNombre(k / 1000, 3)} L·mol⁻¹`],
        aide: `k = A / c = ${chNombre(A, 3)} / ${chSci(c, 2)} ≈ ${chNombre(k, 3)} L·mol⁻¹. En pratique, on le tire de toute la série d’étalons (modélisation), pas d’un seul point.`,
      };
    },
  },
];

inscrireChapitre({
  cle: 'dosages',
  theme: 'Analyse chimique',
  titre: 'Dosages par étalonnage',
  resume: 'Spectrophotométrie (Beer-Lambert) et conductimétrie (Kohlrausch), sans les titrages. Trois niveaux : '
    + 'vocabulaire et formules ; petites situations à calculer de tête ; pièges, copies d’élèves et exercices type bac, '
    + 'calculatrice permise. Les valeurs changent à chaque passage.',
  n1: DOSAGES_N1,
  n2: DOSAGES_N2,
  n3: DOSAGES_N3,
});
