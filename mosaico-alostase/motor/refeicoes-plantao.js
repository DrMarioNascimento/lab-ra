import { efeitoRefeicaoGlicemia } from './motor.js';
import { P } from './parametros.js';

export const NOITES_PROTOCOLO = 4;
export const CONDICOES_REFEICAO = Object.freeze({
  semRefeicao: { nome: 'Sem refeição na madrugada', porcoes: [[1020, 20], [1140, 40], [30, 0], [390, 30], [570, 10]],
    observado: 0.89, ic: [-0.02, 1.80] },
  lanche: { nome: 'Lanche às 00:30', porcoes: [[1020, 20], [1140, 40], [30, 10], [390, 30]],
    observado: 1.77, ic: [0.76, 2.76] },
  refeicao: { nome: 'Refeição às 00:30', porcoes: [[1140, 40], [30, 30], [390, 30]],
    observado: 3.87, ic: [2.93, 4.80] },
});
const FATOR_MG_DL_POR_MMOL_L = 18.0156;
const HR_INICIO = 17 * 60;
const CARBOIDRATO_DIA_G = 200;
const MIN_DIA = 1440;
const relogio = (min) => (min + MIN_DIA) % MIN_DIA;

export function simularRefeicoesPlantao(id, noites = NOITES_PROTOCOLO) {
  if (!Object.hasOwn(CONDICOES_REFEICAO, id) || !Number.isInteger(noites) || noites < 0 || noites > NOITES_PROTOCOLO) {
    throw new RangeError('Escolha uma condição e até quatro plantões.');
  }
  const condicao = CONDICOES_REFEICAO[id];
  const refeicoes = condicao.porcoes.filter(([, energiaPct]) => energiaPct > 0)
    .map(([min, energiaPct]) => ({ min, energiaPct, carboG: CARBOIDRATO_DIA_G * energiaPct / 100 }));
  const energiaMadrugadaPct = condicao.porcoes.find(([min]) => min === 30)[1];
  const cargaRelativa = energiaMadrugadaPct * noites / (30 * NOITES_PROTOCOLO);
  // Âncora única: diferença aos 120 min após quatro plantões com 30% da energia às 00:30.
  const delta120 = CONDICOES_REFEICAO.refeicao.observado * cargaRelativa;
  const teste = Array.from({ length: 151 }, (_, min) => {
    const u = min / 120;
    const delta = delta120 * u * Math.exp(1 - u);
    return { min, delta, deltaMgDl: delta * FATOR_MG_DL_POR_MMOL_L };
  });
  // Curvas didáticas do dia usam os pulsos já disponíveis no motor e repetição diária.
  const glicemia = P.glicemia;
  const plantao = Array.from({ length: MIN_DIA + 1 }, (_, i) => {
    const min = relogio(HR_INICIO + i);
    const subida = refeicoes.reduce((total, refeicao) =>
      total + efeitoRefeicaoGlicemia(refeicao, relogio(min - refeicao.min)), 0);
    return { min, glicemia: glicemia.base.valor + Math.min(subida, glicemia.subidaMax.valor) };
  });
  return { condicao, refeicoes, energiaMadrugadaPct, teste, plantao, delta120 };
}
