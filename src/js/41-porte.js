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

  const paquets = Paquets.liste.length;
  const cartes = Paquets.liste.reduce((somme, p) => somme + p.cartes.length, 0);

  zone.append(el('div', { class: 'pile portes' },
    el('p', { class: 'discret', text: 'Cette application sert à deux usages. Choisissez votre entrée ; '
      + 'elle sera retenue pour les prochaines ouvertures.' }),

    boutonMenu('Espace enseignant',
      'Trombinoscope, import de PDF, tableau de bord · protégé par mot de passe',
      () => entrer('prof'), 'principal'),

    boutonMenu('Espace élève',
      `${pluriel(paquets, 'paquet')} de révision · ${pluriel(cartes, 'carte')} · sans mot de passe`,
      () => entrer('eleve')),

    el('section', { class: 'panneau pile' },
      el('h2', { text: 'Pourquoi deux entrées ?' }),
      el('p', { text: 'L’espace enseignant contient des photos d’élèves : elles sont chiffrées et '
        + 'ne s’ouvrent qu’avec le mot de passe. L’espace élève ne contient que des cartes de cours '
        + 'et la progression de celui qui révise, sans aucune donnée personnelle.' }),
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
