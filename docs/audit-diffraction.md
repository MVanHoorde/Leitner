# Audit — Diffraction

*Fiche générée depuis `src/js/35-contenu-diffraction.js` le 31/10/2026 : ne pas la corriger à la main, corriger le paquet puis relancer `node outils/audit-paquet.mjs`.*

> 🔴 **PROPOSITION à valider par Loïc** (choix des cartes, formulations, pièges). Une carte se corrige par son texte,
> jamais par son identifiant (la progression des élèves y est attachée).

## Niveau 1 · Vocabulaire, définitions, formules — 16 cartes

#### `diffraction.n1.definition` — Carte retournée, QCM

- **Énoncé :** Qu’est-ce que la diffraction d’une onde ?
- **Réponse :** L’étalement des directions de propagation d’une onde qui rencontre une ouverture ou un obstacle
- **Pièges :** Le changement de fréquence d’une onde dont l’émetteur se déplace · L’addition de deux ondes qui se renforcent ou s’annulent · L’affaiblissement d’une onde au cours de sa propagation

#### `diffraction.n1.condition` — QCM, Carte retournée

- **Énoncé :** À quelle condition la diffraction est-elle marquée ?
- **Réponse :** Quand la taille a de l’ouverture est du même ordre de grandeur que λ, ou plus petite
- **Pièges :** Quand l’ouverture est beaucoup plus grande que λ · Quand l’onde a une grande amplitude · Seulement quand l’onde est lumineuse

#### `diffraction.n1.formule-theta` — QCM, Carte retournée

- **Énoncé :** Quelle relation donne l’angle caractéristique de diffraction θ ?
- **Réponse :** $\theta = \dfrac{\lambda}{a}$
- **Pièges :** $\theta = \dfrac{a}{\lambda}$ · $\theta = \lambda \times a$ · $\theta = \dfrac{2\lambda}{a}$
- **Aide :** λ longueur d’onde et a largeur de l’ouverture, dans la même unité ; θ en radians.

#### `diffraction.n1.unite-theta` — QCM, Carte retournée

- **Énoncé :** Dans $\theta = \dfrac{\lambda}{a}$, en quelle unité s’exprime θ ?
- **Réponse :** En radians (rad)
- **Pièges :** En degrés (°) · En mètres (m) · En m⁻¹
- **Aide :** λ / a est un rapport de deux longueurs : le résultat est un angle en radians, jamais en degrés.

#### `diffraction.n1.unites-lambda-a` — QCM, Carte retournée

- **Énoncé :** Pour calculer λ / a, comment exprimer λ et a ?
- **Réponse :** Dans la même unité, par exemple les deux en mètres
- **Pièges :** λ en nm et a en mm · λ en m et a en mm · Peu importe : θ n’a pas d’unité
- **Aide :** 600 nm = 6,00 × 10^{-7} m et 0,20 mm = 2,0 × 10^{-4} m.

#### `diffraction.n1.frequence-inchangee` — Vrai ou faux

- **Énoncé :** « Après une fente, l’onde diffractée a la même fréquence et la même longueur d’onde que l’onde incidente. »
- **Attendu :** Vrai
- **Réponse :** Vrai : la diffraction change les directions de propagation, ni la fréquence, ni la longueur d’onde, ni la célérité.

#### `diffraction.n1.ouverture-petite` — QCM, Carte retournée

- **Énoncé :** On rétrécit la fente. La tache centrale de diffraction…
- **Réponse :** …s’élargit : θ = λ / a augmente quand a diminue
- **Pièges :** …rétrécit : θ diminue · …ne change pas : seule λ compte · …disparaît

#### `diffraction.n1.couleur` — QCM, Carte retournée

- **Énoncé :** Même fente, laser rouge puis laser bleu. Quelle lumière est la plus diffractée ?
- **Réponse :** La rouge : sa longueur d’onde est plus grande
- **Pièges :** La bleue : sa longueur d’onde est plus grande · La bleue : elle est plus énergétique · Les deux autant : seule a compte
- **Aide :** λ rouge ≈ 650 nm, λ bleu ≈ 450 nm : θ = λ / a est plus grand pour le rouge.

#### `diffraction.n1.figure-fente` — QCM, Carte retournée

