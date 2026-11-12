// Motor da sala: estado único + redutor puro. O "cérebro" roda num só lugar (no /simulador, na própria página;
// na sala real, no celular do professor), que aplica as ações e publica o estado.
import { POSTOS, MECANISMOS, PARADAS } from "./content/viagem.js";
import { casoById, paramsDoCaso } from "./content/casos.js";
import { compute, sameBand, direction } from "./model.js";

export const FASES = [
  { id: "entrada", nome: "Entrada" },
  { id: "grupos", nome: "Grupos" },
  { id: "lider", nome: "Líder" },
  { id: "viagem", nome: "Viagem" },
  { id: "caso", nome: "Caso" },
  { id: "posto", nome: "Posto" },
  { id: "telegrafo", nome: "Telégrafo" },
  { id: "laboratorio", nome: "Laboratório" },
  { id: "desfecho", nome: "Desfecho" },
  { id: "linhas", nome: "Linhas do tempo" },
  { id: "integracao", nome: "Integração" },
];

export const CORES_GRUPO = [
  { nome: "Celeste", hex: "#38bdf8" }, { nome: "Rubi", hex: "#f43f5e" }, { nome: "Âmbar", hex: "#f59e0b" },
  { nome: "Esmeralda", hex: "#10b981" }, { nome: "Violeta", hex: "#8b5cf6" }, { nome: "Coral", hex: "#fb7185" },
  { nome: "Índigo", hex: "#6366f1" },
];

export function estadoInicial(casoId = "B1") {
  return { v: 0, fase: "entrada", casoId, alunos: {}, grupos: {}, ordem: [], resp: {}, spot: null, log: [] };
}

