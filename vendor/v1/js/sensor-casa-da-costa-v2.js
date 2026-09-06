/* Conteúdo canônico das três tarefas sensoriais — Casa da Costa 2026.08.
   A engenharia visual/sensorial original permanece intacta. */
(function(){
  "use strict";
  var path=location.pathname.toLowerCase();
  var tipo=path.indexOf('janela-do-norte')>=0?'janela':path.indexOf('vidro-embacado')>=0?'vidro':path.indexOf('sala-as-escuras')>=0?'escura':'';
  if(!tipo)return;

  var dados={
    janela:{
      rotulo:'A primeira versão da noite',
      texto:'A casa já está diante de vocês. Não procure quem entrou. Observe o que se move do lado de dentro.',
      pista:'A sombra não prova entrada. Prova presença.',
      cor:'#ffd9b0'
    },
    vidro:{
      rotulo:'Cinco meses de casa fechada',
      texto:'Uma casa vazia acumula ausência. Procure o contrário: uso, cuidado, água, calor e rotina.',
      pista:'Sete xícaras e pouca poeira não explicam um instante. Explicam permanência.',
      cor:'#b9e7ff'
    },
    escura:{
      rotulo:'21h29–21h31 · dois minutos e dois segundos',
      texto:'No escuro, posição vale mais que suspeita. Separe os sons da casa dos sinais que exigem massa, respiração e movimento.',
      pista:'Respiração, vulto e colher formam um trajeto que não cabe nas posições dos seis.',
      cor:'#ffd0c6'
    }
  }[tipo];

  function inserir(){
    if(document.getElementById('nota-canonica-casa'))return;
    var intro=document.getElementById('intro');
    if(!intro)return;
    var box=document.createElement('div');
    box.id='nota-canonica-casa';
    /* A classe pega a profundidade em css/profundidade.css. O style inline
       abaixo NAO pode voltar a trazer box-shadow: inline vence folha, e a
       parede preta que estava aqui sumia no breu. Ver o item 5 de la. */
    box.className='nota-canonica';
    box.style.cssText='width:min(520px,92vw);margin:16px auto 15px;padding:12px 14px;border:1px solid rgba(255,217,176,.38);border-left:4px solid '+dados.cor+';border-radius:9px;background:rgba(3,7,12,.78);text-align:left;';
    box.innerHTML='<b style="display:block;color:'+dados.cor+';font:700 11px/1.2 Inter,system-ui,sans-serif;letter-spacing:.14em;text-transform:uppercase;margin-bottom:6px">'+dados.rotulo+'</b><span style="display:block;color:#f6f9fc;font:500 16px/1.45 Literata,Georgia,serif">'+dados.texto+'</span><em style="display:block;color:'+dados.cor+';font:600 15px/1.4 Literata,Georgia,serif;margin-top:7px">'+dados.pista+'</em>';
    var go=intro.querySelector('.go');
    if(go)intro.insertBefore(box,go);else intro.appendChild(box);
  }
  /* 02/09/2026 — daqui saiu `corrigirTexto`, que varria TODOS os nós de texto
     da página com um TreeWalker e trocava as frases do cânone antigo por
     regex, mais um MutationObserver sobre document.documentElement com
     subtree:true que repetia a varredura a cada nó inserido.

     As nove expressões foram testadas contra os três módulos: NENHUMA acertava
     nada. O texto que elas procuravam não existe nestes arquivos, e a Mesa não
     manda texto para o quadro — `urlTarefaSensor` passa só s, run, folga e
     decl, e o postMessage carrega apenas pausar/retomar. Era varredura
     permanente do DOM para efeito nenhum.

     Pior: o remendo dava a impressão de que o cânone antigo estava resolvido.
     Não estava. Ele vivia onde regex nunca alcançaria — no array FRAGMENTOS da
     Janela e no cofre da Sala às Escuras, que é objeto de cena com geometria,
     não frase. Os dois foram corrigidos na origem na mesma data.

     Se algum dia o cânone precisar mudar de novo, mude o TEXTO NA FONTE. Não
     volte a remendar a página depois de pronta. */

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',inserir);
  else inserir();
})();
