import {lerConfig,salvarConfig,novaEntrada,registrarEntrada} from './configuracao.js?v=20261107-ra12';
const qualidade=document.getElementById('qualidadeEntrada'),botao=document.getElementById('carregarMaquete'),estado=document.getElementById('estadoCarga');
const caixa=document.getElementById('qualidadeCaixa');
// Marca a carga antes de começar; se a página travar/fechar no meio, a próxima abertura usa a Econômica.
const CHAVE='bonde-carga-pendente-pc';
const marcar=v=>{try{v?localStorage.setItem(CHAVE,String(Date.now())):localStorage.removeItem(CHAVE);}catch{}};
let travou=false;try{travou=!!localStorage.getItem(CHAVE);}catch{}
qualidade.value=lerConfig().qualidade;
if(travou&&qualidade.value!=='economica'){
  qualidade.value='economica';if(caixa)caixa.open=true;
  estado.textContent='A última abertura não terminou. Para proteger o aparelho, a qualidade Econômica foi escolhida. Você pode mudar abaixo.';
}
botao.onclick=async()=>{
  botao.disabled=qualidade.disabled=true;estado.textContent='Preparando a maquete…';marcar(true);
  try{const c=novaEntrada({...lerConfig(),qualidade:qualidade.value});const {iniciar}=await import('./app.js?v=20261108-ra14');await iniciar(c);registrarEntrada(c);
    // Só considera a abertura concluída depois de alguns segundos desenhando a cena.
    setTimeout(()=>marcar(false),8000);}
  catch(e){marcar(false);console.warn('[Bonde] Carregamento:',e);estado.textContent='Não foi possível abrir a maquete. Confira a conexão ou tente a qualidade Econômica.';if(caixa)caixa.open=true;botao.textContent='Tentar novamente';botao.disabled=false;qualidade.disabled=false;botao.onclick=()=>{salvarConfig({...lerConfig(),qualidade:qualidade.value});location.reload();};}
};
