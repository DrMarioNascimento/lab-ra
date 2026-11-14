// Mosaico Vila · motor da sala: estado único + redutor puro (mesma casca da Ângulos e da Viagem do O₂).
import { FAMILIAS, EVENTOS } from "./content/vila.js";
import { carta, cartaAno4, distribuirSituacoes, sortearCartas, GANHO_PEQUENA, GANHO_GRANDE, GANHO_HONESTIDADE, RISCO_CONFIANCA, CHANCE_GOLPE, ESTRAGO_MATA } from "./content/cartas.js";
import {
  ANOS, LOTES, TETO_FAMILIA, MATA_INICIO, LIMITES, ANO_MERCADO, COLAPSO, PONTOS_NIVEL, rendaDoAno, fecharAno, leilao, gini, vitoriaColetiva, lanceMinimo, patrimonio, contrafactual,
} from "./content/regras.js";

export function rnd(seed) {
  let s = seed >>> 0;
  return () => { s = (s + 0x6d2b79f5) >>> 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

// Sequência de fases: uma regra nova por ano (1 a 4); votação no fim do ano 3. R13: proposta pequena no ano 2, carta
// opcional (honestidade ou confiança) no ano 4 e proposta grande no ano 5, sorteadas a cada partida (content/cartas.js).
export function montarFases() {
  const f = [{ id: "entrada" }, { id: "familias" }];
  for (let ano = 1; ano <= ANOS; ano++) {
    // R14: no ano 5, a proposta grande vem antes das decisões, para a turma ainda poder reagir (replantar, contribuir).
    // R18: o mercado vem antes das decisões (no ano 5, depois da grande): o lance usa o caixa do começo do ano e a vila que
    // todos veem; ninguém vê a vila nova antes do "Como ficou a vila"
    f.push({ id: "abertura", ano });
    if (ano === ANOS) f.push({ id: EVENTOS[ano].id, ano });
    if (ano >= ANO_MERCADO) f.push({ id: "lances", ano });
    f.push({ id: "decidir", ano });
    if (ano !== ANOS && EVENTOS[ano]) f.push({ id: EVENTOS[ano].id, ano });
    f.push({ id: "resultado", ano });
    if (ano === 3) f.push({ id: "conversa", ano }, { id: "voto", ano });   // R16: 90 s de conversa com pergunta-guia; o voto abre depois
  }
  f.push({ id: "fechamento" });
  return f;
}
export const FASES = montarFases();
// Nome da etapa: nas etapas de carta, o título da carta sorteada.
export function nomeFase(s) {
  const c = s.cartas && { pequena: s.cartas.pequena, mente: s.cartas.ano4, alvara: s.cartas.grande }[s.fase];
  if (c && carta(c).grupo === "confianca") return "Uma questão de confiança";   // R16: cada um recebe uma situação
  return c ? carta(c).titulo : NOME_FASE[s.fase] || "";
}
export const NOME_FASE = {
  entrada: "Entrada", familias: "Famílias", abertura: "Renda do ano", decidir: "Decisões da família", pequena: "Uma proposta pequena",
  mente: "Carta do ano 4", lances: "Mercado de lotes", alvara: "Uma proposta grande",
  resultado: "Como ficou a vila", conversa: "Conversa antes do voto", voto: "Que regra queremos?", fechamento: "Fechamento",
};

// 4 a 8 famílias a partir de 12 participantes (GDD); em turmas menores (só para testar), famílias de 3.
export function nFamilias(n) { return n >= 12 ? Math.max(4, Math.min(8, Math.floor(n / 4))) : Math.max(1, Math.floor(n / 3)); }

export function estadoInicial() {
  return {
    v: 0, k: 0, fase: "entrada", ano: 0, regra: "monopolio", alunos: {}, ordem: [], fams: {}, lotes: Array(LOTES).fill(null),
    mata: 0, teto: 0, publico: 0, acumulado: 0, colapsou: false, colapsouAlguma: false, renda: null, fechamento: null,
    props: {}, lances: {}, previsao: {}, mente: {}, dado: {}, alvara: { pessoa: null, votos: {}, aceito: null, aceitariam: null },
    pequena: { votos: {}, aceitaram: null, n: 0, estrago: null }, golpe: {}, quem: {}, palpitePct: {}, prev5: {},
    voto: {}, votoTrocou: null, votoPct: null, leilao: null, pessoal: {}, historico: [], final: {}, pulados: {},
    controle: {}, palpite: {}, semTroco: false, cartas: null, painel: null,
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
      // R19: os nomes e as cores das famílias saem embaralhados pela semente: a herança não fica sempre com a mesma família
      const rn = rnd(s.seed ^ 0x3c6ef372), nomes = [...FAMILIAS];
      for (let i = nomes.length - 1; i > 0; i--) { const j = Math.floor(rn() * (i + 1)); [nomes[i], nomes[j]] = [nomes[j], nomes[i]]; }
      for (let i = 0; i < nf; i++) s.fams[`f${i}`] = { id: `f${i}`, i, ...nomes[i], membros: [], lotes: 1, caixa: 0, caixa0: 0 };
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
      s.cartas = sortearCartas(rnd(s.seed ^ 0x5bd1e995));   // R13: cartas da partida, só da semente (como o impostor)
      s.situacao = distribuirSituacoes(s.ordem, rnd(s.seed ^ 0x2c1b3c6d));   // R16: na confiança, uma situação por pessoa
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
      };
      break;
    }
    case "prever": if (s.fase === "decidir") (s.previsao[s.ano] ??= {})[a.id] = a.v; break;
    // carta do ano 4: "acertei" no dado, "ficar" na honestidade, "confiar" na confiança (todas pessoais e secretas)
    case "mente": if (s.fase === "mente" && s.alunos[a.id] && s.mente[a.id] == null) { s.mente[a.id] = !!a.acertei; if (a.face) s.dado[a.id] = a.face; } break;
    case "quem": if (s.fase === "mente" && s.alunos[a.id] && s.quem[a.id] == null) s.quem[a.id] = +a.v; break;   // −1 = prefere não responder
    case "pequena": if (s.fase === "pequena" && s.alunos[a.id] && s.pequena.votos[a.id] == null) s.pequena.votos[a.id] = !!a.aceita; break;
    // microtarefas: palpite de quantos % aceitam (pequena e grande), de quantos % votam para trocar e da desigualdade no ano 5
    case "palpitePct": if (["pequena", "alvara", "voto"].includes(s.fase) && s.alunos[a.id]) ((s.palpitePct[s.fase] ??= {})[a.id] ??= +a.v); break;
    case "prev5": if (s.fase === "abertura" && s.ano === 5 && s.alunos[a.id] && s.prev5[a.id] == null) s.prev5[a.id] = a.v; break;
    // R13: quem conduz pode segurar um painel de "Como ficou a vila" ou ir e voltar entre eles
    case "painel": if (s.fase === "resultado") s.painel = a.k == null ? null : Math.max(0, Math.min(9, +a.k)); break;
    case "controle": {
      const chave = s.fase === "abertura" ? s.ano : ["conversa", "voto"].includes(s.fase) ? "voto" : null;   // R8: também antes do voto
      if (chave != null && s.alunos[a.id]) ((s.controle[chave] ??= {})[a.id] ??= +a.op);
      break;
    }
    case "palpite": if (s.fase === "lances" && s.alunos[a.id]) (s.palpite[s.ano] ??= {})[a.id] = a.v; break;
    case "config":
      if (typeof a.semTroco === "boolean" && !(s.ano >= 4 && s.fase !== "abertura")) s.semTroco = a.semTroco;
      if (typeof a.curto === "boolean") s.curto = a.curto;   // R17: aula atrasada: conversa do voto em 60 s e da família em 30 s nos anos 4 e 5
      break;
    case "lance": {
      if (s.fase !== "lances") break;
      const pr = (s.lances[s.ano] ??= {})[a.id] ??= {};   // R18: os lances ficam à parte (o mercado vem antes das propostas)
      pr.semLote = Number(a.v) < 0;   // R16: "não queremos lote este ano"
      pr.lance = pr.semLote ? 0 : Math.max(0, Math.min(0.6, Number(a.v) || 0));
      pr.lanceEnviado = true;
      break;
    }
    // método da estratégia: cada pessoa responde se aceitaria; vale a resposta de UMA pessoa sorteada (R8)
    case "alvara": if (s.fase === "alvara" && s.alunos[a.id] && s.alvara.votos[a.id] == null) s.alvara.votos[a.id] = !!a.aceita; break;
    case "voto": if (s.fase === "voto" && s.voto[a.id] == null) s.voto[a.id] = !!a.trocar; break;
    case "final": if (s.fase === "fechamento") s.final[a.id] = { guia: a.guia, motivo: a.motivo }; break;
    // fechamento: o telão mostra uma pergunta por vez; quem conduz passa de uma para outra
    case "pergunta": if (s.fase === "fechamento") s.pergunta = Math.max(0, Math.min(4, (s.pergunta || 0) + (a.dir === -1 ? -1 : 1))); break;
    case "fase": {
      // R15: antes de cada avanço, um retrato do estado; Voltar restaura o retrato (as contas nunca rodam duas vezes)
      if (a.dir === 1) {
        if (s.fase === "fechamento" || s.k === 0) break;
        const { pilha, ...sem } = s;
        s.pilha = [...(pilha || []), structuredClone(sem)].slice(-6);   // até 6 passos para trás (o estado viaja inteiro na sala real)
        avancar(s, r);
      } else if (a.dir === -1 && s.pilha?.length && s.k > 1) {
        const pilha = s.pilha.slice(0, -1), ant = s.pilha.at(-1);
        for (const k of Object.keys(s)) delete s[k];
        Object.assign(s, ant, { pilha, v: st.v + 1 });
      }
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
      // R15: o lance não é herdado (nem a marca de lance enviado): quem não envia lance oferece 0% além do mínimo
      for (const id of s.ordem) if (!props[id]) { const ant = s.props[s.ano - 1]?.[id] || { pub: 0, rep: 0, car: 0 }; props[id] = { pub: ant.pub, rep: ant.rep, car: ant.car, lance: 0, auto: true }; }
      const fx = fecharAno(s, props, s.renda);
      s.antes = { ano: s.ano, mata: s.mata, publico: s.publico, fams: s.fams };   // R17: a vila antes das decisões, até o "Como ficou a vila"
      Object.assign(s, { fams: fx.fams, mata: fx.mata, publico: fx.publico, acumulado: fx.acumulado, colapsou: fx.colapsou });
      // R14: a proposta grande do ano 5 veio antes das decisões; o resultado do ano conta o estrago dela
      if (s.ano === ANOS && s.alvara.antes) { fx.mataPrev = fx.mataAntes; fx.mataAntes = s.alvara.antes.mata; fx.nivelAntes = s.alvara.antes.publico; if (s.alvara.estrago) fx.estrago = s.alvara.estrago; }
      if (fx.colapsou) s.colapsouAlguma = true;
      s.fechamento = fx;
      break;
    }
    case "pequena": {
      // cada "aceito" vale para quem aceitou (+2 pessoais) e tira 1/n do estrago grande (a turma inteira = o estrago da grande)
      const c = carta(s.cartas.pequena), n = s.ordem.length;
      const sim = s.ordem.filter((id) => s.pequena.votos[id]);
      for (const id of sim) s.pessoal[id] += GANHO_PEQUENA;
      s.pequena.aceitaram = sim.length; s.pequena.n = Object.keys(s.pequena.votos).length;
      s.pequena.estrago = estragar(s, c.alvo, n ? sim.length / n : 0);
      if (s.fechamento) s.fechamento.estrago = s.pequena.estrago;
      break;
    }
    case "mente": {
      // R7: os pontos são pessoais, nunca do caixa da família (o caixa de 3 a 6 pessoas revelaria os relatos)
      for (const id of s.ordem) {
        if (!s.mente[id]) continue;
        const c = cartaAno4(s, id);   // R16: na confiança, a situação da própria pessoa
        if (c.tipo !== "confia") { s.pessoal[id] += GANHO_HONESTIDADE; continue; }
        // confiança: cada um encontra uma pessoa diferente; a chance de má-fé é a mesma (1 em 4) em todas as cartas
        s.golpe[id] = r() < CHANCE_GOLPE;
        s.pessoal[id] += s.golpe[id] ? -RISCO_CONFIANCA : c.ganhoBom;
      }
      break;
    }
    case "lances": {
      const livres = s.lotes.filter((x) => !x).length;
      const L = leilao(s.fams, livres, s.lances[s.ano] || {}, s.ano, s.regra, 0, () => r());
      s.fams = L.fams; s.leilao = { ...L, minimo: lanceMinimo(s.ano), ano: s.ano };
      for (const v of L.vendidos) { const i = s.lotes.indexOf(null); if (i >= 0) s.lotes[i] = v.fam; }
      break;
    }
    case "alvara": {
      // vale a resposta da pessoa sorteada (quem não respondeu conta como "recusaria"); os 8 pontos são pessoais
      const vs = Object.values(s.alvara.votos), c = carta(s.cartas.grande);
      s.alvara.aceitariam = vs.filter(Boolean).length;
      s.alvara.aceito = !!s.alvara.votos[s.alvara.pessoa];
      s.alvara.alvo = c.alvo;
      s.alvara.antes = { mata: s.mata, publico: s.publico };
      if (s.alvara.aceito) {
        s.pessoal[s.alvara.pessoa] += GANHO_GRANDE; s.alvara.estrago = estragar(s, c.alvo, 1);
        s.renda = rendaDoAno(s.fams, s);   // R14: o estrago já pesa na renda do ano 5 (nível a menos ou mata abaixo de 50%/30%)
      }
      break;
    }
    case "resultado": {
      // R10: a desigualdade da renda do ano (por pessoa, depois do aluguel) entra no histórico ao lado da do patrimônio
      const giniRenda = s.renda ? gini(Object.values(s.fams).map((f) => (s.renda[f.id]?.total ?? 0) / f.membros.length)) : 0;
      // R14: a desigualdade do patrimônio também é por pessoa (as famílias têm de 3 a 6 pessoas)
      s.historico.push({ ano: s.ano, gini: gini(Object.values(s.fams).map((f) => patrimonio(f, s.publico) / f.membros.length)), giniRenda, mata: s.mata / s.teto, publico: s.publico, regra: s.regra,
        extr: s.fechamento?.extr || 0, plant: s.fechamento?.plant || 0,
        caixa: Object.fromEntries(Object.values(s.fams).map((f) => [f.id, f.caixa])), lotes: Object.fromEntries(Object.values(s.fams).map((f) => [f.id, f.lotes])) });
      break;
    }
    case "voto": {
      // maioria simples dos votos enviados; empate mantém a regra atual
      const vs = Object.values(s.voto);
      s.votoTrocou = vs.length > 0 && vs.filter(Boolean).length * 2 > vs.length;
      s.votoPct = vs.length ? vs.filter(Boolean).length / vs.length : null;
      if (s.votoTrocou) s.regra = "prosperidade";
      // R9: guarda a vila no fim do ano 3 para refazer os anos 4 e 5 na outra regra, no fechamento
      s.snap3 = { fams: structuredClone(s.fams), mata: s.mata, publico: s.publico, acumulado: s.acumulado, colapsou: s.colapsou,
        teto: s.teto, regra: s.regra, livres: s.lotes.filter((x) => !x).length };
      break;
    }
    default: break;
  }
  s.k += 1;
  s.painel = null;
  if (FASES[s.k]?.id === "mente" && s.semTroco) s.k += 1;   // carta do ano 4 desligada pelo professor (se a aula atrasar)
  const prox = FASES[s.k];
  s.fase = prox.id;
  if (prox.ano) s.ano = prox.ano;
  if (prox.id === "abertura") s.renda = rendaDoAno(s.fams, s);
  if (prox.id === "alvara") s.alvara = { pessoa: s.ordem[Math.floor(r() * s.ordem.length)], votos: {}, aceito: null, aceitariam: null };
  if (prox.id === "fechamento") { s.vitoria = vitoriaColetiva(s); s.outra = contrafactual(s.snap3, s.props, { aceito: s.alvara.aceito, alvo: s.alvara.alvo }, undefined, s.lances); }
}

