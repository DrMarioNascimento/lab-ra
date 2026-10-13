
(() => {
  "use strict";
  const $f = () => document.getElementById('falha');
  let jaMostrou = false;
  window.__vivo = false;   /* o laço de desenho põe true no primeiro quadro */

  function mostrar(titulo, detalhe, dica) {
    if (jaMostrou) return;
    const el = $f();
    if (!el) return;
    jaMostrou = true;
    el.hidden = false;
    el.innerHTML =
      '<b>' + titulo + '</b>' +
      (dica ? '<p>' + dica + '</p>' : '') +
      (detalhe ? '<code>' + String(detalhe).replace(/[<&]/g, c => c === '<' ? '&lt;' : '&amp;') + '</code>' : '') +
      '<p class="pedido">Copie esta caixa inteira ao relatar — é ela que diz onde quebrou.</p>';
  }

  /* Falha ao CARREGAR um recurso (script, módulo, modelo). Vem na fase de
     captura porque erro de recurso não borbulha. */
  addEventListener('error', ev => {
    const alvo = ev.target;
    if (alvo && alvo !== window && (alvo.src || alvo.href)) {
      const url = alvo.src || alvo.href;
      const deFora = !url.startsWith(location.origin);
      mostrar('Um arquivo não carregou.',
        url,
        deFora
          ? 'Ele vem de fora deste site (CDN). Redes de instituição às vezes bloqueiam esse endereço — vale testar noutra rede ou no 4G.'
          : 'É um arquivo deste próprio laboratório. Se o endereço acima estiver certo, pode ser falha momentânea do GitHub Pages.');
      return;
    }
    mostrar('O código parou com um erro.',
      (ev.message || '') + (ev.filename ? '\n' + ev.filename + ':' + ev.lineno : ''),
      'A moldura da página carregou, mas o palco não chegou a ser desenhado.');
  }, true);

  addEventListener('unhandledrejection', ev => {
    mostrar('Uma etapa da carga falhou.',
      (ev.reason && (ev.reason.stack || ev.reason.message)) || String(ev.reason),
      'Costuma ser o modelo 3D não ter chegado inteiro.');
  });

  addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      if (!window.__vivo) {
        mostrar('O palco não desenhou nada em 20 segundos.',
          '',
          'Os dois modelos somam cerca de 4,5 MB. Em rede lenta isso demora — mas se esta caixa apareceu, já passou do razoável.');
      }
    }, 20000);

    /* O PALCO PODE ESTAR VIVO E MESMO ASSIM PRETO, e este é o caso que
       custou uma rodada inteira: o laço desenha, a RA exporta o modelo, o
       painel enche — e o canvas continua preto porque o BUFFER DE DESENHO
       ficou do tamanho errado. Acontece quando o layout não estava pronto na
       hora de medir. Aqui se compara o buffer com a caixa: se a caixa é
       grande e o buffer não, o defeito é de MEDIDA, e a página diz isso em
       vez de deixar o professor olhando preto. */
    setTimeout(() => {
      const c = document.getElementById('palco');
      if (!c) return;
      const caixa = c.getBoundingClientRect();
      if (caixa.height > 120 && c.height < caixa.height * 0.5) {
        mostrar('O palco tem tamanho, mas o desenho saiu noutro tamanho.',
          'caixa ' + Math.round(caixa.width) + 'x' + Math.round(caixa.height) +
          '  ·  buffer ' + c.width + 'x' + c.height,
          'É falha de MEDIDA, não de modelo: redimensionar a janela costuma corrigir na hora. Relate estes dois números.');
      }
    }, 6000);
  });
})();
