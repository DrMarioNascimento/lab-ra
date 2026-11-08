import {lerConfig,salvarConfig} from './configuracao.js?v=20261107-ra11';
const qualidade=document.getElementById('qualidadeEntrada'),botao=document.getElementById('carregarMaquete'),estado=document.getElementById('estadoCarga');
qualidade.value=lerConfig().qualidade;
botao.onclick=async()=>{
  botao.disabled=qualidade.disabled=true;estado.textContent='Preparando a maquete…';
  try{const c=salvarConfig({...lerConfig(),qualidade:qualidade.value});const {iniciar}=await import('./app.js?v=20261107-ra11');await iniciar(c);}
  catch(e){console.warn('[Bonde] Carregamento:',e);estado.textContent='Não foi possível abrir a maquete. Confira a conexão ou tente a qualidade Econômica.';botao.textContent='Tentar novamente';botao.disabled=false;qualidade.disabled=false;botao.onclick=()=>{salvarConfig({...lerConfig(),qualidade:qualidade.value});location.reload();};}
};
