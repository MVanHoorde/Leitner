# Audit — Dosages par étalonnage

*Fiche générée depuis `src/js/35-contenu-dosages.js` le 31/10/2026 : ne pas la corriger à la main, corriger le paquet puis relancer `node outils/audit-paquet.mjs`.*

> 🔴 **PROPOSITION à valider par Loïc** (choix des cartes, formulations, pièges). Une carte se corrige par son texte,
> jamais par son identifiant (la progression des élèves y est attachée).

## Niveau 1 · Vocabulaire, définitions, formules — 17 cartes

#### `dosages.n1.absorbance-unite` — QCM, Carte retournée

- **Énoncé :** Quelle est l’unité de l’absorbance A ?
- **Réponse :** Aucune : l’absorbance est sans unité
- **Pièges :** Le mol·L⁻¹ · Le L·mol⁻¹·cm⁻¹ · Le nanomètre

#### `dosages.n1.beer-lambert` — QCM, Carte retournée

- **Énoncé :** Quelle est l’expression de la loi de Beer-Lambert ?
- **Réponse :** $A = \varepsilon \, \ell \, c$
- **Pièges :** $A = \dfrac{\varepsilon \, c}{\ell}$ · $A = \dfrac{c}{\varepsilon \, \ell}$ · $A = \varepsilon + \ell + c$
- **Aide :** ε coefficient d’absorption molaire (L·mol⁻¹·cm⁻¹), ℓ longueur de cuve traversée (cm), c concentration (mol·L⁻¹).

#### `dosages.n1.couleur` — QCM, Carte retournée

**Tirage 1**

- **Énoncé :** Une solution absorbe surtout le vert. De quelle couleur la voit-on ?
- **Réponse :** magenta (pourpre)
- **Pièges :** jaune-orangé · cyan (bleu-vert) · jaune-vert
- **Aide :** On voit la couleur complémentaire de celle qui est absorbée : elles sont opposées sur le cercle chromatique.

**Tirage 2**

- **Énoncé :** Une solution absorbe surtout le violet. De quelle couleur la voit-on ?
- **Réponse :** jaune-vert
- **Pièges :** jaune-orangé · magenta (pourpre) · cyan (bleu-vert)
- **Aide :** On voit la couleur complémentaire de celle qui est absorbée : elles sont opposées sur le cercle chromatique.

**Tirage 3**

- **Énoncé :** Une solution absorbe surtout le bleu. De quelle couleur la voit-on ?
- **Réponse :** jaune-orangé
- **Pièges :** magenta (pourpre) · cyan (bleu-vert) · jaune-vert
- **Aide :** On voit la couleur complémentaire de celle qui est absorbée : elles sont opposées sur le cercle chromatique.

#### `dosages.n1.lambda-max` — QCM, Carte retournée

- **Énoncé :** Pourquoi règle-t-on le spectrophotomètre sur la longueur d’onde $\lambda_{max}$ du maximum d’absorption ?
- **Réponse :** L’absorbance y est la plus grande : la mesure est la plus sensible et la plus précise
- **Pièges :** C’est la seule longueur d’onde où la loi de Beer-Lambert s’applique · Pour que l’absorbance soit nulle avec le blanc · Parce que la solution y est transparente

#### `dosages.n1.validite-beer-lambert` — QCM, Carte retournée

- **Énoncé :** Dans quelles conditions la loi de Beer-Lambert est-elle valable ?
- **Réponse :** Solutions diluées, lumière monochromatique, absorbance pas trop grande
- **Pièges :** Solutions concentrées, en lumière blanche · Seulement pour les solutions incolores · Pour toute solution, quelle que soit sa concentration

#### `dosages.n1.proportionnalite` — Vrai ou faux

- **Énoncé :** « Dans le domaine de validité de la loi de Beer-Lambert, si la concentration double, l’absorbance double. »
- **Attendu :** Vrai
- **Réponse :** Vrai : A = k × c, l’absorbance est proportionnelle à la concentration.

#### `dosages.n1.une-seule-espece` — Vrai ou faux

- **Énoncé :** « Pour un dosage spectrophotométrique, l’espèce dosée doit être la seule à absorber à la longueur d’onde choisie. »
- **Attendu :** Vrai
- **Réponse :** Vrai : sinon l’absorbance mesurée additionne les contributions de plusieurs espèces.

#### `dosages.n1.conductance` — QCM, Carte retournée

- **Énoncé :** Comment la conductance G d’une portion de solution est-elle liée à sa résistance R ?
- **Réponse :** $G = \dfrac{1}{R}$, en siemens (S)
- **Pièges :** $G = R$, en ohms (Ω) · $G = \dfrac{1}{R}$, en ohms (Ω) · $G = U \times I$, en watts (W)

#### `dosages.n1.conductivite-unite` — QCM, Carte retournée

- **Énoncé :** Quelle est l’unité SI de la conductivité σ ?
- **Réponse :** Le S·m⁻¹
- **Pièges :** Le S · Le S·m²·mol⁻¹ · Le Ω·m

#### `dosages.n1.kohlrausch` — QCM, Carte retournée

- **Énoncé :** Quelle est l’expression de la loi de Kohlrausch ?
- **Réponse :** $\sigma = \sum_i \lambda_i \, [X_i]$
- **Pièges :** $\sigma = \sum_i \dfrac{\lambda_i}{[X_i]}$ · $\sigma = \dfrac{1}{R}$ · $\sigma = \varepsilon \, \ell \, c$
- **Aide :** On somme sur tous les ions de la solution : λ_i est la conductivité ionique molaire de l’ion X_i.

