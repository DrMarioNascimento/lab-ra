import { FASES, nomeFase, progresso, nFamilias } from "../engine.js";
import { REGRAS_TXT } from "../content/vila.js";
import { carta } from "../content/cartas.js";
import { iconeFamilia, ico } from "./desenho.js";
import { paineisResultado, painelAtual } from "./telao.js";

const LADO = { paga: "você paga", recebe: "você recebe" };
const ALVO = { mata: "estrago na mata", publico: "estrago no bem público" };
// R13: as cartas sorteadas desta partida (só quem conduz vê; o telão mostra cada uma na hora)
function cartasDaPartida(st) {
  if (!st.cartas) return "";
  const p = carta(st.cartas.pequena), q = carta(st.cartas.ano4), g = carta(st.cartas.grande);
  const linha = (ano, c, extra) => `<div class="row" style="flex-wrap:nowrap;margin-top:6px">${ico(c.icone)}<div><b>Ano ${ano} · ${c.titulo}</b><div class="faint" style="font-size:12px">${extra}</div></div></div>`;
  return `<div class="card" style="padding:10px 12px"><b>Cartas desta partida</b><p class="faint" style="font-size:12px;margin:2px 0 0">Sorteadas pela semente da partida; a turma só vê cada uma na hora.</p>
    ${linha(2, p, `pequena · ${p.segmento} · ${LADO[p.lado]} · ${ALVO[p.alvo]}`)}${linha(4, q.grupo === "confianca" ? { ...q, titulo: "Uma questão de confiança" } : q, `${q.grupo === "confianca" ? "confiança: cada pessoa recebe uma das 4 situações (1 em 4 de golpe, igual em todas)" : "honestidade"}${st.semTroco ? " · desligada" : ""}`)}${linha(5, g, `grande · ${g.segmento} · ${ALVO[g.alvo]}`)}</div>`;
}

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
    if (st.fase !== "fechamento") extra = cartasDaPartida(st) + `<div class="card" style="padding:10px 12px"><div class="row"><b class="grow">Carta do ano 4</b><button class="btn sm ${st.semTroco ? "sec" : "ok"}" data-a="troco" ${podeTrocar ? "" : "disabled"}>${st.semTroco ? "Desligada" : "Ligada"}</button></div><p class="faint" style="font-size:12px;margin:4px 0 0">Honestidade (como o troco do mercado) ou confiança. Ligada por padrão; desligue se a aula atrasar (economiza cerca de 1,5 min).</p></div>
      <div class="card" style="padding:10px 12px"><div class="row"><b class="grow">Conversas curtas</b><button class="btn sm ${st.curto ? "ok" : "sec"}" data-a="curto">${st.curto ? "Ligadas" : "Desligadas"}</button></div><p class="faint" style="font-size:12px;margin:4px 0 0">Se ainda faltar tempo: conversa antes do voto em 60 s e conversa da família em 30 s nos anos 4 e 5 (economiza cerca de 2 min).</p></div>` + extra;
  }
  const anos = st.ano ? `Ano ${st.ano} de 5 · regra ${REGRAS_TXT[st.regra].nome}` : "Antes do ano 1";
  return `<div class="col"><div class="row"><span class="badge" style="background:#7c3aed">P</span><div class="grow"><b>Professor</b><div class="faint" style="font-size:12px">${anos}</div></div></div>
    <div class="card" style="padding:12px"><div class="faint" style="font-size:12px">Etapa ${st.k + 1} de ${FASES.length}</div><h3>${esc(nomeFase(st))}</h3>
    ${p && p.total ? `<div class="row" style="justify-content:space-between;margin-top:6px"><span class="muted">${p.rot}</span><b class="mono">${p.feito}/${p.total}</b></div><div class="prog" style="height:8px"><i style="width:${(100 * p.feito) / p.total}%"></i></div>` : ""}
    <div class="row" style="margin-top:10px"><button class="btn sec grow" data-a="fase" data-val="-1" ${st.k <= 1 || !st.pilha?.length ? "disabled" : ""}>Voltar</button><button class="btn grow" data-a="fase" data-val="1" ${st.k === 0 || st.fase === "fechamento" ? "disabled" : ""}>Avançar</button></div>
    <p class="faint" style="font-size:12px;margin:8px 0 0">Quem não enviar até avançar mantém a proposta anterior.</p></div>${st.fase === "resultado" ? controlePaineis(st) : ""}${st.fase === "fechamento" ? `<div class="card" style="padding:12px"><b>Pergunta ${(st.pergunta || 0) + 1} de 5 no telão</b><div class="row" style="margin-top:8px"><button class="btn sec grow" data-a="pergunta" data-val="-1" ${(st.pergunta || 0) <= 0 ? "disabled" : ""}>◀ Anterior</button><button class="btn grow" data-a="pergunta" data-val="1" ${(st.pergunta || 0) >= 4 ? "disabled" : ""}>Próxima ▶</button></div></div>` : ""}${extra}</div>`;
}

// R13: segurar um painel de "Como ficou a vila" ou ir e voltar entre eles (o telão para de passar sozinho)
function controlePaineis(st) {
  const ps = paineisResultado(st), k = painelAtual(st), preso = st.painel != null;
  return `<div class="card" style="padding:12px"><b>Painel ${k + 1} de ${ps.length}: ${esc(ps[k].nome)}</b><p class="faint" style="font-size:12px;margin:2px 0 0">${preso ? "Parado na tela: avance quando a turma tiver visto." : "Os painéis passam sozinhos; segure um para conversar sobre ele."}</p>
    <div class="row" style="margin-top:8px"><button class="btn sec grow" data-a="painel" data-val="${Math.max(0, k - 1)}" ${k <= 0 ? "disabled" : ""}>◀</button><button class="btn ${preso ? "ok" : "sec"} grow" data-a="painel" data-val="${preso ? "solta" : k}">${preso ? "Soltar" : "Segurar"}</button><button class="btn sec grow" data-a="painel" data-val="${Math.min(ps.length - 1, k + 1)}" ${k >= ps.length - 1 ? "disabled" : ""}>▶</button></div></div>`;
}

export function acaoProfessor(a, el, dispatch) {
  switch (a) {
    case "sortear": dispatch({ t: "sortear", seed: Date.now() }); return true;
    case "fase": dispatch({ t: "fase", dir: +el.dataset.val }); return true;
    case "pergunta": dispatch({ t: "pergunta", dir: +el.dataset.val }); return true;
    case "troco": dispatch({ t: "config", semTroco: !el.classList.contains("sec") }); return true;
    case "curto": dispatch({ t: "config", curto: el.classList.contains("sec") }); return true;
    case "painel": dispatch({ t: "painel", k: el.dataset.val === "solta" ? null : +el.dataset.val }); return true;
    default: return false;
  }
}
