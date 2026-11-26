// Cabine de viagem no tempo (T02): peça ORIGINAL do Loop, gerada por código (caixas e cilindros), tamanho real (~2,7 m de altura).
// Uso: node gerar-cabine.mjs saida.glb      (rodar da pasta do gltf-transform)
import { Document, NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import fs from 'fs'; import path from 'path';
const SAIDA = process.argv[2] || 'T02.glb', REL = path.join(path.dirname(new URL(import.meta.url).pathname), 'relogio.png');
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
const doc = new Document(), buf = doc.createBuffer(), cena = doc.createScene('cabine');
const M = {};
const mat = (n, cor, rug, met, alfa = 1, em) => { const m = doc.createMaterial(n).setBaseColorFactor([...cor, alfa]).setRoughnessFactor(rug).setMetallicFactor(met); if (alfa < 1) m.setAlphaMode('BLEND'); if (em) m.setEmissiveFactor(em); return M[n] = m; };
mat('madeira', [.20, .04, .07], .55, .1); mat('latao', [.86, .64, .22], .32, .9); mat('vidro', [.62, .85, .95], .1, 0, .28); mat('base', [.12, .12, .15], .6, .3);
mat('anel', [.1, .9, .85], .3, 0, 1, [.1, 1, .9]); mat('luz', [1, .95, .7], .3, 0, 1, [1, .9, .55]);
const tex = doc.createTexture('relogio').setImage(fs.readFileSync(REL)).setMimeType('image/png');
M.relogio = doc.createMaterial('relogio').setBaseColorTexture(tex).setRoughnessFactor(.5);
const raiz = doc.createNode('cabine'); cena.addChild(raiz);
function malha(nome, m, P, N, I, UV) {
 const a = (t, arr) => doc.createAccessor().setType(t).setArray(arr).setBuffer(buf);
 const pr = doc.createPrimitive().setAttribute('POSITION', a('VEC3', new Float32Array(P))).setAttribute('NORMAL', a('VEC3', new Float32Array(N))).setIndices(a('SCALAR', new Uint16Array(I))).setMaterial(m);
 if (UV) pr.setAttribute('TEXCOORD_0', a('VEC2', new Float32Array(UV)));
 const nd = doc.createNode(nome).setMesh(doc.createMesh(nome).addPrimitive(pr)); raiz.addChild(nd); return nd;
}
function caixa(nome, m, [w, h, d], [x, y, z]) { // y = base
 const hw = w/2, hd = d/2, P = [], N = [], I = [];
 const f = [[[0,0,1],[[-hw,0,hd],[hw,0,hd],[hw,h,hd],[-hw,h,hd]]],[[0,0,-1],[[hw,0,-hd],[-hw,0,-hd],[-hw,h,-hd],[hw,h,-hd]]],[[1,0,0],[[hw,0,hd],[hw,0,-hd],[hw,h,-hd],[hw,h,hd]]],[[-1,0,0],[[-hw,0,-hd],[-hw,0,hd],[-hw,h,hd],[-hw,h,-hd]]],[[0,1,0],[[-hw,h,hd],[hw,h,hd],[hw,h,-hd],[-hw,h,-hd]]],[[0,-1,0],[[-hw,0,-hd],[hw,0,-hd],[hw,0,hd],[-hw,0,hd]]]];
 f.forEach(([n, vs], i) => { vs.forEach(v => { P.push(v[0] + x, v[1] + y, v[2] + z); N.push(...n); }); I.push(i*4, i*4+1, i*4+2, i*4, i*4+2, i*4+3); });
 return malha(nome, m, P, N, I);
}
function cil(nome, m, r, h, [x, y, z], eixo = 'y', seg = 32, comTampa = true, UV = false) { // cilindro; eixo 'y' (em pé) ou 'z' (deitado, tampas viradas para +z/-z)
 const P = [], N = [], I = [], U = [];
 const pt = (a, hh, rr) => eixo === 'y' ? [Math.cos(a) * rr, hh, Math.sin(a) * rr] : [Math.cos(a) * rr, Math.sin(a) * rr, hh];
 const nr = (a) => eixo === 'y' ? [Math.cos(a), 0, Math.sin(a)] : [Math.cos(a), Math.sin(a), 0];
 for (let i = 0; i <= seg; i++) { const a = i / seg * Math.PI * 2; P.push(...pt(a, 0, r), ...pt(a, h, r)); N.push(...nr(a), ...nr(a)); }
 for (let i = 0; i < seg; i++) { const k = i * 2; I.push(k, k+1, k+3, k, k+3, k+2); }
 if (comTampa) for (const [hh, s] of [[h, 1], [0, -1]]) { const b = P.length / 3, nn = eixo === 'y' ? [0, s, 0] : [0, 0, s];
  P.push(...pt(0, hh, 0)); N.push(...nn); U.push(.5, .5); for (let i = 0; i <= seg; i++) { const a = i / seg * Math.PI * 2; P.push(...pt(a, hh, r)); N.push(...nn); U.push(.5 + Math.cos(a) * .5, .5 - Math.sin(a) * .5); }
  for (let i = 0; i < seg; i++) s > 0 ? I.push(b, b + 1 + i, b + 2 + i) : I.push(b, b + 2 + i, b + 1 + i); }
 const total = P.length / 3; const uv = UV ? [].concat(...Array.from({ length: (seg + 1) * 2 }, () => [0, 0]), U) : null;
 const PP = P.map((v, i) => v + [x, y, z][i % 3]);
 return malha(nome, m, PP, N, I, uv && uv.length === total * 2 ? uv : null);
}
function toro(nome, m, R, r, [x, y, z], seg = 48, lado = 16) {
 const P = [], N = [], I = [];
 for (let i = 0; i <= seg; i++) for (let j = 0; j <= lado; j++) { const u = i / seg * Math.PI * 2, v = j / lado * Math.PI * 2;
  const cx = Math.cos(u) * R, cz = Math.sin(u) * R; P.push(x + (R + r * Math.cos(v)) * Math.cos(u), y + r * Math.sin(v), z + (R + r * Math.cos(v)) * Math.sin(u)); N.push(Math.cos(v) * Math.cos(u), Math.sin(v), Math.cos(v) * Math.sin(u)); }
 for (let i = 0; i < seg; i++) for (let j = 0; j < lado; j++) { const a = i * (lado + 1) + j, b = a + lado + 1; I.push(a, b, a + 1, a + 1, b, b + 1); }
 return malha(nome, m, P, N, I);
}
// ---- medidas (m): cabine 1,3 x 1,3, altura do corpo 2,3 m + telhado em cúpula + relógio
const W = 1.3, H0 = .12, HC = 2.3, PO = .09, MW = W / 2 - PO / 2;
caixa('plinto', M.base, [W + .5, H0, W + .5], [0, 0, 0]);
toro('anel_luz', M.anel, W * .72, .035, [0, H0 + .04, 0]);
for (const sx of [-1, 1]) for (const sz of [-1, 1]) caixa('pilar', M.latao, [PO, HC, PO], [sx * MW, H0, sz * MW]);
caixa('rodape', M.madeira, [W, .85, W - .02], [0, H0, 0]);                                   // parte de baixo, em madeira
caixa('vidro_corpo', M.vidro, [W - .06, HC - .85 - .1, W - .06], [0, H0 + .85, 0]);           // vidro de cima
for (const k of [1, 2]) for (const s of [-1, 1]) { caixa('travessa_x', M.latao, [W, .035, .035], [0, H0 + .85 + k * (HC - .85) / 3, s * MW]); caixa('travessa_z', M.latao, [.035, .035, W], [s * MW, H0 + .85 + k * (HC - .85) / 3, 0]); }
for (const s of [-1, 1]) { caixa('montante_x', M.latao, [.035, HC - .85, .035], [0, H0 + .85, s * MW]); caixa('montante_z', M.latao, [.035, HC - .85, .035], [s * MW, H0 + .85, 0]); }
caixa('luz_interna', M.luz, [.25, .5, .25], [0, H0 + .5, 0]);                               // luz acesa por dentro
caixa('cornija', M.latao, [W + .16, .1, W + .16], [0, H0 + HC, 0]);
caixa('teto', M.madeira, [W + .08, .12, W + .08], [0, H0 + HC + .1, 0]);
// cúpula achatada (calota): cilindro curto + disco menor
cil('calota_base', M.latao, W * .46, .1, [0, H0 + HC + .22, 0]); cil('calota_topo', M.latao, W * .3, .1, [0, H0 + HC + .32, 0]);
cil('pino', M.latao, .03, .28, [0, H0 + HC + .42, 0]); cil('esfera_luz', M.luz, .07, .1, [0, H0 + HC + .68, 0]);
// relógio redondo nas quatro faces do teto
for (const [rx, rz, ang] of [[0, 1, 0], [0, -1, Math.PI], [1, 0, Math.PI / 2], [-1, 0, -Math.PI / 2]]) {
 const nd = cil('relogio', M.relogio, .27, .05, [0, 0, 0], 'z', 40, true, true);
 nd.setTranslation([rx * (W / 2 + .05), H0 + HC + .15 + .0, rz * (W / 2 + .05)]).setRotation([0, Math.sin(ang / 2), 0, Math.cos(ang / 2)]);
}
// engrenagens decorativas nas laterais (discos de latão)
for (const [s, z] of [[-1, -.3], [1, .3]]) { const nd = cil('engrenagem', M.latao, .16, .04, [0, 0, 0], 'z', 14, true); nd.setTranslation([s * (W / 2 + .04) + 0, H0 + 1.5, z]).setRotation([0, Math.SQRT1_2, 0, Math.SQRT1_2]); }
await io.write(SAIDA, doc); console.log('ok', SAIDA, fs.statSync(SAIDA).size);
