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
