// Loop · piloto automático do simulador: faz um participante jogar sozinho dentro do quadro (iframe) da sala de mentira.
// Escolhe ambiente, clica pistas e, no fim, registra o desfecho (o Loop não tem formulário de perguntas).
export function pilotar(win, { acerto = 0.6 } = {}) {
  const doc = () => win.document;
  const sorte = (p) => Math.random() < p;
  const passo = () => {
    try {
      const L = win.LoopSala; if (!L?.room) return;
      const e = L.room.etapa, d = doc();
      if (e === 'choose' && !win.state?.room && !win.state?.prep && d.querySelector('[data-nt="prep"]')) {
        d.querySelector('[data-nt="prep"]').click();   // preparação da noite: começar
      } else if (e === 'choose' && !win.state?.room) {
        const bs = [...d.querySelectorAll('#roomGrid button:not([disabled])')];
        if (bs.length && sorte(0.5)) bs[Math.floor(Math.random() * bs.length)].click();
      } else if (e === 'playing') {
        // revisão 17: os detalhes da peça ficam escondidos; quem procura acha um de cada vez (acharAoAcaso) e só examina o que já achou
        const bs = [...d.querySelectorAll('#roomPanel button.clue:not([disabled]):not([hidden])')];
        if ((!bs.length || sorte(0.3)) && win.acharAoAcaso) win.acharAoAcaso();
        else if (bs.length && sorte(0.35)) bs[Math.floor(Math.random() * bs.length)].click();
      } else if (e === 'final' && !L.players.find((p) => p.id === L.T.uid)?.resp && sorte(0.3)) {
        d.getElementById('answerForm').requestSubmit();
      }
    } catch { /* quadro ainda carregando */ }
  };
  const id = setInterval(passo, 900 + Math.random() * 600);
  return () => clearInterval(id);
}
