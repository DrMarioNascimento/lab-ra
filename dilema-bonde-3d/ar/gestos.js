import * as THREE from 'three';

// A transformação atua na âncora, preservando o movimento do bonde e dos personagens.
export function ligarGestos({ elemento, alvo, camera, podeMover, aoToque, aoAlterar = () => {} }) {
  const dedos = new Map(), raio = new THREE.Raycaster(), ndc = new THREE.Vector2();
  let inicio = null, consumido = false;
  function amostra() {
    const [a, b] = [...dedos.values()];
    return b ? { x: (a.x+b.x)/2, y: (a.y+b.y)/2, d: Math.hypot(b.x-a.x,b.y-a.y), ang: Math.atan2(b.y-a.y,b.x-a.x) }
      : { ...a, d: 0, ang: 0 };
  }
  function ponto(p, plano) {
    const r = elemento.getBoundingClientRect();
    if (!r.width || !r.height) return null;
    ndc.set((p.x-r.left)/r.width*2-1, 1-(p.y-r.top)/r.height*2);
    raio.setFromCamera(ndc, camera());
    // Próximo ao horizonte, uma interseção instável não deve arremessar a maquete.
    if (Math.abs(raio.ray.direction.dot(plano.normal)) < .025) return null;
    return raio.ray.intersectPlane(plano, new THREE.Vector3());
  }
  function rebase() {
    inicio = null;
    if (!dedos.size || !podeMover()) return;
    const normal = new THREE.Vector3(0,1,0).applyQuaternion(alvo.quaternion);
    const plano = new THREE.Plane().setFromNormalAndCoplanarPoint(normal, alvo.position);
    const p = amostra();
    inicio = { ...p, plano, normal, ultimo: p, q: alvo.quaternion.clone(), escala: alvo.scale.x };
  }
  function tamanho(valor) {
    if (!Number.isFinite(valor) || valor <= 0) return;
    // Só proteções numéricas: de 8 mm a 80 m de largura para a maquete inicial.
    alvo.scale.setScalar(Math.max(.01, Math.min(100, valor)));
    aoAlterar(alvo.scale.x);
  }
  elemento.addEventListener('pointerdown', e => {
    if (e.button !== undefined && e.button !== 0) return;
    if (!dedos.size) consumido = false;
    dedos.set(e.pointerId,{x:e.clientX,y:e.clientY,origX:e.clientX,origY:e.clientY});
    if (dedos.size > 1) consumido = true;
    elemento.setPointerCapture?.(e.pointerId); rebase();
  });
  elemento.addEventListener('pointermove', e => {
    const anterior = dedos.get(e.pointerId); if (!anterior) return;
    dedos.set(e.pointerId,{...anterior,x:e.clientX,y:e.clientY});
    if (Math.hypot(e.clientX-anterior.origX,e.clientY-anterior.origY) > 8) consumido = true;
    if (!inicio || !podeMover() || !consumido) return;
    const p = amostra();
    // Os dois raios usam a MESMA pose atual da câmera. Só o deslocamento do
    // dedo move a âncora; aproximar o celular com um dedo parado não a arrasta.
    const anteriorNoPlano = ponto(inicio.ultimo,inicio.plano), atual = ponto(p,inicio.plano);
    if (anteriorNoPlano && atual) alvo.position.add(atual.sub(anteriorNoPlano));
    inicio.ultimo = p;
    if (dedos.size >= 2 && inicio.d > 8) {
      tamanho(inicio.escala * p.d / inicio.d);
      const delta = Math.atan2(Math.sin(p.ang-inicio.ang),Math.cos(p.ang-inicio.ang));
      alvo.quaternion.copy(inicio.q).premultiply(new THREE.Quaternion().setFromAxisAngle(inicio.normal,-delta));
    }
  });
  function soltar(e,cancelado) {
    if (!dedos.has(e.pointerId)) return;
    const ultimo = dedos.size === 1, foiToque = ultimo && !consumido && !cancelado;
    dedos.delete(e.pointerId);
    if (cancelado) consumido = true;
    if (elemento.hasPointerCapture?.(e.pointerId)) elemento.releasePointerCapture(e.pointerId);
    rebase();
    if (foiToque) aoToque(e.clientX,e.clientY);
  }
  elemento.addEventListener('pointerup',e=>soltar(e,false));
  elemento.addEventListener('pointercancel',e=>soltar(e,true));
  elemento.addEventListener('lostpointercapture',e=>soltar(e,true));
  elemento.addEventListener('wheel', e => {
    if (!podeMover()) return;
    e.preventDefault(); tamanho(alvo.scale.x * Math.exp(-e.deltaY*.001)); rebase();
  }, { passive: false });
  // O DOM já recebe pointerup: impedir uma segunda ação do mesmo toque via XR select.
  elemento.addEventListener('beforexrselect',e=>e.preventDefault());
  return {
    ocupado: () => dedos.size > 0,
    limpar() { dedos.clear(); inicio = null; consumido = false; },
    ampliar(fator) { if (podeMover()) { tamanho(alvo.scale.x*fator); rebase(); } },
    restaurarTamanho() { if (podeMover()) { tamanho(1); rebase(); } },
  };
}
