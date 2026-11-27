import {
  ROTINAS, INICIO_MIN, JANELA_MIN, PASSO_MIN, conferirGlicemiaRotinas, curvaGlicemiaDia, simularGlicemiaRotina,
} from '../../motor/glicemia-rotinas.js';
import { relogio } from '../../motor/agenda.js?v=3';
import { desenharSerie, indiceNaSerie } from '../../hidratacao/grafico.js?v=4';

const el = (id) => document.getElementById(id);
const dec = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const sinal = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2, minimumFractionDigits: 2, signDisplay: 'exceptZero' });
const fmt = (v) => sinal.format(Math.abs(v) < 0.005 ? 0 : v);
const linha = (titulo, celulas) => `<tr><th scope="row">${titulo}</th>${celulas.map((c) => `<td>${c}</td>`).join('')}</tr>`;
const faixa = ([inicio, fim]) => `${relogio(INICIO_MIN + inicio)}–${relogio(INICIO_MIN + fim)}`;
const eixoHora = (i) => relogio(INICIO_MIN + i * PASSO_MIN);
const eixoDia = (i) => String(i + 1);
const estudos = conferirGlicemiaRotinas();
let resultados;
let curvas;

for (const controle of ['principal', 'referencia']) {
  for (const [id, r] of Object.entries(ROTINAS)) el(controle).add(new Option(r.nome, id));
}
el('principal').value = 'trabalhoNoite';
el('referencia').value = 'trabalhoDia';
el('porcao').value = '10';

function atualizar() {
  const dias = Number(el('horizonte').value);
  const sono = Number(el('sono').value);
  resultados = ['principal', 'referencia'].map((id, i) => simularGlicemiaRotina(
    el(id).value, dias, Number(el(i === 0 ? 'porcao' : 'porcao-ref').value), sono,
  ));
  const dia = Math.min(Number(el('dia').value), dias);
  el('dia').max = dias;
  el('dia').value = dia;
  el('resumo').textContent = resultados.map(({ nome, dias: dados }) =>
    `${nome} · ${dados.filter((d) => d.noturna).length} de ${dias} jornadas na madrugada`).join(' | ');
  selecionarDia();
}

function selecionarDia() {
  const i = Number(el('dia').value) - 1;
  const dias = resultados.map((r) => r.dias[i]);
  el('numero-dia').textContent = i + 1;
  el('comparacao').innerHTML = [
    linha('Atividade', dias.map((d) => d.atividade ? `${d.rotuloAtividade} · ${faixa(d.atividade)}` : d.rotuloAtividade)),
    linha('Janela de sono', dias.map((d) => faixa(d.sono))),
    linha('Pressão de sono às 06:30 (0 a 1)', dias.map((d) => dec.format(d.pressaoSonoNoCafe))),
    linha('Refeições (% da energia)', dias.map((d) => d.refeicoes.map((r) => `${relogio(r.hora)} · ${r.pct}%`).join('<br>'))),
    linha('Variação após o café', dias.map((d) => `${fmt(d.deltaCafe)} mmol/L × min`)),
    ...(dias.some((d) => d.deltaOgtt !== null) ? [
      linha('Variação aos 120 min do teste oral', dias.map((d) => d.deltaOgtt === null ? '—' : `${fmt(d.deltaOgtt)} mmol/L`)),
    ] : []),
  ].join('');
  curvas = resultados.map((r) => curvaGlicemiaDia(r, i));
  desenhar();
}

function desenhar() {
  const dia = Number(el('dia').value) - 1;
  const minuto = Number(el('tempo').value);
  const hora = eixoHora(minuto);
  el('hora').textContent = hora;
  el('tempo').setAttribute('aria-valuetext', hora);
  el('leitura').textContent = curvas.map((curva, i) => `${resultados[i].nome} · ${dec.format(curva[minuto])} mg/dL`).join(' | ');
  desenharSerie(el('evolucao'), resultados.map((r) => r.dias.map((d) => d.deltaCafe)),
    resultados[0].dias.length, dia, eixoDia, 2);
  desenharSerie(el('curva'), curvas, curvas[0].length, minuto, eixoHora, 0);
}

el('conferencia').innerHTML = [
  ['cafe', 'Tabela 3 · área de glicose após o café (mmol/L × min)'],
  ['ogtt', 'Tabela 2 · glicose aos 120 min do teste oral (mmol/L)'],
].map(([chave, titulo]) => `<table><caption>${titulo}</caption>
  <thead><tr><th scope="col">Às 00:30</th><th scope="col">Estudo (IC 95%)</th><th scope="col">Motor</th></tr></thead>
  <tbody>${estudos.map(({ porcao, calibrado, [chave]: dado }) =>
    linha(`${porcao}%`, [
      `${fmt(dado.media)}<small>${dec.format(dado.ic[0])} a ${dec.format(dado.ic[1])}</small>`,
      `${fmt(dado.modelo)}<small>${calibrado ? 'Calibração' : 'Conferência'}</small>`,
    ])).join('')}</tbody></table>`).join('');

for (const id of ['principal', 'referencia', 'porcao', 'porcao-ref', 'sono', 'horizonte']) {
  el(id).addEventListener('change', atualizar);
}
el('tempo').max = JANELA_MIN / PASSO_MIN;
el('tempo').addEventListener('input', desenhar);
el('dia').addEventListener('input', selecionarDia);
el('curva').addEventListener('click', (evt) => {
  el('tempo').value = indiceNaSerie(el('curva'), evt.clientX, curvas[0].length);
  desenhar();
});
el('evolucao').addEventListener('click', (evt) => {
  el('dia').value = 1 + indiceNaSerie(el('evolucao'), evt.clientX, resultados[0].dias.length);
  selecionarDia();
});
atualizar();
const observer = new ResizeObserver(desenhar);
observer.observe(el('curva'));
observer.observe(el('evolucao'));
