/* Paquet « Python pour l'ECE » : un niveau par niveau du parcours Python de
 * Résonance (tutorat_pc_isaac/outils/python/). Seul le niveau 1 est écrit.
 *
 * RÈGLE : une carte n'interroge que ce que niveau-1.html montre — étape par
 * étape, dans ses encadrés « À retenir », ses quiz et ses solutions. Les
 * contextes de physique sont ceux des exercices (TP1, TP3, TP4, TP5, TP6).
 *
 * Le code s'écrit entre accents graves (05-formules.js) : `np.log10(x)` dans
 * la ligne, ```…``` pour un bloc. Une réponse à écrire en code porte
 * comparaison: 'code' : espaces ignorés, guillemets droits ou courbes, mais
 * '3' n'est pas 3.
 *
 * Variété voulue par Loïc (19/10/2026) : « qu'affiche Python ? », compléter une
 * ligne comme à l'ECE, définition et rôle d'une fonction, usage, lire une erreur.
 *
 * RÈGLE ABSOLUE (32-paquets.js) : un identifiant de carte ne change jamais.
 */

/* ---------- Outils ---------- */

const pyC = (s) => `\`${s}\``;
const pyBloc = (lignes) => `\`\`\`\n${[].concat(lignes).join('\n')}\n\`\`\``;

/** Un nombre à virgule tel que Python l'affiche : 4 → « 4.0 », 3.5 → « 3.5 ». */
function pyFlottant(x) {
  const net = Number(x.toPrecision(12));
  return Number.isInteger(net) ? `${net}.0` : String(net);
}

/** Les réponses écrites d'une ligne à compléter : avec ou sans le début « nom = ». */
function pyVariantes(debut, expressions) {
  return expressions.flatMap((e) => [e, `${debut} ${e}`]);
}

const PY_ERREURS = ['SyntaxError', 'NameError', 'TypeError', 'ValueError'];

/* ---------- Étape 1 · Python, une calculatrice ---------- */

const PY_N1_E1 = [
  {
    id: 'python.n1.e1.division',
    question: `Que répond Python à une division ${pyC('/')} ?`,
    consigne: 'Que répond Python ?',
    formats: ['qcm', 'saisie'],
    comparaison: 'code',
    generer() {
      const b = auHasard([2, 4, 5]);
      const exacte = pileOuFace();
      const a = exacte ? b * entierEntre(2, 9) : b * entierEntre(2, 9) + auHasard(b === 4 ? [1, 2, 3] : [1]);
      const r = a / b;
      const entier = Math.trunc(r);
      return {
        question: pyC(`${a} / ${b}`),
        reponse: pyFlottant(r),
        distracteurs: pieges(pyFlottant(r), exacte
          ? [String(r), `${r},0`, String(r + 1), `${a}/${b}`]
          : [String(entier), pyFlottant(r).replace('.', ','), String(entier + 1), `${entier}.0`]),
        aide: 'La division / donne toujours un nombre à virgule, écrit avec un point.',
      };
    },
  },
  {
    id: 'python.n1.e1.puissance',
    question: `Que répond Python à une puissance ${pyC('**')} ?`,
    consigne: 'Que répond Python ?',
    formats: ['qcm', 'saisie'],
    comparaison: 'code',
    generer() {
      const [a, b] = auHasard([[2, 3], [3, 2], [2, 4], [5, 2], [10, 3], [4, 3], [3, 3]]);
      const r = a ** b;
      return {
        question: pyC(`${a} ** ${b}`),
        reponse: String(r),
        // b ** a seulement s'il reste vraisemblable : 3 ** 10 = 59049 s'éliminerait d'un coup d'œil.
        distracteurs: pieges(String(r), [String(a * b), b ** a <= 10 * r ? String(b ** a) : null, `${r}.0`, String(a + b), `${a}${b}`]
          .filter(Boolean)),
        aide: `** est la puissance : ${a}^{${b}} = ${r}. Aucun des deux nombres n'a de virgule, le résultat est un entier.`,
      };
    },
  },
  {
    id: 'python.n1.e1.priorites',
    question: 'Dans quel ordre Python fait-il les calculs ?',
    consigne: 'Que répond Python ?',
    formats: ['qcm', 'saisie'],
    comparaison: 'code',
    generer() {
      const c = auHasard([2, 4, 5]);
      const b = c * entierEntre(1, 3);
      const a = b + c * entierEntre(1, 4);
      const parentheses = pileOuFace();
      const r = parentheses ? (a - b) / c : a - b / c;
      const autre = parentheses ? a - b / c : (a - b) / c;
      return {
        question: pyC(parentheses ? `(${a} - ${b}) / ${c}` : `${a} - ${b} / ${c}`),
        reponse: pyFlottant(r),
        distracteurs: pieges(pyFlottant(r), [pyFlottant(autre), String(r), String(autre), pyFlottant(r + c), pyFlottant(r - 1)]),
        aide: parentheses
          ? 'Les parenthèses passent en premier, puis la division, qui donne un nombre à virgule.'
          : 'La division passe avant la soustraction, comme sur la calculatrice ; elle donne un nombre à virgule.',
      };
    },
  },
  {
    id: 'python.n1.e1.notation-e',
    question: 'Écrire une valeur en écriture scientifique dans Python',
    consigne: 'Comment l’écrire dans Python ?',
    formats: ['qcm', 'saisie'],
    comparaison: 'code',
    generer() {
      const [m, n] = auHasard([['3.00', 8], ['1.0', -12], ['6.02', 23], ['4.0', -5], ['1.6', -19], ['3.4', 2]]);
      const mFr = m.replace('.', ',');
      const juste = `${m}e${n}`;
      return {
        question: `${mFr} × 10^{${n}}`,
        reponse: pyC(juste),
        saisie: [juste, `${m}E${n}`, `${m} * 10 ** ${n}`, `${m} * 10 ** (${n})`, `${m}*10**${n}`],
        distracteurs: pieges(pyC(juste), [pyC(`${mFr}e${n}`), pyC(`${m}^${n}`), pyC(`${m}e${-n}`), pyC(`${m} * 10^${n}`)]),
        aide: 'Le e se lit « fois 10 puissance », et le séparateur décimal est le point.',
      };
    },
  },
  {
    id: 'python.n1.e1.e-donne-un-flottant',
    question: `Que répond Python à une valeur écrite avec ${pyC('e')} ?`,
    consigne: 'Que répond Python ?',
    formats: ['qcm', 'saisie'],
    comparaison: 'code',
    generer() {
      const a = entierEntre(2, 9);
      const n = auHasard([2, 3]);
      const r = a * 10 ** n;
      return {
        question: pyC(`${a}e${n}`),
        reponse: `${r}.0`,
        distracteurs: pieges(`${r}.0`, [String(r), `${a * 10 ** (n + 1)}.0`, String(a * n), `${a}${n}`, String(a ** n)]),
        aide: `${a}e${n} se lit « ${a} fois 10 puissance ${n} ». Une valeur écrite avec e est toujours un nombre à virgule.`,
      };
    },
  },
  {
    id: 'python.n1.e1.puissance-negative',
    question: pyC('10 ** -3'),
    consigne: 'Que répond Python ?',
    formats: ['qcm', 'saisie'],
    comparaison: 'code',
    reponse: '0.001',
    distracteurs: ['-1000', '0.0001', '-30', '1000.0'],
    aide: '10^{-3} = 1 / 1000 = 0,001. Une puissance négative ne rend pas le nombre négatif : elle le rend petit.',
  },
  {
    id: 'python.n1.e1.piege-10e-12',
    question: `« Dans Python, ${pyC('10e-12')} vaut 10^{-12}. »`,
    formats: ['vraifaux'],
    vrai: false,
    reponse: `Faux : ${pyC('10e-12')} vaut 10 × 10^{-12} = 10^{-11}. Le seuil d'audibilité s'écrit ${pyC('1.0e-12')}.`,
  },
];

