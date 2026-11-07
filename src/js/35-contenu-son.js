/* Paquet « Intensité et niveau sonores » (terminale, Ondes et signaux 1.A).
 *
 * Programme (BO spécial n° 8 du 25/07/2019) : intensité sonore, intensité
 * sonore de référence, niveau d'intensité sonore ; exploiter l'expression du
 * niveau d'intensité sonore ; illustrer l'atténuation géométrique et
 * l'atténuation par absorption (en dB) ; logarithme décimal et sa réciproque.
 *
 * Notations : I intensité sonore (W·m⁻²), I₀ = 1,0 × 10⁻¹² W·m⁻²,
 * L = 10 log(I / I₀) en dB, atténuation A = L₁ − L₂ en dB.
 * Niveau 2 : puissances de dix entières, ×2 → +3 dB, ×10 → +10 dB,
 * distance ×2 → −6 dB, ×10 → −20 dB : tout se fait de tête.
 *
 * PROPOSITION à auditer par Loïc (audit: 'brouillon', 35-contenu-chapitres.js).
 * RÈGLE ABSOLUE (32-paquets.js) : un identifiant de carte ne change jamais.
 */

/* ---------- Niveau 1 · Vocabulaire, définitions, formules ---------- */

const SON_N1 = [
  {
    id: 'son.n1.intensite-definition',
    question: 'Qu’est-ce que l’intensité sonore I ?',
    formats: ['retournement', 'qcm'],
    reponse: 'La puissance sonore reçue par unité de surface',
    distracteurs: [
      'La puissance totale émise par la source',
      'La fréquence du son perçu',
      'Le niveau sonore mesuré par un sonomètre, en décibels',
    ],
    aide: 'I = P / S, en W·m⁻².',
  },
  {
    id: 'son.n1.unite-intensite',
    question: 'Dans quelle unité s’exprime l’intensité sonore I ?',
    formats: ['qcm', 'retournement'],
    reponse: 'W·m⁻²',
    distracteurs: ['dB', 'W', 'Hz'],
    aide: 'Une puissance (W) par unité de surface (m²). Le décibel est l’unité du niveau d’intensité sonore L, pas de I.',
  },
  {
    id: 'son.n1.unite-niveau',
    question: 'Dans quelle unité s’exprime le niveau d’intensité sonore L ?',
    formats: ['qcm', 'retournement'],
    reponse: 'Le décibel (dB)',
    distracteurs: ['Le watt par mètre carré (W·m⁻²)', 'Le hertz (Hz)', 'Le watt (W)'],
  },
  {
    id: 'son.n1.formule-niveau',
    question: 'Quelle expression donne le niveau d’intensité sonore L ?',
    formats: ['qcm', 'retournement'],
    reponse: '$L = 10 \\log\\left(\\dfrac{I}{I_0}\\right)$',
    distracteurs: [
      '$L = \\log\\left(\\dfrac{I}{I_0}\\right)$',
      '$L = 10 \\log\\left(\\dfrac{I_0}{I}\\right)$',
      '$L = 10 \\times \\dfrac{I}{I_0}$',
    ],
    aide: 'Le facteur 10 transforme les bels en décibels ; log est le logarithme décimal.',
  },
  {
    id: 'son.n1.reciproque',
    question: 'Retrouver l’intensité à partir du niveau : $I = \\;$?',
    formats: ['qcm', 'retournement'],
    reponse: '$I = I_0 \\times 10^{L/10}$',
    distracteurs: ['$I = I_0 \\times 10^{10L}$', '$I = 10^{L/10}$', '$I = I_0 \\times \\dfrac{L}{10}$'],
    aide: 'On isole le log : log(I / I₀) = L / 10, puis on prend la réciproque : I / I₀ = 10^{L/10}.',
  },
  {
    id: 'son.n1.i0',
    question: 'Que vaut l’intensité sonore de référence $I_0$ ?',
    formats: ['qcm', 'retournement'],
    reponse: '$I_0 = 1{,}0 \\times 10^{-12}$ W·m⁻², le seuil d’audibilité',
    distracteurs: [
      '$I_0 = 1{,}0 \\times 10^{12}$ W·m⁻², le seuil de douleur',
      '$I_0 = 1{,}0$ W·m⁻², le seuil de douleur',
      '$I_0 = 0$ W·m⁻², le silence absolu',
    ],
  },
  {
    id: 'son.n1.zero-db',
    question: '« Un niveau d’intensité sonore de 0 dB correspond à une intensité sonore nulle. »',
    formats: ['vraifaux'],
    vrai: false,
    reponse: 'Faux : L = 0 dB quand I = I₀ = 1,0 × 10⁻¹² W·m⁻², le seuil d’audibilité, car log(1) = 0.',
  },
  {
    id: 'son.n1.seuil-douleur',
    question: 'Vers quel niveau d’intensité sonore se situe le seuil de douleur ?',
    formats: ['qcm', 'retournement'],
    reponse: 'Environ 120 dB',
    distracteurs: ['Environ 0 dB', 'Environ 60 dB', 'Environ 1 000 dB'],
    aide: '120 dB correspond à I ≈ 1 W·m⁻² : mille milliards de fois I₀.',
  },
  {
    id: 'son.n1.log-decimal',
    question: '« Dans $L = 10 \\log(I / I_0)$, log désigne le logarithme népérien, la touche ln de la calculatrice. »',
    formats: ['vraifaux'],
    vrai: false,
    reponse: 'Faux : c’est le logarithme décimal, la touche log. Avec ln, le résultat est faux, sans aucun message d’erreur.',
  },
  {
    id: 'son.n1.rapport-sans-unite',
    question: '« Le rapport $I / I_0$ n’a pas d’unité. »',
    formats: ['vraifaux'],
    vrai: true,
    reponse: 'Vrai : deux intensités en W·m⁻² se divisent ; c’est pourquoi on peut en prendre le logarithme.',
  },
  {
    id: 'son.n1.intensites-additives',
    question: 'Deux sources sonores fonctionnent ensemble. Qu’est-ce qui s’additionne ?',
    formats: ['qcm', 'retournement'],
    reponse: 'Les intensités sonores, en W·m⁻²',
    distracteurs: ['Les niveaux d’intensité sonore, en dB', 'Les fréquences, en Hz', 'Les logarithmes des niveaux'],
    aide: 'I = I₁ + I₂, puis L = 10 log(I / I₀). Additionner des décibels est faux.',
  },
  {
    id: 'son.n1.attenuation-definition',
    question: 'Comment se définit l’atténuation A entre deux points ?',
    formats: ['qcm', 'retournement'],
    reponse: '$A = L_1 - L_2$, une différence de niveaux, en dB',
    distracteurs: ['$A = I_1 - I_2$, en W·m⁻²', '$A = \\dfrac{L_1}{L_2}$, sans unité', '$A = L_1 + L_2$, en dB'],
  },
  {
    id: 'son.n1.attenuation-geometrique',
    question: 'D’où vient l’atténuation géométrique d’un son ?',
    formats: ['qcm', 'retournement'],
    reponse: 'La puissance se répartit sur une surface de plus en plus grande en s’éloignant de la source',
    distracteurs: [
      'Le milieu absorbe une partie de l’énergie',
      'La fréquence du son diminue avec la distance',
      'La célérité du son diminue avec la distance',
    ],
    aide: 'C’est l’absorption qui dissipe l’énergie dans le milieu (mur, laine de verre, air).',
  },
  {
    id: 'son.n1.absorption',
    question: 'Une cloison en laine de roche diminue le niveau sonore d’une pièce à l’autre. Quel type d’atténuation ?',
    formats: ['qcm', 'retournement'],
    reponse: 'Une atténuation par absorption : le matériau absorbe une partie de l’énergie',
    distracteurs: [
      'Une atténuation géométrique : la surface de l’onde augmente',
      'Un effet Doppler : la fréquence diminue',
      'Une diffraction : l’onde contourne la cloison',
    ],
  },
  {
    id: 'son.n1.source-ponctuelle',
    question: 'Source ponctuelle de puissance P, qui émet dans toutes les directions : intensité à la distance d ?',
    formats: ['qcm', 'retournement'],
    reponse: '$I = \\dfrac{P}{4 \\pi d^2}$',
    distracteurs: ['$I = \\dfrac{P}{4 \\pi d}$', '$I = P \\times 4 \\pi d^2$', '$I = \\dfrac{P}{\\pi d^2}$'],
    aide: '4πd² est l’aire de la sphère de rayon d sur laquelle la puissance se répartit.',
  },
  {
    id: 'son.n1.niveau-pas-proportionnel',
    question: '« Le niveau d’intensité sonore est proportionnel à l’intensité sonore. »',
    formats: ['vraifaux'],
    vrai: false,
    reponse: 'Faux : L dépend du logarithme de I. Multiplier I par 10 ajoute 10 dB, il ne multiplie pas L par 10.',
  },
];

