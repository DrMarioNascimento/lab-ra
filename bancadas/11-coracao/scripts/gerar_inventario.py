#!/usr/bin/env python3
"""Gera INVENTORY.md e mapeamento.json a partir dos catálogos + pecas.py."""
from __future__ import annotations

import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from catalogos import elementos, fj_para_conceitos, menor_nome, partes  # noqa: E402
from pecas import PECAS  # noqa: E402

ROOT = Path(__file__).resolve().parents[1]
OBJ = ROOT / "fontes" / "bodyparts3d" / "obj"
ISA = ROOT / "fontes" / "bodyparts3d" / "catalogos" / "isa_parts_list_e.txt"


def status_de(peca, elems, parts, isa_txt):
    papel = peca.get("papel")
    if papel == "grupo":
        return "grupo", "nó de hierarquia"
    if papel == "ausente":
        fma = peca.get("fma")
        if fma and fma in elems:
            return "parcial", "o FMA existe no PART-OF mas a spec pede outra coisa (superfície / peça que o voxel não isola)"
        # Z-Anatomy TA2 nomeia; BP3D não
        if peca.get("ta2") and peca.get("en", "").lower() in isa_txt.lower():
            return "parcial", "nome no IS-A, sem malha ELEMENT isolada"
        return "ausente", peca.get("nota") or "sem malha no BodyParts3D 4.0 PART-OF/IS-A"
    fma = peca.get("fma")
    if not fma:
        return "ausente", "sem FMA"
    fjs = list(elems.get(fma, []))
    menos = peca.get("fj_menos")
    if menos:
        fjs = [fj for fj in fjs if fj not in set(elems.get(menos, []))]
    no_disco = [fj for fj in fjs if (OBJ / f"{fj}.obj").exists()]
    if not fjs:
        return "ausente", "conceito sem ELEMENT no partof_element_parts"
    if peca.get("nota") and "⚠️" in peca.get("nota", ""):
        return "parcial", peca["nota"]
    if papel == "debug":
        return "presente" if no_disco else "ausente", "cavidade sólida (volume). Não é parede de duas superfícies."
    if len(fjs) == 1 and no_disco:
        # alias?
        return "presente", None
    if no_disco:
        return "parcial", f"{len(no_disco)}/{len(fjs)} FJ no disco; composto PART-OF pode misturar peças"
    return "ausente", "FJ listados mas OBJ não extraído"


