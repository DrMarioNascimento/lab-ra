// Peças compostas dos veículos (cópias próprias): cada versão da sala dos veículos leva a bicicleta de roda alta ao lado, em escala real relativa.
// Uso (pasta do gltf-transform): node pecas-compostas.mjs <pasta pecas> [saídas separadas por vírgula; sem isso, faz todas, menos E02_B, P01_B e S01_B, que só saem quando pedidas: node pecas-compostas.mjs <pasta pecas> E02_B,P01_B,S01_B]
// Revisão 17 (26/11/2026): E02_B (Oficina elétrica com gerador, bancada com gaveta, painel de ferramentas e gancho com luvas), P01_B (Recepção com telefone, roleta, relógios, quadro de consumo e chapelaria) e S01_B (Central com cofre pequeno, xícaras, livros e gaveteiro): kit, montarE02B, montarP01B e montarS01B, no fim do arquivo.
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

// ---- kit de montagem por código (revisão 17): geometria com uv, texturas desenhadas (sharp) e materiais. Usado pela E02_B, P01_B e S01_B.
async function kit(doc, buf) {
 const achar = nome => doc.getRoot().listNodes().find(n => n.getName() === nome);
 const matE = nome => doc.getRoot().listMaterials().find(m => m.getName() === nome);
 const acc = (t, arr) => doc.createAccessor().setType(t).setArray(arr).setBuffer(buf);
 // geometria (posição, normal, uv) -> primitiva
 const prim = (g, mat) => doc.createPrimitive().setAttribute('POSITION', acc('VEC3', new Float32Array(g.P))).setAttribute('NORMAL', acc('VEC3', new Float32Array(g.N))).setAttribute('TEXCOORD_0', acc('VEC2', new Float32Array(g.U))).setIndices(acc('SCALAR', new Uint32Array(g.I))).setMaterial(mat);
 const q = (eixo, graus) => { const a = graus * Math.PI / 360, s = Math.sin(a); return eixo === 'x' ? [s, 0, 0, Math.cos(a)] : eixo === 'y' ? [0, s, 0, Math.cos(a)] : [0, 0, s, Math.cos(a)]; };
 const qm = (a, b) => [a[3]*b[0]+a[0]*b[3]+a[1]*b[2]-a[2]*b[1], a[3]*b[1]-a[0]*b[2]+a[1]*b[3]+a[2]*b[0], a[3]*b[2]+a[0]*b[1]-a[1]*b[0]+a[2]*b[3], a[3]*b[3]-a[0]*b[0]-a[1]*b[1]-a[2]*b[2]];
 const no = (pai, nome, g, mat, T = [0, 0, 0], R = null, S = null) => { const n = doc.createNode(nome).setTranslation(T); if (R) n.setRotation(R); if (S) n.setScale(S); if (g) n.setMesh(doc.createMesh(nome).addPrimitive(prim(g, mat))); pai.addChild(n); return n; };
 const grupo = (pai, nome, T = [0, 0, 0], R = null) => no(pai, nome, null, null, T, R);
 // caixa centrada; tile (m) = uv em metros/tile; sem tile = 0..1 em cada face
 const caixa = (lx, ly, lz, tile) => { const x = lx/2, y = ly/2, z = lz/2, g = {P:[],N:[],U:[],I:[]};
  const F = [[[0,0,1],[[-x,-y,z],[x,-y,z],[x,y,z],[-x,y,z]],[lx,ly]],[[0,0,-1],[[x,-y,-z],[-x,-y,-z],[-x,y,-z],[x,y,-z]],[lx,ly]],[[1,0,0],[[x,-y,z],[x,-y,-z],[x,y,-z],[x,y,z]],[lz,ly]],[[-1,0,0],[[-x,-y,-z],[-x,-y,z],[-x,y,z],[-x,y,-z]],[lz,ly]],[[0,1,0],[[-x,y,z],[x,y,z],[x,y,-z],[-x,y,-z]],[lx,lz]],[[0,-1,0],[[-x,-y,-z],[x,-y,-z],[x,-y,z],[-x,-y,z]],[lx,lz]]];
  F.forEach(([n, vs, [a, b]], f) => { const su = tile ? a / tile : 1, sv = tile ? b / tile : 1; vs.forEach((v, k) => { g.P.push(...v); g.N.push(...n); g.U.push([0, su, su, 0][k], [sv, sv, 0, 0][k]); }); g.I.push(4*f, 4*f+1, 4*f+2, 4*f, 4*f+2, 4*f+3); });
  return g; };
 // plano de frente (+z), uv 0..1 (para rótulos, papéis e painéis)
 const plano = (w, h) => ({P:[-w/2,-h/2,0, w/2,-h/2,0, w/2,h/2,0, -w/2,h/2,0], N:[0,0,1,0,0,1,0,0,1,0,0,1], U:[0,1,1,1,1,0,0,0], I:[0,1,2,0,2,3]});
 // cilindro centrado no eixo y (tampas opcionais)
 const cil = (r, h, n = 24, tampas = true, r2 = r) => { const g = {P:[],N:[],U:[],I:[]};
  for (let i = 0; i <= n; i++) { const a = i / n * Math.PI * 2, c = Math.cos(a), s = Math.sin(a); g.P.push(c*r2, -h/2, s*r2, c*r, h/2, s*r); g.N.push(c, 0, s, c, 0, s); g.U.push(i/n, 1, i/n, 0); if (i < n) { const k = i*2; g.I.push(k, k+1, k+3, k, k+3, k+2); } }
  if (tampas) for (const [yy, ny, rr] of [[h/2, 1, r], [-h/2, -1, r2]]) { const c0 = g.P.length / 3; g.P.push(0, yy, 0); g.N.push(0, ny, 0); g.U.push(.5, .5);
   for (let i = 0; i <= n; i++) { const a = i / n * Math.PI * 2; g.P.push(Math.cos(a)*rr, yy, Math.sin(a)*rr); g.N.push(0, ny, 0); g.U.push(.5 + Math.cos(a)*.5, .5 - Math.sin(a)*.5); if (i < n) ny > 0 ? g.I.push(c0, c0+i+2, c0+i+1) : g.I.push(c0, c0+i+1, c0+i+2); } }
  return g; };
 const esfera = (r, n = 18, m = 12) => { const g = {P:[],N:[],U:[],I:[]};
  for (let j = 0; j <= m; j++) for (let i = 0; i <= n; i++) { const t = j / m * Math.PI, p = i / n * Math.PI * 2, x = Math.sin(t)*Math.cos(p), y = Math.cos(t), z = Math.sin(t)*Math.sin(p); g.P.push(x*r, y*r, z*r); g.N.push(x, y, z); g.U.push(i/n, j/m); if (i < n && j < m) { const k = j*(n+1)+i; g.I.push(k, k+n+1, k+1, k+1, k+n+1, k+n+2); } }
  return g; };
 // ---- texturas (sharp)
 let s0 = 17; const rnd = () => { s0 = (s0 * 16807) % 2147483647; return s0 / 2147483647; };
 const webp = async (svg, q = 76) => sharp(Buffer.from(svg)).webp({ quality: q }).toBuffer();
 const rawWebp = async (data, w, h, ch, q = 74) => sharp(data, { raw: { width: w, height: h, channels: ch } }).webp({ quality: q }).toBuffer();
 const ruidoGrade = (W, H, cel) => { const gw = Math.ceil(W / cel) + 2, gh = Math.ceil(H / cel) + 2, G = new Float32Array(gw * gh).map(rnd);
  return (x, y) => { const fx = x / cel, fy = y / cel, ix = fx | 0, iy = fy | 0, tx = fx - ix, ty = fy - iy, sx = tx*tx*(3-2*tx), sy = ty*ty*(3-2*ty), a = G[iy*gw+ix], b = G[iy*gw+ix+1], c = G[(iy+1)*gw+ix], d = G[(iy+1)*gw+ix+1]; return a + (b-a)*sx + (c-a)*sy + (a-b-c+d)*sx*sy; }; };
 // tinta gasta (clara, para tingir com a cor do material): manchas, arranhões e sujeira embaixo
 async function texTinta(W = 512) { const n1 = ruidoGrade(W, W, 64), n2 = ruidoGrade(W, W, 12), n3 = ruidoGrade(W, W, 3), D = Buffer.alloc(W * W * 3);
  for (let y = 0; y < W; y++) for (let x = 0; x < W; x++) { let v = 0.86 + 0.1 * n1(x, y) + 0.06 * n2(x, y) - 0.05 * n3(x, y); v -= Math.max(0, (y / W - 0.72)) * 0.5 * n2(x, y); const o = (y*W+x)*3; D[o] = D[o+1] = Math.max(0, Math.min(255, v * 240)); D[o+2] = Math.max(0, Math.min(255, v * 232)); }
  for (let k = 0; k < 90; k++) { let x = rnd() * W, y = rnd() * W; const a = rnd() * Math.PI, L = 6 + rnd() * 40; for (let t = 0; t < L; t++) { const xi = (x + Math.cos(a)*t) | 0, yi = (y + Math.sin(a)*t) | 0; if (xi < 0 || yi < 0 || xi >= W || yi >= W) break; const o = (yi*W+xi)*3; D[o] = Math.min(255, D[o] + 25); D[o+1] = Math.min(255, D[o+1] + 22); D[o+2] = Math.min(255, D[o+2] + 18); } }
  return rawWebp(D, W, W, 3, 70); }
 async function texMadeira(W = 512, H = 256) { const n = ruidoGrade(W, H, 24), m = ruidoGrade(W, H, 5), D = Buffer.alloc(W * H * 3);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const v = 0.5 + 0.5 * Math.sin((y * 0.16 + n(x, y) * 2.2 + m(x, y) * 0.5) * 2.2), o = (y*W+x)*3, k = 0.78 + 0.22 * v - 0.08 * m(x, y);
   D[o] = Math.round(150 * k); D[o+1] = Math.round(104 * k); D[o+2] = Math.round(66 * k); }
  for (let k = 0; k < 14; k++) { const cx = rnd() * W, cy = rnd() * H, r = 3 + rnd() * 10; for (let y = Math.max(0, cy - r|0); y < Math.min(H, cy + r); y++) for (let x = Math.max(0, cx - r|0); x < Math.min(W, cx + r); x++) { const d = Math.hypot(x - cx, (y - cy) * 2) / r; if (d < 1) { const o = (y*W+x)*3; for (let c = 0; c < 3; c++) D[o+c] = Math.round(D[o+c] * (0.72 + 0.28 * d)); } } }
  return rawWebp(D, W, H, 3, 72); }
 // ferramentas do painel: [tipo, u, v (m, a partir do canto de baixo à esquerda), giro]
 const PB = { w: 1.8, h: 0.85 }, FERR = [['chave', 0.15, 0.5, 0], ['chave', 0.27, 0.48, 0], ['chave', 0.38, 0.46, 0], ['martelo', 0.6, 0.5, 0], ['alicate', 1.08, 0.5, 0], ['chaveF', 1.25, 0.48, 0], ['chaveF', 1.34, 0.48, 0], ['chaveF', 1.43, 0.48, 0], ['serrote', 1.6, 0.48, 0], ['trena', 0.28, 0.16, 0], ['fio', 1.25, 0.16, 0]];
 const PREGO = [0.85, 0.4];   // a chavinha reserva do Quadro externo, num prego
 async function texPainel() { const W = 1024, H = Math.round(1024 * PB.h / PB.w), s = W / PB.w; let furos = '';
  for (let y = 0.025; y < PB.h; y += 0.04) for (let x = 0.025; x < PB.w; x += 0.04) furos += `<circle cx="${(x*s).toFixed(1)}" cy="${((PB.h-y)*s).toFixed(1)}" r="2.6"/>`;
  const sil = FERR.map(([t, u, v]) => { const X = u * s, Y = (PB.h - v) * s; return t === 'chave' ? `<rect x="${X-7}" y="${Y-70}" width="14" height="150" rx="6"/>` : t === 'martelo' ? `<rect x="${X-8}" y="${Y-60}" width="16" height="150" rx="5"/><rect x="${X-45}" y="${Y-82}" width="90" height="28" rx="4"/>` : t === 'alicate' ? `<path d="M${X-22} ${Y+80} L${X-4} ${Y-30} L${X} ${Y-70} L${X+4} ${Y-30} L${X+22} ${Y+80}"/>` : t === 'chaveF' ? `<rect x="${X-9}" y="${Y-20}" width="18" height="80" rx="7"/><rect x="${X-2}" y="${Y-80}" width="4" height="62"/>` : t === 'serrote' ? `<path d="M${X-110} ${Y-40} L${X+60} ${Y-40} L${X+60} ${Y+10} L${X-110} ${Y+40} Z"/><rect x="${X+60}" y="${Y-50}" width="40" height="70" rx="12"/>` : t === 'trena' ? `<circle cx="${X}" cy="${Y}" r="34"/>` : `<circle cx="${X}" cy="${Y}" r="50"/>`; }).join('');
  return webp(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9a7a52"/><stop offset="1" stop-color="#7d6040"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/><g fill="#2a2018">${furos}</g><g fill="none" stroke="#efe6cf" stroke-width="5" stroke-linejoin="round" opacity=".8">${sil}</g><rect x="4" y="4" width="${W-8}" height="${H-8}" fill="none" stroke="#3a2c1c" stroke-width="8"/></svg>`, 80); }
 const papel = (w, h, corpo, fundo = '#f1ead8') => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="100%" height="100%" fill="${fundo}"/>${corpo}</svg>`;
 const rabisco = (x, y, L, cor = '#2b3f8a', k = 0) => { let d = `M${x} ${y}`; for (let i = 1; i <= L / 6; i++) d += ` Q${x + i*6 - 3} ${y - 3 - ((i + k) % 3)} ${x + i*6} ${y + ((i * 7 + k) % 5) - 2}`; return `<path d="${d}" fill="none" stroke="${cor}" stroke-width="1.6" stroke-linecap="round"/>`; };
 const linhas = (x0, y0, n, dy, L, cor) => Array.from({length: n}, (_, i) => rabisco(x0, y0 + i * dy, L - (i * 37 % 60), cor, i)).join('');
 const F = 'font-family="DejaVu Sans, Arial, sans-serif" font-weight="bold"';
 const texOS = () => webp(papel(256, 360, `<rect x="0" y="0" width="256" height="44" fill="#c9502c"/><text x="128" y="29" ${F} font-size="19" fill="#fff" text-anchor="middle">ORDEM DE SERVIÇO</text><g stroke="#b9ae95" stroke-width="1">${Array.from({length: 12}, (_, i) => `<line x1="14" y1="${82 + i*22}" x2="242" y2="${82 + i*22}"/>`).join('')}</g>${linhas(18, 78, 9, 22, 210, '#25357a')}<circle cx="196" cy="318" r="24" fill="none" stroke="#9a2a2a" stroke-width="3" opacity=".7"/><path d="M8 345 Q60 330 120 352" stroke="#5a4a32" stroke-width="7" opacity=".18" fill="none"/>`), 74);
 const texVerso = () => webp(papel(256, 120, `<ellipse cx="88" cy="62" rx="54" ry="30" fill="#3b2f22" opacity=".42"/><ellipse cx="104" cy="58" rx="30" ry="16" fill="#2a2016" opacity=".35"/><text x="150" y="88" ${F} font-size="18" fill="#3a3a5a" opacity=".8">55 3 1·4…</text><line x1="146" y1="82" x2="244" y2="78" stroke="#22224a" stroke-width="3"/>`, '#ece4cf'), 74);
 const texConf = () => webp(papel(256, 340, `<text x="128" y="30" ${F} font-size="18" fill="#2a2a2a" text-anchor="middle">CONFERÊNCIA</text><line x1="14" y1="40" x2="242" y2="40" stroke="#333" stroke-width="2"/><g stroke="#8c8c8c" stroke-width="1" fill="none">${Array.from({length: 10}, (_, i) => `<rect x="18" y="${58 + i*27}" width="14" height="14"/><line x1="40" y1="${71 + i*27}" x2="238" y2="${71 + i*27}"/>`).join('')}</g>${Array.from({length: 6}, (_, i) => rabisco(46, 66 + i*27, 120 + (i*29 % 70), '#1d2a6a', i)).join('')}`), 74);
 const texProc = () => webp(papel(300, 420, `<rect width="300" height="54" fill="#b3261e"/><text x="150" y="36" ${F} font-size="24" fill="#fff" text-anchor="middle">PROCEDIMENTO</text>${[0,1,2,3].map(i => `<circle cx="34" cy="${100 + i*76}" r="17" fill="#1f3b63"/><text x="34" y="${107 + i*76}" ${F} font-size="19" fill="#fff" text-anchor="middle">${i+1}</text>${linhas(64, 94 + i*76, 2, 22, 200, '#222')}`).join('')}<path d="M232 340 l0 -38 q0 -8 8 -8 q8 0 8 8 l0 22 l4 -28 q2 -8 9 -6 q6 2 5 9 l-3 30 l8 -22 q3 -7 9 -4 q6 3 3 10 l-14 44 q-6 16 -22 16 q-18 0 -18 -18 z" fill="#e8a020" stroke="#7a4a10" stroke-width="3"/><rect x="6" y="6" width="288" height="408" fill="none" stroke="#fff" stroke-width="4" opacity=".55"/>`, '#f6f3ea'), 76);
 const texFita = () => webp(papel(64, 256, Array.from({length: 18}, (_, i) => `<rect x="${8 + (i*13 % 20)}" y="${10 + i*13}" width="${22 + (i*17 % 22)}" height="4" fill="#3c3c3c" opacity=".75"/>`).join(''), '#f4f1e6'), 74);
 const dial = (cx, cy, r, ang = -130) => { let t = ''; for (let i = 0; i <= 20; i++) { const a = (-130 + i * 13) * Math.PI / 180, l = i % 5 ? r * .1 : r * .2; t += `<line x1="${cx + Math.sin(a)*(r*.86)}" y1="${cy - Math.cos(a)*(r*.86)}" x2="${cx + Math.sin(a)*(r*.86 - l)}" y2="${cy - Math.cos(a)*(r*.86 - l)}" stroke="#222" stroke-width="${i % 5 ? 1.5 : 3}"/>`; }
  const a = ang * Math.PI / 180; return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#2b2b2b"/><circle cx="${cx}" cy="${cy}" r="${r*.92}" fill="#efe8d2"/><path d="M${cx + Math.sin(1.62)*r*.86} ${cy - Math.cos(1.62)*r*.86} A${r*.86} ${r*.86} 0 0 1 ${cx + Math.sin(2.27)*r*.86} ${cy - Math.cos(2.27)*r*.86}" stroke="#b02a20" stroke-width="${r*.12}" fill="none"/>${t}<line x1="${cx}" y1="${cy}" x2="${cx + Math.sin(a)*r*.7}" y2="${cy - Math.cos(a)*r*.7}" stroke="#151515" stroke-width="${r*.05}"/><circle cx="${cx}" cy="${cy}" r="${r*.08}" fill="#151515"/><path d="M${cx - r*.6} ${cy - r*.45} A${r*.75} ${r*.75} 0 0 1 ${cx + r*.2} ${cy - r*.72}" stroke="#fff" stroke-width="${r*.08}" fill="none" opacity=".55"/>`; };
 const texMedidor = () => webp(`<svg xmlns="http://www.w3.org/2000/svg" width="256" height="300"><rect width="256" height="300" rx="14" fill="#1d1c1a"/><rect x="10" y="10" width="236" height="280" rx="10" fill="#2a2926"/>${dial(128, 128, 100, -128)}<rect x="58" y="246" width="140" height="30" rx="4" fill="#c9b98a"/><rect x="70" y="257" width="116" height="7" fill="#5a4e30" opacity=".6"/></svg>`, 80);
 const texControle = () => webp(`<svg xmlns="http://www.w3.org/2000/svg" width="512" height="460"><rect width="512" height="460" fill="#2f3432"/><rect x="12" y="12" width="488" height="436" rx="8" fill="#3a403d" stroke="#1d201f" stroke-width="6"/>${dial(130, 140, 86, -40)}${dial(340, 140, 86, 30)}<rect x="440" y="70" width="40" height="150" rx="6" fill="#1d201f"/><circle cx="460" cy="105" r="13" fill="#3dd16a"/><circle cx="460" cy="150" r="13" fill="#ffb02a"/><circle cx="460" cy="195" r="13" fill="#5a1f1a"/>${[0,1,2,3,4].map(i => `<rect x="${70 + i*70}" y="290" width="40" height="64" rx="6" fill="#1b1d1c"/><rect x="${82 + i*70}" y="${i % 2 ? 300 : 318}" width="16" height="30" rx="4" fill="#c9c9c3"/><rect x="${66 + i*70}" y="364" width="48" height="12" fill="#d8d0b4" opacity=".8"/>`).join('')}<circle cx="430" cy="320" r="30" fill="#b3261e" stroke="#e8c020" stroke-width="10"/><rect x="60" y="400" width="300" height="22" fill="#d8d0b4" opacity=".55"/></svg>`, 80);
 const texGrade = () => webp(`<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256"><rect width="256" height="256" fill="#1c1f1e"/>${Array.from({length: 16}, (_, i) => `<rect x="10" y="${8 + i*15.5}" width="236" height="8" rx="2" fill="#4a524e"/><rect x="10" y="${8 + i*15.5}" width="236" height="2" fill="#7b857f"/>`).join('')}</svg>`, 76);
 const texFusiveis = () => { let f = ''; for (let r = 0; r < 3; r++) { f += `<rect x="40" y="${118 + r*120}" width="432" height="96" rx="6" fill="#262a2c"/><rect x="40" y="${100 + r*120}" width="140" height="14" fill="#cfc6a6"/>`; for (let c = 0; c < 8; c++) { const x = 64 + c * 52, y = 132 + r*120; f += `<rect x="${x}" y="${y}" width="34" height="62" rx="5" fill="#e9e3d4"/><rect x="${x+7}" y="${y-6}" width="20" height="10" rx="2" fill="#9c9c9c"/><rect x="${x+7}" y="${y+58}" width="20" height="10" rx="2" fill="#9c9c9c"/><circle cx="${x+17}" cy="${y+18}" r="6" fill="#ffb84a"/>`; } }
  return webp(`<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512"><rect width="512" height="512" fill="#7d8786"/><rect x="18" y="18" width="476" height="476" rx="10" fill="#9aa4a2" stroke="#5c6564" stroke-width="8"/>${f}${[[34,34],[478,34],[34,478],[478,478]].map(([x,y]) => `<circle cx="${x}" cy="${y}" r="7" fill="#4a5150"/>`).join('')}<rect x="200" y="36" width="112" height="44" fill="#ffd21f"/><path d="M256 42 l20 34 h-40 z" fill="#111"/><path d="M258 50 l-8 14 h8 l-4 12 l12 -16 h-8 l4 -10 z" fill="#ffd21f"/></svg>`, 80); };
 const texEtiqueta = (txt, cor = '#f2ecda') => webp(`<svg xmlns="http://www.w3.org/2000/svg" width="128" height="64"><rect width="128" height="64" fill="${cor}"/><rect x="0" y="0" width="128" height="64" fill="none" stroke="#9a9078" stroke-width="3"/><text x="64" y="40" ${F} font-size="20" fill="#2a2a2a" text-anchor="middle">${txt}</text></svg>`, 78);
 const T = {}; const tex = (nome, b) => (T[nome] ??= doc.createTexture(nome).setImage(b).setMimeType('image/webp'));
 const M = {}; const mat = (nome, cor, r = 0.6, m = 0, t = null, extra = {}) => { const k = doc.createMaterial(nome).setBaseColorFactor(cor).setRoughnessFactor(r).setMetallicFactor(m); if (t) k.setBaseColorTexture(t); if (extra.emis) k.setEmissiveFactor(extra.emis); if (extra.alpha) k.setAlphaMode('BLEND'); if (extra.dois) k.setDoubleSided(true); return (M[nome] = k); };
 const tTinta = tex('tinta_gasta', await texTinta()), tMad = tex('madeira', await texMadeira());
 mat('tinta_gerador', [0.16, 0.30, 0.20, 1], 0.5, 0.35, tTinta); mat('tinta_gerador_escura', [0.09, 0.17, 0.12, 1], 0.55, 0.35, tTinta);
 mat('tinta_cinza', [0.42, 0.46, 0.46, 1], 0.55, 0.3, tTinta); mat('tinta_gaveteiro', [0.45, 0.13, 0.10, 1], 0.5, 0.25, tTinta); mat('tinta_parede_barra', [0.20, 0.30, 0.29, 1], 0.7, 0, tTinta);
 mat('aco', [0.32, 0.33, 0.34, 1], 0.45, 0.8); mat('aco_escape', [0.16, 0.15, 0.14, 1], 0.6, 0.6); mat('aco_preto', [0.05, 0.05, 0.055, 1], 0.6, 0.5); mat('cromo', [0.8, 0.8, 0.82, 1], 0.2, 1); mat('latao', [0.78, 0.58, 0.25, 1], 0.3, 1);
 mat('borracha', [0.03, 0.03, 0.03, 1], 0.85, 0); mat('luva', [0.95, 0.52, 0.06, 1], 0.42, 0, tTinta); mat('cabo_cabo', [0.45, 0.05, 0.04, 1], 0.6, 0); mat('cabo_preto', [0.04, 0.04, 0.04, 1], 0.6, 0);
 mat('madeira', [1, 1, 1, 1], 0.68, 0, tMad); mat('cabo_madeira', [0.9, 0.75, 0.55, 1], 0.6, 0, tMad); mat('cabo_vermelho', [0.75, 0.08, 0.06, 1], 0.4, 0); mat('cabo_amarelo', [0.95, 0.75, 0.1, 1], 0.45, 0);
 mat('painel_ferramentas', [1, 1, 1, 1], 0.8, 0, tex('painel_ferr', await texPainel()));
 mat('papel_os', [1, 1, 1, 1], 0.9, 0, tex('papel_os', await texOS()), {dois: true}); mat('papel_verso', [1, 1, 1, 1], 0.9, 0, tex('papel_verso', await texVerso()), {dois: true});
 mat('papel_conf', [1, 1, 1, 1], 0.9, 0, tex('papel_conf', await texConf())); mat('procedimento', [1, 1, 1, 1], 0.25, 0, tex('procedimento', await texProc()));
 mat('fita_papel', [1, 1, 1, 1], 0.9, 0, tex('fita_papel', await texFita()), {dois: true}); mat('medidor', [1, 1, 1, 1], 0.35, 0, tex('medidor', await texMedidor()));
 mat('controle', [1, 1, 1, 1], 0.45, 0.2, tex('controle', await texControle())); mat('grade_radiador', [1, 1, 1, 1], 0.5, 0.5, tex('grade_radiador', await texGrade()));
 mat('fusiveis', [1, 1, 1, 1], 0.45, 0.3, tex('fusiveis', await texFusiveis())); mat('etiqueta_fachada', [1, 1, 1, 1], 0.85, 0, tex('etq_fachada', await texEtiqueta('FACHADA')));
 mat('etiqueta_luvas', [1, 1, 1, 1], 0.85, 0, tex('etq_luvas', await texEtiqueta('Q. EXTERNO'))); mat('etiqueta_f2', [1, 1, 1, 1], 0.85, 0, tex('etq_f2', await texEtiqueta('F2 · RESERVA')));
 mat('lacre', [0.62, 0.05, 0.05, 1], 0.35, 0); mat('vidro_fusivel', [0.75, 0.8, 0.82, 0.45], 0.08, 0, null, {alpha: true}); mat('vidro_medidor', [0.8, 0.85, 0.9, 0.18], 0.05, 0, null, {alpha: true});
 mat('lampada', [1, 0.86, 0.55, 1], 0.3, 0, null, {emis: [1, 0.72, 0.32]}); mat('lampada_aranha', [0.25, 0.22, 0.18, 0.7], 0.9, 0, null, {alpha: true});
 mat('fita_adesiva', [0.92, 0.86, 0.66, 0.75], 0.5, 0, null, {alpha: true}); mat('prancheta', [0.42, 0.28, 0.16, 1], 0.6, 0, tMad);
 return { achar, matE, acc, prim, q, qm, no, grupo, caixa, plano, cil, esfera, rnd, webp, rawWebp, ruidoGrade, papel, rabisco, linhas, F, dial, texEtiqueta, PB, FERR, PREGO, T, tex, M, mat };
}

