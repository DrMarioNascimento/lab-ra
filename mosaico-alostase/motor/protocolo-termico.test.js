import assert from 'node:assert/strict';
import test from 'node:test';
import { PROTOCOLO_CORRIDA, REFERENCIAS_CORRIDA, simularProtocoloCorrida } from './protocolo-termico.js';
import { simularTrajetoria } from './trajetoria.js';

test('a corrida ajusta 30 minutos nos extremos e mantém os demais valores de referência independentes', () => {
  assert.equal(PROTOCOLO_CORRIDA.duracaoMin, 60);
  for (const ref of REFERENCIAS_CORRIDA) {
    const sim = simularProtocoloCorrida(ref.umidade);
    assert.equal(sim.pontos.at(-1).min, 60);
    assert.equal(sim.intervalos.length, 2);
    assert.ok(sim.intervalos.every((p) => Number.isFinite(p.calor) && p.suor > 0));
  }
  const seco = simularProtocoloCorrida(23), umido = simularProtocoloCorrida(71);
  assert.ok(Math.abs(seco.intervalos[0].suor - 20.8) < 1.5);
  assert.ok(Math.abs(umido.intervalos[0].suor - 19.4) < 1.5);
  assert.ok(Math.abs(seco.intervalos[0].calor - 66.3) < 5);
  assert.ok(Math.abs(umido.intervalos[0].calor - 100.2) < 5);
  assert.ok(umido.intervalos[1].calor < REFERENCIAS_CORRIDA.at(-1).calor[1]);
  assert.ok(umido.deltaCentralC < REFERENCIAS_CORRIDA.at(-1).deltaRetalC);
});

test('as duas rotinas têm testes iguais, com dez exposições diferenciadas entre eles', () => {
  const a = simularTrajetoria('aclimaFresco', 12, { detalharDia: 11 });
  const b = simularTrajetoria('aclimaQuente', 12, { detalharDia: 11 });
  assert.deepEqual(a.dias[0], b.dias[0]);
  assert.ok(a.dias.every((d) => d.treinoMin === 45));
  assert.ok(b.dias.every((d) => d.treinoMin === 45));
  assert.equal(a.dias.slice(1, 11).filter((d) => d.tempoCalorMin).length, 0);
  assert.equal(b.dias.slice(1, 11).filter((d) => d.tempoCalorMin).length, 10);
  assert.equal(a.leitura[210].termorregulacao.temperatura, b.leitura[210].termorregulacao.temperatura);
  assert.equal(a.leitura[210].termorregulacao.umidade, b.leitura[210].termorregulacao.umidade);
  assert.ok(b.dias[11].fcFinalBpm < a.dias[11].fcFinalBpm);
  assert.ok(b.dias[11].centralFimC < a.dias[11].centralFimC);
  assert.ok(b.dias[11].inicioSuorMin < a.dias[11].inicioSuorMin);
});
