/* A RA nativa do iPhone não precisa baixar a prévia GLB primeiro. */
export function deferPreview(nav=navigator){
 const ios=/iPad|iPhone|iPod/.test(nav.userAgent)||(nav.platform==='MacIntel'&&nav.maxTouchPoints>1);
 const connection=nav.connection||nav.mozConnection||nav.webkitConnection;
 return ios||Boolean(connection?.saveData)||['slow-2g','2g'].includes(connection?.effectiveType);
}
export function optionalPreview({container,load,status,getVariant=()=>'completa',subscribe=()=>{}}){
 const button=document.createElement('button');button.type='button';button.textContent='Carregar prévia 3D';
 button.style.cssText='position:absolute;z-index:2;left:12px;right:12px;bottom:16px;width:calc(100% - 24px);max-width:320px;margin:0 auto;padding:12px 18px;min-height:44px;border-radius:12px';
 const poster=document.createElement('img');poster.alt='Prévia da célula humana';poster.className='cell-poster';
 const update=()=>poster.src='./celula-v3-'+getVariant()+'.webp';update();subscribe(update);container.append(poster,button);
 status.textContent='A prévia 3D é opcional. No iPhone, você pode abrir diretamente a realidade aumentada.';
 let loading=false;
 button.onclick=async()=>{if(loading)return;loading=true;button.disabled=true;
  try{await load();poster.remove();button.remove();}
  catch(error){loading=false;button.disabled=false;button.textContent='Tentar carregar a prévia';status.textContent='A prévia não carregou. Confira a conexão e tente novamente.';console.warn(error);}
 };
 return button;
}
