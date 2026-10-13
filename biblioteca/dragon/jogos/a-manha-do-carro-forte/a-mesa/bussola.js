/* MOSAICO · A Manhã do Carro-Forte — a bússola, no padrão da Casa da Costa.
   ==========================================================================

   POR QUE ESTE ARQUIVO EXISTE (05/09/2026)
   ----------------------------------------
   Mario jogou as três atividades da Casa e as três do Carro-Forte no mesmo
   dia: "a janela do norte, a sala escura funcionaram perfeitamente bem. esse
   vai ser o padrão. Não gostei do que foi feito de atividade para o
   carro-forte."

   O diagnóstico fácil seria dizer que as do Carro-Forte são pobres de código.
   Não são: elas já tinham as quatro correções de plataforma — média circular,
   perfis por sensor, `webkitCompassAccuracy` e permanência acumulada. O que
   elas não têm é o TRATAMENTO DE SINAL que a Casa desenvolveu depois, e que é
   a diferença entre a agulha tremer e o ponto ficar parado na mão.

   Este módulo traz esse tratamento, dos arquivos da Casa, sem inventar nada.
   Os números não são escolhas novas: são os que já foram medidos em playtest
   com iPhone e Android e estão comentados lá.

   O QUE ELE RESOLVE, E QUE UM MOSTRADOR SIMPLES NÃO RESOLVE
   ---------------------------------------------------------
   1. NO iPHONE, A BÚSSOLA VALE COMO NORTE E NUNCA COMO ALPHA.
      Fazer `alpha = 360 - webkitCompassHeading` e mandar pela matriz de Euler
      só se sustenta com o aparelho quase deitado. Levantando o braço, beta
      chega perto de 90°, que é onde alpha e gamma entram em travamento de
      cardan: o par reportado salta junto e continua correto, a bússola
      compensada não salta, e a mistura dos dois faz o rumo oscilar dezenas de
      graus com o aparelho PARADO. Era a causa do "o iOS não mantém o ponto".
      Aqui são duas coisas separadas: a ATITUDE dá o rumo relativo (vem do
      giroscópio, é lisa, e o eixo que interessa não degenera), e a BÚSSOLA
      corrige um OFFSET que anda devagar de propósito — a deriva do giroscópio
      é de graus por minuto, a agulha treme a cada quadro.
   2. O offset só é aprendido com o aparelho inclinado PARA TRÁS. Um lado só,
      uma convenção só.
   3. Havendo fonte absoluta (Android), a relativa é descartada — senão o rumo
      alterna de referencial quadro a quadro, porque os dois eventos disparam.

   O QUE ELE NÃO FAZ
   -----------------
   Não desenha nada e não conhece atividade nenhuma. Quem monta cena é quem
   chama. Isto aqui é instrumento.                                          */
