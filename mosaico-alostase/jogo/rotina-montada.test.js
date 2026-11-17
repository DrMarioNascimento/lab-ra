import test from 'node:test';
import assert from 'node:assert/strict';
import { escolhasPadrao, conferir, montarRotina, passo, leitura, residuoSono } from './rotina-montada.js';
import { simularDia } from '../motor/motor.js';

const com = (m) => { const e = escolhasPadrao(); m(e); return e; };

test('rotina padrão é válida e vira rotina do motor', () => {
  const e = escolhasPadrao(); assert.deepEqual(conferir(e), []);
  const r = montarRotina(e);
  assert.equal(r.refeicoes.length, 3); assert.equal(r.jornadas.length, 1); assert.equal(r.alcoolGkg, 0);
  assert.equal(simularDia(r).pontos.length, 144);
});

test('passo de 30 min dá a volta no relógio', () => { assert.equal(passo(23.5, 1), 0); assert.equal(passo(0, -1), 23.5); assert.equal(passo(7, 1), 7.5); });

test('impedimentos: sono curto demais, refeição, exercício e trabalho em hora de sono', () => {
  assert.ok(conferir(com((e) => { e.dormir = 5; })).some((t) => t.includes('pelo menos')));
  assert.ok(conferir(com((e) => { e.dormir = 18; })).some((t) => t.includes('não pode passar')));
  assert.ok(conferir(com((e) => { e.cafe.hora = 6; })).some((t) => t.includes('café')));
  assert.ok(conferir(com((e) => { e.exercicio = { nivel: 'intenso', hora: 6.75, dur: 30 }; })).some((t) => t.includes('exercício')));
  assert.ok(conferir(com((e) => { e.trabalho = { on: true, inicio: 22, fim: 6 }; })).some((t) => t.includes('trabalho')));
  assert.deepEqual(conferir(com((e) => { e.lanche = { on: false, hora: 3 }; })), []);
});

test('trabalho que atravessa a noite vira jornada noturna e dispara o alerta do sono', () => {
  const e = com((x) => { x.dormir = 8; x.acordar = 15; x.trabalho = { on: true, inicio: 22, fim: 6 }; x.cafe.hora = 16; x.almoco.hora = 21; x.jantar.hora = 3; });
  assert.deepEqual(conferir(e), []);
  const r = montarRotina(e);
  assert.equal(r.jornadas[0].tipo, 'trabalho-noturno');
  assert.ok(leitura(r).some((t) => t.includes('relógio')));
});

test('leitura: exercício intenso, álcool e sono curto aparecem com números do motor', () => {
  const r = montarRotina(com((e) => { e.dormir = 2; e.acordar = 7; e.exercicio = { nivel: 'intenso', hora: 18, dur: 30 }; e.alcool = 'muito'; }));
  const t = leitura(r).join(' ');
  assert.match(t, /75% acima/); assert.match(t, /34 minutos de sono REM/); assert.match(t, /5 horas de sono/);
  const s = residuoSono(r); assert.ok(s.aoAcordar > s.comOitoHoras);
  const leve = leitura(montarRotina(com((e) => { e.exercicio = { nivel: 'leve', hora: 18, dur: 30 }; }))).join(' ');
  assert.match(leve, /não tira o cortisol/); assert.doesNotMatch(leve, /REM/);
});

test('sem refeições a glicemia fica na base', () => {
  const r = montarRotina(com((e) => { e.cafe.on = e.almoco.on = e.jantar.on = false; }));
  const d = simularDia(r); assert.ok(d.pontos.every((p) => Math.abs(p.glicemia - 92.8) < 0.01));
  assert.ok(leitura(r, d).some((t) => t.includes('base o dia todo')));
});
