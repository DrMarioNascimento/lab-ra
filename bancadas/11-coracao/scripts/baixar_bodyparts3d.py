#!/usr/bin/env python3
"""Baixa o pacote PART-OF 99% do BodyParts3D e extrai só malhas do coração.

Fonte oficial: https://dbarchive.biosciencedbc.jp/en/bodyparts3d/download.html
"""
from __future__ import annotations

import argparse
import sys
import urllib.request
import zipfile
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CAT = ROOT / "fontes" / "bodyparts3d" / "catalogos"
OBJ = ROOT / "fontes" / "bodyparts3d" / "obj"
CACHE = ROOT / "fontes" / "bodyparts3d" / "_pack"

BASE = "https://dbarchive.biosciencedbc.jp/data/bodyparts3d/LATEST/"
ARQUIVOS = {
    "partof_parts_list_e.txt": "partof_parts_list_e.txt",
    "partof_element_parts.txt": "partof_element_parts.txt",
    "partof_inclusion_relation_list.txt": "partof_inclusion_relation_list.txt",
    "isa_parts_list_e.txt": "isa_parts_list_e.txt",
}
ZIP_NOME = "partof_BP3D_4.0_obj_99.zip"


def baixar(url: str, dest: Path) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    print(f"baixando {url} → {dest}", flush=True)
    req = urllib.request.Request(url, headers={"User-Agent": "lab-ra-coracao-pipeline/0.1"})
    with urllib.request.urlopen(req, timeout=120) as r, dest.open("wb") as f:
        while True:
            chunk = r.read(1024 * 256)
            if not chunk:
                break
            f.write(chunk)


def fjs_do_coracao(elem_path: Path) -> set[str]:
    elems = defaultdict(list)
    for line in elem_path.read_text(encoding="utf-8", errors="replace").splitlines():
        if not line.strip() or line.startswith("concept"):
            continue
        cols = line.split("\t")
        if len(cols) < 3:
            continue
        elems[cols[0]].append(cols[2].strip())
    wanted = set(elems["FMA7088"])
    for fma in ("FMA3736", "FMA3768", "FMA8612", "FMA4720", "FMA10951"):
        wanted.update(elems.get(fma, []))
    pares = (
        ("FMA49914", "FMA68002"),
        ("FMA49911", "FMA68003"),
        ("FMA49916", "FMA68004"),
        ("FMA49913", "FMA68005"),
    )
    for extra, intra in pares:
        wanted.update(set(elems.get(extra, [])) - set(elems.get(intra, [])))
    return {fj for fj in wanted if fj}


def extrair(zip_path: Path, fjs: set[str], dest: Path) -> list[str]:
    dest.mkdir(parents=True, exist_ok=True)
    faltando = []
    with zipfile.ZipFile(zip_path) as z:
        nomes = {Path(n).name: n for n in z.namelist()}
        for fj in sorted(fjs):
            alvo = f"{fj}.obj"
            if alvo not in nomes:
                faltando.append(fj)
                continue
            data = z.read(nomes[alvo])
            (dest / alvo).write_bytes(data)
    return faltando


def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument("--zip", type=Path, default=CACHE / ZIP_NOME)
    p.add_argument("--so-catalogos", action="store_true")
    args = p.parse_args()

    CAT.mkdir(parents=True, exist_ok=True)
    for remoto, local in ARQUIVOS.items():
        dest = CAT / local
        if not dest.exists():
            baixar(BASE + remoto, dest)
        else:
            print(f"já tem {dest}")

    if args.so_catalogos:
        return 0

    fjs = fjs_do_coracao(CAT / "partof_element_parts.txt")
    print(f"{len(fjs)} FJ do coração / vasos proximais")
    if not args.zip.exists():
        baixar(BASE + ZIP_NOME, args.zip)
    faltando = extrair(args.zip, fjs, OBJ)
    n = len(list(OBJ.glob("FJ*.obj")))
    print(f"objs em {OBJ}: {n}; faltando no zip: {faltando or 'nenhum'}")
    return 1 if faltando else 0


if __name__ == "__main__":
    sys.exit(main())
