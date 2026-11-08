import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import * as THREE from '../dilema-bonde-3d/vendor/three/three.module.js';

import * as configuracao from '../dilema-bonde-3d/js/configuracao.js';
const entrada = fs.readFileSync(new URL('../dilema-bonde-3d/ar/entrada.js',import.meta.url),'utf8');
const html = fs.readFileSync(new URL('../dilema-bonde-3d/ar/index.html',import.meta.url),'utf8');
async function harness({ua='iPhone',platform='',touch=0,ar=true,top=false,search='',standalone=false,displayMode=false,load=async()=>{throw Error('importação inesperada');}}={}) {
  const events={}, imports=[], revoked=[], clicked=[];
  class Element {
    hidden=false; disabled=false; textContent=''; children=[]; attrs={}; events={};
    relList={supports:()=>ar};
    set href(v){this.attrs.href=v;} get href(){return this.attrs.href;}
    set rel(v){this.attrs.rel=v;} get rel(){return this.attrs.rel;}
    setAttribute(k,v){this.attrs[k]=v;} getAttribute(k){return this.attrs[k]??null;}
    hasAttribute(k){return k in this.attrs;} removeAttribute(k){delete this.attrs[k];}
    addEventListener(k,f){this.events[k]=f;} appendChild(e){this.children.push(e);return e;}
    click(){clicked.push(this);} remove(){}
  }
  const els=Object.fromEntries(['nativo','web','linkAR','statusAR','trocarAR','paresAR','comecar','estadoEntrada','voltarNativo','instalarRA','qualidadeEntrada','instrucaoAR'].map(id=>[id,new Element()]));
  els.web.hidden=true;els.trocarAR.hidden=true;els.linkAR.href='maquete.usdz?v=20261107-ra1';els.linkAR.rel='ar';els.paresAR.textContent='rodada padrão';
  const doc={getElementById:id=>els[id],createElement:()=>new Element(),body:new Element()};
  const window={matchMedia:()=>({matches:displayMode})};window.top=top?{document:doc}:window;
  const U=class extends URL {};U.revokeObjectURL=x=>revoked.push(x);
  await vm.runInNewContext(entrada.replace(/\bimport\(/g,'__import('),{
    document:doc,window,navigator:{userAgent:ua,platform,maxTouchPoints:touch,standalone},location:{search},URLSearchParams,URL:U,
    __import:async url=>{if(url.includes('configuracao.js'))return configuracao;if(url.includes('menu.js'))return {criarMenu:()=>({})};imports.push(url);return load(url);},console:{warn(){}},setTimeout:()=>0,addEventListener:(n,f)=>{events[n]=f;},
    WebGLRenderingContext:class{constructor(){throw Error('WebGL proibido no caminho nativo');}}
  });
  return {els,imports,revoked,clicked,events};
}

test('entrada nativa já está no HTML, sem depender de WebGL, com uma única imagem no link',()=>{
  const a=html.match(/<a id="linkAR"[^>]*>([\s\S]*?)<\/a>/)[1];
  assert.match(a,/^<img[^>]+>$/);assert.doesNotMatch(html,/WebGLRenderer|type="module"/);
  assert.match(html,/rel="ar" href="maquete\.usdz\?v=/);
});
for(const opts of [{ua:'iPhone'},{ua:'iPad'},{ua:'Macintosh',platform:'MacIntel',touch:5},{ua:'future-device',ar:true}])
test('entrada nativa não baixa módulos 3D nem pede câmera: '+JSON.stringify(opts),async()=>{
  const {els,imports}=await harness(opts);assert.equal(els.web.hidden,true);assert.equal(els.trocarAR.hidden,false);assert.equal(els.linkAR.rel,'ar');assert.equal(imports.length,0);
});
test('detecção negativa em navegador interno não transforma RA em download comum',async()=>{
  const {els}=await harness({ar:false});assert.equal(els.linkAR.rel,'ar');assert.match(els.statusAR.textContent,/Safari/);
});
test('iframe abre link AR pelo documento superior no mesmo toque',async()=>{
  const {els,clicked}=await harness({top:true,load:async()=>({prepararPersonagens:async()=>({url:'blob:pronta',descricao:'rodada'})})});await els.trocarAR.onclick();let prevented=false;
  els.linkAR.events.click({preventDefault(){prevented=true;}});
  assert(prevented);assert.equal(clicked.length,1);assert.equal(clicked[0].rel,'ar');assert.equal(clicked[0].children.length,1);
});
test('troca nativa bloqueia toque durante preparo e preserva a última rodada em falha',async()=>{
  let finish, count=0;
  const h=await harness({load:async()=>({prepararPersonagens:()=>{count++;return count===1?new Promise(r=>finish=r):Promise.reject(Error('offline'));}})});
  const pending=h.els.trocarAR.onclick();await new Promise(resolve=>setImmediate(resolve));
  let prevented=false;h.els.linkAR.events.click({preventDefault(){prevented=true;}});assert(prevented);assert(h.els.trocarAR.disabled);
  finish({url:'blob:nova',descricao:'nova rodada'});await pending;
  assert.equal(h.els.linkAR.href,'blob:nova#allowsContentScaling=1');assert.equal(h.els.linkAR.getAttribute('download'),'dilema-bonde.usdz');
  await h.els.trocarAR.onclick();assert.equal(h.els.linkAR.href,'blob:nova#allowsContentScaling=1');assert.equal(h.els.paresAR.textContent,'nova rodada');
  assert.equal(h.els.trocarAR.disabled,false);assert.equal(h.els.linkAR.hasAttribute('aria-disabled'),false);assert.deepEqual(h.revoked,[]);
});
test('substituir uma rodada libera apenas o blob anterior e retorno por cache preserva o atual',async()=>{
  let n=0;const h=await harness({load:async()=>({prepararPersonagens:async()=>({url:'blob:'+ ++n,descricao:'rodada '+n})})});
  await h.els.trocarAR.onclick();await h.els.trocarAR.onclick();assert.deepEqual(h.revoked,['blob:1']);
  h.events.pagehide({persisted:true});assert.deepEqual(h.revoked,['blob:1']);h.events.pagehide({persisted:false});assert.deepEqual(h.revoked,['blob:1','blob:2']);
});
test('falha de preparo web permite nova tentativa; abertura usa gesto sem esperar outro preparo',async()=>{
  let n=0,gesture=false,called=false;
  const h=await harness({ua:'Android',ar:false,load:async()=>({preparar:async()=>{if(++n===1)throw Error('WebGL indisponível');return {qualidade:'auto',entrar(){called=gesture;return Promise.reject(Object.assign(Error('denied'),{name:'NotAllowedError'}));}};}})});
  assert(h.els.nativo.hidden);assert(!h.els.web.hidden);
  await h.els.comecar.onclick();assert.equal(h.els.comecar.disabled,false);assert.match(h.els.estadoEntrada.textContent,/tentar novamente/);
  await h.els.comecar.onclick();assert.match(h.els.comecar.textContent,/Abrir/);
  gesture=true;const run=h.els.comecar.onclick();gesture=false;await run;
  assert(called);assert.equal(n,2);assert.equal(h.els.comecar.disabled,false);assert.match(h.els.estadoEntrada.textContent,/não foram autorizados/);
});

test('iPhone pode escolher controles fixos e retornar ao nativo sem carregar WebGL antecipadamente',async()=>{
  const {els,imports}=await harness({search:'?modo=interativo'});
  assert(els.nativo.hidden);assert(!els.web.hidden);assert(!els.voltarNativo.hidden);assert.equal(imports.length,0);
  assert.match(html,/maquete\.usdz\?v=[^"#]+#allowsContentScaling=1/);
});

for (const opts of [{standalone:true},{displayMode:true}])
test('abrir pelo ícone entra no modo interativo e não pede nova instalação: '+JSON.stringify(opts),async()=>{
  const {els,imports}=await harness(opts);
  assert(els.nativo.hidden);assert(!els.web.hidden);assert(els.instalarRA.hidden);assert.equal(imports.length,0);
});
test('app instalado preserva a escolha explícita do visualizador nativo',async()=>{
  const {els}=await harness({standalone:true,search:'?modo=nativo'});
  assert(els.web.hidden);assert(!els.nativo.hidden);assert(els.instalarRA.hidden);
});
test('instrução de abrir sem barras aparece no Safari interativo, sem bloquear o preparo',async()=>{
  const {els}=await harness({search:'?modo=interativo'});
  assert(!els.instalarRA.hidden);assert(els.instalarRA.open);assert(!els.comecar.disabled);
});
test('ícone inicia no bonde interativo, dentro do escopo instalado, com identidade própria',()=>{
  const manifesto=JSON.parse(fs.readFileSync(new URL('../dilema-bonde-3d/ar/manifest.webmanifest',import.meta.url),'utf8'));
  const base=new URL('https://lab-ra.dragongames.dev.br/dilema-bonde-3d/ar/');
  const start=new URL(manifesto.start_url,base),scope=new URL(manifesto.scope,base);
  assert.equal(manifesto.display,'standalone');assert.equal(start.searchParams.get('modo'),'interativo');
  assert(start.href.startsWith(scope.href));assert.equal(new URL(manifesto.id,base).pathname,base.pathname);
});

test('motor: pedido XR síncrono, colocação, saída e reentrada liberam hit-test',async()=>{
  const src=fs.readFileSync(new URL('../dilema-bonde-3d/ar/rastreador.js',import.meta.url),'utf8').replace(/^import[^\n]+\n/,'').replace('export default motor;','window.testMotor = motor;');
  let requested=0,cancelled=0;const sessions=[];
  const window={addEventListener(){},removeEventListener(){},performance:{now:()=>0}};
  const navigator={userAgent:'Android',mediaDevices:{getUserMedia(){}},xr:{requestSession(){requested++;const events={};const s={addEventListener:(k,f)=>events[k]=f,requestReferenceSpace:async()=>({}),requestHitTestSource:async()=>({cancel(){cancelled++;}}),end:async()=>events.end()};sessions.push(s);return Promise.resolve(s);}}};
  const renderer={domElement:{style:{},getBoundingClientRect:()=>({left:0,top:0,width:400,height:800})},setClearAlpha(){},xr:{setReferenceSpaceType(){},setSession:async()=>{},getReferenceSpace:()=>({})}};
  vm.runInNewContext(src,{THREE,window,navigator,document:{body:{classList:{add(){},remove(){}}}},console,setTimeout:()=>0,Promise});
  const ra=window.testMotor.criar({renderer,camera:new THREE.PerspectiveCamera(),cena:new THREE.Scene()});
  for(let i=0;i<3;i++){
    const entering=ra.entrar({webxr:true});assert.equal(requested,i+1);await entering;assert(ra.ativo());
    ra.quadro({getHitTestResults:()=>[{getPose:()=>({transform:{position:{x:1,y:0,z:-2}}})}]});
    assert(ra.estado().temMira);assert.equal(ra.pose().elements[12],1);
    await ra.sair();assert.equal(ra.ativo(),false);assert.equal(cancelled,i+1);
  }
});

test('primeiro toque nativo prepara grupos variáveis e segundo abre o blob no gesto',async()=>{
 let gerar=0;const h=await harness({load:async()=>({prepararPersonagens:async c=>{gerar++;assert.notEqual(c.principal,c.ramal);return {url:'blob:entrada'+gerar,descricao:'1 Trabalhador'};}})});
 let bloqueado=false;h.els.linkAR.events.click({preventDefault(){bloqueado=true;}});assert(bloqueado);
 await new Promise(r=>setImmediate(r));assert.equal(gerar,1);assert.equal(h.els.linkAR.href,'blob:entrada1#allowsContentScaling=1');
 bloqueado=false;h.els.linkAR.events.click({preventDefault(){bloqueado=true;}});assert(!bloqueado);assert.equal(gerar,1);
 h.els.linkAR.events.click({preventDefault(){}});await new Promise(r=>setImmediate(r));assert.equal(gerar,2);
});
