/* Paquet de nomenclature organique (terminale).
 *
 * Les deux sens sont travaillés séparément, parce que ce sont deux compétences
 * distinctes : lire une formule et écrire une formule. Une même molécule donne
 * donc deux cartes, avec deux identifiants et deux progressions.
 */

const CHAINES = [
  ['meth', 'méth', 1, 'CH4', 'méthane'],
  ['eth', 'éth', 2, 'C2H6', 'éthane'],
  ['prop', 'prop', 3, 'C3H8', 'propane'],
  ['but', 'but', 4, 'C4H10', 'butane'],
  ['pent', 'pent', 5, 'C5H12', 'pentane'],
  ['hex', 'hex', 6, 'C6H14', 'hexane'],
  ['hept', 'hept', 7, 'C7H16', 'heptane'],
  ['oct', 'oct', 8, 'C8H18', 'octane'],
  ['non', 'non', 9, 'C9H20', 'nonane'],
  ['dec', 'déc', 10, 'C10H22', 'décane'],
];

/** Molécules travaillées dans les deux sens. */
const MOLECULES = [
  { cle: 'methane', nom: 'méthane', formule: 'CH4', aide: 'Alcane à 1 carbone.' },
  { cle: 'ethane', nom: 'éthane', formule: 'CH3-CH3', autresFormules: ['C2H6'] },
  { cle: 'propane', nom: 'propane', formule: 'CH3-CH2-CH3', autresFormules: ['C3H8'] },
  { cle: 'butane', nom: 'butane', formule: 'CH3-CH2-CH2-CH3', autresFormules: ['C4H10'] },
  { cle: '2-methylpropane', nom: '2-méthylpropane', formule: 'CH3-CH(CH3)-CH3',
    aide: 'Chaîne principale de 3 carbones, un méthyle sur le carbone 2.' },
  { cle: '2-methylbutane', nom: '2-méthylbutane', formule: 'CH3-CH(CH3)-CH2-CH3',
    aide: 'La numérotation part du bout qui donne le plus petit indice : 2 et non 3.' },
  { cle: '2-2-dimethylpropane', nom: '2,2-diméthylpropane', formule: 'CH3-C(CH3)2-CH3',
    aide: 'Deux méthyles sur le même carbone : l’indice est répété, d’où « 2,2 ».' },
  { cle: '3-ethylpentane', nom: '3-éthylpentane', formule: 'CH3-CH2-CH(C2H5)-CH2-CH3',
    aide: 'Chaîne principale de 5 carbones, un éthyle au centre.' },

  { cle: 'methanol', nom: 'méthanol', formule: 'CH3-OH', autresFormules: ['CH4O'] },
  { cle: 'ethanol', nom: 'éthanol', formule: 'CH3-CH2-OH', autresFormules: ['C2H5OH', 'C2H6O'] },
  { cle: 'propan-1-ol', nom: 'propan-1-ol', formule: 'CH3-CH2-CH2-OH' },
  { cle: 'propan-2-ol', nom: 'propan-2-ol', formule: 'CH3-CH(OH)-CH3',
    aide: 'Le groupe —OH est porté par le carbone 2 : alcool secondaire.' },
  { cle: 'butan-1-ol', nom: 'butan-1-ol', formule: 'CH3-CH2-CH2-CH2-OH' },
  { cle: 'butan-2-ol', nom: 'butan-2-ol', formule: 'CH3-CH(OH)-CH2-CH3' },
  { cle: '2-methylpropan-2-ol', nom: '2-méthylpropan-2-ol', formule: 'CH3-C(CH3)(OH)-CH3',
    aide: 'Le carbone portant —OH est lié à trois carbones : alcool tertiaire.' },

  { cle: 'methanal', nom: 'méthanal', formule: 'H-CHO', autresFormules: ['HCHO', 'CH2O'],
    aide: 'Le formaldéhyde. Le groupe —CHO est toujours en bout de chaîne.' },
  { cle: 'ethanal', nom: 'éthanal', formule: 'CH3-CHO' },
  { cle: 'propanal', nom: 'propanal', formule: 'CH3-CH2-CHO' },
  { cle: 'propanone', nom: 'propanone', formule: 'CH3-CO-CH3',
    aide: 'L’acétone. Le carbonyle est en milieu de chaîne : c’est une cétone.' },
  { cle: 'butanone', nom: 'butanone', formule: 'CH3-CO-CH2-CH3',
    aide: 'Pas besoin d’indice : une seule position est possible sur 4 carbones.' },
  { cle: '3-methylbutan-2-one', nom: '3-méthylbutan-2-one', formule: 'CH3-CO-CH(CH3)-CH3' },

  { cle: 'acide-methanoique', nom: 'acide méthanoïque', formule: 'H-COOH', autresFormules: ['HCOOH'],
    aide: 'L’acide formique.' },
  { cle: 'acide-ethanoique', nom: 'acide éthanoïque', formule: 'CH3-COOH',
    aide: 'L’acide acétique, celui du vinaigre.' },
  { cle: 'acide-propanoique', nom: 'acide propanoïque', formule: 'CH3-CH2-COOH' },
  { cle: 'methanoate-de-methyle', nom: 'méthanoate de méthyle', formule: 'H-COO-CH3', autresFormules: ['HCOOCH3'] },
  { cle: 'ethanoate-de-methyle', nom: 'éthanoate de méthyle', formule: 'CH3-COO-CH3' },
  { cle: 'ethanoate-d-ethyle', nom: 'éthanoate d’éthyle', formule: 'CH3-COO-CH2-CH3',
    autresNoms: ['ethanoate d ethyle', 'acetate d ethyle'],
    aide: 'Le nom de l’ester se lit de l’acide vers l’alcool : …oate de …yle.' },

  { cle: 'methanamine', nom: 'méthanamine', formule: 'CH3-NH2', autresNoms: ['methylamine'] },
  { cle: 'ethanamine', nom: 'éthanamine', formule: 'CH3-CH2-NH2', autresNoms: ['ethylamine'] },

  { cle: 'ethene', nom: 'éthène', formule: 'CH2=CH2', autresNoms: ['ethylene'] },
  { cle: 'propene', nom: 'propène', formule: 'CH3-CH=CH2' },
  { cle: 'but-1-ene', nom: 'but-1-ène', formule: 'CH2=CH-CH2-CH3' },
  { cle: 'but-2-ene', nom: 'but-2-ène', formule: 'CH3-CH=CH-CH3' },

  { cle: 'chloroethane', nom: 'chloroéthane', formule: 'CH3-CH2-Cl' },
  { cle: '2-bromopropane', nom: '2-bromopropane', formule: 'CH3-CHBr-CH3' },
];

