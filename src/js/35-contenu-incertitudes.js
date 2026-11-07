/* Paquet « Mesure et incertitudes » (terminale, partie transversale du programme).
 *
 * Programme (BO spécial n° 8 du 25/07/2019) : variabilité de la mesure,
 * histogramme, moyenne, écart-type ; incertitude-type ; évaluations de type A
 * et de type B ; incertitudes-types composées (formule fournie) ; simulation
 * Monte-Carlo ; écriture du résultat avec un nombre adapté de chiffres
 * significatifs ; comparaison à une valeur de référence par le quotient
 * z = |m_mes − m_ref| / u(m).
 *
 * Notations : s écart-type expérimental de la série, n nombre de mesures,
 * u(x̄) = s / √n incertitude-type de type A sur la moyenne.
 * Seuil de compatibilité z ⩽ 2 : convention du lycée, À VALIDER par Loïc.
 * Niveau 2 : valeurs choisies pour un calcul de tête.
 *
 * PROPOSITION à auditer par Loïc (audit: 'brouillon', 35-contenu-chapitres.js).
 * RÈGLE ABSOLUE (32-paquets.js) : un identifiant de carte ne change jamais.
 */

/** Nombre écrit avec d décimales, zéros significatifs gardés : 25,00 g n'est pas 25 g. */
function incFr(x, d) {
  return x.toFixed(d).replace('.', ',').replace('-', '−');
}

/** Écart-type expérimental (division par n − 1), comme np.std(x, ddof=1). */
function incEcartType(serie) {
  const moyenne = serie.reduce((a, b) => a + b, 0) / serie.length;
  return Math.sqrt(serie.reduce((a, x) => a + (x - moyenne) ** 2, 0) / (serie.length - 1));
}

/* ---------- Niveau 1 · Vocabulaire, définitions, formules ---------- */

