"""Mitocôndria realista (gera ../assets/mitocondria-aberta.glb e -fechada.glb)

Uso (pip: numpy scikit-image trimesh fast-simplification):
  LEVE=1 MODO=aberta  SAIDA=../assets/mitocondria-aberta.glb  python3 gerar-mitocondria.py 0.02 20000 50000
  LEVE=1 MODO=fechada SAIDA=../assets/mitocondria-fechada.glb python3 gerar-mitocondria.py 0.03 8000
  MODO=aberta SAIDA=mitocondria-detalhada.glb python3 gerar-mitocondria.py 0.02 50000 170000   # versão densa

Mitocôndria realista por campo de distância (SDF) + marching cubes.

Escala: 1 unidade = 0,5 µm (comprimento 4 u = 2 µm; diâmetro ~2 u = 1 µm).
A membrana interna e as cristas formam UMA superfície contínua: as cristas são
invaginações da membrana interna, ligadas ao espaço intermembranas por junções
estreitas. Um corte em cunha secciona membranas e cristas, expondo as duas
membranas, o espaço intermembranas e o lúmen das cristas.
"""
import numpy as np, trimesh, fast_simplification, json, sys
from skimage.measure import marching_cubes

rng = np.random.default_rng(11)
import os
MODO = os.environ.get('MODO', 'aberta')            # 'aberta' (corte, com interior) ou 'fechada' (só a casca, leve)
SUB = 0 if os.environ.get('LEVE') else 1          # subdivisão das esferas pequenas
SAIDA = os.environ.get('SAIDA', 'mitocondria.glb')
VOX = float(sys.argv[1]) if len(sys.argv) > 1 else 0.02
T = 0.05          # espessura de cada membrana (bicamada ~7 nm, ampliada ~3,5x para leitura)
GAP = 0.055       # espaço intermembranas
CUT_C, CUT_H = np.pi * 0.40, np.pi * 0.30   # centro e meia-abertura do corte (ângulo em y=cos, z=sin)

# ---------------------------------------------------------------- ruído suave
def ondas(n, kmin, kmax, amp):
    d = rng.normal(size=(n, 3)); d /= np.linalg.norm(d, axis=1, keepdims=True)
    k = rng.uniform(kmin, kmax, n); f = rng.uniform(0, 2 * np.pi, n)
    a = amp / np.sqrt(n)
    def ruido(x, y, z):
        s = np.zeros_like(x)
        for i in range(n):
            s += a * np.sin(k[i] * (d[i, 0] * x + d[i, 1] * y + d[i, 2] * z) + f[i])
        return s
    return ruido
forma = ondas(10, 0.8, 2.0, 0.09)          # ondulação larga do contorno
pele = ondas(24, 28.0, 55.0, 0.010)        # rugosidade fina (poros, irregularidade da bicamada)
manchas = ondas(12, 5.0, 9.0, 0.010)      # variação média de tom

def smax(a, b, k):
    h = np.clip(0.5 - 0.5 * (b - a) / k, 0, 1)
    return b * (1 - h) + a * h + k * h * (1 - h)
def smin(a, b, k):
    return -smax(-a, -b, k)

# ---------------------------------------------------------------- forma externa
def eixo_y(x):            # leve curvatura de feijão
    return 0.10 * (x / 2.0) ** 2
def sd_externa(x, y, z):
    yy = y - eixo_y(x)
    xc = np.clip(x, -1.0, 1.0)
    r = 1.0 + 0.05 * np.cos(x * 1.3)
    return np.sqrt((x - xc) ** 2 + yy ** 2 + z ** 2) - r + forma(x, y, z)

# ---------------------------------------------------------------- cristas
CRISTAS = []
xs = np.linspace(-1.55, 1.55, 12)
for i, cx in enumerate(xs):
    lado = (i % 2) * np.pi + rng.uniform(-0.5, 0.5) + np.pi / 2   # alterna em cima/embaixo, com variação
    CRISTAS.append(dict(
        x=cx + rng.uniform(-0.05, 0.05), th=lado,
        prof=rng.uniform(1.05, 1.55),        # até onde avança na matriz (diâmetro ~2)
        incl=rng.uniform(-0.18, 0.18),       # leve inclinação do plano
        fa=rng.uniform(0, 6.28), fb=rng.uniform(0, 6.28),
        junc=rng.uniform(-0.6, 0.6, 3),      # posições das junções ao longo da parede
    ))
H_CORPO, H_PESC = 0.05, 0.024               # meia-espessura do saco e do pescoço (junção)

