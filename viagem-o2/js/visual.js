// Shared visual language. Group colours identify teams, never oxygen saturation.
const ASSETS = new URL('../assets/', import.meta.url);
export const PARADA_ICON = { ar: 'ventilacao', alveolo: 'difusao', membrana: 'difusao', capilar: 'arterial', hemoglobina: 'arterial', coracao: 'coracao', arteriolas: 'distribuicao', tecido: 'tecido', retorno: 'retorno' };
export function icon(name, cls = '') {
  const safe = ['ventilacao','difusao','arterial','coracao','distribuicao','tecido','retorno','o2','mochila'].includes(name) ? name : 'o2';
  return `<img class="bio-icon ${cls}" src="${ASSETS}icons/${safe}.svg" alt="" width="64" height="64" decoding="async">`;
}
export function molecule(cls = '') {
  return `<div class="molecule ${cls}" aria-hidden="true"><span class="atom atom-a"></span><span class="atom atom-b"></span></div>`;
}
export function teamStyle(g) {
  return `--team:${g?.cor.hex || '#57c9ef'};--team-ink:${g ? ['#021e2e','#ffffff','#2e1902','#031f18','#ffffff','#33121a','#ffffff'][g.i] : '#031f2b'}`;
}
export function studentShell(g, content) {
  return `<div class="phone team-wallpaper" style="${teamStyle(g)}" data-team="${g ? g.i + 1 : 0}"><div class="phone-wall" aria-hidden="true"></div>${content}</div>`;
}
