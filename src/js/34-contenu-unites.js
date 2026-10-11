/* Paquet « Grandeurs et unités » : cinq niveaux ouverts un à un (37-niveaux.js).
 *
 * Niveaux 1 à 3 : les grandeurs des programmes de physique-chimie de seconde
 * (2019), de spécialité de première (2019) et de terminale (2019, en vigueur
 * depuis 2020), avec quelques-unes de l'enseignement scientifique (2023).
 * Niveau 4 : les unités dérivées en unités de base, et les grandeurs sans unité.
 * Niveau 5 : l'analyse dimensionnelle — retrouver l'unité d'une constante
 * (R, λ de Kohlrausch, ε, G…) à partir de la relation qui la définit, et
 * juger de l'homogénéité d'une expression.
 *
 * Une carte par grandeur : Leitner suit ainsi chacune séparément. L'élève tape
 * l'unité (toute écriture équivalente est acceptée : J·mol⁻¹·K⁻¹ ou
 * Pa·m³·mol⁻¹·K⁻¹) ou la choisit parmi des pièges.
 *
 * Outils de tirage partagés avec 33-contenu-conversions.js.
 * RÈGLE ABSOLUE (32-paquets.js) : un identifiant de carte ne change jamais.
 */

/** Ce que l'élève peut taper pour une grandeur sans unité. */
const SANS_UNITE = ['sans unité', 'sans unite', 'aucune', 'aucune unité', 'sans', 'adimensionné', 'adimensionnel',
  'sans dimension', 'pas d’unité', 'pas d unite', 'rien', '1'];

/** « la masse » → « de la masse » ; « le poids » → « du poids ». */
function de(nom) {
  if (nom.startsWith('le ')) return `du ${nom.slice(3)}`;
  if (nom.startsWith('les ')) return `des ${nom.slice(4)}`;
  return `de ${nom}`;
}

function majuscule(texte) {
  return texte.charAt(0).toUpperCase() + texte.slice(1);
}

/**
 * Une grandeur : [clé, nom avec article, symbole, unités, pièges, aide].
 * unités : une unité ou une liste d'unités acceptées (la première est affichée),
 * null pour une grandeur sans unité, ou { affiche, accepte } pour une unité que
 * le lecteur d'unités ne connaît pas (dB, rad) ou ne doit pas confondre (K et °C).
 */
function uniteAffichee(unites) {
  if (!unites) return 'sans unité';
  if (Array.isArray(unites)) return unites[0];
  return typeof unites === 'string' ? unites : unites.affiche;
}

function carteGrandeur(niveau, [cle, nom, symbole, unites, distracteurs, aide]) {
  const carte = {
    id: `unites.${niveau}.${cle}`,
    question: `Unité ${de(nom)} (${symbole}) ?`,
    reponse: uniteAffichee(unites),
    formats: ['saisie', 'qcm'],
    distracteurs,
    aide,
  };
  if (!unites) carte.saisie = SANS_UNITE;
  else if (typeof unites === 'object' && !Array.isArray(unites)) carte.saisie = unites.accepte;
  else carte.uniteAttendue = unites;
  return carte;
}

/** Trois familles par niveau : le symbole, la grandeur derrière une unité, vrai ou faux. */
function famillesGrandeurs(niveau, donnees) {
  return [
    {
      id: `unites.${niveau}.symboles`,
      question: 'Symbole usuel d’une grandeur',
      formats: ['qcm'],
      generer() {
        const [, nom, symbole] = auHasard(donnees);
        const autres = melanger([...new Set(donnees.map((d) => d[2]))].filter((s) => s !== symbole));
        return { question: `Symbole usuel ${de(nom)} ?`, reponse: symbole, distracteurs: autres.slice(0, 6) };
      },
    },
    {
      id: `unites.${niveau}.grandeur-depuis-unite`,
      question: 'Quelle grandeur s’exprime dans cette unité ?',
      formats: ['qcm'],
      generer() {
        const avecUnite = donnees.filter((d) => d[3]);
        const [, nom, symbole, unites] = auHasard(avecUnite);
        const affichee = uniteAffichee(unites);
        // Pas de piège qui s'exprime dans la même unité : il serait juste aussi.
        const autres = avecUnite.filter((d) => d[1] !== nom && !memeUnite(uniteAffichee(d[3]), affichee)
          && uniteAffichee(d[3]) !== affichee);
        return {
          question: `Quelle grandeur s’exprime en ${affichee} ?`,
          reponse: `${majuscule(nom)} (${symbole})`,
          distracteurs: melanger(autres).slice(0, 6).map((d) => `${majuscule(d[1])} (${d[2]})`),
        };
      },
    },
    {
      id: `unites.${niveau}.vrai-faux`,
      question: 'Une grandeur et son unité : vrai ou faux ?',
      formats: ['vraifaux'],
      generer() {
        const [, nom, symbole, unites, distracteurs] = auHasard(donnees);
        const juste = uniteAffichee(unites);
        const vrai = pileOuFace();
        const annonce = vrai ? juste : auHasard(distracteurs);
        const texte = (u) => (u === 'sans unité' ? 'est sans unité' : `s’exprime en ${u}`);
        return {
          question: `« ${majuscule(nom)} (${symbole}) ${texte(annonce)} »`,
          vrai,
          reponse: `${vrai ? 'Vrai' : 'Faux'} : ${nom} ${texte(juste)}.`,
        };
      },
    },
  ];
}

/* ---------- Niveau 1 : seconde ---------- */

