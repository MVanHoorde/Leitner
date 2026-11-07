# Audit — Mesure et incertitudes

*Fiche générée depuis `src/js/35-contenu-incertitudes.js` le 31/10/2026 : ne pas la corriger à la main, corriger le paquet puis relancer `node outils/audit-paquet.mjs`.*

> 🔴 **PROPOSITION à valider par Loïc** (choix des cartes, formulations, pièges). Une carte se corrige par son texte,
> jamais par son identifiant (la progression des élèves y est attachée).

## Niveau 1 · Vocabulaire, définitions, formules — 16 cartes

#### `incertitudes.n1.variabilite` — Vrai ou faux

- **Énoncé :** « Quand on répète plusieurs fois la même mesure, avec le même protocole, on obtient toujours exactement la même valeur. »
- **Attendu :** Faux
- **Réponse :** Faux : les valeurs sont dispersées. C’est la variabilité de la mesure.

#### `incertitudes.n1.incertitude-type` — Carte retournée, QCM

- **Énoncé :** Que représente l’incertitude-type u(x) associée au résultat d’une mesure ?
- **Réponse :** L’étendue des valeurs qu’on peut raisonnablement attribuer à la grandeur, sous la forme d’un écart-type
- **Pièges :** L’écart entre la valeur mesurée et la valeur vraie, toujours connu · L’erreur commise par l’élève pendant la manipulation · Le nombre de chiffres significatifs du résultat
- **Aide :** Elle quantifie le doute sur le résultat ; plus elle est petite, plus la mesure est précise.

#### `incertitudes.n1.ecart-type` — Carte retournée, QCM

- **Énoncé :** Que mesure l’écart-type expérimental s d’une série de mesures ?
- **Réponse :** La dispersion des valeurs autour de leur moyenne
- **Pièges :** L’écart entre la moyenne et la valeur de référence · La plus grande valeur moins la plus petite · La valeur la plus fréquente de la série

#### `incertitudes.n1.type-a` — Carte retournée, QCM

- **Énoncé :** Quand parle-t-on d’une évaluation de type A de l’incertitude-type ?
- **Réponse :** Quand on l’évalue par une approche statistique, à partir d’une série de mesures répétées
- **Pièges :** Quand on l’évalue à partir des indications du constructeur de l’instrument · Quand on l’évalue à partir d’une seule lecture sur une graduation · Quand on la calcule à partir d’une formule fournie, à partir d’autres incertitudes

#### `incertitudes.n1.type-b` — Carte retournée, QCM

- **Énoncé :** Quand parle-t-on d’une évaluation de type B de l’incertitude-type ?
- **Réponse :** Quand on l’évalue autrement que par la statistique : notice, tolérance, graduation, mesure unique
- **Pièges :** Quand on calcule l’écart-type d’une série de mesures répétées · Quand on divise l’écart-type par la racine du nombre de mesures · Quand on compare le résultat à une valeur de référence

#### `incertitudes.n1.formule-type-a` — QCM, Carte retournée

- **Énoncé :** Série de n mesures indépendantes, d’écart-type s : incertitude-type sur la moyenne $u(\bar{x})$ ?
- **Réponse :** $u(\bar{x}) = \dfrac{s}{\sqrt{n}}$
- **Pièges :** $u(\bar{x}) = s$ · $u(\bar{x}) = \dfrac{s}{n}$ · $u(\bar{x}) = s \times \sqrt{n}$
- **Aide :** Moyenner beaucoup de mesures réduit l’incertitude sur la moyenne, mais seulement comme √n.

#### `incertitudes.n1.formule-z` — QCM, Carte retournée

- **Énoncé :** Quel quotient sert à comparer un résultat $m_{mes}$ à une valeur de référence $m_{ref}$ ?
- **Réponse :** $z = \dfrac{|m_{mes} - m_{ref}|}{u(m)}$
- **Pièges :** $z = \dfrac{u(m)}{|m_{mes} - m_{ref}|}$ · $z = \dfrac{|m_{mes} - m_{ref}|}{m_{ref}}$ · $z = |m_{mes} - m_{ref}| \times u(m)$
- **Aide :** z compte combien d’incertitudes-types séparent le résultat de la référence.

#### `incertitudes.n1.seuil-z` — Vrai ou faux

- **Énoncé :** « Au lycée, on considère usuellement le résultat compatible avec la valeur de référence quand z ⩽ 2. »
- **Attendu :** Vrai
- **Réponse :** Vrai : au-delà de deux incertitudes-types d’écart, on cherche une cause (protocole, instrument, modèle).

#### `incertitudes.n1.valeur-reference` — Carte retournée, QCM

- **Énoncé :** Qu’est-ce qu’une valeur de référence ?
- **Réponse :** Une valeur admise de la grandeur, issue d’une table ou d’une mesure plus précise, à laquelle on compare son résultat
- **Pièges :** La première valeur mesurée de la série · La moyenne des mesures de la classe · La valeur exacte, toujours connue, de la grandeur