#### `dosages.n1.kohlrausch-unites` — QCM, Carte retournée

- **Énoncé :** Dans $\sigma = \sum \lambda_i [X_i]$, en quelle unité exprimer les concentrations $[X_i]$ ?
- **Réponse :** En mol·m⁻³
- **Pièges :** En mol·L⁻¹ · En g·L⁻¹ · En mmol·m⁻³
- **Aide :** σ en S·m⁻¹ et λ_i en S·m²·mol⁻¹ : il faut des mol·m⁻³. 1 mol·L⁻¹ = 1 000 mol·m⁻³.

#### `dosages.n1.lambda-ionique` — QCM, Carte retournée

- **Énoncé :** Unité de la conductivité ionique molaire $\lambda_i$ ?
- **Réponse :** Le S·m²·mol⁻¹
- **Pièges :** Le S·m⁻¹ · Le S·mol·m⁻³ · Le nanomètre

#### `dosages.n1.validite-kohlrausch` — Vrai ou faux

- **Énoncé :** « La loi de Kohlrausch reste valable pour des solutions très concentrées. »
- **Attendu :** Faux
- **Réponse :** Faux : elle n’est valable que pour des solutions diluées.

#### `dosages.n1.sucre` — Vrai ou faux

- **Énoncé :** « On peut doser une solution de sucre (saccharose) par conductimétrie. »
- **Attendu :** Faux
- **Réponse :** Faux : le saccharose ne libère pas d’ions en solution, il ne conduit pas le courant.

#### `dosages.n1.gamme` — QCM, Carte retournée

- **Énoncé :** Qu’est-ce qu’une gamme d’étalonnage ?
- **Réponse :** Une série de solutions de concentrations connues de l’espèce à doser
- **Pièges :** Une série de mesures répétées sur l’échantillon inconnu · L’ensemble des longueurs d’onde du spectre · Une série de solutions de concentrations inconnues
- **Aide :** On la prépare souvent par dilutions d’une solution mère.

#### `dosages.n1.courbe` — QCM, Carte retournée

- **Énoncé :** Dans le domaine de validité, à quoi ressemble la courbe d’étalonnage A = f(c) ou σ = f(c) ?
- **Réponse :** Une droite qui passe par l’origine
- **Pièges :** Une droite qui ne passe pas par l’origine · Une exponentielle décroissante · Une parabole

#### `dosages.n1.concentration-masse` — QCM, Carte retournée

- **Énoncé :** Quelle relation entre concentration en masse $c_m$, concentration en quantité de matière c et masse molaire M ?
- **Réponse :** $c_m = c \times M$
- **Pièges :** $c_m = \dfrac{c}{M}$ · $c_m = \dfrac{M}{c}$ · $c_m = c + M$
- **Aide :** g·L⁻¹ = mol·L⁻¹ × g·mol⁻¹.

## Niveau 2 · Situations, calculs de tête — 11 cartes

#### `dosages.n2.c-depuis-a` — À écrire, QCM

**Tirage 1**

- **Énoncé :** Étalonnage : A = k × c avec k = 200 L·mol⁻¹. L’échantillon a une absorbance A = 0,20. Concentration, en mmol·L⁻¹ ?
- **Réponse :** 1 mmol·L⁻¹
- **Valeur à écrire :** 1 (mmol·L⁻¹)
- **Pièges :** 40 mmol·L⁻¹ · 0,001 mmol·L⁻¹ · 10 mmol·L⁻¹
- **Aide :** c = A / k = 0,20 / 200 = 0,001 mol·L⁻¹ = 1 mmol·L⁻¹.

**Tirage 2**

- **Énoncé :** Étalonnage : A = k × c avec k = 200 L·mol⁻¹. L’échantillon a une absorbance A = 0,80. Concentration, en mmol·L⁻¹ ?
- **Réponse :** 4 mmol·L⁻¹
- **Valeur à écrire :** 4 (mmol·L⁻¹)
- **Pièges :** 160 mmol·L⁻¹ · 0,004 mmol·L⁻¹ · 40 mmol·L⁻¹
- **Aide :** c = A / k = 0,80 / 200 = 0,004 mol·L⁻¹ = 4 mmol·L⁻¹.

**Tirage 3**

- **Énoncé :** Étalonnage : A = k × c avec k = 100 L·mol⁻¹. L’échantillon a une absorbance A = 0,40. Concentration, en mmol·L⁻¹ ?
- **Réponse :** 4 mmol·L⁻¹
- **Valeur à écrire :** 4 (mmol·L⁻¹)
- **Pièges :** 40 mmol·L⁻¹ · 0,004 mmol·L⁻¹
- **Aide :** c = A / k = 0,40 / 100 = 0,004 mol·L⁻¹ = 4 mmol·L⁻¹.

#### `dosages.n2.a-depuis-c` — À écrire, QCM

**Tirage 1**

- **Énoncé :** A = k × c avec k = 200 L·mol⁻¹. Absorbance d’une solution à 4 mmol·L⁻¹ ?
- **Réponse :** 0,8
- **Valeur à écrire :** 0.8
- **Pièges :** 800 · 8 · 0,08
- **Aide :** 4 mmol·L⁻¹ = 0,004 mol·L⁻¹, donc A = 200 × 0,004 = 0,8, sans unité.

**Tirage 2**

- **Énoncé :** A = k × c avec k = 150 L·mol⁻¹. Absorbance d’une solution à 2 mmol·L⁻¹ ?
- **Réponse :** 0,3
- **Valeur à écrire :** 0.3
- **Pièges :** 300 · 3 · 0,03
- **Aide :** 2 mmol·L⁻¹ = 0,002 mol·L⁻¹, donc A = 150 × 0,002 = 0,3, sans unité.

