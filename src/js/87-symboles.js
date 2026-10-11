/* Barre de formules : structures (fractions, racines, vecteurs, sommes…),
 * alphabet grec, fonctions, maths, physique, chimie, LaTeX et mode d'emploi.
 *
 * Comme le ruban d'un tableur : une rangée d'onglets, chacun ouvre son menu.
 * Elle écrit dans le dernier champ de texte touché. Les boutons ne prennent
 * pas le focus (mousedown annulé) : le clavier du téléphone reste ouvert et
 * le curseur ne bouge pas. Les structures s'écrivent « \frac{…}{…} »,
 * « ^{…} »… que rendreFormule() dessine ; un aperçu montre le rendu en direct.
 */

/** Dans un modèle, « ‸ » marque où laisser le curseur (« | » sert à la valeur absolue). */
const CURSEUR = '‸';

/**
 * Chaque entrée : un symbole tel quel, ou [libellé, modèle, titre]. Le libellé
 * est rendu comme une formule : le bouton montre ce qu'il produit.
 */
const MENUS_FORMULES = {
  structures: {
    icone: '\\frac{a}{b}',
    titre: 'Fractions, racines, puissances',
    entrees: [
      ['\\frac{a}{b}', `\\frac{${CURSEUR}}{}`, 'Fraction : le numérateur, puis « case suivante » pour le dénominateur'],
      ['x^{n}', `^{${CURSEUR}}`, 'Exposant, puissance'],
      ['x_{i}', `_{${CURSEUR}}`, 'Indice'],
      ['\\sqrt{x}', `\\sqrt{${CURSEUR}}`, 'Racine carrée'],
      ['\\sqrt[n]{x}', `\\sqrt[${CURSEUR}]{}`, 'Racine n-ième'],
      ['\\bar{AB}', `\\bar{${CURSEUR}}`, 'Barre : longueur algébrique, moyenne'],
      ['\\vec{u}', `\\vec{${CURSEUR}}`, 'Vecteur'],
      ['10^{n}', `10^{${CURSEUR}}`, 'Puissance de dix'],
      ['×10^{n}', ` × 10^{${CURSEUR}}`, 'Notation scientifique'],
      ['\\sum_{i=1}^{n}', `\\sum_{i=1}^{n} ${CURSEUR}`, 'Somme sur i'],
      ['\\prod_{i=1}^{n}', `\\prod_{i=1}^{n} ${CURSEUR}`, 'Produit sur i'],
      ['\\int_{a}^{b}', `\\int_{${CURSEUR}}^{} `, 'Intégrale de a à b'],
      ['\\lim_{x\\to a}', `\\lim_{x\\to ${CURSEUR}} `, 'Limite'],
      ['(…)', `(${CURSEUR})`, 'Parenthèses'],
    ],
  },
  grec: {
    icone: 'αβ',
    titre: 'Alphabet grec',
    entrees: ['α', 'β', 'γ', 'δ', 'ε', 'ζ', 'η', 'θ', 'κ', 'λ', 'μ', 'ν', 'ξ', 'π', 'ρ', 'σ', 'τ', 'υ', 'φ', 'χ', 'ψ', 'ω',
      'Γ', 'Δ', 'Θ', 'Λ', 'Ξ', 'Π', 'Σ', 'Φ', 'Ψ', 'Ω'],
  },
  fonctions: {
    icone: 'f(x)',
    titre: 'Fonctions',
    entrees: [
      ['exp', `exp(${CURSEUR})`, 'Exponentielle'],
      ['e^{x}', `e^{${CURSEUR}}`, 'e puissance'],
      ['ln', `ln(${CURSEUR})`, 'Logarithme népérien'],
      ['log', `log(${CURSEUR})`, 'Logarithme décimal'],
      ['sin', `sin(${CURSEUR})`, 'Sinus'],
      ['cos', `cos(${CURSEUR})`, 'Cosinus'],
      ['tan', `tan(${CURSEUR})`, 'Tangente'],
      ['arcsin', `arcsin(${CURSEUR})`, 'Arc sinus'],
      ['arccos', `arccos(${CURSEUR})`, 'Arc cosinus'],
      ['arctan', `arctan(${CURSEUR})`, 'Arc tangente'],
      ['|x|', `|${CURSEUR}|`, 'Valeur absolue'],
      ['f\'(x)', `f'(${CURSEUR})`, 'Dérivée'],
      ['\\frac{df}{dx}', `\\frac{d${CURSEUR}}{dx}`, 'Dérivée (notation de Leibniz)'],
      ['\\frac{∂f}{∂x}', `\\frac{∂${CURSEUR}}{∂x}`, 'Dérivée partielle'],
      ['n!', '!', 'Factorielle'],
      ['max', `max(${CURSEUR})`, 'Maximum'],
      ['min', `min(${CURSEUR})`, 'Minimum'],
    ],
  },
  maths: {
    icone: '≤±',
    titre: 'Opérateurs et ensembles',
    entrees: ['×', '÷', '·', '±', '≈', '≠', '≡', '≤', '≥', '≪', '≫', '∝', '∞', '→', '⇒', '⇔', '↦', '∈', '∉', '⊂', '∪', '∩',
      '∅', 'ℕ', 'ℤ', 'ℚ', 'ℝ', 'ℂ', '∀', '∃', '∂', '∇', '∫', '∑', '√', '∥', '⊥', '∠', '°', '′', '″', '‰', '½', '⅓', '¼', '¾'],
  },
  physique: {
    icone: 'Δ\\vec{F}',
    titre: 'Notations de physique',
    entrees: [
      ['Δt', 'Δt', 'Durée, variation'],
      ['\\vec{F}', `\\vec{${CURSEUR}}`, 'Vecteur force, vitesse…'],
      ['‖\\vec{v}‖', `‖\\vec{${CURSEUR}}‖`, 'Norme d\'un vecteur'],
      ['\\bar{AB}', `\\bar{${CURSEUR}}`, 'Longueur algébrique'],
      ['v_{0}', '_{0}', 'Indice 0 : valeur initiale'],
      ['E_{c}', 'E_{c}', 'Énergie cinétique'],
      ['E_{pp}', 'E_{pp}', 'Énergie potentielle de pesanteur'],
      ['E_{m}', 'E_{m}', 'Énergie mécanique'],
      ['\\frac{dv}{dt}', `\\frac{d${CURSEUR}}{dt}`, 'Dérivée par rapport au temps'],
      'ℏ', 'μ', 'Ω', '°C', 'Å', 'λ', 'ν', 'ρ', 'η', 'ε_{0}', 'μ_{0}',
      ['m·s^{-1}', 'm·s^{-1}', 'Mètre par seconde'],
      ['m·s^{-2}', 'm·s^{-2}', 'Mètre par seconde carrée'],
      ['kg·m^{-3}', 'kg·m^{-3}', 'Kilogramme par mètre cube'],
      ['N·m', 'N·m', 'Newton-mètre'],
      ['J·K^{-1}', 'J·K^{-1}', 'Joule par kelvin'],
      ['W·m^{-2}', 'W·m^{-2}', 'Watt par mètre carré'],
      ['V·m^{-1}', 'V·m^{-1}', 'Volt par mètre'],
    ],
  },
  chimie: {
    icone: '⇌',
    titre: 'Chimie',
    entrees: [
      '→', '⇌', '⇄', '↑', '↓', '·', '⁺', '⁻', '°',
      ['[X]', `[${CURSEUR}]`, 'Concentration'],
      ['H_{3}O^{+}', 'H_{3}O^{+}', 'Ion oxonium'],
      ['HO^{-}', 'HO^{-}', 'Ion hydroxyde'],
      ['e^{-}', 'e^{-}', 'Électron'],
      ['pK_{a}', 'pK_{a}', 'pKa'],
      ['K_{e}', 'K_{e}', 'Produit ionique de l\'eau'],
      ['Δ_{r}H', 'Δ_{r}H', 'Enthalpie de réaction'],
      ['mol·L^{-1}', 'mol·L^{-1}', 'Mole par litre'],
      ['g·mol^{-1}', 'g·mol^{-1}', 'Gramme par mole'],
      ['g·L^{-1}', 'g·L^{-1}', 'Gramme par litre'],
      ['S·m^{2}·mol^{-1}', 'S·m^{2}·mol^{-1}', 'Conductivité molaire ionique'],
      ['$\\ce{H2O}$', `$\\ce{${CURSEUR}}$`, 'Formule chimique en LaTeX (mhchem)'],
      ['$\\ce{A -> B}$', `$\\ce{${CURSEUR} -> }$`, 'Équation de réaction'],
      ['$\\ce{A <=> B}$', `$\\ce{${CURSEUR} <=> }$`, 'Équilibre chimique'],
    ],
  },
  latex: {
    icone: '$\\LaTeX$',
    titre: 'LaTeX : tout ce que KaTeX sait dessiner',
    entrees: [
      ['$x$', `$${CURSEUR}$`, 'Formule LaTeX dans la phrase : tape entre les deux $'],
      ['$$ ↵', `$$${CURSEUR}$$`, 'Formule LaTeX centrée, sur sa propre ligne'],
      ['$\\dfrac{a}{b}$', `\\dfrac{${CURSEUR}}{}`, 'Grande fraction'],
      ['$\\left(\\frac{a}{b}\\right)$', `\\left( ${CURSEUR} \\right)`, 'Parenthèses qui s’adaptent à la hauteur'],
      ['$\\left[\\frac{a}{b}\\right]$', `\\left[ ${CURSEUR} \\right]`, 'Crochets qui s’adaptent'],
      ['$\\overrightarrow{AB}$', `\\overrightarrow{${CURSEUR}}`, 'Vecteur sur plusieurs lettres'],
      ['$\\overline{AB}$', `\\overline{${CURSEUR}}`, 'Barre longue'],
      ['$\\hat{x}$', `\\hat{${CURSEUR}}`, 'Chapeau'],
      ['$\\dot{x}$', `\\dot{${CURSEUR}}`, 'Point : dérivée par rapport au temps'],
      ['$\\ddot{x}$', `\\ddot{${CURSEUR}}`, 'Deux points : dérivée seconde'],
      ['$\\text{abc}$', `\\text{${CURSEUR}}`, 'Texte normal dans une formule'],
      ['$\\mathrm{d}x$', `\\mathrm{d}${CURSEUR}`, 'd droit (différentielle)'],
      ['$\\xrightarrow{h\\nu}$', `\\xrightarrow{${CURSEUR}}`, 'Flèche avec texte au-dessus'],
      ['$\\underbrace{a+b}_{n}$', `\\underbrace{${CURSEUR}}_{}`, 'Accolade sous une expression'],
      ['$\\begin{pmatrix}a&b\\\\c&d\\end{pmatrix}$', `\\begin{pmatrix} ${CURSEUR} &  \\\\  &  \\end{pmatrix}`, 'Matrice 2×2'],
      ['$\\begin{cases}a\\\\b\\end{cases}$', `\\begin{cases} ${CURSEUR} & \\text{si }  \\\\  & \\text{sinon} \\end{cases}`, 'Accolade de cas'],
      ['$\\iint$', '\\iint ', 'Intégrale double'],
      ['$\\oint$', '\\oint ', 'Intégrale sur un contour'],
      ['$\\Longrightarrow$', '\\Longrightarrow ', 'Implique'],
      ['$\\cdots$', '\\cdots ', 'Points de suspension centrés'],
    ],
  },
  aide: {
    icone: '? Aide',
    titre: 'Mode d’emploi des formules',
    tuto: true,
  },
};

