import { NOME_FASE } from "../engine.js";
import { NOVIDADE_DO_ANO, EXEMPLO_DO_ANO, EXEMPLO_VOTO, REGRAS_TXT, MOTIVOS, GUIAS, NIVEIS_PUBLICO } from "../content/vila.js";
import { LIMITES, lanceMinimo, CARGA_RENDE, CARGA_TIRA, REPLANTA_POR, REPLANTA_DEVOLVE, patrimonio, VALOR_LOTE, progressoMeta, VITORIA } from "../content/regras.js";
import { carta, QUEM_GOLPE, FAIXAS_PCT, GANHO_PEQUENA, GANHO_GRANDE } from "../content/cartas.js";
import { iconeFamilia, ico, pctL } from "./desenho.js";
import { decorrido, tempoResultado } from "./telao.js";

const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const n0 = (x) => Math.round(x).toLocaleString("pt-BR");

export function novoLocal() { return { pub: 20, rep: 0, car: 0, lance: 0, face: null, guia: null, motivo: null }; }

function hd(st, me) {
  const f = me?.fam ? st.fams[me.fam] : null;
  return `<div class="hd">${f ? iconeFamilia(f, 34) : ico("app-mosaico-vila", "m")}
    <div class="grow"><b>${esc(me?.nome || "Mosaico Vila")}</b><div class="faint" style="font-size:12px">${f ? `${esc(f.nome)} · caixa ${n0(f.caixa)}` : "Mosaico Vila"}</div></div>
    ${st.ano ? `<span class="chip">Ano ${st.ano}</span>` : ""}${st.ano ? miniBarra(st) : ""}</div>`;
}

// R11: a mesma barra de ícones do telão, pequena, no alto do celular
function miniBarra(st) {
  const m = progressoMeta(st.fams, st.publico, st.mata, st.teto, st.regra);
  const meta = m.regra === "prosperidade" ? `${pctL(m.valor)}/${Math.round(100 * m.alvo)}%` : `${n0(m.valor)}/${m.alvo}`;
  return `<div class="mini-hud">${st.ano >= 2 ? `<span>${ico("arvore-redonda")}<b>${pctL(st.mata / st.teto)}</b></span>` : ""}<span>${ico("economia")}<b>nível ${st.publico}</b></span><span>${ico("meta")}<b>${meta}</b></span><span>${ico("balanca")}<b>${REGRAS_TXT[st.regra].nome}</b></span></div>`;
}

// R10: a mesma barra da meta do telão, no celular (meta da regra vigente, desde o ano 1)
function metaCelular(st) {
  const m = progressoMeta(st.fams, st.publico, st.mata, st.teto, st.regra);
  const frac = Math.max(0, Math.min(1, m.valor / m.alvo));
  const val = m.regra === "prosperidade" ? `${pctL(m.valor)} de ${Math.round(100 * m.alvo)}%` : `${n0(m.valor)} de ${m.alvo}`;
  return `<div class="card"><b class="row">${ico("meta")}Meta da vila (${REGRAS_TXT[m.regra].nome})</b><div class="row" style="margin-top:6px;gap:8px"><span class="faint" style="min-width:42%">${m.regra === "prosperidade" ? "Mais pobre / média" : "Patrimônio por pessoa"}</span><div class="barra"><i style="width:${100 * frac}%"></i></div><b class="mono">${val}</b></div><p class="faint" style="margin:4px 0 0">Mata: ${pctL(m.mata)} (mínimo ${Math.round(100 * VITORIA.mataMinima)}%).</p></div>`;
}

// R14: posição pelo patrimônio por pessoa (as famílias têm de 3 a 6 pessoas)
const porPessoa = (st, f) => patrimonio(f, st.publico) / f.membros.length;
const posicao = (st, f) => 1 + Object.values(st.fams).filter((g) => porPessoa(st, g) > porPessoa(st, f)).length;
const enviado = (txt = "Enviado. Aguarde a turma.") => `<div class="card" style="text-align:center"><b class="pill-ok">✓ ${txt}</b></div>`;
// R13: mata em % da vila (a mesma unidade do telão)
const pcMata = (st, x) => `${(Math.round((1000 * x) / (st.teto || 1)) / 10).toLocaleString("pt-BR")}%`;