const GRANDEURS_SECONDE = [
  ['masse', 'la masse', 'm', 'kg', ['g', 'N', 'kg·m^{-3}', 'mol'], 'Le kilogramme est l’unité SI ; le gramme en est un sous-multiple.'],
  ['volume', 'le volume', 'V', 'm^{3}', ['L', 'm^{2}', 'kg', 'm'], 'Unité SI : le m³. Le litre est usuel : 1 m³ = 1 000 L.'],
  ['masse-volumique', 'la masse volumique', 'ρ', ['kg·m^{-3}', 'g·L^{-1}'], ['kg·m^{3}', 'g', 'm^{3}·kg^{-1}', 'kg·L'],
    'ρ = m / V. Usuelles : g·L⁻¹ ou g·cm⁻³ ; l’eau vaut 1,0 g·cm⁻³ = 1 000 kg·m⁻³.'],
  ['concentration-masse', 'la concentration en masse', 'C_{m}', ['g·L^{-1}', 'kg·m^{-3}'], ['mol·L^{-1}', 'g', 'L·g^{-1}', 'g·mol^{-1}'],
    'C_{m} = m / V, « essentiellement exprimée en g·L⁻¹ ».'],
  ['quantite-matiere', 'la quantité de matière', 'n', 'mol', ['g', 'mol·L^{-1}', 'g·mol^{-1}', 'sans unité'],
    'Une mole contient exactement 6,022 140 76 × 10^{23} entités.'],
  ['nombre-entites', 'le nombre d’entités', 'N', null, ['mol', 'mol^{-1}', 'kg', 'g'], 'N = n × N_{A} : un nombre, sans unité.'],
  ['charge-elementaire', 'la charge élémentaire', 'e', 'C', ['V', 'A', 'eV', 'J'], 'e = 1,6 × 10^{-19} C.'],
  ['energie-transferee', 'l’énergie transférée', 'Q', 'J', ['W', '°C', 'N', 'J·kg^{-1}'], 'Toute énergie s’exprime en joules.'],
  ['energie-massique-changement', 'l’énergie massique de changement d’état', 'L', 'J·kg^{-1}', ['J', 'J·kg', 'W·kg^{-1}', 'J·mol^{-1}'],
    'Q = m × L : L = Q / m s’exprime en J·kg⁻¹.'],
  ['vitesse', 'la vitesse', 'v', 'm·s^{-1}', ['m·s', 'km', 'm·s^{-2}', 's·m^{-1}'], 'v = d / Δt. Usuelle : km·h⁻¹.'],
  ['force', 'la force', 'F', 'N', ['kg', 'J', 'Pa', 'W'], 'Le newton : 1 N = 1 kg·m·s⁻².'],
  ['constante-gravitation', 'la constante de gravitation universelle', 'G', 'N·m^{2}·kg^{-2}', ['N·m·kg^{-1}', 'N·kg^{-2}', 'N·m^{2}·kg^{2}', 'sans unité'],
    'F = G m m′ / d² donc G = F d² / (m m′) : N·m²·kg⁻² (= m³·kg⁻¹·s⁻²).'],
  ['intensite-pesanteur', 'l’intensité de la pesanteur', 'g', ['N·kg^{-1}', 'm·s^{-2}'], ['kg·N^{-1}', 'N', 'm·s^{-1}', 'N·kg'],
    'P = m g donc g = P / m : N·kg⁻¹, qui vaut aussi m·s⁻².'],
  ['poids', 'le poids', 'P', 'N', ['kg', 'N·kg^{-1}', 'J', 'g'], 'Le poids est une force : il s’exprime en newtons, la masse en kilogrammes.'],
  ['periode', 'la période', 'T', 's', ['Hz', 's^{-1}', 'm', 'm·s^{-1}'], 'Une durée : en secondes.'],
  ['frequence', 'la fréquence', 'f', ['Hz', 's^{-1}'], ['s', 'm', 'Hz·s', 'm·s^{-1}'], 'f = 1 / T : le hertz est l’inverse de la seconde.'],
  ['longueur-onde', 'la longueur d’onde', 'λ', 'm', ['Hz', 'm·s^{-1}', 's', 'm^{-1}'], 'Une longueur, souvent donnée en nm pour la lumière.'],
  ['intensite-sonore', 'l’intensité sonore', 'I', 'W·m^{-2}', ['dB', 'W', 'W·m^{2}', 'Pa'], 'Une puissance par unité de surface.'],
  ['niveau-sonore', 'le niveau d’intensité sonore', 'L', { affiche: 'dB', accepte: ['dB', 'décibel', 'décibels', 'decibel'] },
    ['W·m^{-2}', 'Hz', 'W', 'sans unité'], 'Le décibel (dB). À ne pas confondre avec l’intensité sonore, en W·m⁻².'],
  ['indice-refraction', 'l’indice de réfraction', 'n', null, ['m·s^{-1}', 'rad', 'm', 's'], 'n = c / v : un quotient de deux vitesses, sans unité.'],
  ['distance-focale', 'la distance focale', 'f′', 'm', ['m^{-1}', 'Hz', 'rad', 'sans unité'], 'Une distance, en mètres.'],
  ['grandissement', 'le grandissement', 'γ', null, ['m', 'm^{-1}', 'rad', 'Hz'], 'γ = A′B′ / AB : un quotient de deux longueurs, sans unité.'],
  ['tension', 'la tension électrique', 'U', 'V', ['A', 'Ω', 'W', 'J'], 'Le volt.'],
  ['intensite', 'l’intensité du courant', 'I', 'A', ['V', 'Ω', 'C', 'W'], 'L’ampère, une des sept unités de base du SI.'],
  ['resistance', 'la résistance électrique', 'R', ['Ω', 'V·A^{-1}'], ['V', 'A', 'S', 'W'], 'U = R I donc R = U / I : V·A⁻¹ = Ω.'],
];

/* ---------- Niveau 2 : première ---------- */

