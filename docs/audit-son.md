# Audit — Intensité et niveau sonores

*Fiche générée depuis `src/js/35-contenu-son.js` le 31/10/2026 : ne pas la corriger à la main, corriger le paquet puis relancer `node outils/audit-paquet.mjs`.*

> 🔴 **PROPOSITION à valider par Loïc** (choix des cartes, formulations, pièges). Une carte se corrige par son texte,
> jamais par son identifiant (la progression des élèves y est attachée).

## Niveau 1 · Vocabulaire, définitions, formules — 16 cartes

#### `son.n1.intensite-definition` — Carte retournée, QCM

- **Énoncé :** Qu’est-ce que l’intensité sonore I ?
- **Réponse :** La puissance sonore reçue par unité de surface
- **Pièges :** La puissance totale émise par la source · La fréquence du son perçu · Le niveau sonore mesuré par un sonomètre, en décibels
- **Aide :** I = P / S, en W·m⁻².

#### `son.n1.unite-intensite` — QCM, Carte retournée

- **Énoncé :** Dans quelle unité s’exprime l’intensité sonore I ?
- **Réponse :** W·m⁻²
- **Pièges :** dB · W · Hz
- **Aide :** Une puissance (W) par unité de surface (m²). Le décibel est l’unité du niveau d’intensité sonore L, pas de I.

#### `son.n1.unite-niveau` — QCM, Carte retournée

- **Énoncé :** Dans quelle unité s’exprime le niveau d’intensité sonore L ?
- **Réponse :** Le décibel (dB)
- **Pièges :** Le watt par mètre carré (W·m⁻²) · Le hertz (Hz) · Le watt (W)

#### `son.n1.formule-niveau` — QCM, Carte retournée

- **Énoncé :** Quelle expression donne le niveau d’intensité sonore L ?
- **Réponse :** $L = 10 \log\left(\dfrac{I}{I_0}\right)$
- **Pièges :** $L = \log\left(\dfrac{I}{I_0}\right)$ · $L = 10 \log\left(\dfrac{I_0}{I}\right)$ · $L = 10 \times \dfrac{I}{I_0}$
- **Aide :** Le facteur 10 transforme les bels en décibels ; log est le logarithme décimal.

#### `son.n1.reciproque` — QCM, Carte retournée

- **Énoncé :** Retrouver l’intensité à partir du niveau : $I = \;$?
- **Réponse :** $I = I_0 \times 10^{L/10}$
- **Pièges :** $I = I_0 \times 10^{10L}$ · $I = 10^{L/10}$ · $I = I_0 \times \dfrac{L}{10}$
- **Aide :** On isole le log : log(I / I₀) = L / 10, puis on prend la réciproque : I / I₀ = 10^{L/10}.

#### `son.n1.i0` — QCM, Carte retournée

- **Énoncé :** Que vaut l’intensité sonore de référence $I_0$ ?
- **Réponse :** $I_0 = 1{,}0 \times 10^{-12}$ W·m⁻², le seuil d’audibilité
- **Pièges :** $I_0 = 1{,}0 \times 10^{12}$ W·m⁻², le seuil de douleur · $I_0 = 1{,}0$ W·m⁻², le seuil de douleur · $I_0 = 0$ W·m⁻², le silence absolu

#### `son.n1.zero-db` — Vrai ou faux

- **Énoncé :** « Un niveau d’intensité sonore de 0 dB correspond à une intensité sonore nulle. »
- **Attendu :** Faux
- **Réponse :** Faux : L = 0 dB quand I = I₀ = 1,0 × 10⁻¹² W·m⁻², le seuil d’audibilité, car log(1) = 0.

#### `son.n1.seuil-douleur` — QCM, Carte retournée

- **Énoncé :** Vers quel niveau d’intensité sonore se situe le seuil de douleur ?
- **Réponse :** Environ 120 dB
- **Pièges :** Environ 0 dB · Environ 60 dB · Environ 1 000 dB
- **Aide :** 120 dB correspond à I ≈ 1 W·m⁻² : mille milliards de fois I₀.

#### `son.n1.log-decimal` — Vrai ou faux

- **Énoncé :** « Dans $L = 10 \log(I / I_0)$, log désigne le logarithme népérien, la touche ln de la calculatrice. »
- **Attendu :** Faux
- **Réponse :** Faux : c’est le logarithme décimal, la touche log. Avec ln, le résultat est faux, sans aucun message d’erreur.

#### `son.n1.rapport-sans-unite` — Vrai ou faux

- **Énoncé :** « Le rapport $I / I_0$ n’a pas d’unité. »
- **Attendu :** Vrai
- **Réponse :** Vrai : deux intensités en W·m⁻² se divisent ; c’est pourquoi on peut en prendre le logarithme.

#### `son.n1.intensites-additives` — QCM, Carte retournée

- **Énoncé :** Deux sources sonores fonctionnent ensemble. Qu’est-ce qui s’additionne ?
- **Réponse :** Les intensités sonores, en W·m⁻²
- **Pièges :** Les niveaux d’intensité sonore, en dB · Les fréquences, en Hz · Les logarithmes des niveaux
- **Aide :** I = I₁ + I₂, puis L = 10 log(I / I₀). Additionner des décibels est faux.

