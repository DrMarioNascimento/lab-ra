/* Loop · A Máquina (camada central). Dados em loop-central-dados.js (LC_DADOS).
   O defeito (uma de 5 causas) e os números do conserto são sorteados pela semente da partida. Tudo roda no aparelho de cada pessoa:
   a dupla coopera falando (palavra da dupla que gira a cada 30 s; código da chave; janela do raio).
   Estado em state.lc (por noite). Ver docs/LOOP-CENTRAL.md. */
const LC = LC_DADOS;
const LC_PID = Object.fromEntries(LC.pistas.map(p => [p.id, p]));
const LC_AT = Object.fromEntries(LC.atividades_coop.map(a => [a.id, a]));
const LC_NOME = {A_calibrar:'Falta ajustar', B_potencia:'Falta força', C_ancora:'Peça errada na base', D_fusivel:'Alguém desligou de propósito', E_dois:'Dois defeitos juntos'};
// Ícones: miniatura 3D da peça quando existe objeto da história ('img:PEÇA'); senão, ícone 3D próprio do Loop em museu/icones/ui ('img:ui/nome'). Não há mais emoji provisório (docs/ICONES-A-GERAR.md).
const LC_BASE = new URL('.', (typeof document !== 'undefined' && document.currentScript && document.currentScript.src) || location.href);
const lcIc = n => new URL('museu/icones/' + n + '.webp', LC_BASE).href;
const lcFicha = (x, cls) => '<span class="ic3d' + (cls ? ' ' + cls : '') + '" aria-hidden="true">' + (String(x).startsWith('img:') ? '<img src="' + lcIc(x.slice(4)) + '" alt="" loading="lazy">' : x) + '</span>';
const lcFichaSala = (id, cls) => lcFicha('img:' + ((typeof sala === 'function' && sala(id) && sala(id).peca) || 'ui/caderno'), cls);
const LC_ICONE = {A_calibrar:'img:ui/falta-ajustar', B_potencia:'img:Q01', C_ancora:'img:V11', D_fusivel:'img:M03', E_dois:'img:ui/dois-defeitos'};
const lcEtqClasse = e => /^SINAL/i.test(e || '') ? 'sinal' : /^LEITURA COMPLETA/i.test(e || '') ? 'completa' : /^LEITURA/i.test(e || '') ? 'normal' : /^MANUAL/i.test(e || '') ? 'manual' : 'outra';
const lcEtqIcone = e => '<img class="lc-etq-ic" src="' + lcIc(/^MANUAL/i.test(e) ? 'ui/manual' : /^SINAL/i.test(e) ? 'ui/sinal' : /^LEITURA COMPLETA/i.test(e) ? 'T01' : 'ui/leitura-normal') + '" alt="">';
const LC_CAUSAS = ['A_calibrar','B_potencia','C_ancora','D_fusivel','E_dois'];
// Valores do conserto sorteados pela semente (nada para decorar entre partidas). Os textos trazem marcadores {dia}, {hora}, {reg}...
let LC_VC = null;
function lcVals(){
 const chave = state.caseIndex + ':' + semente(); if (LC_VC && LC_VC.k === chave) return LC_VC;
 const h = k => hashTxt('v' + k + ':' + chave), mm = x => Math.floor(x / 60) + ':' + String(x % 60).padStart(2, '0');
 const dia = 9 + Math.floor(h('d') * 17), off = [-10, -5, 0, 5, 10][Math.floor(h('h') * 5)], R = 70 + off;
 const ordem = ['1-2-3','1-3-2','2-1-3','2-3-1','3-1-2','3-2-1'][Math.floor(h('o') * 6)], cp = [[1,2,3],[2,3,1],[3,1,2]][Math.floor(h('c') * 3)], reg = 105 + Math.floor(h('r') * 890);
 return LC_VC = {k:chave, off, dia, dia_a:dia - 4, dia_b:dia - 2, hora:mm(R), hora3:mm(R + 3), j0:mm(R - 6), j1:mm(R + 10), reg, reg_inv:String(reg).split('').reverse().join(''), ordem, ordem_txt:ordem.split('-').join(', depois '), ch:cp[0], ch_b:cp[1], ch_c:cp[2]};
}
const lcTok = t => String(t).replace(/\{(dia_a|dia_b|dia|hora3|hora|j0|j1|reg_inv|reg|ordem_txt|ordem|ch_b|ch_c|ch)\}/g, (m, k) => lcVals()[k]);
const lcValor = k => { const v = lcVals(); return ({dia_da_troca:v.dia, hora_do_apagao:v.hora, tombo:v.reg, ordem_circuito:v.ordem, chave_do_raio:v.ch})[k] ?? LC.valores[k]; };
const lcT = p => { const t = p.segundo_min || 0; return (t >= 60 && t <= 100) ? t + lcVals().off : t; };
window.lcTok = lcTok;
const LC_JANELA = {get 0(){ return 64 + lcVals().off; }, get 1(){ return 80 + lcVals().off; }};
const lcCausa = () => LC.causas_jogaveis[Math.floor(hashTxt('lc' + state.caseIndex + ':' + semente()) * LC.causas_jogaveis.length)];
function lcS(){
 if (!state.lc || state.lc.ci !== state.caseIndex) state.lc = {ci:state.caseIndex, anexos:{}, diag:null, conserto:null, ensaio:[], meio:{}, revelado:null, chao:{}, eco:null, mao:null, chaoUsado:false, recebeu:{}, debitos:{}, feitas:{}};
 state.lc.meio ||= {};
 return state.lc;
}
const lcAlvos = () => { const a = LC.conserto_por_causa[lcCausa()] || []; return Array.isArray(a) ? a : [a]; };
const lcMeioPendente = A => { const al = lcAlvos(), s = lcS(); return al.length > 1 && al.includes(A.id) && !al.filter(o => o !== A.id).every(o => s.meio[o] && s.meio[o] < state.loop); };   // um conserto por volta, com ou sem dupla
const lcVmin = A => (lcAlvos().length > 1 && lcAlvos().includes(A.id)) ? LC.regras.E_volta_min_meio : A.volta_min;
const lcFmt = k => LC.formato_valores[k] || {};
function lcNorm(k, v){
 v = String(v).trim().toLowerCase(); const t = lcFmt(k).tipo, dig = v.replace(/\D/g, '');
 if (t === 'hora') { v = v.replace(/[hm.,;-]/g, ':').replace(/[s:]+$/, ''); if (v.includes(':')) { const [a, b] = v.split(':'); return [String(Number(a) * 60 + Number(b || 0))]; } return dig ? [String(Number(dig))] : []; }
 if (t === 'numero') return dig ? [String(Number(dig))] : [];
 if (t === 'sequencia') return dig ? [dig.split('').join('-')] : [];
 return [v];
}
function lcConfere(A, vals){
 const erradas = A.valores_pedidos.filter((k, i) => { const esp = lcNorm(k, lcValor(k)), got = lcNorm(k, vals[i] ?? ''); return !esp.some(x => got.includes(x)); });
 return {certos:A.valores_pedidos.length - erradas.length, tot:A.valores_pedidos.length, erradas};
}
// Valores errados: a máquina só diz quantos estão certos, nunca qual está errado. O formato de cada valor aparece dentro do campo.
const lcMsgErro = (A, r, custo) => 'A MÁQUINA NÃO REAGE: ' + (r.tot === 1 ? 'o valor não confere. ' : r.certos + ' de ' + r.tot + (r.certos === 1 ? ' certo. ' : ' certos. ')) + (state.loop <= 4 ? 'Era ensaio: você só gastou a energia.' : 'Você gastou ' + custo + ' de energia.');
const lcAtiva = x => !x.soNaCausa || x.soNaCausa.includes(lcCausa());
const lcId = id => 'lc-' + id;
const lcTem = id => (state.clues || []).some(c => c.id === lcId(id));
const lcTemGrupo = g => (LC.grupos_fonte[g]?.fontes || []).some(lcTem);
const lcSeg = () => state.phase === 'playing' ? (state.duration - (state.endAt - (window.coop?.now() ?? Date.now())) / 1000) * 300 / state.duration : 0;

