import {mudaRodada} from './configuracao.js?v=20261107-ra12';
import {criarRodada} from './rodada.js?v=20261107-ra12';
import {criarMenu} from './menu.js?v=20261107-ra12';
import {criarSom} from './som.js?v=20261107-ra12';
export function ligarInterface({m,config,pai,modo='pc',status=()=>{},aoMenu=()=>{},aoConfig=()=>{}}){
  const $=id=>document.getElementById(id);let menu,continuar=false,travadoAnterior=false;
  const som=criarSom(()=>rodada.config());
  function sincronizar(e){
    if(e.travado&&!travadoAnterior)status('O bonde passou pela agulha. A decisão está tomada.');travadoAnterior=e.travado;
    $('manter').classList.toggle('ativo',e.rota==='principal');$('desviar').classList.toggle('ativo',e.rota==='ramal');
    $('manter').disabled=$('desviar').disabled=e.bloqueada||e.ocupada||e.travado||e.fase==='resultado';
    $('play').disabled=e.bloqueada||e.ocupada||e.fase==='resultado';if($('reset'))$('reset').disabled=e.bloqueada||e.ocupada;
    const andamento=['contagem','percurso'].includes(e.fase)&&!e.pausada;
    $('play').textContent=andamento?'Ⅱ':'▶';$('play').setAttribute('aria-label',andamento?'Pausar':e.fase==='pronta'?'Partir':'Continuar');
    $('crono').textContent=e.pausada?'Ⅱ':String(e.tempo);
  }
  const rodada=criarRodada(m,config,{aoMudar:sincronizar,aoResultado:r=>menu.resultado(r),som:som.tocar});
  const nova=async(c,{aleatorio=false}={})=>{await rodada.nova(c,{aleatorio});menu.limparResultado();aoConfig(rodada.config());status('Nova rodada. Escolha o trilho e toque em Partir.');};
  menu=criarMenu({pai,modo,config:rodada.config,aplicar:async c=>{const nova=mudaRodada(rodada.config(),c);await rodada.ajustar(c);if(nova)menu.limparResultado();aoConfig(rodada.config());status('Ajustes aplicados.');},aoAbrir:()=>{rodada.bloquear('menu',true);aoMenu(true);},aoFechar:()=>{rodada.bloquear('menu',false);aoMenu(false);if(continuar){continuar=false;rodada.play();}},novaRodada:async()=>{await nova(rodada.config(),{aleatorio:rodada.config().modo==='livre'});continuar=rodada.config().loop;}});
  $('manter').onclick=()=>rodada.escolher('principal');$('desviar').onclick=()=>rodada.escolher('ramal');
  $('play').onclick=()=>{rodada.play();status(rodada.estado().pausada?'Rodada pausada.':'Decida antes de o bonde passar pela agulha.');};
  if($('reset'))$('reset').onclick=async()=>{try{await nova(rodada.config(),{aleatorio:rodada.config().modo==='livre'});}catch{status('Não foi possível trocar os personagens. Tente novamente.');}};
  sincronizar(rodada.estado());
  return {rodada,menu,escolher:rota=>rodada.escolher(rota),sincronizar:()=>sincronizar(rodada.estado()),desligar:()=>{menu.remover();som.fechar();}};
}
