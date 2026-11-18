// Limiar Ético · gráficos em SVG com profundidade 3D (usados na revelação do aluno, na vista do professor e na turma).
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const COR = { razao: '#1558b2', emocao: '#a8441b', impulso: '#126e5e' };
export const NOME = { razao: 'Razão', emocao: 'Emoção', impulso: 'Impulso' };
export const COR_CERTO = '#6250d6', COR_DESFECHO = '#a86d0a';

/* ---------- Gráficos ---------- */
const L = { w: 340, esq: 30, dir: 16 };
const xDe = (i, n, dirExtra = 0) => {
  const largura = L.w - L.esq - L.dir - dirExtra;
  return n === 1 ? L.esq + largura / 2 : L.esq + (largura * i) / (n - 1);
};
const numeros = (pontos, x, y, sel) => pontos.map((p, i) =>
  `<text class="eixo" x="${x(i)}" y="${y}" text-anchor="middle" ${i === sel ? 'font-weight="700" fill="#1d1b16"' : ''}>${p.n}</text>`).join('');
const alvosDe = (pontos, x, H, comFoco) => {
  const passo = pontos.length > 1 ? x(1) - x(0) : 40;
  return pontos.map((p, i) => `<rect class="ponto-alvo" data-acao="sel" data-i="${i}" ${comFoco ? `tabindex="0" role="button" aria-label="Decisão ${p.n}, ${esc(p.hora)}, ${esc(p.titulo)}"` : 'aria-hidden="true"'}
      x="${x(i) - passo / 2}" y="0" width="${passo}" height="${H}" fill="transparent"/>`).join('');
};


/* ---------- Profundidade 3D dos gráficos ---------- */
const escurece = (hex, f) => '#' + [1, 3, 5].map(i => Math.max(0, Math.min(255, Math.round(parseInt(hex.slice(i, i + 2), 16) * f))).toString(16).padStart(2, '0')).join('');
const clareia = (hex, f) => '#' + [1, 3, 5].map(i => { const v = parseInt(hex.slice(i, i + 2), 16); return Math.round(v + (255 - v) * f).toString(16).padStart(2, '0'); }).join('');
const DX = 4, DY = 3;
/* Barra vertical em prisma: frente, lateral direita escura e topo claro; sombra no chão. */
function barra3d(x, y, w, h, paraCima, cor) {
  if (h <= 0.5) return '';
  const ty = paraCima ? y : y + h; // aresta onde fica o topo visível
  return `<g class="barra">
    <ellipse cx="${x + w / 2 + DX / 2}" cy="${paraCima ? y + h + 1 : y - 1}" rx="${w / 2 + DX}" ry="2" fill="#2b21501f"/>
    <path d="M${x + w},${y} L${x + w + DX},${y - DY} V${y + h - DY} L${x + w},${y + h} Z" fill="${escurece(cor, .66)}"/>
    <path d="M${x},${ty} L${x + DX},${ty - DY} H${x + w + DX} L${x + w},${ty} Z" fill="${clareia(cor, .45)}"/>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${cor}"/>
    <rect x="${x + 1.5}" y="${y}" width="2.5" height="${h}" fill="#fff" opacity=".28"/></g>`;
}
/* Barra horizontal em prisma. */
function barraH3d(x, y, w, h, cor) {
  return `<g class="barra">
    <path d="M${x},${y + h} L${x + DX},${y + h + DY} H${x + w + DX} L${x + w},${y + h} Z" fill="${escurece(cor, .62)}"/>
    <path d="M${x + w},${y} L${x + w + DX},${y + DY} V${y + h + DY} L${x + w},${y + h} Z" fill="${escurece(cor, .74)}"/>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${cor}"/>
    <rect x="${x}" y="${y + 1.5}" width="${w}" height="3" fill="#fff" opacity=".28"/></g>`;
}

