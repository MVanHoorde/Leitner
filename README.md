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
  Cette entrée n'est proposée qu'à un compte enseignant (rôle vérifié par le
  serveur) : sans lui, l'application s'ouvre directement sur les flashcards.
  Réimporter une classe déjà enregistrée est détecté : liste identique →
  « passer à un autre fichier » (ou écraser) ; liste modifiée → les élèves
  connus gardent leur progression, les arrivées sont ajoutées, les absents du
  fichier peuvent être retirés.
  « Mes classes » (`src/js/81-classes.js`) : renommer ou fusionner, supprimer
  une classe, retirer les élèves de la démonstration (reconnus exactement, le
  tirage étant fixe), ajouter un élève à la main avec une photo.
  Un élève peut appartenir à plusieurs classes ou groupes (`groupes`, en plus
  de `classe`) : une seule fiche, une seule carte Leitner. À l'import, un élève
  déjà connu ailleurs est rattaché au nouveau groupe (ligne encadrée, case
  « homonyme » pour créer une fiche à part). Les PDF dont la police est lue en
  MacRoman au lieu de WinAnsi (« HÈlËne », « B…RANGER ») sont relus.
  En révision photo → identité, l'auto-évaluation se fait par étapes (classe,
  prénom, nom, puis sûr ou hésitant) : `Leitner.noter` fait monter, garder ou
  descendre la carte selon ce niveau.

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
- `src/js/36-bibliotheque.js` — trois algorithmes au choix par paquet
  (Leitner classique, Leitner progressif, SM-2 à quatre notes), rythmes
  (intensif, standard, long terme, sur mesure), date d'évaluation, bibliothèque personnelle, conversion des paquets
  en ligne au format des paquets intégrés.

Cinq modèles de cartes : question → réponse, dans les deux sens (deux cartes),
QCM (trois pièges choisis), réponse à écrire, photo à trous (une carte par zone
cachée). Chaque face peut porter une photo. « Coller une liste » crée des cartes
en lot (`question ; réponse` par ligne).

**Objectifs** (`src/js/38-objectifs.js`, écrans dans `88-objectifs-ecrans.js`) :
plusieurs paquets révisés ensemble, par exemple tous les chapitres d'un bac
blanc. Les cartes sont mélangées, mais chacune est notée selon les réglages de
son paquet et compte dans son quota ; la date d'évaluation de l'objectif vaut
pour tous ses paquets. Rangés dans le profil (clé `objectifs`), sans table.

**Formules** (`src/js/05-formules.js`) : syntaxe proche de LaTeX, dessinée en
HTML/CSS sans bibliothèque — `^{…}`, `_{…}`, `\frac{a}{b}`, `\sqrt{x}`,
`\sqrt[n]{x}`, `\bar{AB}`, `\vec{u}`, `\sum_{i=1}^{n}`, `\prod`, `\int`,
`\lim`, et les noms grecs (`\alpha`…). La barre de formules
(`src/js/87-symboles.js`) les insère et affiche le rendu en direct.
Entre `$…$` (ou `$$…$$` pour une formule centrée), le LaTeX complet passe par
KaTeX 0.18.9 et son extension mhchem (`\ce{…}`), embarqués depuis
`vendor/katex/` (MIT) avec leurs polices woff2 en data: ; `\$` écrit un dollar.
L'onglet « ? Aide » de la barre sert de mode d'emploi aux élèves.

Avec une date d'évaluation, aucune carte n'est repoussée au-delà de la veille,
et le quota de nouvelles cartes monte si besoin pour que tout ait été vu trois
jours avant.

## Les paquets intégrés

Les cartes sont écrites dans le code (`src/js/33-*`), jamais en base : elles se
mettent à jour avec l'application, et seule la progression est stockée. **Un
identifiant de carte ne change jamais** — la progression des élèves y est
attachée. Le contrat d'une carte est documenté en tête de `src/js/32-paquets.js`.

Deux paquets livrés, chacun en cinq niveaux :

- « Conversions et puissances de dix » (`src/js/33-contenu-conversions.js`,
  120 cartes) : des préfixes de seconde au logarithme de terminale.
- « Grandeurs et unités » (`src/js/34-contenu-unites.js`, 134 cartes) : les
  grandeurs des programmes de seconde, de première et de terminale (BO 2019),
  les unités de base du SI, puis l'analyse dimensionnelle (retrouver l'unité
  de R, de λ de Kohlrausch, de ε…). Le lecteur d'unités de
  `src/js/05-formules.js` accepte toute écriture équivalente (J·mol⁻¹·K⁻¹ =
  J/(mol.K) = Pa·m³·mol⁻¹·K⁻¹) et refuse un préfixe de travers.
 Quatre formats : carte retournée, QCM
(trois pièges tirés parmi cinq à sept), réponse écrite (comparaison numérique
avec tolérance réglable, écriture scientifique exigée au besoin), vrai ou faux.
La plupart des cartes sont *génératives* : valeurs et pièges sont retirés à
chaque passage, pour apprendre le geste et non le résultat.

**Progression par niveaux** (`src/js/37-niveaux.js`) : tout le monde commence au
niveau 1 ; un niveau s'ouvre quand 80 % des cartes du précédent sont en boîte 3,
ou par un test de positionnement (8 bonnes réponses sur 10, un essai par jour).
Une carte nouvelle réussie du premier coup saute en boîte 3, et le quota de
nouvelles double tant que l'élève réussit plus de 90 % ; si un niveau franchi
s'effondre (plus d'un tiers des cartes vues en boîte 1), les nouvelles du niveau
en cours attendent. Les anciens paquets livrés (chimie, réflexes, nomenclature)
sont remplacés par ceux-ci dans les bibliothèques des élèves.

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
