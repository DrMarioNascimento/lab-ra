import { PROTOCOLOS_RESPOSTA, curvaResposta } from '../motor/respostas.js';
import { desenharSerie, indiceNaSerie } from '../hidratacao/grafico.js?v=4';

const el = (id) => document.getElementById(id);
const fmt = (n) => n.toLocaleString('pt-BR', { maximumFractionDigits: 2 });
const texto = {
  treino: {
    descricao: 'O gráfico mostra quanto a frequência cardíaca diminuiu em relação ao fim do esforço em 24 mulheres saudáveis de 20 a 30 anos, após teste máximo em cicloergômetro semirreclinado.',
    legenda: 'Tempo após o fim do exercício. Os círculos são médias publicadas e a linha interpola entre os pontos.',
    caption: 'Queda da frequência cardíaca (média ± DP, bpm)',
    interpretacao: 'A recuperação nos primeiros minutos descreve a queda da frequência cardíaca. Para acompanhar aptidão e fadiga entre sessões, abra os indicadores de treino nas Trajetórias fisiológicas.',
    fonte: ['Estudo de recuperação cardíaca · Tabela 2', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5363517/'],
  },
  estresse: {
    descricao: 'No teste de estresse social de Trier, os participantes prepararam e fizeram uma apresentação avaliada e depois resolveram cálculos mentais. O protocolo durou 15 min e ocorreu à tarde.',
    legenda: 'O minuto 0 marca o fim da tarefa. A linha tracejada mantém o basal como referência didática. Os círculos foram lidos aproximadamente da Figura 2.',
    caption: 'Cortisol salivar (médias aproximadas, nmol/L)',
    interpretacao: 'A maior média foi registrada aos 20 min após a tarefa. Aos 60 min, os autores não detectaram diferença estatística em relação ao basal. O protocolo avaliou os mesmos participantes antes e depois da tarefa, e a linha basal do gráfico é uma comparação didática.',
    fonte: ['Liu e colegas, 2021 · Figura 2', 'https://doi.org/10.3389/fpsyg.2021.683914'],
  },
};

let pontos, series, marcadores, unidade;
const hora = (i) => `${fmt(pontos[i].min)} min`;

function desenhar() {
  const i = Number(el('tempo').value);
  el('hora').textContent = hora(i);
  el('tempo').setAttribute('aria-valuetext', hora(i));
  el('leitura').textContent = `${fmt(pontos[i].valor)} ${unidade} na curva do protocolo.`;
  desenharSerie(el('curva'), series, pontos.length, i, hora, 1, marcadores);
}

function atualizar() {
  const id = el('protocolo').value;
  const protocolo = PROTOCOLOS_RESPOSTA[id];
  const t = texto[id];
  pontos = curvaResposta(id);
  unidade = protocolo.unidade;
  series = [pontos.map(({ valor }) => valor)];
  if (id === 'estresse') series.push(pontos.map(() => pontos[0].valor));
  marcadores = protocolo.pontos.filter(([min]) => id !== 'treino' || min > 0).map(([min, valor]) =>
    ({ indice: pontos.findIndex((p) => p.min === min), valor, serie: 0 }));
  el('titulo').textContent = protocolo.titulo;
  for (const campo of ['descricao', 'legenda', 'caption', 'interpretacao']) el(campo).textContent = t[campo];
  el('fonte').textContent = t.fonte[0];
  el('fonte').href = t.fonte[1];
  el('referencias').innerHTML = protocolo.pontos.map(([min, valor, dp]) =>
    `<tr><th scope="row">${fmt(min)} min</th><td>${fmt(valor)}${dp === undefined ? '' : ` ± ${fmt(dp)}`}${id === 'treino' && min === 0 ? ' · origem da diferença' : ''}</td></tr>`).join('');
  el('tempo').max = pontos.length - 1;
  el('tempo').value = pontos.findIndex((p) => p.min === (id === 'treino' ? 1 : 20));
  desenhar();
}
if (new URLSearchParams(location.search).get('protocolo') === 'estresse') el('protocolo').value = 'estresse';
el('tempo').addEventListener('input', desenhar);
el('protocolo').addEventListener('change', atualizar);
el('curva').addEventListener('click', (e) => {
  el('tempo').value = indiceNaSerie(el('curva'), e.clientX, pontos.length);
  desenhar();
});
atualizar();
new ResizeObserver(desenhar).observe(el('curva'));
