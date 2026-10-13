import {estado,limitar,suave,CENARIOS} from './fisica.js?v=osso-deforma-20261004';

export const REGIOES=[-.95,0,.95];
// Os níveis celulares são estudos isolados: três regiões trabalhadas em sequência.
// O ciclo acoplado permanece nos níveis 1–3, sem repetir a outra célula nestas cenas.
export function estadoNivel(t,cenario='habitual',nivel=0){
 if(nivel<3)return estado(t,cenario);
 const u=limitar(t),c=CENARIOS[cenario]??CENARIOS.habitual;
 const regiao=Math.min(2,Math.floor(u*3)),local=u===1?1:u*3-regiao;
 const parcelas=REGIOES.map((_,i)=>suave((u*3-i-.06)/(i===2?.92:.69)));
 const fracao=parcelas.reduce((a,b)=>a+b,0)/3;
 const retirada=nivel===3?.18*c.reabsorcao*fracao:0;
 const depositada=nivel===4?.18*c.formacao*fracao:0;
 let mineralizada=0;
 if(nivel===4)for(let j=0;j<3;j++)for(let i=0;i<40;i++){
  const intervalo=j===2?.92:.69,a=.06+intervalo*i/40,b=.06+intervalo*(i+1)/40;
  const parcela=.18*c.formacao/3*(suave((b-.06)/intervalo)-suave((a-.06)/intervalo));
  mineralizada+=parcela*suave((u*3-j-(a+b)/2-.04)/.16);
 }
 mineralizada=Math.min(depositada,mineralizada);
 const deslocamento=regiao<2?suave((local-.78)/.22):0;
 const x=REGIOES[regiao]+(REGIOES[Math.min(2,regiao+1)]-REGIOES[regiao])*deslocamento;
 const atividade=u<1?suave(local/.04)*(1-suave((local-(regiao===2?.98:.74))/(regiao===2?.02:.08))):0;
 const acao=nivel===3?'Reabsorção':'Formação e mineralização';
 const fase=u===1?nivel===4&&depositada-mineralizada>.001?'Ação concluída · osteoide em maturação':'Ação concluída':local<.04?'Adesão · região '+(regiao+1):local<.78||regiao===2?acao+' · região '+(regiao+1):'Deslocamento → região '+(regiao+2);
 return {u,fase,carga:c.sinal,retirada,depositada,mineralizada,osteoide:depositada-mineralizada,
  matriz:1-retirada+depositada,mineral:1-retirada+mineralizada,
  osteoclasto:nivel===3?atividade:0,osteoblasto:nivel===4?atividade:0,
  regiao,local,x,parcelas,deslocamento,atividade,nivel,fatorReabsorcao:c.reabsorcao,fatorFormacao:c.formacao};
}

// Coordenadas visuais ampliadas; não são deformações medidas nem volumes clínicos.
export function quadro(t,cenario,separacao=0,cargaVisivel=true,nivel=0){
 const a=estadoNivel(t,cenario,nivel),pulso=.5+.5*Math.sin(a.u*20*Math.PI);
 const intensidade=a.carga/1.55,axial=nivel===1||nivel===2;
 const forca=cargaVisivel?intensidade*(axial?pulso:.35+.65*pulso):0;
 return {...a,separacao:limitar(separacao),forca,
  deformacao:(axial?.12:.06)*forca,
  transporteReabsorcao:nivel===3?a.atividade:nivel===4?0:a.u>=.08&&a.u<.30?a.osteoclasto:0,
  transporteFormacao:nivel===4?a.atividade:nivel===3?0:a.u>=.40&&a.u<.85?a.osteoblasto:0};
}
export function superficie(x,z,a){
 const relevo=.025*Math.sin(x*5.3+z*3)*Math.cos(z*7.1-x*2)+.013*Math.sin(x*17-z*13);
 if(a.nivel>=3){
  let h=relevo;
  for(let i=0;i<3;i++){
   const pit=Math.exp(-((x-REGIOES[i])**2/.32+z*z/.40));
   h+=a.nivel===3?-.46*a.fatorReabsorcao*a.parcelas[i]*pit:(-.40+.46*a.parcelas[i]*a.fatorFormacao)*pit;
  }
  return h;
 }
 const escavacao=Math.exp(-((x+.7)**2/1.05+z*z/.48));
 return relevo-3.7*(a.retirada-a.depositada)*escavacao;
}
export function maturacaoRegiao(t,x){
 const i=REGIOES.reduce((best,p,j)=>Math.abs(x-p)<Math.abs(x-REGIOES[best])?j:best,0);
 const local=limitar(t)*3-i;
 return {colageno:suave((local-.06)/(i===2?.92:.69)),mineral:suave((local-.10)/(i===2?1.08:.85))};
}
// As rotas fecham com fade, sem saltos visíveis na origem e no destino.
export function percurso(t,index,atividade,velocidade=16){
 const u=((limitar(t)*velocidade+index*.61803398875)%1+1)%1;
 return {u,escala:suave(u/.09)*(1-suave((u-.88)/.12))*limitar(atividade)};
}
export function maturacaoLocal(t,indice){
 const deposito=.40+.40*limitar(indice);
 return {colageno:suave((limitar(t)-deposito)/.045),mineral:suave((limitar(t)-deposito-.035)/.12)};
}