const GRANDEURS_PREMIERE = [
  ['masse-molaire', 'la masse molaire', 'M', ['g·mol^{-1}', 'kg·mol^{-1}'], ['mol·g^{-1}', 'g', 'mol', 'g·L^{-1}'],
    'M = m / n. Unité SI : kg·mol⁻¹ ; usuelle : g·mol⁻¹.'],
  ['avogadro', 'la constante d’Avogadro', 'N_{A}', 'mol^{-1}', ['mol', 'sans unité', 'g·mol^{-1}', 'mol·L^{-1}'],
    'N = n × N_{A} : N est sans unité, n en mol, donc N_{A} en mol⁻¹.'],
  ['volume-molaire', 'le volume molaire d’un gaz', 'V_{m}', ['L·mol^{-1}', 'm^{3}·mol^{-1}'], ['mol·L^{-1}', 'L', 'mol', 'L·mol'],
    'n = V / V_{m} donc V_{m} = V / n.'],
  ['concentration', 'la concentration en quantité de matière', 'c', ['mol·L^{-1}', 'mol·m^{-3}'], ['g·L^{-1}', 'mol', 'L·mol^{-1}', 'mol·L'],
    'c = n / V, le plus souvent en mol·L⁻¹.'],
  ['absorbance', 'l’absorbance', 'A', null, ['L·mol^{-1}·cm^{-1}', 'mol·L^{-1}', 'cm', 'nm'],
    'L’absorbance est un logarithme de rapport d’intensités lumineuses : sans unité.'],
  ['epsilon', 'le coefficient d’absorption molaire', 'ε', ['L·mol^{-1}·cm^{-1}', 'm^{2}·mol^{-1}'],
    ['mol·L^{-1}·cm^{-1}', 'sans unité', 'L·mol^{-1}', 'cm^{-1}'], 'A = ε ℓ c, A sans unité : ε = A / (ℓ c) en L·mol⁻¹·cm⁻¹.'],
  ['avancement', 'l’avancement', 'x', 'mol', ['sans unité', 'mol·L^{-1}', 'g', 's'], 'L’avancement se compte en moles.'],
  ['rendement-synthese', 'le rendement d’une synthèse', 'η', null, ['mol', 'g', 'J', 'mol·L^{-1}'],
    'η = n obtenue / n maximale : un rapport, sans unité (souvent en %).'],
  ['energie-molaire-reaction', 'l’énergie molaire de réaction', 'E_{r}', ['J·mol^{-1}', 'kJ·mol^{-1}'], ['J', 'J·kg^{-1}', 'mol·J^{-1}', 'W·mol^{-1}'],
    'Une énergie par mole de réaction, usuellement en kJ·mol⁻¹.'],
  ['pouvoir-calorifique', 'le pouvoir calorifique massique', 'PC', ['J·kg^{-1}', 'MJ·kg^{-1}', 'kJ·g^{-1}'], ['J', 'J·mol^{-1}', 'W·kg^{-1}', 'kg·J^{-1}'],
    'Une énergie libérée par kilogramme de combustible.'],
  ['charge', 'la charge électrique', 'q', 'C', ['A', 'V', 'F', 'eV'], 'Le coulomb : 1 C = 1 A·s.'],
  ['constante-coulomb', 'la constante de la loi de Coulomb', 'k', 'N·m^{2}·C^{-2}', ['N·C^{-2}', 'N·m·C^{-1}', 'C^{2}·N^{-1}·m^{-2}', 'sans unité'],
    'F = k q q′ / d² donc k = F d² / (q q′) : N·m²·C⁻².'],
  ['champ-electrostatique', 'le champ électrostatique', 'E', ['V·m^{-1}', 'N·C^{-1}'], ['V', 'N', 'V·m', 'C·N^{-1}'],
    'F = q E donc E = F / q en N·C⁻¹, qui vaut aussi V·m⁻¹.'],
  ['pression', 'la pression', 'P', 'Pa', ['N', 'N·m', 'J', 'bar'], 'P = F / S : N·m⁻² = Pa. Usuelles : bar, hPa.'],
  ['temperature', 'la température thermodynamique', 'T', { affiche: 'K', accepte: ['K', 'kelvin', 'kelvins'] }, ['°C', '°F', 'J', 'sans unité'],
    'Le kelvin, unité de base du SI : T (K) = θ (°C) + 273,15.'],
  ['puissance', 'la puissance', 'P', ['W', 'J·s^{-1}'], ['J', 'Wh', 'N', 'V'], 'P = E / Δt : J·s⁻¹ = W.'],
  ['energie', 'l’énergie', 'E', 'J', ['W', 'N', 'kWh', 'W·s^{-1}'], 'Le joule ; le kWh est une unité usuelle (3,6 × 10^{6} J), pas l’unité SI.'],
  ['travail', 'le travail d’une force', 'W', 'J', ['N', 'W', 'N·m^{-1}', 'Pa'], 'W = F × AB : N·m = J.'],
  ['energie-cinetique', 'l’énergie cinétique', 'E_{c}', 'J', ['kg·m·s^{-1}', 'W', 'N', 'kg·m^{2}·s^{-1}'], 'E_{c} = ½ m v² : kg·m²·s⁻² = J.'],
  ['celerite', 'la célérité d’une onde', 'v', 'm·s^{-1}', ['Hz', 'm', 's', 'm·s^{-2}'], 'λ = v T donc v = λ / T.'],
  ['retard', 'le retard d’une onde', 'τ', 's', ['m', 'Hz', 'm·s^{-1}', 'sans unité'], 'Une durée : τ = d / v.'],
  ['planck', 'la constante de Planck', 'h', 'J·s', ['J·s^{-1}', 'J', 'W', 'Hz'], 'ΔE = h ν donc h = ΔE / ν : J / Hz = J·s.'],
  ['energie-photon', 'l’énergie d’un photon', 'E', ['J', 'eV'], ['Hz', 'J·s', 'W', 'm'], 'E = h ν ; souvent en eV : 1 eV = 1,6 × 10^{-19} J.'],
  ['electronegativite', 'l’électronégativité', 'χ', null, ['C', 'eV', 'V', 'J'], 'Un nombre de l’échelle de Pauling, sans unité.'],
];

/* ---------- Niveau 3 : terminale ---------- */

