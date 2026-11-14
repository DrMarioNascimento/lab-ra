import { EXEMPLO_DO_ANO } from "./content/vila.js";
// Participantes simulados (piloto automático) do /simulador do Mosaico Vila.
// A política é a mesma da simulação em Python (vila_regras.py · proposta), com os tipos de
// Fischbacher, Gächter e Fehr (2001): 50% cooperam de forma condicional, 30% são caronas, 20% outros.

export const NOMES = ["Ana", "Bruno", "Camila", "Diego", "Eduarda", "Felipe", "Gabriela", "Heitor", "Isabela", "João", "Larissa", "Mateus", "Natália", "Otávio", "Paula", "Rafaela", "Sofia", "Tiago", "Valentina", "Yuri", "Beatriz", "Caio", "Débora", "Enzo", "Fernanda", "Gustavo", "Helena", "Igor", "Júlia", "Kaio", "Lívia", "Murilo", "Nicole", "Pedro", "Quésia", "Renan", "Sabrina", "Thiago", "Vitória", "Wesley"];
const chance = (p) => Math.random() < p;
const unif = (a, b) => a + Math.random() * (b - a);
const clip = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));

export function perfilBot(i) {
  const u = ((i * 2654435761) >>> 0) / 4294967296;
  const tipo = u < 0.5 ? "CC" : u < 0.8 ? "FR" : "OT";
  const hh = clip((tipo === "FR" ? 2.8 : 3.3) + (((i * 40503) % 97) / 97 - 0.5) * 1.6, 1, 5);
  const uni = ((i * 7919) % 101) / 101;
  return { tipo, hh, uni };
}

export function propostaBot(perfil, fm, ano, regra) {
  let pub, rep, car;
  if (perfil.tipo === "CC") { pub = unif(15, 35); rep = ano >= 2 ? (fm < 0.55 ? 12 : 4) : 0; car = ano >= 2 ? (fm > 0.45 ? 1 : 0) : 0; }
  else if (perfil.tipo === "FR") { pub = unif(0, 6); rep = 0; car = ano >= 2 ? (fm > 0.3 ? 3 : 2) : 0; }
  else { pub = unif(0, 25); rep = ano >= 2 ? unif(0, 8) + (fm < 0.4 ? 8 : 0) : 0; car = ano >= 2 ? Math.floor(unif(0, 3)) : 0; }
  if (regra === "prosperidade" && perfil.tipo !== "FR") pub += 5;
  return { pub: Math.round(pub), rep: Math.round(rep), car };
}

export function passoBot(st, id, loc, dispatch) {
  const me = st.alunos[id];
  if (!me) return;
  const pf = loc.perfil;
  const fam = me.fam ? st.fams[me.fam] : null;
  switch (st.fase) {
    case "familias": if (!me.achou && chance(0.35)) dispatch({ t: "achei", id }); break;
    case "decidir": {
      const p = st.props[st.ano]?.[id];
      if (!p || p.auto) { if (chance(0.25)) dispatch({ t: "propor", id, p: propostaBot(pf, st.mata / st.teto, st.ano, st.regra) }); }
      else if (st.ano >= 2 && st.previsao[st.ano]?.[id] == null && chance(0.4)) dispatch({ t: "prever", id, v: pf.tipo === "FR" ? "sobe" : chance(0.6) ? "desce" : "fica" });
      break;
    }
    case "mente": {
      if (st.mente[id] != null || !chance(0.35)) break;
      const face = 1 + Math.floor(Math.random() * 6);
      const acerto = Math.random() < 1 / 6;
      const mente = clip(0.1 + 0.14 * (3.4 - pf.hh) + 0.08, 0, 0.7);
      dispatch({ t: "mente", id, face, acertei: acerto || Math.random() < mente });
      break;
    }
    case "abertura": {
      const ex = EXEMPLO_DO_ANO[st.ano];
      if (ex && st.controle?.[st.ano]?.[id] == null && chance(0.35)) dispatch({ t: "controle", id, op: Math.random() < 0.85 ? ex.certa : (ex.certa + 1) % ex.opcoes.length });
      break;
    }
    case "lances": {
      const p = st.props[st.ano]?.[id];
      if ((!p || !p.lanceEnviado) && chance(0.3)) dispatch({ t: "lance", id, v: unif(0.2, 0.6) });
      else if (p?.lanceEnviado && st.palpite?.[st.ano]?.[id] == null && chance(0.3)) dispatch({ t: "palpite", id, v: ["até 20", "21 a 40", "mais de 40"][Math.floor(Math.random() * 3)] });
      break;
    }
    case "alvara": if (st.alvara.votos[id] == null && chance(0.3)) dispatch({ t: "alvara", id, aceita: Math.random() < clip(0.5 + (3.1 - pf.hh) * 0.25) }); break;
    case "voto": {
      if (st.controle?.voto?.[id] == null && chance(0.4)) { dispatch({ t: "controle", id, op: Math.random() < 0.85 ? 1 : 0 }); break; }
      if (st.voto[id] != null || !chance(0.35)) break;
      const caixas = Object.values(st.fams).map((f) => f.caixa).sort((a, b) => a - b);
      const pobre = fam && fam.caixa <= caixas[Math.floor(caixas.length / 2) - (caixas.length % 2 ? 0 : 1)];
      const pr = 0.35 + (pobre ? 0.35 : -0.1) + 0.3 * (pf.uni - 0.5) + (pf.tipo === "CC" ? 0.15 : -0.1);
      dispatch({ t: "voto", id, trocar: Math.random() < clip(pr) });
      break;
    }
    case "fechamento": if (!st.final[id] && chance(0.3)) dispatch({ t: "final", id, guia: ["Impulso", "Emoção", "Razão"][Math.floor(Math.random() * 3)], motivo: ["Ganho", "Carreira", "Relações", "O que é certo", "Como me vejo"][Math.floor(Math.random() * 5)] }); break;
    default: break;
  }
}

// Papel diante do bullying (Salmivalli): não é usado na Vila (o módulo "Quem Defende?" fica fora dela), mantido para o simulador.
export function papelBully(i) { const u = ((i * 2246822519) >>> 0) / 4294967296; return u < 0.2 ? "reforco" : u < 0.65 ? "fora" : u < 0.85 ? "defensor" : "indeciso"; }
