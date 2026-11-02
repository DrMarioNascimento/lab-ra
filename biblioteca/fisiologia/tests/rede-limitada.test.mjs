import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const base=new URL('../',import.meta.url),source=fs.readFileSync(new URL('ciclo-portatil.js',base),'utf8');
function setup(ua='iPhone',{delay=false}={}){
 const elements=[],requests=[];let resolve;
 class Element{constructor(tag){this.tag=tag;this.style={};this.dataset={};this.attrs={};this.events={};this.children=[];this.value='';this.hidden=false;elements.push(this);}setAttribute(k,v){this.attrs[k]=v;}getAttribute(k){return this.attrs[k]??null;}removeAttribute(k){delete this.attrs[k];}hasAttribute(k){return k in this.attrs;}addEventListener(n,f){this.events[n]=f;}append(...xs){this.children.push(...xs);if(this.tag==='select'&&!this.value&&xs[0])this.value=xs[0].value;}play(){}pause(){}closest(){return null;}remove(){}click(){} }
 const host=new Element('main'),head=new Element('head'),body=new Element('body');
 const document={head,body,documentElement:{classList:{add(){},remove(){}}},createElement:t=>new Element(t),querySelector:()=>host,querySelectorAll:()=>[],addEventListener(){},hidden:false};
 const context={document,navigator:{userAgent:ua,platform:'',maxTouchPoints:0},URL,console,setTimeout(){},IntersectionObserver:class{observe(){}},MutationObserver:class{observe(){}},fetch:async(url)=>{requests.push(String(url));if(delay)return new Promise(r=>resolve=r);return{ok:true};}};
 vm.createContext(context);vm.runInContext(source.replace('export function instalarCicloPortatil','function instalarCicloPortatil').replaceAll('import.meta.url',JSON.stringify('https://example.test/ra/ciclo-portatil.js')),context);
 context.instalarCicloPortatil({experiencia:'coracao',niveis:[1,2]});
 const button=text=>elements.find(x=>x.tag==='button'&&x.textContent===text);
 return{elements,requests,context,button,viewer:elements.find(x=>x.tag==='model-viewer'),resolve:()=>resolve({ok:true})};
}
test('iPhone prepara apenas o arquivo nativo; GLB é opcional e reiniciar limpa a prévia',async()=>{
 const s=setup();assert.equal(s.requests.length,0);
 await s.button('Preparar ciclo em RA').onclick();assert.equal(s.requests.length,1);assert.match(s.requests[0],/\.usdz/);
 assert.equal(s.viewer.getAttribute('src'),null);assert.equal(s.button('Abrir ciclo em realidade aumentada').disabled,false);
 s.button('Carregar prévia 3D').onclick();assert.match(s.viewer.getAttribute('src'),/\.glb/);
 const cycle=s.elements.find(x=>x.attrs['aria-label']==='Ciclo para realidade aumentada');cycle.value='2';cycle.onchange();assert.equal(s.viewer.getAttribute('src'),null);assert.equal(s.button('Abrir ciclo em realidade aumentada').disabled,true);
});
test('Android prepara o modelo GLB necessário à RA, sem consultar outro arquivo',async()=>{
 const s=setup('Android');await s.button('Preparar ciclo em RA').onclick();assert.equal(s.requests.length,1);assert.match(s.requests[0],/\.glb/);assert.match(s.viewer.getAttribute('src'),/\.glb/);
});
test('troca de seleção durante o pedido não libera um ciclo antigo',async()=>{
 const s=setup('iPhone',{delay:true}),pending=s.button('Preparar ciclo em RA').onclick();
 const cycle=s.elements.find(x=>x.attrs['aria-label']==='Ciclo para realidade aumentada');cycle.value='2';cycle.onchange();s.resolve();await pending;
 assert.equal(s.viewer.getAttribute('src'),null);assert.equal(s.button('Abrir ciclo em realidade aumentada').disabled,true);
});
test('economia de dados adia a prévia sem retirar a escolha do visitante',()=>{
 const code=fs.readFileSync(new URL('rede.js',base),'utf8').replaceAll('export function','function');const c={};vm.createContext(c);vm.runInContext(code,c);
 assert.equal(c.deferPreview({userAgent:'iPhone'}),true);assert.equal(c.deferPreview({userAgent:'Android',connection:{saveData:true}}),true);
 assert.equal(c.deferPreview({userAgent:'Android',connection:{effectiveType:'2g'}}),true);assert.equal(c.deferPreview({userAgent:'Desktop',connection:{effectiveType:'4g'}}),false);
});
if(source.includes('Versão leve publicada'))test('Lab-RA oferece ciclo publicado e mantém a seleção do protótipo local',async()=>{
 const s=setup(),version=s.elements.find(x=>x.attrs['aria-label']==='Versão do ciclo');await s.button('Preparar ciclo em RA').onclick();assert.match(s.requests[0],/^https:\/\/fisiologia\.drmarionascimento\.com\.br/);
 version.value='local';version.onchange();await s.button('Preparar ciclo em RA').onclick();assert.match(s.requests[1],/^https:\/\/example\.test/);
});

test('Película no iPhone mantém o botão nativo pronto sem baixar GLB antes da escolha',async()=>{
 const code=fs.readFileSync(new URL('celula/membrana/app.js',base),'utf8'),start=code.indexOf('async function requestModel()'),end=code.indexOf('\nfunction updateLab()',start),elements=new Map();
 const el=id=>{if(!elements.has(id))elements.set(id,{attrs:{},setAttribute(k,v){this.attrs[k]=v;}});return elements.get(id);};let decoderCalls=0;
 const c={$:el,viewer:el('membrane-model'),launch:el('launch-ar'),status:el('status'),platform:'ios',previewOptedIn:false,ready:false,lastPhase:'',retry:0,requested:'',links:{glb:'model.glb',usdz:'model.usdz',poster:'model.webp'},mode:'pelicula',content:{pelicula:{title:'Película'}},webgl:true,configureMeshopt:async()=>{decoderCalls++;}};
 vm.createContext(c);vm.runInContext(code.slice(start,end),c);await c.requestModel();assert.equal(c.viewer.attrs['ios-src'],'model.usdz');assert.equal(c.viewer.attrs.src,undefined);assert.equal(c.launch.disabled,false);assert.equal(decoderCalls,0);
 c.previewOptedIn=true;await c.requestModel();assert.match(c.viewer.attrs.src,/model.glb/);
});
