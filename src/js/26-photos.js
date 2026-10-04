/* Photos des cartes : compression, envoi, cache local, affichage.
 *
 * Une photo de téléphone pèse 3 à 5 Mo ; elle part réduite à 1600 px de côté
 * et compressée en JPEG (150 à 300 Ko), ce qui reste net pour une écriture
 * manuscrite. Une fois téléchargée, elle est gardée sur l'appareil (magasin
 * « photos ») : la révision marche hors connexion et ne retélécharge rien.
 */

const PHOTO_COTE_MAX = 1600;
const PHOTO_POIDS_VISE = 450 * 1024;

const Photos = {
  /** chemin → URL blob déjà prête */
  urls: new Map(),
  enCours: new Map(),

  async decoder(fichier) {
    if (window.createImageBitmap) {
      try {
        return await createImageBitmap(fichier, { imageOrientation: 'from-image' });
      } catch { /* format que createImageBitmap ne lit pas : on passe par <img> */ }
    }
    const url = URL.createObjectURL(fichier);
    try {
      const image = new Image();
      image.src = url;
      await image.decode();
      return image;
    } finally {
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
  },

  /** Réduit et compresse une photo ; renvoie un Blob JPEG. */
  async compresser(fichier) {
    const source = await this.decoder(fichier);
    const largeur = source.width || source.naturalWidth;
    const hauteur = source.height || source.naturalHeight;
    if (!largeur || !hauteur) throw new Error('Image illisible.');
    let cote = PHOTO_COTE_MAX;
    for (let essai = 0; essai < 6; essai += 1) {
      const echelle = Math.min(1, cote / Math.max(largeur, hauteur));
      const canevas = document.createElement('canvas');
      canevas.width = Math.round(largeur * echelle);
      canevas.height = Math.round(hauteur * echelle);
      const ctx = canevas.getContext('2d');
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, canevas.width, canevas.height);
      ctx.drawImage(source, 0, 0, canevas.width, canevas.height);
      for (const qualite of [0.82, 0.72, 0.62]) {
        const blob = await new Promise((r) => canevas.toBlob(r, 'image/jpeg', qualite));
        if (blob && blob.size <= PHOTO_POIDS_VISE) return blob;
      }
      cote = Math.round(cote * 0.8);
    }
    throw new Error('Photo impossible à alléger suffisamment.');
  },

  /** Compresse, envoie et garde en cache. Renvoie le chemin en ligne. */
  async deposer(fichier) {
    const blob = await this.compresser(fichier);
    const chemin = `${Nuage.uid()}/${nouvelId()}.jpg`;
    await Nuage.deposerPhoto(chemin, blob);
    await Base.modifier({ ecritures: { photos: [{ id: chemin, blob }] } }).catch(() => {});
    this.urls.set(chemin, URL.createObjectURL(blob));
    return chemin;
  },

  /** URL affichable d'une photo : mémoire, puis appareil, puis réseau. */
  async url(chemin) {
    if (this.urls.has(chemin)) return this.urls.get(chemin);
    if (this.enCours.has(chemin)) return this.enCours.get(chemin);
    const promesse = (async () => {
      let enregistrement = await Base.lireUn('photos', chemin).catch(() => null);
      if (!enregistrement) {
        const blob = await Nuage.telechargerPhoto(chemin);
        enregistrement = { id: chemin, blob };
        await Base.modifier({ ecritures: { photos: [enregistrement] } }).catch(() => {});
      }
      const url = URL.createObjectURL(enregistrement.blob);
      this.urls.set(chemin, url);
      return url;
    })().finally(() => this.enCours.delete(chemin));
    this.enCours.set(chemin, promesse);
    return promesse;
  },

  /** Élément <img> qui se remplit dès que la photo est disponible. */
  image(chemin, classe = 'photo-carte', alt = 'Photo de la carte') {
    const image = el('img', { class: `${classe} chargement`, alt, draggable: 'false' });
    if (!chemin) return image;
    this.url(chemin)
      .then((url) => {
        image.src = url;
        image.classList.remove('chargement');
      })
      .catch(() => {
        image.classList.remove('chargement');
        image.classList.add('indisponible');
        image.alt = 'Photo indisponible hors connexion';
      });
    return image;
  },

  async supprimer(chemins) {
    const miens = chemins.filter((c) => c && Nuage.uid() && c.startsWith(`${Nuage.uid()}/`));
    if (!miens.length) return;
    await Nuage.supprimerPhotos(miens).catch(() => {});
    await Base.modifier({ suppressions: { photos: miens } }).catch(() => {});
    for (const c of miens) {
      const url = this.urls.get(c);
      if (url) URL.revokeObjectURL(url);
      this.urls.delete(c);
    }
  },

  /** Télécharge à l'avance les photos de la bibliothèque, pour réviser hors ligne. */
  async precharger(paquets) {
    const chemins = new Set();
    for (const paquet of paquets) {
      for (const carte of paquet.cartes) {
        for (const c of [carte.photoQuestion, carte.photoReponse, carte.masque && carte.masque.photo]) if (c) chemins.add(c);
      }
    }
    for (const chemin of chemins) {
      if (!navigator.onLine) return;
      await this.url(chemin).catch(() => {});
    }
  },
};
