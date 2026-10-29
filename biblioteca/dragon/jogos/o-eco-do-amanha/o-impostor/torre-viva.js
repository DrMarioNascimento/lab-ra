/* A Torre de Continuidade na noite da tempestade (three.js r128).

   25/10/2026 (Mario: "movimento, ação onde couber, o máximo… que tenha
   relação com a história"; e as obras dele "no Echo… nem que seja uma
   projeção"). O que a história sustenta, e só isso:
   - a torre "perde o reflexo antes da energia": a cada raio, frisos, letreiro
     e luzes da obra falham e gaguejam antes de voltar; o vidro da Câmara
     Branca fica opaco, como ficou às 21h13;
   - a cabine do elevador, parada entre o nono e o décimo andar, respira em
     âmbar — a cabine NÃO se move (o caso diz que ela parou);
   - no topo, as luzes vermelhas do heliponto e o balizamento das antenas
     piscam; o helicóptero, "travado pelo vento", só balança as pás;
   - as cadeiras-bolha, o balanço e as copas das árvores se movem com o
     mesmo vento que inclina a chuva;
   - no subsolo (−1), a torre "respirou apenas por baterias": as barras de
     emergência pulsam, os LEDs das baterias correm como um medidor de carga;
   - na sala de imprensa (+8), os painéis holográficos da "transmissão das
     06h00" tremulam, e nos projetores 0, 1 e 2 entram as OBRAS de Mário César
     Nascimento — a moeda da IA, a anatomia sintética e o corpo com a
     circulação —, como a prévia da transmissão. Carregam só quando se entra
     no +8.
   Fica parado: o elevador, as câmeras de segurança, o relógio, a fechadura
   magnética da imprensa (registro de entradas é álibi) e tudo o que é peça.

   TorreViva.criar(modelo, andares, {base, reduzido}) → {update(dt, dentro), clarao(b), dispose} */
