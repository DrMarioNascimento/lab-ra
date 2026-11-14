// Mosaico Vila · regras do jogo (as mesmas da simulação em Python, vila_regras.py).
import { ESTRAGO_MATA } from "./cartas.js";
// Funções puras: nenhuma depende de tela, relógio ou sorteio.

export const ANOS = 5;
export const LOTES = 24;
export const TETO_FAMILIA = 20;          // a mata cresce com o número de famílias
export const MATA_INICIO = 0.7;          // começa em 70% do teto
export const REGENERA = 0.2;             // regeneração logística por ano
export const COLAPSO = 0.3;              // abaixo de 30% do teto, a mata colapsa (R6: o risco pode acontecer)
export const ANO_MORADIA = 3;            // moradia, aluguel e imposto só a partir do ano 3, quando a regra entra
export const ANO_MERCADO = 4;            // R7: mercado de lotes só no ano 4 (uma novidade por ano)
export const CONTRIB_PROSPERIDADE = 1;   // R7: na Prosperidade, todos contribuem 1 por pessoa ao bem público
export const VALOR_LOTE = (nivel) => 10 + 2 * nivel;   // o lote vale mais quando o bem público cresce
export const CARGA_TIRA = 2;             // cada carga de madeira tira 2 da mata
export const CARGA_RENDE = 6;            // e rende 6 pontos à família
export const REPLANTA_POR = 5;           // cada 5 pontos replantados...
export const REPLANTA_DEVOLVE = 2;       // ...devolvem 2 à mata
export const ALUGUEL = { monopolio: 8, prosperidade: 2 };
export const IMPOSTO_LOTE = 1.5;         // só na Prosperidade, vai ao bem público
export const PISO_PESSOA = 6;            // piso de renda por pessoa
export const NIVEL_MAX = 5;
export const PONTOS_NIVEL = 12;          // × número de famílias para subir um nível
export const VITORIA = { pobreSobreMedia: 0.7, mataMinima: 0.3, patrimonioPorPessoa: 54 };   // R19: 54 e 70% (com 50 e 75%, o Monopólio passava quase sempre e a Prosperidade metade das vezes)   // R7: meta das duas regras; R14: equidade em 75%; R15: eficiência em 50 por pessoa (com 42 ela já estava batida no voto) (com 60% ela quase nunca falhava)
export const LIMITES = { pub: 50, rep: 30, car: 3 };

export const lanceMinimo = (ano, acrescimo = 0) => 6 + 2 * ano + acrescimo;
export const moradiaNecessaria = (membros) => Math.ceil(membros / 3);

export function mediana(xs) {
  const v = [...xs].sort((a, b) => a - b);
  if (!v.length) return 0;
  const m = Math.floor(v.length / 2);
  return v.length % 2 ? v[m] : (v[m - 1] + v[m]) / 2;
}

export function gini(xs) {
  const v = xs.map((x) => Math.max(0, x)).sort((a, b) => a - b);
  const n = v.length, soma = v.reduce((a, b) => a + b, 0);
  if (!n || !soma) return 0;
  return v.reduce((acc, x, i) => acc + (2 * (i + 1) - n - 1) * x, 0) / (n * soma);
}

// Renda de cada família no início do ano (o que o extrato mostra).
export function rendaDoAno(fams, { publico, mata, teto, colapsou, regra, ano = ANO_MORADIA }) {
  const lista = Object.values(fams);
  const fm = mata / teto;
  const precisa = lista.map((f) => moradiaNecessaria(f.membros.length));
  const falta = lista.map((f, k) => Math.max(0, precisa[k] - f.lotes));
  const sobra = lista.map((f, k) => Math.max(0, f.lotes - precisa[k]));
  const al = ano >= ANO_MORADIA ? ALUGUEL[regra] : 0;
  const pago = falta.map((x) => x * al);
  const totalPago = pago.reduce((a, b) => a + b, 0);
  const totalSobra = sobra.reduce((a, b) => a + b, 0);
  const out = {};
  lista.forEach((f, k) => {
    const m = f.membros.length;
    const base = m * (8 + 2 * publico);
    const bonusMata = fm >= 0.5 ? 2 * m : 0;
    const perdaMata = colapsou ? 4 * m : 0;
    const recebido = totalSobra > 0 ? (totalPago * sobra[k]) / totalSobra : 0;
    const imposto = regra === "prosperidade" ? IMPOSTO_LOTE * f.lotes + CONTRIB_PROSPERIDADE * m : 0;
    const bruto = base + bonusMata - perdaMata - pago[k] + recebido - imposto;
    const piso = PISO_PESSOA * m;
    out[f.id] = { base, bonusMata, perdaMata, aluguel: pago[k], recebido, imposto, falta: falta[k], sobra: sobra[k],
      piso: bruto < piso ? piso - bruto : 0, total: Math.max(bruto, piso) };
  });
  return out;
}