#### `son.n1.attenuation-definition` — QCM, Carte retournée

- **Énoncé :** Comment se définit l’atténuation A entre deux points ?
- **Réponse :** $A = L_1 - L_2$, une différence de niveaux, en dB
- **Pièges :** $A = I_1 - I_2$, en W·m⁻² · $A = \dfrac{L_1}{L_2}$, sans unité · $A = L_1 + L_2$, en dB

#### `son.n1.attenuation-geometrique` — QCM, Carte retournée

- **Énoncé :** D’où vient l’atténuation géométrique d’un son ?
- **Réponse :** La puissance se répartit sur une surface de plus en plus grande en s’éloignant de la source
- **Pièges :** Le milieu absorbe une partie de l’énergie · La fréquence du son diminue avec la distance · La célérité du son diminue avec la distance
- **Aide :** C’est l’absorption qui dissipe l’énergie dans le milieu (mur, laine de verre, air).

#### `son.n1.absorption` — QCM, Carte retournée

- **Énoncé :** Une cloison en laine de roche diminue le niveau sonore d’une pièce à l’autre. Quel type d’atténuation ?
- **Réponse :** Une atténuation par absorption : le matériau absorbe une partie de l’énergie
- **Pièges :** Une atténuation géométrique : la surface de l’onde augmente · Un effet Doppler : la fréquence diminue · Une diffraction : l’onde contourne la cloison

#### `son.n1.source-ponctuelle` — QCM, Carte retournée

- **Énoncé :** Source ponctuelle de puissance P, qui émet dans toutes les directions : intensité à la distance d ?
- **Réponse :** $I = \dfrac{P}{4 \pi d^2}$
- **Pièges :** $I = \dfrac{P}{4 \pi d}$ · $I = P \times 4 \pi d^2$ · $I = \dfrac{P}{\pi d^2}$
- **Aide :** 4πd² est l’aire de la sphère de rayon d sur laquelle la puissance se répartit.

#### `son.n1.niveau-pas-proportionnel` — Vrai ou faux

- **Énoncé :** « Le niveau d’intensité sonore est proportionnel à l’intensité sonore. »
- **Attendu :** Faux
- **Réponse :** Faux : L dépend du logarithme de I. Multiplier I par 10 ajoute 10 dB, il ne multiplie pas L par 10.

## Niveau 2 · Situations, calculs de tête — 11 cartes

#### `son.n2.niveau-depuis-intensite` — À écrire, QCM

**Tirage 1**

- **Énoncé :** Un micro reçoit une intensité sonore I = 10^{-3} W·m⁻². I₀ = 10^{-12} W·m⁻². Niveau d’intensité sonore L ?
- **Réponse :** 90 dB
- **Valeur à écrire :** 90 (dB)
- **Pièges :** 9 dB · 30 dB · −30 dB · 150 dB
- **Aide :** I / I₀ = 10^{-3} / 10^{-12} = 10^{9}, donc L = 10 × 9 = 90 dB.

**Tirage 2**

- **Énoncé :** Un micro reçoit une intensité sonore I = 10^{-5} W·m⁻². I₀ = 10^{-12} W·m⁻². Niveau d’intensité sonore L ?
- **Réponse :** 70 dB
- **Valeur à écrire :** 70 (dB)
- **Pièges :** 7 dB · 50 dB · −50 dB · 170 dB
- **Aide :** I / I₀ = 10^{-5} / 10^{-12} = 10^{7}, donc L = 10 × 7 = 70 dB.

**Tirage 3**

- **Énoncé :** Un micro reçoit une intensité sonore I = 10^{-3} W·m⁻². I₀ = 10^{-12} W·m⁻². Niveau d’intensité sonore L ?
- **Réponse :** 90 dB
- **Valeur à écrire :** 90 (dB)
- **Pièges :** 9 dB · 30 dB · −30 dB · 150 dB
- **Aide :** I / I₀ = 10^{-3} / 10^{-12} = 10^{9}, donc L = 10 × 9 = 90 dB.

#### `son.n2.intensite-depuis-niveau` — À écrire, QCM

**Tirage 1**

- **Énoncé :** Un sonomètre affiche L = 50 dB. I₀ = 10^{-12} W·m⁻². Intensité sonore I, en W·m⁻² ?
- **Réponse :** 10^{-7} W·m⁻²
- **Valeur à écrire :** 1e-7 (W·m⁻²)
- **Pièges :** 10^{7} W·m⁻² · 10^{5} W·m⁻² · 10^{-8} W·m⁻² · 5 W·m⁻²
- **Aide :** I = I₀ × 10^{L/10} = 10^{-12} × 10^{5} = 10^{-7} W·m⁻².

**Tirage 2**

- **Énoncé :** Un sonomètre affiche L = 40 dB. I₀ = 10^{-12} W·m⁻². Intensité sonore I, en W·m⁻² ?
- **Réponse :** 10^{-8} W·m⁻²
- **Valeur à écrire :** 1e-8 (W·m⁻²)
- **Pièges :** 10^{8} W·m⁻² · 10^{4} W·m⁻² · 10^{-9} W·m⁻² · 4 W·m⁻²
- **Aide :** I = I₀ × 10^{L/10} = 10^{-12} × 10^{4} = 10^{-8} W·m⁻².