- **Énoncé :** Une fente fine verticale éclairée par un laser : la figure de diffraction s’étale…
- **Réponse :** …horizontalement, perpendiculairement à la fente
- **Pièges :** …verticalement, le long de la fente · …en anneaux concentriques · …dans toutes les directions à la fois
- **Aide :** La diffraction est marquée dans la direction où l’ouverture est étroite.

#### `diffraction.n1.tache-centrale` — QCM, Carte retournée

- **Énoncé :** Dans la figure de diffraction d’une fente, comment est la tache centrale ?
- **Réponse :** La plus large et la plus lumineuse, deux fois plus large que les taches voisines
- **Pièges :** La plus petite et la plus sombre · Aussi large que les autres taches · Noire : l’onde s’y annule

#### `diffraction.n1.largeur-tache` — QCM, Carte retournée

- **Énoncé :** Largeur L de la tache centrale sur un écran à la distance D (petits angles) ?
- **Réponse :** $L = \dfrac{2 \lambda D}{a}$
- **Pièges :** $L = \dfrac{\lambda D}{a}$ · $L = \dfrac{2 a D}{\lambda}$ · $L = \dfrac{\lambda a}{2 D}$
- **Aide :** tan θ ≈ θ = (L / 2) / D, et θ = λ / a : L = 2λD / a.

#### `diffraction.n1.petits-angles` — QCM, Carte retournée

- **Énoncé :** Pour un petit angle exprimé en radians, $\tan\theta \approx \;$?
- **Réponse :** $\theta$
- **Pièges :** $1$ · $\dfrac{1}{\theta}$ · $\theta^{2}$
- **Aide :** C’est ce qui permet d’écrire θ = L / (2D) sur l’écran.

#### `diffraction.n1.toutes-ondes` — Vrai ou faux

- **Énoncé :** « La diffraction ne concerne que la lumière. »
- **Attendu :** Faux
- **Réponse :** Faux : toutes les ondes diffractent, la houle, le son, les ondes radio comme la lumière.

#### `diffraction.n1.consequence-son` — QCM, Carte retournée

- **Énoncé :** Pourquoi entend-on quelqu’un qui parle dans le couloir, porte ouverte, sans le voir ?
- **Réponse :** Le son, de longueur d’onde proche de la largeur de la porte, est diffracté ; la lumière, de λ bien plus petite, presque pas
- **Pièges :** Le son va plus vite que la lumière · La lumière est absorbée par l’air du couloir · Le son est réfléchi par le plafond, jamais diffracté

#### `diffraction.n1.consequence-digue` — QCM, Carte retournée

- **Énoncé :** Derrière l’entrée étroite d’un port, la houle s’étale en demi-cercles. Comment s’appelle ce phénomène ?
- **Réponse :** La diffraction
- **Pièges :** Les interférences · L’effet Doppler · L’atténuation

#### `diffraction.n1.fil` — Vrai ou faux

- **Énoncé :** « Un fil fin de diamètre a donne la même figure de diffraction qu’une fente de largeur a. »
- **Attendu :** Vrai
- **Réponse :** Vrai : on l’utilise pour mesurer le diamètre d’un cheveu ou d’un fil avec θ = λ / a.

## Niveau 2 · Situations, calculs de tête — 11 cartes

#### `diffraction.n2.theta` — À écrire, QCM

**Tirage 1**

- **Énoncé :** Un laser de longueur d’onde 500 nm éclaire une fente de largeur 0,050 mm. Angle caractéristique θ, en radians ?
- **Réponse :** 1,0 × 10^{-2} rad
- **Valeur à écrire :** 0.010000000000000002 (rad) · écart admis 1 %
- **Pièges :** 1,0 × 10^{1} rad · 1,0 × 10^{2} rad · 1,0 × 10^{-5} rad · 2,0 × 10^{-2} rad
- **Aide :** θ = λ / a = 500 × 10^{-9} / (0,050 × 10^{-3}) = 1,0 × 10^{-2} rad. λ et a d’abord en mètres.

**Tirage 2**

- **Énoncé :** Un laser de longueur d’onde 500 nm éclaire une fente de largeur 0,10 mm. Angle caractéristique θ, en radians ?
- **Réponse :** 5,0 × 10^{-3} rad
- **Valeur à écrire :** 0.005000000000000001 (rad) · écart admis 1 %
- **Pièges :** 5,0 rad · 2,0 × 10^{2} rad · 5,0 × 10^{-6} rad · 1,0 × 10^{-2} rad
- **Aide :** θ = λ / a = 500 × 10^{-9} / (0,10 × 10^{-3}) = 5,0 × 10^{-3} rad. λ et a d’abord en mètres.

