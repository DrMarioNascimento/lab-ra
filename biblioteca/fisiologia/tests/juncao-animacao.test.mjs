import test from 'node:test';
import assert from 'node:assert/strict';
import {simular} from '../juncao-neuromuscular/fisica.js';
import {estadoVisual,comprimentoVisual,encaixeTriade,faseContracao,impulsoVisual,particulaVisual,vesiculaVisual,trajetoFluido} from '../juncao-neuromuscular/animacao.js';

test('o estado visual interpola o ensaio sem saltos de amostra ou mutação do cálculo',()=>{
 const s=simular(),a=s.amostras[505],b=s.amostras[506],before=JSON.stringify(s);
 const visual=estadoVisual(s,(a.t+b.t)/2);
 for(const key of ['ach','ca','ativacao','vm'])assert(Math.abs(visual[key]-(a[key]+b[key])/2)<1e-10);
 assert.equal(JSON.stringify(s),before);assert.deepEqual(estadoVisual(s,50.55),estadoVisual(s,50.55));
});
test('cada impulso segue axônio e ramos antes da chegada, e o trem inteiro é apresentado',()=>{
 const s=simular({modo:'trem',frequencia:15});
 for(const t of s.estimulos){assert.equal(impulsoVisual(s.estimulos,t-5.5,-9,7),.5);assert(Math.abs(impulsoVisual(s.estimulos,t-1,-2,2)-.5)<1e-10);}
 assert.equal(impulsoVisual(s.estimulos,650,-9,7),null);
 assert.equal(impulsoVisual(s.estimulos,0,-9,7),null);
});
test('liberação zero mantém entrada de cálcio no terminal, sem fusão ou acetilcolina',()=>{
 const s=simular({liberacao:0});
 for(let i=0;i<96;i++)assert.equal(particulaVisual('ach',i,96,23,s),null);
 for(let i=0;i<8;i++)assert.equal(vesiculaVisual(i,23,s),null);
 assert(particulaVisual('preca',0,48,21,s));
});
test('ausência de receptores conserva ACh, mas impede cálcio muscular e contração',()=>{
 const s=simular({receptores:0});assert(particulaVisual('ach',0,96,23,s));
 for(let i=0;i<160;i++)assert.equal(particulaVisual('ca',i,160,50,s),null);
 for(let i=0;i<48;i++)assert.equal(particulaVisual('na',i,48,23,s),null);
 assert.equal(comprimentoVisual(estadoVisual(s,50).ativacao),2.4);
});
test('estímulos seguintes geram novas liberações e são reconstituídos pelo cursor',()=>{
 const s=simular({modo:'trem',frequencia:15}),t=s.estimulos[1]+3;
 assert.equal(particulaVisual('ach',0,96,t,s),null);
 assert(particulaVisual('ach',24,96,t,s));assert(vesiculaVisual(0,t,s));
 assert.deepEqual(particulaVisual('ach',24,96,t,s),particulaVisual('ach',24,96,t,s));
});
test('dispersão tem origem/destino contínuos e partículas se apagam gradualmente',()=>{
 const a=[0,1,0],b=[.4,-.6,.2];
 assert.deepEqual(trajetoFluido(a,b,0,7),a);
 assert(trajetoFluido(a,b,1,7).every((v,k)=>Math.abs(v-b[k])<1e-12));
 for(let u=.01;u<1;u+=.01){const p=trajetoFluido(a,b,u,7),q=trajetoFluido(a,b,u+.0001,7);assert(Math.hypot(...p.map((v,k)=>v-q[k]))<.001);}
 const s=simular();assert(particulaVisual('ach',0,96,34.599,s).fade<.0001);assert.equal(particulaVisual('ach',0,96,34.601,s),null);
});
test('vesícula aproxima-se e funde-se depois da chegada do impulso',()=>{
 const s=simular(),antes=vesiculaVisual(0,19,s),depois=vesiculaVisual(0,23,s);
 assert(antes);assert.equal(antes.fusao,0);assert(depois.fusao>.9);
 assert(vesiculaVisual(0,28.6,s).fade<.0001);
 assert(vesiculaVisual(0,28.601,s).fade<.0001);
});
test('níveis 4 e 5 compartilham encurtamento, repouso, limites e relaxamento',()=>{
 assert.equal(comprimentoVisual(0),2.4);assert.equal(comprimentoVisual(1),1.9);
 assert.equal(comprimentoVisual(5),1.9);assert.equal(comprimentoVisual(-1),2.4);
 const s=simular({modo:'trem',frequencia:50}),inicio=estadoVisual(s,19),ativo=estadoVisual(s,200),final=estadoVisual(s,650);
 assert.equal(comprimentoVisual(inicio.ativacao),2.4);assert(comprimentoVisual(ativo.ativacao)<2);
 assert(comprimentoVisual(final.ativacao)>comprimentoVisual(ativo.ativacao));
});

test('retículo mantém a ligação à cisterna e cabe no comprimento da miofibrila em toda a contração',()=>{
 for(let a=0;a<=1;a+=.001){
  const fit=encaixeTriade(a),limite=3.65/2*fit.fibra;
  for(const lado of [-1,1]){
   const raiz=lado*.88*fit.reticulo+lado*fit.deslocamento;
   assert(Math.abs(raiz-lado*.88)<1e-12);
   // Inclui a espessura dos tubos na ponta, além da linha central.
   for(const z of [.84,.88,1.12,1.52,1.84])assert(Math.abs(lado*z*fit.reticulo+lado*fit.deslocamento)<limite);
  }
 }
});

test('fase mecânica distingue repouso, encurtamento e relaxamento conforme o comprimento mostrado',()=>{
 const s=simular();
 assert.equal(faseContracao(s,0),'Antes do estímulo');
 assert.match(faseContracao(s,50),/encurtando/);
 assert.match(faseContracao(s,150),/alongando/);
 for(const t of [25,50,80,100,150,250]){
  const antes=comprimentoVisual(estadoVisual(s,t-.5).ativacao),depois=comprimentoVisual(estadoVisual(s,t+.5).ativacao);
  assert.match(faseContracao(s,t),depois<antes?/encurtando/:/alongando/);
 }
 assert.match(faseContracao(simular({receptores:0}),100),/sem contração/);
 assert.match(faseContracao(simular({liberacao:0}),100),/sem contração/);
});

test('fase mecânica acompanha reversões após cada impulso, pausa, cursor e reinício do loop',()=>{
 const s=simular({modo:'trem',frequencia:15});
 for(let t=30;t<600;t+=2){
  const fase=faseContracao(s,t),antes=estadoVisual(s,t-.5).ativacao,depois=estadoVisual(s,t+.5).ativacao;
  if(fase.includes('encurtando'))assert(depois>antes);
  if(fase.includes('alongando'))assert(depois<antes);
  assert.equal(faseContracao(s,t),faseContracao(s,t));
 }
 assert.match(faseContracao(s,650),/alongando/);
 assert.equal(faseContracao(s,0),'Antes do estímulo');
});
