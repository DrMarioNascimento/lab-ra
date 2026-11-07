// Pinta um "?" branco na textura da roupa (estampa), por projeção frontal sobre o peito.
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder, MeshoptEncoder } from 'meshoptimizer';
import * as THREE from 'three';
import sharp from 'sharp';
await Promise.all([MeshoptDecoder.ready, MeshoptEncoder.ready]);
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder, 'meshopt.encoder': MeshoptEncoder });
const [ent, sai] = process.argv.slice(2);
const doc = await io.read(ent); const root = doc.getRoot();
const node = root.listNodes().find(n => n.getMesh()); const M = new THREE.Matrix4().fromArray(node.getWorldMatrix());
const prim = node.getMesh().listPrimitives()[0];
const P = prim.getAttribute('POSITION'), UV = prim.getAttribute('TEXCOORD_0'), I = prim.getIndices().getArray();
const n = P.getCount(), pos = new Float32Array(n * 3), uv = new Float32Array(n * 2), el = [], v = new THREE.Vector3();
for (let i = 0; i < n; i++) { P.getElement(i, el); v.set(...el).applyMatrix4(M); pos.set([v.x, v.y, v.z], i * 3); const e2 = []; UV.getElement(i, e2); uv.set(e2, i * 2); }
let ymin = 1e9, ymax = -1e9, xmin = 1e9, xmax = -1e9; for (let i = 0; i < n; i++) { ymin = Math.min(ymin, pos[i * 3 + 1]); ymax = Math.max(ymax, pos[i * 3 + 1]); xmin = Math.min(xmin, pos[i * 3]); xmax = Math.max(xmax, pos[i * 3]); }
const H = ymax - ymin, cx = (xmin + xmax) / 2, cy = ymin + H * 0.705, S = H * 0.075;   // meia-largura da estampa
// frente do peito: maior z perto do centro
let zF = -1e9; for (let i = 0; i < n; i++) if (Math.abs(pos[i * 3] - cx) < S * 0.5 && Math.abs(pos[i * 3 + 1] - cy) < S * 0.5) zF = Math.max(zF, pos[i * 3 + 2]);
// máscara do "?" (SVG → alfa)
const R = 512;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${R}" height="${R}"><text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle" font-family="DejaVu Sans" font-weight="bold" font-size="${R * 0.92}" fill="#fff">?</text></svg>`;
const mask = (await sharp(Buffer.from(svg)).ensureAlpha().raw().toBuffer({ resolveWithObject: true }));
const ma = (x, y) => { const xi = Math.min(R - 1, Math.max(0, Math.floor(x * R))), yi = Math.min(R - 1, Math.max(0, Math.floor(y * R))); return mask.data[(yi * R + xi) * 4 + 3] / 255; };
// textura da roupa
const mat = prim.getMaterial(), tex = mat.getBaseColorTexture();
const img = await sharp(Buffer.from(tex.getImage())).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const W = img.info.width, Ht = img.info.height, px = img.data;
let pintados = 0;
for (let t = 0; t < I.length; t += 3) {
  const a = I[t], b = I[t + 1], c = I[t + 2];
  const A = [pos[a * 3], pos[a * 3 + 1], pos[a * 3 + 2]], B = [pos[b * 3], pos[b * 3 + 1], pos[b * 3 + 2]], C = [pos[c * 3], pos[c * 3 + 1], pos[c * 3 + 2]];
  // só a camisa visível de frente, dentro da área da estampa
  const nz = (B[0] - A[0]) * (C[1] - A[1]) - (B[1] - A[1]) * (C[0] - A[0]);
  if (nz <= 0) continue;
  if ([A, B, C].every(p => Math.abs(p[0] - cx) > S * 1.1 || Math.abs(p[1] - cy) > S * 1.1)) continue;
  if (Math.min(A[2], B[2], C[2]) < zF - 0.09) continue;
  const ua = [uv[a * 2] * W, uv[a * 2 + 1] * Ht], ub = [uv[b * 2] * W, uv[b * 2 + 1] * Ht], uc = [uv[c * 2] * W, uv[c * 2 + 1] * Ht];
  const x0 = Math.floor(Math.min(ua[0], ub[0], uc[0])), x1 = Math.ceil(Math.max(ua[0], ub[0], uc[0])), y0 = Math.floor(Math.min(ua[1], ub[1], uc[1])), y1 = Math.ceil(Math.max(ua[1], ub[1], uc[1]));
  const den = (ub[1] - uc[1]) * (ua[0] - uc[0]) + (uc[0] - ub[0]) * (ua[1] - uc[1]); if (Math.abs(den) < 1e-9) continue;
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
    const qx = x + 0.5, qy = y + 0.5;
    const w1 = ((ub[1] - uc[1]) * (qx - uc[0]) + (uc[0] - ub[0]) * (qy - uc[1])) / den, w2 = ((uc[1] - ua[1]) * (qx - uc[0]) + (ua[0] - uc[0]) * (qy - uc[1])) / den, w3 = 1 - w1 - w2;
    if (w1 < -0.02 || w2 < -0.02 || w3 < -0.02) continue;
    const X = w1 * A[0] + w2 * B[0] + w3 * C[0], Y = w1 * A[1] + w2 * B[1] + w3 * C[1];
    const al = ma((X - cx) / (2 * S) + 0.5, 0.5 - (Y - cy) / (2 * S)); if (al <= 0) continue;
    if (x < 0 || y < 0 || x >= W || y >= Ht) continue;
    const k = (y * W + x) * 4, base = [px[k], px[k + 1], px[k + 2]];
    // tinta branca levemente gasta, mantendo um pouco da sombra do tecido
    const sombra = (base[0] + base[1] + base[2]) / 3 / 255, tinta = 235 * (0.82 + 0.18 * Math.min(1, sombra * 2.2));
    for (let ch = 0; ch < 3; ch++) px[k + ch] = Math.round(base[ch] * (1 - al) + tinta * al);
    pintados++;
  }
}
const nova = await sharp(px, { raw: { width: W, height: Ht, channels: 4 } }).removeAlpha().jpeg({ quality: 90 }).toBuffer();
tex.setImage(nova).setMimeType('image/jpeg');
await io.write(sai, doc); console.log('texels pintados', pintados, 'textura', W + 'x' + Ht, 'peito z', zF.toFixed(3));
