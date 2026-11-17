// Mosaico Alostase · motor de um dia, hora a hora (primeiro lote).
// Variáveis: cortisol (soro total), glicemia e pressão de sono.
// Regra do projeto: nenhum número entra aqui sem estar em parametros.js com a origem.
import { P } from './parametros.js';

export const PASSO_MIN = 10;
const N = (24 * 60) / PASSO_MIN;
const mod24 = (h) => ((h % 24) + 24) % 24;

/** Curva esperada de cortisol para a hora do relógio biológico (0 a 24). */
export function cortisolBase(horaRelogio) {
  const c = P.cortisol;
  const h = mod24(horaRelogio);
  const tN = c.nadir.hora, tS = c.repousoFim.hora, tP = c.pico.hora, tD = c.repousoIni.hora;
  const x = h < tN ? h + 24 : h;                      // gira para começar no nadir
  if (x <= tP) {                                       // subida: cúbica monótona, sem degrau no mesor
    const d1 = (c.mesor.valor - c.nadir.valor) / (tS - tN), d2 = (c.pico.valor - c.mesor.valor) / (tP - tS);
    const m = (2 * d1 * d2) / (d1 + d2);
    const [x0, y0, m0, x1, y1, m1] = x <= tS ? [tN, c.nadir.valor, 0, tS, c.mesor.valor, m] : [tS, c.mesor.valor, m, tP, c.pico.valor, 0];
    const w = x1 - x0, u = (x - x0) / w;
    return (2 * u ** 3 - 3 * u ** 2 + 1) * y0 + (u ** 3 - 2 * u ** 2 + u) * w * m0 + (-2 * u ** 3 + 3 * u ** 2) * y1 + (u ** 3 - u ** 2) * w * m1;
  }
  if (x <= tD) {                                       // queda exponencial do pico até o mesor
    const k = c.formaQueda.valor, u = (x - tP) / (tD - tP);
    return c.mesor.valor + (c.pico.valor - c.mesor.valor) * (Math.exp(-k * u) - Math.exp(-k)) / (1 - Math.exp(-k));
  }
  return c.mesor.valor - (c.mesor.valor - c.nadir.valor) * Math.pow((x - tD) / (tN + 24 - tD), c.formaNoite.valor);
}

function interp(pontos, x, kx, ky) {
  if (x <= pontos[0][kx]) return pontos[0][ky];
  for (let i = 1; i < pontos.length; i++) {
    if (x <= pontos[i][kx]) {
      const a = pontos[i - 1], b = pontos[i];
      return a[ky] + ((b[ky] - a[ky]) * (x - a[kx])) / (b[kx] - a[kx]);
    }
  }
  return pontos[pontos.length - 1][ky];               // acima de 80%: sem dado lido, mantém
}

/** Fator do exercício sobre o cortisol ao fim da sessão (1 = sem efeito). */
export function fatorExercicio(vo2, duracaoMin) {
  const e = P.cortisol.exercicio;
  const f = interp(e.fatorPorIntensidade, vo2, 'vo2', 'fator');
  const d = Math.max(0, Math.min(1, (duracaoMin - e.duracaoMinimaMin.valor) / (e.duracaoPlenaMin.valor - e.duracaoMinimaMin.valor)));
  return 1 + (f - 1) * d;
}

const dentro = (h, ini, fim) => (ini <= fim ? h >= ini && h < fim : h >= ini || h < fim);
const durH = (ini, fim) => mod24(fim - ini) || 24;

/** Efeito do exercício sobre o cortisol, em µg/dL acima da curva, "min" minutos depois do início da sessão. */
export function efeitoExercicioCortisol(j, min, deslocamentoRelogioH = 0) {
  const e = P.cortisol.exercicio;
  const dur = durH(j.inicio, j.fim) * 60;
  const fator = fatorExercicio(j.vo2, dur);
  if (fator === 1 || min < 0) return 0;
  const alvo = cortisolBase(j.fim - deslocamentoRelogioH) * (fator - 1);
  const plato = e.platoPosMin.valor * Math.max(0, Math.min(1, (j.vo2 - 60) / 20));
  if (min <= dur) return alvo * Math.max(0, (min - e.duracaoMinimaMin.valor) / Math.max(1, dur - e.duracaoMinimaMin.valor));
  if (min <= dur + plato) return alvo;
  return alvo * Math.pow(0.5, (min - dur - plato) / e.meiaVidaVoltaMin.valor);
}

/** Subida da glicemia, em mg/dL acima da base, "min" minutos depois da refeição. */
export function efeitoRefeicaoGlicemia(m, min) {
  if (min <= 0) return 0;
  const g = P.glicemia, u = min / g.tempoPicoMin.valor;
  return g.subidaPor50g.valor * (m.carboG / 50) * u * Math.exp(1 - u);
}

