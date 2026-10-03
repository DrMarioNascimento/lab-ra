/* O Impostor — a escrivaninha da sala de mapas (Capítulo 2, desde 02/10: uma peça de RA por capítulo;
   SUBSTITUIDO: 'da biblioteca (Capítulo 3; até 01/10 era do escritório, no Cap. 2)'), com a mão.
   01/10 (auditoria): papéis que contradiziam o cânone ou entregavam o futuro foram trocados
   (versão anterior em ra/escrivaninha-folhas_SUBSTITUIDO.js).

   Cópia independente da escrivaninha do lab-ra (modelos/escrivaninha.glb),
   adaptada ao Impostor em 28/09/2026. Sobre o tampo há vários montes de
   folhas escritas à mão. As letras são pequenas: para ler é preciso chegar
   perto (aproximar o celular, ou a pinça dos dedos). Nada indica o que se mexe.

   · VIRAR uma folha: arrastar a folha de cima de um monte para o lado. Ela
     vira de costas e deita ao lado, e aparece a de baixo.
   · FOTOGRAFAR uma folha: um toque rápido nela. A foto vai para o inventário
     da mesa (dá para anexar a outro jogador).
   · As SEIS GAVETAS: arrastar para a frente. Cada uma tem alguns papéis; o de cima
     sai arrastando (vai para uma pilha no tampo) e um toque rápido fotografa.
     A conta do celular (a dica) muda de gaveta e de altura a cada partida/jogador.

   Numa das pilhas: "Se você virar essa página, na próxima você ganha 1 envio".
   Virando, a de baixo dá o envio extra do capítulo (uma vez só). O par bilhete + envio muda de monte e de posição a cada partida e jogador. Na gaveta, a conta (a dica) fica embaixo de um carnê do IPTU: é preciso tirá-lo.

   Fala com a mesa por postMessage: {oi:'escrivaninha', evento:'envio'} e
   {oi:'escrivaninha', evento:'foto', nome, img}. */