function rnd(seed) {
  let s = seed >>> 0;
  return () => { s = (s + 0x6d2b79f5) >>> 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

export function nGrupos(n) { return Math.max(1, Math.min(7, Math.floor(n / 3))); }

// Postos escolhidos para o número de grupos: primeiro os que importam no caso.
export function postosParaCaso(casoId, n) {
  const caso = casoById(casoId);
  const peso = { origem: 0, compensa: 1, consequencia: 2, normal: 3 };
  return [...POSTOS].sort((a, b) => peso[caso.postos[a.id].papel] - peso[caso.postos[b.id].papel] || POSTOS.indexOf(a) - POSTOS.indexOf(b))
    .slice(0, n).sort((a, b) => POSTOS.indexOf(a) - POSTOS.indexOf(b)).map((p) => p.id);
}

function sortearLider(g, rand) {
  const cand = g.membros;
  if (g.metodo === "votar") {
    const cont = {};
    for (const alvo of Object.values(g.votos)) cont[alvo] = (cont[alvo] || 0) + 1;
    const max = Math.max(0, ...Object.values(cont));
    const top = cand.filter((id) => (cont[id] || 0) === max);
    return top[Math.floor(rand() * top.length)];
  }
  return cand[Math.floor(rand() * cand.length)];
}

function metodoDoGrupo(g) {
  const vals = g.membros.map((id) => g.metodoVotos[id]).filter(Boolean);
  const v = vals.filter((x) => x === "votar").length, s = vals.filter((x) => x === "sorteio").length;
  if (v === s) return "sorteio";
  return v > s ? "votar" : "sorteio";
}

export function reduzir(st, a) {
  const s = structuredClone(st);
  s.v += 1;
  const r = rnd(s.v * 7919 + 13);
  const aluno = a.id ? s.alunos[a.id] : null;
  const grupo = aluno?.grupo ? s.grupos[aluno.grupo] : null;
  switch (a.t) {
    case "caso": if (s.fase === "entrada") s.casoId = a.casoId; break;
    case "entrar": {
      if (s.fase !== "entrada" || s.alunos[a.id]) break;
      s.alunos[a.id] = { id: a.id, nome: a.nome.trim().slice(0, 24), grupo: null };
      s.ordem.push(a.id);
      s.resp[a.id] = { viagem: { r: {}, mochila: [] }, posto: null, saida: "" };
      break;
    }
    case "sortear": {
      if (s.fase !== "entrada" || s.ordem.length < 1) break;
      const ids = [...s.ordem];
      for (let i = ids.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [ids[i], ids[j]] = [ids[j], ids[i]]; }
      const n = nGrupos(ids.length);
      const postos = postosParaCaso(s.casoId, n);
      s.grupos = {};
      postos.forEach((pid, i) => {
        s.grupos[`g${i}`] = { id: `g${i}`, i, posto: pid, cor: CORES_GRUPO[i], membros: [], achou: {}, metodoVotos: {}, metodo: null, votos: {}, lider: null, h1: null, bilhete: null, h2: null };
      });
      ids.forEach((id, k) => { const g = s.grupos[`g${k % n}`]; g.membros.push(id); s.alunos[id].grupo = g.id; });
      s.fase = "grupos";
      break;
    }
    case "achei": if (grupo && s.fase === "grupos") grupo.achou[a.id] = true; break;
    case "metodo": {
      if (!grupo || s.fase !== "lider" || grupo.lider) break;
      grupo.metodoVotos[a.id] = a.m;
      if (grupo.membros.every((m) => grupo.metodoVotos[m])) {
        grupo.metodo = metodoDoGrupo(grupo);
        if (grupo.metodo === "sorteio" || grupo.membros.length === 1) grupo.lider = sortearLider(grupo, r);
      }
      break;
    }
    case "votoLider": {
      if (!grupo || grupo.metodo !== "votar" || grupo.lider || a.alvo === a.id || !grupo.membros.includes(a.alvo)) break;
      grupo.votos[a.id] = a.alvo;
      if (grupo.membros.every((m) => grupo.votos[m])) grupo.lider = sortearLider(grupo, r);
      break;
    }
    case "viagemResp": if (s.fase === "viagem") s.resp[a.id].viagem.r[a.parada] = a.op; break;
    case "mochila": {
      if (s.fase !== "viagem") break;
      const m = s.resp[a.id].viagem.mochila;
      const k = m.findIndex((x) => x.v === a.v);
      if (k >= 0) m.splice(k, 1); else if (m.length < 3) m.push({ v: a.v, valor: a.valor, cond: a.cond });
      break;
    }
    case "postoInd": if (s.fase === "posto") s.resp[a.id].posto = a.dados; break;
    case "h1": if (grupo && grupo.lider === a.id && s.fase === "posto") grupo.h1 = a.dados; break;
    case "bilhete": if (grupo && grupo.lider === a.id && s.fase === "telegrafo" && a.para !== grupo.id) grupo.bilhete = { para: a.para, texto: a.texto.slice(0, 140) }; break;
    case "h2": if (grupo && grupo.lider === a.id && s.fase === "laboratorio") grupo.h2 = a.dados; break;
    case "saida": if (s.fase === "integracao") s.resp[a.id].saida = a.texto.slice(0, 280); break;
    case "fase": {
      const k = FASES.findIndex((f) => f.id === s.fase);
      const alvo = a.dir === 1 ? FASES[k + 1] : FASES[k - 1];
      if (!alvo || (s.fase === "entrada" && a.dir === 1)) break; // da entrada só se sai sorteando
      if (alvo.id === "entrada") break;
      if (s.fase === "lider" && a.dir === 1) {
        // quem não definiu líder até aqui: sistema sorteia
        for (const g of Object.values(s.grupos)) if (!g.lider) { g.metodo = g.metodo || "sorteio"; g.lider = sortearLider(g, r); }
      }
      s.fase = alvo.id;
      if (s.fase === "linhas") s.spot = Object.keys(s.grupos)[0] || null;
      break;
    }
    case "spot": s.spot = a.g; break;
    default: break;
  }
  return s;
}

// ---------- Seletores pedagógicos ----------

const cache = new Map();
export function valoresDoCaso(casoId) {
  if (!cache.has(casoId)) {
    const p = paramsDoCaso(casoId);
    cache.set(casoId, { base: compute(p.base), real: compute(p.real) });
  }
  return cache.get(casoId);
}

export function contrafactual(casoId, mecId) {
  const k = `${casoId}:${mecId}`;
  if (!cache.has(k)) {
    const mec = MECANISMOS.find((m) => m.id === mecId);
    cache.set(k, compute(mec.aplica(paramsDoCaso(casoId).base)));
  }
  return cache.get(k);
}

// Placar memória × valores: direção e faixa de cada previsão do posto.
export function placar(casoId, postoId, prev) {
  const { base, real } = valoresDoCaso(casoId);
  const posto = POSTOS.find((p) => p.id === postoId);
  return posto.vars.map((v) => {
    const p = prev?.[v] || {};
    const dirReal = direction(v, base[v], real[v]);
    const num = typeof p.val === "number" && !Number.isNaN(p.val);
    return { v, dirPrev: p.dir || null, dirReal, dirOk: p.dir === dirReal, val: num ? p.val : null, faixaOk: num ? sameBand(v, p.val, real[v]) : false, base: base[v], real: real[v] };
  });
}

export function acertoViagem(resp) {
  const r = resp?.viagem?.r || {};
  let ok = 0, tot = 0;
  for (const p of PARADAS) if (r[p.id] != null) { tot++; if (r[p.id] === p.pergunta.certa) ok++; }
  return { ok, tot };
}

export function resumoGrupo(st, g) {
  const caso = casoById(st.casoId);
  const gab = caso.postos[g.posto];
  const certo = (h) => h && caso.aceitos.includes(h.mec);
  return {
    gab,
    h1Ok: certo(g.h1), h2Ok: certo(g.h2 ? { mec: g.h2.mec } : null),
    papel1Ok: g.h1?.papel === gab.papel, papel2Ok: g.h2?.papel === gab.papel,
    revisao: !g.h1 || !g.h2 ? null : g.h1.mec === g.h2.mec ? "manteve" : "mudou",
  };
}

export function progresso(st) {
  const ids = st.ordem;
  const gs = Object.values(st.grupos);
  switch (st.fase) {
    case "entrada": return { feito: ids.length, total: ids.length, rot: "entraram" };
    case "grupos": { const f = gs.reduce((n, g) => n + Object.keys(g.achou).length, 0); return { feito: f, total: ids.length, rot: "acharam o grupo" }; }
    case "lider": return { feito: gs.filter((g) => g.lider).length, total: gs.length, rot: "grupos com líder" };
    case "viagem": { const f = ids.filter((id) => Object.keys(st.resp[id].viagem.r).length === PARADAS.length).length; return { feito: f, total: ids.length, rot: "terminaram a viagem" }; }
    case "posto": return { feito: gs.filter((g) => g.h1).length, total: gs.length, rot: "equipes enviaram", ind: ids.filter((id) => st.resp[id].posto).length, indTot: ids.length };
    case "telegrafo": return gs.length < 2 ? null : { feito: gs.filter((g) => g.bilhete).length, total: gs.length, rot: "bilhetes enviados" };
    case "laboratorio": return { feito: gs.filter((g) => g.h2).length, total: gs.length, rot: "equipes decidiram" };
    case "integracao": return { feito: ids.filter((id) => st.resp[id].saida).length, total: ids.length, rot: "bilhetes de saída" };
    default: return null;
  }
}
