// Mapa de metrô "Linha O₂": o circuito do sangue com as estações (postos).
import { POSTOS } from "../content/viagem.js";

export const POS = {
  ventilacao: [150, 95], difusao: [350, 95], arterial: [550, 95], coracao: [740, 95],
  distribuicao: [840, 220], tecido: [600, 345], retorno: [300, 345],
};

const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

// estacoes: { [postoId]: { cor, rotulo, valor, destaque, apagado, status } }
export function metroSVG(estacoes = {}, { trem = true, alt = 460, grande = false } = {}) {
  const art = "M 350 95 L 760 95 Q 840 95 840 175 L 840 270 Q 840 345 760 345 L 600 345";
  const ven = "M 600 345 L 180 345 Q 100 345 100 265 L 100 175 Q 100 95 180 95 L 350 95";
  const loop = art + " " + ven.replace("M 600 345", "L 600 345");
  const nodes = POSTOS.map((p) => {
    const [x, y] = POS[p.id];
    const e = estacoes[p.id] || {};
    const cor = e.cor || "#334e6e";
    const op = e.apagado ? 0.35 : 1;
    const lado = p.id === "distribuicao";
    const below = y > 300;
    const ly = lado ? y - 6 : below ? y + 50 : y - (grande ? 70 : 58);
    const lx = lado ? x + 36 : x;
    const anc = lado ? "start" : "middle";
    return `<g opacity="${op}">
      ${e.destaque ? `<circle cx="${x}" cy="${y}" r="34" fill="none" stroke="${e.destaque}" stroke-width="4" opacity=".9"><animate attributeName="r" values="30;38;30" dur="1.8s" repeatCount="indefinite"/></circle>` : ""}
      <circle cx="${x}" cy="${y + 4}" r="24" fill="#020812" opacity=".6"/>
      <circle cx="${x}" cy="${y}" r="24" fill="${cor}" stroke="#e8f1fb" stroke-width="4"/>
      <circle cx="${x - 7}" cy="${y - 8}" r="7" fill="#fff" opacity=".35"/>
      ${e.status ? `<text x="${x}" y="${y + 6}" text-anchor="middle" font-size="18" font-weight="800" fill="#fff">${esc(e.status)}</text>` : ""}
      <text class="st-label" x="${lx}" y="${ly}" text-anchor="${anc}">${esc(p.curto)}</text>
      ${e.rotulo ? `<text class="st-sub" x="${lx}" y="${ly + (grande ? 22 : 18)}" text-anchor="${anc}">${esc(e.rotulo)}</text>` : ""}
      ${e.valor ? `<text class="st-val" x="${lx}" y="${ly + (e.rotulo ? (grande ? 44 : 36) : (grande ? 22 : 18))}" text-anchor="${anc}">${esc(e.valor)}</text>` : ""}
    </g>`;
  }).join("");
  return `<svg class="metro${grande ? " grande" : ""}" viewBox="0 -10 1060 ${alt}" role="img" aria-label="Linha O₂: circuito do sangue com as estações">
    <path d="${art}" fill="none" stroke="#7f1d2d" stroke-width="22" stroke-linecap="round"/>
    <path d="${art}" fill="none" stroke="var(--art)" stroke-width="14" stroke-linecap="round"/>
    <path d="${ven}" fill="none" stroke="#2e2a7a" stroke-width="22" stroke-linecap="round"/>
    <path d="${ven}" fill="none" stroke="var(--ven)" stroke-width="14" stroke-linecap="round"/>
    <text x="560" y="140" text-anchor="middle" class="st-sub">sangue arterial →</text>
    <text x="450" y="318" text-anchor="middle" class="st-sub">← sangue venoso</text>
    ${trem ? `<g><circle r="11" fill="var(--o2)" stroke="#fff" stroke-width="3"><animateMotion dur="9s" repeatCount="indefinite" path="${loop}"/></circle></g>` : ""}
    ${nodes}
  </svg>`;
}

export { esc };
