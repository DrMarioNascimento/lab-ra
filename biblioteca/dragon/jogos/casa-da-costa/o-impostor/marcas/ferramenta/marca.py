"""Padrão Dragon Games — marcas em metal (placa e medalhão) como conjunto PBR.

Tudo nasce de um MAPA DE ALTURA e de MÁSCARAS DE MATERIAL. Do mapa de altura saem
normal e oclusão; das máscaras saem cor, rugosidade e metalicidade. A luz da cena
(ou da RA) é que desenha o relevo — por isso o resultado segue o nível de uma foto
de produto e não o de um desenho chapado.

Saída por peça (glTF, sem espelhar):
  <nome>_cor.png      baseColor (sRGB)
  <nome>_normal.png   normal em espaço tangente (OpenGL, +Y para cima)
  <nome>_orm.png      R = oclusão, G = rugosidade, B = metalicidade
"""
import math, numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
from scipy import ndimage

AQUI = __file__.rsplit('/', 1)[0] + '/'
F_SERIF = AQUI + 'Lora.ttf'
F_TITULO = AQUI + 'Cinzel.ttf'
LOGO = '/root/.claude/uploads/8e80fc57-e3e1-54e7-976b-897cc35ff557/b41585ba-image.png'

# ---------------- paleta de materiais (linear-ish, sRGB na textura) ----------------
ARCO_TEXTO = 204           # graus ocupados pelo texto, centrados em cima
ESCALA_FIG = 1.40          # largura da ilustração em relação ao diâmetro do campo
DESLOC_FIG = (0.0, -0.04)    # ajuste fino (fração do lado)
MAT = {
    #            cor sRGB          rug.  metal
    'aco':      ((168, 168, 170), 0.36, 1.0),
    'aco_pol':  ((196, 196, 198), 0.24, 1.0),
    'aco_esc':  ((104, 104, 108), 0.30, 1.0),
    'ouro':     ((236, 190, 96),  0.28, 1.0),
    'grafite':  ((52, 52, 56),    0.42, 0.9),
    'bronze':   ((150, 104, 58),  0.40, 1.0),
}

def fonte(caminho, tam, peso=None):
    f = ImageFont.truetype(caminho, tam)
    f._caminho = caminho
    if peso:
        try: f.set_variation_by_axes([peso] if 'Cinzel' in caminho or 'Lora' in caminho else [peso, 20])
        except Exception: pass
    return f

def suaviza(x): x = np.clip(x, 0, 1); return x * x * (3 - 2 * x)

def bisel(mask, largura):
    """altura 0..1 com bisel arredondado para dentro da máscara"""
    d = ndimage.distance_transform_edt(mask)
    return suaviza(d / largura) * mask

def texto_mascara(W, H, linhas, cx, fonte_fn):
    """linhas: [(texto, tamanho, peso, y_base)] centralizadas em cx"""
    m = Image.new('L', (W, H), 0); d = ImageDraw.Draw(m)
    for s, tam, peso, y in linhas:
        f = fonte_fn(tam, peso)
        d.text((cx, y), s, font=f, fill=255, anchor='ms')
    return np.array(m) > 127

def arco_mascara(S, texto, f, r, centro_graus, em_cima=True, esp=1.0):
    img = Image.new('L', (S, S), 0); C = S / 2
    # avanço com kerning: largura(par) - largura(próximo)
    larg = [(f.getlength(texto[i:i + 2]) - f.getlength(texto[i + 1])) if i + 1 < len(texto) else f.getlength(texto[i]) for i in range(len(texto))]
    tot = sum(larg) * esp
    a0 = math.radians(centro_graus) - (tot / r / 2 if em_cima else -tot / r / 2); acc = 0
    for ch, w in zip(texto, larg):
        mid = acc + w * esp / 2
        ang = a0 + mid / r if em_cima else a0 - mid / r
        x = C + r * math.cos(ang); y = C + r * math.sin(ang)
        t = Image.new('L', (int(f.size * 2.2), int(f.size * 2.2)), 0)
        fch = fonte(F_SERIF, int(f.size * 1.05), 700) if ch == '©' else f
        ImageDraw.Draw(t).text((t.size[0] / 2, t.size[1] / 2), ch, font=fch, fill=255, anchor='mm')
        t = t.rotate(-math.degrees(ang) - 90 if em_cima else -math.degrees(ang) + 90, resample=Image.BICUBIC)
        img.paste(255, (int(x - t.size[0] / 2), int(y - t.size[1] / 2)), t)
        acc += w * esp
    return np.array(img) > 127

