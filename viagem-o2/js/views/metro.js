// Mapa de metrô "Linha O₂": o circuito do sangue com as estações (postos).
import { POSTOS } from "../content/viagem.js";

export const POS = {
  ventilacao: [150, 95], difusao: [350, 95], arterial: [550, 95], coracao: [740, 95],
  distribuicao: [840, 220], tecido: [600, 345], retorno: [300, 345],
};

const iconsBase = new URL("../../assets/icons/", import.meta.url);

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
      ${e.destaque ? `<circle cx="${x}" cy="${y}" r="34" fill="none" stroke="${e.destaque}" stroke-width="4" opacity=".9"></circle>` : ""}
      <circle cx="${x}" cy="${y + 4}" r="24" fill="#020812" opacity=".6"/>
      <circle cx="${x}" cy="${y}" r="24" fill="${cor}" stroke="#e8f1fb" stroke-width="4"/>
      <image class="station-art" href="${iconsBase}${p.id}.svg" x="${x - 21}" y="${y - 24}" width="42" height="42"/>
      ${e.status ? `<rect x="${x + 16}" y="${y + 7}" width="${e.status.length > 1 ? 38 : 23}" height="21" rx="7" fill="#071727" stroke="${cor}" stroke-width="1.5"/><text x="${x + (e.status.length > 1 ? 35 : 27.5)}" y="${y + 22}" text-anchor="middle" font-size="13" font-weight="800" fill="#fff">${esc(e.status)}</text>` : ""}
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
    <text x="480" y="205" text-anchor="middle" class="schematic-label">LINHA O₂ · MAPA DE ESTAÇÕES</text><text x="480" y="233" text-anchor="middle" class="map-note">Do ar à utilização nos tecidos</text>
    ${trem ? `<g class="o2-motion"><circle class="o2-traveller" cx="-6" r="8"/><circle class="o2-traveller" cx="6" cy="5" r="8"/><animateMotion dur="14s" repeatCount="indefinite" path="${loop}"/></g><g class="o2-still" style="display:none" transform="translate(470 95)"><circle class="o2-traveller" cx="-6" r="8"/><circle class="o2-traveller" cx="6" cy="5" r="8"/></g>` : ""}
    ${nodes}
  </svg>`;
}

export { esc };
