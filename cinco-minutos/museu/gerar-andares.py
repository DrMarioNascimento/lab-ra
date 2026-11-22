#!/usr/bin/env python3
"""Loop · museu em 3 andares. Gera museu-andares.glb a partir de museu.glb (um andar, ThreeMuseum, MIT).
Uso: python3 gerar-andares.py museu.glb museu-andares.glb      (precisa de: pip install pygltflib numpy)
Térreo = o andar original, com as peças de exposição. Andares 1 e 2 = cópias da arquitetura (sem novos pesos de geometria),
com cores de piso próprias, lajes e guarda-corpos. O Pátio de luz fica vazado, do térreo ao último andar.
Materiais de cada andar têm prefixo A1_ e A2_ para o visualizador poder esconder um andar de cada vez."""
import sys, copy, struct
import numpy as np
from pygltflib import GLTF2, Material, Mesh, Primitive, Node, Accessor, BufferView, PbrMetallicRoughness, Attributes
PBR = PbrMetallicRoughness

ORIG, SAIDA = sys.argv[1], sys.argv[2]
P = 0.132            # distância vertical entre andares (altura da parede 0,123 + laje)
LAJE = 0.007
X0, X1, Z0, Z1 = -0.402, 0.402, -0.452, 0.306     # pegada do prédio
VX0, VX1, VZ1 = -0.041, 0.041, 0.092               # vazio do Pátio de luz (z de Z0 até VZ1)
FORA = {'Museum_concrete', 'Museum_joint', 'Museum_paving', 'Museum_sand', 'Museum_soil'}   # base externa fica só no térreo
PISOS = {'Museum_oak', 'Museum_oakDark', 'Museum_carpet', 'Museum_linen', 'Museum_limestone', 'Museum_terrazzo', 'Museum_charcoal', 'Museum_bronze'}
TINTA = {1: (0.74, 0.92, 1.16), 2: (0.80, 1.08, 0.78)}
FAIXA = {0: (0.91, 0.66, 0.25), 1: (0.27, 0.58, 0.86), 2: (0.28, 0.72, 0.45)}   # cor de cada andar (térreo dourado, 1º azul, 2º verde)

g = GLTF2().load_binary(ORIG)
blob = bytearray(g.binary_blob())

def ajustar(nome, cor=None, rug=None, met=None, emis=None):
    for m in g.materials:
        if m.name == nome:
            p = m.pbrMetallicRoughness
            if cor: p.baseColorFactor = list(cor) + [p.baseColorFactor[3]]
            if rug is not None: p.roughnessFactor = rug
            if met is not None: p.metallicFactor = met
            if emis: m.emissiveFactor = list(emis)
# Acabamento de maquete: gesso mais quente, pisos com mais cor, vidro brilhante, luminárias acesas
ajustar('Museum_plaster', (0.90, 0.85, 0.76), rug=0.9)
ajustar('Museum_limestone', (0.86, 0.80, 0.68), rug=0.85)
ajustar('Museum_terrazzo', (0.84, 0.80, 0.72), rug=0.55)
ajustar('Museum_linen', (0.86, 0.80, 0.70), rug=0.95)
ajustar('Museum_oak', (0.74, 0.54, 0.34), rug=0.5)
ajustar('Museum_oakDark', (0.50, 0.34, 0.20), rug=0.5)
ajustar('Museum_carpet', (0.26, 0.38, 0.45), rug=0.98)
ajustar('Museum_bronze', (0.80, 0.60, 0.32), rug=0.3, met=0.85)
ajustar('Museum_glass', rug=0.04, met=0.0)
ajustar('Museum_light', emis=(1.0, 0.86, 0.55))
ajustar('Museum_screen', (0.05, 0.12, 0.16), rug=0.2, emis=(0.05, 0.25, 0.32))

def cor_material(m, k):
    m2 = copy.deepcopy(m)
    m2.name = f'A{k}_{m.name.replace("Museum_", "")}'
    if m.name in PISOS:
        f = m2.pbrMetallicRoughness.baseColorFactor
        m2.pbrMetallicRoughness.baseColorFactor = [min(1, f[0] * TINTA[k][0]), min(1, f[1] * TINTA[k][1]), min(1, f[2] * TINTA[k][2]), f[3]]
    return m2

