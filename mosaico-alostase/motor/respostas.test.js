import assert from 'node:assert/strict';
import test from 'node:test';
import { PROTOCOLOS_RESPOSTA, curvaResposta } from './respostas.js';
import { simularTrajetoria } from './trajetoria.js';

test('protocolos reproduzem as referências de frequência cardíaca e cortisol', () => {
  for (const [id, { pontos }] of Object.entries(PROTOCOLOS_RESPOSTA)) {
    const curva = curvaResposta(id);
    for (const [min, valor] of pontos) {
      assert.ok(Math.abs(curva.find((p) => p.min === min).valor - valor) < 1e-12);
    }
  }
  const pico = curvaResposta('estresse').reduce((a, b) => a.valor > b.valor ? a : b);
  assert.equal(pico.min, 20);
  assert.throws(() => curvaResposta('inexistente'), RangeError);
});

test('treino acumula aptidão e fadiga na agenda, com recuperação mais rápida da fadiga', () => {
  const treino = simularTrajetoria('treino', 7).dias;
  const controle = simularTrajetoria('regular', 7).dias;
  assert.ok(controle.every((d) => d.aptidaoTreino === 0 && d.fadigaTreino === 0));
  assert.ok(treino[0].aptidaoTreino > 0 && treino[0].saldoTreino < 0);
  assert.ok(treino[1].fadigaTreino / treino[0].fadigaTreino < treino[1].aptidaoTreino / treino[0].aptidaoTreino);
  assert.ok(treino[2].fadigaTreino > treino[1].fadigaTreino);
});
