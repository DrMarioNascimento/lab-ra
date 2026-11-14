import { nomeFase, progresso, agregadoOk, contagem } from "../engine.js";
import { NOVIDADE_DO_ANO, EXEMPLO_DO_ANO, EXEMPLO_VOTO, REGRAS_TXT, MOTIVOS, GUIAS, NIVEIS_PUBLICO } from "../content/vila.js";
import { carta, cartaAno4, CONFIANCA, textoCarta, QUEM_GOLPE, FAIXAS_PCT, faixaDe, CHANCE_GOLPE } from "../content/cartas.js";
import { gini, lanceMinimo, VITORIA, VALOR_LOTE, patrimonio, COLAPSO, progressoMeta } from "../content/regras.js";
import { iconeFamilia, mapaVila, linhaDoTempo, ico, fileira, unidade, pctL, nL } from "./desenho.js";

// Telão para TV (R11): letra grande, uma ideia por tela, barra de ícones com o estado da vila sempre no mesmo lugar.
// Detalhes e contas ficam no celular de cada um.
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const n0 = (x) => Math.round(x).toLocaleString("pt-BR");
const pct = (a, b) => (b ? Math.round((100 * a) / b) : 0);
const v2 = (x) => x.toFixed(2).replace(".", ",");
const fams = (st) => Object.values(st.fams);

// Relógio da fase: o telão se redesenha a cada envio, então as animações partem do tempo já decorrido (atraso negativo).
let chaveFase = "", inicioFase = 0;
export function decorrido(st) {
  const k = `${st.fase}:${st.ano}:${st.pergunta || 0}`;
  if (k !== chaveFase) { chaveFase = k; inicioFase = Date.now(); }
  return (Date.now() - inicioFase) / 1000;
}

// Ícone da novidade de cada ano
const ICONE_ANO = { 1: "economia", 2: "arvore-redonda", 3: "sobrado", 4: "lote-venda", 5: "alvara" };

// Barra de ícones: o estado da vila, sempre no mesmo lugar. No resultado, o que mudou pisca e mostra +/−.
function barra(st) {
  const fm = st.teto ? st.mata / st.teto : 0;
  const m = progressoMeta(st.fams, st.publico, st.mata, st.teto, st.regra);
  const fx = st.fase === "resultado" ? st.fechamento : null;
  const dMata = fx && st.ano >= 2 ? Math.round((100 * (st.mata - fx.mataAntes)) / st.teto) : 0;
  const dPub = fx ? st.publico - fx.nivelAntes : 0;
  const delta = (d) => (d ? `<em class="delta ${d > 0 ? "up" : "down"}">${d > 0 ? "+" : "−"}${Math.abs(d)}</em>` : "");
  const metaOk = m.valor >= m.alvo && m.mata >= VITORIA.mataMinima;
  const valMeta = m.regra === "prosperidade" ? `${pctL(m.valor)}<small>/${Math.round(100 * m.alvo)}%</small>` : `${nL(m.valor, m.alvo)}<small>/${m.alvo}</small>`;
  const livres = st.lotes.filter((x) => !x).length;
  const pips = (n, tot, fn) => Array.from({ length: tot }, (_, k) => `<i class="${fn(k + 1)}"></i>`).join("");
  return `<div class="hud">
    <div class="slot ano"><div><b>Ano ${st.ano}</b><span class="pips">${pips(st.ano, 5, (a) => (a < st.ano ? "feito" : a === st.ano ? "agora" : ""))}</span></div></div>
    <div class="slot">${ico("balanca")}<div><b>${REGRAS_TXT[st.regra].nome}</b><span>regra</span></div></div>
    ${st.ano >= 2 ? `<div class="slot ${fm < COLAPSO ? "mal" : fm < 0.5 ? "atencao" : ""} ${dMata ? "pulsa" : ""}">${ico("arvore-redonda")}<div><b>${pctL(fm)}${delta(dMata)}</b><span>mata</span></div></div>` : ""}
    <div class="slot ${dPub ? "pulsa" : ""}">${ico("economia")}<div><b class="niv">${pips(st.publico, 5, (k) => (k <= st.publico ? "on" : ""))}${delta(dPub)}</b><span>bem público</span></div></div>
    <div class="slot ${metaOk ? "ok" : ""}">${ico("meta")}<div><b>${valMeta}</b><span>meta da vila</span></div></div>
    ${st.ano >= 3 ? `<div class="slot">${ico("lote-venda")}<div><b>${livres}</b><span>lotes livres</span></div></div>` : ""}
  </div>`;
}

// Nas etapas de carta, o rótulo diz o tipo (o título já é o nome da carta)
function rotuloFase(st) {
  if (st.fase === "pequena") return "Proposta pequena · cada um por si";
  if (st.fase === "alvara") return "Proposta grande · uma pessoa sorteada";
  if (st.fase === "mente" && st.cartas) return carta(st.cartas.ano4).grupo === "confianca" ? "Confiança" : "Honestidade";
  return nomeFase(st);
}

function topo(st, titulo) {
  const p = progresso(st);
  return `<div class="top"><div class="grow"><div class="fase">Mosaico Vila · ${esc(rotuloFase(st))}</div><h1>${titulo}</h1></div>
    ${p && p.total ? `<div class="conta"><b class="mono">${p.feito}/${p.total}</b><span>${p.rot}</span><div class="prog"><i style="width:${(100 * p.feito) / p.total}%"></i></div></div>` : ""}</div>${st.ano ? barra(st) : ""}`;
}

// Exemplo resolvido linha a linha: uma linha grande por vez; as anteriores ficam menores e apagadas.
const passoExemplo = (linhas, total = 18) => Math.min(5, total / Math.max(1, linhas.length));
const linhasDe = (ex, st) => (typeof ex.linhas === "function" ? ex.linhas(st) : ex.linhas);
function exemploLinhas(st, linhas, ini = 1.5, cls = "") {
  const t = decorrido(st), passo = passoExemplo(linhas);
  return `<ol class="passo-a-passo ${cls}">${linhas.map((l, k) => `<li class="${k === linhas.length - 1 ? "ultimo" : ""}" style="--a:${(ini + k * passo - t).toFixed(2)}s;--b:${(ini + (k + 1) * passo - t).toFixed(2)}s">${esc(l)}</li>`).join("")}</ol>`;
}

// Cronômetro grande (conversa de 45 s), contado pelo próprio CSS.
const cronometro = (st, rot, seg = 45) => `<div class="crono-wrap"><div class="crono c${seg}" style="--d:${(-decorrido(st)).toFixed(2)}s"></div><b class="big">${rot}</b></div>`;

