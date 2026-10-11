/* Révision des paquets de contenu : choix du paquet, carte en cours, bilan.
 *
 * Trois formats se partagent la même carte, et le mode « défis variés » en tire
 * un au hasard à chaque passage : reconnaître une réponse, la produire de tête
 * et l'écrire ne sollicitent pas la même mémoire.
 */

function texteCarte(texte, classe) {
  return formuleChimique(String(texte ?? ''), classe);
}

function etiquetteSection(paquet, cleSection) {
  const section = cleSection ? Paquets.section(paquet, cleSection) : null;
  return section ? section.titre : 'Tout le paquet';
}

/** Une consigne écrite pour la saisie (« Écris la formule… ») n'a plus de sens
 *  devant quatre propositions : la section peut en donner une autre. */
function consigneDe(paquet, element) {
  const carte = Paquets.index.get(element.id);
  const section = Paquets.section(paquet, carte.section);
  if (carte.masque) return 'Que cache la zone orange ?';
  if (element.format === 'vraifaux') return 'Vrai ou faux ?';
  if (carte.consigne) return carte.consigne;
  // Paquets créés dans l'appli, et paquets livrés qui mêlent les formats dans une section.
  if (paquet.origine !== 'integre' || paquet.consignesParFormat) {
    if (element.format === 'qcm') return 'Choisis la bonne réponse.';
    if (element.format === 'saisie') return 'Écris la réponse.';
    return 'Réponds de tête, puis retourne la carte.';
  }
  if (!section) return 'Que répondez-vous ?';
  if (element.format === 'qcm' && section.consigneQcm) return section.consigneQcm;
  return section.consigne || 'Que répondez-vous ?';
}

/* ---------- Liste des paquets ---------- */

function barreCompartiments(repartition) {
  const barre = el('div', { class: 'barre-compartiments', role: 'img',
    'aria-label': `${repartition.acquises} cartes acquises sur ${repartition.total}` });
  for (let i = 0; i < 5; i += 1) {
    const part = repartition.total ? (repartition.compte[i] / repartition.total) * 100 : 0;
    if (part > 0) barre.append(el('span', { class: `part c${i + 1}`, style: `width:${part}%` }));
  }
  return barre;
}

/* La bibliothèque et l'écran d'un paquet sont dans 84-bibliotheque-ecrans.js. */

function lancerContenu(options) {
  const nombre = SessionContenu.demarrer(options);
  if (!nombre) {
    SessionContenu.arreter();
    annoncer('Aucune carte à proposer pour cette sélection.');
    return;
  }
  aller('session-contenu');
}

/* ---------- Carte en cours ---------- */

Ecrans['session-contenu'] = {
  titre: 'Révision',
  titreCourt: 'Révision',
  parent: 'paquets',
  porte: 'tous',
  libelleRetour: 'Arrêter',
  pleinEcran: true,
  surRetour() {
    const retour = SessionContenu.active ? SessionContenu.active.retour : ['paquets'];
    SessionContenu.arreter();
    aller(...retour);
  },
  rendre(zone) {
    const s = SessionContenu.active;
    if (!s) {
      document.body.classList.remove('plein');
      zone.append(el('div', { class: 'pile' },
        el('p', { text: 'Aucune révision en cours.' }),
        el('button', { type: 'button', class: 'bouton principal', onclick: () => aller('paquets') }, 'Choisir un paquet')));
      return;
    }
    const element = SessionContenu.elementCourant();
    if (element) rendreCarteContenu(zone, element);
    else return rendreFinDeSerieContenu(zone);
  },
};

