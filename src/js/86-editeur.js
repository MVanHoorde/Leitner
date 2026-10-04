/* Éditeur de cartes : cinq modèles, photos, photo à trous, import en lot.
 *
 * Les photos choisies ne partent qu'à l'enregistrement : abandonner une carte
 * ne laisse aucune photo orpheline dans le stockage en ligne.
 */

/** Emplacement de photo de l'éditeur : déjà en ligne (chemin) ou à envoyer (fichier). */
function emplacementPhoto(chemin) {
  return { chemin: chemin || null, fichier: null, url: null };
}

function urlEmplacement(emplacement) {
  if (emplacement.url) return Promise.resolve(emplacement.url);
  if (emplacement.chemin) return Photos.url(emplacement.chemin);
  return Promise.resolve(null);
}

function aUnePhoto(emplacement) {
  return Boolean(emplacement.fichier || emplacement.chemin);
}

/** Boutons « prendre une photo / choisir une image » et vignette. */
function controlePhoto(emplacement, surChangement, { libelle = 'Photo', grande = false } = {}) {
  const zone = el('div', { class: `controle-photo${grande ? ' grande' : ''}` });
  const choisir = (capture) => {
    const entree = el('input', { type: 'file', accept: 'image/*', hidden: true });
    if (capture) entree.setAttribute('capture', 'environment');
    entree.addEventListener('change', () => {
      const fichier = entree.files && entree.files[0];
      entree.remove();
      if (!fichier) return;
      if (!/^image\//.test(fichier.type) && !/\.(jpe?g|png|webp|heic|heif)$/i.test(fichier.name)) {
        annoncer('Ce fichier n’est pas une image.');
        return;
      }
      if (emplacement.url) URL.revokeObjectURL(emplacement.url);
      emplacement.fichier = fichier;
      emplacement.url = URL.createObjectURL(fichier);
      dessiner();
      surChangement();
    });
    document.body.append(entree);
    entree.click();
  };
  const dessiner = () => {
    if (aUnePhoto(emplacement)) {
      const image = el('img', { class: 'vignette-edition', alt: libelle });
      urlEmplacement(emplacement).then((url) => { if (url) image.src = url; }).catch(() => {});
      zone.replaceChildren(image, el('div', { class: 'rangee' },
        el('button', { type: 'button', class: 'bouton', onclick: () => choisir(true) }, 'Reprendre'),
        el('button', { type: 'button', class: 'bouton', onclick: () => choisir(false) }, 'Autre image'),
        el('button', {
          type: 'button',
          class: 'bouton danger',
          onclick: () => {
            if (emplacement.url) URL.revokeObjectURL(emplacement.url);
            Object.assign(emplacement, { chemin: null, fichier: null, url: null });
            dessiner();
            surChangement();
          },
        }, 'Retirer')));
    } else {
      zone.replaceChildren(el('div', { class: 'rangee' },
        el('button', { type: 'button', class: 'bouton', onclick: () => choisir(true) }, '📷 Prendre une photo'),
        el('button', { type: 'button', class: 'bouton', onclick: () => choisir(false) }, 'Choisir une image')));
    }
  };
  dessiner();
  return zone;
}