// ---- E02_B (revisão 17, 26/11/2026): Oficina elétrica com o que o cartão e as pistas mandam tocar.
// Base: a Central de energia E02 (modelo do autor) em tamanho real (1 m = 1 m), recortada num canto de sala de 4,4 m x 3,2 m (paredes de 3 m), SEM TETO:
// piso e paredes com os materiais de concreto da E02, o quadro elétrico, as luzes de emergência e a placa de perigo da E02.
// Por código (nenhum modelo pronto tinha estes objetos): gerador a diesel (com a fita de papel e a ordem de serviço dobrada por cima),
// bancada de madeira com gaveteiro (gaveta de baixo com lacre), fusível e folha de conferência em cima, painel de ferramentas
// (chavinha num prego), gancho com luvas de borracha, painel de fusíveis, medidor da base da Galeria, procedimento plastificado
// e lâmpadas antigas amareladas. Os nós "alvo_*" marcam onde cada pista fica (museu/pontos-pecas.html, pontosNos).
// Frente da cena para +z, chão em y = 0.
async function montarE02B() {
 const doc = new Document(); const buf = doc.createBuffer(); const cena = doc.createScene('E02_B'); const raiz = doc.createNode('E02_B'); cena.addChild(raiz);
 const pd = await io.read(path.join(PEC, 'E02.glb')), mapa = mergeDocuments(doc, pd), velha = mapa.get(pd.getRoot().listScenes()[0]);
 const { achar, matE, acc, prim, q, qm, no, grupo, caixa, plano, cil, esfera, rnd, webp, rawWebp, ruidoGrade, papel, rabisco, linhas, F, dial, texEtiqueta, PB, FERR, PREGO, T, tex, M, mat } = await kit(doc, buf);
 const piso = matE('concreto_piso'), parede = matE('concreto_parede'), corte = matE('concreto_corte'), perigo = matE('placa_perigo');

 // ---- sala: piso, parede do fundo e parede da esquerda (concreto da E02), barra pintada embaixo, sem teto. Compacta (4,4 m x 3,2 m), para os objetos encherem a tela do celular.
 const LX = 4.4, LZ = 3.2, ALT = 3.0, X0 = -LX / 2, Z0 = -LZ / 2;
 raiz.setTranslation([0.075, 0.05, 0.075]);   // chão (fundo do piso) em y = 0 e a sala no meio da caixa
 const sala = grupo(raiz, 'sala');
 no(sala, 'piso', caixa(LX, 0.05, LZ, 4), piso, [0, -0.025, 0]);
 no(sala, 'parede_fundo', caixa(LX + 0.15, ALT, 0.15, 4), parede, [-0.075, ALT / 2, Z0 - 0.075]);
 no(sala, 'parede_esquerda', caixa(0.15, ALT, LZ, 4), parede, [X0 - 0.075, ALT / 2, 0]);
 no(sala, 'parede_fundo_corte_topo', caixa(LX + 0.15, 0.012, 0.15), corte, [-0.075, ALT + 0.006, Z0 - 0.075]);
 no(sala, 'parede_esquerda_corte_topo', caixa(0.15, 0.012, LZ), corte, [X0 - 0.075, ALT + 0.006, 0]);
 no(sala, 'barra_fundo', caixa(LX, 1.2, 0.01, 1.5), M.tinta_parede_barra, [0, 0.6, Z0 + 0.005]);
 no(sala, 'barra_esquerda', caixa(0.01, 1.2, LZ, 1.5), M.tinta_parede_barra, [X0 + 0.005, 0.6, 0]);
 no(sala, 'filete_fundo', caixa(LX, 0.03, 0.012), M.cabo_amarelo, [0, 1.2, Z0 + 0.007]); no(sala, 'filete_esquerda', caixa(0.012, 0.03, LZ), M.cabo_amarelo, [X0 + 0.007, 1.2, 0]);
 no(sala, 'rodape_frente', caixa(LX, 0.06, 0.08), corte, [0, 0.03, LZ / 2 - 0.04]); no(sala, 'rodape_direita', caixa(0.08, 0.06, LZ), corte, [LX / 2 - 0.04, 0.03, 0]);
 // eletrocalha com cabos no alto da parede do fundo, descendo para o painel de fusíveis e para o medidor
 no(sala, 'eletrocalha', caixa(LX - 0.2, 0.08, 0.25), matE('aco_galvanizado'), [0.1, 2.86, Z0 + 0.14]);
 for (const [x, cor, y0] of [[-1.62, 'cabo_preto', 2.34], [-1.5, 'cabo_cabo', 2.34], [-0.6, 'cabo_preto', 2.35]]) no(sala, 'cabo_desce', cil(0.016, 2.82 - y0, 10, false), M[cor], [x, (2.82 + y0) / 2, Z0 + 0.06]);

 // ---- da E02: quadro elétrico (na parede da esquerda), luzes de emergência e placa de perigo, em tamanho real
 const daE02 = (nome, pai, alvo, R = null) => { const n = achar(nome); if (!n) return console.log('  (sem', nome + ')'); n.getParentNode()?.removeChild(n);
  const w = doc.createNode(nome + '_E02'); w.addChild(n); if (R) w.setRotation(R); pai.addChild(w); n.setTranslation([0, 0, 0]); n.setScale([1, 1, 1]); n.setRotation([0, 0, 0, 1]);
  const bb = getBounds(n), c = [(bb.min[0] + bb.max[0]) / 2, bb.min[1], (bb.min[2] + bb.max[2]) / 2]; n.setTranslation([-c[0], -c[1], -c[2]]); w.setTranslation(alvo); return w; };
 for (const n of ['quadro_eletrico_conduite_sup', 'quadro_eletrico_marcador']) achar(n)?.dispose();   // o eletroduto passava do alto da parede; o marcador é neon de outro jogo
 daE02('quadro_eletrico', sala, [X0 + 0.01, 0.0, -0.95], q('y', 90));
 daE02('luz_emergencia_0', sala, [1.15, 2.62, Z0], null); daE02('luz_emergencia_1', sala, [X0, 2.62, 0.9], q('y', 90));
 daE02('placa_perigo_fundo', sala, [-1.55, 2.42, Z0 + 0.13], null);

 // ---- gerador a diesel (frente esquerda), comprido em x: painel de controle e alternador na ponta esquerda, radiador na direita
 const ger = grupo(raiz, 'gerador', [-1.25, 0, 0.35]);
 for (const z of [-0.3, 0.3]) no(ger, 'base_longarina', caixa(1.72, 0.12, 0.09), M.aco_preto, [0, 0.06, z]);
 for (const x of [-0.78, 0, 0.78]) no(ger, 'base_travessa', caixa(0.09, 0.09, 0.6), M.aco_preto, [x, 0.075, 0]);
 no(ger, 'radiador', caixa(0.25, 0.93, 0.74), M.tinta_gerador_escura, [0.725, 0.585, 0]);
 no(ger, 'radiador_grade_frente', plano(0.2, 0.8), M.grade_radiador, [0.725, 0.6, 0.372]);
 no(ger, 'radiador_grade_lado', plano(0.66, 0.8), M.grade_radiador, [0.852, 0.6, 0], q('y', 90));
 no(ger, 'radiador_tampa', cil(0.035, 0.05, 16), M.cromo, [0.725, 1.07, 0]);
 no(ger, 'motor', caixa(0.75, 0.7, 0.62), M.tinta_gerador, [0.225, 0.5, 0]);
 no(ger, 'motor_tampa_valvulas', caixa(0.55, 0.1, 0.28), M.tinta_gerador_escura, [0.2, 0.9, -0.03]);
 for (let i = 0; i < 5; i++) no(ger, 'motor_parafuso', cil(0.012, 0.02, 8), M.cromo, [-0.02 + i * 0.11, 0.96, 0.08]);
 no(ger, 'filtro_ar', cil(0.1, 0.18, 20), M.aco_preto, [-0.03, 0.93, -0.17], q('z', 90));
 no(ger, 'escape', cil(0.045, 0.55, 14), M.aco_escape, [0.47, 1.175, -0.2]);
 no(ger, 'escape_curva', esfera(0.05, 12, 8), M.aco_escape, [0.47, 1.45, -0.2]);
 no(ger, 'escape_parede', cil(0.045, 1.75, 14), M.aco_escape, [0.47, 1.45, -1.075], q('x', 90));   // o cano do escape sai pela parede do fundo
 no(ger, 'escape_silencioso', cil(0.085, 0.45, 18), M.aco_escape, [0.47, 1.45, -0.75], q('x', 90));
 for (const z of [-1.2, -1.75]) no(ger, 'escape_abracadeira', cil(0.055, 0.03, 12), M.aco_preto, [0.47, 1.45, z], q('x', 90));
 no(ger, 'motor_carter', caixa(0.65, 0.1, 0.5), M.aco_preto, [0.225, 0.2, 0]);
 no(ger, 'alternador', cil(0.3, 0.55, 32), M.tinta_gerador, [-0.45, 0.45, 0], q('z', 90));
 for (const x of [-0.65, -0.5, -0.36, -0.23]) no(ger, 'alternador_aleta', cil(0.315, 0.03, 32), M.tinta_gerador_escura, [x, 0.45, 0], q('z', 90));
 no(ger, 'alternador_tampa', cil(0.2, 0.04, 24), M.aco, [-0.74, 0.45, 0], q('z', 90));
 no(ger, 'suporte_controle', caixa(0.07, 0.3, 0.07), M.aco_preto, [-0.55, 0.85, 0.12]);
 no(ger, 'caixa_controle', caixa(0.5, 0.42, 0.26), M.tinta_cinza, [-0.55, 1.18, 0.1]);
 no(ger, 'controle_frente', plano(0.46, 0.38), M.controle, [-0.55, 1.18, 0.232]);
 no(ger, 'impressora', caixa(0.18, 0.09, 0.16), M.aco_preto, [-0.66, 1.435, 0.12]);
 no(ger, 'impressora_fenda', caixa(0.11, 0.012, 0.01), M.borracha, [-0.66, 1.455, 0.202]);
 // a fita de papel: sai da impressora e desce em curva pela frente
 const fita = grupo(ger, 'fita_papel'); let fy = 1.455, fz = 0.208;
 for (let i = 0; i < 6; i++) { const a = 15 + i * 16, L = 0.065, r = a * Math.PI / 180, cy = fy - Math.sin(r) * L / 2, cz = fz + Math.cos(r) * L / 2;
  no(fita, 'fita_' + i, caixa(0.05, 0.0015, L), M.fita_papel, [-0.66, cy, cz], q('x', a)); fy -= Math.sin(r) * L; fz += Math.cos(r) * L; }
 no(ger, 'alvo_fita', caixa(0.055, 0.035, 0.035), M.fita_papel, [-0.66, 1.34, 0.3]);
 // ordem de serviço colada na frente do motor, com a parte de cima dobrada sobre o tampo (mostra o verso)
 no(ger, 'alvo_ordem_servico', plano(0.21, 0.26), M.papel_os, [0.2, 0.71, 0.312], q('z', -3));
 no(ger, 'fita_adesiva_os', caixa(0.12, 0.025, 0.004), M.fita_adesiva, [0.2, 0.835, 0.315], q('z', -3));
 no(ger, 'alvo_verso_os', plano(0.21, 0.1), M.papel_verso, [0.2, 0.853, 0.26], qm(q('x', -90), q('z', -3)));
 no(ger, 'placa_perigo_gerador', plano(0.12, 0.1), perigo, [0.5, 0.42, 0.312]);

 // ---- bancada de madeira (fundo, à direita) com gaveteiro
 const ban = grupo(raiz, 'bancada', [0.4, 0, Z0 + 0.37]);
 no(ban, 'tampo', caixa(1.7, 0.06, 0.7, 1.2), M.madeira, [0, 0.9, 0]);
 for (const [x, z] of [[-0.8, -0.3], [-0.8, 0.3], [0.13, -0.3], [0.13, 0.3]]) no(ban, 'perna', caixa(0.06, 0.87, 0.06), M.aco_preto, [x, 0.435, z]);
 no(ban, 'prateleira', caixa(0.95, 0.03, 0.62, 1.2), M.madeira, [-0.33, 0.18, 0]);
 no(ban, 'gaveteiro', caixa(0.64, 0.86, 0.66), M.tinta_gaveteiro, [0.5, 0.43, -0.01]);
 const GAV = [[0.73, 0.2], [0.49, 0.24], [0.2, 0.3]];   // altura do meio, altura da gaveta (a de baixo é a maior)
 GAV.forEach(([y, h], i) => { no(ban, 'gaveta_' + i, caixa(0.58, h - 0.025, 0.02), M.tinta_gaveteiro, [0.5, y, 0.33]); no(ban, 'puxador_' + i, caixa(0.2, 0.025, 0.03), M.cromo, [0.5, y + h * 0.18, 0.355]); });
 no(ban, 'alvo_gaveta_baixo', plano(0.2, 0.1), M.etiqueta_f2, [0.5, 0.14, 0.342]);
 no(ban, 'lacre_fio', cil(0.003, 0.2, 6, false), M.cabo_vermelho, [0.61, 0.24, 0.346]);
 no(ban, 'lacre', cil(0.022, 0.012, 16), M.lacre, [0.61, 0.13, 0.348], q('x', 90));
 no(ban, 'morsa', caixa(0.16, 0.12, 0.2), M.tinta_cinza, [-0.7, 0.99, 0.2]); no(ban, 'morsa_fuso', cil(0.012, 0.26, 10), M.cromo, [-0.7, 0.99, 0.36], q('x', 90));
 // em cima: o fusível ao lado da etiqueta, e a folha de conferência na prancheta
 const fus = grupo(ban, 'alvo_fusivel_bancada', [-0.35, 0.945, 0.12], q('y', 20));
 no(fus, 'fusivel_vidro', cil(0.013, 0.07, 14), M.vidro_fusivel, [0, 0.013, 0], q('z', 90)); no(fus, 'fusivel_fio', cil(0.0015, 0.066, 6, false), M.aco_preto, [0, 0.013, 0], q('z', 90));
 for (const x of [-0.042, 0.042]) no(fus, 'fusivel_ponta', cil(0.0145, 0.016, 14), M.cromo, [x, 0.013, 0], q('z', 90));
 no(ban, 'etiqueta_fachada', plano(0.11, 0.055), M.etiqueta_fachada, [-0.2, 0.9305, 0.14], q('x', -90));
 no(ban, 'prancheta', caixa(0.25, 0.008, 0.34), M.prancheta, [0.5, 0.934, 0.04], q('y', -8));
 no(ban, 'alvo_folha_conferencia', plano(0.22, 0.29), M.papel_conf, [0.5, 0.9395, 0.055], qm(q('y', -8), q('x', -90)));
 no(ban, 'prancheta_prendedor', caixa(0.1, 0.02, 0.03), M.cromo, [0.5, 0.945, -0.11], q('y', -8));
 no(ban, 'rolo_fio', cil(0.09, 0.07, 22), M.cabo_cabo, [0.0, 0.965, -0.2]); no(ban, 'rolo_fio_miolo', cil(0.035, 0.075, 14), M.aco_preto, [0.0, 0.965, -0.2]);

 // ---- painel de ferramentas (parede do fundo, acima da bancada), com as ferramentas e a chavinha num prego
 const pnl = grupo(raiz, 'painel_ferramentas', [0.15, 1.35, Z0 + 0.03]);
 no(pnl, 'painel_placa', caixa(PB.w, PB.h, 0.012), M.painel_ferramentas, [0, PB.h / 2, 0.006]);
 no(pnl, 'painel_frente', plano(PB.w, PB.h), M.painel_ferramentas, [0, PB.h / 2, 0.0125]);
 for (const [x, y, w, h] of [[0, -0.01, PB.w + 0.04, 0.03], [0, PB.h + 0.01, PB.w + 0.04, 0.03], [-PB.w/2 - 0.01, PB.h/2, 0.03, PB.h + 0.04], [PB.w/2 + 0.01, PB.h/2, 0.03, PB.h + 0.04]]) no(pnl, 'painel_moldura', caixa(w, h, 0.03), M.madeira, [x, y, 0.015]);
 const P0 = [-PB.w / 2, 0], zf = 0.03;
 for (const [t, u, v] of FERR) { const x = P0[0] + u, y = v, g = grupo(pnl, 'ferr_' + t, [x, y, zf]);
  if (t === 'chave') { no(g, 'haste', caixa(0.024, 0.24, 0.008), M.cromo, [0, 0, 0]); no(g, 'boca', cil(0.026, 0.01, 16), M.cromo, [0, 0.13, 0], q('x', 90)); no(g, 'anel', cil(0.02, 0.01, 16), M.cromo, [0, -0.13, 0], q('x', 90)); }
  else if (t === 'martelo') { no(g, 'cabo', cil(0.016, 0.3, 12), M.cabo_madeira, [0, 0, 0]); no(g, 'cabeca', caixa(0.15, 0.045, 0.04), M.aco_preto, [0, 0.16, 0]); }
  else if (t === 'alicate') { for (const s of [-1, 1]) { no(g, 'braco', caixa(0.022, 0.17, 0.012), M.cabo_vermelho, [s * 0.024, -0.06, 0], q('z', s * 9)); no(g, 'mordente', caixa(0.014, 0.08, 0.012), M.aco, [s * 0.006, 0.07, 0], q('z', -s * 4)); } }
  else if (t === 'chaveF') { no(g, 'cabo', cil(0.014, 0.12, 12), [M.cabo_amarelo, M.cabo_vermelho, M.cabo_amarelo][Math.round((u - FERR.find(f => f[0] === 'chaveF')[1]) / 0.09)] || M.cabo_amarelo, [0, 0.0, 0]); no(g, 'haste', cil(0.0035, 0.1, 8), M.cromo, [0, 0.11, 0]); }
  else if (t === 'serrote') { no(g, 'lamina', caixa(0.3, 0.08, 0.004), M.cromo, [-0.03, 0, 0]); no(g, 'cabo', caixa(0.08, 0.13, 0.03), M.cabo_madeira, [0.15, 0, 0]); }
  else if (t === 'trena') { no(g, 'corpo', cil(0.06, 0.04, 20), M.cabo_amarelo, [0, 0, 0], q('x', 90)); }
  else { no(g, 'rolo', cil(0.085, 0.05, 20), M.cabo_cabo, [0, 0, 0], q('x', 90)); no(g, 'miolo', cil(0.03, 0.055, 12), M.aco_preto, [0, 0, 0], q('x', 90)); } }
 const prego = grupo(pnl, 'alvo_painel_ferramentas', [P0[0] + PREGO[0], PREGO[1], zf]);
 no(prego, 'prego', cil(0.004, 0.05, 8), M.aco, [0, 0, 0.0], q('x', 90)); no(prego, 'chave_argola', cil(0.016, 0.004, 14, true), M.latao, [0, -0.02, 0.012], q('x', 90));
 no(prego, 'chave_haste', caixa(0.011, 0.05, 0.003), M.latao, [0, -0.06, 0.012]); no(prego, 'chave_dente', caixa(0.012, 0.012, 0.003), M.latao, [0.008, -0.078, 0.012]);

 // ---- gancho com as luvas de borracha (parede do fundo, à direita da bancada)
 const gan = grupo(raiz, 'alvo_gancho_luvas', [1.62, 1.66, Z0 + 0.02]);
 no(gan, 'gancho_placa', caixa(0.08, 0.12, 0.012), M.aco_preto, [0, 0, 0.006]); no(gan, 'gancho_braco', cil(0.008, 0.1, 8), M.aco, [0, 0, 0.06], q('x', 90)); no(gan, 'gancho_ponta', cil(0.008, 0.04, 8), M.aco, [0, 0.018, 0.105]);
 const luva = (nome, T0, giro) => { const l = grupo(gan, nome, T0, q('z', giro));
  no(l, 'punho', cil(0.07, 0.17, 18, true, 0.062), M.luva, [0, -0.1, 0], null, [1, 1, 0.55]); no(l, 'punho_borda', cil(0.073, 0.02, 18), M.luva, [0, -0.015, 0], null, [1, 1, 0.58]);
  no(l, 'palma', esfera(0.064, 16, 10), M.luva, [0, -0.25, 0], null, [1, 1.25, 0.45]);
  [-0.039, -0.013, 0.013, 0.039].forEach((x, i) => { const L = [0.075, 0.09, 0.085, 0.07][i]; no(l, 'dedo', cil(0.0135, L, 10, true), M.luva, [x, -0.325 - L / 2, 0]); no(l, 'ponta', esfera(0.0135, 8, 6), M.luva, [x, -0.325 - L, 0]); });
  no(l, 'polegar', cil(0.015, 0.075, 10), M.luva, [-0.07, -0.26, 0.005], q('z', -35)); return l; };
 luva('luva_a', [-0.015, 0.03, 0.105], 6); luva('luva_b', [0.02, 0.03, 0.125], -8);
 no(gan, 'etiqueta_luvas', plano(0.1, 0.05), M.etiqueta_luvas, [0.0, -0.13, 0.163], q('z', -6));
 no(gan, 'etiqueta_cordao', cil(0.002, 0.13, 6, false), M.cabo_preto, [0.0, -0.06, 0.16]);

 // ---- painel de fusíveis (fundo, à esquerda, no alto), medidor da base da Galeria (ao lado) e procedimento plastificado (fundo, à direita, no alto)
 const pf = grupo(raiz, 'alvo_painel_fusiveis', [-1.55, 1.95, Z0 + 0.02]);
 no(pf, 'caixa', caixa(0.72, 0.8, 0.2), M.tinta_cinza, [0, 0, 0.1]); no(pf, 'frente', plano(0.68, 0.76), M.fusiveis, [0, 0, 0.2015]);
 no(pf, 'dobradica', caixa(0.02, 0.62, 0.03), M.aco, [-0.37, 0, 0.19]);
 const med = grupo(raiz, 'alvo_medidor_galeria', [-0.6, 2.2, Z0 + 0.02]);
 no(med, 'caixa', caixa(0.26, 0.3, 0.1), M.aco_preto, [0, 0, 0.05]); no(med, 'frente', plano(0.25, 0.293), M.medidor, [0, 0, 0.1005]);
 no(med, 'vidro', cil(0.1, 0.012, 24), M.vidro_medidor, [0, 0.025, 0.106], q('x', 90));
 const proc = grupo(raiz, 'alvo_procedimento', [1.75, 2.35, Z0 + 0.02]);
 no(proc, 'placa', caixa(0.33, 0.45, 0.008), M.aco_preto, [0, 0, 0.004]); no(proc, 'folha', plano(0.31, 0.43), M.procedimento, [0, 0, 0.0085]);
 for (const [x, y] of [[-0.14, 0.2], [0.14, 0.2], [-0.14, -0.2], [0.14, -0.2]]) no(proc, 'parafuso', cil(0.008, 0.006, 8), M.cromo, [x, y, 0.012], q('x', 90));

 // ---- lâmpadas antigas amareladas (braço na parede, globo com grade); numa delas, a aranha por dentro
 const lamp = (nome, T0, R) => { const l = grupo(raiz, nome, T0, R);
  no(l, 'braco', cil(0.012, 0.3, 10), M.aco_preto, [0, 0, 0.15], q('x', 90)); no(l, 'soquete', cil(0.035, 0.07, 14), M.aco_preto, [0, -0.04, 0.3]);
  no(l, 'globo', esfera(0.075, 18, 12), M.lampada, [0, -0.135, 0.3]);
  for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2; no(l, 'grade', caixa(0.006, 0.16, 0.006), M.aco_preto, [Math.cos(a) * 0.08, -0.135, 0.3 + Math.sin(a) * 0.08]); }
  no(l, 'grade_anel', cil(0.083, 0.008, 18, false), M.aco_preto, [0, -0.135, 0.3]); return l; };
 const l1 = lamp('alvo_lampadas', [0.55, 2.62, Z0], null); no(l1, 'aranha', esfera(0.012, 8, 6), M.lampada_aranha, [0.02, -0.11, 0.335]);
 lamp('lampada_esquerda', [X0, 2.62, -0.2], q('y', 90));

 // ---- fora: tudo o que sobrou da E02 (paredes de 15 m, teto, distribuidor, baterias...)
 velha.dispose();
 for (const sc of doc.getRoot().listScenes()) if (sc !== cena) sc.dispose();
 for (const n of doc.getRoot().listNodes()) { let p = n, dentro = false; while (p) { if (p === raiz) { dentro = true; break; } p = p.getParentNode(); } if (!dentro && !n.getParentNode()) { n.listChildren().forEach(c => c.dispose()); n.dispose(); } }
 doc.createExtension(KHRDracoMeshCompression).setRequired(true).setEncoderOptions({ method: KHRDracoMeshCompression.EncoderMethod.EDGEBREAKER });
 await doc.transform(prune());
 const bufs = doc.getRoot().listBuffers(); for (const bb of bufs.slice(1)) { for (const a of doc.getRoot().listAccessors()) if (a.getBuffer() === bb) a.setBuffer(bufs[0]); bb.dispose(); }
 for (const ext of doc.getRoot().listExtensionsUsed()) if (ext.extensionName === 'EXT_meshopt_compression') ext.dispose();
 const b = getBounds(cena); console.log('  E02_B caixa (m):', b.min.map(v => v.toFixed(2)).join(','), '→', b.max.map(v => v.toFixed(2)).join(','));
 await io.write(path.join(PEC, 'E02_B.glb'), doc); console.log('ok E02_B', fs.statSync(path.join(PEC, 'E02_B.glb')).size, 'bytes');
}
if (SO.includes('E02_B')) await montarE02B();

