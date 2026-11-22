#!/usr/bin/env python3
"""Loop · museu em RA. Converte museu-andares.glb em museu-andares.usdz (iPhone, Quick Look).
Uso: python3 gerar-usdz.py museu-andares.glb museu-andares.usdz      (precisa de: pip install pygltflib numpy usd-core)
Geometria estática com materiais UsdPreviewSurface (cor, brilho, emissão e vidro translúcido). Sem texturas."""
import sys, os, tempfile
import numpy as np
from pygltflib import GLTF2
from pxr import Usd, UsdGeom, UsdShade, UsdUtils, Gf, Sdf, Vt

ENT, SAI = sys.argv[1], sys.argv[2]
g = GLTF2().load_binary(ENT); blob = g.binary_blob()
DT = {5120: np.int8, 5121: np.uint8, 5122: np.int16, 5123: np.uint16, 5125: np.uint32, 5126: np.float32}
NC = {'SCALAR': 1, 'VEC2': 2, 'VEC3': 3, 'VEC4': 4}

def ler(i):
    a = g.accessors[i]; bv = g.bufferViews[a.bufferView]; n = NC[a.type]; dt = np.dtype(DT[a.componentType])
    off = (bv.byteOffset or 0) + (a.byteOffset or 0); passo = bv.byteStride or n * dt.itemsize
    if passo == n * dt.itemsize:
        return np.frombuffer(blob, dt, count=a.count * n, offset=off).reshape(a.count, n).copy()
    raw = np.frombuffer(blob, np.uint8, count=passo * a.count, offset=off).reshape(a.count, passo)
    return np.frombuffer(raw[:, :n * dt.itemsize].tobytes(), dt).reshape(a.count, n).copy()

def matriz(n):
    if n.matrix: return np.array(n.matrix, float).reshape(4, 4).T
    t = np.array(n.translation or [0, 0, 0], float); q = n.rotation or [0, 0, 0, 1]; s = np.array(n.scale or [1, 1, 1], float)
    x, y, z, w = q
    R = np.array([[1 - 2 * (y * y + z * z), 2 * (x * y - z * w), 2 * (x * z + y * w)],
                  [2 * (x * y + z * w), 1 - 2 * (x * x + z * z), 2 * (y * z - x * w)],
                  [2 * (x * z - y * w), 2 * (y * z + x * w), 1 - 2 * (x * x + y * y)]])
    M = np.eye(4); M[:3, :3] = R * s; M[:3, 3] = t
    return M

tmp = tempfile.mkdtemp(); usda = os.path.join(tmp, 'museu.usdc')
st = Usd.Stage.CreateNew(usda); UsdGeom.SetStageUpAxis(st, UsdGeom.Tokens.y); UsdGeom.SetStageMetersPerUnit(st, 1.0)
raiz = UsdGeom.Xform.Define(st, '/Museu'); st.SetDefaultPrim(raiz.GetPrim())
ESC = 0.4   # maquete de ~1,3 m vira ~50 cm sobre a mesa na RA do iPhone
raiz.AddScaleOp().Set(Gf.Vec3f(ESC, ESC, ESC))
mats = {}
def material(i):
    if i in mats: return mats[i]
    m = g.materials[i]; p = m.pbrMetallicRoughness
    cf = list(p.baseColorFactor) if p else [1, 1, 1, 1]
    nome = 'M%d' % i
    mt = UsdShade.Material.Define(st, '/Museu/Mats/' + nome)
    sh = UsdShade.Shader.Define(st, '/Museu/Mats/%s/Surf' % nome); sh.CreateIdAttr('UsdPreviewSurface')
    sh.CreateInput('diffuseColor', Sdf.ValueTypeNames.Color3f).Set(Gf.Vec3f(*cf[:3]))
    sh.CreateInput('roughness', Sdf.ValueTypeNames.Float).Set(float(p.roughnessFactor if p and p.roughnessFactor is not None else 0.8))
    sh.CreateInput('metallic', Sdf.ValueTypeNames.Float).Set(float(p.metallicFactor if p and p.metallicFactor is not None else 0.0))
    if m.emissiveFactor and any(m.emissiveFactor): sh.CreateInput('emissiveColor', Sdf.ValueTypeNames.Color3f).Set(Gf.Vec3f(*m.emissiveFactor))
    if cf[3] < 1: sh.CreateInput('opacity', Sdf.ValueTypeNames.Float).Set(float(cf[3]))
    mt.CreateSurfaceOutput().ConnectToSource(sh.ConnectableAPI(), 'surface')
    mats[i] = mt; return mt

usados = {}
cont = 0
for n in g.nodes:
    if n.mesh is None: continue
    M = matriz(n); cont += 1
    for pi, pr in enumerate(g.meshes[n.mesh].primitives):
        if pr.mode not in (None, 4): continue
        P = ler(pr.attributes.POSITION)[:, :3].astype(float)
        P = (np.c_[P, np.ones(len(P))] @ M.T)[:, :3]
        idx = ler(pr.indices).reshape(-1) if pr.indices is not None else np.arange(len(P))
        nome = 'N%d_%d' % (cont, pi)
        me = UsdGeom.Mesh.Define(st, '/Museu/' + nome)
        me.CreatePointsAttr(Vt.Vec3fArray.FromNumpy(P.astype(np.float32)))
        me.CreateFaceVertexCountsAttr(Vt.IntArray.FromNumpy(np.full(len(idx) // 3, 3, np.int32)))
        me.CreateFaceVertexIndicesAttr(Vt.IntArray.FromNumpy(idx.astype(np.int32)))
        if pr.attributes.NORMAL is not None:
            N = ler(pr.attributes.NORMAL)[:, :3].astype(float); N = N @ np.linalg.inv(M[:3, :3]).T
            l = np.linalg.norm(N, axis=1, keepdims=True); N = N / np.where(l == 0, 1, l)
            me.CreateNormalsAttr(Vt.Vec3fArray.FromNumpy(N.astype(np.float32))); me.SetNormalsInterpolation(UsdGeom.Tokens.vertex)
        me.CreateSubdivisionSchemeAttr('none'); me.CreateDoubleSidedAttr(True)
        if pr.material is not None: UsdShade.MaterialBindingAPI.Apply(me.GetPrim()).Bind(material(pr.material))
st.GetRootLayer().Save()
if os.path.exists(SAI): os.remove(SAI)
UsdUtils.CreateNewUsdzPackage(usda, SAI)
print('ok', SAI, os.path.getsize(SAI) // 1024, 'KB', cont, 'nós')
