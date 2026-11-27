import { FLUXOS_EXERCICIO, simularFluxosExercicio } from '../../motor/glicose-exercicio.js';
import { desenharSerie, indiceNaSerie } from '../../hidratacao/grafico.js?v=4';

const el = (id) => document.getElementById(id);
const dec = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const sinal = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1, signDisplay: 'exceptZero' });
const fmtSinal = (v) => sinal.format(Math.abs(v) < 0.05 ? 0 : v);
const pontos = simularFluxosExercicio();
const curva = [pontos.map(({ entrada }) => entrada), pontos.map(({ retirada }) => retirada)];
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
}

el('tempo').max = pontos.length - 1;
el('tempo').addEventListener('input', desenhar);
el('curva').addEventListener('click', (e) => {
  el('tempo').value = indiceNaSerie(el('curva'), e.clientX, pontos.length);
  desenhar();
});
desenhar();
new ResizeObserver(desenhar).observe(el('curva'));
