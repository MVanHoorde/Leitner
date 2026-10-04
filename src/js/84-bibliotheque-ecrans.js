/* Écrans de la bibliothèque : mes paquets, un paquet, le catalogue du prof,
 * les réglages de révision d'un paquet, la fiche d'un paquet, ses cartes. */

const SectionsChoisies = new Map();

function etiquetteOrigine(paquet) {
  if (paquet.proprietaire) return paquet.public ? 'Publié · bibliothèque commune' : 'Mon paquet';
  if (paquet.origine === 'prof') return 'Bibliothèque du prof';
  return 'Livré avec l’appli';
}

function badgeEvaluation(paquet) {
  const { dateEvaluation } = ReglagesPaquet.de(paquet);
  if (!dateEvaluation) return null;
  const jours = Dates.ecart(Dates.aujourdhui(), dateEvaluation);
  if (jours < 0) return null;
  const texte = jours === 0 ? 'Évaluation aujourd’hui' : jours === 1 ? 'Évaluation demain' : `Évaluation dans ${jours} j`;
  return el('span', { class: `badge ${jours <= 3 ? 'urgent' : 'accent'}`, text: texte });
}

function nombreCartesSources(paquet) {
  return new Set(paquet.cartes.map((c) => c.source || c.id)).size;
}

function tuilePaquet(paquet) {
  const jour = Dates.aujourdhui();
  const bilan = SessionContenu.bilan(paquet, null, jour);
  const repartition = Progression.repartition(paquet.cartes);
  const aFaire = bilan.dues.length + bilan.nouvellesDuJour;
  let detail;
  if (!paquet.cartes.length) detail = 'Paquet vide : ajoute tes premières cartes';
  else if (aFaire) {
    detail = `${pluriel(bilan.dues.length, 'carte due', 'cartes dues')} · ${pluriel(bilan.nouvellesDuJour, 'nouvelle')} · `
      + estimerDuree(aFaire, Journal.secondesParCarte());
  } else detail = `Rien à revoir aujourd’hui · ${repartition.acquises} / ${repartition.total} acquises`;

  return el('div', { class: 'tuile-paquet', style: `--couleur:${paquet.couleur || '#1B2A4A'}` },
    el('button', { type: 'button', class: `bouton menu tuile${aFaire ? ' a-faire' : ''}`, onclick: () => aller('paquet', paquet.cle) },
      el('span', { class: 'libelle', text: paquet.titre }),
      el('span', { class: 'detail', text: detail }),
      el('span', { class: 'badges' },
        el('span', { class: 'badge', text: etiquetteOrigine(paquet) }),
        el('span', { class: 'badge', text: pluriel(paquet.cartes.length, 'carte') }),
        badgeEvaluation(paquet))),
    paquet.cartes.length ? barreCompartiments(repartition) : null);
}

/** Paquets regroupés par thème, thèmes dans l'ordre alphabétique. */
function parTheme(paquets) {
  const groupes = new Map();
  for (const paquet of paquets) {
    const theme = paquet.theme || 'Sans thème';
    if (!groupes.has(theme)) groupes.set(theme, []);
    groupes.get(theme).push(paquet);
  }
  return [...groupes.entries()].sort(([a], [b]) => (a === 'Sans thème') - (b === 'Sans thème') || comparerFr(a, b));
}

/* ---------- Ma bibliothèque ---------- */

Ecrans.paquets = {
  titre: 'Ma bibliothèque',
  titreCourt: 'Bibliothèque',
  parent: () => Porte.accueil(),
  porte: 'tous',
  rendre(zone) {
    const pile = el('div', { class: 'pile' });
    zone.append(pile);
    const paquets = Bibliotheque.paquets();
    const jour = Dates.aujourdhui();
    let aFaire = 0;
    for (const paquet of paquets) {
      const bilan = SessionContenu.bilan(paquet, null, jour);
      aFaire += bilan.dues.length + bilan.nouvellesDuJour;
    }

    pile.append(el('div', { class: 'chiffres' },
      chiffre(aFaire, aFaire > 1 ? 'cartes à voir aujourd’hui' : 'carte à voir aujourd’hui'),
      chiffre(paquets.length, paquets.length > 1 ? 'paquets' : 'paquet'),
      chiffre(paquets.reduce((s, p) => s + p.cartes.length, 0), 'cartes en tout')));

    const actions = el('div', { class: 'rangee' });
    if (Depot.uid) {
      actions.append(el('button', { type: 'button', class: 'bouton accent', onclick: () => aller('editer-paquet', 'nouveau') },
        '+ Nouveau paquet'));
    }
    actions.append(el('button', { type: 'button', class: 'bouton', onclick: () => aller('catalogue') }, 'Bibliothèque du prof'));
    pile.append(actions);

    if (!paquets.length) {
      pile.append(el('div', { class: 'panneau pile vide' },
        el('h2', { text: 'Ta bibliothèque est vide' }),
        el('p', { text: 'Crée ton premier paquet, ou va piocher dans la bibliothèque du prof.' })));
      return;
    }
    for (const [theme, groupe] of parTheme(paquets)) {
      pile.append(el('h2', { class: 'titre-theme', text: theme }), ...groupe.map(tuilePaquet));
    }
  },
};

