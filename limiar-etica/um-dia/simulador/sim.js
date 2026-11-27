// Limiar Ético · /simulador. Telão em cima, turma embaixo, celular de quem conduz ao lado.
// A sala é falsa e mora nesta página (window.__LIMIAR_SIM_API): as telas são o próprio jogo em iframes com ?sim=<id>,
// que pegam esta sala no lugar do Firebase. Até 6 celulares aparecem; os outros participantes jogam em segundo plano
// com o mesmo motor do jogo.
import { DIAS, ORDEM_DIAS } from '../dias.js?v=2.3';
import { novoEstado, sortearNiveis, cenaAtual, decidir, terminou, resumo } from '../motor.js?v=2.3';

const CODIGO = 'LESIM1', MAX_TELAS = 6, PROJETO = 'limiar-etico';
const NOMES = ['Ana', 'Bruno', 'Carla', 'Diego', 'Elisa', 'Fábio', 'Gabi', 'Hugo', 'Iara', 'João', 'Kátia', 'Leo', 'Mari', 'Nando', 'Olga', 'Pedro', 'Rita', 'Sérgio', 'Tati', 'Vitor', 'Wanda', 'Yuri', 'Zeca', 'Alice', 'Bia', 'Caio', 'Duda', 'Enzo', 'Flávia', 'Gui', 'Heitor', 'Isa', 'Jade', 'Kaio', 'Lara', 'Marcos', 'Nina', 'Otávio', 'Paula', 'Rafa'];
const EMOJIS = ['⚖️', '🤝', '🧭', '🕊️', '🛡️', '🌱', '🔎', '⚽', '🏐', '🏃', '🥇', '🤸', '🏫', '🎽'];
const FRASES = ['Eu conversaria com as duas partes antes de decidir.', 'Primeiro eu conferiria a informação, depois decidiria.', 'Eu explicaria o motivo da minha escolha para quem foi afetado.', 'Eu buscaria uma saída que não deixasse ninguém de fora.', 'Eu pediria ajuda antes de agir sozinho nessa situação.'];

