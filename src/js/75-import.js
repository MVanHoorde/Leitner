/* Import d'un trombinoscope PDF : lecture, découpage, appariement, vérification.
 *
 * Seuls nom, prénom, classe et photo sortent de ce module. Les lignes de texte
 * brutes (dates de naissance, téléphones, entreprises…) ne servent qu'à
 * l'analyse, restent en mémoire le temps de l'import et ne sont jamais écrites.
 */

const TAILLE_PHOTO = 400;
const QUALITE_JPEG = 0.8;
const PIXELS_MAX_RENDU = 12e6;
const LARGEUR_APERCU = 1400;

let promessePdfJs = null;

/** pdf.js est embarqué dans la page sous forme de texte, chargé à la demande via des URL blob. */
function chargerPdfJs() {
  if (!promessePdfJs) {
    promessePdfJs = (async () => {
      const urlBlob = (id) => URL.createObjectURL(
        new Blob([document.getElementById(id).textContent], { type: 'text/javascript' }));
      const pdfjs = await import(urlBlob('pdfjs-bibliotheque'));
      pdfjs.GlobalWorkerOptions.workerPort = new Worker(urlBlob('pdfjs-worker'), { type: 'module' });
      return pdfjs;
    })();
    promessePdfJs.catch(() => { promessePdfJs = null; });
  }
  return promessePdfJs;
}

const Import = {
  etat: null,
  reinitialiser() {
    if (this.etat) {
      for (const page of this.etat.pages) if (page.apercu) page.apercu.width = 0;
      if (this.etat.doc) this.etat.doc.destroy();
    }
    this.etat = null;
  },
};

/* ---------- Géométrie ---------- */

function mediane(valeurs) {
  const triees = [...valeurs].sort((a, b) => a - b);
  return triees.length ? triees[Math.floor(triees.length / 2)] : 0;
}

function borner(valeur, min, max) {
  return Math.min(max, Math.max(min, valeur));
}

/** Regroupe des éléments dont la clé est proche (rangées, colonnes). */
function regrouper(elements, cle, tolerance) {
  const groupes = [];
  for (const element of [...elements].sort((a, b) => cle(a) - cle(b))) {
    const dernier = groupes[groupes.length - 1];
    if (dernier && cle(element) - dernier.reference <= tolerance) dernier.elements.push(element);
    else groupes.push({ reference: cle(element), elements: [element] });
  }
  return groupes.map((g) => g.elements);
}

/** Rectangles (en points, origine en haut à gauche) des images dessinées sur la page. */
function positionsImages(pdfjs, operateurs, vue) {
  const { OPS, Util } = pdfjs;
  const identite = [1, 0, 0, 1, 0, 0];
  let ctm = identite;
  const pile = [];
  const rectangles = [];

  const ajouter = (matrice) => {
    const m = Util.transform(vue.transform, matrice);
    const coins = [[0, 0], [1, 0], [0, 1], [1, 1]].map((p) => Util.applyTransform(p, m));
    const xs = coins.map((c) => c[0]);
    const ys = coins.map((c) => c[1]);
    rectangles.push({ x0: Math.min(...xs), y0: Math.min(...ys), x1: Math.max(...xs), y1: Math.max(...ys) });
  };

  for (let i = 0; i < operateurs.fnArray.length; i++) {
    const args = operateurs.argsArray[i];
    switch (operateurs.fnArray[i]) {
      case OPS.save:
        pile.push(ctm);
        break;
      case OPS.restore:
        ctm = pile.pop() || identite;
        break;
      case OPS.transform:
        ctm = Util.transform(ctm, args);
        break;
      case OPS.paintFormXObjectBegin:
        pile.push(ctm);
        if (args[0]) ctm = Util.transform(ctm, args[0]);
        break;
      case OPS.beginGroup:
        pile.push(ctm);
        if (args[0] && args[0].matrix) ctm = Util.transform(ctm, args[0].matrix);
        break;
      case OPS.paintFormXObjectEnd:
      case OPS.endGroup:
        ctm = pile.pop() || identite;
        break;
      case OPS.paintImageXObject:
      case OPS.paintInlineImageXObject:
        ajouter(ctm);
        break;
      case OPS.paintImageXObjectRepeat: {
        const [, echelleX, echelleY, positions] = args;
        for (let k = 0; k < positions.length; k += 2) {
          ajouter(Util.transform(ctm, [echelleX, 0, 0, echelleY, positions[k], positions[k + 1]]));
        }
        break;
      }
      case OPS.paintInlineImageXObjectGroup:
        for (const entree of args[1]) ajouter(Util.transform(ctm, entree.transform));
        break;
      default:
    }
  }
  return rectangles;
}

function blocsTexte(pdfjs, contenu, vue) {
  return contenu.items
    .filter((item) => typeof item.str === 'string' && item.str.trim())
    .map((item) => {
      const t = pdfjs.Util.transform(vue.transform, item.transform);
      const hauteur = Math.hypot(t[2], t[3]) || 8;
      const largeur = item.width * vue.scale;
      const x = t[4];
      const base = t[5];
      return {
        str: item.str, x0: x, x1: x + largeur, y0: base - hauteur, y1: base,
        cx: x + largeur / 2, cy: base - hauteur / 2, h: hauteur,
      };
    });
}

