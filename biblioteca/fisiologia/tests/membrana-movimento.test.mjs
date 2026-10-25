import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {DURACAO,estadoPelicula,estadoTransporte} from '../celula/membrana/ciclo.js';
const read=p=>fs.readFileSync(new URL('../celula/'+p,import.meta.url),'utf8');
function glb(mode){const b=fs.readFileSync(new URL('../celula/membrana/assets/'+mode+'-v1.glb',import.meta.url));const l=b.readUInt32LE(12),g=JSON.parse(b.toString('utf8',20,20+l)),bin=b.subarray(28+l);return {b,g,arr(i){const a=g.accessors[i],v=g.bufferViews[a.bufferView],n={SCALAR:1,VEC3:3,VEC4:4}[a.type];assert.equal(a.componentType,5126);return Array.from({length:a.count*n},(_,j)=>bin.readFloatLE((v.byteOffset||0)+(a.byteOffset||0)+j*4));}};}
test('película completa o ciclo e retorna exatamente ao repouso',()=>{
 assert.equal(DURACAO,16);assert.equal(estadoPelicula(0).potencial,-70);assert.equal(estadoPelicula(7).potencial,35);assert.deepEqual(estadoPelicula(16),estadoPelicula(0));
 for(let t=0;t<16;t+=.01)assert(estadoPelicula(t).potencial>=-70&&estadoPelicula(t).potencial<=35);
});
test('transportador nunca abre as duas faces ao mesmo tempo',()=>{
 for(let t=0;t<16;t+=.005){const e=estadoTransporte(t);assert(e.fora*e.dentro<1e-8);assert(e.glicose>=0&&e.glicose<=1);}
 assert.deepEqual(estadoTransporte(16),estadoTransporte(0));
});
for(const mode of ['pelicula','travessias'])test(mode+': arquivo animado portátil, com todos os quadros e sem extensões obrigatórias',()=>{
 const {b,g,arr}=glb(mode);assert.equal(b.toString('ascii',0,4),'glTF');assert.equal(b.readUInt32LE(8),b.length);assert(b.length<15*1024*1024);assert(!g.extensionsRequired?.length);assert.equal(g.animations.length,1);
 const anim=g.animations[0];assert(anim.channels.length>=90);
 for(const s of anim.samplers){const t=arr(s.input),v=arr(s.output);assert.equal(t[0],0);assert.equal(t.at(-1),16);assert(t.every((v,i)=>!i||v>t[i-1]));assert(v.every(Number.isFinite));}
 for(const mesh of g.meshes)for(const p of mesh.primitives){assert('indices'in p);assert(!('COLOR_0'in p.attributes));}
});
test('as cargas da Película não atravessam a bicamada na animação gravada',()=>{
 const {g,arr}=glb('pelicula');let count=0;
 for(const ch of g.animations[0].channels){if(ch.target.path!=='translation')continue;const name=g.nodes[ch.target.node].name;if(!/movel_\d+$/.test(name))continue;const v=arr(g.animations[0].samplers[ch.sampler].output);const sign=Math.sign(v[1]);for(let i=1;i<v.length;i+=3)assert.equal(Math.sign(v[i]),sign);count++;}
 assert.equal(count,96);
});
test('bomba exportada possui três Na para fora e dois K para dentro',()=>{
 const {g,arr}=glb('travessias');
 for(const [role,expected,direction] of [['naBomba',3,-1],['kBomba',2,1]]){
  const ch=g.animations[0].channels.filter(c=>c.target.path==='translation'&&g.nodes[c.target.node].name.includes('movel_'+role+'_'));
  assert.equal(ch.length,expected);
  for(const c of ch){const s=g.animations[0].samplers[c.sampler],t=arr(s.input),v=arr(s.output);const start=role==='naBomba'?1.6:5.6,end=role==='naBomba'?3.6:7.6;const a=t.findIndex(x=>x>=start),b=t.findIndex(x=>x>=end);assert((v[b*3+1]-v[a*3+1])*direction>2.5);}
 }
});
function harness(platform='android',webgl=true){
 const elements=new Map(),events={},posts=[],clicks=[];
 class El{constructor(id){this.id=id;this.attributes={};this.listeners={};this.style={};this.disabled=false;this.hidden=false;this.value=id==='speed'?'1':'0';this.currentTime=0;this.canActivateAR=true;this.classList={toggle(){}};}setAttribute(k,v){this.attributes[k]=v;}getAttribute(k){return this.attributes[k]??null;}hasAttribute(k){return k in this.attributes;}addEventListener(k,fn){(this.listeners[k]??=[]).push(fn);}dispatch(k,detail){for(const f of this.listeners[k]||[])f({detail});}append(){}replaceChildren(){}remove(){}click(){clicks.push(this);this.onclick?.();}play(){this.paused=false;}pause(){this.paused=true;}activateAR(){this.activated=(this.activated||0)+1;return Promise.resolve();}getContext(){return webgl?{getExtension:()=>null}:null;}getBoundingClientRect(){return {height:1300};}jumpCameraToGoal(){}}
 const el=id=>{if(!elements.has(id))elements.set(id,new El(id));return elements.get(id);};
 const document={getElementById:el,querySelector:el,createElement:tag=>new El(tag),body:new El('body'),hidden:false};
 const parent={postMessage:(d,o)=>posts.push([d,o])};
 const context=vm.createContext({document,parent,window:{top:{document}},location:{href:'https://example.test/ra/celula/membrana.html?nivel=4',origin:'https://example.test',search:'?nivel=4'},URL,URLSearchParams,console,setTimeout(){},matchMedia:()=>({matches:false}),nativePlatform:()=>platform,requestAnimationFrame:()=>1,cancelAnimationFrame(){},ResizeObserver:class{constructor(cb){this.cb=cb;}observe(){this.cb();}},addEventListener:(t,fn)=>events[t]=fn,DURACAO,estadoPelicula,estadoTransporte});
 const source=read('membrana/app.js').replace(/^import .*;\n/gm,'').replaceAll('import.meta.url',"'https://example.test/ra/celula/membrana/app.js'");
 vm.runInContext(source,context);
 return {el,events,parent,clicks,context};
}
test('Android espera o modelo e só ativa RA diretamente no clique',()=>{
 const h=harness(),v=h.el('membrane-model'),b=h.el('launch-ar');assert(b.disabled);b.click();assert(!v.activated);
 v.dispatch('load',{url:v.getAttribute('src')});assert(!b.disabled);b.click();assert.equal(v.activated,1);assert.equal(v.timeScale,1);
});
test('iPhone abre USDZ público mesmo se a prévia WebGL falhar',()=>{
 const h=harness('ios');assert(!h.el('launch-ar').disabled);h.el('membrane-model').dispatch('error');h.el('launch-ar').click();const a=h.clicks.find(c=>c.id==='a');assert.equal(a.rel,'ar');assert.match(a.href,/pelicula-v1\.usdz$/);
});
test('troca de aba descarta carregamento antigo e atualiza a RA',()=>{
 const h=harness(),v=h.el('membrane-model'),old=v.getAttribute('src');
 h.events.message({origin:'https://outro.test',source:h.parent,data:{type:'celula-nivel',nivel:4}});assert.equal(v.getAttribute('src'),old);
 h.events.message({origin:'https://example.test',source:h.parent,data:{type:'celula-nivel',nivel:4}});assert.match(v.getAttribute('src'),/travessias-v1.glb$/);assert.match(v.getAttribute('ios-src'),/travessias-v1.usdz$/);
 v.dispatch('load',{url:old});assert(h.el('launch-ar').disabled);v.dispatch('load',{url:v.getAttribute('src')});assert(!h.el('launch-ar').disabled);
});
test('pausa, velocidade, instante e visibilidade controlam a animação',()=>{
 const h=harness(),v=h.el('membrane-model');v.dispatch('load',{url:v.getAttribute('src')});assert(!v.paused);
 h.el('play').click();assert(v.paused);h.el('speed').value='.5';h.el('speed').onchange();assert.equal(v.timeScale,.5);
 h.el('timeline').value='7';h.el('timeline').oninput();assert.equal(v.currentTime,7);assert(v.paused);assert.match(h.el('phase').textContent,/Interior positivo/);
 h.el('restart').click();assert.equal(v.currentTime,0);assert(!v.paused);
 h.events.message({origin:'https://example.test',source:h.parent,data:{type:'membrana-visibilidade',ativa:false}});assert(v.paused);
});
test('erro libera nova tentativa e navegadores sem RA não mostram botão ativo',()=>{
 const h=harness(),v=h.el('membrane-model');v.dispatch('error');assert(h.el('launch-ar').disabled);assert(!h.el('retry').hidden);h.el('retry').click();assert.match(v.getAttribute('src'),/tentativa=1/);v.canActivateAR=false;v.dispatch('load',{url:v.getAttribute('src')});assert(h.el('launch-ar').disabled);assert(!h.el('play').disabled);
});
test('sem botão RA duplicado; laboratório mantém Goldman e explica seu escopo',()=>{
 const html=read('membrana.html'),lab=read('laboratorio-membrana.html');assert.match(html,/slot="ar-button" hidden/);assert.match(html,/id="investigate"/);assert.match(html,/não são transferidos/);assert.match(lab,/id="goldmanBox"/);assert.match(lab,/\.ra-box,.topbar/);assert.doesNotMatch(html,/ra-ios.js/);
});

test('sem WebGL mostra prévia explícita, sem carregamento infinito, e preserva Quick Look',()=>{
 const h=harness('ios',false);assert.equal(h.el('phase').textContent,'Prévia do modelo');assert(!h.el('model-poster').hidden);assert.match(h.el('model-poster').src,/pelicula-v1.webp$/);assert(!h.el('launch-ar').disabled);assert(h.el('play').disabled);
 const a=harness('android',false);assert(a.el('launch-ar').disabled);assert(!a.el('membrane-model').getAttribute('src'));
});
