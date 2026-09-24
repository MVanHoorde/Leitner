async function demarrer() {
  try {
    await Base.ouvrir();
    appliquerCodecPersonnel(CODEC_VERROUILLE);
    await Etat.chargerMeta();
    Dates.decalage = Etat.reglages.decalageJours || 0;

    // Profil, progression et quotas ne sont pas chiffrés : ils se chargent
    // avant tout choix de porte.
    await Promise.all([Profil.charger(), Progression.charger(), SuiviContenu.charger()]);
    const porte = await Base.lireMeta('porte');
    Porte.courante = porte === 'prof' || porte === 'eleve' ? porte : null;

    if (!Etat.suivi.persistanceDemandee) {
      await demanderPersistance();
      await Etat.enregistrerSuivi({ persistanceDemandee: true });
    }

    window.addEventListener('hashchange', afficher);
    if (Porte.courante === 'prof') {
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
