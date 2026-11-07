# Audit — Effet Doppler

*Fiche générée depuis `src/js/35-contenu-doppler.js` le 31/10/2026 : ne pas la corriger à la main, corriger le paquet puis relancer `node outils/audit-paquet.mjs`.*

> 🔴 **PROPOSITION à valider par Loïc** (choix des cartes, formulations, pièges). Une carte se corrige par son texte,
> jamais par son identifiant (la progression des élèves y est attachée).

## Niveau 1 · Vocabulaire, définitions, formules — 16 cartes

#### `doppler.n1.definition` — Carte retournée, QCM

- **Énoncé :** Qu’est-ce que l’effet Doppler ?
- **Réponse :** Le décalage entre la fréquence reçue et la fréquence émise, quand l’émetteur et le récepteur sont en mouvement l’un par rapport à l’autre
- **Pièges :** L’affaiblissement d’une onde au cours de sa propagation · Le changement de direction d’une onde qui passe par une ouverture · La variation de la célérité d’une onde quand l’émetteur se déplace

#### `doppler.n1.decalage` — Carte retournée, QCM

- **Énoncé :** Comment se définit le décalage Doppler $\Delta f$ ?
- **Réponse :** $\Delta f = f_R - f_E$ : fréquence reçue moins fréquence émise
- **Pièges :** $\Delta f = f_E - f_R$ · $\Delta f = f_R + f_E$ · $\Delta f = \dfrac{f_R}{f_E}$
- **Aide :** Δf > 0 quand l’émetteur s’approche, Δf < 0 quand il s’éloigne.

#### `doppler.n1.approche-aigu` — Vrai ou faux

- **Énoncé :** « Quand une source sonore s’approche d’un observateur immobile, il perçoit un son plus aigu que le son émis. »
- **Attendu :** Vrai
- **Réponse :** Vrai : la fréquence reçue est plus grande que la fréquence émise.

#### `doppler.n1.eloignement` — QCM, Carte retournée

- **Énoncé :** Une ambulance s’éloigne d’un piéton immobile. La fréquence qu’il perçoit est…
- **Réponse :** plus basse que la fréquence émise
- **Pièges :** plus haute que la fréquence émise · égale à la fréquence émise · nulle
- **Aide :** Le son perçu est plus grave : Δf < 0.

#### `doppler.n1.emise-inchangee` — Vrai ou faux

- **Énoncé :** « Quand l’ambulance s’approche, sa sirène émet un son de fréquence plus élevée. »
- **Attendu :** Faux
- **Réponse :** Faux : la fréquence émise ne change pas. C’est la fréquence reçue qui est plus élevée.

#### `doppler.n1.celerite` — Vrai ou faux

- **Énoncé :** « La célérité du son augmente quand la source sonore se déplace vers l’observateur. »
- **Attendu :** Faux
- **Réponse :** Faux : la célérité ne dépend que du milieu de propagation. Ce sont les fronts d’onde qui se resserrent.

#### `doppler.n1.fronts` — QCM, Carte retournée

- **Énoncé :** Devant un émetteur en mouvement, que deviennent les fronts d’onde ?
- **Réponse :** Ils se resserrent : la longueur d’onde reçue diminue
- **Pièges :** Ils s’écartent : la longueur d’onde reçue augmente · Ils vont plus vite : la célérité augmente · Rien ne change devant l’émetteur, seulement derrière

#### `doppler.n1.formule-approche` — QCM, Carte retournée

- **Énoncé :** Émetteur qui s’approche à la vitesse v d’un récepteur fixe : quelle expression de $f_R$ ?
- **Réponse :** $f_R = f_E \times \dfrac{c}{c - v}$
- **Pièges :** $f_R = f_E \times \dfrac{c}{c + v}$ · $f_R = f_E \times \dfrac{c - v}{c}$ · $f_R = f_E \times \dfrac{v}{c}$
- **Aide :** Le dénominateur c − v est plus petit que c : f_R > f_E, le son est plus aigu.

#### `doppler.n1.formule-eloignement` — QCM, Carte retournée

- **Énoncé :** Émetteur qui s’éloigne à la vitesse v d’un récepteur fixe : quelle expression de $f_R$ ?
- **Réponse :** $f_R = f_E \times \dfrac{c}{c + v}$
- **Pièges :** $f_R = f_E \times \dfrac{c}{c - v}$ · $f_R = f_E \times \dfrac{c + v}{c}$ · $f_R = f_E \times \dfrac{c}{v}$
- **Aide :** Le dénominateur c + v est plus grand que c : f_R < f_E, le son est plus grave.

#### `doppler.n1.approchee` — QCM, Carte retournée

- **Énoncé :** Quand $v \ll c$, quelle expression approchée donne la valeur du décalage Doppler ?
- **Réponse :** $|\Delta f| \approx f_E \times \dfrac{v}{c}$
- **Pièges :** $|\Delta f| \approx f_E \times \dfrac{c}{v}$ · $|\Delta f| \approx \dfrac{v}{f_E \times c}$ · $|\Delta f| \approx f_E \times v \times c$