// Estrago de uma proposta aceita (frac = parte do estrago grande: 1 na grande; aceites ÷ turma na pequena).
// Mata: 20% do teto. Bem público: 12 × famílias pontos (um nível inteiro); se faltar acumulado, cai de nível.
export function estragar(s, alvo, frac) {
  if (alvo === "mata") {
    const antes = s.mata;
    s.estragoMata = (s.estragoMata || 0) + Math.min(antes, ESTRAGO_MATA * s.teto * frac);
    s.mata = Math.max(0, s.mata - ESTRAGO_MATA * s.teto * frac);
    s.colapsou = s.mata < COLAPSO * s.teto;
    if (s.colapsou) s.colapsouAlguma = true;
    return { alvo, mata: antes - s.mata, pct: (100 * (antes - s.mata)) / s.teto };
  }
  // R25: o estrago conta só o que existia (no nível 0, com 20 pontos juntos, a proposta tira 20, não 60)
  const nf = Object.keys(s.fams).length, nivel0 = s.publico, pontos = Math.min(PONTOS_NIVEL * nf * frac, s.acumulado + s.publico * PONTOS_NIVEL * nf);
  s.estragoPublico = (s.estragoPublico || 0) + pontos;
  s.acumulado -= pontos;
  while (s.acumulado < 0 && s.publico > 0) { s.publico -= 1; s.acumulado += PONTOS_NIVEL * nf; }
  s.acumulado = Math.max(0, s.acumulado);
  return { alvo, pontos, niveis: nivel0 - s.publico };
}

