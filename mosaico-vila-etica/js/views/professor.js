import { FASES, nomeFase, progresso, nFamilias, planoVila, MIN_PESSOAS } from "../engine.js";
import { REGRAS_TXT } from "../content/vila.js";
import { carta } from "../content/cartas.js";
import { iconeFamilia, ico } from "./desenho.js";
import { paineisResultado, painelAtual } from "./telao.js";
import { tetoLotes } from "../content/regras.js";

const LADO = { paga: "você paga", recebe: "você recebe" };
const ALVO = { mata: "estrago na mata", publico: "estrago no bem público" };
// R13: as cartas sorteadas desta partida (só quem conduz vê; o telão mostra cada uma na hora)
function cartasDaPartida(st) {
  if (!st.cartas) return "";
  const p = carta(st.cartas.pequena), q = carta(st.cartas.ano4), g = carta(st.cartas.grande);
  const linha = (ano, c, extra) => `<div class="row" style="flex-wrap:nowrap;margin-top:6px">${ico(c.icone)}<div><b>Ano ${ano} · ${c.titulo}</b><div class="faint" style="font-size:12px">${extra}</div></div></div>`;
  return `<div class="card" style="padding:10px 12px"><b>Cartas desta partida</b><p class="faint" style="font-size:12px;margin:2px 0 0">Sorteadas pela semente da partida; a turma só vê cada uma na hora.</p>
    ${linha(2, p, `pequena · ${p.segmento} · ${LADO[p.lado]} · ${ALVO[p.alvo]}`)}${st.lazer?.tipo ? linha("3", { icone: st.lazer.tipo === "memoria" ? "lazer-memoria" : "lazer-genius", titulo: `Momento do Lazer: ${st.lazer.tipo === "memoria" ? "jogo da memória (12 pares)" : "Acerte a sequência (8 botões)"}` }, "depois do voto, 60 s; vira pontos para o bem público") : ""}${linha(4, q.grupo === "confianca" ? { ...q, titulo: "Uma questão de confiança" } : q, `${q.grupo === "confianca" ? "confiança: cada pessoa recebe uma das 4 situações (1 em 4 de golpe, igual em todas)" : "honestidade"}${st.semTroco ? " · desligada" : ""}`)}${linha(5, g, `grande · ${g.segmento} · ${ALVO[g.alvo]}`)}</div>`;   // Ética
}

const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const n0 = (x) => Math.round(x).toLocaleString("pt-BR");

// R22: relógio da aula para quem conduz, contra o plano (fim de cada ano, em minutos de sala; fechamento a partir dos ~35)
let inicioAula = null;
// R36: o que acontece com quem não envia, etapa por etapa (antes, "mantém a proposta anterior" em todas, e no mercado o lance não passa de um ano para o outro)
const RODAPE_ETAPA = {
  decidir: "Quem não enviar até avançar mantém a proposta do ano anterior (bem público, replantio e cargas).",
  lances: "Quem não enviar oferece 0% (o lance não passa de um ano para o outro). Famílias no teto de lotes não dão lance e não entram na conta.",
  pequena: "Quem não responder conta como recusa; com menos de 5 respostas, a proposta não vale.",
  alvara: "Se a pessoa sorteada não responder, vale não.",
  voto: "Vale a maioria de quem votou; empate mantém o Monopólio.",
  mente: "Quem não responder não ganha nem arrisca nada.",
};
const PLANO_FIM_ANO = { 1: 9, 2: 14, 3: 23, 4: 29.5, 5: 36 };   // Ética: com o Momento do Lazer (60 s) e as conversas curtas ligadas (mediana × 1,25 de 315 partidas simuladas)   // R24/R34/R36: medido na simulação r71 (mediana × 1,25 de 315 partidas, turmas de 12 a 40; com o tempo de leitura das cartas e do mercado)
function relogioAula(st) {
  // R35: o relógio conta desde a entrada do primeiro aluno, como o plano (antes, começava só nas famílias, uns 2 min depois)
  if (st.fase === "entrada" && !st.ordem.length) { inicioAula = null; return ""; }
  inicioAula ??= Date.now();
  const min = (Date.now() - inicioAula) / 60000, plano = st.fase === "fechamento" ? 36 : PLANO_FIM_ANO[st.ano] ?? 2;
  const atraso = st.fase !== "fechamento" && min > plano + 1;
  const mm = `${Math.floor(min)}:${String(Math.floor((min % 1) * 60)).padStart(2, "0")}`;
  return `<div class="card" style="padding:10px 12px${atraso ? ";border-color:#f59e0b" : ""}"><div class="row"><b class="grow">Tempo de aula</b><b class="mono">${mm}</b></div><p class="faint" style="font-size:12px;margin:4px 0 0">${atraso ? `Atrasado: o plano fecha o ano ${st.ano} perto de ${String(plano).replace(".", ",")} min. ${st.curto ? "" : "Ligue as conversas curtas. "}${st.ano < 4 ? "Desligue a carta do ano 4." : "Encurte o fechamento para 7 min."}` : st.fase === "fechamento" ? "Plano (contado desde a entrada, com o Momento do Lazer e as conversas curtas): o fechamento (dupla de 1 min, síntese de 1,5 e 7,5 min de perguntas no roteiro; uns 12,5 min de sala, com as trocas de tela e de lugar) vai dos 36 aos 48,5 min; sobra cerca de 1,5 min, menos de meio minuto no pior caso. Se atrasar, desligue a carta do ano 4." : st.fase === "entrada" ? `Plano (contado desde a entrada): entrada e famílias em cerca de 2 min; o ano 1 fecha perto de 9 min. As conversas curtas já vêm ligadas nesta versão: elas pagam o Momento do Lazer.` : `Plano (contado desde a entrada): o ano ${st.ano || 1} fecha perto de ${String(plano).replace(".", ",")} min; o fechamento vai dos 36 aos 48,5.`}</p></div>`;
}

