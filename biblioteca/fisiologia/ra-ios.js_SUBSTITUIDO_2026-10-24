/* RA NO IPHONE — o USDZ fica pronto ANTES do toque.

   O PROBLEMA. No iPhone a RA só abre com USDZ. Sem `ios-src`, o model-viewer
   converte o GLB em USDZ no momento do toque (`await prepareUSDZ()`) e só
   depois clica no link `rel="ar"`. Com modelo grande a conversão demora, o
   Safari deixa de considerar aquilo um gesto do usuário e trata o link pelo
   que ele declara: um download de "model.usdz". A RA não abre.

   A CORREÇÃO. Este arquivo:
     1. a cada `load` de um <model-viewer> com `ar`, gera o USDZ na hora,
        sem esperar o toque. Segura o evento `load` até o arquivo ficar pronto
        e só então o repassa à página. Assim o botão "Abrir em RA" de cada
        página só se habilita com o USDZ em mãos;
     2. troca `activateAR()` daquele visualizador: com o USDZ pronto, o clique
        no link `rel="ar"` acontece no mesmo instante do toque, sem nenhum
        await no caminho;
     3. dentro de iframe (Célula viva), abre o Quick Look pelo documento de
        cima, porque o Safari não abre a RA de forma confiável de dentro de um
        quadro. Vale também para os links próprios das páginas (placas).

   Só age no iPhone/iPad. Android e computador seguem exatamente como antes.
   Para testar fora do iPhone: acrescente ?raios ao endereço.

   COMO INCLUIR. Script clássico (sem type="module"), imediatamente antes de
   </body>. Ele precisa rodar antes dos módulos da página, para ser o primeiro
   a ouvir o `load` do visualizador. */
(function () {
  'use strict';

  const IOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  let forcar = false;
  try { forcar = new URLSearchParams(location.search).has('raios'); } catch (e) { /* sem query */ }
  if (!IOS && !forcar) return;

  const MARCA = '__raIos';
  const TEXTURA_MAX = '2048';            // limita a memória do USDZ no aparelho

  /* ── Links rel="ar": mesmo formato do model-viewer, e saída pelo topo ──── */
  let topo = null;
  try { if (window.top !== window && window.top.document) topo = window.top; } catch (e) { topo = null; }

  const clicar = HTMLAnchorElement.prototype.click;
  HTMLAnchorElement.prototype.click = function () {
    const ehRA = this.relList && this.relList.contains('ar') && this.href;
    if (!ehRA) return clicar.call(this);
    /* USDZ em blob precisa do nome com extensão, como faz o model-viewer */
    if (this.href.startsWith('blob:') && !this.hasAttribute('download')) this.setAttribute('download', 'model.usdz');
    if (topo) {
      try {
        const doc = topo.document;
        const a = doc.createElement('a');
        a.rel = 'ar';
        a.href = this.href;
        if (this.hasAttribute('download')) a.setAttribute('download', this.getAttribute('download'));
        a.style.display = 'none';
        a.appendChild(doc.createElement('img'));
        doc.body.appendChild(a);
        clicar.call(a);
        setTimeout(() => a.remove(), 4000);
        return;
      } catch (e) { /* topo inacessível: abre daqui mesmo */ }
    }
    return clicar.call(this);
  };

  function abrirQuickLook(url, mv) {
    const a = document.createElement('a');
    a.rel = 'ar';
    a.setAttribute('download', 'model.usdz');
    a.href = mv.getAttribute('ar-scale') === 'fixed' ? url + '#allowsContentScaling=0' : url;
    a.style.display = 'none';
    a.appendChild(document.createElement('img'));
    document.body.appendChild(a);
    a.click();
    setTimeout(() => a.remove(), 4000);
  }

  /* ── USDZ preparado a cada carregamento ─────────────────────────────────── */
  function vigiar(mv) {
    if (mv[MARCA] || !mv.hasAttribute('ar')) return;
    const st = mv[MARCA] = { url: null, src: null, token: 0, trocado: false };
    if (!mv.hasAttribute('ar-usdz-max-texture-size')) mv.setAttribute('ar-usdz-max-texture-size', TEXTURA_MAX);

    mv.addEventListener('load', (ev) => {
      if (ev.detail && ev.detail[MARCA]) return;           // é o nosso repasse
      ev.stopImmediatePropagation();                       // a página espera o USDZ
      trocarActivateAR(mv, st);
      const token = ++st.token;
      if (st.url) { URL.revokeObjectURL(st.url); st.url = null; }
      st.src = mv.src;
      const repassar = () => {
        if (token !== st.token) return;
        const detalhe = Object.assign({}, ev.detail || {}, { [MARCA]: true });
        mv.dispatchEvent(new CustomEvent('load', { detail: detalhe }));
      };
      let gerado;
      try { gerado = Promise.resolve(mv.prepareUSDZ()); } catch (e) { gerado = Promise.reject(e); }
      gerado.then((url) => {
        if (token !== st.token) { if (url) URL.revokeObjectURL(url); return; }
        st.url = url || null;
      }).catch((err) => {
        console.warn('[ra-ios] USDZ não preparado; o toque usará a conversão do model-viewer.', err);
      }).finally(repassar);
    }, true);
  }

  function trocarActivateAR(mv, st) {
    if (st.trocado || typeof mv.activateAR !== 'function') return;
    const original = mv.activateAR.bind(mv);
    mv.activateAR = function () {
      if (st.url && st.src === mv.src) {
        abrirQuickLook(st.url, mv);                         // nenhum await antes do clique
        return Promise.resolve();
      }
      return original();
    };
    st.trocado = true;
  }

  document.querySelectorAll('model-viewer').forEach(vigiar);
  new MutationObserver((mudancas) => {
    for (const m of mudancas) for (const n of m.addedNodes) {
      if (n.nodeType !== 1) continue;
      if (n.localName === 'model-viewer') vigiar(n);
      else if (n.querySelectorAll) n.querySelectorAll('model-viewer').forEach(vigiar);
    }
  }).observe(document.documentElement, { childList: true, subtree: true });
})();
