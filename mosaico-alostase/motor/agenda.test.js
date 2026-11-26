import assert from 'node:assert/strict';
import test from 'node:test';
import { agendaInicial, conferirAgenda, prepararAgenda } from './agenda.js';
import { simularTrajetoria } from './trajetoria.js';

test('agenda permite trabalho, refeição, líquidos e dois exercícios de madrugada, com sono diurno', () => {
  const eventos = [
    ...agendaInicial(true),
    { tipo: 'exercicio', inicio: 1410, duracao: 45, intensidade: 40 },
    { tipo: 'exercicio', inicio: 240, duracao: 30, intensidade: 40 },
    { tipo: 'refeicao', inicio: 60, carboG: 50 },
  ];
  assert.equal(prepararAgenda(eventos).atividadeEm(5), 'trabalho');
  const modelo = simularTrajetoria('personalizada', 2, { eventos, detalharDia: 0 });
  const a = modelo.leitura.find((p) => p.min === 5);
  const b = modelo.leitura.find((p) => p.min === 245);
  assert.equal(modelo.dias[0].treinoMin, 75);
  assert.ok(a.exercicio && b.exercicio);
  assert.ok(a.fc > 80 && b.fc > 80);
  assert.ok(modelo.leitura.find((p) => p.min === 110).glicemia > 130);
});

test('agenda impede sobreposição a sono e permite duas noites em vigília dentro do domínio', () => {
  const eventos = agendaInicial();
  assert.throws(() => conferirAgenda([...eventos, { tipo: 'lazer', inicio: 1400, fim: 120 }]), /coincide/);
  const acordado = eventos.filter((e) => e.tipo !== 'dormir');
  assert.equal(simularTrajetoria('personalizada', 2, { eventos: acordado }).dias[1].vigiliaMaxH, 48);
  assert.throws(() => simularTrajetoria('personalizada', 3, { eventos: acordado }), /48 h/);
});

test('evento atravessa domingo e segunda, sem repetir a parte noturna nos outros dias', () => {
  const agenda = prepararAgenda([{ tipo: 'trabalho', dias: [6], inicio: 1320, fim: 360 }]);
  assert.equal(agenda.dia(6).atividadeEm(1400), 'trabalho');
  assert.equal(agenda.dia(0).atividadeEm(10), 'trabalho');
  assert.equal(agenda.dia(0).atividadeEm(360), undefined);
  assert.equal(agenda.dia(1).atividadeEm(10), undefined);
  assert.throws(() => conferirAgenda([
    { tipo: 'dormir', inicio: 0, fim: 480, dias: [0] },
    { tipo: 'oracao', inicio: 1430, fim: 15, dias: [6] },
  ]), /coincide com o sono/);
});

test('pausas coexistem com trabalho e o ritmo só aparece durante biofeedback', () => {
  const base = agendaInicial(true);
  const eventos = [
    ...base,
    { tipo: 'meditacao', inicio: 1200, fim: 1210, dias: [0] },
    { tipo: 'oracao', inicio: 1230, fim: 1240, dias: [0] },
    { tipo: 'biofeedback', inicio: 1435, fim: 15, ritmo: 6, dias: [0] },
  ];
  const controle = simularTrajetoria('personalizada', 2, { eventos: base, detalharDia: 1 });
  const r = simularTrajetoria('personalizada', 2, { eventos, detalharDia: 1 });
  assert.deepEqual(r.dias.map((d) => d.pausaMin), [25, 15]);
  assert.equal(r.dias[0].trabalhoH, controle.dias[0].trabalhoH);
  assert.equal(r.estadoFinal.pressaoSono, controle.estadoFinal.pressaoSono);
  assert.equal(r.dias[1].pamMedia, controle.dias[1].pamMedia);
  assert.equal(r.leitura[1].atividade, 'Biofeedback respiratório');
  assert.equal(r.leitura[1].ritmoOrientado, 6);
  assert.equal(r.leitura[3].ritmoOrientado, 0);
});

test('exercício semanal de meia-noite aplica somente a sessão que realmente começou no dia', () => {
  const eventos = [...agendaInicial(true), { tipo: 'exercicio', inicio: 1430, duracao: 30, intensidade: 40, dias: [0] }];
  const primeira = simularTrajetoria('personalizada', 1, { eventos, detalharDia: 0 });
  const amanha = simularTrajetoria('personalizada', 2, { eventos, detalharDia: 1 });
  assert.equal(primeira.leitura[0].exercicio, false);
  assert.equal(primeira.leitura.at(-1).exercicio, true);
  assert.equal(amanha.leitura[0].exercicio, true);
  assert.equal(amanha.leitura.find((p) => p.min === 20).exercicio, false);
  assert.equal(amanha.leitura.at(-1).exercicio, false);
});

test('luz é independente da atividade e os pulsos cruzam a meia-noite sem duplicar', () => {
  const entrada = { tipo: 'luz', inicio: 1430, fim: 15, dias: [0], lux: 450 };
  const agenda = prepararAgenda([...agendaInicial(true), entrada]);
  assert.equal(agenda.dia(0).luxEm(1435), 450);
  assert.equal(agenda.dia(1).luxEm(10), 450);
  assert.equal(agenda.dia(1).atividadeEm(10), 'trabalho');
  assert.equal(agenda.dia(1).luxEm(15), 0);
  assert.equal(agenda.dia(2).luxEm(10), 0);
  assert.throws(() => conferirAgenda([...agendaInicial(true), { ...entrada, inicio: 480, fim: 600 }]), /coincide com o sono/);
});
