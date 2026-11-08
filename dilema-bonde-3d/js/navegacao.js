import * as THREE from 'three';

// Apenas o visualizador 3D de tela usa este painel. Não controla a câmera da RA.
export function criarNavegacao({camera,controls,canvas,maquete,documento=document,janela=window}) {
  const painel=documento.getElementById('navegacao');
  let modo='girar';
  controls.enableDamping=true;controls.dampingFactor=.10;
  controls.zoomSpeed=.85;controls.panSpeed=.85;
  controls.minDistance=4;controls.maxDistance=300;
  controls.maxPolarAngle=Math.PI*.485;controls.screenSpacePanning=false;
  controls.zoomToCursor=true;
  canvas.tabIndex=0;canvas.setAttribute('aria-label','Maquete 3D. Arraste para girar, use a roda para ampliar e as setas para mover. R restaura a visão geral.');
  function assentar() { const d=controls.enableDamping;controls.enableDamping=false;controls.update();controls.enableDamping=d; }
  function zoom(fator) {
    assentar();const delta=camera.position.clone().sub(controls.target);
    delta.setLength(THREE.MathUtils.clamp(delta.length()*fator,controls.minDistance,controls.maxDistance));
    camera.position.copy(controls.target).add(delta);controls.update();
  }
  function mover(x,z) {
    assentar();const frente=controls.target.clone().sub(camera.position);frente.y=0;
    if(frente.lengthSq()<.001)frente.set(0,0,-1);frente.normalize();
    const direita=new THREE.Vector3().crossVectors(frente,new THREE.Vector3(0,1,0));
    const passo=camera.position.distanceTo(controls.target)*.075;
    const delta=direita.multiplyScalar(x*passo).addScaledVector(frente,z*passo);
    camera.position.add(delta);controls.target.add(delta);controls.update();
  }
  function focar(nome) {
    assentar();
    if(nome==='geral') { camera.position.set(0,100,150);controls.target.set(0,0,8);documento.getElementById('vista').value='geral'; }
    else if(nome==='cima') { camera.position.set(0,180,8.1);controls.target.set(0,0,8); }
    else {
      const objeto=maquete.focos[nome];if(!objeto)return;
      const b=new THREE.Box3().setFromObject(objeto,true),centro=b.getCenter(new THREE.Vector3()),tam=b.getSize(new THREE.Vector3());
      const raio=Math.max(tam.x,tam.y,tam.z)*.5;
      const fovV=camera.fov*Math.PI/180, fovH=2*Math.atan(Math.tan(fovV/2)*camera.aspect);
      const dist=THREE.MathUtils.clamp(raio/Math.sin(Math.min(fovH,fovV)/2)*1.18,controls.minDistance,controls.maxDistance);
      const direcao=new THREE.Vector3(.15,.35,1).normalize();
      controls.target.copy(centro);camera.position.copy(centro).addScaledVector(direcao,dist);
    }
    controls.update();
  }
  function definirModo(novo) {
    modo=novo;controls.mouseButtons.LEFT=modo==='mover'?THREE.MOUSE.PAN:THREE.MOUSE.ROTATE;
    canvas.style.cursor=modo==='mover'?'grab':'default';
    painel.querySelectorAll('[data-modo]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.modo===modo)));
    documento.getElementById('dicaNavegacao').textContent=modo==='mover'?'Arraste para deslocar a vista.':'Arraste para girar a maquete.';
  }
  painel.querySelectorAll('[data-modo]').forEach(b=>b.onclick=()=>definirModo(b.dataset.modo));
  painel.querySelectorAll('[data-zoom]').forEach(b=>b.onclick=()=>zoom(Number(b.dataset.zoom)));
  painel.querySelectorAll('[data-mover]').forEach(b=>b.onclick=()=>mover(...b.dataset.mover.split(',').map(Number)));
  documento.getElementById('vista').onchange=e=>focar(e.target.value);
  documento.getElementById('visaoGeral').onclick=()=>{focar('geral');documento.getElementById('vista').value='geral';};
  const teclado=e=>{
    if(e.ctrlKey||e.metaKey||e.altKey||e.isComposing||e.target.closest('input,textarea,select,[role="dialog"],[contenteditable="true"]'))return;
    const a={ArrowLeft:()=>mover(-1,0),ArrowRight:()=>mover(1,0),ArrowUp:()=>mover(0,1),ArrowDown:()=>mover(0,-1),'+':()=>zoom(.8),'=':()=>zoom(.8),'-':()=>zoom(1.25),'r':()=>focar('geral'),'R':()=>focar('geral')}[e.key];
    if(a){e.preventDefault();a();}
  };
  janela.addEventListener('keydown',teclado);
  definirModo('girar');
  return {zoom,mover,focar,definirModo,podeSelecionar:()=>modo==='girar',desligar:()=>janela.removeEventListener('keydown',teclado)};
}
