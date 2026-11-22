// Loop (MOSAICO) · telão: só lê a sala e mostra o que a turma inteira pode ver. Nunca mostra pistas.
import { transporteTelao, transporteFalso, ms } from '../transporte.mjs';
import { CASES, ROOMS, ANDARES, INICIO, EIXOS8, verdade, sala as salaMuseu, definirMuseu } from '../conteudo.js';

const P = new URLSearchParams(location.search);
const FALSA = P.get('falsa') === '1';
const codigo = (P.get('sala') || '').toUpperCase();
const app = document.getElementById('app');
const EIXOS = EIXOS8;
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const mmss = (s) => String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(Math.ceil(s % 60) % 60).padStart(2, '0');

// tela cheia que ocupa a tela toda
const fs = document.getElementById('fs');
fs.onclick = () => { if (document.fullscreenElement) document.exitFullscreen(); else (document.documentElement.requestFullscreen?.() || Promise.reject()).catch(() => {}); };
document.addEventListener('fullscreenchange', () => { fs.textContent = document.fullscreenElement ? 'Sair da tela cheia' : 'Tela cheia'; });
document.body.addEventListener('mousemove', () => { document.body.classList.add('mostra-fs'); clearTimeout(fs._t); fs._t = setTimeout(() => document.body.classList.remove('mostra-fs'), 2500); });

function entrada(erro) {
  app.innerHTML = `<div class="tl-entrada"><form class="card" id="f"><p class="kicker">MOSAICO · LOOP</p><h2>Telão da sala</h2>
    <input id="c" maxlength="8" autocomplete="off" placeholder="CÓDIGO" aria-label="Código da sala"><div class="tl-erro">${esc(erro || '')}</div>
    <button class="btn primary" type="submit">Abrir telão</button></form></div>`;
  document.getElementById('f').onsubmit = (e) => { e.preventDefault(); const c = document.getElementById('c').value.trim().toUpperCase(); if (c) { const u = new URL(location.href); u.searchParams.set('sala', c); location.href = u; } };
}

let T, room = null, players = [];
const sala = () => room || {};
const restante = () => { const i = ms(room?.iniEm); return i == null ? room?.seg ?? 300 : Math.max(0, Math.min(room.seg, (i + room.seg * 1000 - T.agora()) / 1000)); };
const gente = () => players.filter((p) => !p.mestre);

function conviteUrl() { const u = new URL('../index.html', location.href); u.search = ''; u.searchParams.set('sala', codigo); return u.toString(); }

function sinal(seg) {   // texto coletivo: o que todos ouvem, nunca pistas
  const dec = room.seg ? (room.seg - seg) / room.seg * 300 : 0;
  if (dec >= 165) return 'O alarme dispara no museu.';
  if (dec >= 120) return 'Um estrondo ecoa pelos corredores…';
  return '';
}
function relogioMuseu(seg) {
  const dec = room.seg ? Math.floor((room.seg - seg) / room.seg * 300) : 0;
  const t = 23 * 3600 + 55 * 60 + dec;
  return String(Math.floor(t / 3600) % 24).padStart(2, '0') + ':' + String(Math.floor(t / 60) % 60).padStart(2, '0') + ':' + String(t % 60).padStart(2, '0');
}

