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

export const FLUXO_HEPATICO = [
  { minuto: 0, taxa: 1.90, ep: 0.04 },
  { minuto: 10, taxa: 1.90 * (1 - 0.67), derivado: true },
  { minuto: 30, taxa: 0, aproximado: true },
  { minuto: 60, taxa: 0.31, ep: 0.32 },
  { minuto: 255, taxa: 0.49, ep: 0.18 },
  { minuto: 380, taxa: 1.90, retorno: true },
];

// Taylor et al. (1996), Figura 3 e resultados de produção hepática.
// O retorno médio ao basal ancora a interpolação no fim da janela.
export function fluxoHepaticoAposRefeicao(minuto) {
  if (!Number.isFinite(minuto) || minuto < 0 || minuto > FLUXO_HEPATICO.at(-1).minuto) {
    throw new RangeError('Escolha um minuto entre 0 e 380.');
  }
  if (minuto === 0) return FLUXO_HEPATICO[0].taxa;
  const direita = FLUXO_HEPATICO.findIndex((ponto) => ponto.minuto >= minuto);
  const a = FLUXO_HEPATICO[direita - 1], b = FLUXO_HEPATICO[direita];
  return a.taxa + (b.taxa - a.taxa) * (minuto - a.minuto) / (b.minuto - a.minuto);
}

export function simularFluxoHepatico() {
  let liberadoMgKg = 0;
  let taxaAnterior = FLUXO_HEPATICO[0].taxa;
  return Array.from({ length: REFEICAO_GLICOGENIO.fim + 1 }, (_, minuto) => {
    const taxa = fluxoHepaticoAposRefeicao(minuto);
    if (minuto) liberadoMgKg += (taxaAnterior + taxa) / 2;
    taxaAnterior = taxa;
    return { taxa, liberadoMgKg };
  });
}

export const CONFERENCIA_GLICOGENIO_120 = { minuto: 120, variacao: 42 };
