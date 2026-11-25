// Loop (MOSAICO) · telão: só lê a sala e mostra o que a turma inteira pode ver. Nunca mostra pistas.
// O conteúdo fica em páginas por tema (Relógio, Mapa, Turma, Máquina; no fim: Desfecho, A noite, Turma, Perguntas),
// com abas, setas do teclado e troca automática (que dá para parar). As salas são só as 15 da história (LOOP_SALAS).
import { transporteTelao, transporteFalso, ms } from '../transporte.mjs';
import { CASES, ANDARES, INICIO, LOOP_SALAS, EIXOS8, verdade, sala as salaMuseu, definirMuseu } from '../conteudo.js?v=2';

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
const ICONE = (n) => new URL('../../museu/icones/' + n + '.webp', import.meta.url).href;
const ficha = (n, cls = '') => `<span class="ic3d ${cls}" aria-hidden="true"><img src="${ICONE(n)}" alt=""></span>`;

// tela cheia que ocupa a tela toda (o botão fica sempre à vista)
const fs = document.getElementById('fs');
const emCheia = () => !!(document.fullscreenElement || document.webkitFullscreenElement);
fs.onclick = () => {
  const el = document.documentElement;
  if (emCheia()) (document.exitFullscreen || document.webkitExitFullscreen).call(document);
  else { const r = (el.requestFullscreen || el.webkitRequestFullscreen)?.call(el, { navigationUI: 'hide' }); if (r && r.catch) r.catch(() => {}); }
};
const rotuloFs = () => { fs.innerHTML = '<span aria-hidden="true">⛶</span> ' + (emCheia() ? 'Sair da tela cheia' : 'Tela cheia'); document.body.classList.toggle('em-cheia', emCheia()); };
document.addEventListener('fullscreenchange', rotuloFs); document.addEventListener('webkitfullscreenchange', rotuloFs); rotuloFs();

function entrada(erro) {
  app.innerHTML = `<div class="tl-entrada"><form class="card" id="f"><div class="tl-ent-topo">${ficha('ui/telao')}<div><p class="kicker">MOSAICO · LOOP</p><h2>Telão da sala</h2></div></div>
    <p class="tl-ent-ajuda">Digite o código que está no celular do Professor.</p>
    <input id="c" maxlength="8" autocomplete="off" placeholder="CÓDIGO" aria-label="Código da sala"><div class="tl-erro">${esc(erro || '')}</div>
    <button class="btn primary" type="submit">Abrir telão</button></form></div>`;
  document.getElementById('f').onsubmit = (e) => { e.preventDefault(); const c = document.getElementById('c').value.trim().toUpperCase(); if (c) { const u = new URL(location.href); u.searchParams.set('sala', c); location.href = u; } };
}

let T, room = null, players = [];
const restante = () => { const i = ms(room?.iniEm); return i == null ? room?.seg ?? 300 : Math.max(0, Math.min(room.seg, (i + room.seg * 1000 - T.agora()) / 1000)); };
const gente = () => players.filter(p => !p.mestre && !p.expulso);
const naSala = (p) => !!(p.amb && p.ambVolta === room.volta);

function conviteUrl() { const u = new URL('../index.html', location.href); u.search = ''; u.searchParams.set('sala', codigo); return u.toString(); }

function sinal(seg) {   // texto coletivo: o que todos ouvem, nunca pistas
  const dec = room.seg ? (room.seg - seg) / room.seg * 300 : 0;
  if (dec >= 165) return 'O alarme dispara no museu.';
  if (dec >= 120) return 'Um estrondo ecoa pelos corredores…';
  return '';
}