#### `doppler.n1.vitesse` — QCM, Carte retournée

- **Énoncé :** Du décalage Doppler à la vitesse ($v \ll c$) : $v = \;$?
- **Réponse :** $v = c \times \dfrac{|\Delta f|}{f_E}$
- **Pièges :** $v = c \times \dfrac{f_E}{|\Delta f|}$ · $v = \dfrac{|\Delta f|}{f_E \times c}$ · $v = |\Delta f| \times f_E \times c$
- **Aide :** C’est le principe de la vélocimétrie : on mesure Δf, on en déduit v.

#### `doppler.n1.immobiles` — Vrai ou faux

- **Énoncé :** « Un émetteur et un récepteur immobiles l’un par rapport à l’autre : le décalage Doppler est nul. »
- **Attendu :** Vrai
- **Réponse :** Vrai : sans mouvement relatif, f_R = f_E.

#### `doppler.n1.toutes-ondes` — Vrai ou faux

- **Énoncé :** « L’effet Doppler ne concerne que les ondes sonores. »
- **Attendu :** Faux
- **Réponse :** Faux : il concerne toutes les ondes, sonores comme électromagnétiques (radar, lumière des étoiles).

#### `doppler.n1.rouge` — QCM, Carte retournée

- **Énoncé :** La lumière d’une galaxie qui s’éloigne de nous est décalée…
- **Réponse :** vers le rouge : la longueur d’onde reçue est plus grande
- **Pièges :** vers le bleu : la longueur d’onde reçue est plus petite · vers le rouge : la longueur d’onde reçue est plus petite · vers le bleu : la fréquence reçue est plus petite
- **Aide :** Éloignement : fréquence reçue plus petite, donc longueur d’onde plus grande (λ = c / f).

#### `doppler.n1.applications` — QCM

- **Énoncé :** Lequel de ces dispositifs ne repose pas sur l’effet Doppler ?
- **Réponse :** Le sonomètre, qui mesure un niveau d’intensité sonore
- **Pièges :** Le radar routier, qui mesure la vitesse d’un véhicule · L’échographie Doppler, qui mesure la vitesse du sang · La mesure de la vitesse d’une étoile par son spectre

#### `doppler.n1.unites` — QCM, Carte retournée

- **Énoncé :** Dans $|\Delta f| = f_E \times \dfrac{v}{c}$, en quelles unités exprimer v et c ?
- **Réponse :** Dans la même unité, par exemple les deux en m·s⁻¹
- **Pièges :** v en km·h⁻¹ et c en m·s⁻¹ · v en m·s⁻¹ et c en km·s⁻¹ · Peu importe : le rapport n’a pas d’unité
- **Aide :** v / c est un rapport sans unité seulement si v et c sont dans la même unité : 90 km/h se convertit d’abord en 25 m/s.

## Niveau 2 · Situations, calculs de tête — 10 cartes

#### `doppler.n2.decalage-approche` — À écrire, QCM

**Tirage 1**

- **Énoncé :** Une source émet un son de 1 700 Hz et s’approche à 8,5 m·s⁻¹ d’un micro fixe. c = 340 m·s⁻¹. Décalage Doppler $|\Delta f|$, avec l’expression approchée ?
- **Réponse :** 42,5 Hz
- **Valeur à écrire :** 42.5 (Hz)
- **Pièges :** 425 Hz · 4,25 Hz · 1 742,5 Hz · 85 Hz
- **Aide :** |Δf| ≈ f_E × v / c = 1 700 × 8,5 / 340 = 1 700 / 40 = 42,5 Hz.

**Tirage 2**

- **Énoncé :** Une source émet un son de 680 Hz et s’approche à 17 m·s⁻¹ d’un micro fixe. c = 340 m·s⁻¹. Décalage Doppler $|\Delta f|$, avec l’expression approchée ?
- **Réponse :** 34 Hz
- **Valeur à écrire :** 34 (Hz)
- **Pièges :** 340 Hz · 3,4 Hz · 714 Hz · 68 Hz
- **Aide :** |Δf| ≈ f_E × v / c = 680 × 17 / 340 = 680 / 20 = 34 Hz.

**Tirage 3**

- **Énoncé :** Une source émet un son de 3 400 Hz et s’approche à 3,4 m·s⁻¹ d’un micro fixe. c = 340 m·s⁻¹. Décalage Doppler $|\Delta f|$, avec l’expression approchée ?
- **Réponse :** 34 Hz
- **Valeur à écrire :** 34 (Hz)
- **Pièges :** 340 Hz · 3,4 Hz · 3 434 Hz · 68 Hz
- **Aide :** |Δf| ≈ f_E × v / c = 3 400 × 3,4 / 340 = 3 400 / 100 = 34 Hz.

#### `doppler.n2.vitesse-source` — À écrire, QCM

**Tirage 1**

