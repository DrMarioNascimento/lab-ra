/* Identidade e ordem das caixas de A Casa — e, nas quatro telas d'A Casa
   (`<html data-ac-casa>`), o sistema de FAIXAS.

   Toda janela declara o seu nível com `data-ac-priority` (1 a 10). O nível dá
   símbolo, nome e cor (o "cromo de identidade") em qualquer página que carregue
   este arquivo — a Mesa, a Janela do Norte e o Vidro também o carregam, e para
   elas nada do que vem depois de `CASA` muda.

   Nas telas d'A Casa, o nível também diz ONDE a janela mora:
     alto  (3, 7, 9)  — aviso passageiro, some em 4 s; um por vez, o novo substitui;
     baixo (1, 2, 4, 6) — painéis, ficam até o estado mudar; ordenados pelo número;
     tela  (5, 8, 10) — <dialog>; um por vez.
   Duas janelas de faixas diferentes não se encontram porque as alturas das
   faixas somam menos que a tela (o teste `ac-janelas-sobreposicao` refaz a
   conta em três tamanhos). Duas da mesma faixa não se encontram porque só uma
   aparece por vez.

   Um botão só, na barra do topo, nas quatro telas: o chevron. Ele ABRE — traz
   de volta o que estiver recolhido. Fechar é gesto: tocar na cena recolhe,
   tocar fora do cartão fecha o diálogo, Esc fecha o que cobre, e o relógio de
   ociosidade recolhe sozinho. Nenhuma janela tem × próprio: o que tira o
   jogador de um diálogo é o botão que continua o jogo. */