function rendreCarteContenu(zone, element) {
  const s = SessionContenu.active;
  const carte = Paquets.index.get(element.id);
  const paquet = Paquets.get(carte.paquet);
  const enonce = element.tirage || carte;
  definirTitre(`${s.titre} · ${FORMATS[element.format]}`);
  element.debut = element.debut || Date.now();

  const scene = el('div', { class: 'scene scene-texte' });
  const panneau = el('div', { class: 'panneau-reponse' });
  const entete = el('div', { class: 'revision-entete' },
    el('span', { text: `Carte ${s.position + 1} sur ${s.file.length}` }),
    element.reprise && el('span', { class: 'badge', text: 'À revoir' }),
    s.type === 'test' && el('span', { class: 'badge accent', text: 'Test de positionnement' }),
    !element.compte && !element.reprise && s.type !== 'test' && el('span', { class: 'badge', text: 'Hors barème' }),
    // Dans un objectif, on rappelle de quel paquet vient la carte.
    el('span', { text: s.paquets.length > 1 ? paquet.titre : etiquetteSection(paquet, carte.section) }));

  zone.append(el('div', { class: 'revision' },
    entete,
    el('div', { class: 'carte-revision' }, scene, panneau)));

  scene.append(el('p', { class: 'consigne', text: consigneDe(paquet, element) }));
  if (enonce.question) scene.append(texteCarte(enonce.question, String(enonce.question).length > 90 ? 'enonce long' : 'enonce'));
  if (carte.masque) scene.append(figureMasque(carte.masque, false));
  else if (carte.photoQuestion) scene.append(photoZoomable(carte.photoQuestion));
  if (paquet.chrono) scene.append(chronometre(element.debut));

  if (element.format === 'qcm') formatQcm(carte, enonce, element, panneau);
  else if (element.format === 'saisie') formatSaisie(carte, enonce, element, panneau);
  else if (element.format === 'vraifaux') formatVraiFaux(carte, enonce, element, panneau);
  else formatRetournement(carte, enonce, panneau, element);
}

/** Compteur discret, pour les paquets où la vitesse fait partie de l'exercice. */
function chronometre(debut) {
  const affichage = el('span', { class: 'chrono', text: '0 s' });
  const minuteur = setInterval(() => {
    if (!affichage.isConnected) {
      clearInterval(minuteur);
      return;
    }
    affichage.textContent = `${Math.round((Date.now() - debut) / 1000)} s`;
  }, 500);
  return affichage;
}

function blocReponse(carte, enonce) {
  const aide = enonce.aide || carte.aide;
  return el('div', { class: 'pile serree apparition' },
    enonce.reponse && el('div', { class: 'reponse' }, texteCarte(enonce.reponse, 'reponse-texte')),
    carte.photoReponse && photoZoomable(carte.photoReponse),
    aide && el('p', { class: 'discret aide' }, texteCarte(aide)));
}

/** Photo d'une carte ; un toucher l'agrandit en plein écran. */
function photoZoomable(chemin) {
  const image = Photos.image(chemin, 'photo-carte');
  image.addEventListener('click', () => agrandirPhoto(image.src));
  return image;
}

function agrandirPhoto(src) {
  if (!src) return;
  const fermer = () => voile.remove();
  const voile = el('div', { class: 'voile-photo', role: 'dialog', 'aria-label': 'Photo agrandie', onclick: fermer },
    el('img', { src, alt: 'Photo agrandie' }),
    el('button', { type: 'button', class: 'bouton', onclick: fermer }, 'Fermer'));
  document.body.append(voile);
}

/**
 * Photo à trous. Toutes les zones restent cachées ; la zone interrogée est
 * en orange, et révélée au retournement.
 */
function figureMasque(masque, revele) {
  const cadre = el('div', { class: 'masque-cadre' }, Photos.image(masque.photo, 'masque-photo'));
  masque.zones.forEach((zone, i) => {
    const cible = i === masque.index;
    cadre.append(el('span', {
      class: `masque-zone ${cible ? (revele ? 'revelee' : 'cible') : 'autre'}`,
      style: `left:${zone.x * 100}%;top:${zone.y * 100}%;width:${zone.l * 100}%;height:${zone.h * 100}%`,
    }, cible && !revele ? '?' : ''));
  });
  return cadre;
}