**Tirage 3**

- **Énoncé :** Un laser de longueur d’onde 500 nm éclaire une fente de largeur 0,050 mm. Angle caractéristique θ, en radians ?
- **Réponse :** 1,0 × 10^{-2} rad
- **Valeur à écrire :** 0.010000000000000002 (rad) · écart admis 1 %
- **Pièges :** 1,0 × 10^{1} rad · 1,0 × 10^{2} rad · 1,0 × 10^{-5} rad · 2,0 × 10^{-2} rad
- **Aide :** θ = λ / a = 500 × 10^{-9} / (0,050 × 10^{-3}) = 1,0 × 10^{-2} rad. λ et a d’abord en mètres.

#### `diffraction.n2.largeur-tache` — À écrire, QCM

**Tirage 1**

- **Énoncé :** λ = 500 nm, fente de largeur a = 0,10 mm, écran à D = 1,0 m. Avec $L = \dfrac{2 \lambda D}{a}$, largeur L de la tache centrale en mm ?
- **Réponse :** 10 mm
- **Valeur à écrire :** 10.000000000000002 (mm) · écart admis 1 %
- **Pièges :** 5 mm · 100 mm · 0,01 mm
- **Aide :** L = 2 × 500 × 10^{-9} × 1 / (0,10 × 10^{-3}) = 0,01 m = 10 mm.

**Tirage 2**

- **Énoncé :** λ = 500 nm, fente de largeur a = 0,10 mm, écran à D = 2,0 m. Avec $L = \dfrac{2 \lambda D}{a}$, largeur L de la tache centrale en mm ?
- **Réponse :** 20 mm
- **Valeur à écrire :** 20.000000000000004 (mm) · écart admis 1 %
- **Pièges :** 10 mm · 200 mm · 0,02 mm
- **Aide :** L = 2 × 500 × 10^{-9} × 2 / (0,10 × 10^{-3}) = 0,02 m = 20 mm.

**Tirage 3**

- **Énoncé :** λ = 600 nm, fente de largeur a = 0,20 mm, écran à D = 2,0 m. Avec $L = \dfrac{2 \lambda D}{a}$, largeur L de la tache centrale en mm ?
- **Réponse :** 12 mm
- **Valeur à écrire :** 12 (mm) · écart admis 1 %
- **Pièges :** 6 mm · 120 mm · 0,012 mm
- **Aide :** L = 2 × 600 × 10^{-9} × 2 / (0,20 × 10^{-3}) = 0,012 m = 12 mm.

#### `diffraction.n2.theta-ecran` — À écrire, QCM

**Tirage 1**

- **Énoncé :** Tache centrale de largeur L = 20 mm sur un écran à D = 2,0 m. Avec $\theta \approx \dfrac{L}{2D}$, combien vaut θ en radians ?
- **Réponse :** 5,0 × 10^{-3} rad
- **Valeur à écrire :** 0.005 (rad) · écart admis 1 %
- **Pièges :** 1,0 × 10^{-2} rad · 5,0 rad · 2,5 × 10^{-3} rad
- **Aide :** θ = L / (2D) = 20 × 10^{-3} / (2 × 2) = 5,0 × 10^{-3} rad. L / 2 est la demi-largeur.

**Tirage 2**

- **Énoncé :** Tache centrale de largeur L = 24 mm sur un écran à D = 2,0 m. Avec $\theta \approx \dfrac{L}{2D}$, combien vaut θ en radians ?
- **Réponse :** 6,0 × 10^{-3} rad
- **Valeur à écrire :** 0.006 (rad) · écart admis 1 %
- **Pièges :** 1,2 × 10^{-2} rad · 6,0 rad · 3,0 × 10^{-3} rad
- **Aide :** θ = L / (2D) = 24 × 10^{-3} / (2 × 2) = 6,0 × 10^{-3} rad. L / 2 est la demi-largeur.

**Tirage 3**

- **Énoncé :** Tache centrale de largeur L = 20 mm sur un écran à D = 2,0 m. Avec $\theta \approx \dfrac{L}{2D}$, combien vaut θ en radians ?
- **Réponse :** 5,0 × 10^{-3} rad
- **Valeur à écrire :** 0.005 (rad) · écart admis 1 %
- **Pièges :** 1,0 × 10^{-2} rad · 5,0 rad · 2,5 × 10^{-3} rad
- **Aide :** θ = L / (2D) = 20 × 10^{-3} / (2 × 2) = 5,0 × 10^{-3} rad. L / 2 est la demi-largeur.