/* ---------- Étape 2 · Ranger des valeurs dans des variables ---------- */

const PY_NOMS = [
  ['f_E', true, 'Lettres, chiffres et _ : un nom correct.'],
  ['S1M', true, 'Il commence par une lettre : un nom correct.'],
  ['lam', true, 'C’est justement le nom qu’on donne à λ.'],
  ['delta_f', true, 'Le _ remplace l’espace : un nom correct.'],
  ['delta f', false, 'Un nom de variable ne contient pas d’espace : on écrit delta_f.'],
  ['2D', false, 'Un nom de variable commence par une lettre. Et 2 × D s’écrit 2 * D.'],
  ['lambda', false, 'lambda est un mot réservé du langage : on écrit lam.'],
  ['import', false, 'import est un mot réservé du langage.'],
];

const PY_N1_E2 = [
  {
    id: 'python.n1.e2.signe-egal',
    question: `Que signifie ${pyC('=')} dans ${pyC('c = 340')} ?`,
    formats: ['qcm', 'retournement'],
    reponse: 'Ranger la valeur 340 dans la variable c',
    distracteurs: ['Vérifier que la variable c est bien égale à 340', 'Afficher la valeur de c, soit 340', 'Comparer c et 340, comme une égalité en maths'],
    aide: 'Le signe = n’est pas une égalité : Python calcule ce qui est à droite, puis le range dans la variable de gauche.',
  },
  {
    id: 'python.n1.e2.f-egal-f-fois',
    question: 'Une variable qui reçoit une nouvelle valeur',
    consigne: 'Qu’affiche ce programme ?',
    formats: ['qcm', 'saisie'],
    comparaison: 'code',
    generer() {
      const f = auHasard([440, 500, 250, 300]);
      const k = auHasard([2, 3, 4]);
      return {
        question: pyBloc([`f = ${f}`, `f = f * ${k}`, 'print(f)']),
        reponse: String(f * k),
        distracteurs: pieges(String(f * k), [String(f), `${f} puis ${f * k}`, 'un message d’erreur', `f * ${k}`]),
        aide: `La 2ᵉ ligne se lit de droite à gauche : Python calcule f * ${k} avec l’ancienne valeur, puis range le résultat dans f. Un seul print, donc un seul affichage.`,
      };
    },
  },
  {
    id: 'python.n1.e2.nom-de-variable',
    question: 'Ce nom peut-il servir de variable ?',
    formats: ['vraifaux'],
    generer() {
      const [nom, vrai, explication] = auHasard(PY_NOMS);
      return {
        question: `« ${pyC(nom)} peut servir de nom de variable. »`,
        vrai,
        reponse: `${vrai ? 'Vrai' : 'Faux'} : ${explication}`,
      };
    },
  },
  {
    id: 'python.n1.e2.mot-reserve',
    question: 'Lequel de ces noms ne peut pas servir de variable ?',
    formats: ['qcm'],
    reponse: pyC('lambda'),
    distracteurs: [pyC('delta_f'), pyC('lam_max'), pyC('pH_citron'), pyC('theta')],
    aide: 'lambda est un des mots réservés du langage, comme if, for, in, def, import : c’est pourquoi on écrit lam pour λ.',
  },
  {
    id: 'python.n1.e2.majuscules',
    question: `« ${pyC('c')} et ${pyC('C')} désignent la même variable. »`,
    formats: ['vraifaux'],
    vrai: false,
    reponse: 'Faux : Python distingue majuscules et minuscules. Utiliser C quand la variable s’appelle c donne une NameError.',
  },
  {
    id: 'python.n1.e2.commentaire',
    question: `À quoi sert ${pyC('#')} dans ${pyC('f = 500   # en Hz')} ?`,
    formats: ['qcm', 'retournement'],
    reponse: 'À écrire un commentaire, que Python ignore',
    distracteurs: ['À indiquer à Python l’unité de la valeur de f', 'À afficher la ligne pendant l’exécution', 'À signaler une ligne que l’élève doit modifier'],
    aide: 'Tout ce qui suit # est ignoré par Python : on y note les unités, pour soi et pour le correcteur.',
  },
  {
    id: 'python.n1.e2.rien-sans-print',
    question: `« Dans un script, la ligne ${pyC('lam = c / f')} affiche la valeur de lam. »`,
    formats: ['vraifaux'],
    vrai: false,
    reponse: `Faux : elle calcule et range la valeur, sans rien afficher. Dans un script, rien ne s’affiche sans ${pyC('print(lam)')}.`,
  },
  {
    id: 'python.n1.e2.doppler-exact',
    question: `${String.raw`$f_R = f_E \times \dfrac{c}{c - v}$`}
${pyBloc(['f_E = 40000      # fréquence émise, en Hz', 'v = 2.0          # en m/s', 'c = 340          # en m/s', 'f_R = ……'])}`,
    consigne: 'Complète la ligne, comme à l’ECE.',
    formats: ['qcm', 'saisie'],
    comparaison: 'code',
    reponse: pyC('f_E * c / (c - v)'),
    saisie: pyVariantes('f_R =', ['f_E * c / (c - v)', 'c * f_E / (c - v)', 'f_E * (c / (c - v))', 'c / (c - v) * f_E']),
    distracteurs: [pyC('f_E * c / c - v'), pyC('f_E * c / (v - c)'), pyC('f_E * (c - v) / c'), pyC('f_E * v / c')],
    aide: 'Sans les parenthèses autour de c - v, Python diviserait par c seulement, puis retrancherait v.',
  },
  {
    id: 'python.n1.e2.difference-de-marche',
    question: 'Interférences : le rapport δ / λ',
    consigne: 'Qu’affiche ce programme ?',
    formats: ['qcm', 'saisie'],
    comparaison: 'code',
    generer() {
      const lam = 500;
      const s1 = auHasard([1000, 1500, 2000, 2500]);
      const demi = pileOuFace();
      const k = entierEntre(1, 4);
      const s2 = s1 + k * lam + (demi ? lam / 2 : 0);
      const r = (s2 - s1) / lam;
      return {
        question: pyBloc(['lam = 500        # en nm', `S1M = ${s1}`, `S2M = ${s2}`, 'delta = S2M - S1M', 'print(delta / lam)']),
        reponse: pyFlottant(r),
        distracteurs: pieges(pyFlottant(r), [String(s2 - s1), pyFlottant(r + 1), String(Math.trunc(r)), pyFlottant(s2 / lam)]),
        aide: demi
          ? 'Un entier plus un demi : interférences destructives.'
          : 'Un nombre entier : interférences constructives. La division donne quand même un nombre à virgule.',
      };
    },
  },
];

