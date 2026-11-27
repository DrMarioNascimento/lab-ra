// Meek et al. (2021), Tabela Suplementar 2, refeição líquida padronizada.
export const TEMPOS_REFEICAO = [0, 15, 30, 45, 60, 90, 120, 150, 180, 210, 240];
export const MEDIDAS_ENERGIA = {
  glicose: {
    nome: 'Glicose plasmática', unidade: 'mmol/L',
    inferior: [4.5, 5, 4.6, 3.7, 2.8, 2.8, 3.4, 3.7, 4.2, 4.2, 4.3],
    mediana: [5.3, 6.2, 6.3, 6.2, 5, 5, 5.1, 5, 5, 5, 5.1],
    superior: [6.3, 7.4, 9.2, 8.6, 7.9, 7.9, 6.4, 6.1, 6, 5.6, 5.6],
  },
  insulina: {
    nome: 'Insulina', unidade: 'pmol/L',
    inferior: [7.2, 66.1, 99.9, 143.7, 121.5, 32, 11, 7.8, 4.1, 3.8, 4.8],
    mediana: [46.5, 163, 371, 363, 250, 143, 104, 43.7, 35.8, 25.5, 24],
    superior: [174, 749, 1518, 1331, 1089, 1030, 647, 297, 122, 106, 86.4],
  },
  glucagon: {
    nome: 'Glucagon', unidade: 'pmol/L',
    inferior: [6.7, 5, 6.9, 10.3, 9.8, 7.1, 8.8, 6, 7.8, 6, 10.4],
    mediana: [22.5, 35.7, 28.4, 27.8, 28.3, 22.8, 27.7, 29.8, 27.2, 23, 27.2],
    superior: [48.6, 61.8, 77.2, 69.2, 67.8, 79, 99.8, 54.2, 59.8, 65.3, 80.6],
  },
};
export const ROTINAS_ENERGIA = {
  uma: [480],
  duas: [480, 840],
  tres: [480, 780, 1140],
};
export const PASSO_ENERGIA = 5;
export const FIM_DIA_ENERGIA = 1440;
const FIM_REFEICAO = TEMPOS_REFEICAO.at(-1);
const MEIA_VIDA_RESIDUO_MIN = 60;

function variacaoRefeicao(medianas, tempo) {
  if (tempo < 0) return 0;
  const basal = medianas[0];
  if (tempo > FIM_REFEICAO) return (medianas.at(-1) - basal) * 2 ** (-(tempo - FIM_REFEICAO) / MEIA_VIDA_RESIDUO_MIN);
  const i = TEMPOS_REFEICAO.findIndex((min) => min >= tempo);
  if (TEMPOS_REFEICAO[i] === tempo) return medianas[i] - basal;
  const fracao = (tempo - TEMPOS_REFEICAO[i - 1]) / (TEMPOS_REFEICAO[i] - TEMPOS_REFEICAO[i - 1]);
  return medianas[i - 1] + (medianas[i] - medianas[i - 1]) * fracao - basal;
}

export function simularDiaEnergia(rotina, medida) {
  if (!Object.hasOwn(ROTINAS_ENERGIA, rotina) || !Object.hasOwn(MEDIDAS_ENERGIA, medida)) {
    throw new RangeError('Escolha uma rotina e uma medida disponíveis.');
  }
  const refeicoes = ROTINAS_ENERGIA[rotina];
  const { mediana } = MEDIDAS_ENERGIA[medida];
  return Array.from({ length: FIM_DIA_ENERGIA / PASSO_ENERGIA + 1 }, (_, i) => {
    const min = i * PASSO_ENERGIA;
    return refeicoes.reduce((valor, hora) => valor + variacaoRefeicao(mediana, min - hora), mediana[0]);
  });
}
