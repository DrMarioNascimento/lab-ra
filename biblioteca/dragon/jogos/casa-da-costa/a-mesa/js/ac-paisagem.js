/* MOSAICO · paisagem da abertura — a casa vista da costa, à noite. */
(function (global) {
  'use strict';
  const AQUI = new URL('.', document.currentScript.src);
  const url = (p) => new URL(p, AQUI).href;
  const THREE_SRC = url('three.min.js');
  const LOADER_SRC = url('vendor/GLTFLoader.js');
  const CONTROLS_SRC = url('vendor/OrbitControls.js');
  const PORTA = /porta|portao|portão/i;
  const CASA = /^casa-da-costa$|^portada$/i;
  let disposed = false;
  let renderer, scene, camera, controls, raf, root, hint;
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      if (src.indexOf('three.min') >= 0 && global.THREE && global.THREE.WebGLRenderer) { resolve(); return; }
      if (src.indexOf('GLTFLoader') >= 0 && global.THREE && global.THREE.GLTFLoader) { resolve(); return; }
      if (src.indexOf('OrbitControls') >= 0 && global.THREE && global.THREE.OrbitControls) { resolve(); return; }
      const s = document.createElement('script');
      s.src = src;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error('falha ' + src));
      document.head.appendChild(s);
    });
  }
  function cadeia(obj) {
    const parts = [];
    let o = obj;
    while (o) { if (o.name) parts.push(o.name); o = o.parent; }
    return parts.join(' ');
  }
  function ePorta(obj) { return PORTA.test(cadeia(obj)); }
  function achar(root, teste) {
    let hit = null;
    root.traverse((o) => { if (!hit && o.name && teste.test(o.name)) hit = o; });
    return hit;
  }
  function encostar(onPorta) {
    if (disposed || typeof onPorta !== 'function') return;
    onPorta();
  }
  function montar(palco, opts) {
    opts = opts || {};
    disposed = false;
    const tela = document.createElement('div');
    tela.id = 'abPaisagem';
    tela.setAttribute('aria-label', 'A Casa da Costa à noite');
    palco.insertBefore(tela, palco.firstChild);
    hint = document.createElement('button');
    hint.type = 'button';
    hint.id = 'abEntrarPorta';
    hint.hidden = true;
    hint.textContent = 'Toque na porta para entrar';
    palco.appendChild(hint);
    hint.addEventListener('click', (ev) => {
      ev.preventDefault(); ev.stopPropagation(); encostar(opts.onPorta);
    });
    const timeout = setTimeout(() => {
      if (disposed || root) return;
      if (typeof opts.onFalha === 'function') opts.onFalha('timeout');
    }, 12000);
    loadScript(THREE_SRC).then(() => loadScript(LOADER_SRC)).then(() => loadScript(CONTROLS_SRC)).then(() => {
      if (disposed) return;
      const THREE = global.THREE;
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x070b12);
      scene.fog = new THREE.Fog(0x070b12, 18, 70);
      camera = new THREE.PerspectiveCamera(38, 1, 0.15, 200);
      renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'low-power' });
      renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.4));
      renderer.outputEncoding = THREE.sRGBEncoding;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 0.95;
      renderer.shadowMap.enabled = false;
      tela.appendChild(renderer.domElement);
      scene.add(new THREE.HemisphereLight(0x8aa7c4, 0x1a120c, 0.7));
      const lua = new THREE.DirectionalLight(0xc5d6ea, 0.55);
      lua.position.set(-6, 18, 10);
      scene.add(lua);
      const quente = new THREE.PointLight(0xffb45a, 2.2, 22, 1.6);
      scene.add(quente);
      controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.1;
      controls.enablePan = false;
      controls.rotateSpeed = 0.4;
      controls.minPolarAngle = Math.PI * 0.42;
      controls.maxPolarAngle = Math.PI * 0.5;
      function tamanho() {
        const w = palco.clientWidth || innerWidth;
        const h = palco.clientHeight || innerHeight;
        camera.aspect = Math.max(0.4, w / Math.max(1, h));
        camera.updateProjectionMatrix();
        renderer.setSize(w, h, false);
      }
      tamanho();
      global.addEventListener('resize', tamanho);
      new THREE.GLTFLoader().load(opts.glb, (gltf) => {
        if (disposed) return;
        clearTimeout(timeout);
        root = gltf.scene || gltf.scenes[0];
        root.updateMatrixWorld(true);
        scene.add(root);
        const porta = [];
        root.traverse((obj) => {
          if (!obj.isMesh) return;
          const mat = obj.material;
          if (mat) {
            const mats = Array.isArray(mat) ? mat : [mat];
            mats.forEach((m) => {
              if (m && /lit/i.test(m.name || '')) {
                m.emissive = new THREE.Color(0xff9a3a);
                m.emissiveIntensity = 2;
              }
            });
          }
          if (ePorta(obj)) { porta.push(obj); obj.userData.acPorta = true; }
        });
        const casaNode = achar(root, CASA) || achar(root, /casa-da-costa/i);
        const alvoBox = new THREE.Box3();
        if (casaNode) alvoBox.setFromObject(casaNode);
        else if (porta.length) porta.forEach((m) => alvoBox.expandByObject(m));
        else alvoBox.setFromObject(root);
        const alvo = new THREE.Vector3();
        const size = new THREE.Vector3();
        alvoBox.getCenter(alvo);
        alvoBox.getSize(size);
        const dist = Math.max(8, Math.min(22, Math.max(size.x, size.z) * 2.4));
        controls.target.copy(alvo);
        camera.position.set(alvo.x + dist * 0.15, alvo.y + size.y * 0.35, alvo.z + dist);
        controls.minDistance = dist * 0.7;
        controls.maxDistance = dist * 1.6;
        const baseAz = Math.atan2(camera.position.x - alvo.x, camera.position.z - alvo.z);
        controls.minAzimuthAngle = baseAz - 0.6;
        controls.maxAzimuthAngle = baseAz + 0.6;
        controls.update();
        quente.position.set(alvo.x, alvo.y + size.y * 0.4, alvo.z + 1.2);
        const ray = new THREE.Raycaster();
        const ptr = new THREE.Vector2();
        let sx = 0, sy = 0;
        renderer.domElement.addEventListener('pointerdown', (ev) => { sx = ev.clientX; sy = ev.clientY; });
        renderer.domElement.addEventListener('pointerup', (ev) => {
          if (disposed) return;
          if (Math.hypot(ev.clientX - sx, ev.clientY - sy) > 14) return;
          const r = renderer.domElement.getBoundingClientRect();
          ptr.x = ((ev.clientX - r.left) / r.width) * 2 - 1;
          ptr.y = -((ev.clientY - r.top) / r.height) * 2 + 1;
          ray.setFromCamera(ptr, camera);
          const hits = ray.intersectObject(root, true);
          const hit = hits.find((h) => {
            let o = h.object;
            while (o) {
              if (o.userData && o.userData.acPorta) return true;
              if (ePorta(o)) return true;
              o = o.parent;
            }
            return false;
          });
          if (hit) encostar(opts.onPorta);
        });
        hint.hidden = false;
        if (typeof opts.onPronto === 'function') opts.onPronto();
      }, undefined, () => {
        clearTimeout(timeout);
        if (typeof opts.onFalha === 'function') opts.onFalha('glb');
      });
      (function loop() {
        if (disposed) return;
        raf = requestAnimationFrame(loop);
        if (controls) controls.update();
        renderer.render(scene, camera);
      })();
    }).catch(() => {
      clearTimeout(timeout);
      if (typeof opts.onFalha === 'function') opts.onFalha('webgl');
    });
    return { desmontar };
  }
  function desmontar() {
    disposed = true;
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    try { if (controls) controls.dispose(); } catch (e) {}
    try {
      if (renderer) {
        renderer.dispose();
        if (renderer.domElement && renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    } catch (e) {}
    const tela = document.getElementById('abPaisagem');
    if (tela && tela.parentNode) tela.parentNode.removeChild(tela);
    const bt = document.getElementById('abEntrarPorta');
    if (bt && bt.parentNode) bt.parentNode.removeChild(bt);
    renderer = scene = camera = controls = root = hint = null;
  }
  global.MosaicoPaisagem = { montar, desmontar };
})(window);
