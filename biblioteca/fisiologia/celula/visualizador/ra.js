/* Public, prebuilt assets: native viewers cannot fetch this page's blob URLs. */
export function nativePlatform(nav=navigator){
 if(/iPad|iPhone|iPod/.test(nav.userAgent)||(nav.platform==='MacIntel'&&nav.maxTouchPoints>1))return 'ios';
 return /Android/i.test(nav.userAgent)?'android':'web';
}
export function arLinks(base,variant='completa'){
 if(!['completa','sem-membrana-celular','sem-membranas-mitocondriais','sem-membranas'].includes(variant))variant='completa';
 const glb=new URL('./celula-v3-'+variant+'.glb',base).href,usdz=new URL('./celula-v3-'+variant+'.usdz',base).href;
 return {glb:glb+'?v=volume-20261025',usdz:usdz+'?v=volume-20261025'};
}
export function configureAR({getVariant=()=> 'completa',subscribe=()=>{},onPresenting=()=>{}}={}){
 const prepare=document.getElementById('prepare-ar'),launch=document.getElementById('launch-ar'),viewer=document.getElementById('cell-ar'),status=document.getElementById('ar-state');
 const platform=nativePlatform();let links=arLinks(location.href,getVariant()),ready=false,failedLoad=false,retry=0,requestedSrc='';
 viewer.setAttribute('ios-src',links.usdz);
 viewer.setAttribute('ar-modes','webxr scene-viewer quick-look');
 viewer.setAttribute('loading','eager');viewer.setAttribute('reveal','auto');
 launch.disabled=platform!=='ios';
 status.textContent=platform==='ios'?'Toque para colocar a célula no ambiente com a câmera do iPhone ou iPad.':'Explore em 3D aqui. Para colocar a célula no ambiente, abra esta página no iPhone ou Android.';
 function prepareModel(){
  ready=false;viewer.hidden=false;
  if(platform!=='ios'){launch.disabled=true;launch.textContent='Preparando realidade aumentada…';}
  requestedSrc=links.glb+(failedLoad?'&retry='+ ++retry:'');failedLoad=false;
  viewer.setAttribute('src',requestedSrc);
  status.textContent='Carregando a célula para RA. Aguarde o botão Abrir em realidade aumentada ficar disponível.';
 }
 subscribe(()=>{
  links=arLinks(location.href,getVariant());viewer.setAttribute('ios-src',links.usdz);
  if(!viewer.hidden)prepareModel();
  else status.textContent='Escolha atualizada. A RA abrirá com as membranas que você escolheu mostrar. O corte do núcleo é exclusivo da página.';
 });
 function openIOS(){
  let doc=document;
  try{if(window.top.document)doc=window.top.document;}catch{}
  const link=doc.createElement('a');link.href=links.usdz;link.rel='ar';
  const img=doc.createElement('img');img.alt='Célula viva';link.append(img);
  link.style.display='none';doc.body.append(link);link.click();setTimeout(()=>link.remove(),4000);
 }
 function failed(){
  onPresenting(false);
  status.textContent='A RA não abriu. No Android, use o Chrome e confira a permissão da câmera. Você pode tentar novamente pelo botão.';
 }
 // Like Película/Travessias: prepared viewer + synchronous activation from the tap.
 // iOS keeps its proven direct USDZ path and does not depend on WebGL loading.
 launch.onclick=()=>{
  if(platform==='ios'){openIOS();return;}
  if(!ready||!viewer.canActivateAR)return;
  try{const result=viewer.activateAR();if(result?.catch)result.catch(failed);}catch{failed();}
 };
 prepare.onclick=()=>{
  if(ready){viewer.hidden=false;return;}
  prepareModel();
 };
 viewer.addEventListener('load',(event={})=>{
  if(event.detail?.url && String(event.detail.url)!==requestedSrc)return;
  if(viewer.getAttribute('src')!==requestedSrc)return;
  ready=true;launch.textContent='Abrir em realidade aumentada';
  if(platform!=='ios')launch.disabled=!viewer.canActivateAR;
  status.textContent=platform==='ios'||viewer.canActivateAR
   ?'Pronto. Toque em Abrir em realidade aumentada. A escolha das membranas e a animação foram preservadas.'
   :'Modelo pronto. Este navegador não oferece RA. No Android, abra esta página no Chrome; no iPhone, use o Safari.';
 });
 viewer.addEventListener('error',()=>{
  ready=false;failedLoad=true;launch.textContent='Abrir em realidade aumentada';if(platform!=='ios')launch.disabled=true;
  status.textContent=platform==='ios'?'A prévia não carregou. Você ainda pode abrir a RA pelo botão no iPhone.':'A célula não carregou para RA. Confira a conexão e toque em Preparar realidade aumentada para tentar novamente.';
 });
 viewer.addEventListener('ar-status',event=>{
  const state=event.detail?.status;
  if(state==='failed'){failed();return;}
  if(state==='session-started'||state==='object-placed')onPresenting(true);
  if(state==='not-presenting')onPresenting(false);
 });
 if(platform==='android'){
  prepare.textContent='Preparar realidade aumentada';
  prepareModel();
 }
}