def relevo_do_logo(S):
    """Retrato em baixo-relevo tipo moeda: busto (cabeça, ombros, canto do escudo).
    Em vez de copiar a luz da ilustração (que vira ruído), o relevo é montado por
    ZONAS lisas: volume geral arredondado, cabeça mais alta, frisos dourados da
    armadura como cristas, feições do rosto gravadas. Cada zona é limpa (sem
    pontinhos) e suavizada — é o que dá leitura de medalha."""
    im = Image.open(LOGO).convert('RGB').crop((380, 40, 1200, 760))
    a = np.array(im).astype(float); R, G, B = a[..., 0], a[..., 1], a[..., 2]
    lum = a.mean(-1); sat = a.max(-1) - a.min(-1)
    def limpa(m, abrir=2, menor=400):
        m = ndimage.binary_opening(m, iterations=abrir); m = ndimage.binary_closing(m, iterations=abrir)
        lab, n = ndimage.label(m)
        if n == 0: return m
        t = ndimage.sum(m, lab, range(1, n + 1)); return np.isin(lab, 1 + np.where(t >= menor)[0])
    fig = limpa(ndimage.binary_fill_holes(a.max(-1) > 16), 3, 5000)
    pele = limpa((R > G) & (G > B) & (R - B > 40) & (lum > 95) & (lum < 235) & fig, 3, 3000)
    pele = ndimage.binary_fill_holes(pele)
    cab = limpa(pele, 4, 20000)                                   # cabeça + pescoço
    feicoes = limpa((lum < 70) & ndimage.binary_erosion(ndimage.binary_fill_holes(cab), iterations=6), 1, 30)
    friso = limpa((R > 150) & (G > 100) & (B < 120) & (sat > 60) & fig & ~cab, 1, 150)   # dourados
    gema = limpa((R > 150) & (G < 90) & fig & ~cab, 1, 200)
    d = ndimage.distance_transform_edt(fig)
    h = np.sqrt(np.clip(d / 45, 0, 1)) * 0.45                     # volume do busto
    dc = ndimage.distance_transform_edt(ndimage.binary_fill_holes(cab))
    h += np.sqrt(np.clip(dc / 70, 0, 1)) * 0.35                   # cabeça em domo
    h += ndimage.gaussian_filter(friso.astype(float), 1.5) * 0.14
    dg = ndimage.distance_transform_edt(gema); h += np.sqrt(np.clip(dg / 14, 0, 1)) * 0.12
    h -= ndimage.gaussian_filter(feicoes.astype(float), 1.2) * 0.16  # olhos, sobrancelhas, sorriso
    h = ndimage.gaussian_filter(h, 1.4) * fig
    hi = Image.fromarray(np.uint8(np.clip(h, 0, 1) * 255)); mi = Image.fromarray(np.uint8(fig * 255))
    return hi, mi

