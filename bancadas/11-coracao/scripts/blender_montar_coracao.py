"""Esqueleto Blender (bpy) — importar OBJ BodyParts3D e exportar o glb WIP.

Neste ambiente NÃO há Blender. O exportador que de fato rodou é
`montar_wip.py` (Python puro). Este arquivo documenta o mesmo pipeline
para quando o professor abrir o projeto no Blender.

Uso (quando blender existir):

    blender --background --python bancadas/11-coracao/scripts/blender_montar_coracao.py

NÃO inventa anatomia: só importa FJ que existem em fontes/bodyparts3d/obj/.
NÃO aplica a transformação de eixos sem o professor aceitar o ápice.
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OBJ = ROOT / "fontes" / "bodyparts3d" / "obj"
EXPORT = ROOT / "export"
MAPA = ROOT / "mapeamento.json"

# TODO coordenada (não aplicar às cegas):
# BodyParts3D nativo: +X esquerda do paciente, +Y posterior, +Z superior, origem no corpo.
# Spec: 1 mm, Y-up, origem no ápice do VE, paciente esquerda = +X.
# Proposta (WIP, não validada):
#   X' = X - ax
#   Y' = Z - az    # superior → up
#   Z' = Y - ay    # posterior → +Z
# Ápice candidato: vértice de menor Z nativo de FJ2422.
APLICAR_TRANSFORMACAO = False  # deixar False até o professor validar o ápice


def _nomes_do_mapa():
    if not MAPA.exists():
        return []
    data = json.loads(MAPA.read_text(encoding="utf-8"))
    return [p for p in data["pecas"] if p.get("fj")]


def montar():
    try:
        import bpy  # type: ignore
    except ImportError:
        print("Blender/bpy ausente. Use montar_wip.py para o glb WIP.")
        print("Transformação TODO:", "origem no ápice do VE; Y-up; +X = esquerda do paciente.")
        print("APLICAR_TRANSFORMACAO =", APLICAR_TRANSFORMACAO)
        return 0

    bpy.ops.wm.read_factory_settings(use_empty=True)
    root = bpy.data.objects.new("coracao_WIP", None)
    bpy.context.collection.objects.link(root)
    root["wip"] = True
    root["aviso"] = "WIP — não é o coração de ensino acabado"

    grupos = {}

    def grupo(nome, pai=None):
        if nome in grupos:
            return grupos[nome]
        o = bpy.data.objects.new(nome, None)
        bpy.context.collection.objects.link(o)
        o.parent = pai or root
        grupos[nome] = o
        return o

    for peca in _nomes_do_mapa():
        pai = grupo(peca.get("pai") or "coracao_WIP") if peca.get("pai") else root
        no = grupo(peca["nome"], pai)
        no["fma"] = peca.get("fma") or ""
        no["bp"] = peca.get("bp") or ""
        no["status"] = peca.get("status")
        for fj in peca.get("fj") or []:
            path = OBJ / f"{fj}.obj"
            if not path.exists():
                continue
            bpy.ops.wm.obj_import(filepath=str(path))
            imported = [o for o in bpy.context.selected_objects]
            for o in imported:
                o.name = f"{peca['nome']}__{fj}"
                o.parent = no
                o["fj"] = fj
                o["fonte"] = "BodyParts3D PART-OF 4.0 obj 99%"
                # materiais: miocárdio fosco vs vaso lustroso — atribuir depois,
                # por grupo de nome, sem inventar geometria.
                if APLICAR_TRANSFORMACAO:
                    # TODO: traduzir pelo ápice e trocar Y/Z. Desligado de propósito.
                    pass

    EXPORT.mkdir(parents=True, exist_ok=True)
    dest = EXPORT / "coracao-bancada11-WIP.glb"
    bpy.ops.export_scene.gltf(
        filepath=str(dest),
        export_format="GLB",
        export_extras=True,
        export_yup=True,
    )
    print("exportou", dest)
    return 0


if __name__ == "__main__":
    sys.exit(montar())
