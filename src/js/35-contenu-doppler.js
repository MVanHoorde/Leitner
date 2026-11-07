/* Paquet « Effet Doppler » (terminale, Ondes et signaux 1.C).
 *
 * Programme (BO spécial n° 8 du 25/07/2019) : décrire et interpréter
 * qualitativement l'effet Doppler ; établir l'expression du décalage pour un
 * observateur fixe et un émetteur mobile, à une dimension ; l'exploiter avec
 * des ondes acoustiques ou électromagnétiques ; en déduire une vitesse.
 *
 * Notations : f_E fréquence émise, f_R fréquence reçue, v vitesse de
 * l'émetteur, c célérité de l'onde, Δf = f_R − f_E.
 * Niveau 2 : valeurs choisies pour un calcul de tête (c = 340 m/s).
 *
 * PROPOSITION à auditer par Loïc (audit: 'brouillon', 35-contenu-chapitres.js).
 * RÈGLE ABSOLUE (32-paquets.js) : un identifiant de carte ne change jamais.
 */

/* ---------- Niveau 1 · Vocabulaire, définitions, formules ---------- */

const DOPPLER_N1 = [
  {
    id: 'doppler.n1.definition',
    question: 'Qu’est-ce que l’effet Doppler ?',
    formats: ['retournement', 'qcm'],
    reponse: 'Le décalage entre la fréquence reçue et la fréquence émise, quand l’émetteur et le récepteur sont en mouvement l’un par rapport à l’autre',
    distracteurs: [
      'L’affaiblissement d’une onde au cours de sa propagation',
      'Le changement de direction d’une onde qui passe par une ouverture',
      'La variation de la célérité d’une onde quand l’émetteur se déplace',
    ],
  },
  {
    id: 'doppler.n1.decalage',
    question: 'Comment se définit le décalage Doppler $\\Delta f$ ?',
    formats: ['retournement', 'qcm'],
    reponse: '$\\Delta f = f_R - f_E$ : fréquence reçue moins fréquence émise',
    distracteurs: ['$\\Delta f = f_E - f_R$', '$\\Delta f = f_R + f_E$', '$\\Delta f = \\dfrac{f_R}{f_E}$'],
    aide: 'Δf > 0 quand l’émetteur s’approche, Δf < 0 quand il s’éloigne.',
  },
  {
    id: 'doppler.n1.approche-aigu',
    question: '« Quand une source sonore s’approche d’un observateur immobile, il perçoit un son plus aigu que le son émis. »',
    formats: ['vraifaux'],
    vrai: true,
    reponse: 'Vrai : la fréquence reçue est plus grande que la fréquence émise.',
  },
  {
    id: 'doppler.n1.eloignement',
    question: 'Une ambulance s’éloigne d’un piéton immobile. La fréquence qu’il perçoit est…',
    formats: ['qcm', 'retournement'],
    reponse: 'plus basse que la fréquence émise',
    distracteurs: ['plus haute que la fréquence émise', 'égale à la fréquence émise', 'nulle'],
    aide: 'Le son perçu est plus grave : Δf < 0.',
  },
  {
    id: 'doppler.n1.emise-inchangee',
    question: '« Quand l’ambulance s’approche, sa sirène émet un son de fréquence plus élevée. »',
    formats: ['vraifaux'],
    vrai: false,
    reponse: 'Faux : la fréquence émise ne change pas. C’est la fréquence reçue qui est plus élevée.',
  },
  {
    id: 'doppler.n1.celerite',
    question: '« La célérité du son augmente quand la source sonore se déplace vers l’observateur. »',
    formats: ['vraifaux'],
    vrai: false,
    reponse: 'Faux : la célérité ne dépend que du milieu de propagation. Ce sont les fronts d’onde qui se resserrent.',
  },
  {
    id: 'doppler.n1.fronts',
    question: 'Devant un émetteur en mouvement, que deviennent les fronts d’onde ?',
    formats: ['qcm', 'retournement'],
    reponse: 'Ils se resserrent : la longueur d’onde reçue diminue',
    distracteurs: [
      'Ils s’écartent : la longueur d’onde reçue augmente',
      'Ils vont plus vite : la célérité augmente',
      'Rien ne change devant l’émetteur, seulement derrière',
    ],
  },
  {
    id: 'doppler.n1.formule-approche',
    question: 'Émetteur qui s’approche à la vitesse v d’un récepteur fixe : quelle expression de $f_R$ ?',
    formats: ['qcm', 'retournement'],
    reponse: '$f_R = f_E \\times \\dfrac{c}{c - v}$',
    distracteurs: [
      '$f_R = f_E \\times \\dfrac{c}{c + v}$',
      '$f_R = f_E \\times \\dfrac{c - v}{c}$',
      '$f_R = f_E \\times \\dfrac{v}{c}$',
    ],
    aide: 'Le dénominateur c − v est plus petit que c : f_R > f_E, le son est plus aigu.',
  },
  {
    id: 'doppler.n1.formule-eloignement',
    question: 'Émetteur qui s’éloigne à la vitesse v d’un récepteur fixe : quelle expression de $f_R$ ?',
    formats: ['qcm', 'retournement'],
    reponse: '$f_R = f_E \\times \\dfrac{c}{c + v}$',
    distracteurs: [
      '$f_R = f_E \\times \\dfrac{c}{c - v}$',
      '$f_R = f_E \\times \\dfrac{c + v}{c}$',
      '$f_R = f_E \\times \\dfrac{c}{v}$',
    ],
    aide: 'Le dénominateur c + v est plus grand que c : f_R < f_E, le son est plus grave.',
  },
  {
    id: 'doppler.n1.approchee',
    question: 'Quand $v \\ll c$, quelle expression approchée donne la valeur du décalage Doppler ?',
    formats: ['qcm', 'retournement'],
    reponse: '$|\\Delta f| \\approx f_E \\times \\dfrac{v}{c}$',
    distracteurs: [
      '$|\\Delta f| \\approx f_E \\times \\dfrac{c}{v}$',
      '$|\\Delta f| \\approx \\dfrac{v}{f_E \\times c}$',
      '$|\\Delta f| \\approx f_E \\times v \\times c$',
    ],
  },
  {
    id: 'doppler.n1.vitesse',
    question: 'Du décalage Doppler à la vitesse ($v \\ll c$) : $v = \\;$?',
    formats: ['qcm', 'retournement'],
    reponse: '$v = c \\times \\dfrac{|\\Delta f|}{f_E}$',
    distracteurs: [
      '$v = c \\times \\dfrac{f_E}{|\\Delta f|}$',
      '$v = \\dfrac{|\\Delta f|}{f_E \\times c}$',
      '$v = |\\Delta f| \\times f_E \\times c$',
    ],
    aide: 'C’est le principe de la vélocimétrie : on mesure Δf, on en déduit v.',
  },
  {
    id: 'doppler.n1.immobiles',
    question: '« Un émetteur et un récepteur immobiles l’un par rapport à l’autre : le décalage Doppler est nul. »',
    formats: ['vraifaux'],
    vrai: true,
    reponse: 'Vrai : sans mouvement relatif, f_R = f_E.',
  },
  {
    id: 'doppler.n1.toutes-ondes',
    question: '« L’effet Doppler ne concerne que les ondes sonores. »',
    formats: ['vraifaux'],
    vrai: false,
    reponse: 'Faux : il concerne toutes les ondes, sonores comme électromagnétiques (radar, lumière des étoiles).',
  },
  {
    id: 'doppler.n1.rouge',
    question: 'La lumière d’une galaxie qui s’éloigne de nous est décalée…',
    formats: ['qcm', 'retournement'],
    reponse: 'vers le rouge : la longueur d’onde reçue est plus grande',
    distracteurs: [
      'vers le bleu : la longueur d’onde reçue est plus petite',
      'vers le rouge : la longueur d’onde reçue est plus petite',
      'vers le bleu : la fréquence reçue est plus petite',
    ],
    aide: 'Éloignement : fréquence reçue plus petite, donc longueur d’onde plus grande (λ = c / f).',
  },
  {
    id: 'doppler.n1.applications',
    question: 'Lequel de ces dispositifs ne repose pas sur l’effet Doppler ?',
    formats: ['qcm'],
    reponse: 'Le sonomètre, qui mesure un niveau d’intensité sonore',
    distracteurs: [
      'Le radar routier, qui mesure la vitesse d’un véhicule',
      'L’échographie Doppler, qui mesure la vitesse du sang',
      'La mesure de la vitesse d’une étoile par son spectre',
    ],
  },
  {
    id: 'doppler.n1.unites',
    question: 'Dans $|\\Delta f| = f_E \\times \\dfrac{v}{c}$, en quelles unités exprimer v et c ?',
    formats: ['qcm', 'retournement'],
    reponse: 'Dans la même unité, par exemple les deux en m·s⁻¹',
    distracteurs: ['v en km·h⁻¹ et c en m·s⁻¹', 'v en m·s⁻¹ et c en km·s⁻¹', 'Peu importe : le rapport n’a pas d’unité'],
    aide: 'v / c est un rapport sans unité seulement si v et c sont dans la même unité : 90 km/h se convertit d’abord en 25 m/s.',
  },
];

