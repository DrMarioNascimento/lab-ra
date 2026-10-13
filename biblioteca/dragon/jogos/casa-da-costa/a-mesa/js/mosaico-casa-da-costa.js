/* MOSAICO — A Casa da Costa · o Mosaico coletivo passa a embaralhar
   02/09/2026.

   O Mosaico era o único pedaço da noite que NÃO girava: um bloco fixo de seis
   acontecimentos, iguais nas seis perguntas. Um grupo que jogasse duas vezes
   já sabia a resposta — e ele vale até 20 pontos, a maior fatia isolada
   depois da dedução. Era o furo no princípio que o resto do jogo respeita:
   a pergunta gira, as atividades giram, o dossiê gira, as pistas giram.

   Agora ele tem BANCO PRÓPRIO (`mosaicoBanco` no caso), separado das pistas
   públicas e dos lotes das atividades, e cada sala sorteia dele. Separado de
   propósito: sortear a partir do que os jogadores efetivamente descobriram
   faria a resposta depender do que cada aparelho já sincronizou, e dois
   telefones montariam ordens diferentes da mesma rodada.

   DUAS ARMADILHAS, as duas medidas antes de escrever:

   1. A NOITE ATRAVESSA A MEIA-NOITE. 02h15, 06h50 e 08h20 são do dia
      seguinte: vêm DEPOIS de 23h05. Ordenar por texto poria o higrômetro em
      primeiro e o jogo puniria quem acertasse.
   2. NOVE PARES DIVIDEM O MESMO INSTANTE — F04 e F23 às 21h21, F05 e F24 às
      21h27, F16 e F17 às 08h20… Se os dois caírem na mesma rodada não existe
      ordem certa entre eles, e a mesa erra sem ter como acertar. O sorteio
      pega UM POR HORÁRIO. */
