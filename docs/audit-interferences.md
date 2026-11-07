# Audit — Interférences

*Fiche générée depuis `src/js/35-contenu-interferences.js` le 31/10/2026 : ne pas la corriger à la main, corriger le paquet puis relancer `node outils/audit-paquet.mjs`.*

> 🔴 **PROPOSITION à valider par Loïc** (choix des cartes, formulations, pièges). Une carte se corrige par son texte,
> jamais par son identifiant (la progression des élèves y est attachée).

## Niveau 1 · Vocabulaire, définitions, formules — 16 cartes

#### `interferences.n1.definition` — Carte retournée, QCM

- **Énoncé :** Qu’appelle-t-on interférences ?
- **Réponse :** La superposition de deux ondes de même fréquence, qui donne des zones où l’amplitude est renforcée et d’autres où elle est atténuée
- **Pièges :** L’étalement d’une onde qui passe par une ouverture étroite · Le décalage de fréquence dû au mouvement de la source · L’affaiblissement d’une onde au cours de sa propagation

#### `interferences.n1.coherence` — QCM, Carte retournée

- **Énoncé :** À quelle condition deux sources peuvent-elles donner des interférences observables ?
- **Réponse :** Elles doivent être cohérentes : même fréquence et déphasage constant
- **Pièges :** Elles doivent avoir la même amplitude, quelle que soit leur fréquence · Elles doivent être placées à moins d’un mètre l’une de l’autre · Elles doivent émettre de la lumière blanche
- **Aide :** En pratique, on éclaire deux trous avec une même source (un laser) : les deux ondes sont alors cohérentes.

#### `interferences.n1.deux-lampes` — Vrai ou faux

- **Énoncé :** « Deux lampes de poche qui éclairent le même mur y donnent des franges d’interférences. »
- **Attendu :** Faux
- **Réponse :** Faux : deux sources indépendantes ne sont pas cohérentes, leur déphasage varie sans cesse. Les franges se brouillent.

#### `interferences.n1.difference-de-marche` — Carte retournée, QCM

- **Énoncé :** Un point M est à la distance d₁ de la source S₁ et d₂ de la source S₂. Comment se définit la différence de marche δ ?
- **Réponse :** $\delta = d_2 - d_1$ : la différence des distances parcourues par les deux ondes
- **Pièges :** $\delta = d_1 + d_2$ · $\delta = \dfrac{d_2}{d_1}$ · $\delta = d_1 \times d_2$

#### `interferences.n1.constructives` — QCM, Carte retournée

- **Énoncé :** Deux sources en phase : condition d’interférences constructives en M ?
- **Réponse :** $\delta = k\lambda$, avec k entier
- **Pièges :** $\delta = \left(k + \frac{1}{2}\right)\lambda$, avec k entier · $\delta = \dfrac{\lambda}{k}$, avec k entier · $\delta = 0$ seulement
- **Aide :** Les deux ondes arrivent en phase : leurs amplitudes s’ajoutent.

#### `interferences.n1.destructives` — QCM, Carte retournée

- **Énoncé :** Deux sources en phase : condition d’interférences destructives en M ?
- **Réponse :** $\delta = \left(k + \frac{1}{2}\right)\lambda$, avec k entier
- **Pièges :** $\delta = k\lambda$, avec k entier · $\delta = 2k\lambda$, avec k entier · $\delta = \dfrac{\lambda}{2k}$, avec k entier
- **Aide :** Les deux ondes arrivent en opposition de phase : elles s’annulent si elles ont la même amplitude.

#### `interferences.n1.amplitude-constructive` — Vrai ou faux

- **Énoncé :** « En un point d’interférences constructives, l’amplitude de l’onde résultante est maximale. »
- **Attendu :** Vrai
- **Réponse :** Vrai : les deux ondes arrivent en phase, leurs élongations s’ajoutent à chaque instant.

#### `interferences.n1.en-phase` — QCM, Carte retournée

- **Énoncé :** On additionne deux signaux sinusoïdaux synchrones de même amplitude A, en phase. Amplitude de la somme ?
- **Réponse :** 2A
- **Pièges :** A · 0 · A / 2 · A²

#### `interferences.n1.opposition` — QCM, Carte retournée

