// Desenhos: ícones 3D (assets/icones) das famílias, o mapa da vila no telão e a linha do tempo.
// Casas e árvores vêm da pasta Cell do autor; formas e ícones de apoio são cópias próprias dos ícones 3D do MOSAICO Sala (ver assets/icones/origens.json).
import { NIVEIS_PUBLICO } from "../content/vila.js";
import { LOTES } from "../content/regras.js";

export const ICO = new URL("../../assets/icones/", import.meta.url).href;
// Ícone 3D de apoio (balança, meta, troféu...): <img> com sombra; tamanhos pelo CSS (.ico3, .g, .xl).
export const ico = (nome, cls = "", alt = "") => `<img class="ico3 ${cls}" src="${ICO}${nome}.webp" alt="${String(alt).replace(/"/g, "&quot;")}" draggable="false">`;

// R15: porcentagem sem enganar no limiar: perto de 30%, 50% ou 75%, mostra uma casa decimal (29,6% em vez de 30%),
// para a turma nunca ver o número da meta e ouvir que não bateu.
// R16: o valor da meta do Monopólio perto de 50 ganha uma casa decimal ("49,8/50"), para ninguém ler "50/50" sem ter batido
// R18: quebra um rótulo do mapa em linhas curtas, para caber na coluna (o nome do nível do bem público)
export function quebra(txt, max) {
  const ls = [];
  for (const w of String(txt).split(" ")) { const u = ls.length ? `${ls[ls.length - 1]} ${w}` : w; if (ls.length && u.length <= max) ls[ls.length - 1] = u; else ls.push(w); }
  return ls;
}
// R26: perto de um limiar, um número que arredonda para o limiar sem chegar nele aparece com uma casa decimal, para baixo
// (29,96% vira "29,9%", não "30%"; 53,97 vira "53,9", não "54"); acima do limiar, a casa decimal só quando passa de 0,05.
function perto(v, L) {
  if (Math.round(v) !== L || Math.abs(v - L) >= 1) return null;
  if (v < L - 1e-9) return Math.floor(v * 10 + 1e-9) / 10;
  return v - L > 0.05 ? Math.round(v * 10) / 10 : null;
}
export function nL(v, alvo) {
  const p = perto(v, alvo);
  return p != null ? p.toLocaleString("pt-BR") : String(Math.round(v));
}
// R25: o número que pctL() mostra (para as variações serem a diferença dos números que a turma vê)
export function pctNum(frac, limites = [0.3, 0.5, 0.7]) {
  const v = 100 * frac;
  for (const L of limites) { const p = perto(v, Math.round(100 * L)); if (p != null) return p; }
  return Math.round(v);
}
export function pctL(frac, limites = [0.3, 0.5, 0.7]) {   // R19: a meta da Prosperidade passou a 70%
  return `${pctNum(frac, limites).toLocaleString("pt-BR")}%`;
}

// Isotype: fileira de ícones iguais, cada um valendo "unidade" (o último pode vir pela metade, cortado).
export function fileira(nome, valor, unidade, cls = "") {
  const n = Math.max(0, valor / unidade), cheios = Math.floor(n + 1e-9), resto = n - cheios;
  const src = nome.includes(".") ? `${ICO}${nome}` : `${ICO}${nome}.webp`;
  const um = (w) => `<span class="iso-i" style="${w < 1 ? `width:calc(var(--iso) * ${w.toFixed(2)})` : ""}"><img src="${src}" alt="" draggable="false"></span>`;
  return `<span class="iso ${cls}">${Array.from({ length: cheios }, () => um(1)).join("")}${resto >= 0.15 ? um(resto) : ""}</span>`;
}
// Unidade "redonda" para que a maior fileira tenha no máximo maxIcones ícones.
export function unidade(maior, maxIcones = 12) {
  for (const u of [1, 2, 5, 10, 20, 25, 50, 100, 200, 500]) if (maior / u <= maxIcones) return u;
  return Math.ceil(maior / maxIcones);
}

