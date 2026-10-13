// Anatomia em cm a partir do solo; o eixo longitudinal determina o desnível.
export const CM=.02;
export const CORPO={altura:170*CM,solo:0,tornozelo:12,joelho:48,coxa:75,quadril:92,diafragma:118,coracao:128,ombro:142,jugular:150,olhos:160};
// Compatibilidade geométrica: PIH só conserva a origem das malhas aprovadas.
// Não é usado como referência de pressão neste modelo.
export const PIH=CORPO.diafragma;
export const NIVEL_AD=CORPO.coracao;
export const REFERENCIAS=Object.freeze({pam:100,atrial:2,quedaArterial:5,gradienteVenoso:3});
export const REGIOES=Object.freeze([
 {id:'jugular',nome:'Pescoço',h:CORPO.jugular,pontos:'Carótida / jugular'},
 {id:'coracao',nome:'Coração',h:NIVEL_AD,pontos:'Aorta / átrio direito'},
 {id:'coxa',nome:'Coxa',h:CORPO.coxa,pontos:'Artéria / veia femoral'},
 {id:'tornozelo',nome:'Tornozelo',h:CORPO.tornozelo,pontos:'Artéria / veias distais'}
]);
export const PA_POR_MMHG=133.322387415,PA_POR_CMH2O=98.0665;
export const MMHG_POR_CM=1060*9.80665*.01/PA_POR_MMHG;
export const mmHgParaCmH2O=p=>p*PA_POR_MMHG/PA_POR_CMH2O;
const clamp=(x,a,b)=>Math.min(b,Math.max(a,x));
const smooth=t=>t*t*(3-2*t);
// Aproximação espacial do gradiente de escoamento: central → periférico em 20 cm.
export const pesoPeriferico=h=>smooth(clamp(Math.abs(h-NIVEL_AD)/20,0,1));
export const desnivelVertical=(altura,grau)=>(NIVEL_AD-altura)*Math.sin(grau*Math.PI/180);
export const componenteHidrostatico=(altura,grau)=>desnivelVertical(altura,grau)*MMHG_POR_CM;
export const pressaoArterial=(altura,grau)=>REFERENCIAS.pam-REFERENCIAS.quedaArterial*pesoPeriferico(altura)+componenteHidrostatico(altura,grau);
// Retorna a extrapolação da coluna aberta; jugular negativa é exibida colabada.
export const pressaoVenosa=(altura,grau,{base=REFERENCIAS.atrial}={})=>base+REFERENCIAS.gradienteVenoso*pesoPeriferico(altura)+componenteHidrostatico(altura,grau);
// O efeito da bomba diminui suavemente entre joelho e coxa.
export function efeitoDistal(altura){return 1-smooth(clamp((altura-CORPO.joelho)/(CORPO.coxa-CORPO.joelho),0,1))}
export function pressaoLocal(altura,grau,atividade=0,opc={}){
 const repouso=pressaoVenosa(altura,grau,opc);
 return repouso-(repouso-Math.min(repouso,25))*clamp(atividade,0,1)*efeitoDistal(altura);
}
// Complacência demonstrativa recalibrada para PV periférica basal de 5 mmHg.
// Mantém seu calibre visual basal anterior e limita a expansão: não é dado clínico.
export const fatorVenoso=(p,teto=1.45)=>clamp(Math.pow(clamp(p,1,120)/5,.15)*Math.pow(10/12,.25),.80,teto);
export function leiturasHemodinamicas(grau,atividade=0){
 return Object.fromEntries(REGIOES.map(r=>{const pa=pressaoArterial(r.h,grau),pvLivre=pressaoLocal(r.h,grau,atividade),colabada=r.h>NIVEL_AD&&pvLivre<=0,pv=Math.max(0,pvLivre);return [r.id,{...r,pa,pv,pvLivre,colabada,desnivel:desnivelVertical(r.h,grau),hidro:componenteHidrostatico(r.h,grau),diferenca:colabada?null:pa-pv}]}));
}
export function aberturaValvula(fase,ativo){
 if(!ativo)return 1;
 const t=((fase%1)+1)%1,aperto=t<.5?Math.sin(t*2*Math.PI)**2:0;
 return clamp((aperto-.04)/.22,0,1);
}
export const pulsoCardiaco=t=>Math.max(0,Math.sin(t*2*Math.PI*1.1))**6;
export function projetarPostura(x,y,grau){const a=(90-grau)*Math.PI/180,c=Math.cos(a),s=Math.sin(a);return {x:x*c-y*s,y:x*s+y*c}}