(function () {
  'use strict';

  var D2R = Math.PI / 180, PI = Math.PI;
  function wrap360(x) { x %= 360; return x < 0 ? x + 360 : x; }
  function wrap180(x) { x = wrap360(x); return x > 180 ? x - 360 : x; }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }

  /* ── AJUSTE DE JOGO ──────────────────────────────────────────────────────
     Copiados do CFG da Janela do Norte da Casa. Não mexer sem playtest: cada
     um destes números tem um parágrafo de justificativa lá.

     SOLTA  histerese — depois de engatar, a janela alarga. É mais fácil
            CONTINUAR segurando do que COMEÇAR.
     DRENO  ao sair da faixa o progresso ESCOA em vez de zerar. Era o que mais
            doía: um quadro fora apagava a permanência inteira, e tremor de mão
            é o estado normal de quem segura um telefone. */
  var CFG = {
    TOL_ROLL: 18,     /* o aparelho precisa estar em pé */
    HOLD_MS: 1500,    /* tempo firme no alvo para fechar */
    FOLGA: 1,         /* multiplica a tolerância inteira */
    SOLTA: 1.7,
    DRENO: 0.55,
    DT_MAX: 0.05,     /* teto do delta por quadro, em segundos. Sem ele, uma
                         aba em segundo plano entrega o alvo de graça ao voltar. */
  };

  /* Tolerância assimétrica, como na Casa: o rumo perdoa muito mais que a
     altura, porque é o rumo que o magnetômetro erra — de 5 a 20°. */
  /* `alto` alarga o rumo, `altoEl` alarga a altura. O segundo nasceu na Sala às
     Escuras: lá o jogador está DENTRO do cenário, a um par de metros de um
     armário de dois metros, e o objeto ocupa meia tela na vertical. Cobrar
     3,4° do centro exato de um alvo de 51° não é pontaria, é adivinhação — a
     barra ficava em zero com o facho cheio em cima da coisa. Na Janela do
     Norte, onde os alvos estão longe e são pequenos, ninguém passa o segundo
     argumento e nada muda. */
  function tolerancia(alto, altoEl) {
    return {
      az: clamp(21, 17, 26) * CFG.FOLGA * (alto || 1),
      el: clamp(3.4, 2.8, 4.2) * CFG.FOLGA * (altoEl || 1),
    };
  }

  /* ── A ATITUDE ─────────────────────────────────────────────────────────── */
  function eulerParaVista(a, b, g) {
    var A = a * D2R, B = b * D2R, G = g * D2R;
    var cA = Math.cos(A), sA = Math.sin(A), cB = Math.cos(B),
        sB = Math.sin(B), cG = Math.cos(G), sG = Math.sin(G);
    /* terceira coluna da matriz de rotação (eixo Z do aparelho, no mundo) */
    var z1 = cA * sG + cG * sA * sB, z2 = sA * sG - cA * cG * sB, z3 = cB * cG;
    /* a câmera traseira olha para -Z */
    var Lx = -z1, Ly = -z2, Lz = -z3;
    return {
      bearing: wrap360(Math.atan2(Lx, Ly) / D2R),
      elev: Math.asin(clamp(Lz, -1, 1)) / D2R,
      roll: wrap180((Math.atan2(-sB, -cB * sG) + PI / 2) / D2R),
    };
  }

  /* ── ESTADO DA LEITURA ─────────────────────────────────────────────────── */
  var raw = { bearing: 0, elev: 0, roll: 0 };
  var temAbsoluto = false, started = false;
  var bussOff = null, tOrient = 0, rumoSuave = null, iosHead = null, iOSInstavel = false;
  var northOffset = 0, declMesa = 0, fonte = 'nenhuma';
  var aoLerCb = null;

  function onOrient(e) {
    if (e.alpha === null || e.beta === null || e.gamma === null) return;
    var iOS = (typeof e.webkitCompassHeading === 'number' && !isNaN(e.webkitCompassHeading));
    var abs = iOS || e.absolute === true || e.type === 'deviceorientationabsolute';
    /* Havendo fonte absoluta, a relativa é descartada. */
    if (abs) temAbsoluto = true; else if (temAbsoluto) return;

    var v = eulerParaVista(e.alpha, e.beta, e.gamma);
    raw.elev = v.elev; raw.roll = v.roll;

    if (iOS) {
      iOSInstavel = typeof e.webkitCompassAccuracy === 'number' &&
        (e.webkitCompassAccuracy < 0 || e.webkitCompassAccuracy > 25);
      fonte = iOSInstavel ? 'bússola instável' : 'bússola (iOS)';
      var agora = performance.now();
      var dt = tOrient ? Math.min(0.25, (agora - tOrient) / 1000) : 0.016;
      tOrient = agora;
      /* O rumo que a bússola afirma, alisado antes de qualquer uso: sem isto o
         offset aprenderia o tremor. */
      var mundoCru = eulerParaVista(360 - e.webkitCompassHeading, e.beta, e.gamma).bearing;
      if (iosHead == null) iosHead = mundoCru;
      else iosHead = wrap360(iosHead + wrap180(mundoCru - iosHead) * (iOSInstavel ? 0.14 : 0.26));
      var mundo = iosHead;
      /* Quanto o topo do aparelho ainda tem de horizontal — é o que a bússola
         compensada mede. Perto de zero, o valor é ruído. E só do lado
         inclinado PARA TRÁS o offset é aprendido. */
      var cB2 = Math.cos(e.beta * D2R);
      var peso = cB2 < -0.10 ? Math.min(1, (Math.abs(cB2) - 0.10) / 0.35) : 0;
      if (iOSInstavel) peso *= 0.35;
      if (peso > 0) {
        var alvoOff = wrap180(mundo - v.bearing);
        if (bussOff === null) { if (peso >= 0.35) bussOff = alvoOff; }
        else {
          var erro = wrap180(alvoOff - bussOff);
          /* 40° num quadro é a agulha pulando, não o mundo girando */
          if (Math.abs(erro) > 40) peso *= 0.15;
          bussOff = wrap180(bussOff + erro * (1 - Math.pow(0.80, dt * peso)));
        }
      }
      var fundido = (bussOff === null) ? mundo : wrap360(v.bearing + bussOff);
      /* Alisamento na SAÍDA, não só na bússola: quem lê a velocidade angular
         daqui leria o degrau de cada evento como varredura. */
      if (rumoSuave === null) rumoSuave = fundido;
      else rumoSuave = wrap360(rumoSuave + wrap180(fundido - rumoSuave) * 0.26);
      /* A declinação entra só para quem lê norte verdadeiro: o iPhone reporta
         em relação ao geográfico, o Android ao magnético. Aplicar nos dois
         deslocaria a mesa junto e não juntaria ninguém. */
      raw.bearing = wrap360(rumoSuave + northOffset + declMesa);
    } else {
      fonte = abs ? 'bússola (absoluta)' : 'relativa — sem norte verdadeiro';
      raw.bearing = wrap360(v.bearing + northOffset);
    }
    if (!started) started = true;
    if (aoLerCb) aoLerCb(raw, fonte);
  }

  /* ── O PORTÃO DO OITO ────────────────────────────────────────────────────
     Não é "calibrar o norte" (definir aqui = norte): isso congelaria o zero de
     cada um na direção em que estava virado e abriria o grupo em leque. É a
     calibragem do MAGNETÔMETRO, que o sistema faz sozinho quando o aparelho vê
     orientações variadas. O app não consegue disparar isso — só pedir o gesto.

     Não existe API para perguntar se já calibrou. O único jeito honesto que
     vale nas duas plataformas é medir o GESTO. Um oito de verdade deixa três
     marcas que estar parado não deixa: amplitude (o MENOR dos três eixos
     manda — girar o corpo abre a guinada e não abre os outros dois), atitudes
     distintas, e inversões de sentido na guinada, que é o que separa o oito de
     um arco único.

     Medido na Casa: oito rápido abre em ~4 s, oito curto e lento em ~8 s.
     Parado na mão para em 4%, andando devagar em 13%, só girando o corpo 36%. */
  var oitoGen = 0;
  function oitoNoAr(el, barra, bt, rotuloFim, depois) {
    var gen = ++oitoGen;   /* reabrir mata o laço velho: dois ticks disputando
                              a mesma barra é o defeito clássico daqui */
    el.classList.add('on');
    bt.disabled = true;
    bt.textContent = 'A bússola ainda está tonta';
    bt.onclick = function () { el.classList.remove('on'); depois(); };

    var META_GUINADA = 40, META_ELEV = 20, META_ROLL = 45,
        META_ATITUDES = 14, META_VOLTAS = 4;
    var visto = {}, atitudes = 0, voltas = 0;
    var ant = null, sentido = 0, acum = 0, gira = 0, primeiro = true;
    var mnG = 0, mxG = 0, mnE = 0, mxE = 0, mnR = 0, mxR = 0;
    var t0 = performance.now(), pMax = 0;

    function amostra() {
      var b = raw.bearing, ee = raw.elev, rr = raw.roll;
      if (ant) {
        var db = wrap180(b - ant.b);
        /* 45° num quadro só é troca de referencial do sensor, não braço */
        if (Math.abs(db) < 45) gira += db;
        acum += db;
        if (Math.abs(acum) > 12) {      /* zona morta: tremer não vira volta */
          var s = acum > 0 ? 1 : -1;
          if (sentido !== 0 && s !== sentido) voltas++;
          sentido = s; acum = 0;
        }
      }
      ant = { b: b };
      if (primeiro) { mnE = mxE = ee; mnR = mxR = rr; primeiro = false; }
      if (gira < mnG) mnG = gira; if (gira > mxG) mxG = gira;
      if (ee < mnE) mnE = ee;     if (ee > mxE) mxE = ee;
      if (rr < mnR) mnR = rr;     if (rr > mxR) mxR = rr;
      var cel = Math.round(gira / 18) + '|' + Math.round(ee / 18) + '|' + Math.round(rr / 18);
      if (!visto[cel]) { visto[cel] = 1; atitudes++; }
    }

    (function tick() {
      if (gen !== oitoGen) return;
      if (started) amostra();
      /* Anistia: passados 20 s as metas afrouxam até 45% ao longo de 15 s. No
         campo, em grupo, ninguém pode ficar preso num portão. Mas parado
         continua parado: com as metas frouxas o telefone imóvel chega a 10%. */
      var seg = (performance.now() - t0) / 1000;
      var af = 1 - 0.55 * clamp((seg - 20) / 15, 0, 1);
      var amp = Math.min((mxG - mnG) / (META_GUINADA * af),
                         (mxE - mnE) / (META_ELEV * af),
                         (mxR - mnR) / (META_ROLL * af));
      var p = 0.40 * clamp(amp, 0, 1)
            + 0.35 * Math.min(1, atitudes / (META_ATITUDES * af))
            + 0.25 * Math.min(1, voltas / (META_VOLTAS * af));
      if (p > pMax) pMax = p;          /* a barra nunca anda para trás */
      barra.style.width = (pMax * 100) + '%';
      if (pMax >= 0.999) {
        barra.style.width = '100%';
        bt.disabled = false;
        bt.textContent = rotuloFim;
        try { navigator.vibrate && navigator.vibrate([12, 50, 22]); } catch (err) {}
        return;                        /* daqui em diante quem manda é o dedo */
      }
      /* A SAÍDA POR TEMPO. A anistia afrouxa as metas, mas ela não salva quem
         não tem sensor NENHUM: sem eventos de orientação, amostra() nunca roda
         e a barra fica em zero para sempre — com o botão desabilitado e a tela
         por cima de tudo. É beco sem saída, a mesma classe de defeito que
         custou caro nas atividades hoje. Passados 25 s o botão libera de
         qualquer jeito: seguir com a bússola torta é pior que seguir, mas
         ficar preso é pior que os dois. */
      if (seg > 25 && bt.disabled) {
        bt.disabled = false;
        bt.textContent = 'Seguir assim mesmo';
      }
      requestAnimationFrame(tick);
    })();
  }

  /* ── A MIRA ──────────────────────────────────────────────────────────────
     Devolve o progresso de 0 a 1 sobre um alvo, com histerese e dreno. Quem
     chama passa o delta do quadro; o teto está aqui e não lá. */
  function Mira(alvo) {
    var p = 0, dentro = false;
    return {
      alvo: alvo,
      progresso: function () { return p; },
      /* quem chama precisa saber a janela que está sendo cobrada, senão o
         texto de orientação diz uma coisa e a barra faz outra */
      tolerancia: tolerancia,
      dentro: function () { return dentro; },
      passo: function (dtSeg, alto, altoEl) {
        var t = tolerancia(alto, altoEl);
        var m = dentro ? CFG.SOLTA : 1;
        var dAz = Math.abs(wrap180(raw.bearing - alvo.az));
        var dEl = Math.abs(raw.elev - (alvo.el || 0));
        var dRo = Math.abs(raw.roll);
        dentro = dAz <= t.az * m && dEl <= t.el * m && dRo <= CFG.TOL_ROLL * m;
        var dt = Math.min(CFG.DT_MAX, dtSeg);
        /* Ao sair, o progresso ESCOA — não zera. */
        p = clamp(p + (dentro ? dt / (CFG.HOLD_MS / 1000) : -dt * CFG.DRENO), 0, 1);
        return p;
      },
      zerar: function () { p = 0; dentro = false; },
    };
  }

  /* ── LIGAR ───────────────────────────────────────────────────────────────
     A espera que decide "o sensor não respondeu" só pode começar a correr
     quando há o que esperar: contada desde o carregamento, o iPhone de quem
     demorasse a tocar em "Permitir" caía no modo dedo — e aí a bússola
     recém-concedida era ignorada. 4600 ms porque os segundos do oito não
     podem contar como sensor mudo. */
  function ativar(op) {
    op = op || {};
    aoLerCb = op.aoLer || null;
    var pedirIOS = typeof DeviceOrientationEvent !== 'undefined' &&
      typeof DeviceOrientationEvent.requestPermission === 'function';

    function ouvir() {
      window.addEventListener('deviceorientationabsolute', onOrient, true);
      window.addEventListener('deviceorientation', onOrient, true);
      setTimeout(function () {
        if (!started && op.aoNaoResponder) op.aoNaoResponder();
      }, op.esperaMs || 4600);
      if (op.aoLigar) op.aoLigar();
    }
    if (!pedirIOS) {
      if (typeof DeviceOrientationEvent === 'undefined') {
        if (op.aoIndisponivel) op.aoIndisponivel();
        return;
      }
      ouvir(); return;
    }
    DeviceOrientationEvent.requestPermission().then(function (r) {
      if (r === 'granted') ouvir();
      else if (op.aoNegar) op.aoNegar();
    }).catch(function () { if (op.aoNegar) op.aoNegar(); });
  }

  window.MosaicoBussola = {
    CFG: CFG,
    raw: raw,
    ativar: ativar,
    Mira: Mira,
    oitoNoAr: oitoNoAr,
    instavel: function () { return iOSInstavel; },
    viva: function () { return started; },
    fonte: function () { return fonte; },
    calibrarNorte: function () { northOffset = wrap360(northOffset - raw.bearing); },
    declinacao: function (d) { declMesa = Number(d) || 0; },
    wrap180: wrap180, wrap360: wrap360, clamp: clamp,
  };
})();
