/* MOSAICO · A CASA DA COSTA — o aprendizado da tela (11/10/2026, Tarefa 4).
   ==========================================================================
   Como n'O Impostor: a tela se ensina fazendo, uma coisa de cada vez, na
   hora em que ela aparece pela primeira vez. Um cartão no pé da tela diz o
   que é e onde tocar, e um anel marca o botão de que ele fala.

   Regras:
   - nada aqui segura o jogo: o cartão não cobre a tela inteira, não pausa
     o relógio e some sozinho em 30 s (a história não espera o gesto);
   - cada passo aparece uma vez por aparelho; "Já sei jogar" desliga todos;
   - o vídeo de abertura fica como está: o aprendizado só começa depois dele,
     quando a pessoa já está na mesa (STATE.eu);
   - durante uma tarefa de sensor (Janela, Percurso) o cartão sobe para o
     alto e some em 12 s, para não cobrir os controles da tarefa.
   O que fica guardado no aparelho (localStorage, com try/catch):
     casa:aprendizado      → passos já vistos
     casa:aprendizado:off  → "Já sei jogar" */
(function (global) {
  "use strict";
  var CHAVE = "casa:aprendizado", CHAVE_OFF = "casa:aprendizado:off";
  var vistos = {};
  try { vistos = JSON.parse(localStorage.getItem(CHAVE) || "{}") || {}; } catch (e) { vistos = {}; }
  function desligado() { try { return localStorage.getItem(CHAVE_OFF) === "1"; } catch (e) { return false; } }
  function guardar() { try { localStorage.setItem(CHAVE, JSON.stringify(vistos)); } catch (e) {} }

  function el(sel) { return document.querySelector(sel); }
  function visivel(sel) {
    var e = typeof sel === "string" ? el(sel) : sel;
    if (!e) return false;
    var r = e.getBoundingClientRect();
    return r.width > 0 && r.height > 0 && getComputedStyle(e).visibility !== "hidden";
  }
  function texto(sel) { var e = el(sel); return e ? e.textContent || "" : ""; }
  function fase() { return (global.STATE && STATE.doc && STATE.doc.fase) || ""; }
  function tela() { return (global.STATE && STATE.tela) || ""; }
  function corpo(c) { return document.body.classList.contains(c); }
  function botaoCom(t) {
    return Array.prototype.find.call(document.querySelectorAll("#app button"), function (b) {
      return visivel(b) && (b.textContent || "").indexOf(t) >= 0;
    }) || null;
  }
  function mestre() { try { return typeof global.souMestreDaMesa === "function" && souMestreDaMesa(); } catch (e) { return false; } }

  /* Os passos, na ordem em que a noite costuma mostrá-los. `quando` diz se a
     coisa está na tela agora; `alvo` é o botão que ganha o anel; `feito`,
     quando houver, fecha o passo assim que a pessoa toca no alvo. */
  var PASSOS = [
    { id: "elenco", rot: "O seu personagem",
      txt: "A tela vai se explicar aos poucos, cada coisa na hora em que aparecer; nada aqui segura o jogo. Este é o seu personagem nesta noite: guarde para você e toque em OK.",
      quando: function () { return tela() === "encenacao" && /O SEU PERSONAGEM/i.test(texto("#app")); },
      alvo: function () { return botaoCom("OK"); } },
    { id: "caso", geral: true, rot: "🔎 Caso",
      txt: "Perdeu o fio? Toque em Caso. Lá está o que fazer agora, a linha pública da noite e o Como jogar.",
      quando: function () { return visivel(".btn-caso"); },
      alvo: function () { return el(".btn-caso"); }, feito: true },
    { id: "minhavez", rot: "A sua vez",
      txt: "Leia os três passos só para você, com a tela protegida. Depois faça a cena e diga a fala em voz alta para a mesa. No fim, toque em concluir.",
      quando: function () { return tela() === "encenacao" && /É a sua vez/i.test(texto("#app")); },
      alvo: function () { return botaoCom("concluir"); } },
    { id: "ouvir", rot: "A vez de outra pessoa",
      txt: "Agora quem encena é outra pessoa. Olhe e escute: o que ela faz e diz pode ser pista.",
      quando: function () { return corpo("encenacao-passiva"); } },
    { id: "pista", rot: "A sua pista privada",
      txt: "Esta pista é só sua: ninguém mais na mesa tem. Toque em Adicionar ao Arquivo para guardá-la. Depois, conte a quem quiser, ou negocie com ela.",
      quando: function () { return tela() === "revelacao" && !!botaoCom("Adicionar ao Arquivo"); },
      alvo: function () { return botaoCom("Adicionar ao Arquivo"); } },
    { id: "arquivo", geral: true, rot: "🗂 Arquivo",
      txt: "Tudo o que você guarda fica no Arquivo, com o horário de cada pista. O número diz quantas você tem. Toque para abrir e ler.",
      quando: function () { var b = el("#btn-pistas"); return !!b && b.classList.contains("on") && visivel(b); },
      alvo: function () { return el("#btn-pistas"); }, feito: true },
    { id: "salamestre", geral: true, rot: "Sala · só o Mestre",
      txt: "Este botão só aparece no seu celular. Lá ficam pausar, pular a apresentação e avançar a fase quando a mesa travar.",
      quando: function () { return mestre() && visivel(".btn-menu-mestre"); },
      alvo: function () { return el(".btn-menu-mestre"); }, feito: true },
    { id: "votacao", rot: "Votação",
      txt: "Vote em quem mais deu vida à cena. O voto é secreto, não pode ser em você e não muda a investigação: vale pontos de performance.",
      quando: function () { return fase() === "votacao" && tela() === "votacao"; } },
    { id: "janela", rot: "A Janela do Norte", alto: true,
      txt: "Uma tarefa com o celular na mão. Siga as instruções da própria tarefa (📖 tem o Como jogar). O que você achar vai para o Arquivo.",
      quando: function () { return tela() === "inclinacao"; } },
    { id: "percurso", rot: "O Percurso", alto: true,
      txt: "Agora em dupla, cada um com um papel. Falem em voz alta o que cada tela mostra: um vê o que o outro não vê. As pistas vão para o Arquivo.",
      quando: function () { return tela() === "constelacao"; } },
    { id: "cor", rot: "O seu Fragmento",
      txt: "Procure na mesa as telas da mesma cor que a sua. Essas pessoas são o seu Fragmento: o grupo com quem você trabalha agora.",
      quando: function () { return corpo("busca-fragmento"); } },
    { id: "mosaico", rot: "A noite em ordem",
      txt: "Ponham os acontecimentos na ordem dos horários: para cada horário, a pista que pertence a ele. Consultem os Arquivos e conversem antes de enviar.",
      quando: function () { return corpo("mosaico-reconstrucao"); } },
    { id: "cooperacao", rot: "Cooperação",
      txt: "Em segredo, diga quem mais ajudou o seu Fragmento. Ninguém vê o seu voto.",
      quando: function () { return fase() === "cooperacao" && tela() === "cooperacao"; } },
    { id: "mercado", rot: "O Mercado",
      txt: "Até 3 ações. Pista nova custa 4; repassada custa 2 e vem às cegas. Consignar é deixar uma pista sua no balaio: só recebe se alguém levar. Arriscar (3) fecha um campo da decisão antes da hora.",
      quando: function () { return fase() === "mercado" && tela() === "mercado"; } },
    { id: "deducao", rot: "A decisão",
      txt: "Responda aos campos com o que os fatos permitem concluir e marque as pistas que usou. Depois de enviar, não dá para mudar.",
      quando: function () { return fase() === "deducao" && tela() === "deducao"; } }
  ];

  /* O Solo (solo/mesa-solo.js) tem outras telas: a fase está em `state.phase`
     (const global do script do Solo, alcançável pelo nome) e não há sala. */
  function solo() { try { return !global.STATE && typeof state !== "undefined" && state && "phase" in state ? state : null; } catch (e) { return null; } }
  function fs() { var s = solo(); return s ? s.phase : ""; }
  function botaoSolo(t) {
    return Array.prototype.find.call(document.querySelectorAll("#app button"), function (b) {
      return visivel(b) && (b.textContent || "").toLowerCase().indexOf(t.toLowerCase()) >= 0;
    }) || null;
  }
  var PASSOS_SOLO = [
    { id: "s-briefing", rot: "Você e a casa",
      txt: "No Solo, você faz todas as tarefas e a casa faz a parte dos outros. A pergunta desta partida está aqui: é ela que você responde no fim. A tela vai se explicar aos poucos; nada aqui segura o jogo.",
      quando: function () { return fs() === "briefing"; }, alvo: function () { return botaoSolo("Entrar na casa"); } },
    { id: "s-marco", rot: "Uma etapa da mesa",
      txt: "Aqui, na mesa em grupo, haveria uma etapa com outras pessoas. No Solo, a casa resume o que aconteceria e você segue.",
      quando: function () { return fs() === "marco"; }, alvo: function () { return botaoSolo("Continuar"); } },
    { id: "s-percurso", rot: "O percurso", alto: true,
      txt: "As tarefas na casa, uma de cada vez. Conclua a etapa atual; ⤡ sai da tela cheia, e 📖 tem o Como jogar de cada tarefa.",
      quando: function () { return fs() === "percurso3d" || fs() === "papeis" || fs() === "sensor"; } },
    { id: "s-mosaico", rot: "A noite em ordem",
      txt: "Toque em dois acontecimentos para trocá-los de lugar. A etapa avança quando todos estiverem na ordem em que aconteceram.",
      quando: function () { return fs() === "mosaico"; } },
    { id: "s-mercado", rot: "O Mercado",
      txt: "Três ações. Cada arquivo lacrado é uma pista que você ainda não tem. Escolha a que mais ajuda a responder a sua pergunta.",
      quando: function () { return fs() === "mercado"; } },
    { id: "s-mapa", rot: "A planta",
      txt: "A planta junta o que você achou. Quando os fatos fecharem, toque em Responder à pergunta.",
      quando: function () { return fs() === "map"; }, alvo: function () { return botaoSolo("Responder"); } },
    { id: "s-decisao", rot: "A decisão",
      txt: "Preencha os campos com o que os fatos permitem concluir. Depois de enviar, a resposta é comparada com o que de fato aconteceu.",
      quando: function () { return fs() === "decision"; } }
  ];
  if (solo() || (!global.STATE && /\/solo\//.test(location.pathname))) PASSOS = PASSOS_SOLO;

  var css = document.createElement("style");
  css.textContent =
    "#apCasa{position:fixed;left:50%;transform:translateX(-50%);bottom:max(14px,env(safe-area-inset-bottom));z-index:100020;" +
    "width:min(460px,calc(100% - 24px));padding:12px 14px 10px;border:1px solid rgba(159,228,255,.52);border-radius:14px;" +
    "background:linear-gradient(165deg,#1a3348,#153044 60%,#102838);color:#eef5f2;font:15px/1.42 Inter,system-ui,sans-serif;" +
    "box-shadow:inset 0 1px 0 rgba(255,255,255,.10),0 14px 40px rgba(0,0,0,.6);transition:opacity .25s;opacity:0}" +
    "#apCasa.on{opacity:1}#apCasa.alto{bottom:auto;top:max(70px,env(safe-area-inset-top))}" +
    "#apCasa small{display:block;color:#efc878;letter-spacing:.12em;font:800 11px Inter,system-ui,sans-serif;text-transform:uppercase}" +
    "#apCasa b{display:block;font:600 19px Georgia,serif;color:#f4d79a;margin:2px 0 4px}" +
    "#apCasa p{margin:0 0 8px;color:#dfeaf5}" +
    "#apCasa .ap-acoes{display:flex;gap:8px}" +
    "#apCasa button{min-height:44px;padding:8px 14px;border-radius:10px;font-weight:800;cursor:pointer;border:0}" +
    "#apCasa .ap-ok{flex:1;background:linear-gradient(180deg,#ffc878,#d6aa58);color:#1b1005;box-shadow:inset 0 1px #ffe2b4,0 4px 0 #6a3712}" +
    "#apCasa .ap-sei{background:#0c1b26;color:#cfe3ef;border:1px solid #46667a}" +
    /* 11/10 (padronização): o volume e o afundar comuns a todos os jogos */
    "#apCasa .ap-sei{box-shadow:inset 0 1px 0 #ffffff14,0 4px 0 #020609,0 8px 12px #0007}" +
    "#apCasa .ap-ok,#apCasa .ap-sei{transition:transform .12s ease,box-shadow .12s ease}" +
    "#apCasa .ap-ok:active{transform:translateY(3px);box-shadow:inset 0 1px #ffe2b4,0 1px 0 #6a3712}" +
    "#apCasa .ap-sei:active{transform:translateY(3px);box-shadow:inset 0 2px 5px #0008,0 1px 0 #020609}" +
    ".ap-alvo{outline:3px solid #efc878!important;outline-offset:3px;border-radius:12px;animation:apPulso 1.4s ease-in-out infinite}" +
    "@keyframes apPulso{50%{outline-color:rgba(239,200,120,.25)}}";
  document.head.appendChild(css);

  var atual = null, cartao = null, timer = null, alvoAtual = null;
  function fechar(marcar) {
    if (atual && marcar) { vistos[atual.id] = Date.now(); guardar(); }
    if (alvoAtual) { alvoAtual.classList.remove("ap-alvo"); alvoAtual = null; }
    if (cartao) { cartao.remove(); cartao = null; }
    var app = document.getElementById("app"); if (app) app.style.paddingBottom = ""; rolouPara = null;
    clearTimeout(timer); timer = null; atual = null;
  }
  function mostrar(p) {
    atual = p;
    cartao = document.createElement("div");
    cartao.id = "apCasa"; cartao.setAttribute("role", "status"); cartao.setAttribute("aria-live", "polite");
    if (p.alto) cartao.classList.add("alto");
    var n = PASSOS.indexOf(p) + 1;
    cartao.innerHTML = "<small>Aprendendo a tela · " + n + " de " + PASSOS.length + "</small><b>" + p.rot + "</b><p>" + p.txt + "</p>" +
      '<div class="ap-acoes"><button type="button" class="ap-ok">Entendi</button><button type="button" class="ap-sei">Já sei jogar</button></div>';
    document.body.appendChild(cartao);
    requestAnimationFrame(function () { if (cartao) cartao.classList.add("on"); });
    cartao.querySelector(".ap-ok").onclick = function () { fechar(true); };
    cartao.querySelector(".ap-sei").onclick = function () { try { localStorage.setItem(CHAVE_OFF, "1"); } catch (e) {} fechar(true); };
    timer = setTimeout(function () { fechar(true); }, p.alto ? 12000 : 30000);
  }
  /* o #app é redesenhado a cada mudança da sala: o anel é reposto a cada volta */
  /* O cartão fica no pé e a página ganha, embaixo, o espaço dele: nada fica
     escondido para sempre. Quando o passo aponta um botão que ficaria sob o
     cartão, a página rola uma vez para deixá-lo logo acima (sem brigar com a
     pessoa depois). Em tarefa de sensor o cartão vai para o alto. */
  var rolouPara = null;
  function posicionar() {
    if (!cartao || !atual) return;
    var alto = !!atual.alto;
    cartao.classList.toggle("alto", alto);
    /* barras fixas no pé (a doca de botões do Carro, o botão Sala…) ficam visíveis: o cartão sobe acima delas */
    var pe = 0;
    if (!alto) Array.prototype.forEach.call(document.querySelectorAll("body > *, main > *, .dock, [class*='dock'], [class*='barra'], #dragonSalaBtn"), function (n) {
      if (n === cartao || cartao.contains(n)) return;
      var cs = getComputedStyle(n);
      if (cs.position !== "fixed" && cs.position !== "sticky") return;
      var r = n.getBoundingClientRect();
      if (r.height > 0 && r.height < innerHeight * 0.4 && r.bottom >= innerHeight - 4 && r.top > innerHeight * 0.5 && cs.visibility !== "hidden" && cs.display !== "none") pe = Math.max(pe, innerHeight - r.top);
    });
    cartao.style.bottom = alto ? "" : "calc(max(14px, env(safe-area-inset-bottom)) + " + Math.round(pe) + "px)";
    var h = alto ? 0 : cartao.offsetHeight + 16 + Math.round(pe);
    var app = document.getElementById("app");
    if (app) app.style.paddingBottom = h ? h + "px" : "";
    if (!alto && alvoAtual && rolouPara !== alvoAtual) {
      rolouPara = alvoAtual;
      var r = alvoAtual.getBoundingClientRect(), limite = innerHeight - h - 12;
      if (r.bottom > limite) window.scrollBy({ top: r.bottom - limite, behavior: "smooth" });
    }
  }
  function marcarAlvo() {
    posicionar();
    if (!atual || !atual.alvo) return;
    var a = atual.alvo();
    if (a === alvoAtual) return;
    if (alvoAtual) alvoAtual.classList.remove("ap-alvo");
    alvoAtual = a || null;
    if (alvoAtual) alvoAtual.classList.add("ap-alvo");
    posicionar();
  }
  document.addEventListener("click", function (ev) {
    if (!atual || !atual.feito || !alvoAtual) return;
    if (alvoAtual === ev.target || alvoAtual.contains(ev.target)) fechar(true);
  }, true);
  function volta() {
    if (desligado()) { if (atual) fechar(false); return; }
    if (PASSOS === PASSOS_SOLO) { if (!solo() || !solo().caso) return; }
    else if (!global.STATE || !STATE.eu || !global.CASO_PRONTO) return;
    if (document.getElementById("abCasa") && document.getElementById("abCasa").classList.contains("on")) return; /* a abertura em vídeo vem antes */
    if (document.querySelector(".partida-pausada")) return;
    if (atual) {
      if (!atual.quando()) { fechar(!atual.geral); return; } /* a tela já mudou: o passo da tela cumpriu o papel; o geral volta depois */
      /* o passo de uma tela (a sua vez, a sua pista…) passa na frente de um geral (Caso, Arquivo, Sala) */
      var daTela = atual.geral ? proximo(true) : null;
      if (!daTela) { marcarAlvo(); return; }
      fechar(false); mostrar(daTela); marcarAlvo(); return;
    }
    /* entre os que cabem agora, os da tela vêm antes dos gerais */
    var p = proximo(true) || proximo(false);
    if (p) { mostrar(p); marcarAlvo(); }
  }
  function proximo(soDaTela) {
    for (var i = 0; i < PASSOS.length; i++) {
      var p = PASSOS[i];
      if (vistos[p.id] || (soDaTela && p.geral) || p === atual) continue;
      if (p.geral && corpo("fase-sensor")) continue; /* em tarefa de sensor, só o passo da própria tarefa */
      var ok = false; try { ok = p.quando(); } catch (e) { ok = false; }
      if (ok) return p;
    }
    return null;
  }
  /* e quando a tela muda sozinha (a fase aberta pelo Mestre chega pela sala, sem toque neste aparelho):
     no máximo uma vez por quadro, só enquanto há cartão na tela */
  var pedidoQuadro = 0;
  try {
    new MutationObserver(function (lista) {
      if (!cartao || !atual || pedidoQuadro) return;
      /* as mudanças que o próprio posicionar faz (no cartão e no respiro do #app) não contam */
      var deFora = lista.some(function (m) { return !(cartao.contains(m.target) || (m.target.id === "app" && m.attributeName === "style") || (m.target.classList && m.target.classList.contains("ap-alvo") && m.attributeName === "class")); });
      if (!deFora) return;
      pedidoQuadro = requestAnimationFrame(function () { pedidoQuadro = 0; try { posicionar(); } catch (e) {} });
    }).observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ["class", "hidden", "style"] });
  } catch (e) {}
  /* reposicionar logo depois de um toque: a troca de tela (e a doca que chega com ela) não espera o próximo ciclo */
  document.addEventListener("click", function () { setTimeout(function () { try { posicionar(); } catch (e) {} }, 40); setTimeout(function () { try { posicionar(); } catch (e) {} }, 260); }, false);
  setInterval(volta, 700);
  global.CasaAprendizado = {
    passos: function () { return PASSOS.map(function (p) { return p.id; }); },
    vistos: function () { return Object.keys(vistos); },
    atual: function () { return atual && atual.id; },
    zerar: function () { vistos = {}; guardar(); try { localStorage.removeItem(CHAVE_OFF); } catch (e) {} fechar(false); }
  };
})(window);