// Microtarefa enquanto a turma responde: em que faixa vai ficar a porcentagem (o telão mostra o acerto depois)
function palpiteFaixa(st, id, onde, pergunta) {
  const v = st.palpitePct?.[onde]?.[id];
  return `<div class="card"><b>Enquanto a turma responde: ${esc(pergunta)}</b><div class="col" style="margin-top:8px;gap:6px">${FAIXAS_PCT.map((t, k) => `<button class="btn sm ${v === k ? "on" : "sec"}" data-a="palpitePct" data-onde="${onde}" data-val="${k}" ${v != null ? "disabled" : ""}>${t}</button>`).join("")}</div>${v != null ? `<p class="faint" style="margin:6px 0 0">Palpite enviado. O telão mostra quantos acertaram.</p>` : ""}</div>`;
}

// Carta sorteada (pequena, ano 4 ou grande): texto, aviso de sigilo e dois botões iguais (mesmo tamanho e mesma cor)
function cartaCelular(c, aviso, a, valSim = "1", valNao = "0") {
  return `<h2 class="row">${ico(c.icone, "g")}${esc(c.titulo)}</h2><p class="muted">${esc(c.texto)}</p><p class="faint">${aviso}</p>
    <div class="row"><button class="btn sec grow" data-a="${a}" data-val="${valSim}">${esc(c.sim)}</button><button class="btn sec grow" data-a="${a}" data-val="${valNao}">${esc(c.nao)}</button></div>`;
}

// Efeito da proposta, na hora, se a família inteira propusesse o mesmo.
function projecao(st, f, loc) {
  const r = st.renda?.[f.id]?.total ?? 0;
  const base = Math.max(0, r);
  const pub = (base * loc.pub) / 100, rep = st.ano >= 2 ? (base * loc.rep) / 100 : 0, car = st.ano >= 2 ? loc.car : 0;
  const fica = r - pub - rep + CARGA_RENDE * car;
  const mata = st.ano >= 2 ? (rep / REPLANTA_POR) * REPLANTA_DEVOLVE - CARGA_TIRA * car : 0;
  return `<div class="card proj"><b>Se a família seguir a sua proposta</b><table class="vals">
    <tr><td>Renda do ano</td><td class="n">${n0(r)}</td></tr><tr><td>Vai para o bem público</td><td class="n">${n0(pub)}</td></tr>
    ${st.ano >= 2 ? `<tr><td>Replantio</td><td class="n">${n0(rep)}</td></tr><tr><td>Madeira vendida</td><td class="n">+${n0(CARGA_RENDE * car)}</td></tr><tr><td>Efeito na mata (só da sua família)</td><td class="n">${mata >= 0 ? "+" : "−"}${pcMata(st, Math.abs(mata))}</td></tr>` : ""}
    <tr><td><b>Fica no caixa</b></td><td class="n"><b>${fica >= 0 ? "+" : ""}${n0(fica)}</b></td></tr></table></div>`;
}

// R14: o lance mostra o efeito na hora: quantos pontos, quanto vale o lote e quanto o patrimônio da família muda se levar
function efeitoLance(st, f, loc) {
  const min = lanceMinimo(st.ano), parte = (loc.lance / 100) * (st.regra === "prosperidade" ? 0.5 : 1);
  const lance = Math.min(f.caixa, min + f.caixa * parte), vale = VALOR_LOTE(st.publico), dif = vale - lance;
  if (f.caixa < min) return `<p class="faint" style="margin:6px 0 0">O caixa da família (${n0(f.caixa)}) não chega ao mínimo de ${min}: vocês ficam de fora este ano.</p>`;
  return `<table class="vals" style="margin-top:6px"><tr><td>Lance da família (se todos propuserem isto)</td><td class="n">${n0(lance)}</td></tr><tr><td>O lote vale no patrimônio</td><td class="n">${vale}</td></tr><tr><td><b>Patrimônio da família, se levar</b></td><td class="n"><b>${dif >= 0 ? "+" : "−"}${n0(Math.abs(dif))}</b></td></tr></table><p class="faint" style="margin:4px 0 0">O lance vai para o banco. O lote ainda pode render aluguel e dar moradia.</p>`;
}

