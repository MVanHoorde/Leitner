#!/usr/bin/env python3
"""Assemble src/ et vendor/ en un fichier HTML unique et autonome.

    python build.py
"""

from pathlib import Path

RACINE = Path(__file__).resolve().parent
SRC = RACINE / "src"
PDFJS = RACINE / "vendor" / "pdfjs"
SORTIE = RACINE / "reconnaitre-mes-eleves.html"


def lire(chemin):
    return chemin.read_text(encoding="utf-8")


def proteger_script(code):
    """Empêche une séquence </script> de fermer la balise prématurément."""
    return code.replace("</script", "<\\/script")


def verifier_texte_brut(nom, code):
    """Le contenu d'une balise <script type="text/plain"> ne doit rien contenir
    qui modifie l'analyse HTML : on refuse plutôt que de transformer du code tiers."""
    for sequence in ("</script", "<script", "<!--"):
        if sequence in code.lower():
            raise SystemExit(f"{nom} contient « {sequence} » : impossible de l'embarquer tel quel")
    return code


def main():
    gabarit = lire(SRC / "index.html")
    css = lire(SRC / "styles.css")
    fichiers_js = sorted((SRC / "js").glob("*.js"))
    js = "\n".join(f"// ---- {f.name} ----\n{lire(f)}" for f in fichiers_js)
    licence = "/* pdf.js — Copyright Mozilla Foundation — Apache License 2.0 */\n"
    bibliotheque = verifier_texte_brut("pdf.min.mjs", licence + lire(PDFJS / "pdf.min.mjs"))
    worker = verifier_texte_brut("pdf.worker.min.mjs", licence + lire(PDFJS / "pdf.worker.min.mjs"))

    remplacements = {
        "/*@CSS*/": css,
        "/*@PDFJS*/": bibliotheque,
        "/*@PDFJS_WORKER*/": worker,
        "/*@JS*/": proteger_script(js),
    }
    for marqueur in remplacements:
        if gabarit.count(marqueur) != 1:
            raise SystemExit(f"Marqueur {marqueur} absent ou dupliqué dans index.html")

    # Remplacement en une passe : le contenu inséré n'est jamais réinterprété.
    morceaux = [gabarit]
    for marqueur, contenu in remplacements.items():
        suite = []
        for morceau in morceaux:
            if isinstance(morceau, str) and marqueur in morceau:
                avant, apres = morceau.split(marqueur)
                suite.extend([avant, (contenu,), apres])
            else:
                suite.append(morceau)
        morceaux = suite
    html = "".join(m[0] if isinstance(m, tuple) else m for m in morceaux)

    SORTIE.write_text(html, encoding="utf-8", newline="\n")
    print(f"{SORTIE.name} : {SORTIE.stat().st_size / 1024 / 1024:.2f} Mo "
          f"({len(fichiers_js)} fichiers JS)")


if __name__ == "__main__":
    main()
