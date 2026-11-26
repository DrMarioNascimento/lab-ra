// Índices de sinalização relativos ao repouso (100). Ganhos e meias-vidas são hipóteses didáticas.
import { PARAMETROS_HIDRICOS, PERFIL_HIDRICO } from './hidratacao.js';

const limitar = (x, min, max) => Math.min(max, Math.max(min, x));
const decair = (anterior, alvo, min, meiaVida) => alvo + (anterior - alvo) * 2 ** (-min / meiaVida);
export const REGULACAO_BASAL = Object.freeze({ adh: 100, renina: 100, angII: 100, aldosterona: 100, anp: 100 });

export function regularRim(estado, compartimento, circulacao, dtMin, ref = PERFIL_HIDRICO) {
  const anterior = estado.regulacao ?? REGULACAO_BASAL;
  const razaoPlasma = compartimento.plasmaL / ref.plasmaL;
  const deficitVolumePct = (1 - razaoPlasma) * 100;
  const desvioOsm = compartimento.osmolalidade - ref.osmolalidade;

  // Pressão em relação à basal da mesma hora. O fluxo renal permanece quase estável perto do basal.
  const razaoPressao = circulacao.razaoPressao;
  const perfusao = limitar(1 + 0.11 * (razaoPlasma - 1) + 0.14 * (razaoPressao - 1), 0.7, 1.25);
  const tfg = 120 * perfusao;
  const nacl = 100 * perfusao * compartimento.sodio / ref.sodioPlasmatico;
  const simpatico = Math.max(0, deficitVolumePct) * 1.8;
  const adh = decair(anterior.adh, limitar(100 + desvioOsm * 15 + Math.max(0, deficitVolumePct - 2) * 12, 10, 320), dtMin, 12);
  const renina = decair(anterior.renina, limitar(100 + deficitVolumePct * 7 + (100 - nacl) * 2 + simpatico
    + (1 - razaoPressao) * 30 - (anterior.angII - 100) * 0.2, 25, 300), dtMin, 18);
  const angII = decair(anterior.angII, renina, dtMin, 5);
  const aldosterona = decair(anterior.aldosterona, angII, dtMin, 42);
  const anp = decair(anterior.anp, limitar(100 - deficitVolumePct * 6, 35, 225), dtMin, 15);

  const { urinaBasalLHora, sodioUrinarioBasalMgHora, mgPorMmolSodio } = PARAMETROS_HIDRICOS;
  const urinaLHora = limitar(urinaBasalLHora * perfusao * Math.exp((100 - adh) / 100 + (anp - 100) / 250), 0.018, 0.38);
  const sodioUrinaMgHora = limitar(sodioUrinarioBasalMgHora * perfusao
    * Math.exp((100 - aldosterona) / 100 + (anp - 100) / 180 + estado.sodioDeltaMg / 2500), 12, 340);
  const osmolalidadeUrina = (14 + 2 * sodioUrinaMgHora / mgPorMmolSodio) / urinaLHora;
  return {
    regulacao: { adh, renina, angII, aldosterona, anp }, tfg, nacl, simpatico,
    urinaLHora, sodioUrinaMgHora, osmolalidadeUrina,
    sede: limitar(Math.max(0, desvioOsm * 0.55 + deficitVolumePct * 0.35), 0, 10),
  };
}
