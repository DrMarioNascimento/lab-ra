import { simularCardiovascular } from './cardiovascular.js';
import { passoFaseCircadiana } from './fase-circadiana.js';
import { ajustarPressaoDaRotina, atualizarCargaSono, desafioSonoPersistente, fracaoSonoForaDaFase,
  mediasPressao } from './pressao-desalinhamento.js?v=2';

const DIA_MIN = 1440;
const DIAS_DE_TREINAMENTO_DIURNO = 42;
export const COORTES_MCHILL = Object.freeze({ diurna: 'Jornada diurna', matinal: 'Jornada cedo' });
// Figura 3: horários e medianas de variabilidade lidos aproximadamente dos gráficos.
// Figura 4b: quedas positivas, arredondadas no início e em 30 dias. Aos 90 dias, valores do texto.
export const VISITAS_MCHILL = Object.freeze([
  { dia: 0, diurna: { inicio: 1320, fim: 1815, variabilidadeH: 1.2, queda: 10.5 },
    matinal: { inicio: 1275, fim: 1815, variabilidadeH: 1.2, queda: 10.5 } },
  { dia: 30, diurna: { inicio: 1335, fim: 1875, variabilidadeH: 1.0, queda: 11.0 },
    matinal: { inicio: 1305, fim: 1830, variabilidadeH: 1.0, queda: 13.0 } },
  { dia: 90, diurna: { inicio: 1380, fim: 1920, variabilidadeH: 0.8, queda: 13.1, ic95: [10.3, 15.9] },
    matinal: { inicio: 1335, fim: 1875, variabilidadeH: 1.5, queda: 6.3, ic95: [3.7, 8.8] } },
]);

function sonoEntreVisitas(coorte, dia) {
  const pos = dia <= VISITAS_MCHILL[1].dia ? 0 : 1;
  const a = VISITAS_MCHILL[pos], b = VISITAS_MCHILL[pos + 1];
  const fracao = (dia - a.dia) / (b.dia - a.dia);
  const interpolar = (campo) => a[coorte][campo] + fracao * (b[coorte][campo] - a[coorte][campo]);
  return { inicio: Math.round(interpolar('inicio')), fim: Math.round(interpolar('fim')),
    variabilidadeH: interpolar('variabilidadeH') };
}

function pressaoNaFolga(inicio, fim, faseH, foraDaFase, cargaSono) {
  const basal = simularCardiovascular({ sono: [inicio, fim], faseInicialH: faseH });
  return mediasPressao(ajustarPressaoDaRotina(basal, foraDaFase, cargaSono));
}

export function contrasteMaximoMcHill(diurna, matinal) {
  // Cada perfil conserva sua janela e fase. O componente persistente só atua no sono.
  function comCarga({ inicio, fim, faseH }, carga) {
    const duracao = (fim - inicio + DIA_MIN) % DIA_MIN;
    const fora = fracaoSonoForaDaFase(inicio, duracao, () => faseH);
    return pressaoNaFolga(inicio, fim, faseH, fora, carga).quedaPasPct;
  }
  return comCarga(diurna, 0) - comCarga(matinal, 1);
}

export function simularConferenciaMcHill(coorte, { faseParcial = false } = {}) {
  if (!Object.hasOwn(COORTES_MCHILL, coorte)) throw new RangeError('Escolha uma coorte do seguimento.');
  let faseH = 0, cargaSono = 0;
  const serie = [];
  for (let dia = -DIAS_DE_TREINAMENTO_DIURNO; dia <= 90; dia++) {
    const { inicio, fim, variabilidadeH } = sonoEntreVisitas(coorte, Math.max(0, dia));
    const fimCivil = fim % DIA_MIN;
    const fora = fracaoSonoForaDaFase(inicio, fim - inicio, () => faseH);
    if (dia >= 0) {
      // A pressão foi medida em folga. A janela de sono da Figura 3 resume a semana.
      const valores = pressaoNaFolga(inicio, fimCivil, faseH, fora, cargaSono);
      serie.push({ dia, inicio, fim: fimCivil, variabilidadeH, faseH, cargaSono, ...valores });
    }
    cargaSono = atualizarCargaSono(cargaSono, desafioSonoPersistente(fora, variabilidadeH));
    faseH = passoFaseCircadiana(faseH, [[inicio, DIA_MIN], [0, fimCivil]], faseParcial);
  }
  return serie;
}