/* ---------- Un paquet ---------- */

function resumeReglage(paquet) {
  const r = ReglagesPaquet.de(paquet);
  const nom = r.rythme === 'perso' ? 'Sur mesure' : r.rythme === 'paquet' ? 'Rythme du paquet' : RYTHMES[r.rythme].titre;
  return `${nom} (${r.intervalles.join('-')} j) · ${pluriel(ReglagesPaquet.nouvellesParJour(paquet), 'nouvelle')} par jour`
    + (r.dateEvaluation ? ` · évaluation le ${Dates.formater(r.dateEvaluation)}` : '');
}

Ecrans.paquet = {
  titre: 'Paquet',
  titreCourt: 'Paquet',
  parent: 'paquets',
  porte: 'tous',
  rendre(zone, cle) {
    const paquet = Paquets.get(cle);
    if (!paquet) {
      zone.append(el('div', { class: 'panneau pile' },
        el('p', { text: 'Paquet introuvable. Il a peut-être été supprimé ou retiré de la bibliothèque commune.' }),
        el('button', { type: 'button', class: 'bouton', onclick: () => aller('paquets') }, 'Retour à ma bibliothèque')));
      return;
    }
    definirTitre(paquet.titre);

    const pile = el('div', { class: 'pile' });
    const infos = el('div', { class: 'pile' });
    zone.append(pile);

    const majInfos = () => {
      const section = SectionsChoisies.get(cle) || null;
      const cartes = Paquets.cartesDe(paquet, section);
      const jour = Dates.aujourdhui();
      const bilan = SessionContenu.bilan(paquet, section, jour);
      const repartition = Progression.repartition(cartes);
      const aFaire = bilan.dues.length + bilan.nouvellesDuJour;
      const formats = Paquets.formatsCommuns(cartes);
      if (formats.length && !formats.includes(Profil.donnees.format)) {
        Profil.enregistrer({ format: formats[0] });
      }

      if (!cartes.length) {
        infos.replaceChildren(el('div', { class: 'panneau pile vide' },
          el('h2', { text: 'Aucune carte pour l’instant' }),
          el('p', { text: 'Ajoute des cartes une par une, à partir d’une photo, ou colle une liste entière.' })));
        return;
      }

      infos.replaceChildren(
        el('div', { class: 'chiffres' },
          chiffre(bilan.dues.length, bilan.enRetard ? `dues, dont ${bilan.enRetard} en retard` : 'cartes dues'),
          chiffre(bilan.nouvellesDuJour, bilan.nouvellesDuJour > 1 ? 'nouvelles' : 'nouvelle'),
          chiffre(`${repartition.acquises} / ${repartition.total}`, 'acquises')),
        barreCompartiments(repartition),
        formats.length > 1 && el('h2', { text: 'Format' }),
        formats.length > 1 && selecteur(formats.map((f) => [f, FORMATS[f]]), Profil.donnees.format, async (format) => {
          await Profil.enregistrer({ format });
        }, 'Format de révision'));

      if (aFaire) {
        infos.append(
          el('p', { class: 'discret', text: `${estimerDuree(aFaire, Journal.secondesParCarte())} pour la séance du jour, `
            + `par séries de ${Profil.donnees.tailleSession} cartes.` }),
          el('button', {
            type: 'button',
            class: 'bouton principal bloc grand',
            onclick: () => lancerContenu({ paquet, section, format: Profil.donnees.format, type: 'jour' }),
          }, 'Commencer la séance du jour'));
      } else {
        infos.append(el('div', { class: 'panneau' },
          el('p', { text: 'Rien à revoir aujourd’hui dans cette sélection. Les cartes reviendront '
            + 'd’elles-mêmes à leur échéance.' })));
      }
      infos.append(
        el('button', {
          type: 'button',
          class: `bouton bloc grand ${aFaire ? '' : 'principal'}`,
          onclick: () => lancerContenu({ paquet, section, format: Profil.donnees.format, type: 'libre' }),
        }, 'S’entraîner librement'));
    };

    const badges = el('div', { class: 'badges' },
      el('span', { class: 'badge', text: etiquetteOrigine(paquet) }),
      paquet.theme && el('span', { class: 'badge', text: paquet.theme }),
      badgeEvaluation(paquet));
    pile.append(badges);
    if (paquet.resume) pile.append(el('p', { text: paquet.resume }));

    if (paquet.sections.length > 1) {
      const sections = [[null, 'Tout le paquet'], ...paquet.sections.map((s) => [s.cle, s.titre])];
      pile.append(
        el('h2', { text: 'Sélection' }),
        selecteur(sections.map(([v, l]) => [v ?? '', l]), SectionsChoisies.get(cle) ?? '', (valeur) => {
          SectionsChoisies.set(cle, valeur || null);
          majInfos();
        }, 'Partie du paquet à réviser'));
    }
    pile.append(infos);
    majInfos();

    /* Gestion */
    const gestion = el('section', { class: 'panneau pile' }, el('h2', { text: 'Organiser' }));
    if (Porte.courante === 'eleve') {
      gestion.append(boutonMenu('Réglages de révision', resumeReglage(paquet), () => aller('reglages-paquet', cle)));
    }
    if (paquet.proprietaire && Depot.uid) {
      gestion.append(
        el('div', { class: 'rangee' },
          el('button', { type: 'button', class: 'bouton accent', onclick: () => aller('carte', `${paquet.id}~nouvelle`) }, '+ Ajouter une carte'),
          el('button', { type: 'button', class: 'bouton', onclick: () => aller('import', paquet.id) }, 'Coller une liste')),
        el('div', { class: 'rangee' },
          el('button', { type: 'button', class: 'bouton', onclick: () => aller('cartes', paquet.id) },
            `Voir et modifier les cartes (${nombreCartesSources(paquet)})`),
          el('button', { type: 'button', class: 'bouton', onclick: () => aller('editer-paquet', paquet.id) }, 'Titre, thème, couleur')));
    } else if (Porte.courante === 'eleve' && Bibliotheque.contient(cle)) {
      gestion.append(el('button', {
        type: 'button',
        class: 'bouton bloc',
        onclick: async () => {
          await Bibliotheque.retirer(cle);
          annoncer('Paquet retiré de ta bibliothèque. Ta progression est conservée.');
          aller('paquets');
        },
      }, 'Retirer de ma bibliothèque'));
    }
    if (gestion.children.length > 1) pile.append(gestion);
  },
};

