/* Pressões mmHg; Kf mL/min/mmHg; volume excedente mL.
   Leito didático, não um capilar individual nem uma previsão clínica.
   Modo revisado: πsg ESPECIFICADA, sem resolver transporte de proteínas ou
   adaptação estacionária. Levick & Michel, Cardiovasc Res 2010;87:198–210. */
export const CLASSICO = Object.freeze({
  modelo: 'classico', pcArterial: 30, pcVenular: 10, pi: -3,
  oncPlasma: 28, oncInter: 8, oncSub: 6, sigma: 1, kf: .02,
});
export const PADRAO = Object.freeze({
  modelo: 'revisado', pcArterial: 24, pcVenular: 18, pi: -2,
  oncPlasma: 25, oncInter: 8, oncSub: 6, sigma: 1, kf: .02,
});
export const TECIDO = Object.freeze({
  complacencia: 20, // mL/mmHg, aproximação linear ilustrativa
  ganhoLinfa: .01, // mL/min por mL excedente, ilustrativo
  capacidadeLinfa: .4, // mL/min; independente do Kf atual
});
export const cmH2O = mmHg => mmHg * 1.35951;
const limitado = (x, a, b) => Math.min(b, Math.max(a, x));
export function pressaoCapilar(u, e = PADRAO) {
  return e.pcArterial + (e.pcVenular - e.pcArterial) * limitado(u, 0, 1);
}
export function oncExterna(e = PADRAO) {
  return e.modelo === 'classico' ? e.oncInter : e.oncSub;
}
export function pressaoLiquida(u, e = PADRAO) {
  return pressaoCapilar(u, e) - e.pi - e.sigma * (e.oncPlasma - oncExterna(e));
}
export function mediaLiquida(e = PADRAO) {
  return (pressaoLiquida(0, e) + pressaoLiquida(1, e)) / 2;
}
export function pontoDeVirada(e = PADRAO) {
  const a = pressaoLiquida(0, e), b = pressaoLiquida(1, e);
  return a * b < 0 ? a / (a - b) : null;
}
// Integral exata: a média dos extremos dá o líquido, não os fluxos separados.
export function fluxos(e = PADRAO) {
  const a = pressaoLiquida(0, e), b = pressaoLiquida(1, e), media = (a + b) / 2;
  let positivo;
  if (a >= 0 && b >= 0) positivo = media;
  else if (a <= 0 && b <= 0) positivo = 0;
  else positivo = Math.max(a, b) ** 2 / (2 * Math.abs(a - b));
  const filtrado = Math.max(0, e.kf * positivo);
  const reabsorvido = Math.max(0, filtrado - e.kf * media);
  return { filtrado, reabsorvido, liquido: filtrado - reabsorvido };
}
export function estadoDoTecido(e = PADRAO, volume = 0) {
  return { ...e, pi: e.pi + Math.max(0, volume) / TECIDO.complacencia };
}
export function balanco(e = PADRAO, { semLinfa = false, volume = 0 } = {}) {
  const local = estadoDoTecido(e, volume), f = fluxos(local);
  const basal = Math.max(0, fluxos(e.modelo === 'classico' ? CLASSICO : PADRAO).liquido);
  const linfa = semLinfa ? 0 : Math.min(TECIDO.capacidadeLinfa, basal + TECIDO.ganhoLinfa * Math.max(0, volume));
  const taxa = f.liquido - linfa;
  // Volume é excesso sobre o basal; não se esvazia o tecido basal.
  const acumula = volume <= 0 ? Math.max(0, taxa) : taxa;
  return { ...f, linfa, acumula, media: mediaLiquida(local), pi: local.pi,
    teto: semLinfa ? 0 : TECIDO.capacidadeLinfa };
}
// RK4 em passos <=0,1 min: volume obedece às mesmas taxas exibidas.
// Sem teto artificial de volume ou "folga universal de 17 mmHg".
export function avancar(volume, minutos, e = PADRAO, opcoes = {}) {
  let v = Math.max(0, volume);
  if (!Number.isFinite(minutos) || minutos <= 0) return v;
  const n = Math.ceil(minutos / .1), dt = minutos / n;
  const taxa = x => balanco(e, { ...opcoes, volume: Math.max(0, x) }).acumula;
  for (let i = 0; i < n; i++) {
    const a = taxa(v), b = taxa(v + dt * a / 2), c = taxa(v + dt * b / 2), d = taxa(v + dt * c);
    v = Math.max(0, v + dt * (a + 2 * b + 2 * c + d) / 6);
  }
  return v;
}
export function edemaEm(minutos, e = PADRAO, opcoes = {}) {
  return avancar(0, Math.max(0, Math.min(1440, minutos)), e, opcoes);
}
export const CAUSAS = [
  { id: 'normal', nome: 'Basal', ajuste: {}, descricao: 'Filtração basal equilibrada pela drenagem linfática.' },
  { id: 'depe', nome: 'Estase venosa', ajuste: { pcArterial: 38, pcVenular: 30 }, descricao: 'Elevação ilustrativa da pressão microvascular; não equivale à pressão venosa do tornozelo.' },
  { id: 'cardiaca', nome: 'Congestão cardíaca', ajuste: { pcArterial: 34, pcVenular: 28 }, descricao: 'Representa a transmissão da congestão venosa ao leito microvascular.' },
  { id: 'hipoalbuminemia', nome: 'Albumina baixa', ajuste: { oncPlasma: 14 }, descricao: 'Menor pressão oncótica plasmática favorece a filtração; albumina não é o único determinante do edema.' },
  { id: 'inflamacao', nome: 'Inflamação', ajuste: { sigma: .5, oncInter: 16, oncSub: 12, kf: .06 }, descricao: 'Maior condutância hidráulica e menor retenção de proteínas pela barreira.' },
  { id: 'linfatico', nome: 'Obstrução linfática', ajuste: {}, semLinfa: true, descricao: 'A drenagem cessa sem elevar inicialmente a pressão capilar.' },
];
export function comCausa(id, modelo = 'revisado') {
  const c = CAUSAS.find(x => x.id === id) || CAUSAS[0];
  return { estado: { ...(modelo === 'classico' ? CLASSICO : PADRAO), ...c.ajuste },
    semLinfa: !!c.semLinfa, nome: c.nome, descricao: c.descricao };
}
