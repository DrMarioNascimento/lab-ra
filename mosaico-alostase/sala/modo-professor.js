// Professor: o "cérebro" da partida roda neste aparelho. Entra com Google (lista de mestres), abre a sala, publica o estado
// para o telão e para os celulares e processa as respostas da turma. Mesmo desenho do Comitê de Ética.
import { estadoInicial, reduzir } from './engine.js';
import { renderProfessor, acaoProfessor, esc } from './views.js';
import { montar } from './ui.js';
import { conectar, abrirSala, retomarSala } from './transporte.js';

const JOGO = 'mosaico-alostase', CHAVE = 'alostase-prof-sala';
const app = document.getElementById('app');
let st = estadoInicial(), sala = null, liberada = true;
const subs = new Set(); let agendado = false;
function dispatch(a) {
  const novo = reduzir(st, a); if (novo === st) return; st = novo;
  if (!agendado) { agendado = true; requestAnimationFrame(() => { agendado = false; subs.forEach((f) => f()); }); }
}
const topo = () => `<div class="ent-topo"><span class="selo">MA</span><div><div class="ent-kicker">Sala de jogo · professor</div><div class="ent-titulo">Mosaico Alostase</div></div></div>`;
const cadeado = `<svg class="cadeado" viewBox="0 0 36 36" width="34" height="34" aria-hidden="true"><path d="M10 16v-4a8 8 0 0 1 16 0v4" fill="none" stroke="#ddd6fe" stroke-width="3.5" stroke-linecap="round"/><rect x="6" y="15" width="24" height="17" rx="4" fill="#a78bfa"/><rect x="6" y="15" width="24" height="17" rx="4" fill="none" stroke="#4c1d95" stroke-width="1.5"/><circle cx="18" cy="23" r="2.6" fill="#4c1d95"/></svg>`;

async function telaLogin(msg) {
  app.innerHTML = topo() + `<div class="ent-wrap"><div class="ent-card escuro" style="max-width:460px;margin:0 auto;width:100%"><p class="ent-rot">Conduzir</p><h2>Entrar como professor</h2>
    <p class="ent-aviso">Entre com a conta Google que está na lista de professores autorizados. A turma entra pelo código ou pelo QR, sem cadastro.</p>
    <button class="btn professor block" id="google"><span class="entrada-prof">${cadeado}Entrar com Google</span><small>Só o Professor tem a chave</small></button>
    <p class="ent-erro" id="erro" role="alert">${esc(msg || '')}</p><a class="ent-link" href="../sala/index.html">Voltar</a></div></div>`;
  const b = await conectar();
  document.getElementById('google').onclick = () => {
    // sem await antes do signInWithPopup: o Safari do iPhone bloqueia a janela do Google se houver
    b.entrarGoogleNoToque().then(async (u) => {
      if (!(await b.ehMestre(u.email))) { await b.sair(); telaLogin('Esta conta não está na lista de professores autorizados.'); return; }
      abrir(u);
    }).catch((e) => { document.getElementById('erro').textContent = e && e.code === 'auth/popup-closed-by-user' ? 'A janela do Google foi fechada.' : 'Não consegui entrar. Tente de novo.'; });
  };
}

function aoEntrar(nome, uid) {
  if (st.fase !== 'entrada') return { ok: false, erro: 'A rodada já começou. Fale com o professor.' };
  if (!liberada) return { ok: false, erro: 'A entrada ainda não foi liberada pelo professor.' };
  if (!nome) return { ok: false, erro: 'Digite seu nome.' };
  const id = `a${Math.max(0, ...st.ordem.map((x) => +x.slice(1))) + 1}`;
  dispatch({ t: 'entrar', id, nome });
  return { ok: true, id };
}
const aoAcao = (a, idJogo) => { if (a.t === 'responder') dispatch({ t: 'responder', id: idJogo, valor: a.valor }); };

async function abrir(u) {
  app.innerHTML = topo() + '<div class="ent-wrap"><p class="ent-aviso">Abrindo a sala…</p></div>';
  try {
    const guardado = sessionStorage.getItem(CHAVE) || localStorage.getItem(CHAVE);
    let s = null;
    if (guardado) { try { s = await retomarSala(guardado, aoEntrar, aoAcao); const sv = localStorage.getItem(CHAVE + ':' + guardado); if (sv) st = JSON.parse(sv); } catch { s = null; } }
    if (!s) { s = await abrirSala(JOGO, aoEntrar, aoAcao); st = estadoInicial(); }
    sala = s; localStorage.setItem(CHAVE, s.codigo); st.codigo = s.codigo;
    painel();
  } catch (e) { app.innerHTML = topo() + `<div class="ent-wrap"><p class="ent-erro">${esc(e.message || 'Não consegui abrir a sala.')}</p><button class="btn" onclick="location.reload()">Tentar de novo</button></div>`; }
}

function painel() {
  const link = new URL('../aluno/index.html?sala=' + sala.codigo, location.href).href, telaoLink = new URL('../telao/index.html?sala=' + sala.codigo, location.href).href;
  let qr = ''; try { qr = window.MosaicoQR ? window.MosaicoQR.svg(link, { rotulo: 'Código QR para entrar na sala ' + sala.codigo }) : ''; } catch {}
  app.innerHTML = topo() + `<div class="ent-wrap"><div class="ent-card escuro"><div class="pro-faixa"><div class="pro-qr">${qr}</div>
      <div><p class="ent-rot">Código da sala</p><div class="pro-cod mono">${sala.codigo}</div><p class="ent-aviso">A turma entra por este código ou pelo QR, sem cadastro.</p></div></div>
      <div class="row"><a class="btn contorno" href="${telaoLink}" target="_blank" rel="noopener">Abrir telão</a>
      <button class="btn sm sec" id="lib">Entrada liberada</button><button class="btn sm sec" id="nova">Nova sala</button><button class="btn sm sec" id="sair">Sair</button></div></div>
    <div id="prof" class="card"></div></div>`;
  const chave = () => [st.fase, st.qi, st.rotinaId, st.n, st.semente, st.ordem.length, Object.keys(st.resp[st.qi] || {}).length].join('|');
  const prof = montar(document.getElementById('prof'), () => renderProfessor(st), (a, el) => acaoProfessor(a, el, dispatch, st), chave);
  subs.add(() => prof.draw()); prof.draw(true);
  subs.add(() => { sala.publicar(st); localStorage.setItem(CHAVE + ':' + sala.codigo, JSON.stringify(st)); });
  sala.publicar(st);
  const lib = document.getElementById('lib');
  lib.onclick = () => { liberada = !liberada; lib.textContent = liberada ? 'Entrada liberada' : 'Entrada fechada'; lib.className = 'btn sm ' + (liberada ? 'sec' : 'warn'); sala.entradaLiberada(liberada); };
  document.getElementById('nova').onclick = () => { if (confirm('Abrir uma sala nova? A atual será deixada de lado.')) { localStorage.removeItem(CHAVE); sessionStorage.removeItem(CHAVE); location.reload(); } };
  document.getElementById('sair').onclick = async () => { sala.encerrar(); const b = await conectar(); await b.sair(); location.href = '../sala/index.html'; };
  window.__sala = { get st() { return st; }, dispatch, codigo: sala.codigo };
}

(async () => {
  const b = await conectar(), u = await b.usuario();
  if (u && (await b.ehMestre(u.email))) abrir(u); else telaLogin();
})();
