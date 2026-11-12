// Alunos simulados (piloto automático) para o /simulador da Ética.
import { PARADAS } from "./content/roteiro.js";
import { FOTOS, FORA, CARTAS, ALTERNATIVAS, PAPEIS } from "./content/cena.js";
import { papelById, fotosDoGrupo } from "./engine.js";

export const NOMES = ["Ana", "Bruno", "Camila", "Diego", "Eduarda", "Felipe", "Gabriela", "Heitor", "Isabela", "João", "Larissa", "Mateus", "Natália", "Otávio", "Paula", "Rafaela", "Sofia", "Tiago", "Valentina", "Yuri", "Beatriz", "Caio", "Débora", "Enzo", "Fernanda", "Gustavo", "Helena", "Igor", "Júlia", "Kaio", "Lívia", "Murilo", "Nicole", "Pedro", "Quésia", "Renan", "Sabrina", "Thiago", "Vitória", "Wesley"];
const pick = (a) => a[Math.floor(Math.random() * a.length)];
const chance = (p) => Math.random() < p;
const TAGS = ["fato", "interp", "incerto"];

function classificar(fids, acerto = 0.65) {
  const c = {};
  for (const fid of fids) FOTOS[fid].frases.forEach((fr, i) => { c[`${fid}:${i}`] = chance(acerto) ? fr.tag : pick(TAGS); });
  return c;
}

