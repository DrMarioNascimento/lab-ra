import test from 'node:test';
import assert from 'node:assert/strict';
import { PERFIS, iniciar, metas, META_ATIVIDADE_MIN } from './perfis.js';
import { conferir, montarRotina } from './rotina-montada.js';
import { conferirSemana, simularSemana } from '../motor/semana.js';

const semana = (t) => ['A', 'A', 'A', 'A', 'A', 'B', 'B'].map((k) => t[k]);

test('perfis: a rotina inicial é válida, a semana simula e começa sem cumprir a meta inteira', () => {
  for (const p of PERFIS) {
    const t = iniciar(p);
    assert.deepEqual(conferir(t.A), [], `${p.id} A`); assert.deepEqual(conferir(t.B), [], `${p.id} B`);
    const rot = semana(t).map(montarRotina);
    assert.deepEqual(conferirSemana(rot), [], p.id);
    assert.ok(simularSemana(rot).resumo.length === 7);
    assert.ok(rot[0].jornadas.some((j) => j.tipo === 'compromisso'));
    const m = metas(p, semana(t));
    assert.equal(m.cumpriu, false, `${p.id} já começa cumprindo`); assert.equal(m.ativMin, 0);
  }
});

test('conflito real: quem trabalha e estuda à noite já começa a semana devendo sono', () => {
  const p = PERFIS.find((x) => x.id === 'trabalho-faculdade'), t = iniciar(p);
  const s = simularSemana(semana(t).map(montarRotina));
  assert.ok(s.resumo[4].dividaAcumulada > 8, `sexta com ${s.resumo[4].dividaAcumulada}`);
});

test('compromisso fixo barra sono, estudo e exercício em cima dele', () => {
  const t = iniciar(PERFIS[0]);
  const a = JSON.parse(JSON.stringify(t.A)); a.acordar = 8; assert.ok(conferir(a).some((x) => x.includes('compromisso')));
  const b = JSON.parse(JSON.stringify(t.A)); b.trabalho = { on: true, inicio: 14, fim: 16 }; assert.ok(conferir(b).some((x) => x.includes('estudo está em cima')));
  const c = JSON.parse(JSON.stringify(t.A)); c.exercicio = { nivel: 'intenso', hora: 8, dur: 30 }; assert.ok(conferir(c).some((x) => x.includes('exercício está em cima')));
});

test('metas: estudo soma as horas da semana; exercício intenso vale o dobro; leve não conta', () => {
  const p = PERFIS[0], t = iniciar(p);
  t.A.exercicio = { nivel: 'intenso', hora: 21.5, dur: 30 }; t.B.exercicio = { nivel: 'leve', hora: 17, dur: 30 };
  const m = metas(p, semana(t));
  assert.equal(m.ativMin, 5 * 60); assert.ok(m.ativOk); assert.equal(m.estudoH, 5 * 2 + 2 * 2.5); assert.equal(m.estudoOk, true);
  assert.equal(META_ATIVIDADE_MIN, 150);
});
