// Loop (MOSAICO) · telão: só lê a sala e mostra o que a turma inteira pode ver. Nunca mostra pistas.
import { transporteTelao, transporteFalso, ms } from '../transporte.mjs';
import { CASES, ROOMS, ANDARES, INICIO, EIXOS8, verdade, sala as salaMuseu, definirMuseu } from '../conteudo.js';

const P = new URLSearchParams(location.search);
const FALSA = P.get('falsa') === '1';
const codigo = (P.get('sala') || '').toUpperCase();
const app = document.getElementById('app');
const EIXOS = EIXOS8;
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const mmss = (s) => {
  const total = Math.max(0, Math.ceil(s));
  return String(Math.floor(total / 60)).padStart(2, '0') + ':' + String(total % 60).padStart(2, '0');
};

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
const gente = () => players.filter(p => !p.mestre && !p.expulso);

function conviteUrl() { const u = new URL('../index.html', location.href); u.search = ''; u.searchParams.set('sala', codigo); return u.toString(); }

function sinal(seg) {   // texto coletivo: o que todos ouvem, nunca pistas
  const dec = room.seg ? (room.seg - seg) / room.seg * 300 : 0;
  if (dec >= 165) return 'O alarme dispara no museu.';
  if (dec >= 120) return 'Um estrondo ecoa pelos corredores…';
  return '';
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
      <div class="tl-museu">Minuto da volta: <time>${loopHora(room.seg, jog ? seg : room.seg)}</time></div><div class="tl-sinal">${jog ? esc(sinal(seg)) : 'Escolham um ambiente.'}</div></div>
      <div class="tl-card">${mapa()}</div>`;
    rod = `<span class="tl-aviso">${g.filter((p) => p.amb && p.ambVolta === v).length} de ${g.length} em um ambiente</span>`;
  } else if (e === 'between') {
    const passos = {
      1: 'Conversem sobre o que chamou a atenção. Quem vai procurar outro sinal?',
      2: 'Organizem as pistas e preparem a ação que depende de outra sala ou de uma volta anterior.',
      3: 'Planejem um ensaio e confiram o que ainda precisa ficar pronto para a última volta.',
      4: 'Dividam as tarefas. Quem opera a Máquina? Quem leva as três provas à Recepção? Reservem a energia da ação.',
      5: 'Conversem sobre o que conseguiram e registrem o desfecho no celular.'
    };
    meio = `<div class="tl-card tl-relogio"><div class="tl-volta">VOLTA ${v} DE 5</div><h1 class="tl-titulo">${v === 5 ? 'A investigação terminou.' : 'O tempo retornou.'}</h1><p class="tl-texto">${passos[v]}</p></div><div class="tl-card">${mapa()}</div>`;
  } else if (e === 'final') {
    const n = g.filter((p) => p.resp).length;
    meio = `<div class="tl-card tl-relogio"><h1 class="tl-titulo">Desfecho</h1><p class="tl-texto">Registrem o desfecho no celular.</p></div>
      <div class="tl-card tl-relogio"><div class="tl-tempo">${n}/${g.length}</div><p class="tl-texto">registraram</p></div>`;
  } else {
    const enviados = g.filter(p => p.resp);
    const coletivo = loopFinalTurma(enviados.map(p => p.resp));
    const c = CASES[room.caso];
    const reflexoes = enviados.filter(p => EIXOS.some(([k]) => p.resp[k]));
    meio = coletivo ? `<div class="tl-card"><p class="tl-volta">DESFECHO DA TURMA</p><h1 class="tl-titulo">${esc(coletivo.final)}</h1>
      <p class="tl-texto">${esc(LOOP_FINAIS[coletivo.final])}</p><p class="tl-texto">${coletivo.registrados} de ${g.length} registraram o desfecho.</p></div>`
      + `<div class="tl-card">${loopFitaHtml(enviados.map(p => p.resp.loopFatos), g.length)}</div>`
      : `<div class="tl-card"><p class="tl-volta">CONCLUSÃO</p><h1 class="tl-titulo">${esc(enviados.length ? c?.subject : 'Investigação encerrada')}</h1>
        <p class="tl-texto">${esc(enviados.length ? c?.detail : 'A turma encerrou a investigação.')}</p></div>`;
    if (reflexoes.length) meio += `<div class="tl-card"><p class="tl-volta">REFLEXÃO DA TURMA</p><div class="tl-barras">${EIXOS.map(([k, rotulo]) => {
      const respostas = reflexoes.filter(p => p.resp[k]);
      if (!respostas.length) return '';
      const ok = respostas.filter(p => p.resp[k] === verdade(room.caso, k)).length;
      const pc = Math.round(ok / respostas.length * 100);
      return `<div class="tl-barra"><span>${esc(rotulo)}</span><div><i style="width:${pc}%"></i></div><span>${ok}/${respostas.length}</span></div>`;
    }).join('')}</div></div>`;
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
