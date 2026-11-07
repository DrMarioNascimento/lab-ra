// Hora local do aparelho. Independente de iniciar, pausar ou reiniciar o bonde.
export const PONTEIROS = ['Ponteiro_Horas', 'Ponteiro_Minutos', 'Ponteiro_Segundos'];
export const PERIODOS = [43200, 3600, 60];
export function angulosRelogio(data) {
  const s = data.getSeconds() + data.getMilliseconds() / 1000;
  const m = data.getMinutes() + s / 60;
  const h = data.getHours() % 12 + m / 60;
  return [h / 12, m / 60, s / 60].map(v => -v * Math.PI * 2);
}
export function ligarRelogio(estacao, agora = () => new Date()) {
  const ponteiros = PONTEIROS.map(n => estacao.getObjectByName(n));
  const atualizar = () => angulosRelogio(agora()).forEach((a, i) => {
    if (ponteiros[i]) ponteiros[i].rotation.set(0, 0, a);
  });
  atualizar(); return atualizar;
}