# ---------------- mapas finais ----------------
def mapas(H, regioes, forca=6.0, ao_raio=10, ao_forca=2.2, escovado=True, seed=1):
    """H: altura 0..1 (float); regioes: [(mascara_bool, 'material')] na ordem de pintura"""
    h, w = H.shape
    rng = np.random.default_rng(seed)
    gy, gx = np.gradient(ndimage.gaussian_filter(H, 0.8))
    nx = -gx * forca; ny = gy * forca; nz = np.ones_like(H)
    L = np.sqrt(nx * nx + ny * ny + nz * nz)
    N = np.dstack([nx / L, ny / L, nz / L])
    normal = np.uint8(np.clip((N * 0.5 + 0.5) * 255, 0, 255))
    ao = 1 - np.clip((ndimage.gaussian_filter(H, ao_raio) - H) * ao_forca, 0, 0.75)
    cor = np.zeros((h, w, 3)); rug = np.zeros((h, w)); met = np.zeros((h, w))
    for m, nome in regioes:
        c, r, mt = MAT[nome]
        cor[m] = c; rug[m] = r; met[m] = mt
    if escovado:  # riscos horizontais finos: variam cor e rugosidade
        fino = ndimage.gaussian_filter1d(rng.normal(0, 1, (h, w)), 60, axis=1)
        fino = fino / (fino.std() + 1e-6)
        largo = ndimage.gaussian_filter1d(rng.normal(0, 1, h), 6)[:, None]
        largo = largo / (largo.std() + 1e-6)
        faixa = 0.85 * fino + 0.2 * largo
        cor *= (1 + 0.018 * faixa)[..., None]; rug = np.clip(rug + 0.025 * faixa, 0.05, 1)
    micro = ndimage.gaussian_filter(rng.normal(0, 1, (h, w)), 1.2)
    cor *= (1 + 0.02 * micro)[..., None]
    cor *= (0.55 + 0.45 * ao)[..., None]  # o escuro das frestas também na cor (visualizadores sem AO)
    orm = np.dstack([ao, rug, met])
    return (Image.fromarray(np.uint8(np.clip(cor, 0, 255))),
            Image.fromarray(normal),
            Image.fromarray(np.uint8(np.clip(orm * 255, 0, 255))))

def salvar(nome, trio, pasta):
    for suf, im in zip(('cor', 'normal', 'orm'), trio):
        im.save(f'{pasta}/{nome}_{suf}.png')

# ---------------- peças do padrão ----------------
OFICIAL = AQUI + 'oficial/'

def medalhao(S=1024):
    """Medalhão OFICIAL (arte aprovada em 26/09/2026): a imagem recortada vira a cor;
    o relevo vem da própria luz dela (suave) sobre um disco com bisel."""
    im = Image.open(OFICIAL + 'medalhao_metal.png').convert('RGBA').resize((S, S), Image.LANCZOS)
    a = np.array(im).astype(float); al = a[..., 3] / 255
    C = S / 2; yy, xx = np.mgrid[0:S, 0:S]; r = np.hypot(xx - C, yy - C) / (S / 2)
    disco = (r <= 0.93) & (al > 0.5)
    lum = ndimage.gaussian_filter(a[..., :3].mean(-1) / 255, 1.6)
    H = bisel(disco, S * 0.02) * 0.45 + lum * 0.22 * (al > 0.5)
    H = np.clip(H, 0, 1)
    gy, gx = np.gradient(ndimage.gaussian_filter(H, 0.8)); f = 7.0
    nx, ny, nz = -gx * f, gy * f, np.ones_like(H); L = np.sqrt(nx * nx + ny * ny + nz * nz)
    nor = Image.fromarray(np.uint8(np.clip((np.dstack([nx / L, ny / L, nz / L]) * 0.5 + 0.5) * 255, 0, 255)))
    ao = 1 - np.clip((ndimage.gaussian_filter(H, 6) - H) * 2.0, 0, 0.6)
    quente = np.clip((a[..., 0] - a[..., 2] - 60) / 80, 0, 1) * (lum > 0.55)   # fogo e pele: menos metal
    rug = 0.42 - 0.12 * lum; met = 0.85 - 0.6 * quente
    orm = Image.fromarray(np.uint8(np.clip(np.dstack([ao, rug, met]) * 255, 0, 255)))
    return (im, nor, orm), H


