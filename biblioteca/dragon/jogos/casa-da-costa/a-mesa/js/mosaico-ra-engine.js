/**
 * ============================================================
 * MOSAICO RA & 3D ENGINE v2 — INVESTIGAÇÃO IMERSIVA
 * A Casa da Costa — Dragon Games
 * ============================================================
 * 3 modos de vivência:
 *  1. "sala3d"     — Sala volumétrica Three.js com 9 objetos canônicos,
 *                    lanterna cônica, inspeção tátil 360° e pêndulo.
 *  2. "camera-ra"  — RA INVESTIGATIVA: 6 hologramas 3D flutuando no seu
 *                    ambiente real. Giroscópio ancora os objetos. Radar forense
 *                    detecta proximidade. Coleta de 6 pistas reais do caso.
 *  3. "anamorfose" — Fragmentos suspensos que só formam "21:29" no ângulo exato.
 */
(function (global) {
  "use strict";

  /* ============================================================
     CATÁLOGO DOS 6 OBJETOS HOLOGRÁFICOS RA
     ============================================================ */
  var RA_CATALOGO = [
    {
      id: "vela",
      nome: "Vela Apagada",
      icone: "🕯️",
      azimute: 0,
      distancia: 1.9,
      altura: 1.28,
      corAura: 0xffecd0,
      corGlow: 0xff8c42,
      narrativaLinhas: [
        "A vela da sala de visitas estava sobre a escrivaninha.",
        "",
        "Quando os socorristas chegaram, a cera tinha escorrido na diagonal.",
        "",
        "Não havia corrente de ar naquela noite.",
        "A janela estava fechada por dentro.",
        "",
        "Alguém a apagou antes de sair."
      ],
      pista: "21:29 — Chama extinta de dentro. Cera escorreu na direção do cofre. Sem brisa registrada.",
      pistaId: "ra_vela",
      descoberta: false
    },
    {
      id: "envelope",
      nome: "Carta Interceptada",
      icone: "📋",
      azimute: 60,
      distancia: 2.3,
      altura: 1.15,
      corAura: 0x4dfcba,
      corGlow: 0x00e5a0,
      narrativaLinhas: [
        "A carta chegou na tarde do crime.",
        "",
        "O invólucro foi rasgado com força — não com abridor.",
        "Quem rasgou sabia o que estava escrito.",
        "",
        "A tinta ultravioleta revela texto oculto:",
        "assinado apenas pela inicial A."
      ],
      pista: "Carta interceptada — 'Se o cofre já estiver aberto, não entre.' — A.",
      pistaId: "ra_carta",
      descoberta: false
    },
    {
      id: "chave",
      nome: "Chave Mestra",
      icone: "🗝️",
      azimute: 140,
      distancia: 1.6,
      altura: 0.78,
      corAura: 0xf7c94a,
      corGlow: 0xe8a44c,
      narrativaLinhas: [
        "A chave estava no casaco do sr. Costa.",
        "",
        "Não na escrivaninha, como o protocolo exige.",
        "",
        "Alguém moveu o casaco antes de sair.",
        "Impressão de luva nitrílica detectada no metal."
      ],
      pista: "Chave mestra do cofre — bolso esquerdo do casaco de Costa. Impressão de luva nitrílica.",
      pistaId: "ra_chave",
      descoberta: false
    },
    {
      id: "marca",
      nome: "Rastro no Chão",
      icone: "👣",
      azimute: 215,
      distancia: 1.1,
      altura: 0.01,
      corAura: 0xff3a3a,
      corGlow: 0xff6b6b,
      narrativaLinhas: [
        "Dois pares de calçado identificados.",
        "",
        "Tamanho 42 — solado liso.",
        "Tamanho 38 — bico fino, feminino.",
        "",
        "Objeto pesado (~40 kg) arrastado.",
        "Trajetória: cofre → janela norte."
      ],
      pista: "Dois indivíduos. Peso ~40 kg arrastado do cofre à janela. Janela aberta por dentro.",
      pistaId: "ra_marca",
      descoberta: false
    },
    {
      id: "gravador",
      nome: "Gravador Oculto",
      icone: "📼",
      azimute: 280,
      distancia: 2.1,
      altura: 1.55,
      corAura: 0xff5555,
      corGlow: 0xff1111,
      narrativaLinhas: [
        "A gravação começa às 21h18.",
        "Onze minutos antes do silêncio total.",
        "",
        "Duas vozes — uma agitada, outra calma.",
        "",
        "O gravador estava escondido",
        "atrás da fileira de livros de direito."
      ],
      pista: "Fragmento: '...não é hora de hesitar. A janela fica aberta até meia-noite...'",
      pistaId: "ra_gravador",
      descoberta: false
    },
    {
      id: "espelho_ra",
      nome: "Espelho Partido",
      icone: "🔮",
      azimute: 330,
      distancia: 1.45,
      altura: 1.72,
      corAura: 0x7fd4ff,
      corGlow: 0x44aaff,
      narrativaLinhas: [
        "O espelho foi quebrado após as 21h29.",
        "",
        "O fragmento maior preserva o reflexo do relógio.",
        "O ponteiro indica a posição de 21h.",
        "",
        "Mas o relógio estava adiantado 8 minutos.",
        "A hora real do crime: 21:21."
      ],
      pista: "Espelho reflete '21:21'. Relógio adiantado 8 min — hora real do crime: 21:21, não 21:29.",
      pistaId: "ra_espelho",
      descoberta: false
    }
  ];

  /* ============================================================
     ESTADO PRINCIPAL DO MOTOR
     ============================================================ */
  var MosaicoRA = {
    ativo: false,
    modo: "sala3d",
    container: null,
    renderer: null,
    scene: null,
    camera: null,
    spotlight: null,
    ambientLight: null,
    videoElement: null,
    animId: null,
    orientacao: { yaw: 0, pitch: 0, targetYaw: 0, targetPitch: 0 },
    objetos3D: {},
    inspecionando: null,
    anamorfoseTracos: [],
    anamorfoseAlvo: { yaw: 137, pitch: 11 },
    anamorfoseAlinhada: false,
    emCopa: false,
    salaGroup: null,
    anamorfoseGroup: null,
    pistasUVGroup: null,
    // RA Investigação
    raObjetos: [],
    raObjetosGroup: null,
    raParticulasCanvas: null,
    raParticulas: [],
    raParticulasAnimId: null,
    raPistasColetadas: {},
    raProximoId: null,
    raProximidadeMs: 0,
    // Inspeção e investigação
    inspectAnimId: null,
    invAnimId: null,
    invRenderer: null
  };

  /* ============================================================
     1. INICIALIZAÇÃO
     ============================================================ */
  MosaicoRA.iniciar = function (containerId, modoInicial) {
    document.body.classList.add("modo-ra-ativo");
    var gate = document.getElementById("dragonRoomGate");
    if (gate) { gate.style.display = "none"; try { gate.remove(); } catch (e) {} }

    var cont = typeof containerId === "string" ? document.getElementById(containerId) : containerId;
    if (!cont) {
      cont = document.createElement("div");
      cont.id = "mosaico-ra-viewport";
      document.body.appendChild(cont);
    }
    MosaicoRA.container = cont;
    MosaicoRA.container.className = "mosaico-ra-container";
    MosaicoRA.container.innerHTML = "";
    MosaicoRA.container.style.cssText = "position:fixed;inset:0;width:100%;height:100%;z-index:200000;background:#04060a;overflow:hidden;";

    MosaicoRA.modo = (modoInicial === "ra" || modoInicial === "camera-ra") ? "camera-ra" : (modoInicial || "sala3d");
    MosaicoRA.ativo = true;
    MosaicoRA.raObjetos = RA_CATALOGO.map(function (c) {
      return { id: c.id, nome: c.nome, icone: c.icone, azimute: c.azimute, distancia: c.distancia,
        altura: c.altura, corAura: c.corAura, corGlow: c.corGlow, narrativaLinhas: c.narrativaLinhas,
        pista: c.pista, pistaId: c.pistaId, descoberta: false, mesh: null, luz: null, baseY: c.altura };
    });
    MosaicoRA.raPistasColetadas = {};
    MosaicoRA.raObjetosGroup = null;
    MosaicoRA.raParticulasCanvas = null;

    if (typeof THREE === "undefined") {
      setTimeout(function () { MosaicoRA.iniciar(containerId, modoInicial); }, 50);
      return;
    }

    var w = window.innerWidth, h = window.innerHeight;

    // Vídeo de fundo (câmera real)
    var vid = document.createElement("video");
    vid.id = "mosaico-ra-video-bg";
    vid.autoplay = true; vid.playsInline = true; vid.muted = true;
    vid.setAttribute("playsinline", ""); vid.setAttribute("webkit-playsinline", "");
    vid.style.cssText = "position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:1;display:none;";
    cont.appendChild(vid);
    MosaicoRA.videoElement = vid;

    // Renderer WebGL com alpha
    MosaicoRA.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    MosaicoRA.renderer.setSize(w, h);
    MosaicoRA.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    MosaicoRA.renderer.outputEncoding=THREE.sRGBEncoding;
    MosaicoRA.renderer.toneMapping=THREE.ACESFilmicToneMapping;
    MosaicoRA.renderer.toneMappingExposure=.82;
    MosaicoRA.renderer.shadowMap.enabled = true;
    MosaicoRA.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    MosaicoRA.renderer.domElement.style.cssText = "position:absolute;inset:0;width:100%;height:100%;z-index:2;pointer-events:auto;";
    cont.appendChild(MosaicoRA.renderer.domElement);

    // Camera perspective
    MosaicoRA.camera = new THREE.PerspectiveCamera(65, w / h, 0.05, 50);
    MosaicoRA.camera.position.set(0, 1.55, 0);

    // Cena
    MosaicoRA.scene = new THREE.Scene();
    MosaicoRA.scene.background = new THREE.Color(0x04060a);

    // Iluminação
    MosaicoRA.ambientLight = new THREE.AmbientLight(0x1a2634, 0.35);
    MosaicoRA.scene.add(MosaicoRA.ambientLight);

    // BUG5-FIX: Lanterna cônica mais estreita e curta para efeito de lanterna real
    MosaicoRA.spotlight = new THREE.SpotLight(0xffecd0, 2.8, 6.5, Math.PI / 8, 0.55, 1.4);
    MosaicoRA.spotlight.castShadow = true;
    MosaicoRA.spotlight.shadow.mapSize.width = 1024;
    MosaicoRA.spotlight.shadow.mapSize.height = 1024;
    var spotTarget = new THREE.Object3D();
    spotTarget.position.set(0, 0, -3);
    MosaicoRA.camera.add(spotTarget);
    MosaicoRA.spotlight.target = spotTarget;
    MosaicoRA.camera.add(MosaicoRA.spotlight);
    MosaicoRA.scene.add(MosaicoRA.camera);

    MosaicoRA.construirSala3D();
    MosaicoRA.construirAnamorfose();
    MosaicoRA.montarHUD();
    MosaicoRA.ligarControles();

    // BUG2-FIX: esconder anamorfoseGroup se o modo inicial não for anamorfose
    if (MosaicoRA.anamorfoseGroup) {
      MosaicoRA.anamorfoseGroup.visible = (MosaicoRA.modo === "anamorfose");
    }

    if (MosaicoRA.modo === "camera-ra") {
      // BUG1-FIX: iOS requer gesto do usuário para camera/giroscópio.
      // Mostrar prompt primeiro em vez de chamar getUserMedia diretamente.
      MosaicoRA.mostrarPromptCamera(true, "Toque abaixo para ativar a câmera e explorar o ambiente em busca das 6 evidências.");
      // Aplicar visual de modo RA sem iniciar câmera ainda
      if (MosaicoRA.salaGroup) MosaicoRA.salaGroup.visible = false;
      if (MosaicoRA.scene) MosaicoRA.scene.background = new THREE.Color(0x030810);
    } else if (MosaicoRA.modo === "anamorfose") {
      MosaicoRA.trocarModo("anamorfose");
    }

    window.addEventListener("resize", MosaicoRA.redimensionar);
    MosaicoRA.renderer.setAnimationLoop(MosaicoRA.animar);
  };

  /* ============================================================
     2. SALA 3D — 9 OBJETOS CANÔNICOS
     ============================================================ */
  MosaicoRA.construirSala3D = function () {
    var room=ACRoom.create({seed:window.SEED||ACRoom.seed()});
    MosaicoRA.roomModel=room;MosaicoRA.salaGroup=room.root;MosaicoRA.objetos3D=room.objects;
    MosaicoRA.scene.add(room.root);
    MosaicoRA.camera.position.set(room.layout.eye[0],room.layout.eye[2],-room.layout.eye[1]);

  };

  /* ============================================================
     3. ANAMORFOSE ("A MARCA PARTIDA")
     ============================================================ */
  MosaicoRA.construirAnamorfose = function () {
    var grupoAnamorfose = new THREE.Group();
    grupoAnamorfose.name = "anamorfoseGroup";
    // alvoYaw: camera.rotation.y = -alpha*π/180, então para alpha=137 → yaw=-2.39rad
    // camera forward com yaw=-2.39: (sin(2.39), 0, cos(2.39)≈-0.73) → (+x, 0, +z)... 
    // projetarRaio deve usar o mesmo vetor: sin(-alvoRadYaw) = -sin(alvoRadYaw) para X
    // NOTA: a fórmula original era correta para o mapeamento deviceorientation iOS
    // (targetYaw = -alpha*π/180). Mantida igual ao original pré-rewrite.
    var alvoYaw = (137 * Math.PI) / 180;
    var alvoPitch = (11 * Math.PI) / 180;
    var tracos2D = [
      [-0.45, 0.3, -0.32, 0.3], [-0.32, 0.3, -0.32, 0.15], [-0.32, 0.15, -0.45, 0.0], [-0.45, 0.0, -0.32, 0.0],
      [-0.18, 0.25, -0.15, 0.3], [-0.15, 0.3, -0.15, 0.0],
      [-0.02, 0.22, -0.02, 0.20], [-0.02, 0.08, -0.02, 0.06],
      [0.08, 0.3, 0.21, 0.3], [0.21, 0.3, 0.21, 0.15], [0.21, 0.15, 0.08, 0.0], [0.08, 0.0, 0.21, 0.0],
      [0.32, 0.3, 0.45, 0.3], [0.32, 0.3, 0.32, 0.15], [0.32, 0.15, 0.45, 0.15], [0.45, 0.3, 0.45, 0.0], [0.32, 0.0, 0.45, 0.0]
    ];
    // BUG2-FIX: usar TubeGeometry em vez de Line para visibilidade em todos os GPUs
    var matTubo = new THREE.MeshBasicMaterial({ color: 0xffd97d, transparent: true, opacity: 0.92 });
    var matGlowTubo = new THREE.MeshBasicMaterial({ color: 0xff8c00, transparent: true, opacity: 0.28 });
    tracos2D.forEach(function (t, idx) {
      var distA = 1.4 + ((idx * 7) % 19) * 0.11;
      var distB = 1.4 + ((idx * 11) % 17) * 0.12;
      function projetarRaio(u, v, dist) {
        var dx = Math.sin(alvoYaw) * Math.cos(alvoPitch) + u * 0.35;
        var dy = Math.sin(alvoPitch) + v * 0.35;
        var dz = -Math.cos(alvoYaw) * Math.cos(alvoPitch);
        return new THREE.Vector3(dx * dist, 1.55 + dy * dist, dz * dist);
      }
      var pA = projetarRaio(t[0], t[1], distA);
      var pB = projetarRaio(t[2], t[3], distB);
      // Usar TubeGeometry (cilindro fino) — visível em qualquer GPU/iOS Safari
      var curve = new THREE.LineCurve3(pA, pB);
      var tuboGeo = new THREE.TubeGeometry(curve, 1, 0.006, 5, false);
      grupoAnamorfose.add(new THREE.Mesh(tuboGeo, matTubo));
      // Halo exterior (glow)
      var glowGeo = new THREE.TubeGeometry(curve, 1, 0.014, 5, false);
      grupoAnamorfose.add(new THREE.Mesh(glowGeo, matGlowTubo));
    });
    MosaicoRA.scene.add(grupoAnamorfose);
    MosaicoRA.anamorfoseGroup = grupoAnamorfose;
    // BUG2-FIX: inicialmente oculto — visível só em modo anamorfose
    grupoAnamorfose.visible = false;
  };

  /* ============================================================
     4. MUNDO RA — 6 HOLOGRAMAS 3D INVESTIGATIVOS
     ============================================================ */
  MosaicoRA.construirMundoRA = function () {
    if (MosaicoRA.raObjetosGroup) {
      MosaicoRA.raObjetosGroup.visible = true;
      return;
    }
    var grupo = new THREE.Group();
    grupo.name = "raObjetosGroup";
    MosaicoRA.raObjetosGroup = grupo;
    MosaicoRA.scene.add(grupo);

    // Grade forense no chão
    var gradeTex = MosaicoRA._criarTexturaGrade();
    var gradeFloor = new THREE.Mesh(
      new THREE.CircleGeometry(5, 48),
      new THREE.MeshBasicMaterial({ map: gradeTex, transparent: true, opacity: 0.1, side: THREE.DoubleSide, depthWrite: false })
    );
    gradeFloor.rotation.x = -Math.PI / 2; gradeFloor.position.y = 0.008; grupo.add(gradeFloor);

    MosaicoRA.raObjetos.forEach(function (obj, i) {
      var az = (obj.azimute * Math.PI) / 180;
      var x = Math.sin(az) * obj.distancia;
      var z = -Math.cos(az) * obj.distancia;

      var objGroup = new THREE.Group();
      objGroup.position.set(x, obj.baseY, z);
      objGroup._phase = i * (Math.PI * 2 / 6);
      objGroup._rotSpeed = 0.006 + i * 0.0015;

      // Luz pontual de aura
      var luzPonto = new THREE.PointLight(obj.corGlow, 0, 2.5);
      objGroup.add(luzPonto);
      obj.luz = luzPonto;

      // Geometria específica do holograma
      MosaicoRA._criarHologramaObjeto(obj.id, objGroup, obj.corAura);

      obj.mesh = objGroup;
      grupo.add(objGroup);
    });
  };

  MosaicoRA._criarTexturaGrade = function () {
    var c = document.createElement("canvas"); c.width = 512; c.height = 512;
    var ctx = c.getContext("2d");
    ctx.strokeStyle = "rgba(77, 252, 186, 0.9)"; ctx.lineWidth = 1;
    for (var k = 0; k <= 512; k += 32) {
      ctx.beginPath(); ctx.moveTo(k, 0); ctx.lineTo(k, 512); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, k); ctx.lineTo(512, k); ctx.stroke();
    }
    for (var r = 64; r <= 256; r += 64) {
      ctx.beginPath(); ctx.arc(256, 256, r, 0, Math.PI * 2); ctx.stroke();
    }
    return new THREE.CanvasTexture(c);
  };

  MosaicoRA._criarHologramaObjeto = function (id, grupo, cor) {
    var matBase = new THREE.MeshStandardMaterial({
      color: cor, emissive: new THREE.Color(cor), emissiveIntensity: 0.4,
      transparent: true, opacity: 0.9, metalness: 0.25, roughness: 0.45
    });
    var matGlow = new THREE.MeshBasicMaterial({ color: cor, transparent: true, opacity: 0.14, side: THREE.BackSide });

    function addGlow(geo) {
      var g = new THREE.Mesh(geo.clone(), matGlow.clone());
      g.scale.multiplyScalar(1.28); grupo.add(g);
    }

    if (id === "vela") {
      var corpo = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.035, 0.22, 16), matBase.clone());
      corpo.position.y = 0.11; grupo.add(corpo); addGlow(corpo.geometry);
      var pavioGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0.22, 0), new THREE.Vector3(0, 0.26, 0)]);
      grupo.add(new THREE.Line(pavioGeo, new THREE.LineBasicMaterial({ color: 0x333333 })));
      var chamaCore = new THREE.Mesh(new THREE.SphereGeometry(0.018, 8, 8), new THREE.MeshBasicMaterial({ color: 0xfff0a0 }));
      chamaCore.position.y = 0.28; chamaCore.scale.set(1, 1.7, 1); grupo.add(chamaCore);
      var chamaOuter = new THREE.Mesh(new THREE.SphereGeometry(0.028, 8, 8), new THREE.MeshBasicMaterial({ color: 0xff8800, transparent: true, opacity: 0.6 }));
      chamaOuter.position.y = 0.28; chamaOuter.scale.set(1, 1.5, 1); grupo.add(chamaOuter);
      grupo._chama = chamaCore; grupo._chamaOuter = chamaOuter;

    } else if (id === "envelope") {
      var baseEnv = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.20, 0.01), matBase.clone());
      grupo.add(baseEnv); addGlow(baseEnv.geometry);
      grupo.add(new THREE.LineSegments(new THREE.EdgesGeometry(baseEnv.geometry), new THREE.LineBasicMaterial({ color: 0x4dfcba })));
      var uvC = document.createElement("canvas"); uvC.width = 256; uvC.height = 192;
      var uvCtx = uvC.getContext("2d");
      uvCtx.fillStyle = "rgba(0,18,12,0.94)"; uvCtx.fillRect(0, 0, 256, 192);
      uvCtx.fillStyle = "#4dfcba"; uvCtx.font = "bold 13px monospace";
      uvCtx.fillText("Se o cofre já estiver", 14, 72);
      uvCtx.fillText("aberto, não entre.", 14, 94);
      uvCtx.fillStyle = "rgba(77,252,186,0.55)"; uvCtx.font = "11px monospace";
      uvCtx.fillText("— A.", 14, 120);
      var uvPlane = new THREE.Mesh(new THREE.PlaneGeometry(0.26, 0.18), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(uvC), transparent: true, opacity: 0.92 }));
      uvPlane.position.z = 0.007; grupo.add(uvPlane);

    } else if (id === "chave") {
      var matChv = new THREE.MeshStandardMaterial({ color: 0xb8860b, metalness: 0.93, roughness: 0.11, emissive: 0x3a2800, emissiveIntensity: 0.25 });
      var anel = new THREE.Mesh(new THREE.TorusGeometry(0.042, 0.009, 8, 24), matChv);
      anel.rotation.z = Math.PI / 5; grupo.add(anel); addGlow(new THREE.BoxGeometry(0.1, 0.1, 0.02));
      var hasteChv = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.17, 8), matChv);
      hasteChv.position.set(0.02, -0.12, 0); grupo.add(hasteChv);
      [0, 0.035, 0.07].forEach(function (off) {
        var dente = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.022 + off * 0.25, 0.007), matChv);
        dente.position.set(-0.009, -0.17 - off * 0.8, 0); grupo.add(dente);
      });

    } else if (id === "marca") {
      var mkC = document.createElement("canvas"); mkC.width = 512; mkC.height = 768;
      var mkCtx = mkC.getContext("2d");
      mkCtx.clearRect(0, 0, 512, 768);
      mkCtx.fillStyle = "rgba(200, 50, 50, 0.18)"; mkCtx.fillRect(110, 80, 300, 620);
      var desenhoPegada = function (px, py, ang, sc) {
        mkCtx.save(); mkCtx.translate(px, py); mkCtx.rotate(ang); mkCtx.scale(sc, sc);
        mkCtx.fillStyle = "rgba(255, 70, 70, 0.78)";
        mkCtx.beginPath(); mkCtx.ellipse(0, 0, 22, 38, 0, 0, Math.PI * 2); mkCtx.fill();
        mkCtx.restore();
      };
      desenhoPegada(165, 145, 0.3, 1); desenhoPegada(215, 235, -0.2, 1);
      desenhoPegada(160, 330, 0.25, 0.88); desenhoPegada(210, 420, -0.15, 0.88);
      desenhoPegada(162, 510, 0.2, 0.80); desenhoPegada(208, 600, -0.1, 0.80);
      mkCtx.strokeStyle = "rgba(255,120,120,0.9)"; mkCtx.lineWidth = 3;
      mkCtx.setLineDash([12, 8]);
      mkCtx.beginPath(); mkCtx.moveTo(256, 80); mkCtx.lineTo(256, 700); mkCtx.stroke();
      mkCtx.font = "bold 18px monospace"; mkCtx.fillStyle = "rgba(255,200,200,0.88)";
      mkCtx.fillText("RASTRO DE ARRASTAMENTO", 60, 745);
      var mkPlane = new THREE.Mesh(new THREE.PlaneGeometry(0.65, 0.9), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(mkC), transparent: true, opacity: 0.92, side: THREE.DoubleSide, depthWrite: false }));
      mkPlane.rotation.x = -Math.PI / 2; grupo.add(mkPlane);
      var borderRing = new THREE.Mesh(new THREE.RingGeometry(0.4, 0.46, 32), new THREE.MeshBasicMaterial({ color: 0xff3a3a, transparent: true, opacity: 0.5, side: THREE.DoubleSide }));
      borderRing.rotation.x = -Math.PI / 2; grupo.add(borderRing); grupo._borderRing = borderRing;

    } else if (id === "gravador") {
      var matGrav = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.65, metalness: 0.35 });
      var corpoG = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.10, 0.26), matGrav);
      grupo.add(corpoG); addGlow(corpoG.geometry);
      [[-0.04, 0], [0, 0], [0.04, 0]].forEach(function (bp) {
        var btn = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.01, 12), new THREE.MeshStandardMaterial({ color: 0x333333 }));
        btn.rotation.x = Math.PI / 2; btn.position.set(bp[0], 0, 0.133); grupo.add(btn);
      });
      var reelMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.7 });
      var reel1 = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.01, 20), reelMat);
      reel1.rotation.x = Math.PI / 2; reel1.position.set(-0.048, 0.02, 0.118); grupo.add(reel1);
      var reel2 = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.01, 20), reelMat);
      reel2.rotation.x = Math.PI / 2; reel2.position.set(0.048, 0.02, 0.118); grupo.add(reel2);
      grupo._reel1 = reel1; grupo._reel2 = reel2;
      var ledG = new THREE.Mesh(new THREE.SphereGeometry(0.008, 8, 8), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
      ledG.position.set(0.078, 0.033, 0.133); grupo.add(ledG); grupo._led = ledG;

    } else if (id === "espelho_ra") {
      var matShrd = new THREE.MeshStandardMaterial({ color: 0xc6e4ff, metalness: 0.96, roughness: 0.04, side: THREE.DoubleSide, emissive: 0x224466, emissiveIntensity: 0.28 });
      [
        { pos: [0, 0, 0], rot: [0, 0, 0], sc: [0.28, 0.38, 1] },
        { pos: [0.17, 0.12, 0.02], rot: [0.15, 0.2, 0.1], sc: [0.16, 0.22, 1] },
        { pos: [-0.14, -0.15, 0.016], rot: [-0.12, -0.16, 0.08], sc: [0.18, 0.2, 1] },
        { pos: [0.05, -0.2, 0.01], rot: [0.05, 0.1, -0.12], sc: [0.1, 0.14, 1] }
      ].forEach(function (sd) {
        var shard = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), matShrd.clone());
        shard.position.set(sd.pos[0], sd.pos[1], sd.pos[2]);
        shard.rotation.set(sd.rot[0], sd.rot[1], sd.rot[2]);
        shard.scale.set(sd.sc[0], sd.sc[1], sd.sc[2]);
        grupo.add(shard);
      });
      var espC = document.createElement("canvas"); espC.width = 256; espC.height = 256;
      var espCtx = espC.getContext("2d");
      espCtx.fillStyle = "rgba(190,210,230,0.75)"; espCtx.fillRect(0, 0, 256, 256);
      espCtx.save(); espCtx.translate(256, 0); espCtx.scale(-1, 1);
      espCtx.fillStyle = "rgba(20,40,80,0.88)"; espCtx.font = "bold 54px serif";
      espCtx.fillText("21:29", 28, 144); espCtx.restore();
      var espPlane = new THREE.Mesh(new THREE.PlaneGeometry(0.22, 0.22), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(espC), transparent: true, opacity: 0.72 }));
      espPlane.position.z = 0.001; grupo.add(espPlane);
      addGlow(new THREE.PlaneGeometry(0.28, 0.38));
    }

    // Indicador pulsante de "toque aqui"
    var indicadorMat = new THREE.MeshBasicMaterial({ color: cor, transparent: true, opacity: 0.65, side: THREE.DoubleSide });
    var indicador = new THREE.Mesh(new THREE.RingGeometry(0.055, 0.075, 32), indicadorMat);
    indicador.rotation.x = -Math.PI / 2;
    indicador.position.y = (id === "marca") ? -0.5 : -0.22;
    grupo.add(indicador); grupo._indicador = indicador;
  };

  /* ============================================================
     5. RADAR FORENSE — DETECÇÃO ANGULAR DE OBJETOS
     ============================================================ */
  MosaicoRA.radarDeteccao = function () {
    if (!MosaicoRA.raObjetosGroup || !MosaicoRA.camera) return;
    var fwd = new THREE.Vector3(0, 0, -1).applyQuaternion(MosaicoRA.camera.quaternion);
    var menorAng = Infinity;
    var objetoMaisProximo = null;

    MosaicoRA.raObjetos.forEach(function (obj) {
      if (obj.descoberta || !obj.mesh) return;
      var dir = obj.mesh.position.clone().sub(MosaicoRA.camera.position).normalize();
      var dot = Math.min(1, Math.max(-1, dir.dot(fwd)));
      var ang = Math.acos(dot) * (180 / Math.PI);
      if (ang < menorAng) { menorAng = ang; objetoMaisProximo = obj; }
      // Luz de aura proporcional à proximidade
      if (obj.luz) obj.luz.intensity = Math.max(0, 1 - ang / 40) * 1.6;
    });

    var CONE_DESCOBERTA = 15, CONE_ALERTA = 32;

    if (objetoMaisProximo && menorAng < CONE_ALERTA) {
      MosaicoRA.raProximoId = objetoMaisProximo.id;
      MosaicoRA.raProximidadeMs += 16;
      MosaicoRA._atualizarHudProximidade(objetoMaisProximo, menorAng);
      // Vibração de proximidade
      if (MosaicoRA.raProximidadeMs % 900 < 16 && navigator.vibrate) {
        navigator.vibrate(menorAng < CONE_DESCOBERTA ? [30, 20, 60] : [12]);
      }
      // Descoberta: 1.5s no cone central
      if (menorAng < CONE_DESCOBERTA && MosaicoRA.raProximidadeMs > 1500 && !objetoMaisProximo.descoberta) {
        MosaicoRA._descobrirObjetoRA(objetoMaisProximo);
      }
    } else {
      MosaicoRA.raProximoId = null;
      MosaicoRA.raProximidadeMs = 0;
      MosaicoRA._atualizarHudProximidade(null, 999);
    }
  };

  MosaicoRA._descobrirObjetoRA = function (obj) {
    obj.descoberta = true;
    if (navigator.vibrate) navigator.vibrate([60, 30, 120, 30, 200]);
    // Flash de descoberta na tela
    var flash = document.createElement("div");
    flash.className = "ra-discovery-flash";
    flash.innerHTML = '<span style="font-size:2.2rem;display:block;margin-bottom:8px">' + obj.icone + '</span>' +
      '<span style="letter-spacing:0.14em">' + obj.nome.toUpperCase() + '</span><br>' +
      '<span style="font-size:12px;opacity:0.7;margin-top:4px;display:block">EVIDÊNCIA ENCONTRADA</span>';
    if (MosaicoRA.container) MosaicoRA.container.appendChild(flash);
    setTimeout(function () { if (flash.parentNode) flash.remove(); }, 2200);
    // Abrir modal de investigação
    setTimeout(function () { MosaicoRA.abrirInvestigacao(obj); }, 700);
  };

  MosaicoRA._atualizarHudProximidade = function (obj, angulo) {
    var scanRing = document.getElementById("ra-scan-ring");
    var proximLabel = document.getElementById("ra-proximity-label");
    if (!scanRing) return;
    if (obj && angulo < 32) {
      var prox = Math.max(0, Math.min(1, (32 - angulo) / 32));
      scanRing.style.opacity = (0.25 + prox * 0.75).toFixed(2);
      scanRing.style.transform = "translate(-50%, -50%) scale(" + (1 + prox * 0.45) + ")";
      scanRing.style.borderColor = angulo < 15 ? "#4dfcba" : "rgba(247,201,74,0.85)";
      if (proximLabel) proximLabel.textContent = obj.icone + "  " + obj.nome;
    } else {
      scanRing.style.opacity = "0.18";
      scanRing.style.transform = "translate(-50%, -50%) scale(1)";
      scanRing.style.borderColor = "rgba(77,252,186,0.35)";
      if (proximLabel) proximLabel.textContent = "";
    }
  };

  /* ============================================================
     6. PARTÍCULAS FORENSES — NÉVOA E FAÍSCAS
     ============================================================ */
  MosaicoRA.particulasForenses = function () {
    if (MosaicoRA.raParticulasCanvas) {
      MosaicoRA.raParticulasCanvas.style.display = "block";
      return;
    }
    var cvs = document.createElement("canvas");
    cvs.id = "ra-particulas-canvas";
    cvs.style.cssText = "position:absolute;inset:0;width:100%;height:100%;z-index:3;pointer-events:none;";
    if (MosaicoRA.container) MosaicoRA.container.appendChild(cvs);
    MosaicoRA.raParticulasCanvas = cvs;
    cvs.width = window.innerWidth; cvs.height = window.innerHeight;
    var ctx = cvs.getContext("2d");

    MosaicoRA.raParticulas = [];
    for (var k = 0; k < 55; k++) {
      MosaicoRA.raParticulas.push({
        x: Math.random() * cvs.width, y: Math.random() * cvs.height,
        vx: (Math.random() - 0.5) * 0.45, vy: -(Math.random() * 0.75 + 0.2),
        r: Math.random() * 2.2 + 0.7, alpha: Math.random() * 0.55 + 0.2,
        cor: Math.random() < 0.65 ? "#4dfcba" : "#f7c94a",
        fase: Math.random() * Math.PI * 2
      });
    }

    (function loop() {
      if (!MosaicoRA.raParticulasCanvas) return;
      MosaicoRA.raParticulasAnimId = requestAnimationFrame(loop);
      ctx.clearRect(0, 0, cvs.width, cvs.height);
      var t = Date.now() * 0.001;
      MosaicoRA.raParticulas.forEach(function (p) {
        p.x += p.vx + Math.sin(t * 0.4 + p.fase) * 0.28;
        p.y += p.vy;
        p.alpha *= 0.9985;
        if (p.y < -12 || p.alpha < 0.025) {
          p.x = Math.random() * cvs.width;
          p.y = cvs.height + 12;
          p.alpha = Math.random() * 0.5 + 0.18;
        }
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.cor;
        ctx.shadowColor = p.cor;
        ctx.shadowBlur = 7;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      });
    })();
  };

  /* ============================================================
     7. MODAL DE INVESTIGAÇÃO — FULLSCREEN CINEMATIC
     ============================================================ */
  MosaicoRA.abrirInvestigacao = function (obj) {
    var modal = document.getElementById("ra-investigation-modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "ra-investigation-modal";
      modal.className = "ra-investigation-modal";
      document.body.appendChild(modal);
    }
    var jaColetada = MosaicoRA.raPistasColetadas[obj.id];
    modal.innerHTML =
      '<div class="ra-inv-wrapper">' +
        '<div class="ra-inv-header">' +
          '<div class="ra-inv-eyebrow">EVIDÊNCIA FORENSE · A CASA DA COSTA</div>' +
          '<button class="ra-inv-close" onclick="MosaicoRA.fecharInvestigacao()">✕ Fechar</button>' +
        '</div>' +
        '<div class="ra-inv-stage-wrap">' +
          '<canvas id="ra-inv-stage" class="ra-inv-stage"></canvas>' +
          '<div class="ra-inv-obj-icon">' + obj.icone + '</div>' +
        '</div>' +
        '<div class="ra-inv-body">' +
          '<h2 class="ra-inv-titulo">' + obj.nome + '</h2>' +
          '<div id="ra-typewriter" class="ra-typewriter"></div>' +
          '<div id="ra-evidence-card" class="ra-evidence-card" style="display:none;">' +
            '<div class="ra-evidence-label">⚠ PISTA FORENSE REVELADA</div>' +
            '<div class="ra-evidence-text" id="ra-evidence-text"></div>' +
          '</div>' +
          (jaColetada
            ? '<div class="ra-already-collected">✓ Evidência já registrada no seu dossiê</div>'
            : '<button id="ra-register-btn" class="ra-register-btn" style="display:none;" onclick="MosaicoRA.registrarPistaRA(\'' + obj.id + '\')">📌 Registrar como Evidência no Dossiê</button>'
          ) +
        '</div>' +
      '</div>';
    modal.style.display = "flex";

    // Stage 3D do objeto dentro do modal
    MosaicoRA._iniciarStageRA(obj, "ra-inv-stage");

    // Typewriter effect
    var twEl = document.getElementById("ra-typewriter");
    var texto = (obj.narrativaLinhas || ["Evidência encontrada."]).join("\n");
    MosaicoRA._typewriter(twEl, texto, 32, function () {
      setTimeout(function () {
        var evCard = document.getElementById("ra-evidence-card");
        var evText = document.getElementById("ra-evidence-text");
        var regBtn = document.getElementById("ra-register-btn");
        if (evCard) evCard.style.display = "block";
        if (evText) evText.textContent = obj.pista;
        if (regBtn && !MosaicoRA.raPistasColetadas[obj.id]) regBtn.style.display = "block";
      }, 350);
    });
  };

  MosaicoRA.fecharInvestigacao = function () {
    var modal = document.getElementById("ra-investigation-modal");
    if (modal) modal.style.display = "none";
    if (MosaicoRA.invAnimId) { cancelAnimationFrame(MosaicoRA.invAnimId); MosaicoRA.invAnimId = null; }
    if (MosaicoRA.invRenderer) { try { MosaicoRA.invRenderer.dispose(); } catch (e) {} MosaicoRA.invRenderer = null; }
  };

  MosaicoRA.registrarPistaRA = function (objId) {
    MosaicoRA.raPistasColetadas[objId] = true;
    var total = Object.keys(MosaicoRA.raPistasColetadas).length;
    var regBtn = document.getElementById("ra-register-btn");
    if (regBtn) { regBtn.disabled = true; regBtn.textContent = "✓ Registrado no Dossiê!"; regBtn.style.cssText += "background:#4dfcba;color:#04060a;"; }
    if (navigator.vibrate) navigator.vibrate([50, 30, 100, 30, 200]);
    MosaicoRA._atualizarContador();
    if (total >= 6) {
      setTimeout(function () { MosaicoRA.fecharInvestigacao(); MosaicoRA._celebracaoFinal(); }, 900);
    }
  };

  MosaicoRA._atualizarContador = function () {
    var total = Object.keys(MosaicoRA.raPistasColetadas).length;
    var contEl = document.getElementById("ra-clue-counter");
    if (contEl) { contEl.textContent = total + "/6"; contEl.style.color = total >= 6 ? "#4dfcba" : "#f7c94a"; }
  };

  MosaicoRA._celebracaoFinal = function () {
    var cel = document.createElement("div");
    cel.className = "ra-celebracao";
    cel.innerHTML = '<div class="ra-cel-conteudo">' +
      '<div style="font-size:3.5rem;margin-bottom:14px">🔍</div>' +
      '<h2>INVESTIGAÇÃO CONCLUÍDA!</h2>' +
      '<p>Você coletou todas as 6 evidências forenses da Cena da Costa.</p>' +
      '<p style="color:#f7c94a;font-size:13px;margin-top:10px">As pistas estão registradas no seu dossiê.</p>' +
      '<button onclick="this.closest(\'.ra-celebracao\').remove()" style="margin-top:20px;padding:14px 28px;background:#4dfcba;color:#04060a;border:none;border-radius:10px;font-weight:700;font-size:15px;cursor:pointer;letter-spacing:0.06em">Continuar Investigação</button>' +
    '</div>';
    if (MosaicoRA.container) MosaicoRA.container.appendChild(cel);
    if (navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 300, 100, 500]);
  };

  MosaicoRA._typewriter = function (el, text, speed, callback) {
    if (!el) { if (callback) callback(); return; }
    var i = 0; el.textContent = ""; el.style.borderRight = "2px solid #4dfcba";
    (function next() {
      if (!MosaicoRA.ativo) return;
      if (i < text.length) { el.textContent += text[i++]; setTimeout(next, speed); }
      else { el.style.borderRight = "none"; if (callback) callback(); }
    })();
  };

  MosaicoRA._iniciarStageRA = function (obj, stageId) {
    var stage = document.getElementById(stageId);
    if (!stage) return;
    var w = stage.offsetWidth || 320, h = stage.offsetHeight || 210;
    stage.width = w; stage.height = h;
    if (MosaicoRA.invRenderer) { try { MosaicoRA.invRenderer.dispose(); } catch (e) {} }
    var ren = new THREE.WebGLRenderer({ canvas: stage, antialias: true, alpha: false });
    ren.setSize(w, h);
    MosaicoRA.invRenderer = ren;
    var scn = new THREE.Scene(); scn.background = new THREE.Color(0x050c15);
    var cam = new THREE.PerspectiveCamera(50, w / h, 0.1, 10);
    cam.position.set(0, 0, 1.5);
    scn.add(new THREE.PointLight(0xfff0d0, 2.5, 8)); scn.add(new THREE.AmbientLight(0x223344, 0.9));
    var rimLight = new THREE.PointLight(obj.corGlow || 0x4dfcba, 1.4, 5);
    rimLight.position.set(-1.2, 0.8, -0.5); scn.add(rimLight);
    var gridH = new THREE.GridHelper(3, 16, obj.corAura || 0x4dfcba, 0x112233);
    gridH.position.y = -0.42; scn.add(gridH);
    var previewGroup = new THREE.Group();
    MosaicoRA._criarHologramaObjeto(obj.id, previewGroup, obj.corAura || 0x4dfcba);
    scn.add(previewGroup);
    var dragging = false, prevX = 0, prevY = 0;
    stage.addEventListener("mousedown", function (e) { dragging = true; prevX = e.clientX; prevY = e.clientY; });
    stage.addEventListener("touchstart", function (e) { dragging = true; prevX = e.touches[0].clientX; prevY = e.touches[0].clientY; }, { passive: true });
    var onMove = function (cx, cy) {
      if (!dragging) return;
      previewGroup.rotation.y += (cx - prevX) * 0.018;
      previewGroup.rotation.x += (cy - prevY) * 0.012;
      prevX = cx; prevY = cy;
    };
    window.addEventListener("mousemove", function (e) { onMove(e.clientX, e.clientY); });
    window.addEventListener("touchmove", function (e) { onMove(e.touches[0].clientX, e.touches[0].clientY); }, { passive: true });
    window.addEventListener("mouseup", function () { dragging = false; });
    window.addEventListener("touchend", function () { dragging = false; });
    (function loopInv() {
      if (!MosaicoRA.invRenderer) return;
      MosaicoRA.invAnimId = requestAnimationFrame(loopInv);
      if (!dragging) previewGroup.rotation.y += 0.008;
      ren.render(scn, cam);
    })();
  };

  /* ============================================================
     8. CÂMERA REAL — ATIVAÇÃO E DESATIVAÇÃO
     ============================================================ */
  MosaicoRA.ativarCameraRA = function () {
    MosaicoRA.modo = "camera-ra";
    if (MosaicoRA.salaGroup) MosaicoRA.salaGroup.visible = false;
    if (MosaicoRA.anamorfoseGroup) MosaicoRA.anamorfoseGroup.visible = false;
    if (MosaicoRA.pistasUVGroup) MosaicoRA.pistasUVGroup.visible = false;
    if (MosaicoRA.scene) MosaicoRA.scene.background = null;
    if (MosaicoRA.renderer) MosaicoRA.renderer.setClearColor(0x000000, 0);
    var overlay = document.getElementById("ra-hud-overlay");
    if (overlay) overlay.style.display = "block";
    MosaicoRA.atualizarBotoesModo();

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      // BUG1-FIX: podetentar=false + fallback para sala3d como opção
      MosaicoRA.mostrarPromptCamera(false, "Câmera não disponível neste navegador. Use Chrome/Safari em HTTPS.");
      return;
    }
    // Mostrar indicador de carregamento no scan ring
    var dicaEl = document.getElementById("mosaico-ra-dica-texto");
    if (dicaEl) dicaEl.textContent = "🔄 Iniciando câmera de investigação...";

    navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } }
    }).then(function (stream) {
        var vid = document.getElementById("mosaico-ra-video-bg") || MosaicoRA.videoElement;
        if (vid) {
          vid.srcObject = stream;
          vid.style.display = "block";
          var p = vid.play();
          if (p && p.catch) p.catch(function (e) { console.warn("video.play:", e); });
        }
        MosaicoRA.removerPromptCamera();
        MosaicoRA.construirMundoRA();
        MosaicoRA.criarPistasUV();
        MosaicoRA.particulasForenses();
        MosaicoRA.atualizarBotoesModo();
        // Solicitar permissão de giroscópio iOS 13+ (encadeado após câmera, já é gesto do usuário)
        if (typeof DeviceOrientationEvent !== "undefined" &&
            typeof DeviceOrientationEvent.requestPermission === "function") {
          DeviceOrientationEvent.requestPermission().then(function (state) {
            if (state === "granted") {
              window.addEventListener("deviceorientation", function (ev) {
                if (ev.alpha != null && ev.beta != null) {
                  MosaicoRA.orientacao.targetYaw = (-ev.alpha * Math.PI) / 180;
                  MosaicoRA.orientacao.targetPitch = Math.max(-1.1, Math.min(1.1, ((ev.beta - 90) * Math.PI) / 180));
                }
              });
            }
          }).catch(function (ex) { console.warn("DeviceOrientationEvent:", ex); });
        }
        if (typeof Mosaico3D !== "undefined") Mosaico3D.som.encaixe();
      })
      .catch(function (err) {
        console.warn("Câmera RA:", err);
        // BUG1-FIX: prompt com botão de retry claramente visível
        MosaicoRA.mostrarPromptCamera(true, "Permissão de câmera negada ou indisponível. Toque para tentar novamente.");
      });
  };

  MosaicoRA.desativarCameraRA = function () {
    MosaicoRA.removerPromptCamera();
    if (MosaicoRA.videoElement) {
      MosaicoRA.videoElement.style.display = "none";
      if (MosaicoRA.videoElement.srcObject) {
        try { MosaicoRA.videoElement.srcObject.getTracks().forEach(function (t) { t.stop(); }); } catch (e) {}
        MosaicoRA.videoElement.srcObject = null;
      }
    }
    if (MosaicoRA.raObjetosGroup) MosaicoRA.raObjetosGroup.visible = false;
    if (MosaicoRA.raParticulasCanvas) MosaicoRA.raParticulasCanvas.style.display = "none";
    if (MosaicoRA.salaGroup) MosaicoRA.salaGroup.visible = true;
    if (MosaicoRA.scene) { MosaicoRA.scene.background = new THREE.Color(0x04060a); MosaicoRA.renderer.setClearColor(0x04060a, 1); }
    if (MosaicoRA.pistasUVGroup) MosaicoRA.pistasUVGroup.visible = false;
    var raOverlay = document.getElementById("ra-hud-overlay");
    if (raOverlay) raOverlay.style.display = "none";
  };

  MosaicoRA.mostrarPromptCamera = function (podetentar, msg) {
    var p = document.getElementById("mosaico-ra-prompt");
    if (!p) {
      p = document.createElement("div"); p.id = "mosaico-ra-prompt"; p.className = "mosaico-ra-prompt";
      if (MosaicoRA.container) MosaicoRA.container.appendChild(p);
      else document.body.appendChild(p);
    }
    p.style.display = "flex";
    // BUG1-FIX: canvas deixa de interceptar eventos enquanto prompt estiver visível
    if (MosaicoRA.renderer && MosaicoRA.renderer.domElement) {
      MosaicoRA.renderer.domElement.style.pointerEvents = "none";
    }
    p.innerHTML = '<div class="mosaico-ra-prompt-card">' +
      '<div style="font-size:52px;margin-bottom:12px">🔍</div>' +
      '<h3 style="font-family:Cinzel,serif;color:#4dfcba;margin:0 0 10px;font-size:1.25rem;letter-spacing:0.06em">MODO INVESTIGAÇÃO RA</h3>' +
      '<p style="color:#94a3b8;font-size:13px;line-height:1.65;margin:0 0 18px">' + (msg || 'Ative a câmera para explorar o ambiente e encontrar as 6 evidências do crime.') + '</p>' +
      (podetentar ? '<button onclick="MosaicoRA.ativarCameraRA()" style="width:100%;margin-bottom:10px;padding:16px;background:linear-gradient(135deg,#4dfcba,#00c48a);color:#04060a;font-weight:700;border:none;border-radius:12px;font-size:16px;cursor:pointer;letter-spacing:0.05em;box-shadow:0 6px 20px rgba(77,252,186,0.35)">📷 Ativar Câmera de Investigação</button>' : '') +
      '<button onclick="MosaicoRA.trocarModo(\'sala3d\')" style="width:100%;padding:12px;background:rgba(255,255,255,0.07);color:#f3d078;border:1px solid rgba(243,208,120,0.28);border-radius:10px;font-size:14px;cursor:pointer">🕯️ Usar Sala 3D Virtual</button>' +
    '</div>';
  };

  MosaicoRA.removerPromptCamera = function () {
    var p = document.getElementById("mosaico-ra-prompt");
    if (p) p.style.display = "none";
    // BUG1-FIX: restaurar pointer-events do canvas
    if (MosaicoRA.renderer && MosaicoRA.renderer.domElement) {
      MosaicoRA.renderer.domElement.style.pointerEvents = "auto";
    }
  };

  /* ============================================================
     9. PISTAS UV — PRESERVADAS (TESTES)
     ============================================================ */
  MosaicoRA.criarPistasUV = function () {
    if (MosaicoRA.pistasUVGroup) { MosaicoRA.pistasUVGroup.visible = true; return; }
    var uvGroup = new THREE.Group();
    var pegadaMat = new THREE.MeshBasicMaterial({ color: 0x4dfcba, transparent: true, opacity: 0.62, side: THREE.DoubleSide });
    [[-0.35, -1.1], [0.25, -1.7], [-0.3, -2.3], [0.3, -2.9]].forEach(function (pos, i) {
      var footprint = new THREE.Mesh(new THREE.PlaneGeometry(0.16, 0.30), pegadaMat);
      footprint.rotation.x = -Math.PI / 2;
      footprint.rotation.z = i % 2 === 0 ? 0.2 : -0.2;
      footprint.position.set(pos[0], 0.02, pos[1]);
      uvGroup.add(footprint);
    });
    var env = new THREE.Mesh(new THREE.BoxGeometry(0.33, 0.22, 0.02), new THREE.MeshStandardMaterial({ color: 0xfdfaf2, roughness: 0.4 }));
    env.position.set(0.55, 1.35, -1.9); env.rotation.y = -0.4; uvGroup.add(env);
    var selo = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.038, 0.01, 16), new THREE.MeshStandardMaterial({ color: 0xd92626, roughness: 0.3 }));
    selo.rotation.x = Math.PI / 2; selo.position.set(0.55, 1.35, -1.87); uvGroup.add(selo);
    MosaicoRA.scene.add(uvGroup);
    MosaicoRA.pistasUVGroup = uvGroup;
  };

  /* ============================================================
     10. INSPEÇÃO TÁTIL 360° (SALA 3D)
     ============================================================ */
  MosaicoRA.examinarObjeto = function (id) {
    var obj = MosaicoRA.objetos3D[id];
    if (!obj) return;
    if (id === "quadro") {
      obj.rotation.y = obj.aberto ? 0 : Math.PI / 2.8;
      obj.aberto = !obj.aberto;
      if (typeof Mosaico3D !== "undefined") Mosaico3D.som.encaixe();
      return;
    }
    if (id === "gaveta") {
      var closedZ = obj.userData.closedZ == null ? .286 : obj.userData.closedZ;
      obj.position.z = obj.aberto ? closedZ : closedZ + .20;
      obj.aberto = !obj.aberto;
      if (typeof Mosaico3D !== "undefined") Mosaico3D.som.encaixe();
      return;
    }
    var modal = document.getElementById("mosaico-ra-inspect-modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "mosaico-ra-inspect-modal";
      modal.className = "mosaico-ra-modal";
      document.body.appendChild(modal);
    }
    var nomes = {
      relogio: "O Relógio de Parede (Parado às 21h29)", cofre: "O Cofre Embutido (Disco de Latão)",
      escrivaninha: "A Escrivaninha (Gaveta com Gravador)", vaso: "O Vaso de Plantas (Cerâmica Trincada)",
      espelho: "O Espelho Oval (Moldura Dourada)", janela: "A Janela do Mar (Tempestade Lá Fora)",
      luminaria: "O Abajur de Pé (Latão e Linho)"
    };
    modal.innerHTML =
      '<div class="mosaico-ra-modal-card m3d-tilt-box">' +
        '<div class="mosaico-ra-modal-header">' +
          '<h3>' + (nomes[id] || "Objeto da Casa da Costa") + '</h3>' +
          '<button class="mosaico-ra-modal-close" onclick="MosaicoRA.fecharInspecao()">✕</button>' +
        '</div>' +
        '<p class="lead" style="font-size:13px;color:#8fa3b8;margin:6px 0 14px">Arraste para girar em 360° e examinar detalhes forenses.</p>' +
        '<div id="mosaico-ra-inspect-stage" style="width:100%;height:260px;background:#030508;border-radius:12px;overflow:hidden"></div>' +
        '<button class="btn btn-ambar" style="width:100%;margin-top:14px" onclick="MosaicoRA.fecharInspecao()">Retornar à Investigação</button>' +
      '</div>';
    modal.style.display = "flex";
    MosaicoRA.iniciarStageInspecao(id, "mosaico-ra-inspect-stage");
  };

  MosaicoRA.fecharInspecao = function () {
    var modal = document.getElementById("mosaico-ra-inspect-modal");
    if (modal) modal.style.display = "none";
    if (MosaicoRA.inspectAnimId) { cancelAnimationFrame(MosaicoRA.inspectAnimId); MosaicoRA.inspectAnimId = null; }
    if(MosaicoRA.inspectCleanup){MosaicoRA.inspectCleanup();MosaicoRA.inspectCleanup=null;}
  };

  MosaicoRA.iniciarStageInspecao = function (id, stageId) {
    var stage = document.getElementById(stageId);
    if (!stage) return;
    var w = stage.clientWidth || 300, h = stage.clientHeight || 260;
    var ren = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    ren.setSize(w, h); stage.innerHTML = ""; stage.appendChild(ren.domElement);
    var scn = new THREE.Scene(); scn.background = new THREE.Color(0x080e16);
    var cam = new THREE.PerspectiveCamera(45, w / h, 0.1, 10);
    cam.position.set(0, 0, 2.2);
    ren.outputEncoding=THREE.sRGBEncoding;ren.toneMapping=THREE.ACESFilmicToneMapping;ren.toneMappingExposure=.82;
    const key=new THREE.DirectionalLight(0xfff0d0,2);key.position.set(2,3,4);scn.add(key);scn.add(new THREE.HemisphereLight(0xe6e7de,0x514133,.9));
    const source=MosaicoRA.objetos3D[id];
    var previewMesh=new THREE.Group();scn.add(previewMesh);
    if(source){
      const copy=source.clone(true);copy.position.set(0,0,0);copy.quaternion.identity();
      // Inspection must not reveal the recording hidden in the closed drawer.
      if(id==='escrivaninha')copy.traverse(o=>{if(o.geometry===MosaicoRA.objetos3D.secretaria?.geometry)o.visible=false;});
      copy.updateMatrixWorld(true);const box=new THREE.Box3().setFromObject(copy),size=box.getSize(new THREE.Vector3()),center=box.getCenter(new THREE.Vector3());
      copy.position.sub(center);previewMesh.add(copy);
      const distance=Math.max(size.y,size.x/cam.aspect,size.z)*.7/Math.tan(THREE.MathUtils.degToRad(cam.fov/2));cam.position.set(0,distance*.18,distance);cam.lookAt(0,0,0);
    }
    var dragging = false, prevX = 0, prevY = 0;
    stage.style.touchAction='none';
    stage.onpointerdown = function (e) {
      dragging = true;stage.setPointerCapture(e.pointerId); prevX = e.clientX; prevY = e.clientY;
    };
    stage.onpointermove = function (e) {
      if (!dragging) return; var pt = e;
      previewMesh.rotation.y += (pt.clientX - prevX) * 0.015;
      previewMesh.rotation.x += (pt.clientY - prevY) * 0.015;
      prevX = pt.clientX; prevY = pt.clientY;
    };
    stage.onpointerup = stage.onpointercancel = function () { dragging = false; };
    MosaicoRA.inspectCleanup=function(){stage.onpointerdown=stage.onpointermove=stage.onpointerup=stage.onpointercancel=null;ren.dispose();stage.innerHTML='';};
    (function loopInspect() {
      MosaicoRA.inspectAnimId = requestAnimationFrame(loopInspect);
      ren.render(scn, cam);
    })();
  };

  /* ============================================================
     11. CONTROLES DE ORIENTAÇÃO
     ============================================================ */
  MosaicoRA.ligarControles = function () {
    // Giroscópio (desktop / Android — iOS pede permissão ao abrir câmera)
    if (window.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission !== "function") {
      window.addEventListener("deviceorientation", function (e) {
        if (e.alpha != null && e.beta != null && e.gamma != null) {
          MosaicoRA.orientacao.targetYaw = (-e.alpha * Math.PI) / 180;
          MosaicoRA.orientacao.targetPitch = Math.max(-1.1, Math.min(1.1, ((e.beta - 90) * Math.PI) / 180));
        }
      });
    }
    // Arraste por toque / mouse
    var arrastando = false, ultX = 0, ultY = 0, inicioX=0, inicioY=0, gestoMoveu=false;
    var dom = MosaicoRA.renderer.domElement;
    dom.addEventListener("mousedown", function (e) { arrastando = true; inicioX=ultX=e.clientX;inicioY=ultY=e.clientY;gestoMoveu=false; });
    dom.addEventListener("touchstart", function (e) {
      arrastando = true; inicioX=ultX=e.touches[0].clientX;inicioY=ultY=e.touches[0].clientY;gestoMoveu=false;
    }, { passive: true });
    window.addEventListener("mousemove", function (e) {
      if (!arrastando) return;
      if(Math.hypot(e.clientX-inicioX,e.clientY-inicioY)>6)gestoMoveu=true;
      MosaicoRA.orientacao.targetYaw -= (e.clientX - ultX) * 0.004;
      MosaicoRA.orientacao.targetPitch = Math.max(-1.1, Math.min(1.1, MosaicoRA.orientacao.targetPitch - (e.clientY - ultY) * 0.004));
      ultX = e.clientX; ultY = e.clientY;
    });
    window.addEventListener("touchmove", function (e) {
      if (!arrastando) return;
      if(Math.hypot(e.touches[0].clientX-inicioX,e.touches[0].clientY-inicioY)>6)gestoMoveu=true;
      MosaicoRA.orientacao.targetYaw -= (e.touches[0].clientX - ultX) * 0.004;
      MosaicoRA.orientacao.targetPitch = Math.max(-1.1, Math.min(1.1, MosaicoRA.orientacao.targetPitch - (e.touches[0].clientY - ultY) * 0.004));
      ultX = e.touches[0].clientX; ultY = e.touches[0].clientY;
    }, { passive: true });
    window.addEventListener("mouseup", function () { arrastando = false; });
    window.addEventListener("touchend", function () { arrastando = false; });
    window.addEventListener("touchcancel", function () { arrastando=false;gestoMoveu=true; });

    // BUG3-FIX: Raycaster com traverse recursivo para objetos aninhados
    dom.addEventListener("click", function (e) {
      if(gestoMoveu){gestoMoveu=false;return;}
      // Ignorar cliques se um modal estiver aberto
      if (document.getElementById("mosaico-ra-inspect-modal") &&
          document.getElementById("mosaico-ra-inspect-modal").style.display !== "none") return;
      if (document.getElementById("ra-investigation-modal") &&
          document.getElementById("ra-investigation-modal").style.display !== "none") return;
      var rect = dom.getBoundingClientRect();
      var mouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );
      var raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, MosaicoRA.camera);
      var inter = raycaster.intersectObjects(MosaicoRA.scene.children, true);
      if (!inter.length) return;
      var topMesh = inter[0].object;
      // BUG3-FIX: traverse recursivo para encontrar o grupo pai correto
      Object.keys(MosaicoRA.objetos3D).forEach(function (chave) {
        var grp = MosaicoRA.objetos3D[chave];
        var found = (grp === topMesh);
        if (!found && grp.traverse) {
          grp.traverse(function (child) { if (child === topMesh) found = true; });
        }
        if (found) MosaicoRA.examinarObjeto(chave);
      });
      // Objetos holográficos RA
      if (MosaicoRA.modo === "camera-ra") {
        MosaicoRA.raObjetos.forEach(function (obj) {
          if (!obj.mesh) return;
          var found = false;
          obj.mesh.traverse(function (child) { if (child === topMesh) found = true; });
          if (found) MosaicoRA.abrirInvestigacao(obj);
        });
      }
    });
  };

  /* ============================================================
     12. HUD E SELETOR DE MODALIDADE
     ============================================================ */
  MosaicoRA.montarHUD = function () {
    var hud = document.createElement("div");
    hud.id = "mosaico-ra-hud"; hud.className = "mosaico-ra-hud";
    hud.innerHTML =
      '<div class="mosaico-ra-topbar">' +
        '<div class="mosaico-ra-tabs">' +
          '<button class="mosaico-ra-tab ' + (MosaicoRA.modo === "sala3d" ? "active" : "") + '" onclick="MosaicoRA.trocarModo(\'sala3d\')">🕯️ Sala 3D</button>' +
          '<button class="mosaico-ra-tab ' + (MosaicoRA.modo === "camera-ra" ? "active" : "") + '" onclick="MosaicoRA.trocarModo(\'camera-ra\')">🔍 Investigar</button>' +
          '<button class="mosaico-ra-tab ' + (MosaicoRA.modo === "anamorfose" ? "active" : "") + '" onclick="MosaicoRA.trocarModo(\'anamorfose\')">✨ Anamorfose</button>' +
        '</div>' +
        '<button class="mosaico-ra-btn-fechar" onclick="MosaicoRA.encerrar()">✕ Sair</button>' +
      '</div>' +
      '<div id="ra-hud-overlay" class="ra-hud-overlay" style="display:none">' +
        '<div id="ra-clue-counter" class="ra-clue-counter">0/6</div>' +
        '<div id="ra-scan-ring" class="ra-scan-ring"></div>' +
        '<div id="ra-proximity-label" class="ra-proximity-label"></div>' +
        '<div class="ra-instruction">🔍 Gire lentamente — 6 evidências ocultas no ambiente</div>' +
      '</div>' +
      '<div class="mosaico-ra-footer">' +
        '<div id="mosaico-ra-dica-texto" class="mosaico-ra-dica">Mova o celular para iluminar a sala. Toque nos objetos para inspecionar em 360°.</div>' +
        '<div id="mosaico-ra-anamorfose-bar" class="mosaico-ra-prog-bar" style="display:none">' +
          '<div id="mosaico-ra-anamorfose-fill" class="mosaico-ra-prog-fill"></div>' +
        '</div>' +
      '</div>';
    MosaicoRA.container.appendChild(hud);
  };

  MosaicoRA.trocarModo = function (novoModo) {
    if (novoModo === MosaicoRA.modo) return;
    if (MosaicoRA.modo === "camera-ra" && novoModo !== "camera-ra") MosaicoRA.desativarCameraRA();
    MosaicoRA.modo = novoModo;
    var overlay = document.getElementById("ra-hud-overlay");
    if (novoModo === "camera-ra") {
      if (overlay) overlay.style.display = "block";
      // BUG1-FIX: ativarCameraRA já lida corretamente com a sequência
      MosaicoRA.ativarCameraRA();
    } else if (novoModo === "anamorfose") {
      if (overlay) overlay.style.display = "none";
      if (MosaicoRA.videoElement) MosaicoRA.videoElement.style.display = "none";
      if (MosaicoRA.salaGroup) MosaicoRA.salaGroup.visible = false;
      if (MosaicoRA.raObjetosGroup) MosaicoRA.raObjetosGroup.visible = false;
      if (MosaicoRA.raParticulasCanvas) MosaicoRA.raParticulasCanvas.style.display = "none";
      if (MosaicoRA.scene) MosaicoRA.scene.background = new THREE.Color(0x020408);
      if (MosaicoRA.renderer) MosaicoRA.renderer.setClearColor(0x020408, 1);
      // BUG2-FIX: só torna visível aqui
      if (MosaicoRA.anamorfoseGroup) MosaicoRA.anamorfoseGroup.visible = true;
      if (MosaicoRA.pistasUVGroup) MosaicoRA.pistasUVGroup.visible = false;
    } else {
      // sala3d
      if (overlay) overlay.style.display = "none";
      if (MosaicoRA.videoElement) MosaicoRA.videoElement.style.display = "none";
      if (MosaicoRA.salaGroup) MosaicoRA.salaGroup.visible = true;
      if (MosaicoRA.raObjetosGroup) MosaicoRA.raObjetosGroup.visible = false;
      if (MosaicoRA.raParticulasCanvas) MosaicoRA.raParticulasCanvas.style.display = "none";
      if (MosaicoRA.scene) MosaicoRA.scene.background = new THREE.Color(0x04060a);
      if (MosaicoRA.renderer) MosaicoRA.renderer.setClearColor(0x04060a, 1);
      // BUG2-FIX: garantir que anamorfose fique oculta na sala
      if (MosaicoRA.anamorfoseGroup) MosaicoRA.anamorfoseGroup.visible = false;
      if (MosaicoRA.pistasUVGroup) MosaicoRA.pistasUVGroup.visible = false;
    }
    MosaicoRA.atualizarBotoesModo();
  };

  MosaicoRA.atualizarBotoesModo = function () {
    document.querySelectorAll(".mosaico-ra-tab").forEach(function (tab) {
      var oc = tab.getAttribute("onclick") || "";
      var isActive = oc.indexOf("'" + MosaicoRA.modo + "'") !== -1;
      tab.classList.toggle("active", isActive);
    });
    var dica = document.getElementById("mosaico-ra-dica-texto");
    var bar = document.getElementById("mosaico-ra-anamorfose-bar");
    if (dica) {
      if (MosaicoRA.modo === "sala3d") {
        dica.textContent = "Mova o celular para iluminar com a lanterna. Toque nos objetos para inspecionar.";
      } else if (MosaicoRA.modo === "camera-ra") {
        dica.textContent = "🔍 Gire lentamente — 6 evidências do crime estão ocultas no ambiente.";
      } else {
        // BUG4-FIX: mostrar direção para o ângulo alvo
        var yawAtual = ((-MosaicoRA.orientacao.yaw * 180) / Math.PI + 360) % 360;
        var diffAlvo = MosaicoRA.anamorfoseAlvo.yaw - yawAtual;
        if (diffAlvo > 180) diffAlvo -= 360;
        if (diffAlvo < -180) diffAlvo += 360;
        var seta = Math.abs(diffAlvo) < 5 ? "✓ Ângulo encontrado!" :
                   diffAlvo > 0 ? "→ Gire para a direita " + Math.round(Math.abs(diffAlvo)) + "°" :
                                  "← Gire para a esquerda " + Math.round(Math.abs(diffAlvo)) + "°";
        dica.textContent = "✨ " + seta + " — os traços vão revelar a hora.";
      }
    }
    if (bar) bar.style.display = MosaicoRA.modo === "anamorfose" ? "block" : "none";
  };

  /* ============================================================
     13. ENCERRAR
     ============================================================ */
  MosaicoRA.encerrar = function () {
    if(MosaicoRA.xrSession){MosaicoRA.xrSession.end();return;}
    document.body.classList.remove('ac-sala-visual');
    if(MosaicoRA.renderer)MosaicoRA.renderer.setAnimationLoop(null);
    MosaicoRA.ativo = false;
    if (MosaicoRA.animId) cancelAnimationFrame(MosaicoRA.animId);
    if (MosaicoRA.raParticulasAnimId) cancelAnimationFrame(MosaicoRA.raParticulasAnimId);
    MosaicoRA.desativarCameraRA();
    MosaicoRA.fecharInvestigacao();
    if (MosaicoRA.container) {
      MosaicoRA.container.innerHTML = "";
      if (MosaicoRA.container.id === "mosaico-ra-viewport" && MosaicoRA.container.parentNode) {
        MosaicoRA.container.parentNode.removeChild(MosaicoRA.container);
      }
    }
    if (typeof STATE !== "undefined" && (STATE.tela === "sala3d" || STATE.tela === "ra")) {
      STATE.tela = "mosaico";
      if (STATE.doc) STATE.doc.fase = "mosaico";
    }
    if (typeof render === "function") render(true);
  };

  /* ============================================================
     14. LOOP DE RENDERIZAÇÃO
     ============================================================ */
  MosaicoRA.animar = function (time,frame) {
    if (!MosaicoRA.ativo) return;
    if(MosaicoRA.xrSession&&MosaicoRA.xrUpdate)MosaicoRA.xrUpdate(time,frame);
    var t = Date.now() * 0.001;

    // Interpolação suave de orientação
    MosaicoRA.orientacao.yaw += (MosaicoRA.orientacao.targetYaw - MosaicoRA.orientacao.yaw) * 0.12;
    MosaicoRA.orientacao.pitch += (MosaicoRA.orientacao.targetPitch - MosaicoRA.orientacao.pitch) * 0.12;
    if(!MosaicoRA.xrSession)MosaicoRA.camera.rotation.set(MosaicoRA.orientacao.pitch, MosaicoRA.orientacao.yaw, 0, "YXZ");

    // Pêndulo
    if (MosaicoRA.objetos3D["pendulo"]) {
      MosaicoRA.objetos3D["pendulo"].rotation.z = .16;
    }

    // RA INVESTIGAÇÃO — animações dos 6 hologramas
    if (MosaicoRA.modo === "camera-ra" && MosaicoRA.raObjetosGroup && MosaicoRA.raObjetosGroup.visible) {
      MosaicoRA.raObjetos.forEach(function (obj) {
        if (!obj.mesh) return;
        var ph = obj.mesh._phase || 0;
        // Levitação sinusoidal
        obj.mesh.position.y = obj.baseY + Math.sin(t * 0.85 + ph) * 0.08;
        // Rotação contínua
        obj.mesh.rotation.y += obj.mesh._rotSpeed || 0.008;
        // Pulsação de escala após descoberta
        if (obj.descoberta) obj.mesh.scale.setScalar(1 + Math.sin(t * 4.5) * 0.06);
        // Aura de luz
        if (obj.luz) obj.luz.intensity = (0.35 + Math.sin(t * 2.2 + ph) * 0.28) * (obj.descoberta ? 2.2 : 1);
        // Animações específicas
        if (obj.id === "vela" && obj.mesh._chama) {
          obj.mesh._chama.scale.set(1 + Math.sin(t * 9.3) * 0.18, 1.7 + Math.sin(t * 12.5) * 0.25, 1 + Math.sin(t * 8.7) * 0.14);
          if (obj.mesh._chamaOuter) obj.mesh._chamaOuter.scale.set(1 + Math.sin(t * 7.1) * 0.12, 1.5 + Math.sin(t * 10.8) * 0.2, 1 + Math.sin(t * 8.2) * 0.1);
        }
        if (obj.id === "gravador") {
          if (obj.mesh._reel1) obj.mesh._reel1.rotation.z += 0.05;
          if (obj.mesh._reel2) obj.mesh._reel2.rotation.z -= 0.05;
          if (obj.mesh._led) obj.mesh._led.material.color.setHex(Math.sin(t * 4.5) > 0 ? 0xff0000 : 0x3a0000);
        }
        if (obj.id === "marca" && obj.mesh._borderRing) {
          obj.mesh._borderRing.material.opacity = 0.28 + Math.sin(t * 2.8 + ph) * 0.28;
          obj.mesh._borderRing.scale.setScalar(1 + Math.sin(t * 1.4) * 0.14);
        }
        // Indicador pulsante
        if (obj.mesh._indicador && !obj.descoberta) {
          obj.mesh._indicador.material.opacity = 0.45 + Math.sin(t * 3.2 + ph) * 0.35;
          obj.mesh._indicador.scale.setScalar(1 + Math.sin(t * 2.2 + ph) * 0.25);
        }
      });
      MosaicoRA.radarDeteccao();
    }

    // Anamorfose — verificação de alinhamento
    if (MosaicoRA.modo === "anamorfose" && MosaicoRA.anamorfoseGroup) {
      var yawGraus = ((-MosaicoRA.orientacao.yaw * 180) / Math.PI + 360) % 360;
      var pitchGraus = (MosaicoRA.orientacao.pitch * 180) / Math.PI;
      var diffYaw = Math.abs(yawGraus - MosaicoRA.anamorfoseAlvo.yaw);
      if (diffYaw > 180) diffYaw = 360 - diffYaw;
      var diffPitch = Math.abs(pitchGraus - MosaicoRA.anamorfoseAlvo.pitch);
      var desvioTotal = Math.sqrt(diffYaw * diffYaw + diffPitch * diffPitch);
      var proximidade = Math.max(0, Math.min(1, (25 - desvioTotal) / 25));
      var fill = document.getElementById("mosaico-ra-anamorfose-fill");
      if (fill) fill.style.width = (proximidade * 100).toFixed(1) + "%";
      if (desvioTotal < 3.2 && !MosaicoRA.anamorfoseAlinhada) {
        MosaicoRA.anamorfoseAlinhada = true;
        if (typeof Mosaico3D !== "undefined") { Mosaico3D.som.encaixe(); Mosaico3D.vibrar([50, 60, 120]); }
        var dicaEl = document.getElementById("mosaico-ra-dica-texto");
        if (dicaEl) dicaEl.innerHTML = "<b style='color:#ffe889'>ANAMORFOSE ALINHADA (21:29) &#10003;</b> Pista registrada no caso!";
      } else if (desvioTotal >= 3.2) {
        MosaicoRA.anamorfoseAlinhada = false;
      }
    }

    if(MosaicoRA.roomModel)MosaicoRA.roomModel.updateReflection(MosaicoRA.renderer,MosaicoRA.scene);
    MosaicoRA.renderer.render(MosaicoRA.scene, MosaicoRA.camera);
  };

  MosaicoRA.redimensionar = function () {
    if (!MosaicoRA.container || !MosaicoRA.renderer || !MosaicoRA.camera) return;
    var w = window.innerWidth, h = window.innerHeight;
    MosaicoRA.camera.aspect = w / h;
    MosaicoRA.camera.updateProjectionMatrix();
    MosaicoRA.renderer.setSize(w, h);
    if (MosaicoRA.raParticulasCanvas) {
      MosaicoRA.raParticulasCanvas.width = w;
      MosaicoRA.raParticulasCanvas.height = h;
    }
  };

  global.MosaicoRA = MosaicoRA;
})(window);
