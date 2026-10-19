# Audit — Python pour l’ECE

*Fiche générée depuis `src/js/35-contenu-python.js` le 19/10/2026 : ne pas la corriger à la main, corriger le paquet puis relancer `node outils/audit-paquet.mjs`.*

> 🔴 **PROPOSITION à valider par Loïc** (choix des cartes, formulations, pièges). Une carte se corrige par son texte,
> jamais par son identifiant (la progression des élèves y est attachée).

## Niveau 1 · La boîte à outils de l’ECE — 65 cartes

### Étape 1

#### `python.n1.e1.division` — QCM, À écrire · réponse comparée en code

*Consigne :* Que répond Python ?

**Tirage 1**

- **Énoncé :** `13 / 4`
- **Réponse :** 3.25
- **Pièges :** 3 · 3,25 · 4 · 3.0
- **Aide :** La division / donne toujours un nombre à virgule, écrit avec un point.

**Tirage 2**

- **Énoncé :** `11 / 5`
- **Réponse :** 2.2
- **Pièges :** 2 · 2,2 · 3 · 2.0
- **Aide :** La division / donne toujours un nombre à virgule, écrit avec un point.

**Tirage 3**

- **Énoncé :** `7 / 2`
- **Réponse :** 3.5
- **Pièges :** 3 · 3,5 · 4 · 3.0
- **Aide :** La division / donne toujours un nombre à virgule, écrit avec un point.

#### `python.n1.e1.puissance` — QCM, À écrire · réponse comparée en code

*Consigne :* Que répond Python ?

**Tirage 1**

- **Énoncé :** `10 ** 3`
- **Réponse :** 1000
- **Pièges :** 30 · 1000.0 · 13 · 103
- **Aide :** ** est la puissance : 10^{3} = 1000. Aucun des deux nombres n'a de virgule, le résultat est un entier.

**Tirage 2**

- **Énoncé :** `3 ** 2`
- **Réponse :** 9
- **Pièges :** 6 · 8 · 9.0 · 5 · 32
- **Aide :** ** est la puissance : 3^{2} = 9. Aucun des deux nombres n'a de virgule, le résultat est un entier.

**Tirage 3**

- **Énoncé :** `2 ** 4`
- **Réponse :** 16
- **Pièges :** 8 · 16.0 · 6 · 24
- **Aide :** ** est la puissance : 2^{4} = 16. Aucun des deux nombres n'a de virgule, le résultat est un entier.

#### `python.n1.e1.priorites` — QCM, À écrire · réponse comparée en code

*Consigne :* Que répond Python ?

**Tirage 1**

- **Énoncé :** `12 - 6 / 2`
- **Réponse :** 9.0
- **Pièges :** 3.0 · 9 · 3 · 11.0 · 8.0
- **Aide :** La division passe avant la soustraction, comme sur la calculatrice ; elle donne un nombre à virgule.

**Tirage 2**

- **Énoncé :** `10 - 4 / 2`
- **Réponse :** 8.0
- **Pièges :** 3.0 · 8 · 3 · 10.0 · 7.0
- **Aide :** La division passe avant la soustraction, comme sur la calculatrice ; elle donne un nombre à virgule.

**Tirage 3**

- **Énoncé :** `20 - 5 / 5`
- **Réponse :** 19.0
- **Pièges :** 3.0 · 19 · 3 · 24.0 · 18.0
- **Aide :** La division passe avant la soustraction, comme sur la calculatrice ; elle donne un nombre à virgule.

#### `python.n1.e1.notation-e` — QCM, À écrire · réponse comparée en code

*Consigne :* Comment l’écrire dans Python ?

**Tirage 1**

- **Énoncé :** 3,4 × 10^{2}
- **Réponse :** `3.4e2`
- **Acceptées aussi à l'écrit :** 3.4e2 · 3.4E2 · 3.4 * 10 ** 2 · 3.4 * 10 ** (2) · 3.4*10**2
- **Pièges :** `3,4e2` · `3.4^2` · `3.4e-2` · `3.4 * 10^2`
- **Aide :** Le e se lit « fois 10 puissance », et le séparateur décimal est le point.

**Tirage 2**

- **Énoncé :** 4,0 × 10^{-5}
- **Réponse :** `4.0e-5`
- **Acceptées aussi à l'écrit :** 4.0e-5 · 4.0E-5 · 4.0 * 10 ** -5 · 4.0 * 10 ** (-5) · 4.0*10**-5
- **Pièges :** `4,0e-5` · `4.0^-5` · `4.0e5` · `4.0 * 10^-5`
- **Aide :** Le e se lit « fois 10 puissance », et le séparateur décimal est le point.

**Tirage 3**

- **Énoncé :** 1,0 × 10^{-12}
- **Réponse :** `1.0e-12`
- **Acceptées aussi à l'écrit :** 1.0e-12 · 1.0E-12 · 1.0 * 10 ** -12 · 1.0 * 10 ** (-12) · 1.0*10**-12
- **Pièges :** `1,0e-12` · `1.0^-12` · `1.0e12` · `1.0 * 10^-12`
- **Aide :** Le e se lit « fois 10 puissance », et le séparateur décimal est le point.

#### `python.n1.e1.e-donne-un-flottant` — QCM, À écrire · réponse comparée en code

*Consigne :* Que répond Python ?

**Tirage 1**

- **Énoncé :** `7e3`
- **Réponse :** 7000.0
- **Pièges :** 7000 · 70000.0 · 21 · 73 · 343
- **Aide :** 7e3 se lit « 7 fois 10 puissance 3 ». Une valeur écrite avec e est toujours un nombre à virgule.

**Tirage 2**