def main():
    parts = partes()
    elems = elementos()
    fjmap = fj_para_conceitos(elems, parts)
    isa_txt = ISA.read_text(encoding="utf-8", errors="replace") if ISA.exists() else ""

    linhas = []
    cont = {"presente": 0, "parcial": 0, "ausente": 0, "grupo": 0}
    for peca in PECAS:
        st, detalhe = status_de(peca, elems, parts, isa_txt)
        fma = peca.get("fma", "")
        fjs = []
        if fma:
            fjs = list(elems.get(fma, []))
            if peca.get("fj_menos"):
                fjs = [fj for fj in fjs if fj not in set(elems.get(peca["fj_menos"], []))]
        linhas.append({
            "nome": peca["nome"],
            "pai": peca.get("pai"),
            "papel": peca.get("papel"),
            "en": peca.get("en"),
            "fma": fma or None,
            "bp": peca.get("bp") or (parts.get(fma, {}) or {}).get("bp"),
            "ta2": peca.get("ta2"),
            "fj": fjs,
            "status": st,
            "detalhe": detalhe,
            "nota": peca.get("nota"),
            "z_anatomy": (
                "TA2 nomeia; malha do blend Z-Anatomy não extraída neste PR"
                if peca.get("ta2") and st == "ausente"
                else None
            ),
        })
        cont[st] = cont.get(st, 0) + 1

    # aurículas / condução: confirmar ausência no IS-A
    ausencias_confirmadas = []
    for needle in (
        "auricle of heart", "left auricle", "right auricle",
        "sinuatrial", "sinu-atrial", "atrioventricular node",
        "bundle of His", "Purkinje", "chordae tendineae",
    ):
        hits = [ln for ln in isa_txt.splitlines() if needle.lower() in ln.lower()]
        ausencias_confirmadas.append({"busca": needle, "hits_isa": hits})

    mapeamento = {
        "fonte_bp3d": {
            "pacote": "partof_BP3D_4.0_obj_99.zip",
            "url": "https://dbarchive.biosciencedbc.jp/data/bodyparts3d/LATEST/partof_BP3D_4.0_obj_99.zip",
            "catalogo": "https://dbarchive.biosciencedbc.jp/data/bodyparts3d/LATEST/partof_parts_list_e.txt",
            "versao": "4.0",
        },
        "fonte_z_anatomy": {
            "repo": "https://github.com/Z-Anatomy/Models-of-human-anatomy",
            "licenca": "CC-BY-SA 4.0",
            "nota": "Atlas Blender (~86 MB). Este PR NÃO extrai o .blend; só usa TA2.csv para saber o que a nomenclatura nomeia.",
        },
        "contagem": cont,
        "pecas": linhas,
        "isa_buscas_ausentes": ausencias_confirmadas,
    }
    (ROOT / "mapeamento.json").write_text(
        json.dumps(mapeamento, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    def icone(st):
        return {"presente": "✅", "parcial": "⚠️", "ausente": "❌", "grupo": "·"}.get(st, st)

    md = []
    md.append("# Inventário — Coração 3D · bancada 11")
    md.append("")
    md.append("Mapeamento das peças da spec para BodyParts3D 4.0 (PART-OF) e para nomes do TA2 usados pelo Z-Anatomy.")
    md.append("**Não inventa anatomia.** Peça sem malha fica ❌. Composto que mistura estruturas fica ⚠️.")
    md.append("")
    md.append(f"| | n |")
    md.append("|---|---:|")
    md.append(f"| ✅ presente (malha ELEMENT no disco, nome bate) | {cont['presente']} |")
    md.append(f"| ⚠️ parcial (malha existe mas não é o que a spec pede, ou o voxel alia duas coisas) | {cont['parcial']} |")
    md.append(f"| ❌ ausente no BodyParts3D 4.0 | {cont['ausente']} |")
    md.append(f"| · grupo (só hierarquia) | {cont['grupo']} |")
    md.append("")
    md.append("Z-Anatomy: o atlas Blender **não foi extraído** neste PR (template de 86 MB).")
    md.append("A coluna TA2 diz se o termo existe na nomenclatura do projeto; isso **não** prova malha no `.blend`.")
    md.append("")
    md.append("| Spec | EN / FMA / BP | FJ | BP3D | Z-Anatomy / TA2 | Nota |")
    md.append("|---|---|---|---|---|---|")
    for L in linhas:
        if L["status"] == "grupo":
            continue
        fj = ", ".join(L["fj"][:8]) + ("…" if len(L["fj"]) > 8 else "")
        ids = " / ".join(x for x in [L.get("en"), L.get("fma"), L.get("bp")] if x)
        za = L["ta2"] and f"TA2 {L['ta2']}" or "—"
        if L["status"] == "ausente" and L["ta2"]:
            za += " (nome; malha do blend não conferida)"
        md.append(
            f"| `{L['nome']}` | {ids or '—'} | {fj or '—'} | {icone(L['status'])} {L['status']} | {za} | {(L['detalhe'] or L['nota'] or '').replace('|', '/')} |"
        )
    md.append("")
    md.append("## O que a spec pede e o voxel não entrega")
    md.append("")
    md.append("### Paredes como duas superfícies (prioridade 2) — ❌")
    md.append("")
    md.append("BodyParts3D segmenta **miocárdio sólido** + **cavidade sólida** (o volume de sangue).")
    md.append("Não há `parede_externa_*` / `parede_interna_*` como duas faces.")
    md.append("Usar a cavidade como «endocárdio» seria mentir: é um preenchimento, não a face interna.")
    md.append("A bancada esquemática em `coracao/modelos.js` já constrói as duas superfícies *proceduralmente* — isso não é anatomia de cadáver.")
    md.append("")
    md.append("### Aurículas — ❌")
    md.append("")
    md.append("Nem PART-OF nem IS-A 4.0 listam *left/right auricle*. TA2 4023 e 4055 nomeiam.")
    md.append("Z-Anatomy pode ter no blend (não conferido). **Não modelar de cabeça.**")
    md.append("")
    md.append("### Cúspides — ✅ com um ⚠️")
    md.append("")
    md.append("As 11 cúspides/folhetos têm FJ próprios. Exceção: `FJ2432` é ao mesmo tempo")
    md.append("*posterior leaflet of mitral valve* e *inferior wall of left ventricle*.")
    md.append("O inventário não fatiou o voxel.")
    md.append("")
    md.append("### Coronárias na superfície — ⚠️")
    md.append("")
    md.append("Os ramos existem no mesmo corpo (FMA50039 / FMA50040 / FMA50308 estão *dentro* de FMA7088).")
    md.append("Isso não prova que correm no sulco por cima do epicárdio — o voxel pode atravessar carne.")
    md.append("Conferir no glb WIP antes de ensinar território de oclusão.")
    md.append("")
    md.append("### Condução — ❌")
    md.append("")
    md.append("Nó sinusal, nó AV, His, ramos, Purkinje: zero hits no PART-OF e no IS-A 4.0.")
    md.append("TA2 3952–3961 nomeia. Sem malha, a bancada 11 continua usando o desenho esquemático de `coracao/modelos.js`.")
    md.append("")
    md.append("### Cordas tendíneas — ❌")
    md.append("")
    md.append("Ausentes no BP3D. TA2 4047 / 4069 nomeia.")
    md.append("")
    md.append("## Como este arquivo é gerado")
    md.append("")
    md.append("```")
    md.append("python3 bancadas/11-coracao/scripts/gerar_inventario.py")
    md.append("```")
    md.append("")
    (ROOT / "INVENTORY.md").write_text("\n".join(md) + "\n", encoding="utf-8")
    print(json.dumps(cont, ensure_ascii=False))


if __name__ == "__main__":
    main()
