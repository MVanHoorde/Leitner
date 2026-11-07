/* Paquet « Interférences » (terminale, Ondes et signaux 1.B).
 *
 * Programme (BO spécial n° 8 du 25/07/2019) : caractériser le phénomène
 * d'interférences de deux ondes et en citer des conséquences concrètes ;
 * établir les conditions d'interférences constructives et destructives de deux
 * ondes issues de deux sources ponctuelles en phase (milieu homogène) ; les
 * tester à la surface de l'eau ; trous d'Young : prévoir les lieux avec
 * l'expression linéarisée δ = b x / D donnée, établir et exploiter
 * l'interfrange ; somme de deux sinusoïdes synchrones selon la phase (le code
 * Python est dans 35-contenu-python.js, pas ici).
 *
 * Notations : d₁, d₂ distances aux sources, δ = d₂ − d₁ différence de marche,
 * λ longueur d'onde, b distance entre les deux trous (ou fentes), D distance
 * des trous à l'écran, i interfrange, x position sur l'écran.
 * Niveau 2 : valeurs choisies pour un calcul de tête.
 *
 * PROPOSITION à auditer par Loïc (audit: 'brouillon', 35-contenu-chapitres.js).
 * RÈGLE ABSOLUE (32-paquets.js) : un identifiant de carte ne change jamais.
 */

/* ---------- Niveau 1 · Vocabulaire, définitions, formules ---------- */

