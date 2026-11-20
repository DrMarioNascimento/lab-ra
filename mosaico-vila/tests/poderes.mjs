// Poderes de quem conduz (R43): expulsar, mudar de família, chefe da família, pessoa sorteada; painel do professor e do celular.
// Uso: node tests/poderes.mjs
import { estadoInicial, reduzir, FASES, progresso } from "../js/engine.js";
import { passoBot, passoAuto, NOMES, perfilBot, papelBully } from "../js/bots.js";
import { renderProfessor, acaoProfessor, ligarSinal } from "../js/views/professor.js";
import { renderAluno, novoLocal, temaFamilia } from "../js/views/aluno.js";
import { renderTelao } from "../js/views/telao.js";

let falhas = 0;
const ok = (c, msg) => { if (!c) { falhas++; console.log("FALHOU:", msg); } else console.log("  ok", msg); };

function nova(n, seed = 7) {
  let st = estadoInicial(); const locs = {};
  const dispatch = (a) => { st = reduzir(st, a); };
  for (let i = 0; i < n; i++) { const id = `a${i + 1}`; dispatch({ t: "entrar", id, nome: NOMES[i] }); locs[id] = Object.assign(novoLocal(), { perfil: perfilBot(i + 1), papelBully: papelBully(i + 1) }); }
  return { get st() { return st; }, dispatch, locs };
}
// joga o resto da partida com os bots (humanos e automáticos) até o fechamento
function jogarAte(j, alvo = "fechamento") {
  let guarda = 0;
  while (j.st.fase !== alvo && j.st.fase !== "fechamento" && guarda++ < 400) {
    for (let k = 0; k < 40; k++) for (const id of j.st.ordem) { j.locs[id] ??= Object.assign(novoLocal(), { perfil: perfilBot(+id.slice(1) || 500), papelBully: papelBully(+id.slice(1) || 500) }); if (j.st.alunos[id]?.auto) passoAuto(j.st, id, j.locs[id], j.dispatch); else passoBot(j.st, id, j.locs[id], j.dispatch); }
    j.dispatch({ t: "fase", dir: 1 });
  }
}
const coerente = (st) => {
  const vistos = new Set(); let bom = true;
  for (const f of Object.values(st.fams)) for (const m of f.membros) { if (vistos.has(m) || !st.alunos[m] || st.alunos[m].fam !== f.id) bom = false; vistos.add(m); }
  return bom && vistos.size === st.ordem.length && st.ordem.every((id) => vistos.has(id));
};

console.log("# expulsar na entrada");
{
  const j = nova(14);
  j.dispatch({ t: "remover", id: "a3" });
  ok(!j.st.alunos.a3 && !j.st.ordem.includes("a3") && j.st.ordem.length === 13, "sai de alunos e da ordem");
  j.dispatch({ t: "entrar", id: "a20", nome: NOMES[2] });
  ok(j.st.alunos.a20?.nome === NOMES[2], "o mesmo nome entra de novo");
}

console.log("# expulsar no meio do jogo e terminar a partida");
{
  const j = nova(16); j.dispatch({ t: "sortear", seed: 11 });
  jogarAte(j, "decidir");
  j.dispatch({ t: "fase", dir: 1 });   // já passou do ano 1
  j.dispatch({ t: "remover", id: "a5" });
  ok(coerente(j.st), "famílias coerentes depois de expulsar");
  ok(Object.values(j.st.props).every((p) => !("a5" in p)), "propostas da pessoa somem");
  jogarAte(j);
  ok(j.st.fase === "fechamento" && j.st.historico.length === 5, "a partida chega ao fim sem a pessoa");
  ok(Object.values(j.st.fams).every((f) => Number.isFinite(f.caixa)), "caixas finitos");
}

console.log("# expulsar todos de uma família (vira família automática)");
{
  const j = nova(12); j.dispatch({ t: "sortear", seed: 5 });
  const f = Object.values(j.st.fams)[1], ids = [...f.membros];
  for (const id of ids) j.dispatch({ t: "remover", id });
  ok(j.st.fams[f.id].membros.length >= 1 && j.st.fams[f.id].automatica, "ganhou vizinho automático");
  ok(coerente(j.st), "coerente");
  jogarAte(j);
  ok(j.st.fase === "fechamento", "a partida termina");
}

console.log("# mover e sortear para outra família");
{
  const j = nova(16); j.dispatch({ t: "sortear", seed: 3 });
  const antes = j.st.alunos.a4.fam, destino = Object.keys(j.st.fams).find((k) => k !== antes);
  j.dispatch({ t: "mover", id: "a4", fam: destino });
  ok(j.st.alunos.a4.fam === destino && j.st.fams[destino].membros.includes("a4") && !j.st.fams[antes].membros.includes("a4") && coerente(j.st), "mover para a família escolhida");
  ok(j.st.alunos.a4.achou === false, "na etapa das famílias, precisa achar a família nova");
  j.dispatch({ t: "mover", id: "a4", fam: "sorteio" });
  ok(j.st.alunos.a4.fam !== destino && coerente(j.st), "sortear para outra família");
  j.dispatch({ t: "mover", id: "a4", fam: j.st.alunos.a4.fam });
  ok(coerente(j.st), "mover para a mesma família não muda nada");
  jogarAte(j);
  ok(j.st.fase === "fechamento", "a partida termina depois das trocas");
  const e = nova(14); e.dispatch({ t: "mover", id: "a1", fam: "f0" });
  ok(!e.st.fams.f0, "na entrada, mover não faz nada");
}

