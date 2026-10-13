/* O IMPOSTOR — maquete — melhorias de imagem e fluidez (04/10/2026).

   Arquivo ACRESCENTADO, sem mexer no ac-maquete.js: espera a maquete ficar
   pronta (window.__maquete, que o ac-maquete.js já expõe) e então:

   · SOMBRA NA RA: na RA o chão some (chao.visible = modo === 'mesa') e a
     sombra ia junto. Um plano que só recebe sombra, dentro da maquete, na
     altura da base do modelo, pousa a casa na mesa real. Na mesa (sem RA)
     ele fica transparente, porque lá o chão já recebe a sombra.
   · NITIDEZ: filtragem anisotrópica (até 8×) nas texturas da maquete, para
     o que se lê de lado não borrar.
   · RESOLUÇÃO ADAPTATIVA: fora da RA, a resolução desce quando os quadros
     atrasam e sobe quando sobra folga (de 1,0× a 1,8× a densidade da tela).

   Ver Avaliacao_motor_RA.md. Não altera toques, enquadramento nem RA. */
(function () {
  'use strict';
  var OPACIDADE = 0.32;
  var PR_MAX = Math.min(window.devicePixelRatio || 1, 1.8);
  var PR_MIN = Math.min(window.devicePixelRatio || 1, 1.0);

  function quandoPronta(fn) {
    var tentativas = 0;
    var t = setInterval(function () {
      var m = window.__maquete;
      if (m && m.mundo && m.mundo.raiz && m.renderer && m.ra) { clearInterval(t); try { fn(m); } catch (e) { console.error('[maquete-melhorias]', e); } }
      else if (++tentativas > 600) clearInterval(t); /* desiste depois de 2 minutos */
    }, 200);
  }

  quandoPronta(function (m) {
    var mundo = m.mundo, renderer = m.renderer, ra = m.ra, raiz = mundo.raiz;
    function modoAtual() { try { return ra.estado().modo; } catch (e) { return 'mesa'; } }

    /* ---------- sombra na RA ---------- */
    raiz.updateMatrixWorld(true);
    var caixa = new THREE.Box3().setFromObject(raiz);
    if (!caixa.isEmpty()) {
      var e = raiz.getWorldScale(new THREE.Vector3()).x || 1;
      /* 04/10: a base é a do modelo (mundo.baseY), a mesma que a RA apoia na
         superfície; a caixa inteira desce ~1,3 cm por causa das chaves. */
      var base = typeof mundo.baseY === 'number' ? mundo.baseY
        : raiz.worldToLocal(new THREE.Vector3(raiz.getWorldPosition(new THREE.Vector3()).x, caixa.min.y, raiz.getWorldPosition(new THREE.Vector3()).z)).y;
      var tam = caixa.getSize(new THREE.Vector3());
      var raioDaSombra = Math.max(tam.x, tam.z) / e * 0.75;
      var sombra = new THREE.Mesh(new THREE.CircleGeometry(raioDaSombra, 64).rotateX(-Math.PI / 2),
        new THREE.ShadowMaterial({ opacity: 0 }));
      sombra.position.y = base + 0.001;
      sombra.receiveShadow = true;
      sombra.raycast = function () {};
      sombra.userData.exportExclude = true;
      sombra.renderOrder = -1;
      sombra.onBeforeRender = function () { sombra.material.opacity = modoAtual() === 'mesa' ? 0 : OPACIDADE; };
      raiz.add(sombra);
      window.__sombraDaMaquete = sombra;
    }

    /* ---------- nitidez ---------- */
    var aniso = Math.min(8, (renderer.capabilities.getMaxAnisotropy && renderer.capabilities.getMaxAnisotropy()) || 1);
    var MAPAS = ['map', 'normalMap', 'roughnessMap', 'metalnessMap', 'aoMap', 'emissiveMap'];
    raiz.traverse(function (o) {
      if (!o.isMesh || !o.material) return;
      (Array.isArray(o.material) ? o.material : [o.material]).forEach(function (mat) {
        MAPAS.forEach(function (k) { var t = mat && mat[k]; if (t && t.anisotropy !== aniso) { t.anisotropy = aniso; t.needsUpdate = true; } });
      });
    });

    /* ---------- resolução adaptativa (só fora da RA) ---------- */
    var desenharOriginal = renderer.render.bind(renderer);
    var pr = renderer.getPixelRatio(), ultimo = performance.now(), n = 0, soma = 0, lentas = 0, folgadas = 0;
    renderer.render = function (cena, camera) {
      var agora = performance.now(), dt = agora - ultimo; ultimo = agora;
      if (modoAtual() === 'mesa' && !renderer.xr.isPresenting && dt > 0 && dt < 250) {
        n++; soma += dt;
        if (n >= 90) {
          var media = soma / n; n = 0; soma = 0;
          if (media > 25) { lentas++; folgadas = 0; } else if (media < 18) { folgadas++; lentas = 0; } else { lentas = 0; folgadas = 0; }
          var novo = pr;
          if (lentas >= 2 && pr > PR_MIN) { novo = Math.max(PR_MIN, pr - 0.2); lentas = 0; }
          else if (folgadas >= 3 && pr < PR_MAX) { novo = Math.min(PR_MAX, pr + 0.1); folgadas = 0; }
          if (novo !== pr) {
            pr = novo;
            var r = renderer.domElement.getBoundingClientRect();
            renderer.setPixelRatio(pr);
            renderer.setSize(Math.max(1, Math.round(r.width)), Math.max(1, Math.round(r.height)), false);
          }
        }
      } else { n = 0; soma = 0; }
      return desenharOriginal(cena, camera);
    };
  });
})();
