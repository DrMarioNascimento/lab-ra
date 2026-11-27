// Gera museu/torre/torre-loop.glb: só o que o Mosaico Loop mostra (15 salas da história, sem fachada e sem as salas extras).
// As peças antigas das 15 salas viram caixas invisíveis do mesmo tamanho (a página usa o tamanho delas para encaixar a peça do Loop).
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { prune, dedup, getBounds } from '@gltf-transform/functions';
import draco3d from 'draco3dgltf';
import fs from 'fs';
const [,, ENT, SAI, SALAS_JSON, LOOP_JSON] = process.argv;
const SALAS = JSON.parse(fs.readFileSync(SALAS_JSON)), LS = JSON.parse(fs.readFileSync(LOOP_JSON));
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({'draco3d.decoder': await draco3d.createDecoderModule(), 'draco3d.encoder': await draco3d.createEncoderModule()});
const doc = await io.read(ENT); const root = doc.getRoot(), cena = root.listScenes()[0];
const mat = doc.createMaterial('caixa_invisivel').setAlphaMode('BLEND').setBaseColorFactor([1,1,1,0]);
const buf = root.listBuffers()[0];
const pos = doc.createAccessor().setType('VEC3').setArray(new Float32Array([0,0,0, 1,0,0, 0,1,0, 0,0,1, 1,1,1])).setBuffer(buf);
const cubo = doc.createMesh('caixa').addPrimitive(doc.createPrimitive().setAttribute('POSITION', pos).setMaterial(mat).setMode(0));
let tiradas = 0, ficaram = 0, trocadas = 0;
const andares = [];
cena.traverse(n => { if (/^andar_\d$/.test(n.getName())) andares.push(n); });
for (const a of andares) for (const n of a.listChildren()) {
  const nome = n.getName();
  if (nome.startsWith('fachada')) { kill(n); tiradas++; continue; }
  if (!nome.startsWith('sala_')) continue;
  const id = (SALAS[nome.replace('sala_', '')] || {}).id;
  if (!id || !LS.salas[id]) { kill(n); tiradas++; continue; }
  ficaram++;
  for (const c of n.listChildren()) if (c.getName().startsWith('peca_')) {
    // caixa do mesmo tamanho, no espaço da sala
    const b = getBounds(c);   // mundo
    const inv = n.getWorldMatrix();
    const pai = n;
    const cx = doc.createNode(c.getName()).setMesh(cubo);
    // converte min/max do mundo para o espaço local da sala
    const M = inv, det = 1; // calcula inversa 4x4
    const m = invert(M);
    const p0 = apply(m, b.min), p1 = apply(m, b.max);
    const mn = [0,1,2].map(i => Math.min(p0[i], p1[i])), mx = [0,1,2].map(i => Math.max(p0[i], p1[i]));
    cx.setTranslation(mn).setScale([mx[0]-mn[0]||1e-4, mx[1]-mn[1]||1e-4, mx[2]-mn[2]||1e-4]);
    kill(c); pai.addChild(cx); trocadas++;
  }
}
function kill(n){ for (const c of n.listChildren()) kill(c); n.dispose(); }
function apply(m, v){ return [0,1,2].map(i => m[i]*v[0] + m[4+i]*v[1] + m[8+i]*v[2] + m[12+i]); }
function invert(a){ const o=new Array(16); const [a00,a01,a02,a03,a10,a11,a12,a13,a20,a21,a22,a23,a30,a31,a32,a33]=a;
 const b00=a00*a11-a01*a10,b01=a00*a12-a02*a10,b02=a00*a13-a03*a10,b03=a01*a12-a02*a11,b04=a01*a13-a03*a11,b05=a02*a13-a03*a12,b06=a20*a31-a21*a30,b07=a20*a32-a22*a30,b08=a20*a33-a23*a30,b09=a21*a32-a22*a31,b10=a21*a33-a23*a31,b11=a22*a33-a23*a32;
 const d=1/(b00*b11-b01*b10+b02*b09+b03*b08-b04*b07+b05*b06);
 o[0]=(a11*b11-a12*b10+a13*b09)*d;o[1]=(a02*b10-a01*b11-a03*b09)*d;o[2]=(a31*b05-a32*b04+a33*b03)*d;o[3]=(a22*b04-a21*b05-a23*b03)*d;o[4]=(a12*b08-a10*b11-a13*b07)*d;o[5]=(a00*b11-a02*b08+a03*b07)*d;o[6]=(a32*b02-a30*b05-a33*b01)*d;o[7]=(a20*b05-a22*b02+a23*b01)*d;o[8]=(a10*b10-a11*b08+a13*b06)*d;o[9]=(a01*b08-a00*b10-a03*b06)*d;o[10]=(a30*b04-a31*b02+a33*b00)*d;o[11]=(a21*b02-a20*b04-a23*b00)*d;o[12]=(a11*b07-a10*b09-a12*b06)*d;o[13]=(a00*b09-a01*b07+a02*b06)*d;o[14]=(a31*b01-a30*b03-a32*b00)*d;o[15]=(a20*b03-a21*b01+a22*b00)*d; return o; }
await doc.transform(prune({keepLeaves: true}), dedup());
await io.write(SAI, doc);
console.log({tiradas, ficaram, trocadas, bytes: fs.statSync(SAI).size});
