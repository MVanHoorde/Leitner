# Boîte à cartes

Application web de mémorisation par boîte de Leitner, en un seul fichier HTML
autonome, publiée sur https://mvanhoorde.github.io/Leitner/.

Elle a deux entrées, choisies au lancement :

- **Mes flashcards** (élèves et enseignants) — connexion avec le compte du site
  du cours (même identifiant, même mot de passe, même projet Supabase) :
  bibliothèque personnelle rangée par thème, création de paquets et de cartes,
  « Bibliothèque du prof » où piocher les paquets publiés, réglages Leitner par
  paquet, progression. Sans compte, on peut réviser les paquets livrés avec
  l'application, la progression restant sur l'appareil.
- **Trombinoscope (enseignant)** — apprendre à reconnaître ses élèves (visage →
  nom, prénom, classe), import de trombinoscopes PDF, tableau de bord. Protégé
  par mot de passe ; noms et photos sont chiffrés en AES-GCM et **ne quittent
  jamais l'appareil**. L'entrée flashcards n'obtient jamais la clé.

## Les données en ligne

Schéma : `bdd/schema/022-leitner.sql` du dépôt Site-Web-Portfolio (tables
`leitner_*` et stockage privé `leitner` pour les photos). Les lignes sont
rattachées au compte : chacun lit et écrit les siennes ; tout compte lit les
paquets publiés ; seul un enseignant (`est_enseignant()`) publie ; un enseignant
lit, sans pouvoir écrire, ce que font les élèves de ses classes.

- `src/js/12-nuage.js` — client HTTP nu (pas de supabase-js, pas de CDN) :
  comptes, tables, photos. Session propre à l'application (`leitner.session`).
- `src/js/14-depot.js` — profil, journal, réglages et états des cartes : sur
  l'appareil sans compte ; en ligne avec un compte, avec une copie locale et
  une file d'attente qui repart au retour du réseau.
- `src/js/26-photos.js` — photos réduites à 1600 px et compressées en JPEG
  (≈ 150 à 300 Ko) avant envoi, gardées en cache sur l'appareil. 150 photos par
  compte, jauge dans « Mon compte ».
- `src/js/36-bibliotheque.js` — rythmes (intensif, standard, long terme, sur
  mesure), date d'évaluation, bibliothèque personnelle, conversion des paquets
  en ligne au format des paquets intégrés.

Cinq modèles de cartes : question → réponse, dans les deux sens (deux cartes),
QCM (trois pièges choisis), réponse à écrire, photo à trous (une carte par zone
cachée). Chaque face peut porter une photo. « Coller une liste » crée des cartes
en lot (`question ; réponse` par ligne).

Avec une date d'évaluation, aucune carte n'est repoussée au-delà de la veille,
et le quota de nouvelles cartes monte si besoin pour que tout ait été vu trois
jours avant.

## Les paquets intégrés

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

- `src/index.html` : gabarit (marqueurs `/*@CSS*/` et `/*@JS*/`) ; la CSP
  n'autorise de connexion que vers le projet Supabase
- `src/styles.css`
- `src/js/*.js` : concaténés par ordre alphabétique, dans une seule portée —
  deux fonctions de même nom s'écrasent sans erreur, la dernière gagne

Chaque écran déclare sa porte (`porte: 'prof'` par défaut, `'eleve'` ou
`'tous'`) ; le cloisonnement est appliqué au seul endroit qui route, dans
`src/js/40-navigation.js`.
