// Museu novo, em caixas: cada sala é uma caixa (laje + paredes baixas + pedestal + peça) e a fachada é outra caixa separada.
// Uso (na pasta do gltf-transform): node gerar.mjs ../pecas saida.glb
import { Document, NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS, KHRDracoMeshCompression } from '@gltf-transform/extensions';
import { getBounds, mergeDocuments, prune } from '@gltf-transform/functions';
import draco3d from 'draco3dgltf';
import { MeshoptDecoder } from 'meshoptimizer';
import fs from 'fs'; import path from 'path';
const [,, PECAS = '../pecas', SAIDA = 'museu-novo.glb'] = process.argv;
// [peça, tamanho: G grande / M médio / P pequeno]  — por andar, na ordem das salas do jogo (2º, 1º, térreo)
const G = 0.095, M = 0.06, P = 0.036;
// 5 andares x 6 salas (2 colunas x 3 fileiras). De cima para baixo: 5º andar primeiro.
const PECAS_ORDEM = [['D01','G'],['D02','G'],['N14','G'],['N01','P'],['N15','M'],['CERA','G'],
 ['N02','M'],['F01','M'],['C01','M'],['D08','G'],['F02','M'],['N03','P'],
 ['N04','M'],['N05','M'],['D09','M'],['B09','M'],['B02','M'],['N06','M'],
 ['N12','M'],['B01','M'],['B04','M'],['S01','M'],['L01','M'],['L02','M'],
 ['N07','P'],['L03','M'],['N11','P'],['B05','G'],['N09','P'],['M01','M']];
const ANDARES = [4,3,2,1,0].map(a => [a === 0 ? 'T' : String(a), PECAS_ORDEM.slice((4 - a) * 6, (4 - a) * 6 + 6)]);
const TAM = { G, M, P };
const AGENCIA = process.argv[4] || '../../../biblioteca/dragon/jogos/a-manha-do-carro-forte/o-impostor/modelos/agencia-0688-base.glb';
const ESC = 0.025;                         // 1 m do prédio = 2,5 cm de maquete
const COLS = 2, LINHAS = 3, ESP = 0.004, PED = 0.022;
const X0 = -8.2, X1 = 4.2, Z0 = -6.0, Z1 = 6.2;           // área interna do prédio (m)
const NIVEL = [0.4, 4.0, 7.7, 11.4, 15.1];                   // altura de cada andar (m)
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({
 'draco3d.decoder': await draco3d.createDecoderModule(), 'draco3d.encoder': await draco3d.createEncoderModule(), 'meshopt.decoder': MeshoptDecoder });
await MeshoptDecoder.ready;
const doc = new Document(); const buf = doc.createBuffer(); const cena = doc.createScene('museu');
const mats = {};
function mat(nome, cor, rug = .8, met = 0, alfa = 1) { if (!mats[nome]) { const m = doc.createMaterial(nome).setBaseColorFactor([...cor, alfa]).setRoughnessFactor(rug).setMetallicFactor(met); if (alfa < 1) m.setAlphaMode('BLEND'); mats[nome] = m; } return mats[nome]; }
function caixa(nome, m, [w, h, d], [x, y, z]) { // caixa com base em y (y = parte de baixo)
 const hw = w/2, hd = d/2; const P_ = [], N = [], I = [];
 const faces = [[[0,0,1],[[-hw,0,hd],[hw,0,hd],[hw,h,hd],[-hw,h,hd]]],[[0,0,-1],[[hw,0,-hd],[-hw,0,-hd],[-hw,h,-hd],[hw,h,-hd]]],[[1,0,0],[[hw,0,hd],[hw,0,-hd],[hw,h,-hd],[hw,h,hd]]],[[-1,0,0],[[-hw,0,-hd],[-hw,0,hd],[-hw,h,hd],[-hw,h,-hd]]],[[0,1,0],[[-hw,h,hd],[hw,h,hd],[hw,h,-hd],[-hw,h,-hd]]],[[0,-1,0],[[-hw,0,-hd],[hw,0,-hd],[hw,0,hd],[-hw,0,hd]]]];
 faces.forEach(([n, vs], i) => { vs.forEach(v => { P_.push(...v); N.push(...n); }); I.push(i*4, i*4+1, i*4+2, i*4, i*4+2, i*4+3); });
 const pos = doc.createAccessor().setType('VEC3').setArray(new Float32Array(P_)).setBuffer(buf);
 const nor = doc.createAccessor().setType('VEC3').setArray(new Float32Array(N)).setBuffer(buf);
 const ind = doc.createAccessor().setType('SCALAR').setArray(new Uint16Array(I)).setBuffer(buf);
 const pr = doc.createPrimitive().setAttribute('POSITION', pos).setAttribute('NORMAL', nor).setIndices(ind).setMaterial(m);
 return doc.createNode(nome).setMesh(doc.createMesh(nome).addPrimitive(pr)).setTranslation([x, y, z]);
}
const PALETA = [[.93,.88,.78],[.85,.9,.82],[.82,.87,.94],[.94,.84,.82],[.9,.86,.93],[.95,.92,.78]];

