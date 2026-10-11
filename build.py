#!/usr/bin/env python3
"""Assemble src/ et vendor/ en un fichier HTML unique et autonome.

    python build.py
"""

import base64
import re
from pathlib import Path

RACINE = Path(__file__).resolve().parent
SRC = RACINE / "src"
PDFJS = RACINE / "vendor" / "pdfjs"
KATEX = RACINE / "vendor" / "katex"
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


def css_katex():
    """Feuille de KaTeX, polices woff2 intégrées en data: (la page n'a pas le
    droit de charger un fichier, et tous les navigateurs actuels lisent woff2)."""
    css = lire(KATEX / "katex.min.css")

    def police(m):
        nom = m.group(1)
        donnees = base64.b64encode((KATEX / "fonts" / f"{nom}.woff2").read_bytes()).decode("ascii")
        return f'src:url(data:font/woff2;base64,{donnees}) format("woff2")'

    css, n = re.subn(r'src:url\(fonts/([\w-]+)\.woff2\) format\("woff2"\)(?:,url\([^)]*\) format\("[a-z]+"\))*', police, css)
    if n == 0 or "url(fonts/" in css:
        raise SystemExit("katex.min.css : polices introuvables ou non remplacées")
    return "/* KaTeX — Copyright Khan Academy — MIT License */\n" + css


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
        "/*@KATEX_CSS*/": css_katex(),
        # KaTeX et son extension de chimie (mhchem), MIT : formules entre $…$.
        "/*@KATEX*/": proteger_script("/* KaTeX — Copyright Khan Academy — MIT License */\n"
                                      + lire(KATEX / "katex.min.js") + "\n" + lire(KATEX / "mhchem.min.js")),
        "/*@JS*/": proteger_script(js),
        # Icône de l'écran d'accueil, intégrée pour que le fichier reste autonome.
        "/*@ICONE*/": base64.b64encode((SRC / "icone.png").read_bytes()).decode("ascii"),
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