/* ---------- Niveau 2 · Situations, calculs de tête ---------- */

const DOPPLER_N2 = [
  {
    id: 'doppler.n2.decalage-approche',
    question: 'Calculer un décalage Doppler (expression approchée)',
    formats: ['saisie', 'qcm'],
    generer() {
      // f_E multiple de 340 et v = 340 / m : Δf = f_E / m, toujours entier.
      const [m, v] = auHasard([[10, 34], [20, 17], [40, 8.5], [100, 3.4]]);
      const fE = 340 * auHasard(m === 40 || m === 100 ? [5, 10] : [1, 2, 3, 5]);
      const df = fE / m;
      return {
        question: `Une source émet un son de ${chNombre(fE)} Hz et s’approche à ${chNombre(v)} m·s⁻¹ d’un micro fixe. `
          + 'c = 340 m·s⁻¹. Décalage Doppler $|\\Delta f|$, avec l’expression approchée ?',
        reponse: `${chNombre(df)} Hz`,
        nombre: df,
        unite: 'Hz',
        distracteurs: [`${chNombre(df * 10)} Hz`, `${chNombre(df / 10)} Hz`, `${chNombre(fE + df)} Hz`, `${chNombre(2 * df)} Hz`],
        aide: `|Δf| ≈ f_E × v / c = ${chNombre(fE)} × ${chNombre(v)} / 340 = ${chNombre(fE)} / ${m} = ${chNombre(df)} Hz.`,
      };
    },
  },
  {
    id: 'doppler.n2.vitesse-source',
    question: 'Retrouver la vitesse d’une source à partir du décalage',
    formats: ['saisie', 'qcm'],
    generer() {
      const fE = auHasard([500, 1000, 2000]);
      const [rapport, v] = auHasard([[10, 34], [20, 17], [50, 6.8], [100, 3.4]]);
      const df = fE / rapport;
      return {
        question: `Un haut-parleur émet à ${chNombre(fE)} Hz ; le micro fixe mesure un décalage de ${chNombre(df)} Hz. `
          + 'c = 340 m·s⁻¹. Vitesse du haut-parleur ?',
        reponse: `${chNombre(v)} m·s⁻¹`,
        nombre: v,
        unite: 'm·s⁻¹',
        distracteurs: [`${chNombre(v * 10)} m·s⁻¹`, `${chNombre(v / 10)} m·s⁻¹`, `${chNombre(340 / v)} m·s⁻¹`],
        aide: `v = c × |Δf| / f_E = 340 × ${chNombre(df)} / ${chNombre(fE)} = 340 / ${rapport} = ${chNombre(v)} m·s⁻¹.`,
      };
    },
  },
  {
    id: 'doppler.n2.exacte-approche',
    question: 'Fréquence reçue, expression exacte, émetteur qui s’approche',
    formats: ['saisie', 'qcm'],
    generer() {
      // c − v choisi pour que c / (c − v) se simplifie avec f_E.
      const [v, reste] = auHasard([[20, 320], [40, 300], [90, 250], [70, 270]]);
      const k = auHasard([1, 2, 3]);
      const fE = reste * k;
      const fR = 340 * k;
      return {
        question: `Émetteur à f_E = ${chNombre(fE)} Hz, qui s’approche à ${v} m·s⁻¹ d’un récepteur fixe ; c = 340 m·s⁻¹. `
          + '$f_R = f_E \\times \\dfrac{c}{c - v}$. Combien vaut $f_R$ ?',
        reponse: `${chNombre(fR)} Hz`,
        nombre: fR,
        unite: 'Hz',
        distracteurs: [`${chNombre(Math.round(fE * 340 / (340 + v)))} Hz`, `${chNombre(fE)} Hz`, `${chNombre(fE - (fR - fE))} Hz`],
        aide: `c − v = ${reste} m·s⁻¹ : f_R = ${chNombre(fE)} × 340 / ${reste} = ${k} × 340 = ${chNombre(fR)} Hz, plus aigu que f_E.`,
      };
    },
  },
  {
    id: 'doppler.n2.exacte-eloignement',
    question: 'Fréquence reçue, expression exacte, émetteur qui s’éloigne',
    formats: ['saisie', 'qcm'],
    generer() {
      const [v, somme] = auHasard([[20, 360], [60, 400], [85, 425], [160, 500]]);
      const k = auHasard([1, 2]);
      const fE = somme * k;
      const fR = 340 * k;
      return {
        question: `Émetteur à f_E = ${chNombre(fE)} Hz, qui s’éloigne à ${v} m·s⁻¹ d’un récepteur fixe ; c = 340 m·s⁻¹. `
          + '$f_R = f_E \\times \\dfrac{c}{c + v}$. Combien vaut $f_R$ ?',
        reponse: `${chNombre(fR)} Hz`,
        nombre: fR,
        unite: 'Hz',
        distracteurs: [`${chNombre(fE)} Hz`, `${chNombre(fE + (fE - fR))} Hz`, `${chNombre(340 * k * 2)} Hz`],
        aide: `c + v = ${somme} m·s⁻¹ : f_R = ${chNombre(fE)} × 340 / ${somme} = ${chNombre(fR)} Hz, plus grave que f_E.`,
      };
    },
  },
  {
    id: 'doppler.n2.sens-du-mouvement',
    question: 'Approche ou éloignement ?',
    formats: ['vraifaux'],
    generer() {
      const fE = auHasard([440, 500, 1000, 1200]);
      const ecart = auHasard([10, 20, 30]);
      const approche = pileOuFace();
      const fR = approche ? fE + ecart : fE - ecart;
      const vrai = pileOuFace();
      return {
        question: `« Émis à ${chNombre(fE)} Hz, le son est reçu à ${chNombre(fR)} Hz par un micro fixe : `
          + `l’émetteur ${vrai === approche ? 's’approche' : 's’éloigne'} du micro. »`,
        vrai,
        reponse: `${vrai ? 'Vrai' : 'Faux'} : ` + (approche
          ? `l’émetteur s’approche, car f_R > f_E (Δf = +${ecart} Hz).`
          : `l’émetteur s’éloigne, car f_R < f_E (Δf = −${ecart} Hz).`),
      };
    },
  },
  {
    id: 'doppler.n2.kmh',
    question: 'Décalage Doppler d’un véhicule, vitesse en km/h',
    formats: ['saisie', 'qcm'],
    generer() {
      const [kmh, ms] = auHasard([[36, 10], [72, 20], [108, 30]]);
      const fE = auHasard([340, 680, 1020]);
      const df = (fE * ms) / 340;
      return {
        question: `Une moto roule à ${kmh} km·h⁻¹ vers un piéton. Son klaxon émet à ${chNombre(fE)} Hz ; c = 340 m·s⁻¹. `
          + 'Décalage $|\\Delta f|$ perçu (expression approchée) ?',
        reponse: `${chNombre(df)} Hz`,
        nombre: df,
        unite: 'Hz',
        distracteurs: [`${chNombre((fE * kmh) / 340)} Hz`, `${chNombre(df / 10)} Hz`, `${chNombre(fE + df)} Hz`],
        aide: `D’abord la conversion : ${kmh} km·h⁻¹ = ${kmh} / 3,6 = ${ms} m·s⁻¹. Puis |Δf| ≈ ${chNombre(fE)} × ${ms} / 340 = ${chNombre(df)} Hz.`,
      };
    },
  },
  {
    id: 'doppler.n2.galaxie',
    question: 'Vitesse d’une galaxie par le décalage de ses raies',
    formats: ['saisie', 'qcm'],
    generer() {
      const [dl, v] = auHasard([[0.5, 300], [1, 600], [2, 1200], [5, 3000]]);
      return {
        question: `Une raie émise à λ = 500 nm est reçue décalée de ${chNombre(dl)} nm vers le rouge. `
          + 'Avec $\\dfrac{\\Delta\\lambda}{\\lambda} = \\dfrac{v}{c}$ et c = 3,0 × 10^{5} km·s⁻¹, vitesse d’éloignement en km·s⁻¹ ?',
        reponse: `${chNombre(v)} km·s⁻¹`,
        nombre: v,
        unite: 'km·s⁻¹',
        distracteurs: [`${chNombre(v * 10)} km·s⁻¹`, `${chNombre(v / 10)} km·s⁻¹`, `${chNombre(v * 1000)} km·s⁻¹`],
        aide: `v = c × Δλ / λ = 3,0 × 10^{5} × ${chNombre(dl)} / 500 = ${chNombre(v)} km·s⁻¹.`,
      };
    },
  },
  {
    id: 'doppler.n2.ordre-frequences',
    question: 'Un camion klaxonne en continu en passant devant toi. Dans quel ordre entends-tu les fréquences ?',
    formats: ['qcm', 'retournement'],
    reponse: 'D’abord plus aigu que f_E, puis plus grave que f_E',
    distracteurs: [
      'D’abord plus grave que f_E, puis plus aigu que f_E',
      'De plus en plus aigu pendant l’approche, puis de plus en plus grave',
      'Toujours f_E : seul le volume change',
    ],
    aide: 'À vitesse constante, la fréquence reçue est constante pendant l’approche (f_R > f_E), puis bascule au passage (f_R < f_E).',
  },
  {
    id: 'doppler.n2.approximation-valide',
    question: 'L’expression approchée est-elle justifiée ?',
    formats: ['vraifaux'],
    generer() {
      const [v, ok] = auHasard([[3.4, true], [17, true], [10, true], [250, false], [170, false]]);
      return {
        question: `« Pour une source à ${chNombre(v)} m·s⁻¹ dans l’air (c = 340 m·s⁻¹), on peut utiliser $|\\Delta f| \\approx f_E \\dfrac{v}{c}$. »`,
        vrai: ok,
        reponse: ok
          ? `Vrai : v / c = ${chNombre(Math.round((v / 340) * 1000) / 10)} %, donc v ≪ c.`
          : `Faux : v / c ≈ ${chNombre(Math.round((v / 340) * 100))} %, v n’est pas négligeable devant c : il faut l’expression exacte.`,
      };
    },
  },
  {
    id: 'doppler.n2.lambda-recue',
    question: 'Émetteur qui s’approche : la longueur d’onde reçue est-elle plus grande ou plus petite que celle émise ?',
    formats: ['qcm', 'retournement'],
    reponse: 'Plus petite : λ_R = c / f_R avec f_R > f_E',
    distracteurs: ['Plus grande : λ_R = c / f_R avec f_R > f_E', 'Égale : la célérité ne change pas', 'Plus grande, car l’émetteur pousse l’onde'],
  },
];