// R24: o cenário profissional (opcional) do GDD, como roteiro de fala de quem conduz; a tela continua com os nomes da vila
const ROTEIRO_PROFISSAO = `<div class="card" style="padding:10px 12px"><b>Cenário profissional (opcional, só na fala)</b><p class="faint" style="font-size:12px;margin:4px 0 0">A vila é o <b>Complexo Esportivo do Bairro</b>: as famílias são equipes (educação física, fisioterapia, nutrição); o bem público é o programa gratuito de atividade física; a mata é o parque onde todos treinam; os lotes são salas que as equipes alugam umas das outras; uma proposta grande é liberar uma reforma sem vistoria de acessibilidade. Regras e números não mudam.</p></div>`;


// ---------------- R43: autoridade de quem conduz ----------------
// Cada família num cartão com a cor dela; cada pessoa com o que está fazendo na etapa, o sinal do celular e um menu de ações.
export const SEM_SINAL_S = 60;
let sinalDe = () => null;   // segundos sem sinal de cada pessoa (null: sem informação, ou automática)
export const ligarSinal = (f) => { sinalDe = f; };
let menuId = null, escolhendo = false, ultimoSt = null;
const tempoSem = (s) => (s < 90 ? `${Math.round(s)} s` : `${Math.round(s / 60)} min`);
const semSinal = (id) => { const s = sinalDe(id); return s != null && s > SEM_SINAL_S ? s : null; };

function statusDe(st, id) {
  const p = st.alunos[id], ano = st.ano, f = st.fams[p.fam];
  const feito = (ok, sim, nao) => (ok ? [sim, "ok"] : [nao, "falta"]);
  switch (st.fase) {
    case "entrada": return ["Na sala", "info"];
    case "familias": return feito(p.achou, "Achou a família ✓", "Ainda procurando a família");
    case "abertura": return ano <= 4 ? feito(st.controle[ano]?.[id] != null, "Respondeu a pergunta ✓", "Ainda não respondeu") : feito(st.prev5[id] != null, "Deu o palpite ✓", "Ainda não deu o palpite");
    case "decidir": { const pr = st.props[ano]?.[id]; return feito(pr && !pr.auto, "Proposta enviada ✓", "Ainda não enviou a proposta"); }
    case "lances": return f && f.lotes >= tetoLotes(f) ? ["Família no teto de lotes (sem lance)", "info"] : feito(st.lances[ano]?.[id]?.lanceEnviado, "Lance enviado ✓", "Ainda não enviou o lance");
    case "pequena": return feito(st.pequena.votos[id] != null, "Respondeu ✓", "Ainda não respondeu");
    case "mente": return feito(st.mente[id] != null, "Respondeu ✓", "Ainda não respondeu");
    case "alvara": { const r = feito(st.alvara.votos[id] != null, "Respondeu ✓", "Ainda não respondeu"); return st.alvara.pessoa === id ? [`${r[0]} · é a pessoa sorteada`, r[1]] : r; }
    case "conversa": return feito(st.controle.voto?.[id] != null, "Conferiu a regra ✓", "Ainda não conferiu a regra");
    case "voto": return feito(st.voto[id] != null, "Votou ✓", "Ainda não votou");
    case "lazer": return feito(!!st.lazer?.res?.[id]?.fim, "Terminou ✓", "Ainda jogando");
    case "fechamento": return feito(st.final[id] != null, "Respondeu ✓", "Ainda não respondeu");
    default: return ["Vendo o resultado", "info"];
  }
}

