'use strict';

/* ---------- Cartes au format tableur (.csv) ----------
 *
 * Un élève prépare ses cartes dans Excel ou LibreOffice, une carte par ligne,
 * et importe le fichier. Le même format sert à l'export d'un paquet.
 *
 *   type;question;reponse;piege1;piege2;piege3;autres_reponses;aide
 *
 * - colonnes reconnues à leur nom, dans n'importe quel ordre, accents et
 *   majuscules ignorés ; une colonne inconnue est ignorée ;
 * - une ligne dont la première cellule commence par « # » est un commentaire
 *   (le mode d'emploi du modèle) ;
 * - séparateur deviné sur l'en-tête : « ; » (Excel en français), « , » ou
 *   tabulation (copier-coller depuis un tableur) ;
 * - autres_reponses : plusieurs réponses séparées par « | ».
 *
 * Les photos et les photos à trous ne passent pas par ce format.
 */

const CSV_TYPES = {
  '': null, // le modèle choisi à l'écran
  simple: 'simple', questionreponse: 'simple', qr: 'simple',
  double: 'double', deuxsens: 'double', lesdeuxsens: 'double',
  qcm: 'qcm',
  saisie: 'saisie', aecrire: 'saisie', ecrire: 'saisie', reponseaecrire: 'saisie',
};

/** « Réponse », « réponse », « REPONSE » → « reponse ». */
function normaliserEnTete(texte) {
  return String(texte || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

/** Le rôle d'une colonne d'après son titre, ou null. */
function roleColonne(titre) {
  const n = normaliserEnTete(titre);
  if (['type', 'modele', 'typedecarte'].includes(n)) return 'type';
  if (['question', 'recto', 'facea'].includes(n)) return 'question';
  if (['reponse', 'verso', 'faceb', 'bonnereponse'].includes(n)) return 'reponse';
  if (/^(piege|faux|mauvaisereponse)\d*$/.test(n)) return 'piege';
  if (['autresreponses', 'autresreponsesacceptees', 'acceptees', 'autres'].includes(n)) return 'acceptees';
  if (['aide', 'astuce', 'explication'].includes(n)) return 'aide';
  return null;
}

/** Octets d'un fichier → texte. Excel « CSV (point-virgule) » écrit en
 * Windows-1252 : un fichier qui n'est pas de l'UTF-8 valide est relu ainsi. */
function decoderCsv(octets) {
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(octets);
  } catch {
    return new TextDecoder('windows-1252').decode(octets);
  }
}

/** Découpe un texte CSV en lignes de cellules. Guillemets à la RFC 4180 :
 * « ; », « " » (doublé) et retours à la ligne permis dans une cellule.
 * Chaque ligne garde son numéro dans le fichier, pour les messages. */
function decouperCsv(texte, separateur) {
  const lignes = [];
  let cellules = [];
  let cellule = '';
  let entreGuillemets = false;
  let numero = 1;
  let debut = 1;
  let debutLigne = true;
  const finirLigne = () => {
    cellules.push(cellule);
    const commentaire = cellules[0].trim().startsWith('#');
    if (!commentaire && cellules.some((c) => c.trim())) lignes.push({ numero: debut, cellules });
    cellules = [];
    cellule = '';
    debutLigne = true;
  };
  for (let i = 0; i < texte.length; i += 1) {
    const c = texte[i];
    if (debutLigne) {
      debutLigne = false;
      debut = numero;
    }
    if (entreGuillemets) {
      if (c === '"' && texte[i + 1] === '"') {
        cellule += '"';
        i += 1;
      } else if (c === '"') {
        entreGuillemets = false;
      } else {
        if (c === '\n') numero += 1;
        cellule += c;
      }
    } else if (c === '"' && !cellule.trim()) {
      cellule = '';
      entreGuillemets = true;
    } else if (c === separateur) {
      cellules.push(cellule);
      cellule = '';
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && texte[i + 1] === '\n') i += 1;
      finirLigne();
      numero += 1;
    } else {
      cellule += c;
    }
  }
  if (!debutLigne) finirLigne();
  return lignes.map((l) => ({ ...l, cellules: l.cellules.map((x) => x.replace(/\r\n?/g, '\n').trim()) }));
}