// ---------------------------------------------------------------- páginas
let pag = 0, auto = true, trocaEm = 0, chaveTela = '';
const GIRO_MS = 12000;
function paginasDaEtapa() {
  const e = room.etapa;
  if (room.fase === 'sala' || !e) return [['entrada', 'Entrada']];
  if (e === 'choose' || e === 'playing' || e === 'between') return [['relogio', 'Relógio'], ['mapa', 'Mapa'], ['turma', 'Turma'], ['maquina', 'Máquina']];
  if (e === 'final') return [['desfecho', 'Desfecho'], ['turma', 'Turma']];
  const temPerguntas = gente().some(p => p.resp && EIXOS.some(([k]) => p.resp[k]));
  return [['desfecho', 'Desfecho'], ['noite', 'A noite'], ['turma', 'Turma']].concat(temPerguntas ? [['perguntas', 'Perguntas']] : []);
}
function irPara(i, manual) {
  const n = paginasDaEtapa().length; pag = ((i % n) + n) % n; trocaEm = Date.now() + GIRO_MS;
  if (manual) { chaveTela = ''; }
  desenhar();
}
document.addEventListener('keydown', (e) => {
  if (!room) return;
  if (e.key === 'ArrowRight' || e.key === 'PageDown') irPara(pag + 1, true);
  else if (e.key === 'ArrowLeft' || e.key === 'PageUp') irPara(pag - 1, true);
  else if (e.key === ' ') { auto = !auto; chaveTela = ''; desenhar(); e.preventDefault(); }
  else if (e.key === 'f' || e.key === 'F') fs.click();
});
app.addEventListener('click', (e) => {
  const b = e.target.closest('[data-pag],[data-auto]'); if (!b) return;
  if (b.dataset.auto !== undefined) { auto = !auto; trocaEm = Date.now() + GIRO_MS; chaveTela = ''; desenhar(); return; }
  irPara(b.dataset.pag === '+' ? pag + 1 : b.dataset.pag === '-' ? pag - 1 : Number(b.dataset.pag), true);
});

function cabeca(pags) {
  const jogo = ['choose', 'playing', 'between'].includes(room?.etapa) && room.fase !== 'sala';
  const mini = jogo ? `<div class="tl-mini"><small>VOLTA ${room.volta} DE 5</small><b id="tlMini">${mmss(room.etapa === 'playing' ? restante() : room.seg)}</b></div>` : '';
  const abas = pags && pags.length > 1 ? `<nav class="tl-abas" aria-label="Páginas do telão"><button class="tl-seta" data-pag="-" type="button" aria-label="Página anterior">‹</button>${pags.map(([, n], i) => `<button class="tl-aba${i === pag ? ' on' : ''}" data-pag="${i}" type="button">${n}</button>`).join('')}<button class="tl-seta" data-pag="+" type="button" aria-label="Próxima página">›</button><button class="tl-aba tl-auto${auto ? ' on' : ''}" data-auto type="button" title="Barra de espaço">${auto ? 'Girando' : 'Parado'}</button></nav>` : '';
  return `<div class="tl-topo"><div class="tl-marca"><small>MOSAICO</small><b>Loop</b></div>${abas}${mini}<div class="tl-codigo">CÓDIGO<strong>${esc(codigo)}</strong></div></div>`;
}

const SALAS_IDS = Object.keys(LOOP_SALAS);
function salasOrdenadas() {
  definirMuseu(room.museu || 0);
  return SALAS_IDS.map((id) => { const m = salaMuseu(id) || {}; return { id, nome: LOOP_SALAS[id][0], peca: LOOP_SALAS[id][2], andar: m.andar || '', lugar: m.lugar || 0 }; })
    .sort((x, y) => (ANDARES.indexOf(x.andar) - ANDARES.indexOf(y.andar)) || (x.lugar - y.lugar));
}
const nomeSala = (id) => (LOOP_SALAS[id] ? LOOP_SALAS[id][0] : id);