/**
 * Simula um dia. A rotina é repetida no dia anterior para a pressão de sono
 * e os efeitos que atravessam a meia-noite começarem no lugar certo.
 *
 * rotina = {
 *   deslocamentoRelogioH: 0,            // 0 = relógio no horário habitual
 *   sono:      [{ inicio: 23, fim: 7 }],
 *   refeicoes: [{ hora: 7.5, carboG: 50 }],
 *   jornadas:  [{ tipo: 'exercicio', inicio: 18, fim: 18.5, vo2: 70 }, { tipo: 'trabalho', inicio: 8, fim: 17 }],
 *   alcoolGkg: 0,                       // noite ativa: dose antes de dormir
 * }
 */
export function simularDia(rotina) {
  const r = { deslocamentoRelogioH: 0, sono: [], refeicoes: [], jornadas: [], alcoolGkg: 0, ...rotina };
  const g = P.glicemia, s = P.pressaoSono;
  const dormindo = (h) => r.sono.some((b) => dentro(h, mod24(b.inicio), mod24(b.fim)));
  const exercicios = r.jornadas.filter((j) => j.tipo === 'exercicio');

  const efeitoEx = (j, min) => efeitoExercicioCortisol(j, min, r.deslocamentoRelogioH);
  const efeitoRefeicao = efeitoRefeicaoGlicemia;

  let S = 0.5;
  const pontos = [];
  for (let k = 0; k < 2 * N; k++) {                    // dia de aquecimento + dia de leitura
    const h = (k * PASSO_MIN) / 60;                     // 0 a 48
    const hDia = mod24(h);
    const dt = PASSO_MIN / 60;
    S = dormindo(hDia) ? S * Math.exp(-dt / s.tauQuedaH.valor) : 1 - (1 - S) * Math.exp(-dt / s.tauSubidaH.valor);
    if (k < N) continue;

    const base = cortisolBase(hDia - r.deslocamentoRelogioH);
    let cort = base;
    for (const j of exercicios) for (const d of [0, 24]) cort += efeitoEx(j, (h - 24 + d - j.inicio) * 60);
    let subida = 0;
    for (const m of r.refeicoes) for (const d of [0, 24]) subida += efeitoRefeicao(m, (h - 24 + d - m.hora) * 60);
    pontos.push({
      hora: hDia,
      dormindo: dormindo(hDia),
      cortisol: +cort.toFixed(2),
      cortisolBase: +base.toFixed(2),
      glicemia: +(g.base.valor + Math.min(subida, g.subidaMax.valor)).toFixed(1),
      pressaoSono: +S.toFixed(3),
    });
  }

  const horasSono = r.sono.reduce((t, b) => t + durH(b.inicio, b.fim), 0);
  const alertas = [];
  for (const b of r.sono) {
    const c = cortisolBase(b.inicio - r.deslocamentoRelogioH);
    if (c > P.cortisol.mesor.valor) alertas.push({ tipo: 'sono-na-fase-ativa', hora: mod24(b.inicio), cortisol: +c.toFixed(1), texto: 'O sono começa com o cortisol acima da média do dia: o relógio ainda está no horário antigo.' });
  }
  const a = P.alcool;
  const sonoQualidade = {
    horas: +horasSono.toFixed(2),
    remPerdidoMin: r.alcoolGkg >= a.doseMinimaGkg.valor ? +(a.remPerdidoMinPorGkg.valor * r.alcoolGkg).toFixed(1) : 0,
    atrasoRemMin:  r.alcoolGkg >= a.doseMinimaGkg.valor ? +(a.atrasoRemMinPorGkg.valor * r.alcoolGkg).toFixed(1) : 0,
  };
  if (sonoQualidade.remPerdidoMin > 0) alertas.push({ tipo: 'alcool-rem', texto: 'O álcool não tira horas de sono, tira sono REM.' });
  return { pontos, porHora: pontos.filter((p) => Number.isInteger(+p.hora.toFixed(6))), sonoQualidade, alertas };
}

/** Faixa de tolerância para o modo Prognóstico. */
export function faixaCortisol(valor) {
  const f = P.cortisol.faixaTolerancia;
  return [+(valor * f.abaixo).toFixed(2), +(valor * f.acima).toFixed(2)];
}
export function faixaGlicemia(valor) {
  const g = P.glicemia;
  const dp = valor - g.base.valor < 5 ? g.base.dp : g.subidaPor50g.dp;
  return [+(valor - dp).toFixed(1), +(valor + dp).toFixed(1)];
}
