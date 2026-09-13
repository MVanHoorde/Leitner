/* Tableau de bord : répartition, charge du jour, objectif daté, suivi par élève. */

const SVG_NS = 'http://www.w3.org/2000/svg';

function svg(balise, attributs, ...enfants) {
  const noeud = document.createElementNS(SVG_NS, balise);
  for (const [cle, valeur] of Object.entries(attributs || {})) {
    if (cle === 'text') noeud.textContent = valeur;
    else noeud.setAttribute(cle, String(valeur));
  }
  for (const enfant of enfants.flat()) if (enfant) noeud.append(enfant);
  return noeud;
}

const CATEGORIES = [
  { libelle: 'Jamais vues', couleur: '#B8C4D6', test: (c) => c.introduite === null },
  { libelle: 'Compartiment 1', couleur: '#E8792E', test: (c) => c.introduite !== null && c.compartiment === 1 },
  { libelle: 'Compartiment 2', couleur: '#F2AE7C', test: (c) => c.introduite !== null && c.compartiment === 2 },
  { libelle: 'Compartiment 3', couleur: '#8CCBF8', test: (c) => c.introduite !== null && c.compartiment === 3 },
  { libelle: 'Compartiment 4', couleur: '#3FA9F5', test: (c) => c.introduite !== null && c.compartiment === 4 },
  { libelle: 'Compartiment 5', couleur: '#1B2A4A', test: (c) => c.introduite !== null && c.compartiment === 5 },
];

function graphiqueCompartiments(cartes) {
  const largeur = 600;
  const hauteurLigne = 46;
  const margeLibelle = 150;
  const margeNombre = 50;
  const echelle = largeur - margeLibelle - margeNombre;
  const comptes = CATEGORIES.map((cat) => cartes.filter(cat.test).length);
  const maximum = Math.max(1, ...comptes);

  return svg('svg', {
    viewBox: `0 0 ${largeur} ${CATEGORIES.length * hauteurLigne}`,
    class: 'graphique',
    role: 'img',
    'aria-label': CATEGORIES.map((cat, i) => `${cat.libelle} : ${comptes[i]}`).join(', '),
  }, CATEGORIES.map((cat, i) => {
    const y = i * hauteurLigne;
    const longueur = comptes[i] ? Math.max(4, (comptes[i] / maximum) * echelle) : 0;
    return svg('g', {},
      svg('text', { x: 0, y: y + 28, 'font-size': 17, fill: '#1B2A4A', text: cat.libelle }),
      svg('rect', { x: margeLibelle, y: y + 10, width: echelle, height: 26, rx: 4, fill: '#EEF2F8' }),
      longueur && svg('rect', { x: margeLibelle, y: y + 10, width: longueur, height: 26, rx: 4, fill: cat.couleur }),
      svg('text', { x: largeur, y: y + 29, 'font-size': 18, 'font-weight': 700, 'text-anchor': 'end', fill: '#1B2A4A', text: comptes[i] }));
  }));
}

/* ---------- Objectif daté ---------- */

const MARGE_ECHECS = 1.25;

/**
 * « Connaître tout le monde » = toutes les cartes au compartiment 5.
 * Une carte nouvelle y parvient au plus tôt après 4 réussites espacées de 2, 3 et 5 jours.
 */