/* ---------- Niveau 2 · Situations, calculs de tête ---------- */

const SON_N2 = [
  {
    id: 'son.n2.niveau-depuis-intensite',
    question: 'Niveau d’intensité sonore d’une intensité donnée',
    formats: ['saisie', 'qcm'],
    generer() {
      const k = entierEntre(2, 9);
      const L = 10 * (12 - k);
      return {
        question: `Un micro reçoit une intensité sonore I = 10^{-${k}} W·m⁻². I₀ = 10^{-12} W·m⁻². Niveau d’intensité sonore L ?`,
        reponse: `${L} dB`,
        nombre: L,
        unite: 'dB',
        distracteurs: pieges(`${L} dB`, [`${12 - k} dB`, `${10 * k} dB`, `−${10 * k} dB`, `${10 * (12 + k)} dB`]),
        aide: `I / I₀ = 10^{-${k}} / 10^{-12} = 10^{${12 - k}}, donc L = 10 × ${12 - k} = ${L} dB.`,
      };
    },
  },
  {
    id: 'son.n2.intensite-depuis-niveau',
    question: 'Intensité sonore d’un niveau donné',
    formats: ['saisie', 'qcm'],
    generer() {
      const L = 10 * entierEntre(3, 11);
      const n = L / 10 - 12;
      const I = 10 ** n;
      return {
        question: `Un sonomètre affiche L = ${L} dB. I₀ = 10^{-12} W·m⁻². Intensité sonore I, en W·m⁻² ?`,
        reponse: `10^{${n}} W·m⁻²`,
        nombre: I,
        unite: 'W·m⁻²',
        distracteurs: pieges(`10^{${n}} W·m⁻²`, [`10^{${-n}} W·m⁻²`, `10^{${L / 10}} W·m⁻²`, `10^{${n - 1}} W·m⁻²`, `${L / 10} W·m⁻²`]),
        aide: `I = I₀ × 10^{L/10} = 10^{-12} × 10^{${L / 10}} = 10^{${n}} W·m⁻².`,
      };
    },
  },
  {
    id: 'son.n2.deux-sources',
    question: 'Deux sources identiques fonctionnent ensemble',
    formats: ['saisie', 'qcm'],
    generer() {
      const L = auHasard([50, 60, 70, 80, 90]);
      return {
        question: `Une machine seule produit ${L} dB à l’endroit où se trouve l’ouvrier. On allume une deuxième machine identique. Niveau total ?`,
        reponse: `${L + 3} dB`,
        nombre: L + 3,
        unite: 'dB',
        distracteurs: pieges(`${L + 3} dB`, [`${2 * L} dB`, `${L} dB`, `${L + 10} dB`, `${L + 6} dB`]),
        aide: 'L’intensité double : L = 10 log(2I / I₀) = 10 log 2 + 10 log(I / I₀) ≈ 3 + L₁. Doubler l’intensité ajoute 3 dB.',
      };
    },
  },
  {
    id: 'son.n2.dix-sources',
    question: 'Plusieurs sources identiques fonctionnent ensemble',
    formats: ['saisie', 'qcm'],
    generer() {
      const L = auHasard([40, 50, 60, 70]);
      const [n, ajout] = auHasard([[10, 10], [100, 20], [1000, 30]]);
      return {
        question: `Un élève qui parle produit ${L} dB au fond de la salle. ${chNombre(n)} élèves parlent en même temps, chacun au même niveau. Niveau total ?`,
        reponse: `${L + ajout} dB`,
        nombre: L + ajout,
        unite: 'dB',
        distracteurs: pieges(`${L + ajout} dB`, [`${chNombre(L * n)} dB`, `${L + n} dB`, `${L + ajout / 10} dB`, `${L} dB`]),
        aide: `L’intensité est multipliée par ${chNombre(n)} = 10^{${ajout / 10}} : on ajoute 10 × ${ajout / 10} = ${ajout} dB.`,
      };
    },
  },
  {
    id: 'son.n2.combien-sources',
    question: 'Combien de sources identiques pour gagner des décibels ?',
    formats: ['saisie', 'qcm'],
    generer() {
      const L = auHasard([60, 70, 80]);
      const [ajout, n] = auHasard([[3, 2], [10, 10], [20, 100]]);
      return {
        question: `Une enceinte produit ${L} dB. Combien d’enceintes identiques faut-il, ensemble, pour atteindre ${L + ajout} dB ?`,
        reponse: `${n} enceintes`,
        nombre: n,
        distracteurs: pieges(`${n} enceintes`, [`${ajout} enceintes`, `${n + 1} enceintes`, `${n * 10} enceintes`, `${n * 2} enceintes`]),
        aide: ajout === 3
          ? '+3 dB : l’intensité double, il faut 2 enceintes.'
          : `+${ajout} dB : l’intensité est multipliée par 10^{${ajout / 10}} = ${n}, il faut ${n} enceintes.`,
      };
    },
  },
  {
    id: 'son.n2.facteur-intensite',
    question: 'Le niveau augmente : par combien l’intensité est-elle multipliée ?',
    formats: ['saisie', 'qcm'],
    generer() {
      const [dL, facteur] = auHasard([[3, 2], [10, 10], [20, 100], [30, 1000], [40, 10000]]);
      const L1 = auHasard([30, 40, 50, 60]);
      return {
        question: `Le niveau d’intensité sonore passe de ${L1} dB à ${L1 + dL} dB. Par combien l’intensité sonore est-elle multipliée ?`,
        reponse: `Par ${chNombre(facteur)}`,
        nombre: facteur,
        distracteurs: pieges(`Par ${chNombre(facteur)}`, [`Par ${dL}`, `Par ${chNombre(dL / 10)}`, `Par ${chNombre((L1 + dL) / L1, 2)}`, `Par ${chNombre(facteur * 10)}`]),
        aide: dL === 3
          ? '+3 dB correspond à une intensité doublée.'
          : `+${dL} dB = ${dL / 10} × 10 dB : l’intensité est multipliée par 10^{${dL / 10}} = ${chNombre(facteur)}.`,
      };
    },
  },
  {
    id: 'son.n2.distance',
    question: 'Niveau sonore quand on s’éloigne d’une source ponctuelle',
    formats: ['saisie', 'qcm'],
    generer() {
      const L = auHasard([70, 80, 90, 100]);
      const [facteur, perte] = auHasard([[2, 6], [10, 20]]);
      const d = auHasard([1, 2, 5]);
      return {
        question: `À ${d} m d’une source ponctuelle, L = ${L} dB. Sans absorption, quel niveau à ${d * facteur} m ?`,
        reponse: `${L - perte} dB`,
        nombre: L - perte,
        unite: 'dB',
        distracteurs: pieges(`${L - perte} dB`, [`${L / facteur} dB`, `${L - 3} dB`, `${L - facteur} dB`, `${L - 10} dB`]),
        aide: `I = P / (4πd²) : distance × ${facteur}, intensité divisée par ${facteur * facteur}. `
          + (facteur === 2 ? 'Diviser par 4 = diviser deux fois par 2 : −3 − 3 = −6 dB.' : 'Diviser par 100 = 10^{2} : −20 dB.'),
      };
    },
  },
  {
    id: 'son.n2.attenuation-mur',
    question: 'Atténuation apportée par une paroi',
    formats: ['saisie', 'qcm'],
    generer() {
      const L1 = auHasard([75, 80, 85, 90, 95]);
      const A = auHasard([25, 30, 35, 40, 45]);
      return {
        question: `Dans une salle de répétition, L = ${L1} dB ; dans le couloir, derrière la porte isolante, L = ${L1 - A} dB. Atténuation de la porte ?`,
        reponse: `${A} dB`,
        nombre: A,
        unite: 'dB',
        distracteurs: pieges(`${A} dB`, [`${L1 + (L1 - A)} dB`, `${chNombre(Math.round((L1 / (L1 - A)) * 10) / 10)} dB`, `${A * 10} dB`]),
        aide: `A = L₁ − L₂ = ${L1} − ${L1 - A} = ${A} dB : une atténuation par absorption.`,
      };
    },
  },
  {
    id: 'son.n2.attenuation-facteur',
    question: 'Atténuation quand l’intensité est divisée par une puissance de dix',
    formats: ['saisie', 'qcm'],
    generer() {
      const k = entierEntre(1, 5);
      const A = 10 * k;
      return {
        question: `Un casque antibruit divise l’intensité sonore par ${chNombre(10 ** k)}. Atténuation, en dB ?`,
        reponse: `${A} dB`,
        nombre: A,
        unite: 'dB',
        distracteurs: pieges(`${A} dB`, [`${k} dB`, `${chNombre(10 ** k)} dB`, `${A + 10} dB`, `${A / 2} dB`]),
        aide: `Diviser I par 10^{${k}}, c’est retirer 10 × ${k} = ${A} dB.`,
      };
    },
  },
  {
    id: 'son.n2.sources-inegales',
    question: 'Deux sources très différentes',
    formats: ['qcm', 'saisie'],
    generer() {
      const L1 = auHasard([70, 80, 90]);
      const L2 = L1 - auHasard([20, 30]);
      return {
        question: `Une tondeuse produit ${L1} dB et, au même endroit, un oiseau chante à ${L2} dB. Niveau total, à 1 dB près ?`,
        reponse: `${L1} dB`,
        nombre: L1,
        tolerance: 0.013,
        unite: 'dB',
        distracteurs: pieges(`${L1} dB`, [`${L1 + L2} dB`, `${L1 + 3} dB`, `${(L1 + L2) / 2} dB`]),
        aide: `L’oiseau a une intensité ${chNombre(10 ** ((L1 - L2) / 10))} fois plus faible : elle ne change presque rien à la somme des intensités.`,
      };
    },
  },
  {
    id: 'son.n2.ordre-grandeur',
    question: 'Ordre de grandeur d’intensité sonore',
    formats: ['qcm'],
    generer() {
      const [situation, L] = auHasard([
        ['une conversation', 60], ['une salle de classe bruyante', 70], ['un concert de rock', 110],
        ['une bibliothèque', 30], ['une rue animée', 80],
      ]);
      const n = L / 10 - 12;
      return {
        question: `Pour ${situation}, un sonomètre affiche environ ${L} dB. Intensité sonore correspondante ?`,
        reponse: `10^{${n}} W·m⁻²`,
        distracteurs: pieges(`10^{${n}} W·m⁻²`, [`10^{${n + 2}} W·m⁻²`, `10^{${n - 2}} W·m⁻²`, `${L} W·m⁻²`, `10^{${L / 10}} W·m⁻²`]),
        aide: `I = 10^{-12} × 10^{${L / 10}} = 10^{${n}} W·m⁻².`,
      };
    },
  },
];

