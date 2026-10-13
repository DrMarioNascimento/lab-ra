/* A Manhã do Carro-Forte · as 15 variações da solução (Tarefa 4, 11/10/2026).

   Decisão do Mario (11/10): alternar as POSSIBILIDADES, não só as perguntas. A manhã tem um núcleo
   fixo (o malote 41, a câmera 3 cega, o saco vazio, 5,1 kg, a conferência das 8h40, nenhum roubo),
   e cada variação muda quem montou a janela, por quê, com que dinheiro, como a câmera caiu, como a
   Vigilância foi afastada, os lacres, a duração, a mentira e quem ajudou sem saber.

   Os dados vêm de variacoes-carro-dados.js (window.CARRO_VARIACOES), gerado pelo modelo; este arquivo
   só escolhe, aplica e distribui:
   - escolher(): no aparelho do Mestre, a variação menos jogada nesta mesa (localStorage);
   - aplicar(vid, refs, opts): troca, no lugar, os fragmentos, hipóteses, relações e perguntas da manhã;
   - casa(): quem estava na agência (pela faixa de jogadores: 10, 12, 14 ou 15 pessoas);
   - meusDepoimentos(): os depoimentos que só ESTE aparelho ouviu, cada um no tipo de fala sorteado;
   - noite(vid, refs): o mesmo para A Noite (perguntas e baralho);
   - nas páginas das atividades, ?var= na URL aplica os fragmentos da variação sozinho. */
