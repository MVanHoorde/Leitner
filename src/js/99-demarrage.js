async function demarrer() {
  try {
    await Base.ouvrir();
    Base.codec = CODEC_VERROUILLE;
    await Etat.chargerMeta();
    Dates.decalage = Etat.reglages.decalageJours || 0;

    if (!Etat.suivi.persistanceDemandee) {
      await demanderPersistance();
      await Etat.enregistrerSuivi({ persistanceDemandee: true });
    }

    window.addEventListener('hashchange', afficher);
    afficherVerrou((await Base.lireMeta('chiffrement')) ? 'deverrouiller' : 'creer');
  } catch (erreur) {
    console.error(erreur);
    $('#ecran').replaceChildren(el('div', { class: 'alerte danger pile' },
      el('h2', { text: 'Impossible d’ouvrir la base locale' }),
      el('p', { text: erreur.message }),
      el('p', { text: 'La navigation privée bloque souvent IndexedDB. Ouvrez l’application dans une fenêtre normale.' })));
  }
}

demarrer();