// ---- P01_B (revisão 17): Recepção com o que o cartão e as pistas citam. Base: a mesa de recepção P01 (modelo do autor, já em metros: livro de visitas, papéis,
// caneca, luminária, gaveta com crachá). Por código: divisória ao fundo com o relógio de parede elétrico, o quadro de consumo, o e-mail impresso e a folha do Braga;
// telefone e relógio de mesa de corda em cima da mesa; bilhete colado no gaveteiro; roleta de entrada à direita; chapelaria com um paletó à esquerda. Chão em y = 0, frente para +z.
async function montarP01B() {
 const doc = new Document(); const buf = doc.createBuffer(); const cena = doc.createScene('P01_B'); const raiz = doc.createNode('P01_B'); cena.addChild(raiz);
 const pd = await io.read(path.join(PEC, 'P01.glb')), mapa = mergeDocuments(doc, pd), velha = mapa.get(pd.getRoot().listScenes()[0]);
 const { achar, no, grupo, caixa, plano, cil, esfera, q, qm, webp, papel, linhas, F, dial, texEtiqueta, tex, T, M, mat } = await kit(doc, buf);
 const mesa = grupo(raiz, 'mesa_recepcao'); for (const f of velha.listChildren()) { velha.removeChild(f); mesa.addChild(f); }
 // texturas próprias
 const relogioFace = (r, fundo, ponteiros) => `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256"><circle cx="128" cy="128" r="126" fill="${fundo}"/>${Array.from({length: 60}, (_, i) => { const a = i * 6 * Math.PI / 180, l = i % 5 ? 8 : 20; return `<line x1="${128 + Math.sin(a) * 112}" y1="${128 - Math.cos(a) * 112}" x2="${128 + Math.sin(a) * (112 - l)}" y2="${128 - Math.cos(a) * (112 - l)}" stroke="#222" stroke-width="${i % 5 ? 2 : 6}"/>`; }).join('')}${[12,1,2,3,4,5,6,7,8,9,10,11].map((h, i) => `<text x="${128 + Math.sin(i * 30 * Math.PI / 180) * 72}" y="${128 - Math.cos(i * 30 * Math.PI / 180) * 72 + 10}" ${F} font-size="26" fill="#222" text-anchor="middle">${h}</text>`).join('')}${ponteiros}<circle cx="128" cy="128" r="8" fill="#111"/></svg>`;
 mat('relogio_parede_face', [1, 1, 1, 1], 0.35, 0, tex('relogio_parede_face', await webp(relogioFace(0, '#f4f1e8', '<line x1="128" y1="128" x2="128" y2="58" stroke="#111" stroke-width="7"/><line x1="128" y1="128" x2="180" y2="150" stroke="#111" stroke-width="9"/><line x1="128" y1="150" x2="128" y2="34" stroke="#c0302a" stroke-width="3"/>'), 80)));
 mat('relogio_mesa_face', [1, 1, 1, 1], 0.4, 0, tex('relogio_mesa_face', await webp(relogioFace(0, '#efe3c2', '<line x1="128" y1="128" x2="92" y2="70" stroke="#111" stroke-width="7"/><line x1="128" y1="128" x2="128" y2="40" stroke="#111" stroke-width="5"/>'), 80)));
 const barras = [0.82, 0.55, 0.38, 0.66, 0.24];
 mat('quadro_consumo', [1, 1, 1, 1], 0.5, 0.1, tex('quadro_consumo', await webp(`<svg xmlns="http://www.w3.org/2000/svg" width="400" height="320"><rect width="400" height="320" rx="10" fill="#22303a"/><rect x="12" y="12" width="376" height="296" rx="8" fill="#2c3d48" stroke="#13202a" stroke-width="5"/><text x="200" y="48" ${F} font-size="22" fill="#e8e2cc" text-anchor="middle">CONSUMO</text>${barras.map((v, i) => `<rect x="${40 + i * 68}" y="70" width="40" height="200" rx="4" fill="#101a20"/><rect x="${40 + i * 68}" y="${70 + 200 * (1 - v)}" width="40" height="${200 * v}" rx="4" fill="${['#3dd16a', '#3dd16a', '#ffb02a', '#3dd16a', '#3dd16a'][i]}"/><rect x="${36 + i * 68}" y="278" width="48" height="12" fill="#d8d0b4" opacity=".7"/>`).join('')}</svg>`, 80)));
 mat('papel_email', [1, 1, 1, 1], 0.9, 0, tex('papel_email', await webp(papel(256, 340, `<rect x="14" y="14" width="228" height="26" fill="#d8dde6"/>${linhas(18, 64, 11, 24, 210, '#333')}`, '#f7f5ef'), 74)));
 mat('papel_braga', [1, 1, 1, 1], 0.9, 0, tex('papel_braga', await webp(papel(256, 340, `<rect x="160" y="18" width="78" height="96" fill="#8a96a3"/><circle cx="199" cy="54" r="20" fill="#e2c6a6"/><rect x="172" y="76" width="54" height="38" fill="#2c3e5a"/><rect x="194" y="88" width="10" height="14" fill="#f2f2f2"/><rect x="194" y="12" width="12" height="16" fill="#bbb"/>${linhas(18, 40, 3, 24, 130, '#222')}${linhas(18, 140, 7, 24, 210, '#444')}`, '#f3efe2'), 74)));
 mat('bilhete_amarelo', [1, 1, 1, 1], 0.85, 0, tex('bilhete_amarelo', await webp(papel(128, 128, linhas(10, 30, 4, 22, 104, '#1b2a7a'), '#f6dc5a'), 76)));
 mat('cartao_teo', [1, 1, 1, 1], 0.8, 0, tex('cartao_teo', await webp(papel(160, 96, linhas(12, 30, 3, 22, 136, '#203a80'), '#fbf8f0'), 76)));
 M.relogio_parede_face.setAlphaMode('MASK'); M.relogio_mesa_face.setAlphaMode('MASK');
 mat('parede_recepcao', [0.80, 0.77, 0.71, 1], 0.85, 0, T.tinta_gasta); mat('piso_recepcao', [0.30, 0.31, 0.33, 1], 0.6, 0.05, T.tinta_gasta);
 mat('inox', [0.72, 0.73, 0.75, 1], 0.28, 0.9); mat('paleto', [0.11, 0.12, 0.16, 1], 0.8, 0, T.tinta_gasta); mat('baquelite', [0.06, 0.06, 0.07, 1], 0.35, 0);
 mat('visor_verde', [0.25, 0.9, 0.45, 1], 0.4, 0, null, {emis: [0.12, 0.6, 0.25]}); mat('led_verde_r', [0.2, 1, 0.4, 1], 0.4, 0, null, {emis: [0.1, 0.9, 0.3]});
 // piso e divisória ao fundo
 no(raiz, 'piso', caixa(3.4, 0.02, 1.7, 1), M.piso_recepcao, [0, 0.01, -0.05]);
 no(raiz, 'divisoria', caixa(3.4, 2.4, 0.1, 1.5), M.parede_recepcao, [0, 1.2, -0.85]);
 no(raiz, 'divisoria_rodape', caixa(3.4, 0.1, 0.02), M.baquelite, [0, 0.05, -0.79]);
 for (const n of ['base_peca', 'base_peca_linha']) achar(n)?.setTranslation([0, 0.02, 0]);
 mesa.setTranslation([-0.05, 0.02, 0]);
 // relógio de parede elétrico, quadro de consumo, e-mail impresso e folha do Braga na divisória
 const rp = grupo(raiz, 'alvo_relogio_parede', [0.45, 1.9, -0.8]);
 no(rp, 'aro', cil(0.2, 0.05, 32), M.baquelite, [0, 0, 0.025], q('x', 90)); no(rp, 'face', plano(0.36, 0.36), M.relogio_parede_face, [0, 0, 0.052]);
 no(rp, 'fio', cil(0.004, 0.5, 6, false), M.baquelite, [0.12, -0.42, 0.01]);
 const qc = grupo(raiz, 'alvo_quadro_consumo', [-0.55, 1.62, -0.8]);
 no(qc, 'caixa', caixa(0.52, 0.42, 0.06), M.baquelite, [0, 0, 0.03]); no(qc, 'frente', plano(0.5, 0.4), M.quadro_consumo, [0, 0, 0.061]);
 no(raiz, 'alvo_email_impresso', plano(0.21, 0.28), M.papel_email, [-1.05, 1.42, -0.795], q('z', 3));
 no(raiz, 'alvo_guia_retirada', plano(0.21, 0.15), M.papel_email, [0.0, 1.3, -0.795], q('z', -4));
 no(raiz, 'alvo_folha_braga', plano(0.21, 0.28), M.papel_braga, [1.05, 1.45, -0.795], q('z', -2));
 for (const [x, y] of [[-1.05, 1.56], [1.05, 1.59], [0.0, 1.375]]) no(raiz, 'fita', caixa(0.08, 0.02, 0.003), M.fita_adesiva, [x, y, -0.793]);
 // em cima da mesa: telefone, relógio de mesa de corda e o cartão do Téo; bilhete amarelo colado no gaveteiro
 const tel = grupo(raiz, 'alvo_telefone', [0.36, 0.8, 0.06], q('y', -18));
 no(tel, 'base', caixa(0.2, 0.07, 0.22), M.baquelite, [0, 0.035, 0]); no(tel, 'teclado', plano(0.12, 0.1), M.controle, [0, 0.0705, 0.03], q('x', -90));
 no(tel, 'visor', plano(0.1, 0.03), M.visor_verde, [0, 0.0712, -0.05], q('x', -90));
 no(tel, 'fone', caixa(0.06, 0.035, 0.24), M.baquelite, [-0.06, 0.09, 0]); for (const z of [-0.11, 0.11]) no(tel, 'fone_ponta', caixa(0.07, 0.05, 0.06), M.baquelite, [-0.06, 0.085, z]);
 const rm = grupo(raiz, 'alvo_relogio_mesa', [0.6, 0.8, -0.24], q('y', -15));
 no(rm, 'caixa', caixa(0.14, 0.17, 0.07), M.madeira, [0, 0.085, 0]); no(rm, 'face', plano(0.11, 0.11), M.relogio_mesa_face, [0, 0.095, 0.0355]);
 no(rm, 'chave_corda', cil(0.008, 0.04, 8), M.latao, [0, 0.12, -0.05], q('x', 90));
 no(raiz, 'alvo_cartao_teo', plano(0.1, 0.06), M.cartao_teo, [0.12, 0.802, 0.28], qm(q('y', 12), q('x', -90)));
 no(raiz, 'alvo_bilhete_eletricista', plano(0.08, 0.08), M.bilhete_amarelo, [0.33, 0.24, 0.302], q('z', 6));
 // roleta de entrada (tripé) à direita
 const ro = grupo(raiz, 'alvo_roleta', [1.22, 0.02, 0.0]);
 no(ro, 'gabinete', caixa(0.26, 0.92, 0.72), M.inox, [0, 0.46, 0]); no(ro, 'tampo', caixa(0.3, 0.04, 0.76), M.inox, [0, 0.94, 0]);
 no(ro, 'leitor', caixa(0.12, 0.05, 0.16), M.baquelite, [0, 0.985, 0.22]); no(ro, 'leitor_led', caixa(0.06, 0.01, 0.02), M.led_verde_r, [0, 1.012, 0.26]);
 no(ro, 'cubo', cil(0.07, 0.12, 18), M.inox, [-0.16, 0.8, 0.1], q('z', 90));
 const bra = grupo(ro, 'bracos', [-0.2, 0.8, 0.1], q('z', -40));   // tripé: eixo inclinado, um braço sempre na horizontal fechando a passagem
 for (const a of [0, 120, 240]) no(bra, 'braco', cil(0.02, 0.5, 12), M.inox, [0, Math.cos(a * Math.PI / 180) * 0.25, Math.sin(a * Math.PI / 180) * 0.25], q('x', a));
 // chapelaria com o paletó, à esquerda
 const ch = grupo(raiz, 'chapelaria', [-1.3, 0.02, -0.35]);
 no(ch, 'pe', cil(0.2, 0.03, 24), M.baquelite, [0, 0.015, 0]); no(ch, 'haste', cil(0.018, 1.75, 12), M.madeira, [0, 0.89, 0]);
 for (let i = 0; i < 4; i++) { const a = i * 90 * Math.PI / 180; no(ch, 'gancho', cil(0.01, 0.16, 8), M.madeira, [Math.cos(a) * 0.07, 1.68, Math.sin(a) * 0.07], qm(q('y', -i * 90), q('z', 60))); }
 const pal = grupo(ch, 'alvo_paleto', [0, 0, 0.06]);
 no(pal, 'tronco', caixa(0.44, 0.62, 0.11), M.paleto, [0, 1.33, 0.02]); no(pal, 'ombros', cil(0.06, 0.48, 14), M.paleto, [0, 1.63, 0.02], q('z', 90), [1, 1, 0.8]);
 for (const s of [-1, 1]) no(pal, 'manga', cil(0.055, 0.56, 12, true, 0.05), M.paleto, [s * 0.24, 1.36, 0.02]);
 no(pal, 'camisa', caixa(0.09, 0.2, 0.008), M.parede_recepcao, [0, 1.54, 0.078]);
 for (const s2 of [-1, 1]) no(pal, 'lapela', caixa(0.06, 0.24, 0.012), M.paleto, [s2 * 0.045, 1.52, 0.084], q('z', s2 * 14)); no(pal, 'bolso', caixa(0.1, 0.012, 0.01), M.baquelite, [0.12, 1.44, 0.081]);
 velha.dispose(); for (const sc of doc.getRoot().listScenes()) if (sc !== cena) sc.dispose();
 doc.createExtension(KHRDracoMeshCompression).setRequired(true).setEncoderOptions({ method: KHRDracoMeshCompression.EncoderMethod.EDGEBREAKER });
 await doc.transform(prune());
 const bufs = doc.getRoot().listBuffers(); for (const bb of bufs.slice(1)) { for (const a of doc.getRoot().listAccessors()) if (a.getBuffer() === bb) a.setBuffer(bufs[0]); bb.dispose(); }
 for (const ext of doc.getRoot().listExtensionsUsed()) if (ext.extensionName === 'EXT_meshopt_compression') ext.dispose();
 const b = getBounds(cena); console.log('  P01_B caixa (m):', b.min.map(v => v.toFixed(2)).join(','), '→', b.max.map(v => v.toFixed(2)).join(','));
 await io.write(path.join(PEC, 'P01_B.glb'), doc); console.log('ok P01_B', fs.statSync(path.join(PEC, 'P01_B.glb')).size, 'bytes');
}
if (SO.includes('P01_B')) await montarP01B();

