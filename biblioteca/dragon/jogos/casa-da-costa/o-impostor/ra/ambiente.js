/* Ambiente de reflexos para os metais (placas e medalhão do padrão Dragon Games).
   Porte para o three r128 do RoomEnvironment (three.js, MIT; origem: EnvironmentScene
   do model-viewer). Sem ele, metal com metalicidade alta reflete o vazio e fica preto. */
(function (global) {
  'use strict';
  function sala() {
    var s = new THREE.Scene(), g = new THREE.BoxGeometry(); g.deleteAttribute('uv');
    var parede = new THREE.MeshStandardMaterial({ side: THREE.BackSide }), caixa = new THREE.MeshStandardMaterial();
    var luz = new THREE.PointLight(0xffffff, 5.0, 28, 2); luz.position.set(0.418, 16.199, 0.3); s.add(luz);
    function m(mat, p, r, e) { var o = new THREE.Mesh(g, mat); o.position.set(p[0], p[1], p[2]); if (r) o.rotation.set(0, r, 0); o.scale.set(e[0], e[1], e[2]); s.add(o); }
    m(parede, [-0.757, 13.219, 0.717], 0, [31.713, 28.305, 28.591]);
    m(caixa, [-10.906, 2.009, 1.846], -0.195, [2.328, 7.905, 4.651]);
    m(caixa, [-5.607, -0.754, -0.758], 0.994, [1.970, 1.534, 3.955]);
    m(caixa, [6.167, 0.857, 7.803], 0.561, [3.927, 6.285, 3.687]);
    m(caixa, [-2.017, 0.018, 6.124], 0.333, [2.002, 4.566, 2.064]);
    m(caixa, [2.291, -0.756, -2.621], -0.286, [1.546, 1.552, 1.496]);
    m(caixa, [-2.193, -0.369, -5.547], 0.516, [3.875, 3.487, 2.986]);
    function area(k) { var mt = new THREE.MeshBasicMaterial(); mt.color.setScalar(k); return mt; }
    m(area(50), [-16.116, 14.37, 8.208], 0, [0.1, 2.428, 2.739]);
    m(area(50), [-16.109, 18.021, -8.207], 0, [0.1, 2.425, 2.751]);
    m(area(17), [14.904, 12.198, -1.832], 0, [0.15, 4.265, 6.331]);
    m(area(43), [-0.462, 8.89, 14.52], 0, [4.38, 5.441, 0.088]);
    m(area(20), [3.235, 11.486, -12.541], 0, [2.5, 2.0, 0.1]);
    m(area(100), [0, 20, 0], 0, [1.0, 0.1, 1.0]);
    return s;
  }
  global.OIAmbiente = function (renderer) {
    var pm = new THREE.PMREMGenerator(renderer);
    var t = pm.fromScene(sala(), 0.04).texture; pm.dispose(); return t;
  };
})(window);
