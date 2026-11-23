// Sala de cera do Loop: 6 figuras (cópias próprias em cera/fontes) em pedestais -> museu/pecas/CERA.glb
// Uso (na pasta do gltf-transform): node gerar-cera.mjs <pasta cera/fontes> <saida.glb>
import { Document, NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { getBounds, mergeDocuments, prune } from '@gltf-transform/functions';
import fs from 'fs'; import path from 'path';
import { MeshoptDecoder } from 'meshoptimizer';
const [,, FONTES = 'fontes', SAIDA = 'CERA.glb'] = process.argv;
await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder });
const doc = new Document(); const buf = doc.createBuffer(); const cena = doc.createScene('cera');
const ped = doc.createMaterial('cera_pedestal').setBaseColorFactor([.16,.14,.17,1]).setRoughnessFactor(.5).setMetallicFactor(.15);
const placaM = doc.createMaterial('cera_placa').setBaseColorFactor([.82,.68,.36,1]).setRoughnessFactor(.4).setMetallicFactor(.6);
function prisma(nome, m, r, h, y, seg = 28) { // cilindro de base em y
 const P = [], N = [], I = []; let v = 0;
 for (let i = 0; i < seg; i++) { const a0 = i/seg*2*Math.PI, a1 = (i+1)/seg*2*Math.PI, c0 = Math.cos(a0), s0 = Math.sin(a0), c1 = Math.cos(a1), s1 = Math.sin(a1);
  const nx = Math.cos((a0+a1)/2), nz = Math.sin((a0+a1)/2);
  P.push(r*c0,0,r*s0, r*c1,0,r*s1, r*c1,h,r*s1, r*c0,h,r*s0); for (let k = 0; k < 4; k++) N.push(nx,0,nz); I.push(v,v+2,v+1,v,v+3,v+2); v += 4;
  P.push(0,h,0, r*c0,h,r*s0, r*c1,h,r*s1); for (let k = 0; k < 3; k++) N.push(0,1,0); I.push(v,v+2,v+1); v += 3; }
 const pos = doc.createAccessor().setType('VEC3').setArray(new Float32Array(P)).setBuffer(buf), nor = doc.createAccessor().setType('VEC3').setArray(new Float32Array(N)).setBuffer(buf), ind = doc.createAccessor().setType('SCALAR').setArray(new Uint16Array(I)).setBuffer(buf);
 const pr = doc.createPrimitive().setAttribute('POSITION', pos).setAttribute('NORMAL', nor).setIndices(ind).setMaterial(m);
 return doc.createNode(nome).setMesh(doc.createMesh(nome).addPrimitive(pr)).setTranslation([0, y, 0]);
}
const FIG = ['cientista','estudante','operador','gestante','colega','idoso'];
const raiz = doc.createNode('cera'); cena.addChild(raiz);
const DX = 1.05, DZ = 1.15, ALTP = 0.45, ALTURA = 1.75;       // pedestais de 45 cm; figuras com 1,75 m
for (let i = 0; i < FIG.length; i++) {
 const c = i % 3, l = Math.floor(i / 3), x = (c - 1) * DX, z = (l - .5) * DZ;
 const g = doc.createNode('pos_' + FIG[i]).setTranslation([x, 0, z]).setRotation([0, Math.sin((l ? -.35 + (c-1)*.2 : .35 + (c-1)*-.2)/2), 0, Math.cos((l ? -.35 + (c-1)*.2 : .35 + (c-1)*-.2)/2)]);
 raiz.addChild(g); g.addChild(prisma('pedestal_' + FIG[i], ped, .42, ALTP, 0));
 const pd = await io.read(path.join(FONTES, FIG[i] + '.glb')); const b = getBounds(pd.getRoot().listScenes()[0]);
 const e = ALTURA / (b.max[1] - b.min[1]);
 const mapa = mergeDocuments(doc, pd); const nova = mapa.get(pd.getRoot().listScenes()[0]);
 const f = doc.createNode('figura_' + FIG[i]).setScale([e, e, e]).setTranslation([-(b.min[0]+b.max[0])/2*e, ALTP - b.min[1]*e, -(b.min[2]+b.max[2])/2*e]);
 for (const k of nova.listChildren()) { nova.removeChild(k); f.addChild(k); } cena.removeChild(nova); g.addChild(f);
}
for (const sc of doc.getRoot().listScenes()) if (sc !== cena) sc.dispose();
await doc.transform(prune());
const bufs = doc.getRoot().listBuffers(); for (const b of bufs.slice(1)) { for (const a of doc.getRoot().listAccessors()) if (a.getBuffer() === b) a.setBuffer(bufs[0]); b.dispose(); }
for (const e of doc.getRoot().listExtensionsUsed()) if (e.extensionName === 'EXT_meshopt_compression') e.dispose();   // sai sem compressão meshopt (arquivo pequeno)
await io.write(SAIDA, doc); console.log('ok', SAIDA, fs.statSync(SAIDA).size);
