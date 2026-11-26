// Balanço de calor em dois compartimentos. Coeficientes de troca e de sudorese são didáticos.
const P = Object.freeze({
  massaKg: 70, calorEspecifico: 3470, fracaoCentral: 0.85, areaM2: 1.8,
  equivalenteO2: 20200, vo2Repouso: 3.5, vo2Max: 45, calorLatente: 2426000,
});
export const INICIAL_TERMICO = Object.freeze({ centralC: 37, peleC: 33 });
export const AREA_TERMICA_M2 = P.areaM2;
function capacidades(massaKg) {
  const total = massaKg * P.calorEspecifico;
  return [total * P.fracaoCentral, total * (1 - P.fracaoCentral)];
}
const psat = (c) => 0.61078 * Math.exp(17.27 * c / (c + 237.3));

function fluxoTermico(estado, { temperatura, umidade, esforco, protocolo, aclimatacao }) {
  const { centralC, peleC } = estado;
  const vo2 = Math.max(P.vo2Repouso, (protocolo?.vo2Max ?? P.vo2Max) * esforco);
  // Caminhada nivelada. O cenário considera trabalho mecânico externo líquido igual a zero.
  const calorMetabolicoW = vo2 * (protocolo?.massaKg ?? P.massaKg) * P.equivalenteO2 / 60000;
  const perdaRespiratoriaW = calorMetabolicoW * (0.073 - 0.00035 * (temperatura - 22) - 0.00008 * (umidade - 45));
  // No estudo de corrida a velocidade do ar acompanha a esteira.
  const fatorAr = protocolo ? (protocolo.ventoMps / protocolo.ventoReferenciaMps) ** 0.6 : 1;
  const partidaSuor = protocolo?.partidaSuor ?? 0.65;
  const sensibilidadeSuor = protocolo?.sensibilidadeSuor ?? 0.60;
  const ganhoSeco = protocolo?.ganhoSeco ?? 1;
  const ganhoEvap = protocolo?.ganhoEvap ?? 1;
  const perdaSecaW = (6.95 + 4 * esforco) * fatorAr * ganhoSeco * (peleC - temperatura);
  const transportePeleW = (19 + (16 + 30 * esforco) * Math.max(0, centralC - 37) + 85 * esforco) * (centralC - peleC);
  const limiar = 37.10 - (aclimatacao?.suor ?? 0) * 0.25;
  const ganhoSuor = 1 + 0.35 * (aclimatacao?.suor ?? 0);
  const ativacao = aclimatacao ? Math.min(1, Math.max(0, (centralC - limiar) / 0.18)) : 1;
  const suorPotencialLHora = Math.min(protocolo?.maxSuor ?? 1.5, ativacao * ganhoSuor * (partidaSuor * esforco
    + (esforco ? sensibilidadeSuor : 0.38) * Math.max(0, centralC - limiar) + 0.10 * Math.max(0, peleC - 33.5)));
  const gradienteVaporKPa = Math.max(0, psat(peleC) - umidade / 100 * psat(temperatura));
  const capacidadeEvaporativaW = (87 + esforco * 105) * fatorAr * ganhoEvap * gradienteVaporKPa;
  const perdaPotencialW = suorPotencialLHora * P.calorLatente / 3600;
  // O ensaio de corrida admite supressão parcial quando o suor excede a capacidade de evaporar.
  const excedente = perdaPotencialW > 0 ? Math.max(0, 1 - capacidadeEvaporativaW / perdaPotencialW) : 0;
  const suorProduzidoLHora = suorPotencialLHora * (1 - (protocolo?.supressaoSuor ?? 0) * excedente);
  const evaporacaoW = Math.min(suorProduzidoLHora * P.calorLatente / 3600, capacidadeEvaporativaW);
  const armazenamentoW = calorMetabolicoW - perdaRespiratoriaW - perdaSecaW - evaporacaoW;
  return { calorMetabolicoW, perdaRespiratoriaW, perdaSecaW, transportePeleW, suorProduzidoLHora,
    gradienteVaporKPa, capacidadeEvaporativaW, evaporacaoW, armazenamentoW };
}

// Subpassos de um minuto. Fluxos devolvidos como médias do intervalo exibido.
export function passoTermico(inicial, ambiente, minutos) {
  const media = {};
  const massaKg = ambiente.protocolo?.massaKg ?? P.massaKg;
  const [capacidadeCentral, capacidadePele] = capacidades(massaKg);
  let estado = inicial, minutosAcima37e5 = 0;
  let inicioSudorese = null;
  for (let min = 0; min < minutos; min++) {
    const f = fluxoTermico(estado, ambiente);
    if (ambiente.esforco && ambiente.temperatura >= 30 && estado.centralC >= 37.5) minutosAcima37e5++;
    if (f.suorProduzidoLHora >= 0.10 && inicioSudorese === null) inicioSudorese = min;
    for (const [chave, valor] of Object.entries(f)) media[chave] = (media[chave] ?? 0) + valor / minutos;
    estado = {
      centralC: estado.centralC + (f.calorMetabolicoW - f.perdaRespiratoriaW - f.transportePeleW) * 60 / capacidadeCentral,
      peleC: estado.peleC + (f.transportePeleW - f.perdaSecaW - f.evaporacaoW) * 60 / capacidadePele,
    };
  }
  const suorL = media.suorProduzidoLHora * minutos / 60;
  const suorEvaporadoL = media.evaporacaoW * minutos * 60 / P.calorLatente;
  return {
    estado, suorL, suorEvaporadoL, minutosAcima37e5, inicioSudorese,
    detalhe: { ...inicial, ...ambiente, ...media, calorRetidoKJ: calorEntreEstados(inicial, estado, massaKg),
      suorProduzidoMl: suorL * 1000, suorEvaporadoMl: suorEvaporadoL * 1000,
      suorEscorridoMl: Math.max(0, (suorL - suorEvaporadoL) * 1000) },
  };
}

export function calorEntreEstados(inicial, final, massaKg = P.massaKg) {
  const [capacidadeCentral, capacidadePele] = capacidades(massaKg);
  return (capacidadeCentral * (final.centralC - inicial.centralC) + capacidadePele * (final.peleC - inicial.peleC)) / 1000;
}