- **Énoncé :** On additionne deux signaux sinusoïdaux synchrones de même amplitude A, en opposition de phase. Amplitude de la somme ?
- **Réponse :** 0 : les deux signaux s’annulent à chaque instant
- **Pièges :** 2A · A · A / 2

#### `interferences.n1.interfrange-definition` — Carte retournée, QCM

- **Énoncé :** Dans une figure d’interférences, qu’appelle-t-on l’interfrange i ?
- **Réponse :** La distance entre les centres de deux franges brillantes consécutives (ou de deux franges sombres consécutives)
- **Pièges :** La largeur de la frange brillante centrale · La distance entre les deux trous d’Young · La distance entre une frange brillante et la frange sombre voisine

#### `interferences.n1.interfrange-formule` — QCM, Carte retournée

- **Énoncé :** Trous d’Young distants de b, écran à la distance D : expression de l’interfrange ?
- **Réponse :** $i = \dfrac{\lambda D}{b}$
- **Pièges :** $i = \dfrac{\lambda b}{D}$ · $i = \dfrac{b D}{\lambda}$ · $i = \dfrac{\lambda}{b D}$
- **Aide :** i augmente avec λ et avec D ; il diminue quand on écarte les trous (b plus grand).

#### `interferences.n1.delta-young` — QCM, Carte retournée

- **Énoncé :** Trous d’Young : quelle expression linéarisée de la différence de marche en un point d’abscisse x de l’écran ?
- **Réponse :** $\delta = \dfrac{b\,x}{D}$
- **Pièges :** $\delta = \dfrac{D\,x}{b}$ · $\delta = \dfrac{\lambda\,x}{D}$ · $\delta = b\,x\,D$
- **Aide :** Cette expression est donnée dans les sujets ; il faut savoir l’exploiter : frange brillante si b x / D = kλ.

#### `interferences.n1.unites` — QCM, Carte retournée

- **Énoncé :** Dans $i = \dfrac{\lambda D}{b}$, en quelles unités exprimer λ, D et b ?
- **Réponse :** Toutes dans la même unité, par exemple en mètres ; i sort alors en mètres
- **Pièges :** λ en nm, D en m, b en mm, i sort en mm · Peu importe : la formule est sans unité · λ en m, D et b en cm

#### `interferences.n1.eau-immobile` — QCM, Carte retournée

- **Énoncé :** Dans une cuve à ondes, deux pointes en phase frappent l’eau. Les points où l’eau reste immobile sont des lieux…
- **Réponse :** …d’interférences destructives
- **Pièges :** …d’interférences constructives · …de diffraction · …où les ondes ne sont pas encore arrivées

#### `interferences.n1.consequences` — QCM

- **Énoncé :** Lequel de ces phénomènes n’est pas une conséquence des interférences ?
- **Réponse :** L’arc-en-ciel, dû à la dispersion de la lumière par les gouttes
- **Pièges :** Les couleurs changeantes d’une bulle de savon · Le silence produit par un casque antibruit · Les irisations d’une flaque d’essence sur la route

#### `interferences.n1.centre` — Vrai ou faux

- **Énoncé :** « Pour deux sources en phase, un point situé à égale distance des deux sources est un lieu d’interférences constructives. »
- **Attendu :** Vrai
- **Réponse :** Vrai : δ = 0 = 0 × λ. C’est la frange brillante centrale des trous d’Young.

## Niveau 2 · Situations, calculs de tête — 11 cartes

#### `interferences.n2.cuve` — QCM

**Tirage 1**

- **Énoncé :** Deux pointes en phase créent des ondes de longueur d’onde λ = 4,0 cm. Un point M est à 6 cm de S₁ et à 20 cm de S₂. Que se passe-t-il en M ?
- **Réponse :** Interférences destructives : δ = 14 cm = 3,5 λ
- **Pièges :** Interférences constructives : δ = 14 cm = 3,5 λ · Ni l’un ni l’autre : δ n’est pas nul · On ne peut pas conclure sans la fréquence
- **Aide :** δ = d₂ − d₁ = 14 cm et δ / λ = 3,5 : un demi-entier, les ondes arrivent en opposition de phase.

**Tirage 2**

