/* MOSAICO · A Mesa — mesma abertura do Solo: vídeo vertical + voz.
   O HTML grande ainda cita img/abertura*.mp4; este script troca na hora. */
(function () {
  const AQUI = new URL('.', document.currentScript.src);
  const VIDEO = new URL('../ACasa-Video-Vertical-Abertura.mp4', AQUI).href;
  const AUDIO = new URL('../audio/A-Casa-da-Costa-Abertura.mp3', AQUI).href;
  const antigo = /abertura(?:-vertical)?\.mp4/i;

  const css = document.createElement('style');
  css.textContent = '@media (max-aspect-ratio:1/1){#video-abertura{display:block!important}}';
  document.head.appendChild(css);

  function apontar(v) {
    if (!v) return;
    try {
      if (!v.src || antigo.test(v.src) || v.src.indexOf('ACasa-Video-Vertical-Abertura') < 0) {
        v.src = VIDEO;
      }
    } catch (e) {}
  }

  function armarParticipante(video) {
    if (!video || video._casaArmado) return;
    video._casaArmado = true;
    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute('muted', '');
    const narra = new Audio(AUDIO);
    narra.preload = 'auto';
    narra.playsInline = true;
    video._narraCasa = narra;
    const prevEnded = video.onended;
    video.onended = function () { try { video.pause(); } catch (e) {} };
    narra.onended = function () {
      if (typeof prevEnded === 'function') prevEnded.call(video);
    };
    const origPlay = video.play.bind(video);
    video.play = function () {
      try {
        video.muted = true;
        if (narra.paused) {
          narra.currentTime = video.currentTime || 0;
          const p = narra.play();
          if (p && p.catch) p.catch(function () {});
        }
      } catch (e) {}
      return origPlay();
    };
    video.addEventListener('pause', function () {
      try { if (!narra.paused) narra.pause(); } catch (e) {}
    });
  }

  function aplicar() {
    apontar(document.getElementById('video-abertura'));
    const part = document.getElementById('video-abertura-participante');
    apontar(part);
    armarParticipante(part);
  }

  const desc = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'src');
  if (desc && desc.set) {
    Object.defineProperty(HTMLMediaElement.prototype, 'src', {
      configurable: true,
      enumerable: desc.enumerable,
      get: function () { return desc.get.call(this); },
      set: function (v) {
        if (this.id && this.id.indexOf('video-abertura') === 0 && antigo.test(String(v || ''))) {
          v = VIDEO;
        }
        return desc.set.call(this, v);
      }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', aplicar);
  else aplicar();
  setInterval(aplicar, 400);
})();
