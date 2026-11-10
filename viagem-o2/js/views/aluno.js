import { valoresDoCaso, placar } from "../engine.js";
import { POSTOS, PARADAS, MECANISMOS, LEIS } from "../content/viagem.js";
import { casoById, PAPEIS, paramsDoCaso } from "../content/casos.js";
import { compute, fmtVar, VAR_META, PARAM_META, CURTO } from "../model.js";
import { REPOUSO, EXERCICIO } from "../content/params-casos.js";
import { esc } from "./metro.js";

import { icon, PARADA_ICON } from "../visual.js";

const VREP = compute(REPOUSO), VEX = compute(EXERCICIO);
const u = (v) => (VAR_META[v].unit ? " " + VAR_META[v].unit : "");
const val = (v, r) => `${fmtVar(v, r[v])}${u(v)}`;

const mecNome = (id) => MECANISMOS.find((m) => m.id === id)?.nome || "—";

export function novoLocal() {
  return { nome: "", parada: 0, posto: { prev: {} }, gf: null, bilhete: { para: "", texto: "" }, lab: null, h2: { decisao: "" }, saida: "" };
}

function hd(st, me) {
  const g = me?.grupo ? st.grupos[me.grupo] : null;
  return `<div class="hd">${g ? `<span class="badge" style="background:${g.cor.hex}">${g.i + 1}</span>` : icon("o2", "small")}
    <div class="grow"><b>${esc(me?.nome || "Viagem do O₂")}</b><div class="faint" style="font-size:12px">${g ? `Grupo ${g.cor.nome}${g.lider === me.id ? " · líder" : ""}` : "Fisiologia em equipe"}</div></div>${g ? icon(g.posto, "small") : ""}</div>`;
}

const radio = (path, value, cur, label) => `<button class="opt ${cur === value ? "sel" : ""}" data-a="set" data-path="${path}" data-val="${esc(value)}">${label}</button>`;

function prevForm(path, posto, prev) {
  return posto.vars.map((v) => {
    const p = prev[v] || {};
    return `<div class="card" style="padding:12px"><b>${VAR_META[v].label}</b> <span class="faint">${VAR_META[v].unit}</span>
      <div class="dirs" style="margin:8px 0">${["↓", "=", "↑"].map((d) => `<button class="btn sm sec ${p.dir === d ? "on" : ""}" data-a="set" data-path="${path}.prev.${v}.dir" data-val="${d}">${d}</button>`).join("")}</div>
      <input type="number" inputmode="decimal" placeholder="valor aproximado (opcional)" data-in="${path}.prev.${v}.val" data-key="${path}-${v}" value="${p.val ?? ""}"></div>`;
  }).join("");
}

function hipoteseForm(path, d, posto, { comLei = true } = {}) {
  return `<h3>Qual mecanismo explica o caso?</h3>${MECANISMOS.map((m) => radio(`${path}.mec`, m.id, d.mec, m.nome)).join("")}
    <h3>Qual é o papel do seu posto?</h3>${Object.entries(PAPEIS).map(([k, t]) => radio(`${path}.papel`, k, d.papel, t)).join("")}
    ${comLei ? `<h3>Que lei explica o que acontece no seu posto?</h3><select data-in="${path}.lei" data-key="${path}-lei"><option value="">Escolha…</option>${Object.entries(LEIS).map(([k, l]) => `<option value="${k}" ${d.lei === k ? "selected" : ""}>${l.nome} — ${l.curto}</option>`).join("")}</select>` : ""}
    <h3>De memória: como estão as variáveis do seu posto?</h3><p class="faint" style="margin:0">Compare com o que você lembra do exercício normal. Direção é obrigatória; valor é opcional.</p>
    ${prevForm(path, posto, d.prev || {})}
    <h3>Por quê?</h3><textarea data-in="${path}.porque" data-key="${path}-porque" placeholder="Explique a cadeia de causa e efeito">${esc(d.porque || "")}</textarea>`;
}

function completo(d, posto) { return d && d.mec && d.papel && posto.vars.every((v) => d.prev?.[v]?.dir) && (d.porque || "").trim().length > 3; }

