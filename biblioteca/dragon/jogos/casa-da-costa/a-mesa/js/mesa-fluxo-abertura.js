/* MOSAICO · A Mesa — um passo de cada vez.
   1) Abrir → vídeo de apresentação
   2) Abrir mesa + nome
   3) Ativar som + AV2 (ACasa + narração)
   4) Só então personagens / resto do jogo */
(function () {
  const AQUI = new URL('.', document.currentScript.src);
  const V1 = vertical => new URL(vertical ? '../img/abertura-vertical.mp4' : '../img/abertura.mp4', AQUI).href;
  const ABERTURA_JS = new URL('../../../../abertura-casa.js?v=20260917-fluxo-mesa', AQUI).href;

  const css = document.createElement('style');
  css.textContent =
    '#portao,#ctrl-abertura,#abertura-participante,' +
    '.orientacao-mestre-fundo,.orientacao-participante-fundo' +
    '{display:none!important}' +
    'body.portao #app{opacity:1;pointer-events:auto}';
  document.head.appendChild(css);

  function ehRetrato() {
    try { return matchMedia('(orientation: portrait)').matches; }
    catch (e) { return innerHeight > innerWidth; }
  }

  function overlayVideo(src, { muted, onFim }) {
    const box = document.createElement('div');
    box.style.cssText = 'position:fixed;inset:0;z-index:100080;background:#04070b';
    const v = document.createElement('video');
    v.playsInline = true;
    v.setAttribute('playsinline', '');
    v.setAttribute('webkit-playsinline', '');
    v.muted = !!muted;
    v.src = src;
    v.style.cssText = 'width:100%;height:100%;object-fit:cover;background:#04070b';
    const skip = document.createElement('button');
    skip.type = 'button';
    skip.textContent = 'Pular';
    skip.style.cssText = 'position:absolute;right:16px;bottom:max(18px,env(safe-area-inset-bottom));min-height:48px;padding:10px 16px;border:1px solid #54758a;border-radius:12px;background:#0c2230;color:#efc878;font-weight:800;cursor:pointer';
    let fechou = false;
    const fechar = () => {
      if (fechou) return;
      fechou = true;
      try { v.pause(); } catch (e) {}
      box.remove();
      if (onFim) onFim();
    };
    v.onended = fechar;
    v.onerror = fechar;
    skip.onclick = fechar;
    box.appendChild(v);
    box.appendChild(skip);
    document.body.appendChild(box);
    const p = v.play();
    if (p && p.catch) p.catch(function () {});
  }

  document.addEventListener('click', function (ev) {
    const btn = ev.target && ev.target.closest && ev.target.closest('#drOpen');
    if (!btn || window.__mesaApresentacaoFeita) return;
    ev.preventDefault();
    ev.stopImmediatePropagation();
    window.__mesaApresentacaoFeita = true;
    overlayVideo(V1(ehRetrato()), {
      muted: false,
      onFim: function () { try { btn.click(); } catch (e) {} }
    });
  }, true);

  function carregarAberturaCasa(cb) {
    if (window.MosaicoAberturaCasa) { cb(); return; }
    const s = document.createElement('script');
    s.src = ABERTURA_JS;
    s.onload = cb;
    s.onerror = cb;
    document.head.appendChild(s);
  }

  function tocarAV2(depois) {
    if (window.__mesaAv2Feita) { depois(); return; }
    carregarAberturaCasa(function () {
      if (window.MosaicoAberturaCasa && window.MosaicoAberturaCasa.mostrar) {
        window.MosaicoAberturaCasa.mostrar(function () {
          window.__mesaAv2Feita = true;
          depois();
        });
      } else {
        window.__mesaAv2Feita = true;
        depois();
      }
    });
  }

  function esconderJogo() {
    const app = document.getElementById('app');
    if (app) app.hidden = true;
    document.body.classList.remove('portao');
    const portao = document.getElementById('portao');
    if (portao) portao.style.display = 'none';
  }

  function mostrarJogo() {
    const app = document.getElementById('app');
    if (app) app.hidden = false;
    if (window.STATE) {
      window.STATE.orientacaoMestreAberta = false;
      window.STATE.orientacaoParticipanteAberta = false;
    }
    if (typeof window.render === 'function') window.render(true);
  }

  function vigiarApp() {
    const app = document.getElementById('app');
    if (!app || app._fluxoVigiado) return;
    app._fluxoVigiado = true;
    const obs = new MutationObserver(function () {
      if (app.hidden || window.__mesaAv2Feita || window.__mesaAv2Rodando) return;
      window.__mesaAv2Rodando = true;
      esconderJogo();
      tocarAV2(function () {
        window.__mesaAv2Rodando = false;
        mostrarJogo();
      });
    });
    obs.observe(app, { attributes: true, attributeFilter: ['hidden'] });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', vigiarApp);
  } else {
    vigiarApp();
  }
  setInterval(vigiarApp, 500);
})();