**Tirage 3**

- **Énoncé :** Un sonomètre affiche L = 110 dB. I₀ = 10^{-12} W·m⁻². Intensité sonore I, en W·m⁻² ?
- **Réponse :** 10^{-1} W·m⁻²
- **Valeur à écrire :** 0.1 (W·m⁻²)
- **Pièges :** 10^{1} W·m⁻² · 10^{11} W·m⁻² · 10^{-2} W·m⁻² · 11 W·m⁻²
- **Aide :** I = I₀ × 10^{L/10} = 10^{-12} × 10^{11} = 10^{-1} W·m⁻².

#### `son.n2.deux-sources` — À écrire, QCM

**Tirage 1**

- **Énoncé :** Une machine seule produit 90 dB à l’endroit où se trouve l’ouvrier. On allume une deuxième machine identique. Niveau total ?
- **Réponse :** 93 dB
- **Valeur à écrire :** 93 (dB)
- **Pièges :** 180 dB · 90 dB · 100 dB · 96 dB
- **Aide :** L’intensité double : L = 10 log(2I / I₀) = 10 log 2 + 10 log(I / I₀) ≈ 3 + L₁. Doubler l’intensité ajoute 3 dB.

**Tirage 2**

- **Énoncé :** Une machine seule produit 70 dB à l’endroit où se trouve l’ouvrier. On allume une deuxième machine identique. Niveau total ?
- **Réponse :** 73 dB
- **Valeur à écrire :** 73 (dB)
- **Pièges :** 140 dB · 70 dB · 80 dB · 76 dB
- **Aide :** L’intensité double : L = 10 log(2I / I₀) = 10 log 2 + 10 log(I / I₀) ≈ 3 + L₁. Doubler l’intensité ajoute 3 dB.

**Tirage 3**

- **Énoncé :** Une machine seule produit 80 dB à l’endroit où se trouve l’ouvrier. On allume une deuxième machine identique. Niveau total ?
- **Réponse :** 83 dB
- **Valeur à écrire :** 83 (dB)
- **Pièges :** 160 dB · 80 dB · 90 dB · 86 dB
- **Aide :** L’intensité double : L = 10 log(2I / I₀) = 10 log 2 + 10 log(I / I₀) ≈ 3 + L₁. Doubler l’intensité ajoute 3 dB.

#### `son.n2.dix-sources` — À écrire, QCM

**Tirage 1**

- **Énoncé :** Un élève qui parle produit 50 dB au fond de la salle. 1 000 élèves parlent en même temps, chacun au même niveau. Niveau total ?
- **Réponse :** 80 dB
- **Valeur à écrire :** 80 (dB)
- **Pièges :** 50 000 dB · 1050 dB · 53 dB · 50 dB
- **Aide :** L’intensité est multipliée par 1 000 = 10^{3} : on ajoute 10 × 3 = 30 dB.

**Tirage 2**

- **Énoncé :** Un élève qui parle produit 70 dB au fond de la salle. 10 élèves parlent en même temps, chacun au même niveau. Niveau total ?
- **Réponse :** 80 dB
- **Valeur à écrire :** 80 (dB)
- **Pièges :** 700 dB · 71 dB · 70 dB
- **Aide :** L’intensité est multipliée par 10 = 10^{1} : on ajoute 10 × 1 = 10 dB.

**Tirage 3**

- **Énoncé :** Un élève qui parle produit 50 dB au fond de la salle. 100 élèves parlent en même temps, chacun au même niveau. Niveau total ?
- **Réponse :** 70 dB
- **Valeur à écrire :** 70 (dB)
- **Pièges :** 5 000 dB · 150 dB · 52 dB · 50 dB
- **Aide :** L’intensité est multipliée par 100 = 10^{2} : on ajoute 10 × 2 = 20 dB.

#### `son.n2.combien-sources` — À écrire, QCM

**Tirage 1**

- **Énoncé :** Une enceinte produit 70 dB. Combien d’enceintes identiques faut-il, ensemble, pour atteindre 80 dB ?
- **Réponse :** 10 enceintes
- **Valeur à écrire :** 10
- **Pièges :** 11 enceintes · 100 enceintes · 20 enceintes
- **Aide :** +10 dB : l’intensité est multipliée par 10^{1} = 10, il faut 10 enceintes.

**Tirage 2**

- **Énoncé :** Une enceinte produit 60 dB. Combien d’enceintes identiques faut-il, ensemble, pour atteindre 80 dB ?
- **Réponse :** 100 enceintes
- **Valeur à écrire :** 100
- **Pièges :** 20 enceintes · 101 enceintes · 1000 enceintes · 200 enceintes
- **Aide :** +20 dB : l’intensité est multipliée par 10^{2} = 100, il faut 100 enceintes.

**Tirage 3**

- **Énoncé :** Une enceinte produit 80 dB. Combien d’enceintes identiques faut-il, ensemble, pour atteindre 100 dB ?
- **Réponse :** 100 enceintes
- **Valeur à écrire :** 100
- **Pièges :** 20 enceintes · 101 enceintes · 1000 enceintes · 200 enceintes
- **Aide :** +20 dB : l’intensité est multipliée par 10^{2} = 100, il faut 100 enceintes.

