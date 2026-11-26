// Loop (MOSAICO) · telão: só lê a sala e mostra o que a turma inteira pode ver. Nunca mostra pistas.
// O conteúdo fica em páginas por tema (Relógio, Mapa, Turma, Máquina; no fim: Desfecho, A noite, Para conversar, Turma),
// com abas, setas do teclado e troca automática (que dá para parar). As salas são só as 15 da história (LOOP_SALAS).
import { transporteTelao, transporteFalso, ms } from '../transporte.mjs';
import { ANDARES, INICIO, LOOP_SALAS, definirMuseu } from '../conteudo.js?v=4';

const P = new URLSearchParams(location.search);
const FALSA = P.get('falsa') === '1';
const codigo = (P.get('sala') || '').toUpperCase();
const app = document.getElementById('app');
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
  app.innerHTML = `<div class="tl-entrada"><form class="card" id="f"><div class="tl-ent-topo">${ficha('ui/telao')}<div><p class="kicker">MOSAICO LOOP</p><h2>Telão da sala</h2></div></div>
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
  if (dec >= 160) return 'O alarme dispara no museu.';
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
  return [['desfecho', 'Desfecho'], ['noite', 'A noite'], ['conversa', 'Para conversar'], ['missoes', 'Missões'], ['turma', 'Turma']];
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
  const mini = jogo ? `<div class="tl-mini"><small>VOLTA ${room.volta} DE 5</small><b id="tlMini">${room.etapa === 'between' ? 'pausa' : mmss(room.etapa === 'playing' ? restante() : room.seg)}</b></div>` : '';
  const abas = pags && pags.length > 1 ? `<nav class="tl-abas" aria-label="Páginas do telão"><button class="tl-seta" data-pag="-" type="button" aria-label="Página anterior">‹</button>${pags.map(([, n], i) => `<button class="tl-aba${i === pag ? ' on' : ''}" data-pag="${i}" type="button">${n}</button>`).join('')}<button class="tl-seta" data-pag="+" type="button" aria-label="Próxima página">›</button><button class="tl-aba tl-auto${auto ? ' on' : ''}" data-auto type="button" title="Barra de espaço">Troca sozinha: ${auto ? 'sim' : 'não'}</button></nav>` : '';
  return `<div class="tl-topo"><div class="tl-marca"><b>Mosaico Loop</b></div>${abas}${mini}<div class="tl-codigo">CÓDIGO<strong>${esc(codigo)}</strong></div></div>`;
}

const SALAS_IDS = Object.keys(LOOP_SALAS);
function salasOrdenadas() {
  definirMuseu(room.museu || 0);
  return SALAS_IDS.map((id) => { return { id, nome: LOOP_SALAS[id][0], peca: LOOP_SALAS[id][2], andar: LOOP_SALAS[id][3] || '', lugar: LOOP_SALAS[id][4] || 0 }; })   // andar fixo da história
    .sort((x, y) => (ANDARES.indexOf(x.andar) - ANDARES.indexOf(y.andar)) || (x.lugar - y.lugar));
}
const nomeSala = (id) => (LOOP_SALAS[id] ? LOOP_SALAS[id][0] : id);

function pgMapa() {
  const cont = {}; for (const p of gente()) if (naSala(p)) cont[p.amb] = (cont[p.amb] || 0) + 1;
  const esperando = gente().filter((p) => !naSala(p)).length;
  const tile = (cls, img, nome, andar, n) => `<div class="tl-sala ${cls} ${n ? 'cheia' : 'vazia'}">${n ? `<em>${n}</em>` : ''}${img}<b lang="pt-BR">${esc(nome)}</b><small>${esc(andar)}</small></div>`;
  return `<div class="tl-card tl-pg-mapa"><div class="tl-mapa">` +
    tile('inicio', `<img src="${ICONE('ui/saguao')}" alt="">`, INICIO.name, INICIO.andar + ' · início', esperando) +
    salasOrdenadas().map((r) => tile('an' + Math.max(0, ANDARES.indexOf(r.andar)), `<img src="${ICONE(r.peca)}" alt="">`, r.nome, r.andar, cont[r.id] || 0)).join('') + `</div></div>`;
}
function pgRelogio() {
  const e = room.etapa, v = room.volta, jog = e === 'playing', seg = restante(), g = gente();
  const passos = {
    1: 'Conversem: o que chamou a atenção? Quem vai atrás de outro sinal?',
    2: 'Juntem as pistas. O que precisa ficar pronto em outra sala?',
    3: 'Combinem o ensaio. O que ainda falta para a última volta?',
    4: 'Dividam as tarefas. Quem opera a Máquina? Quem leva as 3 provas à Recepção?',
    5: 'Conversem sobre o que conseguiram. Contem no celular como a noite acabou.'
  };
  const voltas = `<div class="tl-voltas" aria-hidden="true">${[1, 2, 3, 4, 5].map(i => `<b class="${i < v || (i === v && e === 'between') ? 'feita' : i === v ? 'agora' : ''}">${i}</b>`).join('')}</div>`;
  if (e === 'between') return `<div class="tl-card tl-relogio tl-largo tl-pausa"><img class="tl-arte" src="${ICONE('T01')}" alt=""><div>${voltas}<div class="tl-volta">VOLTA ${v} DE 5</div><h1 class="tl-titulo">${v === 5 ? 'A última volta acabou.' : 'O tempo voltou.'}</h1><p class="tl-texto">${passos[v]}</p></div></div>`;
  return `<div class="tl-card tl-relogio">${voltas}<div class="tl-volta">VOLTA ${v} DE 5</div><div class="tl-tempo" id="tlTempo">${mmss(jog ? seg : room.seg)}</div>
      <div class="tl-museu">Minuto da volta: <time id="tlMin">${loopHora(room.seg, jog ? seg : room.seg)}</time></div></div>
    <div class="tl-card tl-relogio tl-lado"><div class="tl-num"><b>${g.filter(naSala).length}</b><span>de ${g.length}</span></div><p class="tl-texto">já ${g.filter(naSala).length === 1 ? 'escolheu' : 'escolheram'} uma sala</p><div class="tl-sinal" id="tlSinal">${jog ? esc(sinal(seg)) : 'Escolham uma sala no celular.'}</div></div>`;
}
// Fichas com os nomes. O tamanho da letra começa grande e desce só o que for preciso para caber no cartão (função caber): com 40 pessoas nada fica cortado.
function chips(lista, vazio) {
  const cls = lista.length <= 8 ? ' grande' : '';
  return `<div class="tl-gente${cls}" style="--n:${Math.max(1, lista.length)}">${lista.map(([nome, img, c, papel]) => `<span class="${c || ''}">${img || ''}${esc(nome)}${papel ? `<small> · ${esc(papel)}</small>` : ''}</span>`).join('') || `<i>${vazio}</i>`}</div>`;
}
const fr = (n) => Math.max(10, Math.min(40, n));   // largura de cada cartão conforme a quantidade de nomes
function pgTurma() {
  const g = gente(), e = room.etapa;
  if (e === 'result') return `<div class="tl-card tl-largo"><p class="tl-volta">QUEM JOGOU · ${g.length}</p>${chips(g.map(p => [p.nome || 'Participante', '', p.resp ? 'ok' : '']), 'Ninguém entrou.')}</div>`;
  if (e === 'final') {
    const mandou = g.filter(p => p.resp), falta = g.filter(p => !p.resp);
    return `<div class="tl-card" style="--fr:${fr(mandou.length)}"><p class="tl-volta">JÁ CONTARAM · ${mandou.length}</p>${chips(mandou.map(p => [p.nome || 'Participante', '', 'ok']), 'Ninguém ainda.')}</div>
      <div class="tl-card" style="--fr:${fr(falta.length)}"><p class="tl-volta">FALTA CONTAR · ${falta.length}</p>${chips(falta.map(p => [p.nome || 'Participante', '', '']), 'Todo mundo contou.')}</div>`;
  }
  const dentro = g.filter(naSala), fora = g.filter(p => !naSala(p));
  const papel = (p) => (room.volta >= 4 && p.papel5 ? p.papel5 : '');   // papel escolhido na pausa da volta 4
  const salas = `<div class="tl-card${fora.length ? '' : ' tl-largo'}" style="--fr:${fr(dentro.length)}"><p class="tl-volta">NAS SALAS · ${dentro.length}</p>${chips(dentro.map(p => [p.nome || 'Participante', LOOP_SALAS[p.amb] ? `<img src="${ICONE(LOOP_SALAS[p.amb][2])}" alt="" title="${esc(nomeSala(p.amb))}">` : '', 'ok', papel(p)]), 'Ninguém escolheu sala ainda.')}</div>`;
  if (!dentro.length) return `<div class="tl-card tl-largo"><p class="tl-volta">NO SAGUÃO · ${fora.length}</p>${chips(fora.map(p => [p.nome || 'Participante', '', '', papel(p)]), 'Ninguém entrou ainda.')}</div>`;
  return salas + (fora.length ? `<div class="tl-card" style="--fr:${fr(fora.length)}"><p class="tl-volta">NO SAGUÃO · ${fora.length}</p>${chips(fora.map(p => [p.nome || 'Participante', '', '', papel(p)]), '')}</div>` : '');
}
// Missões secretas cumpridas, no resultado: uma linha por missão, com os nomes de quem cumpriu (no máximo 8 linhas, com qualquer tamanho de turma).
function pgMissoes() {
  const miss = gente().filter(p => p.resp && p.resp.loopMissao), grupos = {};
  for (const p of miss) (grupos[p.resp.loopMissao] ||= []).push(p.nome || 'Participante');
  const linhas = Object.entries(grupos).sort((a, b) => b[1].length - a[1].length);
  return `<div class="tl-card tl-largo"><p class="tl-volta">MISSÕES SECRETAS CUMPRIDAS · ${miss.length}</p><div class="tl-missoes${linhas.length > 4 ? ' duas' : ''}">${linhas.map(([m, ns]) => `<p><b><img src="${ICONE('ui/missao')}" alt="">${esc(m)}</b><span>${ns.map(n => `<em>${esc(n)}</em>`).join('')}</span></p>`).join('') || '<i>Ninguém cumpriu a missão secreta desta vez.</i>'}</div></div>`;
}
function pgMaquina() {
  const f = (img, t, d) => `<div class="tl-meta">${ficha(img, 'g')}<b>${t}</b><span>${d}</span></div>`;
  return `<div class="tl-card tl-largo"><p class="tl-volta">O QUE A TURMA PRECISA FAZER</p><div class="tl-metas">` +
    f('ui/alvo', 'Achar o defeito', '2 sinais de tipos diferentes e 1 leitura normal') +
    f('T01', 'Consertar a Máquina', 'Das voltas 2 a 4 é ensaio. Na volta 5 vale.') +
    f('P01', 'Revelar o que aconteceu', '3 provas no caderno, um nome, na Recepção') + `</div></div>`;
}
function pgEntrada() {
  const g = gente();
  return `<div class="tl-card tl-ent${g.length > 16 ? ' estreito' : ''}" style="--fr:${g.length > 16 ? 16 : 40}"><div><h1 class="tl-titulo">Entrem na sala</h1><p class="tl-texto">Apontem a câmera para o QR code. Ou digitem o código <b>${esc(codigo)}</b>.</p><p class="tl-aviso">O Professor inicia a partida.</p></div>
      <div class="tl-qr" aria-label="QR code de entrada">${window.MosaicoQR ? window.MosaicoQR.svg(conviteUrl(), { nivel: 'M', margem: 2 }) : ''}</div></div>
    <div class="tl-card" style="--fr:${fr(g.length) * 1.3}"><h2 class="tl-titulo">${g.length} na sala</h2>${chips(g.map(p => [p.nome || 'Participante', '', 'ok']), 'Ninguém entrou ainda.')}</div>`;
}
function pgDesfecho() {
  const g = gente();
  if (room.etapa === 'final') {
    const n = g.filter((p) => p.resp).length;
    return `<div class="tl-card tl-relogio tl-pausa"><img class="tl-arte" src="${ICONE('ui/caderno')}" alt=""><div><h1 class="tl-titulo">Desfecho</h1><p class="tl-texto">Contem no celular como a noite acabou.</p></div></div>
      <div class="tl-card tl-relogio"><div class="tl-num"><b>${n}</b><span>de ${g.length}</span></div><p class="tl-texto">já contaram</p></div>`;
  }
  const enviados = g.filter(p => p.resp), coletivo = loopFinalTurma(enviados.map(p => p.resp));
  if (!coletivo) return `<div class="tl-card tl-relogio tl-largo"><p class="tl-volta">DESFECHO</p><h1 class="tl-titulo">A noite acabou.</h1><p class="tl-texto">Ninguém contou o desfecho no celular.</p></div>`;
  const fs = enviados.map(p => p.resp.loopFinal), tem = (...l) => fs.some(x => l.includes(x));
  const ficha = (img, ok, t) => `<div class="tl-meta ${ok ? 'ok' : 'nao'}">${`<span class="ic3d g" aria-hidden="true"><img src="${ICONE(img)}" alt=""></span>`}<b>${t}</b><span>${ok ? '✓ feito' : 'ficou aberto'}</span></div>`;
  return `<div class="tl-card tl-relogio tl-largo"><p class="tl-volta">DESFECHO DA TURMA</p><h1 class="tl-titulo tl-enorme">${esc(LOOP_FINAL_NOME[coletivo.final] || coletivo.final)}</h1>
      <p class="tl-texto">${esc(loopFinalTexto(coletivo.final, enviados.map(p => p.resp)))}</p>
      <div class="tl-metas tl-res">${ficha('ui/alvo', enviados.some(p => p.resp.loopDefeito) || tem('Ouro', 'Desligar'), 'Achar o defeito')}${ficha('T01', tem('Ouro', 'Desligar'), 'Consertar a Máquina')}${ficha('P01', tem('Ouro', 'Revelar'), 'Revelar a noite')}</div>
      <p class="tl-aviso">${coletivo.registrados} de ${g.length} contaram o desfecho.</p></div>`;
}
function pgNoite() {
  const enviados = gente().filter(p => p.resp);
  return `<div class="tl-card tl-largo">${loopFitaHtml(enviados.map(p => p.resp.loopFatos), gente().length, enviados.map(p => p.nome || 'Participante'), enviados.map(p => p.resp.loopDefeito || ''), new URL('../../museu/icones/', import.meta.url).href)}</div>`;
}
function pgConversa() {
  return `<div class="tl-card tl-relogio tl-largo tl-pausa"><img class="tl-arte" src="${ICONE('ui/dupla')}" alt=""><div><p class="tl-volta">PARA CONVERSAR</p><h1 class="tl-titulo tl-pergunta">${esc(LOOP_CONVERSA)}</h1></div></div>`;
}
const PG = { entrada: pgEntrada, relogio: pgRelogio, mapa: pgMapa, turma: pgTurma, maquina: pgMaquina, desfecho: pgDesfecho, noite: pgNoite, conversa: pgConversa, missoes: pgMissoes };
// Faz os nomes caberem no cartão: a letra desce até 1,35% da largura; se ainda sobrar, o papel sai da ficha; por último a letra desce até 1%.
function caber() {
  const vw = innerWidth / 100;
  for (const c of app.querySelectorAll('.tl-card')) {
    const alvos = [...c.querySelectorAll('.tl-gente,.tl-missoes')]; if (!alvos.length) continue;
    c.classList.add('tl-col');   // título em cima, nomes no espaço que sobra
    c.classList.remove('sem-papel'); alvos.forEach(a => { a.style.fontSize = ''; });
    const sobra = () => c.scrollHeight - c.clientHeight > 1 || alvos.some(a => a.scrollHeight - a.clientHeight > 1);
    const descer = (piso) => { let f = parseFloat(getComputedStyle(alvos[0]).fontSize); while (sobra() && f > piso) { f = Math.max(piso, f * .95); alvos.forEach(a => { a.style.fontSize = f + 'px'; }); } };
    descer(1.35 * vw);
    if (sobra() && c.querySelector('.tl-gente small')) { c.classList.add('sem-papel'); alvos.forEach(a => { a.style.fontSize = ''; }); descer(1.35 * vw); }
    if (sobra()) descer(vw);
  }
}
// A fita da noite: nenhuma linha corta texto. A letra desce até 1,35% da largura (e, só se ainda faltar lugar, até 1%).
function caberFita() {
  const vw = innerWidth / 100;
  for (const f of app.querySelectorAll('.tl-fita')) {
    f.style.removeProperty('--fz'); const lis = [...f.querySelectorAll('li')]; if (!lis.length) continue;
    const corta = () => lis.some(li => li.scrollHeight - li.clientHeight > 1 || [...li.children].some(c => c.scrollWidth - c.clientWidth > 1 && !c.matches('i')));
    let z = parseFloat(getComputedStyle(lis[0]).fontSize);
    for (const piso of [1.35 * vw, vw]) while (corta() && z > piso) { z = Math.max(piso, z * .96); f.style.setProperty('--fz', z + 'px'); }
  }
}
addEventListener('resize', () => { if (room) { caber(); caberFita(); } });

function desenhar() {
  if (!room) { app.innerHTML = `<div class="tl-raiz">${cabeca()}<div class="tl-meio"><div class="tl-card tl-largo tl-relogio"><h1 class="tl-titulo">Sala não encontrada</h1><p class="tl-texto">Confira o código e abra de novo.</p></div></div></div>`; return; }
  if (room.aulaEncerrada) { app.innerHTML = `<div class="tl-raiz">${cabeca()}<div class="tl-meio"><div class="tl-card tl-largo tl-relogio"><p class="tl-volta">AULA ENCERRADA</p><h1 class="tl-titulo">Obrigado por participar!</h1><p class="tl-texto">O Professor encerrou a aula.</p></div></div></div>`; chaveTela = ''; return; }
  const pags = paginasDaEtapa();
  if (pag >= pags.length) pag = 0;
  const g = gente();
  // Só refaz a tela quando algo de fato muda; o relógio atualiza no lugar (nada pisca).
  const chave = [room.fase, room.etapa, room.volta, room.rodada, pag, auto, pags.length, g.map(p => [p.id, p.nome, p.amb, p.ambVolta, p.papel5 || '', p.resp ? 1 : 0].join(':')).join('|')].join('~');
  if (chave !== chaveTela) {
    chaveTela = chave;
    const dots = pags.length > 1 ? `<div class="tl-dots" aria-hidden="true">${pags.map((_, i) => `<b class="${i === pag ? 'on' : ''}"></b>`).join('')}</div>` : '<span></span>';
    const jog = ['choose', 'playing'].includes(room.etapa) && room.fase !== 'sala';
    const aviso = jog ? `${g.filter(naSala).length} de ${g.length} numa sala` : '';
    app.innerHTML = `<div class="tl-raiz">${cabeca(pags)}<div class="tl-meio pg-${pags[pag][0]}">${PG[pags[pag][0]]()}</div><div class="tl-rodape"><span class="tl-aviso">${aviso}</span>${dots}<span class="tl-fs-vao"></span></div></div>`;
    caber(); caberFita();
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
