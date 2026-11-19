import { CASES } from './conteudo.js';
// Loop · piloto automático do simulador: faz um participante jogar sozinho dentro do quadro (iframe) da sala de mentira.
// Escolhe ambiente, clica pistas e, na conclusão, responde com chance de acerto.
export function pilotar(win, { acerto = 0.6 } = {}) {
  const doc = () => win.document;
  const sorte = (p) => Math.random() < p;
  const passo = () => {
    try {
      const L = win.LoopSala; if (!L?.room) return;
      const e = L.room.etapa, d = doc();
      if (e === 'choose' && !win.state?.room) {
        const bs = [...d.querySelectorAll('#roomGrid button:not([disabled])')];
        if (bs.length && sorte(0.5)) bs[Math.floor(Math.random() * bs.length)].click();
      } else if (e === 'playing') {
        const bs = [...d.querySelectorAll('#roomPanel button.clue:not([disabled])')];
        if (bs.length && sorte(0.35)) bs[Math.floor(Math.random() * bs.length)].click();
      } else if (e === 'final' && !L.players.find((p) => p.id === L.T.uid)?.resp && sorte(0.3)) {
        const c = CASES[L.room.caso];
        for (const k of ['event', 'alarm', 'figure', 'action']) {
          const sel = d.getElementById(k); if (!sel) continue;
          const ops = [...sel.options].filter((o) => o.value);
          const certa = ops.find((o) => o.value === c?.[k]);
          const o = certa && sorte(acerto) ? certa : ops[Math.floor(Math.random() * ops.length)];
          if (o) sel.value = o.value;
        }
        d.getElementById('answerForm').requestSubmit();
      }
    } catch { /* quadro ainda carregando */ }
  };
  const id = setInterval(passo, 900 + Math.random() * 600);
  return () => clearInterval(id);
}
