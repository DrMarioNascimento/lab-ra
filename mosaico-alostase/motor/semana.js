// Mosaico Alostase · motor da semana 1: sete dias seguidos, hora a hora, com o que passa de um dia para o outro.
// O que acumula: pressão de sono (contínua), vigília em excesso (dívida de sono) e REM perdido.
// O que NÃO muda com o acúmulo, por falta de número lido: as curvas de cortisol e de glicemia de cada dia.
import { P } from './parametros.js';
import { cortisolBase, efeitoExercicioCortisol, efeitoRefeicaoGlicemia, fatorGlicemiaCircadiana, PASSO_MIN } from './motor.js?v=2';

const mod24 = (h) => ((h % 24) + 24) % 24;
export const SONO_MIN_H = 3, SONO_MAX_H = 12;

/** Horários absolutos (em horas desde a 0h do dia 0) do período acordado de cada dia. */
export function linhaDaSemana(rotinas) {
  const dias = rotinas.map((r, d) => {
    const s = r.sono[r.sono.length - 1], acorda = 24 * d + mod24(s.fim);
    let deita = 24 * d + mod24(s.inicio); if (deita <= acorda) deita += 24;
    return { d, rotina: r, acorda, deita };
  });
  const s0 = rotinas[0].sono[rotinas[0].sono.length - 1];
  const antes = dias[0].acorda - (mod24(s0.fim - s0.inicio) || 24);        // a noite anterior ao dia 0 segue a rotina do dia 0
  const sonos = [{ inicio: antes, fim: dias[0].acorda }];
  for (let d = 0; d < dias.length - 1; d++) sonos.push({ inicio: dias[d].deita, fim: dias[d + 1].acorda });
  const u = dias[dias.length - 1], su = u.rotina.sono[u.rotina.sono.length - 1];
  sonos.push({ inicio: u.deita, fim: u.deita + (mod24(su.fim - su.inicio) || 24) });
  return { dias, sonos };
}

/** Impedimentos da semana: noites curtas ou longas demais na passagem de um dia para o outro. */
export function conferirSemana(rotinas, nomes = ['segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado', 'domingo']) {
  const { sonos } = linhaDaSemana(rotinas), erros = [];
  for (let d = 1; d < rotinas.length; d++) {
    const h = sonos[d].fim - sonos[d].inicio;
    if (h < SONO_MIN_H) erros.push(`De ${nomes[d - 1]} para ${nomes[d]} o sono teria ${h <= 0 ? 'menos de 1 hora' : `${h.toFixed(1).replace('.', ',')} h`}: aproxime os horários dos dois tipos de dia.`);
    if (h > SONO_MAX_H) erros.push(`De ${nomes[d - 1]} para ${nomes[d]} o sono teria ${h.toFixed(1).replace('.', ',')} h: aproxime os horários dos dois tipos de dia.`);
  }
  return erros;
}

export function simularSemana(rotinas) {
  const { dias, sonos } = linhaDaSemana(rotinas), g = P.glicemia, s = P.pressaoSono, dv = P.dividaSono, al = P.alcool;
  const dormindo = (t) => sonos.some((b) => t >= b.inicio - 1e-9 && t < b.fim - 1e-9);
  // eventos em horário absoluto; o que cai depois da meia-noite pertence ao mesmo período acordado
  const abs = (dia, h) => { let t = 24 * dia.d + mod24(h); if (t < dia.acorda - 1e-9) t += 24; return t; };
  const refeicoes = [], exercicios = [];
  for (const dia of [{ ...dias[0], d: -1, acorda: dias[0].acorda - 24 }, ...dias]) {
    for (const m of dia.rotina.refeicoes) refeicoes.push({ m, t: abs(dia, m.hora) });
    for (const j of dia.rotina.jornadas) if (j.tipo === 'exercicio') exercicios.push({ j, t: abs(dia, j.inicio), fase: dia.rotina.deslocamentoRelogioH ?? 0 });
  }
  const passos = (24 * 60) / PASSO_MIN, dt = PASSO_MIN / 60;
  let S = 0.5; const pontos = [];
  for (let k = -passos; k < passos * dias.length; k++) {
    const t = k * dt, dorme = dormindo(t);
    S = dorme ? S * Math.exp(-dt / s.tauQuedaH.valor) : 1 - (1 - S) * Math.exp(-dt / s.tauSubidaH.valor);
    if (k < 0) continue;
    const fase = dias[Math.floor(k / passos)].rotina.deslocamentoRelogioH ?? 0;
    const base = cortisolBase(t - fase);
    let cort = base, subida = 0;
    for (const e of exercicios) cort += efeitoExercicioCortisol(e.j, (t - e.t) * 60, e.fase);
    for (const r of refeicoes) subida += efeitoRefeicaoGlicemia(r.m, (t - r.t) * 60);
    pontos.push({ t: +t.toFixed(4), dia: Math.floor(k / passos), hora: ((k % passos) * PASSO_MIN) / 60, dormindo: dorme,
      cortisol: +cort.toFixed(2), cortisolBase: +base.toFixed(2), glicemia: +((g.base.valor + Math.min(subida, g.subidaMax.valor)) * fatorGlicemiaCircadiana(fase)).toFixed(1), pressaoSono: +S.toFixed(3) });
  }
  let divida = 0, remTotal = 0;
  const resumo = dias.map((dia) => {
    const sono = sonos[dia.d].fim - sonos[dia.d].inicio, acordado = dia.deita - dia.acorda;
    const saldo = acordado - dv.vigiliaCriticaH.valor;
    divida = Math.max(0, divida + saldo);
    const gkg = dia.rotina.alcoolGkg || 0, rem = gkg >= al.doseMinimaGkg.valor ? al.remPerdidoMinPorGkg.valor * gkg : 0;
    remTotal += rem;
    const pAcordar = pontos.find((p) => Math.abs(p.t - dia.acorda) < 1e-6);
    return { dia: dia.d, horasSono: +sono.toFixed(2), horasAcordado: +acordado.toFixed(2), saldo: +saldo.toFixed(2), dividaAcumulada: +divida.toFixed(2),
      remPerdidoMin: +rem.toFixed(1), remAcumuladoMin: +remTotal.toFixed(1), pressaoAoAcordar: pAcordar ? pAcordar.pressaoSono : null,
      sonoNaFaseAtiva: cortisolBase(dia.deita - (dia.rotina.deslocamentoRelogioH ?? 0)) > P.cortisol.mesor.valor };
  });
  return { pontos, resumo, dividaFinal: +divida.toFixed(2), noitesSemDormirEquivalentes: +(divida / dv.umaNoiteSemDormirH.valor).toFixed(2) };
}

/** Os pontos de um dia da semana, no formato de simularDia (para a leitura hora a hora). */
export function diaDaSemana(semana, d) {
  return { pontos: semana.pontos.filter((p) => p.dia === d), resumo: semana.resumo[d] };
}
