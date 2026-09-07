#!/usr/bin/env python3
"""Monta o glb WIP hierárquico a partir dos OBJ BodyParts3D.

Não inventa peça: só entra malha com FJ no disco. A transformação para
ápice / Y-up é aplicada e marcada como WIP não validada (ver extras).
Blender ausente neste ambiente — este script é o exportador CLI.
"""
from __future__ import annotations

import json
import struct
import sys
from collections import defaultdict
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from catalogos import elementos, fj_para_conceitos, menor_nome, partes  # noqa: E402
from pecas import (  # noqa: E402
    BP3D_NATIVO,
    MATERIAIS,
    PECAS,
    SPEC_EIXOS,
    TRANSFORMACAO_TODO,
)

ROOT = Path(__file__).resolve().parents[1]
OBJ = ROOT / "fontes" / "bodyparts3d" / "obj"
EXPORT = ROOT / "export"


def ler_obj(path: Path):
    verts = []
    faces = []
    meta = {}
    for line in path.read_text(encoding="utf-8", errors="replace").splitlines():
        if line.startswith("# Volume(cm3)"):
            meta["volume_cm3"] = float(line.split(":")[1].strip())
        elif line.startswith("# Concept ID"):
            meta["fma"] = line.split(":")[1].strip()
        elif line.startswith("# Representation ID"):
            meta["bp"] = line.split(":")[1].strip()
        elif line.startswith("# English name"):
            meta["en"] = line.split(":")[1].strip()
        elif line.startswith("# File ID"):
            meta["fj"] = line.split(":")[1].strip()
        elif line.startswith("v "):
            x, y, z = line.split()[1:4]
            verts.append((float(x), float(y), float(z)))
        elif line.startswith("f "):
            idx = [int(tok.split("/")[0]) - 1 for tok in line.split()[1:]]
            for i in range(1, len(idx) - 1):
                faces.append((idx[0], idx[i], idx[i + 1]))
    return verts, faces, meta


def transformar(v, apice):
    """BodyParts3D nativo e LPS: x = esquerda do paciente, y = posterior,
    z = superior. LPS e DESTRO.

    A spec da bancada pede (x = esquerda, y = superior, z = ANTERIOR), que
    tambem e destro. A versao anterior devolvia (x, z, y): trocava dois eixos
    SEM inverter sinal, o que da determinante -1 -- sistema CANHOTO. O modelo
    saia espelhado, com frente e fundo trocados, e o ventriculo direito
    aparecia ATRAS do esquerdo quando ele e a camara ANTERIOR.

    O sinal de menos no terceiro termo conserta as duas coisas de uma vez:
    restaura a destreza e poe +Z na frente, que e o que a spec pede.
    """
    ax, ay, az = apice
    x, y, z = v
    return (x - ax, z - az, ay - y)


