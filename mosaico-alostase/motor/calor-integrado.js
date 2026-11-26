import { acoplarCirculacao, compartimentos, hidratar, passoHidrico, PERFIL_HIDRICO } from './hidratacao.js?v=4';
import { regularRim, REGULACAO_BASAL } from './renal.js?v=2';
import { INICIAL_TERMICO, passoTermico } from './termorregulacao.js?v=3';

export function simularCalorIntegrado({ duracaoMin, ambienteNoMinuto, basalNoMinuto, bebidas = [],
  massaKg = PERFIL_HIDRICO.massaKg, inicialTermico = INICIAL_TERMICO }) {
  const escala = massaKg / PERFIL_HIDRICO.massaKg;
  const ref = { ...PERFIL_HIDRICO, massaKg, aguaL: PERFIL_HIDRICO.aguaL * escala,
    extracelularL: PERFIL_HIDRICO.extracelularL * escala, plasmaL: PERFIL_HIDRICO.plasmaL * escala };
  const doses = new Map();
  for (const [min, ml] of bebidas) doses.set(min, (doses.get(min) ?? 0) + ml);

  let agua = hidratar(ref), temperatura = inicialTermico;
  let aguaMl = 0, suor = 0, suorEvaporado = 0, urina = 0, insensivel = 0;
  const pontos = [];
  for (let min = 0; min <= duracaoMin; min++) {
    const ambiente = ambienteNoMinuto(min);
    const comp = compartimentos(agua, ref);
    const basal = basalNoMinuto(min, ambiente);
    const cardio = acoplarCirculacao(basal, comp.plasmaL, ambiente.esforco, agua.regulacao?.angII, {
      plasmaReferenciaL: ref.plasmaL,
      vsReferencia: basal.vsReferencia,
      cargaTermica: Math.max(0, temperatura.centralC - 37.2),
    });
    const rim = regularRim(agua, comp, cardio, 1, ref);
    const entradaMl = doses.get(min) ?? 0;
    // Inclui água ainda no trato digestivo na variação de massa medida na balança.
    const perdaMassaPct = 100 * (ref.aguaL - agua.aguaL - agua.aguaDigestivaL) / massaKg;
    pontos.push({ min, ...comp, ...cardio, ...temperatura, perdaMassaPct, suor, urina, insensivel,
      suorEvaporado, aguaDigestivaL: agua.aguaDigestivaL, entradaMl, aguaMl, regulacao: agua.regulacao ?? REGULACAO_BASAL });
    if (min === duracaoMin) break;

    const estadoHidrico = {
      desvioOsm: Math.max(0, comp.osmolalidade - ref.osmolalidade),
      deficitPlasma: Math.max(0, 1 - comp.plasmaL / ref.plasmaL),
    };
    const termo = passoTermico(temperatura, { ...ambiente, estadoHidrico }, 1);
    const hidrico = passoHidrico(agua, { aguaMl: entradaMl, sodioMg: 0, suorL: termo.suorL }, 1, rim);
    agua = { ...hidrico.estado, regulacao: rim.regulacao };
    temperatura = termo.estado;
    aguaMl += entradaMl;
    suor += hidrico.fluxos.suorL;
    urina += hidrico.fluxos.urinaL;
    insensivel += hidrico.fluxos.perdaInsensivelL;
    suorEvaporado += termo.suorEvaporadoL;
  }
  return pontos;
}
