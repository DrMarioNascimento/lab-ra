/* TELA CHEIA NO IPHONE — "Ampliar" que funciona em qualquer aparelho.

   O Safari do iPhone só põe vídeo em tela cheia: `elemento.requestFullscreen()`
   não existe ou falha para o palco 3D, e o botão Ampliar das bancadas não fazia
   nada. Onde a API de verdade existe (PC, Android, iPad), este arquivo não age.

   Onde ela falta, simula: o elemento pedido passa a ocupar a tela inteira
   (position: fixed, respeitando notch e barra inferior), `document.fullscreenElement`
   passa a apontar para ele e o evento `fullscreenchange` é disparado. Assim o
   código de cada bancada (que já chama requestFullscreen/exitFullscreen e ouve
   fullscreenchange) funciona sem mudança. Se o botão Ampliar fica fora do palco,
   aparece um botão "Reduzir" próprio para sair.

   COMO INCLUIR: script clássico, antes dos módulos da página. */
(function () {
  'use strict';
  var raiz = document.documentElement;
  var forcar = false;
  try { forcar = new URLSearchParams(location.search).has('telacheiasimulada'); } catch (e) {}
  var nativa = typeof raiz.requestFullscreen === 'function' && document.fullscreenEnabled !== false;
  if (nativa && !forcar) return;

  var atual = null, sair = null;
  var estilo = document.createElement('style');
  estilo.textContent =
    '.tela-cheia-simulada{position:fixed!important;inset:0!important;left:0!important;top:0!important;width:100vw!important;' +
    'height:100vh!important;height:100dvh!important;max-width:none!important;max-height:none!important;min-height:0!important;' +
    'margin:0!important;border-radius:0!important;border:0!important;z-index:2147483000!important;box-sizing:border-box!important;' +
    'padding:env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)!important}' +
    'html.com-tela-cheia-simulada,html.com-tela-cheia-simulada body{overflow:hidden!important;overscroll-behavior:none}' +
    '.sair-tela-cheia-simulada{position:fixed;z-index:2147483001;top:max(10px,env(safe-area-inset-top));' +
    'right:max(10px,env(safe-area-inset-right));min-height:44px;padding:0 16px;border-radius:999px;border:1px solid #ffffff55;' +
    'background:linear-gradient(#2c4b5e,#152c3a);color:#fff;font:700 14px system-ui,sans-serif;cursor:pointer;' +
    'box-shadow:inset 0 2px 0 #ffffff30,0 4px 0 #07141c,0 8px 16px #0006;touch-action:manipulation}' +
    '.sair-tela-cheia-simulada:active{transform:translateY(3px);box-shadow:inset 0 1px 0 #ffffff30,0 1px 0 #07141c}';
  (document.head || raiz).appendChild(estilo);

  function avisar() {
    document.dispatchEvent(new Event('fullscreenchange', { bubbles: true }));
    window.dispatchEvent(new Event('resize'));
  }
  try {
    Object.defineProperty(document, 'fullscreenElement', { configurable: true, get: function () { return atual; } });
    Object.defineProperty(document, 'fullscreenEnabled', { configurable: true, get: function () { return true; } });
  } catch (e) { return; }

  function botaoSair() {
    if (sair) return sair;
    sair = document.createElement('button');
    sair.type = 'button'; sair.className = 'sair-tela-cheia-simulada'; sair.textContent = '✕ Reduzir';
    sair.setAttribute('aria-label', 'Sair da tela cheia');
    sair.addEventListener('click', function (e) { e.stopPropagation(); document.exitFullscreen(); });
    return sair;
  }

  Element.prototype.requestFullscreen = function () {
    if (atual && atual !== this) atual.classList.remove('tela-cheia-simulada');
    atual = this;
    this.classList.add('tela-cheia-simulada');
    raiz.classList.add('com-tela-cheia-simulada');
    /* Se o botão que pediu a tela cheia está dentro do palco, ele mesmo vira "Reduzir";
       senão, um botão próprio de saída fica visível. */
    var origem = document.activeElement;
    if (!(origem && this.contains(origem))) document.body.appendChild(botaoSair());
    try { window.scrollTo(0, 0); } catch (e) {}
    setTimeout(avisar, 0);
    return Promise.resolve();
  };
  document.exitFullscreen = function () {
    if (atual) {
      atual.classList.remove('tela-cheia-simulada');
      atual = null;
      raiz.classList.remove('com-tela-cheia-simulada');
      if (sair && sair.parentNode) sair.parentNode.removeChild(sair);
      setTimeout(avisar, 0);
    }
    return Promise.resolve();
  };
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && atual) document.exitFullscreen(); });
})();
