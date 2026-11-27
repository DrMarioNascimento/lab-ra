// Taylor et al. (1996), https://doi.org/10.1172/JCI118379
export const REFEICAO_GLICOGENIO = {
  inicial: 207, epInicial: 22, pico: 316, epPico: 19, minutoPico: 318,
  epMinutoPico: 31, quedaPorMinuto: 0.26, fim: 360,
};

// Iwayama et al. (2020), https://doi.org/10.1002/nbm.4289
export const JEJUM_GLICOGENIO = { inicioHora: 20, fim: 11 * 60, perda: 80.6, dispersao: 40.4 };

export function glicogenioAposRefeicao(minuto) {
  const { inicial, pico, minutoPico, quedaPorMinuto, fim } = REFEICAO_GLICOGENIO;
  if (!Number.isFinite(minuto) || minuto < 0 || minuto > fim) throw new RangeError('Escolha um minuto entre 0 e 360.');
  if (minuto <= minutoPico) return inicial + (pico - inicial) * minuto / minutoPico;
  return pico - (minuto - minutoPico) * quedaPorMinuto;
}

export function variacaoGlicogenioEmJejum(minuto) {
  const { fim, perda } = JEJUM_GLICOGENIO;
  if (!Number.isFinite(minuto) || minuto < 0 || minuto > fim) throw new RangeError('Escolha um minuto entre 0 e 660.');
  return -(perda * minuto / fim) || 0;
}