// Proposta da família = mediana das propostas dos membros (quem não enviou fica de fora; ninguém = zero).
export function propostaDaFamilia(f, props) {
  const ps = f.membros.map((id) => props[id]).filter(Boolean);
  if (!ps.length) return { pub: 0, rep: 0, car: 0, lance: 0, n: 0 };
  return {
    pub: mediana(ps.map((p) => p.pub)), rep: mediana(ps.map((p) => p.rep)),
    car: Math.round(mediana(ps.map((p) => p.car))), lance: mediana(ps.map((p) => p.lance ?? 0)), n: ps.length,
    semLote: 2 * ps.filter((p) => p.semLote).length > ps.length,   // R16: a maioria da família marcou "não queremos lote"
  };
}

// Fecha as contas do ano: aportes, cargas, mata, bem público. Devolve o novo estado da vila e o extrato.
export function fecharAno(v, props, renda) {
  const fams = structuredClone(v.fams);
  let { mata, publico, acumulado, colapsou } = v;
  const teto = v.teto;
  let extr = 0, plant = 0;
  const extrato = {}, ps = {};
  for (const f of Object.values(fams)) {
    const p = (ps[f.id] = propostaDaFamilia(f, props));
    const base = Math.max(0, renda[f.id].total);
    plant += ((base * p.rep) / 100 / REPLANTA_POR) * REPLANTA_DEVOLVE;
    extr += CARGA_TIRA * p.car;
  }
  // R19: ninguém tira madeira que não existe: se as cargas passam do que a mata tem, cada carga rende e tira só a sua parte
  const regen = v.ano >= 2 ? REGENERA * mata * (1 - mata / teto) : 0, disponivel = mata + regen + plant;
  const fator = v.ano >= 2 && extr > disponivel ? Math.max(0, disponivel) / extr : 1;
  extr *= fator;
  for (const f of Object.values(fams)) {
    const p = ps[f.id], r = renda[f.id].total, base = Math.max(0, r);
    const aPub = (base * p.pub) / 100, aRep = (base * p.rep) / 100;
    acumulado += aPub;
    const ganhoCarga = CARGA_RENDE * p.car * fator;
    f.caixa += r - aPub - aRep + ganhoCarga;
    extrato[f.id] = { renda: r, aPub, aRep, cargas: p.car, ganhoCarga, proposta: p };
  }
  acumulado += Object.values(renda).reduce((a, x) => a + x.imposto, 0);
  const mataAntes = mata;
  if (v.ano >= 2) {
    mata = Math.max(0, mata + regen - extr + plant);
    colapsou = mata < COLAPSO * teto;     // R10: o colapso dura enquanto a mata estiver abaixo de 30%; replantando, ela volta
  }
  const nf = Object.keys(fams).length;
  const nivelAntes = publico;
  while (acumulado >= PONTOS_NIVEL * nf && publico < NIVEL_MAX) { acumulado -= PONTOS_NIVEL * nf; publico += 1; }
  return { fams, mata, publico, acumulado, colapsou, extrato, extr, plant, mataAntes, nivelAntes };
}

// Mercado de lotes: até 3 lotes livres; vence o maior lance (limitado ao caixa e ao mínimo).
// R16: cada família compra até ter a moradia + 1 lote (TETO_LOTES); quem marcou "não queremos lote" fica de fora.
export const precisaLotes = (f) => Math.ceil(f.membros.length / 3);
export const tetoLotes = (f) => precisaLotes(f) + 1;
export function leilao(fams, livres, props, ano, regra, acrescimo, desempate) {
  const out = structuredClone(fams);
  const min = lanceMinimo(ano, acrescimo);
  const vendidos = [];
  const pf = Object.fromEntries(Object.values(out).map((f) => [f.id, propostaDaFamilia(f, props)]));
  const fr = Object.fromEntries(Object.values(out).map((f) => [f.id, pf[f.id].lance]));
  const semLote = Object.values(out).filter((f) => pf[f.id].semLote).map((f) => f.id);
  const noTeto = Object.values(out).filter((f) => !pf[f.id].semLote && f.lotes >= tetoLotes(f)).map((f) => f.id);
  for (let k = 0; k < Math.min(3, livres); k++) {
    let melhor = null, valor = -1;
    for (const f of Object.values(out)) {
      if (f.caixa < min || pf[f.id].semLote || f.lotes >= tetoLotes(f)) continue;
      const parte = regra === "monopolio" ? fr[f.id] : fr[f.id] * 0.5;
      const oferta = Math.min(f.caixa, min + f.caixa * parte);
      const comDesempate = oferta + desempate(f.id) * 0.01;
      if (comDesempate > valor) { valor = comDesempate; melhor = f; }
    }
    if (!melhor) break;
    const preco = Math.min(melhor.caixa, min + melhor.caixa * (regra === "monopolio" ? fr[melhor.id] : fr[melhor.id] * 0.5));
    melhor.caixa -= preco; melhor.lotes += 1; fr[melhor.id] *= 0.5;
    vendidos.push({ fam: melhor.id, preco });
  }
  return { fams: out, vendidos, semLote, noTeto };
}