const INTERFERENCES_N1 = [
  {
    id: 'interferences.n1.definition',
    question: 'Qu’appelle-t-on interférences ?',
    formats: ['retournement', 'qcm'],
    reponse: 'La superposition de deux ondes de même fréquence, qui donne des zones où l’amplitude est renforcée et d’autres où elle est atténuée',
    distracteurs: [
      'L’étalement d’une onde qui passe par une ouverture étroite',
      'Le décalage de fréquence dû au mouvement de la source',
      'L’affaiblissement d’une onde au cours de sa propagation',
    ],
  },
  {
    id: 'interferences.n1.coherence',
    question: 'À quelle condition deux sources peuvent-elles donner des interférences observables ?',
    formats: ['qcm', 'retournement'],
    reponse: 'Elles doivent être cohérentes : même fréquence et déphasage constant',
    distracteurs: [
      'Elles doivent avoir la même amplitude, quelle que soit leur fréquence',
      'Elles doivent être placées à moins d’un mètre l’une de l’autre',
      'Elles doivent émettre de la lumière blanche',
    ],
    aide: 'En pratique, on éclaire deux trous avec une même source (un laser) : les deux ondes sont alors cohérentes.',
  },
  {
    id: 'interferences.n1.deux-lampes',
    question: '« Deux lampes de poche qui éclairent le même mur y donnent des franges d’interférences. »',
    formats: ['vraifaux'],
    vrai: false,
    reponse: 'Faux : deux sources indépendantes ne sont pas cohérentes, leur déphasage varie sans cesse. Les franges se brouillent.',
  },
  {
    id: 'interferences.n1.difference-de-marche',
    question: 'Un point M est à la distance d₁ de la source S₁ et d₂ de la source S₂. Comment se définit la différence de marche δ ?',
    formats: ['retournement', 'qcm'],
    reponse: '$\\delta = d_2 - d_1$ : la différence des distances parcourues par les deux ondes',
    distracteurs: ['$\\delta = d_1 + d_2$', '$\\delta = \\dfrac{d_2}{d_1}$', '$\\delta = d_1 \\times d_2$'],
  },
  {
    id: 'interferences.n1.constructives',
    question: 'Deux sources en phase : condition d’interférences constructives en M ?',
    formats: ['qcm', 'retournement'],
    reponse: '$\\delta = k\\lambda$, avec k entier',
    distracteurs: [
      '$\\delta = \\left(k + \\frac{1}{2}\\right)\\lambda$, avec k entier',
      '$\\delta = \\dfrac{\\lambda}{k}$, avec k entier',
      '$\\delta = 0$ seulement',
    ],
    aide: 'Les deux ondes arrivent en phase : leurs amplitudes s’ajoutent.',
  },
  {
    id: 'interferences.n1.destructives',
    question: 'Deux sources en phase : condition d’interférences destructives en M ?',
    formats: ['qcm', 'retournement'],
    reponse: '$\\delta = \\left(k + \\frac{1}{2}\\right)\\lambda$, avec k entier',
    distracteurs: ['$\\delta = k\\lambda$, avec k entier', '$\\delta = 2k\\lambda$, avec k entier', '$\\delta = \\dfrac{\\lambda}{2k}$, avec k entier'],
    aide: 'Les deux ondes arrivent en opposition de phase : elles s’annulent si elles ont la même amplitude.',
  },
  {
    id: 'interferences.n1.amplitude-constructive',
    question: '« En un point d’interférences constructives, l’amplitude de l’onde résultante est maximale. »',
    formats: ['vraifaux'],
    vrai: true,
    reponse: 'Vrai : les deux ondes arrivent en phase, leurs élongations s’ajoutent à chaque instant.',
  },
  {
    id: 'interferences.n1.en-phase',
    question: 'On additionne deux signaux sinusoïdaux synchrones de même amplitude A, en phase. Amplitude de la somme ?',
    formats: ['qcm', 'retournement'],
    reponse: '2A',
    distracteurs: ['A', '0', 'A / 2', 'A²'],
  },
  {
    id: 'interferences.n1.opposition',
    question: 'On additionne deux signaux sinusoïdaux synchrones de même amplitude A, en opposition de phase. Amplitude de la somme ?',
    formats: ['qcm', 'retournement'],
    reponse: '0 : les deux signaux s’annulent à chaque instant',
    distracteurs: ['2A', 'A', 'A / 2'],
  },
  {
    id: 'interferences.n1.interfrange-definition',
    question: 'Dans une figure d’interférences, qu’appelle-t-on l’interfrange i ?',
    formats: ['retournement', 'qcm'],
    reponse: 'La distance entre les centres de deux franges brillantes consécutives (ou de deux franges sombres consécutives)',
    distracteurs: [
      'La largeur de la frange brillante centrale',
      'La distance entre les deux trous d’Young',
      'La distance entre une frange brillante et la frange sombre voisine',
    ],
  },
  {
    id: 'interferences.n1.interfrange-formule',
    question: 'Trous d’Young distants de b, écran à la distance D : expression de l’interfrange ?',
    formats: ['qcm', 'retournement'],
    reponse: '$i = \\dfrac{\\lambda D}{b}$',
    distracteurs: ['$i = \\dfrac{\\lambda b}{D}$', '$i = \\dfrac{b D}{\\lambda}$', '$i = \\dfrac{\\lambda}{b D}$'],
    aide: 'i augmente avec λ et avec D ; il diminue quand on écarte les trous (b plus grand).',
  },
  {
    id: 'interferences.n1.delta-young',
    question: 'Trous d’Young : quelle expression linéarisée de la différence de marche en un point d’abscisse x de l’écran ?',
    formats: ['qcm', 'retournement'],
    reponse: '$\\delta = \\dfrac{b\\,x}{D}$',
    distracteurs: ['$\\delta = \\dfrac{D\\,x}{b}$', '$\\delta = \\dfrac{\\lambda\\,x}{D}$', '$\\delta = b\\,x\\,D$'],
    aide: 'Cette expression est donnée dans les sujets ; il faut savoir l’exploiter : frange brillante si b x / D = kλ.',
  },
  {
    id: 'interferences.n1.unites',
    question: 'Dans $i = \\dfrac{\\lambda D}{b}$, en quelles unités exprimer λ, D et b ?',
    formats: ['qcm', 'retournement'],
    reponse: 'Toutes dans la même unité, par exemple en mètres ; i sort alors en mètres',
    distracteurs: ['λ en nm, D en m, b en mm, i sort en mm', 'Peu importe : la formule est sans unité', 'λ en m, D et b en cm'],
  },
  {
    id: 'interferences.n1.eau-immobile',
    question: 'Dans une cuve à ondes, deux pointes en phase frappent l’eau. Les points où l’eau reste immobile sont des lieux…',
    formats: ['qcm', 'retournement'],
    reponse: '…d’interférences destructives',
    distracteurs: ['…d’interférences constructives', '…de diffraction', '…où les ondes ne sont pas encore arrivées'],
  },
  {
    id: 'interferences.n1.consequences',
    question: 'Lequel de ces phénomènes n’est pas une conséquence des interférences ?',
    formats: ['qcm'],
    reponse: 'L’arc-en-ciel, dû à la dispersion de la lumière par les gouttes',
    distracteurs: [
      'Les couleurs changeantes d’une bulle de savon',
      'Le silence produit par un casque antibruit',
      'Les irisations d’une flaque d’essence sur la route',
    ],
  },
  {
    id: 'interferences.n1.centre',
    question: '« Pour deux sources en phase, un point situé à égale distance des deux sources est un lieu d’interférences constructives. »',
    formats: ['vraifaux'],
    vrai: true,
    reponse: 'Vrai : δ = 0 = 0 × λ. C’est la frange brillante centrale des trous d’Young.',
  },
];