/* ---------- Étape 3 · Types de valeurs et affichage ---------- */

const PY_TYPES = [
  ['type(2.5)', 'float', '2.5 a une virgule (un point, en Python) : c’est un float.'],
  ["type('2.5')", 'str', 'Les guillemets en font un texte, même s’il ressemble à un nombre.'],
  ['type(6 / 3)', 'float', 'La division donne toujours un nombre à virgule : 6 / 3 vaut 2.0.'],
  ['type(340)', 'int', 'Un nombre sans virgule est un entier : int.'],
  ["type('340')", 'str', 'Entre guillemets, 340 n’est pas un nombre mais trois caractères.'],
  ['type(3e2)', 'float', 'Une valeur écrite avec e est toujours un nombre à virgule.'],
  ['type(2 ** 3)', 'int', 'Aucun des deux nombres n’a de virgule : le résultat est un entier.'],
];

const PY_ARRONDIS = [
  [3.14159, 2], [3.14159, 1], [0.68372, 2], [236.68639, 2], [9.80665, 1], [1.41421, 3], [0.00227, 4], [55.4486, 1],
];

const PY_N1_E3 = [
  {
    id: 'python.n1.e3.type',
    question: `Que répond ${pyC('type(…)')} ?`,
    consigne: 'Quel est le type de cette valeur ?',
    formats: ['qcm', 'saisie'],
    comparaison: 'code',
    generer() {
      const [expression, type, aide] = auHasard(PY_TYPES);
      return {
        question: pyC(expression),
        reponse: type,
        saisie: [`<class '${type}'>`],
        distracteurs: ['int', 'float', 'str', 'un message d’erreur'].filter((t) => t !== type),
        aide: `${aide} Python l’écrit <class '${type}'>.`,
      };
    },
  },
  {
    id: 'python.n1.e3.textes-bout-a-bout',
    question: 'Deux textes ajoutés',
    consigne: 'Que répond Python ?',
    formats: ['qcm', 'saisie'],
    comparaison: 'code',
    generer() {
      const [a, b] = auHasard([['40', '00'], ['340', '1'], ['5', '00'], ['12', '3']]);
      const somme = String(Number(a) + Number(b));
      return {
        question: pyC(`'${a}' + '${b}'`),
        reponse: pyC(`'${a}${b}'`),
        saisie: [`'${a}${b}'`],
        distracteurs: pieges(pyC(`'${a}${b}'`), [pyC(somme), pyC(`'${somme}'`), pyC(`${a}${b}`), pyC(`'${a} ${b}'`)]),
        aide: 'Deux textes s’ajoutent bout à bout ; le résultat est encore un texte, d’où les guillemets.',
      };
    },
  },
  {
    id: 'python.n1.e3.texte-plus-nombre',
    question: pyC("'Hz' + 500"),
    consigne: 'Que répond Python ?',
    formats: ['qcm', 'saisie'],
    comparaison: 'code',
    reponse: 'TypeError',
    saisie: ['une TypeError', 'TypeError (erreur)'],
    distracteurs: ['SyntaxError', pyC("'Hz500'"), pyC("'Hz 500'")],
    aide: 'Un texte et un nombre ne s’ajoutent pas. Pour afficher les deux, on les sépare par une virgule dans print.',
  },
  {
    id: 'python.n1.e3.print-morceaux',
    question: `Qu’affiche un ${pyC('print')} à plusieurs morceaux ?`,
    consigne: 'Qu’affiche Python ?',
    formats: ['qcm'],
    generer() {
      const [nom, valeur, unite] = auHasard([['f =', '500', 'Hz'], ['c =', '340', 'm/s'], ['T =', '0.002', 's'], ['L =', '70.0', 'dB']]);
      const nomSeul = nom.slice(0, -2);
      return {
        question: pyC(`print('${nom}', ${valeur}, '${unite}')`),
        reponse: pyC(`${nom} ${valeur} ${unite}`),
        distracteurs: [pyC(`${nomSeul}=${valeur}${unite}`), pyC(`${nom} ${valeur}${unite}`), pyC(`'${nom}', ${valeur}, '${unite}'`)],
        aide: 'print affiche chaque morceau sans les guillemets, avec une espace entre deux morceaux.',
      };
    },
  },
  {
    id: 'python.n1.e3.round',
    question: `Que répond ${pyC('round(x, n)')} ?`,
    consigne: 'Que répond Python ?',
    formats: ['qcm', 'saisie'],
    comparaison: 'code',
    generer() {
      const [x, n] = auHasard(PY_ARRONDIS);
      const arrondi = (v, k) => Number(v.toFixed(k));
      const r = pyFlottant(arrondi(x, n));
      return {
        question: pyC(`round(${x}, ${n})`),
        reponse: r,
        distracteurs: pieges(r, [pyFlottant(arrondi(x, n + 1)), pyFlottant(arrondi(x, Math.max(n - 1, 0))),
          String(Math.round(x)), pyFlottant(Math.trunc(x * 10 ** n + 1) / 10 ** n)]),
        aide: `round(x, ${n}) garde ${n} chiffre${n > 1 ? 's' : ''} après la virgule, en arrondissant au plus proche.`,
      };
    },
  },
  {
    id: 'python.n1.e3.afficher-nom-valeur-unite',
    question: `Le programme doit afficher exactement : ${pyC('T = 0.002 s')}
${pyBloc(['f = 500', 'T = 1 / f        # période, en s', '……'])}`,
    consigne: 'Complète la dernière ligne.',
    formats: ['qcm', 'saisie'],
    comparaison: 'code',
    reponse: pyC("print('T =', T, 's')"),
    saisie: ["'T =', T, 's'"],
    distracteurs: [pyC("print('T =' + T + 's')"), pyC("print('T =', 'T', 's')"), pyC('print(T = T s)')],
    aide: 'Trois morceaux séparés par des virgules : un texte entre guillemets, la variable sans guillemets, l’unité entre guillemets.',
  },
  {
    id: 'python.n1.e3.arrondir-a-l-affichage',
    consigne: 'Complète pour afficher delta_f arrondi à 2 chiffres après la virgule.',
    formats: ['qcm', 'saisie'],
    comparaison: 'code',
    question: pyBloc("print('Décalage Doppler :', ……, 'Hz')"),
    reponse: pyC('round(delta_f, 2)'),
    saisie: ["print('Décalage Doppler :', round(delta_f, 2), 'Hz')"],
    distracteurs: [pyC('round(2, delta_f)'), pyC('round(delta_f, 0.01)'), pyC('round(delta_f)')],
    aide: 'D’abord la valeur à arrondir, puis le nombre de chiffres après la virgule.',
  },
  {
    id: 'python.n1.e3.fonctions-integrees',
    question: `« Pour utiliser ${pyC('print')}, ${pyC('round')} ou ${pyC('type')}, il faut d’abord importer une bibliothèque. »`,
    formats: ['vraifaux'],
    vrai: false,
    reponse: 'Faux : ce sont des fonctions intégrées à Python, disponibles sans import.',
  },
  {
    id: 'python.n1.e3.sans-guillemets',
    question: `Que fait Python de ${pyC('Hz')} écrit sans guillemets ?`,
    formats: ['qcm', 'retournement'],
    reponse: 'Il cherche une variable nommée Hz',
    distracteurs: ['Il l’affiche comme un texte', 'Il le remplace par l’unité hertz', 'Il l’ignore, comme un commentaire'],
    aide: 'Sans guillemets, c’est un nom : si aucune variable ne s’appelle Hz, Python répond NameError.',
  },
  {
    id: 'python.n1.e3.multiplication-explicite',
    question: 'Diffraction : quelle ligne calcule L = 2Dθ ?',
    consigne: 'Quelle ligne est correcte ?',
    formats: ['qcm', 'saisie'],
    comparaison: 'code',
    reponse: pyC('L = 2 * D * theta'),
    saisie: ['L = 2 * theta * D', 'L = D * 2 * theta', 'L = 2 * (D * theta)'],
    distracteurs: [pyC('L = 2D * theta'), pyC('L = 2 (D * theta)'), pyC('L = 2 ** D * theta'), pyC('L = 2 * D theta')],
    aide: 'Python n’accepte pas 2D : la multiplication s’écrit toujours avec *.',
  },
];

