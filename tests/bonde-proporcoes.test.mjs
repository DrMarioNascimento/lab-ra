import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { lerGeometriaGLB } from '../dilema-bonde-3d/scripts/geometria-glb.mjs';
import { ajustarProporcoes, ESCALA_PERSONAGENS, FATOR_LARGURA_BONDE, BITOLA } from '../dilema-bonde-3d/js/proporcoes.js';
import { angulosRelogio, ligarRelogio, PONTEIROS } from '../dilema-bonde-3d/js/relogio.js';
import { comportamentoRelogio } from '../dilema-bonde-3d/ar/relogio-usdz.js';
const estacao = await lerGeometriaGLB('dilema-bonde-3d/assets/estacao.glb');
const bonde = await lerGeometriaGLB('dilema-bonde-3d/assets/bonde.glb');
const box = o => { o.updateWorldMatrix(true,true);return new THREE.Box3().setFromObject(o,true); };
const antes = new Map();
for (const modelo of [estacao,bonde]) {
  modelo.updateMatrixWorld(true);
  modelo.traverse(o=>{if(o.isMesh)antes.set(o,{geometria:o.geometry.clone(),matriz:o.matrixWorld.clone()});});
}
const pisoAntes = box(estacao.getObjectByName('Piso_Plataforma')).clone();
const relogioAntes = box(estacao.getObjectByName('Relogio')).clone();
ajustarProporcoes(estacao,bonde);