/* ---------- Niveau 3 · Pièges et type bac, calculatrice permise ---------- */

/** Un niveau au dixième de dB, en gardant le zéro : 68,0 dB. */
function sonDixieme(L) {
  return (Math.round(L * 10) / 10).toFixed(1).replace('.', ',').replace('-', '−');
}

const SON_N3 = [
  {
    id: 'son.n3.niveau-calculatrice',
    question: 'Niveau d’intensité sonore, calculatrice',
    formats: ['saisie', 'qcm'],
    generer() {
      const a = auHasard([2.5, 3.2, 4.0, 6.3, 8.0]);
      const n = entierEntre(3, 8);
      const I = a * 10 ** -n;
      const L = 10 * Math.log10(I / 1e-12);
      return {
        question: `Intensité mesurée : I = ${chSci(I, 2)} W·m⁻² ; I₀ = 1,0 × 10^{-12} W·m⁻². Niveau L, au dixième de dB ?`,
        reponse: `${sonDixieme(L)} dB`,
        nombre: L,
        tolerance: 0.002,
        unite: 'dB',
        distracteurs: [`${sonDixieme(10 * Math.log(I / 1e-12))} dB`, `${sonDixieme(10 * Math.log10(I))} dB`,
          `${sonDixieme(Math.log10(I / 1e-12))} dB`],
        aide: `L = 10 log(${chSci(I, 2)} / 1,0 × 10^{-12}) ≈ ${chNombre(L, 3)} dB. Les pièges : ln au lieu de log, oubli de I₀, oubli du facteur 10.`,
      };
    },
  },
  {
    id: 'son.n3.intensite-calculatrice',
    question: 'Intensité sonore à partir d’un niveau, calculatrice',
    formats: ['saisie', 'qcm'],
    generer() {
      const L = auHasard([45, 65, 75, 85, 95, 105]);
      const I = 1e-12 * 10 ** (L / 10);
      return {
        question: `Un sonomètre affiche L = ${L} dB. I₀ = 1,0 × 10^{-12} W·m⁻². Intensité sonore, à deux chiffres significatifs ?`,
        reponse: `${chSci(I, 2)} W·m⁻²`,
        nombre: I,
        tolerance: 0.02,
        unite: 'W·m⁻²',
        distracteurs: [`${chSci(10 ** (L / 10), 2)} W·m⁻²`, `1,0 × 10^{${L - 12}} W·m⁻²`, `${chSci(1e-12 * L / 10, 2)} W·m⁻²`],
        aide: `I = I₀ × 10^{L/10} = 1,0 × 10^{-12} × 10^{${chNombre(L / 10)}} ≈ ${chSci(I, 2)} W·m⁻².`,
      };
    },
  },
  {
    id: 'son.n3.deux-sources-differentes',
    question: 'Deux sources de niveaux différents',
    formats: ['saisie', 'qcm'],
    generer() {
      const L1 = auHasard([60, 70]);
      const L2 = L1 + auHasard([2, 5, 6]);
      const L = 10 * Math.log10(10 ** (L1 / 10) + 10 ** (L2 / 10));
      return {
        question: `Au même point, une première source seule donne ${L1} dB et une seconde seule ${L2} dB. Niveau total, au dixième de dB ?`,
        reponse: `${sonDixieme(L)} dB`,
        nombre: L,
        tolerance: 0.002,
        unite: 'dB',
        distracteurs: [`${L1 + L2} dB`, `${L2 + 3} dB`, `${chNombre((L1 + L2) / 2)} dB`],
        aide: `I = I₁ + I₂ = I₀ (10^{${chNombre(L1 / 10)}} + 10^{${chNombre(L2 / 10)}}), puis L = 10 log(I / I₀) ≈ ${chNombre(L, 3)} dB.`,
      };
    },
  },
  {
    id: 'son.n3.source-ponctuelle',
    question: 'Niveau sonore d’une source ponctuelle de puissance connue',
    formats: ['saisie', 'qcm'],
    generer() {
      const P = auHasard([0.1, 1, 5]);
      const d = auHasard([2, 5, 10]);
      const I = P / (4 * Math.PI * d * d);
      const L = 10 * Math.log10(I / 1e-12);
      return {
        question: `Un haut-parleur, assimilé à une source ponctuelle, émet une puissance sonore de ${chNombre(P)} W dans toutes les directions. `
          + `Niveau d’intensité sonore à ${d} m, au dixième de dB ? I₀ = 1,0 × 10^{-12} W·m⁻².`,
        reponse: `${sonDixieme(L)} dB (I ≈ ${chSci(I, 2)} W·m⁻²)`,
        nombre: L,
        tolerance: 0.002,
        unite: 'dB',
        distracteurs: [`${sonDixieme(10 * Math.log10(P / (4 * Math.PI * d) / 1e-12))} dB`,
          `${sonDixieme(10 * Math.log10(P / 1e-12))} dB`,
          `${sonDixieme(10 * Math.log10(P / (Math.PI * d * d) / 1e-12))} dB`],
        aide: `I = P / (4πd²) = ${chNombre(P)} / (4π × ${d * d}) ≈ ${chSci(I, 2)} W·m⁻², puis L = 10 log(I / I₀) ≈ ${chNombre(L, 3)} dB.`,
      };
    },
  },
  {
    id: 'son.n3.distance-quelconque',
    question: 'Niveau à une autre distance de la source',
    formats: ['saisie'],
    generer() {
      const L1 = auHasard([80, 90]);
      const d2 = auHasard([3, 5, 8]);
      const L2 = L1 - 20 * Math.log10(d2 / 2);
      return {
        question: `À 2,0 m d’une source ponctuelle, L₁ = ${L1} dB. Sans absorption, $L_2 = L_1 - 20 \\log\\left(\\dfrac{d_2}{d_1}\\right)$. `
          + `Niveau à ${chNombre(d2)},0 m, au dixième de dB ?`,
        reponse: `${sonDixieme(L2)} dB`,
        nombre: L2,
        tolerance: 0.002,
        unite: 'dB',
        aide: `L₂ = ${L1} − 20 log(${d2} / 2) ≈ ${L1} − ${chNombre(20 * Math.log10(d2 / 2), 3)} ≈ ${chNombre(L2, 3)} dB. `
          + 'Le 20 vient du carré de la distance : 10 log(d₂² / d₁²) = 20 log(d₂ / d₁).',
      };
    },
  },
  {
    id: 'son.n3.combien-instruments',
    question: 'Combien d’instruments pour atteindre un niveau ?',
    formats: ['saisie', 'qcm'],
    generer() {
      const [cible, n] = auHasard([[83, 20], [85, 32], [86, 40], [90, 100]]);
      return {
        question: `Un violon joue à 70 dB au premier rang. Combien de violons identiques faut-il, ensemble, pour atteindre ${cible} dB ?`,
        reponse: `${n} violons`,
        nombre: n,
        tolerance: 0.02,
        distracteurs: pieges(`${n} violons`, [`${cible - 70} violons`, `${sonDixieme((cible / 70))} violons`, `${Math.round(n / 2)} violons`]),
        aide: `N × I₁ = I donc N = 10^{(${cible} − 70)/10} = 10^{${chNombre((cible - 70) / 10)}} ≈ ${chNombre(10 ** ((cible - 70) / 10), 3)}, soit ${n} violons.`,
      };
    },
  },
  {
    id: 'son.n3.copie-addition-db',
    consigne: 'Corrige la copie.',
    formats: ['qcm', 'retournement'],
    question: 'Copie d’élève : « Deux machines identiques produisent chacune 80 dB. Ensemble : L = 80 + 80 = 160 dB. » Où est l’erreur ?',
    reponse: 'Ce sont les intensités qui s’additionnent : l’intensité double, L = 83 dB',
    distracteurs: [
      'Il fallait faire la moyenne : L = 80 dB',
      'Il fallait multiplier : L = 80 × 80 = 6 400 dB',
      'Aucune : deux machines font deux fois plus de bruit',
    ],
    aide: 'L = 10 log(2I / I₀) = 10 log 2 + 80 ≈ 83 dB. 160 dB dépasserait largement le seuil de douleur.',
  },
  {
    id: 'son.n3.copie-oubli-i0',
    consigne: 'Corrige la copie.',
    formats: ['qcm', 'retournement'],
    question: 'Copie d’élève : « I = 1,0 × 10⁻⁵ W·m⁻², donc L = 10 log(1,0 × 10⁻⁵) = −50 dB. » Où est l’erreur ?',
    reponse: 'Il a oublié de diviser par I₀ : L = 10 log(10⁻⁵ / 10⁻¹²) = 70 dB',
    distracteurs: [
      'Il fallait utiliser ln : L = 10 ln(10⁻⁵)',
      'Le facteur 10 est en trop : L = log(10⁻⁵) = −5 dB',
      'Aucune : un niveau sonore est toujours négatif',
    ],
  },
  {
    id: 'son.n3.copie-ln',
    consigne: 'Corrige la copie.',
    formats: ['qcm', 'retournement'],
    question: 'Copie d’élève : « I = 1,0 × 10⁻⁵ W·m⁻², L = 10 ln(I / I₀) = 161,2 dB. » Qu’en dit le correcteur ?',
    reponse: 'Il a pris ln au lieu de log : L = 70 dB. 161 dB pour une salle de classe est absurde',
    distracteurs: [
      'Le calcul est juste : c’est le niveau d’une salle de classe',
      'Il fallait diviser I₀ par I',
      'Il fallait écrire 161 dB, avec trois chiffres significatifs',
    ],
    aide: 'Un résultat au-dessus de 120 dB (seuil de douleur) pour une situation ordinaire doit alerter.',
  },
  {
    id: 'son.n3.copie-distance',
    consigne: 'Corrige la copie.',
    formats: ['qcm', 'retournement'],
    question: 'Copie d’élève : « À 1 m d’une source ponctuelle, L = 80 dB. À 2 m, la distance double, donc L = 80 / 2 = 40 dB. » Où est l’erreur ?',
    reponse: 'C’est l’intensité qui est divisée par 4, pas le niveau par 2 : L ≈ 74 dB',
    distracteurs: [
      'L’intensité est divisée par 2, donc L = 77 dB',
      'Le niveau ne dépend pas de la distance : L = 80 dB',
      'Il fallait diviser par 4 : L = 20 dB',
    ],
    aide: 'I = P / (4πd²) : d × 2, I ÷ 4, soit −10 log 4 ≈ −6 dB.',
  },
  {
    id: 'son.n3.copie-chiffres',
    consigne: 'Corrige la copie.',
    formats: ['qcm', 'retournement'],
    question: 'Copie d’élève, intensité donnée à deux chiffres significatifs : « L = 76,19331 dB ». Qu’en dit le correcteur ?',
    reponse: 'Trop de chiffres : on écrit L ≈ 76 dB',
    distracteurs: ['C’est parfait : la calculatrice est précise', 'Il faut écrire L ≈ 80 dB', 'Il faut écrire L ≈ 76,19 dB'],
  },
  {
    id: 'son.n3.intensite-double',
    question: '« Si l’intensité sonore double, le niveau d’intensité sonore double aussi. »',
    formats: ['vraifaux'],
    vrai: false,
    reponse: 'Faux : il augmente de 10 log 2 ≈ 3 dB. Pour doubler un niveau de 60 dB, il faudrait multiplier l’intensité par un million.',
  },
  {
    id: 'son.n3.niveau-negatif',
    question: '« Un niveau d’intensité sonore peut être négatif. »',
    formats: ['vraifaux'],
    vrai: true,
    reponse: 'Vrai : quand I < I₀, le rapport I / I₀ est inférieur à 1 et son logarithme est négatif. Ce son est inaudible.',
  },
  {
    id: 'son.n3.protection',
    question: 'Un ouvrier travaille près d’une machine à 105 dB. Ses bouchons d’oreille apportent une atténuation de 25 dB. Quel niveau atteint son tympan ?',
    formats: ['qcm', 'retournement'],
    reponse: '80 dB : on soustrait l’atténuation au niveau',
    distracteurs: ['4,2 dB : on divise par l’atténuation', '130 dB : on ajoute l’atténuation', '102 dB : on retire 3 dB par protection'],
  },
  {
    id: 'son.n3.inverse-carre',
    question: 'Pourquoi, sans absorption, l’intensité d’une source ponctuelle varie-t-elle comme $1 / d^2$ ?',
    formats: ['qcm', 'retournement'],
    reponse: 'La même puissance se répartit sur une sphère d’aire 4πd², qui croît comme d²',
    distracteurs: [
      'L’air absorbe d’autant plus d’énergie que la distance est grande',
      'La célérité du son diminue avec la distance',
      'La fréquence diminue avec la distance',
    ],
  },
];

inscrireChapitre({
  cle: 'son',
  theme: 'Ondes et signaux',
  titre: 'Intensité et niveau sonores',
  resume: 'Trois niveaux : vocabulaire et formules ; petites situations à calculer de tête (décibels et puissances de dix) ; '
    + 'pièges, copies d’élèves et exercices type bac, calculatrice permise. Les valeurs changent à chaque passage.',
  n1: SON_N1,
  n2: SON_N2,
  n3: SON_N3,
});