const GRANDEURS_TERMINALE = [
  ['ph', 'le pH', 'pH', null, ['mol·L^{-1}', 'L·mol^{-1}', 'mol', 'V'], 'pH = −log([H₃O⁺] / c°) : le logarithme d’un nombre sans unité.'],
  ['conductance', 'la conductance', 'G', ['S', 'Ω^{-1}'], ['Ω', 'S·m^{-1}', 'A', 'V'], 'G = 1 / R : le siemens est l’inverse de l’ohm.'],
  ['conductivite', 'la conductivité', 'σ', 'S·m^{-1}', ['S', 'S·m', 'S·m^{2}·mol^{-1}', 'Ω·m'], 'Une conductance ramenée à la géométrie de la cellule.'],
  ['conductivite-molaire-ionique', 'la conductivité molaire ionique', 'λ', 'S·m^{2}·mol^{-1}',
    ['S·m^{-1}', 'S·mol^{-1}', 'S·m^{-2}·mol', 'S·m^{2}'], 'σ = Σ λᵢ [Xᵢ], [Xᵢ] en mol·m⁻³ : λ = σ / [X] en S·m²·mol⁻¹.'],
  ['constante-gaz-parfaits', 'la constante des gaz parfaits', 'R', 'J·mol^{-1}·K^{-1}', ['J·K^{-1}', 'Pa·m^{3}', 'J·mol·K', 'mol·K·J^{-1}'],
    'PV = nRT donc R = PV / (nT) : Pa·m³ = J, d’où J·mol⁻¹·K⁻¹.'],
  ['vitesse-volumique', 'la vitesse volumique de réaction', 'v', ['mol·L^{-1}·s^{-1}', 'mol·m^{-3}·s^{-1}'], ['mol·s^{-1}', 'mol·L^{-1}', 's^{-1}', 'm·s^{-1}'],
    'v = d[A] / dt : une concentration par unité de temps.'],
  ['demi-reaction', 'le temps de demi-réaction', 't_{1/2}', 's', ['s^{-1}', 'mol·s^{-1}', 'sans unité', 'mol'], 'Une durée.'],
  ['constante-vitesse', 'la constante de vitesse d’une réaction d’ordre 1', 'k', 's^{-1}', ['s', 'mol·L^{-1}·s^{-1}', 'sans unité', 'mol·s^{-1}'],
    'v = k [A] : k = v / [A] en s⁻¹.'],
  ['constante-radioactive', 'la constante radioactive', 'λ', 's^{-1}', ['s', 'Bq·s', 'sans unité', 'm'],
    'N = N₀ e^{−λt} : λt est sans unité, donc λ s’exprime en s⁻¹.'],
  ['activite', 'l’activité d’un échantillon radioactif', 'A', ['Bq', 's^{-1}'], ['s', 'Gy', 'J', 'sans unité'],
    'A = λ N : le becquerel, une désintégration par seconde.'],
  ['constante-equilibre', 'la constante d’équilibre', 'K', null, ['mol·L^{-1}', 'mol^{2}·L^{-2}', 's^{-1}', 'L·mol^{-1}'],
    '« Le quotient de réaction est adimensionné » : chaque concentration est divisée par c° = 1 mol·L⁻¹.'],
  ['constante-acidite', 'la constante d’acidité', 'K_{A}', null, ['mol·L^{-1}', 'L·mol^{-1}', 'mol', 'pH'],
    'Comme toute constante d’équilibre : sans unité.'],
  ['taux-avancement', 'le taux d’avancement final', 'τ', null, ['mol', 's', 'mol·L^{-1}', 's^{-1}'], 'τ = x_{f} / x_{max} : sans unité.'],
  ['capacite-pile', 'la capacité électrique d’une pile', 'Q', ['C', 'A·h'], ['V', 'W', 'F', 'A'],
    'Q = I Δt = n(e⁻) F : en coulombs, souvent en A·h (1 A·h = 3 600 C).'],
  ['acceleration', 'l’accélération', 'a', ['m·s^{-2}', 'N·kg^{-1}'], ['m·s^{-1}', 'N', 'm·s^{2}', 'N·kg'], 'a = dv / dt : (m·s⁻¹) / s = m·s⁻².'],
  ['quantite-mouvement', 'la quantité de mouvement', 'p', 'kg·m·s^{-1}', ['kg·m·s^{-2}', 'N', 'J', 'kg·m^{2}·s^{-1}'], 'p = m v.'],
  ['debit-volumique', 'le débit volumique', 'D_{v}', 'm^{3}·s^{-1}', ['m^{3}', 'm·s^{-1}', 'L', 'kg·s^{-1}'], 'D_{v} = S v : m² × m·s⁻¹ = m³·s⁻¹.'],
  ['energie-interne', 'l’énergie interne', 'U', 'J', ['W', 'K', 'J·K^{-1}', 'V'], 'Une énergie : ΔU = W + Q.'],
  ['capacite-thermique', 'la capacité thermique', 'C', 'J·K^{-1}', ['J', 'J·kg^{-1}·K^{-1}', 'K·J^{-1}', 'W·K^{-1}'], 'ΔU = C ΔT donc C = ΔU / ΔT.'],
  ['capacite-thermique-massique', 'la capacité thermique massique', 'c', 'J·kg^{-1}·K^{-1}', ['J·K^{-1}', 'J·kg^{-1}', 'J·kg·K^{-1}', 'W·kg^{-1}'],
    'C = m c : une capacité thermique par kilogramme.'],
  ['flux-thermique', 'le flux thermique', 'Φ', 'W', ['J', 'K·W^{-1}', 'W·m^{-2}', 'K'], 'Une énergie transférée par seconde : une puissance.'],
  ['resistance-thermique', 'la résistance thermique', 'R_{th}', 'K·W^{-1}', ['W·K^{-1}', 'Ω', 'K', 'W·m^{-1}·K^{-1}'], 'Φ = ΔT / R_{th} donc R_{th} = ΔT / Φ.'],
  ['coefficient-conducto-convectif', 'le coefficient de transfert conducto-convectif', 'h', 'W·m^{-2}·K^{-1}',
    ['W·K^{-1}', 'W·m^{-2}', 'J·m^{-2}·K^{-1}', 'W·m·K^{-1}'], 'Φ = h S ΔT donc h = Φ / (S ΔT).'],
  ['stefan', 'la constante de Stefan-Boltzmann', 'σ', 'W·m^{-2}·K^{-4}', ['W·m^{-2}', 'W·K^{-4}', 'W·m^{2}·K^{4}', 'J·m^{-2}·K^{-4}'],
    'P / S = σ T⁴ donc σ = P / (S T⁴).'],
  ['angle-diffraction', 'l’angle caractéristique de diffraction', 'θ', { affiche: 'rad', accepte: ['rad', 'radian', 'radians'] },
    ['m', 'm^{-1}', 'Hz', '°·m'], 'θ = λ / a : un quotient de longueurs, exprimé en radians.'],
  ['grossissement', 'le grossissement d’une lunette', 'G', null, ['m', 'rad', 'm^{-1}', 'Hz'], 'G = θ′ / θ : un rapport d’angles, sans unité.'],
  ['capacite-condensateur', 'la capacité d’un condensateur', 'C', ['F', 'C·V^{-1}'], ['C', 'C·V', 'Ω', 'V·C^{-1}'], 'q = C u donc C = q / u : C·V⁻¹ = F.'],
  ['constante-temps', 'la constante de temps d’un circuit RC', 'τ', ['s', 'Ω·F'], ['Ω', 'F', 's^{-1}', 'Ω·F^{-1}'], 'τ = R C : Ω × F = s.'],
  ['travail-extraction', 'le travail d’extraction', 'W', ['J', 'eV'], ['Hz', 'W', 'V', 'J·s'], 'E_{c} = h ν − W : une énergie, souvent en eV.'],
];

/* ---------- Niveau 4 : unités de base et grandeurs sans unité ---------- */