// Patrimônio = caixa + lotes × valor do lote.
export const patrimonio = (f, publico) => f.caixa + f.lotes * VALOR_LOTE(publico);

// Meta coletiva de cada regra (R7). Monopólio: eficiência (patrimônio médio por pessoa e mata).
// Prosperidade: equidade (a família mais pobre com 70% da média, por pessoa, e mata; R19).
export function vitoriaColetiva(v) {
  const fs = Object.values(v.fams);
  const pat = fs.map((f) => patrimonio(f, v.publico));
  const media = pat.reduce((a, b) => a + b, 0) / pat.length;
  const pessoas = fs.reduce((a, f) => a + f.membros.length, 0);
  const mataOk = v.mata >= VITORIA.mataMinima * v.teto;
  if (v.regra === "prosperidade") {
    // R11: compara patrimônio por pessoa (as famílias têm de 3 a 5 pessoas em turmas de 12 a 40)
    const pp = fs.map((f) => patrimonio(f, v.publico) / f.membros.length), mpp = pp.reduce((a, b) => a + b, 0) / pp.length;
    return Math.min(...pp) >= VITORIA.pobreSobreMedia * mpp && mataOk;
  }
  return pat.reduce((a, b) => a + b, 0) / pessoas >= VITORIA.patrimonioPorPessoa && mataOk;
}

// "A vila na outra regra" (R9): refaz os anos 4 e 5 na regra que a turma não escolheu, com as mesmas propostas,
// os mesmos lances e a mesma proposta grande (R13: o estrago pode ser no bem público ou na mata). Devolve a desigualdade
// final (Gini do patrimônio) e se a meta seria batida.
export function contrafactual(snap, props, grande, desempate = () => 0.5, lances = props) {
  const g = typeof grande === "object" && grande ? grande : { aceito: !!grande, alvo: "publico" };
  if (!snap) return null;
  const outra = snap.regra === "monopolio" ? "prosperidade" : "monopolio";
  let v = { fams: structuredClone(snap.fams), mata: snap.mata, publico: snap.publico, acumulado: snap.acumulado,
    colapsou: snap.colapsou, teto: snap.teto, regra: outra, livres: snap.livres };
  for (const ano of [4, 5]) {
    const p = props[ano] || {};
    // R14: a proposta grande do ano 5 vem antes das decisões e já pesa na renda do ano
    if (ano === 5 && g.aceito) {
      if (g.alvo === "mata") { v.mata = Math.max(0, v.mata - ESTRAGO_MATA * v.teto); v.colapsou = v.mata < COLAPSO * v.teto; }
      else v.publico = Math.max(0, v.publico - 1);
    }
    const renda = rendaDoAno(v.fams, { ...v, ano });
    // R18: o mercado vem antes das decisões (a renda do ano já foi calculada na abertura)
    if (v.livres > 0) { const L = leilao(v.fams, v.livres, lances[ano] || {}, ano, outra, 0, desempate); v.fams = L.fams; v.livres -= L.vendidos.length; }
    const fx = fecharAno({ ...v, ano }, p, renda);
    Object.assign(v, { fams: fx.fams, mata: fx.mata, publico: fx.publico, acumulado: fx.acumulado, colapsou: fx.colapsou });
  }
  return { regra: outra, gini: gini(Object.values(v.fams).map((f) => patrimonio(f, v.publico) / f.membros.length)), meta: vitoriaColetiva(v), mata: v.mata / v.teto };
}

// R10: quanto a vila está da meta da regra vigente (o telão e o celular mostram desde o ano 1).
export function progressoMeta(fams, publico, mata, teto, regra) {
  const lista = Object.values(fams);
  const pats = lista.map((f) => patrimonio(f, publico));
  const pessoas = lista.reduce((a, f) => a + f.membros.length, 0) || 1;
  const media = pats.reduce((a, b) => a + b, 0) / Math.max(1, pats.length);
  const mataFrac = teto ? mata / teto : 0;
  if (regra === "prosperidade") {
    // R11: por pessoa: patrimônio por pessoa da família mais pobre ÷ média do patrimônio por pessoa das famílias
    const pp = lista.map((f) => patrimonio(f, publico) / f.membros.length), mpp = pp.reduce((a, b) => a + b, 0) / Math.max(1, pp.length);
    const pior = Math.min(...pp);
    return { regra, rotulo: "família mais pobre / média, por pessoa", valor: mpp ? pior / mpp : 0, alvo: VITORIA.pobreSobreMedia,
      ok: pior >= VITORIA.pobreSobreMedia * mpp && mataFrac >= VITORIA.mataMinima, mata: mataFrac };
  }
  const pp = pats.reduce((a, b) => a + b, 0) / pessoas;
  return { regra, rotulo: "patrimônio médio por pessoa", valor: pp, alvo: VITORIA.patrimonioPorPessoa,
    ok: pp >= VITORIA.patrimonioPorPessoa && mataFrac >= VITORIA.mataMinima, mata: mataFrac };
}