/* ---------- Niveau 2 · Situations, calculs de tête ---------- */

/** δ / λ entier (constructive) ou demi-entier (destructive), au hasard. */
function natureInterferences() {
  const constructive = pileOuFace();
  const rapport = entierEntre(1, 3) + (constructive ? 0 : 0.5);
  return { constructive, rapport };
}

const INTERFERENCES_N2 = [
  {
    id: 'interferences.n2.cuve',
    question: 'Cuve à ondes : constructives ou destructives ?',
    formats: ['qcm'],
    generer() {
      const lambda = auHasard([1.0, 2.0, 4.0]);
      const { constructive, rapport } = natureInterferences();
      const d1 = auHasard([4, 6, 8, 10]);
      const d2 = d1 + rapport * lambda;
      return {
        question: `Deux pointes en phase créent des ondes de longueur d’onde λ = ${chNombre(lambda, 2)} cm. `
          + `Un point M est à ${chNombre(d1)} cm de S₁ et à ${chNombre(d2)} cm de S₂. Que se passe-t-il en M ?`,
        reponse: constructive
          ? `Interférences constructives : δ = ${chNombre(d2 - d1)} cm = ${chNombre(rapport)} λ`
          : `Interférences destructives : δ = ${chNombre(d2 - d1)} cm = ${chNombre(rapport)} λ`,
        distracteurs: constructive
          ? [`Interférences destructives : δ = ${chNombre(d2 - d1)} cm = ${chNombre(rapport)} λ`, 'Ni l’un ni l’autre : δ n’est pas nul',
            'On ne peut pas conclure sans la fréquence']
          : [`Interférences constructives : δ = ${chNombre(d2 - d1)} cm = ${chNombre(rapport)} λ`, 'Ni l’un ni l’autre : δ n’est pas nul',
            'On ne peut pas conclure sans la fréquence'],
        aide: `δ = d₂ − d₁ = ${chNombre(d2 - d1)} cm et δ / λ = ${chNombre(rapport)} : `
          + (constructive ? 'un nombre entier, les ondes arrivent en phase.' : 'un demi-entier, les ondes arrivent en opposition de phase.'),
      };
    },
  },
  {
    id: 'interferences.n2.haut-parleurs',
    question: 'Deux haut-parleurs en phase : le micro entend-il un maximum ?',
    formats: ['vraifaux'],
    generer() {
      const [f, lambda] = auHasard([[680, 0.5], [1700, 0.2], [340, 1.0]]);
      const { constructive, rapport } = natureInterferences();
      const d1 = auHasard([2, 3, 4]);
      const d2 = Number((d1 + rapport * lambda).toFixed(2));
      const vrai = pileOuFace();
      const annonce = vrai === constructive ? 'un maximum' : 'un minimum';
      return {
        question: `« Deux haut-parleurs en phase émettent à ${chNombre(f)} Hz (c = 340 m·s⁻¹). Un micro placé à ${chNombre(d1)} m de l’un et `
          + `${chNombre(d2)} m de l’autre capte ${annonce} d’intensité sonore. »`,
        vrai,
        reponse: `${vrai ? 'Vrai' : 'Faux'} : λ = c / f = ${chNombre(lambda)} m et δ = ${chNombre(d2 - d1)} m = ${chNombre(rapport)} λ, `
          + (constructive ? 'interférences constructives : un maximum.' : 'interférences destructives : un minimum.'),
      };
    },
  },
  {
    id: 'interferences.n2.interfrange',
    question: 'Calculer un interfrange',
    formats: ['saisie', 'qcm'],
    generer() {
      const lambda = auHasard([500, 600]);
      const b = auHasard([0.1, 0.2, 0.5]);
      const D = auHasard([1, 2]);
      // λ (nm) × D (m) / b (mm) donne i en µm ; / 1000 pour des mm.
      const i = (lambda * D) / b / 1000;
      return {
        question: `Trous d’Young : λ = ${lambda} nm, b = ${chNombre(b, 2)} mm, D = ${chNombre(D, 2)} m. Interfrange i en mm ?`,
        reponse: `${chNombre(i)} mm`,
        nombre: i,
        unite: 'mm',
        distracteurs: [`${chNombre(i * 10)} mm`, `${chNombre(i / 10)} mm`, `${chNombre((lambda * b) / D / 1000)} mm`],
        aide: `i = λD / b = ${lambda} × 10^{-9} × ${chNombre(D)} / (${chNombre(b)} × 10^{-3}) = ${chNombre(i)} × 10^{-3} m = ${chNombre(i)} mm.`,
      };
    },
  },
  {
    id: 'interferences.n2.longueur-onde',
    question: 'Retrouver la longueur d’onde à partir de l’interfrange',
    formats: ['saisie', 'qcm'],
    generer() {
      const lambda = auHasard([500, 600, 400]);
      const b = auHasard([0.1, 0.2, 0.5]);
      const D = auHasard([1, 2]);
      const i = (lambda * D) / b / 1000;
      return {
        question: `Trous d’Young : b = ${chNombre(b, 2)} mm, D = ${chNombre(D, 2)} m ; on mesure i = ${chNombre(i)} mm. Longueur d’onde en nm ?`,
        reponse: `${lambda} nm`,
        nombre: lambda,
        unite: 'nm',
        distracteurs: [`${chNombre(lambda * 10)} nm`, `${chNombre(lambda / 10)} nm`, `${chNombre(lambda * 1000)} nm`],
        aide: `λ = i b / D = ${chNombre(i)} × 10^{-3} × ${chNombre(b)} × 10^{-3} / ${chNombre(D)} = ${lambda} × 10^{-9} m.`,
      };
    },
  },
  {
    id: 'interferences.n2.ecart-trous',
    question: 'Retrouver l’écart entre les trous',
    formats: ['saisie', 'qcm'],
    generer() {
      const lambda = auHasard([500, 600]);
      const b = auHasard([0.1, 0.2, 0.5]);
      const D = auHasard([1, 2]);
      const i = (lambda * D) / b / 1000;
      return {
        question: `Laser de λ = ${lambda} nm, écran à D = ${chNombre(D, 2)} m ; l’interfrange vaut i = ${chNombre(i)} mm. Écart b entre les trous, en mm ?`,
        reponse: `${chNombre(b)} mm`,
        nombre: b,
        unite: 'mm',
        distracteurs: [`${chNombre(b * 10)} mm`, `${chNombre(b / 10)} mm`, `${chNombre(i)} mm`],
        aide: `b = λD / i = ${lambda} × 10^{-9} × ${chNombre(D)} / (${chNombre(i)} × 10^{-3}) = ${chNombre(b)} × 10^{-3} m.`,
      };
    },
  },
  {
    id: 'interferences.n2.effet-D',
    question: 'Que devient l’interfrange quand on éloigne l’écran ?',
    formats: ['qcm'],
    generer() {
      const [facteur, mot] = auHasard([[2, 'double'], [3, 'triple']]);
      const i = auHasard([1.5, 2.0, 2.5, 3.0]);
      return {
        question: `Avec des trous d’Young, i = ${chNombre(i)} mm. On ${mot} la distance D entre les trous et l’écran. Nouvel interfrange ?`,
        reponse: `${chNombre(i * facteur, 2)} mm`,
        distracteurs: [`${chNombre(i / facteur)} mm`, `${chNombre(i)} mm`, `${chNombre(i * facteur * facteur)} mm`],
        aide: `i = λD / b est proportionnel à D : il est multiplié par ${facteur}.`,
      };
    },
  },
  {
    id: 'interferences.n2.effet-b',
    question: 'Que devient l’interfrange quand on écarte les trous ?',
    formats: ['qcm'],
    generer() {
      const [facteur, mot] = auHasard([[2, 'double'], [3, 'triple']]);
      const i = auHasard([3.0, 6.0, 1.5]);
      return {
        question: `Avec des trous d’Young, i = ${chNombre(i)} mm. On ${mot} l’écart b entre les trous. Nouvel interfrange ?`,
        reponse: `${chNombre(i / facteur)} mm`,
        distracteurs: [`${chNombre(i * facteur)} mm`, `${chNombre(i)} mm`, `${chNombre(i / (facteur * facteur), 2)} mm`],
        aide: `i = λD / b est inversement proportionnel à b : il est divisé par ${facteur}.`,
      };
    },
  },
  {
    id: 'interferences.n2.point-ecran',
    question: 'Frange brillante ou sombre en un point de l’écran ?',
    formats: ['qcm'],
    generer() {
      // λ = 500 nm, b = 0,50 mm, D = 1,0 m : δ = b x / D = 500 nm par mm d'abscisse.
      const x = auHasard([1, 1.5, 2, 2.5, 3]);
      const rapport = x;
      const brillante = Number.isInteger(rapport);
      return {
        question: `Trous d’Young : λ = 500 nm, b = 0,50 mm, D = 1,0 m. En un point d’abscisse x = ${chNombre(x)} mm, `
          + 'avec $\\delta = \\dfrac{b\\,x}{D}$, on observe…',
        reponse: brillante
          ? `une frange brillante : δ = ${chNombre(500 * x)} nm = ${chNombre(rapport)} λ`
          : `une frange sombre : δ = ${chNombre(500 * x)} nm = ${chNombre(rapport)} λ`,
        distracteurs: brillante
          ? [`une frange sombre : δ = ${chNombre(500 * x)} nm = ${chNombre(rapport)} λ`, 'la frange centrale', 'aucune frange : x est trop grand']
          : [`une frange brillante : δ = ${chNombre(500 * x)} nm = ${chNombre(rapport)} λ`, 'la frange centrale', 'aucune frange : x est trop grand'],
        aide: `δ = 0,50 × 10^{-3} × ${chNombre(x)} × 10^{-3} / 1,0 = ${chNombre(500 * x)} × 10^{-9} m ; δ / λ = ${chNombre(rapport)}.`,
      };
    },
  },
  {
    id: 'interferences.n2.somme-signaux',
    question: 'Amplitude de la somme de deux signaux sinusoïdaux synchrones',
    formats: ['saisie', 'qcm'],
    generer() {
      const a = auHasard([1, 2, 3, 5]);
      const enPhase = pileOuFace();
      const resultat = enPhase ? 2 * a : 0;
      return {
        question: `Deux tensions sinusoïdales de même fréquence et de même amplitude ${a} V, `
          + `${enPhase ? 'en phase' : 'en opposition de phase'}. Amplitude de leur somme, en V ?`,
        reponse: `${resultat} V`,
        nombre: resultat,
        unite: 'V',
        distracteurs: pieges(`${resultat} V`, [`${a} V`, `${2 * a} V`, '0 V', `${chNombre(a / 2)} V`, `${a * a} V`]),
        aide: enPhase
          ? 'En phase, les deux signaux montent et descendent ensemble : les amplitudes s’ajoutent.'
          : 'En opposition de phase, quand l’un vaut +u, l’autre vaut −u : la somme est nulle à chaque instant.',
      };
    },
  },
  {
    id: 'interferences.n2.plusieurs-interfranges',
    question: 'Interfrange à partir de plusieurs franges',
    formats: ['saisie', 'qcm'],
    generer() {
      const n = auHasard([5, 10]);
      const i = auHasard([1.2, 1.5, 2.0, 2.5]);
      const L = n * i;
      return {
        question: `Sur l’écran, ${n + 1} franges brillantes successives s’étalent sur ${chNombre(L)} mm, du centre de la première au centre de la dernière. Interfrange en mm ?`,
        reponse: `${chNombre(i)} mm`,
        nombre: i,
        unite: 'mm',
        distracteurs: [`${chNombre(L / (n + 1), 2)} mm`, `${chNombre(L)} mm`, `${chNombre(L / (n - 1), 2)} mm`],
        aide: `${n + 1} franges brillantes délimitent ${n} interfranges : i = ${chNombre(L)} / ${n} = ${chNombre(i)} mm.`,
      };
    },
  },
  {
    id: 'interferences.n2.couleur',
    question: 'On remplace un laser vert (λ = 532 nm) par un laser rouge (λ = 650 nm), sans rien changer d’autre. Les franges…',
    formats: ['qcm', 'retournement'],
    reponse: '…s’écartent : i est proportionnel à λ',
    distracteurs: ['…se resserrent : i est inversement proportionnel à λ', '…ne bougent pas : seule la couleur change', '…disparaissent'],
  },
];

