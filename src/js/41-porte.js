/* Écran d'entrée : qui utilise l'application ?
 *
 * Affiché hors du routeur, comme l'écran de verrouillage : tant qu'aucune porte
 * n'est choisie, aucun écran n'est accessible.
 */

function afficherChoixPorte() {
  toucheEcran = null;
  document.body.classList.remove('plein');
  $('#retour').hidden = true;
  majBandeauDate();
  definirTitre(NOM_APP);
  const zone = $('#ecran');
  zone.replaceChildren();
  window.scrollTo(0, 0);

  const entrer = async (porte) => {
    await Porte.choisir(porte);
    if (porte === 'prof') {
      afficherVerrou((await Base.lireMeta('chiffrement')) ? 'deverrouiller' : 'creer');
      return;
    }
    location.hash = '';
    afficher();
  };

  zone.append(el('div', { class: 'pile portes' },
    el('p', { class: 'discret', text: 'Cette application sert à deux usages. Choisissez votre entrée ; '
      + 'elle sera retenue pour les prochaines ouvertures.' }),

    boutonMenu('Mes flashcards',
      'Élèves et enseignants · créer ses cartes, la bibliothèque du prof, la boîte de Leitner',
      () => entrer('eleve'), 'principal'),

    boutonMenu('Trombinoscope (enseignant)',
      'Reconnaître ses élèves · import de PDF · protégé par mot de passe, reste sur cet appareil',
      () => entrer('prof')),

    el('section', { class: 'panneau pile' },
      el('h2', { text: 'Pourquoi deux entrées ?' }),
      el('p', { text: 'Le trombinoscope contient des photos d’élèves : elles sont chiffrées, '
        + 'ne s’ouvrent qu’avec le mot de passe et ne quittent jamais cet appareil. Les flashcards '
        + 'se sauvegardent dans le compte du site du cours, sous un simple identifiant.' }),
      el('p', { class: 'discret', text: 'Passer par l’espace élève ne donne donc aucun accès au '
        + 'trombinoscope, même sur la tablette de l’enseignant.' }))));
}

/** Bouton présent en bas des deux accueils, pour revenir au choix d'entrée. */
function boutonChangerPorte() {
  return el('button', {
    type: 'button',
    class: 'bouton bloc',
    onclick: () => Porte.quitter(),
  }, 'Changer d’espace');
}
