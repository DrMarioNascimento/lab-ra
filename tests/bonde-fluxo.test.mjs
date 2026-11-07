import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import * as THREE from 'three';
import { ligarGestos } from '../dilema-bonde-3d/ar/gestos.js';
import { criarAvisos } from '../dilema-bonde-3d/ar/avisos.js';

import {lerConfig,grupos,mudaRodada} from '../dilema-bonde-3d/js/configuracao.js';
import {PERFIS} from '../dilema-bonde-3d/js/qualidade.js';
import {criarRodada} from '../dilema-bonde-3d/js/rodada.js';
// Integra entrada na câmera, motor e controles de produção. Substitui somente
// DOM/GPU, câmera física e modelo (a cena real é verificada em bonde-cena).
// O motor simulado fornece apenas FEATURE_POINT e respeita o filtro solicitado.
test('ponto visual libera Colocar aqui, apresenta a maquete e mantém âncora ao mover câmera',async()=>{
  class Element {
    style={};hidden=false;disabled=false;textContent='';events={};
    classList={add(){},remove(){},toggle(){}};
    addEventListener(n,fn){this.events[n]=fn;}
    setAttribute(){}
    append(){}
    getBoundingClientRect(){return {left:0,top:0,width:400,height:800};}
    click(){if(!this.disabled)return this.onclick?.();}
  }
  const parent={insertBefore(el){el.parentNode=this;},removeChild(el){el.parentNode=null;}};
  const ids=['cena','overlay','inicio','aviso','manter','desviar','play','reset','colocar','crono','diminuir','aumentar','tamanho','ajustes','ajudaRA','comecar','sair'];
  const el=Object.fromEntries(ids.map(id=>[id,new Element()]));el.cena.parentNode=parent;
  let pipeline,renderer,t=0;
  class Renderer {
    constructor({canvas}){this.domElement=canvas;this.xr={setFramebufferScaleFactor(){}};renderer=this;}
    setPixelRatio(){}setClearAlpha(){}setClearColor(){}setAnimationLoop(){}setSize(){}dispose(){}
    render(scene,camera){this.scene=scene;this.camera=camera;}
  }
  const XR8={
    XrController:{configure(){},updateCameraProjectionMatrix(){},pipelineModule:()=>({}),
      hitTest:(_x,_y,types)=>types.includes('FEATURE_POINT')?[{type:'FEATURE_POINT',position:{x:0,y:0,z:-1}}]:[]},
    GlTextureRenderer:{pipelineModule:()=>({})},addCameraPipelineModules(ms){pipeline=ms.at(-1);},
    run(){pipeline.onStart();},stop(){},clearCameraPipelineModules(){}
  };
  const window={XR8,performance:{now:()=>t},addEventListener(){},removeEventListener(){}};
  const model={root:new THREE.Group(),rota:'principal',estado:{rodando:false,travado:false},reiniciar(){},update(){},partir(){},definirRota(){return true;}};
  const sandbox={THREE:{...THREE,WebGLRenderer:Renderer},window,navigator:{userAgent:'iPhone',mediaDevices:{getUserMedia(){}}},
    document:{getElementById:id=>el[id],createElement:()=>new Element(),body:new Element(),documentElement:{}},
    URLSearchParams,location:{search:''},devicePixelRatio:1,innerWidth:400,innerHeight:800,addEventListener(){},setTimeout:()=>1,clearTimeout(){},Promise,console,
    lerConfig,grupos,mudaRodada,PERFIS,criarRodada,qualidadeDoAparelho:()=>"equilibrada",adaptarResolucao:()=>()=>{},criarRotulos:()=>({atualizar(){}}),criarSom:()=>({tocar(){}}),
    criarMenu:({aoAbrir,aoFechar})=>({aberta:()=>false,controles:new Element(),limparResultado(){},fechar(){aoFechar();},abrir(){aoAbrir();}}),
    criarMaquete:async()=>model,ligarGestos,criarAvisos:elemento=>criarAvisos(elemento,{agendar:()=>1,cancelar(){}})};
  const context=vm.createContext(sandbox);
  const motor=fs.readFileSync(new URL('../dilema-bonde-3d/ar/rastreador.js',import.meta.url),'utf8').replace(/^import[^\n]+\n/,'').replace('export default motor;','');
  const web=fs.readFileSync(new URL('../dilema-bonde-3d/ar/web.js',import.meta.url),'utf8').replace(/^import[^\n]+\n/gm,'').replace('export async function preparar','async function preparar');
  const inter=fs.readFileSync(new URL('../dilema-bonde-3d/js/interface.js',import.meta.url),'utf8').replace(/^import[^\n]+\n/gm,'').replace('export function ligarInterface','function ligarInterface');
  vm.runInContext(motor+'\n'+inter+'\n'+web+'\nwindow.prepararApp=preparar;',context);
  const app=await window.prepararApp({informar(){}});await app.entrar();
  const lens=new THREE.PerspectiveCamera(60,.5,.001,200).projectionMatrix.elements;
  const frame=(status,position={x:0,y:1.2,z:0})=>{
    t+=50;pipeline.onUpdate({processCpuResult:{reality:{trackingStatus:status,trackingReason:status==='NORMAL'?'UNSPECIFIED':'INITIALIZING',intrinsics:lens,position,rotation:{x:0,y:0,z:0,w:1}}}});pipeline.onRender();
  };
  frame('LIMITED');assert(el.colocar.disabled);assert(el.play.disabled);
  frame('NORMAL');assert(!el.colocar.disabled,'FEATURE_POINT deve habilitar o botão real');
  el.colocar.click();frame('NORMAL');
  const ancora=renderer.scene.children.find(o=>o.isGroup);
  assert(ancora.visible);assert(!el.play.disabled);assert.equal(el.colocar.textContent,'Recolocar');
  const pos=ancora.position.clone(),scale=ancora.scale.clone();
  frame('NORMAL',{x:0,y:1.2,z:-.2});assert(ancora.position.equals(pos));assert(ancora.scale.equals(scale));assert.equal(renderer.camera.position.z,-.2);
  frame('LIMITED');assert(!ancora.visible);assert(el.play.disabled);
  frame('NORMAL',{x:0,y:1.2,z:-.2});assert(ancora.visible);assert(ancora.position.equals(pos));assert(!el.play.disabled);
  await el.sair.click();assert(el.overlay.hidden);assert(!el.inicio.hidden);
});