(function (global) {
  'use strict';
  function criar(modelo, andares, op) {
    op = op || {};
    var T = global.THREE, t = 0, reduzido = op.reduzido === undefined ? (global.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) : op.reduzido;
    var semente = 9017; function rnd() { semente = (Math.imul(semente, 1664525) + 1013904223) >>> 0; return semente / 4294967296; }
    var descartar = [];
    function proprio(o) { if (o.material && !o.userData.vivaClone) { o.material = o.material.clone(); descartar.push(o.material); o.userData.vivaClone = true; } return o.material; }
    function noAndarFechado(o) { for (var p = o; p; p = p.parent) if (/^interior/.test(p.name || '')) return true; return false; }

    /* ---------- o que existe na torre ---------- */
    var luzes = [], vermelhas = [], cabine = null, vidroCamara = null, rotor = null, balancam = [];
    modelo.traverse(function (o) {
      var n = o.name || '', pai = (o.parent && o.parent.name) || '';
      if (o.isMesh && o.material && !noAndarFechado(o)) {
        var mn = o.material.name || '';
        if ((mn === 'led' || mn === 'letreiro_vestchip') && !/camera/.test(pai)) { var m = proprio(o); luzes.push({ m: m, e0: m.emissiveIntensity || 1 }); }
        /* o carregador cola o nome do pai no do filho, sem separador ("helipontoluzes-vermelhas"): casa-se pelo fim */
        var vt = /(luzes-vermelhas|balizamento|luzes-navegacao)$/.exec(n);
        if (vt) { var mv = proprio(o); vermelhas.push({ m: mv, e0: mv.emissiveIntensity || 1, tipo: vt[1] }); }
        if (/cabine_parada$/.test(n)) { var mc = proprio(o); cabine = { m: mc, e0: mc.emissiveIntensity || 1 }; }
        if (/camara-brancafaixa-de-vidro$|^faixa-de-vidro$/.test(n)) { var mf = proprio(o); vidroCamara = { m: mf, op0: mf.opacity, cor0: mf.color.clone() }; mf.transparent = true; }
      }
      if (/pas-rotor$/.test(n)) rotor = { o: o, r0: o.rotation.y };
      if (/(cadeira-bolha-suspensa_\d|balanco)$/.test(n) || (/copa/.test(n) && /arvore/.test(pai + n))) balancam.push({ o: o, x0: o.rotation.x, z0: o.rotation.z, f: rnd() * 6.28, a: /copa/.test(n) ? .035 : .09 });
    });

    /* ---------- o raio: falha e gagueira ---------- */
    var falha = 0, brilhoRaio = 0;
    function clarao(b) {
      brilhoRaio = b;
      if (b > .5 && falha <= 0) falha = .9 + rnd() * .5;
    }

    /* ---------- os andares por dentro (carregam depois) ---------- */
    var central = null, imprensa = null, obras = [], obrasPedidas = false;
    function acharCentral() {
      var A = andares['-1']; if (!A || !A.interior || central) return;
      var barras = [], baterias = [], status = null;
      A.interior.traverse(function (o) {
        if (!o.isMesh) return;
        if (/luz_emergencia_\d_barra$/.test(o.name)) { var m = proprio(o); barras.push({ m: m, e0: m.emissiveIntensity || 1 }); }
        var mb = /baterias_painel_led_(\d)$/.exec(o.name); if (mb) { var m2 = proprio(o); baterias[+mb[1]] = { m: m2, e0: m2.emissiveIntensity || 1 }; }
        if (/distribuidor_led_status$/.test(o.name)) { var m3 = proprio(o); status = { m: m3, e0: m3.emissiveIntensity || 1 }; }
      });
      if (barras.length || baterias.length) central = { barras: barras, baterias: baterias.filter(Boolean), status: status };
    }
    function acharImprensa() {
      var A = andares['+8']; if (!A || !A.interior || imprensa) return;
      var paineis = [], feixes = [], mics = [], projetores = {};
      A.interior.traverse(function (o) {
        if (!o.isMesh) return;
        if (/tela_\d_holo_painel$/.test(o.name)) { var m = proprio(o); paineis.push({ m: m, op0: m.opacity, f: rnd() * 6 }); m.transparent = true; }
        if (/tela_\d_feixe$/.test(o.name)) { var m2 = proprio(o); feixes.push({ m: m2, op0: m2.opacity, f: rnd() * 6 }); m2.transparent = true; }
        if (/bancada_microfone_\d_led$/.test(o.name) && o.material && o.material.name === 'led_ciano_fraco') { var m3 = proprio(o); mics.push({ m: m3, e0: m3.emissiveIntensity || 1, f: rnd() * 6 }); }
        var pj = /tela_(\d)_projetor$/.exec(o.name); if (pj) projetores[pj[1]] = o;
      });
      if (!paineis.length && !Object.keys(projetores).length) return;
      imprensa = { paineis: paineis, feixes: feixes, mics: mics, projetores: projetores, interior: A.interior };
    }
    function pedirObras() {
      if (obrasPedidas || !imprensa || !global.ObraProjecao || !T.GLTFLoader) return;
      obrasPedidas = true;
      var lista = [['moeda', 'modelos/obras/moeda-ia.glb'], ['busto', 'modelos/obras/anatomia-sintetica.glb'], ['corpo', 'modelos/obras/corpo-circulacao.glb']];
      var raizInt = imprensa.interior;
      lista.forEach(function (it, i) {
        var pj = imprensa.projetores[String(i)]; if (!pj) return;
        raizInt.updateMatrixWorld(true);
        var bb = new T.Box3().setFromObject(pj), inv = new T.Matrix4().copy(raizInt.matrixWorld).invert();
        var topo = new T.Vector3((bb.min.x + bb.max.x) / 2, bb.max.y, (bb.min.z + bb.max.z) / 2).applyMatrix4(inv);
        /* tamanho: a altura do painel que o projetor acende, no referencial do interior */
        var alt = 1.1, painel = null; raizInt.traverse(function (q) { if (!painel && new RegExp('tela_' + i + '_holo_painel$').test(q.name)) painel = q; });
        /* uns dois terços do pé-direito: presença de holograma de lançamento, sem
           tocar o teto (que sai, mas o jogador lê a sala como fechada) */
        if (painel) { var pb = new T.Box3().setFromObject(painel).applyMatrix4(inv); alt = Math.max(1.8, (pb.max.y - pb.min.y) * 1.4); } else alt = 1.8;
        var L = new T.GLTFLoader(); if (global.MeshoptDecoder) L.setMeshoptDecoder(global.MeshoptDecoder);
        L.load((op.base || '') + it[1], function (g) {
          var suporte = new T.Group(); suporte.position.copy(topo); raizInt.add(suporte);
          var ob = ObraProjecao.criar(T, suporte, { tipo: it[0], cena: g.scene, altura: alt, semBase: true, reduzido: reduzido });
          obras.push({ ob: ob, suporte: suporte });
        }, undefined, function () { /* sem a obra, a tela segue com a transmissão em espera */ });
      });
    }

    function update(dt, dentro, vento) {
      dt = Math.max(0, Math.min(.05, dt || 0)); t += dt;
      var w = vento === undefined ? .2 : vento;
      /* raio: as luzes da torre caem e gaguejam antes de voltar */
      var nivel = 1;
      if (falha > 0) { falha -= dt; nivel = falha > .5 ? (rnd() < .5 ? .08 : .45) : .3 + .7 * (1 - falha / .5) * (rnd() < .85 ? 1 : .4); if (reduzido) nivel = .35; }
      for (var i = 0; i < luzes.length; i++) luzes[i].m.emissiveIntensity = luzes[i].e0 * nivel;
      if (vidroCamara) {
        var op2 = falha > 0 ? Math.min(1, vidroCamara.op0 + .6) : vidroCamara.op0;
        vidroCamara.m.opacity += (op2 - vidroCamara.m.opacity) * Math.min(1, dt * 6);
        vidroCamara.m.color.copy(vidroCamara.cor0).lerp(new T.Color(0xe9eef0), (vidroCamara.m.opacity - vidroCamara.op0) / .6);
      }
      if (cabine) cabine.m.emissiveIntensity = cabine.e0 * (reduzido ? .8 : .55 + .45 * (.5 + .5 * Math.sin(t * 1.4)));
      for (i = 0; i < vermelhas.length; i++) {
        var v = vermelhas[i], k = v.tipo === 'balizamento' ? ((t % 2) < .5 ? 1 : .15) : v.tipo === 'luzes-navegacao' ? ((t % 1.3) < .12 ? 1.4 : .25) : .35 + .65 * Math.max(0, Math.sin(t * Math.PI));
        v.m.emissiveIntensity = v.e0 * (reduzido ? .8 : k);
      }
      if (!reduzido) {
        if (rotor) rotor.o.rotation.y = rotor.r0 + .035 * Math.sin(t * 2.1) * (1 + w);
        for (i = 0; i < balancam.length; i++) { var bl = balancam[i]; bl.o.rotation.z = bl.z0 + bl.a * (w * 1.2 + .25 * Math.sin(t * 1.3 + bl.f)); bl.o.rotation.x = bl.x0 + bl.a * .5 * Math.sin(t * .9 + bl.f); }
      }
      /* dentro dos andares */
      if (dentro === '-1') {
        acharCentral();
        if (central && !reduzido) {
          central.barras.forEach(function (b, j) { b.m.emissiveIntensity = b.e0 * (.45 + .55 * (.5 + .5 * Math.sin(t * 1.1 + j * .7))); });
          var carga = (t * 1.5) % (central.baterias.length + 2);
          central.baterias.forEach(function (b, j) { b.m.emissiveIntensity = b.e0 * (j < carga ? 1 : .15); });
          if (central.status) central.status.m.emissiveIntensity = central.status.e0 * ((t % 2.4) < .15 ? 1.6 : .4);
        }
      }
      if (dentro === '+8') {
        acharImprensa(); pedirObras();
        if (imprensa && !reduzido) {
          imprensa.paineis.forEach(function (p) { p.m.opacity = p.op0 * (.82 + .1 * Math.sin(t * 7 + p.f) + .08 * Math.sin(t * 31 + p.f * 2)); });
          imprensa.feixes.forEach(function (f) { f.m.opacity = f.op0 * (.75 + .25 * Math.sin(t * 2.3 + f.f)); });
          imprensa.mics.forEach(function (m) { m.m.emissiveIntensity = m.e0 * (.6 + .4 * Math.sin(t * .8 + m.f)); });
        }
        for (i = 0; i < obras.length; i++) obras[i].ob.update(dt);
      }
    }
    function dispose() {
      obras.forEach(function (o) { o.ob.dispose(); if (o.suporte.parent) o.suporte.parent.remove(o.suporte); });
      descartar.forEach(function (m) { if (m && m.dispose) m.dispose(); });
    }
    var inst = { update: update, clarao: clarao, dispose: dispose,
      estado: function () { return { luzes: luzes.length, vermelhas: vermelhas.length, cabine: !!cabine, vidroCamara: !!vidroCamara, rotor: !!rotor, balancam: balancam.length, central: !!central, imprensa: !!imprensa, obras: obras.length, falha: falha > 0 }; } };
    global.__torreViva = inst;
    return inst;
  }
  global.TorreViva = { criar: criar };
})(window);
