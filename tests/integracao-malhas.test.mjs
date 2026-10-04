import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {MeshoptDecoder} from 'three/addons/libs/meshopt_decoder.module.js';
import {normalizarModelo} from '../integracao/modelos.js';
test('integração: decodificar e normalizar a silhueta quantizada preserva altura e normais',async()=>{
 const bytes=fs.readFileSync(new URL('../integracao/assets/corpo.glb',import.meta.url));
 const data=bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength);
 const gltf=await new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).parseAsync(data,'');
 const model=normalizarModelo(gltf.scene,3.4),bb=new THREE.Box3().setFromObject(model),size=bb.getSize(new THREE.Vector3());
 assert(Math.abs(size.y-3.4)<1e-6);assert(Math.abs(bb.min.y)<1e-6);assert(size.x>1.7&&size.x<1.9);assert(size.z>.5&&size.z<.7);
 let triangles=0;model.traverse(o=>{if(!o.isMesh)return;assert(o.geometry.attributes.position.array instanceof Float32Array);const p=o.geometry.attributes.position,n=o.geometry.attributes.normal;for(let i=0;i<p.count;i++){assert(Number.isFinite(p.getX(i))&&Number.isFinite(p.getY(i))&&Number.isFinite(p.getZ(i)));const length=Math.hypot(n.getX(i),n.getY(i),n.getZ(i));assert(length>.99&&length<1.01);}triangles+=(o.geometry.index?.count||p.count)/3;});assert.equal(triangles,21160);
});
