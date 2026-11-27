import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ROTINAS, HORIZONTES, PORCOES, conferirGlicemiaRotinas, curvaGlicemiaDia, simularGlicemiaRotina } from './glicemia-rotinas.js';

test('rotinas preservam energia, carboidrato e o café padronizado em toda a agenda', () => {
  for (const id of Object.keys(ROTINAS)) for (const horizonte of HORIZONTES) for (const porcao of PORCOES) {
    const { dias } = simularGlicemiaRotina(id, horizonte, porcao);
    assert.equal(dias.length, horizonte);
    for (const dia of dias) {
      assert.equal(dia.refeicoes.reduce((s, r) => s + r.pct, 0), 100);
      assert.equal(dia.refeicoes.reduce((s, r) => s + r.carboG, 0), 200);
      assert.equal(dia.refeicoes.find((r) => r.hora === 390)?.carboG, 60);
      assert.equal(dia.refeicoes.find((r) => r.hora === 30)?.pct ?? 0, dia.noturna ? porcao : 0);
      if (dia.atividade) assert.equal(dia.atividade[1] - dia.atividade[0], 360);
      assert.equal(dia.sono[1] - dia.sono[0], 480);
    }
  }
});

test('vigília acumula sem refeição de madrugada e recuperação reduz estado', () => {
  const { dias } = simularGlicemiaRotina('trabalhoNoite', 5, 0);
  assert.deepEqual(dias.map((d) => d.estado.vigilia), [1, 2, 3, 4, 2]);
  assert.equal(dias[0].deltaCafe, 0);
  assert.equal(dias[3].deltaCafe, 0.63);
  assert.equal(dias[4].deltaOgtt, 0.89);
  assert.equal(dias[3].deltaOgtt, null);
  assert.ok(dias.every((d) => d.estado.alimentacao === 0));
});

test('agenda equivalente mantém a resposta entre trabalho e lazer e distingue horário', () => {
  for (const periodo of ['Dia', 'Noite']) {
    const trabalho = simularGlicemiaRotina(`trabalho${periodo}`, 28, 10);
    const lazer = simularGlicemiaRotina(`lazer${periodo}`, 28, 10);
    assert.deepEqual(trabalho.dias.map((d) => d.deltaCafe), lazer.dias.map((d) => d.deltaCafe));
  }
  const diurna = simularGlicemiaRotina('trabalhoDia', 28, 30);
  assert.ok(diurna.dias.every((d) => d.deltaCafe === 0 && d.deltaOgtt === null));
  const alternada = simularGlicemiaRotina('alternada', 28, 30);
  assert.equal(alternada.dias.filter((d) => d.noturna).length, 16);
  assert.ok(alternada.dias[4].deltaCafe < alternada.dias[3].deltaCafe);
  const fixo = simularGlicemiaRotina('trabalhoNoite', 28, 30);
  assert.equal(fixo.dias[6].deltaCafe, fixo.dias[27].deltaCafe);
});

test('tabelas mantêm as âncoras e conferem o lanche em dois desfechos separados', () => {
  for (const { calibrado, cafe, ogtt } of conferirGlicemiaRotinas()) {
    for (const d of [cafe, ogtt]) {
      if (calibrado) assert.ok(Math.abs(d.modelo - d.media) < 1e-10);
      else assert.ok(d.modelo > d.ic[0] && d.modelo < d.ic[1] && d.modelo !== d.media);
    }
  }
});

test('sono mais curto eleva a pressão no café e omite o teste do protocolo', () => {
  const curta = simularGlicemiaRotina('trabalhoNoite', 5, 10, 6);
  const regular = simularGlicemiaRotina('trabalhoNoite', 5, 10);
  assert.ok(curta.dias[3].pressaoSonoNoCafe > regular.dias[3].pressaoSonoNoCafe);
  assert.equal(curta.dias[4].deltaOgtt, null);
});

test('curva atravessa a troca de dia sem perder a cauda da última refeição', () => {
  const dados = simularGlicemiaRotina('trabalhoNoite', 5, 10);
  const dia = curvaGlicemiaDia(dados, 0);
  const seguinte = curvaGlicemiaDia(dados, 1);
  assert.equal(dia.length, 289);
  assert.equal(dia.at(-1), seguinte[0]);
});