- **Énoncé :** Un haut-parleur émet à 500 Hz ; le micro fixe mesure un décalage de 50 Hz. c = 340 m·s⁻¹. Vitesse du haut-parleur ?
- **Réponse :** 34 m·s⁻¹
- **Valeur à écrire :** 34 (m·s⁻¹)
- **Pièges :** 340 m·s⁻¹ · 3,4 m·s⁻¹ · 10 m·s⁻¹
- **Aide :** v = c × |Δf| / f_E = 340 × 50 / 500 = 340 / 10 = 34 m·s⁻¹.

**Tirage 2**

- **Énoncé :** Un haut-parleur émet à 1 000 Hz ; le micro fixe mesure un décalage de 10 Hz. c = 340 m·s⁻¹. Vitesse du haut-parleur ?
- **Réponse :** 3,4 m·s⁻¹
- **Valeur à écrire :** 3.4 (m·s⁻¹)
- **Pièges :** 34 m·s⁻¹ · 0,34 m·s⁻¹ · 100 m·s⁻¹
- **Aide :** v = c × |Δf| / f_E = 340 × 10 / 1 000 = 340 / 100 = 3,4 m·s⁻¹.

**Tirage 3**

- **Énoncé :** Un haut-parleur émet à 2 000 Hz ; le micro fixe mesure un décalage de 40 Hz. c = 340 m·s⁻¹. Vitesse du haut-parleur ?
- **Réponse :** 6,8 m·s⁻¹
- **Valeur à écrire :** 6.8 (m·s⁻¹)
- **Pièges :** 68 m·s⁻¹ · 0,68 m·s⁻¹ · 50 m·s⁻¹
- **Aide :** v = c × |Δf| / f_E = 340 × 40 / 2 000 = 340 / 50 = 6,8 m·s⁻¹.

#### `doppler.n2.exacte-approche` — À écrire, QCM

**Tirage 1**

- **Énoncé :** Émetteur à f_E = 250 Hz, qui s’approche à 90 m·s⁻¹ d’un récepteur fixe ; c = 340 m·s⁻¹. $f_R = f_E \times \dfrac{c}{c - v}$. Combien vaut $f_R$ ?
- **Réponse :** 340 Hz
- **Valeur à écrire :** 340 (Hz)
- **Pièges :** 198 Hz · 250 Hz · 160 Hz
- **Aide :** c − v = 250 m·s⁻¹ : f_R = 250 × 340 / 250 = 1 × 340 = 340 Hz, plus aigu que f_E.

**Tirage 2**

- **Énoncé :** Émetteur à f_E = 300 Hz, qui s’approche à 40 m·s⁻¹ d’un récepteur fixe ; c = 340 m·s⁻¹. $f_R = f_E \times \dfrac{c}{c - v}$. Combien vaut $f_R$ ?
- **Réponse :** 340 Hz
- **Valeur à écrire :** 340 (Hz)
- **Pièges :** 268 Hz · 300 Hz · 260 Hz
- **Aide :** c − v = 300 m·s⁻¹ : f_R = 300 × 340 / 300 = 1 × 340 = 340 Hz, plus aigu que f_E.

**Tirage 3**

- **Énoncé :** Émetteur à f_E = 640 Hz, qui s’approche à 20 m·s⁻¹ d’un récepteur fixe ; c = 340 m·s⁻¹. $f_R = f_E \times \dfrac{c}{c - v}$. Combien vaut $f_R$ ?
- **Réponse :** 680 Hz
- **Valeur à écrire :** 680 (Hz)
- **Pièges :** 604 Hz · 640 Hz · 600 Hz
- **Aide :** c − v = 320 m·s⁻¹ : f_R = 640 × 340 / 320 = 2 × 340 = 680 Hz, plus aigu que f_E.

#### `doppler.n2.exacte-eloignement` — À écrire, QCM

**Tirage 1**

- **Énoncé :** Émetteur à f_E = 360 Hz, qui s’éloigne à 20 m·s⁻¹ d’un récepteur fixe ; c = 340 m·s⁻¹. $f_R = f_E \times \dfrac{c}{c + v}$. Combien vaut $f_R$ ?
- **Réponse :** 340 Hz
- **Valeur à écrire :** 340 (Hz)
- **Pièges :** 360 Hz · 380 Hz · 680 Hz
- **Aide :** c + v = 360 m·s⁻¹ : f_R = 360 × 340 / 360 = 340 Hz, plus grave que f_E.

**Tirage 2**

- **Énoncé :** Émetteur à f_E = 400 Hz, qui s’éloigne à 60 m·s⁻¹ d’un récepteur fixe ; c = 340 m·s⁻¹. $f_R = f_E \times \dfrac{c}{c + v}$. Combien vaut $f_R$ ?
- **Réponse :** 340 Hz
- **Valeur à écrire :** 340 (Hz)
- **Pièges :** 400 Hz · 460 Hz · 680 Hz
- **Aide :** c + v = 400 m·s⁻¹ : f_R = 400 × 340 / 400 = 340 Hz, plus grave que f_E.

