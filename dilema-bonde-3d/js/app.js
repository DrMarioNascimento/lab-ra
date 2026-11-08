import {grupos} from './configuracao.js?v=20261107-ra12';
import {PERFIS,qualidadeDoAparelho,adaptarResolucao} from './qualidade.js?v=20261107-ra12';
import {ligarInterface} from './interface.js?v=20261107-ra12';
import {criarRotulos} from './rotulos.js?v=20261107-ra12';

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { criarMaquete } from './cena.js?v=20261108-ra13';
import { criarNavegacao } from './navegacao.js?v=20261107-ra12';

export async function iniciar(config) {
const qualidade=qualidadeDoAparelho(config.qualidade), perfil=PERFIS[qualidade];
const canvas = document.getElementById('cena');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: qualidade!=='economica', preserveDrawingBuffer: !!window.__captura });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, perfil.pixelRatio));
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
renderer.shadowMap.enabled = qualidade==='detalhada' && !new URLSearchParams(location.search).has('leve'); renderer.shadowMap.type = THREE.PCFSoftShadowMap;
const scene = new THREE.Scene(); scene.background = new THREE.Color(0xc9d3e0);
scene.environment = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(), 0.04).texture;
scene.add(new THREE.HemisphereLight(0xf2f6ff, 0x5a6a40, 0.7));
const sol = new THREE.DirectionalLight(0xfff1dc, 2.4); sol.position.set(-40, 70, 50); sol.castShadow = true;
sol.shadow.mapSize.set(2048, 2048); Object.assign(sol.shadow.camera, { left: -85, right: 85, top: 60, bottom: -60, near: 10, far: 220 }); sol.shadow.bias = -0.0004; sol.shadow.normalBias = 0.04;
scene.add(sol);

const camera = new THREE.PerspectiveCamera(32, 1, 0.5, 600);
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true; controls.maxPolarAngle = Math.PI * 0.47; controls.minDistance = 12; controls.maxDistance = 260; controls.target.set(0, 0, 4);
const VISTAS = { geral: [0, 100, 150, 0, 0, 8] };
const qs = new URLSearchParams(location.search);
const v = (qs.get('cam') || '').split(',').map(Number);
const vista = v.length === 6 && v.every(n => !isNaN(n)) ? v : VISTAS.geral;
camera.position.set(vista[0], vista[1], vista[2]); controls.target.set(vista[3], vista[4], vista[5]);

function redimensionar() { const w = innerWidth, h = innerHeight; renderer.setSize(w, h, false); camera.aspect = w / h;camera.fov=THREE.MathUtils.radToDeg(2*Math.atan(Math.tan(THREE.MathUtils.degToRad(40)/2)*Math.max(1,1.6/camera.aspect))); camera.updateProjectionMatrix(); }
addEventListener('resize', redimensionar); redimensionar();

const m = await criarMaquete({ qualidade, grupos: grupos(config), progresso:t=>document.getElementById('estadoCarga').textContent=t });
scene.add(m.root);
const navegacao = criarNavegacao({camera,controls,canvas,maquete:m});
document.getElementById('carregando').remove();


const rotulos=criarRotulos(m);rotulos.atualizar(config);
const ui=ligarInterface({m,config,status:t=>document.getElementById('aviso').textContent=t,aoMenu:aberta=>{controls.enabled=!aberta;},aoConfig:c=>rotulos.atualizar(c)});
document.getElementById('navegacao').hidden=false;ui.menu.controles.append(document.getElementById('navegacao'));
const extras=document.createElement('p');extras.innerHTML='<button id="tela" type="button">Tela cheia</button> <a href="ar/">Abrir em realidade aumentada</a>';ui.menu.controles.append(extras);
document.getElementById('tela').onclick=()=>{const el=document.documentElement;if(!document.fullscreenElement)el.requestFullscreen?.().catch(()=>{});else document.exitFullscreen?.().catch(()=>{});};
const ray=new THREE.Raycaster(),ptr=new THREE.Vector2();let toque0=null;
canvas.addEventListener('pointerdown',e=>{toque0=!ui.menu.aberta()&&e.button===0&&navegacao.podeSelecionar()?[e.clientX,e.clientY]:null;});
canvas.addEventListener('pointerup',e=>{
  if(!toque0||Math.hypot(e.clientX-toque0[0],e.clientY-toque0[1])>8)return;toque0=null;
  ptr.set(e.clientX/innerWidth*2-1,1-e.clientY/innerHeight*2);ray.setFromCamera(ptr,camera);
  const placa=ray.intersectObjects(m.alvosMenu,false)[0];if(placa){ui.menu.abrir(placa.object.userData.secaoMenu);return;}
  if(ray.intersectObject(m.alvoToque,false).length)ui.escolher(m.rota==='principal'?'ramal':'principal');
});
const relogio=new THREE.Clock();
const adaptar=adaptarResolucao({automatica:config.qualidade==='auto',renderer,perfil});
document.addEventListener('visibilitychange',()=>ui.rodada.bloquear('oculta',document.hidden));
renderer.setAnimationLoop(()=>{const dt=Math.min(.05,relogio.getDelta());ui.rodada.atualizar(dt);controls.update();renderer.render(scene,camera);adaptar(!document.hidden&&!ui.menu.aberta());});
window.__maquete=m;window.__pronto=true;
// Diagnóstico local usado pela auditoria de navegação e interface.
if(new URLSearchParams(location.search).has('auditoria'))window.__testePC={camera,controls,navegacao,m,ui,renderer,scene,rotulos};
}