/** [clé, unité, son expression en unités de base, pièges, aide] */
const UNITES_DERIVEES = [
  ['newton', 'le newton (N)', 'kg·m·s^{-2}', ['kg·m·s^{-1}', 'kg·m^{2}·s^{-2}', 'kg·s^{-2}', 'kg·m^{-1}·s^{-2}'], 'F = m a : kg × m·s⁻².'],
  ['joule', 'le joule (J)', 'kg·m^{2}·s^{-2}', ['kg·m·s^{-2}', 'kg·m^{2}·s^{-3}', 'kg·m^{2}·s^{-1}', 'kg·m^{-1}·s^{-2}'], 'E_{c} = ½ m v² : kg × (m·s⁻¹)².'],
  ['watt', 'le watt (W)', 'kg·m^{2}·s^{-3}', ['kg·m^{2}·s^{-2}', 'kg·m·s^{-3}', 'kg·m^{2}·s^{-1}', 'kg·m^{2}·s^{3}'], 'P = E / Δt : J·s⁻¹.'],
  ['pascal', 'le pascal (Pa)', 'kg·m^{-1}·s^{-2}', ['kg·m·s^{-2}', 'kg·m^{-2}·s^{-2}', 'kg·m^{2}·s^{-2}', 'kg·m^{-1}·s^{-1}'], 'P = F / S : N·m⁻².'],
  ['coulomb', 'le coulomb (C)', 'A·s', ['A·s^{-1}', 'A^{-1}·s', 'kg·A', 'A'], 'Q = I Δt.'],
  ['volt', 'le volt (V)', 'kg·m^{2}·s^{-3}·A^{-1}', ['kg·m^{2}·s^{-3}·A', 'kg·m^{2}·s^{-2}·A^{-1}', 'kg·m·s^{-3}·A^{-1}', 'kg·m^{2}·s^{-3}'],
    'P = U I donc U = P / I : W·A⁻¹.'],
  ['ohm', 'l’ohm (Ω)', 'kg·m^{2}·s^{-3}·A^{-2}', ['kg·m^{2}·s^{-3}·A^{-1}', 'kg·m^{2}·s^{-3}·A^{2}', 'kg·m^{2}·s^{-2}·A^{-2}', 'A^{-1}'],
    'R = U / I : V·A⁻¹.'],
  ['hertz', 'le hertz (Hz)', 's^{-1}', ['s', 'm·s^{-1}', 'rad', 'm^{-1}'], 'f = 1 / T.'],
];

/** [clé, question, réponse, unités acceptées, pièges, aide] : relations entre unités dérivées. */
const RELATIONS_UNITES = [
  ['joule-newton-metre', 'Le joule en newtons et en mètres ?', 'N·m', ['N·m'], ['N·m^{-1}', 'N·s', 'N·m^{2}', 'N·m^{-2}'], 'W = F × AB.'],
  ['watt-joule', 'Le watt en joules et en secondes ?', 'J·s^{-1}', ['J·s^{-1}'], ['J·s', 'J·h^{-1}', 'J·s^{-2}', 'N·s'], 'P = E / Δt.'],
  ['pascal-newton', 'Le pascal en newtons et en mètres ?', 'N·m^{-2}', ['N·m^{-2}'], ['N·m^{2}', 'N·m', 'N·m^{-1}', 'N·m^{-3}'], 'P = F / S.'],
  ['volt-joule', 'Le volt en joules et en coulombs ?', 'J·C^{-1}', ['J·C^{-1}'], ['J·C', 'C·J^{-1}', 'J·A^{-1}', 'J·s^{-1}'], 'E = q U donc U = E / q.'],
  ['ohm-volt', 'L’ohm en volts et en ampères ?', 'V·A^{-1}', ['V·A^{-1}'], ['V·A', 'A·V^{-1}', 'V·A^{-2}', 'W·A^{-1}'], 'U = R I.'],
  ['farad-coulomb', 'Le farad en coulombs et en volts ?', 'C·V^{-1}', ['C·V^{-1}'], ['C·V', 'V·C^{-1}', 'C·A^{-1}', 'C^{2}·V'], 'q = C u.'],
  ['siemens-ohm', 'Le siemens en ohms ?', 'Ω^{-1}', ['Ω^{-1}'], ['Ω', 'Ω^{2}', 'Ω·m', 'Ω·m^{-1}'], 'G = 1 / R.'],
  ['becquerel', 'Le becquerel en unités de base ?', 's^{-1}', ['s^{-1}'], ['s', 'J·s^{-1}', 'kg·s^{-1}', 'sans unité'], 'Une désintégration par seconde.'],
];

const EQUIVALENCES_UNITES = [
  ['N·kg^{-1} = m·s^{-2}', true, 'Vrai : N·kg⁻¹ = kg·m·s⁻² / kg = m·s⁻². g est aussi une accélération.'],
  ['V·m^{-1} = N·C^{-1}', true, 'Vrai : E = U / d = F / q.'],
  ['Ω·F = s', true, 'Vrai : τ = R C est une durée.'],
  ['J = W·h', false, 'Faux : J = W·s ; 1 W·h = 3 600 J.'],
  ['Pa·m^{3} = J', true, 'Vrai : N·m⁻² × m³ = N·m = J.'],
  ['W = J·s', false, 'Faux : W = J·s⁻¹.'],
  ['C = A·s^{-1}', false, 'Faux : C = A·s.'],
  ['Hz = s', false, 'Faux : Hz = s⁻¹.'],
  ['S = Ω^{-1}', true, 'Vrai : le siemens est l’inverse de l’ohm.'],
  ['eV = 1,6 × 10^{-19} J', true, 'Vrai : l’énergie d’un électron sous 1 V.'],
];

/** Grandeurs sans unité et grandeurs à unité, pour les familles du niveau 4. */
const SANS_UNITE_LISTE = ['l’absorbance', 'le pH', 'la constante d’équilibre', 'l’indice de réfraction', 'le rendement',
  'le taux d’avancement final', 'le grandissement', 'le grossissement', 'la constante d’acidité', 'l’albédo'];
const AVEC_UNITE_LISTE = ['la concentration', 'la conductivité', 'la constante radioactive', 'la masse molaire',
  'le coefficient d’absorption molaire', 'la constante des gaz parfaits', 'la vitesse volumique', 'la pression', 'l’activité'];