#### `diffraction.n2.lambda` — À écrire, QCM

**Tirage 1**

- **Énoncé :** Fente de largeur a = 0,10 mm, écran à D = 1,0 m : la tache centrale mesure L = 12 mm. Avec $\lambda = \dfrac{a L}{2 D}$, longueur d’onde en nm ?
- **Réponse :** 600 nm
- **Valeur à écrire :** 600 (nm) · écart admis 1 %
- **Pièges :** 1200 nm · 300 nm · 600000 nm
- **Aide :** λ = 0,10 × 10^{-3} × 12 × 10^{-3} / (2 × 1) = 600 × 10^{-9} m = 600 nm.

**Tirage 2**

- **Énoncé :** Fente de largeur a = 0,20 mm, écran à D = 2,0 m : la tache centrale mesure L = 10 mm. Avec $\lambda = \dfrac{a L}{2 D}$, longueur d’onde en nm ?
- **Réponse :** 500 nm
- **Valeur à écrire :** 500 (nm) · écart admis 1 %
- **Pièges :** 1000 nm · 250 nm · 500000 nm
- **Aide :** λ = 0,20 × 10^{-3} × 10 × 10^{-3} / (2 × 2) = 500 × 10^{-9} m = 500 nm.

**Tirage 3**

- **Énoncé :** Fente de largeur a = 0,20 mm, écran à D = 1,0 m : la tache centrale mesure L = 6 mm. Avec $\lambda = \dfrac{a L}{2 D}$, longueur d’onde en nm ?
- **Réponse :** 600 nm
- **Valeur à écrire :** 600 (nm) · écart admis 1 %
- **Pièges :** 1200 nm · 300 nm · 600000 nm
- **Aide :** λ = 0,20 × 10^{-3} × 6 × 10^{-3} / (2 × 1) = 600 × 10^{-9} m = 600 nm.

#### `diffraction.n2.largeur-fente` — À écrire, QCM

**Tirage 1**

- **Énoncé :** Laser de 500 nm ; on mesure θ = 5,0 × 10^{-3} rad. Largeur a de la fente, en mm ?
- **Réponse :** 0,10 mm
- **Valeur à écrire :** 0.1 (mm) · écart admis 1 %
- **Pièges :** 1 mm · 0,01 mm · 100 mm
- **Aide :** a = λ / θ = 500 × 10^{-9} / 5,0 × 10^{-3} = 1,0 × 10^{-4} m = 0,10 mm.

**Tirage 2**

- **Énoncé :** Laser de 500 nm ; on mesure θ = 1,0 × 10^{-2} rad. Largeur a de la fente, en mm ?
- **Réponse :** 0,050 mm
- **Valeur à écrire :** 0.05 (mm) · écart admis 1 %
- **Pièges :** 0,5 mm · 0,005 mm · 50 mm
- **Aide :** a = λ / θ = 500 × 10^{-9} / 1,0 × 10^{-2} = 5,0 × 10^{-5} m = 0,050 mm.

**Tirage 3**

- **Énoncé :** Laser de 600 nm ; on mesure θ = 3,0 × 10^{-3} rad. Largeur a de la fente, en mm ?
- **Réponse :** 0,20 mm
- **Valeur à écrire :** 0.2 (mm) · écart admis 1 %
- **Pièges :** 2 mm · 0,02 mm · 200 mm
- **Aide :** a = λ / θ = 600 × 10^{-9} / 3,0 × 10^{-3} = 2,0 × 10^{-4} m = 0,20 mm.

#### `diffraction.n2.changer-a` — QCM, À écrire

**Tirage 1**

- **Énoncé :** Avec une fente, la tache centrale mesure 6 mm. On la remplace par une fente trois fois plus étroite, sans rien changer d’autre. Nouvelle largeur, en mm ?
- **Réponse :** 18 mm
- **Valeur à écrire :** 18 (mm) · écart admis 1 %
- **Pièges :** 2 mm · 6 mm · 36 mm · 8 mm
- **Aide :** L = 2λD / a est inversement proportionnelle à a : a divisée par 3 donne L multipliée par 3.

**Tirage 2**

