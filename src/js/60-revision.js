/* Écrans de révision : préparation, carte, fin de série, prochain cours. */

function lancerSession(options) {
  const nombre = Session.demarrer(options);
  if (!nombre) {
    Session.arreter();
    annoncer('Aucune carte à réviser pour cette sélection.');
    return;
  }
  aller('session');
}

/** Trois distracteurs pris dans la même classe, pour obliger à regarder le visage. */
function distracteurs(eleve) {
  const memeClasse = melanger(Etat.listeEleves(eleve.classe).filter((e) => e.id !== eleve.id));
  const choix = memeClasse.slice(0, 3);
  if (choix.length < 3) {
    const autres = melanger(Etat.listeEleves().filter((e) => e.classe !== eleve.classe));
    choix.push(...autres.slice(0, 3 - choix.length));
  }
  return choix;
}

function blocIdentite(eleve, variante = '') {
  return el('div', { class: `identite ${variante}` },
    el('div', { class: 'identite-nom', text: nomComplet(eleve) || 'Nom inconnu' }),
    el('div', { class: 'identite-classe', text: eleve.classe }));
}

function selecteurMode(auChangement) {
  return selecteur(Object.entries(MODES), Etat.reglages.modeRevision, async (mode) => {
    await Etat.enregistrerReglages({ modeRevision: mode });
    if (auChangement) auChangement(mode);
  }, 'Mode de révision');
}

/* ---------- Préparation de la session du jour ---------- */

Ecrans.reviser = {
  titre: 'Réviser',
  titreCourt: 'Réviser',
  parent: 'accueil',
  rendre(zone) {
    if (!Etat.eleves.size) {
      zone.append(el('p', { text: 'Aucun élève enregistré. Importez un trombinoscope pour commencer.' }));
      return;
    }
    const infos = el('div', { class: 'pile' });
    const majInfos = () => {
      const jour = Dates.aujourdhui();
      const b = Leitner.bilan(Etat.filtreClasse, jour);
      const taille = Etat.reglages.tailleSession;
      const mode = () => Etat.reglages.modeRevision;
      infos.replaceChildren();

      if (b.sessionAlgoFaite) {
        const disponibles = Leitner.fileLibre(Etat.filtreClasse).length;
        infos.append(
          el('div', { class: 'bandeau-libre' }, 'Entraînement libre : la session du jour est faite. '
            + 'Les compartiments et les dates ne seront pas modifiés.'),
          el('p', { class: 'discret', text: 'Les cartes les plus fragiles passent en premier.' }),
          el('button', {
            type: 'button',
            class: 'bouton principal bloc grand',
            onclick: () => lancerSession({ type: 'libre', mode: mode(), classe: Etat.filtreClasse }),
          }, `S’entraîner (${Math.min(taille, disponibles)} cartes)`));
        return;
      }

      const total = b.dues.length + b.nouvellesDuJour;
      infos.append(el('div', { class: 'chiffres' },
        chiffre(b.dues.length, b.enRetard ? `dues, dont ${b.enRetard} en retard` : 'cartes dues'),
        chiffre(b.nouvellesDuJour, b.nouvellesDuJour > 1 ? 'nouvelles' : 'nouvelle'),
        chiffre(estimerDuree(total), 'pour tout traiter')));

      if (!total) {
        infos.append(
          el('div', { class: 'panneau' }, el('p', { text: 'Rien à réviser aujourd’hui pour cette sélection.' })),
          el('button', {
            type: 'button',
            class: 'bouton bloc grand',
            onclick: () => lancerSession({ type: 'libre', mode: mode(), classe: Etat.filtreClasse }),
          }, 'Entraînement libre'));
        return;
      }

      const plafond = Etat.reglages.plafondRetard;
      if (b.dues.length > plafond) {
        infos.append(el('div', { class: 'alerte pile' },
          el('p', {}, el('strong', { text: `${b.dues.length} cartes attendent.` })),
          el('p', { text: `Pour garder des sessions courtes, commencez par les ${plafond} plus anciennes. `
            + 'Les autres resteront dues pour les jours suivants.' }),
          el('button', {
            type: 'button',
            class: 'bouton principal bloc grand',
            onclick: () => lancerSession({ type: 'jour', mode: mode(), classe: Etat.filtreClasse, limiteDues: plafond }),
          }, `Traiter les ${plafond} plus anciennes`),
          el('button', {
            type: 'button',
            class: 'bouton bloc',
            onclick: () => lancerSession({ type: 'jour', mode: mode(), classe: Etat.filtreClasse }),
          }, 'Tout garder dans la file')));
        return;
      }

      infos.append(
        el('p', { class: 'discret', text: `Séries de ${taille} cartes, avec un bouton pour continuer.` }),
        el('button', {
          type: 'button',
          class: 'bouton principal bloc grand',
          onclick: () => lancerSession({ type: 'jour', mode: mode(), classe: Etat.filtreClasse }),
        }, 'Commencer la session du jour'));
    };

    zone.append(el('div', { class: 'pile' },
      el('h2', { text: 'Classe' }),
      filtreClasses(majInfos),
      el('h2', { text: 'Mode' }),
      selecteurMode(),
      infos));
    majInfos();
  },
};

