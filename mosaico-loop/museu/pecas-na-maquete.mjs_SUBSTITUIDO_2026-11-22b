// Põe as peças reais (museu/pecas/*.glb, versão A de cada sala) dentro da maquete.
// Uso (na pasta do gltf-transform): node pecas-na-maquete.mjs museu-andares.glb saida.glb
// Cada peça recebe materiais com prefixo A1_ / A2_ quando está no 1º / 2º andar, para o botão de andares esconder junto.
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS, KHRMaterialsVariants, KHRMaterialsDispersion, KHRMaterialsDiffuseTransmission } from '@gltf-transform/extensions';
import { getBounds, mergeDocuments } from '@gltf-transform/functions';
import draco3d from 'draco3dgltf';
import fs from 'fs'; import path from 'path';
const [,, ENTRADA, SAIDA, PECAS='pecas', ESCALA='0.06'] = process.argv;
const P = 0.132;
const SALAS = [ // [peça, x(cm), z(cm), andar]
 ['D01',12.5,1,2],['D02',29.5,1,2],['N14',29,21,2],['N01',-29,21,2],['N15',-21,-17,2],['N13',12.5,-15,2],['N02',29.5,-15,2],['F01',12.5,-33,2],['C01',29.5,-33,2],
 ['D08',0,19,1],['F02',12.5,1,1],['N03',29.5,1,1],['N04',29,21,1],['N05',-29,21,1],['D09',-21,-17,1],['B09',12.5,-15,1],['B02',29.5,-15,1],['N06',12.5,-33,1],['N12',29.5,-33,1],
 ['B01',0,19,0],['B04',12.5,1,0],['S01',29.5,1,0],['L01',29,21,0],['L02',-29,21,0],['N07',-21,-17,0],['L03',12.5,-15,0],['N11',29.5,-15,0],['B05',0,-17,0],['N09',12.5,-33,0],['M01',29.5,-33,0]
];
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({
 'draco3d.decoder': await draco3d.createDecoderModule(), 'draco3d.encoder': await draco3d.createEncoderModule() });
const doc = await io.read(ENTRADA);
const cena = doc.getRoot().listScenes()[0];
const alvo = Number(ESCALA);
const SO = process.env.SO ? process.env.SO.split(',') : null;
for (const [id, x, z, k] of SALAS) {
 if (SO && !SO.includes(id)) continue;
 const arq = path.join(PECAS, id + '.glb');
 if (!fs.existsSync(arq)) { console.log('falta', id); continue; }
 const pd = await io.read(arq);
 // desfaz a instanciação por GPU (o visualizador estranha): cada instância vira um nó comum
 for (const n of pd.getRoot().listNodes()) {
  const inst = n.getExtension('EXT_mesh_gpu_instancing'); if (!inst) continue;
  const T = inst.getAttribute('TRANSLATION'), R = inst.getAttribute('ROTATION'), S = inst.getAttribute('SCALE');
  const cont = (T || R || S).getCount(), mesh = n.getMesh();
  for (let i = 0; i < cont; i++) {
   const f = pd.createNode(n.getName() + '_i' + i).setMesh(mesh);
   if (T) f.setTranslation(T.getElement(i, [0,0,0])); if (R) f.setRotation(R.getElement(i, [0,0,0,1])); if (S) f.setScale(S.getElement(i, [0,0,0]));
   n.addChild(f);
  }
  n.setMesh(null); n.setExtension('EXT_mesh_gpu_instancing', null);
 }
 const b = getBounds(pd.getRoot().listScenes()[0]);
 const tam = Math.max(b.max[0]-b.min[0], b.max[1]-b.min[1], b.max[2]-b.min[2]) || 1;
 const e = alvo / tam;
 const cx = (b.min[0]+b.max[0])/2, cz = (b.min[2]+b.max[2])/2;
 const mapa = mergeDocuments(doc, pd);
 const nova = mapa.get(pd.getRoot().listScenes()[0]);
 const raiz = doc.createNode('peca_' + id).setScale([e,e,e])
  .setTranslation([x/100 - cx*e, k*P + 0.006 - b.min[1]*e, z/100 - cz*e]);
 for (const f of nova.listChildren()) { nova.removeChild(f); raiz.addChild(f); }
 nova.dispose(); cena.addChild(raiz);
 const prefixo = k === 1 ? 'A1_' : k === 2 ? 'A2_' : '';
 raiz.traverse(n => { const m = n.getMesh(); if (m) for (const p of m.listPrimitives()) { const mt = p.getMaterial(); if (mt && !mt.getName().startsWith('A') ) mt.setName(prefixo + 'peca_' + id + '_' + (mt.getName()||'m')); } });
}
for (const sc of doc.getRoot().listScenes()) if (sc !== cena) sc.dispose();
// maquete estática: sem animações e sem extensões que o visualizador não precisa
for (const a of doc.getRoot().listAnimations()) a.dispose();
for (const E of [KHRMaterialsVariants, KHRMaterialsDispersion, KHRMaterialsDiffuseTransmission]) doc.createExtension(E).dispose();
const bufs = doc.getRoot().listBuffers();
for (const b of bufs.slice(1)) { for (const a of doc.getRoot().listAccessors()) if (a.getBuffer() === b) a.setBuffer(bufs[0]); b.dispose(); }
await io.write(SAIDA, doc);
console.log('ok', SALAS.length);