#### `incertitudes.n1.histogramme` — Carte retournée, QCM

- **Énoncé :** Que représente l’histogramme d’une série de mesures ?
- **Réponse :** Le nombre de mesures tombées dans chaque intervalle de valeurs
- **Pièges :** L’évolution de la mesure au cours du temps · La valeur de chaque mesure dans l’ordre où elle a été faite · L’écart de chaque mesure à la valeur de référence
- **Aide :** Sa largeur rend compte de la dispersion ; son centre, de la moyenne.

#### `incertitudes.n1.dispersion` — QCM, Carte retournée

- **Énoncé :** Deux séries de mesures d’une même grandeur ont la même moyenne. Celle dont l’histogramme est le plus étroit…
- **Réponse :** …a le plus petit écart-type : ses valeurs sont moins dispersées
- **Pièges :** …a le plus grand écart-type · …est forcément la plus proche de la valeur de référence · …compte forcément le plus de mesures

#### `incertitudes.n1.composee` — Carte retournée, QCM

- **Énoncé :** Quand parle-t-on d’incertitude-type composée ?
- **Réponse :** Quand la grandeur est calculée à partir d’autres grandeurs, chacune avec sa propre incertitude-type
- **Pièges :** Quand on additionne les incertitudes de type A et de type B d’une même lecture · Quand on mesure plusieurs fois la même grandeur · Quand on arrondit l’incertitude à deux chiffres significatifs
- **Aide :** Au lycée, la formule qui combine les incertitudes est toujours fournie.

#### `incertitudes.n1.monte-carlo` — Carte retournée, QCM

- **Énoncé :** Quel est le principe d’une simulation de Monte-Carlo pour une incertitude composée ?
- **Réponse :** Tirer au hasard un grand nombre de valeurs des grandeurs d’entrée, calculer la grandeur à chaque fois, puis prendre l’écart-type des résultats
- **Pièges :** Refaire la mesure un grand nombre de fois au laboratoire · Calculer la grandeur une seule fois avec les valeurs moyennes · Choisir au hasard la mesure la plus proche de la référence

#### `incertitudes.n1.chiffres-u` — QCM, Carte retournée

- **Énoncé :** Avec combien de chiffres significatifs écrit-on une incertitude-type ?
- **Réponse :** Un ou deux
- **Pièges :** Autant que la calculatrice en donne · Toujours trois · Autant que la valeur mesurée
- **Aide :** Puis on arrondit la valeur au même rang que le dernier chiffre de l’incertitude.

#### `incertitudes.n1.instrument` — Vrai ou faux

- **Énoncé :** « Changer d’instrument ou de protocole peut modifier l’incertitude-type d’une mesure. »
- **Attendu :** Vrai
- **Réponse :** Vrai : une burette plutôt qu’une éprouvette, une lecture mieux placée, réduisent l’incertitude.

#### `incertitudes.n1.independantes` — Vrai ou faux

- **Énoncé :** « Pour évaluer une incertitude de type A, les mesures répétées doivent être indépendantes. »
- **Attendu :** Vrai
- **Réponse :** Vrai : chaque mesure est refaite entièrement, sans se laisser influencer par la précédente.

## Niveau 2 · Situations, calculs de tête — 10 cartes

#### `incertitudes.n2.type-a` — À écrire, QCM

**Tirage 1**

- **Énoncé :** 4 élèves mesurent une période ; l’écart-type de leurs mesures vaut s = 0,4 s. Incertitude-type sur la moyenne $u(\bar{x})$ ?
- **Réponse :** 0,2 s
- **Valeur à écrire :** 0.2 (s)
- **Pièges :** 0,4 s · 0,1 s · 0,8 s
- **Aide :** u = s / √n = 0,4 / √4 = 0,4 / 2 = 0,2 s.

**Tirage 2**

- **Énoncé :** 9 élèves mesurent une masse ; l’écart-type de leurs mesures vaut s = 0,9 g. Incertitude-type sur la moyenne $u(\bar{x})$ ?
- **Réponse :** 0,3 g
- **Valeur à écrire :** 0.3 (g)
- **Pièges :** 0,9 g · 0,1 g · 2,7 g
- **Aide :** u = s / √n = 0,9 / √9 = 0,9 / 3 = 0,3 g.

**Tirage 3**

- **Énoncé :** 9 élèves mesurent un volume équivalent ; l’écart-type de leurs mesures vaut s = 0,6 mL. Incertitude-type sur la moyenne $u(\bar{x})$ ?
- **Réponse :** 0,2 mL
- **Valeur à écrire :** 0.2 (mL)
- **Pièges :** 0,6 mL · 0,0666666667 mL · 1,8 mL
- **Aide :** u = s / √n = 0,6 / √9 = 0,6 / 3 = 0,2 mL.