(function (global) {
  "use strict";
  var D = global.CARRO_VARIACOES;
  if (!D) { console.warn("variações do Carro: dados ausentes"); return; }
  var CHAVE_USO = "carro:variacoes:uso";
  var ATUAL = null;

  function hash(t) { var h = 2166136261; t = String(t); for (var i = 0; i < t.length; i++) h = Math.imul(h ^ t.charCodeAt(i), 16777619) >>> 0; return h >>> 0; }
  function rng(chave) { var h = hash(chave); return function () { h = Math.imul(h ^ h >>> 15, 2246822507) >>> 0; h = Math.imul(h ^ h >>> 13, 3266489909) >>> 0; return ((h ^ h >>> 16) >>> 0) / 4294967296; }; }
  function mist(a, r) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function pessoa(id) { return (D.elenco || []).filter(function (e) { return e.id === id; })[0] || { id: id, nome: id, av: "" }; }
  function codigoSala() { var s = global.MOSAICO_ROOM; return (s && !s.local && s.code) || ""; }

  /* ── a escolha (Mestre) ── */
  function lerUso() { try { return JSON.parse(localStorage.getItem(CHAVE_USO) || "{}") || {}; } catch (e) { return {}; } }
  function marcarUso(id) { var u = lerUso(); u[id] = (u[id] || 0) + 1; try { localStorage.setItem(CHAVE_USO, JSON.stringify(u)); } catch (e) {} }
  function escolher(semente) {
    var ids = Object.keys(D.variacoes), uso = lerUso();
    var menor = Math.min.apply(null, ids.map(function (i) { return uso[i] || 0; }));
    var cand = mist(ids.filter(function (i) { return (uso[i] || 0) === menor; }), rng((semente || Date.now()) + "|carro-variacao"));
    marcarUso(cand[0]);
    return cand[0];
  }

  /* ── a casa: quem estava na agência ── */
  function faixa(n) { n = Number(n) || 1; return n <= 3 ? 10 : n <= 6 ? 12 : n <= 9 ? 14 : 15; }
  /* 12/10/2026 (Manhã v2): só entra na casa quem estava na agência naquela quinta (v.presentes:
     Manutenção nas semanas pares, Telefonia a cada quatro, Informática nas ímpares). */
  function casa(vid, nJogadores, codigo) {
    var v = D.variacoes[vid]; if (!v) return [];
    var pool = v.presentes || D.elenco.map(function (e) { return e.id; });
    var c = v.obrig.slice(), tam = Math.min(pool.length, Math.max(faixa(nJogadores), c.length));
    mist(pool.filter(function (id) { return c.indexOf(id) < 0; }), rng(codigo + "|" + vid + "|casa"))
      .forEach(function (id) { if (c.length < tam) c.push(id); });
    return c;
  }

  /* ── os 6 tipos de fala (Guia técnico §10): muda a forma, nunca a informação ── */
  var TIPOS = [
    { id: "explosivo", tom: "Alto e rápido, sem esperar a pergunta", fala: function (n) { return "“" + n + "” E bate com a mão no balcão."; } },
    { id: "calmo", tom: "Baixo, sem deixar ver o que sente", fala: function (n) { return "“" + n + "”"; } },
    { id: "ingenuo", tom: "Com surpresa, quase rindo de nervoso", fala: function (n) { return "“Gente… " + n.charAt(0).toLowerCase() + n.slice(1) + "”"; } },
    { id: "leal", tom: "Defendendo a equipe antes de qualquer acusação", fala: function (n) { return "“Ninguém aqui faria nada de errado. Mas " + n.charAt(0).toLowerCase() + n.slice(1) + "”"; } },
    { id: "evasivo", tom: "Olhando para os lados, como quem preferia não falar", fala: function (n) { return "“Não sei se importa… " + n + " Esqueçam que eu disse.”"; } },
    { id: "burocrata", tom: "Pausado, como quem dita para a ata", fala: function (n) { return "“Para constar: " + n.charAt(0).toLowerCase() + n.slice(1) + "”"; } }
  ];
  /* O "Nunca diria" da ficha é limite: se a moldura do tipo puser isso na boca do personagem,
     a fala daquele tipo usa a forma alternativa (mesmo tipo, mesmo tom, mesma informação). */
  var ALT = {
    explosivo: function (n) { return "“" + n + "” E cruza os braços, esperando resposta."; },
    calmo: function (n) { return "“" + n + "”"; },
    ingenuo: function (n) { return "“Olha… " + n.charAt(0).toLowerCase() + n.slice(1) + "”"; },
    leal: function (n) { return "“Eu confio em quem trabalha aqui. Ainda assim: " + n.charAt(0).toLowerCase() + n.slice(1) + "”"; },
    evasivo: function (n) { return "“Talvez não seja nada… " + n + "”"; },
    burocrata: function (n) { return "“Deixa eu dizer direito: " + n.charAt(0).toLowerCase() + n.slice(1) + "”"; }
  };
  function nunca(id) { var e = pessoa(id); return (e.ficha && e.ficha.nunca) || []; }
  function viola(txt, lista) { var t = String(txt).toLowerCase(); return lista.some(function (f) { return t.indexOf(String(f).toLowerCase()) >= 0; }); }
  function tipoDe(id, chave) { return TIPOS[hash(chave + "|tipo|" + id) % TIPOS.length]; }
  function falaDe(id, t, nucleo) { var f = t.fala(nucleo), l = nunca(id); return l.length && viola(f, l) ? ALT[t.id](nucleo) : f; }

  function depoimentos(vid, presentes, codigo) {
    var v = D.variacoes[vid]; if (!v) return [];
    return presentes.map(function (id) {
      var d = v.depoimentos[id], t = tipoDe(id, (codigo || "solo") + "|" + vid), p = pessoa(id);
      return { id: id, nome: p.nome, av: p.av, tipo: t.id, tom: t.tom, fala: falaDe(id, t, d.nucleo), nucleo: d.nucleo, papel: d.papel };
    });
  }
  /* Cada depoimento vai para UM aparelho: a mesa precisa conversar para juntar a mentira com o que
     a desmente. A ordem é a da entrada na sala (igual em todos os aparelhos); sem sala, tudo aqui. */
  function repartir(lista, vid, codigo, jogadores, meuId) {
    var n = Math.max(1, (jogadores || []).length), eu = 0;
    (jogadores || []).forEach(function (j, i) { if (j && j.id === meuId) eu = i; });
    /* 12/10/2026 (Manhã v2): quem fez, quem sabia, quem ajudou e quem esqueceu vão primeiro, um por
       aparelho; a rotina completa depois. Assim a mentira e o que a desmente caem em aparelhos
       diferentes sempre que a mesa tem mais de um. */
    var r = rng(codigo + "|" + vid + "|depo");
    var ordem = mist(lista.filter(function (d) { return d.papel !== "rotina"; }), r)
      .concat(mist(lista.filter(function (d) { return d.papel === "rotina"; }), r));
    return ordem.filter(function (_, i) { return i % n === eu; });
  }

  /* ── aplicar na manhã: troca no lugar (game.js guarda as referências em const) ── */
  function trocarArray(alvo, novo) { alvo.splice.apply(alvo, [0, alvo.length].concat(JSON.parse(JSON.stringify(novo)))); }
  function trocarObjeto(alvo, novo) { Object.keys(alvo).forEach(function (k) { delete alvo[k]; }); var c = JSON.parse(JSON.stringify(novo)); Object.keys(c).forEach(function (k) { alvo[k] = c[k]; }); }
  function aplicarFragmentos(F, vid) { var v = D.variacoes[vid]; if (v && F) trocarObjeto(F, v.fragmentos); }
  function aplicar(vid, refs, opts) {
    var v = D.variacoes[vid]; if (!v) return null;
    opts = opts || {};
    var codigo = opts.codigo != null ? opts.codigo : codigoSala();
    if (refs.FRAGMENTOS) aplicarFragmentos(refs.FRAGMENTOS, vid);
    if (refs.HIPOTESES) trocarArray(refs.HIPOTESES, v.hipoteses);
    if (refs.RELACOES) trocarArray(refs.RELACOES, v.relacoes);
    if (refs.PARTIDAS) {
      var P = JSON.parse(JSON.stringify(v.partidas));
      Object.keys(P).forEach(function (k) { delete P[k].principal; P[k].fields = P[k].fields.map(function (f) { return [f[0], f[1], f[2]]; }); });
      trocarObjeto(refs.PARTIDAS, P);
    }
    var sala = global.MOSAICO_ROOM, jogs = (sala && !sala.local && sala.players) || [];
    var uid = "";
    try { uid = (global.DragonSala && global.DragonSala.auth && global.DragonSala.auth.currentUser && global.DragonSala.auth.currentUser.uid) || ""; } catch (e) {}
    var presentes = casa(vid, opts.jogadores || jogs.length || 1, codigo);
    var todos = depoimentos(vid, presentes, codigo);
    ATUAL = { vid: vid, presentes: presentes, todos: todos, meus: codigo ? repartir(todos, vid, codigo, jogs, uid) : todos };
    return ATUAL;
  }

  /* ── A Noite: perguntas e baralho da mesma variação ── */
  function noite(vid, refs) {
    var v = D.variacoes[vid]; if (!v) return false;
    if (refs.QUESTIONS) trocarObjeto(refs.QUESTIONS, v.noite);
    if (refs.FRAGMENTS) trocarArray(refs.FRAGMENTS, Object.keys(v.fragmentos).sort().map(function (k) { return { id: k, title: v.fragmentos[k].t, text: v.fragmentos[k].d }; }));
    ATUAL = ATUAL || { vid: vid };
    return true;
  }

  global.CarroVariacoes = {
    dados: function () { return D; }, escolher: escolher, marcarUso: marcarUso, casa: casa, faixa: faixa,
    aplicar: aplicar, aplicarFragmentos: aplicarFragmentos, noite: noite, tipos: TIPOS, tipoDe: tipoDe,
    atual: function () { return ATUAL; },
    narracao: function () { var v = ATUAL && D.variacoes[ATUAL.vid]; return (v && v.narracao) || null; },
    meusDepoimentos: function () { return (ATUAL && ATUAL.meus) || []; },
    presentes: function () { return ((ATUAL && ATUAL.presentes) || []).map(pessoa); },
    pessoa: pessoa
  };

  /* Nas páginas das atividades (janela, vidro, sala): ?var= aplica os fragmentos da variação. */
  try {
    var q = new URLSearchParams(location.search).get("var");
    if (q && D.variacoes[q] && global.MOSAICO_FRAGMENTOS) aplicarFragmentos(global.MOSAICO_FRAGMENTOS, q);
  } catch (e) {}
})(window);
