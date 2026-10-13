import {test} from 'node:test';
import assert from 'node:assert/strict';
import {quadro,superficie,percurso,maturacaoLocal,estadoNivel,maturacaoRegiao,REGIOES} from '../osso-vivo/animacao.js';
import {estado} from '../osso-vivo/fisica.js';
test('osso: desmontagem e exibição de carga não alteram balanço fisiológico',()=>{
 for(const scenario of ['habitual','exercicio','imobilizacao'])for(let k=0;k<=100;k++){
  const t=k/100,base=estado(t,scenario);
  for(const separation of [0,.5,1])for(const load of [false,true]){const a=quadro(t,scenario,separation,load);for(const key of Object.keys(base))assert.equal(a[key],base[key]);}
 }
});
test('osso: força relativa e deformação ampliada respondem ao cenário e fecham o ciclo',()=>{
 assert(quadro(.025,'exercicio').forca>quadro(.025,'habitual').forca);
 assert(quadro(.025,'habitual').forca>quadro(.025,'imobilizacao').forca);
 assert.equal(quadro(.025,'habitual',0,false).forca,0);
 assert.equal(quadro(.025,'habitual',0,false).deformacao,0);
 assert(Math.abs(quadro(0).forca-quadro(1).forca)<1e-12);
 for(let k=0;k<=1000;k++)assert(quadro(k/1000).deformacao<=.06);
});

test('trabéculas e ósteon: compressão proporcional à carga, com alívio completo',()=>{
 for(const nivel of [1,2])for(const scenario of ['habitual','exercicio','imobilizacao']){
  for(let k=0;k<=1000;k++){
   const a=quadro(k/1000,scenario,0,true,nivel);
   assert(Math.abs(a.deformacao-.12*a.forca)<1e-12);
   assert(a.deformacao>=0&&a.deformacao<=.12);
   const base=estado(k/1000,scenario);
   for(const key of Object.keys(base))assert.equal(a[key],base[key]);
  }
  const relieved=quadro(.075,scenario,0,true,nivel);
  assert.equal(relieved.forca,0);assert.equal(relieved.deformacao,0);
  assert.equal(quadro(.025,scenario,0,false,nivel).deformacao,0);
  assert(Math.abs(quadro(0,scenario,0,true,nivel).deformacao-quadro(1,scenario,0,true,nivel).deformacao)<1e-12);
 }
 assert.equal(quadro(.025,'exercicio',0,true,1).deformacao,.12);
});

test('osso: níveis celulares mantêm ações separadas e cumulativas, incluindo a mineralização',()=>{
 for(const scenario of ['habitual','exercicio','imobilizacao'])for(const nivel of [3,4]){
  let anterior=estadoNivel(0,scenario,nivel);
  for(let i=0;i<=1000;i++){
   const a=estadoNivel(i/1000,scenario,nivel);
   assert(a.retirada>=anterior.retirada-1e-10);assert(a.depositada>=anterior.depositada-1e-10);assert(a.mineralizada>=anterior.mineralizada-1e-10);
   assert(a.mineralizada<=a.depositada);assert(a.osteoide>=0);
   assert(Math.abs(a.mineral-(1-a.retirada+a.mineralizada))<1e-12);
   if(nivel===3){assert.equal(a.depositada,0);assert.equal(quadro(i/1000,scenario,0,true,nivel).transporteFormacao,0);}
   else{assert.equal(a.retirada,0);assert.equal(quadro(i/1000,scenario,0,true,nivel).transporteReabsorcao,0);}
   anterior=a;
  }
  const integrado=estado(1,scenario),final=estadoNivel(1,scenario,nivel);
  assert(Math.abs(final.retirada-(nivel===3?integrado.retirada:0))<1e-12);
  assert(Math.abs(final.depositada-(nivel===4?integrado.depositada:0))<1e-12);
 }
});