/* ---------- Bibliothèque du prof (catalogue) ---------- */

function ligneCatalogue(paquet) {
  const { cle, titre, theme, niveaux, nombre, description, enLigne, id, miens } = paquet;
  const zone = el('div', { class: 'panneau pile serree carte-catalogue', style: `--couleur:${paquet.couleur || '#1B2A4A'}` });
  const apercu = el('div', { class: 'pile serree' });

  const dessiner = () => {
    const dedans = Bibliotheque.contient(cle);
    const bouton = el('button', {
      type: 'button',
      class: `bouton ${dedans ? '' : 'accent'}`,
      onclick: async () => {
        bouton.disabled = true;
        try {
          if (dedans) {
            await Bibliotheque.retirer(cle);
            annoncer('Retiré de ta bibliothèque.');
          } else {
            await Bibliotheque.ajouter(cle);
            if (enLigne) await Perso.synchroniser();
            annoncer(`« ${titre} » est dans ta bibliothèque.`);
          }
        } catch (e) {
          annoncer(messageNuage(e));
        }
        dessiner();
      },
    }, dedans ? '✓ Dans ma bibliothèque · retirer' : '+ Ajouter à ma bibliothèque');

    zone.replaceChildren(
      el('div', { class: 'ligne-entete' },
        el('strong', { class: 'ligne-titre', text: titre }),
        el('span', { class: 'discret', text: pluriel(nombre, 'carte') })),
      el('div', { class: 'badges' },
        theme && el('span', { class: 'badge', text: theme }),
        ...(niveaux || []).map((n) => el('span', { class: 'badge', text: nomNiveau(n) })),
        miens && el('span', { class: 'badge accent', text: 'Publié par moi' })),
      description && el('p', { class: 'discret', text: description }),
      el('div', { class: 'rangee' },
        miens ? null : bouton,
        el('button', {
          type: 'button',
          class: 'bouton',
          onclick: async () => {
            if (apercu.childElementCount) {
              apercu.replaceChildren();
              return;
            }
            apercu.replaceChildren(el('p', { class: 'discret', text: 'Chargement…' }));
            try {
              const cartes = enLigne
                ? (await Perso.cartesPubliques(id)).flatMap(cartesDeLigne)
                : Paquets.get(cle).cartes;
              apercu.replaceChildren(el('dl', { class: 'rappel-cartes' }, cartes.slice(0, 8).flatMap((c) => [
                el('dt', {}, texteCarte(c.question || (c.masque ? 'Photo à trous' : 'Photo'))),
                el('dd', {}, texteCarte(c.reponse || '(photo)')),
              ])), cartes.length > 8 && el('p', { class: 'discret', text: `… et ${cartes.length - 8} autres.` }));
            } catch (e) {
              apercu.replaceChildren(el('p', { class: 'erreur', text: messageNuage(e) }));
            }
          },
        }, 'Aperçu')),
      apercu);
  };
  dessiner();
  return zone;
}