const INCERTITUDES_N1 = [
  {
    id: 'incertitudes.n1.variabilite',
    question: '« Quand on répète plusieurs fois la même mesure, avec le même protocole, on obtient toujours exactement la même valeur. »',
    formats: ['vraifaux'],
    vrai: false,
    reponse: 'Faux : les valeurs sont dispersées. C’est la variabilité de la mesure.',
  },
  {
    id: 'incertitudes.n1.incertitude-type',
    question: 'Que représente l’incertitude-type u(x) associée au résultat d’une mesure ?',
    formats: ['retournement', 'qcm'],
    reponse: 'L’étendue des valeurs qu’on peut raisonnablement attribuer à la grandeur, sous la forme d’un écart-type',
    distracteurs: [
      'L’écart entre la valeur mesurée et la valeur vraie, toujours connu',
      'L’erreur commise par l’élève pendant la manipulation',
      'Le nombre de chiffres significatifs du résultat',
    ],
    aide: 'Elle quantifie le doute sur le résultat ; plus elle est petite, plus la mesure est précise.',
  },
  {
    id: 'incertitudes.n1.ecart-type',
    question: 'Que mesure l’écart-type expérimental s d’une série de mesures ?',
    formats: ['retournement', 'qcm'],
    reponse: 'La dispersion des valeurs autour de leur moyenne',
    distracteurs: ['L’écart entre la moyenne et la valeur de référence', 'La plus grande valeur moins la plus petite', 'La valeur la plus fréquente de la série'],
  },
  {
    id: 'incertitudes.n1.type-a',
    question: 'Quand parle-t-on d’une évaluation de type A de l’incertitude-type ?',
    formats: ['retournement', 'qcm'],
    reponse: 'Quand on l’évalue par une approche statistique, à partir d’une série de mesures répétées',
    distracteurs: [
      'Quand on l’évalue à partir des indications du constructeur de l’instrument',
      'Quand on l’évalue à partir d’une seule lecture sur une graduation',
      'Quand on la calcule à partir d’une formule fournie, à partir d’autres incertitudes',
    ],
  },
  {
    id: 'incertitudes.n1.type-b',
    question: 'Quand parle-t-on d’une évaluation de type B de l’incertitude-type ?',
    formats: ['retournement', 'qcm'],
    reponse: 'Quand on l’évalue autrement que par la statistique : notice, tolérance, graduation, mesure unique',
    distracteurs: [
      'Quand on calcule l’écart-type d’une série de mesures répétées',
      'Quand on divise l’écart-type par la racine du nombre de mesures',
      'Quand on compare le résultat à une valeur de référence',
    ],
  },
  {
    id: 'incertitudes.n1.formule-type-a',
    question: 'Série de n mesures indépendantes, d’écart-type s : incertitude-type sur la moyenne $u(\\bar{x})$ ?',
    formats: ['qcm', 'retournement'],
    reponse: '$u(\\bar{x}) = \\dfrac{s}{\\sqrt{n}}$',
    distracteurs: ['$u(\\bar{x}) = s$', '$u(\\bar{x}) = \\dfrac{s}{n}$', '$u(\\bar{x}) = s \\times \\sqrt{n}$'],
    aide: 'Moyenner beaucoup de mesures réduit l’incertitude sur la moyenne, mais seulement comme √n.',
  },
  {
    id: 'incertitudes.n1.formule-z',
    question: 'Quel quotient sert à comparer un résultat $m_{mes}$ à une valeur de référence $m_{ref}$ ?',
    formats: ['qcm', 'retournement'],
    reponse: '$z = \\dfrac{|m_{mes} - m_{ref}|}{u(m)}$',
    distracteurs: [
      '$z = \\dfrac{u(m)}{|m_{mes} - m_{ref}|}$',
      '$z = \\dfrac{|m_{mes} - m_{ref}|}{m_{ref}}$',
      '$z = |m_{mes} - m_{ref}| \\times u(m)$',
    ],
    aide: 'z compte combien d’incertitudes-types séparent le résultat de la référence.',
  },
  {
    id: 'incertitudes.n1.seuil-z',
    question: '« Au lycée, on considère usuellement le résultat compatible avec la valeur de référence quand z ⩽ 2. »',
    formats: ['vraifaux'],
    vrai: true,
    reponse: 'Vrai : au-delà de deux incertitudes-types d’écart, on cherche une cause (protocole, instrument, modèle).',
  },
  {
    id: 'incertitudes.n1.valeur-reference',
    question: 'Qu’est-ce qu’une valeur de référence ?',
    formats: ['retournement', 'qcm'],
    reponse: 'Une valeur admise de la grandeur, issue d’une table ou d’une mesure plus précise, à laquelle on compare son résultat',
    distracteurs: [
      'La première valeur mesurée de la série',
      'La moyenne des mesures de la classe',
      'La valeur exacte, toujours connue, de la grandeur',
    ],
  },
  {
    id: 'incertitudes.n1.histogramme',
    question: 'Que représente l’histogramme d’une série de mesures ?',
    formats: ['retournement', 'qcm'],
    reponse: 'Le nombre de mesures tombées dans chaque intervalle de valeurs',
    distracteurs: [
      'L’évolution de la mesure au cours du temps',
      'La valeur de chaque mesure dans l’ordre où elle a été faite',
      'L’écart de chaque mesure à la valeur de référence',
    ],
    aide: 'Sa largeur rend compte de la dispersion ; son centre, de la moyenne.',
  },
  {
    id: 'incertitudes.n1.dispersion',
    question: 'Deux séries de mesures d’une même grandeur ont la même moyenne. Celle dont l’histogramme est le plus étroit…',
    formats: ['qcm', 'retournement'],
    reponse: '…a le plus petit écart-type : ses valeurs sont moins dispersées',
    distracteurs: [
      '…a le plus grand écart-type',
      '…est forcément la plus proche de la valeur de référence',
      '…compte forcément le plus de mesures',
    ],
  },
  {
    id: 'incertitudes.n1.composee',
    question: 'Quand parle-t-on d’incertitude-type composée ?',
    formats: ['retournement', 'qcm'],
    reponse: 'Quand la grandeur est calculée à partir d’autres grandeurs, chacune avec sa propre incertitude-type',
    distracteurs: [
      'Quand on additionne les incertitudes de type A et de type B d’une même lecture',
      'Quand on mesure plusieurs fois la même grandeur',
      'Quand on arrondit l’incertitude à deux chiffres significatifs',
    ],
    aide: 'Au lycée, la formule qui combine les incertitudes est toujours fournie.',
  },
  {
    id: 'incertitudes.n1.monte-carlo',
    question: 'Quel est le principe d’une simulation de Monte-Carlo pour une incertitude composée ?',
    formats: ['retournement', 'qcm'],
    reponse: 'Tirer au hasard un grand nombre de valeurs des grandeurs d’entrée, calculer la grandeur à chaque fois, puis prendre l’écart-type des résultats',
    distracteurs: [
      'Refaire la mesure un grand nombre de fois au laboratoire',
      'Calculer la grandeur une seule fois avec les valeurs moyennes',
      'Choisir au hasard la mesure la plus proche de la référence',
    ],
  },
  {
    id: 'incertitudes.n1.chiffres-u',
    question: 'Avec combien de chiffres significatifs écrit-on une incertitude-type ?',
    formats: ['qcm', 'retournement'],
    reponse: 'Un ou deux',
    distracteurs: ['Autant que la calculatrice en donne', 'Toujours trois', 'Autant que la valeur mesurée'],
    aide: 'Puis on arrondit la valeur au même rang que le dernier chiffre de l’incertitude.',
  },
  {
    id: 'incertitudes.n1.instrument',
    question: '« Changer d’instrument ou de protocole peut modifier l’incertitude-type d’une mesure. »',
    formats: ['vraifaux'],
    vrai: true,
    reponse: 'Vrai : une burette plutôt qu’une éprouvette, une lecture mieux placée, réduisent l’incertitude.',
  },
  {
    id: 'incertitudes.n1.independantes',
    question: '« Pour évaluer une incertitude de type A, les mesures répétées doivent être indépendantes. »',
    formats: ['vraifaux'],
    vrai: true,
    reponse: 'Vrai : chaque mesure est refaite entièrement, sans se laisser influencer par la précédente.',
  },
];