// Pergunta de controle da regra nova (anos 1 a 3): quem erra vê a explicação; não vale ponto.
function controle(st, id) {
  const chave = st.fase === "voto" ? "voto" : st.ano;
  const ex = st.fase === "voto" ? EXEMPLO_VOTO : EXEMPLO_DO_ANO[st.ano];
  if (!ex) return "";
  const resp = st.controle?.[chave]?.[id];
  if (resp == null) return `<div class="card"><b class="row" style="flex-wrap:nowrap;align-items:flex-start">${ico("ideia")}<span>Confira: ${esc(ex.pergunta)}</span></b>${ex.opcoes.map((o, k) => `<button class="opt" data-a="controle" data-val="${k}">${esc(o)}</button>`).join("")}<p class="faint" style="margin:4px 0 0">Não vale ponto.</p></div>`;
  return `<div class="card"><b class="${resp === ex.certa ? "pill-ok" : ""}">${resp === ex.certa ? "✓ Isso mesmo." : "Quase."}</b><p class="muted" style="margin:6px 0 0">${esc(ex.explica)}</p></div>`;
}

// Microtarefa do ano 5: a desigualdade do patrimônio vai subir ou descer neste último ano?
function prev5(st, id) {
  const v = st.prev5?.[id];
  return `<div class="card"><b class="row" style="flex-wrap:nowrap;align-items:flex-start">${ico("ideia")}<span>Palpite: neste último ano, a desigualdade do patrimônio vai…</span></b><div class="row" style="margin-top:8px">${["sobe", "desce"].map((x) => `<button class="btn sm ${v === x ? "on" : "sec"} grow" data-a="prev5" data-val="${x}" ${v ? "disabled" : ""}>${x === "sobe" ? "Subir" : "Descer"}</button>`).join("")}</div>${v ? `<p class="faint" style="margin:6px 0 0">O telão mostra no fim do ano quantos acertaram.</p>` : ""}</div>`;
}

