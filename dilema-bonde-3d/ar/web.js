import * as THREE from 'three';
import { criarMaquete } from '../js/cena.js?v=20261107-ra12';
import motor from './rastreador.js?v=20261107-ra12';
import { ligarGestos } from './gestos.js?v=20261107-ra12';
import { criarAvisos } from './avisos.js?v=20261107-ra4';

import {lerConfig,grupos} from '../js/configuracao.js?v=20261107-ra12';
import {PERFIS,qualidadeDoAparelho,adaptarResolucao} from '../js/qualidade.js?v=20261107-ra12';
import {ligarInterface} from '../js/interface.js?v=20261107-ra12';
import {criarRotulos} from '../js/rotulos.js?v=20261107-ra12';

export async function preparar({ informar, config=lerConfig() }) {
  const qualidade=qualidadeDoAparelho(config.qualidade),perfil=PERFIS[qualidade];
  const $ = id => document.getElementById(id), canvas = $('cena');
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: qualidade!=='economica', alpha: true }); }
  catch { throw new Error('O navegador não disponibilizou o contexto 3D.'); }
  renderer.setPixelRatio(Math.min(devicePixelRatio, perfil.pixelRatio));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.xr.enabled = true;
  renderer.xr.setFramebufferScaleFactor(perfil.framebuffer);
  const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(60, 1, .001, 200);
  scene.add(new THREE.HemisphereLight(0xf2f6ff, 0x6a7a50, 2));
  const sol = new THREE.DirectionalLight(0xfff1dc, 2.6); sol.position.set(-.6, 1.2, .8); scene.add(sol);
  const ancora = new THREE.Group(), base = new THREE.Group();
  base.scale.setScalar(.8 / 160); ancora.add(base); ancora.visible = false; scene.add(ancora);
  let m;
  try { m = await criarMaquete({ qualidade, grupos: grupos(config), ra: true, progresso: informar }); }
  catch (error) { renderer.dispose(); throw error; }
  m.root.traverse(o => { if (o.isMesh) { o.castShadow = false; o.receiveShadow = false; } if (o.isLight) o.visible = false; });
  base.add(m.root);
  const avisos = criarAvisos($('aviso'));
  const status = (t,opcoes) => avisos.mostrar(t,opcoes);
  const rotulos=criarRotulos(m);rotulos.atualizar(config);
  let novaPendente=false;
  let colocada=false,reposicionando=false,ultimo=null,entrando=false,rastreioPerdido=false;
  let ui;
  const colocar=$('colocar');
  const sincronizar=()=>{
    if(!ui)return;
    const pronto=ra.estado().pronto;
    ui.rodada.bloquear('rastreio',!colocada||!pronto||reposicionando);
    for(const id of ['diminuir','aumentar','tamanho'])$(id).disabled=!colocada||!pronto||reposicionando;
  };
  const reiniciar=()=>{ui.rodada.reiniciar();ui.menu.limparResultado();};
  const ray = new THREE.Raycaster(), pt = new THREE.Vector2();
  function tocar(x, y) {
      if (!ra.estado().pronto || ui?.menu.aberta()) return;
      if (!colocada || reposicionando) { posicionar(); return; }
      const r = canvas.getBoundingClientRect();
      pt.set((x-r.left)/r.width*2-1, 1-(y-r.top)/r.height*2);
      ray.setFromCamera(pt, ra.cameraAtiva());
      const placa=ray.intersectObjects(m.alvosMenu,false)[0];
      if(placa){ui.menu.abrir(placa.object.userData.secaoMenu);return;}
      if(ray.intersectObject(m.alvoToque,false).length)ui.escolher(m.rota==='principal'?'ramal':'principal');
  }
  const ra = motor.criar({ renderer, camera, cena: scene, altura: 1.2, pixelRatioCamera:perfil.pixelRatio, desenhar,
    aoTocar(x,y) { if (!gestos.ocupado()) tocar(x,y); },
    aoMudar(e) { if (!e.ativo && !entrando) voltar(); }
  });
  const gestos = ligarGestos({ elemento: canvas, alvo: ancora, camera: () => ra.cameraAtiva(),
    podeMover: () => !ui?.menu.aberta() && ra.ativo() && ra.estado().pronto && colocada && !reposicionando, aoToque: tocar,
    podeAjustar:()=>ra.ativo()&&ra.estado().pronto&&colocada&&!reposicionando,
    aoAlterar: escala => { $('tamanho').textContent = Math.round(escala*100) + '%'; }
  });
  ui=ligarInterface({m,config,pai:$('overlay'),modo:'ra',status,aoMenu:()=>gestos.limpar(),aoConfig:c=>rotulos.atualizar(c)});
  const ajustes=$('ajustes');ajustes.hidden=false;ui.menu.controles.append(ajustes);sincronizar();
  const adaptar=adaptarResolucao({automatica:config.qualidade==='auto',renderer,perfil});
  $('diminuir').onclick = () => gestos.ampliar(1/1.2);
  $('aumentar').onclick = () => gestos.ampliar(1.2);
  $('tamanho').onclick = () => gestos.restaurarTamanho();
  $('ajudaRA').onclick = () => {
    ui.menu.fechar();
    status(colocada && !reposicionando ? 'Aproxime o celular para ver de perto. Arraste para mover; use dois dedos para ampliar e girar.' : 'Mova o celular um pouco para os lados, apontando para a mesa. Quando a mira aparecer, toque em Colocar aqui.', {duracao:8000});
  };
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
    colocar.textContent = 'Recolocar'; colocar.disabled = false;ui.menu.controles.append(colocar);
    ui.menu.fechar();
    status('Arraste para mover. Use dois dedos para ampliar e girar.',{duracao:4500}); sincronizar();
  }
  colocar.onclick = () => {
    if (!colocada || reposicionando) posicionar();
    else { reposicionando = true; $('overlay').append(colocar);ui.menu.fechar(); gestos.limpar(); sincronizar(); colocar.textContent = 'Colocar aqui'; status('Aponte para a nova superfície e toque em Colocar aqui.',{persistente:true}); }
  };
  // Tocar um controle HTML não deve também disparar a seleção XR da alavanca.
  $('overlay').addEventListener('beforexrselect', e => { if (e.target.closest('button,summary,input,select,.menu-fundo,#ajustes')) e.preventDefault(); });
  function desenhar(t, frame) {
    if (!ra.ativo()) return;
    const dt = ultimo === null ? 0 : Math.min(.05, (t-ultimo)/1000); ultimo = t;
    ra.quadro(frame); ra.mostrarMira(!colocada || reposicionando);
    const pronto = ra.estado().pronto;
    if (colocada) {
      ancora.visible = pronto;
      if (!pronto && !rastreioPerdido) {
        rastreioPerdido = true; gestos.limpar();
        status('Rastreamento interrompido. Aponte novamente para a mesma superfície e mova o celular devagar.',{persistente:true});
      } else if (pronto && rastreioPerdido) {
        rastreioPerdido = false;
        status('Rastreamento recuperado. A maquete permanece no lugar.');
      }
    }
    if (!colocada || reposicionando) colocar.disabled = !ra.estado().temMira;
    sincronizar();
    ui.rodada.atualizar(dt);
    renderer.render(scene,camera);adaptar(!ui.menu.aberta());
  }
  function voltar() {
    if(colocada)novaPendente=true;
    $('overlay').append(colocar);renderer.setAnimationLoop(null); canvas.hidden = true; $('overlay').hidden = true; $('inicio').hidden = false;
    gestos.limpar(); ancora.scale.setScalar(1); $('tamanho').textContent = '100%';
    avisos.ocultar(); ui.menu.fechar();
    ancora.visible = false; colocada = false; reposicionando = false; rastreioPerdido = false; ultimo = null; reiniciar();
    $('comecar').disabled = false;if(novaPendente)$('comecar').textContent='Preparar nova rodada';redimensionar();
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
  }
  async function sair() { await ra.sair(); voltar(); }
  $('sair').onclick = sair;
  addEventListener('pagehide', () => { avisos.ocultar(); ra.sair(); renderer.setAnimationLoop(null); });
  canvas.addEventListener('webglcontextlost', e => { e.preventDefault(); sair(); informar('O contexto 3D foi interrompido. Recarregue a página para preparar a RA novamente.'); $('comecar').disabled = true; });
  if(new URLSearchParams(location.search).has('auditoria'))window.__testeRA={ui,m,ancora,ra,renderer,camera,rotulos};
  return {
    qualidade:config.qualidade,
    precisaNova:()=>novaPendente,
    configAtual:()=>ui.rodada.config(),
    async prepararNova(c){await ui.rodada.nova(c);ui.menu.limparResultado();rotulos.atualizar(c);novaPendente=false;},
    async entrar() {
      entrando = true; canvas.hidden = false; $('overlay').hidden = false; $('inicio').hidden = true;
      redimensionar(); renderer.setClearColor(0x000000,0); ultimo = null;
      ui.menu.fechar();
      status('Abrindo a câmera…',{persistente:true});
      try {
        // No modo web, a tela cheia precisa ser solicitada no gesto, sem aguardar a câmera.
        if (!suporte.webxr && document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().catch(() => {});
        await ra.entrar(suporte);
        renderer.setClearColor(0x000000,0); colocar.style.display = 'block'; colocar.textContent = 'Colocar aqui';
        status('Mova o celular um pouco para os lados, apontando para a mesa. Quando a mira aparecer, toque em Colocar aqui.',{persistente:true});
        if (ra.estado().modo === 'webxr') renderer.setAnimationLoop(desenhar);
      } catch (error) { await ra.sair(); voltar(); throw error; }
      finally { entrando = false; }
    }
  };
}
