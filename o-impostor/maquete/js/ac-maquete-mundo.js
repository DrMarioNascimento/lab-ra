/* O mundo da maquete: lê `casa-da-costa-pisos.glb` e devolve uma cena pronta
   para a atividade — camadas que se soltam, alvos que se pode tocar, três
   fechaduras e uma chave.

   Três coisas aqui não são enfeite:

   1. NORMALIZAÇÃO. O arquivo vem em unidades do editor (31 × 34 × 24). A
      atividade inteira — as fechaduras do motor, a tolerância do encaixe, a
      escala em RA — fala numa maquete de PEGADA 1: x e z centrados em zero,
      base em y=0, maior lado horizontal valendo 1. Quem mexer no modelo sem
      mexer nas fechaduras é reprovado pelo teste, não pelo jogo.

   2. FUSÃO. São 2.472 nós com malha. Desenhados um a um, são 2.472 chamadas
      por quadro — num telefone em RA isso é o fim. Tudo o que não é alvo é
      fundido por camada e por material: sobram poucas dezenas.

   3. O RELÓGIO. O caso diz que o relógio de corda travou às 21h29 (F20, F26).
      O modelo veio com os ponteiros noutra hora. Um objeto que a dica cita
      pelo horário TEM de mostrar aquele horário; os dois ponteiros são
      girados no carregamento, em torno do centro do mostrador. */
