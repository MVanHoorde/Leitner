/* Gestion des classes du trombinoscope : renommer, supprimer, retirer la
 * démonstration, ajouter un élève à la main (arrivée en cours d'année). */

/** Photo choisie ou prise sur l'appareil, réduite comme celles des trombinoscopes importés. */
async function photoDepuisFichier(fichier) {
  const url = URL.createObjectURL(fichier);
  try {
    const image = await new Promise((resoudre, rejeter) => {
      const img = new Image();
      img.onload = () => resoudre(img);
      img.onerror = () => rejeter(new Error('Cette image ne peut pas être lue.'));
      img.src = url;
    });
    const reduction = Math.min(1, TAILLE_PHOTO / Math.max(image.naturalWidth, image.naturalHeight));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(image.naturalWidth * reduction));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * reduction));
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', QUALITE_JPEG);
  } finally {
    URL.revokeObjectURL(url);
  }
}

/** Bloc d'une classe : voir, renommer, supprimer. */
function blocClasse(classe) {
  const eleves = Etat.listeEleves(classe);
  const bloc = el('section', { class: 'panneau pile serree' });
  const dessiner = (renommage = false) => {
    if (renommage) {
      const entree = el('input', { type: 'text', value: classe, autocomplete: 'off', list: 'liste-classes-gestion' });
      const formulaire = el('form', { class: 'pile serree' },
        champ('Nouveau nom de la classe', entree, 'Le nom d’une classe existante fusionne les deux.'),
        el('div', { class: 'rangee' },
          el('button', { type: 'submit', class: 'bouton principal' }, 'Renommer'),
          el('button', { type: 'button', class: 'bouton', onclick: () => dessiner(false) }, 'Annuler')));
      formulaire.addEventListener('submit', async (evenement) => {
        evenement.preventDefault();
        const nouveau = entree.value.replace(/\s+/g, ' ').trim();
        if (!nouveau) {
          annoncer('Indiquez le nom de la classe.');
          return;
        }
        if (nouveau === classe) {
          dessiner(false);
          return;
        }
        const fusion = Etat.classes().includes(nouveau);
        await Etat.renommerClasse(classe, nouveau);
        annoncer(fusion ? `« ${classe} » fusionnée dans « ${nouveau} ».` : `Classe renommée en « ${nouveau} ».`);
        afficher();
      });
      bloc.replaceChildren(formulaire);
      entree.focus();
      entree.select();
      return;
    }
    bloc.replaceChildren(
      el('div', { class: 'ligne-entete' },
        el('strong', { class: 'ligne-titre', text: classe }),
        el('span', { class: 'discret', text: pluriel(eleves.length, 'élève') })),
      el('div', { class: 'rangee' },
        el('button', {
          type: 'button',
          class: 'bouton',
          onclick: () => {
            Etat.filtreClasse = classe;
            aller('eleves');
          },
        }, 'Voir les élèves'),
        el('button', { type: 'button', class: 'bouton', onclick: () => dessiner(true) }, 'Renommer'),
        el('button', { type: 'button', class: 'bouton', onclick: () => aller('nouvel-eleve', classe) }, '+ Élève')),
      confirmationDeuxTemps({
        libelle: 'Supprimer la classe',
        question: `Supprimer « ${classe} » et ses ${pluriel(eleves.length, 'élève')} ?`,
        detail: 'Leurs photos et leur progression seront effacées de cet appareil.',
        libelleConfirmer: 'Oui, supprimer la classe',
        classeBouton: 'bouton danger',
        action: async () => {
          await Etat.supprimerClasse(classe);
          annoncer(`Classe « ${classe} » supprimée.`);
          afficher();
        },
      }));
  };
  dessiner(false);
  return bloc;
}