const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

// Ícone da família: a casa 3D na cor dela, com a forma 3D no canto (para ninguém depender só da cor).
export function iconeFamilia(f, tam = 34) {
  return `<span class="ico-fam" style="--t:${tam}px" role="img" aria-label="${esc(f.nome)}"><img class="casa" src="${ICO}casa-${f.casa || "neutra"}.webp" alt="" draggable="false"><img class="forma" src="${ICO}forma-${f.forma}.webp" alt="" draggable="false"></span>`;
}

// Mapa da vila: a mata à esquerda, o bem público ao centro, os 24 lotes à direita.
export function mapaVila(st, { grande = true, destaque = null, menor = false } = {}) {
  const W = 800, H = 450;
  const fr = menor ? 29 : 27, frL = menor ? 29 : 26;   // R24: no mapa menor do ano 5 (46% da largura), os rótulos crescem para ficar em 1,6% da TV
  const fm = st.teto ? st.mata / st.teto : 0;
  const nArv = Math.round(fm * 40);
  const arv = [];
  for (let k = 0; k < 40; k++) {
    const x = 40 + (k % 8) * 30 + ((k * 37) % 11), y = 95 + Math.floor(k / 8) * 62 + ((k * 53) % 9);
    const viva = k < nArv;
    arv.push(viva
      ? `<image href="${ICO}${(k * 7) % 3 ? "arvore-redonda" : "arvore-dourada"}.webp" x="${x - 19}" y="${y - 24}" width="38" height="38"/>`
      : `<image href="${ICO}toco.webp" x="${x - 9}" y="${y - 2}" width="18" height="18" opacity=".8"/>`);
  }
  const lotes = [];
  let aVenda = st.fase === "lances" ? Math.min(3, st.lotes.filter((x) => !x).length) : 0;   // até 3 lotes livres vão a lance
  for (let k = 0; k < LOTES; k++) {
    const col = k % 6, lin = Math.floor(k / 6);
    const x = 520 + col * 44, y = 110 + lin * 62;
    // R7: no telão, casas numa cor neutra (sem cor de família); só destaca as de uma família quando pedido
    const dono = st.lotes[k] ? st.fams[st.lotes[k]] : null;
    const marcada = dono && destaque === dono.id;
    lotes.push(dono
      ? `<g transform="translate(${x} ${y})"><rect x="-19" y="-19" width="38" height="44" rx="7" fill="${marcada ? dono.cor2 : "#1b3352"}" opacity="${marcada ? ".55" : ".8"}"/><rect x="-19" y="21" width="38" height="4" rx="2" fill="#081526" opacity=".7"/><image href="${ICO}casa-${marcada ? dono.casa : "neutra"}.webp" x="-21" y="-20" width="42" height="42"/></g>`
      : aVenda-- > 0
        ? `<g transform="translate(${x} ${y})"><rect x="-19" y="-19" width="38" height="44" rx="7" fill="#2a2208" stroke="#fbbf24" stroke-width="2" stroke-dasharray="5 3"/><image href="${ICO}lote-venda.webp" x="-21" y="-21" width="42" height="42"/></g>`
        : `<g transform="translate(${x} ${y})"><rect x="-19" y="-19" width="38" height="44" rx="7" fill="#0b1a2c" stroke="#3b5875" stroke-dasharray="4 4"/></g>`);
  }
  const nivel = st.publico;
  const predios = [];
  for (let k = 1; k <= 5; k++) {
    const on = k <= nivel, x = 345 + ((k - 1) % 2) * 90, y = 150 + Math.floor((k - 1) / 2) * 84;
    predios.push(`<g transform="translate(${x} ${y})" opacity="${on ? 1 : 0.3}"><rect x="-32" y="-26" width="64" height="52" rx="8" fill="${on ? "url(#predio)" : "#1b3555"}" stroke="${on ? "#fde68a" : "#2a4a6e"}"/><path d="M-16 -2 L0 -16 L16 -2 Z" fill="${on ? "#fff7d6" : "#2a4a6e"}"/><rect x="-11" y="-2" width="22" height="16" rx="2" fill="${on ? "#fff7d6" : "#2a4a6e"}"/><text y="23" text-anchor="middle" font-size="14" font-weight="700" fill="${on ? "#3b2405" : "#6f89a6"}" font-family="Sora, sans-serif">${k}</text></g>`);
  }
  const corMata = fm < 0.3 ? "#fb7185" : fm < 0.5 ? "#fbbf24" : "#34d399";   // R13: as mesmas faixas da barra (30% e 50%)
  return `<svg class="metro mapa ${grande ? "grande" : ""}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Mapa da vila: mata em ${Math.round(fm * 100)}%, bem público nível ${nivel}">
    <defs>
      <linearGradient id="predio" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fcd34d"/><stop offset="1" stop-color="#b45309"/></linearGradient>
    </defs>
    <rect x="20" y="40" width="260" height="390" rx="18" fill="#0d2a1c" stroke="#1f5135"/>
    <text x="34" y="68" font-size="${fr}" font-weight="700" fill="#e8f1fb" font-family="Sora, sans-serif">Mata</text><text x="266" y="68" text-anchor="end" font-size="${fr}" font-weight="700" fill="${corMata}" font-family="JetBrains Mono, monospace">${pctL(fm)}</text>
    ${arv.join("")}
    <rect x="290" y="40" width="200" height="390" rx="18" fill="#1a1f33" stroke="#2c3560"/>
    <text x="${menor ? 299 : 304}" y="68" font-size="${fr}" font-weight="700" fill="#e8f1fb" font-family="Sora, sans-serif"${menor ? ' letter-spacing="-0.6"' : ""}>Bem público</text><text x="304" y="100" font-size="${fr}" fill="#fbbf24" font-family="Sora, sans-serif">nível ${nivel} de 5</text>
    ${predios.join("")}
    ${quebra(NIVEIS_PUBLICO[nivel], 11).map((l, k, ls) => `<text x="390" y="${420 - (ls.length - 1 - k) * (fr + 2)}" text-anchor="middle" font-size="${fr}" fill="#9fb6cf" font-family="Sora, sans-serif">${esc(l)}</text>`).join("")}
    <rect x="500" y="40" width="280" height="390" rx="18" fill="#10223b" stroke="#23415f"/>
    <text x="514" y="68" font-size="${fr}" font-weight="700" fill="#e8f1fb" font-family="Sora, sans-serif">Lotes</text><text x="766" y="68" text-anchor="end" font-size="${frL}" fill="#9fb6cf" font-family="Sora, sans-serif">${st.lotes.filter((x) => !x).length} livres</text>
    ${lotes.join("")}
  </svg>`;
}

