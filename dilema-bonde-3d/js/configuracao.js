export const PAPEIS={trabalhador:'Trabalhadores',idoso:'Idosos',gestante:'Gestantes',criancas:'Crianças',estudante:'Estudantes',cientista:'Cientistas',colega:'Colegas de turma',vinculo:'Vínculos afetivos',desconhecidos:'Desconhecidos'};
export const PADRAO=Object.freeze({modo:'livre',principal:'trabalhador',ramal:'desconhecidos',nPrincipal:1,nRamal:3,tempo:10,pressao:false,velocidade:12,loop:false,som:false,volume:35,humor:false,rotulos:true,movimentoReduzido:false,qualidade:'auto'});
const limite=(v,a,b,d)=>Number.isFinite(Number(v))?Math.min(b,Math.max(a,Number(v))):d;
export function normalizar(c={}) {
  const r={...PADRAO};
  for(const k of ['loop','som','humor','rotulos','movimentoReduzido','pressao'])if(typeof c[k]==='boolean')r[k]=c[k];
  r.modo=c.modo==='classico'?'classico':'livre';
  for(const k of ['principal','ramal'])if(Object.hasOwn(PAPEIS,c[k]))r[k]=c[k];
  for(const [k,a,b] of [['nPrincipal',1,5],['nRamal',0,5],['tempo',0,60],['velocidade',6,24],['volume',0,100]])r[k]=Math.round(limite(c[k]??r[k],a,b,r[k]));
  if(['auto','economica','equilibrada','detalhada'].includes(c.qualidade))r.qualidade=c.qualidade;
  if(r.modo==='classico')Object.assign(r,{principal:'desconhecidos',ramal:'desconhecidos',nPrincipal:3,nRamal:1});
  return r;
}
export function lerConfig(){try{return normalizar(JSON.parse(localStorage.getItem('bonde-config-ra11')||'{}'));}catch{return normalizar();}}
export function salvarConfig(c){const r=normalizar(c);try{localStorage.setItem('bonde-config-ra11',JSON.stringify(r));}catch{}return r;}
export function grupos(c){return {presetPrincipal:c.principal,nPrincipal:c.nPrincipal,presetRamal:c.ramal,nRamal:c.nRamal};}
export function sortear(c){const p=Object.keys(PAPEIS).filter(p=>p!==c.principal&&p!==c.ramal);return normalizar({...c,principal:p.splice(Math.floor(Math.random()*p.length),1)[0],ramal:p[Math.floor(Math.random()*p.length)]});}
export function mudaRodada(a,b){return ['modo','principal','ramal','nPrincipal','nRamal','tempo','pressao','velocidade'].some(k=>a[k]!==b[k]);}
