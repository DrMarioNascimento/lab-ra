// Modelo demonstrativo de UMA região de remodelação, sem previsão clínica.
export const CORES={carga:'#e8bd6b',osteocito:'#71d7ce',reabsorcao:'#f29591',formacao:'#86cca5',mineral:'#bca9ed'};
export const CENARIOS={
 habitual:{nome:'Carga habitual',sinal:1,reabsorcao:1,formacao:1,esclerostina:'Referência'},
 exercicio:{nome:'Exercício',sinal:1.55,reabsorcao:1,formacao:1.12,esclerostina:'Tendência de redução'},
 imobilizacao:{nome:'Imobilização',sinal:.18,reabsorcao:1.12,formacao:.65,esclerostina:'Tendência de aumento'}
};
export const limitar=(x,a=0,b=1)=>Math.max(a,Math.min(b,Number.isFinite(x)?x:a));
export const suave=x=>{const u=limitar(x);return u*u*(3-2*u);};
export function estado(t,cenario='habitual'){
 const u=limitar(t),c=CENARIOS[cenario]??CENARIOS.habitual;
 const retirada=.18*c.reabsorcao*suave((u-.08)/.22);
 const depositada=.18*c.formacao*suave((u-.40)/.45);
 // Cada parcela só começa a mineralizar depois de ser depositada.
 // Quadratura sobre a curva de deposição: mineralização nunca antecede osteoide.
 let mineralizada=0;const n=100;
 for(let i=0;i<n;i++){
  const a=.40+.45*i/n,b=.40+.45*(i+1)/n;
  const parcela=.18*c.formacao*(suave((b-.40)/.45)-suave((a-.40)/.45));
  mineralizada+=parcela*suave((u-(a+b)/2-.03)/.12);
 }
 mineralizada=Math.min(depositada,mineralizada);
 const fase=u<.08?'Ativação':u<.30?'Reabsorção':u<.40?'Reversão':u<.85?'Formação e mineralização':u<1?'Mineralização':'Ciclo concluído';
 return {u,fase,carga:c.sinal,retirada,depositada,mineralizada,osteoide:depositada-mineralizada,
  matriz:1-retirada+depositada,mineral:1-retirada+mineralizada,
  osteoclasto:suave((u-.06)/.03)*(1-suave((u-.28)/.03)),
  osteoblasto:suave((u-.38)/.04)*(1-suave((u-.84)/.05))};
}
export function avancar(t,delta,loop=false){const n=limitar(t)+Math.max(0,Number.isFinite(delta)?delta:0);return loop?{t:n%1,fim:false}:{t:Math.min(1,n),fim:n>=1};}
export function fluxoCanalicular(t,index,carga){
 // Oscila sem saltos: fluxo intersticial bidirecional, não transporte em um só sentido.
 const amplitude=.12+.38*limitar(carga/1.55);
 return .5-amplitude*Math.cos(t*20*Math.PI+index*2.39996);
}
