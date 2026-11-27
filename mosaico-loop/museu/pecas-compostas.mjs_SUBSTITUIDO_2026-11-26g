// Peças compostas dos veículos (cópias próprias): cada versão da sala dos veículos leva a bicicleta de roda alta ao lado, em escala real relativa.
// Uso (pasta do gltf-transform): node pecas-compostas.mjs <pasta pecas> [saídas separadas por vírgula; sem isso, faz todas]
// Revisão 14 (26/11/2026): GAL_B ganha também a rachadura fina do lado direito da máscara (o lado direito de quem olha a peça de frente), que o Lado a Lado e a comparação da foto citam: mesma técnica da inscrição (película da superfície, 1 mm acima, cor + relevo), só nos triângulos perto do traço, para o arquivo seguir abaixo de 800 KB.
// Revisão 11 (26/11/2026): GAL_B ganha a inscrição da cópia gravada na testa da máscara (6 símbolos de icones/ui/glifos.svg, o 5º virado): uma película da própria superfície da testa, 1 mm acima dela, com textura de entalhe (cor + relevo). Precisa de sharp na pasta do gltf-transform.
// Revisão 8 (25/11/2026): GAL_B = base de madeira com a redoma ao lado (GAL_B_base, modelo do autor, já em metros por escala-real.mjs) + a máscara de pedra (V11) em cima da base.
// Revisão 4 (25/11/2026): composições das salas do Loop. GAL_A = máscara de pedra (V11) em cima de uma base; REL_A = relógio de caixa alta (R02) + relógio de parede (R01); DESC_A = sofá (V41) + quadro de recados (C02).
import { Document, NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS, KHRDracoMeshCompression } from '@gltf-transform/extensions';
import { getBounds, mergeDocuments, prune } from '@gltf-transform/functions';
import draco3d from 'draco3dgltf'; import sharp from 'sharp'; import fs from 'fs'; import { MeshoptDecoder } from 'meshoptimizer'; import path from 'path';
const PEC = process.argv[2] || '.';
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'draco3d.decoder': await draco3d.createDecoderModule(), 'draco3d.encoder': await draco3d.createEncoderModule(), 'meshopt.decoder': MeshoptDecoder });
await MeshoptDecoder.ready;
const REAL = { N14: 4.6, V05: 3.0, V27: 2.2, V04: 1.5 };   // maior dimensão real, em metros
const COMBOS = { VEI_A: 'N14', VEI_B: 'V05', VEI_C: 'V27' };
const SO = (process.argv[3] || '').split(',').filter(Boolean);
for (const [saida, principal] of Object.entries(COMBOS)) {
 if (SO.length && !SO.includes(saida)) continue;
 const doc = new Document(); const buf = doc.createBuffer(); const cena = doc.createScene(saida); const raiz = doc.createNode(saida); cena.addChild(raiz);
 const itens = [];
 for (const id of [principal, 'V04']) {
  const pd = await io.read(path.join(PEC, id + '.glb')); const b = getBounds(pd.getRoot().listScenes()[0]);
  const e = REAL[id] / Math.max(b.max[0]-b.min[0], b.max[1]-b.min[1], b.max[2]-b.min[2]);
  const mapa = mergeDocuments(doc, pd); const nova = mapa.get(pd.getRoot().listScenes()[0]);
  const no = doc.createNode(id).setScale([e, e, e]); for (const f of nova.listChildren()) { nova.removeChild(f); no.addChild(f); } nova.dispose(); raiz.addChild(no);
  itens.push({ no, b, e });
 }
 const w = it => (it.b.max[0]-it.b.min[0]) * it.e, cx = it => (it.b.min[0]+it.b.max[0])/2 * it.e, cz = it => (it.b.min[2]+it.b.max[2])/2 * it.e;
 const [p, v] = itens, gap = .5, total = w(p) + gap + w(v), x0 = -total / 2;
 p.no.setTranslation([x0 + w(p)/2 - cx(p), -p.b.min[1]*p.e, -cz(p)]);
 v.no.setTranslation([x0 + w(p) + gap + w(v)/2 - cx(v), -v.b.min[1]*v.e, -cz(v)]);
 for (const sc of doc.getRoot().listScenes()) if (sc !== cena) sc.dispose();
 doc.createExtension(KHRDracoMeshCompression).setRequired(true).setEncoderOptions({ method: KHRDracoMeshCompression.EncoderMethod.EDGEBREAKER });
 await doc.transform(prune());
 const bufs = doc.getRoot().listBuffers(); for (const bb of bufs.slice(1)) { for (const a of doc.getRoot().listAccessors()) if (a.getBuffer() === bb) a.setBuffer(bufs[0]); bb.dispose(); }
 for (const ext of doc.getRoot().listExtensionsUsed()) if (ext.extensionName === 'EXT_meshopt_compression') ext.dispose();
 await io.write(path.join(PEC, saida + '.glb'), doc); console.log('ok', saida);
}

