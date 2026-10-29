/* A casa viva: o que se move na maquete sem ser pista (three.js r128).

   25/10/2026 (Mario: "movimento, ação onde couber, o máximo… que tenha
   relação com a história"). A noite é de tempestade; a casa reage a ela:
   - os VIDROS das janelas devolvem o clarão de cada raio (azul-frio, nunca o
     verde-água que no jogo quer dizer "pode tocar");
   - o JASMIM do pátio (o perfume dos capítulos 4 e 6) balança com o mesmo
     vento que inclina a chuva;
   - a FONTE do pátio corre e abre anéis no espelho d'água;
   - a fumaça sai da CHAMINÉ DA COZINHA e da MENOR, deitada pelo vento. A
     maciça fica fria: o capitel e os peitos dela são fechaduras;
   - o MAR de resina sob o rochedo ondula e devolve o clarão.
   Fica parado de propósito: o relógio (a hora é pista), as velas e castiçais
   (alvos), a luz da fresta, a lareira acesa (mora junto de uma fechadura) e
   as luzes das janelas (piscar sugeriria apagão).

   Tudo é filho da maquete (acompanha a âncora e as camadas), nada recebe
   toque, e com movimento reduzido só o clarão nos vidros continua.

   RAVidaCasa.criar(mundo, clima, {reduzido}) → {update(dt), clarao(b), dispose} */
