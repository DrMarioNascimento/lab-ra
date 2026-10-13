/* MOSAICO — telemetria de playtest · A Mesa (05/09/2026)
 * Instrumentacao temporaria: observa cliques, mudancas e erros sem alterar jogabilidade.
 * Usa o canal `acoes` ja autorizado para participantes.
 */
(function(){
'use strict';
let seq=0;
function lim(v,n=180){return String(v==null?'':v).slice(0,n)}
function ctx(){
 const st=window.STATE||{};
 const eu=st.eu||{};
 const codigo=eu.codigo||(st.mesa&&st.mesa.codigo)||'';
 const uid=eu.id||'';
 return {st,eu,codigo,uid};
}
async function registrar(tipo,dados={}){
 const c=ctx();if(!c.codigo||!c.uid)return;
 try{
  if(typeof window.esperarFB!=='function')return;
  const FB=await window.esperarFB();
  if(!FB||typeof FB.gravarServidor!=='function')return;
  await FB.gravarServidor(c.codigo,'acoes',`${c.uid}_tele_${Date.now()}_${(++seq).toString(36)}`,{jogadorId:c.uid,tipo:'telemetria:'+lim(tipo,50),ms:Date.now(),pagina:lim(location.pathname+location.search,240),dados});
  window.__MOSAICO_FIREBASE_OK=Date.now();
 }catch(e){window.__MOSAICO_FIREBASE_ERRO={ms:Date.now(),codigo:e&&e.code||'',mensagem:e&&e.message||String(e)};console.error('MOSAICO TELEMETRIA: Firestore recusou a gravacao',e);}
}
window.MosaicoTelemetria={registrar};
setTimeout(()=>registrar('jogo_carregado'),1200);
document.addEventListener('click',e=>{const b=e.target&&e.target.closest&&e.target.closest('button,a,[data-mod],[data-action]');if(!b)return;registrar('clique',{id:lim(b.id,80),texto:lim((b.innerText||b.textContent||'').replace(/\s+/g,' ').trim(),140),action:lim(b.dataset&&b.dataset.action,60)});},true);
document.addEventListener('change',e=>{const el=e.target;if(!el)return;registrar('mudanca',{id:lim(el.id,80),name:lim(el.name,80),value:lim(el.value,180)});},true);
window.addEventListener('error',e=>registrar('erro_js',{mensagem:lim(e.message,220),arquivo:lim(e.filename,220),linha:e.lineno||0}));
window.addEventListener('unhandledrejection',e=>registrar('promise_rejeitada',{mensagem:lim(e.reason&&e.reason.message||e.reason,220)}));
})();
