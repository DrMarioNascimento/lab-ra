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
  /* Soft deadline por item (50s): sem giroscópio / travado no gesto não pode
     segurar a sala. Quem estoura conclui com o que tiver — “sem precisão”. */
  TS.SOFT_DEADLINE_MS = 50000;
  /* Same 1+1 tokens as v1/css/profundidade-1mais1.css / papel-camada.js.
     Sensor iframes do not load the picker, so they inject the language here. */
  TS.injetarProfundidade1mais1 = function () {
    var doc = global.document;
    if (!doc || !doc.createElement || doc.getElementById("mosaico-pf-1mais1")) return;
    var st = doc.createElement("style");
    st.id = "mosaico-pf-1mais1";
    st.textContent = [
      ":root{--pf-navy:#0e1c28;--pf-stroke:rgba(159,228,255,.52);--pf-gold:#e8a94a;--pf-gold2:#ffc46b;--pf-gold-face:#ffc878;--pf-gold-base:#d6aa58;--pf-gold-wall:#6a3712;--pf-ink:#f4f9fd;--pf-ink-2:#dfeaf5;--pf-muted:#c5d4dc;--pf-alias:#ffcf8f;--pf-card-fill:linear-gradient(165deg,#1a3348,#153044 60%,#102838);--pf-card-shadow:inset 0 1px 0 rgba(255,255,255,.10),0 18px 50px rgba(0,0,0,.55),0 0 40px rgba(127,212,255,.10);--pf-inset-fill:#03080d;--pf-inset-stroke:rgba(20,36,48,.95);--pf-inset-shadow:inset 0 3px 10px rgba(0,0,0,.72),inset 2px 0 6px rgba(0,0,0,.45)}",
      ".pf-card{background:var(--pf-card-fill);border:1px solid var(--pf-stroke);border-radius:14px;box-shadow:var(--pf-card-shadow)}",
      ".pf-inset{background:var(--pf-inset-fill);border:1px solid var(--pf-inset-stroke);border-left:4px solid #6aa8ca;border-radius:10px;box-shadow:var(--pf-inset-shadow);overflow:hidden}",
      ".pf-btn-gold,.pf-btn-go{display:flex;align-items:center;justify-content:center;width:100%;min-height:56px;margin-top:8px;padding:16px 18px;border:0;border-radius:12px;cursor:pointer;background:linear-gradient(180deg,#8ee4ad,#3ea86a);color:#062011;font:700 clamp(18px,4.8vw,22px)/1.1 system-ui,-apple-system,sans-serif;letter-spacing:.06em;box-shadow:inset 0 1px 0 #d4f5e2,0 5px 0 #1b5c38,0 12px 22px #000a}",
      ".pf-btn-gold:active,.pf-btn-go:active{transform:translateY(4px);box-shadow:inset 0 1px 0 #d4f5e2,0 1px 0 #1b5c38}",
      ".ts-pf-overlay{position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;padding:max(16px,env(safe-area-inset-top)) 18px calc(env(safe-area-inset-bottom,0px) + 88px);background:#050b12;box-sizing:border-box;-webkit-tap-highlight-color:transparent}",
      "html.ts-elenco-aberto #intro,html.ts-elenco-aberto #hud,html.ts-elenco-aberto #oito,html.ts-elenco-aberto #card,html.ts-elenco-aberto #carta,html.ts-elenco-aberto #cartao{visibility:hidden!important;pointer-events:none}",
      ".ts-pf-card{width:min(440px,94vw);max-height:min(78dvh,640px);overflow:auto;padding:24px 20px 20px;color:#f4f9fd;display:flex;flex-direction:column;gap:14px;text-align:left}",
      ".ts-pf-tit{font:600 clamp(18px,4.6vw,22px)/1.35 system-ui,-apple-system,sans-serif;color:#f4f9fd}",
      ":root{--titulo:#f4f9fd}",
      ".ts-pf-msg{font:500 clamp(15px,3.8vw,17px)/1.45 system-ui,-apple-system,sans-serif;color:#dfeaf5}",
      ".ts-pf-lista{list-style:none;margin:0;padding:6px;display:flex;flex-direction:column;gap:0}",
      ".ts-pf-li{padding:10px 12px;border:0;border-bottom:1px solid rgba(45,63,72,.7);background:transparent;font:500 16px/1.35 system-ui,-apple-system,sans-serif;color:#e6edf2}",
      ".ts-pf-li:last-child{border-bottom:0}",
      ".ts-pf-seu-tit{margin-top:4px;font:700 13px/1.3 system-ui,-apple-system,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#e8a94a}",
      ".ts-pf-seu{padding:14px;text-align:center;font:700 clamp(18px,4.8vw,22px)/1.3 system-ui,-apple-system,sans-serif;color:#ffc46b}"
    ].join("");
    doc.head.appendChild(st);
  };
  TS.prazoSuave = function (ctx, aoEstourar) {
    ctx = ctx || {};
    var ms = Number(ctx.deadlineMs);
    if (!Number.isFinite(ms) || ms <= 0) ms = TS.SOFT_DEADLINE_MS;
    var done = false;
    var t = setTimeout(function () {
      if (done) return;
      done = true;
      try { aoEstourar && aoEstourar({ semPrecisao: true, deadlineMs: ms }); } catch (e) {}
    }, ms);
    return function cancelar() {
      done = true;
      clearTimeout(t);
    };
  };
  /* Antes do modo dedo (giroscópio ausente / negado / mudo): modal flutuante
     com contagem + OK. Só libera o dedo quando AMBOS: countdown zerou E OK.
     Não atrasa o soft deadline — quem chama arma prazoSuave à parte. */
  TS.AVISO_MODO_DEDO_SEG = 3;
  TS.AVISO_MODO_DEDO_TIT =
    "Seu telefone não tem ou não funciona o giroscópio.";
  TS.avisoModoDedoTexto = function (segundos) {
    var s = Number(segundos);
    if (!Number.isFinite(s) || s < 0) s = TS.AVISO_MODO_DEDO_SEG;
    var n = Math.max(0, Math.ceil(s));
    return "Após " + n + " segundos ele será liberado para deslize por dedo. Aguarde.";
  };
  /* Gate puro — testável sem DOM. */
  TS.modoDedoPodeLiberar = function (estado) {
    estado = estado || {};
    return !!(estado.countdownOk && estado.usuarioOk);
  };
  TS.avisoAntesModoDedo = function (opcoes) {
    opcoes = opcoes || {};
    var seg = Number(opcoes.segundos);
    if (!Number.isFinite(seg) || seg < 0) seg = TS.AVISO_MODO_DEDO_SEG;
    var aoLiberar = typeof opcoes.aoLiberar === "function" ? opcoes.aoLiberar : function () {};
    var estado = { countdownOk: seg <= 0, usuarioOk: false };
    var liberou = false;
    function tentarLiberar() {
      if (liberou || !TS.modoDedoPodeLiberar(estado)) return;
      liberou = true;
      limparUi();
      try { aoLiberar(); } catch (e) {}
    }
    var doc = global.document;
    var root = null;
    var tick = null;
    var fimTimer = null;
    function limparUi() {
      if (tick) { clearInterval(tick); tick = null; }
      if (fimTimer) { clearTimeout(fimTimer); fimTimer = null; }
      if (root && root.parentNode) root.parentNode.removeChild(root);
      root = null;
    }
    function marcarCountdown() {
      estado.countdownOk = true;
      tentarLiberar();
    }
    if (!doc || !doc.body) {
      /* Sem DOM (Node/teste): quem testa usa modoDedoPodeLiberar.
         Aqui só agenda o countdown; OK precisa vir de opcoes.usuarioOk. */
      if (opcoes.usuarioOk) estado.usuarioOk = true;
      if (estado.countdownOk) tentarLiberar();
      else {
        fimTimer = setTimeout(marcarCountdown, Math.ceil(seg * 1000));
      }
      return function cancelar() { limparUi(); liberou = true; };
    }
    TS.injetarProfundidade1mais1();
    root = doc.createElement("div");
    root.id = "ts-aviso-modo-dedo";
    root.className = "ts-pf-overlay";
    root.setAttribute("role", "alertdialog");
    root.setAttribute("aria-modal", "true");
    root.setAttribute("aria-live", "polite");
    var card = doc.createElement("div");
    card.className = "ts-pf-card pf-card";
    card.style.textAlign = "center";
    var tit = doc.createElement("div");
    tit.className = "ts-pf-tit";
    tit.textContent = TS.AVISO_MODO_DEDO_TIT;
    var msg = doc.createElement("div");
    msg.className = "ts-pf-msg pf-inset";
    msg.style.padding = "14px 14px";
    var restam = seg;
    function pintarMsg() {
      msg.textContent = TS.avisoModoDedoTexto(restam);
    }
    pintarMsg();
    var ok = doc.createElement("button");
    ok.type = "button";
    ok.textContent = "OK";
    ok.setAttribute("aria-label", "OK");
    ok.className = "pf-btn-go";
    ok.addEventListener("click", function () {
      estado.usuarioOk = true;
      tentarLiberar();
    });
    card.appendChild(tit);
    card.appendChild(msg);
    card.appendChild(ok);
    root.appendChild(card);
    doc.body.appendChild(root);
    if (estado.countdownOk) {
      /* já zerado: espera só o OK */
    } else {
      tick = setInterval(function () {
        restam = Math.max(0, restam - 1);
        pintarMsg();
        if (restam <= 0) {
          clearInterval(tick);
          tick = null;
          marcarCountdown();
        }
      }, 1000);
      fimTimer = setTimeout(marcarCountdown, Math.ceil(seg * 1000));
    }
    return function cancelar() { limparUi(); liberou = true; };
  };

  /* Elenco canônico da Casa da Costa (v1/casos/casa-da-costa.json).
     Fallback só quando a mesa ainda não expôs PERSONAGENS/CASO.elenco.
     Não inventa nomes — é a mesma lista do banco. */
  TS.ELENCO_CASA_CANONICO = [
    { id: "investigador", av: "🔎", nome: "{O Investigador|A Investigadora}" },
    { id: "herdeiro", av: "🗝️", nome: "{O Herdeiro|A Herdeira}" },
    { id: "morador", av: "🏠", nome: "{O Morador|A Moradora}" },
    { id: "jornalista", av: "🎤", nome: "{O Jornalista|A Jornalista}" },
    { id: "policial", av: "🚓", nome: "{O Policial|A Policial}" },
    { id: "menina", av: "🧸", nome: "{O Menino|A Menina}" }
  ];
  TS.ELENCO_TIT = "Os personagens do jogo são:";
  TS.ELENCO_SEU_TIT = "O seu personagem é:";
  /* Destaque UMA vez: rodapé “O seu personagem é”. A lista fica limpa.
     List+rodapé ao mesmo tempo foi o que queimou o playtest no iPhone. */
  TS.ELENCO_DESTAQUE = "rodape";
  TS.elencoDestacaNaLista = function () { return TS.ELENCO_DESTAQUE === "lista"; };
  TS.elencoDestacaNoRodape = function () { return TS.ELENCO_DESTAQUE === "rodape"; };
  TS.elencoChromeDuplo = function (marcaLista, marcaRodape) {
    return !!(marcaLista && marcaRodape);
  };

  TS.flexNome = function (txt, forma) {
    return String(txt == null ? "" : txt).replace(/\{([^|}]*)\|([^}]*)\}/g, function (_, m, f) {
      return forma === "f" ? f : m;
    });
  };

  function janelaParent() {
    try {
      if (global.parent && global.parent !== global) return global.parent;
    } catch (e) {}
    return null;
  }

  function lerCampo(obj, caminho) {
    if (!obj) return null;
    var cur = obj;
    var parts = String(caminho || "").split(".");
    for (var i = 0; i < parts.length; i++) {
      if (!cur || typeof cur !== "object") return null;
      cur = cur[parts[i]];
    }
    return cur == null ? null : cur;
  }

  TS.elencoVivo = function (opts) {
    opts = opts || {};
    if (opts.elenco && opts.elenco.length) return opts.elenco;
    var fontes = [global.PERSONAGENS, lerCampo(global.CASO, "elenco")];
    var p = janelaParent();
    if (p) {
      try { fontes.push(p.PERSONAGENS); } catch (e) {}
      try { fontes.push(lerCampo(p.CASO, "elenco")); } catch (e2) {}
    }
    for (var i = 0; i < fontes.length; i++) {
      if (fontes[i] && fontes[i].length) return fontes[i];
    }
    return null;
  };

  TS.euVivo = function (opts) {
    opts = opts || {};
    if (opts.eu && (opts.eu.personagem || opts.eu.id)) return opts.eu;
    if (global.STATE && global.STATE.eu) return global.STATE.eu;
    var p = janelaParent();
    try {
      if (p && p.STATE && p.STATE.eu) return p.STATE.eu;
    } catch (e) {}
    return null;
  };

  TS.jogadoresVivo = function (opts) {
    opts = opts || {};
    if (opts.jogadores && opts.jogadores.length) return opts.jogadores;
    if (global.STATE && global.STATE.jogadores && global.STATE.jogadores.length) {
      return global.STATE.jogadores;
    }
    var p = janelaParent();
    try {
      if (p && p.STATE && p.STATE.jogadores && p.STATE.jogadores.length) {
        return p.STATE.jogadores;
      }
    } catch (e) {}
    return [];
  };

  /* Regra (playtest): a lista mostra SÓ personagens com assento ocupado.
     Sem jogadores conhecidos, não despeja o cânone de 6 — fica só “você é X”
     quando o aparelho já sabe o próprio papel. Mestre e jogador usam a
     mesma regra; a diferença 2×6 vinha do iframe cair no cânone completo
     quando não lia STATE.jogadores (Android) vs. um caminho com assentos. */
  TS.elencoOcupado = function (elenco, jogadores, eu) {
    elenco = elenco || [];
    jogadores = jogadores || [];
    var ids = {};
    for (var i = 0; i < jogadores.length; i++) {
      var pid = jogadores[i] && jogadores[i].personagem;
      if (pid) ids[pid] = true;
    }
    if (!Object.keys(ids).length) {
      if (eu && eu.personagem) {
        return elenco.filter(function (p) { return (p.id || p) === eu.personagem; });
      }
      return [];
    }
    return elenco.filter(function (p) { return ids[p.id || p]; });
  };

  TS.HOLD_SALA_MS = 1400;
  TS.HOLD_SALA_ANDROID_MS = 2400;
  /* iPhone/iPad primeiro: um UA estranho nunca pode cair no hold do Android.
     Playtest (Mario): o iPhone já está bom — NÃO endurecer iOS. */
  TS.uaEhIOS = function (ua, nav) {
    ua = String(ua == null ? "" : ua);
    nav = nav || {};
    if (/iPad|iPhone|iPod/i.test(ua)) return true;
    try {
      if (nav.platform === "MacIntel" && Number(nav.maxTouchPoints) > 1) return true;
    } catch (e1) {}
    return false;
  };
  TS.uaEhAndroid = function (ua, nav) {
    if (TS.uaEhIOS(ua, nav)) return false;
    return /Android/i.test(String(ua == null ? "" : ua));
  };
  TS.holdMsPorPlataforma = function (ua, opts, nav) {
    opts = opts || {};
    var base = opts.base != null ? Number(opts.base) : TS.HOLD_SALA_MS;
    var and = opts.android != null ? Number(opts.android) : TS.HOLD_SALA_ANDROID_MS;
    if (!Number.isFinite(base) || base <= 0) base = TS.HOLD_SALA_MS;
    if (!Number.isFinite(and) || and <= 0) and = TS.HOLD_SALA_ANDROID_MS;
    if (TS.uaEhIOS(ua, nav)) return base;
    if (TS.uaEhAndroid(ua, nav)) return and;
    return base;
  };

  TS.resolverElenco = function (opts) {
    opts = opts || {};
    var bruto = TS.elencoVivo(opts);
    var caso = String(opts.caso || "").toLowerCase();
    if (!bruto || !bruto.length) {
      if (!caso || caso.indexOf("casa") >= 0) bruto = TS.ELENCO_CASA_CANONICO;
      else bruto = [];
    }
    var eu = TS.euVivo(opts);
    var jogadores = TS.jogadoresVivo(opts);
    bruto = TS.elencoOcupado(bruto, jogadores, eu);
    var forma = eu && eu.forma;
    var personagens = [];
    for (var i = 0; i < bruto.length; i++) {
      var p = bruto[i] || {};
      var id = p.id || p;
      var av = p.av || "👤";
      var nomeBruto = p.nome || String(id);
      var nome = TS.flexNome(nomeBruto, forma);
      try {
        var par = janelaParent();
        if (eu && par && typeof par.nomePersFragmento === "function" && eu.personagem === id) {
          nome = par.nomePersFragmento(eu, par.STATE && par.STATE.jogadores) || nome;
        }
      } catch (e3) {}
      personagens.push({ id: id, av: av, nome: nome });
    }
    var meu = null;
    if (eu && eu.personagem) {
      for (var j = 0; j < personagens.length; j++) {
        if (personagens[j].id === eu.personagem) { meu = personagens[j]; break; }
      }
    }
    return { personagens: personagens, meu: meu, eu: eu };
  };

  /* Gate puro — testável sem DOM. OK obrigatório. */
  TS.elencoPodeLiberar = function (estado) {
    estado = estado || {};
    return !!estado.usuarioOk;
  };

  /* Modal de elenco (mesmo espírito do aviso de dedo). A Casa chama isto
     na mesa, ANTES da encenação; a Janela não bloqueia mais aqui.
     Sem elenco conhecido, libera na hora (Carro / Solo — não inventa nomes). */
  TS.avisoElencoAntesJanela = function (opcoes) {
    opcoes = opcoes || {};
    var aoLiberar = typeof opcoes.aoLiberar === "function" ? opcoes.aoLiberar : function () {};
    var dados = TS.resolverElenco(opcoes);
    var estado = { usuarioOk: !!opcoes.usuarioOk };
    var liberou = false;
    function tentarLiberar() {
      if (liberou || !TS.elencoPodeLiberar(estado)) return;
      liberou = true;
      limparUi();
      try { aoLiberar(dados); } catch (e) {}
    }
    var doc = global.document;
    var root = null;
    function avisarHost(aberto) {
      try {
        TS.enviar({ mosaico: "elenco-modal", aberto: !!aberto }, opcoes);
      } catch (e0) {}
      try {
        if (doc && doc.documentElement) {
          doc.documentElement.classList.toggle("ts-elenco-aberto", !!aberto);
        }
      } catch (e1) {}
    }
    function limparUi() {
      avisarHost(false);
      if (root && root.parentNode) root.parentNode.removeChild(root);
      root = null;
    }
    if (!dados.personagens.length) {
      estado.usuarioOk = true;
      tentarLiberar();
      return function cancelar() { liberou = true; };
    }
    if (!doc || !doc.body) {
      if (estado.usuarioOk) tentarLiberar();
      return function cancelar() { liberou = true; };
    }
    TS.injetarProfundidade1mais1();
    root = doc.createElement("div");
    root.id = "ts-aviso-elenco";
    root.className = "ts-pf-overlay";
    root.style.zIndex = "100000";
    root.setAttribute("role", "alertdialog");
    root.setAttribute("aria-modal", "true");
    root.setAttribute("aria-labelledby", "ts-elenco-tit");
    var card = doc.createElement("div");
    card.className = "ts-pf-card pf-card";
    var tit = doc.createElement("div");
    tit.id = "ts-elenco-tit";
    tit.className = "ts-pf-tit";
    tit.textContent = TS.ELENCO_TIT;
    var lista = doc.createElement("ul");
    lista.className = "ts-pf-lista pf-inset";
    dados.personagens.forEach(function (p) {
      var li = doc.createElement("li");
      /* Lista limpa: o “seu” vai só no rodapé (ELENCO_DESTAQUE=rodape). */
      li.className = "ts-pf-li";
      li.textContent = (p.av ? p.av + " " : "") + p.nome;
      lista.appendChild(li);
    });
    card.appendChild(tit);
    card.appendChild(lista);
    if (dados.meu && TS.elencoDestacaNoRodape()) {
      var seuTit = doc.createElement("div");
      seuTit.className = "ts-pf-seu-tit";
      seuTit.textContent = TS.ELENCO_SEU_TIT;
      var seu = doc.createElement("div");
      seu.setAttribute("data-ts-meu-personagem", dados.meu.id);
      seu.setAttribute("data-elenco-destaque", "uma-vez");
      seu.className = "ts-pf-seu pf-inset";
      seu.style.boxShadow = "inset 0 0 0 2px #e8a94a, inset 0 2px 8px rgba(0,0,0,.45)";
      seu.style.background = "#25190e";
      seu.textContent = (dados.meu.av ? dados.meu.av + " " : "") + dados.meu.nome;
      card.appendChild(seuTit);
      card.appendChild(seu);
    }
    var ok = doc.createElement("button");
    ok.type = "button";
    ok.textContent = "OK";
    ok.setAttribute("aria-label", "OK");
    ok.className = "pf-btn-go";
    ok.addEventListener("click", function () {
      estado.usuarioOk = true;
      tentarLiberar();
    });
    card.appendChild(ok);
    root.appendChild(card);
    doc.body.appendChild(root);
    avisarHost(true);
    try { ok.focus(); } catch (e4) {}
    return function cancelar() { limparUi(); liberou = true; };
  };

  global.TarefaSensor = TS;

  /* Conteúdo narrativo específico do caso fica separado da engenharia dos
     sensores. Assim futuras correções de iOS não reabrem a realidade canônica. */
  /* O caminho sai do endereço DESTE arquivo, não do documento. Para a Mesa dá
     exatamente a mesma URL — o script mora em v1/js/ e o documento em v1/ —,
     então nada muda hoje. Mas relativo ao documento é o que impede A Noite de
     reaproveitar esta folha: de `jogos/casa-da-costa/a-noite/modulos/` viraria
     `/Dragon/jogos/casa-da-costa/a-noite/modulos/js/sensor-…`, um 404 silencioso, e o módulo passaria a
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