- **Énoncé :** Deux pointes en phase créent des ondes de longueur d’onde λ = 2,0 cm. Un point M est à 4 cm de S₁ et à 8 cm de S₂. Que se passe-t-il en M ?
- **Réponse :** Interférences constructives : δ = 4 cm = 2 λ
- **Pièges :** Interférences destructives : δ = 4 cm = 2 λ · Ni l’un ni l’autre : δ n’est pas nul · On ne peut pas conclure sans la fréquence
- **Aide :** δ = d₂ − d₁ = 4 cm et δ / λ = 2 : un nombre entier, les ondes arrivent en phase.

**Tirage 3**

- **Énoncé :** Deux pointes en phase créent des ondes de longueur d’onde λ = 1,0 cm. Un point M est à 10 cm de S₁ et à 11,5 cm de S₂. Que se passe-t-il en M ?
- **Réponse :** Interférences destructives : δ = 1,5 cm = 1,5 λ
- **Pièges :** Interférences constructives : δ = 1,5 cm = 1,5 λ · Ni l’un ni l’autre : δ n’est pas nul · On ne peut pas conclure sans la fréquence
- **Aide :** δ = d₂ − d₁ = 1,5 cm et δ / λ = 1,5 : un demi-entier, les ondes arrivent en opposition de phase.

#### `interferences.n2.haut-parleurs` — Vrai ou faux

**Tirage 1**

- **Énoncé :** « Deux haut-parleurs en phase émettent à 340 Hz (c = 340 m·s⁻¹). Un micro placé à 4 m de l’un et 5,5 m de l’autre capte un maximum d’intensité sonore. »
- **Attendu :** Faux
- **Réponse :** Faux : λ = c / f = 1 m et δ = 1,5 m = 1,5 λ, interférences destructives : un minimum.

**Tirage 2**

- **Énoncé :** « Deux haut-parleurs en phase émettent à 1 700 Hz (c = 340 m·s⁻¹). Un micro placé à 2 m de l’un et 2,6 m de l’autre capte un minimum d’intensité sonore. »
- **Attendu :** Faux
- **Réponse :** Faux : λ = c / f = 0,2 m et δ = 0,6 m = 3 λ, interférences constructives : un maximum.

**Tirage 3**

- **Énoncé :** « Deux haut-parleurs en phase émettent à 1 700 Hz (c = 340 m·s⁻¹). Un micro placé à 2 m de l’un et 2,7 m de l’autre capte un maximum d’intensité sonore. »
- **Attendu :** Faux
- **Réponse :** Faux : λ = c / f = 0,2 m et δ = 0,7 m = 3,5 λ, interférences destructives : un minimum.

#### `interferences.n2.interfrange` — À écrire, QCM

**Tirage 1**

- **Énoncé :** Trous d’Young : λ = 500 nm, b = 0,50 mm, D = 2,0 m. Interfrange i en mm ?
- **Réponse :** 2 mm
- **Valeur à écrire :** 2 (mm)
- **Pièges :** 20 mm · 0,2 mm · 0,125 mm
- **Aide :** i = λD / b = 500 × 10^{-9} × 2 / (0,5 × 10^{-3}) = 2 × 10^{-3} m = 2 mm.

**Tirage 2**

- **Énoncé :** Trous d’Young : λ = 500 nm, b = 0,20 mm, D = 2,0 m. Interfrange i en mm ?
- **Réponse :** 5 mm
- **Valeur à écrire :** 5 (mm)
- **Pièges :** 50 mm · 0,5 mm · 0,05 mm
- **Aide :** i = λD / b = 500 × 10^{-9} × 2 / (0,2 × 10^{-3}) = 5 × 10^{-3} m = 5 mm.

**Tirage 3**

- **Énoncé :** Trous d’Young : λ = 500 nm, b = 0,20 mm, D = 1,0 m. Interfrange i en mm ?
- **Réponse :** 2,5 mm
- **Valeur à écrire :** 2.5 (mm)
- **Pièges :** 25 mm · 0,25 mm · 0,1 mm
- **Aide :** i = λD / b = 500 × 10^{-9} × 1 / (0,2 × 10^{-3}) = 2,5 × 10^{-3} m = 2,5 mm.

#### `interferences.n2.longueur-onde` — À écrire, QCM

**Tirage 1**

