// Decodifica o GLB original, sem trocar a malha nem sua textura.
// Uso: node dilema-bonde-3d/scripts/araucarias-usdz.mjs /tmp/araucarias
import fs from 'node:fs/promises';
import path from 'node:path';
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder } from 'meshoptimizer';
import sharp from 'sharp';
import * as THREE from 'three';
import { ARAUCARIAS_RA } from '../js/vegetacao-ra.js';

await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder });
const doc = await io.read(new URL('../assets/araucaria_ra.glb',import.meta.url).pathname);
const pasta = path.resolve(process.argv[2]); await fs.mkdir(pasta,{recursive:true});
const partes = [], bounds = new THREE.Box3();
for (const node of doc.getRoot().listNodes()) {
  if (!node.getMesh()) continue;
  const matrix = new THREE.Matrix4().fromArray(node.getWorldMatrix());
  const normalMatrix = new THREE.Matrix3().getNormalMatrix(matrix);
  for (const prim of node.getMesh().listPrimitives()) {
    const attr = name => { const a=prim.getAttribute(name); return Array.from({length:a.getCount()},(_,i)=>a.getElement(i,[])); };
    const pontos=attr('POSITION').map(p=>new THREE.Vector3(...p).applyMatrix4(matrix));
    pontos.forEach(p=>bounds.expandByPoint(p));
    partes.push({ pontos, normais:attr('NORMAL').map(n=>new THREE.Vector3(...n).applyNormalMatrix(normalMatrix)),
      uv:attr('TEXCOORD_0'), indices:Array.from(prim.getIndices().getArray()), material:prim.getMaterial() });
  }
}
const arvores = [];
for (const [i,a] of ARAUCARIAS_RA.entries()) {
  const escala=13*a.esc/(bounds.max.y-bounds.min.y);
  const q=new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0),a.rot);
  const offset=new THREE.Vector3(a.x,-bounds.min.y*escala-.03,a.z);
  for (const [j,p] of partes.entries()) {
    const textura=`araucaria_${j}.png`;
    await sharp(p.material.getBaseColorTexture().getImage()).png().toFile(path.join(pasta,textura));
    arvores.push({nome:`Araucaria_${i}_${j}`,pontos:p.pontos.map(v=>v.clone().multiplyScalar(escala).applyQuaternion(q).add(offset).toArray()),
      normais:p.normais.map(v=>v.clone().applyQuaternion(q).toArray()),uv:p.uv,indices:p.indices,textura,
      cor:p.material.getBaseColorFactor().slice(0,3),roughness:p.material.getRoughnessFactor()});
  }
}
await fs.writeFile(path.join(pasta,'araucarias.json'),JSON.stringify(arvores));
console.log(JSON.stringify({arvores:ARAUCARIAS_RA.length,partes:partes.length,alturaBase:13,larguraOriginal:bounds.max.x-bounds.min.x,alturaOriginal:bounds.max.y-bounds.min.y}));