**Tirage 3**

- **Énoncé :** Émetteur à f_E = 425 Hz, qui s’éloigne à 85 m·s⁻¹ d’un récepteur fixe ; c = 340 m·s⁻¹. $f_R = f_E \times \dfrac{c}{c + v}$. Combien vaut $f_R$ ?
- **Réponse :** 340 Hz
- **Valeur à écrire :** 340 (Hz)
- **Pièges :** 425 Hz · 510 Hz · 680 Hz
- **Aide :** c + v = 425 m·s⁻¹ : f_R = 425 × 340 / 425 = 340 Hz, plus grave que f_E.

#### `doppler.n2.sens-du-mouvement` — Vrai ou faux

**Tirage 1**

- **Énoncé :** « Émis à 1 200 Hz, le son est reçu à 1 170 Hz par un micro fixe : l’émetteur s’approche du micro. »
- **Attendu :** Faux
- **Réponse :** Faux : l’émetteur s’éloigne, car f_R < f_E (Δf = −30 Hz).

**Tirage 2**

- **Énoncé :** « Émis à 440 Hz, le son est reçu à 430 Hz par un micro fixe : l’émetteur s’éloigne du micro. »
- **Attendu :** Vrai
- **Réponse :** Vrai : l’émetteur s’éloigne, car f_R < f_E (Δf = −10 Hz).

**Tirage 3**

- **Énoncé :** « Émis à 440 Hz, le son est reçu à 460 Hz par un micro fixe : l’émetteur s’approche du micro. »
- **Attendu :** Vrai
- **Réponse :** Vrai : l’émetteur s’approche, car f_R > f_E (Δf = +20 Hz).

#### `doppler.n2.kmh` — À écrire, QCM

**Tirage 1**

- **Énoncé :** Une moto roule à 72 km·h⁻¹ vers un piéton. Son klaxon émet à 680 Hz ; c = 340 m·s⁻¹. Décalage $|\Delta f|$ perçu (expression approchée) ?
- **Réponse :** 40 Hz
- **Valeur à écrire :** 40 (Hz)
- **Pièges :** 144 Hz · 4 Hz · 720 Hz
- **Aide :** D’abord la conversion : 72 km·h⁻¹ = 72 / 3,6 = 20 m·s⁻¹. Puis |Δf| ≈ 680 × 20 / 340 = 40 Hz.

**Tirage 2**

- **Énoncé :** Une moto roule à 72 km·h⁻¹ vers un piéton. Son klaxon émet à 1 020 Hz ; c = 340 m·s⁻¹. Décalage $|\Delta f|$ perçu (expression approchée) ?
- **Réponse :** 60 Hz
- **Valeur à écrire :** 60 (Hz)
- **Pièges :** 216 Hz · 6 Hz · 1 080 Hz
- **Aide :** D’abord la conversion : 72 km·h⁻¹ = 72 / 3,6 = 20 m·s⁻¹. Puis |Δf| ≈ 1 020 × 20 / 340 = 60 Hz.

**Tirage 3**

- **Énoncé :** Une moto roule à 108 km·h⁻¹ vers un piéton. Son klaxon émet à 680 Hz ; c = 340 m·s⁻¹. Décalage $|\Delta f|$ perçu (expression approchée) ?
- **Réponse :** 60 Hz
- **Valeur à écrire :** 60 (Hz)
- **Pièges :** 216 Hz · 6 Hz · 740 Hz
- **Aide :** D’abord la conversion : 108 km·h⁻¹ = 108 / 3,6 = 30 m·s⁻¹. Puis |Δf| ≈ 680 × 30 / 340 = 60 Hz.

#### `doppler.n2.galaxie` — À écrire, QCM

**Tirage 1**

- **Énoncé :** Une raie émise à λ = 500 nm est reçue décalée de 1 nm vers le rouge. Avec $\dfrac{\Delta\lambda}{\lambda} = \dfrac{v}{c}$ et c = 3,0 × 10^{5} km·s⁻¹, vitesse d’éloignement en km·s⁻¹ ?
- **Réponse :** 600 km·s⁻¹
- **Valeur à écrire :** 600 (km·s⁻¹)
- **Pièges :** 6 000 km·s⁻¹ · 60 km·s⁻¹ · 600 000 km·s⁻¹
- **Aide :** v = c × Δλ / λ = 3,0 × 10^{5} × 1 / 500 = 600 km·s⁻¹.

**Tirage 2**

- **Énoncé :** Une raie émise à λ = 500 nm est reçue décalée de 0,5 nm vers le rouge. Avec $\dfrac{\Delta\lambda}{\lambda} = \dfrac{v}{c}$ et c = 3,0 × 10^{5} km·s⁻¹, vitesse d’éloignement en km·s⁻¹ ?
- **Réponse :** 300 km·s⁻¹
- **Valeur à écrire :** 300 (km·s⁻¹)
- **Pièges :** 3 000 km·s⁻¹ · 30 km·s⁻¹ · 300 000 km·s⁻¹
- **Aide :** v = c × Δλ / λ = 3,0 × 10^{5} × 0,5 / 500 = 300 km·s⁻¹.