export function graficoLinhas(pontos, sel, interativo = true) {
  const n = pontos.length, H = 196, topoG = 12, base = 162, rotulos = 54;
  const y = v => base - v * (base - topoG);
  const x = i => xDe(i, n, rotulos);
  const series = ['razao', 'emocao', 'impulso'];
  const grade = [0, 0.5, 1].map(v => `<line x1="${L.esq}" x2="${x(n - 1)}" y1="${y(v)}" y2="${y(v)}" stroke="#e7e2d6" stroke-width="1"/>
    <text class="eixo" x="${L.esq - 6}" y="${y(v) + 4}" text-anchor="end">${v === 0 ? '0' : v === 1 ? 'alto' : ''}</text>`).join('');
  const guia = sel < 0 ? '' : `<line x1="${x(sel)}" x2="${x(sel)}" y1="${topoG - 4}" y2="${base}" stroke="#b3a37f" stroke-width="1" stroke-dasharray="3 3"/>`;
  const trilha = s => `M${pontos.map((p, i) => `${x(i)},${y(p[s])}`).join(' L')}`;
  const linhas = series.map((s, k) => {
    const d = trilha(s), fio = (extra, larg, cor, op) => `<path class="linha-serie" style="--s:${k}" pathLength="1" fill="none" stroke="${cor}" stroke-opacity="${op}" stroke-width="${larg}" stroke-linejoin="round" stroke-linecap="round" transform="translate(${extra})" d="${d}"/>`;
    return `<g>${fio('1.5,4', 4, '#2b2150', .16)}${fio('0,1.2', 4.2, escurece(COR[s], .62), 1)}${fio('0,0', 3.4, COR[s], 1)}${fio('0,-.9', 1, '#ffffff', .5)}</g>`;
  }).join('');
  const marcas = series.map(s => pontos.map((p, i) => {
    const r = i === sel ? 5.8 : 4.4, cx = x(i), cy = y(p[s]);
    return `<g class="marca"><ellipse cx="${cx + 1.5}" cy="${cy + r + 1.5}" rx="${r}" ry="1.8" fill="#2b21502e"/>
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="${escurece(COR[s], .78)}" stroke="#fcfcfb" stroke-width="1.6"/>
      <circle cx="${cx - r * .12}" cy="${cy - r * .14}" r="${r * .72}" fill="${COR[s]}"/>
      <circle cx="${cx - r * .36}" cy="${cy - r * .4}" r="${r * .26}" fill="#fff" opacity=".7"/></g>`;
  }).join('')).join('');
  // rótulos diretos no fim das linhas, afastados para não colidir
  const finais = series.map(s => ({ s, y: y(pontos[n - 1][s]) })).sort((a, b) => a.y - b.y);
  for (let i = 1; i < finais.length; i++) if (finais[i].y - finais[i - 1].y < 13) finais[i].y = finais[i - 1].y + 13;
  const nomes = finais.map(f => `<text class="rot-serie fim" x="${x(n - 1) + 9}" y="${f.y + 4}">${NOME[f.s]}</text>`).join('');
  return `<svg class="grafico" viewBox="0 0 ${L.w} ${H}" role="group" aria-label="Razão, emoção e impulso em cada decisão do dia">
    ${grade}${guia}${linhas}${marcas}${nomes}${numeros(pontos, x, base + 16, sel)}
    <text class="eixo" x="${L.esq}" y="${H - 2}">decisões do dia, em ordem</text>${interativo ? alvosDe(pontos, x, H, true) : ''}</svg>`;
}

export function graficoCertoDesfecho(pontos, sel, interativo = true) {
  const n = pontos.length, H = 150, meio = 68, alt = 50, larg = 14;
  const x = i => xDe(i, n);
  const barras = pontos.map((p, i) => {
    const h = Math.abs(p.certoDesfecho) * alt;
    const cima = p.certoDesfecho >= 0;
    return barra3d(x(i) - larg / 2, cima ? meio - h : meio, larg, h, cima, cima ? COR_CERTO : COR_DESFECHO);
  }).join('');
  return `<svg class="grafico" viewBox="0 0 ${L.w} ${H}" role="img" aria-label="Busca do certo e busca do desfecho em cada decisão">
    <line x1="${L.esq - 12}" x2="${L.w - 4}" y1="${meio}" y2="${meio}" stroke="#b3a37f" stroke-width="1"/>
    <text class="rot-serie" x="2" y="14">o certo</text>
    <text class="rot-serie" x="2" y="${meio + alt + 6}">o desfecho</text>
    ${barras}${numeros(pontos, x, H - 6, sel)}${interativo ? alvosDe(pontos, x, H, false) : ''}</svg>`;
}

export function graficoMargem(pontos, sel, interativo = true) {
  const n = pontos.length, H = 120, base = 92, alt = 76, larg = 14;
  const x = i => xDe(i, n);
  const barras = pontos.map((p, i) => barra3d(x(i) - larg / 2, base - p.margem * alt, larg, p.margem * alt, true, i === sel ? '#184f95' : '#2a78d6')).join('');
  return `<svg class="grafico" viewBox="0 0 ${L.w} ${H}" role="img" aria-label="Margem de escolha em cada momento">
    <line x1="${L.esq - 12}" x2="${L.w - 4}" y1="${base}" y2="${base}" stroke="#b3a37f" stroke-width="1"/>
    ${barras}${numeros(pontos, x, H - 8, sel)}${interativo ? alvosDe(pontos, x, H, false) : ''}</svg>`;
}

export function graficoEscala(escala) {
  const linha = 30, esq = 112, max = Math.max(...escala.map(e => e.parte), 0.01), larguraMax = L.w - esq - 44;
  const H = escala.length * linha + 6;
  const itens = escala.map((e, i) => {
    const w = (e.parte / max) * larguraMax, y = 6 + i * linha;
    const barra = w > 4.5 ? barraH3d(esq, y, w, 18, '#2a78d6') : '';
    return `<text class="rot-serie" x="${esq - 8}" y="${y + 13}" text-anchor="end">${esc(e.nome)}</text>${barra}
      <text class="rot-valor" x="${esq + Math.max(w, 0) + 6}" y="${y + 13}">${Math.round(e.parte * 100)}%</text>`;
  }).join('');
  return `<svg class="grafico" viewBox="0 0 ${L.w} ${H}" role="img" aria-label="Peso de cada corrente ética no seu dia">
    <line x1="${esq}" x2="${esq}" y1="2" y2="${H - 2}" stroke="#b3a37f" stroke-width="1"/>${itens}</svg>`;
}

