import { FASES, NOME_FASE, progresso, agregadoOk, contagem } from "../engine.js";
import { NOVIDADE_DO_ANO, EXEMPLO_DO_ANO, EXEMPLO_VOTO, REGRAS_TXT, EVENTO_POR_ID, MOTIVOS, GUIAS, NIVEIS_PUBLICO } from "../content/vila.js";
import { gini, lanceMinimo, REGENERA, VITORIA, patrimonio, VALOR_LOTE, COLAPSO, progressoMeta } from "../content/regras.js";
import { iconeFamilia, mapaVila, linhaDoTempo, ico } from "./desenho.js";

const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const n0 = (x) => Math.round(x).toLocaleString("pt-BR");
const pct = (a, b) => (b ? Math.round((100 * a) / b) : 0);

function topo(st, titulo) {
  const p = progresso(st);
  const ano = st.ano ? `Ano ${st.ano} de 5 · ` : "";
  return `<div class="top"><div class="grow"><div class="fase">Mosaico Vila · ${ano}${esc(NOME_FASE[st.fase])}</div><h1>${titulo}</h1></div>
    ${st.ano ? `<span class="chip regra ${st.regra}">Regra: ${REGRAS_TXT[st.regra].nome}</span>` : ""}
    ${p && p.total ? `<div style="width:22cqw"><div class="row" style="justify-content:space-between"><span class="muted">${p.rot}</span><b class="mono">${p.feito}/${p.total}</b></div><div class="prog"><i style="width:${(100 * p.feito) / p.total}%"></i></div></div>` : ""}</div>`;
}

const fams = (st) => Object.values(st.fams);
const grade = (xs, fn, cols = 4) => `<div class="grid" style="grid-template-columns:repeat(${Math.min(xs.length, cols)},1fr)">${xs.map(fn).join("")}</div>`;

