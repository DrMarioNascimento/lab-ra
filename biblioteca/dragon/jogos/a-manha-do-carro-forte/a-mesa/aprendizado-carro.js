/* MOSAICO · A MANHÃ DO CARRO-FORTE — o aprendizado da tela (11/10/2026, Tarefa 4).
   ==========================================================================
   O mesmo jeito d'A Casa da Costa e d'O Impostor: a tela se ensina fazendo,
   uma coisa de cada vez, na hora em que aparece pela primeira vez. Um cartão
   no pé da tela diz o que é e onde tocar; um anel marca o botão de que fala.
   Nada aqui segura o jogo (some em 30 s), cada passo aparece uma vez por
   aparelho e "Já sei jogar" desliga todos. A abertura (imagem e narração)
   fica como está: o aprendizado começa quando ela termina.
   Cópia própria do Carro-Forte (cada jogo é independente).
     carro:aprendizado / carro:aprendizado:off (localStorage, com try/catch) */
(function (global) {
  "use strict";
  var CHAVE = "carro:aprendizado", CHAVE_OFF = "carro:aprendizado:off";
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
  function corpo(c) { return document.body.classList.contains(c); }
  /* `state` é a const global do game.js (script clássico): alcançável pelo nome */
  function st() { try { return typeof state !== "undefined" ? state : null; } catch (e) { return null; } }
  function tela() { var s = st(); return s ? s.screen : ""; }
  function mestre() { try { return !(global.MOSAICO_ROOM && global.MOSAICO_ROOM.code) || global.MOSAICO_ROOM.role === "master"; } catch (e) { return false; } }
  function noite() { return /\/noite\//.test(location.pathname); }

  var PASSOS = [
    { id: "m-intro-mestre", rot: "Você abre a mesa",
      txt: "A tela vai se explicar aos poucos, cada coisa na hora em que aparecer; nada aqui segura o jogo. Escolha o tempo de cada atividade e a duração, e toque em Começar a investigação.",
      quando: function () { return tela() === "intro" && mestre() && visivel("#chooseGame"); },
      alvo: function () { return el("#chooseGame"); } },
    { id: "m-intro-convidado", rot: "Quem abre é o Mestre",
      txt: "A tela vai se explicar aos poucos; nada aqui segura o jogo. Quem escolhe a pergunta, o ritmo e a duração é o Mestre. Espere a pauta chegar.",
      quando: function () { return tela() === "intro" && !mestre(); } },
    { id: "m-pauta", rot: "A pauta",
      txt: "Esta é a pergunta da partida: é ela que você responde no fim. Leia o que parece e a regra de leitura. Um fato verdadeiro pode sustentar uma leitura errada.",
      quando: function () { return tela() === "briefing"; } },
    { id: "m-info", rot: "ⓘ Como esta mesa lê", geral: true,
      txt: "Perdeu o fio? Toque em ⓘ: a gramática do jogo, os terços do dossiê e o que cada tipo de fragmento faz.",
      quando: function () { return visivel("#infoBtn") && tela() !== "intro"; },
      alvo: function () { return el("#infoBtn"); }, feito: true },
    { id: "m-sala", rot: "Sala · só o Mestre", geral: true,
      txt: "Este botão só aparece no seu celular. Lá você abre as atividades e as fases para a mesa quando o ritmo é conduzido.",
      quando: function () { return mestre() && visivel("#hudSala"); },
      alvo: function () { return el("#hudSala"); }, feito: true },
    { id: "m-sensores", rot: "As atividades",
      txt: "Uma de cada vez, para a mesa toda, com o celular na mão. Ela abre em outra aba; o que você alcançar entra no seu dossiê. O que ficar para trás não volta por outra porta.",
      quando: function () { return tela() === "sensory"; },
      alvo: function () { return Array.prototype.find.call(document.querySelectorAll("#sensoryCards button"), function (b) { return visivel(b) && !b.disabled; }) || null; } },
    { id: "m-dossie", rot: "O dossiê",
      txt: "Abre em três terços, com o tempo. Toque nos fragmentos que importam para a pergunta para marcá-los. Conte à mesa o que você achou: cada aparelho colheu coisas diferentes.",
      quando: function () { return tela() === "evidence"; } },
    { id: "m-hipotese", rot: "A hipótese",
      txt: "Escolha a leitura em que você aposta agora. Mudar depois, diante de uma relação nova, conta a seu favor no relatório.",
      quando: function () { return tela() === "hypothesis"; } },
    { id: "m-relacoes", rot: "As relações",
      txt: "Uma relação só existe quando as duas peças estão no seu dossiê. Toque numa relação disponível para costurá-la; a contraprova testa a sua hipótese.",
      quando: function () { return tela() === "mosaic"; } },
    { id: "m-decisao", rot: "A decisão",
      txt: "Responda aos campos. Quando o tempo acabar, o que estiver marcado é entregue assim mesmo.",
      quando: function () { return tela() === "final"; } },
    { id: "m-espera", rot: "A mesa vira a página", geral: true,
      txt: "Quem vira a página é a mesa, quando o tempo acaba. Enquanto isso, releia o dossiê e converse.",
      quando: function () { return !mestre() && visivel("#esperaDaMesa"); } }
  ];
  if (noite()) PASSOS = [
    { id: "n-entrar", rot: "A Noite",
      txt: "A tela vai se explicar aos poucos; nada aqui segura o jogo. A Noite fecha a pergunta da manhã, com o mesmo código de sala. Toque em Entrar na reunião.",
      quando: function () { return visivel("#enterBtn"); }, alvo: function () { return el("#enterBtn"); } },
    { id: "n-mao", rot: "A sua mão",
      txt: "Estes fragmentos estão só com você. As moedas ficam no alto (💵). Leia a mão antes de gastar.",
      quando: function () { return visivel("#hand") && !visivel("#enterBtn"); } },
    { id: "n-acoes", rot: "As ações",
      txt: "Comprar (4 moedas): uma de três peças lacradas. Capturar (2): pega um fragmento ao acaso de outro investigador. Arriscar (3): responde um campo; acertou, fecha o campo para todos e a moeda volta; errou, o campo queima só para você.",
      quando: function () { return visivel("#decisionPanel"); } },
    { id: "n-campos", rot: "Os campos da pergunta",
      txt: "A partida acaba quando todos os campos fecharem. Campo fechado vale pontos; campo queimado tira.",
      quando: function () { return visivel("#fields"); }, alvo: function () { return el("#fieldsToggle"); } },
    { id: "n-regras", rot: "ⓘ Regras desta noite", geral: true,
      txt: "Os custos e as ações ficam no ⓘ, a qualquer momento.",
      quando: function () { return visivel("#infoBtn") && !visivel("#enterBtn"); }, alvo: function () { return el("#infoBtn"); }, feito: true }
  ];

  var css = document.createElement("style");
  css.textContent =
    "#apCarro{position:fixed;left:50%;transform:translateX(-50%);bottom:max(14px,env(safe-area-inset-bottom));z-index:100020;" +
    "width:min(460px,calc(100% - 24px));padding:12px 14px 10px;border:1px solid rgba(159,228,255,.52);border-radius:14px;" +
    "background:linear-gradient(165deg,#1a3348,#153044 60%,#102838);color:#eef5f2;font:15px/1.42 Inter,system-ui,sans-serif;" +
    "box-shadow:inset 0 1px 0 rgba(255,255,255,.10),0 14px 40px rgba(0,0,0,.6);transition:opacity .25s;opacity:0}" +
    "#apCarro.on{opacity:1}#apCarro.alto{bottom:auto;top:max(70px,env(safe-area-inset-top))}" +
    "#apCarro small{display:block;color:#efc878;letter-spacing:.12em;font:800 11px Inter,system-ui,sans-serif;text-transform:uppercase}" +
    "#apCarro b{display:block;font:600 19px Georgia,serif;color:#f4d79a;margin:2px 0 4px}" +
    "#apCarro p{margin:0 0 8px;color:#dfeaf5}" +
    "#apCarro .ap-acoes{display:flex;gap:8px}" +
    "#apCarro button{min-height:44px;padding:8px 14px;border-radius:10px;font-weight:800;cursor:pointer;border:0}" +
    "#apCarro .ap-ok{flex:1;background:linear-gradient(180deg,#ffc878,#d6aa58);color:#1b1005;box-shadow:inset 0 1px #ffe2b4,0 4px 0 #6a3712}" +
    "#apCarro .ap-sei{background:#0c1b26;color:#cfe3ef;border:1px solid #46667a}" +
    /* 11/10 (padronização): o volume e o afundar comuns a todos os jogos */
    "#apCarro .ap-sei{box-shadow:inset 0 1px 0 #ffffff14,0 4px 0 #020609,0 8px 12px #0007}" +
    "#apCarro .ap-ok,#apCarro .ap-sei{transition:transform .12s ease,box-shadow .12s ease}" +
    "#apCarro .ap-ok:active{transform:translateY(3px);box-shadow:inset 0 1px #ffe2b4,0 1px 0 #6a3712}" +
    "#apCarro .ap-sei:active{transform:translateY(3px);box-shadow:inset 0 2px 5px #0008,0 1px 0 #020609}" +
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
    cartao.id = "apCarro"; cartao.setAttribute("role", "status"); cartao.setAttribute("aria-live", "polite");
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
    if (!noite() && !st()) return;
    if (visivel("#mosaicoOpening") || visivel("#mosaicoPrep")) return; /* a abertura (imagem e narração) vem antes */
    if (atual) {
      var ainda = false; try { ainda = atual.quando(); } catch (e) {}
      if (!ainda) { fechar(!atual.geral); return; }
      var daTela = atual.geral ? proximo(true) : null;
      if (!daTela) { marcarAlvo(); return; }
      fechar(false); mostrar(daTela); marcarAlvo(); return;
    }
    var p = proximo(true) || proximo(false);
    if (p) { mostrar(p); marcarAlvo(); }
  }
  function proximo(soDaTela) {
    for (var i = 0; i < PASSOS.length; i++) {
      var p = PASSOS[i];
      if (vistos[p.id] || (soDaTela && p.geral) || p === atual) continue;
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
  global.CarroAprendizado = {
    passos: function () { return PASSOS.map(function (p) { return p.id; }); },
    vistos: function () { return Object.keys(vistos); },
    atual: function () { return atual && atual.id; },
    zerar: function () { vistos = {}; guardar(); try { localStorage.removeItem(CHAVE_OFF); } catch (e) {} fechar(false); }
  };
})(window);
