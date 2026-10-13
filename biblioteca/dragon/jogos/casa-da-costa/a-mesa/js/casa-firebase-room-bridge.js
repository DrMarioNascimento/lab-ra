/* MOSAICO · Casa da Costa — ponte firebase-room → motor v1
   ==========================================================================
   O gate/lobby canônico vive em firebase-room.js (Abrir / Entrar).
   Ensaiar é a porta Solo do hub; Telão é o hub / `telao.html`. Esta folha:
     1. DragonSalaAoEntrar — completa personagem/moedas no create do jogador;
     2. DragonSalaAntesDeIniciar — ao “Iniciar partida”, grava fase encenacao
        e preenche lacunas (só o Mestre);
     3. casa-mesa-ready — monta STATE / assina a sala / libera o #app.
   MosaicoFB segue dono das fases do caso; Auth é a app `dragon-mesa`. */
(function (global) {
  "use strict";

  global.MOSAICO_GATE_EXTERNO = true;

  /* 11/10/2026: os ids de reserva acompanham o elenco do caso (casa-da-costa.json → elenco);
     antes eram ids de uma versão antiga (anfitria, viuva, medico), que nenhum personagem usa mais. */
  var PERSONAGENS_FALLBACK = [
    "investigador",
    "herdeiro",
    "morador",
    "jornalista",
    "policial",
    "menina",
  ];

  function escutaPronto(fn) {
    if (global.MosaicoFB) return fn(global.MosaicoFB);
    global.addEventListener(
      "mosaicofb-ready",
      function () {
        fn(global.MosaicoFB);
      },
      { once: true }
    );
  }

  function esperarFB() {
    return new Promise(function (resolve, reject) {
      escutaPronto(function (FB) {
        if (!FB) reject(new Error("MosaicoFB indisponível."));
        else resolve(FB);
      });
    });
  }

  function esperarCaso() {
    return new Promise(function (res) {
      if (global.CASO_PRONTO) return res();
      var n = 0;
      var t = setInterval(function () {
        n++;
        if (global.CASO_PRONTO || global.CASO_FALHOU || n > 200) {
          clearInterval(t);
          res();
        }
      }, 50);
    });
  }

  function listaPersonagens() {
    var lista = global.PERSONAGENS;
    if (lista && lista.length) return lista.map(function (p) { return p.id || p; });
    return PERSONAGENS_FALLBACK.slice();
  }

  function sortearPersonagem(ocupados) {
    if (typeof global.sortearPersonagem === "function") {
      return global.sortearPersonagem(ocupados);
    }
    var ids = listaPersonagens();
    var contagem = {};
    ids.forEach(function (id) { contagem[id] = 0; });
    (ocupados || []).forEach(function (id) {
      if (contagem[id] != null) contagem[id]++;
    });
    var menor = Math.min.apply(null, Object.keys(contagem).map(function (id) { return contagem[id]; }));
    var candidatos = ids.filter(function (id) { return contagem[id] === menor; });
    return candidatos[(Math.random() * candidatos.length) | 0] || ids[0];
  }

  function moedasIniciais() {
    var c = global.CASO;
    return ((c && c.configuracao) || {}).moedasIniciais || 12;
  }

  function tarefaInteriorNova() {
    return "sala-escura";
  }

  function linkDaSala(codigo) {
    if (typeof global.linkDaSala === "function") return global.linkDaSala(codigo);
    var u = new URL(location.href);
    u.search = "";
    u.searchParams.set("sala", codigo);
    return u.toString();
  }

  async function ocupadosAtuais(FB, codigo, selfId) {
    var ja = [];
    try { ja = (await FB.listarJogadores(codigo)) || []; } catch (e) { ja = []; }
    var ocupados = [];
    ja.forEach(function (j) {
      if (j && j.id !== selfId && j.personagem) ocupados.push(j.personagem);
    });
    return ocupados;
  }

  async function respReservado(FB, codigo, souMestre) {
    try {
      var CV = global.CasaVariacoes; if (!CV) return null;
      await CV.pronto;
      var mesa = (await FB.obterMesa(codigo)) || {};
      var vid = mesa.variacaoId || mesa.variacaoReservada;
      if (!vid && souMestre) {
        var esc = CV.escolherSemMarcar(codigo, []);
        if (esc) { vid = esc.variacaoId; await FB.atualizarMesa(codigo, { variacaoReservada: vid }); }
      }
      return CV.respDe ? CV.respDe(vid) : null;
    } catch (e) { console.warn("variação reservada", e); return null; }
  }

  global.DragonSalaAoEntrar = async function (ctx) {
    await esperarCaso();
    var FB = await esperarFB();
    await FB.pronto();
    var codigo = ctx && ctx.code;
    var uid = ctx && ctx.uid;
    var ocupados = codigo ? await ocupadosAtuais(FB, codigo, uid) : [];
    /* 11/10/2026 (Tarefa 4): a variação é reservada quando o Mestre entra, antes de qualquer sorteio,
       e quem acobertou nela fica fora do sorteio dos humanos — assim as 15 variações valem para
       qualquer número de jogadores (antes, de 6 jogadores em diante o núcleo inteiro era humano e
       as seis variações em que alguém do núcleo acobertou nunca saíam). */
    var evitar = codigo ? await respReservado(FB, codigo, ctx && ctx.asMaster) : null;
    if (evitar) ocupados = ocupados.concat([evitar]);
    var personagem = sortearPersonagem(ocupados);
    return {
      personagem: personagem,
      moedas: moedasIniciais(),
      votos: 0,
      total: 0,
      pronto: true,
    };
  };

  async function completarLacunasMestre(FB, codigo, players) {
    var ja = players && players.length ? players : await FB.listarJogadores(codigo);
    var evitar = await respReservado(FB, codigo, true);
    var ocupados = evitar ? [evitar] : [];
    ja.forEach(function (j) {
      if (j.personagem) ocupados.push(j.personagem);
    });
    for (var i = 0; i < ja.length; i++) {
      var j = ja[i];
      var patch = {};
      if (!j.personagem) {
        var p = sortearPersonagem(ocupados);
        if (p) {
          patch.personagem = p;
          ocupados.push(p);
        }
      }
      if (j.moedas == null) patch.moedas = moedasIniciais();
      if (j.total == null) patch.total = 0;
      if (j.votos == null) patch.votos = 0;
      if (j.pronto !== true) patch.pronto = true;
      if (Object.keys(patch).length) {
        await FB.atualizarJogador(codigo, j.id, patch);
      }
    }
    return FB.listarJogadores(codigo);
  }

  function patchPercursoAC(room) {
    var par = { inclinacao: "janela", constelacao: "salaEscura" };
    var segundos = Number(room && room.percursoLimiteSegundos);
    var limite = Number.isFinite(segundos) && segundos >= 300 && segundos <= 1800 ? segundos : 900;
    var atual = room && room.atividades;
    var alinhado = atual && atual.inclinacao === "janela" && atual.constelacao === "salaEscura"
      && room.percursoAC === 1 && room.tarefaInterior === "sala-escura"
      && Number(room.percursoLimiteSegundos) === limite;
    return {
      alinhado: !!alinhado,
      patch: {
        atividades: par,
        percursoAC: 1,
        percursoLimiteSegundos: limite,
        tarefaInterior: "sala-escura"
      }
    };
  }

  global.DragonSalaAntesDeIniciar = async function (ctx) {
    await esperarCaso();
    var codigo = (ctx && ctx.code) || (global.DragonSala && global.DragonSala.codigo);
    if (!codigo) return { fase: "encenacao" };
    var FB = await esperarFB();
    await FB.pronto();
    await completarLacunasMestre(FB, codigo, (ctx && ctx.players) || []);
    var room = (ctx && ctx.room) || {};
    var canon = patchPercursoAC(room).patch;
    try { localStorage.setItem("mosaico_ultima_tarefa_interior", canon.tarefaInterior); } catch (e) {}
    /* 11/10/2026: a pergunta da partida segue a rotação (antes ficava sempre em "sete") */
    var partidaId = room.partidaId;
    if (!partidaId && global.CasaRotacao) { partidaId = global.CasaRotacao.proxima(); global.CasaRotacao.marcar(partidaId); }
    if (partidaId) canon = Object.assign({ partidaId: partidaId }, canon);
    /* 11/10/2026 (Tarefa 4): a variação da solução e o elenco na casa, escolhidos aqui, uma vez,
       e gravados na sala para todos os aparelhos (variacoes-casa.js) */
    if (!room.variacaoId && global.CasaVariacoes) {
      try {
        await global.CasaVariacoes.pronto;
        var js = (await FB.listarJogadores(codigo)) || [];
        var humanos = js.map(function (j) { return j && j.personagem; }).filter(Boolean);
        var reservada = room.variacaoReservada || ((await FB.obterMesa(codigo)) || {}).variacaoReservada;
        var esc = global.CasaVariacoes.escolher(codigo, humanos, reservada);
        if (esc) canon = Object.assign({ variacaoId: esc.variacaoId, elencoCasa: esc.elencoCasa }, canon);
      } catch (e) { console.error("variação da Casa", e); }
    }
    return Object.assign({
      fase: "encenacao",
      vez: 0,
      encenacaoIntroducaoConcluida: false,
      aberturaIniciadaMs: Date.now(),
      caseId: "casa-da-costa"
    }, canon);
  };

  async function montarPartida(detail) {
    await esperarCaso();
    var FB = await esperarFB();
    await FB.pronto();
    var uid = FB.uid && FB.uid();
    var codigo = (detail && detail.code) || (global.DragonSala && global.DragonSala.codigo) || "";
    if (!codigo) throw new Error("Sem código de sala após o gate.");

    var mesaDoc = (detail && detail.room) || (await FB.obterMesa(codigo)) || {};
    var jogadores = (await FB.listarJogadores(codigo)) || detail.players || [];
    var meu = jogadores.find(function (p) { return p.id === uid; });
    if (!meu) throw new Error("Seu assento na sala não foi encontrado.");

    if (!meu.personagem) {
      var resv = global.CasaVariacoes && global.CasaVariacoes.respDe ? global.CasaVariacoes.respDe(mesaDoc.variacaoId || mesaDoc.variacaoReservada) : null;
      var ocupados = resv ? [resv] : [];
      jogadores.forEach(function (j) {
        if (j.id !== uid && j.personagem) ocupados.push(j.personagem);
      });
      var novo = sortearPersonagem(ocupados);
      if (novo) {
        await FB.atualizarJogador(codigo, uid, { personagem: novo });
        meu.personagem = novo;
      }
    }

    var modo = mesaDoc.modo || "com-telao";
    var ritmo = mesaDoc.ritmo || "automatico";
    var canon = patchPercursoAC(mesaDoc);
    Object.assign(mesaDoc, canon.patch);
    if ((detail.role === "master" || (global.DragonSala && global.DragonSala.papel === "master")) && !canon.alinhado) {
      try { await FB.atualizarMesa(codigo, canon.patch); } catch (e) { console.error("percurso AC da mesa", e); }
    }
    global.STATE.mesa = {
      codigo: codigo,
      link: linkDaSala(codigo),
      fb: true,
      modo: modo,
      ritmo: ritmo,
    };
    global.STATE.modoMesa = modo;
    global.STATE.ritmoMesa = ritmo;
    global.STATE.doc = mesaDoc;
    /* 11/10/2026: "Tanto faz" → a casa decide pela semente (mesma regra de formaDaCasa na mesa) */
    var formaCasa = function (f, id) { if (typeof global.formaDaCasa === "function") return global.formaDaCasa(f, id, codigo); if (f !== "n" && f !== "?") return f; var t = String(codigo || "") + "|" + String(id || ""), h = 2166136261; for (var i = 0; i < t.length; i++) h = Math.imul(h ^ t.charCodeAt(i), 16777619) >>> 0; return ((h >>> 8) % 2) ? "f" : "m"; };
    global.STATE.jogadores = (jogadores || []).map(function (j) { if (!j || (j.forma !== "n" && j.forma !== "?")) return j; var c = {}; for (var k in j) c[k] = j[k]; c.forma = formaCasa(j.forma, j.id); return c; });
    global.STATE.eu = {
      codigo: codigo,
      id: meu.id,
      nome: meu.nome,
      personagem: meu.personagem,
      forma: formaCasa(meu.forma || "n", meu.id),
      papelCognitivo: meu.papelCognitivo || (detail.papelCamada && detail.papelCamada.papel) || "investigador",
      camadaAcessibilidade: meu.camadaAcessibilidade || (detail.papelCamada && detail.papelCamada.camada) || "livre",
    };
    global.STATE.papelCognitivo = global.STATE.eu.papelCognitivo;
    global.STATE.camadaAcessibilidade = global.STATE.eu.camadaAcessibilidade;
    try { sessionStorage.setItem("mosaico_eu", JSON.stringify(global.STATE.eu)); } catch (e) {}
    try { localStorage.setItem("mosaico_reconexao", JSON.stringify(global.STATE.eu)); } catch (e) {}
    if (detail.role === "master" || (global.DragonSala && global.DragonSala.papel === "master")) {
      try { sessionStorage.setItem("mosaico_mestre_codigo", codigo); } catch (e) {}
      try {
        localStorage.setItem(
          "mosaico_mestre_reconexao",
          JSON.stringify({ codigo: codigo, modo: modo, ritmo: ritmo, uid: uid })
        );
        localStorage.setItem("mosaico_ultimo_codigo", codigo);
      } catch (e) {}
      global.STATE.orientacaoMestreAberta = false;
    } else {
      global.STATE.orientacaoParticipanteAberta = false;
    }

    var app = document.getElementById("app");
    if (app) app.hidden = false;
    var portao = document.getElementById("portao");
    if (portao) portao.style.display = "none";
    document.body.classList.remove("portao");
    var part = document.getElementById("abertura-participante");
    if (part) { part.classList.add("hidden"); part.style.display = "none"; }

    if (typeof global.assinarSala === "function") global.assinarSala(codigo, true);
    if (typeof global.sincronizarJogador === "function") global.sincronizarJogador();
    else if (typeof global.render === "function") global.render();
  }

  function liberarEnsaioLocal() {
    location.replace(new URL("../../../jogos/casa-da-costa/solo/", location.href).toString());
  }

  global.addEventListener("casa-mesa-ready", function (ev) {
    var detail = (ev && ev.detail) || global.MOSAICO_ROOM || {};
    global.MOSAICO_ROOM = detail;
    if (detail.local || detail.ensaio) {
      liberarEnsaioLocal();
      return;
    }
    montarPartida(detail).catch(function (e) {
      console.error("MOSAICO: falha ao assumir a partida após o gate", e);
      var app = document.getElementById("app");
      if (app) {
        app.hidden = false;
        app.innerHTML =
          '<div style="padding:24px;color:#f4ead7;font-family:Inter,system-ui,sans-serif">' +
          "<h2>Não foi possível entrar na partida</h2>" +
          "<p>" +
          String((e && e.message) || e) +
          "</p>" +
          '<button type="button" onclick="location.reload()">Tentar de novo</button></div>';
      }
    });
  });
})(typeof window !== "undefined" ? window : globalThis);
