// Aluno: entra pelo código (ou QR), recebe o estado publicado pelo professor e manda a resposta como pedido.
import { renderAluno, chaveDoAluno, esc } from './views.js';
import { perguntaAtual } from './engine.js';
import { montar } from './ui.js';
import { ouvirEstado, entrarNaSala, enviarAcao, lerSala, normalizar } from './transporte.js';

const app = document.getElementById('app');
const codigo = normalizar(new URLSearchParams(location.search).get('sala'));
const CH = 'alostase-aluno-' + codigo;

function telaEntrada(msg) {
  const nomeSalvo = localStorage.getItem('alostase-nome') || '';
  app.innerHTML = `<div class="al-entrada"><div class="ent-topo"><span class="selo">MA</span><div><div class="ent-kicker">Sala de jogo</div><h1 class="ent-titulo">Mosaico Alostase</h1></div></div>
    <div class="ent-card"><p class="ent-rot">Participar</p><h2>Entrar com o código</h2>
    <input class="ent-cod" id="cod" maxlength="5" placeholder="CÓDIGO" value="${esc(codigo)}" autocomplete="off" autocapitalize="characters" aria-label="Código da sala">
    <input class="ent-nome" id="nome" maxlength="24" placeholder="Seu nome" value="${esc(nomeSalvo)}" autocomplete="given-name" aria-label="Seu nome">
    <button class="btn block" id="ir">Entrar</button><p class="ent-erro" id="erro" role="alert">${esc(msg || '')}</p><p class="ent-aviso">Não precisa de cadastro.</p></div></div>`;
  const c = document.getElementById('cod'), n = document.getElementById('nome'), ir = document.getElementById('ir'), erro = document.getElementById('erro');
  c.oninput = () => { c.value = normalizar(c.value); };
  ir.onclick = async () => {
    const cod = normalizar(c.value), nome = n.value.trim();
    if (cod.length < 5) { erro.textContent = 'Digite o código de 5 letras ou números.'; return; }
    if (!nome) { erro.textContent = 'Digite seu nome.'; return; }
    ir.disabled = true; erro.textContent = 'Entrando…';
    try {
      const id = await entrarNaSala(cod, nome);
      localStorage.setItem('alostase-nome', nome); sessionStorage.setItem('alostase-aluno-' + cod, id);
      if (cod !== codigo) { location.search = '?sala=' + cod; return; }
      jogar(id);
    } catch (e) { ir.disabled = false; erro.textContent = e.message || 'Não foi possível entrar.'; }
  };
}

function jogar(id) {
  app.innerHTML = '<div id="tela" class="ph-screen"></div>';
  const root = document.getElementById('tela');
  let st = null; const loc = { manual: !sessionStorage.getItem(CH + '-visto'), valor: {} };
  const m = montar(root, () => (st ? renderAluno(st, id, loc) : '<div class="al"><p class="muted">Conectando…</p></div>'),
    (a) => {
      if (a === 'sair-sala') { sessionStorage.removeItem(CH); location.reload(); return; }
      if (a === 'manual') { loc.manual = true; m.draw(true); return; }
      if (a === 'entendi') { loc.manual = false; sessionStorage.setItem(CH + '-visto', '1'); m.draw(true); return; }
      if (a === 'enviar' && st) { const q = perguntaAtual(st), v = loc.valor[st.qi] ?? Number(document.getElementById('sl')?.value); if (Number.isFinite(v)) { enviarAcao(codigo, { t: 'responder', id: '', valor: v }).catch(() => {}); } }
    },
    () => (st ? chaveDoAluno(st, id, loc) : 'x'),
    (el) => { if (el.id === 'sl' && st) { loc.valor[st.qi] = Number(el.value); const vv = document.getElementById('vv'); if (vv) { const d = el.step.includes('.') ? 1 : 0; vv.textContent = Number(el.value).toFixed(d).replace('.', ','); } } });
  ouvirEstado(codigo, (novo) => { st = novo; m.draw(); }, () => {});
  m.draw(true);
  window.__aluno = { get st() { return st; }, id };
}

(async () => {
  if (codigo.length === 5) {
    const id = sessionStorage.getItem(CH), info = await lerSala(codigo).catch(() => null);
    if (id && info) { jogar(id); return; }
    telaEntrada(info ? '' : 'Sala não encontrada. Confira o código.');
  } else telaEntrada();
})();