const NIVEAU_4_UNITES = [
  ...UNITES_DERIVEES.map(([cle, nom, base, distracteurs, aide]) => ({
    id: `unites.n4.base-${cle}`,
    question: `Exprime ${nom} en unités de base du SI.`,
    reponse: base,
    formats: ['saisie', 'qcm'],
    uniteAttendue: base,
    basesSeules: true,
    distracteurs,
    aide: `${aide} Unités de base : kg, m, s, A, K, mol, cd.`,
  })),
  ...RELATIONS_UNITES.map(([cle, question, reponse, unites, distracteurs, aide]) => ({
    id: `unites.n4.${cle}`,
    question,
    reponse,
    formats: ['saisie', 'qcm'],
    uniteAttendue: unites,
    distracteurs,
    aide,
  })),
  {
    id: 'unites.n4.equivalences',
    question: 'Deux unités égales : vrai ou faux ?',
    formats: ['vraifaux'],
    generer() {
      const [egalite, vrai, reponse] = auHasard(EQUIVALENCES_UNITES);
      return { question: `« ${egalite} »`, vrai, reponse };
    },
  },
  {
    id: 'unites.n4.laquelle-sans-unite',
    question: 'Laquelle de ces grandeurs est sans unité ?',
    formats: ['qcm'],
    aide: 'Un rapport de deux grandeurs de même unité, ou un logarithme, est sans unité.',
    generer() {
      const bonne = majuscule(auHasard(SANS_UNITE_LISTE));
      return { question: 'Laquelle de ces grandeurs est sans unité ?', reponse: bonne, distracteurs: melanger(AVEC_UNITE_LISTE).slice(0, 5).map(majuscule) };
    },
  },
  {
    id: 'unites.n4.sans-unite-vrai-faux',
    question: 'Grandeur sans unité : vrai ou faux ?',
    formats: ['vraifaux'],
    generer() {
      const vrai = pileOuFace();
      const nom = auHasard(vrai ? SANS_UNITE_LISTE : AVEC_UNITE_LISTE);
      return { question: `« ${majuscule(nom)} est sans unité »`, vrai, reponse: `${vrai ? 'Vrai' : 'Faux'} : ${nom} ${vrai ? 'est sans unité' : 'a une unité'}.` };
    },
  },
  {
    id: 'unites.n4.nombre-unites-base',
    question: 'Combien d’unités de base compte le Système international ?',
    formats: ['qcm'],
    reponse: '7',
    distracteurs: ['5', '6', '10', '12', '4'],
    aide: 'Le kilogramme, le mètre, la seconde, l’ampère, le kelvin, la mole et la candela.',
  },
  {
    id: 'unites.n4.pas-unite-de-base',
    question: 'Laquelle n’est pas une unité de base du SI ?',
    formats: ['qcm'],
    generer() {
      const bonne = auHasard(['le newton', 'le joule', 'le volt', 'le litre', 'le gramme', 'le pascal', 'le watt']);
      return {
        question: 'Laquelle n’est pas une unité de base du SI ?',
        reponse: bonne,
        distracteurs: ['le kilogramme', 'le mètre', 'la seconde', 'l’ampère', 'le kelvin', 'la mole', 'la candela'],
        aide: 'Unités de base : kg, m, s, A, K, mol, cd. Le gramme n’en est pas une : c’est le kilogramme.',
      };
    },
  },
  {
    id: 'unites.n4.quotient-meme-unite',
    question: 'Pourquoi l’indice de réfraction n = c / v est-il sans unité ?',
    formats: ['retournement'],
    reponse: 'C’est le quotient de deux vitesses : les m·s⁻¹ se simplifient.',
    aide: 'Même raisonnement pour le grandissement (deux longueurs) ou le rendement (deux énergies).',
  },
];

/* ---------- Niveau 5 : analyse dimensionnelle ---------- */

