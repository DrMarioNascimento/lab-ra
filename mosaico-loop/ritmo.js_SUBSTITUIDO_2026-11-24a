/* Relógio narrativo e finais compartilhados entre o jogo e o telão. */
const LOOP_FINAIS = {
  Ouro: 'A máquina foi consertada e a troca da peça foi revelada.',
  Desligar: 'A máquina foi consertada. A troca da peça ainda precisa ser revelada.',
  Revelar: 'A troca da peça foi revelada. A máquina continua ativa.',
  Parcial: 'A investigação avançou e deixou registros para a próxima tentativa.',
  'Mínimo': 'O museu esqueceu aquela noite. O caderno conservou o que foi descoberto.'
};

function loopHora(duracao, restante) {
  const decorrido = Math.max(0, Math.min(300, Math.floor((duracao - restante) * 300 / duracao)));
  const minutos = 55 + Math.floor(decorrido / 60);
  const dois = n => String(n).padStart(2, '0');
  return (minutos < 60 ? '21:' : '22:') + dois(minutos % 60) + ':' + dois(decorrido % 60);
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