// ---- S01_B (revisão 17): Central de monitoramento com o que o cartão e as pistas citam. Base: S01 (Meshy, do autor), posta em tamanho real (x3: mesas a ~0,8 m,
// anel de ~5,7 m) com o chão em y = 0. Por código: o cofre pequeno do Braga (com o bilhete preso), as duas xícaras de café na mesa do Braga, o livro de ronda,
// o livro da Central, a escala de crachás e o gaveteiro do Braga. Tudo dentro da caixa da S01 (os lugares dos pontos tirados da tela valem para as duas).
// A textura de relevo da S01 é regravada a 768 px para a peça caber em 800 KB.
async function montarS01B() {
 const doc = new Document(); const buf = doc.createBuffer(); const cena = doc.createScene('S01_B'); const raiz = doc.createNode('S01_B'); cena.addChild(raiz);
 const pd = await io.read(path.join(PEC, 'S01.glb')), mapa = mergeDocuments(doc, pd), velha = mapa.get(pd.getRoot().listScenes()[0]);
 const { no, grupo, caixa, plano, cil, esfera, q, qm, webp, papel, linhas, F, tex, T, M, mat } = await kit(doc, buf);
 const E = 3, cen = doc.createNode('central').setScale([E, E, E]).setTranslation([0, 0.45 * E, 0]); raiz.addChild(cen);
 for (const f of velha.listChildren()) { velha.removeChild(f); cen.addChild(f); }
 for (const t of doc.getRoot().listTextures()) { const usoN = doc.getRoot().listMaterials().some(m => m.getNormalTexture() === t); if (usoN && t.getImage().byteLength > 150000) t.setImage(await sharp(Buffer.from(t.getImage())).resize(768, 768).webp({ quality: 82 }).toBuffer()).setMimeType('image/webp'); }
 mat('cofre_tinta', [0.16, 0.18, 0.2, 1], 0.45, 0.6, T.tinta_gasta); mat('porcelana', [0.93, 0.92, 0.88, 1], 0.25, 0); mat('cafe', [0.18, 0.09, 0.04, 1], 0.15, 0);
 mat('capa_livro', [0.12, 0.2, 0.36, 1], 0.6, 0, T.tinta_gasta); mat('capa_ronda', [0.45, 0.1, 0.08, 1], 0.6, 0, T.tinta_gasta); mat('miolo_livro', [0.92, 0.89, 0.8, 1], 0.9, 0);
 mat('papel_escala', [1, 1, 1, 1], 0.9, 0, tex('papel_escala', await webp(papel(256, 340, `<text x="128" y="30" ${F} font-size="20" fill="#222" text-anchor="middle">ESCALA</text>${Array.from({length: 9}, (_, i) => `<rect x="16" y="${48 + i*31}" width="224" height="26" fill="none" stroke="#999"/>`).join('')}${linhas(24, 66, 9, 31, 190, '#1d2a6a')}`, '#f6f3ea'), 74)));
 mat('bilhete_cofre', [1, 1, 1, 1], 0.85, 0, tex('bilhete_cofre', await webp(papel(128, 128, linhas(10, 34, 4, 22, 104, '#222'), '#fff7c0'), 76)));
 // cofre pequeno no chão, à esquerda, com o bilhete preso na porta
 const cf = grupo(raiz, 'alvo_cofre', [-0.86, 0.12, 1.0], q('y', 18));
 no(cf, 'corpo', caixa(0.42, 0.44, 0.4), M.cofre_tinta, [0, 0.22, 0]); no(cf, 'porta', caixa(0.36, 0.38, 0.02), M.cofre_tinta, [0, 0.22, 0.205]);
 no(cf, 'segredo', cil(0.05, 0.03, 20), M.cromo, [0.06, 0.26, 0.225], q('x', 90)); no(cf, 'macaneta', caixa(0.02, 0.1, 0.03), M.cromo, [0.12, 0.17, 0.225]);
 no(cf, 'alvo_bilhete_cofre', plano(0.1, 0.1), M.bilhete_cofre, [-0.09, 0.3, 0.2165], q('z', 7));
 // gaveteiro do Braga no chão, à direita
 const gv = grupo(raiz, 'alvo_gaveta_braga', [0.9, 0.12, 0.98], q('y', -15));
 no(gv, 'corpo', caixa(0.4, 0.55, 0.45), M.tinta_cinza, [0, 0.275, 0]);
 for (const [y, h] of [[0.43, 0.14], [0.24, 0.2]]) { no(gv, 'gaveta', caixa(0.36, h - 0.02, 0.02), M.tinta_cinza, [0, y, 0.23]); no(gv, 'puxador', caixa(0.12, 0.02, 0.025), M.cromo, [0, y + h * 0.2, 0.25]); }
 // em cima das mesas: as duas xícaras (mesa do Braga, à direita), o livro de ronda (esquerda), o livro da Central e a escala de crachás (meio)
 const xic = (nome, T0, cheia) => { const x = grupo(raiz, nome, T0); no(x, 'pires', cil(0.06, 0.008, 20), M.porcelana, [0, 0.004, 0]); no(x, 'xicara', cil(0.04, 0.07, 20, true, 0.032), M.porcelana, [0, 0.043, 0]);
  if (cheia) no(x, 'cafe', cil(0.037, 0.004, 18), M.cafe, [0, 0.074, 0]); no(x, 'asa', caixa(0.012, 0.035, 0.03), M.porcelana, [0.048, 0.045, 0]); return x; };
 const xs = grupo(raiz, 'alvo_xicaras'); xs.addChild(xic('xicara_morna', [1.22, 0.8, 0.1], true)); xs.addChild(xic('xicara_fria', [1.42, 0.795, 0.2], false));
 const livro = (nome, T0, giro, capa) => { const l = grupo(raiz, nome, T0, q('y', giro)); no(l, 'capa', caixa(0.24, 0.035, 0.32), capa, [0, 0.0175, 0]); no(l, 'miolo', caixa(0.23, 0.028, 0.3), M.miolo_livro, [0.006, 0.0175, 0]); return l; };
 livro('alvo_livro_ronda', [-1.15, 0.818, -0.1], 25, M.capa_ronda); livro('alvo_livro_central', [-0.18, 0.825, -0.22], -8, M.capa_livro);
 no(raiz, 'alvo_escala_cracha', plano(0.21, 0.28), M.papel_escala, [0.22, 0.826, -0.2], qm(q('y', 10), q('x', -90)));
 velha.dispose(); for (const sc of doc.getRoot().listScenes()) if (sc !== cena) sc.dispose();
 doc.createExtension(KHRDracoMeshCompression).setRequired(true).setEncoderOptions({ method: KHRDracoMeshCompression.EncoderMethod.EDGEBREAKER });
 await doc.transform(prune());
 const bufs = doc.getRoot().listBuffers(); for (const bb of bufs.slice(1)) { for (const a of doc.getRoot().listAccessors()) if (a.getBuffer() === bb) a.setBuffer(bufs[0]); bb.dispose(); }
 for (const ext of doc.getRoot().listExtensionsUsed()) if (ext.extensionName === 'EXT_meshopt_compression') ext.dispose();
 const b = getBounds(cena); console.log('  S01_B caixa (m):', b.min.map(v => v.toFixed(2)).join(','), '→', b.max.map(v => v.toFixed(2)).join(','));
 await io.write(path.join(PEC, 'S01_B.glb'), doc); console.log('ok S01_B', fs.statSync(path.join(PEC, 'S01_B.glb')).size, 'bytes');
}
if (SO.includes('S01_B')) await montarS01B();
