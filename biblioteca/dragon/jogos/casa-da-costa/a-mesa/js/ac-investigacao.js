/* A escrivaninha d'A Casa — "Sob outra luz".

   Quem tem a vela (luz) põe a escrivaninha no chão, leva a vela ao castiçal e
   aponta a chama; quem ficou no escuro (conhecimento) procura sob as gavetas e
   lê a etiqueta que abre a maquete. A vela apaga sozinha em 25 s e o fósforo é
   do outro. O motor da dupla é ac-core.mjs (o mesmo na Mesa, no Solo e no
   servidor de ensaio); esta página só mostra e manda gestos.

   Mario, 18/09/2026: "A escrivaninha em RA só coloca a escrivaninha e acabou.
   Falta a vela, e achar a pista. A RA tem que ser real da tarefa!" — a RA
   agora é a tarefa inteira: no motor comum (ac-ra.js — WebXR no Android, 8th
   Wall no iPhone) a escrivaninha pousa no chão da sala de verdade, a vela vai
   da mão ao castiçal, a chama ilumina de onde o aparelho aponta e a etiqueta
   só se lê abaixando o aparelho até debaixo das gavetas. Sem RA, o mesmo
   jogo em 3D — e é só aí que aparecem os botões de apoio.

   Tempo e dicas (ac-ritmo.js): 4 minutos desde que a dupla chega; a vela vale
   30 e perde 1 a cada 8 s; duas dicas (a sutil e a que ajuda mais); esgotado
   o tempo, a etiqueta aparece e a vela não pontua. */