// Revelações em sequência: cada painel aparece no seu tempo; o último fica.
function sequencia(st, paineis) {
  // R13: quem conduz pode segurar um painel (ou ir e voltar); aí ele fica parado na tela
  if (st.painel != null) {
    const k = Math.min(st.painel, paineis.length - 1);
    return `<div class="seq fixo"><div class="painel">${paineis[k].html}</div></div><div class="seq-dots fixo">${paineis.map((p, i) => `<span class="${i === k ? "agora" : i < k ? "feito" : ""}">${esc(p.nome)}</span>`).join("")}</div>`;
  }
  const t = decorrido(st);
  let acc = 0;
  const tempos = paineis.map((p) => { const a = acc - t; acc += p.dur; return [a, acc - t]; });
  const ult = (k) => (k === paineis.length - 1 ? "ultimo" : "");
  return `<div class="seq">${paineis.map((p, k) => `<div class="painel ${ult(k)}" style="--a:${tempos[k][0].toFixed(2)}s;--b:${tempos[k][1].toFixed(2)}s">${p.html}</div>`).join("")}</div>
    <div class="seq-dots">${paineis.map((p, k) => `<span class="${ult(k)}" style="--a:${tempos[k][0].toFixed(2)}s;--b:${tempos[k][1].toFixed(2)}s">${esc(p.nome)}</span>`).join("")}</div>`;
}

const fato = (icone, texto, cls = "") => `<div class="fato ${cls}">${ico(icone)}<span>${texto}</span></div>`;

// R14: no ano 5, a proposta grande vem antes das decisões; o telão das decisões abre com o que aconteceu, para a turma reagir.
function bannerGrande(st) {
  if (!st.cartas || st.alvara.aceitariam == null) return "";
  const c = carta(st.cartas.grande), vs = Object.values(st.alvara.votos), ok = agregadoOk(vs.length);
  const e = st.alvara.estrago, falta = Math.max(0, COLAPSO * st.teto - st.mata);
  const efeito = !st.alvara.aceito ? "" : e?.alvo === "mata" ? (falta > 0 ? ` A mata está abaixo de 30%: faltam ${Math.max(1, Math.round((100 * falta) / st.teto))}% (cerca de ${n0(Math.ceil((falta / 2) * 5))} pontos de replantio) para ela voltar.` : " Já conta neste ano: dá para replantar.") : " Já conta na renda deste ano.";
  return `<div class="card banner ${st.alvara.aceito ? "mal" : "bom"}">${fato(c.icone, `${esc(textoCarta(c, st.alvara.aceito ? "aceito" : "recusado", { ...st.alvara.antes, teto: st.teto }))}${efeito}${ok ? ` <span class="sub">${pct(vs.filter(Boolean).length, vs.length)}% aceitariam.</span>` : ""}`, st.alvara.aceito ? "mal" : "bom")}</div>`;
}

// Carta sorteada da etapa (pequena, ano 4 ou grande): o telão mostra a carta e como a resposta conta.
function telaoCarta(st, c, rodape) {
  return topo(st, esc(c.titulo)) + `<div class="card destaque">${ico(c.icone, "xl")}<p class="enorme">${esc(textoCarta(c, "telao", { mata: st.mata, teto: st.teto, publico: st.publico }))}</p></div>
    <div class="card como"><p class="big" style="margin:0">${rodape}</p></div>
    <p class="rodape">A proposta é do jogo, não de um colega. Cada um responde no celular, sem mostrar a tela; o telão só mostra o total, com 5 ou mais respostas.</p>`;
}

// R16: na confiança, o telão mostra as 4 situações; cada pessoa recebe uma no celular, e a regra é a mesma em todas
function telaoConfianca(st) {
  return topo(st, "Uma questão de confiança") + `<div class="grid" style="grid-template-columns:repeat(4,1fr);gap:1.2cqw">${CONFIANCA.map((id) => { const c = carta(id); return `<div class="card row" style="flex-wrap:nowrap;gap:.8cqw;padding:1cqw 1.2cqw">${ico(c.icone)}<b class="big" style="margin:0">${esc(c.titulo)}</b></div>`; }).join("")}</div>
    <div class="card destaque"><p class="enorme">Cada pessoa recebe no celular <b>uma</b> destas situações. Em todas, você arrisca 2 antes de saber se a outra parte é honesta: honesta, +2; golpe, −2. <b>Não arriscar não custa nada.</b></p></div>
    <div class="card como"><p class="big" style="margin:0">Depois, no celular: quem você acha que mais dá golpe? No fim do ano, o telão mostra os golpes de cada situação, com os números da turma.</p></div>`;
}

