import { FASES, progresso, valoresDoCaso, contrafactual, resumoGrupo, placar, acertoViagem } from "../engine.js";
import { POSTOS, PARADAS, MECANISMOS, LEIS } from "../content/viagem.js";
import { casoById, CURSOS, PAPEIS } from "../content/casos.js";
import { fmtVar, VAR_META, CURTO } from "../model.js";
import { metroSVG, esc } from "./metro.js";

const nomePosto = (id) => POSTOS.find((p) => p.id === id)?.nome || id;
const curtoPosto = (id) => POSTOS.find((p) => p.id === id)?.curto || id;
const mecNome = (id) => MECANISMOS.find((m) => m.id === id)?.nome || "—";
const unit = (v) => (VAR_META[v].unit ? " " + VAR_META[v].unit : "");

function grupoDoPosto(st, pid) { return Object.values(st.grupos).find((g) => g.posto === pid); }

function topo(st, titulo) {
  const k = FASES.findIndex((f) => f.id === st.fase);
  const p = progresso(st);
  return `<div class="top">
    <div class="grow"><div class="fase">Viagem do O₂ · ${k + 1}. ${FASES[k].nome}</div><h1>${titulo}</h1></div>
    ${p && p.total ? `<div style="width:22cqw"><div class="row" style="justify-content:space-between"><span class="muted">${p.rot}</span><b class="mono">${p.feito}/${p.total}</b></div><div class="prog"><i style="width:${(100 * p.feito) / p.total}%"></i></div></div>` : ""}
  </div>`;
}

function estacoesStatus(st, fn) {
  const e = {};
  for (const g of Object.values(st.grupos)) e[g.posto] = { cor: g.cor.hex, rotulo: g.cor.nome, ...fn(g) };
  for (const p of POSTOS) if (!e[p.id]) e[p.id] = { apagado: !!Object.keys(st.grupos).length };
  return e;
}