export function renderAluno(st, id, loc) {
  const me = st.alunos[id];
  const caso = casoById(st.casoId);
  const g = me?.grupo ? st.grupos[me.grupo] : null;
  const souLider = g && g.lider === id;
  const posto = g ? POSTOS.find((p) => p.id === g.posto) : null;
  let b = "";

  if (!me) {
    b = st.fase === "entrada" ? `<h2>Embarque</h2><p class="muted">Digite seu nome como o professor vai reconhecer.</p>
      <input type="text" data-in="nome" data-key="nome" value="${esc(loc.nome)}" placeholder="Seu nome"><button class="btn block" data-a="entrar">Entrar na sala</button>`
      : `<h2>A sala já começou</h2><p class="muted">Peça ao professor para entrar na próxima.</p>`;
    return hd(st, me) + `<div class="bd">${b}</div>`;
  }

  switch (st.fase) {
    case "entrada": b = `<div class="card waiting-card">${icon('o2', 'large')}<p class="eyebrow">SUA VIAGEM COMEÇA AQUI</p><h2>Você está a bordo</h2><p class="muted">Aguarde o professor sortear os grupos.<br>Em breve, você terá uma estação na viagem do O₂.</p><div class="waiting-dots" aria-hidden="true"><i></i><i></i><i></i></div></div>`; break;
    case "grupos": {
      const achou = g.achou[id];
      b = `<div class="team-pass"><span class="team-no">${String(g.i + 1).padStart(2, '0')}</span><div class="eyebrow">SUA EQUIPE NA VIAGEM</div>${icon(posto.id, 'large')}<div class="team-name">${g.cor.nome}</div><div class="team-station">Estação ${posto.curto}</div><div class="team-stripe" aria-hidden="true"></div></div>
        <p class="muted">Procure quem tem o mesmo número e a mesma cor na tela:</p><div class="row">${g.membros.filter((m) => m !== id).map((m) => `<span class="chip">${esc(st.alunos[m].nome)}</span>`).join("")}</div>
        ${achou ? `<p class="pill-ok">Pronto! Aguarde os demais.</p>` : `<button class="btn ok block" data-a="achei">Achei meu grupo</button>`}`;
      break;
    }
    case "lider": {
      if (g.lider) { b = g.lider === id ? `<h2>Você é o líder</h2><p>Só você envia as respostas da equipe. Antes de enviar, ouça o grupo e confira as respostas de todos.</p>` : `<h2>Líder: ${esc(st.alunos[g.lider].nome)}</h2><p class="muted">Só o líder envia a resposta da equipe. As respostas individuais continuam sendo suas.</p>`; break; }
      if (!g.metodo) {
        const meu = g.metodoVotos[id];
        b = `<h2>Como o grupo escolhe o líder?</h2><p class="muted">Vale a maioria. Empate: o sistema sorteia.</p>
          <button class="opt ${meu === "votar" ? "sel" : ""}" data-a="metodo" data-val="votar"><b>Votação</b><br><span class="faint">cada um vota em alguém do grupo, menos em si</span></button>
          <button class="opt ${meu === "sorteio" ? "sel" : ""}" data-a="metodo" data-val="sorteio"><b>O sistema sorteia</b></button>
          <p class="faint">${Object.keys(g.metodoVotos).length}/${g.membros.length} já escolheram</p>`;
      } else {
        const meu = g.votos[id];
        b = `<h2>Vote no líder</h2><p class="muted">Você não pode votar em si. Empate: sorteio entre os mais votados.</p>
          ${g.membros.filter((m) => m !== id).map((m) => `<button class="opt ${meu === m ? "sel" : ""}" data-a="votoLider" data-val="${m}">${esc(st.alunos[m].nome)}</button>`).join("")}
          <p class="faint">${Object.keys(g.votos).length}/${g.membros.length} votaram</p>`;
      }
      break;
    }
    case "viagem": {
      const resp = st.resp[id].viagem;
      const i = Math.min(loc.parada, PARADAS.length - 1);
      const p = PARADAS[i];
      const r = resp.r[p.id];
      const naMochila = (v) => resp.mochila.some((x) => x.v === v);
      b = `<div class="row" style="justify-content:space-between"><span class="chip">Parada ${i + 1} de ${PARADAS.length}</span><span class="chip">${icon("mochila", "inline")} ${resp.mochila.length}/3</span></div>
        <div class="trip-step" aria-label="Parada ${i + 1} de ${PARADAS.length}">${PARADAS.map((_, k) => `<span class="${k <= i ? 'passed' : ''}"></span>`).join('')}</div><div class="trip-title">${icon(PARADA_ICON[p.id] || p.id)}<h2>${p.titulo}</h2></div><div class="row">${p.leis.map((l) => `<span class="chip law">${LEIS[l].nome}</span>`).join("")}</div>
        <p>${p.texto}</p><div class="card mono" style="padding:10px 12px;font-size:13px">${p.calc}</div>
        <table class="vals"><tr><th>Variável</th><th style="text-align:right">Repouso</th><th style="text-align:right">Exercício</th><th></th></tr>
        ${p.valores.map((v) => `<tr><td>${VAR_META[v].label}</td><td class="n">${val(v, VREP)}</td><td class="n">${val(v, VEX)}</td>
          <td style="width:44px"><button class="btn sm ${naMochila(v) ? "warn on" : "sec"}" title="Guardar na mochila" data-a="mochila" data-v="${v}" ${!naMochila(v) && resp.mochila.length >= 3 ? "disabled" : ""}> ${icon("mochila", "inline")}</button></td></tr>`).join("")}</table>
        <p class="muted" style="font-size:14px">${p.exercicio}</p>
        <div class="card"><b>${p.pergunta.q}</b>${p.pergunta.op.map((o, k) => `<button class="opt ${r == null ? "" : k === p.pergunta.certa ? "right" : r === k ? "wrong" : ""}" data-a="viagemResp" data-val="${k}" ${r != null ? "disabled" : ""}>${o}</button>`).join("")}
        ${r != null ? `<p class="${r === p.pergunta.certa ? "pill-ok" : "pill-bad"}">${r === p.pergunta.certa ? "Isso." : "Não foi dessa vez."}</p><p class="muted">${p.pergunta.fb}</p>` : ""}</div>
        <div class="row"><button class="btn sec grow" data-a="parada" data-val="-1" ${i === 0 ? "disabled" : ""}>Anterior</button><button class="btn grow" data-a="parada" data-val="1" ${i === PARADAS.length - 1 ? "disabled" : ""}>Próxima</button></div>`;
      break;
    }
    case "caso":
      b = `<span class="chip">Olhe o telão</span><h2>${esc(caso.titulo)}</h2><b>${esc(caso.personagem)}</b><p>${esc(caso.abertura)}</p>
        <div class="card"><b>Sua estação: ${posto.nome}</b><p class="muted">No próximo passo você vê o caso a partir dela, só com memória e um número.</p></div>`;
      break;
    case "posto": {
      const info = caso.postos[g.posto];
      const { real } = valoresDoCaso(st.casoId);
      const ind = st.resp[id].posto;
      const mochila = st.resp[id].viagem.mochila;
      const topo = `<h2>Estação ${posto.curto}</h2><p>${esc(info.pista)}</p>
        ${info.ancora ? `<div class="anchor"><b>${fmtVar(info.ancora.v, real[info.ancora.v])}${u(info.ancora.v)}</b><span>${VAR_META[info.ancora.v].label}<br><span class="faint">${esc(info.ancora.fonte)}</span></span></div>` : ""}
        ${mochila.length ? `<div class="card" style="padding:12px"><b>${icon("mochila", "inline")} Sua mochila</b>${mochila.map((m) => `<div class="row" style="justify-content:space-between"><span>${VAR_META[m.v].label}</span><span class="mono">${m.valor}</span></div>`).join("")}</div>` : ""}`;
      if (!ind) {
        b = topo + `<div class="sep"></div><h3 style="color:var(--o2)">1. Sua resposta individual</h3>` + hipoteseForm("posto", loc.posto, posto) +
          `<button class="btn ok block" data-a="postoInd" ${completo(loc.posto, posto) ? "" : "disabled"}>Enviar minha resposta</button>`;
      } else if (souLider && !g.h1) {
        if (!loc.gf) loc.gf = structuredClone(ind);
        const outros = g.membros.map((m) => st.resp[m].posto).filter(Boolean);
        const cont = (k) => { const c = {}; outros.forEach((o) => (c[o[k]] = (c[o[k]] || 0) + 1)); return c; };
        const cm = cont("mec"), cp = cont("papel");
        b = topo + `<div class="card"><b>Respostas do grupo (${outros.length}/${g.membros.length})</b>
          ${Object.entries(cm).map(([k, n]) => `<div class="row" style="justify-content:space-between"><span>${esc(mecNome(k))}</span><b>${n}</b></div>`).join("")}<div class="sep"></div>
          ${Object.entries(cp).map(([k, n]) => `<div class="row" style="justify-content:space-between"><span class="muted">${PAPEIS[k]}</span><b>${n}</b></div>`).join("")}</div>
          <h3 style="color:var(--o2)">2. Resposta da equipe (só você envia)</h3>` + hipoteseForm("gf", loc.gf, posto) +
          `<button class="btn ok block" data-a="h1" ${completo(loc.gf, posto) ? "" : "disabled"}>Enviar pela equipe</button>`;
      } else {
        b = topo + `<p class="pill-ok">Sua resposta foi enviada.</p>${g.h1 ? `<div class="card"><b>A equipe enviou</b><p>${esc(mecNome(g.h1.mec))}</p><p class="muted">${PAPEIS[g.h1.papel]}</p></div>` : `<p class="muted">Discutam. ${souLider ? "" : `Quem envia é ${esc(st.alunos[g.lider].nome)}.`}</p>`}`;
      }
      break;
    }
    case "telegrafo": {
      const recebidos = Object.values(st.grupos).filter((x) => x.bilhete && x.bilhete.para === g.id);
      const outros = Object.values(st.grupos).filter((x) => x.id !== g.id);
      b = `<h2>Telégrafo</h2><p class="muted">Um único bilhete, até 140 caracteres, para outra estação. O que ela precisa saber do seu posto?</p>
        ${recebidos.map((x) => `<div class="card"><b>✉ De ${POSTOS.find((p) => p.id === x.posto).curto}</b><p>${esc(x.bilhete.texto)}</p></div>`).join("") || `<p class="faint">Nenhum bilhete recebido ainda.</p>`}
        ${souLider && !g.bilhete ? `<div class="sep"></div><h3>Para qual estação?</h3>${outros.map((x) => radio("bilhete.para", x.id, loc.bilhete.para, `<span class="badge" style="background:${x.cor.hex};width:26px;height:26px;margin-right:8px">${x.i + 1}</span>${POSTOS.find((p) => p.id === x.posto).nome}`)).join("")}
          <textarea maxlength="140" data-in="bilhete.texto" data-key="bil" placeholder="Seu bilhete">${esc(loc.bilhete.texto)}</textarea>
          <button class="btn block" data-a="bilhete" ${loc.bilhete.para && loc.bilhete.texto.trim() ? "" : "disabled"}>Enviar bilhete</button>`
          : g.bilhete ? `<div class="card"><b>Bilhete enviado para ${POSTOS.find((p) => p.id === st.grupos[g.bilhete.para].posto).curto}</b><p>${esc(g.bilhete.texto)}</p></div>` : `<p class="muted">O líder escreve o bilhete. Ajudem a escolher.</p>`}`;
      break;
    }
    case "laboratorio": {
      const pr = paramsDoCaso(st.casoId);
      if (!loc.lab) loc.lab = { ...pr.base };
      const sim = compute(loc.lab);
      const { real } = valoresDoCaso(st.casoId);
      const pl = placar(st.casoId, g.posto, g.h1?.prev);
      const chave = ["pao2", "sao2", "cao2", "dc", "lactate", "svo2"];
      const perto = (v) => Math.abs(sim[v] - real[v]) / Math.max(Math.abs(real[v]), 1e-6) <= 0.08;
      b = `<h2>Laboratório · ${posto.curto}</h2>
        <div class="card"><b>Memória × valores reais</b><table class="vals"><tr><th>Variável</th><th>Lembraram</th><th style="text-align:right">Real</th></tr>
        ${pl.map((x) => `<tr><td>${CURTO[x.v]} <span class="faint" style="font-size:11px">${VAR_META[x.v].unit}</span></td><td>${x.dirPrev || "—"} ${x.val != null ? `<span class="mono faint">${x.val}</span>` : ""} <span class="${x.dirOk ? "pill-ok" : "pill-bad"}">${x.dirOk ? "✓" : "✗"}</span>${x.val != null ? ` <span class="${x.faixaOk ? "pill-ok" : "pill-bad"}">${x.faixaOk ? "faixa ✓" : "faixa ✗"}</span>` : ""}</td><td class="n">${x.dirReal} ${fmtVar(x.v, real[x.v])}</td></tr>`).join("")}</table></div>
        <div class="card"><b>Reproduza o caso mexendo no seu posto</b><p class="faint" style="margin:2px 0 8px">Você parte do atleta esperado (sem alteração). Consegue chegar ao que foi observado?</p>
        ${posto.params.map((k) => { const m = PARAM_META[k]; return `<label style="display:block;margin-top:6px"><span class="row" style="justify-content:space-between"><span>${m.label}</span><b class="mono">${(+loc.lab[k]).toFixed(m.step < 1 ? (m.step < 0.1 ? 2 : 1) : 0).replace(".", ",")} ${m.unit}</b></span>
          <input type="range" min="${m.min}" max="${m.max}" step="${m.step}" value="${loc.lab[k]}" data-in="lab.${k}" data-live="1" data-key="lab-${k}"></label>`; }).join("")}
        <button class="btn sm sec" data-a="labReset" style="margin-top:8px">Voltar ao atleta esperado</button>
        <p class="faint" style="font-size:13px;margin:8px 0 0">Se o seu posto sozinho não reproduz tudo, outra estação pode estar compensando ou sofrendo a consequência.</p>
        <table class="vals" style="margin-top:8px"><tr><th>Corrente</th><th style="text-align:right">Simulado</th><th style="text-align:right">Observado</th></tr>
        ${chave.map((v) => `<tr><td>${CURTO[v]} <span class="faint" style="font-size:11px">${VAR_META[v].unit}</span></td><td class="n" style="color:${perto(v) ? "var(--ok)" : "var(--tx)"}">${fmtVar(v, sim[v])}</td><td class="n" style="color:var(--o2)">${fmtVar(v, real[v])}</td></tr>`).join("")}</table></div>
        ${souLider && !g.h2 ? `<h3 style="color:var(--o2)">Decisão da equipe</h3>${[["mantem", "Manter a hipótese"], ["ajusta", "Ajustar"], ["abandona", "Abandonar e trocar"]].map(([k, t]) => radio("h2.decisao", k, loc.h2.decisao, t)).join("")}
          ${loc.h2.decisao ? `<h3>Mecanismo agora</h3>${MECANISMOS.map((m) => radio("h2.mec", m.id, loc.h2.mec ?? g.h1?.mec, m.nome)).join("")}<h3>Papel do posto agora</h3>${Object.entries(PAPEIS).map(([k, t]) => radio("h2.papel", k, loc.h2.papel ?? g.h1?.papel, t)).join("")}
          <textarea data-in="h2.porque" data-key="h2p" placeholder="Que valor ou simulação fez vocês manterem ou mudarem?">${esc(loc.h2.porque || "")}</textarea>
          <button class="btn ok block" data-a="h2" ${(loc.h2.porque || "").trim().length > 3 ? "" : "disabled"}>Enviar decisão da equipe</button>` : ""}`
          : g.h2 ? `<p class="pill-ok">A equipe decidiu: ${{ mantem: "manter", ajusta: "ajustar", abandona: "abandonar" }[g.h2.decisao]}.</p>` : `<p class="muted">Explorem juntos. Quem envia a decisão é ${esc(st.alunos[g.lider].nome)}.</p>`}`;
      break;
    }
    case "desfecho": case "linhas":
      b = `<span class="chip">Olhe o telão</span><h2>${st.fase === "desfecho" ? "O que aconteceu" : "Linhas do tempo"}</h2><p class="muted">${st.fase === "desfecho" ? "Compare com o que sua equipe pensou no posto e no laboratório." : "O que aconteceria com a pessoa do caso se cada explicação fosse verdade?"}</p>`;
      break;
    case "integracao": {
      const enviada = st.resp[id].saida;
      b = `<h2>Bilhete de saída</h2>${enviada ? `<p class="pill-ok">Enviado. Obrigado!</p><p class="muted">${esc(enviada)}</p>` : `<p>O que você lembrava errado da viagem, e isso mudou a sua explicação do caso?</p>
        <textarea data-in="saida" data-key="saida" placeholder="Responda com suas palavras">${esc(loc.saida)}</textarea><button class="btn ok block" data-a="saida" ${loc.saida.trim().length > 3 ? "" : "disabled"}>Enviar</button>`}`;
      break;
    }
    default: b = "";
  }
  const ribbon = g && st.fase !== 'grupos' ? `<div class="station-ribbon">${icon(posto.id, 'small')}<div><small>Sua estação</small><b>${posto.curto}</b></div><span class="group-number">${String(g.i + 1).padStart(2, '0')}</span></div>` : '';
  return hd(st, me) + `<div class="bd">${ribbon}${b}</div>`;
}