#### `incertitudes.n2.moyenne` — À écrire, QCM

**Tirage 1**

- **Énoncé :** Mesures de la même grandeur : 24,8 ; 25,1 ; 25,3 ; 24,8. Valeur moyenne ?
- **Réponse :** 25
- **Valeur à écrire :** 25 · écart admis 0.1 %
- **Pièges :** 25,1 · 24,9 · 25,2 · 26
- **Aide :** On regarde les écarts à 25 : −0,2, +0,1, +0,3, −0,2, de somme 0, soit 0 en moyenne.

**Tirage 2**

- **Énoncé :** Mesures de la même grandeur : 9,6 ; 9,9 ; 10,1 ; 9,6. Valeur moyenne ?
- **Réponse :** 9,8
- **Valeur à écrire :** 9.8 · écart admis 0.1 %
- **Pièges :** 9,9 · 9,7 · 10 · 10,8
- **Aide :** On regarde les écarts à 9,8 : −0,2, +0,1, +0,3, −0,2, de somme 0, soit 0 en moyenne.

**Tirage 3**

- **Énoncé :** Mesures de la même grandeur : 9,9 ; 9,7 ; 10,0 ; 10,0. Valeur moyenne ?
- **Réponse :** 9,9
- **Valeur à écrire :** 9.9 · écart admis 0.1 %
- **Pièges :** 10 · 9,8 · 10,1 · 10,8
- **Aide :** On regarde les écarts à 9,8 : +0,1, −0,1, +0,2, +0,2, de somme 0,4, soit 0,1 en moyenne.

#### `incertitudes.n2.z` — À écrire, QCM

**Tirage 1**

- **Énoncé :** Résultat : c = 335 m·s⁻¹, avec u = 5 m·s⁻¹. Référence : 340 m·s⁻¹. Quotient $z = \dfrac{|m_{mes} - m_{ref}|}{u}$ ?
- **Réponse :** 1
- **Valeur à écrire :** 1 · écart admis 1 %
- **Pièges :** 2 · −1 · 1,5
- **Aide :** |335 − 340| = 5 m·s⁻¹, soit 1 fois u. z ⩽ 2 : compatible.

**Tirage 2**

- **Énoncé :** Résultat : c = 0,099 mol·L⁻¹, avec u = 0,002 mol·L⁻¹. Référence : 0,100 mol·L⁻¹. Quotient $z = \dfrac{|m_{mes} - m_{ref}|}{u}$ ?
- **Réponse :** 0,5
- **Valeur à écrire :** 0.5 · écart admis 1 %
- **Pièges :** 1 · 2 · −0,5 · 1,5
- **Aide :** |0,099 − 0,100| = 0,001 mol·L⁻¹, soit 0,5 fois u. z ⩽ 2 : compatible.

**Tirage 3**

- **Énoncé :** Résultat : c = 0,106 mol·L⁻¹, avec u = 0,002 mol·L⁻¹. Référence : 0,100 mol·L⁻¹. Quotient $z = \dfrac{|m_{mes} - m_{ref}|}{u}$ ?
- **Réponse :** 3
- **Valeur à écrire :** 3 · écart admis 1 %
- **Pièges :** 6 · 0,33 · −3 · 4 · 3,5
- **Aide :** |0,106 − 0,100| = 0,006 mol·L⁻¹, soit 3 fois u. z > 2 : non compatible.

#### `incertitudes.n2.compatible` — Vrai ou faux

**Tirage 1**

- **Énoncé :** « Mesure : 9,77 m·s⁻², u = 0,04 m·s⁻² ; référence : 9,81 m·s⁻². Le résultat est compatible avec la référence. »
- **Attendu :** Vrai
- **Réponse :** Vrai : l’écart vaut 0,04 m·s⁻², soit z = 1 ⩽ 2 : compatible.

**Tirage 2**

- **Énoncé :** « Mesure : 9,79 m·s⁻², u = 0,04 m·s⁻² ; référence : 9,81 m·s⁻². Le résultat est non compatible avec la référence. »
- **Attendu :** Faux
- **Réponse :** Faux : l’écart vaut 0,02 m·s⁻², soit z = 0,5 ⩽ 2 : compatible.

**Tirage 3**

- **Énoncé :** « Mesure : 434 Hz, u = 4 Hz ; référence : 440 Hz. Le résultat est compatible avec la référence. »
- **Attendu :** Vrai
- **Réponse :** Vrai : l’écart vaut 6 Hz, soit z = 1,5 ⩽ 2 : compatible.

#### `incertitudes.n2.ecriture` — QCM

**Tirage 1**

