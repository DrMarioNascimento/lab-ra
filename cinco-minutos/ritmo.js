/* Relógio narrativo e finais compartilhados entre o jogo e o telão. */
const LOOP_FINAIS = {
  Ouro: 'A máquina para e a verdade fica. O relógio marca 5:01 pela primeira vez. Lá fora, uma sirene. Na Sala das coleções, o Téo abre os olhos.',
  Desligar: 'O relógio passa de 5:00 e continua. Vocês devolveram a manhã ao museu. Cedo, uma caixa de "banners" sai pela porta da frente. Ninguém viu o que vocês viram.',
  Revelar: 'As 3 provas apareceram neste telão. Às 5:00 o museu esquece de novo. Os cadernos, não. A máquina ainda gira.',
  Parcial: 'O museu reinicia mais uma vez. Na Galeria, a cópia continua na base, cheirando a verniz. O caso fica aberto, e os cadernos de vocês são a peça principal.',
  'Mínimo': 'O museu esquece de novo. O raio cai, a luz volta, o homem de paletó desce a escada. Os cadernos não esquecem. Já é um começo.'
};
// Nome do desfecho na tela (o identificador interno não muda).
const LOOP_FINAL_NOME = { Ouro: 'Ouro', Desligar: 'A noite andou', Revelar: 'A verdade apareceu', Parcial: 'Caso aberto', 'Mínimo': 'O museu esqueceu' };
const LOOP_CONVERSA = 'Consertar a noite ou contar a verdade: dava para fazer as duas coisas? Se só desse uma, qual vocês escolhiam, e quem pagava por ela?';


function loopHora(duracao, restante) {   // o relógio do mundo é um só: o minuto da volta, de 0:00 a 5:00
  const decorrido = Math.max(0, Math.min(300, Math.floor((duracao - restante) * 300 / duracao)));
  return Math.floor(decorrido / 60) + ':' + String(decorrido % 60).padStart(2, '0');
}

function loopFinalTurma(respostas) {
  const conhecidos = respostas.map(r => r?.loopFinal).filter(f => Object.hasOwn(LOOP_FINAIS, f));
  if (!conhecidos.length) return null;
  const desligou = conhecidos.some(f => f === 'Ouro' || f === 'Desligar');
  const revelou = conhecidos.some(f => f === 'Ouro' || f === 'Revelar');
  const final = desligou && revelou ? 'Ouro' : desligou ? 'Desligar' : revelou ? 'Revelar'
    : conhecidos.includes('Parcial') ? 'Parcial' : 'Mínimo';
  return { final, registrados: conhecidos.length };
}

// Fita do tempo: fatos da noite que a turma pode descobrir (o telão junta o que cada pessoa achou).
// Na ordem em que aconteceu. ic = miniatura 3D da sala ou do objeto onde o fato se deu (museu/icones).
const LOOP_LINHA = [
  {id:'troca', hora:'Dias antes', ic:'V13', txt:'A peça verdadeira é trocada por uma cópia'},
  {id:'motivo', hora:'Dias antes', ic:'P01', txt:'Se a peça sumir, o seguro paga o patrocinador'},
  {id:'copia', hora:'Hoje', ic:'V11', txt:'A peça da Galeria é cópia: verniz novo, peso errado'},
  {id:'entrada', hora:'Hoje', ic:'DESC_A', txt:'Alguém do patrocínio assina a entrada à tarde, não passa pela saída e volta de noite pela porta de serviço, com o crachá do Braga'},
  {id:'teo', hora:'Antes de 0:00', ic:'V12', txt:'O Téo confronta quem trocou a peça e é empurrado'},
  {id:'raio', hora:'Apagão', ic:'E01', txt:'O raio atinge o Pátio e a luz apaga'},
  {id:'passagem', hora:'4:00', ic:'S01', txt:'Alguém de paletó volta e vai para o Subsolo'},
  {id:'cracha', hora:'4:00', ic:'L05', txt:'A mão no crachá do Braga é a do Lenz'},
  {id:'engano', hora:'4:10', ic:'T01', txt:'Ele vira a chave da Câmara achando que ela apaga cinco minutos. Ela arma em 50 segundos e só repete'}
];
function loopFitaHtml(listas, total, nomes, defeitos, base) {   // nomes (opcional): quem trouxe cada lista, na mesma ordem; defeitos: o defeito anexado por cada pessoa; base: endereço da pasta museu/icones/
  const cont = id => listas.filter(l => Array.isArray(l) && l.includes(id)).length;
  const lista = q => q.length ? 'Quem trouxe: ' + q.slice(0, 3).join(', ') + (q.length > 3 ? ' e mais ' + (q.length - 3) : '') : '';
  const quem = id => Array.isArray(nomes) ? lista(listas.map((l, i) => Array.isArray(l) && l.includes(id) ? nomes[i] : '').filter(Boolean)) : '';
  const h = t => String(t).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const img = n => '<img src="' + (base || 'museu/icones/') + n + '.webp" alt="">';
  const achados = LOOP_LINHA.filter(f => cont(f.id) > 0).length;
  const ds = (Array.isArray(defeitos) ? defeitos : []).map((d, i) => d ? [d, Array.isArray(nomes) ? nomes[i] : ''] : null).filter(Boolean);
  const linha = (ok, ic, hora, txt, q, n) => '<li class="' + (ok ? 'achou' : 'falta') + '"><span class="ic">' + (ok ? img(ic) : '<i class="tl-vago" aria-hidden="true"></i>') + '</span><b>' + hora + '</b><span class="tx">' + (ok ? txt : 'Ninguém achou ainda') + '</span>' + (ok && n ? '<i>' + (q ? '<small>' + h(q) + '</small>' : '') + '<span>' + n + (n === 1 ? ' pessoa' : ' pessoas') + '</span></i>' : '') + '</li>';
  // os fatos achados ganham a página; os que ninguém achou viram uma ficha só
  const tot = LOOP_LINHA.length + 1, ach = achados + (ds.length ? 1 : 0), escuro = tot - ach;
  return '<div class="tl-fita" style="--linhas:' + (ach + (escuro ? 1 : 0)) + '"><p class="tl-volta">A NOITE RECONSTRUÍDA · ' + ach + ' DE ' + tot + ' FATOS</p><ol>' +
    LOOP_LINHA.map(f => { const n = cont(f.id); return n > 0 ? linha(true, f.ic, f.hora, f.txt, quem(f.id), n) : ''; }).join('') +
    (ds.length ? linha(true, 'M03', '5:00', 'Por que a máquina travou: ' + h(ds[0][0]), lista(ds.map(d => d[1]).filter(Boolean)), ds.length) : '') +
    (escuro ? '<li class="falta"><span class="ic"><i class="tl-vago" aria-hidden="true"></i></span><b>' + escuro + '</b><span class="tx">' + (escuro === 1 ? 'fato ficou no escuro' : 'fatos ficaram no escuro') + '</span></li>' : '') + '</ol></div>';
}
