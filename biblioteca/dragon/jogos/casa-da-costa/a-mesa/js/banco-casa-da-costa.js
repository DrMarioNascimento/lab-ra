/* MOSAICO — A Casa da Costa · banco modular na Mesa
   Edição Técnica Consolidada (02/09/2026), §13 a §20.

   O caso passou a carregar, dentro de casa-da-costa.json, o banco F01–F36 com
   função declarada, as hipóteses concorrentes H1–H10, as relações R1–R10, os
   pares entre celulares P-A…P-G, a proteção de fechamento e a modulação de
   duração. Esta camada é quem gasta esse material na Mesa:

   1. a PISTA PRIVADA de cada personagem deixa de ser um texto fixo e passa a
      sair do banco, escolhida pela pergunta em jogo — e sempre como METADE de
      um par, para que nenhuma mão inicial feche sozinha (§17);
   2. o dossiê é montado em três terços amarrados às fases — nenhuma pista de
      fechamento no primeiro, no máximo duas no segundo (§18) — e cada terço é
      o POOL de onde as atividades tiram o lote de cada jogador.

   NÃO existe painel coletivo aqui, e é decisão. Cheguei a construir um
   "Dossiê da noite" no Arquivo: ele montava a MESMA lista em todos os
   aparelhos, o que anulava a distribuição — seis telas privadas com os mesmos
   nove fragmentos deixam todos sabendo o mesmo, e o lote vira decoração.
   Mario, 02/09/2026: "isso não era para existir". O celular mostra o que é
   daquela pessoa; o telão mostra o que já era público.

   NADA AQUI INVENTA FATO. Todo texto vem do banco do caso.

   Determinismo é requisito, não elegância: seis aparelhos calculam a mesma
   distribuição porque a semente é o código da sala mais a pergunta gravada
   nela. Sorteio local daria a cada telefone um dossiê diferente, e a Mesa
   passaria a discutir evidências que os outros não têm. */
