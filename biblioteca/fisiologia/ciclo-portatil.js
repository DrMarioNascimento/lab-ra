/* Arquivos públicos animados: ativação no mesmo gesto, sem conversão no telefone. */
export function instalarCicloPortatil({experiencia,nivel=()=>1,niveis,nota='Ciclo demonstrativo em câmera lenta. Os ajustes da simulação não modificam este arquivo.'}){
 const host=document.querySelector('#panel-ra')||document.querySelector('#visualizacaoRA')||document.querySelector('main')||document.body;
 const box=document.createElement('details');box.className='ra-ciclo-portatil';
 const summary=document.createElement('summary');summary.textContent='Ciclo em movimento · iPhone e Android';
 const text=document.createElement('p');text.textContent=nota;
 const select=document.createElement('select');select.setAttribute('aria-label','Ciclo para realidade aumentada');
 for(const n of niveis){const o=document.createElement('option');o.value=n;o.textContent='Nível '+String(n).padStart(2,'0');select.append(o);}
 const prepare=document.createElement('button');prepare.type='button';prepare.textContent='Preparar ciclo em RA';
 const launch=document.createElement('button');launch.type='button';launch.textContent='Abrir ciclo em realidade aumentada';launch.disabled=true;
 const message=document.createElement('p');message.setAttribute('role','status');message.textContent='Escolha o ciclo e prepare a visualização.';
 const viewer=document.createElement('model-viewer');viewer.setAttribute('camera-controls','');viewer.setAttribute('autoplay','');viewer.setAttribute('ar','');viewer.dataset.raPlacas='1';viewer.setAttribute('ar-modes','webxr quick-look');viewer.setAttribute('loading','eager');viewer.setAttribute('reveal','auto');viewer.setAttribute('alt','Ciclo didático em movimento');viewer.style.cssText='width:100%;height:280px;background:#0a1520;border-radius:16px';viewer.hidden=true;
 const play=document.createElement('button');play.type='button';play.textContent='Pausar prévia';play.hidden=true;
 let links=null,ticket=0,playing=true,ready=false;
 const ios=/iPad|iPhone|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
 function limpar(){++ticket;ready=false;links=null;launch.disabled=true;viewer.hidden=true;viewer.removeAttribute('src');viewer.removeAttribute('ios-src');play.hidden=true;message.textContent='Prepare o ciclo selecionado.';}
 box.addEventListener('toggle',()=>{if(box.open){const n=nivel();if(niveis.includes(n)&&!links)select.value=n;}});
 select.onchange=limpar;
 prepare.onclick=async()=>{
  limpar();const id=ticket,n=Number(select.value);
  const glb=new URL('./'+experiencia+'/ciclos/nivel-'+n+'.glb',import.meta.url).href;
  const usdz=new URL('./'+experiencia+'/ciclos/nivel-'+n+'.usdz',import.meta.url).href;
  message.textContent='Conferindo os arquivos do ciclo…';
  try{
   const result=await Promise.all([fetch(glb,{method:'HEAD'}),fetch(usdz,{method:'HEAD'})]);
   if(id!==ticket)return;if(result.some(r=>!r.ok))throw Error('arquivo ausente');
   links={glb,usdz};viewer.setAttribute('ios-src',usdz);viewer.hidden=false;viewer.setAttribute('src',glb);
   launch.disabled=!ios;message.textContent=ios?'Pronto para abrir no iPhone. A prévia pode levar alguns segundos.':'Carregando o ciclo. Aguarde a liberação do botão.';
  }catch{if(id===ticket)message.textContent='Não foi possível carregar o ciclo. Confira a conexão e tente novamente.';}
 };
 viewer.addEventListener('load',()=>{if(!links||viewer.getAttribute('src')!==links.glb)return;ready=true;playing=true;play.hidden=false;play.textContent='Pausar prévia';viewer.play();launch.disabled=!ios&&!viewer.canActivateAR;message.textContent=ios||viewer.canActivateAR?'Pronto. O movimento e os textos em relevo fazem parte do modelo.':'Ciclo pronto para explorar aqui. A câmera requer Safari no iPhone ou Chrome no Android com RA compatível.';});
 viewer.addEventListener('error',()=>{if(!links)return;ready=false;launch.disabled=!ios;message.textContent=ios?'A prévia não carregou. O arquivo do iPhone continua disponível pelo botão.':'A prévia não carregou. Prepare o ciclo novamente.';});
 play.onclick=()=>{playing=!playing;playing?viewer.play():viewer.pause();play.textContent=playing?'Pausar prévia':'Continuar prévia';};
 launch.onclick=()=>{
  if(!links)return;
  if(ios){let doc=document;try{if(top.document)doc=top.document;}catch{}const a=doc.createElement('a');a.rel='ar';a.href=links.usdz;a.append(doc.createElement('img'));a.style.display='none';doc.body.append(a);a.click();setTimeout(()=>a.remove(),4000);return;}
  if(!ready||!viewer.canActivateAR)return;
  viewer.play();try{const p=viewer.activateAR();p?.catch(()=>message.textContent='A câmera não abriu. Confira a permissão e tente novamente.');}catch{message.textContent='A câmera não abriu. Confira a permissão e tente novamente.';}
 };
 viewer.addEventListener('ar-status',e=>{if(['session-started','object-placed'].includes(e.detail?.status))viewer.play();else if(e.detail?.status==='not-presenting'&&!playing)viewer.pause();});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)viewer.pause();else if(playing&&box.open&&ready)viewer.play();});
 box.append(summary,text,select,prepare,launch,message,play,viewer);host.append(box);
 const style=document.createElement('style');style.textContent='.ra-ciclo-portatil{margin:16px 0;padding:18px;border:1px solid #678d9c;border-radius:22px;background:linear-gradient(145deg,#233d50,#102330);box-shadow:inset 0 2px 2px #ffffff20,0 5px 15px #0005;color:#edf5f7}.ra-ciclo-portatil summary{font-weight:700;cursor:pointer}.ra-ciclo-portatil button,.ra-ciclo-portatil select{margin:6px;padding:10px 14px;border-radius:12px;min-height:44px}.ra-ciclo-portatil p{line-height:1.45}';document.head.append(style);
 instalarVer3D();
 return {limpar};
}

