/* Couche IndexedDB.
 *
 * Magasins :
 *   eleves  { id, donnees }  — donnees = élève encodé par le codec
 *   cartes  { id, donnees }  — état Leitner, id = id de l'élève
 *   meta    { cle, valeur }  — réglages et suivi, jamais de donnée personnelle
 *
 * Le codec transforme chaque objet avant écriture et après lecture.
 * Il est neutre tant que le chiffrement n'est pas activé.
 */

function attendreRequete(requete) {
  return new Promise((resoudre, rejeter) => {
    requete.onsuccess = () => resoudre(requete.result);
    requete.onerror = () => rejeter(requete.error);
  });
}

function attendreTransaction(tx) {
  return new Promise((resoudre, rejeter) => {
    tx.oncomplete = () => resoudre();
    tx.onerror = () => rejeter(tx.error);
    tx.onabort = () => rejeter(tx.error || new Error('Écriture annulée.'));
  });
}

const Base = {
  NOM: 'reconnaitre-mes-eleves',
  VERSION: 1,
  cnx: null,

  codec: {
    encoder: async (objet) => objet,
    decoder: async (donnees) => donnees,
  },

  ouvrir() {
    return new Promise((resoudre, rejeter) => {
      if (!('indexedDB' in window)) {
        rejeter(new Error("IndexedDB n'est pas disponible dans ce navigateur."));
        return;
      }
      const requete = indexedDB.open(this.NOM, this.VERSION);
      requete.onupgradeneeded = () => {
        const db = requete.result;
        if (!db.objectStoreNames.contains('eleves')) db.createObjectStore('eleves', { keyPath: 'id' });
        if (!db.objectStoreNames.contains('cartes')) db.createObjectStore('cartes', { keyPath: 'id' });
        if (!db.objectStoreNames.contains('meta')) db.createObjectStore('meta', { keyPath: 'cle' });
      };
      requete.onsuccess = () => {
        this.cnx = requete.result;
        this.cnx.onversionchange = () => {
          this.cnx.close();
          this.cnx = null;
        };
        resoudre();
      };
      requete.onerror = () => rejeter(requete.error);
    });
  },

  async lireTout(magasin) {
    const tx = this.cnx.transaction(magasin, 'readonly');
    const enregistrements = await attendreRequete(tx.objectStore(magasin).getAll());
    return Promise.all(enregistrements.map((e) => this.codec.decoder(e.donnees)));
  },

  /**
   * Écritures et suppressions groupées dans une seule transaction.
   * L'encodage (asynchrone) est fait avant d'ouvrir la transaction,
   * sinon IndexedDB la validerait prématurément.
   */
  async modifier({ ecritures = {}, suppressions = {} }) {
    const magasins = [...new Set([...Object.keys(ecritures), ...Object.keys(suppressions)])];
    if (!magasins.length) return;

    const prets = {};
    for (const [magasin, objets] of Object.entries(ecritures)) {
      prets[magasin] = await Promise.all(
        objets.map(async (objet) => ({ id: objet.id, donnees: await this.codec.encoder(objet) })));
    }

    const tx = this.cnx.transaction(magasins, 'readwrite');
    const fin = attendreTransaction(tx);
    for (const [magasin, enregistrements] of Object.entries(prets)) {
      const store = tx.objectStore(magasin);
      for (const e of enregistrements) store.put(e);
    }
    for (const [magasin, ids] of Object.entries(suppressions)) {
      const store = tx.objectStore(magasin);
      for (const id of ids) store.delete(id);
    }
    await fin;
  },

  async lireMeta(cle) {
    const tx = this.cnx.transaction('meta', 'readonly');
    const enregistrement = await attendreRequete(tx.objectStore('meta').get(cle));
    return enregistrement ? enregistrement.valeur : undefined;
  },

  async ecrireMeta(cle, valeur) {
    const tx = this.cnx.transaction('meta', 'readwrite');
    const fin = attendreTransaction(tx);
    tx.objectStore('meta').put({ cle, valeur });
    await fin;
  },

  /** Supprime la base entière (pas seulement son contenu). */
  detruire(surBlocage) {
    if (this.cnx) {
      this.cnx.close();
      this.cnx = null;
    }
    return new Promise((resoudre, rejeter) => {
      const requete = indexedDB.deleteDatabase(this.NOM);
      requete.onsuccess = () => resoudre();
      requete.onerror = () => rejeter(requete.error);
      requete.onblocked = () => { if (surBlocage) surBlocage(); };
    });
  },
};
