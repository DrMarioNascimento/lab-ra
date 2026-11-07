import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OBB } from 'three/addons/math/OBB.js';
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder } from 'meshoptimizer';
import { criarMaquete, ROTAS } from '../dilema-bonde-3d/js/cena.js';
import { ARAUCARIAS_RA } from '../dilema-bonde-3d/js/vegetacao-ra.js';

// Lê as malhas GLB reais sem exigir GPU. Texturas e o rótulo 2D não entram
// nesta verificação de espaço, percurso e animação; não é um teste visual.
async function preparar(opts = {ra:true}) {
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
  try { return await criarMaquete(opts); }
  finally { GLTFLoader.prototype.load=load;THREE.TextureLoader.prototype.load=tex;globalThis.document=doc; }
}
const m=await preparar();
const m3d=await preparar({ra:false});

test('bolas verdes removidas e operador destacado com 5,67 unidades de altura',()=>{
  for(const cena of [m,m3d]) for(const nome of ['Arbustos_Flores','Floreiras','Objetos_Patio_folhagem','Objetos_Patio_flores_rosa']) assert(!cena.root.getObjectByName(nome),nome);
  const altura=new THREE.Box3().setFromObject(m.focos.operador,true).getSize(new THREE.Vector3()).y;
  assert(Math.abs(altura-5.67)<.001);
});
test('oficina 40% maior deixa passagem livre nas duas rotas, inclusive nas curvas',()=>{
  const b=new THREE.Box3().setFromObject(m.focos.oficina,true);
  assert(b.max.x-b.min.x>20.7);assert(b.max.y-b.min.y>10.1);
  const pessoasRamal=m.root.children.filter(o=>o.userData.fantasmas)[1];
  assert(new THREE.Box3().setFromObject(pessoasRamal,true).max.x+.25<b.min.x,'oficina encobre o grupo do ramal na vista frontal: '+new THREE.Box3().setFromObject(pessoasRamal,true).max.x+'; oficina '+b.min.x);
  const oficina=new OBB().fromBox3(b.clone().expandByScalar(.25));
  const bonde=m.focos.bonde, pos=bonde.position.clone(),rot=bonde.quaternion.clone();
  bonde.position.set(0,0,0);bonde.quaternion.identity();
  const caixaLocal=new THREE.Box3().setFromObject(bonde,true);
  bonde.position.copy(pos);bonde.quaternion.copy(rot);
  for(const [nome,rota] of Object.entries(ROTAS))for(let i=0;i<=800;i++) {
    m.irPara(nome,rota.getLength()*i/800);
    bonde.updateMatrixWorld(true);
    const envelope=new OBB().fromBox3(caixaLocal).applyMatrix4(bonde.matrixWorld);
    assert(!envelope.intersectsOBB(oficina),`bonde invade a oficina: ${nome}, ${i}/800`);
  }
  m.reiniciar();
});
for(const [tipo,maquete] of [['RA',m],['3D',m3d]])test(`cidade ${tipo} tem textura e janelas nos quatro lados; copas ficam afastadas das construções`,()=>{
  const m=maquete;
  const cidade=m.root.getObjectByName('Cidade');assert(cidade);
  for(const face of ['Frente','Fundos','Direita','Esquerda'])assert(cidade.children.some(c=>c.name.startsWith('Cidade_Janelas_'+face)));
  for(const c of cidade.children.filter(c=>/^Cidade_Paredes|^Cidade_Telhados/.test(c.name)))assert(c.material.map);
  const construcoes=[new THREE.Box3().setFromObject(m.focos.estacao,true),new THREE.Box3().setFromObject(m.focos.oficina,true),...cidade.userData.volumes];
  m.root.updateMatrixWorld(true);
  for(const a of m.root.children.filter(o=>o.isInstancedMesh&&/^Arvores|^Araucarias/.test(o.name))) {
    for(let i=0;i<a.count;i++) {
      const matriz=new THREE.Matrix4();a.getMatrixAt(i,matriz);
      const bb=new THREE.Box3();const p=a.geometry.attributes.position;
      for(let j=0;j<p.count;j++)bb.expandByPoint(new THREE.Vector3().fromBufferAttribute(p,j).applyMatrix4(matriz));
      for(const b of construcoes)assert(!(bb.min.x<b.max.x+.3&&bb.max.x>b.min.x-.3&&bb.min.z<b.max.z+.3&&bb.max.z>b.min.z-.3),'copa invade construção');
    }
  }
});

test('adultos ficam 60% maiores, abaixo da cabine, e afastados entre si',()=>{
  const grupos=m.root.children.filter(o=>o.userData.fantasmas);
  for(const g of grupos)for(const p of g.children){
    const altura=new THREE.Box3().setFromObject(p).getSize(new THREE.Vector3()).y;
    assert(Math.abs(altura-4.2)<.001);
  }
  const ramal=grupos[1];
  assert(Math.abs(ramal.children[1].position.x-ramal.children[0].position.x-2.04)<1e-10);
});

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
      assert(Math.abs(pos.x-atingido.position.x-f.userData.base.x)<=.251,
        'fantasma deve sair da posição do personagem, com oscilação máxima de 0,25');
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