export function renderTelao(st) {
  let body = "";
  switch (st.fase) {
    case "entrada":
      body = topo(st, "Mosaico Vila") + `<div class="grid" style="grid-template-columns:1.1fr 1fr;flex:1;min-height:0"><div class="card col" style="justify-content:center"><div class="row" style="gap:1.6cqw">${ico("app-mosaico-vila", "xl")}<div><div class="fase">Código da sala</div><div class="mono" style="font-size:7cqw;font-weight:800;letter-spacing:.1em">SIM-01</div></div></div><p class="big">Entre pelo celular. A turma vira uma vila; os grupos, famílias.</p></div>
        <div class="card" style="overflow:hidden"><h2>${st.ordem.length} na sala</h2><div class="row" style="margin-top:1cqw;gap:.5cqw">${st.ordem.map((id) => `<span class="chip nome">${esc(st.alunos[id].nome)}</span>`).join("")}</div></div></div>`;
      break;
    case "familias": {
      const fs = fams(st), cols = Math.min(fs.length, 4);
      body = topo(st, "Encontre a sua família") + `<div class="grid" style="grid-template-columns:repeat(${cols},1fr);flex:1;min-height:0;align-content:start">${fs.map((f) => `<div class="card fam"><div class="row" style="flex-wrap:nowrap">${iconeFamilia(f, 44)}<b>${esc(f.nome.replace("Família ", ""))}</b><span class="mono conta-fam">${f.membros.filter((m) => st.alunos[m].achou).length}/${f.membros.length}</span></div><p class="nomes">${f.membros.map((m) => esc(st.alunos[m].nome)).join(", ")}</p></div>`).join("")}</div>
        <p class="rodape">As famílias não começam iguais: uma tem herança e outra começa sem lote. Quem ficou onde foi sorteio, não mérito. Cada família vê a própria situação no celular.</p>`;
      break;
    }
    case "abertura": {
      const nov = NOVIDADE_DO_ANO[st.ano], ex = EXEMPLO_DO_ANO[st.ano];
      const rs = Object.values(st.renda || {});
      const aluguel = rs.reduce((a, r) => a + r.aluguel, 0), piso = rs.filter((r) => r.piso > 0).length;
      const v4 = st.ano === 4 ? resultadoVoto(st) : null;
      body = topo(st, `Ano ${st.ano}: ${esc(nov.titulo)}`) + (v4 ? v4.html : "") + `<div class="card destaque">${ico(ICONE_ANO[st.ano], v4 ? "g" : "xl")}<p class="${v4 ? "big" : "enorme"}" style="margin:0">${esc(nov.telao || nov.texto)}</p></div>` +
        (ex ? `<div class="card" style="flex:1;min-height:0"><h3 class="row">${ico("ideia")}Exemplo resolvido</h3>${exemploLinhas(st, linhasDe(ex, st), 1.5, v4 || linhasDe(ex, st).length >= 4 ? "compacto" : "")}</div><p class="rodape">${v4?.palpite || ""}No celular: ${v4 ? "pergunta rápida" : "uma pergunta rápida para conferir"} (não vale ponto).</p>`
          : `<div class="card"><p class="big" style="margin:0">${aluguel ? `${n0(aluguel)} pontos de aluguel vão mudar de mãos. ` : ""}${piso ? `${piso} família(s) receberam o piso de renda.` : "Nenhuma família precisou do piso de renda."}</p></div><p class="rodape">Cada família vê o próprio extrato no celular.</p>`);
      break;
    }
    case "decidir":
      body = topo(st, "Cada família decide") + (st.ano === 5 ? bannerGrande(st) : "") + `<div class="lado ${st.ano === 5 && st.cartas ? "compacto" : ""}"><div class="card mapa-card">${mapaVila(st)}</div>
        <div class="col centro">${cronometro(st, "Conversem na família")}<p class="big" style="text-align:center;margin:0">Cada um envia a sua proposta.<br>Vale a mediana da família.</p></div></div>`;
      break;
    case "pequena":
      { const c = carta(st.cartas.pequena), ef = textoCarta({ ...c, x: "{efeito}" }, "x", { mata: st.mata, teto: st.teto, publico: st.publico });
        body = telaoCarta(st, c, `Proposta pequena: <b>cada um decide por si</b> e cada resposta vale para quem respondeu. Se a turma inteira aceitar, ${esc(ef)}: o estrago de uma proposta grande.`); }
      break;
    case "mente": {
      const c = carta(st.cartas.ano4);
      if (c.grupo === "confianca") { body = telaoConfianca(st); break; }   // R16: cada um recebe uma das 4 situações
      body = telaoCarta(st, c, c.tipo === "dado" ? "Ninguém, nem o sistema, sabe o número que você pensou. Os 3 pontos são pessoais."
        : c.tipo === "honesto" ? "Ninguém vai conferir. Os 3 pontos são pessoais e não aparecem no telão."
        : `Você decide <b>antes</b> de saber se a outra pessoa é honesta. Cada um encontra uma pessoa diferente. Depois, no celular: quem você acha que mais dá golpe?`);
      break;
    }
    case "lances": {
      const livres = st.lotes.filter((x) => !x).length;
      body = topo(st, "Mercado de lotes") + `<div class="lado"><div class="card mapa-card">${mapaVila(st)}</div><div class="col">
        <div class="card row" style="flex-wrap:nowrap">${ico("lote-sobrado", "xl")}<div><b class="enorme mono">${Math.min(3, livres)}</b><div class="big">lotes à venda</div></div></div>
        <div class="card"><div class="big">Lance mínimo</div><b class="enorme mono">${lanceMinimo(st.ano)}</b></div>
        <p class="rodape">Lance fechado; vale a mediana da família; o maior leva. ${st.regra === "prosperidade" ? "Na Prosperidade, conta metade do que se oferece. " : ""}Quem já levou um lote oferece metade no próximo. Cada família compra até ter a moradia + 1 lote; quem não quer lote marca "não queremos".</p></div></div>`;
      break;
    }
    case "alvara":
      body = telaoCarta(st, carta(st.cartas.grande), "Proposta grande: todos respondem no próprio lugar, longe da família, mas <b>vale a resposta de uma pessoa sorteada</b>, que nunca aparece.");
      break;
    case "resultado": body = telaoResultado(st); break;
    case "conversa":
      // R16: 90 s de conversa com uma pergunta-guia antes de o voto abrir
      body = topo(st, "Antes do voto: conversem") + `<div class="lado"><div class="card col" style="justify-content:center;gap:1.2cqw">
        <p class="enorme" style="margin:0">Com o aluguel mordendo, qual regra deixa a vila mais perto da meta, e de quem?</p>
        <div class="row" style="gap:1.2cqw;flex-wrap:nowrap"><div class="card" style="flex:1"><b class="big">Manter o ${esc(REGRAS_TXT.monopolio.nome)}</b><p class="rodape" style="margin:.3cqw 0 0">meta de eficiência</p></div><div class="card" style="flex:1"><b class="big">Trocar para a ${esc(REGRAS_TXT.prosperidade.nome)}</b><p class="rodape" style="margin:.3cqw 0 0">meta de equidade</p></div></div>
        <p class="rodape">As regras e as metas inteiras estão no celular. O voto abre quando o relógio acabar; ele é secreto, cada um no próprio lugar.</p></div>
        <div class="col centro">${cronometro(st, "Conversem na família", 90)}</div></div>`;
      break;
    case "voto":
      body = topo(st, "Que regra queremos para os anos 4 e 5?") + `<div class="grid" style="grid-template-columns:1fr 1fr">
        <div class="card"><h2 class="row">${ico("balanca", "g")}Manter: ${REGRAS_TXT.monopolio.nome}</h2><p class="big" style="margin:.4cqw 0 0">${esc(REGRAS_TXT.monopolio.telao)}</p></div>
        <div class="card"><h2 class="row">${ico("balanca", "g")}Trocar: ${REGRAS_TXT.prosperidade.nome}</h2><p class="big" style="margin:.4cqw 0 0">${esc(REGRAS_TXT.prosperidade.telao)}</p></div></div>
        <div class="card" style="flex:1;min-height:0;overflow:hidden"><h3 class="row">${ico("ideia")}Exemplo resolvido</h3>${exemploLinhas(st, EXEMPLO_VOTO.linhas, 1.5, "compacto")}</div>
        <p class="rodape">Voto secreto, cada um no próprio lugar. Vence a maioria; empate mantém o Monopólio.</p>`;
      break;
    case "fechamento": body = telaoFechamento(st); break;
    default: body = topo(st, "Mosaico Vila");
  }
  return `<div class="tin">${body}</div>`;
}