**Tirage 3**

- **Énoncé :** A = k × c avec k = 250 L·mol⁻¹. Absorbance d’une solution à 4 mmol·L⁻¹ ?
- **Réponse :** 1
- **Valeur à écrire :** 1
- **Pièges :** 1 000 · 10 · 0,1
- **Aide :** 4 mmol·L⁻¹ = 0,004 mol·L⁻¹, donc A = 250 × 0,004 = 1, sans unité.

#### `dosages.n2.epsilon` — À écrire, QCM

**Tirage 1**

- **Énoncé :** ε = 1 000 L·mol⁻¹·cm⁻¹, cuve de ℓ = 1,0 cm, c = 2,0 × 10^{-4} mol·L⁻¹. Absorbance ?
- **Réponse :** 0,2
- **Valeur à écrire :** 0.2
- **Pièges :** 2 · 0,02 · 500
- **Aide :** A = ε ℓ c = 1 000 × 1,0 × 2,0 × 10^{-4} = 0,2.

**Tirage 2**

- **Énoncé :** ε = 1 000 L·mol⁻¹·cm⁻¹, cuve de ℓ = 1,0 cm, c = 2,0 × 10^{-4} mol·L⁻¹. Absorbance ?
- **Réponse :** 0,2
- **Valeur à écrire :** 0.2
- **Pièges :** 2 · 0,02 · 500
- **Aide :** A = ε ℓ c = 1 000 × 1,0 × 2,0 × 10^{-4} = 0,2.

**Tirage 3**

- **Énoncé :** ε = 5 000 L·mol⁻¹·cm⁻¹, cuve de ℓ = 1,0 cm, c = 1,0 × 10^{-4} mol·L⁻¹. Absorbance ?
- **Réponse :** 0,5
- **Valeur à écrire :** 0.5
- **Pièges :** 5 · 0,05 · 5 000
- **Aide :** A = ε ℓ c = 5 000 × 1,0 × 1,0 × 10^{-4} = 0,5.

#### `dosages.n2.lecture-droite` — À écrire, QCM

**Tirage 1**

- **Énoncé :** La droite d’étalonnage passe par l’origine et par le point (c = 4 mmol·L⁻¹ ; A = 0,80). L’échantillon donne A = 0,40. Concentration, en mmol·L⁻¹ ?
- **Réponse :** 2 mmol·L⁻¹
- **Valeur à écrire :** 2 (mmol·L⁻¹)
- **Pièges :** 8 mmol·L⁻¹ · 4 mmol·L⁻¹ · 20 mmol·L⁻¹
- **Aide :** L’absorbance vaut 0,5 fois celle du point de référence : la concentration aussi, 0,5 × 4 = 2 mmol·L⁻¹.

**Tirage 2**

- **Énoncé :** La droite d’étalonnage passe par l’origine et par le point (c = 5 mmol·L⁻¹ ; A = 1,0). L’échantillon donne A = 0,75. Concentration, en mmol·L⁻¹ ?
- **Réponse :** 3,75 mmol·L⁻¹
- **Valeur à écrire :** 3.75 (mmol·L⁻¹)
- **Pièges :** 6,7 mmol·L⁻¹ · 5 mmol·L⁻¹ · 37,5 mmol·L⁻¹
- **Aide :** L’absorbance vaut 0,75 fois celle du point de référence : la concentration aussi, 0,75 × 5 = 3,75 mmol·L⁻¹.

**Tirage 3**

- **Énoncé :** La droite d’étalonnage passe par l’origine et par le point (c = 2 mmol·L⁻¹ ; A = 0,60). L’échantillon donne A = 0,45. Concentration, en mmol·L⁻¹ ?
- **Réponse :** 1,5 mmol·L⁻¹
- **Valeur à écrire :** 1.5 (mmol·L⁻¹)
- **Pièges :** 2,7 mmol·L⁻¹ · 2 mmol·L⁻¹ · 15 mmol·L⁻¹
- **Aide :** L’absorbance vaut 0,75 fois celle du point de référence : la concentration aussi, 0,75 × 2 = 1,5 mmol·L⁻¹.

#### `dosages.n2.dilution` — À écrire, QCM

**Tirage 1**

- **Énoncé :** L’échantillon a été dilué 10 fois avant la mesure ; la courbe d’étalonnage donne 4 mmol·L⁻¹ pour la solution diluée. Concentration de l’échantillon d’origine, en mmol·L⁻¹ ?
- **Réponse :** 40 mmol·L⁻¹
- **Valeur à écrire :** 40 (mmol·L⁻¹)
- **Pièges :** 4 mmol·L⁻¹ · 0,4 mmol·L⁻¹ · 14 mmol·L⁻¹
- **Aide :** L’échantillon est 10 fois plus concentré que la solution mesurée : c = 10 × 4 = 40 mmol·L⁻¹.

**Tirage 2**

- **Énoncé :** L’échantillon a été dilué 20 fois avant la mesure ; la courbe d’étalonnage donne 2 mmol·L⁻¹ pour la solution diluée. Concentration de l’échantillon d’origine, en mmol·L⁻¹ ?
- **Réponse :** 40 mmol·L⁻¹
- **Valeur à écrire :** 40 (mmol·L⁻¹)
- **Pièges :** 2 mmol·L⁻¹ · 0,1 mmol·L⁻¹ · 22 mmol·L⁻¹
- **Aide :** L’échantillon est 20 fois plus concentré que la solution mesurée : c = 20 × 2 = 40 mmol·L⁻¹.