/** Première ligne utile (ni vide ni commentaire). */
function premiereLigneUtile(texte) {
  return texte.split(/\r?\n/).find((l) => l.trim() && !l.trimStart().startsWith('#')) || '';
}

/** Le texte est-il un tableau à en-tête (colonnes « question » et « reponse ») ?
 * Renvoie son séparateur, ou null. */
function separateurTableau(texte) {
  const entete = premiereLigneUtile(texte.replace(/^﻿/, ''));
  let meilleur = null;
  for (const s of ['\t', ';', ',']) {
    const titres = entete.split(s).map((t) => roleColonne(t.replace(/^"|"$/g, '')));
    if (!titres.includes('question') || !titres.includes('reponse')) continue;
    const reconnus = titres.filter(Boolean).length;
    if (!meilleur || reconnus > meilleur.reconnus) meilleur = { separateur: s, reconnus };
  }
  return meilleur && meilleur.separateur;
}

/** Tableau → cartes. modeleParDefaut s'applique aux lignes sans type.
 * Renvoie { cartes: [{ modele, contenu, numero }], erreurs: [{ numero, message }] }. */
function lireTableau(texte, modeleParDefaut = 'simple') {
  const separateur = separateurTableau(texte);
  const [entete, ...lignes] = decouperCsv(texte.replace(/^﻿/, ''), separateur);
  const roles = entete.cellules.map(roleColonne);
  const cartes = [];
  const erreurs = [];
  const LIMITES = { question: 1000, reponse: 1500, aide: 600 };

  for (const { numero, cellules } of lignes) {
    const valeurs = { type: '', question: '', reponse: '', aide: '', pieges: [], acceptees: [] };
    roles.forEach((role, i) => {
      const v = cellules[i] || '';
      if (!role || !v) return;
      if (role === 'piege') valeurs.pieges.push(v);
      else if (role === 'acceptees') valeurs.acceptees.push(...v.split('|').map((a) => a.trim()).filter(Boolean));
      else if (!valeurs[role]) valeurs[role] = v;
    });
    const refuser = (message) => erreurs.push({ numero, message });

    const cleType = normaliserEnTete(valeurs.type);
    if (cleType === 'masques' || cleType === 'phototrous' || cleType === 'photoatrous') {
      refuser('les photos à trous se créent dans l’appli, pas dans un tableau');
      continue;
    }
    if (!(cleType in CSV_TYPES)) {
      refuser(`type « ${valeurs.type} » inconnu (simple, double, qcm ou saisie)`);
      continue;
    }
    const modele = CSV_TYPES[cleType] || modeleParDefaut;
    if (!valeurs.question) {
      refuser('la question est vide');
      continue;
    }
    if (!valeurs.reponse) {
      refuser(modele === 'qcm' ? 'la bonne réponse est vide' : 'la réponse est vide');
      continue;
    }
    if (modele === 'qcm' && !valeurs.pieges.length) {
      refuser('un QCM demande au moins un piège (trois, c’est mieux)');
      continue;
    }
    if (modele === 'qcm' && valeurs.pieges.length > 7) {
      refuser('sept pièges au plus');
      continue;
    }
    const tropLong = Object.entries(LIMITES).find(([cle, max]) => valeurs[cle].length > max);
    if (tropLong) {
      refuser(`${tropLong[0] === 'reponse' ? 'réponse' : tropLong[0]} trop longue (${tropLong[1]} caractères au plus)`);
      continue;
    }
    const contenu = { recto: valeurs.question, verso: valeurs.reponse, aide: valeurs.aide };
    if (modele === 'qcm') contenu.faux = valeurs.pieges;
    if (modele === 'saisie') contenu.acceptees = valeurs.acceptees;
    cartes.push({ modele, contenu, numero });
  }
  return { cartes, erreurs, colonnesIgnorees: entete.cellules.filter((t, i) => t && !roles[i]) };
}

/* ---------- Écriture ---------- */