- **Énoncé :** Avec une fente, la tache centrale mesure 12 mm. On la remplace par une fente deux fois plus étroite, sans rien changer d’autre. Nouvelle largeur, en mm ?
- **Réponse :** 24 mm
- **Valeur à écrire :** 24 (mm) · écart admis 1 %
- **Pièges :** 6 mm · 12 mm · 48 mm · 14 mm
- **Aide :** L = 2λD / a est inversement proportionnelle à a : a divisée par 2 donne L multipliée par 2.

**Tirage 3**

- **Énoncé :** Avec une fente, la tache centrale mesure 6 mm. On la remplace par une fente deux fois plus large, sans rien changer d’autre. Nouvelle largeur, en mm ?
- **Réponse :** 3 mm
- **Valeur à écrire :** 3 (mm) · écart admis 1 %
- **Pièges :** 12 mm · 6 mm · 8 mm
- **Aide :** L = 2λD / a est inversement proportionnelle à a : a multipliée par 2 donne L divisée par 2.

#### `diffraction.n2.changer-lambda` — QCM, À écrire

**Tirage 1**

- **Énoncé :** Avec un laser de 400 nm, la tache centrale mesure 8 mm. Même fente, même écran, laser de 600 nm : largeur, en mm ?
- **Réponse :** 12 mm
- **Valeur à écrire :** 12 (mm) · écart admis 1 %
- **Pièges :** 5,3 mm · 8 mm · 10 mm
- **Aide :** L est proportionnelle à λ : × 1,50 → 12 mm.

**Tirage 2**

- **Énoncé :** Avec un laser de 600 nm, la tache centrale mesure 12 mm. Même fente, même écran, laser de 300 nm : largeur, en mm ?
- **Réponse :** 6 mm
- **Valeur à écrire :** 6 (mm) · écart admis 1 %
- **Pièges :** 24 mm · 12 mm · 9 mm
- **Aide :** L est proportionnelle à λ : × 0,500 → 6 mm.

**Tirage 3**

- **Énoncé :** Avec un laser de 600 nm, la tache centrale mesure 12 mm. Même fente, même écran, laser de 300 nm : largeur, en mm ?
- **Réponse :** 6 mm
- **Valeur à écrire :** 6 (mm) · écart admis 1 %
- **Pièges :** 24 mm · 12 mm · 9 mm
- **Aide :** L est proportionnelle à λ : × 0,500 → 6 mm.

#### `diffraction.n2.changer-d` — QCM, Carte retournée

- **Énoncé :** On éloigne l’écran de 1,0 m à 2,0 m, sans toucher à la fente ni au laser. Que deviennent θ et L ?
- **Réponse :** θ ne change pas ; L double
- **Pièges :** θ double ; L double · θ ne change pas ; L ne change pas · θ diminue de moitié ; L ne change pas
- **Aide :** θ = λ / a ne dépend pas de l’écran ; L = 2Dθ est proportionnelle à D.

#### `diffraction.n2.son-porte` — Vrai ou faux

**Tirage 1**

- **Énoncé :** « Un son de 340 Hz (c = 340 m·s⁻¹) traverse une porte de 0,80 m de large : sa diffraction est très marquée. »
- **Attendu :** Vrai
- **Réponse :** Vrai : λ = c / f = 1,0 m, du même ordre que la porte ou plus : diffraction marquée.

**Tirage 2**

- **Énoncé :** « Un son de 3 400 Hz (c = 340 m·s⁻¹) traverse une porte de 0,80 m de large : sa diffraction est très marquée. »
- **Attendu :** Faux
- **Réponse :** Faux : λ = c / f = 10 cm, bien plus petite que la porte : diffraction faible.

**Tirage 3**

- **Énoncé :** « Un son de 3 400 Hz (c = 340 m·s⁻¹) traverse une porte de 0,80 m de large : sa diffraction est négligeable. »
- **Attendu :** Vrai
- **Réponse :** Vrai : λ = c / f = 10 cm, bien plus petite que la porte : diffraction faible.

#### `diffraction.n2.houle` — QCM

- **Énoncé :** Houle de longueur d’onde 20 m devant l’entrée d’un port. Pour quelle largeur d’entrée la diffraction est-elle la plus marquée ?
- **Réponse :** 15 m
- **Pièges :** 200 m · 500 m · 1 km
- **Aide :** Diffraction marquée quand a est du même ordre que λ, ou plus petite.

