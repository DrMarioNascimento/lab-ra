/* MOSAICO — A Casa da Costa · sequência canônica da Mesa
   A partida publicada (Mesa via AC-percurso, e o Solo alinhado a ela) usa
   sempre as quatro primeiras atividades nesta ordem:

     1. Janela do Norte          → fase inclinacao
     2. Sala às Escuras          ┐
     3. Escrivaninha e vela      ├ percurso AC (constelacao + percursoAC=1)
     4. Maquete                  ┘

   O Vidro Embaçado continua no banco de mecânicas, mas NÃO entra no caminho
   canônico: `pares` / `proximoPar` / `atividades` devolvem só
   `{ inclinacao: "janela", constelacao: "salaEscura" }`.

   Mesas antigas no Firebase: ao reabrir, o JS alinha o documento local a
   esse par. O Mestre grava o patch (criar mesa, Iniciar partida, remontar).
   Convidados jogam o par canônico mesmo antes do documento remoto atualizar. */
(function (global) {
  "use strict";

  /* Função cognitiva declarada no §17, que é o que torna a escolha coerente:
       janela     — espaço, posição, sequência e tempo
       vidro      — números, peso, lacres, documentos, e informação cuja
                    interpretação muda quando relacionada
       salaEscura — vestígios materiais e procura espacial, sem converter
                    presença de objeto em culpa                            */
  /* PREFERÊNCIA, não filtro. O §17 diz "adequada a", não "exclusiva": as três
     servem a qualquer pergunta, uma serve melhor. Excluir deixaria metade das
     perguntas com um par único — sem a variação de jogabilidade que é o
     motivo de existirem duas. Então a função cognitiva ORDENA: a primeira
     mesa de cada pergunta recebe o par mais coerente, e as seguintes descem a
     lista. Ordem = da mais adequada para a menos. */
  var PREFERENCIA = {
    /* contagem e localização: onde alguém cabe, que vestígio deixou, que
       registro doméstico o denuncia */
    sete:     ["janela", "salaEscura", "vidro"],
    /* duração se prova em registro; depois em vestígio de permanência; a
       Janela entra pelo "tempo" da sua função, que é o elo mais fraco aqui */
    cinco:    ["vidro", "salaEscura", "janela"],
    /* os 122 s são trajeto e posição; o escuro é procura espacial; o apagão
       em si é registro elétrico */
    apagao:   ["janela", "salaEscura", "vidro"],
    /* o nome é documental; o quarto é o que o sustenta materialmente; a
       sequência das 21h31 é o que sobra para a Janela */
    nome:     ["vidro", "salaEscura", "janela"],
    /* separar casa de corpo É vestígio material; depois posição do vulto;
       depois a medição de umidade */
    corpo:    ["salaEscura", "janela", "vidro"],
    /* a falha coletiva se lê em rotinas comparadas, sinais domésticos, e por
       último em de onde dava para ver */
    perceber: ["vidro", "salaEscura", "janela"]
  };

  var TAREFA = { janela: "inclinacao", vidro: "constelacao", salaEscura: "salaEscura" };
  var VOZ    = { janela: "inclinacao", vidro: "vidro", salaEscura: "salaEscura" };
  /* A hora do capítulo segue a ATIVIDADE, não a vaga: A Janela é o apagão das
     21h29, O Vidro é a contagem das xícaras às 22h40, A Sala é a travessia. */
  var HORA   = { janela: "21:29", vidro: "22:40", salaEscura: "21:31" };
  var PAR_CANONICO = { inclinacao: "janela", constelacao: "salaEscura" };
  /* 20 min: sala (50 s), escrivaninha (4 min), maquete (9 min), papéis
     (4 min) e a folga da dupla entre as cenas — os tempos de cada tarefa
     moram em ac-ritmo.js. */
  var PERCURSO_LIMITE = (global.ACRitmo && ACRitmo.percursoMesa) || 1200;

  function partidaId() {
    var c = global.CASO;
    var id = (global.STATE && STATE.doc && STATE.doc.partidaId) ||
             (global.STATE && STATE.partidaId) || (c && c.perguntaPadrao) || "sete";
    return (c && c.partidas && c.partidas[id]) ? id : "sete";
  }

  function parCanonico() {
    return { inclinacao: PAR_CANONICO.inclinacao, constelacao: PAR_CANONICO.constelacao };
  }

  /* Mesa publicada: um par só. A tabela PREFERENCIA fica como catálogo da
     função cognitiva; não escolhe mais a vaga interna. */
  function pares(id) {
    return [parCanonico()];
  }

  function proximoPar(id) {
    return parCanonico();
  }

  function limitePercursoSegundos(doc) {
    var segundos = Number(doc && doc.percursoLimiteSegundos);
    /* Mesas abertas antes de 19/09/2026 gravaram 900 s: menos que a soma dos
       tempos das tarefas. Abaixo do limite atual, vale o limite atual. */
    return (Number.isFinite(segundos) && segundos >= PERCURSO_LIMITE && segundos <= 1800) ? segundos : PERCURSO_LIMITE;
  }

  /* Alinha o documento local ao par canônico. Salas antigas com Vidro na
     constelacao, ou sem `atividades`/`percursoAC`, passam a carregar
     AC-percurso (sala → escrivaninha → maquete). */
  function alinharDocumento(doc) {
    if (!doc) return parCanonico();
    var par = parCanonico();
    doc.atividades = par;
    doc.percursoAC = 1;
    doc.tarefaInterior = "sala-escura";
    doc.percursoLimiteSegundos = limitePercursoSegundos(doc);
    return par;
  }

  function patchSalaPublicada() {
    return {
      atividades: parCanonico(),
      percursoAC: 1,
      percursoLimiteSegundos: limitePercursoSegundos((global.STATE && STATE.doc) || {}),
      tarefaInterior: "sala-escura"
    };
  }

  async function gravarSalaPublicada() {
    alinharDocumento((global.STATE && STATE.doc) || null);
    var patch = patchSalaPublicada();
    if (!(global.STATE && STATE.mesa && STATE.mesa.fb && STATE.mesa.codigo)) return patch;
    try {
      var FB = await esperarFB();
      await FB.atualizarMesa(STATE.mesa.codigo, patch);
    } catch (e) { console.error("percurso AC da mesa", e); }
    return patch;
  }

  function atividades() {
    return alinharDocumento((global.STATE && STATE.doc) || null);
  }
  function atividadeDaFase(fase) {
    var a = atividades();
    return fase === "inclinacao" ? a.inclinacao : fase === "constelacao" ? a.constelacao : "";
  }

  /* ── Substituições ───────────────────────────────────────────────────── */

  global.limiteTarefaSensorMs = function(tipo) {
    var doc=(global.STATE&&STATE.doc)||{},cfg=(global.CASO&&CASO.configuracao&&CASO.configuracao.limitesSegundos)||{};
    atividades();
    if(doc.percursoAC===1&&atividadeDaFase(tipo)==='salaEscura'){
      var segundos=Number(doc.percursoLimiteSegundos);
      return limitePercursoSegundos(doc)*1000;
    }
    return (Number(cfg[tipo])||180)*1000;
  };

  global.configTarefaSensor = function (tipo) {
    var at = atividadeDaFase(tipo);
    var t = (global.CASO && CASO.tarefas) || {};
    var cfg=(at && t[TAREFA[at]]) || t[tipo] || {};
    if(at==='salaEscura' && global.STATE && STATE.doc && STATE.doc.percursoAC===1){
      var jogador=(STATE.eu&&STATE.eu.id)||'visitante';
      var elenco=STATE.doc.acElencoAtividade;
      var extra=elenco&&elenco.fase===tipo?(elenco.solo?'&solo=1':'&auto=1&elenco='+encodeURIComponent(JSON.stringify(elenco.jogadores))):'';
      return Object.assign({},cfg,{titulo:'A investigação da casa',arquivo:'AC-percurso.html?embed=1&jogador='+encodeURIComponent(jogador)+extra});
    }
    return cfg;
  };

  /* tarefaInteriorAtual sobrevive porque outras partes do arquivo ainda a
     chamam; agora ela responde sobre a vaga interna, seja qual for. */
  global.tarefaInteriorAtual = function () {
    return atividadeDaFase("constelacao") === "salaEscura" ? "sala-escura" : "vidro";
  };

  var vozBase = global.vozDaFase;
  global.vozDaFase = function (fase) {
    var at = atividadeDaFase(fase);
    /* Só devolve a chave se ela existir no mapa de áudio. Com os áudios de
       fase apagados, devolver "inclinacao" apontava para arquivo nenhum —
       inofensivo, porque quem lê guarda, mas é sinal no vazio. */
    if (at) {
      var k = VOZ[at] || "";
      return (k && global.ARQUIVOS_VOZ_NIVEL && ARQUIVOS_VOZ_NIVEL[k]) ? k : "";
    }
    return vozBase(fase);
  };

  /* A execução identifica a variante para semente e runId. Passa a nomear a
     ATIVIDADE, senão duas mesas com atividades diferentes na mesma vaga
     montariam o mesmo mundo. */
  var execBase = global.execucaoTarefaSensor;
  global.execucaoTarefaSensor = function (tipo) {
    var ex = execBase(tipo), at = atividadeDaFase(tipo);
    if (!at) return ex;
    var codigo = (global.STATE && STATE.mesa && STATE.mesa.codigo) ||
                 (global.STATE && STATE.eu && STATE.eu.codigo) || "MOSAICO";
    var campo = tipo === "inclinacao" ? "inclinacaoAbertaMs" : "constelacaoAbertaMs";
    var aberta = Number(global.STATE && STATE.doc && STATE.doc[campo]) || 0;
    var runId = (at==='salaEscura'&&STATE.doc.acElencoAtividade?.fase===tipo&&STATE.doc.acElencoAtividade.runId)||[codigo, at, aberta].join("-");
    return { runId: runId, semente: runId };
  };

  /* Capítulo e relógio da fase seguem a atividade que caiu na vaga. Sem isto,
     a tela anunciaria "A Janela do Norte" com O Vidro Embaçado dentro. */
  function alinharRotulos() {
    var c = global.CASO; if (!c) return;
    if(global.CATEGORIAS_APURACAO){
      var extras=[{id:'salaEscura',curto:'Investigação',titulo:'Individual · sala escura'},{id:'vela',curto:'Vela',titulo:'Cooperação · vela'},{id:'chaves',curto:'Chaves',titulo:'Cooperação · chaves'},{id:'papeis',curto:'Papéis',titulo:'Individual · papéis rasgados'}];
      extras.forEach(function(e){var i=CATEGORIAS_APURACAO.findIndex(function(x){return x.id===e.id;});if(STATE.doc&&STATE.doc.percursoAC===1){if(i<0)CATEGORIAS_APURACAO.push(e);}else if(i>=0)CATEGORIAS_APURACAO.splice(i,1);});
    }
    ["inclinacao", "constelacao"].forEach(function (fase) {
      var at = atividadeDaFase(fase); if (!at) return;
      var cfg = (c.tarefas && c.tarefas[TAREFA[at]]) || {};
      if (global.CAP_FASE && cfg.titulo) CAP_FASE[fase] = cfg.titulo;
      if (global.HORA_FASE && HORA[at]) HORA_FASE[fase] = HORA[at];
    });
  }

  var nomeRodadaBase = global.nomeRodada;
  global.nomeRodada = function (fase) {
    var at = atividadeDaFase(fase);
    if (at) return nomeTarefaSensor(fase);
    return nomeRodadaBase(fase);
  };

  var renderBase = global.render;
  global.render = function () { alinharRotulos(); return renderBase.apply(this, arguments); };

  /* ── A escolha nasce ao abrir a mesa, e vira estado da sala ──────────── */
  var criarBase = global.criarMesa;
  global.criarMesa = async function (modo) {
    await criarBase(modo);
    await gravarSalaPublicada();
    alinharRotulos();
    render(true);
  };

  // Cada abertura fixa o elenco daquela atividade em uma unica escrita da mesa.
  [['inclinacao','abrirInclinacao','inclinacaoAbertaMs'],['constelacao','abrirConstelacao','constelacaoAbertaMs']].forEach(function(item){
    var anterior=global[item[1]];
    global[item[1]]=async function(){
      if(!STATE.doc||STATE.doc.percursoAC!==1||atividadeDaFase(item[0])!=='salaEscura')return anterior.apply(this,arguments);
      var elenco=STATE.jogadores.map(function(j){return {id:j.id,nome:j.nome};});
      /* Um jogador só: o percurso segue com o parceiro automático (antes a
         Mesa parava aqui e a automação não tentava de novo — a partida
         ficava presa na Janela). */
      var FB=await esperarFB(),dados={fase:item[0],acElencoAtividade:{fase:item[0],jogadores:elenco,solo:elenco.length<2}};dados[item[2]]=Date.now();dados.acElencoAtividade.runId=[STATE.mesa.codigo,'salaEscura',dados[item[2]]].join('-');
      if(elenco.length>=2&&global.ACPrepareGroups&&!/^(localhost|127\.0\.0\.1)$/.test(location.hostname))await ACPrepareGroups(STATE.mesa.codigo,[STATE.mesa.codigo,'salaEscura',dados[item[2]]].join('-'),elenco,item[0],limiteTarefaSensorMs(item[0]));
      await FB.atualizarMesa(STATE.mesa.codigo,dados);
    };
  });

  global.MosaicoAtividadesCasa = {
    preferencia: PREFERENCIA, pares: pares, atividades: atividades,
    atividadeDaFase: atividadeDaFase, partidaId: partidaId,
    parCanonico: parCanonico, proximoPar: proximoPar,
    patchSalaPublicada: patchSalaPublicada, alinharSala: gravarSalaPublicada
  };

  alinharRotulos();
})(window);
