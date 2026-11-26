// Cenário exploratório de adaptação parcial. Sono programado é um proxy;
// a luz individual, cronotipo e exposição em cada fase não são inferidos.
export const AJUSTE_CIRCADIANO = Object.freeze({ atrasoAlvoMaxH: 6, meiaVidaAtrasoDias: 3, meiaVidaRetornoDias: 2 });
const DIA_MIN = 1440;
const sobreposicao = ([a, b], x, y) => Math.max(0, Math.min(b, y) - Math.max(a, x));

export function passoFaseCircadiana(faseH, sono, ativo) {
  if (!ativo) return faseH;
  const total = sono.reduce((soma, janela) => soma + sobreposicao(janela, 0, DIA_MIN), 0);
  const diurno = sono.reduce((soma, janela) => soma + sobreposicao(janela, 420, 1320), 0);
  const { atrasoAlvoMaxH, meiaVidaAtrasoDias, meiaVidaRetornoDias } = AJUSTE_CIRCADIANO;
  const alvo = total ? atrasoAlvoMaxH * diurno / total : faseH;
  const meiaVida = alvo >= faseH ? meiaVidaAtrasoDias : meiaVidaRetornoDias;
  return alvo + (faseH - alvo) * 2 ** (-1 / meiaVida);
}

export const faseNoMinuto = (inicio, fim, min) => inicio + (fim - inicio) * min / DIA_MIN;

// Janela biológica de referência 23h–07h, deslocada pela fase do modelo.
export const emNoiteBiologica = (min, faseH) => ((min - faseH * 60 - 1380) % DIA_MIN + DIA_MIN) % DIA_MIN < 480;