#### `diffraction.n2.conversion` — QCM, À écrire

**Tirage 1**

- **Énoncé :** λ = 500 nm : combien de mètres ?
- **Réponse :** 5,00 × 10^{-7} m
- **Valeur à écrire :** 5.000000000000001e-7 (m) · écart admis 0.1 %
- **Pièges :** 5,00 × 10^{-4} m · 5,00 × 10^{-1} m · 5,00 × 10^{-10} m
- **Aide :** 1 nm = 10^{-9} m.

**Tirage 2**

- **Énoncé :** λ = 500 nm : combien de mètres ?
- **Réponse :** 5,00 × 10^{-7} m
- **Valeur à écrire :** 5.000000000000001e-7 (m) · écart admis 0.1 %
- **Pièges :** 5,00 × 10^{-4} m · 5,00 × 10^{-1} m · 5,00 × 10^{-10} m
- **Aide :** 1 nm = 10^{-9} m.

**Tirage 3**

- **Énoncé :** λ = 400 nm : combien de mètres ?
- **Réponse :** 4,00 × 10^{-7} m
- **Valeur à écrire :** 4.0000000000000003e-7 (m) · écart admis 0.1 %
- **Pièges :** 4,00 × 10^{-4} m · 4,00 × 10^{-1} m · 4,00 × 10^{-10} m
- **Aide :** 1 nm = 10^{-9} m.

## Niveau 3 · Pièges et type bac, calculatrice permise — 14 cartes

#### `diffraction.n3.cheveu` — À écrire, QCM

**Tirage 1**

- **Énoncé :** Un cheveu est éclairé par un laser de 650 nm ; sur un écran à D = 1,50 m, la tache centrale mesure L = 3,9 cm. Diamètre du cheveu, en µm ?
- **Réponse :** 50 µm
- **Valeur à écrire :** 50 (µm) · écart admis 2 %
- **Pièges :** 25 µm · 100 µm · 0,05 µm
- **Aide :** a = 2λD / L = 2 × 650 × 10^{-9} × 1,50 / (3,9 × 10^{-2}) = 5,0 × 10^{-5} m = 50 µm.

**Tirage 2**

- **Énoncé :** Un cheveu est éclairé par un laser de 650 nm ; sur un écran à D = 1,50 m, la tache centrale mesure L = 1,95 cm. Diamètre du cheveu, en µm ?
- **Réponse :** 100 µm
- **Valeur à écrire :** 100 (µm) · écart admis 2 %
- **Pièges :** 50 µm · 200 µm · 0,1 µm
- **Aide :** a = 2λD / L = 2 × 650 × 10^{-9} × 1,50 / (1,95 × 10^{-2}) = 1,0 × 10^{-4} m = 100 µm.

**Tirage 3**

- **Énoncé :** Un cheveu est éclairé par un laser de 650 nm ; sur un écran à D = 1,50 m, la tache centrale mesure L = 6,5 cm. Diamètre du cheveu, en µm ?
- **Réponse :** 30 µm
- **Valeur à écrire :** 30 (µm) · écart admis 2 %
- **Pièges :** 15 µm · 60 µm · 0,03 µm
- **Aide :** a = 2λD / L = 2 × 650 × 10^{-9} × 1,50 / (6,5 × 10^{-2}) = 3,0 × 10^{-5} m = 30 µm.

#### `diffraction.n3.lambda-laser` — À écrire

**Tirage 1**

- **Énoncé :** Fente de 0,10 mm, écran à D = 2,00 m : la tache centrale mesure L = 2,1 cm. Longueur d’onde du laser, en nm ?
- **Réponse :** 525 nm
- **Valeur à écrire :** 525 (nm) · écart admis 2 %
- **Aide :** λ = a L / (2D) = 1,0 × 10^{-4} × 2,1 × 10^{-2} / (2 × 2) ≈ 525 nm.

**Tirage 2**

- **Énoncé :** Fente de 0,10 mm, écran à D = 2,00 m : la tache centrale mesure L = 2,5 cm. Longueur d’onde du laser, en nm ?
- **Réponse :** 625 nm
- **Valeur à écrire :** 625 (nm) · écart admis 2 %
- **Aide :** λ = a L / (2D) = 1,0 × 10^{-4} × 2,5 × 10^{-2} / (2 × 2) ≈ 625 nm.

**Tirage 3**