def caixa(x0, x1, y0, y1, z0, z1):
    v = []; n = []; idx = []
    faces = [((0, 1, 0), [(x0, y1, z0), (x1, y1, z0), (x1, y1, z1), (x0, y1, z1)]),
             ((0, -1, 0), [(x0, y0, z1), (x1, y0, z1), (x1, y0, z0), (x0, y0, z0)]),
             ((1, 0, 0), [(x1, y0, z0), (x1, y0, z1), (x1, y1, z1), (x1, y1, z0)]),
             ((-1, 0, 0), [(x0, y0, z1), (x0, y0, z0), (x0, y1, z0), (x0, y1, z1)]),
             ((0, 0, 1), [(x1, y0, z1), (x0, y0, z1), (x0, y1, z1), (x1, y1, z1)]),
             ((0, 0, -1), [(x0, y0, z0), (x1, y0, z0), (x1, y1, z0), (x0, y1, z0)])]
    for nm, quad in faces:
        b = len(v)
        v += quad; n += [nm] * 4
        idx += [b, b + 1, b + 2, b, b + 2, b + 3]
    return v, n, idx

def adicionar_geometria(caixas, material, nome):
    V = []; N = []; I = []
    for c in caixas:
        v, n, i = caixa(*c); b = len(V); V += v; N += n; I += [x + b for x in i]
    V = np.array(V, dtype=np.float32); N = np.array(N, dtype=np.float32); I = np.array(I, dtype=np.uint16)
    def pedaco(arr, alvo):
        while len(blob) % 4: blob.append(0)
        ini = len(blob); blob.extend(arr.tobytes())
        g.bufferViews.append(BufferView(buffer=0, byteOffset=ini, byteLength=arr.nbytes, target=alvo))
        return len(g.bufferViews) - 1
    bv_v = pedaco(V, 34962); bv_n = pedaco(N, 34962); bv_i = pedaco(I, 34963)
    g.accessors.append(Accessor(bufferView=bv_v, componentType=5126, count=len(V), type='VEC3', min=V.min(0).tolist(), max=V.max(0).tolist()))
    g.accessors.append(Accessor(bufferView=bv_n, componentType=5126, count=len(N), type='VEC3'))
    g.accessors.append(Accessor(bufferView=bv_i, componentType=5123, count=len(I), type='SCALAR', min=[int(I.min())], max=[int(I.max())]))
    a = len(g.accessors) - 3
    g.meshes.append(Mesh(name=nome, primitives=[Primitive(attributes=Attributes(POSITION=a, NORMAL=a + 1), indices=a + 2, material=material)]))
    return len(g.meshes) - 1

arq = [i for i, n in enumerate(g.nodes) if n.name.startswith('Museum_')]
novos = []
for k in (1, 2):
    y = k * P
    mats = {}
    for i in arq:
        n = g.nodes[i]
        if n.name in FORA: continue
        prim = g.meshes[n.mesh].primitives[0]
        mi = prim.material
        if mi not in mats:
            g.materials.append(cor_material(g.materials[mi], k)); mats[mi] = len(g.materials) - 1
        m2 = copy.deepcopy(g.meshes[n.mesh]); m2.name = f'A{k}_{n.name}'
        m2.primitives[0].material = mats[mi]
        g.meshes.append(m2)
        g.nodes.append(Node(name=f'A{k}_{n.name}', mesh=len(g.meshes) - 1, translation=[0, y, 0]))
        novos.append(len(g.nodes) - 1)
    # laje (abaixo do piso do andar k) com o vazio do Pátio de luz
    base = g.materials[[m.name for m in g.materials].index('Museum_limestone')]
    lj = copy.deepcopy(base); lj.name = f'A{k}_laje'
    g.materials.append(lj); ml = len(g.materials) - 1
    laje = [(X0, VX0, y - LAJE, y, Z0, Z1), (VX1, X1, y - LAJE, y, Z0, Z1), (VX0, VX1, y - LAJE, y, VZ1, Z1)]
    g.nodes.append(Node(name=f'A{k}_laje', mesh=adicionar_geometria(laje, ml, f'A{k}_laje'))); novos.append(len(g.nodes) - 1)
    # guarda-corpo ao redor do vazio
    gc = copy.deepcopy(g.materials[[m.name for m in g.materials].index('Museum_bronze')]); gc.name = f'A{k}_guarda'
    g.materials.append(gc); mg = len(g.materials) - 1
    h, t = 0.013, 0.0025
    rail = [(VX0 - t, VX0, y, y + h, Z0, VZ1 + t), (VX1, VX1 + t, y, y + h, Z0, VZ1 + t), (VX0 - t, VX1 + t, y, y + h, VZ1, VZ1 + t)]
    g.nodes.append(Node(name=f'A{k}_guarda', mesh=adicionar_geometria(rail, mg, f'A{k}_guarda'))); novos.append(len(g.nodes) - 1)


