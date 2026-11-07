// Grava um "?" branco em 3D no rosto (abertura do capuz) do desconhecido, dentro do próprio GLB.
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder, MeshoptEncoder } from 'meshoptimizer';
import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import fs from 'fs';
await Promise.all([MeshoptDecoder.ready, MeshoptEncoder.ready]);
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder, 'meshopt.encoder': MeshoptEncoder });
const [ent, sai] = process.argv.slice(2);
const doc = await io.read(ent); const root = doc.getRoot();
// pontos do modelo no espaço da cena (nós com matriz)
const pts = [];
for (const node of root.listNodes()) { const mesh = node.getMesh(); if (!mesh) continue; const M = new THREE.Matrix4().fromArray(node.getWorldMatrix());
  for (const p of mesh.listPrimitives()) { const a = p.getAttribute('POSITION'), el = []; for (let i = 0; i < a.getCount(); i++) { a.getElement(i, el); pts.push(new THREE.Vector3(...el).applyMatrix4(M)); } } }
const bb = new THREE.Box3().setFromPoints(pts), H = bb.max.y - bb.min.y;
// faixa do rosto: 76–90% da altura, perto do eixo central
const y0 = bb.min.y + H * 0.80, y1 = bb.min.y + H * 0.93, cx = (bb.min.x + bb.max.x) / 2;
let zF = -1e9, zT = 1e9; for (const v of pts) if (v.y > y0 && v.y < y1 && Math.abs(v.x - cx) < H * 0.05) { zF = Math.max(zF, v.z); zT = Math.min(zT, v.z); }
console.log('altura', H.toFixed(2), 'rosto z', zF.toFixed(3), zT.toFixed(3));
const fonte = new FontLoader().parse(JSON.parse(fs.readFileSync('node_modules/three/examples/fonts/helvetiker_bold.typeface.json', 'utf8')));
const tam = H * 0.115;
const g = new TextGeometry('?', { font: fonte, size: tam, depth: tam * 0.25, curveSegments: 8, bevelEnabled: true, bevelThickness: tam * 0.05, bevelSize: tam * 0.04, bevelSegments: 3 });
g.computeBoundingBox(); const b = g.boundingBox;
g.translate(cx - (b.min.x + b.max.x) / 2, (y0 + y1) / 2 - (b.min.y + b.max.y) / 2, zF - b.max.z + tam * 0.05);
const ni = g.toNonIndexed(); ni.computeVertexNormals();
const buf = root.listBuffers()[0];
const pos = doc.createAccessor().setType('VEC3').setArray(new Float32Array(ni.attributes.position.array)).setBuffer(buf);
const nor = doc.createAccessor().setType('VEC3').setArray(new Float32Array(ni.attributes.normal.array)).setBuffer(buf);
const mat = doc.createMaterial('interrogacao_branca').setBaseColorFactor([1, 1, 1, 1]).setEmissiveFactor([1, 1, 1]).setRoughnessFactor(0.4).setMetallicFactor(0);
const prim = doc.createPrimitive().setAttribute('POSITION', pos).setAttribute('NORMAL', nor).setMaterial(mat);
const node = doc.createNode('Interrogacao').setMesh(doc.createMesh('Interrogacao').addPrimitive(prim));
root.listScenes()[0].addChild(node);
await io.write(sai, doc); console.log('ok');
