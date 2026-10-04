/* Dépôt des données de révision : sur l'appareil, ou dans le compte en ligne.
 *
 * Sans compte, tout reste en IndexedDB comme avant (magasin « progression »
 * et métadonnées). Avec un compte, la vérité est en ligne (tables leitner_*)
 * et l'appareil en garde une copie, rangée sous « nuage:<uid> » : les
 * révisions marchent hors connexion, et ce qui n'a pas pu partir attend dans
 * une file, envoyée dès que le réseau revient.
 *
 * Profil, journal, quotas, bibliothèque et réglages des paquets forment un
 * seul objet en ligne (leitner_profils) ; l'état de chaque carte révisée est
 * une ligne de leitner_etats. Deux appareils utilisés en même temps : la
 * dernière écriture gagne, ce qui suffit pour un élève.
 */

const STATUTS_DEPOT = {
  local: 'Enregistré sur cet appareil',
  ajour: 'Sauvegardé en ligne',
  envoi: 'Sauvegarde en cours…',
  attente: 'Hors ligne : sera sauvegardé au retour du réseau',
  erreur: 'Sauvegarde en ligne impossible pour l’instant',
  session: 'Session expirée : reconnecte-toi pour sauvegarder',
};

const Depot = {
  uid: null,
  cache: null,
  statut: 'local',
  minuteurEnvoi: null,
  minuteurPersistance: null,
  attentesPersistance: [],
  envoiEnCours: null,
  /** Appelée quand le statut change (pied de page). */
  surStatut: null,

  cleCache() {
    return `nuage:${this.uid}`;
  },

  cacheVide() {
    return {
      profil: {},
      etats: {},
      attente: { etats: {}, profil: false },
      contenu: { paquets: [], cartes: [], publics: [], cartesPubliques: [] },
      recu: null,
    };
  },

  async ouvrir(uid) {
    this.uid = uid;
    const stocke = await Base.lireMeta(this.cleCache());
    this.cache = { ...this.cacheVide(), ...(stocke || {}) };
    this.relancerSiBesoin();
  },

  /** Quelque chose attend d'être envoyé : on le dit, et on l'envoie. */
  relancerSiBesoin() {
    if (this.enAttente()) {
      this.changerStatut('envoi');
      this.planifierEnvoi(500);
    } else {
      this.changerStatut('ajour');
    }
  },

  fermer() {
    clearTimeout(this.minuteurEnvoi);
    this.uid = null;
    this.cache = null;
    this.changerStatut('local');
  },

  changerStatut(statut) {
    this.statut = statut;
    if (this.surStatut) this.surStatut(statut);
  },

  enAttente() {
    if (!this.cache) return 0;
    return Object.keys(this.cache.attente.etats).length + (this.cache.attente.profil ? 1 : 0);
  },

  /** Écriture différée de la copie locale : une révision rapide ne doit pas
   *  réécrire tout le cache à chaque carte. */
  persister() {
    // Tous ceux qui attendent pendant le délai sont servis par la même écriture.
    clearTimeout(this.minuteurPersistance);
    const uid = this.uid;
    const cache = this.cache;
    return new Promise((resoudre) => {
      this.attentesPersistance.push(resoudre);
      this.minuteurPersistance = setTimeout(async () => {
        const servis = this.attentesPersistance;
        this.attentesPersistance = [];
        if (uid && cache) await Base.ecrireMeta(`nuage:${uid}`, cache).catch(() => {});
        for (const r of servis) r();
      }, 250);
    });
  },

  /* ---------- Clés de profil ---------- */

  async lire(cle) {
    if (!this.uid) return Base.lireMeta(cle);
    return this.cache.profil[cle];
  },

  async ecrire(cle, valeur) {
    if (!this.uid) return Base.ecrireMeta(cle, valeur);
    this.cache.profil[cle] = valeur;
    this.cache.attente.profil = true;
    this.persister();
    this.planifierEnvoi();
  },

  /* ---------- États des cartes ---------- */

  async lireEtats() {
    if (!this.uid) return Base.lireTout('progression');
    return Object.values(this.cache.etats);
  },

  async ecrireEtat(etat) {
    if (!this.uid) return Base.modifier({ ecritures: { progression: [etat] } });
    this.cache.etats[etat.id] = etat;
    this.cache.attente.etats[etat.id] = etat;
    this.persister();
    this.planifierEnvoi();
  },

  async supprimerEtats(ids) {
    if (!this.uid) return Base.modifier({ suppressions: { progression: ids } });
    for (const id of ids) {
      delete this.cache.etats[id];
      this.cache.attente.etats[id] = null;
    }
    this.persister();
    this.planifierEnvoi();
  },

  /* ---------- Paquets et cartes en ligne (copie locale) ---------- */

  get contenu() {
    return this.cache ? this.cache.contenu : this.cacheVide().contenu;
  },

  async enregistrerContenu(contenu) {
    if (!this.cache) return;
    this.cache.contenu = contenu;
    await this.persister();
  },

  /* ---------- Synchronisation ---------- */

  planifierEnvoi(delai = 1500) {
    clearTimeout(this.minuteurEnvoi);
    this.minuteurEnvoi = setTimeout(() => this.envoyer(), delai);
  },

  async envoyer() {
    if (!this.uid) return;
    if (this.envoiEnCours) return this.envoiEnCours;
    if (!this.enAttente()) {
      this.changerStatut('ajour');
      return;
    }
    this.envoiEnCours = this.envoyerMaintenant().finally(() => { this.envoiEnCours = null; });
    return this.envoiEnCours;
  },

  async envoyerMaintenant() {
    const uid = this.uid;
    const cache = this.cache;
    this.changerStatut('envoi');
    let profilEnvoye = false;
    try {
      const envoyes = Object.entries(cache.attente.etats);
      const ecritures = envoyes.filter(([, e]) => e).map(([carte, etat]) => ({ auteur: uid, carte, etat }));
      const suppressions = envoyes.filter(([, e]) => !e).map(([carte]) => carte);
      for (let i = 0; i < ecritures.length; i += 500) {
        await Nuage.api('leitner_etats?on_conflict=auteur,carte', {
          method: 'POST',
          corps: ecritures.slice(i, i + 500),
          prefer: 'resolution=merge-duplicates,return=minimal',
        });
      }
      for (let i = 0; i < suppressions.length; i += 100) {
        const liste = suppressions.slice(i, i + 100).map((id) => `"${id.replace(/"/g, '')}"`).join(',');
        await Nuage.api(`leitner_etats?auteur=eq.${uid}&carte=in.(${encodeURIComponent(liste)})`, {
          method: 'DELETE', prefer: 'return=minimal',
        });
      }
      profilEnvoye = cache.attente.profil;
      if (profilEnvoye) {
        cache.attente.profil = false;
        await Nuage.api('leitner_profils?on_conflict=auteur', {
          method: 'POST',
          corps: [{ auteur: uid, valeur: cache.profil }],
          prefer: 'resolution=merge-duplicates,return=minimal',
        });
      }
      // Ne retirer de la file que ce qui n'a pas changé pendant l'envoi.
      for (const [carte, etat] of envoyes) {
        if (cache.attente.etats[carte] === etat) delete cache.attente.etats[carte];
      }
      await this.persister();
      if (this.uid === uid) this.changerStatut(this.enAttente() ? 'envoi' : 'ajour');
      if (this.enAttente()) this.planifierEnvoi(300);
    } catch (erreur) {
      if (profilEnvoye) cache.attente.profil = true;
      await this.persister();
      if (this.uid !== uid) return;
      if (erreur.code === 'PAS_DE_SESSION') this.changerStatut('session');
      else if (estHorsLigne(erreur)) this.changerStatut('attente');
      else {
        console.error(erreur);
        this.changerStatut('erreur');
      }
      // Nouvel essai dans 30 s ; le retour du réseau relance aussi l'envoi.
      this.planifierEnvoi(30000);
    }
  },

  /**
   * Récupère l'état en ligne et le fusionne avec la copie locale. Ce qui
   * attend encore d'être envoyé l'emporte sur ce qui vient du serveur.
   * Renvoie vrai si quelque chose a changé.
   */
  async recevoir() {
    const uid = this.uid;
    const [profils, etats] = await Promise.all([
      Nuage.api(`leitner_profils?select=valeur&auteur=eq.${uid}`),
      Nuage.tout(`leitner_etats?select=carte,etat&auteur=eq.${uid}&order=carte`),
    ]);
    if (this.uid !== uid) return false;
    const cache = this.cache;
    const avant = JSON.stringify([cache.profil, cache.etats]);

    if (!profils.length && !cache.recu) {
      await this.reprendreDonneesLocales();
    } else if (profils.length && !cache.attente.profil) {
      cache.profil = profils[0].valeur || {};
    }

    const fusion = {};
    for (const ligne of etats) fusion[ligne.carte] = { ...ligne.etat, id: ligne.carte };
    for (const [id, etat] of Object.entries(cache.attente.etats)) {
      if (etat) fusion[id] = etat;
      else delete fusion[id];
    }
    cache.etats = fusion;
    cache.recu = Date.now();
    await this.persister();
    return avant !== JSON.stringify([cache.profil, cache.etats]);
  },

  /** Première connexion d'un compte vierge : la progression faite sans compte
   *  sur cet appareil y est transférée, plutôt que perdue. */
  async reprendreDonneesLocales() {
    const [profil, journal, contenu, etats] = await Promise.all([
      Base.lireMeta('profil'), Base.lireMeta('journal'), Base.lireMeta('contenu'), Base.lireTout('progression'),
    ]);
    const cache = this.cache;
    if (profil) cache.profil.profil = { ...profil, pseudo: '' };
    if (journal) cache.profil.journal = journal;
    if (contenu) cache.profil.contenu = contenu;
    cache.attente.profil = true;
    for (const etat of etats) {
      cache.etats[etat.id] = etat;
      cache.attente.etats[etat.id] = etat;
    }
    if (etats.length || journal) {
      await Base.modifier({ suppressions: { progression: etats.map((e) => e.id) } });
      await Base.ecrireMeta('journal', null);
      await Base.ecrireMeta('contenu', null);
    }
  },
};

window.addEventListener('online', () => {
  if (Depot.uid) Depot.envoyer();
});
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden' && Depot.uid && Depot.enAttente()) Depot.envoyer();
});