function cabeca() {
  return `<div class="tl-topo"><div class="tl-marca"><small>MOSAICO</small><b>Loop</b></div><div class="tl-codigo">CÓDIGO<strong>${esc(codigo)}</strong></div></div>`;
}
function mapa() {
  definirMuseu(room.museu || 0);
  const cont = {}; for (const p of gente()) if (p.amb && p.ambVolta === room.volta) cont[p.amb] = (cont[p.amb] || 0) + 1;
  const esperando = gente().filter((p) => !(p.amb && p.ambVolta === room.volta)).length;
  return `<div class="tl-mapa">${ANDARES.map((a) => `<h4 class="tl-andar">${esc(a)}</h4>` + (a === INICIO.andar ? `<div class="tl-sala inicio ${esperando ? '' : 'vazia'}"><i>${esc(INICIO.icon)}</i>${esperando ? `<em>${esperando}</em>` : ''}<b>${esc(INICIO.name)} · início</b></div>` : '') + ROOMS.map((r) => salaMuseu(r.id)).filter((r) => r.andar === a).sort((x, y) => x.lugar - y.lugar).map((r) => `<div class="tl-sala ${cont[r.id] ? '' : 'vazia'}"><i>${esc(r.icon)}</i>${cont[r.id] ? `<em>${cont[r.id]}</em>` : ''}<b>${esc(r.name)}</b></div>`).join('')).join('')}</div>`;
}
function desenhar() {
  if (!room) { app.innerHTML = `<div class="tl-raiz">${cabeca()}<div class="tl-card"><h1 class="tl-titulo">Sala não encontrada</h1><p class="tl-texto">Confira o código e abra de novo.</p></div></div>`; return; }
  if (room.aulaEncerrada) { app.innerHTML = `<div class="tl-raiz">${cabeca()}<div class="tl-meio"><div class="tl-card"><p class="tl-volta">AULA ENCERRADA</p><h1 class="tl-titulo">Obrigado por participar!</h1><p class="tl-texto">O Mestre encerrou a aula.</p></div></div></div>`; return; }
  const e = room.etapa, g = gente(), v = room.volta;
  let meio = '', rod = '';
  if (room.fase === 'sala' || !e) {
    meio = `<div class="tl-card"><h1 class="tl-titulo">Entrem na sala</h1><p class="tl-texto">Leiam o QR code no celular ou digitem o código <b>${esc(codigo)}</b>.</p></div>
      <div class="tl-card"><h2 class="tl-titulo">${g.length} na sala</h2><div class="tl-gente">${g.map((p) => `<span>${esc(p.nome || 'Participante')}</span>`).join('')}</div></div>`;
    rod = `<div class="tl-qr" aria-label="QR code de entrada">${window.MosaicoQR ? window.MosaicoQR.svg(conviteUrl(), { nivel: 'M', margem: 2 }) : ''}</div><span class="tl-aviso">O Mestre inicia a partida.</span>`;
  } else if (e === 'choose' || e === 'playing') {
    const seg = restante(), jog = e === 'playing';
    meio = `<div class="tl-card tl-relogio"><div class="tl-volta">VOLTA ${v} DE 5</div><div class="tl-tempo">${mmss(jog ? seg : room.seg)}</div>
      <div class="tl-museu">No museu: <time>${jog ? relogioMuseu(seg) : '23:55:00'}</time></div><div class="tl-sinal">${jog ? esc(sinal(seg)) : 'Escolham um ambiente.'}</div></div>
      <div class="tl-card">${mapa()}</div>`;
    rod = `<span class="tl-aviso">${g.filter((p) => p.amb && p.ambVolta === v).length} de ${g.length} em um ambiente</span>`;
  } else if (e === 'between') {
    meio = `<div class="tl-card tl-relogio"><div class="tl-volta">VOLTA ${v} DE 5</div><h1 class="tl-titulo">O tempo retornou.</h1><p class="tl-texto">Cada um relê o seu dossiê. O Mestre abre a próxima etapa.</p></div><div class="tl-card">${mapa()}</div>`;
  } else if (e === 'final') {
    const n = g.filter((p) => p.resp).length;
    meio = `<div class="tl-card tl-relogio"><h1 class="tl-titulo">Conclusão</h1><p class="tl-texto">Cada um envia a sua própria conclusão no celular.</p></div>
      <div class="tl-card tl-relogio"><div class="tl-tempo">${n}/${g.length}</div><p class="tl-texto">enviaram</p></div>`;
  } else {
    const c = CASES[room.caso], com = g.filter((p) => p.resp);
    meio = `<div class="tl-card"><p class="tl-volta">O QUE ACONTECEU</p><h1 class="tl-titulo">${esc(c.subject)}</h1><p class="tl-texto">${esc(c.detail)}</p></div>
      <div class="tl-card"><p class="tl-volta">A TURMA ACERTOU</p><div class="tl-barras">${EIXOS.map(([k, r]) => { const ok = com.filter((p) => p.resp[k] === verdade(room.caso, k)).length, pc = com.length ? Math.round(ok / com.length * 100) : 0; return `<div class="tl-barra"><span>${r}</span><div><i style="width:${pc}%"></i></div><span>${ok}/${com.length}</span></div>`; }).join('')}${(() => { const q = com.filter((p) => p.resp.interv === 'break').length, pc = com.length ? Math.round(q / com.length * 100) : 0; return `<div class="tl-barra"><span>Quebrou o loop</span><div><i style="width:${pc}%"></i></div><span>${q}/${com.length}</span></div>`; })()}</div></div>`;
  }
  app.innerHTML = `<div class="tl-raiz">${cabeca()}<div class="tl-meio">${meio}</div><div class="tl-rodape">${rod}</div></div>`;
}

async function main() {
  if (!FALSA && !codigo) return entrada();
  try { T = FALSA ? transporteFalso({ codigo: codigo || 'SIMUL', papel: 'telao', uid: 'telao' }) : await transporteTelao(codigo); }
  catch (e) { return entrada('Não consegui abrir. Confira a conexão.'); }
  if (FALSA && !codigo) { /* usa SIMUL */ }
  await T.sincronizar().catch(() => {});
  T.aoMudar((r, ps) => { room = r; players = ps || []; desenhar(); });
  room = T.sala; players = T.jogadores; desenhar();
  setInterval(() => { if (room?.etapa === 'playing') desenhar(); }, 500);
}
main();