(function (global) {
  'use strict';
  function criar(mundo, clima, op) {
    op = op || {};
    var T = global.THREE, raiz = mundo.raiz, reduzido = !!op.reduzido, t = 0, descartar = [];
    function guarda(x) { descartar.push(x); return x; }
    function vento() { return clima && clima.vento ? clima.vento(t) : .2; }
    function semToque(o) { o.traverse(function (x) { x.raycast = function () {}; }); return o; }

    /* ---------- vidros ---------- */
    var vidros = [];
    raiz.traverse(function (o) {
      if (o.isMesh && /\/glass$/.test(o.name) && o.material && o.material.emissive) {
        vidros.push({ m: o.material, e0: o.material.emissive.clone(), i0: o.material.emissiveIntensity });
      }
    });
    var corClarao = new T.Color(0xbcd4ff);
    function clarao(b) {
      for (var i = 0; i < vidros.length; i++) {
        var v = vidros[i];
        if (b > .01) { v.m.emissive.copy(v.e0).lerp(corClarao, Math.min(1, b)); v.m.emissiveIntensity = v.i0 + 1.6 * b; }
        else { v.m.emissive.copy(v.e0); v.m.emissiveIntensity = v.i0; }
      }
      if (mar) mar.material.emissiveIntensity = .9 * b;
    }

    /* ---------- vento no jasmim (no shader: as folhas são uma malha só) ---------- */
    var uVento = { value: 0 }, uTempo = { value: 0 }, plantas = 0;
    raiz.traverse(function (o) {
      if (!o.isMesh || !/\/(folha-jasmim|flor-jasmim|jasmim)$/.test(o.name)) return;
      o.geometry.computeBoundingBox();
      var bb = o.geometry.boundingBox, y0 = bb.min.y, h = Math.max(1e-4, bb.max.y - bb.min.y);
      var mat = o.material;
      mat.onBeforeCompile = function (sh) {
        sh.uniforms.uVento = uVento; sh.uniforms.uTempo = uTempo;
        sh.vertexShader = 'uniform float uVento;\nuniform float uTempo;\n' + sh.vertexShader.replace('#include <begin_vertex>',
          '#include <begin_vertex>\n float alt = clamp((position.y - ' + y0.toFixed(5) + ') / ' + h.toFixed(5) + ', 0.0, 1.0);\n' +
          ' float ond = sin(uTempo * 1.9 + position.x * 140.0 + position.z * 90.0) * 0.6 + sin(uTempo * 3.7 + position.z * 210.0) * 0.4;\n' +
          ' transformed.x += alt * alt * (uVento * 0.010 + ond * 0.0016 * (0.4 + uVento * 3.0));\n' +
          ' transformed.z += alt * alt * ond * 0.0011 * (0.4 + uVento * 3.0);');
      };
      mat.customProgramCacheKey = function () { return 'jasmim-vento'; };
      mat.needsUpdate = true; plantas++;
    });

    /* ---------- fonte: a água que cai e os anéis no espelho ---------- */
    var caindo = null, espelho = null, aneis = [];
    raiz.traverse(function (o) {
      if (!o.isMesh) return;
      if (/\/agua-caindo$/.test(o.name)) caindo = o;
      if (/\/water$/.test(o.name)) espelho = o;
    });
    if (caindo) { caindo.material.transparent = true; caindo.userData.op0 = caindo.material.opacity; }
    var grupoAneis = null;
    if (espelho) {
      espelho.geometry.computeBoundingBox();
      var eb = espelho.geometry.boundingBox, ec = eb.getCenter(new T.Vector3()), er = Math.max(eb.max.x - eb.min.x, eb.max.z - eb.min.z) * .5;
      grupoAneis = new T.Group(); grupoAneis.position.copy(espelho.position); grupoAneis.quaternion.copy(espelho.quaternion); grupoAneis.scale.copy(espelho.scale);
      espelho.parent.add(grupoAneis);
      /* anéis tênues, da cor da água, cada um num ponto do espelho: concêntricos
         e claros, eles se confundiam com o halo que no jogo marca um alvo */
      var mAnel = guarda(new T.MeshBasicMaterial({ color: 0x8fb0bd, transparent: true, opacity: .18, depthWrite: false }));
      var gAnel = guarda(new T.RingGeometry(er * .05, er * .062, 20).rotateX(-Math.PI / 2));
      var lugares = [[.35, .2], [-.3, .35], [.15, -.4], [-.4, -.15], [.05, .05]];
      for (var i = 0; i < lugares.length; i++) {
        var a = new T.Mesh(gAnel, mAnel.clone()); guarda(a.material);
        a.position.set(ec.x + lugares[i][0] * er, eb.max.y + er * .004, ec.z + lugares[i][1] * er); a.userData.f = (i * .37) % 1; grupoAneis.add(a); aneis.push({ m: a, r: er });
      }
      semToque(grupoAneis);
    }

    /* ---------- fumaça das chaminés ---------- */
    var fumacas = [];
    var cvF = document.createElement('canvas'); cvF.width = cvF.height = 64; var gF = cvF.getContext('2d');
    var grF = gF.createRadialGradient(32, 32, 0, 32, 32, 32); grF.addColorStop(0, 'rgba(236,238,240,.85)'); grF.addColorStop(.5, 'rgba(214,218,222,.35)'); grF.addColorStop(1, 'rgba(180,186,192,0)');
    gF.fillStyle = grF; gF.fillRect(0, 0, 64, 64);
    var texF = guarda(new T.CanvasTexture(cvF));
    var chamines = (mundo.vida && mundo.vida.chamines) || [];
    chamines.forEach(function (c, k) {
      var camada = mundo.camadas && mundo.camadas[c.camada] || raiz;
      var ponto = new T.Vector3().fromArray(c.ponto);
      raiz.updateMatrixWorld(true);
      var mundoP = raiz.localToWorld(ponto.clone()), local = camada.worldToLocal(mundoP);
      var g = new T.Group(); g.position.copy(local); camada.add(g);
      var lar = Math.max(.004, c.largura || .01), puffs = [];
      for (var i = 0; i < 12; i++) {
        var s = new T.Sprite(guarda(new T.SpriteMaterial({ map: texF, color: 0xe4e8ec, transparent: true, depthWrite: false, opacity: 0 })));
        s.userData.f = (i / 12 + k * .37) % 1; g.add(s); puffs.push(s);
      }
      semToque(g); fumacas.push({ g: g, puffs: puffs, lar: lar });
    });

    /* ---------- o mar de resina ---------- */
    var mar = null;
    if (mundo.base && mundo.base.mar) {
      var caixa = mundo.base.mar;
      var p = caixa.geometry.parameters, cvM = document.createElement('canvas'); cvM.width = cvM.height = 128; var gM = cvM.getContext('2d'), img = gM.createImageData(128, 128);
      /* ondas periódicas: o ladrilho fecha nas bordas */
      for (var y = 0; y < 128; y++) for (var x = 0; x < 128; x++) {
        var u = x / 128 * 6.283, v = y / 128 * 6.283;
        var dx = .55 * Math.cos(u * 3 + v) + .35 * Math.cos(u * 5 - v * 2) + .2 * Math.cos(u - v * 4);
        var dy = .55 * Math.cos(u * 3 + v) * .4 + .35 * Math.cos(u * 5 - v * 2) * -.8 + .2 * Math.cos(u - v * 4) * -1.6;
        var l = Math.hypot(dx * .35, dy * .35, 1), o2 = (y * 128 + x) * 4;
        img.data[o2] = 128 + dx * .35 / l * 127; img.data[o2 + 1] = 128 + dy * .35 / l * 127; img.data[o2 + 2] = 128 + 127 / l; img.data[o2 + 3] = 255;
      }
      gM.putImageData(img, 0, 0);
      var nm = guarda(new T.CanvasTexture(cvM)); nm.wrapS = nm.wrapT = T.RepeatWrapping; nm.repeat.set(5, 5 * p.depth / p.width);
      mar = new T.Mesh(guarda(new T.PlaneGeometry(p.width, p.depth)), guarda(new T.MeshStandardMaterial({
        color: 0x061a22, roughness: .14, metalness: .35, normalMap: nm, normalScale: new T.Vector2(.9, .9),
        transparent: true, opacity: .62, emissive: new T.Color(0x9cc4ff), emissiveIntensity: 0 })));
      mar.rotation.x = -Math.PI / 2; mar.position.copy(caixa.position); mar.position.y += p.height / 2 + .0004;
      caixa.parent.add(mar); semToque(mar); mar.receiveShadow = true;
    }

    function update(dt) {
      dt = Math.max(0, Math.min(.05, dt || 0)); t += dt;
      var w = vento();
      if (reduzido) { uVento.value = 0; return; }
      uTempo.value = t; uVento.value = w;
      if (caindo) caindo.material.opacity = (caindo.userData.op0 || 1) * (.78 + .22 * Math.sin(t * 13) * Math.sin(t * 7.3));
      for (var i = 0; i < aneis.length; i++) {
        var a = aneis[i], f = (a.m.userData.f + t * .45) % 1;
        a.m.scale.setScalar(.3 + f * 2.2); a.m.material.opacity = .18 * (1 - f);
      }
      for (i = 0; i < fumacas.length; i++) {
        var fm = fumacas[i];
        for (var k = 0; k < fm.puffs.length; k++) {
          var s = fm.puffs[k], q = (s.userData.f + t * .16) % 1, sobe = q * fm.lar * 13;
          s.position.set(w * sobe * 1.6 + Math.sin(t * .9 + k) * fm.lar * .2, sobe, Math.cos(t * .7 + k) * fm.lar * .2);
          var e = fm.lar * (1 + q * 4.5); s.scale.set(e, e, 1);
          s.material.opacity = .72 * Math.sin(Math.min(1, q * 1.4) * Math.PI) * (1 - q * .45);
        }
      }
      if (mar) { var nmp = mar.material.normalMap; nmp.offset.x = (t * .012 * (1 + w)) % 1; nmp.offset.y = (t * .007) % 1; }
    }
    function dispose() {
      clarao(0);
      if (global.__raVidas) { var k = global.__raVidas.indexOf(inst); if (k >= 0) global.__raVidas.splice(k, 1); }
      fumacas.forEach(function (f) { if (f.g.parent) f.g.parent.remove(f.g); });
      if (grupoAneis && grupoAneis.parent) grupoAneis.parent.remove(grupoAneis);
      if (mar && mar.parent) mar.parent.remove(mar);
      descartar.forEach(function (d) { if (d && d.dispose) d.dispose(); });
    }
    var inst = { update: update, clarao: clarao, dispose: dispose,
      estado: function () { return { vidros: vidros.length, plantas: plantas, fonte: !!caindo, aneis: aneis.length, chamines: fumacas.length, mar: !!mar }; } };
    /* para conferência no navegador */
    (global.__raVidas = global.__raVidas || []).push(inst);
    return inst;
  }
  global.RAVidaCasa = { criar: criar };
})(typeof window !== 'undefined' ? window : globalThis);
