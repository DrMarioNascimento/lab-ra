// Mosaico Alostase · sala: desenha uma tela a partir do estado e entrega os cliques (data-a) a quem a montou.
export function montar(root, render, onAct, chave, onInput) {
  let ultimo;
  const draw = (forca) => { const k = chave ? chave() : undefined; if (!forca && k !== undefined && k === ultimo) return; ultimo = k; root.innerHTML = render(); };
  root.addEventListener('click', (e) => { const el = e.target.closest('[data-a]'); if (el && root.contains(el) && el.tagName !== 'SELECT') onAct(el.dataset.a, el); });
  root.addEventListener('change', (e) => { const el = e.target.closest('select[data-a]'); if (el) onAct(el.dataset.a, el); });
  if (onInput) root.addEventListener('input', (e) => onInput(e.target));
  return { draw };
}