/* ---------- Étape 4 · La bibliothèque numpy ---------- */

const PY_LOG10 = [[100, '2.0'], [1000, '3.0'], [10, '1.0'], [0.01, '-2.0'], [0.001, '-3.0']];

const PY_N1_E4 = [
  {
    id: 'python.n1.e4.importer-numpy',
    question: `Quelle ligne charge numpy sous le nom court ${pyC('np')} ?`,
    consigne: 'Quelle ligne, en tête de programme ?',
    formats: ['qcm', 'saisie'],
    comparaison: 'code',
    reponse: pyC('import numpy as np'),
    distracteurs: [pyC('import np as numpy'), pyC('numpy import as np'), pyC('import numpy in np')],
  },
  {
    id: 'python.n1.e4.role-log10',
    question: `Que calcule ${pyC('np.log10(x)')} ?`,
    formats: ['qcm', 'retournement'],
    reponse: 'Le logarithme décimal : le log du cours',
    distracteurs: ['Le logarithme népérien : le ln de la calculatrice', 'Dix puissance x : 10^{x}', 'La racine carrée de x : √x'],
    aide: 'C’est lui qui sert pour un pH ou un niveau d’intensité sonore.',
  },
  {
    id: 'python.n1.e4.role-log',
    question: `Que calcule ${pyC('np.log(x)')} ?`,
    formats: ['qcm', 'retournement'],
    reponse: 'Le logarithme népérien : le ln de la calculatrice',
    distracteurs: ['Le logarithme décimal : le log du cours de physique', 'Dix puissance x : 10^{x}', 'La racine carrée de x : √x'],
    aide: 'Le piège classique de l’ECE : le log du cours s’écrit np.log10. Avec np.log, aucun message, mais un résultat faux.',
  },
  {
    id: 'python.n1.e4.valeur-log10',
    question: `Que vaut ${pyC('np.log10(…)')} ?`,
    consigne: 'Que vaut ce calcul ?',
    formats: ['qcm', 'saisie'],
    comparaison: 'code',
    generer() {
      const [x, r] = auHasard(PY_LOG10);
      const n = Number(r);
      return {
        question: pyC(`np.log10(${x})`),
        reponse: r,
        saisie: [String(n)],
        distracteurs: pieges(r, [pyFlottant(-n), pyFlottant(10 * n), pyFlottant(Math.log(x)), pyFlottant(x / 10)]),
        aide: `log(${x}) = ${n}, car 10^{${n}} = ${String(x).replace('.', ',')}.`,
      };
    },
  },
  {
    id: 'python.n1.e4.racine',
    question: 'Quelle écriture calcule la racine carrée de n ?',
    formats: ['qcm', 'saisie'],
    comparaison: 'code',
    reponse: pyC('np.sqrt(n)'),
    distracteurs: [pyC('np.root(n)'), pyC('n ** 2'), pyC('np.sqr(n)')],
    aide: 'np.sqrt, « square root » en anglais. Sans import numpy as np, Python ne la connaît pas.',
  },
  {
    id: 'python.n1.e4.pi',
    question: 'Comment s’écrit π avec numpy ?',
    formats: ['qcm', 'saisie', 'retournement'],
    comparaison: 'code',
    reponse: pyC('np.pi'),
    distracteurs: [pyC('np.pi()'), pyC('pi'), pyC('np.PI')],
  },
  {
    id: 'python.n1.e4.pH',
    question: `${String.raw`$\mathrm{pH} = -\log\left([\mathrm{H_3O^+}]\right)$`}
${pyBloc(['import numpy as np', 'h = 1.0e-2       # [H3O+] en mol/L', 'pH = ……'])}`,
    consigne: 'Complète la ligne, comme à l’ECE.',
    formats: ['qcm', 'saisie'],
    comparaison: 'code',
    reponse: pyC('-np.log10(h)'),
    saisie: pyVariantes('pH =', ['-np.log10(h)', '- np.log10(h)', '-np.log10(h / 1)']),
    distracteurs: [pyC('-np.log(h)'), pyC('np.log10(h)'), pyC('-np.log10(-h)')],
    aide: 'np.log10 pour le log du cours, et le signe moins devant.',
  },
  {
    id: 'python.n1.e4.concentration-du-pH',
    question: `${String.raw`$[\mathrm{H_3O^+}] = 10^{-\mathrm{pH}}$`}
${pyBloc(['pH_citron = 2.4', 'h_citron = ……   # [H3O+] en mol/L'])}`,
    consigne: 'Complète la ligne, comme à l’ECE.',
    formats: ['qcm', 'saisie'],
    comparaison: 'code',
    reponse: pyC('10 ** (-pH_citron)'),
    saisie: pyVariantes('h_citron =', ['10 ** (-pH_citron)', '10 ** -pH_citron']),
    distracteurs: [pyC('10 ^ (-pH_citron)'), pyC('-np.log10(pH_citron)'), pyC('10e-pH_citron')],
    aide: 'Dix puissance x s’écrit 10 ** x ; les parenthèses autour de -pH_citron évitent les surprises.',
  },
  {
    id: 'python.n1.e4.niveau-sonore',
    question: `${String.raw`$L = 10 \times \log\left(\dfrac{I}{I_0}\right)$`}
${pyBloc(['import numpy as np', 'I = 1.0e-5       # en W/m²', 'I0 = 1.0e-12     # en W/m²', 'L = ……'])}`,
    consigne: 'Complète la ligne, comme à l’ECE.',
    formats: ['qcm', 'saisie'],
    comparaison: 'code',
    reponse: pyC('10 * np.log10(I / I0)'),
    saisie: pyVariantes('L =', ['10 * np.log10(I / I0)', 'np.log10(I / I0) * 10']),
    distracteurs: [pyC('10 * np.log(I / I0)'), pyC('10 * np.log10(I) / I0'), pyC('np.log10(10 * I / I0)')],
    aide: 'Avec np.log, Python afficherait 161,2 dB pour une salle de classe : un résultat absurde, sans message d’erreur.',
  },
  {
    id: 'python.n1.e4.incertitude-type',
    question: 'Quelle ligne calcule u = s / √n ?',
    formats: ['qcm', 'saisie'],
    comparaison: 'code',
    reponse: pyC('u = s / np.sqrt(n)'),
    saisie: ['s / np.sqrt(n)'],
    distracteurs: [pyC('u = np.sqrt(s / n)'), pyC('u = s / n ** 2'), pyC('u = s / np.sqrt(s)')],
  },
];