async function repondreContenu(reussi, note = null) {
  toucheEcran = null;
  await SessionContenu.repondre(reussi, note);
  afficher();
}

/** SM-2 : quatre notes, chacune avec le délai qu'elle donnerait à la carte. */
function boutonsNotesSM2(element) {
  const s = SessionContenu.active;
  const etat = Progression.obtenir(element.id);
  const delai = (note) => {
    if (!element.compte) return '';
    const jours = delaiPrevu(etat, note, s.jour, Paquets.deCarte(element.id));
    return jours <= 1 ? 'demain' : `dans ${jours} j`;
  };
  const rangee = el('div', { class: 'notes-sm2' });
  const noter = (note) => {
    for (const b of rangee.querySelectorAll('button')) b.disabled = true;
    repondreContenu(note !== 'revoir', note);
  };
  Object.entries(NOTES_SM2).forEach(([note, { libelle }], i) => {
    rangee.append(el('button', { type: 'button', class: `bouton note-${note}`, onclick: () => noter(note) },
      el('span', { class: 'note-libelle', text: libelle }),
      el('span', { class: 'note-delai', text: delai(note) || `touche ${i + 1}` })));
  });
  toucheEcran = (e) => {
    const rang = Number(e.key);
    if (rang >= 1 && rang <= 4) noter(Object.keys(NOTES_SM2)[rang - 1]);
  };
  return rangee;
}

/* Format 1 : on se représente la réponse, on retourne, on s'auto-évalue. */
function formatRetournement(carte, enonce, panneau, element) {
  const retourner = () => {
    // Photo à trous : la zone se dévoile sur place, sans dupliquer la photo.
    const cadre = carte.masque && document.querySelector('.scene .masque-cadre');
    if (cadre) cadre.replaceWith(figureMasque(carte.masque, true));
    const sm2 = ReglagesPaquet.de(Paquets.get(carte.paquet)).algorithme === 'sm2';
    panneau.replaceChildren(blocReponse(carte, enonce),
      sm2 ? boutonsNotesSM2(element) : boutonsAutoEvaluation((reussi) => repondreContenu(reussi)));
  };
  panneau.append(el('button', {
    type: 'button', class: 'bouton principal bloc grand', onclick: retourner,
  }, 'Retourner la carte'));
  toucheEcran = (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      retourner();
    }
  };
}

/* Format 2 : quatre propositions, correction automatique. */
function formatQcm(carte, enonce, element, panneau) {
  if (!element.options) {
    // Carte tirée au hasard : ses pièges viennent du tirage ; on en montre trois, différents à chaque passage.
    const pieges = element.tirage && element.tirage.distracteurs
      ? melanger([...new Set(element.tirage.distracteurs)].filter((d) => d !== enonce.reponse)).slice(0, 3)
      : Paquets.distracteurs(carte);
    element.options = melanger([enonce.reponse, ...pieges]);
  }
  const suite = el('div', { class: 'pile' });
  const grille = el('div', { class: 'choix' });
  let repondu = false;

  const choisir = async (texte, bouton) => {
    if (repondu) return;
    repondu = true;
    const reussi = texte === enonce.reponse;
    for (const b of grille.children) {
      b.disabled = true;
      if (b.dataset.reponse === enonce.reponse) b.classList.add('juste');
      else if (b === bouton) b.classList.add('faux');
    }
    toucheEcran = null;
    await SessionContenu.repondre(reussi);
    suite.replaceChildren(
      el('p', { class: 'verdict', text: reussi ? 'Bonne réponse' : 'Ce n’était pas la bonne' }),
      (enonce.aide || carte.aide) && el('p', { class: 'discret aide' }, texteCarte(enonce.aide || carte.aide)),
      el('button', { type: 'button', class: 'bouton principal bloc grand', onclick: afficher }, 'Suivant'));
    toucheEcran = (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        afficher();
      }
    };
  };

  for (const texte of element.options) {
    const bouton = el('button', { type: 'button', class: 'bouton', 'data-reponse': texte });
    bouton.append(texteCarte(texte));
    bouton.addEventListener('click', () => choisir(texte, bouton));
    grille.append(bouton);
  }
  panneau.append(grille, suite);
  toucheEcran = (e) => {
    const rang = Number(e.key);
    if (rang >= 1 && rang <= grille.children.length) grille.children[rang - 1].click();
  };
}