def sd_sacos(x, y, z, sdI):
    """saco achatado de cada crista: corpo (longe da parede) + junções tubulares"""
    yy = y - eixo_y(x)
    tot = np.full_like(x, 9.0)
    for c in CRISTAS:
        e = np.array([np.cos(c['th']), np.sin(c['th'])])          # direção da parede de origem
        t = np.array([-e[1], e[0]])
        u = yy * e[0] + z * e[1]                                  # coordenada rumo à parede
        v = yy * t[0] + z * t[1]                                  # ao longo da crista
        prof = -sdI                                               # profundidade a partir da parede interna (>0 dentro)
        lado_certo = u > -0.15                                    # só nasce do lado de origem... e avança
        plano = x - (c['x'] + c['incl'] * u + 0.07 * np.sin(2.6 * v + c['fa']) + 0.045 * np.sin(3.4 * u + c['fb']))
        # corpo: da profundidade 0.10 até a ponta, ponta arredondada
        alcance = (1.0 - u) - c['prof']                           # >0 depois da ponta
        corpo = np.maximum(np.abs(plano) - H_CORPO, np.maximum(0.10 - prof, alcance))
        # coloca o corpo só do lado de origem: distância medida a partir da parede de origem
        corpo = np.where(u > -1.2, corpo, 9.0)
        # junções: tubos estreitos da parede até o corpo
        jun = np.full_like(x, 9.0)
        for jv in c['junc']:
            dj = np.sqrt(plano ** 2 + (v - jv) ** 2) - H_PESC
            jun = np.minimum(jun, np.where(u > 0, np.maximum(dj, prof - 0.16), 9.0))   # só na parede de origem
        tot = np.minimum(tot, smin(corpo, jun, 0.03))
    return tot

def sd_cunha(x, y, z):
    if MODO == 'fechada': return np.full_like(x, 9.0)
    """cunha removida (negativa dentro): setor angular em torno do eixo X"""
    a1, a2 = CUT_C - CUT_H, CUT_C + CUT_H
    yy = y - eixo_y(x)
    p1 = -(yy * -np.sin(a1) + z * np.cos(a1))   # dentro se à frente da borda 1
    p2 = (yy * -np.sin(a2) + z * np.cos(a2))
    return np.maximum(p1, p2)

def campos(x, y, z):
    sdO = sd_externa(x, y, z)
    sdI = sdO + T + GAP
    sacos = sd_sacos(x, y, z, sdI)
    sdM = smax(sdI, -sacos, 0.025)             # matriz = dentro da membrana interna e fora dos sacos
    cun = sd_cunha(x, y, z)
    ext = np.maximum(np.abs(sdO + pele(x, y, z) * 0.0) - T / 2, -cun)
    inn = np.maximum(np.abs(sdM) - T / 2, -cun)
    return ext, inn, sdM, cun, sdO

# ---------------------------------------------------------------- grade
xs_ = np.arange(-2.25, 2.25 + VOX, VOX); ys_ = np.arange(-1.25, 1.35 + VOX, VOX); zs_ = np.arange(-1.25, 1.25 + VOX, VOX)
EXT = np.empty((len(xs_), len(ys_), len(zs_)), np.float32); INN = np.empty_like(EXT)
Y, Z = np.meshgrid(ys_, zs_, indexing='ij')
for i, xv in enumerate(xs_):
    X = np.full_like(Y, xv)
    e, n, *_ = campos(X, Y, Z)
    EXT[i] = e; INN[i] = n
print('grade', EXT.shape, file=sys.stderr)

def malha(campo):
    v, f, _, _ = marching_cubes(campo, 0.0, spacing=(VOX, VOX, VOX))
    v += np.array([xs_[0], ys_[0], zs_[0]])
    m = trimesh.Trimesh(v, f[:, ::-1], process=True)
    trimesh.smoothing.filter_taubin(m, iterations=12)
    return m

def reduzir(m, alvo):
    if len(m.faces) <= alvo: return m
    v, f = fast_simplification.simplify(m.vertices.astype(np.float32), m.faces.astype(np.int32), target_reduction=1 - alvo / len(m.faces))
    m2 = trimesh.Trimesh(v, f, process=True)
    m2.update_faces(m2.nondegenerate_faces()); m2.remove_unreferenced_vertices()
    trimesh.repair.fix_normals(m2)        # triângulos invertidos pela redução viravam pontos escuros
    trimesh.smoothing.filter_taubin(m2, iterations=4)
    return m2

ext = reduzir(malha(EXT), int(sys.argv[2]) if len(sys.argv) > 2 else 70000)
inn = reduzir(malha(INN), int(sys.argv[3]) if len(sys.argv) > 3 else 220000) if MODO == 'aberta' else None
print('faces', len(ext.faces), len(inn.faces) if inn is not None else 0, file=sys.stderr)

