import { FASES, progresso, nGrupos, postosParaCaso } from "../engine.js";
import { POSTOS, MECANISMOS } from "../content/viagem.js";
import { CASOS, CURSOS, casoById } from "../content/casos.js";
import { esc } from "./metro.js";

const mecNome = (id) => MECANISMOS.find((m) => m.id === id)?.nome || "—";

export function renderProfessor(st) {
  const k = FASES.findIndex((f) => f.id === st.fase);
  const p = progresso(st);
  const gs = Object.values(st.grupos);
  const caso = casoById(st.casoId);
  let extra = "";
  if (st.fase === "entrada") {
    const n = nGrupos(st.ordem.length);
    extra = `<h3>Caso da aula</h3>${Object.entries(CURSOS).map(([c, nome]) => `<div class="faint" style="font-size:12px;margin-top:6px">${nome}</div>${CASOS.filter((x) => x.curso === c).map((x) => `<button class="opt ${st.casoId === x.id ? "sel" : ""}" data-a="caso" data-val="${x.id}"><b>${esc(x.titulo)}</b><br><span class="faint">${esc(x.personagem)}</span></button>`).join("")}`).join("")}
      <div class="card" style="padding:12px"><b>${st.ordem.length} alunos → ${st.ordem.length ? n : 0} grupos</b><p class="faint" style="margin:4px 0 0">Estações: ${st.ordem.length ? postosParaCaso(st.casoId, n).map((id) => POSTOS.find((x) => x.id === id).curto).join(", ") : "—"}</p></div>
      <button class="btn ok block" data-a="sortear" ${st.ordem.length < 1 ? "disabled" : ""}>Sortear grupos</button>`;
  } else {
    extra = gs.map((g) => `<div class="card" style="padding:10px 12px"><div class="row"><span class="badge" style="background:${g.cor.hex};width:28px;height:28px">${g.i + 1}</span><b class="grow">${POSTOS.find((x) => x.id === g.posto).curto}</b>
      <span class="faint" style="font-size:12px">${g.lider ? "líder: " + esc(st.alunos[g.lider].nome) : "sem líder"}</span></div>
      <div class="faint" style="font-size:12px;margin-top:4px">H1: ${esc(mecNome(g.h1?.mec))} · H2: ${esc(mecNome(g.h2?.mec))}</div>
      ${st.fase === "linhas" ? `<button class="btn sm ${st.spot === g.id ? "warn on" : "sec"}" data-a="spot" data-val="${g.id}" style="margin-top:6px">Mostrar no telão</button>` : ""}</div>`).join("");
  }
  return `<div class="col">
    <div class="row"><span class="badge" style="background:#7c3aed">P</span><div class="grow"><b>Professor</b><div class="faint" style="font-size:12px">${esc(caso.titulo)} · ${CURSOS[caso.curso]}</div></div></div>
    <div class="card" style="padding:12px"><div class="faint" style="font-size:12px">Fase ${k + 1} de ${FASES.length}</div><h3>${FASES[k].nome}</h3>
      ${p && p.total ? `<div class="row" style="justify-content:space-between;margin-top:6px"><span class="muted">${p.rot}</span><b class="mono">${p.feito}/${p.total}</b></div>${p.indTot ? `<div class="faint" style="font-size:12px">individuais: ${p.ind}/${p.indTot}</div>` : ""}` : ""}
      <div class="row" style="margin-top:10px"><button class="btn sec grow" data-a="fase" data-val="-1" ${k <= 1 ? "disabled" : ""}>Voltar</button><button class="btn grow" data-a="fase" data-val="1" ${k === 0 || k === FASES.length - 1 ? "disabled" : ""}>Avançar</button></div></div>
    ${extra}</div>`;
}

export function acaoProfessor(a, el, dispatch) {
  switch (a) {
    case "caso": dispatch({ t: "caso", casoId: el.dataset.val }); return true;
    case "sortear": dispatch({ t: "sortear" }); return true;
    case "fase": dispatch({ t: "fase", dir: +el.dataset.val }); return true;
    case "spot": dispatch({ t: "spot", g: el.dataset.val }); return true;
    default: return false;
  }
}