function linhaPessoa(st, id, chefe) {
  const p = st.alunos[id], [t, tom] = statusDe(st, id), sem = semSinal(id);
  const sorteada = st.fase === "alvara" && st.alvara?.pessoa === id;
  return `<div class="pp-lin"><i class="pp-bol ${sem ? "off" : "on"}" title="${sem ? "Sem sinal" : "Com sinal"}"></i>
    <div class="pp-txt"><b>${esc(p.nome)}${chefe ? ` <span class="pp-tag">chefia</span>` : ""}${sorteada ? ` <span class="pp-tag">sorteada</span>` : ""}</b>
      <span class="pp-st ${tom}">${sem ? `<b class="pp-off">Sem sinal há ${tempoSem(sem)} · </b>` : ""}${esc(t)}</span></div>
    <button class="btn sm sec pp-menu" data-a="menu" data-id="${id}" aria-label="Ações para ${esc(p.nome)}" title="Ações">⋯</button></div>`;
}

function avisos(st) {
  const humanos = st.ordem.filter((id) => !st.alunos[id]?.auto);
  const sem = humanos.filter((id) => semSinal(id));
  const falta = st.fase === "entrada" ? [] : humanos.filter((id) => statusDe(st, id)[1] === "falta");
  let h = "";
  if (st.fase === "alvara" && st.alvara?.pessoa && semSinal(st.alvara.pessoa) && st.alunos[st.alvara.pessoa])
    h += `<div class="pp-aviso red"><b>A pessoa sorteada (${esc(st.alunos[st.alvara.pessoa].nome)}) está sem sinal.</b> A resposta dela é a que vale. Toque em “⋯” ao lado de outra pessoa e escolha “Ser a pessoa sorteada”.</div>`;
  if (sem.length) h += `<div class="pp-aviso red"><b>${sem.length} sem sinal:</b> ${esc(sem.slice(0, 8).map((id) => st.alunos[id].nome).join(", "))}${sem.length > 8 ? ` e mais ${sem.length - 8}` : ""}. Se foi a internet, a pessoa volta com “Sou eu, voltar”. Se não vai voltar, use “⋯ → Expulsar”.</div>`;
  if (falta.length) h += `<div class="pp-aviso"><b>Faltam ${falta.length}:</b> ${esc(falta.slice(0, 8).map((id) => st.alunos[id].nome).join(", "))}${falta.length > 8 ? ` e mais ${falta.length - 8}` : ""}.</div>`;
  return h;
}

function listaEntrada(st) {
  if (!st.ordem.length) return "";
  return avisos(st) + `<div class="pp-tit">Na sala · “⋯” abre as ações de cada pessoa</div><section class="pp-fam" style="--fam:#60a5fa;--fam2:#1d4ed8"><div class="pp-lista">${st.ordem.map((id) => linhaPessoa(st, id, false)).join("")}</div></section>`;
}

function painelFamilias(st) {
  return avisos(st) + `<div class="pp-tit">Famílias · “⋯” abre as ações de cada pessoa</div>` + Object.values(st.fams).map((f) => {
    const hum = f.membros.filter((m) => !st.alunos[m]?.auto);
    const faltam = hum.filter((m) => statusDe(st, m)[1] === "falta").length, sem = hum.filter((m) => semSinal(m)).length;
    const autos = f.membros.length - hum.length;
    return `<section class="pp-fam" style="--fam:${f.cor};--fam2:${f.cor2}"><div class="pp-cab">${iconeFamilia(f, 56)}<div class="pp-cabtx"><b>${esc(f.nome)}</b>
      <span>${esc(nomeFase(st))} · ${hum.length ? (faltam ? `faltam ${faltam}` : "todos prontos ✓") : "só automáticos"}${sem ? ` · <b class="pp-off">${sem} sem sinal</b>` : ""}</span>
      <small>${n0(f.caixa)} pontos · ${f.lotes === 1 ? "1 lote" : `${f.lotes} lotes`}</small></div></div>
      <div class="pp-lista">${hum.map((m) => linhaPessoa(st, m, !!(st.vizinhos && f.chefe === m))).join("") || `<p class="faint" style="margin:8px 0">Família automática: ninguém da turma aqui.</p>`}</div>
      ${autos ? `<small class="faint" style="display:block;padding:0 12px 8px">+ ${autos} ${st.vizinhos ? (hum.length ? "parentes automáticos" : "vizinhos automáticos") : "automáticos"}</small>` : ""}</section>`;
  }).join("");
}

