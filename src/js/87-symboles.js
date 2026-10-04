/* Barre de symboles : alphabet grec, maths, chimie, indices et exposants.
 *
 * Elle écrit dans le dernier champ de texte touché. Les boutons ne prennent
 * pas le focus (mousedown annulé) : le clavier du téléphone reste ouvert et
 * le curseur ne bouge pas. Indices et exposants s'écrivent « _{…} » et
 * « ^{…} », que formuleChimique() met en forme à l'affichage.
 */

const SYMBOLES = {
  'α β γ': ['α', 'β', 'γ', 'δ', 'ε', 'ζ', 'η', 'θ', 'λ', 'μ', 'ν', 'ξ', 'π', 'ρ', 'σ', 'τ', 'φ', 'χ', 'ψ', 'ω',
    'Γ', 'Δ', 'Θ', 'Λ', 'Π', 'Σ', 'Φ', 'Ψ', 'Ω'],
  'Maths': ['×', '÷', '±', '≈', '≠', '≤', '≥', '√', '∞', '°', '·', '∝', '∑', '∫', '∂', '→', '⇒', '⇔', '∈', '½', '‰'],
  'Chimie': ['→', '⇌', '⇄', '↑', '↓', '·', '⁺', '⁻', '°C', 'Å', 'ℓ', 'mol·L⁻¹', 'g·mol⁻¹', 'e⁻'],
};

/** Ajoute du texte à la place de la sélection ; « | » marque où laisser le curseur. */
function insererDansChamp(champ, modele) {
  if (!champ) return;
  const [avant, apres = ''] = modele.split('|');
  const debut = champ.selectionStart ?? champ.value.length;
  const fin = champ.selectionEnd ?? champ.value.length;
  const selection = champ.value.slice(debut, fin);
  champ.setRangeText(avant + selection + apres, debut, fin, 'end');
  const curseur = debut + avant.length + selection.length;
  if (apres) champ.setSelectionRange(curseur, curseur);
  champ.dispatchEvent(new Event('input', { bubbles: true }));
  champ.focus();
}

/**
 * zone : élément dont les champs reçoivent les symboles. Le dernier champ
 * touché à l'intérieur est retenu ; à défaut, le premier.
 */
function barreSymboles(zone, { compacte = false } = {}) {
  let cible = null;
  // Le focus seul ne suffit pas (certains navigateurs ne le signalent pas) :
  // un toucher ou une frappe dans un champ le désigne aussi.
  const retenir = (e) => {
    if (e.target.matches && e.target.matches('textarea, input[type=text]')) cible = e.target;
  };
  for (const evenement of ['focusin', 'pointerdown', 'input', 'keyup']) zone.addEventListener(evenement, retenir);
  // L'éditeur redessine ses champs : un champ retenu peut avoir disparu.
  const champ = () => (cible && cible.isConnected ? cible : zone.querySelector('textarea, input[type=text]'));

  const bouton = (libelle, modele, titre) => el('button', {
    type: 'button',
    class: 'symbole',
    title: titre || libelle,
    onmousedown: (e) => e.preventDefault(),
    onclick: () => insererDansChamp(champ(), modele),
  }, libelle);

  const contenu = el('div', { class: 'symboles-liste' });
  const onglets = Object.keys(SYMBOLES);
  let actif = onglets[0];
  const dessiner = () => {
    contenu.replaceChildren(...SYMBOLES[actif].map((s) => bouton(s, s)));
    for (const b of barreOnglets.children) b.setAttribute('aria-pressed', String(b.dataset.onglet === actif));
  };
  const barreOnglets = el('div', { class: 'symboles-onglets', role: 'group', 'aria-label': 'Familles de symboles' },
    ...onglets.map((nom) => el('button', {
      type: 'button',
      class: 'symbole-onglet',
      'data-onglet': nom,
      onmousedown: (e) => e.preventDefault(),
      onclick: () => {
        actif = nom;
        dessiner();
      },
    }, nom)),
    bouton('x²', '^{|}', 'Exposant : ce que tu tapes entre les accolades monte'),
    bouton('x₂', '_{|}', 'Indice : ce que tu tapes entre les accolades descend'));
  dessiner();

  const barre = el('div', { class: `barre-symboles${compacte ? ' compacte' : ''}` }, barreOnglets, contenu);
  if (!compacte) return barre;
  // En révision, la barre reste repliée : elle ne doit pas cacher la carte.
  return el('details', { class: 'symboles-repliables' }, el('summary', { text: 'Ω  Symboles' }), barre);
}
