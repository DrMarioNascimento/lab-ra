// Balanço de calor em dois compartimentos. Coeficientes de troca e de sudorese são didáticos.
const P = Object.freeze({
  massaKg: 70, calorEspecifico: 3470, fracaoCentral: 0.85, areaM2: 1.8,
  equivalenteO2: 20200, vo2Repouso: 3.5, vo2Max: 45, calorLatente: 2426000,
});
export const INICIAL_TERMICO = Object.freeze({ centralC: 37, peleC: 33 });
export const AREA_TERMICA_M2 = P.areaM2;
const capacidadeCentral = P.massaKg * P.calorEspecifico * P.fracaoCentral;
const capacidadePele = P.massaKg * P.calorEspecifico * (1 - P.fracaoCentral);
const psat = (c) => 0.61078 * Math.exp(17.27 * c / (c + 237.3));

function fluxoTermico(estado, { temperatura, umidade, esforco }) {
  const { centralC, peleC } = estado;
  const vo2 = Math.max(P.vo2Repouso, P.vo2Max * esforco);
  // Caminhada nivelada. O cenário considera trabalho mecânico externo líquido igual a zero.
  const calorMetabolicoW = vo2 * P.massaKg * P.equivalenteO2 / 60000;
  const perdaRespiratoriaW = calorMetabolicoW * (0.073 - 0.00035 * (temperatura - 22) - 0.00008 * (umidade - 45));
  const perdaSecaW = (6.95 + 4 * esforco) * (peleC - temperatura);
  const transportePeleW = (19 + (16 + 30 * esforco) * Math.max(0, centralC - 37) + 85 * esforco) * (centralC - peleC);
  const suorProduzidoLHora = Math.min(1.5, 0.65 * esforco
    + (esforco ? 0.60 : 0.38) * Math.max(0, centralC - 37.10) + 0.10 * Math.max(0, peleC - 33.5));
  const gradienteVaporKPa = Math.max(0, psat(peleC) - umidade / 100 * psat(temperatura));
  const capacidadeEvaporativaW = (87 + esforco * 105) * gradienteVaporKPa;
  const evaporacaoW = Math.min(suorProduzidoLHora * P.calorLatente / 3600, capacidadeEvaporativaW);
  const armazenamentoW = calorMetabolicoW - perdaRespiratoriaW - perdaSecaW - evaporacaoW;
  return { calorMetabolicoW, perdaRespiratoriaW, perdaSecaW, transportePeleW, suorProduzidoLHora,
    gradienteVaporKPa, capacidadeEvaporativaW, evaporacaoW, armazenamentoW };
}

// Subpassos de um minuto. Fluxos devolvidos como médias do intervalo exibido.
export function passoTermico(inicial, ambiente, minutos) {
  const media = {};
  let estado = inicial;
  for (let min = 0; min < minutos; min++) {
    const f = fluxoTermico(estado, ambiente);
    for (const [chave, valor] of Object.entries(f)) media[chave] = (media[chave] ?? 0) + valor / minutos;
    estado = {
      centralC: estado.centralC + (f.calorMetabolicoW - f.perdaRespiratoriaW - f.transportePeleW) * 60 / capacidadeCentral,
      peleC: estado.peleC + (f.transportePeleW - f.perdaSecaW - f.evaporacaoW) * 60 / capacidadePele,
    };
  }
  const suorL = media.suorProduzidoLHora * minutos / 60;
  const suorEvaporadoL = media.evaporacaoW * minutos * 60 / P.calorLatente;
  return {
    estado, suorL, suorEvaporadoL,
    detalhe: { ...inicial, ...ambiente, ...media, calorRetidoKJ: calorEntreEstados(inicial, estado),
      suorProduzidoMl: suorL * 1000, suorEvaporadoMl: suorEvaporadoL * 1000,
      suorEscorridoMl: Math.max(0, (suorL - suorEvaporadoL) * 1000) },
  };
}

export function calorEntreEstados(inicial, final) {
  return (capacidadeCentral * (final.centralC - inicial.centralC) + capacidadePele * (final.peleC - inicial.peleC)) / 1000;
}