- **Énoncé :** La calculatrice affiche 0,15467 mol·L⁻¹, et l’incertitude-type vaut u = 0,002 mol·L⁻¹. Quelle écriture du résultat ?
- **Réponse :** 0,155 mol·L⁻¹, avec u = 0,002 mol·L⁻¹
- **Pièges :** 0,15467 mol·L⁻¹, avec u = 0,002 mol·L⁻¹ · 0,15 mol·L⁻¹, avec u = 0,002 mol·L⁻¹ · 0,1547 mol·L⁻¹, avec u = 0,002 mol·L⁻¹
- **Aide :** La valeur s’arrondit au même rang que le dernier chiffre de u (0,002).

**Tirage 2**

- **Énoncé :** La calculatrice affiche 12,3456 cm, et l’incertitude-type vaut u = 0,03 cm. Quelle écriture du résultat ?
- **Réponse :** 12,35 cm, avec u = 0,03 cm
- **Pièges :** 12,3456 cm, avec u = 0,03 cm · 12,3 cm, avec u = 0,03 cm · 12 cm, avec u = 0,03 cm
- **Aide :** La valeur s’arrondit au même rang que le dernier chiffre de u (0,03).

**Tirage 3**

- **Énoncé :** La calculatrice affiche 1,04738 g·mL⁻¹, et l’incertitude-type vaut u = 0,01 g·mL⁻¹. Quelle écriture du résultat ?
- **Réponse :** 1,05 g·mL⁻¹, avec u = 0,01 g·mL⁻¹
- **Pièges :** 1,04738 g·mL⁻¹, avec u = 0,01 g·mL⁻¹ · 1,047 g·mL⁻¹, avec u = 0,01 g·mL⁻¹ · 1,0 g·mL⁻¹, avec u = 0,01 g·mL⁻¹
- **Aide :** La valeur s’arrondit au même rang que le dernier chiffre de u (0,01).

#### `incertitudes.n2.type-b` — À écrire, QCM

**Tirage 1**

- **Énoncé :** Une pipette jaugée porte la tolérance ± 0,17 mL. Formule fournie : $u = \dfrac{\Delta}{\sqrt{3}}$, avec $\sqrt{3} \approx 1{,}7$. Incertitude-type ?
- **Réponse :** 0,1 mL
- **Valeur à écrire :** 0.1 (mL) · écart admis 5 %
- **Pièges :** 0,17 mL · 0,289 mL · 0,057 mL
- **Aide :** u = 0,17 / 1,7 = 0,1 mL. Mesure unique : c’est une évaluation de type B.

**Tirage 2**

- **Énoncé :** Une fiole jaugée porte la tolérance ± 0,34 mL. Formule fournie : $u = \dfrac{\Delta}{\sqrt{3}}$, avec $\sqrt{3} \approx 1{,}7$. Incertitude-type ?
- **Réponse :** 0,2 mL
- **Valeur à écrire :** 0.2 (mL) · écart admis 5 %
- **Pièges :** 0,34 mL · 0,578 mL · 0,113 mL
- **Aide :** u = 0,34 / 1,7 = 0,2 mL. Mesure unique : c’est une évaluation de type B.

**Tirage 3**

- **Énoncé :** Une burette porte la tolérance ± 0,085 mL. Formule fournie : $u = \dfrac{\Delta}{\sqrt{3}}$, avec $\sqrt{3} \approx 1{,}7$. Incertitude-type ?
- **Réponse :** 0,05 mL
- **Valeur à écrire :** 0.05 (mL) · écart admis 5 %
- **Pièges :** 0,085 mL · 0,145 mL · 0,028 mL
- **Aide :** u = 0,085 / 1,7 = 0,05 mL. Mesure unique : c’est une évaluation de type B.

#### `incertitudes.n2.effet-de-n` — QCM, Carte retournée

**Tirage 1**

- **Énoncé :** On multiplie par 100 le nombre de mesures, sans changer leur dispersion. L’incertitude-type sur la moyenne est…
- **Réponse :** divisée par 10
- **Pièges :** divisée par 100 · multipliée par 10 · inchangée · divisée par 2 · divisée par 3
- **Aide :** u = s / √n : n × 100 donne √n × 10.

**Tirage 2**

- **Énoncé :** On multiplie par 4 le nombre de mesures, sans changer leur dispersion. L’incertitude-type sur la moyenne est…
- **Réponse :** divisée par 2
- **Pièges :** divisée par 4 · multipliée par 2 · inchangée · divisée par 3 · divisée par 10
- **Aide :** u = s / √n : n × 4 donne √n × 2.

**Tirage 3**

- **Énoncé :** On multiplie par 9 le nombre de mesures, sans changer leur dispersion. L’incertitude-type sur la moyenne est…
- **Réponse :** divisée par 3
- **Pièges :** divisée par 9 · multipliée par 3 · inchangée · divisée par 2 · divisée par 10
- **Aide :** u = s / √n : n × 9 donne √n × 3.