// ---- glossário na palavra: uma letrinha "?" ao lado do termo difícil abre e fecha a explicação ali mesmo (mesmo jeito do "i" das regras)
const LC_GLOS = [
  ['roleta de entradas?', 'A roleta da entrada, a que gira quando você passa.'],
 ['disjuntor(?:es)?', 'A chave do quadro de luz que desarma quando algo dá errado.'],
 ['fusíve(?:l|is)(?:-mestre)?', 'Peça pequena que queima para proteger a energia.'],
 ['patrocin(?:ador(?:es)?|io)', 'Quem paga as despesas do museu e aparece com o nome numa exposição.'],
 ['restauro', 'Consertar uma obra antiga.'],
 ['dossiê', 'A página da Máquina onde você prova o defeito com 3 pistas do seu caderno.'],
 ['eco', 'O som que volta. Aqui, a gravação que a máquina guarda.'],
 ['sinais?', 'Pista que mostra o que está errado na máquina.'],
 ['leituras? norma(?:l|is)', 'Pista que mostra uma parte da máquina que está bem. Ela afasta outro defeito.', 1],
 ['etiquetas?', 'O tipo da pista. Duas pistas com a mesma etiqueta valem um sinal só.', 1],
 ['ensaio', 'Treino do conserto: das voltas 2 a 4 você treina, na 5 vale.', 1]
].map(([re, txt, jogo]) => ({re: new RegExp('(?<![\\p{L}])(' + re + ')(?![\\p{L}])', 'iu'), txt, jogo: !!jogo}));   // jogo: palavra de regra; no caderno ela é palavra da história e fica sem "?"
const LC_GLOS_LISTA = [['Peça principal','A máscara de pedra de uns 300 anos, a peça mais importante da Galeria. Na testa, ela tem uma frase numa escrita antiga.'],['Inscrição','Frase gravada na pedra. Para ler a da máscara, use a tábua do livro de registro.'],['Registro','Número que identifica a peça, tipo o RG dela (ex.: 050).'],['Luz da peça','A luz do painel que acende amarela quando a Câmara está presa a uma peça e a peça da base não é a registrada.'],['Ponto de ligação','Onde o fio se encaixa, tipo uma tomada.'],['Roleta de entrada','A roleta da entrada, a que gira quando você passa.'],['Ajustar','Acertar os números da máquina, como acertar um relógio.'],['Disjuntor','A chave do quadro de luz que desarma quando algo dá errado.'],['Fusível','Peça pequena que queima para proteger a energia.'],['Base da peça','O suporte onde a peça fica apoiada. "Embaixo da base" de uma peça é o fundo dela, onde fica o número gravado.'],['Patrocinador','Quem paga as despesas do museu e aparece com o nome numa exposição.'],['Restauro','Consertar uma obra antiga.'],['Dossiê','A página da Máquina onde você prova o defeito com 3 pistas do seu caderno.'],['Eco','O som que volta. Aqui, a gravação que a máquina guarda.'],['Sinal','Pista que mostra o que está errado na máquina.'],['Leitura normal','Pista que mostra uma parte da máquina que está bem. Ela afasta outro defeito.'],['Etiqueta','O tipo da pista. Duas pistas com a mesma etiqueta valem um sinal só.'],['Ensaio','Treino do conserto: das voltas 2 a 4 você treina, na 5 vale.']];
function lcGlos(html, soMundo){
 const usados = new Set();
 return String(html).replace(/(<[^>]*>)|([^<]+)/g, (m, tag, texto) => {
  if (tag || !texto) return m;
  for (const g of LC_GLOS) { if (usados.has(g.txt) || (soMundo && g.jogo)) continue; const r = texto.match(g.re); if (!r) continue;
   usados.add(g.txt); texto = texto.replace(g.re, '$1<button type="button" class="lc-gi" aria-label="O que é ' + r[1].toLowerCase() + '?" aria-expanded="false">?</button><span class="lc-gx" hidden>' + g.txt + '</span>'); }
  return texto; });
}
window.lcGlos = lcGlos;
// pré-conferência: olha só a etiqueta que está escrita em cada pista marcada (não diz qual é o defeito), para ninguém gastar a tentativa por erro de forma
function lcPreConf(){
 const el = document.getElementById('lcPre'); if (!el) return;
 const marc = Array.from(document.querySelectorAll('input[name=lcprova]:checked')).map(i => (state.clues || []).find(c => c.id === 'lc-' + i.value)).filter(Boolean);
 let sin = [], sis = 0, out = 0, comp = 0; for (const c of marc) { const e = (c.etq || '').toUpperCase(); if (e.startsWith('SINAL')) sin.push(e); else if (e.startsWith('LEITURA COMPLETA')) comp++; else if (e.startsWith('LEITURA')) sis++; else out++; }
 if (comp) { el.textContent = 'Você marcou a leitura completa do painel: ela vale sozinha. Falta escolher o defeito.'; return; }
 const tipos = new Set(sin).size, ok = marc.length === 3 && sin.length === 2 && tipos === 2 && sis === 1;
 let m = 'Marcadas: ' + marc.length + ' de 3 · sinais: ' + sin.length + ' (' + tipos + ' tipo' + (tipos === 1 ? '' : 's') + ') · leitura normal: ' + sis + (out ? ' · outras: ' + out : '') + '.';
 if (marc.length === 3 && !ok) { if (out) m += ' Pista sem etiqueta de sinal ou de leitura normal não conta.'; if (sin.length === 2 && tipos < 2) m += ' Os dois sinais têm a mesma etiqueta: valem um só.'; else if (sin.length !== 2) m += ' Precisa de 2 sinais.'; if (sis !== 1) m += ' Precisa de 1 leitura normal.'; }
 if (ok) m += ' Forma certa. Falta ver se o defeito é esse.';
 el.textContent = m;
}
document.addEventListener('change', e => { if (e.target && e.target.name === 'lcprova') lcPreConf(); });
document.addEventListener('click', e => { const b = e.target.closest && e.target.closest('.lc-gi'); if (!b) return; e.preventDefault(); e.stopPropagation(); const x = b.nextElementSibling; if (!x) return; x.hidden = !x.hidden; b.setAttribute('aria-expanded', String(!x.hidden)); b.textContent = x.hidden ? '?' : '×'; });
// ---- armadilha do pêndulo: adianta o relógio de TODO mundo (cada aparelho aplica uma vez; o aviso viaja pelo campo do próprio jogador na sala do Mestre)
function lcAcelerar(id, seg){
 const s = lcS(); s.alarmes ||= {}; if (s.alarmes[id]) return false; s.alarmes[id] = state.loop;
 if (state.phase === 'playing' && Number.isFinite(state.endAt)) { state.endAt -= seg * 1000 * (state.duration / 300); state.remaining = Math.max(0, (state.endAt - (window.coop?.now() ?? Date.now())) / 1000); }
 save(); return true;
}
function lcOuvirAlarmes(){
 const D = window.DragonSala; if (!D || D._lcOuve) return; D._lcOuve = true;
 D.aoMudar((sala, jogs) => { for (const j of (jogs || [])) if (j && j.alarmeId && j.alarmeVolta === state.loop && lcAcelerar(j.alarmeId, j.alarmeSeg || 40)) { toast('ALARME! Alguém puxou o pêndulo: o relógio do museu deu um salto de ' + (j.alarmeSeg || 40) + ' s.'); if (typeof renderClues === 'function') renderClues(); } });
}
setTimeout(lcOuvirAlarmes, 1500); setInterval(lcOuvirAlarmes, 4000);
function lcArmadilha(p){
 const seg = (p.armadilha && p.armadilha.seg) || 40, id = 'arm' + state.loop + ':' + p.id;
 lcAcelerar(id, seg); lcOuvirAlarmes();
 try { window.DragonSala?.atualizarEu({alarmeVolta:state.loop, alarmeSeg:seg, alarmeId:id}); } catch (e) {}
 toast('ALARME! Você puxou a corda: o relógio de TODO mundo deu um salto de ' + seg + ' s.');
}
const lcNomeSala = id => sala(id)?.name || id;
const TIPO_LC = {comum:'Registro', clima:'Observação', coop:'Relato', falsa_honesta:'Observação', objeto:'Observação'};
function lcPodeVer(p){
 const q = p.quemPodeVer || 'todos';
 if (q.startsWith('portador_grupo_')) return q.slice(15).split('|').some(lcTemGrupo);
 if (q.startsWith('portador_')) return lcTem(q.slice(9));
 return true;
}
function lcChaoOk(p){
 const c = p.condicao && p.condicao.chao; if (!c) return true;
 const o = lcS().chao[c.sala]; return !!o && o.objeto === c.objeto && o.volta < state.loop;
}
function lcTexto(p){
 let t = p.texto;
 if (p.textoPorSintoma) {   // a resposta fica em até 60 palavras: só o sinal mais recente do caderno, ou o trecho do par quando os dois lados já estão anotados
  const gs = Object.keys(p.textoPorSintoma).filter(lcTemGrupo), pp = p.textoPorPar, parOk = !!pp && pp.grupos.every(lado => lado.some(lcTemGrupo));
  const ult = [...(state.clues || [])].reverse().map(c => LC_PID[String(c.id).slice(3)]?.grupoFonte).find(g => gs.includes(g));
  t = [t, parOk ? pp.texto : p.textoPorSintoma[ult]].filter(Boolean).join(' ');
 }
 if (p.textoPorCausa && p.textoPorCausa[lcCausa()]) t += ' ' + p.textoPorCausa[lcCausa()];
 return lcTok(t);
}
// A lista de cada sala segue a primeira vez que cada rótulo aparece nos dados: a ordem é a mesma nas 5 causas (ordem diferente denunciava o defeito).
const LC_ORD = {}; LC.pistas.forEach((p, i) => { const k = p.sala + '|' + p.previa; if (!(k in LC_ORD)) LC_ORD[k] = i; });
const lcOrd = p => LC_ORD[p.sala + '|' + p.previa];
function pistasCentral(base){
 for (const p of [...LC.pistas].sort((a, b) => lcOrd(a) - lcOrd(b))) {
  if (!lcAtiva(p) || (p.daAtividade && !(p.condicao && p.condicao.chao))) continue;
  (base[p.sala] ||= []).push({id:lcId(p.id), name:lcTok(p.previa || 'Examinar'), text:lcTexto(p), time:lcT(p), desde:p.volta_min, vmax:p.volta_max,
   tipo:p.tipoTela || TIPO_LC[p.tipo] || 'Registro', custo0:(p.custo === 0), custo:p.custo, lcp:p.id, etq:p.etiqueta || '',
   enigma:p.enigma && Object.fromEntries(Object.entries(p.enigma).map(([k, v]) => [k, lcTok(v)]))});
 }
 return base;
}
function lcVisivel(q){ const p = LC_PID[q.lcp]; return !p || (lcPodeVer(p) && lcChaoOk(p)); }
// salas das pistas pedidas que existem na noite, sempre na mesma ordem (a frase da tranca é igual nas 5 causas)
const lcSalasDe = ids => { const s = [...new Set(ids.filter(i => lcAtiva(LC_PID[i])).map(i => LC_PID[i].sala))].sort((a, b) => LC.salas.indexOf(a) - LC.salas.indexOf(b)).map(lcNomeSala); return s.length > 3 ? s.slice(0, 3).concat('outras salas') : s; };   // no máximo 3 nomes: a dica aponta, não lista o museu
function lcBloqueio(q){
 const p = LC_PID[q.lcp]; if (!p) return '';
 if (p.excl && lcTem(p.excl) && !/individual/.test(location.pathname)) return 'Você já viu a outra metade desta pista. Peça à outra pessoa que veja esta e descreva em voz alta.';
 const pd = p.precisaDe || {}, falta = (pd.todas || []).find(i => !lcTem(i));
 if (falta && p.porque) return p.porque + ' (em ' + lcNomeSala(LC_PID[falta].sala) + ')';
 if (falta) return 'Falta achar algo antes, em ' + lcNomeSala(LC_PID[falta].sala) + '.';
 if ((pd.umaDe || []).length && !pd.umaDe.some(lcTem) && p.porque) return p.porque + ' (veja em ' + lcSalasDe(pd.umaDe).join(' ou ') + ')';
 if ((pd.umaDe || []).length && !pd.umaDe.some(lcTem)) return 'Falta achar algo antes, em ' + lcSalasDe(pd.umaDe).join(' ou ') + '.';
 return '';
}
function lcTextoClue(q){ const p = LC_PID[q.lcp]; return p ? lcTexto(p) : q.text; }
function lcAposColetar(q){
 lcMissaoChecar();
 const p = LC_PID[q.lcp]; if (!p) return;
 if (p.tipo === 'objeto' && p.objeto) lcS().mao = {obj:p.objeto, volta:state.loop};
 if (p.armadilha) lcArmadilha(p);
}
function lcDarPista(pid, tipo){
 const p = LC_PID[pid]; if (!p || lcTem(pid)) return false;
 state.clues.push({id:lcId(pid), room:lcNomeSala(p.sala), name:lcTok(p.previa || pid), text:lcTexto(p), tipo:tipo || 'Relato', loop:state.loop, etq:p.etiqueta || ''});
 { const nb = typeof document !== 'undefined' && document.getElementById('lcBarN'); if (nb) nb.textContent = state.clues.length; }
 return true;
}
const lcCargas = () => cargasRestantes();
function lcGastar(n){ if (lcCargas() < n) { toast('Falta energia: precisa de ' + n + '.'); return false; } state.cargas = cargasRestantes() - n; return true; }
// ---- diagnóstico (anexar): 2 sinais de tipos diferentes + 1 que descarta outra causa
function lcValidaAnexo(causa, ids){
 const lados = (LC.diagnostico_por_causa[causa] || {}).lados, sinais = {}, desc = [], linhas = []; let completo = false;
 for (const i of ids) {
  const x = LC_PID[i], g = x.grupoFonte, ap = x.revela.aponta.includes(causa), rot = '"' + (x.previa || i) + '"', de = x.revela.descarta.filter(c => LC_CAUSAS.includes(c) && c !== causa);
  if (x.diagnosticoCompleto && ap) { completo = true; linhas.push(rot + ': leitura completa. Vale sozinha.'); }
  else if (x.diagnosticoCompleto) linhas.push(rot + ': leitura completa, mas de outro defeito.');
  else if (x.tipo === 'falsa_honesta') linhas.push(rot + ': tem explicação inocente. Não conta.');
  else if (ap && g && sinais[g]) linhas.push(rot + ': sinal repetido.');
  else if (ap && g) { sinais[g] = i; linhas.push(rot + ': contou, sinal.'); }
  else if (de.length) { desc.push(i); linhas.push(rot + ': contou, leitura normal.'); }
  else if ((g || '').startsWith('sint_')) linhas.push(rot + ': sinal de outro defeito.');
  else if ((g || '').startsWith('desc_')) linhas.push(rot + ': leitura que não ajuda aqui.');
  else linhas.push(rot + ': não é sinal nem leitura.');
 }
 if (completo) return {ok:true, msg:'', linhas};
 let ns = Math.min(Object.keys(sinais).length, 2); const nd = Math.min(desc.length, 1);
 if (lados) ns = lados.filter(l => l.some(g => sinais[g])).length;
 const placar = ns + ' de 2 sinais e ' + nd + ' de 1 leitura normal.';
 if (ns < 2) return {ok:false, msg:'Você tem ' + ns + (ns === 1 ? ' sinal' : ' sinais') + '; precisa de 2 diferentes.' + (nd ? '' : ' Falta também 1 leitura normal.'), linhas};
 if (!nd) return {ok:false, msg:'Os 2 sinais contaram. Falta 1 leitura normal.', linhas};
 return {ok:true, msg:placar, linhas};
}
function lcAnexar(causa, ids){
 const s = lcS();
 if (s.diag) return 'O dossiê já tem diagnóstico.';
 if (state.loop < 2) return 'A página de diagnóstico abre na volta 2. Por enquanto, olhe e anote.';
 if (s.anexos[state.loop]) return 'Uma tentativa por volta. Tente de novo na próxima.';
 const completa = ids.some(i => LC_PID[i] && LC_PID[i].diagnosticoCompleto);   // a leitura completa do painel vale sozinha (pode ir sem as outras duas)
 if (ids.length !== 3 && !(completa && ids.length >= 1 && ids.length <= 3)) return 'Escolha exatamente 3 pistas do seu caderno. (Não gastou a tentativa.)';
 const v = lcValidaAnexo(causa, ids);
 s.anexos[state.loop] = causa;
 if (!v.ok) { save(); return 'Ainda não.' + (completa ? '' : ' ' + v.msg) + '\n' + v.linhas.join('\n') + '\nNova tentativa na próxima volta.'; }
 if (lcCausa() === 'E_dois' && (causa === 'A_calibrar' || causa === 'B_potencia')) { save(); return 'MEIO CERTO: as provas combinam, mas a máquina só dá um tranco e o aviso muda de lugar. Mudou, não sumiu. A tentativa desta volta foi gasta.'; }
 if (causa !== lcCausa()) { save(); return 'As provas até combinam, mas A MÁQUINA NÃO REAGE: o defeito escolhido não é esse. Releia os sinais do caderno antes da próxima tentativa. (A tentativa desta volta foi gasta.)'; }
 s.diag = {volta:state.loop}; save();
 return 'DIAGNÓSTICO ANEXADO.' + (v.msg ? ' ' + v.msg : '') + (state.room === 'prototipo' ? ' No interfone, a Dra. Sato quase sussurra: "Quem fez isso? Ela... ela escutou você." ' : ' Lá embaixo, a Câmara dá um estalo, como quem escuta. ') +
  (v.msg ? 'Você não chutou: dois sinais diferentes apontando para o mesmo lado e uma leitura dizendo "aqui não é".' : 'Você não chutou: a leitura completa do painel mostrou o defeito e você soube dar nome a ele.') + ' O conserto da máquina pode acender.';
}
function lcFaltas(A){
 const e = A.entrada, f = [];
 if ((e.estado || []).includes('diagnostico_anexado') && !lcS().diag) f.push('o diagnóstico anexado (aba Dossiê)');
 for (const g of e.grupos || []) if (!lcTemGrupo(g)) f.push(LC.grupos_fonte[g].rotulo);
 for (const i of e.pistas || []) if (!lcTem(i)) f.push('"' + (LC_PID[i].previa || i) + '"');
 return f;
}
const lcAcesa = A => lcAtiva(A) && state.loop >= lcVmin(A) && !lcFaltas(A).length;
// ---- palavra da dupla (gira a cada 30 s: as duas pessoas precisam estar jogando ao mesmo tempo)
const LC_PAL = ['LUZ','RAIO','MOLA','VIDRO','SINO','FARO','PONTE','CHAVE','NUVEM','PRATA','BRASA','TRILHO','LACRE','ONDA','FERRO','TINTA'];
const lcPal = (aid, papel, slot) => LC_PAL[Math.floor(hashTxt('pal' + aid + papel + state.loop + ':' + slot + ':' + semente()) * LC_PAL.length)];
const lcSlot = () => Math.floor(lcSeg() / 30);
function lcPalOk(aid, papelOutro, txt){
 const t = normResp(txt); if (!t) return false;
 return [lcSlot(), lcSlot() - 1].some(sl => normResp(lcPal(aid, papelOutro, sl)) === t);
}
function lcProduzir(A, tipo){
 const novas = [];
 for (const pid of A.produz || []) { const p = LC_PID[pid]; if (p && lcAtiva(p) && lcDarPista(pid, tipo || 'Relato')) novas.push(p); }
 return novas;
}
const LC_ENSAIO = {
 A_calibrar:'O que ainda pode falhar: os 3 valores (dia, hora, registro) precisam estar certos no seu caderno na hora de valer.',
 B_potencia:'O que ainda pode falhar: a força só entra na hora do raio ({j0} a {j1} da volta). Chegue à alavanca antes da hora.',
 C_ancora:'O que ainda pode falhar: a peça verdadeira precisa estar no apoio, e sem dupla, ela só chega se for deixada no chão numa volta anterior.',
 D_fusivel:'O que ainda pode falhar: a ordem dos 3 pontos. Na volta 5 não dá para trocar a ordem depois de confirmar.',
 E_dois:'O que ainda pode falhar: um dos defeitos reagiu e o outro não. São dois consertos, um por volta.'
};
const lcAvisoEnsaio = () => LC_ENSAIO[lcCausa()] || '';
function lcFimAtividade(A, modo){
 const s = lcS(); s.feitas[A.id] = (s.feitas[A.id] || 0) + 1;
 if (A.conserto) {
  if (lcMeioPendente(A)) { const mesma = Object.entries(s.meio).some(([o, v]) => o !== A.id && v === state.loop); s.meio[A.id] = state.loop; if (A.produto_meio) lcDarPista(A.produto_meio);
   return 'MEIO CONSERTO (' + modo + ') gravado na Câmara. ' + (mesma ? 'Você mexeu nos dois defeitos na mesma volta: a Câmara só fecha em outra. Repita um deles numa volta seguinte.' : 'O aviso mudou de lugar, mas não sumiu: falta o OUTRO defeito, em OUTRA volta.'); }
  if (state.loop <= 4) { s.ensaio.push(A.id); if (A.produto_ensaio) lcDarPista(A.produto_ensaio); return 'ENSAIO (' + modo + '): A MÁQUINA REAGE. Não valeu ainda: repita na volta 5. ' + lcAvisoEnsaio() + ''; }
  s.conserto = 5; if (A.produto_final) lcDarPista(A.produto_final); return 'CONSERTO FEITO (' + modo + '). A máquina está inteira. Agora o botão "Loop Reset" responde.';
 }
 const n = lcProduzir(A);
 return 'ATIVIDADE FEITA: ' + A.nome + '.' + (n.length ? ' Novas pistas no caderno: ' + n.map(p => p.previa).join(', ') + '.' : '') + (A.entrega_diagnostico && !s.diag ? ' A leitura completa vale sozinha no Dossiê. Quem escolhe o defeito é você.' : '');
}
function lcFinal(){
 const s = lcS(), certa = !!s.diag, des = certa && s.conserto === 5, rev = !!(s.revelado && s.revelado.ok);
 const provas = ['prova_falsa','trajeto','cracha'].filter(lcTemGrupo);
 if (des && rev) return 'Ouro'; if (des) return 'Desligar'; if (rev) return 'Revelar';
 if (certa || provas.length >= 2) return 'Parcial'; return 'Mínimo';
}
// Frases do final que dependem do caderno (regras.final_frases): a sirene só toca para quem contou do Téo pelo interfone; o Téo só aparece para quem viu o Téo.
const lcFinalFrases = t => ((LC.regras.final_frases || {}).frases || []).reduce((x, fr) => fr.precisaUmaDe.some(lcTem) ? x : x.split(fr.frase).join(''), t);
const lcFinalTxt = n => { const f = LC.finais.find(x => x.nome.toLowerCase() === n.toLowerCase() || x.nome === n.replace('í', 'i')) || {}; return lcFinalFrases((f.texto_por_causa && f.texto_por_causa[lcCausa()]) || f.texto || ''); };
window.lcFinalFontes = () => ({sato:lcTem('sato_teo'), teo:lcTem('teo_1')});   // vai junto do desfecho para o telão e para o resultado da sala
const LC_PV_IC = {prova_falsa:'img:V11', trajeto:'img:S01', cracha:'img:L08'};
// três fichas do desfecho (as mesmas do telão): defeito, máquina, noite. Miniatura grande e selo: verde-água quando feito, "ficou aberto" quando não.
function lcFichasFinal() {
 const s = lcS(), F = (ic, t, ok, sim, nao) => '<div class="lc-fim ' + (ok ? 'ok' : 'aberto') + '">' + lcFicha(ic, 'g') + '<b>' + t + '</b><i>' + (ok ? sim : nao) + '</i></div>';
 return '<div class="lc-fins">' + F(LC_ICONE[lcCausa()] && s.diag ? LC_ICONE[lcCausa()] : 'img:ui/alvo', 'Achar o defeito', !!s.diag, '✓ feito', 'ficou aberto') +
  F('img:T01', 'Consertar a Máquina', s.conserto === 5, '✓ feito', Object.keys(s.meio).length ? 'pela metade' : 'ficou travada') +
  F('img:P01', 'Revelar a noite', !!(s.revelado && s.revelado.ok), '✓ feito', s.revelado ? 'o nome não fechou' : 'ficou aberta') + '</div>';
}
function lcResumoFinal() {
 const s = lcS(), final = lcFinal();
 const provas = '<div class="lc-fim-provas">' + ['prova_falsa','trajeto','cracha'].map(g => '<span class="' + (lcTemGrupo(g) ? 'ok' : 'falta') + '">' + lcFicha(LC_PV_IC[g], 'sm').replace(' loading="lazy"', '') + esc(LC.grupos_fonte[g].rotulo.charAt(0).toUpperCase() + LC.grupos_fonte[g].rotulo.slice(1)) + '</span>').join('') + '</div>';
 return '<div class="result-card loop-ending"><p class="kicker">DESFECHO DA MÁQUINA</p><h3>' + esc(LOOP_FINAL_NOME[final] || final) + '</h3>' + lcFichasFinal() + '<p>' +
  esc(lcFinalTxt(final) || loopFinalTexto(final, [{loopSato:lcTem('sato_teo'), loopTeo:lcTem('teo_1')}])) + '</p><p class="kicker">AS 3 PROVAS NO SEU CADERNO</p>' + provas + '</div>';
}

