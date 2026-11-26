/* Relógio narrativo e finais compartilhados entre o jogo e o telão. */
const LOOP_FINAIS = {
  Ouro: 'A máquina foi consertada e a troca da peça foi revelada.',
  Desligar: 'A máquina foi consertada. A troca da peça ainda precisa ser revelada.',
  Revelar: 'A troca da peça foi revelada. A máquina continua ativa.',
  Parcial: 'A investigação avançou e deixou registros para a próxima tentativa.',
  'Mínimo': 'O museu esqueceu aquela noite. O caderno conservou o que foi descoberto.'
};

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
const LOOP_LINHA = [
  {id:'copia', hora:'Antes', ic:'🖼️', txt:'A peça exposta é uma cópia'},
  {id:'troca', hora:'Dias antes', ic:'🗓️', txt:'A peça verdadeira é trocada'},
  {id:'entrada', hora:'Antes', ic:'🚪', txt:'Lenz entra no museu e não sai'},
  {id:'raio', hora:'Apagão', ic:'⚡', txt:'O raio atinge o Pátio e a luz apaga'},
  {id:'camera', hora:'Apagão', ic:'📷', txt:'A câmera 4 cai no apagão'},
  {id:'teo', hora:'Antes', ic:'🩸', txt:'O Téo confronta quem trocou a peça e é empurrado'},
  {id:'passagem', hora:'4:00', ic:'🧥', txt:'Alguém de paletó vai para o Subsolo'},
  {id:'cracha', hora:'4:00', ic:'🪪', txt:'O crachá emprestado do Braga abre a porta'},
  {id:'botao', hora:'4:10', ic:'🔘', txt:'O botão da Câmara é apertado'}
];
function loopFitaHtml(listas, total) {
  const cont = id => listas.filter(l => Array.isArray(l) && l.includes(id)).length;
  const achados = LOOP_LINHA.filter(f => cont(f.id) > 0).length;
  return '<div class="tl-fita"><p class="tl-volta">A NOITE RECONSTRUÍDA · ' + achados + ' DE ' + LOOP_LINHA.length + ' FATOS</p><ol>' +
    LOOP_LINHA.map(f => { const n = cont(f.id); return '<li class="' + (n ? 'achou' : 'falta') + '"><span class="ic">' + (n ? f.ic : '❔') + '</span><b>' + f.hora + '</b><span class="tx">' + (n ? f.txt : 'Ninguém achou ainda') + '</span>' + (n ? '<i>' + n + (n === 1 ? ' pessoa' : ' pessoas') + '</i>' : '') + '</li>'; }).join('') + '</ol></div>';
}
