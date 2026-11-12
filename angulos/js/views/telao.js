import { FASES, progresso, papelById, destinoRelato, corrente, desfecho, placarClassificacao, acertoViagem, grupoDoPapel } from "../engine.js";
import { PARADAS } from "../content/roteiro.js";
import { PAPEIS, PESSOAS, ALTERNATIVAS, DIMENSOES, PAPEL_NA_SITUACAO, ABERTURA, CONCLUSAO, CARTAS, txt } from "../content/cena.js";

const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const badge = (g, sz = "") => { const p = papelById(g.papel); return `<span class="badge" style="background:${p.cor};${sz}">${g.i + 1}</span>`; };

function topo(st, titulo) {
  const k = FASES.findIndex((f) => f.id === st.fase);
  const p = progresso(st);
  return `<div class="top"><div class="grow"><div class="fase">Ângulos · ${k + 1}. ${FASES[k].nome}</div><h1>${titulo}</h1></div>
    ${p && p.total ? `<div style="width:22cqw"><div class="row" style="justify-content:space-between"><span class="muted">${p.rot}</span><b class="mono">${p.feito}/${p.total}</b></div><div class="prog"><i style="width:${(100 * p.feito) / p.total}%"></i></div></div>` : ""}</div>`;
}

const grade = (gs, fn, cols = 4) => `<div class="grid" style="grid-template-columns:repeat(${Math.min(gs.length, cols)},1fr)">${gs.map(fn).join("")}</div>`;

