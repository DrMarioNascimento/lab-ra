// 15 partidas completas do Mosaico Vila sem tela: motor + participantes simulados (o mesmo código do /simulador).
// Uso: node tests/partidas.mjs
import { estadoInicial, reduzir, FASES, progresso } from "../js/engine.js";
import { passoBot, NOMES, perfilBot, papelBully } from "../js/bots.js";
import { gini, fecharAno, progressoMeta, COLAPSO } from "../js/content/regras.js";

const TAM = [12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40];
let falhas = 0;
let rendaSobe = 0;
const ok = (c, msg) => { if (!c) { falhas++; console.log("FALHOU:", msg); } };
const linhas = [];
for (const n of TAM) {
  let st = estadoInicial();
  const dispatch = (a) => { st = reduzir(st, a); };
  const locs = {};
  for (let i = 0; i < n; i++) { const id = `a${i + 1}`; dispatch({ t: "entrar", id, nome: NOMES[i] }); locs[id] = { perfil: perfilBot(i + 1), papelBully: papelBully(i + 1), pub: 20, rep: 0, car: 0, lance: 30 }; }
  dispatch({ t: "sortear", seed: 1000 + n });
  let passos = 0;
  const visitadas = [], alugueis = [];
  if (n === 26) dispatch({ t: "config", semTroco: false });
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
  const comTroco = n === 26;   // uma das partidas testa o professor ligando o troco (desligado por padrão)
  ok(["voto:3", "alvara:5"].every((e) => visitadas.includes(e)) && visitadas.includes("mente:4") === comTroco, `voto no ano 3, troco no 4 (só se ligado), alvará no 5 (n=${n})`);
  ok(!visitadas.some((v) => v.startsWith("lances:") && +v.split(":")[1] < 4), `mercado só a partir do ano 4 (n=${n})`);
  ok(!comTroco || Object.values(st.pessoal).some((x) => x > 0) || Object.values(st.mente).every((x) => !x), `troco vai para pontos pessoais (n=${n})`);
  ok(!visitadas.some((v) => v.startsWith("boato")), `sem boato (n=${n})`);
  ok(alugueis.every(([ano, v]) => ano >= 3 || v === 0), `aluguel só a partir do ano 3 (n=${n})`);
  ok(st.alvara.aceitariam != null && st.alvara.aceitariam <= n && st.ordem.includes(st.alvara.pessoa), `alvará: uma pessoa sorteada e a contagem de quem aceitaria (n=${n})`);
  ok(!st.alvara.aceito || st.pessoal[st.alvara.pessoa] >= 8, `alvará: os 8 pontos são pessoais (n=${n})`);
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