console.log("# modo vizinhos: chefia da família e família que fica automática");
{
  const j = nova(5); j.dispatch({ t: "sortear", seed: 9 });
  ok(j.st.vizinhos, "5 pessoas: modo vizinhos");
  const fa = Object.values(j.st.fams).find((f) => f.membros.includes("a1"));
  j.dispatch({ t: "mover", id: "a1", fam: Object.values(j.st.fams).find((f) => f.id !== fa.id && !f.automatica).id });
  ok(j.st.fams[fa.id].automatica && j.st.fams[fa.id].membros.every((m) => j.st.alunos[m].nome.startsWith("Vizinho")), "a família que ficou sem gente vira automática (vizinhos)");
  const nova2 = j.st.alunos.a1.fam;
  ok(j.st.fams[nova2].membros.filter((m) => !j.st.alunos[m].auto).length === 2, "a família nova tem duas pessoas");
  const outro = j.st.fams[nova2].membros.find((m) => !j.st.alunos[m].auto && m !== "a1");
  j.dispatch({ t: "chefe", id: outro });
  ok(j.st.fams[nova2].chefe === outro, "chefia definida");
  // a decisão de quem não é chefe não é copiada pelos parentes; a do chefe é
  while (j.st.fase !== "decidir") j.dispatch({ t: "fase", dir: 1 });
  const parente = j.st.fams[nova2].membros.find((m) => j.st.alunos[m].auto);
  j.dispatch({ t: "propor", id: "a1", p: { pub: 50, rep: 0, car: 0 } });
  const p1 = j.st.props[j.st.ano]?.[parente]?.pub;
  j.dispatch({ t: "propor", id: outro, p: { pub: 7, rep: 0, car: 0 } });
  ok(p1 !== 50 && j.st.props[j.st.ano][parente].pub === 7, "parentes seguem só a chefia");
  jogarAte(j);
  ok(j.st.fase === "fechamento", "partida de 5 termina");
}

console.log("# pessoa sorteada da proposta grande");
{
  const j = nova(14); j.dispatch({ t: "sortear", seed: 21 });
  jogarAte(j, "alvara");
  ok(j.st.fase === "alvara" && j.st.alvara.pessoa, "chegou à proposta grande");
  j.dispatch({ t: "sorteado", id: "a2" });
  ok(j.st.alvara.pessoa === "a2", "professor troca a pessoa sorteada");
  j.dispatch({ t: "remover", id: "a2" });
  ok(j.st.alvara.pessoa && j.st.alvara.pessoa !== "a2" && j.st.alunos[j.st.alvara.pessoa], "quem foi sorteado e saiu: sorteia outra pessoa");
  jogarAte(j);
  ok(j.st.fase === "fechamento", "termina");
}

console.log("# painel do professor, celular e telão");
{
  const j = nova(14); j.dispatch({ t: "sortear", seed: 2 });
  ligarSinal((id) => (id === "a3" ? 200 : 5));
  let h = renderProfessor(j.st);
  ok(h.includes('data-a="menu"') && h.includes("pp-fam") && h.includes("Ainda procurando a família"), "painel por família, com status da etapa");
  ok(h.includes("Sem sinal há 3 min") && h.includes("1 sem sinal"), "mostra quem está sem sinal");
  // menu e ações
  const el = (o) => ({ dataset: o, classList: { contains: () => false } });
  let log = [];
  acaoProfessor("menu", el({ id: "a3" }), (a) => log.push(a));
  h = renderProfessor(j.st);
  ok(h.includes("pp-menu-card") && h.includes("Expulsar da sala") && h.includes("Sortear para outra família") && h.includes("Mover para uma família"), "menu de ações da pessoa");
  global.confirm = () => true;
  acaoProfessor("sortear-fam", el({}), (a) => log.push(a));
  ok(log.at(-1)?.t === "mover" && log.at(-1).fam === "sorteio" && log.at(-1).id === "a3", "sortear para outra família");
  acaoProfessor("menu", el({ id: "a3" }), () => {});
  acaoProfessor("expulsar", el({}), (a) => log.push(a));
  ok(log.at(-1)?.t === "remover" && log.at(-1).id === "a3", "expulsar");
  ligarSinal(() => null);
  const m = j.st.alunos.a1;
  const tela = renderAluno(j.st, "a1", novoLocal());
  ok(tela.includes("Sua família") && tela.includes(j.st.fams[m.fam].nome), "celular: 'Sua família' e o nome da família sempre no topo");
  ok(temaFamilia(j.st, "a1").includes("--fam:"), "celular: paleta da família");
  const l = novoLocal(); renderAluno(j.st, "a1", l); j.dispatch({ t: "fase", dir: 1 });
  ok(renderAluno(j.st, "a1", l).includes("fase-aviso"), "celular: aviso de mudança de etapa");
  const e = nova(4);
  ok(renderAluno(e.st, "a1", Object.assign(novoLocal(), { manual: false })).includes("Você vai representar uma família"), "entrada: deixa claro o papel");
  ok(renderProfessor(e.st).includes("Na sala"), "entrada: lista de quem está na sala");
  ok(renderTelao(j.st).length > 100, "telão renderiza");
}
console.log(falhas ? `${falhas} FALHA(S)` : "todas as verificações passaram");
process.exit(falhas ? 1 : 0);