/* Format 3 : l'élève écrit la réponse. */
function formatSaisie(carte, enonce, element, panneau) {
  const attenduNombre = enonce.nombre !== undefined ? enonce.nombre : carte.nombre;
  const attenduTexte = enonce.saisie || carte.saisie || [];
  const tolerance = enonce.tolerance ?? carte.tolerance;
  const scientifique = enonce.ecritureScientifique ?? carte.ecritureScientifique;
  // Une unité attendue : toute écriture équivalente est juste (J·mol⁻¹·K⁻¹ = Pa·m³·mol⁻¹·K⁻¹).
  const uniteAttendue = enonce.uniteAttendue ?? carte.uniteAttendue;
  const basesSeules = enonce.basesSeules ?? carte.basesSeules;
  // Le pavé décimal n'a ni « ^ » ni « × » : clavier complet dès qu'une puissance de dix est probable.
  const puissance = scientifique || (attenduNombre !== undefined && attenduNombre !== 0
    && (Math.abs(attenduNombre) < 1e-3 || Math.abs(attenduNombre) >= 1e6));
  const champSaisie = el('input', {
    type: 'text',
    inputmode: attenduNombre !== undefined && !puissance ? 'decimal' : 'text',
    autocomplete: 'off',
    autocapitalize: 'off',
    spellcheck: 'false',
    'aria-label': 'Votre réponse',
  });
  const unite = (enonce.unite || carte.unite) ? el('span', { class: 'unite', text: enonce.unite || carte.unite }) : null;
  const suite = el('div', { class: 'pile' });

  const verifier = async () => {
    // « 2 500 m » quand l'unité est déjà affichée : on ne compte pas l'unité retapée.
    const uniteAffichee = enonce.unite || carte.unite;
    const saisie = uniteAffichee && champSaisie.value.trim().endsWith(uniteAffichee)
      ? champSaisie.value.trim().slice(0, -uniteAffichee.length)
      : champSaisie.value;
    if (!saisie.trim()) {
      champSaisie.focus();
      return;
    }
    let reussi;
    if (uniteAttendue) {
      reussi = ([].concat(uniteAttendue).some((u) => memeUnite(saisie, u)) && (!basesSeules || enUnitesDeBase(saisie)))
        || reponseAcceptee(saisie, attenduTexte);
    }
    else if (attenduNombre !== undefined) {
      reussi = memeNombre(nombreSaisi(saisie), attenduNombre, tolerance) && (!scientifique || estEcritureScientifique(saisie));
    } else reussi = reponseAcceptee(saisie, [enonce.reponse, ...attenduTexte]);
    champSaisie.disabled = true;
    champSaisie.classList.add(reussi ? 'juste' : 'faux');
    formulaire.querySelector('button').disabled = true;
    toucheEcran = null;
    await SessionContenu.repondre(reussi);

    const actions = el('div', { class: 'rangee' },
      el('button', { type: 'button', class: 'bouton principal grand', onclick: afficher }, 'Suivant'));
    // La comparaison automatique reste étroite : l'élève garde le dernier mot.
    if (!reussi) {
      actions.append(el('button', {
        type: 'button',
        class: 'bouton',
        onclick: async () => {
          await corrigerDerniereReponse();
          afficher();
        },
      }, 'Ma réponse était juste'));
    }
    const seulementForme = !reussi && scientifique && memeNombre(nombreSaisi(saisie), attenduNombre, tolerance);
    suite.replaceChildren(
      el('p', { class: 'verdict', text: reussi ? 'Bonne réponse'
        : seulementForme ? 'Valeur juste, mais pas en écriture scientifique (a × 10ⁿ, 1 ⩽ a < 10)' : 'Réponse attendue' }),
      blocReponse(carte, enonce),
      actions);
    toucheEcran = (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        afficher();
      }
    };
  };

  const formulaire = el('form', { class: 'pile serree' },
    el('div', { class: 'rangee saisie' }, champSaisie, unite),
    el('button', { type: 'submit', class: 'bouton principal bloc grand' }, 'Vérifier'));
  formulaire.addEventListener('submit', (evenement) => {
    evenement.preventDefault();
    verifier();
  });
  // Le grec et les symboles n'existent pas sur tous les claviers.
  formulaire.append(barreSymboles(formulaire, { compacte: true }));
  panneau.append(formulaire, suite);
  champSaisie.focus();
}

