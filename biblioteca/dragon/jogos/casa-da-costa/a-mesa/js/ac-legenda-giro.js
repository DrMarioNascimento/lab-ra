/* O giro dos ícones (Mario, 19/09/2026): da sala de espera em diante, em
   toda tela de espera ou de decisão, um cartão mostra UM ícone por vez com
   o seu significado, trocando a cada 6 s. Quem chega à primeira tarefa já
   sabe o que é ⏳, 💡 e 🤝 — sem parar para ler uma lista. Não aparece na
   apuração nem no pódio. "Ver todos" abre a lista inteira.

   É o mesmo arquivo na Mesa e no Solo. A lista de janelas repete a de
   ac-janelas.js (ícone e nome); se uma mudar, mude as duas. */
(function (global) {
  'use strict';
  var PASSO_MS = 6000;
  var ITENS = [
    ['⏳', 'Tempo', 'Toda tarefa tem tempo total. Quanto antes terminar, mais pontos; esgotou, não pontua — e o jogo segue.'],
    ['💡', 'Dica', 'Duas dicas chegam no caminho: a primeira é sutil, a segunda ajuda mais. Nenhuma entrega a resposta.'],
    ['🤝', 'Cooperação', 'Tarefa em dupla ou no Fragmento. No Solo, a fala do seu parceiro automático.'],
    ['🔎', 'Investigação', 'A janela da tarefa que você está jogando agora.'],
    ['🧭', 'Orientações', 'O que fazer nesta etapa.'],
    ['🧩', 'Pista encontrada', 'Uma descoberta sua. Ela vai para o seu Arquivo.'],
    ['❔', 'Dica da pista', 'Ajuda a ler uma pista que você já tem.'],
    ['🗂️', 'Dossiê', 'O que foi reunido até aqui.'],
    ['☑️', 'Confirmação', 'Confira antes de seguir: a ação não volta.'],
    ['🏆', 'Resultado da tarefa', 'Quanto você fez naquela etapa.'],
    ['⚠️', 'Atenção', 'Um aviso que pede a sua atenção agora.'],
    ['📖', 'Como jogar', 'As instruções da tarefa e, no fim, todos os ícones.'],
    ['⌄', 'Chevron', 'Na barra do topo: traz de volta as janelas recolhidas.'],
    ['✕', 'Sair da RA', 'Só aparece durante a realidade aumentada.'],
    ['JxJ', 'Jogador contra jogador', 'Cada um por si, disputando a colocação.'],
    ['JcJ', 'Jogador com jogador', 'Em dupla ou no Fragmento: os pontos são do grupo.'],
    ['J', 'Individual', 'Você e a tarefa, sem disputa direta.'],
    ['JxC', 'Jogadores contra o caso', 'Todos contra a pergunta final do caso.']
  ];
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  /* O índice sai do relógio, não de um contador: a Mesa redesenha a tela a
     cada atualização da sala, e o cartão não pode voltar ao primeiro ícone. */
  function indice(agora) { return Math.floor((agora == null ? Date.now() : agora) / PASSO_MS) % ITENS.length; }
  function miolo(i) {
    var it = ITENS[i];
    return '<span class="ac-giro-ic' + (/^[A-Za-z]+$/.test(it[0]) ? ' sigla' : '') + '" aria-hidden="true">' + esc(it[0]) + '</span>' +
      '<span class="ac-giro-txt"><b>' + esc(it[1]) + '</b> ' + esc(it[2]) + '</span>';
  }
  function html() {
    estilo();
    return '<aside class="ac-giro" aria-label="O que significa cada ícone">' +
      '<span class="ac-giro-rot">Enquanto isso · os ícones do jogo</span>' +
      '<p class="ac-giro-item" data-ac-giro aria-live="off">' + miolo(indice()) + '</p>' +
      '<button type="button" class="ac-giro-todos" onclick="ACGiro.abrirTodos()">Ver todos</button>' +
      '</aside>';
  }
  function girar() {
    var i = indice();
    var els = document.querySelectorAll('[data-ac-giro]');
    for (var k = 0; k < els.length; k++) {
      var el = els[k];
      if (el.getAttribute('data-i') === String(i)) continue;
      el.setAttribute('data-i', String(i));
      el.innerHTML = miolo(i);
      el.classList.remove('ac-giro-entra'); void el.offsetWidth; el.classList.add('ac-giro-entra');
    }
  }
  /* A lista inteira fica FORA do #app: sobrevive ao redesenho da tela. */
  function abrirTodos() {
    estilo();
    fecharTodos();
    var fundo = document.createElement('div');
    fundo.className = 'ac-giro-fundo'; fundo.id = 'ac-giro-todos';
    fundo.setAttribute('role', 'dialog'); fundo.setAttribute('aria-modal', 'true'); fundo.setAttribute('aria-label', 'Os ícones do jogo');
    fundo.innerHTML = '<div class="ac-giro-cartao"><h3>Os ícones do jogo</h3><ul>' +
      ITENS.map(function (it) { return '<li><span class="ac-giro-ic' + (/^[A-Za-z]+$/.test(it[0]) ? ' sigla' : '') + '" aria-hidden="true">' + esc(it[0]) + '</span><span><b>' + esc(it[1]) + '</b> ' + esc(it[2]) + '</span></li>'; }).join('') +
      '</ul><button type="button" class="ac-giro-fechar" onclick="ACGiro.fecharTodos()">Fechar</button></div>';
    fundo.addEventListener('click', function (ev) { if (ev.target === fundo) fecharTodos(); });
    document.body.appendChild(fundo);
    var b = fundo.querySelector('.ac-giro-fechar'); if (b) b.focus();
  }
  function fecharTodos() { var f = document.getElementById('ac-giro-todos'); if (f) f.remove(); }
  if (typeof document !== 'undefined') document.addEventListener('keydown', function (ev) { if (ev.key === 'Escape') fecharTodos(); });
  var CSS = '.ac-giro{margin:18px 0 10px;padding:12px 14px 10px;border:1px solid rgba(202,215,232,.28);border-left:3px solid #CAD7E8;border-radius:10px;background:rgba(10,16,22,.72);text-align:left;box-sizing:border-box;max-width:100%}' +
    '.ac-giro-rot{display:block;font:700 10px/1.3 system-ui,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:#9fb1c4;margin-bottom:6px}' +
    '.ac-giro-item{display:flex;gap:10px;align-items:flex-start;margin:0;min-height:3.9em;font:14px/1.4 system-ui,sans-serif;color:#e9eef3}' +
    '.ac-giro-item b{color:#fff}' +
    '.ac-giro-ic{flex:0 0 auto;min-width:1.7em;text-align:center;font-size:20px;line-height:1.1}' +
    '.ac-giro-ic.sigla{font:800 12px/1.9 system-ui,sans-serif;letter-spacing:.04em;color:#ffd18d;border:1px solid #ffd18d66;border-radius:6px;padding:0 4px}' +
    '.ac-giro-entra{animation:acGiroEntra .45s ease}' +
    '@keyframes acGiroEntra{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}' +
    '@media (prefers-reduced-motion:reduce){.ac-giro-entra{animation:none}}' +
    '.ac-giro-todos{margin-top:6px;min-height:44px;padding:8px 12px;background:transparent;border:1px solid rgba(202,215,232,.35);border-radius:8px;color:#CAD7E8;font:600 13px system-ui,sans-serif;cursor:pointer}' +
    '.ac-giro-fundo{position:fixed;inset:0;z-index:2147483000;background:rgba(2,5,8,.82);display:flex;align-items:center;justify-content:center;padding:max(16px,env(safe-area-inset-top)) 16px max(16px,env(safe-area-inset-bottom));box-sizing:border-box}' +
    '.ac-giro-cartao{width:100%;max-width:460px;max-height:100%;overflow-y:auto;-webkit-overflow-scrolling:touch;overscroll-behavior:contain;background:#0d171c;border:1px solid #CAD7E8;border-top:4px solid #CAD7E8;border-radius:14px;padding:16px 16px 14px;box-sizing:border-box;text-align:left;color:#e9eef3}' +
    '.ac-giro-cartao h3{margin:0 0 10px;font:700 17px/1.3 system-ui,sans-serif;color:#fff}' +
    '.ac-giro-cartao ul{list-style:none;margin:0;padding:0;display:grid;gap:9px}' +
    '.ac-giro-cartao li{display:flex;gap:10px;align-items:flex-start;font:13px/1.45 system-ui,sans-serif}' +
    '.ac-giro-fechar{display:block;width:100%;margin-top:14px;min-height:48px;border-radius:10px;border:1px solid #CAD7E8;background:#1b2b33;color:#fff;font:700 15px system-ui,sans-serif;cursor:pointer}';
  function estilo() {
    if (typeof document === 'undefined' || document.getElementById('ac-giro-css')) return;
    var s = document.createElement('style'); s.id = 'ac-giro-css'; s.textContent = CSS;
    (document.head || document.documentElement).appendChild(s);
  }
  if (typeof setInterval === 'function' && typeof document !== 'undefined') setInterval(girar, 1000);
  global.ACGiro = { ITENS: ITENS, PASSO_MS: PASSO_MS, indice: indice, html: html, abrirTodos: abrirTodos, fecharTodos: fecharTodos, girar: girar };
})(typeof window !== 'undefined' ? window : globalThis);
