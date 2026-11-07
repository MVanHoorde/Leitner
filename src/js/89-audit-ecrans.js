/* Audit des paquets livrés : l'enseignant relit, carte par carte, ce que verra l'élève.
 *
 * Écrans « audit » (les paquets à relire, niveau par niveau) et « audit-niveau »
 * (#/audit-niveau/<paquet>~<section>) : chaque carte avec sa réponse, ses pièges,
 * son aide ; une carte générative se retire à volonté. Pour chaque carte, un
 * avis (bien, à revoir) et une remarque libre ; pour chaque niveau, « relu ».
 *
 * Réservé à un compte enseignant, dans l'entrée flashcards. Les remarques sont
 * rangées dans le profil (clé « audit ») : en ligne avec le compte, donc
 * retrouvées sur un autre appareil, sans table nouvelle. « Exporter » en fait un
 * fichier Markdown à confier à Claude pour corriger les paquets.
 *
 * Sont listés les paquets qui portent audit: 'brouillon' (invisibles des
 * élèves) ou audit: 'ouvert' (déjà visibles). Valider un paquet, c'est retirer
 * cette propriété dans son fichier : l'écran ne publie rien lui-même.
 */

const AVIS_AUDIT = { bien: '👍 Bien', revoir: '✏️ À revoir' };

const Audit = {
  donnees: null,
  minuteur: null,

  async charger() {
    const stocke = await Depot.lire('audit');
    this.donnees = { cartes: {}, sections: {}, ...(stocke || {}) };
    return this.donnees;
  },

  paquets() {
    return Paquets.liste.filter((p) => p.origine === 'integre' && p.audit);
  },

  carte(id) {
    return this.donnees.cartes[id] || { avis: null, note: '' };
  },

  section(paquet, cle) {
    return this.donnees.sections[`${paquet.cle}/${cle}`] || { relu: null, note: '' };
  },

  async noterCarte(id, changements) {
    const suite = { ...this.carte(id), ...changements, date: Dates.aujourdhui() };
    const cartes = { ...this.donnees.cartes };
    if (!suite.avis && !suite.note) delete cartes[id];
    else cartes[id] = suite;
    this.donnees = { ...this.donnees, cartes };
    await this.enregistrer();
  },

  async noterSection(paquet, cle, changements) {
    const id = `${paquet.cle}/${cle}`;
    this.donnees = { ...this.donnees, sections: { ...this.donnees.sections, [id]: { ...this.section(paquet, cle), ...changements } } };
    await this.enregistrer();
  },

  enregistrer() {
    return Depot.ecrire('audit', this.donnees);
  },

  /** Une remarque tapée part après une courte pause, et au plus tard en quittant le champ. */
  plusTard(action) {
    clearTimeout(this.minuteur);
    this.minuteur = setTimeout(action, 800);
  },

  /** Où en est un niveau : cartes, avis donnés, cartes à revoir. */
  bilan(paquet, section) {
    const avis = section.cartes.map((c) => this.carte(c.id));
    return {
      total: section.cartes.length,
      vues: avis.filter((a) => a.avis).length,
      aRevoir: avis.filter((a) => a.avis === 'revoir' || (a.note && a.avis !== 'bien')).length,
      remarques: avis.filter((a) => a.note).length,
      relu: this.section(paquet, section.cle).relu,
    };
  },

  aRelire() {
    return this.paquets().reduce((n, p) => n + p.sections.filter((s) => !this.section(p, s.cle).relu).length, 0);
  },

  /** Les remarques en Markdown, avec l'énoncé de chaque carte pour la retrouver d'un coup d'œil. */
  exporter() {
    const lignes = [`# Audit des paquets — remarques du ${Dates.formater(Dates.aujourdhui(), true)}`, ''];
    for (const paquet of this.paquets()) {
      lignes.push(`## ${paquet.titre} (\`${paquet.cle}\`, ${paquet.audit})`, '');
      for (const section of paquet.sections) {
        const etat = this.section(paquet, section.cle);
        const bilan = this.bilan(paquet, section);
        lignes.push(`### ${section.titre} — ${etat.relu ? `relu le ${Dates.formater(etat.relu)}` : 'pas encore relu'}`
          + ` · ${bilan.vues}/${bilan.total} cartes jugées`, '');
        if (etat.note) lignes.push(`> ${etat.note.replace(/\n/g, '\n> ')}`, '');
        for (const carte of section.cartes) {
          const a = this.carte(carte.id);
          if (!a.avis && !a.note) continue;
          const enonce = String(carte.question || '').replace(/\s+/g, ' ').slice(0, 120);
          lignes.push(`- \`${carte.id}\` — ${a.avis ? AVIS_AUDIT[a.avis] : 'remarque'} — *${enonce}*`);
          if (a.note) lignes.push(`  - ${a.note.replace(/\n/g, '\n    ')}`);
        }
        lignes.push('');
      }
    }
    return lignes.join('\n');
  },
};