- **Énoncé :** `3e3`
- **Réponse :** 3000.0
- **Pièges :** 3000 · 30000.0 · 9 · 33 · 27
- **Aide :** 3e3 se lit « 3 fois 10 puissance 3 ». Une valeur écrite avec e est toujours un nombre à virgule.

**Tirage 3**

- **Énoncé :** `4e3`
- **Réponse :** 4000.0
- **Pièges :** 4000 · 40000.0 · 12 · 43 · 64
- **Aide :** 4e3 se lit « 4 fois 10 puissance 3 ». Une valeur écrite avec e est toujours un nombre à virgule.

#### `python.n1.e1.puissance-negative` — QCM, À écrire · réponse comparée en code

*Consigne :* Que répond Python ?

- **Énoncé :** `10 ** -3`
- **Réponse :** 0.001
- **Pièges :** -1000 · 0.0001 · -30 · 1000.0
- **Aide :** 10^{-3} = 1 / 1000 = 0,001. Une puissance négative ne rend pas le nombre négatif : elle le rend petit.

#### `python.n1.e1.piege-10e-12` — Vrai ou faux

- **Énoncé :** « Dans Python, `10e-12` vaut 10^{-12}. »
- **Attendu :** Faux
- **Réponse :** Faux : `10e-12` vaut 10 × 10^{-12} = 10^{-11}. Le seuil d'audibilité s'écrit `1.0e-12`.

### Étape 2

#### `python.n1.e2.signe-egal` — QCM, Carte retournée

- **Énoncé :** Que signifie `=` dans `c = 340` ?
- **Réponse :** Ranger la valeur 340 dans la variable c
- **Pièges :** Vérifier que la variable c est bien égale à 340 · Afficher la valeur de c, soit 340 · Comparer c et 340, comme une égalité en maths
- **Aide :** Le signe = n’est pas une égalité : Python calcule ce qui est à droite, puis le range dans la variable de gauche.

#### `python.n1.e2.f-egal-f-fois` — QCM, À écrire · réponse comparée en code

*Consigne :* Qu’affiche ce programme ?

**Tirage 1**

- **Énoncé :** ```python
f = 250
f = f * 4
print(f)
```
- **Réponse :** 1000
- **Pièges :** 250 · 250 puis 1000 · un message d’erreur · f * 4
- **Aide :** La 2ᵉ ligne se lit de droite à gauche : Python calcule f * 4 avec l’ancienne valeur, puis range le résultat dans f. Un seul print, donc un seul affichage.

**Tirage 2**

- **Énoncé :** ```python
f = 250
f = f * 2
print(f)
```
- **Réponse :** 500
- **Pièges :** 250 · 250 puis 500 · un message d’erreur · f * 2
- **Aide :** La 2ᵉ ligne se lit de droite à gauche : Python calcule f * 2 avec l’ancienne valeur, puis range le résultat dans f. Un seul print, donc un seul affichage.

**Tirage 3**

- **Énoncé :** ```python
f = 500
f = f * 3
print(f)
```
- **Réponse :** 1500
- **Pièges :** 500 · 500 puis 1500 · un message d’erreur · f * 3
- **Aide :** La 2ᵉ ligne se lit de droite à gauche : Python calcule f * 3 avec l’ancienne valeur, puis range le résultat dans f. Un seul print, donc un seul affichage.

#### `python.n1.e2.nom-de-variable` — Vrai ou faux

**Tirage 1**

- **Énoncé :** « `import` peut servir de nom de variable. »
- **Attendu :** Faux
- **Réponse :** Faux : import est un mot réservé du langage.

**Tirage 2**

- **Énoncé :** « `S1M` peut servir de nom de variable. »
- **Attendu :** Vrai
- **Réponse :** Vrai : Il commence par une lettre : un nom correct.

**Tirage 3**

- **Énoncé :** « `lambda` peut servir de nom de variable. »
- **Attendu :** Faux
- **Réponse :** Faux : lambda est un mot réservé du langage : on écrit lam.

#### `python.n1.e2.mot-reserve` — QCM

- **Énoncé :** Lequel de ces noms ne peut pas servir de variable ?
- **Réponse :** `lambda`
- **Pièges :** `delta_f` · `lam_max` · `pH_citron` · `theta`
- **Aide :** lambda est un des mots réservés du langage, comme if, for, in, def, import : c’est pourquoi on écrit lam pour λ.

#### `python.n1.e2.majuscules` — Vrai ou faux

- **Énoncé :** « `c` et `C` désignent la même variable. »
- **Attendu :** Faux
- **Réponse :** Faux : Python distingue majuscules et minuscules. Utiliser C quand la variable s’appelle c donne une NameError.

#### `python.n1.e2.commentaire` — QCM, Carte retournée

- **Énoncé :** À quoi sert `#` dans `f = 500   # en Hz` ?
- **Réponse :** À écrire un commentaire, que Python ignore
- **Pièges :** À indiquer à Python l’unité de la valeur de f · À afficher la ligne pendant l’exécution · À signaler une ligne que l’élève doit modifier
- **Aide :** Tout ce qui suit # est ignoré par Python : on y note les unités, pour soi et pour le correcteur.

#### `python.n1.e2.rien-sans-print` — Vrai ou faux

- **Énoncé :** « Dans un script, la ligne `lam = c / f` affiche la valeur de lam. »
- **Attendu :** Faux
- **Réponse :** Faux : elle calcule et range la valeur, sans rien afficher. Dans un script, rien ne s’affiche sans `print(lam)`.

#### `python.n1.e2.doppler-exact` — QCM, À écrire · réponse comparée en code

*Consigne :* Complète la ligne, comme à l’ECE.

- **Énoncé :** $f_R = f_E \times \dfrac{c}{c - v}$


