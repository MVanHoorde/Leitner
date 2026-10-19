async function demarrer() {
  try {
    await Base.ouvrir();
    appliquerCodecPersonnel(CODEC_VERROUILLE);
    await Etat.chargerMeta();
    Dates.decalage = Etat.reglages.decalageJours || 0;

    // Compte en ligne : la copie locale s'affiche tout de suite, la
    // synchronisation suit en arrière-plan.
    const compte = Nuage.chargerSession();
    if (compte) await Depot.ouvrir(compte.uid);
    await ModeLocal.charger();

    // Profil, progression et quotas ne sont pas chiffrés : ils se chargent
    // avant tout choix de porte.
    await rechargerDonnees();
    const porte = await Base.lireMeta('porte');
    Porte.courante = porte === 'prof' || porte === 'eleve' ? porte : null;

    if (!Etat.suivi.persistanceDemandee) {
      await demanderPersistance();
      await Etat.enregistrerSuivi({ persistanceDemandee: true });
    }

    // Arrivée par le pont de Résonance : le ticket remplace la session éventuelle de l'appareil.
    const ticket = lireTicketPont();
    if (ticket !== null) await entrerParPont(ticket);
    else if (compte) synchroniserTout();

    window.addEventListener('hashchange', afficher);
    if (Porte.courante === 'prof' && Porte.enseignant()) {
      afficherVerrou((await Base.lireMeta('chiffrement')) ? 'deverrouiller' : 'creer');
    } else {
      afficher();
    }
  } catch (erreur) {
    console.error(erreur);
    $('#ecran').replaceChildren(el('div', { class: 'alerte danger pile' },
      el('h2', { text: 'Impossible d’ouvrir la base locale' }),
      el('p', { text: erreur.message }),
      el('p', { text: 'La navigation privée bloque souvent IndexedDB. Ouvrez l’application dans une fenêtre normale.' })));
  }
}

demarrer();
