// Motor da sala da Ética: estado único + redutor puro (mesma casca da Viagem do O₂).
import { PAPEIS, FOTOS, ALTERNATIVAS, DIMENSOES, sortearPersonagens } from "./content/cena.js";
import { PARADAS } from "./content/roteiro.js";

export const FASES = [
  { id: "entrada", nome: "Entrada" },
  { id: "grupos", nome: "Grupos" },
  { id: "lider", nome: "Líder" },
  { id: "viagem", nome: "Viagem pelo roteiro" },
  { id: "cena", nome: "A cena" },
  { id: "posto", nome: "Posto" },
  { id: "canais", nome: "Canais" },
  { id: "laboratorio", nome: "Laboratório de decisões" },
  { id: "confronto", nome: "Confronto 360°" },
  { id: "linhas", nome: "Duas semanas depois" },
  { id: "integracao", nome: "Integração" },
];

export function estadoInicial() {
  return { v: 0, fase: "entrada", pers: null, alunos: {}, grupos: {}, ordem: [], resp: {}, spot: null, foco: null };
}

function rnd(seed) {
  let s = seed >>> 0;
  return () => { s = (s + 0x6d2b79f5) >>> 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

export function nGrupos(n) { return Math.max(1, Math.min(PAPEIS.length, Math.floor(n / 3))); }
export function papeisParaTurma(n) { return [...PAPEIS].sort((a, b) => a.prioridade - b.prioridade).slice(0, nGrupos(n)); }
export const papelById = (id) => PAPEIS.find((p) => p.id === id);
export const grupoDoPapel = (st, pid) => Object.values(st.grupos).find((g) => g.papel === pid);

// Para quem vai o relato de um grupo: o papel de destino, ou o próximo presente na ordem de prioridade.
export function destinoRelato(st, g) {
  const p = papelById(g.papel);
  const alvo = grupoDoPapel(st, p.enviaPara);
  if (alvo && alvo.id !== g.id) return alvo.id;
  const outros = Object.values(st.grupos).filter((x) => x.id !== g.id).sort((a, b) => papelById(a.papel).prioridade - papelById(b.papel).prioridade);
  return outros[0]?.id || null;
}

function sortearLider(g, rand) {
  if (g.metodo === "votar") {
    const cont = {};
    for (const alvo of Object.values(g.votos)) cont[alvo] = (cont[alvo] || 0) + 1;
    const max = Math.max(0, ...Object.values(cont));
    const top = g.membros.filter((id) => (cont[id] || 0) === max);
    return top[Math.floor(rand() * top.length)];
  }
  return g.membros[Math.floor(rand() * g.membros.length)];
}

export function reduzir(st, a) {
  const s = structuredClone(st);
  s.v += 1;
  const r = rnd(s.v * 7919 + 101);
  const aluno = a.id ? s.alunos[a.id] : null;
  const g = aluno?.grupo ? s.grupos[aluno.grupo] : null;
  const lider = g && g.lider === a.id;
  switch (a.t) {
    case "entrar":
      if (s.fase !== "entrada" || s.alunos[a.id]) break;
      s.alunos[a.id] = { id: a.id, nome: a.nome.trim().slice(0, 24), grupo: null };
      s.ordem.push(a.id);
      s.resp[a.id] = { viagem: { r: {}, mochila: [] }, posto: null, saida: "" };
      break;
    case "sortear": {
      if (s.fase !== "entrada" || !s.ordem.length) break;
      s.pers = sortearPersonagens(rnd((a.seed ?? Date.now()) >>> 0));
      const ids = [...s.ordem];
      for (let i = ids.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [ids[i], ids[j]] = [ids[j], ids[i]]; }
      const papeis = papeisParaTurma(ids.length);
      s.grupos = {};
      papeis.forEach((p, i) => { s.grupos[`g${i}`] = { id: `g${i}`, i, papel: p.id, membros: [], achou: {}, metodoVotos: {}, metodo: null, votos: {}, lider: null, fotoDe: {}, h1: null, relato: null, h2: null, ciente: false }; });
      ids.forEach((id, k) => {
        const gg = s.grupos[`g${k % papeis.length}`];
        const fotos = papelById(gg.papel).fotos;
        gg.fotoDe[id] = fotos[gg.membros.length % fotos.length];
        gg.membros.push(id); s.alunos[id].grupo = gg.id;
      });
      s.fase = "grupos";
      break;
    }
    case "achei": if (g && s.fase === "grupos") g.achou[a.id] = true; break;
    case "metodo":
      if (!g || s.fase !== "lider" || g.lider || g.metodo) break;
      g.metodoVotos[a.id] = a.m;
      if (g.membros.every((m) => g.metodoVotos[m])) {
        const v = Object.values(g.metodoVotos).filter((x) => x === "votar").length;
        g.metodo = v * 2 > g.membros.length ? "votar" : "sorteio";
        if (g.metodo === "sorteio" || g.membros.length === 1) g.lider = sortearLider(g, r);
      }
      break;
    case "votoLider":
      if (!g || g.metodo !== "votar" || g.lider || a.alvo === a.id || !g.membros.includes(a.alvo)) break;
      g.votos[a.id] = a.alvo;
      if (g.membros.every((m) => g.votos[m])) g.lider = sortearLider(g, r);
      break;
    case "viagemResp": if (s.fase === "viagem") s.resp[a.id].viagem.r[a.parada] = a.op; break;
    case "mochila": {
      if (s.fase !== "viagem") break;
      const m = s.resp[a.id].viagem.mochila;
      const k = m.indexOf(a.carta);
      if (k >= 0) m.splice(k, 1); else if (m.length < 3) m.push(a.carta);
      break;
    }
    case "postoInd": if (s.fase === "posto") s.resp[a.id].posto = a.dados; break;
    case "h1": if (lider && s.fase === "posto") { g.h1 = a.dados; g.relato = a.relato; } break;
    case "ciente": if (lider && s.fase === "canais") g.ciente = true; break;
    case "h2": if (lider && s.fase === "laboratorio") g.h2 = a.dados; break;
    case "saida": if (s.fase === "integracao") s.resp[a.id].saida = a.texto.slice(0, 280); break;
    case "fase": {
      const k = FASES.findIndex((f) => f.id === s.fase);
      const alvo = FASES[k + a.dir];
      if (!alvo || alvo.id === "entrada" || (s.fase === "entrada" && a.dir === 1)) break;
      if (s.fase === "lider" && a.dir === 1) for (const gg of Object.values(s.grupos)) if (!gg.lider) { gg.metodo = gg.metodo || "sorteio"; gg.lider = sortearLider(gg, r); }
      s.fase = alvo.id;
      if (s.fase === "linhas") s.spot = Object.keys(s.grupos)[0] || null;
      if (s.fase === "confronto") s.foco = null;
      break;
    }
    case "spot": s.spot = a.g; break;
    case "foco": s.foco = a.foto; break;
    default: break;
  }
  return s;
}

// ---------- Seletores ----------

export function fotosDoGrupo(g) { return papelById(g.papel).fotos; }

// Acerto na separação fato / interpretação / incerteza.
export function placarClassificacao(classif) {
  let ok = 0, tot = 0, interpComoFato = 0;
  for (const [chave, valor] of Object.entries(classif || {})) {
    const [fid, idx] = chave.split(":");
    const fr = FOTOS[fid]?.frases[+idx];
    if (!fr) continue;
    tot++;
    if (fr.tag === valor) ok++;
    if (valor === "fato" && fr.tag !== "fato") interpComoFato++;
  }
  return { ok, tot, interpComoFato };
}

// Frases do relato que eram interpretação/incerteza enviadas como "o que vimos".
export function contaminacao(st, g) {
  const rel = g.relato;
  if (!rel) return [];
  return (rel.vimos || []).map((k) => { const [fid, idx] = k.split(":"); return { k, fr: FOTOS[fid].frases[+idx] }; }).filter((x) => x.fr.tag !== "fato");
}

// Corrente: relato contaminado → decisão do grupo que recebeu atingindo a mesma pessoa.
export function corrente(st) {
  const elos = [];
  for (const g of Object.values(st.grupos)) {
    const para = destinoRelato(st, g);
    if (!para || !g.relato) continue;
    const dest = st.grupos[para];
    const contam = contaminacao(st, g);
    const acoes = (dest.h2?.acoes || []).map((id) => ALTERNATIVAS[dest.papel].find((x) => x.id === id)).filter(Boolean);
    for (const c of contam) {
      const atingida = acoes.find((ac) => ac.alvo && (c.fr.sobre || []).includes(ac.alvo));
      elos.push({ de: g.id, para, frase: c.fr, acao: atingida || null });
    }
  }
  return elos;
}

// "Duas semanas depois": soma os efeitos das ações finais de todos os papéis.
export function desfecho(st, soGrupo = null) {
  const val = {};
  for (const [k, d] of Object.entries(DIMENSOES)) val[k] = d.inicio;
  const gs = soGrupo ? [soGrupo] : Object.values(st.grupos);
  for (const g of gs) {
    const ids = g.h2?.acoes?.length ? g.h2.acoes : g.h1?.acao ? [g.h1.acao] : [];
    for (const id of ids) {
      const alt = ALTERNATIVAS[g.papel].find((x) => x.id === id);
      for (const [k, v] of Object.entries(alt?.ef || {})) val[k] += v;
    }
  }
  const res = {};
  for (const [k, d] of Object.entries(DIMENSOES)) {
    const v = val[k];
    let estado;
    if (k === "processo") estado = v >= 1 ? "bem" : v === 0 ? "neutro" : "mal";
    else estado = v <= d.limite ? "bem" : "mal";
    res[k] = { v, estado };
  }
  return res;
}

export function acertoViagem(resp) {
  const r = resp?.viagem?.r || {};
  let ok = 0, tot = 0;
  for (const p of PARADAS) if (r[p.id] != null) { tot++; if (r[p.id] === p.pergunta.certa) ok++; }
  return { ok, tot };
}

export function progresso(st) {
  const ids = st.ordem, gs = Object.values(st.grupos);
  switch (st.fase) {
    case "entrada": return { feito: ids.length, total: ids.length, rot: "entraram" };
    case "grupos": return { feito: gs.reduce((n, g) => n + Object.keys(g.achou).length, 0), total: ids.length, rot: "acharam o grupo" };
    case "lider": return { feito: gs.filter((g) => g.lider).length, total: gs.length, rot: "grupos com líder" };
    case "viagem": return { feito: ids.filter((id) => Object.keys(st.resp[id].viagem.r).length === PARADAS.length).length, total: ids.length, rot: "terminaram a viagem" };
    case "posto": return { feito: gs.filter((g) => g.h1).length, total: gs.length, rot: "papéis enviaram", ind: ids.filter((id) => st.resp[id].posto).length, indTot: ids.length };
    case "canais": return { feito: gs.filter((g) => g.ciente).length, total: gs.length, rot: "leram os relatos" };
    case "laboratorio": return { feito: gs.filter((g) => g.h2).length, total: gs.length, rot: "papéis decidiram" };
    case "integracao": return { feito: ids.filter((id) => st.resp[id].saida).length, total: ids.length, rot: "bilhetes de saída" };
    default: return null;
  }
}
