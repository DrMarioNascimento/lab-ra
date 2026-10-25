/* A agência 0688 numa terça de garoa, às 7h47 (three.js).

   25/10/2026 (Mario: "movimento, ação onde couber, o máximo… que tenha
   relação com a história"). A manhã não tem tempestade nem sol marcado, e a
   chuva fica de fora da maquete: em dia de chuva a lingueta da porta lateral
   não trava sozinha, e água animada perto dela seria dica. O que entra é o
   que o texto já descreve e que não é pista:
   - o CARRO-FORTE parado na vaga, com o motor ligado: pisca-alerta e faróis
     respirando, e o tremor mínimo do motor — ele chegou uma hora antes e não
     sai do lugar;
   - a FARMÁCIA: "uma lâmpada fria pisca na vitrine", e a cruz verde pulsa;
   - a PADARIA: o vapor da segunda fornada sobe pelo exaustor;
   - pombos sob os toldos, que trocam de pé e dão pulinhos.
   Fica parado: câmeras (campos fixos são pista), telas da Central e do rack,
   LEDs (o estabilizador pisca um padrão que é pista), porta giratória, cofre
   e o relógio (horários são pista).

   AgenciaViva.criar(modelo, {reduzido}) → {update(dt), dispose} */
(function (global) {
  'use strict';
  function criar(modelo, op) {
    op = op || {};
    var T = global.THREE, t = 0, descartar = [], reduzido = op.reduzido === undefined ? (global.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) : op.reduzido;
    var s = 88; function rnd() { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; }
    function semToque(o) { o.traverse(function (x) { x.raycast = function () {}; }); return o; }
    function noPai(o, nome) { for (var p = o; p; p = p.parent) if (p.name === nome) return true; return false; }

    /* ---------- o carro-forte ---------- */
    var vaga = modelo.getObjectByName('vaga-blindada'), farois = [], lanternas = [], carroceria = [];
    if (vaga) vaga.traverse(function (o) {
      if (!o.isMesh || !o.material) return;
      var n = o.material.name;
      if (n === 'farol') farois.push({ m: o.material, e0: o.material.emissiveIntensity || 1 });
      if (n === 'lanterna') lanternas.push({ m: o.material, e0: o.material.emissiveIntensity || 1 });
      if (/^(blindado|blindado-escuro|pneu|farol|lanterna)$/.test(n)) carroceria.push({ o: o, y0: o.position.y });
    });
    /* materiais só desta vaga: animar não vaza para outra sala (conferido em 26/10) */

    /* ---------- a farmácia ---------- */
    var neon = [], lampada = null, farmacia = modelo.getObjectByName('farmacia');
    if (farmacia) farmacia.traverse(function (o) {
      if (!o.isMesh || !o.material) return;
      if (o.material.name === 'neon-verde') neon.push({ m: o.material, e0: o.material.emissiveIntensity || 1 });
      if (!lampada && o.material.name === 'luminaria') { o.material = o.material.clone(); descartar.push(o.material); lampada = { m: o.material, e0: o.material.emissiveIntensity || 1 }; }
    });

    /* ---------- o vapor da padaria ---------- */
    var vapor = null, padaria = modelo.getObjectByName('padaria');
    if (padaria) {
      var bb = new T.Box3().setFromObject(padaria), inv = new T.Matrix4().copy(modelo.matrixWorld).invert(); bb.applyMatrix4(inv);
      var cv = document.createElement('canvas'); cv.width = cv.height = 64; var g = cv.getContext('2d'), gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
      gr.addColorStop(0, 'rgba(245,245,242,.7)'); gr.addColorStop(1, 'rgba(240,240,236,0)'); g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
      var tx = new T.CanvasTexture(cv); descartar.push(tx);
      vapor = new T.Group(); vapor.position.set(bb.max.x - (bb.max.x - bb.min.x) * .2, bb.max.y, bb.min.z + (bb.max.z - bb.min.z) * .3); modelo.add(vapor);
      var lado = Math.max(bb.max.x - bb.min.x, bb.max.z - bb.min.z) * .12;
      for (var i = 0; i < 10; i++) { var m = new T.SpriteMaterial({ map: tx, transparent: true, depthWrite: false, opacity: 0 }); descartar.push(m); var sp = new T.Sprite(m); sp.userData.f = i / 10; vapor.add(sp); }
      vapor.userData.lado = lado; semToque(vapor);
    }

    /* ---------- pombos sob os toldos ---------- */
    var pombos = [], toldos = [];
    /* os toldos são material, não nó: a agência vem fundida por sala */
    modelo.traverse(function (o) { if (o.isMesh && o.material && /^toldo-/.test(o.material.name || '')) toldos.push(o); });
    if (toldos.length) {
      var corpoM = new T.MeshStandardMaterial({ color: 0x8a8f99, roughness: .8 }), cabM = new T.MeshStandardMaterial({ color: 0x5d6470, roughness: .7 }); descartar.push(corpoM, cabM);
      var gC = new T.SphereGeometry(1, 10, 8), gK = new T.SphereGeometry(.55, 8, 6); descartar.push(gC, gK);
      toldos.slice(0, 3).forEach(function (td, k) {
        var b2 = new T.Box3().setFromObject(td), inv2 = new T.Matrix4().copy(modelo.matrixWorld).invert(); b2.applyMatrix4(inv2);
        var esc = Math.max(b2.max.x - b2.min.x, b2.max.z - b2.min.z) * .035;
        for (var j = 0; j < 2; j++) {
          var p = new T.Group(), c = new T.Mesh(gC, corpoM), h = new T.Mesh(gK, cabM);
          c.scale.set(1, .8, 1.4); h.position.set(0, .7, .95); p.add(c, h); p.scale.setScalar(esc);
          p.position.set(b2.min.x + (b2.max.x - b2.min.x) * (.25 + .5 * rnd()), 0, b2.max.z + esc * 2 + rnd() * esc * 3);
          p.rotation.y = rnd() * 6.28; p.userData = { y0: p.position.y, f: rnd() * 6, r0: p.rotation.y, prox: 1 + rnd() * 4, pulo: 0 };
          modelo.add(p); semToque(p); pombos.push(p);
        }
      });
    }

    function update(dt) {
      dt = Math.max(0, Math.min(.05, dt || 0)); t += dt;
      /* pisca-alerta: ~1,1 por segundo, as lanternas e os faróis juntos */
      var alerta = (t % .9) < .45 ? 1 : .25;
      farois.forEach(function (f) { f.m.emissiveIntensity = f.e0 * (.75 + .25 * alerta); });
      lanternas.forEach(function (l) { l.m.emissiveIntensity = l.e0 * alerta; });
      neon.forEach(function (n) { n.m.emissiveIntensity = n.e0 * (reduzido ? 1 : .7 + .3 * (.5 + .5 * Math.sin(t * 2.2))); });
      if (lampada) lampada.m.emissiveIntensity = lampada.e0 * (reduzido ? 1 : (Math.sin(t * 17) > .93 || (t % 5.3) < .09 ? .25 : 1));
      if (reduzido) return;
      carroceria.forEach(function (c, i) { c.o.position.y = c.y0 + .0006 * Math.sin(t * 48 + i); });
      if (vapor) vapor.children.forEach(function (sp) {
        var q = (sp.userData.f + t * .12) % 1, L = vapor.userData.lado;
        sp.position.set(q * L * .8 + Math.sin(t + q * 5) * L * .15, q * L * 4, 0); var e = L * (.6 + q * 1.8); sp.scale.set(e, e, 1);
        sp.material.opacity = .45 * Math.sin(q * Math.PI);
      });
      pombos.forEach(function (p) {
        var u = p.userData; u.prox -= dt;
        if (u.prox <= 0) { u.pulo = .35; u.prox = 1.5 + rnd() * 4; u.r0 += (rnd() - .5) * 1.4; }
        if (u.pulo > 0) { u.pulo -= dt; p.position.y = u.y0 + Math.sin((1 - u.pulo / .35) * Math.PI) * p.scale.x * 1.2; }
        else p.position.y = u.y0;
        p.rotation.y += (u.r0 - p.rotation.y) * Math.min(1, dt * 6);
        p.children[1].rotation.x = .25 * Math.max(0, Math.sin(t * 5 + u.f)) ;
      });
    }
    function dispose() {
      if (vapor && vapor.parent) vapor.parent.remove(vapor);
      pombos.forEach(function (p) { if (p.parent) p.parent.remove(p); });
      descartar.forEach(function (d) { if (d && d.dispose) d.dispose(); });
    }
    var inst = { update: update, dispose: dispose, estado: function () { return { farois: farois.length, lanternas: lanternas.length, carroceria: carroceria.length, neon: neon.length, lampada: !!lampada, vapor: !!vapor, pombos: pombos.length }; } };
    global.__agenciaViva = inst;
    return inst;
  }
  global.AgenciaViva = { criar: criar };
})(window);
