// Mosaico Vila · motor da sala: estado único + redutor puro (mesma casca da Ângulos e da Viagem do O₂).
import { FAMILIAS, EVENTOS } from "./content/vila.js";
import {
  ANOS, LOTES, TETO_FAMILIA, MATA_INICIO, LIMITES, ANO_MERCADO, rendaDoAno, fecharAno, leilao, gini, vitoriaColetiva, lanceMinimo, patrimonio, contrafactual,
} from "./content/regras.js";

export function rnd(seed) {
  let s = seed >>> 0;
  return () => { s = (s + 0x6d2b79f5) >>> 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

// Sequência de fases: uma regra nova por ano (1 a 4); votação no fim do ano 3; alvará no ano 5; troco opcional no ano 4.
export function montarFases() {
  const f = [{ id: "entrada" }, { id: "familias" }];
  for (let ano = 1; ano <= ANOS; ano++) {
    f.push({ id: "abertura", ano }, { id: "decidir", ano });
    if (EVENTOS[ano]) f.push({ id: EVENTOS[ano].id, ano });
    if (ano >= ANO_MERCADO) f.push({ id: "lances", ano });
    f.push({ id: "resultado", ano });
    if (ano === 3) f.push({ id: "voto", ano });
  }
  f.push({ id: "fechamento" });
  return f;
}
export const FASES = montarFases();
export const NOME_FASE = {
  entrada: "Entrada", familias: "Famílias", abertura: "Renda do ano", decidir: "Decisões da família", mente: "O troco do mercado",
  lances: "Mercado de lotes", alvara: "O alvará",
  resultado: "Como ficou a vila", voto: "Que regra queremos?", fechamento: "Fechamento",
};

// 4 a 8 famílias a partir de 12 participantes (GDD); em turmas menores (só para testar), famílias de 3.
export function nFamilias(n) { return n >= 12 ? Math.max(4, Math.min(8, Math.floor(n / 4))) : Math.max(1, Math.floor(n / 3)); }

export function estadoInicial() {
  return {
    v: 0, k: 0, fase: "entrada", ano: 0, regra: "monopolio", alunos: {}, ordem: [], fams: {}, lotes: Array(LOTES).fill(null),
    mata: 0, teto: 0, publico: 0, acumulado: 0, colapsou: false, colapsouAlguma: false, renda: null, fechamento: null,
    props: {}, previsao: {}, mente: {}, dado: {}, alvara: { pessoa: null, votos: {}, aceito: null, aceitariam: null },
    voto: {}, votoTrocou: null, leilao: null, pessoal: {}, historico: [], final: {}, pulados: {},
    controle: {}, palpite: {}, semTroco: true,
  };
}

const famDe = (s, id) => s.fams[s.alunos[id]?.fam];

export function reduzir(st, a) {
  const s = structuredClone(st);
  s.v += 1;
  const r = rnd(s.v * 7919 + 101 + (s.seed || 0));
  const fase = FASES[s.k];
  switch (a.t) {
    case "entrar":
      if (s.fase !== "entrada" || s.alunos[a.id]) break;
      s.alunos[a.id] = { id: a.id, nome: String(a.nome).trim().slice(0, 24), fam: null, achou: false };
      s.ordem.push(a.id); s.pessoal[a.id] = 0;
      break;
    case "sortear": {
      if (s.fase !== "entrada" || s.ordem.length < 4) break;
      s.seed = (a.seed ?? 1) >>> 0;
      const rr = rnd(s.seed);
      const ids = [...s.ordem];
      for (let i = ids.length - 1; i > 0; i--) { const j = Math.floor(rr() * (i + 1)); [ids[i], ids[j]] = [ids[j], ids[i]]; }
      const nf = nFamilias(ids.length);
      s.fams = {};
      for (let i = 0; i < nf; i++) s.fams[`f${i}`] = { id: `f${i}`, i, ...FAMILIAS[i], membros: [], lotes: 1, caixa: 0, caixa0: 0 };
      ids.forEach((id, k) => { const f = s.fams[`f${k % nf}`]; f.membros.push(id); s.alunos[id].fam = f.id; });
      // desigualdade inicial: a primeira família tem herança; a última começa sem lote
      for (const f of Object.values(s.fams)) f.caixa = 10 * f.membros.length;
      s.fams.f0.caixa *= 1.5;
      s.fams.f0.lotes = 3;                 // herança: caixa maior e 2 lotes a mais
      s.fams[`f${nf - 1}`].lotes = 0;
      for (const f of Object.values(s.fams)) f.caixa0 = f.caixa;
      let li = 0;
      for (const f of Object.values(s.fams)) for (let k = 0; k < f.lotes; k++) s.lotes[li++] = f.id;
      s.teto = TETO_FAMILIA * nf; s.mata = MATA_INICIO * s.teto;
      s.k = 1; s.fase = "familias";
      break;
    }
    case "achei": if (s.fase === "familias" && s.alunos[a.id]) s.alunos[a.id].achou = true; break;
    case "propor": {
      if (s.fase !== "decidir") break;
      const p = a.p || {};
      const lim = (x, m) => Math.max(0, Math.min(m, Math.round(Number(x) || 0)));
      (s.props[s.ano] ??= {})[a.id] = {
        pub: lim(p.pub, LIMITES.pub), rep: s.ano >= 2 ? lim(p.rep, LIMITES.rep) : 0, car: s.ano >= 2 ? lim(p.car, LIMITES.car) : 0,
        lance: s.props[s.ano]?.[a.id]?.lance ?? 0.3,
      };
      break;
    }
    case "prever": if (s.fase === "decidir") (s.previsao[s.ano] ??= {})[a.id] = a.v; break;
    case "mente": if (s.fase === "mente" && s.mente[a.id] == null) { s.mente[a.id] = !!a.acertei; s.dado[a.id] = a.face; } break;
    case "controle": {
      const chave = s.fase === "abertura" ? s.ano : s.fase === "voto" ? "voto" : null;   // R8: também antes do voto
      if (chave != null && s.alunos[a.id]) ((s.controle[chave] ??= {})[a.id] ??= +a.op);
      break;
    }
    case "palpite": if (s.fase === "lances" && s.alunos[a.id]) (s.palpite[s.ano] ??= {})[a.id] = a.v; break;
    case "config": if (typeof a.semTroco === "boolean" && !(s.ano >= 4 && s.fase !== "abertura")) s.semTroco = a.semTroco; break;
    case "lance": {
      if (s.fase !== "lances") break;
      const pr = (s.props[s.ano] ??= {})[a.id] ??= { pub: 0, rep: 0, car: 0 };
      pr.lance = Math.max(0, Math.min(0.6, Number(a.v) || 0));
      pr.lanceEnviado = true;
      break;
    }
    // método da estratégia: cada pessoa responde se aceitaria; vale a resposta de UMA pessoa sorteada (R8)
    case "alvara": if (s.fase === "alvara" && s.alunos[a.id] && s.alvara.votos[a.id] == null) s.alvara.votos[a.id] = !!a.aceita; break;
    case "voto": if (s.fase === "voto" && s.voto[a.id] == null) s.voto[a.id] = !!a.trocar; break;
    case "final": if (s.fase === "fechamento") s.final[a.id] = { guia: a.guia, motivo: a.motivo }; break;
    case "fase": {
      if (a.dir === 1) avancar(s, r);
      else if (a.dir === -1 && s.k > 1 && !["decidir", "lances", "resultado", "voto", "abertura"].includes(fase.id)) { s.k -= 1; s.fase = FASES[s.k].id; }
      break;
    }
    default: break;
  }
  return s;
}

// Saída de cada fase: aplica as contas daquela etapa e entra na próxima.
function avancar(s, r) {
  const fase = FASES[s.k];
  if (!fase || fase.id === "fechamento" || fase.id === "entrada") return;
  switch (fase.id) {
    case "decidir": {
      // quem não enviou repete a proposta do ano anterior (ou zero no primeiro ano)
      const props = (s.props[s.ano] ??= {});
      for (const id of s.ordem) if (!props[id]) props[id] = { ...(s.props[s.ano - 1]?.[id] || { pub: 0, rep: 0, car: 0, lance: 0.3 }), auto: true };
      const fx = fecharAno(s, props, s.renda);
      Object.assign(s, { fams: fx.fams, mata: fx.mata, publico: fx.publico, acumulado: fx.acumulado, colapsou: fx.colapsou });
      if (fx.colapsou) s.colapsouAlguma = true;
      s.fechamento = fx;
      break;
    }
    case "mente": {
      // R7: "acertei" vale 3 pontos pessoais, não vai para o caixa da família (o caixa de 3 a 6 pessoas revelaria os relatos)
      for (const id of s.ordem) if (s.mente[id]) s.pessoal[id] += 3;
      break;
    }
    case "lances": {
      const livres = s.lotes.filter((x) => !x).length;
      const L = leilao(s.fams, livres, s.props[s.ano] || {}, s.ano, s.regra, 0, () => r());
      s.fams = L.fams; s.leilao = { ...L, minimo: lanceMinimo(s.ano) };
      for (const v of L.vendidos) { const i = s.lotes.indexOf(null); if (i >= 0) s.lotes[i] = v.fam; }
      break;
    }
    case "alvara": {
      // vale a resposta da pessoa sorteada (quem não respondeu conta como "recusaria"); os 8 pontos são pessoais
      const vs = Object.values(s.alvara.votos);
      s.alvara.aceitariam = vs.filter(Boolean).length;
      s.alvara.aceito = !!s.alvara.votos[s.alvara.pessoa];
      if (s.alvara.aceito) { s.pessoal[s.alvara.pessoa] += 8; s.publico = Math.max(0, s.publico - 1); }
      break;
    }
    case "resultado": {
      // R10: a desigualdade da renda do ano (por pessoa, depois do aluguel) entra no histórico ao lado da do patrimônio
      const giniRenda = s.renda ? gini(Object.values(s.fams).map((f) => (s.renda[f.id]?.total ?? 0) / f.membros.length)) : 0;
      s.historico.push({ ano: s.ano, gini: gini(Object.values(s.fams).map((f) => patrimonio(f, s.publico))), giniRenda, mata: s.mata / s.teto, publico: s.publico, regra: s.regra,
        caixa: Object.fromEntries(Object.values(s.fams).map((f) => [f.id, f.caixa])), lotes: Object.fromEntries(Object.values(s.fams).map((f) => [f.id, f.lotes])) });
      break;
    }
    case "voto": {
      // maioria simples dos votos enviados; empate mantém a regra atual
      const vs = Object.values(s.voto);
      s.votoTrocou = vs.length > 0 && vs.filter(Boolean).length * 2 > vs.length;
      if (s.votoTrocou) s.regra = "prosperidade";
      // R9: guarda a vila no fim do ano 3 para refazer os anos 4 e 5 na outra regra, no fechamento
      s.snap3 = { fams: structuredClone(s.fams), mata: s.mata, publico: s.publico, acumulado: s.acumulado, colapsou: s.colapsou,
        teto: s.teto, regra: s.regra, livres: s.lotes.filter((x) => !x).length };
      break;
    }
    default: break;
  }
  s.k += 1;
  if (FASES[s.k]?.id === "mente" && s.semTroco) s.k += 1;   // troco desligado (padrão); o professor pode ligá-lo
  const prox = FASES[s.k];
  s.fase = prox.id;
  if (prox.ano) s.ano = prox.ano;
  if (prox.id === "abertura") s.renda = rendaDoAno(s.fams, s);
  if (prox.id === "alvara") s.alvara = { pessoa: s.ordem[Math.floor(r() * s.ordem.length)], votos: {}, aceito: null, aceitariam: null };
  if (prox.id === "fechamento") { s.vitoria = vitoriaColetiva(s); s.outra = contrafactual(s.snap3, s.props, s.alvara.aceito); }
}

// ---------- Seletores ----------
export function progresso(s) {
  const n = s.ordem.length;
  switch (s.fase) {
    case "entrada": return { rot: "na sala", feito: n, total: 0 };
    case "familias": return { rot: "acharam a família", feito: s.ordem.filter((id) => s.alunos[id].achou).length, total: n };
    case "decidir": return { rot: "propostas enviadas", feito: Object.values(s.props[s.ano] || {}).filter((p) => !p.auto).length, total: n };
    case "mente": return { rot: "responderam", feito: Object.keys(s.mente).length, total: n };
    case "lances": return { rot: "lances enviados", feito: Object.values(s.props[s.ano] || {}).filter((p) => p.lanceEnviado).length, total: n };
    case "alvara": return { rot: "votaram", feito: Object.keys(s.alvara.votos).length, total: n };
    case "abertura": return s.ano <= 4 ? { rot: "responderam a pergunta", feito: Object.keys(s.controle[s.ano] || {}).length, total: n } : null;
    case "voto": return { rot: "votaram", feito: Object.keys(s.voto).length, total: n };
    case "fechamento": return { rot: "responderam", feito: Object.keys(s.final).length, total: n };
    default: return null;
  }
}

export const agregadoOk = (k) => k >= 5;   // o telão só mostra agregados de 5 ou mais pessoas

export function contagem(obj) { const c = {}; for (const v of Object.values(obj)) c[v] = (c[v] || 0) + 1; return c; }