/* ---------- Étape 5 · Listes de mesures et tableaux numpy ---------- */

const PY_N1_E5 = [
  {
    id: 'python.n1.e5.indice',
    question: 'Lire un élément d’une liste',
    consigne: 'Que vaut cet élément ?',
    formats: ['qcm', 'saisie'],
    comparaison: 'code',
    generer() {
      const valeurs = melanger([1.03, 1.41, 1.68, 2.08, 2.25, 2.4, 2.9, 5.0, 7.6, 8.2]).slice(0, entierEntre(4, 5));
      const k = entierEntre(1, valeurs.length - 2);
      const r = pyFlottant(valeurs[k]);
      return {
        question: pyBloc([`pH = [${valeurs.map(pyFlottant).join(', ')}]`, `print(pH[${k}])`]),
        reponse: r,
        distracteurs: pieges(r, [pyFlottant(valeurs[k - 1]), pyFlottant(valeurs[k + 1]), 'un message d’erreur']),
        aide: `Python compte à partir de 0 : pH[0] est le premier, donc pH[${k}] est le ${k + 1}ᵉ.`,
      };
    },
  },
  {
    id: 'python.n1.e5.len',
    question: `Que répond ${pyC('len(…)')} ?`,
    consigne: 'Que répond Python ?',
    formats: ['qcm', 'saisie'],
    comparaison: 'code',
    generer() {
      const n = entierEntre(3, 6);
      const valeurs = Array.from({ length: n }, () => entierEntre(10, 99) * 10);
      return {
        question: pyC(`len([${valeurs.join(', ')}])`),
        reponse: String(n),
        distracteurs: pieges(String(n), [String(n - 1), String(n + 1), String(valeurs.reduce((a, b) => a + b, 0))]),
        aide: 'len compte les éléments de la liste.',
      };
    },
  },
  {
    id: 'python.n1.e5.hors-de-la-liste',
    question: 'Un indice trop grand',
    consigne: 'Que répond Python ?',
    formats: ['qcm', 'saisie'],
    comparaison: 'code',
    generer() {
      const d = melanger([1000, 1250, 1500, 1750]).slice(0, 3);
      return {
        question: pyBloc([`d = [${d.join(', ')}]`, 'print(d[3])']),
        reponse: 'IndexError',
        saisie: ['une IndexError'],
        distracteurs: [String(d[2]), 'SyntaxError', '0'],
        aide: 'Trois éléments, numérotés 0, 1 et 2 : d[3] n’existe pas.',
      };
    },
  },
  {
    id: 'python.n1.e5.liste-fois-deux',
    question: pyBloc(['pH = [2.4, 2.5]', 'print(pH * 2)']),
    consigne: 'Qu’affiche ce programme ?',
    formats: ['qcm'],
    reponse: pyC('[2.4, 2.5, 2.4, 2.5]'),
    distracteurs: [pyC('[[2.4, 2.5], [2.4, 2.5]]'), pyC('[4.8, 5.0, 4.8, 5.0]'), pyC('array([4.8, 5. ])'), 'TypeError'],
    aide: 'Une liste ne se prête pas au calcul : multipliée par 2, elle est recopiée deux fois.',
  },
  {
    id: 'python.n1.e5.tableau-fois-deux',
    question: pyBloc(['import numpy as np', 'pH = np.array([2.4, 2.5])', 'print(pH * 2)']),
    consigne: 'Qu’affiche ce programme ?',
    formats: ['qcm'],
    reponse: pyC('[4.8 5. ]'),
    distracteurs: [pyC('[2.4, 2.5, 2.4, 2.5]'), pyC('[4.8, 5.0, 4.8, 5.0]'), 'TypeError'],
    aide: 'Un tableau numpy est multiplié valeur par valeur. print l’affiche entre crochets, sans virgules, et 5.0 s’écrit « 5. ».',
  },
  {
    id: 'python.n1.e5.liste-divisee',
    question: `« Une liste se divise par un nombre valeur par valeur : ${pyC('d / lam')} marche avec ${pyC('d = [1000, 1250, 1500]')}. »`,
    formats: ['vraifaux'],
    vrai: false,
    reponse: `Faux : une liste ne se divise pas (TypeError). On la convertit d’abord : ${pyC('np.array(d) / lam')}.`,
  },
  {
    id: 'python.n1.e5.role-np-array',
    question: `À quoi sert ${pyC('pH = np.array(pH)')} ?`,
    formats: ['qcm', 'retournement'],
    reponse: 'À calculer ensuite sur chaque valeur d’un coup',
    distracteurs: ['À ranger les valeurs de la liste dans l’ordre croissant', 'À afficher les valeurs sous forme de tableau', 'À compter les valeurs de la liste'],
    aide: 'La liste devient un tableau numpy : un calcul agit alors sur chaque valeur et donne un tableau de même longueur.',
  },
  {
    id: 'python.n1.e5.premier-indice',
    question: 'Quel est l’indice du premier élément d’une liste ?',
    formats: ['qcm', 'saisie', 'retournement'],
    comparaison: 'code',
    reponse: '0',
    distracteurs: ['1', '-1', 'Il n’a pas d’indice'],
    aide: 'Python compte à partir de 0 : pH[0] est le premier élément.',
  },
  {
    id: 'python.n1.e5.virgules',
    question: `« Dans ${pyC('pH = [2.4, 2.5, 2.9]')}, les virgules séparent les valeurs et les points sont les séparateurs décimaux. »`,
    formats: ['vraifaux'],
    vrai: true,
    reponse: 'Vrai : c’est là que sert la virgule en Python, jamais comme séparateur décimal.',
  },
  {
    id: 'python.n1.e5.ecart-mesure-modele',
    consigne: 'Complète la ligne : pour chaque solution, pH mesuré moins pH théorique.',
    formats: ['qcm', 'saisie'],
    comparaison: 'code',
    question: pyBloc([
      'pH = np.array([1.03, 1.41, 1.68, 2.08, 2.25])   # mesurés',
      'pH_th = -np.log10(c)                            # théoriques',
      'ecart = ……',
    ]),
    reponse: pyC('pH - pH_th'),
    saisie: ['ecart = pH - pH_th'],
    distracteurs: [pyC('pH_th - pH'), pyC('pH - pH_th[0]'), pyC('pH[0] - pH_th')],
    aide: 'Deux tableaux de même longueur se soustraient valeur par valeur, dans l’ordre demandé : mesuré moins théorique.',
  },
];