/* ---------- Niveau 2 · Situations, calculs de tête ---------- */

const INCERTITUDES_N2 = [
  {
    id: 'incertitudes.n2.type-a',
    question: 'Incertitude-type de type A sur une moyenne',
    formats: ['saisie', 'qcm'],
    generer() {
      // s / √n tombe juste : √n vaut 2, 3, 4, 5 ou 10.
      const [s, n, u, grandeur, unite] = auHasard([
        [0.4, 4, 0.2, 'une période', 's'],
        [0.6, 9, 0.2, 'un volume équivalent', 'mL'],
        [1.2, 16, 0.3, 'une distance', 'cm'],
        [2.0, 25, 0.4, 'une longueur', 'mm'],
        [0.5, 100, 0.05, 'une durée', 's'],
        [0.9, 9, 0.3, 'une masse', 'g'],
      ]);
      return {
        question: `${n} élèves mesurent ${grandeur} ; l’écart-type de leurs mesures vaut s = ${chNombre(s)} ${unite}. `
          + 'Incertitude-type sur la moyenne $u(\\bar{x})$ ?',
        reponse: `${chNombre(u)} ${unite}`,
        nombre: u,
        unite,
        distracteurs: [`${chNombre(s)} ${unite}`, `${chNombre(s / n)} ${unite}`, `${chNombre(s * Math.sqrt(n))} ${unite}`],
        aide: `u = s / √n = ${chNombre(s)} / √${n} = ${chNombre(s)} / ${Math.sqrt(n)} = ${chNombre(u)} ${unite}.`,
      };
    },
  },
  {
    id: 'incertitudes.n2.moyenne',
    question: 'Moyenne d’une série de mesures',
    formats: ['saisie', 'qcm'],
    generer() {
      // Écarts à une valeur centrale, de somme connue : la moyenne se fait de tête.
      const base = auHasard([12.0, 9.8, 25.0, 1.5]);
      const [ecarts, decalage] = auHasard([
        [[-0.2, 0.1, 0.3, -0.2], 0],
        [[0.1, -0.1, 0.2, 0.2], 0.1],
        [[0.0, 0.2, -0.1, 0.1, 0.3], 0.1],
        [[-0.3, 0.1, 0.2, 0.0, 0.0], 0],
      ]);
      const valeurs = ecarts.map((e) => Number((base + e).toFixed(1)));
      const moyenne = Number((base + decalage).toFixed(2));
      return {
        question: `Mesures de la même grandeur : ${valeurs.map((v) => incFr(v, 1)).join(' ; ')}. Valeur moyenne ?`,
        reponse: chNombre(moyenne),
        nombre: moyenne,
        tolerance: 0.001,
        distracteurs: pieges(chNombre(moyenne), [chNombre(Number((moyenne + 0.1).toFixed(2))),
          chNombre(Number((moyenne - 0.1).toFixed(2))), chNombre(Number((moyenne + 0.2).toFixed(2))), chNombre(base + 1)]),
        aide: `On regarde les écarts à ${chNombre(base)} : ${ecarts.map((e) => (e >= 0 ? `+${chNombre(e)}` : chNombre(e))).join(', ')}, `
          + `de somme ${chNombre(Number((decalage * ecarts.length).toFixed(1)))}, soit ${chNombre(decalage)} en moyenne.`,
      };
    },
  },
  {
    id: 'incertitudes.n2.z',
    question: 'Calculer le quotient z',
    formats: ['saisie', 'qcm'],
    generer() {
      const [ref, u, unite, grandeur, d] = auHasard([
        [9.81, 0.05, 'm·s⁻²', 'g', 2],
        [340, 5, 'm·s⁻¹', 'c', 0],
        [2.70, 0.02, 'g·cm⁻³', 'ρ', 2],
        [0.100, 0.002, 'mol·L⁻¹', 'c', 3],
      ]);
      const z = auHasard([0.5, 1, 1.5, 2, 3, 4]);
      const dessus = pileOuFace();
      const mes = Number((ref + (dessus ? 1 : -1) * z * u).toFixed(4));
      return {
        question: `Résultat : ${grandeur} = ${incFr(mes, d)} ${unite}, avec u = ${incFr(u, d)} ${unite}. `
          + `Référence : ${incFr(ref, d)} ${unite}. Quotient $z = \\dfrac{|m_{mes} - m_{ref}|}{u}$ ?`,
        reponse: chNombre(z),
        nombre: z,
        tolerance: 0.01,
        distracteurs: pieges(chNombre(z), [chNombre(z * 2), chNombre(Number((1 / z).toFixed(2))), chNombre(-z),
          chNombre(z + 1), chNombre(z + 0.5)]),
        aide: `|${incFr(mes, d)} − ${incFr(ref, d)}| = ${chNombre(Number((z * u).toFixed(4)))} ${unite}, `
          + `soit ${chNombre(z)} fois u. ${z <= 2 ? 'z ⩽ 2 : compatible.' : 'z > 2 : non compatible.'}`,
      };
    },
  },
  {
    id: 'incertitudes.n2.compatible',
    question: 'Résultat compatible avec la référence ?',
    formats: ['vraifaux'],
    generer() {
      const [ref, u, unite, d] = auHasard([[9.81, 0.04, 'm·s⁻²', 2], [1.00, 0.02, 'g·mL⁻¹', 2], [440, 4, 'Hz', 0]]);
      const z = auHasard([0.5, 1, 1.5, 2.5, 3, 5]);
      const mes = Number((ref - z * u).toFixed(4));
      const compatible = z <= 2;
      const vrai = pileOuFace();
      return {
        question: `« Mesure : ${incFr(mes, d)} ${unite}, u = ${incFr(u, d)} ${unite} ; référence : ${incFr(ref, d)} ${unite}. `
          + `Le résultat est ${vrai === compatible ? 'compatible' : 'non compatible'} avec la référence. »`,
        vrai,
        reponse: `${vrai ? 'Vrai' : 'Faux'} : l’écart vaut ${chNombre(Number((z * u).toFixed(4)))} ${unite}, soit z = ${chNombre(z)} `
          + `${compatible ? '⩽ 2 : compatible.' : '> 2 : non compatible.'}`,
      };
    },
  },
  {
    id: 'incertitudes.n2.ecriture',
    question: 'Écrire correctement le résultat',
    formats: ['qcm'],
    generer() {
      const [brut, u, juste, unite, faux] = auHasard([
        ['12,3456', '0,03', '12,35', 'cm', ['12,3456', '12,3', '12']],
        ['9,7832', '0,06', '9,78', 'm·s⁻²', ['9,7832', '9,8', '10']],
        ['0,15467', '0,002', '0,155', 'mol·L⁻¹', ['0,15467', '0,15', '0,1547']],
        ['342,71', '4', '343', 'm·s⁻¹', ['342,71', '342,7', '340,00']],
        ['1,04738', '0,01', '1,05', 'g·mL⁻¹', ['1,04738', '1,047', '1,0']],
      ]);
      return {
        question: `La calculatrice affiche ${brut} ${unite}, et l’incertitude-type vaut u = ${u} ${unite}. Quelle écriture du résultat ?`,
        reponse: `${juste} ${unite}, avec u = ${u} ${unite}`,
        distracteurs: faux.map((f) => `${f} ${unite}, avec u = ${u} ${unite}`),
        aide: `La valeur s’arrondit au même rang que le dernier chiffre de u (${u}).`,
      };
    },
  },
  {
    id: 'incertitudes.n2.type-b',
    question: 'Incertitude-type de type B, formule fournie',
    formats: ['saisie', 'qcm'],
    generer() {
      const [delta, u, instrument, unite] = auHasard([
        [0.17, 0.1, 'Une pipette jaugée porte la tolérance', 'mL'],
        [0.34, 0.2, 'Une fiole jaugée porte la tolérance', 'mL'],
        [0.51, 0.3, 'Le constructeur d’un thermomètre indique', '°C'],
        [0.085, 0.05, 'Une burette porte la tolérance', 'mL'],
      ]);
      return {
        question: `${instrument} ± ${chNombre(delta)} ${unite}. Formule fournie : $u = \\dfrac{\\Delta}{\\sqrt{3}}$, `
          + 'avec $\\sqrt{3} \\approx 1{,}7$. Incertitude-type ?',
        reponse: `${chNombre(u)} ${unite}`,
        nombre: u,
        tolerance: 0.05,
        unite,
        distracteurs: [`${chNombre(delta)} ${unite}`, `${chNombre(Number((delta * 1.7).toFixed(3)))} ${unite}`,
          `${chNombre(Number((delta / 3).toFixed(3)))} ${unite}`],
        aide: `u = ${chNombre(delta)} / 1,7 = ${chNombre(u)} ${unite}. Mesure unique : c’est une évaluation de type B.`,
      };
    },
  },
  {
    id: 'incertitudes.n2.effet-de-n',
    question: 'Effet du nombre de mesures sur l’incertitude',
    formats: ['qcm', 'retournement'],
    generer() {
      const [facteur, effet] = auHasard([[4, 'divisée par 2'], [9, 'divisée par 3'], [100, 'divisée par 10'], [25, 'divisée par 5']]);
      return {
        question: `On multiplie par ${facteur} le nombre de mesures, sans changer leur dispersion. L’incertitude-type sur la moyenne est…`,
        reponse: effet,
        distracteurs: pieges(effet, [`divisée par ${facteur}`, `multipliée par ${Math.sqrt(facteur)}`, 'inchangée',
          'divisée par 2', 'divisée par 3', 'divisée par 10']),
        aide: `u = s / √n : n × ${facteur} donne √n × ${Math.sqrt(facteur)}.`,
      };
    },
  },
  {
    id: 'incertitudes.n2.relative',
    question: 'Incertitude-type relative',
    formats: ['saisie', 'qcm'],
    generer() {
      const [x, u, unite, d] = auHasard([[50.0, 0.5, 'mL', 1], [20.0, 0.2, 'g', 1], [2.00, 0.04, 's', 2], [250, 5, 'mm', 0],
        [10.0, 0.3, 'cm', 1]]);
      const pct = Number(((u / x) * 100).toFixed(2));
      return {
        question: `x = ${incFr(x, d)} ${unite}, u(x) = ${incFr(u, d)} ${unite}. Incertitude-type relative $\\dfrac{u(x)}{x}$, en % ?`,
        reponse: `${chNombre(pct)} %`,
        nombre: pct,
        tolerance: 0.01,
        unite: '%',
        distracteurs: pieges(`${chNombre(pct)} %`, [`${chNombre(pct * 10)} %`, `${chNombre(pct / 10)} %`,
          `${chNombre(Number((x / u).toFixed(1)))} %`]),
        aide: `${incFr(u, d)} / ${incFr(x, d)} = ${chNombre(pct / 100)}, soit ${chNombre(pct)} %.`,
      };
    },
  },
  {
    id: 'incertitudes.n2.quel-type',
    question: 'Type A ou type B ?',
    formats: ['qcm', 'retournement'],
    generer() {
      const [situation, type] = auHasard([
        ['On lit une seule fois un volume sur une éprouvette graduée.', 'Type B'],
        ['Vingt groupes mesurent la même période ; on calcule s / √n.', 'Type A'],
        ['On utilise la tolérance gravée sur une fiole jaugée.', 'Type B'],
        ['On chronomètre dix fois la même chute et on exploite l’écart-type.', 'Type A'],
        ['On prend la précision indiquée dans la notice d’un multimètre.', 'Type B'],
      ]);
      return {
        question: `${situation} Quelle évaluation de l’incertitude-type ?`,
        reponse: type,
        distracteurs: [type === 'Type A' ? 'Type B' : 'Type A', 'Incertitude composée', 'Aucune : il n’y a pas d’incertitude'],
        aide: 'Type A : statistique, sur des mesures répétées. Type B : tout le reste (notice, tolérance, graduation).',
      };
    },
  },
  {
    id: 'incertitudes.n2.meilleur-resultat',
    question: 'Deux binômes mesurent la même masse : A trouve 12,4 g avec u = 0,3 g, B trouve 12,5 g avec u = 0,1 g. Lequel a le résultat le plus précis ?',
    formats: ['qcm', 'retournement'],
    reponse: 'B : son incertitude-type est la plus petite',
    distracteurs: ['A : sa valeur est plus petite', 'Les deux : les valeurs sont presque égales', 'On ne peut pas savoir sans la valeur de référence'],
  },
];