/** Assemble des fragments de texte en lignes, en coupant sur les grands écarts horizontaux. */
function assemblerLignes(blocs) {
  const rangs = [];
  for (const bloc of [...blocs].sort((a, b) => a.y1 - b.y1)) {
    const rang = rangs.find((r) => Math.abs(r.y1 - bloc.y1) <= Math.max(r.h, bloc.h) * 0.5);
    if (rang) {
      rang.blocs.push(bloc);
      rang.h = Math.max(rang.h, bloc.h);
    } else {
      rangs.push({ y1: bloc.y1, h: bloc.h, blocs: [bloc] });
    }
  }
  const lignes = [];
  for (const rang of rangs.sort((a, b) => a.y1 - b.y1)) {
    let courante = null;
    for (const bloc of rang.blocs.sort((a, b) => a.x0 - b.x0)) {
      const ecart = courante ? bloc.x0 - courante.x1 : 0;
      if (!courante || ecart > rang.h * 2) {
        courante = { texte: '', x0: bloc.x0, x1: bloc.x1, y0: rang.y1 - rang.h, y1: rang.y1 };
        lignes.push(courante);
      } else if (ecart > rang.h * 0.12 && !courante.texte.endsWith(' ') && !bloc.str.startsWith(' ')) {
        courante.texte += ' ';
      }
      courante.texte += bloc.str;
      courante.x1 = Math.max(courante.x1, bloc.x1);
    }
  }
  for (const ligne of lignes) ligne.texte = ligne.texte.replace(/\s+/g, ' ').trim();
  return lignes.filter((l) => l.texte);
}

async function rendrePage(page, echelle) {
  const vue = page.getViewport({ scale: echelle });
  const canvas = document.createElement('canvas');
  canvas.width = Math.floor(vue.width);
  canvas.height = Math.floor(vue.height);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  await page.render({ canvasContext: ctx, viewport: vue }).promise;
  return canvas;
}

/** Découpe une zone du canvas et la réduit à 400 px de côté maximum, en JPEG 0,8. */
function recadrer(source, x, y, largeur, hauteur) {
  const x0 = borner(Math.round(x), 0, source.width - 1);
  const y0 = borner(Math.round(y), 0, source.height - 1);
  const l = borner(Math.round(largeur), 1, source.width - x0);
  const h = borner(Math.round(hauteur), 1, source.height - y0);
  const reduction = Math.min(1, TAILLE_PHOTO / Math.max(l, h));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(l * reduction));
  canvas.height = Math.max(1, Math.round(h * reduction));
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(source, x0, y0, l, h, 0, 0, canvas.width, canvas.height);
  return canvas;
}

/** Vrai si la zone est quasi uniforme (case vide d'une grille). */
function estUniforme(canvas) {
  const petit = document.createElement('canvas');
  petit.width = 24;
  petit.height = 24;
  const ctx = petit.getContext('2d');
  ctx.drawImage(canvas, 0, 0, 24, 24);
  const { data } = ctx.getImageData(0, 0, 24, 24);
  let somme = 0;
  let carres = 0;
  const n = data.length / 4;
  for (let i = 0; i < data.length; i += 4) {
    const v = (data[i] + data[i + 1] + data[i + 2]) / 3;
    somme += v;
    carres += v * v;
  }
  const moyenne = somme / n;
  return Math.sqrt(carres / n - moyenne * moyenne) < 6;
}

/* ---------- Identités ---------- */

function sansAccents(texte) {
  return texte.normalize('NFD').replace(/\p{M}/gu, '');
}

const MOTS_HORS_IDENTITE = /(^|[^a-z])(nee?|naissance|tel|telephone|portable|mobile|fixe|entreprise|employeur|societe|tuteur|maitre|apprentissage|apprenti|contrat|adresse|mail|email|courriel|groupe|formation|option|regime|externe|interne|demi-pensionnaire|redoublant|classe|page|trombinoscope|edite|imprime|annee|scolaire|effectif|lycee|college|cfa|etablissement)([^a-z]|$)/;
const MOTIF_COORDONNEES = /\d{1,2}[/.-]\d{1,2}[/.-]\d{2,4}|(?:\+33|0)\s?[1-9](?:[\s.-]?\d{2}){4}|@/;

