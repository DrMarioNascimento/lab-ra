import { CONDICOES_REFEICAO, simularRefeicoesPlantao } from '../../motor/refeicoes-plantao.js';
import { desenharSerie, indiceNaSerie } from '../../hidratacao/grafico.js?v=4';

const el = (id) => document.getElementById(id);
const dec = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const sinal = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2, signDisplay: 'exceptZero' });
const fmt = (x) => sinal.format(Math.abs(x) < 0.005 ? 0 : x);
const hora = (min) => `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`;
const linha = (rotulo, celulas) => `<tr><th scope="row">${rotulo}</th>${celulas.map((c) => `<td>${c}</td>`).join('')}</tr>`;
const resultados = Object.fromEntries(Object.keys(CONDICOES_REFEICAO).map((id) => [id, simularRefeicoesPlantao(id)]));
for (const controle of ['condicao', 'comparar']) {
  for (const [id, c] of Object.entries(CONDICOES_REFEICAO)) el(controle).add(new Option(c.nome, id));
}
el('condicao').value = 'refeicao';

function desenhar() {
  const r = resultados[el('condicao').value];
  const teste = el('modo').value === 'teste';
  const dados = teste ? r.teste : r.plantao;
  const indice = Number(el('tempo').value);
  const comparacao = resultados[el('comparar').value][teste ? 'teste' : 'plantao'];
  const eixo = teste ? (i) => `${i} min` : (i) => hora(dados[i].min);
  el('hora').textContent = eixo(indice);
  el('tempo').setAttribute('aria-valuetext', eixo(indice));
  const leitura = [dados[indice], comparacao[indice]].map((p) => teste
    ? `${fmt(p.delta)} mmol/L (${fmt(p.deltaMgDl)} mg/dL)` : `${dec.format(p.glicemia)} mg/dL`);
  el('leitura').textContent = `Rotina principal ${leitura[0]} · comparação ${leitura[1]}.`;
  desenharSerie(el('curva'), [dados, comparacao].map((serie) => serie.map((x) => teste ? x.delta : x.glicemia)),
    dados.length, indice, eixo, teste ? 1 : 0);
}

function atualizar() {
  const r = resultados[el('condicao').value];
  const teste = el('modo').value === 'teste';
  el('tempo').max = teste ? 150 : 1440;
  el('tempo').value = teste ? 120 : 450;
  el('unidade').textContent = teste ? 'Diferença simulada em relação ao teste basal (mmol/L).' : 'Glicemia durante um ciclo de 24 horas do plantão (mg/dL).';
  el('refeicoes').innerHTML = r.refeicoes.map((p) => linha(hora(p.min), [`${p.energiaPct}%`, `${p.carboG} g`])).join('');
  desenhar();
}

el('conferencia').innerHTML = Object.entries(resultados).map(([id, r]) => {
  const c = r.condicao;
  return linha(`${r.energiaMadrugadaPct}% da energia${id === 'refeicao' ? ' †' : ''}`,
    [`${fmt(c.observado)}<small>${dec.format(c.ic[0])} a ${dec.format(c.ic[1])}</small>`, fmt(r.delta120), fmt(r.delta120 - c.observado)]);
}).join('');
el('tempo').addEventListener('input', desenhar);
el('condicao').addEventListener('change', atualizar);
el('comparar').addEventListener('change', desenhar);
el('modo').addEventListener('change', atualizar);
el('curva').addEventListener('click', (evt) => {
  el('tempo').value = indiceNaSerie(el('curva'), evt.clientX, Number(el('tempo').max) + 1);
  desenhar();
});
atualizar();
new ResizeObserver(desenhar).observe(el('curva'));