function analyserObjectif(cartes, objectif, jour) {
  const joursRestants = Dates.ecart(jour, objectif);
  const nouvelles = cartes.filter((c) => c.introduite === null);
  const enCours = cartes.filter((c) => c.introduite !== null && c.compartiment < 5);
  const delaiNouvelle = Leitner.joursAvantMaitrise({ introduite: null }, jour);
  const plafond = Etat.reglages.nouvellesParJour;
  const premierJourIntro = Leitner.sessionAlgoFaite(jour) ? 1 : 0;

  // Jours (à partir d'aujourd'hui) où l'on peut encore introduire une carte et la maîtriser à temps.
  const joursIntroduction = joursRestants - delaiNouvelle - premierJourIntro + 1;
  const nouvellesParJour = nouvelles.length
    ? (joursIntroduction >= 1 ? Math.ceil(nouvelles.length / joursIntroduction) : Infinity)
    : 0;
  const retardataires = enCours.filter((c) => Leitner.joursAvantMaitrise(c, jour) > joursRestants).length;
  const revisions = [...nouvelles, ...enCours].reduce((s, c) => s + Leitner.revisionsRestantes(c), 0);
  const cartesParJour = joursRestants > 0 ? Math.ceil((revisions * MARGE_ECHECS) / joursRestants) : revisions;

  // Date au plus tôt avec le plafond actuel
  const finIntro = nouvelles.length ? premierJourIntro + Math.ceil(nouvelles.length / plafond) - 1 + delaiNouvelle : 0;
  const finEnCours = enCours.reduce((m, c) => Math.max(m, Leitner.joursAvantMaitrise(c, jour)), 0);
  const auPlusTot = Dates.ajouter(jour, Math.max(finIntro, finEnCours));

  const faisable = joursRestants >= 0 && retardataires === 0 && Number.isFinite(nouvellesParJour);
  return {
    joursRestants,
    nouvelles: nouvelles.length,
    enCours: enCours.length,
    maitrisees: cartes.length - nouvelles.length - enCours.length,
    nouvellesParJour,
    cartesParJour,
    retardataires,
    auPlusTot,
    faisable,
    atteignable: faisable && nouvellesParJour <= plafond,
  };
}

function sectionObjectif() {
  const section = el('section', { class: 'panneau pile' });
  const resultat = el('div', { class: 'pile' });
  const entree = el('input', { type: 'date', value: Etat.reglages.objectif || '', min: Dates.aujourdhui() });

  const majResultat = () => {
    resultat.replaceChildren();
    const objectif = Etat.reglages.objectif;
    const cartes = [...Etat.cartes.values()];
    if (!objectif || !cartes.length) {
      resultat.append(el('p', { class: 'discret', text: 'Choisissez la date à laquelle vous voulez reconnaître tous vos élèves.' }));
      return;
    }
    const jour = Dates.aujourdhui();
    const a = analyserObjectif(cartes, objectif, jour);
    const plafond = Etat.reglages.nouvellesParJour;

    resultat.append(el('div', { class: 'chiffres' },
      chiffre(Math.max(0, a.joursRestants), 'jours restants'),
      chiffre(Number.isFinite(a.nouvellesParJour) ? a.nouvellesParJour : '—', 'nouvelles cartes / jour'),
      chiffre(a.cartesParJour, 'cartes à traiter / jour')));

    if (a.joursRestants < 0) {
      resultat.append(el('div', { class: 'alerte' }, el('p', { text: 'Cette date est passée.' })));
    } else if (a.atteignable) {
      resultat.append(el('div', { class: 'succes' },
        el('p', {}, el('strong', { text: 'Objectif atteignable avec les intervalles actuels.' })),
        el('p', { text: a.nouvelles
          ? `Introduisez au moins ${pluriel(a.nouvellesParJour, 'nouvelle carte', 'nouvelles cartes')} par jour `
            + `(réglage actuel : ${plafond}) et faites la session chaque jour.`
          : 'Toutes les cartes sont déjà en cours d’apprentissage : faites la session chaque jour.' })));
    } else if (a.faisable) {
      const bouton = el('button', { type: 'button', class: 'bouton principal' }, `Passer à ${a.nouvellesParJour} nouvelles cartes par jour`);
      bouton.addEventListener('click', async () => {
        await Etat.enregistrerReglages({ nouvellesParJour: a.nouvellesParJour });
        annoncer('Réglage enregistré.');
        majResultat();
      });
      resultat.append(el('div', { class: 'alerte pile' },
        el('p', {}, el('strong', { text: `Pas atteignable avec ${plafond} nouvelles cartes par jour.` })),
        el('p', { text: `Il faudrait en introduire ${a.nouvellesParJour} par jour. `
          + `Avec le réglage actuel, date au plus tôt : ${Dates.formater(a.auPlusTot)}.` }),
        bouton));
    } else {
      resultat.append(el('div', { class: 'alerte pile' },
        el('p', {}, el('strong', { text: 'Objectif non atteignable avec les intervalles actuels.' })),
        el('p', { text: `Sans aucune erreur, une nouvelle carte met ${Leitner.joursAvantMaitrise({ introduite: null }, jour)} jours `
          + `à atteindre le compartiment 5. Date au plus tôt : ${Dates.formater(a.auPlusTot)}.` })));
    }

    resultat.append(el('p', { class: 'discret', text: `${a.maitrisees} maîtrisées (compartiment 5), `
      + `${a.enCours} en cours, ${a.nouvelles} jamais vues. Toutes classes confondues.` }));
  };

  entree.addEventListener('change', async () => {
    await Etat.enregistrerReglages({ objectif: entree.value || null });
    majResultat();
  });

  section.append(
    el('h2', { text: 'Objectif' }),
    champ('Je veux reconnaître tout le monde le', entree, 'Reconnaître = carte au compartiment 5.'),
    resultat);
  majResultat();
  return section;
}