export function renderAluno(st, id, loc) {
  const me = st.alunos[id];
  const f = me?.fam ? st.fams[me.fam] : null;
  let bd = "";
  switch (st.fase) {
    case "entrada": bd = `<h2>Bem-vindo ao Mosaico Vila</h2><p class="muted">Você entrou como <b>${esc(me?.nome)}</b>. Aguarde o professor formar as famílias.</p>`; break;
    case "familias":
      bd = `<div class="card col" style="align-items:center;text-align:center">${iconeFamilia(f, 72)}<h2>${esc(f.nome)}</h2><p class="muted">Procure as pessoas com este símbolo e sentem juntas.</p></div>
        ${me.achou ? enviado("Família encontrada.") : `<button class="btn ok block" data-a="achei">Achei minha família</button>`}`;
      break;
    case "abertura": {
      const r = st.renda[f.id], nov = NOVIDADE_DO_ANO[st.ano];
      bd = `<h2>${esc(nov.titulo)}</h2><p class="muted">${esc(nov.texto)}</p><div class="card"><b>Extrato da família</b><table class="vals">
        <tr><td>Renda (${f.membros.length} pessoas)</td><td class="n">+${n0(r.base + r.bonusMata - r.perdaMata)}</td></tr>
        ${r.aluguel ? `<tr><td>Aluguel pago (falta ${r.falta} lote)</td><td class="n">−${n0(r.aluguel)}</td></tr>` : ""}
        ${r.recebido ? `<tr><td>Aluguel recebido</td><td class="n">+${n0(r.recebido)}</td></tr>` : ""}
        ${r.imposto ? `<tr><td>Imposto da terra</td><td class="n">−${n0(r.imposto)}</td></tr>` : ""}
        ${r.piso ? `<tr><td>Piso de renda</td><td class="n">+${n0(r.piso)}</td></tr>` : ""}
        <tr><td>Lotes</td><td class="n">${f.lotes}</td></tr></table></div>${st.ano >= 3 ? `<p class="faint">Regra: ${REGRAS_TXT[st.regra].nome}. ${esc(REGRAS_TXT[st.regra].curto)}</p>` : ""}${st.ano === 5 ? prev5(st, id) : controle(st, id)}`;
      break;
    }
    case "decidir": {
      const p = st.props[st.ano]?.[id];
      if (p && !p.auto) {
        const prev = st.previsao[st.ano]?.[id];
        bd = enviado("Proposta enviada.") + (st.ano >= 2 ? `<div class="card"><b>Enquanto a turma decide: a mata vai…</b><div class="row" style="margin-top:8px">${["sobe", "fica", "desce"].map((v) => `<button class="btn sm ${prev === v ? "on" : "sec"} grow" data-a="prever" data-val="${v}">${v === "sobe" ? "Subir" : v === "fica" ? "Ficar igual" : "Descer"}</button>`).join("")}</div></div>` : "");
        break;
      }
      bd = `<h2>Sua proposta para a família</h2><p class="faint">Vale a mediana das propostas da família.</p>
        <div class="card"><div class="row" style="justify-content:space-between"><b class="row">${ico("economia")}Bem público</b><b class="mono">${loc.pub}% da renda</b></div><input type="range" min="0" max="${LIMITES.pub}" step="5" value="${loc.pub}" data-in="pub" data-key="pub"><p class="faint" style="margin:0">Nível ${st.publico}: ${esc(NIVEIS_PUBLICO[st.publico])}</p></div>
        ${st.ano >= 2 ? `<div class="card"><div class="row" style="justify-content:space-between"><b class="row">${ico("arvore-cubos")}Replantar a mata</b><b class="mono">${loc.rep}% da renda</b></div><input type="range" min="0" max="${LIMITES.rep}" step="5" value="${loc.rep}" data-in="rep" data-key="rep"><p class="faint" style="margin:0">Cada 5 pontos devolvem ${pcMata(st, REPLANTA_DEVOLVE)} à mata.</p></div>
        <div class="card"><b class="row">${ico("arvore-redonda")}Cargas de madeira</b><p class="faint" style="margin:2px 0 8px">Cada carga rende ${CARGA_RENDE} à família e tira ${pcMata(st, CARGA_TIRA)} da mata. Mata hoje: ${pctL(st.mata / st.teto)} (50% ou mais: +2 de renda por pessoa; abaixo de 30%: −4).</p><div class="dirs">${[0, 1, 2, 3].map((k) => `<button class="btn ${loc.car === k ? "warn on" : "sec"}" data-a="car" data-val="${k}">${k}</button>`).join("")}</div></div>` : ""}
        ${projecao(st, f, loc)}
        <button class="btn ok block" data-a="propor">Enviar proposta</button>`;
      break;
    }
    case "mente": {
      const c = carta(st.cartas.ano4);
      if (st.mente[id] != null) {
        bd = enviado("Resposta secreta enviada.");
        if (c.tipo === "confia") {
          const q = st.quem[id];
          bd += `<div class="card"><b>Enquanto a turma responde: quem você acha que mais dá golpe?</b><div class="col" style="margin-top:8px;gap:6px">${QUEM_GOLPE.map((t, k) => `<button class="btn sm ${q === k ? "on" : "sec"}" data-a="quem" data-val="${k}" ${q != null ? "disabled" : ""}>${esc(t)}</button>`).join("")}<button class="btn sm ${q === -1 ? "on" : "sec"}" data-a="quem" data-val="-1" ${q != null ? "disabled" : ""}>Prefiro não responder</button></div>${q != null ? `<p class="faint" style="margin:6px 0 0">Enviado. O telão mostra o total da turma e quanto era a chance de verdade.</p>` : ""}</div>`;
        }
        break;
      }
      if (c.tipo === "dado") {
        bd = `<h2 class="row">${ico(c.icone, "g")}${esc(c.titulo)}</h2><p class="muted">${esc(c.texto)}</p>` + (loc.face == null
          ? `<button class="btn block" data-a="rolar">Pensei. Rolar o dado</button>`
          : `<div class="card" style="text-align:center"><div class="dado">${loc.face}</div><p class="muted">Você acertou o número que pensou?</p><div class="row"><button class="btn sec grow" data-a="mente" data-val="1">Acertei</button><button class="btn sec grow" data-a="mente" data-val="0">Não acertei</button></div></div>`);
      } else if (c.tipo === "honesto") {
        bd = cartaCelular(c, "<b>Só você vê esta tela.</b> O banco e a praça são do jogo; os 3 pontos valem no seu placar pessoal, que ninguém mais vê.", "mente");
      } else {
        bd = cartaCelular(c, "<b>Só você vê esta tela.</b> A outra pessoa é do jogo, e cada um encontra uma diferente. Você só descobre se ela foi honesta no fim do ano, aqui no celular.", "mente");
      }
      break;
    }
    case "pequena": {
      const c = carta(st.cartas.pequena);
      bd = st.pequena.votos[id] != null ? enviado("Resposta secreta enviada.") + palpiteFaixa(st, id, "pequena", "quantos % da turma vão aceitar?")
        : cartaCelular(c, `<b>Responda sem mostrar a tela.</b> Cada resposta vale para quem respondeu. ${esc(c.segmento[0].toUpperCase() + c.segmento.slice(1))} é personagem do jogo; os ${GANHO_PEQUENA} pontos valem no seu placar pessoal, que só você vê.`, "pequena");
      break;
    }
    case "lances": {
      const p = st.props[st.ano]?.[id];
      const palp = st.palpite?.[st.ano]?.[id];
      bd = p?.lanceEnviado ? enviado("Lance enviado.") + `<div class="card"><b>Enquanto a turma decide: qual vai ser o lance vencedor?</b><div class="row" style="margin-top:8px">${["até 20", "21 a 40", "mais de 40"].map((v) => `<button class="btn sm ${palp === v ? "on" : "sec"} grow" data-a="palpite" data-val="${v}">${v}</button>`).join("")}</div></div>` : `<h2 class="row">${ico("lote-sobrado", "g")}Mercado de lotes</h2><p class="muted">Lance fechado. Quanto do caixa da família (${n0(f.caixa)}) oferecer além do mínimo de ${lanceMinimo(st.ano)}?</p>
        <div class="card"><div class="row" style="justify-content:space-between"><b>Parte do caixa</b><b class="mono">${loc.lance}%</b></div><input type="range" min="0" max="60" step="5" value="${loc.lance}" data-in="lance" data-key="lance">${efeitoLance(st, f, loc)}</div>
        <p class="faint">A família precisa de ${Math.ceil(f.membros.length / 3)} lote(s) para morar; tem ${f.lotes}. ${st.regra === "prosperidade" ? "Na Prosperidade, conta metade do que vocês oferecem além do mínimo. " : ""}Quem já levou um lote oferece metade no próximo.</p><button class="btn ok block" data-a="lance">Enviar lance</button>`;
      break;
    }
    case "alvara": {
      const c = carta(st.cartas.grande);
      bd = st.alvara.votos[id] != null ? enviado("Resposta secreta enviada.") + palpiteFaixa(st, id, "alvara", "quantos % da turma aceitariam?")
        : cartaCelular(c, `<b>Responda no seu lugar, longe da família.</b> Vale a resposta de uma pessoa sorteada; ninguém vai saber quem foi. ${esc(c.segmento[0].toUpperCase() + c.segmento.slice(1))} é personagem do jogo; os ${GANHO_GRANDE} pontos valem no seu placar pessoal.`, "alvara");
      break;
    }
    case "resultado": {
      // R13: dois tempos. Primeiro a vila inteira no telão; o extrato da família aparece aqui quando começa o último painel.
      const fx = st.fechamento?.extrato?.[f.id];
      const tr = tempoResultado(st), falta = st.painel != null ? (st.painel >= tr.n - 1 ? -10 : 999) : tr.ultimo - decorrido(st);   // atraso negativo: a animação já andou
      const pessoal = [];
      if (st.ano === 2 && st.pequena.votos[id] != null) pessoal.push(st.pequena.votos[id] ? `Você aceitou a proposta: +${GANHO_PEQUENA} no seu placar pessoal.` : "Você recusou a proposta.");
      if (st.ano === 4 && st.cartas && st.mente[id] != null) {
        const c = carta(st.cartas.ano4);
        if (c.tipo === "confia") pessoal.push(st.mente[id] ? (st.golpe[id] ? c.ruim : c.bom) : "Você não arriscou: nada mudou no seu placar.");
      }
      const pal = st.palpite?.[st.ano]?.[id];
      if (pal && st.leilao?.vendidos?.length) { const maior = Math.max(...st.leilao.vendidos.map((v) => v.preco)), certo = maior <= 20 ? "até 20" : maior <= 40 ? "21 a 40" : "mais de 40"; pessoal.push(`Lance vencedor: ${n0(maior)}. Seu palpite (${pal}) ${pal === certo ? "acertou" : "não acertou"}.`); }
      const espera = `<div class="card espera" style="text-align:center;--a:${falta.toFixed(2)}s">${ico("telao", "g")}<p class="muted" style="margin:6px 0 0"><b>Olhe o telão:</b> primeiro a vila inteira. O extrato da sua família aparece aqui em seguida.</p></div>`;
      const extrato = `<div class="surge" style="--a:${falta.toFixed(2)}s"><h2>Como ficou a sua família</h2><div class="card"><table class="vals">
        ${fx ? `<tr><td>Renda do ano</td><td class="n">${n0(fx.renda)}</td></tr><tr><td>Para o bem público</td><td class="n">−${n0(fx.aPub)}</td></tr>${st.ano >= 2 ? `<tr><td>Replantio</td><td class="n">−${n0(fx.aRep)}</td></tr><tr><td>Cargas (${fx.cargas})</td><td class="n">+${n0(fx.ganhoCarga)}</td></tr>` : ""}` : ""}
        <tr><td>Caixa</td><td class="n">${n0(f.caixa)}</td></tr><tr><td>Lotes (${VALOR_LOTE(st.publico)} cada)</td><td class="n">${f.lotes}</td></tr>
        <tr><td><b>Patrimônio</b></td><td class="n"><b>${n0(patrimonio(f, st.publico))}</b></td></tr>
        <tr><td>Patrimônio por pessoa</td><td class="n">${n0(porPessoa(st, f))}</td></tr>
        <tr><td>Posição por pessoa (só vocês veem)</td><td class="n">${posicao(st, f)}º de ${Object.keys(st.fams).length}</td></tr></table></div>
        ${pessoal.length ? `<div class="card"><b>Só para você</b>${pessoal.map((t) => `<p class="muted" style="margin:6px 0 0">${esc(t)}</p>`).join("")}</div>` : ""}${metaCelular(st)}</div>`;
      bd = espera + extrato;
      break;
    }
    case "voto":
      bd = st.voto[id] != null ? enviado("Voto secreto enviado.") + palpiteFaixa(st, id, "voto", "quantos % vão votar para trocar?") : `<h2 class="row">${ico("balanca", "g")}Que regra queremos?</h2><p class="muted"><b>Volte ao seu lugar para votar.</b> Vale para os anos 4 e 5. Voto secreto; vence a maioria dos votos, e empate mantém o Monopólio.</p>${controle(st, id)}
        <button class="opt" data-a="voto" data-val="0"><b>Manter o Monopólio</b><br><span class="faint">${esc(REGRAS_TXT.monopolio.curto)}</span></button>
        <button class="opt" data-a="voto" data-val="1"><b>Trocar para a Prosperidade</b><br><span class="faint">${esc(REGRAS_TXT.prosperidade.curto)}</span></button>`;
      break;
    case "fechamento": {
      const ja = st.final[id];
      // R10: placar da pessoa = a parte dela no patrimônio da família + os pontos pessoais; só ela vê
      const parte = patrimonio(f, st.publico) / f.membros.length, pes = st.pessoal[id] || 0;
      bd = `<h2>Fechamento</h2><div class="card"><b>Seu placar (só você vê)</b><table class="vals" style="margin-top:6px"><tr><td>Sua parte no patrimônio da família (${n0(patrimonio(f, st.publico))} ÷ ${f.membros.length})</td><td class="n">${n0(parte)}</td></tr><tr><td>Seus pontos pessoais</td><td class="n">${n0(pes)}</td></tr><tr><td><b>Placar</b></td><td class="n"><b>${n0(parte + pes)}</b></td></tr></table><p class="faint" style="margin:6px 0 0">Os pontos pessoais não entram no caixa da família, nas metas nem no telão.</p></div>` +
        (ja ? enviado("Obrigado!") : `<div class="card"><b>O que mais te guiou hoje?</b><div class="row" style="margin-top:6px">${GUIAS.map((g) => `<button class="btn sm ${loc.guia === g ? "on" : "sec"} grow" data-a="guia" data-val="${g}">${g}</button>`).join("")}</div>
          <b style="display:block;margin-top:10px">E o que mais pesou?</b><div class="row" style="margin-top:6px">${MOTIVOS.map((m) => `<button class="btn sm ${loc.motivo === m ? "on" : "sec"}" data-a="motivo" data-val="${m}">${m}</button>`).join("")}</div>
          <button class="btn ok block" style="margin-top:10px" data-a="final" ${loc.guia && loc.motivo ? "" : "disabled"}>Enviar</button></div>`);
      break;
    }
    default: bd = `<p class="muted">${esc(NOME_FASE[st.fase] || "")}</p>`;
  }
  return hd(st, me) + `<div class="bd">${bd}</div>`;
}

