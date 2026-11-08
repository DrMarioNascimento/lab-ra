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
import { BITOLA, LARGURA_DORMENTE } from '../dilema-bonde-3d/js/proporcoes.js';

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
const m3d=await preparar({ra:false,qualidade:'detalhada'});
const economica=await preparar({ra:true,qualidade:'economica'});

test('bolas verdes removidas e operador destacado com 5,67 unidades de altura',()=>{
  for(const cena of [m,m3d]) for(const nome of ['Arbustos_Flores','Floreiras','Objetos_Patio_folhagem','Objetos_Patio_flores_rosa']) assert(!cena.root.getObjectByName(nome),nome);
  const altura=new THREE.Box3().setFromObject(m.focos.operador,true).getSize(new THREE.Vector3()).y;
  assert(Math.abs(altura-5.67)<.001);
});
for(const [tipo,maquete] of [['RA',m],['3D',m3d]])test(`oficina deixa passagem livre para o bonde largo em ${tipo}, inclusive nas curvas`,()=>{
  const m=maquete;
  const b=new THREE.Box3().setFromObject(m.focos.oficina,true);
  // Os arquivos completo e simplificado têm contornos diferentes; ambos mantêm a ampliação de 40%.
  assert.equal(m.focos.oficina.scale.x,1.4);assert(b.max.x-b.min.x>18.1);assert(b.max.y-b.min.y>10);
  const pessoasRamal=m.root.children.filter(o=>o.userData.fantasmas)[1];
  assert(new THREE.Box3().setFromObject(pessoasRamal,true).max.x+.25<b.min.x,'oficina encobre o grupo do ramal na vista frontal: '+new THREE.Box3().setFromObject(pessoasRamal,true).max.x+'; oficina '+b.min.x);
  const oficina=new OBB().fromBox3(b.clone().expandByScalar(.25));
  const bonde=m.focos.bonde, pos=bonde.position.clone(),rot=bonde.quaternion.clone(),escala=bonde.scale.clone();
  bonde.position.set(0,0,0);bonde.quaternion.identity();bonde.scale.setScalar(1);
  const caixaLocal=new THREE.Box3().setFromObject(bonde,true);
  bonde.position.copy(pos);bonde.quaternion.copy(rot);bonde.scale.copy(escala);
  for(const [nome,rota] of Object.entries(ROTAS))for(let i=0;i<=800;i++) {
    m.irPara(nome,rota.getLength()*i/800);
    bonde.updateMatrixWorld(true);
    const envelope=new OBB().fromBox3(caixaLocal).applyMatrix4(bonde.matrixWorld);
    assert(!envelope.intersectsOBB(oficina),`bonde invade a oficina: ${nome}, ${i}/800`);
  }
  m.reiniciar();
});
test('via ampliada mantém bitola, dormentes e lastro sobre a base, com estação alinhada',()=>{
  const via=m.root.getObjectByName('Via'),p=via.getObjectByName('Trilhos').geometry.attributes.position,afastamentos=[];
  for(let i=0;i<p.count;i++)if(Math.abs(p.getX(i))<1e-5&&Math.abs(p.getY(i)-.42)<1e-5&&Math.abs(p.getZ(i)+30)<2)afastamentos.push(Math.abs(p.getZ(i)+30));
  assert(afastamentos.length>0);assert(Math.abs(Math.min(...afastamentos)-(BITOLA/2-.036))<1e-4);assert(Math.abs(Math.max(...afastamentos)-(BITOLA/2+.036))<1e-4);
  const dorm=via.getObjectByName('Dormentes');dorm.geometry.computeBoundingBox();assert(Math.abs(dorm.geometry.boundingBox.getSize(new THREE.Vector3()).z-LARGURA_DORMENTE)<1e-6);
  const lastro=via.getObjectByName('Lastro').geometry.attributes.position;
  for(let i=0;i<lastro.count;i++){const x=Math.max(0,Math.abs(lastro.getX(i))-66),z=Math.max(0,Math.abs(lastro.getZ(i)-2)-38);assert(x*x+z*z<=196.001,'lastro sai da base');}
  m.root.updateMatrixWorld(true);assert(Math.abs(m.focos.estacao.getObjectByName('Eixo_Via').getWorldPosition(new THREE.Vector3()).z+30)<1e-6);
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

test('vegetação RA11 mantém 27 árvores comuns e duas araucárias, abaixo de 600 mil triângulos',()=>{
  assert.equal(m.root.userData.arvoresComuns,27);
  const ara=m.root.children.filter(o=>o.isInstancedMesh&&o.name==='Araucarias');assert.equal(ara[0].count,2);
  let n=0;m.root.traverseVisible(o=>{if(o.isMesh)n+=(o.geometry.index?.count||o.geometry.attributes.position.count)/3*(o.isInstancedMesh?o.count:1);});assert(n<600000,'orçamento da cena: '+n);if(process.env.BONDE_METRICAS)console.log('Triângulos Equilibrada: '+n);
});
test('placa acessível está fora dos trilhos e da estação',()=>{
  const placa=new THREE.Box3().setFromObject(m.focos.placa,true),estacao=new THREE.Box3().setFromObject(m.focos.estacao,true);assert(!placa.intersectsBox(estacao));
  for(const c of Object.values(ROTAS))for(let i=0;i<1000;i++){const ponto=c.getPointAt(i/1000);assert(!(ponto.x>placa.min.x-2&&ponto.x<placa.max.x+2&&ponto.z>placa.min.z-2&&ponto.z<placa.max.z+2));}
  assert.deepEqual(m.alvosMenu.map(o=>o.userData.secaoMenu),['ajuda','rodada','reflexao']);
});
test('cinco personagens no ramal preservam folga da oficina e recalculam o impacto',async()=>{
  await m.configurar({presetPrincipal:'trabalhador',nPrincipal:5,presetRamal:'desconhecidos',nRamal:5});
  const g=m.root.children.filter(o=>o.userData.fantasmas)[1],oficina=new THREE.Box3().setFromObject(m.focos.oficina,true);
  assert(new THREE.Box3().setFromObject(g,true).max.x+.25<oficina.min.x);assert(g.position.x< -8);
  await m.configurar();m.reiniciar();
});

test('perfil Econômico conserva araucárias e cena abaixo de 400 mil triângulos',()=>{
 assert.equal(economica.root.userData.arvoresComuns,18);let n=0;economica.root.traverseVisible(o=>{if(o.isMesh)n+=(o.geometry.index?.count||o.geometry.attributes.position.count)/3*(o.isInstancedMesh?o.count:1);});assert(n<400000,'orçamento econômico: '+n);assert.equal(economica.root.getObjectByName('Araucarias').count,2);if(process.env.BONDE_METRICAS)console.log('Triângulos Econômica: '+n);
});

test('grupos e rótulos têm referências à esquerda da oficina também com cinco pessoas',async()=>{
 for(const n of [1,3,5]){
  await m.configurar({presetPrincipal:'trabalhador',nPrincipal:n,presetRamal:'desconhecidos',nRamal:n});
  const oficina=new THREE.Box3().setFromObject(m.focos.oficina,true);
  for(const g of Object.values(m.gruposCena)){const b=new THREE.Box3().setFromObject(g,true);assert(b.max.x+.5<oficina.min.x);assert(Math.abs(g.userData.esquerda-b.min.x)<.001);}
 }
 await m.configurar();m.reiniciar();
});
test('placa de madeira está no gramado frontal e preserva textura e relevo',()=>{
 assert.equal(m.focos.placa.position.x,32);assert.equal(m.focos.placa.position.z,44);
 for(const alvo of m.alvosMenu){assert(alvo.material.map);assert(alvo.geometry.parameters.options.bevelEnabled);}
});
