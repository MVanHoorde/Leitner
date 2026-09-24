/* Accueil, élèves, réglages. */

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

function rappelConservation() {
  const { premierImport } = Etat.suivi;
  if (!premierImport) return null;
  const jours = Dates.ecart(premierImport, Dates.aujourdhui());
  if (jours <= 60) return null;
  return el('section', { class: 'alerte pile', role: 'alert' },
    el('h2', { text: `Données conservées depuis ${jours} jours` }),
    el('p', { text: "Cette application contient des photos d'élèves. Si vous n'en avez plus "
      + "l'usage, effacez-les de cette tablette." }),
    effacementComplet('Effacer toutes les données maintenant'));
}

Ecrans.accueil = {
  titre: 'Reconnaître mes élèves',
  titreCourt: 'Accueil',
  parent: null,
  rendre(zone) {
    const pile = el('div', { class: 'pile' });
    zone.append(pile);
    const { premierImport } = Etat.suivi;

    const rappel = rappelConservation();
    if (rappel) pile.append(rappel);

    if (!Etat.eleves.size) {
      pile.append(
        el('section', { class: 'panneau pile' },
          el('h2', { text: 'Bienvenue' }),
          el('p', { text: 'Importez le trombinoscope PDF d’une classe pour commencer. '
            + 'Chaque fichier correspond à une classe.' })),
        boutonMenu('Importer un trombinoscope PDF', 'Une classe par fichier', () => aller('import'), 'principal'),
        boutonMenu('Essayer avec des élèves fictifs', '36 élèves répartis en 3 classes', (e) => chargerDemo(e.currentTarget)),
        boutonMenu('Paquets de révision', 'Essayer les cartes proposées aux élèves', () => aller('paquets')),
        boutonMenu('Réglages et sauvegarde', 'Réimporter une sauvegarde, effacement', () => aller('reglages')),
        boutonVerrouiller(),
        boutonChangerPorte());
      return;
    }

    const jour = Dates.aujourdhui();
    const bilan = Leitner.bilan(null, jour);
    const classes = Etat.classes();
    const aFaire = bilan.dues.length + bilan.nouvellesDuJour;
    const detailRevision = bilan.sessionAlgoFaite
      ? 'Session du jour faite · entraînement libre'
      : `${pluriel(bilan.dues.length, 'carte due', 'cartes dues')} · ${pluriel(bilan.nouvellesDuJour, 'nouvelle')} · ${estimerDuree(aFaire)}`;

    pile.append(
      boutonMenu('Réviser', detailRevision, () => aller('reviser'), 'principal'),
      boutonMenu('Prochain cours', 'Revoir une classe avant d’entrer en salle', () => aller('prochain-cours')),
      boutonMenu('Tableau de bord', 'Progression, objectif, suivi par élève', () => aller('tableau')),
      boutonMenu('Élèves', `${pluriel(Etat.eleves.size, 'élève')} · ${pluriel(classes.length, 'classe')}`, () => aller('eleves')),
      boutonMenu('Importer un trombinoscope PDF', 'Ajouter une classe', () => aller('import')),
      boutonMenu('Paquets de révision', `${pluriel(Paquets.liste.length, 'paquet')} de contenu · côté élève`, () => aller('paquets')),
      boutonMenu('Réglages et sauvegarde', 'Charge de travail, export, effacement', () => aller('reglages')));

    if (premierImport) {
      const jours = Dates.ecart(premierImport, jour);
      pile.append(el('p', { class: 'discret' },
        `Premier import le ${Dates.formater(premierImport)} (${Dates.depuis(jours)}).`));
    }
    pile.append(boutonVerrouiller(), boutonChangerPorte());
  },
};

function boutonVerrouiller() {
  return el('button', { type: 'button', class: 'bouton bloc', onclick: () => Verrou.verrouiller() }, 'Verrouiller');
}

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
      el('span', { class: 'tuile-nom', text: nomComplet(e) }),
      el('span', { class: 'tuile-classe', text: e.classe }))));
    };
    zone.append(el('div', { class: 'pile' }, filtreClasses(remplir), compteur, grille));
    remplir();
  },
};

function statistiquesEleve(carte) {
  return el('dl', { class: 'stats' },
    el('dt', { text: 'Compartiment' }),
    el('dd', { text: carte.introduite ? `${carte.compartiment} sur 5` : 'Pas encore étudié' }),
    el('dt', { text: 'Passages' }), el('dd', { text: carte.passages }),
    el('dt', { text: 'Réussites' }), el('dd', { text: carte.reussites }),
    el('dt', { text: 'Prochaine révision' }),
    el('dd', { text: carte.echeance ? Dates.formater(carte.echeance) : '—' }),
    el('dt', { text: 'Dernier échec' }),
    el('dd', { text: carte.dernierEchec ? Dates.formater(carte.dernierEchec) : 'Aucun' }));
}

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
    definirTitre(nomComplet(eleve));

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
      const maj = await Etat.modifierEleve({ ...Etat.eleves.get(id), nom: nom.value, prenom: prenom.value, classe: classe.value });
      definirTitre(nomComplet(maj));
      annoncer('Fiche enregistrée.');
    });

    zone.append(el('div', { class: 'pile' },
      photoEleve(eleve, 'photo-fiche'),
      formulaire,
      el('section', { class: 'panneau' }, el('h3', { text: 'Progression' }), statistiquesEleve(Etat.cartes.get(id))),
      confirmationDeuxTemps({
        libelle: 'Supprimer cet élève',
        question: `Supprimer ${nomComplet(eleve)} ?`,
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

    const dejaDemo = demoDejaChargee();
    const boutonDemo = el('button', { type: 'button', class: 'bouton bloc', disabled: dejaDemo },
      dejaDemo ? 'Élèves fictifs déjà chargés' : 'Ajouter 36 élèves fictifs');
    boutonDemo.addEventListener('click', () => chargerDemo(boutonDemo));

    zone.append(el('div', { class: 'pile' },
      el('section', { class: 'panneau pile' },
        el('h2', { text: 'Charge de travail' }),
        champReglage('Nouvelles cartes par jour', 'nouvellesParJour', 1, 150),
        champReglage('Cartes par série', 'tailleSession', 5, 200, 'Un bouton « continuer » permet d’aller au-delà.'),
        champReglage('Cartes en retard traitées au maximum', 'plafondRetard', 5, 500,
          'En cas de gros retard, seules les plus anciennes sont proposées.')),

      sectionSauvegarde(),
      sectionMotDePasse(),

      el('section', { class: 'panneau pile' },
        el('h2', { text: 'Stockage' }),
        etatStockage),

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
        el('p', { text: 'Supprime la base de données entière de cet appareil : élèves, photos, progression, mot de passe.' }),
        effacementComplet())));

    const persistant = navigator.storage && navigator.storage.persisted ? await navigator.storage.persisted() : false;
    const estimation = navigator.storage && navigator.storage.estimate ? await navigator.storage.estimate() : null;
    etatStockage.textContent = (persistant
      ? 'Stockage persistant accordé : le navigateur ne purgera pas les données.'
      : 'Stockage non persistant : le navigateur pourrait purger les données en cas de manque d’espace.')
      + (estimation ? ` Espace utilisé : ${formaterOctets(estimation.usage || 0)}.` : '');
  },
};