/* Format 4 : une affirmation, vraie ou fausse. */
function formatVraiFaux(carte, enonce, element, panneau) {
  const suite = el('div', { class: 'pile' });
  let repondu = false;
  const choisir = async (choix) => {
    if (repondu) return;
    repondu = true;
    const reussi = choix === Boolean(enonce.vrai);
    for (const b of rangee.children) {
      b.disabled = true;
      if ((b.dataset.choix === 'vrai') === Boolean(enonce.vrai)) b.classList.add('juste');
      else if ((b.dataset.choix === 'vrai') === choix) b.classList.add('faux');
    }
    toucheEcran = null;
    await SessionContenu.repondre(reussi);
    suite.replaceChildren(
      el('p', { class: 'verdict', text: reussi ? 'Bonne réponse' : `Non : c’était ${enonce.vrai ? 'vrai' : 'faux'}` }),
      blocReponse(carte, enonce),
      el('button', { type: 'button', class: 'bouton principal bloc grand', onclick: afficher }, 'Suivant'));
    toucheEcran = (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        afficher();
      }
    };
  };
  const rangee = el('div', { class: 'choix vrai-faux' },
    el('button', { type: 'button', class: 'bouton grand', 'data-choix': 'vrai', onclick: () => choisir(true) }, 'Vrai'),
    el('button', { type: 'button', class: 'bouton grand', 'data-choix': 'faux', onclick: () => choisir(false) }, 'Faux'));
  panneau.append(rangee, suite);
  toucheEcran = (e) => {
    if (e.key === 'v' || e.key === '1') choisir(true);
    if (e.key === 'f' || e.key === '2') choisir(false);
  };
}

/**
 * Repasse en réussite la dernière carte notée. La comparaison automatique
 * n'accepte que les formulations prévues : quand elle se trompe, l'élève doit
 * pouvoir le dire, sinon il perd la carte pour une virgule.
 */
async function corrigerDerniereReponse() {
  const s = SessionContenu.active;
  const precedent = s.file[s.position - 1];
  if (!precedent) return;

  const dernier = s.resultats[s.resultats.length - 1];
  if (dernier && dernier.id === precedent.id) dernier.reussi = true;
  // On rejoue la notation depuis l'état d'avant la réponse, pas depuis l'état
  // déjà rétrogradé au compartiment 1.
  if (precedent.compte && precedent.etatAvant) {
    await Progression.enregistrer(appliquerReglages(precedent.etatAvant, true, s.jour, Paquets.deCarte(precedent.id)));
  }
  // La reprise ajoutée en fin de file n'a plus lieu d'être.
  const reprise = s.file.findIndex((e, i) => i >= s.position && e.id === precedent.id && e.reprise);
  if (reprise !== -1) s.file.splice(reprise, 1);
}

/* ---------- Fin de série ---------- */

