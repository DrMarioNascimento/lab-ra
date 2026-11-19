// Mosaico Alostase · relógio do dia: hora grande e astro que percorre o arco (visual do Limiar Ético, cópia própria).
const mod24 = (h) => ((h % 24) + 24) % 24;

/** "08h30": duas casas na hora e nos minutos, como no Limiar Ético. */
export function horaRelogio(h) {
  const m = Math.round(mod24(h) * 60) % 1440;
  return `${String(Math.floor(m / 60)).padStart(2, '0')}h${String(m % 60).padStart(2, '0')}`;
}

/** Fase do céu pela hora: o Limiar usa 5 fases; aqui a madrugada também é noite. */
export function faseDoCeu(h) {
  const x = mod24(h);
  return x < 6 || x >= 19 ? 'noite' : x < 8 ? 'alvorada' : x < 12 ? 'manha' : x < 16 ? 'tarde' : 'poente';
}

/** Ponto do astro: curva quadrática de (8,36) a (192,36) com controle em (100,-28); 0h na esquerda, 24h na direita. */
export function posicaoAstro(h) {
  const t = mod24(h) / 24, P0 = [8, 36], P1 = [100, -28], P2 = [192, 36];
  const mix = (a, b, k) => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
  const q = mix(P0, P1, t), fim = mix(q, mix(P1, P2, t), t);
  return { x: fim[0], y: fim[1], percorrido: `M${P0} Q${q.map((v) => v.toFixed(2))} ${fim.map((v) => v.toFixed(2))}` };
}

export function relogio(h, legenda = '') {
  const a = posicaoAstro(h), fase = faseDoCeu(h);
  return `<div class="relogio" data-fase="${fase}" role="img" aria-label="Relógio do dia: ${horaRelogio(h)}">
    <span class="rel-hora">${horaRelogio(h)}</span>
    <div class="rel-caixa">
      <svg class="rel-arco" viewBox="0 0 200 40" preserveAspectRatio="none" aria-hidden="true">
        <line class="hz" x1="2" y1="37" x2="198" y2="37"/><path class="trilho" d="M8,36 Q100,-28 192,36"/><path class="feito" d="${a.percorrido}"/>
      </svg>
      <span class="astro" style="left:${(a.x / 200) * 100}%;top:${(a.y / 40) * 100}%"></span>
    </div>${legenda ? `<span class="rel-leg">${legenda}</span>` : ''}</div>`;
}

/** O céu da página segue o relógio mostrado na tela; sem relógio, volta ao fundo escuro neutro. */
export function ligarCeu(tela) {
  const atualiza = () => { const el = tela.querySelector('.relogio'); if (el) document.body.dataset.fase = el.dataset.fase; else delete document.body.dataset.fase; };
  new MutationObserver(atualiza).observe(tela, { childList: true, subtree: true });
  atualiza();
}
