// Mosaico Vila Ética · Momento do Lazer (entre o ano 3 e o ano 4, cerca de 1,5 min).
// Uma atividade por partida, sorteada pela semente: o jogo da memória ou o Genius, como no Mosaico Sala, sempre com o
// máximo de cartas e botões que cabe na tela do celular (memória: 12 pares, 24 cartas; Genius: 8 botões).
// Cada celular joga sozinho; o motor recebe só o melhor resultado (pares achados ou rodadas completas).
import { GLOSSARIO, CATEGORIAS, ORDEM_CATEGORIAS, desbloqueados } from "../content/glossario.js";
import { rnd, ALVO_LAZER } from "../engine.js";
import { ico } from "./desenho.js";

export const PARES_MEMORIA = 12;          // o máximo do Mosaico Sala (2 a 12 pares)
export const BOTOES_GENIUS = 8;           // o máximo do Mosaico Sala (2 a 8 botões)
export const TEMPO_LAZER = 55;            // segundos de jogo em cada celular (o telão conta 60)
const VIRA_ERRO = 1000;                   // ms que um par errado fica aberto
// velocidade "calma" do Genius do Mosaico Sala: o tom encurta conforme a sequência cresce
const TONS = [[5, 650], [13, 520], [Infinity, 420]], PAUSA = 160;
const duracaoTom = (n) => TONS.find(([ate]) => n <= ate)[1];
// notas dos botões (escala de dó, como no Mosaico Sala para 5 a 8 botões) e o "zumbido" do erro
export const FREQ = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25], TOM_ERRO = 42;