**Tirage 3**

- **Énoncé :** Une raie émise à λ = 500 nm est reçue décalée de 5 nm vers le rouge. Avec $\dfrac{\Delta\lambda}{\lambda} = \dfrac{v}{c}$ et c = 3,0 × 10^{5} km·s⁻¹, vitesse d’éloignement en km·s⁻¹ ?
- **Réponse :** 3 000 km·s⁻¹
- **Valeur à écrire :** 3000 (km·s⁻¹)
- **Pièges :** 30 000 km·s⁻¹ · 300 km·s⁻¹ · 3 000 000 km·s⁻¹
- **Aide :** v = c × Δλ / λ = 3,0 × 10^{5} × 5 / 500 = 3 000 km·s⁻¹.

#### `doppler.n2.ordre-frequences` — QCM, Carte retournée

- **Énoncé :** Un camion klaxonne en continu en passant devant toi. Dans quel ordre entends-tu les fréquences ?
- **Réponse :** D’abord plus aigu que f_E, puis plus grave que f_E
- **Pièges :** D’abord plus grave que f_E, puis plus aigu que f_E · De plus en plus aigu pendant l’approche, puis de plus en plus grave · Toujours f_E : seul le volume change
- **Aide :** À vitesse constante, la fréquence reçue est constante pendant l’approche (f_R > f_E), puis bascule au passage (f_R < f_E).

#### `doppler.n2.approximation-valide` — Vrai ou faux

**Tirage 1**

- **Énoncé :** « Pour une source à 10 m·s⁻¹ dans l’air (c = 340 m·s⁻¹), on peut utiliser $|\Delta f| \approx f_E \dfrac{v}{c}$. »
- **Attendu :** Vrai
- **Réponse :** Vrai : v / c = 2,9 %, donc v ≪ c.

**Tirage 2**

- **Énoncé :** « Pour une source à 250 m·s⁻¹ dans l’air (c = 340 m·s⁻¹), on peut utiliser $|\Delta f| \approx f_E \dfrac{v}{c}$. »
- **Attendu :** Faux
- **Réponse :** Faux : v / c ≈ 74 %, v n’est pas négligeable devant c : il faut l’expression exacte.

**Tirage 3**

- **Énoncé :** « Pour une source à 250 m·s⁻¹ dans l’air (c = 340 m·s⁻¹), on peut utiliser $|\Delta f| \approx f_E \dfrac{v}{c}$. »
- **Attendu :** Faux
- **Réponse :** Faux : v / c ≈ 74 %, v n’est pas négligeable devant c : il faut l’expression exacte.

#### `doppler.n2.lambda-recue` — QCM, Carte retournée

- **Énoncé :** Émetteur qui s’approche : la longueur d’onde reçue est-elle plus grande ou plus petite que celle émise ?
- **Réponse :** Plus petite : λ_R = c / f_R avec f_R > f_E
- **Pièges :** Plus grande : λ_R = c / f_R avec f_R > f_E · Égale : la célérité ne change pas · Plus grande, car l’émetteur pousse l’onde

## Niveau 3 · Pièges et type bac, calculatrice permise — 14 cartes

#### `doppler.n3.deux-frequences` — À écrire, QCM

**Tirage 1**

- **Énoncé :** Au passage d’une voiture, un micro fixe enregistre 418 Hz à l’approche puis 383 Hz à l’éloignement. On montre que $v = c \times \dfrac{f_1 - f_2}{f_1 + f_2}$, avec c = 340 m·s⁻¹. Vitesse de la voiture, en m·s⁻¹ ?
- **Réponse :** 15 m·s⁻¹ (soit 54 km·h⁻¹ environ)
- **Valeur à écrire :** 14.856429463171036 (m·s⁻¹) · écart admis 3 %
- **Pièges :** 30 m·s⁻¹ · 7 m·s⁻¹ · 35 m·s⁻¹
- **Aide :** v = 340 × (418 − 383) / (418 + 383) ≈ 14,9 m·s⁻¹. On l’obtient en divisant les deux expressions exactes : f_1 / f_2 = (c + v) / (c − v).

**Tirage 2**

- **Énoncé :** Au passage d’une voiture, un micro fixe enregistre 425 Hz à l’approche puis 378 Hz à l’éloignement. On montre que $v = c \times \dfrac{f_1 - f_2}{f_1 + f_2}$, avec c = 340 m·s⁻¹. Vitesse de la voiture, en m·s⁻¹ ?
- **Réponse :** 20 m·s⁻¹ (soit 72 km·h⁻¹ environ)
- **Valeur à écrire :** 19.900373599003736 (m·s⁻¹) · écart admis 3 %
- **Pièges :** 40 m·s⁻¹ · 10 m·s⁻¹ · 47 m·s⁻¹
- **Aide :** v = 340 × (425 − 378) / (425 + 378) ≈ 19,9 m·s⁻¹. On l’obtient en divisant les deux expressions exactes : f_1 / f_2 = (c + v) / (c − v).

