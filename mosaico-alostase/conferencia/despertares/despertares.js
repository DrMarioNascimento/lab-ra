import { CONDICOES_CARRINGTON, simularCarrington } from '../../motor/conferencia-carrington.js';
import { desenharSerie, indiceNaSerie } from '../../hidratacao/grafico.js?v=4';

const el = (id) => document.getElementById(id);
const fmt = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const sinal = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1, signDisplay: 'exceptZero' });
const tempo = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
const resultados = Object.fromEntries(Object.keys(CONDICOES_CARRINGTON).map((id) => [id, simularCarrington(id)]));
for (const [id, { nome }] of Object.entries(CONDICOES_CARRINGTON)) el('condicao').add(new Option(nome, id));
el('condicao').value = 's30';

function exibir() {
  const { pontos, sisEstavel } = resultados[el('condicao').value];
  const indice = Number(el('tempo').value);
  const p = pontos[indice];
  const t = tempo(p.s);
  el('tempo-rotulo').textContent = t;
  el('tempo').setAttribute('aria-valuetext', t);
  el('leitura').textContent = `Sistólica ${fmt.format(p.sis)} mmHg · ${p.emAtivacao ? 'Durante o pulso' : 'Fora do pulso'}`;
  desenharSerie(el('curva'), [pontos.map(() => sisEstavel), pontos.map((v) => v.sis)], pontos.length, indice, tempo, 0);
}

el('comparacao').innerHTML = Object.values(resultados).map(({ condicao, acrescimoPct }) => {
  const { nome, observado } = condicao;
  const diferenca = acrescimoPct - observado;
  return `<tr><th scope="row">${nome}</th><td>${observado ? '≈ ' : ''}${fmt.format(observado)} p.p.</td>
    <td>${fmt.format(acrescimoPct)} p.p.</td><td>${sinal.format(Math.abs(diferenca) < 0.05 ? 0 : diferenca)} p.p.</td></tr>`;
}).join('');
el('tempo').addEventListener('input', exibir);
el('condicao').addEventListener('change', exibir);
el('curva').addEventListener('click', (evt) => {
  el('tempo').value = indiceNaSerie(el('curva'), evt.clientX, resultados[el('condicao').value].pontos.length);
  exibir();
});
exibir();
new ResizeObserver(exibir).observe(el('curva'));
