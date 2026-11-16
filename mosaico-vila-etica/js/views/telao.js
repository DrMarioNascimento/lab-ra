import { nomeFase, progresso, agregadoOk, contagem, vista, ALVO_LAZER, SEG_LAZER } from "../engine.js";
import { CONCEITOS_DO_MOMENTO, verbete, etiqueta, CATEGORIAS } from "../content/glossario.js";
import { NOVIDADE_DO_ANO, EXEMPLO_DO_ANO, EXEMPLO_VOTO, REGRAS_TXT, MOTIVOS, GUIAS, NIVEIS_PUBLICO } from "../content/vila.js";
import { carta, cartaAno4, CONFIANCA, textoCarta, QUEM_GOLPE, FAIXAS_PCT, faixaDe, CHANCE_GOLPE, falaDe } from "../content/cartas.js";
import { gini, lanceMinimo, VITORIA, VALOR_LOTE, patrimonio, COLAPSO, progressoMeta, MATA_INICIO, PONTOS_NIVEL } from "../content/regras.js";
import { iconeFamilia, mapaVila, linhaDoTempo, ico, fileira, unidade, pctL, pctNum, nL } from "./desenho.js";

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
const ICONE_ANO = { 1: "economia", 2: "arvore-redonda", 3: "sobrado", 4: "lote-alfinete", 5: "alvara" };

// Barra de ícones: o estado da vila, sempre no mesmo lugar. No resultado, o que mudou pisca e mostra +/−.
function barra(st0) {
  const st = vista(st0);
  const fm = st.teto ? st.mata / st.teto : 0;
  const m = progressoMeta(st.fams, st.publico, st.mata, st.teto, st.regra);
  const fx = st.fase === "resultado" ? st.fechamento : null;
  const dMata = fx && st.ano >= 2 ? Math.round((pctNum(st.mata / st.teto) - pctNum(fx.mataAntes / st.teto)) * 10) / 10 : 0;   // R18: igual ao painel A vila; R25: com a casa decimal perto dos limiares
  const dPub = fx ? st.publico - fx.nivelAntes : 0;
  const delta = (d) => (d ? `<em class="delta ${d > 0 ? "up" : "down"}">${d > 0 ? "+" : "−"}${Math.abs(d).toLocaleString("pt-BR")}</em>` : "");
  const metaOk = m.valor >= m.alvo && m.mata >= VITORIA.mataMinima;
  const noVoto = st.ano === 3;   // R20 a R22: no ano 3 inteiro (o ano do voto), a barra não mostra a meta de uma regra só   // R20 e R21: perto do voto, a barra não mostra a meta de uma regra só
  const valMeta = noVoto ? `<small>duas metas</small>` : m.regra === "prosperidade" ? `${pctL(m.valor)}<small>/${Math.round(100 * m.alvo)}%</small>` : `${nL(m.valor, m.alvo)}<small>/${m.alvo}</small>`;
  const livres = st.lotes.filter((x) => !x).length;
  const pips = (n, tot, fn) => Array.from({ length: tot }, (_, k) => `<i class="${fn(k + 1)}"></i>`).join("");
  return `<div class="hud">
    <div class="slot ano"><div><b>Ano ${st.ano}</b><span class="pips">${pips(st.ano, 5, (a) => (a < st.ano ? "feito" : a === st.ano ? "agora" : ""))}</span></div></div>
    <div class="slot">${ico("balanca")}<div><b>${REGRAS_TXT[st.regra].nome}</b><span>regra</span></div></div>
    ${st.ano >= 2 ? `<div class="slot ${fm < COLAPSO ? "mal" : fm < 0.5 ? "atencao" : ""} ${dMata ? "pulsa" : ""}">${ico("arvore-redonda")}<div><b>${pctL(fm)}${delta(dMata)}</b><span>mata</span></div></div>` : ""}
    <div class="slot ${dPub ? "pulsa" : ""}">${ico("economia")}<div><b class="niv">${pips(st.publico, 5, (k) => (k <= st.publico ? "on" : ""))}${delta(dPub)}</b><span>bem público</span></div></div>
    <div class="slot ${metaOk && !noVoto ? "ok" : ""}">${ico("meta")}<div><b>${valMeta}</b><span>meta da vila</span></div></div>
    ${st.ano >= 3 ? `<div class="slot">${ico("lote-alfinete")}<div><b>${livres}</b><span>lotes livres</span></div></div>` : ""}
  </div>`;
}

// Nas etapas de carta, o rótulo diz o tipo (o título já é o nome da carta)
function rotuloFase(st) {
  if (st.fase === "pequena") return "Proposta pequena · cada um por si";
  if (st.fase === "alvara") return "Proposta grande · uma pessoa sorteada";
  if (st.fase === "mente" && st.cartas) return carta(st.cartas.ano4).grupo === "confianca" ? "Confiança" : "Honestidade";
  return nomeFase(st);
}

