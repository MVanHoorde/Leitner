'use strict';

/** Nom de l'ensemble : le trombinoscope n'en est plus que la moitié. */
const NOM_APP = 'Boîte à cartes';

const $ = (selecteur, racine = document) => racine.querySelector(selecteur);

const comparerFr = new Intl.Collator('fr', { sensitivity: 'base', numeric: true }).compare;

/** Crée un élément DOM. Le texte passe toujours par textContent, jamais par innerHTML. */
function el(balise, attributs, ...enfants) {
  const noeud = document.createElement(balise);
  for (const [cle, valeur] of Object.entries(attributs || {})) {
    if (valeur === null || valeur === undefined || valeur === false) continue;
    if (cle === 'class') noeud.className = valeur;
    else if (cle === 'text') noeud.textContent = valeur;
    else if (cle === 'value') noeud.value = valeur;
    else if (cle.startsWith('on') && typeof valeur === 'function') noeud.addEventListener(cle.slice(2), valeur);
    else noeud.setAttribute(cle, valeur === true ? '' : String(valeur));
  }
  for (const enfant of enfants.flat()) {
    if (enfant === null || enfant === undefined || enfant === false) continue;
    noeud.append(enfant instanceof Node ? enfant : String(enfant));
  }
  return noeud;
}

function nouvelId() {
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  const octets = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(octets, (o) => o.toString(16).padStart(2, '0')).join('');
}

function pluriel(n, singulier, pluriel = singulier + 's') {
  return `${n} ${n > 1 ? pluriel : singulier}`;
}

function formaterOctets(octets) {
  if (octets < 1024 * 1024) return `${Math.max(1, Math.round(octets / 1024))} Ko`;
  return `${(octets / 1024 / 1024).toLocaleString('fr-FR', { maximumFractionDigits: 1 })} Mo`;
}

/* ---------- Dates calendaires locales, au format AAAA-MM-JJ ---------- */

const Dates = {
  /** Décalage en jours, utilisé uniquement pour tester l'application. */
  decalage: 0,

  versIso(date) {
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const jj = String(date.getDate()).padStart(2, '0');
    return `${date.getFullYear()}-${mm}-${jj}`;
  },

  versDate(iso) {
    const [a, m, j] = iso.split('-').map(Number);
    return new Date(a, m - 1, j);
  },

  aujourdhui() {
    const d = new Date();
    d.setDate(d.getDate() + this.decalage);
    return this.versIso(d);
  },

  ajouter(iso, jours) {
    const d = this.versDate(iso);
    d.setDate(d.getDate() + jours);
    return this.versIso(d);
  },

  /** Nombre de jours de a à b (positif si b est après a). */
  ecart(a, b) {
    return Math.round((this.versDate(b) - this.versDate(a)) / 86400000);
  },

  formater(iso, avecJour = false) {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    if (avecJour) options.weekday = 'long';
    return this.versDate(iso).toLocaleDateString('fr-FR', options);
  },

  depuis(jours) {
    if (jours <= 0) return "aujourd'hui";
    if (jours === 1) return 'hier';
    return `il y a ${jours} jours`;
  },
};

/* ---------- Aléatoire reproductible (données de démonstration) ---------- */

function hacherTexte(texte) {
  let h = 2166136261;
  for (const c of texte) {
    h ^= c.codePointAt(0);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function generateurAleatoire(graine) {
  let a = graine >>> 0;
  return function () {
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function melanger(tableau, alea = Math.random) {
  for (let i = tableau.length - 1; i > 0; i--) {
    const j = Math.floor(alea() * (i + 1));
    [tableau[i], tableau[j]] = [tableau[j], tableau[i]];
  }
  return tableau;
}

/* ---------- Retours à l'utilisateur ---------- */

let minuteurAnnonce = null;

function annoncer(texte) {
  const zone = $('#annonce');
  zone.textContent = texte;
  zone.hidden = false;
  clearTimeout(minuteurAnnonce);
  minuteurAnnonce = setTimeout(() => { zone.hidden = true; }, 3500);
}

/**
 * Bouton d'action destructrice avec confirmation en deux temps :
 * premier tap = explication, second tap = exécution.
 */
function confirmationDeuxTemps({ libelle, question, detail, libelleConfirmer, action, classeBouton = 'bouton danger bloc' }) {
  const zone = el('div');
  const etapeInitiale = () => {
    zone.replaceChildren(el('button', { type: 'button', class: classeBouton, onclick: etapeConfirmation }, libelle));
  };
  const etapeConfirmation = () => {
    const confirmer = el('button', { type: 'button', class: 'bouton danger plein' }, libelleConfirmer);
    confirmer.addEventListener('click', async () => {
      confirmer.disabled = true;
      try {
        await action();
      } catch (erreur) {
        annoncer(`Échec : ${erreur.message}`);
        confirmer.disabled = false;
      }
    });
    zone.replaceChildren(el('div', { class: 'alerte danger pile', role: 'alertdialog' },
      el('p', {}, el('strong', { text: question })),
      detail && el('p', { text: detail }),
      el('div', { class: 'rangee' },
        confirmer,
        el('button', { type: 'button', class: 'bouton', onclick: etapeInitiale }, 'Annuler'))));
    confirmer.focus();
  };
  etapeInitiale();
  return zone;
}
