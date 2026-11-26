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

// Curva pedagógica inspirada no sinal da PRC de Khalsa e na saturação de Zeitzer.
// Lux fotópicos são usados como aproximação; ganhos e limites pertencem ao modelo.
const LUZ = Object.freeze({ meiaRespostaLux: 120, ganhoHoraPorHora: 0.6, nadirReferenciaH: 5, limiteH: 8 });

export function respostaLuz(lux, minuto, faseH) {
  const distancia = ((minuto / 60 - faseH - LUZ.nadirReferenciaH + 12) % 24 + 24) % 24 - 12;
  // Aproximação local em torno do nadir. Antes, atraso (+); depois, avanço (−).
  if (distancia === 0 || Math.abs(distancia) >= 8 || lux <= 0) return 0;
  return -LUZ.ganhoHoraPorHora * Math.sin(Math.PI * distancia / 8) * lux / (lux + LUZ.meiaRespostaLux);
}

export function perfilDeFaseComLuz(faseInicialH, luxEm, passoMin) {
  const pontos = [faseInicialH];
  for (let min = 0; min < DIA_MIN; min += passoMin) {
    const fase = pontos.at(-1);
    const efeito = respostaLuz(luxEm(min), min + passoMin / 2, fase) * passoMin / 60;
    pontos.push(Math.max(-LUZ.limiteH, Math.min(LUZ.limiteH, fase + efeito)));
  }
  return { pontos, passoMin };
}

export function faseEmPerfil(perfil, minuto) {
  const indice = minuto / perfil.passoMin;
  const baixo = Math.floor(indice);
  return perfil.pontos[baixo] + ((perfil.pontos[baixo + 1] ?? perfil.pontos[baixo]) - perfil.pontos[baixo]) * (indice - baixo);
}
