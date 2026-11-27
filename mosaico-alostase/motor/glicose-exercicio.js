// Schiavon et al. (2013), Fig. 3 e seção Meal Appearance, EGP, and Glucose Disappearance.
export const INICIO_EXERCICIO_POS_REFEICAO = 120;
export const FIM_JANELA_FLUXOS = 180;
export const FLUXOS_EXERCICIO = {
  refeicao: [[120, 57.8, 9.8], [180, 29.5, 5]],
  endogena: [[120, 2.4, 0.4], [180, 18.2, 2.6]],
  retirada: [[120, 89.1, 11.6], [140, 44.9, 6.2], [180, 45.4, 6.5]],
};

function interpolar(serie, min) {
  if (min === serie[0][0]) return serie[0][1];
  const i = serie.findIndex(([tempo]) => tempo >= min);
  const [inicio, a] = serie[i - 1], [fim, b] = serie[i];
  return a + (b - a) * (min - inicio) / (fim - inicio);
}

export function simularFluxosExercicio() {
  let acumulado = 0;
  let saldoAnterior;
  const duracao = FIM_JANELA_FLUXOS - INICIO_EXERCICIO_POS_REFEICAO;
  return Array.from({ length: duracao + 1 }, (_, i) => {
    const minuto = INICIO_EXERCICIO_POS_REFEICAO + i;
    const refeicao = interpolar(FLUXOS_EXERCICIO.refeicao, minuto);
    const endogena = interpolar(FLUXOS_EXERCICIO.endogena, minuto);
    const retirada = interpolar(FLUXOS_EXERCICIO.retirada, minuto);
    const entrada = refeicao + endogena;
    const saldo = entrada - retirada;
    if (i > 0) acumulado += (saldoAnterior + saldo) / 2;
    saldoAnterior = saldo;
    return { minuto, refeicao, endogena, retirada, entrada, saldo, acumulado };
  });
}
