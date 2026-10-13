/* O RITMO d'A Casa — tempo total, as duas dicas e os pontos de cada tarefa.

   Fonte única: a Mesa, o Solo, o motor da dupla (ac-core.mjs), o motor da
   maquete, os papéis e os testes leem daqui. Mudou um número, muda aqui.

   A regra (Mario, 18/09/2026):
   · toda tarefa tem um TEMPO TOTAL, porque vale pontos;
   · esgotou o tempo, a tarefa não pontua — mas a história segue: o que
     faltava se revela sozinho e a partida continua;
   · em dois momentos chega uma DICA: a primeira sutil, a segunda ajuda mais,
     e nenhuma entrega a tarefa;
   · dica não custa ponto. O que vale é a CORRIDA: quem termina antes
     pontua mais.

   Script clássico e módulo ao mesmo tempo: `<script src>` na página e
   `import './ac-ritmo.js'` nos motores — os dois deixam `ACRitmo` no global. */
(function (global) {
  'use strict';

  var R = {
    /* A escrivaninha: pôr a vela no castiçal e achar a etiqueta sob as
       gavetas. O relógio corre desde que a dupla chega à escrivaninha. */
    escrivaninha: { total: 240, dicas: [80, 150], max: 30, cheio: 0, passo: 8, min: 0 },
    /* A maquete: três camadas. Cada camada tem duas partes — a PROCURA (achar a
       chave de um lado e a fechadura do outro) e o ENCAIXE (levar a chave).
       As dicas contam desde o começo de cada parte. */
    maquete: { total: 540, dicasBusca: [45, 90], dicasEncaixe: [30, 60], max: 8, cheio: 60, passo: 15, min: 3 },
    /* Os papéis: três quebra-cabeças individuais; dicas por papel. */
    papeis: { total: 240, dicas: [40, 80], max: 5, cheio: 30, passo: 20, min: 2 },
    /* A noite em ordem (o Mosaico). */
    mosaico: { total: 240, dicas: [90, 160], max: 20, cheio: 60, passo: 12, min: 8 },
    /* Mercado e decisão só têm prazo: não são quebra-cabeças. */
    mercado: { total: 180 },
    decisao: { total: 120 },   /* igual à Dedução da Mesa (casa-da-costa.json) */
    /* O percurso inteiro na Mesa (sala 50 s + escrivaninha + maquete + papéis
       + folga para a dupla se encontrar entre as cenas). */
    percursoMesa: 1200
  };

  /* Pontos de uma tarefa terminada em `segundos`: cheio até `cheio`, depois
     perde 1 a cada `passo`, sem cair abaixo do mínimo. Depois do tempo total,
     zero. */
  function pontos(tarefa, segundos, total) {
    var t = R[tarefa]; if (!t) return 0;
    var limite = total == null ? t.total : total;
    if (!(segundos >= 0) || segundos > limite) return 0;
    var perdidos = Math.floor(Math.max(0, segundos - (t.cheio || 0)) / t.passo);
    return Math.max(t.min || 0, t.max - perdidos);
  }

  /* 0 = sem dica, 1 = a sutil, 2 = a que ajuda mais. */
  function nivelDaDica(segundos, marcas) {
    if (!marcas) return 0;
    return segundos >= marcas[1] ? 2 : segundos >= marcas[0] ? 1 : 0;
  }

  function relogio(segundos) {
    var s = Math.max(0, Math.ceil(segundos));
    return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
  }

  R.pontos = pontos;
  R.nivelDaDica = nivelDaDica;
  R.relogio = relogio;
  global.ACRitmo = R;
})(typeof window !== 'undefined' ? window : globalThis);
