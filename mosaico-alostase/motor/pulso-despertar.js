// Resposta triangular aproximada de Trinder et al., sintetizada por de Zambotti et al.
export const DURACAO_PULSO_S = 12;
const picos = {
  sis: { valor: 15, segundo: 5 },
  fc: { valor: 8, segundo: 4 },
};

export function respostaPulsoDespertar(variavel, segundo) {
  if (segundo < 0 || segundo >= DURACAO_PULSO_S) return 0;
  const { valor, segundo: pico } = picos[variavel];
  return valor * (segundo <= pico ? segundo / pico : (DURACAO_PULSO_S - segundo) / (DURACAO_PULSO_S - pico));
}

export const mediaMinutoDoPulso = (variavel) => picos[variavel].valor * DURACAO_PULSO_S / (2 * 60);