**Tirage 3**

- **Énoncé :** Au passage d’une voiture, un micro fixe enregistre 531 Hz à l’approche puis 472 Hz à l’éloignement. On montre que $v = c \times \dfrac{f_1 - f_2}{f_1 + f_2}$, avec c = 340 m·s⁻¹. Vitesse de la voiture, en m·s⁻¹ ?
- **Réponse :** 20 m·s⁻¹ (soit 72 km·h⁻¹ environ)
- **Valeur à écrire :** 20 (m·s⁻¹) · écart admis 3 %
- **Pièges :** 40 m·s⁻¹ · 10 m·s⁻¹ · 59 m·s⁻¹
- **Aide :** v = 340 × (531 − 472) / (531 + 472) ≈ 20,0 m·s⁻¹. On l’obtient en divisant les deux expressions exactes : f_1 / f_2 = (c + v) / (c − v).

#### `doppler.n3.radar` — À écrire, QCM

**Tirage 1**

- **Énoncé :** Un radar émet une onde de fréquence f = 24 GHz ; l’onde réfléchie par la voiture revient décalée de 4 000 Hz. Formule fournie : $\Delta f = \dfrac{2 f v}{c}$, avec c = 3,00 × 10^{8} m·s⁻¹. Vitesse de la voiture en km·h⁻¹ ?
- **Réponse :** 90 km·h⁻¹ (v = 25,0 m·s⁻¹)
- **Valeur à écrire :** 90 (km·h⁻¹) · écart admis 2 %
- **Pièges :** 180 km·h⁻¹ · 45 km·h⁻¹ · 25,0 km·h⁻¹
- **Aide :** v = Δf × c / (2f) = 4000 × 3,00 × 10^{8} / (2 × 24 × 10^{9}) = 25,0 m·s⁻¹, puis × 3,6. Le 2 vient de l’aller-retour : la voiture reçoit l’onde en mouvement, puis la renvoie en mouvement.

**Tirage 2**

- **Énoncé :** Un radar émet une onde de fréquence f = 24 GHz ; l’onde réfléchie par la voiture revient décalée de 4 800 Hz. Formule fournie : $\Delta f = \dfrac{2 f v}{c}$, avec c = 3,00 × 10^{8} m·s⁻¹. Vitesse de la voiture en km·h⁻¹ ?
- **Réponse :** 108 km·h⁻¹ (v = 30,0 m·s⁻¹)
- **Valeur à écrire :** 108 (km·h⁻¹) · écart admis 2 %
- **Pièges :** 216 km·h⁻¹ · 54 km·h⁻¹ · 30,0 km·h⁻¹
- **Aide :** v = Δf × c / (2f) = 4800 × 3,00 × 10^{8} / (2 × 24 × 10^{9}) = 30,0 m·s⁻¹, puis × 3,6. Le 2 vient de l’aller-retour : la voiture reçoit l’onde en mouvement, puis la renvoie en mouvement.

**Tirage 3**

- **Énoncé :** Un radar émet une onde de fréquence f = 24 GHz ; l’onde réfléchie par la voiture revient décalée de 4 000 Hz. Formule fournie : $\Delta f = \dfrac{2 f v}{c}$, avec c = 3,00 × 10^{8} m·s⁻¹. Vitesse de la voiture en km·h⁻¹ ?
- **Réponse :** 90 km·h⁻¹ (v = 25,0 m·s⁻¹)
- **Valeur à écrire :** 90 (km·h⁻¹) · écart admis 2 %
- **Pièges :** 180 km·h⁻¹ · 45 km·h⁻¹ · 25,0 km·h⁻¹
- **Aide :** v = Δf × c / (2f) = 4000 × 3,00 × 10^{8} / (2 × 24 × 10^{9}) = 25,0 m·s⁻¹, puis × 3,6. Le 2 vient de l’aller-retour : la voiture reçoit l’onde en mouvement, puis la renvoie en mouvement.

#### `doppler.n3.raie-halpha` — À écrire, QCM

**Tirage 1**

- **Énoncé :** La raie Hα de l’hydrogène, émise à λ₀ = 656,3 nm, est observée à λ = 658,5 nm dans le spectre d’une galaxie. Avec $\dfrac{\lambda - \lambda_0}{\lambda_0} = \dfrac{v}{c}$ et c = 3,00 × 10^{5} km·s⁻¹, vitesse d’éloignement en km·s⁻¹ ?
- **Réponse :** 1,01 × 10^{3} km·s⁻¹ ; la galaxie s’éloigne (décalage vers le rouge)
- **Valeur à écrire :** 1005.6376657016816 (km·s⁻¹) · écart admis 2 %
- **Pièges :** 1,01 × 10^{6} km·s⁻¹ · 1,00 × 10^{3} km·s⁻¹ (en divisant par λ) · 1,01 km·s⁻¹
- **Aide :** v = c × (λ − λ₀) / λ₀ = 3,00 × 10^{5} × 2,2 / 656,3. λ > λ₀ : éloignement.

