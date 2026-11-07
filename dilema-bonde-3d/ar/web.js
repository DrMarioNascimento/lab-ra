import * as THREE from 'three';
import { criarMaquete } from '../js/cena.js';
import motor from './rastreador.js';

export async function preparar({ informar }) {
  const $ = id => document.getElementById(id), canvas = $('cena');
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true }); }
  catch { throw new Error('O navegador não disponibilizou o contexto 3D.'); }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.xr.enabled = true;
  const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(60, 1, .005, 50);
  scene.add(new THREE.HemisphereLight(0xf2f6ff, 0x6a7a50, 2));
  const sol = new THREE.DirectionalLight(0xfff1dc, 2.6); sol.position.set(-.6, 1.2, .8); scene.add(sol);
  const ancora = new THREE.Group(), base = new THREE.Group();
  base.scale.setScalar(.8 / 160); ancora.add(base); ancora.visible = false; scene.add(ancora);
  let m;
  try { m = await criarMaquete({ grupos: { presetPrincipal: 'trabalhador', nPrincipal: 1, presetRamal: 'desconhecidos', nRamal: 3 }, ra: true, progresso: informar }); }
  catch (error) { renderer.dispose(); throw error; }
  m.root.traverse(o => { if (o.isMesh) { o.castShadow = false; o.receiveShadow = false; } if (o.isLight) o.visible = false; });
  base.add(m.root);
  const status = t => { $('aviso').textContent = t; };
  let colocada = false, reposicionando = false, contando = false, tempo = 10, acum = 0, ultimo = null, entrando = false, trocando = false;
  const bM = $('manter'), bD = $('desviar'), play = $('play'), reset = $('reset'), colocar = $('colocar');
  const sincronizar = () => {
    bM.classList.toggle('ativo', m.rota === 'principal'); bD.classList.toggle('ativo', m.rota === 'ramal');
    bM.disabled = bD.disabled = !colocada || trocando || m.estado.travado;
    play.disabled = !colocada || trocando || contando || m.estado.rodando;
    reset.disabled = !colocada || trocando;
  };
  const escolher = rota => { if (colocada && m.definirRota(rota)) sincronizar(); };
  bM.onclick = () => escolher('principal'); bD.onclick = () => escolher('ramal');
  play.onclick = () => { if (!play.disabled) { contando = true; sincronizar(); status('O bonde vai partir. Decida antes da agulha.'); } };
  function reiniciar() {
    m.reiniciar();
    tempo = 10; acum = 0; contando = false; $('crono').textContent = '10'; sincronizar();
  }
  reset.onclick = async () => {
    if (trocando) return;
    reiniciar(); trocando = true; sincronizar(); status('Preparando nova rodada…');
    try { await m.sortearPersonagens(); status('Nova rodada. Escolha o trilho e toque em Partir.'); }
    catch { status('Não foi possível trocar os personagens. A rodada anterior continua disponível.'); }
    finally { trocando = false; sincronizar(); }
  };
  m.estado.aoImpacto = r => status(r === 'principal' ? 'O bonde seguiu pelo trilho principal.' : 'O bonde foi desviado para o ramal.');
  m.estado.aoFim = () => status('O bonde voltou à estação. Toque em Reiniciar para uma nova rodada.');
  const ray = new THREE.Raycaster(), pt = new THREE.Vector2();
  const ra = motor.criar({ renderer, camera, cena: scene, altura: 1.2, desenhar,
    aoTocar(x, y) {
      if (!colocada || reposicionando) { posicionar(); return; }
      const r = canvas.getBoundingClientRect();
      pt.set((x-r.left)/r.width*2-1, 1-(y-r.top)/r.height*2);
      ray.setFromCamera(pt, ra.cameraAtiva());
      if (ray.intersectObject(m.alvoToque, false).length && m.alternarAlavanca()) sincronizar();
    },
    aoMudar(e) { if (!e.ativo && !entrando) voltar(); }
  });
  // Consultado durante o preparo: a sessão é pedida sem await no próximo toque.
  const suporte = await ra.suporte();
  if (!suporte.webxr && !suporte.slam) {
    renderer.dispose(); throw new Error('Este aparelho não oferece rastreamento de realidade aumentada.');
  }
  function redimensionar() {
    if (renderer.xr.isPresenting) return;
    renderer.setSize(innerWidth, innerHeight, false);
    camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
  }
  addEventListener('resize', redimensionar); redimensionar();
  function posicionar() {
    if (!ra.ativo() || !ra.estado().temMira) return;
    const pose = ra.pose(); ancora.position.setFromMatrixPosition(pose); ancora.quaternion.setFromRotationMatrix(pose);
    ancora.visible = true; colocada = true; reposicionando = false;
    colocar.textContent = 'Recolocar'; colocar.disabled = false;
    status('Escolha o trilho e toque em Partir.'); sincronizar();
  }
  colocar.onclick = () => {
    if (!colocada || reposicionando) posicionar();
    else { reposicionando = true; colocar.textContent = 'Colocar aqui'; status('Aponte para a nova superfície e toque em Colocar aqui.'); }
  };
  let toque = null;
  canvas.addEventListener('pointerdown', e => { toque = [e.clientX,e.clientY]; });
  canvas.addEventListener('pointerup', e => {
    if (ra.estado().modo !== 'slam' || !toque) return;
    if (Math.hypot(e.clientX-toque[0],e.clientY-toque[1]) < 10 && (!colocada || reposicionando)) posicionar();
    toque = null;
  });
  canvas.addEventListener('pointercancel', () => { toque = null; });
  // Tocar um controle HTML não deve também disparar a seleção XR da alavanca.
  $('overlay').addEventListener('beforexrselect', e => { if (e.target.closest('button')) e.preventDefault(); });
  function desenhar(t, frame) {
    if (!ra.ativo()) return;
    const dt = ultimo === null ? 0 : Math.min(.05, (t-ultimo)/1000); ultimo = t;
    ra.quadro(frame); ra.mostrarMira(!colocada || reposicionando);
    if (!colocada || reposicionando) colocar.disabled = !ra.estado().temMira;
    if (colocada && !reposicionando) {
      if (contando) { acum += dt; while (acum >= 1 && contando) { acum--; tempo--; $('crono').textContent = String(Math.max(0,tempo)); if (tempo <= 0) { contando = false; m.partir(); } } }
      m.update(dt); sincronizar();
    }
    renderer.render(scene,camera);
  }
  function voltar() {
    renderer.setAnimationLoop(null); canvas.hidden = true; $('overlay').hidden = true; $('inicio').hidden = false;
    ancora.visible = false; colocada = false; reposicionando = false; ultimo = null; reiniciar();
    $('comecar').disabled = false; redimensionar();
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
  }
  async function sair() { await ra.sair(); voltar(); }
  $('sair').onclick = sair;
  addEventListener('pagehide', () => { ra.sair(); renderer.setAnimationLoop(null); });
  canvas.addEventListener('webglcontextlost', e => { e.preventDefault(); sair(); informar('O contexto 3D foi interrompido. Recarregue a página para preparar a RA novamente.'); $('comecar').disabled = true; });
  return {
    async entrar() {
      entrando = true; canvas.hidden = false; $('overlay').hidden = false; $('inicio').hidden = true;
      redimensionar(); renderer.setClearColor(0x000000,0); ultimo = null;
      status('Abrindo a câmera…');
      try {
        // No modo web, a tela cheia precisa ser solicitada no gesto, sem aguardar a câmera.
        if (!suporte.webxr && document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().catch(() => {});
        await ra.entrar(suporte);
        renderer.setClearColor(0x000000,0); colocar.style.display = 'block'; colocar.textContent = 'Colocar aqui';
        status('Mova o celular devagar. Quando a mira aparecer, toque em Colocar aqui.');
        if (ra.estado().modo === 'webxr') renderer.setAnimationLoop(desenhar);
      } catch (error) { await ra.sair(); voltar(); throw error; }
      finally { entrando = false; }
    }
  };
}
