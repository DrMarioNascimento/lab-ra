import test from 'node:test';
import assert from 'node:assert/strict';
import { criarAvisos } from '../dilema-bonde-3d/ar/avisos.js';

test('orientação some após o prazo; nova mensagem cancela o prazo anterior',()=>{
  const elemento={hidden:true,textContent:''},pendentes=new Map();let id=0;
  const avisos=criarAvisos(elemento,{agendar:(fn,ms)=>{pendentes.set(++id,{fn,ms});return id;},cancelar:id=>pendentes.delete(id)});
  avisos.mostrar('Arraste',{duracao:4500});assert(!elemento.hidden);assert.equal(pendentes.get(1).ms,4500);
  avisos.mostrar('Mova o celular',{persistente:true});assert.equal(pendentes.size,0);assert(!elemento.hidden);
  avisos.mostrar('Rodada concluída');assert.equal(elemento.textContent,'Rodada concluída');
  pendentes.get(2).fn();assert(elemento.hidden);assert.equal(pendentes.size,0);
  avisos.mostrar('Ajuda');avisos.ocultar();assert(elemento.hidden);assert.equal(pendentes.size,0);
});