- **Énoncé :** Trous d’Young : b = 0,50 mm, D = 1,0 m ; on mesure i = 1 mm. Longueur d’onde en nm ?
- **Réponse :** 500 nm
- **Valeur à écrire :** 500 (nm)
- **Pièges :** 5 000 nm · 50 nm · 500 000 nm
- **Aide :** λ = i b / D = 1 × 10^{-3} × 0,5 × 10^{-3} / 1 = 500 × 10^{-9} m.

**Tirage 2**

- **Énoncé :** Trous d’Young : b = 0,10 mm, D = 1,0 m ; on mesure i = 5 mm. Longueur d’onde en nm ?
- **Réponse :** 500 nm
- **Valeur à écrire :** 500 (nm)
- **Pièges :** 5 000 nm · 50 nm · 500 000 nm
- **Aide :** λ = i b / D = 5 × 10^{-3} × 0,1 × 10^{-3} / 1 = 500 × 10^{-9} m.

**Tirage 3**

- **Énoncé :** Trous d’Young : b = 0,50 mm, D = 2,0 m ; on mesure i = 1,6 mm. Longueur d’onde en nm ?
- **Réponse :** 400 nm
- **Valeur à écrire :** 400 (nm)
- **Pièges :** 4 000 nm · 40 nm · 400 000 nm
- **Aide :** λ = i b / D = 1,6 × 10^{-3} × 0,5 × 10^{-3} / 2 = 400 × 10^{-9} m.

#### `interferences.n2.ecart-trous` — À écrire, QCM

**Tirage 1**

- **Énoncé :** Laser de λ = 500 nm, écran à D = 1,0 m ; l’interfrange vaut i = 5 mm. Écart b entre les trous, en mm ?
- **Réponse :** 0,1 mm
- **Valeur à écrire :** 0.1 (mm)
- **Pièges :** 1 mm · 0,01 mm · 5 mm
- **Aide :** b = λD / i = 500 × 10^{-9} × 1 / (5 × 10^{-3}) = 0,1 × 10^{-3} m.

**Tirage 2**

- **Énoncé :** Laser de λ = 500 nm, écran à D = 1,0 m ; l’interfrange vaut i = 1 mm. Écart b entre les trous, en mm ?
- **Réponse :** 0,5 mm
- **Valeur à écrire :** 0.5 (mm)
- **Pièges :** 5 mm · 0,05 mm · 1 mm
- **Aide :** b = λD / i = 500 × 10^{-9} × 1 / (1 × 10^{-3}) = 0,5 × 10^{-3} m.

**Tirage 3**

- **Énoncé :** Laser de λ = 500 nm, écran à D = 1,0 m ; l’interfrange vaut i = 5 mm. Écart b entre les trous, en mm ?
- **Réponse :** 0,1 mm
- **Valeur à écrire :** 0.1 (mm)
- **Pièges :** 1 mm · 0,01 mm · 5 mm
- **Aide :** b = λD / i = 500 × 10^{-9} × 1 / (5 × 10^{-3}) = 0,1 × 10^{-3} m.

#### `interferences.n2.effet-D` — QCM

**Tirage 1**

- **Énoncé :** Avec des trous d’Young, i = 3 mm. On triple la distance D entre les trous et l’écran. Nouvel interfrange ?
- **Réponse :** 9,0 mm
- **Pièges :** 1 mm · 3 mm · 27 mm
- **Aide :** i = λD / b est proportionnel à D : il est multiplié par 3.

**Tirage 2**

- **Énoncé :** Avec des trous d’Young, i = 3 mm. On double la distance D entre les trous et l’écran. Nouvel interfrange ?
- **Réponse :** 6,0 mm
- **Pièges :** 1,5 mm · 3 mm · 12 mm
- **Aide :** i = λD / b est proportionnel à D : il est multiplié par 2.

**Tirage 3**

- **Énoncé :** Avec des trous d’Young, i = 3 mm. On double la distance D entre les trous et l’écran. Nouvel interfrange ?
- **Réponse :** 6,0 mm
- **Pièges :** 1,5 mm · 3 mm · 12 mm
- **Aide :** i = λD / b est proportionnel à D : il est multiplié par 2.

#### `interferences.n2.effet-b` — QCM

**Tirage 1**

