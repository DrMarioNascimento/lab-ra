/* As travas dos andares (10/10/2026): o teclado de senha e o segredo de cofre.
   Nada aqui sabe a resposta: quem abre passa uma função que confere (o motor
   do jogo é que sabe o número de cada partida).

   · VCTrava.teclado({rot, txt, digitos, conferir(s) → bool, aoAbrir})
   · VCTrava.segredo({rot, txt, conferir([a,b,c]) → bool, aoAbrir})
     Disco de 0 a 39. Gire para a direita até o 1º número, para a esquerda até o
     2º, para a direita até o 3º e puxe a alavanca. Cada troca de sentido marca
     o número em que o disco parou, como num cofre de verdade. */
(function (global) {
  'use strict';
  var el = null, som = null;
  function audio() { if (som) return som; try { som = new (global.AudioContext || global.webkitAudioContext)(); } catch (e) { som = null; } return som; }
  function bip(f, d, tipo, vol) { var a = audio(); if (!a) return; try { var o = a.createOscillator(), g = a.createGain(); o.type = tipo || 'square'; o.frequency.value = f; g.gain.value = vol || 0.05; o.connect(g); g.connect(a.destination); o.start(); g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + (d || 0.08)); o.stop(a.currentTime + (d || 0.08) + 0.02); } catch (e) {} }
  function estilo() {
    if (document.getElementById('vcTravaCss')) return;
    var c = document.createElement('style'); c.id = 'vcTravaCss';
    c.textContent = '.vct{position:fixed;inset:0;z-index:95;display:flex;align-items:center;justify-content:center;padding:16px;background:#020609d9;backdrop-filter:blur(3px)}.vct[hidden]{display:none}' +
      '.vct-caixa{width:min(360px,100%);padding:18px 16px 16px;border-radius:18px;border:1px solid #3d5a68;border-bottom:4px solid #020609;background:linear-gradient(165deg,#1a2a33,#0b161d 60%,#070f14);box-shadow:inset 0 2px 0 #ffffff14,inset 0 -6px 14px #0009,0 18px 40px #000c;text-align:center}' +
      '.vct-caixa small{display:block;font:700 10.5px var(--termfont,monospace);letter-spacing:.14em;color:#f0bf8f}.vct-caixa p{margin:6px 0 12px;font:500 14px/1.45 var(--sans,system-ui);color:#dbe9ee}' +
      '.vct-visor{margin:0 auto 12px;width:86%;min-height:52px;display:flex;align-items:center;justify-content:center;gap:10px;border-radius:10px;border:1px solid #0a1a10;background:linear-gradient(180deg,#06140c,#0a2214);box-shadow:inset 0 3px 8px #000c,0 1px 0 #ffffff12;font:700 28px var(--termfont,monospace);letter-spacing:.3em;color:#7dffb0;text-shadow:0 0 8px #3dff8a88}' +
      '.vct-visor.erro{color:#ff7b6e;text-shadow:0 0 8px #ff5a4a99;animation:vctTreme .35s}.vct-visor.ok{color:#ffe08a;text-shadow:0 0 10px #ffd06099}@keyframes vctTreme{20%,60%{transform:translateX(-6px)}40%,80%{transform:translateX(6px)}}' +
      '.vct-teclas{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;padding:4px 8px}' +
      '.vct-teclas button,.vct-acoes button{min-height:54px;border-radius:12px;border:1px solid #54707e;border-bottom:4px solid #020609;background:linear-gradient(180deg,#2a3f4a,#16252e);color:#eef6f8;font:700 20px var(--termfont,monospace);cursor:pointer;box-shadow:inset 0 2px 0 #ffffff22,inset 0 -4px 8px #0008,0 4px 0 #020609,0 8px 14px #0008;touch-action:manipulation}' +
      '.vct-teclas button:active,.vct-acoes button:active{transform:translateY(3px);box-shadow:inset 0 2px 0 #ffffff14,0 1px 0 #020609}' +
      '.vct-teclas .ok,.vct-acoes .ok{background:linear-gradient(180deg,#f3d078,#e0b13a);color:#1a1206;border-color:#d6aa58;border-bottom-color:#5a4310;box-shadow:inset 0 2px 0 #fff6,0 4px 0 #5a4310,0 8px 14px #0008}' +
      '.vct-acoes{display:flex;gap:10px;margin-top:12px}.vct-acoes button{flex:1;font-size:13px}' +
      '.vct-disco{position:relative;width:250px;height:250px;margin:0 auto;touch-action:none;cursor:grab}.vct-disco svg{width:100%;height:100%;display:block}' +
      '.vct-marcas{display:flex;justify-content:center;gap:8px;margin:10px 0 0;font:700 15px var(--termfont,monospace);color:#a6eef5}.vct-marcas span{min-width:54px;padding:6px 8px;border-radius:8px;background:#06121a;border:1px solid #2b6470;box-shadow:inset 0 2px 5px #000a}.vct-marcas span.on{color:#ffe08a;border-color:#d6aa58}';
    document.head.appendChild(c);
  }
  function caixa(html) {
    estilo(); if (!el) { el = document.createElement('div'); el.className = 'vct'; document.body.appendChild(el); }
    el.innerHTML = '<div class="vct-caixa">' + html + '</div>'; el.hidden = false; return el;
  }
  function fechar() { if (el) el.hidden = true; }

  function teclado(o) {
    var n = o.digitos || 4, val = '';
    var t = caixa('<small>' + (o.rot || 'TECLADO') + '</small><p>' + (o.txt || '') + '</p><div class="vct-visor" id="vctVisor">' + '–'.repeat(n) + '</div>' +
      '<div class="vct-teclas">' + [1, 2, 3, 4, 5, 6, 7, 8, 9, 'C', 0, 'OK'].map(function (k) { return '<button type="button" data-k="' + k + '"' + (k === 'OK' ? ' class="ok"' : '') + '>' + (k === 'C' ? '⌫' : k) + '</button>'; }).join('') + '</div>' +
      '<div class="vct-acoes"><button type="button" id="vctSair">Deixar para depois</button></div>');
    var visor = t.querySelector('#vctVisor');
    function pinta() { visor.textContent = (val + '–'.repeat(n)).slice(0, n); visor.className = 'vct-visor'; }
    t.querySelectorAll('[data-k]').forEach(function (b) {
      b.onclick = function () {
        var k = b.dataset.k;
        if (k === 'C') { val = val.slice(0, -1); bip(330, 0.05); pinta(); return; }
        if (k === 'OK') {
          if (o.conferir(val)) { visor.className = 'vct-visor ok'; visor.textContent = 'ABERTO'; bip(880, 0.12, 'sine', 0.08); setTimeout(function () { bip(1320, 0.18, 'sine', 0.08); }, 120); setTimeout(function () { fechar(); if (o.aoAbrir) o.aoAbrir(); }, 650); }
          else { visor.className = 'vct-visor erro'; visor.textContent = 'NEGADO'; bip(140, 0.3, 'sawtooth', 0.06); setTimeout(function () { val = ''; pinta(); }, 900); }
          return;
        }
        if (val.length < n) { val += k; bip(620 + (+k) * 30, 0.05); pinta(); }
      };
    });
    t.querySelector('#vctSair').onclick = function () { fechar(); if (o.aoFechar) o.aoFechar(); };
    return { _digitar: function (s) { val = String(s); t.querySelector('[data-k="OK"]').click(); } };
  }

  function segredo(o) {
    var N = 40, ang = 0, marcados = [], sentido = 0, ultimo = 0, girando = false, a0 = 0;
    var ticks = ''; for (var i = 0; i < N; i++) { var r1 = i % 5 === 0 ? 92 : 100, a = i / N * Math.PI * 2; ticks += '<line x1="' + (125 + Math.sin(a) * r1) + '" y1="' + (125 - Math.cos(a) * r1) + '" x2="' + (125 + Math.sin(a) * 108) + '" y2="' + (125 - Math.cos(a) * 108) + '" stroke="#e8d6a8" stroke-width="' + (i % 5 === 0 ? 2.4 : 1.2) + '"/>' + (i % 5 === 0 ? '<text x="' + (125 + Math.sin(a) * 78) + '" y="' + (129 - Math.cos(a) * 78) + '" text-anchor="middle" style="font:700 12px monospace;fill:#f3e3b8">' + i + '</text>' : ''); }
    var t = caixa('<small>' + (o.rot || 'SEGREDO') + '</small><p>' + (o.txt || '') + '</p>' +
      '<div class="vct-disco" id="vctDisco"><svg viewBox="0 0 250 250"><defs><radialGradient id="vctG" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#4a3a24"/><stop offset=".7" stop-color="#22190f"/><stop offset="1" stop-color="#0d0905"/></radialGradient><filter id="vctS"><feDropShadow dx="0" dy="6" stdDeviation="5" flood-color="#000" flood-opacity=".8"/></filter></defs>' +
      '<circle cx="125" cy="125" r="122" fill="#0c1218" stroke="#3d5a68" stroke-width="2"/><polygon points="125,4 117,20 133,20" fill="#ff7b6e"/>' +
      '<g id="vctRoda" filter="url(#vctS)"><circle cx="125" cy="125" r="112" fill="url(#vctG)" stroke="#b08a4a" stroke-width="3"/>' + ticks + '<circle cx="125" cy="125" r="34" fill="#2a1f12" stroke="#b08a4a" stroke-width="2"/><rect x="119" y="96" width="12" height="58" rx="5" fill="#c9a061"/></g></svg></div>' +
      '<div class="vct-marcas"><span id="vctM0">–</span><span id="vctM1">–</span><span id="vctM2">–</span></div>' +
      '<div class="vct-visor" id="vctVisor" style="margin-top:10px;font-size:22px">00</div>' +
      '<div class="vct-acoes"><button type="button" id="vctZerar">Recomeçar</button><button type="button" class="ok" id="vctPuxar">Puxar a alavanca</button></div><div class="vct-acoes"><button type="button" id="vctSair">Deixar para depois</button></div>');
    var roda = t.querySelector('#vctRoda'), disco = t.querySelector('#vctDisco'), visor = t.querySelector('#vctVisor');
    function num() { return ((Math.round(-ang / (360 / N)) % N) + N) % N; }
    function pinta() { roda.setAttribute('transform', 'rotate(' + ang + ' 125 125)'); visor.textContent = ('0' + num()).slice(-2); for (var k = 0; k < 3; k++) { var s = t.querySelector('#vctM' + k); s.textContent = marcados[k] != null ? marcados[k] : '–'; s.className = marcados[k] != null ? 'on' : ''; } }
    function anguloDe(e) { var r = disco.getBoundingClientRect(); return Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) * 180 / Math.PI; }
    disco.addEventListener('pointerdown', function (e) { girando = true; a0 = anguloDe(e); try { disco.setPointerCapture(e.pointerId); } catch (x) {} });
    disco.addEventListener('pointermove', function (e) {
      if (!girando) return; var a = anguloDe(e), d = a - a0; if (d > 180) d -= 360; if (d < -180) d += 360; a0 = a; if (!d) return;
      var s = d > 0 ? 1 : -1;
      if (sentido && s !== sentido && marcados.length < 3) { marcados.push(num()); bip(240, 0.06, 'triangle', 0.08); }
      sentido = s; var antes = num(); ang += d; if (num() !== antes) bip(1800, 0.012, 'square', 0.025); pinta();
    });
    disco.addEventListener('pointerup', function () { girando = false; });
    t.querySelector('#vctZerar').onclick = function () { marcados = []; sentido = 0; pinta(); };
    function puxar() {
      var seq = marcados.slice(0, 2).concat([num()]);
      if (marcados.length >= 2 && o.conferir(seq)) { visor.className = 'vct-visor ok'; visor.textContent = 'ABERTO'; bip(220, 0.25, 'sine', 0.1); setTimeout(function () { bip(440, 0.2, 'sine', 0.08); }, 160); setTimeout(function () { fechar(); if (o.aoAbrir) o.aoAbrir(); }, 700); }
      else { visor.className = 'vct-visor erro'; visor.textContent = 'TRAVADO'; bip(120, 0.3, 'sawtooth', 0.06); setTimeout(function () { visor.className = 'vct-visor'; marcados = []; sentido = 0; pinta(); }, 900); }
    }
    t.querySelector('#vctPuxar').onclick = puxar;
    t.querySelector('#vctSair').onclick = function () { fechar(); if (o.aoFechar) o.aoFechar(); };
    pinta();
    /* gancho de teste: marca os três números como se a mão tivesse girado */
    return { _girar: function (seq) { marcados = seq.slice(0, 2); ang = -seq[2] * (360 / N); pinta(); puxar(); } };
  }
  global.VCTrava = { teclado: teclado, segredo: segredo, fechar: fechar, aberta: function () { return !!(el && !el.hidden); }, bip: bip };
})(window);
