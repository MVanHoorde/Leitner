function sectionSauvegarde() { return el('section', { class: 'panneau' }, el('h2', { text: 'Sauvegarde' })); }
function sectionMotDePasse() { return null; }
Ecrans.tableau = { titre: 'Tableau de bord', titreCourt: 'Tableau', parent: 'accueil', rendre() {} };
Ecrans.import = { titre: 'Import', titreCourt: 'Import', parent: 'accueil', rendre() {} };