```python
f_E = 40000      # fréquence émise, en Hz
v = 2.0          # en m/s
c = 340          # en m/s
f_R = ……
```
- **Réponse :** `f_E * c / (c - v)`
- **Acceptées aussi à l'écrit :** f_E * c / (c - v) · f_R = f_E * c / (c - v) · c * f_E / (c - v) · f_R = c * f_E / (c - v) · f_E * (c / (c - v)) · f_R = f_E * (c / (c - v)) · c / (c - v) * f_E · f_R = c / (c - v) * f_E
- **Pièges :** `f_E * c / c - v` · `f_E * c / (v - c)` · `f_E * (c - v) / c` · `f_E * v / c`
- **Aide :** Sans les parenthèses autour de c - v, Python diviserait par c seulement, puis retrancherait v.

#### `python.n1.e2.difference-de-marche` — QCM, À écrire · réponse comparée en code

*Consigne :* Qu’affiche ce programme ?

**Tirage 1**

- **Énoncé :** ```python
lam = 500        # en nm
S1M = 2500
S2M = 4500
delta = S2M - S1M
print(delta / lam)
```
- **Réponse :** 4.0
- **Pièges :** 2000 · 5.0 · 4 · 9.0
- **Aide :** Un nombre entier : interférences constructives. La division donne quand même un nombre à virgule.

**Tirage 2**

- **Énoncé :** ```python
lam = 500        # en nm
S1M = 1500
S2M = 2500
delta = S2M - S1M
print(delta / lam)
```
- **Réponse :** 2.0
- **Pièges :** 1000 · 3.0 · 2 · 5.0
- **Aide :** Un nombre entier : interférences constructives. La division donne quand même un nombre à virgule.

**Tirage 3**

- **Énoncé :** ```python
lam = 500        # en nm
S1M = 2000
S2M = 3500
delta = S2M - S1M
print(delta / lam)
```
- **Réponse :** 3.0
- **Pièges :** 1500 · 4.0 · 3 · 7.0
- **Aide :** Un nombre entier : interférences constructives. La division donne quand même un nombre à virgule.

### Étape 3

#### `python.n1.e3.type` — QCM, À écrire · réponse comparée en code

*Consigne :* Quel est le type de cette valeur ?

**Tirage 1**

- **Énoncé :** `type(3e2)`
- **Réponse :** float
- **Acceptées aussi à l'écrit :** <class 'float'>
- **Pièges :** int · str · un message d’erreur
- **Aide :** Une valeur écrite avec e est toujours un nombre à virgule. Python l’écrit <class 'float'>.

**Tirage 2**

- **Énoncé :** `type(340)`
- **Réponse :** int
- **Acceptées aussi à l'écrit :** <class 'int'>
- **Pièges :** float · str · un message d’erreur
- **Aide :** Un nombre sans virgule est un entier : int. Python l’écrit <class 'int'>.

**Tirage 3**

- **Énoncé :** `type(2.5)`
- **Réponse :** float
- **Acceptées aussi à l'écrit :** <class 'float'>
- **Pièges :** int · str · un message d’erreur
- **Aide :** 2.5 a une virgule (un point, en Python) : c’est un float. Python l’écrit <class 'float'>.

#### `python.n1.e3.textes-bout-a-bout` — QCM, À écrire · réponse comparée en code

*Consigne :* Que répond Python ?

**Tirage 1**

- **Énoncé :** `'5' + '00'`
- **Réponse :** `'500'`
- **Acceptées aussi à l'écrit :** '500'
- **Pièges :** `5` · `'5'` · `500` · `'5 00'`
- **Aide :** Deux textes s’ajoutent bout à bout ; le résultat est encore un texte, d’où les guillemets.

**Tirage 2**

- **Énoncé :** `'12' + '3'`
- **Réponse :** `'123'`
- **Acceptées aussi à l'écrit :** '123'
- **Pièges :** `15` · `'15'` · `123` · `'12 3'`
- **Aide :** Deux textes s’ajoutent bout à bout ; le résultat est encore un texte, d’où les guillemets.

**Tirage 3**

- **Énoncé :** `'12' + '3'`
- **Réponse :** `'123'`
- **Acceptées aussi à l'écrit :** '123'
- **Pièges :** `15` · `'15'` · `123` · `'12 3'`
- **Aide :** Deux textes s’ajoutent bout à bout ; le résultat est encore un texte, d’où les guillemets.

#### `python.n1.e3.texte-plus-nombre` — QCM, À écrire · réponse comparée en code

*Consigne :* Que répond Python ?

- **Énoncé :** `'Hz' + 500`
- **Réponse :** TypeError
- **Acceptées aussi à l'écrit :** une TypeError · TypeError (erreur)
- **Pièges :** SyntaxError · `'Hz500'` · `'Hz 500'`
- **Aide :** Un texte et un nombre ne s’ajoutent pas. Pour afficher les deux, on les sépare par une virgule dans print.

#### `python.n1.e3.print-morceaux` — QCM

*Consigne :* Qu’affiche Python ?

**Tirage 1**

- **Énoncé :** `print('c =', 340, 'm/s')`
- **Réponse :** `c = 340 m/s`
- **Pièges :** `c=340m/s` · `c = 340m/s` · `'c =', 340, 'm/s'`
- **Aide :** print affiche chaque morceau sans les guillemets, avec une espace entre deux morceaux.

**Tirage 2**

- **Énoncé :** `print('L =', 70.0, 'dB')`
- **Réponse :** `L = 70.0 dB`
- **Pièges :** `L=70.0dB` · `L = 70.0dB` · `'L =', 70.0, 'dB'`
- **Aide :** print affiche chaque morceau sans les guillemets, avec une espace entre deux morceaux.

