/* Gestion entre collègues (11/11/2026) — côté Leitner, comptes enseignants seulement.
 *
 * Même base que le site du cours (bdd/schema/038-gestion-collegues.sql, dans
 * Site-Web-Portfolio) : les messages arrivent dans l'onglet « Gestion » du
 * tableau de bord du cours, où M. Van Hoorde les lit et y répond.
 *  · Bouton ✉️ « Écrire à M. Van Hoorde », en bas à droite, et les réponses.
 *  · Fenêtre « ✨ Nouveautés » à l'arrivée, une fois par édition ; la dernière
 *    vue est rangée dans reglages_enseignant.nouveautes_vues.leitner (le site
 *    du cours a sa clé « cours », sa propre liste).
 *  · Le gestionnaire voit « ✉️ Messages », qui ouvre le tableau de bord du cours.
 * Tant que le 038 n'est pas passé, le bouton dit que la boîte n'est pas activée.
 *
 * 🔴 CONSIGNE DE LOÏC : toute évolution qui touche les collègues s'accompagne
 * d'une édition de NOUVEAUTES_LEITNER (en tête, n = dernier + 1), proposée
 * d'office par Claude. */

const NOUVEAUTES_LEITNER = [
  {
    n: 1,
    date: '2026-11-11',
    titre: 'Un mot à M. Van Hoorde, depuis la Boîte à cartes',
    points: [
      {
        titre: 'Écrire à M. Van Hoorde',
        texte: 'Le bouton ✉️ en bas à droite : une carte à corriger, un paquet à ajouter, un souci… Sa réponse s’affiche au même endroit. Pas de nom d’élève.',
        visuel: '<div class="gst-mini"><div class="gst-mini-bulle">La carte 12 du paquet Doppler a une coquille.</div><span class="gst-mini-bouton">✉️ Écrire à M. Van Hoorde</span></div>',
      },
    ],
  },
];