#### `son.n2.facteur-intensite` — À écrire, QCM

**Tirage 1**

- **Énoncé :** Le niveau d’intensité sonore passe de 40 dB à 80 dB. Par combien l’intensité sonore est-elle multipliée ?
- **Réponse :** Par 10 000
- **Valeur à écrire :** 10000
- **Pièges :** Par 40 · Par 4 · Par 2,0 · Par 100 000
- **Aide :** +40 dB = 4 × 10 dB : l’intensité est multipliée par 10^{4} = 10 000.

**Tirage 2**

- **Énoncé :** Le niveau d’intensité sonore passe de 50 dB à 90 dB. Par combien l’intensité sonore est-elle multipliée ?
- **Réponse :** Par 10 000
- **Valeur à écrire :** 10000
- **Pièges :** Par 40 · Par 4 · Par 1,8 · Par 100 000
- **Aide :** +40 dB = 4 × 10 dB : l’intensité est multipliée par 10^{4} = 10 000.

**Tirage 3**

- **Énoncé :** Le niveau d’intensité sonore passe de 60 dB à 100 dB. Par combien l’intensité sonore est-elle multipliée ?
- **Réponse :** Par 10 000
- **Valeur à écrire :** 10000
- **Pièges :** Par 40 · Par 4 · Par 1,7 · Par 100 000
- **Aide :** +40 dB = 4 × 10 dB : l’intensité est multipliée par 10^{4} = 10 000.

#### `son.n2.distance` — À écrire, QCM

**Tirage 1**

- **Énoncé :** À 2 m d’une source ponctuelle, L = 100 dB. Sans absorption, quel niveau à 20 m ?
- **Réponse :** 80 dB
- **Valeur à écrire :** 80 (dB)
- **Pièges :** 10 dB · 97 dB · 90 dB
- **Aide :** I = P / (4πd²) : distance × 10, intensité divisée par 100. Diviser par 100 = 10^{2} : −20 dB.

**Tirage 2**

- **Énoncé :** À 5 m d’une source ponctuelle, L = 80 dB. Sans absorption, quel niveau à 50 m ?
- **Réponse :** 60 dB
- **Valeur à écrire :** 60 (dB)
- **Pièges :** 8 dB · 77 dB · 70 dB
- **Aide :** I = P / (4πd²) : distance × 10, intensité divisée par 100. Diviser par 100 = 10^{2} : −20 dB.

**Tirage 3**

- **Énoncé :** À 2 m d’une source ponctuelle, L = 100 dB. Sans absorption, quel niveau à 4 m ?
- **Réponse :** 94 dB
- **Valeur à écrire :** 94 (dB)
- **Pièges :** 50 dB · 97 dB · 98 dB · 90 dB
- **Aide :** I = P / (4πd²) : distance × 2, intensité divisée par 4. Diviser par 4 = diviser deux fois par 2 : −3 − 3 = −6 dB.

#### `son.n2.attenuation-mur` — À écrire, QCM

**Tirage 1**

- **Énoncé :** Dans une salle de répétition, L = 95 dB ; dans le couloir, derrière la porte isolante, L = 65 dB. Atténuation de la porte ?
- **Réponse :** 30 dB
- **Valeur à écrire :** 30 (dB)
- **Pièges :** 160 dB · 1,5 dB · 300 dB
- **Aide :** A = L₁ − L₂ = 95 − 65 = 30 dB : une atténuation par absorption.

**Tirage 2**

- **Énoncé :** Dans une salle de répétition, L = 80 dB ; dans le couloir, derrière la porte isolante, L = 55 dB. Atténuation de la porte ?
- **Réponse :** 25 dB
- **Valeur à écrire :** 25 (dB)
- **Pièges :** 135 dB · 1,5 dB · 250 dB
- **Aide :** A = L₁ − L₂ = 80 − 55 = 25 dB : une atténuation par absorption.

**Tirage 3**

- **Énoncé :** Dans une salle de répétition, L = 90 dB ; dans le couloir, derrière la porte isolante, L = 60 dB. Atténuation de la porte ?
- **Réponse :** 30 dB
- **Valeur à écrire :** 30 (dB)
- **Pièges :** 150 dB · 1,5 dB · 300 dB
- **Aide :** A = L₁ − L₂ = 90 − 60 = 30 dB : une atténuation par absorption.

#### `son.n2.attenuation-facteur` — À écrire, QCM

**Tirage 1**

- **Énoncé :** Un casque antibruit divise l’intensité sonore par 10 000. Atténuation, en dB ?
- **Réponse :** 40 dB
- **Valeur à écrire :** 40 (dB)
- **Pièges :** 4 dB · 10 000 dB · 50 dB · 20 dB
- **Aide :** Diviser I par 10^{4}, c’est retirer 10 × 4 = 40 dB.

**Tirage 2**