# ---------------------------------------------------------------- aparar
# O QUE E DEMAIS. O BodyParts3D entrega o vaso INTEIRO: a cava inferior desce
# ate a bifurcacao iliaca, 23 cm abaixo do apice, e sozinha triplicava a caixa
# do modelo -- qualquer enquadramento automatico deixava o coracao minusculo
# num canto. O arco aortico e a cava superior tambem sobem alem do que a
# bancada mostra.
#
# Corta-se pelo CENTROIDE do triangulo, nao pelos vertices: assim a borda sai
# limpa, sem lascas de triangulos meio dentro e meio fora. Os vasos ja sao
# tubos abertos, entao a ponta aparada nao precisa de tampa.
#
# Os dois numeros ficam aqui em cima, com nome, para serem ajustados olhando
# a tela em vez de cacados no meio do codigo.
# Os limites saem da MEDIDA do outro modelo, o scan realista, que e a
# referencia de proporcao: ele tem 120 mm do apice ao topo e nao tem nada
# abaixo do apice. Entao a cava inferior fica so com o coto de entrada, e o
# arco para na mesma altura em que o scan termina.
#
# Nao precisa ser cirurgico: e para reuniao didatica. O que precisa e caber
# no mesmo enquadramento do outro sem parecer outra escala.
# ---------------------------------------------------------------- remover
# PECAS QUE SAEM DA CENA. Nao e escolha anatomica, e de enquadramento: estes
# vasos saltavam do modelo e o desequilibravam ao lado do scan realista.
#
#   tronco_pulmonar, cava superior e cava inferior -- os tubos azuis, que
#   partiam para fora e dobravam a largura do modelo;
#
#   arco_aortico -- e este tem um motivo a mais. O arco corre na HORIZONTAL,
#   e aparar por altura o fatiava no comprimento em vez de corta-lo atraves:
#   virava uma fita chata em vez de um tubo. Como a aorta ascendente e o arco
#   sao pecas separadas, apagar o arco corta a aorta exatamente na juncao --
#   o "encaixe" que se ve no modelo.
#
# Sao pecas NOMEADAS que saem, e por nome: nada de apagar por cor ou por
# tamanho, que amanha pega outra coisa.
REMOVER = {
    "tronco_pulmonar",
    "veia_cava_superior",
    "veia_cava_inferior",
    "arco_aortico",
    # As CAVIDADES ficaram. Chegamos a remove-las para ver o esqueleto por
    # dentro, e o exercicio valeu -- foi ele que revelou que a parede
    # ventricular existe, arquivada com nome de atrio. Mas isso e assunto de
    # outra rodada; aqui elas voltam.
}

APARAR_ABAIXO = -4.0     # mm; so o coto de entrada da cava, nada de iliaca
APARAR_ACIMA = 120.0     # mm; a altura do scan, para os dois se enquadrarem igual


def aparar(verts, faces):
    """Remove os triangulos cujo centroide caia fora da caixa, e compacta."""
    # POR VERTICE, e nao pelo centroide. As malhas do BodyParts3D vem reduzidas
    # a 99%: os triangulos sao enormes, e um triangulo com centroide dentro do
    # limite podia ter vertice 26 mm fora dele. Cortando por vertice o limite
    # e garantido; a borda fica um pouco irregular, mas os vasos sao tubos de
    # secao quase circular, entao o corte cai perto de um anel.
    manter = []
    for f in faces:
        ys = (verts[f[0]][1], verts[f[1]][1], verts[f[2]][1])
        if APARAR_ABAIXO <= min(ys) and max(ys) <= APARAR_ACIMA:
            manter.append(f)
    if len(manter) == len(faces):
        return verts, faces, 0
    usados = sorted({i for f in manter for i in f})
    novo = {v: k for k, v in enumerate(usados)}
    return ([verts[i] for i in usados],
            [(novo[a], novo[b], novo[c]) for a, b, c in manter],
            len(faces) - len(manter))


def apice_ve(verts_cavidade):
    return min(verts_cavidade, key=lambda v: v[2])


def pack_mesh(verts, faces):
    vmin = [min(v[i] for v in verts) for i in range(3)]
    vmax = [max(v[i] for v in verts) for i in range(3)]
    blob = b"".join(struct.pack("<fff", *v) for v in verts)
    if len(verts) < 65536:
        idx_fmt, idx_size, ctype = "<HHH", 2, 5123
    else:
        idx_fmt, idx_size, ctype = "<III", 4, 5125
    ib = b"".join(struct.pack(idx_fmt, *f) for f in faces)
    if len(ib) % 4:
        ib += b"\x00" * (4 - len(ib) % 4)
    return {
        "blob": blob + ib,
        "nverts": len(verts),
        "nfaces": len(faces),
        "vmin": vmin,
        "vmax": vmax,
        "vbyte": len(blob),
        "ibyte": len(ib),
        "ctype": ctype,
        "idx_size": idx_size,
    }


