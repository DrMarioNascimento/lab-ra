/* Troca o boneco cinza pelos avatares coloridos em Privadas e Suspeitos. */
(function () {
  function preencher(el, id) {
    if (!el || !id) return;
    if (el.querySelector('img[data-oi-contato]')) return;
    var arq = (window.OIContatos && window.OIContatos[id]) || id;
    el.innerHTML = '<img data-oi-contato src="icones/contatos/' + arq + '.webp" alt="">';
  }
  function varrer() {
    document.querySelectorAll('[data-priv]').forEach(function (b) {
      preencher(b.querySelector('.avatar'), b.getAttribute('data-priv'));
    });
    document.querySelectorAll('.suspeito').forEach(function (s) {
      var t = s.querySelector('b');
      var m = t && t.textContent.match(/(\d{2})/);
      if (m) preencher(s.querySelector('.avatar'), m[1]);
    });
    var cab = document.getElementById('convAvatar');
    var nome = document.getElementById('convNome');
    var n = nome && nome.textContent.match(/(\d{2})/);
    if (cab && n) preencher(cab, n[1]);
  }
  var obs = new MutationObserver(varrer);
  function iniciar() {
    obs.observe(document.body, { childList: true, subtree: true });
    varrer();
  }
  if (document.body) iniciar();
  else document.addEventListener('DOMContentLoaded', iniciar);
})();
