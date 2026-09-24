/* Statistiques des paquets de contenu : régularité, avancement, points faibles.
 *
 * Tout se déduit de ce qui est déjà stocké — la progression carte par carte et
 * le journal jour par jour. Rien n'est calculé à l'avance ni dupliqué en base.
 */

/** Paquets du niveau de l'élève, plus tous ceux qu'il a déjà entamés. */
function paquetsSuivis() {
  const attendus = Porte.courante === 'eleve' ? Paquets.pourNiveau(Profil.niveau) : Paquets.liste;
  const entames = Paquets.liste.filter((p) => p.cartes.some((c) => Progression.cartes.has(c.id)));
  return Paquets.liste.filter((p) => attendus.includes(p) || entames.includes(p));
}

function anneauProgression(part, libelle, description) {
  const rayon = 54;
  const tour = 2 * Math.PI * rayon;
  return svg('svg', {
    viewBox: '0 0 140 140',
    class: 'anneau',
    role: 'img',
    'aria-label': description,
  },
  svg('circle', { cx: 70, cy: 70, r: rayon, fill: 'none', stroke: '#E4EAF3', 'stroke-width': 13 }),
  part > 0 && svg('circle', {
    cx: 70, cy: 70, r: rayon, fill: 'none', stroke: '#1B2A4A', 'stroke-width': 13,
    'stroke-linecap': 'round',
    'stroke-dasharray': `${part * tour} ${tour}`,
    transform: 'rotate(-90 70 70)',
  }),
  svg('text', { x: 70, y: 68, 'text-anchor': 'middle', 'font-size': 30, 'font-weight': 700, fill: '#1B2A4A', text: `${Math.round(part * 100)} %` }),
  svg('text', { x: 70, y: 92, 'text-anchor': 'middle', 'font-size': 14, fill: '#56647D', text: libelle }));
}

/* ---------- Régularité ---------- */

const NIVEAUX_INTENSITE = [1, 6, 16, 31];

function intensite(vues) {
  if (!vues) return 0;
  return NIVEAUX_INTENSITE.filter((seuil) => vues >= seuil).length;
}

/**
 * Une case par jour, en colonnes du lundi au dimanche. On termine la grille à
 * la fin de la semaine en cours pour que la dernière colonne reste entière.
 */
function calendrierRevisions(semaines = 12, jour = Dates.aujourdhui()) {
  const joursJusquAuDimanche = 6 - ((Dates.versDate(jour).getDay() + 6) % 7);
  const fin = Dates.ajouter(jour, joursJusquAuDimanche);
  const debut = Dates.ajouter(fin, -(semaines * 7 - 1));

  const grille = el('div', { class: 'calendrier', role: 'img',
    'aria-label': `Révisions des ${semaines} dernières semaines` });
  for (let i = 0; i < semaines * 7; i += 1) {
    const date = Dates.ajouter(debut, i);
    const { vues, justes } = Journal.du(date);
    const futur = date > jour;
    grille.append(el('div', {
      class: `case n${futur ? 0 : intensite(vues)}${futur ? ' futur' : ''}${date === jour ? ' aujourdhui' : ''}`,
      title: futur ? Dates.formater(date)
        : `${Dates.formater(date)} — ${vues ? `${vues} cartes, ${justes} justes` : 'rien'}`,
    }));
  }

  const legende = el('div', { class: 'legende-calendrier' },
    el('span', { class: 'discret', text: 'Moins' }),
    ...[0, 1, 2, 3, 4].map((n) => el('span', { class: `case n${n}` })),
    el('span', { class: 'discret', text: 'Plus' }));

  return el('div', { class: 'pile serree' }, grille, legende);
}

/* ---------- Ce qui arrive ---------- */

/** Cartes à revoir aujourd'hui puis pour chacun des jours suivants. */
function previsionEcheances(cartes, nombreJours, jour) {
  const colonnes = [];
  for (let i = 0; i < nombreJours; i += 1) {
    const date = Dates.ajouter(jour, i);
    const compte = cartes.filter((c) => (i === 0 ? c.echeance !== null && c.echeance <= date : c.echeance === date)).length;
    colonnes.push({ date, compte, jour: i });
  }
  return colonnes;
}

