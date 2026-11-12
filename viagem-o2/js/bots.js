// Alunos simulados (piloto automático) para o /simulador.
import { POSTOS, PARADAS, MECANISMOS, LEIS } from "./content/viagem.js";
import { casoById } from "./content/casos.js";
import { valoresDoCaso } from "./engine.js?v=desfecho-20261111";
import { direction, fmtVar, VAR_META } from "./model.js";
import { REPOUSO, EXERCICIO } from "./content/params-casos.js";
import { compute } from "./model.js";

const VREP = compute(REPOUSO), VEX = compute(EXERCICIO);
export const NOMES = ["Ana", "Bruno", "Camila", "Diego", "Eduarda", "Felipe", "Gabriela", "Heitor", "Isabela", "João", "Larissa", "Mateus", "Natália", "Otávio", "Paula", "Rafael", "Sofia", "Tiago", "Valentina", "Yuri", "Beatriz", "Caio", "Débora", "Enzo", "Fernanda", "Gustavo", "Helena", "Igor", "Júlia", "Kaio", "Lívia", "Murilo", "Nicole", "Pedro", "Quésia", "Renan", "Sabrina", "Thiago", "Vitória", "Wesley"];

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const chance = (p) => Math.random() < p;

function hipoteseBot(st, g, maisCerta = 0) {
  const caso = casoById(st.casoId);
  const { base, real } = valoresDoCaso(st.casoId);
  const posto = POSTOS.find((p) => p.id === g.posto);
  const gab = caso.postos[g.posto];
  const mec = chance(0.45 + maisCerta) ? caso.mecanismo : pick(MECANISMOS).id;
  const papel = chance(0.5 + maisCerta) ? gab.papel : pick(["origem", "compensa", "consequencia", "normal"]);
  const prev = {};
  for (const v of posto.vars) {
    const d = direction(v, base[v], real[v]);
    prev[v] = { dir: chance(0.62 + maisCerta) ? d : pick(["↑", "↓", "="]) };
    if (chance(0.4)) { const r = VAR_META[v].pct ? real[v] * 100 : real[v]; prev[v].val = +(r * (0.8 + Math.random() * 0.4)).toFixed(VAR_META[v].d); }
  }
  const lei = chance(0.55) ? pick(caso.leis) : pick(Object.keys(LEIS));
  const porque = pick([
    "A pista do nosso posto aponta para isso e a âncora confirma.",
    "Lembramos que no exercício esse valor deveria ser outro, então algo mudou antes.",
    "Se fosse outro mecanismo, a saturação estaria diferente.",
    "O coração parece estar compensando alguma coisa que vem antes.",
  ]);
  return { mec, papel, lei, prev, porque };
}

export function passoBot(st, id, loc, dispatch) {
  const me = st.alunos[id];
  if (!me) return;
  const g = me.grupo ? st.grupos[me.grupo] : null;
  const r = st.resp[id];
  switch (st.fase) {
    case "grupos": if (g && !g.achou[id] && chance(0.3)) dispatch({ t: "achei", id }); break;
    case "lider":
      if (!g || g.lider) break;
      if (!g.metodo && !g.metodoVotos[id] && chance(0.3)) dispatch({ t: "metodo", id, m: chance(0.6) ? "votar" : "sorteio" });
      else if (g.metodo === "votar" && !g.votos[id] && chance(0.3)) dispatch({ t: "votoLider", id, alvo: pick(g.membros.filter((m) => m !== id)) });
      break;
    case "viagem": {
      const prox = PARADAS.find((p) => r.viagem.r[p.id] == null);
      if (!prox || !chance(0.35)) break;
      loc.parada = PARADAS.indexOf(prox);
      if (r.viagem.mochila.length < 3 && chance(0.3)) {
        const v = pick(prox.valores);
        if (!r.viagem.mochila.some((x) => x.v === v)) dispatch({ t: "mochila", id, v, valor: `${fmtVar(v, VREP[v])} → ${fmtVar(v, VEX[v])}${VAR_META[v].unit ? " " + VAR_META[v].unit : ""}`, cond: "repouso → exercício" });
      }
      const op = chance(0.72) ? prox.pergunta.certa : pick([0, 1, 2]);
      dispatch({ t: "viagemResp", id, parada: prox.id, op });
      break;
    }
    case "posto":
      if (!r.posto && chance(0.25)) { const d = hipoteseBot(st, g); loc.posto = d; dispatch({ t: "postoInd", id, dados: d }); }
      else if (g && g.lider === id && r.posto && !g.h1) {
        const todos = g.membros.map((m) => st.resp[m].posto).filter(Boolean);
        if (todos.length === g.membros.length || chance(0.08)) {
          const conta = (k) => { const c = {}; todos.forEach((t) => (c[t[k]] = (c[t[k]] || 0) + 1)); return Object.entries(c).sort((a, b) => b[1] - a[1])[0][0]; };
          dispatch({ t: "h1", id, dados: { ...r.posto, mec: conta("mec"), papel: conta("papel") } });
        }
      }
      break;
    case "telegrafo":
      if (g && g.lider === id && !g.bilhete && chance(0.25)) {
        const outros = Object.values(st.grupos).filter((x) => x.id !== g.id);
        if (!outros.length) break;
        const para = pick(outros);
        const caso = casoById(st.casoId);
        dispatch({ t: "bilhete", id, para: para.id, texto: `Daqui do ${POSTOS.find((p) => p.id === g.posto).curto}: ${caso.postos[g.posto].pista.slice(0, 100)}` });
      }
      break;
    case "laboratorio":
      if (g && g.lider === id && !g.h2 && chance(0.2)) {
        const caso = casoById(st.casoId);
        if (!g.h1) { const d = hipoteseBot(st, g, 0.2); dispatch({ t: "h2", id, dados: { decisao: "ajusta", mec: d.mec, papel: d.papel, porque: "Decidimos direto no laboratório." } }); break; }
        const ok = caso.aceitos.includes(g.h1?.mec);
        const troca = !ok && chance(0.65);
        dispatch({ t: "h2", id, dados: {
          decisao: ok ? "mantem" : troca ? "abandona" : "mantem",
          mec: troca ? caso.mecanismo : g.h1?.mec,
          papel: chance(0.75) ? caso.postos[g.posto].papel : g.h1?.papel,
          porque: troca ? "No laboratório o nosso mecanismo não reproduziu o observado; o outro reproduziu." : "Os valores reais bateram com o que prevíamos.",
        } });
      }
      break;
    case "integracao":
      if (!r.saida && chance(0.2)) dispatch({ t: "saida", id, texto: pick(["Lembrava que a saturação normal garantia oxigênio, e não é bem assim.", "Errei a direção do volume sistólico, e isso mudou tudo na explicação.", "Lembrava os valores certos, mas não tinha ligado com a lei de Fick.", "Achei que o pulmão era sempre o culpado."]) });
      break;
    default: break;
  }
}
