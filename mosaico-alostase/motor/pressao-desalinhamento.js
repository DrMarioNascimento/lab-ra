import { emNoiteBiologica } from './fase-circadiana.js';

// Âncoras de Morris et al. (2017). A interpolação pela fração do sono fora da
// noite biológica é hipótese didática restrita ao intervalo de 0 a 1.
const MORRIS_VIGILIA_PAS = 1.7;
const MORRIS_SONO_PAD = 1.8;

export function fracaoSonoForaDaFase(inicioMin, duracaoMin, faseEm) {
  let fora = 0;
  for (let min = 0; min < duracaoMin; min++) {
    const horario = inicioMin + min;
    if (!emNoiteBiologica(horario, faseEm(horario))) fora++;
  }
  return fora / duracaoMin;
}

export function pressaoComDesalinhamento(basal, desalinhamento) {
  return {
    ...basal,
    sis: basal.sis + (basal.dormindo ? 0 : MORRIS_VIGILIA_PAS * desalinhamento),
    dia: basal.dia + (basal.dormindo ? MORRIS_SONO_PAD * desalinhamento : 0),
  };
}

export function mediasPressao(pontos) {
  let vigilia = 0, sono = 0;
  let pasVigilia = 0, padVigilia = 0, pasSono = 0, padSono = 0;
  for (const { sis, dia, dormindo } of pontos) {
    if (dormindo) {
      sono++;
      pasSono += sis;
      padSono += dia;
    } else {
      vigilia++;
      pasVigilia += sis;
      padVigilia += dia;
    }
  }
  const queda = (v, s) => 100 * (1 - (s / sono) / (v / vigilia));
  return { pas24h: (pasVigilia + pasSono) / pontos.length, pad24h: (padVigilia + padSono) / pontos.length,
    pasVigilia: pasVigilia / vigilia, padVigilia: padVigilia / vigilia,
    pasSono: pasSono / sono, padSono: padSono / sono,
    quedaPasPct: queda(pasVigilia, pasSono), quedaPadPct: queda(padVigilia, padSono) };
}
