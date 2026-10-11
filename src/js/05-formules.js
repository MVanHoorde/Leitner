/* Formules et comparaison des réponses écrites.
 *
 * Les paquets écrivent les formules en texte simple (« CH3-CH2-OH »,
 * « SO4^2- », « \frac{m}{V} ») ; l'affichage est reconstruit ici en HTML et
 * CSS, sans requête réseau. Cette notation simplifiée couvre l'essentiel et
 * reste lisible même tapée à la main. Pour tout le reste, le LaTeX entre
 * « $…$ » passe par KaTeX, embarqué dans le fichier (vendor/katex).
 */

/** Commandes qui ne donnent qu'un caractère : « \alpha », « \to »… */
const COMMANDES_SYMBOLES = {
  alpha: 'α', beta: 'β', gamma: 'γ', delta: 'δ', epsilon: 'ε', varepsilon: 'ε', zeta: 'ζ', eta: 'η',
  theta: 'θ', lambda: 'λ', mu: 'μ', nu: 'ν', xi: 'ξ', pi: 'π', rho: 'ρ', sigma: 'σ', tau: 'τ',
  phi: 'φ', varphi: 'φ', chi: 'χ', psi: 'ψ', omega: 'ω',
  Gamma: 'Γ', Delta: 'Δ', Theta: 'Θ', Lambda: 'Λ', Pi: 'Π', Sigma: 'Σ', Phi: 'Φ', Psi: 'Ψ', Omega: 'Ω',
  times: '×', div: '÷', cdot: '·', pm: '±', approx: '≈', neq: '≠', leq: '≤', geq: '≥', le: '≤', ge: '≥',
  infty: '∞', to: '→', partial: '∂', nabla: '∇', hbar: 'ℏ', propto: '∝', in: '∈', equiv: '≡',
};

/**
 * LaTeX complet entre « $…$ » (« $$…$$ » : formule centrée), dessiné par
 * KaTeX, embarqué avec son extension de chimie mhchem (\ce{…}). Une faute de
 * frappe ne casse rien : KaTeX affiche alors la source en rouge.
 */
function formuleLatex(source, centree) {
  const noeud = el('span', { class: `latex${centree ? ' latex-centree' : ''}` });
  if (typeof katex === 'undefined') {
    noeud.textContent = source;
    return noeud;
  }
  try {
    katex.render(source, noeud, {
      displayMode: centree,
      throwOnError: false,
      // Les élèves écrivent ce qu'ils veulent : ni liens, ni HTML, ni macros persistantes.
      trust: false,
      strict: 'ignore',
      maxExpand: 500,
      maxSize: 20,
    });
  } catch {
    noeud.textContent = source;
  }
  return noeud;
}

/** Fin d'un « $…$ » ou « $$…$$ » ouvert en i, ou null s'il n'est pas refermé. */
function lireLatex(texte, i) {
  const centree = texte[i + 1] === '$';
  const delimiteur = centree ? '$$' : '$';
  let j = i + delimiteur.length;
  while (j < texte.length) {
    if (texte[j] === '\\') j += 2;
    else if (texte.startsWith(delimiteur, j)) {
      const source = texte.slice(i + delimiteur.length, j);
      return source.trim() ? { source, centree, fin: j + delimiteur.length } : null;
    } else j += 1;
  }
  return null;
}

/** Grands opérateurs : bornes dessus-dessous, sauf l'intégrale qui les porte à droite. */
const GRANDS_OPERATEURS = { sum: '∑', prod: '∏', int: '∫', oint: '∮', lim: 'lim' };

/**
 * Groupe « {…} » commençant en position i, accolades imbriquées comprises,
 * ou null s'il n'est pas refermé (texte tronqué : il reste affiché tel quel).
 */
function lireGroupe(texte, i) {
  if (texte[i] !== '{') return null;
  let profondeur = 0;
  for (let j = i; j < texte.length; j += 1) {
    if (texte[j] === '{') profondeur += 1;
    else if (texte[j] === '}') {
      profondeur -= 1;
      if (!profondeur) return { contenu: texte.slice(i + 1, j), fin: j + 1 };
    }
  }
  return null;
}

/** Argument d'une commande : un groupe, ou à défaut un seul caractère (\frac12). */
function lireArgument(texte, i) {
  while (texte[i] === ' ') i += 1;
  if (texte[i] === '{') return lireGroupe(texte, i);
  if (i < texte.length && !/[\\}^_]/.test(texte[i])) return { contenu: texte[i], fin: i + 1 };
  return null;
}

/** Bornes « _{…} » et « ^{…} » d'un grand opérateur, dans un ordre quelconque. */
function lireBornes(texte, i) {
  const bornes = { bas: null, haut: null, fin: i };
  for (let tour = 0; tour < 2; tour += 1) {
    let j = bornes.fin;
    while (texte[j] === ' ') j += 1;
    const cle = texte[j] === '_' ? 'bas' : texte[j] === '^' ? 'haut' : null;
    if (!cle || bornes[cle] !== null) break;
    const argument = lireArgument(texte, j + 1);
    if (!argument) break;
    bornes[cle] = argument.contenu;
    bornes.fin = argument.fin;
  }
  return bornes;
}