/* ---------- Étape 6 · Moyenne, écart-type, incertitude ---------- */

const PY_N1_E6 = [
  {
    id: 'python.n1.e6.role-mean',
    question: `Que calcule ${pyC('np.mean(x)')} ?`,
    formats: ['qcm', 'retournement'],
    reponse: 'La moyenne de la série x',
    distracteurs: ['L’écart-type de la série x', 'Le nombre de valeurs de x', 'La somme des valeurs de x'],
  },
  {
    id: 'python.n1.e6.ddof',
    question: `Pourquoi écrire ${pyC('ddof=1')} dans ${pyC('np.std(x, ddof=1)')} ?`,
    formats: ['qcm', 'retournement'],
    reponse: 'Pour diviser par n − 1, comme dans le cours',
    distracteurs: ['Pour arrondir l’écart-type à 1 chiffre après la virgule', 'Pour ne pas compter la première mesure', 'Pour diviser par n, comme le cours'],
    aide: 'Sans ddof=1, numpy divise par n : ce n’est pas l’écart-type expérimental qu’on utilise.',
  },
  {
    id: 'python.n1.e6.ecart-type',
    question: `Écart-type expérimental de la série ${pyC('m')} :
${pyBloc(['m = np.array([55.47, 55.43, 55.45, 55.44, 55.48])   # en g', 's = ……'])}`,
    consigne: 'Complète la ligne, comme à l’ECE.',
    formats: ['qcm', 'saisie'],
    comparaison: 'code',
    reponse: pyC('np.std(m, ddof=1)'),
    saisie: pyVariantes('s =', ['np.std(m, ddof=1)', 'np.std(m, ddof = 1)']),
    distracteurs: [pyC('np.std(m)'), pyC('np.mean(m, ddof=1)'), pyC('np.std(m, ddof=0)')],
  },
  {
    id: 'python.n1.e6.incertitude-ece',
    consigne: 'Complète la ligne, comme à l’ECE.',
    formats: ['qcm', 'saisie'],
    comparaison: 'code',
    question: `${String.raw`$u(\bar{x}) = \dfrac{s(x)}{\sqrt{n}}$`}
${pyBloc(['n = len(x)', 'u = np.std(x, ddof=1) / ……'])}`,
    reponse: pyC('np.sqrt(n)'),
    saisie: ['np.sqrt(len(x))', 'u = np.std(x, ddof=1) / np.sqrt(n)'],
    distracteurs: [pyC('len(x)'), pyC('np.sqrt(x)'), pyC('np.sqrt(n - 1)')],
    aide: 'C’est la ligne qu’on retrouve dans huit sujets d’ECE : l’écart-type expérimental divisé par la racine du nombre de mesures.',
  },
  {
    id: 'python.n1.e6.len-donne-n',
    question: `Dans une série de mesures ${pyC('x')}, que donne ${pyC('len(x)')} ?`,
    formats: ['qcm', 'retournement'],
    reponse: 'Le nombre n de mesures',
    distracteurs: ['La dernière mesure de la série', 'L’écart entre les deux mesures extrêmes', 'La somme des mesures'],
  },
];