/** Dessin des zones à cacher sur une photo. Coordonnées en fraction de l'image. */
function editeurZones(emplacement, zones, surChangement) {
  const cadre = el('div', { class: 'masque-cadre edition' });
  const image = el('img', { class: 'masque-photo', alt: 'Photo à annoter', draggable: 'false' });
  cadre.append(image);
  urlEmplacement(emplacement).then((url) => { if (url) image.src = url; }).catch(() => {});

  const dessinerZones = () => {
    for (const z of cadre.querySelectorAll('.masque-zone')) z.remove();
    zones.forEach((zone, i) => {
      const supprimer = el('button', {
        type: 'button', class: 'zone-supprimer', 'aria-label': `Supprimer la zone ${i + 1}`,
        onpointerdown: (e) => e.stopPropagation(),
        onclick: (e) => {
          e.stopPropagation();
          zones.splice(i, 1);
          dessinerZones();
          surChangement();
        },
      }, '×');
      cadre.append(el('span', {
        class: 'masque-zone cible',
        style: `left:${zone.x * 100}%;top:${zone.y * 100}%;width:${zone.l * 100}%;height:${zone.h * 100}%`,
      }, el('span', { class: 'zone-numero', text: i + 1 }), supprimer));
    });
  };

  let depart = null;
  let trace = null;
  const position = (e) => {
    const r = image.getBoundingClientRect();
    return {
      x: Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)),
      y: Math.min(1, Math.max(0, (e.clientY - r.top) / r.height)),
    };
  };
  const rectangle = (a, b) => ({ x: Math.min(a.x, b.x), y: Math.min(a.y, b.y), l: Math.abs(a.x - b.x), h: Math.abs(a.y - b.y) });
  const placer = (noeud, z) => {
    noeud.style.cssText = `left:${z.x * 100}%;top:${z.y * 100}%;width:${z.l * 100}%;height:${z.h * 100}%`;
  };

  cadre.addEventListener('pointerdown', (e) => {
    if (!image.complete || !image.naturalWidth) return;
    e.preventDefault();
    cadre.setPointerCapture(e.pointerId);
    depart = position(e);
    trace = el('span', { class: 'masque-zone trace' });
    placer(trace, { ...depart, l: 0, h: 0 });
    cadre.append(trace);
  });
  cadre.addEventListener('pointermove', (e) => {
    if (!depart) return;
    placer(trace, rectangle(depart, position(e)));
  });
  const finir = (e) => {
    if (!depart) return;
    const zone = rectangle(depart, position(e));
    trace.remove();
    depart = null;
    if (zone.l > 0.02 && zone.h > 0.015) {
      if (zones.length >= 40) {
        annoncer('40 zones au plus par photo.');
        return;
      }
      zones.push(zone);
      dessinerZones();
      surChangement();
    }
  };
  cadre.addEventListener('pointerup', finir);
  cadre.addEventListener('pointercancel', () => {
    if (trace) trace.remove();
    depart = null;
  });
  dessinerZones();
  return cadre;
}

/* ---------- L'écran d'édition ---------- */

function decouperParametreCarte(param) {
  const [paquetId, carteId] = String(param || '').split('~');
  return { paquetId, carteId: carteId && carteId !== 'nouvelle' ? carteId : null };
}

/** Dernier modèle utilisé : on enchaîne souvent des cartes du même type. */
let dernierModele = 'simple';