function celluleCsv(valeur) {
  const v = String(valeur ?? '');
  return /[;"\r\n]|^\s|\s$/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
}

/** Lignes de cellules → texte CSV pour Excel : BOM UTF-8, « ; », CRLF. */
function ecrireCsv(lignes) {
  return '﻿' + lignes.map((l) => l.map(celluleCsv).join(';')).join('\r\n') + '\r\n';
}

function telechargerTexte(nomFichier, texte, type = 'text/csv;charset=utf-8') {
  const url = URL.createObjectURL(new Blob([texte], { type }));
  const lien = el('a', { href: url, download: nomFichier, hidden: true });
  document.body.append(lien);
  lien.click();
  lien.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}

function nomDeFichier(titre) {
  const base = String(titre || 'paquet').normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 50);
  return `${base || 'paquet'}.csv`;
}

const MODE_EMPLOI_CSV = [
  'MODE D’EMPLOI — les lignes qui commencent par # sont ignorées : tu peux les laisser ou les effacer.',
  'Une ligne = une carte. Garde la première ligne telle quelle : ce sont les titres des colonnes.',
  'type : simple (question → réponse), double (dans les deux sens), qcm, saisie (réponse à écrire). Case vide = simple.',
  'question et reponse : obligatoires. Pour un qcm, reponse est la bonne réponse.',
  'piege1, piege2, piege3 : seulement pour un qcm, au moins un. Des erreurs crédibles : celles que tu pourrais faire toi-même.',
  'autres_reponses : seulement pour saisie, facultatif. Plusieurs réponses séparées par une barre | (ex. : rho | masse volumique).',
  'aide : facultatif, affichée avec la réponse (un moyen mnémotechnique, une explication).',
  'Formules : H2O s’affiche avec un indice, x^2 avec un exposant, 10^{-3} et C_{m} pour plusieurs caractères, $\\frac{m}{V}$ pour du LaTeX.',
  'Pas de photo dans ce fichier : ajoute-les ensuite dans l’appli, carte par carte.',
  'Pour enregistrer : Excel → « CSV UTF-8 » ; LibreOffice → « Texte CSV », jeu de caractères UTF-8. Puis « Importer des cartes » dans ton paquet.',
  'Le tableur change une réponse en date (3/4 devient 3 avril) ? Tape une apostrophe devant : \'3/4',
];

const ENTETE_CSV = ['type', 'question', 'reponse', 'piege1', 'piege2', 'piege3', 'autres_reponses', 'aide'];

function modeleCsv() {
  return ecrireCsv([
    ENTETE_CSV,
    ...MODE_EMPLOI_CSV.map((l) => [`# ${l}`]),
    ['simple', 'Qu’est-ce qu’un isotope ?', 'Deux atomes de même numéro atomique Z mais de nombres de masse A différents', '', '', '', '', 'Iso = même place dans le tableau périodique'],
    ['double', 'H2O', 'eau', '', '', '', '', ''],
    ['qcm', 'Unité de la quantité de matière ?', 'la mole (mol)', 'le gramme (g)', 'le litre (L)', 'le kelvin (K)', '', ''],
    ['saisie', 'Symbole de la masse volumique ?', 'ρ', '', '', '', 'rho', ''],
  ]);
}

/** Lignes leitner_cartes d'un paquet → CSV. Les photos à trous sont écartées,
 * les photos des autres cartes perdues : le nombre est renvoyé pour le dire. */
function paquetVersCsv(titre, lignes) {
  const exportables = lignes.filter((l) => l.modele !== 'masques');
  const nbPieges = Math.max(3, ...exportables.map((l) => ((l.contenu || {}).faux || []).length));
  const pieges = Array.from({ length: nbPieges }, (_, i) => `piege${i + 1}`);
  const corps = exportables.map((l) => {
    const c = l.contenu || {};
    const faux = c.faux || [];
    return [l.modele, c.recto || '', c.verso || '', ...pieges.map((_, i) => faux[i] || ''),
      (c.acceptees || []).join(' | '), c.aide || ''];
  });
  const sansPhoto = lignes.filter((l) => l.modele === 'masques' || photosDeLigne(l).length).length;
  return {
    texte: ecrireCsv([
      ['type', 'question', 'reponse', ...pieges, 'autres_reponses', 'aide'],
      [`# Paquet « ${titre} », exporté le ${new Date().toLocaleDateString('fr-FR')}. Les photos ne sont pas exportées.`],
      ...corps,
    ]),
    exportees: exportables.length,
    sansPhoto,
  };
}