// ----- sala: caixa própria (laje + paredes baixas com vão de porta + pedestal + peça). Medidas em metros do prédio; tudo no nó 'mundo' (escala ESC)
const torre = doc.createNode('torre').setScale([ESC, ESC, ESC]); cena.addChild(torre);
const grupo = []; for (let k = 0; k < 5; k++) { grupo[k] = doc.createNode('andar_' + k); torre.addChild(grupo[k]); }
const RW = (X1 - X0 - 0.3) / COLS, RD = (Z1 - Z0 - 0.4) / LINHAS;   // tamanho de cada sala (m)
let n = 0;
for (let a = 0; a < ANDARES.length; a++) {
 const [rot, lista] = ANDARES[a]; const pre = rot === 'T' ? '' : 'A' + rot + '_'; const y0 = NIVEL[4 - a];
 for (let i = 0; i < lista.length; i++) {
  const [id, cl] = lista[i]; const c = i % COLS, l = Math.floor(i / COLS);
  const cx = X0 + RW / 2 + c * (RW + 0.3), cz = Z0 + RD / 2 + l * (RD + 0.2);
  const sala = doc.createNode('sala_' + id).setTranslation([cx, y0, cz]); grupo[4 - a].addChild(sala);
  const k = 1 / ESC; // caixa() recebe medidas em m do prédio; pedestal/peça em unidades de maquete são convertidos por k
  sala.addChild(caixa('laje', mat(pre + 'laje' + (n % PALETA.length), PALETA[n % PALETA.length], .9), [RW, .25, RD], [0, 0, 0]));
  const mp = mat(pre + 'parede', [.97,.96,.93], .95), HW = RW / 2, HD = RD / 2, VG = 1.3, PA = 1.5, T = .15;
  for (const s of [-1, 1]) {
   const Lx = HW - VG / 2, Lz = HD - VG / 2;
   sala.addChild(caixa('p', mp, [Lx, PA, T], [s * (VG / 2 + Lx / 2), .25, HD - T / 2])); sala.addChild(caixa('p', mp, [Lx, PA, T], [s * (VG / 2 + Lx / 2), .25, -HD + T / 2]));
   sala.addChild(caixa('p', mp, [T, PA, Lz], [HW - T / 2, .25, s * (VG / 2 + Lz / 2)])); sala.addChild(caixa('p', mp, [T, PA, Lz], [-HW + T / 2, .25, s * (VG / 2 + Lz / 2)]));
  }
  const ped = 1.0; // pedestal de 1 m de altura no prédio
  const arq = path.join(PECAS, id + '.glb'); if (!fs.existsSync(arq)) { console.log('falta', id); n++; continue; }
  const pd = await io.read(arq);
  for (const nd of pd.getRoot().listNodes()) { const inst = nd.getExtension('EXT_mesh_gpu_instancing'); if (!inst) continue;
   const T_ = inst.getAttribute('TRANSLATION'), R_ = inst.getAttribute('ROTATION'), S_ = inst.getAttribute('SCALE'), ct = (T_ || R_ || S_).getCount(), mesh = nd.getMesh();
   for (let q = 0; q < ct; q++) { const f = pd.createNode(nd.getName() + '_i' + q).setMesh(mesh); if (T_) f.setTranslation(T_.getElement(q,[0,0,0])); if (R_) f.setRotation(R_.getElement(q,[0,0,0,1])); if (S_) f.setScale(S_.getElement(q,[0,0,0])); nd.addChild(f); }
   nd.setMesh(null); nd.setExtension('EXT_mesh_gpu_instancing', null); }
  const b = getBounds(pd.getRoot().listScenes()[0]); const sx = b.max[0]-b.min[0], sy = b.max[1]-b.min[1], sz = b.max[2]-b.min[2];
  const alvoM = TAM[cl] / ESC;                       // maior lado da peça, em metros do prédio
  // AUDITORIA 23/11: toda peça cabe na menor sala (qualquer peça pode cair em qualquer sala): largura <= LMAX, profundidade <= PMAX, altura <= HMAX
  const LMAX = 5.0, PMAX = 3.3, HMAX = 2.3;
  const e = Math.min(alvoM / Math.max(sx, sz, sy * 1.2), LMAX / sx, PMAX / sz, HMAX / sy);
  sala.addChild(caixa('pedestal', mat(pre + 'pedestal', [.18,.2,.24], .5, .2), [Math.min(Math.max(sx * e + .5, 1.8), LMAX + .5), ped, Math.min(Math.max(sz * e + .5, 1.8), PMAX + .4)], [0, .25, 0]));
  const mx = (b.min[0]+b.max[0])/2, mz = (b.min[2]+b.max[2])/2;
  const mapa = mergeDocuments(doc, pd); const nova = mapa.get(pd.getRoot().listScenes()[0]);
  const raiz = doc.createNode('peca_' + id).setScale([e,e,e]).setTranslation([-mx*e, .25 + ped - b.min[1]*e, -mz*e]);
  for (const f of nova.listChildren()) { nova.removeChild(f); raiz.addChild(f); } nova.dispose(); sala.addChild(raiz);
  raiz.traverse(nd => { const m = nd.getMesh(); if (m) for (const p of m.listPrimitives()) { const mt = p.getMaterial(); if (mt) mt.setName(pre + 'peca_' + id + '_' + mt.getName()); } });
  n++;
 }
}
// ----- letreiro "Museu Mosaico" sobre o telhado (grupo do 4º andar, some junto com a fachada)
{ const tex = doc.createTexture('letreiro').setImage(fs.readFileSync(path.join(path.dirname(process.argv[1]), 'letreiro.png'))).setMimeType('image/png');
  const mL = doc.createMaterial('letreiro').setBaseColorTexture(tex).setEmissiveTexture(tex).setEmissiveFactor([1, 1, 1]).setRoughnessFactor(.6).setMetallicFactor(0);
  const LW = 14, LH = LW * 320 / 2048, LY = 19.7, LZ = 4.6, LX = -2;
  const quad = (z, n, flip) => { const xs = flip ? [LW/2, -LW/2] : [-LW/2, LW/2];
   const P_ = [xs[0], LY, z, xs[1], LY, z, xs[1], LY + LH, z, xs[0], LY + LH, z], UV = [0, 1, 1, 1, 1, 0, 0, 0];
   const pos = doc.createAccessor().setType('VEC3').setArray(new Float32Array(P_)).setBuffer(buf), nor = doc.createAccessor().setType('VEC3').setArray(new Float32Array([0,0,n, 0,0,n, 0,0,n, 0,0,n])).setBuffer(buf),
    uv = doc.createAccessor().setType('VEC2').setArray(new Float32Array(UV)).setBuffer(buf), ind = doc.createAccessor().setType('SCALAR').setArray(new Uint16Array([0,1,2,0,2,3])).setBuffer(buf);
   const pr = doc.createPrimitive().setAttribute('POSITION', pos).setAttribute('NORMAL', nor).setAttribute('TEXCOORD_0', uv).setIndices(ind).setMaterial(mL);
   return doc.createNode('fachada_4_letreiro_' + (n > 0 ? 'frente' : 'costas')).setMesh(doc.createMesh('letreiro' + n).addPrimitive(pr)).setTranslation([LX, 0, 0]); };
  const mB = mat('letreiro_base', [.07, .07, .09], .5, .3);
  const corpo = caixa('fachada_4_letreiro_corpo', mB, [LW, LH, .3], [LX, LY, LZ]);
  const q1 = quad(LZ + .16, 1, false), q2 = quad(LZ - .16, -1, true);
  const base = caixa('fachada_4_letreiro_pe', mB, [LW * .8, LY - 18.8, .6], [LX, 18.8, LZ]);
  for (const nd of [corpo, base]) grupo[4].addChild(nd);
  for (const q of [q1, q2]) grupo[4].addChild(q); }