Ecrans.catalogue = {
  titre: 'Bibliothèque du prof',
  titreCourt: 'Catalogue',
  parent: 'paquets',
  porte: 'eleve',
  async rendre(zone) {
    const recherche = el('input', { type: 'search', placeholder: 'Chercher un paquet, un thème…', 'aria-label': 'Chercher' });
    const resultats = el('div', { class: 'pile' });
    zone.append(el('div', { class: 'pile' },
      el('p', { class: 'discret', text: 'Les paquets préparés par tes professeurs. Ajoute ceux qui te servent : '
        + 'ils rejoignent ta bibliothèque, avec ta propre progression et tes propres réglages.' }),
      recherche,
      resultats));

    const integres = Paquets.liste.filter((p) => p.origine === 'integre').map((p) => ({
      cle: p.cle, titre: p.titre, theme: p.theme, niveaux: p.niveaux, nombre: p.cartes.length,
      description: p.resume, enLigne: false, couleur: '#1B2A4A',
    }));
    let enLigne = [];
    let message = null;
    if (Depot.uid) {
      resultats.append(el('p', { class: 'discret', text: 'Chargement de la bibliothèque…' }));
      try {
        enLigne = (await Perso.catalogue()).map((p) => ({
          cle: `p:${p.id}`, id: p.id, titre: p.titre, theme: p.theme, niveaux: p.niveaux, couleur: p.couleur,
          nombre: (p.leitner_cartes && p.leitner_cartes[0] && p.leitner_cartes[0].count) || 0,
          description: p.description, enLigne: true, miens: p.auteur === Depot.uid,
        }));
      } catch (e) {
        message = messageNuage(e);
      }
    } else {
      message = 'Connecte-toi pour voir les paquets publiés par tes professeurs.';
    }

    const dessiner = () => {
      const filtre = normaliserReponse(recherche.value);
      const garde = (p) => !filtre || normaliserReponse(`${p.titre} ${p.theme} ${p.description}`).includes(filtre);
      const blocs = [];
      if (message) blocs.push(el('div', { class: 'alerte', text: message }));
      const publies = enLigne.filter(garde);
      if (publies.length) {
        for (const [theme, groupe] of parTheme(publies)) {
          blocs.push(el('h2', { class: 'titre-theme', text: theme }), ...groupe.map(ligneCatalogue));
        }
      } else if (!message && !filtre) {
        blocs.push(el('p', { class: 'discret', text: 'Aucun paquet publié pour le moment. Ça arrive !' }));
      }
      const fournis = integres.filter(garde);
      if (fournis.length) {
        blocs.push(el('h2', { class: 'titre-theme', text: 'Livrés avec l’application' }), ...fournis.map(ligneCatalogue));
      }
      if (filtre && !publies.length && !fournis.length) blocs.push(el('p', { class: 'discret', text: 'Aucun paquet ne correspond.' }));
      resultats.replaceChildren(...blocs);
    };
    recherche.addEventListener('input', dessiner);
    dessiner();
  },
};

/* ---------- Réglages de révision d'un paquet ---------- */

function pastillesIntervalles(intervalles) {
  return el('span', { class: 'pastilles' }, ...intervalles.map((n) => el('span', { class: 'pastille', text: `${n} j` })));
}