function telechargerTexte(nom, texte) {
  const lien = el('a', { href: URL.createObjectURL(new Blob([texte], { type: 'text/markdown;charset=utf-8' })), download: nom });
  document.body.append(lien);
  lien.click();
  setTimeout(() => {
    URL.revokeObjectURL(lien.href);
    lien.remove();
  }, 1000);
}

/** Encadré de « Ma bibliothèque », pour un enseignant : ce qui reste à relire. */
function blocAuditBibliotheque() {
  if (!Porte.enseignant() || !Audit.paquets().length) return null;
  const bouton = boutonMenu('Audit des paquets', 'Chargement…', () => aller('audit'), 'accent');
  Audit.charger().then(() => {
    const n = Audit.aRelire();
    bouton.querySelector('.detail').textContent = n
      ? `${pluriel(n, 'niveau')} à relire, sur ${pluriel(Audit.paquets().length, 'paquet')} en audit`
      : 'Tout est relu : exporte tes remarques pour les corrections.';
  });
  return bouton;
}

Ecrans.audit = {
  titre: 'Audit des paquets',
  titreCourt: 'Audit',
  parent: 'paquets',
  porte: 'eleve',
  async rendre(zone) {
    if (!Porte.enseignant()) {
      zone.append(el('div', { class: 'panneau' }, el('p', { text: 'Réservé à un compte enseignant.' })));
      return;
    }
    await Audit.charger();
    const pile = el('div', { class: 'pile' });
    zone.append(pile);
    pile.append(
      el('p', { class: 'discret', text: 'Les paquets livrés avec l’application, à relire avant de les ouvrir aux élèves. '
        + 'Un brouillon reste invisible des élèves tant qu’il n’est pas validé dans le code. Tes avis et remarques '
        + 'sont gardés dans ton compte : exporte-les pour les corrections.' }),
      el('div', { class: 'rangee' },
        el('button', {
          type: 'button',
          class: 'bouton accent',
          onclick: () => {
            telechargerTexte(`audit-paquets-${Dates.aujourdhui()}.md`, Audit.exporter());
            annoncer('Remarques exportées.');
          },
        }, 'Exporter mes remarques (.md)')));

    for (const paquet of Audit.paquets()) {
      const lignes = paquet.sections.map((section) => {
        const b = Audit.bilan(paquet, section);
        const detail = [
          pluriel(b.total, 'carte'),
          b.vues ? `${b.vues} jugée${b.vues > 1 ? 's' : ''}` : null,
          b.aRevoir ? `${b.aRevoir} à revoir` : null,
          b.relu ? `✓ relu le ${Dates.formater(b.relu)}` : 'à relire',
        ].filter(Boolean).join(' · ');
        return boutonMenu(section.titre, detail, () => aller('audit-niveau', `${paquet.cle}~${section.cle}`), b.relu ? '' : 'principal');
      });
      pile.append(el('section', { class: 'panneau pile' },
        el('div', { class: 'ligne-entete' },
          el('h2', { text: paquet.titre }),
          el('span', { class: `badge ${paquet.audit === 'brouillon' ? 'urgent' : 'accent'}`,
            text: paquet.audit === 'brouillon' ? 'Brouillon : invisible des élèves' : 'Ouvert aux élèves' })),
        paquet.resume && el('p', { class: 'discret', text: paquet.resume }),
        ...lignes));
    }
  },
};

/** Ce que voit l'élève, et ce qu'il doit répondre, pour un tirage d'une carte. */
function detailCarteAudit(carte) {
  const t = carte.generer ? { ...carte, ...carte.generer() } : carte;
  const formats = Paquets.formatsDe(carte).map((f) => FORMATS[f]).join(', ');
  const ligne = (libelle, contenu) => contenu && el('div', { class: 'pile serree' },
    el('strong', { class: 'discret', text: libelle }), contenu);
  const valeurs = [
    t.nombre !== undefined && `valeur ${chNombre(t.nombre)}${t.tolerance ? ` (écart admis ${Math.round(t.tolerance * 100)} %)` : ''}`,
    (t.unite || carte.unite) && `unité affichée : ${t.unite || carte.unite}`,
    t.ecritureScientifique && 'écriture scientifique exigée',
  ].filter(Boolean).join(' · ');
  const pieges = t.distracteurs && t.distracteurs.length
    ? el('ul', {}, ...t.distracteurs.map((d) => el('li', {}, texteCarte(d))))
    : Paquets.formatsDe(carte).includes('qcm') && el('p', { class: 'discret', text: 'Pris parmi les réponses du niveau.' });
  return el('div', { class: 'pile serree' },
    el('p', { class: 'discret', text: `${formats}${carte.consigne ? ` · consigne : « ${carte.consigne} »` : ''}` }),
    ligne('Énoncé', texteCarte(t.question)),
    typeof t.vrai === 'boolean' && ligne('Attendu', el('p', { text: t.vrai ? 'Vrai' : 'Faux' })),
    ligne('Réponse', texteCarte(t.reponse)),
    valeurs && el('p', { class: 'discret', text: valeurs }),
    t.saisie && t.saisie.length ? ligne('Acceptées aussi à l’écrit', el('p', { text: t.saisie.join(' · ') })) : null,
    ligne('Pièges', pieges),
    t.aide && ligne('Aide', texteCarte(t.aide)));
}

