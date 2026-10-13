/* Adulto virtual: parâmetros ilustrativos, sem classificação de gravidade clínica.
   O RC expiratório calcula o aprisionamento em regime periódico; a CVF é uma
   manobra isolada e não deve voltar abruptamente ao volume inicial. */
import {estadoRespiratorio, volumeRelativo, transpulmonar, PPL_MEDIA_FRC} from './fisica.js?v=encaixes-20261002';
import {duracoes} from '../fisica-cardiaca.js';
export const CAPACIDADE_MODELO = 6; // L, referência explícita do adulto virtual
// Curva global calibrada: CRF 40% em P_L=6,25; CPT em P_L=30 cmH₂O.
const K_GLOBAL=(()=>{let a=.001,b=.2;for(let i=0;i<50;i++){const k=(a+b)/2,v=(1-Math.exp(-k*6.25))/(1-Math.exp(-k*30));if(v>.4)b=k;else a=k;}return (a+b)/2;})();
const DENOM_GLOBAL=1-Math.exp(-K_GLOBAL*30);
const volumeGlobal=(pl,k=.1)=>clamp((1-Math.exp(-K_GLOBAL*(k/.1)*Math.max(0,pl)))/DENOM_GLOBAL,0,1);
const clamp = (v,a,b)=>Math.max(a,Math.min(b,v));
export const ESTADOS = [
  {id:'repouso',nome:'Repouso',fr:15,fc:75,fi:.4,amplitude:3,k:.1,pl:6.25,nota:'Respiração tranquila. Inspiração ativa e expiração passiva.'},
  {id:'exercicio',nome:'Exercício',fr:30,fc:120,fi:.4,amplitude:5,k:.1,pl:6.25,vascular:{pa:25,pv:9},nota:'Respiração mais rápida e profunda, com maior frequência cardíaca e perfusão.'},
  {id:'enfisema',nome:'Enfisema',fr:12,fc:90,fi:.3,amplitude:2.5,k:.16,pl:5,tau:2.4,nota:'Exemplo com menor recuo elástico e maior complacência: pulmão mais insuflado e menor reserva inspiratória.'},
  {id:'fibrose',nome:'Fibrose',fr:24,fc:90,fi:.4,amplitude:4,k:.045,pl:6.25,excursao:.5,nota:'Exemplo restritivo: menor complacência, volumes reduzidos e respiração mais rápida. Maior esforço de pressão produz menor expansão, sem aprisionamento obstrutivo.'},
  {id:'cvf',nome:'Capacidade vital forçada',fr:0,fc:75,fi:.25,amplitude:3,k:.1,pl:6.25,duracao:8,nota:'Manobra única: inspiração máxima por 2 s e expiração forçada por 6 s. CVF e VEF₁ são exemplos do adulto virtual de 6 L, sem interpretação diagnóstica.'},
];
export const comEstado = id=>ESTADOS.find(e=>e.id===id)||ESTADOS[0];
export const duracaoEstado = id=>comEstado(id).duracao||60/comEstado(id).fr;
const subida = u=>(1-Math.cos(Math.PI*u))/2;
function perfil(fase,p) {
  const f=clamp(fase,0,1),T=p.duracao||60/p.fr;
  if(p.id==='cvf') {
    if(f<=p.fi) {
      const u=f/p.fi,v=.4+.6*subida(u),dv=.6*Math.PI*Math.sin(Math.PI*u)/(2*p.fi*T);
      return {volume:v,fluxo:dv*CAPACIDADE_MODELO,inspiracao:subida(u)};
    }
    const t=(f-p.fi)*T,end=Math.exp(-6/.55),dec=Math.exp(-t/.55);
    const v=.2+.8*(dec-end)/(1-end),dv=f===1?0:-.8*dec/(.55*(1-end));
    return {volume:v,fluxo:dv*CAPACIDADE_MODELO,inspiracao:clamp((v-.4)/.6,-.35,1)};
  }
  if(!p.tau) {
    const u=f<=p.fi?f/p.fi:(f-p.fi)/(1-p.fi),s=f<=p.fi?subida(u):1-subida(u);
    return {delta:p.amplitude*s,derivada:(f<=p.fi?1:-1)*p.amplitude*Math.PI*Math.sin(Math.PI*u)/(2*T*(f<=p.fi?p.fi:1-p.fi)),retido:0,inspiracao:s};
  }
  const te=T*(1-p.fi),q=Math.exp(-te/p.tau),retido=p.amplitude*q/(1-q);
  if(f<=p.fi) {
    const u=f/p.fi;
    return {delta:retido+p.amplitude*subida(u),derivada:p.amplitude*Math.PI*Math.sin(Math.PI*u)/(2*p.fi*T),retido,inspiracao:subida(u)};
  }
  const u=(f-p.fi)/(1-p.fi),t=te*subida(u),delta=(retido+p.amplitude)*Math.exp(-t/p.tau);
  return {delta,derivada:-delta/p.tau*Math.PI*Math.sin(Math.PI*u)/2,retido,inspiracao:(delta-retido)/p.amplitude};
}
function estadoBase(p){const r=perfil(0,p);return volumeGlobal(p.pl+r.delta,p.k);}
export function estadoDoPerfil(fase,id='repouso',opc={}) {
  const p=comEstado(id),r=perfil(fase,p),normal=!opc.pneumo||opc.pneumo==='nenhum';
  let e;
  if(id==='repouso') e=estadoRespiratorio(fase,opc);
  else if(!p.tau&&id!=='cvf') {
    const original=estadoRespiratorio(fase,opc),s=p.amplitude/3;
    e={...original,deslocaPleural:original.deslocaPleural*s,palveolar:(opc.palveolar??0)+(original.palveolar-(opc.palveolar??0))*s};
  } else {
    const pl=r.volume!==undefined?-Math.log(1-r.volume*DENOM_GLOBAL)/K_GLOBAL:p.pl+r.delta;
    // P_alv = resistência × fluxo; esforço expiratório ativo na CVF.
    const fluxo=r.fluxo??(volumeGlobal(pl+(opc.palveolar??0),p.k)>=1?0:K_GLOBAL*(p.k/.1)*Math.exp(-K_GLOBAL*(p.k/.1)*(pl+(opc.palveolar??0)))*r.derivada*CAPACIDADE_MODELO/DENOM_GLOBAL);
    const palv=normal?(id==='cvf'?(r.fluxo<0?12*Math.exp(-(fase-p.fi)*8/3):-.8*r.fluxo):-fluxo*4):0;
    e={...opc,palveolar:(opc.palveolar??0)+palv,deslocaPleural:normal?(-pl-PPL_MEDIA_FRC)+palv:0,expansao:r.inspiracao};
  }
  e.kComplacencia=p.k;
  e.expansao*=p.excursao??1;
  const pl=transpulmonar(.5,90,{...e,pneumo:'nenhum'}),volume=r?.volume??volumeGlobal(pl,p.k);
  let fluxo=r.fluxo??K_GLOBAL*(p.k/.1)*Math.exp(-K_GLOBAL*(p.k/.1)*Math.max(0,pl))*r.derivada*CAPACIDADE_MODELO/DENOM_GLOBAL;
  if(fase===0||fase===1||Math.abs(fase-p.fi)<1e-12||volume<=0||volume>=1)fluxo=0;
  if(!normal){const saudavel=estadoDoPerfil(fase,id,{...opc,pneumo:'nenhum'});return {...e,volume:(saudavel.volume+(opc.pneumo==='aberto'?.1:.06))/2,fluxo:saudavel.fluxo/2,inspiracao:p.fi,duracao:duracaoEstado(id),arRetido:r.retido??0};}
  if(p.tau)e.expansao=clamp(.4*Math.max(0,(estadoBase(p)-.4)/.26)+.6*r.inspiracao,0,1);
  return {...e,volume:clamp(volume,0,1),fluxo,inspiracao:p.fi,duracao:duracaoEstado(id),arRetido:r.retido??0};
}
export function volumeRegional(f,grau,e) {return volumeRelativo(transpulmonar(f,grau,e),e.kComplacencia??.1);}
export function ventilacaoDoPerfil(f,grau,id,opc={}) {
  const p=comEstado(id);
  const repouso=estadoDoPerfil(0,id,opc),cheio=estadoDoPerfil(p.fi,id,opc);
  return Math.max(0,volumeRegional(f,grau,cheio)-volumeRegional(f,grau,repouso));
}
export function indicesCVF() {
  const cheio=estadoDoPerfil(.25,'cvf').volume*CAPACIDADE_MODELO;
  const cvf=cheio-estadoDoPerfil(1,'cvf').volume*CAPACIDADE_MODELO;
  const vef1=cheio-estadoDoPerfil(.25+1/8,'cvf').volume*CAPACIDADE_MODELO;
  return {cvf,vef1,razao:vef1/cvf};
}
/* Relógio próprio: não sincroniza um batimento com cada respiração. */
export function contracaoCardiaca(tempo,fc=75) {
  const {rr,sistole}=duracoes(fc),t=((tempo%rr)+rr)%rr;
  return t<sistole?Math.sin(Math.PI*t/sistole)**2:0;
}
