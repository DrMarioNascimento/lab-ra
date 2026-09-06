/* Protocolo e ativação de sensor das tarefas do MOSAICO. */
(function (global) {
  "use strict";
  var TS = {};
  TS.alvoMsg = function () {
    var o = location.origin;
    return (o && o !== "null") ? o : "*";
  };
  TS.enviar = function (dados, ctx) {
    ctx = ctx || {};
    if (!ctx.embed) return;
    if (ctx.runId) dados.runId = ctx.runId;
    try { global.parent.postMessage(dados, TS.alvoMsg()); } catch (e) {}
  };
  TS.concluir = function (tempoMs, ctx) {
    TS.enviar({ mosaico: "tarefa-ok", tempoMs: tempoMs }, ctx);
  };
  /* PRONTO: a tarefa ficou jogável — permissão resolvida, calibragem feita.
     Até 02/09/2026 o `enviarStatus` dos módulos só guardava uma variável
     local: os estados que o Documento V8 diz serem "registrados" pela Mesa
     nunca saíam de dentro do iframe. Agora saem, e a Mesa carimba a chegada
     no servidor — é a ponta de largada da duração que pontua.

     Medir daqui, e não da abertura da fase, é o que tira do iPhone o custo da
     permissão, do diálogo do sistema e do oito no ar. */
  TS.status = function (estado, ctx) {
    TS.enviar({ mosaico: "tarefa-status", estado: String(estado || "") }, ctx);
  };

  /* NÃO existe canal de progresso parcial, e é decisão, não esquecimento.
     Cheguei a construí-lo — a tarefa avisava "estou em 4 de 7" — para que
     travar no sexto passo não custasse o mesmo que nunca ter começado. Mario
     decidiu em 02/09/2026 que quem não conclui leva ZERO fragmento, e aí o
     canal não pagava mais nada: sinal disparado no vazio é código morto com
     aparência de vivo, que é justamente o que a auditoria de A Noite proíbe.
     Se um dia o progresso parcial voltar a valer, ele volta aqui. */
  TS.ouvirMesa = function (acoes, ctx) {
    ctx = ctx || {};
    function aoReceber(ev) {
      if (!ctx.embed) return;
      if (ev.source !== global.parent) return;
      var alvo = TS.alvoMsg();
      if (alvo !== "*" && ev.origin !== alvo) return;
      var d = ev.data;
      if (!d || d.mosaico !== "controle-tarefa") return;
      if (String(d.runId == null ? "" : d.runId) !== String(ctx.runId)) return;
      var acao = acoes[d.acao];
      if (typeof acao === "function") acao();
    }
    global.addEventListener("message", aoReceber);
    return function () { global.removeEventListener("message", aoReceber); };
  };
  TS.formatarTempo = function (ms) {
    var totalCent = Math.floor(ms / 10);
    var cent = totalCent % 100;
    var totalSeg = Math.floor(totalCent / 100);
    var seg = totalSeg % 60;
    var min = Math.floor(totalSeg / 60);
    return String(min).padStart(2, "0") + ":" + String(seg).padStart(2, "0") + "," + String(cent).padStart(2, "0");
  };
  TS.ativarOrientacao = function (opcoes) {
    opcoes = opcoes || {};
    var DOE = global.DeviceOrientationEvent;
    var nada = function () {};
    var aoLigar = opcoes.aoLigar || nada;
    var aoNegar = opcoes.aoNegar || nada;
    var aoIndisponivel = opcoes.aoIndisponivel || nada;
    var aoNaoResponder = opcoes.aoNaoResponder || nada;
    var absoluto = opcoes.absoluto !== false;
    function liga() {
      if (absoluto && ("ondeviceorientationabsolute" in global)) global.addEventListener("deviceorientationabsolute", opcoes.aoOrientar, true);
      global.addEventListener("deviceorientation", opcoes.aoOrientar, true);
      aoLigar();
      var espera = opcoes.esperaMs == null ? 1800 : opcoes.esperaMs;
      setTimeout(function () {
        var veio = typeof opcoes.respondeu === "function" ? opcoes.respondeu() : true;
        if (!veio) aoNaoResponder();
      }, espera);
    }
    if (DOE && typeof DOE.requestPermission === "function") {
      var pedido;
      try { pedido = DOE.requestPermission(); } catch (e) { aoNegar(e); return; }
      Promise.resolve(pedido).then(function (s) { if (s === "granted") liga(); else aoNegar(); }).catch(function (e) { aoNegar(e); });
    } else if (DOE) liga(); else aoIndisponivel();
  };
  global.TarefaSensor = TS;

  /* Conteúdo narrativo específico do caso fica separado da engenharia dos
     sensores. Assim futuras correções de iOS não reabrem a realidade canônica. */
  /* O caminho sai do endereço DESTE arquivo, não do documento. Para a Mesa dá
     exatamente a mesma URL — o script mora em v1/js/ e o documento em v1/ —,
     então nada muda hoje. Mas relativo ao documento é o que impede A Noite de
     reaproveitar esta folha: de `v2/modulos/` viraria
     `/Dragon/v2/modulos/js/sensor-…`, um 404 silencioso, e o módulo passaria a
     contar o cânone antigo sem ninguém perceber. Devolver a extração perdida
     começa por aqui. */
  var AQUI = (document.currentScript && document.currentScript.src) ||
    (function(){ var t=document.querySelector('script[src*="tarefa-sensor.js"]'); return t?t.src:location.href })();
  setTimeout(function(){
    if(document.querySelector('script[data-sensor-casa-costa-v2]'))return;
    var s=document.createElement('script');
    s.src=new URL('sensor-casa-da-costa-v2.js?v=20260902-profundidade', AQUI).href;
    s.dataset.sensorCasaCostaV2='1';
    document.head.appendChild(s);
  },0);
})(typeof window !== "undefined" ? window : globalThis);