**Tirage 2**

- **Énoncé :** La raie Hα de l’hydrogène, émise à λ₀ = 656,3 nm, est observée à λ = 670 nm dans le spectre d’une galaxie. Avec $\dfrac{\lambda - \lambda_0}{\lambda_0} = \dfrac{v}{c}$ et c = 3,00 × 10^{5} km·s⁻¹, vitesse d’éloignement en km·s⁻¹ ?
- **Réponse :** 6,26 × 10^{3} km·s⁻¹ ; la galaxie s’éloigne (décalage vers le rouge)
- **Valeur à écrire :** 6262.380009142182 (km·s⁻¹) · écart admis 2 %
- **Pièges :** 6,26 × 10^{6} km·s⁻¹ · 6,13 × 10^{3} km·s⁻¹ (en divisant par λ) · 6,26 km·s⁻¹
- **Aide :** v = c × (λ − λ₀) / λ₀ = 3,00 × 10^{5} × 13,7 / 656,3. λ > λ₀ : éloignement.

**Tirage 3**

- **Énoncé :** La raie Hα de l’hydrogène, émise à λ₀ = 656,3 nm, est observée à λ = 670 nm dans le spectre d’une galaxie. Avec $\dfrac{\lambda - \lambda_0}{\lambda_0} = \dfrac{v}{c}$ et c = 3,00 × 10^{5} km·s⁻¹, vitesse d’éloignement en km·s⁻¹ ?
- **Réponse :** 6,26 × 10^{3} km·s⁻¹ ; la galaxie s’éloigne (décalage vers le rouge)
- **Valeur à écrire :** 6262.380009142182 (km·s⁻¹) · écart admis 2 %
- **Pièges :** 6,26 × 10^{6} km·s⁻¹ · 6,13 × 10^{3} km·s⁻¹ (en divisant par λ) · 6,26 km·s⁻¹
- **Aide :** v = c × (λ − λ₀) / λ₀ = 3,00 × 10^{5} × 13,7 / 656,3. λ > λ₀ : éloignement.

#### `doppler.n3.exacte-ou-approchee` — À écrire

**Tirage 1**

- **Énoncé :** Une sirène à 880 Hz s’approche à 25 m·s⁻¹ d’un observateur fixe (c = 340 m·s⁻¹). Fréquence reçue, avec l’expression exacte, à 1 Hz près ?
- **Réponse :** 950 Hz
- **Valeur à écrire :** 949.8412698412699 (Hz) · écart admis 0.3 %
- **Aide :** f_R = 880 × 340 / (340 − 25) ≈ 949,8 Hz. L’expression approchée donnerait 944,7 Hz : v / c ≈ 7 %, l’écart n’est plus négligeable.

**Tirage 2**

- **Énoncé :** Une sirène à 523 Hz s’approche à 25 m·s⁻¹ d’un observateur fixe (c = 340 m·s⁻¹). Fréquence reçue, avec l’expression exacte, à 1 Hz près ?
- **Réponse :** 565 Hz
- **Valeur à écrire :** 564.5079365079365 (Hz) · écart admis 0.3 %
- **Aide :** f_R = 523 × 340 / (340 − 25) ≈ 564,5 Hz. L’expression approchée donnerait 561,5 Hz : v / c ≈ 7 %, l’écart n’est plus négligeable.

**Tirage 3**

- **Énoncé :** Une sirène à 523 Hz s’approche à 45 m·s⁻¹ d’un observateur fixe (c = 340 m·s⁻¹). Fréquence reçue, avec l’expression exacte, à 1 Hz près ?
- **Réponse :** 603 Hz
- **Valeur à écrire :** 602.7796610169491 (Hz) · écart admis 0.3 %
- **Aide :** f_R = 523 × 340 / (340 − 45) ≈ 602,8 Hz. L’expression approchée donnerait 592,2 Hz : v / c ≈ 13 %, l’écart n’est plus négligeable.

#### `doppler.n3.copie-kmh` — QCM, Carte retournée

*Consigne :* Corrige la copie.

- **Énoncé :** Copie d’élève : « Le klaxon émet à 1 000 Hz, la voiture roule à 90 km/h, c = 340 m/s. |Δf| = 1 000 × 90 / 340 = 265 Hz. » Où est l’erreur ?
- **Réponse :** La vitesse n’est pas convertie : 90 km/h = 25 m/s, donc |Δf| ≈ 74 Hz
- **Pièges :** Il fallait diviser par 90 et multiplier par 340 · Il fallait utiliser c = 3,00 × 10⁸ m/s · Il n’y a pas d’erreur : 265 Hz est juste
- **Aide :** v et c doivent être dans la même unité. 1 000 × 25 / 340 ≈ 74 Hz.

#### `doppler.n3.copie-signe` — QCM, Carte retournée

