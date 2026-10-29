/* As texturas da tela do Osso vivo e da Junção neuromuscular, para os ciclos
   portáteis. Até 2026-10-25 a esteira entregava a esses dois modelos uma cor
   lisa de 64 px no lugar da textura, e a RA saía sem desenho de superfície.

   Os desenhos são cópia fiel de textura() em osso-vivo/app.js e
   juncao-neuromuscular/app.js (os app.js têm hash conferido e não exportam a
   função). Só a resolução cai de 512 para 256 px: na RA o ladrilho é pequeno e
   o arquivo agradece. Se a bancada mudar o desenho, mude aqui também. */
import * as T from 'three';

function tela(lado, desenhar) {
  const c = document.createElement('canvas'); c.width = c.height = lado; desenhar(c.getContext('2d'), lado, lado);
  const t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; t.wrapS = t.wrapT = T.RepeatWrapping;
  t.userData.mimeType = 'image/jpeg';
  return t;
}

/* O desenho foi feito em 512 px; em 256 as coordenadas dobram para manter as
   mesmas frequências por ladrilho. */
const ESC = 2;

export function texturaOsso(tipo) {
  return tela(256, (ctx, w, h) => {
    const image = ctx.createImageData(w, h); let seed = 72917;
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; const n = (seed / 4294967296 - .5) * 24;
      const X = x * ESC, Y = y * ESC;
      const bands = tipo === 'lamela' ? 14 * Math.sin(Y * .13 + 3 * Math.sin(X * .016)) + 5 * Math.cos(Y * .27)
        : tipo === 'colageno' ? 28 * Math.cos(X * .22) + 5 * Math.sin(Y * .09)
        : tipo === 'celula' ? 13 * Math.sin(X * .06) * Math.sin(Y * .11) + 8 * Math.cos(X * .14 + Y * .1)
        : 24 * Math.sin(X * .027 + Y * .018) * Math.cos(Y * .043) + 7 * Math.sin(X * .19 - Y * .12);
      const c = Math.max(0, Math.min(255, 211 + n * .5 + bands * .55)), i = (y * w + x) * 4;
      image.data[i] = image.data[i + 1] = image.data[i + 2] = c; image.data[i + 3] = 255;
    }
    ctx.putImageData(image, 0, 0);
    if (tipo === 'osso') for (let k = 0; k < 900; k++) {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; const x = seed % w;
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; const y = seed % h, r = (1 + (seed % 30) / 12) / ESC;
      ctx.fillStyle = 'rgba(79,66,53,.13)'; ctx.beginPath(); ctx.ellipse(x, y, r, r * .55, k, 0, Math.PI * 2); ctx.fill();
    }
  });
}

export function texturaJuncao(tipo) {
  return tela(256, (ctx, w, h) => {
    const image = ctx.createImageData(w, h); let seed = 72917;
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; const n = (seed / 4294967296 - .5) * 24;
      const X = x * ESC, Y = y * ESC;
      const bands = tipo === 'estrias' ? 23 * Math.sin(Y * .27) + 9 * Math.cos(Y * .54) + 12 * Math.cos(X * .12)
        : 24 * Math.sin(X * .027 + Y * .018) * Math.cos(Y * .043) + 7 * Math.sin(X * .19 - Y * .12);
      const c = Math.max(0, Math.min(255, 199 + n + bands)), i = (y * w + x) * 4;
      image.data[i] = image.data[i + 1] = image.data[i + 2] = c; image.data[i + 3] = 255;
    }
    ctx.putImageData(image, 0, 0);
  });
}

/* Relevo (bumpMap) → mapa normal. O glTF só leva bumpMap pela extensão
   EXT_materials_bump, que o conversor de USDZ ignora: no iPhone a superfície
   chegava lisa. O normal atravessa os dois caminhos. A força segue o
   bumpScale da bancada, numa escala calibrada a olho nas fotos. */
const cacheNormal = new Map();
export function normalDeRelevo(relevo, escala) {
  const chave = relevo.uuid + ':' + escala;
  if (cacheNormal.has(chave)) return cacheNormal.get(chave);
  const img = relevo.image, w = Math.min(512, img.width), h = Math.min(512, img.height);
  const fonte = document.createElement('canvas'); fonte.width = w; fonte.height = h;
  const fx = fonte.getContext('2d'); fx.drawImage(img, 0, 0, w, h);
  const px = fx.getImageData(0, 0, w, h).data, H = new Float32Array(w * h);
  for (let k = 0; k < w * h; k++) H[k] = (px[k * 4] * .299 + px[k * 4 + 1] * .587 + px[k * 4 + 2] * .114) / 255;
  const forca = Math.min(6, Math.max(.8, escala * 90)) * (w / 256);
  const at = (x, y) => H[((y + h) % h) * w + ((x + w) % w)];
  const saida = document.createElement('canvas'); saida.width = w; saida.height = h;
  const sx = saida.getContext('2d'), out = sx.createImageData(w, h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const dx = (at(x + 1, y) - at(x - 1, y)) * forca, dy = (at(x, y + 1) - at(x, y - 1)) * forca;
    const l = Math.hypot(dx, dy, 1), p = (y * w + x) * 4;
    out.data[p] = Math.round(128 - dx / l * 127); out.data[p + 1] = Math.round(128 + dy / l * 127);
    out.data[p + 2] = Math.round(128 + 127 / l); out.data[p + 3] = 255;
  }
  sx.putImageData(out, 0, 0);
  const t = new T.CanvasTexture(saida); t.colorSpace = T.NoColorSpace;
  t.wrapS = relevo.wrapS; t.wrapT = relevo.wrapT; t.repeat.copy(relevo.repeat); t.offset.copy(relevo.offset);
  t.channel = relevo.channel; t.flipY = relevo.flipY; t.userData.mimeType = 'image/jpeg';
  cacheNormal.set(chave, t);
  return t;
}