(function(){
  const types={1:['🔎','Investigação','#FF9638'],2:['🧭','Orientações','#45ADFF'],3:['🧩','Pista encontrada','#42DA8B'],4:['❔','Dica da pista','#B18AFF'],5:['🗂️','Dossiê','#DCC9A3'],6:['🤝','Cooperação','#A2DCD5'],7:['☑️','Confirmação de ação','#F2C3AD'],8:['🏆','Resultado da tarefa','#EEC4DC'],9:['⚠️','Atenção / aviso','#FFE14A'],10:['📖','Como jogar','#CAD7E8']};
  const FAIXA={1:'baixo',2:'baixo',3:'alto',4:'baixo',5:'tela',6:'baixo',7:'alto',8:'tela',9:'alto',10:'tela'};
  const CASA=document.documentElement.hasAttribute('data-ac-casa');
  /* Os tempos do relógio. Propostos no desenho de 17/09/2026; se mudarem, é
     aqui — nunca no ponto de uso. */
  const TEMPO_AVISO=4000, TEMPO_PAINEIS=15000;

  function telefone(){
    try { return matchMedia('(max-width:700px)').matches; } catch (e) { return innerWidth <= 700; }
  }
  function decorate(){
    for(const [selector,n] of [['#mosaico-ra-inspect-modal .mosaico-ra-modal-card',2],['#mosaico-ra-prompt .mosaico-ra-prompt-card',2],['#oito',2],['#ra-investigation-modal .ra-inv-wrapper',3],['#pistas',5],['#master',2],['#mestre',2],['#dragonRoomGate',2],['#portao',10],['.partida-pausada',9],['.fragmento-confirmado',3]])document.querySelectorAll(selector).forEach(el=>el.dataset.acPriority=n);
    const screen=document.getElementById('app')?.dataset.acScreen;
    const screenTypes={resultado:8,apuracao:8,minhaPontuacao:8,classificacao:8,encerrada:8,deducao:1,mosaico:1,cooperacao:6,esperando:6,mercado:5,revelacao:3};
    document.querySelectorAll('#app .card:not([data-ac-priority]),#app .pergunta-mae:not([data-ac-priority])').forEach(el=>{
      el.dataset.acPriority=el.matches('.pergunta-mae,.deducao-card')?1:(screenTypes[screen]||2);
    });
    document.querySelectorAll('[data-ac-priority]').forEach(pintar);
  }
  function pintar(el){
    const n=Number(el.dataset.acPriority),t=types[n];if(!t)return;
    el.style.setProperty('--ac-accent',t[2]);if(el.parentElement?.classList.contains('ac-panel-stack'))el.style.order=n;
    // Pseudo-elementos nao alteram o texto usado pelos controladores existentes.
    el.dataset.acSymbol=t[0];el.dataset.acTitle=t[1];
    if(CASA)el.dataset.acFaixa=FAIXA[n];
  }
  function sortRuns(parent){
    let run=[];
    function flush(){
      const sorted=run.slice().sort((a,b)=>Number(a.dataset.acPriority)-Number(b.dataset.acPriority));
      if(sorted.some((e,i)=>e!==run[i])){const anchor=run[run.length-1].nextSibling;sorted.forEach(e=>parent.insertBefore(e,anchor));}
      run=[];
    }
    for(const child of Array.from(parent.children)){if(child.hasAttribute('data-ac-priority'))run.push(child);else flush();}flush();
  }
  function orderPanels(){
    const parents=new Set(Array.from(document.querySelectorAll('[data-ac-priority]')).map(e=>e.parentElement));
    for(const parent of parents)if(parent&&parent!==document.body&&!parent.closest('dialog,[role=dialog],[role=alertdialog],.modal-fundo,.dialogo-fundo')&&!parent.classList.contains('ac-panel-stack'))sortRuns(parent);
  }
  /* O rodapé de ferramentas muda de altura quando quebra em duas linhas ou
     quando botões aparecem e somem. A faixa de baixo nasce acima da altura
     MEDIDA dele, nunca de um número escolhido. */
  function medirRodape(){
    const tools=document.querySelector('.tools');
    const aplicar=()=>{
      let espaco=0;
      if(tools){
        const vis=Array.from(tools.children).some(b=>!b.hidden&&getComputedStyle(b).display!=='none');
        const r=tools.getBoundingClientRect();
        if(vis&&r.height)espaco=Math.max(0,Math.round(window.innerHeight-r.top));
      }
      document.documentElement.style.setProperty('--ac-rodape',espaco+'px');
    };
    aplicar();
    if(!tools)return;
    if(window.ResizeObserver)new ResizeObserver(aplicar).observe(tools);
    new MutationObserver(aplicar).observe(tools,{attributes:true,subtree:true,childList:true});
    window.addEventListener('resize',aplicar);
  }
  /* No Solo, a marca AC não pode levar o quadro para fora do percurso. */
  function travarMarcaNoSolo(){
    if(new URLSearchParams(location.search).get('demo')!=='solo')return;
    const brand=document.querySelector('.topbar .brand');
    if(brand){brand.removeAttribute('href');brand.addEventListener('click',e=>e.preventDefault());}
  }

  /* ---------------- intro das tarefas sensoriais (todas as páginas) ---------------- */
  function introAberta(){
    const intro=document.getElementById('intro');
    if(!intro||intro.hidden||intro.classList.contains('gone')||intro.classList.contains('out'))return null;
    return intro;
  }
  function dispararEntradaDaIntro(){
    const intro=introAberta();
    if(!intro)return false;
    const go=intro.querySelector('.go');
    if(go){go.click();return true;}
    intro.classList.add('gone');intro.hidden=true;recolher();
    return true;
  }
  /* Fora d'A Casa a intro ganha um ×: a Janela do Norte e o Vidro ainda não
     entraram no sistema de faixas. N'A Casa não há × em janela nenhuma — a
     intro sai pelo próprio CTA, por Esc ou por um toque fora do cartão. */
  function portaDaIntro(){
    if(CASA)return;
    const intro=document.getElementById('intro');
    if(!intro||intro.tagName==='DIALOG')return;
    if(intro.querySelector(':scope > .close'))return;
    const x=document.createElement('button');
    x.type='button';x.className='close';x.dataset.close='';
    x.setAttribute('aria-label','Fechar e entrar');x.textContent='×';
    intro.prepend(x);
  }
  function ancorarCtaDaIntro(){
    const intro=document.getElementById('intro');
    if(!intro||intro.querySelector('#intro-corpo'))return;
    const go=intro.querySelector('.go');
    if(!go)return;
    const corpo=document.createElement('div');corpo.id='intro-corpo';
    const keep=new Set();
    intro.querySelectorAll(':scope > .close, :scope > .go, :scope > .alt').forEach(el=>keep.add(el));
    Array.from(intro.childNodes).forEach(n=>{if(!keep.has(n))corpo.appendChild(n);});
    intro.insertBefore(corpo,go);
  }
  function recolherIntroCorpo(){
    const intro=document.getElementById('intro');
    const corpo=intro&&intro.querySelector('#intro-corpo');
    if(!intro||!corpo)return;
    Array.from(intro.children).forEach(el=>{
      if(el===corpo||el.classList.contains('close')||el.classList.contains('go')||el.classList.contains('alt'))return;
      corpo.appendChild(el);
    });
  }

  /* ---------------- o caminho antigo (Mesa, Janela, Vidro) ---------------- */
  function fecharDialogos(){
    document.querySelectorAll('dialog[open]').forEach(function(d){
      if(d.hasAttribute('data-ac-decisao'))return;
      try { d.close(); } catch (e) {}
    });
  }
  function recolherLegado(){
    document.body.classList.add('ac-cena-livre');
    fecharDialogos();
    document.querySelectorAll('[data-ac-priority="10"]:not(dialog)').forEach(panel=>panel.hidden=true);
    document.querySelectorAll('#coop-status').forEach(status=>status.hidden=true);
  }

  /* ---------------- A Casa: faixas, chevron e relógio ---------------- */
  let relogio=null, ultimoTexto=null, moldura=false, filhoMoldura=null;
  /* A tela está dentro do percurso? Então a barra do topo que vale é a do
     percurso: o chevron daqui se esconde e o de lá manda abrir. */
  try { moldura=parent!==window&&parent.document.documentElement.hasAttribute('data-ac-moldura'); } catch (e) { moldura=false; }

  function chevron(){ return document.getElementById('help'); }
  function pintarChevron(){
    const b=chevron();if(!b)return;
    const recolhido=document.body.classList.contains('ac-recolhido');
    b.textContent=recolhido?'⌃':'⌄';
    b.setAttribute('aria-label',recolhido?'Mostrar as janelas':'Janelas abertas');
    b.setAttribute('aria-expanded',String(!recolhido));
    if(moldura){try{parent.postMessage({mosaico:'ac-janelas',estado:recolhido?'recolhido':'aberto'},location.origin);}catch(e){}}
  }
  function faixaOcupada(){
    const pilha=document.querySelector('.ac-panel-stack');
    const pilhaVisivel=pilha&&!document.body.classList.contains('ac-recolhido')&&Array.from(pilha.children).some(e=>!e.hidden&&getComputedStyle(e).display!=='none');
    const aviso=Array.from(document.querySelectorAll('[data-ac-faixa="alto"]')).some(e=>!e.hidden&&getComputedStyle(e).display!=='none');
    const dialogo=!!document.querySelector('dialog[open]');
    return pilhaVisivel||aviso||dialogo;
  }
  /* O título de abertura não é janela: vive na área livre e sai de cena de
     vez assim que qualquer faixa for ocupada. Voltar quando o jogador recolhe
     tudo seria um cartaz gigante aparecendo justo quando ele quis a cena. */
  function conferirCapitulo(){
    if(!document.body.classList.contains('ac-capitulo-visto')&&faixaOcupada())document.body.classList.add('ac-capitulo-visto');
  }
  /* Os painéis da faixa baixa: a pilha e o que a página marcar com
     `data-ac-painel` (as Orientações da sala, que têm layout próprio). */
  function paineis(){ return Array.from(document.querySelectorAll('.ac-panel-stack,[data-ac-painel]')); }
  function textoDaPilha(){
    return paineis().map(function(p){
      const copia=p.cloneNode(true);
      copia.querySelectorAll('[data-ac-relogio]').forEach(e=>e.remove());
      return copia.textContent.replace(/\s+/g,' ').trim();
    }).join('|');
  }
  function armarRelogio(){
    clearTimeout(relogio);
    relogio=setTimeout(function(){recolher({relogio:true});},TEMPO_PAINEIS);
  }
  /* Sinal de vida: o toque do jogador OU uma MUDANÇA de estado da dupla. A
     página chama `vida()` quando algo mudou de fato — nunca na simples
     chegada de um snapshot, que a sala manda de segundo em segundo mesmo
     parada (e o Solo a cada 200 ms): zerar na chegada faz o relógio nunca
     terminar, e ninguém vê isso olhando a tela. */
  function vida(){ if(CASA)armarRelogio(); }
  function abrir(){
    if(!CASA){recolherLegado();return;}
    document.body.classList.remove('ac-recolhido');
    const pilha=document.querySelector('.ac-panel-stack');
    if(pilha){pilha.classList.remove('ac-pulso');void pilha.offsetWidth;pilha.classList.add('ac-pulso');}
    if(filhoMoldura){try{filhoMoldura.postMessage({mosaico:'ac-janelas',acao:'abrir'},location.origin);}catch(e){}}
    pintarChevron();armarRelogio();conferirCapitulo();
    window.dispatchEvent(new CustomEvent('ac-janelas-abrir'));
  }
  function recolher(opcoes){
    if(!CASA){recolherLegado();return;}
    document.body.classList.add('ac-recolhido');
    if(!(opcoes&&opcoes.relogio))fecharDialogos();
    pintarChevron();
  }
  /* O aviso de faixa alta: um por vez, some em 4 s. */
  function aviso(texto,nivel){
    const el=document.getElementById('notice');if(!el)return;
    if(nivel){el.dataset.acPriority=nivel;pintar(el);}
    el.textContent=texto;el.hidden=false;el.style.display='block';
    clearTimeout(el._t);el._t=setTimeout(function(){el.style.display='none';},TEMPO_AVISO);
    conferirCapitulo();
  }
  /* Troca o nível de uma janela (a orientação vira "Dica da pista" quando o
     que ela mostra é a pista, e volta depois). */
  function nivel(el,n){
    if(!el||String(el.dataset.acPriority)===String(n))return;
    el.dataset.acPriority=n;pintar(el);
  }
  function ligarCasa(){
    document.documentElement.classList.toggle('ac-sob-moldura',moldura);
    const b=chevron();
    if(b){b.classList.add('ac-chevron');b.type='button';}
    pintarChevron();
    document.addEventListener('click',function(ev){
      const alvo=ev.target;
      if(alvo.closest&&alvo.closest('#help')){ev.preventDefault();ev.stopImmediatePropagation();abrir();return;}
      const abre=alvo.closest&&alvo.closest('[data-ac-abrir]');
      if(abre){const d=document.getElementById(abre.dataset.acAbrir);if(d&&d.showModal&&!d.open){try{d.showModal();}catch(e){}}return;}
      const fecha=alvo.closest&&alvo.closest('[data-ac-fechar]');
      if(fecha){const d=fecha.closest('dialog');if(d){try{d.close();}catch(e){}}return;}
      /* Toque fora do cartão: o clique cai no próprio <dialog> (o fundo). */
      if(alvo.matches&&alvo.matches('dialog[open]')&&!alvo.hasAttribute('data-ac-decisao')){
        const r=alvo.getBoundingClientRect();
        const dentro=ev.clientX>=r.left&&ev.clientX<=r.right&&ev.clientY>=r.top&&ev.clientY<=r.bottom;
        if(!dentro){try{alvo.close();}catch(e){}}
      }
    },true);
    /* Tocar na CENA recolhe. A cena é o que a página marcar com
       `data-ac-cena`; o resto (botões, pegas, painéis) não conta. */
    document.addEventListener('pointerdown',function(ev){
      vida();
      if(ev.target.closest&&ev.target.closest('[data-ac-cena]'))recolher();
    },true);
    document.addEventListener('keydown',function(ev){vida();},true);
    /* Esc fecha o que cobre — menos as decisões obrigatórias (o portal da
       maquete, o bloqueio do percurso), que só saem pelo próprio botão. */
    document.addEventListener('cancel',function(ev){
      if(ev.target&&ev.target.hasAttribute&&ev.target.hasAttribute('data-ac-decisao'))ev.preventDefault();
    },true);
    /* Um diálogo por vez: o que abre fecha o outro. */
    new MutationObserver(function(recs){
      for(const r of recs){
        const d=r.target;
        if(r.attributeName==='open'&&d.open){
          document.querySelectorAll('dialog[open]').forEach(function(o){if(o!==d&&!o.hasAttribute('data-ac-decisao')){try{o.close();}catch(e){}}});
          conferirCapitulo();
        }
      }
    }).observe(document.body,{subtree:true,attributes:true,attributeFilter:['open']});
    /* Estado mudou dentro de um painel: ele volta à tela e o relógio zera.
       Compara o TEXTO, não a chegada — reescrever o mesmo texto não é mudança. */
    ultimoTexto=textoDaPilha();
    const observador=new MutationObserver(function(){
      const agora=textoDaPilha();
      if(agora===ultimoTexto)return;
      ultimoTexto=agora;abrir();
    });
    paineis().forEach(function(p){observador.observe(p,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['hidden']});});
    /* O percurso manda abrir; a tela de dentro obedece e conta o seu estado. */
    window.addEventListener('message',function(ev){
      if(ev.origin!==location.origin||!ev.data||ev.data.mosaico!=='ac-janelas')return;
      if(ev.data.acao==='abrir'&&ev.source===parent)abrir();
      if(ev.data.estado&&filhoMoldura&&ev.source===filhoMoldura){
        const b=chevron();if(!b)return;
        const recolhido=ev.data.estado==='recolhido';
        b.textContent=recolhido?'⌃':'⌄';b.setAttribute('aria-expanded',String(!recolhido));
      }
    });
    const frame=document.querySelector('iframe#scene');
    if(frame)filhoMoldura=frame.contentWindow;
    armarRelogio();
    setTimeout(conferirCapitulo,0);
  }

  function entrarAtividade(){
    document.body.classList.add('ac-atividade-iniciada');
    if(!CASA)recolherLegado();else conferirCapitulo();
  }
  /* Compatibilidade: o antigo "i" chamava ajuda(). Agora ajuda é abrir. */
  function ajuda(ev){
    if(ev){ev.preventDefault();ev.stopImmediatePropagation();}
    abrir();
  }

  function start(){
    travarMarcaNoSolo();
    const desk=document.querySelector('.instruction');
    if(desk){
      const stack=document.createElement('section');stack.className='ac-panel-stack';stack.setAttribute('aria-label','Investigação e orientações');document.body.append(stack);
      for(const el of [document.getElementById('manuscript'),desk,document.getElementById('coop-status')].filter(Boolean))stack.append(el);
    }
    portaDaIntro();ancorarCtaDaIntro();legendas();
    window.addEventListener('load',legendas,{once:true});setTimeout(legendas,1500);
    if(!CASA&&telefone()) document.body.classList.add('ac-cena-livre');
    if(!CASA&&document.getElementById('loading')&&!document.getElementById('loading').hidden)entrarAtividade();
    document.addEventListener('click',function(ev){
      if(ev.target.closest('#intro > .close, #intro [data-close]')){if(dispararEntradaDaIntro())return;}
      else if(!CASA&&ev.target.closest('[data-close]')){const d=ev.target.closest('dialog');if(d){try{d.close();}catch(e){}}recolherLegado();}
      else if(ev.target.id==='intro'){if(dispararEntradaDaIntro())return;}
      else if(!CASA&&ev.target.matches&&ev.target.matches('dialog[open]')){try{ev.target.close();}catch(e){}recolherLegado();}
    },true);
    document.addEventListener('keydown',function(ev){
      if(ev.key==='Escape'&&dispararEntradaDaIntro()){ev.preventDefault();}
    },true);
    if(!CASA){
      document.addEventListener('cancel',function(ev){
        if(ev.target&&ev.target.matches&&ev.target.matches('dialog'))recolherLegado();
      },true);
      document.addEventListener('close',function(ev){
        if(ev.target&&ev.target.matches&&ev.target.matches('dialog[data-ac-priority]'))recolherLegado();
      },true);
    }
    medirRodape();decorate();orderPanels();
    if(CASA)ligarCasa();
    new MutationObserver(records=>{
      if(records.some(r=>r.type==='attributes'&&r.target.matches('#intro.out,#intro.gone')))entrarAtividade();
      if(records.some(r=>r.addedNodes.length)){recolherIntroCorpo();decorate();orderPanels();}
    }).observe(document.body,{attributes:true,attributeFilter:['class'],childList:true,subtree:true});
  }
  /* A LEGENDA DOS ÍCONES (Mario, 19/09/2026: "ao final de como jogar inclua
     o que significa os ícones padronizados"). Sai da mesma tabela `types`
     que pinta as janelas — mudou um ícone, a legenda muda junto. Entra no fim
     de todo "Como jogar" d'A Casa (dialog#instructions), antes do botão. */
  const CONTROLES=[['⌄','Chevron (barra do topo): traz de volta as janelas recolhidas.'],['📖','Como jogar: estas instruções.'],['✕','Sair da realidade aumentada (só aparece durante a RA).'],['⏳','Tempo que resta e quanto a tarefa vale agora.'],['💡','Dica: a primeira é sutil; a segunda ajuda mais. Nenhuma entrega a resposta.'],['🤝','No Solo, a fala do seu parceiro automático.']];
  function legendaHTML(){
    const esc=t=>String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
    const janelas=Object.keys(types).map(n=>'<li><span aria-hidden="true">'+types[n][0]+'</span> <b>'+esc(types[n][1])+'</b></li>').join('');
    const ctrl=CONTROLES.map(c=>'<li><span aria-hidden="true">'+c[0]+'</span> '+esc(c[1])+'</li>').join('');
    return '<section class="ac-legenda" aria-label="O que significa cada ícone"><h3>O que significa cada ícone</h3><p>Cada janela traz o seu ícone e a sua cor:</p><ul>'+janelas+'</ul><p>E os sinais da tela:</p><ul>'+ctrl+'</ul></section>';
  }
  /* A legenda entra no fim de TODO "Como jogar": o dialog#instructions das
     páginas d'A Casa e a janela de entrada (#intro) das tarefas sensoriais
     — Janela do Norte, Sala às Escuras, Vidro Embaçado. Na #intro ela vai
     para o fim do corpo que rola, acima do botão de entrar. */
  function legendas(){
    const tmp=()=>{const t=document.createElement('div');t.innerHTML=legendaHTML();return t.firstChild;};
    document.querySelectorAll('dialog#instructions').forEach(d=>{
      if(d.querySelector('.ac-legenda'))return;
      const fim=d.querySelector('[data-ac-fechar],.ac-continuar');
      d.insertBefore(tmp(),fim||null);
    });
    const intro=document.getElementById('intro');
    if(intro&&intro.tagName!=='DIALOG'){
      /* Se a página acrescenta conteúdo à intro depois, a legenda é levada
         de novo para o fim (appendChild/insertBefore movem o nó). */
      const leg=intro.querySelector('.ac-legenda')||tmp();
      const corpo=intro.querySelector('#intro-corpo');
      if(corpo){if(corpo.lastElementChild!==leg)corpo.appendChild(leg);}
      /* Sem corpo que rola (Vidro Embaçado): a própria intro rola; a
         legenda fica depois dos botões, para o botão de entrar continuar
         à vista na primeira tela. */
      else if(intro.lastElementChild!==leg)intro.appendChild(leg);
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',legendas,{once:true});else legendas();
  window.ACJanelas={entrarAtividade,recolher,abrir,ajuda,vida,aviso,nivel,decorar:decorate,legendaHTML,TEMPO_AVISO,TEMPO_PAINEIS};
  window.addEventListener('ac-atividade-iniciada',entrarAtividade);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