def fjs_da_peca(peca, elems):
    if peca.get("papel") not in ("malha", "debug"):
        return []
    fma = peca.get("fma")
    if not fma:
        return []
    fjs = set(elems.get(fma, []))
    menos = peca.get("fj_menos")
    if menos:
        fjs -= set(elems.get(menos, []))
    for extra in peca.get("fma_extra", []):
        fjs |= set(elems.get(extra, []))
    return sorted(fjs)


def montar():
    parts = partes()
    elems = elementos()
    fjmap = fj_para_conceitos(elems, parts)
    usados = set()
    malhas = []  # (nome_no, peca, fj, verts, faces, meta)

    def especificidade(peca):
        n = peca["nome"]
        if n.startswith("cuspide_"):
            return 0
        if n.startswith("cavidade_") or n.startswith("musculo_papilar_"):
            return 1
        if n.startswith("parede_") or n.startswith("tronco_") or n.startswith("seio_"):
            return 2
        if peca.get("pai") == "vasos":
            return 3
        if n.startswith("miocardio_"):
            return 8
        if n.startswith("ramos_"):
            return 9
        return 5

    ordem = sorted(
        (p for p in PECAS if p.get("papel") in ("malha", "debug")),
        key=especificidade,
    )

    cav_path = OBJ / "FJ2422.obj"
    if not cav_path.exists():
        raise SystemExit(f"falta {cav_path} — rode baixar_bodyparts3d.py")
    aparados = []
    cav_v, _, cav_meta = ler_obj(cav_path)
    apice = apice_ve(cav_v)

    def pega(fj):
        p = OBJ / f"{fj}.obj"
        if not p.exists():
            return None
        v, f, m = ler_obj(p)
        v2 = [transformar(x, apice) for x in v]
        return v2, f, m

    for peca in ordem:
        if peca["nome"] == "ramos_coronarios_nao_nomeados_um_a_um":
            continue
        if peca["nome"] in REMOVER:
            # MARCAR COMO USADOS, senao a peca volta pela porta dos fundos: o
            # laco seguinte varre os FJ orfaos do coracao e readiciona os
            # arquivos que ninguem reclamou, com nome de FJ####. Removida por
            # nome, a cavidade reentrava por codigo -- e a contagem de
            # triangulos nao mudava um digito, o que quase passou batido.
            for fj in fjs_da_peca(peca, elems):
                usados.add(fj)
            continue
        for fj in fjs_da_peca(peca, elems):
            if fj in usados:
                continue
            got = pega(fj)
            if not got:
                continue
            usados.add(fj)
            v2, f2, m2 = got
            v2, f2, cortados = aparar(v2, f2)
            if not f2:
                continue
            if cortados:
                aparados.append((peca["nome"], fj, cortados))
            malhas.append((peca["nome"], peca, fj, v2, f2, m2))

    # ramos coronários restantes do coração
    resto = [fj for fj in elems.get("FMA7088", []) if fj not in usados]
    # classificar: se o menor nome parece vaso, vai para coronarias; senão miocárdio solto
    for fj in resto:
        got = pega(fj)
        if not got:
            continue
        gv, gf, gm = got
        gv, gf, gcort = aparar(gv, gf)
        if not gf:
            continue
        got = (gv, gf, gm)
        bn = menor_nome(fj, fjmap) or {"en": "unlisted element", "fma": "", "n": 99}
        en = bn["en"].lower()
        if any(k in en for k in ("coronary", "cardiac vein", "circumflex", "interventricular", "marginal", "diagonal", "conus", "sinus")):
            pai_nome = "ramos_coronarios_nao_nomeados_um_a_um"
            material = "coronaria"
        else:
            # não batizar miocárdio residual como câmara
            pai_nome = "miocardio_residual_FJ"
            material = "miocardio"
        peca = {
            "nome": f"{pai_nome}/{fj}",
            "pai": "coronarias" if material == "coronaria" else "coracao_WIP",
            "material": material,
            "papel": "malha",
            "en": bn["en"],
            "fma": bn["fma"],
        }
        usados.add(fj)
        malhas.append((f"{fj}", peca, fj, *got))

    return malhas, apice, cav_meta, usados


