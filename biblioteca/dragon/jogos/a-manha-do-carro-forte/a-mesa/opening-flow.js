/* MOSAICO · A MESA · abertura audiovisual
   Caminhos saem DESTE arquivo (não do documento): celular.html e qualquer
   hospedeiro irmão resolvem noite/Abertura*.jpg e o mp3 no mesmo lugar.
   z-index 100060 fica acima do seletor de papel (100050) e do gate (99999). */
(function () {
  const AQUI = document.currentScript?.src
    ? new URL('.', document.currentScript.src)
    : new URL('./', location.href);
  const asset = (p) => new URL(p, AQUI).href;
  const TELAO = (() => { try { return matchMedia('(min-width:900px)').matches; } catch (e) { return false; } })();
  const IMG = asset(TELAO ? '../../../jogos/a-manha-do-carro-forte/a-noite/AberturaTelão.jpg' : '../../../jogos/a-manha-do-carro-forte/a-noite/AberturaCelular.jpg');
  const AUDIO = asset('../../../jogos/a-manha-do-carro-forte/a-noite/Amanha-do-carroforte.mp3');
  let shown = false, started = false, finished = false;
  const css = document.createElement('style');
  css.textContent =
    '#mosaicoPrep,#mosaicoOpening{position:fixed;inset:0;z-index:100060;background:#02070bf2;color:#eef5f2;font-family:Inter,system-ui,sans-serif;display:none;overflow:auto}' +
    '#mosaicoPrep.on,#mosaicoOpening.on{display:flex}' +
    '.mp-card{width:min(560px,calc(100% - 28px));margin:auto;padding:18px;border:1px solid rgba(159,228,255,.52);border-radius:14px;background:linear-gradient(165deg,#1a3348,#153044 60%,#102838);box-shadow:inset 0 1px 0 rgba(255,255,255,.10),0 18px 50px rgba(0,0,0,.55)}' +
    '.mp-card h2{font:600 30px Georgia,serif;margin:0 0 8px;color:#efc878}' +
    '.mp-card p{color:#dfeaf5;line-height:1.45}' +
    '.mp-start{width:100%;min-height:54px;margin-top:12px;padding:12px 14px;border-radius:10px;border:0;background:linear-gradient(180deg,#ffc878,#d6aa58);color:#1b1005;text-align:center;font-weight:800;cursor:pointer;box-shadow:inset 0 1px #ffe2b4,0 5px 0 #6a3712}' +
    '.mp-skip{width:100%;min-height:48px;margin-top:10px;padding:12px 14px;border-radius:10px;border:1px solid #46667a;background:linear-gradient(180deg,#162a38,#0c1b26);color:#f4f9fd;font-weight:800;cursor:pointer}' +
    '.mp-note{margin-top:12px;padding:10px;border-left:3px solid #70d6a0;background:#0b1c16;color:#b8d7c7}' +
    '.opening-stage{position:relative;width:100%;height:100%;overflow:hidden;background:#020609;display:grid;place-items:center}' +
    '.opening-stage img{width:100%;height:100%;object-fit:contain}' +
    '.opening-controls{position:absolute;left:50%;bottom:max(18px,env(safe-area-inset-bottom));transform:translateX(-50%);display:flex;align-items:center;justify-content:center;gap:9px;padding:9px 11px;border:1px solid #38566b;border-radius:20px;background:linear-gradient(180deg,#10212cef,#07131bef);box-shadow:0 14px 30px #0009}' +
    '.opening-controls button{width:50px;height:50px;padding:0;border:1px solid #54758a;border-radius:15px;background:linear-gradient(145deg,#17364a,#0c2230);color:#efc878;font-size:23px;font-weight:900;display:grid;place-items:center;cursor:pointer}' +
    '.opening-controls button[title="Pular abertura"]{color:#8ce4b0}';
  document.head.appendChild(css);
  const prep = document.createElement('div');
  prep.id = 'mosaicoPrep';
  prep.innerHTML = '<div class="mp-card pf-card"><div class="pf-inset" style="padding:10px 8px 6px"><h2>A manhã vai falar</h2><div id="mpState"></div></div></div>';
  document.body.appendChild(prep);
  const box = prep.querySelector('#mpState');
  const opening = document.createElement('div');
  opening.id = 'mosaicoOpening';
  opening.innerHTML =
    `<div class="opening-stage"><img src="${IMG}" alt="Abertura de A Manhã do Carro-Forte">` +
    `<audio id="mpAudio" preload="auto" playsinline src="${AUDIO}"></audio>` +
    `<div class="opening-controls"><button id="mpPlay" title="Pausar" aria-label="Pausar">Ⅱ</button>` +
    `<button id="mpRestart" title="Reiniciar" aria-label="Reiniciar">↻</button>` +
    `<button id="mpSkip" title="Pular abertura" aria-label="Pular abertura">»</button></div></div>`;
  document.body.appendChild(opening);
  const audio = opening.querySelector('#mpAudio');
  function renderPrep() {
    box.innerHTML =
      '<p>Ative o som antes de começar. São pouco mais de um minuto, e é aqui que o caso é entregue.</p>' +
      `<div class="mp-note">${TELAO ? 'Imagem e áudio nesta tela.' : 'Imagem e áudio neste aparelho.'}</div>` +
      '<button class="mp-start pf-btn-gold" id="mpStart" type="button">🔊 Ativar som e começar</button>' +
      '<button class="mp-skip pf-btn-ghost" id="mpPular" type="button">Pular a abertura</button>';
    document.getElementById('mpStart').onclick = comecar;
    document.getElementById('mpPular').onclick = finish;
  }
  async function comecar() {
    if (started || finished) return;
    started = true;
    audio.muted = false;
    audio.volume = 1;
    audio.currentTime = 0;
    try {
      await audio.play();
      prep.remove();
      opening.classList.add('on');
    } catch (e) {
      console.error('MOSAICO: áudio da abertura bloqueado.', e);
      started = false;
      prep.classList.add('on');
      renderPrep();
    }
  }
  function finish() {
    if (finished) return;
    finished = true;
    started = false;
    try { audio.pause(); } catch (e) {}
    opening.classList.remove('on');
    prep.classList.remove('on');
    window.dispatchEvent(new CustomEvent('mosaico-opening-finished'));
  }
  const mpPlay = document.getElementById('mpPlay');
  mpPlay.onclick = async () => {
    if (finished) return;
    if (audio.paused) {
      try { await audio.play(); mpPlay.textContent = 'Ⅱ'; mpPlay.title = 'Pausar'; mpPlay.setAttribute('aria-label', 'Pausar'); } catch (e) {}
    } else {
      audio.pause();
      mpPlay.textContent = '▶';
      mpPlay.title = 'Continuar';
      mpPlay.setAttribute('aria-label', 'Continuar');
    }
  };
  document.getElementById('mpRestart').onclick = async () => {
    if (finished) return;
    audio.currentTime = 0;
    try { await audio.play(); mpPlay.textContent = 'Ⅱ'; mpPlay.title = 'Pausar'; mpPlay.setAttribute('aria-label', 'Pausar'); } catch (e) {}
  };
  document.getElementById('mpSkip').onclick = finish;
  audio.onended = () => setTimeout(() => { if (audio.ended) finish(); }, 900);
  function show() {
    if (shown || finished) return;
    shown = true;
    renderPrep();
    prep.classList.add('on');
  }
  window.MosaicoOpening = { show, finish, telao: TELAO };
})();