#### `incertitudes.n2.relative` — À écrire, QCM

**Tirage 1**

- **Énoncé :** x = 20,0 g, u(x) = 0,2 g. Incertitude-type relative $\dfrac{u(x)}{x}$, en % ?
- **Réponse :** 1 %
- **Valeur à écrire :** 1 (%) · écart admis 1 %
- **Pièges :** 10 % · 0,1 % · 100 %
- **Aide :** 0,2 / 20,0 = 0,01, soit 1 %.

**Tirage 2**

- **Énoncé :** x = 10,0 cm, u(x) = 0,3 cm. Incertitude-type relative $\dfrac{u(x)}{x}$, en % ?
- **Réponse :** 3 %
- **Valeur à écrire :** 3 (%) · écart admis 1 %
- **Pièges :** 30 % · 0,3 % · 33,3 %
- **Aide :** 0,3 / 10,0 = 0,03, soit 3 %.

**Tirage 3**

- **Énoncé :** x = 10,0 cm, u(x) = 0,3 cm. Incertitude-type relative $\dfrac{u(x)}{x}$, en % ?
- **Réponse :** 3 %
- **Valeur à écrire :** 3 (%) · écart admis 1 %
- **Pièges :** 30 % · 0,3 % · 33,3 %
- **Aide :** 0,3 / 10,0 = 0,03, soit 3 %.

#### `incertitudes.n2.quel-type` — QCM, Carte retournée

**Tirage 1**

- **Énoncé :** On utilise la tolérance gravée sur une fiole jaugée. Quelle évaluation de l’incertitude-type ?
- **Réponse :** Type B
- **Pièges :** Type A · Incertitude composée · Aucune : il n’y a pas d’incertitude
- **Aide :** Type A : statistique, sur des mesures répétées. Type B : tout le reste (notice, tolérance, graduation).

**Tirage 2**

- **Énoncé :** On prend la précision indiquée dans la notice d’un multimètre. Quelle évaluation de l’incertitude-type ?
- **Réponse :** Type B
- **Pièges :** Type A · Incertitude composée · Aucune : il n’y a pas d’incertitude
- **Aide :** Type A : statistique, sur des mesures répétées. Type B : tout le reste (notice, tolérance, graduation).

**Tirage 3**

- **Énoncé :** On prend la précision indiquée dans la notice d’un multimètre. Quelle évaluation de l’incertitude-type ?
- **Réponse :** Type B
- **Pièges :** Type A · Incertitude composée · Aucune : il n’y a pas d’incertitude
- **Aide :** Type A : statistique, sur des mesures répétées. Type B : tout le reste (notice, tolérance, graduation).

#### `incertitudes.n2.meilleur-resultat` — QCM, Carte retournée

- **Énoncé :** Deux binômes mesurent la même masse : A trouve 12,4 g avec u = 0,3 g, B trouve 12,5 g avec u = 0,1 g. Lequel a le résultat le plus précis ?
- **Réponse :** B : son incertitude-type est la plus petite
- **Pièges :** A : sa valeur est plus petite · Les deux : les valeurs sont presque égales · On ne peut pas savoir sans la valeur de référence

## Niveau 3 · Pièges et type bac, calculatrice permise — 15 cartes

#### `incertitudes.n3.serie-calculatrice` — À écrire

**Tirage 1**

- **Énoncé :** Mesures répétées, en mL : 24,8 ; 25,1 ; 24,9 ; 25,3 ; 25,0. Incertitude-type sur la moyenne $u(\bar{x}) = \dfrac{s}{\sqrt{n}}$, avec s l’écart-type expérimental (calculatrice) ?
- **Réponse :** u ≈ 0,086 mL (s ≈ 0,192 mL, n = 5)
- **Valeur à écrire :** 0.08602325267042644 (mL) · écart admis 6 %
- **Aide :** Mode statistique de la calculatrice : s = σₙ₋₁ ≈ 0,192, puis u = s / √5 ≈ 0,086.

**Tirage 2**

- **Énoncé :** Mesures répétées, en mL : 24,8 ; 25,1 ; 24,9 ; 25,3 ; 25,0. Incertitude-type sur la moyenne $u(\bar{x}) = \dfrac{s}{\sqrt{n}}$, avec s l’écart-type expérimental (calculatrice) ?
- **Réponse :** u ≈ 0,086 mL (s ≈ 0,192 mL, n = 5)
- **Valeur à écrire :** 0.08602325267042644 (mL) · écart admis 6 %
- **Aide :** Mode statistique de la calculatrice : s = σₙ₋₁ ≈ 0,192, puis u = s / √5 ≈ 0,086.

**Tirage 3**