**Tirage 3**

- **Énoncé :** L’échantillon a été dilué 20 fois avant la mesure ; la courbe d’étalonnage donne 2 mmol·L⁻¹ pour la solution diluée. Concentration de l’échantillon d’origine, en mmol·L⁻¹ ?
- **Réponse :** 40 mmol·L⁻¹
- **Valeur à écrire :** 40 (mmol·L⁻¹)
- **Pièges :** 2 mmol·L⁻¹ · 0,1 mmol·L⁻¹ · 22 mmol·L⁻¹
- **Aide :** L’échantillon est 20 fois plus concentré que la solution mesurée : c = 20 × 2 = 40 mmol·L⁻¹.

#### `dosages.n2.conversion` — À écrire, QCM

**Tirage 1**

- **Énoncé :** c = 0,05 mol·L⁻¹. Combien de mol·m⁻³ ?
- **Réponse :** 50 mol·m⁻³
- **Valeur à écrire :** 50 (mol·m⁻³)
- **Pièges :** 5,0 × 10^{-5} mol·m⁻³ · 5 mol·m⁻³ · 50 000 mol·m⁻³
- **Aide :** 1 m³ = 1 000 L : il y a 1 000 fois plus de matière dans un mètre cube que dans un litre. On multiplie par 1 000.

**Tirage 2**

- **Énoncé :** c = 2,5 × 10^{-3} mol·L⁻¹. Combien de mol·m⁻³ ?
- **Réponse :** 2,5 mol·m⁻³
- **Valeur à écrire :** 2.5 (mol·m⁻³)
- **Pièges :** 2,5 × 10^{-6} mol·m⁻³ · 0,25 mol·m⁻³ · 2 500 mol·m⁻³
- **Aide :** 1 m³ = 1 000 L : il y a 1 000 fois plus de matière dans un mètre cube que dans un litre. On multiplie par 1 000.

**Tirage 3**

- **Énoncé :** c = 0,05 mol·L⁻¹. Combien de mol·m⁻³ ?
- **Réponse :** 50 mol·m⁻³
- **Valeur à écrire :** 50 (mol·m⁻³)
- **Pièges :** 5,0 × 10^{-5} mol·m⁻³ · 5 mol·m⁻³ · 50 000 mol·m⁻³
- **Aide :** 1 m³ = 1 000 L : il y a 1 000 fois plus de matière dans un mètre cube que dans un litre. On multiplie par 1 000.

#### `dosages.n2.kohlrausch` — À écrire, QCM

**Tirage 1**

- **Énoncé :** Solution de chlorure de potassium (K⁺ + Cl⁻) à c = 2 mmol·L⁻¹. λ(cation) + λ(anion) = 15 mS·m²·mol⁻¹. Conductivité σ, en mS·m⁻¹ ?
- **Réponse :** 30 mS·m⁻¹
- **Valeur à écrire :** 30 (mS·m⁻¹)
- **Pièges :** 0,03 mS·m⁻¹ · 30 000 mS·m⁻¹ · 3 mS·m⁻¹
- **Aide :** 2 mmol·L⁻¹ = 2 mol·m⁻³. σ = (λ₊ + λ₋) × c = 15 × 2 = 30 mS·m⁻¹.

**Tirage 2**

- **Énoncé :** Solution de chlorure de potassium (K⁺ + Cl⁻) à c = 1 mmol·L⁻¹. λ(cation) + λ(anion) = 15 mS·m²·mol⁻¹. Conductivité σ, en mS·m⁻¹ ?
- **Réponse :** 15 mS·m⁻¹
- **Valeur à écrire :** 15 (mS·m⁻¹)
- **Pièges :** 0,015 mS·m⁻¹ · 15 000 mS·m⁻¹ · 1,5 mS·m⁻¹
- **Aide :** 1 mmol·L⁻¹ = 1 mol·m⁻³. σ = (λ₊ + λ₋) × c = 15 × 1 = 15 mS·m⁻¹.

**Tirage 3**

- **Énoncé :** Solution de chlorure de potassium (K⁺ + Cl⁻) à c = 5 mmol·L⁻¹. λ(cation) + λ(anion) = 15 mS·m²·mol⁻¹. Conductivité σ, en mS·m⁻¹ ?
- **Réponse :** 75 mS·m⁻¹
- **Valeur à écrire :** 75 (mS·m⁻¹)
- **Pièges :** 0,075 mS·m⁻¹ · 75 000 mS·m⁻¹ · 7,5 mS·m⁻¹
- **Aide :** 5 mmol·L⁻¹ = 5 mol·m⁻³. σ = (λ₊ + λ₋) × c = 15 × 5 = 75 mS·m⁻¹.

#### `dosages.n2.sigma-kc` — À écrire, QCM

**Tirage 1**

- **Énoncé :** Droite d’étalonnage : σ = 12 × c (σ en mS·m⁻¹, c en mmol·L⁻¹). On mesure σ = 24 mS·m⁻¹. c = ? (mmol·L⁻¹)
- **Réponse :** 2 mmol·L⁻¹
- **Valeur à écrire :** 2 (mmol·L⁻¹)
- **Pièges :** 288 mmol·L⁻¹ · 20 mmol·L⁻¹ · 12 mmol·L⁻¹
- **Aide :** c = σ / 12 = 24 / 12 = 2 mmol·L⁻¹.

**Tirage 2**

