import assert from 'node:assert/strict';
import test from 'node:test';
import { CONDICOES_REFEICAO, simularRefeicoesPlantao } from './refeicoes-plantao.js';

test('as três agendas conservam energia e carboidratos, com doses distintas na madrugada', () => {
  const condicoes = Object.keys(CONDICOES_REFEICAO).map((id) => simularRefeicoesPlantao(id));
  assert.deepEqual(condicoes.map((c) => c.energiaMadrugadaPct), [0, 10, 30]);
  for (const c of condicoes) {
    assert.equal(c.refeicoes.reduce((soma, p) => soma + p.energiaPct, 0), 100);
    assert.equal(c.refeicoes.reduce((soma, p) => soma + p.carboG, 0), 200);
    assert.equal(c.plantao[0].glicemia, c.plantao.at(-1).glicemia);
  }
});

test('o teste usa uma âncora e calcula o lanche sem recorrer ao seu valor observado', () => {
  for (const id of Object.keys(CONDICOES_REFEICAO)) {
    const inicial = simularRefeicoesPlantao(id, 0);
    assert.equal(inicial.teste[120].delta, 0);
  }
  const r = simularRefeicoesPlantao('refeicao');
  assert.equal(r.delta120, CONDICOES_REFEICAO.refeicao.observado);
  assert.equal(r.teste[120].delta, r.delta120);
  assert.equal(simularRefeicoesPlantao('lanche').delta120, r.delta120 / 3);
});
