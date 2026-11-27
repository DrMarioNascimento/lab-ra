export const PROTOCOLOS_RESPOSTA = {
  treino: {
    // Tabela 2, mulheres saudáveis de 20 a 30 anos (n = 24).
    titulo: 'Recuperação cardíaca após exercício',
    unidade: 'bpm',
    pontos: [[0, 0], [1, 44, 15], [2, 58, 9], [3, 66, 7]],
  },
  estresse: {
    // Médias aproximadas, lidas na Figura 2 de Liu et al. (2021).
    titulo: 'Cortisol salivar após estresse social',
    unidade: 'nmol/L',
    pontos: [[-15, 4.1], [0, 5], [20, 6.9], [45, 5.7], [60, 4.5]],
  },
};

export function curvaResposta(id) {
  if (!Object.hasOwn(PROTOCOLOS_RESPOSTA, id)) throw new RangeError('Escolha um protocolo disponível.');
  const { pontos } = PROTOCOLOS_RESPOSTA[id];
  const inicio = pontos[0][0], fim = pontos.at(-1)[0];
  const passo = id === 'treino' ? 0.25 : 1;
  return Array.from({ length: (fim - inicio) / passo + 1 }, (_, i) => {
    const min = inicio + i * passo;
    if (i === 0) return { min, valor: pontos[0][1] };
    const j = pontos.findIndex(([tempo]) => tempo >= min);
    const [a, valorA] = pontos[j - 1], [b, valorB] = pontos[j];
    return { min, valor: valorA + (valorB - valorA) * (min - a) / (b - a) };
  });
}