/* ---------- Suivi par élève ---------- */

function tableauEleves(classe) {
  const cartes = Leitner.trierParFragilite(Leitner.cartesDeClasse(classe));
  const lignes = cartes.map((carte) => {
    const eleve = Etat.eleves.get(carte.id);
    return el('tr', { onclick: () => aller('eleve', eleve.id) },
      el('td', {}, el('div', { class: 'cellule-eleve' },
        photoEleve(eleve, 'mini'),
        el('span', {}, el('strong', { text: nomComplet(eleve) }), el('br'), el('span', { class: 'discret', text: eleve.classe })))),
      el('td', { class: 'centre', text: carte.introduite ? carte.compartiment : '—' }),
      el('td', { class: 'centre', text: carte.passages }),
      el('td', { text: carte.dernierEchec ? Dates.formater(carte.dernierEchec) : 'Aucun' }));
  });
  return el('div', { class: 'defilement' },
    el('table', { class: 'tableau' },
      el('thead', {}, el('tr', {},
        el('th', { text: 'Élève' }),
        el('th', { class: 'centre', text: 'Compartiment' }),
        el('th', { class: 'centre', text: 'Passages' }),
        el('th', { text: 'Dernier échec' }))),
      el('tbody', {}, lignes)));
}

Ecrans.tableau = {
  titre: 'Tableau de bord',
  titreCourt: 'Tableau de bord',
  parent: 'accueil',
  rendre(zone) {
    if (!Etat.eleves.size) {
      zone.append(el('p', { text: 'Aucun élève enregistré.' }));
      return;
    }
    const vue = el('div', { class: 'pile' });
    const remplir = () => {
      const jour = Dates.aujourdhui();
      const b = Leitner.bilan(Etat.filtreClasse, jour);
      // Les nouvelles cartes ne sont introduites que pendant la session du jour.
      const nouvelles = b.sessionAlgoFaite ? 0 : b.nouvellesDuJour;
      const serie = Math.min(Etat.reglages.tailleSession, b.dues.length + nouvelles);
      vue.replaceChildren(
        el('div', { class: 'chiffres' },
          chiffre(b.dues.length, b.enRetard ? `dues aujourd’hui, dont ${b.enRetard} en retard` : 'dues aujourd’hui'),
          chiffre(nouvelles, 'nouvelles possibles'),
          chiffre(estimerDuree(b.dues.length + nouvelles), `session (série de ${serie} : ${estimerDuree(serie)})`)),
        b.sessionAlgoFaite && el('div', { class: 'bandeau-libre' }, 'Session du jour faite : la suite est en entraînement libre.'),
        el('section', { class: 'panneau pile' },
          el('h2', { text: 'Répartition des cartes' }),
          graphiqueCompartiments(b.cartes)),
        el('section', { class: 'panneau pile' },
          el('h2', { text: 'Par élève' }),
          el('p', { class: 'discret', text: 'Les plus fragiles d’abord. Touchez une ligne pour ouvrir la fiche.' }),
          tableauEleves(Etat.filtreClasse)));
    };
    zone.append(el('div', { class: 'pile' }, filtreClasses(remplir), vue, sectionObjectif()));
    remplir();
  },
};