- **Énoncé :** Fente de 0,10 mm, écran à D = 2,00 m : la tache centrale mesure L = 2,5 cm. Longueur d’onde du laser, en nm ?
- **Réponse :** 625 nm
- **Valeur à écrire :** 625 (nm) · écart admis 2 %
- **Aide :** λ = a L / (2D) = 1,0 × 10^{-4} × 2,5 × 10^{-2} / (2 × 2) ≈ 625 nm.

#### `diffraction.n3.pente` — À écrire, QCM

**Tirage 1**

- **Énoncé :** On trace θ en fonction de 1/a pour plusieurs fentes : une droite passant par l’origine et par le point (1/a = 1,0 × 10^{4} m⁻¹ ; θ = 6,33 × 10^{-3} rad). Longueur d’onde du laser, en nm ?
- **Réponse :** 633 nm : c’est la pente de la droite
- **Valeur à écrire :** 633 (nm) · écart admis 2 %
- **Pièges :** 1 266 nm · 317 nm · 1,58 × 10^{6} nm
- **Aide :** θ = λ × (1/a) : la pente vaut λ = 6,33 × 10^{-3} / 1,0 × 10^{4} = 6,33 × 10^{-7} m = 633 nm.

**Tirage 2**

- **Énoncé :** On trace θ en fonction de 1/a pour plusieurs fentes : une droite passant par l’origine et par le point (1/a = 1,0 × 10^{4} m⁻¹ ; θ = 6,33 × 10^{-3} rad). Longueur d’onde du laser, en nm ?
- **Réponse :** 633 nm : c’est la pente de la droite
- **Valeur à écrire :** 633 (nm) · écart admis 2 %
- **Pièges :** 1 266 nm · 317 nm · 1,58 × 10^{6} nm
- **Aide :** θ = λ × (1/a) : la pente vaut λ = 6,33 × 10^{-3} / 1,0 × 10^{4} = 6,33 × 10^{-7} m = 633 nm.

**Tirage 3**

- **Énoncé :** On trace θ en fonction de 1/a pour plusieurs fentes : une droite passant par l’origine et par le point (1/a = 2,0 × 10^{4} m⁻¹ ; θ = 1,06 × 10^{-2} rad). Longueur d’onde du laser, en nm ?
- **Réponse :** 532 nm : c’est la pente de la droite
- **Valeur à écrire :** 532 (nm) · écart admis 2 %
- **Pièges :** 1 064 nm · 266 nm · 1,89 × 10^{6} nm
- **Aide :** θ = λ × (1/a) : la pente vaut λ = 1,06 × 10^{-2} / 2,0 × 10^{4} = 5,32 × 10^{-7} m = 532 nm.

#### `diffraction.n3.pente-sens` — QCM, Carte retournée

- **Énoncé :** Pourquoi trace-t-on θ en fonction de 1/a, et non de a, pour exploiter θ = λ / a ?
- **Réponse :** Pour obtenir une droite passant par l’origine, dont la pente est λ
- **Pièges :** Parce que θ augmente avec a · Pour que les points soient plus espacés · Parce que θ en fonction de a est aussi une droite, mais de pente 1/λ
- **Aide :** θ en fonction de a est une hyperbole : on ne lit pas λ dessus. En fonction de 1/a, c’est une fonction linéaire.

#### `diffraction.n3.copie-degres` — QCM, Carte retournée

*Consigne :* Corrige la copie.

- **Énoncé :** Copie d’élève : « θ = λ / a = 633 × 10⁻⁹ / 1,0 × 10⁻⁴ = 6,3 × 10⁻³ °. » Où est l’erreur ?
- **Réponse :** L’unité : θ = λ / a donne un angle en radians, pas en degrés
- **Pièges :** Il fallait calculer a / λ · Il fallait garder λ en nanomètres · Aucune erreur

#### `diffraction.n3.copie-facteur-2` — QCM, Carte retournée

*Consigne :* Corrige la copie.

- **Énoncé :** Copie d’élève : « tan θ ≈ θ = L / D, donc L = λD / a. » Où est l’erreur ?
- **Réponse :** θ se mesure sur une demi-tache : θ = L / (2D), donc L = 2λD / a
- **Pièges :** tan θ ≈ θ n’est pas permis · Il fallait écrire L = λa / D · Aucune erreur
- **Aide :** θ est l’angle entre le centre de la tache et sa première extinction : le côté opposé vaut L / 2.