/** Trait du radical, étiré à la hauteur de ce qu'il couvre. */
function signeRacine() {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 40 100');
  svg.setAttribute('preserveAspectRatio', 'none');
  svg.setAttribute('class', 'racine-signe');
  svg.setAttribute('aria-hidden', 'true');
  const trace = document.createElementNS(ns, 'path');
  trace.setAttribute('d', 'M0 62 L9 56 L20 97 L38 2 L40 2');
  trace.setAttribute('vector-effect', 'non-scaling-stroke');
  svg.append(trace);
  return svg;
}

/**
 * \frac{a}{b}, \sqrt{x}, \sqrt[n]{x}, \bar{AB}, \vec{u}, \sum_{i=1}^{n}…
 * Renvoie { noeud, fin }, ou null si la commande est incomplète.
 */
function structureFormule(nom, texte, i) {
  const span = (classe, ...enfants) => el('span', { class: classe }, ...enfants);
  if (nom === 'frac') {
    const haut = lireArgument(texte, i);
    const bas = haut && lireArgument(texte, haut.fin);
    if (!bas) return null;
    return { noeud: span('frac', span('frac-haut', rendreFormule(haut.contenu)), span('frac-bas', rendreFormule(bas.contenu))), fin: bas.fin };
  }
  if (nom === 'sqrt') {
    let indice = null;
    let j = i;
    if (texte[j] === '[') {
      const ferme = texte.indexOf(']', j);
      if (ferme === -1) return null;
      indice = texte.slice(j + 1, ferme);
      j = ferme + 1;
    }
    const argument = lireArgument(texte, j);
    if (!argument) return null;
    return {
      noeud: span('racine', indice && span('racine-indice', rendreFormule(indice)), signeRacine(),
        span('racine-sous', rendreFormule(argument.contenu))),
      fin: argument.fin,
    };
  }
  if (nom === 'bar' || nom === 'overline' || nom === 'vec') {
    const argument = lireArgument(texte, i);
    if (!argument) return null;
    return { noeud: span(nom === 'vec' ? 'vecteur' : 'barre', rendreFormule(argument.contenu)), fin: argument.fin };
  }
  if (GRANDS_OPERATEURS[nom]) {
    const { bas, haut, fin } = lireBornes(texte, i);
    const signe = GRANDS_OPERATEURS[nom];
    const borne = (contenu) => contenu !== null && span('borne', rendreFormule(contenu));
    if (nom === 'int' || nom === 'oint') {
      return { noeud: span('integrale', span('integrale-signe', signe),
        (bas !== null || haut !== null) && span('integrale-bornes', borne(haut) || span('borne', ''), borne(bas) || span('borne', ''))), fin };
    }
    return { noeud: span(`grand-op${nom === 'lim' ? ' lim' : ''}`, borne(haut), span('grand-op-signe', signe), borne(bas)), fin };
  }
  return null;
}

/**
 * Un chiffre qui suit une lettre ou une parenthèse fermante est un indice
 * (CH3) ; en tête de mot il reste normal (2-méthylbutane). Après « ^ »,
 * la suite de chiffres et de signes passe en exposant (SO4^2-).
 *
 * Pour les cartes écrites par les élèves : « ^{…} » et « _{…} » mettent
 * n'importe quel texte en exposant ou en indice (10^{-3}, C_{m}), et « _ »
 * seul met en indice le mot qui suit (v_0, E_c). Les commandes à barre
 * oblique (\frac, \sqrt, \vec, \sum…) dessinent le reste. La barre de
 * symboles de l'éditeur insère toutes ces marques.
 *
 * Renvoie une liste de nœuds et de textes ; chaque groupe est rendu de la
 * même façon, si bien qu'une fraction peut loger sous une racine.
 */
