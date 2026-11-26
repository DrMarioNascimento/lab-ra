// Balanço em L e mg de sódio. A transferência intestino → corpo conserva água e sódio.
export const PERFIL_HIDRICO = Object.freeze({
  massaKg: 70, aguaL: 42, extracelularL: 14, plasmaL: 3,
  osmolalidade: 285, sodioPlasmatico: 140,
});
export const PARAMETROS_HIDRICOS = Object.freeze({
  mgPorMmolSodio: 22.99, meiaVidaAbsorcaoMin: 20,
  perdasInsensiveisLHora: 0.025, urinaBasalLHora: 0.055, sodioUrinarioBasalMgHora: 80,
  sodioSuorMgL: 800,
});
const { mgPorMmolSodio, meiaVidaAbsorcaoMin, sodioSuorMgL } = PARAMETROS_HIDRICOS;
export const hidratar = (ref = PERFIL_HIDRICO) => ({ aguaL: ref.aguaL, sodioDeltaMg: 0, aguaDigestivaL: 0, sodioDigestivoMg: 0 });

export function compartimentos(estado, ref = PERFIL_HIDRICO) {
  const osmolesSodio = 2 * estado.sodioDeltaMg / mgPorMmolSodio;
  const osmolalidade = (ref.osmolalidade * ref.aguaL + osmolesSodio) / estado.aguaL;
  const extracelularL = (ref.osmolalidade * ref.extracelularL + osmolesSodio) / osmolalidade;
  const sodioMmol = ref.sodioPlasmatico * ref.extracelularL + estado.sodioDeltaMg / mgPorMmolSodio;
  return {
    osmolalidade, extracelularL, sodio: sodioMmol / extracelularL,
    plasmaL: ref.plasmaL + (extracelularL - ref.extracelularL) * ref.plasmaL / ref.extracelularL,
    variacaoAguaPct: (estado.aguaL - ref.aguaL) * 100 / ref.massaKg,
  };
}

export function perdaBasal() {
  const p = PARAMETROS_HIDRICOS;
  return { urinaLHora: p.urinaBasalLHora, sodioUrinaMgHora: p.sodioUrinarioBasalMgHora };
}

export function taxaSuor(temperatura, umidade, esforco) {
  // Superfície didática dentro de valores publicados em exercício. Umidade aqui é aproximação do estresse térmico.
  const calor = Math.max(0, temperatura - 22);
  return (esforco ? 0.15 + 0.55 * esforco : 0) + calor * (esforco ? 0.025 : 0.004) * (0.7 + 0.006 * umidade);
}

export function passoHidrico(estado, entrada, dtMin, excrecao = perdaBasal()) {
  const aguaDigestiva = estado.aguaDigestivaL + entrada.aguaMl / 1000;
  const sodioDigestivo = estado.sodioDigestivoMg + entrada.sodioMg;
  const fracao = 1 - 2 ** (-dtMin / meiaVidaAbsorcaoMin);
  const aguaAbsorvida = aguaDigestiva * fracao;
  const sodioAbsorvido = sodioDigestivo * fracao;
  const horas = dtMin / 60;
  const suorL = entrada.suorL ?? taxaSuor(entrada.temperatura, entrada.umidade, entrada.esforco) * horas;
  const urinaL = excrecao.urinaLHora * horas;
  const perdaInsensivelL = PARAMETROS_HIDRICOS.perdasInsensiveisLHora * horas;
  const sodioSuorMg = suorL * sodioSuorMgL;
  const sodioUrinaMg = excrecao.sodioUrinaMgHora * horas;
  return {
    estado: {
      aguaL: estado.aguaL + aguaAbsorvida - suorL - urinaL - perdaInsensivelL,
      sodioDeltaMg: estado.sodioDeltaMg + sodioAbsorvido - sodioSuorMg - sodioUrinaMg,
      aguaDigestivaL: aguaDigestiva - aguaAbsorvida,
      sodioDigestivoMg: sodioDigestivo - sodioAbsorvido,
    },
    fluxos: { aguaAbsorvida, sodioAbsorvido, suorL, urinaL, perdaInsensivelL, sodioSuorMg, sodioUrinaMg },
  };
}

export function acoplarCirculacao(basal, plasmaL, intensidade, angiotensinaII = 100, { plasmaReferenciaL = PERFIL_HIDRICO.plasmaL,
  vsReferencia = 72 + 60 * intensidade, cargaTermica = 0,
  deficitAguaPct = 0, ganhoDeficitAguaVS = 0, potenciaCompensacaoFC = 0.7 } = {}) {
  // Ganhos didáticos. A resposta usa o volume plasmático como aproximação do enchimento.
  const razaoPlasma = plasmaL / plasmaReferenciaL;
  // A carga térmica resume o efeito do calor sobre enchimento e frequência, com ganho didático.
  // No ensaio de ciclismo, perdas maiores de água reduzem adicionalmente o enchimento efetivo.
  const fatorAgua = Math.max(0.7, 1 - ganhoDeficitAguaVS * Math.max(0, deficitAguaPct - 1.6));
  const fatorVS = razaoPlasma ** 0.85 * Math.max(0.7, 1 - 0.065 * cargaTermica) * fatorAgua;
  const volumeSistolico = vsReferencia * fatorVS;
  const fc = basal.fc * fatorVS ** -potenciaCompensacaoFC + 1.5 * cargaTermica;
  const debito = fc * volumeSistolico / 1000;
  const debitoReferencia = basal.fc * vsReferencia / 1000;
  // O sinal do passo anterior altera o tônus no passo atual. Ganho limitado e didático.
  const ganhoAngII = 1 + Math.max(-0.04, Math.min(0.06, (angiotensinaII - 100) * 0.001));
  const resistencia = basal.pam / debitoReferencia * fatorVS ** -0.4 * ganhoAngII;
  const pam = debito * resistencia;
  const pulso = (basal.sis - basal.dia) * fatorVS;
  return { fc, volumeSistolico, debito, resistencia, pam, ganhoAngII, razaoPressao: pam / basal.pam, sis: pam + 2 * pulso / 3, dia: pam - pulso / 3 };
}
