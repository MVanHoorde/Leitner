/* Jeu de données fictif : noms inventés et visages dessinés, aucune vraie photo. */

const NOMS_DEMO = `MARTIN BERNARD THOMAS PETIT ROBERT RICHARD DURAND DUBOIS MOREAU LAURENT
SIMON MICHEL LEFEVRE LEROY ROUX DAVID BERTRAND MOREL FOURNIER GIRARD BONNET DUPONT
LAMBERT FONTAINE ROUSSEAU VINCENT MULLER FAURE ANDRE MERCIER BLANC GUERIN BOYER
GARNIER CHEVALIER LEGRAND GAUTHIER GARCIA PERRIN ROBIN CLEMENT MORIN NICOLAS HENRY
MASSON MARCHAND DUVAL DENIS DUMONT LEMAIRE MEYER DUFOUR MEUNIER BRUN BLANCHARD
GIRAUD JOLY RIVIERE BRUNET GAILLARD BARBIER ARNAUD ROCHE RENARD SCHMITT COLIN VIDAL
CARON PICARD FABRE AUBERT LEMOINE RENAUD DUMAS LACROIX OLIVIER BOURGEOIS BENOIT REY`.split(/\s+/);

const PRENOMS_DEMO = `Emma Jade Louise Alice Chloé Lina Rose Anna Mila Ambre Julia Léa Manon Inès
Camille Sarah Zoé Eva Romane Lou Gabriel Léo Raphaël Arthur Louis Lucas Adam Jules Hugo
Maël Liam Noah Ethan Paul Nathan Sacha Tom Timéo Théo Enzo Clara Juliette Charlotte
Agathe Margot Nina Lyna Elena Iris Aaron Marceau Naël Amir Isaac Kaïs Milo Noé Antoine
Baptiste Élise Maya Léna Jeanne Olivia Alix Adèle Suzanne Malo Côme Basile Rayan Ilyes
Axel Evan Mathis`.split(/\s+/);

const CLASSES_DEMO = [['2nde 4', 14], ['1re STMG 2', 12], ['BTS MCO 1', 10]];

const TEINTES = {
  fonds: ['#DCE6F2', '#E9E2D0', '#D8EAD9', '#EADADF', '#E0E0EA', '#F0E4D4', '#D5E8EC'],
  peaux: ['#F6DCC6', '#F2D3B8', '#E8BD98', '#D4A27C', '#B98160', '#8D5B3E', '#6B4330'],
  cheveux: ['#1A1A1A', '#2B1D14', '#5A3A22', '#8C5A2B', '#C9A15B', '#A0522D', '#7A7A7A', '#E3C98F'],
  yeux: ['#3B2A1E', '#2F5D8A', '#4E7A3E', '#1E1E1E', '#6B4A2B'],
  vetements: ['#3D5A80', '#98C1D9', '#EE6C4D', '#293241', '#6A994E', '#BC4749', '#F2CC8F', '#81B29A', '#9C89B8'],
};

function nuancer(hex, facteur) {
  const n = parseInt(hex.slice(1), 16);
  const canal = (decalage) => Math.min(255, Math.round(((n >> decalage) & 255) * facteur));
  return `rgb(${canal(16)}, ${canal(8)}, ${canal(0)})`;
}