const GROUPES = [
  ['hydroxyle', '—OH', 'un alcool', ['alcool'], 'Suffixe -ol.'],
  ['carbonyle-bout', '—CHO (en bout de chaîne)', 'un aldéhyde', ['aldehyde'], 'Suffixe -al.'],
  ['carbonyle-milieu', '—CO— (en milieu de chaîne)', 'une cétone', ['cetone'], 'Suffixe -one.'],
  ['carboxyle', '—COOH', 'un acide carboxylique', ['acide carboxylique', 'acide'], 'Nom : acide …oïque.'],
  ['ester', '—COO—', 'un ester', ['ester'], 'Nom : …oate de …yle.'],
  ['amine', '—NH2', 'une amine', ['amine'], 'Suffixe -amine.'],
  ['amide', '—CO—NH2', 'un amide', ['amide'], 'Suffixe -amide.'],
  ['alcene', 'une double liaison C=C', 'un alcène', ['alcene'], 'Suffixe -ène.'],
  ['halogene', '—Cl, —Br, —I ou —F', 'un halogénoalcane', ['halogenoalcane', 'halogeno alcane'],
    'Préfixe chloro-, bromo-, iodo-, fluoro-.'],
];

const SUFFIXES = [
  ['alcane', 'Un alcane', '-ane', ['ane']],
  ['alcene', 'Un alcène', '-ène', ['ene']],
  ['alcool', 'Un alcool', '-ol', ['ol']],
  ['aldehyde', 'Un aldéhyde', '-al', ['al']],
  ['cetone', 'Une cétone', '-one', ['one']],
  ['acide', 'Un acide carboxylique', 'acide …oïque', ['acide oique', 'oique']],
  ['ester', 'Un ester', '…oate de …yle', ['oate de yle', 'oate yle']],
  ['amine', 'Une amine', '-amine', ['amine']],
];

