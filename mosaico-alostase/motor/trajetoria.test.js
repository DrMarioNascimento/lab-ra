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

test('plantão e lazer passam pela madrugada sem sono e conservam a vigília até a noite seguinte', () => {
  const controle = simularTrajetoria('regular', 2);
  for (const id of ['plantao', 'lazer']) {
    const caso = simularTrajetoria(id, 2, { detalharDia: 1 });
    assert.equal(caso.leitura[0].dormindo, false);
    assert.equal(caso.leitura[0].vigiliaContinua, 17);
    const sete = caso.leitura.find((p) => p.min === 420);
    assert.equal(sete.vigiliaContinua, 24);
    assert.equal(sete.dormindo, false);
    assert.equal(caso.dias[1].vigiliaMaxH, 40);
    assert.equal(caso.dias[1].noitesEmClaro, 1);
    assert.ok(caso.dias[1].pressaoAoAcordar > controle.dias[1].pressaoAoAcordar);
  }
});

test('sono diurno interrompe a vigília e a frequência semanal só repete a noite nos dias programados', () => {
  const caso = simularTrajetoria('plantao', 10, { detalharDia: 1, frequenciaNoturna: 'semanal', sonoDiurno: true });
  assert.equal(caso.leitura.find((p) => p.min === 480).dormindo, true);
  assert.equal(caso.leitura.find((p) => p.min === 720).dormindo, false);
  assert.equal(caso.dias[1].vigiliaMaxH, 25);
  assert.equal(caso.dias[1].sonoDiurnoH, 4);
  assert.equal(caso.dias[8].noitesEmClaro, 1);
  assert.equal(caso.dias[4].noitesEmClaro, 0);
});

test('o turno permanente mantém 6 h de sono diurno e aplica a mesma agenda à projeção de um ano', () => {
  const { dias } = simularTrajetoria('turno', 365);
  const ultimo = dias.at(-1);
  assert.equal(ultimo.sonoDiurnoH, 6);
  assert.equal(ultimo.trabalhoNoturnoH, 9);
  assert.equal(dias.reduce((s, d) => s + d.trabalhoNoturnoH, 0), 3285);
  assert.ok(Math.abs(ultimo.saldoSono7d - 15.12) < 0.00001);
  assert.ok(ultimo.pamMedia > 60 && ultimo.pamMedia < 110);
});

test('três escalas controlam as durações e o horário de folga altera a fase sem criar sono', () => {
  const ids = ['escalaDia', 'escalaNoite', 'escalaFolgas'];
  const [dia, noite, folgas] = ids.map((id) => simularTrajetoria(id, 56));
  for (const { dias } of [dia, noite, folgas]) for (let i = 0; i < dias.length; i += 7) {
    const semana = dias.slice(i, i + 7);
    assert.equal(semana.reduce((s, d) => s + d.horasSono, 0), 56);
    assert.equal(semana.reduce((s, d) => s + d.trabalhoH, 0), 40);
  }
  assert.equal(dia.estadoFinal.faseCircadianaH, 0);
  assert.ok(noite.dias[4].faseCircadianaH >= 3 && noite.dias[4].faseCircadianaH <= 5);
  assert.ok(noite.estadoFinal.faseCircadianaH > folgas.estadoFinal.faseCircadianaH);
  assert.ok(folgas.dias[6].faseCircadianaH < folgas.dias[5].faseCircadianaH);
  const fixa = simularTrajetoria('escalaNoite', 56, { faseParcial: false });
  assert.equal(fixa.estadoFinal.faseCircadianaH, 0);
  assert.equal(fixa.estadoFinal.pressaoSono, noite.estadoFinal.pressaoSono);
  assert.notEqual(fixa.dias[55].sonoForaFaseH, noite.dias[55].sonoForaFaseH);
});

test('o caso de luz mantém trabalho e sono iguais e muda a fase a partir da primeira exposição diferente', () => {
  const a = simularTrajetoria('luzSuave', 7, { detalharDia: 1 });
  const b = simularTrajetoria('luzIntensa', 7, { detalharDia: 1 });
  assert.deepEqual(a.dias.map((d) => d.horasSono), b.dias.map((d) => d.horasSono));
  assert.deepEqual(a.dias.map((d) => d.trabalhoH), b.dias.map((d) => d.trabalhoH));
  assert.equal(a.dias.reduce((s, d) => s + d.trabalhoH, 0), 40);
  assert.equal(b.dias.reduce((s, d) => s + d.horasSono, 0), 56);
  assert.equal(a.leitura[0].faseCircadianaH, b.leitura[0].faseCircadianaH);
  assert.equal(b.leitura[1].luzLux, 2500);
  assert.ok(b.leitura[1].faseCircadianaH > a.leitura[1].faseCircadianaH);
  assert.ok(b.estadoFinal.faseCircadianaH > a.estadoFinal.faseCircadianaH);
  assert.ok(b.dias[6].faseCircadianaH < b.dias[5].faseCircadianaH);
  const controle = simularTrajetoria('luzIntensa', 7, { modoFase: 'fixa', detalharDia: 1 });
  assert.equal(controle.leitura[1].luzLux, 2500);
  assert.equal(controle.estadoFinal.faseCircadianaH, 0);
});
