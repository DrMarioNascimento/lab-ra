// 15 partidas completas do Mosaico Vila sem tela: motor + participantes simulados (o mesmo código do /simulador).
// Uso: node tests/partidas.mjs
import { estadoInicial, reduzir, FASES, progresso } from "../js/engine.js";
import { passoBot, NOMES, perfilBot, papelBully } from "../js/bots.js";
import { gini, fecharAno, progressoMeta, COLAPSO, tetoLotes } from "../js/content/regras.js";
import { carta, cartaAno4, sortearCartas, PEQUENAS, GRANDES, ANO4, CONFIANCA } from "../js/content/cartas.js";
import { renderTelao } from "../js/views/telao.js";
import { renderAluno, novoLocal } from "../js/views/aluno.js";
import { rnd } from "../js/engine.js";

const TAM = [12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40];
let falhas = 0;
let rendaSobe = 0;
const ok = (c, msg) => { if (!c) { falhas++; console.log("FALHOU:", msg); } };
const linhas = [];
const vistas = new Set();
let confiaram = 0, golpes = 0;
for (const n of TAM) {
  let st = estadoInicial();
  const dispatch = (a) => { st = reduzir(st, a); };
  const locs = {};
  for (let i = 0; i < n; i++) { const id = `a${i + 1}`; dispatch({ t: "entrar", id, nome: NOMES[i] }); locs[id] = { perfil: perfilBot(i + 1), papelBully: papelBully(i + 1), pub: 20, rep: 0, car: 0, lance: 30 }; }
  dispatch({ t: "sortear", seed: 1000 + n });
  const lotes0 = Object.fromEntries(Object.values(st.fams).map((f) => [f.id, f.lotes]));
  let passos = 0;
  const visitadas = [], alugueis = [];
  if (n === 26) dispatch({ t: "config", semTroco: true });   // R13: a carta do ano 4 vem ligada; uma partida testa o professor desligando
  while (st.fase !== "fechamento" && passos < 5000) {
    visitadas.push(`${st.fase}:${st.ano}`);
    if (st.fase === "abertura") alugueis.push([st.ano, Object.values(st.renda).reduce((a, r) => a + r.aluguel, 0)]);
    for (let k = 0; k < 40; k++) for (const id of st.ordem) passoBot(st, id, locs[id], dispatch);
    const p = progresso(st);
    if (p && p.total) ok(p.feito <= p.total, `progresso coerente em ${st.fase}`);
    dispatch({ t: "fase", dir: 1 });
    passos++;
  }
  for (let k = 0; k < 40; k++) for (const id of st.ordem) passoBot(st, id, locs[id], dispatch);
  ok(st.fase === "fechamento", `chegou ao fechamento (n=${n})`);
  ok(st.historico.length === 5, `5 anos registrados (n=${n})`);
  ok(st.lotes.filter(Boolean).length === Object.values(st.fams).reduce((a, f) => a + f.lotes, 0), `lotes do mapa = lotes das famílias (n=${n})`);
  ok(Object.values(st.fams).every((f) => Number.isFinite(f.caixa)), `caixa finito (n=${n})`);
  ok(st.mata >= 0 && st.mata <= st.teto + 1e-9, `mata entre 0 e o teto (n=${n})`);
  const membros = Object.values(st.fams).reduce((a, f) => a + f.membros.length, 0);
  ok(membros === n, `todos numa família (n=${n})`);
  ok(!Object.values(st.renda || {}).some((r) => r.total < 0), `piso de renda: nenhuma família com renda negativa no último ano (n=${n})`);
  ok(st.historico.every((h, k) => k === 0 || h.ano === st.historico[k - 1].ano + 1), `anos em sequência (n=${n})`);
  const comTroco = n !== 26;   // R13: a carta do ano 4 vem ligada; a partida de 26 testa o professor desligando
  ok(visitadas.indexOf("alvara:5") < visitadas.indexOf("decidir:5"), `R14: proposta grande antes das decisões do ano 5 (n=${n})`);
  ok(visitadas.indexOf("conversa:3") >= 0 && visitadas.indexOf("conversa:3") === visitadas.indexOf("voto:3") - 1, `R16: conversa logo antes do voto (n=${n})`);
  ok(Object.values(st.fams).every((f) => f.lotes <= Math.max(lotes0[f.id], tetoLotes(f))), `R16: nenhuma família compra além da moradia + 1 lote (n=${n})`);
  if (carta(st.cartas.ano4).grupo === "confianca") {
    const tipos = st.ordem.map((id) => cartaAno4(st, id).id);
    ok(CONFIANCA.every((c) => tipos.includes(c)), `R16: na confiança, as 4 situações aparecem na turma (n=${n})`);
    ok(tipos.every((c) => carta(c).ganhoBom === 2), `R16: o mesmo +2 em todas as situações (n=${n})`);
  }
  ok(["pequena:2", "voto:3", "alvara:5"].every((e) => visitadas.includes(e)) && visitadas.includes("mente:4") === comTroco, `pequena no ano 2, voto no 3, carta do ano 4 (se ligada), grande no 5 (n=${n})`);
  // R13: cartas sorteadas pela semente: a mesma semente refaz as mesmas cartas
  const c0 = sortearCartas(rnd((1000 + n) ^ 0x5bd1e995));
  ok(JSON.stringify(c0) === JSON.stringify(st.cartas), `cartas reproduzíveis pela semente (n=${n})`);
  for (const c of Object.values(st.cartas)) vistas.add(c);
  ok(st.pequena.aceitaram != null && st.pequena.aceitaram <= n, `pequena: contagem de quem aceitou (n=${n})`);
  ok(Object.entries(st.pequena.votos).every(([id, v]) => !v || st.pessoal[id] >= 2 || carta(st.cartas.ano4).tipo === "confia"), `pequena: os 2 pontos são pessoais (n=${n})`);
  ok(!st.pequena.aceitaram || st.pequena.estrago, `pequena: estrago aplicado quando alguém aceita (n=${n})`);
  ok(!st.pequena.estrago || st.pequena.estrago.alvo !== "mata" || st.pequena.estrago.pct <= 20 + 1e-9, `pequena: estrago na mata no máximo 20% (n=${n})`);
  if (comTroco && carta(st.cartas.ano4).tipo === "confia") { const ids = Object.keys(st.golpe); confiaram += ids.length; golpes += ids.filter((id) => st.golpe[id]).length; }
  ok(!visitadas.some((v) => v.startsWith("lances:") && +v.split(":")[1] < 4), `mercado só a partir do ano 4 (n=${n})`);
  ok(!comTroco || Object.values(st.pessoal).some((x) => x > 0) || Object.values(st.mente).every((x) => !x), `troco vai para pontos pessoais (n=${n})`);
  ok(!visitadas.some((v) => v.startsWith("boato")), `sem boato (n=${n})`);
  ok(alugueis.every(([ano, v]) => ano >= 3 || v === 0), `aluguel só a partir do ano 3 (n=${n})`);
  ok(st.alvara.aceitariam != null && st.alvara.aceitariam <= n && st.ordem.includes(st.alvara.pessoa), `alvará: uma pessoa sorteada e a contagem de quem aceitaria (n=${n})`);
  ok(!st.alvara.aceito || st.pessoal[st.alvara.pessoa] >= 8 - 2, `alvará: os 8 pontos são pessoais (a confiança do ano 4 pode ter tirado 2) (n=${n})`);
  ok(Object.keys(st.controle.voto || {}).length > 0, `pergunta de controle antes do voto (n=${n})`);
  ok(st.outra && st.outra.regra !== st.regra && Number.isFinite(st.outra.gini), `a vila na outra regra calculada (n=${n})`);
  ok([1, 2, 3, 4].every((a) => Object.keys(st.controle[a] || {}).length > 0), `perguntas de controle respondidas nos anos 1 a 4 (n=${n})`);
  ok(!visitadas.some((v) => v.startsWith("lances:") && +v.split(":")[1] < 3), `mercado de lotes só a partir do ano 3 (n=${n})`);
  const h = st.historico;
  // R10: a desigualdade da renda do ano entra no histórico e sobe quando o aluguel entra (ano 2 → 3)
  ok(h.every((x) => Number.isFinite(x.giniRenda)), `desigualdade da renda registrada todo ano (n=${n})`);
  if (h[2].giniRenda > h[1].giniRenda + 0.01) rendaSobe++;
  const pm = progressoMeta(st.fams, st.publico, st.mata, st.teto, st.regra);
  ok(Number.isFinite(pm.valor) && pm.alvo > 0, `barra da meta calculada (n=${n})`);
  ok(st.colapsouAlguma || !st.colapsou, `colapso registrado (n=${n})`);
  linhas.push({ n, familias: Object.keys(st.fams).length, gini: h.map((x) => x.gini.toFixed(2)).join(" "), renda: h.map((x) => x.giniRenda.toFixed(2)).join(" "), mata: h.map((x) => Math.round(100 * x.mata)).join(" "),
    publico: st.publico, outra: st.outra ? `${st.outra.gini.toFixed(2)}${st.outra.meta ? "✓" : ""}` : "", troca: st.votoTrocou, colapso: st.colapsouAlguma, vitoria: !!st.vitoria, lotes: Object.values(st.fams).map((f) => f.lotes).join("/") });
}
console.table(linhas);
ok(rendaSobe >= 12, `a desigualdade da renda sobe quando o aluguel entra em pelo menos 12 de 15 partidas (foram ${rendaSobe})`);
// R13: o baralho varia entre partidas (pelo menos 8 cartas diferentes em 15 partidas) e a chance de golpe fica perto de 1 em 4
ok(vistas.size >= 8, `cartas variam entre partidas (${vistas.size} diferentes de ${PEQUENAS.length + GRANDES.length + ANO4.length})`);
console.log(`cartas vistas: ${[...vistas].join(", ")} · confiança: ${golpes}/${confiaram} golpes`);
ok(!confiaram || (golpes / confiaram > 0.1 && golpes / confiaram < 0.45), `golpe perto de 1 em 4 (${golpes}/${confiaram})`);
// R15: Voltar restaura o retrato do estado (as contas não rodam duas vezes) e o lance de quem não envia é 0%
{
  let st = estadoInicial(); const d = (a) => { st = reduzir(st, a); };
  for (let i = 0; i < 20; i++) d({ t: "entrar", id: `a${i}`, nome: `P${i}` });
  d({ t: "sortear", seed: 9 });
  while (!(st.fase === "pequena")) { if (st.fase === "decidir") for (const id of st.ordem) d({ t: "propor", id, p: { pub: 20, rep: 5, car: 1 } }); d({ t: "fase", dir: 1 }); }
  for (const id of st.ordem) d({ t: "pequena", id, aceita: false });
  d({ t: "fase", dir: 1 });
  const antes = JSON.stringify({ c: Object.values(st.fams).map((f) => f.caixa), m: st.mata, a: st.acumulado, h: st.historico.length });
  d({ t: "fase", dir: -1 }); d({ t: "fase", dir: -1 }); d({ t: "fase", dir: 1 }); d({ t: "fase", dir: 1 });
  const depois = JSON.stringify({ c: Object.values(st.fams).map((f) => f.caixa), m: st.mata, a: st.acumulado, h: st.historico.length });
  ok(antes === depois, `Voltar e Avançar não refazem as contas (${antes} = ${depois})`);
  // ninguém manda lance nos anos 4 e 5: os lotes saem pelo mínimo
  while (st.fase !== "fechamento") { if (st.fase === "decidir" && st.ano === 4) for (const id of st.ordem) d({ t: "propor", id, p: { pub: 20, rep: 5, car: 1 } }); if (st.fase === "lances") { const pr = Object.values(st.props[st.ano] || {}); ok(pr.every((p) => !p.lanceEnviado), `ano ${st.ano}: ninguém começa com lance enviado`); } d({ t: "fase", dir: 1 });
    if (st.fase === "resultado" && st.leilao && st.ano >= 4) ok(st.leilao.vendidos.every((v) => v.preco <= st.leilao.minimo + 1e-9), `ano ${st.ano}: sem lance enviado, o lote sai pelo mínimo`); }
}
// R16: celulares que não respondem (8 de 20 nunca enviam nada): a partida anda até o fim e as telas não quebram;
// e quem marca "não queremos lote" fica de fora do mercado
{
  let st = estadoInicial(); const d = (a) => { st = reduzir(st, a); };
  for (let i = 0; i < 20; i++) d({ t: "entrar", id: `a${i}`, nome: `P${i}` });
  d({ t: "sortear", seed: 31 });
  const mudos = new Set(st.ordem.filter((_, k) => k % 5 < 2)), locs = Object.fromEntries(st.ordem.map((id, i) => [id, { perfil: perfilBot(i + 1), papelBully: papelBully(i + 1), pub: 20, rep: 0, car: 0, lance: 30 }]));
  let erros = 0, passos = 0, semLoteOk = true;
  const tela = () => { try { renderTelao(st); for (const id of st.ordem.slice(0, 6)) renderAluno(st, id, novoLocal()); } catch (e) { erros++; console.log("tela quebrou em", st.fase, st.ano, e.message); } };
  while (st.fase !== "fechamento" && passos++ < 200) {
    if (st.fase === "lances" && st.ano === 4) { for (const id of st.ordem) if (!mudos.has(id)) d({ t: "lance", id, v: -1 }); }
    for (let k = 0; k < 40; k++) for (const id of st.ordem) if (!mudos.has(id)) passoBot(st, id, locs[id], d);
    tela();
    const ano = st.ano, fase = st.fase;
    d({ t: "fase", dir: 1 });
    if (fase === "lances" && ano === 4) {
      const fora = new Set(st.leilao.semLote);
      semLoteOk = st.leilao.vendidos.every((v) => !fora.has(v.fam)) && fora.size > 0;
    }
  }
  tela();
  ok(st.fase === "fechamento" && erros === 0, `R16: com 8 celulares mudos, a partida chega ao fim sem tela quebrada (${erros} erros)`);
  ok(semLoteOk, "R16: família que marcou \"não queremos lote\" não compra");
  ok(st.alvara.pessoa && (!mudos.has(st.alvara.pessoa) || st.alvara.aceito === false), "R16: se a pessoa sorteada não respondeu, conta como recusa");
}
// R13: com o mesmo número de aceites, o estrago da pequena com a turma inteira é igual ao da grande
{
  let st = estadoInicial(); const d = (a) => { st = reduzir(st, a); };
  for (let i = 0; i < 12; i++) d({ t: "entrar", id: `a${i}`, nome: `P${i}` });
  d({ t: "sortear", seed: 7 });
  while (st.fase !== "pequena") { if (st.fase === "decidir") for (const id of st.ordem) d({ t: "propor", id, p: { pub: 0, rep: 0, car: 0 } }); d({ t: "fase", dir: 1 }); }
  const antes = { mata: st.mata, pub: st.publico, acc: st.acumulado };
  for (const id of st.ordem) d({ t: "pequena", id, aceita: true });
  d({ t: "fase", dir: 1 });
  const c = carta(st.cartas.pequena);
  ok(c.alvo === "mata" ? Math.abs(antes.mata - st.mata - 0.2 * st.teto) < 1e-6 || st.mata === 0 : antes.pub - st.publico === 1 || (antes.pub === 0 && st.acumulado === 0), `pequena com a turma inteira = estrago grande (${c.id})`);
  ok(st.ordem.every((id) => st.pessoal[id] === 2), "pequena: +2 para cada um que aceitou");
}
// R10: a mata colapsada volta quando o replantio a leva de novo acima de 30% (e o −4 acaba)
{
  const fams = { a: { id: "a", membros: [1, 2, 3, 4], caixa: 50, lotes: 2 } };
  const v = { fams, mata: 5, teto: 20, publico: 0, acumulado: 0, colapsou: true, ano: 3 };
  const renda = { a: { total: 100, imposto: 0 } };
  const fx = fecharAno(v, { 1: { pub: 0, rep: 30, car: 0 }, 2: { pub: 0, rep: 30, car: 0 }, 3: { pub: 0, rep: 30, car: 0 }, 4: { pub: 0, rep: 30, car: 0 } }, renda);
  ok(fx.mata >= COLAPSO * 20 && !fx.colapsou, `mata volta acima de 30% replantando e o colapso acaba (mata ${fx.mata.toFixed(1)} de 20)`);
  const fy = fecharAno({ ...v, mata: 7, colapsou: false }, { 1: { pub: 0, rep: 0, car: 3 }, 2: { pub: 0, rep: 0, car: 3 } }, renda);
  ok(fy.colapsou, "mata abaixo de 30% colapsa");
}
const s = (k) => linhas.filter((l) => l[k]).length;
console.log(`troca aprovada ${s("troca")}/15 · colapso ${s("colapso")}/15 · vitória coletiva ${s("vitoria")}/15 · desigualdade da renda sobe com o aluguel em ${rendaSobe}/15`);
console.log(falhas ? `${falhas} verificações falharam` : "todas as verificações passaram");
process.exit(falhas ? 1 : 0);
