/* A maquete da Casa da Costa — a atividade.

   A cena não decide nada: ela mostra o que o motor (`ac-maquete-state.mjs`)
   deixou aquele papel ver e manda de volta os atos que o motor aceita.

   A lei d'A Casa: cada jogador tem METADE do aparelho, e ninguém é avisado do
   seu papel — ele se revela pelo efeito no outro. Em cada camada:

   · Ato 1 — a mesma pista nos dois aparelhos, dizendo o recorte. Cada um
     vasculha a SUA maquete: num aparelho há a chave escondida, no outro há a
     fechadura. A chave não existe no aparelho de quem tem a fechadura, e a
     fechadura não existe no de quem tem a chave.
   · Ato 2 — os dois acharam; chega a segunda pista, também igual. Um arrasta e
     a peça vem; o outro arrasta e a peça resiste, chacoalha e volta. Na
     segunda tentativa aparece a frase que diz de quem é a outra metade.
   · Ato 3 — quem tem a fixa descreve onde ela está; quem tem a móvel leva,
     guiado pela voz. Quem guia vê a ponta da chave do colega como um ponto de
     luz.

   No Solo o jogador fica com a chave e um parceiro automático faz a outra
   metade (Mario, 19/09/2026): acha a fechadura, vê o ponto de luz e guia pela
   fala. O gesto é o mesmo arrasto da Mesa — nada de mecânica substituta.

   O que NÃO é segredo, e é honesto dizer: `ac-maquete-state.mjs` é o mesmo
   arquivo nos dois aparelhos, então as coordenadas estão no código de ambos.
   O plano do arrasto passa pela fechadura de propósito: é o que resolve a
   PROFUNDIDADE para quem não pode vê-la e deixa a orientação do colega valer
   em duas dimensões. A separação aqui é de JOGO, não de sigilo.

   A atividade só existe depois que a maquete está POSTA no ambiente. Antes
   disso a página é uma caixa fechada com um botão. */
