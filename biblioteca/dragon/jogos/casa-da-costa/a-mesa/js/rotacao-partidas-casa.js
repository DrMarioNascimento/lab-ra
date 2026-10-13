/* Rotação automática das perguntas — Casa da Costa.
   A interface não oferece escolha manual. Cada nova Mesa avança um passo;
   a pergunta gravada na sala permanece congelada para todos os aparelhos. */
(function(global){
  "use strict";
  var ORDEM=["sete","cinco","apagao","nome","corpo","perceber"];
  var CHAVE="mosaico_casa_ultima_partida_mesa";
  function valida(id){return !!(global.CASO&&CASO.partidas&&CASO.partidas[id]);}
  function ultima(){try{var id=localStorage.getItem(CHAVE)||"";return valida(id)?id:"";}catch(e){return "";}}
  function proxima(){var u=ultima(),i=ORDEM.indexOf(u);for(var n=1;n<=ORDEM.length;n++){var id=ORDEM[(i+n+ORDEM.length)%ORDEM.length];if(valida(id))return id;}return (CASO&&CASO.perguntaPadrao)||"sete";}
  function ativa(){var doc=global.STATE&&STATE.doc;if(doc&&valida(doc.partidaId))return doc.partidaId;if(global.STATE&&STATE.mesa&&valida(STATE.partidaId))return STATE.partidaId;return proxima();}
  function p(){return (CASO.partidas||{})[ativa()]||null;}
  function escL(s){return typeof esc==="function"?esc(s):String(s==null?"":s);}
  /* Playtest 05/09: a telemetria usa o mesmo esperarFB da Mesa e grava em acoes. */
  if(!document.querySelector('script[data-telemetria-mesa]')){
    var tele=document.createElement('script');tele.src='telemetria-teste.js?v=20260905-persistencia';tele.dataset.telemetriaMesa='1';document.head.appendChild(tele);
  }
  var inicioAnterior=global.telaInicio;
  global.telaInicio=function(){
    if(!global.CASO||!CASO.partidas)return inicioAnterior();
    var q=p();
    return '<h1>A Casa da Costa</h1><p class="lead">A mesma noite. Os mesmos fatos. Uma nova pergunta.</p><div class="pergunta-mae"><b>'+escL(q.natureza)+' · pergunta-mãe</b><p>'+escL(q.pergunta)+'</p></div>'+avisoLocal()+'<button class="btn btn-ambar" onclick="pedirSenha()">Abrir uma mesa</button><button class="btn btn-frio" onclick="irPara(\'entrar\')">Entrar em uma mesa</button><p class="muted" style="margin-top:24px">O MOSAICO alterna automaticamente a pergunta a cada nova sala. A realidade canônica permanece a mesma.</p>'+modalSenha();
  };
  var criarAnterior=global.criarMesa;
  global.criarMesa=async function(modo){
    var id=proxima();STATE.partidaId=id;await criarAnterior(modo);
    if(STATE.mesa&&STATE.mesa.fb&&STATE.mesa.codigo){try{var FB=await esperarFB();await FB.atualizarMesa(STATE.mesa.codigo,{partidaId:id});if(STATE.doc)STATE.doc.partidaId=id;try{localStorage.setItem(CHAVE,id);}catch(e){}}catch(e){console.error("rotação da pergunta",e);}}
    render(true);
  };
  global.escolherPartidaCasa=function(){return false;};
  /* 11/10/2026: a sala do Firebase (casa-firebase-room-bridge.js) não passa por criarMesa;
     sem isto a rotação ficava presa em "sete". O Mestre grava a próxima ao Iniciar. */
  global.CasaRotacao={proxima:proxima,marcar:function(id){if(!valida(id))return;try{localStorage.setItem(CHAVE,id);}catch(e){}}};
  if(global.CASO&&CASO.partidas&&global.STATE&&!STATE.mesa&&!STATE.doc){STATE.partidaId=proxima();if(typeof render==="function")render(true);}
})(window);
