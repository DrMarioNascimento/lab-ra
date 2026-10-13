/* Estado da bancada local. Nenhuma pista ou pontuacao da sala real e alterada. */
(function (global) {
  'use strict';
  const stages = ['apagao', 'posicionar', 'castical', 'iluminar', 'encontrado', 'registrado'];
  const transitions = { energia: ['apagao', 'posicionar'], posicionar: ['posicionar', 'castical'], encaixar: ['castical', 'iluminar'], descobrir: ['iluminar', 'encontrado'], registrar: ['encontrado', 'registrado'] };
  const initial = () => ({ version: 1, stage: 'apagao', evidence: [], elapsed: 0 });
  function restore(value) {
    if (!value || value.version !== 1 || !stages.includes(value.stage)) return initial();
    const registered = value.stage === 'registrado';
    return { version: 1, stage: value.stage, evidence: registered ? ['ac-estudo-marca-externa'] : [], elapsed: 0 };
  }
  function reduce(state, event) {
    if (event.type === 'reiniciar') return initial();
    const rule = transitions[event.type];
    if (!rule || state.stage !== rule[0]) return state;
    return { ...state, stage: rule[1], evidence: event.type === 'registrar' ? ['ac-estudo-marca-externa'] : state.evidence };
  }
  function dwell(previous, active, deltaSeconds) {
    if (!active) return 0;
    return Math.min(1.2, previous + Math.max(0, Math.min(deltaSeconds, .1)));
  }
  const canDock = distance => Number.isFinite(distance) && distance >= 0 && distance <= .12;
  global.ACInvestigationState = Object.freeze({ initial, restore, reduce, dwell, stages, canDock });
})(typeof window === 'undefined' ? globalThis : window);