/* ---------- Niveau 3 · Pièges et type bac, calculatrice permise ---------- */

const DOPPLER_N3 = [
  {
    id: 'doppler.n3.deux-frequences',
    question: 'Vitesse d’un véhicule à partir des fréquences à l’approche et à l’éloignement',
    formats: ['saisie', 'qcm'],
    generer() {
      const v = auHasard([15, 20, 25, 30]);
      const fE = auHasard([400, 440, 500]);
      const f1 = Math.round((fE * 340) / (340 - v));
      const f2 = Math.round((fE * 340) / (340 + v));
      const vCalc = (340 * (f1 - f2)) / (f1 + f2);
      const arrondi = Math.round(vCalc);
      return {
        question: `Au passage d’une voiture, un micro fixe enregistre ${chNombre(f1)} Hz à l’approche puis ${chNombre(f2)} Hz à l’éloignement. `
          + 'On montre que $v = c \\times \\dfrac{f_1 - f_2}{f_1 + f_2}$, avec c = 340 m·s⁻¹. Vitesse de la voiture, en m·s⁻¹ ?',
        reponse: `${chNombre(arrondi)} m·s⁻¹ (soit ${chNombre(Math.round(arrondi * 3.6))} km·h⁻¹ environ)`,
        nombre: vCalc,
        tolerance: 0.03,
        unite: 'm·s⁻¹',
        distracteurs: [`${chNombre(Math.round(vCalc * 2))} m·s⁻¹`, `${chNombre(Math.round(vCalc / 2))} m·s⁻¹`, `${chNombre(f1 - f2)} m·s⁻¹`],
        aide: `v = 340 × (${f1} − ${f2}) / (${f1} + ${f2}) ≈ ${chNombre(vCalc, 3)} m·s⁻¹. On l’obtient en divisant les deux expressions exactes : f_1 / f_2 = (c + v) / (c − v).`,
      };
    },
  },
  {
    id: 'doppler.n3.radar',
    question: 'Radar routier : formule fournie, ondes électromagnétiques',
    formats: ['saisie', 'qcm'],
    generer() {
      const kmh = auHasard([72, 90, 108, 126, 144]);
      const v = kmh / 3.6;
      const df = Math.round((2 * 24e9 * v) / 3e8);
      return {
        question: `Un radar émet une onde de fréquence f = 24 GHz ; l’onde réfléchie par la voiture revient décalée de ${chNombre(df)} Hz. `
          + 'Formule fournie : $\\Delta f = \\dfrac{2 f v}{c}$, avec c = 3,00 × 10^{8} m·s⁻¹. Vitesse de la voiture en km·h⁻¹ ?',
        reponse: `${kmh} km·h⁻¹ (v = ${chNombre(v, 3)} m·s⁻¹)`,
        nombre: kmh,
        tolerance: 0.02,
        unite: 'km·h⁻¹',
        distracteurs: [`${kmh * 2} km·h⁻¹`, `${chNombre(Math.round(kmh / 2))} km·h⁻¹`, `${chNombre(v, 3)} km·h⁻¹`],
        aide: `v = Δf × c / (2f) = ${df} × 3,00 × 10^{8} / (2 × 24 × 10^{9}) = ${chNombre(v, 3)} m·s⁻¹, puis × 3,6. Le 2 vient de l’aller-retour : la voiture reçoit l’onde en mouvement, puis la renvoie en mouvement.`,
      };
    },
  },
  {
    id: 'doppler.n3.raie-halpha',
    question: 'Vitesse d’une galaxie par la raie Hα',
    formats: ['saisie', 'qcm'],
    generer() {
      const lambda0 = 656.3;
      const lambda = auHasard([658.5, 660.2, 662.9, 670.0]);
      const v = (3.00e5 * (lambda - lambda0)) / lambda0;
      return {
        question: `La raie Hα de l’hydrogène, émise à λ₀ = 656,3 nm, est observée à λ = ${chNombre(lambda)} nm dans le spectre d’une galaxie. `
          + 'Avec $\\dfrac{\\lambda - \\lambda_0}{\\lambda_0} = \\dfrac{v}{c}$ et c = 3,00 × 10^{5} km·s⁻¹, vitesse d’éloignement en km·s⁻¹ ?',
        reponse: `${chNombre(v, 3)} km·s⁻¹ ; la galaxie s’éloigne (décalage vers le rouge)`,
        nombre: v,
        tolerance: 0.02,
        unite: 'km·s⁻¹',
        distracteurs: [`${chNombre(v * 1000, 3)} km·s⁻¹`, `${chNombre((3.00e5 * (lambda - lambda0)) / lambda, 3)} km·s⁻¹ (en divisant par λ)`,
          `${chNombre(v / 1000, 3)} km·s⁻¹`],
        aide: `v = c × (λ − λ₀) / λ₀ = 3,00 × 10^{5} × ${chNombre(Number((lambda - lambda0).toFixed(1)))} / 656,3. λ > λ₀ : éloignement.`,
      };
    },
  },
  {
    id: 'doppler.n3.exacte-ou-approchee',
    question: 'Fréquence reçue : expression exacte, calculatrice',
    formats: ['saisie'],
    generer() {
      const fE = auHasard([440, 523, 880]);
      const v = auHasard([25, 30, 45]);
      const fR = (fE * 340) / (340 - v);
      return {
        question: `Une sirène à ${fE} Hz s’approche à ${v} m·s⁻¹ d’un observateur fixe (c = 340 m·s⁻¹). `
          + 'Fréquence reçue, avec l’expression exacte, à 1 Hz près ?',
        reponse: `${chNombre(Math.round(fR))} Hz`,
        nombre: fR,
        tolerance: 0.003,
        unite: 'Hz',
        aide: `f_R = ${fE} × 340 / (340 − ${v}) ≈ ${chNombre(fR, 4)} Hz. L’expression approchée donnerait ${chNombre(fE * (1 + v / 340), 4)} Hz : v / c ≈ ${chNombre(Math.round((v / 340) * 100))} %, l’écart n’est plus négligeable.`,
      };
    },
  },
  {
    id: 'doppler.n3.copie-kmh',
    consigne: 'Corrige la copie.',
    formats: ['qcm', 'retournement'],
    question: 'Copie d’élève : « Le klaxon émet à 1 000 Hz, la voiture roule à 90 km/h, c = 340 m/s. '
      + '|Δf| = 1 000 × 90 / 340 = 265 Hz. » Où est l’erreur ?',
    reponse: 'La vitesse n’est pas convertie : 90 km/h = 25 m/s, donc |Δf| ≈ 74 Hz',
    distracteurs: [
      'Il fallait diviser par 90 et multiplier par 340',
      'Il fallait utiliser c = 3,00 × 10⁸ m/s',
      'Il n’y a pas d’erreur : 265 Hz est juste',
    ],
    aide: 'v et c doivent être dans la même unité. 1 000 × 25 / 340 ≈ 74 Hz.',
  },
  {
    id: 'doppler.n3.copie-signe',
    consigne: 'Corrige la copie.',
    formats: ['qcm', 'retournement'],
    question: 'Copie d’élève : « f_E = 500 Hz, f_R = 480 Hz. Δf = f_E − f_R = 20 Hz > 0 : l’émetteur s’approche. » Où est l’erreur ?',
    reponse: 'Δf = f_R − f_E = −20 Hz : l’émetteur s’éloigne',
    distracteurs: [
      'Le calcul est juste mais Δf s’exprime en m/s',
      'Il fallait calculer Δf = f_R + f_E',
      'Aucune : un décalage positif signifie bien une approche',
    ],
    aide: 'Pas besoin de calcul pour conclure : f_R < f_E, le son reçu est plus grave, l’émetteur s’éloigne.',
  },
  {
    id: 'doppler.n3.copie-chiffres',
    consigne: 'Corrige la copie.',
    formats: ['qcm', 'retournement'],
    question: 'Copie d’élève, données à deux ou trois chiffres significatifs : « v = 26,153846 m/s ». Qu’en dit le correcteur ?',
    reponse: 'Trop de chiffres significatifs : on écrit v ≈ 26 m/s',
    distracteurs: ['C’est parfait : la calculatrice est précise', 'Il faut arrondir à v = 30 m/s', 'Il faut écrire v = 26,2 km/h'],
  },
  {
    id: 'doppler.n3.copie-lumiere',
    consigne: 'Corrige la copie.',
    formats: ['qcm', 'retournement'],
    question: 'Copie d’élève, radar routier : « Δf = 2 f v / c avec c = 340 m/s. » Où est l’erreur ?',
    reponse: 'Le radar émet une onde électromagnétique : c = 3,00 × 10⁸ m/s',
    distracteurs: [
      'Il ne faut pas de facteur 2',
      'Il faut utiliser c − v au lieu de c',
      'Aucune : c est toujours 340 m/s',
    ],
  },
  {
    id: 'doppler.n3.vitesse-constante',
    question: '« Une source s’éloigne en ligne droite à vitesse constante : la fréquence perçue diminue au cours du temps. »',
    formats: ['vraifaux'],
    vrai: false,
    reponse: 'Faux : à vitesse constante, la fréquence perçue est constante (plus basse que f_E). C’est l’intensité sonore qui diminue avec la distance.',
  },
  {
    id: 'doppler.n3.son-fort',
    question: '« Plus la sirène est puissante, plus le décalage Doppler est grand. »',
    formats: ['vraifaux'],
    vrai: false,
    reponse: 'Faux : |Δf| ≈ f_E v / c ne dépend que de la fréquence émise, de la vitesse et de la célérité.',
  },
  {
    id: 'doppler.n3.etablir',
    question: 'Pour établir $f_R$, on regarde l’émetteur pendant une période $T_E$, en s’approchant à la vitesse v. Quelle relation entre longueurs d’onde ?',
    formats: ['qcm', 'retournement'],
    reponse: '$\\lambda_R = \\lambda_E - v T_E$',
    distracteurs: ['$\\lambda_R = \\lambda_E + v T_E$', '$\\lambda_R = v T_E$', '$\\lambda_R = \\lambda_E \\times v T_E$'],
    aide: 'Pendant T_E, l’onde parcourt λ_E = c T_E et l’émetteur v T_E : deux fronts successifs ne sont plus distants que de (c − v) T_E. '
      + 'Avec f_R = c / λ_R, on obtient f_R = f_E × c / (c − v).',
  },
  {
    id: 'doppler.n3.supersonique',
    question: 'Pourquoi l’expression approchée $|\\Delta f| \\approx f_E \\dfrac{v}{c}$ convient-elle à un radar routier, mais pas au son d’un avion de chasse ?',
    formats: ['qcm', 'retournement'],
    reponse: 'Pour le radar, v ≪ c = 3 × 10⁸ m/s ; pour l’avion, v est du même ordre que la célérité du son',
    distracteurs: [
      'Parce que les ondes électromagnétiques ne subissent pas l’effet Doppler',
      'Parce que l’avion émet un son trop fort',
      'Parce que le radar fait un aller-retour',
    ],
  },
  {
    id: 'doppler.n3.echographie',
    question: 'Échographie Doppler : la sonde émet à 5,0 MHz et reçoit un écho décalé de +1,3 kHz. Le sang dans ce vaisseau…',
    formats: ['qcm', 'retournement'],
    reponse: '…s’approche de la sonde : le décalage est positif',
    distracteurs: ['…s’éloigne de la sonde : le décalage est positif', '…est immobile : 1,3 kHz est négligeable devant 5,0 MHz',
      '…on ne peut rien dire sans la célérité des ultrasons'],
  },
  {
    id: 'doppler.n3.ordre-de-grandeur',
    question: 'Un TGV passe à 300 km·h⁻¹ en klaxonnant à 500 Hz (c = 340 m·s⁻¹). Ordre de grandeur de $|\\Delta f|$ à l’approche ?',
    formats: ['qcm'],
    reponse: 'Une centaine de hertz',
    distracteurs: ['Un hertz', 'Dix mille hertz', 'Moins d’un hertz'],
    aide: 'v ≈ 83 m·s⁻¹ ; l’expression exacte donne f_R ≈ 662 Hz, soit |Δf| ≈ 160 Hz. v / c ≈ 25 % : l’approchée (≈ 120 Hz) sous-estime.',
  },
];

inscrireChapitre({
  cle: 'doppler',
  theme: 'Ondes et signaux',
  titre: 'Effet Doppler',
  resume: 'Trois niveaux : vocabulaire et formules ; petites situations à calculer de tête ; pièges, copies '
    + 'd’élèves et exercices type bac, calculatrice permise. Les valeurs changent à chaque passage.',
  n1: DOPPLER_N1,
  n2: DOPPLER_N2,
  n3: DOPPLER_N3,
});