(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const params = new URLSearchParams(location.search);
  const solo = params.get('demo') === 'solo' && !params.has('sala');
  const RITMO = window.ACRitmo;
  const machine = window.ACInvestigationState;
  let state = {...machine.initial(), stage: 'posicionar'};
  let coop = null, role = params.get('papel') || 'luz', connected = false, shared = null;
  let fallback = false, raSuportada = null, raFalhou = false, lastBeam = 0, beamPending = false, discoverPending = false, registerPending = false;
  const clueText = 'Procure pelo lar onde o telhado não protege da chuva, os móveis nunca mudam de lugar e os moradores são pequenos demais. É lá onde todos os projetos se iniciam, é lá que o segredo repousa.';
  let disposed = false, modelReady = false, hold = 0, noticeTimer;
  let raPosta = false, prazoEnviado = false, dicaVista = '', falaVista = 0;
  let lightTransfer = 0;
  let draggingCandle = false, snapReady = false, draggingDesk = false;
  const dragPlane = new THREE.Plane(), dragRay = new THREE.Raycaster(), dragPoint = new THREE.Vector3();
  const cleanup = [];
  const on = (target, type, fn, options) => { if (!target) return; target.addEventListener(type, fn, options); cleanup.push(() => target.removeEventListener(type, fn, options)); };
  const entrarAtividade = () => window.ACJanelas?.entrarAtividade();
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function notify(message, nivel) { if (window.ACJanelas?.aviso) { window.ACJanelas.aviso(message, nivel || 9); return; } $('notice').textContent = message; $('notice').style.display = 'block'; clearTimeout(noticeTimer); noticeTimer = setTimeout(() => { $('notice').style.display = 'none'; }, 4000); }
  function dispatch(type) { if (!connected || !coop) return; coop.send(type).catch(() => notify('Conexão interrompida. Aguarde a reconexão.')); }
  function beginAction() { entrarAtividade(); if (role === 'luz' && shared && !shared.started) dispatch('iniciar'); }
  let ra = null;
  const emRA = () => !!(ra && ra.ativo());

  /* Os textos descrevem o MUNDO, nunca o papel. */
  const descriptions = {
    posicionar: ['A ESCRIVANINHA', 'Uma vela apagada na mão.', 'Uma escrivaninha espera um lugar no chão da sala.', 'Posicionar escrivaninha'],
    castical: ['A ESCRIVANINHA', 'Um lugar seguro.', 'Sobre a escrivaninha há um castiçal vazio.', 'Colocar a vela no castiçal'],
    iluminar: ['A ESCRIVANINHA', 'A chama pegou.', 'A luz vai aonde você aponta.', 'Investigar'],
    encontrado: ['A ESCRIVANINHA', 'Um segredo revelado.', 'Do outro lado da mesa, alguém lê uma etiqueta.', 'Examinar fragmento'],
    registrado: ['DOSSIÊ', 'A descoberta permanece.', 'A pista foi guardada. Ela aponta para outro lugar da casa.', 'Reabrir fragmento']
  };
  const noEscuro = {
    posicionar: ['A ESCRIVANINHA', 'Escuro.', 'Não se vê nada. Do outro lado da sala, alguém arrasta um móvel.'],
    castical: ['A ESCRIVANINHA', 'Escuro.', 'Não se vê nada. Alguém procura onde apoiar alguma coisa.'],
    iluminar: ['A ESCRIVANINHA', 'Uma luz chegou.', 'Ela vem de outro lugar e alcança o que alcança. Debaixo das coisas também há coisas.']
  };
  /* No Solo, quem joga segura a vela E procura: a luz sai do próprio aparelho. */
  const soloProcura = () => solo && role === 'conhecimento' && state.stage === 'iluminar';
  const seguraALuz = () => role === 'luz' || soloProcura();
  const vela = () => shared?.vela || {existe: false, acesa: false, resta: 0};
  const velaApagada = () => state.stage === 'iluminar' && vela().existe && !vela().acesa;
  let tentativasNaVela = 0, toquesNoEscuro = 0, tremorVela = 0, velaAntes = null;

  /* ---------------- cena ---------------- */
  const scene = new THREE.Scene(); scene.background = new THREE.Color(0x091515); scene.fog = new THREE.Fog(0x091515, 6, 14);
  const camera = new THREE.PerspectiveCamera(40, innerWidth / innerHeight, .02, 35);
  camera.position.set(1.6, 1.45, 2.35);
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); }
  catch (_) { $('loading').textContent = 'Este navegador não conseguiu abrir o 3D. Tente com aceleração gráfica ativada.'; return; }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75)); renderer.setSize(innerWidth, innerHeight);
  renderer.outputEncoding = THREE.sRGBEncoding; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = .82;
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.xr.enabled = true; $('scene').appendChild(renderer.domElement);
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.target.set(0, .47, 0); controls.enableDamping = true; controls.dampingFactor = .09;
  controls.minDistance = .12; controls.maxDistance = 22; controls.maxPolarAngle = Math.PI * .96; controls.enablePan = false;
  function frameDesk() {
    if (emRA()) return;
    const distance = 2.8;
    camera.fov = Math.max(40, Math.min(95, THREE.MathUtils.radToDeg(2 * Math.atan(1.65 / (2 * distance * camera.aspect * .87)))));
    camera.updateProjectionMatrix(); controls.target.set(0, .5, 0);
    camera.position.copy(new THREE.Vector3(1.2, .8, 2.6).normalize().multiplyScalar(distance).add(controls.target)); controls.update();
  }
  frameDesk();
  controls.update();
  scene.add(camera);
  const environment = new THREE.Group(); scene.add(environment);
  const ambient = new THREE.HemisphereLight(0xa8c8c7, 0x393122, .8); scene.add(ambient);
  const windowLight = new THREE.DirectionalLight(0xbedee8, 2); windowLight.position.set(-2, 3, 1); scene.add(windowLight);
  const rim = new THREE.DirectionalLight(0xe6b777, .6); rim.position.set(2, 2, -2); scene.add(rim);
  const roomSeed = ACRoom.seed(), room = ACRoom.create({seed: roomSeed, desk: false, powered: true});
  const deskPose = room.objects.escrivaninha;
  const inverseDesk = new THREE.Matrix4().compose(deskPose.position, deskPose.quaternion, new THREE.Vector3(1, 1, 1)).invert();
  room.root.applyMatrix4(inverseDesk); environment.add(room.root);
  room.objects.escrivaninha.visible = false;
  controls.maxDistance = 3.4;
  const deskRoot = new THREE.Group(); scene.add(deskRoot);
  let desk;
  const placement = new THREE.Mesh(new THREE.RingGeometry(.55, .56, 64), new THREE.MeshBasicMaterial({ color: 0xc5b07f, side: THREE.DoubleSide, transparent: true, opacity: .45 }));
  placement.rotation.x = -Math.PI / 2; placement.position.y = .009; deskRoot.add(placement);
  /* Em RA, uma sombra no chão de verdade (só a sombra, sem chão desenhado). */
  const sombra = new THREE.Mesh(new THREE.PlaneGeometry(3, 3).rotateX(-Math.PI / 2), new THREE.ShadowMaterial({ opacity: .35 }));
  sombra.receiveShadow = true; sombra.visible = false; sombra.position.y = .001; deskRoot.add(sombra);

  // Castiçal torneado, cera com borda irregular e chama volumétrica.
  const holder = new THREE.Group(); holder.position.set(.28, .765, .02); deskRoot.add(holder);
  const brass = new THREE.MeshStandardMaterial({ color: 0xb59351, metalness: .8, roughness: .29 });
  const profile = [[0,0],[.072,0],[.081,.008],[.079,.016],[.05,.026],[.031,.032],[.022,.048],[.017,.115],[.03,.129],[.045,.138],[.048,.15],[.033,.156],[0,.156]].map(p => new THREE.Vector2(...p));
  const holderMesh = new THREE.Mesh(new THREE.LatheGeometry(profile, 48), brass); holderMesh.castShadow = true; holder.add(holderMesh);
  const candle = new THREE.Group(); scene.add(candle);
  const waxMat = new THREE.MeshStandardMaterial({ color: 0xe9d5a5, roughness: .6 });
  const wax = new THREE.Mesh(new THREE.CylinderGeometry(.025, .028, .2, 40), waxMat); wax.position.y = .1; wax.castShadow = true; candle.add(wax);
  const lip = new THREE.Mesh(new THREE.TorusGeometry(.022, .005, 8, 32), waxMat); lip.rotation.x = Math.PI / 2; lip.position.y = .2; candle.add(lip);
  for (let i = 0; i < 6; i++) { const a = i * 2.4, len = .015 + (i % 3) * .014; const drip = new THREE.Mesh(new THREE.CylinderGeometry(.003, .004, len, 8), waxMat); drip.position.set(Math.cos(a) * .024, .193 - len / 2, Math.sin(a) * .024); candle.add(drip); }
  const wick = new THREE.Mesh(new THREE.CylinderGeometry(.0016, .0019, .014, 8), new THREE.MeshBasicMaterial({color: 0x352619})); wick.position.y = .211; candle.add(wick);
  const flame = new THREE.Group(); flame.position.y = .235; candle.add(flame);
  const flameMaterial = new THREE.ShaderMaterial({transparent: true, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, uniforms: {time: {value: 0}}, vertexShader: 'varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}', fragmentShader: `varying vec2 vUv; uniform float time; void main(){ float y=vUv.y; float sway=sin(y*9.0-time*4.0)*0.035*y; float x=vUv.x-0.5-sway; float width=0.27*pow(max(0.0,1.0-y),0.75)*smoothstep(0.0,0.18,y); float edge=1.0-smoothstep(width*0.6,width+0.025,abs(x)); float alpha=edge*smoothstep(0.0,0.09,y)*(1.0-smoothstep(0.91,1.0,y)); vec3 color=mix(vec3(1.0,0.26,0.025),vec3(1.0,0.86,0.39),pow(edge,3.0)); color=mix(color,vec3(0.12,0.23,0.8),(1.0-smoothstep(0.02,0.16,y))*0.6); gl_FragColor=vec4(color,alpha); }`});
  const flamePlane = new THREE.Mesh(new THREE.PlaneGeometry(.072, .078), flameMaterial); flamePlane.position.y = .013; flame.add(flamePlane);
  const glow = new THREE.Mesh(new THREE.SphereGeometry(.05, 16, 12), new THREE.MeshBasicMaterial({ color: 0xffa440, transparent: true, opacity: .16, depthWrite: false, blending: THREE.AdditiveBlending }));
  glow.position.y = .015; flame.add(glow);
  const candleLight = new THREE.PointLight(0xffc572, .85, 2.5, 2); candleLight.position.y = .24; candle.add(candleLight);
  const torch = new THREE.SpotLight(0xffdc9d, 4, 5, Math.PI / 7, .6, 1.4); torch.castShadow = true; torch.shadow.mapSize.set(512, 512); scene.add(torch); scene.add(torch.target);
  const pointer = new THREE.Vector2(0, 0); const ray = new THREE.Raycaster();
  const beamDirection = new THREE.Vector3();
  const clueCanvas = document.createElement('canvas'); clueCanvas.width = 1024; clueCanvas.height = 512;
  const cc = clueCanvas.getContext('2d'); cc.fillStyle = '#a09273'; cc.fillRect(0, 0, 1024, 512); cc.fillStyle = '#29251e'; cc.font = '38px Georgia';
  let line = '', y = 65; for (const word of clueText.split(' ')) { const next = line + word + ' '; if (cc.measureText(next).width > 920) { cc.fillText(line, 48, y); y += 53; line = word + ' '; } else line = next; } cc.fillText(line, 48, y);
  const clue = new THREE.Mesh(new THREE.PlaneGeometry(.065, .0325), new THREE.MeshStandardMaterial({map: new THREE.CanvasTexture(clueCanvas), roughness: .95, transparent: true, opacity: 0}));
  // Etiqueta de 6,5 cm sob o pedestal das gavetas, com a face voltada para o chão.
  clue.position.set(.47, .098, .10); clue.rotation.x = Math.PI / 2; deskRoot.add(clue);

  /* ---------------- RA ---------------- */
  ra = ACRA.criar({
    renderer, camera, cena: scene, altura: 1.3, miraEscala: 4,
    desenhar: (t, f) => render(t, f),
    aoTocar: (x, y) => tocar(x, y),
    aoMudar: e => {
      if (e.ativo) {
        scene.background = null; scene.fog = null; environment.visible = false; sombra.visible = true;
        controls.enabled = false; camera.clearViewOffset(); lastViewOffset = 0;
        if (!raPosta) deskRoot.visible = false;
      } else {
        environment.visible = true; sombra.visible = false; deskRoot.visible = true;
        scene.background = new THREE.Color(0x091515); scene.fog = new THREE.Fog(0x091515, 6, 14);
        deskRoot.position.set(0, 0, 0); deskRoot.quaternion.identity(); raPosta = false;
        camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); frameDesk();
      }
      updateUI();
    }
  });
  function abrirRA() {
    $('ra-aviso').textContent = 'Abrindo a câmera…';
    $('ra-entrar').disabled = true;
    ra.entrar().then(() => {
      $('ra-entrar').disabled = false;
      fecharPortal(); fallback = false; raPosta = false; deskRoot.visible = false;
      notify(role === 'luz' || solo ? 'Aponte para o chão, mova o aparelho devagar e toque para pôr a escrivaninha na sala.' : 'Aponte para o chão e toque para pôr a sua escrivaninha na sala. Ela é o mesmo móvel do colega.', 3);
      beginAction(); updateUI();
    }).catch(erro => {
      $('ra-entrar').disabled = false;
      console.warn('[escrivaninha] RA não abriu:', erro);
      raFalhou = true;
      $('ra-aviso').textContent = erro && erro.name === 'NotAllowedError'
        ? 'A câmera ou os sensores foram recusados. Libere nas configurações do navegador e tente de novo, ou continue na tela.'
        : 'A realidade aumentada não abriu neste aparelho. Tente de novo, ou continue na tela.';
      atualizarPortal();
    });
  }
  function abrirPortal() { const d = $('portal-ra'); if (!d.open) { try { d.showModal(); } catch (_) { d.setAttribute('open', ''); } } }
  function fecharPortal() { const d = $('portal-ra'); if (d.open) { try { d.close(); } catch (_) { d.removeAttribute('open'); } } }
  function atualizarPortal() {
    $('ra-entrar').textContent = raFalhou ? 'Tentar a realidade aumentada de novo' : 'Abrir a câmera';
    $('ra-tela').hidden = !raFalhou;
  }
  function usarTela(motivo) {
    fecharPortal(); fallback = true;
    $('accessible').closest('label').hidden = false;
    $('fallback-description').textContent = (motivo ? motivo + ' ' : '') + 'Um dedo arrastando gira a cena; dois dedos aproximam. Toque no que parecer importante.';
    updateUI();
  }
  /* Um toque na cena (os dois modos). */
  function tocar(x, y) {
    if (!modelReady || !connected || draggingCandle) return;
    if (emRA() && !raPosta) { pousarNaMira(); return; }
    if (state.stage === 'encontrado' && role === 'conhecimento') openFragment();
  }
  function pousarNaMira() {
    if (!ra.estado().temMira) { notify('Aponte para o chão até aparecer o círculo.', 7); return; }
    const pose = ra.pose();
    deskRoot.position.setFromMatrixPosition(pose); deskRoot.quaternion.setFromRotationMatrix(pose);
    raPosta = true; deskRoot.visible = true; ra.mostrarMira(false);
    if (role === 'luz' && state.stage === 'posicionar') { beginAction(); dispatch('posicionar'); }
    updateUI();
  }

  /* ---------------- tela ---------------- */
  function updateUI() {
    const [step, heading, description, label] = descriptions[state.stage];
    $('step').textContent = step; $('heading').textContent = heading; $('description').textContent = description; $('primary').textContent = label;
    $('primary').disabled = !modelReady || state.stage === 'iluminar';
    /* Botões de apoio: só no 3D, e só com a opção ligada (Mario: "os botões
       têm que aparecer se não funcionou RA"). */
    $('primary').hidden = !(fallback && !emRA() && $('accessible').checked) || role !== 'luz' || ['iluminar', 'registrado'].includes(state.stage);
    $('sair-ra').hidden = !emRA();
    $('dossier').hidden = emRA() || role !== 'conhecimento' || !['encontrado', 'registrado'].includes(state.stage);
    /* O fósforo só existe no bolso de quem não pôs a vela, e só quando ela apagou. */
    $('fosforo').hidden = solo || role !== 'conhecimento' || !velaApagada() || !connected;
    if (role !== 'luz' && !soloProcura() && noEscuro[state.stage]) { const [a, b, c] = noEscuro[state.stage]; $('step').textContent = a; $('heading').textContent = b; $('description').textContent = c; }
    if (soloProcura()) { $('heading').textContent = 'A chama pegou.'; $('description').textContent = 'A luz vai aonde você aponta. Debaixo das coisas também há coisas.'; }
    if (velaApagada()) {
      $('heading').textContent = seguraALuz() ? 'A vela apagou.' : 'A luz sumiu.';
      $('description').textContent = solo ? 'O pavio ainda fumega. O fósforo está com seu parceiro.' : role === 'luz' ? 'O pavio ainda fumega.' : 'No bolso, uma caixa de fósforos.';
    }
    if (emRA() && !raPosta) { $('heading').textContent = 'Procure o chão.'; $('description').textContent = !ra.estado().rastreando ? 'Mova o aparelho devagar, de um lado para o outro, apontando para o chão.' : ra.estado().temMira ? 'Toque na tela para pôr a escrivaninha onde está o círculo.' : 'Aponte para um trecho de chão livre e bem iluminado.'; }
    else if (emRA() && !ra.estado().rastreando) $('description').textContent = 'A câmera perdeu o chão. Mova o aparelho devagar e aponte para a escrivaninha.';
    else if (fallback && !emRA() && !$('accessible').checked && role === 'luz' && ['posicionar', 'castical'].includes(state.stage)) $('description').textContent = $('description').textContent.replace(/[.!]?$/, '.') + (state.stage === 'posicionar' ? ' Toque no chão para posicionar a escrivaninha.' : ' Arraste a vela até o castiçal sobre a escrivaninha.');
    if (emRA() && raPosta && soloProcura() && !velaApagada()) $('description').textContent = 'A luz sai do seu aparelho. Abaixe-o até debaixo das gavetas e olhe para cima.';
    for (const id of ['step', 'heading', 'description', 'primary']) {
      const element = $(id), words = element.textContent;
      element.textContent = words.replace(/\bluz\b/gi, '💡').replace(/\bvela\b/gi, '🕯️');
      element.setAttribute('aria-label', words);
    }
    const searching = state.stage === 'iluminar';
    const procura = searching && (role === 'conhecimento');
    $('reticle').style.display = searching && !emRA() ? 'block' : 'none'; $('progress').style.display = procura ? 'block' : 'none';
    $('count').textContent = state.evidence.length;
    controls.mouseButtons.LEFT = role === 'conhecimento' ? THREE.MOUSE.ROTATE : null; controls.mouseButtons.RIGHT = THREE.MOUSE.ROTATE;
    controls.enabled = fallback && !emRA() && !draggingCandle && (role === 'conhecimento' || state.stage === 'iluminar');
    placement.visible = role === 'luz' && !emRA() && state.stage === 'posicionar';
    /* A vela fica no castiçal depois de posta. */
    const velaPosta = ['iluminar', 'encontrado', 'registrado'].includes(state.stage);
    const minhaVela = role === 'luz' || solo;
    holder.visible = minhaVela && (state.stage === 'castical' || velaPosta); candle.visible = minhaVela && (state.stage !== 'posicionar' || !emRA() || raPosta);
    if (velaPosta && candle.parent !== holder) { holder.add(candle); candle.position.set(0, .153, 0); candle.scale.setScalar(1); candle.rotation.set(0, 0, 0); }
    else if (!velaPosta && candle.visible && !draggingCandle) { camera.add(candle); candle.position.set(0, candleRestY(), -.55); candle.scale.setScalar(.5); candle.rotation.set(0, 0, -.06); }
    torch.visible = (searching && !velaApagada()) || state.stage === 'encontrado' || state.stage === 'registrado';
    ambient.intensity = .32; windowLight.intensity = .8; rim.intensity = .4;
    if (role !== 'conhecimento') clue.material.opacity = 0;
    $('candle-grip').hidden = !minhaVela || role !== 'luz' || !(state.stage === 'castical' || velaApagada()) || (emRA() && !raPosta) || !connected;
    $('socket').hidden = true; // Encontrar o castiçal faz parte do desafio.
    pintarRelogio(); pintarDica();
  }
  function pintarRelogio() {
    const s = shared; if (!s) return;
    let texto;
    if (['encontrado', 'registrado'].includes(state.stage)) texto = s.velaEsgotada ? '⏳ Tempo esgotado · a vela não pontuou' : '🕯️ Vela: ' + s.bonus + ' pontos';
    else if (!s.started) texto = '⏳ ' + RITMO.relogio(RITMO.escrivaninha.total) + ' · vale ' + RITMO.escrivaninha.max + ' pontos';
    else texto = '⏳ ' + RITMO.relogio(s.prazo ? s.prazo.restante : 0) + ' · vale ' + s.bonus + ' pontos';
    $('timer').textContent = texto;
  }
  function pintarDica() {
    const d = shared && shared.dica, el = $('dica');
    if (!d || !d.nivel || !d.texto) { el.hidden = true; return; }
    el.hidden = false; el.textContent = (d.nivel === 1 ? '💡 Dica: ' : '💡 Dica 2: ') + d.texto;
    const marca = state.stage + '/' + d.nivel;
    if (marca !== dicaVista) { dicaVista = marca; notify((d.nivel === 1 ? 'Uma dica chegou. ' : 'Mais uma dica chegou. ') + d.texto, 3); window.ACJanelas?.vida(); }
  }
  function pintarParceiro(fala) {
    if (!solo || !fala || !fala.texto) return;
    const el = $('fala-parceiro'); el.hidden = false; el.textContent = '🤝 Parceiro: ' + fala.texto;
    if (fala.at !== falaVista) { falaVista = fala.at; window.ACJanelas?.vida(); }
  }
  /* No telefone a pilha de instruções ocupa a parte de baixo da tela: a vela
     "na mão" nasce acima dela. */
  function candleRestY() {
    if (emRA()) return -.1;
    const st = document.querySelector('.ac-panel-stack');
    if (!st || innerWidth > 700 || !st.getBoundingClientRect().height) return -.08;
    const top = st.getBoundingClientRect().top, ch = document.querySelector('.chapter')?.getBoundingClientRect().bottom || 0;
    const px = Math.max(ch + 70, Math.min(top - 70, innerHeight * .55));
    const halfH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * .55;
    const off = camera.view && camera.view.enabled ? camera.view.offsetY : 0;
    return (1 - 2 * (px + off) / innerHeight) * halfH - .05;
  }
  let lastViewOffset = null;
  function syncViewOffset() {
    if (emRA()) return;
    const st = document.querySelector('.ac-panel-stack'); let off = 0;
    if (st && innerWidth <= 700 && st.getBoundingClientRect().height) {
      const top = (document.querySelector('.chapter')?.getBoundingClientRect().bottom || 60), bottom = st.getBoundingClientRect().top;
      off = Math.max(0, Math.round(innerHeight / 2 - (top + bottom) / 2));
    }
    if (off === lastViewOffset) return; lastViewOffset = off;
    if (off) camera.setViewOffset(innerWidth, innerHeight, 0, off, innerWidth, innerHeight); else camera.clearViewOffset();
  }
  function dockCandle() {
    if (role !== 'luz' || state.stage !== 'castical' || !connected) return;
    draggingCandle = false; snapReady = false; dispatch('encaixar');
    lightTransfer = 0;
    holder.add(candle); candle.position.set(0, .153, 0); candle.scale.setScalar(1); candle.rotation.set(0, 0, 0);
  }
  function openFragment() {
    if (role !== 'conhecimento' && !(shared && shared.velaEsgotada)) return;
    /* Voltando à página depois do achado, o portal da RA abria junto: dois
       diálogos de uma vez, e fechar o dossiê caía num "Abrir a câmera" para
       pôr de novo uma escrivaninha que já tinha dado a pista (volta 4,
       04/10/2026). O que resta — ler, guardar, seguir — não pede câmera. */
    if ($('portal-ra').open && !emRA()) usarTela();
    $('fragment-card').innerHTML = Mosaico3D.htmlCartao3D('ac-estudo', '<span class="eyebrow" style="color:#6b5831">SOB AS GAVETAS</span><h3>Uma etiqueta escondida.</h3><p>' + clueText + '</p>', '<h3>O lar em miniatura.</h3><p>Registre a pista. A próxima descoberta depende de interpretar o lugar que ela descreve.</p>');
    $('fragment-card').querySelector('.m3d-card-back').setAttribute('aria-hidden', 'true');
    $('follow-clue').hidden = state.stage !== 'registrado';
    $('register').hidden = state.stage === 'registrado' && !!(shared && shared.velaEsgotada);
    $('register').disabled = registerPending || state.stage === 'registrado'; $('register').textContent = state.stage === 'registrado' ? 'Guardado neste estudo' : registerPending ? 'Guardando…' : 'Guardar no dossiê deste estudo';
    if (!$('fragment').open) $('fragment').showModal();
  }
  on($('primary'), 'click', () => {
    if (role !== 'luz' || !fallback || emRA()) return; beginAction();
    if (state.stage === 'posicionar') dispatch('posicionar');
    else if (state.stage === 'castical') dockCandle();
    else if (state.stage === 'encontrado') openFragment();
  });
  on($('ra-entrar'), 'click', abrirRA);
  on($('ra-tela'), 'click', () => usarTela(''));
  on($('sair-ra'), 'click', () => { raFalhou = true; ra.sair().then(() => { atualizarPortal(); usarTela('Você saiu da realidade aumentada.'); }); });
  on($('fosforo'), 'click', () => { if (role !== 'conhecimento' || !velaApagada()) return; entrarAtividade(); dispatch('reacender'); });
  /* No escuro, quem toca a cena tateia: a resposta é do mundo, não do jogo. */
  on(renderer.domElement, 'pointerdown', () => {
    if (role === 'luz' || soloProcura() || !connected || (!['posicionar', 'castical'].includes(state.stage) && !velaApagada())) return;
    toquesNoEscuro++;
    if (toquesNoEscuro === 2) notify(velaApagada() ? 'Escuro de novo. No bolso, alguma coisa chacoalha.' : 'Escuro demais para ver qualquer coisa.', 9);
    else if (toquesNoEscuro === 4) notify('A luz, se vier, vem de outro lugar.', 9);
  });
  on($('follow-clue'), 'click', () => { entrarAtividade(); if (shared?.maquete) location.href = 'AC-maquete.html' + location.search; else dispatch('iniciar_maquete'); });
  on($('register'), 'click', async () => {
    if (registerPending || state.stage !== 'encontrado') return;
    if (!connected || !coop) { notify('Aguarde a reconexão para guardar a pista.'); return; }
    entrarAtividade(); registerPending = true; openFragment();
    try { const accepted = await coop.send('registrar'); if (!accepted && state.stage !== 'registrado') notify('A pista ainda não foi registrada. Aguarde a atualização da dupla e tente novamente.'); }
    catch (_) { notify('Não foi possível confirmar o registro. Aguarde a reconexão e tente novamente.'); }
    finally { registerPending = false; if ($('fragment').open) openFragment(); }
  });
  on($('dossier'), 'click', () => { if (state.stage === 'encontrado' || state.stage === 'registrado') openFragment(); else notify('O dossiê está vazio. Investigue a borda inferior da escrivaninha.'); });
  on($('accessible'), 'change', updateUI);
  /* No 3D, quem tem a vela põe a escrivaninha tocando no chão. */
  function moveDeskOnFloor(event) {
    if (emRA()) return false;
    dragRay.setFromCamera(new THREE.Vector2(event.clientX / innerWidth * 2 - 1, 1 - event.clientY / innerHeight * 2), camera);
    if (!dragRay.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), dragPoint) || dragPoint.distanceTo(camera.position) >= 12) return false;
    deskRoot.position.set(0, 0, 0); return true;
  }
  on(renderer.domElement, 'pointerdown', event => {
    if (role !== 'luz' || !connected || !fallback || state.stage !== 'posicionar' || emRA() || !modelReady) return; beginAction();
    if (moveDeskOnFloor(event)) { draggingDesk = true; renderer.domElement.setPointerCapture(event.pointerId); }
  });
  on(renderer.domElement, 'pointermove', event => { if (draggingDesk) moveDeskOnFloor(event); });
  on(renderer.domElement, 'pointerup', event => { if (!draggingDesk) return; draggingDesk = false; if (renderer.domElement.hasPointerCapture(event.pointerId)) renderer.domElement.releasePointerCapture(event.pointerId); dispatch('posicionar'); });
  on(renderer.domElement, 'pointercancel', () => { draggingDesk = false; });
  on(renderer.domElement, 'click', event => {
    if (emRA()) { tocar(event.clientX, event.clientY); return; }
    if (!modelReady || !connected || draggingCandle) return;
    if (role !== 'luz' || !fallback) { if (state.stage === 'encontrado') tocar(event.clientX, event.clientY); return; }
    beginAction();
    if (state.stage === 'posicionar') {
      const p = new THREE.Vector2(event.clientX / innerWidth * 2 - 1, 1 - event.clientY / innerHeight * 2);
      dragRay.setFromCamera(p, camera); const ground = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      if (dragRay.ray.intersectPlane(ground, dragPoint) && dragPoint.distanceTo(camera.position) < 12) { deskRoot.position.set(0, 0, 0); dispatch('posicionar'); }
      else notify('Toque em uma região do chão.');
    } else if (state.stage === 'encontrado') openFragment();
  });
  function screenPoint(object, offset) {
    const active = ra.cameraAtiva();
    const world = object.localToWorld(offset.clone()).project(active || camera);
    return {x: (world.x + 1) * innerWidth / 2, y: (1 - world.y) * innerHeight / 2, visible: world.z > -1 && world.z < 1};
  }
  /* A vela apagada resiste à mão de quem a pôs: treme, e na segunda vez a
     frase diz de quem é o fósforo. */
  function recusarVela() {
    const g = $('candle-grip'); g.classList.remove('recusa'); void g.offsetWidth; g.classList.add('recusa');
    tremorVela = 1; tentativasNaVela++;
    try { navigator.vibrate && navigator.vibrate([12, 40, 12]); } catch (_) {}
    if (tentativasNaVela >= 2) notify(solo ? 'Essa chama não pega da sua mão — o fósforo está com seu parceiro.' : 'Essa chama não pega da sua mão — o fósforo está com seu colega.', 9);
  }
  on($('candle-grip'), 'pointerdown', event => {
    if (role === 'luz' && connected && velaApagada()) { event.preventDefault(); event.stopPropagation(); recusarVela(); return; }
    if (role !== 'luz' || !connected || state.stage !== 'castical' || !modelReady || (!fallback && !emRA())) return; beginAction();
    event.preventDefault(); event.stopPropagation(); draggingCandle = true; controls.enabled = false; document.body.classList.add('manipulating');
    $('candle-grip').setPointerCapture(event.pointerId);
    const active = ra.cameraAtiva();
    const socketWorld = holder.localToWorld(new THREE.Vector3(0, .153, 0));
    const normal = new THREE.Vector3(); active.getWorldDirection(normal); dragPlane.setFromNormalAndCoplanarPoint(normal, socketWorld);
    scene.attach(candle); candle.scale.setScalar(1);
  });
  on($('candle-grip'), 'pointermove', event => {
    if (!draggingCandle) return; event.preventDefault(); moverVela(event);
  });
  function moverVela(event) {
    dragRay.setFromCamera(new THREE.Vector2(event.clientX / innerWidth * 2 - 1, 1 - event.clientY / innerHeight * 2), ra.cameraAtiva());
    if (dragRay.ray.intersectPlane(dragPlane, dragPoint)) candle.position.copy(dragPoint);
    const socketWorld = holder.localToWorld(new THREE.Vector3(0, .153, 0));
    const escala = deskRoot.getWorldScale(new THREE.Vector3()).x || 1;
    snapReady = machine.canDock(candle.position.distanceTo(socketWorld) / escala);
    $('socket').classList.toggle('ready', snapReady); $('socket').firstElementChild.textContent = snapReady ? 'Solte para encaixar' : 'Castiçal';
  }
  function endDrag(event) {
    if (!draggingCandle) return;
    /* Onde o dedo SAIU vale (o mesmo da chave da maquete, volta 3): com
       eventos agrupados, o último pointermove chega antes de o dedo parar. */
    if (event.type === 'pointerup') moverVela(event);
    draggingCandle = false; document.body.classList.remove('manipulating');
    if ($('candle-grip').hasPointerCapture(event.pointerId)) $('candle-grip').releasePointerCapture(event.pointerId);
    if (snapReady && event.type !== 'pointercancel') dockCandle(); else { snapReady = false; updateUI(); notify('Aproxime a base da vela do castiçal e solte no encaixe.'); }
    $('socket').classList.remove('ready'); $('socket').firstElementChild.textContent = 'Castiçal';
  }
  on($('candle-grip'), 'pointerup', endDrag); on($('candle-grip'), 'pointercancel', endDrag);
  document.querySelectorAll('[data-close]').forEach(b => on(b, 'click', () => b.closest('dialog').close()));
  /* No 3D, tocar nas gavetas leva o olhar para debaixo delas. Em RA o olhar
     é o do aparelho: quem quer ver embaixo, abaixa o telefone. */
  function olharPorBaixo() { camera.position.copy(deskRoot.localToWorld(new THREE.Vector3(.47, .025, .25))); controls.target.copy(deskRoot.localToWorld(new THREE.Vector3(.47, .098, .10))); controls.update(); pointer.set(0, 0); hold = 0; updateUI(); }
  let toqueNoMovel = null;
  on(renderer.domElement, 'pointerdown', event => { toqueNoMovel = {x: event.clientX, y: event.clientY}; });
  on(renderer.domElement, 'pointerup', event => {
    const t = toqueNoMovel; toqueNoMovel = null;
    if (!t || Math.hypot(event.clientX - t.x, event.clientY - t.y) > 8) return;
    if (!modelReady || emRA() || draggingCandle || state.stage !== 'iluminar') return;
    const rect = renderer.domElement.getBoundingClientRect();
    dragRay.setFromCamera(new THREE.Vector2((event.clientX - rect.left) / rect.width * 2 - 1, -(event.clientY - rect.top) / rect.height * 2 + 1), camera);
    const hit = dragRay.intersectObject(desk, true)[0]; if (!hit) return;
    const caixa = new THREE.Box3().setFromObject(desk), alto = deskRoot.worldToLocal(caixa.max.clone()).y;
    const local = deskRoot.worldToLocal(hit.point.clone());
    if (local.y < alto * .85) olharPorBaixo();
  });
  on(renderer.domElement, 'pointermove', event => { if (emRA()) return; const rect = renderer.domElement.getBoundingClientRect(); pointer.set((event.clientX - rect.left) / rect.width * 2 - 1, -(event.clientY - rect.top) / rect.height * 2 + 1); $('reticle').style.left = event.clientX + 'px'; $('reticle').style.top = event.clientY + 'px'; });
  on(window, 'keydown', e => { if ($('fragment').open || $('instructions').open || !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) return; e.preventDefault(); pointer.x = THREE.MathUtils.clamp(pointer.x + (e.key === 'ArrowRight' ? .035 : e.key === 'ArrowLeft' ? -.035 : 0), -1, 1); pointer.y = THREE.MathUtils.clamp(pointer.y + (e.key === 'ArrowUp' ? .035 : e.key === 'ArrowDown' ? -.035 : 0), -1, 1); $('reticle').style.left = (pointer.x + 1) * innerWidth / 2 + 'px'; $('reticle').style.top = (1 - pointer.y) * innerHeight / 2 + 'px'; });
  /* Um toque num painel da RA não pode virar toque na cena. */
  on(document, 'beforexrselect', e => { if (e.target && e.target.closest && e.target.closest('aside,dialog,.topbar,.tools,.gesture-point,#notice')) e.preventDefault(); });

  /* A porta: com RA, a câmera é o caminho; sem RA (ou se ela falhar), a tela. */
  ra.suporte().then(s => {
    if (disposed) return;
    raSuportada = !!(s.webxr || s.slam);
    if ($('fragment').open) usarTela();
    else if (raSuportada) { atualizarPortal(); abrirPortal(); }
    else usarTela('Este aparelho não tem realidade aumentada.');
  });
  ACRA.preparar();

  ACDesk.load(model => {
    if (disposed) { disposeObject(model); return; }
    desk = model;
    desk.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
    deskRoot.add(desk); modelReady = true; $('loading').hidden = true; updateUI();
  }, () => { $('loading').textContent = 'Não foi possível carregar a escrivaninha. Recarregue a página para tentar novamente.'; });

  const clock = new THREE.Clock(); let lastTime = 0, forcarQuadro = false, ultimoPainel = 0, ultimaMira = '';
  function render(time, frame) {
    if (disposed) return; const dt = Math.min(clock.getDelta(), .1), t = time * .001;
    if (document.hidden && !forcarQuadro) { hold = 0; return; }
    ra.quadro(frame);
    ra.mostrarMira(emRA() && !raPosta);
    /* Procurando o chão, o painel acompanha a mira (apareceu/sumiu). */
    if (emRA() && !raPosta && time - ultimoPainel > 400) { ultimoPainel = time; const m = ra.estado().temMira + '/' + ra.estado().rastreando; if (m !== ultimaMira) { ultimaMira = m; updateUI(); } }
    if (!emRA()) { controls.update(); room.updateReflection(renderer, scene); }
    if (role === 'luz' && velaApagada() && connected) {
      scene.updateMatrixWorld(true);
      const cp = screenPoint(candle, new THREE.Vector3(0, .10, 0));
      $('candle-grip').style.left = cp.x + 'px'; $('candle-grip').style.top = cp.y + 'px'; $('candle-grip').hidden = !cp.visible;
    }
    if (tremorVela > 0) { candle.rotation.z = Math.sin(t * 60) * .08 * tremorVela; tremorVela = Math.max(0, tremorVela - dt * 2.5); if (!tremorVela) candle.rotation.z = 0; }
    /* A luz como a vela manda: sem ela, quem está do outro lado volta ao
       escuro, e a sala de quem a pôs escurece também. */
    {
      const v = vela(), escuroTotal = !seguraALuz() && (['posicionar', 'castical'].includes(state.stage) || velaApagada()), penumbra = seguraALuz() && velaApagada();
      const alvo = escuroTotal ? .05 : penumbra ? .3 : .82;
      renderer.toneMappingExposure += (alvo - renderer.toneMappingExposure) * (reduced ? 1 : Math.min(1, dt * 3));
      const noCastical = candle.parent === holder;
      flame.visible = !noCastical ? false : (state.stage !== 'iluminar' || v.acesa);
      candleLight.intensity = flame.visible ? .85 : 0;
    }
    if (role === 'luz' && state.stage === 'castical' && (!emRA() || raPosta) && connected) {
      scene.updateMatrixWorld(true);
      const cp = screenPoint(candle, new THREE.Vector3(0, .10, 0)), sp = screenPoint(holder, new THREE.Vector3(0, .153, 0));
      $('candle-grip').style.left = cp.x + 'px'; $('candle-grip').style.top = cp.y + 'px'; $('candle-grip').hidden = !cp.visible;
      $('socket').style.left = sp.x + 'px'; $('socket').style.top = sp.y + 'px'; $('socket').hidden = !sp.visible;
    }
    if (candle.parent === camera && !draggingCandle) candle.position.y = candleRestY();
    if (!reduced) { flame.scale.set(1 + Math.sin(t * 9) * .04, 1 + Math.sin(t * 7) * .08, 1); flameMaterial.uniforms.time.value = t; }
    const flameCameraPosition = new THREE.Vector3(); ra.cameraAtiva().getWorldPosition(flameCameraPosition); flamePlane.lookAt(flameCameraPosition);
    if (lightTransfer > 0) { lightTransfer = Math.max(0, lightTransfer - dt); const s = Math.min(1, lightTransfer * 2); holder.scale.setScalar(Math.max(.001, s)); if (!lightTransfer) { holder.visible = false; candle.visible = false; holder.scale.setScalar(1); } }
    const activeCamera = ra.cameraAtiva();
    const viewerPosition = new THREE.Vector3(); activeCamera.getWorldPosition(viewerPosition);
    if (emRA()) { ray.ray.origin.copy(viewerPosition); activeCamera.getWorldDirection(ray.ray.direction); } else ray.setFromCamera(pointer, activeCamera);
    const target = new THREE.Vector3(); clue.getWorldPosition(target);
    torch.position.copy(viewerPosition); beamDirection.copy(ray.ray.direction); torch.target.position.copy(torch.position).addScaledVector(beamDirection, 2);
    if (seguraALuz() && state.stage === 'iluminar' && !velaApagada() && connected && (!emRA() || raPosta) && !beamPending && time - lastBeam > 100) {
      lastBeam = time; beamPending = true;
      coop.send('feixe', {origin: deskRoot.worldToLocal(torch.position.clone()).toArray(), target: deskRoot.worldToLocal(torch.target.position.clone()).toArray()}).catch(() => {}).finally(() => beamPending = false);
    }
    const beam = shared?.beam;
    const lightLive = !!(connected && beam && beam.age < 1500 && vela().acesa && shared.online.includes('luz') && performance.now() - lastSnapshot < 1800);
    if (role === 'conhecimento' && !soloProcura()) {
      torch.visible = lightLive && ['iluminar', 'encontrado', 'registrado'].includes(state.stage);
      if (lightLive) { torch.position.copy(deskRoot.localToWorld(new THREE.Vector3(...beam.origin))); torch.target.position.copy(deskRoot.localToWorld(new THREE.Vector3(...beam.target))); beamDirection.subVectors(torch.target.position, torch.position).normalize(); }
    }
    torch.intensity = 4 + (!reduced ? Math.sin(t * 8) * .1 : 0);
    if (modelReady && role === 'conhecimento' && state.stage === 'iluminar' && (!emRA() || raPosta) && !$('instructions').open && !$('fragment').open) {
      scene.updateMatrixWorld(true);
      const normal = new THREE.Vector3(0, -1, 0).applyQuaternion(deskRoot.quaternion);
      const toLabel = target.clone().sub(torch.position); const lightRay = new THREE.Raycaster(torch.position, toLabel.clone().normalize());
      const obstruction = lightRay.intersectObject(desk, true).find(h => h.distance < toLabel.length() - .004);
      const viewToLabel = target.clone().sub(viewerPosition); const viewRay = new THREE.Raycaster(viewerPosition, viewToLabel.clone().normalize());
      const viewBlocked = viewRay.intersectObject(desk, true).some(h => h.distance < viewToLabel.length() - .004);
      const aceso = soloProcura() ? vela().acesa : lightLive;
      const lit = aceso && toLabel.clone().normalize().dot(beamDirection) > Math.cos(torch.angle * .85) && normal.dot(toLabel.clone().normalize()) < -.1 && !obstruction;
      /* Em RA, meio metro: é o braço estendido de quem se abaixou. */
      const near = viewerPosition.distanceTo(target) < (emRA() ? .55 : .4);
      const projected = target.clone().project(activeCamera); const inView = Math.abs(projected.x) < 1 && Math.abs(projected.y) < 1 && projected.z > -1 && projected.z < 1;
      const visible = lit && near && inView && !viewBlocked && normal.dot(viewToLabel.clone().normalize()) < -.2;
      clue.material.opacity = visible ? .95 : 0;
      hold = machine.dwell(hold, visible, dt); $('progress').firstElementChild.style.width = (hold / 1.2 * 100) + '%'; $('progress').setAttribute('aria-valuenow', String(Math.round(hold / 1.2 * 100)));
      if (hold >= 1.2 && !discoverPending && vela().acesa) { discoverPending = true; coop.send('descobrir').catch(() => {}).finally(() => { discoverPending = false; }); }
    }
    if ($('fragment').open && !reduced) { const tilt = $('fragment-card').querySelector('.m3d-card-tilt'); if (tilt) tilt.style.transform = `rotateX(${-pointer.y * 3}deg) rotateY(${pointer.x * 4}deg)`; }
    syncViewOffset(); renderer.render(scene, camera); lastTime = time;
  }
  function disposeObject(root) { const textures = new Set(), materials = new Set(), geometries = new Set(); root.traverse(o => { if (o.geometry) geometries.add(o.geometry); for (const m of o.material ? (Array.isArray(o.material) ? o.material : [o.material]) : []) { materials.add(m); Object.values(m).forEach(v => { if (v && v.isTexture) textures.add(v); }); } }); textures.forEach(x => x.dispose()); materials.forEach(x => x.dispose()); geometries.forEach(x => x.dispose()); }
  function dispose() { if (disposed) return; disposed = true; clearTimeout(noticeTimer); renderer.setAnimationLoop(null); coop?.close(); cleanup.forEach(fn => fn()); ra.sair().catch(() => {}); controls.dispose(); disposeObject(scene); renderer.dispose(); }
  on(window, 'resize', () => { renderer.setSize(innerWidth, innerHeight); if (emRA()) return; camera.aspect = innerWidth / innerHeight; lastViewOffset = null; camera.clearViewOffset(); camera.updateProjectionMatrix(); frameDesk(); });
  on(document, 'visibilitychange', () => { hold = 0; clock.getDelta(); });
  on(window, 'pagehide', e => { if (!e.persisted) dispose(); else { hold = 0; renderer.setAnimationLoop(null); } });
  on(window, 'pageshow', e => { if (e.persisted && !disposed) { clock.getDelta(); renderer.setAnimationLoop(render); } });
  let lastSnapshot = 0;
  /* O tempo acabou: qualquer aparelho avisa; o motor confere o relógio. */
  function conferirPrazo(s) {
    if (!s || !s.prazo || !s.prazo.esgotado || s.velaEsgotada || ['encontrado', 'registrado'].includes(s.stage) || prazoEnviado || !coop) return;
    prazoEnviado = true;
    coop.send('escrivaninha_prazo').catch(() => false).then(ok => { if (!ok) setTimeout(() => { prazoEnviado = false; }, 3000); });
  }
  ACCooperation(snapshot => {
    if (snapshot.soloRole) role = snapshot.soloRole;
    if (snapshot.maquete && !snapshot.maquete.complete && !params.has('rever')) { location.replace('AC-maquete.html' + location.search); return; }
    const previous = state.stage, eraEsgotada = shared && shared.velaEsgotada; shared = snapshot; lastSnapshot = performance.now();
    state = {...state, stage: snapshot.stage, evidence: snapshot.stage === 'registrado' ? ['ac-etiqueta-maquete'] : []};
    if (previous === 'encontrado' && state.stage === 'registrado') notify('Fragmento guardado no dossiê.');
    const other = role === 'luz' ? 'conhecimento' : 'luz';
    if (!solo) { $('coop-status').hidden = snapshot.online.includes(other); $('coop-status').textContent = 'Aguardando seu colega'; }
    pintarParceiro(snapshot.parceiro);
    const agoraVela = snapshot.vela ? String(snapshot.vela.acesa) : null;
    if (velaAntes !== null && agoraVela !== velaAntes) { updateUI(); window.ACJanelas?.vida(); if (snapshot.vela && !snapshot.vela.acesa) { tentativasNaVela = 0; toquesNoEscuro = 0; } }
    velaAntes = agoraVela;
    conferirPrazo(snapshot);
    if (snapshot.velaEsgotada && !eraEsgotada) { notify('O tempo da escrivaninha acabou. A etiqueta apareceu — a vela não pontua.', 9); setTimeout(openFragment, 300); }
    if (previous !== state.stage) { hold = 0; updateUI(); if (role === 'conhecimento' && (state.stage === 'encontrado' || (state.stage === 'registrado' && $('fragment').open))) openFragment(); }
    else { pintarRelogio(); pintarDica(); }
    if (solo && snapshot.maquete?.complete && snapshot.stage === 'registrado') parent.postMessage({mosaico: 'ac-solo-completo', score: snapshot.maquete.score, vela: snapshot.bonus, evidence: snapshot.maquete.evidence}, location.origin);
  }, online => { connected = online; if (!online) { hold = 0; $('coop-status').textContent = 'Reconectando… a luz compartilhada está suspensa.'; } updateUI(); }).then(connection => {
    coop = connection; role = connection.role;
    if (params.get('percurso') === '1') { document.querySelector('.brand').removeAttribute('href'); }
    if (connection.demo) { document.querySelector('.edition').textContent = 'SOLO · COM PARCEIRO'; $('coop-status').hidden = true; }
    if (connection.invite) { $('invite').href = connection.invite; $('invite-wrap').hidden = false; }
    updateUI();
  }).catch(error => { $('coop-status').textContent = error.message; $('loading').textContent = 'A cooperação exige o servidor local da AC.'; $('loading').hidden = false; });
  if (solo) $('coop-status').hidden = true;
  updateUI(); renderer.setAnimationLoop(render);
  /* Ganchos de auditoria (o painel do Claude congela o requestAnimationFrame). */
  window.__escrivaninha = {quadro: () => { forcarQuadro = true; try { render(performance.now(), null); } finally { forcarQuadro = false; } }, estado: () => ({stage: state.stage, role, vela: vela(), exposicao: renderer.toneMappingExposure, chama: flame.visible, ra: ra.estado(), raPosta, fallback}),
    onde: () => { scene.updateMatrixWorld(true); return screenPoint(clue, new THREE.Vector3()); }, ra, camera, deskRoot, clue, usarTela};
})();
