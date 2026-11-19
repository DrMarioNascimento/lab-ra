// Telão: só lê o que o professor publica. Abre pelo link ?sala=CÓDIGO (ou digitando o código) e ocupa a tela toda.
import { renderTelao, esc } from './views.js';
import { ouvirEstado, marcarPresencaTelao, lerSala, normalizar } from './transporte.js';

const app = document.getElementById('app');
const codigo = normalizar(new URLSearchParams(location.search).get('sala'));

function pedirCodigo(msg) {
  app.innerHTML = `<div class="tl-entrada"><div class="ent-card escuro" style="max-width:420px;width:100%"><p class="ent-rot">Telão</p><h2>Qual é o código da sala?</h2>
    <input class="ent-cod" id="cod" maxlength="5" placeholder="CÓDIGO" autocomplete="off" autocapitalize="characters" aria-label="Código da sala">
    <button class="btn block" id="ir" disabled>Abrir telão</button><p class="ent-erro" role="alert">${esc(msg || '')}</p></div></div>`;
  const c = document.getElementById('cod'), ir = document.getElementById('ir');
  c.oninput = () => { c.value = normalizar(c.value); ir.disabled = c.value.length < 5; };
  const go = () => { if (c.value.length >= 5) location.search = '?sala=' + c.value; };
  ir.onclick = go; c.onkeydown = (e) => { if (e.key === 'Enter') go(); };
}

export function ligarTelaCheia(telao, fs) {
  const rotulo = () => { fs.textContent = document.fullscreenElement || telao.classList.contains('cheio') ? '✕ Sair da tela cheia' : '⛶ Tela cheia'; };
  fs.onclick = () => {
    if (document.fullscreenElement || telao.classList.contains('cheio')) { if (document.fullscreenElement) document.exitFullscreen(); telao.classList.remove('cheio'); }
    else if (telao.requestFullscreen) telao.requestFullscreen().catch(() => telao.classList.add('cheio'));
    else telao.classList.add('cheio');
    setTimeout(rotulo, 50);
  };
  document.addEventListener('fullscreenchange', rotulo);
  let t = 0; const mostra = () => { telao.classList.add('mostra-fs'); clearTimeout(t); t = setTimeout(() => telao.classList.remove('mostra-fs'), 2500); };
  ['mousemove', 'touchstart', 'pointerdown'].forEach((ev) => telao.addEventListener(ev, mostra, { passive: true }));
}

async function ligar() {
  const info = await lerSala(codigo).catch(() => null);
  if (!info) { pedirCodigo('Sala não encontrada. Confira o código.'); return; }
  marcarPresencaTelao(codigo);
  app.innerHTML = '<div class="telao" id="telao"><button class="btn sm sec fsbtn" id="fs">⛶ Tela cheia</button><div id="telaoIn" class="tl"></div><div id="qrbox"></div></div>';
  const telao = document.getElementById('telao'), tin = document.getElementById('telaoIn');
  ligarTelaCheia(telao, document.getElementById('fs'));
  const link = new URL('../aluno/index.html?sala=' + codigo, location.href).href;
  let qr = ''; try { qr = window.MosaicoQR ? window.MosaicoQR.svg(link, { rotulo: 'Código QR para entrar na sala ' + codigo }) : ''; } catch {}
  let ultimo = null;
  ouvirEstado(codigo, (st) => {
    ultimo = { ...st, codigo }; tin.innerHTML = renderTelao(ultimo);
    document.getElementById('qrbox').innerHTML = st.fase === 'entrada' && qr ? `<div class="pro-qr tl-qr">${qr}</div>` : '';
  }, () => pedirCodigo('Não consegui abrir o telão desta sala.'));
  window.__telao = { get st() { return ultimo; } };
}

if (codigo.length === 5) ligar(); else pedirCodigo();