/* Ver em 3D: o mesmo visualizador da página ampliado para a tela inteira, para
   o aparelho que não tem RA. No Android isso é comum: sem o "Google Play
   Services para RA" certificado, o botão de RA leva à Play Store e a loja diz
   que o app "só está disponível para seus outros dispositivos" (visto num
   teste do Mario em 2026-10-25). A página não consegue saber disso antes.
   A ampliação é por sobreposição fixa, e não pela API de tela cheia, porque o
   Safari do iPhone não amplia elementos que não sejam vídeo. O visualizador é
   MOVIDO para a sobreposição e devolvido ao fechar: um cartão com
   backdrop-filter prenderia um position:fixed dentro dele. */
const ANDROID=/Android/i.test(navigator.userAgent);
let instalado=false;
function instalarVer3D(){
 if(instalado)return;instalado=true;
 const camada=document.createElement('div');camada.className='ra-ver3d';camada.hidden=true;camada.setAttribute('role','dialog');camada.setAttribute('aria-label','Modelo em 3D na tela inteira');
 const fechar=document.createElement('button');fechar.type='button';fechar.className='ra-ver3d-fechar';fechar.textContent='Fechar 3D';
 const dica=document.createElement('p');dica.className='ra-ver3d-dica';dica.textContent='Arraste para girar · pinça para aproximar';
 camada.append(fechar,dica);document.body.append(camada);
 let aberto=null;
 function sair(){
  if(!aberto)return;const {viewer,pai,proximo,css}=aberto;aberto=null;
  pai.insertBefore(viewer,proximo);viewer.style.cssText=css;camada.hidden=true;document.documentElement.classList.remove('ra-ver3d-ativo');
 }
 function entrar(viewer){
  if(aberto||!viewer.getAttribute('src'))return;
  aberto={viewer,pai:viewer.parentNode,proximo:viewer.nextSibling,css:viewer.style.cssText};
  camada.insertBefore(viewer,dica);viewer.style.cssText='position:absolute;inset:0;width:100%;height:100%;background:#0a1520';
  camada.hidden=false;document.documentElement.classList.add('ra-ver3d-ativo');fechar.focus();
  if(viewer.hasAttribute('autoplay'))viewer.play?.();
 }
 fechar.onclick=sair;document.addEventListener('keydown',e=>{if(e.key==='Escape')sair();});
 for(const viewer of document.querySelectorAll('model-viewer[ar]')){
  const barra=document.createElement('div');barra.className='ra-ver3d-barra';
  const botao=document.createElement('button');botao.type='button';botao.className='button';botao.textContent='Ver em 3D · tela cheia';
  const pronto=()=>{botao.disabled=!viewer.getAttribute('src');barra.hidden=viewer.hidden;};
  new MutationObserver(pronto).observe(viewer,{attributes:true,attributeFilter:['src','hidden']});pronto();
  botao.onclick=()=>entrar(viewer);barra.append(botao);
  if(ANDROID){
   const aviso=document.createElement('p');aviso.className='ra-ver3d-aviso';
   aviso.append('No Android, a câmera só abre em aparelhos compatíveis com a RA do Google. Se o botão de RA levar à Play Store dizendo que o app só está disponível para outros dispositivos, este aparelho não tem RA: use Ver em 3D. ');
   const lista=document.createElement('a');lista.href='https://developers.google.com/ar/devices';lista.target='_blank';lista.rel='noopener noreferrer';lista.textContent='Aparelhos compatíveis';
   aviso.append(lista,'.');barra.append(aviso);
  }
  viewer.after(barra);
 }
 const style=document.createElement('style');style.textContent='.ra-ver3d{position:fixed;inset:0;z-index:2147483000;background:#0a1520}.ra-ver3d[hidden],.ra-ver3d-barra[hidden]{display:none}.ra-ver3d-fechar{position:absolute;top:max(12px,env(safe-area-inset-top));right:12px;z-index:2;min-height:44px;padding:10px 16px;border-radius:12px;border:1px solid #678d9c;background:#233d50;color:#edf5f7;font:inherit;font-weight:700}.ra-ver3d-dica{position:absolute;left:0;right:0;bottom:max(12px,env(safe-area-inset-bottom));z-index:2;margin:0;text-align:center;color:#c9d6dc;font-size:14px;pointer-events:none}html.ra-ver3d-ativo,html.ra-ver3d-ativo body{overflow:hidden}.ra-ver3d-barra{margin:8px 0}.ra-ver3d-barra button{min-height:44px;padding:10px 14px;border-radius:12px}.ra-ver3d-aviso{margin:8px 0 0;font-size:14px;line-height:1.45;color:#c9d6dc}.ra-ver3d-aviso a{color:#ffd75e}';document.head.append(style);
}

