import assert from 'node:assert/strict';
import test from 'node:test';
import { simularCarrington } from './conferencia-carrington.js';
import { DURACAO_PULSO_S, mediaMinutoDoPulso, respostaPulsoDespertar } from './pulso-despertar.js';

test('pulso subminuto conserva a mesma área usada na bancada de 24 horas', () => {
  const area = Array.from({ length: DURACAO_PULSO_S }, (_, s) => respostaPulsoDespertar('sis', s + 0.5))
    .reduce((soma, x) => soma + x, 0);
  assert.equal(area / 60, mediaMinutoDoPulso('sis'));
});

test('o ensaio com mais despertares modifica a média sem elevar a pressão entre os pulsos', () => {
  const resultados = ['controle', 's120', 's60', 's30'].map(simularCarrington);
  for (const [i, r] of resultados.entries()) {
    assert.equal(r.pontos.length, 1200);
    assert.ok(r.pontos.filter((p) => !p.emAtivacao).every((p) => p.sis === r.sisEstavel));
    if (i > 0) assert.ok(r.acrescimoPct > resultados[i - 1].acrescimoPct);
  }
  assert.equal(resultados.at(-1).pontos[30].emAtivacao, true);
});
