import test from 'node:test';
import assert from 'node:assert/strict';
import { SEMANAS } from './semanas.js';
import { conferirSemana, simularSemana } from '../motor/semana.js';
import { novaPartidaSemana, faixaDivida, TEMPOS, VARIAVEIS, DIVIDA } from './prognostico.js';

test('semanas prontas: sete dias, passagens de sono possíveis, simulam sem erro', () => {
  for (const s of SEMANAS) {
    assert.equal(s.dias.length, 7, s.id);
    assert.deepEqual(conferirSemana(s.dias), [], s.id);
    const r = simularSemana(s.dias); assert.equal(r.pontos.length, 1008);
    assert.ok(r.resumo.every((x) => x.horasSono >= 3 && x.horasSono <= 12), s.id);
  }
});

test('semanas prontas contam histórias diferentes', () => {
  const fim = Object.fromEntries(SEMANAS.map((s) => [s.id, simularSemana(s.dias)]));
  assert.ok(fim.regular.dividaFinal < 1.5);
  assert.ok(fim.provas.resumo[4].dividaAcumulada > 14 && fim.provas.dividaFinal < fim.provas.resumo[4].dividaAcumulada);
  assert.ok(fim.festas.resumo[6].remAcumuladoMin > 55);
  assert.ok(fim.plantoes.resumo.every((r) => r.sonoNaFaseAtiva));
});

test('partida da semana: perguntas em ordem, sem repetição, valores dentro da faixa e do controle', () => {
  for (const s of SEMANAS) for (const t of TEMPOS) for (const semente of [1, 5, 42]) {
    const p = novaPartidaSemana(s, t.perguntas, semente);
    assert.ok(p.perguntas.length >= Math.min(5, t.perguntas) - 1 && p.perguntas.length <= t.perguntas, `${s.id}: ${p.perguntas.length} de ${t.perguntas}`);
    const ch = new Set(p.perguntas.map((q) => `${q.dia}-${q.tipo}-${q.hora}-${q.variavel}`)); assert.equal(ch.size, p.perguntas.length);
    for (let i = 1; i < p.perguntas.length; i++) assert.ok(p.perguntas[i].ordem >= p.perguntas[i - 1].ordem);
    assert.ok(p.perguntas.some((q) => q.tipo === 'divida'));
    for (const q of p.perguntas) {
      const v = q.tipo === 'divida' ? DIVIDA : VARIAVEIS[q.variavel];
      assert.ok(q.valor >= q.faixa[0] && q.valor <= q.faixa[1]); assert.ok(q.valor >= v.min && q.valor <= v.max, `${s.id} ${q.variavel} ${q.valor}`);
      assert.ok(q.raciocinio.length >= 1);
    }
  }
});

test('faixa da dívida alarga com os dias e não fica negativa', () => {
  assert.deepEqual(faixaDivida(0, 1), [0, 0.7]); assert.deepEqual(faixaDivida(10, 5), [6.3, 13.7]);
});