*Consigne :* Corrige la copie.

- **Énoncé :** Copie d’élève : « f_E = 500 Hz, f_R = 480 Hz. Δf = f_E − f_R = 20 Hz > 0 : l’émetteur s’approche. » Où est l’erreur ?
- **Réponse :** Δf = f_R − f_E = −20 Hz : l’émetteur s’éloigne
- **Pièges :** Le calcul est juste mais Δf s’exprime en m/s · Il fallait calculer Δf = f_R + f_E · Aucune : un décalage positif signifie bien une approche
- **Aide :** Pas besoin de calcul pour conclure : f_R < f_E, le son reçu est plus grave, l’émetteur s’éloigne.

#### `doppler.n3.copie-chiffres` — QCM, Carte retournée

*Consigne :* Corrige la copie.

- **Énoncé :** Copie d’élève, données à deux ou trois chiffres significatifs : « v = 26,153846 m/s ». Qu’en dit le correcteur ?
- **Réponse :** Trop de chiffres significatifs : on écrit v ≈ 26 m/s
- **Pièges :** C’est parfait : la calculatrice est précise · Il faut arrondir à v = 30 m/s · Il faut écrire v = 26,2 km/h

#### `doppler.n3.copie-lumiere` — QCM, Carte retournée

*Consigne :* Corrige la copie.

- **Énoncé :** Copie d’élève, radar routier : « Δf = 2 f v / c avec c = 340 m/s. » Où est l’erreur ?
- **Réponse :** Le radar émet une onde électromagnétique : c = 3,00 × 10⁸ m/s
- **Pièges :** Il ne faut pas de facteur 2 · Il faut utiliser c − v au lieu de c · Aucune : c est toujours 340 m/s

#### `doppler.n3.vitesse-constante` — Vrai ou faux

- **Énoncé :** « Une source s’éloigne en ligne droite à vitesse constante : la fréquence perçue diminue au cours du temps. »
- **Attendu :** Faux
- **Réponse :** Faux : à vitesse constante, la fréquence perçue est constante (plus basse que f_E). C’est l’intensité sonore qui diminue avec la distance.

#### `doppler.n3.son-fort` — Vrai ou faux

- **Énoncé :** « Plus la sirène est puissante, plus le décalage Doppler est grand. »
- **Attendu :** Faux
- **Réponse :** Faux : |Δf| ≈ f_E v / c ne dépend que de la fréquence émise, de la vitesse et de la célérité.

#### `doppler.n3.etablir` — QCM, Carte retournée

- **Énoncé :** Pour établir $f_R$, on regarde l’émetteur pendant une période $T_E$, en s’approchant à la vitesse v. Quelle relation entre longueurs d’onde ?
- **Réponse :** $\lambda_R = \lambda_E - v T_E$
- **Pièges :** $\lambda_R = \lambda_E + v T_E$ · $\lambda_R = v T_E$ · $\lambda_R = \lambda_E \times v T_E$
- **Aide :** Pendant T_E, l’onde parcourt λ_E = c T_E et l’émetteur v T_E : deux fronts successifs ne sont plus distants que de (c − v) T_E. Avec f_R = c / λ_R, on obtient f_R = f_E × c / (c − v).

#### `doppler.n3.supersonique` — QCM, Carte retournée

- **Énoncé :** Pourquoi l’expression approchée $|\Delta f| \approx f_E \dfrac{v}{c}$ convient-elle à un radar routier, mais pas au son d’un avion de chasse ?
- **Réponse :** Pour le radar, v ≪ c = 3 × 10⁸ m/s ; pour l’avion, v est du même ordre que la célérité du son
- **Pièges :** Parce que les ondes électromagnétiques ne subissent pas l’effet Doppler · Parce que l’avion émet un son trop fort · Parce que le radar fait un aller-retour

#### `doppler.n3.echographie` — QCM, Carte retournée

- **Énoncé :** Échographie Doppler : la sonde émet à 5,0 MHz et reçoit un écho décalé de +1,3 kHz. Le sang dans ce vaisseau…
- **Réponse :** …s’approche de la sonde : le décalage est positif
- **Pièges :** …s’éloigne de la sonde : le décalage est positif · …est immobile : 1,3 kHz est négligeable devant 5,0 MHz · …on ne peut rien dire sans la célérité des ultrasons

#### `doppler.n3.ordre-de-grandeur` — QCM

- **Énoncé :** Un TGV passe à 300 km·h⁻¹ en klaxonnant à 500 Hz (c = 340 m·s⁻¹). Ordre de grandeur de $|\Delta f|$ à l’approche ?
- **Réponse :** Une centaine de hertz
- **Pièges :** Un hertz · Dix mille hertz · Moins d’un hertz
- **Aide :** v ≈ 83 m·s⁻¹ ; l’expression exacte donne f_R ≈ 662 Hz, soit |Δf| ≈ 160 Hz. v / c ≈ 25 % : l’approchée (≈ 120 Hz) sous-estime.