/** Exemples du mode d'emploi : [ce qu'on tape, explication]. Un toucher insère l'exemple. */
const TUTO_FORMULES = {
  'Notation simplifiée : tape directement': [
    ['H2O, CH3-CH2-OH', 'les chiffres après une lettre descendent tout seuls'],
    ['x^2, 10^{-3}', '^ : exposant ; les accolades pour plusieurs caractères'],
    ['v_0, E_{c}', '_ : indice'],
    ['\\frac{m}{V}', 'fraction : le haut, puis le bas'],
    ['\\sqrt{2gh}', 'racine carrée'],
    ['\\vec{F}, \\bar{AB}', 'vecteur, longueur algébrique'],
    ['\\sum_{i=1}^{n} x_i', 'somme sur i'],
    ['\\alpha, \\Delta, \\to', 'les lettres grecques et symboles par leur nom'],
  ],
  'LaTeX : entre deux $': [
    ['$\\frac{1}{2}mv^2$', 'tout le LaTeX des maths'],
    ['$\\left(\\frac{a}{b}\\right)^2$', 'parenthèses qui grandissent'],
    ['$\\overrightarrow{AB}$', 'vecteur sur deux lettres'],
    ['$\\ce{CH4 + 2O2 -> CO2 + 2H2O}$', '\\ce{…} : la chimie (mhchem)'],
    ['$\\ce{CH3COOH <=> CH3COO- + H+}$', 'équilibre, ions'],
    ['$\\int_0^T v(t)\\,\\mathrm{d}t$', 'intégrale'],
    ['$\\lim_{x \\to +\\infty} e^{-x} = 0$', 'limite'],
    ['$$E = mc^2$$', 'deux $ de chaque côté : formule centrée'],
  ],
};

