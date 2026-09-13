#!/usr/bin/env python3
"""Assemble src/ en un fichier HTML unique et autonome.

    python build.py
"""

from pathlib import Path

RACINE = Path(__file__).resolve().parent
SRC = RACINE / "src"
SORTIE = RACINE / "reconnaitre-mes-eleves.html"


def lire(chemin):
    return chemin.read_text(encoding="utf-8")


def proteger_script(code):
    """Empêche une séquence </script> de fermer la balise prématurément."""
    return code.replace("</script", "<\\/script")


def main():
    gabarit = lire(SRC / "index.html")
    css = lire(SRC / "styles.css")
    fichiers_js = sorted((SRC / "js").glob("*.js"))
    js = "\n".join(f"// ---- {f.name} ----\n{lire(f)}" for f in fichiers_js)

    for marqueur in ("/*@CSS*/", "/*@JS*/"):
        if gabarit.count(marqueur) != 1:
            raise SystemExit(f"Marqueur {marqueur} absent ou dupliqué dans index.html")

    html = gabarit.replace("/*@CSS*/", css).replace("/*@JS*/", proteger_script(js))
    SORTIE.write_text(html, encoding="utf-8", newline="\n")
    print(f"{SORTIE.name} : {SORTIE.stat().st_size / 1024:.0f} Ko "
          f"({len(fichiers_js)} fichiers JS)")


if __name__ == "__main__":
    main()