function blocCarteAudit(carte) {
  const avis = Audit.carte(carte.id);
  const contenu = el('div', {});
  const tirer = () => contenu.replaceChildren(detailCarteAudit(carte));
  tirer();

  const note = el('textarea', { rows: 2, placeholder: 'Ce qui te plaît ou te gêne (facultatif)', 'aria-label': 'Remarque sur la carte' });
  note.value = avis.note || '';
  const sauver = () => Audit.noterCarte(carte.id, { note: note.value.trim() });
  note.addEventListener('input', () => Audit.plusTard(sauver));
  note.addEventListener('change', sauver);

  const boutons = el('div', { class: 'puces', role: 'group', 'aria-label': 'Avis sur la carte' });
  const majBoutons = () => {
    for (const b of boutons.children) b.setAttribute('aria-pressed', String(b.dataset.avis === (Audit.carte(carte.id).avis || '')));
  };
  for (const [cle, libelle] of Object.entries(AVIS_AUDIT)) {
    boutons.append(el('button', {
      type: 'button',
      class: 'puce',
      'data-avis': cle,
      onclick: async () => {
        // Un second appui retire l'avis.
        await Audit.noterCarte(carte.id, { avis: Audit.carte(carte.id).avis === cle ? null : cle });
        majBoutons();
      },
    }, libelle));
  }
  majBoutons();

  return el('section', { class: 'panneau pile serree' },
    el('div', { class: 'ligne-entete' },
      el('code', { class: 'discret', text: carte.id }),
      carte.generer && el('button', { type: 'button', class: 'bouton', onclick: tirer }, '🎲 Autre tirage')),
    contenu,
    boutons,
    note);
}

Ecrans['audit-niveau'] = {
  titre: 'Audit',
  titreCourt: 'Niveau',
  parent: 'audit',
  porte: 'eleve',
  async rendre(zone, param) {
    const [cle, cleSection] = String(param || '').split('~');
    const paquet = Paquets.get(cle);
    const section = paquet && Paquets.section(paquet, cleSection);
    if (!Porte.enseignant() || !section) {
      zone.append(el('div', { class: 'panneau' }, el('p', { text: 'Niveau introuvable, ou réservé à un compte enseignant.' })));
      return;
    }
    await Audit.charger();
    definirTitre(`${paquet.titre} · ${section.titre.split(' · ')[0]}`);
    const pile = el('div', { class: 'pile' });
    zone.append(pile);

    const etat = Audit.section(paquet, section.cle);
    const remarque = el('textarea', { rows: 3, placeholder: 'Remarque générale sur ce niveau : ce qui manque, l’équilibre, la difficulté…',
      'aria-label': 'Remarque sur le niveau' });
    remarque.value = etat.note || '';
    const sauver = () => Audit.noterSection(paquet, section.cle, { note: remarque.value.trim() });
    remarque.addEventListener('input', () => Audit.plusTard(sauver));
    remarque.addEventListener('change', sauver);

    const relu = el('button', { type: 'button', class: 'bouton bloc' });
    const majRelu = () => {
      const date = Audit.section(paquet, section.cle).relu;
      relu.textContent = date ? `✓ Relu le ${Dates.formater(date)} · annuler` : 'Marquer ce niveau comme relu';
      relu.classList.toggle('principal', !date);
    };
    relu.onclick = async () => {
      await Audit.noterSection(paquet, section.cle, { relu: Audit.section(paquet, section.cle).relu ? null : Dates.aujourdhui() });
      majRelu();
    };
    majRelu();

    pile.append(
      el('p', { class: 'discret', text: `${section.titre} · ${pluriel(section.cartes.length, 'carte')}. `
        + 'Une carte marquée 🎲 tire de nouvelles valeurs à chaque passage : retire-la pour en voir d’autres.' }),
      el('button', {
        type: 'button',
        class: 'bouton',
        onclick: () => lancerContenu({ paquet, section: section.cle, format: 'mixte', type: 'libre', retour: ['audit-niveau', param] }),
      }, 'Essayer ce niveau comme un élève'),
      ...section.cartes.map(blocCarteAudit),
      el('section', { class: 'panneau pile serree' }, el('h2', { text: 'Ce niveau' }), remarque, relu));
  },
};