**Tirage 3**

- **Énoncé :** `print('T =', 0.002, 's')`
- **Réponse :** `T = 0.002 s`
- **Pièges :** `T=0.002s` · `T = 0.002s` · `'T =', 0.002, 's'`
- **Aide :** print affiche chaque morceau sans les guillemets, avec une espace entre deux morceaux.

#### `python.n1.e3.round` — QCM, À écrire · réponse comparée en code

*Consigne :* Que répond Python ?

**Tirage 1**

- **Énoncé :** `round(3.14159, 1)`
- **Réponse :** 3.1
- **Pièges :** 3.14 · 3.0 · 3 · 3.2
- **Aide :** round(x, 1) garde 1 chiffre après la virgule, en arrondissant au plus proche.

**Tirage 2**

- **Énoncé :** `round(0.68372, 2)`
- **Réponse :** 0.68
- **Pièges :** 0.684 · 0.7 · 1 · 0.69
- **Aide :** round(x, 2) garde 2 chiffres après la virgule, en arrondissant au plus proche.

**Tirage 3**

- **Énoncé :** `round(9.80665, 1)`
- **Réponse :** 9.8
- **Pièges :** 9.81 · 10.0 · 10 · 9.9
- **Aide :** round(x, 1) garde 1 chiffre après la virgule, en arrondissant au plus proche.

#### `python.n1.e3.afficher-nom-valeur-unite` — QCM, À écrire · réponse comparée en code

*Consigne :* Complète la dernière ligne.

- **Énoncé :** Le programme doit afficher exactement : `T = 0.002 s`


```python
f = 500
T = 1 / f        # période, en s
……
```
- **Réponse :** `print('T =', T, 's')`
- **Acceptées aussi à l'écrit :** 'T =', T, 's'
- **Pièges :** `print('T =' + T + 's')` · `print('T =', 'T', 's')` · `print(T = T s)`
- **Aide :** Trois morceaux séparés par des virgules : un texte entre guillemets, la variable sans guillemets, l’unité entre guillemets.

#### `python.n1.e3.arrondir-a-l-affichage` — QCM, À écrire · réponse comparée en code

*Consigne :* Complète pour afficher delta_f arrondi à 2 chiffres après la virgule.

- **Énoncé :** ```python
print('Décalage Doppler :', ……, 'Hz')
```
- **Réponse :** `round(delta_f, 2)`
- **Acceptées aussi à l'écrit :** print('Décalage Doppler :', round(delta_f, 2), 'Hz')
- **Pièges :** `round(2, delta_f)` · `round(delta_f, 0.01)` · `round(delta_f)`
- **Aide :** D’abord la valeur à arrondir, puis le nombre de chiffres après la virgule.

#### `python.n1.e3.fonctions-integrees` — Vrai ou faux

- **Énoncé :** « Pour utiliser `print`, `round` ou `type`, il faut d’abord importer une bibliothèque. »
- **Attendu :** Faux
- **Réponse :** Faux : ce sont des fonctions intégrées à Python, disponibles sans import.

#### `python.n1.e3.sans-guillemets` — QCM, Carte retournée

- **Énoncé :** Que fait Python de `Hz` écrit sans guillemets ?
- **Réponse :** Il cherche une variable nommée Hz
- **Pièges :** Il l’affiche comme un texte · Il le remplace par l’unité hertz · Il l’ignore, comme un commentaire
- **Aide :** Sans guillemets, c’est un nom : si aucune variable ne s’appelle Hz, Python répond NameError.

#### `python.n1.e3.multiplication-explicite` — QCM, À écrire · réponse comparée en code

*Consigne :* Quelle ligne est correcte ?

- **Énoncé :** Diffraction : quelle ligne calcule L = 2Dθ ?
- **Réponse :** `L = 2 * D * theta`
- **Acceptées aussi à l'écrit :** L = 2 * theta * D · L = D * 2 * theta · L = 2 * (D * theta)
- **Pièges :** `L = 2D * theta` · `L = 2 (D * theta)` · `L = 2 ** D * theta` · `L = 2 * D theta`
- **Aide :** Python n’accepte pas 2D : la multiplication s’écrit toujours avec *.

### Étape 4

#### `python.n1.e4.importer-numpy` — QCM, À écrire · réponse comparée en code

*Consigne :* Quelle ligne, en tête de programme ?

- **Énoncé :** Quelle ligne charge numpy sous le nom court `np` ?
- **Réponse :** `import numpy as np`
- **Pièges :** `import np as numpy` · `numpy import as np` · `import numpy in np`

#### `python.n1.e4.role-log10` — QCM, Carte retournée

- **Énoncé :** Que calcule `np.log10(x)` ?
- **Réponse :** Le logarithme décimal : le log du cours
- **Pièges :** Le logarithme népérien : le ln de la calculatrice · Dix puissance x : 10^{x} · La racine carrée de x : √x
- **Aide :** C’est lui qui sert pour un pH ou un niveau d’intensité sonore.

#### `python.n1.e4.role-log` — QCM, Carte retournée

- **Énoncé :** Que calcule `np.log(x)` ?
- **Réponse :** Le logarithme népérien : le ln de la calculatrice
- **Pièges :** Le logarithme décimal : le log du cours de physique · Dix puissance x : 10^{x} · La racine carrée de x : √x
- **Aide :** Le piège classique de l’ECE : le log du cours s’écrit np.log10. Avec np.log, aucun message, mais un résultat faux.

#### `python.n1.e4.valeur-log10` — QCM, À écrire · réponse comparée en code

*Consigne :* Que vaut ce calcul ?

**Tirage 1**