let rnd = semente(20261127);
function semente(a) { return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const sorteia = (v) => v[Math.floor(rnd() * v.length)];
// Modo livre: cada um escolhe a história; a maioria cai nas duas primeiras, para a visão da turma (5 ou mais envios do mesmo dia) aparecer.
const diaSorteado = () => { const r = rnd(); return r < .45 ? ORDEM_DIAS[0] : r < .8 ? ORDEM_DIAS[1] : sorteia(ORDEM_DIAS); };

/* ---------- a sala falsa (mesma interface do sala.js) ---------- */
let db = {};
const ouvintes = new Set();
function avisar(codigo) {
  for (const o of ouvintes) if (o.codigo === codigo) {
    const lista = Object.entries((db[codigo] || {}).alunos || {}).map(([id, v]) => ({ id, ...v }));
    try { o.cb(JSON.parse(JSON.stringify(lista))); } catch (e) { ouvintes.delete(o); }   // iframe recarregado: esquece o ouvinte
  }
}
let fila = new Set(), agendado = false;
function mudou(codigo) { fila.add(codigo); if (agendado) return; agendado = true; setTimeout(() => { agendado = false; const f = fila; fila = new Set(); f.forEach(avisar); }, 120); }
window.__LIMIAR_SIM_API = {
  async entrarProfessor() { return true; },
  async sairProfessor() {},
  async criarSessao(codigo, config = {}) {
    db[codigo] = { ativa: true, modo: config.modo === 'fixo' ? 'fixo' : 'livre', dia: config.modo === 'fixo' ? String(config.dia || '') : '', alunos: {} };
    if (codigo !== sala.codigo) setTimeout(() => trocarSala(codigo), 300);   // sala nova aberta no celular: telão e turma vão junto
    return codigo;
  },
  async encerrarSessao(codigo) { if (db[codigo]) db[codigo].ativa = false; },
  async lerSessao(codigo) { const s = db[codigo]; return s && s.ativa ? { modo: s.modo, dia: s.dia } : null; },
  async sessaoAtiva(codigo) { return !!(db[codigo] && db[codigo].ativa); },
  async gravarAluno(codigo, id, dados) { const s = db[codigo]; if (!s) throw new Error('Sala não encontrada.'); s.alunos[id] = { ...(s.alunos[id] || {}), ...JSON.parse(JSON.stringify(dados)), projeto: PROJETO, atualizadoEmMs: Date.now() }; mudou(codigo); },
  async apagarAluno(codigo, id) { if (db[codigo]) { delete db[codigo].alunos[id]; mudou(codigo); } },
  ouvirAlunos(codigo, cb) { const o = { codigo, cb }; ouvintes.add(o); mudou(codigo); return () => ouvintes.delete(o); }
};

/* ---------- telas ---------- */
const sala = { codigo: CODIGO };
const $ = (id) => document.getElementById(id);
const fTelao = $('fTelao'), fProf = $('fProf');
let nAlunos = 20, auto = true, passo = 900;
// telão e celular de quem conduz dividem o mesmo prefixo (sim_prof_): os dois enxergam a mesma sala
function prepararProfessor(codigo) {
  sessionStorage.setItem('sim_prof_le_prof', JSON.stringify(codigo));
  sessionStorage.setItem('sim_prof_le_prof_cfg', JSON.stringify({ modo: 'livre' }));
}
const URL_JOGO = new URL('../', location.href).href;
// no telão simulado o botão "Sair do telão" do jogo some: aqui ele fica sempre no modo telão
fTelao.addEventListener('load', () => { try { const st = fTelao.contentDocument.createElement('style'); st.textContent = '.botao-sair-telao{display:none!important}'; fTelao.contentDocument.head.appendChild(st); } catch (e) {} });
function abrirTelao() { fTelao.src = URL_JOGO + '?professor&telao&sim=prof&t=' + Date.now(); }
function abrirProf() { fProf.src = URL_JOGO + '?professor&sim=prof&t=' + Date.now(); }
function trocarSala(codigo) { sala.codigo = codigo; prepararProfessor(codigo); abrirTelao(); montarTurma(); }

// tela cheia do telão: a do navegador quando der; senão, ocupa a janela toda
const caixaTelao = $('telao');
$('fs').onclick = () => {
  if (document.fullscreenElement || caixaTelao.classList.contains('cheio')) { if (document.fullscreenElement) document.exitFullscreen(); caixaTelao.classList.remove('cheio'); return; }
  if (caixaTelao.requestFullscreen) caixaTelao.requestFullscreen().catch(() => caixaTelao.classList.add('cheio')); else caixaTelao.classList.add('cheio');
};
addEventListener('keydown', (e) => { if (e.key === 'Escape') caixaTelao.classList.remove('cheio'); });

/* ---------- turma ---------- */
let fones = [];          // { id, nome, emoji, frame, piloto, btn }
let bots = [];           // participantes sem celular na tela
function nomeDe(i) { return NOMES[i % NOMES.length] + (i >= NOMES.length ? ' ' + (Math.floor(i / NOMES.length) + 1) : ''); }
function montarTurma() {
  // ninguém na sala ainda; os celulares abrem na tela de entrar
  const s = db[sala.codigo]; if (s) { s.alunos = {}; mudou(sala.codigo); }
  for (const k of Object.keys(sessionStorage)) if (/^sim_a\d+_/.test(k)) sessionStorage.removeItem(k);
  const box = $('phones'); box.innerHTML = ''; fones = []; bots = [];
  const nTelas = Math.min(MAX_TELAS, nAlunos);
  for (let i = 0; i < nAlunos; i++) {
    const id = 'a' + (i + 1), nome = nomeDe(i), emoji = EMOJIS[i % EMOJIS.length];
    if (i < nTelas) {
      const wrap = document.createElement('div'); wrap.className = 'ph-wrap';
      wrap.innerHTML = `<div class="ph-cap"><b>${emoji} ${nome}</b><button class="sim-btn on" type="button">piloto</button></div><div class="ph-frame"><iframe title="Celular de ${nome}"></iframe></div>`;
      box.appendChild(wrap);
      const f = { id, nome, emoji, frame: wrap.querySelector('iframe'), piloto: true, btn: wrap.querySelector('button'), espera: Math.floor(rnd() * 4) };
      f.frame.src = URL_JOGO + '?sala=' + sala.codigo + '&sim=' + id + '&t=' + Date.now();
      f.btn.onclick = () => { f.piloto = !f.piloto; f.btn.classList.toggle('on', f.piloto); f.btn.textContent = f.piloto ? 'piloto' : 'você joga'; };
      fones.push(f);
    } else bots.push({ id, nome, emoji, fase: 'fora', espera: 2 + Math.floor(rnd() * 10) });
  }
  $('nota').textContent = bots.length ? `Mais ${bots.length} participantes automáticos jogando sem celular na tela.` : '';
}

// Piloto de um celular: a cada passo faz uma coisa na tela, como um aluno faria.
function pilotar(f) {
  if (!f.piloto) return;
  if (f.espera > 0) { f.espera--; return; }
  let d; try { d = f.frame.contentDocument; } catch (e) { return; }
  if (!d || !d.body) return;
  const q = (s) => d.querySelector(s), clica = (el) => { el.click(); return true; };
  const vis = (el) => el && !el.disabled && el.offsetParent !== null;
  let b;
  if (vis(b = q('[data-acao="fechar-manual"]'))) return clica(b);
  if (q('#sala-nome')) {
    const nome = q('#sala-nome');
    if (!nome.value) { nome.value = f.nome; return; }
    const em = [...d.querySelectorAll('.emojis .emoji')].find((e) => e.dataset.e === f.emoji);
    if (em && em.getAttribute('aria-pressed') !== 'true') return clica(em);
    if (vis(b = q('[data-acao="entrar-sala"]'))) return clica(b);
    return;
  }
  if (f.enviou) { if (vis(b = q('[data-s="fechar"]'))) clica(b); f.piloto = false; f.btn.classList.remove('on'); f.btn.textContent = 'enviou'; return; }
  if (vis(b = q('[data-s="enviar"]'))) { f.enviou = true; return clica(b); }
  const dias = [...d.querySelectorAll('[data-acao="dia"]')];
  if (dias.length) { f.dia ??= diaSorteado(); const alvo = dias.find((x) => x.dataset.dia === f.dia) || dias[0]; return clica(alvo); }
  if (vis(b = q('[data-acao="comecar"]'))) return clica(b);
  if (vis(b = q('[data-acao="info"]')) && rnd() < .5 && !b.dataset.simVisto) { b.dataset.simVisto = '1'; return clica(b); }
  if (vis(b = q('[data-acao="consultar-retomada"]')) && rnd() < .4 && !b.dataset.simVisto) { b.dataset.simVisto = '1'; return clica(b); }
  const ret = [...d.querySelectorAll('[data-acao="responder-retomada"]')].filter(vis);
  if (ret.length) return clica(sorteia(ret));
  const ops = [...d.querySelectorAll('[data-acao="escolher"]')].filter(vis);
  if (ops.length) return clica(sorteia(ops));
  if (vis(b = q('[data-acao="seguir"]'))) return clica(b);
  if (vis(b = q('[data-acao="revelar"]'))) return clica(b);
  const txt = q('#resposta-aplicacao');
  if (txt && vis(txt) && !txt.value) { txt.value = sorteia(FRASES); txt.dispatchEvent(new Event('input', { bubbles: true })); return; }
  if (!txt && vis(b = q('[data-aba="aplicar"]'))) return clica(b);
  if (vis(b = q('[data-acao="abrir-salvar"]'))) return clica(b);
}

// Participante automático: entra, joga o dia no motor do jogo (escolhas sorteadas) e quase sempre envia.
async function moverBot(b) {
  if (b.espera > 0) { b.espera--; return; }
  const api = window.__LIMIAR_SIM_API, gravar = (x) => api.gravarAluno(sala.codigo, b.id, { nome: b.nome, avatar: b.emoji, ...x }).catch(() => {});
  if (b.fase === 'fora') { b.fase = 'escolhendo'; b.espera = 1 + Math.floor(rnd() * 3); return gravar({ dia: '', status: 'Escolhendo o dia', progresso: 0, entrouEmMs: Date.now() }); }
  if (b.fase === 'escolhendo') { b.dia = diaSorteado(); b.est = novoEstado(sortearNiveis(rnd, b.dia), b.dia); b.fase = 'jogando'; return gravar({ dia: b.dia, status: 'Jogando', progresso: 0 }); }
  if (b.fase === 'jogando') {
    if (rnd() < .45) return;   // cada um no seu ritmo
    const cena = cenaAtual(b.est);
    decidir(b.est, Math.floor(rnd() * cena.opcoes.length), { tempoMs: 4000 + Math.floor(rnd() * 20000), abriuInfo: rnd() < .4 });
    const total = b.est.fila.length;
    if (!terminou(b.est)) return gravar({ status: 'Jogando', progresso: Math.round(100 * b.est.pos / total) });
    b.fase = rnd() < .9 ? 'enviar' : 'fim'; b.espera = 2 + Math.floor(rnd() * 4);
    return gravar({ status: 'Na revelação', progresso: 100 });
  }
  if (b.fase === 'enviar') {
    b.fase = 'fim';
    return gravar({ dia: b.dia, status: 'Enviou', progresso: 100, enviado: true, enviadoEmMs: Date.now(), dadosJson: JSON.stringify(resumo(b.est)), extrasJson: JSON.stringify({ registros: null, contestacoes: [] }), aplicacao: sorteia(FRASES) });
  }
}

let relogio = null;
function ligar() {
  clearInterval(relogio);
  relogio = setInterval(() => { if (!auto) return; fones.forEach(pilotar); bots.forEach(moverBot); }, passo);
}

/* ---------- controles ---------- */
$('nAl').oninput = (e) => { $('nAlV').textContent = e.target.value; };
$('nAl').onchange = (e) => { nAlunos = +e.target.value; montarTurma(); };
$('ritmo').onchange = (e) => { passo = +e.target.value; ligar(); };
$('auto').onclick = () => { auto = !auto; $('auto').classList.toggle('on', auto); $('auto').textContent = 'Participantes automáticos: ' + (auto ? 'ligados' : 'parados'); };
$('reset').onclick = () => recomecar();

function recomecar() {
  rnd = semente(20261127 + Math.floor(Math.random() * 1e6));
  db = {}; ouvintes.clear(); sala.codigo = CODIGO;
  for (const k of Object.keys(sessionStorage)) if (k.startsWith('sim_')) sessionStorage.removeItem(k);
  db[CODIGO] = { ativa: true, modo: 'livre', dia: '', alunos: {} };
  prepararProfessor(CODIGO); abrirTelao(); abrirProf(); montarTurma(); ligar();
}
recomecar();