- **Énoncé :** Droite d’étalonnage : σ = 12 × c (σ en mS·m⁻¹, c en mmol·L⁻¹). On mesure σ = 24 mS·m⁻¹. c = ? (mmol·L⁻¹)
- **Réponse :** 2 mmol·L⁻¹
- **Valeur à écrire :** 2 (mmol·L⁻¹)
- **Pièges :** 288 mmol·L⁻¹ · 20 mmol·L⁻¹ · 12 mmol·L⁻¹
- **Aide :** c = σ / 12 = 24 / 12 = 2 mmol·L⁻¹.

**Tirage 3**

- **Énoncé :** Droite d’étalonnage : σ = 12 × c (σ en mS·m⁻¹, c en mmol·L⁻¹). On mesure σ = 30 mS·m⁻¹. c = ? (mmol·L⁻¹)
- **Réponse :** 2,5 mmol·L⁻¹
- **Valeur à écrire :** 2.5 (mmol·L⁻¹)
- **Pièges :** 360 mmol·L⁻¹ · 25 mmol·L⁻¹ · 18 mmol·L⁻¹
- **Aide :** c = σ / 12 = 30 / 12 = 2,5 mmol·L⁻¹.

#### `dosages.n2.conductance` — À écrire, QCM

**Tirage 1**

- **Énoncé :** Le conductimètre mesure une résistance R = 1 000 Ω entre ses électrodes. Conductance G, en mS ?
- **Réponse :** 1 mS
- **Valeur à écrire :** 1 (mS)
- **Pièges :** 1 000 mS · 0,001 mS · 10 mS
- **Aide :** G = 1 / R = 1 / 1 000 = 0,001 S = 1 mS.

**Tirage 2**

- **Énoncé :** Le conductimètre mesure une résistance R = 500 Ω entre ses électrodes. Conductance G, en mS ?
- **Réponse :** 2 mS
- **Valeur à écrire :** 2 (mS)
- **Pièges :** 500 mS · 0,002 mS · 20 mS
- **Aide :** G = 1 / R = 1 / 500 = 0,002 S = 2 mS.

**Tirage 3**

- **Énoncé :** Le conductimètre mesure une résistance R = 200 Ω entre ses électrodes. Conductance G, en mS ?
- **Réponse :** 5 mS
- **Valeur à écrire :** 5 (mS)
- **Pièges :** 200 mS · 0,005 mS · 50 mS
- **Aide :** G = 1 / R = 1 / 200 = 0,005 S = 5 mS.

#### `dosages.n2.concentration-masse` — À écrire, QCM

**Tirage 1**

- **Énoncé :** Le dosage donne c = 0,05 mol·L⁻¹ pour une espèce de masse molaire M = 50 g·mol⁻¹. Concentration en masse, en g·L⁻¹ ?
- **Réponse :** 2,5 g·L⁻¹
- **Valeur à écrire :** 2.5 (g·L⁻¹)
- **Pièges :** 1 000 g·L⁻¹ · 0,001 g·L⁻¹ · 25 g·L⁻¹
- **Aide :** c_m = c × M = 0,05 × 50 = 2,5 g·L⁻¹.

**Tirage 2**

- **Énoncé :** Le dosage donne c = 0,05 mol·L⁻¹ pour une espèce de masse molaire M = 250 g·mol⁻¹. Concentration en masse, en g·L⁻¹ ?
- **Réponse :** 12,5 g·L⁻¹
- **Valeur à écrire :** 12.5 (g·L⁻¹)
- **Pièges :** 5 000 g·L⁻¹ · 0,0002 g·L⁻¹ · 125 g·L⁻¹
- **Aide :** c_m = c × M = 0,05 × 250 = 12,5 g·L⁻¹.

**Tirage 3**

- **Énoncé :** Le dosage donne c = 0,05 mol·L⁻¹ pour une espèce de masse molaire M = 250 g·mol⁻¹. Concentration en masse, en g·L⁻¹ ?
- **Réponse :** 12,5 g·L⁻¹
- **Valeur à écrire :** 12.5 (g·L⁻¹)
- **Pièges :** 5 000 g·L⁻¹ · 0,0002 g·L⁻¹ · 125 g·L⁻¹
- **Aide :** c_m = c × M = 0,05 × 250 = 12,5 g·L⁻¹.

#### `dosages.n2.hors-gamme` — Vrai ou faux

**Tirage 1**

- **Énoncé :** « Les étalons vont de A = 0 à A = 1,2. L’échantillon donne A = 2,1 : il faut le diluer avant de conclure. »
- **Attendu :** Vrai
- **Réponse :** Vrai : son absorbance dépasse la gamme : on dilue l’échantillon (puis on remultiplie par le facteur de dilution).

**Tirage 2**

- **Énoncé :** « Les étalons vont de A = 0 à A = 1,0. L’échantillon donne A = 1,6 : il faut le diluer avant de conclure. »
- **Attendu :** Vrai
- **Réponse :** Vrai : son absorbance dépasse la gamme : on dilue l’échantillon (puis on remultiplie par le facteur de dilution).

**Tirage 3**

- **Énoncé :** « Les étalons vont de A = 0 à A = 1,2. L’échantillon donne A = 2,1 : on peut lire sa concentration sur la droite. »
- **Attendu :** Faux
- **Réponse :** Faux : son absorbance dépasse la gamme : on dilue l’échantillon (puis on remultiplie par le facteur de dilution).

## Niveau 3 · Pièges et type bac, calculatrice permise — 14 cartes

#### `dosages.n3.serum` — À écrire, QCM

**Tirage 1**

