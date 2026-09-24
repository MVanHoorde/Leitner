# Boîte à cartes

Application web de mémorisation par boîte de Leitner, en un seul fichier HTML
autonome, sans aucune requête réseau, données stockées en IndexedDB.

Elle a deux entrées, choisies au lancement :

- **Espace enseignant** — trombinoscope : apprendre à reconnaître ses élèves
  (visage → nom, prénom, classe), import de trombinoscopes PDF, tableau de bord.
  Protégé par mot de passe ; noms et photos sont chiffrés en AES-GCM.
- **Espace élève** — paquets de cartes de cours (chimie de seconde, réflexes de
  calcul, nomenclature de terminale). Aucune donnée personnelle, donc aucun mot
  de passe. Cette entrée n'obtient jamais la clé de déchiffrement : le
  trombinoscope reste illisible depuis l'espace élève, même sur le même appareil.

## Les paquets de contenu

Les cartes sont écrites dans le code (`src/js/33-*`, `src/js/34-*`), jamais en
base : elles se mettent à jour avec l'application, et seule la progression est
stockée. **Un identifiant de carte ne change jamais** — la progression des
élèves y est attachée. Le contrat d'une carte est documenté en tête de
`src/js/32-paquets.js`.

Trois formats se partagent la même carte, et le mode « défis variés » en tire un
au hasard à chaque passage : carte retournée avec auto-évaluation, QCM à quatre
propositions, réponse écrite (comparaison tolérante aux accents, à la casse et
aux tirets ; comparaison numérique avec marge pour les valeurs). Les conversions
sont des cartes *génératives* : les valeurs sont retirées à chaque apparition,
pour apprendre le geste et non le résultat.

## Développement

Le code source est dans `src/` ; `build.py` l'assemble en un fichier unique.

```
python build.py                                  # produit reconnaitre-mes-eleves.html
python -m http.server 8000 --bind 127.0.0.1      # puis http://127.0.0.1:8000/reconnaitre-mes-eleves.html
```

- `src/index.html` : gabarit (marqueurs `/*@CSS*/` et `/*@JS*/`)
- `src/styles.css`
- `src/js/*.js` : concaténés par ordre alphabétique

Chaque écran déclare sa porte (`porte: 'prof'` par défaut, `'eleve'` ou
`'tous'`) ; le cloisonnement est appliqué au seul endroit qui route, dans
`src/js/40-navigation.js`.