Ecrans.carte = {
  titre: 'Carte',
  titreCourt: 'Carte',
  parent: 'paquet',
  libelleRetour: 'Paquet',
  porte: 'eleve',
  surRetour(param) {
    const { paquetId } = decouperParametreCarte(param);
    aller('paquet', `p:${paquetId}`);
  },
  rendre(zone, param) {
    const { paquetId, carteId } = decouperParametreCarte(param);
    const paquet = Perso.ligne(paquetId);
    if (!Depot.uid || !paquet) {
      aller('paquets');
      return;
    }
    const ligne = carteId ? Depot.contenu.cartes.find((c) => c.id === carteId) : null;
    if (carteId && !ligne) {
      zone.append(el('p', { text: 'Carte introuvable.' }));
      return;
    }
    definirTitre(ligne ? 'Modifier la carte' : `Nouvelle carte · ${paquet.titre}`);

    const c = ligne ? ligne.contenu : {};
    const etat = {
      modele: ligne ? ligne.modele : dernierModele,
      recto: c.recto || '',
      verso: c.verso || '',
      aide: c.aide || '',
      faux: [...(c.faux || []), '', '', ''].slice(0, 3),
      acceptees: (c.acceptees || []).join('\n'),
      photoRecto: emplacementPhoto(c.photoRecto),
      photoVerso: emplacementPhoto(c.photoVerso),
      photo: emplacementPhoto(c.photo),
      zones: (c.zones || []).map((z) => ({ ...z })),
    };

    const choixModele = el('div', { class: 'grille-modeles', role: 'group', 'aria-label': 'Modèle de carte' });
    const champs = el('div', { class: 'pile' });
    const apercu = el('div', { class: 'apercu-carte' });
    const erreur = el('p', { class: 'erreur', role: 'alert' });

    const zoneTexte = (cle, placeholder, lignes = 2) => {
      const t = el('textarea', { rows: lignes, placeholder, maxlength: cle === 'verso' ? 1500 : 1000 });
      t.value = etat[cle];
      t.addEventListener('input', () => {
        etat[cle] = t.value;
        majApercu();
      });
      return t;
    };
    const ligneTexte = (valeur, placeholder, surSaisie) => {
      const entree = el('input', { type: 'text', value: valeur, placeholder, maxlength: 200, autocomplete: 'off' });
      entree.addEventListener('input', () => {
        surSaisie(entree.value);
        majApercu();
      });
      return entree;
    };

    const majApercu = () => {
      if (etat.modele === 'masques') {
        apercu.replaceChildren(el('p', { class: 'discret', text: etat.zones.length
          ? `${pluriel(etat.zones.length, 'zone')} → ${pluriel(etat.zones.length, 'carte')} : chaque zone sera interrogée à son tour.`
          : 'Dessine des rectangles sur la photo, du doigt ou à la souris, pour cacher ce qu’il faut retrouver.' }));
        return;
      }
      const face = (titre, texte, emplacement) => el('div', { class: 'face' },
        el('span', { class: 'face-titre', text: titre }),
        texte ? texteCarte(texte, 'enonce') : null,
        aUnePhoto(emplacement) ? el('span', { class: 'badge', text: 'photo' }) : null,
        !texte && !aUnePhoto(emplacement) ? el('span', { class: 'discret', text: '…' }) : null);
      const verso = etat.modele === 'qcm'
        ? [etat.verso, ...etat.faux.filter(Boolean)].join(' · ')
        : etat.verso;
      apercu.replaceChildren(
        face(etat.modele === 'double' ? 'Face A' : 'Question', etat.recto, etat.photoRecto),
        face(etat.modele === 'double' ? 'Face B' : etat.modele === 'qcm' ? 'Bonne réponse · pièges' : 'Réponse', verso, etat.photoVerso),
        el('p', { class: 'discret petit', text: 'Astuce : H2O s’affiche avec un indice, x^2 avec un exposant.' }));
    };

    const dessinerChamps = () => {
      const blocs = [];
      switch (etat.modele) {
        case 'double':
          blocs.push(
            champ('Face A', zoneTexte('recto', 'ex. : le mot, le nom de la molécule, la date…')),
            controlePhoto(etat.photoRecto, majApercu),
            champ('Face B', zoneTexte('verso', 'ex. : la définition, la formule, l’événement…')),
            controlePhoto(etat.photoVerso, majApercu));
          break;
        case 'qcm':
          blocs.push(
            champ('Question', zoneTexte('recto', 'ex. : Quelle est l’unité de la quantité de matière ?')),
            controlePhoto(etat.photoRecto, majApercu),
            champ('Bonne réponse', ligneTexte(etat.verso, 'ex. : la mole', (v) => { etat.verso = v; })),
            el('div', { class: 'champ' },
              el('span', { class: 'champ-libelle', text: 'Trois pièges' }),
              el('div', { class: 'pile serree' }, ...etat.faux.map((f, i) => ligneTexte(f, `Piège ${i + 1}`, (v) => { etat.faux[i] = v; }))),
              el('span', { class: 'champ-aide', text: 'Des erreurs crédibles : celles que tu pourrais faire toi-même.' })));
          break;
        case 'saisie': {
          const acceptees = el('textarea', { rows: 2, placeholder: 'Une par ligne (facultatif)' });
          acceptees.value = etat.acceptees;
          acceptees.addEventListener('input', () => { etat.acceptees = acceptees.value; });
          blocs.push(
            champ('Question', zoneTexte('recto', 'ex. : Symbole de la masse volumique ?')),
            controlePhoto(etat.photoRecto, majApercu),
            champ('Réponse exacte attendue', ligneTexte(etat.verso, 'ex. : ρ', (v) => { etat.verso = v; }),
              'Accents, majuscules et tirets sont ignorés. Un nombre est comparé à sa valeur (0,5 = 0.5).'),
            champ('Autres réponses acceptées', acceptees));
          break;
        }
        case 'masques':
          blocs.push(
            champ('Consigne (facultatif)', zoneTexte('recto', 'ex. : Retrouve le nom de chaque organe', 1)),
            el('div', { class: 'champ' },
              el('span', { class: 'champ-libelle', text: 'Photo de ta fiche, de ton schéma, de ta carte mentale' }),
              controlePhoto(etat.photo, () => {
                etat.zones.length = 0;
                dessinerChamps();
              }, { grande: true })));
          if (aUnePhoto(etat.photo)) {
            blocs.push(
              el('p', { class: 'discret', text: 'Fais glisser ton doigt pour cacher une zone. Touche × pour en retirer une.' }),
              editeurZones(etat.photo, etat.zones, majApercu));
          }
          break;
        default:
          blocs.push(
            champ('Question', zoneTexte('recto', 'ex. : Qu’est-ce qu’un isotope ?')),
            controlePhoto(etat.photoRecto, majApercu),
            champ('Réponse', zoneTexte('verso', 'Ta réponse, ou une photo de ta correction', 3)),
            controlePhoto(etat.photoVerso, majApercu));
      }
      const aide = el('textarea', { rows: 2, placeholder: 'Un moyen mnémotechnique, une explication…', maxlength: 600 });
      aide.value = etat.aide;
      aide.addEventListener('input', () => { etat.aide = aide.value; });
      blocs.push(el('details', { class: 'pile', open: etat.aide ? true : null },
        el('summary', { text: 'Ajouter une aide (affichée avec la réponse)' }), aide));
      champs.replaceChildren(...blocs);
      majApercu();
    };

    const dessinerModeles = () => {
      choixModele.replaceChildren(...Object.entries(MODELES).map(([cle, m]) => el('button', {
        type: 'button',
        class: 'tuile-modele',
        'aria-pressed': String(cle === etat.modele),
        onclick: () => {
          etat.modele = cle;
          dessinerModeles();
          dessinerChamps();
        },
      }, el('span', { class: 'icone-modele', text: m.icone }), el('strong', { text: m.titre }), el('span', { class: 'discret', text: m.resume }))));
    };

    /** Vérifie, envoie les photos, enregistre. Renvoie vrai si tout est passé. */
    const enregistrer = async (bouton) => {
      erreur.textContent = '';
      const m = etat.modele;
      const probleme = (() => {
        if (m === 'masques') {
          if (!aUnePhoto(etat.photo)) return 'Ajoute la photo à annoter.';
          if (!etat.zones.length) return 'Cache au moins une zone de la photo.';
          return null;
        }
        if (!etat.recto.trim() && !aUnePhoto(etat.photoRecto)) return 'Écris la question (ou ajoute une photo).';
        if (m === 'qcm') {
          if (!etat.verso.trim()) return 'Écris la bonne réponse.';
          if (etat.faux.filter((f) => f.trim()).length < 1) return 'Ajoute au moins un piège (trois, c’est mieux).';
          return null;
        }
        if (m === 'saisie' && !etat.verso.trim()) return 'Écris la réponse attendue.';
        if (!etat.verso.trim() && !aUnePhoto(etat.photoVerso)) return 'Écris la réponse (ou ajoute une photo).';
        return null;
      })();
      if (probleme) {
        erreur.textContent = probleme;
        return false;
      }
      const libelle = bouton.textContent;
      bouton.disabled = true;
      try {
        const emplacements = m === 'masques' ? ['photo'] : m === 'simple' || m === 'double' ? ['photoRecto', 'photoVerso'] : ['photoRecto'];
        const contenu = { recto: etat.recto, verso: etat.verso, aide: etat.aide, faux: etat.faux,
          acceptees: etat.acceptees.split('\n'), zones: etat.zones };
        for (const cle of emplacements) {
          const emplacement = etat[cle];
          if (emplacement.fichier) {
            bouton.textContent = 'Envoi de la photo…';
            emplacement.chemin = await Photos.deposer(emplacement.fichier);
            emplacement.fichier = null;
          }
          if (emplacement.chemin) contenu[cle] = emplacement.chemin;
        }
        bouton.textContent = 'Enregistrement…';
        await Perso.enregistrerCarte(paquetId, ligne ? ligne.id : null, m, contenu);
        dernierModele = m;
        return true;
      } catch (e) {
        erreur.textContent = messageNuage(e);
        return false;
      } finally {
        bouton.disabled = false;
        bouton.textContent = libelle;
      }
    };

    const boutonEnregistrer = el('button', { type: 'button', class: 'bouton principal grand' }, 'Enregistrer');
    boutonEnregistrer.addEventListener('click', async () => {
      if (await enregistrer(boutonEnregistrer)) {
        annoncer('Carte enregistrée.');
        aller('paquet', `p:${paquetId}`);
      }
    });
    const boutonSuivante = el('button', { type: 'button', class: 'bouton accent grand' }, ligne ? 'Enregistrer' : 'Enregistrer et carte suivante');
    boutonSuivante.addEventListener('click', async () => {
      if (await enregistrer(boutonSuivante)) {
        const total = Perso.lignesCartes(paquetId).length;
        annoncer(`Carte enregistrée · ${pluriel(total, 'carte')} dans le paquet.`);
        if (ligne) aller('cartes', paquetId);
        else afficher();
      }
    });

    zone.append(el('div', { class: 'pile' },
      el('h2', { text: 'Modèle' }),
      choixModele,
      el('section', { class: 'panneau pile' }, champs),
      el('section', { class: 'pile serree' }, el('h3', { text: 'Aperçu' }), apercu),
      erreur,
      el('div', { class: 'rangee' }, boutonSuivante, ligne ? null : boutonEnregistrer),
      ligne && el('section', { class: 'panneau pile marge-haut' },
        confirmationDeuxTemps({
          libelle: 'Supprimer cette carte',
          question: 'Supprimer cette carte ?',
          detail: 'Elle disparaît du paquet, avec sa progression et ses photos.',
          libelleConfirmer: 'Oui, supprimer',
          action: async () => {
            await Perso.supprimerCarte(ligne.id);
            annoncer('Carte supprimée.');
            aller('cartes', paquetId);
          },
        }))));
    dessinerModeles();
    dessinerChamps();
    const premier = champs.querySelector('textarea, input[type=text]');
    if (premier && !ligne) premier.focus();
  },
};