def glb_bytes(malhas, apice, extras_root):
    mats_idx = {k: i for i, k in enumerate(MATERIAIS)}
    materials = []
    for nome, spec in MATERIAIS.items():
        materials.append({
            "name": nome,
            "pbrMetallicRoughness": {
                "baseColorFactor": spec["baseColor"],
                "metallicFactor": spec["metallic"],
                "roughnessFactor": spec["roughness"],
            },
            "extras": {"grupo": spec["grupo"], "wip": True},
        })

    # nós de grupo
    grupos = []
    vistos = set()
    for p in PECAS:
        if p["nome"] not in vistos:
            grupos.append(p)
            vistos.add(p["nome"])
    # garantir coronarias/vasos etc.

    node_index = {}
    nodes = []

    def add_node(name, parent=None, extras=None, mesh=None):
        node = {"name": name}
        if extras:
            node["extras"] = extras
        if mesh is not None:
            node["mesh"] = mesh
        idx = len(nodes)
        nodes.append(node)
        node_index[name] = idx
        if parent is not None:
            p = nodes[node_index[parent]]
            p.setdefault("children", []).append(idx)
        return idx

    add_node(
        "coracao_WIP",
        extras={
            "wip": True,
            "aviso": "NÃO é o coração de ensino acabado. Malhas BodyParts3D 4.0, hierarquia da spec, transformação de eixos NÃO validada.",
            "spec_eixos": SPEC_EIXOS,
            "bp3d_nativo": BP3D_NATIVO,
            "transformacao_aplicada": TRANSFORMACAO_TODO | {"apice_nativo_mm": list(apice)},
            **extras_root,
        },
    )
    for p in PECAS:
        if p["nome"] == "coracao_WIP":
            continue
        if p["nome"] in node_index:
            continue
        pai = p.get("pai", "coracao_WIP")
        if pai not in node_index:
            add_node(pai, parent="coracao_WIP", extras={"wip": True, "grupo": True})
        add_node(p["nome"], parent=pai, extras={
            "wip": True,
            "papel": p.get("papel"),
            "fma": p.get("fma"),
            "bp": p.get("bp"),
            "en": p.get("en"),
            "nota": p.get("nota"),
        })

    # meshes
    bin_blob = b""
    buffer_views = []
    accessors = []
    meshes = []

    def pad4(b):
        return b + b"\x00" * ((4 - len(b) % 4) % 4)

    # agrupar malhas do mesmo nome de peça (vários FJ)
    por_no = defaultdict(list)
    for nome, peca, fj, verts, faces, meta in malhas:
        por_no[nome].append((peca, fj, verts, faces, meta))

    for nome, itens in por_no.items():
        primitives = []
        for peca, fj, verts, faces, meta in itens:
            packed = pack_mesh(verts, faces)
            off = len(bin_blob)
            bin_blob += pad4(packed["blob"])
            bv_v = len(buffer_views)
            buffer_views.append({"buffer": 0, "byteOffset": off, "byteLength": packed["vbyte"], "target": 34962})
            bv_i = len(buffer_views)
            buffer_views.append({
                "buffer": 0,
                "byteOffset": off + packed["vbyte"],
                "byteLength": packed["nfaces"] * 3 * packed["idx_size"],
                "target": 34963,
            })
            acc_v = len(accessors)
            accessors.append({
                "bufferView": bv_v, "componentType": 5126, "count": packed["nverts"],
                "type": "VEC3", "min": packed["vmin"], "max": packed["vmax"],
            })
            acc_i = len(accessors)
            accessors.append({
                "bufferView": bv_i, "componentType": packed["ctype"],
                "count": packed["nfaces"] * 3, "type": "SCALAR",
            })
            mat_name = peca.get("material", "miocardio")
            primitives.append({
                "attributes": {"POSITION": acc_v},
                "indices": acc_i,
                "material": mats_idx.get(mat_name, 0),
                "extras": {
                    "fj": fj,
                    "fma": meta.get("fma") or peca.get("fma"),
                    "bp": meta.get("bp") or peca.get("bp"),
                    "en": meta.get("en") or peca.get("en"),
                    "volume_cm3_cabecalho": meta.get("volume_cm3"),
                    "triangulos": packed["nfaces"],
                    "wip": True,
                    "fonte": "BodyParts3D PART-OF 4.0 obj 99%",
                },
            })
        mesh_i = len(meshes)
        meshes.append({"name": nome, "primitives": primitives})
        if nome in node_index:
            nodes[node_index[nome]]["mesh"] = mesh_i
            nodes[node_index[nome]].setdefault("extras", {})["tem_malha"] = True
        else:
            # FJ solto
            peca0 = itens[0][0]
            pai = peca0.get("pai", "coracao_WIP")
            if pai not in node_index:
                add_node(pai, parent="coracao_WIP")
            add_node(nome, parent=pai, mesh=mesh_i, extras={
                "wip": True, "fj": itens[0][1], "en": peca0.get("en"), "fma": peca0.get("fma"),
            })

    ntri = sum(len(it[3]) for itens in por_no.values() for it in itens)
    nodes[0]["extras"]["triangulos"] = ntri
    nodes[0]["extras"]["orcamento_60k"] = ntri <= SPEC_EIXOS["glb_triangulos_max"]
    nodes[0]["extras"]["malhas"] = len(malhas)

    gltf = {
        "asset": {
            "version": "2.0",
            "generator": "lab-ra bancadas/11-coracao montar_wip.py",
            "extras": {"wip": True, "licenca": "CC-BY-SA 2.1 JP (BodyParts3D) / CC-BY-SA 4.0 (Z-Anatomy atribuição)"},
        },
        "scene": 0,
        "scenes": [{"nodes": [0], "name": "coracao_WIP", "extras": {"wip": True}}],
        "nodes": nodes,
        "meshes": meshes,
        "materials": materials,
        "accessors": accessors,
        "bufferViews": buffer_views,
        "buffers": [{"byteLength": len(bin_blob)}],
    }
    json_bytes = json.dumps(gltf, ensure_ascii=False, separators=(",", ":")).encode("utf-8")
    json_bytes = json_bytes + b" " * ((4 - len(json_bytes) % 4) % 4)
    chunks = b""
    chunks += struct.pack("<I", len(json_bytes)) + b"JSON" + json_bytes
    chunks += struct.pack("<I", len(bin_blob)) + b"BIN\x00" + bin_blob
    header = b"glTF" + struct.pack("<II", 2, 12 + len(chunks))
    return header + chunks, ntri, gltf


def main():
    EXPORT.mkdir(parents=True, exist_ok=True)
    malhas, apice, cav_meta, usados = montar()
    extras = {
        "apice_nativo_mm": list(apice),
        "cavidade_ve_volume_cm3_cabecalho": cav_meta.get("volume_cm3"),
        "fj_usados": sorted(usados),
    }
    data, ntri, gltf = glb_bytes(malhas, apice, extras)
    out = EXPORT / "coracao-bancada11-WIP.glb"
    out.write_bytes(data)
    resumo = {
        "arquivo": str(out.relative_to(ROOT)),
        "wip": True,
        "triangulos": ntri,
        "orcamento_60k": ntri <= 60_000,
        "nos_com_malha": sum(1 for n in gltf["nodes"] if "mesh" in n),
        "apice_nativo_mm": list(apice),
        "transformacao": TRANSFORMACAO_TODO,
        "aviso": "WIP. Não usar como coração de ensino acabado.",
    }
    (EXPORT / "coracao-bancada11-WIP.json").write_text(
        json.dumps(resumo, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(json.dumps(resumo, indent=2, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    sys.exit(main())