(function (global) {
  "use strict";

  function caso() { return global.CASO || null; }
  function cfgBanco() { var c = caso(); return (c && c.mosaicoBanco) || null; }

  /* A virada do dia: tudo antes das 12h pertence à madrugada seguinte. O 12
     é o divisor natural aqui porque a noite começa às 19h40 e termina às
     08h20 — não há evento entre 08h21 e 19h39 para confundir. */
  function minutos(hora) {
    var m = String(hora || "").split("–")[0].match(/(\d{1,2}):(\d{2})/);
    if (!m) return -1;
    var h = Number(m[1]), min = Number(m[2]);
    return (h < 12 ? h + 24 : h) * 60 + min;
  }

  function resolver(id) {
    var c = caso(); if (!c) return null;
    if (id.indexOf("pub-") === 0) {
      var p = (c.publicas || []).find(function (x) { return x.id === id; });
      if (!p) return null;
      var rot = (c.mosaico && c.mosaico.rotulos) || {};
      var dic = (c.mosaico && c.mosaico.dicas) || {};
      return { id: id, hora: p.hora, txt: p.txt, rotulo: rot[id] || p.txt, dica: dic[id] || "" };
    }
    var f = (c.fragmentos || {})[id];
    if (!f || !f.h || f.h === "—") return null;
    /* O rótulo do fragmento é o título; a dica fica com a pergunta neutra da
       Mesa. Inventar dica aqui criaria texto novo fora do banco, que é
       exatamente o que a fonte única existe para impedir. */
    return { id: "frag-" + id, hora: f.h, txt: f.d, rotulo: f.t, dica: "" };
  }

  function rng(txt) {
    var h = 2166136261;
    for (var i = 0; i < txt.length; i++) { h ^= txt.charCodeAt(i); h = Math.imul(h, 16777619); }
    return function () {
      h += 0x6d2b79f5; var t = h;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  var cacheChave = "", cacheItens = null;

  /* Determinístico pelo código da sala e pela pergunta: os seis aparelhos
     montam a mesma rodada sem precisar de nada gravado. */
  function itens() {
    var c = caso(), cfg = cfgBanco(); if (!c || !cfg) return null;
    var codigo = (global.STATE && STATE.mesa && STATE.mesa.codigo) ||
                 (global.STATE && STATE.eu && STATE.eu.codigo) || "ensaio";
    var pid = (global.STATE && STATE.doc && STATE.doc.partidaId) ||
              (global.STATE && STATE.partidaId) || c.perguntaPadrao || "";
    var chave = codigo + "|" + pid + "|mosaico";
    if (chave === cacheChave && cacheItens) return cacheItens;

    var r = rng(chave);
    var pool = (cfg.pool || []).map(resolver).filter(Boolean);
    /* Embaralha, depois pega um por horário — assim o representante de cada
       instante também varia entre salas, não só o conjunto. */
    for (var i = pool.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)); var t = pool[i]; pool[i] = pool[j]; pool[j] = t; }
    var porSlot = {}, escolhidos = [];
    pool.forEach(function (x) {
      var s = minutos(x.hora);
      if (s < 0 || porSlot[s]) return;
      porSlot[s] = 1; escolhidos.push(x);
    });
    var quantos = Math.max(3, Number(cfg.itens) || 6);
    escolhidos = escolhidos.slice(0, quantos).sort(function (a, b) { return minutos(a.hora) - minutos(b.hora); });
    if (escolhidos.length < 3) return null;

    cacheChave = chave; cacheItens = escolhidos;
    return escolhidos;
  }

  /* ── Substituições ───────────────────────────────────────────────────── */

  /* O `txt` de um item do Mosaico é o que o modal de escolha imprime inteiro
     (`<span class="mo-texto">`). Para as públicas isso sempre foi inofensivo:
     elas já subiram no telão para todo mundo. Para FRAGMENTO não é — o
     Portador abriria a lista e leria o fato completo de peças que ninguém do
     núcleo conquistou, e o Mosaico viraria uma porta lateral para o dossiê.

     Então fragmento entra pelo TÍTULO. "As xícaras" diz que o acontecimento
     existe e a que horário pertence, que é o que o quebra-cabeça precisa;
     quantas xícaras eram continua só no Arquivo de quem foi buscar. */
  var pistasBase = global.pistasMosaico;
  global.pistasMosaico = function () {
    var lista = itens();
    if (!lista) return pistasBase();
    return lista.map(function (x) {
      var publica = x.id.indexOf("pub-") === 0;
      return { id: x.id, hora: x.hora, txt: publica ? x.txt : x.rotulo };
    });
  };

  var dicasBase = global.dicasMosaico;
  global.dicasMosaico = function () {
    var lista = itens();
    if (!lista) return dicasBase();
    return lista.map(function (x) {
      return { id: x.id, hora: x.hora, dica: x.dica || "Que acontecimento pertence a este hor&aacute;rio?" };
    });
  };

  var rotuloBase = global.rotuloPistaMosaico;
  global.rotuloPistaMosaico = function (p) {
    var lista = itens();
    var achado = lista && lista.find(function (x) { return x.id === (p && p.id); });
    return achado ? achado.rotulo : rotuloBase(p);
  };

  /* A apuração lê CASO.mosaico.ordemCorreta, e o Mestre a confere contra o
     rascunho do núcleo. Como a rodada agora é sorteada, a ordem canônica
     precisa acompanhar — e ela é a cronologia dos itens escolhidos. */
  function alinharOrdem() {
    var c = caso(), lista = itens();
    if (!c || !lista || !c.mosaico) return;
    c.mosaico.ordemCorreta = lista.map(function (x) { return x.id; });
  }

  var renderBase = global.render;
  global.render = function () { alinharOrdem(); return renderBase.apply(this, arguments); };

  global.MosaicoMosaicoCasa = { itens: itens, minutos: minutos, alinharOrdem: alinharOrdem };

  alinharOrdem();
})(window);
