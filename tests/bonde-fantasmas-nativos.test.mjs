import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {poseFantasmaNativo} from '../dilema-bonde-3d/ar/fantasmas-usdz.js';
test('fantasma nativo repousa com volume dentro da base, sem matriz quase singular',()=>{
 const entrada=new THREE.Matrix4().compose(new THREE.Vector3(-2,.2,.15),new THREE.Quaternion(),new THREE.Vector3(1e-4,1e-4,1e-4)),copia=entrada.clone();
 const n=poseFantasmaNativo(entrada),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3();n.decompose(p,q,s);
 assert(entrada.equals(copia));assert.equal(s.x,.65);assert.equal(p.x,-2);assert.equal(p.z,.15);
 assert(p.y+.27> -3);assert(p.y+.27+2.42*s.y<0);assert(n.determinant()>.2);
});
test('poses visíveis e movimento do fantasma são preservados no USDZ',()=>{
 for(const y of [.4,3,8])for(const escala of [.1,1,2.28]){const matriz=new THREE.Matrix4().compose(new THREE.Vector3(4,y,30),new THREE.Quaternion(),new THREE.Vector3(escala,escala,escala));assert(poseFantasmaNativo(matriz).equals(matriz));}
});
