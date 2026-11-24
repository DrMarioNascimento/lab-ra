/* Loop · A Máquina (camada central). Dados em loop-central-dados.js (LC_DADOS).
   O defeito (A ou B) é sorteado pela semente da partida. Tudo roda no aparelho de cada pessoa:
   a dupla coopera falando (palavra da dupla que gira a cada 30 s; código da chave; janela do raio).
   Estado em state.lc (por noite). Ver docs/LOOP-CENTRAL.md. */
const LC = LC_DADOS;
const LC_PID = Object.fromEntries(LC.pistas.map(p => [p.id, p]));
const LC_AT = Object.fromEntries(LC.atividades_coop.map(a => [a.id, a]));
const LC_NOME = {A_calibrar:'Painel desregulado', B_potencia:'Falta de potência', C_ancora:'Âncora presa', D_fusivel:'Algo desligado de propósito', E_dois:'Dois defeitos juntos'};
const LC_CAUSAS = ['A_calibrar','B_potencia','C_ancora','D_fusivel','E_dois'];
const LC_JANELA = [66, 74];
const lcCausa = () => LC.causas_jogaveis[Math.floor(hashTxt('lc' + state.caseIndex + ':' + semente()) * LC.causas_jogaveis.length)];
function lcS(){
 if (!state.lc || state.lc.ci !== state.caseIndex) state.lc = {ci:state.caseIndex, anexos:{}, diag:null, conserto:null, ensaio:[], meio:{}, revelado:null, chao:{}, eco:null, mao:null, chaoUsado:false, recebeu:{}, debitos:{}, feitas:{}};
 state.lc.meio ||= {};
 return state.lc;
}
const lcAlvos = () => { const a = LC.conserto_por_causa[lcCausa()] || []; return Array.isArray(a) ? a : [a]; };
const lcMeioPendente = A => { const al = lcAlvos(), s = lcS(); return al.length > 1 && al.includes(A.id) && !al.filter(o => o !== A.id).every(o => s.meio[o] && s.meio[o] < state.loop); };
const lcVmin = A => (lcAlvos().length > 1 && lcAlvos().includes(A.id)) ? LC.E_volta_min_meio : A.volta_min;
const lcFmt = k => LC.formato_valores[k] || {};
function lcNorm(k, v){
 v = String(v).trim().toLowerCase(); const t = lcFmt(k).tipo, dig = v.replace(/\D/g, '');
 if (t === 'hora') { v = v.replace(/[hm.,;-]/g, ':').replace(/[s:]+$/, ''); if (v.includes(':')) { const [a, b] = v.split(':'); return [String(Number(a) * 60 + Number(b || 0))]; } return dig ? [String(Number(dig))] : []; }
 if (t === 'numero') return dig ? [String(Number(dig))] : [];
 if (t === 'sequencia') return dig ? [dig.split('').join('-')] : [];
 return [v];
}
function lcConfere(A, vals){
 const erradas = A.valores_pedidos.filter((k, i) => { const esp = lcNorm(k, LC.valores[k]), got = lcNorm(k, vals[i] ?? ''); return !esp.some(x => got.includes(x)); });
 return {certos:A.valores_pedidos.length - erradas.length, tot:A.valores_pedidos.length, erradas};
}
const lcMsgErro = (A, r, custo) => 'A MÁQUINA NÃO REAGE: ' + r.certos + ' de ' + r.tot + ' valor(es) aceito(s). ' + (state.loop <= 4 ? 'Ainda errado: ' + r.erradas.map(k => lcFmt(k).rotulo || k).join(', ') + '. ' : '') + 'Formato: ' + A.valores_pedidos.map(k => (lcFmt(k).rotulo || k) + ' = ' + lcFmt(k).como + ' (ex.: ' + lcFmt(k).exemplo + ')').join('; ') + '. (-' + custo + ' de energia' + (state.loop === 4 ? '; ensaio sem punição' : '') + ')';
const lcAtiva = x => !x.soNaCausa || x.soNaCausa.includes(lcCausa());
const lcId = id => 'lc-' + id;
const lcTem = id => (state.clues || []).some(c => c.id === lcId(id));
const lcTemGrupo = g => (LC.grupos_fonte[g]?.fontes || []).some(lcTem);
const lcSeg = () => state.phase === 'playing' ? (state.duration - (state.endAt - (window.coop?.now() ?? Date.now())) / 1000) * 300 / state.duration : 0;
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
 if (p.textoPorSintoma) t = [t, ...Object.entries(p.textoPorSintoma).filter(([g]) => lcTemGrupo(g)).map(([, v]) => v)].join(' ');
 const pp = p.textoPorPar; if (pp && pp.grupos.every(lado => lado.some(lcTemGrupo))) t += ' ' + pp.texto;
 if (p.textoPorCausa && p.textoPorCausa[lcCausa()]) t += ' ' + p.textoPorCausa[lcCausa()];
 return t;
}
function pistasCentral(base){
 for (const p of LC.pistas) {
  if (!lcAtiva(p) || p.daAtividade) continue;
  (base[p.sala] ||= []).push({id:lcId(p.id), name:p.previa || 'Examinar', text:lcTexto(p), time:p.segundo_min || 0, desde:p.volta_min, vmax:p.volta_max,
   tipo:TIPO_LC[p.tipo] || 'Registro', custo0:(p.custo === 0), lcp:p.id, etq:p.etiqueta || ''});
 }
 return base;
}
function lcVisivel(q){ const p = LC_PID[q.lcp]; return !p || (lcPodeVer(p) && lcChaoOk(p)); }
function lcBloqueio(q){
 const p = LC_PID[q.lcp]; if (!p) return '';
 const pd = p.precisaDe || {}, falta = (pd.todas || []).find(i => !lcTem(i));
 if (falta) return 'Falta achar algo antes, em ' + lcNomeSala(LC_PID[falta].sala) + '.';
 if ((pd.umaDe || []).length && !pd.umaDe.some(lcTem)) return 'Falta achar algo antes, em ' + lcNomeSala(LC_PID[pd.umaDe[0]].sala) + '.';
 return '';
}
function lcTextoClue(q){ const p = LC_PID[q.lcp]; return p ? lcTexto(p) : q.text; }
function lcAposColetar(q){
 const p = LC_PID[q.lcp]; if (!p) return;
 if (p.tipo === 'objeto' && p.objeto) lcS().mao = {obj:p.objeto, volta:state.loop};
}
function lcDarPista(pid, tipo){
 const p = LC_PID[pid]; if (!p || lcTem(pid)) return false;
 state.clues.push({id:lcId(pid), room:lcNomeSala(p.sala), name:p.previa || pid, text:lcTexto(p), tipo:tipo || 'Relato', loop:state.loop, etq:p.etiqueta || ''});
 return true;
}
const lcCargas = () => cargasRestantes();
function lcGastar(n){ if (lcCargas() < n) { toast('Faltam cargas: precisa de ' + n + '.'); return false; } state.cargas = cargasRestantes() - n; return true; }
// ---- diagnóstico (anexar): 2 sinais de tipos diferentes + 1 que descarta outra causa
function lcValidaAnexo(causa, ids){
 const lados = (LC.diagnostico_por_causa[causa] || {}).lados, sinais = {}, desc = [], linhas = []; let completo = false;
 for (const i of ids) {
  const x = LC_PID[i], g = x.grupoFonte, ap = x.revela.aponta.includes(causa), rot = '"' + (x.previa || i) + '"', de = x.revela.descarta.filter(c => LC_CAUSAS.includes(c) && c !== causa);
  if (x.diagnosticoCompleto && ap) { completo = true; linhas.push(rot + ': leitura completa do painel. Vale sozinha.'); }
  else if (x.tipo === 'falsa_honesta') linhas.push(rot + ': coisa estranha com explicação inocente. NÃO CONTA.');
  else if (ap && g && sinais[g]) linhas.push(rot + ': sinal REPETIDO (mesmo tipo). Conta uma vez só.');
  else if (ap && g) { sinais[g] = i; linhas.push(rot + ': CONTOU como sinal.'); }
  else if (de.length) { desc.push(i); linhas.push(rot + ': CONTOU como descarte (outro sistema está inteiro).'); }
  else if ((g || '').startsWith('sint_')) linhas.push(rot + ': é sinal da máquina, mas não combina com o defeito escolhido. NÃO CONTOU.');
  else if ((g || '').startsWith('desc_')) linhas.push(rot + ': mostra um sistema inteiro, mas é justamente o do defeito escolhido. NÃO CONTOU.');
  else linhas.push(rot + ': não é sinal da máquina nem descarte (história, manual ou ferramenta). NÃO CONTOU.');
 }
 if (completo) return {ok:true, msg:'', linhas};
 let ns = Math.min(Object.keys(sinais).length, 2); const nd = Math.min(desc.length, 1);
 if (lados) ns = lados.filter(l => l.some(g => sinais[g])).length;
 const placar = 'Contaram ' + ns + ' de 2 sinais' + (lados ? ' (dois defeitos: 1 sinal de número + 1 de força)' : '') + ' e ' + nd + ' de 1 descarte.';
 if (ns < 2) return {ok:false, msg:placar + ' Faltam sinais de tipos diferentes que apontem esse defeito.', linhas};
 if (!nd) return {ok:false, msg:placar + ' Falta 1 pista que descarte outro defeito.', linhas};
 return {ok:true, msg:placar, linhas};
}
function lcAnexar(causa, ids){
 const s = lcS();
 if (s.diag) return 'O dossiê já tem diagnóstico.';
 if (state.loop < 2) return 'A página de diagnóstico abre na volta 2. Por enquanto, olhe e anote.';
 if (s.anexos[state.loop]) return 'Uma tentativa por volta. Tente de novo na próxima.';
 if (ids.length !== 3) return 'Escolha exatamente 3 pistas do seu caderno. (Não gastou a tentativa.)';
 const v = lcValidaAnexo(causa, ids);
 s.anexos[state.loop] = causa;
 if (!v.ok) { save(); return 'O dossiê não aceita. ' + v.msg + ' ' + v.linhas.join(' ') + ' A tentativa desta volta foi gasta.'; }
 if (causa !== lcCausa()) { save(); return 'As provas até combinam, mas A MÁQUINA NÃO REAGE: o defeito é outro, ou são dois defeitos juntos. Releia os sinais do caderno antes da próxima tentativa. (A tentativa desta volta foi gasta.)'; }
 s.diag = {volta:state.loop}; save(); return 'DIAGNÓSTICO ANEXADO. ' + v.msg + ' O conserto da máquina pode acender.';
}
function lcFaltas(A){
 const e = A.entrada, f = [];
 if ((e.estado || []).includes('diagnostico_anexado') && !lcS().diag) f.push('o diagnóstico anexado (aba Dossiê)');
 for (const g of e.grupos || []) if (!lcTemGrupo(g)) f.push(LC.grupos_fonte[g].rotulo);
 for (const i of e.pistas || []) if (!lcTem(i)) f.push('"' + (LC_PID[i].previa || i) + '"');
 return f;
}
const lcAcesa = A => lcAtiva(A) && state.loop >= lcVmin(A) && !lcFaltas(A).length;
// ---- palavra da dupla (gira a cada 30 s: os dois precisam estar juntos)
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
function lcFimAtividade(A, modo){
 const s = lcS(); s.feitas[A.id] = (s.feitas[A.id] || 0) + 1;
 if (A.anexa_diagnostico && !s.diag) { s.diag = {volta:state.loop, via:A.id}; toast('Leitura completa: DIAGNÓSTICO ANEXADO.'); }
 if (A.conserto) {
  if (lcMeioPendente(A)) { s.meio[A.id] = state.loop; if (A.produto_meio) lcDarPista(A.produto_meio); return 'MEIO CONSERTO (' + modo + ') gravado na Câmara. O aviso mudou de lugar, mas não sumiu: falta o OUTRO defeito, em OUTRA volta.'; }
  if (state.loop <= 4) { s.ensaio.push(A.id); if (A.produto_ensaio) lcDarPista(A.produto_ensaio); return 'ENSAIO (' + modo + '): A MÁQUINA REAGE. Não valeu ainda: repita na volta 5.'; }
  s.conserto = 5; if (A.produto_final) lcDarPista(A.produto_final); return 'CONSERTO FEITO (' + modo + '). O botão "Loop Reset" agora responde.';
 }
 const n = lcProduzir(A);
 return 'ATIVIDADE FEITA: ' + A.nome + '.' + (n.length ? ' Novas pistas no caderno: ' + n.map(p => p.previa).join(', ') + '.' : '');
}
function lcFinal(){
 const s = lcS(), certa = !!s.diag, des = certa && s.conserto === 5, rev = !!(s.revelado && s.revelado.ok);
 const provas = ['prova_falsa','trajeto','cracha'].filter(lcTemGrupo);
 if (des && rev) return 'Ouro'; if (des) return 'Desligar'; if (rev) return 'Revelar';
 if (certa || provas.length >= 2) return 'Parcial'; return 'Mínimo';
}
const lcFinalTxt = n => { const f = LC.finais.find(x => x.nome.toLowerCase() === n.toLowerCase() || x.nome === n.replace('í', 'i')) || {}; return (f.texto_por_causa && f.texto_por_causa[lcCausa()]) || f.texto || ''; };
// ---- tela da Máquina
function lcPainelHtml(aba){
 const s = lcS(), causa = lcCausa();
 const abas = [['dossie','Dossiê'],['atividades','Atividades'],['revelar','Revelar'],['trocar','Passar pista']];
 let h = '<div class="lc-abas">' + abas.map(([k, n]) => '<button type="button" class="lc-aba' + (k === aba ? ' on' : '') + '" data-lcaba="' + k + '">' + n + '</button>').join('') + '</div>';
 h += '<p class="lc-status">Volta ' + state.loop + ' de 5 · ' + (s.diag ? '✅ Diagnóstico anexado' : '🔍 Diagnóstico aberto') + ' · ' + (s.conserto === 5 ? '✅ Máquina consertada' : s.ensaio.length ? '🧪 Ensaio feito' : '⚙️ Máquina travada') + ' · ' + lcCargas() + ' de energia</p>';
 const meus = (state.clues || []).filter(c => c.id.startsWith('lc-'));
 if (aba === 'dossie') {
  h += '<h4>Por que a máquina travou?</h4><p class="lc-dica">Escolha o defeito e <b>3 pistas</b> do seu caderno: <b>2 sinais de tipos diferentes</b> que apontem esse defeito + <b>1 prova de que outro sistema está inteiro</b>. Uma tentativa por volta, a partir da volta 2. Coisa estranha com explicação inocente não conta.</p>';
  if (s.diag) h += '<p class="lc-ok">O dossiê já aceitou o diagnóstico. Vá para Atividades.</p>';
  else {
   h += '<div class="lc-causas">' + LC_CAUSAS.map(c => '<label><input type="radio" name="lccausa" value="' + c + '"> ' + LC_NOME[c] + '</label>').join('') + '</div>';
   h += '<div class="lc-provas">' + (meus.length ? meus.map(c => '<label><input type="checkbox" name="lcprova" value="' + c.id.slice(3) + '"> <b>' + esc(c.name) + '</b> <small>' + esc(c.etq ? c.etq + ' · ' : '') + esc(c.room) + '</small></label>').join('') : '<p class="muted">Você ainda não tem pistas da máquina no caderno.</p>') + '</div>';
   h += '<button type="button" class="lc-btn" id="lcAnexar">Anexar ao dossiê</button>';
  }
  h += '<p class="lc-msg" id="lcMsg" role="status"></p>';
 } else if (aba === 'atividades') {
  h += '<p class="lc-dica">Atividades em dupla: cada pessoa fica numa sala, <b>fala</b> o que vê e <b>escuta</b> o outro. Sem dupla, vale o caminho solo (custa mais).</p>';
  for (const A of LC.atividades_coop) {
   if (!lcAtiva(A)) continue;
   const f = lcFaltas(A), cedo = state.loop < lcVmin(A), aberta = !f.length && !cedo;
   h += '<section class="lc-ativ' + (aberta ? ' on' : '') + '"><h4>' + (aberta ? '🟢 ' : '⚪ ') + esc(A.nome) + '</h4><small>' + A.salas.map(lcNomeSala).map(esc).join(' + ') + '</small>';
   if (!aberta) h += '<p class="muted">' + (cedo ? 'Abre na volta ' + lcVmin(A) + '.' : 'Falta: ' + f.map(esc).join(' · ') + '.') + '</p>';
   else h += lcAtivHtml(A);
   h += '</section>';
  }
  h += '<p class="lc-msg" id="lcMsg" role="status"></p>';
 } else if (aba === 'revelar') {
  h += '<h4>Revelar quem trocou a peça</h4><p class="lc-dica">Na <b>Recepção</b>, em qualquer volta, uma tentativa. Quem apresenta precisa ter no PRÓPRIO caderno as 3 provas: peça falsa, trajeto e crachá.</p>';
  const pv = ['prova_falsa','trajeto','cracha'];
  h += '<ul class="lc-lista">' + pv.map(g => '<li>' + (lcTemGrupo(g) ? '✅' : '⬜') + ' ' + esc(LC.grupos_fonte[g].rotulo) + '</li>').join('') + '</ul>';
  h += s.revelado ? '<p class="lc-ok">Você já usou a tentativa: ' + (s.revelado.ok ? 'o nome fechou com as provas.' : 'o nome não fechou.') + '</p>' : '<input id="lcNome" placeholder="Nome de quem trocou a peça" autocomplete="off"><button type="button" class="lc-btn" id="lcRevelar">Revelar no telão</button>';
  h += '<p class="lc-ok">Final se a noite acabasse agora: <b>' + lcFinal() + '</b>. ' + esc(lcFinalTxt(lcFinal())) + '</p><p class="lc-msg" id="lcMsg" role="status"></p>';
 } else {
  h += '<p class="lc-dica">Só na pausa entre voltas. Quem passa mostra o código; quem recebe digita (custa 1 de energia na volta seguinte, 1 pista por pausa). Contem com as próprias palavras.</p>';
  if (state.phase === 'playing') h += '<p class="muted">Espere a pausa entre as voltas.</p>';
  else {
   h += '<h4>Passar uma pista</h4><select id="lcPassar">' + meus.map(c => '<option value="' + c.id.slice(3) + '">' + esc(c.name) + '</option>').join('') + '</select><button type="button" class="lc-btn" id="lcCod">Gerar código</button><p class="lc-cod" id="lcCodTxt"></p>';
   h += '<h4>Receber uma pista</h4><input id="lcCodIn" placeholder="Código de 4 letras" maxlength="4" autocomplete="off"><button type="button" class="lc-btn" id="lcReceber">Receber</button>';
  }
  h += '<p class="lc-msg" id="lcMsg" role="status"></p>';
 }
 return h;
}
function lcAtivHtml(A){
 const room = state.room, s = lcS(), papel = room === A.salas[0] ? 'A' : room === A.salas[1] ? 'B' : null;
 let h = '';
 if (A.acao_de_chao) {
  const ac = A.acao_de_chao, mao = s.mao && s.mao.volta === state.loop ? s.mao.obj : null;
  h += '<p>' + esc(A.papelA) + '</p><p>' + esc(A.papelB) + '</p>';
  if (mao && room === ac.sala_destino && !s.chaoUsado) h += '<button type="button" class="lc-btn" data-lcagir="deixar:' + A.id + '">Deixar ' + esc(mao) + ' no chão aqui</button>';
  else if (mao) h += '<p class="muted">Você está com ' + esc(mao) + '. Leve até ' + esc(lcNomeSala(ac.sala_destino)) + '.</p>';
  return h;
 }
 if (!papel) {
  h += '<p class="muted">Vá a ' + A.salas.map(lcNomeSala).map(esc).join(' ou ') + ' para fazer a sua parte.</p>';
  if (A.papelCentral) h += '<p class="lc-solo"><b>Central</b> (Central de monitoramento): ' + esc(A.papelCentral) + '</p>';
  if (A.saida_solo) h += '<p class="lc-solo"><b>Sem dupla:</b> ' + esc(A.saida_solo) + '</p>';
  return h;
 }
 if (lcMeioPendente(A) && s.meio[A.id]) return h + '<p class="lc-ok">Esta metade já está gravada na Câmara. Falta o OUTRO defeito, em outra volta.</p>';
 h += '<p class="lc-papel"><b>Sua parte:</b> ' + esc(papel === 'A' ? A.papelA : A.papelB) + '</p>';
 if (A.dicaTela && A.dicaTela[papel]) h += '<p class="lc-dica">💡 ' + esc(A.dicaTela[papel]) + '</p>';
 if (A.id === 'coop_raio') return h + lcRaioHtml(A, papel);
 const slot = lcSlot(), vals = A.valores_pedidos && room === 'prototipo';
 h += '<p class="lc-pal">Palavra para dizer em voz alta: <b>' + lcPal(A.id, papel, slot) + '</b> <small>(muda a cada 30 s)</small></p>';
 h += '<input data-lcpal="' + A.id + '" placeholder="Palavra que a outra pessoa disse" autocomplete="off">';
 if (vals) {
  h += '<p class="lc-dica">' + esc(A.formato || '') + '</p><div class="lc-vals">' + A.valores_pedidos.map((k, i) => '<input data-lcval="' + i + '" placeholder="' + esc(lcFmt(k).rotulo || k) + '">').join('') + '</div>';
 }
 h += '<button type="button" class="lc-btn" data-lcagir="dupla:' + A.id + ':' + papel + '">Fazer em dupla (1 de energia)</button>';
 const S = A.solo;
 if (S && S.tipo === 'individual' && vals) h += '<div class="lc-solo"><b>Sem dupla</b> (' + S.custo + ' de energia): tudo precisa estar no seu caderno.<button type="button" class="lc-btn" data-lcagir="solo:' + A.id + ':A">Fazer sozinho</button></div>';
 else if (S && S.tipo === 'chao') {
  const mao = s.mao && s.mao.volta === state.loop ? s.mao.obj : null;
  h += '<div class="lc-solo"><b>Sem dupla</b> (precisa de duas voltas): ' + esc(S.como || '');
  if (mao === S.objeto && room === S.sala && !s.chaoUsado) h += '<button type="button" class="lc-btn" data-lcagir="deixarpeca:' + A.id + '">Deixar a peça no chão do Subsolo</button>';
  if (vals) h += '<button type="button" class="lc-btn" data-lcagir="solochao:' + A.id + '">Agir usando a peça do chão (' + S.custo + ' de energia)</button>';
  h += '</div>';
 } else if (A.saida_solo) h += '<p class="lc-solo"><b>Sem dupla:</b> ' + esc(A.saida_solo) + '</p>';
 if (A.papelCentral) h += '<p class="lc-solo"><b>Central:</b> ' + esc(A.papelCentral) + '</p>';
 return h;
}
const lcCodChave = () => String(100 + Math.floor(hashTxt('chave' + state.loop + ':' + Math.floor(lcSeg() / 10) + ':' + semente()) * 900));
function lcRaioHtml(A, papel){
 const S = A.solo, s = lcS();
 let h = '';
 if (papel === 'B') {
  h += '<p>Segure o botão: enquanto estiver segurando, aparece o código da chave. Diga o código à outra pessoa.</p><button type="button" class="lc-btn lc-segurar" id="lcSegurar">Segurar a chave 3</button><p class="lc-cod" id="lcChaveCod"></p>';
  h += '<div class="lc-solo"><b>Sem dupla (eco):</b> aqui no Pátio, dentro da janela do raio (' + lcMM(LC_JANELA[0]) + ' a ' + lcMM(LC_JANELA[1]) + '), grave o gesto (2 de energia, volta 3 em diante).<button type="button" class="lc-btn" data-lcagir="eco:' + A.id + '">Gravar o eco</button></div>';
  if (s.eco) h += '<p class="lc-ok">Eco gravado na volta ' + s.eco.volta + '.</p>';
 } else {
  h += '<p>Com o código que a outra pessoa disser, baixe a alavanca <b>dentro da janela do raio</b> (' + lcMM(LC_JANELA[0]) + ' a ' + lcMM(LC_JANELA[1]) + '). Cedo ou tarde demais, a máquina não reage.</p><input id="lcCodChaveIn" placeholder="Código de 3 números" inputmode="numeric" maxlength="3" autocomplete="off"><button type="button" class="lc-btn" data-lcagir="raio:' + A.id + '">Baixar a alavanca (1 de energia)</button>';
  h += '<div class="lc-solo"><b>Sem dupla (eco):</b> numa volta anterior você gravou a chave no Pátio. Agora baixe a alavanca na janela (2 de energia).<button type="button" class="lc-btn" data-lcagir="ecoalavanca:' + A.id + '">Baixar usando o eco</button></div>';
 }
 return h;
}
const lcMM = t => Math.floor(t / 60) + ':' + String(t % 60).padStart(2, '0');
function lcMsg(t){ const m = document.getElementById('lcMsg'); if (m) m.textContent = t; toast(t.length > 120 ? t.slice(0, 117) + '…' : t); }
function lcAgir(cmd){
 const [tipo, aid, papel0] = cmd.split(':'), A = LC_AT[aid], s = lcS(), dlg = document.getElementById('lcDialog');
 const lerVals = () => [...dlg.querySelectorAll('[data-lcval]')].map(i => i.value);
 if (tipo === 'deixar' || tipo === 'deixarpeca') {
  const mao = s.mao && s.mao.volta === state.loop ? s.mao : null, sala = tipo === 'deixar' ? A.acao_de_chao.sala_destino : A.solo.sala;
  if (!mao || s.chaoUsado) return lcMsg('Você não tem objeto para deixar (ou já usou o seu único objeto de chão).');
  s.chao[sala] = {objeto:mao.obj, volta:state.loop}; s.chaoUsado = true; s.mao = null; save();
  return lcMsg('Você deixou o objeto no chão. O chão guarda: na próxima volta, qualquer pessoa acha aqui.');
 }
 if (state.phase !== 'playing') return lcMsg('Só durante uma volta.');
 if (tipo !== 'eco' && state.loop < lcVmin(A)) return lcMsg('Só a partir da volta ' + lcVmin(A) + '.');
 if (lcMeioPendente(A) && s.meio[A.id]) return lcMsg('Esta metade já está gravada. Falta o outro defeito, em outra volta.');
 if (tipo === 'dupla') {
  const outro = papel0 === 'A' ? 'B' : 'A', inp = dlg.querySelector('[data-lcpal="' + aid + '"]');
  if (!lcPalOk(aid, outro, inp?.value)) return lcMsg('A palavra não confere. Escute a outra pessoa: ela precisa estar na outra sala agora.');
  const ladoVals = A.valores_pedidos && state.room === 'prototipo';
  if (A.valores_pedidos && !ladoVals) { return lcMsg('Sua parte está feita. Quem está no Subsolo gira, liga ou digita, e confere os valores com você.'); }
  if (!lcGastar(A.custo_por_pessoa || 1)) return;
  if (ladoVals) { const r = lcConfere(A, lerVals()); if (r.certos !== r.tot) { save(); return lcMsg(lcMsgErro(A, r, A.custo_por_pessoa || 1)); } }
  const r = lcFimAtividade(A, 'dupla'); save(); renderClues?.(); renderJournal?.(); return lcMsg(r);
 }
 if (tipo === 'solo' || tipo === 'solochao') {
  const S = A.solo; if (!S) return;
  if (tipo === 'solochao') {
   const o = s.chao[S.sala]; if (!(o && o.objeto === S.objeto && o.volta < state.loop)) return lcMsg('Sem dupla, a peça precisa estar no chão do Subsolo desde uma volta ANTERIOR. Pegue-a, desça, deixe, e volte na volta seguinte.');
  } else {
   const falta = S.no_proprio_caderno.filter(g => !lcTemGrupo(g)).map(g => LC.grupos_fonte[g].rotulo);
   if (falta.length) return lcMsg('Sem dupla, tudo precisa estar no SEU caderno. Falta: ' + falta.join(' · ') + '.');
  }
  if (!lcGastar(S.custo)) return;
  const r = lcConfere(A, lerVals());
  if (r.certos !== r.tot) { save(); return lcMsg(lcMsgErro(A, r, S.custo)); }
  const m = lcFimAtividade(A, 'solo'); save(); return lcMsg(m);
 }
 const seg = lcSeg(), na = seg >= LC_JANELA[0] && seg <= LC_JANELA[1];
 if (tipo === 'eco') {
  if (state.loop < A.solo.volta_min_gravar) return lcMsg('O eco grava a partir da volta ' + A.solo.volta_min_gravar + '.');
  if (!na) return lcMsg('Fora da janela do raio (' + lcMM(LC_JANELA[0]) + ' a ' + lcMM(LC_JANELA[1]) + '). Agora são ' + lcMM(Math.floor(seg)) + '.');
  if (!lcGastar(A.solo.custo_gravar)) return;
  s.eco = {volta:state.loop}; lcDarPista(A.solo.produto_eco); save(); return lcMsg('ECO GRAVADO. Em outra volta, baixe a alavanca no Subsolo.');
 }
 if (tipo === 'ecoalavanca') {
  if (!s.eco || s.eco.volta >= state.loop) return lcMsg('Falta o eco: numa volta anterior, grave a chave no Pátio.');
  if (!na) return lcMsg('Fora da janela do raio. Agora são ' + lcMM(Math.floor(seg)) + '.');
  if (!lcGastar(A.solo.custo_executar)) return;
  const r = lcFimAtividade(A, 'solo (eco)'); save(); return lcMsg(r);
 }
 if (tipo === 'raio') {
  const cod = (document.getElementById('lcCodChaveIn')?.value || '').trim();
  if (!na) return lcMsg('Fora da janela do raio (' + lcMM(LC_JANELA[0]) + ' a ' + lcMM(LC_JANELA[1]) + '). Agora são ' + lcMM(Math.floor(seg)) + '.');
  const ok = [0, 1, 2].some(d => { const t = Math.floor(seg / 10) - d; return String(100 + Math.floor(hashTxt('chave' + state.loop + ':' + t + ':' + semente()) * 900)) === cod; });
  if (!ok) return lcMsg('O código da chave não confere. A outra pessoa precisa estar segurando a chave 3 no Pátio e dizer o número que aparece.');
  if (!lcGastar(A.custo_por_pessoa || 1)) return;
  const r = lcFimAtividade(A, 'dupla'); save(); return lcMsg(r);
 }
}
function lcRevelar(){
 const s = lcS(), nome = (document.getElementById('lcNome')?.value || '').trim();
 if (s.revelado) return lcMsg('Você já usou a tentativa.');
 if (state.phase !== 'playing') return lcMsg('O telão da Recepção só aceita o Revelar durante uma volta.');
 if (state.room !== 'recepcao') return lcMsg('Para Revelar, vá à Recepção.');
 const falta = ['prova_falsa','trajeto','cracha'].filter(g => !lcTemGrupo(g));
 if (falta.length) return lcMsg('Faltam no SEU caderno: ' + falta.map(g => LC.grupos_fonte[g].rotulo).join(' · ') + '. Outra pessoa do grupo pode apresentar.');
 if (!nome) return lcMsg('Diga o nome.');
 const ok = normResp(LC.culpado.split(' ')[0]) === normResp(nome.split(' ')[0]);
 s.revelado = {ok, nome}; save();
 lcMsg('REVELAR: as 3 provas vão para o telão. ' + (ok ? 'O nome fecha com as provas. Todo mundo viu.' : 'Mas o nome dito não fecha com as provas. O telão apaga.'));
}
const lcCodPista = pid => Array.from({length:4}, (_, i) => 'ABCDEFGHJKLMNPRSTUVXZ'[Math.floor(hashTxt('cp' + pid + i + semente()) * 21)]).join('');
function lcReceber(cod){
 const s = lcS(), c = normResp(cod);
 if (s.recebeu[state.loop]) return lcMsg('Só 1 pista por pausa.');
 const p = LC.pistas.find(x => lcAtiva(x) && !x.daAtividade && lcCodPista(x.id) === c);
 if (!p) return lcMsg('Código inválido.');
 if (lcTem(p.id)) return lcMsg('Você já tem essa pista.');
 s.recebeu[state.loop] = true; s.debitos[state.loop + 1] = (s.debitos[state.loop + 1] || 0) + 1;
 state.clues.push({id:lcId(p.id), room:lcNomeSala(p.sala), name:p.previa || p.id, text:lcTexto(p), tipo:'Relato', loop:state.loop, recebida:true}); save();
 lcMsg('Recebida: ' + (p.previa || p.id) + '. (-1 de energia na próxima volta.)');
}
let lcAba = 'dossie', lcTimer = 0, lcSeguro = false;
function lcAbrir(aba){
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
   if (t.id === 'lcCod') { const id = d.querySelector('#lcPassar')?.value; if (id) d.querySelector('#lcCodTxt').textContent = 'Código: ' + lcCodPista(id); return; }
   if (t.id === 'lcReceber') { lcReceber(d.querySelector('#lcCodIn').value); lcDesenhar(true); return; }
  });
  const hold = (on) => { lcSeguro = on; const c = document.getElementById('lcChaveCod'); if (c) c.textContent = on ? 'Código da chave: ' + lcCodChave() : ''; };
  for (const ev of ['pointerdown','pointerup','pointerleave','pointercancel']) d.addEventListener(ev, e => { if (e.target.id === 'lcSegurar') hold(ev === 'pointerdown'); });
  d.addEventListener('close', () => clearInterval(lcTimer));
 }
 lcDesenhar(true);
 if (!d.open) d.showModal();
 clearInterval(lcTimer); lcTimer = setInterval(() => lcDesenhar(false), 2000);
}
function lcDesenhar(forcar){
 const d = document.getElementById('lcDialog'); if (!d || !d.open && !forcar) return;
 // não redesenha enquanto a pessoa digita
 if (!forcar && d.contains(document.activeElement) && /INPUT|SELECT/.test(document.activeElement.tagName)) {
  const pal = d.querySelector('.lc-pal b'); if (pal) { const a = pal.closest('section'); } return;
 }
 const guardar = [...d.querySelectorAll('input')].map(i => [i.id || i.name + i.value || i.dataset.lcval, i.value]);
 d.innerHTML = '<button type="button" id="lcFechar" class="lc-x" aria-label="Fechar">✕</button><h3>🧭 A Máquina</h3>' + lcPainelHtml(lcAba);
 d.querySelectorAll('input[type=text],input:not([type])').forEach((i, n) => { const g = guardar.find(x => x[0] === (i.id || i.dataset.lcval)); if (g && forcar !== true) i.value = g[1]; });
}
function lcBotao(){
 if (document.getElementById('lcBtnMaq')) return;
 const b = document.createElement('button'); b.id = 'lcBtnMaq'; b.type = 'button'; b.textContent = '🧭 Máquina'; b.className = 'lc-fab';
 b.onclick = () => lcAbrir(); document.body.appendChild(b);
}
if (typeof document !== 'undefined') { const i = setInterval(() => { if (document.body) { lcBotao(); clearInterval(i); } }, 300); }
