/* Écrans des objectifs : réviser plusieurs paquets ensemble (38-objectifs.js). */

function bilanObjectif(objectif, jour = Dates.aujourdhui()) {
  const paquets = Objectifs.paquets(objectif);
  return { paquets, bilan: SessionContenu.bilanGroupe(paquets, jour), cartes: paquets.flatMap((p) => p.cartes) };
}

function tuileObjectif(objectif) {
  const { paquets, bilan, cartes } = bilanObjectif(objectif);
  const repartition = Progression.repartition(cartes);
  const aFaire = bilan.dues.length + bilan.nouvellesDuJour;
  let detail;
  if (!paquets.length) detail = 'Aucun paquet : choisis ceux du programme';
  else if (aFaire) {
    detail = `${pluriel(bilan.dues.length, 'carte due', 'cartes dues')} · ${pluriel(bilan.nouvellesDuJour, 'nouvelle')} · `
      + estimerDuree(aFaire, Journal.secondesParCarte());
  } else detail = `Rien à revoir aujourd’hui · ${repartition.acquises} / ${repartition.total} acquises`;

  return el('div', { class: 'tuile-paquet tuile-objectif', style: '--couleur:var(--orange)' },
    el('button', { type: 'button', class: `bouton menu tuile${aFaire ? ' a-faire' : ''}`, onclick: () => aller('objectif', objectif.id) },
      el('span', { class: 'libelle', text: objectif.titre }),
      el('span', { class: 'detail', text: detail }),
      el('span', { class: 'badges' },
        el('span', { class: 'badge accent', text: 'Objectif' }),
        el('span', { class: 'badge', text: pluriel(paquets.length, 'paquet') }),
        el('span', { class: 'badge', text: pluriel(cartes.length, 'carte') }),
        badgeDate(objectif.dateEvaluation))),
    cartes.length ? barreCompartiments(repartition) : null);
}

/** Bloc « Mes objectifs » de la bibliothèque. */
function blocObjectifs() {
  const bloc = el('section', { class: 'pile' });
  if (Objectifs.liste.length) {
    bloc.append(el('h2', { class: 'titre-theme', text: 'Mes objectifs' }), ...Objectifs.liste.map(tuileObjectif));
  }
  return bloc;
}

/* ---------- Un objectif ---------- */

Ecrans.objectif = {
  titre: 'Objectif',
  titreCourt: 'Objectif',
  parent: 'paquets',
  porte: 'tous',
  rendre(zone, id) {
    const objectif = Objectifs.get(id);
    if (!objectif) {
      aller('paquets');
      return;
    }
    definirTitre(objectif.titre);
    const { paquets, bilan, cartes } = bilanObjectif(objectif);
    const pile = el('div', { class: 'pile' });
    zone.append(pile);

    pile.append(el('div', { class: 'badges' },
      el('span', { class: 'badge accent', text: 'Objectif' }),
      el('span', { class: 'badge', text: pluriel(paquets.length, 'paquet') }),
      badgeDate(objectif.dateEvaluation)));

    if (!cartes.length) {
      pile.append(el('div', { class: 'panneau pile vide' },
        el('h2', { text: paquets.length ? 'Ces paquets sont vides' : 'Aucun paquet dans cet objectif' }),
        el('p', { text: 'Choisis les paquets des chapitres au programme.' }),
        el('button', { type: 'button', class: 'bouton principal', onclick: () => aller('editer-objectif', id) }, 'Choisir les paquets')));
      return;
    }

    const repartition = Progression.repartition(cartes);
    const aFaire = bilan.dues.length + bilan.nouvellesDuJour;
    const formats = Paquets.formatsCommuns(cartes);
    if (formats.length && !formats.includes(Profil.donnees.format)) Profil.enregistrer({ format: formats[0] });
    const lancer = (type) => lancerContenu({
      paquets, titre: objectif.titre, retour: ['objectif', id], format: Profil.donnees.format, type,
    });

    pile.append(
      el('div', { class: 'chiffres' },
        chiffre(bilan.dues.length, bilan.enRetard ? `dues, dont ${bilan.enRetard} en retard` : 'cartes dues'),
        chiffre(bilan.nouvellesDuJour, bilan.nouvellesDuJour > 1 ? 'nouvelles' : 'nouvelle'),
        chiffre(`${repartition.acquises} / ${repartition.total}`, 'acquises')),
      barreCompartiments(repartition),
      el('p', { class: 'discret', text: 'Les cartes de tous les paquets sont mélangées. Chacune avance '
        + 'dans son propre paquet, avec ses réglages : rien n’est compté deux fois.' }),
      formats.length > 1 && el('h2', { text: 'Format' }),
      formats.length > 1 && selecteur(formats.map((f) => [f, FORMATS[f]]), Profil.donnees.format, async (format) => {
        await Profil.enregistrer({ format });
      }, 'Format de révision'));

    if (aFaire) {
      pile.append(
        el('p', { class: 'discret', text: `${estimerDuree(aFaire, Journal.secondesParCarte())} pour la séance du jour, `
          + `par séries de ${Profil.donnees.tailleSession} cartes.` }),
        el('button', { type: 'button', class: 'bouton principal bloc grand', onclick: () => lancer('jour') },
          'Commencer la séance du jour'));
    } else {
      pile.append(el('div', { class: 'panneau' },
        el('p', { text: 'Rien à revoir aujourd’hui dans ces paquets. Les cartes reviendront d’elles-mêmes à leur échéance.' })));
    }
    pile.append(
      el('button', { type: 'button', class: `bouton bloc grand ${aFaire ? '' : 'principal'}`, onclick: () => lancer('libre') },
        'S’entraîner librement sur tout le programme'),
      el('h2', { class: 'titre-theme', text: 'Paquets au programme' }),
      ...paquets.map(tuilePaquet),
      el('button', { type: 'button', class: 'bouton bloc', onclick: () => aller('editer-objectif', id) },
        'Modifier l’objectif : titre, date, paquets'));
  },
};