# ---------------------------------------------------------------- cor com oclusão e textura
def ao(m, extra=None):
    """oclusão de contato a partir do próprio campo: amostra à frente da normal"""
    p, n = m.vertices, m.vertex_normals
    acc = np.zeros(len(p))
    for d in (0.04, 0.09, 0.16):
        q = p + n * d
        e, i_, *_ = campos(q[:, 0], q[:, 1], q[:, 2])
        s = np.minimum(e, i_)
        acc += np.clip(s / d, 0, 1)
    return acc / 3

def colorir(m, base, corte, rugosidade):
    p = m.vertices
    _, _, _, cun, _ = campos(p[:, 0], p[:, 1], p[:, 2])
    no_corte = (np.abs(cun) < VOX * 1.5).astype(float)
    tex = 1 + rugosidade * (pele(p[:, 0], p[:, 1], p[:, 2]) / 0.010) + 0.04 * manchas(p[:, 0], p[:, 1], p[:, 2]) / 0.010
    oc = 0.58 + 0.42 * ao(m) ** 1.2
    cor = (np.outer(1 - no_corte, base) + np.outer(no_corte, corte)) * (tex * oc)[:, None]
    cor = np.clip(cor, 0, 1) ** 2.2          # glTF guarda cor por vértice em espaço LINEAR
    m.visual.vertex_colors = np.hstack([(cor * 255).astype(np.uint8), np.full((len(p), 1), 255, np.uint8)])

# textura em relevo: deslocamento fino ao longo da normal (sobrevive em qualquer visualizador, inclusive na RA)
def relevo(m, amp):
    p = m.vertices; m.vertices = p + m.vertex_normals * (amp * pele(p[:, 0], p[:, 1], p[:, 2]) / 0.010)[:, None]
if SUB:          # relevo só na versão densa; na leve ele vira facetas
    relevo(ext, 0.006)
    if inn is not None: relevo(inn, 0.003)
colorir(ext, np.array([0.90, 0.50, 0.40]) * (0.86 if MODO == 'fechada' else 1), np.array([0.98, 0.84, 0.74]), 0.12)
if inn is not None: colorir(inn, np.array([0.98, 0.66, 0.46]), np.array([1.00, 0.89, 0.78]), 0.07)

# ---------------------------------------------------------------- conteúdo
def no_kept_matriz(p, folga):
    _, _, sdM, cun, _ = campos(p[:, 0], p[:, 1], p[:, 2])
    return (sdM < -folga) & (cun > 0.03)

pecas = {}
if MODO == 'fechada':
    cena = trimesh.Scene(); m = ext.copy(); m.apply_scale(0.1)
    m.visual.material = trimesh.visual.material.PBRMaterial(name='membrana_externa', roughnessFactor=0.55, metallicFactor=0)
    cena.add_geometry(m, node_name='membrana_externa', geom_name='membrana_externa'); cena.export(SAIDA, include_normals=True); sys.exit(0)
# ATP sintase em dímeros na borda livre (ponta) de cada crista, voltada para a matriz
cabecas, hastes, complexos = [], [], []
for c in CRISTAS:
    e = np.array([np.cos(c['th']), np.sin(c['th'])]); t = np.array([-e[1], e[0]])
    for v in np.arange(-1.3, 1.3, 0.045):
        u = 1.0 - c['prof'] - 0.02
        x = c['x'] + c['incl'] * u + 0.07 * np.sin(2.6 * v + c['fa']) + 0.045 * np.sin(3.4 * u + c['fb'])
        yz = u * e + v * t
        base = np.array([x, yz[0], yz[1]]); base[1] += eixo_y(x)
        dir_m = np.array([0, -e[0], -e[1]])          # da ponta para o centro da matriz
        for s in (-1, 1):
            d = dir_m + np.array([s * 0.65, 0, 0]); d /= np.linalg.norm(d)
            pos = base + dir_m * (T / 2 + 0.005)
            cab = pos + d * 0.045
            if not no_kept_matriz(cab[None], 0.02)[0]: continue
            # a base precisa estar sobre a membrana: perto da superfície da matriz
            _, _, sdm, _, _ = campos(*[np.array([w]) for w in pos])
            if abs(sdm[0]) > 0.06: continue
            h = trimesh.creation.cylinder(0.008, 0.05, sections=6)
            h.apply_transform(trimesh.geometry.align_vectors([0, 0, 1], d)); h.apply_translation(pos + d * 0.025)
            k = trimesh.creation.icosphere(SUB, 0.017); k.apply_translation(cab)
            hastes.append(h); cabecas.append(k)