- **Énoncé :** `np.log10(10)`
- **Réponse :** 1.0
- **Acceptées aussi à l'écrit :** 1
- **Pièges :** -1.0 · 10.0 · 2.30258509299
- **Aide :** log(10) = 1, car 10^{1} = 10.

**Tirage 2**

- **Énoncé :** `np.log10(1000)`
- **Réponse :** 3.0
- **Acceptées aussi à l'écrit :** 3
- **Pièges :** -3.0 · 30.0 · 6.90775527898 · 100.0
- **Aide :** log(1000) = 3, car 10^{3} = 1000.

**Tirage 3**

- **Énoncé :** `np.log10(0.001)`
- **Réponse :** -3.0
- **Acceptées aussi à l'écrit :** -3
- **Pièges :** 3.0 · -30.0 · -6.90775527898 · 0.0001
- **Aide :** log(0.001) = -3, car 10^{-3} = 0,001.

#### `python.n1.e4.racine` — QCM, À écrire · réponse comparée en code

- **Énoncé :** Quelle écriture calcule la racine carrée de n ?
- **Réponse :** `np.sqrt(n)`
- **Pièges :** `np.root(n)` · `n ** 2` · `np.sqr(n)`
- **Aide :** np.sqrt, « square root » en anglais. Sans import numpy as np, Python ne la connaît pas.

#### `python.n1.e4.pi` — QCM, À écrire, Carte retournée · réponse comparée en code

- **Énoncé :** Comment s’écrit π avec numpy ?
- **Réponse :** `np.pi`
- **Pièges :** `np.pi()` · `pi` · `np.PI`

#### `python.n1.e4.pH` — QCM, À écrire · réponse comparée en code

*Consigne :* Complète la ligne, comme à l’ECE.

- **Énoncé :** $\mathrm{pH} = -\log\left([\mathrm{H_3O^+}]\right)$


```python
import numpy as np
h = 1.0e-2       # [H3O+] en mol/L
pH = ……
```
- **Réponse :** `-np.log10(h)`
- **Acceptées aussi à l'écrit :** -np.log10(h) · pH = -np.log10(h) · - np.log10(h) · pH = - np.log10(h) · -np.log10(h / 1) · pH = -np.log10(h / 1)
- **Pièges :** `-np.log(h)` · `np.log10(h)` · `-np.log10(-h)`
- **Aide :** np.log10 pour le log du cours, et le signe moins devant.

#### `python.n1.e4.concentration-du-pH` — QCM, À écrire · réponse comparée en code

*Consigne :* Complète la ligne, comme à l’ECE.

- **Énoncé :** $[\mathrm{H_3O^+}] = 10^{-\mathrm{pH}}$


```python
pH_citron = 2.4
h_citron = ……   # [H3O+] en mol/L
```
- **Réponse :** `10 ** (-pH_citron)`
- **Acceptées aussi à l'écrit :** 10 ** (-pH_citron) · h_citron = 10 ** (-pH_citron) · 10 ** -pH_citron · h_citron = 10 ** -pH_citron
- **Pièges :** `10 ^ (-pH_citron)` · `-np.log10(pH_citron)` · `10e-pH_citron`
- **Aide :** Dix puissance x s’écrit 10 ** x ; les parenthèses autour de -pH_citron évitent les surprises.

#### `python.n1.e4.niveau-sonore` — QCM, À écrire · réponse comparée en code

*Consigne :* Complète la ligne, comme à l’ECE.

- **Énoncé :** $L = 10 \times \log\left(\dfrac{I}{I_0}\right)$


```python
import numpy as np
I = 1.0e-5       # en W/m²
I0 = 1.0e-12     # en W/m²
L = ……
```
- **Réponse :** `10 * np.log10(I / I0)`
- **Acceptées aussi à l'écrit :** 10 * np.log10(I / I0) · L = 10 * np.log10(I / I0) · np.log10(I / I0) * 10 · L = np.log10(I / I0) * 10
- **Pièges :** `10 * np.log(I / I0)` · `10 * np.log10(I) / I0` · `np.log10(10 * I / I0)`
- **Aide :** Avec np.log, Python afficherait 161,2 dB pour une salle de classe : un résultat absurde, sans message d’erreur.

#### `python.n1.e4.incertitude-type` — QCM, À écrire · réponse comparée en code

- **Énoncé :** Quelle ligne calcule u = s / √n ?
- **Réponse :** `u = s / np.sqrt(n)`
- **Acceptées aussi à l'écrit :** s / np.sqrt(n)
- **Pièges :** `u = np.sqrt(s / n)` · `u = s / n ** 2` · `u = s / np.sqrt(s)`

### Étape 5

#### `python.n1.e5.indice` — QCM, À écrire · réponse comparée en code

*Consigne :* Que vaut cet élément ?

**Tirage 1**

- **Énoncé :** ```python
pH = [1.03, 7.6, 1.41, 1.68]
print(pH[2])
```
- **Réponse :** 1.41
- **Pièges :** 7.6 · 1.68 · un message d’erreur
- **Aide :** Python compte à partir de 0 : pH[0] est le premier, donc pH[2] est le 3ᵉ.

**Tirage 2**

- **Énoncé :** ```python
pH = [8.2, 2.9, 5.0, 1.03, 1.41]
print(pH[3])
```
- **Réponse :** 1.03
- **Pièges :** 5.0 · 1.41 · un message d’erreur
- **Aide :** Python compte à partir de 0 : pH[0] est le premier, donc pH[3] est le 4ᵉ.

**Tirage 3**