def medalhao_gerado(S=1024, texto_cima='ARQUIVO DO DRAGON GAMES ©', texto_baixo='PRIMAVERA DE 2026'):
    C = S / 2; yy, xx = np.mgrid[0:S, 0:S]; r = np.hypot(xx - C, yy - C) / (S / 2)
    disco = r <= 0.985
    aro_ext = (r > 0.90) & disco
    faixa = (r > 0.68) & (r <= 0.90)
    aro_int = (r > 0.64) & (r <= 0.68)
    centro = r <= 0.64
    # um texto só, em arco: começa à esquerda, passa por cima e termina à direita.
    # Embaixo fica livre para a figura sair do círculo.
    texto = texto_cima + '  ·  ' + texto_baixo if texto_baixo else texto_cima
    SPAN = math.radians(ARCO_TEXTO)
    tam = int(S * 0.066)
    while tam > 10:
        f1 = fonte(F_TITULO, tam, 800)
        adv = sum((f1.getlength(texto[i:i + 2]) - f1.getlength(texto[i + 1])) if i + 1 < len(texto) else f1.getlength(texto[i]) for i in range(len(texto)))
        if adv / (S * 0.395) <= SPAN: break
        tam -= 1
    letras = arco_mascara(S, texto, f1, S * 0.395, -90, True, 1.0) & faixa
    # centro: a ilustração como esmalte. A figura inteira (recortada do fundo preto)
    # SAI do círculo: escudo, mão e espada passam por cima do aro e da faixa.
    R = S / 2 * 0.64
    src = Image.open(LOGO).convert('RGB').crop((140, 40, 1220, 1110))
    sa = np.array(src).astype(float)
    fm = ndimage.binary_fill_holes(ndimage.binary_opening(sa.max(-1) > 16, iterations=2))
    lab, n = ndimage.label(fm); tam = ndimage.sum(fm, lab, range(1, n + 1))
    fm = np.isin(lab, 1 + np.where(tam > 3000)[0])
    fm[990:, 290:] = False                                # a palavra DRAGON da ilustração não entra (a ponta da espada sim)
    alfa_src = ndimage.gaussian_filter(fm.astype(float), 1.2)
    esc = (2 * R * ESCALA_FIG) / sa.shape[1]
    tw, th = int(sa.shape[1] * esc), int(sa.shape[0] * esc)
    im = src.resize((tw, th), Image.LANCZOS)
    al = Image.fromarray(np.uint8(alfa_src * 255)).resize((tw, th), Image.LANCZOS)
    ox, oy = int(C - tw / 2 + S * DESLOC_FIG[0]), int(C - R * 0.93 + S * DESLOC_FIG[1])
    esm = np.zeros((S, S, 3)); fa = np.zeros((S, S))
    arr = np.array(im).astype(float); aa = np.array(al).astype(float) / 255
    y0, x0 = max(oy, 0), max(ox, 0); y1, x1 = min(oy + th, S), min(ox + tw, S)
    esm[y0:y1, x0:x1] = arr[y0 - oy:y1 - oy, x0 - ox:x1 - ox]
    fa[y0:y1, x0:x1] = aa[y0 - oy:y1 - oy, x0 - ox:x1 - ox]
    # o corte reto de baixo da ilustração nunca aparece: some suave antes da borda
    base_corte = oy + th
    fa *= np.clip((base_corte - 6 - yy) / (S * 0.04), 0, 1)
    fora = (r > 0.64) & disco
    ang = np.degrees(np.arctan2(yy - C, xx - C))           # -90 = em cima
    meia = ARCO_TEXTO / 2 + 4
    fora &= ~(np.abs(((ang + 90 + 180) % 360) - 180) < meia)  # o arco de texto fica sempre livre
    fa *= np.clip((0.975 - r) / 0.03, 0, 1)                 # nada é decepado na borda: some antes
    fig_m = centro | (fora & (fa > 0.5))
    k_fig = np.where(centro, 1.0, fa * fora)             # peso da ilustração
    lumz = ndimage.gaussian_filter(esm.mean(-1) / 255, 2.5)
    esm_h = lumz * (fa > 0.5)
    # o aro interno se interrompe onde a figura passa e reaparece depois dela (com uma folga)
    passa = ndimage.binary_dilation(fora & (fa > 0.5), iterations=max(3, S // 170))
    aro_int = aro_int & ~passa
    H = np.zeros((S, S))
    H += bisel(disco, S * 0.02) * 0.30                     # corpo da moeda
    H += bisel(aro_ext, S * 0.012) * 0.25                  # aro externo alto
    H += bisel(aro_int, S * 0.006) * 0.18
    H -= faixa * 0.06                                      # faixa rebaixada
    H += bisel(letras, S * 0.004) * 0.22                   # letras em relevo
    H -= centro * 0.08                                     # campo central rebaixado
    H += esm_h * 0.12                                      # esmalte com leve relevo
    salta = ndimage.gaussian_filter((((fora | centro) & (fa > 0.5))).astype(float), 2.0)  # a figura inteira é uma peça só, acima do aro
    H = np.maximum(H, salta * (0.62 + esm_h * 0.12))          # o que sai do círculo fica acima do aro
    H = np.clip(H, 0, 1)
    regioes = [(disco, 'grafite'), (aro_ext | aro_int, 'ouro'), (letras, 'ouro')]
    cor, nor, orm = mapas(H, regioes, forca=9.0, ao_raio=6, escovado=False)
    # pinta o esmalte por cima (cor da ilustração, não metálico, levemente brilhante)
    c = np.array(cor).astype(float); o = np.array(orm).astype(float)
    k = k_fig[..., None]
    fundo_c = np.array(MAT['grafite'][0], float)
    c = c * (1 - k) + np.maximum(esm, fundo_c * 0.6) * k
    o[..., 1] = o[..., 1] * (1 - k[..., 0]) + 0.34 * 255 * k[..., 0]
    o[..., 2] = o[..., 2] * (1 - k[..., 0]) + 0.15 * 255 * k[..., 0]
    cor = Image.fromarray(np.uint8(np.clip(c, 0, 255))); orm = Image.fromarray(np.uint8(np.clip(o, 0, 255)))
    alfa = Image.fromarray(np.uint8(ndimage.gaussian_filter(disco.astype(float), 0.8) * 255))
    cor = cor.convert('RGBA'); cor.putalpha(alfa)
    return (cor, nor, orm), H

def placa(W, H_, linhas, com_medalhao=True, material='aco', fonte_txt=F_SERIF, raio=0.06):
    """linhas: [(texto, tamanho_px, peso)] — placa de aço escovado com letras em relevo"""
    yy, xx = np.mgrid[0:H_, 0:W]
    img = Image.new('L', (W, H_), 0)
    ImageDraw.Draw(img).rounded_rectangle((6, 6, W - 7, H_ - 7), radius=int(min(W, H_) * raio), fill=255)
    corpo = np.array(img) > 127
    Ht = bisel(corpo, min(W, H_) * 0.035) * 0.45
    x0 = 0
    med_m = np.zeros((H_, W), bool); med_H = np.zeros((H_, W)); med_regs = []
    if com_medalhao:
        dm = int(H_ * 0.78); (mc, mn, mo), mh = medalhao(dm)
        ox, oy = int(H_ * 0.11), (H_ - dm) // 2
        a = np.array(mc)[..., 3] > 127
        med_m[oy:oy + dm, ox:ox + dm] = a
        med_H[oy:oy + dm, ox:ox + dm] = mh
        x0 = ox + dm
    area = (x0 + W) / 2 if com_medalhao else W / 2
    # ajuste automático: a linha mais larga cabe entre o medalhão e a borda, com folga
    livre = (W - x0) - H_ * 0.16 if com_medalhao else W - H_ * 0.2
    maior = max(fonte(fonte_txt, t, p).getlength(s_) for s_, t, p in linhas)
    if maior > livre:
        k = livre / maior; linhas = [(s_, int(t * k), p) for s_, t, p in linhas]
    area -= H_ * 0.02
    tot = sum(int(t * 1.32) for _, t, _ in linhas); y = (H_ - tot) / 2
    lin = []
    for s, t, p in linhas:
        y += t * 1.05; lin.append((s, t, p, y)); y += t * 0.27
    txt = texto_mascara(W, H_, lin, area, lambda t, p: fonte(fonte_txt, t, p))
    Ht += bisel(txt, 6) * 0.40
    Ht = np.where(med_m, 0.45 + med_H * 0.55, Ht)
    regioes = [(corpo, material), (txt, 'aco_esc' if material == 'aco' else material)]
    cor, nor, orm = mapas(Ht, regioes, forca=9.0, ao_raio=7, ao_forca=3.0, escovado=True)
    if com_medalhao:  # cores do medalhão por cima
        ox, oy = int(H_ * 0.11), (H_ - dm) // 2
        for dst, src in ((cor, mc.convert('RGB')), (orm, mo)):
            dst.paste(src, (ox, oy), Image.fromarray(np.uint8(np.array(mc)[..., 3])))
    alfa = Image.fromarray(np.uint8(ndimage.gaussian_filter(corpo.astype(float), 0.8) * 255))
    cor = cor.convert('RGBA'); cor.putalpha(alfa)
    return cor, nor, orm
