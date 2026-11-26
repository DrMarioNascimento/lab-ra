// Resposta didática a exposições repetidas. Uma dose equivale a 60 min acima de 37,5 °C
// durante exercício no calor. Os ganhos não são metas de exposição para o usuário.
export const INICIAL_ACLIMATACAO = Object.freeze({ cardiovascular: 0, suor: 0 });
export const MEIA_VIDA_SUOR_DIAS = 14;

export function atualizarAclimatacao(estado, minutosQuentes) {
  if (!minutosQuentes) {
    // Daanen et al.: ordem de grandeza da perda de adaptação de FC e temperatura.
    // Estudos de sudorese apresentam ampla variação. A meia-vida é um parâmetro didático.
    return { cardiovascular: estado.cardiovascular * 0.975, suor: estado.suor * 2 ** (-1 / MEIA_VIDA_SUOR_DIAS) };
  }
  const dose = minutosQuentes / 60;
  return {
    cardiovascular: 1 - (1 - estado.cardiovascular) * Math.exp(-dose / 3.5),
    suor: 1 - (1 - estado.suor) * Math.exp(-dose / 3),
  };
}

export function ajusteCardiacoNoCalor(estado, respostaAoEsforco, intensidade) {
  // 15 bpm em ciclismo a 50% do VO₂máx (Lorenzo et al.). A escala com a intensidade é didática.
  return 15 * estado.cardiovascular * respostaAoEsforco * Math.min(1, intensidade / 0.5);
}