function rendreFormule(texte) {
  const sortie = [];
  let tampon = '';
  const vider = () => {
    if (tampon) sortie.push(tampon);
    tampon = '';
  };
  for (let i = 0; i < texte.length; i += 1) {
    const caractere = texte[i];
    const latex = caractere === '$' && lireLatex(texte, i);
    if (latex) {
      vider();
      sortie.push(formuleLatex(latex.source, latex.centree));
      i = latex.fin - 1;
    } else if (caractere === '\\' && texte[i + 1] === '$') {
      // « \$ » : un dollar ordinaire.
      tampon += '$';
      i += 1;
    } else if (caractere === '\\') {
      const nom = (/^[A-Za-z]+/.exec(texte.slice(i + 1)) || [''])[0];
      const structure = nom && structureFormule(nom, texte, i + 1 + nom.length);
      if (structure) {
        vider();
        sortie.push(structure.noeud);
        i = structure.fin - 1;
      } else if (COMMANDES_SYMBOLES[nom]) {
        tampon += COMMANDES_SYMBOLES[nom];
        i += nom.length;
      } else {
        tampon += caractere;
      }
    } else if (caractere === '^' || caractere === '_') {
      const balise = caractere === '^' ? 'sup' : 'sub';
      const g = lireGroupe(texte, i + 1);
      let contenu;
      let fin;
      if (g) {
        ({ contenu, fin } = g);
      } else {
        fin = i + 1;
        const motif = caractere === '^' ? /[0-9+−-]/ : /[0-9A-Za-zÀ-ÿͰ-Ͽ]/;
        while (fin < texte.length && motif.test(texte[fin])) fin += 1;
        // x^n : une lettre seule passe aussi en exposant.
        if (fin === i + 1 && caractere === '^' && /[A-Za-zͰ-Ͽ]/.test(texte[fin] || '')) fin += 1;
        contenu = texte.slice(i + 1, fin);
      }
      if (!contenu) {
        tampon += caractere;
        continue;
      }
      vider();
      // Le tiret d'un exposant est un signe moins ; une commande n'en contient jamais.
      sortie.push(el(balise, {}, rendreFormule(contenu.replace(/-/g, '−'))));
      i = fin - 1;
    } else if (/\d/.test(caractere) && i > 0 && /[A-Za-z)\]]/.test(texte[i - 1])) {
      let fin = i;
      while (fin < texte.length && /\d/.test(texte[fin])) fin += 1;
      vider();
      sortie.push(el('sub', { text: texte.slice(i, fin) }));
      i = fin - 1;
    } else {
      tampon += caractere;
    }
  }
  vider();
  return sortie;
}

function formuleChimique(texte, classe = 'formule') {
  return el('span', { class: classe }, rendreFormule(texte));
}

/** Vrai si le texte porte une mise en forme que l'élève ne voit pas en tapant. */
function contientMiseEnForme(texte) {
  return /[\\^_$]/.test(String(texte ?? ''));
}

/**
 * Ne garde que lettres et chiffres, sans accents ni casse : « acide éthanoïque »,
 * « Acide ethanoique » et « acide-ethanoique » sont la même réponse. Les noms de
 * la nomenclature ne portent aucun sens dans leurs tirets ou leurs espaces, alors
 * que les chiffres (propan-1-ol / propan-2-ol) restent distinctifs.
 */
function normaliserReponse(texte) {
  return String(texte ?? '')
    // « \alpha » vaut « α » ; « \frac{1}{2} » se compare comme « 1/2 ».
    .replace(/\\([A-Za-z]+)/g, (tout, nom) => COMMANDES_SYMBOLES[nom] || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    // Les lettres grecques comptent : « ρ » est une réponse, pas un blanc.
    .replace(/[^a-z0-9Ͱ-Ͽ]/g, '');
}

/** Vrai si la saisie correspond à l'une des formulations acceptées. */
function reponseAcceptee(saisie, acceptees) {
  const propre = normaliserReponse(saisie);
  if (!propre) return false;
  return acceptees.some((attendue) => normaliserReponse(attendue) === propre);
}

/**
 * Lit un nombre écrit à la française : virgule décimale, espaces d'affichage,
 * puissances de dix notées « e-3 », « ×10^-3 » ou « 10^-3 ».
 */
function nombreSaisi(texte) {
  let propre = String(texte ?? '')
    .trim()
    .toLowerCase()
    .replace(/\s/g, '')
    .replace(/−/g, '-')
    .replace(/,/g, '.')
    // « ×10 » et « 10^ » marquent une puissance de dix ; « 100 » reste un nombre.
    .replace(/[x×*]10\^?/g, 'e')
    .replace(/10\^/g, 'e')
    .replace(/\^/g, '');
  if (propre.startsWith('e')) propre = `1${propre}`;
  if (!/^[-+]?(\d+\.?\d*|\.\d+)(e[-+]?\d+)?$/.test(propre)) return null;
  const valeur = Number(propre);
  return Number.isFinite(valeur) ? valeur : null;
}

/** Égalité numérique tolérante : la saisie peut être arrondie à la marge. */
function memeNombre(saisi, attendu) {
  if (saisi === null) return false;
  return Math.abs(saisi - attendu) <= Math.max(Math.abs(attendu) * 1e-6, 1e-12);
}

/** Écriture française d'un nombre, sans notation scientifique parasite. */
function ecrireNombre(valeur) {
  if (valeur !== 0 && (Math.abs(valeur) < 1e-4 || Math.abs(valeur) >= 1e6)) {
    const exposant = Math.floor(Math.log10(Math.abs(valeur)));
    const mantisse = valeur / 10 ** exposant;
    return `${mantisse.toLocaleString('fr-FR', { maximumFractionDigits: 4 })} × 10^${exposant}`;
  }
  return valeur.toLocaleString('fr-FR', { maximumFractionDigits: 10 });
}
