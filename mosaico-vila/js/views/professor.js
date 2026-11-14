import { FASES, NOME_FASE, progresso, nFamilias } from "../engine.js";
import { REGRAS_TXT } from "../content/vila.js";
import { iconeFamilia } from "./desenho.js";

const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const n0 = (x) => Math.round(x).toLocaleString("pt-BR");

export function renderProfessor(st) {
  const p = progresso(st);
  const fase = FASES[st.k];
  let extra = "";
  if (st.fase === "entrada") {
    const nf = st.ordem.length >= 4 ? nFamilias(st.ordem.length) : 0;
    extra = `<div class="card" style="padding:12px"><b>${st.ordem.length} participantes → ${nf} famílias</b><p class="faint" style="margin:4px 0 0">Mínimo de 4 participantes.</p></div>
      <button class="btn ok block" data-a="sortear" ${st.ordem.length >= 4 ? "" : "disabled"}>Formar as famílias</button>`;
  } else {
    extra = Object.values(st.fams).map((f) => `<div class="card" style="padding:10px 12px"><div class="row">${iconeFamilia(f, 26)}<b class="grow">${esc(f.nome)}</b><span class="mono">${n0(f.caixa)}</span></div>
      <div class="faint" style="font-size:12px;margin-top:4px">${f.membros.length} pessoas · ${f.lotes} lote(s)</div></div>`).join("");
    const podeTrocar = st.ano < 4 || (st.ano === 4 && st.fase === "abertura");
    if (st.fase !== "fechamento") extra = `<div class="card" style="padding:10px 12px"><div class="row"><b class="grow">Troco do mercado (ano 4)</b><button class="btn sm ${st.semTroco ? "sec" : "ok"}" data-a="troco" ${podeTrocar ? "" : "disabled"}>${st.semTroco ? "Desligado" : "Ligado"}</button></div><p class="faint" style="font-size:12px;margin:4px 0 0">Opcional, desligado por padrão. Ligue se a turma ainda não jogou o Jogo da Mente e houver tempo (cerca de +2 min).</p></div>` + extra;
  }
  const anos = st.ano ? `Ano ${st.ano} de 5 · regra ${REGRAS_TXT[st.regra].nome}` : "Antes do ano 1";
  return `<div class="col"><div class="row"><span class="badge" style="background:#7c3aed">P</span><div class="grow"><b>Professor</b><div class="faint" style="font-size:12px">${anos}</div></div></div>
    <div class="card" style="padding:12px"><div class="faint" style="font-size:12px">Etapa ${st.k + 1} de ${FASES.length}</div><h3>${esc(NOME_FASE[fase.id])}</h3>
    ${p && p.total ? `<div class="row" style="justify-content:space-between;margin-top:6px"><span class="muted">${p.rot}</span><b class="mono">${p.feito}/${p.total}</b></div><div class="prog" style="height:8px"><i style="width:${(100 * p.feito) / p.total}%"></i></div>` : ""}
    <div class="row" style="margin-top:10px"><button class="btn sec grow" data-a="fase" data-val="-1" ${st.k <= 1 ? "disabled" : ""}>Voltar</button><button class="btn grow" data-a="fase" data-val="1" ${st.k === 0 || st.fase === "fechamento" ? "disabled" : ""}>Avançar</button></div>
    <p class="faint" style="font-size:12px;margin:8px 0 0">Quem não enviar até avançar mantém a proposta anterior.</p></div>${extra}</div>`;
}

export function acaoProfessor(a, el, dispatch) {
  switch (a) {
    case "sortear": dispatch({ t: "sortear", seed: Date.now() }); return true;
    case "fase": dispatch({ t: "fase", dir: +el.dataset.val }); return true;
    case "troco": dispatch({ t: "config", semTroco: !el.classList.contains("sec") }); return true;
    default: return false;
  }
}
