// Mosaico Alostase · frequência cardíaca no esforço (ficha 10). Só a parte com fonte lida.
// FCmáx de Tanaka 2001 (lido); %FC de reserva ≈ %VO2 de reserva (Swain, resumo); repouso de Speed 2023.
import { P } from './parametros.js';

/** FCmáx esperada por idade e hábito ('geral' | 'sedentario' | 'ativo' | 'treinado'). */
export function fcMax(idade, grupo = 'geral') {
  const e = P.treino.fcMax[grupo];
  if (!e || e.a === undefined) throw new Error(`grupo desconhecido: ${grupo}`);
  return e.a - e.b * idade;
}

/** Fração da reserva de VO2 a partir da fração do VO2máx (0 a 1), dado o VO2máx em ml/kg/min. */
export function fracaoReservaVO2(fracVO2max, vo2max, vo2repouso = P.treino.vo2Repouso.valor) {
  return Math.max(0, Math.min(1, (fracVO2max * vo2max - vo2repouso) / (vo2max - vo2repouso)));
}

/**
 * Frequência cardíaca no esforço estável, pela reserva: FCrep + fração × (FCmáx − FCrep).
 * Devolve o valor esperado e a faixa de um desvio-padrão da FCmáx individual (10 bpm), que se
 * propaga na fração da reserva. Vale para adultos saudáveis não fumantes (limite de Tanaka).
 * @param {{idade:number, grupo?:string, fcRepouso?:number, fracReserva:number}} o
 */
export function frequenciaNoEsforco({ idade, grupo = 'geral', fcRepouso = P.treino.repousoDiurno.valor, fracReserva }) {
  const max = fcMax(idade, grupo), dp = P.treino.fcMax.dpIndividual.valor;
  const f = Math.max(0, Math.min(1, fracReserva));
  const valor = fcRepouso + f * (max - fcRepouso);
  return { fcMax: +max.toFixed(1), valor: +valor.toFixed(1), faixa: [+(valor - f * dp).toFixed(1), +(valor + f * dp).toFixed(1)] };
}