/* ---------- Prochain cours ---------- */

Ecrans['prochain-cours'] = {
  titre: 'Prochain cours',
  titreCourt: 'Prochain cours',
  parent: 'accueil',
  rendre(zone) {
    const classes = Etat.classes();
    if (!classes.length) {
      zone.append(el('p', { text: 'Aucune classe enregistrée.' }));
      return;
    }
    zone.append(el('div', { class: 'pile' },
      el('p', { text: 'Touchez la classe : tous ses élèves défilent, les plus fragiles d’abord. '
        + 'C’est un entraînement libre, la progression n’est pas modifiée.' }),
      selecteurMode(),
      ...classes.map((classe) => {
        const cartes = Leitner.cartesDeClasse(classe);
        const fragiles = cartes.filter((c) => c.introduite === null || c.compartiment <= 2).length;
        return boutonMenu(classe, `${pluriel(cartes.length, 'élève')} · ${fragiles} à consolider`,
          () => lancerSession({ type: 'cours', mode: Etat.reglages.modeRevision, classe }));
      })));
  },
};

/* ---------- Carte en cours ---------- */

Ecrans.session = {
  titre: 'Révision',
  titreCourt: 'Révision',
  parent: 'accueil',
  libelleRetour: 'Arrêter',
  pleinEcran: true,
  surRetour() {
    const retour = Session.active && Session.active.type === 'cours' ? 'prochain-cours' : 'reviser';
    Session.arreter();
    aller(retour);
  },
  rendre(zone) {
    const s = Session.active;
    if (!s) {
      document.body.classList.remove('plein');
      zone.append(el('div', { class: 'pile' },
        el('p', { text: 'Aucune session en cours.' }),
        el('button', { type: 'button', class: 'bouton principal', onclick: () => aller('reviser') }, 'Réviser')));
      return;
    }
    let element = Session.elementCourant();
    while (element && !Etat.eleves.has(element.id)) {
      s.position += 1;
      element = Session.elementCourant();
    }
    if (element) rendreCarte(zone, element);
    else rendreFinDeSerie(zone);
  },
};

function rendreCarte(zone, element) {
  const s = Session.active;
  const eleve = Etat.eleves.get(element.id);
  const carte = Etat.cartes.get(element.id);
  definirTitre(s.type === 'cours' ? `Prochain cours · ${s.classe}` : MODES[s.mode]);

  const scene = el('div', { class: 'scene' });
  const panneau = el('div', { class: 'panneau-reponse' });
  zone.append(el('div', { class: 'revision' },
    !s.algo && el('div', { class: 'bandeau-libre' },
      'Entraînement libre : compartiments et dates inchangés'),
    el('div', { class: 'revision-entete' },
      el('span', { text: `Carte ${s.position + 1} sur ${s.file.length}` }),
      element.reprise && el('span', { class: 'badge', text: 'À revoir' }),
      s.algo && carte.introduite === null && el('span', { class: 'badge', text: 'Nouvel élève' }),
      s.classe === null && el('span', { text: eleve.classe })),
    el('div', { class: 'carte-revision' }, scene, panneau)));

  if (s.mode === 'qcm') modeQcm(eleve, element, scene, panneau);
  else modeRetournement(eleve, s.mode, scene, panneau);
}

/** surReponse reçoit le verdict et se charge de noter puis de réafficher ;
 *  par défaut, la session du trombinoscope. */
function boutonsAutoEvaluation(surReponse = null) {
  const repondre = async (reussi) => {
    for (const b of rangee.querySelectorAll('button')) b.disabled = true;
    toucheEcran = null;
    if (surReponse) {
      await surReponse(reussi);
      return;
    }
    await Session.repondre(reussi);
    afficher();
  };
  const rangee = el('div', { class: 'rangee auto-evaluation' },
    el('button', { type: 'button', class: 'bouton accent grand', onclick: () => repondre(false) }, 'Je ne savais pas'),
    el('button', { type: 'button', class: 'bouton principal grand', onclick: () => repondre(true) }, 'Je savais'));
  toucheEcran = (e) => {
    if (e.key === 'ArrowLeft' || e.key === '1') repondre(false);
    if (e.key === 'ArrowRight' || e.key === '2') repondre(true);
  };
  return rangee;
}