function pgMapa() {
  const cont = {}; for (const p of gente()) if (naSala(p)) cont[p.amb] = (cont[p.amb] || 0) + 1;
  const esperando = gente().filter((p) => !naSala(p)).length;
  const tile = (cls, img, nome, andar, n) => `<div class="tl-sala ${cls} ${n ? 'cheia' : 'vazia'}">${n ? `<em>${n}</em>` : ''}${img}<b>${esc(nome)}</b><small>${esc(andar)}</small></div>`;
  return `<div class="tl-card tl-pg-mapa"><div class="tl-mapa">` +
    tile('inicio', '<span class="ic3d" aria-hidden="true">🚪</span>', INICIO.name, INICIO.andar + ' · início', esperando) +
    salasOrdenadas().map((r) => tile('an' + Math.max(0, ANDARES.indexOf(r.andar)), `<img src="${ICONE(r.peca)}" alt="">`, r.nome, r.andar, cont[r.id] || 0)).join('') + `</div></div>`;
}
function pgRelogio() {
  const e = room.etapa, v = room.volta, jog = e === 'playing', seg = restante(), g = gente();
  const passos = {
    1: 'Conversem: o que chamou a atenção? Quem vai atrás de outro sinal?',
    2: 'Juntem as pistas. O que precisa ficar pronto em outra sala?',
    3: 'Combinem o ensaio. O que ainda falta para a última volta?',
    4: 'Dividam as tarefas. Quem opera a Máquina? Quem leva as 3 provas à Recepção?',
    5: 'Conversem sobre o que conseguiram. Registrem o desfecho no celular.'
  };
  const voltas = `<div class="tl-voltas" aria-hidden="true">${[1, 2, 3, 4, 5].map(i => `<b class="${i < v || (i === v && e === 'between') ? 'feita' : i === v ? 'agora' : ''}">${i}</b>`).join('')}</div>`;
  if (e === 'between') return `<div class="tl-card tl-relogio tl-largo">${voltas}<div class="tl-volta">VOLTA ${v} DE 5</div><h1 class="tl-titulo">${v === 5 ? 'A última volta acabou.' : 'O tempo voltou.'}</h1><p class="tl-texto">${passos[v]}</p></div>`;
  return `<div class="tl-card tl-relogio">${voltas}<div class="tl-volta">VOLTA ${v} DE 5</div><div class="tl-tempo" id="tlTempo">${mmss(jog ? seg : room.seg)}</div>
      <div class="tl-museu">Minuto da volta: <time id="tlMin">${loopHora(room.seg, jog ? seg : room.seg)}</time></div></div>
    <div class="tl-card tl-relogio tl-lado"><div class="tl-num"><b>${g.filter(naSala).length}</b><span>de ${g.length}</span></div><p class="tl-texto">já ${g.filter(naSala).length === 1 ? 'escolheu' : 'escolheram'} uma sala</p><div class="tl-sinal" id="tlSinal">${jog ? esc(sinal(seg)) : 'Escolham uma sala no celular.'}</div></div>`;
}
function chips(lista, vazio) {
  const cls = lista.length > 30 ? ' mini' : lista.length > 16 ? ' medio' : '';
  return `<div class="tl-gente${cls}">${lista.map(([nome, img, c]) => `<span class="${c || ''}">${img || ''}${esc(nome)}</span>`).join('') || `<i>${vazio}</i>`}</div>`;
}
function pgTurma() {
  const g = gente(), e = room.etapa;
  if (e === 'final' || e === 'result') {
    const mandou = g.filter(p => p.resp), falta = g.filter(p => !p.resp);
    const miss = e === 'result' ? g.filter(p => p.resp && p.resp.loopMissao) : [];
    return `<div class="tl-card"><p class="tl-volta">${e === 'result' ? 'MISSÕES SECRETAS CUMPRIDAS' : 'JÁ REGISTRARAM'}</p>` +
      (e === 'result' ? `<div class="tl-missoes">${miss.map(p => `<p><b>${esc(p.nome || 'Participante')}</b><span>${esc(p.resp.loopMissao)}</span></p>`).join('') || '<i>Ninguém cumpriu a missão secreta desta vez.</i>'}</div>`
        : chips(mandou.map(p => [p.nome || 'Participante', '', 'ok']), 'Ninguém ainda.')) + `</div>
      <div class="tl-card"><p class="tl-volta">${e === 'result' ? 'QUEM JOGOU' : 'FALTA REGISTRAR'}</p>${chips((e === 'result' ? g : falta).map(p => [p.nome || 'Participante', '', e === 'result' && p.resp ? 'ok' : '']), 'Todo mundo registrou.')}</div>`;
  }
  const dentro = g.filter(naSala), fora = g.filter(p => !naSala(p));
  return `<div class="tl-card"><p class="tl-volta">NAS SALAS · ${dentro.length}</p>${chips(dentro.map(p => [p.nome || 'Participante', LOOP_SALAS[p.amb] ? `<img src="${ICONE(LOOP_SALAS[p.amb][2])}" alt="" title="${esc(nomeSala(p.amb))}">` : '', 'ok']), 'Ninguém escolheu sala ainda.')}</div>
    <div class="tl-card"><p class="tl-volta">NO SAGUÃO · ${fora.length}</p>${chips(fora.map(p => [p.nome || 'Participante', '', '']), 'Todo mundo já está numa sala.')}</div>`;
}
function pgMaquina() {
  const f = (img, t, d) => `<div class="tl-meta">${ficha(img, 'g')}<b>${t}</b><span>${d}</span></div>`;
  return `<div class="tl-card tl-largo"><p class="tl-volta">O QUE A TURMA PRECISA FAZER</p><div class="tl-metas">` +
    f('ui/alvo', 'Achar o defeito', '2 sinais de tipos diferentes e 1 leitura normal') +
    f('T01', 'Consertar a Máquina', 'Nas voltas 3 e 4 é ensaio. Na volta 5 vale.') +
    f('P01', 'Revelar a troca', '3 provas no caderno, um nome, na Recepção') + `</div></div>`;
}
function pgEntrada() {
  const g = gente();
  return `<div class="tl-card tl-ent"><div><h1 class="tl-titulo">Entrem na sala</h1><p class="tl-texto">Apontem a câmera do celular para o QR code ou digitem o código <b>${esc(codigo)}</b>.</p><p class="tl-aviso">O Professor inicia a partida.</p></div>
      <div class="tl-qr" aria-label="QR code de entrada">${window.MosaicoQR ? window.MosaicoQR.svg(conviteUrl(), { nivel: 'M', margem: 2 }) : ''}</div></div>
    <div class="tl-card"><h2 class="tl-titulo">${g.length} na sala</h2>${chips(g.map(p => [p.nome || 'Participante', '', 'ok']), 'Ninguém entrou ainda.')}</div>`;
}
function pgDesfecho() {
  const g = gente();
  if (room.etapa === 'final') {
    const n = g.filter((p) => p.resp).length;
    return `<div class="tl-card tl-relogio"><h1 class="tl-titulo">Desfecho</h1><p class="tl-texto">Registrem o desfecho no celular.</p></div>
      <div class="tl-card tl-relogio"><div class="tl-num"><b>${n}</b><span>de ${g.length}</span></div><p class="tl-texto">já registraram</p></div>`;
  }
  const enviados = g.filter(p => p.resp), coletivo = loopFinalTurma(enviados.map(p => p.resp)), c = CASES[room.caso];
  return coletivo ? `<div class="tl-card tl-relogio tl-largo"><p class="tl-volta">DESFECHO DA TURMA</p><h1 class="tl-titulo tl-enorme">${esc(coletivo.final)}</h1>
      <p class="tl-texto">${esc(LOOP_FINAIS[coletivo.final])}</p><p class="tl-aviso">${coletivo.registrados} de ${g.length} registraram o desfecho.</p></div>`
    : `<div class="tl-card tl-relogio tl-largo"><p class="tl-volta">CONCLUSÃO</p><h1 class="tl-titulo">${esc(enviados.length ? c?.subject : 'Investigação encerrada')}</h1>
        <p class="tl-texto">${esc(enviados.length ? c?.detail : 'A turma encerrou a investigação.')}</p></div>`;
}
function pgNoite() {
  const enviados = gente().filter(p => p.resp);
  return `<div class="tl-card tl-largo">${loopFitaHtml(enviados.map(p => p.resp.loopFatos), gente().length, enviados.map(p => p.nome || 'Participante'))}</div>`;
}
function pgPerguntas() {
  const reflexoes = gente().filter(p => p.resp && EIXOS.some(([k]) => p.resp[k]));
  return `<div class="tl-card tl-largo"><p class="tl-volta">PERGUNTAS DA INVESTIGAÇÃO</p><div class="tl-barras">${EIXOS.map(([k, rotulo]) => {
    const respostas = reflexoes.filter(p => p.resp[k]);
    if (!respostas.length) return '';
    const ok = respostas.filter(p => p.resp[k] === verdade(room.caso, k)).length;
    const pc = Math.round(ok / respostas.length * 100);
    return `<div class="tl-barra"><span>${esc(rotulo)}</span><div><i style="width:${pc}%"></i></div><span>${ok}/${respostas.length}</span></div>`;
  }).join('')}</div></div>`;
}
const PG = { entrada: pgEntrada, relogio: pgRelogio, mapa: pgMapa, turma: pgTurma, maquina: pgMaquina, desfecho: pgDesfecho, noite: pgNoite, perguntas: pgPerguntas };