/** [clé, question, unités acceptées (la première affichée), pièges, démarche] */
const UNITES_PAR_RELATION = [
  ['r-gaz-parfaits', 'À partir de PV = nRT (P en Pa, V en m³), retrouve l’unité de R.', ['J·mol^{-1}·K^{-1}'],
    ['J·K^{-1}', 'Pa·m^{3}', 'J·mol·K', 'Pa·m^{-3}·mol^{-1}·K^{-1}'], 'R = PV / (nT) : Pa·m³·mol⁻¹·K⁻¹, et Pa·m³ = N·m⁻²·m³ = N·m = J.'],
  ['lambda-kohlrausch', 'À partir de σ = Σ λᵢ [Xᵢ] (σ en S·m⁻¹, [Xᵢ] en mol·m⁻³), retrouve l’unité de λᵢ.', ['S·m^{2}·mol^{-1}'],
    ['S·m^{-1}', 'S·m^{-4}·mol', 'S·mol^{-1}', 'S·m^{2}'], 'λ = σ / [X] = (S·m⁻¹) / (mol·m⁻³) = S·m²·mol⁻¹.'],
  ['epsilon-beer-lambert', 'À partir de A = ε ℓ c (A sans unité, ℓ en cm, c en mol·L⁻¹), retrouve l’unité de ε.', ['L·mol^{-1}·cm^{-1}', 'm^{2}·mol^{-1}'],
    ['mol·L^{-1}·cm^{-1}', 'L·mol·cm', 'sans unité', 'cm·mol^{-1}'], 'ε = A / (ℓ c) = 1 / (cm × mol·L⁻¹) = L·mol⁻¹·cm⁻¹.'],
  ['g-gravitation', 'À partir de F = G m m′ / d², retrouve l’unité de G.', ['N·m^{2}·kg^{-2}'],
    ['N·kg^{-2}', 'N·m^{-2}·kg^{2}', 'N·m·kg^{-1}', 'kg^{2}·N^{-1}·m^{-2}'], 'G = F d² / (m m′) = N·m²·kg⁻² (= m³·kg⁻¹·s⁻²).'],
  ['k-coulomb', 'À partir de F = k q q′ / d², retrouve l’unité de k.', ['N·m^{2}·C^{-2}'],
    ['N·C^{-2}', 'N·m^{-2}·C^{2}', 'N·m·C^{-1}', 'C^{2}·N^{-1}·m^{-2}'], 'k = F d² / (q q′) = N·m²·C⁻².'],
  ['h-planck', 'À partir de E = h ν, retrouve l’unité de h.', ['J·s'], ['J·s^{-1}', 'J·Hz', 'W', 'J'], 'h = E / ν = J / Hz = J·s.'],
  ['k-ordre-1', 'À partir de v = k [A] (v en mol·L⁻¹·s⁻¹), retrouve l’unité de k.', ['s^{-1}'],
    ['s', 'mol·L^{-1}·s^{-1}', 'L·mol^{-1}·s^{-1}', 'sans unité'], 'k = v / [A] = (mol·L⁻¹·s⁻¹) / (mol·L⁻¹) = s⁻¹.'],
  ['lambda-radioactive', 'À partir de N(t) = N₀ e^{−λt}, retrouve l’unité de λ.', ['s^{-1}', 'Bq'], ['s', 'sans unité', 's^{-2}', 'mol·s^{-1}'],
    'L’argument d’une exponentielle est sans unité : λ t n’a pas d’unité, donc λ est en s⁻¹.'],
  ['c-massique', 'À partir de Q = m c ΔT, retrouve l’unité de c.', ['J·kg^{-1}·K^{-1}'],
    ['J·kg·K', 'J·K^{-1}', 'J·kg^{-1}', 'kg·K·J^{-1}'], 'c = Q / (m ΔT) = J·kg⁻¹·K⁻¹.'],
  ['r-thermique', 'À partir de Φ = ΔT / R_{th} (Φ en W), retrouve l’unité de R_{th}.', ['K·W^{-1}'], ['W·K^{-1}', 'K·W', 'Ω', 'W'],
    'R_{th} = ΔT / Φ = K·W⁻¹.'],
  ['h-newton', 'À partir de Φ = h S ΔT (loi de Newton), retrouve l’unité de h.', ['W·m^{-2}·K^{-1}'],
    ['W·m^{2}·K', 'W·K^{-1}', 'W·m^{-2}', 'J·m^{-2}·K^{-1}'], 'h = Φ / (S ΔT) = W·m⁻²·K⁻¹.'],
  ['sigma-stefan', 'À partir de P / S = σ T⁴, retrouve l’unité de σ.', ['W·m^{-2}·K^{-4}'],
    ['W·m^{-2}', 'W·m^{2}·K^{4}', 'W·K^{-4}', 'W·m^{-2}·K^{4}'], 'σ = P / (S T⁴) = W·m⁻²·K⁻⁴.'],
  ['kepler', 'À partir de T² / a³ = 4π² / (G M), retrouve l’unité de T² / a³.', ['s^{2}·m^{-3}'], ['s·m^{-1}', 'm^{3}·s^{-2}', 's^{2}·m^{3}', 'sans unité'],
    'T en s, a en m : s²·m⁻³ ; on retrouve l’inverse de G M en m³·s⁻².'],
  ['wien', 'À partir de λ_{max} × T = constante (loi de Wien), retrouve l’unité de la constante.', ['m·K'],
    ['m·K^{-1}', 'K·m^{-1}', 'm', 'nm'], 'Une longueur fois une température : m·K.'],
  ['avogadro-masse', 'À partir de M = m_{entité} × N_{A}, retrouve l’unité de N_{A}.', ['mol^{-1}'], ['mol', 'g·mol^{-1}', 'sans unité', 'kg'],
    'N_{A} = M / m = (kg·mol⁻¹) / kg = mol⁻¹.'],
  ['champ-condensateur', 'À partir de E = U / d, retrouve l’unité du champ E.', ['V·m^{-1}', 'N·C^{-1}'], ['V·m', 'V', 'N·C', 'm·V^{-1}'],
    'E = U / d : V·m⁻¹, qui vaut aussi N·C⁻¹.'],
  ['conductivite-thermique', 'À partir de R_{th} = e / (λ S) (e une épaisseur), retrouve l’unité de la conductivité thermique λ.',
    ['W·m^{-1}·K^{-1}'], ['W·m·K', 'W·K^{-1}', 'K·W^{-1}·m^{-1}', 'W·m^{-2}·K^{-1}'], 'λ = e / (R_{th} S) = m / (K·W⁻¹ × m²) = W·m⁻¹·K⁻¹.'],
  ['faraday', 'À partir de Q = n(e⁻) × F, retrouve l’unité de la constante de Faraday F.', ['C·mol^{-1}'], ['C·mol', 'mol·C^{-1}', 'C', 'A'],
    'F = Q / n = C·mol⁻¹ : la charge d’une mole d’électrons.'],
];

/** Expressions homogènes ou non à une grandeur : [grandeur, justes, fausses]. */
const HOMOGENEITE = [
  ['une vitesse', ['\\sqrt{2gh}', '\\sqrt{g \\ell }', 'λ f', '\\frac{d}{Δt}'], ['2gh', '\\frac{g}{h}', '\\frac{λ}{f}', '\\sqrt{\\frac{g}{\\ell }}', 'g t^{2}']],
  ['une durée', ['\\sqrt{\\frac{\\ell }{g}}', 'R C', '\\frac{\\ln 2}{λ}', '\\frac{1}{f}'], ['\\sqrt{\\frac{g}{\\ell }}', '\\frac{R}{C}', '\\frac{λ}{\\ln 2}', 'f', '\\ell  g']],
  ['une énergie', ['\\frac{1}{2} m v^{2}', 'm g h', 'h ν', 'P V', 'q U'], ['\\frac{1}{2} m v', 'm g', '\\frac{h}{λ}', '\\frac{P}{V}', 'R I^{2}']],
  ['une pression', ['ρ g h', '\\frac{1}{2} ρ v^{2}', '\\frac{F}{S}', '\\frac{nRT}{V}'], ['ρ g', 'F S', 'ρ v', '\\frac{nR}{V}', 'm g h']],
  ['une force', ['m a', '\\frac{m v^{2}}{R}', 'q E', 'm g'], ['m v', '\\frac{m v}{R}', '\\frac{E}{q}', 'm g h', 'P V']],
  ['une puissance', ['U I', 'R I^{2}', '\\frac{U^{2}}{R}', 'F v'], ['\\frac{U}{I}', 'R I', 'U I Δt', 'F d', 'm v']],
];

