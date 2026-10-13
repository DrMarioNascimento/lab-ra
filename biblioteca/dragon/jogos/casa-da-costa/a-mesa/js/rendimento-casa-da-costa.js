/* MOSAICO — A Casa da Costa · o que a atividade sensorial rende
   02/09/2026. Última peça do item 3: até aqui a Mesa recebia o tempo da
   tarefa, conferia que era plausível e JOGAVA FORA, entregando sempre a mesma
   pista fixa. Concluir depressa, devagar ou marcar sem jogar davam a mesma
   partida — não dava para ir mal porque não dava para ir.

   Dois eixos, e não são a mesma ordem:

     ORDEM DE CHEGADA → fragmentos.  Pódio leva 2, quem concluiu leva 1, quem
       não concluiu leva 0. Carimbada pelo servidor: ninguém forja ter
       chegado antes.
     DURAÇÃO (pronto → fim) → os 5 pontos da tabela geral. Quem perde 20 s na
       permissão do iPhone chega atrasado no pódio, mas pode ter duração
       ótima — é assim que a duração devolve o que a corrida tira.

   As duas pontas da duração são carimbadas pelo SERVIDOR, na chegada da
   mensagem, e não pelo relógio de quem joga. O comentário em MOSAICO-mesa.html
   já avisava: "Se algum dia o tempo das tarefas entrar na pontuacao, ele tera
   de vir de serverTimestamp nas duas pontas". É o que este arquivo faz. */