- **Énoncé :** Mesures répétées, en mL : 24,8 ; 25,1 ; 24,9 ; 25,3 ; 25,0. Incertitude-type sur la moyenne $u(\bar{x}) = \dfrac{s}{\sqrt{n}}$, avec s l’écart-type expérimental (calculatrice) ?
- **Réponse :** u ≈ 0,086 mL (s ≈ 0,192 mL, n = 5)
- **Valeur à écrire :** 0.08602325267042644 (mL) · écart admis 6 %
- **Aide :** Mode statistique de la calculatrice : s = σₙ₋₁ ≈ 0,192, puis u = s / √5 ≈ 0,086.

#### `incertitudes.n3.composee-quotient` — À écrire, QCM

**Tirage 1**

- **Énoncé :** Masse volumique ρ = m / V avec m = 7,85 g (u = 0,01 g) et V = 1,00 mL (u = 0,02 mL). Formule fournie : $\dfrac{u(\rho)}{\rho} = \sqrt{\left(\dfrac{u(m)}{m}\right)^2 + \left(\dfrac{u(V)}{V}\right)^2}$. u(ρ) en g·mL⁻¹ ?
- **Réponse :** u(ρ) ≈ 0,16 g·mL⁻¹ (ρ = 7,850 g·mL⁻¹)
- **Valeur à écrire :** 0.15731814898478816 (g·mL⁻¹) · écart admis 5 %
- **Pièges :** 0,020 g·mL⁻¹ · 0,030 g·mL⁻¹ · 1,7 g·mL⁻¹ · 0,50 g·mL⁻¹
- **Aide :** u(ρ) / ρ ≈ 0,020, à multiplier par ρ = 7,850 g·mL⁻¹. Ne pas oublier ce dernier produit.

**Tirage 2**

- **Énoncé :** Masse volumique ρ = m / V avec m = 52,3 g (u = 0,1 g) et V = 20,0 mL (u = 0,2 mL). Formule fournie : $\dfrac{u(\rho)}{\rho} = \sqrt{\left(\dfrac{u(m)}{m}\right)^2 + \left(\dfrac{u(V)}{V}\right)^2}$. u(ρ) en g·mL⁻¹ ?
- **Réponse :** u(ρ) ≈ 0,027 g·mL⁻¹ (ρ = 2,615 g·mL⁻¹)
- **Valeur à écrire :** 0.026623720626539032 (g·mL⁻¹) · écart admis 5 %
- **Pièges :** 0,010 g·mL⁻¹ · 0,30 g·mL⁻¹ · 0,31 g·mL⁻¹ · 0,50 g·mL⁻¹
- **Aide :** u(ρ) / ρ ≈ 0,010, à multiplier par ρ = 2,615 g·mL⁻¹. Ne pas oublier ce dernier produit.

**Tirage 3**

- **Énoncé :** Masse volumique ρ = m / V avec m = 13,50 g (u = 0,05 g) et V = 5,00 mL (u = 0,05 mL). Formule fournie : $\dfrac{u(\rho)}{\rho} = \sqrt{\left(\dfrac{u(m)}{m}\right)^2 + \left(\dfrac{u(V)}{V}\right)^2}$. u(ρ) en g·mL⁻¹ ?
- **Réponse :** u(ρ) ≈ 0,029 g·mL⁻¹ (ρ = 2,700 g·mL⁻¹)
- **Valeur à écrire :** 0.02879236009777594 (g·mL⁻¹) · écart admis 5 %
- **Pièges :** 0,011 g·mL⁻¹ · 0,10 g·mL⁻¹ · 0,37 g·mL⁻¹ · 1,0 g·mL⁻¹
- **Aide :** u(ρ) / ρ ≈ 0,011, à multiplier par ρ = 2,700 g·mL⁻¹. Ne pas oublier ce dernier produit.

#### `incertitudes.n3.contribution` — QCM, Carte retournée

- **Énoncé :** Masse volumique ρ = m / V : m = 25,00 g avec u(m) = 0,02 g, V = 10,0 mL avec u(V) = 0,1 mL. Quelle mesure faut-il améliorer en priorité ?
- **Réponse :** Le volume : u(V)/V = 1 % contre u(m)/m = 0,08 %
- **Pièges :** La masse : son incertitude est la plus petite · La masse : 0,02 g est plus grand que 0,1 mL en valeur relative · Les deux comptent autant
- **Aide :** On compare les incertitudes relatives : c’est la plus grande qui domine l’incertitude composée.

#### `incertitudes.n3.composee-produit` — À écrire

**Tirage 1**

- **Énoncé :** Puissance P = U × I, avec U = 12,0 V (u = 0,1 V) et I = 1,50 A (u = 0,02 A). Formule fournie : $\dfrac{u(P)}{P} = \sqrt{\left(\dfrac{u(U)}{U}\right)^2 + \left(\dfrac{u(I)}{I}\right)^2}$. u(P) en W ?
- **Réponse :** u(P) ≈ 0,28 W (P = 18,0 W)
- **Valeur à écrire :** 0.28301943396169815 (W) · écart admis 5 %
- **Aide :** u(P) = 18,0 × √((0,1 / 12,0)² + (0,02 / 1,50)²) ≈ 0,28 W.

