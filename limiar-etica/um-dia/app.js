// Percurso / Limiar Ético · Um dia — interface.
import { ABERTURA, SINTESE, MOTIVOS, VERSAO, CENAS } from './dados.js';
import { novoEstado, cenaAtual, totalCenas, janelaInfo, decidir, terminou, resumo } from './motor.js';

const app = document.querySelector('#app');
const topo = document.querySelector('#topo');
const COR = { razao: '#2a78d6', emocao: '#eb6834', impulso: '#1baf7a' };
const NOME = { razao: 'Razão', emocao: 'Emoção', impulso: 'Impulso' };
const COR_CERTO = '#6250d6', COR_DESFECHO = '#a86d0a';

let est = null;
let visao = null;          // dados da cena em exibição
let rev = null;            // dados da revelação
const contestacoes = {};   // índice da decisão -> motivo escolhido (só em memória)

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const embaralhar = n => { const a = [...Array(n).keys()]; for (let i = n - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
function foco() { app.focus({ preventScroll: true }); window.scrollTo({ top: 0 }); }

/* ---------- O céu acompanha a hora ---------- */
function horaDecimal(hora) { const [h, m] = hora.split('h').map(Number); return h + (m || 0) / 60; }
function faseDe(hora) {
  const h = horaDecimal(hora);
  return h < 8 ? 'alvorada' : h < 12 ? 'manha' : h < 16 ? 'tarde' : h < 19 ? 'poente' : 'noite';
}
function ceu(fase) { document.body.dataset.fase = fase; }
const PERIODO = { alvorada: 'Manhã cedo', manha: 'Manhã', tarde: 'Tarde', poente: 'Fim de tarde', noite: 'Noite' };

// O arco do dia na abertura: os momentos que virão, do amanhecer à noite.
function arcoCapa() {
  const P0 = [16, 70], P1 = [160, -34], P2 = [304, 70];
  const em = t => [0, 1].map(k => (1 - t) ** 2 * P0[k] + 2 * (1 - t) * t * P1[k] + t ** 2 * P2[k]);
  const horas = CENAS.map(c => c.hora).concat('23h00');
  const pontos = horas.map(h => em(Math.min(1, Math.max(0, (horaDecimal(h) - 6) / 18))));
  const [sx, sy] = pontos[0];
  return `<svg class="arco-capa" viewBox="0 0 320 96" aria-hidden="true">
    <line class="horizonte" x1="6" y1="72" x2="314" y2="72"/>
    <path class="trilho" d="M${P0} Q${P1} ${P2}"/>
    ${pontos.slice(1).map(([x, y]) => `<circle class="momento" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.5"/>`).join('')}
    <circle class="halo" cx="${sx.toFixed(1)}" cy="${sy.toFixed(1)}" r="13"/><circle class="sol" cx="${sx.toFixed(1)}" cy="${sy.toFixed(1)}" r="7.5"/>
    <text x="16" y="90">manhã</text><text x="160" y="90" text-anchor="middle">tarde</text><text x="304" y="90" text-anchor="end">noite</text>
  </svg>`;
}

/* ---------- Abertura ---------- */
function telaAbertura() {
  ceu('alvorada');
  topo.hidden = true;
  topo.innerHTML = '';
  app.innerHTML = `
    <div class="estreita">
      <section class="cartao capa-dia entra">
        <p class="rotulo">Percurso / Limiar Ético</p>
        ${arcoCapa()}
        <h1>${esc(ABERTURA.titulo)}</h1>
        ${ABERTURA.texto.map(p => `<p>${esc(p)}</p>`).join('')}
        <div class="acoes"><button class="btn principal" data-acao="comecar">Começar o dia</button></div>
      </section>
      <p class="aviso entra" style="--n:1">Esta é uma simulação para aprender e discutir. Leva de 15 a 20 minutos. Nada do que você escolher é salvo: ao fechar a página, o percurso some.</p>
      <p class="versao entra" style="--n:2">Versão ${esc(VERSAO)}</p>
    </div>`;
  foco();
}

/* ---------- O dia ---------- */
// O cabeçalho do dia é montado uma vez e depois só atualizado, para o astro deslizar no arco.
function barraDoDia(cena) {
  const total = totalCenas(est);
  topo.hidden = false;
  if (!topo.querySelector('.topo-dia')) {
    topo.innerHTML = `<div class="topo-dia">
        <div class="topo-linha">
          <span class="hora" aria-label="Hora do dia"></span>
          <div class="arco-caixa" aria-hidden="true">
            <svg class="arco" viewBox="0 0 200 40" preserveAspectRatio="none">
              <line class="horizonte" x1="2" y1="37" x2="198" y2="37"/>
              <path class="trilho" d="M8,36 Q100,-28 192,36"/>
              <path class="feito" d="M8,36"/>
            </svg>
            <span class="astro"></span>
          </div>
        </div>
        <div class="passos" role="img"></div>
      </div>`;
  }
  topo.querySelector('.hora').textContent = cena.hora;
  const passos = topo.querySelector('.passos');
  passos.setAttribute('aria-label', `Momento ${est.pos + 1} de ${total}`);
  passos.innerHTML = Array.from({ length: total }, (_, i) => `<span class="${i < est.pos ? 'feito' : i === est.pos ? 'agora' : ''}"></span>`).join('');
  // Posição no arco (curva quadrática de 8,36 a 192,36 com controle em 100,-28); o trecho percorrido é a mesma curva cortada em t.
  const t = Math.min(1, Math.max(0, (horaDecimal(cena.hora) - 6) / 18));
  const P0 = [8, 36], P1 = [100, -28], P2 = [192, 36];
  const mix = (a, b) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  const q = mix(P0, P1), fim = mix(q, mix(P1, P2));
  const astro = topo.querySelector('.astro');
  astro.style.left = `${(fim[0] / 200) * 100}%`;
  astro.style.top = `${(fim[1] / 40) * 100}%`;
  topo.querySelector('.feito').setAttribute('d', `M${P0} Q${q.map(v => v.toFixed(2))} ${fim.map(v => v.toFixed(2))}`);
}

function telaCena() {
  const cena = cenaAtual(est);
  const janela = janelaInfo(est, cena);
  visao = { cena, ordem: embaralhar(cena.opcoes.length), inicio: performance.now(), abriuInfo: false, infoDisponivel: janela > 0, relogio: null };
  ceu(faseDe(cena.hora));
  barraDoDia(cena);
  const contado = cena.info && Number.isFinite(janela) && janela > 0;
  const botaoInfo = cena.info
    ? (janela > 0
        ? `<div id="zona-info" style="margin-top:18px"><button class="btn secundario${contado ? ' com-tempo' : ''}" ${contado ? `style="--janela:${janela}s"` : ''} data-acao="info">${esc(cena.info.rotulo)}</button></div>`
        : `<p class="sem-tempo" id="zona-info">Não há tempo para conferir mais nada agora.</p>`)
    : '';
  app.innerHTML = `
    <div class="cena-grade">
      <section class="cartao pagina entra">
        <span class="aba-hora">${PERIODO[faseDe(cena.hora)]}</span>
        <h2>${esc(cena.titulo)}</h2>
        <p class="cena-texto">${esc(cena.texto)}</p>
        ${botaoInfo}
      </section>
      <section class="lado" aria-label="O que você faz?">
        <p class="etiqueta entra" style="--n:1">O que você faz?</p>
        <div class="opcoes">
          ${visao.ordem.map((i, k) => `<button class="btn entra" style="--n:${k + 2}" data-acao="escolher" data-i="${i}">${esc(cena.opcoes[i].t)}</button>`).join('')}
        </div>
      </section>
    </div>`;
  if (contado) {
    visao.relogio = setTimeout(() => {
      const zona = document.querySelector('#zona-info');
      if (zona && !visao.abriuInfo) {
        visao.infoDisponivel = false;
        zona.outerHTML = `<p class="sem-tempo" id="zona-info">Não há mais tempo para conferir isso agora.</p>`;
      }
    }, janela * 1000);
  }
  foco();
}

function abrirInfo() {
  visao.abriuInfo = true;
  const zona = document.querySelector('#zona-info');
  zona.outerHTML = `<div class="info nova" id="zona-info"><p>${esc(visao.cena.info.texto)}</p></div>`;
}

function escolher(i) {
  clearTimeout(visao.relogio);
  const cena = visao.cena;
  const texto = cena.opcoes[i].t;
  const desfecho = decidir(est, i, {
    tempoMs: performance.now() - visao.inicio,
    abriuInfo: visao.abriuInfo,
    infoDisponivel: visao.infoDisponivel
  });
  const fim = terminou(est);
  app.innerHTML = `
    <div class="estreita">
      <section class="cartao pagina entra">
        <span class="aba-hora">${PERIODO[faseDe(cena.hora)]}</span>
        <p class="rotulo">${esc(cena.titulo)}</p>
        <p class="escolhido">${esc(texto)}</p>
        <p class="desfecho">${esc(desfecho)}</p>
        <div class="acoes"><button class="btn principal" data-acao="${fim ? 'revelar' : 'seguir'}">${fim ? 'Encerrar o dia' : 'Continuar'}</button></div>
      </section>
    </div>`;
  foco();
}

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

function graficoLinhas(pontos, sel) {
  const n = pontos.length, H = 196, topoG = 12, base = 162, rotulos = 54;
  const y = v => base - v * (base - topoG);
  const x = i => xDe(i, n, rotulos);
  const series = ['razao', 'emocao', 'impulso'];
  const grade = [0, 0.5, 1].map(v => `<line x1="${L.esq}" x2="${x(n - 1)}" y1="${y(v)}" y2="${y(v)}" stroke="#e7e2d6" stroke-width="1"/>
    <text class="eixo" x="${L.esq - 6}" y="${y(v) + 4}" text-anchor="end">${v === 0 ? '0' : v === 1 ? 'alto' : ''}</text>`).join('');
  const guia = `<line x1="${x(sel)}" x2="${x(sel)}" y1="${topoG - 4}" y2="${base}" stroke="#b3a37f" stroke-width="1" stroke-dasharray="3 3"/>`;
  const linhas = series.map((s, k) => `<path class="linha-serie" style="--s:${k}" pathLength="1" fill="none" stroke="${COR[s]}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"
      d="M${pontos.map((p, i) => `${x(i)},${y(p[s])}`).join(' L')}"/>`).join('');
  const marcas = series.map(s => pontos.map((p, i) =>
    `<circle class="marca" cx="${x(i)}" cy="${y(p[s])}" r="${i === sel ? 5.5 : 4}" fill="${COR[s]}" stroke="#fcfcfb" stroke-width="2"/>`).join('')).join('');
  // rótulos diretos no fim das linhas, afastados para não colidir
  const finais = series.map(s => ({ s, y: y(pontos[n - 1][s]) })).sort((a, b) => a.y - b.y);
  for (let i = 1; i < finais.length; i++) if (finais[i].y - finais[i - 1].y < 13) finais[i].y = finais[i - 1].y + 13;
  const nomes = finais.map(f => `<text class="rot-serie fim" x="${x(n - 1) + 9}" y="${f.y + 4}">${NOME[f.s]}</text>`).join('');
  return `<svg class="grafico" viewBox="0 0 ${L.w} ${H}" role="group" aria-label="Razão, emoção e impulso em cada decisão do dia">
    ${grade}${guia}${linhas}${marcas}${nomes}${numeros(pontos, x, base + 16, sel)}
    <text class="eixo" x="${L.esq}" y="${H - 2}">decisões do dia, em ordem</text>${alvosDe(pontos, x, H, true)}</svg>`;
}

function barraArredondada(x, y, w, h, paraCima, cor) {
  const r = Math.min(4, Math.abs(h), w / 2);
  if (h <= 0.5) return '';
  const d = paraCima
    ? `M${x},${y + h} V${y + r} Q${x},${y} ${x + r},${y} H${x + w - r} Q${x + w},${y} ${x + w},${y + r} V${y + h} Z`
    : `M${x},${y} V${y + h - r} Q${x},${y + h} ${x + r},${y + h} H${x + w - r} Q${x + w},${y + h} ${x + w},${y + h - r} V${y} Z`;
  return `<path class="barra" d="${d}" fill="${cor}"/>`;
}

function graficoCertoDesfecho(pontos, sel) {
  const n = pontos.length, H = 150, meio = 68, alt = 50, larg = 14;
  const x = i => xDe(i, n);
  const barras = pontos.map((p, i) => {
    const h = Math.abs(p.certoDesfecho) * alt;
    const cima = p.certoDesfecho >= 0;
    return barraArredondada(x(i) - larg / 2, cima ? meio - h : meio, larg, h, cima, cima ? COR_CERTO : COR_DESFECHO);
  }).join('');
  return `<svg class="grafico" viewBox="0 0 ${L.w} ${H}" role="img" aria-label="Busca do certo e busca do desfecho em cada decisão">
    <line x1="${L.esq - 12}" x2="${L.w - 4}" y1="${meio}" y2="${meio}" stroke="#b3a37f" stroke-width="1"/>
    <text class="rot-serie" x="2" y="14">o certo</text>
    <text class="rot-serie" x="2" y="${meio + alt + 6}">o desfecho</text>
    ${barras}${numeros(pontos, x, H - 6, sel)}${alvosDe(pontos, x, H, false)}</svg>`;
}

function graficoMargem(pontos, sel) {
  const n = pontos.length, H = 120, base = 92, alt = 76, larg = 14;
  const x = i => xDe(i, n);
  const barras = pontos.map((p, i) => barraArredondada(x(i) - larg / 2, base - p.margem * alt, larg, p.margem * alt, true, i === sel ? '#184f95' : '#2a78d6')).join('');
  return `<svg class="grafico" viewBox="0 0 ${L.w} ${H}" role="img" aria-label="Margem de escolha em cada momento">
    <line x1="${L.esq - 12}" x2="${L.w - 4}" y1="${base}" y2="${base}" stroke="#b3a37f" stroke-width="1"/>
    ${barras}${numeros(pontos, x, H - 8, sel)}${alvosDe(pontos, x, H, false)}</svg>`;
}

function graficoEscala(escala) {
  const linha = 30, esq = 112, max = Math.max(...escala.map(e => e.parte), 0.01), larguraMax = L.w - esq - 44;
  const H = escala.length * linha + 6;
  const itens = escala.map((e, i) => {
    const w = (e.parte / max) * larguraMax, y = 6 + i * linha;
    const barra = w > 4.5 ? `<path class="barra" d="M${esq},${y} H${esq + w - 4} Q${esq + w},${y} ${esq + w},${y + 4} V${y + 14} Q${esq + w},${y + 18} ${esq + w - 4},${y + 18} H${esq} Z" fill="#2a78d6"/>` : '';
    return `<text class="rot-serie" x="${esq - 8}" y="${y + 13}" text-anchor="end">${esc(e.nome)}</text>${barra}
      <text class="rot-valor" x="${esq + Math.max(w, 0) + 6}" y="${y + 13}">${Math.round(e.parte * 100)}%</text>`;
  }).join('');
  return `<svg class="grafico" viewBox="0 0 ${L.w} ${H}" role="img" aria-label="Peso de cada corrente ética no seu dia">
    <line x1="${esq}" x2="${esq}" y1="2" y2="${H - 2}" stroke="#b3a37f" stroke-width="1"/>${itens}</svg>`;
}

/* ---------- Revelação ---------- */
function sinaisDe(p) {
  const s = [];
  if (p.tinhaInfo) s.push(p.abriuInfo ? 'Conferiu a informação antes de decidir' : 'Decidiu sem conferir a informação');
  if (p.tempoS != null) s.push(`Decidiu em ${p.tempoS} s`);
  return s.map(t => `<span class="sinal">${esc(t)}</span>`).join('');
}

function cartaoDetalhe(p, E) {
  return `<section class="cartao detalhe ${E}" style="--n:2" aria-live="polite">
      <p class="rotulo">Decisão ${p.n} · ${esc(p.hora)}</p>
      <h3>${esc(p.titulo)}</h3>
      <p class="escolhido">${esc(p.escolha)}</p>
      <p class="car">Esta escolha tem característica de ${esc(p.caracteristica)}</p>
      <div class="sinais">${sinaisDe(p)}</div>
    </section>`;
}

function abaCurvas(E) {
  const r = rev.dados, sel = rev.sel;
  return `
    <div class="revela-topo">
      <section class="cartao painel ${E}" style="--n:1">
        <div class="bloco-grafico">
          <h3>Razão, emoção e impulso</h3>
          <p class="sub">O que pesou mais em cada decisão. Toque num ponto para abrir a decisão.</p>
          <div class="legenda">${['razao', 'emocao', 'impulso'].map(s => `<span><i style="background:${COR[s]}"></i>${NOME[s]}</span>`).join('')}</div>
          ${graficoLinhas(r.pontos, sel)}
        </div>
      </section>
      ${cartaoDetalhe(r.pontos[sel], E)}
    </div>
    <section class="cartao painel ${E}" style="--n:3">
      <div class="duas">
        <div class="bloco-grafico">
          <h3>O certo ou o desfecho</h3>
          <p class="sub">Para cima, a decisão se apoiou em dever ou princípio. Para baixo, na consequência.</p>
          ${graficoCertoDesfecho(r.pontos, sel)}
        </div>
        <div class="bloco-grafico">
          <h3>Margem de escolha</h3>
          <p class="sub">Quanto cada momento deixava você escolher. Barra baixa: pouca liberdade real.</p>
          ${graficoMargem(r.pontos, sel)}
        </div>
      </div>
      <div class="bloco-grafico">
        <h3>As lentes do seu dia</h3>
        <p class="sub">Quanto cada corrente ética apareceu nas suas escolhas.</p>
        ${graficoEscala(r.escala)}
      </div>
    </section>
    <section class="cartao liso ${E}" style="--n:4">
      <h3>Como o dia terminou</h3>
      <ul class="limpa">
        <li>${esc(r.metas.evento)}</li>
        <li>${esc(r.metas.trabalho)}</li>
        ${r.metas.familia ? `<li>${esc(r.metas.familia)}</li>` : ''}
      </ul>
    </section>`;
}

function abaDecisoes(E) {
  const r = rev.dados;
  return `<div class="estreita"><section class="cartao ${E}" style="--n:1">
      ${r.pontos.map((p, i) => {
        const minha = contestacoes[i];
        return `<article class="decisao">
          <p class="rotulo">Decisão ${p.n} · ${esc(p.hora)}</p>
          <h3>${esc(p.titulo)}</h3>
          <p class="escolhido">${esc(p.escolha)}</p>
          <p>Esta escolha tem característica de ${esc(p.caracteristica)}</p>
          <div class="sinais">${sinaisDe(p)}</div>
          <div class="conceito"><strong>${esc(p.conceito.titulo)}</strong><p>${esc(p.conceito.texto)}</p></div>
          ${rev.abertas[i]
            ? `<div class="chips" role="group" aria-label="Qual foi o seu motivo?">${MOTIVOS.map((m, k) => `<button class="chip" data-acao="motivo" data-i="${i}" data-k="${k}" aria-pressed="${minha === k}">${esc(m)}</button>`).join('')}</div>`
            : `<div class="acoes"><button class="btn secundario" data-acao="contestar" data-i="${i}">Não foi por isso</button></div>`}
          ${minha != null ? `<p class="sua-leitura">Sua leitura: ${esc(MOTIVOS[minha])}.</p>` : ''}
        </article>`;
      }).join('')}
    </section></div>`;
}

function abaSintese(E) {
  const r = rev.dados;
  const discordou = Object.keys(contestacoes).length;
  const maior = Object.entries(r.medias).sort((a, b) => b[1] - a[1])[0][0];
  return `
    <section class="cartao ${E}" style="--n:1">
      <h2>O seu dia, em resumo</h2>
      <ul class="limpa">
        <li>No conjunto, o que mais pesou nas suas decisões foi <strong>${NOME[maior].toLowerCase()}</strong>.</li>
        <li>Você conferiu a informação disponível em ${r.conferiu} de ${r.podiaConferir} momentos.</li>
        ${discordou ? `<li>Você discordou da leitura em ${discordou} ${discordou === 1 ? 'decisão' : 'decisões'}.</li>` : ''}
      </ul>
      <p class="suave pequeno" style="margin-top:12px">A mesma ação pode nascer da razão ou da emoção. Esta é uma leitura do percurso, não uma medida de quem você é.</p>
    </section>
    <div class="par">
      <section class="cartao ${E}" style="--n:2">
        <h3>Sete perguntas para rever o dia</h3>
        <table class="sintese"><tbody>
          ${SINTESE.map(([p, c]) => `<tr><td>${esc(p)}</td><td>${esc(c)}</td></tr>`).join('')}
        </tbody></table>
      </section>
      <section class="cartao ${E}" style="--n:3">
        <h3>Para argumentar</h3>
        <ul class="limpa">
          <li>Que decisão você manteria, mesmo sabendo o desfecho?</li>
          <li>Que decisão você mudaria, e o que precisaria ter percebido antes?</li>
          <li>Em que momento você tinha menos liberdade do que parecia? E mais?</li>
          <li>Qual das suas escolhas você conseguiria justificar diante de todos os envolvidos?</li>
        </ul>
      </section>
    </div>
    <div class="estreita">
      <p class="aviso">Simulação de aprendizagem. As leituras são interpretações para discutir em aula. Nada foi salvo.</p>
      <div class="acoes"><button class="btn principal" data-acao="recomecar">Viver o dia de novo</button></div>
    </div>`;
}

const INTRO = {
  curvas: 'Durante o dia você só decidiu. Agora dá para ver como.',
  decisoes: 'Cada decisão, a leitura dela e o conceito por trás. Se a leitura não corresponde ao seu motivo, diga qual foi.',
  sintese: 'O percurso inteiro, para rever e argumentar.'
};

function telaRevelacao() {
  const abas = [['curvas', 'Curvas'], ['decisoes', 'Decisões'], ['sintese', 'Síntese']];
  ceu('noite');
  topo.hidden = false;
  topo.innerHTML = `<div class="abas" role="tablist" aria-label="Revelação do dia">
    ${abas.map(([id, nome]) => `<button class="aba" role="tab" data-acao="aba" data-aba="${id}" aria-selected="${rev.aba === id}">${nome}</button>`).join('')}
  </div>`;
  const E = rev.anima ? 'entra' : '';
  const corpo = rev.aba === 'curvas' ? abaCurvas(E) : rev.aba === 'decisoes' ? abaDecisoes(E) : abaSintese(E);
  app.innerHTML = `<div class="${rev.estreia ? 'estreia' : ''}">
      <section class="cartao capa ${E}${rev.aba === 'curvas' ? '' : ' estreita'}">
        <p class="rotulo">Fim do dia</p>
        <h1>Como você decidiu</h1>
        <p>${esc(INTRO[rev.aba])}</p>
      </section>
      ${corpo}
    </div>`;
  rev.anima = false;
  rev.estreia = false;
}

/* ---------- Eventos ---------- */
// Redesenha a revelação sem perder a rolagem nem o foco do teclado.
function mantendoRolagem(f) {
  const yRol = window.scrollY;
  const ativo = document.activeElement?.dataset?.acao ? { ...document.activeElement.dataset } : null;
  f();
  telaRevelacao();
  if (ativo) {
    const acaoFoco = ativo.acao === 'contestar' ? 'motivo' : ativo.acao;
    const seletor = `[data-acao="${acaoFoco}"][data-i="${ativo.i}"]` + (ativo.k != null ? `[data-k="${ativo.k}"]` : '') + (acaoFoco === 'sel' ? '[tabindex]' : '');
    document.querySelector(seletor)?.focus({ preventScroll: true });
  }
  window.scrollTo({ top: yRol });
}

function acao(alvo) {
  const a = alvo.dataset.acao, i = Number(alvo.dataset.i);
  if (a === 'comecar' || a === 'recomecar') {
    est = novoEstado(); rev = null; topo.innerHTML = '';
    for (const k of Object.keys(contestacoes)) delete contestacoes[k];
    telaCena();
  } else if (a === 'info') abrirInfo();
  else if (a === 'escolher') escolher(i);
  else if (a === 'seguir') telaCena();
  else if (a === 'revelar') { rev = { dados: resumo(est), aba: 'curvas', sel: 0, abertas: {}, anima: true, estreia: true }; telaRevelacao(); foco(); }
  else if (a === 'aba') { rev.aba = alvo.dataset.aba; rev.anima = true; telaRevelacao(); foco(); }
  else if (a === 'sel') mantendoRolagem(() => { rev.sel = i; });
  else if (a === 'contestar') mantendoRolagem(() => { rev.abertas[i] = true; });
  else if (a === 'motivo') mantendoRolagem(() => { contestacoes[i] = Number(alvo.dataset.k); });
}

document.addEventListener('click', e => {
  const alvo = e.target.closest('[data-acao]');
  if (alvo) acao(alvo);
});
document.addEventListener('keydown', e => {
  if ((e.key === 'Enter' || e.key === ' ') && e.target.matches?.('.ponto-alvo')) { e.preventDefault(); acao(e.target); }
});

telaAbertura();