function respostaBot(st, g, fids, cartasDisponiveis) {
  const p = papelById(g.papel);
  const pes = [...new Set(fids.flatMap((f) => FOTOS[f].pessoas))];
  const alts = ALTERNATIVAS[p.id];
  const vulner = pes.filter((x) => (x === "kaua" && chance(0.7)) || (x === "lara" && chance(0.6)) || (x === "bia" && chance(0.25)) || (x === "joaquim" && chance(0.3)) || (x === "turma" && chance(0.3)));
  return {
    classif: classificar(fids),
    vejo: pes,
    fora: FORA.filter(() => chance(0.35)).map((f) => f.id),
    vulner,
    vulnerFora: FORA.filter((f) => (f.id === "defesa" && chance(0.3)) || (f.id === "familia" && chance(0.4))).map((f) => f.id),
    poder: pick(["A direção e o técnico mandam no time.", "A professora regente tem poder sobre a estagiária.", "A escola tem poder sobre os alunos menores de idade."]),
    deveres: Object.keys(CARTAS).filter((k) => ["informacao", "vigilancia", "sigilo", "salvaguardas", "naoMaleficencia", "justica"].includes(k) && chance(0.4)),
    papel: chance(0.55) ? pick(p.gabarito) : pick(["pode_proteger", "contribui", "afetado", "testemunha"]),
    prev: { kaua: chance(0.7) ? "piora" : pick(["igual", "melhora"]), bia: pick(["piora", "igual"]), lara: chance(0.6) ? "piora" : "igual" },
    acao: chance(0.6) ? alts[Math.floor(Math.random() * 2)].id : pick(alts).id,
    cartas: cartasDisponiveis.filter(() => chance(0.6)).slice(0, 2),
    porque: pick(["Pelo que vejo, alguém pode sair prejudicado se ninguém fizer nada.", "Não temos certeza do que acontece, então é melhor apurar antes de acusar.", "Há um menor envolvido e isso pede cuidado redobrado.", "Não é nossa função resolver, mas é nosso dever avisar quem pode."]),
  };
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
      const prox = PARADAS.find((pa) => r.viagem.r[pa.id] == null);
      if (!prox) {
        if (r.viagem.mochila.length < 2) {
          const extra = PARADAS.flatMap((p) => p.cartas).find((c) => !r.viagem.mochila.includes(c));
          if (extra) dispatch({ t: "mochila", id, carta: extra });
        }
        if (!r.viagem.concluida) dispatch({ t: "concluirViagem", id });
        break;
      }
      if (!chance(0.35)) break;
      loc.parada = PARADAS.indexOf(prox);
      if (r.viagem.mochila.length < 3 && chance(0.45)) { const c = pick(prox.cartas); if (!r.viagem.mochila.includes(c)) dispatch({ t: "mochila", id, carta: c }); }
      dispatch({ t: "viagemResp", id, parada: prox.id, op: chance(0.72) ? prox.pergunta.certa : pick([0, 1, 2]) });
      break;
    }
    case "posto":
      if (!r.posto && chance(0.22)) { const d = respostaBot(st, g, [g.fotoDe[id]], r.viagem.mochila); loc.ind = d; dispatch({ t: "postoInd", id, dados: d }); }
      else if (g && g.lider === id && r.posto && !g.h1) {
        const todos = g.membros.map((m) => st.resp[m].posto).filter(Boolean);
        if (todos.length < g.membros.length && !chance(0.06)) break;
        const fids = fotosDoGrupo(g);
        const mais = (k) => { const c = {}; todos.forEach((t) => (c[t[k]] = (c[t[k]] || 0) + 1)); return Object.entries(c).sort((a, b) => b[1] - a[1])[0][0]; };
        const cartas = [...new Set(g.membros.flatMap((m) => st.resp[m].viagem.mochila))];
        const base = respostaBot(st, g, fids, cartas);
        const classif = classificar(fids, 0.72);
        const frases = fids.flatMap((fid) => FOTOS[fid].frases.map((fr, i) => ({ k: `${fid}:${i}`, fr })));
        const vimos = [];
        for (const f of frases.sort(() => Math.random() - 0.5)) { if (vimos.length >= 3) break; if (f.fr.tag === "fato" ? chance(0.6) : f.fr.tag === "interp" ? chance(0.35) : false) vimos.push(f.k); }
        if (!vimos.length) vimos.push(frases[0].k);
        dispatch({ t: "h1", id, dados: { ...base, classif, acao: mais("acao"), papel: mais("papel"), cartas: cartas.slice(0, 2) }, relato: { vimos, naoSabemos: pick(["Não sabemos o que tem no envelope.", "Não sabemos de quem é o pote.", "Não sabemos quem mandou a mensagem.", ""]), preocupa: pick(["O jovem de laranja: parece muito novo.", "A estagiária sozinha com as crianças.", "A professora pode ser exposta sem motivo.", "O patrocínio da loja junto com o time."]) } });
      }
      break;
    case "canais": if (g && g.lider === id && !g.ciente && chance(0.3)) dispatch({ t: "ciente", id }); break;
    case "laboratorio":
      if (g && g.lider === id && !g.h2 && chance(0.2)) {
        const alts = ALTERNATIVAS[g.papel];
        const acoes = [g.h1?.acao || alts[0].id];
        if (chance(0.55)) { const outra = pick(alts.slice(0, 3)).id; if (!acoes.includes(outra)) acoes.push(outra); }
        const troca = chance(0.3);
        if (troca) acoes[0] = alts[0].id;
        dispatch({ t: "h2", id, dados: { decisao: troca ? "abandona" : acoes.length > 1 ? "ajusta" : "mantem", acoes: [...new Set(acoes)], cartas: [...new Set(g.membros.flatMap((m) => st.resp[m].viagem.mochila))].slice(0, 2), porque: pick(["O relato que recebemos mudou o que achávamos.", "Vimos que sozinhos não resolvemos; somamos outra ação.", "Mantivemos: os efeitos simulados confirmaram a escolha."]) } });
      }
      break;
    case "integracao":
      if (!r.saida && chance(0.2)) dispatch({ t: "saida", id, texto: pick(["Achei que o envelope era venda, e era só uma impressão minha.", "Marquei como fato que o jovem usava hormônio, mas não dava para ver isso.", "Percebi que confiei demais no relato que recebemos.", "Não tinha pensado na estagiária e nas crianças como vulneráveis."]) });
      break;
    default: break;
  }
}