export function renderTelao(st) {
  const caso = casoById(st.casoId);
  const gs = Object.values(st.grupos);
  const nomes = (g) => g.membros.map((id) => st.alunos[id]?.nome).join(", ");
  let body = "";
  switch (st.fase) {
    case "entrada":
      body = topo(st, "Embarque") + `<div class="grid" style="grid-template-columns: 1.1fr 1fr; flex:1">
        <div class="card col" style="justify-content:center"><div class="fase">Código da sala</div><div class="mono" style="font-size:6cqw;font-weight:800;letter-spacing:.1em">${esc(st.codigo || "SIM-01")}</div>
        <p class="big muted">Entre pelo celular e digite seu nome.</p><p class="muted">${CURSOS[caso.curso]} · caso escolhido pelo professor</p></div>
        <div class="card"><h3>${st.ordem.length} a bordo</h3><div class="row" style="margin-top:1cqw;gap:.6cqw">${st.ordem.map((id) => `<span class="chip">${esc(st.alunos[id].nome)}</span>`).join("")}</div></div></div>`;
      break;
    case "grupos":
      body = topo(st, "Encontre seu grupo") + metroSVG(estacoesStatus(st, (g) => ({ status: Object.keys(g.achou).length === g.membros.length ? "✓" : `${Object.keys(g.achou).length}/${g.membros.length}` }))) +
        `<div class="grid" style="grid-template-columns:repeat(${Math.min(gs.length, 4)},1fr)">${gs.map((g) => `<div class="card"><div class="row"><span class="badge" style="background:${g.cor.hex}">${g.i + 1}</span><b>${g.cor.nome}</b></div><div class="muted" style="margin-top:.4cqw">${esc(nomes(g))}</div></div>`).join("")}</div>`;
      break;
    case "lider":
      body = topo(st, "Cada grupo escolhe seu líder") + `<p class="big muted">O grupo decide no celular: votação (ninguém vota em si mesmo) ou sorteio pelo sistema. Só o líder envia as respostas da equipe.</p>
        <div class="grid" style="grid-template-columns:repeat(${Math.min(gs.length, 4)},1fr)">${gs.map((g) => `<div class="card"><div class="row"><span class="badge" style="background:${g.cor.hex}">${g.i + 1}</span><b>${g.cor.nome}</b></div>
        <p class="big">${g.lider ? `Líder: <b>${esc(st.alunos[g.lider].nome)}</b>` : g.metodo === "votar" ? `Votando… ${Object.keys(g.votos).length}/${g.membros.length}` : `Decidindo o método… ${Object.keys(g.metodoVotos).length}/${g.membros.length}`}</p>
        ${g.metodo ? `<span class="chip">${g.metodo === "votar" ? "por votação" : "por sorteio"}</span>` : ""}</div>`).join("")}</div>`;
      break;
    case "viagem": {
      const stats = PARADAS.map((p) => {
        let tot = 0, ok = 0;
        for (const id of st.ordem) { const r = st.resp[id].viagem.r[p.id]; if (r != null) { tot++; if (r === p.pergunta.certa) ok++; } }
        return { p, tot, ok };
      });
      body = topo(st, "A viagem de uma molécula de O₂") + `<p class="big muted">Revisão individual: em cada parada, as leis e os valores de repouso e de exercício. Você pode levar só 3 valores na mochila.</p>
        <div class="grid" style="grid-template-columns:repeat(3,1fr);flex:1">${stats.map(({ p, tot, ok }, i) => `<div class="card"><div class="row"><span class="badge" style="background:#1e3a5f">${i + 1}</span><b>${p.titulo}</b></div>
        <div class="row" style="margin-top:.5cqw">${p.leis.map((l) => `<span class="chip law">${LEIS[l].nome}</span>`).join("")}</div>
        <div class="row" style="margin-top:.6cqw;justify-content:space-between"><span class="muted">${tot} responderam</span><b class="mono">${tot ? Math.round((100 * ok) / tot) : 0}% acertos</b></div><div class="prog"><i style="width:${tot ? (100 * ok) / tot : 0}%"></i></div></div>`).join("")}</div>`;
      break;
    }
    case "caso":
      body = topo(st, caso.titulo) + `<div class="grid" style="grid-template-columns:1.4fr 1fr;flex:1">
        <div class="card"><div class="fase">${CURSOS[caso.curso]}</div><h2 style="margin:.4cqw 0 1cqw">${esc(caso.personagem)}</h2><p class="big">${esc(caso.abertura)}</p></div>
        <div class="col">${metroSVG(estacoesStatus(st, () => ({})))}<p class="big muted">Cada equipe vai olhar o caso a partir da sua estação, só com memória e um número.</p></div></div>`;
      break;
    case "posto":
      body = topo(st, "Nos postos: só memória") + metroSVG(estacoesStatus(st, (g) => ({ status: g.h1 ? "✓" : "…", valor: `${g.membros.filter((id) => st.resp[id].posto).length}/${g.membros.length} individuais` }))) +
        `<p class="big muted" style="text-align:center">Primeiro cada um responde sozinho. Depois o grupo discute e o líder envia a hipótese da equipe.</p>`;
      break;
    case "telegrafo": {
      const arcs = gs.filter((g) => g.bilhete).map((g) => `<div class="card row"><span class="badge" style="background:${g.cor.hex}">${g.i + 1}</span><b>${curtoPosto(g.posto)}</b><span style="font-size:2cqw">→</span><span class="badge" style="background:${st.grupos[g.bilhete.para].cor.hex}">${st.grupos[g.bilhete.para].i + 1}</span><b>${curtoPosto(st.grupos[g.bilhete.para].posto)}</b></div>`).join("");
      body = topo(st, "Telégrafo: um bilhete por estação") + `<p class="big muted">Cada líder pode mandar um único bilhete curto para outra estação. Escolham bem o que dizer.</p>
        <div class="grid" style="grid-template-columns:1.3fr 1fr">${metroSVG(estacoesStatus(st, (g) => ({ status: g.bilhete ? "✉" : "…" })))}<div class="col">${arcs || `<p class="muted big">Aguardando bilhetes…</p>`}</div></div>`;
      break;
    }
    case "laboratorio": {
      body = topo(st, "Laboratório: memória encontra os valores") + metroSVG(estacoesStatus(st, (g) => {
        const pl = placar(st.casoId, g.posto, g.h1?.prev);
        return { status: g.h2 ? "✓" : "…", valor: `${pl.filter((x) => x.dirOk).length}/3 · ${pl.filter((x) => x.faixaOk).length}/3` };
      })) + `<p class="big muted" style="text-align:center">Abaixo de cada estação: acertos de memória em direção · faixa. Os valores reais aparecem ao lado do que a equipe lembrava. Mexam nas variáveis do seu posto e decidam: manter, ajustar ou abandonar a hipótese.</p>`;
      break;
    }
    case "desfecho": {
      const { base, real } = valoresDoCaso(st.casoId);
      const est = {};
      for (const p of POSTOS) {
        const gab = caso.postos[p.id];
        const v = p.vars[0];
        est[p.id] = { cor: { origem: "#f43f5e", compensa: "#f59e0b", consequencia: "#8b5cf6", normal: "#10b981" }[gab.papel], rotulo: { origem: "origem", compensa: "compensa", consequencia: "consequência", normal: "normal" }[gab.papel], valor: `${CURTO[v]} ${fmtVar(v, real[v])}${unit(v)}`, destaque: gab.papel === "origem" ? "#fbbf24" : null };
      }
      body = topo(st, "O que aconteceu") + `<div class="grid" style="grid-template-columns:1.25fr 1fr;flex:1;align-items:start"><div>${metroSVG(est, { grande: true, alt: 480 })}
        <div class="row" style="justify-content:center;gap:1.4cqw">${[["#f43f5e", "origem"], ["#f59e0b", "compensa"], ["#8b5cf6", "consequência"], ["#10b981", "normal"]].map(([c, t]) => `<span class="row" style="gap:.4cqw"><i style="width:1cqw;height:1cqw;border-radius:50%;background:${c};display:inline-block"></i>${t}</span>`).join("")}</div></div>
        <div class="card"><h3>${esc(caso.personagem)}</h3><p class="big" style="font-size:1.32cqw">${esc(caso.desfecho)}</p><div class="row">${caso.leis.map((l) => `<span class="chip law">${LEIS[l].nome}</span>`).join("")}</div></div></div>`;
      break;
    }
    case "linhas": {
      const g = st.grupos[st.spot] || gs[0];
      if (!g) { body = topo(st, "Linhas do tempo"); break; }
      const { real } = valoresDoCaso(st.casoId);
      const res = resumoGrupo(st, g);
      const chave = ["pao2", "sao2", "cao2", "dc", "pam", "lactate", "svo2"];
      const linha = (mecId, titulo) => {
        const cf = caso.aceitos.includes(mecId) ? real : contrafactual(st.casoId, mecId);
        return `<tr><th style="font-size:1cqw;color:var(--tx)">${titulo}<br><span class="muted" style="font-weight:500">${esc(mecNome(mecId))}</span></th>${chave.map((v) => { const dif = Math.abs(cf[v] - real[v]) / Math.max(Math.abs(real[v]), 1e-6) > 0.08; return `<td class="n" style="color:${dif ? "var(--bad)" : "var(--ok)"}">${fmtVar(v, cf[v])}</td>`; }).join("")}</tr>`;
      };
      body = topo(st, `Linha do tempo — Estação ${curtoPosto(g.posto)}`) + `<div class="row">${gs.map((x) => `<span class="badge" style="background:${x.cor.hex};${x.id === g.id ? "outline:3px solid #fff" : "opacity:.5"}">${x.i + 1}</span>`).join("")}</div>
        <div class="grid" style="grid-template-columns:1fr 1fr">
          <div class="card"><div class="fase">Antes da simulação (H1)</div><p class="big"><b>${esc(mecNome(g.h1?.mec))}</b></p><p class="muted">${esc(g.h1?.porque || "")}</p><span class="${res.h1Ok ? "pill-ok" : "pill-bad"}">${res.h1Ok ? "compatível com o caso" : "não explica o caso"}</span></div>
          <div class="card"><div class="fase">Depois da simulação (H2) · ${g.h2 ? { mantem: "manteve", ajusta: "ajustou", abandona: "abandonou" }[g.h2.decisao] : "—"}</div><p class="big"><b>${esc(mecNome(g.h2?.mec))}</b></p><p class="muted">${esc(g.h2?.porque || "")}</p><span class="${res.h2Ok ? "pill-ok" : "pill-bad"}">${res.h2Ok ? "compatível com o caso" : "não explica o caso"}</span></div>
        </div>
        <div class="card"><h3>E se a explicação da equipe fosse verdade?</h3><table class="vals" style="font-size:1.25cqw;margin-top:.6cqw;table-layout:fixed"><tr><th style="width:22%"></th>${chave.map((v) => `<th style="text-align:right;font-size:1cqw">${CURTO[v]}<br><span class="faint">${VAR_META[v].unit}</span></th>`).join("")}</tr>
          ${g.h1 ? linha(g.h1.mec, "Pela H1") : ""}${g.h2 && g.h2.mec !== g.h1?.mec ? linha(g.h2.mec, "Pela H2") : ""}
          <tr><th style="font-size:1cqw;color:var(--o2)">O que se observou</th>${chave.map((v) => `<td class="n" style="color:var(--o2)">${fmtVar(v, real[v])}</td>`).join("")}</tr></table>
          <p class="muted">Verde: o atleta dessa linha do tempo bate com o observado. Vermelho: não bate.</p></div>`;
      break;
    }
    case "integracao": {
      const rows = POSTOS.filter((p) => grupoDoPosto(st, p.id)).map((p) => {
        const g = grupoDoPosto(st, p.id);
        const res = resumoGrupo(st, g);
        const pl = placar(st.casoId, p.id, g.h1?.prev);
        return `<tr><td><span class="badge" style="background:${g.cor.hex};width:2cqw;height:2cqw">${g.i + 1}</span></td><td><b>${p.curto}</b></td><td>${PAPEIS[res.gab.papel]}</td>
          <td>${g.h2?.papel ? PAPEIS[g.h2.papel] : "—"} <span class="${res.papel2Ok ? "pill-ok" : "pill-bad"}">${res.papel2Ok ? "✓" : "✗"}</span></td>
          <td class="n">${pl.filter((x) => x.dirOk).length}/3</td><td>${res.revisao === "mudou" ? (res.h2Ok ? "mudou com evidência ✓" : "mudou, sem fechar") : res.revisao === "manteve" ? (res.h1Ok ? "manteve, certo ✓" : "manteve o erro") : "—"}</td></tr>`;
      }).join("");
      const viag = st.ordem.map((id) => acertoViagem(st.resp[id]));
      const tot = viag.reduce((a, b) => a + b.tot, 0), ok = viag.reduce((a, b) => a + b.ok, 0);
      body = topo(st, "A corrente inteira") + `<div class="card"><table class="vals" style="font-size:1.15cqw"><tr><th></th><th>Estação</th><th>Papel real no caso</th><th>Papel que a equipe deu</th><th>Memória (direção)</th><th>Revisão</th></tr>${rows}</table></div>
        <div class="grid" style="grid-template-columns:1fr 1fr"><div class="card"><h3>Viagem da turma</h3><p class="big">${tot ? Math.round((100 * ok) / tot) : 0}% de acertos nas paradas</p></div>
        <div class="card"><h3>Bilhete de saída</h3><p class="big muted">No celular: o que você lembrava errado, e isso mudou sua explicação?</p></div></div>`;
      break;
    }
    default: body = topo(st, "");
  }
  return `<div class="tin">${body}</div>`;
}
