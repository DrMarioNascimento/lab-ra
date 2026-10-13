import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import vm from 'node:vm';
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
test('nova RA tem Célula, Película e Travessias, conservando os controles celulares',()=>{
 const html=read('celula/index.html'),viewer=read('celula/visualizador/index.html');
 assert.deepEqual([...html.matchAll(/data-aba="([^"]+)"/g)].map(m=>m[1]),['celula','pelicula','travessias']);
 for(const id of ['nuc','mem','speed','motion'])assert.match(viewer,new RegExp('id="'+id+'"'));
 assert.match(viewer,/id="prepare-ar"/);assert.match(viewer,/shadow-intensity="0"/);
});
test('links de Tutor apontam para as duas experiências nos dois percursos',()=>{
 const card=fs.readFileSync(new URL('../../tutor-ra-card.js',import.meta.url),'utf8');assert.match(card,/ra\/celula\/\?percurso=/);assert.match(card,/ra\/potencial-membrana\/\?percurso=/);
 const data=fs.readFileSync(new URL('../../tutor-ra-data.js',import.meta.url),'utf8');assert.match(data,/"href":"ra\/celula\/"/);
});
test('próximo e voltar percorrem 0,1,2,5 sem passar pelas abas transferidas',()=>{
 const app=read('potencial-membrana/app.js'),code=app.slice(app.indexOf("document.querySelectorAll('.step').forEach(b => b.onclick"),app.indexOf("$('resetView').onclick"));
 const chosen=[],buttons=[0,1,2,5].map(i=>({dataset:{step:String(i)}})),E={prev:{},next:{}};
 const context={document:{querySelectorAll:()=>buttons},E,NIVEIS:[0,1,2,5],atual:2,setStep:n=>chosen.push(n)};
 vm.runInNewContext(code,context);E.next.onclick();assert.equal(chosen.pop(),5);context.atual=5;E.prev.onclick();assert.equal(chosen.pop(),2);buttons[3].onclick();assert.equal(chosen.pop(),5);
});
test('troca de abas preserva o iframe e envia o nível correto com origem limitada',()=>{
 const elements=new Map(),posts=[];function el(id){if(!elements.has(id))elements.set(id,{id,hidden:false,dataset:{},attributes:{},href:'https://example.test/ra/potencial-membrana/',setAttribute(k,v){this.attributes[k]=v},hasAttribute(k){return k==='src'?!!this.src:k in this.attributes},addEventListener(){},contentWindow:{postMessage:(data,origin)=>posts.push({id,data,origin})}});return elements.get(id)}
 const tabs=['celula','pelicula','travessias'].map(name=>{const e=el('tab-'+name);e.dataset.aba=name;return e});const location={href:'https://example.test/ra/celula/?percurso=fisioterapia',search:'?percurso=fisioterapia',origin:'https://example.test'};
 const c={document:{querySelectorAll:()=>tabs,getElementById:el},URL,URLSearchParams,location,history:{replaceState(){}}};vm.runInNewContext(read('celula/tabs.js'),c);
 tabs[1].onclick();const first=el('membrane-frame').src;assert.match(first,/nivel=4/);assert.match(first,/percurso=fisioterapia/);tabs[2].onclick();assert.equal(el('membrane-frame').src,first);assert(posts.some(p=>p.id==='membrane-frame'&&p.data.nivel===4&&p.origin===location.origin));tabs[0].onclick();assert.equal(el('view-celula').hidden,false);assert.equal(el('view-membrana').hidden,true);
});
test('GLB da célula permanece íntegro e contém texturas normais e organelas',()=>{
 const b=fs.readFileSync(new URL('../celula/visualizador/celula-aprimorada.glb',import.meta.url));assert.equal(b.toString('ascii',0,4),'glTF');assert.equal(b.readUInt32LE(8),b.length);const j=JSON.parse(b.toString('utf8',20,20+b.readUInt32LE(12)));for(const name of ['nucleolo','cromatina','reticulo_endoplasmatico_liso','reticulo_endoplasmatico_rugoso'])assert(j.nodes.some(o=>o.name===name));assert(j.materials.every(m=>m.normalTexture));
});

test('célula usa viewport separado e recebe enquadramento e toque na área do canvas',()=>{
 const html=read('celula/visualizador/index.html'),css=read('celula/visualizador/layout.css'),app=read('celula/visualizador/app.js');
 assert.ok(html.indexOf('id="cell-stage"')<html.indexOf('</section>') && html.indexOf('</section>')<html.indexOf('<aside'));
 assert.match(css,/grid-template-columns:minmax\(0,1fr\) 280px/);
 assert.match(css,/@media\(max-width:760px\)/);
 assert.doesNotMatch(css,/\.panel\{[^}]*position:absolute/);
 assert.match(app,/new ResizeObserver/);assert.match(app,/getBoundingClientRect/);
 for(const [width,height] of [[280,420],[390,420],[620,500],[1000,500]]){
  const vertical=38*Math.PI/180,horizontal=2*Math.atan(Math.tan(vertical/2)*width/height);
  const distance=1.12/Math.sin(Math.min(vertical,horizontal)/2)*1.08;
  assert.ok(Math.asin(1.12/distance)<Math.min(vertical,horizontal)/2);
 }
});
test('RA da célula segue a preparação antecipada e mantém o gesto direto para abrir a câmera',()=>{
 const html=read('celula/visualizador/index.html'),app=read('celula/visualizador/ra.js');
 assert.match(html,/class="ra-launch"/);assert.match(html,/camera-controls exposure="1.1"/);
 assert.match(app,/launch.onclick=\(\)=>viewer.activateAR\(\);prepare.click\(\)/);
});