- **Énoncé :** ```python
pH = [7.6, 1.03, 1.41, 1.68]
print(pH[2])
```
- **Réponse :** 1.41
- **Pièges :** 1.03 · 1.68 · un message d’erreur
- **Aide :** Python compte à partir de 0 : pH[0] est le premier, donc pH[2] est le 3ᵉ.

#### `python.n1.e5.len` — QCM, À écrire · réponse comparée en code

*Consigne :* Que répond Python ?

**Tirage 1**

- **Énoncé :** `len([980, 380, 990])`
- **Réponse :** 3
- **Pièges :** 2 · 4 · 2350
- **Aide :** len compte les éléments de la liste.

**Tirage 2**

- **Énoncé :** `len([130, 670, 930, 220, 450])`
- **Réponse :** 5
- **Pièges :** 4 · 6 · 2400
- **Aide :** len compte les éléments de la liste.

**Tirage 3**

- **Énoncé :** `len([890, 390, 930, 630, 110])`
- **Réponse :** 5
- **Pièges :** 4 · 6 · 2950
- **Aide :** len compte les éléments de la liste.

#### `python.n1.e5.hors-de-la-liste` — QCM, À écrire · réponse comparée en code

*Consigne :* Que répond Python ?

**Tirage 1**

- **Énoncé :** ```python
d = [1000, 1250, 1750]
print(d[3])
```
- **Réponse :** IndexError
- **Acceptées aussi à l'écrit :** une IndexError
- **Pièges :** 1750 · SyntaxError · 0
- **Aide :** Trois éléments, numérotés 0, 1 et 2 : d[3] n’existe pas.

**Tirage 2**

- **Énoncé :** ```python
d = [1500, 1750, 1250]
print(d[3])
```
- **Réponse :** IndexError
- **Acceptées aussi à l'écrit :** une IndexError
- **Pièges :** 1250 · SyntaxError · 0
- **Aide :** Trois éléments, numérotés 0, 1 et 2 : d[3] n’existe pas.

**Tirage 3**

- **Énoncé :** ```python
d = [1750, 1250, 1500]
print(d[3])
```
- **Réponse :** IndexError
- **Acceptées aussi à l'écrit :** une IndexError
- **Pièges :** 1500 · SyntaxError · 0
- **Aide :** Trois éléments, numérotés 0, 1 et 2 : d[3] n’existe pas.

#### `python.n1.e5.liste-fois-deux` — QCM

*Consigne :* Qu’affiche ce programme ?

- **Énoncé :** ```python
pH = [2.4, 2.5]
print(pH * 2)
```
- **Réponse :** `[2.4, 2.5, 2.4, 2.5]`
- **Pièges :** `[[2.4, 2.5], [2.4, 2.5]]` · `[4.8, 5.0, 4.8, 5.0]` · `array([4.8, 5. ])` · TypeError
- **Aide :** Une liste ne se prête pas au calcul : multipliée par 2, elle est recopiée deux fois.

#### `python.n1.e5.tableau-fois-deux` — QCM

*Consigne :* Qu’affiche ce programme ?

- **Énoncé :** ```python
import numpy as np
pH = np.array([2.4, 2.5])
print(pH * 2)
```
- **Réponse :** `[4.8 5. ]`
- **Pièges :** `[2.4, 2.5, 2.4, 2.5]` · `[4.8, 5.0, 4.8, 5.0]` · TypeError
- **Aide :** Un tableau numpy est multiplié valeur par valeur. print l’affiche entre crochets, sans virgules, et 5.0 s’écrit « 5. ».

#### `python.n1.e5.liste-divisee` — Vrai ou faux

- **Énoncé :** « Une liste se divise par un nombre valeur par valeur : `d / lam` marche avec `d = [1000, 1250, 1500]`. »
- **Attendu :** Faux
- **Réponse :** Faux : une liste ne se divise pas (TypeError). On la convertit d’abord : `np.array(d) / lam`.

#### `python.n1.e5.role-np-array` — QCM, Carte retournée

- **Énoncé :** À quoi sert `pH = np.array(pH)` ?
- **Réponse :** À calculer ensuite sur chaque valeur d’un coup
- **Pièges :** À ranger les valeurs de la liste dans l’ordre croissant · À afficher les valeurs sous forme de tableau · À compter les valeurs de la liste
- **Aide :** La liste devient un tableau numpy : un calcul agit alors sur chaque valeur et donne un tableau de même longueur.

#### `python.n1.e5.premier-indice` — QCM, À écrire, Carte retournée · réponse comparée en code

- **Énoncé :** Quel est l’indice du premier élément d’une liste ?
- **Réponse :** 0
- **Pièges :** 1 · -1 · Il n’a pas d’indice
- **Aide :** Python compte à partir de 0 : pH[0] est le premier élément.

#### `python.n1.e5.virgules` — Vrai ou faux

- **Énoncé :** « Dans `pH = [2.4, 2.5, 2.9]`, les virgules séparent les valeurs et les points sont les séparateurs décimaux. »
- **Attendu :** Vrai
- **Réponse :** Vrai : c’est là que sert la virgule en Python, jamais comme séparateur décimal.

#### `python.n1.e5.ecart-mesure-modele` — QCM, À écrire · réponse comparée en code

*Consigne :* Complète la ligne : pour chaque solution, pH mesuré moins pH théorique.

- **Énoncé :** ```python
pH = np.array([1.03, 1.41, 1.68, 2.08, 2.25])   # mesurés
pH_th = -np.log10(c)                            # théoriques
ecart = ……
```
- **Réponse :** `pH - pH_th`
- **Acceptées aussi à l'écrit :** ecart = pH - pH_th
- **Pièges :** `pH_th - pH` · `pH - pH_th[0]` · `pH[0] - pH_th`
- **Aide :** Deux tableaux de même longueur se soustraient valeur par valeur, dans l’ordre demandé : mesuré moins théorique.