// R13: linha do tempo em dois gráficos empilhados, cada um na sua escala e com letra grande:
// a mata (0 a 100%, com as linhas de 30% e 50%) e as duas desigualdades (0 a 0,5).
export function linhaDoTempo(hist, { F = 26, alto = 240, so = null } = {}) {
  if (!hist.length) return "";
  // R14: margem à direita para o valor do último ano (antes ficava cortado) e letra ajustável (o fechamento usa 30)
  const W = 600, H = alto, x0 = 70, x = (k) => x0 + (k * (W - x0 - 120)) / 4;
  const eixoX = (y) => `<line x1="${x0}" x2="${W - 110}" y1="${y}" y2="${y}" stroke="#2b4a6b" stroke-width="2"/>` +
    [1, 2, 3, 4, 5].map((a, k) => `<text x="${x(k)}" y="${y + F + 4}" text-anchor="middle" font-size="${F - 1}" fill="#a9bdd3" font-family="Sora, sans-serif">${k ? a : "ano 1"}</text>`).join("");
  const caminho = (vals, y) => vals.map((v, k) => `${k ? "L" : "M"}${x(k).toFixed(1)} ${y(v).toFixed(1)}`).join(" ");
  const ponto = (vals, y, cor, fmt) => { const k = vals.length - 1; return `<circle cx="${x(k)}" cy="${y(vals[k])}" r="7" fill="${cor}"/><text x="${x(k) + 12}" y="${y(vals[k]) + 8}" font-size="${F}" font-weight="700" fill="${cor}" font-family="Sora, sans-serif">${fmt(vals[k])}</text>`; };
  // Mata
  const ym = (v) => 56 + (1 - Math.max(0, Math.min(1, v))) * (H - 96);
  const mata = hist.map((h) => h.mata);
  const svgM = `<svg class="metro" viewBox="0 0 ${W} ${H}" role="img" aria-label="Mata por ano">
    <text x="0" y="${F}" font-size="${F}" font-weight="700" fill="#34d399" font-family="Sora, sans-serif">Mata</text>
    ${[0.3, 0.5].map((v) => `<line x1="${x0}" x2="${W - 110}" y1="${ym(v)}" y2="${ym(v)}" stroke="${v < 0.4 ? "#fb7185" : "#fbbf24"}" stroke-opacity=".55" stroke-width="2" stroke-dasharray="6 6"/><text x="${x0 - 8}" y="${v < 0.4 ? ym(v) + F - 6 : ym(v) - 2}" text-anchor="end" font-size="${F - 1}" fill="${v < 0.4 ? "#fca5a5" : "#fde68a"}" font-family="Sora, sans-serif">${100 * v}%</text>`).join("")}
    ${eixoX(H - 40)}<path d="${caminho(mata, ym)}" fill="none" stroke="#34d399" stroke-width="5" stroke-linejoin="round"/>${ponto(mata, ym, "#34d399", (v) => pctL(v))}</svg>`;
  // Desigualdades
  const gp = hist.map((h) => h.gini), gr = hist.map((h) => h.giniRenda ?? 0);
  const topo = Math.max(0.3, Math.ceil(10 * 1.15 * Math.max(...gp, ...gr, 0)) / 10);   // R20: escala até 0,3 (ou mais, se precisar): as subidas aparecem
  const yg = (v) => 56 + (1 - Math.max(0, Math.min(1, v / topo))) * (H - 96);
  const fmt = (v) => v.toFixed(2).replace(".", ",");
  const svgG = `<svg class="metro" viewBox="0 0 ${W} ${H}" role="img" aria-label="Desigualdade por ano">
    <text x="0" y="${F}" font-size="${F - 2}" font-weight="700" fill="#e8f1fb" font-family="Sora, sans-serif">Desigualdade</text><text x="${Math.round(F * 7.2)}" y="${F}" font-size="${F - 2}" font-weight="700" fill="#fca5a5" font-family="Sora, sans-serif">— patrimônio</text><text x="${Math.round(F * 14.6)}" y="${F}" font-size="${F - 2}" font-weight="700" fill="#fde68a" font-family="Sora, sans-serif">··· renda</text>
    <text x="${x0 - 8}" y="${yg(0) + 8}" text-anchor="end" font-size="${F - 1}" fill="#a9bdd3" font-family="Sora, sans-serif">0</text><text x="${x0 - 8}" y="${yg(topo) + 8}" text-anchor="end" font-size="${F - 1}" fill="#a9bdd3" font-family="Sora, sans-serif">${String(topo).replace(".", ",")}</text>
    ${eixoX(H - 40)}<path d="${caminho(gp, yg)}" fill="none" stroke="#fb7185" stroke-width="5"/><path d="${caminho(gr, yg)}" fill="none" stroke="#fbbf24" stroke-width="5" stroke-dasharray="3 9" stroke-linecap="round"/>
    ${ponto(gp, yg, "#fb7185", fmt)}</svg>`;
  // R14: no fechamento, só o gráfico da pergunta da vez (maior, com letra de TV)
  if (so) return `<div class="tempo1">${so === "mata" ? svgM : svgG}</div>`;
  return `<div class="tempo2">${svgM}${svgG}</div>`;
}
