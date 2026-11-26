import { simularCalorIntegrado } from './calor-integrado.js';

// Perda de massa da publicação original. FC e VS aos 110 min e temperatura retal aos 120 min
// são leituras aproximadas da figura 1-5 de Funnell (2020).
export const REFERENCIAS_CICLISMO = Object.freeze([
  { nome: 'Sem reposição', reposicaoPct: 0, ml: 0, perdaMassaPct: 4.2, fc: 167, volumeSistolico: 102, debito: 16.9, centralC: 39.1 },
  { nome: 'Pequena', reposicaoPct: 20, ml: 600, perdaMassaPct: 3.4, fc: 164, volumeSistolico: 107, debito: 17.7, centralC: 38.9 },
  { nome: 'Moderada', reposicaoPct: 48, ml: 1400, perdaMassaPct: 2.3, fc: 157, volumeSistolico: 115, debito: 17.9, centralC: 38.6 },
  { nome: 'Maior', reposicaoPct: 81, ml: 2400, perdaMassaPct: 1.1, fc: 153, volumeSistolico: 123, debito: 18.8, centralC: 38.4 },
]);

const MASSA = 71.9;
const ambiente = Object.freeze({
  temperatura: 33, umidade: 50, esforco: 0.65,
  protocolo: { massaKg: MASSA, vo2Max: 4720 / MASSA, ventoMps: 2.5, ventoReferenciaMps: 1.5,
    // Extremos de reposição aos 120 min orientam os ganhos térmicos pela massa e temperatura retal.
    fracaoTrabalhoExterno: 0.23, partidaSuor: 1.42, sensibilidadeSuor: 0.63, ganhoEvap: 1.788,
    ganhoSeco: 1.312, ganhoDeficitCutaneo: 3.993, ganhoOsmSudorese: 0.041, maxSuor: 2.3 },
});
const basal = Object.freeze({ fc: 135, sis: 168, dia: 76, pam: (168 + 2 * 76) / 3, vsReferencia: 139 });

export function simularProtocoloCalorHidrico(reposicaoPct) {
  const ref = REFERENCIAS_CICLISMO.find((r) => r.reposicaoPct === reposicaoPct);
  if (!ref) throw new RangeError('Reposição fora do protocolo.');
  // Fracionamento uniforme modelado, com início após 15 minutos.
  const bebidas = Array.from({ length: 7 }, (_, i) => [(i + 1) * 15, ref.ml / 7]);
  const pontos = simularCalorIntegrado({ duracaoMin: 120, ambienteNoMinuto: () => ambiente,
    basalNoMinuto: () => basal, bebidas, massaKg: MASSA, inicialTermico: { centralC: 37.15, peleC: 33.5 } });
  return { pontos, perdaMassaPct: pontos[120].perdaMassaPct, centralC: pontos[120].centralC,
    fc: pontos[110].fc, volumeSistolico: pontos[110].volumeSistolico, debito: pontos[110].debito };
}