// ---- salas do Loop: duas peças lado a lado, ou uma peça em cima de uma base feita aqui (caixa de madeira escura)
const REAL2 = { V11: 0.45, R02: 2.0, R01: 1.1, V41: 2.0, C02: 1.5 };
const LOOP = { GAL_B: { sobre: 'V11', maior: 0.6, cena: 'GAL_B_base', topo: { x: [-0.6, 0.25], z: [-0.35, 0.45], yMax: 1.12 }, testa: ['rosto','pedra','ver','noite','guardar-esp','tempo'], racha: true }, GAL_A: { sobre: 'V11', base: [0.5, 0.95, 0.5] }, REL_A: { lado: ['R02', 'R01'], gap: .35 }, DESC_A: { lado: ['V41', 'C02'], gap: .3 } };
function caixa(doc, buf, [lx, ly, lz]) {   // caixa com base no chão (y de 0 a ly), 24 vértices com normal por face
 const x = lx / 2, z = lz / 2, P = [], N = [], I = [];
 const faces = [[[0,0,1],[[-x,0,z],[x,0,z],[x,ly,z],[-x,ly,z]]],[[0,0,-1],[[x,0,-z],[-x,0,-z],[-x,ly,-z],[x,ly,-z]]],[[1,0,0],[[x,0,z],[x,0,-z],[x,ly,-z],[x,ly,z]]],[[-1,0,0],[[-x,0,-z],[-x,0,z],[-x,ly,z],[-x,ly,-z]]],[[0,1,0],[[-x,ly,z],[x,ly,z],[x,ly,-z],[-x,ly,-z]]],[[0,-1,0],[[-x,0,-z],[x,0,-z],[x,0,z],[-x,0,z]]]];
 faces.forEach(([n, vs], f) => { vs.forEach(v => { P.push(...v); N.push(...n); }); I.push(4*f, 4*f+1, 4*f+2, 4*f, 4*f+2, 4*f+3); });
 const mat = doc.createMaterial('base').setBaseColorFactor([0.13, 0.09, 0.07, 1]).setRoughnessFactor(0.55).setMetallicFactor(0.05);
 const prim = doc.createPrimitive().setAttribute('POSITION', doc.createAccessor().setType('VEC3').setArray(new Float32Array(P)).setBuffer(buf)).setAttribute('NORMAL', doc.createAccessor().setType('VEC3').setArray(new Float32Array(N)).setBuffer(buf)).setIndices(doc.createAccessor().setType('SCALAR').setArray(new Uint16Array(I)).setBuffer(buf)).setMaterial(mat);
 return doc.createNode('base').setMesh(doc.createMesh('base').addPrimitive(prim));
}

