import test from 'node:test';
import assert from 'node:assert/strict';
import { simularDia } from './motor.js';
import { simularSemana, conferirSemana, diaDaSemana } from './semana.js';
import { ROTINAS } from './rotinas-exemplo.js';

const perto = (a, b, tol) => assert.ok(Math.abs(a - b) <= tol, `${a} deveria estar a ${tol} de ${b}`);
const sete = (r) => Array(7).fill(r);
const base = { refeicoes: [{ hora: 12, carboG: 50 }], jornadas: [] };

test('sete dias iguais: cada dia repete o dia isolado (cortisol e glicemia exatos; pressão de sono estabilizada)', () => {
  for (const k of ['diurna', 'noturna', 'noiteAtiva']) {
    const um = simularDia(ROTINAS[k]), sem = simularSemana(sete(ROTINAS[k]));
    assert.equal(sem.pontos.length, 7 * 144);
    const d3 = diaDaSemana(sem, 3).pontos;
    for (let i = 0; i < 144; i++) {
      perto(d3[i].hora, um.pontos[i].hora, 1e-9);
      perto(d3[i].cortisol, um.pontos[i].cortisol, 0.011); perto(d3[i].glicemia, um.pontos[i].glicemia, 0.11);
      assert.equal(d3[i].dormindo, um.pontos[i].dormindo, `${k} às ${d3[i].hora}`);
      perto(d3[i].pressaoSono, um.pontos[i].pressaoSono, 0.03);
    }
  }
});

test('dívida: 8,16 h de sono por noite não acumula; 6 h acumula 2,16 h por dia (Van Dongen)', () => {
  const s816 = simularSemana(sete({ ...base, sono: [{ inicio: 22.84, fim: 7 }] }));
  perto(s816.dividaFinal, 0, 0.05);
  const s6 = simularSemana(sete({ ...base, sono: [{ inicio: 1, fim: 7 }] }));
  perto(s6.resumo[0].dividaAcumulada, 2.16, 0.01); perto(s6.dividaFinal, 7 * 2.16, 0.05);
  for (let d = 1; d < 7; d++) assert.ok(s6.resumo[d].dividaAcumulada > s6.resumo[d - 1].dividaAcumulada);
  const s4 = simularSemana(sete({ ...base, sono: [{ inicio: 3, fim: 7 }] }));
  perto(s4.dividaFinal, 7 * 4.16, 0.05);
  perto(s4.noitesSemDormirEquivalentes, (7 * 4.16) / 24.2, 0.01);
});

test('equivalência do artigo: 14 dias de 6 h ficam perto de 1 noite sem dormir; 14 de 4 h, perto de 2', () => {
  perto((14 * 2.16) / 24.2, 1, 0.3); perto((14 * 4.16) / 24.2, 2, 0.45);
});

test('fim de semana dormindo mais abate a dívida, sem ficar negativa', () => {
  const curto = { ...base, sono: [{ inicio: 1, fim: 7 }] }, longo = { ...base, sono: [{ inicio: 23, fim: 9 }] };
  const s = simularSemana([curto, curto, curto, curto, curto, longo, longo]);
  assert.ok(s.resumo[5].dividaAcumulada < s.resumo[4].dividaAcumulada);
  assert.ok(s.resumo.every((r) => r.dividaAcumulada >= 0));
  // a noite de sexta para sábado vai da 1h às 9h: 8 h
  perto(s.resumo[5].horasSono, 8, 0.01); perto(s.resumo[4].horasAcordado, 18, 0.01);
});

test('pressão de sono ao acordar sobe ao longo de uma semana de noites curtas e passa a estabilizar', () => {
  const s = simularSemana(sete({ ...base, sono: [{ inicio: 3, fim: 7 }] }));
  const p = s.resumo.map((r) => r.pressaoAoAcordar);
  assert.ok(p[6] > 0.25);
  assert.ok(Math.abs(p[6] - p[5]) < 0.01, 'o modelo de dois processos estabiliza; a dívida continua crescendo');
  assert.ok(s.resumo[6].dividaAcumulada > s.resumo[5].dividaAcumulada + 4);
});

test('álcool: REM perdido soma noite a noite', () => {
  const s = simularSemana(sete(ROTINAS.noiteAtiva));
  perto(s.resumo[0].remPerdidoMin, 30.3, 0.1); perto(s.resumo[6].remAcumuladoMin, 7 * 30.3, 0.5);
});

test('conferência da semana barra passagem com sono impossível', () => {
  const dia = { ...base, sono: [{ inicio: 23, fim: 7 }] }, noite = { ...base, sono: [{ inicio: 8, fim: 15 }] };
  assert.deepEqual(conferirSemana(sete(dia)), []);
  const e = conferirSemana([dia, dia, noite, noite, dia, dia, dia]);
  assert.ok(e.length >= 1 && e[0].includes('terça para quarta'));
});

test('jornada noturna a semana toda: o sono cai na fase ativa do cortisol todos os dias', () => {
  const s = simularSemana(sete(ROTINAS.noturna));
  assert.ok(s.resumo.every((r) => r.sonoNaFaseAtiva));
  assert.ok(!simularSemana(sete(ROTINAS.diurna)).resumo.some((r) => r.sonoNaFaseAtiva));
});
