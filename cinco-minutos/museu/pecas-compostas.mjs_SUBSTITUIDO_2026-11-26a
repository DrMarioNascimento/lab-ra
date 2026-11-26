// Peças compostas dos veículos (cópias próprias): cada versão da sala dos veículos leva a bicicleta de roda alta ao lado, em escala real relativa.
// Uso (pasta do gltf-transform): node pecas-compostas.mjs <pasta pecas> [saídas separadas por vírgula; sem isso, faz todas]
// Revisão 8 (25/11/2026): GAL_B = base de madeira com a redoma ao lado (GAL_B_base, modelo do autor, já em metros por escala-real.mjs) + a máscara de pedra (V11) em cima da base.
// Revisão 4 (25/11/2026): composições das salas do Loop. GAL_A = máscara de pedra (V11) em cima de uma base; REL_A = relógio de caixa alta (R02) + relógio de parede (R01); DESC_A = sofá (V41) + quadro de recados (C02).
import { Document, NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS, KHRDracoMeshCompression } from '@gltf-transform/extensions';
import { getBounds, mergeDocuments, prune } from '@gltf-transform/functions';
import draco3d from 'draco3dgltf'; import { MeshoptDecoder } from 'meshoptimizer'; import path from 'path';
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
const LOOP = { GAL_B: { sobre: 'V11', maior: 0.6, cena: 'GAL_B_base', topo: { x: [-0.6, 0.25], z: [-0.35, 0.45], yMax: 1.12 } }, GAL_A: { sobre: 'V11', base: [0.5, 0.95, 0.5] }, REL_A: { lado: ['R02', 'R01'], gap: .35 }, DESC_A: { lado: ['V41', 'C02'], gap: .3 } };
function caixa(doc, buf, [lx, ly, lz]) {   // caixa com base no chão (y de 0 a ly), 24 vértices com normal por face
 const x = lx / 2, z = lz / 2, P = [], N = [], I = [];
 const faces = [[[0,0,1],[[-x,0,z],[x,0,z],[x,ly,z],[-x,ly,z]]],[[0,0,-1],[[x,0,-z],[-x,0,-z],[-x,ly,-z],[x,ly,-z]]],[[1,0,0],[[x,0,z],[x,0,-z],[x,ly,-z],[x,ly,z]]],[[-1,0,0],[[-x,0,-z],[-x,0,z],[-x,ly,z],[-x,ly,-z]]],[[0,1,0],[[-x,ly,z],[x,ly,z],[x,ly,-z],[-x,ly,-z]]],[[0,-1,0],[[-x,0,-z],[x,0,-z],[x,0,z],[-x,0,z]]]];
 faces.forEach(([n, vs], f) => { vs.forEach(v => { P.push(...v); N.push(...n); }); I.push(4*f, 4*f+1, 4*f+2, 4*f, 4*f+2, 4*f+3); });
 const mat = doc.createMaterial('base').setBaseColorFactor([0.13, 0.09, 0.07, 1]).setRoughnessFactor(0.55).setMetallicFactor(0.05);
 const prim = doc.createPrimitive().setAttribute('POSITION', doc.createAccessor().setType('VEC3').setArray(new Float32Array(P)).setBuffer(buf)).setAttribute('NORMAL', doc.createAccessor().setType('VEC3').setArray(new Float32Array(N)).setBuffer(buf)).setIndices(doc.createAccessor().setType('SCALAR').setArray(new Uint16Array(I)).setBuffer(buf)).setMaterial(mat);
 return doc.createNode('base').setMesh(doc.createMesh('base').addPrimitive(prim));
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
