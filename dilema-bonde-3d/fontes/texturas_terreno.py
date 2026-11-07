# Texturas tileáveis do terreno: grama, brita (lastro), terra (borda da maquete), dormente, trilho
import numpy as np
from PIL import Image
N = 512; rng = np.random.default_rng(21)
def ruido(sigma, aniso=1.0, n=N):
    w = rng.standard_normal((n, n)); fy = np.fft.fftfreq(n)[:, None]; fx = np.fft.fftfreq(n)[None, :]
    r = np.real(np.fft.ifft2(np.fft.fft2(w) * np.exp(-((fx * sigma) ** 2 + (fy * sigma * aniso) ** 2) * 2 * np.pi ** 2)))
    r -= r.mean(); return r / (r.std() + 1e-9)
def n01(a): return (a - a.min()) / (a.max() - a.min() + 1e-9)
def cor(nome, rgb): Image.fromarray((np.clip(rgb, 0, 1) * 255).astype(np.uint8)).save(f'../assets/tex/{nome}.jpg', quality=85)
def normal(nome, h, f):
    dx = (np.roll(h, -1, 1) - np.roll(h, 1, 1)) * 0.5 * f; dy = (np.roll(h, -1, 0) - np.roll(h, 1, 0)) * 0.5 * f
    l = np.sqrt(dx ** 2 + dy ** 2 + 1); n = np.stack([-dx / l, dy / l, 1 / l], -1)
    Image.fromarray(((n * 0.5 + 0.5) * 255).astype(np.uint8)).save(f'../assets/tex/{nome}_n.jpg', quality=90)
def pinta(k, base): return k[..., None] * np.array(base)

# grama: tufos finos + manchas mais secas e mais escuras
fino = ruido(0.9) * 0.6 + ruido(2.2) * 0.4; manchas = n01(ruido(40) + 0.5 * ruido(15)); seco = np.clip(n01(ruido(55)) - 0.6, 0, 1) * 2.5
k = 0.82 + 0.1 * fino + 0.12 * (manchas - 0.5)
rgb = pinta(k, (0.36, 0.55, 0.2)) * (1 - seco[..., None] * 0.5) + pinta(k, (0.58, 0.58, 0.3)) * (seco[..., None] * 0.5)
cor('grama', rgb); normal('grama', fino, 2.5)

# brita: pedrinhas (células) com tons de cinza variados
pts = rng.random((900, 2)) * N; tons = rng.uniform(0.45, 0.85, 900)
yy, xx = np.mgrid[0:N, 0:N].astype(np.float32)
d1 = np.full((N, N), 1e9, np.float32); d2 = np.full((N, N), 1e9, np.float32); idx = np.zeros((N, N), np.int32)
for i, (px, py) in enumerate(pts):
    dx = np.abs(xx - px); dx = np.minimum(dx, N - dx); dy = np.abs(yy - py); dy = np.minimum(dy, N - dy)
    d = dx * dx + dy * dy; m = d < d1
    d2 = np.where(m, d1, np.minimum(d2, d)); idx = np.where(m, i, idx); d1 = np.where(m, d, d1)
borda = np.sqrt(d2) - np.sqrt(d1); h = np.clip(borda / 6, 0, 1)
k = tons[idx] * (0.55 + 0.45 * h) + 0.05 * ruido(1.2)
cor('brita', pinta(k, (0.86, 0.84, 0.8))); normal('brita', h * 2 + 0.2 * ruido(1.0), 3.5)

# terra (laterais da maquete): camadas horizontais
y = np.linspace(0, 1, N, endpoint=False)[:, None]
cam = np.sin((y + 0.05 * ruido(30, aniso=0.1)) * 2 * np.pi * 6) * 0.5 + 0.5
k = 0.7 + 0.15 * cam + 0.08 * ruido(2)
cor('terra', pinta(k, (0.55, 0.38, 0.24))); normal('terra', cam + 0.4 * ruido(2), 2)
print('ok')