/* ---------- Étape 7 · Tracer un graphique avec pyplot ---------- */

const PY_STYLES = [
  ["'b+'", 'Des croix bleues'],
  ["'r-'", 'Une ligne rouge'],
  ["'go'", 'Des ronds verts'],
];

const PY_N1_E7 = [
  {
    id: 'python.n1.e7.importer-pyplot',
    question: `Quelle ligne charge pyplot sous le nom court ${pyC('plt')} ?`,
    formats: ['qcm', 'saisie'],
    comparaison: 'code',
    reponse: pyC('import matplotlib.pyplot as plt'),
    distracteurs: [pyC('import matplotlib as plt'), pyC('import pyplot.matplotlib as plt'), pyC('import plt as matplotlib.pyplot')],
  },
  {
    id: 'python.n1.e7.style-de-trace',
    question: `Que trace ${pyC('plt.plot(x, y, …)')} selon son style ?`,
    consigne: 'Que trace cette ligne ?',
    formats: ['qcm'],
    generer() {
      const [style, trace] = auHasard(PY_STYLES);
      return {
        question: pyC(`plt.plot(x, y, ${style})`),
        reponse: trace,
        distracteurs: [...PY_STYLES.filter(([s]) => s !== style).map(([, t]) => t), 'Un histogramme bleu'],
        aide: 'La lettre donne la couleur (b bleu, r rouge, g vert), le signe la forme (+ croix, o ronds, - ligne).',
      };
    },
  },
  {
    id: 'python.n1.e7.role-legend',
    question: `Que fait ${pyC('plt.legend()')} ?`,
    formats: ['qcm', 'retournement'],
    reponse: 'Il affiche le nom de chaque série, donné par label',
    distracteurs: ['Il écrit la légende de l’axe des abscisses, sous le graphique', 'Il ajoute un titre au-dessus du graphique', 'Il ajoute un quadrillage au graphique'],
  },
  {
    id: 'python.n1.e7.legende-des-axes',
    question: 'Légender l’axe des abscisses « c (mmol/L) »',
    consigne: 'Quelle instruction ?',
    formats: ['qcm', 'saisie'],
    comparaison: 'code',
    reponse: pyC("plt.xlabel('c (mmol/L)')"),
    distracteurs: [pyC("plt.ylabel('c (mmol/L)')"), pyC("plt.title('c (mmol/L)')"), pyC("plt.legend('c (mmol/L)')")],
    aide: 'xlabel pour l’axe horizontal, ylabel pour l’axe vertical.',
  },
  {
    id: 'python.n1.e7.linspace',
    question: `Que crée ${pyC('np.linspace(0, 11, 100)')} ?`,
    formats: ['qcm', 'retournement'],
    reponse: '100 valeurs régulièrement espacées de 0 à 11',
    distracteurs: ['11 valeurs régulièrement espacées de 0 à 100', 'Les nombres entiers de 0 à 11, cent fois', '100 valeurs tirées au hasard entre 0 et 11'],
    aide: 'Idéal pour tracer une courbe de modèle bien lisse.',
  },
  {
    id: 'python.n1.e7.histogramme',
    question: `Tracer l’histogramme de ${pyC('m')} en 5 classes :
${pyBloc(['m = np.array([55.47, 55.43, 55.45, 55.44, 55.48])', '……', 'plt.show()'])}`,
    consigne: 'Complète la ligne.',
    formats: ['qcm', 'saisie'],
    comparaison: 'code',
    reponse: pyC('plt.hist(m, bins=5)'),
    saisie: ["plt.hist(m, bins=5, edgecolor='black')"],
    distracteurs: [pyC('plt.plot(m, bins=5)'), pyC('plt.hist(bins=5)'), pyC('plt.hist(5, bins=m)')],
  },
  {
    id: 'python.n1.e7.show',
    question: 'Quelle instruction affiche le graphique ?',
    formats: ['qcm', 'saisie'],
    comparaison: 'code',
    reponse: pyC('plt.show()'),
    distracteurs: [pyC('plt.plot()'), pyC('plt.legend()'), pyC('print(plt)')],
    aide: 'Toutes les autres lignes du graphique (points, légendes, titre) se placent avant plt.show().',
  },
  {
    id: 'python.n1.e7.tracer-le-modele',
    consigne: 'Quelle ligne trace le modèle ?',
    formats: ['qcm'],
    question: pyBloc([
      'c = np.array([1.0, 2.5, 5.0, 8.0, 10.0])',
      'sigma = np.array([0.162, 0.330, 0.605, 0.925, 1.158])',
      'k = 0.1172',
      'c_mod = np.linspace(0, 11, 100)',
      'sigma_mod = k * c_mod',
    ]),
    reponse: pyC("plt.plot(c_mod, sigma_mod, 'r-')"),
    distracteurs: [pyC("plt.plot(c, sigma_mod, 'r-')"), pyC("plt.plot(c_mod, sigma_mod, 'b+')"), pyC("plt.plot(c_mod, sigma, 'r-')")],
    aide: 'Le modèle se trace avec c_mod : avec c, les deux tableaux n’ont pas la même longueur (ValueError).',
  },
];