// Quanto tempo as animações do telão pedem em cada fase (o simulador espera isso antes de avançar sozinho).
export function duracaoTelao(st) {
  if (st.fase === "abertura") { const ex = EXEMPLO_DO_ANO[st.ano]; if (!ex) return 8; const ls = linhasDe(ex, st); return 1.5 + passoExemplo(ls) * ls.length + 2; }
  if (st.fase === "voto") return 1.5 + passoExemplo(EXEMPLO_VOTO.linhas) * EXEMPLO_VOTO.linhas.length + 2;
  if (st.fase === "conversa") return 90;
  if (st.fase === "resultado") return tempoResultado(st).total;
  return 0;
}

// Tempo de "Como ficou a vila": 30 s (75 s no ano 3), mais o painel da carta do ano (15 s no ano 2, 20 s no ano 4, 40 s no ano 5).
// O celular mostra o extrato da família quando começa o último painel (R13: primeiro a vila, depois a própria família).
const EXTRA_CARTA = { 2: 15, 4: 20, 5: 20 };   // R14: no ano 5, a grande já foi revelada antes das decisões (20 s), e o painel do fim do ano recapitula
export function tempoResultado(st) {
  const ps = paineisResultado(st);
  const total = ps.reduce((a, p) => a + p.dur, 0);   // R16: cada painel fica pelo menos 10 s (o tempo da tela cresce junto)
  return { total, ultimo: total - ps.at(-1).dur, n: ps.length };
}
export function painelAtual(st) {
  if (st.painel != null) return st.painel;
  const t = decorrido(st), ps = paineisResultado(st);
  let acc = 0;
  for (let k = 0; k < ps.length; k++) { acc += ps[k].dur; if (t < acc) return k; }
  return ps.length - 1;
}

// Patrimônio das famílias (caixa + lotes × valor do lote), do maior para o menor, sem nome nem cor (regra dos 5).
const porPatrimonio = (st) => fams(st).map((f) => ({ pat: patrimonio(f, st.publico), pp: patrimonio(f, st.publico) / f.membros.length })).sort((a, b) => b.pp - a.pp);

// R13: unidade fixa no jogo inteiro: cada moeda vale 10 pontos (casas só querem dizer lotes).
const MOEDA = 10;
const moedas = (valor, cls = "") => fileira("moeda.svg", Math.max(0, valor), MOEDA, cls);

// O dinheiro: patrimônio por pessoa de cada família, em moedas, com a marca da meta.
function dinheiroPorPessoa(st, ranking) {
  const m = progressoMeta(st.fams, st.publico, st.mata, st.teto, st.regra);
  const mediaPP = ranking.reduce((a, f) => a + f.pp, 0) / ranking.length;
  const alvoPP = m.regra === "prosperidade" ? m.alvo * mediaPP : m.alvo;
  const maxPP = Math.max(alvoPP, ...ranking.map((f) => f.pp));
  const cab = Math.max(1, Math.ceil(maxPP / MOEDA));   // largura da fileira, em moedas
  const marca = `<i class="marca-meta" style="left:calc(var(--iso) * ${(alvoPP / MOEDA).toFixed(2)} + ${(0.12 * (alvoPP / MOEDA)).toFixed(2)}cqw)"><b>${m.regra === "prosperidade" ? `${Math.round(100 * m.alvo)}% da média` : `meta ${m.alvo}`}</b></i>`;
  const iso = ranking.length <= 5 ? 3.6 : ranking.length <= 6 ? 3.1 : 2.6;   // até 8 famílias cabem na tela
  const linhas = ranking.map((f) => `<div class="iso-linha"><span class="fila-moedas" style="--n:${cab};--iso:${iso}cqw">${moedas(f.pp)}${marca}</span><b class="mono">${n0(f.pp)}</b></div>`).join("");
  const metaTxt = m.regra === "prosperidade" ? `A família mais pobre tem <b>${pctL(m.valor)}</b> da média por pessoa (meta: ${Math.round(100 * m.alvo)}%).` : `Patrimônio médio: <b>${nL(m.valor, m.alvo)}</b> por pessoa (meta: ${m.alvo}).`;
  return `<div class="grid" style="grid-template-columns:1.55fr 1fr;flex:1;min-height:0">
    <div class="card" style="min-height:0;overflow:hidden"><h2>Patrimônio por pessoa, por família</h2><p class="rodape" style="margin-bottom:.6cqw">${moedas(MOEDA, "p")} Cada moeda = ${MOEDA} pontos. Sem nome de família.</p>${linhas}</div>
    <div class="card col" style="justify-content:center;gap:1.2cqw">${ico("meta", "xl")}<p class="big" style="margin:0">${metaTxt}</p><p class="rodape">${m.mata >= VITORIA.mataMinima ? `E a mata precisa ficar em pelo menos ${Math.round(100 * VITORIA.mataMinima)}%: está em ${pctL(m.mata)}.` : `Mata em ${pctL(m.mata)}: precisa chegar a ${Math.round(100 * VITORIA.mataMinima)}%. Assim, meta não batida.`}</p></div></div>`;
}

// A desigualdade em palavras: quantas vezes o patrimônio por pessoa da família mais rica cabe no da mais pobre.
function vezes(ranking) {
  const pps = ranking.map((f) => f.pp), max = Math.max(...pps), min = Math.min(...pps);
  if (min <= 0.5) return { txt: "A família mais pobre quase não tem patrimônio.", r: null };
  const r = max / min;
  return { r, txt: `Por pessoa, a família mais rica tem <b>${r.toFixed(1).replace(".", ",")}×</b> o patrimônio da mais pobre.` };
}

// Resultado do voto, na abertura do ano 4 (R13): só o total, com 5 ou mais votos, e o acerto do palpite.
function resultadoVoto(st) {
  const vs = Object.values(st.voto), pal = st.palpitePct.voto || {}, np = Object.keys(pal).length;
  if (!agregadoOk(vs.length)) return { html: `<div class="card">${fato("balanca", `Regra dos anos 4 e 5: <b>${REGRAS_TXT[st.regra].nome}</b>.`)}</div>`, palpite: "" };
  const p = vs.filter(Boolean).length / vs.length;
  const palpite = agregadoOk(np) ? `Palpite do voto: ${pct(Object.values(pal).filter((v) => v === faixaDe(p)).length, np)}% acertaram. ` : "";
  return { html: `<div class="card">${fato("balanca", `Voto: <b>${Math.round(100 * p)}%</b> quiseram trocar → <b>${REGRAS_TXT[st.regra].nome}</b> nos anos 4 e 5.`)}</div>`, palpite };
}

