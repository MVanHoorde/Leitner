# Reconnaître mes élèves

Application web de mémorisation par boîte de Leitner pour apprendre à
reconnaître ses élèves (visage → nom, prénom, classe). Un seul fichier HTML
autonome, sans aucune requête réseau, données stockées en IndexedDB.

## Développement

Le code source est dans `src/` ; `build.py` l'assemble en un fichier unique.

```
python build.py                                  # produit reconnaitre-mes-eleves.html
python -m http.server 8000 --bind 127.0.0.1      # puis http://127.0.0.1:8000/reconnaitre-mes-eleves.html
```

- `src/index.html` : gabarit (marqueurs `/*@CSS*/` et `/*@JS*/`)
- `src/styles.css`
- `src/js/*.js` : concaténés par ordre alphabétique
