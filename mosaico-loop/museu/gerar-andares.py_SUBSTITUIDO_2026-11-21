#!/usr/bin/env python3
"""Loop · museu em 3 andares. Gera museu-andares.glb a partir de museu.glb (um andar, ThreeMuseum, MIT).
Uso: python3 gerar-andares.py museu.glb museu-andares.glb      (precisa de: pip install pygltflib numpy)
Térreo = o andar original, com as peças de exposição. Andares 1 e 2 = cópias da arquitetura (sem novos pesos de geometria),
com cores de piso próprias, lajes e guarda-corpos. O Pátio de luz fica vazado, do térreo ao último andar.
Materiais de cada andar têm prefixo A1_ e A2_ para o visualizador poder esconder um andar de cada vez."""
import sys, copy, struct
import numpy as np
from pygltflib import GLTF2, Material, Mesh, Primitive, Node, Accessor, BufferView, PbrMetallicRoughness, Attributes

ORIG, SAIDA = sys.argv[1], sys.argv[2]
P = 0.132            # distância vertical entre andares (altura da parede 0,123 + laje)
LAJE = 0.007
X0, X1, Z0, Z1 = -0.402, 0.402, -0.452, 0.306     # pegada do prédio
VX0, VX1, VZ1 = -0.041, 0.041, 0.092               # vazio do Pátio de luz (z de Z0 até VZ1)
FORA = {'Museum_concrete', 'Museum_joint', 'Museum_paving', 'Museum_sand', 'Museum_soil'}   # base externa fica só no térreo
PISOS = {'Museum_oak', 'Museum_oakDark', 'Museum_carpet', 'Museum_linen', 'Museum_limestone', 'Museum_terrazzo', 'Museum_charcoal', 'Museum_bronze'}
TINTA = {1: (0.80, 0.93, 1.10), 2: (0.86, 1.06, 0.84)}

g = GLTF2().load_binary(ORIG)
blob = bytearray(g.binary_blob())

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

g.scenes[0].nodes += novos
g.buffers[0].byteLength = len(blob)
g.set_binary_blob(bytes(blob))
g.save_binary(SAIDA)
print('ok', SAIDA, len(blob) // 1024, 'KB')