export function renderTelao(st) {
  let body = "";
  switch (st.fase) {
    case "entrada":
      body = topo(st, "Mosaico Vila") + `<div class="grid" style="grid-template-columns:1fr 1fr;flex:1"><div class="card col" style="justify-content:center"><div class="row" style="gap:1.4cqw">${ico("app-mosaico-vila", "xl")}<div><div class="fase">Código da sala</div><div class="mono" style="font-size:6cqw;font-weight:800;letter-spacing:.1em">SIM-01</div></div></div><p class="big muted">Entre pelo celular. A turma vira uma vila; os grupos, famílias.</p></div>
        <div class="card"><h3>${st.ordem.length} na sala</h3><div class="row" style="margin-top:1cqw;gap:.6cqw">${st.ordem.map((id) => `<span class="chip">${esc(st.alunos[id].nome)}</span>`).join("")}</div></div></div>`;
      break;
    case "familias":
      body = topo(st, "Encontre a sua família") + grade(fams(st), (f) => `<div class="card"><div class="row">${iconeFamilia(f, 44)}<b style="font-size:1.6cqw">${esc(f.nome)}</b></div><p class="muted">${f.membros.map((m) => esc(st.alunos[m].nome)).join(", ")}</p><span class="chip">${f.membros.filter((m) => st.alunos[m].achou).length}/${f.membros.length} acharam</span>${f.i === 0 ? `<span class="chip">herança: +50% de caixa e 3 lotes</span>` : ""}${f.lotes === 0 ? `<span class="chip">começa sem lote</span>` : ""}</div>`);
      break;
    case "abertura": {
      const nov = NOVIDADE_DO_ANO[st.ano], ex = EXEMPLO_DO_ANO[st.ano];
      const rs = Object.values(st.renda || {});
      const aluguel = rs.reduce((a, r) => a + r.aluguel, 0), piso = rs.filter((r) => r.piso > 0).length;
      body = topo(st, `Ano ${st.ano}: ${esc(nov.titulo)}`) + `<div class="card"><p class="big">${esc(nov.texto)}</p></div>` +
        (ex ? `<div class="card revela"><h3 class="row">${ico("ideia")}Exemplo resolvido</h3><ol class="big" style="margin:.4cqw 0 0 1.4cqw;padding:0">${ex.linhas.map((l) => `<li style="margin:.3cqw 0">${esc(l)}</li>`).join("")}</ol><p class="muted">No celular, uma pergunta rápida para conferir (não vale ponto).</p></div>`
          : `<div class="card"><b>A vila neste ano</b><p class="big muted">${aluguel ? `${n0(aluguel)} pontos de aluguel vão mudar de mãos. ` : ""}${piso ? `${piso} família(s) receberam o piso de renda.` : "Nenhuma família precisou do piso de renda."}</p><p class="muted">Cada família vê o próprio extrato no celular.</p></div>`);
      break;
    }
    case "decidir":
      body = topo(st, "Cada família decide") + `<div class="grid" style="grid-template-columns:1.4fr 1fr;flex:1"><div class="card">${mapaVila(st)}</div>
        <div class="col"><div class="card"><h3>Conversem 45 segundos na família</h3><p class="big muted">Cada um envia a sua proposta. Vale a mediana da família: ninguém decide sozinho.</p></div>
        <div class="card"><b class="row">${ico("economia")}Bem público</b><p class="muted">Nível ${st.publico}: ${esc(NIVEIS_PUBLICO[st.publico])}. Cada nível dá +2 de renda por pessoa, para todas as famílias.</p>
        ${st.ano >= 2 ? `<b class="row">${ico("arvore-redonda")}Mata</b><p class="muted">Regenera cerca de ${n0(REGENERA * st.mata * (1 - st.mata / st.teto))} por ano no nível de hoje. Cada carga tira 2.</p>` : ""}</div></div></div>`;
      break;
    case "mente": {
      const vals = Object.values(st.mente), sim = vals.filter(Boolean).length;
      body = topo(st, EVENTO_POR_ID.mente.titulo) + `<div class="card"><p class="big">${esc(EVENTO_POR_ID.mente.texto)}</p><p class="muted">Ninguém, nem o sistema, sabe o número que você pensou.</p></div>
        <div class="card"><h3>${vals.length} responderam</h3><p class="big muted">O resultado aparece em "Como ficou a vila".</p></div>`;
      break;
    }
    case "lances": {
      body = topo(st, "Mercado de lotes") + `<div class="grid" style="grid-template-columns:1.4fr 1fr;flex:1"><div class="card">${mapaVila(st)}</div><div class="col">
        <div class="card"><h3 class="row">${ico("casa-neutra")}${st.lotes.filter((x) => !x).length} lotes livres · até 3 à venda</h3><p class="big muted">Lance fechado: cada um propõe quanto do caixa da família oferecer; vale a mediana. O maior lance leva; empate, sorteio.</p><p class="big">Lance mínimo: <b class="mono">${lanceMinimo(st.ano)}</b></p></div>
        <div class="card"><p class="muted">Quem já enviou dá um palpite: qual vai ser o lance vencedor?</p></div></div></div>`;
      break;
    }
    case "alvara": {
      const nv = Object.keys(st.alvara.votos).length;
      body = topo(st, EVENTO_POR_ID.alvara.titulo) + `<div class="card row" style="align-items:flex-start;flex-wrap:nowrap;gap:1.4cqw">${ico("alvara", "g")}<div><p class="big">${esc(EVENTO_POR_ID.alvara.texto)}</p><p class="muted"><b>Cada um responde no próprio lugar, longe da família.</b> O telão mostra só quantos por cento aceitariam e se a obra foi aprovada. Quem foi sorteado nunca aparece.</p></div></div>
        <div class="card"><h3>${nv} responderam</h3><div class="prog"><i style="width:${pct(nv, st.ordem.length)}%"></i></div></div>`;
      break;
    }
    case "resultado": body = telaoResultado(st); break;
    case "voto": {
      const vs = Object.values(st.voto), nc = Object.keys(st.controle?.voto || {}).length;
      body = topo(st, "Que regra queremos para os anos 4 e 5?") + `<div class="grid" style="grid-template-columns:1fr 1fr">
        <div class="card"><h2 class="row">${ico("balanca", "g")}Manter: ${REGRAS_TXT.monopolio.nome}</h2><p class="big muted">${esc(REGRAS_TXT.monopolio.curto)}</p></div>
        <div class="card"><h2 class="row">${ico("balanca", "g")}Trocar: ${REGRAS_TXT.prosperidade.nome}</h2><p class="big muted">${esc(REGRAS_TXT.prosperidade.curto)}</p></div></div>
        <div class="card revela"><h3 class="row">${ico("ideia")}Exemplo resolvido</h3><ol style="margin:.4cqw 0 0 1.4cqw;padding:0;font-size:1.45cqw;line-height:1.45">${EXEMPLO_VOTO.linhas.map((l) => `<li style="margin:.3cqw 0">${esc(l)}</li>`).join("")}</ol></div>
        <div class="card"><p style="font-size:1.4cqw;margin:0"><b>Cada um volta ao próprio lugar para votar.</b> Voto secreto: vence a maioria; empate mantém o Monopólio. ${vs.length} votaram · ${nc} responderam a pergunta. <span class="muted">Inspiração: o Jogo do Proprietário (Lizzie Magie, 1904), avô do Banco Imobiliário.</span></p></div>`;
      break;
    }
    case "fechamento": body = telaoFechamento(st); break;
    default: body = topo(st, "Mosaico Vila");
  }
  return `<div class="tin">${body}</div>`;
}

