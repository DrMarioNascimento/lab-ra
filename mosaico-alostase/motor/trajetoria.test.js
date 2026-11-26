import assert from 'node:assert/strict';
import test from 'node:test';
import { agruparTrajetoria, PERFIS_TRAJETORIA, simularTrajetoria } from './trajetoria.js';

test('24 h e sete dias têm o mesmo primeiro dia; água e sono passam à meia-noite', () => {
  const dia = simularTrajetoria('calor', 1, { detalharDia: 0 });
  const semana = simularTrajetoria('calor', 7, { detalharDia: 1 });
  assert.deepEqual(dia.dias[0], semana.dias[0]);
  assert.equal(semana.leitura[0].pressaoSono, dia.estadoFinal.pressaoSono);
  assert.equal(semana.leitura[0].plasmaL, dia.dias[0].plasmaL);
});

test('um ano tem 24 períodos, sem perder nem repetir dias, e a adaptação não diverge', () => {
  const { dias } = simularTrajetoria('treino', 365);
  const agrupado = agruparTrajetoria(dias);
  assert.equal(agrupado.length, 24);
  assert.equal(agrupado.at(-1).fim, 365);
  assert.equal(agrupado[6].fim, 7);
  assert.equal(agrupado[13].fim, 56);
  for (let i = 1; i < agrupado.length; i++) assert.equal(agrupado[i].inicio, agrupado[i - 1].fim + 1);
  assert.ok(dias[83].quedaFC >= 2.7 && dias[83].quedaFC <= 5.8);
  assert.ok(dias[364].quedaFC <= 4);
  assert.equal(simularTrajetoria('regular', 28).dias.at(-1).quedaFC, 0);
});

test('as rotinas de exercício e sono mantêm água, osmolalidade e excreção em domínio no horizonte anual', () => {
  for (const id of Object.keys(PERFIS_TRAJETORIA)) {
    const { dias } = simularTrajetoria(id, 365);
    for (const dia of dias) {
      assert.ok(dia.minPlasma > 2.7 && dia.plasmaL < 3.3);
      assert.ok(dia.maxOsm <= 295);
      assert.ok(dia.ureseL >= 0.8 && dia.ureseL <= 2);
    }
  }
  const normal = simularTrajetoria('treino', 7).dias[4];
  const curto = simularTrajetoria('sono', 7).dias[4];
  assert.ok(curto.saldoSono7d > normal.saldoSono7d);
  assert.ok(curto.pressaoAoAcordar > normal.pressaoAoAcordar);
});