(function () {
  'use strict';

  /* O import dinâmico do motor precisa de URL absoluta: num script clássico a
     base de `import()` não é a mesma do `<script src>` em todos os navegadores,
     e um caminho relativo cai em `js/js/` sem erro visível na leitura. */
  var MEU_SRC = (document.currentScript && document.currentScript.src) || location.href;
  var $ = function (id) { return document.getElementById(id); };
  var params = new URLSearchParams(location.search);
  var papel = params.get('papel') || 'luz';
  var solo = params.get('demo') === 'solo' && !params.has('sala');
  var reduzido = false;
  try { reduzido = matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}

  var motor = null, mundo = null, ra = null, poeira = null;
  var cena, camera, renderer, controles, chao, sol;
  var coop = null, dados = null, online = false, movimento = null, movimentoEm = 0, ultimoTip = '';
  var pendente = false, descartado = false;
  var arrastando = false, terminando = false, vooDaChave = null, ultimoExaminado = null, examinadoEm = 0;
  var enquadramentoAtual = '', concluidoEnviado = false;
  var giroAtivo = null, toques = new Map(), pinca = 0, tocouEm = null;
  var planoDeArrasto = new THREE.Plane(), raio = new THREE.Raycaster(), ponto = new THREE.Vector3();
  var ultimoEnvio = 0, envioOcupado = false, envioPendente = null;
  var alturaAberta = 0.62, progressoDasCamadas = {}, fantasmaTerreno = 1;
  var farol = null, tempoAnterior = 0, desligar = [], modoEscolhido = false, recebeuEstado = false;
  var tentativasNaFixa = 0, tremor = 0, girouDesde = false;
  var nivelDaDicaVisto = '', prazoEnviado = false, falaVista = 0, guiaEm = 0, ultimaGuia = '', raFalhou = false, raDesde = 0;
  var ultimaPontaValida = null, ultimoPainel = 0, ultimaMira = '', ultimoBonus = 0;

  var AZUL = 0x9fe7d6, OURO = 0xffd489;

  function on(el, tipo, fn, opcoes) { if (!el) return; el.addEventListener(tipo, fn, opcoes); desligar.push(function () { el.removeEventListener(tipo, fn, opcoes); }); }
  function entrarAtividade() { if (window.ACJanelas) window.ACJanelas.entrarAtividade(); }
  function avisar(texto, nivel) {
    if (window.ACJanelas && window.ACJanelas.aviso) { window.ACJanelas.aviso(texto, nivel || 3); return; }
    $('notice').textContent = texto; $('notice').style.display = 'block';
    setTimeout(function () { $('notice').style.display = 'none'; }, 4000);
  }
  function vida() { if (window.ACJanelas && window.ACJanelas.vida) window.ACJanelas.vida(); }

  /* ---------- cena ---------- */

  function montarCena() {
    cena = new THREE.Scene();
    cena.background = new THREE.Color(0x091515);
    camera = new THREE.PerspectiveCamera(52, innerWidth / innerHeight, 0.01, 60);
    cena.add(camera);
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.8));
    renderer.setSize(innerWidth, innerHeight, false);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.xr.enabled = true;
    $('scene').appendChild(renderer.domElement);

    /* Calibrado olhando a tela em 17/09/2026: com hemisférica em 1,05 e
       exposição 1,25 o plano de apoio virava um lençol azul-claro que roubava
       a casa. A luz do céu desceu, o chão escureceu e a exposição voltou a 1. */
    cena.add(new THREE.HemisphereLight(0xbcd2e6, 0x2e2418, 0.58));
    sol = new THREE.DirectionalLight(0xffeccd, 1.5);
    sol.position.set(-1.1, 2.0, 1.4); sol.castShadow = true;
    sol.shadow.mapSize.set(1024, 1024); sol.shadow.camera.near = 0.05; sol.shadow.camera.far = 8;
    sol.shadow.camera.left = -1; sol.shadow.camera.right = 1; sol.shadow.camera.top = 1; sol.shadow.camera.bottom = -1;
    cena.add(sol); cena.add(sol.target);
    cena.add(new THREE.AmbientLight(0xffffff, 0.16));
    var fria = new THREE.DirectionalLight(0x9ec4dd, 0.55);
    fria.position.set(1.6, 1.2, -1.4); cena.add(fria);

    chao = new THREE.Mesh(new THREE.CircleGeometry(2.6, 64), new THREE.MeshStandardMaterial({ color: 0x050d10, roughness: 0.98 }));
    chao.rotation.x = -Math.PI / 2; chao.receiveShadow = true; cena.add(chao);
    ajustarTamanho();
    if (window.ResizeObserver) new ResizeObserver(ajustarTamanho).observe($('scene'));
  }

  /* O tamanho vem do CANVAS, não de `innerWidth`.
     Medido em 17/09/2026 a 390×844: a tela tinha 390 e o canvas 406 — 4% de
     diferença. Isso não é só um corte na imagem: todo toque é convertido para
     coordenadas de tela, e com a régua errada o dedo acerta um ponto que não é
     o que ele viu. `setSize(..., false)` deixa a folha mandar no tamanho em
     CSS e só o buffer de desenho é acertado aqui. */
  function ajustarTamanho() {
    if (!renderer || !camera) return;
    var caixa = renderer.domElement.getBoundingClientRect();
    var l = Math.max(1, Math.round(caixa.width)), a = Math.max(1, Math.round(caixa.height));
    renderer.setSize(l, a, false);
    /* Em RA a lente é a do aparelho (a 8th Wall entrega a matriz a cada
       quadro): recalcular aqui desfaria o alinhamento com a imagem. */
    if (ra && ra.ativo()) return;
    camera.aspect = l / a;
    camera.updateProjectionMatrix();
    aplicarMoldura();
  }

  /* Coordenadas normalizadas a partir do retângulo REAL do canvas. */
  function ndc(x, y) {
    var c = renderer.domElement.getBoundingClientRect();
    return new THREE.Vector2(((x - c.left) / c.width) * 2 - 1, 1 - ((y - c.top) / c.height) * 2);
  }
  function larguraDaTela() { return renderer.domElement.getBoundingClientRect().width; }
  function alturaDaTela() { return renderer.domElement.getBoundingClientRect().height; }

  /* ---------- a área livre ----------
     A cena é desenhada no vão que as janelas deixam: entre a barra do topo (ou
     o diálogo do portal) e a faixa baixa (ou o rodapé). Sem isto o que o
     jogador precisa tocar nasce atrás do painel, e nada na tela diz que falta
     girar. Mexe só no enquadramento da imagem — a câmera não se move, então
     recolher e abrir os painéis não desfaz o giro que o jogador escolheu. */
  function areaLivre() {
    var a = alturaDaTela(), topo = 0, base = a;
    var barra = document.querySelector('.topbar');
    if (barra && getComputedStyle(barra).visibility !== 'hidden') topo = Math.max(topo, barra.getBoundingClientRect().bottom);
    var portal = $('portal');
    if (portal && portal.open) topo = Math.max(topo, portal.getBoundingClientRect().bottom);
    var pilha = document.querySelector('.ac-panel-stack');
    var paisagem = false;
    try { paisagem = matchMedia('(max-height:560px)').matches; } catch (e) {}
    var esquerda = 0, largura = larguraDaTela();
    var pilhaAberta = pilha && getComputedStyle(pilha).visibility !== 'hidden' && pilha.getBoundingClientRect().height > 0;
    if (pilhaAberta && !paisagem) base = Math.min(base, pilha.getBoundingClientRect().top);
    /* Na paisagem a faixa baixa é COLUNA à esquerda: o vão livre é o que
       sobra à direita dela (medido a 800×540, a casa ficava meio atrás). */
    if (pilhaAberta && paisagem) esquerda = Math.max(0, pilha.getBoundingClientRect().right);
    var tools = document.querySelector('.tools');
    if (tools && tools.getBoundingClientRect().height > 0) base = Math.min(base, tools.getBoundingClientRect().top);
    if (base - topo < a * 0.3) { topo = 0; base = a; }
    if (largura - esquerda < largura * 0.4) esquerda = 0;
    return { topo: topo, base: base, altura: a, esquerda: esquerda, largura: largura };
  }
  function aplicarMoldura() {
    if (!camera || !renderer || renderer.xr.isPresenting) return;
    /* Em RA a imagem é a do mundo: deslocar o quadro soltaria a casa do
       lugar onde ela foi pousada. */
    if (ra && ra.ativo()) return;
    var l = larguraDaTela(), livre = areaLivre();
    var centro = (livre.topo + livre.base) / 2;
    var desvio = Math.round(livre.altura / 2 - centro);
    var lado = -Math.round(livre.esquerda / 2);
    if (Math.abs(desvio) < 2 && !lado) camera.clearViewOffset();
    else camera.setViewOffset(l, livre.altura, lado, desvio, l, livre.altura);
  }

  /* Metade do MENOR ângulo da lente. No telefone em pé o ângulo horizontal é
     bem mais estreito que o vertical (proporção 0,46): medir a distância só
     pelo vertical deixava a maçaneta fora da tela, à direita, no recorte da
     procura (volta 3, 17/09/2026). */
  function meiaLente() {
    var v = camera.fov * Math.PI / 360;
    var livre = areaLivre();
    /* O vão livre entre as janelas encolhe o ângulo vertical útil. */
    var util = Math.atan(Math.tan(v) * Math.max(0.2, (livre.base - livre.topo) / Math.max(1, livre.altura)));
    var h = Math.atan(Math.tan(v) * camera.aspect * Math.max(0.3, (livre.largura - livre.esquerda) / Math.max(1, livre.largura)));
    return Math.min(util, h);
  }

  /* ---------- enquadramento da bancada ---------- */

  /* Enquadra o que o CAPÍTULO usa: a casa, mais os pontos da vez.
     Duas medições, uma depois da outra:
     · com a maquete inteira (penhasco e rochedos soltos) a câmera ia longe
       demais e a chave virava meia dúzia de pixels;
     · só com a casa, três dos quatro alvos do primeiro capítulo — que ficam
       no portão, na outra ponta do terreno — saíam da tela. */
  function enquadrar() {
    if (!mundo || !controles) return;
    /* Em RA quem enquadra é o jogador, andando. */
    if (ra && ra.ativo()) return;
    /* As posições de mundo dos pontos vêm das matrizes da maquete, que só se
       atualizam ao desenhar. Logo depois de pousar a casa (ou num aparelho
       que ainda não desenhou o quadro seguinte) elas estavam velhas, e o
       quadro mirava onde a casa ESTAVA: medido na volta 3, os pontos da sala
       escura nasciam amontoados na borda esquerda, um deles fora da tela. */
    mundo.raiz.updateMatrixWorld(true);
    var casa = new THREE.Box3(), i;
    /* As camadas já abertas ficam de fora: erguidas e invisíveis, elas
       esticavam a caixa 0,62 para cima e a câmera recuava até a casa virar
       um selo (volta 1, andar dos quartos). */
    var abertasAgora = camadasAbertas();
    for (i = 0; i < mundo.ordemDasCamadas.length; i++) {
      var nome = mundo.ordemDasCamadas[i];
      if (nome !== 'terreno' && abertasAgora.indexOf(nome) < 0) casa.expandByObject(mundo.camadas[nome]);
    }
    if (casa.isEmpty()) casa.setFromObject(mundo.raiz);
    var centro = casa.getCenter(new THREE.Vector3());

    var tudo = casa.clone();
    var ativos = alvosAtivos(), pontos = [];
    for (i = 0; i < ativos.length; i++) pontos.push(ativos[i].grupo.localToWorld(ativos[i].centro.clone()));
    var fech = dados && dados.fechadura && mundo.fechaduras[dados.fechadura];
    var pontoFechadura = fech ? fech.grupo.localToWorld(fech.centro.clone()) : null;
    for (i = 0; i < pontos.length; i++) tudo.expandByPoint(pontos[i]);
    if (pontoFechadura) tudo.expandByPoint(pontoFechadura);

    /* No fim a câmera vai para a passagem: é a única coisa que a atividade
       inteira serviu para achar. */
    var foco = null;
    if (dados && dados.complete && mundo.revelacao && mundo.revelacao.pecas.length) {
      tudo = new THREE.Box3().expandByObject(mundo.camadas['porao']);
      var alvoFinal = mundo.revelacao.grupo.localToWorld(mundo.revelacao.centro.clone());
      tudo.expandByPoint(alvoFinal);
      centro.copy(tudo.getCenter(new THREE.Vector3())).lerp(alvoFinal, 0.35);
      foco = alvoFinal.clone();
    } else if (pontoFechadura && dados.papel !== 'chave') foco = pontoFechadura.clone();
    else if (pontos.length && !procurando()) {
      foco = new THREE.Vector3();
      for (i = 0; i < pontos.length; i++) foco.add(pontos[i]);
      foco.multiplyScalar(1 / pontos.length);
    }

    /* Puxar o centro da órbita para o que interessa. Medido em duas abas
       (17/09/2026): com o alvo no meio da casa, a maçaneta projetava em y=579
       de 600, encostada na barra de ferramentas. */
    if (foco && !(dados && dados.complete)) centro.lerp(foco, 0.32);

    var alcance = 0;
    var cantos = [tudo.min, tudo.max,
      new THREE.Vector3(tudo.min.x, tudo.min.y, tudo.max.z), new THREE.Vector3(tudo.max.x, tudo.min.y, tudo.min.z),
      new THREE.Vector3(tudo.min.x, tudo.max.y, tudo.max.z), new THREE.Vector3(tudo.max.x, tudo.max.y, tudo.min.z)];
    for (i = 0; i < cantos.length; i++) alcance = Math.max(alcance, cantos[i].distanceTo(centro));
    var distancia = alcance / Math.sin(meiaLente());

    /* Procurando, o quadro é a CASA — não o recorte da pista. Fechar no
       recorte (como era até 18/09/2026) apontava onde estavam os candidatos:
       uma marca sem marca. Sem marcas na maquete, o quadro também não marca. */
    /* Volta 3 (18/09/2026): no ato do encaixe, quem tem a FECHADURA na
       tela (quem guia, e o Solo) via a casa inteira — a tolerância de 0,03
       virava um vão de ~7 px a 390×844, menor que a ponta de um dedo. O
       quadro fecha na fechadura (e na chave, no Solo). Quem tem só a chave
       continua vendo a casa toda: fechar o quadro nele apontaria onde está a
       fechadura que ele não pode ver. */
    var fechandoNaChave = !procurando() && ambosAcharam() && !(dados && dados.complete) && papelDaVista() === 'chave' && pontos.length > 1;
    if ((!procurando() && ambosAcharam() && pontoFechadura && !(dados && dados.complete) && papelDaVista() !== 'chave') || fechandoNaChave) {
      tudo = new THREE.Box3();
      if (pontoFechadura) tudo.expandByPoint(pontoFechadura);
      /* Quem tem só a chave: o quadro fecha no RECORTE da pista — os mesmos
         pontos que os dois procuraram, que o colega também conhece —, e não
         na fechadura. Medido na volta 3 em duas abas: com a casa inteira (e o
         mirante novo esticando a caixa para cima), o vão do encaixe tinha
         5,5 px de raio a 390×844. */
      if (fechandoNaChave) for (i = 0; i < pontos.length; i++) tudo.expandByPoint(pontos[i]);
      if (mundo.chave.visible) tudo.expandByPoint(mundo.raiz.localToWorld(mundo.chave.position.clone()));
      tudo.expandByScalar(fechandoNaChave ? 0.13 : 0.11);
      centro.copy(tudo.getCenter(new THREE.Vector3()));
      alcance = 0;
      cantos = [tudo.min, tudo.max,
        new THREE.Vector3(tudo.min.x, tudo.min.y, tudo.max.z), new THREE.Vector3(tudo.max.x, tudo.min.y, tudo.min.z),
        new THREE.Vector3(tudo.min.x, tudo.max.y, tudo.max.z), new THREE.Vector3(tudo.max.x, tudo.max.y, tudo.min.z)];
      for (i = 0; i < cantos.length; i++) alcance = Math.max(alcance, cantos[i].distanceTo(centro));
      distancia = alcance / Math.sin(meiaLente());
    }

    /* E a câmera nasce do lado do que ESTE jogador tem para fazer. */
    var lado = new THREE.Vector3(0.85, 0, 1.15);
    if (foco) {
      foco.sub(centro); foco.y = 0;
      if (foco.lengthSq() > 1e-6) lado.copy(foco).normalize();
    }
    lado.normalize();
    lado.y = dados && dados.complete ? 0.34 : 0.86;
    /* ...e do lado de onde os pontos se VEEM. Medido na volta 1: do lado
       "natural", os dois armários do andar dos quartos ficavam atrás da
       fachada — o raio batia na pedra —, e o esconderijo era um deles. Testa
       oito lados em volta e fica com o que mostra mais pontos da vez. */
    var queVer = ativos.slice();
    if (fech && !procurando()) queVer = [fech];
    if (queVer.length && !(dados && dados.complete)) lado = ladoQueMostra(centro, distancia * 1.02, lado, queVer);
    /* A distância já mede o vão livre e a lente mais estreita (meiaLente);
       a moldura põe o centro da imagem no meio desse vão. */
    controles.target.copy(centro);
    camera.position.copy(centro).add(lado.normalize().multiplyScalar(distancia * 1.02));
    aplicarMoldura();
    controles.update();
  }

  /* Quantos dos conjuntos se veem de uma posição de câmera. Camadas que já
     foram abertas não contam como obstáculo: no instante do enquadramento
     elas ainda estão subindo, mas vão sumir. */
  function camadaDoObjeto(o) {
    for (var n = o; n; n = n.parent) {
      for (var nome in mundo.camadas) if (mundo.camadas[nome] === n) return nome;
    }
    return null;
  }
  /* Volta 2 (18/09/2026, modelo novo): o relógio agora é DE PAREDE e os
     castiçais ficam atrás de tabiques. Mirar no CENTRO do conjunto e aceitar
     "bateu em algo a 2 cm dele" contava como visto o relógio visto por TRÁS
     da parede — o raio batia no reboco a 1,2 cm do mostrador. Agora cada
     conjunto é mirado em até quatro peças suas, e só conta se o PRIMEIRO
     obstáculo for ele mesmo. */
  function pontosDoConjunto(c) {
    var lista = [], malhas = [];
    c.grupo.traverse(function (o) { if (o.isMesh && o.geometry && o.geometry.type !== 'RingGeometry' && o.visible) malhas.push(o); });
    lista.push(c.grupo.localToWorld(c.centro.clone()));
    for (var i = 0; i < malhas.length && lista.length < 5; i += Math.max(1, Math.floor(malhas.length / 4))) {
      if (!malhas[i].geometry.boundingSphere) malhas[i].geometry.computeBoundingSphere();
      lista.push(malhas[i].localToWorld(malhas[i].geometry.boundingSphere.center.clone()));
    }
    return lista;
  }
  function quantosSeVeem(posicao, conjuntos) {
    var abertas = camadasAbertas(), vistos = 0, dir = new THREE.Vector3();
    for (var i = 0; i < conjuntos.length; i++) {
      var c = conjuntos[i], pontos = pontosDoConjunto(c), bons = 0;
      for (var p = 0; p < pontos.length; p++) {
        dir.copy(pontos[p]).sub(posicao);
        var longe = dir.length(); dir.normalize();
        raio.set(posicao, dir); raio.far = longe + 0.05;
        var hits = raio.intersectObject(mundo.raiz, true);
        raio.far = Infinity;
        for (var k = 0; k < hits.length; k++) {
          var h = hits[k];
          if (!h.object.isMesh || !objetoVisivel(h.object) || (h.object.geometry && h.object.geometry.type === 'RingGeometry')) continue;
          if (abertas.indexOf(camadaDoObjeto(h.object)) >= 0) continue;
          if (donoDoToque(h.object) === c.grupo) bons++;
          break;
        }
      }
      if (bons) vistos += 1 + bons / (pontos.length * 10);
    }
    return vistos;
  }
  /* Duas alturas: a de sempre e uma mais de cima, que olha para DENTRO dos
     cômodos por cima das paredes. Medido na volta 2 (Solo, térreo): com
     cinco pontos na sala escura, nenhum dos oito lados na altura de sempre
     mostrava o relógio — e era ele o esconderijo. */
  var ALTURAS = [0.86, 1.8, 0.5];
  function ladoQueMostra(centro, distancia, base, conjuntos) {
    var melhor = null, melhorN = -1, eixo = new THREE.Vector3(0, 1, 0);
    mundo.raiz.updateMatrixWorld(true);
    /* Doze lados por altura, e a busca só para quando TODOS os pontos se
       veem de verdade (a parte fracionária da nota desempata pelo quanto de
       cada um aparece). */
    for (var h = 0; h < ALTURAS.length && melhorN < conjuntos.length + 0.05; h++) {
      var plano = new THREE.Vector3(base.x, 0, base.z).normalize();
      for (var k = 0; k < 12; k++) {
        var d = plano.clone().applyAxisAngle(eixo, k * Math.PI / 6);
        d.y = ALTURAS[h]; d.normalize();
        var n = quantosSeVeem(centro.clone().add(d.clone().multiplyScalar(distancia)), conjuntos);
        if (n > melhorN + 1e-6) { melhorN = n; melhor = d; }
      }
    }
    return melhor || base;
  }

  /* ---------- camadas ---------- */

  function camadasAbertas() { return (dados && dados.camadasAbertas) || []; }

  function animarCamadas(dt) {
    var abertas = camadasAbertas();
    /* O terreno nunca se levanta — ele vira FANTASMA no fim. A passagem sai da
       fundação e corre por baixo do chão: com o terreno sólido ela não é vista
       de ângulo nenhum. */
    var fantasma = !!(dados && dados.complete);
    var alvoTerreno = fantasma ? 0.20 : 1;
    fantasmaTerreno += (alvoTerreno - fantasmaTerreno) * (reduzido ? 1 : 1 - Math.exp(-dt * 2.2));
    if (Math.abs(alvoTerreno - fantasmaTerreno) < 0.005) fantasmaTerreno = alvoTerreno;
    aplicarTransparencia(mundo.camadas['terreno'], fantasmaTerreno);
    for (var i = 0; i < mundo.ordemDasCamadas.length; i++) {
      var nome = mundo.ordemDasCamadas[i], grupo = mundo.camadas[nome];
      if (nome === 'terreno') continue;
      var alvo = abertas.indexOf(nome) >= 0 ? 1 : 0;
      var atual = progressoDasCamadas[nome] || 0;
      atual = reduzido ? alvo : atual + (alvo - atual) * (1 - Math.exp(-dt * 3.2));
      if (Math.abs(alvo - atual) < 0.002) atual = alvo;
      progressoDasCamadas[nome] = atual;
      grupo.position.y = alturaAberta * atual;
      grupo.visible = atual < 0.99;
      /* A camada sobe OPACA e só se apaga no fim do percurso. */
      var opacidade = atual <= 0.55 ? 1 : 1 - (atual - 0.55) / 0.45;
      if (opacidade < 1) aplicarTransparencia(grupo, opacidade);
      else if (grupo.userData.opaco !== true) aplicarTransparencia(grupo, 1);
    }
  }

  function aplicarTransparencia(grupo, opacidade) {
    grupo.userData.opaco = opacidade >= 1;
    grupo.traverse(function (o) {
      if (!o.isMesh || !o.material || o.userData.halo) return;
      if (o.material.userData && o.material.userData.anel) return;
      o.material.transparent = opacidade < 1;
      o.material.opacity = opacidade;
      o.material.depthWrite = opacidade >= 1;
    });
  }

  /* ---------- papéis e pontos ---------- */

  function papelDaVista() { return dados ? dados.papel : null; }
  function temLadoDaChave() { var p = papelDaVista(); return p === 'chave' || p === 'ambos'; }
  function temLadoDaFechadura() { var p = papelDaVista(); return p === 'fechadura' || p === 'ambos'; }
  function ambosAcharam() { return !!(dados && dados.key && dados.lock); }
  /* Ainda procurando? Cada lado procura até achar o SEU objeto. */
  function procurando() {
    if (!dados || dados.complete) return false;
    if (papelDaVista() === 'chave') return !dados.key;
    if (papelDaVista() === 'fechadura') return !dados.lock;
    return !ambosAcharam();
  }

  /* Um ponto da vez é um alvo do modelo OU uma fechadura: no aparelho de quem
     a procura, a fechadura é só mais um lugar aceso entre os outros. */
  function conjuntoDe(id) { return mundo && (mundo.alvos[id] || mundo.fechaduras[id]) || null; }
  function alvosAtivos() {
    if (!dados || dados.complete || !mundo) return [];
    var lista = [], ids = dados.alvos || [];
    for (var i = 0; i < ids.length; i++) {
      var c = conjuntoDe(ids[i]);
      if (c) lista.push(c);
      /* Motor e modelo discordando sobre o nome de um alvo é a falha mais muda
         que esta atividade tem: a cena fica inteira, o toque não responde e
         nada aparece na tela. Custou uma hora em 17/09/2026. */
      else if (!avisados[ids[i]]) { avisados[ids[i]] = true; console.error('[maquete] o capítulo pede o alvo "' + ids[i] + '", que não existe neste modelo'); }
    }
    return lista;
  }
  var avisados = {};

  function podeExplorar() {
    return !!(online && dados && !dados.complete && posta());
  }
  function posta() { return !!(ra && ra.estado().posta); }
  function podeMoverChave() { return podeExplorar() && temLadoDaChave() && ambosAcharam(); }

  /* Medido na tela: com 0,35 de teto o anel some sobre a pedra e sobre o
     lajeado claros. O que marca o objeto tocável tem de ser visto de longe. */
  function pulso(t) { return 0.62 + 0.30 * Math.sin(t * 3.2); }

  function pintarMarca(conj, cor) {
    if (conj.halo && conj.halo.material.color.getHex() !== cor) conj.halo.material.color.setHex(cor);
    if (conj.pino && conj.pino.userData.marca && conj.pino.userData.marca.color && conj.pino.userData.marca.color.getHex() !== cor) conj.pino.userData.marca.color.setHex(cor);
  }

  function atualizarRealces(tempo) {
    if (!mundo) return;
    /* NADA vem marcado na procura (Mario, 18/09/2026: "as pistas estão
       marcadas no chão, e também não deveriam, pois assim fica só em clicar
       e deu, não precisa procurar"). Os anéis, os alfinetes e o brilho dos
       candidatos ficam apagados; o que acende é só o que já foi ACHADO — a
       fechadura, no aparelho de quem a achou — e a passagem no fim. */
    var ativos = [];
    var todos = [];
    for (var id in mundo.alvos) todos.push(mundo.alvos[id]);
    for (var fid in mundo.fechaduras) todos.push(mundo.fechaduras[fid]);
    for (var i = 0; i < todos.length; i++) {
      var a = todos[i];
      var ligado = ativos.indexOf(a) >= 0;
      /* Procurando, TODO ponto aceso tem a mesma cor: a fechadura acesa em
         ouro no meio dos outros entregaria qual é qual. */
      if (ligado) pintarMarca(a, AZUL);
      a.halo.material.opacity = ligado ? pulso(tempo) * 0.6 : 0;
      a.halo.visible = ligado;
      a.pino.userData.marca.opacity = ligado ? pulso(tempo) : 0;
      a.pino.visible = ligado;
      if (a.acender) a.acender(ligado ? 0x1d6b58 : 0x000000, ligado ? 0.55 + 0.35 * Math.sin(tempo * 3.2) : 0);
    }
    var revelada = !!(dados && dados.complete);
    if (mundo.revelacao && mundo.revelacao.pino) {
      mundo.revelacao.pino.userData.marca.opacity = revelada ? 0.62 + 0.3 * Math.sin(tempo * 2.2) : 0;
      mundo.revelacao.pino.visible = revelada;
      mundo.revelacao.halo.material.opacity = revelada ? 0.4 : 0;
      mundo.revelacao.halo.visible = revelada;
      if (mundo.revelacao.acender) mundo.revelacao.acender(revelada ? 0x7a4a16 : 0x000000, revelada ? 0.55 + 0.3 * Math.sin(tempo * 2.0) : 0);
    }
    /* A fechadura ACHADA acende em ouro — só no aparelho de quem a achou. O
       de quem tem a chave nem recebe o identificador dela. */
    var idFechadura = dados && dados.fechadura;
    for (var k = 0; k < mundo.ancoras.length; k++) {
      var anc = mundo.ancoras[k];
      var acesa = !!(idFechadura && anc.id === idFechadura && posta());
      var brilho = 0.62 + 0.30 * Math.sin(tempo * 2.6);
      anc.halo.material.opacity = acesa ? brilho * 0.6 : 0;
      anc.halo.visible = acesa;
      anc.pino.userData.marca.opacity = acesa ? brilho : 0;
      anc.pino.visible = acesa;
      if (anc.peca && acesa) {
        if (anc.peca.halo) { pintarMarca(anc.peca, OURO); anc.peca.halo.material.opacity = 0.3; anc.peca.halo.visible = true; }
        if (anc.peca.pino) { anc.peca.pino.userData.marca.opacity = 0; anc.peca.pino.visible = false; }
        if (anc.peca.acender) anc.peca.acender(0x8a5a12, brilho);
      }
    }
    /* A fixa resiste: quando alguém tenta arrastá-la, a peça treme no lugar. */
    if (idFechadura && mundo.fechaduras[idFechadura]) {
      var g = mundo.fechaduras[idFechadura].grupo;
      if (tremor > 0) { g.position.x = Math.sin(tempo * 70) * 0.004 * tremor; tremor = Math.max(0, tremor - 0.05); }
      else if (g.position.x !== 0) g.position.x = 0;
    }
  }

  /* ---------- transporte ---------- */

  function enviar(tipo, extra) {
    if (!online || !coop || pendente) return Promise.resolve(false);
    pendente = true;
    return coop.send(tipo, extra || {}).catch(function () { avisar('Aguarde a reconexão da dupla.', 9); return false; })
      .then(function (r) { pendente = false; return r; }, function () { pendente = false; return false; });
  }

  function pontaLocal() {
    return mundo.raiz.worldToLocal(mundo.chavePonta.getWorldPosition(new THREE.Vector3())).toArray();
  }

  function publicarMovimento(forcar) {
    if (!coop || !podeMoverChave()) return Promise.resolve(false);
    if (!forcar && (envioOcupado || performance.now() - ultimoEnvio < 100)) return Promise.resolve(false);
    if (forcar && envioPendente) { try { return envioPendente.catch(function () {}).then(function () { return publicarMovimento(true); }); } catch (e) {} }
    ultimoEnvio = performance.now(); envioOcupado = true;
    envioPendente = coop.send('maquete_mover', { tip: pontaLocal() });
    return envioPendente.catch(function () { return false; }).then(function (r) { envioOcupado = false; envioPendente = null; return r; });
  }

  function examinar(id) {
    if (!podeExplorar() || !procurando()) return;
    entrarAtividade();
    ultimoExaminado = id; examinadoEm = performance.now();
    enviar('maquete_examinar', { object: id });
  }

  function encaixar() {
    if (terminando || !podeMoverChave()) return;
    terminando = true;
    publicarMovimento(true).then(function (ok) {
      if (!ok) { terminando = false; return; }
      return enviar('maquete_encaixar').then(function (aceito) {
        if (!aceito) avisar('A ponta não achou onde entrar.', 7);
      });
    }).then(function () { terminando = false; poeira.resetTrail(); });
  }

  /* ---------- texto de tela ----------
     Os textos descrevem o MUNDO, nunca explicam a mecânica. Ninguém lê "você
     tem a chave": o papel se revela pelo que acontece na mão e no aparelho do
     colega. */

  function textos() {
    var passo = $('step'), titulo = $('heading'), descricao = $('description'), painel = document.querySelector('.instruction');
    var nivel = 2;
    /* Atividade ainda trancada vem ANTES de tudo: pedir para pôr a casa na
       mesa, e só depois dizer que não era aqui, é dar uma volta à toa. */
    if (recebeuEstado && !dados) {
      passo.textContent = 'AINDA NÃO';
      titulo.textContent = 'A maquete continua fechada.';
      descricao.textContent = 'A etiqueta sob a escrivaninha é o que abre esta caixa. Volte e registre a descoberta.';
      $('score').textContent = '';
    } else if (!posta()) {
      passo.textContent = 'A CAIXA FECHADA';
      var e = ra && ra.estado();
      if (e && e.modo === 'ra') {
        titulo.textContent = 'Procure a mesa.';
        descricao.textContent = !e.rastreando ? 'Mova o aparelho devagar, de um lado para o outro, apontando para a mesa.'
          : e.temHit ? 'Toque na tela para apoiar a casa onde está o círculo.' : 'Aponte para uma superfície plana, com luz.';
        nivel = 4;
      }
      else { titulo.textContent = 'Ponha a maquete na mesa.'; descricao.textContent = 'A investigação começa quando a casa estiver apoiada à sua frente.'; }
      $('score').textContent = '';
    } else if (!dados) {
      passo.textContent = 'A CAIXA FECHADA';
      titulo.textContent = 'A maquete espera.';
      descricao.textContent = 'A pista da escrivaninha é o que abre esta caixa.';
    } else if (dados.complete) {
      passo.textContent = 'O PORÃO';
      titulo.textContent = 'O espaço que faltava.';
      descricao.textContent = dados.expired ? 'O tempo acabou e a maquete se abriu sozinha até o porão. A descoberta foi guardada.' : 'A maquete se abriu até o porão. A descoberta foi guardada.';
      $('score').textContent = 'Camadas 3 de 3 · ' + dados.score + ' pontos';
    } else {
      passo.textContent = 'Camada ' + (dados.evidence.length + 1) + ' de 3 · ' + dados.name;
      $('score').textContent = relogioDaTela();
      /* A pista é a mesma nos dois aparelhos: é ela que manda no painel, que
         vira "Dica da pista" enquanto ela vale. */
      titulo.textContent = dados.pista;
      nivel = 4;
      if (!online) descricao.textContent = solo ? 'A maquete está parada.' : 'Do outro lado da mesa, ninguém responde. O progresso está guardado.';
      else if (!ambosAcharam()) descricao.textContent = dados.achado ? dados.achado + (solo ? ' Falta a outra metade.' : ' Sozinho, isso não abre nada.') : 'Alguma coisa ficou para trás aqui.';
      else descricao.textContent = dados.achado || '';
      var e2 = ra && ra.estado();
      if (e2 && e2.modo === 'ra' && !e2.rastreando) descricao.textContent = 'A câmera perdeu a mesa. Mova o aparelho devagar e aponte para a maquete.';
    }
    pintarDica();
    if (window.ACJanelas && window.ACJanelas.nivel) window.ACJanelas.nivel(painel, nivel);
  }

  /* O relógio da maquete e o que a camada vale agora. */
  function relogioDaTela() {
    if (!dados || dados.complete || !dados.tempo) return '';
    var r = window.ACRitmo;
    return '⏳ ' + r.relogio(dados.tempo.restante) + ' · camada ' + (dados.evidence.length + 1) + ' de 3 vale ' + dados.pontosAgora + ' · ' + dados.score + ' pontos até aqui';
  }
  /* A dica: aparece no painel e, quando chega, num aviso. */
  function pintarDica() {
    var el = $('dica'), d = dados && !dados.complete && dados.dica;
    if (!d || !d.nivel || !d.texto || !posta()) { el.hidden = true; return; }
    el.hidden = false;
    el.textContent = (d.nivel === 1 ? '💡 Dica: ' : '💡 Dica 2: ') + d.texto;
    var marca = dados.level + '/' + d.parte + '/' + d.nivel;
    if (marca !== nivelDaDicaVisto) {
      nivelDaDicaVisto = marca;
      avisar((d.nivel === 1 ? 'Uma dica chegou.' : 'Mais uma dica chegou.') + ' ' + d.texto, 3);
      vida();
    }
  }

  function pintarTela() {
    var pronto = posta();
    var e = ra && ra.estado();
    /* O portal é a decisão de entrada: enquanto ele estiver aberto, nada da
       cena é tocável. Ele sai assim que um modo é escolhido; daí em diante
       quem fala é a orientação. */
    var escolhendo = !ra || (e.modo === 'mesa' && !pronto && !modoEscolhido);
    $('sair-ra').hidden = !(e && e.modo === 'ra');
    $('ra-opcoes').hidden = !(e && e.modo === 'ra' && pronto);
    /* Se a atividade ainda não foi liberada (a etiqueta da escrivaninha não
       foi registrada), não faz sentido pedir para pôr a casa na mesa. */
    var liberada = !recebeuEstado || !!dados;
    var mostrarPortal = !pronto && escolhendo && liberada && !!mundo;
    var portal = $('portal');
    if (mostrarPortal && !portal.open) { try { portal.showModal(); } catch (err) { portal.setAttribute('open', ''); } setTimeout(enquadrar, 30); }
    else if (!mostrarPortal && portal.open) { try { portal.close(); } catch (err) { portal.removeAttribute('open'); } setTimeout(enquadrar, 30); }
    document.body.classList.toggle('maquete-posta', pronto);
    textos();
    var temDados = !!dados && !dados.complete;
    document.body.dataset.roleMode = !temDados ? 'complete' : papelDaVista();
    /* Os botões de apoio são do modo sem RA. */
    var semRa = !(e && e.modo === 'ra');
    $('alternative').hidden = !(semRa && podeExplorar() && procurando());
    $('reposition').hidden = true;
    $('portal-voltar').hidden = !(recebeuEstado && !dados);
    $('key-grip').hidden = !podeMoverChave();
    $('lock-grip').hidden = !(podeExplorar() && temLadoDaFechadura() && ambosAcharam());
    if (mundo) mundo.chave.visible = !!(temDados && dados.key && temLadoDaChave() && pronto);
  }

  /* ---------- toques na cena ---------- */

  function objetoVisivel(o) { for (var n = o; n; n = n.parent) if (!n.visible) return false; return true; }

  function cameraAgora() { return ra ? ra.cameraAtiva() : camera; }

  /* O dedo não tem a precisão do raio.
     Medido a 390×844 em 17/09/2026: a pedra do caminho ocupa cerca de SEIS
     pixels de largura. Então o toque varre ANÉIS em volta do ponto: primeiro o
     próprio ponto, depois 18 px, depois 32 px. O primeiro anel que encontrar
     um ponto aceso ganha. Dentro de um anel, vale o mais PERTO da câmera.
     Parede na frente continua barrando. */
  var ANEIS = [0, 18, 32];
  function donoDoToque(o) {
    for (var n = o; n; n = n.parent) {
      if (n.userData && (n.userData.object || n.userData.fechadura)) return n;
    }
    return null;
  }
  function tocarNaCena(x, y) {
    if (!posta()) {
      if (ra.estado().modo === 'ra' && !ra.estado().temHit) { avisar('Aponte para a mesa até aparecer o círculo.', 7); return; }
      if (ra.posicionar()) { entrarAtividade(); setTimeout(enquadrar, 30); }
      pintarTela(); return;
    }
    if (!podeExplorar() || !procurando()) return;
    var alvos = alvosAtivos(); if (!alvos.length) return;
    var visiveis = alvos.map(function (a) { return a.grupo; });
    var camera3 = cameraAgora();
    for (var r = 0; r < ANEIS.length; r++) {
      var passos = ANEIS[r] === 0 ? 1 : 8, melhor = null;
      for (var k = 0; k < passos; k++) {
        var ang = (k / passos) * Math.PI * 2;
        var px = x + Math.cos(ang) * ANEIS[r], py = y + Math.sin(ang) * ANEIS[r];
        raio.setFromCamera(ndc(px, py), camera3);
        /* Só MALHAS contam. A poeira dourada de um achado (um sistema de
           pontos dentro da maquete) ficava na frente do raio por um ou dois
           segundos e engolia o toque seguinte — medido na volta 2 do Solo,
           tocando na maçaneta logo depois de achar a chave. */
        var acertos = raio.intersectObject(mundo.raiz, true).filter(function (h) {
          return h.object.isMesh && objetoVisivel(h.object) && h.object.geometry && h.object.geometry.type !== 'RingGeometry';
        });
        if (!acertos.length) continue;
        var dono = donoDoToque(acertos[0].object);
        if (!dono || visiveis.indexOf(dono) < 0) continue;
        var id = dono.userData.object || dono.userData.fechadura;
        if (!melhor || acertos[0].distance < melhor.distancia) melhor = { id: id, distancia: acertos[0].distance };
      }
      if (melhor) { examinar(melhor.id); return; }
    }
    /* Tocou na casa, mas não num ponto que esconde nada: a resposta é a mesma
       de um engano, sem custo — procurar é tocar. */
    raio.setFromCamera(ndc(x, y), camera3);
    var algo = raio.intersectObject(mundo.raiz, true).some(function (h) { return h.object.isMesh && objetoVisivel(h.object) && !h.object.userData.chave; });
    if (algo) { avisar('Nada aqui.', 7); vida(); }
  }

  /* ---------- gestos ---------- */

  function ligarGestos() {
    var tela = renderer.domElement;
    on(tela, 'pointerdown', function (e) {
      if (!ra || !mundo) return;
      toques.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (toques.size === 1) { tocouEm = { x: e.clientX, y: e.clientY, t: performance.now() }; giroAtivo = { x: e.clientX }; }
      if (toques.size === 2) { pinca = distanciaEntreToques(); giroAtivo = null; tocouEm = null; }
      try { tela.setPointerCapture(e.pointerId); } catch (err) {}
    });
    on(tela, 'pointermove', function (e) {
      if (!ra || !toques.has(e.pointerId)) return;
      toques.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (toques.size === 2) {
        var d = distanciaEntreToques();
        if (pinca > 0 && ra.estado().modo !== 'mesa') ra.mudarEscala(d / pinca);
        pinca = d; tocouEm = null; return;
      }
      if (giroAtivo && ra.estado().modo !== 'mesa' && posta()) {
        var dx = e.clientX - giroAtivo.x;
        if (Math.abs(dx) > 0.5) { ra.girar(dx * 0.0045); giroAtivo.x = e.clientX; }
      }
      if (tocouEm && Math.hypot(e.clientX - tocouEm.x, e.clientY - tocouEm.y) > 9) tocouEm = null;
    });
    ['pointerup', 'pointercancel'].forEach(function (tipo) {
      on(tela, tipo, function (e) {
        if (!ra) return;
        toques.delete(e.pointerId); if (toques.size < 2) pinca = 0;
        if (toques.size === 0) giroAtivo = null;
        if (tipo === 'pointerup' && tocouEm && performance.now() - tocouEm.t < 900 &&
            Math.hypot(e.clientX - tocouEm.x, e.clientY - tocouEm.y) <= 9) tocarNaCena(e.clientX, e.clientY);
        if (toques.size === 0) tocouEm = null;
      });
    });
  }

  function distanciaEntreToques() {
    var v = Array.from(toques.values());
    if (v.length < 2) return 0;
    return Math.hypot(v[0].x - v[1].x, v[0].y - v[1].y);
  }

  /* ---------- a metade fixa: a recusa ----------
     Quem tem a fechadura também tenta arrastar — e a peça resiste: chacoalha,
     volta ao lugar, e na primeira vez não há texto nenhum. Insistindo, aparece
     a frase que diz de quem é a outra metade. "Não acontece nada" seria
     indistinguível de travamento, e o jogador culparia o jogo. */
  function ligarFixa() {
    var pega = $('lock-grip'), inicio = null;
    on(pega, 'pointerdown', function (e) {
      if (!podeExplorar() || !ambosAcharam()) return;
      e.preventDefault(); inicio = { x: e.clientX, y: e.clientY };
      try { pega.setPointerCapture(e.pointerId); } catch (err) {}
    });
    on(pega, 'pointermove', function (e) {
      if (!inicio) return;
      /* Um palmo de elástico, e não mais: ela "quer" vir e não vem. */
      var dx = e.clientX - inicio.x, dy = e.clientY - inicio.y, d = Math.hypot(dx, dy) || 1, k = Math.min(10, d) / d;
      pega.style.translate = (dx * k) + 'px ' + (dy * k) + 'px';
    });
    ['pointerup', 'pointercancel'].forEach(function (tipo) {
      on(pega, tipo, function () {
        if (!inicio) return;
        inicio = null; pega.style.translate = '';
        recusar();
      });
    });
    on(pega, 'keydown', function (e) {
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Enter', ' '].indexOf(e.key) >= 0) { e.preventDefault(); recusar(); }
    });
  }
  function recusar() {
    var pega = $('lock-grip');
    pega.classList.remove('recusa'); void pega.offsetWidth; pega.classList.add('recusa');
    tremor = 1;
    try { navigator.vibrate && navigator.vibrate([12, 40, 12]); } catch (e) {}
    tentativasNaFixa++;
    if (tentativasNaFixa >= 2) avisar(solo ? 'Essa não sai do lugar — quem anda é a outra metade.' : 'Essa não sai da sua mão — a outra metade está com seu colega.', 9);
    vida();
  }

  /* ---------- arrasto da chave (ato 3 — conferido, não mexer) ---------- */

  /* ---------- a chave na mão (ato 3) ----------
     Mario, 18/09/2026: "quando acha, às vezes ela fica presa … quando acha ela
     não deveria entrar em paredes/chão, pois aqui sim acabou o mistério e é
     mais uma tarefa motora e colaboração".

     A chave agora ANDA POR CIMA da casa: a ponta vai para o primeiro ponto da
     maquete sob o dedo — telhado, parede, degrau, chão — e fica um dedo de
     folga para fora da superfície. Ela nunca atravessa nada, porque nunca vai
     para trás do que se vê; e nunca some dentro de uma parede, que era como
     ela "ficava presa" (a pega ia junto para dentro e o toque não a achava).
     Fora da casa (o dedo no céu), a ponta segue num plano de frente para
     quem olha, na profundidade em que estava. */
  var FOLGA_DA_PONTA = 0.008;
  function camadaAberta(o) { var c = camadaDoObjeto(o); return c && camadasAbertas().indexOf(c) >= 0; }
  function superficieSob(x, y) {
    raio.setFromCamera(ndc(x, y), cameraAgora());
    var hits = raio.intersectObject(mundo.raiz, true);
    for (var i = 0; i < hits.length; i++) {
      var h = hits[i], o = h.object;
      if (!o.isMesh || !objetoVisivel(o) || o.userData.chave || !o.geometry || o.geometry.type === 'RingGeometry' || camadaAberta(o)) continue;
      return h;
    }
    return null;
  }
  function pontaNoDedo(x, y) {
    var h = superficieSob(x, y), escala = mundo.raiz.getWorldScale(new THREE.Vector3()).x || 1;
    if (h) {
      var n = h.face ? h.face.normal.clone().transformDirection(h.object.matrixWorld) : raio.ray.direction.clone().negate();
      if (n.dot(raio.ray.direction) > 0) n.negate();
      return mundo.raiz.worldToLocal(h.point.clone().addScaledVector(n, FOLGA_DA_PONTA * escala));
    }
    /* No ar: plano de frente para quem olha, pela ponta de agora. */
    var atual = mundo.chavePonta.getWorldPosition(new THREE.Vector3());
    planoDeArrasto.setFromNormalAndCoplanarPoint(cameraAgora().getWorldDirection(new THREE.Vector3()), atual);
    if (raio.ray.intersectPlane(planoDeArrasto, ponto)) return mundo.raiz.worldToLocal(ponto.clone());
    return null;
  }
  /* Onde a chave pousa quando é achada: logo ACIMA do esconderijo, fora de
     qualquer parede (um raio de cima para baixo acha o primeiro teto). */
  function pousoLivre(origemLocal) {
    mundo.raiz.updateMatrixWorld(true);
    var alto = origemLocal.clone(); alto.y = 3;
    var de = mundo.raiz.localToWorld(alto.clone()), para = mundo.raiz.localToWorld(origemLocal.clone());
    var dir = para.clone().sub(de).normalize();
    raio.set(de, dir); raio.far = de.distanceTo(para) + 0.5;
    var hits = raio.intersectObject(mundo.raiz, true);
    raio.far = Infinity;
    var topo = origemLocal.y;
    for (var i = 0; i < hits.length; i++) {
      var o = hits[i].object;
      if (!o.isMesh || !objetoVisivel(o) || o.userData.chave || !o.geometry || o.geometry.type === 'RingGeometry' || camadaAberta(o)) continue;
      topo = Math.max(origemLocal.y, mundo.raiz.worldToLocal(hits[i].point.clone()).y); break;
    }
    return new THREE.Vector3(origemLocal.x, topo + 0.035, origemLocal.z);
  }

  function ligarChave() {
    var pega = $('key-grip');
    on(pega, 'pointerdown', function (e) {
      if (!podeMoverChave() || vooDaChave || terminando) return;
      e.preventDefault(); arrastando = true;
      document.body.classList.add('manipulating');
      poeira.resetTrail(); poeira.trace(mundo.chave.position);
      if (controles) controles.enabled = false;
      try { pega.setPointerCapture(e.pointerId); } catch (err) {}
    });
    on(pega, 'pointermove', function (e) {
      if (!arrastando) return;
      var p = pontaNoDedo(e.clientX, e.clientY);
      if (p) { mundo.chave.position.copy(p).sub(mundo.chavePonta.position); ultimaPontaValida = p; }
      poeira.trace(mundo.chave.position);
      publicarMovimento(false);
    });
    ['pointerup', 'pointercancel'].forEach(function (tipo) {
      on(pega, tipo, function (e) {
        if (!arrastando) return;
        /* O ponto onde o dedo SAIU vale: com eventos agrupados (gesto rápido,
           navegador ocupado) o último pointermove chega antes do dedo parar,
           e a chave encaixava no penúltimo lugar — medido na volta 3
           (04/10/2026): o dedo subiu 100 px e a chave, 26. */
        if (tipo === 'pointerup') {
          var fim = pontaNoDedo(e.clientX, e.clientY);
          if (fim) { mundo.chave.position.copy(fim).sub(mundo.chavePonta.position); ultimaPontaValida = fim; }
        }
        arrastando = false;
        document.body.classList.remove('manipulating');
        if (controles) controles.enabled = ra.estado().modo === 'mesa';
        try { pega.releasePointerCapture(e.pointerId); } catch (err) {}
        if (tipo === 'pointerup') encaixar(); else poeira.resetTrail();
      });
    });
    on(pega, 'keydown', function (e) {
      if (!podeMoverChave() || terminando) return;
      var passo = { ArrowLeft: [-0.006, 0, 0], ArrowRight: [0.006, 0, 0], ArrowUp: [0, 0.006, 0], ArrowDown: [0, -0.006, 0], PageUp: [0, 0, -0.006], PageDown: [0, 0, 0.006] }[e.key];
      if (passo) { e.preventDefault(); mundo.chave.position.add(new THREE.Vector3(passo[0], passo[1], passo[2])); poeira.trace(mundo.chave.position); publicarMovimento(false); }
      if (e.key === 'Enter') { e.preventDefault(); encaixar(); }
    });
  }

  /* ---------- o parceiro automático (Solo) ----------
     Ele está do lado da FECHADURA: vê o vão e vê a ponta da chave como um
     ponto de luz — o mesmo que um colega veria na Mesa — e fala. A fala sai
     de onde o jogador está olhando: "mais para a esquerda" é a esquerda da
     tela dele. */
  function guiaDoParceiro(agora) {
    if (!solo || !dados || dados.complete || !ambosAcharam() || !mundo || !posta()) return;
    if (agora - guiaEm < 2300) return;
    var fech = mundo.raiz.localToWorld(vetorDaFechadura());
    var ponta = mundo.chavePonta.getWorldPosition(new THREE.Vector3());
    var d = mundo.raiz.worldToLocal(ponta.clone()).distanceTo(vetorDaFechadura());
    var a = naTela(ponta), b = naTela(fech), dx = b.x - a.x, dy = b.y - a.y, texto;
    if (!movimento && !arrastando && performance.now() - (guiaDoParceiro.desde || 0) < 3500) return;
    if (d < motor.TOLERANCIA) texto = 'Aí! A ponta está dentro do vão. Pode soltar.';
    else {
      var lados = [];
      if (Math.abs(dx) > 18) lados.push(dx > 0 ? 'para a direita' : 'para a esquerda');
      if (Math.abs(dy) > 18) lados.push(dy > 0 ? 'para baixo' : 'para cima');
      if (!lados.length) lados.push(d < 0.08 ? 'um pouquinho mais perto do vão' : 'mais perto: o vão está logo ali, na frente do que você toca');
      texto = (d < 0.08 ? 'Quase! Um pouco ' : d < 0.2 ? 'Está perto. Leve ' : 'Está longe. Leve ') + lados.join(' e ') + '.';
    }
    if (texto === ultimaGuia && agora - guiaEm < 5000) return;
    guiaEm = agora; ultimaGuia = texto;
    if (coop && coop.falar) coop.falar(texto, 'guia');
  }
  function pintarParceiro(fala) {
    if (!solo || !fala || !fala.texto) return;
    var el = $('fala-parceiro');
    /* "Achei uma coisa do meu lado… E você?" já foi respondida quando os dois
       acharam: ela ficava até a primeira fala de guia (3,5 s ou mais) e, a
       390×844 no Solo, empurrava o relógio para baixo da borda do painel
       (volta 3, 04/10/2026). */
    el.hidden = !posta() || (fala.tipo === 'achou' && ambosAcharam());
    el.textContent = '🤝 Parceiro: ' + fala.texto;
    if (fala.at !== falaVista) { falaVista = fala.at; vida(); if (fala.tipo === 'achou') avisar('🤝 ' + fala.texto, 3); }
  }

  /* A posição da fechadura do capítulo corrente, no espaço do modelo. */
  function vetorDaFechadura() {
    var i = dados ? dados.level : 0;
    if (motor && motor.FECHADURAS[i]) return new THREE.Vector3().fromArray(motor.FECHADURAS[i]);
    return new THREE.Vector3(0, 0.5, 0);
  }

  /* ---------- laço ---------- */

  function desenhar(tempo, quadroXR) {
    if (descartado) return;
    var dt = Math.min(0.1, (tempo - tempoAnterior) / 1000 || 0);
    tempoAnterior = tempo;
    if (ra) { ra.atualizar(dt, quadroXR); chao.visible = ra.estado().modo === 'mesa'; }
    if (controles && controles.enabled) controles.update();
    if (mundo) {
      animarCamadas(dt);
      atualizarRealces(tempo / 1000);
      if (vooDaChave) {
        vooDaChave.t += dt; var t = Math.min(1, vooDaChave.t / 0.7), s = t * t * (3 - 2 * t);
        mundo.chave.position.copy(vooDaChave.de).lerp(vooDaChave.para, s);
        mundo.chave.position.y += Math.sin(Math.PI * t) * 0.04;
        if (t === 1) vooDaChave = null;
      }
      if (mundo.chave.visible) ACMaquetteMundo.orientarChave(mundo.chave, cameraAgora(), mundo.raiz);
      poeira.update(dt, mundo.chave.visible && podeMoverChave() && (arrastando || vooDaChave) ? mundo.chave.position : null, alturaDaTela() * renderer.getPixelRatio());
      posicionarPegas();
      atualizarFarol();
      if (mundo.chave.visible && podeMoverChave() && !vooDaChave && !terminando && arrastando) publicarMovimento(false);
      seguirComOSol();
      guiaDoParceiro(performance.now());
      conferirPrazo();
      if (ra && ra.ativo() && !posta() && tempo - ultimoPainel > 400) { ultimoPainel = tempo; var m = ra.estado().temHit + '/' + ra.estado().rastreando; if (m !== ultimaMira) { ultimaMira = m; pintarTela(); } }
    }
    renderer.render(cena, camera);
  }

  /* O sol acompanha a maquete: em RA ela pode estar a um metro da origem, e a
     sombra (a caixa de sombra tem 2 m) saía cortada. */
  var solOffset = null;
  function seguirComOSol() {
    if (!sol) return;
    var escala = mundo.raiz.scale.x || 1, centro = mundo.raiz.getWorldPosition(new THREE.Vector3());
    if (!solOffset) solOffset = sol.position.clone().sub(sol.target.position);
    sol.target.position.copy(centro); sol.target.updateMatrixWorld();
    sol.position.copy(centro).addScaledVector(solOffset, escala);
    if (sol.userData.escala !== escala) {
      sol.userData.escala = escala;
      var c = sol.shadow.camera; c.left = -escala; c.right = escala; c.top = escala; c.bottom = -escala;
      c.near = 0.05 * escala; c.far = 8 * escala; c.updateProjectionMatrix();
    }
  }
  /* O tempo total da maquete acabou: qualquer aparelho avisa o motor, que
     confere o relógio e abre o que falta, sem ponto. */
  function conferirPrazo() {
    if (!dados || dados.complete || !dados.tempo || !dados.tempo.esgotado || prazoEnviado || !coop) return;
    prazoEnviado = true;
    avisar('O tempo da maquete acabou. As camadas que faltavam se abrem sozinhas — sem pontos.', 9);
    coop.send('maquete_prazo').catch(function () { return false; }).then(function (ok) {
      if (!ok) setTimeout(function () { prazoEnviado = false; }, 3000);
    });
  }

  function naTela(v) {
    var caixa = renderer.domElement.getBoundingClientRect();
    var tela = v.project(cameraAgora());
    return { x: caixa.left + (tela.x + 1) * caixa.width / 2, y: caixa.top + (1 - tela.y) * caixa.height / 2, dentro: tela.z >= -1 && tela.z <= 1 };
  }
  function posicionarPegas() {
    mundo.raiz.updateMatrixWorld(true);
    var pega = $('key-grip');
    if (mundo.chave.visible) {
      /* A pega fica na PONTA: é o ponto que o colega enxerga e o único que
         decide o encaixe. */
      var p = naTela(mundo.chavePonta.getWorldPosition(new THREE.Vector3()));
      pega.style.left = p.x + 'px'; pega.style.top = p.y + 'px';
      pega.hidden = !!vooDaChave || !podeMoverChave() || !p.dentro;
    } else pega.hidden = true;
    var fixa = $('lock-grip');
    var fechadura = dados && dados.fechadura && mundo.fechaduras[dados.fechadura];
    /* No Solo, com a chave em movimento, a pega da fixa sai de baixo do dedo:
       as duas no mesmo ponto fariam o encaixe final cair na peça errada. */
    if (fechadura && podeExplorar() && ambosAcharam() && !(solo && arrastando)) {
      var pontoFixa = fechadura.grupo.localToWorld(fechadura.centro.clone());
      var q = naTela(pontoFixa);
      fixa.style.left = q.x + 'px'; fixa.style.top = q.y + 'px';
      fixa.hidden = !q.dentro;
      /* No Solo as duas pegas estão na mesma tela, e a chave nasce ao lado
         da fechadura (a pedra fica diante da porta): medido na volta 2, as
         pegas ficavam a 35 px, uma cobrindo o centro da outra. A que anda é a
         chave — ela se afasta aos poucos até caber uma pega entre as duas. */
      if (!pega.hidden && !arrastando && !vooDaChave) {
        var pk = { x: parseFloat(pega.style.left), y: parseFloat(pega.style.top) };
        if (Math.hypot(pk.x - q.x, pk.y - q.y) < 92) afastarChave(q, pk, pontoFixa);
      }
    } else fixa.hidden = true;
  }

  /* Volta 1 (18/09/2026, modelo novo): o afastamento andava 0,006 por
     quadro no MUNDO, na direção horizontal fechadura→chave. Com a câmera de
     frente, essa direção é quase a do olhar — a chave se afastava na
     profundidade e as pegas continuavam a 17 px, uma sobre a outra; a 4
     quadros por segundo (telefone fraco) nunca se separavam. Agora a conta é
     na TELA e de uma vez: a ponta vai para 110 px da fechadura, no primeiro
     lado livre do vão da cena, no mesmo plano do arrasto. */
  function afastarChave(q, pk, pontoFixa) {
    var livre = areaLivre(), margem = 46;
    var base = Math.atan2(pk.y - q.y, pk.x - q.x);
    if (!isFinite(base) || (pk.x === q.x && pk.y === q.y)) base = 0;
    var giros = [0, 0.785, -0.785, 1.571, -1.571, 2.356, -2.356, 3.142], destino = null;
    for (var i = 0; i < giros.length && !destino; i++) {
      var a = base + giros[i], x = q.x + Math.cos(a) * 110, y = q.y + Math.sin(a) * 110;
      if (x > livre.esquerda + margem && x < livre.largura - margem && y > livre.topo + margem && y < livre.base - margem) destino = { x: x, y: y };
    }
    if (!destino) destino = { x: q.x + Math.cos(base) * 110, y: q.y + Math.sin(base) * 110 };
    var plano = new THREE.Plane().setFromNormalAndCoplanarPoint(cameraAgora().getWorldDirection(new THREE.Vector3()), pontoFixa);
    raio.setFromCamera(ndc(destino.x, destino.y), cameraAgora());
    var alvo = new THREE.Vector3();
    if (!raio.ray.intersectPlane(plano, alvo)) return;
    mundo.chave.position.copy(mundo.raiz.worldToLocal(alvo)).sub(mundo.chavePonta.position);
    mundo.raiz.updateMatrixWorld(true);
    var p = naTela(mundo.chavePonta.getWorldPosition(new THREE.Vector3()));
    $('key-grip').style.left = p.x + 'px'; $('key-grip').style.top = p.y + 'px';
  }

  /* Quem guia (e só quem guia) vê a ponta da chave do colega. A linha que
     descreve o ponto só existe enquanto HÁ ponto: antes disso ela era "Nenhum
     ponto de luz, por enquanto." — só no aparelho da fechadura, e era o aviso
     de papel que a lei d'A Casa proíbe (volta 2 da auditoria, 04/10/2026). */
  function atualizarFarol() {
    var guiando = dados && !dados.complete && papelDaVista() === 'fechadura' && ambosAcharam();
    var fresco = movimento && performance.now() - movimentoEm + (movimento.age || 0) < 1500;
    farol.visible = !!(guiando && fresco && online && posta());
    var linha = $('alignment');
    if (linha.hidden !== !farol.visible) linha.hidden = !farol.visible;
    if (!farol.visible) return;
    farol.position.fromArray(movimento.tip);
    var d = farol.position.distanceTo(vetorDaFechadura());
    var texto = d < motor.TOLERANCIA ? 'O ponto de luz está dentro do vão.'
      : d < 0.10 ? 'O ponto de luz está a um palmo do vão.'
        : 'Um ponto de luz anda pela maquete.';
    if (linha.textContent !== texto) linha.textContent = texto;
  }

  /* ---------- portal de entrada ---------- */

  function montarPortal() {
    ra.modosPossiveis(function (modos) {
      suporteRa = !!modos.ra;
      atualizarPortal();
    });
    on($('portal-ra'), 'click', function () { abrir('ra'); });
    on($('portal-mesa'), 'click', function () { abrir('mesa'); });
    on($('sair-ra'), 'click', function () {
      /* Sair da RA nunca prende: a maquete volta à escolha, agora com a
         opção de abrir na tela. O progresso fica no motor. */
      raFalhou = true; modoEscolhido = false;
      ra.sair().then(function () { atualizarPortal(); pintarTela(); setTimeout(enquadrar, 30); });
    });
    on($('reposicionar-ra'), 'click', function () {
      try { $('instructions').close(); } catch (e) {}
      ra.soltar(); pintarTela();
    });
    on($('portal-voltar'), 'click', function () {
      /* Maquete ainda trancada: volta à escrivaninha, que é quem a abre. */
      var voltar = new URLSearchParams(location.search); voltar.set('rever', '1');
      location.href = 'AC-escrivaninha.html?' + voltar;
    });
    /* Um toque num painel da RA não pode virar toque na cena. */
    on(document, 'beforexrselect', function (e) {
      if (e.target && e.target.closest && e.target.closest('aside,dialog,.topbar,.tools,.gesture-point,#notice,#coop-status')) e.preventDefault();
    });
  }
  var suporteRa = null;
  function atualizarPortal() {
    if (suporteRa === null) return;
    $('portal-ra').hidden = !suporteRa;
    $('portal-ra').textContent = raFalhou ? 'Tentar a realidade aumentada de novo' : 'Pôr a maquete na mesa';
    /* A maquete na tela é o caminho de quem NÃO tem RA — ou de quem tentou e
       não deu. Com RA funcionando, não há botão de atalho. */
    $('portal-mesa').hidden = suporteRa && !raFalhou;
    if (!suporteRa) {
      $('portal-titulo').textContent = 'A maquete chegou.';
      $('portal-texto').textContent = 'Este aparelho não tem realidade aumentada. A maquete abre na tela e a investigação é a mesma.';
      $('portal-aviso').textContent = '';
    } else if (raFalhou) {
      $('portal-aviso').textContent = $('portal-aviso').textContent || 'A realidade aumentada não seguiu. Tente de novo, ou abra a maquete na tela.';
    } else {
      $('portal-titulo').textContent = 'Ponha a maquete na sua mesa.';
      $('portal-texto').textContent = 'A câmera vai procurar uma mesa. Aponte para ela, mova o aparelho devagar e toque para apoiar a casa.';
      $('portal-aviso').textContent = '';
    }
  }

  function abrir(modo) {
    $('portal-aviso').textContent = modo === 'ra' ? 'Abrindo a câmera…' : 'Abrindo…';
    habilitarPortal(false);
    ra.entrar(modo).then(function (qual) {
      habilitarPortal(true);
      $('portal-aviso').textContent = '';
      modoEscolhido = true; raDesde = performance.now();
      if (qual === 'mesa') {
        var e = ra.estado();
        ra.mudarEscala(1 / e.escala);
        ra.posicionar();
        controles.enabled = true;
        entrarAtividade();
      }
      pintarTela();
      setTimeout(enquadrar, 30);
    }).catch(function (erro) {
      habilitarPortal(true);
      modoEscolhido = false; raFalhou = true;
      console.warn('[maquete] RA não abriu:', erro);
      $('portal-aviso').textContent = erro && erro.name === 'NotAllowedError'
        ? 'A câmera ou os sensores foram recusados. Libere nas configurações do navegador e tente de novo, ou abra a maquete na tela.'
        : 'A realidade aumentada não abriu neste aparelho. Tente de novo, ou abra a maquete na tela.';
      atualizarPortal();
    });
  }

  /* ---------- ligação com o motor ---------- */

  function receber(snapshot) {
    if (snapshot.soloRole) papel = snapshot.soloRole;
    if (snapshot.parceiro) pintarParceiro(snapshot.parceiro);
    if (typeof snapshot.bonus === 'number') ultimoBonus = snapshot.velaEsgotada ? 0 : snapshot.bonus;
    var tip = snapshot.keyMotion ? JSON.stringify(snapshot.keyMotion.tip) : '';
    /* O relógio de ociosidade zera na MUDANÇA — a ponta do colega andou —, e
       não na chegada do snapshot, que vem de segundo em segundo mesmo parado. */
    if (tip && tip !== ultimoTip) vida();
    ultimoTip = tip;
    movimento = snapshot.keyMotion; movimentoEm = performance.now();
    var antes = dados, estavaOnline = online;
    dados = snapshot.maquete;
    recebeuEstado = true;
    var papeis = (snapshot.percurso && snapshot.percurso.fragmento && snapshot.percurso.fragmento.membros.map(function (m) { return m.papel; })) || ['luz', 'conhecimento'];
    online = papeis.every(function (r) { return snapshot.online.indexOf(r) >= 0; });
    /* No Solo não há dupla: o painel de cooperação sai da tela em vez de
       anunciar um colega que não existe. */
    /* O cartão de cooperação só fala quando falta alguém: "dupla conectada"
       ocupava um painel inteiro (117 px a 390×844) para não dizer nada, e
       empurrava o resto da pilha para baixo da dobra. */
    if (!solo) { $('coop-status').hidden = online; if (!online) $('coop-status').textContent = 'Aguardando seu colega'; }

    /* "Nada aqui" só no aparelho que TOCOU: o engano conta para os dois, mas
       o aviso no aparelho de quem não tocou em nada seria mentira. */
    if (antes && dados && dados.level === antes.level && dados.mistakes > antes.mistakes && performance.now() - examinadoEm < 4000) avisar('Nada aqui.', 7);
    if (antes && dados && dados.level > antes.level) {
      vooDaChave = null; poeira.resetTrail();
      poeira.burst(vetorDaFechaduraDe(antes.level));
      if (!dados.complete) avisar(capituloFechado(antes.level), 3);
      tentativasNaFixa = 0;
    }
    /* A chave saiu do esconderijo — só onde a chave existe. */
    if (antes && dados && !antes.key && dados.key && temLadoDaChave()) {
      var conj = mundo && mundo.alvos[ultimoExaminado];
      var origem = conj ? conj.centro.clone() : new THREE.Vector3(0, 0.55, 0.2);
      var camada = conj ? mundo.camadas[conj.camada] : null;
      if (camada) origem = origem.clone().add(new THREE.Vector3(0, camada.position.y, 0));
      poeira.burst(origem); poeira.resetTrail();
      ACMaquetteMundo.escolherChave(mundo.chave, dados.level);
      var pouso = pousoLivre(origem);
      if (reduzido) mundo.chave.position.copy(pouso);
      else { mundo.chave.position.copy(origem); vooDaChave = { de: origem.clone(), para: pouso, t: 0 }; }
    }
    if (dados && !dados.complete && (!antes || antes.level !== dados.level)) ACMaquetteMundo.escolherChave(mundo.chave, dados.level);
    if (antes && dados && !ambosAcharamEm(antes) && ambosAcharamEm(dados)) guiaDoParceiro.desde = performance.now();
    /* A fechadura apareceu — só onde a fechadura existe. */
    if (antes && dados && !antes.lock && dados.lock && temLadoDaFechadura()) poeira.burst(vetorDaFechadura());
    /* Reenquadrar quando muda o CAPÍTULO, o PAPEL ou o ato. */
    /* Volta 2 (18/09/2026, Solo a 1280×800): a assinatura levava key e lock
       separados. No Solo, achar a chave reenquadrava duas vezes (30 ms e
       1,2 s) com a procura ainda aberta e os mesmos cinco pontos na tela —
       a cena pulava sob o dedo que ia tocar a fechadura, e o toque caía no
       vazio. Só reenquadra quando muda o que ESTE aparelho tem a fazer. */
    var assinatura = dados ? dados.level + '/' + dados.papel + '/' + (procurando() ? 1 : 0) + '/' + (ambosAcharam() ? 1 : 0) + '/' + (dados.complete ? 1 : 0) : '';
    if (assinatura !== enquadramentoAtual) {
      enquadramentoAtual = assinatura;
      if (antes) vida();
      if (ra && ra.estado().modo === 'mesa' && ra.estado().posta && !arrastando) {
        setTimeout(enquadrar, 30);
        /* E de novo quando tudo assenta: a camada termina de subir e a pilha
           reabre com o texto novo. Medido na volta 3, o primeiro quadro saía
           com o armário acima da tela. Só se o jogador ainda não girou. */
        girouDesde = false;
        setTimeout(function () { if (!girouDesde && !arrastando) enquadrar(); }, 1200);
      }
    }
    if (!antes || estavaOnline !== online || JSON.stringify(antes) !== JSON.stringify(dados)) pintarTela();
    /* A descoberta só abre com a maquete posta. */
    if (dados && dados.complete && !concluidoEnviado && posta()) {
      concluidoEnviado = true;
      $('final-score').textContent = '3 camadas · ' + dados.score + ' pontos. Nenhuma acusação foi concluída.';
      /* O Solo troca o quadro assim que recebe o recado. Mandado aqui, na
         hora da conclusão, ele tirava a maquete da tela antes de o jogador
         ler a descoberta ou ver a passagem (volta 2, 17/09/2026). Vai quando
         a descoberta FECHA — pelo botão, por Esc ou por um toque fora. */
      var aberto = false;
      try { $('discovery').showModal(); aberto = true; } catch (e) {}
      if (!aberto) avisarSoloDaConclusao();
      /* Pelo evento `close` E pelos gestos que fecham: medido na volta 3, num
         documento em segundo plano o `close` do <dialog> não chegava, e a
         moldura esperava para sempre. Vai uma vez só. */
      else ['close', 'cancel'].forEach(function (t) { $('discovery').addEventListener(t, avisarSoloDaConclusao); });
    }
  }

  function ambosAcharamEm(v) { return !!(v && v.key && v.lock); }
  var conclusaoAvisada = false;
  function avisarSoloDaConclusao() {
    if (!dados || !dados.complete || conclusaoAvisada) return;
    conclusaoAvisada = true;
    /* Dentro do percurso da Mesa vale o mesmo: a moldura só troca para o
       resumo depois que a descoberta foi lida (volta 3). */
    if (params.get('percurso') === '1') {
      try { parent.postMessage({ mosaico: 'ac-maquete-descoberta-vista', runId: params.get('run') }, location.origin); } catch (e) {}
    }
    if (params.get('demo') !== 'solo') return;
    try { parent.postMessage({ mosaico: 'ac-solo-maquete-completa', score: dados.score, vela: ultimoBonus, evidence: dados.evidence }, location.origin); } catch (e) {}
  }

  function vetorDaFechaduraDe(nivel) {
    if (motor && motor.FECHADURAS[nivel]) return new THREE.Vector3().fromArray(motor.FECHADURAS[nivel]);
    return new THREE.Vector3(0, 0.5, 0);
  }
  function capituloFechado(nivel) {
    return (motor && motor.CAPITULOS[nivel] && motor.CAPITULOS[nivel].fecho) || 'A camada se soltou.';
  }

  /* ---------- botões ---------- */

  function ligarBotoes() {
    on($('alternative'), 'click', function () { abrirListaDeObjetos(); });
    on($('guardar'), 'click', avisarSoloDaConclusao);
    on($('discovery'), 'click', function (e) {
      if (e.target !== $('discovery')) return;
      var r = $('discovery').getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) avisarSoloDaConclusao();
    });

    /* Recolher ou abrir os painéis NÃO reenquadra a imagem. Medido na volta 1
       (17/09/2026): o toque na cena recolhe os painéis no pointerdown; se a
       imagem se recentrasse ali, a casa andava debaixo do dedo antes do
       pointerup e o toque caía no chão — o alvo nunca era examinado. */
  }

  function abrirListaDeObjetos() {
    if (!dados || !dados.alvos) return;
    /* Sorteado por partida: escrita à mão, esta lista nasceria com o
       esconderijo em primeiro lugar em todos os capítulos. */
    var ordem = motor.ordemDosAlvos(dados.alvos, dados.capitulo, semente());
    var caixa = $('object-list'); caixa.textContent = '';
    ordem.forEach(function (id) {
      var b = document.createElement('button');
      b.type = 'button';
      b.textContent = (dados.rotulos && dados.rotulos[id]) || id;
      b.onclick = function () { examinar(id); try { $('objects').close(); } catch (e) {} };
      caixa.appendChild(b);
    });
    try { $('objects').showModal(); } catch (e) {}
  }

  function semente() { return params.get('sala') || params.get('run') || 'AC-COSTA'; }

  /* ---------- partida ---------- */

  function comecar() {
    montarCena();
    ligarGestos(); ligarChave(); ligarFixa(); ligarBotoes();

    var voltar = new URLSearchParams(location.search); voltar.set('rever', '1');
    $('return-desk').href = 'AC-escrivaninha.html?' + voltar;
    if (solo) $('coop-status').hidden = true;
    ACRA.preparar();

    import(new URL('ac-maquete-state.mjs', MEU_SRC).href).then(function (m) {
      motor = m;
      return new Promise(function (ok, falha) {
        ACMaquetteMundo.carregar({ pontos: m.FECHADURAS }, ok, falha);
      });
    }).then(function (m) {
      mundo = m;
      cena.add(mundo.raiz);
      /* A poeira mora DENTRO da maquete: acompanha escala, giro e pose. */
      poeira = createACGoldDust(mundo.raiz, { reduced: reduzido });
      farol = new THREE.Mesh(new THREE.SphereGeometry(0.006, 12, 8), new THREE.MeshBasicMaterial({ color: 0xffe3a1 }));
      farol.visible = false; farol.userData.exportExclude = true; farol.raycast = function () {};
      mundo.raiz.add(farol);
      mundo.chave.visible = false;

      controles = new THREE.OrbitControls(camera, renderer.domElement);
      controles.enableDamping = true; controles.minDistance = 0.12; controles.maxDistance = 14;
      controles.addEventListener('start', function () { girouDesde = true; });
      controles.maxPolarAngle = Math.PI * 0.495; controles.enabled = false;

      ra = ACMaquetteRA.criar({ renderer: renderer, cena: cena, camera: camera, raiz: mundo.raiz, baseY: mundo.baseY, aoMudar: aoMudarRA,
        desenhar: desenhar, aoTocar: function (x, y) { tocarNaCena(x, y); } });
      ra.previa();
      controles.enabled = true;
      montarPortal();
      habilitarPortal(true);
      ligarCooperacao();
      pintarTela();
      enquadrar();
      renderer.setAnimationLoop(desenhar);
      /* O painel do Claude congela o requestAnimationFrame: este gancho
         desenha um quadro avulso para conferir a tela parada. */
      window.__maquete = { mundo: mundo, ra: ra, motor: motor, camera: camera, controles: controles, renderer: renderer, cena: cena, estado: function () { return dados; },
        pontaNoDedo: function (x, y) { return pontaNoDedo(x, y); }, pousoLivre: function (v) { return pousoLivre(v); },
        quadro: function () { desenhar(performance.now(), null); }, enquadrar: enquadrar,
        /* Onde um ponto da cena cai na tela — para tocar nele de verdade. */
        onde: function (id) {
          mundo.raiz.updateMatrixWorld(true);
          if (Array.isArray(id)) return naTela(mundo.raiz.localToWorld(new THREE.Vector3().fromArray(id)));
          var c = conjuntoDe(id); if (!c) return null;
          return naTela(c.grupo.localToWorld(c.centro.clone()));
        },
        diag: function () {
          return { online: online, pendente: pendente, posta: posta(), podeExplorar: podeExplorar(), procurando: procurando(),
            alvos: alvosAtivos().map(function (a) { return a.id; }), toques: toques.size, tocouEm: !!tocouEm,
            alvoDaOrbita: controles && naTela(controles.target.clone()), alvo3d: controles && controles.target.toArray().map(function (n) { return +n.toFixed(3); }), camera: camera.position.toArray().map(function (n) { return +n.toFixed(3); }),
            olhar: camera.getWorldDirection(new THREE.Vector3()).toArray().map(function (n) { return +n.toFixed(3); }) };
        },
        /* Onde um jogador tocaria: o primeiro pixel, em volta da projeção,
           em que o objeto é o que se VÊ (o primeiro obstáculo do raio). */
        ondeVisivel: function (id) {
          var c = conjuntoDe(id); if (!c) return null;
          mundo.raiz.updateMatrixWorld(true);
          var pontos = pontosDoConjunto(c), cam = cameraAgora();
          for (var p = 0; p < pontos.length; p++) {
            var t = naTela(pontos[p].clone());
            for (var r = 0; r <= 12; r += 3) for (var a = 0; a < (r ? 8 : 1); a++) {
              var x = t.x + Math.cos(a * Math.PI / 4) * r, y = t.y + Math.sin(a * Math.PI / 4) * r;
              raio.setFromCamera(ndc(x, y), cam);
              var h = raio.intersectObject(mundo.raiz, true).filter(function (k) { return k.object.isMesh && objetoVisivel(k.object) && k.object.geometry && k.object.geometry.type !== 'RingGeometry'; });
              if (h.length && donoDoToque(h[0].object) === c.grupo) return { x: x, y: y };
            }
          }
          return null;
        },
        /* O que o raio acerta num ponto da tela — os três primeiros. */
        raio: function (x, y) {
          raio.setFromCamera(ndc(x, y), cameraAgora());
          return raio.intersectObject(mundo.raiz, true).filter(function (h) { return objetoVisivel(h.object); }).slice(0, 3).map(function (h) {
            if (!h.object.isMesh) return '(' + h.object.type + ') @' + h.distance.toFixed(3);
            var d = donoDoToque(h.object);
            return h.object.name + (d ? ' ← ' + (d.userData.object || d.userData.fechadura) : '') + ' @' + h.distance.toFixed(3);
          });
        } };
    }).catch(function (erro) {
      $('portal-aviso').textContent = 'A maquete não pôde ser carregada. ' + (erro && erro.message ? erro.message : '');
      $('description').textContent = 'A maquete não pôde ser carregada neste aparelho.';
      try { $('portal').showModal(); } catch (e) {}
    });
  }

  function habilitarPortal(ligado) {
    ['portal-ra', 'portal-mesa'].forEach(function (id) { $(id).disabled = !ligado; });
  }

  function aoMudarRA() {
    var e = ra.estado();
    /* A órbita é da BANCADA. Em RA quem move o ponto de vista é o aparelho. */
    if (controles) controles.enabled = e.modo === 'mesa';
    if (e.modo === 'mesa' && e.posta) enquadrar();
    pintarTela();
  }

  function ligarCooperacao() {
    ACCooperation(receber, function (ligado) {
      if (!ligado) { online = false; $('coop-status').textContent = 'Reconectando…'; pintarTela(); }
    }, { maquette: true }).then(function (c) {
      coop = c;
      if (c.demo) c.send('iniciar_maquete');
      if (params.get('percurso') === '1') { var marca = document.querySelector('.brand'); if (marca) marca.removeAttribute('href'); }
      if (c.invite) { $('invite').href = c.invite; $('invite').hidden = false; }
    }).catch(function (e) { $('description').textContent = e.message; });
  }

  on(window, 'resize', function () {
    if (!camera || !renderer) return;
    ajustarTamanho();
    if (ra && ra.estado().modo === 'mesa') enquadrar();
  });
  on(window, 'pagehide', function (e) {
    if (e.persisted) { renderer.setAnimationLoop(null); return; }
    descartado = true;
    if (poeira) poeira.dispose();
    if (coop) coop.close();
    if (ra) ra.sair();
    desligar.forEach(function (fn) { fn(); });
    if (controles) controles.dispose();
    renderer.setAnimationLoop(null);
    renderer.dispose();
  });

  comecar();
})();
