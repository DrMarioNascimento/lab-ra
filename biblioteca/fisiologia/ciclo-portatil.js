/* Arquivos públicos animados: ativação no mesmo gesto, sem conversão no telefone. */
export function instalarCicloPortatil({experiencia,nivel=()=>1,niveis,nota='Ciclo demonstrativo em câmera lenta. Os ajustes da simulação não modificam este arquivo.'}){
 const host=document.querySelector('#panel-ra')||document.querySelector('#visualizacaoRA')||document.querySelector('main')||document.body;
 const box=document.createElement('details');box.className='ra-ciclo-portatil';
 const summary=document.createElement('summary');summary.textContent='Ciclo em movimento · iPhone e Android';
 const text=document.createElement('p');text.textContent=nota;
 const select=document.createElement('select');select.setAttribute('aria-label','Ciclo para realidade aumentada');
 for(const n of niveis){const o=document.createElement('option');o.value=n;o.textContent='Nível '+String(n).padStart(2,'0');select.append(o);}
 const version=document.createElement('select');version.setAttribute('aria-label','Versão do ciclo');for(const [value,label] of [['publicada','Versão leve publicada'],['local','Protótipo local do Lab-RA']]){const option=document.createElement('option');option.value=value;option.textContent=label;version.append(option);}
 const origin=document.createElement('p');origin.textContent='A versão leve usa o ciclo publicado em Fisiologia Interativa. O protótipo local continua disponível na outra opção.';
 const prepare=document.createElement('button');prepare.type='button';prepare.textContent='Preparar ciclo em RA';
 const launch=document.createElement('button');launch.type='button';launch.textContent='Abrir ciclo em realidade aumentada';launch.disabled=true;
 const message=document.createElement('p');message.setAttribute('role','status');message.textContent='Escolha o ciclo e prepare a visualização.';
 const viewer=document.createElement('model-viewer');viewer.setAttribute('camera-controls','');viewer.setAttribute('autoplay','');viewer.setAttribute('ar','');viewer.dataset.raPlacas='1';viewer.setAttribute('ar-modes','webxr quick-look');viewer.setAttribute('loading','eager');viewer.setAttribute('reveal','auto');viewer.setAttribute('alt','Ciclo didático em movimento');viewer.style.cssText='width:100%;height:280px;background:#0a1520;border-radius:16px';viewer.hidden=true;
 const preview=document.createElement('button');preview.type='button';preview.textContent='Carregar prévia 3D';preview.hidden=true;
 const play=document.createElement('button');play.type='button';play.textContent='Pausar prévia';play.hidden=true;
 let links=null,ticket=0,playing=true,ready=false;
 const ios=/iPad|iPhone|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
 function limpar(){preview.hidden=true;preview.disabled=false;++ticket;ready=false;links=null;launch.disabled=true;viewer.hidden=true;viewer.removeAttribute('src');viewer.removeAttribute('ios-src');play.hidden=true;message.textContent='Prepare o ciclo selecionado.';}
 box.addEventListener('toggle',()=>{if(box.open){const n=nivel();if(niveis.includes(n)&&!links)select.value=n;}});
 select.onchange=limpar;version.onchange=limpar;
 prepare.onclick=async()=>{
  limpar();const id=ticket,n=Number(select.value);
  const deliveryBase=version.value==='local'?import.meta.url:'https://fisiologia.drmarionascimento.com.br/ra/ciclo-portatil.js';
  const glb=new URL('./'+experiencia+'/ciclos/nivel-'+n+'.glb',deliveryBase).href;
  const usdz=new URL('./'+experiencia+'/ciclos/nivel-'+n+'.usdz',deliveryBase).href;
  message.textContent='Conferindo os arquivos do ciclo…';
  try{
   const result=await Promise.all([fetch(ios?usdz:glb,{method:'HEAD'})]);
   if(id!==ticket)return;if(result.some(r=>!r.ok))throw Error('arquivo ausente');
   const bytes=Number(result[0].headers?.get?.('content-length'))||0,tamanho=bytes>0?' Arquivo de '+(bytes/1048576).toFixed(bytes>=10485760?0:1).replace('.',',')+' MB'+(bytes>15728640?'; em rede lenta pode demorar alguns minutos.':'.'):'';
   links={glb,usdz};viewer.setAttribute('ios-src',usdz);if(ios){preview.hidden=false;}else{viewer.hidden=false;viewer.setAttribute('src',glb);}
   launch.disabled=!ios;message.textContent=(ios?'Pronto para abrir no iPhone. A prévia 3D é opcional e só será baixada se você pedir.':'Carregando o ciclo. Aguarde a liberação do botão.')+tamanho;
  }catch{if(id===ticket)message.textContent='Não foi possível carregar o ciclo. Confira a conexão e tente novamente.';}
 };
 preview.onclick=()=>{if(!links)return;preview.disabled=true;viewer.hidden=false;viewer.setAttribute('src',links.glb);};
 viewer.addEventListener('load',()=>{if(!links||viewer.getAttribute('src')!==links.glb)return;preview.hidden=true;ready=true;playing=true;play.hidden=false;play.textContent='Pausar prévia';viewer.play();launch.disabled=!ios&&!viewer.canActivateAR;message.textContent=ios||viewer.canActivateAR?'Pronto. O movimento e os textos em relevo fazem parte do modelo.':'Ciclo pronto para explorar aqui. A câmera requer Safari no iPhone ou Chrome no Android com RA compatível.';});
 viewer.addEventListener('error',()=>{preview.disabled=false;if(!links)return;ready=false;launch.disabled=!ios;message.textContent=ios?'A prévia não carregou. O arquivo do iPhone continua disponível pelo botão.':'A prévia não carregou. Prepare o ciclo novamente.';});
 play.onclick=()=>{playing=!playing;playing?viewer.play():viewer.pause();play.textContent=playing?'Pausar prévia':'Continuar prévia';};
 launch.onclick=()=>{
  if(!links)return;
  if(ios){let doc=document;try{if(top.document)doc=top.document;}catch{}const a=doc.createElement('a');a.rel='ar';a.href=links.usdz;a.append(doc.createElement('img'));a.style.display='none';doc.body.append(a);a.click();setTimeout(()=>a.remove(),4000);return;}
  if(!ready||!viewer.canActivateAR)return;
  viewer.play();try{const p=viewer.activateAR();p?.catch(()=>message.textContent='A câmera não abriu. Confira a permissão e tente novamente.');}catch{message.textContent='A câmera não abriu. Confira a permissão e tente novamente.';}
 };
 viewer.addEventListener('ar-status',e=>{if(['session-started','object-placed'].includes(e.detail?.status))viewer.play();else if(e.detail?.status==='not-presenting'&&!playing)viewer.pause();});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)viewer.pause();else if(playing&&box.open&&ready)viewer.play();});
 box.append(summary,text,version,origin,select,prepare,launch,message,preview,play,viewer);host.append(box);
 const style=document.createElement('style');style.textContent='.ra-ciclo-portatil{margin:16px 0;padding:18px;border:1px solid #678d9c;border-radius:22px;background:linear-gradient(145deg,#233d50,#102330);box-shadow:inset 0 2px 2px #ffffff20,0 5px 15px #0005;color:#edf5f7}.ra-ciclo-portatil summary{font-weight:700;cursor:pointer}.ra-ciclo-portatil button,.ra-ciclo-portatil select{margin:6px;padding:10px 14px;border-radius:12px;min-height:44px}.ra-ciclo-portatil p{line-height:1.45}';document.head.append(style);
 return {limpar};
}

