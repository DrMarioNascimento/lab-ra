import { simularCardiovascular } from './cardiovascular.js';
import { fracaoSonoForaDaFase, mediasPressao, pressaoComDesalinhamento } from './pressao-desalinhamento.js';

function repousoComSono(inicio, duracao, faseH) {
  const desalinhamento = fracaoSonoForaDaFase(inicio, duracao, () => faseH);
  const pontos = simularCardiovascular({ sono: [inicio, (inicio + duracao) % 1440],
    faseInicialH: faseH, faseFinalH: faseH });
  return mediasPressao(pontos.map((p) => pressaoComDesalinhamento(p, desalinhamento)));
}

export function conferirEscalaComMorris() {
  // A janela de 24 h monitorada começa às 07:00 ou 19:00. As médias da janela
  // são invariantes a essa rotação com fase fixa e sem efeito de transições anteriores.
  const alinhado = repousoComSono(23 * 60, 480, 0);
  const invertido = repousoComSono(11 * 60, 480, 0);
  return [
    { nome: 'PAS em 24 h', estudo: 1.4, motor: invertido.pas24h - alinhado.pas24h },
    { nome: 'PAD em 24 h', estudo: 0.8, motor: invertido.pad24h - alinhado.pad24h },
    { nome: 'PAS na vigília', estudo: 1.7, motor: invertido.pasVigilia - alinhado.pasVigilia, ancora: true },
    { nome: 'PAD na janela de sono', estudo: 1.8, motor: invertido.padSono - alinhado.padSono, ancora: true },
  ];
}

export function conferirEscalaComShafer() {
  // Horários aproximados pela soma das médias de início da melatonina e do
  // intervalo até o sono na noite da MAPA. Durações médias de sete dias como proxy.
  const diurno = repousoComSono(21, 480, 0);
  const noturno = repousoComSono(50, 456, 107 / 60);
  return [
    { nome: 'Trabalhadores diurnos', estudo: 13.4, dp: 4.4, motor: diurno.quedaPasPct },
    { nome: 'Trabalhadores noturnos', estudo: 9.3, dp: 1.5, motor: noturno.quedaPasPct },
  ];
}