test('osso: a célula trabalha em todas as regiões e se desloca sem saltos',()=>{
 for(const nivel of [3,4]){
  for(let i=0;i<3;i++){const a=quadro((i+.4)/3,'habitual',1,true,nivel);assert.equal(a.regiao,i);assert(a.atividade>.9);assert.equal(a.x,REGIOES[i]);}
  for(const t of [1/3,2/3]){
   const before=estadoNivel(t-1e-8,'habitual',nivel),after=estadoNivel(t+1e-8,'habitual',nivel);
   assert(Math.abs(before.x-after.x)<1e-6);assert(Math.abs(before.mineral-after.mineral)<1e-6);
  }
  assert.equal(estadoNivel(1,'habitual',nivel).atividade,0);
  assert(estadoNivel(.98,'habitual',nivel).atividade>.9);
 }
});

test('osso: regiões já trabalhadas não desaparecem durante o deslocamento seguinte',()=>{
 for(const scenario of ['habitual','exercicio','imobilizacao']){
  for(const x of REGIOES){let removed=superficie(x,0,quadro(0,scenario,0,true,3)),formed=superficie(x,0,quadro(0,scenario,0,true,4));
   for(let k=1;k<=1000;k++){const r=superficie(x,0,quadro(k/1000,scenario,0,true,3)),f=superficie(x,0,quadro(k/1000,scenario,0,true,4));assert(r<=removed+1e-10);assert(f>=formed-1e-10);removed=r;formed=f;}
  }
 }
});

test('osso: a carga altera a cena nos níveis mecânicos e a superfície das ações isoladas',()=>{
 assert(quadro(0,'exercicio').deformacao>quadro(0,'habitual').deformacao*1.5);
 assert(quadro(0,'imobilizacao').deformacao<quadro(0,'habitual').deformacao*.2);
 assert(superficie(0,0,quadro(.6,'imobilizacao',0,true,3))<superficie(0,0,quadro(.6,'habitual',0,true,3)));
 assert(superficie(0,0,quadro(.6,'exercicio',0,true,4))>superficie(0,0,quadro(.6,'habitual',0,true,4)));
 for(const x of REGIOES)for(let i=0;i<=1000;i++){const a=maturacaoRegiao(i/1000,x);assert(a.mineral<=a.colageno);}
});
test('osso: remoção e reposição mudam superfície na ordem das curvas',()=>{
 for(const scenario of ['habitual','exercicio','imobilizacao']){
  const h=t=>superficie(-.7,0,quadro(t,scenario));
  assert(h(.3)<h(0));assert.equal(h(.30),h(.39));assert(h(.85)>h(.40));
  const h0=h(0),h1=h(1);if(scenario==='habitual')assert(Math.abs(h0-h1)<1e-12);if(scenario==='exercicio')assert(h1>h0);if(scenario==='imobilizacao')assert(h1<h0);
 }
});
test('osso: transporte não funciona fora da fase da célula e as rotas não saltam',()=>{
 for(const t of [0,.07,.30,.35,.6,1])assert.equal(quadro(t).transporteReabsorcao,0);
 for(const t of [0,.30,.39,.85,.95,1])assert.equal(quadro(t).transporteFormacao,0);
 assert(quadro(.2).transporteReabsorcao>0);assert(quadro(.6).transporteFormacao>0);
 for(let k=0;k<20;k++)for(let i=0;i<=100;i++){const p=percurso(i/100,k,1);assert(p.u>=0&&p.u<=1);assert(p.escala>=0&&p.escala<=1);assert.equal(percurso(i/100,k,0).escala,0);}
 assert.equal(percurso(0,0,1).escala,0);assert(percurso(.999/12,0,1,12).escala<.001);
});
test('osso: cristais locais nunca precedem a matriz orgânica e são posteriores a ela',()=>{
 for(let i=0;i<=20;i++)for(let k=0;k<=1000;k++){const a=maturacaoLocal(k/1000,i/20);assert(a.mineral<=a.colageno+1e-12);if(a.colageno===0)assert.equal(a.mineral,0);}
 assert.equal(maturacaoLocal(.42,0).mineral,0);assert(maturacaoLocal(.5,0).colageno>maturacaoLocal(.5,0).mineral);
});
