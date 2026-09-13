/* Navigation par ancre (#/ecran/parametre) et écrans. */

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

async function afficher() {
  const { nom, param } = lireRoute();
  const ecran = Ecrans[nom] || Ecrans.accueil;
  const zone = $('#ecran');
  zone.replaceChildren();
  definirTitre(ecran.titre);
  majBandeauDate();

  const retour = $('#retour');
  retour.hidden = !ecran.parent;
  if (ecran.parent) {
    retour.textContent = `‹ ${Ecrans[ecran.parent].titreCourt}`;
    retour.onclick = () => aller(ecran.parent);
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

function effacementComplet(libelle = 'Tout effacer') {
  return confirmationDeuxTemps({
    libelle,
    question: 'Effacer définitivement toutes les données ?',
    detail: `${pluriel(Etat.eleves.size, 'élève')}, leurs photos, la progression et les réglages `
      + 'seront supprimés de cet appareil. Cette action est irréversible.',
    libelleConfirmer: 'Oui, tout effacer',
    action: async () => {
      await Base.detruire(() => annoncer("Fermez les autres onglets de l'application pour terminer l'effacement."));
      location.hash = '';
      location.reload();
    },
  });
}

async function chargerDemo(bouton) {
  bouton.disabled = true;
  bouton.textContent = 'Génération des élèves fictifs…';
  await new Promise((r) => setTimeout(r, 20));
  try {
    const eleves = await Etat.ajouterEleves(genererDemo());
    annoncer(`${pluriel(eleves.length, 'élève fictif', 'élèves fictifs')} ajoutés.`);
    aller('eleves');
  } catch (erreur) {
    annoncer(`Échec : ${erreur.message}`);
    bouton.disabled = false;
  }
}

/* ---------- Accueil ---------- */

Ecrans.accueil = {
  titre: 'Reconnaître mes élèves',
  titreCourt: 'Accueil',
  parent: null,
  rendre(zone) {
    const pile = el('div', { class: 'pile' });
    zone.append(pile);
    const { premierImport } = Etat.suivi;

    if (premierImport) {
      const jours = Dates.ecart(premierImport, Dates.aujourdhui());
      if (jours > 60) {
        pile.append(el('section', { class: 'alerte pile', role: 'alert' },
          el('h2', { text: `Données conservées depuis ${jours} jours` }),
          el('p', { text: "Cette application contient des photos d'élèves. Si vous n'en avez plus "
            + "l'usage, effacez-les de cette tablette." }),
          effacementComplet('Effacer toutes les données maintenant')));
      }
    }

    if (!Etat.eleves.size) {
      pile.append(
        el('section', { class: 'panneau pile' },
          el('h2', { text: 'Bienvenue' }),
          el('p', { text: 'Importez le trombinoscope PDF d’une classe pour commencer. '
            + 'Chaque fichier correspond à une classe.' })),
        boutonMenu('Importer un trombinoscope PDF', 'Une classe par fichier', () => aller('import'), 'principal'),
        boutonMenu('Essayer avec des élèves fictifs', '36 élèves répartis en 3 classes', (e) => chargerDemo(e.currentTarget)),
        boutonMenu('Réglages', null, () => aller('reglages')));
      return;
    }

    const classes = Etat.classes();
    pile.append(
      el('div', { class: 'chiffres' },
        el('div', { class: 'chiffre' }, el('strong', { text: Etat.eleves.size }), el('span', { text: 'élèves' })),
        el('div', { class: 'chiffre' }, el('strong', { text: classes.length }), el('span', { text: 'classes' }))),
      boutonMenu('Réviser', 'Session du jour', () => aller('reviser'), 'principal'),
      boutonMenu('Prochain cours', 'Revoir une classe avant d’entrer en salle', () => aller('prochain-cours')),
      boutonMenu('Tableau de bord', 'Progression et objectif', () => aller('tableau')),
      boutonMenu('Élèves', `${pluriel(Etat.eleves.size, 'élève')} · ${pluriel(classes.length, 'classe')}`, () => aller('eleves')),
      boutonMenu('Importer un trombinoscope PDF', 'Ajouter une classe', () => aller('import')),
      boutonMenu('Réglages et sauvegarde', 'Charge de travail, export, effacement', () => aller('reglages')));

    if (premierImport) {
      const jours = Dates.ecart(premierImport, Dates.aujourdhui());
      pile.append(el('p', { class: 'discret' },
        `Premier import le ${Dates.formater(premierImport)} (${Dates.depuis(jours)}).`));
    }
  },
};

/* ---------- Écrans des étapes suivantes ---------- */

function ecranAVenir(titre, titreCourt, etape, contenu) {
  return {
    titre,
    titreCourt,
    parent: 'accueil',
    rendre(zone) {
      zone.append(el('div', { class: 'panneau pile' },
        el('h2', { text: `Prévu à l’étape ${etape}` }),
        el('p', { text: contenu })));
    },
  };
}

Ecrans.reviser = ecranAVenir('Réviser', 'Réviser', 2, 'Moteur Leitner et les trois modes de révision.');
Ecrans['prochain-cours'] = ecranAVenir('Prochain cours', 'Prochain cours', 2, 'Entraînement libre sur une classe.');
Ecrans.tableau = ecranAVenir('Tableau de bord', 'Tableau de bord', 3, 'Répartition par compartiment et objectif daté.');
Ecrans.import = ecranAVenir('Importer un trombinoscope', 'Import', 4, 'Lecture du PDF, appariement manuel et vérification.');

/* ---------- Élèves ---------- */

Ecrans.eleves = {
  titre: 'Élèves',
  titreCourt: 'Élèves',
  parent: 'accueil',
  rendre(zone) {
    if (!Etat.eleves.size) {
      zone.append(el('p', { text: 'Aucun élève enregistré.' }));
      return;
    }
    const compteur = el('p', { class: 'discret' });
    const grille = el('div', { class: 'grille-eleves' });
    const remplir = () => {
      const liste = Etat.listeEleves(Etat.filtreClasse);
      compteur.textContent = pluriel(liste.length, 'élève');
      grille.replaceChildren(...liste.map((e) => el('button', {
        type: 'button',
        class: 'tuile-eleve',
        onclick: () => aller('eleve', e.id),
      },
      photoEleve(e, 'vignette'),
      el('span', { class: 'tuile-nom', text: `${e.prenom} ${e.nom}` }),
      el('span', { class: 'tuile-classe', text: e.classe }))));
    };
    zone.append(el('div', { class: 'pile' }, filtreClasses(remplir), compteur, grille));
    remplir();
  },
};

Ecrans.eleve = {
  titre: 'Fiche élève',
  titreCourt: 'Fiche',
  parent: 'eleves',
  rendre(zone, id) {
    const eleve = Etat.eleves.get(id);
    if (!eleve) {
      zone.append(el('p', { text: 'Élève introuvable.' }));
      return;
    }
    definirTitre(`${eleve.prenom} ${eleve.nom}`);
    const carte = Etat.cartes.get(id);

    const nom = el('input', { type: 'text', value: eleve.nom, autocomplete: 'off', required: true });
    const prenom = el('input', { type: 'text', value: eleve.prenom, autocomplete: 'off' });
    const classe = el('input', { type: 'text', value: eleve.classe, autocomplete: 'off', list: 'liste-classes' });
    const listeClasses = el('datalist', { id: 'liste-classes' }, Etat.classes().map((c) => el('option', { value: c })));

    const formulaire = el('form', { class: 'panneau pile' },
      champ('Nom', nom), champ('Prénom', prenom), champ('Classe', classe), listeClasses,
      el('button', { type: 'submit', class: 'bouton principal bloc' }, 'Enregistrer les modifications'));
    formulaire.addEventListener('submit', async (evenement) => {
      evenement.preventDefault();
      if (!nom.value.trim()) {
        annoncer('Le nom est obligatoire.');
        return;
      }
      const maj = await Etat.modifierEleve({ ...eleve, nom: nom.value, prenom: prenom.value, classe: classe.value });
      definirTitre(`${maj.prenom} ${maj.nom}`);
      annoncer('Fiche enregistrée.');
    });

    const stats = el('dl', { class: 'stats' },
      el('dt', { text: 'Compartiment' }), el('dd', { text: carte.introduite ? `${carte.compartiment} sur 5` : 'Pas encore étudiée' }),
      el('dt', { text: 'Passages' }), el('dd', { text: carte.passages }),
      el('dt', { text: 'Dernier échec' }), el('dd', { text: carte.dernierEchec ? Dates.formater(carte.dernierEchec) : 'Aucun' }));

    zone.append(el('div', { class: 'pile' },
      photoEleve(eleve, 'photo-fiche'),
      formulaire,
      el('section', { class: 'panneau' }, el('h3', { text: 'Progression' }), stats),
      confirmationDeuxTemps({
        libelle: 'Supprimer cet élève',
        question: `Supprimer ${eleve.prenom} ${eleve.nom} ?`,
        detail: 'Sa photo et sa progression seront effacées.',
        libelleConfirmer: 'Oui, supprimer',
        action: async () => {
          await Etat.supprimerEleve(id);
          annoncer('Élève supprimé.');
          aller('eleves');
        },
      })));
  },
};

/* ---------- Réglages ---------- */

function champReglage(libelle, cle, min, max, aide) {
  const entree = el('input', { type: 'number', inputmode: 'numeric', min, max, step: 1, value: Etat.reglages[cle] });
  entree.addEventListener('change', async () => {
    let valeur = Math.round(Number(entree.value));
    if (!Number.isFinite(valeur) || entree.value === '') valeur = REGLAGES_DEFAUT[cle];
    valeur = Math.min(max, Math.max(min, valeur));
    entree.value = valeur;
    await Etat.enregistrerReglages({ [cle]: valeur });
    annoncer('Réglage enregistré.');
  });
  return champ(libelle, entree, aide);
}

async function decalerDate(jours) {
  const decalage = jours === null ? 0 : Etat.reglages.decalageJours + jours;
  await Etat.enregistrerReglages({ decalageJours: decalage });
  Dates.decalage = decalage;
  afficher();
}

Ecrans.reglages = {
  titre: 'Réglages et sauvegarde',
  titreCourt: 'Réglages',
  parent: 'accueil',
  async rendre(zone) {
    const etatStockage = el('p', { class: 'discret', text: 'Vérification du stockage…' });

    const boutonDemo = el('button', { type: 'button', class: 'bouton bloc' },
      demoDejaChargee() ? 'Élèves fictifs déjà chargés' : 'Ajouter 36 élèves fictifs');
    boutonDemo.disabled = demoDejaChargee();
    boutonDemo.addEventListener('click', () => chargerDemo(boutonDemo));

    zone.append(el('div', { class: 'pile' },
      el('section', { class: 'panneau pile' },
        el('h2', { text: 'Charge de travail' }),
        champReglage('Nouvelles cartes par jour', 'nouvellesParJour', 1, 150),
        champReglage('Cartes par session', 'tailleSession', 5, 200, 'Un bouton « continuer » permet d’aller au-delà.'),
        champReglage('Cartes en retard traitées au maximum', 'plafondRetard', 5, 500,
          'En cas de gros retard, seules les plus anciennes sont proposées.')),

      el('section', { class: 'panneau pile' },
        el('h2', { text: 'Stockage' }),
        etatStockage),

      el('section', { class: 'panneau pile' },
        el('h2', { text: 'Sauvegarde' }),
        el('p', { class: 'discret', text: 'Export et réimport JSON : prévus à l’étape 5.' })),

      el('section', { class: 'panneau pile' },
        el('h2', { text: 'Données de démonstration' }),
        el('p', { class: 'discret', text: 'Noms inventés et visages dessinés, pour tester sans PDF.' }),
        boutonDemo),

      el('section', { class: 'panneau pile' },
        el('h2', { text: 'Test : simuler une date' }),
        el('p', { class: 'discret', text: `Date utilisée : ${Dates.formater(Dates.aujourdhui(), true)}. `
          + 'Permet de vérifier le passage des jours et le rappel des 60 jours.' }),
        el('div', { class: 'rangee' },
          el('button', { type: 'button', class: 'bouton', onclick: () => decalerDate(-1) }, '− 1 jour'),
          el('button', { type: 'button', class: 'bouton', onclick: () => decalerDate(1) }, '+ 1 jour'),
          el('button', { type: 'button', class: 'bouton', onclick: () => decalerDate(7) }, '+ 7 jours'),
          el('button', { type: 'button', class: 'bouton', onclick: () => decalerDate(null), disabled: Dates.decalage === 0 }, 'Date réelle'))),

      el('section', { class: 'panneau pile' },
        el('h2', { text: 'Effacement' }),
        el('p', { text: 'Supprime la base de données entière de cet appareil.' }),
        effacementComplet())));

    const persistant = navigator.storage && navigator.storage.persisted ? await navigator.storage.persisted() : false;
    const estimation = navigator.storage && navigator.storage.estimate ? await navigator.storage.estimate() : null;
    etatStockage.textContent = (persistant
      ? 'Stockage persistant accordé : le navigateur ne purgera pas les données.'
      : 'Stockage non persistant : le navigateur pourrait purger les données en cas de manque d’espace.')
      + (estimation ? ` Espace utilisé : ${formaterOctets(estimation.usage || 0)}.` : '');
  },
};
