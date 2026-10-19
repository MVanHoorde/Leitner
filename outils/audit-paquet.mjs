// Fiche d'audit d'un paquet intégré, tirée du code : ce qu'on relit est ce que voit l'élève.
//   node outils/audit-paquet.mjs src/js/35-contenu-python.js docs/audit-python-n1.md
// Une carte générative est montrée par trois tirages. Rien n'est écrit dans le paquet.
import fs from 'node:fs';
import vm from 'node:vm';

const [source, sortie] = process.argv.slice(2);
let paquet = null;
vm.runInNewContext(fs.readFileSync(source, 'utf8'), {
  auHasard: (l) => l[Math.floor(Math.random() * l.length)],
  entierEntre: (a, b) => a + Math.floor(Math.random() * (b - a + 1)),
  pileOuFace: () => Math.random() < 0.5,
  melanger: (l) => [...l].sort(() => Math.random() - 0.5),
  pieges: (bonne, liste) => [...new Set(liste)].filter((p) => p !== bonne),
  Paquets: { inscrire: (p) => { paquet = p; } },
});

const FORMATS = { qcm: 'QCM', saisie: 'À écrire', retournement: 'Carte retournée', vraifaux: 'Vrai ou faux' };
// Le code reste du code ; le LaTeX et les indices restent lisibles tels quels.
const md = (t) => String(t ?? '').replace(/```\n([\s\S]*?)\n```/g, (_, c) => `\n\n\`\`\`python\n${c}\n\`\`\`\n\n`).trim();
const liste = (l) => l.map((x) => md(x)).join(' · ');

const lignes = [
  `# Audit — ${paquet.titre}`,
  '',
  `*Fiche générée depuis \`${source.replace(/\\/g, '/')}\` le ${new Date().toLocaleDateString('fr-FR')} : ne pas la corriger à la main, corriger le paquet puis relancer \`node outils/audit-paquet.mjs\`.*`,
  '',
  '> 🔴 **PROPOSITION à valider par Loïc** (choix des cartes, formulations, pièges). Une carte se corrige par son texte,',
  '> jamais par son identifiant (la progression des élèves y est attachée).',
  '',
];
for (const section of paquet.sections) {
  lignes.push(`## ${section.titre} — ${section.cartes.length} cartes`, '');
  let etape = '';
  for (const carte of section.cartes) {
    const e = /\.e(\d+)\./.exec(carte.id);
    if (e && e[1] !== etape) {
      etape = e[1];
      lignes.push(`### Étape ${etape}`, '');
    }
    const formats = (carte.formats || []).map((f) => FORMATS[f] || f).join(', ');
    lignes.push(`#### \`${carte.id}\` — ${formats}${carte.comparaison === 'code' ? ' · réponse comparée en code' : ''}`, '');
    if (carte.consigne) lignes.push(`*Consigne :* ${carte.consigne}`, '');
    const tirages = carte.generer ? [0, 1, 2].map(() => ({ ...carte, ...carte.generer() })) : [carte];
    tirages.forEach((t, i) => {
      if (carte.generer) lignes.push(`**Tirage ${i + 1}**`, '');
      lignes.push(`- **Énoncé :** ${md(t.question)}`);
      if (typeof t.vrai === 'boolean') lignes.push(`- **Attendu :** ${t.vrai ? 'Vrai' : 'Faux'}`);
      lignes.push(`- **Réponse :** ${md(t.reponse)}`);
      if (t.saisie && t.saisie.length) lignes.push(`- **Acceptées aussi à l'écrit :** ${liste(t.saisie)}`);
      if (t.distracteurs && t.distracteurs.length) lignes.push(`- **Pièges :** ${liste(t.distracteurs)}`);
      if (t.aide) lignes.push(`- **Aide :** ${md(t.aide)}`);
      lignes.push('');
    });
  }
}
fs.writeFileSync(sortie, lignes.join('\n'));
console.log(`${sortie} : ${paquet.sections.reduce((n, s) => n + s.cartes.length, 0)} cartes`);