function frise(passages, debut, fin) {
  const total = Math.max(1, Dates.ecart(debut, fin));
  const ligne = el('div', { class: 'frise', role: 'img',
    'aria-label': `Passages prévus : ${passages.map((p) => Dates.formater(p)).join(', ')}` });
  ligne.append(el('span', { class: 'frise-trait' }));
  passages.forEach((date, i) => {
    const part = Math.min(100, (Dates.ecart(debut, date) / total) * 100);
    ligne.append(el('span', { class: `frise-point${i === 0 ? ' premier' : ''}`, style: `left:${part}%`,
      title: Dates.formater(date) }));
  });
  ligne.append(el('span', { class: 'frise-fin', style: 'left:100%', title: Dates.formater(fin) }));
  return el('div', { class: 'pile serree' }, ligne,
    el('div', { class: 'ligne-entete discret' },
      el('span', { text: 'aujourd’hui' }),
      el('span', { text: Dates.versDate(fin).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) })));
}

Ecrans['reglages-paquet'] = {
  titre: 'Réglages de révision',
  titreCourt: 'Réglages',
  parent: 'paquet',
  libelleRetour: 'Paquet',
  porte: 'eleve',
  surRetour(cle) {
    aller('paquet', cle);
  },
  rendre(zone, cle) {
    const paquet = Paquets.get(cle);
    if (!paquet) {
      aller('paquets');
      return;
    }
    definirTitre(`Réglages · ${paquet.titre}`);
    const pile = el('div', { class: 'pile' });
    zone.append(pile);

    const dessiner = () => {
      const jour = Dates.aujourdhui();
      const reglage = ReglagesPaquet.de(paquet);
      const brut = ReglagesPaquet.brut(cle);
      const repartition = Progression.repartition(paquet.cartes);

      /* Rythmes proposés */
      const options = [];
      const propre = paquet.intervalles.join() !== INTERVALLES_CONTENU.join()
        && !Object.values(RYTHMES).some((r) => r.intervalles.join() === paquet.intervalles.join());
      if (propre) options.push(['paquet', { titre: 'Conseillé', resume: 'Le rythme prévu pour ce paquet', intervalles: paquet.intervalles }]);
      options.push(...Object.entries(RYTHMES));
      options.push(['perso', { titre: 'Sur mesure', resume: 'Tu choisis chaque délai',
        intervalles: intervallesValides(brut.intervalles) || reglage.intervalles }]);
      let actif = reglage.rythme;
      if (actif === 'paquet' && !propre) {
        actif = Object.keys(RYTHMES).find((k) => RYTHMES[k].intervalles.join() === reglage.intervalles.join()) || 'standard';
      }

      const tuiles = el('div', { class: 'grille-rythmes' }, ...options.map(([valeur, r]) => el('button', {
        type: 'button',
        class: 'tuile-rythme',
        'aria-pressed': String(valeur === actif),
        onclick: async () => {
          if (valeur === 'perso') {
            await ReglagesPaquet.enregistrer(cle, { rythme: 'perso', intervalles: r.intervalles });
          } else {
            await ReglagesPaquet.enregistrer(cle, { rythme: valeur === 'paquet' ? null : valeur });
          }
          annoncer(`Rythme « ${r.titre} » choisi.`);
          dessiner();
        },
      }, el('strong', { text: r.titre }), el('span', { class: 'discret', text: r.resume }), pastillesIntervalles(r.intervalles))));

      /* Délais sur mesure */
      let surMesure = null;
      if (actif === 'perso') {
        const entrees = reglage.intervalles.map((n, i) => {
          const entree = el('input', { type: 'number', inputmode: 'numeric', min: 1, max: 365, value: n,
            'aria-label': `Délai de la boîte ${i + 1}` });
          entree.addEventListener('change', async () => {
            const valeurs = intervallesValides(entrees.map((e) => e.value));
            if (!valeurs) {
              annoncer('Chaque délai doit être compris entre 1 et 365 jours.');
              return;
            }
            await ReglagesPaquet.enregistrer(cle, { rythme: 'perso', intervalles: valeurs });
            annoncer('Délais enregistrés.');
            dessiner();
          });
          return entree;
        });
        surMesure = el('div', { class: 'pile serree' },
          el('p', { class: 'discret', text: 'Délai (en jours) avant de revoir une carte réussie, boîte par boîte.' }),
          el('div', { class: 'grille-delais' }, ...entrees.map((e, i) => el('label', { class: 'champ' },
            el('span', { class: 'champ-libelle', text: `Boîte ${i + 1}` }), e))),
          reglage.intervalles.some((n, i) => i && n < reglage.intervalles[i - 1])
            && el('p', { class: 'erreur', text: 'Astuce : des délais croissants marchent mieux, chaque réussite doit éloigner la carte.' }));
      }

      /* Les cinq boîtes */
      const boites = el('div', { class: 'boites' },
        el('div', { class: 'boite nouvelles' },
          el('strong', { text: repartition.jamaisVues }),
          el('span', { text: 'jamais vues' })),
        ...reglage.intervalles.map((n, i) => el('div', { class: `boite c${i + 1}` },
          el('span', { class: 'boite-nom', text: `Boîte ${i + 1}` }),
          el('strong', { text: repartition.compte[i] }),
          el('span', { text: i === 4 ? `acquises · revues ${decrireDelai(n)}` : `revues ${decrireDelai(n)}` }))));

      /* Nouvelles cartes par jour */
      const nouvelles = el('input', { type: 'number', inputmode: 'numeric', min: 1, max: 100,
        value: Number.isInteger(brut.nouvellesParJour) ? brut.nouvellesParJour : Profil.donnees.nouvellesParJour });
      nouvelles.addEventListener('change', async () => {
        const n = Math.min(100, Math.max(1, Math.round(Number(nouvelles.value)) || Profil.donnees.nouvellesParJour));
        await ReglagesPaquet.enregistrer(cle, { nouvellesParJour: n });
        annoncer('Réglage enregistré.');
        dessiner();
      });

      /* Évaluation */
      const date = el('input', { type: 'date', value: reglage.dateEvaluation || '', min: Dates.ajouter(jour, 1) });
      date.addEventListener('change', async () => {
        await ReglagesPaquet.enregistrer(cle, { dateEvaluation: date.value || null });
        annoncer(date.value ? `Évaluation fixée au ${Dates.formater(date.value)}.` : 'Date retirée.');
        dessiner();
      });
      const evaluation = ReglagesPaquet.evaluation(paquet, jour);
      const analyse = el('div', { class: 'pile serree' });
      if (evaluation) {
        const restants = Dates.ecart(jour, evaluation);
        const parJour = ReglagesPaquet.nouvellesParJour(paquet, jour);
        const finDecouverte = repartition.jamaisVues ? Dates.ajouter(jour, Math.ceil(repartition.jamaisVues / parJour) - 1) : null;
        const { passages, fin } = calendrierCarte(reglage.intervalles, jour, evaluation);
        analyse.append(
          el('p', {}, el('strong', { text: `Évaluation dans ${pluriel(restants, 'jour')}.` }),
            ` Jusqu’à la veille, aucune carte ne sera repoussée au-delà : la veille, tout ce qui n’est pas sûr revient.`),
          finDecouverte && el('p', { text: `${pluriel(repartition.jamaisVues, 'carte')} jamais vue${repartition.jamaisVues > 1 ? 's' : ''} : `
            + `${parJour} par jour, toutes découvertes d’ici le ${Dates.formater(finDecouverte)}.` }),
          el('p', { class: 'discret', text: `Une carte découverte aujourd’hui et toujours réussie passera ${pluriel(passages.length, 'fois', 'fois')} avant l’évaluation :` }),
          frise(passages, jour, fin));
        if (restants <= 3) {
          analyse.append(el('div', { class: 'alerte', text: 'C’est tout proche : choisis le rythme intensif et '
            + 'complète par de l’entraînement libre chaque jour.' }));
        }
      } else {
        const { passages, fin } = calendrierCarte(reglage.intervalles, jour, null);
        analyse.append(
          el('p', { class: 'discret', text: 'Sans évaluation prévue, voici les passages d’une carte toujours réussie sur deux mois :' }),
          frise(passages, jour, fin));
      }

      pile.replaceChildren(
        el('section', { class: 'panneau pile' },
          el('h2', { text: 'Le principe' }),
          el('p', { class: 'discret', text: 'Une carte réussie monte d’une boîte et revient plus tard. Ratée, '
            + 'elle redescend dans la boîte 1 et revient dès le lendemain.' }),
          boites),
        el('section', { class: 'panneau pile' },
          el('h2', { text: 'Rythme' }),
          tuiles,
          surMesure),
        el('section', { class: 'panneau pile' },
          el('h2', { text: 'Date d’évaluation' }),
          el('div', { class: 'rangee saisie' }, date,
            reglage.dateEvaluation && el('button', {
              type: 'button',
              class: 'bouton',
              onclick: async () => {
                await ReglagesPaquet.enregistrer(cle, { dateEvaluation: null });
                dessiner();
              },
            }, 'Retirer')),
          analyse),
        el('section', { class: 'panneau pile' },
          el('h2', { text: 'Nouvelles cartes' }),
          champ('Nouvelles cartes par jour', nouvelles, evaluation
            ? `Avec l’évaluation, l’appli en propose au moins ${ReglagesPaquet.nouvellesParJour(paquet, jour)} par jour pour tout voir à temps.`
            : 'Au-delà de 15, les révisions des jours suivants s’alourdissent vite.')));
    };
    dessiner();
  },
};