# ---------- detalhes novos ----------
def novo_material(nome, cor, rug=0.7, met=0.0, emis=None):
    from pygltflib import Material as _M
    m = _M(name=nome, pbrMetallicRoughness=PBR(baseColorFactor=list(cor) + [1.0], metallicFactor=met, roughnessFactor=rug), doubleSided=False)
    if emis: m.emissiveFactor = list(emis)
    g.materials.append(m)
    return len(g.materials) - 1

def malha_tris(tris, material, nome):
    """tris: lista de triângulos ((x,y,z),(x,y,z),(x,y,z)); normais planas."""
    V = []; N = []; I = []
    for a, b, c in tris:
        a, b, c = np.array(a, np.float32), np.array(b, np.float32), np.array(c, np.float32)
        n = np.cross(b - a, c - a); l = np.linalg.norm(n)
        n = n / l if l else np.array([0, 1, 0], np.float32)
        i0 = len(V); V += [a, b, c]; N += [n, n, n]; I += [i0, i0 + 1, i0 + 2]
    V = np.array(V, np.float32); N = np.array(N, np.float32); I = np.array(I, np.uint16)
    def pedaco(arr, alvo):
        while len(blob) % 4: blob.append(0)
        ini = len(blob); blob.extend(arr.tobytes())
        g.bufferViews.append(BufferView(buffer=0, byteOffset=ini, byteLength=arr.nbytes, target=alvo))
        return len(g.bufferViews) - 1
    bv_v = pedaco(V, 34962); bv_n = pedaco(N, 34962); bv_i = pedaco(I, 34963)
    g.accessors.append(Accessor(bufferView=bv_v, componentType=5126, count=len(V), type='VEC3', min=V.min(0).tolist(), max=V.max(0).tolist()))
    g.accessors.append(Accessor(bufferView=bv_n, componentType=5126, count=len(N), type='VEC3'))
    g.accessors.append(Accessor(bufferView=bv_i, componentType=5123, count=len(I), type='SCALAR', min=[int(I.min())], max=[int(I.max())]))
    a = len(g.accessors) - 3
    g.meshes.append(Mesh(name=nome, primitives=[Primitive(attributes=Attributes(POSITION=a, NORMAL=a + 1), indices=a + 2, material=material)]))
    g.nodes.append(Node(name=nome, mesh=len(g.meshes) - 1)); novos.append(len(g.nodes) - 1)

def tris_de_caixas(caixas):
    T = []
    for c in caixas:
        v, n, i = caixa(*c)
        for j in range(0, len(i), 3): T.append((v[i[j]], v[i[j + 1]], v[i[j + 2]]))
    return T

def anel(x0, x1, z0, z1, y0, y1, e):
    """moldura retangular de espessura e (para fora do retângulo)."""
    return [(x0 - e, x1 + e, y0, y1, z0 - e, z0), (x0 - e, x1 + e, y0, y1, z1, z1 + e), (x0 - e, x0, y0, y1, z0, z1), (x1, x1 + e, y0, y1, z0, z1)]

