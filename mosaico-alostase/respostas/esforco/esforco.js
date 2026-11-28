import { cortisolBase, efeitoExercicioCortisol } from '../../motor/motor.js';
import { desenharSerie, indiceNaSerie } from '../../hidratacao/grafico.js?v=4';
import { relogio } from '../../motor/agenda.js?v=3';

const el = (id) => document.getElementById(id);
const fmt = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 2 });
const percentual = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1, signDisplay: 'exceptZero' });
const hill = [[0, -6.6, 3.5], [40, 5.7, 11], [60, 39.9, 11.8], [80, 83.1, 18.5]];
const duracao = 30;
let curvas, inicio;

function desenhar() {
  const min = Number(el('tempo').value);
  const [com, repouso] = curvas.map((serie) => serie[min]);
  const agora = `${min} min · ${relogio(inicio * 60 + min)}`;
  el('hora').textContent = agora;
  el('tempo').setAttribute('aria-valuetext', agora);
  el('leitura').textContent = `Com exercício ${fmt.format(com)} µg/dL · repouso ${fmt.format(repouso)} µg/dL · acréscimo do esforço ${fmt.format(com - repouso)} µg/dL.`;
  desenharSerie(el('curva'), curvas, curvas[0].length, min, (i) => `${i} min`, 1);
}

function atualizar() {
  inicio = Number(el('inicio').value);
  const vo2 = Number(el('intensidade').value);
  const fim = inicio + duracao / 60;
  const repouso = Array.from({ length: Number(el('tempo').max) + 1 }, (_, i) => cortisolBase(inicio + i / 60));
  curvas = [repouso.map((base, i) => base + efeitoExercicioCortisol({ inicio, fim, vo2 }, i)), repouso];
  el('conferencia').innerHTML = hill.map(([intensidade, media, dp]) => {
    const fimMotor = repouso[duracao] + (intensidade ? efeitoExercicioCortisol({ inicio, fim, vo2: intensidade }, duracao) : 0);
    const delta = 100 * (fimMotor / repouso[0] - 1);
    return `<tr><th scope="row">${intensidade ? `${intensidade}% VO₂máx` : 'Repouso'}</th>
      <td>${percentual.format(media)}% ± ${fmt.format(dp)} p.p.</td><td>${percentual.format(delta)}%</td></tr>`;
  }).join('');
  desenhar();
}

el('tempo').addEventListener('input', desenhar);
for (const id of ['inicio', 'intensidade']) el(id).addEventListener('change', atualizar);
el('curva').addEventListener('click', (e) => {
  el('tempo').value = indiceNaSerie(el('curva'), e.clientX, curvas[0].length);
  desenhar();
});
atualizar();
new ResizeObserver(desenhar).observe(el('curva'));
