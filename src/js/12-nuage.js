/* Client Supabase : comptes, tables leitner_*, photos.
 *
 * Mêmes comptes que le site du cours (dépôt Site-Web-Portfolio) : un élève se
 * connecte avec son identifiant et son mot de passe habituels, l'adresse
 * interne identifiant@snt.local n'est jamais montrée. Un enseignant se
 * connecte avec son adresse réelle.
 *
 * HTTP nu, sans supabase-js : pas de bibliothèque chargée depuis un CDN.
 * La clé anonyme n'est pas un secret ; ce sont les règles RLS de la base
 * (bdd/schema/022-leitner.sql du portfolio) qui protègent les données.
 *
 * La session est propre à cette application (clé 'leitner.session') : la
 * partager avec le site ferait renouveler le même jeton par deux pages, et
 * Supabase révoque une session dont le jeton de renouvellement sert deux fois.
 */

const NUAGE_URL = 'https://ztyvuiaohxekuyjeoaxz.supabase.co';
const NUAGE_CLE = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp0eXZ1aWFvaHhla3V5amVvYXh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ1NDQzNTIsImV4cCI6MjEwMDEyMDM1Mn0.iBBZiAIec0hSxzAU8FKNe6AO-HeysuxBKXduURBP7Hc';
const NUAGE_STOCKAGE = 'leitner.session';
const NUAGE_BUCKET = 'leitner';

const REGLE_MOT_DE_PASSE = 'Au moins 6 caractères, dont une majuscule, une minuscule et un chiffre.';

/** Messages lisibles pour les codes d'erreur du client et de la base. */
const MESSAGES_NUAGE = {
  IDENTIFIANT_INVALIDE: 'Identifiant : de 3 à 32 caractères, minuscules, chiffres et tirets.',
  MOT_DE_PASSE_TROP_COURT: `Mot de passe trop court. ${REGLE_MOT_DE_PASSE}`,
  MOT_DE_PASSE_FAIBLE: `Mot de passe trop simple. ${REGLE_MOT_DE_PASSE}`,
  IDENTIFIANT_DEJA_PRIS: 'Cet identifiant est déjà pris. Si c’est le tien, vérifie ton mot de passe.',
  IDENTIFIANT_REFUSE: 'Cet identifiant est refusé. Essaie-en un autre.',
  IDENTIFIANTS_INCORRECTS: 'Identifiant ou mot de passe incorrect.',
  CODE_CLASSE_INCONNU: 'Code de classe inconnu, ou inscriptions fermées. Demande-le à ton professeur.',
  PSEUDO_DEJA_PRIS: 'Cet identifiant est déjà utilisé dans cette classe.',
  TROP_DE_TENTATIVES: 'Trop de tentatives. Patiente une minute avant de réessayer.',
  PAS_DE_SESSION: 'Tu n’es plus connecté. Reconnecte-toi.',
  HORS_LIGNE: 'Pas de connexion internet pour le moment.',
  LEITNER_TROP_DE_PAQUETS: 'Limite de 300 paquets atteinte.',
  LEITNER_TROP_DE_CARTES: 'Limite de 5 000 cartes atteinte.',
};

function messageNuage(erreur) {
  const code = erreur && (erreur.code || erreur.message);
  if (MESSAGES_NUAGE[code]) return MESSAGES_NUAGE[code];
  if (erreur && /LEITNER_TROP_DE_(PAQUETS|CARTES)/.test(erreur.message)) {
    return MESSAGES_NUAGE[erreur.message.match(/LEITNER_TROP_DE_(PAQUETS|CARTES)/)[0]];
  }
  if (erreur && erreur.statut === 413) return 'Photo trop lourde, même après compression.';
  if (erreur && erreur.statut === 403 && erreur.photo) return 'Limite de photos atteinte : supprime d’anciennes photos pour en ajouter.';
  if (estHorsLigne(erreur)) return MESSAGES_NUAGE.HORS_LIGNE;
  return (erreur && erreur.message) || 'Erreur inconnue.';
}