function tutoFormules(inserer) {
  return el('div', { class: 'tuto-formules pile serree' },
    el('p', { class: 'discret petit', text: 'Tape directement dans le champ, ou utilise les menus. '
      + 'Le rendu s’affiche au-dessus des menus. Une faute en LaTeX apparaît en rouge : vérifie les accolades. '
      + 'Touche un exemple pour l’insérer.' }),
    ...Object.entries(TUTO_FORMULES).flatMap(([titre, exemples]) => [
      el('strong', { class: 'petit', text: titre }),
      ...exemples.map(([code, explication]) => el('button', {
        type: 'button',
        class: 'tuto-ligne',
        onmousedown: (e) => e.preventDefault(),
        onclick: () => inserer(code),
      },
      el('code', { text: code }),
      el('span', { class: 'tuto-rendu' }, formuleChimique(code)),
      el('span', { class: 'discret petit', text: explication }))),
    ]),
    el('p', { class: 'discret petit', text: 'Pour écrire un vrai symbole dollar : \\$.' }));
}

/** Ajoute du texte à la place de la sélection ; « ‸ » marque où laisser le curseur. */
function insererDansChamp(champ, modele) {
  if (!champ) return;
  const [avant, apres = ''] = modele.split(CURSEUR);
  const debut = champ.selectionStart ?? champ.value.length;
  const fin = champ.selectionEnd ?? champ.value.length;
  const selection = champ.value.slice(debut, fin);
  champ.setRangeText(avant + selection + apres, debut, fin, 'end');
  const curseur = debut + avant.length + selection.length;
  if (apres) champ.setSelectionRange(curseur, curseur);
  champ.dispatchEvent(new Event('input', { bubbles: true }));
  champ.focus();
}

