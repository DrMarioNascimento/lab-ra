// Desenhos: ícones 3D (assets/icones) das famílias, o mapa da vila no telão e a linha do tempo.
// Casas e árvores vêm da pasta Cell do autor; formas e ícones de apoio são cópias próprias dos ícones 3D do MOSAICO Sala (ver assets/icones/origens.json).
import { NIVEIS_PUBLICO } from "../content/vila.js";
import { LOTES } from "../content/regras.js";

export const ICO = new URL("../../assets/icones/", import.meta.url).href;
// Ícone 3D de apoio (balança, meta, troféu...): <img> com sombra; tamanhos pelo CSS (.ico3, .g, .xl).
export const ico = (nome, cls = "", alt = "") => `<img class="ico3 ${cls}" src="${ICO}${nome}.webp" alt="${String(alt).replace(/"/g, "&quot;")}" draggable="false">`;

const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

// Ícone da família: a casa 3D na cor dela, com a forma 3D no canto (para ninguém depender só da cor).
export function iconeFamilia(f, tam = 34) {
  return `<span class="ico-fam" style="--t:${tam}px" role="img" aria-label="${esc(f.nome)}"><img class="casa" src="${ICO}casa-${f.casa || "neutra"}.webp" alt="" draggable="false"><img class="forma" src="${ICO}forma-${f.forma}.webp" alt="" draggable="false"></span>`;
}

// Mapa da vila: a mata à esquerda, o bem público ao centro, os 24 lotes à direita.
export function mapaVila(st, { grande = true, destaque = null } = {}) {
  const W = 800, H = 450;
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
    predios.push(`<g transform="translate(${x} ${y})" opacity="${on ? 1 : 0.3}"><rect x="-32" y="-26" width="64" height="52" rx="8" fill="${on ? "url(#predio)" : "#1b3555"}" stroke="${on ? "#fde68a" : "#2a4a6e"}"/><path d="M-16 -2 L0 -16 L16 -2 Z" fill="${on ? "#fff7d6" : "#2a4a6e"}"/><rect x="-11" y="-2" width="22" height="16" rx="2" fill="${on ? "#fff7d6" : "#2a4a6e"}"/><text y="23" text-anchor="middle" font-size="11" font-weight="700" fill="${on ? "#3b2405" : "#6f89a6"}" font-family="Sora, sans-serif">${k}</text></g>`);
  }
  const corMata = fm < 0.15 ? "#fb7185" : fm < 0.3 ? "#fbbf24" : "#34d399";
  return `<svg class="metro ${grande ? "grande" : ""}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Mapa da vila: mata em ${Math.round(fm * 100)}%, bem público nível ${nivel}">
    <defs>
      <linearGradient id="predio" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fcd34d"/><stop offset="1" stop-color="#b45309"/></linearGradient>
    </defs>
    <rect x="20" y="40" width="260" height="390" rx="18" fill="#0d2a1c" stroke="#1f5135"/>
    <text x="34" y="68" font-size="20" font-weight="700" fill="#e8f1fb" font-family="Sora, sans-serif">Mata comum</text><text x="266" y="68" text-anchor="end" font-size="20" font-weight="700" fill="${corMata}" font-family="JetBrains Mono, monospace">${Math.round(fm * 100)}%</text>
    ${arv.join("")}
    <rect x="290" y="40" width="200" height="390" rx="18" fill="#1a1f33" stroke="#2c3560"/>
    <text x="304" y="68" font-size="20" font-weight="700" fill="#e8f1fb" font-family="Sora, sans-serif">Bem público</text><text x="304" y="92" font-size="15" fill="#fbbf24" font-family="Sora, sans-serif">nível ${nivel} de 5</text>
    ${predios.join("")}
    <text x="390" y="412" text-anchor="middle" font-size="15" fill="#9fb6cf" font-family="Sora, sans-serif">${esc(NIVEIS_PUBLICO[nivel])}</text>
    <rect x="500" y="40" width="280" height="390" rx="18" fill="#10223b" stroke="#23415f"/>
    <text x="514" y="68" font-size="20" font-weight="700" fill="#e8f1fb" font-family="Sora, sans-serif">Lotes</text><text x="766" y="68" text-anchor="end" font-size="15" fill="#9fb6cf" font-family="Sora, sans-serif">${st.lotes.filter((x) => !x).length} livres · ${st.lotes.filter(Boolean).length} ocupados</text>
    ${lotes.join("")}
  </svg>`;
}

// Linha do tempo pequena (mata e desigualdade por ano).
export function linhaDoTempo(hist) {
  if (!hist.length) return "";
  const W = 520, H = 170, x = (k) => 40 + (k * (W - 70)) / 4, y = (v) => H - 30 - v * (H - 55);
  const lm = hist.map((h, k) => `${k ? "L" : "M"}${x(k).toFixed(1)} ${y(h.mata).toFixed(1)}`).join(" ");
  const lg = hist.map((h, k) => `${k ? "L" : "M"}${x(k).toFixed(1)} ${y(Math.min(1, h.gini * 2)).toFixed(1)}`).join(" ");
  // R10: a desigualdade da renda do ano (por pessoa, depois do aluguel) ao lado da do patrimônio
  const lr = hist.map((h, k) => `${k ? "L" : "M"}${x(k).toFixed(1)} ${y(Math.min(1, (h.giniRenda ?? 0) * 2)).toFixed(1)}`).join(" ");
  return `<svg class="metro" viewBox="0 0 ${W} ${H}" role="img" aria-label="Mata e desigualdade por ano">
    <line x1="40" x2="${W - 20}" y1="${H - 30}" y2="${H - 30}" stroke="#23415f"/>
    ${[1, 2, 3, 4, 5].map((a, k) => `<text x="${x(k)}" y="${H - 10}" text-anchor="middle" class="st-sub">ano ${a}</text>`).join("")}
    <path d="${lm}" fill="none" stroke="#34d399" stroke-width="3"/><path d="${lg}" fill="none" stroke="#fb7185" stroke-width="3" stroke-dasharray="6 4"/><path d="${lr}" fill="none" stroke="#fbbf24" stroke-width="3" stroke-dasharray="2 4"/>
    <line x1="40" x2="${W - 20}" y1="${y(0.3).toFixed(1)}" y2="${y(0.3).toFixed(1)}" stroke="#34d399" stroke-opacity=".35" stroke-dasharray="3 5"/>
    <text x="${W - 18}" y="${(y(0.3) - 3).toFixed(1)}" text-anchor="end" class="st-sub" style="fill:#34d399;opacity:.7">30%</text>
    <text x="44" y="18" class="st-sub" style="fill:#34d399">— mata</text><text x="120" y="18" class="st-sub" style="fill:#fb7185">- - desigualdade do patrimônio</text><text x="335" y="18" class="st-sub" style="fill:#fbbf24">··· desigualdade da renda</text>
  </svg>`;
}
