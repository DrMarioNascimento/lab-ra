/**
 * ============================================================
 * MOSAICO 3D ENGINE — MOTOR ESPACIAL E SENSORIAL PARA CELULAR
 * A Casa da Costa — Dragon Games
 * ============================================================
 */
(function (global) {
  "use strict";

  var Mosaico3D = {
    ativo: true,
    tilt: { x: 0, y: 0, targetX: 0, targetY: 0 },
    orientacaoAtiva: false,
    audioContext: null,
    canvas: null,
    ctx: null,
    animFrame: null,
    gotas: [],
    trovaoTimeout: null
  };

  /* ------------------------------------------------------------
     1. SISTEMA HÁPTICO (VIBRAÇÃO MOBILE)
     ------------------------------------------------------------ */
  Mosaico3D.vibrar = function (padrao) {
    try {
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate(padrao);
      }
    } catch (e) {}
  };

  Mosaico3D.haptics = {
    toque: function () { Mosaico3D.vibrar(12); },
    encaixe: function () { Mosaico3D.vibrar([25, 20, 40]); },
    moeda: function () { Mosaico3D.vibrar([15, 30]); },
    lacre: function () { Mosaico3D.vibrar([35, 15, 25]); },
    trovao: function () { Mosaico3D.vibrar([40, 60, 100, 50, 120]); },
    alerta: function () { Mosaico3D.vibrar([50, 40, 50]); }
  };

  /* ------------------------------------------------------------
     2. SINTETIZADOR DE ÁUDIO NATIVO (WEB AUDIO API)
     ------------------------------------------------------------ */
  function obterAudioContext() {
    if (!Mosaico3D.audioContext && (global.AudioContext || global.webkitAudioContext)) {
      var AudioCtx = global.AudioContext || global.webkitAudioContext;
      Mosaico3D.audioContext = new AudioCtx();
    }
    if (Mosaico3D.audioContext && Mosaico3D.audioContext.state === "suspended") {
      Mosaico3D.audioContext.resume().catch(function () {});
    }
    return Mosaico3D.audioContext;
  }

  Mosaico3D.som = {
    trovao: function () {
      var actx = obterAudioContext();
      if (!actx) return;
      try {
        var t0 = actx.currentTime;
        var dur = 2.4;
        var bufferSize = actx.sampleRate * dur;
        var buffer = actx.createBuffer(1, bufferSize, actx.sampleRate);
        var data = buffer.getChannelData(0);
        var lastOut = 0.0;
        for (var i = 0; i < bufferSize; i++) {
          var white = Math.random() * 2 - 1;
          data[i] = (lastOut + (0.025 * white)) / 1.025;
          lastOut = data[i];
          data[i] *= 3.5;
        }
        var noise = actx.createBufferSource();
        noise.buffer = buffer;

        var filter = actx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(140, t0);
        filter.frequency.exponentialRampToValueAtTime(45, t0 + dur);

        var gain = actx.createGain();
        gain.gain.setValueAtTime(0.01, t0);
        gain.gain.linearRampToValueAtTime(0.42, t0 + 0.15);
        gain.gain.exponentialRampToValueAtTime(0.001, t0 + dur);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(actx.destination);

        noise.start(t0);
        noise.stop(t0 + dur);
        Mosaico3D.haptics.trovao();
      } catch (e) {}
    },

    encaixe: function () {
      var actx = obterAudioContext();
      if (!actx) return;
      try {
        var t0 = actx.currentTime;
        var osc = actx.createOscillator();
        var gain = actx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(320, t0);
        osc.frequency.exponentialRampToValueAtTime(75, t0 + 0.12);

        gain.gain.setValueAtTime(0.35, t0);
        gain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.14);

        osc.connect(gain);
        gain.connect(actx.destination);
        osc.start(t0);
        osc.stop(t0 + 0.14);
        Mosaico3D.haptics.encaixe();
      } catch (e) {}
    },

    moeda: function () {
      var actx = obterAudioContext();
      if (!actx) return;
      try {
        var t0 = actx.currentTime;
        [1850, 2400].forEach(function (freq) {
          var osc = actx.createOscillator();
          var gain = actx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, t0);
          osc.frequency.exponentialRampToValueAtTime(freq * 0.96, t0 + 0.28);
          gain.gain.setValueAtTime(0.2, t0);
          gain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.28);
          osc.connect(gain);
          gain.connect(actx.destination);
          osc.start(t0);
          osc.stop(t0 + 0.28);
        });
        Mosaico3D.haptics.moeda();
      } catch (e) {}
    },

    lacre: function () {
      var actx = obterAudioContext();
      if (!actx) return;
      try {
        var t0 = actx.currentTime;
        var osc = actx.createOscillator();
        var gain = actx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(480, t0);
        osc.frequency.exponentialRampToValueAtTime(120, t0 + 0.18);
        gain.gain.setValueAtTime(0.25, t0);
        gain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.18);
        osc.connect(gain);
        gain.connect(actx.destination);
        osc.start(t0);
        osc.stop(t0 + 0.18);
        Mosaico3D.haptics.lacre();
      } catch (e) {}
    }
  };

  /* ------------------------------------------------------------
     3. MOTOR DE GIROSCÓPIO / DEVICE ORIENTATION PARALLAX
     ------------------------------------------------------------ */
  Mosaico3D.iniciarGiroscopio = function () {
    if (Mosaico3D.orientacaoAtiva) return;

    function aoMoverOrientacao(ev) {
      var gamma = ev.gamma || 0; // Inclinação Esquerda/Direita (-90 a 90)
      var beta = ev.beta || 0;   // Inclinação Frente/Trás (-180 a 180)

      // Clamping ergonômico para uso natural do celular em pé (aprox 45 deg)
      var normX = Math.max(-1, Math.min(1, gamma / 35));
      var normY = Math.max(-1, Math.min(1, (beta - 45) / 35));

      Mosaico3D.tilt.targetX = normX;
      Mosaico3D.tilt.targetY = normY;
    }

    if (global.DeviceOrientationEvent) {
      if (typeof DeviceOrientationEvent.requestPermission === "function") {
        // iOS 13+ precisa de permissão vinculada a gesto
        Mosaico3D.pedirPermissaoIOS = function () {
          DeviceOrientationEvent.requestPermission()
            .then(function (perm) {
              if (perm === "granted") {
                global.addEventListener("deviceorientation", aoMoverOrientacao, true);
                Mosaico3D.orientacaoAtiva = true;
              }
            })
            .catch(function () {});
        };
      } else {
        global.addEventListener("deviceorientation", aoMoverOrientacao, true);
        Mosaico3D.orientacaoAtiva = true;
      }
    }

    // Fallback: Pointer/Touch Parallax quando o usuário toca ou move o dedo
    global.addEventListener("pointermove", function (ev) {
      if (!Mosaico3D.orientacaoAtiva || Math.abs(Mosaico3D.tilt.targetX) < 0.01) {
        var nx = (ev.clientX / (global.innerWidth || 360)) * 2 - 1;
        var ny = (ev.clientY / (global.innerHeight || 640)) * 2 - 1;
        Mosaico3D.tilt.targetX = Math.max(-1, Math.min(1, nx));
        Mosaico3D.tilt.targetY = Math.max(-1, Math.min(1, ny));
      }
    });

    Mosaico3D.loopParallax();
  };

  Mosaico3D.loopParallax = function () {
    if (document.hidden || (global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches)) {
      document.querySelectorAll('.m3d-tilt-box').forEach(function (el) { el.style.transform = 'none'; });
      Mosaico3D.parallaxFrame = requestAnimationFrame(Mosaico3D.loopParallax);
      return;
    }
    // Interpolação suave (Lerp)
    var k = 0.12;
    Mosaico3D.tilt.x += (Mosaico3D.tilt.targetX - Mosaico3D.tilt.x) * k;
    Mosaico3D.tilt.y += (Mosaico3D.tilt.targetY - Mosaico3D.tilt.y) * k;

    var rotY = (Mosaico3D.tilt.x * 14).toFixed(2);
    var rotX = (-Mosaico3D.tilt.y * 14).toFixed(2);
    var lightX = (50 + Mosaico3D.tilt.x * 35).toFixed(1) + "%";
    var lightY = (35 + Mosaico3D.tilt.y * 35).toFixed(1) + "%";

    var root = document.documentElement;
    if (root) {
      root.style.setProperty("--tilt-rot-x", rotX + "deg");
      root.style.setProperty("--tilt-rot-y", rotY + "deg");
      root.style.setProperty("--light-x", lightX);
      root.style.setProperty("--light-y", lightY);
    }

    var tiltElements = document.querySelectorAll(".m3d-tilt-box");
    tiltElements.forEach(function (el) {
      el.style.transform = "rotateX(" + rotX + "deg) rotateY(" + rotY + "deg)";
    });

    Mosaico3D.parallaxFrame = requestAnimationFrame(Mosaico3D.loopParallax);
  };

  /* ------------------------------------------------------------
     4. CANVAS ATMOSFÉRICO 3D (CHUVA, NÉVOA E RELÂMPAGOS)
     ------------------------------------------------------------ */
  Mosaico3D.iniciarAtmosfera = function () {
    var canvas = document.getElementById("m3d-ambient-canvas");
    if (!canvas) {
      canvas = document.createElement("canvas");
      canvas.id = "m3d-ambient-canvas";
      document.body.prepend(canvas);
    }
    Mosaico3D.canvas = canvas;
    Mosaico3D.ctx = canvas.getContext("2d");

    function redimensionar() {
      if (!Mosaico3D.canvas) return;
      Mosaico3D.canvas.width = global.innerWidth || 360;
      Mosaico3D.canvas.height = global.innerHeight || 640;
      gerarGotas();
    }

    function gerarGotas() {
      Mosaico3D.gotas = [];
      var total = Math.min(85, Math.floor((Mosaico3D.canvas.width * Mosaico3D.canvas.height) / 8000));
      for (var i = 0; i < total; i++) {
        Mosaico3D.gotas.push({
          x: Math.random() * Mosaico3D.canvas.width,
          y: Math.random() * Mosaico3D.canvas.height,
          z: 0.3 + Math.random() * 0.7, // Profundidade 3D
          len: 12 + Math.random() * 22,
          speed: 16 + Math.random() * 18
        });
      }
    }

    global.addEventListener("resize", redimensionar);
    redimensionar();

    var farolAngulo = 0;

    function animar() {
      var ctx = Mosaico3D.ctx;
      if (!ctx || !Mosaico3D.canvas) return;
      var w = Mosaico3D.canvas.width;
      var h = Mosaico3D.canvas.height;

      ctx.clearRect(0, 0, w, h);

      // Feixe do Farol Costeiro ao longe em 3D
      farolAngulo += 0.008;
      var farolX = w * 0.5 + Math.sin(farolAngulo) * (w * 0.45);
      var gradFarol = ctx.createRadialGradient(farolX, 60, 0, farolX, 60, w * 0.7);
      gradFarol.addColorStop(0, "rgba(232, 164, 76, 0.08)");
      gradFarol.addColorStop(0.4, "rgba(127, 212, 255, 0.03)");
      gradFarol.addColorStop(1, "transparent");
      ctx.fillStyle = gradFarol;
      ctx.fillRect(0, 0, w, h * 0.4);

      // Gotas de Chuva em 3 Camadas de Profundidade
      var wind = (Mosaico3D.tilt.x * 6);
      ctx.lineWidth = 1.2;
      for (var i = 0; i < Mosaico3D.gotas.length; i++) {
        var g = Mosaico3D.gotas[i];
        ctx.strokeStyle = "rgba(143, 163, 184, " + (g.z * 0.35) + ")";
        ctx.beginPath();
        ctx.moveTo(g.x, g.y);
        ctx.lineTo(g.x + wind * g.z, g.y + g.len * g.z);
        ctx.stroke();

        g.y += g.speed * g.z;
        g.x += wind * g.z;
        if (g.y > h) {
          g.y = -g.len;
          g.x = Math.random() * w;
        }
      }

      requestAnimationFrame(animar);
    }
    animar();

    // Relâmpagos Periódicos
    function agendarRelampago() {
      var intervalo = 12000 + Math.random() * 20000;
      Mosaico3D.trovaoTimeout = setTimeout(function () {
        Mosaico3D.dispararRelampago();
        agendarRelampago();
      }, intervalo);
    }
    agendarRelampago();
  };

  Mosaico3D.dispararRelampago = function () {
    var app = document.getElementById("app") || document.body;
    app.classList.add("m3d-lightning-flash");
    setTimeout(function () {
      Mosaico3D.som.trovao();
      app.classList.remove("m3d-lightning-flash");
    }, 350);
  };

  /* ------------------------------------------------------------
     5. COMPONENTES VISUAIS 3D INTERATIVOS
     ------------------------------------------------------------ */

  // Cartão 3D de Personagem ou Evidência com Flip Interativo
  Mosaico3D.htmlCartao3D = function (id, frenteHtml, versoHtml, seloEmoji) {
    return '<div class="m3d-card-stage">' +
      '<div class="m3d-card-tilt m3d-tilt-box"><div class="m3d-card-3d" id="card-3d-' + id + '">' +
        '<div class="m3d-card-face m3d-card-front" aria-hidden="false">' +
          '<div class="m3d-hologram-seal">' + (seloEmoji || '🔍') + '</div>' +
          frenteHtml +
        '</div>' +
        '<div class="m3d-card-face m3d-card-back" aria-hidden="true">' +
          '<span class="m3d-stamp">Confidencial</span>' +
          versoHtml +
        '</div>' +
      '</div></div>' +
      '<button type="button" class="m3d-card-turn" id="turn-3d-' + id + '" aria-controls="card-3d-' + id + '" aria-pressed="false" onclick="Mosaico3D.flipCartao(\'' + id + '\')">Virar fragmento</button>' +
    '</div>';
  };

  Mosaico3D.flipCartao = function (id) {
    var el = document.getElementById("card-3d-" + id);
    if (el) {
      el.classList.toggle("flipped");
      var flipped = el.classList.contains('flipped');
      var button = document.getElementById('turn-3d-' + id);
      if (button) { button.setAttribute('aria-pressed', String(flipped)); button.textContent = flipped ? 'Ver frente' : 'Virar fragmento'; }
      var front = el.querySelector('.m3d-card-front'), back = el.querySelector('.m3d-card-back');
      if (front) front.setAttribute('aria-hidden', String(flipped));
      if (back) back.setAttribute('aria-hidden', String(!flipped));
      Mosaico3D.som.lacre();
    }
  };

  // Tabuleiro do Mosaico 3D com Encaixes e Pings
  Mosaico3D.htmlTabuleiroMosaico = function (dicas, rascunho, souPortador, preenchidos) {
    var total = dicas.length;
    var pistas = typeof pistasMosaico === "function" ? pistasMosaico() : [];

    var slotsHtml = dicas.map(function (d, i) {
      var id = rascunho[String(i)];
      var pista = pistas.find(function (p) { return p.id === id; });
      var preenchido = !!pista;
      var rotulo = pista ? (typeof rotuloPistaMosaico === "function" ? rotuloPistaMosaico(pista) : pista.txt) : "Selecionar pista para este horário…";

      var acaoSlot = souPortador
        ? '<button class="m3d-btn-select-tile ' + (preenchido ? '' : 'empty') + '" onclick="abrirEscolhaMosaico(' + i + ')">' +
            '<span>' + rotulo + '</span>' +
            '<span style="opacity:0.8">' + (preenchido ? '✓' : '▼') + '</span>' +
          '</button>'
        : '<div class="m3d-btn-select-tile ' + (preenchido ? '' : 'empty') + '">' +
            '<span>' + (preenchido ? rotulo : (d.dica || 'Aguardando o Portador organizar…')) + '</span>' +
          '</div>';

      var pingSlot = !souPortador
        ? '<div class="m3d-ping-bar">' +
            '<button class="m3d-btn-ping" onclick="Mosaico3D.enviarPing(' + i + ')">' +
              '<span class="m3d-ping-dot" style="color:var(--ambar)"></span> Sugerir este horário ao Portador' +
            '</button>' +
          '</div>'
        : '';

      return '<div class="m3d-slot ' + (preenchido ? 'filled' : '') + '" id="m3d-slot-' + i + '">' +
        '<div class="m3d-slot-time">' + d.hora + '</div>' +
        '<div class="m3d-slot-target">' + acaoSlot + pingSlot + '</div>' +
      '</div>';
    }).join("");

    return '<div class="m3d-mosaico-board">' +
      '<div class="m3d-board-surface m3d-tilt-box">' +
        '<div class="m3d-board-header">' +
          '<span class="eyebrow" style="margin:0">Mesa de Reconstrução 3D</span>' +
          '<span style="font:700 13px var(--sans);color:#8ee4ad">' + preenchidos + ' de ' + total + ' encaixados</span>' +
        '</div>' +
        '<div class="m3d-slots-container">' + slotsHtml + '</div>' +
      '</div>' +
    '</div>';
  };

  Mosaico3D.enviarPing = function (slotIndex) {
    Mosaico3D.som.encaixe();
    var slot = document.getElementById("m3d-slot-" + slotIndex);
    if (slot) {
      slot.classList.add("highlight-ping");
      setTimeout(function () {
        slot.classList.remove("highlight-ping");
      }, 3000);
    }
  };

  // Moedas 3D e Envelopes do Mercado
  Mosaico3D.htmlMoedas = function (qtd) {
    var maxMoedas = Math.min(qtd, 5);
    var moedasHtml = "";
    for (var i = 0; i < maxMoedas; i++) {
      moedasHtml += '<div class="m3d-coin-3d" onclick="Mosaico3D.som.moeda()" style="animation-delay:' + (i * 0.35) + 's">' +
        '<div class="m3d-coin-face">M</div>' +
        '<div class="m3d-coin-face m3d-coin-back">§</div>' +
      '</div>';
    }
    return '<div class="m3d-coins-stage">' + moedasHtml + '</div>';
  };

  /* ------------------------------------------------------------
     INICIALIZAÇÃO AUTOMÁTICA
     ------------------------------------------------------------ */
  function iniciar() {
    if (document.documentElement.hasAttribute('data-ac-workbench')) return;
    Mosaico3D.iniciarGiroscopio();
    Mosaico3D.iniciarAtmosfera();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar);
  } else {
    iniciar();
  }

  global.Mosaico3D = Mosaico3D;
})(window);