// ----- segredos da noite (cópias próprias): cofre e caixa de luz (quadro elétrico), no térreo
const EXTRAS = [['COFRE', '/home/claude/lab-ra/biblioteca/dragon/jogos/o-eco-do-amanha/o-impostor/modelos/pecas/rec-cofre-balanca.glb', 2.0, [-3.4, 0.4, 11.2], Math.PI],
 ['CAIXA_LUZ', '/home/claude/lab-ra/biblioteca/dragon/jogos/o-eco-do-amanha/o-impostor/modelos/pecas/rec-quadro-eletrico.glb', 2.2, [-12.2, 0.4, 1.5], Math.PI / 2]];
for (const [eid, earq, alt, pos, ry] of EXTRAS) {
 const pd = await io.read(earq);
 for (const nd of pd.getRoot().listNodes()) { const inst = nd.getExtension('EXT_mesh_gpu_instancing'); if (!inst) continue;
  const T_ = inst.getAttribute('TRANSLATION'), R_ = inst.getAttribute('ROTATION'), S_ = inst.getAttribute('SCALE'), ct = (T_ || R_ || S_).getCount(), mesh = nd.getMesh();
  for (let q = 0; q < ct; q++) { const f = pd.createNode(nd.getName() + '_i' + q).setMesh(mesh); if (T_) f.setTranslation(T_.getElement(q,[0,0,0])); if (R_) f.setRotation(R_.getElement(q,[0,0,0,1])); if (S_) f.setScale(S_.getElement(q,[0,0,0])); nd.addChild(f); }
  nd.setMesh(null); nd.setExtension('EXT_mesh_gpu_instancing', null); }
 const b = getBounds(pd.getRoot().listScenes()[0]); const e = alt / (b.max[1] - b.min[1]);
 const mx = (b.min[0]+b.max[0])/2, mz = (b.min[2]+b.max[2])/2;
 const mapa = mergeDocuments(doc, pd); const nova = mapa.get(pd.getRoot().listScenes()[0]);
 const c = Math.cos(ry/2), s_ = Math.sin(ry/2);
 const raiz = doc.createNode('segredo_' + eid).setScale([e,e,e]).setRotation([0, s_, 0, c]).setTranslation([pos[0], pos[1] - b.min[1]*e, pos[2]]);
 for (const f of nova.listChildren()) { nova.removeChild(f); raiz.addChild(f); } nova.dispose(); grupo[0].addChild(raiz);
 raiz.traverse(nd => { const m = nd.getMesh(); if (m) for (const p of m.listPrimitives()) { const mt = p.getMaterial(); if (mt) mt.setName('segredo_' + eid + '_' + mt.getName()); } });
 console.log('segredo', eid, 'esc', e.toFixed(3));
}
// ----- fachada: a agência 0688 (prédio preto do carro-forte), empilhada em 5 andares. Caixa à parte, nó 'fachada'.
const ag = await io.read(AGENCIA);
const mapaA = mergeDocuments(doc, ag); const cenaA = mapaA.get(ag.getRoot().listScenes()[0]);
const raizA = cenaA.listChildren()[0]; const porNome = {}; raizA.listChildren().forEach(c => porNome[c.getName()] = c);
const clona = (no, dy, k) => { const f = doc.createNode('fachada_' + k + '_' + no.getName()).setMesh(no.getMesh()); const t = no.getTranslation(); f.setTranslation([t[0], t[1] + dy, t[2]]); f.setRotation(no.getRotation()); f.setScale(no.getScale()); grupo[k].addChild(f); };
for (const nm of ['agencia', 'porta-giratoria']) if (porNome[nm]) clona(porNome[nm], 0, 0);
for (let i = 1; i < 5; i++) if (porNome['porta-giratoria']) clona(porNome['porta-giratoria'], i * 3.7, i);   // vidro redondo repetido em todos os andares
const ALT_P = 3.7; for (let i = 0; i < 4; i++) clona(porNome['piso-2'], i * ALT_P, i + 1);
clona(porNome['telhado'], 3 * ALT_P, 4);
// canto arredondado com vidro (vidro + esquadrias do térreo) repetido nos andares 1..4
{ const ag0 = porNome['agencia'], mAg = ag0.getMesh(), mv = doc.createMesh('canto_vidro');
  for (const p of mAg.listPrimitives()) { const mn = p.getMaterial() && p.getMaterial().getName(); if (mn !== 'vidro' && mn !== 'aco-escuro') continue;
   const q = doc.createPrimitive().setMode(p.getMode()).setMaterial(p.getMaterial()); for (const sem of p.listSemantics()) q.setAttribute(sem, p.getAttribute(sem)); if (p.getIndices()) q.setIndices(p.getIndices()); mv.addPrimitive(q); }
  const t = ag0.getTranslation(), sc = ag0.getScale(), FY = 0.85, yb = -7436 / 32767;   // altura menor: pé-direito dos andares é 3,7 m
  for (let k = 1; k < 5; k++) { const base = 4.0 + (k - 1) * ALT_P + 0.1;
   const f = doc.createNode('fachada_' + k + '_canto_vidro').setMesh(mv).setTranslation([t[0], base - yb * sc[1] * FY, t[2]]).setRotation(ag0.getRotation()).setScale([sc[0], sc[1] * FY, sc[2]]); grupo[k].addChild(f); } }
cenaA.removeChild(raizA);   // o resto do quarteirão fica sem cena e é limpo pelo prune
doc.createExtension(KHRDracoMeshCompression).setRequired(true).setEncoderOptions({ method: KHRDracoMeshCompression.EncoderMethod.EDGEBREAKER });
for (const sc of doc.getRoot().listScenes()) if (sc !== cena) sc.dispose();
await doc.transform(prune());
for (const a of doc.getRoot().listAnimations()) a.dispose();
const bufs = doc.getRoot().listBuffers();
for (const b of bufs.slice(1)) { for (const a of doc.getRoot().listAccessors()) if (a.getBuffer() === b) a.setBuffer(bufs[0]); b.dispose(); }
await io.write(SAIDA, doc); console.log('ok', n, 'salas ->', SAIDA);