/** Modes 1 et 2 : on se représente la réponse, on retourne la carte, on s'auto-évalue. */
function modeRetournement(eleve, mode, scene, panneau) {
  if (mode === 'photo') scene.append(photoEleve(eleve, 'photo-revision'));
  else scene.append(blocIdentite(eleve, 'grande'));

  const retourner = () => {
    if (mode === 'identite') scene.replaceChildren(photoEleve(eleve, 'photo-revision'));
    panneau.replaceChildren(blocIdentite(eleve), boutonsAutoEvaluation());
  };
  panneau.append(
    el('p', { class: 'consigne', text: mode === 'photo'
      ? 'Nom, prénom, classe ?'
      : 'Représentez-vous son visage.' }),
    el('button', { type: 'button', class: 'bouton principal bloc grand', onclick: retourner }, 'Retourner la carte'));
  toucheEcran = (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      retourner();
    }
  };
}

/** Mode 3 : quatre noms de la même classe, correction automatique. */
function modeQcm(eleve, element, scene, panneau) {
  if (!element.options) element.options = melanger([eleve, ...distracteurs(eleve)]).map((e) => e.id);
  scene.append(photoEleve(eleve, 'photo-revision'));

  const suite = el('div', { class: 'pile' });
  const grille = el('div', { class: 'choix' });
  let repondu = false;

  const choisir = async (id, bouton) => {
    if (repondu) return;
    repondu = true;
    const reussi = id === eleve.id;
    for (const b of grille.children) {
      b.disabled = true;
      if (b.dataset.id === eleve.id) b.classList.add('juste');
      else if (b === bouton) b.classList.add('faux');
    }
    toucheEcran = null;
    await Session.repondre(reussi);
    suite.replaceChildren(
      el('p', { class: 'verdict', text: reussi ? 'Bonne réponse' : `C’était ${nomComplet(eleve)}` }),
      el('button', { type: 'button', class: 'bouton principal bloc grand', onclick: afficher }, 'Suivant'));
    toucheEcran = (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        afficher();
      }
    };
  };

  for (const id of element.options) {
    const option = Etat.eleves.get(id);
    if (!option) continue;
    const bouton = el('button', { type: 'button', class: 'bouton', 'data-id': id }, nomComplet(option));
    bouton.addEventListener('click', () => choisir(id, bouton));
    grille.append(bouton);
  }
  panneau.append(grille, suite);
  toucheEcran = (e) => {
    const rang = Number(e.key);
    if (rang >= 1 && rang <= grille.children.length) grille.children[rang - 1].click();
  };
}

/* ---------- Fin de série ---------- */

function rendreFinDeSerie(zone) {
  const s = Session.active;
  document.body.classList.remove('plein');
  definirTitre('Série terminée');
  toucheEcran = null;

  const reussies = s.resultats.filter((r) => r.reussi).length;
  const ratees = s.resultats.filter((r) => !r.reussi).map((r) => Etat.eleves.get(r.id)).filter(Boolean);
  const restant = Session.restant();
  const taille = Math.min(restant, Etat.reglages.tailleSession);

  const pile = el('div', { class: 'pile' },
    el('div', { class: 'chiffres' },
      chiffre(`${reussies} / ${s.resultats.length}`, 'reconnus du premier coup'),
      chiffre(ratees.length, 'à retravailler')));

  if (s.algo) {
    pile.append(el('p', { class: 'discret', text: restant
      ? `Il reste ${pluriel(restant, 'carte')} dans la session du jour.`
      : 'Session du jour terminée. Les prochaines sessions d’aujourd’hui seront en entraînement libre.' }));
  }

  if (ratees.length) {
    pile.append(el('section', { class: 'panneau pile' },
      el('h3', { text: 'À retravailler' }),
      el('div', { class: 'grille-eleves' }, ratees.map((e) => el('div', { class: 'tuile-eleve' },
        photoEleve(e, 'vignette'),
        el('span', { class: 'tuile-nom', text: nomComplet(e) }),
        el('span', { class: 'tuile-classe', text: e.classe }))))));
  }

  const actions = el('div', { class: 'rangee' });
  if (restant > 0) {
    actions.append(el('button', {
      type: 'button',
      class: 'bouton principal grand',
      onclick: () => {
        if (Session.chargerLot()) afficher();
        else annoncer('Plus aucune carte à proposer.');
      },
    }, `Continuer (${pluriel(taille, 'carte')})`));
  }
  actions.append(el('button', {
    type: 'button',
    class: 'bouton grand',
    onclick: () => {
      Session.arreter();
      aller('accueil');
    },
  }, 'Terminer'));
  pile.append(actions);
  zone.append(pile);
}
