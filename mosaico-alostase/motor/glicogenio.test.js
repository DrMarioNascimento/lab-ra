import assert from 'node:assert/strict';
import test from 'node:test';
import { glicogenioAposRefeicao, variacaoGlicogenioEmJejum } from './glicogenio.js';

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
