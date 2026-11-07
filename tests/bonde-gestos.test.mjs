import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { ligarGestos } from '../dilema-bonde-3d/ar/gestos.js';
import { ARAUCARIAS_RA } from '../dilema-bonde-3d/js/vegetacao-ra.js';
import { ROTAS } from '../dilema-bonde-3d/js/cena.js';

function preparar() {
  const handlers={}, taps=[];
  const elemento={addEventListener:(n,f)=>handlers[n]=f,getBoundingClientRect:()=>({left:0,top:0,width:400,height:800})};
  const alvo=new THREE.Group(), camera=new THREE.PerspectiveCamera(60,.5,.001,200);
  camera.position.set(0,2,2);camera.lookAt(0,0,0);camera.updateMatrixWorld(true);
  let permitido=true;
  const gestos=ligarGestos({elemento,alvo,camera:()=>camera,podeMover:()=>permitido,aoToque:(...xy)=>taps.push(xy)});
  const event=(tipo,id,x,y)=>handlers[tipo]({pointerId:id,clientX:x,clientY:y,button:0});
  return {alvo,camera,gestos,event,taps,handlers,desabilitar:()=>permitido=false};
}
test('arrastar move livremente no plano e não dispara a alavanca',()=>{
  const h=preparar();h.event('pointerdown',1,200,400);h.event('pointermove',1,300,500);h.event('pointerup',1,300,500);
  assert(h.alvo.position.x>.2);assert(h.alvo.position.z>.2);assert(Math.abs(h.alvo.position.y)<1e-9);assert.equal(h.taps.length,0);
});
test('pinça aumenta 2x, reduz e gira sem alterar o plano ou disparar toque',()=>{
  const h=preparar();h.event('pointerdown',1,150,400);h.event('pointerdown',2,250,400);
  h.event('pointermove',1,100,400);h.event('pointermove',2,300,400);assert.equal(h.alvo.scale.x,2);
  h.event('pointermove',1,200,350);h.event('pointermove',2,200,450);
  assert.equal(h.alvo.scale.x,1);assert(Math.abs(new THREE.Euler().setFromQuaternion(h.alvo.quaternion).y+Math.PI/2)<1e-6);
  h.event('pointerup',2,200,450);const pos=h.alvo.position.clone();
  h.event('pointermove',1,200,350);assert(h.alvo.position.distanceTo(pos)<1e-9);
  h.event('pointerup',1,200,350);assert.equal(h.taps.length,0);
});
test('pinça aceita escala muito além do tamanho original; restaurar mantém localização e rotação',()=>{
  const h=preparar();h.alvo.position.set(3,0,-4);h.alvo.rotation.y=1;
  h.gestos.ampliar(12);assert.equal(h.alvo.scale.x,12);
  h.gestos.ampliar(.005);assert.equal(h.alvo.scale.x,.06);
  h.gestos.restaurarTamanho();assert.equal(h.alvo.scale.x,1);assert.deepEqual(h.alvo.position.toArray(),[3,0,-4]);assert.equal(h.alvo.rotation.y,1);
});
test('toque simples continua disponível para colocação; cancelamento e saída não selecionam',()=>{
  const h=preparar();h.desabilitar();h.event('pointerdown',1,200,400);h.event('pointerup',1,200,400);assert.equal(h.taps.length,1);
  h.event('pointerdown',1,200,400);h.event('pointercancel',1,200,400);assert.equal(h.taps.length,1);
  h.event('pointerdown',1,200,400);h.gestos.limpar();h.event('pointerup',1,200,400);assert.equal(h.taps.length,1);assert(!h.gestos.ocupado());
  h.gestos.ampliar(2);assert.equal(h.alvo.scale.x,1);
});
test('toque DOM não dispara uma segunda seleção XR',()=>{
  const h=preparar();let cancelado=false;h.handlers.beforexrselect({preventDefault:()=>cancelado=true});assert(cancelado);
});
test('aproximar ou girar o celular durante um gesto não transporta a maquete',()=>{
  const h=preparar();h.event('pointerdown',1,200,400);h.event('pointermove',1,230,410);
  const pos=h.alvo.position.clone(), tamanho=h.alvo.scale.clone(), rot=h.alvo.quaternion.clone();
  for(let i=0;i<6;i++) {
    h.camera.position.z-=.1;h.camera.position.x+=.05;h.camera.rotation.y+=.025;h.camera.updateMatrixWorld(true);
    h.event('pointermove',1,230,410);
    assert(h.alvo.position.distanceTo(pos)<1e-10);
  }
  assert(h.alvo.scale.equals(tamanho));assert(h.alvo.quaternion.equals(rot));
  h.event('pointerdown',2,300,410);
  h.camera.position.z-=.2;h.camera.updateMatrixWorld(true);
  h.event('pointermove',2,300,410);assert(h.alvo.position.distanceTo(pos)<1e-10);
  h.event('pointerup',2,300,410);h.event('pointerup',1,230,410);
  assert.equal(h.taps.length,0);
});
test('duas araucárias ficam fora de ambos os trilhos e das zonas de interação',()=>{
  assert.equal(ARAUCARIAS_RA.length,2);
  for(const a of ARAUCARIAS_RA) {
    for(const rota of Object.values(ROTAS)) {
      let distancia=Infinity;
      for(let i=0;i<=2000;i++){const p=rota.getPointAt(i/2000);distancia=Math.min(distancia,Math.hypot(a.x-p.x,a.z-p.z));}
      assert(distancia>8,`folga aos trilhos: ${distancia}`);
    }
    for(const [x,z] of [[-45,35],[0,30],[0,14],[6,20]]) assert(Math.hypot(a.x-x,a.z-z)>30);
    assert(Math.abs(a.x)<78 && a.z>-46 && a.z<48);
  }
});