// R10: a meta da regra vigente, à vista desde o ano 1 (barra do patrimônio e da mata).
const v2 = (x) => x.toFixed(2).replace(".", ",");
function cartaoMeta(st) {
  const m = progressoMeta(st.fams, st.publico, st.mata, st.teto, st.regra);
  const frac = Math.max(0, Math.min(1, m.valor / m.alvo)), mf = Math.max(0, Math.min(1, m.mata / VITORIA.mataMinima));
  const val = m.regra === "prosperidade" ? `${Math.round(100 * m.valor)}% de ${Math.round(100 * m.alvo)}%` : `${n0(m.valor)} de ${m.alvo}`;
  return `<div class="card meta"><b class="row">${ico("meta")}Meta da vila (${REGRAS_TXT[m.regra].nome})</b>
    <div class="row" style="margin-top:.2cqw;gap:.6cqw;font-size:1.1cqw"><span style="min-width:11cqw">${m.regra === "prosperidade" ? "Mais pobre / média" : "Patrimônio por pessoa"}</span><div class="barra"><i style="width:${100 * frac}%"></i></div><b class="mono">${val}</b></div>
    <div class="row" style="margin-top:.2cqw;gap:.6cqw;font-size:1.1cqw"><span style="min-width:11cqw">Mata (mínimo ${Math.round(100 * VITORIA.mataMinima)}%)</span><div class="barra"><i style="width:${100 * mf}%;background:linear-gradient(90deg,#15803d,#4ade80)"></i></div><b class="mono">${Math.round(100 * m.mata)}%</b></div></div>`;
}

// Patrimônio das famílias (caixa + lotes × valor do lote), do maior para o menor, sem nome.
const porPatrimonio = (st) => fams(st).map((f) => ({ pat: patrimonio(f, st.publico) })).sort((a, b) => b.pat - a.pat);

// Barras sem nome nem cor de família (a regra dos 5: famílias têm de 3 a 6 pessoas).
function barras(ranking) {
  const max = Math.max(1, ...ranking.map((f) => f.pat));
  return ranking.map((f) => `<div class="row" style="margin-top:.15cqw;gap:.6cqw;font-size:1.15cqw"><div class="barra"><i style="width:${(100 * Math.max(0, f.pat)) / max}%"></i></div><b class="mono" style="min-width:4cqw;text-align:right">${n0(f.pat)}</b></div>`).join("");
}

