// Resposta didática a exposições repetidas. Uma dose equivale a 60 min acima de 37,5 °C
// durante exercício no calor. Os ganhos não são metas de exposição para o usuário.
export const INICIAL_ACLIMATACAO = Object.freeze({ cardiovascular: 0, suor: 0 });

export function atualizarAclimatacao(estado, minutosQuentes) {
  if (!minutosQuentes) {
    // Daanen et al.: ordem de grandeza da perda de adaptação de FC e temperatura.
    // A retenção da adaptação do suor é uma hipótese neste horizonte didático.
    return { cardiovascular: estado.cardiovascular * 0.975, suor: estado.suor };
  }
  const dose = minutosQuentes / 60;
  return {
    cardiovascular: 1 - (1 - estado.cardiovascular) * Math.exp(-dose / 3.5),
    suor: 1 - (1 - estado.suor) * Math.exp(-dose / 3),
  };
}

export function ajusteCardiacoNoCalor(estado, minutosRecuperacao = 0) {
  // A amplitude de 15 bpm referencia o protocolo de ciclismo a 40 °C de Lorenzo et al.
  return 15 * estado.cardiovascular * Math.exp(-minutosRecuperacao / 3);
}