const CLASSES_ALCOOLS = [
  ['methanol', 'méthanol', 'primaire', 'Cas particulier : le carbone porte trois hydrogènes.'],
  ['ethanol', 'éthanol', 'primaire', null],
  ['propan-1-ol', 'propan-1-ol', 'primaire', null],
  ['propan-2-ol', 'propan-2-ol', 'secondaire', null],
  ['butan-1-ol', 'butan-1-ol', 'primaire', null],
  ['butan-2-ol', 'butan-2-ol', 'secondaire', null],
  ['2-methylpropan-2-ol', '2-méthylpropan-2-ol', 'tertiaire', null],
  ['2-methylbutan-2-ol', '2-méthylbutan-2-ol', 'tertiaire', null],
];

function carteRegle(cle, question, reponse, distracteurs, aide) {
  return { id: `nomenclature.regles.${cle}`, question, reponse, distracteurs, aide };
}

Paquets.inscrire({
  cle: 'nomenclature',
  titre: 'Nomenclature des molécules organiques',
  resume: 'Lire une formule, écrire un nom, et l’inverse. Le socle du programme de terminale.',
  niveaux: ['terminale'],
  sections: [
    {
      cle: 'chaines',
      titre: 'Préfixes de chaîne',
      consigne: 'Combien d’atomes de carbone ce préfixe annonce-t-il ?',
      cartes: CHAINES.map(([cle, prefixe, carbones]) => ({
        id: `nomenclature.chaines.${cle}`,
        question: `Le préfixe « ${prefixe}- »`,
        reponse: `${carbones} atome${carbones > 1 ? 's' : ''} de carbone`,
        nombre: carbones,
      })),
    },
    {
      cle: 'brutes',
      titre: 'Alcanes linéaires → formule brute',
      consigne: 'Quelle est la formule brute ?',
      cartes: CHAINES.map(([cle, , carbones, brute, alcane]) => ({
        id: `nomenclature.brutes.${cle}`,
        question: `Le ${alcane}`,
        reponse: brute,
        saisie: [brute],
        aide: `Les alcanes suivent CnH2n+2 : ici n = ${carbones}.`,
      })),
    },
    {
      cle: 'groupes',
      titre: 'Groupe caractéristique → famille',
      consigne: 'Quelle famille ce groupe caractérise-t-il ?',
      cartes: GROUPES.map(([cle, groupe, famille, saisie, aide]) => ({
        id: `nomenclature.groupes.${cle}`,
        question: `Le groupe ${groupe}`,
        reponse: famille,
        saisie: [famille, ...saisie],
        aide,
      })),
    },
    {
      cle: 'suffixes',
      titre: 'Famille → suffixe',
      consigne: 'Quel suffixe utilise-t-on ?',
      cartes: SUFFIXES.map(([cle, famille, suffixe, saisie]) => ({
        id: `nomenclature.suffixes.${cle}`,
        question: famille,
        reponse: suffixe,
        saisie: [suffixe, ...saisie],
      })),
    },
    {
      cle: 'familles-nom',
      titre: 'Formule → nom',
      consigne: 'Quel est le nom de cette molécule ?',
      cartes: MOLECULES.map((m) => ({
        id: `nomenclature.familles-nom.${m.cle}`,
        question: m.formule,
        reponse: m.nom,
        saisie: [m.nom, ...(m.autresNoms || [])],
        aide: m.aide,
      })),
    },
    {
      cle: 'familles-formule',
      titre: 'Nom → formule semi-développée',
      consigne: 'Écris la formule semi-développée.',
      consigneQcm: 'Quelle est la formule semi-développée ?',
      cartes: MOLECULES.map((m) => ({
        id: `nomenclature.familles-formule.${m.cle}`,
        question: m.nom,
        reponse: m.formule,
        saisie: [m.formule, ...(m.autresFormules || [])],
        aide: m.aide,
      })),
    },
    {
      cle: 'classes-alcools',
      titre: 'Classe des alcools',
      consigne: 'Cet alcool est-il primaire, secondaire ou tertiaire ?',
      cartes: CLASSES_ALCOOLS.map(([cle, nom, classe, aide]) => ({
        id: `nomenclature.classes-alcools.${cle}`,
        question: `Le ${nom}`,
        reponse: `alcool ${classe}`,
        saisie: [classe, `alcool ${classe}`],
        aide,
      })),
    },
    {
      cle: 'regles',
      titre: 'Les règles',
      consigne: 'Quelle est la règle ?',
      cartes: [
        carteRegle('chaine-principale', 'Comment choisit-on la chaîne principale ?',
          'La plus longue chaîne carbonée contenant le groupe caractéristique',
          ['La chaîne qui porte le plus de ramifications', 'La chaîne la plus courte',
            'N’importe quelle chaîne de la molécule'],
          'Le groupe caractéristique prime toujours sur la longueur.'),
        carteRegle('numerotation-groupe', 'Dans quel sens numérote-t-on une chaîne portant un groupe caractéristique ?',
          'Dans le sens qui donne le plus petit indice au groupe caractéristique',
          ['Dans le sens qui donne le plus petit indice aux ramifications',
            'Toujours de gauche à droite', 'Dans le sens de l’ordre alphabétique'],
          'Le groupe caractéristique passe avant les ramifications.'),
        carteRegle('numerotation-alcane', 'Et pour un alcane ramifié, sans groupe caractéristique ?',
          'Dans le sens qui donne les plus petits indices aux ramifications',
          ['Toujours de gauche à droite', 'Dans le sens qui donne les plus grands indices',
            'Dans le sens de la ramification la plus longue'], null),
        carteRegle('ordre-alphabetique', 'Dans quel ordre écrit-on plusieurs ramifications différentes ?',
          'Par ordre alphabétique, sans tenir compte des préfixes di, tri, tétra',
          ['Par ordre de taille croissante', 'Par ordre d’indice croissant',
            'Par ordre alphabétique en comptant di, tri, tétra'],
          'Ainsi « 4-éthyl-2,2-diméthylhexane » : éthyl avant méthyl.'),
        carteRegle('multiplicateurs', 'Comment indique-t-on deux, trois ou quatre ramifications identiques ?',
          'Avec les préfixes di-, tri-, tétra-, et un indice par ramification',
          ['Avec un seul indice', 'Avec les préfixes bi-, ter-, quadri-',
            'En répétant le nom de la ramification'],
          'Exemple : 2,3-diméthylbutane.'),
        carteRegle('ramification-c1', 'Comment nomme-t-on une ramification à 1 carbone ?',
          'Un méthyle (préfixe méthyl-)', ['Un éthyle', 'Un méthane', 'Un carbonyle'], null),
        carteRegle('ramification-c2', 'Comment nomme-t-on une ramification à 2 carbones ?',
          'Un éthyle (préfixe éthyl-)', ['Un méthyle', 'Un éthane', 'Un propyle'], null),
        carteRegle('ponctuation', 'Comment sépare-t-on chiffres et lettres dans un nom ?',
          'Un tiret entre un chiffre et une lettre, une virgule entre deux chiffres',
          ['Une virgule partout', 'Un tiret partout', 'Un espace entre chaque élément'],
          'Exemple : 2,3-diméthylbutane.'),
        carteRegle('alcool-primaire', 'Qu’est-ce qu’un alcool primaire ?',
          'Le carbone portant —OH est lié à au plus un autre atome de carbone',
          ['Le carbone portant —OH est lié à deux autres carbones',
            'Le carbone portant —OH est lié à trois autres carbones',
            'Le groupe —OH est en bout de chaîne principale'], null),
        carteRegle('alcool-secondaire', 'Qu’est-ce qu’un alcool secondaire ?',
          'Le carbone portant —OH est lié à deux autres atomes de carbone',
          ['Le carbone portant —OH est lié à un seul autre carbone',
            'Le carbone portant —OH est lié à trois autres carbones',
            'La molécule contient deux groupes —OH'], null),
        carteRegle('alcool-tertiaire', 'Qu’est-ce qu’un alcool tertiaire ?',
          'Le carbone portant —OH est lié à trois autres atomes de carbone',
          ['Le carbone portant —OH est lié à deux autres carbones',
            'La molécule contient trois groupes —OH',
            'Le groupe —OH est porté par le carbone 3'], null),
      ],
    },
  ],
});
