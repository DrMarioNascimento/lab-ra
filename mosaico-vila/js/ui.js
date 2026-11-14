// iPhone (Safari): sem um ouvinte de toque, o :active não dispara e os botões não afundam ao toque.
if (typeof document !== "undefined") document.addEventListener("touchstart", () => {}, { passive: true });

// Monta uma área que se redesenha a partir do estado, preservando foco e cursor dos campos.
// Slider em arrasto: o redesenho espera o dedo sair (recriar o elemento no meio do gesto interrompe o arrasto,
// no celular e no PC); enquanto isso, só o número ao lado do slider (data-eco) acompanha.
export function montar(root, render, onAction, onInput) {
  let last = "", arrastando = null, pendente = false, solta = 0;
  const soltar = () => { if (!arrastando) return; arrastando = null; clearTimeout(solta); if (pendente) { pendente = false; draw(); } };
  const pega = (e) => { const el = e.target.closest?.('input[type="range"]'); if (el && root.contains(el)) arrastando = el; };
  root.addEventListener("pointerdown", pega);
  root.addEventListener("touchstart", pega, { passive: true });
  for (const ev of ["pointerup", "pointercancel", "touchend", "touchcancel"]) window.addEventListener(ev, soltar, { passive: true });
  root.addEventListener("change", (e) => { if (e.target === arrastando) soltar(); });
  function draw(force = false) {
    if (arrastando && !force) { pendente = true; return; }
    const html = render();
    if (!force && html === last) return;
    const ae = document.activeElement;
    const key = ae && root.contains(ae) ? ae.dataset.key : null;
    const sel = key && "selectionStart" in ae ? [ae.selectionStart, ae.selectionEnd] : null;
    const scroll = root.scrollTop;
    root.innerHTML = html;
    last = html;
    root.querySelectorAll('input[type="range"]').forEach(preencher);
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
    if (el.type === "range") preencher(el);
    if (arrastando === el) {
      const eco = root.querySelector(`[data-eco="${CSS.escape(el.dataset.in)}"]`);
      if (eco) eco.textContent = (eco.dataset.ecoFmt || "{v}").replace("{v}", v);
      pendente = true; clearTimeout(solta); solta = setTimeout(soltar, 8000);
      return;
    }
    draw();
  };
  root.addEventListener("input", handleIn);
  return { draw };
}

// Parte preenchida do trilho do slider (a cor vai até o valor escolhido).
function preencher(el) {
  const min = +el.min || 0, max = +el.max || 100, v = +el.value;
  el.style.setProperty("--p", `${max > min ? ((v - min) / (max - min)) * 100 : 0}%`);
}

export function setPath(obj, path, v) {
  const ks = path.split(".");
  let o = obj;
  for (let i = 0; i < ks.length - 1; i++) o = o[ks[i]] ??= {};
  o[ks.at(-1)] = v;
}
