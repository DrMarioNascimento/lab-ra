// Mosaico Alostase · desafio da semana: perfis com compromissos fixos e meta semanal.
// Os perfis são CENÁRIOS de jogo (horários inventados para criar o conflito), não dados de literatura.
// A meta de atividade física segue a recomendação da OMS (2020): 150 min por semana de intensidade
// moderada, ou 75 min de intensa (1 min intenso vale 2 moderados).
import { escolhasPadrao, NIVEIS } from './rotina-montada.js';

export const META_ATIVIDADE_MIN = 150;
const mod24 = (h) => ((h % 24) + 24) % 24;
const dur = (ini, fim) => mod24(fim - ini) || 24;

const CRITICA = 15.84;                                  // limite de vigília por dia (Van Dongen 2003), o mesmo do motor
const esc = (m) => { const e = escolhasPadrao(); m(e); return e; };

export const PERFIS = [
  { id: 'manha-estagio', nome: 'Aula de manhã, estágio à tarde', resumo: 'O dia já vem cheio das 6h30 às 18h30. Sobra a noite.', metaEstudoH: 15,
    A: { fixos: [{ nome: 'Ida', inicio: 6.5, fim: 7.5 }, { nome: 'Aulas', inicio: 7.5, fim: 12 }, { nome: 'Estágio', inicio: 13.5, fim: 17.5 }, { nome: 'Volta', inicio: 17.5, fim: 18.5 }],
      e: esc((e) => { e.dormir = 22.5; e.acordar = 5.5; e.cafe.hora = 6; e.almoco.hora = 12.5; e.jantar.hora = 19; e.trabalho = { on: true, inicio: 19.5, fim: 21.5 }; }) },
    B: { fixos: [], e: esc((e) => { e.dormir = 23.5; e.acordar = 8; e.cafe.hora = 8.5; e.almoco.hora = 13; e.jantar.hora = 20; e.trabalho = { on: true, inicio: 9.5, fim: 12 }; }) } },
  { id: 'trabalho-faculdade', nome: 'Trabalha de dia, faculdade à noite', resumo: 'Das 7h às 23h30 quase tudo tem dono. O estudo precisa caber em algum lugar.', metaEstudoH: 10,
    A: { fixos: [{ nome: 'Ida', inicio: 7, fim: 8 }, { nome: 'Trabalho', inicio: 8, fim: 17 }, { nome: 'Trajeto', inicio: 17, fim: 18 }, { nome: 'Aulas', inicio: 19, fim: 22.5 }, { nome: 'Volta', inicio: 22.5, fim: 23.5 }],
      e: esc((e) => { e.dormir = 0, e.acordar = 6; e.cafe.hora = 6.5; e.almoco.hora = 12; e.jantar.hora = 18.5; e.trabalho = { on: false, inicio: 5, fim: 6 }; }) },
    B: { fixos: [], e: esc((e) => { e.dormir = 0; e.acordar = 8.5; e.cafe.hora = 9; e.almoco.hora = 13; e.jantar.hora = 20; e.trabalho = { on: true, inicio: 14, fim: 18 }; }) } },
  { id: 'eventos-fim-de-semana', nome: 'Aula na semana, eventos esportivos no fim de semana', resumo: 'Sem dia livre de verdade: sábado e domingo são de trabalho em evento esportivo, que começa cedo.', metaEstudoH: 20,
    A: { fixos: [{ nome: 'Ida', inicio: 7, fim: 8 }, { nome: 'Aulas', inicio: 8, fim: 12 }, { nome: 'Volta', inicio: 12, fim: 13 }],
      e: esc((e) => { e.dormir = 23; e.acordar = 6; e.cafe.hora = 6.5; e.almoco.hora = 13; e.jantar.hora = 19.5; e.trabalho = { on: true, inicio: 14, fim: 18 }; }) },
    B: { fixos: [{ nome: 'Ida', inicio: 5, fim: 6 }, { nome: 'Trabalho no evento esportivo', inicio: 6, fim: 16 }, { nome: 'Volta', inicio: 16, fim: 17 }],
      e: esc((e) => { e.dormir = 21.5; e.acordar = 4.5; e.cafe.hora = 4.5; e.almoco.hora = 11.5; e.jantar.hora = 19; e.trabalho = { on: false, inicio: 17.5, fim: 19 }; }) } },
];

/** Monta as escolhas iniciais de um perfil (cópias, para o aluno poder mexer). */
export function iniciar(perfil) {
  const copia = (t) => { const e = JSON.parse(JSON.stringify(t.e)); e.fixos = JSON.parse(JSON.stringify(t.fixos)); e.rotuloFlex = 'Estudo'; return e; };
  return { A: copia(perfil.A), B: copia(perfil.B) };
}

/** Quanto da meta a semana cumpre. escolhasPorDia: 7 objetos de escolhas. */
export function metas(perfil, escolhasPorDia) {
  let estudoH = 0, ativMin = 0;
  for (const e of escolhasPorDia) {
    if (e.trabalho.on) estudoH += dur(e.trabalho.inicio, e.trabalho.fim);
    const vo2 = NIVEIS.find((n) => n.id === e.exercicio.nivel).vo2;
    if (vo2 >= 80) ativMin += 2 * e.exercicio.dur; else if (vo2 >= 60) ativMin += e.exercicio.dur;
  }
  return { estudoH, metaEstudoH: perfil.metaEstudoH, estudoOk: estudoH >= perfil.metaEstudoH - 1e-9, ativMin, metaAtivMin: META_ATIVIDADE_MIN, ativOk: ativMin >= META_ATIVIDADE_MIN, cumpriu: estudoH >= perfil.metaEstudoH - 1e-9 && ativMin >= META_ATIVIDADE_MIN };
}

/**
 * O que os compromissos já custam, antes de qualquer escolha: do primeiro ao último compromisso
 * do dia, quantas horas a pessoa fica de pé, e o piso de dívida que isso impõe na semana
 * (supondo acordar na hora do primeiro compromisso e dormir no fim do último).
 */
export function pisoDosCompromissos(perfil, tipos = ['A', 'A', 'A', 'A', 'A', 'B', 'B']) {
  const vao = (fixos) => (fixos.length ? Math.max(...fixos.map((f) => f.fim)) - Math.min(...fixos.map((f) => f.inicio)) : 0);
  const A = vao(perfil.A.fixos), B = vao(perfil.B.fixos);
  let divida = 0, naSexta = 0;
  tipos.forEach((k, d) => { const v = k === 'A' ? A : B; divida = Math.max(0, divida + (v ? v - CRITICA : -Infinity)); if (!Number.isFinite(divida)) divida = 0; if (d === 4) naSexta = divida; });
  return { horasDePeUtil: A, horasDePeLivre: B, pisoNaSexta: +naSexta.toFixed(2), pisoNoDomingo: +divida.toFixed(2) };
}