function topo(st, titulo, conc = []) {
  const p = progresso(st);
  // Ética: conceitos na mesma linha do título (sem tirar altura das telas cheias, como o fechamento)
  // Largura estimada em "unidades" (1 ≈ um caractere do chip): entra só o que cabe, sem cortar nome ao meio.
  // Título curto (o fechamento): conceitos ao lado do título; título longo (as aberturas): na linha da etapa.
  const fase = st.vizinhos ? `${rotuloFase(st)} · com vizinhos automáticos` : `Mosaico Vila Ética · ${rotuloFase(st)}`;
  const tituloTxt = String(titulo).replace(/<[^>]*>/g, ""), aoLado = tituloTxt.length <= 16;
  let sobra = aoLado ? 88 - 2.2 * tituloTxt.length - 2 : 78 - 1.25 * fase.length;
  const chips = conc.map(verbete).filter(Boolean).map((v) => {
    const autor = v.autor && !/\d/.test(v.autor) ? v.autor : "", cheio = v.termo.length + (autor ? autor.length + 3 : 0) + 2.5, curto = v.termo.length + 2.5;
    const comAutor = cheio <= sobra, cabe = comAutor || curto <= sobra;
    if (!cabe) { sobra = -1; return ""; }
    sobra -= comAutor ? cheio : curto;
    return `<span class="chip conceito" style="--c:${CATEGORIAS[v.cat]?.cor || "#a78bfa"}"><b>${esc(v.termo)}</b>${comAutor && autor ? ` · ${esc(autor)}` : ""}</span>`;
  }).join("");
  return `<div class="top"><div class="grow">${aoLado ? `<div class="fase">${esc(fase)}</div><div class="titulo-conc"><h1>${titulo}</h1>${chips}</div>` : `<div class="fase-conc"><span class="fase">${esc(fase)}</span>${chips}</div><h1>${titulo}</h1>`}</div>
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
const cronometro = (st, rot, seg = 45, inicio = 0) => `<div class="crono-wrap"><div class="crono c${seg}" style="--d:${(inicio - decorrido(st)).toFixed(2)}s"></div><b class="big">${rot}</b></div>`;   // R18: "inicio" atrasa o relógio (a dupla começa depois da síntese)

// Revelações em sequência: cada painel aparece no seu tempo; o último fica.
// R40: tema de cada painel (só para a cor da placa no CSS)
const temaDe = (n) => ({ "A vila": "vila", "O aluguel": "aluguel", "Mercado": "mercado", "O dinheiro": "dinheiro", "A desigualdade": "desigualdade" }[n] || "carta");
function sequencia(st, paineis) {
  // R13: quem conduz pode segurar um painel (ou ir e voltar); aí ele fica parado na tela
  if (st.painel != null) {
    const k = Math.min(st.painel, paineis.length - 1);
    const ck = st.fase === "resultado" ? conceitoPainel(st, paineis[k].nome) : null;   // Ética: o conceito do painel atual
    return `<div class="seq fixo"><div class="painel" data-tema="${temaDe(paineis[k].nome)}">${paineis[k].html}</div></div><div class="seq-dots fixo">${paineis.map((p, i) => `<span class="${i === k ? "agora" : i < k ? "feito" : ""}">${esc(p.nome)}</span>`).join("")}${ck ? `<span class="conc-dot">${esc(etiqueta(ck))}</span>` : ""}</div>`;
  }
  const t = decorrido(st);
  let acc = 0;
  const tempos = paineis.map((p) => { const a = acc - t; acc += p.dur; return [a, acc - t]; });
  const ult = (k) => (k === paineis.length - 1 ? "ultimo" : "");
  return `<div class="seq">${paineis.map((p, k) => `<div class="painel ${ult(k)}" data-tema="${temaDe(p.nome)}" style="--a:${tempos[k][0].toFixed(2)}s;--b:${tempos[k][1].toFixed(2)}s">${p.html}</div>`).join("")}</div>
    <div class="seq-dots">${paineis.map((p, k) => { const ck = st.fase === "resultado" ? conceitoPainel(st, p.nome) : null; return `<span class="${ult(k)}" style="--a:${tempos[k][0].toFixed(2)}s;--b:${tempos[k][1].toFixed(2)}s">${esc(p.nome)}${ck ? `<em class="conc-dot">${esc(etiqueta(ck))}</em>` : ""}</span>`; }).join("")}</div>`;
}

const fato = (icone, texto, cls = "") => `<div class="fato ${cls}">${ico(icone)}<span>${texto}</span></div>`;

// R14: no ano 5, a proposta grande vem antes das decisões; o telão das decisões abre com o que aconteceu, para a turma reagir.
function bannerGrande(st) {
  if (!st.cartas || st.alvara.aceitariam == null) return "";
  const c = carta(st.cartas.grande), vs = Object.values(st.alvara.votos), ok = agregadoOk(vs.length);
  const e = st.alvara.estrago, falta = Math.max(0, COLAPSO * st.teto - st.mata);
  const efeito = !st.alvara.aceito ? "" : e?.alvo === "mata" ? (falta > 0 ? ` A mata ficou abaixo de 30%: ${Math.max(1, Math.round((100 * falta) / st.teto)) === 1 ? "falta 1 ponto" : `faltam ${Math.round((100 * falta) / st.teto)} pontos`} (cerca de ${n0(Math.ceil((falta / 2) * 5))} de replantio) para ela voltar.` : " Já conta neste ano: dá para replantar.") : e?.niveis ? " Já conta na renda deste ano." : " A renda deste ano não muda.";   // R28: a carta já diz o que se perdeu
  return `<div class="card banner ${st.alvara.aceito ? "mal" : "bom"}">${fato(c.icone, `${esc(textoCarta(c, st.alvara.aceito ? "aceito" : "recusado", { ...st.alvara.antes, teto: st.teto, perdido: st.alvara.estrago?.pontos }))}${efeito}${ok ? ` <span class="sub">${pct(vs.filter(Boolean).length, vs.length)}% aceitariam.</span>` : ""}`, st.alvara.aceito ? "mal" : "bom")}</div>`;
}

// Carta sorteada da etapa (pequena, ano 4 ou grande): o telão mostra a carta e como a resposta conta.
function telaoCarta(st, c, rodape) {
  return topo(st, esc(c.titulo)) + `<div class="card destaque">${ico(c.icone, "xl")}<p class="enorme">${esc(textoCarta(c, "telao", st.fase === "pequena" ? { rel: true } : { mata: st.mata, teto: st.teto, publico: st.publico, juntado: st.acumulado }))}</p></div>
    <div class="card como"><p class="big" style="margin:0">${rodape}</p></div>
    <p class="rodape">${st.fase === "mente" ? "A situação é do jogo, não de um colega." : "A proposta é do jogo, não de um colega."} Cada um responde no celular, sem mostrar a tela; o telão só mostra o total, com 5 ou mais respostas.</p>`;
}

// R16: na confiança, o telão mostra as 4 situações; cada pessoa recebe uma no celular, e a regra é a mesma em todas
function telaoConfianca(st) {
  return topo(st, "Uma questão de confiança") + `<div class="grid" style="grid-template-columns:repeat(4,1fr);gap:1.2cqw">${CONFIANCA.map((id) => { const c = carta(id); return `<div class="card row" style="flex-wrap:nowrap;gap:.8cqw;padding:1cqw 1.2cqw">${ico(c.icone)}<b class="big" style="margin:0">${esc(c.titulo)}</b></div>`; }).join("")}</div>
    <div class="card destaque"><p class="enorme" style="font-size:3cqw">Cada pessoa recebe no celular <b>uma</b> destas situações. Em todas, você arrisca 2 antes de saber se a outra parte é honesta: honesta, +2; golpe, −2. <b>Não arriscar não custa nada.</b></p></div>
    <div class="card como"><p class="big" style="margin:0;font-size:2.05cqw">Depois, no celular: onde vai haver mais golpe? No fim do ano: os golpes da turma (com 5 ou mais confiando) e, se cada situação tiver 5 ou mais, os de cada uma.</p></div>`;
}

// R19: antes do voto, as duas metas com os números de hoje (não só a da regra vigente)
// R20: no voto, as duas metas lado a lado, sem o número de "hoje" (no fim do ano 3, a de equidade quase sempre parece batida
// e a de eficiência quase nunca, e as duas mudam muito nos anos 4 e 5). O voto é sobre a vila que a turma quer.
function duasMetas() {
  return `<div class="card" style="width:100%;padding:1cqw 1.4cqw"><p class="rodape" style="margin:0"><b>As duas metas</b> estão no exemplo. As duas mudam muito nos anos 4 e 5, com aluguel, mercado, mata e propostas.</p></div>`;
}

export function renderTelao(st) {
  let body = "";
  switch (st.fase) {
    case "entrada":
      body = topo(st, "Mosaico Vila Ética") + `<div class="grid" style="grid-template-columns:1.1fr 1fr;flex:1;min-height:0"><div class="card col" style="justify-content:center"><div class="row" style="gap:1.6cqw">${ico("app-mosaico-vila", "xl")}<div><div class="fase">Código da sala</div><div class="mono" style="font-size:7cqw;font-weight:800;letter-spacing:.1em">SIM-01</div></div></div><p class="big">Entre pelo celular. A turma vira uma vila; os grupos, famílias.</p><p class="rodape">O jogo fala de dinheiro, aluguel, herança e propostas de corrupção, sempre de famílias e personagens inventados. Se algum tema pesar, dá para só observar ou falar com quem conduz.</p></div>
        <div class="card" style="overflow:hidden"><h2>${st.ordem.length} na sala</h2><div class="row" style="margin-top:1cqw;gap:.5cqw">${st.ordem.map((id) => `<span class="chip nome">${esc(st.alunos[id].nome)}</span>`).join("")}</div></div></div>`;
      break;
    case "familias": {
      const fs = fams(st).slice().sort((x, y) => x.nome.localeCompare(y.nome, "pt-BR")), cols = Math.min(fs.length, 4);   // R20: em ordem alfabética (a herança não fica sempre no primeiro cartão)
      body = topo(st, "Encontre a sua família") + `<div class="grid" style="grid-template-columns:repeat(${cols},1fr);flex:1;min-height:0;align-content:start">${fs.map((f) => `<div class="card fam"><div class="row" style="flex-wrap:nowrap">${iconeFamilia(f, 44)}<b>${esc(f.nome.replace("Família ", ""))}</b><span class="mono conta-fam">${f.membros.filter((m) => st.alunos[m].achou).length}/${f.membros.length}</span></div><p class="nomes">${f.membros.map((m) => esc(st.alunos[m].nome)).join(", ")}</p></div>`).join("")}</div>
        <p class="rodape">As famílias não começam iguais: uma tem herança e outra começa sem lote. Quem ficou onde foi sorteio, não mérito (o véu da ignorância de Rawls ao contrário). Cada família vê a própria situação no celular.</p>${faixaConceitos(CONCEITOS_DO_MOMENTO.familias)}`;
      break;
    }
    case "abertura": {
      const nov = NOVIDADE_DO_ANO[st.ano], ex = EXEMPLO_DO_ANO[st.ano];
      const rs = Object.values(st.renda || {});
      const aluguel = rs.reduce((a, r) => a + r.aluguel, 0), piso = rs.filter((r) => r.piso > 0).length;
      const v4 = st.ano === 4 ? resultadoVoto(st) : null;
      body = topo(st, `Ano ${st.ano}: ${esc(nov.titulo)}`, (CONCEITOS_DO_MOMENTO[`abertura${st.ano}`] || []).slice(0, 2)) + (v4 ? v4.html : "") + `<div class="card destaque">${ico(ICONE_ANO[st.ano], v4 ? "g" : "xl")}<p class="${v4 ? "big" : "enorme"}" style="margin:0">${esc(nov.telao || nov.texto)}</p></div>` +
        (ex ? `<div class="card" style="flex:1;min-height:0"><h3 class="row">${ico("ideia")}Exemplo resolvido</h3>${exemploLinhas(st, linhasDe(ex, st), 1.5, v4 || linhasDe(ex, st).length >= 4 ? "compacto" : "")}</div><p class="rodape">${v4?.palpite || ""}${v4 ? "Voltem às famílias. No celular: pergunta rápida." : "No celular: uma pergunta rápida para conferir (não vale ponto)."}</p>`
          : `<div class="card"><p class="big" style="margin:0">${aluguel ? `${n0(aluguel)} pontos de aluguel vão mudar de mãos. ` : ""}${piso ? (piso === 1 ? "1 família recebeu o piso de renda." : `${piso} famílias receberam o piso de renda.`) : "Nenhuma família precisou do piso de renda."}</p></div><p class="rodape">Cada família vê o próprio extrato no celular.</p>`);   // Ética: os conceitos do ano vão na linha do título
      break;
    }
    case "decidir":
      body = topo(st, "Cada família decide") + (st.ano === 5 ? bannerGrande(st) : "") + `<div class="lado ${st.ano === 5 && st.cartas ? "compacto" : ""}"><div class="card mapa-card">${mapaVila(st, { menor: st.ano === 5 && !!st.cartas })}</div>
        <div class="col centro">${cronometro(st, vizSozinhos(st) ? "Pensem na proposta" : "Conversem na família", st.curto && st.ano >= 4 ? 30 : 45)}<p class="big" style="text-align:center;margin:0">${vizSozinhos(st) ? "Cada pessoa decide pela sua família;<br>os parentes automáticos seguem." : "Cada um envia a sua proposta.<br>Vale a mediana da família."}</p>${st.ano >= 4 && st.leilao?.ano === st.ano && st.leilao.vendidos.length ? `<p class="rodape" style="text-align:center;margin:0">A meta já desconta os lances do mercado.</p>` : ""}</div></div>`;   // R22
      break;
    case "pequena":
      { const c = carta(st.cartas.pequena), ef = textoCarta({ ...c, x: "{efeito}" }, "x", { rel: true });
        // R28: o texto da proposta fica só no celular (metade da turma lê "presente em troca de", metade às claras); o telão não entrega a fala
        body = topo(st, esc(c.titulo)) + `<div class="card destaque">${ico(c.icone, "xl")}<p class="enorme">A proposta chegou no celular de cada um. Leia em silêncio e responda sem mostrar a tela.</p></div>
          <div class="card como"><p class="big" style="margin:0">Proposta pequena: <b>cada um decide por si</b> e cada resposta vale para quem respondeu. Se a turma inteira aceitar, ${esc(ef)}: o estrago de uma proposta grande.</p></div>
          <p class="rodape">A proposta é do jogo, não de um colega. O telão só mostra totais de 5 ou mais respostas; com menos de 5, a proposta não vale.</p>`; }
      break;
    case "mente": {
      const c = carta(st.cartas.ano4);
      if (c.grupo === "confianca") { body = telaoConfianca(st); break; }   // R16: cada um recebe uma das 4 situações
      body = telaoCarta(st, c, c.tipo === "dado" ? "Ninguém, nem o sistema, sabe o número que você pensou. Os 3 pontos são pessoais."
        : c.tipo === "honesto" ? "Ninguém vai conferir. Os 3 pontos são pessoais e não aparecem no telão."
        : `Você decide <b>antes</b> de saber se a outra pessoa é honesta. Cada um encontra uma pessoa diferente. Depois, no celular: em qual situação vai haver mais golpe?`);
      break;
    }
    case "lances": {
      const livres = st.lotes.filter((x) => !x).length;
      // R30: as regras do mercado numa lista curta, uma por linha (antes, um parágrafo com cinco regras); lotes e lance mínimo num cartão só
      const regras = ["Lance secreto; vale a <b>mediana da família</b> (sem lance, 0).", "O maior lance leva.",
        ...(st.regra === "prosperidade" ? ["Na Prosperidade, o que passa do mínimo conta pela metade."] : []), "Cada família, até a moradia + 1 lote."];
      body = topo(st, "Mercado de lotes") + `<div class="lado compacto"><div class="card mapa-card">${mapaVila(st, { menor: true })}</div><div class="col">
        <div class="card row" style="flex-wrap:nowrap;gap:1.2cqw">${ico("mercado-lotes", "g")}<div class="big">${st.ano === 5 ? "Voltem às famílias: " : ""}<b class="mono">${Math.min(3, livres)}</b> lotes à venda · lance mínimo <b class="mono">${lanceMinimo(st.ano)}</b></div></div>
        ${st.ano === 5 && st.alvara?.aceito && estragoReal(st.alvara.estrago) ? `<div class="card banner mal"><p class="big" style="margin:0">Proposta grande aceita: a barra já conta o estrago.</p></div>` : ""}
        <div class="card"><ol class="regras-lote">${regras.map((t) => `<li>${t}</li>`).join("")}</ol></div>
        </div></div>`;   // R29: no ano 5 com a grande aceita, o telão avisa que a barra já conta o estrago
      break;
    }
    case "alvara":
      { const c = carta(st.cartas.grande), ef = textoCarta({ ...c, x: "{efeito}" }, "x", { mata: st.mata, teto: st.teto, publico: st.publico, juntado: st.acumulado });
        // R34: como na pequena, o texto da grande fica só no celular (cada um lê na fala sorteada no ano 2); o telão mostra o estrago com os números da partida
        body = topo(st, esc(c.titulo)) + `<div class="card destaque">${ico(c.icone, "xl")}<p class="enorme">A proposta chegou no celular de cada um. Leia em silêncio e responda no seu lugar, longe da família.</p></div>
          <div class="card como"><p class="big" style="margin:0">Proposta grande: vale a resposta de <b>uma pessoa sorteada</b>, que nunca aparece (sem resposta, vale não). Se for aceita, ${esc(ef)}.</p></div>
          <p class="rodape">A proposta é do jogo, não de um colega. O telão só mostra totais de 5 ou mais respostas.</p>`; }
      break;
    case "resultado": body = telaoResultado(st); break;
    case "conversa":
      // R16: 90 s de conversa com uma pergunta-guia antes de o voto abrir
      // R17: o exemplo resolvido das duas regras vem logo no começo da conversa (antes, só aparecia no voto)
      body = topo(st, "Antes do voto: conversem") + `<div class="lado"><div class="col" style="min-height:0;gap:1cqw">
        <div class="card"><p class="enorme" style="margin:0;font-size:2.3cqw">Qual meta vocês querem: patrimônio médio alto ou ninguém muito atrás? Qual regra ajuda mais nisso, e quem ganha e quem paga em cada uma?</p></div>
        <div class="card" style="flex:1;min-height:0;overflow:hidden"><h3 class="row">${ico("ideia")}Exemplo resolvido: as duas regras</h3>${exemploLinhas(st, EXEMPLO_VOTO.linhas, 1.5, "compacto")}</div></div>
        <div class="col centro">${cronometro(st, vizSozinhos(st) ? "Conversem entre vocês" : "Conversem na família", st.curto ? 60 : 90)}${duasMetas()}</div></div>${faixaConceitos(CONCEITOS_DO_MOMENTO.conversa)}`;   // Ética
      break;
    case "lazer": body = telaoLazer(st); break;   // Ética: o Momento do Lazer
    case "voto":
      body = topo(st, "Que regra queremos para os anos 4 e 5?") + `<div class="grid" style="grid-template-columns:1fr 1fr">
        <div class="card"><h2 class="row">${ico("balanca", "g")}Manter: ${REGRAS_TXT.monopolio.nome}</h2><p class="big" style="margin:.4cqw 0 0">${esc(REGRAS_TXT.monopolio.telao)}</p></div>
        <div class="card"><h2 class="row">${ico("balanca", "g")}Trocar: ${REGRAS_TXT.prosperidade.nome}</h2><p class="big" style="margin:.4cqw 0 0">${esc(REGRAS_TXT.prosperidade.telao)}</p></div></div>
        <div class="card destaque"><p class="enorme" style="margin:0;font-size:3cqw">Votem agora no celular, cada um no próprio lugar. As duas metas mudam muito nos anos 4 e 5: votem na vila que vocês querem.</p></div>
        <p class="rodape">Voto secreto. Vence a maioria; empate mantém o Monopólio.</p>`;   // R19: o exemplo fica na conversa (antes, cortava aqui)
      break;
    case "fechamento": body = telaoFechamento(st); break;
    default: body = topo(st, "Mosaico Vila Ética");
  }
  return `<div class="tin">${body}</div>`;
}

// Quanto tempo as animações do telão pedem em cada fase (o simulador espera isso antes de avançar sozinho).
export function duracaoTelao(st) {
  if (st.fase === "abertura") { const ex = EXEMPLO_DO_ANO[st.ano]; if (!ex) return 8; const ls = linhasDe(ex, st); return 1.5 + passoExemplo(ls) * ls.length + 2; }
  if (st.fase === "voto") return 6;
  if (st.fase === "lazer") return SEG_LAZER;   // Ética: o Momento do Lazer
  if (st.fase === "conversa") return Math.max(st.curto ? 60 : 90, 1.5 + passoExemplo(EXEMPLO_VOTO.linhas) * EXEMPLO_VOTO.linhas.length + 2);
  if (st.fase === "resultado") return tempoResultado(st).total;
  return 0;
}

// Tempo de "Como ficou a vila": 30 s (75 s no ano 3), mais o painel da carta do ano (15 s no ano 2, 20 s no ano 4, 40 s no ano 5).
// O celular mostra o extrato da família quando começa o último painel (R13: primeiro a vila, depois a própria família).
const EXTRA_CARTA = { 2: 25, 4: 20, 5: 20 };   // R29: a pequena tem as duas falas e o carimbo: 25 s   // R14: no ano 5, a grande já foi revelada antes das decisões (20 s), e o painel do fim do ano recapitula
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
const moedas = (valor, cls = "") => fileira("moeda.webp", Math.max(0, valor), MOEDA, cls);

// O dinheiro: patrimônio por pessoa de cada família, em moedas, com a marca da meta.
function dinheiroPorPessoa(st, ranking) {
  const m = progressoMeta(st.fams, st.publico, st.mata, st.teto, st.regra);
  const mediaPP = ranking.reduce((a, f) => a + f.pp, 0) / ranking.length;
  const alvoPP = m.regra === "prosperidade" ? m.alvo * mediaPP : m.alvo;
  const maxPP = Math.max(alvoPP, ...ranking.map((f) => f.pp));
  const cab = Math.max(1, Math.ceil(maxPP / MOEDA));   // largura da fileira, em moedas
  const marca = `<i class="marca-meta" style="left:calc(var(--iso) * ${(alvoPP / MOEDA).toFixed(2)} + ${(0.12 * (alvoPP / MOEDA)).toFixed(2)}cqw)"><b>${m.regra === "prosperidade" ? `${Math.round(100 * m.alvo)}% da média` : `meta ${m.alvo}`}</b></i>`;
  const iso = ranking.length <= 5 ? 3.6 : ranking.length <= 6 ? 3.1 : 2.6;   // até 8 famílias cabem na tela
  const antesDoVoto = st.ano === 3;   // R21: logo antes do voto, nenhuma das duas metas em número (o número de hoje inclinava o voto); R23: nem o patrimônio de cada família (dava para fazer a conta)
  const linhas = ranking.map((f) => `<div class="iso-linha"><span class="fila-moedas" style="--n:${cab};--iso:${iso}cqw">${moedas(f.pp)}${antesDoVoto ? "" : marca}</span>${antesDoVoto ? "" : `<b class="mono">${n0(f.pp)}</b>`}</div>`).join("");
  const metaTxt = antesDoVoto ? "Logo depois, a turma conversa e vota a regra dos anos 4 e 5. As duas metas aparecem lado a lado no voto." : m.regra === "prosperidade" ? `A família mais pobre tem <b>${pctL(m.valor)}</b> da média por pessoa (meta: ${Math.round(100 * m.alvo)}%).` : `Patrimônio médio: <b>${nL(m.valor, m.alvo)}</b> por pessoa (meta: ${m.alvo}).`;
  return `<div class="grid" style="grid-template-columns:1.55fr 1fr;flex:1;min-height:0">
    <div class="card${antesDoVoto ? " sem-marca" : ""}" style="min-height:0;overflow:hidden"><h2>Patrimônio por pessoa, por família</h2><p class="rodape" style="margin-bottom:.6cqw">${moedas(MOEDA, "p")} Cada moeda = ${MOEDA} pontos. ${antesDoVoto ? "Sem nomes; números só depois do voto." : "Sem nome de família."}</p>${linhas}</div>
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
  return { html: `<div class="card">${fato("balanca", st.votoTrocou ? `Voto: <b>${Math.round(100 * p)}%</b> quiseram trocar: a <b>${REGRAS_TXT.prosperidade.nome}</b> vale nos anos 4 e 5.` : `Voto: <b>${Math.round(100 * p)}%</b> quiseram trocar. Não passou: fica o <b>${REGRAS_TXT.monopolio.nome}</b>.`)}</div>`, palpite };
}

