import assert from 'node:assert/strict';
import test from 'node:test';
import { FLUXOS_EXERCICIO, simularFluxosExercicio, reconstruirGlicemiaExercicio } from './glicose-exercicio.js';

test('os fluxos preservam as referências e o balanço instantâneo', () => {
  const pontos = simularFluxosExercicio();
  assert.equal(pontos.length, 61);
  for (const [chave, serie] of Object.entries(FLUXOS_EXERCICIO)) {
    for (const [min, valor] of serie) {
      assert.ok(Math.abs(pontos[min - 120][chave] - valor) < 1e-12);
    }
  }
  assert.ok(Math.abs(pontos[0].saldo - (-28.9)) < 1e-12);
  assert.ok(Math.abs(pontos.at(-1).saldo - 2.3) < 1e-12);
  assert.ok(pontos.every((p) => p.saldo === p.refeicao + p.endogena - p.retirada));
});

test('o saldo acumulado equivale à integral dos dois trechos lineares', () => {
  const pontos = simularFluxosExercicio();
  assert.equal(pontos[0].acumulado, 0);
  const saldo = (pontos[0].saldo + pontos[20].saldo) * 10 + (pontos[20].saldo + pontos[60].saldo) * 20;
  assert.ok(Math.abs(pontos.at(-1).acumulado - saldo) < 1e-10);
});

test('glicemia parte do valor observado e converte o saldo em mmol/L', () => {
  const curva = reconstruirGlicemiaExercicio();
  assert.deepEqual(curva[0], { minuto: 120, deltaMmolL: 0, mmolL: 6.3 });
  assert.equal(curva.at(-1).minuto, 180);
  assert.ok(Math.abs(curva[20].mmolL - 5.318852844381759) < 1e-10);
  const saldoConhecido = reconstruirGlicemiaExercicio([{ minuto: 140, acumulado: 130 * 70.9 / 50.9 }]);
  assert.ok(Math.abs(saldoConhecido[0].deltaMmolL - 1) < 1e-12);
});