test('bonde inteiro e estação alargam juntos sem alterar o comprimento',()=>{
  for(const modelo of [estacao,bonde]) {
    modelo.updateMatrixWorld(true);
    modelo.traverse(o=>{if(!o.isMesh)return;
      const original=antes.get(o),a=new THREE.Vector3(),b=new THREE.Vector3();
      for(let p=o;p;p=p.parent)if(p.name==='Relogio')return; // mostrador rígido, verificado separadamente
      const pos=o.geometry.attributes.position,velha=original.geometria.attributes.position;
      for(let i=0;i<pos.count;i++) {
        a.fromBufferAttribute(velha,i).applyMatrix4(original.matriz);
        b.fromBufferAttribute(pos,i).applyMatrix4(o.matrixWorld);
        assert(Math.abs(a.x-b.x)<.00001);assert(Math.abs(a.z*FATOR_LARGURA_BONDE-b.z)<.00001);
      }
    });
  }
});
test('carroceria tem 4,00 unidades e a estação ampliada mantém folga na plataforma',()=>{
  const largura=box(bonde.getObjectByName('Carroceria')).getSize(new THREE.Vector3()).z;
  assert(largura>3.99&&largura<4.01);
  const piso=box(estacao.getObjectByName('Piso_Plataforma')),eixo=estacao.getObjectByName('Eixo_Via').getWorldPosition(new THREE.Vector3()).z;
  const zs=[];estacao.getObjectByName('Piso_Plataforma').traverse(o=>{if(!o.isMesh)return;
    const p=o.geometry.attributes.position;for(let i=0;i<p.count;i++)zs.push(new THREE.Vector3().fromBufferAttribute(p,i).applyMatrix4(o.matrixWorld).z);
  });
  const esquerda=Math.max(...zs.filter(z=>z<eixo))-eixo,direita=Math.min(...zs.filter(z=>z>eixo))-eixo;
  const contorno=[];const alturas=[piso.min.y-.42,piso.max.y-.42];
  bonde.traverse(o=>{if(!o.isMesh)return;
    for(let p=o;p;p=p.parent)if(p.name==='Feixes_Farol')return; // luz não é obstáculo físico
    const g=o.geometry,p=g.attributes.position,n=g.index?.count??p.count;
    for(let i=0;i<n;i+=3){
      const vs=[0,1,2].map(k=>new THREE.Vector3().fromBufferAttribute(p,g.index?g.index.getX(i+k):i+k).applyMatrix4(o.matrixWorld));
      for(const y of alturas)for(let k=0;k<3;k++){
        const a=vs[k],b=vs[(k+1)%3];if((a.y-y)*(b.y-y)>0)continue;
        if(Math.abs(a.y-b.y)<1e-10){if(Math.abs(a.y-y)<1e-6)contorno.push(a.z,b.z);continue;}
        contorno.push(a.z+(b.z-a.z)*(y-a.y)/(b.y-a.y));
      }
    }
  });
  assert(contorno.length>0);assert(Math.min(...contorno)-esquerda>.3);assert(direita-Math.max(...contorno)>.3);
});
test('os quatro rodeiros abrangem a bitola ampliada sem alterar o diâmetro das rodas',()=>{
  for(let i=1;i<=4;i++){
    const zs=[];bonde.getObjectByName(`Rodeiro_${i}_mesh_aro_roda`).traverse(o=>{if(!o.isMesh)return;
      const p=o.geometry.attributes.position;for(let j=0;j<p.count;j++)zs.push(new THREE.Vector3().fromBufferAttribute(p,j).applyMatrix4(o.matrixWorld).z);
      const original=antes.get(o),old=new THREE.Box3().setFromBufferAttribute(original.geometria.attributes.position).applyMatrix4(original.matriz),now=box(o);
      assert(Math.abs(now.getSize(new THREE.Vector3()).y-old.getSize(new THREE.Vector3()).y)<1e-6);
    });
    for(const sinal of [-1,1]){const lado=zs.filter(z=>Math.sign(z)===sinal);assert(Math.min(...lado)<sinal*BITOLA/2-.036);assert(Math.max(...lado)>sinal*BITOLA/2+.036);}
  }
});
test('rodas e truques conservam geometria; plataforma conserva nível; cobertura libera pantógrafo',()=>{
  bonde.traverse(o=>{if(!o.isMesh)return;
    let p=o,roda=false;while(p){if(/^Truque_/.test(p.name))roda=true;p=p.parent;}
    if(roda)assert.deepEqual(o.geometry.attributes.position.array,antes.get(o).geometria.attributes.position.array);
  });
  const piso=box(estacao.getObjectByName('Piso_Plataforma'));
  // A tampa de 4 cm acima do nível 1,10 cresce menos de 3 cm.
  assert(Math.abs(piso.min.y-pisoAntes.min.y)<1e-5);
  assert(piso.max.y-pisoAntes.max.y<.029);
  const teto=box(estacao.getObjectByName('Ala_Oeste_Estrutura_telhado_metal_azul'));
  const altoBonde=box(bonde).max.y+.42;
  assert(teto.min.y-altoBonde>.4,`folga mínima: ${teto.min.y-altoBonde}`);
  assert(1.75*ESCALA_PERSONAGENS < box(bonde.getObjectByName('Carroceria')).max.y);
});
test('relógio sobe com a estação, permanece circular e ajuste é idempotente',()=>{
  const depois=box(estacao.getObjectByName('Relogio'));
  assert(depois.getSize(new THREE.Vector3()).distanceTo(relogioAntes.getSize(new THREE.Vector3()))<1e-6);
  assert(depois.min.y>relogioAntes.min.y+3);
  ajustarProporcoes(estacao,bonde);
  assert(box(estacao.getObjectByName('Relogio')).equals(depois));
});
test('relógio indica hora local com segundos, vira a hora e gira no sentido horário',()=>{
  let data=new Date(2026,10,7,12,0,0);
  const atualizar=ligarRelogio(estacao,()=>data);
  assert(angulosRelogio(data).every(a=>a===0));
  data=new Date(2026,10,7,3,15,30,500);atualizar();
  const esperado=[-(3+15/60+30.5/3600)*Math.PI/6,-(15+30.5/60)*Math.PI/30,-30.5*Math.PI/30];
  PONTEIROS.forEach((nome,i)=>assert(Math.abs(estacao.getObjectByName(nome).rotation.z-esperado[i])<1e-10));
  data=new Date(2026,10,7,0,0,0);atualizar();
  assert(PONTEIROS.every(n=>estacao.getObjectByName(n).rotation.z===0));
});
test('relógio nativo tem ciclos independentes de 60 s, 1 h e 12 h sem tocar os alvos do bonde',()=>{
  const usd=comportamentoRelogio(n=>'/Cena/'+n);
  assert.match(usd,/token type = "enter"/);
  for(const t of [60,3600,43200])assert(usd.includes(`double duration = ${t}\n`));
  assert.equal((usd.match(/bool loops = 1/g)||[]).length,3);
  assert(!usd.includes('rqbMovel'));assert(!usd.includes('rqbAlvo'));
});