// Acerto do palpite de quantos aceitam (pequena e grande)
// R38: no modo vizinhos, até 8 pessoas: cada uma chefia uma família com parentes automáticos
const vizSozinhos = (st) => !!(st.vizinhos && Object.values(st.fams).some((f) => f.membros.some((m) => st.alunos[m]?.parente)));
function acertoPalpite(st, onde, p) {
  const pal = st.palpitePct[onde] || {}, np = Object.keys(pal).length;
  return agregadoOk(np) ? `<p class="rodape">Palpite da turma: ${pct(Object.values(pal).filter((v) => v === faixaDe(p)).length, np)}% acertaram a faixa (${esc(FAIXAS_PCT[faixaDe(p)].toLowerCase())}).</p>` : "";
}
// R22: a mata em pontos da mata cheia (como no painel A vila e nas cartas); o bem público em níveis ou pontos de contribuição
const textoEstrago = (e) => (!e ? "" : e.alvo === "mata" ? `a mata perdeu <b>${Math.round(e.pct)} ${Math.round(e.pct) === 1 ? "ponto" : "pontos"}</b>` : e.niveis ? `o bem público caiu <b>${e.niveis} ${e.niveis === 1 ? "nível" : "níveis"}</b>` : (e.pontos >= 0.5 ? `o bem público perdeu <b>${n0(e.pontos)} pontos de contribuição</b> do próximo nível` : "o bem público não tinha pontos a perder"));