# complexos da cadeia respiratória nas faces das cristas (lado da matriz)
pts = rng.uniform([-1.9, -1.1, -1.1], [1.9, 1.2, 1.1], (300000, 3))
_, _, sdM, cun, _ = campos(pts[:, 0], pts[:, 1], pts[:, 2])
perto = pts[(np.abs(sdM + T / 2 + 0.010) < 0.006) & (cun > 0.03)]
for p in perto[rng.permutation(len(perto))[:300]]:
    b = trimesh.creation.icosphere(SUB, 0.013); b.apply_scale([1.3, 1, 0.8]); b.apply_translation(p); complexos.append(b)
pecas['atp_sintase'] = (trimesh.util.concatenate(cabecas), [0.93, 0.78, 0.36])
pecas['atp_sintase_haste'] = (trimesh.util.concatenate(hastes), [0.85, 0.62, 0.20])
pecas['cadeia_respiratoria'] = (trimesh.util.concatenate(complexos), [0.30, 0.52, 0.55])

# DNA mitocondrial: nucleoides com alças circulares fechadas
dnas = []
centros = []
cand_c = rng.uniform([-1.4, -0.4, -0.5], [1.4, 0.4, 0.2], (4000, 3))
cand_c = cand_c[no_kept_matriz(cand_c, 0.12)]
for cc in cand_c:
    if all(abs(cc[0] - o[0]) > 0.8 for o in centros): centros.append(cc)
    if len(centros) == 3: break
for cx, cy, cz in centros:
    for k in range(2):
        n = 120; a = np.linspace(0, 2 * np.pi, n, endpoint=False)
        r = 0.09 + 0.03 * np.sin(5 * a + k + cx) + 0.03 * np.cos(3 * a + cy * 5)
        pts_ = np.stack([cx + 0.6 * r * np.cos(a) + 0.03 * k, cy + r * np.sin(a), cz + 0.06 * np.sin(4 * a + k)], 1)
        ok = no_kept_matriz(pts_, 0.0)
        if ok.mean() < 0.75: continue
        segs = []
        for i in range(n):
            p0, p1 = pts_[i], pts_[(i + 1) % n]
            cyl = trimesh.creation.cylinder(0.009, np.linalg.norm(p1 - p0) * 1.15, sections=4 if SUB == 0 else 6)
            cyl.apply_transform(trimesh.geometry.align_vectors([0, 0, 1], p1 - p0)); cyl.apply_translation((p0 + p1) / 2)
            segs.append(cyl)
        dnas.append(trimesh.util.concatenate(segs))
pecas['dna_mitocondrial'] = (trimesh.util.concatenate(dnas), [0.50, 0.32, 0.85])

# ribossomos mitocondriais (duas subunidades) e grânulos densos da matriz
ribos, grans = [], []
cand = rng.uniform([-1.9, -1.0, -1.0], [1.9, 1.1, 1.0], (40000, 3))
okp = cand[no_kept_matriz(cand, 0.06)]
for p in okp[:160]:
    a = trimesh.creation.icosphere(SUB, 0.020); a.apply_translation(p)
    b = trimesh.creation.icosphere(SUB, 0.015); b.apply_translation(p + rng.normal(size=3) * 0.0 + np.array([0, 0.022, 0]))
    ribos += [a, b]
for p in okp[160:172]:
    g = trimesh.creation.icosphere(2, 0.045); g.apply_translation(p); grans.append(g)
pecas['ribossomos'] = (trimesh.util.concatenate(ribos), [0.45, 0.25, 0.20])
pecas['granulos_da_matriz'] = (trimesh.util.concatenate(grans), [0.22, 0.18, 0.26])

# ---------------------------------------------------------------- cena e GLB
cena = trimesh.Scene()
def add(nome, m, cor=None, rough=0.6):
    m = m.copy()
    m.apply_scale(0.1)                       # 4 u -> 0,40 m (RA)
    if cor is not None:
        mat = trimesh.visual.material.PBRMaterial(name=nome, baseColorFactor=[*(np.array(cor) ** 2.2), 1], roughnessFactor=rough, metallicFactor=0)
        m.visual = trimesh.visual.TextureVisuals(material=mat)
    else:
        m.visual.material = trimesh.visual.material.PBRMaterial(name=nome, roughnessFactor=rough, metallicFactor=0)
    cena.add_geometry(m, node_name=nome, geom_name=nome)
add('membrana_externa', ext, rough=0.55)
add('membrana_interna_e_cristas', inn, rough=0.6)
for k, (m, cor) in pecas.items(): add(k, m, cor, 0.5)
cena.export(SAIDA, include_normals=True)
json.dump({k: int(len(v[0].faces)) for k, v in pecas.items()} | {'ext': len(ext.faces), 'inn': len(inn.faces)}, sys.stderr)
