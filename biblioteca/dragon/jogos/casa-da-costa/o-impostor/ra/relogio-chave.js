/* O Impostor — o relógio de caixa alta, com a mão (revisão 2, Cap. 3).

   Substitui ra/relogio-chave_SUBSTITUIDO.js (Mario, 30/09/2026): na revisão 2
   o relógio não tem chave nem lacre, a gaveta de pesos está VAZIA no Cap. 3
   (o papel só cai nela no apagão, Cap. 5) e o gesto do capítulo é o pêndulo.

   Quem mexe depende do papel (Mario, 30/09):
   · modo=parar   — a Herdeira jogada por gente. A porta de vidro está só
                    encostada; aberta, segurar o pêndulo com o dedo faz o
                    balanço morrer e o trinco estalar. Avisa a mesa.
   · modo=religar — quem religa, jogado por gente. Puxar o pêndulo de lado e
                    soltar: ele volta a balançar e o trinco trava de novo.
   · modo=ver     — todos os outros. Só olham: "Nada se move sem ata."
   estado=andando | parado | religado diz como o relógio está quando abre.
   A gaveta de pesos corre no trilho em todos os modos, e está vazia.

   Os ponteiros mostram a hora do relógio, quatro minutos adiantado: parado
   em 20h16 (parou por volta de 20h12); religado e acertado, 20h21. Nunca
   21h34, que é a hora do Cap. 5.

   A CHAVE DE CORDA (Mario, 30/09): muda de lugar a cada partida e jogador —
   no gancho da frente, embaixo do móvel, atrás no chão, num prego atrás ou em
   cima do capitel. Nunca na gaveta de pesos (a ata a registra vazia). Um toque
   a pega: vai para o inventário e é o envio extra do capítulo.

   Fala com a mesa por postMessage: {oi:'relogio', evento:'pronto'|'porta'|'parou'|'religou'|'chave'}.
   A mesa muda o modo/estado com {oi:'mesa', relogio:true, modo, estado}. */