### Étape 6

#### `python.n1.e6.role-mean` — QCM, Carte retournée

- **Énoncé :** Que calcule `np.mean(x)` ?
- **Réponse :** La moyenne de la série x
- **Pièges :** L’écart-type de la série x · Le nombre de valeurs de x · La somme des valeurs de x

#### `python.n1.e6.ddof` — QCM, Carte retournée

- **Énoncé :** Pourquoi écrire `ddof=1` dans `np.std(x, ddof=1)` ?
- **Réponse :** Pour diviser par n − 1, comme dans le cours
- **Pièges :** Pour arrondir l’écart-type à 1 chiffre après la virgule · Pour ne pas compter la première mesure · Pour diviser par n, comme le cours
- **Aide :** Sans ddof=1, numpy divise par n : ce n’est pas l’écart-type expérimental qu’on utilise.

#### `python.n1.e6.ecart-type` — QCM, À écrire · réponse comparée en code

*Consigne :* Complète la ligne, comme à l’ECE.

- **Énoncé :** Écart-type expérimental de la série `m` :


```python
m = np.array([55.47, 55.43, 55.45, 55.44, 55.48])   # en g
s = ……
```
- **Réponse :** `np.std(m, ddof=1)`
- **Acceptées aussi à l'écrit :** np.std(m, ddof=1) · s = np.std(m, ddof=1) · np.std(m, ddof = 1) · s = np.std(m, ddof = 1)
- **Pièges :** `np.std(m)` · `np.mean(m, ddof=1)` · `np.std(m, ddof=0)`

#### `python.n1.e6.incertitude-ece` — QCM, À écrire · réponse comparée en code

*Consigne :* Complète la ligne, comme à l’ECE.

- **Énoncé :** $u(\bar{x}) = \dfrac{s(x)}{\sqrt{n}}$


```python
n = len(x)
u = np.std(x, ddof=1) / ……
```
- **Réponse :** `np.sqrt(n)`
- **Acceptées aussi à l'écrit :** np.sqrt(len(x)) · u = np.std(x, ddof=1) / np.sqrt(n)
- **Pièges :** `len(x)` · `np.sqrt(x)` · `np.sqrt(n - 1)`
- **Aide :** C’est la ligne qu’on retrouve dans huit sujets d’ECE : l’écart-type expérimental divisé par la racine du nombre de mesures.

#### `python.n1.e6.len-donne-n` — QCM, Carte retournée

- **Énoncé :** Dans une série de mesures `x`, que donne `len(x)` ?
- **Réponse :** Le nombre n de mesures
- **Pièges :** La dernière mesure de la série · L’écart entre les deux mesures extrêmes · La somme des mesures

### Étape 7

#### `python.n1.e7.importer-pyplot` — QCM, À écrire · réponse comparée en code

- **Énoncé :** Quelle ligne charge pyplot sous le nom court `plt` ?
- **Réponse :** `import matplotlib.pyplot as plt`
- **Pièges :** `import matplotlib as plt` · `import pyplot.matplotlib as plt` · `import plt as matplotlib.pyplot`

#### `python.n1.e7.style-de-trace` — QCM

*Consigne :* Que trace cette ligne ?

**Tirage 1**

- **Énoncé :** `plt.plot(x, y, 'go')`
- **Réponse :** Des ronds verts
- **Pièges :** Des croix bleues · Une ligne rouge · Un histogramme bleu
- **Aide :** La lettre donne la couleur (b bleu, r rouge, g vert), le signe la forme (+ croix, o ronds, - ligne).

**Tirage 2**

- **Énoncé :** `plt.plot(x, y, 'r-')`
- **Réponse :** Une ligne rouge
- **Pièges :** Des croix bleues · Des ronds verts · Un histogramme bleu
- **Aide :** La lettre donne la couleur (b bleu, r rouge, g vert), le signe la forme (+ croix, o ronds, - ligne).

**Tirage 3**

- **Énoncé :** `plt.plot(x, y, 'go')`
- **Réponse :** Des ronds verts
- **Pièges :** Des croix bleues · Une ligne rouge · Un histogramme bleu
- **Aide :** La lettre donne la couleur (b bleu, r rouge, g vert), le signe la forme (+ croix, o ronds, - ligne).

#### `python.n1.e7.role-legend` — QCM, Carte retournée

- **Énoncé :** Que fait `plt.legend()` ?
- **Réponse :** Il affiche le nom de chaque série, donné par label
- **Pièges :** Il écrit la légende de l’axe des abscisses, sous le graphique · Il ajoute un titre au-dessus du graphique · Il ajoute un quadrillage au graphique

#### `python.n1.e7.legende-des-axes` — QCM, À écrire · réponse comparée en code

*Consigne :* Quelle instruction ?

- **Énoncé :** Légender l’axe des abscisses « c (mmol/L) »
- **Réponse :** `plt.xlabel('c (mmol/L)')`
- **Pièges :** `plt.ylabel('c (mmol/L)')` · `plt.title('c (mmol/L)')` · `plt.legend('c (mmol/L)')`
- **Aide :** xlabel pour l’axe horizontal, ylabel pour l’axe vertical.

#### `python.n1.e7.linspace` — QCM, Carte retournée

- **Énoncé :** Que crée `np.linspace(0, 11, 100)` ?
- **Réponse :** 100 valeurs régulièrement espacées de 0 à 11
- **Pièges :** 11 valeurs régulièrement espacées de 0 à 100 · Les nombres entiers de 0 à 11, cent fois · 100 valeurs tirées au hasard entre 0 et 11
- **Aide :** Idéal pour tracer une courbe de modèle bien lisse.