- **Énoncé :** Un casque antibruit divise l’intensité sonore par 100. Atténuation, en dB ?
- **Réponse :** 20 dB
- **Valeur à écrire :** 20 (dB)
- **Pièges :** 2 dB · 100 dB · 30 dB · 10 dB
- **Aide :** Diviser I par 10^{2}, c’est retirer 10 × 2 = 20 dB.

**Tirage 3**

- **Énoncé :** Un casque antibruit divise l’intensité sonore par 100 000. Atténuation, en dB ?
- **Réponse :** 50 dB
- **Valeur à écrire :** 50 (dB)
- **Pièges :** 5 dB · 100 000 dB · 60 dB · 25 dB
- **Aide :** Diviser I par 10^{5}, c’est retirer 10 × 5 = 50 dB.

#### `son.n2.sources-inegales` — QCM, À écrire

**Tirage 1**

- **Énoncé :** Une tondeuse produit 90 dB et, au même endroit, un oiseau chante à 70 dB. Niveau total, à 1 dB près ?
- **Réponse :** 90 dB
- **Valeur à écrire :** 90 (dB) · écart admis 1.3 %
- **Pièges :** 160 dB · 93 dB · 80 dB
- **Aide :** L’oiseau a une intensité 100 fois plus faible : elle ne change presque rien à la somme des intensités.

**Tirage 2**

- **Énoncé :** Une tondeuse produit 80 dB et, au même endroit, un oiseau chante à 60 dB. Niveau total, à 1 dB près ?
- **Réponse :** 80 dB
- **Valeur à écrire :** 80 (dB) · écart admis 1.3 %
- **Pièges :** 140 dB · 83 dB · 70 dB
- **Aide :** L’oiseau a une intensité 100 fois plus faible : elle ne change presque rien à la somme des intensités.

**Tirage 3**

- **Énoncé :** Une tondeuse produit 90 dB et, au même endroit, un oiseau chante à 60 dB. Niveau total, à 1 dB près ?
- **Réponse :** 90 dB
- **Valeur à écrire :** 90 (dB) · écart admis 1.3 %
- **Pièges :** 150 dB · 93 dB · 75 dB
- **Aide :** L’oiseau a une intensité 1 000 fois plus faible : elle ne change presque rien à la somme des intensités.

#### `son.n2.ordre-grandeur` — QCM

**Tirage 1**

- **Énoncé :** Pour un concert de rock, un sonomètre affiche environ 110 dB. Intensité sonore correspondante ?
- **Réponse :** 10^{-1} W·m⁻²
- **Pièges :** 10^{1} W·m⁻² · 10^{-3} W·m⁻² · 110 W·m⁻² · 10^{11} W·m⁻²
- **Aide :** I = 10^{-12} × 10^{11} = 10^{-1} W·m⁻².

**Tirage 2**

- **Énoncé :** Pour un concert de rock, un sonomètre affiche environ 110 dB. Intensité sonore correspondante ?
- **Réponse :** 10^{-1} W·m⁻²
- **Pièges :** 10^{1} W·m⁻² · 10^{-3} W·m⁻² · 110 W·m⁻² · 10^{11} W·m⁻²
- **Aide :** I = 10^{-12} × 10^{11} = 10^{-1} W·m⁻².

**Tirage 3**

- **Énoncé :** Pour une bibliothèque, un sonomètre affiche environ 30 dB. Intensité sonore correspondante ?
- **Réponse :** 10^{-9} W·m⁻²
- **Pièges :** 10^{-7} W·m⁻² · 10^{-11} W·m⁻² · 30 W·m⁻² · 10^{3} W·m⁻²
- **Aide :** I = 10^{-12} × 10^{3} = 10^{-9} W·m⁻².

## Niveau 3 · Pièges et type bac, calculatrice permise — 15 cartes

#### `son.n3.niveau-calculatrice` — À écrire, QCM

**Tirage 1**

- **Énoncé :** Intensité mesurée : I = 8,0 × 10^{-6} W·m⁻² ; I₀ = 1,0 × 10^{-12} W·m⁻². Niveau L, au dixième de dB ?
- **Réponse :** 69,0 dB
- **Valeur à écrire :** 69.03089986991944 (dB) · écart admis 0.2 %
- **Pièges :** 158,9 dB · −51,0 dB · 6,9 dB
- **Aide :** L = 10 log(8,0 × 10^{-6} / 1,0 × 10^{-12}) ≈ 69,0 dB. Les pièges : ln au lieu de log, oubli de I₀, oubli du facteur 10.

**Tirage 2**

- **Énoncé :** Intensité mesurée : I = 3,2 × 10^{-5} W·m⁻² ; I₀ = 1,0 × 10^{-12} W·m⁻². Niveau L, au dixième de dB ?
- **Réponse :** 75,1 dB
- **Valeur à écrire :** 75.05149978319906 (dB) · écart admis 0.2 %
- **Pièges :** 172,8 dB · −44,9 dB · 7,5 dB
- **Aide :** L = 10 log(3,2 × 10^{-5} / 1,0 × 10^{-12}) ≈ 75,1 dB. Les pièges : ln au lieu de log, oubli de I₀, oubli du facteur 10.

**Tirage 3**