// Acerto do palpite de quantos aceitam (pequena e grande)
function acertoPalpite(st, onde, p) {
  const pal = st.palpitePct[onde] || {}, np = Object.keys(pal).length;
  return agregadoOk(np) ? `<p class="rodape">Palpite da turma: ${pct(Object.values(pal).filter((v) => v === faixaDe(p)).length, np)}% acertaram a faixa (${esc(FAIXAS_PCT[faixaDe(p)].toLowerCase())}).</p>` : "";
}
const textoEstrago = (e) => (!e ? "" : e.alvo === "mata" ? `a mata perdeu <b>${Math.round(e.pct)}%</b>` : e.niveis ? `o bem público caiu <b>${e.niveis} nível</b>` : `o bem público perdeu <b>${n0(e.pontos)} pontos</b> do próximo nível`);

// Painéis de "Como ficou a vila", com a duração de cada um (somam o tempo total da tela).
export function paineisResultado(st) {
  const fx = st.fechamento, H = st.historico;
  const giniPat = gini(fams(st).map((f) => patrimonio(f, st.publico) / f.membros.length));   // R14: por pessoa
  const giniRenda = st.renda ? gini(fams(st).map((f) => (st.renda[f.id]?.total ?? 0) / f.membros.length)) : 0;
  const pp = (x) => Math.round((100 * x) / st.teto);

  // 1. A vila: mapa grande e o que mudou na mata e no bem público
  const fatos = [];
  if (fx && st.ano >= 2) {
    const dm = st.mata - fx.mataAntes, corr = fx.estrago?.alvo === "mata" ? fx.estrago.mata : 0, nat = dm + fx.extr - fx.plant + corr;
    fatos.push(fato("arvore-redonda", `A mata ${dm >= 0 ? "subiu" : "desceu"} <b>${Math.abs(pp(dm))}%</b>`));
    fatos.push(`<div class="chips-iso"><span class="chip">${ico("toco")}cargas −${pp(fx.extr)}%</span><span class="chip">${ico("arvore-cubos")}replantio +${pp(fx.plant)}%</span>${corr ? `<span class="chip mal">${ico("alvara")}proposta −${pp(corr)}%</span>` : ""}<span class="chip">${ico("arvore-dourada")}natureza ${nat >= 0 ? "+" : "−"}${Math.abs(pp(nat))}%</span></div>`);
  }
  if (fx) fatos.push(st.publico > fx.nivelAntes ? fato("economia", `Bem público subiu para o nível <b>${st.publico}</b>: ${esc(NIVEIS_PUBLICO[st.publico])}`) : st.publico < fx.nivelAntes ? fato("economia", `Bem público caiu para o nível <b>${st.publico}</b>`, "mal") : fato("economia", `Bem público ficou no nível ${st.publico}`));
  if (st.colapsou) {
    const falta = Math.max(0, COLAPSO * st.teto - st.mata);
    fatos.push(st.ano < 5 ? fato("toco", `Mata abaixo de 30%: −4 por pessoa até voltar. Faltam <b>${Math.max(1, pp(falta))}%</b> (cerca de ${n0(Math.ceil((falta / 2) * 5))} pontos de replantio).`, "mal")
      : fato("toco", "A mata terminou abaixo de 30%: a meta pede mais que isso.", "mal"));
  } else if (st.colapsouAlguma) fatos.push(fato("arvore-redonda", "A mata voltou a passar dos 30%: o −4 acabou", "bom"));
  const prev = st.previsao[st.ano] || {}, np = Object.keys(prev).length;
  if (st.ano >= 2 && agregadoOk(np) && fx) { const real = st.mata > fx.mataAntes + 0.5 ? "sobe" : st.mata < fx.mataAntes - 0.5 ? "desce" : "fica"; fatos.push(`<p class="rodape">Previsão da mata: ${pct(Object.values(prev).filter((v) => v === real).length, np)}% acertaram.</p>`); }
  const paineis = [{ nome: "A vila", dur: 10, html: `<div class="lado"><div class="card mapa-card">${mapaVila(st)}</div><div class="col" style="justify-content:center">${fatos.join("")}</div></div>` }];

  // 2. O aluguel (ano 3): as moedas que mudaram de mãos e a desigualdade da renda por pessoa, antes e depois
  if (st.ano === 3 && st.renda) {
    const fs = fams(st), rs = fs.map((f) => st.renda[f.id]);
    const pg = rs.reduce((a, r) => a + r.aluguel, 0);
    const g0 = gini(fs.map((f, k) => (rs[k].base + rs[k].bonusMata - rs[k].perdaMata) / f.membros.length)), g1 = gini(fs.map((f, k) => rs[k].total / f.membros.length));
    paineis.push({ nome: "O aluguel", dur: 25, html: `<div class="card col" style="flex:1;justify-content:center;gap:1.6cqw">
      <h2 class="row">${ico("sobrado", "g")}${n0(pg)} pontos de aluguel mudaram de mãos</h2>
      <p class="big" style="margin:0">Saíram de quem não tem lote suficiente e foram para quem tem lote sobrando.</p>
      <div class="iso-linha">${moedas(pg, "g")}</div>
      <p class="rodape">Cada moeda = ${MOEDA} pontos.</p>
      <p class="enorme">Desigualdade da renda do ano, por pessoa: ${v2(g0)} sem aluguel → <span style="color:#fca5a5">${v2(g1)}</span> com aluguel</p></div>` });
  }

  // 3. Acontecimentos do ano (mercado e palpite do lance)
  const acont = [];
  if (st.ano >= 4 && st.leilao) {
    const nv = st.leilao.vendidos.length, vl = VALOR_LOTE(st.publico);
    acont.push(fato("lote-venda", nv ? `${nv === 1 ? "1 lote vendido" : `${nv} lotes vendidos`}. O maior lance foi <b>${n0(Math.max(...st.leilao.vendidos.map((v) => v.preco)))}</b>, por um lote que vale <b>${vl}</b> no patrimônio (10 + 2 × nível ${st.publico}).` : "Nenhum lote vendido: ninguém tinha caixa para o mínimo."));
    if (nv) acont.push(`<p class="rodape">O lance sai do caixa e vai para o banco: o patrimônio da família cai a diferença entre o lance e o valor do lote.</p>`);
    // R16: quem ficou de fora por escolha ou porque já tinha a moradia + 1 lote (só o número, sem nomes)
    const nS = st.leilao.semLote?.length || 0, nT = st.leilao.noTeto?.length || 0;
    const fora = [nS ? (nS === 1 ? `1 família marcou "não queremos lote"` : `${nS} famílias marcaram "não queremos lote"`) : "", nT ? (nT === 1 ? "1 família já tinha a moradia + 1 lote" : `${nT} famílias já tinham a moradia + 1 lote`) : ""].filter(Boolean);
    if (fora.length) acont.push(`<p class="rodape">${fora.join("; ")}.</p>`);
    const pal = st.palpite?.[st.ano] || {}, npl = Object.keys(pal).length;
    if (st.leilao.vendidos.length && agregadoOk(npl)) {
      const maior = Math.max(...st.leilao.vendidos.map((v) => v.preco)), certo = maior <= 20 ? "até 20" : maior <= 40 ? "21 a 40" : "mais de 40";
      acont.push(`<p class="rodape">Palpite do lance vencedor: ${pct(Object.values(pal).filter((v) => v === certo).length, npl)}% acertaram (${certo}).</p>`);
    }
  }
  if (acont.length) paineis.push({ nome: "Mercado", dur: 6, html: `<div class="card col" style="flex:1;justify-content:center;gap:1.4cqw">${acont.join("")}</div>` });

  // 4. A carta do ano: pequena (ano 2), honestidade ou confiança (ano 4), grande (ano 5, em dois painéis)
  const extra = st.ano === 4 && st.semTroco ? 0 : EXTRA_CARTA[st.ano] || 0;
  if (st.ano === 2 && st.cartas && st.pequena.aceitaram != null) {
    // R16: a porcentagem é de quem respondeu (a mesma base da grande); o estrago conta a turma inteira (quem não respondeu recusou)
    const c = carta(st.cartas.pequena), n = st.ordem.length, p = st.pequena.n ? st.pequena.aceitaram / st.pequena.n : 0, fe = n ? st.pequena.aceitaram / n : 0, ok = agregadoOk(st.pequena.n);
    const e = st.pequena.estrago, antes = { mata: st.mata + (e?.mata || 0), teto: st.teto, publico: st.publico + (e?.niveis || 0) };
    paineis.push({ nome: c.titulo, carta: true, dur: extra, html: `<div class="card destaque">${ico(c.icone, "xl")}<div class="col" style="gap:1cqw">
      <p class="enorme">${ok ? `<b>${Math.round(100 * p)}%</b> de quem respondeu aceitou a proposta ${esc(c.de)}.` : "Menos de 5 respostas: o total fica guardado."}</p>
      <p class="big" style="margin:0">${st.pequena.aceitaram ? `Somando os pequenos, ${textoEstrago(st.pequena.estrago)}: ${Math.round(100 * fe)}% do estrago de uma grande.` : "Ninguém aceitou: nada se perdeu."} Se a turma inteira aceitasse, ${textoCarta({ ...c, x: "{efeito}" }, "x", antes)}: o mesmo estrago de uma proposta grande.</p>
      ${ok ? acertoPalpite(st, "pequena", p) : ""}</div></div>` });
  }
  if (st.ano === 4 && !st.semTroco && st.cartas) {
    const c = carta(st.cartas.ano4), vals = Object.values(st.mente), nv = vals.length, sim = vals.filter(Boolean).length;
    let html;
    if (c.tipo === "confia") {
      const confiaram = Object.keys(st.golpe), honestos = confiaram.filter((id) => !st.golpe[id]).length;
      // R16: golpes por situação, com os números da própria turma (cada pessoa recebeu uma situação)
      const porTipo = CONFIANCA.map((cid) => { const ids = confiaram.filter((id) => cartaAno4(st, id).id === cid); return { c: carta(cid), n: ids.length, g: ids.filter((id) => st.golpe[id]).length }; });
      const q = Object.values(st.quem).filter((v) => v >= 0), qc = contagem(q);   // R15: "prefiro não responder" fica de fora
      html = `<div class="grid" style="grid-template-columns:1fr 1fr;flex:1;min-height:0">
        <div class="card col" style="justify-content:center;gap:1cqw;min-height:0;overflow:hidden">
          <p class="big" style="margin:0">${agregadoOk(nv) ? `<b>${pct(sim, nv)}%</b> confiaram.` : ""} ${agregadoOk(confiaram.length) ? `Dos que confiaram, <b>${pct(honestos, confiaram.length)}%</b> encontraram gente honesta.` : ""}</p>
          ${agregadoOk(confiaram.length) ? `<div class="col" style="gap:.4cqw">${porTipo.map((t) => `<div class="barra-rot"><span>${esc(t.c.titulo)}</span><div class="barra"><i style="width:${t.n ? pct(t.g, t.n) : 0}%;background:#f87171"></i></div><b class="mono">${t.g}/${t.n}</b></div>`).join("")}<p class="rodape" style="margin:0">Golpes sofridos / quem confiou, em cada situação.</p></div>` : ""}
          <p class="big" style="color:#86efac;margin:0;font-weight:800">A chance de golpe era a mesma em todas: 1 em ${Math.round(1 / CHANCE_GOLPE)}.${agregadoOk(confiaram.length) ? " As diferenças são do acaso, com poucos casos." : ""}</p></div>
        <div class="card col" style="justify-content:center;gap:.6cqw"><b class="big">Quem a turma achou que mais dava golpe</b>${agregadoOk(q.length) ? QUEM_GOLPE.map((t, k) => `<div class="barra-rot"><span>${esc(t)}</span><div class="barra"><i style="width:${pct(qc[k] || 0, q.length)}%"></i></div><b class="mono">${pct(qc[k] || 0, q.length)}%</b></div>`).join("") : `<p class="rodape">Menos de 5 respostas.</p>`}</div></div>`;
    } else {
      const acaso = c.tipo === "dado" ? " (por acaso, cerca de 17%)" : "";
      html = `<div class="card destaque">${ico(c.icone, "xl")}<p class="enorme">${agregadoOk(nv) ? `${esc(c.titulo)}: <b>${pct(sim, nv)}%</b> ${c.tipo === "dado" ? 'disseram "acertei"' : "ficaram com os 3"}${acaso}.` : "Menos de 5 respostas: o total fica guardado."}</p></div>`;
    }
    paineis.push({ nome: c.grupo === "confianca" ? "Confiança" : c.titulo, carta: true, dur: extra, html });
  }
  if (st.ano === 5 && st.cartas && st.alvara.aceitariam != null) {
    // R14: a grande foi revelada antes das decisões (bannerGrande); aqui, a recapitulação ao lado da pequena
    const c = carta(st.cartas.grande), vs = Object.values(st.alvara.votos), ok = agregadoOk(vs.length), p = vs.length ? vs.filter(Boolean).length / vs.length : 0;
    const pq = st.pequena.n ? st.pequena.aceitaram / st.pequena.n : null;   // R16: mesma base (quem respondeu)
    paineis.push({ nome: c.titulo, carta: true, dur: extra, html: `<div class="card col" style="flex:1;justify-content:center;gap:1.3cqw">
      ${fato(c.icone, esc(textoCarta(c, st.alvara.aceito ? "aceito" : "recusado", { ...st.alvara.antes, teto: st.teto })), st.alvara.aceito ? "mal" : "bom")}
      ${ok ? fato("ideia", `<b>${Math.round(100 * p)}%</b> aceitariam os 8 pontos ${esc(c.de)}.`) : ""}
      ${pq != null && agregadoOk(st.pequena.n) && ok ? fato("balanca", `Na proposta pequena do ano 2, <b>${Math.round(100 * pq)}%</b> aceitaram; na grande, <b>${Math.round(100 * p)}%</b> aceitariam.`) : ""}
      ${ok ? acertoPalpite(st, "alvara", p) : ""}<p class="rodape">Na pequena, cada um decidiu por si; na grande, uma só pessoa sorteada tinha o poder, e ela nunca aparece.</p></div>` });
  }

  // 5. O dinheiro: patrimônio por pessoa em moedas, e a meta
  const ranking = porPatrimonio(st);
  paineis.push({ nome: "O dinheiro", dur: st.ano === 3 ? 15 : 10, html: dinheiroPorPessoa(st, ranking) });

  // 6. A desigualdade: em palavras e nos dois gráficos (mata; patrimônio e renda)
  const vz = vezes(ranking);
  const p5 = st.ano === 5 ? Object.values(st.prev5) : [];
  const subiu = H.length ? giniPat > (H.at(-1)?.gini ?? 0) + 0.005 : null;
  const prev5 = agregadoOk(p5.length) && subiu != null ? `<p class="rodape">Palpite do ano 5: ${pct(p5.filter((v) => v === (subiu ? "sobe" : "desce")).length, p5.length)}% acertaram (a desigualdade ${subiu ? "subiu" : "não subiu"}).</p>` : "";
  paineis.push({ nome: "A desigualdade", dur: st.ano === 3 ? 23 : 10, html: `<div class="grid" style="grid-template-columns:${H.length ? "1fr 1.15fr" : "1fr"};flex:1;min-height:0">
    <div class="card col" style="justify-content:center;gap:1.2cqw"><p class="enorme">${vz.txt}</p>
      <p class="big" style="margin:0">Desigualdade (0 = todos iguais): patrimônio <b>${v2(giniPat)}</b> · renda do ano <b>${v2(giniRenda)}</b></p>${prev5}</div>
    ${H.length ? `<div class="card linha-grande">${linhaDoTempo([...H, { gini: giniPat, giniRenda, mata: st.mata / st.teto }].slice(0, 5))}</div>` : ""}</div>` });

  // O tempo total da tela: 30 s (75 s no ano 3) para os painéis de sempre, mais o tempo próprio dos painéis da carta do ano
  const base = st.ano === 3 ? 75 : 30, soma = paineis.filter((p) => !p.carta).reduce((a, p) => a + p.dur, 0);
  paineis.forEach((p) => { if (!p.carta) p.dur = Math.max(10, (p.dur * base) / soma); });   // R16: no mínimo 10 s por painel
  return paineis;
}