/* ---------- Niveau 3 · Pièges et type bac, calculatrice permise ---------- */

const INCERTITUDES_N3 = [
  {
    id: 'incertitudes.n3.serie-calculatrice',
    question: 'Série de mesures : écart-type et incertitude-type',
    formats: ['saisie'],
    generer() {
      const [serie, d, unite] = auHasard([
        [[1.52, 1.48, 1.55, 1.50, 1.47, 1.53], 2, 's'],
        [[9.72, 9.85, 9.79, 9.91, 9.76, 9.83, 9.80, 9.74], 2, 'm·s⁻²'],
        [[24.8, 25.1, 24.9, 25.3, 25.0], 1, 'mL'],
        [[342, 338, 345, 340, 336, 343, 341, 339, 344], 0, 'm·s⁻¹'],
      ]);
      const s = incEcartType(serie);
      const u = s / Math.sqrt(serie.length);
      return {
        question: `Mesures répétées, en ${unite} : ${serie.map((v) => incFr(v, d)).join(' ; ')}. `
          + 'Incertitude-type sur la moyenne $u(\\bar{x}) = \\dfrac{s}{\\sqrt{n}}$, avec s l’écart-type expérimental (calculatrice) ?',
        reponse: `u ≈ ${chNombre(u, 2)} ${unite} (s ≈ ${chNombre(s, 3)} ${unite}, n = ${serie.length})`,
        nombre: u,
        tolerance: 0.06,
        unite,
        aide: `Mode statistique de la calculatrice : s = σₙ₋₁ ≈ ${chNombre(s, 3)}, puis u = s / √${serie.length} ≈ ${chNombre(u, 2)}.`,
      };
    },
  },
  {
    id: 'incertitudes.n3.composee-quotient',
    question: 'Incertitude composée d’un quotient, formule fournie',
    formats: ['saisie', 'qcm'],
    generer() {
      const [m, um, V, uV, dm, dV] = auHasard([[25.00, 0.02, 10.0, 0.1, 2, 1], [13.50, 0.05, 5.00, 0.05, 2, 2],
        [52.3, 0.1, 20.0, 0.2, 1, 1], [7.85, 0.01, 1.00, 0.02, 2, 2]]);
      const rho = m / V;
      const u = rho * Math.sqrt((um / m) ** 2 + (uV / V) ** 2);
      return {
        question: `Masse volumique ρ = m / V avec m = ${incFr(m, dm)} g (u = ${incFr(um, dm)} g) et V = ${incFr(V, dV)} mL (u = ${incFr(uV, dV)} mL). `
          + 'Formule fournie : $\\dfrac{u(\\rho)}{\\rho} = \\sqrt{\\left(\\dfrac{u(m)}{m}\\right)^2 + \\left(\\dfrac{u(V)}{V}\\right)^2}$. u(ρ) en g·mL⁻¹ ?',
        reponse: `u(ρ) ≈ ${chNombre(u, 2)} g·mL⁻¹ (ρ = ${chNombre(rho, 4)} g·mL⁻¹)`,
        nombre: u,
        tolerance: 0.05,
        unite: 'g·mL⁻¹',
        distracteurs: pieges(`${chNombre(u, 2)} g·mL⁻¹`, [`${chNombre(Math.sqrt((um / m) ** 2 + (uV / V) ** 2), 2)} g·mL⁻¹`,
          `${chNombre(um + uV, 2)} g·mL⁻¹`, `${chNombre(rho * (um / m + uV / V) * 10, 2)} g·mL⁻¹`, `${chNombre(um / uV, 2)} g·mL⁻¹`]),
        aide: `u(ρ) / ρ ≈ ${chNombre(u / rho, 2)}, à multiplier par ρ = ${chNombre(rho, 4)} g·mL⁻¹. Ne pas oublier ce dernier produit.`,
      };
    },
  },
  {
    id: 'incertitudes.n3.contribution',
    question: 'Masse volumique ρ = m / V : m = 25,00 g avec u(m) = 0,02 g, V = 10,0 mL avec u(V) = 0,1 mL. Quelle mesure faut-il améliorer en priorité ?',
    formats: ['qcm', 'retournement'],
    reponse: 'Le volume : u(V)/V = 1 % contre u(m)/m = 0,08 %',
    distracteurs: [
      'La masse : son incertitude est la plus petite',
      'La masse : 0,02 g est plus grand que 0,1 mL en valeur relative',
      'Les deux comptent autant',
    ],
    aide: 'On compare les incertitudes relatives : c’est la plus grande qui domine l’incertitude composée.',
  },
  {
    id: 'incertitudes.n3.composee-produit',
    question: 'Incertitude composée d’un produit, formule fournie',
    formats: ['saisie'],
    generer() {
      const [U, uU, I, uI, dU, dI] = auHasard([[6.00, 0.05, 0.250, 0.004, 2, 3], [12.0, 0.1, 1.50, 0.02, 1, 2],
        [4.50, 0.03, 0.120, 0.002, 2, 3]]);
      const P = U * I;
      const u = P * Math.sqrt((uU / U) ** 2 + (uI / I) ** 2);
      return {
        question: `Puissance P = U × I, avec U = ${incFr(U, dU)} V (u = ${incFr(uU, dU)} V) et I = ${incFr(I, dI)} A (u = ${incFr(uI, dI)} A). `
          + 'Formule fournie : $\\dfrac{u(P)}{P} = \\sqrt{\\left(\\dfrac{u(U)}{U}\\right)^2 + \\left(\\dfrac{u(I)}{I}\\right)^2}$. u(P) en W ?',
        reponse: `u(P) ≈ ${chNombre(u, 2)} W (P = ${chNombre(P, 3)} W)`,
        nombre: u,
        tolerance: 0.05,
        unite: 'W',
        aide: `u(P) = ${chNombre(P, 3)} × √((${incFr(uU, dU)} / ${incFr(U, dU)})² + (${incFr(uI, dI)} / ${incFr(I, dI)})²) ≈ ${chNombre(u, 2)} W.`,
      };
    },
  },
  {
    id: 'incertitudes.n3.conclure-g',
    question: 'Conclure sur la compatibilité',
    formats: ['qcm', 'retournement'],
    generer() {
      const [mes, u] = auHasard([[9.70, 0.05], [9.74, 0.04], [9.86, 0.03], [9.65, 0.10], [9.92, 0.04]]);
      const z = Math.abs(mes - 9.81) / u;
      const ok = z <= 2;
      return {
        question: `Un binôme mesure g = ${incFr(mes, 2)} m·s⁻² avec u(g) = ${incFr(u, 2)} m·s⁻². Référence au lycée : 9,81 m·s⁻². Conclusion ?`,
        reponse: `z ≈ ${chNombre(z, 2)} ${ok ? '⩽ 2 : résultat compatible avec la référence' : '> 2 : résultat non compatible, on cherche une cause'}`,
        distracteurs: [
          `z ≈ ${chNombre(z, 2)} ${ok ? '> 2 : résultat non compatible, on cherche une cause' : '⩽ 2 : résultat compatible avec la référence'}`,
          `z ≈ ${chNombre(u / Math.abs(mes - 9.81), 2)} : résultat ${ok ? 'non compatible' : 'compatible'}`,
          'Compatible, puisque l’écart est inférieur à 1 m·s⁻²',
        ],
        aide: `z = |${incFr(mes, 2)} − 9,81| / ${incFr(u, 2)} ≈ ${chNombre(z, 2)}.`,
      };
    },
  },
  {
    id: 'incertitudes.n3.choisir-ecriture',
    question: 'c = 1,2345 mol·L⁻¹ à la calculatrice, et u(c) = 0,0321 mol·L⁻¹. Quelle écriture est correcte ?',
    formats: ['qcm', 'retournement'],
    reponse: 'c = 1,23 mol·L⁻¹ avec u(c) = 0,03 mol·L⁻¹',
    distracteurs: [
      'c = 1,2345 mol·L⁻¹ avec u(c) = 0,0321 mol·L⁻¹',
      'c = 1,2 mol·L⁻¹ avec u(c) = 0,0321 mol·L⁻¹',
      'c = 1,23 mol·L⁻¹ avec u(c) = 0,032 1 mol·L⁻¹',
    ],
    aide: 'u à un chiffre significatif (0,03), puis la valeur arrondie au centième, comme u.',
  },
  {
    id: 'incertitudes.n3.histogramme-decentre',
    question: 'L’histogramme des mesures de g de la classe est étroit, mais centré sur 9,60 m·s⁻², loin de 9,81 m·s⁻². Que conclure ?',
    formats: ['qcm', 'retournement'],
    reponse: 'Les mesures sont peu dispersées mais pas justes : une cause systématique (protocole, réglage) décale toutes les valeurs',
    distracteurs: [
      'Les mesures sont trop dispersées : il faut en faire davantage',
      'Tout va bien : un histogramme étroit garantit un résultat juste',
      'Il suffit de calculer s / √n pour corriger l’écart',
    ],
    aide: 'Faire plus de mesures réduit la dispersion de la moyenne, pas un décalage systématique.',
  },
  {
    id: 'incertitudes.n3.s-et-n',
    question: '« Plus on fait de mesures, plus l’écart-type expérimental s de la série diminue. »',
    formats: ['vraifaux'],
    vrai: false,
    reponse: 'Faux : s reste à peu près le même, il décrit la dispersion des mesures. C’est u = s / √n, l’incertitude sur la moyenne, qui diminue.',
  },
  {
    id: 'incertitudes.n3.monte-carlo-resultat',
    question: 'Une simulation de Monte-Carlo calcule 10 000 fois ρ = m / V à partir de valeurs tirées au hasard. Que prend-on comme incertitude-type u(ρ) ?',
    formats: ['qcm', 'retournement'],
    reponse: 'L’écart-type des 10 000 valeurs de ρ obtenues',
    distracteurs: [
      'L’écart-type divisé par √10 000',
      'La plus grande valeur moins la plus petite',
      'La moyenne des 10 000 valeurs de ρ',
    ],
    aide: 'Chaque tirage est un résultat possible : leur dispersion est l’incertitude sur un résultat. On ne divise pas par √N.',
  },
  {
    id: 'incertitudes.n3.copie-s',
    consigne: 'Corrige la copie.',
    formats: ['qcm', 'retournement'],
    question: 'Copie d’élève : « 16 mesures de la période, s = 0,08 s. L’incertitude-type sur la moyenne vaut u = 0,08 s. » Où est l’erreur ?',
    reponse: 'Il a pris s au lieu de s / √n : u = 0,08 / 4 = 0,02 s',
    distracteurs: [
      'Il fallait diviser par 16 : u = 0,005 s',
      'Il fallait multiplier par √16 : u = 0,32 s',
      'Aucune : pour une série, u = s',
    ],
  },
  {
    id: 'incertitudes.n3.copie-chiffres',
    consigne: 'Corrige la copie.',
    formats: ['qcm', 'retournement'],
    question: 'Copie d’élève : « λ = 632,8461 nm avec u(λ) = 4,2735 nm. » Qu’en dit le correcteur ?',
    reponse: 'Trop de chiffres : λ = 633 nm avec u(λ) = 4 nm',
    distracteurs: [
      'C’est parfait : on garde tous les chiffres de la calculatrice',
      'λ = 632,8 nm avec u(λ) = 4,2735 nm',
      'λ = 600 nm avec u(λ) = 4 nm',
    ],
  },
  {
    id: 'incertitudes.n3.copie-u-trop-precise',
    consigne: 'Corrige la copie.',
    formats: ['qcm', 'retournement'],
    question: 'Copie d’élève : « L = 12 cm avec u(L) = 0,03 cm. » Où est l’erreur ?',
    reponse: 'La valeur n’est pas arrondie au même rang que l’incertitude : il faut L = 12,00 cm',
    distracteurs: [
      'u(L) doit être écrite 0,030 0 cm',
      'Il faut arrondir u(L) à 0 cm',
      'Aucune : 12 cm est plus lisible',
    ],
    aide: 'Écrire 12 cm suggère une incertitude de l’ordre du centimètre, cent fois plus grande que u(L).',
  },
  {
    id: 'incertitudes.n3.copie-valeur-absolue',
    consigne: 'Corrige la copie.',
    formats: ['qcm', 'retournement'],
    question: 'Copie d’élève : « z = (9,65 − 9,81) / 0,05 = −3,2 ; z < 2 donc le résultat est compatible. » Où est l’erreur ?',
    reponse: 'Il manque la valeur absolue : z = 3,2 > 2, le résultat n’est pas compatible',
    distracteurs: [
      'Il fallait diviser par 9,81 et non par 0,05',
      'Le calcul est juste, mais il fallait comparer à 1',
      'Aucune : un z négatif est toujours compatible',
    ],
  },
  {
    id: 'incertitudes.n3.copie-conclusion',
    consigne: 'Corrige la copie.',
    formats: ['qcm', 'retournement'],
    question: 'Copie d’élève : « z = 0,6, ce qui est très petit : la mesure est fausse et non compatible. » Où est l’erreur ?',
    reponse: 'La conclusion est inversée : z = 0,6 ⩽ 2, le résultat est compatible avec la référence',
    distracteurs: [
      'z ne peut pas être inférieur à 1',
      'Il fallait conclure que la mesure est exacte, sans aucune incertitude',
      'Aucune : plus z est petit, moins la mesure est bonne',
    ],
  },
  {
    id: 'incertitudes.n3.incertitude-nulle',
    question: '« Si toutes mes mesures répétées donnent la même valeur, l’incertitude-type de mon résultat est nulle. »',
    formats: ['vraifaux'],
    vrai: false,
    reponse: 'Faux : la statistique ne voit plus rien, mais l’instrument a toujours une incertitude (graduation, notice) : on l’évalue en type B.',
  },
];

inscrireChapitre({
  cle: 'incertitudes',
  theme: 'Mesure et incertitudes',
  titre: 'Mesure et incertitudes',
  resume: 'Trois niveaux : vocabulaire et formules ; petites situations à calculer de tête (s / √n, z, écriture du résultat) ; '
    + 'pièges, copies d’élèves et exercices type bac, calculatrice permise. Les valeurs changent à chaque passage.',
  n1: INCERTITUDES_N1,
  n2: INCERTITUDES_N2,
  n3: INCERTITUDES_N3,
});
