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

// Leituras aproximadas do painel inferior da Figura 3 (Taylor et al.).
// São coordenadas arredondadas da figura, não concentrações de cada hormônio.
export const RAZAO_HORMONAL_TAYLOR = [
  [0, 26], [10, 14], [30, 7], [60, 4], [120, 5], [180, 5],
  [240, 6], [255, 8], [270, 11], [300, 25], [330, 27], [360, 36],
];
const FLUXO_BASAL = FLUXO_HEPATICO[0].taxa;
const RAZAO_BASAL = RAZAO_HORMONAL_TAYLOR[0][1];
// O basal e os 60 min fixam o ganho do modelo. Os demais valores de fluxo ficam para conferência.
const EXPOENTE_HORMONAL = Math.log(0.31 / FLUXO_BASAL) / Math.log(4 / RAZAO_BASAL);

function razaoDoProtocolo(minuto) {
  if (minuto === 0) return RAZAO_BASAL;
  const i = RAZAO_HORMONAL_TAYLOR.findIndex(([tempo]) => tempo >= minuto);
  const [esquerda, r0] = RAZAO_HORMONAL_TAYLOR[i - 1], [direita, r1] = RAZAO_HORMONAL_TAYLOR[i];
  return r0 + (r1 - r0) * (minuto - esquerda) / (direita - esquerda);
}

export function simularRegulacaoHepatica(insulina = 1, glucagon = 1) {
  if (![0.8, 1, 1.2].includes(insulina) || ![0.8, 1, 1.2].includes(glucagon)) {
    throw new RangeError('Escolha 80%, 100% ou 120% para cada sinal.');
  }
  return Array.from({ length: REFEICAO_GLICOGENIO.fim + 1 }, (_, minuto) => {
    const razaoRelativa = razaoDoProtocolo(minuto) / RAZAO_BASAL * glucagon / insulina;
    const taxa = FLUXO_BASAL * Math.min(1, razaoRelativa ** EXPOENTE_HORMONAL);
    return { razaoRelativa, taxa };
  });
}

// Compartimento aparente de glicose, como na parametrização de Schiavon et al. (2013).
const VOLUME_EFETIVO_DL_KG = 0.200 * 0.65 * 10;
// Hipótese didática de remoção do desvio em relação ao cenário de referência.
const CONSTANTE_REMOCAO_MIN = Math.log(2) / 30;
const FRACAO_RETIDA = Math.exp(-CONSTANTE_REMOCAO_MIN);
const GANHO_ENTRADA = (1 - FRACAO_RETIDA) / CONSTANTE_REMOCAO_MIN;

/** Balanço da perturbação hepática em passos de um minuto no mesmo protocolo. */
export function efeitoHepaticoNaGlicemia(regulacao, referencia) {
  let noCompartimento = 0, liberacaoAcumulada = 0, taxaAnterior = 0;
  return regulacao.map(({ taxa }, minuto) => {
    const deltaFluxo = taxa - referencia[minuto].taxa;
    if (minuto > 0) {
      const entradaNoIntervalo = (taxaAnterior + deltaFluxo) / 2;
      liberacaoAcumulada += entradaNoIntervalo;
      noCompartimento = FRACAO_RETIDA * noCompartimento + GANHO_ENTRADA * entradaNoIntervalo;
    }
    taxaAnterior = deltaFluxo;
    return {
      deltaFluxo,
      deltaGlicemiaMgDl: noCompartimento / VOLUME_EFETIVO_DL_KG,
      liberacaoAcumuladaMgKg: liberacaoAcumulada,
      saldoMgKg: noCompartimento,
      remocaoAcumuladaMgKg: liberacaoAcumulada - noCompartimento,
    };
  });
}
