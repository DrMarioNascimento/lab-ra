import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder } from 'meshoptimizer';
import { criarMaquete } from '../dilema-bonde-3d/js/cena.js';
import { ARAUCARIAS_RA } from '../dilema-bonde-3d/js/vegetacao-ra.js';

// Lê as malhas GLB reais sem exigir GPU. Texturas e o rótulo 2D não entram
// nesta verificação de espaço, percurso e animação; não é um teste visual.
async function preparar() {
  await MeshoptDecoder.ready;
  const io=new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({'meshopt.decoder':MeshoptDecoder});
  const load=GLTFLoader.prototype.load,tex=THREE.TextureLoader.prototype.load,doc=globalThis.document;
  const cache=new Map();
  function converter(node) {
    const grupo=new THREE.Group();grupo.name=node.getName();
    grupo.position.fromArray(node.getTranslation());grupo.quaternion.fromArray(node.getRotation());grupo.scale.fromArray(node.getScale());
    for(const prim of node.getMesh()?.listPrimitives()||[]) {
      const geo=new THREE.BufferGeometry();
      for(const [chave,nome] of [['POSITION','position'],['NORMAL','normal'],['TEXCOORD_0','uv'],['COLOR_0','color']]) {
        const a=prim.getAttribute(chave);if(!a)continue;
        geo.setAttribute(nome,new THREE.Float32BufferAttribute(Array.from({length:a.getCount()},(_,i)=>a.getElement(i,[])).flat(),a.getElementSize()));
      }
      if(prim.getIndices())geo.setIndex(Array.from(prim.getIndices().getArray()));
      grupo.add(new THREE.Mesh(geo,new THREE.MeshStandardMaterial()));
    }
    node.listChildren().forEach(n=>grupo.add(converter(n)));return grupo;
  }
  GLTFLoader.prototype.load=function(url,ok,_progress,erro) {
    if(!cache.has(url))cache.set(url,io.read(new URL(url).pathname).then(d=>{
      const scene=new THREE.Group();(d.getRoot().getDefaultScene()||d.getRoot().listScenes()[0]).listChildren().forEach(n=>scene.add(converter(n)));return scene;
    }));
    cache.get(url).then(scene=>ok({scene:scene.clone()}),erro);
  };
  THREE.TextureLoader.prototype.load=()=>new THREE.Texture();
  globalThis.document={createElement:()=>({getContext:()=>({fillText(){}})})};
  try { return await criarMaquete({ra:true}); }
  finally { GLTFLoader.prototype.load=load;THREE.TextureLoader.prototype.load=tex;globalThis.document=doc; }
}
const m=await preparar();

test('malha real contém duas araucárias com altura e copa dentro da maquete',()=>{
  const arvores=m.root.children.filter(o=>o.name==='Araucarias');assert(arvores.length>0);
  for(const [i,a] of ARAUCARIAS_RA.entries()) {
    const box=new THREE.Box3();
    for(const mesh of arvores) {
      assert.equal(mesh.count,2);const mat=new THREE.Matrix4();mesh.getMatrixAt(i,mat);
      const p=mesh.geometry.attributes.position;
      for(let j=0;j<p.count;j++)box.expandByPoint(new THREE.Vector3().fromBufferAttribute(p,j).applyMatrix4(mat));
    }
    assert(Math.abs(box.max.y-box.min.y-13*a.esc)<.001);
    assert(box.min.x>-80&&box.max.x<80&&box.min.z>-50&&box.max.z<54);
    assert(box.max.x-box.min.x>5,'copa preservada');
  }
});
for(const rota of ['principal','ramal','principal','ramal'])test(`percurso ${rota}: fantasmas surgem no grupo atingido, sobem e desaparecem; reinício limpa`,()=>{
  m.reiniciar();m.irPara(rota,m.estado.s0);m.estado.travado=false;m.partir();
  const grupos=m.root.children.filter(o=>o.userData.fantasmas);
  const idx=rota==='principal'?0:1,atingido=grupos[idx],preservado=grupos[1-idx];
  let houveFantasma=false,subiu=false;
  for(let i=0;i<4000;i++) {
    m.update(1/30);m.root.updateMatrixWorld(true);
    for(const f of atingido.userData.fantasmas.children)if(f.scale.x>.5) {
      houveFantasma=true;const pos=f.getWorldPosition(new THREE.Vector3());
      assert(Math.abs(pos.z-atingido.position.z)<.3,'fantasma deve sair do trilho atingido');
      assert(Math.abs(pos.x-atingido.position.x)<2);
      if(pos.y>atingido.position.y+5)subiu=true;
    }
    assert(preservado.userData.fantasmas.children.every(f=>f.scale.x<=.00011));
    if(!m.estado.rodando&&i>0)break;
  }
  assert(m.estado.impacto);assert(houveFantasma);assert(subiu);
  assert(atingido.userData.fantasmas.children.every(f=>f.scale.x<.00011));
  m.reiniciar();assert(grupos.every(g=>g.children.every(p=>p.scale.x===1)));
  assert(grupos.every(g=>g.userData.fantasmas.children.every(f=>f.scale.x<.00011)));
});