**Tirage 2**

- **Énoncé :** Puissance P = U × I, avec U = 4,50 V (u = 0,03 V) et I = 0,120 A (u = 0,002 A). Formule fournie : $\dfrac{u(P)}{P} = \sqrt{\left(\dfrac{u(U)}{U}\right)^2 + \left(\dfrac{u(I)}{I}\right)^2}$. u(P) en W ?
- **Réponse :** u(P) ≈ 0,0097 W (P = 0,540 W)
- **Valeur à écrire :** 0.009693296652842109 (W) · écart admis 5 %
- **Aide :** u(P) = 0,540 × √((0,03 / 4,50)² + (0,002 / 0,120)²) ≈ 0,0097 W.

**Tirage 3**

- **Énoncé :** Puissance P = U × I, avec U = 4,50 V (u = 0,03 V) et I = 0,120 A (u = 0,002 A). Formule fournie : $\dfrac{u(P)}{P} = \sqrt{\left(\dfrac{u(U)}{U}\right)^2 + \left(\dfrac{u(I)}{I}\right)^2}$. u(P) en W ?
- **Réponse :** u(P) ≈ 0,0097 W (P = 0,540 W)
- **Valeur à écrire :** 0.009693296652842109 (W) · écart admis 5 %
- **Aide :** u(P) = 0,540 × √((0,03 / 4,50)² + (0,002 / 0,120)²) ≈ 0,0097 W.

#### `incertitudes.n3.conclure-g` — QCM, Carte retournée

**Tirage 1**

- **Énoncé :** Un binôme mesure g = 9,74 m·s⁻² avec u(g) = 0,04 m·s⁻². Référence au lycée : 9,81 m·s⁻². Conclusion ?
- **Réponse :** z ≈ 1,8 ⩽ 2 : résultat compatible avec la référence
- **Pièges :** z ≈ 1,8 > 2 : résultat non compatible, on cherche une cause · z ≈ 0,57 : résultat non compatible · Compatible, puisque l’écart est inférieur à 1 m·s⁻²
- **Aide :** z = |9,74 − 9,81| / 0,04 ≈ 1,8.

**Tirage 2**

- **Énoncé :** Un binôme mesure g = 9,70 m·s⁻² avec u(g) = 0,05 m·s⁻². Référence au lycée : 9,81 m·s⁻². Conclusion ?
- **Réponse :** z ≈ 2,2 > 2 : résultat non compatible, on cherche une cause
- **Pièges :** z ≈ 2,2 ⩽ 2 : résultat compatible avec la référence · z ≈ 0,45 : résultat compatible · Compatible, puisque l’écart est inférieur à 1 m·s⁻²
- **Aide :** z = |9,70 − 9,81| / 0,05 ≈ 2,2.

**Tirage 3**

- **Énoncé :** Un binôme mesure g = 9,65 m·s⁻² avec u(g) = 0,10 m·s⁻². Référence au lycée : 9,81 m·s⁻². Conclusion ?
- **Réponse :** z ≈ 1,6 ⩽ 2 : résultat compatible avec la référence
- **Pièges :** z ≈ 1,6 > 2 : résultat non compatible, on cherche une cause · z ≈ 0,62 : résultat non compatible · Compatible, puisque l’écart est inférieur à 1 m·s⁻²
- **Aide :** z = |9,65 − 9,81| / 0,10 ≈ 1,6.

#### `incertitudes.n3.choisir-ecriture` — QCM, Carte retournée

- **Énoncé :** c = 1,2345 mol·L⁻¹ à la calculatrice, et u(c) = 0,0321 mol·L⁻¹. Quelle écriture est correcte ?
- **Réponse :** c = 1,23 mol·L⁻¹ avec u(c) = 0,03 mol·L⁻¹
- **Pièges :** c = 1,2345 mol·L⁻¹ avec u(c) = 0,0321 mol·L⁻¹ · c = 1,2 mol·L⁻¹ avec u(c) = 0,0321 mol·L⁻¹ · c = 1,23 mol·L⁻¹ avec u(c) = 0,032 1 mol·L⁻¹
- **Aide :** u à un chiffre significatif (0,03), puis la valeur arrondie au centième, comme u.

#### `incertitudes.n3.histogramme-decentre` — QCM, Carte retournée

