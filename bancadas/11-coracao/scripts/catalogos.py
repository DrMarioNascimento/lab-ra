"""Catálogos BodyParts3D PART-OF (tab-delimited)."""
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CAT = ROOT / "fontes" / "bodyparts3d" / "catalogos"


def _linhas(path):
    text = Path(path).read_text(encoding="utf-8", errors="replace")
    for line in text.splitlines():
        if not line.strip() or line.lower().startswith("concept") or line.lower().startswith("parent"):
            continue
        yield line.split("\t")


def partes(path=None):
    path = path or (CAT / "partof_parts_list_e.txt")
    out = {}
    for cols in _linhas(path):
        if len(cols) < 3:
            continue
        out[cols[0]] = {"bp": cols[1], "en": cols[2].strip()}
    return out


def elementos(path=None):
    path = path or (CAT / "partof_element_parts.txt")
    out = defaultdict(list)
    for cols in _linhas(path):
        if len(cols) < 3:
            continue
        fj = cols[2].strip()
        if fj and fj not in out[cols[0]]:
            out[cols[0]].append(fj)
    return out


def fj_para_conceitos(elems, parts):
    m = defaultdict(list)
    for fma, fjs in elems.items():
        en = parts.get(fma, {}).get("en", "")
        for fj in fjs:
            m[fj].append({"fma": fma, "en": en, "n": len(fjs)})
    return m


def menor_nome(fj, fjmap, proibidos=None):
    """Menor composto PART-OF que contém o FJ, ignorando pais enormes."""
    proibidos = proibidos or {
        "heart", "human body", "cardiovascular system", "middle mediastinum",
        "content of middle mediastinum", "content of inferior mediastinum",
        "left side of heart", "right side of heart", "systemic venous system",
        "pulmonary vascular system",
    }
    cands = []
    for c in fjmap.get(fj, []):
        if c["en"].lower() in proibidos:
            continue
        cands.append((c["n"], c["en"], c["fma"]))
    if not cands:
        return None
    cands.sort()
    return {"en": cands[0][1], "fma": cands[0][2], "n": cands[0][0]}
