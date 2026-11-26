import { simularProtocoloYang } from '../../motor/conferencia-yang.js';
import { desenharSerie, indiceNaSerie } from '../../hidratacao/grafico.js?v=4';

const dias = simularProtocoloYang();
const el = (id) => document.getElementById(id);
const decimal = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const fmt = (valor, unidade = '') => `${decimal.format(valor)} ${unidade}`.trim();
const hora = (min) => `${String(Math.floor(min / 60)).padStart(2, '0')}:00`;
const medidas = {
  quedaPad: ['Queda diastólica', '%'],
  quedaPas: ['Queda sistólica', '%'],
  padSono: ['Diastólica nas primeiras 4 h de sono', 'mmHg'],
  padVigilia: ['Diastólica em vigília, 11h–23h', 'mmHg'],
  pasSono: ['Sistólica nas primeiras 4 h de sono', 'mmHg'],
  pad20: ['Diastólica média de 20 h', 'mmHg'],
  pas20: ['Sistólica média de 20 h', 'mmHg'],
  pad24: ['Diastólica média de 24 h', 'mmHg'],
  pas24: ['Sistólica média de 24 h', 'mmHg'],
};
const linha = (rotulo, valores) => `<tr><th scope="row">${rotulo}</th>${valores.map((v) => `<td>${v}</td>`).join('')}</tr>`;

for (const [campo, [rotulo]] of Object.entries(medidas)) el('metrica').add(new Option(rotulo, campo));
function atualizar() {
  const dia = Number(el('dia').value);
  const ponto = dias[dia - 1];
  const campo = el('metrica').value;
  const bloco = ponto.bloco === null ? '' : ` · Bloco ${ponto.bloco}`;
  el('dia-rotulo').textContent = dia;
  el('dia').setAttribute('aria-valuetext', `Dia ${dia}, ${ponto.fase}${bloco}`);
  el('janela').textContent = `${ponto.fase}${bloco} · Janela ${ponto.sono.map(hora).join('–')}`;
  el('leitura').innerHTML = Object.entries(medidas).map(([c, [rotulo, u]]) =>
    linha(rotulo, [fmt(ponto.controle[c], u), fmt(ponto[c], u)])).join('');
  desenharSerie(el('curva'), [dias.map((p) => p.controle[campo]), dias.map((p) => p[campo])],
    dias.length, dia - 1, (i) => `Dia ${i + 1}`, 1);
}

const basal = dias[2];
const curtas = dias.filter((d) => d.curta);
const ultima = dias.at(-1);
el('conferencia').innerHTML = [
  linha('Sono nas noites curtas', ['223 a 227 min nas médias dos quatro blocos por polissonografia.', '240 min de sono programado em cada noite curta.']),
  linha('Queda diastólica nos quatro blocos', ['Atenuada nos quatro blocos (p < 0,05 em cada comparação com o basal).',
    `De ${fmt(basal.quedaPad, '%')} no basal para ${fmt(curtas[0].quedaPad, '%')} nos quatro blocos.`]),
  linha('Sistólica média de 20 h', ['Aumento significativo no primeiro bloco e queda abaixo do basal na recuperação final.',
    `Variação de +${fmt(curtas[0].pas20 - basal.pas20, 'mmHg')} no primeiro bloco e +${fmt(ultima.pas20 - basal.pas20, 'mmHg')} ao fim da recuperação.`]),
  linha('Diastólica média de 20 h', ['Aumento significativo nos blocos 1, 2 e 4.',
    `Variação de +${fmt(curtas[0].pad20 - basal.pad20, 'mmHg')} em todas as noites curtas.`]),
].join('');

el('dia').addEventListener('input', atualizar);
el('metrica').addEventListener('change', atualizar);
el('curva').addEventListener('click', (evt) => {
  el('dia').value = indiceNaSerie(el('curva'), evt.clientX, dias.length) + 1;
  atualizar();
});
atualizar();
new ResizeObserver(atualizar).observe(el('curva'));
