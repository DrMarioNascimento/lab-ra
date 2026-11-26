import { INICIAL_TERMICO, passoTermico } from './termorregulacao.js?v=2';

// Che Muhamed et al., 2016, tabela 1; temperatura retal também no texto de resultados.
export const REFERENCIAS_CORRIDA = Object.freeze([
  { umidade: 23, calor: [66.3, 15.7], suor: [20.8, 28.3], deltaRetalC: 1.9 },
  { umidade: 43, calor: [73.5, 24.1], suor: [21.5, 26.5] },
  { umidade: 52, calor: [84.9, 36.9], suor: [20.4, 27.6], deltaRetalC: 2.4 },
  { umidade: 61, calor: [90.9, 37.6], suor: [19.8, 26.9], deltaRetalC: 2.4 },
  { umidade: 71, calor: [100.2, 41.6], suor: [19.4, 27.6], deltaRetalC: 2.5 },
]);
const massaKg = 72, alturaCm = 180;
export const PROTOCOLO_CORRIDA = Object.freeze({
  temperatura: 31, esforco: 0.70, duracaoMin: 60, massaKg, vo2Max: 61,
  areaM2: 0.007184 * massaKg ** 0.425 * alturaCm ** 0.725,
  // Ventilação igual à velocidade de corrida individual. O perfil médio estima essa velocidade.
  ventoMps: 3.3, ventoReferenciaMps: 1.5,
  // Ajuste com os extremos de umidade a 30 min. O minuto 60 e as umidades intermediárias ficam para conferência.
  partidaSuor: 1.13, sensibilidadeSuor: 0.45, ganhoSeco: 1.95, ganhoEvap: 2, supressaoSuor: 0.30, maxSuor: 2.5,
});

export function simularProtocoloCorrida(umidade, protocolo = PROTOCOLO_CORRIDA) {
  if (!REFERENCIAS_CORRIDA.some((r) => r.umidade === umidade)) throw new RangeError('Umidade fora do protocolo.');
  const { temperatura, esforco, duracaoMin, areaM2 } = protocolo;
  const ambiente = { temperatura, esforco, umidade, protocolo };
  let estado = INICIAL_TERMICO;
  let calorKJ = 0, suorG = 0;
  const pontos = [{ min: 0, ...estado }];
  const intervalos = [];
  for (let min = 0; min < duracaoMin; min += 5) {
    const passo = passoTermico(estado, ambiente, 5);
    estado = passo.estado;
    pontos.push({ min: min + 5, ...estado });
    calorKJ += passo.detalhe.calorRetidoKJ;
    suorG += passo.suorL * 1000;
    if ((min + 5) % 30 === 0) {
      intervalos.push({ calor: calorKJ * 1000 / (30 * 60 * areaM2), suor: suorG / 30 });
      calorKJ = 0;
      suorG = 0;
    }
  }
  return { pontos, intervalos, deltaCentralC: estado.centralC - INICIAL_TERMICO.centralC };
}