- **Énoncé :** Intensité mesurée : I = 8,0 × 10^{-4} W·m⁻² ; I₀ = 1,0 × 10^{-12} W·m⁻². Niveau L, au dixième de dB ?
- **Réponse :** 89,0 dB
- **Valeur à écrire :** 89.03089986991944 (dB) · écart admis 0.2 %
- **Pièges :** 205,0 dB · −31,0 dB · 8,9 dB
- **Aide :** L = 10 log(8,0 × 10^{-4} / 1,0 × 10^{-12}) ≈ 89,0 dB. Les pièges : ln au lieu de log, oubli de I₀, oubli du facteur 10.

#### `son.n3.intensite-calculatrice` — À écrire, QCM

**Tirage 1**

- **Énoncé :** Un sonomètre affiche L = 75 dB. I₀ = 1,0 × 10^{-12} W·m⁻². Intensité sonore, à deux chiffres significatifs ?
- **Réponse :** 3,2 × 10^{-5} W·m⁻²
- **Valeur à écrire :** 0.00003162277660168379 (W·m⁻²) · écart admis 2 %
- **Pièges :** 3,2 × 10^{7} W·m⁻² · 1,0 × 10^{63} W·m⁻² · 7,5 × 10^{-12} W·m⁻²
- **Aide :** I = I₀ × 10^{L/10} = 1,0 × 10^{-12} × 10^{7,5} ≈ 3,2 × 10^{-5} W·m⁻².

**Tirage 2**

- **Énoncé :** Un sonomètre affiche L = 65 dB. I₀ = 1,0 × 10^{-12} W·m⁻². Intensité sonore, à deux chiffres significatifs ?
- **Réponse :** 3,2 × 10^{-6} W·m⁻²
- **Valeur à écrire :** 0.0000031622776601683796 (W·m⁻²) · écart admis 2 %
- **Pièges :** 3,2 × 10^{6} W·m⁻² · 1,0 × 10^{53} W·m⁻² · 6,5 × 10^{-12} W·m⁻²
- **Aide :** I = I₀ × 10^{L/10} = 1,0 × 10^{-12} × 10^{6,5} ≈ 3,2 × 10^{-6} W·m⁻².

**Tirage 3**

- **Énoncé :** Un sonomètre affiche L = 45 dB. I₀ = 1,0 × 10^{-12} W·m⁻². Intensité sonore, à deux chiffres significatifs ?
- **Réponse :** 3,2 × 10^{-8} W·m⁻²
- **Valeur à écrire :** 3.162277660168379e-8 (W·m⁻²) · écart admis 2 %
- **Pièges :** 3,2 × 10^{4} W·m⁻² · 1,0 × 10^{33} W·m⁻² · 4,5 × 10^{-12} W·m⁻²
- **Aide :** I = I₀ × 10^{L/10} = 1,0 × 10^{-12} × 10^{4,5} ≈ 3,2 × 10^{-8} W·m⁻².

#### `son.n3.deux-sources-differentes` — À écrire, QCM

**Tirage 1**

- **Énoncé :** Au même point, une première source seule donne 70 dB et une seconde seule 72 dB. Niveau total, au dixième de dB ?
- **Réponse :** 74,1 dB
- **Valeur à écrire :** 74.1244260279434 (dB) · écart admis 0.2 %
- **Pièges :** 142 dB · 75 dB · 71 dB
- **Aide :** I = I₁ + I₂ = I₀ (10^{7} + 10^{7,2}), puis L = 10 log(I / I₀) ≈ 74,1 dB.

**Tirage 2**

- **Énoncé :** Au même point, une première source seule donne 70 dB et une seconde seule 72 dB. Niveau total, au dixième de dB ?
- **Réponse :** 74,1 dB
- **Valeur à écrire :** 74.1244260279434 (dB) · écart admis 0.2 %
- **Pièges :** 142 dB · 75 dB · 71 dB
- **Aide :** I = I₁ + I₂ = I₀ (10^{7} + 10^{7,2}), puis L = 10 log(I / I₀) ≈ 74,1 dB.

**Tirage 3**

- **Énoncé :** Au même point, une première source seule donne 70 dB et une seconde seule 76 dB. Niveau total, au dixième de dB ?
- **Réponse :** 77,0 dB
- **Valeur à écrire :** 76.97322793708695 (dB) · écart admis 0.2 %
- **Pièges :** 146 dB · 79 dB · 73 dB
- **Aide :** I = I₁ + I₂ = I₀ (10^{7} + 10^{7,6}), puis L = 10 log(I / I₀) ≈ 77,0 dB.

#### `son.n3.source-ponctuelle` — À écrire, QCM

**Tirage 1**

- **Énoncé :** Un haut-parleur, assimilé à une source ponctuelle, émet une puissance sonore de 1 W dans toutes les directions. Niveau d’intensité sonore à 5 m, au dixième de dB ? I₀ = 1,0 × 10^{-12} W·m⁻².
- **Réponse :** 95,0 dB (I ≈ 3,2 × 10^{-3} W·m⁻²)
- **Valeur à écrire :** 95.02850127305865 (dB) · écart admis 0.2 %
- **Pièges :** 102,0 dB · 120,0 dB · 101,0 dB
- **Aide :** I = P / (4πd²) = 1 / (4π × 25) ≈ 3,2 × 10^{-3} W·m⁻², puis L = 10 log(I / I₀) ≈ 95,0 dB.

