import { simularCardiovascular } from './cardiovascular.js';
import { emNoiteBiologica } from './fase-circadiana.js';

// Em Morris: PAS/PAD de 24 h e PAS em vigília/PAD no sono.
// Com 16 h de vigília e 8 h de sono, os dois outros alvos são valores derivados.
export const ALVOS_MORRIS = Object.freeze({
  pas24h: 1.4, pad24h: 0.8, pasVigilia: 1.7, padSono: 1.8,
  pasSono: (24 * 1.4 - 16 * 1.7) / 8,
  padVigilia: (24 * 0.8 - 8 * 1.8) / 16,
});
const MEIA_VIDA_CARGA_DIAS = 14;
// Amplitude ilustrativa para o componente persistente, sem ajuste com Shafer.
const GANHO_SISTOLICO_SONO_MMHG = 6;
const referenciaAlinhada = mediasPressao(simularCardiovascular({ sono: [1380, 420] }));

export function fracaoSonoForaDaFase(inicioMin, duracaoMin, faseEm) {
  let fora = 0;
  for (let min = 0; min < duracaoMin; min++) {
    const horario = inicioMin + min;
    if (!emNoiteBiologica(horario, faseEm(horario))) fora++;
  }
  return fora / duracaoMin;
}

export function variabilidadeInicioSono(iniciosH) {
  const radPorHora = 2 * Math.PI / 24;
  let x = 0, y = 0;
  for (const hora of iniciosH) {
    x += Math.cos(hora * radPorHora);
    y += Math.sin(hora * radPorHora);
  }
  const resultante = Math.min(1, Math.hypot(x, y) / iniciosH.length);
  // Horários próximos separados pela meia-noite continuam próximos nesta medida circular.
  return Math.sqrt(-2 * Math.log(Math.max(1e-9, resultante))) / radPorHora;
}

export function desafioSonoPersistente(fracaoForaDaFase, variabilidadeHoras) {
  const irregularidade = Math.max(0, (variabilidadeHoras - 1) / 3);
  return Math.min(1, Math.max(fracaoForaDaFase, irregularidade));
}

export function atualizarCargaSono(carga, desafio) {
  return desafio + (carga - desafio) * 2 ** (-1 / MEIA_VIDA_CARGA_DIAS);
}

export function ajustarPressaoDaRotina(pontos, desalinhamento, cargaSono = 0) {
  const media = mediasPressao(pontos);
  // Corrige o efeito líquido da inversão, pois a curva original já contém um componente circadiano.
  // A fração do sono fora da fase interpola entre a curva original e o contraste agudo de Morris.
  const correcao = (chave) => desalinhamento * (ALVOS_MORRIS[chave] - (media[chave] - referenciaAlinhada[chave]));
  const vigilia = { sis: correcao('pasVigilia'), dia: correcao('padVigilia') };
  const sono = { sis: correcao('pasSono'), dia: correcao('padSono') };
  return pontos.map((basal) => {
    const c = basal.dormindo ? sono : vigilia;
    const pesoSono = basal.calculo?.peso ?? Number(basal.dormindo);
    return { ...basal, sis: basal.sis + c.sis + GANHO_SISTOLICO_SONO_MMHG * cargaSono * pesoSono, dia: basal.dia + c.dia };
  });
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
