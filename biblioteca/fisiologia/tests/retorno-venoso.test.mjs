import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import {criarEstadoBomba,avancarBomba,pressaoComBomba,contracaoNaFase} from '../retorno-venoso/bomba.js';
const base=new URL('../',import.meta.url),ler=p=>readFile(new URL(p,base),'utf8');
test('bomba conserva queda gradual e reenchimento no tempo fisiológico',()=>{
 const a=criarEstadoBomba(),b=criarEstadoBomba();
 avancarBomba(a,7,true);for(let i=0;i<175;i++)avancarBomba(b,.04,true);
 assert(Math.abs(a.atividade-b.atividade)<1e-12);
 assert(pressaoComBomba(92.6895,a.atividade)<30);
 const andando=pressaoComBomba(92.6895,a.atividade);avancarBomba(a,7,false);
 assert(pressaoComBomba(92.6895,a.atividade)>andando);
 assert.equal(pressaoComBomba(10,1),10);
 assert.equal(contracaoNaFase(0),0);assert.equal(contracaoNaFase(.25),1);assert.equal(contracaoNaFase(.75),0);
});
test('card cardiovascular abre a experiência própria nos dois percursos',async()=>{
 const window={};vm.runInNewContext(await ler('../tutor-ra-card.js'),{window});
 for(const percurso of ['educacao-fisica','fisioterapia']){
  const c=window.cardRealidadeAumentada(percurso,'cardiovascular');
  assert(c.includes('ra/retorno-venoso/?percurso='+percurso));assert.match(c,/target="_blank" rel="noopener noreferrer"/);
  assert(window.cardRealidadeAumentada(percurso,'respiratorio').includes('ra/pleura/?percurso='+percurso));
 }
 assert.match(await ler('../tutor-ef-data.js'),/cardRealidadeAumentada\('educacao-fisica',active\)/);
 assert.match(await ler('../tutor-fisio.html'),/cardRealidadeAumentada\('fisioterapia',active\)/);
});
test('coração e corpo usam recursos locais sem acesso à origem',async()=>{
 assert.match(await ler('retorno-venoso/coracao.js'),/\.\.\/assets\/coracao\.glb/);
 assert.match(await ler('retorno-venoso/modelos.js'),/\.\/corpo\.glb/);
 const html=await ler('retorno-venoso/index.html');assert.doesNotMatch(html,/guard\.js|bancadas\.html|Laboratório do Pesquisar/);
 assert.match(html,/data-voltar-tutor/);assert.match(html,/Velocidade de execução/);
 assert.match(html,/Simuladores interativos utilizados nas disciplinas de Fisiologia Humana/);
});
