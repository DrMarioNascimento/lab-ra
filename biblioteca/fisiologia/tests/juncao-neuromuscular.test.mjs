import test from 'node:test';
import assert from 'node:assert/strict';
import {simular,noInstante,potencialAcao,REPOUSO,LIMIAR,DT} from '../juncao-neuromuscular/fisica.js';
const basal=simular();
test('antes do impulso, os dois potenciais e todos os sinais permanecem em repouso',()=>{
 for(const a of basal.amostras.filter(a=>a.t<20)){assert.equal(a.epp,REPOUSO);assert.equal(a.vm,REPOUSO);for(const k of ['ach','preca','ca','ativacao'])assert.equal(a[k],0);}
});
test('estímulo único gera um disparo, cálcio e ativação posterior ao cálcio',()=>{
 assert.equal(basal.disparos.length,1);assert(basal.picoEpp>LIMIAR);
 const primeiroCa=basal.amostras.find(a=>a.ca>0).t;assert(primeiroCa>basal.disparos[0]+2);
 const pico=k=>basal.amostras.reduce((a,b)=>b[k]>a[k]?b:a).t;
 assert(pico('ativacao')>pico('ca'));assert(basal.amostras.at(-1).ativacao<.025);
});
test('liberação zero conserva o cálcio pré-sináptico e interrompe a cadeia muscular',()=>{
 const s=simular({liberacao:0});assert(s.amostras.some(a=>a.preca>.9));assert.equal(s.disparos.length,0);
 for(const a of s.amostras){assert.equal(a.ach,0);assert.equal(a.epp,REPOUSO);assert.equal(a.vm,REPOUSO);assert.equal(a.ca,0);assert.equal(a.ativacao,0);}
});
test('sem receptores, há acetilcolina mas não potencial de ação muscular',()=>{
 const s=simular({receptores:0});assert(s.amostras.some(a=>a.ach>.9));assert.equal(s.disparos.length,0);assert.equal(s.picoCa,0);assert.equal(s.picoAtivacao,0);
});
test('reduções graduadas não são confundidas com potenciais de ação menores',()=>{
 const menos=simular({receptores:.7}),falha=simular({receptores:.4});assert(menos.picoEpp<basal.picoEpp);assert.equal(menos.disparos.length,1);assert.equal(falha.disparos.length,0);
 for(const s of [basal,menos])assert(Math.abs(noInstante(s,s.disparos[0]+.5).vm-30)<1e-9);
});
test('frequência não altera um impulso único e a velocidade não integra o motor',()=>{
 assert.deepEqual(simular({frequencia:1}).amostras,simular({frequencia:50}).amostras);
 assert.deepEqual(simular({velocidade:.25}),simular({velocidade:2}));
});
test('sequência tem intervalos definidos e termina com tempo para recuperação',()=>{
 const s=simular({modo:'trem',frequencia:15});assert.equal(s.duracao,650);assert(s.estimulos.at(-1)<=400);assert(s.estimulos.length>1);
 for(let i=1;i<s.estimulos.length;i++)assert(Math.abs(s.estimulos[i]-s.estimulos[i-1]-1000/15)<1e-9);
 assert.equal(s.disparos.length,s.estimulos.length);assert(s.amostras.at(-1).ativacao<s.picoAtivacao*.15);
});
test('impulsos próximos somam cálcio e sustentam a resposta contrátil',()=>{
 const baixa=simular({modo:'trem',frequencia:15}),alta=simular({modo:'trem',frequencia:50});assert(baixa.picoAtivacao>basal.picoAtivacao);assert(alta.picoAtivacao>baixa.picoAtivacao);assert(alta.picoCa>baixa.picoCa);
 assert(noInstante(alta,350).ativacao>.9);assert(alta.amostras.at(-1).ativacao<.15);
});
test('passo, limites, unidades e valores finitos são mantidos em todos os extremos',()=>{
 for(const p of [{},{modo:'trem',frequencia:50},{modo:'trem',frequencia:1,liberacao:.35},{frequencia:NaN,liberacao:-1,receptores:5}]){
  const s=simular(p);assert.equal(s.amostras.length,Math.round(s.duracao/DT)+1);
  for(const a of s.amostras){for(const v of Object.values(a))assert(Number.isFinite(v));assert(a.ativacao>=0&&a.ativacao<=1);assert(a.ca>=0);assert(a.epp>=REPOUSO&&a.epp<=0);assert(a.vm>=-96&&a.vm<=30+1e-10);}
 }
});
test('cursor escolhe a mesma amostra na ida e volta e respeita os limites',()=>{
 assert.equal(noInstante(basal,32.9),noInstante(basal,32.9));assert.equal(noInstante(basal,-9),basal.amostras[0]);assert.equal(noInstante(basal,1e6),basal.amostras.at(-1));assert.equal(noInstante(basal,NaN),basal.amostras[0]);assert.equal(potencialAcao(7),REPOUSO);
});
