/* MOSAICO · A CASA DA COSTA — as 15 variações e o elenco de 15 (Tarefa 4, 11/10/2026).
   ==========================================================================
   Decisão do Mario (11/10): alternar as POSSIBILIDADES, não só as perguntas.
   Em toda partida há uma pessoa a mais escondida na casa; muda quem era,
   quem SABIA E ACOBERTOU (um dos 15 personagens, nunca um humano), onde,
   há quanto tempo, por quê e o que fez no escuro. As seis perguntas
   continuam, cada uma com a resposta da variação; "perceber" passou a ser
   "Quem sabia?".

   O elenco: os SEIS convocados (núcleo, sempre na casa; a narração gravada
   diz seis), os funcionários presos pela chuva (Governanta/Mordomo, Chefe
   de Cozinha, Jardineiro, Eletricista, Barqueiro) e os profissionais que
   chegam DEPOIS do apagão (Tabelião, Advogado, Médico, Enfermeiro). Mesa
   pela faixa de humanos: 1–3 → 8 personagens, 4–6 → 10, 7–9 → 12, 10–12 → 15.

   Como funciona:
   - o conteúdo mora em casos/casa-da-costa-variacoes.json, gerado por
     vc/orig/casa/modelo/gerar.py; este arquivo não inventa fato nenhum;
   - o Mestre, ao Iniciar, escolhe a variação (a menos usada neste aparelho
     entre as que têm o responsável fora dos humanos) e o elenco na casa, e
     grava os dois na sala (variacaoId, elencoCasa);
   - cada aparelho, quando a sala traz a variação, refaz o caso a partir da
     cópia intacta + a variação, resolve os nomes com a forma de cada
     personagem nesta partida e chama aplicarCaso de novo;
   - cada personagem recebe um dos 6 tipos de fala pela semente: a
     informação da fala nunca muda, só a forma (PADRÃO §8.2).
   Tokens: {@id} nome com artigo, {@^id} idem com maiúscula, {#id} nome,
           {de:id} do/da + nome, {pelo:id} pelo/pela + nome, {g:id:fem|masc}. */