// ---- inscrição na testa (revisão 11). Coordenadas da V11 (sem escala): rosto para +z, testa entre y 0,52 e 0,85.
// Projeção inclinada 28° para cima (a testa olha para cima e para a frente): u = x, v = y·cos − z·sin. A faixa ocupa u de −X a X e v em volta de V0.
const TESTA = { incl: 28, X: 0.5, yC: 0.62, sobe: 0.004 };
async function texturasTesta(ordem) {
 const SVG = fs.readFileSync(path.join(PEC, '..', 'icones', 'ui', 'glifos.svg'), 'utf8');
 const PITCH = 50, PAD = 1, VW = ordem.length * PITCH, VH = PITCH, ESC = 4, W = VW * ESC, H = VH * ESC;
 const sym = id => SVG.match(new RegExp('<symbol id="g-' + id + '"[^>]*>([\\s\\S]*?)</symbol>'))[1].replace(/<title>.*?<\/title>/, '');
 const corpo = fn => ordem.map((id, i) => `<g transform="translate(${i * PITCH + PAD} ${PAD})">${fn(id)}</g>`).join('');
 const traco = id => { const m = sym(id).match(/<g transform="translate\(0 0\)">\s*<path( transform="[^"]+")? d="([^"]+)"/); return `<path${m[1] || ''} d="${m[2]}" stroke="#fff" stroke-width="4.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`; };
 const cor = await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${VW} ${VH}" color="#b89a62">${corpo(sym)}</svg>`)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
 // pedra, não adesivo: a parede escura deixa o grão da pedra aparecer, o latão é gasto e manchado
 let s = 7; const rnd = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
 const ruido = new Float32Array((W >> 3) * (H >> 3) + W).map(rnd);
 const C = cor.data; for (let i = 0, p = 0; i < C.length; i += 4, p++) { const x = p % W, y = (p / W) | 0, L = (C[i] + C[i+1] + C[i+2]) / 3, n = ruido[(y >> 3) * (W >> 3) + (x >> 3)], g = 0.82 + 0.3 * rnd();
  if (L < 50) C[i+3] = Math.round(C[i+3] * 0.74); else if (L > 120) { C[i+3] = Math.round(C[i+3] * (0.72 + 0.2 * n)); for (let k = 0; k < 3; k++) C[i+k] = Math.min(255, Math.round(C[i+k] * g)); } }
 const alt = await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${VW} ${VH}"><rect width="100%" height="100%" fill="#000"/>${corpo(traco)}</svg>`)).greyscale().blur(3.2).raw().toBuffer({ resolveWithObject: true });
 const A = alt.data, nrm = Buffer.alloc(W * H * 3), k = 5 / 255, h = (x, y) => -A[Math.min(H - 1, Math.max(0, y)) * W + Math.min(W - 1, Math.max(0, x))];
 for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { let nx = -(h(x + 1, y) - h(x - 1, y)) * k / 2, ny = (h(x, y + 1) - h(x, y - 1)) * k / 2, nz = 1; const l = Math.hypot(nx, ny, nz), o = (y * W + x) * 3;
  nrm[o] = Math.round((nx / l * .5 + .5) * 255); nrm[o+1] = Math.round((ny / l * .5 + .5) * 255); nrm[o+2] = Math.round((nz / l * .5 + .5) * 255); }
 return { aspecto: W / H, cor: await sharp(C, { raw: { width: W, height: H, channels: 4 } }).webp({ quality: 78, alphaQuality: 80 }).toBuffer(), normal: await sharp(nrm, { raw: { width: W, height: H, channels: 3 } }).webp({ quality: 80 }).toBuffer() };
}
async function gravarTesta(doc, buf, noPeca, ordem) {
 let prim = null; noPeca.traverse(n => { const m = n.getMesh(); if (m && !prim) prim = m.listPrimitives()[0]; });
 const P = prim.getAttribute('POSITION').getArray(), N = prim.getAttribute('NORMAL').getArray(), I = prim.getIndices().getArray();
 const a = TESTA.incl * Math.PI / 180, ca = Math.cos(a), sa = Math.sin(a), v = i => P[i*3+1] * ca - P[i*3+2] * sa;
 // centro vertical da faixa: o v do ponto da testa em x = 0, y = yC (o mais à frente)
 let zc = -9; for (let i = 0; i < P.length / 3; i++) if (Math.abs(P[i*3]) < 0.04 && Math.abs(P[i*3+1] - TESTA.yC) < 0.03 && N[i*3+2] > 0.2) zc = Math.max(zc, P[i*3+2]);
 const V0 = TESTA.yC * ca - zc * sa, X = TESTA.X, HV = (2 * X) / TESTA.tex.aspecto, v1 = V0 + HV / 2;
 const dentro = i => P[i*3] > -X - 0.03 && P[i*3] < X + 0.03 && Math.abs(v(i) - V0) < HV / 2 + 0.03 && (N[i*3+1] * sa + N[i*3+2] * ca) > 0.15;
 const mapa = new Map(), PP = [], NN = [], UV = [], II = [];
 const idx = i => { if (!mapa.has(i)) { mapa.set(i, PP.length / 3); for (let k = 0; k < 3; k++) { PP.push(P[i*3+k] + N[i*3+k] * TESTA.sobe); NN.push(N[i*3+k]); } UV.push((P[i*3] + X) / (2 * X), (v1 - v(i)) / HV); } return mapa.get(i); };
 for (let t = 0; t < I.length; t += 3) { const [i0, i1, i2] = [I[t], I[t+1], I[t+2]]; if (dentro(i0) || dentro(i1) || dentro(i2)) II.push(idx(i0), idx(i1), idx(i2)); }
 const img = (b, n) => doc.createTexture(n).setImage(b).setMimeType('image/webp');
 const mat = doc.createMaterial('inscricao').setBaseColorTexture(img(TESTA.tex.cor, 'inscricao_cor')).setNormalTexture(img(TESTA.tex.normal, 'inscricao_relevo')).setNormalScale(1.6).setRoughnessFactor(0.82).setMetallicFactor(0.08).setAlphaMode('BLEND');
 for (const ti of [mat.getBaseColorTextureInfo(), mat.getNormalTextureInfo()]) ti.setWrapS(33071).setWrapT(33071);
 const acc = (t, arr) => doc.createAccessor().setType(t).setArray(arr).setBuffer(buf);
 const pr = doc.createPrimitive().setAttribute('POSITION', acc('VEC3', new Float32Array(PP))).setAttribute('NORMAL', acc('VEC3', new Float32Array(NN))).setAttribute('TEXCOORD_0', acc('VEC2', new Float32Array(UV))).setIndices(acc('SCALAR', new Uint32Array(II))).setMaterial(mat);
 const no = doc.createNode('inscricao').setMesh(doc.createMesh('inscricao').addPrimitive(pr)); noPeca.addChild(no);
 // ponto da pista da inscrição: no alto da testa, acima da faixa (para o ponto não cobrir os símbolos)
 let best = null; for (let i = 0; i < P.length / 3; i++) if (Math.abs(P[i*3]) < 0.05 && N[i*3+2] > 0.1) { const dv = v(i) - (v1 + 0.06); if (dv > 0 && (!best || dv < best.dv)) best = { dv, i }; }
 console.log('  inscrição na testa:', II.length / 3, 'triângulos; faixa v', V0.toFixed(3), '±', (HV / 2).toFixed(3), '; ponto acima da faixa (V11):', best && [P[best.i*3], P[best.i*3+1], P[best.i*3+2], N[best.i*3], N[best.i*3+1], N[best.i*3+2]].map(x => +x.toFixed(4)).join(','));
 return best && { p: [P[best.i*3], P[best.i*3+1], P[best.i*3+2]], n: [N[best.i*3], N[best.i*3+1], N[best.i*3+2]] };
}
// ---- rachadura fina (revisão 14). Coordenadas da V11 (sem escala), projeção de frente: u = x, v = y. Lado direito de quem olha = +x.
// Desce da ponta direita da sobrancelha pela bochecha, passando longe do olho, com um galho curto; não encosta na inscrição nem no ponto da testa.
const RACHA = { U0: 0.26, U1: 0.60, V0: -0.46, V1: 0.46, PX: 320, perto: 0.022, sobe: 0.004,
 traco: [[0.45, 0.40], [0.41, 0.30], [0.44, 0.20], [0.38, 0.08], [0.41, -0.04], [0.35, -0.16], [0.38, -0.28], [0.33, -0.40]], galho: [[0.41, -0.04], [0.48, -0.10], [0.53, -0.13]] };
function rachaLinhas() {   // o traço com quebras miúdas (fixas: mesma semente), em coordenadas da V11
 let s = 11; const rnd = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
 const quebra = L => { const o = [L[0]]; for (let i = 1; i < L.length; i++) { const [a, b] = [L[i - 1], L[i]], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy);
  for (let k = 1; k <= 4; k++) { const f = k / 4, j = k < 4 ? (rnd() - .5) * 0.012 : 0; o.push([a[0] + dx * f - dy / l * j, a[1] + dy * f + dx / l * j]); } } return o; };
 return [quebra(RACHA.traco), quebra(RACHA.galho)];
}
async function texturasRacha() {
 const R = RACHA, W = Math.round((R.U1 - R.U0) * R.PX), H = Math.round((R.V1 - R.V0) * R.PX), [t, g] = rachaLinhas();
 const d = L => 'M' + L.map(([x, y]) => ((x - R.U0) * R.PX).toFixed(1) + ' ' + ((R.V1 - y) * R.PX).toFixed(1)).join(' L');
 const svg = (cor, l1, l2, fundo) => `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${fundo ? `<rect width="100%" height="100%" fill="${fundo}"/>` : ''}<g fill="none" stroke="${cor}" stroke-linecap="round" stroke-linejoin="round"><path d="${d(t)}" stroke-width="${l1}"/><path d="${d(g)}" stroke-width="${l2}"/></g></svg>`;
 // cor: fenda escura e fina, com a borda um pouco mais clara (pedra lascada); fora do traço, transparente
 const borda = await sharp(Buffer.from(svg('#8d8475', 5.2, 3.4))).blur(0.7).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
 const miolo = await sharp(Buffer.from(svg('#1b1714', 2.6, 1.6))).blur(0.4).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
 const C = Buffer.alloc(W * H * 4); for (let i = 0; i < W * H; i++) { const ab = borda.data[i*4+3] / 255 * 0.35, am = miolo.data[i*4+3] / 255 * 0.92, a = am + ab * (1 - am);
  for (let k = 0; k < 3; k++) C[i*4+k] = a ? Math.round((miolo.data[i*4+k] * am + borda.data[i*4+k] * ab * (1 - am)) / a) : 0; C[i*4+3] = Math.round(a * 255); }
 // relevo: sulco (mais fundo no meio)
 const alt = await sharp(Buffer.from(svg('#fff', 3.5, 2.4, '#000'))).greyscale().blur(1.3).raw().toBuffer({ resolveWithObject: true });
 const A = alt.data, nrm = Buffer.alloc(W * H * 3), k = 6 / 255, h = (x, y) => -A[Math.min(H - 1, Math.max(0, y)) * W + Math.min(W - 1, Math.max(0, x))];
 for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { let nx = -(h(x + 1, y) - h(x - 1, y)) * k / 2, ny = (h(x, y + 1) - h(x, y - 1)) * k / 2, nz = 1; const l = Math.hypot(nx, ny, nz), o = (y * W + x) * 3;
  nrm[o] = Math.round((nx / l * .5 + .5) * 255); nrm[o+1] = Math.round((ny / l * .5 + .5) * 255); nrm[o+2] = Math.round((nz / l * .5 + .5) * 255); }
 return { cor: await sharp(C, { raw: { width: W, height: H, channels: 4 } }).webp({ quality: 70, alphaQuality: 60 }).toBuffer(), normal: await sharp(nrm, { raw: { width: W, height: H, channels: 3 } }).webp({ quality: 60 }).toBuffer(), linhas: [t, g] };
}
async function gravarRacha(doc, buf, noPeca) {
 const tex = await texturasRacha(), R = RACHA;
 let prim = null; noPeca.traverse(n => { const m = n.getMesh(); if (m && !prim && n.getName() !== 'inscricao') prim = m.listPrimitives()[0]; });
 const P = prim.getAttribute('POSITION').getArray(), N = prim.getAttribute('NORMAL').getArray(), I = prim.getIndices().getArray();
 const seg = (px, py, [ax, ay], [bx, by]) => { const dx = bx - ax, dy = by - ay, f = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy))); return Math.hypot(px - ax - f * dx, py - ay - f * dy); };
 const dist = i => Math.min(...tex.linhas.flatMap(L => L.slice(1).map((b, k) => seg(P[i*3], P[i*3+1], L[k], b))));
 const perto = i => N[i*3+2] > 0.1 && P[i*3+2] > -0.1 && dist(i) < R.perto;
 const mapa = new Map(), PP = [], NN = [], UV = [], II = [];
 const idx = i => { if (!mapa.has(i)) { mapa.set(i, PP.length / 3); for (let k = 0; k < 3; k++) { PP.push(P[i*3+k] + N[i*3+k] * R.sobe); NN.push(N[i*3+k]); } UV.push((P[i*3] - R.U0) / (R.U1 - R.U0), (R.V1 - P[i*3+1]) / (R.V1 - R.V0)); } return mapa.get(i); };
 for (let t = 0; t < I.length; t += 3) { const [i0, i1, i2] = [I[t], I[t+1], I[t+2]]; if (perto(i0) || perto(i1) || perto(i2)) II.push(idx(i0), idx(i1), idx(i2)); }
 const img = (b, n) => doc.createTexture(n).setImage(b).setMimeType('image/webp');
 const mat = doc.createMaterial('rachadura').setBaseColorTexture(img(tex.cor, 'rachadura_cor')).setNormalTexture(img(tex.normal, 'rachadura_relevo')).setNormalScale(1.4).setRoughnessFactor(0.9).setMetallicFactor(0).setAlphaMode('BLEND');
 for (const ti of [mat.getBaseColorTextureInfo(), mat.getNormalTextureInfo()]) ti.setWrapS(33071).setWrapT(33071);
 const acc = (t, arr) => doc.createAccessor().setType(t).setArray(arr).setBuffer(buf);
 const pr = doc.createPrimitive().setAttribute('POSITION', acc('VEC3', new Float32Array(PP))).setAttribute('NORMAL', acc('VEC3', new Float32Array(NN))).setAttribute('TEXCOORD_0', acc('VEC2', new Float32Array(UV))).setIndices(acc('SCALAR', new Uint32Array(II))).setMaterial(mat);
 noPeca.addChild(doc.createNode('rachadura').setMesh(doc.createMesh('rachadura').addPrimitive(pr)));
 console.log('  rachadura no lado direito:', II.length / 3, 'triângulos; texturas', tex.cor.length, '+', tex.normal.length, 'bytes');
}
for (const [saida, cfg] of Object.entries(LOOP)) {
 if (SO.length && !SO.includes(saida)) continue;
 const doc = new Document(); const buf = doc.createBuffer(); const cena = doc.createScene(saida); const raiz = doc.createNode(saida); cena.addChild(raiz);
 const por = async id => {
  const pd = await io.read(path.join(PEC, id + '.glb')); const b = getBounds(pd.getRoot().listScenes()[0]);
  const e = (cfg.maior || REAL2[id]) / Math.max(b.max[0]-b.min[0], b.max[1]-b.min[1], b.max[2]-b.min[2]);
  const mapa = mergeDocuments(doc, pd); const nova = mapa.get(pd.getRoot().listScenes()[0]);
  const no = doc.createNode(id).setScale([e, e, e]); for (const f of nova.listChildren()) { nova.removeChild(f); no.addChild(f); } nova.dispose(); raiz.addChild(no);
  return { no, b, e };
 };
 const w = it => (it.b.max[0]-it.b.min[0]) * it.e, cx = it => (it.b.min[0]+it.b.max[0])/2 * it.e, cz = it => (it.b.min[2]+it.b.max[2])/2 * it.e;
 if (cfg.cena) {   // peça em cima de uma base que já vem num modelo (em metros): acha o tampo da base dentro da região dada e pousa a peça no meio dele
  const pd = await io.read(path.join(PEC, cfg.cena + '.glb')), mapa = mergeDocuments(doc, pd), nova = mapa.get(pd.getRoot().listScenes()[0]);
  for (const f of nova.listChildren()) { nova.removeChild(f); raiz.addChild(f); } nova.dispose();
  let topo = -1e9; const pts = [];
  raiz.traverse(n => { const m = n.getMesh(); if (!m) return; const M = n.getWorldMatrix();
   for (const pr of m.listPrimitives()) { const P = pr.getAttribute('POSITION').getArray();
    for (let i = 0; i < P.length; i += 3) { const x = M[0]*P[i] + M[4]*P[i+1] + M[8]*P[i+2] + M[12], y = M[1]*P[i] + M[5]*P[i+1] + M[9]*P[i+2] + M[13], z = M[2]*P[i] + M[6]*P[i+1] + M[10]*P[i+2] + M[14];
     if (x >= cfg.topo.x[0] && x <= cfg.topo.x[1] && z >= cfg.topo.z[0] && z <= cfg.topo.z[1] && y <= cfg.topo.yMax) { pts.push([x, y, z]); if (y > topo) topo = y; } } } });
  const alto = pts.filter(p => p[1] > topo - 0.03), mx = (Math.min(...alto.map(p => p[0])) + Math.max(...alto.map(p => p[0]))) / 2, mz = (Math.min(...alto.map(p => p[2])) + Math.max(...alto.map(p => p[2]))) / 2;
  const it = await por(cfg.sobre); it.no.setTranslation([mx - cx(it), topo - it.b.min[1]*it.e, mz - cz(it)]); console.log('  tampo da base a', topo.toFixed(3), 'm; centro', mx.toFixed(3), mz.toFixed(3));
  if (cfg.testa) { TESTA.tex = await texturasTesta(cfg.testa); const pt = await gravarTesta(doc, buf, it.no, cfg.testa);
   if (pt) { const T = it.no.getTranslation(), e = it.e, w = pt.p.map((c, k) => T[k] + c * e); console.log('  ponto da inscrição na peça (m):', w.map(x => +x.toFixed(4)).join(','), 'normal', pt.n.map(x => +x.toFixed(3)).join(',')); } }
  if (cfg.racha) await gravarRacha(doc, buf, it.no);
 }
 else if (cfg.sobre) { const it = await por(cfg.sobre); raiz.addChild(caixa(doc, buf, cfg.base)); it.no.setTranslation([-cx(it), cfg.base[1] - it.b.min[1]*it.e, -cz(it)]); }
 else { const [p, v] = [await por(cfg.lado[0]), await por(cfg.lado[1])], total = w(p) + cfg.gap + w(v), x0 = -total / 2;
  p.no.setTranslation([x0 + w(p)/2 - cx(p), -p.b.min[1]*p.e, -cz(p)]); v.no.setTranslation([x0 + w(p) + cfg.gap + w(v)/2 - cx(v), -v.b.min[1]*v.e, -cz(v)]); }
 for (const sc of doc.getRoot().listScenes()) if (sc !== cena) sc.dispose();
 doc.createExtension(KHRDracoMeshCompression).setRequired(true).setEncoderOptions({ method: KHRDracoMeshCompression.EncoderMethod.EDGEBREAKER });
 await doc.transform(prune());
 const bufs = doc.getRoot().listBuffers(); for (const bb of bufs.slice(1)) { for (const a of doc.getRoot().listAccessors()) if (a.getBuffer() === bb) a.setBuffer(bufs[0]); bb.dispose(); }
 for (const ext of doc.getRoot().listExtensionsUsed()) if (ext.extensionName === 'EXT_meshopt_compression') ext.dispose();
 await io.write(path.join(PEC, saida + '.glb'), doc); console.log('ok', saida);
}
