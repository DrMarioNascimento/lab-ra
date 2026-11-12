import { retainJourneys } from './journey.js?v=desfecho-20261111';

// Monta uma área que se redesenha a partir do estado, preservando foco e cursor dos campos.
export function montar(root, render, onAction, onInput) {
  let last = "";
  function draw(force = false) {
    const html = render();
    if (!force && html === last) return;
    const ae = document.activeElement;
    const key = ae && root.contains(ae) ? ae.dataset.key : null;
    const sel = key && "selectionStart" in ae ? [ae.selectionStart, ae.selectionEnd] : null;
    const scroll = root.scrollTop;
    const restoreJourneys = retainJourneys(root);
    root.innerHTML = html;
    restoreJourneys();
    last = html;
    root.scrollTop = scroll;
    if (key) {
      const el = root.querySelector(`[data-key="${CSS.escape(key)}"]`);
      if (el) { el.focus({ preventScroll: true }); if (sel && el.setSelectionRange) try { el.setSelectionRange(...sel); } catch {} }
    }
  }
  root.addEventListener("click", (e) => {
    const el = e.target.closest("[data-a]");
    if (!el || !root.contains(el) || el.disabled) return;
    if (onAction(el.dataset.a, el)) draw();
  });
  const handleIn = (e) => {
    const el = e.target.closest("[data-in]");
    if (!el || !root.contains(el)) return;
    let v = el.value;
    if (el.type === "number" || el.type === "range") v = v === "" ? undefined : Number(v);
    onInput(el.dataset.in, v);
    if (el.dataset.live || el.tagName === "SELECT") draw(); else draw();
  };
  root.addEventListener("input", handleIn);
  return { draw };
}

export function setPath(obj, path, v) {
  const ks = path.split(".");
  let o = obj;
  for (let i = 0; i < ks.length - 1; i++) o = o[ks[i]] ??= {};
  o[ks.at(-1)] = v;
}