function telaoResultado(st) {
  return topo(st, `Como ficou a vila no ano ${st.ano}`) + sequencia(st, paineisResultado(st));
}

// Cinco perguntas encadeadas, uma por tema, montadas com os dados da própria turma; R14: cada uma puxa a anterior.
const TEMAS = ["Aluguel", "Voto", "Mata", "Honestidade", "Profissão"];
const ARTIGO = { monopolio: "o Monopólio", prosperidade: "a Prosperidade" };
function perguntasFechamento(st) {
  const H = st.historico, g = (k) => H[k]?.gini ?? 0, gr = (k) => H[k]?.giniRenda ?? 0;
  const subiu = H.length >= 3 && (gr(2) > gr(1) + 0.01 || g(2) > g(1) + 0.005);
  const mataMin = Math.min(...H.map((x) => x.mata));
  const cargas = Math.round((100 * H.reduce((a, x) => a + (x.extr || 0), 0)) / (st.teto || 1)), prop = Math.round((100 * (st.estragoMata || 0)) / (st.teto || 1));
  const pub = Math.round(st.estragoPublico || 0);
  const origem = (prop ? `As cargas tiraram ${cargas}% da mata nos cinco anos; as propostas aceitas, ${prop}%.` : `As cargas tiraram ${cargas}% da mata nos cinco anos.`) + (pub ? ` E as propostas tiraram ${pub} pontos do bem público.` : "");
  const vs = Object.values(st.alvara?.votos || {}), n = st.ordem.length;
  // R16: as duas porcentagens sobre quem respondeu; o estrago da pequena sobre a turma inteira
  const pq = agregadoOk(st.pequena?.n || 0) ? pct(st.pequena.aceitaram, st.pequena.n) : null, pg = agregadoOk(vs.length) ? pct(vs.filter(Boolean).length, vs.length) : null;
  const fe = n ? Math.round((100 * (st.pequena?.aceitaram || 0)) / n) : 0;
  return [
    H.length >= 3 ? (subiu ? "Quando o aluguel entrou (ano 3), a desigualdade subiu. Quem ganhou com isso, e sem fazer o quê?" : "Quando o aluguel entrou (ano 3), a desigualdade não subiu. O que segurou?") : "A desigualdade entre as famílias cresceu ou caiu? Por quê?",
    `Com o aluguel mordendo, a vila ${st.votoTrocou ? "trocou para a Prosperidade (equidade)" : "ficou no Monopólio (eficiência)"}. Vocês votaram pelo próprio bolso, pela vila ou pela meta que parecia mais fácil?`,
    `Bolso ou vila também na mata: ${origem} ${st.colapsouAlguma ? (st.colapsou ? "Ela colapsou e não voltou." : "Ela colapsou e voltou.") : `O pior ano chegou a ${Math.round(100 * mataMin)}%.`} Quem pagou a conta?`,
    pq != null && pg != null
      ? (Math.abs(pq - pg) < 10
        ? `Na pequena, ${pq}% aceitaram (${fe}% do estrago de uma grande); na grande, ${pg}% aceitariam: quase o mesmo. Por que o tamanho da proposta quase não mudou a resposta?`
        : pq < pg
          ? `Na pequena, ${pq}% aceitaram (${fe}% do estrago de uma grande). Na grande, em que uma pessoa só decidiria, ${pg}% aceitariam. Por que mais gente toparia a grande?`
          : `Na pequena, ${pq}% aceitaram (${fe}% do estrago de uma grande; com todos, seria igual). Na grande, ${pg}% aceitariam. Por que a pequena parece menos grave?`)
      : "Das propostas: na pequena, cada um decidiu por si; na grande, uma pessoa tinha o poder. Qual pareceu mais grave, e por quê?",
    "Fora da vila: na profissão de vocês, onde estão a \"mata comum\" e as propostas pequenas?",
  ];
}

