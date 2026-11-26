import assert from 'node:assert/strict';
import test from 'node:test';
import { COORTES_MCHILL, contrasteMaximoMcHill, simularConferenciaMcHill, VISITAS_MCHILL } from './conferencia-mchill.js';

test('conferência usa as três visitas e integra o estado persistente entre elas', () => {
  for (const coorte of Object.keys(COORTES_MCHILL)) {
    const serie = simularConferenciaMcHill(coorte);
    assert.equal(serie.length, 91);
    for (const visita of VISITAS_MCHILL) {
      const p = serie[visita.dia];
      const entrada = visita[coorte];
      assert.equal(p.inicio, entrada.inicio);
      assert.equal(p.fim, entrada.fim % 1440);
      assert.ok(Math.abs(p.variabilidadeH - entrada.variabilidadeH) < 1e-10);
    }
    assert.equal(serie[15].inicio, Math.round((serie[0].inicio + serie[30].inicio) / 2));
    assert.ok(serie.every((p) => Number.isFinite(p.quedaPasPct) && p.cargaSono >= 0 && p.cargaSono <= 1));
    assert.notEqual(serie[45].cargaSono, serie[0].cargaSono);
  }
});

test('cenário de ajuste parcial altera a fase simulada sem reescrever a janela do estudo', () => {
  const fixa = simularConferenciaMcHill('matinal').at(-1);
  const parcial = simularConferenciaMcHill('matinal', { faseParcial: true }).at(-1);
  assert.equal(fixa.faseH, 0);
  assert.ok(parcial.faseH > 0);
  assert.equal(parcial.inicio, fixa.inicio);
  assert.equal(parcial.fim, fixa.fim);
  assert.equal(parcial.variabilidadeH, fixa.variabilidadeH);
  assert.notEqual(parcial.quedaPasPct, fixa.quedaPasPct);
  assert.equal(VISITAS_MCHILL.at(-1).matinal.queda, 6.3);
  assert.throws(() => simularConferenciaMcHill('noturna'), /coorte/);
});

test('comparação extrema conserva a janela e amplia o contraste em relação à carga estimada', () => {
  const diurna = simularConferenciaMcHill('diurna').at(-1);
  const matinal = simularConferenciaMcHill('matinal').at(-1);
  assert.ok(contrasteMaximoMcHill(diurna, matinal) > diurna.quedaPasPct - matinal.quedaPasPct);
});