/* ---------- Fiche d'un paquet (création, modification) ---------- */

Ecrans['editer-paquet'] = {
  titre: 'Paquet',
  titreCourt: 'Paquet',
  parent: 'paquets',
  porte: 'eleve',
  surRetour(id) {
    if (id && id !== 'nouveau') aller('paquet', `p:${id}`);
    else aller('paquets');
  },
  rendre(zone, id) {
    if (!Depot.uid) {
      aller('paquets');
      return;
    }
    const ligne = id && id !== 'nouveau' ? Perso.ligne(id) : null;
    if (id !== 'nouveau' && !ligne) {
      zone.append(el('p', { text: 'Paquet introuvable.' }));
      return;
    }
    const prof = Nuage.compte() && Nuage.compte().prof;
    definirTitre(ligne ? 'Modifier le paquet' : 'Nouveau paquet');

    const titre = el('input', { type: 'text', maxlength: 80, value: ligne ? ligne.titre : '', placeholder: 'ex. : Les ions, Vocabulaire anglais ch. 3' });
    const listeThemes = el('datalist', { id: 'themes-connus' }, ...Perso.themes().map((t) => el('option', { value: t })));
    const theme = el('input', { type: 'text', maxlength: 60, list: 'themes-connus', value: ligne ? ligne.theme : '',
      placeholder: 'ex. : Chimie, Histoire, Anglais' });
    const description = el('textarea', { maxlength: 400, rows: 2, placeholder: 'Facultatif' });
    description.value = ligne ? ligne.description : '';
    let couleur = (ligne && ligne.couleur) || COULEURS_PAQUET[Math.floor(Math.random() * COULEURS_PAQUET.length)];
    const nuancier = el('div', { class: 'nuancier', role: 'group', 'aria-label': 'Couleur' });
    const majNuancier = () => {
      for (const b of nuancier.children) b.setAttribute('aria-pressed', String(b.dataset.couleur === couleur));
    };
    for (const c of COULEURS_PAQUET) {
      nuancier.append(el('button', { type: 'button', class: 'pastille-couleur', 'data-couleur': c, style: `background:${c}`,
        'aria-label': `Couleur ${c}`, onclick: () => { couleur = c; majNuancier(); } }));
    }
    majNuancier();

    let niveaux = ligne ? [...(ligne.niveaux || [])] : [];
    const public_ = el('input', { type: 'checkbox' });
    public_.checked = Boolean(ligne && ligne.public);
    let intervalles = ligne && ligne.reglages && intervallesValides(ligne.reglages.intervalles);
    const rythmeConseille = Object.keys(RYTHMES).find((k) => intervalles && RYTHMES[k].intervalles.join() === intervalles.join()) || 'standard';

    const erreur = el('p', { class: 'erreur', role: 'alert' });
    const enregistrer = el('button', { type: 'submit', class: 'bouton principal bloc grand' }, ligne ? 'Enregistrer' : 'Créer le paquet');

    const formulaire = el('form', { class: 'pile' },
      el('section', { class: 'panneau pile' },
        champ('Titre', titre),
        champ('Thème', theme, 'Les paquets d’un même thème sont rangés ensemble.'),
        listeThemes,
        champ('Description', description),
        el('div', { class: 'champ' }, el('span', { class: 'champ-libelle', text: 'Couleur' }), nuancier)),
      prof && el('section', { class: 'panneau pile' },
        el('h2', { text: 'Bibliothèque commune' }),
        el('label', { class: 'case-a-cocher' }, public_, el('span', { text: 'Publier ce paquet : tous les élèves pourront l’ajouter à leur bibliothèque.' })),
        el('div', { class: 'champ' },
          el('span', { class: 'champ-libelle', text: 'Niveaux visés' }),
          el('div', { class: 'puces' }, ...NIVEAUX.map(([v, l]) => {
            const b = el('button', { type: 'button', class: 'puce', 'aria-pressed': String(niveaux.includes(v)),
              onclick: () => {
                niveaux = niveaux.includes(v) ? niveaux.filter((n) => n !== v) : [...niveaux, v];
                b.setAttribute('aria-pressed', String(niveaux.includes(v)));
              } }, l);
            return b;
          }))),
        el('div', { class: 'champ' },
          el('span', { class: 'champ-libelle', text: 'Rythme conseillé' }),
          selecteur(Object.entries(RYTHMES).map(([k, r]) => [k, r.titre]), rythmeConseille, (v) => {
            intervalles = RYTHMES[v].intervalles;
          }, 'Rythme conseillé'),
          el('span', { class: 'champ-aide', text: 'Chaque élève peut ensuite l’adapter.' }))),
      erreur,
      enregistrer);

    formulaire.addEventListener('submit', async (evenement) => {
      evenement.preventDefault();
      if (!titre.value.trim()) {
        erreur.textContent = 'Donne un titre à ton paquet.';
        titre.focus();
        return;
      }
      enregistrer.disabled = true;
      try {
        const resultat = await Perso.enregistrerPaquet(ligne ? ligne.id : null, {
          titre: titre.value, theme: theme.value, description: description.value, couleur,
          public: public_.checked, niveaux, intervalles: prof ? (intervalles || RYTHMES.standard.intervalles) : undefined,
        });
        annoncer(ligne ? 'Paquet enregistré.' : 'Paquet créé. Ajoute ta première carte !');
        if (ligne) aller('paquet', `p:${resultat.id}`);
        else aller('carte', `${resultat.id}~nouvelle`);
      } catch (e) {
        erreur.textContent = messageNuage(e);
        enregistrer.disabled = false;
      }
    });

    zone.append(formulaire);
    if (ligne) {
      zone.append(el('section', { class: 'panneau pile marge-haut' },
        el('h2', { text: 'Supprimer' }),
        confirmationDeuxTemps({
          libelle: 'Supprimer ce paquet',
          question: `Supprimer « ${ligne.titre} » et toutes ses cartes ?`,
          detail: 'Les cartes et leurs photos seront effacées définitivement.',
          libelleConfirmer: 'Oui, supprimer',
          action: async () => {
            await Perso.supprimerPaquet(ligne.id);
            annoncer('Paquet supprimé.');
            aller('paquets');
          },
        })));
    }
    titre.focus();
  },
};