/** Vraie coupure réseau, et non erreur de programmation (toutes deux TypeError). */
function estHorsLigne(erreur) {
  if (!erreur) return false;
  if (erreur.code === 'HORS_LIGNE') return true;
  return erreur instanceof TypeError && /fetch|network|load failed/i.test(erreur.message);
}

function erreurNuage(code) {
  const e = new Error(code);
  e.code = code;
  return e;
}

const Nuage = {
  /** { access_token, refresh_token, expires_at (ms), compte } */
  jeton: null,
  renouvellement: null,

  /* ---------- Session ---------- */

  chargerSession() {
    try {
      const brut = localStorage.getItem(NUAGE_STOCKAGE);
      this.jeton = brut ? JSON.parse(brut) : null;
    } catch {
      this.jeton = null;
    }
    return this.compte();
  },

  ecrireSession() {
    try {
      if (this.jeton) localStorage.setItem(NUAGE_STOCKAGE, JSON.stringify(this.jeton));
      else localStorage.removeItem(NUAGE_STOCKAGE);
    } catch { /* stockage refusé : la session ne durera que l'onglet */ }
  },

  memoriser(reponse) {
    this.jeton = {
      access_token: reponse.access_token,
      refresh_token: reponse.refresh_token,
      expires_at: reponse.expires_at * 1000 - 60000,
      compte: this.jeton ? this.jeton.compte : null,
    };
    this.ecrireSession();
  },

  /** Compte connecté : { uid, identifiant, pseudo, classe, prof, libelle } ou null. */
  compte() {
    return this.jeton && this.jeton.compte ? this.jeton.compte : null;
  },

  uid() {
    const compte = this.compte();
    return compte ? compte.uid : null;
  },

  sujetDuJeton() {
    try {
      const charge = this.jeton.access_token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(atob(charge)).sub || null;
    } catch {
      return null;
    }
  },

  async assurerSession() {
    if (!this.jeton) throw erreurNuage('PAS_DE_SESSION');
    if (Date.now() < this.jeton.expires_at) return;
    if (this.renouvellement) return this.renouvellement;
    // Un autre onglet a peut-être déjà renouvelé : on repart du stockage.
    try {
      const stocke = JSON.parse(localStorage.getItem(NUAGE_STOCKAGE) || 'null');
      if (stocke && stocke.refresh_token && stocke.expires_at > this.jeton.expires_at) {
        this.jeton = stocke;
        if (Date.now() < this.jeton.expires_at) return;
      }
    } catch { /* on garde le jeton en mémoire */ }
    this.renouvellement = this.auth('token?grant_type=refresh_token', { refresh_token: this.jeton.refresh_token })
      .then((r) => this.memoriser(r))
      .catch((e) => {
        // Hors ligne : on garde la session, on réessaiera plus tard.
        if (estHorsLigne(e)) throw erreurNuage('HORS_LIGNE');
        this.jeton = null;
        this.ecrireSession();
        throw erreurNuage('PAS_DE_SESSION');
      })
      .finally(() => { this.renouvellement = null; });
    return this.renouvellement;
  },

  /* ---------- HTTP ---------- */

  async lire(reponse) {
    const texte = await reponse.text();
    let donnees = null;
    if (texte) {
      try { donnees = JSON.parse(texte); } catch { donnees = texte; }
    }
    if (reponse.ok) return donnees;
    const e = new Error((donnees && (donnees.hint || donnees.message || donnees.msg
      || donnees.error_description || donnees.error)) || `HTTP ${reponse.status}`);
    e.code = (donnees && donnees.message) || String(reponse.status);
    e.motif = (donnees && (donnees.error_code || donnees.error)) || '';
    e.statut = reponse.status;
    throw e;
  },

  async auth(chemin, corps) {
    const reponse = await fetch(`${NUAGE_URL}/auth/v1/${chemin}`, {
      method: 'POST',
      headers: { apikey: NUAGE_CLE, 'Content-Type': 'application/json' },
      body: JSON.stringify(corps || {}),
    });
    return this.lire(reponse);
  },

  async entetes(supplement = {}) {
    await this.assurerSession();
    return { apikey: NUAGE_CLE, Authorization: `Bearer ${this.jeton.access_token}`, ...supplement };
  },

  /** Requête PostgREST. */
  async api(chemin, { method = 'GET', corps, prefer } = {}) {
    const entetes = await this.entetes({ 'Content-Type': 'application/json' });
    if (prefer) entetes.Prefer = prefer;
    const reponse = await fetch(`${NUAGE_URL}/rest/v1/${chemin}`, {
      method,
      headers: entetes,
      body: corps === undefined ? undefined : JSON.stringify(corps),
    });
    return this.lire(reponse);
  },

  /** Toutes les lignes d'une requête, par pages de 1000 (plafond de PostgREST). */
  async tout(chemin) {
    const lignes = [];
    const separateur = chemin.includes('?') ? '&' : '?';
    for (let debut = 0; ; debut += 1000) {
      const page = await this.api(`${chemin}${separateur}limit=1000&offset=${debut}`);
      lignes.push(...page);
      if (page.length < 1000) return lignes;
    }
  },

  async rpc(nom, args = {}) {
    return this.api(`rpc/${nom}`, { method: 'POST', corps: args });
  },

  /* ---------- Comptes ---------- */

  normaliserIdentifiant(brut) {
    const id = String(brut || '').trim().toLowerCase();
    if (id.includes('@')) return id;
    if (!/^[a-z0-9-]{3,32}$/.test(id)) throw erreurNuage('IDENTIFIANT_INVALIDE');
    return id;
  },

  adresse(identifiant) {
    return identifiant.includes('@') ? identifiant : `${identifiant}@snt.local`;
  },

  motDePasseInsuffisant(mdp) {
    if (mdp.length < 6) return 'MOT_DE_PASSE_TROP_COURT';
    if (!/[a-z]/.test(mdp) || !/[A-Z]/.test(mdp) || !/[0-9]/.test(mdp)) return 'MOT_DE_PASSE_FAIBLE';
    return null;
  },

  /** Après connexion : qui est là, élève ou enseignant ? */
  async identifier(identifiant) {
    const uid = this.sujetDuJeton();
    const [session, prof] = await Promise.all([
      this.rpc('ma_session').catch(() => []),
      this.rpc('est_enseignant').catch(() => false),
    ]);
    const fiche = Array.isArray(session) && session.length ? session[0] : null;
    let libelle = null;
    if (prof === true) {
      const lignes = await this.api('enseignants?select=libelle&limit=1').catch(() => []);
      libelle = lignes.length ? lignes[0].libelle : null;
    }
    this.jeton.compte = {
      uid,
      identifiant,
      pseudo: fiche ? fiche.pseudo : (libelle || identifiant),
      classe: fiche ? fiche.classe_libelle : null,
      prof: prof === true,
      libelle,
    };
    this.ecrireSession();
    return this.jeton.compte;
  },

  async seConnecter(identifiantBrut, motDePasse) {
    const identifiant = this.normaliserIdentifiant(identifiantBrut);
    try {
      this.memoriser(await this.auth('token?grant_type=password', {
        email: this.adresse(identifiant), password: String(motDePasse || ''),
      }));
    } catch (e) {
      if (e.statut === 429 || /rate_limit/.test(e.motif)) throw erreurNuage('TROP_DE_TENTATIVES');
      if (e.statut === 400 || e.motif === 'invalid_credentials') throw erreurNuage('IDENTIFIANTS_INCORRECTS');
      throw e;
    }
    return this.identifier(identifiant);
  },

  /** Même parcours que le site : le compte d'abord, l'inscription en classe ensuite. */
  async creerCompte(identifiantBrut, motDePasse, codeClasse) {
    const identifiant = this.normaliserIdentifiant(identifiantBrut);
    if (identifiant.includes('@')) throw erreurNuage('IDENTIFIANT_INVALIDE');
    const mdp = String(motDePasse || '');
    const faible = this.motDePasseInsuffisant(mdp);
    if (faible) throw erreurNuage(faible);
    try {
      this.memoriser(await this.auth('signup', { email: this.adresse(identifiant), password: mdp }));
    } catch (e) {
      if (e.motif === 'weak_password') throw erreurNuage('MOT_DE_PASSE_FAIBLE');
      if (e.motif === 'email_address_invalid') throw erreurNuage('IDENTIFIANT_REFUSE');
      if (e.statut === 429 || /rate_limit/.test(e.motif)) throw erreurNuage('TROP_DE_TENTATIVES');
      if (e.motif === 'user_already_exists' || e.motif === 'email_exists') {
        // Compte créé mais jamais rattaché à une classe : on le reprend si le
        // mot de passe est le bon (voir progression.js du site).
        try {
          this.memoriser(await this.auth('token?grant_type=password', { email: this.adresse(identifiant), password: mdp }));
        } catch {
          throw erreurNuage('IDENTIFIANT_DEJA_PRIS');
        }
      } else {
        throw e;
      }
    }
    const deja = await this.rpc('ma_session').catch(() => []);
    if (!deja || !deja.length) {
      try {
        await this.rpc('rejoindre_classe', { p_code: String(codeClasse || '').trim().toUpperCase(), p_pseudo: identifiant });
      } catch (e) {
        const code = /CODE_CLASSE_INCONNU|PSEUDO_DEJA_PRIS/.exec(`${e.code} ${e.message}`);
        throw code ? erreurNuage(code[0]) : e;
      }
    }
    return this.identifier(identifiant);
  },

  seDeconnecter() {
    const jeton = this.jeton;
    this.jeton = null;
    this.ecrireSession();
    if (jeton) {
      fetch(`${NUAGE_URL}/auth/v1/logout`, {
        method: 'POST',
        headers: { apikey: NUAGE_CLE, Authorization: `Bearer ${jeton.access_token}` },
      }).catch(() => {});
    }
  },

  /* ---------- Photos ---------- */

  cheminPhoto(chemin) {
    return chemin.split('/').map(encodeURIComponent).join('/');
  },

  async deposerPhoto(chemin, blob) {
    const entetes = await this.entetes({ 'Content-Type': blob.type || 'image/jpeg', 'x-upsert': 'false' });
    const reponse = await fetch(`${NUAGE_URL}/storage/v1/object/${NUAGE_BUCKET}/${this.cheminPhoto(chemin)}`, {
      method: 'POST', headers: entetes, body: blob,
    });
    try {
      return await this.lire(reponse);
    } catch (e) {
      e.photo = true;
      if (reponse.status === 400 && /row-level security|Unauthorized/i.test(e.message)) e.statut = 403;
      throw e;
    }
  },

  async telechargerPhoto(chemin) {
    const entetes = await this.entetes();
    const reponse = await fetch(`${NUAGE_URL}/storage/v1/object/authenticated/${NUAGE_BUCKET}/${this.cheminPhoto(chemin)}`, {
      headers: entetes,
    });
    if (!reponse.ok) await this.lire(reponse);
    return reponse.blob();
  },

  async supprimerPhotos(chemins) {
    if (!chemins.length) return;
    const entetes = await this.entetes({ 'Content-Type': 'application/json' });
    const reponse = await fetch(`${NUAGE_URL}/storage/v1/object/${NUAGE_BUCKET}`, {
      method: 'DELETE', headers: entetes, body: JSON.stringify({ prefixes: chemins }),
    });
    return this.lire(reponse);
  },

  /** Photos du compte : nombre et poids, pour la jauge. */
  async mesPhotos() {
    const entetes = await this.entetes({ 'Content-Type': 'application/json' });
    const reponse = await fetch(`${NUAGE_URL}/storage/v1/object/list/${NUAGE_BUCKET}`, {
      method: 'POST', headers: entetes,
      body: JSON.stringify({ prefix: `${this.uid()}/`, limit: 1000, offset: 0 }),
    });
    const fichiers = (await this.lire(reponse)) || [];
    const liste = fichiers.filter((f) => f.id);
    return {
      nombre: liste.length,
      octets: liste.reduce((s, f) => s + ((f.metadata && f.metadata.size) || 0), 0),
      chemins: liste.map((f) => `${this.uid()}/${f.name}`),
    };
  },
};

const QUOTA_PHOTOS = 150;