function histogrammePrevision(colonnes) {
  const maximum = Math.max(1, ...colonnes.map((c) => c.compte));
  const barres = el('div', { class: 'histogramme', role: 'img',
    'aria-label': colonnes.map((c) => `${Dates.formater(c.date)} : ${c.compte}`).join(', ') });
  for (const colonne of colonnes) {
    const nomJour = Dates.versDate(colonne.date).toLocaleDateString('fr-FR', { weekday: 'narrow' });
    barres.append(el('div', { class: `colonne${colonne.jour === 0 ? ' aujourdhui' : ''}`, title: `${Dates.formater(colonne.date)} : ${pluriel(colonne.compte, 'carte')}` },
      el('span', { class: 'valeur', text: colonne.compte || '' }),
      el('span', { class: 'barre', style: `height:${(colonne.compte / maximum) * 100}%` }),
      el('span', { class: 'jour', text: nomJour })));
  }
  return barres;
}

/* ---------- Points faibles ---------- */

/** Taux de réussite par section, sur les cartes déjà travaillées. */
function reussiteParSection() {
  const cumul = new Map();
  for (const etat of Progression.cartes.values()) {
    const carte = Paquets.index.get(etat.id);
    if (!carte || !etat.passages) continue;
    const paquet = Paquets.get(carte.paquet);
    const section = Paquets.section(paquet, carte.section);
    if (!section) continue;
    const cle = `${carte.paquet}/${carte.section}`;
    const ligne = cumul.get(cle) || { titre: section.titre, paquet: paquet.titre,
      clePaquet: carte.paquet, cleSection: carte.section, passages: 0, reussites: 0, cartes: 0 };
    ligne.passages += etat.passages;
    ligne.reussites += etat.reussites;
    ligne.cartes += 1;
    cumul.set(cle, ligne);
  }
  return [...cumul.values()]
    .filter((l) => l.passages >= 3)
    .map((l) => ({ ...l, taux: l.reussites / l.passages }))
    .sort((a, b) => a.taux - b.taux);
}

function ligneReussite(ligne) {
  const pourcentage = Math.round(ligne.taux * 100);
  const classe = pourcentage >= 80 ? 'bon' : pourcentage >= 55 ? 'moyen' : 'faible';
  return el('div', { class: 'ligne-reussite' },
    el('div', { class: 'ligne-entete' },
      el('span', { class: 'ligne-titre', text: ligne.titre }),
      el('span', { class: `ligne-taux ${classe}`, text: `${pourcentage} %` })),
    el('div', { class: 'jauge' }, el('span', { class: `remplissage ${classe}`, style: `width:${pourcentage}%` })),
    el('span', { class: 'discret', text: `${ligne.paquet} · ${pluriel(ligne.passages, 'passage')} sur ${pluriel(ligne.cartes, 'carte')}` }));
}

/* ---------- L'écran ---------- */