(function (global) {
  'use strict';

  /* O carimbo fura o cache do aparelho quando o modelo muda (18/09/2026). */
  /* O IMPOSTOR (27/09/2026): a casa com os cômodos do cânone — biblioteca,
     escritório, quarto de serviço com sacada, corredor de serviço (porta para o
     jardim e quadro de luz), jardim interno e guarita (o farol fica longe, fora da maquete); o relógio de
     parede deu lugar ao relógio de caixa alta, ao lado do quadro; a
     escrivaninha foi para o escritório. O porão continua. */
  /* SUBSTITUIDO (01/10/2026): var ARQUIVO = 'assets/ac/casa-o-impostor-pisos.glb?v=20260928-cabeceiras';
     O modelo antigo (casa em bloco, jardim fora) está guardado em
     assets/ac/casa-o-impostor-pisos_SUBSTITUIDO.glb. O novo é a casa em pátio
     da revisão 2 (briefing de 30/09), modelada em METROS, base da casa em y=0. */
  /* SUBSTITUIDO (03/10/2026): var ARQUIVO = 'assets/ac/casa-o-impostor-pisos.glb?v=20261001-patio';
     O modelo de 01/10 está guardado em assets/ac/casa-o-impostor-pisos_SUBSTITUIDO_0310.glb.
     Em 03/10 a escrivaninha saiu da biblioteca (térreo) e foi para a sala de mapas
     (andar de cima), encostada na parede sul, sob a janela — a mesma sala do telefone
     vermelho. É a escrivaninha do Capítulo 2. */
  var ARQUIVO = 'assets/ac/casa-o-impostor-pisos.glb?v=20261003-escrivaninha';

  /* Camadas, de cima para baixo. `terreno` nunca se solta. */
  var CAMADAS = ['telhado', 'piso-2', 'piso-1', 'porao', 'terreno'];

  /* Cada alvo é um punhado de nós do GLB. A escolha é por nome e por
     ancestral — nunca por índice, que muda a cada reexportação do modelo. */
  var ALVOS = [
    /* A pedra da frente, não a do portão: aquela fica a 0,046 do pilar, e
       mirar nela acertava o pilar — medido com um toque de verdade a 390×844,
       em 17/09/2026. Dois alvos do mesmo capítulo colados são ponto perdido
       por defeito de posição, não por engano de dedução. */
    { id: 'pedra-do-caminho', camada: 'terreno', nome: 'pedra-solta', extremo: 'maiorZ' },
    { id: 'pilar-do-portao', camada: 'terreno', nomes: ['pilar-de-portao', 'capitel-de-portao'], extremo: 'menorX' },
    /* 01/10: na casa nova duas moitas ficam a menos de 3 m uma da outra; com a folga
       padrão (0,06) o alvo juntava as duas e o centro caía no chão ENTRE elas. */
    { id: 'moita-do-caminho', camada: 'terreno', nome: 'moita', extremo: 'menorX', folga: 0.012 },
    /* 01/10: na casa nova a primeira laje fica sob o telhado da entrada (não se
       vê de cima) e as outras são passos no caminho. O alvo é o conjunto dos
       passos mais ao sul; sem isso o centro caía no cascalho entre eles. */
    { id: 'laje-de-chegada', camada: 'terreno', nome: 'laje-de-chegada', extremo: 'maiorZ', folga: 0.045 },
    /* Só DOIS dos quatro quartos aparecem quando o telhado sai: a torre fica
       na frente dos outros dois. Medido — `armario` do quarto norte respondia
       a 1 direção de 72, e o do leste a nenhuma. Os alvos deste capítulo são
       os dois quartos que de fato se abrem. */
    { id: 'armario-do-quarto-distante', camada: 'piso-2', ancestral: 'quarto-oeste', prefixo: 'armario' },
    { id: 'castical-do-quarto-distante', camada: 'piso-2', ancestral: 'quarto-oeste', nomes: ['castical', 'vela-de-cabeceira'] },
    { id: 'armario-do-quarto-vizinho', camada: 'piso-2', ancestral: 'quarto-sul', prefixo: 'armario' },
    { id: 'castical-do-quarto-vizinho', camada: 'piso-2', ancestral: 'quarto-sul', nomes: ['castical', 'vela-de-cabeceira'] },
    { id: 'relogio-caixa-alta', camada: 'piso-1', ancestral: 'relogio-caixa-alta' },
    /* SUBSTITUIDO (03/10): { id: 'escrivaninha', camada: 'piso-1', ancestral: 'escrivaninha' },
       Na casa de 01/10 havia DUAS escrivaninhas (biblioteca e sala de visitas) e o
       ancestral 'escrivaninha' recolhia as duas num alvo só. Agora o alvo é só a da
       sala de mapas. */
    { id: 'escrivaninha', camada: 'piso-2', ancestral: 'sala-de-mapas', nomes: ['escrivaninha'] },
    /* SUBSTITUIDO (01/10): ancestral 'sala-escura' (a sala do modelo antigo). Na casa
       nova o quadro e o espelho ficam na sala de visitas. */
    { id: 'quadro', camada: 'piso-1', ancestral: 'sala-de-visitas', nomes: ['quadro', 'moldura-do-quadro'] },
    { id: 'espelho', camada: 'piso-1', ancestral: 'sala-de-visitas', nomes: ['espelho', 'moldura-do-espelho'] },
    /* O IMPOSTOR: o telefone vermelho da sala da torre (não é esconderijo; é o que abre a comunicação). */
    { id: 'telefone', camada: 'piso-2', ancestral: 'telefone-vermelho' },
    /* Esconderijos das plantas do térreo (além da escrivaninha e do espelho, que já são alvos). */
    { id: 'estante-da-biblioteca', camada: 'piso-1', ancestral: 'estante-leste' },
    { id: 'armario-do-quarto-de-servico', camada: 'piso-1', ancestral: 'quarto-de-servico', prefixo: 'qs-armario' },
    /* O IMPOSTOR: esconderijos dos envios extras (presentes para quem procura). */
    { id: 'armario-do-quarto-norte', camada: 'piso-2', ancestral: 'quarto-norte', prefixo: 'armario' },
    { id: 'castical-do-quarto-norte', camada: 'piso-2', ancestral: 'quarto-norte', nomes: ['castical', 'vela-de-cabeceira'] },
    { id: 'armario-do-quarto-leste', camada: 'piso-2', ancestral: 'quarto-leste', prefixo: 'armario' },
    { id: 'castical-do-quarto-leste', camada: 'piso-2', ancestral: 'quarto-leste', nomes: ['castical', 'vela-de-cabeceira'] },
    { id: 'pipas', camada: 'porao', ancestral: 'porao', nomes: ['pipa', 'arco-da-pipa'] },
    { id: 'caixotes', camada: 'porao', ancestral: 'porao', nomes: ['caixote'] },
    { id: 'adega', camada: 'porao', ancestral: 'porao', nomes: ['prateleira-do-porao', 'garrafa'] }
  ];

  /* As três fechaduras correm pela CHAMINÉ da casa: a porta abre a caixa, o
     peito da chaminé solta o andar dos quartos e o consolo da lareira, embaixo
     dele, solta o térreo. A mesa de mapas da torre e a ferragem do alçapão
     foram descartadas na medição: nenhuma das duas é visível no momento em que
     serviria de fechadura — a torre esconde uma, o assoalho esconde a outra. */
  var FECHADURAS = [
    /* A porta da frente, no modelo de 18/09/2026, recuou para dentro do arco
       da torre: a maçaneta responde a 0 de 72 direções e a folha da porta a 2.
       O degrau de pedra diante dela responde a 52 — a fechadura é o degrau. */
    { id: 'fechadura-portada', camada: 'piso-1', ancestral: 'portada', nomes: ['degrau'] },
    { id: 'fechadura-chamine', camada: 'piso-2', nomes: ['peito-de-chamine-superior'] },
    { id: 'fechadura-lareira', camada: 'piso-1', nomes: ['peito-de-chamine'] }
  ];

  /* Uma peça que o GLB põe num grupo e a ATIVIDADE precisa noutro. O forro do
     piso 2 é a TAMPA dos quartos: enquanto ele ficava na camada `piso-2`, tirar
     o telhado descobria um teto liso — os quatro armários continuavam fechados
     debaixo dele e nenhuma direção de olhar os alcançava. Medido: 0 de 36. */
  var EXCECOES = { 'forro-piso-2': 'telhado' };

  /* A descoberta. Medido: com o terreno opaco, a passagem responde a ZERO de
     72 direções — ela corre por baixo do chão, para fora da pegada da casa.
     Por isso, no fim, o terreno fica fantasma em vez de continuar sólido. */
  /* SUBSTITUIDO (01/10): { id: 'passagem-oculta', camada: 'porao', nomes: ['aduela-da-passagem', 'laje-da-passagem', 'barra', 'porta-de-ferro'] }
     Na revisão 2 a passagem é no TÉRREO (da despensa, por trás do quarto de
     serviço e da janela dos retratos, até a portinhola da sala do relógio) e
     só fica pública no Cap. 4. O arquivo a marca com extras.hidden: nasce
     escondida (ver `montar`). */
  var REVELACAO = { id: 'passagem-oculta', camada: 'piso-1', nomes: ['passagem-oculta'] };

  var RELOGIO = { hora: 21, minuto: 29 };

  function nomesDe(regra) { return regra.nomes || (regra.nome ? [regra.nome] : null); }

  /* O GLTFLoader do r128 desempata nomes repetidos com sufixo: as nove lajes do
     terreiro chegam como `laje-de-chegada`, `laje-de-chegada_1`… `_8`.
     Comparar por igualdade recolhia UMA laje e deixava oito mudas ao toque —
     e nada acusava, porque uma laje respondia. */
  function bate(nome, alvo) {
    if (!nome) return false;
    if (nome === alvo) return true;
    if (nome.length > alvo.length + 1 && nome.indexOf(alvo + '_') === 0) return /^\d+$/.test(nome.slice(alvo.length + 1));
    return false;
  }

  function bateAlgum(nome, lista) {
    for (var i = 0; i < lista.length; i++) if (bate(nome, lista[i])) return true;
    return false;
  }

  function temAncestral(objeto, nome) {
    for (var n = objeto; n; n = n.parent) if (bate(n.name, nome)) return true;
    return false;
  }

  /* ---- fusão por material -------------------------------------------- */

  function fundir(malhas, raiz) {
    /* Junta as malhas dadas num BufferGeometry só, já no espaço da raiz.
       Todas as primitivas deste modelo têm POSITION, NORMAL e TEXCOORD_0. */
    var total = 0, totalIdx = 0, i, j;
    var preparadas = [];
    var inversa = new THREE.Matrix4().copy(raiz.matrixWorld).invert();
    for (i = 0; i < malhas.length; i++) {
      var g = malhas[i].geometry;
      var pos = g.attributes.position;
      if (!pos) continue;
      var idx = g.index ? g.index.array : null;
      preparadas.push({ malha: malhas[i], g: g, n: pos.count, idx: idx });
      total += pos.count;
      totalIdx += idx ? idx.length : pos.count;
    }
    if (!total) return null;
    var P = new Float32Array(total * 3), N = new Float32Array(total * 3), U = new Float32Array(total * 2);
    var I = total > 65535 ? new Uint32Array(totalIdx) : new Uint16Array(totalIdx);
    var vBase = 0, iBase = 0;
    var m4 = new THREE.Matrix4(), m3 = new THREE.Matrix3(), v = new THREE.Vector3();
    for (i = 0; i < preparadas.length; i++) {
      var p = preparadas[i], geo = p.g;
      m4.multiplyMatrices(inversa, p.malha.matrixWorld);
      m3.getNormalMatrix(m4);
      var ap = geo.attributes.position, an = geo.attributes.normal, au = geo.attributes.uv;
      for (j = 0; j < p.n; j++) {
        v.set(ap.getX(j), ap.getY(j), ap.getZ(j)).applyMatrix4(m4);
        P[(vBase + j) * 3] = v.x; P[(vBase + j) * 3 + 1] = v.y; P[(vBase + j) * 3 + 2] = v.z;
        if (an) { v.set(an.getX(j), an.getY(j), an.getZ(j)).applyMatrix3(m3).normalize();
          N[(vBase + j) * 3] = v.x; N[(vBase + j) * 3 + 1] = v.y; N[(vBase + j) * 3 + 2] = v.z; }
        if (au) { U[(vBase + j) * 2] = au.getX(j); U[(vBase + j) * 2 + 1] = au.getY(j); }
      }
      if (p.idx) { for (j = 0; j < p.idx.length; j++) I[iBase + j] = vBase + p.idx[j]; iBase += p.idx.length; }
      else { for (j = 0; j < p.n; j++) I[iBase + j] = vBase + j; iBase += p.n; }
      vBase += p.n;
    }
    var saida = new THREE.BufferGeometry();
    saida.setAttribute('position', new THREE.BufferAttribute(P, 3));
    saida.setAttribute('normal', new THREE.BufferAttribute(N, 3));
    saida.setAttribute('uv', new THREE.BufferAttribute(U, 2));
    saida.setIndex(new THREE.BufferAttribute(I, 1));
    saida.computeBoundingSphere();
    return saida;
  }

  /* ---- relógio ---------------------------------------------------------- */

  function acertarRelogio(raiz) {
    var mostrador = null, ponteiros = [];
    raiz.traverse(function (o) {
      if (!temAncestral(o, 'relogio-de-parede')) return;
      if (o.name === 'mostrador') mostrador = o;
      if (o.name === 'ponteiro-das-horas') ponteiros.push({ objeto: o, alvo: ((RELOGIO.hora % 12) + RELOGIO.minuto / 60) * 30 });
      if (o.name === 'ponteiro-dos-minutos') ponteiros.push({ objeto: o, alvo: RELOGIO.minuto * 6 });
    });
    if (!mostrador || ponteiros.length !== 2) return null;
    var centroMundo = new THREE.Box3().setFromObject(mostrador).getCenter(new THREE.Vector3());
    var giros = [];
    for (var i = 0; i < ponteiros.length; i++) {
      var o = ponteiros[i].objeto;
      /* Tudo aqui é feito no espaço do PAI do ponteiro. Medir no mundo e
         escrever no local só coincidiria se a cadeia acima fosse identidade —
         e não é: o modelo inteiro está dentro do grupo de normalização. */
      var eixo = o.parent.worldToLocal(centroMundo.clone());
      if (!o.geometry.boundingBox) o.geometry.computeBoundingBox();
      var c = o.geometry.boundingBox.clone().applyMatrix4(o.matrix);
      var cantos = [[c.min.x, c.min.y], [c.min.x, c.max.y], [c.max.x, c.min.y], [c.max.x, c.max.y]];
      var melhor = null, dist = -1;
      for (var k = 0; k < 4; k++) {
        var dx = cantos[k][0] - eixo.x, dy = cantos[k][1] - eixo.y, d = dx * dx + dy * dy;
        if (d > dist) { dist = d; melhor = [dx, dy]; }
      }
      /* Ângulo de relógio: zero às 12h, crescendo no sentido dos ponteiros. */
      var atual = (Math.atan2(melhor[0], melhor[1]) * 180 / Math.PI + 360) % 360;
      var delta = (ponteiros[i].alvo - atual) * Math.PI / 180;
      /* Geometria compartilhada entre nós: clonar antes de mudar o pivô. E
         assar a matriz local antes de zerá-la, senão um modelo futuro que
         traga transformação no ponteiro perde a pose sem avisar. */
      var geo = o.geometry.clone().applyMatrix4(o.matrix);
      geo.translate(-eixo.x, -eixo.y, -eixo.z);
      o.geometry = geo;
      o.position.set(eixo.x, eixo.y, eixo.z);
      o.quaternion.identity();
      o.rotation.z = -delta;
      o.scale.set(1, 1, 1);
      o.updateMatrix();
      giros.push({ nome: o.name, de: atual, para: ponteiros[i].alvo });
    }
    raiz.updateMatrixWorld(true);
    return giros;
  }

  /* ---- chaves ----------------------------------------------------------- */

  /* Três chaves antigas, uma por camada (Mario, 18/09/2026: "as pontas não
     lembram chaves, nenhuma delas"). Uma chave se lê por três coisas: o ANEL
     (por onde se segura), a HASTE e o PALHETÃO — a bandeira recortada na ponta,
     de lado, com os dentes que abrem a fechadura. Sem palhetão com dentes,
     qualquer bastão com argola vira "uma coisa". As três são diferentes de
     propósito: ferro com anel de trevo, latão com anel de cruz, bronze de
     haste oca com anel oval.

     A ORIGEM do grupo é a PONTA da chave: é o ponto que segue o dedo, o que o
     colega vê como luz e o único que o motor confere. A chave inteira fica
     para TRÁS da ponta (x negativo); o palhetão pende para -y; a face larga
     é o plano XY. `orientarChave` vira esse plano para quem olha. */
  var DESENHOS = [
    { nome: 'ferro', cor: 0x4a4540, emissivo: 0x1a130a, metal: 0.75, aspereza: 0.48, anel: 'trevo', dentes: [[0.002, 0.004], [0.006, 0.0075]] },
    { nome: 'latao', cor: 0xd8b25e, emissivo: 0x2a1c05, metal: 0.85, aspereza: 0.36, anel: 'cruz', dentes: [[0.0015, 0.005], [0.0055, 0.0035], [0.009, 0.006]] },
    { nome: 'bronze', cor: 0x9a6232, emissivo: 0x21100a, metal: 0.8, aspereza: 0.42, anel: 'oval', dentes: [[0.003, 0.0065]], oca: true }
  ];
  var COMPRIMENTO_HASTE = 0.050, RAIO_HASTE = 0.0021;

  function palhetao(desenho, material) {
    /* A bandeira: 12 mm ao longo da haste, 13 mm de altura, com os dentes
       recortados na borda de baixo. Extrudada na espessura (2,4 mm). */
    var larg = 0.012, alt = 0.0125, x0 = -0.0135, forma = new THREE.Shape();
    forma.moveTo(x0, 0.0015);
    forma.lineTo(x0 + larg, 0.0015);
    forma.lineTo(x0 + larg, -alt);
    var dentes = desenho.dentes.slice().sort(function (a, b) { return b[0] - a[0]; });
    /* Percorre a borda de baixo da direita para a esquerda abrindo cada dente
       como um entalhe retangular. */
    for (var i = 0; i < dentes.length; i++) {
      var cx = x0 + larg - dentes[i][0] - 0.0018, prof = dentes[i][1] * 0.95;
      forma.lineTo(cx + 0.0014, -alt);
      forma.lineTo(cx + 0.0014, -alt + prof);
      forma.lineTo(cx - 0.0014, -alt + prof);
      forma.lineTo(cx - 0.0014, -alt);
    }
    forma.lineTo(x0, -alt);
    forma.lineTo(x0, 0.0015);
    var geo = new THREE.ExtrudeGeometry(forma, { depth: 0.0024, bevelEnabled: true, bevelThickness: 0.0004, bevelSize: 0.0004, bevelSegments: 1 });
    geo.translate(0, 0, -0.0012);
    return new THREE.Mesh(geo, material);
  }

  function anelDaChave(desenho, material) {
    var g = new THREE.Group(), cx = -COMPRIMENTO_HASTE - 0.0115;
    function aro(r, tubo, x, y, sx, sy) {
      var m = new THREE.Mesh(new THREE.TorusGeometry(r, tubo, 10, 28), material);
      m.position.set(x, y, 0); m.scale.set(sx || 1, sy || 1, 1); g.add(m); return m;
    }
    if (desenho.anel === 'trevo') {
      /* Três laços em volta de um botão central: o anel de trevo das chaves
         de porta de casa antiga. */
      for (var k = 0; k < 3; k++) {
        var a = Math.PI + (k - 1) * 2.1;
        aro(0.0058, 0.0019, cx + Math.cos(a) * 0.0068, Math.sin(a) * 0.0068);
      }
      var botao = new THREE.Mesh(new THREE.SphereGeometry(0.0034, 14, 10), material);
      botao.position.set(cx, 0, 0); g.add(botao);
    } else if (desenho.anel === 'cruz') {
      aro(0.0105, 0.0021, cx, 0);
      var h = new THREE.Mesh(new THREE.BoxGeometry(0.019, 0.0024, 0.0024), material); h.position.set(cx, 0, 0); g.add(h);
      var v = new THREE.Mesh(new THREE.BoxGeometry(0.0024, 0.019, 0.0024), material); v.position.set(cx, 0, 0); g.add(v);
    } else {
      aro(0.0098, 0.0024, cx - 0.001, 0, 1.3, 0.85);
      for (var s = -1; s <= 1; s += 2) {
        var conta = new THREE.Mesh(new THREE.SphereGeometry(0.0024, 10, 8), material);
        conta.position.set(cx - 0.001, s * 0.0092, 0); g.add(conta);
      }
    }
    return g;
  }

  function criarModeloDeChave(desenho) {
    var material = new THREE.MeshStandardMaterial({ color: desenho.cor, roughness: desenho.aspereza, metalness: desenho.metal, emissive: desenho.emissivo });
    var g = new THREE.Group();
    g.name = 'chave-' + desenho.nome;
    /* Haste: da ponta (x=0) até o anel. */
    var haste = new THREE.Mesh(new THREE.CylinderGeometry(RAIO_HASTE, RAIO_HASTE, COMPRIMENTO_HASTE, 14), material);
    haste.rotation.z = Math.PI / 2; haste.position.x = -COMPRIMENTO_HASTE / 2;
    g.add(haste);
    /* A ponta arredondada — ou a boca da haste oca. */
    if (desenho.oca) {
      var boca = new THREE.Mesh(new THREE.TorusGeometry(RAIO_HASTE * 0.95, 0.0007, 8, 18), material);
      boca.rotation.y = Math.PI / 2; g.add(boca);
    } else {
      var cap = new THREE.Mesh(new THREE.SphereGeometry(RAIO_HASTE * 1.05, 12, 8), material);
      g.add(cap);
    }
    /* Colar entre haste e anel. */
    var colar = new THREE.Mesh(new THREE.TorusGeometry(RAIO_HASTE * 1.35, 0.0011, 8, 18), material);
    colar.rotation.y = Math.PI / 2; colar.position.x = -COMPRIMENTO_HASTE + 0.004; g.add(colar);
    g.add(palhetao(desenho, material));
    g.add(anelDaChave(desenho, material));
    g.traverse(function (o) { if (o.isMesh) { o.castShadow = true; o.userData.chave = true; } });
    g.userData.material = material;
    return g;
  }

  function criarChave() {
    var grupo = new THREE.Group();
    grupo.name = 'chave';
    var modelos = DESENHOS.map(criarModeloDeChave);
    for (var i = 0; i < modelos.length; i++) { modelos[i].visible = i === 0; grupo.add(modelos[i]); }
    /* A ponta é a origem do grupo. */
    var ponta = new THREE.Object3D();
    ponta.name = 'ponta-da-chave';
    grupo.add(ponta);
    grupo.userData.exportExclude = true;
    grupo.userData.modelos = modelos;
    /* Pontos de colisão ao longo do corpo, em coordenadas do grupo: a ponta,
       o meio da haste, o palhetão e o anel. */
    grupo.userData.pontosDoCorpo = [
      new THREE.Vector3(0, 0, 0), new THREE.Vector3(-0.007, -0.011, 0),
      new THREE.Vector3(-COMPRIMENTO_HASTE / 2, 0, 0), new THREE.Vector3(-COMPRIMENTO_HASTE - 0.0115, 0, 0)
    ];
    return { grupo: grupo, ponta: ponta, material: modelos[0].userData.material, modelos: modelos };
  }

  /* Qual das três aparece: uma por camada. */
  function escolherChave(grupo, nivel) {
    var modelos = grupo.userData.modelos || [];
    for (var i = 0; i < modelos.length; i++) modelos[i].visible = i === Math.min(modelos.length - 1, Math.max(0, nivel || 0));
  }

  /* A face larga da chave vira para quem olha, e a ponta aponta para longe e
     um pouco para baixo — como uma chave na mão, a caminho da fechadura. */
  function orientarChave(grupo, camera, raiz) {
    var frente = new THREE.Vector3(), cima = new THREE.Vector3(0, 1, 0), direita = new THREE.Vector3();
    camera.getWorldDirection(frente);
    cima.applyQuaternion(camera.quaternion);
    direita.crossVectors(frente, cima).normalize();
    var eixo = frente.clone().multiplyScalar(0.35).addScaledVector(cima, -0.55).addScaledVector(direita, 0.75).normalize();
    var normal = frente.clone().negate();
    normal.addScaledVector(eixo, -normal.dot(eixo)).normalize();
    var y = new THREE.Vector3().crossVectors(normal, eixo).normalize();
    var m = new THREE.Matrix4().makeBasis(eixo, y, normal);
    var q = new THREE.Quaternion().setFromRotationMatrix(m);
    /* Para o espaço da maquete (que pode estar girada e escalada em RA). */
    var qRaiz = new THREE.Quaternion();
    raiz.getWorldQuaternion(qRaiz);
    grupo.quaternion.copy(qRaiz.invert().multiply(q));
  }

  /* ---- halo dos alvos e das fechaduras ----------------------------------- */

  /* Um alfinete: fio fino saindo do objeto e uma conta de luz em cima. O anel
     no chão sozinho não se vê — medido na tela em 17/09/2026, sobre o lajeado
     claro e sobre a pedra ele simplesmente desaparece. O fio é o que liga a
     marca AO OBJETO; sem ele a conta flutuando aponta para nada. */
  function alfinete(cor, altura) {
    var grupo = new THREE.Group();
    /* Com `depthTest:false` o alfinete aparecia POR CIMA do telhado mesmo
       quando o objeto estava do outro lado da casa — uma marca que aponta para
       onde a coisa não está. Ele respeita a profundidade; quem enquadra a cena
       é que põe a câmera do lado certo. */
    var material = new THREE.MeshBasicMaterial({ color: cor, transparent: true, opacity: 0 });
    var fio = new THREE.Mesh(new THREE.CylinderGeometry(0.0012, 0.0012, altura, 6), material);
    fio.position.y = altura / 2;
    var conta = new THREE.Mesh(new THREE.SphereGeometry(0.0075, 12, 10), material);
    conta.position.y = altura;
    grupo.add(fio, conta);
    grupo.renderOrder = 6;
    grupo.userData.exportExclude = true;
    grupo.userData.marca = material;
    grupo.traverse(function (o) { o.raycast = function () {}; });
    return grupo;
  }

  function halo(cor, raio) {
    var m = new THREE.Mesh(
      new THREE.RingGeometry(raio * 0.72, raio, 28).rotateX(-Math.PI / 2),
      new THREE.MeshBasicMaterial({ color: cor, transparent: true, opacity: 0.0, side: THREE.DoubleSide, depthWrite: false })
    );
    m.userData.exportExclude = true;
    m.raycast = function () {};
    return m;
  }

  /* ---- camadas no lugar ------------------------------------------------- */

  /* O modelo de 18/09/2026 veio do editor com o TELHADO erguido 8,2 unidades
     (a vista "explodida" do editor ficou gravada no nó `telhado`). A maquete
     nascia com o telhado já fora — antes de qualquer chave (Mario, 18/09/2026:
     "o telhado já apareceu fora (levantado) quando não deveria"). Toda camada
     que se solta nasce ASSENTADA: quem ergue é a atividade, nunca o arquivo. */
  function realinharCamadas(cena) {
    var feitas = [];
    cena.traverse(function (o) {
      for (var i = 0; i < CAMADAS.length; i++) {
        if (CAMADAS[i] === 'terreno' || o.name !== CAMADAS[i]) continue;
        if (Math.abs(o.position.x) + Math.abs(o.position.y) + Math.abs(o.position.z) > 1e-6) {
          feitas.push({ camada: o.name, desvio: o.position.toArray() });
          o.position.set(0, 0, 0);
          o.updateMatrix();
        }
      }
    });
    return feitas;
  }

  /* ---- o penhasco -------------------------------------------------------- */

  /* O penhasco saía alto demais: a casa ficava num pedestal de rocha mais
     alto que o próprio térreo (Mario, 19/09/2026: "as rochas e penhascos
     estão muito altos"). A rocha entre o mar e o CORTE (logo abaixo do fundo
     do porão, 9,84) é achatada por `ALTURA_DO_PENHASCO`; tudo acima do corte
     — o terreiro, o porão, a casa — só desce junto, sem deformar. Abaixo do
     mar nada muda: fica dentro da resina. Unidades do editor.
     Quem mudar o fator TEM de remedir FECHADURAS (ac-maquete-state.mjs): a
     casa desce e a pegada normalizada muda um pouco. O teste da geometria
     diz os pontos novos. */
  /* SUBSTITUIDO (01/10): 0.45 — valia para o modelo antigo, em unidades do editor.
     O modelo novo já vem com a casa no lugar: nada se achata. */
  var ALTURA_DO_PENHASCO = 1; // fração da rocha que fica (1 = original)
  var CORTE_DO_PENHASCO = 9.5;
  function baixarPenhasco(cena, fator) {
    if (!(fator > 0 && fator < 1)) return 0;
    var mar = NIVEL_DO_MAR, corte = CORTE_DO_PENHASCO, queda = (corte - mar) * (1 - fator);
    cena.updateMatrixWorld(true);
    var malhas = [], antes = new Map();
    cena.traverse(function (o) {
      if (!o.isMesh || !o.geometry || !o.geometry.attributes.position) return;
      malhas.push(o); antes.set(o, o.matrixWorld.clone());
    });
    /* 1 — o que está inteiro acima do corte só DESCE, como peça: a origem de
       cada objeto continua no objeto (os alvos e o teste de alcance medem por
       ela). Descendente de quem já desceu vai junto. */
    var desceu = new Set(), caixa = new THREE.Box3(), delta = new THREE.Vector3(), m3 = new THREE.Matrix3();
    function ancestralDesceu(o) { for (var n = o.parent; n; n = n.parent) if (desceu.has(n)) return true; return false; }
    for (var k = 0; k < malhas.length; k++) {
      var o = malhas[k];
      if (!o.geometry.boundingBox) o.geometry.computeBoundingBox();
      caixa.copy(o.geometry.boundingBox).applyMatrix4(antes.get(o));
      if (caixa.min.y <= corte) continue;
      desceu.add(o);
      if (ancestralDesceu(o)) continue;
      delta.set(0, -queda, 0);
      if (o.parent) delta.applyMatrix3(m3.setFromMatrix4(o.parent.matrixWorld).invert());
      o.position.add(delta); o.updateMatrix(); o.updateMatrixWorld(true);
    }
    /* 2 — a rocha que atravessa o corte é deformada vértice a vértice. */
    var v = new THREE.Vector3(), n = new THREE.Vector3(), inv = new THREE.Matrix4(), nm = new THREE.Matrix3(), nmInv = new THREE.Matrix3();
    for (k = 0; k < malhas.length; k++) {
      o = malhas[k];
      if (desceu.has(o)) continue;
      var M = antes.get(o), g = o.geometry.clone(), pos = g.attributes.position, nor = g.attributes.normal;
      inv.copy(o.matrixWorld).invert(); nm.getNormalMatrix(M); nmInv.getNormalMatrix(o.matrixWorld).invert();
      var mexeu = false;
      for (var i = 0; i < pos.count; i++) {
        v.fromBufferAttribute(pos, i).applyMatrix4(M);
        var achatado = v.y > mar && v.y <= corte;
        if (v.y > corte) { v.y -= queda; mexeu = true; }
        else if (achatado) { v.y = mar + (v.y - mar) * fator; mexeu = true; }
        v.applyMatrix4(inv);
        pos.setXYZ(i, v.x, v.y, v.z);
        /* Achatar em y inclina as normais: a rocha tem de continuar recebendo
           a luz como uma parede, não como um degrau liso. */
        if (achatado && nor) {
          n.fromBufferAttribute(nor, i).applyMatrix3(nm);
          n.y /= fator; n.normalize().applyMatrix3(nmInv).normalize();
          nor.setXYZ(i, n.x, n.y, n.z);
        }
      }
      if (!mexeu && o.matrixWorld.equals(M)) continue;
      pos.needsUpdate = true; if (nor) nor.needsUpdate = true;
      g.computeBoundingBox(); g.computeBoundingSphere();
      o.geometry = g;
    }
    return queda;
  }

  /* ---- a borda de pedra (modelo de 01/10/2026) ---------------------------
     O modelo novo cerca o terreiro com pedras que sobem até 3,4 m acima do
     chão. Vistas de lado (a vista padrão no celular), elas ficavam NA FRENTE
     do caminho de chegada e engoliam o toque nos esconderijos da chave (a
     moita, a pedra solta, o pilar, as lajes): o raio batia na rocha antes.
     Tudo o que é rocha e passa de LIMITE_DA_BORDA acima do chão é achatado;
     o que fica abaixo do chão (o penhasco até o mar) não muda. Em metros. */
  var LIMITE_DA_BORDA = 0.35, FATOR_DA_BORDA = 0.12;
  function achatarBorda(cena) {
    var mexidas = 0, v = new THREE.Vector3(), inv = new THREE.Matrix4();
    cena.updateMatrixWorld(true);
    cena.traverse(function (o) {
      if (!o.isMesh || !temAncestral(o, 'penhasco')) return;
      var g = o.geometry.clone(), pos = g.attributes.position, M = o.matrixWorld, mexeu = false;
      inv.copy(M).invert();
      for (var i = 0; i < pos.count; i++) {
        v.fromBufferAttribute(pos, i).applyMatrix4(M);
        if (v.y <= LIMITE_DA_BORDA) continue;
        v.y = LIMITE_DA_BORDA + (v.y - LIMITE_DA_BORDA) * FATOR_DA_BORDA; mexeu = true;
        v.applyMatrix4(inv); pos.setXYZ(i, v.x, v.y, v.z);
      }
      if (!mexeu) return;
      pos.needsUpdate = true; g.computeVertexNormals(); g.computeBoundingBox(); g.computeBoundingSphere();
      o.geometry = g; mexidas++;
    });
    return mexidas;
  }

  /* ---- a base ------------------------------------------------------------ */

  /* A maquete é um penhasco sobre o mar: o fundo do modelo são rochedos e
     poças soltos a alturas diferentes. Pousada numa mesa, ela ficava apoiada
     em pedras — torta, sem chão (Mario, 18/09/2026: "se tem uma base que não é
     reta, refaça"). Agora ela tem o que toda maquete de arquitetura tem: um
     TABULEIRO plano de madeira, e sobre ele o mar como um bloco de resina
     escura até o nível das poças. Os rochedos afundam no mar; o penhasco sobe
     dele. A base fica fora das camadas: não se ergue e não vira fantasma. */
  /* SUBSTITUIDO (01/10): 2.55 (unidades do editor do modelo antigo). No modelo novo
     é a altura do mar ACIMA DO PONTO MAIS BAIXO do penhasco, em metros. */
  var NIVEL_DO_MAR = 0.6;
  function criarBase(raiz, escala) {
    var grupo = new THREE.Group();
    grupo.name = 'base-da-maquete';
    var caixa = new THREE.Box3();
    raiz.traverse(function (o) { if (o.isMesh && !o.userData.exportExclude) caixa.expandByObject(o); });
    var largura = caixa.max.x - caixa.min.x + 0.04, fundo = caixa.max.z - caixa.min.z + 0.04;
    var cx = (caixa.max.x + caixa.min.x) / 2, cz = (caixa.max.z + caixa.min.z) / 2;
    var espessura = 0.014, mar = NIVEL_DO_MAR * escala;
    var madeira = new THREE.MeshStandardMaterial({ color: 0x0f0703, roughness: 0.55, metalness: 0.05 });
    var tabua = new THREE.Mesh(new THREE.BoxGeometry(largura + 0.03, espessura, fundo + 0.03), madeira);
    tabua.position.set(cx, espessura / 2, cz);
    tabua.name = 'tabuleiro';
    var resina = new THREE.MeshStandardMaterial({ color: 0x01080b, roughness: 0.28, metalness: 0.0 });
    var agua = new THREE.Mesh(new THREE.BoxGeometry(largura, Math.max(0.002, mar - espessura), fundo), resina);
    agua.position.set(cx, espessura + (mar - espessura) / 2, cz);
    agua.name = 'mar';
    var latao = new THREE.MeshStandardMaterial({ color: 0xc39b51, roughness: 0.3, metalness: 0.8 });
    var placa = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.008, 0.0015), latao);
    placa.position.set(cx, espessura / 2, cz + (fundo + 0.03) / 2 + 0.0008);
    placa.name = 'placa';
    grupo.add(tabua, agua, placa);
    grupo.traverse(function (o) { if (o.isMesh) { o.receiveShadow = true; o.castShadow = o !== agua; o.userData.base = true; } });
    raiz.add(grupo);
    return { grupo: grupo, topo: mar, tabuleiro: tabua, mar: agua };
  }

  /* ---- carregamento ------------------------------------------------------ */

  function carregar(opcoes, pronto, falhou) {
    opcoes = opcoes || {};
    var url = opcoes.url || ARQUIVO;
    new THREE.GLTFLoader().load(url, function (gltf) {
      try { pronto(montar(gltf.scene, opcoes)); }
      catch (e) { if (falhou) falhou(e); else throw e; }
    }, null, function (e) { if (falhou) falhou(e || Error('Não foi possível carregar a maquete.')); });
  }

  /* Os "botões" do editor. O modelo de 18/09/2026 veio com seis medalhões
     de ponto clicável do editor de origem (`medalhao-relogio` "Base do
     relógio", `medalhao-armario-oeste`…, com `extras.label`): discos dourados
     flutuando sobre os objetos — dois deles em cima de esconderijos. Não são
     do jogo: as marcas da atividade são os alfinetes daqui. Foram tirados do
     arquivo, e quem reexportar o modelo com eles de volta não os vê em cena. */
  function tirarBotoesDoEditor(cena) {
    var fora = [];
    cena.traverse(function (o) {
      var u = o.userData || {};
      if (/^medalhao/.test(o.name || '') || u.label || u.decoration) fora.push(o);
    });
    for (var i = 0; i < fora.length; i++) if (fora[i].parent) fora[i].parent.remove(fora[i]);
    return fora.length;
  }

  function montar(cena, opcoes) {
    var botoesDoEditor = tirarBotoesDoEditor(cena);
    var realinhadas = realinharCamadas(cena);
    var quedaDoPenhasco = baixarPenhasco(cena, opcoes.alturaDoPenhasco != null ? opcoes.alturaDoPenhasco : ALTURA_DO_PENHASCO);
    var bordaAchatada = opcoes.manterBorda ? 0 : achatarBorda(cena);
    cena.updateMatrixWorld(true);

    /* 1 — normalizar para pegada 1, base em y=0, centro em x/z. */
    var bruto = new THREE.Box3().setFromObject(cena);
    var tamanho = bruto.getSize(new THREE.Vector3());
    var escala = 1 / Math.max(tamanho.x, tamanho.z);
    var centro = bruto.getCenter(new THREE.Vector3());
    var ajuste = new THREE.Group();
    ajuste.name = 'maquete-normalizada';
    ajuste.scale.setScalar(escala);
    ajuste.position.set(-centro.x * escala, -bruto.min.y * escala, -centro.z * escala);
    ajuste.add(cena);
    var raiz = new THREE.Group();
    raiz.name = 'maquete';
    raiz.add(ajuste);
    raiz.updateMatrixWorld(true);

    var relogio = acertarRelogio(raiz);

    /* 2 — recolher alvos e fechaduras ANTES de fundir: o que vira geometria
       fundida perde o nome e não pode mais ser tocado nem aceso. */
    var reservados = new Set();
    var alvos = {}, i;
    for (i = 0; i < ALVOS.length; i++) alvos[ALVOS[i].id] = recolher(raiz, ALVOS[i], reservados);
    var fechaduras = {};
    for (i = 0; i < FECHADURAS.length; i++) fechaduras[FECHADURAS[i].id] = recolher(raiz, FECHADURAS[i], reservados);
    var revelacao = recolher(raiz, REVELACAO, reservados);

    /* 3 — camadas: cada uma vira um grupo próprio, com material próprio, para
       poder subir e desaparecer sem levar as outras junto. */
    var camadas = {}, restante = [];
    for (i = 0; i < CAMADAS.length; i++) camadas[CAMADAS[i]] = novaCamada(CAMADAS[i], raiz);
    raiz.updateMatrixWorld(true);
    raiz.traverse(function (o) {
      if (o.isMesh && !reservados.has(o) && !o.userData.exportExclude) restante.push(o);
    });
    var porCamada = {};
    for (i = 0; i < restante.length; i++) {
      var nome = camadaDe(restante[i]);
      (porCamada[nome] || (porCamada[nome] = [])).push(restante[i]);
    }
    var desenhos = 0;
    for (var nomeCamada in porCamada) {
      var grupo = camadas[nomeCamada] || camadas['terreno'];
      var porMaterial = new Map();
      var lista = porCamada[nomeCamada];
      for (i = 0; i < lista.length; i++) {
        var mat = lista[i].material;
        if (!porMaterial.has(mat)) porMaterial.set(mat, []);
        porMaterial.get(mat).push(lista[i]);
      }
      porMaterial.forEach(function (malhas, material) {
        var geo = fundir(malhas, grupo);
        if (!geo) return;
        var copia = material.clone();
        copia.side = THREE.FrontSide;
        var malha = new THREE.Mesh(geo, copia);
        malha.name = nomeCamada + '/' + (material.name || 'material');
        malha.castShadow = true; malha.receiveShadow = true;
        grupo.add(malha);
        desenhos++;
      });
    }
    /* Os nós originais ficam fora da cena: já viraram geometria fundida. */
    var original = raiz.children[0];
    raiz.remove(original);

    /* 4 — reencaixar alvos e fechaduras nas suas camadas, agora como peças
       independentes e clicáveis. */
    var idsAlvo = Object.keys(alvos);
    for (i = 0; i < idsAlvo.length; i++) prender(alvos[idsAlvo[i]], camadas, raiz, 'alvo');
    var idsFech = Object.keys(fechaduras);
    for (i = 0; i < idsFech.length; i++) prender(fechaduras[idsFech[i]], camadas, raiz, 'fechadura');
    prender(revelacao, camadas, raiz, 'fechadura');
    /* A passagem nasce escondida (extras.hidden no arquivo; revisão 2: pública só no Cap. 4). */
    if (revelacao.grupo && !opcoes.mostrarPassagem) revelacao.grupo.visible = false;

    /* 5 — âncoras das fechaduras: o ponto exato que o motor confere. */
    var ancoras = [];
    for (i = 0; i < FECHADURAS.length; i++) {
      var p = opcoes.pontos ? opcoes.pontos[i] : null;
      var ancora = new THREE.Object3D();
      ancora.name = 'ancora-' + FECHADURAS[i].id;
      if (p) ancora.position.set(p[0], p[1], p[2]);
      else {
        var c = fechaduras[FECHADURAS[i].id];
        ancora.position.set(c.centro.x, c.caixa.max.y, c.centro.z);
      }
      ancora.userData.exportExclude = true;
      raiz.add(ancora);
      var anel = halo(0xffd489, 0.026);
      anel.position.copy(ancora.position);
      anel.position.y += 0.0015;
      raiz.add(anel);
      var pino = alfinete(0xffd489, 0.055);
      pino.position.copy(ancora.position);
      raiz.add(pino);
      ancoras.push({ ponto: ancora, halo: anel, pino: pino, id: FECHADURAS[i].id, peca: fechaduras[FECHADURAS[i].id] });
    }

    var chave = criarChave();
    raiz.add(chave.grupo);

    var base = criarBase(raiz, escala);

    raiz.updateMatrixWorld(true);
    /* A caixa que interessa é a da MAQUETE, não a da cena: a chave nasce na
       origem e desceria a base uns 9 mm, o que em RA enterraria a casa na
       mesa por conta de um objeto que nem está posto ainda. */
    var completo = new THREE.Box3();
    for (i = 0; i < CAMADAS.length; i++) completo.expandByObject(camadas[CAMADAS[i]]);
    completo.expandByObject(base.grupo);

    return {
      raiz: raiz,
      camadas: camadas,
      ordemDasCamadas: CAMADAS.slice(),
      alvos: alvos,
      fechaduras: fechaduras,
      ancoras: ancoras,
      chave: chave.grupo,
      chavePonta: chave.ponta,
      chaveMaterial: chave.material,
      chaveModelos: chave.modelos,
      base: base,
      camadasRealinhadas: realinhadas,
      revelacao: revelacao,
      baseY: Math.abs(completo.min.y) < 1e-6 ? 0 : completo.min.y,
      altura: completo.max.y - completo.min.y,
      escalaOriginal: escala,
      relogio: relogio,
      desenhos: desenhos,
      botoesDoEditor: botoesDoEditor,
      quedaDoPenhasco: quedaDoPenhasco * escala
    };
  }

  function novaCamada(nome, raiz) {
    var g = new THREE.Group();
    g.name = 'camada-' + nome;
    g.userData.camada = nome;
    g.userData.restY = 0;
    raiz.add(g);
    return g;
  }

  /* A camada de um nó é o ancestral de primeiro nível dentro de `casa-da-costa`. */
  function camadaDe(objeto) {
    for (var n = objeto; n; n = n.parent) {
      for (var e in EXCECOES) if (bate(n.name, e)) return EXCECOES[e];
      for (var i = 0; i < CAMADAS.length; i++) if (bate(n.name, CAMADAS[i])) return CAMADAS[i];
    }
    return 'terreno';
  }

  function recolher(raiz, regra, reservados) {
    var nomes = nomesDe(regra), pecas = [];
    raiz.traverse(function (o) {
      if (!o.isMesh) return;
      if (regra.ancestral && !temAncestral(o, regra.ancestral)) return;
      if (nomes) {
        var achado = false;
        for (var n = o; n && !achado; n = n.parent) if (bateAlgum(n.name, nomes)) achado = true;
        if (!achado) return;
      }
      if (regra.prefixo) {
        var achou = false;
        for (var k = o; k && !achou; k = k.parent) if (k.name && k.name.indexOf(regra.prefixo) === 0) achou = true;
        if (!achou) return;
      }
      pecas.push(o);
    });
    if (regra.extremo === 'maiorZ' || regra.extremo === 'menorX') {
      var eixo = regra.extremo === 'maiorZ' ? 'z' : 'x', sinal = regra.extremo === 'maiorZ' ? -1 : 1;
      /* `menorX` recolhe o CONJUNTO do extremo — é o pilar com o seu capitel.
         `maiorZ` recolhe UMA peça: as pedras soltas estão espalhadas, e juntar
         três põe o centro do alvo (e o alfinete) no chão entre elas. */
      var folga = regra.folga != null ? regra.folga : (regra.extremo === 'menorX' ? 0.06 : 0.001);
      /* Vários nós com o mesmo nome espalhados pelo terreno: fica o CONJUNTO do
         portão, o de menor x. Ficar com uma peça só partia o pilar do seu
         capitel; ficar com todas punha o centro do alvo no vão ENTRE os dois
         pilares, onde não há geometria nenhuma — e o toque não acertava nada. */
      var centros = [], menor = Infinity, i;
      for (i = 0; i < pecas.length; i++) {
        var c = new THREE.Box3().setFromObject(pecas[i]).getCenter(new THREE.Vector3());
        centros.push(c); if (c[eixo] * sinal < menor) menor = c[eixo] * sinal;
      }
      var perto = [];
      for (i = 0; i < pecas.length; i++) if (centros[i][eixo] * sinal < menor + folga) perto.push(pecas[i]);
      pecas = perto;
    }
    for (var j = 0; j < pecas.length; j++) {
      reservados.add(pecas[j]);
      /* A pose de mundo é guardada AQUI porque `prender` roda depois de a
         árvore original sair da cena — ler `matrixWorld` lá seria ler restos. */
      pecas[j].userData.poseDeMundo = pecas[j].matrixWorld.clone();
    }
    return { id: regra.id, camada: regra.camada, pecas: pecas };
  }

  function prender(conjunto, camadas, raiz, tipo) {
    var destino = camadas[conjunto.camada] || raiz;
    var grupo = new THREE.Group();
    grupo.name = tipo + '-' + conjunto.id;
    grupo.userData[tipo === 'alvo' ? 'object' : 'fechadura'] = conjunto.id;
    destino.add(grupo);
    destino.updateMatrixWorld(true);
    var inversa = new THREE.Matrix4().copy(destino.matrixWorld).invert();
    var caixaLocal = new THREE.Box3();
    for (var i = 0; i < conjunto.pecas.length; i++) {
      var p = conjunto.pecas[i];
      var m = new THREE.Matrix4().multiplyMatrices(inversa, p.userData.poseDeMundo || p.matrixWorld);
      var copia = new THREE.Mesh(p.geometry, p.material.clone());
      copia.name = p.name;
      /* Cada peça de alvo e de fechadura tem material PRÓPRIO justamente para
         poder acender. A maçaneta da portada, por exemplo, fica debaixo da
         verga: um alfinete saindo dela nasce dentro da pedra e não se vê. */
      if (copia.material.emissive) { copia.material.emissive.setHex(0x000000); copia.userData.acendivel = true; }
      m.decompose(copia.position, copia.quaternion, copia.scale);
      copia.castShadow = true; copia.receiveShadow = true;
      grupo.add(copia);
      var local = p.geometry.boundingBox ? p.geometry.boundingBox.clone() : new THREE.Box3().setFromBufferAttribute(p.geometry.attributes.position);
      caixaLocal.union(local.applyMatrix4(m));
    }
    grupo.updateMatrixWorld(true);
    var tem = conjunto.pecas.length > 0;
    var centro = tem ? caixaLocal.getCenter(new THREE.Vector3()) : new THREE.Vector3();
    /* O anel é MARCA, não contorno. Sem teto, os dois pilares do portão viram
       um anel de 24 cm que atravessa metade do terreiro. */
    var raio = tem ? Math.min(0.040, Math.max(0.012, Math.max(caixaLocal.max.x - caixaLocal.min.x, caixaLocal.max.z - caixaLocal.min.z) * 0.62)) : 0.012;
    var cor = tipo === 'alvo' ? 0x9fe7d6 : 0xffd489;
    var anel = halo(cor, raio);
    anel.position.set(centro.x, (tem ? caixaLocal.min.y : 0) + 0.0015, centro.z);
    grupo.add(anel);
    var pino = alfinete(cor, 0.055);
    pino.position.set(centro.x, tem ? caixaLocal.max.y + 0.004 : 0, centro.z);
    grupo.add(pino);
    conjunto.grupo = grupo;
    conjunto.halo = anel;
    conjunto.pino = pino;
    conjunto.acender = function (cor, forca) {
      grupo.traverse(function (o) {
        if (!o.userData.acendivel || !o.material || !o.material.emissive) return;
        o.material.emissive.setHex(cor);
        o.material.emissiveIntensity = forca;
      });
    };
    conjunto.centro = centro.clone();
    conjunto.caixa = caixaLocal.clone();
    return grupo;
  }

  global.ACMaquetteMundo = {
    carregar: carregar,
    escolherChave: escolherChave,
    orientarChave: orientarChave,
    montar: montar,
    ARQUIVO: ARQUIVO,
    _criarChave: criarChave,
    CAMADAS: CAMADAS,
    ALVOS: ALVOS,
    FECHADURAS: FECHADURAS,
    RELOGIO: RELOGIO
  };
})(typeof window !== 'undefined' ? window : globalThis);
