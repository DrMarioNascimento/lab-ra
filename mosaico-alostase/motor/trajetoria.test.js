import assert from 'node:assert/strict';
import test from 'node:test';
import { agendaCompararLanche, conferirGlicemiaRotinas, PORCOES, resumirSensibilidadeGlicemica, simularGlicemiaRotina } from './glicemia-rotinas.js';
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

test('agenda de quatro plantões reproduz a trajetória da bancada e a conferência da tabela 3', () => {
  const tabela = conferirGlicemiaRotinas();
  for (const porcao of PORCOES) {
    const eventos = agendaCompararLanche(porcao);
    const bancada = simularGlicemiaRotina('trabalhoNoite', 5, porcao);
    const traj = simularTrajetoria('personalizada', 5, { eventos });
    assert.deepEqual(traj.dias.map((d) => d.deltaAucCafe), bancada.dias.map((d) => d.deltaCafe));
    assert.equal(traj.dias[3].deltaAucCafe, tabela.find((r) => r.porcao === porcao).cafe.modelo);
    assert.ok(traj.dias[4].deltaAucCafe < traj.dias[3].deltaAucCafe);
  }
});

test('mudar o horário do lanche altera a curva imediata e o indicador sem mudar sono e outros sistemas', () => {
  const a = simularTrajetoria('carboAs19', 5, { detalharDia: 3 });
  const b = simularTrajetoria('carboAs0030', 5, { detalharDia: 3 });
  for (const medida of ['horasSono', 'trabalhoH', 'pamMedia', 'minPlasma']) {
    assert.deepEqual(a.dias.map((d) => d[medida]), b.dias.map((d) => d[medida]));
  }
  const idx01h = 60 / 5;
  assert.ok(b.leitura[idx01h].glicemia > a.leitura[idx01h].glicemia);
  assert.ok(b.dias[3].deltaAucCafe > a.dias[3].deltaAucCafe);
  assert.equal(simularTrajetoria('escalaDia', 7).dias.at(-1).deltaAucCafe, 0);
});

test('estado tem histórico independente do horizonte escolhido e fica limitado na projeção', () => {
  const curta = simularTrajetoria('carboAs0030', 5);
  const longa = simularTrajetoria('carboAs0030', 28);
  assert.deepEqual(longa.dias.slice(0, 5), curta.dias);
  assert.ok(longa.estadoFinal.glicemiaAcumulada.vigilia <= 4);
  assert.ok(longa.estadoFinal.glicemiaAcumulada.alimentacao <= 4);
  assert.equal(agruparTrajetoria(longa.dias).at(-1).deltaAucCafe, longa.dias.at(-1).deltaAucCafe);
});

test('a conta glicêmica abre as parcelas e mostra perda de estado na recuperação', () => {
  const { dias } = simularTrajetoria('carboAs0030', 5);
  assert.equal(dias[0].contaGlicemia.retencaoPct, null);
  assert.equal(dias[0].contaGlicemia.deltaDiaAnterior, null);
  const noite4 = dias[3].contaGlicemia;
  assert.equal(noite4.vigiliaMin, 360);
  assert.equal(noite4.carboMadrugadaG, 20);
  assert.equal(noite4.carbo24hG, 200);
  assert.equal(noite4.carboMadrugadaPct, 10);
  assert.equal(noite4.retencaoPct, 100);
  const recuperacao = dias[4].contaGlicemia;
  assert.equal(recuperacao.vigiliaMin, 0);
  assert.equal(recuperacao.carboMadrugadaG, 0);
  assert.equal(recuperacao.retencaoPct, 50);
  assert.ok(recuperacao.deltaDiaAnterior < 0);
  for (const { contaGlicemia, deltaAucCafe } of dias) {
    assert.ok(Math.abs(contaGlicemia.deltaVigilia + contaGlicemia.deltaAlimentacao - deltaAucCafe) < 1e-12);
  }
});

test('28 dias em escalas diferentes igualam a exposição semanal e a ingestão', () => {
  const bloco = simularTrajetoria('glicemiaBloco', 28).dias;
  const distribuida = simularTrajetoria('glicemiaDistribuida', 28).dias;
  const somar = (dias, ler) => dias.reduce((total, d) => total + ler(d), 0);
  for (let inicio = 0; inicio < 28; inicio += 7) {
    for (const escala of [bloco, distribuida]) {
      const semana = escala.slice(inicio, inicio + 7);
      assert.equal(somar(semana, (d) => d.contaGlicemia.vigiliaMin), 4 * 360);
      assert.equal(somar(semana, (d) => d.contaGlicemia.carboMadrugadaG), 80);
      assert.equal(somar(semana, (d) => d.contaGlicemia.carbo24hG), 1400);
      assert.equal(somar(semana, (d) => d.horasSono), 56);
      assert.equal(somar(semana, (d) => d.trabalhoH), 30);
      assert.equal(somar(semana, (d) => d.trabalhoNoturnoH), 24);
    }
  }
  assert.notDeepEqual(bloco.map((d) => d.deltaAucCafe), distribuida.map((d) => d.deltaAucCafe));
});

test('a hipótese de meia-vida altera a recuperação, preservando as curvas diárias', () => {
  const simular = (meiaVidaGlicemiaH) => simularTrajetoria('glicemiaBloco', 7, { meiaVidaGlicemiaH, detalharDia: 4 });
  const rapida = simular(12), padrao = simular(24), lenta = simular(48);
  assert.equal(rapida.dias[4].contaGlicemia.retencaoPct, 25);
  assert.equal(padrao.dias[4].contaGlicemia.retencaoPct, 50);
  assert.ok(Math.abs(lenta.dias[4].contaGlicemia.retencaoPct - 70.710678) < 1e-6);
  assert.equal(rapida.dias[3].deltaAucCafe, lenta.dias[3].deltaAucCafe);
  assert.ok(rapida.dias[4].deltaAucCafe < lenta.dias[4].deltaAucCafe);
  assert.deepEqual(rapida.leitura, lenta.leitura);
  assert.throws(() => simular(0), RangeError);
});

test('o painel de sensibilidade reproduz o cálculo diário completo nas três hipóteses', () => {
  for (const perfil of ['glicemiaBloco', 'glicemiaDistribuida', 'escalaDia']) {
    const { dias } = simularTrajetoria(perfil, 28);
    for (const linha of resumirSensibilidadeGlicemica(dias)) {
      const referencia = simularTrajetoria(perfil, 28, { meiaVidaGlicemiaH: linha.meiaVidaH });
      const valores = referencia.dias.map((d) => d.deltaAucCafe);
      assert.equal(linha.final, valores.at(-1));
      assert.equal(linha.media, valores.reduce((soma, x) => soma + x, 0) / valores.length);
      assert.equal(linha.pico, Math.max(...valores));
      assert.equal(linha.diaPico, valores.indexOf(linha.pico) + 1);
    }
  }
});
