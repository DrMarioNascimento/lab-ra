/* Primeira vez numa tela de RA: o que é cada coisa na tela.

   25/10/2026 (Mario: "a assistência que desenvolvemos, evolução da tela,
   auxílio no começo para os jogadores entenderem tela e jogabilidade…
   verifique se está implantado de fato; senão inclua"). As maquetes e peças
   de RA não tinham nada na primeira visita: a ajuda morava num botão de
   informação que ninguém abre antes de se perder.

   Regras que isto segue:
   - ensina a TELA (gesto, botão, onde fica), nunca a solução: a abertura
     descreve o mundo e não entrega a mecânica do caso;
   - aparece uma vez por aparelho e por tela (localStorage), cada balão
     apontando para o que explica, um de cada vez;
   - não tem botão de fechar: um toque em qualquer lugar passa ao próximo, e
     some sozinho depois de alguns segundos — nada segura o jogo;
   - tamanhos proporcionais à tela (min/clamp), sem número cravado;
   - com ?guia=1 na URL ele volta a aparecer, para quem testa.

   GuiaRA.mostrar(chave, [{alvo: seletor | elemento | função | null, txt, semAlvoOk}], {atraso})
   Um passo cujo alvo não está visível é pulado (semAlvoOk mostra assim mesmo, no alto). */
(function (global) {
  'use strict';
  var ESTILO = '.guia-ra{position:fixed;z-index:2147482000;max-width:min(360px,calc(100vw - 32px));padding:clamp(10px,2.4vw,14px) clamp(12px,3vw,16px);' +
    'border-radius:14px;background:linear-gradient(#1d2c38f2,#0f1a22f2);border:1px solid #8fd8ff99;box-shadow:0 8px 24px #000a,inset 0 1px 1px #ffffff30;' +
    'color:#eef7fb;font:500 clamp(14px,3.6vw,16px)/1.4 system-ui,-apple-system,sans-serif;pointer-events:none;opacity:0;transform:translateY(6px);transition:opacity .25s,transform .25s}' +
    '.guia-ra.on{opacity:1;transform:none}.guia-ra small{display:block;margin-top:6px;color:#9fc3d4;font-size:.82em}' +
    '.guia-ra-anel{position:fixed;z-index:2147481999;border:2px solid #8fd8ff;border-radius:16px;box-shadow:0 0 0 4px #8fd8ff33,0 0 18px #8fd8ff66;pointer-events:none;' +
    'animation:guiaRaPulso 1.6s ease-in-out infinite}@keyframes guiaRaPulso{50%{box-shadow:0 0 0 8px #8fd8ff1a,0 0 26px #8fd8ff88}}' +
    '@media (prefers-reduced-motion:reduce){.guia-ra{transition:none}.guia-ra-anel{animation:none}}';
  var estiloPosto = false, ativo = false;
  function lido(chave) { try { return localStorage.getItem('guia-ra:' + chave) === '1'; } catch (e) { return false; } }
  function marcar(chave) { try { localStorage.setItem('guia-ra:' + chave, '1'); } catch (e) {} }
  function achar(a) {
    if (!a) return null; if (typeof a === 'function') { try { a = a(); } catch (e) { return null; } }
    if (typeof a === 'string') a = document.querySelector(a);
    if (!a || !a.getBoundingClientRect) return null;
    var r = a.getBoundingClientRect(); if (r.width < 2 || r.height < 2 || a.hidden) return null;
    return r;
  }
  function mostrar(chave, passos, op) {
    op = op || {};
    var forcar = /[?&]guia=1\b/.test(location.search);
    if (ativo || (!forcar && lido(chave)) || !passos || !passos.length) return false;
    ativo = true;
    if (!estiloPosto) { var st = document.createElement('style'); st.textContent = ESTILO; document.head.appendChild(st); estiloPosto = true; }
    var balao = document.createElement('div'); balao.className = 'guia-ra'; balao.setAttribute('role', 'status'); balao.setAttribute('aria-live', 'polite');
    var anel = document.createElement('div'); anel.className = 'guia-ra-anel'; anel.hidden = true;
    var i = -1, relogio = 0, vivo = true;
    function fim() { if (!vivo) return; vivo = false; ativo = false; marcar(chave); clearTimeout(relogio); balao.remove(); anel.remove(); removeEventListener('pointerdown', passo, true); }
    function posicionar(r) {
      var W = innerWidth, H = innerHeight, bw = balao.offsetWidth, bh = balao.offsetHeight, m = Math.max(12, W * .03);
      /* alvo do tamanho da tela (a própria cena): balão no alto, sem anel em volta de tudo */
      if (r && r.width * r.height > W * H * .55) r = null;
      if (!r) { balao.style.left = Math.max(m, (W - bw) / 2) + 'px'; balao.style.top = Math.max(m, H * .16) + 'px'; anel.hidden = true; return; }
      var folga = Math.max(6, W * .015);
      anel.hidden = false; anel.style.left = (r.left - folga) + 'px'; anel.style.top = (r.top - folga) + 'px'; anel.style.width = (r.width + 2 * folga) + 'px'; anel.style.height = (r.height + 2 * folga) + 'px';
      var x = Math.min(W - bw - m, Math.max(m, r.left + r.width / 2 - bw / 2));
      var y = r.top - bh - folga * 3; if (y < m) y = Math.min(H - bh - m, r.bottom + folga * 3);
      balao.style.left = x + 'px'; balao.style.top = y + 'px';
    }
    function passo(e) {
      if (e && e.type === 'pointerdown' && i >= 0 && !balao.classList.contains('on')) return;
      clearTimeout(relogio); i++;
      if (i >= passos.length) { fim(); return; }
      var p = passos[i];
      /* o que não está na tela deste aparelho (o botão de RA num aparelho sem RA) não se explica */
      if (p.alvo && !p.semAlvoOk && !achar(p.alvo)) { passo(); return; }
      balao.classList.remove('on');
      balao.innerHTML = ''; balao.appendChild(document.createTextNode(p.txt));
      var s = document.createElement('small'); s.textContent = 'toque para seguir'; balao.appendChild(s);
      requestAnimationFrame(function () { posicionar(achar(p.alvo)); balao.classList.add('on'); });
      relogio = setTimeout(passo, Math.max(5500, p.txt.length * 75));
    }
    setTimeout(function () {
      if (!vivo) return;
      document.body.appendChild(anel); document.body.appendChild(balao);
      addEventListener('pointerdown', passo, true);
      addEventListener('resize', function () { if (vivo && i >= 0) posicionar(achar(passos[i].alvo)); });
      passo();
    }, op.atraso === undefined ? 900 : op.atraso);
    return true;
  }
  global.GuiaRA = { mostrar: mostrar, esquecer: function (chave) { try { localStorage.removeItem('guia-ra:' + chave); } catch (e) {} } };
})(window);