/** Fin d'un test de positionnement : le niveau s'ouvre, ou on dit ce qui manque. */
async function rendreFinDeTest(zone) {
  const s = SessionContenu.active;
  const paquet = s.paquets[0];
  const index = paquet.sections.findIndex((section) => section.cle === s.section);
  // Noté une seule fois, même si l'écran est redessiné.
  if (!s.bilanTest) s.bilanTest = await Niveaux.terminerTest(paquet, index, s.resultats, s.jour);
  const { reussies, total, ouvert } = s.bilanTest;
  const niveau = paquet.sections[index];
  definirTitre(ouvert ? 'Niveau débloqué' : 'Test terminé');
  zone.append(el('div', { class: 'pile' },
    el('div', { class: 'chiffres' }, chiffre(`${reussies} / ${total}`, 'bonnes réponses')),
    el('div', { class: ouvert ? 'panneau pile' : 'alerte pile' },
      el('p', {}, el('strong', { text: ouvert ? `${niveau.titre} est ouvert.` : `${niveau.titre} reste fermé.` })),
      el('p', { text: ouvert
        ? 'Les cartes réussies y entrent directement en boîte 3 ; les autres arriveront dans tes séances, '
          + 'avec celles des niveaux précédents.'
        : `Il fallait ${REUSSITE_TEST_NIVEAU} bonnes réponses sur ${TAILLE_TEST_NIVEAU}. Continue les séances : `
          + 'le niveau s’ouvrira de lui-même quand le précédent sera maîtrisé. Nouvel essai possible demain.' })),
    el('button', {
      type: 'button',
      class: 'bouton principal bloc grand',
      onclick: () => {
        SessionContenu.arreter();
        aller('paquet', paquet.cle);
      },
    }, 'Retour au paquet')));
}

function rendreFinDeSerieContenu(zone) {
  const s = SessionContenu.active;
  document.body.classList.remove('plein');
  toucheEcran = null;
  if (s.type === 'test') return rendreFinDeTest(zone);
  definirTitre('Série terminée');

  const reussies = s.resultats.filter((r) => r.reussi).length;
  const ratees = s.resultats.filter((r) => !r.reussi);
  const restant = SessionContenu.restant();
  const taille = Math.min(restant, Profil.donnees.tailleSession);

  const serie = Journal.serie(s.jour);
  const moyenne = s.resultats.length ? Math.round(s.secondes / s.resultats.length) : 0;

  const pile = el('div', { class: 'pile' },
    el('div', { class: 'chiffres' },
      chiffre(`${reussies} / ${s.resultats.length}`, 'justes du premier coup'),
      chiffre(ratees.length, 'à retravailler'),
      chiffre(moyenne >= 1 ? `${moyenne} s` : '—', 'par carte en moyenne')),
    el('p', { class: 'discret', text: serie > 1
      ? `${serie} jours d’affilée. ${formaterDuree(s.secondes)} sur cette série.`
      : `Première journée de la série. ${formaterDuree(s.secondes)} sur cette série.` }));

  if (ratees.length) {
    pile.append(el('section', { class: 'panneau pile' },
      el('h3', { text: 'À retravailler' }),
      el('dl', { class: 'rappel-cartes' }, ratees.flatMap((resultat) => [
        el('dt', {}, texteCarte(resultat.question)),
        el('dd', {}, texteCarte(resultat.reponse)),
      ]))));
  }

  const actions = el('div', { class: 'rangee' });
  if (restant > 0) {
    actions.append(el('button', {
      type: 'button',
      class: 'bouton principal grand',
      onclick: () => {
        if (SessionContenu.chargerLot()) afficher();
        else annoncer('Plus aucune carte à proposer.');
      },
    }, `Continuer (${pluriel(taille, 'carte')})`));
  }
  actions.append(
    el('button', {
      type: 'button',
      class: 'bouton grand',
      onclick: () => {
        SessionContenu.arreter();
        aller(...s.retour);
      },
    }, 'Terminer'),
    el('button', {
      type: 'button',
      class: 'bouton grand',
      onclick: () => {
        SessionContenu.arreter();
        aller('statistiques');
      },
    }, 'Voir ma progression'));
  pile.append(actions);
  zone.append(pile);
}
