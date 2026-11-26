import { COORTES_MCHILL, contrasteMaximoMcHill, simularConferenciaMcHill, VISITAS_MCHILL } from '../../motor/conferencia-mchill.js';
import { desenharSerie, indiceNaSerie } from '../../hidratacao/grafico.js?v=4';

const el = (id) => document.getElementById(id);
const chaves = Object.keys(COORTES_MCHILL);
const decimal = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const comSinal = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1, signDisplay: 'exceptZero' });
const fmt = (x, unidade = '%') => `${decimal.format(x)} ${unidade}`;
const diff = (x) => `${comSinal.format(Math.abs(x) < 0.05 ? 0 : x)} p.p.`;
const horario = (min) => `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`;
const linha = (rotulo, valores) => `<tr><th scope="row">${rotulo}</th>${valores.map((valor) => `<td>${valor}</td>`).join('')}</tr>`;
const nomeDia = (d) => d === 0 ? 'Início' : `Dia ${d}`;
const marcadores = chaves.flatMap((coorte, serie) => VISITAS_MCHILL.map((v) => ({
  indice: v.dia, valor: v[coorte].queda, serie,
})));

let series;
const cache = new Map();

function desenhar() {
  const dia = Number(el('dia').value);
  const valores = chaves.map((coorte) => series[coorte].map(({ quedaPasPct }) => quedaPasPct));
  desenharSerie(el('curva'), valores, valores[0].length, dia, nomeDia, 1, marcadores);
}

function atualizarDia() {
  const dia = Number(el('dia').value);
  const rotulo = nomeDia(dia);
  el('dia-rotulo').textContent = rotulo;
  el('dia').setAttribute('aria-valuetext', rotulo);
  const pontos = chaves.map((coorte) => series[coorte][dia]);
  el('dia-leitura').innerHTML = linha('Queda sistólica no sono', pontos.map((p) => fmt(p.quedaPasPct)))
    + linha('Janela de sono', pontos.map((p) => `${horario(p.inicio)}–${horario(p.fim)}`))
    + linha('Variação no início do sono', pontos.map((p) => fmt(p.variabilidadeH, 'h')))
    + linha('Fase estimada', pontos.map((p) => fmt(p.faseH, 'h')))
    + linha('Carga persistente do modelo', pontos.map((p) => fmt(p.cargaSono * 100)));
  desenhar();
}

function atualizarTabela() {
  const chave = el('grupo').value;
  el('comparacao').innerHTML = VISITAS_MCHILL.map((v) => {
    const { quedaPasPct } = series[chave][v.dia];
    const publicado = v[chave];
    const leitura = publicado.ic95
      ? `${fmt(publicado.queda)}<small>IC 95% ${fmt(publicado.ic95[0])}–${fmt(publicado.ic95[1])}</small>`
      : `≈ ${fmt(publicado.queda)}`;
    return linha(nomeDia(v.dia), [leitura, fmt(quedaPasPct), diff(quedaPasPct - publicado.queda)]);
  }).join('');

  const final = VISITAS_MCHILL.at(-1);
  const estudo = final.diurna.queda - final.matinal.queda;
  const motor = series.diurna[final.dia].quedaPasPct - series.matinal[final.dia].quedaPasPct;
  const limite = contrasteMaximoMcHill(series.diurna[final.dia], series.matinal[final.dia]);
  el('limite').textContent = `Com as mesmas janelas de sono e a fase selecionada, o maior contraste permitido pelo termo persistente é de ${fmt(limite, 'p.p.')}. O teste usa carga zero na jornada diurna e carga máxima na jornada cedo.`;
  el('resultado').textContent = `Aos 90 dias, a diferença de queda sistólica entre a jornada diurna e a jornada cedo foi de ${fmt(estudo, 'p.p.')} no estudo e de ${fmt(motor, 'p.p.')} no motor.`;
}

function recalcular() {
  const fase = el('fase').value;
  if (!cache.has(fase)) {
    cache.set(fase, Object.fromEntries(chaves.map((coorte) => [coorte, simularConferenciaMcHill(coorte, {
      faseParcial: fase === 'parcial',
    })])));
  }
  series = cache.get(fase);
  atualizarDia();
  atualizarTabela();
}

el('fase').addEventListener('change', recalcular);
el('grupo').addEventListener('change', atualizarTabela);
el('dia').addEventListener('input', atualizarDia);
el('curva').addEventListener('click', (evento) => {
  el('dia').value = indiceNaSerie(el('curva'), evento.clientX, series.diurna.length);
  atualizarDia();
});
recalcular();
new ResizeObserver(desenhar).observe(el('curva'));