/* ---------- Les cartes d'un paquet ---------- */

function apercuLigne(ligne) {
  const c = ligne.contenu || {};
  if (ligne.modele === 'masques') return [c.recto || 'Photo à trous', pluriel((c.zones || []).length, 'zone cachée', 'zones cachées')];
  return [c.recto || (c.photoRecto ? '(photo)' : '—'), c.verso || (c.photoVerso ? '(photo)' : '—')];
}

Ecrans.cartes = {
  titre: 'Cartes du paquet',
  titreCourt: 'Cartes',
  parent: 'paquet',
  libelleRetour: 'Paquet',
  porte: 'eleve',
  surRetour(id) {
    aller('paquet', `p:${id}`);
  },
  rendre(zone, id) {
    const ligne = Perso.ligne(id);
    if (!ligne) {
      aller('paquets');
      return;
    }
    definirTitre(ligne.titre);
    const lignes = Perso.lignesCartes(id);
    const pile = el('div', { class: 'pile' },
      el('div', { class: 'rangee' },
        el('button', { type: 'button', class: 'bouton accent', onclick: () => aller('carte', `${id}~nouvelle`) }, '+ Ajouter une carte'),
        el('button', { type: 'button', class: 'bouton', onclick: () => aller('import', id) }, 'Coller une liste')));
    if (!lignes.length) pile.append(el('p', { class: 'discret', text: 'Aucune carte pour l’instant.' }));
    const liste = el('div', { class: 'liste-cartes' });
    for (const l of lignes) {
      const [recto, verso] = apercuLigne(l);
      const photo = (l.contenu || {}).photo || (l.contenu || {}).photoRecto || (l.contenu || {}).photoVerso;
      liste.append(el('button', { type: 'button', class: 'ligne-carte', onclick: () => aller('carte', `${id}~${l.id}`) },
        el('span', { class: 'icone-modele', text: MODELES[l.modele].icone, title: MODELES[l.modele].titre }),
        el('span', { class: 'textes' },
          el('span', { class: 'recto' }, texteCarte(recto.slice(0, 120))),
          el('span', { class: 'verso discret' }, texteCarte(verso.slice(0, 120)))),
        photo && Photos.image(photo, 'vignette')));
    }
    pile.append(liste);
    zone.append(pile);
  },
};