function telaoResultado(st) {
  const fx = st.fechamento;
  const giniAgora = gini(fams(st).map((f) => patrimonio(f, st.publico)));     // o histórico só recebe este ano ao sair da tela
  const linhas = [];
  if (fx) {
    const dm = st.mata - fx.mataAntes;
    if (st.ano >= 2) linhas.push(`Mata: ${dm >= 0 ? "subiu" : "desceu"} ${n0(Math.abs(dm))} (cargas tiraram ${n0(fx.extr)}, o replantio devolveu ${n0(fx.plant)}, a natureza regenerou ${n0(dm + fx.extr - fx.plant)}).`);
    linhas.push(st.publico > fx.nivelAntes ? `Bem público subiu para o nível ${st.publico}: ${NIVEIS_PUBLICO[st.publico]}.` : `Bem público ficou no nível ${st.publico}.`);
  }
  if (st.ano === EVENTO_POR_ID.mente.ano && !st.semTroco) { const vals = Object.values(st.mente); if (agregadoOk(vals.length)) linhas.push(`Troco do mercado: ${pct(vals.filter(Boolean).length, vals.length)}% disseram "acertei". Por acaso, seriam cerca de 17%.`); }
  if (st.ano === 3 && st.renda) {
    const rs = Object.values(st.renda), al = rs.reduce((a, r) => a + r.aluguel, 0);
    const g0 = gini(rs.map((r) => r.base + r.bonusMata - r.perdaMata)), g1 = gini(rs.map((r) => r.total));
    linhas.push(`Aluguel: ${n0(al)} pontos saíram de ${rs.filter((r) => r.aluguel > 0).length} família(s) sem lote para ${rs.filter((r) => r.recebido > 0).length} com lote sobrando. A desigualdade da renda do ano foi de ${g0.toFixed(2).replace(".", ",")} (sem aluguel) para ${g1.toFixed(2).replace(".", ",")} (com aluguel).`);
  }
  if (st.ano === 3 && st.historico.length >= 2) { const g0 = st.historico.at(-1).gini, g1 = giniAgora; linhas.push(`Com o aluguel, a desigualdade entre famílias ${g1 > g0 + 0.005 ? "subiu" : g1 < g0 - 0.005 ? "caiu" : "ficou igual"}: Gini de ${g0.toFixed(2).replace(".", ",")} para ${g1.toFixed(2).replace(".", ",")}.`); }
  if (st.ano !== 3 && st.renda) linhas.push(`Desigualdade da renda do ano, por pessoa: ${v2(gini(fams(st).map((f) => (st.renda[f.id]?.total ?? 0) / f.membros.length)))} (a do patrimônio está ao lado).`);
  if (st.colapsou) linhas.push(`A mata está abaixo de ${Math.round(100 * COLAPSO)}%: −4 de renda por pessoa enquanto não voltar. Faltam ${n0(COLAPSO * st.teto - st.mata + 0.5)} de mata (cada 5 pontos replantados devolvem 2).`);
  else if (st.colapsouAlguma) linhas.push("A mata voltou a passar dos 30%: o −4 acabou.");
  if (st.ano >= 4 && st.leilao) linhas.push(`Mercado: ${st.leilao.vendidos.length} lote(s) vendido(s).`);
  if (st.ano === EVENTO_POR_ID.alvara.ano) { const vs = Object.values(st.alvara.votos); linhas.push(`Alvará: ${agregadoOk(vs.length) ? `${pct(vs.filter(Boolean).length, vs.length)}% aceitariam os 8 pontos. ` : ""}${st.alvara.aceito ? "A obra foi aprovada sem vistoria: o bem público perdeu um nível." : "A obra não foi aprovada."}`); }
  const prev = st.previsao[st.ano] || {}, np = Object.keys(prev).length;
  if (st.ano >= 2 && agregadoOk(np) && fx) { const real = st.mata > fx.mataAntes + 0.5 ? "sobe" : st.mata < fx.mataAntes - 0.5 ? "desce" : "fica"; linhas.push(`Previsão da mata: ${pct(Object.values(prev).filter((v) => v === real).length, np)}% acertaram.`); }
  const ranking = porPatrimonio(st);
  return topo(st, `Como ficou a vila no ano ${st.ano}`) + `<div class="grid" style="grid-template-columns:1.4fr 1fr;flex:1"><div class="col"><div class="card revela mapa-compacto">${mapaVila(st)}</div>
    <div class="card"><b>Patrimônio das famílias, do maior para o menor</b><p class="faint" style="margin:.2cqw 0">Caixa + lotes (lote vale ${VALOR_LOTE(st.publico)}). Sem nome: a posição de cada família só no celular dela.</p>${barras(ranking)}
    <p class="muted" style="margin-top:.6cqw">Desigualdade do patrimônio entre famílias (Gini): ${giniAgora.toFixed(2).replace(".", ",")}</p></div></div><div class="col">${cartaoMeta(st)}
    <div class="card">${linhas.map((l, k) => `<p class="linha-revela" style="margin:.25cqw 0;font-size:1.4cqw;line-height:1.4;animation-delay:${0.4 + 0.5 * k}s">${esc(l)}</p>`).join("")}</div>
    ${st.ano === 3 && st.renda ? (() => { const rs = Object.values(st.renda), pg = rs.reduce((a, r) => a + r.aluguel, 0), rc = rs.reduce((a, r) => a + r.recebido, 0), mx = Math.max(1, pg, rc); return `<div class="card"><b>Aluguel do ano 3</b><div class="row" style="margin-top:.3cqw;gap:.6cqw"><span style="min-width:9cqw">Pagaram</span><div class="barra"><i style="width:${(100 * pg) / mx}%;background:linear-gradient(90deg,#b91c1c,#f87171)"></i></div><b class="mono">${n0(pg)}</b></div><div class="row" style="margin-top:.3cqw;gap:.6cqw"><span style="min-width:9cqw">Receberam</span><div class="barra"><i style="width:${(100 * rc) / mx}%;background:linear-gradient(90deg,#15803d,#4ade80)"></i></div><b class="mono">${n0(rc)}</b></div></div>`; })() : ""}</div></div>`;
}

