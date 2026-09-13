/* Navigation par ancre (#/ecran/parametre) et composants partagés. */

const Ecrans = {};

function lireRoute() {
  const [nom, param] = location.hash.replace(/^#\/?/, '').split('/');
  return { nom: nom || 'accueil', param: param === undefined ? null : decodeURIComponent(param) };
}

function aller(nom, param = null) {
  const cible = `#/${nom}${param === null ? '' : '/' + encodeURIComponent(param)}`;
  if (location.hash === cible) afficher();
  else location.hash = cible;
}

function definirTitre(texte) {
  $('#titre').textContent = texte;
  document.title = texte === 'Reconnaître mes élèves' ? texte : `${texte} · Reconnaître mes élèves`;
}

function majBandeauDate() {
  const bandeau = $('#bandeau-date');
  bandeau.hidden = Dates.decalage === 0;
  if (Dates.decalage !== 0) {
    const signe = Dates.decalage > 0 ? '+' : '−';
    bandeau.textContent = `Mode test : date simulée au ${Dates.formater(Dates.aujourdhui(), true)} `
      + `(${signe}${pluriel(Math.abs(Dates.decalage), 'jour')})`;
  }
}

/** Gestionnaire clavier de l'écran courant (remplacé à chaque affichage). */
let toucheEcran = null;
document.addEventListener('keydown', (evenement) => {
  if (toucheEcran && !['INPUT', 'TEXTAREA', 'SELECT'].includes(evenement.target.tagName)) toucheEcran(evenement);
});

async function afficher() {
  if (typeof Verrou !== 'undefined' && Verrou.verrouille) return;
  const { nom, param } = lireRoute();
  const ecran = Ecrans[nom] || Ecrans.accueil;
  const zone = $('#ecran');
  toucheEcran = null;
  zone.replaceChildren();
  document.body.classList.toggle('plein', Boolean(ecran.pleinEcran));
  definirTitre(ecran.titre);
  majBandeauDate();

  const retour = $('#retour');
  retour.hidden = !ecran.parent;
  if (ecran.parent) {
    retour.textContent = `‹ ${ecran.libelleRetour || Ecrans[ecran.parent].titreCourt}`;
    retour.onclick = () => (ecran.surRetour ? ecran.surRetour() : aller(ecran.parent));
  }

  window.scrollTo(0, 0);
  try {
    await ecran.rendre(zone, param);
  } catch (erreur) {
    console.error(erreur);
    zone.append(el('div', { class: 'alerte danger' }, `Erreur d'affichage : ${erreur.message}`));
  }
}

/* ---------- Composants partagés ---------- */

function photoEleve(eleve, classe) {
  if (!eleve.photo) return el('div', { class: `${classe} sans-photo`, text: 'Sans photo' });
  return el('img', { class: classe, src: eleve.photo, alt: `Photo de ${eleve.prenom} ${eleve.nom}`, draggable: 'false' });
}

function nomComplet(eleve) {
  return `${eleve.prenom} ${eleve.nom}`.trim();
}

function filtreClasses(auChangement) {
  const classes = Etat.classes();
  if (Etat.filtreClasse && !classes.includes(Etat.filtreClasse)) Etat.filtreClasse = null;

  const barre = el('div', { class: 'puces', role: 'group', 'aria-label': 'Filtrer par classe' });
  const majEtat = () => {
    for (const bouton of barre.children) {
      bouton.setAttribute('aria-pressed', String(bouton.dataset.classe === (Etat.filtreClasse ?? '')));
    }
  };
  for (const [valeur, libelle] of [[null, 'Toutes les classes'], ...classes.map((c) => [c, c])]) {
    barre.append(el('button', {
      type: 'button',
      class: 'puce',
      'data-classe': valeur ?? '',
      onclick: () => {
        Etat.filtreClasse = valeur;
        majEtat();
        auChangement();
      },
    }, libelle));
  }
  majEtat();
  return barre;
}

/** Groupe de boutons exclusifs. options : [[valeur, libelle], …] */
function selecteur(options, valeurInitiale, auChangement, etiquette) {
  const barre = el('div', { class: 'puces', role: 'group', 'aria-label': etiquette });
  let valeur = valeurInitiale;
  const majEtat = () => {
    for (const bouton of barre.children) bouton.setAttribute('aria-pressed', String(bouton.dataset.valeur === valeur));
  };
  for (const [v, libelle] of options) {
    barre.append(el('button', {
      type: 'button',
      class: 'puce',
      'data-valeur': v,
      onclick: () => {
        valeur = v;
        majEtat();
        auChangement(v);
      },
    }, libelle));
  }
  majEtat();
  return barre;
}

function boutonMenu(libelle, detail, onclick, variante = '') {
  return el('button', { type: 'button', class: `bouton menu ${variante}`, onclick },
    el('span', { class: 'libelle', text: libelle }),
    detail && el('span', { class: 'detail', text: detail }));
}

function champ(libelle, controle, aide) {
  return el('label', { class: 'champ' },
    el('span', { class: 'champ-libelle', text: libelle }),
    controle,
    aide && el('span', { class: 'champ-aide', text: aide }));
}

function chiffre(valeur, libelle) {
  return el('div', { class: 'chiffre' }, el('strong', { text: valeur }), el('span', { text: libelle }));
}

function effacementComplet(libelle = 'Tout effacer') {
  return confirmationDeuxTemps({
    libelle,
    question: 'Effacer définitivement toutes les données ?',
    detail: 'Tous les élèves, leurs photos, la progression, les réglages et le mot de passe '
      + 'seront supprimés de cet appareil. Cette action est irréversible.',
    libelleConfirmer: 'Oui, tout effacer',
    action: async () => {
      await Base.detruire(() => annoncer("Fermez les autres onglets de l'application pour terminer l'effacement."));
      location.hash = '';
      location.reload();
    },
  });
}
