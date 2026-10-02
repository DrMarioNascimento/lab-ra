const clamp=(x,a,b)=>Math.min(b,Math.max(a,x));
// Modelo didático: seis contrações aproximam a pressão ambulatória;
// ao parar, o reservatório distal se reenche gradualmente.
export function criarEstadoBomba(){return {atividade:0}}
export function avancarBomba(estado,dt,ativo){const alvo=ativo?1:0,tau=ativo?2.4:7;estado.atividade=alvo+(estado.atividade-alvo)*Math.exp(-Math.max(0,dt)/tau);return estado.atividade}
export function pressaoComBomba(parado,atividade){const alvo=Math.min(parado,25);return parado-(parado-alvo)*clamp(atividade,0,1)}
export function contracaoNaFase(fase){const t=((fase%1)+1)%1;return t<.5?Math.pow(Math.sin(t*Math.PI*2),2):0}
