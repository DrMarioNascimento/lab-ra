/* Casa da Costa — camada canônica 30/08/2026
   Mantém a infraestrutura operacional da Mesa e substitui somente aquilo
   que depende da pergunta antiga de culpado/cofre. */
(function(global){
  "use strict";

  function partidaId(){
    var id=(global.STATE&&STATE.doc&&STATE.doc.partidaId)||(global.STATE&&STATE.partidaId)||(global.CASO&&CASO.perguntaPadrao)||"sete";
    return CASO&&CASO.partidas&&CASO.partidas[id]?id:"sete";
  }
  function partida(){ return (CASO.partidas||{})[partidaId()] || null; }
  function respostasPartida(p){
    var out={}; (p&&p.campos||[]).forEach(function(c){out[c.id]=c.resposta;}); return out;
  }
  function escLocal(s){ return typeof esc==="function"?esc(s):String(s==null?"":s); }

  /* O JSON passa a ser a fonte canônica. A função antiga sobrescrevia as
     pistas das tarefas com textos do cofre mesmo depois de ler o JSON. */
  global.aplicarCaso=function(c){
    if(!c)return;
    c.tarefas=c.tarefas||{};
    c.tarefas.inclinacao=Object.assign({titulo:"A Janela do Norte",arquivo:"MOSAICO-26-a-janela-do-norte.html?embed=1"},c.tarefas.inclinacao||{});
    c.tarefas.constelacao=Object.assign({titulo:"O Vidro Embaçado",arquivo:"MOSAICO-26-vidro-embacado.html?embed=1"},c.tarefas.constelacao||{});
    c.tarefas.salaEscura=Object.assign({titulo:"A Sala às Escuras",arquivo:"MOSAICO-26-a-sala-as-escuras.html?embed=1&v=20261004-janelas"},c.tarefas.salaEscura||{});
    CASO=c;
    PERSONAGENS=c.elenco||PERSONAGENS;
    ROTEIRO=c.roteiros||ROTEIRO;
    PISTA_PRIVADA=c.pistas||PISTA_PRIVADA;
    PUBLICAS=c.publicas||PUBLICAS;
    HORA_FASE=c.relogio||HORA_FASE;
    CAP_FASE=c.capitulos||CAP_FASE;
    HISTORIA=c.historia||HISTORIA;
    if(!STATE.partidaId)STATE.partidaId=c.perguntaPadrao||"sete";
  };

  var css=document.createElement("style");
  css.textContent=`
    /* A profundidade destes elementos saiu daqui em 02/09/2026 e mora em
       css/profundidade.css. Este bloco desenhava a parede de rgba(0,0,0,.72)
       sobre o breu #05070c: preto sobre preto, volume nenhum. E, por ser um
       <style> injetado depois de tudo, vencia a folha da pagina — consertar o
       CSS nao adiantava enquanto isto existisse. Camada de caso declara a
       classe; a altura e a parede saem do arquivo. NAO devolver box-shadow
       aqui. O que ficou e so o arredondamento, que e forma, nao volume. */
    .card,.jog,.fragmento-encontro,.sala-acordeao,.deducao-card{border-radius:9px}
    .btn,.forma-op,.pers-op,.ritmo-op,.mosaico-escolher,.mosaico-opcao{
      border-width:1px;border-bottom-width:2px}
    .partidas-casa{display:grid;gap:10px;margin:16px 0 22px}
    .partida-casa{width:100%;text-align:left;padding:15px 16px;border:1px solid rgba(143,163,184,.28);border-radius:10px;
      background:linear-gradient(165deg,rgba(17,27,39,.96),rgba(7,11,17,.98));color:var(--texto)}
    .partida-casa.on{border-color:rgba(232,164,76,.78);background:linear-gradient(165deg,rgba(69,47,21,.96),rgba(18,14,11,.98))}
    .partida-casa b{display:block;color:#fff;font:700 19px/1.15 var(--serif)}
    .partida-casa small{display:block;color:var(--ambar);font:800 10px/1.2 var(--sans);letter-spacing:.15em;text-transform:uppercase;margin:5px 0}
    .partida-casa span{display:block;color:var(--nevoa);font:600 14px/1.38 var(--serif)}
    .pergunta-mae{margin:8px 0 16px;padding:16px 18px;border:1px solid rgba(232,164,76,.45);border-left:4px solid var(--ambar);border-radius:8px;
      background:linear-gradient(145deg,rgba(72,47,19,.92),rgba(11,15,21,.95))}
    .pergunta-mae b{display:block;color:var(--ambar);font:800 10px var(--sans);letter-spacing:.18em;text-transform:uppercase;margin-bottom:7px}
    .pergunta-mae p{margin:0;color:#fff;font:600 clamp(21px,5.4vw,29px)/1.3 var(--serif)}
    .painel-mapa{position:relative;margin:0 0 14px;border:1px solid rgba(232,164,76,.34);border-radius:10px;overflow:hidden;background:#090d13}
    .painel-mapa img{width:100%;display:block;opacity:.92}
    .mapa-faixa{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:rgba(232,164,76,.18)}
    .mapa-dado{padding:9px 7px;background:rgba(5,7,12,.96);text-align:center}
    .mapa-dado b{display:block;color:var(--ambar);font:800 16px var(--sans)}
    .mapa-dado span{display:block;color:var(--nevoa);font:700 8px var(--sans);letter-spacing:.1em;text-transform:uppercase;margin-top:2px}
    .mapa-alerta{padding:10px 12px;border-top:1px solid rgba(224,103,79,.35);background:rgba(70,19,18,.88);color:#ffd7cf;text-align:center;font:700 12px/1.3 var(--sans)}
    .resolucao-dinamica{display:grid;gap:9px;margin:16px 0}
    .resolucao-dinamica .card b{display:block;color:var(--ambar);font-size:11px;letter-spacing:.12em;text-transform:uppercase;margin-bottom:6px}
    .contagem-revelacao{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:14px;margin:22px 0}
    .contagem-revelacao .numero{padding:18px 12px;text-align:center;border:1px solid var(--linha);border-radius:9px;background:rgba(7,12,18,.94)}
    .contagem-revelacao .numero strong{display:block;font:700 clamp(50px,11vw,88px)/.9 var(--serif);color:var(--nevoa)}
    .contagem-revelacao .numero.real strong{color:var(--ambar);text-shadow:0 0 24px rgba(232,164,76,.35)}
    .contagem-revelacao .seta{font-size:32px;color:var(--ambar)}
    @media(min-width:900px){.partidas-casa{grid-template-columns:repeat(3,1fr)}.painel-mapa{max-height:52vh}.painel-mapa img{max-height:43vh;object-fit:contain;background:#d4b987}}
  `;
  document.head.appendChild(css);

  global.escolherPartidaCasa=function(id){
    if(!CASO.partidas||!CASO.partidas[id])return;
    STATE.partidaId=id; render(true);
  };

  var telaInicioBase=global.telaInicio;
  global.telaInicio=function(){
    if(!CASO.partidas)return telaInicioBase();
    var atual=partidaId();
    var cards=Object.keys(CASO.partidas).map(function(id){var p=CASO.partidas[id];return '<button class="partida-casa '+(id===atual?'on':'')+'" onclick="escolherPartidaCasa(\''+id+'\')"><b>'+escLocal(p.titulo)+'</b><small>'+escLocal(p.natureza)+'</small><span>'+escLocal(p.pergunta)+'</span></button>';}).join('');
    return '<h1>A Casa da Costa</h1><p class="lead">A mesma noite. Os mesmos fatos. Perguntas diferentes.</p><span class="eyebrow">Escolha a pergunta da partida</span><div class="partidas-casa">'+cards+'</div><div class="pergunta-mae"><b>Pergunta-mãe</b><p>'+escLocal(partida().pergunta)+'</p></div>'+avisoLocal()+'<button class="btn btn-ambar" onclick="pedirSenha()">Abrir uma mesa</button><button class="btn btn-frio" onclick="irPara(\'entrar\')">Entrar em uma mesa</button><p class="muted" style="margin-top:24px">A pergunta muda. A realidade canônica da Casa da Costa não.</p>'+modalSenha();
  };

  var criarMesaBase=global.criarMesa;
  global.criarMesa=async function(modo){
    var escolhido=partidaId();
    await criarMesaBase(modo);
    if(STATE.doc)STATE.doc.partidaId=escolhido;
    if(STATE.mesa&&STATE.mesa.codigo){
      try{var FB=await esperarFB();await FB.atualizarMesa(STATE.mesa.codigo,{partidaId:escolhido});}catch(e){console.error("partida da Casa",e);}
    }
  };

  function perguntaHtml(){var p=partida();return p?'<div class="pergunta-mae"><b>'+escLocal(p.natureza)+' · pergunta da partida</b><p>'+escLocal(p.pergunta)+'</p></div>':'';}

  var painelCasoBase=global.painelCasoMovel;
  global.painelCasoMovel=function(){
    var html=painelCasoBase();
    if(!html)return html;
    return html.replace('<div class="card"><span class="eyebrow">O que fazer agora</span>',perguntaHtml()+'<div class="card"><span class="eyebrow">O que fazer agora</span>');
  };

  function mapaCasaHtml(){
    var fase=(STATE.doc&&STATE.doc.fase)||"sala";
    var pubs=(STATE.publicas||[]).length;
    var sinais=Math.max(0,Math.min(6,pubs));
    var texto=fase==="sala"?"A planta começa limpa. Cada fato validado passa a ocupar um lugar na casa.":
      fase==="resultado"?"Os pontos que pareciam isolados agora pertencem à mesma presença.":
      sinais<3?"A casa ainda explica quase tudo. Continue observando.":
      "Há sinais em posições que a contagem declarada ainda não explica.";
    return '<div class="painel-mapa"><img src="'+escLocal((CASO.arte&&CASO.arte.planta)||'img/casa-da-costa-planta-1867.webp')+'" alt="Planta histórica da Casa da Costa, construída em 1867"><div class="mapa-faixa"><div class="mapa-dado"><b>6</b><span>entradas pelo portão</span></div><div class="mapa-dado"><b>'+sinais+'</b><span>sinais posicionados</span></div><div class="mapa-dado"><b>'+((fase==="deducao"||fase==="resultado")?'?':'—')+'</b><span>presenças reais</span></div></div><div class="mapa-alerta">'+escLocal(texto)+'</div></div>';
  }

  var telaPainelBase=global.telaPainel;
  global.telaPainel=function(){
    var html=telaPainelBase();
    var fase=(STATE.doc&&STATE.doc.fase)||"sala";
    if(fase==="resultado")return html;
    var alvo='<div class="painel-pistas"><span class="eyebrow">Pistas gerais</span>';
    return html.replace(alvo,'<div class="painel-pistas"><span class="eyebrow">Mapa coletivo · Arquivo 1867</span>'+mapaCasaHtml()+'<span class="eyebrow">Memória pública da casa</span>');
  };

  var orientacaoBase=global.orientacaoCaso;
  global.orientacaoCaso=function(fase){
    if(fase==="deducao")return "Responda aos campos que nasceram da pergunta desta partida. Depois de enviar, a decisão não poderá ser alterada.";
    return orientacaoBase(fase);
  };

  var modalOrientacaoBase=global.modalOrientacaoParticipante;
  global.modalOrientacaoParticipante=function(){
    return modalOrientacaoBase().replace(/acusa&ccedil;&atilde;o final/g,"decis&atilde;o final").replace(/acusa&ccedil;&atilde;o/g,"decis&atilde;o");
  };

  /* 11/10/2026: as opções saíam na ordem do JSON, quase sempre com a certa primeiro.
     Agora a ordem sai da semente da sala e do campo: igual em todos os aparelhos, diferente por campo e por mesa. */
  global.ordemOpcoesCasa=function(campoId,opcoes){
    var cod=(global.STATE&&(STATE.eu&&STATE.eu.codigo||STATE.mesa&&STATE.mesa.codigo))||"solo";
    var t=String(cod)+"|"+String(campoId||""),h=2166136261;for(var i=0;i<t.length;i++)h=Math.imul(h^t.charCodeAt(i),16777619)>>>0;
    var a=(opcoes||[]).slice();for(var k=a.length-1;k>0;k--){h=Math.imul(h^(h>>>15),2246822519)>>>0;h=(h+0x6D2B79F5)>>>0;var j=h%(k+1),x=a[k];a[k]=a[j];a[j]=x;}
    return a;
  };

  global.telaDeducao=function(){
    var eu=meuJogador(); if(!eu)return '';
    if((STATE.v5.deducoes||[]).some(function(d){return d.id===eu.id;}))return '<span class="eyebrow">Decisão final</span><h2>Resposta registrada.</h2><p class="lead">Sua decisão e o horário de envio foram registrados. Aguarde a revelação.</p>';
    var p=partida(), adquiridas=minhasPistas().filter(function(x){return x.adquirida;});
    function campo(c){return '<label>'+escLocal(c.rotulo)+'<select class="selecao-toque" id="ded-'+escLocal(c.id)+'"><option value="">Toque para escolher…</option>'+ordemOpcoesCasa(c.id,c.opcoes).map(function(o){return opcao(o,o);}).join('')+'</select></label>';}
    var checks=adquiridas.map(function(x){return '<label><input type="checkbox" name="pista-usada" value="'+escLocal(x.id)+'"> '+escLocal(x.hora+' — '+x.txt)+'</label>';}).join('')||'<p class="muted">Você não adquiriu pistas no mercado.</p>';
    return '<span class="eyebrow">Decisão final · '+escLocal(p.natureza)+'</span><h2>O que os fatos permitem concluir?</h2>'+perguntaHtml()+'<div class="card deducao-card">'+p.campos.map(campo).join('')+'<p><b>Pistas adquiridas usadas na decisão</b></p>'+checks+'</div><p class="muted" style="text-align:center">Depois de enviar, você não poderá alterar a resposta.</p><button class="btn btn-ambar" onclick="enviarDeducao()">Enviar decisão final</button>';
  };

  global.enviarDeducao=async function(){
    var p=partida(),dados={id:STATE.eu.id,partidaId:partidaId()};
    for(var i=0;i<p.campos.length;i++){var c=p.campos[i],el=document.getElementById('ded-'+c.id);if(!el||!el.value){avisa('Preencha todos os campos da pergunta.');return;}dados[c.id]=el.value;}
    dados.pistasUsadas=Array.from(document.querySelectorAll('input[name="pista-usada"]:checked')).map(function(x){return x.value;});
    var FB=await esperarFB();await FB.gravarServidor(STATE.eu.codigo,'deducoes',STATE.eu.id,dados,'submetidoEm');
  };

  var telaMercadoBase=global.telaMercado;
  global.telaMercado=function(){return telaMercadoBase().replace(/acusa&ccedil;&atilde;o final/g,"decis&atilde;o final").replace(/acusação final/gi,"decisão final");};

  global.finalizarPartida=async function(){
    var p=partida(),respostas=respostasPartida(p);
    var deducoes=STATE.v5.deducoes.map(function(d){
      var principal=d[p.principal]===respostas[p.principal], secundarios=p.campos.filter(function(c){return c.id!==p.principal;});
      var acertos=secundarios.reduce(function(n,c){return n+(d[c.id]===c.resposta?1:0);},0);
      var submetidoMs=d.submetidoEm&&d.submetidoEm.toMillis?d.submetidoEm.toMillis():(d.submetidoMs||0);
      return Object.assign({},d,{submetidoMs:submetidoMs,respostaPrincipalCorreta:principal,suspeitoCorreto:principal,camposCorretos:acertos,totalSecundarios:secundarios.length,usouPistaAdquirida:(d.pistasUsadas||[]).length>0});
    });
    var perf=MosaicoV5.dividirVoto(STATE.votos,STATE.jogadores.map(function(j){return j.id;}),5),coopInd={};
    STATE.jogadores.forEach(function(j){coopInd[j.id]=0;});
    var numeros=Array.from(new Set(STATE.jogadores.map(function(j){return j.nucleo;})));
    numeros.forEach(function(n){var ids=STATE.jogadores.filter(function(j){return j.nucleo===n;}).map(function(j){return j.id;}),pontos;
      if(STATE.jogadores.length<=3)pontos=Object.fromEntries(ids.map(function(id){return [id,0];}));
      else if(ids.length===2)pontos=Object.fromEntries(ids.map(function(id){return [id,5];}));
      else pontos=MosaicoV5.dividirVoto(STATE.v5.cooperacao.filter(function(v){return v.nucleo===n;}),ids,10);
      Object.assign(coopInd,pontos);});
    function msNucleo(n){var t=n&&n.concluidoEm;return t&&t.toMillis?t.toMillis():Infinity;}
    var concluidos=STATE.v5.nucleos.filter(function(n){return n.concluidoEm&&n.concluidoEm.toMillis;}).sort(function(a,b){return acertosMosaico(b)-acertosMosaico(a)||msNucleo(a)-msNucleo(b);});
    var escala=[20,16,12,8],coletivo={};
    if(STATE.jogadores.length<=3){var inicio=Number(STATE.doc&&STATE.doc.mosaicoAbertoMs)||0,dur=concluidos.length&&inicio?Math.max(0,msNucleo(concluidos[0])-inicio):Infinity,bonus=dur<=150000?2:dur<=300000?1:0,pontosAbs=Math.min(20,(concluidos[0]?acertosMosaico(concluidos[0]):0)*3+bonus);STATE.jogadores.forEach(function(j){coletivo[j.id]=pontosAbs;});}
    else STATE.jogadores.forEach(function(j){var pos=concluidos.findIndex(function(n){return Number(n.id)===Number(j.nucleo);});coletivo[j.id]=pos<0?0:(escala[pos]==null?4:escala[pos]);});
    var negociacoes=STATE.v5.negociacoes.map(function(n){var pistaObj=Object.keys(CASO.pistas||{}).map(function(k){return CASO.pistas[k];}).find(function(x){return x.id===n.pistaId;});return Object.assign({},n,{qualidade:(pistaObj&&pistaObj.qualidade)||'mediana'});});
    var pontosPercurso=await ACPontuacao.carregar(STATE.v5.tarefas||[],STATE.doc&&STATE.doc.percursoAC===1,[STATE.doc&&STATE.doc.acElencoAtividade&&STATE.doc.acElencoAtividade.runId]);
    var placar=MosaicoV5.calcular({jogadores:STATE.jogadores,deducoes:deducoes,negociacoes:negociacoes,coopColetiva:coletivo,coopIndividual:coopInd,performance:perf});
    placar=ACPontuacao.aplicar(placar,pontosPercurso);
    /* Aplique o placar no STATE local ANTES de publicar a fase resultado.
       Sem isto, telao-publica.js / o pódio leem j.total ainda zerado no mesmo
       ciclo de render e o telão anuncia zeros até o próximo snapshot.
       Espelha o patch de MOSAICO-mesa.html (PR #8): o live path sobrescreve
       finalizarPartida aqui e precisa do mesmo cuidado. */
    placar.forEach(function(l){
      var j=STATE.jogadores.find(function(x){return x.id===l.id;});
      if(!j)return;
      j.total=l.total; j.pontuacao=l.componentes; j.economiaDetalhe=l.economia;
    });
    var codigoSala=(STATE.mesa&&STATE.mesa.codigo)||(STATE.eu&&STATE.eu.codigo)||"";
    if(!codigoSala){console.error("MOSAICO: finalizarPartida sem código de sala");return;}
    var FB=await esperarFB();await FB.gravarPlacar(codigoSala,placar);
    var agora=Date.now();await FB.atualizarMesa(codigoSala,{fase:'resultado',revelacaoEtapa:0,reveladaEmMs:agora,solucao:respostas,partidaId:partidaId(),encerramentoIniciadoMs:0,encerramentoConcluido:true,encerramentoConcluidoMs:0});
  };

  var telaResultadoBase=global.telaResultado;
  global.telaResultado=function(){
    var etapa=etapaRevelacao(),p=partida(),rev=CASO.revelacaoFinal||{};
    if(encerramentoPendente())return '<span class="eyebrow">Encerramento da noite</span><h2>A CASA ESTÁ OUVINDO...</h2><p class="lead">As decisões foram registradas. Escute a história antes de a verdade ser revelada.</p><div class="card" style="text-align:center"><span class="cronometro-dourado">A revelação começará ao final da narração.</span></div>';
    if(etapa===0){
      var campos=p.campos.map(function(c){return '<div class="card"><b>'+escLocal(c.rotulo)+'</b>'+escLocal(c.resposta)+'</div>';}).join('');
      var contagem=partidaId()==='sete'?'<div class="contagem-revelacao"><div class="numero"><strong>6</strong><span>declaradas</span></div><div class="seta">→</div><div class="numero real"><strong>7</strong><span>reais</span></div></div>':'';
      return '<span class="eyebrow">A verdade · '+escLocal(p.natureza)+'</span><h2>'+escLocal(p.titulo)+'</h2><div class="pergunta-mae"><b>Pergunta respondida</b><p>'+escLocal(p.pergunta)+'</p></div>'+contagem+'<p class="lead">'+escLocal(p.revelacao||rev.sintese||'')+'</p><div class="resolucao-dinamica">'+campos+'</div>';
    }
    return telaResultadoBase();
  };

  /* A pergunta fica visível também no telão e no Caso durante toda a partida.
     Nas telas de sensor ela entra no bloco .sensor-copy (mesa), para não
     abrir um vão extra entre RODADA ATUAL e o quadro. */
  var cabecalhoBase=global.cabecalhoRodada;
  global.cabecalhoRodada=function(fase,classe){
    var h=cabecalhoBase(fase,classe);
    if(fase==='sala'||fase==='resultado')return h;
    if(STATE.tela==='inclinacao'||STATE.tela==='constelacao')return h;
    var p=partida();
    if(!p||!p.pergunta)return h;
    return h+'<div class="partida-pergunta">'+escLocal(p.pergunta)+'</div>';
  };

  /* O carregador antigo já pode ter renderizado a capa antes desta camada. */
  if(global.CASO&&CASO.partidas){if(!STATE.partidaId)STATE.partidaId=CASO.perguntaPadrao||"sete";render(true);}
})(window);