export function acaoAluno(a, el, { id, loc, dispatch }) {
  const val = el.dataset.val;
  switch (a) {
    case "achei": dispatch({ t: "achei", id }); return true;
    case "car": loc.car = +val; return true;
    case "propor": dispatch({ t: "propor", id, p: { pub: loc.pub, rep: loc.rep, car: loc.car } }); return true;
    case "prever": dispatch({ t: "prever", id, v: val }); return true;
    case "rolar": loc.face = 1 + Math.floor(Math.random() * 6); return true;
    case "mente": dispatch({ t: "mente", id, face: loc.face, acertei: val === "1" }); return true;   // dado: "acertei"; carta: ficar/confiar
    case "controle": dispatch({ t: "controle", id, op: +val }); return true;
    case "palpite": dispatch({ t: "palpite", id, v: val }); return true;
    case "lance": dispatch({ t: "lance", id, v: loc.lance / 100 }); return true;
    case "alvara": dispatch({ t: "alvara", id, aceita: val === "1" }); return true;
    case "pequena": dispatch({ t: "pequena", id, aceita: val === "1" }); return true;
    case "quem": dispatch({ t: "quem", id, v: +val }); return true;
    case "palpitePct": dispatch({ t: "palpitePct", id, v: +val }); return true;
    case "prev5": dispatch({ t: "prev5", id, v: val }); return true;
    case "voto": dispatch({ t: "voto", id, trocar: val === "1" }); return true;
    case "guia": loc.guia = val; return true;
    case "motivo": loc.motivo = val; return true;
    case "final": dispatch({ t: "final", id, guia: loc.guia, motivo: loc.motivo }); return true;
    default: return false;
  }
}