Ecrans.statistiques = {
  titre: 'Progression',
  titreCourt: 'Progression',
  parent: 'paquets',
  porte: 'tous',
  rendre(zone) {
    const jour = Dates.aujourdhui();
    const paquets = paquetsSuivis();
    const cartes = paquets.flatMap((p) => p.cartes);
    const etats = Progression.etats(cartes);
    const repartition = Progression.repartition(cartes);
    const total = Journal.total();
    const aujourdhui = Journal.du(jour);
    const serie = Journal.serie(jour);

    const pile = el('div', { class: 'pile' });
    zone.append(pile);

    if (!total.vues) {
      pile.append(
        el('div', { class: 'panneau pile' },
          el('h2', { text: 'Rien à montrer pour l’instant' }),
          el('p', { text: 'Fais une première séance : la régularité, l’avancement et les points '
            + 'faibles apparaîtront ici.' })),
        el('button', { type: 'button', class: 'bouton principal bloc grand', onclick: () => aller('paquets') },
          'Choisir un paquet'));
      return;
    }

    /* Le jour même */
    pile.append(el('div', { class: 'chiffres' },
      chiffre(serie, serie > 1 ? 'jours d’affilée' : 'jour d’affilée'),
      chiffre(aujourdhui.vues, 'cartes vues aujourd’hui'),
      chiffre(aujourdhui.vues ? `${Math.round((aujourdhui.justes / aujourdhui.vues) * 100)} %` : '—', 'justes aujourd’hui')));

    /* Avancement */
    pile.append(el('section', { class: 'panneau pile' },
      el('h2', { text: 'Avancement' }),
      el('div', { class: 'rangee avancement' },
        anneauProgression(repartition.avancement, 'du chemin',
          `${Math.round(repartition.avancement * 100)} % du chemin parcouru sur ${repartition.total} cartes`),
        el('div', { class: 'pile serree avancement-detail' },
          el('p', { text: `${pluriel(repartition.acquises, 'carte acquise', 'cartes acquises')} `
            + `(compartiment 5) sur ${repartition.total}.` }),
          el('p', { class: 'discret', text: `${repartition.total - repartition.jamaisVues - repartition.acquises} en cours, `
            + `${repartition.jamaisVues} jamais vues.` }),
          barreCompartiments(repartition)))));

    /* Régularité */
    const record = Journal.meilleureSerie();
    pile.append(el('section', { class: 'panneau pile' },
      el('h2', { text: 'Régularité' }),
      el('p', { class: 'discret', text: `${pluriel(total.jours, 'jour')} de révision, `
        + `${pluriel(total.vues, 'carte vue', 'cartes vues')}, ${formaterDuree(total.secondes)} au total. `
        + `Meilleure série : ${pluriel(record, 'jour')}.` }),
      calendrierRevisions(12, jour)));

    /* Charge à venir */
    const prevision = previsionEcheances(etats, 14, jour);
    const sommeSemaine = prevision.slice(0, 7).reduce((s, c) => s + c.compte, 0);
    pile.append(el('section', { class: 'panneau pile' },
      el('h2', { text: 'Les deux prochaines semaines' }),
      histogrammePrevision(prevision),
      el('p', { class: 'discret', text: sommeSemaine
        ? `${pluriel(sommeSemaine, 'carte')} à revoir dans les sept prochains jours, soit `
          + `${estimerDuree(Math.round(sommeSemaine / 7), Journal.secondesParCarte())} par jour.`
        : 'Rien de prévu : toutes les cartes travaillées sont posées pour un moment.' })));

    /* Points faibles */
    const lignes = reussiteParSection();
    if (lignes.length) {
      const faibles = lignes.slice(0, 5);
      const solides = lignes.slice(-3).reverse().filter((l) => !faibles.includes(l));
      const pire = lignes[0];
      pile.append(el('section', { class: 'panneau pile' },
        el('h2', { text: 'Là où ça résiste' }),
        el('p', { class: 'discret', text: 'Taux de réussite par section, du plus fragile au plus sûr.' }),
        ...faibles.map(ligneReussite),
        pire.taux < 0.8 && el('button', {
          type: 'button',
          class: 'bouton accent bloc',
          onclick: () => lancerContenu({
            paquet: Paquets.get(pire.clePaquet),
            section: pire.cleSection,
            format: Profil.donnees.format,
            type: 'libre',
          }),
        }, `Retravailler « ${pire.titre} » maintenant`),
        solides.length && el('h3', { text: 'Bien acquis' }),
        ...solides.map(ligneReussite)));
    }

    /* Par paquet */
    pile.append(el('section', { class: 'panneau pile' },
      el('h2', { text: 'Par paquet' }),
      ...paquets.map((paquet) => {
        const r = Progression.repartition(paquet.cartes);
        return el('div', { class: 'pile serree' },
          el('div', { class: 'ligne-entete' },
            el('span', { class: 'ligne-titre', text: paquet.titre }),
            el('span', { class: 'discret', text: `${r.acquises} / ${r.total}` })),
          barreCompartiments(r));
      })));
  },
};
