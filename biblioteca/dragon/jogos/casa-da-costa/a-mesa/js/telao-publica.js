/* MOSAICO · A Casa da Costa — o que a mesa publica para o telão.
   ==========================================================================

   O `telao.html?jogo=casa-da-costa` é uma página que só LÊ. Ela espera um
   `publicState` no documento da sala (`mosaico/{codigo}` em mosaico-game).
   Até este arquivo, só o Carro-Forte escrevia esse mapa — a Casa ficava no
   cartão de espera para sempre, mesmo com a partida a todo vapor nos
   celulares.

   O QUE ELE PUBLICA, E POR QUE SÓ ISSO
   ------------------------------------
   A pergunta da partida, os campos da decisão (rótulos coletivos), a fase
   corrente com o relógio da mesa quando ele existe, e no fim a resolução com
   o pódio. A mão, o dossiê, as pistas privadas e o cronômetro de um aparelho
   só NÃO sobem: mostrar o timer de quem abriu a sala como se fosse da mesa
   seria mentira grande na tela grande.

   QUEM ESCREVE
   ------------
   Só o Mestre, pelo mesmo `MosaicoFB` / uid que já grava a sala. Vários
   aparelhos gravando `publicState` a cada quadro é corrida sem árbitro; e as
   regras do Firestore só deixam o Mestre atualizar o documento da sala. */
(function (global) {
  "use strict";

  var ultimo = "";
  var emVoo = false;
  var timer = null;

  function codigo() {
    var st = global.STATE;
    return (
      (st && st.mesa && st.mesa.codigo) ||
      (st && st.eu && st.eu.codigo) ||
      ""
    ).toUpperCase();
  }

  function souMestre() {
    return typeof global.souMestreDaMesa === "function" && !!global.souMestreDaMesa();
  }

  function partidaId() {
    var c = global.CASO;
    var st = global.STATE;
    var id =
      (st && st.doc && st.doc.partidaId) ||
      (st && st.partidaId) ||
      (c && c.perguntaPadrao) ||
      "sete";
    return c && c.partidas && c.partidas[id] ? id : (c && c.perguntaPadrao) || "sete";
  }

  function partida() {
    var c = global.CASO;
    return (c && c.partidas && c.partidas[partidaId()]) || null;
  }

  function camposPublicos(p, fechado) {
    return (p.campos || []).map(function (c) {
      return {
        label: c.rotulo || c.id,
        closed: !!fechado,
        closedBy: fechado ? String(c.resposta || "") : "",
      };
    });
  }

  function placarDaMesa() {
    return (global.STATE && global.STATE.jogadores ? global.STATE.jogadores : [])
      .map(function (j) {
        return {
          nome: j.nome || "Investigador",
          pontos: Number(j.total) || 0,
        };
      })
      .sort(function (a, b) {
        return b.pontos - a.pontos || String(a.nome).localeCompare(String(b.nome));
      });
  }

  function faseParaTelao(fase) {
    var d = typeof global.dadosAutomacao === "function" ? global.dadosAutomacao() : null;
    var rotulo =
      typeof global.nomeRodada === "function" ? global.nomeRodada(fase) : fase;
    if (d && d.inicio && d.limite) {
      return {
        nome: d.fase,
        rotulo: typeof global.nomeRodada === "function" ? global.nomeRodada(d.fase) : d.fase,
        fimMs: Number(d.inicio) + Number(d.limite),
      };
    }
    if (fase && fase !== "sala") {
      return { nome: fase, rotulo: rotulo, fimMs: 0 };
    }
    return null;
  }

  /* Assinatura estável: sem carimbos de hora, para não republicar a cada tick. */
  function assinatura(patch) {
    var copia = {};
    Object.keys(patch)
      .sort()
      .forEach(function (k) {
        if (/EmMs$/.test(k) || k === "publicState.atualizadoEmMs") return;
        copia[k] = patch[k];
      });
    try {
      return JSON.stringify(copia);
    } catch (e) {
      return String(Date.now());
    }
  }

  async function gravar(patch) {
    var code = codigo();
    if (!code || !souMestre()) return;
    if (typeof global.esperarFB !== "function") return;
    try {
      var FB = await global.esperarFB();
      if (!FB || !FB.atualizarMesa) return;
      await FB.atualizarMesa(code, patch);
    } catch (e) {
      console.error("MOSAICO: não consegui publicar para o telão.", e);
    }
  }

  function montar() {
    var doc = (global.STATE && global.STATE.doc) || null;
    var p = partida();
    if (!doc || !p || !p.pergunta) return null;
    /* Sem sala no Firestore não há o que espelhar. */
    if (!codigo()) return null;

    var fase = doc.fase || "sala";
    var fechado = fase === "resultado";
    var patch = {
      "publicState.questionTitle": [p.titulo, p.natureza].filter(Boolean).join(" · "),
      "publicState.questionText": p.pergunta || "",
      "publicState.perguntaId": partidaId(),
      "publicState.fields": camposPublicos(p, fechado),
      "publicState.atualizadoEmMs": Date.now(),
      /* Zera resíduo de rodada anterior quando a mesa ainda está viva. */
      "publicState.placar": [],
    };

    var fasePub = faseParaTelao(fase);
    if (fasePub) patch["partida.fase"] = fasePub;

    if (fechado) {
      patch["publicState.resposta"] = p.revelacao || "";
      patch["publicState.encerradaEmMs"] = Date.now();
      /* O pódio é fato coletivo (totais já gravados em jogadores). O que é
         privado — composição de pontos, dossiê — fica no celular. */
      var placar = placarDaMesa();
      if (placar.length) {
        patch["partida.fecho"] = { fase: "podio", placar: placar, emMs: Date.now() };
      }
    } else {
      patch["publicState.resposta"] = "";
    }

    return patch;
  }

  function sincronizar() {
    if (emVoo || !souMestre()) return;
    var patch = montar();
    if (!patch) return;
    var sig = assinatura(patch);
    if (sig === ultimo) return;
    ultimo = sig;
    emVoo = true;
    Promise.resolve(gravar(patch)).then(
      function () {
        emVoo = false;
      },
      function () {
        emVoo = false;
        /* Falha: permite nova tentativa no próximo ciclo. */
        ultimo = "";
      }
    );
  }

  function ligar() {
    if (timer) return;
    /* O render da Mesa já dispara a cada snapshot; o intervalo cobre o caso
       em que o Mestre reconecta com a partida a meio e o primeiro render
       veio antes do CASO / partidaId estabilizarem. */
    timer = setInterval(sincronizar, 1500);
    sincronizar();
  }

  /* Embrulha o render sem trocar o contrato: quem chamava render(true) continua
     chamando. Publicar aqui — e não em cada atualizarMesa — evita gravar o
     telão antes de o STATE.doc refletir a própria gravação. */
  function envolverRender() {
    var base = global.render;
    if (typeof base !== "function" || base.__telaoPublica) return;
    function wrapped() {
      var out = base.apply(this, arguments);
      try {
        sincronizar();
      } catch (e) {
        console.error("MOSAICO: sincronizar telão", e);
      }
      return out;
    }
    wrapped.__telaoPublica = true;
    global.render = wrapped;
  }

  function iniciar() {
    envolverRender();
    ligar();
  }

  if (typeof document !== "undefined") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", iniciar);
    } else {
      setTimeout(iniciar, 0);
    }
  }

  global.MosaicoTelaoPublica = {
    sincronizar: sincronizar,
    montar: montar,
  };
})(typeof window !== "undefined" ? window : globalThis);
