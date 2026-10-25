// Um relógio de demonstração, em segundos de animação, não em tempo fisiológico.
export const DURACAO = 16;
export const limitar = (v, a=0, b=1) => Math.max(a, Math.min(b, v));
export const suave = v => { const t=limitar(v); return t*t*(3-2*t); };
export function estadoPelicula(segundos) {
  const t=((segundos%DURACAO)+DURACAO)%DURACAO;
  const fase=t<3?0:t<6?1:t<8?2:t<12?3:0;
  const potencial=t<3?-70:t<6?-70+105*suave((t-3)/3):t<8?35:t<12?35-105*suave((t-8)/4):-70;
  return {t,fase,potencial,rotulo:['Repouso · interior negativo','Separação de cargas se inverte','Interior positivo','Retorno ao repouso'][fase]};
}
export function estadoTransporte(segundos) {
  const t=((segundos%DURACAO)+DURACAO)%DURACAO;
  // Um ciclo completo de acesso alternado; a fase ocluída separa as aberturas.
  const c=(t%8)/8;
  const fora=1-suave((c-.25)/.10);
  const dentro=suave((c-.50)/.10)*(1-suave((c-.88)/.08));
  const glicose=c<.25?suave(c/.25)*.5:c<.60?.5:.5+.5*suave((c-.60)/.25);
  const bomba=(t%8)/8;
  return {t,fora,dentro,glicose,bomba,
    rotulo:bomba<.2?'Bomba: ligação de 3 Na⁺ no interior':bomba<.5?'ATP → transporte de 3 Na⁺ para fora':bomba<.7?'Bomba: ligação de 2 K⁺ no exterior':'Retorno → transporte de 2 K⁺ para dentro'};
}
