export const PAPEIS={trabalhador:'Trabalhadores',idoso:'Idosos',gestante:'Gestantes',criancas:'Crianças',estudante:'Estudantes',cientista:'Cientistas',colega:'Colegas de turma',vinculo:'Vínculos afetivos',desconhecidos:'Desconhecidos'};
export const SINGULAR={trabalhador:'Trabalhador',idoso:'Idoso',gestante:'Gestante',criancas:'Criança',estudante:'Estudante',cientista:'Cientista',colega:'Colega de turma',vinculo:'Vínculo afetivo',desconhecidos:'Desconhecido'};
export function nomeGrupo(papel,n){return (n===1?SINGULAR:PAPEIS)[papel]||'';}
export function textoGrupo(papel,n){return n===0?'Ramal livre':n+' '+nomeGrupo(papel,n);}
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
export function sortear(c,{quantidades=false,random=Math.random}={}){
  c=normalizar(c);if(c.modo==='classico')return c;
  const escolher=lista=>lista.splice(Math.min(lista.length-1,Math.floor(random()*lista.length)),1)[0];
  const p=Object.keys(PAPEIS).filter(p=>p!==c.principal&&p!==c.ramal);
  const novo={...c,principal:escolher(p),ramal:escolher(p)};
  if(quantidades)for(const k of ['nPrincipal','nRamal'])novo[k]=escolher([1,2,3,4,5].filter(n=>n!==c[k]));
  return normalizar(novo);
}
// As preferências permanecem; a nova entrada varia os grupos e as quantidades.
// Registrar só depois da carga bem-sucedida evita consumir a rodada numa falha.
export function novaEntrada(base=lerConfig(),anteriorAtual=null){
  const c=normalizar(base);let anterior=anteriorAtual?normalizar(anteriorAtual):c;
  if(!anteriorAtual)try{anterior=normalizar(JSON.parse(localStorage.getItem('bonde-ultima-entrada-ra12')||'null')||c);}catch{}
  return sortear({...c,principal:anterior.principal,ramal:anterior.ramal,nPrincipal:anterior.nPrincipal,nRamal:anterior.nRamal},{quantidades:true});
}
export function registrarEntrada(c){try{localStorage.setItem('bonde-ultima-entrada-ra12',JSON.stringify(normalizar(c)));}catch{}return salvarConfig(c);}
export function mudaRodada(a,b){return ['modo','principal','ramal','nPrincipal','nRamal','tempo','pressao','velocidade'].some(k=>a[k]!==b[k]);}