(function (global) {
  "use strict";

  function caso() { return global.CASO || null; }
  function banco() { var c = caso(); return (c && c.fragmentos) || null; }

  function partidaId() {
    var c = caso(); if (!c) return "";
    var id = (global.STATE && STATE.doc && STATE.doc.partidaId) ||
             (global.STATE && STATE.partidaId) || c.perguntaPadrao || "sete";
    return (c.partidas && c.partidas[id]) ? id : (c.perguntaPadrao || "sete");
  }

  /* A semente é da MESA, não do aparelho. Sem o código da sala — no ensaio
     local, antes de abrir mesa — cai na própria pergunta, que ainda é igual
     para quem estiver junto naquele aparelho. */
  function semente() {
    var codigo = (global.STATE && STATE.mesa && STATE.mesa.codigo) ||
                 (global.STATE && STATE.eu && STATE.eu.codigo) || "ensaio";
    return codigo + "|" + partidaId();
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
  function embaralhar(lista, r) {
    var a = lista.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }

  /* Duração por tamanho de mesa (§19). Mais gente não significa partida mais
     longa: significa mais dispersão, que é o que o número de fragmentos
     controla. */
  function duracao() {
    var c = caso(), d = (c && c.duracoes) || null; if (!d) return null;
    var n = (global.STATE && STATE.jogadores && STATE.jogadores.length) || 1;
    if (n >= 11 && d.mesa) return d.mesa;
    if (n >= 9 && d.longa) return d.longa;
    if (n <= 4 && d.curta) return d.curta;
    return d.padrao || d.curta || d.longa;
  }

  function selecao() {
    var c = caso(); return (c && c.selecao && c.selecao[partidaId()]) || { centrais: [], incidentais: [], derruba: [] };
  }
  function fecho(cod) { var b = banco(); return !!(b && b[cod] && b[cod].fecho); }

  /* ── Relações: cada peça é um grupo de alternativas; basta um código do
        grupo estar aberto para a peça contar. */
  function faltantes(rel, tem) {
    return rel.pecas.filter(function (g) { return !g.some(function (c) { return tem[c]; }); })
      .map(function (g) { return g[0]; });
  }
  function relacaoCompleta(rel, tem) { return faltantes(rel, tem).length === 0; }

  /* ── Montagem do dossiê ────────────────────────────────────────────────
     Ordem: centrais da pergunta, depois o que fecha as relações garantidas,
     depois preenchimento por função (contextual entra por último, incidental
     da pergunta é empurrado para o fim). */
  var cacheChave = "", cacheDossie = null;

  function dossie() {
    var b = banco(), c = caso(); if (!b || !c) return null;
    var chave = semente() + "|" + ((global.STATE && STATE.jogadores && STATE.jogadores.length) || 1);
    if (chave === cacheChave && cacheDossie) return cacheDossie;

    var r = rng(chave), sel = selecao(), cfg = duracao() || { n: 18, rel: 4 };
    var tem = {}, lista = [];
    function por(cod) { if (b[cod] && !tem[cod]) { tem[cod] = 1; lista.push(cod); } }

    embaralhar(sel.centrais || [], r).forEach(por);

    var relacoes = (c.relacoes || []).slice().sort(function (x, y) {
      return faltantes(x, tem).length - faltantes(y, tem).length;
    });
    var garantidas = 0;
    relacoes.forEach(function (rel) {
      if (garantidas >= cfg.rel) return;
      if (relacaoCompleta(rel, tem)) { garantidas++; return; }
      faltantes(rel, tem).forEach(por);
      garantidas++;
    });

    var peso = { estrutural: 0, interpretativo: 0.3, relacional: 0.5, contextual: 1.2 };
    var resto = Object.keys(b).filter(function (cod) { return !tem[cod]; });
    resto.sort(function (x, y) {
      var px = (peso[b[x].f] || 1) + ((sel.incidentais || []).indexOf(x) >= 0 ? 2 : 0) + r();
      var py = (peso[b[y].f] || 1) + ((sel.incidentais || []).indexOf(y) >= 0 ? 2 : 0) + r();
      return px - py;
    });
    resto.forEach(function (cod) { if (lista.length < cfg.n) por(cod); });

    cacheChave = chave;
    cacheDossie = { lista: lista, tercos: tercos(lista, rng(chave + "|t")), cfg: cfg };
    return cacheDossie;
  }

  /* §18 — o primeiro terço não recebe nenhuma pista de fechamento e o segundo
     recebe no máximo duas. Sem isso, uma única leva entrega a contagem, a
     duração e a localização de uma vez, e a partida acaba antes da discussão. */
  function tercos(lista, r) {
    var c = caso(), lim = (c.protecao && c.protecao.maxFechoPorTerco) || { primeiro: 0, segundo: 2 };
    var fechos = embaralhar(lista.filter(fecho), r);
    var livres = embaralhar(lista.filter(function (x) { return !fecho(x); }), r);
    var tam = Math.ceil(lista.length / 3), t = [[], [], []];
    while (t[0].length < tam && livres.length) t[0].push(livres.shift());
    for (var i = 0; i < (lim.segundo || 0) && fechos.length && t[1].length < tam; i++) t[1].push(fechos.shift());
    while (t[1].length < tam && livres.length) t[1].push(livres.shift());
    t[2] = livres.concat(fechos);
    return [embaralhar(t[0], r), embaralhar(t[1], r), embaralhar(t[2], r)];
  }

  /* O terço aberto acompanha a fase da noite: o dossiê cresce junto com a
     partida, e não de uma vez na entrada. */
  /* CADA ATIVIDADE ABRE UM TERÇO. Na primeira versão as duas caíam no
     primeiro: numa mesa de seis isso era trinta saques sobre os cinco mesmos
     fragmentos, enquanto dois terços do dossiê não tinham porta de entrada
     nenhuma. Agora a noite tem três ondas com três donos:

       terço 1  —  distribuído pela PRIMEIRA atividade
       terço 2  —  distribuído pela SEGUNDA atividade
       terço 3  —  a onda de fechamento, COLETIVA, no Mercado

     O terceiro é coletivo de propósito: é onde moram as pistas de fechamento,
     e elas nunca entram em lote pessoal. O que se ganha jogando bem é
     vantagem de leitura; a chave da resposta chega para a mesa inteira. */
  var TERCO_POR_FASE = {
    sala: 0, escuro: 1, cena: 1, encenacao: 1, votacao: 1, performance: 1,
    inclinacao: 1, constelacao: 2, mosaico: 2, cooperacao: 2,
    mercado: 3, deducao: 3, resultado: 3, historia: 3
  };
  function tercoAberto() {
    var fase = (global.STATE && STATE.doc && STATE.doc.fase) || "sala";
    var n = TERCO_POR_FASE[fase]; return n == null ? 1 : n;
  }
  function abertos() {
    var d = dossie(); if (!d) return [];
    return d.tercos.slice(0, tercoAberto()).reduce(function (a, x) { return a.concat(x); }, []);
  }

  /* ── Pares entre celulares (§17) ───────────────────────────────────────
     Um par PODE carregar pista de fechamento: é exatamente para isso que ele
     existe. A metade que fecha vai para um telefone e a referência que a torna
     legível vai para outro, e nenhuma das duas resolve sozinha — o hidrômetro
     sem a rotina do caseiro não diz de quem é o consumo.

     O que a proteção do §18 proíbe é CONCENTRAÇÃO: dois membros do mesmo
     conjunto protegido chegando ao mesmo pequeno grupo. Essa é a regra que
     vale aqui, e ela é conferida sobre a mão inteira, não par a par.

     A primeira versão desta camada barrava qualquer par com metade de
     fechamento. O efeito colateral só apareceu na simulação: a pergunta dos
     cinco meses ficava sem nenhum par relevante — P-A é o par da duração — e
     a mão inicial dela vinha falando de apagão. */
  function paresElegiveis() { var c = caso(); return (c.pares || []).slice(); }

  var AFINIDADE = {
    investigador: ["F04", "F23", "F21", "F05", "F24", "F25"],
    herdeiro: ["F02", "F01", "F03", "F31", "F32", "F28"],
    morador: ["F33", "F13", "F14", "F16", "F15", "F17", "F29"],
    jornalista: ["F06", "F08", "F27", "F26", "F19", "F35"],
    policial: ["F07", "F20", "F26", "F25", "F16", "F21"],
    menina: ["F10", "F11", "F34", "F18", "F36", "F30", "F12"]
  };

  /* Reescreve PISTA_PRIVADA a partir do banco. Cada personagem recebe uma
     metade de par; quem sobrar recebe um fragmento avulso da pergunta. */
  function distribuirPrivadas() {
    var b = banco(), c = caso(); if (!b || !c || !global.PISTA_PRIVADA) return;
    var elenco = (c.elenco || []).map(function (p) { return p.id; });
    /* 11/10/2026 (Tarefa 4): com o elenco de 15, a pista privada vai só para quem é jogado por
       humano — metade de par entregue a personagem do sistema seria pista perdida. Sem jogadores
       ainda (ensaio), vale o elenco inteiro. */
    var jogados = ((global.STATE && STATE.jogadores) || []).map(function (j) { return j && j.personagem; })
      .filter(function (p, i, a) { return p && a.indexOf(p) === i && elenco.indexOf(p) >= 0; });
    if (jogados.length) elenco = jogados;
    if (!elenco.length) return;

    var r = rng(semente() + "|priv"), sel = selecao();
    var relev = function (cod) { return (sel.centrais || []).indexOf(cod) >= 0 ? 0 : 1; };
    var pares = embaralhar(paresElegiveis(), r).sort(function (x, y) {
      return (relev(x.a.f) + relev(x.b.f)) - (relev(y.a.f) + relev(y.b.f));
    });

    var metades = [], vistos = {};
    /* §18 — cada conjunto protegido é uma lista de UNIDADES, e a proibição só
       vale quando todas as unidades têm representante na mesma mão. Xícaras +
       contrato + rotina contínua fecham a contagem juntos; xícaras sozinhas,
       não. Modelar isso como "dois códigos quaisquer do conjunto" chegou a
       barrar o par P-D, em que F08 e F09 são a MESMA unidade — a identidade
       partida em duas metades, que é o que o §17 pede. */
    var grupos = (c.protecao && c.protecao.conjuntos) || [];
    function completaria() {
      var extras = Array.prototype.slice.call(arguments);
      return grupos.some(function (conj) {
        return conj.every(function (unidade) {
          return unidade.some(function (x) { return vistos[x] || extras.indexOf(x) >= 0; });
        });
      });
    }
    pares.forEach(function (p) {
      if (metades.length + 2 > elenco.length) return;
      if (vistos[p.a.f] || vistos[p.b.f]) return;
      if (completaria(p.a.f, p.b.f)) return;
      vistos[p.a.f] = vistos[p.b.f] = 1;
      metades.push({ cod: p.a.f, txt: p.a.txt, par: p.id });
      metades.push({ cod: p.b.f, txt: p.b.txt, par: p.id });
    });

    /* Completa a mão inicial com fragmentos avulsos. Avulso NUNCA é pista de
       fechamento: fora de um par, ela não tem a outra metade que a segura. */
    var pool = embaralhar((sel.centrais || []).concat(Object.keys(b)), r);
    for (var i = 0; metades.length < elenco.length && i < pool.length; i++) {
      var cod = pool[i];
      if (!b[cod] || vistos[cod] || fecho(cod) || completaria(cod)) continue;
      vistos[cod] = 1;
      metades.push({ cod: cod, txt: b[cod].d, par: "" });
    }

    /* Cada metade procura o personagem que a carrega melhor. Sem afinidade,
       cai na primeira vaga — é distribuição, não casting. */
    var vagas = elenco.slice(), destino = {};
    metades.forEach(function (m) {
      var alvo = vagas.find(function (p) { return (AFINIDADE[p] || []).indexOf(m.cod) >= 0; });
      if (!alvo) alvo = vagas[0];
      vagas.splice(vagas.indexOf(alvo), 1);
      destino[alvo] = m;
    });

    var QUALIDADE = { estrutural: "boa", relacional: "mediana", interpretativo: "mediana", contextual: "ruim" };
    elenco.forEach(function (p) {
      var m = destino[p]; if (!m) return;
      var f = b[m.cod];
      global.PISTA_PRIVADA[p] = {
        id: "priv-" + p,
        hora: f.h || "—",
        qualidade: QUALIDADE[f.f] || "mediana",
        txt: m.txt || f.d,
        frag: m.cod,
        par: m.par
      };
    });
  }

  /* ── O que a atividade rende ao dossiê ──────────────────────────────────
     Três medidas, e nenhuma paga a mesma coisa duas vezes:

       QUAL atividade  →  a natureza do que a MESA INTEIRA aprende (família)
       QUANTO andou    →  quantos fragmentos E de que peso, por PESSOA
       QUANTO TEMPO    →  os 5 pontos do placar, que não passam por aqui

     A primeira linha estava errada na primeira versão desta função, e o Mario
     pegou: na Mesa as fases são COLETIVAS — todo mundo joga as mesmas duas
     atividades. "Qual atividade" diferencia mesas, não jogadores. Dentro de
     uma mesa, só o gesto e o relógio variam por pessoa.

     Por isso a qualidade passou a sair do GESTO, e não da atividade nem do
     relógio. Gesto não é velocidade: quem alcançou sete de sete se esforçou,
     não correu. Quem chegou ao fim puxa da ponta estrutural do terço aberto;
     quem mal encostou puxa da ponta contextual — que aprofunda sem fechar.

     Pista de FECHAMENTO nunca entra em lote. Ela chega pelo dossiê coletivo,
     no terço dela, para a mesa toda ao mesmo tempo. O que se ganha jogando
     bem é vantagem de leitura, não a chave da resposta. */
  var PESO_FUNCAO = { estrutural: 0, relacional: 1, interpretativo: 2, contextual: 3 };

  /* nivel: "frente" (metade que concluiu antes), "tras" (a outra metade),
     "andou" (não concluiu, mas avançou) ou "" (não fez nada).
     A ordem de chegada vem do carimbo do servidor na conclusão, então é
     inforjável — ao contrário da duração, que o aparelho apenas afirma. */
  function lote(atividade, nivel, jogadorId, jaTem) {
    var c = caso(), b = banco(); if (!c || !b) return [];
    var r = (c.rendimento && c.rendimento[atividade]) || null;
    var faixas = (c.rendimento && c.rendimento.colocacao) || { frente: 3, tras: 2, andou: 1 };
    var quantos = Number(faixas[nivel]) || 0;
    if (quantos <= 0) return [];

    var tem = {}; (jaTem || []).forEach(function (x) { tem[x] = 1; });
    var familias = (r && r.familias) || [];
    var disponivel = abertos().filter(function (cod) { return !tem[cod] && !fecho(cod); });
    if (!disponivel.length) return [];

    /* A semente inclui O JOGADOR. Sem isso, todos de uma mesma faixa recebiam
       o lote idêntico: diferenciava faixas, não pessoas — e num jogo de
       dedução distribuída é a diferença entre pessoas que obriga a conversar.
       Continua determinístico: qualquer aparelho que calcule o lote de fulano
       chega ao mesmo resultado, que é o que a Mesa multi-telefone exige. */
    var r2 = rng(semente() + "|lote|" + atividade + "|" + (jogadorId || "") + "|" + quantos);
    /* Ruído por jogador, medido: 2,8 — quase três classes de função. Sem ele o peso
       vira fila fixa e duas pessoas da mesma faixa recebiam o mesmo lote em
       22% das mesas — diferenciava faixa, não pessoa. Com ruído, o peso
       continua mandando na tendência mas para de mandar no indivíduo.
       Varredura de 1,0 a 3,5: os lotes idênticos entre dois do pódio caem de
       31% para 5%, enquanto a vantagem de peso do pódio sobre quem concluiu
       depois quase não se move (0,90 contra 1,55; 1,11 contra 1,55). Ou seja,
       dá para comprar variedade quase de graça — e 2,8 fica em 7%. */
    var ruido = {};
    disponivel.forEach(function (cod) { ruido[cod] = r2() * 2.8; });

    /* Ordena do mais pesado para o mais leve. A família da atividade é
       preferência (empurra 2 para trás quem não é dela), não exigência: um
       terço pobre naquela família ainda devolve lote. */
    function peso(cod) {
      return (PESO_FUNCAO[b[cod].f] == null ? 3 : PESO_FUNCAO[b[cod].f])
           + (familias.indexOf(b[cod].familia) < 0 ? 1 : 0)
           + ruido[cod];
    }
    var ordenado = disponivel.slice().sort(function (x, y) { return peso(x) - peso(y); });

    /* Onde a pessoa entra na fila é o que a faixa compra: o pódio começa no
       topo, quem concluiu depois começa no meio. Os nomes vieram de "frente/
       trás" e viraram "pódio/concluiu" quando o Mario trocou as faixas — e
       com os nomes velhos aqui, TODO MUNDO caía no padrão de 0,5 e o pódio
       deixava de levar os fragmentos mais pesados, em silêncio. */
    var entrada = { podio: 0, concluiu: 0.5 };
    var d = entrada[nivel] == null ? 0.5 : entrada[nivel];
    var inicio = Math.round(d * Math.max(0, ordenado.length - quantos));
    return ordenado.slice(inicio, inicio + quantos);
  }

  /* ── Fiação ─────────────────────────────────────────────────────────── */
  /* PISTA_PRIVADA é recalculada a cada render porque a pergunta da sala e o
     número de jogadores só ficam conhecidos depois do primeiro snapshot. O
     resultado é determinístico, então recalcular não muda nada de quem já
     guardou a pista — apenas alcança quem chegou depois. */
  var renderBase = global.render;
  global.render = function () {
    if (banco()) distribuirPrivadas();
    return renderBase.apply(this, arguments);
  };

  var aplicarBase = global.aplicarCaso;
  global.aplicarCaso = function (c) {
    aplicarBase(c);
    if (banco()) distribuirPrivadas();
  };

  global.MosaicoBancoCasa = {
    dossie: dossie, abertos: abertos, tercoAberto: tercoAberto,
    distribuirPrivadas: distribuirPrivadas, duracao: duracao, lote: lote
  };

  if (banco()) { distribuirPrivadas(); if (typeof render === "function") render(true); }
})(window);