// Painéis de "Como ficou a vila", com a duração de cada um (somam o tempo total da tela).
export function paineisResultado(st) {
  const fx = st.fechamento, H = st.historico;
  const giniPat = gini(fams(st).map((f) => patrimonio(f, st.publico) / f.membros.length));   // R14: por pessoa
  const giniRenda = st.renda ? gini(fams(st).map((f) => (st.renda[f.id]?.total ?? 0) / f.membros.length)) : 0;
  const pp = (x) => Math.round((100 * x) / st.teto);
  // R25: a mata como a barra e o mapa mostram (uma casa decimal perto de 30%, 50% e 70%), e a variação como a diferença desses números
  const ppL = (x) => pctNum(x / st.teto);
  const n1 = (x) => (Math.round(x * 10) / 10).toLocaleString("pt-BR"), pts = (x) => `${n1(Math.abs(x))} ${Math.abs(x) === 1 ? "ponto" : "pontos"}`;

  // 1. A vila: mapa grande e o que mudou na mata e no bem público
  const fatos = [];
  if (fx && st.ano >= 2) {
    // R18: a variação é a diferença dos números que a barra mostra, e a natureza é o resto: as etiquetas sempre fecham
    const corr = fx.estrago?.alvo === "mata" ? fx.estrago.mata : 0, dmR = Math.round((ppL(st.mata) - ppL(fx.mataAntes)) * 10) / 10, natR = Math.round((dmR + pp(fx.extr) - pp(fx.plant) + pp(corr)) * 10) / 10;
    // R21: a variação em pontos da mata cheia (de 41% para 20% são 21 pontos, não 21%)
    fatos.push(fato("arvore-redonda", dmR ? `A mata ${dmR > 0 ? "subiu" : "desceu"} <b>${pts(dmR)}</b>: de ${pctL(fx.mataAntes / st.teto)} para ${pctL(st.mata / st.teto)}` : "A mata ficou como estava"));
    // R26: com a pequena respondida por menos de 5, o estrago dela não aparece sozinho (entregaria quantos aceitaram); com a mata cheia, o que passa de 100% não conta
    // R34: com menos de 5 respostas, a etiqueta é "natureza e proposta" sempre que a pequena foi na mata, aceitando alguém ou não (antes, mudava só quando alguém aceitava, e isso entregava a resposta)
    // R35: com menos de 5 respostas, a pequena não vale (não tira nada), e não há o que esconder
    const escondeProp = false, cheia = st.mata >= st.teto - 1e-6;
    const natV = escondeProp ? Math.round((natR - pp(corr)) * 10) / 10 : natR;
    const chipNat = cheia && natV < 0 ? `<span class="chip">${ico("arvore-dourada")}mata cheia: o que passou de 100% não conta</span>` : `<span class="chip">${ico("arvore-dourada")}${escondeProp ? "natureza e proposta" : "natureza"} ${natV >= 0 ? "+" : "−"}${n1(Math.abs(natV))}</span>`;
    fatos.push(`<div class="chips-iso"><span class="chip">${ico("toco")}cargas −${pp(fx.extr)}</span><span class="chip">${ico("arvore-cubos")}replantio +${pp(fx.plant)}</span>${corr && !escondeProp ? `<span class="chip mal">${ico("alvara")}proposta −${pp(corr)}</span>` : ""}${chipNat}</div>`);
  }
  if (fx) fatos.push(st.publico > fx.nivelAntes ? fato("economia", `Bem público subiu para o nível <b>${st.publico}</b>: ${esc(NIVEIS_PUBLICO[st.publico])}`) : st.publico < fx.nivelAntes ? fato("economia", `Bem público caiu para o nível <b>${st.publico}</b>`, "mal") : fato("economia", `Bem público ficou no nível ${st.publico}`));
  // R21: quando uma proposta mexeu no bem público neste ano, as duas forças lado a lado (como na mata)
  const ePub = fx?.estrago?.alvo === "publico" ? fx.estrago : null;
  if (ePub && (ePub.niveis || ePub.pontos) && !(st.ano === 2 && !agregadoOk(st.pequena?.n || 0))) {
    // R26: as duas etiquetas na mesma unidade (níveis quando a proposta tirou nível; pontos quando tirou só o que estava juntando), com plural
    const nv = (x) => `${x >= 0 ? "+" : "−"}${Math.abs(x)} ${Math.abs(x) === 1 ? "nível" : "níveis"}`;
    const contribPts = Object.values(fx.extrato || {}).reduce((a, x) => a + (x.aPub || 0), 0) + Object.values(st.renda || {}).reduce((a, r) => a + (r.imposto || 0), 0);
    const contrib = st.publico - fx.nivelAntes + (ePub.niveis || 0);
    fatos.push(`<div class="chips-iso">${ePub.niveis ? `<span class="chip">${ico("economia")}contribuições ${nv(contrib)}</span><span class="chip mal">${ico("alvara")}proposta ${nv(-ePub.niveis)}</span>` : `<span class="chip">${ico("economia")}contribuições +${Math.round(contribPts)} pontos</span><span class="chip mal">${ico("alvara")}proposta −${Math.round(ePub.pontos)} pontos</span>`}</div>`);
  }
  if (st.colapsou) {
    const falta = Math.max(0, COLAPSO * st.teto - st.mata);
    fatos.push(st.ano < 5 ? fato("toco", `Mata abaixo de 30%: −4 por pessoa até voltar. ${Math.max(1, pp(falta)) === 1 ? "Falta <b>1 ponto</b>" : `Faltam <b>${pp(falta)} pontos</b>`} de mata (cerca de ${n0(Math.ceil((falta / 2) * 5))} pontos do caixa em replantio).`, "mal")
      : fato("toco", "A mata terminou abaixo de 30%: a meta pede mais que isso.", "mal"));
  } else if (st.colapsouAlguma) fatos.push(fato("arvore-redonda", "A mata voltou a passar dos 30%: o −4 acabou", "bom"));
  const prev = st.previsao[st.ano] || {}, np = Object.keys(prev).length;
  if (st.ano >= 2 && agregadoOk(np) && fx) { const ref = fx.mataPrev ?? fx.mataAntes, real = st.mata > ref + 0.5 ? "sobe" : st.mata < ref - 0.5 ? "desce" : "fica"; /* R26: no ano 5, contra a mata que a turma via ao prever (já depois da proposta grande) */ const desde = st.ano === 5 && fx.mataPrev != null && Math.abs(fx.mataPrev - fx.mataAntes) > 0.5 ? ` (a partir de ${pctL(ref / st.teto)}, a mata da hora do palpite)` : "";   // R32
    fatos.push(`<p class="rodape">Previsão da mata: ${pct(Object.values(prev).filter((v) => v === real).length, np)}% acertaram${desde}.</p>`); }
  const cheio = fatos.length >= 5;   // R24: com colapso, previsão e proposta no bem público, o mapa menor dá largura ao texto (antes, a última linha era cortada)
  const paineis = [{ nome: "A vila", dur: 10, html: `<div class="lado${cheio ? " compacto" : ""}"><div class="card mapa-card">${mapaVila(st, { menor: cheio })}</div><div class="col" style="justify-content:center${cheio ? ";gap:.8cqw" : ""}">${fatos.join("")}</div></div>` }];

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
    acont.push(fato("lote-alfinete", nv ? `${nv === 1 ? "1 lote vendido" : `${nv} lotes vendidos`}. O maior lance foi <b>${n0(Math.max(...st.leilao.vendidos.map((v) => v.preco)))}</b>, por um lote que vale <b>${vl}</b> no patrimônio (10 + 2 × nível ${st.publico}).` : (st.leilao.semLote?.length || st.leilao.noTeto?.length ? "Nenhum lote vendido: as famílias ficaram de fora, por escolha ou porque já tinham a moradia + 1 lote, ou não tinham caixa para o mínimo." : "Nenhum lote vendido: ninguém tinha caixa para o mínimo.")));
    if (nv) acont.push(`<p class="rodape">O lance sai do caixa e vai para o banco, e o lote entra no patrimônio pelo valor dele: a família ganha ou perde a diferença.</p>`);
    // R16: quem ficou de fora por escolha ou porque já tinha a moradia + 1 lote (só o número, sem nomes)
    const nS = st.leilao.semLote?.length || 0, nT = st.leilao.noTeto?.length || 0;
    const fora = [nS ? (nS === 1 ? `1 família marcou "não queremos lote"` : `${nS} famílias marcaram "não queremos lote"`) : "", nT ? (nT === 1 ? "1 família já tinha a moradia + 1 lote" : `${nT} famílias já tinham a moradia + 1 lote`) : ""].filter(Boolean);
    if (fora.length) acont.push(`<p class="rodape">${fora.join("; ")}.</p>`);
    const pal = st.palpite?.[st.ano] || {}, npl = Object.keys(pal).length;
    if (st.leilao.vendidos.length && agregadoOk(npl)) {
      const maior = Math.round(Math.max(...st.leilao.vendidos.map((v) => v.preco))), certo = maior <= 20 ? "até 20" : maior <= 40 ? "21 a 40" : "mais de 40";   // R27: pelo número que o telão mostra
      acont.push(`<p class="rodape">Palpite do lance vencedor: ${pct(Object.values(pal).filter((v) => v === certo).length, npl)}% acertaram (${certo}).</p>`);
    }
  }
  if (acont.length) paineis.push({ nome: "Mercado", dur: 6, html: `<div class="card col" style="flex:1;justify-content:center;gap:1.4cqw">${acont.join("")}</div>` });

  // 4. A carta do ano: pequena (ano 2), honestidade ou confiança (ano 4), grande (ano 5, em dois painéis)
  const extra = st.ano === 4 && st.semTroco ? 0 : EXTRA_CARTA[st.ano] || 0;
  if (st.ano === 2 && st.cartas && st.pequena.aceitaram != null) {
    // R16: a porcentagem é de quem respondeu (a mesma base da grande); o estrago conta a turma inteira (quem não respondeu recusou)
    const c = carta(st.cartas.pequena), n = st.ordem.length, p = st.pequena.n ? st.pequena.aceitaram / st.pequena.n : 0, fe = n ? st.pequena.aceitaram / n : 0, ok = agregadoOk(st.pequena.n);
    // R26: o "se todos aceitassem" no mesmo texto da carta (em pontos da mata cheia), sem uma mata que nenhuma tela mostrou; com menos de 5 respostas, nada que entregue a contagem
    // R36/R37: o % de cima é de quem respondeu; o estrago conta a turma inteira. A base vai num rodapé, não no texto corrido (no texto, estourava o painel)
    const semResp = ok && st.pequena.aceitaram && st.pequena.n < n ? `<p class="rodape" style="margin:0">O estrago conta como recusa quem não respondeu.</p>` : "";
    const e = st.pequena.estrago, semPerda = e?.alvo === "publico" && !e.niveis && (e.pontos || 0) < 0.5, todos = st.pequena.aceitaram >= n;
    const estrago = !ok ? "Com menos de 5 respostas, a proposta não valeu para ninguém: nem os pontos, nem o estrago."   // R35
      : !st.pequena.aceitaram ? "Ninguém aceitou: nada se perdeu."
      : e?.alvo === "publico" && e.niveis ? `Somando os pequenos, o bem público perdeu <b>${n0(e.pontos)} pontos</b> (${Math.round(100 * fe)}% do estrago de uma grande) e, sem pontos de sobra, caiu ${e.niveis === 1 ? "1 nível" : `${e.niveis} níveis`}.`   // R29
      : `Somando os pequenos, ${textoEstrago(e)}${e?.alvo === "publico" && !e.niveis && st.publico === 0 ? "." : `: ${Math.round(100 * fe)}% do estrago de uma grande.`}`;
    // R27/R28: sem o "se a turma inteira aceitasse" quando todos aceitaram ou quando não havia o que perder
    const seTodos = todos || semPerda ? "" : ` Com a turma inteira, ${textoCarta({ ...c, x: "{seria}" }, "x", { rel: true, publico: st.publico + (e?.niveis || 0) })}.`;   // R30: o "% do estrago de uma grande" já veio na frase de cima
    const longo = (estrago + seTodos).replace(/<[^>]+>/g, "").length > 190;   // R37: texto longo (bem público com nível) em letra um pouco menor
    paineis.push({ nome: c.titulo, carta: true, dur: extra, html: `<div class="grid" style="grid-template-columns:1fr 1fr;flex:1;min-height:0">
      <div class="card destaque col" style="justify-content:center;gap:.9cqw;min-height:0">
        <p class="enorme" style="margin:0;font-size:2.6cqw">${ok ? `<b>${Math.round(100 * p)}%</b> de quem respondeu aceitou.` : "Menos de 5 respostas: o total fica guardado."}</p>
        <p class="big" style="margin:0;font-size:${longo ? "1.95cqw" : "2.15cqw"}">${estrago}${seTodos}</p>${semResp}${ok ? acertoPalpite(st, "pequena", p) : ""}</div>
      ${painelFalas(st)}</div>` });
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
          <p class="big" style="margin:0">${agregadoOk(nv) ? `<b>${pct(sim, nv)}%</b> confiaram.` : ""} ${agregadoOk(confiaram.length) ? `Dos que confiaram, <b>${pct(confiaram.length - honestos, confiaram.length)}%</b> sofreram golpe (a chance era 25%).` : ""}</p>
          ${porTipo.every((t) => agregadoOk(t.n))
            ? `<div class="col" style="gap:.4cqw">${porTipo.map((t) => `<div class="barra-rot"><span>${esc(t.c.titulo)}</span><div class="barra"><i style="width:${pct(t.g, t.n)}%;background:#f87171"></i></div><b class="mono">${pct(t.g, t.n)}%</b></div>`).join("")}<p class="rodape" style="margin:0">Golpes sofridos por quem confiou, em cada situação.</p></div>`
            : agregadoOk(confiaram.length) ? `<p class="rodape" style="margin:0">Por situação, alguma teve menos de 5 pessoas confiando: com tão poucos casos, comparar seria só acaso, e vale o total da turma.</p>` : ""}
          <p class="big" style="color:#86efac;margin:0;font-weight:800">A chance de golpe era a mesma em todas as situações: 1 em ${Math.round(1 / CHANCE_GOLPE)}.</p></div>
        <div class="card col" style="justify-content:center;gap:.6cqw"><b class="big">Onde a turma achou que haveria mais golpe</b>${agregadoOk(q.length) ? QUEM_GOLPE.map((t, k) => `<div class="barra-rot"><span>${esc(t)}</span><div class="barra"><i style="width:${pct(qc[k] || 0, q.length)}%"></i></div><b class="mono">${pct(qc[k] || 0, q.length)}%</b></div>`).join("") : `<p class="rodape">Menos de 5 respostas.</p>`}</div></div>`;
    } else {
      const acaso = c.tipo === "dado" ? " (por acaso, cerca de 17%)" : "";
      // R22: ao lado, a proposta pequena do ano 2 (as duas decisões de honestidade da turma, lado a lado)
      const pqOk = agregadoOk(st.pequena?.n || 0), pqP = pqOk ? pct(st.pequena.aceitaram, st.pequena.n) : null;
      html = `<div class="card destaque">${ico(c.icone, "xl")}<p class="enorme">${agregadoOk(nv) ? `${esc(c.titulo)}: <b>${pct(sim, nv)}%</b> ${c.tipo === "dado" ? 'disseram "acertei"' : "ficaram com os 3"}${acaso}.` : "Menos de 5 respostas: o total fica guardado."}</p></div>
        ${agregadoOk(nv) && pqOk ? `<div class="card col fech-barras" style="gap:1cqw"><div><div class="row" style="justify-content:space-between;flex-wrap:nowrap"><span>Ano 2, proposta pequena: aceitaram</span><b class="mono">${pqP}%</b></div><div class="barra grande"><i style="width:${pqP}%"></i></div></div><div><div class="row" style="justify-content:space-between;flex-wrap:nowrap"><span>Ano 4, ${esc(c.titulo.toLowerCase())}: ${c.tipo === "dado" ? 'disseram "acertei"' : "ficaram com os 3"}</span><b class="mono">${pct(sim, nv)}%</b></div><div class="barra grande"><i style="width:${pct(sim, nv)}%"></i></div></div><p class="rodape">${c.tipo === "dado" ? "No dado, cerca de 17% acertariam por acaso." : "Aqui, ninguém conferia."} Cada resposta foi secreta.</p></div>` : ""}`;
    }
    paineis.push({ nome: c.grupo === "confianca" ? "Confiança" : c.titulo, carta: true, dur: extra, html });
  }
  if (st.ano === 5 && st.cartas && st.alvara.aceitariam != null) {
    // R14: a grande foi revelada antes das decisões (bannerGrande); aqui, a recapitulação ao lado da pequena
    const c = carta(st.cartas.grande), vs = Object.values(st.alvara.votos), ok = agregadoOk(vs.length), p = vs.length ? vs.filter(Boolean).length / vs.length : 0;
    const pq = st.pequena.n ? st.pequena.aceitaram / st.pequena.n : null;   // R16: mesma base (quem respondeu)
    paineis.push({ nome: c.titulo, carta: true, dur: extra, html: `<div class="card col" style="flex:1;justify-content:center;gap:.9cqw">${carimbo("Corrupção", "", `grande-${st.seed}`)}
      ${fato(c.icone, esc(textoCarta(c, st.alvara.aceito ? "aceito" : "recusado", { ...st.alvara.antes, teto: st.teto, perdido: st.alvara.estrago?.pontos })), st.alvara.aceito ? "mal" : "bom")}
      ${ok && !(pq != null && agregadoOk(st.pequena.n)) ? fato("ideia", `<b>${Math.round(100 * p)}%</b> aceitariam os 8 pontos ${esc(c.de)}.`) : ""}
      ${pq != null && agregadoOk(st.pequena.n) && ok ? fato("balanca", `Na proposta pequena do ano 2, <b>${Math.round(100 * pq)}%</b> aceitaram; na grande, <b>${Math.round(100 * p)}%</b> aceitariam.`) : ""}
      ${linhaFalasGrande(st)}
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


// Ética: a faixa de conceitos técnicos do momento (termo · autor), com a lembrança do glossário no celular
function faixaConceitos(ids, extra = "") {
  const vs = ids.map(verbete).filter(Boolean);
  if (!vs.length) return "";
  return `<div class="conceitos"><span class="conc-rot">${ico("glossario")}Conceitos</span>${vs.map((v) => `<span class="chip conceito" style="--c:${CATEGORIAS[v.cat]?.cor || "#a78bfa"}"><b>${esc(v.termo)}</b>${v.autor && !/\d/.test(v.autor) ? ` · ${esc(v.autor)}` : ""}</span>`).join("")}<span class="conc-fim">${extra || "no glossário do celular"}</span></div>`;
}
// Ética: o conceito de cada painel do "Como ficou a vila"
function conceitoPainel(st, nome) {
  const c4 = st.cartas ? carta(st.cartas.ano4) : null;
  if (nome === "A vila") return st.ano >= 2 ? "tragedia" : "bem-comum";
  if (nome === "Mercado") return "justica-distributiva";
  if (nome === "O dinheiro") return st.ano >= 3 ? (st.regra === "prosperidade" ? "diferenca" : "justica-distributiva") : "juizo-fato";
  if (nome === "A desigualdade") return st.ano >= 3 ? "justica-distributiva" : "veu";
  if (st.cartas && nome === carta(st.cartas.pequena).titulo) return "universalizacao";
  if (st.cartas && nome === carta(st.cartas.grande).titulo) return "consequencialismo";
  if (c4 && (nome === c4.titulo || nome === "Uma questão de confiança")) return c4.grupo === "confianca" ? "confianca" : "veracidade";
  return null;
}
// Ética: o Momento do Lazer no telão (a atividade da partida, o relógio de 90 s, a regra do bônus e quantos já terminaram)
function telaoLazer(st) {
  const mem = st.lazer?.tipo === "memoria", res = Object.values(st.lazer?.res || {}), fim = res.filter((x) => x.fim).length, n = st.ordem.length;
  const chegaram = res.filter((x) => x.pontos >= ALVO_LAZER).length, bonus = Math.min(n, Math.round(res.reduce((t, x) => t + Math.min(1, x.pontos / ALVO_LAZER), 0)));
  return topo(st, "Momento do Lazer") + `<div class="lado"><div class="col" style="min-height:0;gap:1cqw">
    <div class="card destaque">${ico(mem ? "lazer-memoria" : "lazer-genius", "xl")}<p class="enorme" style="margin:0;font-size:2.6cqw">${mem ? "Jogo da memória: 12 pares de termo e pista, com os verbetes que a vila já abriu." : "Acerte a sequência: 8 cores fixas, uma por categoria do glossário; o termo dentro de cada uma muda a cada rodada."}</p></div>
    <div class="card"><p class="big" style="margin:0">Quem chega a <b>${ALVO_LAZER} ${mem ? "pares" : "rodadas"}</b> dá <b>1 ponto ao bem público</b> (menos, proporcional): o conhecimento como bem comum.</p></div>
    <p class="rodape" style="margin:0">Desde a Idade Média, o trabalho virou virtude e o ócio, vício: daí a dificuldade de aceitar o lazer. Aqui, ele também ensina.</p></div>
    <div class="col centro">${cronometro(st, "Cada um no seu celular", SEG_LAZER)}<p class="big" style="text-align:center;margin:0"><b class="mono">${fim}</b> de ${n} terminaram${agregadoOk(res.length) ? ` · <b class="mono">${chegaram}</b> já chegaram a ${ALVO_LAZER}` : ""}</p><p class="enorme" style="text-align:center;margin:0">${ico("economia")} +${bonus} para o bem público</p></div></div>${faixaConceitos(CONCEITOS_DO_MOMENTO.lazer, "e todos os verbetes já abertos")}`;
}
function telaoResultado(st) {
  return topo(st, `Como ficou a vila no ano ${st.ano}`) + sequencia(st, paineisResultado(st));
}

// Cinco perguntas encadeadas, uma por tema, montadas com os dados da própria turma; R14: cada uma puxa a anterior.
const TEMAS = ["Aluguel", "Voto", "Mata", "Honestidade", "Profissão"];
// Ética: os conceitos técnicos de cada pergunta do fechamento (e, na última, os do "o que te guiou")
const CONCEITOS_FECHAMENTO = [["justica-distributiva", "diferenca"], ["contrato", "constituinte"], ["tragedia", "consequencialismo"], ["universalizacao", "justo-meio"], ["deontologia", "codigo-confef", "alma"]];
const ARTIGO = { monopolio: "o Monopólio", prosperidade: "a Prosperidade" };
function perguntasFechamento(st) {
  const H = st.historico, g = (k) => H[k]?.gini ?? 0, gr = (k) => H[k]?.giniRenda ?? 0;
  const subiu = H.length >= 3 && (gr(2) > gr(1) + 0.01 || g(2) > g(1) + 0.005);
  const pouco = subiu && gr(2) - gr(1) < 0.05 && g(2) - g(1) < 0.02;   // R28: de 0,00 para 0,02 é "subiu pouco"
  const mataMin = Math.min(...H.map((x) => x.mata));
  const cargas = Math.round((100 * H.reduce((a, x) => a + (x.extr || 0), 0)) / (st.teto || 1)), prop = Math.round((100 * (st.estragoMata || 0)) / (st.teto || 1));
  const pub = Math.round(st.estragoPublico || 0);
  // R17: o saldo da mata em pontos da mata cheia (1 ponto = 1%): o que saiu, o que voltou e de quanto a quanto ela foi
  const vM = (100 * st.mata) / (st.teto || 1), rM = Math.round(vM);
  const ini = Math.round(100 * MATA_INICIO), fim = [30, 50, 70].some((L) => rM === L && Math.abs(vM - L) < 1 && Math.abs(vM - rM) > 0.05) ? Math.round(vM * 10) / 10 : rM;   // R25: como a barra (29,6 não vira 30)
  const voltou = Math.max(0, Math.round((fim - ini + cargas + prop) * 10) / 10);
  const nfam = Object.keys(st.fams).length;
  // R26: se a pequena teve menos de 5 respostas, o estrago dela não aparece separado (entregaria quantos aceitaram)
  // R34: a mesma frase aceitando alguém ou não (antes, "as cargas e as propostas aceitas" só aparecia quando alguém aceitava)
  // R35: com menos de 5 respostas, a pequena não vale (não tira nada); as propostas que aparecem aqui são só as que valeram
  const pqPoucos = false, juntaMata = false, juntaPub = false;
  const pubGrande = st.alvara?.aceito && st.alvara?.estrago?.alvo === "publico" ? Math.round(st.alvara.estrago.pontos || 0) : 0, pubVisto = juntaPub ? pubGrande : pub;
  const tirou = juntaMata ? `As cargas e as propostas aceitas tiraram ${cargas + prop}` : `As cargas tiraram ${cargas}${prop ? `, as propostas aceitas, ${prop}` : ""}`;
  const origem = `em pontos da mata cheia, ela foi de ${ini} para ${fim.toLocaleString("pt-BR")}. ${tirou}; a natureza e o replantio devolveram ${voltou.toLocaleString("pt-BR")}.` + (juntaPub ? (pubGrande ? ` E a proposta grande tirou ${pubGrande} pontos do bem público (um nível = ${PONTOS_NIVEL * nfam}); o que a pequena tirou fica guardado, porque ela teve menos de 5 respostas.` : " O que a proposta pequena tirou do bem público fica guardado, porque ela teve menos de 5 respostas.") : pub ? ` E as propostas tiraram ${pub} pontos do bem público (um nível = ${PONTOS_NIVEL * nfam}).` : "");
  const vs = Object.values(st.alvara?.votos || {}), n = st.ordem.length;
  // R16: as duas porcentagens sobre quem respondeu; o estrago da pequena sobre a turma inteira
  const pq = agregadoOk(st.pequena?.n || 0) ? pct(st.pequena.aceitaram, st.pequena.n) : null, pg = agregadoOk(vs.length) ? pct(vs.filter(Boolean).length, vs.length) : null;
  const fe = n ? Math.round((100 * (st.pequena?.aceitaram || 0)) / n) : 0;
  // R27: "quase o mesmo" com menos de 5 pontos ou até uma pessoa de diferença na base menor (11 de 19 contra 10 de 19 não é diferença)
  const nP = st.pequena?.n || 0, nG = vs.length, quase = pq != null && pg != null && (Math.abs(pq - pg) < 5 || Math.abs(st.pequena.aceitaram / nP - vs.filter(Boolean).length / nG) <= 1 / Math.min(nP, nG) + 1e-9);
  // R31: a diferença entre a pequena e a grande, com as mesmas pessoas: só vale como diferença quando quem mudou de lado num sentido
  // passa de duas vezes o erro do acaso (as falas já tinham esse cuidado; 7 de 19 contra 9 de 19 virava "por que mais gente toparia a grande?")
  const ambos = Object.keys(st.alvara?.votos || {}).filter((id) => st.pequena?.votos?.[id] != null), mP = ambos.filter((id) => st.pequena.votos[id] && !st.alvara.votos[id]).length, mG = ambos.filter((id) => !st.pequena.votos[id] && st.alvara.votos[id]).length;
  const acasoPG = !quase && mP + mG > 0 && Math.abs(mP - mG) <= 2 * Math.sqrt(mP + mG) + 1e-9;
  const semNivel = st.pequena?.estrago?.alvo === "publico" && !st.pequena.estrago.niveis && (st.pequena.estrago.pontos || 0) < PONTOS_NIVEL * Object.keys(st.fams).length * (fe / 100) - 0.5;   // R26: o estrago foi só o que a vila juntava
  // Ética: cada pergunta começa pelo nome técnico do que está em discussão
  const q = [
    H.length >= 3 ? (subiu ? (pouco ? "Quando o aluguel entrou (ano 3), a desigualdade subiu pouco. Quem ganhou com isso, e o que segurou o resto?" : "Quando o aluguel entrou (ano 3), a desigualdade subiu. Quem ganhou com isso, e sem fazer o quê?") : "Quando o aluguel entrou (ano 3), a desigualdade não subiu. O que segurou?") : "A desigualdade entre as famílias cresceu ou caiu? Por quê?",
    `Com o aluguel mordendo, a vila ${st.votoTrocou ? "trocou para a Prosperidade" : "ficou no Monopólio"}. Vocês votaram pelo interesse individual (o bolso), pelo bem comum (a vila) ou pela meta de cada regra?`,
    `Bolso ou vila também na mata: ${origem} ${st.colapsouAlguma ? (st.colapsou ? "Ela colapsou e não voltou." : mataMin < COLAPSO ? "Ela colapsou e voltou." : "Uma proposta a derrubou abaixo de 30% no meio do ano, e ela voltou.") : `O pior ano chegou a ${pctL(mataMin)}.`} ${fim < ini || st.colapsouAlguma || pubVisto ? "Quem pagou a conta?" : "O que segurou a mata?"}`,   // R33: com a mata subindo sem estrago, "quem pagou a conta?" não cabia
    pq != null && pg != null
      ? (quase
        ? `Na pequena, ${pq}% aceitaram${semNivel || !fe ? "" : ` (${fe}% do estrago de uma grande)`}; na grande, ${pg}% aceitariam: ${pq === pg ? "o mesmo. Por que o tamanho da proposta não mudou a resposta?" : Math.abs(pq - pg) < 5 ? "quase o mesmo. Por que o tamanho da proposta quase não mudou a resposta?" : "a diferença é de uma pessoa ou menos, o que não conta como mudança. O tamanho da proposta muda a resposta?"}`   // R36: 100% contra 83% com 5 respostas não é "quase o mesmo"
        : acasoPG
        ? `Na pequena, ${pq}% aceitaram${semNivel || !fe ? "" : ` (${fe}% do estrago de uma grande)`}; na grande, ${pg}% aceitariam: diferença do tamanho que o acaso dá. O tamanho da proposta muda a resposta?`
        : pq < pg
          ? `Na pequena, ${pq}% aceitaram${semNivel || !fe ? "" : ` (${fe}% do estrago de uma grande)`}. Na grande, em que uma pessoa só decidiria, ${pg}% aceitariam. Por que mais gente toparia a grande?`
          : `Na pequena, ${pq}% aceitaram${semNivel ? "" : fe >= 100 ? " (todos: o estrago inteiro de uma grande)" : ` (${fe}% do estrago de uma grande; se todos aceitassem, seria o estrago inteiro)`}. Na grande, ${pg}% aceitariam. Por que a pequena parece menos grave?`)
      : "Das propostas: na pequena, cada um decidiu por si; na grande, uma pessoa tinha o poder. Qual pareceu mais grave, e por quê?",
    "Fora da vila: na profissão de vocês (e no Código de Ética do CONFEF), onde estão a \"mata comum\" e as propostas pequenas?",
  ];
  return q;   // Ética: os nomes técnicos de cada pergunta vão na faixa de conceitos, embaixo (no texto, estouravam o cartão)
}

// R31: no "e se", todos os motivos de a meta não ser batida (antes, só o primeiro: com a mata e o patrimônio abaixo, saía só a mata)
function motivosMeta(o) {
  const m = [];
  if (o.mata < VITORIA.mataMinima) m.push("mata abaixo de 30%");
  const regra = o.regra === "prosperidade" ? `a família mais pobre com ${pctL(o.razao)} da média; a meta pede 70%` : `a meta pede ${VITORIA.patrimonioPorPessoa}`;
  if (o.regra === "prosperidade" ? o.razao < VITORIA.pobreSobreMedia : (o.pp ?? 0) < VITORIA.patrimonioPorPessoa) m.push(regra);
  return m.length ? m : [regra];
}

// R34: as duas falas da grande, numa linha (só quando aparecem, pelas mesmas regras da pequena)
function linhaFalasGrande(st) {
  const F = falasGrande(st);
  if (!F.ok) return "";   // as regras de quando as falas aparecem já foram ditas no painel da pequena
  return `<p class="rodape" style="margin:0">Na grande, com “presente em troca de”, ${pct(F.P.a, F.P.n)}% aceitariam; às claras, ${pct(F.C.a, F.C.n)}%: ${F.igual ? "o mesmo" : F.acaso ? "diferença do tamanho que o acaso dá" : "pista, não prova, de que a palavra pesou"}.</p>`;
}

// R33: a grande aceita só "já conta" na barra quando tirou alguma coisa (no nível 0 sem pontos, nada se perdeu)
const estragoReal = (e) => !!e && (e.alvo === "mata" ? (e.mata || 0) > 0.5 : (e.pontos || 0) > 0.5);

// R15: de onde vem cada tema, para a turma (uma linha embaixo do gráfico)
function teoria(st, k) {
  // R18: a referência do ano 4 conforme a carta que a turma jogou
  // R30: só quando a carta do ano 4 aparece na linha de apoio (com as duas falas, ela sai da pergunta 4)
  const t4 = k === 3 && st.cartas && !st.semTroco && !falasPequena(st).ok && agregadoOk(Object.values(st.mente || {}).length) ? carta(st.cartas.ano4).tipo : null;
  const ref4 = { dado: "; Jiang (2013): jogo da mente", honesto: "; Cohn e colegas (2019): carteiras perdidas", confia: "; Berg e colegas (1995): jogo da confiança" }[t4] || "";
  return ["Henry George: o valor da terra vem da comunidade; quem só tem o lote recebe sem fazer.",
    "Lizzie Magie (1904): o Jogo do Proprietário, avô do Banco Imobiliário, já tinha estas duas regras.",
    "Elinor Ostrom: comunidades cuidam do comum quando fazem regras e conversam.",
    `Abbink e colegas (2002 e 2006): propina e a palavra${ref4}.`,
    "Elinor Ostrom (pescas, pastos, canais): o comum também está em postos, praças e clubes."][k] || "";
}

// Ligação de cada pergunta com a anterior e com o resto da partida (uma linha embaixo da pergunta)
function apoioPergunta(st, k) {
  const o = st.outra;
  if (k === 0) return "Primeiro 1 minuto em dupla; depois, a turma.";
  if (k === 1 && o) return `E se fosse ${ARTIGO[o.regra]}? Mesmas decisões: patrimônio médio ${nL(o.pp ?? 0, VITORIA.patrimonioPorPessoa)} (foi ${nL(progressoMeta(st.fams, st.publico, st.mata, st.teto, "monopolio").valor, VITORIA.patrimonioPorPessoa)}), desigualdade final ${v2(o.gini)} (foi ${v2(st.historico.at(-1)?.gini ?? 0)}), meta ${o.meta ? "batida" : `não batida (${motivosMeta(o).join("; e ")})`}. É um "e se": na outra regra, vocês talvez decidissem diferente.`;
  if (k === 4) {
    const fin = Object.values(st.final), mot = contagem(fin.map((x) => x.motivo)), nM = MOTIVOS.reduce((a, m) => a + (mot[m] || 0), 0);
    const top = MOTIVOS.slice().sort((a, b) => (mot[b] || 0) - (mot[a] || 0)).slice(0, 2);
    return "Por exemplo: a agenda do posto, a praça onde se treina, a verba do clube. Quem ganha com elas sem fazer nada, e quem cuida delas?" + (agregadoOk(nM) ? ` Na turma, o que mais pesou: ${top.map((m) => `${m.toLowerCase()} (${pct(mot[m] || 0, nM)}%)`).join(" e ")}.` : "");
  }
  // R28: na pergunta 4, as duas falas da pequena (cada uma com 5 ou mais respostas) puxam a discussão
  const F = k === 3 ? falasPequena(st) : null, falas = F?.ok ? `Na pequena, com “presente em troca de”, ${pctFala(F.P).txt} aceitaram; às claras, ${pctFala(F.C).txt}${F.igual ? ", o mesmo" : F.acaso ? ", diferença do tamanho que o acaso dá" : ", pista (não prova) de que a palavra pesou"}. A palavra muda decisões? ` : "";
  // R29: a grande veio depois do carimbo do ano 2, e a pergunta 4 diz isso; com as falas, a carta do ano 4 sai desta linha (três assuntos em 1,5 min era demais)
  // R32: na madeira sem nota, o carimbo do ano 2 foi "Sonegação", não "Corrupção"
  const aviso = k === 3 && st.cartas ? (carta(st.cartas.pequena).carimbo ? `A grande veio depois do carimbo “${carta(st.cartas.pequena).carimbo}” do ano 2: a turma já tinha visto um carimbo. ` : "A grande veio depois do carimbo do ano 2: a turma já sabia o nome. ") : "";
  if (k === 3 && (F?.ok || !(st.cartas && !st.semTroco))) return (aviso + falas).trim();
  if (k === 3 && st.cartas && !st.semTroco) {
    const c = carta(st.cartas.ano4), vals = Object.values(st.mente);
    if (agregadoOk(vals.length)) return aviso + falas + (c.tipo === "confia" ? `E no ano 4 (confiança): ${pct(vals.filter(Boolean).length, vals.length)}% confiaram, e a chance de golpe era a mesma em todas as situações.` : c.tipo === "dado" ? `E no ano 4 (${c.titulo}): ${pct(vals.filter(Boolean).length, vals.length)}% disseram "acertei"; por acaso, seriam cerca de 17%. Ninguém sabe quem acertou de verdade.` : `E no ano 4 (${c.titulo}): ${pct(vals.filter(Boolean).length, vals.length)}% ficaram com o que não era seu, sem ninguém para conferir.`);   // R17: no dado, quem acertou por acaso não é desonesto
    return (aviso + falas).trim();   // R30: o aviso do carimbo também quando uma fala teve menos de 5 e a carta do ano 4 entra
  }
  return "";
}

// R28: as duas falas da proposta pequena ("presente em troca de" e às claras), por quem respondeu; cada fala só com 5 ou mais respostas
export function falasPequena(st) { return falasDe(st, st.pequena?.votos || {}); }
// R34: a grande também tem as duas falas, com as mesmas regras (10 ou mais em cada uma, as duas entre 10% e 90%)
export function falasGrande(st) { return falasDe(st, st.alvara?.votos || {}); }
function falasDe(st, votos) {
  const ids = Object.keys(votos), conta = (f) => { const xs = ids.filter((id) => falaDe(st, id) === f); return { n: xs.length, a: xs.filter((id) => votos[id]).length }; };
  // R33: cada fala só aparece com 10 ou mais respostas e com as duas longe dos extremos (entre 10% e 90%, sem incluir): com uma fala
  // inteira fazendo o mesmo, o total exato da turma e o número da outra fala entregavam a conta (R32 punha só os extremos em faixa,
  // e 75% no total com 50% na outra fala davam 10 de 10). Escondida, a comparação não diz qual fala nem de que lado ficou
  const P = conta("presente"), C = conta("claras"), longe = (x) => x.a / x.n > 0.1 + 1e-9 && x.a / x.n < 0.9 - 1e-9;
  const ok = P.n >= FALA_MIN && C.n >= FALA_MIN && longe(P) && longe(C);
  // R30: a metade sorteada só mostra efeito da palavra se a diferença passar de duas vezes o erro do sorteio
  // (antes, só até uma pessoa contava como acaso; sem efeito nenhum, diferenças maiores apareciam em quase metade das partidas)
  const p = ok ? (P.a + C.a) / (P.n + C.n) : 0, erro = ok ? Math.sqrt(p * (1 - p) * (1 / P.n + 1 / C.n)) : 0;
  const dif = ok ? Math.abs(P.a / P.n - C.a / C.n) : 0, igual = ok && dif < 0.005, acaso = ok && !igual && dif <= 2 * erro + 1e-9;
  return { P, C, ok, acaso, igual };
}
const FALA_MIN = 10;
function pctFala(x) { const p = pct(x.a, x.n); return { txt: `${p}%`, w: p }; }
// R34: o carimbo bate uma vez só em cada lugar; nos redesenhos seguintes do telão (cada envio, cada clique), fica parado
const carimbados = new Set();
const carimbo = (txt = "Corrupção", cls = "", chave = "") => {
  const parado = chave && carimbados.has(chave);
  if (chave) carimbados.add(chave);
  return `<div class="carimbo${cls ? ` ${cls}` : ""}${parado ? " parado" : ""}">${esc(txt)}</div>`;
};
function barrasFalas(F, grande = false) {
  return `<div class="col falas-barras">${[["“Presente em troca de”", F.P], ["Às claras (“cobra”, “oferece”)", F.C]].map(([rot, x]) => `<div><div class="row" style="justify-content:space-between;flex-wrap:nowrap"><b>${rot}</b><b class="mono">${pctFala(x).txt}</b></div><div class="barra ${grande ? "grande" : ""}"><i style="width:${pctFala(x).w}%;background:#f87171"></i></div></div>`).join("")}</div>`;
}
function painelFalas(st) {
  const F = falasPequena(st), c = carta(st.cartas.pequena);
  return `<div class="card col" style="justify-content:safe center;gap:1cqw;min-height:0">${carimbo(c.carimbo || "Corrupção", "md", `pequena-${st.seed}`)}
    <p class="big" style="margin:0;font-size:2.15cqw">Metade leu <b>“presente em troca de”</b>; metade, às claras. Mesmos pontos, mesmo estrago: o carimbo é da proposta, não de quem aceitou.</p>
    ${F.ok ? `${barrasFalas(F, true)}<p class="rodape" style="margin:0">${F.igual ? "Mesmo resultado nas duas falas. Fora do jogo, a palavra muda decisões?" : F.acaso ? "Com tão poucas pessoas, diferença assim é comum por acaso. A palavra muda decisões?" : "Diferença maior que a do acaso, mas é pista, não prova. A palavra mudou a decisão?"}</p>` : `<p class="rodape" style="margin:0">A comparação das duas falas aparece com 10 ou mais respostas em cada uma e nenhuma perto de todos ou de ninguém, para não entregar respostas.</p>`}</div>`;
}

// R16: na pergunta 4, as duas propostas lado a lado (mesma base: quem respondeu); na 5, o que guiou a turma
function barrasPropostas(st) {
  const vs = Object.values(st.alvara?.votos || {});
  if (!agregadoOk(st.pequena?.n || 0) || !agregadoOk(vs.length)) return `<p class="rodape">Menos de 5 respostas numa das propostas: os totais ficam guardados.</p>`;
  const linhas = [["Pequena, cada um por si", st.pequena.aceitaram, st.pequena.n], ["Grande, uma pessoa sorteada", vs.filter(Boolean).length, vs.length]];
  return `<div class="col fech-barras fino" style="gap:.5cqw">${linhas.map(([rot, a, n]) => `<div><div class="row" style="justify-content:space-between;flex-wrap:nowrap"><b>${rot}</b><b class="mono">${pct(a, n)}%</b></div><div class="barra grande"><i style="width:${pct(a, n)}%"></i></div></div>`).join("")}<p class="rodape" style="margin:0">De quem respondeu: ${linhas[0][1]} de ${linhas[0][2]} e ${linhas[1][1]} de ${linhas[1][2]}.</p></div>`;   // R28: as contagens na mesma linha, para caber o carimbo
}
function guiouTurma(st) {
  const fin = Object.values(st.final);
  if (!agregadoOk(fin.length)) return `<p class="rodape">O que guiou a turma aparece com 5 ou mais respostas.</p>`;
  const guias = contagem(fin.map((x) => x.guia)), motivos = contagem(fin.map((x) => x.motivo));
  const nG = GUIAS.reduce((a, g) => a + (guias[g] || 0), 0) || 1, nM = MOTIVOS.reduce((a, m) => a + (motivos[m] || 0), 0) || 1;
  const top = MOTIVOS.slice().sort((a, b) => (motivos[b] || 0) - (motivos[a] || 0)).slice(0, 2);
  // R22: barras com porcentagem (antes, contagens soltas em letra pequena)
  return `<div class="col fech-barras" style="gap:.7cqw"><b>O que guiou a turma (Platão e Hume)</b>${GUIAS.map((g) => `<div class="barra-rot" style="grid-template-columns:11cqw 1fr 6cqw;font-size:2cqw"><span>${g}</span><div class="barra"><i style="width:${pct(guias[g] || 0, nG)}%"></i></div><b class="mono">${pct(guias[g] || 0, nG)}%</b></div>`).join("")}</div>`;   // R22: "o que mais pesou" fica ao lado, embaixo da pergunta 5
}

function telaoFechamento(st) {
  const ranking = porPatrimonio(st), vz = vezes(ranking);
  const k = st.pergunta || 0, qs = perguntasFechamento(st), apoio = apoioPergunta(st, k);
  const fin = Object.values(st.final);
  const guias = contagem(fin.map((x) => x.guia)), motivos = contagem(fin.map((x) => x.motivo));
  const tam = qs[k].length + apoio.length, longa = tam > 170;
  return topo(st, "Fechamento", CONCEITOS_FECHAMENTO[k] || []) + `<div class="grid" style="grid-template-columns:1fr 1.25fr;flex:1;min-height:0">
    <div class="card col" style="min-height:0;gap:.7cqw;overflow:hidden"><h2 class="row" style="color:var(${st.vitoria ? "--ok" : "--warn"})">${ico(st.vitoria ? "trofeu" : "meta", "g")}${st.vitoria ? "A vila bateu a meta!" : "A vila não bateu a meta"}</h2>
      ${k === 3 ? `<div class="col" style="gap:.6cqw;align-items:flex-start">${st.cartas && carta(st.cartas.pequena).carimbo ? carimbo(`${carta(st.cartas.pequena).carimbo} e corrupção`, "pq longo", `q4-${st.seed}`) : `${carimbo("Corrupção", "pq", `q4-${st.seed}`)}<span class="big" style="margin:0">as duas propostas</span>`}</div>` : `<p class="big" style="margin:0;font-size:2.1cqw">${vz.txt}</p>`}
      <div class="linha-media">${k === 3 ? barrasPropostas(st) : k === 4 ? guiouTurma(st) : linhaDoTempo(st.historico, { F: 30, alto: 240, so: k === 2 ? "mata" : "desig" })}</div><p class="rodape teoria">De onde vem: ${esc(teoria(st, k))}</p></div>
    <div class="col" style="min-height:0"><div class="card pergunta" style="flex:1;min-height:0;overflow:hidden"><div class="temas">${TEMAS.map((t, i) => `<span class="${i === k ? "agora" : i < k ? "feito" : ""}">${t}</span>`).join("")}</div>
      <p class="pergunta-txt ${tam > 250 ? "longa longa2" : longa ? "longa" : ""}">${esc(qs[k])}</p>${apoio ? `<p class="rodape apoio">${esc(apoio)}</p>` : ""}${k === 0 ? `<div class="crono-mini">${cronometro(st, "Dupla, depois da síntese", 60, 90)}</div>` : ""}</div>
      </div></div>`;   // Ética: os conceitos da pergunta vão na linha do título
}