/* ---------- Créer ou modifier un objectif ---------- */

Ecrans['editer-objectif'] = {
  titre: 'Nouvel objectif',
  titreCourt: 'Objectif',
  parent: 'paquets',
  porte: 'tous',
  rendre(zone, id) {
    const existant = id && id !== 'nouveau' ? Objectifs.get(id) : null;
    if (existant) definirTitre(`Modifier · ${existant.titre}`);
    const choisis = new Set(existant ? existant.cles : []);
    const jour = Dates.aujourdhui();

    const titre = el('input', { type: 'text', value: existant ? existant.titre : '', maxlength: 80,
      placeholder: 'ex. : Bac blanc de février', autocomplete: 'off' });
    const date = el('input', { type: 'date', value: (existant && existant.dateEvaluation) || '', min: Dates.ajouter(jour, 1) });
    const compteur = el('p', { class: 'discret' });
    const erreur = el('p', { class: 'erreur', role: 'alert' });
    const majCompteur = () => {
      const cartes = [...choisis].map((c) => Paquets.get(c)).filter(Boolean).reduce((n, p) => n + p.cartes.length, 0);
      compteur.textContent = `${pluriel(choisis.size, 'paquet choisi', 'paquets choisis')} · ${pluriel(cartes, 'carte')}`;
    };

    const paquets = Bibliotheque.paquets();
    const liste = el('div', { class: 'pile serree' });
    for (const [theme, groupe] of parTheme(paquets)) {
      const cases = groupe.map((paquet) => {
        const coche = el('input', { type: 'checkbox' });
        coche.checked = choisis.has(paquet.cle);
        coche.addEventListener('change', () => {
          if (coche.checked) choisis.add(paquet.cle);
          else choisis.delete(paquet.cle);
          majCompteur();
        });
        return el('label', { class: 'case' }, coche,
          el('span', {}, paquet.titre, ' ', el('span', { class: 'discret petit', text: `· ${pluriel(paquet.cartes.length, 'carte')}` })));
      });
      liste.append(
        el('div', { class: 'ligne-entete' },
          el('h3', { text: theme }),
          el('button', {
            type: 'button',
            class: 'bouton petit',
            onclick: () => {
              const toutes = cases.every((c) => c.querySelector('input').checked);
              for (const c of cases) {
                const coche = c.querySelector('input');
                coche.checked = !toutes;
                coche.dispatchEvent(new Event('change'));
              }
            },
          }, 'Tout le thème')),
        ...cases);
    }
    majCompteur();

    const formulaire = el('form', { class: 'pile' },
      el('p', { text: 'Un objectif réunit les paquets d’une même évaluation, par exemple tous les chapitres '
        + 'au programme d’un bac blanc. Tu les révises en une seule séance, cartes mélangées.' }),
      el('section', { class: 'panneau pile' },
        champ('Nom de l’objectif', titre),
        champ('Date de l’évaluation (facultatif)', date, 'Aucune carte de ces paquets ne sera repoussée '
          + 'après la veille, et les nouvelles cartes arrivent plus vite pour que tout ait été vu trois jours avant.')),
      el('section', { class: 'panneau pile' },
        el('h2', { text: 'Paquets au programme' }),
        paquets.length ? liste : el('p', { class: 'discret', text: 'Ta bibliothèque est vide : ajoute d’abord des paquets.' }),
        compteur),
      erreur,
      el('button', { type: 'submit', class: 'bouton principal bloc grand' }, existant ? 'Enregistrer' : 'Créer l’objectif'));

    formulaire.addEventListener('submit', async (evenement) => {
      evenement.preventDefault();
      if (!titre.value.trim()) {
        erreur.textContent = 'Donne un nom à l’objectif.';
        titre.focus();
        return;
      }
      if (!choisis.size) {
        erreur.textContent = 'Choisis au moins un paquet.';
        return;
      }
      // Les paquets retirés de la bibliothèque depuis restent hors de la liste.
      const objectif = await Objectifs.enregistrer({
        id: existant && existant.id,
        titre: titre.value,
        cles: [...choisis].filter((c) => Paquets.get(c)),
        dateEvaluation: date.value || null,
      });
      annoncer(existant ? 'Objectif enregistré.' : `Objectif « ${objectif.titre} » créé.`);
      aller('objectif', objectif.id);
    });

    zone.append(formulaire);
    if (existant) {
      zone.append(el('section', { class: 'panneau pile marge-haut' },
        confirmationDeuxTemps({
          libelle: 'Supprimer cet objectif',
          question: `Supprimer « ${existant.titre} » ?`,
          detail: 'Les paquets et ta progression restent intacts : seul le regroupement disparaît.',
          libelleConfirmer: 'Oui, supprimer',
          action: async () => {
            await Objectifs.supprimer(existant.id);
            annoncer('Objectif supprimé.');
            aller('paquets');
          },
        })));
    } else {
      titre.focus();
    }
  },
};
