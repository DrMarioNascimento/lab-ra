import { REFERENCIAS_CORRIDA, simularProtocoloCorrida } from '../../motor/protocolo-termico.js';
import { desenharSerie } from '../../hidratacao/grafico.js?v=3';

const el = (id) => document.getElementById(id);
const numero = (x, sinal = false) => x.toLocaleString('pt-BR', {
  minimumFractionDigits: 1, maximumFractionDigits: 1, signDisplay: sinal ? 'exceptZero' : 'auto',
});
const resultados = REFERENCIAS_CORRIDA.map((ref) => ({
  ref, sim: simularProtocoloCorrida(ref.umidade),
}));
for (const { ref } of resultados) el('umidade').add(new Option(`${ref.umidade}%`, ref.umidade));

function renderizarTabela() {
  const trecho = Number(el('trecho').value);
  el('comparacao').innerHTML = resultados.map(({ ref, sim }) => {
    const ajuste = trecho === 0 && [23, 71].includes(ref.umidade);
    const celula = (chave) => {
      const observado = ref[chave][trecho], simulado = sim.intervalos[trecho][chave];
      return `<td><span class="referencia">Estudo ${numero(observado)}</span><br>Motor <strong>${numero(simulado)}</strong>
        <br>Diferença ${numero(simulado - observado, true)}</td>`;
    };
    return `<tr><th scope="row">${ref.umidade}%${ajuste ? ' †' : ''}</th>${celula('calor')}${celula('suor')}</tr>`;
  }).join('');
}

function renderizarCurva() {
  const { ref, sim } = resultados.find((r) => r.ref.umidade === Number(el('umidade').value));
  desenharSerie(el('curva'), [sim.pontos.map((p) => p.centralC)], sim.pontos.length,
    sim.pontos.length - 1, (i) => `${sim.pontos[i].min} min`, 1);
  const observado = Number.isFinite(ref.deltaRetalC)
    ? `No estudo, a temperatura retal subiu ${numero(ref.deltaRetalC, true)} °C.`
    : 'A publicação apresenta a curva dessa umidade sem informar no texto a elevação retal em valor numérico.';
  el('desfecho').textContent = `O motor estima ${numero(sim.pontos.at(-1).centralC)} °C aos 60 min (${numero(sim.deltaCentralC, true)} °C). ${observado}`;
}

el('trecho').addEventListener('change', renderizarTabela);
el('umidade').addEventListener('change', renderizarCurva);
renderizarTabela();
renderizarCurva();
new ResizeObserver(renderizarCurva).observe(el('curva'));