function lcPodeEncaminharPeca() {
 const s = lcS();
 return state.phase === 'playing' && state.room === LC_PID.c_peca.sala && lcSeg() < 300 &&
  s.mao?.volta === state.loop && s.mao.obj === LC_AT.coop_ancora.solo.objeto && !s.chaoUsado && state.loop < 5;
}
function lcEncaminharPeca() {
 if (!lcPodeEncaminharPeca() || !lcGastar(1)) return;
 const abrigo = LC_AT.coop_ancora.solo.sala, s = lcS();
 s.chao[abrigo] = {objeto:s.mao.obj, volta:state.loop};
 s.chaoUsado = true;
 s.mao = null;
 save();
 renderClues();
 toast('Você desceu com a peça e deixou ao lado do apoio. Na próxima volta ela está lá.');
}
function lcRenderEncaminhamento(panel) {
 const abrigo = LC_AT.coop_ancora.solo.sala, s = lcS();
 const guardada = s.chao[abrigo]?.objeto === LC_AT.coop_ancora.solo.objeto;
 const pode = lcPodeEncaminharPeca();
 let box = panel.querySelector('.lc-encaminhamento');
 if (!pode && !(guardada && (state.room === abrigo || state.room === LC_PID.c_peca.sala))) {
  box?.remove();
  return;
 }
 const texto = pode ? 'Desça com a peça verdadeira e deixe ao lado do apoio, no Subsolo. O chão guarda.'
  : 'A peça verdadeira está no chão do Subsolo, ao lado do apoio, desde a volta ' + s.chao[abrigo].volta + '.';
 const conteudo = '<p>' + esc(texto) + '</p>' + (pode
  ? '<button type="button" class="btn secondary" data-encaminhar-peca>Descer com a peça e deixar no chão · 1 de energia</button>' : '');
 if (!box) {
  box = document.createElement('div');
  box.className = 'lc-encaminhamento note';
  panel.querySelector('.lista-pistas').before(box);
 }
 if (box.dataset.render === conteudo) return;
 box.dataset.render = conteudo;
 box.innerHTML = conteudo;
 const botao = box.querySelector('[data-encaminhar-peca]');
 if (botao) botao.onclick = lcEncaminharPeca;
}
function lcReservaDaSala() {
 if (state.caseRules !== 2 || state.loop !== 5 || !lcS().diag || lcS().conserto === 5) return '';
 const atividade = lcAlvos().map(id => LC_AT[id]).find(a => a.salas.includes(state.room) && !lcFaltas(a).length);
 if (!atividade) return '';
 const solo = atividade.solo, custoSolo = solo?.sala === state.room ? solo.custo
  : solo?.sala_executar === state.room ? solo.custo_executar : null;
 return 'Reserve ' + (atividade.custo_por_pessoa || 1) + ' de energia se for operar em dupla' +
  (custoSolo ? ' ou ' + custoSolo + ' sem dupla' : '') + '.';
}
// ---- tela da Máquina
function lcPainelHtml(aba){
 const s = lcS(), causa = lcCausa();
 const abas = [['dossie','Dossiê'],['atividades','Atividades'],['revelar','Revelar'],['trocar','Passar pista']];
 const passo = (ic, txt) => '<div class="lc-passo">' + lcFicha(ic, 'sm') + '<span>' + txt + '</span></div>';
 let h = '<div class="lc-abas">' + abas.map(([k, n]) => '<button type="button" class="lc-aba' + (k === aba ? ' on' : '') + '" data-lcaba="' + k + '">' + n + '</button>').join('') + '</div>';
 h += '<div class="lc-estado" role="status"><span><b>Volta</b>' + state.loop + ' de 5</span><span' + (s.diag ? ' class="ok"' : '') + '><b>Defeito</b>' + (s.diag ? 'achado' : 'você ainda não sabe') + '</span><span' + (s.conserto === 5 ? ' class="ok"' : '') + '><b>Máquina</b>' + (s.conserto === 5 ? 'consertada' : s.ensaio.length ? 'ensaiada' : 'travada') + '</span><span><b>Energia</b>' + '<em class="lc-en-n">' + lcCargas() + '<img class="lc-en-ic" src="' + lcIc('ui/energia') + '" alt=""></em></span></div>';
 const meus = (state.clues || []).filter(c => c.id.startsWith('lc-'));
 if (aba === 'dossie') {
  h += lcMissaoHtml();
  h += '<h4>Por que a máquina travou?</h4><div class="lc-passos">' + passo('img:ui/sinal', '2 sinais de tipos diferentes') + passo('img:ui/leitura-normal', '1 leitura normal') + passo('img:ui/alvo', '1 defeito') + '</div>' + lcGlos('<p class="lc-dica">Marque 3 pistas do seu caderno e escolha o defeito. Uma tentativa por volta, da volta 2 em diante.</p><details class="lc-dic"><summary>Como funciona</summary><p>Um <b>sinal</b> mostra o que está errado na máquina. Dois sinais com a mesma etiqueta valem um só. Uma <b>leitura normal</b> mostra uma parte que está bem: ela afasta outro defeito. Manual, ferramenta e coisa estranha com explicação inocente não contam. A leitura completa do painel vale sozinha. Para outra pessoa usar uma pista sua, passe na pausa.</p></details><details class="lc-dic"><summary>Dicionário das palavras</summary>' + LC_GLOS_LISTA.map(([n, t]) => '<p><b>' + n + '</b>: ' + esc(t) + '</p>').join('') + '</details>') + '';
  if (s.diag) h += '<p class="lc-ok">O dossiê já aceitou o diagnóstico. Vá para Atividades.</p>';
  else {
   h += '<div class="lc-causas">' + LC_CAUSAS.map(c => '<label class="lc-causa"><input type="radio" name="lccausa" value="' + c + '">' + lcFicha(LC_ICONE[c]) + '<span>' + LC_NOME[c] + '</span></label>').join('') + '</div>';
   h += '<div class="lc-provas">' + (meus.length ? meus.map(c => '<label class="lc-prova ' + lcEtqClasse(c.etq) + '"><input type="checkbox" name="lcprova" value="' + c.id.slice(3) + '"><span class="tx"><b>' + esc(c.name) + '</b><small>' + esc(c.room) + '</small></span>' + (c.etq ? '<span class="chip">' + lcEtqIcone(c.etq) + ' ' + esc(c.etq.split(' · ')[1] || c.etq) + '</span>' : '') + '</label>').join('') : '<p class="muted">Você ainda não tem pistas da máquina no caderno.</p>') + '</div>';
   h += '<p class="lc-pre" id="lcPre">Marque 3 pistas: 2 sinais de tipos diferentes e 1 leitura normal.</p><button type="button" class="lc-btn" id="lcAnexar">Anexar ao dossiê</button>';
  }
  h += '<p class="lc-msg" id="lcMsg" role="status"></p>';
 } else if (aba === 'atividades') {
  h += '<div class="lc-passos">' + passo('img:ui/dupla', 'Em dupla: cada pessoa numa sala, falando') + passo('img:ui/energia', '1 de energia para quem faz') + passo('img:M03', 'Um conserto por volta') + '</div><details class="lc-dic"><summary>Sem dupla?</summary><p>Vale o caminho sem dupla, que gasta mais energia. Alguns consertos pedem duas voltas: numa você deixa a peça no chão ou grava o gesto, na seguinte você termina. Comece cedo. Na noite de dois defeitos, é um conserto por volta.</p></details>';
  if (!s.diag) h += '<section class="lc-ativ"><h4><i class="lc-luz" aria-hidden="true"></i>Conserto da máquina</h4><p class="lc-dica">A máquina ainda não sabe o que você quer dela.</p><p class="muted">Aparece depois que você achar o defeito, na aba Dossiê.</p></section>';
  for (const A of LC.atividades_coop) {
   if (!lcAtiva(A)) continue;
   if (A.conserto && !s.diag) continue;   // o conserto da noite não aparece antes do diagnóstico (seria o defeito de graça)
   const f = lcFaltas(A), cedo = state.loop < lcVmin(A), aberta = !f.length && !cedo;
   const noLugar = A.salas.includes(state.room), abertoCartao = lcCartao[A.id] != null ? lcCartao[A.id] : (aberta && noLugar);
   h += '<details class="lc-ativ' + (aberta ? ' on' : '') + '" data-lcativ="' + A.id + '"' + (abertoCartao ? ' open' : '') + '><summary><h4><i class="lc-luz" aria-hidden="true"></i>' + esc(A.nome) + '</h4><div class="lc-salas">' + A.salas.map(id => '<span>' + lcFichaSala(id) + '<small>' + esc(LC_CURTO[id] || lcNomeSala(id)) + '</small></span>').join('<i class="lc-seta" aria-hidden="true">⇄</i>') + '</div></summary>';
   if (!aberta) { const pr = [LC_PID[state.loop >= 5 ? A.produto_final : A.produto_ensaio], ...(A.produz || []).map(i => LC_PID[i])].find(p => p && lcAtiva(p) && p.porque);   // a frase do mundo que explica por que ainda não dá
    h += (pr ? '<p class="lc-dica">' + esc(pr.porque) + '</p>' : '') + '<p class="muted">' + (cedo ? 'Abre na volta ' + lcVmin(A) + '.' : 'Falta: ' + f.map(esc).join(' · ') + '.') + '</p>'; }
   else h += lcAtivHtml(A);
   h += '</details>';
  }
  h += '<p class="lc-msg" id="lcMsg" role="status"></p>';
 } else if (aba === 'revelar') {
  h += '<h4>Revelar o que aconteceu</h4><div class="lc-passos">' + passo('img:P01', 'Na Recepção, na última volta') + passo('img:ui/caderno', '3 provas no seu caderno') + passo('img:ui/uma-tentativa', 'Uma tentativa na noite inteira') + '</div><p class="lc-dica">Até a última volta, junte as 3 provas. Falta uma? Ache nas salas, peça a alguém na pausa ou deixe essa pessoa apresentar.</p>';
  const PV_IC = LC_PV_IC;
  const pv = ['prova_falsa','trajeto','cracha'];
  h += '<ul class="lc-lista lc-p3">' + pv.map(g => { const tem = lcTemGrupo(g); return '<li class="' + (tem ? 'ok' : 'falta') + '">' + lcFicha(PV_IC[g]) + '<div><b>' + esc(LC.grupos_fonte[g].rotulo) + '</b><small>' + (tem ? 'Está no seu caderno.' : LC_ONDE[g]) + '</small></div><i class="lc-selo">' + (tem ? '✓ tem' : 'falta') + '</i></li>'; }).join('') + '</ul>';
  h += s.revelado ? '<p class="lc-ok">' + (s.revelado.ok ? 'Três provas, três perguntas respondidas: o que foi feito, por onde passou, de quem era a mão. O nome fechou.' : 'Você já usou a tentativa: o nome não fechou.') + '</p>' : state.loop !== 5 ? '<p class="muted">O telão da Recepção só aceita o Revelar na última volta.</p>'
   : '<input id="lcNome" placeholder="Diga o nome" autocomplete="off"><button type="button" class="lc-btn" id="lcRevelar">Registrar revelação</button>';
  h += '<p class="lc-ok">Se a noite acabasse agora: <b>' + (LOOP_FINAL_NOME[lcFinal()] || lcFinal()) + '</b>.</p><p class="lc-msg" id="lcMsg" role="status"></p>';
 } else {
  h += '<div class="lc-passos">' + passo('img:ui/caderno', 'Quem passa mostra o código') + passo('img:ui/participar', 'Quem recebe digita') + passo('img:ui/dupla', 'Conte com as suas palavras') + '</div><p class="lc-dica">Só na pausa entre as voltas. Não gasta energia. Até 3 pistas por pausa.</p>';
  if (state.phase === 'playing') h += '<p class="muted">Espere a pausa entre as voltas.</p>';
  else {
   h += '<h4>Passar uma pista</h4><select id="lcPassar">' + meus.map(c => '<option value="' + c.id.slice(3) + '">' + esc(c.name) + '</option>').join('') + '</select><button type="button" class="lc-btn" id="lcCod">Gerar código</button><p class="lc-cod" id="lcCodTxt"></p>';
   h += '<h4>Receber uma pista</h4><input id="lcCodIn" placeholder="Código de 4 letras" maxlength="4" autocomplete="off"><button type="button" class="lc-btn" id="lcReceber">Receber</button>';
  }
  h += '<p class="lc-msg" id="lcMsg" role="status"></p>';
 }
 return h;
}
const LC_CURTO = {prototipo:'Subsolo', atelie:'Ateliê', galeria:'Galeria', fotografia:'Fotografia', recepcao:'Recepção', seguranca:'Central', patio:'Pátio', corredor:'Área de descanso', manutencao:'Oficina técnica', limpeza:'Base da limpeza', eletrica:'Oficina elétrica', deposito:'Coleções', conservacao:'Conservação', sons:'Sons', relogios:'Relógios'};
const LC_IR = {prototipo:'ao Subsolo', atelie:'ao Ateliê', galeria:'à Galeria', fotografia:'à Sala da fotografia', recepcao:'à Recepção', seguranca:'à Central', patio:'ao Pátio', corredor:'à Área de descanso', manutencao:'à Oficina técnica', limpeza:'à Base da limpeza', eletrica:'à Oficina elétrica', deposito:'à Sala das coleções'};
const lcCartao = {};   // cartões de atividade que a pessoa abriu ou fechou (a tela redesenha a cada 2 s)
const LC_OBJ = {luva_isolante:'a luva isolante', luva:'a luva de borracha', peca_verdadeira:'a peça verdadeira'};
const LC_ATE = {patio:'o Pátio', prototipo:'o Subsolo'};
function lcAtivHtml(A){
 const room = state.room, s = lcS(), papel = room === A.salas[0] ? 'A' : room === A.salas[1] ? 'B' : null;
 let h = '';
 if (A.acao_de_chao) {
  const ac = A.acao_de_chao, mao = s.mao && s.mao.volta === state.loop ? s.mao.obj : null;
  h += '<p>' + esc(A.papelA) + '</p><p>' + esc(A.papelB) + '</p>';
  if (mao === ac.objeto && room === ac.sala_destino && !s.chaoUsado) h += '<button type="button" class="lc-btn" data-lcagir="deixar:' + A.id + '">Deixar ' + esc(LC_OBJ[mao] || 'um objeto') + ' no chão aqui</button>';
  else if (mao === ac.objeto && !s.chaoUsado) h += '<p class="muted">Você está com ' + esc(LC_OBJ[mao] || 'um objeto') + '. Leve até ' + esc(LC_ATE[ac.sala_destino] || lcNomeSala(ac.sala_destino)) + '.</p>';
  return h;
 }
 if (!papel) {
  h += '<p class="muted">Vá ' + A.salas.map(id => LC_IR[id] || 'a ' + lcNomeSala(id)).map(esc).join(' ou ') + ' para fazer a sua parte.</p>';
  if (A.papelCentral) h += '<p class="lc-solo"><b>Central:</b> ' + esc(A.papelCentral) + '</p>';
  if (A.saida_solo) h += '<p class="lc-solo"><b>Sem dupla:</b> ' + esc(A.saida_solo) + '</p>';
  return h;
 }
 if (lcMeioPendente(A) && s.meio[A.id]) return h + '<p class="lc-ok">Esta metade já está gravada na Câmara. Falta o OUTRO defeito, em outra volta.</p>';
 h += '<p class="lc-papel"><b>Sua parte:</b> ' + esc(papel === 'A' ? A.papelA : A.papelB) + '</p>';
 if (A.dicaTela && A.dicaTela[papel]) h += '<p class="lc-dica">' + esc(A.dicaTela[papel]) + '</p>';
 if (A.id === 'coop_raio') return h + lcRaioHtml(A, papel);
 const slot = lcSlot(), vals = A.valores_pedidos && room === 'prototipo';
 const tp = A.telaPapel && A.telaPapel[papel];   // o que só esta pessoa vê: a outra precisa ouvir
 const pago = !(A.entrega_diagnostico && papel === 'A') || s.painelVisto === state.loop;   // o painel da noite só aparece depois de pagar a energia de olhar
 if (tp && !pago) h += '<button type="button" class="lc-btn" data-lcagir="verpainel:' + A.id + '">Olhar o painel (1 de energia)</button>';
 if (tp && pago) { const it = Array.isArray(tp.itens) ? tp.itens : (tp.itens[lcCausa()] || []); h += '<div class="lc-ve"><b>' + esc(tp.titulo) + '</b><ul>' + it.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul></div>'; }
 if (A.perguntaB && papel === 'B') h += '<div class="lc-vals">' + A.perguntaB.rotulos.map((r, i) => '<label class="lc-val"><span>' + esc(r) + '</span><select data-lcleg="' + i + '" aria-label="' + esc(r) + '"><option value="">como está?</option>' + A.perguntaB.opcoes[i].map((o, k) => '<option value="' + k + '">' + esc(o) + '</option>').join('') + '</select></label>').join('') + '</div>';
 if (A.segurar === papel) h += '<button type="button" class="lc-btn lc-segurar" id="lcSegurar" data-lcsegpal="' + A.id + ':' + papel + '">Segurar a chave geral</button><p class="lc-cod" id="lcChaveCod"></p>';
 else h += '<p class="lc-pal">Palavra para dizer em voz alta: <b>' + lcPal(A.id, papel, slot) + '</b> <small>(muda a cada 30 s)</small></p>';
 h += '<input data-lcpal="' + A.id + '" placeholder="Palavra que a outra pessoa disse" autocomplete="off">';
 if (vals) {
  h += '<p class="lc-dica">' + esc(A.formato || '') + '</p><div class="lc-vals">' + A.valores_pedidos.map((k, i) => '<label class="lc-val"><span>' + esc(lcFmt(k).rotulo || k) + '</span><input data-lcval="' + i + '" placeholder="ex.: ' + esc(lcFmt(k).exemplo || '') + '" aria-label="' + esc(lcFmt(k).rotulo || k) + '"></label>').join('') + '</div>';
 }
 const semCusto = (A.valores_pedidos && !vals) || (A.entrega_diagnostico && papel === 'A');
 if (!(A.entrega_diagnostico && papel === 'A' && !pago)) h += '<button type="button" class="lc-btn" data-lcagir="dupla:' + A.id + ':' + papel + '">' + (A.valores_pedidos && !vals ? 'Confirmar a minha parte' : semCusto ? 'Fazer em dupla' : 'Fazer em dupla (1 de energia)') + '</button>';
 const S = A.solo, h0 = h; h = '';
 if (S && S.tipo === 'individual' && vals) h += '<div class="lc-solo"><b>Sem dupla</b> (' + S.custo + ' de energia): tudo precisa estar no seu caderno.<button type="button" class="lc-btn" data-lcagir="solo:' + A.id + ':A">Fazer sem dupla</button><button type="button" class="lc-btn lc-sato" data-lcagir="solosato:' + A.id + '">Com a Dra. Sato na linha (' + (S.custo + 1) + ' de energia)</button><small>Você conta de cabeça uma informação que viu e não anotou. Desta vez, ela confia. Objeto não vale: precisa estar com você.</small></div>';
 else if (S && S.tipo === 'chao') {
  const mao = s.mao && s.mao.volta === state.loop ? s.mao.obj : null;
  h += '<div class="lc-solo"><b>Sem dupla</b> (duas voltas): traga a peça e deixe no chão, ao lado do apoio. Na volta seguinte, use-a na Câmara.';
  if (mao === S.objeto && room === S.sala && !s.chaoUsado && state.loop < 5) h += '<button type="button" class="lc-btn" data-lcagir="deixarpeca:' + A.id + '">Deixar a peça no chão aqui</button>';
  if (mao === S.objeto && room === LC_PID.c_peca.sala && !s.chaoUsado && state.loop < 5) h += '<p>Você está com a peça. Volte à tela da sala e toque em “Descer com a peça e deixar no chão”.</p>';
  if (vals) h += '<button type="button" class="lc-btn" data-lcagir="solochao:' + A.id + '">Agir usando a peça do chão (' + S.custo + ' de energia)</button>';
  if (vals) h += '<button type="button" class="lc-btn lc-sato" data-lcagir="solosato:' + A.id + '">Numa volta só, com a Dra. Sato na linha (' + (S.custo + 1) + ' de energia)</button><small>Com a peça verdadeira na mão: ela dita pelo interfone e você prende a trava com o seu cinto.</small>';
  h += '</div>';
 } else if (A.saida_solo) h += '<p class="lc-solo"><b>Sem dupla:</b> ' + esc(A.saida_solo) + '</p>';
 h = h0 + lcSemDupla(A, h);
 if (A.papelCentral) h += '<p class="lc-solo"><b>Central:</b> ' + esc(A.papelCentral) + '</p>';
 return h;
}
// o caminho sem dupla fica recolhido dentro do cartão (menos texto de uma vez); no jogo sem turma ele já vem aberto
function lcSemDupla(A, miolo){
 if (!miolo) return '';
 const k = A.id + ':solo', aberto = lcCartao[k] != null ? lcCartao[k] : !window.coop;
 return '<details class="lc-dic lc-semdupla" data-lcativ="' + k + '"' + (aberto ? ' open' : '') + '><summary>Sem dupla?</summary>' + miolo + '</details>';
}
const lcCodChave = () => String(100 + Math.floor(hashTxt('chave' + state.loop + ':' + Math.floor(lcSeg() / 10) + ':' + semente()) * 900));
function lcRaioHtml(A, papel){
 const S = A.solo, s = lcS();
 let h = '';
 if (papel === 'B') {
  h += '<p>Segure o botão: enquanto estiver segurando, aparece o código da chave. Diga o código à outra pessoa.</p><button type="button" class="lc-btn lc-segurar" id="lcSegurar">Segurar a chave {ch}</button><p class="lc-cod" id="lcChaveCod"></p>';
  h += lcSemDupla(A, '<div class="lc-solo"><b>Sem dupla (eco):</b> aqui no Pátio, dentro da janela do raio (' + lcMM(LC_JANELA[0]) + ' a ' + lcMM(LC_JANELA[1]) + '), grave o gesto (2 de energia, volta 3 em diante).<button type="button" class="lc-btn" data-lcagir="eco:' + A.id + '">Gravar o eco</button></div>' +
   (s.eco ? '<p class="lc-ok">Eco gravado na volta ' + s.eco.volta + '.</p>' : '<p class="lc-dica">' + esc(LC_PID.eco_chave.porque || '') + '</p>'));
 } else {
  h += '<p>Com o código que a outra pessoa disser, baixe a alavanca <b>dentro da janela do raio</b> (' + lcMM(LC_JANELA[0]) + ' a ' + lcMM(LC_JANELA[1]) + '). Cedo ou tarde demais, a máquina não reage.</p><input id="lcCodChaveIn" placeholder="Código de 3 números" inputmode="numeric" maxlength="3" autocomplete="off"><button type="button" class="lc-btn" data-lcagir="raio:' + A.id + '">Baixar a alavanca (1 de energia)</button>';
  h += lcSemDupla(A, '<div class="lc-solo"><b>Sem dupla (eco):</b> numa volta anterior você gravou a chave no Pátio. Agora baixe a alavanca na janela (2 de energia).<button type="button" class="lc-btn" data-lcagir="ecoalavanca:' + A.id + '">Baixar usando o eco</button><button type="button" class="lc-btn lc-sato" data-lcagir="raiosato:' + A.id + '">Sem eco, com a Dra. Sato na linha (' + (A.solo.custo_executar + 1) + ' de energia)</button><small>Antes de descer, você prende a chave {ch} com a luva, do jeito que ela ensina. De fora, ela vê o céu e conta o raio pelo interfone.</small></div>');
 }
 return h;
}
const lcMM = t => Math.floor(t / 60) + ':' + String(t % 60).padStart(2, '0');
let lcUlt = null;   // última mensagem da janela: volta depois de cada redesenho, até a pessoa trocar de aba, fechar a janela ou a volta mudar
function lcMsg(t){ t = lcTok(t); lcUlt = {aba:lcAba, volta:state.loop, t}; const m = document.getElementById('lcMsg'); if (m) m.textContent = t; toast(t.length > 120 ? t.slice(0, 117) + '…' : t); }
function lcAgir(cmd){
 if (typeof andando === 'function' && andando()) return lcMsg('Você ainda está chegando na sala.');
 const [tipo, aid, papel0] = cmd.split(':'), A = LC_AT[aid], s = lcS(), dlg = document.getElementById('lcDialog');
 if (tipo === 'dupla' && LC_MGA[aid] && !(state.resolvidos && state.resolvidos['at:' + aid + ':' + state.loop])) return lcBancadaAtiv(aid, cmd);
 const lerVals = () => [...dlg.querySelectorAll('[data-lcval]')].map(i => i.value);
 if (tipo === 'deixarpeca') {
  const S = A.solo, m = s.mao && s.mao.volta === state.loop ? s.mao : null;
  if (!S || !m || m.obj !== S.objeto) return lcMsg('Você precisa estar com a peça verdadeira na mão.');
  if (state.room !== S.sala) return lcMsg('Leve a peça até ' + lcNomeSala(S.sala) + '.');
  if (s.chaoUsado) return lcMsg('Você já deixou um objeto no chão nesta noite.');
  s.chao[S.sala] = {objeto:m.obj, volta:state.loop}; s.chaoUsado = true; s.mao = null; save();
  return lcMsg('A peça ficou no chão, ao lado do apoio. O chão guarda: na próxima volta ela está aqui.');
 }
 if (tipo === 'deixar') {
  const mao = s.mao && s.mao.volta === state.loop ? s.mao : null, sala = A.acao_de_chao.sala_destino;
  if (!mao || mao.obj !== A.acao_de_chao.objeto || s.chaoUsado) return lcMsg('Você não tem objeto para deixar (ou já usou o seu único objeto de chão).');
  if (state.room !== sala) return lcMsg('Leve até ' + (LC_ATE[sala] || lcNomeSala(sala)) + '.');
  s.chao[sala] = {objeto:mao.obj, volta:state.loop}; s.chaoUsado = true; s.mao = null; save();
  return lcMsg('Você deixou o objeto no chão. O chão guarda: na próxima volta, qualquer pessoa acha aqui.');
 }
 if (state.phase !== 'playing') return lcMsg('Só durante uma volta.');
 if (tipo !== 'eco' && state.loop < lcVmin(A)) return lcMsg('Só a partir da volta ' + lcVmin(A) + '.');
 if (lcMeioPendente(A) && s.meio[A.id]) return lcMsg('Esta metade já está gravada. Falta o outro defeito, em outra volta.');
 if (tipo === 'verpainel') { if (s.painelVisto === state.loop) return; if (!lcGastar(A.custo_por_pessoa || 1)) return; s.painelVisto = state.loop; save(); return lcMsg('O painel acende na sua frente. Descreva em voz alta o que você vê.'); }
 if (tipo === 'dupla') {
  const outro = papel0 === 'A' ? 'B' : 'A', inp = dlg.querySelector('[data-lcpal="' + aid + '"]');
  if (!lcPalOk(aid, outro, inp?.value)) return lcMsg('A palavra não confere. Escute a outra pessoa: ela precisa estar na outra sala agora.');
  if (A.perguntaB && papel0 === 'B') { const m = [...dlg.querySelectorAll('[data-lcleg]')].map(x => x.value), c = A.perguntaB.certo[lcCausa()] || []; if (m.some(v => v === '')) return lcMsg('Marque como está cada parte, do jeito que a outra pessoa descreveu.'); if (m.some((v, i) => Number(v) !== c[i])) return lcMsg('Não bate com o painel. Peça para descrever de novo, uma parte por vez.'); }
  const ladoVals = A.valores_pedidos && state.room === 'prototipo';
  if (A.valores_pedidos && !ladoVals) { return lcMsg('Sua parte está feita. Quem está no Subsolo gira, liga ou digita, e confere os valores com você.'); }
  const jaPagou = A.entrega_diagnostico && papel0 === 'A' && s.painelVisto === state.loop;   // quem já pagou para olhar o painel não paga de novo ao fazer em dupla
  if (A.entrega_diagnostico && papel0 === 'A' && !jaPagou) return lcMsg('Olhe o painel primeiro.');
  if (!jaPagou && !lcGastar(A.custo_por_pessoa || 1)) return;
  if (ladoVals) { const r = lcConfere(A, lerVals()); if (r.certos !== r.tot) { save(); return lcMsg(lcMsgErro(A, r, A.custo_por_pessoa || 1)); } }
  const r = lcFimAtividade(A, 'em dupla'); save(); renderClues?.(); renderJournal?.(); return lcMsg(r);
 }
 if (tipo === 'solosato') {
  const S = A.solo; if (!S) return;
  if (S.tipo === 'individual') {
   const fg = S.no_proprio_caderno.filter(g => !lcTemGrupo(g)), falta = fg.map(g => LC.grupos_fonte[g].rotulo), obj = fg.filter(g => (S.objetos || []).includes(g)).map(g => LC.grupos_fonte[g].rotulo);
   if (obj.length) return lcMsg('Pelo interfone não passa objeto. Falta com você: ' + obj.join(' · ') + '.');
   if (falta.length > 1) return lcMsg('A Dra. Sato confia em UMA informação que você viu e não anotou. Ainda faltam: ' + falta.join(' · ') + '.');
  } else if (!(s.mao && s.mao.volta === state.loop && s.mao.obj === S.objeto)) return lcMsg('Você precisa estar com a peça verdadeira na mão, nesta volta.');
  if (!lcGastar(S.custo + 1)) return;
  const r = lcConfere(A, lerVals());
  if (r.certos !== r.tot) { save(); return lcMsg(lcMsgErro(A, r, S.custo + 1)); }
  const m = lcFimAtividade(A, 'sem dupla, com a Dra. Sato na linha'); save(); return lcMsg((S.tipo === 'individual' ? 'Pelo interfone, a Dra. Sato escuta e demora: "Desta vez eu confio. ' + (A.id === 'coop_circuito' ? 'Liga' : 'Gira') + '." ' : 'A Dra. Sato dita pelo interfone: "Cinto na trava. Puxa. Agora a peça." ') + m);
 }
 if (tipo === 'solo' || tipo === 'solochao') {
  const S = A.solo; if (!S) return;
  if (tipo === 'solochao') {
   const o = s.chao[S.sala]; if (!(o && o.objeto === S.objeto && o.volta < state.loop)) return lcMsg('Sem dupla, a peça precisa ter ficado no chão do Subsolo numa volta anterior. Traga a peça e deixe ao lado do apoio.');
  } else {
   const falta = S.no_proprio_caderno.filter(g => !lcTemGrupo(g)).map(g => LC.grupos_fonte[g].rotulo);
   if (falta.length) return lcMsg('Sem dupla, tudo precisa estar no SEU caderno. Falta: ' + falta.join(' · ') + '.');
  }
  if (!lcGastar(S.custo)) return;
  const r = lcConfere(A, lerVals());
  if (r.certos !== r.tot) { save(); return lcMsg(lcMsgErro(A, r, S.custo)); }
  const m = lcFimAtividade(A, 'sem dupla'); save(); return lcMsg(m);
 }
 const seg = lcSeg(), na = seg >= LC_JANELA[0] && seg <= LC_JANELA[1];
 if (tipo === 'eco') {
  if (state.loop < A.solo.volta_min_gravar) return lcMsg('O eco grava a partir da volta ' + A.solo.volta_min_gravar + '.');
  if (!na) return lcMsg('Fora da janela do raio (' + lcMM(LC_JANELA[0]) + ' a ' + lcMM(LC_JANELA[1]) + '). Agora são ' + lcMM(Math.floor(seg)) + '.');
  if (!lcGastar(A.solo.custo_gravar)) return;
  s.eco = {volta:state.loop}; lcDarPista(A.solo.produto_eco); save(); return lcMsg('ECO GRAVADO. Em outra volta, baixe a alavanca no Subsolo.');
 }
 if (tipo === 'raiosato') {
  if (!na) return lcMsg('Fora da janela do raio. Agora são ' + lcMM(Math.floor(seg)) + '.');
  if (!lcGastar(A.solo.custo_executar + 1)) return;
  const r = lcFimAtividade(A, 'sem dupla, com a Dra. Sato na linha'); save(); return lcMsg('A Dra. Sato conta o raio pelo interfone: "Agora." Você baixa a alavanca. ' + r);
 }
 if (tipo === 'ecoalavanca') {
  if (!s.eco || s.eco.volta >= state.loop) return lcMsg('Falta o eco: numa volta anterior, grave a chave no Pátio.');
  if (!na) return lcMsg('Fora da janela do raio. Agora são ' + lcMM(Math.floor(seg)) + '.');
  if (!lcGastar(A.solo.custo_executar)) return;
  const r = lcFimAtividade(A, 'sem dupla, com o eco'); save(); return lcMsg(r);
 }
 if (tipo === 'raio') {
  const cod = (document.getElementById('lcCodChaveIn')?.value || '').trim();
  if (!na) return lcMsg('Fora da janela do raio (' + lcMM(LC_JANELA[0]) + ' a ' + lcMM(LC_JANELA[1]) + '). Agora são ' + lcMM(Math.floor(seg)) + '.');
  const ok = [0, 1, 2].some(d => { const t = Math.floor(seg / 10) - d; return String(100 + Math.floor(hashTxt('chave' + state.loop + ':' + t + ':' + semente()) * 900)) === cod; });
  if (!ok) return lcMsg('O código da chave não confere. A outra pessoa precisa estar segurando a chave {ch} no Pátio e dizer o número que aparece.');
  if (!lcGastar(A.custo_por_pessoa || 1)) return;
  const r = lcFimAtividade(A, 'em dupla'); save(); return lcMsg(r);
 }
}
const LC_ONDE = {prova_falsa:'olhe a peça da Galeria de perto, com alguma coisa para comparar', trajeto:'veja a câmera da Central, a porta de serviço e o chão da Área de descanso', cracha:'descubra quem usou o crachá que abre a porta de serviço'};
function lcRevelar(){
 const s = lcS(), nome = (document.getElementById('lcNome')?.value || '').trim();
 if (s.revelado) return lcMsg('Você já usou a tentativa.');
 if (state.phase !== 'playing') return lcMsg('O telão da Recepção só aceita o Revelar durante uma volta.');
 if (state.loop !== 5) return lcMsg('O telão da Recepção só aceita o Revelar na última volta.');
 if (state.room !== 'recepcao') return lcMsg('Para Revelar, vá à Recepção.');
 const falta = ['prova_falsa','trajeto','cracha'].filter(g => !lcTemGrupo(g));
 if (falta.length) return lcMsg('Faltam no SEU caderno: ' + falta.map(g => LC.grupos_fonte[g].rotulo).join(' · ') + '. Peça a quem tem, na pausa (aba Passar pista), ou deixe essa pessoa apresentar. Quem apresenta também pode achar a prova nas salas.');
 if (!nome) return lcMsg('Diga o nome.');
 const ok = normResp(LC.culpado.split(' ')[0]) === normResp(nome.split(' ')[0]);
 s.revelado = {ok, nome}; save();
 lcMsg(ok ? 'Três provas, três perguntas respondidas: o que foi feito, por onde passou, de quem era a mão. O nome fecha.' : 'O nome não fecha com as três provas.');
}
const lcCodPista = pid => Array.from({length:4}, (_, i) => 'ABCDEFGHJKLMNPRSTUVXZ'[Math.floor(hashTxt('cp' + pid + i + semente()) * 21)]).join('');
function lcReceber(cod){
 const s = lcS(), c = normResp(cod);
 if ((s.recebeu[state.loop] || 0) >= 3) return lcMsg('Só 3 pistas por pausa.');
 const p = LC.pistas.find(x => lcAtiva(x) && !x.daAtividade && lcCodPista(x.id) === c);
 if (!p) return lcMsg('Código inválido.');
 if (lcTem(p.id)) return lcMsg('Você já tem essa pista.');
 s.recebeu[state.loop] = (s.recebeu[state.loop] || 0) + 1;
 state.clues.push({id:lcId(p.id), room:lcNomeSala(p.sala), name:lcTok(p.previa || p.id), text:lcTexto(p), tipo:'Relato', loop:state.loop, recebida:true, etq:p.etiqueta || ''}); save();
 lcMsg('Recebida: ' + (p.previa || p.id) + '. (Troca de pista não gasta energia.)');
 return true;
}
let lcAba = 'dossie', lcTimer = 0, lcSeguro = false;
function lcAbrir(aba){
 if (aba && aba !== lcAba) lcUlt = null;
 lcAba = aba || lcAba;
 let d = document.getElementById('lcDialog');
 if (!d) {
  d = document.createElement('dialog'); d.id = 'lcDialog'; d.className = 'lc-dialog'; document.body.appendChild(d);
  d.addEventListener('click', e => {
   const t = e.target.closest('button,input'); if (!t) return;
   if (t.dataset.lcaba) { lcAbrir(t.dataset.lcaba); return; }
   if (t.id === 'lcFechar') { d.close(); return; }
   if (t.dataset.lcagir) { lcAgir(t.dataset.lcagir); lcDesenhar(true); return; }
   if (t.id === 'lcAnexar') {
    const causa = d.querySelector('[name=lccausa]:checked')?.value, ids = [...d.querySelectorAll('[name=lcprova]:checked')].map(i => i.value);
    if (!causa) return lcMsg('Escolha o defeito.');
    const m = lcAnexar(causa, ids); lcDesenhar(true); lcMsg(m); return;
   }
   if (t.id === 'lcRevelar') { lcRevelar(); return; }
   if (t.id === 'lcCod') { const id = d.querySelector('#lcPassar')?.value; if (id) { d.querySelector('#lcCodTxt').textContent = 'Código: ' + lcCodPista(id); lcUlt = null; lcReporMsg(d); } return; }
   if (t.id === 'lcReceber') { const ci = d.querySelector('#lcCodIn'); if (lcReceber(ci.value)) ci.value = ''; lcDesenhar(true); return; }
  });
  const hold = (on) => { lcSeguro = on; const c = document.getElementById('lcChaveCod'), b = document.getElementById('lcSegurar'), sp = b && b.dataset.lcsegpal; if (c) c.textContent = !on ? '' : sp ? 'Palavra para dizer em voz alta: ' + lcPal(sp.split(':')[0], sp.split(':')[1], lcSlot()) : 'Código da chave: ' + lcCodChave(); };
  for (const ev of ['pointerdown','pointerup','pointerleave','pointercancel']) d.addEventListener(ev, e => { if (e.target.id === 'lcSegurar') hold(ev === 'pointerdown'); });
  d.addEventListener('close', () => { lcSeguro = false; lcUlt = null; clearInterval(lcTimer); });
  d.addEventListener('toggle', e => { const t = e.target; if (t && t.dataset && t.dataset.lcativ) lcCartao[t.dataset.lcativ] = t.open; }, true);
 }
 lcDesenhar(true);
 if (!d.open) d.showModal();
 clearInterval(lcTimer); lcTimer = setInterval(() => lcDesenhar(false), 2000);
}
// Redesenho da janela (a cada 2 s e depois de cada ação). Não depende de foco: no iPhone, tocar numa caixa de marcar não dá foco a ela.
// 1) se o conteúdo não mudou, não mexe em nada (toque, rolagem, marcas e campos ficam como estão);
// 2) se mudou, na mesma aba, repõe o defeito e as pistas marcadas, o que foi digitado, as explicações abertas, a rolagem e a última mensagem.
const lcChaveCampo = i => (i.closest('[data-lcativ]')?.dataset.lcativ || '') + '|' + (i.id || (i.dataset.lcval != null ? 'v' + i.dataset.lcval : i.dataset.lcleg != null ? 'l' + i.dataset.lcleg : i.dataset.lcpal != null ? 'p' : ''));
function lcReporMsg(d){
 if (lcUlt && (lcUlt.aba !== lcAba || lcUlt.volta !== state.loop)) lcUlt = null;
 const m = d.querySelector('#lcMsg'), t = lcUlt ? lcUlt.t : ''; if (m && m.textContent !== t) m.textContent = t;
}
function lcDesenhar(forcar){
 const d = document.getElementById('lcDialog'); if (!d || !d.open && !forcar) return;
 if (!forcar && lcSeguro) return;
 // não redesenha enquanto a pessoa digita (campo de texto ou lista com o teclado aberto)
 const ae = document.activeElement;
 if (!forcar && ae && d.contains(ae) && /INPUT|SELECT/.test(ae.tagName) && !/radio|checkbox/.test(ae.type || '')) return;
 const html = lcTok(lcPainelHtml(lcAba)), mesma = d._aba === lcAba;
 if (mesma && d._html === html && d.querySelector('#lcMsg')) { lcReporMsg(d); return; }
 const campos = mesma ? [...d.querySelectorAll('input:not([type=radio]):not([type=checkbox]),select')].map(i => [lcChaveCampo(i), i.value]) : [];
 const causa = mesma ? d.querySelector('[name=lccausa]:checked')?.value : null, provas = mesma ? [...d.querySelectorAll('[name=lcprova]:checked')].map(i => i.value) : [];
 const abertos = mesma ? [...d.querySelectorAll('details.lc-dic:not([data-lcativ])')].map(x => x.open) : [], rol = d.scrollTop;
 d.innerHTML = '<button type="button" id="lcFechar" class="lc-x" aria-label="Fechar">✕</button><h3 class="lc-tit">' + lcFicha('img:T01') + 'A Máquina</h3>' + html;
 d._html = html; d._aba = lcAba;
 d.querySelectorAll('input:not([type=radio]):not([type=checkbox]),select').forEach(i => { const g = campos.find(x => x[0] === lcChaveCampo(i)); if (g && g[1] !== '' && (!i.options || [...i.options].some(o => o.value === g[1]))) i.value = g[1]; });
 if (causa) d.querySelectorAll('[name=lccausa]').forEach(r => { if (r.value === causa) r.checked = true; });
 if (provas.length) d.querySelectorAll('[name=lcprova]').forEach(x => { if (provas.includes(x.value)) x.checked = true; });
 if (causa || provas.length) lcPreConf();
 d.querySelectorAll('details.lc-dic:not([data-lcativ])').forEach((x, n) => { if (abertos[n]) x.open = true; });
 if (mesma) d.scrollTop = rol;
 lcReporMsg(d);
}
function lcBotao(){
 if (document.getElementById('lcBarra')) return;
 const n = document.createElement('nav'); n.id = 'lcBarra'; n.className = 'lc-barra'; n.setAttribute('aria-label', 'Atalhos da partida');
 n.innerHTML = '<button type="button" id="lcBtnMapa">' + lcFicha('img:ui/mapa', 'sm') + '<span>Mapa</span></button>' +
  '<button type="button" id="lcBtnMaq" class="pri">' + lcFicha('img:T01', 'sm') + '<span>Máquina</span></button>' +
  '<button type="button" id="lcBtnCad">' + lcFicha('img:ui/caderno', 'sm') + '<span>Caderno <b id="lcBarN">' + ((typeof state !== 'undefined' && state && state.clues || []).length) + '</b></span></button>';
 document.body.appendChild(n);
 n.querySelector('#lcBtnMaq').onclick = () => lcAbrir();
 n.querySelector('#lcBtnCad').onclick = () => { renderJournal(); popup('journalDialog'); };
 n.querySelector('#lcBtnMapa').onclick = () => {
  const g = document.getElementById('roomGrid'), b = document.getElementById('roomMapButton');
  if (state.phase === 'between') { toast('O mapa abre quando a próxima volta começar.'); return; }
  if (b && !b.classList.contains('hidden')) b.click();
  if (g && !g.classList.contains('hidden')) g.scrollIntoView({block:'start', behavior:'instant'});
 };
 lcAtualizarBotao();
}
function lcAtualizarBotao(){
 const barra = document.getElementById('lcBarra');
 const some = typeof state === 'undefined' || !state || !['choose','playing','between'].includes(state.phase);
 if (barra) barra.hidden = some;
 if (document.body) document.body.classList.toggle('com-barra', !!barra && !some);
}
if (typeof document !== 'undefined') { const i = setInterval(() => { if (document.body) { lcBotao(); clearInterval(i); } }, 300); }

// ---- Escrita antiga da máscara (revisão 10): escrita inventada, própria do Loop. Os símbolos são conteúdo de pista (não ícone de interface).
// O sprite (museu/icones/ui/glifos.svg) vai embutido no body: <use> apontando para arquivo externo falha no Safari e em file://.
const LC_GLIFOS = [['ver','ver'],['dizer','dizer'],['rosto','rosto'],['pedra','pedra'],['casa','casa'],['guardar','guardar'],['tempo','tempo'],['ir','ir'],['voltar','voltar'],['dia','dia'],['noite','noite'],['vida','vida']];
const LC_INSC = {copia:['rosto','pedra','ver','noite','guardar-esp','tempo'], verdadeira:['rosto','pedra','ver','noite','guardar','tempo']};
let lcGlifosPedido = false;
function lcGlifosSprite(){
 if (lcGlifosPedido || typeof document === 'undefined' || !document.body) return; lcGlifosPedido = true;
 if (!document.getElementById('bancadaCss')) { const l = document.createElement('link'); l.id = 'bancadaCss'; l.rel = 'stylesheet'; l.href = new URL('bancada.css?v=5', LC_BASE).href; document.head.appendChild(l); }
 fetch(new URL('museu/icones/ui/glifos.svg?v=1', LC_BASE).href).then(r => r.ok ? r.text() : '').then(t => { if (!t || document.getElementById('lcGlifos')) return; const d = document.createElement('div'); d.id = 'lcGlifos'; d.hidden = true; d.setAttribute('aria-hidden', 'true'); d.innerHTML = t; document.body.prepend(d); }).catch(() => { lcGlifosPedido = false; });
}
if (typeof document !== 'undefined') { const i = setInterval(() => { if (document.body) { lcGlifosSprite(); clearInterval(i); } }, 300); }
const lcGl = id => '<svg class="glifo" viewBox="0 0 48 48" aria-hidden="true" focusable="false"><use href="#g-' + id + '"/></svg>';
// bloco desenhado embaixo do texto da pista (o texto continua inteiro: leitor de tela e simulador de texto leem só ele)
function lcGlifosHtml(cid){
 const p = typeof LC_PID !== 'undefined' && LC_PID[String(cid).replace(/^lc-/, '')]; if (!p || !p.glifos) return '';
 lcGlifosSprite();
 if (p.glifos === 'tabua') return '<div class="lc-gl tabua" aria-hidden="true">' + LC_GLIFOS.map(([g, w]) => '<span class="t">' + lcGl(g) + '<small>' + w + '</small></span>').join('') + '</div>';
 const ins = LC_INSC[p.glifos]; if (!ins) return '';
 return '<div class="lc-gl faixa-pedra" aria-hidden="true">' + ins.map(lcGl).join('') + '</div>';
}
if (typeof window !== 'undefined') window.lcGlifosHtml = lcGlifosHtml;

// ---- Bancada de investigação: minigames (vindos da Reserva) que abrem ao coletar certas pistas
const LC_MG = {
 tombo_2:{ativ:'livro', resp:0, img:['N18'], nome:'Ler a foto antiga do catálogo', texto:'A foto antiga mostra a peça escura, fosca. Ela foi tirada de baixo. O que aparece gravado na base?', opcoes:['Um número de três algarismos','O nome de quem doou','O ano em que a peça chegou','A marca de quem restaurou'],
  dicas:['Foto de catálogo serve para identificar a peça.','O que identifica uma peça não muda quando ela troca de sala.']},
 falsa_1:{ativ:'marca', resp:4, nome:'Olhar a peça com luz de lado', texto:'Agora confira: mude o ângulo da luz e veja o que a peça mostra de verdade.',
  antes:{ativ:'livro', resp:0, img:['GAL_B'], nome:'Antes de acender a luz', texto:'A peça principal tem 300 anos. Com a luz de lado, o que uma peça dessa idade mostraria?', opcoes:['Riscos, poeira e desgaste por toda parte','Um brilho liso e igual, sem marca nenhuma','Rachaduras só de um lado, o resto liso'],
   dicas:['Luz de frente esconde. Luz de lado mostra a superfície.','Três séculos de mão, pano e mudança deixam marca.']},
  luz:{achou:'O verniz brilha por igual, de ponta a ponta.', falta:'ainda não apareceu nada', botao:'Anotar o que apareceu', img:'V11'},
  dicas:['Luz de frente esconde. Luz de lado mostra a superfície.','Quase no fim do curso da luz, a superfície aparece inteira.']},
 traj_1:{ativ:'livro', resp:0, img:['S01'], nome:'Olhar a fita da porta de serviço', texto:'A fita mostra a porta de serviço às 4:00. Alguém de paletó encosta um crachá no leitor. No tapete, embaixo da pessoa, aparecem gotas. Pelo que você sabe da noite, ela está entrando ou saindo?', opcoes:['Entrando: vem da rua','Saindo: vai para a rua','Só passando, sem abrir a porta'],
  dicas:['Repare no que pinga no tapete.','Lá fora chove desde o começo da noite.']},
 insc_copia:{ativ:'glifos', resp:0, nome:'Ler a inscrição da máscara', texto:'Confira cada símbolo da máscara com a tábua do livro de registro. Um deles não bate. Qual?', insc:['rosto','pedra','ver','noite','guardar-esp','tempo'], opcoes:['5','4','3','2'],
  dicas:['Ponha a tábua ao lado e confira símbolo por símbolo, da esquerda para a direita.','Não olhe só o desenho: olhe para que lado ele abre.']},
 c_peca:{ativ:'livro', resp:0, img:['D10'], nome:'Abrir a caixa de banners', texto:'Agora você tem motivo. Na estante, caixas etiquetadas; só uma tem o adesivo do patrocínio. O que você sentiu diante da peça da Galeria que faz você abrir esta?', opcoes:['Cheiro de verniz fresco','Cheiro de pó antigo','Cheiro de tinta vermelha','Cheiro de cola'],
  dicas:['A primeira coisa que se nota diante da peça principal está no seu caderno.','Peça de 300 anos não cheira a coisa nova.']}
};
// A ordem das opções (e a posição certa da luz) muda com a semente: nada para decorar entre partidas.
function lcMgSorteado(id, mg){
 const g0 = rngMuseu(Math.floor(hashTxt('mg' + id + ':' + state.caseIndex + ':' + semente()) * 4294967295) >>> 0)();   // mistura a mais: sementes vizinhas não caem na mesma posição
 if (mg.luz) { const certo = 2 + Math.floor(g0 * 4); return Object.assign({}, mg, {resp:certo, luz:Object.assign({}, mg.luz, {certo}), dicas:['Luz de frente esconde. Luz de lado mostra a superfície.','Vá devagar, uma posição por vez: numa delas a superfície aparece inteira.']}); }
 if (!Array.isArray(mg.opcoes) || typeof mg.resp !== 'number') return mg;
 const n = mg.opcoes.length, g = Math.floor(g0 * n);
 return Object.assign({}, mg, {opcoes:mg.opcoes.slice(g).concat(mg.opcoes.slice(0, g)), resp:(mg.resp - g + n) % n});
}
const lcMgFoto = (d, mg) => { try { d.tabIndex = -1; d.style.outline = 'none'; d.focus({preventScroll:true}); } catch (e) {}   // nenhuma resposta abre com cara de escolhida (o foco fica na janela)
 if (!mg.img || !mg.img.length) return; const f = document.createElement('div'); f.className = 'mg-foto'; f.setAttribute('aria-hidden', 'true'); f.innerHTML = mg.img.map(n => '<span class="ic3d"><img src="' + lcIc(n) + '" alt=""></span>').join(''); const h = d.querySelector('h2'); if (h) h.before(f); };
function lcBancada(q){
 const mg1 = LC_MG[q.lcp], pre = mg1 && mg1.antes && !(state.resolvidos && state.resolvidos[q.id + ':antes']);   // pergunta de história antes do controle: a pessoa deduz, o controle só confirma
 const mg0 = pre ? mg1.antes : mg1, mg = mg0 && lcMgSorteado(q.lcp + (pre ? ':antes' : ''), mg0);
 if (!mg || (state.resolvidos && state.resolvidos[q.id])) return false;
 Promise.all([import('./reserva/banco.mjs'), import('./reserva/minigames.mjs?v=8')]).then(([B, M]) => {
  if (!document.getElementById('bancadaCss')) { const l = document.createElement('link'); l.id = 'bancadaCss'; l.rel = 'stylesheet'; l.href = new URL('bancada.css?v=5', LC_BASE).href; document.head.appendChild(l); }
  let d = document.getElementById('lcBancada');
  if (!d) { d = document.createElement('dialog'); d.id = 'lcBancada'; d.className = 'lc-banc'; document.body.appendChild(d); }
  const base = B.atividades[mg.ativ];
  const A = Object.assign({}, base, {nome:mg.nome, texto:mg.texto}, mg.opcoes ? {opcoes:mg.opcoes} : {}, mg.itens ? {itens:mg.itens, clipes:mg.clipes} : {}, mg.luz ? {luz:Object.assign({}, mg.luz, mg.luz.img ? {img:lcIc(mg.luz.img)} : {})} : {}, mg.insc ? {insc:mg.insc, tabua:LC_GLIFOS} : {}, mg.dicas ? {dicas:mg.dicas} : {});
  const aoAbrir = () => lcMgFoto(d, mg);
  M.abrirMinigame(d, A, lcCausa().slice(0,1), async v => {
   if (String(v) !== String(mg.resp)) return pre ? 'Ainda não. Pense no que o tempo faz com uma peça.' : 'Ainda não fechou. Olhe de novo o que está na tela e no seu caderno.';
   if (pre) { (state.resolvidos ||= {})[q.id + ':antes'] = true; save(); setTimeout(() => lcBancada(q), 60); return ''; }
   (state.resolvidos ||= {})[q.id] = true; save();
   setTimeout(() => collect(q.id), 0);
   return '';
  });
  aoAbrir();
 }).catch(() => { (state.resolvidos ||= {})[q.id] = true; save(); collect(q.id); });
 return true;
}

// minigame antes de atividades em dupla de investigação (comparar provas)
const LC_MGA = {
 coop_original_copia:{ativ:'comparar', resp:0, img:['GAL_B','N18'], nome:'Comparar a peça da Galeria com a foto', texto:'Uma pessoa descreve a peça, a outra olha a foto do catálogo. O que não bate?', opcoes:['A rachadura está do outro lado','A peça está mais suja que na foto','A base é mais alta'],
  dicas:['Descreva a peça em voz alta, da esquerda para a direita.','Sujeira se limpa. O lado de uma rachadura não muda.']},
 coop_acusacao_defesa:{ativ:'livro', resp:0, img:['S01','L08'], nome:'Pôr a escala e o bilhete lado a lado', texto:'O bilhete não tem assinatura. O que, na escala, foi escrito pela mesma mão?', opcoes:['O visto do patrocínio, no pé da folha','O nome BRAGA, na linha da porta de serviço','A linha "liberado até o fim do turno"','Nada: a escala é toda impressa'],
  dicas:['Quem está com o bilhete diz como é a letra. Quem está com a escala procura igual.','A letra do bilhete deita para a direita.']},
 coop_entrou_nao_saiu:{ativ:'livro', resp:2, img:['P01','S01'], nome:'Cruzar as duas listas', texto:'Três pessoas assinaram a entrada. Qual delas a roleta da saída não registrou?', opcoes:['O entregador de flores','A fotógrafa','Quem assinou pelo patrocínio'],
  dicas:['Leia o livro de visitas em voz alta, nome por nome.','Quem está na Central confere cada nome na roleta da saída.']}
};
function lcBancadaAtiv(aid, cmd){
 const mg = lcMgSorteado(aid, LC_MGA[aid]);
 Promise.all([import('./reserva/banco.mjs'), import('./reserva/minigames.mjs?v=8')]).then(([B, M]) => {
  if (!document.getElementById('bancadaCss')) { const l = document.createElement('link'); l.id = 'bancadaCss'; l.rel = 'stylesheet'; l.href = new URL('bancada.css?v=5', LC_BASE).href; document.head.appendChild(l); }
  let d = document.getElementById('lcBancada');
  if (!d) { d = document.createElement('dialog'); d.id = 'lcBancada'; d.className = 'lc-banc'; document.body.appendChild(d); }
  const A = Object.assign({}, B.atividades[mg.ativ], {nome:mg.nome, texto:mg.texto, opcoes:mg.opcoes}, mg.dicas ? {dicas:mg.dicas} : {});
  M.abrirMinigame(d, A, lcCausa().slice(0,1), async v => {
   if (String(v) !== String(mg.resp)) return 'Ainda não fechou. Releia as pistas do caderno e converse com a sua dupla.';
   (state.resolvidos ||= {})['at:' + aid + ':' + state.loop] = true; save();
   setTimeout(() => lcAgir(cmd), 0);
   return '';
  });
  lcMgFoto(d, mg);
 }).catch(() => { (state.resolvidos ||= {})['at:' + aid + ':' + state.loop] = true; lcAgir(cmd); });
}

// fatos da noite que este caderno comprova (o telão monta a fita do tempo com o que a turma toda achou)
const LC_FATO_PISTA = {troca:['data_1','data_2','data_3'], motivo:['motivo_1','lenz_mot_2','lenz_mot_3','v5_lenz'], copia:['falsa_2','falsa_3','coop_copia_ok','foto_solo','c_peca','insc_copia'], entrada:['lenz_op_1','cracha_4','cofre_ronda','assim_par'], teo:['empurra_1','empurra_2','lenz_3'], raio:['raio_1','raio_2'], passagem:['traj_1','traj_2','traj_3'], cracha:['cracha_3','lenz_2','coop_veredito'], engano:['rev_3']};
window.lcFatos = () => Object.keys(LC_FATO_PISTA).filter(k => LC_FATO_PISTA[k].some(p => LC_PID[p] && lcTem(p)));
window.lcDefeito = () => lcS().diag ? LC_NOME[lcCausa()] : '';   // décima linha da fita: o defeito da noite, de quem anexou o diagnóstico

// Missão secreta: cada pessoa recebe um objetivo particular. Cumprir rende +1 de energia na volta seguinte.
const LC_MISSOES = [
 {t:'Descubra o que o Braga está escondendo.', ok:() => lcTem('cracha_3') || lcTem('v4_braga') || lcTem('cofre_ronda')},
 {t:'Descubra o que aconteceu com o Téo.', ok:() => lcTem('lenz_3') || (lcTem('empurra_1') && lcTem('empurra_2'))},
 {t:'Descubra quem ganha dinheiro se a peça sumir.', ok:() => lcTemGrupo('motivo_lenz')},
 {t:'Descubra por que a tinta da Ivone não faz dela culpada.', ok:() => lcTem('ivone_red') && (lcTem('ivone_1x') || lcTem('dis_cafeira'))},
 {t:'Descubra o que o Aurélio sabia e não disse.', ok:() => lcTem('aurelio_2')},
 {t:'Descubra para onde vão as pegadas.', ok:() => ['coop_pegadas','pegadas_solo','lenz_3'].some(lcTem)},
 {t:'Descubra o que tem na caixa que pesa demais.', ok:() => lcTem('c_peca')},
 {t:'Descubra o que o Nico está guardando.', ok:() => lcTem('nico_1')}
];
function lcMissao(){ const s = lcS(); if (s.missao == null) s.missao = Math.floor(Math.random() * LC_MISSOES.length); return LC_MISSOES[s.missao % LC_MISSOES.length]; }
function lcMissaoChecar(){
 const s = lcS(), m = lcMissao();
 if (s.missaoOk || !m.ok()) return;
 s.missaoOk = state.loop;
 if (state.loop < 5) { s.debitos[state.loop + 1] = (s.debitos[state.loop + 1] || 0) - 1; toast('Missão secreta cumprida! Você ganha +1 de energia na próxima volta.'); }
 else toast('Missão secreta cumprida!');
 save();
}
function lcMissaoHtml(){
 const s = lcS(), m = lcMissao(); lcMissaoChecar();
 return '<section class="lc-missao' + (s.missaoOk ? ' ok' : '') + '"><h4>' + lcFicha('img:ui/missao', 'sm') + 'Sua missão secreta</h4><p>' + esc(m.t) + '</p><small>Só você sabe. ' + (window.coop ? 'Na pausa, conte para a turma. Pode blefar. ' : '') + (s.missaoOk ? 'Você cumpriu na volta ' + s.missaoOk + '.' + (window.coop ? ' A turma vê o seu nome no telão, no fim.' : '') : 'Se você cumprir, ganha +1 de energia na próxima volta.') + '</small></section>';
}

// Papéis da última volta: na pausa da volta 4, em sala, cada pessoa toca num papel. A tela da volta 5 mostra a dica do papel e o telão mostra nome e papel. Não muda regra.
const LC_PAPEL_IC = {A:'T01', B:'M03', Central:'S01', PortaVoz:'P01', Guardiao:'ui/caderno'};
function lcPapeisHtml(){
 const s = lcS(), P5 = LC.papeis_volta5;
 return '<div class="lc-papeis"><p class="lc-papeis-t">Qual é o seu papel na última volta?</p>' + P5.papeis.map(p => '<button type="button" class="lc-papel-b' + (s.papel5 === p.id ? ' on' : '') + '" data-lcpapel="' + p.id + '" aria-pressed="' + (s.papel5 === p.id) + '">' + lcFicha('img:' + LC_PAPEL_IC[p.id], 'sm') + '<span>' + esc(p.nome) + '</span></button>').join('') + (s.papel5 ? '<p class="lc-papeis-d">' + esc(lcTok(P5.dica_de_tela[s.papel5])) + '</p>' : '') + '</div>';
}
const lcPapelNome = id => (LC.papeis_volta5.papeis.find(p => p.id === id) || {}).nome || '';
const lcPapelDica = () => { const s = lcS(); return s.papel5 ? lcTok(LC.papeis_volta5.dica_de_tela[s.papel5]) : ''; };
document.addEventListener('click', e => { const b = e.target.closest && e.target.closest('[data-lcpapel]'); if (!b) return; const s = lcS(); s.papel5 = b.dataset.lcpapel; save(); try { window.coop && window.coop.papel && window.coop.papel(lcPapelNome(s.papel5)); } catch (err) {} const h = b.closest('.lc-papeis'); if (h) h.outerHTML = lcPapeisHtml(); });
