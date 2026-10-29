/* A maquete da Torre de Continuidade — o modelo do designer (torre-de-continuidade-v3,
   10/10/2026), com dezessete níveis: do subsolo (−1) à cobertura (+14), contando o
   andar de escritórios, o 12B, entre o Mirante e a casa de máquinas.

   · Modelo: modelos/torre.glb — o arquivo do designer preparado para o celular
     (texturas em WebP, geometria quantizada e comprimida; ver modelos/preparar-torre.mjs).
   · Gavetas: toque num andar e ele desliza para fora; os outros ficam no lugar.
   · O andar que vira: "Entrar no andar" abre o andar como uma sala. Os andares de cima
     sobem, os de baixo descem, e o escolhido gira um quarto de volta e cresce até
     ocupar a mesa. Lá dentro, os pontos dourados são o que dá para examinar; um toque
     conta o que é, e "Fotografar" manda a foto para o inventário. "Voltar à torre"
     desfaz o giro.
   · O subsolo e a imprensa não têm o interior no modelo (a Central é um bloco; a
     imprensa, uma vedação): o interior desses dois é feito aqui, em código.
   · Andares lacrados (+6, +7 e +9) não abrem: a porta está lacrada na história.
   · RA: o motor comum (lib/ac-ra.js e lib/ac-maquete-ra.js): WebXR no Android,
     8th Wall no iPhone. Sem RA, a maquete fica na tela, com órbita.

   10/10 (tarde, pedido do Mario): os andares não abrem fácil. Só os que o jogo
   passa em `abertos` entram de primeira; os outros mostram a trava (chave, senha
   no teclado ou segredo de cofre: travas.js), e só o jogo sabe a resposta. Dentro,
   as pistas ficam ESCONDIDAS: nada de losango; é preciso tocar no lugar certo.
   Achado o lugar, ele ganha um marcador discreto e "Fotografar". Depois de um tempo
   procurando, acende o botão de dica, que faz brilhar um lugar por instantes.

   Uso (mesa.html): VCMaquete.abrir({andares, eu, itens, rota, digitar, alvo, entrar,
     pontos, abertos, trancas, tem, conferir, achados, aoDestrancar, aoAchar, aoItem,
     aoObjeto, aoAbrirItem, aoAndar, aoEntrar, aoSair, aoPonto, aoFoto}). */
