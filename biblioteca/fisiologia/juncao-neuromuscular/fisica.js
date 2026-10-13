/* Modelo causal determinístico, ilustrativo, de UMA fibra. Não é Hodgkin–Huxley. */
export const CORES={ach:'#e8bd6b',epp:'#71d7ce',vm:'#76b9ee',ca:'#c7a5ec',ativacao:'#f29591'};
export const PADRAO={modo:'unico',frequencia:15,liberacao:1,receptores:1};
export const REPOUSO=-90, LIMIAR=-65, DT=.1;
const limitar=(n,min,max)=>Math.max(min,Math.min(max,n));
function numero(n,padrao,min,max){return Number.isFinite(Number(n))?limitar(Number(n),min,max):padrao;}
export function parametros(p={}){return {modo:p.modo==='trem'?'trem':'unico',frequencia:numero(p.frequencia,15,1,50),liberacao:numero(p.liberacao,1,0,1),receptores:numero(p.receptores,1,0,1)};}
export function pulso(t,subida,queda){
 if(t<=0)return 0;
 const pico=Math.log(queda/subida)/(1/subida-1/queda);
 return (Math.exp(-t/queda)-Math.exp(-t/subida))/(Math.exp(-pico/queda)-Math.exp(-pico/subida));
}
export function potencialAcao(t){
 if(t<0||t>6)return REPOUSO;
 const pontos=[[0,LIMIAR],[.5,30],[1.4,-10],[2.8,-96],[6,REPOUSO]];
 for(let i=1;i<pontos.length;i++)if(t<=pontos[i][0]){const [a,b]=pontos[i-1],[c,d]=pontos[i];return b+(d-b)*(t-a)/(c-a);}
 return REPOUSO;
}
export function simular(entrada={}){
 const p=parametros(entrada),duracao=p.modo==='unico'?320:650,estimulos=[];
 // A sequência termina em 400 ms; a janela restante mostra a recuperação.
 for(let t=20;t<=400;t+=1000/p.frequencia){estimulos.push(t);if(p.modo==='unico')break;}
 const amostras=[],disparos=[];let ativacao=0,ultimo=-Infinity,anteriorEpp=REPOUSO;
 let picoEpp=REPOUSO,picoCa=0,picoAtivacao=0;
 for(let i=0;i<=Math.round(duracao/DT);i++){
  const t=i*DT;let ach=0,preca=0;
  for(const s of estimulos){ach+=pulso(t-s-.6,.3,2.5)*p.liberacao;preca+=pulso(t-s,.15,1);}
  // Depolarização local graduada; o potencial de reversão limita a subida.
  const epp=Math.min(0,REPOUSO+45*ach*p.receptores);
  if(epp>=LIMIAR&&anteriorEpp<LIMIAR&&t-ultimo>=6){ultimo=t;disparos.push(t);}
  anteriorEpp=epp;
  let ca=0;for(const s of disparos)ca+=pulso(t-s-2,2,35);
  const alvo=ca*ca/(ca*ca+.3*.3);
  const tau=alvo>ativacao?35:65;
  ativacao=alvo+(ativacao-alvo)*Math.exp(-DT/tau);
  const vm=t-ultimo<=6?potencialAcao(t-ultimo):REPOUSO;
  picoEpp=Math.max(picoEpp,epp);picoCa=Math.max(picoCa,ca);picoAtivacao=Math.max(picoAtivacao,ativacao);
  amostras.push({t,ach,preca,epp,vm,ca,ativacao});
 }
 return {p,duracao,estimulos,disparos,amostras,picoEpp,picoCa,picoAtivacao,fatorSeguranca:(picoEpp-REPOUSO)/(LIMIAR-REPOUSO)};
}
export function noInstante(sim,t){return sim.amostras[Math.round(limitar(Number.isFinite(t)?t:0,0,sim.duracao)/DT)];}
export function fase(sim,t){
 const a=noInstante(sim,t);
 if(!sim.disparos.length&&t>sim.estimulos[0]+8)return 'Transmissão insuficiente';
 if(a.vm>-70)return 'Potencial de ação muscular';
 if(a.ach>.08)return 'Acetilcolina na fenda';
 if(a.ca>.25)return 'Cálcio no sarcoplasma';
 if(a.ativacao>.08)return 'Ativação e relaxamento';
 if(t<sim.estimulos[0])return 'Antes do estímulo';
 return 'Recuperação';
}