/** Affirmations d'homogénéité : [expression, grandeur, vrai, explication]. */
const HOMOGENEITE_VRAI_FAUX = [
  ['τ = R C', 'une durée', true, 'Ω × F = (V·A⁻¹) × (C·V⁻¹) = C·A⁻¹ = s.'],
  ['\\sqrt{\\frac{\\ell }{g}}', 'une durée', true, '√(m / (m·s⁻²)) = √(s²) = s.'],
  ['\\sqrt{2gh}', 'une vitesse', true, '√(m·s⁻² × m) = m·s⁻¹.'],
  ['\\frac{1}{2} m v', 'une énergie', false, 'kg·m·s⁻¹ : c’est une quantité de mouvement. L’énergie cinétique est ½ m v².'],
  ['\\frac{\\ln 2}{λ}', 'une durée', true, 'λ en s⁻¹, ln 2 sans unité : des secondes. C’est la demi-vie.'],
  ['\\frac{h}{λ}', 'une énergie', false, 'J·s / m : c’est la quantité de mouvement du photon. L’énergie est h ν = h c / λ.'],
  ['\\frac{λ D}{b}', 'une longueur', true, 'm × m / m = m : c’est l’interfrange.'],
  ['\\frac{1}{2} ρ v^{2}', 'une pression', true, 'kg·m⁻³ × m²·s⁻² = kg·m⁻¹·s⁻² = Pa.'],
  ['ρ g z', 'une énergie', false, 'kg·m⁻³ × m·s⁻² × m = Pa : c’est une pression.'],
  ['\\frac{m v^{2}}{R}', 'une force', true, 'kg × m²·s⁻² / m = kg·m·s⁻² = N.'],
  ['\\frac{G M}{d^{2}}', 'une accélération', true, 'N·m²·kg⁻² × kg / m² = N·kg⁻¹ = m·s⁻².'],
  ['R I^{2}', 'une énergie', false, 'Ω × A² = V·A = W : c’est une puissance. L’énergie est R I² Δt.'],
  ['\\frac{nRT}{V}', 'une pression', true, 'C’est P, d’après PV = nRT.'],
  ['\\frac{k q}{d^{2}}', 'une force', false, 'N·m²·C⁻² × C / m² = N·C⁻¹ : c’est un champ électrique. La force est k q q′ / d².'],
  ['q U', 'une énergie', true, 'C × V = C × J·C⁻¹ = J.'],
];

const NIVEAU_5_UNITES = [
  ...UNITES_PAR_RELATION.map(([cle, question, unites, distracteurs, aide]) => ({
    id: `unites.n5.${cle}`,
    question,
    reponse: unites[0],
    formats: ['saisie', 'qcm'],
    uniteAttendue: unites,
    distracteurs,
    aide,
  })),
  {
    id: 'unites.n5.expression-homogene',
    question: 'Quelle expression est homogène à cette grandeur ?',
    formats: ['qcm'],
    aide: 'Remplace chaque grandeur par son unité, simplifie, et compare.',
    generer() {
      const [grandeur, justes, fausses] = auHasard(HOMOGENEITE);
      return {
        question: `Quelle expression est homogène à ${grandeur} ?`,
        reponse: `$${auHasard(justes)}$`,
        distracteurs: fausses.map((f) => `$${f}$`),
      };
    },
  },
  {
    id: 'unites.n5.homogeneite-vrai-faux',
    question: 'Cette expression est-elle homogène à cette grandeur ?',
    formats: ['vraifaux'],
    generer() {
      const [expression, grandeur, vrai, reponse] = auHasard(HOMOGENEITE_VRAI_FAUX);
      return { question: `« $${expression}$ est homogène à ${grandeur} »`, vrai, reponse: `${vrai ? 'Vrai' : 'Faux'} : ${reponse}` };
    },
  },
  {
    id: 'unites.n5.bernoulli',
    question: 'Dans P + ½ ρ v² + ρ g z = constante, quelle est l’unité de chaque terme ?',
    formats: ['saisie', 'qcm'],
    reponse: 'Pa',
    uniteAttendue: ['Pa'],
    distracteurs: ['J', 'W', 'N', 'kg·m^{-3}'],
    aide: 'On n’additionne que des grandeurs de même unité : chaque terme est une pression, comme P.',
  },
  {
    id: 'unites.n5.argument-log',
    question: 'pH = −log([H₃O⁺] / c°) : pourquoi divise-t-on par c° = 1 mol·L⁻¹ ?',
    formats: ['retournement'],
    reponse: 'Pour que l’argument du logarithme soit sans unité.',
    aide: 'Même règle pour une exponentielle : dans e^{−λt}, λ t est sans unité.',
  },
  {
    id: 'unites.n5.quotient-reaction',
    question: 'Le quotient de réaction se calcule avec des concentrations. Pourquoi est-il pourtant sans unité ?',
    formats: ['retournement'],
    reponse: 'Chaque concentration y est divisée par la concentration standard c° = 1 mol·L⁻¹.',
    aide: '« Le quotient de réaction est adimensionné » (programme de terminale).',
  },
  {
    id: 'unites.n5.on-additionne',
    question: '« On peut additionner une énergie et une puissance »',
    formats: ['vraifaux'],
    vrai: false,
    reponse: 'Faux : on n’additionne et on ne compare que des grandeurs de même unité. Une formule qui le fait est fausse.',
  },
  {
    id: 'unites.n5.unite-rt',
    question: 'Quelle est l’unité de R T (R constante des gaz parfaits, T en K) ?',
    formats: ['saisie', 'qcm'],
    reponse: 'J·mol^{-1}',
    uniteAttendue: ['J·mol^{-1}'],
    distracteurs: ['J', 'J·K^{-1}', 'J·mol^{-1}·K^{-1}', 'mol·J^{-1}'],
    aide: 'J·mol⁻¹·K⁻¹ × K = J·mol⁻¹ : une énergie molaire.',
  },
];

Paquets.inscrire({
  cle: 'unites',
  theme: 'Physique-chimie',
  titre: 'Grandeurs et unités',
  resume: 'Cinq niveaux : les grandeurs de seconde, de première et de terminale, les unités de base du SI, '
    + 'puis l’analyse dimensionnelle (retrouver l’unité de R, de λ, de ε…). Toute écriture équivalente d’une unité est acceptée.',
  niveaux: ['seconde', 'premiere', 'terminale'],
  progression: 'niveaux',
  formatFixe: 'mixte',
  consignesParFormat: true,
  sections: [
    { cle: 'n1', titre: 'Niveau 1 · Seconde', consigne: null,
      cartes: [...GRANDEURS_SECONDE.map((g) => carteGrandeur('n1', g)), ...famillesGrandeurs('n1', GRANDEURS_SECONDE)] },
    { cle: 'n2', titre: 'Niveau 2 · Première', consigne: null,
      cartes: [...GRANDEURS_PREMIERE.map((g) => carteGrandeur('n2', g)), ...famillesGrandeurs('n2', GRANDEURS_PREMIERE)] },
    { cle: 'n3', titre: 'Niveau 3 · Terminale', consigne: null,
      cartes: [...GRANDEURS_TERMINALE.map((g) => carteGrandeur('n3', g)), ...famillesGrandeurs('n3', GRANDEURS_TERMINALE)] },
    { cle: 'n4', titre: 'Niveau 4 · Unités de base et grandeurs sans unité', consigne: null, cartes: NIVEAU_4_UNITES },
    { cle: 'n5', titre: 'Niveau 5 · Analyse dimensionnelle', consigne: null, cartes: NIVEAU_5_UNITES },
  ],
});
