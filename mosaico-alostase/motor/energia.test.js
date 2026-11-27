import assert from 'node:assert/strict';
import test from 'node:test';
import { MEDIDAS_ENERGIA, PASSO_ENERGIA, ROTINAS_ENERGIA, TEMPOS_REFEICAO, simularDiaEnergia } from './energia.js';

test('as três curvas reproduzem os pontos da tabela e preservam a ordem dos percentis', () => {
  const refeicao = ROTINAS_ENERGIA.uma[0];
  for (const [chave, { inferior, mediana, superior }] of Object.entries(MEDIDAS_ENERGIA)) {
    const dia = simularDiaEnergia('uma', chave);
    assert.equal(dia.length, 289);
    for (const [i, min] of TEMPOS_REFEICAO.entries()) {
      assert.ok(inferior[i] <= mediana[i] && mediana[i] <= superior[i]);
      assert.ok(Math.abs(dia[(refeicao + min) / PASSO_ENERGIA] - mediana[i]) < 1e-10);
    }
  }
  assert.equal(simularDiaEnergia('uma', 'glucagon')[(refeicao + 15) / PASSO_ENERGIA], 35.7);
  assert.equal(simularDiaEnergia('uma', 'insulina')[(refeicao + 30) / PASSO_ENERGIA], 371);
});

test('segunda refeição soma seu desvio sem apagar o resíduo da primeira', () => {
  const uma = simularDiaEnergia('uma', 'insulina');
  const duas = simularDiaEnergia('duas', 'insulina');
  const inicio = ROTINAS_ENERGIA.duas[1] / PASSO_ENERGIA;
  assert.deepEqual(uma.slice(0, inicio + 1), duas.slice(0, inicio + 1));
  assert.ok(Math.abs(duas[inicio + 6] - uma[inicio + 6] - (371 - 46.5)) < 1e-10);
  // Depois de 240 min, o desvio é reduzido à metade na hora seguinte.
  assert.equal(uma[(480 + 300) / PASSO_ENERGIA], 46.5 + (24 - 46.5) / 2);
});