def copa(cx, cy, cz, r, h):
    """folhagem baixa-poli: bipirâmide de 6 lados."""
    top = (cx, cy + h, cz); bot = (cx, cy - h * 0.55, cz)
    ang = [i * np.pi / 3 for i in range(6)]
    ring = [(cx + r * np.cos(a), cy, cz + r * np.sin(a)) for a in ang]
    T = []
    for i in range(6):
        p, q = ring[i], ring[(i + 1) % 6]
        T.append((top, q, p)); T.append((bot, p, q))
    return T

ALTURA = 0.123
for k in (0, 1, 2):
    y = k * P
    pre = 'Museum_' if k == 0 else f'A{k}_'
    mf = novo_material(pre + 'faixa', FAIXA[k], rug=0.45)
    # friso na base das paredes externas (marca a cor do andar)
    tris = tris_de_caixas(anel(X0, X1, Z0, Z1, y, y + 0.007, 0.004))
    malha_tris(tris, mf, f'{pre}friso')
    if k > 0:
        tris = tris_de_caixas(anel(X0, X1, Z0, Z1, y - LAJE - 0.002, y, 0.003))
        malha_tris(tris, mf, f'{pre}beiral')

# jardim, calçada e árvores (fazem parte do térreo)
gr = novo_material('Museum_grama', (0.36, 0.55, 0.29), rug=0.95)
bs = novo_material('Museum_base', (0.16, 0.22, 0.25), rug=0.8)
malha_tris(tris_de_caixas([(-0.62, 0.62, -0.040, -0.0015, -0.66, 0.50)]), gr, 'Museu_gramado')
malha_tris(tris_de_caixas([(-0.64, 0.64, -0.052, -0.040, -0.68, 0.52)]), bs, 'Museu_base')
tr = novo_material('Museum_tronco', (0.42, 0.30, 0.19), rug=0.9)
f1 = novo_material('Museum_folha', (0.27, 0.52, 0.25), rug=0.9)
f2 = novo_material('Museum_folha2', (0.40, 0.62, 0.30), rug=0.9)
arvores = [(-0.47, 0.37), (-0.47, 0.18), (-0.47, -0.05), (-0.47, -0.28), (-0.47, -0.52), (0.47, 0.37), (0.47, 0.12), (0.47, -0.14), (0.47, -0.40), (0.47, -0.54),
           (-0.28, -0.54), (0.0, -0.58), (0.26, -0.55), (-0.30, 0.40), (0.28, 0.40), (-0.16, 0.43), (0.16, 0.43)]
troncos = []; folhas1 = []; folhas2 = []
for i, (ax, az) in enumerate(arvores):
    h = 0.03 + 0.012 * (i % 3)
    troncos.append((ax - 0.004, ax + 0.004, 0, h, az - 0.004, az + 0.004))
    r = 0.026 + 0.004 * (i % 3)
    folhas1 += copa(ax, h + 0.012, az, r, 0.03)
    folhas2 += copa(ax, h + 0.040, az, r * 0.66, 0.026)
malha_tris(tris_de_caixas(troncos), tr, 'Museu_troncos')
malha_tris(folhas1, f1, 'Museu_copas1')
malha_tris(folhas2, f2, 'Museu_copas2')
# marquise da entrada (frente do museu, lado do Saguão/Recepção)
bz = [g.materials[[m.name for m in g.materials].index('Museum_bronze')]]
mq = novo_material('Museum_marquise', (0.91, 0.66, 0.25), rug=0.35, met=0.4)
malha_tris(tris_de_caixas([(-0.10, 0.10, 0.078, 0.084, Z1, Z1 + 0.060),
                           (-0.098, -0.092, 0.0, 0.078, Z1 + 0.052, Z1 + 0.058), (0.092, 0.098, 0.0, 0.078, Z1 + 0.052, Z1 + 0.058)]), mq, 'Museu_marquise')

g.scenes[0].nodes += novos
g.buffers[0].byteLength = len(blob)
g.set_binary_blob(bytes(blob))
g.save_binary(SAIDA)
print('ok', SAIDA, len(blob) // 1024, 'KB')