- **Énoncé :** Avec des trous d’Young, i = 1,5 mm. On double l’écart b entre les trous. Nouvel interfrange ?
- **Réponse :** 0,75 mm
- **Pièges :** 3 mm · 1,5 mm · 0,38 mm
- **Aide :** i = λD / b est inversement proportionnel à b : il est divisé par 2.

**Tirage 2**

- **Énoncé :** Avec des trous d’Young, i = 3 mm. On triple l’écart b entre les trous. Nouvel interfrange ?
- **Réponse :** 1 mm
- **Pièges :** 9 mm · 3 mm · 0,33 mm
- **Aide :** i = λD / b est inversement proportionnel à b : il est divisé par 3.

**Tirage 3**

- **Énoncé :** Avec des trous d’Young, i = 3 mm. On double l’écart b entre les trous. Nouvel interfrange ?
- **Réponse :** 1,5 mm
- **Pièges :** 6 mm · 3 mm · 0,75 mm
- **Aide :** i = λD / b est inversement proportionnel à b : il est divisé par 2.

#### `interferences.n2.point-ecran` — QCM

**Tirage 1**

- **Énoncé :** Trous d’Young : λ = 500 nm, b = 0,50 mm, D = 1,0 m. En un point d’abscisse x = 1 mm, avec $\delta = \dfrac{b\,x}{D}$, on observe…
- **Réponse :** une frange brillante : δ = 500 nm = 1 λ
- **Pièges :** une frange sombre : δ = 500 nm = 1 λ · la frange centrale · aucune frange : x est trop grand
- **Aide :** δ = 0,50 × 10^{-3} × 1 × 10^{-3} / 1,0 = 500 × 10^{-9} m ; δ / λ = 1.

**Tirage 2**

- **Énoncé :** Trous d’Young : λ = 500 nm, b = 0,50 mm, D = 1,0 m. En un point d’abscisse x = 3 mm, avec $\delta = \dfrac{b\,x}{D}$, on observe…
- **Réponse :** une frange brillante : δ = 1 500 nm = 3 λ
- **Pièges :** une frange sombre : δ = 1 500 nm = 3 λ · la frange centrale · aucune frange : x est trop grand
- **Aide :** δ = 0,50 × 10^{-3} × 3 × 10^{-3} / 1,0 = 1 500 × 10^{-9} m ; δ / λ = 3.

**Tirage 3**

- **Énoncé :** Trous d’Young : λ = 500 nm, b = 0,50 mm, D = 1,0 m. En un point d’abscisse x = 3 mm, avec $\delta = \dfrac{b\,x}{D}$, on observe…
- **Réponse :** une frange brillante : δ = 1 500 nm = 3 λ
- **Pièges :** une frange sombre : δ = 1 500 nm = 3 λ · la frange centrale · aucune frange : x est trop grand
- **Aide :** δ = 0,50 × 10^{-3} × 3 × 10^{-3} / 1,0 = 1 500 × 10^{-9} m ; δ / λ = 3.

#### `interferences.n2.somme-signaux` — À écrire, QCM

**Tirage 1**

- **Énoncé :** Deux tensions sinusoïdales de même fréquence et de même amplitude 3 V, en opposition de phase. Amplitude de leur somme, en V ?
- **Réponse :** 0 V
- **Valeur à écrire :** 0 (V)
- **Pièges :** 3 V · 6 V · 1,5 V · 9 V
- **Aide :** En opposition de phase, quand l’un vaut +u, l’autre vaut −u : la somme est nulle à chaque instant.

**Tirage 2**

- **Énoncé :** Deux tensions sinusoïdales de même fréquence et de même amplitude 1 V, en phase. Amplitude de leur somme, en V ?
- **Réponse :** 2 V
- **Valeur à écrire :** 2 (V)
- **Pièges :** 1 V · 0 V · 0,5 V
- **Aide :** En phase, les deux signaux montent et descendent ensemble : les amplitudes s’ajoutent.

**Tirage 3**

- **Énoncé :** Deux tensions sinusoïdales de même fréquence et de même amplitude 1 V, en opposition de phase. Amplitude de leur somme, en V ?
- **Réponse :** 0 V
- **Valeur à écrire :** 0 (V)
- **Pièges :** 1 V · 2 V · 0,5 V
- **Aide :** En opposition de phase, quand l’un vaut +u, l’autre vaut −u : la somme est nulle à chaque instant.