- **Énoncé :** L’histogramme des mesures de g de la classe est étroit, mais centré sur 9,60 m·s⁻², loin de 9,81 m·s⁻². Que conclure ?
- **Réponse :** Les mesures sont peu dispersées mais pas justes : une cause systématique (protocole, réglage) décale toutes les valeurs
- **Pièges :** Les mesures sont trop dispersées : il faut en faire davantage · Tout va bien : un histogramme étroit garantit un résultat juste · Il suffit de calculer s / √n pour corriger l’écart
- **Aide :** Faire plus de mesures réduit la dispersion de la moyenne, pas un décalage systématique.

#### `incertitudes.n3.s-et-n` — Vrai ou faux

- **Énoncé :** « Plus on fait de mesures, plus l’écart-type expérimental s de la série diminue. »
- **Attendu :** Faux
- **Réponse :** Faux : s reste à peu près le même, il décrit la dispersion des mesures. C’est u = s / √n, l’incertitude sur la moyenne, qui diminue.

#### `incertitudes.n3.monte-carlo-resultat` — QCM, Carte retournée

- **Énoncé :** Une simulation de Monte-Carlo calcule 10 000 fois ρ = m / V à partir de valeurs tirées au hasard. Que prend-on comme incertitude-type u(ρ) ?
- **Réponse :** L’écart-type des 10 000 valeurs de ρ obtenues
- **Pièges :** L’écart-type divisé par √10 000 · La plus grande valeur moins la plus petite · La moyenne des 10 000 valeurs de ρ
- **Aide :** Chaque tirage est un résultat possible : leur dispersion est l’incertitude sur un résultat. On ne divise pas par √N.

#### `incertitudes.n3.copie-s` — QCM, Carte retournée

*Consigne :* Corrige la copie.

- **Énoncé :** Copie d’élève : « 16 mesures de la période, s = 0,08 s. L’incertitude-type sur la moyenne vaut u = 0,08 s. » Où est l’erreur ?
- **Réponse :** Il a pris s au lieu de s / √n : u = 0,08 / 4 = 0,02 s
- **Pièges :** Il fallait diviser par 16 : u = 0,005 s · Il fallait multiplier par √16 : u = 0,32 s · Aucune : pour une série, u = s

#### `incertitudes.n3.copie-chiffres` — QCM, Carte retournée

*Consigne :* Corrige la copie.

- **Énoncé :** Copie d’élève : « λ = 632,8461 nm avec u(λ) = 4,2735 nm. » Qu’en dit le correcteur ?
- **Réponse :** Trop de chiffres : λ = 633 nm avec u(λ) = 4 nm
- **Pièges :** C’est parfait : on garde tous les chiffres de la calculatrice · λ = 632,8 nm avec u(λ) = 4,2735 nm · λ = 600 nm avec u(λ) = 4 nm

#### `incertitudes.n3.copie-u-trop-precise` — QCM, Carte retournée

*Consigne :* Corrige la copie.

- **Énoncé :** Copie d’élève : « L = 12 cm avec u(L) = 0,03 cm. » Où est l’erreur ?
- **Réponse :** La valeur n’est pas arrondie au même rang que l’incertitude : il faut L = 12,00 cm
- **Pièges :** u(L) doit être écrite 0,030 0 cm · Il faut arrondir u(L) à 0 cm · Aucune : 12 cm est plus lisible
- **Aide :** Écrire 12 cm suggère une incertitude de l’ordre du centimètre, cent fois plus grande que u(L).

#### `incertitudes.n3.copie-valeur-absolue` — QCM, Carte retournée

*Consigne :* Corrige la copie.

- **Énoncé :** Copie d’élève : « z = (9,65 − 9,81) / 0,05 = −3,2 ; z < 2 donc le résultat est compatible. » Où est l’erreur ?
- **Réponse :** Il manque la valeur absolue : z = 3,2 > 2, le résultat n’est pas compatible
- **Pièges :** Il fallait diviser par 9,81 et non par 0,05 · Le calcul est juste, mais il fallait comparer à 1 · Aucune : un z négatif est toujours compatible

#### `incertitudes.n3.copie-conclusion` — QCM, Carte retournée

*Consigne :* Corrige la copie.

- **Énoncé :** Copie d’élève : « z = 0,6, ce qui est très petit : la mesure est fausse et non compatible. » Où est l’erreur ?
- **Réponse :** La conclusion est inversée : z = 0,6 ⩽ 2, le résultat est compatible avec la référence
- **Pièges :** z ne peut pas être inférieur à 1 · Il fallait conclure que la mesure est exacte, sans aucune incertitude · Aucune : plus z est petit, moins la mesure est bonne

#### `incertitudes.n3.incertitude-nulle` — Vrai ou faux

- **Énoncé :** « Si toutes mes mesures répétées donnent la même valeur, l’incertitude-type de mon résultat est nulle. »
- **Attendu :** Faux
- **Réponse :** Faux : la statistique ne voit plus rien, mais l’instrument a toujours une incertitude (graduation, notice) : on l’évalue en type B.