- **Énoncé :** Un sérum physiologique (chlorure de sodium, M = 58,5 g·mol⁻¹) est dilué 20 fois. La solution diluée a σ = 94 mS·m⁻¹ ; λ(Na⁺) + λ(Cl⁻) = 12,6 mS·m²·mol⁻¹. Concentration en masse du sérum, en g·L⁻¹ ?
- **Réponse :** 8,7 g·L⁻¹
- **Valeur à écrire :** 8.728571428571428 (g·L⁻¹) · écart admis 3 %
- **Pièges :** 0,44 g·L⁻¹ · 8,7 × 10^{3} g·L⁻¹ · 0,15 g·L⁻¹
- **Aide :** c_dil = σ / (λ₊ + λ₋) = 94 / 12,6 ≈ 7,46 mol·m⁻³ = 0,00746 mol·L⁻¹ ; × 20 pour l’échantillon ; × 58,5 g·mol⁻¹ : ≈ 8,73 g·L⁻¹. L’étiquette annonce 0,9 % (9,0 g·L⁻¹).

**Tirage 2**

- **Énoncé :** Un sérum physiologique (chlorure de sodium, M = 58,5 g·mol⁻¹) est dilué 20 fois. La solution diluée a σ = 96 mS·m⁻¹ ; λ(Na⁺) + λ(Cl⁻) = 12,6 mS·m²·mol⁻¹. Concentration en masse du sérum, en g·L⁻¹ ?
- **Réponse :** 8,9 g·L⁻¹
- **Valeur à écrire :** 8.914285714285713 (g·L⁻¹) · écart admis 3 %
- **Pièges :** 0,45 g·L⁻¹ · 8,9 × 10^{3} g·L⁻¹ · 0,15 g·L⁻¹
- **Aide :** c_dil = σ / (λ₊ + λ₋) = 96 / 12,6 ≈ 7,62 mol·m⁻³ = 0,00762 mol·L⁻¹ ; × 20 pour l’échantillon ; × 58,5 g·mol⁻¹ : ≈ 8,91 g·L⁻¹. L’étiquette annonce 0,9 % (9,0 g·L⁻¹).

**Tirage 3**

- **Énoncé :** Un sérum physiologique (chlorure de sodium, M = 58,5 g·mol⁻¹) est dilué 20 fois. La solution diluée a σ = 96 mS·m⁻¹ ; λ(Na⁺) + λ(Cl⁻) = 12,6 mS·m²·mol⁻¹. Concentration en masse du sérum, en g·L⁻¹ ?
- **Réponse :** 8,9 g·L⁻¹
- **Valeur à écrire :** 8.914285714285713 (g·L⁻¹) · écart admis 3 %
- **Pièges :** 0,45 g·L⁻¹ · 8,9 × 10^{3} g·L⁻¹ · 0,15 g·L⁻¹
- **Aide :** c_dil = σ / (λ₊ + λ₋) = 96 / 12,6 ≈ 7,62 mol·m⁻³ = 0,00762 mol·L⁻¹ ; × 20 pour l’échantillon ; × 58,5 g·mol⁻¹ : ≈ 8,91 g·L⁻¹. L’étiquette annonce 0,9 % (9,0 g·L⁻¹).

#### `dosages.n3.dakin` — À écrire, QCM

**Tirage 1**

- **Énoncé :** Le Dakin contient des ions permanganate $\ce{MnO4^-}$ (apportés par $\ce{KMnO4}$, M = 158 g·mol⁻¹). À 530 nm, l’étalonnage donne A = k × c avec k = 2,3 × 10^{3} L·mol⁻¹ ; le Dakin a A = 0,14. Concentration en masse de $\ce{KMnO4}$, en mg·L⁻¹ ?
- **Réponse :** 9,6 mg·L⁻¹
- **Valeur à écrire :** 9.617391304347828 (mg·L⁻¹) · écart admis 3 %
- **Pièges :** 0,0096 mg·L⁻¹ · 61 mg·L⁻¹ · 5,1 × 10^{4} mg·L⁻¹
- **Aide :** c = A / k = 0,14 / 2,3 × 10^{3} ≈ 6,1 × 10^{-5} mol·L⁻¹ ; c_m = c × M ≈ 9,6 × 10^{-3} g·L⁻¹ = 9,6 mg·L⁻¹.

**Tirage 2**

- **Énoncé :** Le Dakin contient des ions permanganate $\ce{MnO4^-}$ (apportés par $\ce{KMnO4}$, M = 158 g·mol⁻¹). À 530 nm, l’étalonnage donne A = k × c avec k = 2,3 × 10^{3} L·mol⁻¹ ; le Dakin a A = 0,16. Concentration en masse de $\ce{KMnO4}$, en mg·L⁻¹ ?
- **Réponse :** 11 mg·L⁻¹
- **Valeur à écrire :** 10.991304347826087 (mg·L⁻¹) · écart admis 3 %
- **Pièges :** 0,011 mg·L⁻¹ · 70 mg·L⁻¹ · 5,8 × 10^{4} mg·L⁻¹
- **Aide :** c = A / k = 0,16 / 2,3 × 10^{3} ≈ 7,0 × 10^{-5} mol·L⁻¹ ; c_m = c × M ≈ 1,1 × 10^{-2} g·L⁻¹ = 11 mg·L⁻¹.

**Tirage 3**