export function renderTelao(st) {
  const gs = Object.values(st.grupos);
  const P = st.pers;
  let body = "";
  switch (st.fase) {
    case "entrada":
      body = topo(st, "Ângulos: deliberação ética") + `<div class="grid" style="grid-template-columns:1fr 1fr;flex:1"><div class="card col" style="justify-content:center"><div class="fase">Código da sala</div><div class="mono" style="font-size:6cqw;font-weight:800;letter-spacing:.1em">SIM-01</div><p class="big muted">Entre pelo celular e digite seu nome.</p></div>
        <div class="card"><h3>${st.ordem.length} na sala</h3><div class="row" style="margin-top:1cqw;gap:.6cqw">${st.ordem.map((id) => `<span class="chip">${esc(st.alunos[id].nome)}</span>`).join("")}</div></div></div>`;
      break;
    case "grupos":
      body = topo(st, "Encontre o seu papel") + grade(gs, (g) => `<div class="card"><div class="row">${badge(g)}<b>${esc(papelById(g.papel).nome)}</b></div><p class="muted">${g.membros.map((m) => esc(st.alunos[m].nome)).join(", ")}</p><span class="chip">${Object.keys(g.achou).length}/${g.membros.length} acharam</span></div>`);
      break;
    case "lider":
      body = topo(st, "Cada papel escolhe seu líder") + `<p class="big muted">Votação (ninguém vota em si) ou sorteio pelo sistema: o grupo decide. Só o líder envia as respostas do grupo.</p>` +
        grade(gs, (g) => `<div class="card"><div class="row">${badge(g)}<b>${esc(papelById(g.papel).nome)}</b></div><p class="big">${g.lider ? `Líder: <b>${esc(st.alunos[g.lider].nome)}</b>` : g.metodo === "votar" ? `Votando… ${Object.keys(g.votos).length}/${g.membros.length}` : `Decidindo o método… ${Object.keys(g.metodoVotos).length}/${g.membros.length}`}</p></div>`);
      break;
    case "viagem": {
      const stats = PARADAS.map((pa) => { let tot = 0, ok = 0; for (const id of st.ordem) { const r = st.resp[id].viagem.r[pa.id]; if (r != null) { tot++; if (r === pa.pergunta.certa) ok++; } } return { pa, tot, ok }; });
      const cartas = {}; st.ordem.forEach((id) => st.resp[id].viagem.mochila.forEach((k) => (cartas[k] = (cartas[k] || 0) + 1)));
      body = topo(st, "Viagem pelo roteiro de deliberação") + `<div class="grid" style="grid-template-columns:2fr 1fr;flex:1"><div class="grid" style="grid-template-columns:repeat(2,1fr)">${stats.map(({ pa, tot, ok }) => `<div class="card"><b>${pa.titulo}</b><div class="row" style="justify-content:space-between;margin-top:.4cqw"><span class="muted">${tot} responderam</span><b class="mono">${tot ? Math.round((100 * ok) / tot) : 0}%</b></div><div class="prog"><i style="width:${tot ? (100 * ok) / tot : 0}%"></i></div></div>`).join("")}</div>
        <div class="card"><h3>🎒 Cartas mais levadas</h3>${Object.entries(cartas).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([k, n]) => `<div class="row" style="justify-content:space-between;margin-top:.4cqw"><span>${esc(CARTAS[k].nome)}</span><b class="mono">${n}</b></div>`).join("") || `<p class="muted">—</p>`}</div></div>`;
      break;
    }
    case "cena":
      body = topo(st, "Academia, 19h") + `<div class="card"><p class="big">${esc(ABERTURA)}</p></div>` +
        grade(gs, (g) => { const p = papelById(g.papel); return `<div class="card"><div class="row">${badge(g)}<b>${esc(p.nome)}</b></div><p class="muted">${esc(p.abertura)}</p></div>`; });
      break;
    case "posto":
      body = topo(st, "Cada papel vê só a sua parte") + grade(gs, (g) => `<div class="card"><div class="row">${badge(g)}<b>${esc(papelById(g.papel).nome)}</b></div><p class="big">${g.h1 ? "✓ grupo enviou" : "…"}</p><span class="chip">${g.membros.filter((m) => st.resp[m].posto).length}/${g.membros.length} individuais</span></div>`) +
        `<p class="big muted" style="text-align:center">Primeiro cada um responde sozinho, com a sua foto. Depois o grupo vê todas as fotos do papel, e o líder envia a deliberação e um relato para outro papel.</p>`;
      break;
    case "canais":
      body = topo(st, "Canais: quem contou o quê para quem") + `<p class="big muted">Cada papel recebeu o relato de outro. Não viu as fotos, só o que foi contado.</p>` +
        `<div class="col">${gs.filter((g) => g.relato).map((g) => { const d = st.grupos[destinoRelato(st, g)]; return `<div class="card row">${badge(g)}<b>${esc(papelById(g.papel).nome)}</b><span style="font-size:2cqw">→</span>${d ? badge(d) + `<b>${esc(papelById(d.papel).nome)}</b>` : "—"}<span class="grow"></span><span class="chip">${g.relato.vimos.length} frases</span></div>`; }).join("") || `<p class="muted big">Aguardando relatos…</p>`}</div>`;
      break;
    case "laboratorio":
      body = topo(st, "Laboratório de decisões") + grade(gs, (g) => `<div class="card"><div class="row">${badge(g)}<b>${esc(papelById(g.papel).nome)}</b></div><p class="big">${g.h2 ? "✓ decidiu" : "testando…"}</p></div>`) +
        `<p class="big muted" style="text-align:center">Cada papel testa as suas ações e vê o que muda em duas semanas. Algumas coisas só se resolvem se outro papel agir.</p>`;
      break;
    case "confronto": {
      const elos = corrente(st);
      body = topo(st, "A cena inteira") + `<div class="grid" style="grid-template-columns:1.55fr 1fr;flex:1;min-height:0">
        <div id="slot3d" class="card" style="padding:0;overflow:hidden;position:relative;min-height:0"><div style="position:absolute;left:0;right:0;bottom:0;z-index:2;padding:.6cqw .9cqw;background:linear-gradient(transparent,rgba(2,6,23,.85));font-size:.95cqw;line-height:1.5">${Object.entries(PESSOAS).filter(([k]) => k !== "turma").map(([, v]) => `<span style="white-space:nowrap;margin-right:1cqw"><b>${esc(txt(v.nome, P))}</b> <span class="muted">· ${esc(v.desc.toLowerCase())}</span></span>`).join(" ")}</div></div>
        <div class="col" style="overflow:hidden">
          <div class="card"><h3>Fato ou interpretação?</h3>${gs.map((g) => { const pl = placarClassificacao(g.h1?.classif); return `<div class="row" style="justify-content:space-between;margin-top:.4cqw">${badge(g, "width:1.9cqw;height:1.9cqw")}<span class="grow">${esc(papelById(g.papel).nome)}</span><b class="mono">${pl.ok}/${pl.tot}</b>${pl.interpComoFato ? `<span class="pill-bad">${pl.interpComoFato} interp. como fato</span>` : ""}</div>`; }).join("")}</div>
          <div class="card" style="flex:1;overflow:hidden"><h3>O que viajou pelos canais</h3>${elos.slice(0, 5).map((e) => `<div style="margin-top:.6cqw">${badge(st.grupos[e.de], "width:1.6cqw;height:1.6cqw")} → ${badge(st.grupos[e.para], "width:1.6cqw;height:1.6cqw")} <span class="muted">contou como fato:</span> "${esc(e.frase.t)}" ${e.acao ? `<br><span class="pill-bad">e o outro papel decidiu: ${esc(txt(e.acao.t, P))}</span>` : ""}</div>`).join("") || `<p class="muted">Nenhuma interpretação foi passada como fato.</p>`}</div>
        </div></div>`;
      break;
    }
    case "linhas": {
      const res = desfecho(st);
      const g = st.grupos[st.spot] || gs[0];
      body = topo(st, "Duas semanas depois") + `<div class="grid" style="grid-template-columns:1.4fr 1fr;flex:1;min-height:0">
        <div class="grid" style="grid-template-columns:1fr 1fr;align-content:start">${Object.entries(DIMENSOES).map(([k, d]) => `<div class="card" style="border-left:.5cqw solid ${res[k].estado === "bem" ? "var(--ok)" : res[k].estado === "mal" ? "var(--bad)" : "var(--warn)"};border-radius:0 1.2cqw 1.2cqw 0"><b>${esc(txt(d.nome, P))}</b><p style="margin:.4cqw 0 0;font-size:1.15cqw">${esc(txt(res[k].estado === "bem" ? d.bem : res[k].estado === "mal" ? d.mal : "Ninguém apurou nem acusou: as suspeitas ficaram no ar.", P))}</p></div>`).join("")}</div>
        ${g ? `<div class="card col"><div class="row">${gs.map((x) => `<span style="${x.id === g.id ? "outline:.25cqw solid #fff;border-radius:1cqw" : "opacity:.45"}">${badge(x)}</span>`).join("")}</div>
          <h2>${esc(papelById(g.papel).nome)}</h2>
          <div><span class="fase">No posto</span><p class="big" style="margin:.2cqw 0">${esc(txt(ALTERNATIVAS[g.papel].find((a) => a.id === g.h1?.acao)?.t || "—", P))}</p></div>
          <div><span class="fase">Depois do laboratório · ${g.h2 ? { mantem: "manteve", ajusta: "ajustou", abandona: "trocou" }[g.h2.decisao] : "—"}</span>${(g.h2?.acoes || []).map((id) => `<p class="big" style="margin:.2cqw 0">${esc(txt(ALTERNATIVAS[g.papel].find((a) => a.id === id)?.t, P))}</p>`).join("") || "<p>—</p>"}</div>
          <p class="muted">${esc(g.h2?.porque || g.h1?.porque || "")}</p>
          <div class="row">${(g.h2?.cartas || g.h1?.cartas || []).map((k) => `<span class="chip law">${esc(CARTAS[k]?.nome)}</span>`).join("")}</div>
          <div><span class="fase">Previsão do grupo se nada fosse feito</span><p style="margin:.2cqw 0">${[["kaua", "jovem"], ["bia", "mulher de rosa"], ["lara", "estagiária"]].map(([k, n]) => `${n}: <b>${g.h1?.prev?.[k] || "—"}</b>`).join(" · ")}</p></div></div>` : ""}</div>`;
      break;
    }
    case "integracao": {
      const rows = PAPEIS.filter((p) => grupoDoPapel(st, p.id)).map((p) => {
        const g = grupoDoPapel(st, p.id);
        const resp = g.h2?.papel || g.h1?.papel;
        const ok = p.gabarito.includes(g.h1?.papel);
        const pl = placarClassificacao(g.h1?.classif);
        return `<tr><td>${badge(g, "width:2cqw;height:2cqw")}</td><td><b>${esc(p.nome)}</b></td><td>${g.h1?.papel ? PAPEL_NA_SITUACAO[g.h1.papel].replace("Meu papel ", "") : "—"} <span class="${ok ? "pill-ok" : "pill-bad"}">${ok ? "✓" : "✗"}</span></td><td>${p.gabarito.map((k) => PAPEL_NA_SITUACAO[k].replace("Meu papel ", "")).join(" / ")}</td><td class="n">${pl.ok}/${pl.tot}</td><td>${g.h2 ? { mantem: "manteve", ajusta: "ajustou", abandona: "trocou" }[g.h2.decisao] : "—"}</td></tr>`;
      }).join("");
      const vi = st.ordem.map((id) => acertoViagem(st.resp[id]));
      const tot = vi.reduce((a, b) => a + b.tot, 0), ok = vi.reduce((a, b) => a + b.ok, 0);
      const res = desfecho(st);
      const bem = Object.values(res).filter((x) => x.estado === "bem").length;
      body = topo(st, "A soma dos papéis") + `<div class="card"><p class="big">${esc(CONCLUSAO)}</p></div><div class="card"><table class="vals" style="font-size:1.15cqw"><tr><th></th><th>Papel</th><th>Como o grupo se viu</th><th>Leitura do caso</th><th>Fato × interp.</th><th>Laboratório</th></tr>${rows}</table></div>
        <div class="grid" style="grid-template-columns:repeat(3,1fr)"><div class="card"><h3>Viagem</h3><p class="big">${tot ? Math.round((100 * ok) / tot) : 0}% de acertos</p></div><div class="card"><h3>Duas semanas depois</h3><p class="big">${bem} de ${Object.keys(res).length} situações protegidas</p></div><div class="card"><h3>Bilhete de saída</h3><p class="muted">O que você tratou como fato e era interpretação?</p></div></div>`;
      break;
    }
    default: body = topo(st, "");
  }
  return `<div class="tin">${body}</div>`;
}

export const nomesReais = (P) => Object.fromEntries(Object.entries(PESSOAS).map(([k, v]) => [k, txt(v.nome, P)]));