// ---------- Seletores ----------
export function progresso(s) {
  const n = s.ordem.length;
  switch (s.fase) {
    case "entrada": return { rot: "na sala", feito: n, total: 0 };
    case "familias": return { rot: "acharam a família", feito: s.ordem.filter((id) => s.alunos[id].achou).length, total: n };
    case "decidir": return { rot: "propostas enviadas", feito: Object.values(s.props[s.ano] || {}).filter((p) => !p.auto).length, total: n };
    case "mente": return { rot: "responderam", feito: Object.keys(s.mente).length, total: n };
    case "pequena": return { rot: "responderam", feito: Object.keys(s.pequena.votos).length, total: n };
    case "lances": return { rot: "lances enviados", feito: Object.values(s.lances[s.ano] || {}).filter((p) => p.lanceEnviado).length, total: n };
    case "alvara": return { rot: "votaram", feito: Object.keys(s.alvara.votos).length, total: n };
    case "abertura": return s.ano <= 4 ? { rot: "responderam a pergunta", feito: Object.keys(s.controle[s.ano] || {}).length, total: n } : { rot: "deram o palpite", feito: Object.keys(s.prev5).length, total: n };
    case "conversa": return { rot: "conferiram a regra", feito: Object.keys(s.controle.voto || {}).length, total: n };
    case "voto": return { rot: "votaram", feito: Object.keys(s.voto).length, total: n };
    case "fechamento": return { rot: "responderam", feito: Object.keys(s.final).length, total: n };
    default: return null;
  }
}

// R17: entre as decisões e o "Como ficou a vila" (carta, mercado), telão e celular mostram a vila de antes das decisões,
// para não estragar a revelação nem a previsão da mata
export function vista(s) {
  return ["pequena", "mente"].includes(s.fase) && s.antes?.ano === s.ano ? { ...s, mata: s.antes.mata, publico: s.antes.publico, fams: s.antes.fams } : s;
}

export const agregadoOk = (k) => k >= 5;   // o telão só mostra agregados de 5 ou mais pessoas

export function contagem(obj) { const c = {}; for (const v of Object.values(obj)) c[v] = (c[v] || 0) + 1; return c; }