// Cinco perguntas encadeadas, uma por tema, montadas com os dados da própria turma.
function perguntasFechamento(st) {
  const H = st.historico, g = (k) => H[k]?.gini ?? 0;
  const subiu = H.length >= 3 && g(2) > g(1) + 0.005;
  const mataMin = Math.min(...H.map((x) => x.mata));
  return [
    H.length >= 3 ? (subiu ? "Quando o aluguel entrou (ano 3), a desigualdade subiu. Quem ganhou com isso, e sem fazer o quê?" : "Quando o aluguel entrou (ano 3), a desigualdade não subiu. O que segurou?") : "A desigualdade entre as famílias cresceu ou caiu? Por quê?",
    `Na votação, ${st.votoTrocou ? "a vila trocou para a Prosperidade (meta: ninguém muito atrás)" : "a vila ficou no Monopólio (meta: patrimônio médio alto)"}. Vocês escolheram eficiência ou equidade? Votaram pelo próprio bolso ou pela vila?`,
    st.colapsouAlguma ? (st.colapsou ? "A mata colapsou e não voltou. Quem pagou a conta, e quem tirou madeira antes?" : "A mata colapsou e voltou. Quem pagou o replantio, e quem tirou madeira antes?") : `A mata chegou a ${Math.round(100 * mataMin)}% no pior ano. O que segurou a mão de quem queria tirar mais?`,
    (() => { const vs = Object.values(st.alvara?.votos || {}); return agregadoOk(vs.length) ? `${pct(vs.filter(Boolean).length, vs.length)}% de vocês aceitariam os 8 pontos, sabendo que o bem público de todos perderia um nível e que ninguém ia saber. Qual foi o preço da honestidade?` : "No alvará, ninguém ia saber quem aceitou. Qual foi o preço da honestidade?"; })(),
    "Na profissão de vocês, o que é a \"mata comum\" (a agenda do posto, a praça onde se treina, a verba do clube) e quem cobra aluguel dela?",
  ];
}

function telaoFechamento(st) {
  const ranking = porPatrimonio(st);
  const meta = st.regra === "prosperidade"
    ? `a família mais pobre com pelo menos ${Math.round(VITORIA.pobreSobreMedia * 100)}% do patrimônio médio, por pessoa, e a mata acima de ${Math.round(VITORIA.mataMinima * 100)}%`
    : `patrimônio médio de ${VITORIA.patrimonioPorPessoa} por pessoa e a mata acima de ${Math.round(VITORIA.mataMinima * 100)}%`;
  const o = st.outra;
  const outra = o ? `<p class="muted" style="margin-top:.6cqw">E se fosse a outra regra? Na ${REGRAS_TXT[o.regra].nome}, com as mesmas decisões de vocês, a desigualdade final seria ${o.gini.toFixed(2).replace(".", ",")} (foi ${(st.historico.at(-1)?.gini ?? 0).toFixed(2).replace(".", ",")}) e a meta dela ${o.meta ? "seria batida" : "não seria batida"}. É um "e se": na outra regra, vocês talvez decidissem diferente.</p>` : "";
  const res = `<h2 class="row" style="color:var(${st.vitoria ? "--ok" : "--warn"})">${ico(st.vitoria ? "trofeu" : "meta", "g")}${st.vitoria ? "A vila bateu a meta!" : "A vila não bateu a meta"}</h2><p class="big">Regra ${REGRAS_TXT[st.regra].nome}. Meta: ${meta}.</p>${barras(ranking)}${outra}`;
  const fin = Object.values(st.final);
  const guias = contagem(fin.map((x) => x.guia)), motivos = contagem(fin.map((x) => x.motivo));
  return topo(st, "Fechamento") + `<div class="grid" style="grid-template-columns:1fr 1fr;flex:1">
    <div class="col"><div class="card">${res}</div><div class="card fech-linha">${linhaDoTempo(st.historico)}</div>
</div>
    <div class="col"><div class="card"><h3 class="row">${ico("grupos")}Para conversar</h3><p class="muted">Primeiro 1 minuto em dupla sobre a pergunta 1; depois, a turma, uma pergunta puxando a outra.</p><ol style="margin:.4cqw 0 0 1.4cqw;padding:0;font-size:1.38cqw;line-height:1.4">${perguntasFechamento(st).map((q) => `<li style="margin:.45cqw 0">${esc(q)}</li>`).join("")}</ol></div>
    ${agregadoOk(fin.length) ? `<div class="card"><b>O que guiou a turma</b><div class="row" style="margin-top:.4cqw;flex-wrap:wrap">${GUIAS.map((g) => `<span class="chip">${g}: ${guias[g] || 0}</span>`).join("")}</div><div class="row" style="margin-top:.4cqw;flex-wrap:wrap">${MOTIVOS.map((m) => `<span class="chip">${m}: ${motivos[m] || 0}</span>`).join("")}</div></div>` : ""}
</div></div>`;
}