#### `interferences.n2.plusieurs-interfranges` — À écrire, QCM

**Tirage 1**

- **Énoncé :** Sur l’écran, 11 franges brillantes successives s’étalent sur 20 mm, du centre de la première au centre de la dernière. Interfrange en mm ?
- **Réponse :** 2 mm
- **Valeur à écrire :** 2 (mm)
- **Pièges :** 1,8 mm · 20 mm · 2,2 mm
- **Aide :** 11 franges brillantes délimitent 10 interfranges : i = 20 / 10 = 2 mm.

**Tirage 2**

- **Énoncé :** Sur l’écran, 6 franges brillantes successives s’étalent sur 12,5 mm, du centre de la première au centre de la dernière. Interfrange en mm ?
- **Réponse :** 2,5 mm
- **Valeur à écrire :** 2.5 (mm)
- **Pièges :** 2,1 mm · 12,5 mm · 3,1 mm
- **Aide :** 6 franges brillantes délimitent 5 interfranges : i = 12,5 / 5 = 2,5 mm.

**Tirage 3**

- **Énoncé :** Sur l’écran, 6 franges brillantes successives s’étalent sur 6 mm, du centre de la première au centre de la dernière. Interfrange en mm ?
- **Réponse :** 1,2 mm
- **Valeur à écrire :** 1.2 (mm)
- **Pièges :** 1,0 mm · 6 mm · 1,5 mm
- **Aide :** 6 franges brillantes délimitent 5 interfranges : i = 6 / 5 = 1,2 mm.

#### `interferences.n2.couleur` — QCM, Carte retournée

- **Énoncé :** On remplace un laser vert (λ = 532 nm) par un laser rouge (λ = 650 nm), sans rien changer d’autre. Les franges…
- **Réponse :** …s’écartent : i est proportionnel à λ
- **Pièges :** …se resserrent : i est inversement proportionnel à λ · …ne bougent pas : seule la couleur change · …disparaissent

## Niveau 3 · Pièges et type bac, calculatrice permise — 14 cartes

#### `interferences.n3.dix-interfranges` — À écrire, QCM

**Tirage 1**

- **Énoncé :** Trous d’Young : b = 0,20 mm, D = 1,50 m. On mesure 52,0 mm pour 10 interfranges. Longueur d’onde du laser, en nm ?
- **Réponse :** 693 nm
- **Valeur à écrire :** 693.3333333333334 (nm) · écart admis 1 %
- **Pièges :** 6,93 × 10^{3} nm · 770 nm · 69,3 nm
- **Aide :** i = 52,0 / 10 = 5,20 mm, puis λ = i b / D = 5,20 × 10^{-3} × 0,20 × 10^{-3} / 1,50 ≈ 693 × 10^{-9} m.

**Tirage 2**

- **Énoncé :** Trous d’Young : b = 0,20 mm, D = 1,50 m. On mesure 52,0 mm pour 10 interfranges. Longueur d’onde du laser, en nm ?
- **Réponse :** 693 nm
- **Valeur à écrire :** 693.3333333333334 (nm) · écart admis 1 %
- **Pièges :** 6,93 × 10^{3} nm · 770 nm · 69,3 nm
- **Aide :** i = 52,0 / 10 = 5,20 mm, puis λ = i b / D = 5,20 × 10^{-3} × 0,20 × 10^{-3} / 1,50 ≈ 693 × 10^{-9} m.

**Tirage 3**

- **Énoncé :** Trous d’Young : b = 0,20 mm, D = 1,50 m. On mesure 47,3 mm pour 10 interfranges. Longueur d’onde du laser, en nm ?
- **Réponse :** 631 nm
- **Valeur à écrire :** 630.6666666666666 (nm) · écart admis 1 %
- **Pièges :** 6,31 × 10^{3} nm · 701 nm · 63,1 nm
- **Aide :** i = 47,3 / 10 = 4,73 mm, puis λ = i b / D = 4,73 × 10^{-3} × 0,20 × 10^{-3} / 1,50 ≈ 631 × 10^{-9} m.

#### `interferences.n3.pourquoi-dix` — QCM, Carte retournée