// Converte cliques/entradas do celular em ações do motor (ou em mudanças locais).
export function acaoAluno(a, el, ctx) {
  const { st, id, loc, dispatch } = ctx;
  const setPath = (path, v) => { const ks = path.split("."); let o = loc; for (let i = 0; i < ks.length - 1; i++) o = o[ks[i]] ??= {}; o[ks.at(-1)] = v; };
  switch (a) {
    case "set": setPath(el.dataset.path, el.dataset.val); return true;
    case "entrar": if (loc.nome.trim()) dispatch({ t: "entrar", id, nome: loc.nome }); return true;
    case "achei": dispatch({ t: "achei", id }); return true;
    case "metodo": dispatch({ t: "metodo", id, m: el.dataset.val }); return true;
    case "votoLider": dispatch({ t: "votoLider", id, alvo: el.dataset.val }); return true;
    case "parada": loc.parada = Math.max(0, Math.min(PARADAS.length - 1, loc.parada + +el.dataset.val)); return true;
    case "viagemResp": dispatch({ t: "viagemResp", id, parada: PARADAS[loc.parada].id, op: +el.dataset.val }); return true;
    case "mochila": {
      const v = el.dataset.v;
      dispatch({ t: "mochila", id, v, valor: `${fmtVar(v, VREP[v])} → ${fmtVar(v, VEX[v])}${u(v)}`, cond: "repouso → exercício" });
      return true;
    }
    case "postoInd": dispatch({ t: "postoInd", id, dados: structuredClone(loc.posto) }); return true;
    case "h1": dispatch({ t: "h1", id, dados: structuredClone(loc.gf) }); return true;
    case "bilhete": dispatch({ t: "bilhete", id, para: loc.bilhete.para, texto: loc.bilhete.texto }); return true;
    case "labReset": loc.lab = null; return true;
    case "h2": {
      const g = st.grupos[st.alunos[id].grupo];
      dispatch({ t: "h2", id, dados: { decisao: loc.h2.decisao, mec: loc.h2.mec ?? g.h1?.mec, papel: loc.h2.papel ?? g.h1?.papel, porque: loc.h2.porque } });
      return true;
    }
    case "saida": dispatch({ t: "saida", id, texto: loc.saida }); return true;
    default: return false;
  }
}
