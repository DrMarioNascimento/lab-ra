const url = '../museu/torre/vendor/three.module.min.js';

export async function montarCena(host, tipo, acao, estado) {
  const T = await import(url);
  if (!host.isConnected) return () => {};
  const r = new T.WebGLRenderer({antialias:true,alpha:true});
  r.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  r.outputColorSpace = T.SRGBColorSpace;
  host.replaceChildren(r.domElement);
  r.domElement.setAttribute('aria-hidden','true');
  const scene = new T.Scene();
  const c = new T.PerspectiveCamera(37,1,0.1,30);
  c.position.set(0,2.4,5.7);
  c.lookAt(0,0,0);
  scene.add(new T.AmbientLight(0xffdec0,1.2));
  const luz = new T.DirectionalLight(0xffcf9d,3);
  luz.position.set(3,5,4);
  scene.add(luz);
  const o = new T.Group();
  o.rotation.set(-0.12,-0.38,0);
  scene.add(o);
  const meshes = [], recursos = [];
  function bloco(l,a,p,cor,x,y,z,id) {
    const geo = new T.BoxGeometry(l,a,p), mat = new T.MeshStandardMaterial({color:cor,roughness:.45,metalness:tipo === 'luz' ? 0.05 : .25});
    const m = new T.Mesh(geo,mat);
    m.position.set(x,y,z);
    if (id) { m.userData.acao = id; meshes.push(m); }
    o.add(m); recursos.push(geo,mat);
    return m;
  }
  let faixa, fundo, tampa, sela;
  if (tipo === 'caixa') {
    bloco(2.22,0.15,1.55,0x573423,0,-.46,0);
    bloco(.15,.87,1.55,0x70472c,-1.04,0,0);
    bloco(.15,.87,1.55,0x70472c,1.04,0,0);
    bloco(2,.87,.13,0x66422c,0,0,-.66);
    bloco(2,.87,.13,0x866045,0,0,.66);
    faixa = bloco(.66,.22,.045,0xcf9857,-.62,.05,.74,'faixa');
    fundo = bloco(.7,.22,.045,0xae7749,.4,-.2,-.74,'fundo');
    tampa = bloco(2.25,.16,1.56,0x8c623d,0,.48,0,'tampa');
    for (let i = 0; i < 4; i++) {
      bloco(.25,.012,.65,i % 2 ? 0x453020 : 0xc28b52,(i-1.5)*.28,.565,0);
    }
    const chave = bloco(.64,.09,.16,0xdfb955,0,-.29,0);
    chave.rotation.y = -.32;
  } else if (tipo === 'luz') {
    bloco(2.1,1.5,.17,0x9d7040,0,0,0,'girar');
    bloco(1.82,1.23,.02,0x2e4a51,0,0,.1,'girar');
    sela = bloco(.24,.19,.03,0xa68452,.68,-.44,.14,'girar');
    bloco(1.28,.1,.025,0x987254,0,-.29,.13);
    bloco(.3,.13,.025,0xc4a16f,-.28,.16,.13);
  } else {
    bloco(2.25,1.28,.42,0x334c51,0,0,0);
    bloco(1.95,.16,.51,0x98794b,0,-.64,0);
    for (let i=0;i<3;i++) bloco(.38,.36,.16,[0xaa794c,0x94a6a0,0xb79b61][i],(i-1)*.62,.16,.25,String(i));
  }
  const ray = new T.Raycaster();
  let arraste = null;
  const draw = () => {
    const w = host.clientWidth || 300, h = host.clientHeight || 195;
    r.setSize(w,h);
    c.aspect=w/h;c.updateProjectionMatrix();
    const passo = estado();
    if (faixa) { faixa.position.x = -.62 + (passo >= 1 ? .53 : 0); fundo.position.x = .4 - (passo >= 2 ? .43 : 0); tampa.position.z = passo >= 3 ? -.46 : 0; tampa.position.y = passo >= 3 ? 1.32 : .48; tampa.rotation.x = passo >= 3 ? -0.8 : 0; }
    if (sela) { luz.position.x = (passo-2.5)*2; sela.material.emissive.setHex(passo === 4 ? 0x654423 : 0x0c0e0b); }
    r.render(scene,c);
  };
  function pick(e) {
    const rect = r.domElement.getBoundingClientRect();
    ray.setFromCamera(new T.Vector2((e.clientX-rect.left)/rect.width*2-1,1-(e.clientY-rect.top)/rect.height*2),c);
    return ray.intersectObjects(meshes,false)[0]?.object.userData.acao;
  }
  r.domElement.onpointerdown = e => {arraste={x:e.clientX,y:e.clientY,id:pick(e)};r.domElement.setPointerCapture?.(e.pointerId);};
  r.domElement.onpointermove = e => {
    if (!arraste) return;
    if (tipo === 'caixa' && arraste.id && arraste.id !== 'tampa') return;
    o.rotation.y += (e.movementX || 0)*.012;
    o.rotation.x += (e.movementY || 0)*.006;
    draw();
  };
  r.domElement.onpointerup = e => {
    if (!arraste) return;
    if (arraste.id && (tipo === 'caixa' || Math.hypot(e.clientX-arraste.x,e.clientY-arraste.y)<12)) acao(arraste.id);
    arraste=null; draw();
  };
  r.domElement.onpointercancel = () => {arraste=null;};
  const onChange = () => draw();
  host.addEventListener('cena',onChange);
  const resize = new ResizeObserver(draw);
  resize.observe(host); draw();
  return () => {
    resize.disconnect(); host.removeEventListener('cena',onChange);
    for(const item of recursos) item.dispose();
    r.dispose(); r.domElement.remove();
  };
}
