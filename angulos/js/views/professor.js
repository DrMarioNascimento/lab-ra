import { FASES, progresso, papeisParaTurma, papelById } from "../engine.js";
import { FOTOS, ALTERNATIVAS, txt } from "../content/cena.js";

const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

export function renderProfessor(st) {
  const k = FASES.findIndex((f) => f.id === st.fase);
  const p = progresso(st);
  const gs = Object.values(st.grupos);
  let extra = "";
  if (st.fase === "entrada") {
    const ps = st.ordem.length ? papeisParaTurma(st.ordem.length) : [];
    extra = `<div class="card" style="padding:12px"><b>${st.ordem.length} alunos → ${ps.length} papéis</b><p class="faint" style="margin:4px 0 0">${ps.map((x) => x.nome).join(", ") || "—"}</p></div>
      <button class="btn ok block" data-a="sortear" ${st.ordem.length ? "" : "disabled"}>Sortear papéis</button>`;
  } else if (st.fase === "confronto") {
    extra = `<button class="btn sm ${!st.foco ? "warn on" : "sec"}" data-a="foco" data-val="">Girar 360°</button>` +
      gs.map((g) => { const pp = papelById(g.papel); return `<div class="card" style="padding:10px 12px"><b style="color:${pp.cor}">${esc(pp.nome)}</b><div class="row" style="margin-top:6px">${pp.fotos.map((f) => `<button class="btn sm ${st.foco === f ? "warn on" : "sec"}" data-a="foco" data-val="${f}">${esc(FOTOS[f].titulo)}</button>`).join("")}</div></div>`; }).join("");
  } else {
    extra = gs.map((g) => { const pp = papelById(g.papel); return `<div class="card" style="padding:10px 12px"><div class="row"><span class="badge" style="background:${pp.cor};width:28px;height:28px">${g.i + 1}</span><b class="grow">${esc(pp.nome)}</b></div>
      <div class="faint" style="font-size:12px;margin-top:4px">${g.lider ? "líder: " + esc(st.alunos[g.lider].nome) : "sem líder"} · posto: ${esc(txt(ALTERNATIVAS[g.papel].find((a) => a.id === g.h1?.acao)?.t || "—", st.pers).slice(0, 40))}</div>
      ${st.fase === "linhas" ? `<button class="btn sm ${st.spot === g.id ? "warn on" : "sec"}" data-a="spot" data-val="${g.id}" style="margin-top:6px">Mostrar no telão</button>` : ""}</div>`; }).join("");
  }
  return `<div class="col"><div class="row"><span class="badge" style="background:#7c3aed">P</span><div class="grow"><b>Professor</b><div class="faint" style="font-size:12px">Academia, 19h · Desafio 90 dias</div></div></div>
    <div class="card" style="padding:12px"><div class="faint" style="font-size:12px">Fase ${k + 1} de ${FASES.length}</div><h3>${FASES[k].nome}</h3>
    ${p && p.total ? `<div class="row" style="justify-content:space-between;margin-top:6px"><span class="muted">${p.rot}</span><b class="mono">${p.feito}/${p.total}</b></div>${p.indTot ? `<div class="faint" style="font-size:12px">individuais: ${p.ind}/${p.indTot}</div>` : ""}` : ""}
    <div class="row" style="margin-top:10px"><button class="btn sec grow" data-a="fase" data-val="-1" ${k <= 1 ? "disabled" : ""}>Voltar</button><button class="btn grow" data-a="fase" data-val="1" ${k === 0 || k === FASES.length - 1 ? "disabled" : ""}>Avançar</button></div></div>${extra}</div>`;
}

export function acaoProfessor(a, el, dispatch) {
  switch (a) {
    case "sortear": dispatch({ t: "sortear", seed: Date.now() }); return true;
    case "fase": dispatch({ t: "fase", dir: +el.dataset.val }); return true;
    case "spot": dispatch({ t: "spot", g: el.dataset.val }); return true;
    case "foco": dispatch({ t: "foco", foto: el.dataset.val || null }); return true;
    default: return false;
  }
}