function desenhar() {
  if (!room) { app.innerHTML = `<div class="tl-raiz">${cabeca()}<div class="tl-meio"><div class="tl-card tl-largo tl-relogio"><h1 class="tl-titulo">Sala não encontrada</h1><p class="tl-texto">Confira o código e abra de novo.</p></div></div></div>`; return; }
  if (room.aulaEncerrada) { app.innerHTML = `<div class="tl-raiz">${cabeca()}<div class="tl-meio"><div class="tl-card tl-largo tl-relogio"><p class="tl-volta">AULA ENCERRADA</p><h1 class="tl-titulo">Obrigado por participar!</h1><p class="tl-texto">O Professor encerrou a aula.</p></div></div></div>`; chaveTela = ''; return; }
  const pags = paginasDaEtapa();
  if (pag >= pags.length) pag = 0;
  const g = gente();
  // Só refaz a tela quando algo de fato muda; o relógio atualiza no lugar (nada pisca).
  const chave = [room.fase, room.etapa, room.volta, room.rodada, pag, auto, pags.length, g.map(p => [p.id, p.nome, p.amb, p.ambVolta, p.resp ? 1 : 0].join(':')).join('|')].join('~');
  if (chave !== chaveTela) {
    chaveTela = chave;
    const dots = pags.length > 1 ? `<div class="tl-dots" aria-hidden="true">${pags.map((_, i) => `<b class="${i === pag ? 'on' : ''}"></b>`).join('')}</div>` : '<span></span>';
    const jog = ['choose', 'playing'].includes(room.etapa) && room.fase !== 'sala';
    const aviso = jog ? `${g.filter(naSala).length} de ${g.length} numa sala` : '';
    app.innerHTML = `<div class="tl-raiz">${cabeca(pags)}<div class="tl-meio pg-${pags[pag][0]}">${PG[pags[pag][0]]()}</div><div class="tl-rodape"><span class="tl-aviso">${aviso}</span>${dots}<span class="tl-fs-vao"></span></div></div>`;
    return;
  }
  if (room.etapa === 'playing' && room.fase !== 'sala') {
    const seg = restante(), set = (id, t) => { const el = document.getElementById(id); if (el && el.textContent !== t) el.textContent = t; };
    set('tlMini', mmss(seg)); set('tlTempo', mmss(seg)); set('tlMin', loopHora(room.seg, seg)); set('tlSinal', sinal(seg));
  }
}

async function main() {
  if (!FALSA && !codigo) return entrada();
  try { T = FALSA ? transporteFalso({ codigo: codigo || 'SIMUL', papel: 'telao', uid: 'telao' }) : await transporteTelao(codigo); }
  catch (e) { return entrada('Não consegui abrir. Confira a conexão.'); }
  await T.sincronizar().catch(() => {});
  let etapaAntes = '';
  T.aoMudar((r, ps) => {
    room = r; players = ps || [];
    const et = room ? room.fase + ':' + room.etapa + ':' + room.volta : '';
    if (et !== etapaAntes) { etapaAntes = et; pag = 0; trocaEm = Date.now() + GIRO_MS; }   // etapa nova começa pela primeira página
    desenhar();
  });
  room = T.sala; players = T.jogadores; trocaEm = Date.now() + GIRO_MS; desenhar();
  setInterval(() => {
    if (!room) return;
    if (auto && Date.now() >= trocaEm && paginasDaEtapa().length > 1) { irPara(pag + 1); return; }
    if (room.etapa === 'playing') desenhar();
  }, 500);
}
main();
