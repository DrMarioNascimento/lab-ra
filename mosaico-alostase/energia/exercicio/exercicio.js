import { FLUXOS_EXERCICIO, GLICEMIA_EXERCICIO_OBSERVADA, reconstruirGlicemiaExercicio, simularFluxosExercicio } from '../../motor/glicose-exercicio.js?v=2';
import { desenharSerie, indiceNaSerie } from '../../hidratacao/grafico.js?v=4';

const el = (id) => document.getElementById(id);
const dec = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const sinal = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1, signDisplay: 'exceptZero' });
const fmtSinal = (v) => sinal.format(Math.abs(v) < 0.05 ? 0 : v);
const pontos = simularFluxosExercicio();
const curva = [pontos.map(({ entrada }) => entrada), pontos.map(({ retirada }) => retirada)];
const glicemia = reconstruirGlicemiaExercicio(pontos);
const curvaGlicemia = glicemia.map((p) => p.mmolL);
const glic = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const marcadores = GLICEMIA_EXERCICIO_OBSERVADA.filter(({ minuto }) => minuto <= pontos.at(-1).minuto)
  .map(({ minuto, mmolL }) => ({ indice: minuto - pontos[0].minuto, valor: mmolL, serie: 0 }));
el('comparacao-glicemia').innerHTML = GLICEMIA_EXERCICIO_OBSERVADA.map(({ minuto, mmolL, ep }) => {
  const estimativa = glicemia[minuto - pontos[0].minuto];
  const leitura = estimativa ? glic.format(estimativa.mmolL) : 'Fora da janela';
  return `<tr><th scope="row">${minuto} min</th><td>${dec.format(mmolL)} ± ${dec.format(ep)}</td><td>${leitura}${minuto === pontos[0].minuto ? ' · valor inicial' : ''}</td></tr>`;
}).join('');
const [inicial, observacao] = GLICEMIA_EXERCICIO_OBSERVADA;
const quedaObservada = inicial.mmolL - observacao.mmolL;
const quedaReconstruida = -glicemia[observacao.minuto - inicial.minuto].deltaMmolL;
el('ajuste-glicemia').textContent = `Aos ${observacao.minuto} min, a queda medida foi de ${glic.format(quedaObservada)} mmol/L. O cálculo reproduz ${glic.format(quedaReconstruida)} mmol/L dessa queda.`;

const hora = (i) => `${pontos[i].minuto} min`;
const rotulos = {
  refeicao: 'Glicose que chega da refeição', endogena: 'Produção endógena', entrada: 'Entrada total',
  retirada: 'Retirada pelos tecidos', saldo: 'Saldo instantâneo',
};
const series = Object.values(FLUXOS_EXERCICIO);
const momentos = [...new Set(series.flatMap((serie) => serie.map(([min]) => min)))].sort((a, b) => a - b);
el('referencias').innerHTML = momentos.map((min) => `<tr><th scope="row">${min} min</th>${series.map((serie) => {
  const ponto = serie.find(([tempo]) => tempo === min);
  return `<td>${ponto ? `${dec.format(ponto[1])} ± ${dec.format(ponto[2])}` : '—'}</td>`;
}).join('')}</tr>`).join('');

function desenhar() {
  const i = Number(el('tempo').value);
  const ponto = pontos[i];
  el('hora').textContent = hora(i);
  el('tempo').setAttribute('aria-valuetext', hora(i));
  el('balanco').innerHTML = Object.entries(rotulos).map(([chave, rotulo]) =>
    `<tr><th scope="row">${rotulo}</th><td>${chave === 'saldo' ? fmtSinal(ponto[chave]) : dec.format(ponto[chave])}</td></tr>`).join('');
  el('acumulado').textContent = `Saldo acumulado desde o início do exercício de ${fmtSinal(ponto.acumulado)} µmol/kg.`;
  desenharSerie(el('curva'), curva, pontos.length, i, hora, 1);
  el('leitura-glicemia').textContent = `Glicemia estimada de ${glic.format(glicemia[i].mmolL)} mmol/L aos ${ponto.minuto} min.`;
  desenharSerie(el('curva-glicemia'), [curvaGlicemia], pontos.length, i, hora, 1, marcadores);
}

el('tempo').max = pontos.length - 1;
el('tempo').addEventListener('input', desenhar);
for (const id of ['curva', 'curva-glicemia']) {
  el(id).addEventListener('click', (e) => {
    el('tempo').value = indiceNaSerie(el(id), e.clientX, pontos.length);
    desenhar();
  });
}
desenhar();
const observer = new ResizeObserver(desenhar);
observer.observe(el('curva'));
observer.observe(el('curva-glicemia'));