(function (global) {
  'use strict';
 var climaRA=null,vivaT=null;
  var BASE = (function () { var s = document.currentScript && document.currentScript.src; return s ? s.replace(/[^/]*$/, '') : ''; })();
  var LIB = BASE + 'lib/';
  var SCRIPTS = [LIB + 'three.min.js', BASE + 'ra-textos-volume.js?v=volume-20261025-auditoria', BASE + 'ra-clima.js?v=tempestade-20261026', BASE + 'obra-projecao.js?v=tempestade-20261026', BASE + 'torre-viva.js?v=tempestade-20261026', BASE + 'guia-ra.js?v=guia-20261026', LIB + 'GLTFLoader.js', LIB + 'meshopt_decoder.js', LIB + 'OrbitControls.js', LIB + 'ac-ra.js', LIB + 'ac-maquete-ra.js'];
  var MODELO = BASE + 'modelos/torre.glb';

  /* metros do modelo → "1 de pegada" do motor de RA (o lote tem ~97 m: ~1 de pegada, ≈ 42 cm na mesa) */
  var S = 1 / 100, EIXO = { x: 0.74, z: 3.28 }, CHAO = 3.6;
  var ORDEM = ['-1', '0', '+1', '+2', '+3', '+4', '+5', '+6', '+7', '+8', '+9', '+10', '+11', '+12', '+12B', '+13', '+14'];
  function codigo(nome) { var m = /^nivel_(-?\d+)(b?)$/.exec(nome); if (!m) return null; var n = +m[1]; return (n > 0 ? '+' : '') + n + (m[2] ? 'B' : ''); }
  var LACRADO = { '+6': 'Comutação antiga, lacrada desde a reforma: a porta do hall não abre.', '+7': 'Comutação antiga, lacrada desde a reforma: a porta do hall não abre.', '+9': 'Andar em obra: a porta do hall está lacrada; a corta-fogo passa direto.' };

  /* Onde cada peça de capítulo fica (metros do modelo) */
  var LUGAR_ITEM = { c1: ['+4', [3.9, 19.9, 7.9]], c2: ['+1', [-2.0, 10.8, 9.8]], c3: ['+1', [7.1, 10.6, 0.1]], c4: ['+2', [-4.2, 14.6, -0.3]],
    c5: ['-1', [-5.0, 2.6, -5.6]], c6: ['+2', [4.3, 15.0, 1.8]], c7: ['+2', [6.6, 13.8, 2.3]], c8: ['+2', [0.9, 14.6, 1.8]] };

  /* O que dá para examinar dentro de cada andar (metros do modelo). Só o que se vê: nada
     aqui resolve o caso; a história e os registros dizem o resto. */
  var PONTOS = {
    '+12B': [
      { id: 'reuniao', visivel: true, n: 'A sala de reunião de vidro', pos: [6.6, 49.4, 7.6], d: 'A tela grande da sala de vidro ainda repete o selo do Echo. É por uma tela assim que a noite vai chegando: o terminal conta o que acontece na torre, linha por linha. No jogo, é a Narração.' },
      { id: 'mesas', visivel: true, n: 'As mesas do andar', pos: [0.6, 49.1, 4.0], d: 'Três fileiras de mesas, telas em descanso, cadeiras empurradas para trás. O que se fala aqui, todos ouvem. No jogo, é o Grupo: uma fala sua aparece para a mesa inteira.' },
      { id: 'sofa', visivel: true, n: 'O sofá do canto', pos: [-6.1, 48.8, 7.2], d: 'Um sofá coral, longe das mesas, onde dá para falar baixo. No jogo, são as Privadas: só as duas pontas veem a conversa.' },
      { id: 'terminais', visivel: true, n: 'A caixa dos terminais', pos: [5.7, 49.0, -0.1], d: 'Uma caixa aberta com os terminais de anotação já configurados, um para cada lugar da mesa da Sala de Crise. Tudo o que você guarda vai para o Inventário: fotos, cartões e peças.' },
      { id: 'poco12b', n: 'A grade do poço', pos: [-2.7, 49.4, -3.4], d: 'A grade de inspeção do poço de cabos, no hall da corta-fogo, soldada desde a reforma. O lacre de solda está à vista.' }
    ],
    '+12': [
      { id: 'vista', n: 'A vista do Mirante', pos: [0.7, 45.4, 9.6], d: 'Daqui se vê a cidade, a passarela lá embaixo e a Casa de Antenas. A chuva corre pelo vidro em fios grossos.' },
      { id: 'tela-video', n: 'A tela de videochamada', pos: [0.7, 46.6, 3.4], d: 'A tela que liga o Mirante ao conselho, de fora da torre. Está em espera.' },
      { id: 'poltronas', n: 'As poltronas', pos: [0.7, 45.4, 7.8], d: 'Poltronas viradas para a cidade. Numa delas, alguém esqueceu um bilhete dobrado.' }
    ],
    '+2': [
      { id: 'mesa-oval', n: 'A mesa oval', pos: [2.9, 13.6, 7.0], d: 'A mesa da Sala de Crise, onde a noite se reúne. Reflete o painel como água escura.' },
      { id: 'relogio', n: 'O relógio de parede', pos: [4.3, 15.0, 1.8], d: 'O relógio analógico da Sala. Anda atrasado em relação à rede.' },
      { id: 'cortica', n: 'O quadro de cortiça', pos: [0.9, 14.6, 1.8], d: 'Espera os papéis da noite.' },
      { id: 'bancada', n: 'A bancada de validação', pos: [6.9, 13.6, 2.3], d: 'A bancada onde todos repetiram o teste com o cartucho, o cartão de montagem e a ponte de cobre.' },
      { id: 'armario', n: 'O armário de serviço', pos: [-4.2, 14.6, -0.3], d: 'No corredor, ao lado da porta da corta-fogo. Fechado.' },
      { id: 'galeria', n: 'A Galeria de Cabos', pos: [2.4, 14.3, -3.6], d: 'O módulo de redundância e, no fundo, a grade de manutenção do poço.' }
    ],
    '+1': [
      { id: 'fichario', n: 'O fichário de consentimentos', pos: [-2.0, 10.8, 9.8], d: 'Gavetas de fichas por lote, em papel.' },
      { id: 'cofre', n: 'O cofre de índices', pos: [7.1, 10.6, 0.1], d: 'Cofre de combinação no fundo do Arquivo Frio.' },
      { id: 'porta-acustica', n: 'A porta acústica', pos: [-3.5, 11.0, 1.5], d: 'A porta do Arquivo Frio para o hall. Pesada, com vedação de borracha.' },
      { id: 'grade-arq', n: 'A grade do fundo', pos: [-2.0, 11.0, -3.4], d: 'A grade do poço no fundo do Arquivo, com trinco de mola.' }
    ],
    '+4': [
      { id: 'camara', n: 'A Câmara Branca', pos: [-6.9, 20.4, 7.2], d: 'O tambor branco com a cadeira de conexão no centro. O vidro está opaco.' },
      { id: 'escrivaninha', n: 'O gabinete da Presidente', pos: [3.9, 19.9, 7.9], d: 'A escrivaninha do gabinete, ao lado da Câmara.' }
    ],
    '+5': [
      { id: 'painel', n: 'O painel de manutenção', pos: [3.6, 24.0, 5.8], d: 'O painel que comanda o módulo de redundância a distância.' },
      { id: 'radio', n: 'O rádio', pos: [-2.7, 23.5, 9.7], d: 'O rádio ligado à Meteorologista, do lado de fora.' }
    ],
    '+3': [{ id: 'nucleo', n: 'O Núcleo de Servidores', pos: [0.7, 17.0, 4.0], d: 'Fileiras de servidores atrás de vidro fosco. O ar seca os olhos.' }],
    '+8': [{ id: 'credenciamento', n: 'O credenciamento', pos: [3.94, 32.95, 8.08], d: 'O balcão de credenciais da imprensa e a porta magnética da sala, sem janela.' }],
    '+10': [{ id: 'fitas', n: 'O arquivo de fitas', pos: [0.7, 39.0, 4.0], d: 'Estantes de fitas magnéticas de consentimentos antigos. O leitor de cartão fica na porta.' }],
    '+11': [{ id: 'quartos', n: 'Os quartos de hóspedes', pos: [0.7, 42.0, 4.0], d: 'Quartos pequenos, camas feitas, cortinas petróleo.' }],
    '+13': [{ id: 'maquinas', n: 'A casa de máquinas', pos: [-0.8, 52.6, 3.8], d: 'O motor e as polias do elevador, a caixa-d’água e o quadro de comando.' }],
    '+14': [{ id: 'heliponto', n: 'O heliponto', pos: [0.7, 57.4, 0.6], d: 'A pista sob a luz vermelha, com o helicóptero travado pelo vento.' }],
    '0': [{ id: 'atrio', n: 'O Átrio de Vidro', pos: [0.7, 5.4, 9.0], d: 'As catracas biométricas, a parede de chuva e, ao fundo, a escada principal.' }],
    '-1': [
      { id: 'distribuidor', n: 'O distribuidor', pos: [-6.4, 2.6, -2.5], d: 'As fileiras de cobre da antiga central, sob uma redoma de poeira.' },
      { id: 'quadro', n: 'O quadro elétrico', pos: [-5.0, 2.4, -5.9], d: 'O quadro do subsolo, com cabos de quatro cores.' },
      { id: 'alcapao', n: 'O alçapão', pos: [-2.7, 3.1, -3.4], d: 'O alçapão do poço de cabos, no teto da Central, com trinco de mola.' },
      { id: 'baterias', n: 'O banco de baterias', pos: [3.3, 1.6, -6.4], d: 'As baterias que seguraram a torre no apagão.' }
    ]
  };

  /* Os achados do Arquivo Dragon Games (pedido do Mario, 10/10): dois quadros do rosto, a placa
     de bronze do Átrio e o bonequinho da estante. Posições no espaço do modelo, como os PONTOS;
     "face" é para onde o quadro olha. Não fazem parte do caso: estão na torre, não na noite. */
  var ENFEITES = {
    '+12B': [{ tipo: 'quadro', img: 'criador-retrato.webp', pos: [-4.15, 48.55, -0.53], larg: 0.95, alt: 1.19, face: 'z' }],
    '+12': [{ tipo: 'quadro', img: 'criador-retrato.webp', pos: [-2.31, 45.45, 1.08], larg: 0.95, alt: 1.19, face: '-x' }],
    '0': [{ tipo: 'placa', img: 'medalhao.webp', pos: [-1.5, 3.66, 0.6], larg: 1.7, face: 'chao' }],
    '+10': [{ tipo: 'boneco', img: 'criador-boneco.webp', pos: [6.34, 40.0, 2.88], alt: 0.92 }]
  };
  var pronto = null, el = null, renderer, cena, camera, controles, raiz, modelo, ra = null, opcoes = {}, ativo = false;
  var M = null, andares = {}, extras = [], lote = null, aberta = null, dentro = null, anim = null, pinos = [], pontosG = null, rotaG = null, euG = null, relogio = 0, tocando = null, pontoAtual = null;

  function carregarScript(src) { return new Promise(function (ok, falha) { if (document.querySelector('script[data-maq="' + src + '"]')) return ok(); var s = document.createElement('script'); s.src = src; s.async = false; s.setAttribute('data-maq', src); s.onload = function () { ok(); }; s.onerror = function () { falha(Error('Não carregou ' + src)); }; document.head.appendChild(s); }); }
  function carregarTudo() {
    if (pronto) return pronto; var cadeia = Promise.resolve();
    SCRIPTS.forEach(function (s) { cadeia = cadeia.then(function () { if (/three\.min/.test(s) && global.THREE) return; return carregarScript(s); }); });
    pronto = cadeia.then(montar); pronto.catch(function () { pronto = null; }); return pronto;
  }

  /* ── tela ── */
  function criarTela() {
    el = document.createElement('div'); el.id = 'telaMaquete'; el.className = 'tela-maq'; el.hidden = true;
    el.innerHTML = '<div class="maq-palco" id="maqPalco"></div>' +
      '<div class="maq-topo"><button type="button" class="sair-ra" id="maqSair">‹ Voltar</button><div class="maq-tit"><b id="maqTitulo">A maquete · Torre de Continuidade</b><span id="maqDica">Arraste para girar. Toque num andar: ele sai como uma gaveta.</span></div></div>' +
      '<div class="maq-ferr"><button type="button" id="maqTorre" hidden>‹ Voltar à torre</button><button type="button" id="maqDicaBtn" hidden>🔍 Dica</button><button type="button" id="maqFechar">Guardar as gavetas</button><button type="button" id="maqRA" hidden>Pôr na mesa (RA)</button><button type="button" id="maqPousar" hidden>Pousar aqui</button></div>' +
      '<div class="planta-card maq-card"><small id="maqRot">A MAQUETE</small><p id="maqTxt">Toque num andar para ver o que há nele.</p><div id="maqAcao"></div></div>' +
      '<div class="maq-carregando" id="maqCarregando">Montando a maquete…</div>';
    document.body.appendChild(el);
    var css = document.createElement('style');
    css.textContent = '.maq-ovo{display:block;float:left;width:76px;height:auto;max-height:96px;object-fit:contain;margin:2px 12px 6px 0;border-radius:6px;box-shadow:0 0 0 1px #c9a06166,0 6px 14px #0008}.tela-maq{position:fixed;inset:0;z-index:86;background:radial-gradient(120% 80% at 50% 30%,#0d2330,#071219 60%,#03080c);display:flex;flex-direction:column;touch-action:none}.tela-maq[hidden]{display:none}' +
      '.maq-palco{position:absolute;inset:0}.maq-palco canvas{display:block;width:100%;height:100%;touch-action:none}' +
      '.maq-topo{position:relative;z-index:3;display:flex;gap:10px;align-items:flex-start;padding:calc(env(safe-area-inset-top) + 10px) 10px 8px;background:linear-gradient(#071219f0,#07121900);pointer-events:none}.maq-topo>*{pointer-events:auto}' +
      '.maq-topo .sair-ra{position:static;flex:0 0 auto;min-height:42px;padding:0 14px;border-radius:10px;border:1px solid #46667a;border-bottom:3px solid #020609;background:linear-gradient(180deg,#14303e,#0c1b26);color:#efc878;font:700 13px var(--sans,system-ui);cursor:pointer;box-shadow:inset 0 2px 0 #ffffff14,inset 0 -3px 6px #02070baa,0 4px 0 #020609,0 8px 14px #0008}' +
      '.maq-topo .sair-ra:active,.maq-ferr button:active,.maq-card .acao:active{transform:translateY(3px);box-shadow:inset 0 2px 0 #ffffff10,0 1px 0 #020609}' +
      '.maq-tit{display:flex;flex-direction:column;font:500 12.5px/1.45 var(--termfont,monospace);color:var(--term,#86e1ea)}.maq-tit b{color:#efc878;font:600 18px/1.2 var(--display,Georgia,serif);text-shadow:0 2px 0 #000a}' +
      '.maq-ferr{position:relative;z-index:3;display:flex;flex-wrap:wrap;gap:8px;padding:0 10px;margin-top:auto;justify-content:center}' +
      '.maq-ferr button{min-height:44px;padding:0 15px;border-radius:22px;border:1px solid #46667a;border-bottom:3px solid #020609;background:linear-gradient(180deg,#14303e,#0c1b26);color:#efc878;font:700 12.5px var(--sans,system-ui);cursor:pointer;box-shadow:inset 0 2px 0 #ffffff14,inset 0 -3px 6px #02070baa,0 4px 0 #020609,0 8px 14px #0008}.maq-ferr button[hidden]{display:none}' +
      '.maq-ferr #maqRA,.maq-ferr #maqPousar{background:linear-gradient(180deg,#f3d078,#e0b13a);color:#1a1206;border-color:#d6aa58;border-bottom-color:#5a4310;box-shadow:inset 0 2px 0 #fff6,0 4px 0 #5a4310,0 8px 14px #0008}' +
      '.maq-card{position:relative;z-index:3;margin:8px 10px calc(env(safe-area-inset-bottom) + 10px)!important;max-height:30vh;overflow:auto}' +
      '.maq-card .acao{display:block;margin-top:9px;width:100%;min-height:44px;border-radius:10px;border:1px solid #d6aa58;border-bottom:3px solid #5a4310;background:linear-gradient(180deg,#f3d078,#e0b13a);color:#1a1206;font:700 12.5px var(--termfont,monospace);cursor:pointer;box-shadow:inset 0 2px 0 #fff6,0 4px 0 #5a4310,0 8px 14px #0007}' +
      '.maq-card .acao.sec{background:linear-gradient(180deg,#14303e,#0c1b26);color:#efc878;border-color:#46667a;border-bottom-color:#020609;box-shadow:inset 0 2px 0 #ffffff14,0 4px 0 #020609}' +
      '.maq-carregando{position:absolute;z-index:4;left:50%;top:45%;transform:translate(-50%,-50%);padding:12px 18px;border-radius:10px;background:#071318e6;border:1px solid #2b6470;border-bottom:3px solid #020609;color:#a6eef5;font:500 13px var(--termfont,monospace);box-shadow:0 8px 18px #0009}.maq-carregando[hidden]{display:none}' +
      'body.in-ar{background:transparent!important}body.in-ar>*:not(#telaMaquete){visibility:hidden!important}body.in-ar .tela-maq{background:transparent}body.ra-webxr .maq-palco canvas{visibility:hidden}';
    document.head.appendChild(css);
    el.querySelector('#maqSair').onclick = function () { fechar(); };
    el.querySelector('#maqFechar').onclick = function () { abrirGaveta(null); cartao('A MAQUETE', 'Toque num andar para ver o que há nele.'); };
    el.querySelector('#maqTorre').onclick = function () { sairDoAndar(); };
    el.querySelector('#maqDicaBtn').onclick = function () { darDica(); };
    el.querySelector('#maqRA').onclick = entrarRA; el.querySelector('#maqPousar').onclick = pousar;
  }
  function cartao(rot, txt, acoes) {
    el.querySelector('#maqRot').textContent = rot; var p = el.querySelector('#maqTxt');
    if (opcoes.digitar) { p.innerHTML = ''; opcoes.digitar(p, txt); } else p.innerHTML = txt;
    var a = el.querySelector('#maqAcao'); a.innerHTML = '';
    (acoes || []).forEach(function (x, i) { if (!x) return; var b = document.createElement('button'); b.className = 'acao' + (x[2] ? ' sec' : ''); b.type = 'button'; b.textContent = x[0]; b.setAttribute('data-maq-acao', i); b.onclick = x[1]; a.appendChild(b); });
  }
  function dica(t) { el.querySelector('#maqDica').textContent = t; }
  function nomeAndar(a) { var A = (opcoes.andares || []).filter(function (x) { return x.a === a; })[0]; return A ? A.nome : a; }
  function infoAndar(a) { var A = (opcoes.andares || []).filter(function (x) { return x.a === a; })[0]; return A ? A.salas.map(function (s) { return '<b>' + s.n + '.</b> ' + s.d; }).join('<br>') : ''; }

  /* ── o modelo ── */
  function noAndar(A, x, y, z) { return new global.THREE.Vector3(x - M.x - A.base.x, y - M.y - A.base.y, z - M.z - A.base.z); }
  function local(p) { return new global.THREE.Vector3((p[0] - EIXO.x) * S, (p[1] - CHAO) * S, (p[2] - EIXO.z) * S); }
  function montar() {
    var THREE = global.THREE, palco = el.querySelector('#maqPalco');
    cena = new THREE.Scene(); cena.background = null;
    camera = new THREE.PerspectiveCamera(38, 1, 0.005, 40); cena.add(camera);
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: false });
    renderer.setPixelRatio(Math.min(global.devicePixelRatio || 1, 1.75)); renderer.outputEncoding = THREE.sRGBEncoding; renderer.xr.enabled = true;
    renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
    palco.appendChild(renderer.domElement);
    /* noite de tempestade: céu frio, o âmbar da obra e o ciano do Echo */
    cena.add(new THREE.HemisphereLight(0xb9d3e6, 0x1a2328, 1.0));
    var lua = new THREE.DirectionalLight(0xe8f2fa, 1.1); lua.position.set(-0.8, 1.6, 1.0); cena.add(lua);
    var contra = new THREE.DirectionalLight(0x3fb6c4, 0.35); contra.position.set(1, 0.6, -1.2); cena.add(contra);
    raiz = new THREE.Group(); raiz.name = 'raiz-torre'; cena.add(raiz);
    return new Promise(function (ok, falha) {
      var L = new THREE.GLTFLoader(); if (global.MeshoptDecoder) L.setMeshoptDecoder(global.MeshoptDecoder);
      L.load(MODELO, function (g) { try { preparar(g.scene); ok(); } catch (e) { falha(e); } }, undefined, function (e) { falha(Error('Não carregou a maquete' + (e && e.message ? ': ' + e.message : ''))); });
    }).then(function () {
      controles = new THREE.OrbitControls(camera, renderer.domElement); controles.enableDamping = true; controles.dampingFactor = 0.08; controles.minDistance = 0.12; controles.maxDistance = 3.2; controles.maxPolarAngle = Math.PI * 0.53;
      enquadrar();
      if (global.ACMaquetteRA) { try { ra = global.ACMaquetteRA.criar({ renderer: renderer, cena: cena, camera: camera, raiz: raiz, baseY: 0, aoMudar: atualizarBotoes, desenhar: desenhar, aoTocar: function (x, y) { tocar(x, y); } }); ra.modosPossiveis(function (m) { el.querySelector('#maqRA').hidden = !m.ra; }); } catch (e) { ra = null; } }
      ligarToques(); gestosRA(); redimensionar(); global.addEventListener('resize', redimensionar);
    });
  }
  function preparar(cenaG) {
    var THREE = global.THREE;
    modelo = new THREE.Group(); modelo.scale.setScalar(S); modelo.position.set(-EIXO.x * S, -CHAO * S, -EIXO.z * S); raiz.add(modelo);
    modelo.add(cenaG); cenaG.updateMatrixWorld(true);
    /* luzes que o designer acendeu (emissive_strength não existe nesta versão do three: aplica à mão) */
    cenaG.traverse(function (o) {
      if (!o.isMesh) return; o.frustumCulled = true;
      var m = o.material; if (m && m.userData && m.userData.gltfExtensions && m.userData.gltfExtensions.KHR_materials_emissive_strength) m.emissiveIntensity = m.userData.gltfExtensions.KHR_materials_emissive_strength.emissiveStrength || 1;
    });
    var torre = cenaG.getObjectByName('torre'); lote = cenaG.getObjectByName('lote');
    /* a torre vem deslocada dentro do modelo (o nó "maquete"): as posições deste arquivo estão no espaço do modelo; dentro de um andar, desconta-se esse deslocamento */
    M = modelo.worldToLocal(torre.getWorldPosition(new THREE.Vector3()));
    /* cada andar ganha um pivô no próprio centro: é em torno dele que a gaveta desliza e o andar gira */
    torre.children.slice().forEach(function (n) {
      var a = codigo(n.name);
      if (!a) { extras.push(n); return; }
      var b = new THREE.Box3().setFromObject(n), c = b.getCenter(new THREE.Vector3()), piv = new THREE.Group();
      var cl = modelo.worldToLocal(c.clone()); /* centro no espaço do modelo (metros) */
      piv.position.copy(cl); piv.name = 'piv_' + a; piv.userData.andar = a; torre.add(piv);
      piv.add(n); n.position.sub(cl);
      var peles = []; n.traverse(function (o) { o.userData.andar = a; if (o.isMesh && /pele$/.test(o.name)) peles.push(o); });
      andares[a] = { a: a, piv: piv, no: n, base: cl.clone(), peles: peles, alvo: { x: 0, y: 0, z: 0, gir: 0, esc: 1 }, at: { x: 0, y: 0, z: 0, gir: 0, esc: 1 }, interior: null };
    });
    extras.forEach(function (n) { n.traverse(function (o) { o.userData.circ = n.name; }); });
    if (lote) lote.traverse(function (o) { o.userData.lote = true; });
    interiorSubsolo(); interiorImprensa(); enfeites(); interioresDoModelo();
  }

  /* ── os interiores do designer (11/10/2026): int-subsolo-central-energia.glb e int-sala-de-imprensa.glb.
     Entram no lugar dos feitos em código (que ficam de reserva enquanto carregam, ou se falharem).
     O subsolo vem no referencial da torre (o poço em −2,7; −3,4, como nos outros andares); a imprensa,
     centrada na sala: vai para o eixo da coluna do +8. ── */
  var INTERIORES = { '-1': ['modelos/int-subsolo-central-energia.glb', [0, 0, 0]], '+8': ['modelos/int-sala-de-imprensa.glb', [EIXO.x, 31.45, EIXO.z]] };
  function telasImprensa(g) {
    var THREE = global.THREE, no = g.getObjectByName('telas_area_texto'); if (!no) return; var malha = null; no.traverse(function (o) { if (!malha && o.isMesh) malha = o; }); if (!malha) return;
    var c = document.createElement('canvas'); c.width = 1024; c.height = 96; var x = c.getContext('2d'); x.fillStyle = '#06121a'; x.fillRect(0, 0, 1024, 96);
    x.fillStyle = '#86e1ea'; x.font = '700 34px "DM Mono",monospace'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('VESTCHIP · TRANSMISSÃO DAS 06H00 · EM ESPERA', 512, 50);
    var tx = new THREE.CanvasTexture(c); tx.encoding = THREE.sRGBEncoding; malha.material = new THREE.MeshBasicMaterial({ map: tx, toneMapped: false });
  }
  function interioresDoModelo() {
    if (/[?&]sem3d=1/.test(global.location.search)) return;
    Object.keys(INTERIORES).forEach(function (a) {
      var A = andares[a], I = INTERIORES[a]; if (!A || !A.interior) return;
      try {
        var L = new global.THREE.GLTFLoader(); if (global.MeshoptDecoder) L.setMeshoptDecoder(global.MeshoptDecoder);
        L.load(BASE + I[0], function (gl) {
          var g = gl.scene; g.name = 'interior-modelo'; g.position.set(I[1][0], I[1][1], I[1][2]);
          g.traverse(function (o) {
            o.userData.andar = a;
            if (o.isLight) { o.intensity = Math.min(o.intensity, 1.2); if (o.distance === 0 || o.distance > 14) o.distance = 14; }
            if (!o.isMesh) return; o.frustumCulled = true;
            var m = o.material; if (m && m.userData && m.userData.gltfExtensions && m.userData.gltfExtensions.KHR_materials_emissive_strength) m.emissiveIntensity = m.userData.gltfExtensions.KHR_materials_emissive_strength.emissiveStrength || 1;
          });
          /* o teto sai: o andar é visto de cima, como uma maquete aberta */
          g.traverse(function (o) { if (/^teto/.test(o.name)) o.visible = false; });
          if (a === '+8') telasImprensa(g);
          A.interior.children.slice().forEach(function (c) { A.interior.remove(c); });
          A.interior.add(g);
        }, undefined, function () { /* fica o interior feito em código */ });
      } catch (e) { /* idem */ }
    });
  }

  /* ── interiores feitos aqui (o modelo não tem) ── */
  function mat(cor, o) { var THREE = global.THREE, x = Object.assign({ color: cor, roughness: 0.7, metalness: 0.1 }, o || {}); return new THREE.MeshStandardMaterial(x); }
  function bloco(g, w, h, d, m, x, y, z) { var THREE = global.THREE, b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); b.position.set(x, y + h / 2, z); g.add(b); return b; }
  function interiorSubsolo() {
    var A = andares['-1']; if (!A) return; var THREE = global.THREE, g = new THREE.Group(), o = A.base;
    g.position.set(-M.x, -M.y, -M.z); g.visible = false; A.no.add(g); A.interior = g;
    var piso = mat(0x2a3036, { roughness: 0.9 }), parede = mat(0x4a3a30, { roughness: 0.95 }), cobre = mat(0xd9864a, { metalness: 0.55, roughness: 0.35, emissive: 0x3a1a08, emissiveIntensity: 0.6 }), escuro = mat(0x14191d), vidro = mat(0xc9dde6, { transparent: true, opacity: 0.1, roughness: 0.1, depthWrite: false });
    bloco(g, 16, 0.12, 15, piso, 0.7, 0, 3.3); bloco(g, 16, 3.1, 0.2, parede, 0.7, 0.12, -4.2); bloco(g, 0.2, 3.1, 15, parede, -7.2, 0.12, 3.3);
    /* o distribuidor: fileiras de cobre sob a redoma */
    for (var i = 0; i < 4; i++) { bloco(g, 0.35, 2.0, 5.5, escuro, -5 + i * 1.3, 0.12, 2); for (var k = 0; k < 9; k++) bloco(g, 0.38, 0.06, 5.2, cobre, -5 + i * 1.3, 0.35 + k * 0.2, 2); }
    var redoma = new THREE.Mesh(new THREE.CylinderGeometry(3.3, 3.3, 2.6, 24, 1, true, 0, Math.PI), vidro); redoma.rotation.z = Math.PI / 2; redoma.rotation.y = Math.PI / 2; redoma.position.set(-3.05, 0.12, 2); g.add(redoma);
    /* o quadro elétrico, com cabos de quatro cores */
    bloco(g, 1.6, 2.2, 0.5, mat(0x5a6670, { metalness: 0.5 }), 6.2, 0.12, -3.85);
    [0x5f9cff, 0xff7b6e, 0xffd060, 0x5fd68a].forEach(function (c, j) { bloco(g, 0.08, 1.2, 0.08, mat(c, { emissive: c, emissiveIntensity: 0.25 }), 5.7 + j * 0.32, 1.0, -3.5); });
    /* o alçapão no teto, junto do poço */
    bloco(g, 1.3, 0.08, 1.3, mat(0x7a5a2a, { metalness: 0.6 }), -2.7, 3.05, -3.4);
    bloco(g, 0.1, 3.0, 0.1, mat(0x8a8f94, { metalness: 0.8 }), -2.3, 0.12, -3.4); bloco(g, 0.1, 3.0, 0.1, mat(0x8a8f94, { metalness: 0.8 }), -3.1, 0.12, -3.4);
    for (var d = 0; d < 9; d++) bloco(g, 0.9, 0.05, 0.05, mat(0x8a8f94, { metalness: 0.8 }), -2.7, 0.4 + d * 0.32, -3.4);
    /* o banco de baterias */
    for (var b = 0; b < 3; b++) for (var c2 = 0; c2 < 2; c2++) bloco(g, 0.9, 1.0, 0.6, mat(0x1d2a33), 7.2 + c2 * 1.0, 0.12, 4 + b * 0.8);
    bloco(g, 0.06, 0.06, 2.4, mat(0x3fb6c4, { emissive: 0x3fb6c4, emissiveIntensity: 0.8 }), 6.7, 1.3, 4.8);
    /* luz de emergência */
    var l = new THREE.PointLight(0xffb070, 0.6, 14); l.position.set(0.7, 2.8, 2); g.add(l);
  }
  function enfeites() {
    var THREE = global.THREE, L = new THREE.TextureLoader();
    Object.keys(ENFEITES).forEach(function (a) {
      var A = andares[a]; if (!A) return; var g = new THREE.Group(); g.position.set(-M.x, -M.y, -M.z); A.no.add(g);
      ENFEITES[a].forEach(function (E) {
        var tx = L.load(BASE + 'media/' + E.img); tx.encoding = THREE.sRGBEncoding; tx.anisotropy = 4;
        var e = new THREE.Group(); e.position.set(E.pos[0], E.pos[1], E.pos[2]); if (E.face === 'chao') e.rotation.x = -Math.PI / 2; else e.rotation.y = { z: 0, x: Math.PI / 2, '-z': Math.PI, '-x': -Math.PI / 2 }[E.face || 'z'];
        if (E.tipo === 'quadro') {
          var mold = new THREE.Mesh(new THREE.BoxGeometry(E.larg + 0.14, E.alt + 0.14, 0.06), mat(0x2b2118, { metalness: 0.35, roughness: 0.5 })); mold.position.z = 0.03; e.add(mold);
          var fil = new THREE.Mesh(new THREE.BoxGeometry(E.larg + 0.04, E.alt + 0.04, 0.065), mat(0xc9a061, { metalness: 0.8, roughness: 0.3 })); fil.position.z = 0.032; e.add(fil);
          var tela = new THREE.Mesh(new THREE.PlaneGeometry(E.larg, E.alt), new THREE.MeshStandardMaterial({ map: tx, roughness: 0.55, emissive: 0xffffff, emissiveMap: tx, emissiveIntensity: 0.25 })); tela.position.z = 0.067; e.add(tela);
        } else if (E.tipo === 'placa') {
          var aro = new THREE.Mesh(new THREE.CylinderGeometry(E.larg / 2 + 0.05, E.larg / 2 + 0.05, 0.06, 40), mat(0x6b4a22, { metalness: 0.85, roughness: 0.35 })); aro.rotation.x = Math.PI / 2; aro.position.z = 0.03; e.add(aro);
          var face = new THREE.Mesh(new THREE.CircleGeometry(E.larg / 2, 48), new THREE.MeshStandardMaterial({ map: tx, transparent: true, metalness: 0.4, roughness: 0.45, emissive: 0xffffff, emissiveMap: tx, emissiveIntensity: 0.2 })); face.position.z = 0.062; e.add(face);
        } else if (E.tipo === 'boneco') {
          var sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tx, transparent: true, alphaTest: 0.25 })); sp.scale.set(E.alt * 0.65, E.alt, 1); sp.position.y = E.alt / 2; e.add(sp);
          var pe = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.19, 0.04, 20), mat(0x1d2a33, { metalness: 0.4 })); pe.position.y = 0.02; e.add(pe);
        }
        e.traverse(function (o) { o.userData.andar = a; o.userData.enfeite = true; });
        g.add(e);
      });
    });
  }
  function interiorImprensa() {
    var A = andares['+8']; if (!A) return; var THREE = global.THREE, g = new THREE.Group(), o = A.base;
    g.position.set(-M.x, -M.y, -M.z); g.visible = false; A.no.add(g); A.interior = g;
    var y = 31.5, mesa = mat(0xe8ecef), cad = mat(0x1f4a55), tela = mat(0x0a1a22, { emissive: 0x3fb6c4, emissiveIntensity: 0.45 });
    for (var r = 0; r < 2; r++) for (var i = 0; i < 4; i++) { bloco(g, 1.6, 0.06, 0.8, mesa, -2.5 + i * 2.1, y + 0.72, 5.5 + r * 2.6); bloco(g, 0.5, 0.3, 0.04, tela, -2.5 + i * 2.1, y + 0.8, 5.25 + r * 2.6); bloco(g, 0.5, 0.45, 0.5, cad, -2.5 + i * 2.1, y, 6.2 + r * 2.6); }
    var l = new THREE.PointLight(0xdfefff, 0.5, 12); l.position.set(0.7, y + 2.6, 6); g.add(l);
  }

  function fator() { var a = camera ? camera.aspect : 1; return a < 0.8 ? Math.min(2.2, 0.8 / a) : 1; }
  function vistaFora() { var f = fator(); return [[0.95 * f, 0.30 + 0.48 * f, 1.55 * f], [0, 0.30, 0]]; }
  function vistaDentro() { var f = Math.sqrt(fator()); return [[0.55 * f, 0.06 + 0.62 * f, 0.72 * f], [0, 0.04, 0]]; }
  function enquadrar() { var v = vistaFora(); controles.target.set(v[1][0], v[1][1], v[1][2]); camera.position.set(v[0][0], v[0][1], v[0][2]); controles.minDistance = 0.12; controles.maxDistance = 4.5; controles.update(); }
  function redimensionar() { if (!renderer || !el || el.hidden) return; var w = global.innerWidth, h = global.innerHeight; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); }

  /* ── marcadores: peças, você, rota, pontos ── */
  function losango(cor, tam) {
    var THREE = global.THREE, g = new THREE.Group();
    var l = new THREE.Mesh(new THREE.OctahedronGeometry(tam, 0), new THREE.MeshBasicMaterial({ color: cor, toneMapped: false, depthTest: false, transparent: true, opacity: 0.95 })); l.scale.set(1, 1.5, 1); l.renderOrder = 40;
    var anel = new THREE.Mesh(new THREE.TorusGeometry(tam * 1.6, tam * 0.18, 6, 28), new THREE.MeshBasicMaterial({ color: cor, toneMapped: false, depthTest: false, transparent: true, opacity: 0.55 })); anel.rotation.x = Math.PI / 2; anel.renderOrder = 40;
    var alvo = new THREE.Mesh(new THREE.SphereGeometry(tam * 3, 8, 6), new THREE.MeshBasicMaterial({ visible: false }));
    g.add(l, anel, alvo); return g;
  }
  function aplicar() {
    var THREE = global.THREE;
    pinos.forEach(function (p) { p.parent && p.parent.remove(p); }); pinos = [];
    (opcoes.itens || []).forEach(function (it) {
      var L = LUGAR_ITEM[it.id]; if (!L || !andares[L[0]]) return; var A = andares[L[0]];
      var g = losango(0xffb21f, 0.55); g.traverse(function (o) { o.userData.item = it.id; o.userData.andar = A.a; });
      g.position.copy(noAndar(A, L[1][0], L[1][1] + 0.6, L[1][2])); A.piv.add(g); pinos.push(g);
    });
    if (euG) { euG.parent && euG.parent.remove(euG); euG = null; }
    if (opcoes.eu && andares[opcoes.eu.andar]) {
      var A2 = andares[opcoes.eu.andar];
      euG = new THREE.Mesh(new THREE.TorusGeometry(10.5, 0.28, 8, 48), new THREE.MeshBasicMaterial({ color: 0xefc878, toneMapped: false })); euG.rotation.x = Math.PI / 2; euG.position.set(EIXO.x, A2.base.y - 1.3, EIXO.z).sub(A2.base); euG.raycast = function () {}; A2.piv.add(euG);
    }
    if (rotaG) { rotaG.parent && rotaG.parent.remove(rotaG); rotaG = null; }
    if (opcoes.rota) {
      var pts = [[-4.2, 13.4, -0.3], [-2.0, 13.4, -3.4], [-2.7, 13.4, -3.4], [-2.7, 10.4, -3.4], [-2.0, 10.4, -3.4], [-2.7, 10.4, -3.4], [-2.7, 1.6, -3.4], [6.2, 1.6, -3.6]].map(function (q) { return new THREE.Vector3(q[0], q[1], q[2]); });
      rotaG = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: 0xefc878, depthTest: false, toneMapped: false })); rotaG.renderOrder = 30; rotaG.raycast = function () {};
      modelo.children[0].add(rotaG);
    }
  }
  function mostrarPontos(a) {
    if (pontosG) { pontosG.parent && pontosG.parent.remove(pontosG); pontosG = null; }
    if (!a) return; var A = andares[a], THREE = global.THREE; pontosG = new THREE.Group(); A.piv.add(pontosG);
    pontosDe(a).forEach(function (p) {
      if (!visivelP(a, p)) return;
      var g = losango(achadoP(a, p) && !p.visivel ? 0xb9a27a : 0x86e1ea, p.visivel ? 0.32 : 0.22); g.traverse(function (o) { o.userData.ponto = p.id; o.userData.andar = a; }); g.position.copy(noAndar(A, p.pos[0], p.pos[1], p.pos[2])); pontosG.add(g);
    });
  }
  function visivelP(a, p) { return !!p.visivel || achadoP(a, p); }
  function achadoP(a, p) { return !!(opcoes.achados && opcoes.achados[a + ':' + p.id]); }
  function escondidosDe(a) { return pontosDe(a).filter(function (p) { return !visivelP(a, p); }); }
  function trancado(a) { return !LACRADO[a] && !!(opcoes.trancas && opcoes.trancas[a]) && !(opcoes.abertos && opcoes.abertos[a]); }
  function pontosDe(a) { var extra = (opcoes.pontos && opcoes.pontos[a]) || []; return (PONTOS[a] || []).concat(extra); }

  /* ── gavetas e o andar que vira ── */
  function abrirGaveta(a) {
    if (dentro) return; aberta = a;
    var dir = ladoDaCamera();
    Object.keys(andares).forEach(function (k) { var A = andares[k]; A.alvo.x = k === a ? dir.x * 12 : 0; A.alvo.z = k === a ? dir.z * 12 : 0; A.alvo.y = 0; A.alvo.gir = 0; A.alvo.esc = 1; });
    moldura(a);
  }
  var molduraG = null;
  function moldura(a) {
    var THREE = global.THREE;
    if (molduraG) { molduraG.parent && molduraG.parent.remove(molduraG); molduraG = null; }
    if (!a || !andares[a]) return; var A = andares[a];
    molduraG = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(16, 3.4, 16)), new THREE.LineBasicMaterial({ color: 0xefc878, toneMapped: false, transparent: true, opacity: 0.95, depthTest: false }));
    molduraG.renderOrder = 35; molduraG.raycast = function () {}; A.piv.add(molduraG);
  }
  function ladoDaCamera() { var THREE = global.THREE, c = ra ? ra.cameraAtiva() : camera, d = new THREE.Vector3(1, 0, 0).applyQuaternion(c.getWorldQuaternion(new THREE.Quaternion())); var q = raiz.getWorldQuaternion(new THREE.Quaternion()).invert(); d.applyQuaternion(q); if (Math.abs(d.x) > Math.abs(d.z)) return { x: Math.sign(d.x) || 1, z: 0 }; return { x: 0, z: Math.sign(d.z) || 1 }; }
  var ESC_DENTRO = 2.6;
  function entrarNoAndar(a) {
    var A = andares[a]; if (!A || LACRADO[a]) return;
    if (trancado(a)) { if (dentro) sairDoAndar(); abrirGaveta(a); cartaoTrava(a); return; }
    dentro = a; tProcura = 0; aberta = null; moldura(null); var i0 = ORDEM.indexOf(a);
    Object.keys(andares).forEach(function (k) {
      var B = andares[k], i = ORDEM.indexOf(k);
      B.alvo.x = 0; B.alvo.z = 0; B.alvo.gir = 0; B.alvo.esc = 1;
      B.alvo.y = i > i0 ? 120 : i < i0 ? -120 : 0;
    });
    /* o escolhido gira um quarto de volta, cresce e desce até a mesa */
    A.alvo.gir = Math.PI / 2; A.alvo.esc = ESC_DENTRO; A.alvo.y = -(A.base.y - CHAO) + 2.0; A.alvo.x = EIXO.x - A.base.x; A.alvo.z = EIXO.z - A.base.z;
    A.peles.forEach(function (p) { p.visible = false; });
    if (A.interior) { A.interior.visible = true; A.no.traverse(function (o) { if (o.isMesh && (o.name === 'central-de-energia' || /vedacao$/.test(o.name))) o.visible = false; }); }
    A.no.traverse(function (o) { if (o.isMesh && /laje-cobertura|teto-verde/.test(o.name)) { o.visible = false; o.userData.tampa = true; } });
    extras.forEach(function (n) { n.visible = false; }); if (lote) lote.visible = false; if (euG) euG.visible = false; if (rotaG) rotaG.visible = false;
    mostrarPontos(a);
    var vd = vistaDentro(); animarCamera(vd[0], vd[1], { min: 0.18, max: 2.4 });
    el.querySelector('#maqTorre').hidden = false; el.querySelector('#maqFechar').hidden = true;
    el.querySelector('#maqTitulo').textContent = a + ' · ' + nomeAndar(a);
    dica('Gire com um dedo. Toque nos móveis e nos cantos: o que importa não está marcado.');
    var vis = pontosDe(a).filter(function (p) { return p.visivel; }).length, esc = escondidosDe(a).length;
    cartao((a + ' · ' + nomeAndar(a)).toUpperCase(), 'O andar virou para você. ' + (vis ? 'Os pontos ciano são o que dá para examinar. ' : '') + (esc ? 'Há mais coisa aqui do que se vê: toque nos móveis, nas paredes, nos cantos.' : (vis ? '' : 'Nada pede um olhar mais demorado.')) + (pinos.some(function (p) { return p.parent === A.piv; }) ? ' O losango dourado é a peça do capítulo.' : ''));
    if (opcoes.aoEntrar) opcoes.aoEntrar(a);
  }
  function sairDoAndar() {
    if (!dentro) return; var A = andares[dentro], a = dentro; dentro = null; pontoAtual = null;
    Object.keys(andares).forEach(function (k) { var B = andares[k]; B.alvo.x = 0; B.alvo.y = 0; B.alvo.z = 0; B.alvo.gir = 0; B.alvo.esc = 1; });
    A.peles.forEach(function (p) { p.visible = true; });
    if (A.interior) { A.interior.visible = false; A.no.traverse(function (o) { if (o.isMesh && (o.name === 'central-de-energia' || /vedacao$/.test(o.name))) o.visible = true; }); }
    A.no.traverse(function (o) { if (o.userData.tampa) o.visible = true; });
    setTimeout(function () { if (dentro) return; extras.forEach(function (n) { n.visible = true; }); if (lote) lote.visible = true; if (euG) euG.visible = true; if (rotaG) rotaG.visible = true; }, 450);
    mostrarPontos(null);
    var vf = vistaFora(); animarCamera(vf[0], vf[1], { min: 0.12, max: 4.5 });
    el.querySelector('#maqTorre').hidden = true; el.querySelector('#maqFechar').hidden = false; el.querySelector('#maqDicaBtn').hidden = true;
    el.querySelector('#maqTitulo').textContent = 'A maquete · Torre de Continuidade';
    dica('Arraste para girar. Toque num andar: ele sai como uma gaveta.');
    cartao('A MAQUETE', 'De volta à torre. Toque num andar para abrir a gaveta.');
    if (opcoes.aoSair) opcoes.aoSair(a);
  }
  function animarCamera(pos, alvo, lim) {
    if (ra && ra.estado().modo === 'ra') return;
    var THREE = global.THREE; anim = { t: 0, de: camera.position.clone(), para: new THREE.Vector3(pos[0], pos[1], pos[2]), alvoDe: controles.target.clone(), alvoPara: new THREE.Vector3(alvo[0], alvo[1], alvo[2]), lim: lim };
    controles.minDistance = 0.01; controles.maxDistance = 10;
  }

  /* ── toque ── */
  function ligarToques() {
    var c = renderer.domElement;
    c.addEventListener('pointerdown', function (e) { tocando = { x: e.clientX, y: e.clientY, t: performance.now() }; });
    c.addEventListener('pointerup', function (e) { if (!tocando) return; var dx = e.clientX - tocando.x, dy = e.clientY - tocando.y, dt = performance.now() - tocando.t; tocando = null; if (dx * dx + dy * dy > 81 || dt > 600) return; var est = ra && ra.estado(); if (est && est.modo === 'ra' && !est.posta) { pousar(); return; } tocar(e.clientX, e.clientY); });
  }
  function tocar(x, y) {
    var THREE = global.THREE, cam = ra ? ra.cameraAtiva() : camera, r = renderer.domElement.getBoundingClientRect();
    var ray = new THREE.Raycaster(); ray.setFromCamera(new THREE.Vector2(((x - r.left) / r.width) * 2 - 1, -((y - r.top) / r.height) * 2 + 1), cam);
    var alvos = [];
    if (dentro) {
      andares[dentro].piv.traverse(function (o) { if (o.isMesh && (o.userData.ponto || o.userData.item)) alvos.push(o); });
      var hm = ray.intersectObjects(alvos, false); if (hm.length) { var um = hm[0].object.userData; if (um.item) return tocarItem(um.item); return tocarPonto(dentro, um.ponto); }
      return procurarNaTela(dentro, x - r.left, y - r.top, r.width, r.height, cam);
    }
    raiz.traverse(function (o) { if (o.isMesh && o.visible && !o.userData.lote) alvos.push(o); });
    var hits = ray.intersectObjects(alvos, false); if (!hits.length) return;
    var u = hits[0].object.userData;
    if (u.circ && /fachada|frisos|letreiro/.test(u.circ)) { var y = modelo.worldToLocal(hits[0].point.clone()).y, mel = null, md = 1e9; Object.keys(andares).forEach(function (k) { var d = Math.abs(andares[k].base.y - y); if (d < md) { md = d; mel = k; } }); if (mel) return tocarAndar(mel); }
    if (u.item) return tocarItem(u.item);
    if (u.ponto) return tocarPonto(dentro, u.ponto);
    if (u.circ) return tocarCirc(u.circ);
    if (u.andar) return tocarAndar(u.andar);
  }
  function visivelObj(o) { for (var q = o; q; q = q.parent) if (!q.visible) return false; return true; }
  /* procurar: o toque caiu no andar; perto de um lugar escondido, ele aparece */
  /* o toque procura pelo que está perto dele NA TELA: as malhas do modelo vêm quantizadas
     (meshopt) e o raycast do three r128 não as desnormaliza, então o ponto 3D do toque não serve */
  function procurarNaTela(a, x, y, w, h, cam) {
    var A = andares[a], mel = null, md = 1e9, lim = Math.max(46, Math.min(w, h) * 0.11);
    A.piv.updateMatrixWorld(true);
    escondidosDe(a).forEach(function (p) { var v = A.piv.localToWorld(noAndar(A, p.pos[0], p.pos[1], p.pos[2])).project(cam); if (v.z > 1) return; var sx = (v.x + 1) / 2 * w, sy = (1 - v.y) / 2 * h, d = Math.hypot(sx - x, sy - y); if (d < lim * (p.raio || 1) && d < md) { md = d; mel = p; } });
    ultimoQ = mel ? mel.id : null;
    if (!mel) { var frases = ['Nada de especial aqui.', 'Você olha de perto. Nada.', 'Só poeira e fio.', 'Nada fora do lugar, aqui.']; cartao('PROCURANDO', frases[Math.floor(Math.random() * frases.length)]); return; }
    achar(a, mel);
  }
  var ultimoQ = null;
  function procurar(a, q) {
    var mel = null, md = 1e9;
    escondidosDe(a).forEach(function (p) { var dx = p.pos[0] - q.x, dz = p.pos[2] - q.z, dy = Math.abs(p.pos[1] - q.y); var d = Math.sqrt(dx * dx + dz * dz); if (d < (p.raio || 1.5) && dy < 2.6 && d < md) { md = d; mel = p; } });
    if (!mel) { var frases = ['Nada de especial aqui.', 'Você olha de perto. Nada.', 'Só poeira e fio.', 'Nada fora do lugar, aqui.']; cartao('PROCURANDO', frases[Math.floor(Math.random() * frases.length)]); return; }
    achar(a, mel);
  }
  function achar(a, p) {
    if (opcoes.aoAchar) opcoes.aoAchar(a, p);
    if (global.VCTrava) { global.VCTrava.bip(520, 0.08, 'sine', 0.06); setTimeout(function () { global.VCTrava.bip(780, 0.12, 'sine', 0.06); }, 90); }
    mostrarPontos(a); tocarPonto(a, p.id, true);
  }
  var tProcura = 0, brilho = null;
  function darDica() {
    var THREE = global.THREE, a = dentro; if (!a) return; var esc = escondidosDe(a); if (!esc.length) { cartao('DICA', 'Neste andar você já achou o que havia para achar.'); return; }
    var p = esc[Math.floor(Math.random() * esc.length)], A = andares[a];
    if (brilho) brilho.parent && brilho.parent.remove(brilho);
    brilho = new THREE.Mesh(new THREE.SphereGeometry(0.7, 16, 12), new THREE.MeshBasicMaterial({ color: 0xffe9a8, transparent: true, opacity: 0.0, depthTest: false, toneMapped: false })); brilho.renderOrder = 50; brilho.raycast = function () {};
    brilho.position.copy(noAndar(A, p.pos[0], p.pos[1], p.pos[2])); brilho.userData.t = 0; A.piv.add(brilho);
    tProcura = -40; el.querySelector('#maqDicaBtn').hidden = true;
    cartao('DICA', 'Um brilho, por um instante. Toque ali.');
  }
  function cartaoTrava(a) {
    var T = opcoes.trancas[a], acoes = [], txt = '<b style="color:#f0bf8f">Trancado.</b> ' + T.txt;
    if (T.tipo === 'chave') {
      if (opcoes.tem && opcoes.tem(T.chave)) acoes.push(['Usar ' + ((opcoes.nomeChave && opcoes.nomeChave[T.chave]) || 'a chave') + ' ›', function () { if (opcoes.conferir(a)) abrirTrava(a); }]);
      else txt += '<br><i>Você ainda não tem com que abrir. Procure pela torre.</i>';
    }
    if (T.tipo === 'pin') acoes.push(['Digitar a senha ›', function () { teclado = global.VCTrava.teclado({ rot: 'PORTA · ' + a, txt: T.txt, digitos: 4, conferir: function (v) { return opcoes.conferir(a, v); }, aoAbrir: function () { abrirTrava(a); } }); }]);
    if (T.tipo === 'segredo') acoes.push(['Girar o segredo ›', function () { teclado = global.VCTrava.segredo({ rot: 'COFRE DE CHAVES · ' + a, txt: 'Direita até o primeiro número, esquerda até o segundo, direita até o terceiro. Depois, a alavanca.', conferir: function (v) { return opcoes.conferir(a, v); }, aoAbrir: function () { abrirTrava(a); } }); }]);
    cartao((a + ' · ' + nomeAndar(a)).toUpperCase(), txt + '<br>' + infoAndar(a), acoes);
  }
  var teclado = null;
  function abrirTrava(a) { if (opcoes.aoDestrancar) opcoes.aoDestrancar(a); if (global.VCTrava) global.VCTrava.bip(300, 0.2, 'sine', 0.08); cartao((a + ' · ' + nomeAndar(a)).toUpperCase(), 'Abriu. ' + infoAndar(a), [['Entrar no andar ›', function () { entrarNoAndar(a); }]]); }
  function tocarItem(id) {
    var it = (opcoes.itens || []).filter(function (x) { return x.id === id; })[0], L = LUGAR_ITEM[id];
    cartao((it ? it.nome : 'PEÇA').toUpperCase(), 'A peça do Capítulo ' + id.slice(1) + ' está aqui, no ' + L[0] + ' · ' + nomeAndar(L[0]) + '.', [['Examinar de perto ›', function () { if (opcoes.aoAbrirItem) opcoes.aoAbrirItem(id); }], dentro ? null : ['Entrar no andar ›', function () { entrarNoAndar(L[0]); }, true]]);
  }
  function tocarPonto(a, id, novo) {
    var p = pontosDe(a).filter(function (x) { return x.id === id; })[0]; if (!p) return; pontoAtual = p;
    var extra = opcoes.aoPonto ? opcoes.aoPonto(a, p) : null;
    var acoes = [['📷 Fotografar', function () { fotografar(a, p); }, true]];
    var txt = (extra && extra.txt) || p.d;
    if (p.img && (novo || achadoP(a, p))) txt = '<img class="maq-ovo" src="' + BASE + 'media/' + p.img + '" alt="">' + txt;
    if (p.item) { if (opcoes.tem && opcoes.tem(p.item)) txt += ' <i>(Já está com você.)</i>'; else acoes.unshift(['Guardar no inventário ›', function () { var img = ''; try { renderer.render(cena, ra ? ra.cameraAtiva() : camera); img = renderer.domElement.toDataURL('image/jpeg', 0.8); } catch (e) {} if (opcoes.aoItem) opcoes.aoItem(a, p, img); cartao(p.n.toUpperCase(), 'Guardado no inventário.', [['📷 Fotografar', function () { fotografar(a, p); }, true]]); }]); }
    if (extra && extra.acao) acoes.unshift(extra.acao);
    cartao((novo ? 'ACHADO · ' : '') + p.n.toUpperCase(), txt, acoes);
  }
  function fotografar(a, p) {
    var img = '';
    try { renderer.render(cena, ra ? ra.cameraAtiva() : camera); img = renderer.domElement.toDataURL('image/jpeg', 0.82); } catch (e) {}
    if (opcoes.aoFoto) opcoes.aoFoto(a, p, img);
    cartao(p.n.toUpperCase(), 'Foto guardada no inventário. ' + p.d, [['‹ Voltar à torre', sairDoAndar, true]]);
  }
  function tocarCirc(c) {
    var C = (opcoes.circ || []).filter(function (x) { return x.id === c; })[0];
    var n = { 'escada-corta-fogo': 'Escada corta-fogo', elevador: 'Elevador', 'escada-externa': 'Escada externa', 'letreiro-vestchip': 'O letreiro', fachada_mosaico: 'A fachada em mosaico', 'torre/frisos-led': 'Os frisos de luz', 'torrefrisos-led': 'Os frisos de luz' }[c] || c;
    cartao((C ? C.n : n).toUpperCase(), C ? C.d : 'Parte da torre, de cima a baixo.');
  }
  function tocarAndar(a) {
    if (dentro) return;
    var abre = aberta !== a; abrirGaveta(abre ? a : null);
    var txt = infoAndar(a);
    if (opcoes.eu && opcoes.eu.andar === a) txt += '<br><b style="color:#efc878">O seu posto fica neste andar.</b>';
    var acoes = [];
    if (abre && trancado(a)) { cartaoTrava(a); var ex0 = opcoes.aoAndar ? opcoes.aoAndar(a, abre) : null; if (ex0 && ex0.acao) { var bb = document.createElement('button'); bb.className = 'acao sec'; bb.type = 'button'; bb.textContent = ex0.acao[0]; bb.onclick = ex0.acao[1]; el.querySelector('#maqAcao').appendChild(bb); } return; }
    if (abre && !LACRADO[a]) acoes.push(['Entrar no andar ›', function () { entrarNoAndar(a); }]);
    if (LACRADO[a]) txt += '<br><i>' + LACRADO[a] + '</i>';
    var extra = opcoes.aoAndar ? opcoes.aoAndar(a, abre) : null;
    if (extra && extra.acao) acoes.push(extra.acao);
    cartao((a + ' · ' + nomeAndar(a)).toUpperCase(), (abre ? 'A gaveta saiu. ' : '') + txt, acoes);
  }

  /* ── RA ── */
  function entrarRA() { if (!ra) return; dica('Abrindo a câmera…'); ra.entrar('ra').then(function () { abrirGaveta(null); dica('Aponte para a mesa até aparecer o círculo. Depois, toque em “Pousar aqui”.'); cartao('NA MESA', 'Ponha a torre sobre uma mesa de verdade: dá para andar em volta e olhar cada andar de perto. Com dois dedos, aumenta, diminui e gira.'); atualizarBotoes(); }).catch(function (e) { dica('Sem RA neste aparelho agora. A maquete segue na tela.'); cartao('RA', (e && e.message) || 'A câmera não abriu.'); atualizarBotoes(); }); }
  function pousar() { if (!ra) return; var e = ra.estado(); if (e.modo === 'ra' && !e.temHit) { dica('Aponte para a mesa até aparecer o círculo.'); return; } if (ra.posicionar()) { dica('Toque num andar ou num losango.'); atualizarBotoes(); } }
  function atualizarBotoes() {
    if (!el || !ra) return; var e = ra.estado();
    el.querySelector('#maqPousar').hidden = !(e.modo === 'ra' && !e.posta);
    el.querySelector('#maqRA').textContent = e.modo === 'ra' ? 'Sair da RA' : 'Pôr na mesa (RA)';
    el.querySelector('#maqRA').onclick = e.modo === 'ra' ? function () { ra.sair().then(function () { if (dentro) { var vd = vistaDentro(); animarCamera(vd[0], vd[1], { min: 0.18, max: 2.4 }); } else enquadrar(); atualizarBotoes(); dica('Arraste para girar. Toque num andar: ele sai como uma gaveta.'); }); } : entrarRA;
    if (controles) controles.enabled = e.modo !== 'ra';
  }
  function gestosRA() {
    var c = renderer.domElement, pinca = 0, ang = 0;
    function dist(t) { var x = t[0].clientX - t[1].clientX, y = t[0].clientY - t[1].clientY; return Math.sqrt(x * x + y * y); }
    function angulo(t) { return Math.atan2(t[1].clientY - t[0].clientY, t[1].clientX - t[0].clientX); }
    c.addEventListener('touchstart', function (e) { if (e.touches.length === 2) { pinca = dist(e.touches); ang = angulo(e.touches); } }, { passive: true });
    c.addEventListener('touchmove', function (e) { if (!ra || ra.estado().modo !== 'ra' || e.touches.length !== 2) return; var d = dist(e.touches), a = angulo(e.touches); if (pinca > 0) ra.mudarEscala(d / pinca); ra.girar(a - ang); pinca = d; ang = a; }, { passive: true });
  }

  var antes = 0;
  function suave(x) { return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2; }
  function desenhar(tempo, quadroXR) {
    var t = tempo || performance.now(), dt = Math.min(0.05, (t - (antes || t)) / 1000); antes = t; relogio += dt;
    if (ra) ra.atualizar(dt, quadroXR);
    if(climaRA){climaRA.grupo.visible=climaRA.estado().ligado&&!dentro;if(!dentro)climaRA.update(dt);}
    /* 25/10/2026: a torre na tempestade e as obras na imprensa (torre-viva.js) */
    if(vivaT)vivaT.update(dt,dentro,climaRA?climaRA.vento(relogio):.2);
    var k = Math.min(1, dt * 5);
    Object.keys(andares).forEach(function (q) {
      var A = andares[q], at = A.at, al = A.alvo;
      ['x', 'y', 'z', 'gir', 'esc'].forEach(function (c) { at[c] += (al[c] - at[c]) * k; });
      A.piv.position.set(A.base.x + at.x, A.base.y + at.y, A.base.z + at.z); A.piv.rotation.y = at.gir; A.piv.scale.setScalar(at.esc);
      A.piv.visible = Math.abs(at.y) < 100;
    });
    pinos.concat(pontosG ? pontosG.children : []).forEach(function (p, i) { var l = p.children[0]; l.position.y = Math.sin(relogio * 2.2 + i) * 0.25; l.rotation.y += dt * 1.2; p.children[1].scale.setScalar(1 + 0.15 * Math.sin(relogio * 3 + i)); });
    if (euG) euG.scale.setScalar(1 + Math.sin(relogio * 3) * 0.04);
    if (dentro && !anim) { tProcura += dt; var bd = el.querySelector('#maqDicaBtn'); if (bd.hidden && tProcura > 25 && escondidosDe(dentro).length) bd.hidden = false; }
    if (brilho) { brilho.userData.t += dt; var bt = brilho.userData.t; brilho.material.opacity = Math.max(0, Math.sin(Math.min(1, bt / 2.6) * Math.PI)) * 0.75; brilho.scale.setScalar(1 + 0.3 * Math.sin(bt * 8)); if (bt > 2.6) { brilho.parent && brilho.parent.remove(brilho); brilho = null; } }
    if (anim) {
      anim.t = Math.min(1, anim.t + dt / 1.1); var s = suave(anim.t);
      camera.position.lerpVectors(anim.de, anim.para, s); controles.target.lerpVectors(anim.alvoDe, anim.alvoPara, s);
      if (anim.t >= 1) { controles.minDistance = anim.lim.min; controles.maxDistance = anim.lim.max; anim = null; }
    }
    var est = ra && ra.estado(); renderer.setClearColor(0x000000, 0);
    if (controles && controles.enabled) controles.update();
    renderer.render(cena, ra ? ra.cameraAtiva() : camera);
  }
  function abrir(o) {
    opcoes = o || {}; if (!el) criarTela(); el.hidden = false; ativo = true; el.querySelector('#maqCarregando').hidden = false;
    cartao('A MAQUETE', 'A torre do subsolo à cobertura. Toque num andar: ele sai como uma gaveta, e dá para entrar nele. Os losangos dourados são as peças do caso; o anel dourado marca o seu andar.');
    return carregarTudo().then(function () {
      if(!climaRA)climaRA=RAClima.criar(raiz,{host:el.querySelector('.maq-ferr')||el,aoClarao:function(b){if(vivaT)vivaT.clarao(b);}});
      if(!vivaT&&global.TorreViva)vivaT=TorreViva.criar(modelo,andares,{base:BASE});
      el.querySelector('#maqCarregando').hidden = true; aplicar(); redimensionar();
      if (dentro && opcoes.entrar !== dentro) sairDoAndar();
      if (!ra || ra.estado().modo !== 'ra') { if (!dentro) enquadrar(); }
      renderer.setAnimationLoop(desenhar);
      /* 25/10/2026: na primeira vez neste aparelho, o que é cada coisa na tela (guia-ra.js) */
      if (global.GuiaRA) GuiaRA.mostrar('eco-maquete', [
        { alvo: '#maqPalco', txt: 'Arraste para girar a torre; com dois dedos, aproxime. Um toque num andar o puxa para fora, como uma gaveta.' },
        { alvo: '#maqRA', txt: 'Pôr na mesa abre a câmera e coloca a torre sobre a sua mesa.' },
        { alvo: '.ra-clima-toggle', txt: 'O clima liga e desliga a chuva e os relâmpagos. Ele não muda nada no caso.' },
        { alvo: '#maqSair', txt: 'Por aqui você volta para a mesa do jogo.' }
      ]);
      if (opcoes.alvo && andares[opcoes.alvo] && !dentro) { var A = andares[opcoes.alvo], f = fator(); controles.target.set(0, (A.base.y - CHAO) * S, 0); camera.position.set(0.7 * f, (A.base.y - CHAO) * S + 0.35, 1.05 * f); controles.update(); tocarAndar(opcoes.alvo); }
      if (opcoes.entrar && andares[opcoes.entrar] && dentro !== opcoes.entrar) setTimeout(function () { if (trancado(opcoes.entrar)) { var A3 = andares[opcoes.entrar], f3 = fator(); controles.target.set(0, (A3.base.y - CHAO) * S, 0); camera.position.set(0.7 * f3, (A3.base.y - CHAO) * S + 0.35, 1.05 * f3); controles.update(); } entrarNoAndar(opcoes.entrar); }, 500);
    }).catch(function (e) { el.querySelector('#maqCarregando').textContent = 'A maquete não abriu: ' + ((e && e.message) || e); throw e; });
  }
  function fechar() {
    ativo = false; var sai = ra && ra.estado().modo === 'ra' ? ra.sair() : Promise.resolve();
    return sai.then(function () { if (renderer) renderer.setAnimationLoop(null); if (el) el.hidden = true; });
  }
  global.VCMaquete = { abrir: abrir, fechar: fechar, aberta: function () { return ativo; }, dentro: function () { return dentro; }, ORDEM: ORDEM, PONTOS: PONTOS,
    _caixa: function (a) { var THREE = global.THREE, A = andares[a], out = []; A.no.traverse(function (o) { if (o.isMesh) { var b = new THREE.Box3().setFromObject(o), t = b.getSize(new THREE.Vector3()); out.push([o.name, +t.y.toFixed(4)]); } }); out.sort(function (x, y) { return y[1] - x[1]; }); return { w: A.piv.getWorldScale(new THREE.Vector3()).toArray(), top: out.slice(0, 4) }; },
    _teste: function () { return { cam: camera.position.toArray(), alvo: controles.target.toArray(), andares: Object.keys(andares).length, pinos: pinos.length, rota: !!rotaG, aberta: aberta, dentro: dentro, pontos: pontosG ? pontosG.children.length : 0 }; },
    _tocarAndar: function (a) { tocarAndar(a); }, _entrar: function (a) { entrarNoAndar(a); }, _sair: function () { sairDoAndar(); }, _ponto: function (id) { tocarPonto(dentro, id); }, _marcas: function (v) { if (pontosG) pontosG.visible = v; pinos.forEach(function (x) { x.visible = v; }); }, _vista: function (pos, alvo) { anim = null; camera.position.set(pos[0], pos[1], pos[2]); controles.target.set(alvo[0], alvo[1], alvo[2]); controles.minDistance = 0.01; controles.maxDistance = 10; controles.update(); }, _foto: function () { if (pontoAtual) fotografar(dentro, pontoAtual); },
    _ultimoQ: function () { return ultimoQ; },
    _telaDe: function (id) { var A = andares[dentro], p = pontosDe(dentro).filter(function (x) { return x.id === id; })[0]; if (!A || !p) return null; A.piv.updateMatrixWorld(true); var cam = ra ? ra.cameraAtiva() : camera, r = renderer.domElement.getBoundingClientRect(), v = A.piv.localToWorld(noAndar(A, p.pos[0], p.pos[1], p.pos[2])).project(cam); return [Math.round(r.left + (v.x + 1) / 2 * r.width), Math.round(r.top + (1 - v.y) / 2 * r.height)]; },
    _procurar: function (id) { var p = pontosDe(dentro).filter(function (x) { return x.id === id; })[0]; if (!p) return false; procurar(dentro, { x: p.pos[0], y: p.pos[1], z: p.pos[2] }); return achadoP(dentro, p); },
    _acao: function (i) { var b = el.querySelector('[data-maq-acao="' + (i || 0) + '"]'); if (b) b.click(); return !!b; }, _trava: function (v) { if (teclado && teclado._digitar && typeof v === 'string') teclado._digitar(v); else if (teclado && teclado._girar) teclado._girar(v); }, _trancado: function (a) { return trancado(a); }, _dicaBtn: function () { return !el.querySelector('#maqDicaBtn').hidden; } };
})(window);