(function () {
  'use strict';
  var FL = 0.15, FC = 0.21, TAMPO = 0.7652, ESP = 0.0011, W = 512, H = Math.round(512 * FC / FL);

  var b = OIBase.criar({
    vista: { alvo: [0, 0.74, 0.02], dist: 1.25, distRetrato: 2.1, dir: [0, 1.25, 0.8] },
    raioDoChao: 1.2, alturaDoAparelho: 1.35, miraEscala: 2.2, exposicao: 1.0,
    textoMira: 'Aponte para o chão, onde a escrivaninha ficaria, e toque em Pôr aqui.',
    textoInicio: 'A escrivaninha da sala de mapas.',   /* SUBSTITUIDO 02/10: 'A escrivaninha da biblioteca.' */
    deNovo: null
  });

  /* ---------------- o que está escrito ---------------- */
  var POEMA = ['O Farol', '',
    'Quando a névoa desce sobre o mar,', 'alguém acende a luz no alto da pedra:',
    'ela gira, paciente, e ilumina', 'o caminho de quem ainda não voltou.', '',
    'Cada navio que passa ao longe', 'leva um pedaço do meu coração,',
    'e cada volta do feixe no escuro', 'é um jeito antigo de dizer amor.', '',
    'Não há tempestade que apague', 'as saudades de quem espera na janela.',
    'O farol não conhece descanso:', 'ele só sabe mostrar o caminho do lar.'];
  /* estilo: 'mao' (manuscrito), 'maquina' (datilografado), 'recibo' */
  var MONTES = [
    { x: -0.40, z: -0.14, giro: 0.05, vira: -1, folhas: [
      { nome: 'O Farol (poema)', estilo: 'mao', linhas: POEMA, titulo: true },
      { nome: 'Rascunho do poema', estilo: 'mao', linhas: ['O Farol — rascunho', '', 'Quando a ~~bruma~~ névoa desce...', 'ela gira ~~e gira~~, paciente', '', 'Cada navio ~~que some~~', 'leva um pedaço do meu coração', '', '~~lar~~ ~~porto~~ ... lar. Fica lar.', '', 'Ler em voz alta quando estiver pronto.'] }
    ] },
    { x: -0.02, z: -0.14, giro: -0.06, vira: 1, folhas: [
      { nome: 'Tábua das marés', estilo: 'maquina', linhas: ['TÁBUA DAS MARÉS — PRAIA DA COSTA', '', 'Preamar   05h12   1,8 m', 'Baixa-mar 11h31   0,3 m', 'Preamar   17h40   1,9 m', 'Baixa-mar 23h58   0,2 m', '', 'Ressaca prevista para o fim da semana.'] }
    ] },
    { x: 0.45, z: -0.14, giro: 0.04, vira: -1, folhas: [
      { nome: 'Lista de afazeres', estilo: 'mao', linhas: ['Fazer esta semana', '', '- consertar a calha dos fundos', '- secar a lenha da varanda', '- pagar a mercearia no dia 5', '- lenha para o fogão', '- pilhas para o rádio'] },
      { nome: 'Lembrete do cartório', estilo: 'mao', linhas: ['Cartório', '', 'A lista fica com o cartório.', 'Ninguém abre nada sem ata.', '', 'Conferir se a lista', 'está completa.'] }
    ] },
    { x: -0.45, z: 0.14, giro: -0.05, vira: 1, folhas: [
      { nome: 'Recibo da mercearia', estilo: 'recibo', linhas: ['MERCEARIA DO PORTO', 'rua da praia, 40', '--------------------------', '07/09/2026   16:12', '', 'café moído 500 g    18,90', 'pão caseiro          9,50', 'leite 1 L            6,50', 'pilhas AA (4)       14,00', 'fósforos             2,50', '--------------------------', 'TOTAL               51,40', 'PAGO EM DINHEIRO', '', 'obrigado, volte sempre'] },
      { nome: 'Previsão do tempo', estilo: 'maquina', linhas: ['PREVISÃO — LITORAL', '', 'Chuva forte a partir da noite.', 'Névoa densa na estrada da costa.', 'Rajadas de vento no mar aberto.', '', 'Evite viajar à noite.'] },
      { nome: 'Receita de bolinho de chuva', estilo: 'mao', linhas: ['Bolinho de chuva da vó', '', '2 ovos, 1 xíc. de açúcar', '1 xíc. de leite', '2 e ½ xíc. de farinha', '1 colher de fermento', '', 'Fritar às colheradas.', 'Açúcar e canela por cima.', 'Em dia de chuva, dobrar a receita.'] }
    ] },
    { x: 0.2, z: 0.14, giro: 0.07, vira: 1, folhas: [
      { nome: 'Nomes para o barco', estilo: 'mao', linhas: ['Nomes para o barco', '', 'Saudade?', 'Estrela do Mar?', 'Volta Logo?', 'Farol Velho?', '', '"Volta Logo" — gostei.'] },
      { nome: 'Esboço do farol', estilo: 'mao', desenho: 'farol', linhas: ['o farol, de memória'] }
    ] }
  ];
  /* O bilhete e o envio mudam de monte a cada partida e a cada jogador. */
  var PAR_ENVIO = [
    { nome: 'Bilhete', estilo: 'mao', grande: true, linhas: ['Se você virar', 'essa página,', 'na próxima você', 'ganha 1 envio.'] },
    { nome: 'Envio extra', estilo: 'mao', grande: true, envio: true, linhas: ['✉  +1 envio', '', 'Achou.', 'Guarde bem.'] }
  ];
  (function () {
    var Q = new URLSearchParams(location.search);
    var r = OISorteio.gerador(Q.get('partida') || 'P-DEMO', Q.get('jogador') || '0', 'escrivaninha-envio');
    var m = MONTES[r.inteiro(0, MONTES.length - 1)];
    var pos = r.inteiro(0, m.folhas.length - 1);      /* pode ficar no topo ou no meio do monte */
    m.folhas.splice(pos, 0, PAR_ENVIO[0], PAR_ENVIO[1]);
  })();
  /* ---- as seis gavetas: cada uma com alguns papéis; a dica muda de gaveta e de posição ---- */
  var CONTA = { nome: 'Conta de celular (gaveta)', estilo: 'maquina', dica: true, linhas: ['TELEFÔNICA MOSAICO', 'FATURA MENSAL — AGOSTO/2026', '', 'Titular: o proprietário da', '         Casa da Costa', 'Linha:   (48) 9 ···· ▒▒▒▒', '         (canto rasgado)', '', 'Dados móveis usados:  3,2 GB', 'Mensagens enviadas:   212', '', 'SITUAÇÃO: PAGA', 'em 02/09/2026, em dinheiro,', 'na lotérica da praia.'] };
  var GAVETAS = [
    [{ nome: 'Carnê do IPTU', estilo: 'maquina', linhas: ['PREFEITURA MUNICIPAL', 'CARNÊ DO IPTU — 2026', '', 'Imóvel: Casa da Costa', 'Estrada da costa, s/n', '', 'Parcela   Vencimento', '  1/10    10/03/2026', '  2/10    10/04/2026', '  3/10    10/05/2026', '', 'Pague em qualquer lotérica.'] },
     { nome: 'Manual do rádio', estilo: 'maquina', linhas: ['RÁDIO MOSAICO — MOD. 7', 'MANUAL DE USO', '', '1. Coloque 4 pilhas AA.', '2. Gire o botão até ouvir', '   um clique.', '3. Procure a estação com', '   o dial lateral.', '', 'Em dias de chuva o sinal', 'pode falhar.'] }],
    [{ nome: 'Folheto do farol', estilo: 'maquina', linhas: ['FAROL DA COSTA', 'VISITAÇÃO', '', 'Sábados e domingos', 'das 9h às 16h.', '', 'Não é permitido subir', 'com chuva ou vento forte.', '', 'O feixe gira sem parar', 'desde 1911.'] }],
    [{ nome: 'Carta de um amigo', estilo: 'mao', linhas: ['Meu caro,', '', 'a pescaria de domingo', 'rendeu pouco, mas o', 'café na sua varanda', 'valeu a viagem.', '', 'Quando a reforma acabar,', 'me chame para ver a casa.', '', 'Um abraço do velho amigo.'] },
     { nome: 'Postal da ilha', estilo: 'mao', linhas: ['Lembrança da Ilha', '', 'Tempo bom, mar calmo.', 'Voltamos na sexta.', '', 'Beijos a todos.'] }],
    [{ nome: 'Mapa das trilhas', estilo: 'maquina', linhas: ['TRILHAS DA COSTA', '', 'A  Praia  → Farol    40 min', 'B  Farol  → Mirante   25 min', 'C  Casa   → Praia    15 min', '', 'Trilha C fechada em', 'dias de ressaca.'] }],
    [{ nome: 'Contas de luz antigas', estilo: 'mao', linhas: ['Luz — 2019', '', 'jan  84,00', 'fev  91,50', 'mar  77,20', 'abr  80,10', '', 'O fogão a lenha', 'economiza no inverno.'] },
     { nome: 'Folha manchada', estilo: 'mao', linhas: ['', '', '(uma mancha de café', ' e nada escrito)'] }],
    [{ nome: 'Garantia da geladeira', estilo: 'maquina', linhas: ['CERTIFICADO DE GARANTIA', '', 'Produto: refrigerador Mosaico', 'Prazo: 12 meses', '', 'Guarde este certificado', 'junto com a nota fiscal.'] },
     { nome: 'Lista de telefones', estilo: 'maquina', linhas: ['TELEFONES ÚTEIS', '', 'Bombeiros ........ 193', 'Polícia .......... 190', 'Farol ............ ramal 3', 'Mercearia do Porto', '  (48) 3··· ····', 'Táxi da praia', '  (48) 9··· ····'] }]
  ];
  /* 02/10 (Mario): o papel do cadeado do farol — um cadeado em forma de coração desenhado a lápis
     e o código ao lado, bem direto. O código vem da mesa (?farol=1234) e muda a cada partida; o
     papel muda de lugar a cada partida (e jogador): no topo ou no meio de um monte, ou numa gaveta. */
  (function () {
    var Q = new URLSearchParams(location.search), cod = (Q.get('farol') || '').replace(/\D/g, '').slice(0, 4);
    if (cod.length !== 4) return;
    var CAD = { nome: 'Papel do cadeado', estilo: 'mao', desenho: 'cadeado', codigo: cod, linhas: [] };
    var r = OISorteio.gerador(Q.get('partida') || 'P-DEMO', Q.get('jogador') || '0', 'escrivaninha-cadeado');
    var n = r.inteiro(0, MONTES.length + GAVETAS.length - 1);
    if (n < MONTES.length) { var m = MONTES[n]; m.folhas.splice(r.inteiro(0, m.folhas.length), 0, CAD); }
    else { var gv = GAVETAS[n - MONTES.length]; gv.splice(r.inteiro(0, gv.length), 0, CAD); }
  })();
  (function () {                      /* a conta entra numa gaveta e numa altura sorteadas */
    var Q = new URLSearchParams(location.search);
    var r = OISorteio.gerador(Q.get('partida') || 'P-DEMO', Q.get('jogador') || '0', 'escrivaninha-dica');
    var g = GAVETAS[r.inteiro(0, GAVETAS.length - 1)];
    g.splice(r.inteiro(0, g.length), 0, CONTA);
  })();

  /* ---------------- desenhar uma folha ---------------- */
  function papel(g, w, h, amarelo) {
    g.fillStyle = amarelo ? '#efe3c2' : '#f4eedf'; g.fillRect(0, 0, w, h);
    for (var i = 0; i < 700; i++) { g.fillStyle = 'rgba(120,95,60,' + Math.random() * 0.06 + ')'; g.fillRect(Math.random() * w, Math.random() * h, 2, 2); }
    var gr = g.createRadialGradient(w / 2, h / 2, w * 0.3, w / 2, h / 2, w * 0.9); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(120,90,40,.18)'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
  }
  function escrever(f) {
    var c = document.createElement('canvas'); c.width = W; c.height = H; var g = c.getContext('2d');
    papel(g, W, H, f.estilo === 'recibo');
    var mao = f.estilo === 'mao', tam = f.grande ? 46 : mao ? 30 : 21;
    var fonte = mao ? '600 ' + tam + 'px Caveat, "Segoe Print", cursive' : tam + 'px "Special Elite", "Courier New", monospace';
    if (f.estilo === 'recibo') fonte = '19px "Courier New", monospace';
    if (mao) { g.strokeStyle = 'rgba(70,110,160,.18)'; g.lineWidth = 1; for (var y = 70; y < H - 20; y += 34) { g.beginPath(); g.moveTo(28, y + 8); g.lineTo(W - 24, y + 8); g.stroke(); } }
    g.fillStyle = mao ? '#1e2f5a' : '#2a2622'; g.textBaseline = 'alphabetic';
    var x = f.grande ? W / 2 : 40, y0 = f.grande ? H * 0.34 : 66, passo = f.grande ? 60 : mao ? 34 : 28;
    g.textAlign = f.grande || f.estilo === 'recibo' ? (f.grande ? 'center' : 'left') : 'left';
    f.linhas.forEach(function (l, i) {
      var y = y0 + i * passo, ff = fonte;
      if (i === 0 && (f.titulo || f.nome === 'Rascunho do poema')) ff = '700 38px Caveat, cursive';
      g.font = ff;
      /* se a linha não cabe (fonte de reserva mais larga), a letra encolhe */
      var larg = g.measureText(l.replace(/~~/g, '')).width, cabe = f.grande ? W - 60 : W - x - 26;
      if (larg > cabe) { var px = parseFloat(ff.match(/(\d+)px/)[1]) * cabe / larg; g.font = ff.replace(/\d+px/, px.toFixed(1) + 'px'); }
      /* ~~riscado~~ */
      var partes = l.split('~~'), cx = x;
      if (partes.length > 1 && !f.grande) {
        partes.forEach(function (p, k) {
          g.fillText(p, cx, y); var w = g.measureText(p).width;
          if (k % 2 === 1) { g.strokeStyle = '#1e2f5a'; g.lineWidth = 2; g.beginPath(); g.moveTo(cx - 2, y - 9); g.lineTo(cx + w + 2, y - 11); g.stroke(); }
          cx += w;
        });
      } else g.fillText(l, x, y);
    });
    if (f.desenho === 'cadeado') {              /* o cadeado de coração, a lápis, e o código ao lado */
      g.save(); g.strokeStyle = 'rgba(60,60,64,.85)'; g.lineWidth = 3; g.lineJoin = 'round';
      var cx0 = W * 0.33, cy0 = H * 0.55, R = W * 0.17;
      g.beginPath(); g.moveTo(cx0 - R * 0.55, cy0 - R * 0.55); g.lineTo(cx0 - R * 0.55, cy0 - R * 1.25);
      g.arc(cx0, cy0 - R * 1.25, R * 0.55, Math.PI, 0); g.lineTo(cx0 + R * 0.55, cy0 - R * 0.55); g.stroke();       /* a alça */
      g.beginPath(); g.moveTo(cx0, cy0 + R * 1.15);                                                                  /* o coração */
      g.bezierCurveTo(cx0 - R * 1.6, cy0 + R * 0.1, cx0 - R * 1.25, cy0 - R * 1.05, cx0 - R * 0.05, cy0 - R * 0.55);
      g.moveTo(cx0, cy0 + R * 1.15);
      g.bezierCurveTo(cx0 + R * 1.6, cy0 + R * 0.1, cx0 + R * 1.25, cy0 - R * 1.05, cx0 + R * 0.05, cy0 - R * 0.55); g.stroke();
      g.beginPath(); g.arc(cx0 - R * 0.3, cy0 - R * 0.15, R * 0.18, 0, Math.PI * 2); g.stroke();                       /* o botão */
      g.beginPath(); g.arc(cx0 + R * 0.12, cy0 + R * 0.12, R * 0.12, 0, Math.PI * 2); g.moveTo(cx0 + R * 0.06, cy0 + R * 0.22); g.lineTo(cx0 + R * 0.02, cy0 + R * 0.5); g.lineTo(cx0 + R * 0.22, cy0 + R * 0.5); g.lineTo(cx0 + R * 0.18, cy0 + R * 0.22); g.stroke();
      for (var hh = 0; hh < 26; hh++) { g.globalAlpha = 0.12; g.beginPath(); var yy0 = cy0 - R * 0.4 + hh * R * 0.06; g.moveTo(cx0 + R * 0.5, yy0); g.lineTo(cx0 + R * 0.9, yy0 - R * 0.25); g.stroke(); }   /* sombreado */
      g.globalAlpha = 1; g.fillStyle = 'rgba(55,55,60,.9)'; g.textAlign = 'center';
      g.font = '700 ' + Math.round(W * 0.15) + 'px Caveat, "Segoe Print", cursive'; g.fillText(f.codigo, W * 0.74, cy0 + R * 0.2);
      g.restore();
    }
    if (f.desenho === 'farol') {
      g.strokeStyle = '#1e2f5a'; g.lineWidth = 2.2; var bx = W / 2, by = H - 90;
      g.beginPath(); g.moveTo(bx - 60, by); g.lineTo(bx - 34, by - 360); g.lineTo(bx + 34, by - 360); g.lineTo(bx + 60, by); g.stroke();
      for (var k = 1; k < 5; k++) { var yy = by - k * 72, sx = 60 - 26 * k * 72 / 360; g.beginPath(); g.moveTo(bx - sx, yy); g.lineTo(bx + sx, yy); g.stroke(); }
      g.strokeRect(bx - 40, by - 420, 80, 60); g.beginPath(); g.moveTo(bx - 46, by - 420); g.lineTo(bx, by - 460); g.lineTo(bx + 46, by - 420); g.stroke();
      g.globalAlpha = 0.5; [[-1, -0.35], [1, -0.35], [-1, -0.1], [1, -0.1]].forEach(function (d) { g.beginPath(); g.moveTo(bx + d[0] * 40, by - 390); g.lineTo(bx + d[0] * 230, by - 390 + d[1] * 200); g.stroke(); }); g.globalAlpha = 1;
      g.beginPath(); for (var ox = 30; ox < W - 30; ox += 24) { g.moveTo(ox, by + 20); g.quadraticCurveTo(ox + 6, by + 12, ox + 12, by + 20); } g.stroke();
    }
    return c;
  }
  function verso() { var c = document.createElement('canvas'); c.width = 128; c.height = Math.round(128 * FC / FL); papel(c.getContext('2d'), c.width, c.height); return c; }
  function textura(c) { var t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding; t.anisotropy = 8; return t; }

  /* ---------------- montar ---------------- */
  var mesa, gavetas = [], CURSO = 0.37, descartados = 0;
  var folhas = [], animando = [], envioDado = false, texVerso;
  var geoFolha = new THREE.PlaneGeometry(FL, FC).rotateX(-Math.PI / 2);

  function criarFolha(f, monte, i) {
    var grupo = new THREE.Group();
    var frente = new THREE.Mesh(geoFolha, new THREE.MeshStandardMaterial({ map: textura(escrever(f)), roughness: 0.9 }));
    var tras = new THREE.Mesh(geoFolha, new THREE.MeshStandardMaterial({ map: texVerso, roughness: 0.9 }));
    tras.rotation.z = Math.PI; tras.position.y = -0.0002;
    grupo.add(frente); grupo.add(tras);
    grupo.userData = { f: f, monte: monte, i: i, canvas: null, virada: false };
    grupo.userData.canvas = frente.material.map.image;
    b.raiz.add(grupo); folhas.push(grupo);
    return grupo;
  }
  function pousar(folha) {
    var u = folha.userData, m = u.monte, n = m.folhas.length;
    var alt = TAMPO + ESP * (n - u.i) + ESP;
    var jit = (u.i * 0.37) % 1 - 0.5;
    folha.position.set(m.x + jit * 0.006, alt, m.z + jit * 0.004);
    folha.rotation.set(0, m.giro + jit * 0.05, 0);
  }
  function topo(monte) { var r = null; folhas.forEach(function (fo) { var u = fo.userData; if (u.monte === monte && !u.virada && (!r || u.i < r.userData.i)) r = fo; }); return r; }

  /* as letras precisam da fonte manuscrita carregada antes de desenhar (no máx. 3 s) */
  var fontes = Promise.race([
    Promise.all(['600 30px Caveat', '700 38px Caveat', '21px "Special Elite"'].map(function (f) { return document.fonts ? document.fonts.load(f) : null; })),
    new Promise(function (ok) { setTimeout(ok, 3000); })
  ]).catch(function () {});
  Promise.all([b.carregar(['modelos/escrivaninha.glb']), fontes]).then(function (tudo) { var r = tudo[0];
    mesa = r[0].scene; b.raiz.add(mesa);
    montarGavetas();
    texVerso = textura(verso());
    MONTES.forEach(function (m) { m.virados = 0; m.folhas.forEach(function (f, i) { pousar(criarFolha(f, m, i)); }); });
    etiqueta();
    folhas.forEach(pegaDaFolha); gavetas.forEach(pegaDaGaveta);
    b.aCadaQuadro(function (dt) { animando = animando.filter(function (fn) { return fn(dt) !== true; }); });
    b.comecar();
    b.estado('A escrivaninha da sala de mapas.');   /* SUBSTITUIDO 02/10: 'A escrivaninha da biblioteca.' */
  }).catch(function (e) { b.estado('O modelo não carregou: ' + (e && e.message || e)); });

  /* Marca Dragon Games: etiqueta de fabricante, na lateral de trás, embaixo. */
  function etiqueta() {
    var L = new THREE.TextureLoader(), cor = L.load('marcas/etiqueta_cor.png'), nor = L.load('marcas/etiqueta_normal.png'), orm = L.load('marcas/etiqueta_orm.png');
    cor.encoding = THREE.sRGBEncoding;
    var mat = new THREE.MeshStandardMaterial({ map: cor, normalMap: nor, roughnessMap: orm, metalnessMap: orm, aoMap: orm, metalness: 1, roughness: 1, transparent: true, alphaTest: 0.5 });
    var geo = new THREE.PlaneGeometry(0.06, 0.0225); geo.setAttribute('uv2', geo.attributes.uv);
    var e = new THREE.Mesh(geo, mat); e.rotation.y = Math.PI; e.position.set(0.5, 0.06, -0.2915); mesa.add(e);
  }

  /* ---------------- gestos ---------------- */
  function foto(nome, canvas) {
    var c = document.createElement('canvas'); c.width = canvas.width; c.height = canvas.height; c.getContext('2d').drawImage(canvas, 0, 0);
    b.vibrar(12); b.estado('Fotografado: ' + nome + '.');
    avisarMesa('foto', { nome: nome, img: c.toDataURL('image/jpeg', 0.85) });
  }
  function virar(folha) {
    var u = folha.userData, m = u.monte, t = 0;
    u.virada = true; m.virados++;
    var eixoX = m.vira > 0 ? FL / 2 : -FL / 2;              /* vira sobre a borda direita ou esquerda */
    var ini = folha.position.clone(), giro0 = folha.rotation.y;
    var pivo = new THREE.Vector3(eixoX, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), giro0).add(ini);
    var dest = pivo.clone().multiplyScalar(2).sub(ini); dest.y = TAMPO + ESP * m.virados + 0.0004;
    b.vibrar(10);
    animando.push(function (dt) {
      t = Math.min(1, t + dt / 0.6); var s = b.suave(t), ang = -m.vira * Math.PI * s;
      var eixo = new THREE.Vector3(0, 0, 1).applyAxisAngle(new THREE.Vector3(0, 1, 0), giro0);
      var p = ini.clone().sub(pivo).applyAxisAngle(eixo, ang).add(pivo);
      p.y = Math.max(p.y, TAMPO) + Math.sin(Math.PI * s) * 0.02;
      folha.position.copy(p);
      folha.quaternion.setFromAxisAngle(eixo, ang).multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), giro0));
      if (t >= 1) {
        folha.position.copy(dest);
        folha.quaternion.setFromAxisAngle(eixo, -m.vira * Math.PI).multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), giro0));
        var nova = topo(m);
        if (nova && nova.userData.f.envio && !envioDado) {
          envioDado = true; b.estado('Um envio extra! +1'); b.vibrar([20, 50, 20]); avisarMesa('envio', {});
        }
        return true;
      }
    });
  }
  function pegaDaFolha(folha) {
    var u = folha.userData, x0, y0, moveu;
    b.pega({
      rotulo: 'Folha',
      alvo: function () { return folha; },
      ativa: function () { return !u.virada; },
      inicio: function (x, y) { x0 = x; y0 = y; moveu = false; },
      mover: function (x, y) { if (Math.hypot(x - x0, y - y0) > 14) moveu = true; },
      fim: function (x, y, cancelou) {
        if (cancelou) return;
        if (!moveu) { foto(u.f.nome, u.canvas); return; }
        if (topo(u.monte) === folha && Math.abs(x - x0) > 30) virar(folha);
      }
    });
  }
  /* O modelo do lab-ra fundia as frentes e os puxadores das seis gavetas num
     mesh só, e só uma gaveta (sem puxador) saía: ficava uma cópia fechada no
     lugar. Aqui as frentes e os puxadores fundidos somem e as seis gavetas são
     montadas a partir da gaveta do modelo, cada uma com o seu puxador e um
     vão escuro atrás (o móvel é maciço por dentro). */
  function montarGavetas() {
    var modelo = mesa.getObjectByName('Gaveta'), velhoPapel = mesa.getObjectByName('Papel');
    ['Gavetas', 'Metal'].forEach(function (nm) { var o = mesa.getObjectByName(nm); if (o) o.visible = false; });
    var matMetal = mesa.getObjectByName('Metal').material;
    velhoPapel.parent.remove(velhoPapel); modelo.parent.remove(modelo);
    var vao = new THREE.MeshStandardMaterial({ color: 0x120a05, roughness: 1 });
    var pux = new THREE.Group();
    [[0.14, 0.014, 0.01, 0, 0, 0.025], [0.014, 0.014, 0.02, -0.063, 0, 0.016], [0.014, 0.014, 0.02, 0.063, 0, 0.016]].forEach(function (d) {
      var m = new THREE.Mesh(new THREE.BoxGeometry(d[0], d[1], d[2]), matMetal); m.position.set(d[3], d[4], d[5]); pux.add(m);
    });
    var LX = [-0.412, 0.412], LY = [0.20783, 0.41283, 0.61783], k = 0;
    LX.forEach(function (x) { LY.forEach(function (y) {
      var g = modelo.clone(); g.position.set(x, y, 0.286); mesa.add(g);
      var p = pux.clone(); p.position.set(0, 0.0003, 0); g.add(p);
      var v = new THREE.Mesh(new THREE.PlaneGeometry(0.34, 0.17), vao); v.position.set(x, y, 0.2925); mesa.add(v);
      var papeis = (x < 0 ? [GAVETAS[k], GAVETAS[k + 1], GAVETAS[k + 2]] : [GAVETAS[k + 3], GAVETAS[k + 4], GAVETAS[k + 5]])[LY.indexOf(y)] || [];
      gavetas.push({ grupo: g, z0: 0.286, abertura: 0, folhas: [] });
      var ga = gavetas[gavetas.length - 1];
      papeis.forEach(function (f, i) {
        var n = papeis.length;
        var m = new THREE.Mesh(new THREE.PlaneGeometry(0.186, 0.254).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({ map: textura(escrever(f)), roughness: 0.9, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: -1 - (n - i) }));
        m.position.set(-0.008 + ((i * 0.37) % 1 - 0.5) * 0.02, -0.0688 + 0.0025 * (n - i), -0.24);
        m.rotation.y = ((i * 0.53) % 1 - 0.5) * 0.12;
        m.userData = { f: f, canvas: m.material.map.image, i: i, fora: false };
        g.add(m); ga.folhas.push(m);
      });
    }); });
    k = 0;
  }
  function topoGaveta(ga) { var r = null; ga.folhas.forEach(function (m) { if (!m.userData.fora && (!r || m.userData.i < r.userData.i)) r = m; }); return r; }
  function pegaDaGaveta(ga) {
    var g = ga.grupo, ini = 0, ancora = null, eixo = null, x0, y0, moveu, noPapel;
    function noTrilho(x, y) {
      var olhar = b.cameraAgora().getWorldDirection(new THREE.Vector3());
      var normal = olhar.clone().sub(eixo.clone().multiplyScalar(olhar.dot(eixo))); if (normal.lengthSq() < 1e-6) return null; normal.normalize();
      var p = b.dedoNoPlano(x, y, new THREE.Plane().setFromNormalAndCoplanarPoint(normal, ancora));
      return p ? p.sub(ancora).dot(eixo) / b.escala() : null;
    }
    b.pega({
      rotulo: 'Gaveta',
      alvo: function () { return g; },
      ativa: function () { return true; },
      inicio: function (x, y) {
        x0 = x; y0 = y; moveu = false; ini = ga.abertura;
        var h = b.raioDoDedo(x, y).intersectObject(g, true).find(function (k) { return b.visivel(k.object); });
        noPapel = h && ga.folhas.indexOf(h.object) >= 0 && h.object === topoGaveta(ga) ? h.object : null;
        ancora = g.getWorldPosition(new THREE.Vector3());
        eixo = new THREE.Vector3(0, 0, 1).transformDirection(g.parent.matrixWorld);
      },
      mover: function (x, y) {
        if (Math.hypot(x - x0, y - y0) > 12) moveu = true; if (!moveu) return;
        if (noPapel && ga.abertura > 0.2) return;           /* arrastando o papel, não a gaveta */
        var v = noTrilho(x, y); if (v === null) return;
        ga.abertura = Math.min(CURSO, Math.max(0, ini + v)); g.position.z = ga.z0 + ga.abertura;
      },
      fim: function () {
        if (ga.abertura < 0.2 || !noPapel) return;
        if (moveu) tirarPapel(noPapel); else foto(noPapel.userData.f.nome, noPapel.userData.canvas);
      }
    });
  }
  /* O papel de cima sai da gaveta e vai para uma pilha sobre o tampo, na frente à direita. */
  function tirarPapel(m) {
    m.userData.fora = true; b.raiz.attach(m);
    var de = m.position.clone(), qDe = m.quaternion.clone();
    var para = new THREE.Vector3(0.42 - descartados * 0.004, TAMPO + ESP * (1 + descartados), 0.13 + descartados * 0.003);
    var qPara = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0.25 + ((descartados * 0.41) % 1 - 0.5) * 0.3);
    descartados++;
    var t = 0; b.vibrar(10);
    animando.push(function (dt) {
      t = Math.min(1, t + dt / 0.7); var s = b.suave(t);
      m.position.lerpVectors(de, para, s); m.position.y += Math.sin(Math.PI * s) * 0.12;
      m.quaternion.slerpQuaternions(qDe, qPara, s);
      if (t >= 1) return true;
    });
  }
  function avisarMesa(evento, extra) {
    try { if (parent !== window) parent.postMessage(Object.assign({ oi: 'escrivaninha', evento: evento }, extra || {}), location.origin); } catch (e) {}
  }

  /* para os testes */
  window.OIEscrivaninha = {
    folhaNaTela: function (nome) { var f = folhas.find(function (o) { return o.userData.f.nome === nome; }); return f && b.naTela(f.getWorldPosition(new THREE.Vector3())); },
    _virar: function (nome) { var f = folhas.find(function (o) { return o.userData.f.nome === nome; }); if (f && topo(f.userData.monte) === f) virar(f); },
    _tirar: function (k) { var ga = gavetas[k], m = topoGaveta(ga); if (m) tirarPapel(m); },
    _dbg: function () { return gavetas.map(function (ga) { var bb = new THREE.Box3().setFromObject(ga.grupo); return [ga.grupo.parent === mesa, ga.grupo.visible, bb.min.toArray().map(function (v) { return v.toFixed(2); }), bb.max.toArray().map(function (v) { return v.toFixed(2); })].join(' '); }); },
    _dica: function () { return gavetas.map(function (ga) { return ga.folhas.map(function (m) { return m.userData.f.nome; }).join(' > '); }); },
    _onde: function () { return MONTES.map(function (m) { return m.folhas.map(function (f) { return f.nome; }).join(' > '); }); },
    _abrir: function (k) { gavetas.forEach(function (ga, i) { if (k === undefined || k === i) { ga.abertura = CURSO; ga.grupo.position.z = ga.z0 + CURSO; } }); },
    envioDado: function () { return envioDado; },
    _folhas: function () { return folhas; },
    _cam: function (a, t) { b.controles.target.fromArray(t); b.camera.position.fromArray(a); b.controles.update(); },
    _debug: function () { return folhas.map(function (f) { var p = f.getWorldPosition(new THREE.Vector3()); return f.userData.f.nome + ' ' + p.toArray().map(function (v) { return v.toFixed(3); }).join(',') + ' vis=' + f.visible + ' mat=' + !!f.children[0].material.map; }); }
  };
})();