- **Énoncé :** Pourquoi mesure-t-on la longueur de 10 interfranges plutôt qu’un seul ?
- **Réponse :** Pour diviser l’incertitude relative sur i : l’erreur de lecture de la règle porte sur une longueur dix fois plus grande
- **Pièges :** Parce que la formule i = λD / b est valable seulement pour 10 franges · Pour que la valeur de i soit dix fois plus grande · Parce que la frange centrale est trop large pour être mesurée

#### `interferences.n3.copie-franges` — QCM, Carte retournée

*Consigne :* Corrige la copie.

- **Énoncé :** Copie d’élève : « Je compte 6 franges brillantes sur 12 mm, du centre de la première au centre de la dernière, donc i = 12 / 6 = 2,0 mm. » Où est l’erreur ?
- **Réponse :** 6 franges brillantes ne délimitent que 5 interfranges : i = 12 / 5 = 2,4 mm
- **Pièges :** Il fallait compter les franges sombres · Il fallait multiplier : i = 12 × 6 = 72 mm · Aucune : i = 2,0 mm est juste

#### `interferences.n3.copie-b-D` — QCM, Carte retournée

*Consigne :* Corrige la copie.

- **Énoncé :** Copie d’élève : « λ = 600 nm, b = 0,20 mm, D = 2,0 m. i = λ b / D = 600 × 10⁻⁹ × 0,20 × 10⁻³ / 2,0 = 6,0 × 10⁻¹¹ m. » Où est l’erreur ?
- **Réponse :** b et D sont inversés : i = λD / b = 6,0 × 10⁻³ m, soit 6,0 mm
- **Pièges :** λ devait rester en nm · Il manque un facteur 2 au dénominateur · Aucune : un interfrange est toujours très petit
- **Aide :** Un résultat de 10⁻¹¹ m, plus petit qu’un atome, aurait dû alerter : les franges se mesurent à la règle.

#### `interferences.n3.copie-nature` — QCM, Carte retournée

*Consigne :* Corrige la copie.

- **Énoncé :** Copie d’élève : « λ = 2,0 cm et δ = 3,0 cm. δ est un multiple de λ car 3,0 > 2,0 : les interférences sont constructives. » Où est l’erreur ?
- **Réponse :** δ / λ = 1,5, un demi-entier : les interférences sont destructives
- **Pièges :** δ / λ = 1,5 : c’est un multiple de λ, donc constructives · Il fallait calculer δ × λ · On ne peut pas conclure sans connaître la fréquence

#### `interferences.n3.copie-unites` — QCM, Carte retournée

*Consigne :* Corrige la copie.

- **Énoncé :** Copie d’élève : « λ = 650 nm, D = 1,5 m, b = 0,30 mm. i = 650 × 1,5 / 0,30 = 3 250 m. » Où est l’erreur ?
- **Réponse :** Les unités ne sont pas converties : i = 650 × 10⁻⁹ × 1,5 / (0,30 × 10⁻³) ≈ 3,3 × 10⁻³ m
- **Pièges :** Il fallait écrire i = 3 250 mm · La formule est i = λ b / D · Aucune : le calcul est juste

#### `interferences.n3.lumiere-blanche` — QCM, Carte retournée

- **Énoncé :** Trous d’Young éclairés en lumière blanche : pourquoi la frange centrale est-elle blanche et les autres irisées ?
- **Réponse :** Au centre, δ = 0 est constructif pour toutes les longueurs d’onde ; ailleurs, i dépend de λ et les franges des couleurs se décalent
- **Pièges :** Au centre, la lumière ne passe que par un seul trou · La lumière blanche ne donne pas d’interférences : on voit seulement de la diffraction · Les couleurs sont dues à la réfraction dans les trous

#### `interferences.n3.plus-visible` — QCM

- **Énoncé :** Les franges sont trop serrées pour être mesurées. Quel réglage les écarte ?
- **Réponse :** Prendre des trous plus rapprochés, ou reculer l’écran
- **Pièges :** Prendre des trous plus écartés · Rapprocher l’écran des trous · Prendre un laser bleu à la place du rouge
- **Aide :** i = λD / b : augmenter D ou λ, diminuer b.

#### `interferences.n3.etablir` — QCM, Carte retournée