(function (global) {
  "use strict";

  function banco() { return global.MosaicoBancoCasa || null; }
  function atividadeDaFase(fase) {
    var a = global.MosaicoAtividadesCasa;
    return a ? a.atividadeDaFase(fase) : (fase === "inclinacao" ? "janela" : "vidro");
  }
  function ms(v) { return v && v.toMillis ? v.toMillis() : (typeof v === "number" ? v : 0); }

  /* ── A largada: o módulo avisou que ficou jogável ───────────────────── */
  global.addEventListener("message", function (ev) {
    if (ev.origin !== location.origin || !ev.data) return;
    if (ev.data.mosaico !== "tarefa-status" || ev.data.estado !== "ativo") return;
    var tipo = global.STATE && STATE.doc && STATE.doc.fase;
    if (tipo !== "inclinacao" && tipo !== "constelacao") return;
    var frame = document.querySelector('iframe.tarefa-frame[data-tarefa="' + tipo + '"]');
    if (!frame || ev.source !== frame.contentWindow) return;
    marcarPronto(tipo).catch(function (e) { console.error("pronto da tarefa", e); });
  });

  /* O CÓDIGO DA SALA NÃO MORA EM STATE.mesa NO CELULAR DE QUEM JOGA.
     `STATE.mesa` só é preenchido em três lugares — criar mesa, o painel do
     Mestre e a reconexão. Quem entra pelo QR e não recarrega a página tem
     `STATE.mesa` null a partida inteira; o código dele está em
     `STATE.eu.codigo`. É a mesma resolução que banco, atividades e mosaico
     já faziam, e que só estas duas camadas não faziam.

     Enquanto isso não estava aqui, `marcarPronto` voltava calado em todo
     aparelho de participante: `prontoEm` nunca era gravado, `duracoes()`
     descartava a atividade por falta dele, e os 5 pontos de duração eram
     zero para a mesa inteira — sem erro nenhum no console, porque o retorno
     antecipado tinha cara de guarda defensiva. */
  function codigoSala() {
    return (global.STATE && STATE.mesa && STATE.mesa.codigo) ||
           (global.STATE && STATE.eu && STATE.eu.codigo) || "";
  }

  async function marcarPronto(tipo) {
    var codigo = codigoSala();
    if (!STATE.eu || !codigo) return;
    var id = STATE.eu.id + "_" + tipo;
    /* Idempotente: o módulo pode reenviar "ativo" (retomada de pausa, troca
       de modo de entrada) e a largada não pode andar para frente, senão
       demorar seria recompensado com uma duração menor. */
    if ((STATE.v5.tarefas || []).some(function (t) { return t.id === id && t.prontoEm; })) return;
    var FB = await esperarFB();
    await FB.gravarServidor(codigo, "tarefas", id,
      { tarefa: tipo, jogadorId: STATE.eu.id }, "prontoEm");
  }

  /* Com banco no caso, a PISTA FIXA da tarefa sai de cena. Ela era um texto
     escrito à mão que dizia com outras palavras o que o banco já diz — e,
     entregue ao lado do lote, daria o mesmo fato duas vezes, que é
     exatamente a deriva que o banco existe para acabar. Fica como rede para
     caso sem `fragmentos`. */
  var configBase = global.configTarefaSensor;
  global.configTarefaSensor = function (tipo) {
    var cfg = configBase(tipo);
    if (!cfg || !cfg.pista) return cfg;
    if (!(global.CASO && CASO.fragmentos)) return cfg;
    var copia = {}; for (var k in cfg) if (k !== "pista") copia[k] = cfg[k];
    return copia;
  };

  /* ── A chegada: fragmentos por colocação ───────────────────────────── */
  var concluirBase = global.concluirTarefaSensor;
  global.concluirTarefaSensor = async function (tipo, tempoMs, runId, pontosAC) {
    var jaTinha = (STATE.v5.tarefas || []).filter(function (t) {
      return t.tarefa === tipo && tarefaConcluida(t);
    }).length;
    await concluirBase(tipo, tempoMs, runId, pontosAC);
    try { await premiar(tipo, jaTinha + 1); }
    catch (e) { console.error("lote da tarefa", e); }
  };

  async function premiar(tipo, colocacao) {
    var B = banco(), c = global.CASO; if (!B || !B.lote || !c || !STATE.eu) return;
    var faixas = (c.rendimento && c.rendimento.colocacao) || {};
    var primeiros = Number(faixas.primeiros) || 3;
    var nivel = colocacao <= primeiros ? "podio" : "concluiu";
    var atividade = atividadeDaFase(tipo);
    /* O que a pessoa já tem não volta: nem a metade de par que ela carrega
       desde a abertura, nem o lote da atividade anterior. */
    var jaTem = minhasPistas().map(function (p) { return p.frag; }).filter(Boolean);
    var codigos = B.lote(atividade, nivel, STATE.eu.id, jaTem);
    if (!codigos.length) return;

    var FB = await esperarFB(), b = c.fragmentos;
    for (var i = 0; i < codigos.length; i++) {
      var cod = codigos[i], f = b[cod];
      if (!f) continue;
      if (minhasPistas().some(function (p) { return p.frag === cod; })) continue;
      await FB.acrescentarPista(STATE.eu.codigo, STATE.eu.id, {
        id: "lote-" + tipo + "-" + cod, hora: f.h || "—", txt: f.d,
        adquirida: false, origem: "tarefa", frag: cod
      });
    }
  }

  /* ── O placar: duração vira os 5 pontos ────────────────────────────── */
  global.MosaicoRendimentoCasa = {
    /* { jogadorId: [duraçãoMs, …] }, uma entrada por atividade concluída.
       Sem `prontoEm` — sala aberta antes desta versão — a atividade não
       entra: melhor não pontuar do que pontuar com relógio de aparelho. */
    duracoes: function () {
      var porJogador = {};
      (STATE.v5.tarefas || []).forEach(function (t) {
        if (!tarefaConcluida(t) || !t.prontoEm || !t.concluidoEm) return;
        // O percurso tem recompensa cooperativa propria; nao disputar duracao contra tarefas individuais.
        if(STATE.doc&&STATE.doc.percursoAC===1&&String(t.runId||'').includes('-salaEscura-'))return;
        var d = ms(t.concluidoEm) - ms(t.prontoEm);
        if (!(d > 0)) return;
        (porJogador[t.jogadorId] = porJogador[t.jogadorId] || []).push(d);
      });
      return porJogador;
    }
  };

  var calcularBase = MosaicoV5.calcular;
  MosaicoV5.calcular = function (entrada) {
    if (!entrada.sensorial) entrada.sensorial = global.MosaicoRendimentoCasa.duracoes();
    if (!entrada.configuracao) entrada.configuracao = (global.CASO && CASO.configuracao) || null;
    return calcularBase.call(this, entrada);
  };
})(window);