**Tirage 2**

- **Énoncé :** Un haut-parleur, assimilé à une source ponctuelle, émet une puissance sonore de 5 W dans toutes les directions. Niveau d’intensité sonore à 2 m, au dixième de dB ? I₀ = 1,0 × 10^{-12} W·m⁻².
- **Réponse :** 110,0 dB (I ≈ 9,9 × 10^{-2} W·m⁻²)
- **Valeur à écrire :** 109.97700148985959 (dB) · écart admis 0.2 %
- **Pièges :** 113,0 dB · 127,0 dB · 116,0 dB
- **Aide :** I = P / (4πd²) = 5 / (4π × 4) ≈ 9,9 × 10^{-2} W·m⁻², puis L = 10 log(I / I₀) ≈ 110 dB.

**Tirage 3**

- **Énoncé :** Un haut-parleur, assimilé à une source ponctuelle, émet une puissance sonore de 0,1 W dans toutes les directions. Niveau d’intensité sonore à 10 m, au dixième de dB ? I₀ = 1,0 × 10^{-12} W·m⁻².
- **Réponse :** 79,0 dB (I ≈ 8,0 × 10^{-5} W·m⁻²)
- **Valeur à écrire :** 79.00790135977903 (dB) · écart admis 0.2 %
- **Pièges :** 89,0 dB · 110,0 dB · 85,0 dB
- **Aide :** I = P / (4πd²) = 0,1 / (4π × 100) ≈ 8,0 × 10^{-5} W·m⁻², puis L = 10 log(I / I₀) ≈ 79,0 dB.

#### `son.n3.distance-quelconque` — À écrire

**Tirage 1**

- **Énoncé :** À 2,0 m d’une source ponctuelle, L₁ = 90 dB. Sans absorption, $L_2 = L_1 - 20 \log\left(\dfrac{d_2}{d_1}\right)$. Niveau à 3,0 m, au dixième de dB ?
- **Réponse :** 86,5 dB
- **Valeur à écrire :** 86.47817481888637 (dB) · écart admis 0.2 %
- **Aide :** L₂ = 90 − 20 log(3 / 2) ≈ 90 − 3,52 ≈ 86,5 dB. Le 20 vient du carré de la distance : 10 log(d₂² / d₁²) = 20 log(d₂ / d₁).

**Tirage 2**

- **Énoncé :** À 2,0 m d’une source ponctuelle, L₁ = 80 dB. Sans absorption, $L_2 = L_1 - 20 \log\left(\dfrac{d_2}{d_1}\right)$. Niveau à 8,0 m, au dixième de dB ?
- **Réponse :** 68,0 dB
- **Valeur à écrire :** 67.95880017344075 (dB) · écart admis 0.2 %
- **Aide :** L₂ = 80 − 20 log(8 / 2) ≈ 80 − 12,0 ≈ 68,0 dB. Le 20 vient du carré de la distance : 10 log(d₂² / d₁²) = 20 log(d₂ / d₁).

**Tirage 3**

- **Énoncé :** À 2,0 m d’une source ponctuelle, L₁ = 90 dB. Sans absorption, $L_2 = L_1 - 20 \log\left(\dfrac{d_2}{d_1}\right)$. Niveau à 5,0 m, au dixième de dB ?
- **Réponse :** 82,0 dB
- **Valeur à écrire :** 82.04119982655925 (dB) · écart admis 0.2 %
- **Aide :** L₂ = 90 − 20 log(5 / 2) ≈ 90 − 7,96 ≈ 82,0 dB. Le 20 vient du carré de la distance : 10 log(d₂² / d₁²) = 20 log(d₂ / d₁).

#### `son.n3.combien-instruments` — À écrire, QCM

**Tirage 1**

- **Énoncé :** Un violon joue à 70 dB au premier rang. Combien de violons identiques faut-il, ensemble, pour atteindre 90 dB ?
- **Réponse :** 100 violons
- **Valeur à écrire :** 100 · écart admis 2 %
- **Pièges :** 20 violons · 1,3 violons · 50 violons
- **Aide :** N × I₁ = I donc N = 10^{(90 − 70)/10} = 10^{2} ≈ 100, soit 100 violons.

**Tirage 2**

- **Énoncé :** Un violon joue à 70 dB au premier rang. Combien de violons identiques faut-il, ensemble, pour atteindre 83 dB ?
- **Réponse :** 20 violons
- **Valeur à écrire :** 20 · écart admis 2 %
- **Pièges :** 13 violons · 1,2 violons · 10 violons
- **Aide :** N × I₁ = I donc N = 10^{(83 − 70)/10} = 10^{1,3} ≈ 20,0, soit 20 violons.

**Tirage 3**

- **Énoncé :** Un violon joue à 70 dB au premier rang. Combien de violons identiques faut-il, ensemble, pour atteindre 85 dB ?
- **Réponse :** 32 violons
- **Valeur à écrire :** 32 · écart admis 2 %
- **Pièges :** 15 violons · 1,2 violons · 16 violons
- **Aide :** N × I₁ = I donc N = 10^{(85 − 70)/10} = 10^{1,5} ≈ 31,6, soit 32 violons.