function menuModal(st) {
  const p = menuId && st.alunos[menuId];
  if (!p) { menuId = null; return ""; }
  const f = st.fams[p.fam], sem = semSinal(menuId), apos = st.fase !== "entrada" && !!f;
  const outras = Object.values(st.fams).filter((x) => x.id !== p.fam);
  const b = [];
  if (apos && st.vizinhos && f.chefe !== menuId && f.membros.some((m) => st.alunos[m]?.auto)) b.push(`<button class="btn" data-a="chefe">Promover a chefe da família</button>`);
  if (st.fase === "alvara" && st.alvara?.pessoa !== menuId) b.push(`<button class="btn" data-a="sorteado">Ser a pessoa sorteada da proposta grande</button>`);
  if (apos && outras.length) {
    b.push(`<button class="btn sec" data-a="sortear-fam">Sortear para outra família</button>`, `<button class="btn sec" data-a="mover-esc">Mover para uma família… ${escolhendo ? "▲" : "▼"}</button>`);
    if (escolhendo) b.push(`<div class="pp-opcoes">${outras.map((o) => `<button class="pp-fam-op" style="--fam:${o.cor};--fam2:${o.cor2}" data-a="mover" data-fam="${o.id}">${iconeFamilia(o, 34)}<b>${esc(o.nome)}</b><small>${humanosDe(st, o)} pessoas</small></button>`).join("")}</div>`);
  }
  b.push(`<button class="btn red" data-a="expulsar">Expulsar da sala</button>`, `<button class="btn sec" data-a="fechar-menu">Fechar</button>`);
  return `<div class="pp-fundo" data-a="fechar-menu"><div class="pp-menu-card" data-a="nada"><div class="pp-tit" style="margin:0">${f ? esc(f.nome) : "Na sala"}${sem ? " · sem sinal" : ""}</div><h3>${esc(p.nome)}</h3>
    ${sem ? `<p class="pp-aviso red" style="margin:0">Sem sinal há ${tempoSem(sem)}: a tela dela não está aberta.</p>` : ""}${b.join("")}</div></div>`;
}
const humanosDe = (st, f) => f.membros.filter((m) => !st.alunos[m]?.auto).length;