(function () {
  'use strict';
  var Q = new URLSearchParams(location.search), EMBED = Q.get('embed') === '1';
  var A0 = 0.07, W = Math.PI, CURSO = 0.16;      /* amplitude (rad), 2 s de período, curso da gaveta */
  var modo = Q.get('modo') || 'parar';
  var estado = Q.get('estado') || (modo === 'parar' ? 'andando' : 'parado');

  var b = OIBase.criar({
    vista: { alvo: [0, 0.95, 0], dist: 2.3, distRetrato: 3.3 },
    alturaDoAparelho: 1.35, miraEscala: 3,
    textoMira: 'Aponte para o chão, onde o relógio ficaria, e toque em Pôr aqui.',
    textoInicio: 'O relógio de caixa alta.',
    deNovo: deNovo
  });

  var relogio, pendulo, portaLonga, gaveta, puxador, lingueta, ph, pm, ps;
  var gav0 = new THREE.Vector3(), ling0 = new THREE.Vector3(), abertura = 0;
  var Q_FECHADA = new THREE.Quaternion(), Q_ABERTA = new THREE.Quaternion(0, -0.766, 0, 0.643);
  var portaAberta = false, animPorta = null, portinhola, Q_PF = new THREE.Quaternion(), portinholaAberta = false;
  var A = 0, fase = 0, segurando = false, tSeg = 0, puxando = false, anguloPuxado = 0, x0 = 0, travarEm = -1;
  var segundos = 40, chave = null, chavePega = false, animChave = null, lugarDaChave = '';

  b.carregar(['modelos/relogio_caixa_alta_v2.glb', 'modelos/chave_de_corda.glb']).then(function (r) {
    relogio = r[0].scene; b.raiz.add(relogio);
    b.controles.maxPolarAngle = Math.PI * 0.6;   /* dá para abaixar o olhar e ver embaixo do móvel */
    /* o que não é deste capítulo não aparece */
    ['lacre_porta_a', 'lacre_porta_b', 'lacre_gaveta_a', 'lacre_gaveta_b',
     'estado_D_papel_gaveta', 'estado_C_risco_assoalho', 'estado_C_poeira_deslocada'].forEach(function (n) {
      var o = relogio.getObjectByName(n); if (o) o.visible = false;
    });
    marcaDaMao(Q.get('mao') || 'agua');
    pendulo = relogio.getObjectByName('pendulo');
    portaLonga = relogio.getObjectByName('porta_longa'); Q_FECHADA.copy(portaLonga.quaternion);
    portinhola = relogio.getObjectByName('portinhola'); Q_PF.copy(portinhola.quaternion);
    gaveta = relogio.getObjectByName('gaveta'); gav0.copy(gaveta.position);
    puxador = relogio.getObjectByName('puxador_concha');
    lingueta = relogio.getObjectByName('trinco_lingueta'); ling0.copy(lingueta.position);
    ph = relogio.getObjectByName('ponteiro_horas'); pm = relogio.getObjectByName('ponteiro_minutos');
    ps = relogio.getObjectByName('ponteiro_segundos');
    aplicar(modo, estado); avisar('pronto');          /* a mesa responde com o estado atual */
    esconderChave(r[1].scene);
    pegaDaPorta(); pegaDaPortinhola(); pegaDoPendulo(); pegaDaGaveta(); pegaDaChave();
    b.aCadaQuadro(quadro);
    b.comecar();
  }).catch(function (e) { b.estado('O modelo não carregou: ' + (e && e.message || e)); });

  /* 01/10 (auditoria): a marca molhada no flanco muda com a partida (tinta azul, lã, barro
     vermelho, cal, couro, só água), como na Matriz. Tinge a marca que já existe no modelo. */
  function marcaDaMao(tipo) {
    var m = relogio.getObjectByName('estado_B_marca_umida_mao'); if (!m) return;
    var COR = { tinta: 0x2c4a9a, la: 0x2a2622, barro: 0x8a3a22, cal: 0xe8e4da, couro: 0x3a2a1e, agua: null }[tipo];
    m.traverse(function (o) {
      if (!o.isMesh) return; o.material = o.material.clone();
      if (COR !== null && COR !== undefined) { o.material.color = new THREE.Color(COR).convertSRGBToLinear(); o.material.opacity = Math.max(o.material.opacity || 1, 0.75); }
    });
  }
  function centro(o) { return new THREE.Box3().setFromObject(o).getCenter(new THREE.Vector3()); }
  function avisar(evento) {
    try { if (parent !== window) parent.postMessage({ oi: 'relogio', evento: evento }, location.origin); } catch (e) {}
  }

  /* ---------------- como o relógio está ---------------- */
  function hora(h, m) {
    ph.rotation.set(0, 0, -2 * Math.PI * ((h % 12) + m / 60) / 12);
    pm.rotation.set(0, 0, -2 * Math.PI * m / 60);
  }
  function trinco(solto) { lingueta.position.copy(ling0); if (solto) lingueta.position.x += 0.006; }
  function aplicar(m, e) {
    modo = m; estado = e;
    segurando = false; puxando = false; travarEm = -1; animPorta = null;
    if (e === 'andando') {
      portaAberta = false; portaLonga.quaternion.copy(Q_FECHADA);
      A = A0; trinco(false); hora(20, 16);
    } else if (e === 'parado') {
      portaAberta = true; portaLonga.quaternion.copy(Q_ABERTA);
      A = 0; pendulo.rotation.set(0, 0, 0); trinco(true); hora(20, 16); segundos = 40;
    } else if (e === 'apagao') {                  /* 01/10, Cap. 6: depois do escuro. Marca 21h34; o papel está na gaveta; o móvel deixou rastro */
      portaAberta = false; portaLonga.quaternion.copy(Q_FECHADA);
      A = A0; trinco(false); hora(21, 34);
    } else {                                      /* religado */
      portaAberta = true; portaLonga.quaternion.copy(Q_ABERTA);
      A = A0; trinco(false); hora(20, 21);
    }
    ['estado_D_papel_gaveta', 'estado_C_risco_assoalho', 'estado_C_poeira_deslocada'].forEach(function (n) {
      var o = relogio.getObjectByName(n); if (o) o.visible = e === 'apagao';
    });
    b.mostrarDeNovo(false);
  }

  function quadro(dt) {
    if (animPorta) animPorta(dt);
    if (animChave) animChave(dt);
    /* o balanço */
    if (segurando) {
      tSeg += dt; A = Math.max(0, A - dt * 0.16);
      if (A === 0 && tSeg >= 0.8) parou();
    } else if (!puxando && estado !== 'parado' && A < A0) A = Math.min(A0, A + dt * 0.05);
    if (!puxando) { fase += dt * W; pendulo.rotation.set(0, 0, A * Math.sin(fase)); }
    if (travarEm >= 0) { travarEm -= dt; if (travarEm < 0) religou(); }
    /* o ponteiro dos segundos só anda com o pêndulo */
    if (A > 0.01 && estado !== 'parado') { segundos = (segundos + dt) % 60; }
    ps.rotation.set(0, 0, -2 * Math.PI * Math.floor(segundos) / 60);
  }

  /* ---------------- a porta de vidro (só encostada) ---------------- */
  function pegaDaPorta() {
    b.pega({
      rotulo: 'Porta de vidro',
      alvo: function () { return portaLonga; },
      ancora: function () { return centro(portaLonga); },
      ativa: function () { return !portaAberta && !animPorta; },
      fim: function (x, y, cancelou) { if (!cancelou) abrirPorta(); }
    });
  }
  function abrirPorta() {
    var t = 0;
    animPorta = function (dt) {
      t += dt;
      portaLonga.quaternion.copy(Q_FECHADA).slerp(Q_ABERTA, b.suave(t / 0.8));
      if (t >= 0.8) { animPorta = null; portaAberta = true; b.vibrar(12); avisar('porta'); if (!EMBED) b.mostrarDeNovo(true); }
    };
  }

  /* a portinhola do mostrador: abre com um toque (o gancho da chave fica atrás dela) */
  function pegaDaPortinhola() {
    b.pega({
      rotulo: 'Portinhola do mostrador',
      alvo: function () { return portinhola; },
      ativa: function () { return !portinholaAberta && !animPorta; },
      fim: function (x, y, cancelou) {
        if (cancelou) return;
        var t = 0;
        animPorta = function (dt) {
          t += dt; portinhola.quaternion.copy(Q_PF).slerp(Q_ABERTA, b.suave(t / 0.7));
          if (t >= 0.7) { animPorta = null; portinholaAberta = true; b.vibrar(10); }
        };
      }
    });
  }

  /* ---------------- o pêndulo ---------------- */
  function pegaDoPendulo() {
    b.pega({
      rotulo: 'Pêndulo',
      alvo: function () { return pendulo; },
      ancora: function () { return centro(relogio.getObjectByName('pendulo_lente')); },
      ativa: function () { return portaAberta && !animPorta && travarEm < 0; },
      inicio: function (x) {
        if (modo === 'parar' && estado === 'andando') { segurando = true; tSeg = 0; b.estado(''); return; }
        if (modo === 'religar' && estado === 'parado') { puxando = true; x0 = x; anguloPuxado = 0; b.estado(''); return; }
        b.estado(modo === 'ver' ? '"Nada se move sem ata."' : (estado === 'parado' ? 'O pêndulo está parado.' : 'O pêndulo balança.'));
      },
      mover: function (x) {
        if (!puxando) return;
        anguloPuxado = Math.max(-0.12, Math.min(0.12, (x - x0) / 220 * 0.15));
        pendulo.rotation.set(0, 0, anguloPuxado);
      },
      fim: function () {
        if (segurando) { segurando = false; if (estado === 'andando') b.estado(''); return; }
        if (!puxando) return;
        puxando = false;
        if (Math.abs(anguloPuxado) < 0.03) { pendulo.rotation.set(0, 0, 0); anguloPuxado = 0; return; }
        /* solto de lado: começa a balançar a partir de onde o dedo deixou */
        A = Math.abs(anguloPuxado); fase = anguloPuxado > 0 ? Math.PI / 2 : -Math.PI / 2;
        estado = 'religado'; travarEm = 1.2;
      }
    });
  }
  function parou() {
    segurando = false; A = 0; estado = 'parado'; trinco(true);
    b.vibrar([30, 40, 90]);
    b.estado('Um estalo seco. Metálico. Do fundo do móvel.');
    avisar('parou');
    if (!EMBED) b.mostrarDeNovo(true);
  }
  function religou() {
    travarEm = -1; trinco(false); hora(20, 21);
    b.vibrar([15, 30, 25]);
    b.estado('Outro estalo, menor, de coisa que se tranca.');
    avisar('religou');
    if (!EMBED) b.mostrarDeNovo(true);
  }

  /* ---------------- a chave de corda (muda de lugar) ---------------- */
  var LUGARES = ['frente', 'embaixo', 'atras_chao', 'prego_atras', 'capitel'];
  function topoEm(x, z) {                       /* altura da madeira sob (x, z), olhando de cima */
    relogio.updateMatrixWorld(true);
    var rc = new THREE.Raycaster(new THREE.Vector3(x, 5, z), new THREE.Vector3(0, -1, 0));
    var h = rc.intersectObject(relogio, true).find(function (h) { return b.visivel(h.object); });
    return h ? h.point.y : 0;
  }
  function esconderChave(modelo) {
    chave = new THREE.Group(); chave.add(modelo); relogio.add(chave);
    var sorte = OISorteio.gerador(Q.get('partida') || 'P-DEMO', Q.get('jogador') || '0', 'relogio-chave');
    lugarDaChave = Q.get('chave') || sorte.escolher(LUGARES);   /* ?chave= só para testar um lugar */
    var DEITADA = new THREE.Euler(-Math.PI / 2, 0, 0);
    if (lugarDaChave === 'frente') {            /* pendurada no gancho, ao lado do mostrador */
      var g = centro(relogio.getObjectByName('gancho_chave'));   /* deitada de lado, a argola no gancho */
      chave.rotation.set(0, 0, -Math.PI / 2);
      chave.position.set(g.x - 0.082, g.y - 0.004, g.z + 0.002);
    } else if (lugarDaChave === 'embaixo') {    /* no vão sob a base, só a pontinha para fora */
      chave.rotation.set(Math.PI / 2, 0, 0.35);
      chave.position.set(-0.06, 0.006, 0.07);
    } else if (lugarDaChave === 'atras_chao') { /* caída atrás do móvel */
      chave.rotation.copy(DEITADA); chave.rotation.z = 2.2;
      chave.position.set(0.1, 0.006, -0.22);
    } else if (lugarDaChave === 'prego_atras') { /* num prego no fundo do móvel */
      var prego = new THREE.Mesh(new THREE.CylinderGeometry(0.0022, 0.0022, 0.022, 8).rotateX(Math.PI / 2),
        new THREE.MeshStandardMaterial({ color: 0x5a5048, metalness: 0.8, roughness: 0.5 }));
      prego.position.set(-0.08, 1.0, -0.151); relogio.add(prego);
      chave.rotation.set(0, Math.PI, 0);
      chave.position.set(-0.08, 1.0 - 0.082, -0.156);
    } else {                                    /* em cima do capitel, na poeira */
      chave.rotation.copy(DEITADA); chave.rotation.z = -0.9;
      chave.position.set(0.19, topoEm(0.19, 0.02) + 0.006, 0.02);
    }
    chave0 = { p: chave.position.clone(), q: chave.quaternion.clone() };
  }
  var chave0 = null;
  function pegaDaChave() {
    b.pega({
      rotulo: 'Chave de corda',
      alvo: function () { return chave; },
      ancora: function () { return chave.getWorldPosition(new THREE.Vector3()); },
      ativa: function () { return !chavePega && !animChave; },
      fim: function (x, y, cancelou) { if (!cancelou && chaveAVista(x, y)) pegarChave(); }
    });
  }
  /* a chave só vem se o dedo a alcança: atrás do móvel, é preciso dar a volta */
  function chaveAVista(x, y) {
    var h = b.raioDoDedo(x, y).intersectObject(relogio, true).find(function (h) { return b.visivel(h.object); });
    for (var o = h && h.object; o; o = o.parent) if (o === chave) return true;
    return false;
  }
  function pegarChave() {
    var t = 0, de = chave.getWorldPosition(new THREE.Vector3());
    b.vibrar([15, 30, 15]);
    animChave = function (dt) {                 /* a chave vem para a mão de quem olha e some */
      t += dt;
      var cam = b.cameraAgora(), para = cam.getWorldPosition(new THREE.Vector3())
        .add(cam.getWorldDirection(new THREE.Vector3()).multiplyScalar(0.25 * b.escala()));
      chave.parent.worldToLocal(chave.position.copy(de.clone().lerp(para, b.suave(t / 0.6))));
      if (t >= 0.6) { animChave = null; chave.visible = false; chavePega = true;
        b.estado('A chave de corda.'); avisar('chave'); }
    };
  }

  /* ---------------- a gaveta de pesos (vazia) ---------------- */
  function pegaDaGaveta() {
    var inicioAbertura = 0, ancora = null, eixo = null;
    function noTrilho(x, y) {
      var olhar = b.cameraAgora().getWorldDirection(new THREE.Vector3());
      var normal = olhar.clone().sub(eixo.clone().multiplyScalar(olhar.dot(eixo)));
      if (normal.lengthSq() < 1e-6) return null;
      normal.normalize();
      var p = b.dedoNoPlano(x, y, new THREE.Plane().setFromNormalAndCoplanarPoint(normal, ancora));
      return p ? p.sub(ancora).dot(eixo) / b.escala() : null;
    }
    b.pega({
      rotulo: 'Puxador da gaveta',
      alvo: function () { return gaveta; },
      ancora: function () { return centro(puxador); },
      /* 01/10 (auditoria): no Cap. 3 quem abre a gaveta é o condutor, com a caneta, em ata;
         na peça ela só corre depois do apagão (Cap. 6), quando o papel já está nela */
      ativa: function () { return !animPorta && (estado === 'apagao' || !EMBED); },
      inicio: function () {
        inicioAbertura = abertura; ancora = centro(puxador);
        eixo = new THREE.Vector3(0, 0, 1).transformDirection(gaveta.parent.matrixWorld);
      },
      mover: function (x, y) {
        var v = noTrilho(x, y); if (v === null) return;
        abertura = Math.min(CURSO, Math.max(0, inicioAbertura + v));
        gaveta.position.copy(gav0).add(new THREE.Vector3(0, 0, abertura));
      },
      fim: function () { if (abertura >= CURSO - 0.005) b.vibrar(15); }
    });
  }

  function deNovo() {                               /* só no laboratório (fora do jogo) */
    abertura = 0; gaveta.position.copy(gav0); portinholaAberta = false; portinhola.quaternion.copy(Q_PF);
    animChave = null; chavePega = false; chave.visible = true; chave.position.copy(chave0.p); chave.quaternion.copy(chave0.q);
    aplicar(modo, modo === 'parar' ? 'andando' : 'parado');
    b.estado('O relógio de caixa alta.');
  }

  addEventListener('message', function (e) {
    if (e.origin !== location.origin || !e.data || e.data.oi !== 'mesa' || !e.data.relogio || !relogio) return;
    aplicar(e.data.modo || modo, e.data.estado || estado);
  });

  window.OIRelogio = {
    portinholaNaTela: function () { return b.naTela(centro(portinhola)); },
    portaNaTela: function () { return b.naTela(centro(portaLonga)); },
    penduloNaTela: function () { return b.naTela(centro(relogio.getObjectByName('pendulo_lente'))); },
    puxadorNaTela: function () { return b.naTela(centro(puxador)); },
    portaAberta: function () { return portaAberta; }, estado: function () { return estado; },
    modo: function () { return modo; }, amplitude: function () { return A; }, abertura: function () { return abertura; },
    chaveNaTela: function () { return b.naTela(chave.getWorldPosition(new THREE.Vector3())); },
    lugarDaChave: function () { return lugarDaChave; },
    olharDe: function (azimute, altura) {   /* para os testes: põe a câmera num ângulo */
      var c = b.camera, t = b.controles.target, d = c.position.distanceTo(t);
      c.position.set(t.x + d * Math.sin(azimute) * Math.cos(altura), t.y + d * Math.sin(altura), t.z + d * Math.cos(azimute) * Math.cos(altura)); c.lookAt(t); b.controles.update(); }, chavePega: function () { return chavePega; },
    papelVisivel: function () { return relogio.getObjectByName('estado_D_papel_gaveta').visible; }
  };
})();
