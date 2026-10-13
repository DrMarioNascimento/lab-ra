// Camada visual determinística: pausa, cursor e loop sempre recompõem o mesmo estado.
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
export const suave=x=>{const u=clamp(x);return u*u*(3-2*u);};
export function estadoVisual(sim,t){
 const time=clamp(t,0,sim.duracao),step=sim.amostras[1].t,idx=Math.min(sim.amostras.length-1,Math.floor(time/step));
 const a=sim.amostras[idx],b=sim.amostras[Math.min(idx+1,sim.amostras.length-1)],u=b.t>a.t?(time-a.t)/(b.t-a.t):0;
 return Object.fromEntries(Object.entries(a).map(([key,value])=>[key,key==='t'?time:value+(b[key]-value)*u]));
}
export function comprimentoVisual(ativacao){return 2.4-.5*clamp(ativacao);}
export function encaixeTriade(ativacao){
 const fibra=comprimentoVisual(ativacao)/2.4;
 // A raiz permanece na cisterna; a extremidade conserva margem dentro do feixe.
 const reticulo=(1.74*fibra-.88)/(1.8-.88);
 return {fibra,reticulo,deslocamento:.88*(1-reticulo)};
}
export function faseContracao(sim,t){
 if(t<sim.estimulos[0])return 'Antes do estímulo';
 if(!sim.disparos.length&&t>sim.estimulos[0]+8)return 'Transmissão insuficiente · sem contração';
 const a=estadoVisual(sim,t);
 if(a.ativacao<=.002)return a.ca>.01?'Início da ativação contrátil':'Sarcômero em repouso';
 const variacao=estadoVisual(sim,t+.5).ativacao-estadoVisual(sim,t-.5).ativacao;
 if(variacao>.00001)return 'Contração · sarcômero encurtando';
 if(variacao<-.00001)return 'Relaxamento · sarcômero alongando';
 return 'Contração mantida · comprimento estável';
}
export function impulsoVisual(eventos,t,inicio,duracao){
 for(let i=eventos.length-1;i>=0;i--){const age=t-eventos[i]-inicio;if(age>=0&&age<duracao)return age/duracao;}
 return null;
}
const TIPOS={ach:{inicio:.6,vida:14,lotes:4,fonte:'estimulos'},preca:{inicio:0,vida:7,lotes:4,fonte:'estimulos'},na:{inicio:.35,vida:7,lotes:4,fonte:'disparos'},ca:{inicio:2,vida:120,lotes:8,fonte:'disparos'}};
export function particulaVisual(tipo,index,n,t,sim){
 const d=TIPOS[tipo],porLote=Math.ceil(n/d.lotes),lote=Math.floor(index/porLote),local=index%porLote;
 if(tipo==='ach'&&(local+.5)/porLote>sim.p.liberacao)return null;
 const eventos=sim[d.fonte],delay=(local/porLote)*(tipo==='ca'?4:.7);
 for(let e=eventos.length-1;e>=0;e--){
  if(e%d.lotes!==lote)continue;
  const age=t-eventos[e]-d.inicio-delay;
  if(age>=0&&age<d.vida){const u=age/d.vida;return {u,fade:suave(u/.09)*(1-suave((u-.76)/.24)),local,lote};}
 }
 return null;
}
export function vesiculaVisual(index,t,sim){
 if((index+.5)/8>sim.p.liberacao)return null;
 for(let e=sim.estimulos.length-1;e>=0;e--){
  const age=t-sim.estimulos[e]+2.4-index*.08;
  if(age>=0&&age<11)return {u:age/11,fusao:suave((age-2.5)/2.3),fade:1-suave((age-6)/5)};
  if(age>=11&&age<19)return {u:0,fusao:0,fade:suave((age-11)/8)};
 }
 return null;
}
export function trajetoFluido(origem,destino,u,seed=0,amplitude=.12){
 const f=clamp(u),envoltoria=Math.sin(Math.PI*f),fase=seed*2.39996;
 return origem.map((v,k)=>v+(destino[k]-v)*f+amplitude*envoltoria*(Math.sin(f*7+fase+k*2)+.35*Math.sin(f*17+fase*.7+k)));
}