- **Énoncé :** Pourquoi deux ondes issues de sources en phase arrivent-elles en phase en M quand δ = kλ ?
- **Réponse :** Le retard de l’une sur l’autre vaut δ / c = kT : un nombre entier de périodes
- **Pièges :** Parce qu’elles parcourent alors la même distance · Parce que leurs amplitudes sont égales · Parce que leur retard vaut une demi-période
- **Aide :** Un retard de kT ne change rien à une onde périodique. Un retard de (k + ½)T la met en opposition de phase : δ = (k + ½)λ.

#### `interferences.n3.energie` — Vrai ou faux

- **Énoncé :** « Dans une zone d’interférences destructives, l’énergie de l’onde disparaît : il y a une perte d’énergie. »
- **Attendu :** Faux
- **Réponse :** Faux : l’énergie est redistribuée. Ce qui manque dans les franges sombres se retrouve dans les franges brillantes.

#### `interferences.n3.antibruit` — QCM, Carte retournée

- **Énoncé :** Comment fonctionne un casque antibruit actif ?
- **Réponse :** Il capte le bruit et émet une onde de même fréquence en opposition de phase : interférences destructives à l’oreille
- **Pièges :** Il émet une onde en phase avec le bruit, qui l’absorbe · Il émet un son de fréquence plus élevée qui masque le bruit · Il diffracte le bruit loin de l’oreille

#### `interferences.n3.cuve-calcul` — QCM

**Tirage 1**

- **Énoncé :** Deux pointes en phase vibrent à 15 Hz ; les ondes se propagent à 0,24 m·s⁻¹. Un point M est à 6 cm de S₁ et à 11,6 cm de S₂. En M, les interférences sont…
- **Réponse :** destructives : λ = v / f = 1,6 cm et δ / λ = 3,5
- **Pièges :** constructives : λ = v / f = 1,6 cm et δ / λ = 3,5 · constructives : λ = v × f = 360 cm · impossibles à prévoir : les deux distances sont différentes
- **Aide :** λ = 0,24 / 15 = 0,016 m = 1,6 cm ; δ = 5,6 cm.

**Tirage 2**

- **Énoncé :** Deux pointes en phase vibrent à 20 Hz ; les ondes se propagent à 0,30 m·s⁻¹. Un point M est à 6 cm de S₁ et à 10,5 cm de S₂. En M, les interférences sont…
- **Réponse :** constructives : λ = v / f = 1,5 cm et δ / λ = 3
- **Pièges :** destructives : λ = v / f = 1,5 cm et δ / λ = 3 · destructives : λ = v × f = 600 cm · impossibles à prévoir : les deux distances sont différentes
- **Aide :** λ = 0,30 / 20 = 0,015 m = 1,5 cm ; δ = 4,5 cm.

**Tirage 3**

- **Énoncé :** Deux pointes en phase vibrent à 25 Hz ; les ondes se propagent à 0,30 m·s⁻¹. Un point M est à 7,5 cm de S₁ et à 8,7 cm de S₂. En M, les interférences sont…
- **Réponse :** constructives : λ = v / f = 1,2 cm et δ / λ = 1
- **Pièges :** destructives : λ = v / f = 1,2 cm et δ / λ = 1 · destructives : λ = v × f = 750 cm · impossibles à prévoir : les deux distances sont différentes
- **Aide :** λ = 0,30 / 25 = 0,012 m = 1,2 cm ; δ = 1,2 cm.

#### `interferences.n3.bulle` — QCM, Carte retournée

- **Énoncé :** Pourquoi une bulle de savon se colore-t-elle ?
- **Réponse :** La lumière réfléchie par les deux faces du film interfère ; selon l’épaisseur, certaines longueurs d’onde sont renforcées, d’autres éteintes
- **Pièges :** Le savon contient des colorants qui absorbent certaines couleurs · La bulle diffracte la lumière comme une fente fine · L’effet Doppler décale la couleur quand la bulle bouge

#### `interferences.n3.conditions-programme` — Vrai ou faux

- **Énoncé :** « Les conditions δ = kλ (constructives) et δ = (k + ½)λ (destructives) valent pour deux sources quelconques. »
- **Attendu :** Faux
- **Réponse :** Faux : elles supposent deux sources cohérentes en phase, dans un milieu homogène. Si les sources sont en opposition de phase, les deux conditions s’échangent.