/** Place le curseur dans la case vide suivante : du numérateur au dénominateur, etc. */
function caseSuivante(champ) {
  if (!champ) return;
  const depuis = champ.selectionEnd ?? 0;
  const ouvrante = champ.value.indexOf('{', depuis);
  const fermante = champ.value.indexOf('}', depuis);
  let position;
  // « }{ » ou « }^{ » : la case voisine de la même structure ; sinon on sort.
  if (ouvrante !== -1 && (fermante === -1 || ouvrante <= fermante + 2)) position = ouvrante + 1;
  else if (fermante !== -1) position = fermante + 1;
  else position = champ.value.length;
  champ.setSelectionRange(position, position);
  champ.focus();
}

/**
 * zone : élément dont les champs reçoivent les symboles. Le dernier champ
 * touché à l'intérieur est retenu ; à défaut, le premier.
 * collante : la barre reste en bas de l'écran pendant qu'on écrit au-dessus.
 */
function barreSymboles(zone, { compacte = false, collante = false } = {}) {
  let cible = null;
  const apercu = el('div', { class: 'formule-apercu', 'aria-live': 'polite', hidden: true });
  // L'éditeur redessine ses champs : un champ retenu peut avoir disparu.
  const champ = () => (cible && cible.isConnected ? cible : zone.querySelector('textarea, input[type=text]'));
  const majApercu = () => {
    const c = champ();
    const texte = c ? c.value : '';
    apercu.hidden = !contientMiseEnForme(texte);
    if (!apercu.hidden) apercu.replaceChildren(el('span', { class: 'discret petit', text: 'Rendu : ' }), formuleChimique(texte));
  };
  // Le focus seul ne suffit pas (certains navigateurs ne le signalent pas) :
  // un toucher ou une frappe dans un champ le désigne aussi.
  const retenir = (e) => {
    if (e.target.matches && e.target.matches('textarea, input[type=text]')) {
      cible = e.target;
      majApercu();
    }
  };
  for (const evenement of ['focusin', 'pointerdown', 'input', 'keyup']) zone.addEventListener(evenement, retenir);

  const bouton = (libelle, modele, titre, classe = 'symbole') => el('button', {
    type: 'button',
    class: classe,
    title: titre || libelle,
    'aria-label': titre || libelle,
    onmousedown: (e) => e.preventDefault(),
    onclick: () => insererDansChamp(champ(), modele),
  }, formuleChimique(libelle));

  const menu = el('div', { class: 'symboles-liste', hidden: true });
  let ouvert = null;
  const onglets = el('div', { class: 'symboles-onglets', role: 'group', 'aria-label': 'Menus de formules' });
  const dessiner = () => {
    menu.hidden = !ouvert;
    if (ouvert && MENUS_FORMULES[ouvert].tuto) {
      menu.replaceChildren(tutoFormules((code) => insererDansChamp(champ(), code)));
    } else if (ouvert) {
      menu.replaceChildren(...MENUS_FORMULES[ouvert].entrees.map((e) => (Array.isArray(e) ? bouton(...e) : bouton(e, e))));
    }
    for (const b of onglets.querySelectorAll('[data-onglet]')) b.setAttribute('aria-pressed', String(b.dataset.onglet === ouvert));
  };
  for (const [cle, { icone, titre }] of Object.entries(MENUS_FORMULES)) {
    onglets.append(el('button', {
      type: 'button',
      class: 'symbole-onglet',
      'data-onglet': cle,
      title: titre,
      'aria-label': titre,
      onmousedown: (e) => e.preventDefault(),
      onclick: () => {
        ouvert = ouvert === cle ? null : cle;
        dessiner();
      },
    }, formuleChimique(icone)));
  }
  onglets.append(
    bouton('x^{2}', `^{${CURSEUR}}`, 'Exposant : ce que tu tapes entre les accolades monte', 'symbole raccourci'),
    bouton('x_{2}', `_{${CURSEUR}}`, 'Indice : ce que tu tapes entre les accolades descend', 'symbole raccourci'),
    el('button', {
      type: 'button',
      class: 'symbole raccourci',
      title: 'Case suivante : passer au dénominateur, sortir des accolades',
      'aria-label': 'Case suivante',
      onmousedown: (e) => e.preventDefault(),
      onclick: () => caseSuivante(champ()),
    }, '⇥'));
  dessiner();

  const barre = el('div', { class: `barre-symboles${compacte ? ' compacte' : ''}${collante ? ' collante' : ''}` },
    apercu, menu, onglets);
  if (!compacte) return barre;
  // En révision, la barre reste repliée : elle ne doit pas cacher la carte.
  return el('details', { class: 'symboles-repliables' }, el('summary', { text: 'Ω  Symboles et formules' }), barre);
}
