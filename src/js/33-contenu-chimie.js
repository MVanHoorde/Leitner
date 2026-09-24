/* Paquets de chimie : les bases de seconde, et les réflexes de calcul.
 *
 * Chaque carte porte un identifiant définitif (voir 32-paquets.js). Le texte
 * peut être corrigé librement ; l'identifiant, jamais.
 */

function tirerEntier(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

/** Valeur « d'énoncé » : un ou deux chiffres significatifs, jamais un nombre rond. */
function tirerMesure(min, max, decimales = 1) {
  const facteur = 10 ** decimales;
  return tirerEntier(min * facteur, max * facteur) / facteur;
}

/* ---------- Grandeurs, unités et formules (seconde) ---------- */

const GRANDEURS = [
  ['masse', 'La masse', 'm', 'le kilogramme (kg)', ['kg', 'kilogramme', 'le kilogramme'],
    'En chimie on travaille le plus souvent en grammes (g).'],
  ['volume', 'Le volume', 'V', 'le mètre cube (m³)', ['m3', 'm³', 'metre cube', 'le metre cube'],
    'En chimie on utilise surtout le litre (L) : 1 m³ = 1000 L.'],
  ['masse-volumique', 'La masse volumique', 'ρ (rhô)', 'le kilogramme par mètre cube (kg·m⁻³)',
    ['kg/m3', 'kg·m-3', 'kg m-3', 'kilogramme par metre cube'],
    'Souvent exprimée en g·L⁻¹ ou en g·cm⁻³. L’eau vaut 1,0 g·cm⁻³.'],
  ['quantite-matiere', 'La quantité de matière', 'n', 'la mole (mol)', ['mol', 'mole', 'la mole'],
    'Une mole contient 6,02 × 10²³ entités.'],
  ['masse-molaire', 'La masse molaire', 'M', 'le gramme par mole (g·mol⁻¹)',
    ['g/mol', 'g·mol-1', 'g mol-1', 'gramme par mole'],
    'Elle se lit dans le tableau périodique.'],
  ['concentration', 'La concentration en quantité de matière', 'C', 'la mole par litre (mol·L⁻¹)',
    ['mol/l', 'mol·l-1', 'mol l-1', 'mole par litre'],
    'Anciennement appelée concentration molaire.'],
  ['concentration-masse', 'La concentration en masse', 'Cm', 'le gramme par litre (g·L⁻¹)',
    ['g/l', 'g·l-1', 'g l-1', 'gramme par litre'],
    'Anciennement appelée concentration massique, notée parfois t.'],
  ['temperature', 'La température', 'T', 'le kelvin (K)', ['k', 'kelvin', 'le kelvin'],
    'T(K) = θ(°C) + 273,15.'],
  ['pression', 'La pression', 'P', 'le pascal (Pa)', ['pa', 'pascal', 'le pascal'],
    '1 bar = 10⁵ Pa ; la pression atmosphérique vaut environ 1013 hPa.'],
  ['temps', 'La durée', 't', 'la seconde (s)', ['s', 'seconde', 'la seconde'], null],
  ['longueur', 'La longueur', 'L', 'le mètre (m)', ['m', 'metre', 'le metre'], null],
  ['energie', 'L’énergie', 'E', 'le joule (J)', ['j', 'joule', 'le joule'], null],
];

/** Une relation et ses variantes fautives, pour le QCM. */
function carteFormule(cle, question, reponse, distracteurs, aide) {
  return {
    id: `chimie-bases.formules.${cle}`,
    question,
    reponse,
    distracteurs,
    aide,
  };
}

const MASSES_MOLAIRES = [
  ['hydrogene', 'l’hydrogène H', 1.0],
  ['carbone', 'le carbone C', 12.0],
  ['azote', 'l’azote N', 14.0],
  ['oxygene', 'l’oxygène O', 16.0],
  ['sodium', 'le sodium Na', 23.0],
  ['soufre', 'le soufre S', 32.1],
  ['chlore', 'le chlore Cl', 35.5],
  ['potassium', 'le potassium K', 39.1],
  ['calcium', 'le calcium Ca', 40.1],
  ['fer', 'le fer Fe', 55.8],
  ['cuivre', 'le cuivre Cu', 63.5],
];

Paquets.inscrire({
  cle: 'chimie-bases',
  titre: 'Les bases : grandeurs, unités, formules',
  resume: 'Ce qu’il faut savoir sans réfléchir avant tout calcul de chimie.',
  niveaux: ['seconde', 'premiere', 'terminale'],
  sections: [
    {
      cle: 'symboles',
      titre: 'Grandeur → symbole',
      consigne: 'Quel symbole note cette grandeur ?',
      // Pas de saisie : m et M ne se distinguent pas une fois la casse enlevée.
      cartes: GRANDEURS.map(([cle, nom, symbole, , , aide]) => ({
        id: `chimie-bases.symboles.${cle}`,
        question: nom,
        reponse: symbole,
        aide,
      })),
    },
    {
      cle: 'unites',
      titre: 'Grandeur → unité',
      consigne: 'Quelle est son unité dans le système international ?',
      cartes: GRANDEURS.map(([cle, nom, , unite, saisie, aide]) => ({
        id: `chimie-bases.unites.${cle}`,
        question: nom,
        reponse: unite,
        saisie,
        aide,
      })),
    },
    {
      cle: 'formules',
      titre: 'Les relations, dans les trois sens',
      consigne: 'Quelle relation utiliser ?',
      cartes: [
        carteFormule('n-de-m-M', 'Quantité de matière n à partir de la masse m et de la masse molaire M',
          'n = m / M', ['n = m × M', 'n = M / m', 'n = M × m'],
          'Vérification par les unités : g / (g·mol⁻¹) = mol.'),
        carteFormule('m-de-n-M', 'Masse m à partir de la quantité de matière n et de la masse molaire M',
          'm = n × M', ['m = n / M', 'm = M / n', 'm = n + M'],
          'Vérification par les unités : mol × g·mol⁻¹ = g.'),
        carteFormule('M-de-m-n', 'Masse molaire M à partir de la masse m et de la quantité de matière n',
          'M = m / n', ['M = n / m', 'M = m × n', 'M = n × m'], null),
        carteFormule('C-de-n-V', 'Concentration C à partir de la quantité de matière n et du volume V',
          'C = n / V', ['C = V / n', 'C = n × V', 'C = V × n'],
          'Vérification par les unités : mol / L = mol·L⁻¹.'),
        carteFormule('n-de-C-V', 'Quantité de matière n à partir de la concentration C et du volume V',
          'n = C × V', ['n = C / V', 'n = V / C', 'n = C + V'], null),
        carteFormule('V-de-n-C', 'Volume V à partir de la quantité de matière n et de la concentration C',
          'V = n / C', ['V = C / n', 'V = n × C', 'V = C × n'], null),
        carteFormule('Cm-de-m-V', 'Concentration en masse Cm à partir de la masse m et du volume V',
          'Cm = m / V', ['Cm = V / m', 'Cm = m × V', 'Cm = V × m'], null),
        carteFormule('m-de-Cm-V', 'Masse m à partir de la concentration en masse Cm et du volume V',
          'm = Cm × V', ['m = Cm / V', 'm = V / Cm', 'm = Cm + V'], null),
        carteFormule('Cm-de-C-M', 'Lien entre concentration en masse Cm, concentration C et masse molaire M',
          'Cm = C × M', ['Cm = C / M', 'Cm = M / C', 'Cm = C + M'],
          'Vérification par les unités : mol·L⁻¹ × g·mol⁻¹ = g·L⁻¹.'),
        carteFormule('C-de-Cm-M', 'Concentration C à partir de la concentration en masse Cm et de la masse molaire M',
          'C = Cm / M', ['C = Cm × M', 'C = M / Cm', 'C = M × Cm'], null),
        carteFormule('rho-de-m-V', 'Masse volumique ρ à partir de la masse m et du volume V',
          'ρ = m / V', ['ρ = V / m', 'ρ = m × V', 'ρ = V × m'], null),
        carteFormule('m-de-rho-V', 'Masse m à partir de la masse volumique ρ et du volume V',
          'm = ρ × V', ['m = ρ / V', 'm = V / ρ', 'm = ρ + V'], null),
        carteFormule('V-de-m-rho', 'Volume V à partir de la masse m et de la masse volumique ρ',
          'V = m / ρ', ['V = ρ / m', 'V = m × ρ', 'V = ρ × m'], null),
      ],
    },
    {
      cle: 'masses-molaires',
      titre: 'Masses molaires atomiques usuelles',
      consigne: 'Quelle masse molaire atomique, en g·mol⁻¹ ?',
      cartes: MASSES_MOLAIRES.map(([cle, nom, valeur]) => ({
        id: `chimie-bases.masses-molaires.${cle}`,
        question: `Masse molaire atomique de ${nom}`,
        reponse: `${valeur.toLocaleString('fr-FR', { minimumFractionDigits: 1 })} g·mol⁻¹`,
        nombre: valeur,
        unite: 'g·mol⁻¹',
        aide: 'Valeur du tableau périodique, arrondie au dixième.',
      })),
    },
  ],
});

/* ---------- Préfixes, conversions et écriture scientifique ---------- */

const PREFIXES = [
  ['tera', 'téra', 'T', 12],
  ['giga', 'giga', 'G', 9],
  ['mega', 'méga', 'M', 6],
  ['kilo', 'kilo', 'k', 3],
  ['hecto', 'hecto', 'h', 2],
  ['deca', 'déca', 'da', 1],
  ['deci', 'déci', 'd', -1],
  ['centi', 'centi', 'c', -2],
  ['milli', 'milli', 'm', -3],
  ['micro', 'micro', 'µ', -6],
  ['nano', 'nano', 'n', -9],
  ['pico', 'pico', 'p', -12],
];

/** Une conversion s'apprend comme un geste, pas comme un résultat : les valeurs
 *  sont retirées à chaque passage. */
function carteConversion(cle, depart, arrivee, facteur, tirage) {
  return {
    id: `reflexes.conversions.${cle}`,
    question: `Convertir des ${depart} en ${arrivee}`,
    unite: arrivee,
    generer() {
      const valeur = tirage();
      const resultat = valeur * facteur;
      return {
        question: `${ecrireNombre(valeur)} ${depart} = ? ${arrivee}`,
        reponse: `${ecrireNombre(resultat)} ${arrivee}`,
        nombre: resultat,
      };
    },
  };
}

Paquets.inscrire({
  cle: 'reflexes',
  titre: 'Réflexes : préfixes et conversions',
  resume: 'Les automatismes de calcul, à refaire souvent et vite.',
  niveaux: ['seconde', 'premiere', 'terminale'],
  // Un automatisme se perd vite : on le revoit plus souvent qu'une définition.
  intervalles: [1, 2, 4, 8, 15],
  // La vitesse fait partie de l'exercice : le temps écoulé reste sous les yeux.
  chrono: true,
  sections: [
    {
      cle: 'prefixes-valeur',
      titre: 'Préfixe → facteur',
      consigne: 'Par quelle puissance de dix ce préfixe multiplie-t-il ?',
      cartes: PREFIXES.map(([cle, nom, symbole, exposant]) => ({
        id: `reflexes.prefixes-valeur.${cle}`,
        question: `Le préfixe ${nom} (${symbole})`,
        reponse: `10^${exposant}`,
        nombre: 10 ** exposant,
        aide: `1 ${symbole}unité = 10^${exposant} unité.`,
      })),
    },
    {
      cle: 'prefixes-nom',
      titre: 'Facteur → préfixe',
      consigne: 'Quel préfixe correspond à ce facteur ?',
      cartes: PREFIXES.map(([cle, nom, symbole, exposant]) => ({
        id: `reflexes.prefixes-nom.${cle}`,
        question: `Un facteur 10^${exposant}`,
        reponse: `${nom} (${symbole})`,
        saisie: [nom, symbole, `${nom} ${symbole}`],
      })),
    },
    {
      cle: 'conversions',
      titre: 'Conversions',
      consigne: 'Écris le résultat.',
      consigneQcm: 'Quel est le résultat ?',
      cartes: [
        carteConversion('ml-vers-l', 'mL', 'L', 1e-3, () => tirerMesure(1, 500)),
        carteConversion('l-vers-ml', 'L', 'mL', 1e3, () => tirerMesure(0.1, 5, 2)),
        carteConversion('cm3-vers-l', 'cm³', 'L', 1e-3, () => tirerMesure(1, 500)),
        carteConversion('m3-vers-l', 'm³', 'L', 1e3, () => tirerMesure(0.1, 9, 2)),
        carteConversion('g-vers-kg', 'g', 'kg', 1e-3, () => tirerMesure(1, 900)),
        carteConversion('mg-vers-g', 'mg', 'g', 1e-3, () => tirerMesure(1, 900)),
        carteConversion('kg-vers-g', 'kg', 'g', 1e3, () => tirerMesure(0.1, 9, 2)),
        carteConversion('mmol-l-vers-mol-l', 'mmol·L⁻¹', 'mol·L⁻¹', 1e-3, () => tirerMesure(1, 400)),
        carteConversion('mol-l-vers-mmol-l', 'mol·L⁻¹', 'mmol·L⁻¹', 1e3, () => tirerMesure(0.01, 2, 2)),
        carteConversion('hpa-vers-pa', 'hPa', 'Pa', 1e2, () => tirerEntier(900, 1050)),
        {
          id: 'reflexes.conversions.cm3-ml',
          question: 'À quoi correspond 1 cm³ ?',
          reponse: '1 cm³ = 1 mL',
          saisie: ['1 ml', 'un ml', '1 millilitre', 'mL'],
          aide: 'Et donc 1 L = 1000 cm³ = 1 dm³.',
        },
        {
          id: 'reflexes.conversions.m3-l',
          question: 'Combien de litres dans 1 m³ ?',
          reponse: '1 m³ = 1000 L',
          nombre: 1000,
          unite: 'L',
        },
      ],
    },
    {
      cle: 'ecriture-scientifique',
      titre: 'Écriture scientifique',
      consigne: 'Donne la valeur en écriture décimale.',
      consigneQcm: 'Quelle est la valeur ?',
      cartes: [
        {
          id: 'reflexes.ecriture-scientifique.vers-decimal',
          question: 'D’une puissance de dix à l’écriture décimale',
          generer() {
            const mantisse = tirerMesure(1, 9.9, 1);
            const exposant = tirerEntier(-4, 4);
            const valeur = mantisse * 10 ** exposant;
            return {
              question: `${ecrireNombre(mantisse)} × 10^${exposant} = ?`,
              reponse: ecrireNombre(valeur),
              nombre: valeur,
            };
          },
        },
        {
          id: 'reflexes.ecriture-scientifique.chiffres-significatifs',
          question: 'Combien de chiffres significatifs dans 0,0250 ?',
          reponse: '3 chiffres significatifs (2, 5 et 0)',
          nombre: 3,
          aide: 'Les zéros de tête ne comptent pas ; celui de fin, si.',
        },
      ],
    },
  ],
});