// R15: de onde vem cada tema, para a turma (uma linha embaixo do gráfico)
function teoria(st, k) {
  const conf = st.cartas && !st.semTroco && carta(st.cartas.ano4).grupo === "confianca";
  return ["Henry George: o valor da terra vem da comunidade; quem só tem o lote recebe sem fazer.",
    "Lizzie Magie (1904): o Jogo do Proprietário, avô do Banco Imobiliário, já tinha estas duas regras.",
    "Elinor Ostrom: comunidades cuidam do comum quando fazem regras e conversam.",
    `Abbink e colegas (2002): experimentos de propina${conf ? "; Berg e colegas (1995): o jogo da confiança" : "; Jiang (2013): o jogo da mente"}.`,
    "Elinor Ostrom (pescas, pastos, canais): o comum também está em postos, praças e clubes."][k] || "";
}

// Ligação de cada pergunta com a anterior e com o resto da partida (uma linha embaixo da pergunta)
function apoioPergunta(st, k) {
  const o = st.outra;
  if (k === 0) return "Primeiro 1 minuto em dupla; depois, a turma.";
  if (k === 1 && o) return `E se fosse ${ARTIGO[o.regra]}? Mesmas decisões: desigualdade final ${v2(o.gini)} (foi ${v2(st.historico.at(-1)?.gini ?? 0)}), meta ${o.meta ? "batida" : "não batida"}. É um "e se": na outra regra, vocês talvez decidissem diferente.`;
  if (k === 4) return "Por exemplo: a agenda do posto, a praça onde se treina, a verba do clube. Quem cobra aluguel dela?";
  if (k === 3 && st.cartas && !st.semTroco) {
    const c = carta(st.cartas.ano4), vals = Object.values(st.mente);
    if (agregadoOk(vals.length)) return c.tipo === "confia" ? `E no ano 4 (confiança): ${pct(vals.filter(Boolean).length, vals.length)}% confiaram, e a chance de golpe era a mesma em todas as situações.` : `E no ano 4 (${c.titulo}): ${pct(vals.filter(Boolean).length, vals.length)}% ficaram com o que não era seu, sem ninguém para conferir.`;
  }
  return "";
}