#### `python.n1.e7.histogramme` — QCM, À écrire · réponse comparée en code

*Consigne :* Complète la ligne.

- **Énoncé :** Tracer l’histogramme de `m` en 5 classes :


```python
m = np.array([55.47, 55.43, 55.45, 55.44, 55.48])
……
plt.show()
```
- **Réponse :** `plt.hist(m, bins=5)`
- **Acceptées aussi à l'écrit :** plt.hist(m, bins=5, edgecolor='black')
- **Pièges :** `plt.plot(m, bins=5)` · `plt.hist(bins=5)` · `plt.hist(5, bins=m)`

#### `python.n1.e7.show` — QCM, À écrire · réponse comparée en code

- **Énoncé :** Quelle instruction affiche le graphique ?
- **Réponse :** `plt.show()`
- **Pièges :** `plt.plot()` · `plt.legend()` · `print(plt)`
- **Aide :** Toutes les autres lignes du graphique (points, légendes, titre) se placent avant plt.show().

#### `python.n1.e7.tracer-le-modele` — QCM

*Consigne :* Quelle ligne trace le modèle ?

- **Énoncé :** ```python
c = np.array([1.0, 2.5, 5.0, 8.0, 10.0])
sigma = np.array([0.162, 0.330, 0.605, 0.925, 1.158])
k = 0.1172
c_mod = np.linspace(0, 11, 100)
sigma_mod = k * c_mod
```
- **Réponse :** `plt.plot(c_mod, sigma_mod, 'r-')`
- **Pièges :** `plt.plot(c, sigma_mod, 'r-')` · `plt.plot(c_mod, sigma_mod, 'b+')` · `plt.plot(c_mod, sigma, 'r-')`
- **Aide :** Le modèle se trace avec c_mod : avec c, les deux tableaux n’ont pas la même longueur (ValueError).

### Étape 8

#### `python.n1.e8.type-d-erreur` — QCM, À écrire · réponse comparée en code

*Consigne :* Quelle erreur Python signale-t-il ?

**Tirage 1**

- **Énoncé :** ```python
import numpy as np
import matplotlib.pyplot as plt
c = np.array([1.0, 2.0, 3.0])
A = np.array([0.125, 0.249])
plt.plot(c, A, 'b+')
```
- **Réponse :** ValueError
- **Pièges :** SyntaxError · NameError · TypeError
- **Aide :** Trois concentrations, deux absorbances : les tableaux n’ont pas la même longueur.

**Tirage 2**

- **Énoncé :** ```python
A = 0.47
k = 0,124
c = A / k
```
- **Réponse :** TypeError
- **Pièges :** SyntaxError · NameError · ValueError
- **Aide :** 0,124 n’est pas un nombre mais une paire (0, 124) : on ne divise pas par une paire.

**Tirage 3**

- **Énoncé :** ```python
print('Hz' + 500)
```
- **Réponse :** TypeError
- **Pièges :** SyntaxError · NameError · ValueError
- **Aide :** Un texte et un nombre ne s’ajoutent pas.

#### `python.n1.e8.erreur-silencieuse` — QCM, Carte retournée

- **Énoncé :** Que se passe-t-il avec `c_mere = 10^-2` ?
- **Réponse :** Aucun message, mais une valeur fausse
- **Pièges :** Une SyntaxError : ^ n’existe pas en Python · c_mere vaut bien 0.01, sans erreur · Une TypeError sur cette ligne
- **Aide :** En Python, ^ n’est pas la puissance : le programme tourne et affiche une concentration négative. On écrit 1e-2 ou 10 ** -2.

#### `python.n1.e8.ligne-signalee` — Vrai ou faux

- **Énoncé :** « La ligne signalée par Python est toujours celle qu’il faut corriger. »
- **Attendu :** Faux
- **Réponse :** Faux : l’erreur peut être née plus haut. Avec `k = 0,124`, Python signale la ligne suivante, `c = A / k`. Remonte.

#### `python.n1.e8.virgule-decimale` — QCM, Carte retournée

- **Énoncé :** Que contient `k` après `k = 0,124` ?
- **Réponse :** Une paire de deux nombres, 0 et 124
- **Pièges :** Le nombre 0,124, écrit à la française · Le nombre 124, sans le zéro · Rien : la ligne provoque une erreur
- **Aide :** La virgule sépare des valeurs. Le séparateur décimal est le point : k = 0.124.

#### `python.n1.e8.longueurs-differentes` — QCM, Carte retournée

- **Énoncé :** `plt.plot(c, A)` répond `ValueError: x and y must have same first dimension`. Que vérifier ?
- **Réponse :** Que c et A ont autant de valeurs
- **Pièges :** Que plt.show() est bien appelé à la fin · Que c et A sont des listes · Que numpy est bien importé
- **Aide :** Une mesure oubliée à la saisie : l’erreur la plus fréquente de l’ECE.

#### `python.n1.e8.programme-ece` — QCM, Carte retournée

*Consigne :* Que dois-tu modifier dans ce programme d’ECE ?

- **Énoncé :** ```python
V = np.array([1, 1, 1, 1, 1])   # A MODIFIER  Volume (cm³)
P = np.array([1, 1, 1, 1, 1])   # A MODIFIER  Pression (hPa)
n = len(V)
k_moy = np.mean(P * V)
```
- **Réponse :** Les lignes « A MODIFIER », avec mes mesures
- **Pièges :** Tout le programme, en le réécrivant · Les lignes de calcul de n et de k_moy, à adapter · Rien : on l’exécute tel quel
- **Aide :** On remplace les 1 par ses mesures, avec des points décimaux et autant de valeurs dans chaque tableau. Tout le reste est fourni.
