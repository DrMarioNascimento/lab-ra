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

// Centofanti et al., Tabela 3. Diferença entre o quarto e o primeiro plantão.
const medidasCafe = {
  isi: {
    titulo: 'Índice de sensibilidade à insulina',
    unidade: 'unidades arbitrárias',
    dados: [[-9.9, -15.3, -4.6], [-8.5, -14.9, -2.2], [-7.4, -13.5, -1.3]],
    leitura: 'O índice de sensibilidade diminuiu nos três grupos. O estudo identificou um efeito do dia (p < 0,001).',
  },
  insulina: {
    titulo: 'Área sob a curva de insulina',
    unidade: 'pmol/L × min',
    dados: [[109.0, -2.8, 220.2], [20.1, -111.1, 151.4], [116.0, -10.4, 242.4]],
    leitura: 'A análise identificou um aumento geral entre os dias (p = 0,025). Os três intervalos de confiança por grupo incluem zero. A insulina circulante depende da secreção e da remoção da insulina pelo organismo.',
  },
  glicose: {
    titulo: 'Área sob a curva de glicose',
    unidade: 'mmol/L × min',
    dados: estudos.map(({ cafe }) => [cafe.media, ...cafe.ic]),
    casas: 2,
    leitura: 'A resposta glicêmica ao café aumentou nos três grupos. As comparações pós-hoc entre grupos para essa mudança ficaram sem diferença estatisticamente significativa.',
  },
  igi: {
    titulo: 'Índice insulinogênico',
    unidade: 'unidades arbitrárias',
    dados: [[-4.3, -20.9, 12.3], [-17.7, -37.3, 1.8], [-4.9, -24.0, 14.3]],
    leitura: 'O índice estima a resposta inicial de insulina à elevação da glicose. Os três intervalos de confiança para a mudança entre os dias incluem zero.',
  },
  di: {
    titulo: 'Índice de disposição',
    unidade: 'unidades arbitrárias',
    dados: [[-671, -1584, 242], [-1191, -2266, 117], [-588, -1643, 467]],
    casas: 0,
    leitura: 'O índice relaciona a resposta de insulina à sensibilidade à insulina. Os três intervalos de confiança por grupo para a mudança entre os dias incluem zero.',
  },
};

function mostrarMedidasCafe() {
  const { titulo, unidade, dados, casas = 1, leitura } = medidasCafe[el('medida-insulina').value];
  const formato = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: casas, maximumFractionDigits: casas });
  const estimativa = (n) => `${n > 0 ? '+' : ''}${formato.format(n)}`;
  el('legenda-insulina').textContent = `${titulo} · ${unidade}`;
  el('dados-insulina').innerHTML = estudos.map(({ porcao }, i) => {
    const [media, minimo, maximo] = dados[i];
    return linha(`${porcao}% da energia`, [
      `<strong>${estimativa(media)}</strong><small>${formato.format(minimo)} a ${formato.format(maximo)}</small>`,
    ]);
  }).join('');
  el('leitura-insulina').textContent = leitura;
}

el('medida-insulina').addEventListener('change', mostrarMedidasCafe);
mostrarMedidasCafe();

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
