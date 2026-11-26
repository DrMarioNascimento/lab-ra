import { MEIAS_VIDAS_RECUPERACAO, METRICAS_RESTRICAO, REFERENCIAS_RESTRICAO, simularRestricaoSono } from '../../motor/restricao-sono.js';
import { desenharSerie, indiceNaSerie } from '../../hidratacao/grafico.js?v=4';

const el = (id) => document.getElementById(id);
const medida = () => el('metrica').value;
const dia = () => Number(el('dia').value);
const numero = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1, signDisplay: 'exceptZero' });
const fmt = (x) => `${numero.format(Math.abs(x) < 0.05 ? 0 : x)} mmHg`;
const hora = (m) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
const linha = (nome, dados) => `<tr><th scope="row">${nome}</th>${dados.map((x) => `<td>${x}</td>`).join('')}</tr>`;
const series = new Map();
let pontos;

for (const [id, label] of Object.entries(METRICAS_RESTRICAO)) el('metrica').add(new Option(label, id));

function curva() {
  const chave = medida();
  const dados = ['agenda', 'comEfeito'].map((modo) => pontos.map((p) => p[modo][chave]));
  const marcadores = REFERENCIAS_RESTRICAO[chave].map((p) => ({ indice: p.dia - 1, valor: p.valor, serie: 1 }));
  desenharSerie(el('curva'), dados, pontos.length, dia() - 1, (i) => `Dia ${i + 1}`, 1, marcadores);
}

function atualizarDia() {
  const d = dia();
  const p = pontos[d - 1], chave = medida();
  el('dia-rotulo').textContent = d;
  el('dia').setAttribute('aria-valuetext', `Dia ${d} · ${p.fase}`);
  el('leitura').innerHTML = linha('Fase do protocolo', [p.fase])
    + linha('Janela programada no cenário de restrição', [p.janela.map(hora).join('–')])
    + linha('Só horários', [fmt(p.agenda[chave])])
    + linha('Com efeito acumulado', [fmt(p.comEfeito[chave])]);
  curva();
}

function tabela() {
  const chave = medida();
  const refs = REFERENCIAS_RESTRICAO[chave];
  el('medida').textContent = METRICAS_RESTRICAO[chave];
  el('tabela').hidden = refs.length === 0;
  el('comparacao').innerHTML = refs.map(({ dia: d, valor, ic, ajuste }) => {
    const p = pontos[d - 1];
    return linha(`${d}${ajuste ? ' †' : ''}`, [
      `${fmt(valor)}<small>${fmt(ic[0])} a ${fmt(ic[1])}</small>`, fmt(p.agenda[chave]), fmt(p.comEfeito[chave]),
    ]);
  }).join('');
  const criterio = {
    pas24h: 'Os quatro valores de 24 horas ficaram reservados para conferência.',
    pasSono: '† O ponto do dia 12 foi usado no ajuste. O dia 15 confere a resposta na recuperação.',
    pasVigilia: 'O estudo não detectou diferença de pressão entre as condições na vigília comparável das 07:00 às 22:00.',
  };
  el('criterio').textContent = criterio[chave];
}

function recalcular() {
  const meiaVidaRecuperacao = Number(el('meia-vida').value);
  if (!MEIAS_VIDAS_RECUPERACAO.includes(meiaVidaRecuperacao)) return;
  if (!series.has(meiaVidaRecuperacao)) series.set(meiaVidaRecuperacao, simularRestricaoSono({ meiaVidaRecuperacao }));
  pontos = series.get(meiaVidaRecuperacao);
  atualizarDia();
  tabela();
}

el('meia-vida').addEventListener('change', recalcular);
el('metrica').addEventListener('change', recalcular);
el('dia').addEventListener('input', atualizarDia);
el('curva').addEventListener('click', (evt) => {
  el('dia').value = indiceNaSerie(el('curva'), evt.clientX, pontos.length) + 1;
  atualizarDia();
});
recalcular();
new ResizeObserver(curva).observe(el('curva'));