#### `diffraction.n3.copie-nm` — QCM, Carte retournée

*Consigne :* Corrige la copie.

- **Énoncé :** Copie d’élève : « λ = 600 nm et a = 0,20 mm, donc θ = 600 / 0,20 = 3 000 rad. » Où est l’erreur ?
- **Réponse :** λ et a ne sont pas dans la même unité : θ = 6,00 × 10⁻⁷ / 2,0 × 10⁻⁴ = 3,0 × 10⁻³ rad
- **Pièges :** Il fallait diviser 0,20 par 600 · Il fallait multiplier par 2 · Aucune : 3 000 rad est un angle possible
- **Aide :** Un angle de 3 000 rad n’a aucun sens physique : c’est le signal d’une erreur de conversion.

#### `diffraction.n3.copie-demi-tache` — QCM, Carte retournée

*Consigne :* Corrige la copie.

- **Énoncé :** Copie d’élève : « Je mesure 1,2 cm du centre de la tache centrale à sa première extinction ; c’est L. Donc λ = aL / (2D). » Où est l’erreur ?
- **Réponse :** 1,2 cm est la demi-largeur : L = 2,4 cm, sinon λ est deux fois trop petite
- **Pièges :** Il fallait mesurer jusqu’à la deuxième extinction · La formule est λ = 2aL / D · Aucune erreur
- **Aide :** L se mesure d’une extinction à l’autre, de part et d’autre du centre. Mesurer plusieurs taches réduit l’incertitude.

#### `diffraction.n3.copie-chiffres` — QCM, Carte retournée

*Consigne :* Corrige la copie.

- **Énoncé :** Copie d’élève, données a = 0,10 mm, D = 1,60 m, L = 2,1 cm : « λ = 6,5625 × 10⁻⁷ m. » Qu’en dit le correcteur ?
- **Réponse :** Trop de chiffres significatifs : λ ≈ 6,6 × 10⁻⁷ m
- **Pièges :** C’est parfait · Il faut écrire λ = 7 × 10⁻⁷ nm · Il faut écrire λ = 656,25 nm

#### `diffraction.n3.longueur-onde-change` — Vrai ou faux

- **Énoncé :** « La lumière diffractée par une fente a une longueur d’onde plus grande, puisque la tache s’élargit. »
- **Attendu :** Faux
- **Réponse :** Faux : λ ne change pas. Ce sont les directions de propagation qui s’étalent.

#### `diffraction.n3.blu-ray` — QCM, Carte retournée

- **Énoncé :** Pourquoi un Blu-ray (laser à 405 nm) contient-il plus de données qu’un DVD (laser à 650 nm) ?
- **Réponse :** Plus λ est petite, moins le faisceau focalisé est élargi par la diffraction : la tache lue est plus petite, les données plus serrées
- **Pièges :** Le laser bleu est plus puissant et grave plus profond · Plus λ est petite, plus la diffraction est marquée · La diffraction ne joue aucun rôle dans la lecture optique

#### `diffraction.n3.telescope` — QCM, Carte retournée

- **Énoncé :** Pourquoi construit-on des télescopes à très grand miroir pour distinguer deux étoiles proches ?
- **Réponse :** Plus l’ouverture est grande, plus θ = λ / a est petit : la diffraction brouille moins l’image
- **Pièges :** Plus l’ouverture est petite, moins la lumière est diffractée · Un grand miroir supprime la diffraction · Seulement pour capter plus de lumière : la diffraction ne joue pas
- **Aide :** Capter plus de lumière compte aussi, mais c’est la diffraction qui limite la résolution.

#### `diffraction.n3.petit-angle` — Vrai ou faux

- **Énoncé :** « Avec θ = 5,0 × 10⁻³ rad, on peut écrire tan θ ≈ θ. »
- **Attendu :** Vrai
- **Réponse :** Vrai : θ est très petit devant 1 rad ; tan θ et θ diffèrent de moins de 0,01 %.

#### `diffraction.n3.precision` — QCM, Carte retournée

- **Énoncé :** Pour mesurer λ au mieux avec une fente, quel réglage choisir ?
- **Réponse :** Un écran éloigné et une fente fine : la tache est large, l’incertitude relative sur L petite
- **Pièges :** Un écran très proche, pour que la tache soit nette et petite · Une fente large, pour avoir plus de lumière · Peu importe : L ne dépend que de λ