- **Énoncé :** Le Dakin contient des ions permanganate $\ce{MnO4^-}$ (apportés par $\ce{KMnO4}$, M = 158 g·mol⁻¹). À 530 nm, l’étalonnage donne A = k × c avec k = 2,3 × 10^{3} L·mol⁻¹ ; le Dakin a A = 0,16. Concentration en masse de $\ce{KMnO4}$, en mg·L⁻¹ ?
- **Réponse :** 11 mg·L⁻¹
- **Valeur à écrire :** 10.991304347826087 (mg·L⁻¹) · écart admis 3 %
- **Pièges :** 0,011 mg·L⁻¹ · 70 mg·L⁻¹ · 5,8 × 10^{4} mg·L⁻¹
- **Aide :** c = A / k = 0,16 / 2,3 × 10^{3} ≈ 7,0 × 10^{-5} mol·L⁻¹ ; c_m = c × M ≈ 1,1 × 10^{-2} g·L⁻¹ = 11 mg·L⁻¹.

#### `dosages.n3.ecart-etiquette` — À écrire, QCM

**Tirage 1**

- **Énoncé :** Étiquette : 9,0 g·L⁻¹ de chlorure de sodium. Le dosage donne 9,3 g·L⁻¹. Écart relatif à l’étiquette, en % ?
- **Réponse :** 3,3 %
- **Valeur à écrire :** 3.333333333333341 (%) · écart admis 5 %
- **Pièges :** 0,30 % · 32 % · 33 %
- **Aide :** |9,3 − 9,0| / 9,0 × 100 ≈ 3,3 %.

**Tirage 2**

- **Énoncé :** Étiquette : 9,0 g·L⁻¹ de chlorure de sodium. Le dosage donne 9,5 g·L⁻¹. Écart relatif à l’étiquette, en % ?
- **Réponse :** 5,6 %
- **Valeur à écrire :** 5.555555555555555 (%) · écart admis 5 %
- **Pièges :** 0,50 % · 53 % · 56 %
- **Aide :** |9,5 − 9,0| / 9,0 × 100 ≈ 5,6 %.

**Tirage 3**

- **Énoncé :** Étiquette : 9,0 g·L⁻¹ de chlorure de sodium. Le dosage donne 8,6 g·L⁻¹. Écart relatif à l’étiquette, en % ?
- **Réponse :** 4,4 %
- **Valeur à écrire :** 4.444444444444448 (%) · écart admis 5 %
- **Pièges :** 0,40 % · 47 % · 44 %
- **Aide :** |8,6 − 9,0| / 9,0 × 100 ≈ 4,4 %.

#### `dosages.n3.menthe` — QCM, Carte retournée

- **Énoncé :** Sirop de menthe : tartrazine E102 (jaune, λ_max ≈ 430 nm) et bleu patenté E131 (λ_max ≈ 640 nm). Où mesurer pour doser le bleu patenté ?
- **Réponse :** À 640 nm, où la tartrazine n’absorbe pratiquement pas
- **Pièges :** À 430 nm, où le sirop absorbe le plus · À 530 nm, entre les deux maximums · En lumière blanche, pour voir la couleur verte
- **Aide :** Il faut à la fois une absorbance forte pour E131 et une seule espèce absorbante à cette longueur d’onde.

#### `dosages.n3.eau-minerale` — Vrai ou faux

- **Énoncé :** « La conductivité d’une eau minérale suffit, avec la loi de Kohlrausch, à trouver sa concentration en ions calcium. »
- **Attendu :** Faux
- **Réponse :** Faux : la conductivité additionne la contribution de tous les ions présents ; elle ne distingue pas le calcium des autres.

#### `dosages.n3.blanc` — QCM, Carte retournée

- **Énoncé :** À quoi sert le « blanc » avant les mesures d’absorbance ?
- **Réponse :** À régler A = 0 avec le solvant seul, pour ne mesurer que l’absorption de l’espèce dosée
- **Pièges :** À vérifier que la cuve est propre en mesurant une solution étalon · À choisir la longueur d’onde de travail · À mesurer l’absorbance maximale de l’appareil
- **Aide :** C’est ce qui fait passer la droite d’étalonnage par l’origine.

#### `dosages.n3.grande-absorbance` — Vrai ou faux

- **Énoncé :** « Une absorbance de 2,5 se mesure aussi bien qu’une absorbance de 0,5. »
- **Attendu :** Faux
- **Réponse :** Faux : à A = 2,5, il ne passe que 0,3 % de la lumière ; la mesure est imprécise et la loi de Beer-Lambert n’est souvent plus vérifiée. On dilue.

#### `dosages.n3.copie-kohlrausch` — QCM, Carte retournée

*Consigne :* Corrige la copie.

- **Énoncé :** Copie d’élève : « c = 2,0 × 10⁻³ mol/L, λ(Na⁺) + λ(Cl⁻) = 12,6 × 10⁻³ S·m²·mol⁻¹, σ = 12,6 × 10⁻³ × 2,0 × 10⁻³ = 2,5 × 10⁻⁵ S/m. » Où est l’erreur ?
- **Réponse :** La concentration doit être en mol·m⁻³ : c = 2,0 mol·m⁻³, donc σ ≈ 2,5 × 10⁻² S·m⁻¹
- **Pièges :** Il fallait diviser λ par c · Il fallait additionner λ et c · Aucune : le calcul est juste
- **Aide :** Avec des mol·L⁻¹, le résultat est 1 000 fois trop petit.

#### `dosages.n3.copie-dilution` — QCM, Carte retournée

*Consigne :* Corrige la copie.