/* ---------- Étape 8 · Lire un message d'erreur ---------- */

const PY_FAUTES = [
  [["print('c =', round(c, 2), 'mg/L'"], 'SyntaxError', 'La parenthèse ouverte par print( n’est jamais fermée.'],
  [['A = 0.47', 'k = 0.124', 'c = A / k', "print('c =', round(C, 2), 'mg/L')"], 'NameError', 'La variable s’appelle c : C n’existe pas.'],
  [['A = 0.47', 'k = 0,124', 'c = A / k'], 'TypeError', '0,124 n’est pas un nombre mais une paire (0, 124) : on ne divise pas par une paire.'],
  [['lambda = 630e-9'], 'SyntaxError', 'lambda est un mot réservé : on écrit lam.'],
  [["print('Hz' + 500)"], 'TypeError', 'Un texte et un nombre ne s’ajoutent pas.'],
  [['import numpy as np', 'import matplotlib.pyplot as plt', 'c = np.array([1.0, 2.0, 3.0])', 'A = np.array([0.125, 0.249])',
    "plt.plot(c, A, 'b+')"], 'ValueError',
    'Trois concentrations, deux absorbances : les tableaux n’ont pas la même longueur.'],
  [['A = 0.47', 'print(a)'], 'NameError', 'La variable s’appelle A, en majuscule.'],
];

const PY_N1_E8 = [
  {
    id: 'python.n1.e8.type-d-erreur',
    question: 'Quel message d’erreur ?',
    consigne: 'Quelle erreur Python signale-t-il ?',
    formats: ['qcm', 'saisie'],
    comparaison: 'code',
    generer() {
      const [lignes, erreur, aide] = auHasard(PY_FAUTES);
      return {
        question: pyBloc(lignes),
        reponse: erreur,
        distracteurs: PY_ERREURS.filter((e) => e !== erreur),
        aide,
      };
    },
  },
  {
    id: 'python.n1.e8.erreur-silencieuse',
    question: `Que se passe-t-il avec ${pyC('c_mere = 10^-2')} ?`,
    formats: ['qcm', 'retournement'],
    reponse: 'Aucun message, mais une valeur fausse',
    distracteurs: ['Une SyntaxError : ^ n’existe pas en Python', 'c_mere vaut bien 0.01, sans erreur', 'Une TypeError sur cette ligne'],
    aide: 'En Python, ^ n’est pas la puissance : le programme tourne et affiche une concentration négative. On écrit 1e-2 ou 10 ** -2.',
  },
  {
    id: 'python.n1.e8.ligne-signalee',
    question: '« La ligne signalée par Python est toujours celle qu’il faut corriger. »',
    formats: ['vraifaux'],
    vrai: false,
    reponse: `Faux : l’erreur peut être née plus haut. Avec ${pyC('k = 0,124')}, Python signale la ligne suivante, ${pyC('c = A / k')}. Remonte.`,
  },
  {
    id: 'python.n1.e8.virgule-decimale',
    question: `Que contient ${pyC('k')} après ${pyC('k = 0,124')} ?`,
    formats: ['qcm', 'retournement'],
    reponse: 'Une paire de deux nombres, 0 et 124',
    distracteurs: ['Le nombre 0,124, écrit à la française', 'Le nombre 124, sans le zéro', 'Rien : la ligne provoque une erreur'],
    aide: 'La virgule sépare des valeurs. Le séparateur décimal est le point : k = 0.124.',
  },
  {
    id: 'python.n1.e8.longueurs-differentes',
    question: `${pyC('plt.plot(c, A)')} répond ${pyC('ValueError: x and y must have same first dimension')}. Que vérifier ?`,
    formats: ['qcm', 'retournement'],
    reponse: 'Que c et A ont autant de valeurs',
    distracteurs: ['Que plt.show() est bien appelé à la fin', 'Que c et A sont des listes', 'Que numpy est bien importé'],
    aide: 'Une mesure oubliée à la saisie : l’erreur la plus fréquente de l’ECE.',
  },
  {
    id: 'python.n1.e8.programme-ece',
    consigne: 'Que dois-tu modifier dans ce programme d’ECE ?',
    formats: ['qcm', 'retournement'],
    question: pyBloc([
      'V = np.array([1, 1, 1, 1, 1])   # A MODIFIER  Volume (cm³)',
      'P = np.array([1, 1, 1, 1, 1])   # A MODIFIER  Pression (hPa)',
      'n = len(V)',
      'k_moy = np.mean(P * V)',
    ]),
    reponse: 'Les lignes « A MODIFIER », avec mes mesures',
    distracteurs: ['Tout le programme, en le réécrivant', 'Les lignes de calcul de n et de k_moy, à adapter', 'Rien : on l’exécute tel quel'],
    aide: 'On remplace les 1 par ses mesures, avec des points décimaux et autant de valeurs dans chaque tableau. Tout le reste est fourni.',
  },
];

Paquets.inscrire({
  cle: 'python',
  theme: 'Python',
  titre: 'Python pour l’ECE',
  resume: 'Un niveau par niveau du parcours Python de Résonance. Niveau 1 : la boîte à outils de l’ECE — calculs, '
    + 'variables, affichage, numpy, listes, statistiques, graphiques, messages d’erreur. Les valeurs changent à chaque passage.',
  niveaux: ['terminale'],
  resonance: true,
  progression: 'niveaux',
  formatFixe: 'mixte',
  consignesParFormat: true,
  sections: [
    { cle: 'n1', titre: 'Niveau 1 · La boîte à outils de l’ECE', consigne: null,
      cartes: [...PY_N1_E1, ...PY_N1_E2, ...PY_N1_E3, ...PY_N1_E4, ...PY_N1_E5, ...PY_N1_E6, ...PY_N1_E7, ...PY_N1_E8] },
  ],
});