const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const hash = (s) => { let h = 2166136261; for (const ch of String(s)) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
function embaralhar(xs, r) { const l = [...xs]; for (let i = l.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [l[i], l[j]] = [l[j], l[i]]; } return l; }
const agora = () => (typeof performance !== "undefined" ? performance.now() : Date.now());

// ---------- memória: os mesmos 12 pares para a turma (da semente), em posições sorteadas para cada pessoa ----------
export function paresDaPartida(st) {
  const base = desbloqueados({ ...st, fase: "lazer" }).filter((v) => v.pista);
  return embaralhar(base, rnd((st.seed || 1) ^ 0x51ed270b)).slice(0, PARES_MEMORIA);
}
function novaMemoria(st, id) {
  const pares = paresDaPartida(st);
  const cartas = embaralhar(pares.flatMap((v) => [{ par: v.id, lado: "a", texto: v.termo }, { par: v.id, lado: "b", texto: v.pista }]), rnd(hash(id) ^ (st.seed || 1)));
  return { tipo: "memoria", ini: agora(), cartas, achados: [], abertas: [], fechaEm: 0, fim: false };
}

// ---------- Genius: cor fixa por categoria, texto que muda a cada ciclo ----------
const POR_CAT = Object.fromEntries(ORDEM_CATEGORIAS.map((c) => [c, GLOSSARIO.filter((v) => v.cat === c)]));
export function rotulosDoCiclo(st, ciclo) {
  return ORDEM_CATEGORIAS.slice(0, BOTOES_GENIUS).map((c, k) => {
    const lista = POR_CAT[c], ordem = embaralhar(lista, rnd((st.seed || 1) ^ (k + 1) * 0x9e3779b1));
    return ordem[ciclo % ordem.length];
  });
}
function novoGenius(st, id) {
  const r = rnd(hash(id) ^ (st.seed || 1) ^ 0x2545f491);
  const g = { tipo: "genius", ini: agora(), seq: [Math.floor(r() * BOTOES_GENIUS)], feitos: 0, mostraIni: agora() + 600, rodadas: 0, melhor: 0, erro: null, fim: false, semente: hash(id) };
  return g;
}
function proximo(g) { const r = rnd(g.semente ^ (g.seq.length * 7919)); return Math.floor(r() * BOTOES_GENIUS); }
// em que passo da exibição estamos (índice aceso, ou -1 entre os passos, ou "vez" quando acabou de mostrar)
function exibicao(g, t) {
  if (g.erro || g.fim) return { modo: "parado" };
  const d = duracaoTom(g.seq.length), passo = d + PAUSA, dt = t - g.mostraIni;
  if (dt < 0) return { modo: "espera" };
  const i = Math.floor(dt / passo);
  if (i >= g.seq.length) return { modo: "vez" };
  return { modo: "mostra", aceso: dt - i * passo < d ? g.seq[i] : -1, passo: i };
}

// ---------- tela ----------
export function renderLazer(st, id, loc) {
  const tipo = st.lazer?.tipo || "memoria", lz = loc.lz && loc.lz.tipo === tipo ? loc.lz : null, t = agora();
  const meu = st.lazer?.res?.[id]?.pontos || 0;
  const cab = `<h2 class="row">${ico("lazer", "g")}Momento do Lazer</h2>`;
  if (!lz) {
    return cab + `<div class="card"><p class="muted" style="margin:0">Desde a Idade Média, o trabalho virou virtude e o ócio, vício (a preguiça): daí a dificuldade de aceitar o lazer. Aqui, o lazer também ensina.</p></div>
      <div class="card"><b class="row">${ico(tipo === "memoria" ? "lazer-memoria" : "lazer-genius")}${tipo === "memoria" ? `Jogo da memória: ${PARES_MEMORIA} pares` : `Genius: ${BOTOES_GENIUS} botões`}</b>
      <p class="muted" style="margin:6px 0 0">${tipo === "memoria" ? "Ache os pares: cada termo com a sua pista. Os termos são os do glossário que a vila já abriu." : "Repita a sequência de cores. A cor de cada botão é uma categoria do glossário e fica fixa; o termo dentro dela muda a cada rodada."}</p>
      <p class="faint" style="margin:6px 0 0">Quem chega a ${ALVO_LAZER} ${tipo === "memoria" ? "pares" : "rodadas"} dá 1 ponto ao bem público da vila (menos, proporcional). Você tem ${TEMPO_LAZER} s.</p></div>
      <button class="btn ok block" data-a="lz-comecar">Começar</button>`;
  }
  const resta = Math.max(0, Math.ceil(TEMPO_LAZER - (t - lz.ini) / 1000));
  if (lz.tipo === "memoria") {
    const aberta = (k) => lz.achados.includes(lz.cartas[k].par) || lz.abertas.includes(k);
    const cartas = lz.cartas.map((c, k) => {
      const ok = lz.achados.includes(c.par), ab = aberta(k);   // a cor da carta aberta é a do lado (termo ou pista), nunca a da categoria: a cor entregaria o par
      return `<button class="mem ${ab ? "aberta" : ""} ${ok ? "achada" : ""} ${c.lado}" data-a="lz-carta" data-val="${k}" ${ab || lz.fim ? "disabled" : ""}>${ab ? `<span>${esc(c.texto)}</span>` : "<b>?</b>"}</button>`;
    }).join("");
    return `<div class="row lz-topo"><b>Lazer · pares ${lz.achados.length}/${PARES_MEMORIA}</b><span class="mono">${lz.fim ? "fim" : `0:${String(resta).padStart(2, "0")}`}</span></div>
      <div class="mem-grade">${cartas}</div>${lz.fim ? `<div class="card"><b>${lz.achados.length >= ALVO_LAZER ? "Você chegou à meta: 1 ponto para o bem público." : `Você achou ${lz.achados.length} pares.`}</b><p class="faint" style="margin:4px 0 0">Os termos estão no glossário, no topo da tela.</p></div>` : ""}`;
  }
  // Genius
  const ex = exibicao(lz, t), rot = rotulosDoCiclo(st, lz.seq.length - 1);
  const botoes = ORDEM_CATEGORIAS.slice(0, BOTOES_GENIUS).map((c, k) => {
    const cat = CATEGORIAS[c], v = rot[k], aceso = ex.modo === "mostra" && ex.aceso === k || lz.toque?.k === k && t - lz.toque.t < 220;
    return `<button class="gen ${aceso ? "aceso" : ""}" style="--c:${cat.cor};--c2:${cat.cor2}" data-a="lz-gen" data-val="${k}" ${ex.modo === "vez" && !lz.fim ? "" : "disabled"}><small>${esc(cat.nome)}</small><span>${esc(v?.termo || "")}</span></button>`;
  }).join("");
  const msg = lz.fim ? `Fim do tempo. Seu melhor: ${lz.melhor} ${lz.melhor === 1 ? "rodada" : "rodadas"}.`
    : lz.erro ? `Errou: o certo era <b>${esc(lz.erro.termo)}</b> (${esc(lz.erro.cat)}).`
    : ex.modo === "vez" ? `Sua vez: repita ${lz.seq.length === 1 ? "a cor" : `as ${lz.seq.length} cores`} (${lz.feitos}/${lz.seq.length}).` : "Observe a sequência…";
  return `<div class="row lz-topo"><b>Lazer · rodada ${lz.seq.length} · melhor ${lz.melhor}</b><span class="mono">${lz.fim ? "fim" : `0:${String(resta).padStart(2, "0")}`}</span></div>
    <div class="gen-grade">${botoes}</div><p class="muted" style="margin:0;text-align:center">${msg}</p>
    ${lz.erro && !lz.fim ? `<div class="card"><b>Os termos desta rodada</b><p class="faint" style="margin:4px 0 0">${rot.map((v, k) => `${esc(CATEGORIAS[ORDEM_CATEGORIAS[k]].nome)}: ${esc(v.termo)}`).join(" · ")}</p></div><button class="btn ok block" data-a="lz-de-novo">Jogar de novo</button>` : ""}
    ${meu ? `<p class="faint" style="margin:0;text-align:center">Melhor enviado: ${meu}.</p>` : ""}`;
}

// ---------- toques ----------
export function acaoLazer(a, el, { st, id, loc, dispatch }) {
  const tipo = st.lazer?.tipo || "memoria", t = agora();
  if (a === "lz-comecar") { loc.lz = tipo === "memoria" ? novaMemoria(st, id) : novoGenius(st, id); return true; }
  const lz = loc.lz;
  if (!lz || lz.fim) return false;
  if (a === "lz-carta" && lz.tipo === "memoria") {
    const k = +el.dataset.val;
    if (lz.abertas.length >= 2) { lz.abertas = []; lz.fechaEm = 0; }
    if (lz.abertas.includes(k) || lz.achados.includes(lz.cartas[k].par)) return true;
    lz.abertas.push(k);
    if (lz.abertas.length === 2) {
      const [x, y] = lz.abertas.map((i) => lz.cartas[i]);
      if (x.par === y.par && x.lado !== y.lado) {
        lz.achados.push(x.par); lz.abertas = [];
        if (lz.achados.length === lz.cartas.length / 2) lz.fim = true;
        dispatch({ t: "lazer", id, pontos: lz.achados.length, fim: lz.fim });
      } else lz.fechaEm = t + VIRA_ERRO;
    }
    return true;
  }
  if (a === "lz-gen" && lz.tipo === "genius") {
    if (exibicao(lz, t).modo !== "vez" || lz.erro) return false;
    const k = +el.dataset.val;
    lz.toque = { k, t };
    if (lz.seq[lz.feitos] !== k) {
      const certo = lz.seq[lz.feitos], v = rotulosDoCiclo(st, lz.seq.length - 1)[certo];
      lz.erro = { termo: v?.termo || "", cat: CATEGORIAS[ORDEM_CATEGORIAS[certo]].nome };
      lz.som = TOM_ERRO;
      return true;
    }
    lz.som = FREQ[k];
    lz.feitos += 1;
    if (lz.feitos === lz.seq.length) {
      lz.rodadas = lz.seq.length; lz.melhor = Math.max(lz.melhor, lz.rodadas);
      dispatch({ t: "lazer", id, pontos: lz.melhor });
      lz.seq.push(proximo(lz)); lz.feitos = 0; lz.mostraIni = t + 700;   // nova rodada: um passo a mais, com os termos do próximo ciclo
    }
    return true;
  }
  if (a === "lz-de-novo" && lz.tipo === "genius") {
    const melhor = lz.melhor;
    loc.lz = { ...novoGenius(st, id), ini: lz.ini, melhor, semente: lz.semente + 1 };
    return true;
  }
  return false;
}

// ---------- relógio (chamado umas 8 vezes por segundo): fecha os pares errados, acende os passos, encerra o tempo ----------
export function tickLazer(st, id, loc, dispatch) {
  const lz = loc.lz;
  if (!lz || st.fase !== "lazer") return null;
  const t = agora();
  let som = null;
  if (!lz.fim && t - lz.ini >= TEMPO_LAZER * 1000) {
    lz.fim = true;
    dispatch({ t: "lazer", id, pontos: lz.tipo === "memoria" ? lz.achados.length : lz.melhor, fim: true });
  }
  if (lz.tipo === "memoria" && lz.fechaEm && t >= lz.fechaEm) { lz.abertas = []; lz.fechaEm = 0; }
  if (lz.tipo === "genius") {
    const ex = exibicao(lz, t);
    const marca = ex.modo === "mostra" ? `${ex.passo}:${ex.aceso}` : ex.modo;
    if (ex.modo === "mostra" && ex.aceso >= 0 && lz.ultimoSom !== marca) som = FREQ[ex.aceso];
    lz.ultimoSom = marca;
    if (lz.som) { som = lz.som; lz.som = null; }
  }
  return som;
}

// Som de um tom (Web Audio), como o Genius; silencioso onde não houver áudio
let ctxAudio = null;
export function tocar(freq, ms = 260) {
  try {
    ctxAudio ??= new (globalThis.AudioContext || globalThis.webkitAudioContext)();
    const o = ctxAudio.createOscillator(), g = ctxAudio.createGain();
    o.type = freq === TOM_ERRO ? "sawtooth" : "triangle"; o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, ctxAudio.currentTime); g.gain.exponentialRampToValueAtTime(0.18, ctxAudio.currentTime + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, ctxAudio.currentTime + (freq === TOM_ERRO ? 0.6 : ms / 1000));
    o.connect(g).connect(ctxAudio.destination); o.start(); o.stop(ctxAudio.currentTime + (freq === TOM_ERRO ? 0.65 : ms / 1000 + 0.05));
  } catch {}
}