/* ---------- Import d'une liste ---------- */

const SEPARATEURS = ['\t', ';', ' | ', ' = ', ' → ', ' -> ', ' : '];

/** « question ; réponse » par ligne. Le premier séparateur trouvé l'emporte. */
function lireListe(texte) {
  const cartes = [];
  const ignorees = [];
  for (const brute of texte.split(/\r?\n/)) {
    const ligne = brute.trim();
    if (!ligne) continue;
    const separateur = SEPARATEURS.find((s) => ligne.includes(s));
    if (!separateur) {
      ignorees.push(ligne);
      continue;
    }
    const position = ligne.indexOf(separateur);
    const recto = ligne.slice(0, position).trim();
    const verso = ligne.slice(position + separateur.length).trim();
    if (recto && verso) cartes.push({ recto, verso });
    else ignorees.push(ligne);
  }
  return { cartes, ignorees };
}

Ecrans.import = {
  titre: 'Coller une liste',
  titreCourt: 'Import',
  parent: 'paquet',
  libelleRetour: 'Paquet',
  porte: 'eleve',
  surRetour(id) {
    aller('paquet', `p:${id}`);
  },
  rendre(zone, id) {
    const paquet = Perso.ligne(id);
    if (!Depot.uid || !paquet) {
      aller('paquets');
      return;
    }
    definirTitre(`Coller une liste · ${paquet.titre}`);
    let modele = 'simple';
    const texte = el('textarea', { rows: 10, placeholder: 'mole ; unité de quantité de matière\nH2O ; eau\n1789 ; prise de la Bastille' });
    const bilan = el('div', { class: 'pile serree' });
    const erreur = el('p', { class: 'erreur', role: 'alert' });
    const creer = el('button', { type: 'button', class: 'bouton principal bloc grand', disabled: true }, 'Créer les cartes');

    const analyser = () => {
      const { cartes, ignorees } = lireListe(texte.value);
      creer.disabled = !cartes.length;
      creer.textContent = cartes.length ? `Créer ${pluriel(cartes.length, 'carte')}${modele === 'double' ? ' (deux sens)' : ''}` : 'Créer les cartes';
      bilan.replaceChildren(
        cartes.length > 0 && el('dl', { class: 'rappel-cartes' }, cartes.slice(0, 4).flatMap((c) => [
          el('dt', {}, texteCarte(c.recto)), el('dd', {}, texteCarte(c.verso))])),
        cartes.length > 4 && el('p', { class: 'discret', text: `… et ${cartes.length - 4} autres.` }),
        ignorees.length > 0 && el('p', { class: 'erreur', text: `${pluriel(ignorees.length, 'ligne ignorée', 'lignes ignorées')} (pas de séparateur) : `
          + ignorees.slice(0, 3).join(' · ') }));
      return cartes;
    };
    texte.addEventListener('input', analyser);
    creer.addEventListener('click', async () => {
      const cartes = analyser();
      if (cartes.length > 500) {
        erreur.textContent = '500 cartes au plus en une fois.';
        return;
      }
      creer.disabled = true;
      try {
        const n = await Perso.creerCartes(id, cartes.map((c) => ({ modele, contenu: c })));
        annoncer(`${pluriel(n, 'carte créée', 'cartes créées')}.`);
        aller('paquet', `p:${id}`);
      } catch (e) {
        erreur.textContent = messageNuage(e);
        creer.disabled = false;
      }
    });

    zone.append(el('div', { class: 'pile' },
      el('p', { text: 'Une carte par ligne : la question, un point-virgule, la réponse. '
        + 'Pratique pour copier un tableau depuis un tableur ou un document.' }),
      selecteur([['simple', 'Question → réponse'], ['double', 'Dans les deux sens']], modele, (v) => {
        modele = v;
        analyser();
      }, 'Modèle des cartes importées'),
      texte,
      bilan,
      erreur,
      creer));
    texte.focus();
  },
};