#### `son.n3.copie-addition-db` — QCM, Carte retournée

*Consigne :* Corrige la copie.

- **Énoncé :** Copie d’élève : « Deux machines identiques produisent chacune 80 dB. Ensemble : L = 80 + 80 = 160 dB. » Où est l’erreur ?
- **Réponse :** Ce sont les intensités qui s’additionnent : l’intensité double, L = 83 dB
- **Pièges :** Il fallait faire la moyenne : L = 80 dB · Il fallait multiplier : L = 80 × 80 = 6 400 dB · Aucune : deux machines font deux fois plus de bruit
- **Aide :** L = 10 log(2I / I₀) = 10 log 2 + 80 ≈ 83 dB. 160 dB dépasserait largement le seuil de douleur.

#### `son.n3.copie-oubli-i0` — QCM, Carte retournée

*Consigne :* Corrige la copie.

- **Énoncé :** Copie d’élève : « I = 1,0 × 10⁻⁵ W·m⁻², donc L = 10 log(1,0 × 10⁻⁵) = −50 dB. » Où est l’erreur ?
- **Réponse :** Il a oublié de diviser par I₀ : L = 10 log(10⁻⁵ / 10⁻¹²) = 70 dB
- **Pièges :** Il fallait utiliser ln : L = 10 ln(10⁻⁵) · Le facteur 10 est en trop : L = log(10⁻⁵) = −5 dB · Aucune : un niveau sonore est toujours négatif

#### `son.n3.copie-ln` — QCM, Carte retournée

*Consigne :* Corrige la copie.

- **Énoncé :** Copie d’élève : « I = 1,0 × 10⁻⁵ W·m⁻², L = 10 ln(I / I₀) = 161,2 dB. » Qu’en dit le correcteur ?
- **Réponse :** Il a pris ln au lieu de log : L = 70 dB. 161 dB pour une salle de classe est absurde
- **Pièges :** Le calcul est juste : c’est le niveau d’une salle de classe · Il fallait diviser I₀ par I · Il fallait écrire 161 dB, avec trois chiffres significatifs
- **Aide :** Un résultat au-dessus de 120 dB (seuil de douleur) pour une situation ordinaire doit alerter.

#### `son.n3.copie-distance` — QCM, Carte retournée

*Consigne :* Corrige la copie.

- **Énoncé :** Copie d’élève : « À 1 m d’une source ponctuelle, L = 80 dB. À 2 m, la distance double, donc L = 80 / 2 = 40 dB. » Où est l’erreur ?
- **Réponse :** C’est l’intensité qui est divisée par 4, pas le niveau par 2 : L ≈ 74 dB
- **Pièges :** L’intensité est divisée par 2, donc L = 77 dB · Le niveau ne dépend pas de la distance : L = 80 dB · Il fallait diviser par 4 : L = 20 dB
- **Aide :** I = P / (4πd²) : d × 2, I ÷ 4, soit −10 log 4 ≈ −6 dB.

#### `son.n3.copie-chiffres` — QCM, Carte retournée

*Consigne :* Corrige la copie.

- **Énoncé :** Copie d’élève, intensité donnée à deux chiffres significatifs : « L = 76,19331 dB ». Qu’en dit le correcteur ?
- **Réponse :** Trop de chiffres : on écrit L ≈ 76 dB
- **Pièges :** C’est parfait : la calculatrice est précise · Il faut écrire L ≈ 80 dB · Il faut écrire L ≈ 76,19 dB

#### `son.n3.intensite-double` — Vrai ou faux

- **Énoncé :** « Si l’intensité sonore double, le niveau d’intensité sonore double aussi. »
- **Attendu :** Faux
- **Réponse :** Faux : il augmente de 10 log 2 ≈ 3 dB. Pour doubler un niveau de 60 dB, il faudrait multiplier l’intensité par un million.

#### `son.n3.niveau-negatif` — Vrai ou faux

- **Énoncé :** « Un niveau d’intensité sonore peut être négatif. »
- **Attendu :** Vrai
- **Réponse :** Vrai : quand I < I₀, le rapport I / I₀ est inférieur à 1 et son logarithme est négatif. Ce son est inaudible.

#### `son.n3.protection` — QCM, Carte retournée

- **Énoncé :** Un ouvrier travaille près d’une machine à 105 dB. Ses bouchons d’oreille apportent une atténuation de 25 dB. Quel niveau atteint son tympan ?
- **Réponse :** 80 dB : on soustrait l’atténuation au niveau
- **Pièges :** 4,2 dB : on divise par l’atténuation · 130 dB : on ajoute l’atténuation · 102 dB : on retire 3 dB par protection

#### `son.n3.inverse-carre` — QCM, Carte retournée

- **Énoncé :** Pourquoi, sans absorption, l’intensité d’une source ponctuelle varie-t-elle comme $1 / d^2$ ?
- **Réponse :** La même puissance se répartit sur une sphère d’aire 4πd², qui croît comme d²
- **Pièges :** L’air absorbe d’autant plus d’énergie que la distance est grande · La célérité du son diminue avec la distance · La fréquence diminue avec la distance