/* ---------- Niveau 3 · Pièges et type bac, calculatrice permise ---------- */

const INTERFERENCES_N3 = [
  {
    id: 'interferences.n3.dix-interfranges',
    question: 'Type bac : longueur d’onde d’un laser par les trous d’Young',
    formats: ['saisie', 'qcm'],
    generer() {
      const L = auHasard([47.3, 44.6, 52.0, 40.5]);
      const b = 0.2;
      const D = 1.5;
      const lambda = ((L / 10) * b) / D * 1000;
      return {
        question: `Trous d’Young : b = 0,20 mm, D = 1,50 m. On mesure ${chNombre(L, 3)} mm pour 10 interfranges. `
          + 'Longueur d’onde du laser, en nm ?',
        reponse: `${chNombre(lambda, 3)} nm`,
        nombre: lambda,
        tolerance: 0.01,
        unite: 'nm',
        distracteurs: [`${chNombre(lambda * 10, 3)} nm`, `${chNombre(((L / 9) * b) / D * 1000, 3)} nm`, `${chNombre(lambda / 10, 3)} nm`],
        aide: `i = ${chNombre(L, 3)} / 10 = ${chNombre(L / 10, 3)} mm, puis λ = i b / D = ${chNombre(L / 10, 3)} × 10^{-3} × 0,20 × 10^{-3} / 1,50 ≈ ${chNombre(lambda, 3)} × 10^{-9} m.`,
      };
    },
  },
  {
    id: 'interferences.n3.pourquoi-dix',
    question: 'Pourquoi mesure-t-on la longueur de 10 interfranges plutôt qu’un seul ?',
    formats: ['qcm', 'retournement'],
    reponse: 'Pour diviser l’incertitude relative sur i : l’erreur de lecture de la règle porte sur une longueur dix fois plus grande',
    distracteurs: [
      'Parce que la formule i = λD / b est valable seulement pour 10 franges',
      'Pour que la valeur de i soit dix fois plus grande',
      'Parce que la frange centrale est trop large pour être mesurée',
    ],
  },
  {
    id: 'interferences.n3.copie-franges',
    consigne: 'Corrige la copie.',
    formats: ['qcm', 'retournement'],
    question: 'Copie d’élève : « Je compte 6 franges brillantes sur 12 mm, du centre de la première au centre de la dernière, donc i = 12 / 6 = 2,0 mm. » Où est l’erreur ?',
    reponse: '6 franges brillantes ne délimitent que 5 interfranges : i = 12 / 5 = 2,4 mm',
    distracteurs: [
      'Il fallait compter les franges sombres',
      'Il fallait multiplier : i = 12 × 6 = 72 mm',
      'Aucune : i = 2,0 mm est juste',
    ],
  },
  {
    id: 'interferences.n3.copie-b-D',
    consigne: 'Corrige la copie.',
    formats: ['qcm', 'retournement'],
    question: 'Copie d’élève : « λ = 600 nm, b = 0,20 mm, D = 2,0 m. i = λ b / D = 600 × 10⁻⁹ × 0,20 × 10⁻³ / 2,0 = 6,0 × 10⁻¹¹ m. » Où est l’erreur ?',
    reponse: 'b et D sont inversés : i = λD / b = 6,0 × 10⁻³ m, soit 6,0 mm',
    distracteurs: [
      'λ devait rester en nm',
      'Il manque un facteur 2 au dénominateur',
      'Aucune : un interfrange est toujours très petit',
    ],
    aide: 'Un résultat de 10⁻¹¹ m, plus petit qu’un atome, aurait dû alerter : les franges se mesurent à la règle.',
  },
  {
    id: 'interferences.n3.copie-nature',
    consigne: 'Corrige la copie.',
    formats: ['qcm', 'retournement'],
    question: 'Copie d’élève : « λ = 2,0 cm et δ = 3,0 cm. δ est un multiple de λ car 3,0 > 2,0 : les interférences sont constructives. » Où est l’erreur ?',
    reponse: 'δ / λ = 1,5, un demi-entier : les interférences sont destructives',
    distracteurs: [
      'δ / λ = 1,5 : c’est un multiple de λ, donc constructives',
      'Il fallait calculer δ × λ',
      'On ne peut pas conclure sans connaître la fréquence',
    ],
  },
  {
    id: 'interferences.n3.copie-unites',
    consigne: 'Corrige la copie.',
    formats: ['qcm', 'retournement'],
    question: 'Copie d’élève : « λ = 650 nm, D = 1,5 m, b = 0,30 mm. i = 650 × 1,5 / 0,30 = 3 250 m. » Où est l’erreur ?',
    reponse: 'Les unités ne sont pas converties : i = 650 × 10⁻⁹ × 1,5 / (0,30 × 10⁻³) ≈ 3,3 × 10⁻³ m',
    distracteurs: [
      'Il fallait écrire i = 3 250 mm',
      'La formule est i = λ b / D',
      'Aucune : le calcul est juste',
    ],
  },
  {
    id: 'interferences.n3.lumiere-blanche',
    question: 'Trous d’Young éclairés en lumière blanche : pourquoi la frange centrale est-elle blanche et les autres irisées ?',
    formats: ['qcm', 'retournement'],
    reponse: 'Au centre, δ = 0 est constructif pour toutes les longueurs d’onde ; ailleurs, i dépend de λ et les franges des couleurs se décalent',
    distracteurs: [
      'Au centre, la lumière ne passe que par un seul trou',
      'La lumière blanche ne donne pas d’interférences : on voit seulement de la diffraction',
      'Les couleurs sont dues à la réfraction dans les trous',
    ],
  },
  {
    id: 'interferences.n3.plus-visible',
    question: 'Les franges sont trop serrées pour être mesurées. Quel réglage les écarte ?',
    formats: ['qcm'],
    reponse: 'Prendre des trous plus rapprochés, ou reculer l’écran',
    distracteurs: [
      'Prendre des trous plus écartés',
      'Rapprocher l’écran des trous',
      'Prendre un laser bleu à la place du rouge',
    ],
    aide: 'i = λD / b : augmenter D ou λ, diminuer b.',
  },
  {
    id: 'interferences.n3.etablir',
    question: 'Pourquoi deux ondes issues de sources en phase arrivent-elles en phase en M quand δ = kλ ?',
    formats: ['qcm', 'retournement'],
    reponse: 'Le retard de l’une sur l’autre vaut δ / c = kT : un nombre entier de périodes',
    distracteurs: [
      'Parce qu’elles parcourent alors la même distance',
      'Parce que leurs amplitudes sont égales',
      'Parce que leur retard vaut une demi-période',
    ],
    aide: 'Un retard de kT ne change rien à une onde périodique. Un retard de (k + ½)T la met en opposition de phase : δ = (k + ½)λ.',
  },
  {
    id: 'interferences.n3.energie',
    question: '« Dans une zone d’interférences destructives, l’énergie de l’onde disparaît : il y a une perte d’énergie. »',
    formats: ['vraifaux'],
    vrai: false,
    reponse: 'Faux : l’énergie est redistribuée. Ce qui manque dans les franges sombres se retrouve dans les franges brillantes.',
  },
  {
    id: 'interferences.n3.antibruit',
    question: 'Comment fonctionne un casque antibruit actif ?',
    formats: ['qcm', 'retournement'],
    reponse: 'Il capte le bruit et émet une onde de même fréquence en opposition de phase : interférences destructives à l’oreille',
    distracteurs: [
      'Il émet une onde en phase avec le bruit, qui l’absorbe',
      'Il émet un son de fréquence plus élevée qui masque le bruit',
      'Il diffracte le bruit loin de l’oreille',
    ],
  },
  {
    id: 'interferences.n3.cuve-calcul',
    question: 'Type bac : cuve à ondes, de la fréquence à la nature des interférences',
    formats: ['qcm'],
    generer() {
      const [f, v, lambda] = auHasard([[20, 0.30, 1.5], [25, 0.30, 1.2], [15, 0.24, 1.6]]);
      const { constructive, rapport } = natureInterferences();
      const d1 = auHasard([5.0, 6.0, 7.5]);
      const d2 = Number((d1 + rapport * lambda).toFixed(2));
      return {
        question: `Deux pointes en phase vibrent à ${f} Hz ; les ondes se propagent à ${chNombre(v, 2)} m·s⁻¹. `
          + `Un point M est à ${chNombre(d1)} cm de S₁ et à ${chNombre(d2)} cm de S₂. En M, les interférences sont…`,
        reponse: `${constructive ? 'constructives' : 'destructives'} : λ = v / f = ${chNombre(lambda)} cm et δ / λ = ${chNombre(rapport)}`,
        distracteurs: [
          `${constructive ? 'destructives' : 'constructives'} : λ = v / f = ${chNombre(lambda)} cm et δ / λ = ${chNombre(rapport)}`,
          `${constructive ? 'destructives' : 'constructives'} : λ = v × f = ${chNombre(v * f * 100)} cm`,
          'impossibles à prévoir : les deux distances sont différentes',
        ],
        aide: `λ = ${chNombre(v, 2)} / ${f} = ${chNombre(lambda / 100)} m = ${chNombre(lambda)} cm ; δ = ${chNombre(Number((d2 - d1).toFixed(2)))} cm.`,
      };
    },
  },
  {
    id: 'interferences.n3.bulle',
    question: 'Pourquoi une bulle de savon se colore-t-elle ?',
    formats: ['qcm', 'retournement'],
    reponse: 'La lumière réfléchie par les deux faces du film interfère ; selon l’épaisseur, certaines longueurs d’onde sont renforcées, d’autres éteintes',
    distracteurs: [
      'Le savon contient des colorants qui absorbent certaines couleurs',
      'La bulle diffracte la lumière comme une fente fine',
      'L’effet Doppler décale la couleur quand la bulle bouge',
    ],
  },
  {
    id: 'interferences.n3.conditions-programme',
    question: '« Les conditions δ = kλ (constructives) et δ = (k + ½)λ (destructives) valent pour deux sources quelconques. »',
    formats: ['vraifaux'],
    vrai: false,
    reponse: 'Faux : elles supposent deux sources cohérentes en phase, dans un milieu homogène. Si les sources sont en opposition de phase, les deux conditions s’échangent.',
  },
];

inscrireChapitre({
  cle: 'interferences',
  theme: 'Ondes et signaux',
  titre: 'Interférences',
  resume: 'Trois niveaux : vocabulaire, conditions et formules ; différence de marche et trous d’Young de tête ; '
    + 'pièges, copies d’élèves et exercices type bac, calculatrice permise. Les valeurs changent à chaque passage.',
  n1: INTERFERENCES_N1,
  n2: INTERFERENCES_N2,
  n3: INTERFERENCES_N3,
});
