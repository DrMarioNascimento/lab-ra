import test from 'node:test';
import assert from 'node:assert/strict';
import {avancarInstante} from '../juncao-neuromuscular/reproducao.js';
import {simular,noInstante} from '../juncao-neuromuscular/fisica.js';

test('sem repetição, encerra no fim sem ultrapassar a janela fisiológica',()=>{
 assert.deepEqual(avancarInstante(319,3,320),{instante:320,terminou:true});
 assert.deepEqual(avancarInstante(319,1,320),{instante:320,terminou:true});
 assert.deepEqual(avancarInstante(30,0,320),{instante:30,terminou:false});
});
test('loop conserva o excedente de tempo e atravessa limites em ambas as janelas',()=>{
 for(const duracao of [320,650]){
  assert.deepEqual(avancarInstante(duracao-1,3,duracao,true),{instante:2,terminou:false});
  assert.deepEqual(avancarInstante(duracao-1,1,duracao,true),{instante:0,terminou:false});
  assert.deepEqual(avancarInstante(0,duracao*3+7,duracao,true),{instante:7,terminou:false});
 }
});
test('reprodução repetida reapresenta o ensaio e não acumula cálcio ou estímulos',()=>{
 const s=simular({modo:'trem',frequencia:15}),before=JSON.stringify(s);
 const next=avancarInstante(s.duracao-2,3,s.duracao,true);
 const a=noInstante(s,next.instante);
 assert.equal(a.ca,0);assert.equal(a.ativacao,0);assert.equal(JSON.stringify(s),before);
});
