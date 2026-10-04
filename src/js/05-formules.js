/* Formules chimiques et comparaison des réponses écrites.
 *
 * Les paquets écrivent les formules en texte simple (« CH3-CH2-OH »,
 * « SO4^2- ») ; l'affichage est reconstruit ici avec indices et exposants,
 * sans bibliothèque et sans requête réseau.
 */

/**
 * Un chiffre qui suit une lettre ou une parenthèse fermante est un indice
 * (CH3) ; en tête de mot il reste normal (2-méthylbutane). Après « ^ »,
 * la suite de chiffres et de signes passe en exposant (SO4^2-).
 *
 * Pour les cartes écrites par les élèves : « ^{…} » et « _{…} » mettent
 * n'importe quel texte en exposant ou en indice (10^{-3}, C_{m}), et « _ »
 * seul met en indice le mot qui suit (v_0, E_c). La barre de symboles de
 * l'éditeur insère ces marques.
 */
function formuleChimique(texte, classe = 'formule') {
  const noeud = el('span', { class: classe });
  let tampon = '';
  const vider = () => {
    if (tampon) noeud.append(tampon);
    tampon = '';
  };
  /** Contenu d'un groupe « {…} » commençant en position i, ou null. */
  const groupe = (i) => {
    if (texte[i] !== '{') return null;
    const fin = texte.indexOf('}', i + 1);
    return fin === -1 ? null : { contenu: texte.slice(i + 1, fin), fin: fin + 1 };
  };
  for (let i = 0; i < texte.length; i += 1) {
    const caractere = texte[i];
    if (caractere === '^' || caractere === '_') {
      const balise = caractere === '^' ? 'sup' : 'sub';
      const g = groupe(i + 1);
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
      noeud.append(el(balise, { text: contenu.replace(/-/g, '−') }));
      i = fin - 1;
    } else if (/\d/.test(caractere) && i > 0 && /[A-Za-z)\]]/.test(texte[i - 1])) {
      let fin = i;
      while (fin < texte.length && /\d/.test(texte[fin])) fin += 1;
      vider();
      noeud.append(el('sub', { text: texte.slice(i, fin) }));
      i = fin - 1;
    } else {
      tampon += caractere;
    }
  }
  vider();
  return noeud;
}

/**
 * Ne garde que lettres et chiffres, sans accents ni casse : « acide éthanoïque »,
 * « Acide ethanoique » et « acide-ethanoique » sont la même réponse. Les noms de
 * la nomenclature ne portent aucun sens dans leurs tirets ou leurs espaces, alors
 * que les chiffres (propan-1-ol / propan-2-ol) restent distinctifs.
 */
function normaliserReponse(texte) {
  return String(texte ?? '')
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
