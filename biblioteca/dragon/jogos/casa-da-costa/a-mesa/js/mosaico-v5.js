(function (global) {
  "use strict";

  const V5 = {};
  const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
  const inteiro = n => Math.trunc(Number(n) || 0);

  V5.CONFIG_PADRAO = Object.freeze({
    moedasIniciais: 12,
    precos: { baixo: 1, justo: 3, alto: 5 },
    /* 02/09/2026 — as rodadas sensoriais passaram a pontuar. Os 5 saíram de
       `tempo` (3) e `cooperacao` (2), decisão do Mario, e o total segue 100.
       São poucos DE PROPÓSITO: o pagamento real da atividade é o lote de
       fragmentos que ela entrega ao dossiê, e esse lote já alimenta `tempo` e
       `qualidade`. Pagar caro aqui seria cobrar duas vezes pela mesma coisa —
       e premiaria correr, quando o que se quer premiar é jogar bem. */
    pesos: { tempo: 29, qualidade: 13, cooperacao: 28, economia: 20, sensorial: 5, performance: 5 },
    /* Dois eixos, de propósito, e não são a mesma ordem:
         ORDEM DE CHEGADA  →  fragmentos (o pódio, no caso)
         DURAÇÃO           →  estes 5 pontos

       Quem perde 20 s na permissão do iPhone chega atrasado — pódio pior —
       mas pode ter duração excelente. A duração devolve ao aparelho lento o
       que a corrida lhe tira, e é por isso que vale medir as duas.

       CONFIANÇA: a duração não pode sair do relógio do jogador, que apenas
       afirma um número. Ela é `conclusão − pronto`, com as duas pontas
       carimbadas pela Mesa na chegada da mensagem. E há um piso físico:
       nenhuma execução honesta cabe abaixo de `minimoMs`, então valor menor
       é descartado em vez de virar pontuação. */
    sensorial: { rapidoMs: 75000, minimoMs: 9000, primeiros: 3 }
  });

  V5.tamanhosNucleos = function (quantidade) {
    const mapa = {
      1: [1], 2: [2], 3: [3], 4: [2, 2], 5: [3, 2], 6: [3, 3],
      7: [3, 2, 2], 8: [3, 3, 2], 9: [3, 3, 3],
      10: [3, 3, 2, 2], 11: [3, 3, 3, 2], 12: [3, 3, 3, 3]
    };
    return (mapa[quantidade] || []).slice();
  };

  V5.distribuirNucleos = function (jogadores) {
    const ordenados = jogadores.slice().sort((a, b) => (a.entrouMs || 0) - (b.entrouMs || 0));
    const tamanhos = V5.tamanhosNucleos(ordenados.length);
    if (!tamanhos.length) throw new Error("A versão atual admite de 1 a 12 jogadores.");
    const saida = [];
    let cursor = 0;
    tamanhos.forEach((tam, indice) => {
      for (let i = 0; i < tam; i += 1) saida.push({ id: ordenados[cursor++].id, nucleo: indice + 1 });
    });
    return saida;
  };

  function principalCorreta(d) {
    return !!(d && (d.respostaPrincipalCorreta != null ? d.respostaPrincipalCorreta : d.suspeitoCorreto));
  }

  /* A escala desceu 3 degraus inteiros (era 32/29/26/23/20/17, piso 14) para
     abrir espaço ao componente sensorial. O ESPAÇAMENTO não mudou: continuam
     3 pontos entre colocações, e 15 entre o primeiro e o sexto. Comprimir a
     escala em vez de deslocá-la teria achatado a disputa da acusação final,
     que é outra coisa. */
  V5.pontosTempo = function (deducoes) {
    const escala = [29, 26, 23, 20, 17, 14];
    const corretas = deducoes.filter(principalCorreta).sort((a, b) => a.submetidoMs - b.submetidoMs);
    const pontos = {};
    let inicio = 0;
    while (inicio < corretas.length) {
      let fim = inicio;
      while (fim + 1 < corretas.length && corretas[fim + 1].submetidoMs - corretas[inicio].submetidoMs <= 3000) fim += 1;
      let soma = 0;
      for (let pos = inicio; pos <= fim; pos += 1) soma += escala[pos] == null ? 11 : escala[pos];
      const dividido = Math.floor(soma / (fim - inicio + 1));
      for (let k = inicio; k <= fim; k += 1) pontos[corretas[k].id] = dividido;
      inicio = fim + 1;
    }
    deducoes.forEach(d => { if (pontos[d.id] == null) pontos[d.id] = 0; });
    return pontos;
  };

  V5.pontosQualidade = function (camposCorretos, principal, totalSecundarios) {
    if (!principal) return 0;
    const total = Math.max(1, inteiro(totalSecundarios == null ? 4 : totalSecundarios));
    const acertos = clamp(inteiro(camposCorretos), 0, total);
    return Math.round(13 * acertos / total);
  };

  V5.pontosMoedas = function (moedas) {
    moedas = Math.max(0, inteiro(moedas));
    if (moedas >= 9) return 8;
    if (moedas >= 7) return 7;
    if (moedas >= 5) return 5;
    if (moedas >= 3) return 3;
    if (moedas >= 1) return 1;
    return 0;
  };

  V5.pontosConfiabilidade = function (negociacoes, jogadorId) {
    const matriz = {
      boa: { baixo: 3, justo: 2, alto: 1 },
      mediana: { baixo: 1, justo: 0, alto: -2 },
      ruim: { baixo: 0, justo: -2, alto: -3 }
    };
    const soma = negociacoes.reduce((total, n) => {
      if (n.vendedorId !== jogadorId || n.status !== "comprada") return total;
      return total + ((matriz[n.qualidade] && matriz[n.qualidade][n.faixaPreco]) || 0);
    }, 0);
    return clamp(soma, -7, 7);
  };

  V5.pontosEconomia = function (jogador, deducao, negociacoes) {
    const moedas = V5.pontosMoedas(jogador.moedas);
    const confiabilidade = V5.pontosConfiabilidade(negociacoes, jogador.id);
    let gasto = deducao && principalCorreta(deducao) ? (deducao.usouPistaAdquirida ? 5 : 2) : 0;
    if (confiabilidade < 0) gasto = 0;
    return { moedas, gasto, confiabilidade, total: clamp(moedas + gasto + confiabilidade, 0, 20) };
  };

  /* ── Rodadas sensoriais ────────────────────────────────────────────────
     Recebe os tempos JOGADOS de cada atividade concluída (a pausa da Mesa já
     sai da conta dentro do módulo) e devolve de 0 a 5.

     Por atividade: 1 ponto por concluir — o PISO, que existe para que um
     aparelho lento não saia de mãos vazias — e 1 a mais por concluir dentro
     do patamar rápido. Com duas atividades isso dá 4; o quinto ponto é o
     bônus de ter sido rápido nas DUAS, que é o único jeito de chegar ao teto.

     Escala inteira de propósito: meio ponto num placar de 100 não se lê numa
     mesa, e arredondar meio ponto seis vezes gera empate que ninguém explica.

     Não há punição por demorar além do piso. Quem demora já paga na moeda que
     importa — o lote de fragmentos que a atividade entrega ao dossiê. */
  V5.pontosSensorial = function (temposMs, cfg) {
    const patamar = (cfg && cfg.sensorial) || V5.CONFIG_PADRAO.sensorial;
    const rapido = Number(patamar.rapidoMs) || V5.CONFIG_PADRAO.sensorial.rapidoMs;
    /* Piso físico: nenhuma execução honesta cabe abaixo disso — a Janela
       sozinha exige sete permanências de 1,5 s. Duração menor é sinal de
       relógio adulterado, e some em vez de virar o melhor patamar. */
    const minimo = Number(patamar.minimoMs) || 0;
    const validos = (temposMs || []).map(Number).filter(t => Number.isFinite(t) && t >= minimo && t > 0);
    if (!validos.length) return 0;
    let pontos = 0;
    validos.forEach(t => { pontos += 1; if (t <= rapido) pontos += 1; });
    if (validos.length >= 2 && validos.every(t => t <= rapido)) pontos += 1;
    return clamp(pontos, 0, 5);
  };

  V5.dividirVoto = function (votos, elegiveis, teto) {
    const contagem = {};
    elegiveis.forEach(id => { contagem[id] = 0; });
    votos.forEach(v => { if (v.de !== v.para && contagem[v.para] != null) contagem[v.para] += 1; });
    const maior = Math.max(0, ...Object.values(contagem));
    const vencedores = maior ? Object.keys(contagem).filter(id => contagem[id] === maior) : [];
    const premio = vencedores.length ? Math.floor(teto / vencedores.length) : 0;
    const pontos = {};
    elegiveis.forEach(id => { pontos[id] = vencedores.includes(id) ? premio : 0; });
    return pontos;
  };

  V5.calcular = function (entrada) {
    const jogadores = entrada.jogadores || [];
    const deducoes = entrada.deducoes || [];
    const negociacoes = entrada.negociacoes || [];
    const porId = Object.fromEntries(deducoes.map(d => [d.id, d]));
    const tempo = V5.pontosTempo(deducoes);
    const coopColetiva = entrada.coopColetiva || {};
    const coopIndividual = entrada.coopIndividual || {};
    const performance = entrada.performance || {};
    /* Tempos das rodadas sensoriais, por jogador: { id: [ms, ms] }. Ausente,
       o componente vale 0 e o placar continua somando — mesa antiga, sem
       registro de tempo, não quebra. */
    const sensorial = entrada.sensorial || {};
    const cfg = entrada.configuracao || V5.CONFIG_PADRAO;
    return jogadores.map(j => {
      const d = porId[j.id] || { respostaPrincipalCorreta: false, camposCorretos: 0, totalSecundarios: 4 };
      const correta = principalCorreta(d);
      const economia = V5.pontosEconomia(j, d, negociacoes);
      const componentes = {
        tempo: tempo[j.id] || 0,
        qualidade: V5.pontosQualidade(d.camposCorretos, correta, d.totalSecundarios),
        cooperacao: clamp((coopColetiva[j.id] || 0) + (coopIndividual[j.id] || 0), 0, 28),
        economia: economia.total,
        sensorial: V5.pontosSensorial(sensorial[j.id], cfg),
        performance: clamp(performance[j.id] || 0, 0, 5)
      };
      return { id: j.id, nome: j.nome, componentes, economia,
        total: Object.values(componentes).reduce((a, b) => a + b, 0) };
    }).sort((a, b) => b.total - a.total || a.nome.localeCompare(b.nome));
  };

  global.MosaicoV5 = V5;

  if (typeof document !== "undefined") {
    document.addEventListener("error", function (ev) {
      var el = ev.target;
      if (el && el.tagName === "IMG" && /casa-da-costa-planta-1867\.webp(?:\?|$)/.test(el.src || "")) {
        el.src = "img/casa-da-costa-planta-1867.svg?v=20260902-selo";
      }
    }, true);

    setTimeout(function () {
      if (document.querySelector('script[data-casa-costa-v2]')) return;
      var s = document.createElement("script");
      s.src = "js/casa-da-costa-v2.js?v=20261011-t4";
      s.dataset.casaCostaV2 = "1";
      s.onload=function(){
        if(document.querySelector('script[data-rotacao-casa]'))return;
        var r=document.createElement("script");
        r.src="js/rotacao-partidas-casa.js?v=20261011-t4";
        r.dataset.rotacaoCasa="1";
        /* O banco modular entra DEPOIS da rotação: ele lê a pergunta que a
           rotação escolheu para semear a distribuição. Invertida a ordem, a
           primeira montagem do dossiê usaria a pergunta padrão e só se
           corrigiria no render seguinte. */
        r.onload=function(){
          if(document.querySelector('script[data-banco-casa]'))return;
          var b=document.createElement("script");
          b.src="js/banco-casa-da-costa.js?v=20261011-t4";
          b.dataset.bancoCasa="1";
          /* As atividades entram por último: elas envolvem criarMesa depois
             da rotação da pergunta, para lerem a partida já escolhida. */
          b.onload=function(){
            if(document.querySelector('script[data-atividades-casa]'))return;
            var a=document.createElement("script");
            a.src="js/atividades-casa-da-costa.js?v=20261011-t4";
            a.dataset.atividadesCasa="1";
            /* O rendimento entra por último: ele envolve concluirTarefaSensor
               e MosaicoV5.calcular, e precisa do banco e das atividades já
               definidos para saber qual lote entregar. */
            a.onload=function(){
              if(document.querySelector('script[data-rendimento-casa]'))return;
              var d=document.createElement("script");
              d.src="js/rendimento-casa-da-costa.js?v=20261004-janelas";
              d.dataset.rendimentoCasa="1";
              /* O Mosaico entra depois de tudo: ele substitui pistasMosaico,
                 dicasMosaico e rotuloPistaMosaico, e alinha a ordem canônica
                 a cada render. */
              d.onload=function(){
                if(document.querySelector("script[data-mosaico-casa]"))return;
                var m=document.createElement("script");
                m.src="js/mosaico-casa-da-costa.js?v=20260902-embaralha";
                m.dataset.mosaicoCasa="1";
                /* O Mercado entra por último: ele substitui telaMercado e
                   telaDeducao, e precisa do banco carregado para saber o que
                   ninguem descobriu (o monte). */
                m.onload=function(){
                  if(document.querySelector("script[data-mercado-casa]"))return;
                  var k=document.createElement("script");
                  k.src="js/mercado-casa-da-costa.js?v=20261011-t4";
                  k.dataset.mercadoCasa="1";
                  /* O telão entra por último: ele só publica o que a mesa já
                     sabe (pergunta, fase, resolução). Precisa do CASO e do
                     STATE.doc estabilizados pelas camadas acima. */
                  k.onload=function(){
                    if(document.querySelector("script[data-telao-casa]"))return;
                    var t=document.createElement("script");
                    t.src="js/telao-publica.js?v=20260906-placar-local";
                    t.dataset.telaoCasa="1";
                    document.head.appendChild(t);
                  };
                  document.head.appendChild(k);
                };
                document.head.appendChild(m);
              };
              document.head.appendChild(d);
            };
            document.head.appendChild(a);
          };
          document.head.appendChild(b);
        };
        document.head.appendChild(r);
      };
      document.head.appendChild(s);
    }, 0);
  }
})(window);