function estLigneIdentite(texte) {
  if (/\d/.test(texte) || texte.includes('@')) return false;
  if (MOTS_HORS_IDENTITE.test(sansAccents(texte).toLowerCase())) return false;
  if (!/^\p{L}[\p{L}\s'’.-]*$/u.test(texte)) return false;
  return texte.replace(/[^\p{L}]/gu, '').length >= 2;
}

function typeMot(mot) {
  const lettres = mot.replace(/[^\p{L}]/gu, '');
  if (!lettres) return 'autre';
  const majuscules = lettres.toLocaleUpperCase('fr');
  const minuscules = lettres.toLocaleLowerCase('fr');
  if (lettres === majuscules && lettres !== minuscules) return 'majuscules';
  if (lettres === minuscules) return 'particule';
  return 'capitale';
}

function profilLigne(texte) {
  const types = texte.split(/\s+/).map(typeMot);
  return { majuscules: types.includes('majuscules'), capitale: types.includes('capitale') };
}

/** « DE LA FONTAINE Marie-Anne » : les mots en majuscules (et particules voisines) forment le nom. */
function separerLigne(ligne) {
  const mots = ligne.split(/\s+/).filter(Boolean);
  const types = mots.map(typeMot);
  const nom = [];
  const prenom = [];
  types.forEach((type, i) => {
    const voisinMajuscules = types[i - 1] === 'majuscules' || types[i + 1] === 'majuscules';
    if (type === 'majuscules' || (type === 'particule' && voisinMajuscules)) nom.push(i);
    else prenom.push(i);
  });
  const contigu = (indices) => indices.every((v, k) => k === 0 || v === indices[k - 1] + 1);
  return {
    nom: nom.map((i) => mots[i]).join(' '),
    prenom: prenom.map((i) => mots[i]).join(' '),
    incertain: !contigu(nom) || !contigu(prenom),
  };
}

/**
 * Déduit nom et prénom des lignes situées sous une photo.
 * NetYparéo : identité sur la première ligne, le reste est ignoré.
 * Ecole Directe : le nom et le prénom peuvent occuper deux lignes.
 */
function decouperIdentite(lignes, format) {
  const candidates = lignes.filter(estLigneIdentite);
  if (!candidates.length) return { nom: '', prenom: '', incertain: true };
  const [l1, l2] = candidates;
  const p1 = profilLigne(l1);
  if (p1.majuscules && p1.capitale) return separerLigne(l1);

  if (format !== 'netypareo' && l2) {
    const p2 = profilLigne(l2);
    if (p1.majuscules && !p1.capitale && p2.capitale && !p2.majuscules) return { nom: l1, prenom: l2, incertain: false };
    if (p1.capitale && !p1.majuscules && p2.majuscules && !p2.capitale) return { nom: l2, prenom: l1, incertain: false };
  }

  const mots = l1.split(/\s+/).filter(Boolean);
  if (mots.length === 1) return p1.majuscules ? { nom: l1, prenom: '', incertain: true } : { nom: '', prenom: l1, incertain: true };
  if (p1.majuscules) return { nom: mots.slice(0, -1).join(' '), prenom: mots[mots.length - 1], incertain: true };
  return { nom: mots.slice(1).join(' '), prenom: mots[0], incertain: true };
}

function detecterFormat(photos) {
  const avecCoordonnees = photos.filter((p) => p.lignes.some((l) => MOTIF_COORDONNEES.test(l)
    || /entreprise|employeur/.test(sansAccents(l).toLowerCase()))).length;
  return avecCoordonnees >= Math.max(1, photos.length * 0.3) ? 'netypareo' : 'ecoledirecte';
}

/* ---------- Lecture du PDF ---------- */

async function analyserPage(pdfjs, page, numero) {
  const vue = page.getViewport({ scale: 1 });
  const [operateurs, contenu] = await Promise.all([page.getOperatorList(), page.getTextContent()]);
  const surfacePage = vue.width * vue.height;

  const bruts = positionsImages(pdfjs, operateurs, vue);
  const images = [];
  for (const r of bruts) {
    const l = r.x1 - r.x0;
    const h = r.y1 - r.y0;
    if (l < 20 || h < 20) continue;
    const doublon = images.some((a) => Math.abs(a.x0 - r.x0) < 3 && Math.abs(a.y0 - r.y0) < 3
      && Math.abs(a.x1 - r.x1) < 3 && Math.abs(a.y1 - r.y1) < 3);
    if (!doublon) images.push(r);
  }
  const pleinePage = images.some((r) => (r.x1 - r.x0) * (r.y1 - r.y0) > surfacePage * 0.5);
  const photos = images.filter((r) => (r.x1 - r.x0) * (r.y1 - r.y0) <= surfacePage * 0.25);

  return {
    numero,
    page,
    vue,
    blocs: blocsTexte(pdfjs, contenu, vue),
    rectangles: photos,
    // Repli : aucune image exploitable, ou page entièrement rendue comme une image.
    mode: photos.length === 0 || pleinePage ? 'grille' : 'images',
    traitee: false,
  };
}

async function extrairePageImages(etat, analyse) {
  const { rectangles, blocs, vue } = analyse;
  const cotes = rectangles.map((r) => Math.max(r.x1 - r.x0, r.y1 - r.y0));
  let echelle = borner(TAILLE_PHOTO / mediane(cotes), 1.5, 6);
  const surface = vue.width * vue.height;
  if (surface * echelle * echelle > PIXELS_MAX_RENDU) echelle = Math.sqrt(PIXELS_MAX_RENDU / surface);
  const canvas = await rendrePage(analyse.page, echelle);

  const hauteurType = mediane(rectangles.map((r) => r.y1 - r.y0));
  const largeurType = mediane(rectangles.map((r) => r.x1 - r.x0));
  const rangees = regrouper(rectangles, (r) => (r.y0 + r.y1) / 2, hauteurType * 0.4)
    .map((rangee) => rangee.sort((a, b) => a.x0 - b.x0));

  const ecarts = [];
  for (const rangee of rangees) {
    for (let i = 1; i < rangee.length; i++) {
      const ecart = rangee[i].x0 - rangee[i - 1].x1;
      if (ecart > 0) ecarts.push(ecart);
    }
  }
  const demiEcart = Math.max(4, (ecarts.length ? mediane(ecarts) : largeurType * 0.3) / 2);
  const utilisations = new Map();
  const cellules = [];

  rangees.forEach((rangee, indice) => {
    const suivante = rangees[indice + 1];
    const basCellule = suivante ? Math.min(...suivante.map((r) => r.y0)) : vue.height;
    for (const r of rangee) {
      const gauche = r.x0 - demiEcart;
      const droite = r.x1 + demiEcart;
      const dedans = blocs.filter((b) => b.cx >= gauche && b.cx <= droite && b.cy >= r.y1 - b.h * 0.3 && b.cy <= basCellule);
      for (const b of dedans) utilisations.set(b, (utilisations.get(b) || 0) + 1);
      cellules.push({ r, dedans });
    }
  });

  for (const { r, dedans } of cellules) {
    const lignes = assemblerLignes(dedans);
    const photo = recadrer(canvas, r.x0 * echelle, r.y0 * echelle, (r.x1 - r.x0) * echelle, (r.y1 - r.y0) * echelle);
    etat.photos.push({
      id: nouvelId(),
      page: analyse.numero,
      image: photo.toDataURL('image/jpeg', QUALITE_JPEG),
      lignes: lignes.map((l) => l.texte),
      doute: !lignes.length
        || lignes[0].y0 - r.y1 > (r.y1 - r.y0)
        || dedans.some((b) => utilisations.get(b) > 1),
    });
  }

  // Lignes hors cellules : noms proposés pour l'appariement manuel.
  const libres = assemblerLignes(blocs.filter((b) => !utilisations.has(b)));
  etat.lignesLibres.push(...libres.map((l) => l.texte).filter((t) => estLigneIdentite(t) && profilLigne(t).majuscules));
  canvas.width = 0;
}

async function decouperGrille(etat, analyse) {
  const p = analyse.params;
  const canvas = analyse.apercu;
  const e = analyse.echelleApercu;
  const x0 = (p.gauche / 100) * canvas.width;
  const x1 = canvas.width * (1 - p.droite / 100);
  const y0 = (p.haut / 100) * canvas.height;
  const y1 = canvas.height * (1 - p.bas / 100);
  const lCase = (x1 - x0) / p.colonnes;
  const hCase = (y1 - y0) / p.lignes;
  const hPhoto = hCase * (p.partPhoto / 100);
  const marge = Math.min(lCase, hPhoto) * 0.03;

  for (let ligne = 0; ligne < p.lignes; ligne++) {
    for (let colonne = 0; colonne < p.colonnes; colonne++) {
      const cx = x0 + colonne * lCase;
      const cy = y0 + ligne * hCase;
      const photo = recadrer(canvas, cx + marge, cy + marge, lCase - 2 * marge, hPhoto - 2 * marge);
      if (estUniforme(photo)) continue;
      const zone = { x0: cx / e, x1: (cx + lCase) / e, y0: (cy + hPhoto) / e, y1: (cy + hCase) / e };
      const dedans = analyse.blocs.filter((b) => b.cx >= zone.x0 && b.cx <= zone.x1 && b.cy >= zone.y0 && b.cy <= zone.y1);
      const lignes = assemblerLignes(dedans);
      etat.photos.push({
        id: nouvelId(),
        page: analyse.numero,
        image: photo.toDataURL('image/jpeg', QUALITE_JPEG),
        lignes: lignes.map((l) => l.texte),
        doute: !lignes.length,
      });
    }
  }
}

async function preparerApercu(analyse) {
  if (analyse.apercu) return;
  const surface = analyse.vue.width * analyse.vue.height;
  let echelle = LARGEUR_APERCU / analyse.vue.width;
  if (surface * echelle * echelle > PIXELS_MAX_RENDU) echelle = Math.sqrt(PIXELS_MAX_RENDU / surface);
  analyse.echelleApercu = echelle;
  analyse.apercu = await rendrePage(analyse.page, echelle);
}

/** Transforme les lignes brutes en noms, puis les oublie. */
function finaliserExtraction(etat) {
  const format = etat.format === 'auto' ? detecterFormat(etat.photos) : etat.format;
  etat.formatUtilise = format;
  for (const photo of etat.photos) {
    const identite = decouperIdentite(photo.lignes, format);
    delete photo.lignes;
    photo.nomId = null;
    photo.incertaine = identite.incertain || photo.doute;
    delete photo.doute;
    if (identite.nom || identite.prenom) {
      const nom = { id: nouvelId(), nom: identite.nom, prenom: identite.prenom };
      etat.noms.push(nom);
      photo.nomId = nom.id;
    }
  }
  const connus = new Set(etat.noms.map((n) => `${n.nom} ${n.prenom}`.trim()));
  for (const texte of etat.lignesLibres) {
    const identite = decouperIdentite([texte], 'netypareo');
    const cle = `${identite.nom} ${identite.prenom}`.trim();
    if (connus.has(cle)) continue;
    connus.add(cle);
    etat.noms.push({ id: nouvelId(), nom: identite.nom, prenom: identite.prenom });
  }
  etat.lignesLibres = [];
  for (const page of etat.pages) {
    if (page.apercu) page.apercu.width = 0;
    page.apercu = null;
    page.blocs = [];
  }
  etat.etape = 'classe';
}

async function lireTrombinoscope(fichier, format, progression) {
  progression('Chargement du lecteur PDF…');
  const pdfjs = await chargerPdfJs();
  const donnees = new Uint8Array(await fichier.arrayBuffer());
  const doc = await pdfjs.getDocument({
    data: donnees,
    isEvalSupported: false,
    enableXfa: false,
    useSystemFonts: true,
  }).promise;

  const etat = {
    format, doc, pages: [], photos: [], noms: [], lignesLibres: [],
    classe: '', etape: 'lecture',
  };
  try {
    for (let n = 1; n <= doc.numPages; n++) {
      progression(`Analyse de la page ${n} sur ${doc.numPages}…`);
      const analyse = await analyserPage(pdfjs, await doc.getPage(n), n);
      etat.pages.push(analyse);
      if (analyse.mode === 'images') await extrairePageImages(etat, analyse);
    }
  } catch (erreur) {
    doc.destroy();
    throw erreur;
  }
  if (etat.pages.some((p) => p.mode === 'grille')) etat.etape = 'grille';
  else finaliserExtraction(etat);
  return etat;
}

function messageErreurPdf(erreur) {
  if (erreur && erreur.name === 'PasswordException') return 'Ce PDF est protégé par un mot de passe : il ne peut pas être lu.';
  if (erreur && erreur.name === 'InvalidPDFException') return 'Ce fichier n’est pas un PDF valide ou il est endommagé.';
  return `Lecture impossible : ${erreur && erreur.message ? erreur.message : erreur}`;
}

/* ---------- Écrans ---------- */

function libelleNom(n) {
  return `${n.nom} ${n.prenom}`.trim() || 'Sans nom';
}

Ecrans.import = {
  titre: 'Importer un trombinoscope',
  titreCourt: 'Import',
  parent: 'accueil',
  libelleRetour: 'Annuler',
  surRetour() {
    Import.reinitialiser();
    aller('accueil');
  },
  async rendre(zone) {
    const etat = Import.etat;
    if (!etat) return ecranChoixPdf(zone);
    if (etat.etape === 'grille') return ecranGrille(zone);
    if (etat.etape === 'classe') return ecranClasse(zone);
    if (etat.etape === 'appariement') return ecranAppariement(zone);
    return ecranVerification(zone);
  },
};

function ecranChoixPdf(zone) {
  let format = 'auto';
  const entree = el('input', { type: 'file', accept: 'application/pdf,.pdf', id: 'fichier-pdf', class: 'visuellement-cache' });
  const bouton = el('label', { for: 'fichier-pdf', class: 'bouton principal bloc grand' }, 'Importer un trombinoscope PDF');
  const etatLecture = el('p', { class: 'discret', role: 'status' });

  entree.addEventListener('change', async () => {
    const fichier = entree.files[0];
    if (!fichier) return;
    bouton.classList.add('occupe');
    try {
      Import.etat = await lireTrombinoscope(fichier, format, (texte) => { etatLecture.textContent = texte; });
      afficher();
    } catch (erreur) {
      console.error(erreur);
      Import.reinitialiser();
      etatLecture.textContent = messageErreurPdf(erreur);
      bouton.classList.remove('occupe');
    } finally {
      entree.value = '';
    }
  });

  zone.append(el('div', { class: 'pile' },
    el('section', { class: 'panneau pile' },
      el('h2', { text: 'Un PDF = une classe' }),
      el('p', { text: 'Les photos et les noms sont extraits du fichier sur cet appareil. Vous indiquerez '
        + 'ensuite le nom de la classe, puis vérifierez chaque élève avant l’enregistrement.' }),
      el('p', { class: 'discret', text: 'Seuls le nom, le prénom, la classe et la photo sont conservés. '
        + 'Dates de naissance, téléphones et entreprises sont ignorés et ne sont jamais enregistrés.' })),
    el('h2', { text: 'Format du trombinoscope' }),
    selecteur([['auto', 'Détection automatique'], ['ecoledirecte', 'Ecole Directe'], ['netypareo', 'NetYparéo']],
      format, (v) => { format = v; }, 'Format du trombinoscope'),
    bouton,
    entree,
    etatLecture));
}

function ecranGrille(zone) {
  const etat = Import.etat;
  const analyse = etat.pages.find((p) => p.mode === 'grille' && !p.traitee);
  if (!analyse) {
    finaliserExtraction(etat);
    afficher();
    return;
  }
  definirTitre(`Découpage de la page ${analyse.numero}`);
  analyse.params = analyse.params || { colonnes: 5, lignes: 5, haut: 10, bas: 5, gauche: 4, droite: 4, partPhoto: 75 };
  const p = analyse.params;

  const apercu = el('canvas', { class: 'apercu-grille', 'aria-label': 'Aperçu du découpage' });
  const dessiner = () => {
    const source = analyse.apercu;
    if (!source) return;
    apercu.width = source.width;
    apercu.height = source.height;
    const ctx = apercu.getContext('2d');
    ctx.drawImage(source, 0, 0);
    const x0 = (p.gauche / 100) * source.width;
    const x1 = source.width * (1 - p.droite / 100);
    const y0 = (p.haut / 100) * source.height;
    const y1 = source.height * (1 - p.bas / 100);
    const lCase = (x1 - x0) / p.colonnes;
    const hCase = (y1 - y0) / p.lignes;
    ctx.lineWidth = Math.max(2, source.width / 400);
    for (let l = 0; l < p.lignes; l++) {
      for (let c = 0; c < p.colonnes; c++) {
        const x = x0 + c * lCase;
        const y = y0 + l * hCase;
        ctx.strokeStyle = '#3FA9F5';
        ctx.strokeRect(x, y, lCase, hCase * (p.partPhoto / 100));
        ctx.strokeStyle = '#E8792E';
        ctx.strokeRect(x, y + hCase * (p.partPhoto / 100), lCase, hCase * (1 - p.partPhoto / 100));
      }
    }
  };

  const reglage = (libelle, cle, min, max) => {
    const entree = el('input', { type: 'number', inputmode: 'numeric', min, max, step: 1, value: p[cle] });
    entree.addEventListener('input', () => {
      const v = Number(entree.value);
      if (Number.isFinite(v) && entree.value !== '') {
        p[cle] = borner(Math.round(v), min, max);
        dessiner();
      }
    });
    return champ(libelle, entree);
  };

  const pagesRestantes = etat.pages.filter((x) => x.mode === 'grille' && !x.traitee).length;
  const decouper = el('button', { type: 'button', class: 'bouton principal grand' }, 'Découper cette page');
  decouper.addEventListener('click', async () => {
    decouper.disabled = true;
    await decouperGrille(etat, analyse);
    analyse.traitee = true;
    analyse.apercu.width = 0;
    analyse.apercu = null;
    afficher();
  });

  zone.append(el('div', { class: 'pile' },
    el('div', { class: 'alerte' }, el('p', { text: `Page ${analyse.numero} : aucune photo séparée n’a été trouvée. `
      + 'Indiquez la grille pour la découper. Bleu = photo, orange = zone du nom.' })),
    el('div', { class: 'reglages-grille' },
      reglage('Colonnes', 'colonnes', 1, 12),
      reglage('Lignes', 'lignes', 1, 12),
      reglage('Part de la photo (%)', 'partPhoto', 30, 100),
      reglage('Marge haute (%)', 'haut', 0, 60),
      reglage('Marge basse (%)', 'bas', 0, 60),
      reglage('Marge gauche (%)', 'gauche', 0, 40),
      reglage('Marge droite (%)', 'droite', 0, 40)),
    el('div', { class: 'rangee' },
      decouper,
      el('button', {
        type: 'button',
        class: 'bouton grand',
        onclick: () => {
          analyse.traitee = true;
          afficher();
        },
      }, 'Ignorer cette page')),
    pagesRestantes > 1 && el('p', { class: 'discret', text: `${pagesRestantes} pages à découper.` }),
    apercu));

  preparerApercu(analyse).then(dessiner);
}

function ecranClasse(zone) {
  const etat = Import.etat;
  definirTitre('Nom de la classe');
  const total = etat.photos.length;
  if (!total) {
    zone.append(el('div', { class: 'pile' },
      el('div', { class: 'alerte' }, el('p', { text: 'Aucune photo n’a été trouvée dans ce fichier.' })),
      el('button', { type: 'button', class: 'bouton principal', onclick: () => { Import.reinitialiser(); afficher(); } }, 'Choisir un autre fichier')));
    return;
  }
  const avecNom = etat.photos.filter((p) => p.nomId).length;
  const incertaines = etat.photos.filter((p) => p.incertaine).length;
  const entree = el('input', { type: 'text', value: etat.classe, autocomplete: 'off', list: 'classes-import', placeholder: 'Exemple : 2nde 4' });
  const listeClasses = el('datalist', { id: 'classes-import' }, Etat.classes().map((c) => el('option', { value: c })));

  const valider = (etape) => {
    const classe = entree.value.replace(/\s+/g, ' ').trim();
    if (!classe) {
      annoncer('Indiquez le nom de la classe.');
      entree.focus();
      return;
    }
    etat.classe = classe;
    for (const photo of etat.photos) if (photo.saisie) photo.saisie.classe = classe;
    etat.etape = etape;
    afficher();
  };
  const douteux = incertaines > 0 || avecNom < total;

  const formulaire = el('form', { class: 'pile' },
    champ('Nom de la classe', entree, 'Tous les élèves de ce fichier seront rattachés à cette classe.'),
    listeClasses,
    el('button', { type: 'submit', class: 'bouton principal bloc grand' },
      douteux ? 'Continuer : vérifier l’appariement' : 'Continuer : vérifier la liste'),
    el('button', { type: 'button', class: 'bouton bloc', onclick: () => valider(douteux ? 'verification' : 'appariement') },
      douteux ? 'Passer directement à la vérification' : 'Corriger l’appariement'));
  formulaire.addEventListener('submit', (e) => {
    e.preventDefault();
    valider(douteux ? 'appariement' : 'verification');
  });

  zone.append(el('div', { class: 'pile' },
    el('div', { class: 'chiffres' },
      chiffre(total, total > 1 ? 'photos trouvées' : 'photo trouvée'),
      chiffre(avecNom, 'avec un nom'),
      chiffre(incertaines, incertaines > 1 ? 'incertaines' : 'incertaine')),
    el('p', { class: 'discret', text: `Mise en page utilisée : ${etat.formatUtilise === 'netypareo' ? 'NetYparéo' : 'Ecole Directe'}.` }),
    formulaire));
  entree.focus();
}

function ecranAppariement(zone) {
  const etat = Import.etat;
  definirTitre('Appariement');
  const numeros = new Map(etat.photos.map((p, i) => [p.id, i + 1]));
  let selection = etat.photos.find((p) => !p.ignoree && (!p.nomId || p.incertaine))?.id || null;

  const consigne = el('div', { class: 'barre-appariement' });
  const colonnePhotos = el('div', { class: 'appariement-photos' });
  const colonneNoms = el('div', { class: 'appariement-noms' });

  const titulaire = (nomId) => etat.photos.find((p) => p.nomId === nomId && !p.ignoree);
  const suivanteSansNom = (depuis) => {
    const ordre = etat.photos.filter((p) => !p.ignoree && !p.nomId);
    return (ordre.find((p) => numeros.get(p.id) > numeros.get(depuis)) || ordre[0])?.id || null;
  };

  const lier = (nomId) => {
    const photo = etat.photos.find((p) => p.id === selection);
    if (!photo) return;
    for (const autre of etat.photos) {
      if (autre.nomId === nomId) {
        autre.nomId = null;
        autre.saisie = null;
      }
    }
    Object.assign(photo, { nomId, ignoree: false, incertaine: false, saisie: null });
    selection = suivanteSansNom(photo.id);
    redessiner();
  };

  const redessiner = () => {
    const choisie = etat.photos.find((p) => p.id === selection);
    consigne.replaceChildren(
      el('p', { text: choisie
        ? `Photo ${numeros.get(choisie.id)} sélectionnée : touchez le nom correspondant.`
        : 'Touchez une photo, puis le nom correspondant.' }),
      el('div', { class: 'rangee' },
        choisie && el('button', {
          type: 'button',
          class: 'bouton danger',
          onclick: () => {
            choisie.ignoree = !choisie.ignoree;
            if (choisie.ignoree) {
              choisie.nomId = null;
              choisie.saisie = null;
              selection = suivanteSansNom(choisie.id);
            }
            redessiner();
          },
        }, choisie.ignoree ? 'Rétablir cette photo' : 'Ignorer cette photo'),
        choisie && choisie.nomId && el('button', {
          type: 'button',
          class: 'bouton',
          onclick: () => {
            choisie.nomId = null;
            choisie.saisie = null;
            redessiner();
          },
        }, 'Délier'),
        el('button', {
          type: 'button',
          class: 'bouton principal',
          onclick: () => {
            etat.etape = 'verification';
            afficher();
          },
        }, 'Vérifier la liste')));

    colonnePhotos.replaceChildren(...etat.photos.map((photo) => {
      const nom = etat.noms.find((n) => n.id === photo.nomId);
      const classes = ['vignette-appariement'];
      if (photo.id === selection) classes.push('choisie');
      if (photo.ignoree) classes.push('ignoree');
      else if (photo.incertaine || !nom) classes.push('incertaine');
      return el('button', {
        type: 'button',
        class: classes.join(' '),
        'aria-pressed': String(photo.id === selection),
        onclick: () => {
          selection = selection === photo.id ? null : photo.id;
          redessiner();
        },
      },
      el('img', { src: photo.image, alt: `Photo ${numeros.get(photo.id)}` }),
      el('span', { class: 'numero', text: numeros.get(photo.id) }),
      el('span', { class: 'legende', text: photo.ignoree ? 'Ignorée' : nom ? libelleNom(nom) : 'Sans nom' }));
    }));

    colonneNoms.replaceChildren(...etat.noms.map((nom) => {
      const photo = titulaire(nom.id);
      return el('button', {
        type: 'button',
        class: `nom-appariement${photo ? ' pris' : ''}`,
        disabled: !selection,
        onclick: () => lier(nom.id),
      },
      el('span', { text: libelleNom(nom) }),
      photo && el('span', { class: 'numero', text: numeros.get(photo.id) }));
    }));
    if (!etat.noms.length) colonneNoms.append(el('p', { class: 'discret', text: 'Aucun nom trouvé : vous les saisirez à l’étape suivante.' }));
  };

  zone.append(el('div', { class: 'pile' },
    consigne,
    el('div', { class: 'appariement' },
      el('section', {}, el('h2', { text: 'Photos' }), colonnePhotos),
      el('section', {}, el('h2', { text: 'Noms' }), colonneNoms))));
  redessiner();
}

function ecranVerification(zone) {
  const etat = Import.etat;
  definirTitre('Vérification');
  const cle = (e) => sansAccents(`${e.nom}|${e.prenom}|${e.classe}`).toLowerCase().replace(/\s+/g, ' ').trim();
  const existants = new Set([...Etat.eleves.values()].map(cle));

  for (const photo of etat.photos) {
    if (photo.ignoree || photo.saisie) continue;
    const nom = etat.noms.find((n) => n.id === photo.nomId);
    photo.saisie = { nom: nom ? nom.nom : '', prenom: nom ? nom.prenom : '', classe: etat.classe };
  }

  const compteur = el('span');
  const liste = el('div', { class: 'verification' });
  const retenues = () => etat.photos.filter((p) => !p.ignoree);
  const majCompteur = () => {
    const n = retenues().length;
    compteur.textContent = `Enregistrer ${pluriel(n, 'élève')}`;
    enregistrer.disabled = n === 0;
  };

  for (const photo of retenues()) {
    const s = photo.saisie;
    const ligne = el('div', { class: 'ligne-verif' });
    const remarque = el('p', { class: 'remarque' });
    const maj = () => {
      const manque = !s.nom.trim();
      const doublon = existants.has(cle(s));
      ligne.classList.toggle('incertaine', photo.incertaine || manque);
      remarque.textContent = manque ? 'Nom manquant'
        : photo.incertaine ? 'Association incertaine : vérifiez'
          : doublon ? 'Déjà enregistré dans cette classe' : '';
      remarque.hidden = !remarque.textContent;
    };
    const entree = (cleChamp, libelle) => {
      const input = el('input', { type: 'text', value: s[cleChamp], autocomplete: 'off' });
      input.addEventListener('input', () => {
        s[cleChamp] = input.value;
        maj();
      });
      return champ(libelle, input);
    };
    ligne.append(
      el('img', { class: 'photo-verif', src: photo.image, alt: '' }),
      el('div', { class: 'champs-verif' },
        entree('nom', 'Nom'), entree('prenom', 'Prénom'), entree('classe', 'Classe'), remarque),
      el('button', {
        type: 'button',
        class: 'bouton danger',
        onclick: () => {
          photo.ignoree = true;
          ligne.remove();
          majCompteur();
        },
      }, 'Retirer'));
    maj();
    liste.append(ligne);
  }

  const enregistrer = el('button', { type: 'button', class: 'bouton principal grand' }, compteur);
  enregistrer.addEventListener('click', async () => {
    const photos = retenues();
    const incompletes = photos.filter((p) => !p.saisie.nom.trim());
    if (incompletes.length) {
      annoncer(`${pluriel(incompletes.length, 'nom manque', 'noms manquent')} : complétez ou retirez ces lignes.`);
      liste.querySelector('.ligne-verif.incertaine input')?.focus();
      return;
    }
    enregistrer.disabled = true;
    try {
      const eleves = await Etat.ajouterEleves(photos.map((p) => ({
        nom: p.saisie.nom, prenom: p.saisie.prenom, classe: p.saisie.classe || etat.classe, photo: p.image,
      })));
      Etat.filtreClasse = etat.classe;
      Import.reinitialiser();
      annoncer(`${pluriel(eleves.length, 'élève enregistré', 'élèves enregistrés')}.`);
      aller('eleves');
    } catch (erreur) {
      annoncer(`Échec de l’enregistrement : ${erreur.message}`);
      enregistrer.disabled = false;
    }
  });

  const incertaines = retenues().filter((p) => p.incertaine || !p.saisie.nom.trim()).length;
  zone.append(el('div', { class: 'pile' },
    el('p', { text: incertaines
      ? `${pluriel(incertaines, 'ligne signalée', 'lignes signalées')} en orange : vérifiez-les avant d’enregistrer.`
      : 'Relisez chaque ligne avant d’enregistrer.' }),
    el('button', {
      type: 'button',
      class: 'bouton',
      onclick: () => {
        etat.etape = 'appariement';
        afficher();
      },
    }, 'Retour à l’appariement'),
    liste,
    el('div', { class: 'barre-enregistrement' }, enregistrer)));
  majCompteur();
}