export function renderProfessor(st) {
  ultimoSt = st;
  return corpoProfessor(st) + menuModal(st);
}
function corpoProfessor(st) {
  const p = progresso(st);
  const fase = FASES[st.k];
  let extra = "";
  if (st.fase === "entrada") {
    const pl = st.ordem.length >= MIN_PESSOAS ? planoVila(st.ordem.length) : null;   // R38: a partir de 2, com vizinhos automáticos abaixo de 12
    extra = `<div class="card" style="padding:12px"><b>${st.ordem.length} participantes → ${pl ? `${pl.nf} famílias` : "faltam participantes"}</b><p class="faint" style="margin:4px 0 0">${pl?.vizinhos ? `Abaixo de 12, a vila se completa com ${pl.autos} vizinhos automáticos.${st.ordem.length <= 8 ? " Cada pessoa chefia uma família; os parentes automáticos seguem as decisões dela." : ""} Os totais do telão somam pessoas e vizinhos automáticos.` : `Mínimo de ${MIN_PESSOAS} participantes; de 12 a 40, só gente.`}</p></div>
      <button class="btn ok block" data-a="sortear" ${pl ? "" : "disabled"}>Formar as famílias</button>` + listaEntrada(st) + relogioAula(st) + ROTEIRO_PROFISSAO;
  } else {
    extra = painelFamilias(st);
    const podeTrocar = st.ano < 4 || (st.ano === 4 && st.fase === "abertura");
    if (st.fase !== "fechamento") extra = relogioAula(st) + cartasDaPartida(st) + `<div class="card" style="padding:10px 12px"><div class="row"><b class="grow">Carta do ano 4</b><button class="btn sm ${st.semTroco ? "sec" : "ok"}" data-a="troco" ${podeTrocar ? "" : "disabled"}>${st.semTroco ? "Desligada" : "Ligada"}</button></div><p class="faint" style="font-size:12px;margin:4px 0 0">Honestidade (como o dado da sorte) ou confiança. Ligada por padrão; desligue se a aula atrasar (economiza cerca de 1 min).</p></div>
      <div class="card" style="padding:10px 12px"><div class="row"><b class="grow">Conversas curtas</b><button class="btn sm ${st.curto ? "ok" : "sec"}" data-a="curto">${st.curto ? "Ligadas" : "Desligadas"}</button></div><p class="faint" style="font-size:12px;margin:4px 0 0">Se ainda faltar tempo: conversa antes do voto em 60 s e conversa da família em 30 s nos anos 4 e 5 (economiza cerca de 1 min).</p></div>` + extra;
  }
  const anos = st.ano ? `Ano ${st.ano} de 5 · regra ${REGRAS_TXT[st.regra].nome}` : "Antes do ano 1";
  const todos = !!(p && p.total && p.feito >= p.total && st.fase !== "fechamento");   // R24: a simulação supõe que a etapa fecha uns 5 s depois do último envio; o painel avisa quem conduz
  return `<div class="col"><div class="row"><span class="badge" style="background:#7c3aed">P</span><div class="grow"><b>Professor</b><div class="faint" style="font-size:12px">${anos}</div></div></div>
    <div class="card" style="padding:12px"><div class="faint" style="font-size:12px">Etapa ${st.k + 1} de ${FASES.length}</div><h3>${esc(nomeFase(st))}</h3>
    ${p && p.total ? `<div class="row" style="justify-content:space-between;margin-top:6px"><span class="muted">${p.rot}</span><b class="mono">${p.feito}/${p.total}</b></div><div class="prog" style="height:8px"><i style="width:${(100 * p.feito) / p.total}%"></i></div>` : ""}
    <div class="row" style="margin-top:10px"><button class="btn sec grow" data-a="fase" data-val="-1" ${st.k <= 1 || !st.pilha?.length ? "disabled" : ""}>Voltar</button><button class="btn grow${todos ? " ok pronto" : ""}" data-a="fase" data-val="1" ${st.k === 0 || st.fase === "fechamento" ? "disabled" : ""}>${todos ? "Todos enviaram: avançar" : "Avançar"}</button></div>${todos ? `<p class="faint" style="font-size:12px;margin:6px 0 0">Avance em poucos segundos: a turma já espera.</p>` : ""}
    <p class="faint" style="font-size:12px;margin:8px 0 0">${RODAPE_ETAPA[st.fase] ?? ""}</p></div>${st.fase === "resultado" ? controlePaineis(st) : ""}${st.fase === "fechamento" ? `<div class="card" style="padding:12px"><b>Pergunta ${(st.pergunta || 0) + 1} de 5 no telão</b><div class="row" style="margin-top:8px"><button class="btn sec grow" data-a="pergunta" data-val="-1" ${(st.pergunta || 0) <= 0 ? "disabled" : ""}>◀ Anterior</button><button class="btn grow" data-a="pergunta" data-val="1" ${(st.pergunta || 0) >= 4 ? "disabled" : ""}>Próxima ▶</button></div></div>${(st.pergunta || 0) === 4 ? ROTEIRO_PROFISSAO : ""}${relogioAula(st)}` : ""}${extra}</div>`;
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
    // R43: menu de ações de cada pessoa
    case "menu": menuId = el.dataset.id; escolhendo = false; return true;
    case "fechar-menu": menuId = null; escolhendo = false; return true;
    case "mover-esc": escolhendo = !escolhendo; return true;
    case "chefe": dispatch({ t: "chefe", id: menuId }); menuId = null; return true;
    case "sorteado": dispatch({ t: "sorteado", id: menuId }); menuId = null; return true;
    case "sortear-fam": dispatch({ t: "mover", id: menuId, fam: "sorteio" }); menuId = null; escolhendo = false; return true;
    case "mover": dispatch({ t: "mover", id: menuId, fam: el.dataset.fam }); menuId = null; escolhendo = false; return true;
    case "expulsar": {
      const nome = ultimoSt?.alunos?.[menuId]?.nome || "esta pessoa";
      if (!confirm(`Expulsar ${nome} da sala? O nome fica livre para uma nova entrada.`)) return false;
      dispatch({ t: "remover", id: menuId }); menuId = null; escolhendo = false; return true;
    }
    default: return false;
  }
}