const Gestion = {
  NOM: 'M. Van Hoorde',
  TABLEAU: '/Site-Web-Portfolio/prof/index.html',
  pour: null,          // uid du compte pour lequel l'état est chargé
  gestionnaire: false,
  vues: {},
  messages: [],

  echapper(t) {
    return String(t ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  },
  quand(s) {
    return s ? new Date(s).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }).replace(' ', ' à ') : '';
  },
  cleReponses() { return `leitner.reponses-vues.${this.pour}`; },
  reponsesVuesLe() { try { return localStorage.getItem(this.cleReponses()) || ''; } catch (e) { return ''; } },

  /** Appelé à chaque affichage d'écran : installe ou retire le bouton. */
  async maj() {
    const compte = Nuage.compte();
    const prof = Boolean(compte && compte.prof && Nuage.jeton && Nuage.jeton.access_token);
    let bouton = document.getElementById('gst-ecrire');
    if (!prof) { if (bouton) bouton.remove(); this.pour = null; return; }
    if (!bouton) {
      bouton = el('button', { type: 'button', id: 'gst-ecrire', class: 'gst-ecrire' });
      bouton.addEventListener('click', () => (this.gestionnaire ? window.open(this.TABLEAU, '_blank', 'noopener') : this.ouvrir()));
      document.body.append(bouton);
    }
    if (this.pour === compte.uid) return;
    this.pour = compte.uid;
    this.majBouton(0);
    const [gest, reglages] = await Promise.all([
      Nuage.rpc('est_gestionnaire').catch(() => false),
      Nuage.api(`reglages_enseignant?select=nouveautes_vues&auth_id=eq.${encodeURIComponent(compte.uid)}`).catch(() => null),
    ]);
    this.gestionnaire = gest === true;
    const r = Array.isArray(reglages) && reglages[0];
    this.vues = r && r.nouveautes_vues && typeof r.nouveautes_vues === 'object' ? r.nouveautes_vues : {};
    this.enBase = Array.isArray(reglages);
    this.majBouton(0);
    if (!this.gestionnaire) await this.chargerMessages();
    this.annoncer(false);
  },

  majBouton(n) {
    const b = document.getElementById('gst-ecrire');
    if (!b) return;
    b.innerHTML = `<span aria-hidden="true">✉️</span> ${this.gestionnaire ? 'Messages des collègues' : `Écrire à ${this.NOM}`}`
      + (n ? ` <span class="gst-n">${n}</span>` : '');
  },

  async chargerMessages() {
    try {
      this.messages = await Nuage.api(`messages_gestion?select=id,ou,message,cree_le,lu_le,reponse,repondu_le&auteur=eq.${encodeURIComponent(this.pour)}&order=cree_le.desc&limit=20`);
    } catch (e) { this.messages = null; }
    const vu = this.reponsesVuesLe();
    this.majBouton(this.messages ? this.messages.filter((m) => m.repondu_le && m.repondu_le > vu).length : 0);
  },

  fenetre(id, html) {
    document.getElementById(id)?.remove();
    const d = el('dialog', { class: 'gst-dlg', id, 'aria-labelledby': `${id}-titre` });
    d.innerHTML = html;
    document.body.append(d);
    return d;
  },

  ouvrir() {
    const e = this.echapper.bind(this);
    const ou = `Boîte à cartes · ${document.getElementById('titre')?.textContent || 'Leitner'}`;
    const avant = this.reponsesVuesLe();
    const d = this.fenetre('gst-dlg-ecrire',
      `<form novalidate><h2 id="gst-dlg-ecrire-titre">✉️ Écrire à ${e(this.NOM)}</h2>`
      + `<p class="gst-aide">Il le lira dans son tableau de bord et vous répondra ici. Vous écrivez depuis : <b>${e(ou)}</b>.</p>`
      + '<label for="gst-msg">Votre message</label>'
      + '<textarea id="gst-msg" maxlength="2000" rows="5" placeholder="Une carte à corriger, un paquet à ajouter…"></textarea>'
      + '<p class="gst-aide">Aucun nom d’élève.</p><p class="gst-etat" role="status" aria-live="polite"></p>'
      + '<div class="gst-actions"><button type="button" class="bouton" data-fermer>Fermer</button>'
      + '<button type="submit" class="bouton principal" data-envoyer>Envoyer</button></div>'
      + '<h3>Vos derniers messages</h3><div class="gst-histo-liste"><p class="gst-aide">Chargement…</p></div></form>');
    const ta = d.querySelector('textarea');
    const etat = d.querySelector('.gst-etat');
    const histo = () => {
      const z = d.querySelector('.gst-histo-liste');
      if (this.messages === null) { z.innerHTML = '<p class="gst-aide">Pas encore activé : la base attend une mise à jour.</p>'; return; }
      z.innerHTML = this.messages.length ? this.messages.map((m) => `<div class="gst-histo"><small>${e(this.quand(m.cree_le))}${m.ou ? ` · ${e(m.ou)}` : ''} · `
        + `${m.reponse ? `répondu le ${e(this.quand(m.repondu_le))}` : m.lu_le ? `lu le ${e(this.quand(m.lu_le))}` : 'envoyé, pas encore lu'}</small>`
        + `<div class="q">${e(m.message)}</div>`
        + (m.reponse ? `<div class="r${m.repondu_le > avant ? ' neuf' : ''}"><b>${e(this.NOM)} :</b> ${e(m.reponse)}</div>` : '')
        + '</div>').join('') : '<p class="gst-aide">Aucun message envoyé pour l’instant.</p>';
    };
    d.querySelector('[data-fermer]').addEventListener('click', () => d.close());
    d.querySelector('form').addEventListener('submit', async (ev) => {
      ev.preventDefault();
      const t = ta.value.trim();
      if (t.length < 3) { etat.textContent = 'Écrivez au moins quelques mots.'; return; }
      const env = d.querySelector('[data-envoyer]');
      env.disabled = true; etat.textContent = 'Envoi…';
      try {
        await Nuage.api('messages_gestion', { method: 'POST', corps: { auteur: this.pour, message: t, ou }, prefer: 'return=minimal' });
        ta.value = ''; etat.textContent = 'Envoyé. Merci !';
        await this.chargerMessages(); histo();
      } catch (err) {
        const m = String((err && err.message) || '');
        etat.textContent = /messages_gestion|does not exist|schema cache|Could not find|PGRST20/i.test(m)
          ? `La boîte à messages n’est pas encore activée : prévenez ${this.NOM}.`
          : /PLAFOND_MESSAGES/.test(m) ? 'Trente messages par jour au plus : réessayez demain.' : `Échec : ${m}`;
      }
      env.disabled = false;
    });
    d.showModal(); ta.focus();
    this.chargerMessages().then(() => {
      histo();
      try { localStorage.setItem(this.cleReponses(), new Date().toISOString()); } catch (er) { /* rien */ }
      this.majBouton(0);
    });
  },

  annoncer(toutes) {
    const vue = +this.vues.leitner || 0;
    const liste = [...NOUVEAUTES_LEITNER].sort((a, b) => b.n - a.n).filter((x) => toutes || x.n > vue);
    if (!liste.length || (!toutes && document.querySelector('dialog[open]'))) return;
    const e = this.echapper.bind(this);
    const dl = (s) => new Date(`${s}T12:00`).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
    const d = this.fenetre('gst-dlg-nv',
      `<h2 id="gst-dlg-nv-titre">✨ Du nouveau dans la Boîte à cartes</h2>`
      + liste.map((ed) => `<div class="gst-nv-ed"><small>${e(dl(ed.date))}</small><h3>${e(ed.titre)}</h3>`
        + ed.points.map((p) => `<div class="gst-nv-pt"><div>${p.visuel || ''}</div><div><b>${e(p.titre)}</b><p>${e(p.texte)}</p></div></div>`).join('')
        + '</div>').join('')
      + '<div class="gst-actions"><button type="button" class="bouton principal" data-ok>J’ai compris</button></div>');
    const max = Math.max(...NOUVEAUTES_LEITNER.map((x) => x.n));
    d.addEventListener('close', () => {
      d.remove();
      if (max <= vue || !this.enBase) return;
      this.vues = { ...this.vues, leitner: max };
      Nuage.api('reglages_enseignant', {
        method: 'POST',
        corps: { auth_id: this.pour, nouveautes_vues: this.vues, maj_le: new Date().toISOString() },
        prefer: 'resolution=merge-duplicates,return=minimal',
      }).catch(() => {});
    });
    d.querySelector('[data-ok]').addEventListener('click', () => d.close());
    d.showModal();
  },
};
