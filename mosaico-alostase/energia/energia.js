import { MEDIDAS_ENERGIA, PASSO_ENERGIA, ROTINAS_ENERGIA, TEMPOS_REFEICAO, simularDiaEnergia } from '../motor/energia.js';
import { desenharSerie, indiceNaSerie } from '../hidratacao/grafico.js?v=4';

const el = (id) => document.getElementById(id);
const numero = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 });
const hora = (indice) => {
  const min = indice * PASSO_ENERGIA;
  return `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`;
};
let curvas = [];
let marcadores = [];
for (const [id, { nome }] of Object.entries(MEDIDAS_ENERGIA)) el('medida').add(new Option(nome, id));

function desenhar() {
  const i = Number(el('tempo').value);
  const horario = hora(i);
  const { unidade } = MEDIDAS_ENERGIA[el('medida').value];
  el('hora').textContent = horario;
  el('tempo').setAttribute('aria-valuetext', horario);
  el('leitura').textContent = `Refeição única ${numero.format(curvas[0][i])} ${unidade} · Refeições repetidas ${numero.format(curvas[1][i])} ${unidade}.`;
  desenharSerie(el('curva'), curvas, curvas[0].length, i, hora, 1, marcadores);
}

function atualizar() {
  const medida = el('medida').value;
  const { nome, unidade, inferior, mediana, superior } = MEDIDAS_ENERGIA[medida];
  curvas = ['uma', el('rotina').value].map((rotina) => simularDiaEnergia(rotina, medida));
  marcadores = TEMPOS_REFEICAO.map((min, i) => ({
    indice: (ROTINAS_ENERGIA.uma[0] + min) / PASSO_ENERGIA, valor: mediana[i], serie: 0,
  }));
  el('unidade').textContent = `${nome} em ${unidade}.`;
  el('tabela-legenda').textContent = `${nome} · ${unidade}`;
  el('tabela-pontos').innerHTML = TEMPOS_REFEICAO.map((min, i) => `<tr>
    <th scope="row">${min === 0 ? 'Antes da refeição' : `${min} min`}</th>
    ${[inferior, mediana, superior].map((serie) => `<td>${numero.format(serie[i])}</td>`).join('')}
  </tr>`).join('');
  desenhar();
}

el('medida').addEventListener('change', atualizar);
el('rotina').addEventListener('change', atualizar);
el('tempo').addEventListener('input', desenhar);
el('curva').addEventListener('click', (e) => {
  el('tempo').value = indiceNaSerie(el('curva'), e.clientX, curvas[0].length);
  desenhar();
});
atualizar();
new ResizeObserver(desenhar).observe(el('curva'));