(function (global) {
  "use strict";
  var VAR = null, BASE = null, APLICADA = "", CHAVE_USO = "casa:variacoes:uso";
  var NUCLEO = ["investigador", "herdeiro", "jornalista", "morador", "policial", "menina"];

  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function hash(t) { var h = 2166136261; t = String(t); for (var i = 0; i < t.length; i++) h = Math.imul(h ^ t.charCodeAt(i), 16777619) >>> 0; return h >>> 0; }
  function rng(t) { var h = hash(t); return function () { h = Math.imul(h ^ (h >>> 15), 2246822519) >>> 0; h = (h + 0x6D2B79F5) >>> 0; return ((h ^ (h >>> 13)) >>> 0) / 4294967296; }; }
  function mist(a, r) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)), x = a[i]; a[i] = a[j]; a[j] = x; } return a; }
  function codigoSala() { return (global.STATE && ((STATE.eu && STATE.eu.codigo) || (STATE.mesa && STATE.mesa.codigo))) || "solo"; }
  function faixa(n) { return n <= 3 ? 8 : n <= 6 ? 10 : n <= 9 ? 12 : 15; }
  var TODOS = NUCLEO.concat(["governanta", "chefe_de_cozinha", "jardineiro", "eletricista", "barqueiro", "tabeliao", "advogado", "medico", "enfermeira"]);
  function elencoIds() { return VAR ? VAR.elenco.map(function (e) { return e.id; }) : TODOS.slice(); }
  function grupoDe(id) { var e = VAR && VAR.elenco.filter(function (x) { return x.id === id; })[0]; return e ? e.grupo : "nucleo"; }

  /* ── carregar o arquivo das variações e pôr o elenco de 15 no jogo ── */
  var NA_MESA = !/\/solo\//.test(location.pathname); /* a Mesa carrega este arquivo antes do script principal: STATE ainda não existe */
  function carregarArquivo(prefixo) {
    return fetch((prefixo || "") + "casos/casa-da-costa-variacoes.json?v=" + (global.MOSAICO_VERSAO || "20261011-t4"))
      .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
      .then(function (v) { VAR = v; return v; });
  }
  var pronto = !NA_MESA ? Promise.resolve(null) : new Promise(function (res) {
    function tentar() {
      if (!global.CASO_PRONTO) { setTimeout(tentar, 80); return; }
      fetch("casos/casa-da-costa-variacoes.json?v=" + (global.MOSAICO_VERSAO || "t4"))
        .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
        .then(function (v) {
          VAR = v; BASE = clone(global.CASO);
          /* o elenco de 15 vale desde a entrada: os nomes e as descrições dos extras precisam existir antes do sorteio */
          global.CASO.elenco = clone(v.elenco); BASE.elenco = clone(v.elenco);
          if (typeof global.aplicarCaso === "function") global.aplicarCaso(global.CASO);
          res(v); if (typeof global.render === "function") global.render(true);
        })
        .catch(function (e) { console.error("variações da Casa", e); res(null); });
    }
    tentar();
  });

  /* ── a escolha da variação e do elenco (no aparelho do Mestre, ao Iniciar) ── */
  function lerUso() { try { return JSON.parse(localStorage.getItem(CHAVE_USO) || "{}") || {}; } catch (e) { return {}; } }
  function marcarUso(id) { var u = lerUso(); u[id] = (u[id] || 0) + 1; try { localStorage.setItem(CHAVE_USO, JSON.stringify(u)); } catch (e) {} }
  /* preferida: a variação reservada quando o Mestre abriu a sala (o sorteio dos personagens já a evitou);
     vale se quem acobertou continuar fora das mãos humanas — senão, a menos jogada entre as válidas */
  function escolher(codigo, humanos, preferida) {
    if (!VAR) return null;
    var hum = {}; (humanos || []).forEach(function (id) { hum[id] = 1; });
    var uso = lerUso(), r = rng(codigo + "|variacao");
    var validas = Object.keys(VAR.variacoes).filter(function (id) { return !hum[VAR.variacoes[id].resp]; });
    if (!validas.length) return null;
    var vid;
    if (preferida && validas.indexOf(preferida) >= 0) vid = preferida;
    else {
      var menor = Math.min.apply(null, validas.map(function (id) { return uso[id] || 0; }));
      vid = mist(validas.filter(function (id) { return (uso[id] || 0) === menor; }), r)[0];
    }
    var resp = VAR.variacoes[vid].resp;
    /* a casa: o núcleo, os personagens dos humanos, o responsável e extras pela semente até a faixa */
    var n = (humanos || []).length, tam = faixa(n), casa = NUCLEO.slice();
    (humanos || []).concat([resp]).forEach(function (id) { if (casa.indexOf(id) < 0) casa.push(id); });
    mist(elencoIds().filter(function (id) { return casa.indexOf(id) < 0; }), rng(codigo + "|elenco")).forEach(function (id) { if (casa.length < tam) casa.push(id); });
    return { variacaoId: vid, elencoCasa: casa };
  }
  global.CasaVariacoes = {
    pronto: pronto,
    escolher: function (codigo, humanos, preferida) { var e = escolher(codigo, humanos, preferida); if (e) marcarUso(e.variacaoId); return e; },
    escolherSemMarcar: escolher,
    /* quem acobertou numa variação (para o sorteio dos personagens humanos evitar) */
    respDe: function (vid) { return (VAR && vid && VAR.variacoes[vid] && VAR.variacoes[vid].resp) || null; },
    dados: function () { return VAR; },
    aplicada: function () { return APLICADA; }
  };

  /* ── os nomes com a forma de cada personagem nesta partida ── */
  var FORMAS = {};
  function formaDe(id) { return FORMAS[id] || "m"; }
  function nomeDe(id) {
    var e = VAR && VAR.elenco.filter(function (x) { return x.id === id; })[0]; if (!e) return id;
    var m = /^\{([^|}]*)\|([^}]*)\}$/.exec(e.nome); return m ? (formaDe(id) === "f" ? m[2] : m[1]) : e.nome;
  }
  function art(id) { return formaDe(id) === "f" ? "a" : "o"; }
  function resolver(t) {
    if (typeof t !== "string" || t.indexOf("{") < 0) return t;
    return t
      .replace(/\{@\^([a-z_]+)\}/g, function (_, id) { var s = art(id) + " " + nomeDe(id); return s.charAt(0).toUpperCase() + s.slice(1); })
      .replace(/\{@([a-z_]+)\}/g, function (_, id) { return art(id) + " " + nomeDe(id); })
      .replace(/\{#([a-z_]+)\}/g, function (_, id) { return nomeDe(id); })
      .replace(/\{de:([a-z_]+)\}/g, function (_, id) { return (formaDe(id) === "f" ? "da " : "do ") + nomeDe(id); })
      .replace(/\{pelo:([a-z_]+)\}/g, function (_, id) { return (formaDe(id) === "f" ? "pela " : "pelo ") + nomeDe(id); })
      .replace(/\{g:([a-z_]+):([^|}]*)\|([^}]*)\}/g, function (_, id, f, m) { return formaDe(id) === "f" ? f : m; });
  }
  function resolverTudo(o) {
    if (typeof o === "string") return resolver(o);
    if (Array.isArray(o)) return o.map(resolverTudo);
    if (o && typeof o === "object") { var r = {}; for (var k in o) r[k] = resolverTudo(o[k]); return r; }
    return o;
  }

  /* ── os 6 tipos de fala: a informação não muda, só a forma ── */
  var TIPOS = [
    { id: "explosivo", tom: "Alto e rápido, sem esperar resposta", fala: function (n) { return "“" + n + "” E bate com a mão na mesa."; } },
    { id: "calmo", tom: "Baixo, sem deixar ver o que sente", fala: function (n) { return "“" + n + "”"; } },
    { id: "ingenuo", tom: "Surpres{g}, quase rindo de nervoso", fala: function (n) { return "“Gente… " + n.charAt(0).toLowerCase() + n.slice(1) + "”"; } },
    { id: "leal", tom: "Defendendo o grupo antes de qualquer acusação", fala: function (n) { return "“Ninguém aqui faria nada de errado. Mas " + n.charAt(0).toLowerCase() + n.slice(1) + "”"; } },
    { id: "evasivo", tom: "Olhando para os lados, como quem preferia não falar", fala: function (n) { return "“Não sei se importa… " + n + " Esqueçam que eu disse.”"; } },
    { id: "burocrata", tom: "Pausado, como quem dita para a ata", fala: function (n) { return "“Para constar: " + n.charAt(0).toLowerCase() + n.slice(1) + "”"; } }
  ];
  /* 11/10/2026: o "Nunca diria" da ficha é limite (Guia técnico §10). Se a moldura do tipo puser na boca do
     personagem algo que a ficha diz que ele nunca diria, a fala daquele tipo usa a forma alternativa —
     mesmo tipo, mesmo tom, mesma informação. */
  var ALT = {
    explosivo: function (n) { return "“" + n + "” E cruza os braços, esperando resposta."; },
    calmo: function (n) { return "“" + n + "”"; },
    ingenuo: function (n) { return "“Olha… " + n.charAt(0).toLowerCase() + n.slice(1) + "”"; },
    leal: function (n) { return "“Eu confio em quem está nesta sala. Ainda assim: " + n.charAt(0).toLowerCase() + n.slice(1) + "”"; },
    evasivo: function (n) { return "“Talvez não seja nada… " + n + "”"; },
    burocrata: function (n) { return "“Deixa eu dizer direito: " + n.charAt(0).toLowerCase() + n.slice(1) + "”"; }
  };
  function nuncaDe(id) {
    var e = VAR && (VAR.elenco || []).filter(function (x) { return x.id === id; })[0];
    return (e && e.ficha && e.ficha.nunca) || [];
  }
  function viola(txt, nunca) {
    var t = String(txt || "").toLowerCase();
    return nunca.some(function (f) { return t.indexOf(String(f).toLowerCase()) >= 0; });
  }
  function falaDe(id, t, nucleo) {
    var f = t.fala(nucleo), nunca = nuncaDe(id);
    return nunca.length && viola(f, nunca) ? ALT[t.id](nucleo) : f;
  }
  function tipoDe(id, codigo) { return TIPOS[hash(codigo + "|tipo|" + id) % TIPOS.length]; }
  function roteiro(id, r, codigo) {
    var t = tipoDe(id, codigo);
    return {
      resumo: r.resumo, acao: r.acao || "Fique de pé, olhe ao redor e fale para a mesa.", rub: r.rub || "",
      tom: t.tom.replace("{g}", formaDe(id) === "f" ? "a" : "o"), fala: falaDe(id, t, r.nucleo), pos: r.pos || "",
      tipo: t.id, sinal: r.sinal, nucleo: r.nucleo
    };
  }

  /* ── aplicar: cópia intacta + variação, nomes resolvidos, aplicarCaso ── */
  /* montar: a cópia intacta do caso + a variação, com os nomes resolvidos (puro: serve à Mesa e ao Solo) */
  function montar(base, vid, casa, formas, codigo, jogados) {
    if (!VAR || !base || !VAR.variacoes[vid]) return null;
    var v = VAR.variacoes[vid]; FORMAS = formas || {};
    var c = clone(base);
    ["fragmentos", "partidas", "hipoteses", "pares", "publicas", "selecao", "revelacaoFinal", "realidadeCanonica", "historia", "tarefas"].forEach(function (k) { if (v[k]) c[k] = clone(v[k]); });
    c.elenco = VAR.elenco.filter(function (e) { return casa.indexOf(e.id) >= 0; }).map(function (e) {
      var x = clone(e); x.nome = nomeDe(e.id); x.desc = String(e.desc || "").replace(/\{([^|}]*)\|([^}]*)\}/g, function (_, m, fe) { return formaDe(e.id) === "f" ? fe : m; });
      x.sistema = (jogados || []).indexOf(e.id) < 0;
      return x;
    });
    /* "Quem sabia?": a certa e três que estão na casa, pela semente */
    var q = c.partidas.perceber && c.partidas.perceber.campos.filter(function (x) { return x.id === "quem"; })[0];
    if (q && q.elenco) {
      var outros = mist(q.elenco.slice(1).filter(function (id) { return casa.indexOf(id) >= 0; }), rng(codigo + "|quem"));
      q.opcoes = ["{#" + q.elenco[0] + "}"].concat(outros.slice(0, 3).map(function (id) { return "{#" + id + "}"; }));
      delete q.elenco;
    }
    c = resolverTudo(c);
    c.roteiros = {};
    Object.keys(v.roteiros).forEach(function (id) { if (casa.indexOf(id) >= 0) c.roteiros[id] = roteiro(id, resolverTudo(v.roteiros[id]), codigo); });
    c.variacao = { id: vid, resp: v.resp, casa: casa.slice() };
    return c;
  }
  function aplicar(vid, casa, formas, codigo) {
    var jogados = (global.STATE && STATE.jogadores || []).map(function (j) { return j && j.personagem; }).filter(Boolean);
    var c = montar(BASE, vid, casa, formas, codigo, jogados); if (!c) return false;
    APLICADA = vid + "|" + casa.join(",");
    global.aplicarCaso(c);
    return true;
  }
  function formasDaMesa(casa, codigo) {
    var f = {};
    (global.STATE && STATE.jogadores || []).forEach(function (j) { if (j && j.personagem && (j.forma === "f" || j.forma === "m")) f[j.personagem] = j.forma; });
    casa.forEach(function (id) {
      if (f[id]) return;
      f[id] = typeof global.formaDaCasa === "function" ? global.formaDaCasa("n", "sis-" + id, codigo) : (hash(codigo + "|" + id) % 2 ? "f" : "m");
    });
    return f;
  }
  function cenasDoSistema() {
    var c = global.CASO, v = c && c.variacao; if (!v) return [];
    var jog = {}; (global.STATE && STATE.jogadores || []).forEach(function (j) { if (j && j.personagem) jog[j.personagem] = 1; });
    return v.casa.filter(function (id) { return !jog[id] && c.roteiros && c.roteiros[id]; }).map(function (id, i) {
      var r = c.roteiros[id], n = (formaDe(id) === "f" ? "A " : "O ") + nomeDe(id);
      return { id: "sis-" + id, hora: "21:3" + Math.min(9, i), txt: n + " (" + r.tom.charAt(0).toLowerCase() + r.tom.slice(1) + "): " + r.fala, autor: "a casa" };
    });
  }
  async function publicarCenasDoSistema(codigo) {
    var FB = global.MosaicoFB || (typeof global.esperarFB === "function" ? await esperarFB() : null);
    if (!FB || !FB.publicar) return;
    var cenas = cenasDoSistema();
    for (var i = 0; i < cenas.length; i++) await FB.publicar(codigo, 100 + i, { hora: cenas[i].hora, txt: cenas[i].txt, autor: cenas[i].autor, ordem: 100 + i });
  }
  global.CasaVariacoes.cenasDoSistema = cenasDoSistema;
  global.CasaVariacoes.aplicar = aplicar;
  /* o Solo: sem sala nem humanos com personagem; a casa é a da faixa A (8), a variação a menos usada neste aparelho */
  global.CasaVariacoesSolo = {
    _caso: null,
    preparar: function (base, vidGuardada) {
      return carregarArquivo("../../../jogos/casa-da-costa/a-mesa/").then(function () {
        var cod = "solo-" + (vidGuardada || Date.now().toString(36));
        var esc = vidGuardada && VAR.variacoes[vidGuardada] ? { variacaoId: vidGuardada } : escolher(cod, []);
        if (!esc) return null;
        if (!vidGuardada) marcarUso(esc.variacaoId);
        var vid = esc.variacaoId, resp = VAR.variacoes[vid].resp, casa = NUCLEO.slice();
        if (casa.indexOf(resp) < 0) casa.push(resp);
        mist(elencoIds().filter(function (id) { return casa.indexOf(id) < 0; }), rng(vid + "|solo")).forEach(function (id) { if (casa.length < 8) casa.push(id); });
        var formas = {}; casa.forEach(function (id) { formas[id] = hash(vid + "|forma|" + id) % 2 ? "f" : "m"; });
        var c = montar(base, vid, casa, formas, "solo-" + vid, []);
        global.CasaVariacoesSolo._caso = c;
        return c;
      });
    },
    caso: function () { return global.CasaVariacoesSolo._caso; }
  };
  global.CasaVariacoes.resolver = function (t) { return resolver(t); };
  global.CasaVariacoes.tipos = function () { return TIPOS.map(function (t) { return t.id; }); };
  global.CasaVariacoes.tipoDe = function (id) { return tipoDe(id, codigoSala()).id; };

  var APLICADA_F = "";
  /* ── a casa escolhe o personagem: primeiro os seis convocados, depois os extras; nunca repete ── */
  function sortearPersonagemCasa(ocupados) {
    var oc = {}; (ocupados || []).forEach(function (id) { oc[id] = 1; });
    var livresN = NUCLEO.filter(function (id) { return !oc[id]; });
    var livres = livresN.length ? livresN : elencoIds().filter(function (id) { return !oc[id]; });
    if (!livres.length) return null;
    return livres[(Math.random() * livres.length) | 0];
  }

  /* a cada desenho: se a sala já tem variação e ela ainda não foi aplicada aqui, aplica */
  function instalarRender() {
  var renderBase = global.render;
  global.render = function () {
    try {
      var d = global.STATE && STATE.doc;
      if (VAR && d && d.variacaoId && Array.isArray(d.elencoCasa)) {
        var chave = d.variacaoId + "|" + d.elencoCasa.join(",");
        var formas = formasDaMesa(d.elencoCasa, codigoSala());
        var chaveF = chave + "|" + JSON.stringify(formas);
        if (APLICADA_F !== chaveF) { aplicar(d.variacaoId, d.elencoCasa, formas, codigoSala()); APLICADA_F = chaveF; }
      }
    } catch (e) { console.error("variação da Casa", e); }
    return renderBase.apply(this, arguments);
  };
  }
  /* o script principal da Mesa declara render e sortearPersonagem depois deste arquivo:
     as trocas só entram quando o caso chegou (o script principal já rodou) */
  if (NA_MESA) (function instalar() {
    if (!global.CASO_PRONTO || typeof global.render !== "function") { setTimeout(instalar, 60); return; }
    global.sortearPersonagem = sortearPersonagemCasa;
    instalarRender();
    /* "Os personagens do jogo são:" mostra todos os que estão na casa, não só os jogados */
    var elencoBase = global.elencoEmJogo;
    if (typeof elencoBase === "function") global.elencoEmJogo = function (jog, elenco) {
      var v = global.CASO && global.CASO.variacao;
      if (v && Array.isArray(v.casa)) return (elenco && elenco.length ? elenco : global.PERSONAGENS).filter(function (p) { return v.casa.indexOf(p.id) >= 0; });
      return elencoBase.apply(this, arguments);
    };
    /* ao fim da última vez, a casa narra as cenas de quem ninguém joga (Mestre publica na linha pública) */
    var vezBase = global.avancarVez;
    if (typeof vezBase === "function") global.avancarVez = async function (codigo, autor) {
      var js = global.ordenados ? ordenados(STATE.jogadores) : (STATE.jogadores || []);
      var vez = (STATE.doc && STATE.doc.vez) || 0, ultima = vez + 1 >= js.length;
      var r = await vezBase.apply(this, arguments);
      if (ultima) { try { await publicarCenasDoSistema(codigo); } catch (e) { console.error("cenas do sistema", e); } }
      return r;
    };
  })();

})(window);