/** Dessine un visage stylisé, reproductible à partir de la graine. Renvoie une data URL JPEG. */
function dessinerVisage(graine, taille = 400) {
  const alea = generateurAleatoire(hacherTexte(graine));
  const choisir = (liste) => liste[Math.floor(alea() * liste.length)];
  const entre = (min, max) => min + alea() * (max - min);

  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = taille;
  const ctx = canvas.getContext('2d');
  const u = taille / 100;
  const TOUR = Math.PI * 2;
  const ellipse = (x, y, rx, ry, debut = 0, fin = TOUR) => {
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, 0, debut, fin);
    ctx.fill();
  };

  const peau = choisir(TEINTES.peaux);
  const cheveux = choisir(TEINTES.cheveux);
  const coiffure = Math.floor(alea() * 6);
  const cx = 50 * u;
  const cy = entre(43, 47) * u;
  const rx = entre(15, 19) * u;
  const ry = entre(19.5, 23) * u;

  ctx.fillStyle = choisir(TEINTES.fonds);
  ctx.fillRect(0, 0, taille, taille);

  // Cheveux longs, derrière la tête
  if (coiffure === 3 || coiffure === 4) {
    ctx.fillStyle = cheveux;
    const longueur = coiffure === 4 ? 17 : 8;
    ellipse(cx, cy + longueur * 0.6 * u, rx + 5 * u, ry + longueur * u);
  }

  // Buste et cou
  ctx.fillStyle = choisir(TEINTES.vetements);
  ellipse(cx, 101 * u, entre(32, 40) * u, 24 * u);
  ctx.fillStyle = nuancer(peau, 0.9);
  ctx.fillRect(cx - 6 * u, cy + ry - 8 * u, 12 * u, 16 * u);

  // Oreilles et tête
  ctx.fillStyle = peau;
  for (const cote of [-1, 1]) ellipse(cx + cote * rx, cy + 2 * u, 3 * u, 5 * u);
  ellipse(cx, cy, rx, ry);

  // Cheveux sur la tête
  ctx.fillStyle = cheveux;
  switch (coiffure) {
    case 0: // courts
      ellipse(cx, cy - ry * 0.45, rx * 1.04, ry * 0.62, Math.PI, TOUR);
      break;
    case 1: // très courts
      ctx.globalAlpha = 0.6;
      ellipse(cx, cy - ry * 0.55, rx * 1.01, ry * 0.5, Math.PI, TOUR);
      ctx.globalAlpha = 1;
      break;
    case 2: { // mèche sur le côté
      const cote = alea() < 0.5 ? -1 : 1;
      ellipse(cx, cy - ry * 0.45, rx * 1.06, ry * 0.65, Math.PI, TOUR);
      ctx.beginPath();
      ctx.ellipse(cx + cote * rx * 0.35, cy - ry * 0.5, rx * 0.75, ry * 0.3, cote * 0.35, 0, TOUR);
      ctx.fill();
      break;
    }
    case 3: // mi-longs
    case 4: // longs
      ellipse(cx, cy - ry * 0.4, rx * 1.12, ry * 0.7, Math.PI, TOUR);
      break;
    default: // bouclés
      for (let a = Math.PI * 1.02; a <= Math.PI * 1.98; a += Math.PI / 10) {
        ellipse(cx + Math.cos(a) * rx, cy - ry * 0.2 + Math.sin(a) * ry * 0.85, 6 * u, 6 * u);
      }
      ellipse(cx, cy - ry * 0.5, rx * 0.95, ry * 0.55, Math.PI, TOUR);
  }

  // Yeux et sourcils
  const ey = cy - 1 * u;
  const ex = entre(6, 8) * u;
  const iris = choisir(TEINTES.yeux);
  const inclinaison = entre(-1.2, 1.2) * u;
  for (const cote of [-1, 1]) {
    ctx.fillStyle = '#FFFFFF';
    ellipse(cx + cote * ex, ey, 3.3 * u, 2.2 * u);
    ctx.fillStyle = iris;
    ellipse(cx + cote * ex, ey, 1.6 * u, 1.6 * u);
    ctx.strokeStyle = cheveux;
    ctx.lineWidth = entre(1, 1.8) * u;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(cx + cote * (ex - 3.5 * u), ey - 5 * u);
    ctx.lineTo(cx + cote * (ex + 3.5 * u), ey - 5 * u + inclinaison);
    ctx.stroke();
  }

  // Nez et bouche
  ctx.strokeStyle = nuancer(peau, 0.75);
  ctx.lineWidth = 1.2 * u;
  ctx.beginPath();
  ctx.moveTo(cx, ey + 2 * u);
  ctx.lineTo(cx - 1.8 * u, ey + entre(7, 9) * u);
  ctx.lineTo(cx + 1.2 * u, ey + entre(8, 9.5) * u);
  ctx.stroke();

  ctx.strokeStyle = '#8A3B3B';
  ctx.lineWidth = 1.4 * u;
  ctx.beginPath();
  const largeurBouche = entre(3, 5.5) * u;
  ctx.arc(cx, ey + 9 * u, largeurBouche, Math.PI * 0.2, Math.PI * 0.8);
  ctx.stroke();

  // Détails distinctifs
  if (alea() < 0.28) { // lunettes
    ctx.strokeStyle = '#222222';
    ctx.lineWidth = 1 * u;
    for (const cote of [-1, 1]) {
      ctx.beginPath();
      ctx.arc(cx + cote * ex, ey, 4.6 * u, 0, TOUR);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.moveTo(cx - ex + 4.6 * u, ey);
    ctx.lineTo(cx + ex - 4.6 * u, ey);
    ctx.stroke();
  }
  if (alea() < 0.12) { // barbe
    ctx.fillStyle = cheveux;
    ctx.globalAlpha = 0.45;
    ellipse(cx, cy + ry * 0.45, rx * 0.92, ry * 0.55, 0, Math.PI);
    ctx.globalAlpha = 1;
  }
  if (alea() < 0.18) { // boucles d'oreilles
    ctx.fillStyle = '#D4AF37';
    for (const cote of [-1, 1]) ellipse(cx + cote * rx, cy + 7.5 * u, 1.3 * u, 1.3 * u);
  }

  return canvas.toDataURL('image/jpeg', 0.8);
}

function genererDemo() {
  const alea = generateurAleatoire(20260901);
  const noms = melanger([...NOMS_DEMO], alea);
  const eleves = [];
  let rang = 0;
  for (const [classe, effectif] of CLASSES_DEMO) {
    for (let k = 0; k < effectif; k++, rang++) {
      const nom = noms[rang % noms.length];
      const prenom = PRENOMS_DEMO[Math.floor(alea() * PRENOMS_DEMO.length)];
      eleves.push({ nom, prenom, classe, photo: dessinerVisage(`${classe}|${nom}|${prenom}`) });
    }
  }
  return eleves;
}

function demoDejaChargee() {
  const classes = Etat.classes();
  return CLASSES_DEMO.some(([classe]) => classes.includes(classe));
}