// R16: na pergunta 4, as duas propostas lado a lado (mesma base: quem respondeu); na 5, o que guiou a turma
function barrasPropostas(st) {
  const vs = Object.values(st.alvara?.votos || {});
  if (!agregadoOk(st.pequena?.n || 0) || !agregadoOk(vs.length)) return `<p class="rodape">Menos de 5 respostas numa das propostas: os totais ficam guardados.</p>`;
  const linhas = [["Pequena: cada um por si", st.pequena.aceitaram, st.pequena.n], ["Grande: uma pessoa sorteada", vs.filter(Boolean).length, vs.length]];
  return `<div class="col fech-barras">${linhas.map(([rot, a, n]) => `<div><div class="row" style="justify-content:space-between;flex-wrap:nowrap"><b>${rot}</b><b class="mono">${pct(a, n)}%</b></div><div class="barra grande"><i style="width:${pct(a, n)}%"></i></div><p class="rodape">aceitaram ${a} de ${n} que responderam</p></div>`).join("")}</div>`;
}
function guiouTurma(st) {
  const fin = Object.values(st.final);
  if (!agregadoOk(fin.length)) return `<p class="rodape">O que guiou a turma aparece com 5 ou mais respostas.</p>`;
  const guias = contagem(fin.map((x) => x.guia)), motivos = contagem(fin.map((x) => x.motivo));
  return `<div class="col fech-barras"><div><b>O que guiou (Platão e Hume)</b><p class="rodape">${GUIAS.map((g) => `${g} <b>${guias[g] || 0}</b>`).join(" · ")}</p></div><div><b>O que mais pesou</b><p class="rodape">${MOTIVOS.map((m) => `${m} <b>${motivos[m] || 0}</b>`).join(" · ")}</p></div></div>`;
}

function telaoFechamento(st) {
  const ranking = porPatrimonio(st), vz = vezes(ranking);
  const k = st.pergunta || 0, qs = perguntasFechamento(st), apoio = apoioPergunta(st, k);
  const fin = Object.values(st.final);
  const guias = contagem(fin.map((x) => x.guia)), motivos = contagem(fin.map((x) => x.motivo));
  const longa = qs[k].length + apoio.length > 170;
  return topo(st, "Fechamento") + `<div class="grid" style="grid-template-columns:1fr 1.25fr;flex:1;min-height:0">
    <div class="card col" style="min-height:0;gap:.7cqw;overflow:hidden"><h2 class="row" style="color:var(${st.vitoria ? "--ok" : "--warn"})">${ico(st.vitoria ? "trofeu" : "meta", "g")}${st.vitoria ? "A vila bateu a meta!" : "A vila não bateu a meta"}</h2>
      <p class="big" style="margin:0;font-size:2.1cqw">${vz.txt}</p>
      <div class="linha-media">${k === 3 ? barrasPropostas(st) : k === 4 ? guiouTurma(st) : linhaDoTempo(st.historico, { F: 30, alto: 240, so: k === 2 ? "mata" : "desig" })}</div><p class="rodape teoria">De onde vem: ${esc(teoria(st, k))}</p></div>
    <div class="col" style="min-height:0"><div class="card pergunta" style="flex:1;min-height:0;overflow:hidden"><div class="temas">${TEMAS.map((t, i) => `<span class="${i === k ? "agora" : i < k ? "feito" : ""}">${t}</span>`).join("")}</div>
      <p class="pergunta-txt ${longa ? "longa" : ""}">${esc(qs[k])}</p>${apoio ? `<p class="rodape apoio">${esc(apoio)}</p>` : ""}${k === 0 ? `<div class="crono-mini">${cronometro(st, "1 min em dupla", 60)}</div>` : ""}</div>
      </div></div>`;
}