Ecrans.classes = {
  titre: 'Mes classes',
  titreCourt: 'Classes',
  parent: 'accueil',
  rendre(zone) {
    const pile = el('div', { class: 'pile' });
    zone.append(pile);
    const fictifs = elevesFictifs();
    if (fictifs.length) {
      const classes = [...new Set(fictifs.map((e) => e.classe))];
      pile.append(el('div', { class: 'alerte pile serree' },
        el('p', {}, el('strong', { text: `${pluriel(fictifs.length, 'élève fictif', 'élèves fictifs')} de la démonstration` }),
          ` : ${classes.join(', ')}.`),
        el('p', { class: 'discret', text: 'Ces élèves aux visages dessinés viennent du bouton « Essayer avec des élèves fictifs ». '
          + 'Seuls eux seront retirés : un vrai élève de même classe reste en place.' }),
        confirmationDeuxTemps({
          libelle: 'Supprimer les élèves fictifs',
          question: `Supprimer les ${pluriel(fictifs.length, 'élève fictif', 'élèves fictifs')} ?`,
          detail: 'Leur progression de démonstration sera effacée.',
          libelleConfirmer: 'Oui, les supprimer',
          classeBouton: 'bouton danger bloc',
          action: async () => {
            await Etat.supprimerEleves(fictifs.map((e) => e.id));
            annoncer('Élèves fictifs supprimés.');
            afficher();
          },
        })));
    }
    const classes = Etat.classes();
    pile.append(
      el('div', { class: 'rangee' },
        el('button', { type: 'button', class: 'bouton accent', onclick: () => aller('nouvel-eleve') }, '+ Ajouter un élève'),
        el('button', { type: 'button', class: 'bouton', onclick: () => aller('import') }, 'Importer un trombinoscope PDF')),
      el('datalist', { id: 'liste-classes-gestion' }, classes.map((c) => el('option', { value: c }))));
    if (!classes.length) {
      pile.append(el('p', { class: 'discret', text: 'Aucune classe pour l’instant.' }));
      return;
    }
    pile.append(...classes.map(blocClasse));
  },
};

/* ---------- Ajouter un élève à la main ---------- */

Ecrans['nouvel-eleve'] = {
  titre: 'Ajouter un élève',
  titreCourt: 'Nouvel élève',
  parent: 'classes',
  rendre(zone, classeInitiale) {
    let photo = '';
    const nom = el('input', { type: 'text', autocomplete: 'off', required: true });
    const prenom = el('input', { type: 'text', autocomplete: 'off' });
    const classe = el('input', { type: 'text', autocomplete: 'off', list: 'liste-classes-ajout', value: classeInitiale || Etat.filtreClasse || '' });
    const apercu = el('div', { class: 'photo-fiche sans-photo', text: 'Pas de photo' });
    const choisir = (capture) => {
      const entree = el('input', { type: 'file', accept: 'image/*', hidden: true });
      if (capture) entree.setAttribute('capture', 'user');
      entree.addEventListener('change', async () => {
        const fichier = entree.files && entree.files[0];
        entree.remove();
        if (!fichier) return;
        try {
          photo = await photoDepuisFichier(fichier);
          apercu.replaceWith(el('img', { class: 'photo-fiche', src: photo, alt: 'Photo de l’élève' }));
        } catch (erreur) {
          annoncer(erreur.message);
        }
      });
      document.body.append(entree);
      entree.click();
    };

    const formulaire = el('form', { class: 'panneau pile' },
      champ('Nom', nom), champ('Prénom', prenom), champ('Classe', classe),
      el('datalist', { id: 'liste-classes-ajout' }, Etat.classes().map((c) => el('option', { value: c }))),
      el('button', { type: 'submit', class: 'bouton principal bloc grand' }, 'Enregistrer l’élève'));
    formulaire.addEventListener('submit', async (evenement) => {
      evenement.preventDefault();
      if (!nom.value.trim() || !classe.value.trim()) {
        annoncer('Le nom et la classe sont obligatoires.');
        return;
      }
      if (!photo) {
        annoncer('Ajoute une photo : c’est elle qu’on apprend à reconnaître.');
        return;
      }
      const doublon = Etat.listeEleves(classe.value.replace(/\s+/g, ' ').trim())
        .some((e) => cleEleve(e) === cleEleve({ nom: nom.value, prenom: prenom.value }));
      if (doublon) {
        annoncer('Cet élève est déjà enregistré dans cette classe.');
        return;
      }
      const [eleve] = await Etat.ajouterEleves([{ nom: nom.value, prenom: prenom.value, classe: classe.value, photo }]);
      Etat.filtreClasse = eleve.classe;
      annoncer(`${nomComplet(eleve)} ajouté à « ${eleve.classe} ».`);
      aller('eleves');
    });

    zone.append(el('div', { class: 'pile' },
      el('div', { class: 'pile serree centre' },
        apercu,
        el('div', { class: 'rangee' },
          el('button', { type: 'button', class: 'bouton', onclick: () => choisir(true) }, '📷 Prendre une photo'),
          el('button', { type: 'button', class: 'bouton', onclick: () => choisir(false) }, 'Choisir une image'))),
      formulaire));
    nom.focus();
  },
};