- **Énoncé :** Copie d’élève : « J’ai dilué le jus 10 fois. Sur la courbe, je lis c = 2,4 mmol/L. Le jus contient donc 2,4 mmol/L. » Où est l’erreur ?
- **Réponse :** Le facteur de dilution est oublié : le jus contient 10 × 2,4 = 24 mmol/L
- **Pièges :** Il fallait diviser par 10 : 0,24 mmol/L · On ne peut pas lire une concentration sur une courbe d’étalonnage · Aucune : la dilution ne change pas la concentration

#### `dosages.n3.copie-longueur-onde` — QCM, Carte retournée

*Consigne :* Corrige la copie.

- **Énoncé :** Copie d’élève : « La solution de sulfate de cuivre est bleue, je règle donc le spectrophotomètre sur le bleu, vers 450 nm. » Où est l’erreur ?
- **Réponse :** Une solution bleue absorbe surtout dans l’orangé-rouge : on mesure vers 600 à 800 nm
- **Pièges :** Il faut mesurer en lumière blanche · Il faut mesurer dans l’ultraviolet, à 200 nm · Aucune : on mesure toujours à la couleur de la solution
- **Aide :** On voit la couleur qui n’est pas absorbée : à 450 nm, la solution bleue absorbe peu.

#### `dosages.n3.copie-unite-absorbance` — QCM, Carte retournée

*Consigne :* Corrige la copie.

- **Énoncé :** Copie d’élève : « A = k × c = 150 L/mol × 3,0 × 10⁻³ mol/L = 0,45 L/mol. » Où est l’erreur ?
- **Réponse :** L’absorbance est sans unité : A = 0,45
- **Pièges :** Il fallait diviser : A = 0,000 02 · L’absorbance s’exprime en mol/L · Aucune : l’unité vient de k
- **Aide :** L·mol⁻¹ × mol·L⁻¹ : les unités se simplifient.

#### `dosages.n3.copie-extrapolation` — QCM, Carte retournée

*Consigne :* Corrige la copie.

- **Énoncé :** Copie d’élève : « Mes étalons vont jusqu’à A = 1,0. Mon échantillon a A = 1,8 : je prolonge la droite et je lis c = 9,0 mmol/L. » Qu’en dit le correcteur ?
- **Réponse :** On ne prolonge pas la droite hors de la gamme : on dilue l’échantillon pour revenir dans la gamme
- **Pièges :** C’est la bonne méthode : la droite est valable partout · Il faut refaire le blanc avec l’échantillon · Il faut changer de longueur d’onde jusqu’à trouver A = 1,0
- **Aide :** Rien ne garantit que la proportionnalité tienne au-delà du dernier étalon.

#### `dosages.n3.choix-methode` — QCM, Carte retournée

- **Énoncé :** Quelle méthode convient pour doser le glucose d’une boisson incolore ?
- **Réponse :** Aucune des deux telle quelle : le glucose n’est ni coloré ni ionique
- **Pièges :** La conductimétrie, car la boisson conduit le courant · La spectrophotométrie dans le visible, à λ_max · Les deux, au choix
- **Aide :** La spectrophotométrie visible demande une espèce colorée ; la conductimétrie, une espèce ionique. Ici, il faudrait une autre méthode.

#### `dosages.n3.pente` — À écrire, QCM

**Tirage 1**

- **Énoncé :** Un étalon à c = 4,0 × 10^{-4} mol·L⁻¹ donne A = 0,552 (droite passant par l’origine). Coefficient k de A = k × c, en L·mol⁻¹ ?
- **Réponse :** 1,38 × 10^{3} L·mol⁻¹
- **Valeur à écrire :** 1380 (L·mol⁻¹) · écart admis 2 %
- **Pièges :** 7,2 × 10^{-4} L·mol⁻¹ · 2,2 × 10^{-4} L·mol⁻¹ · 1,38 L·mol⁻¹
- **Aide :** k = A / c = 0,552 / 4,0 × 10^{-4} ≈ 1,38 × 10^{3} L·mol⁻¹. En pratique, on le tire de toute la série d’étalons (modélisation), pas d’un seul point.

**Tirage 2**

- **Énoncé :** Un étalon à c = 4,0 × 10^{-4} mol·L⁻¹ donne A = 0,500 (droite passant par l’origine). Coefficient k de A = k × c, en L·mol⁻¹ ?
- **Réponse :** 1,25 × 10^{3} L·mol⁻¹
- **Valeur à écrire :** 1250 (L·mol⁻¹) · écart admis 2 %
- **Pièges :** 8,0 × 10^{-4} L·mol⁻¹ · 2,0 × 10^{-4} L·mol⁻¹ · 1,25 L·mol⁻¹
- **Aide :** k = A / c = 0,500 / 4,0 × 10^{-4} ≈ 1,25 × 10^{3} L·mol⁻¹. En pratique, on le tire de toute la série d’étalons (modélisation), pas d’un seul point.

**Tirage 3**

- **Énoncé :** Un étalon à c = 4,0 × 10^{-4} mol·L⁻¹ donne A = 0,896 (droite passant par l’origine). Coefficient k de A = k × c, en L·mol⁻¹ ?
- **Réponse :** 2,24 × 10^{3} L·mol⁻¹
- **Valeur à écrire :** 2240 (L·mol⁻¹) · écart admis 2 %
- **Pièges :** 4,5 × 10^{-4} L·mol⁻¹ · 3,6 × 10^{-4} L·mol⁻¹ · 2,24 L·mol⁻¹
- **Aide :** k = A / c = 0,896 / 4,0 × 10^{-4} ≈ 2,24 × 10^{3} L·mol⁻¹. En pratique, on le tire de toute la série d’étalons (modélisation), pas d’un seul point.
