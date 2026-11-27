import assert from 'node:assert/strict';
import test from 'node:test';
import { glicogenioAposRefeicao, variacaoGlicogenioEmJejum, fluxoHepaticoAposRefeicao, simularFluxoHepatico, CONFERENCIA_GLICOGENIO_120 } from './glicogenio.js';

test('a curva pós-prandial reproduz a concentração inicial e o pico publicado', () => {
  assert.equal(glicogenioAposRefeicao(0), 207);
  assert.equal(glicogenioAposRefeicao(318), 316);
  assert.ok(glicogenioAposRefeicao(317) < glicogenioAposRefeicao(318));
  assert.equal(glicogenioAposRefeicao(360), 316 - 42 * 0.26);
  assert.throws(() => glicogenioAposRefeicao(361), RangeError);
});

test('o jejum mantém a referência às 20h e reproduz a perda às 07h', () => {
  assert.equal(variacaoGlicogenioEmJejum(0), 0);
  assert.equal(variacaoGlicogenioEmJejum(330), -40.3);
  assert.equal(variacaoGlicogenioEmJejum(660), -80.6);
  assert.throws(() => variacaoGlicogenioEmJejum(-1), RangeError);
});

test('produção hepática reproduz as referências sem confundir retorno e nadir', () => {
  for (const [min, taxa] of [[0, 1.90], [10, 0.627], [30, 0], [60, 0.31], [255, 0.49], [380, 1.90]]) {
    assert.ok(Math.abs(fluxoHepaticoAposRefeicao(min) - taxa) < 1e-12);
  }
  assert.throws(() => fluxoHepaticoAposRefeicao(381), RangeError);
});

test('a liberação acumulada integra a taxa, mesmo enquanto o estoque sobe', () => {
  const pontos = simularFluxoHepatico();
  assert.equal(pontos.length, 361);
  assert.equal(pontos[0].liberadoMgKg, 0);
  assert.ok(Math.abs(pontos[10].liberadoMgKg - (1.90 + 0.627) * 10 / 2) < 1e-12);
  assert.ok(pontos.every((p, i) => i === 0 || p.liberadoMgKg >= pontos[i - 1].liberadoMgKg));
  const { minuto, variacao } = CONFERENCIA_GLICOGENIO_120;
  assert.ok(Math.abs(glicogenioAposRefeicao(minuto) - glicogenioAposRefeicao(0) - variacao) < 1);
});
