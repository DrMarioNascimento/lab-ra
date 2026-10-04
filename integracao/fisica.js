/* Um adulto de referência, em ar ambiente ao nível do mar. Curvas de esforço
   escolhidas para ensino; Fick e conteúdo de O2 são identidades calculadas. */
export const CORES={respiracao:'#71d7ce',coracao:'#f29591',fluxo:'#76b9ee',extracao:'#e8bd6b',consumo:'#c7a5ec'};
export const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,Number.isFinite(x)?x:a));
export const saturacao=po2=>1/(1+(26.8/Math.max(.001,po2))**2.7);
export const conteudo=(po2,hb=15)=>1.34*hb*saturacao(po2)+.003*po2;
function po2ParaConteudo(c){let a=0,b=150;for(let i=0;i<55;i++){const m=(a+b)/2;conteudo(m)>c?b=m:a=m;}return (a+b)/2;}
export function equilibrio(esforco=0){
 const e=clamp(esforco),fc=70+80*e,vs=70+40*(2*e/(1+e)),dc=fc*vs/1000,vo2=.25+1.95*e,r=.8+.2*e,vco2=vo2*r;
 const paco2=40,vao2=.863*vco2*1000/paco2,fr=12+18*e,vd=.15,vt=vao2/fr+vd,ve=fr*vt;
 const pao2=.21*(760-47)-paco2/r,po2a=pao2-8,cao2=conteudo(po2a),diferenca=vo2*100/dc,cvo2=cao2-diferenca,po2v=po2ParaConteudo(cvo2),sv=saturacao(po2v),sa=saturacao(po2a);
 return {esforco:e,fc,vs,dc,vo2,vco2,fr,vt,ve,va:vao2,vd,paco2,pao2,po2a,po2v,cao2,cvo2,sa,sv,extracao:diferenca/cao2,oferta:dc*cao2/100,diferenca};
}
export function criarEstado(e=0){return {esforco:clamp(e),alvo:clamp(e),tempo:0,cardiaco:0,respiratorio:0,transporte:0,muscular:0};}
export function avancar(s,dt){
 dt=clamp(dt,0,60);if(!dt)return s;
 // Integração de fases com passos curtos evita saltos e dependência da tela.
 for(let left=dt;left>1e-9;){const h=Math.min(left,1/120),antes=equilibrio(s.esforco);s.esforco=s.alvo+(s.esforco-s.alvo)*Math.exp(-h/8);const depois=equilibrio(s.esforco);
  s.cardiaco+=h*(antes.fc+depois.fc)/120;s.respiratorio+=h*(antes.fr+depois.fr)/120;s.transporte+=h*(antes.dc+depois.dc)/9.8/9;s.muscular+=h*(.35+.9*s.esforco);s.tempo+=h;left-=h;
 }return s;
}
export function quadro(s){
 const a=equilibrio(s.esforco),phase=s.cardiaco%1,r=s.respiratorio%1;
 // Pulsos visuais, não resolução de pressões/valvas ou volumes ventriculares.
 const sistole=phase<.38?Math.sin(Math.PI*phase/.38)**2:0;
 const inspiracao=r<.4?(.5-.5*Math.cos(Math.PI*r/.4)):(.5+.5*Math.cos(Math.PI*(r-.4)/.6));
 return {...a,sistole,inspiracao,faseRespiratoria:r<.4?'Inspiração':'Expiração',faseCardiaca:phase<.38?'Sístole':'Diástole',tempo:s.tempo,transporte:s.transporte,contracao:(.5-.5*Math.cos(2*Math.PI*s.muscular))*s.esforco};
}
