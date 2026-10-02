import test from 'node:test';import assert from 'node:assert/strict';
import {criarEstadoBomba,avancarBomba,pressaoComBomba,contracaoNaFase} from '../retorno-venoso/bomba.js';
test('andar reduz a pressão gradualmente, sem elevar a pressão em decúbito',()=>{
 const b=criarEstadoBomba();assert.equal(pressaoComBomba(93,b.atividade),93);
 let anterior=93;for(let i=0;i<60;i++){avancarBomba(b,.115,true);const p=pressaoComBomba(93,b.atividade);assert(p<anterior&&p>=25);assert.equal(pressaoComBomba(10,b.atividade),10);anterior=p}assert(anterior<30);
});
test('parar permite reenchimento e não redefine a pressão instantaneamente',()=>{
 const b=criarEstadoBomba();avancarBomba(b,20,true);const antes=pressaoComBomba(93,b.atividade);avancarBomba(b,.1,false);const depois=pressaoComBomba(93,b.atividade);assert(depois>antes&&depois<93);avancarBomba(b,100,false);assert(Math.abs(pressaoComBomba(93,b.atividade)-93)<.001);
});
test('um ciclo contém contração máxima, relaxamento e retorno ao repouso',()=>{
 assert.equal(contracaoNaFase(0),0);assert.equal(contracaoNaFase(.25),1);assert.equal(contracaoNaFase(.75),0);assert.equal(contracaoNaFase(1),0);assert(contracaoNaFase(.125)>.49&&contracaoNaFase(.125)<.51);
});
