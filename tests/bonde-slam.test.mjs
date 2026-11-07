import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import * as THREE from 'three';

function harness() {
  const src=fs.readFileSync(new URL('../dilema-bonde-3d/ar/rastreador.js',import.meta.url),'utf8').replace(/^import[^\n]+\n/,'').replace('export default motor;','window.testMotor=motor;');
  let modulo,tempo=0,config,paradas=0,tiposPedidos=[],hits=[{type:'FEATURE_POINT',position:{x:0,y:0,z:-1}}];
  const parent={insertBefore(el){el.parentNode=this;},removeChild(el){el.parentNode=null;}};
  const renderer={domElement:{parentNode:parent,style:{},getBoundingClientRect:()=>({left:0,top:0,width:800,height:400})},setClearAlpha(){},setAnimationLoop(){},xr:{}};
  const camera=new THREE.PerspectiveCamera(60,2,.001,200),cena=new THREE.Scene();
  const XR8={XrController:{configure:c=>config=c,updateCameraProjectionMatrix(){},pipelineModule:()=>({}),hitTest:(_x,_y,tipos)=>{tiposPedidos=Array.from(tipos);return hits.filter(h=>tipos.includes(h.type));}},GlTextureRenderer:{pipelineModule:()=>({})},addCameraPipelineModules(ms){modulo=ms.at(-1);},run(){modulo.onStart();},stop(){paradas++;},clearCameraPipelineModules(){}};
  const window={XR8,addEventListener(){},removeEventListener(){},performance:{now:()=>tempo}};
  vm.runInNewContext(src,{THREE,window,navigator:{userAgent:'iPhone',mediaDevices:{getUserMedia(){}}},document:{createElement:()=>({style:{},setAttribute(){}}),body:{classList:{add(){},remove(){}}}},console,Promise,setTimeout:()=>1,clearTimeout(){}});
  const ra=window.testMotor.criar({renderer,camera,cena,altura:1.2});
  const frame=(t,pos={x:0,y:1.2,z:0},extra={})=>{tempo=t;modulo.onUpdate({processCpuResult:{reality:{position:pos,rotation:{x:0,y:0,z:0,w:1},intrinsics:camera.projectionMatrix.elements.slice(),trackingStatus:'NORMAL',trackingReason:'UNSPECIFIED',...extra}}});};
  return {ra,camera,cena,frame,config:()=>config,paradas:()=>paradas,setHits:v=>hits=v,tipos:()=>tiposPedidos};
}

test('SLAM libera ponto visual com pose NORMAL sem exigir deslocamento adicional',async()=>{
  const h=harness();await h.ra.entrar({slam:true});
  assert.equal(h.config().scale,'responsive');assert.equal(h.config().disableWorldTracking,false);assert.equal(h.camera.position.y,1.2);
  h.frame(0,undefined,{trackingStatus:'LIMITED',trackingReason:'INITIALIZING'});assert(!h.ra.estado().temMira);
  h.frame(100);assert(h.ra.estado().pronto);assert(h.ra.estado().temMira);
  assert(h.tipos().includes('FEATURE_POINT'));assert.equal(h.ra.pose().elements[14],-1);
  h.frame(1100,undefined,{trackingStatus:undefined});assert(!h.ra.estado().rastreando);assert(!h.ra.estado().temMira);
  h.frame(1200,undefined,{position:undefined});assert(!h.ra.estado().pronto);
  await h.ra.sair();
});
test('câmera se aproxima e modelo no mundo cresce na projeção sem recuar ou mudar a escala',async()=>{
  const h=harness();await h.ra.entrar({slam:true});h.frame(0);h.frame(800,{x:.03,y:1.2,z:0});
  const ancora=new THREE.Group();ancora.matrix.copy(h.ra.pose());ancora.matrix.decompose(ancora.position,ancora.quaternion,ancora.scale);h.cena.add(ancora);
  const fixa=ancora.position.clone(),escala=ancora.scale.clone();
  const largura=()=>{h.cena.updateMatrixWorld(true);return new THREE.Vector3(.4,0,0).applyMatrix4(ancora.matrixWorld).project(h.camera).x-new THREE.Vector3(-.4,0,0).applyMatrix4(ancora.matrixWorld).project(h.camera).x;};
  const antes=largura();
  h.setHits([{type:'DETECTED_SURFACE',position:{x:2,y:0,z:-5}}]);
  h.frame(850,{x:.03,y:1.2,z:-.2});
  assert(largura()>antes*1.2);assert(ancora.position.equals(fixa));assert(ancora.scale.equals(escala));
  assert.equal(h.ra.pose().elements[12],2,'mover a mira não move a âncora colocada');
  await h.ra.sair();
});
test('perda de rastreio bloqueia mira; recuperação aceita pontos visuais válidos',async()=>{
  const h=harness();await h.ra.entrar({slam:true});h.frame(0);h.frame(800,{x:.04,y:1.2,z:0});
  h.frame(900,undefined,{trackingStatus:'LIMITED'});assert(!h.ra.estado().pronto);
  h.setHits([{type:'FEATURE_POINT',position:{x:NaN,y:0,z:-1}}]);
  h.frame(1000);h.frame(1800);assert(h.ra.estado().pronto);assert(!h.ra.estado().temMira);
  h.setHits([{type:'FEATURE_POINT',position:{x:0,y:0,z:-1}}]);h.frame(1850);assert(h.ra.estado().temMira);
  await h.ra.sair();
});
test('três entradas SLAM reiniciam a calibração e liberam a câmera na saída',async()=>{
  const h=harness();
  for(let i=0;i<3;i++) {
    await h.ra.entrar({slam:true});assert(!h.ra.estado().pronto);h.frame(i*2000);h.frame(i*2000+800,{x:.04,y:1.2,z:0});assert(h.ra.estado().temMira);
    await h.ra.sair();assert(!h.ra.ativo());assert(!h.ra.estado().temMira);
  }
  assert.equal(h.paradas(),3);
});
