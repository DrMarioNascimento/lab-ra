import { ESCALAS_CALOR, horaCivilDaEscala, simularEscalaCalor, PASSO_LEITURA_MIN } from '../../motor/escala-calor.js?v=2';
import { conferirEscalaComMorris, conferirEscalaComShafer } from '../../motor/conferencia-escala.js?v=2';
import { desenharSerie, indiceNaSerie } from '../../hidratacao/grafico.js?v=3';

const el = (id) => document.getElementById(id);
const diaria = [
  ['pas24h', 'Pressão sistólica média em 24 h', 'mmHg', 1],
  ['pad24h', 'Pressão diastólica média em 24 h', 'mmHg', 1],
  ['quedaPasPct', 'Queda sistólica durante o sono', '%', 1],
  ['osmInicial', 'Osmolalidade às 08:00', 'mOsm/kg', 1],
  ['indiceAclima', 'Aclimatação cardiovascular', '%', 0],
  ['indiceSuorAclima', 'Aclimatação da sudorese', '%', 0],
  ['cargaSono', 'Carga persistente de desalinhamento', '%', 0],
  ['faseH', 'Atraso do relógio biológico', 'h', 1],
  ['sonoForaDaFaseH', 'Sono fora da noite biológica', 'h', 1],
  ['dividaSono7dH', 'Dívida de sono em sete dias', 'h', 1],
  ['vigiliaMaxH', 'Maior vigília contínua no dia', 'h', 1],
  ['picoTemperaturaC', 'Pico de temperatura central', '°C', 2],
  ['suorL', 'Suor acumulado no dia', 'L', 2],
];
const horaria = [
  ['sis', 'Pressão sistólica', 'mmHg', 1],
  ['dia', 'Pressão diastólica', 'mmHg', 1],
  ['fc', 'Frequência cardíaca', 'bpm', 1],
  ['osmolalidade', 'Osmolalidade plasmática', 'mOsm/kg', 1],
  ['plasmaL', 'Volume plasmático', 'L', 2],
  ['centralC', 'Temperatura central', '°C', 2],
  ['pressaoSono', 'Pressão de sono (0 a 1)', '', 2],
  ['renina', 'Índice de renina (basal 100)', '', 0],
];
const numero = (x, casas = 1, sinal = false) => (Math.abs(x) < 0.5 * 10 ** (-casas) ? 0 : x).toLocaleString('pt-BR', {
  minimumFractionDigits: casas, maximumFractionDigits: casas, signDisplay: sinal ? 'exceptZero' : 'auto',
});
const medicao = (v, unidade, casas = 1) => v === null ? '—' : `${numero(v, casas)} ${unidade}`.trim();
const linha = (rotulo, valores) => `<tr><th scope="row">${rotulo}</th>${valores.map((x) => `<td>${x}</td>`).join('')}</tr>`;
const serieLinhas = (lista, pontos) => lista.map(([chave, nome, unidade, casas]) =>
  linha(nome, pontos.map((p) => medicao(p[chave], unidade, casas)))).join('');
const horario = (min) => {
  const civil = horaCivilDaEscala(min);
  return `${String(Math.floor(civil / 60)).padStart(2, '0')}:${String(civil % 60).padStart(2, '0')}`;
};

for (const id of ['escala-a', 'escala-b']) {
  for (const [chave, nome] of Object.entries(ESCALAS_CALOR)) el(id).add(new Option(nome, chave));
}
el('escala-b').value = 'noturna';
for (const [id, lista] of [['variavel', diaria], ['variavel-dia', horaria]]) {
  for (const [chave, nome] of lista) el(id).add(new Option(nome, chave));
}
el('variavel').value = 'quedaPasPct';

let series;
const cache = new Map();
const dia = () => Number(el('dia-selecionado').value) - 1;
const hora = () => Number(el('hora-selecionada').value);
const pontosNoDia = () => series.map((ds) => ds[dia()]);

function grafico(id, campo, dados, variaveis, selecionado, eixo) {
  const [, , , casas] = variaveis.find(([chave]) => chave === el(campo).value);
  const pares = dados.map((pontos) => pontos.map((p) => p[el(campo).value]));
  desenharSerie(el(id), pares, pares[0].length, selecionado, eixo, casas);
}

function atualizarHora() {
  const h = hora();
  const rotulo = horario(h * PASSO_LEITURA_MIN);
  el('hora-rotulo').textContent = rotulo;
  el('hora-selecionada').setAttribute('aria-valuetext', rotulo);
  const pontos = pontosNoDia().map((p) => p.detalhe[h]);
  el('leitura').innerHTML = linha('Atividade', pontos.map((p) => p.dormindo ? 'Sono' : p.emTurno ? 'Durante o turno' : 'Vigília fora do turno'))
    + serieLinhas(horaria, pontos);
  grafico('curva-dia', 'variavel-dia', pontosNoDia().map((p) => p.detalhe), horaria, h, (i) => horario(i * PASSO_LEITURA_MIN));
}

function atualizarDia() {
  const n = dia() + 1;
  el('dia-rotulo').textContent = n;
  document.querySelector('[data-dia="8"]').disabled = n > 21;
  el('dia-selecionado').setAttribute('aria-valuetext', `Dia ${n}`);
  const pontos = pontosNoDia();
  el('resumo').innerHTML = linha('Escala do dia', pontos.map(({ plano }) => plano.tipo))
    + linha('Sono programado', pontos.map(({ plano }) => `${horario(plano.inicioSono)}–${horario(plano.inicioSono + plano.duracaoSono)}`))
    + serieLinhas(diaria, pontos)
    + serieLinhas([
      ['osmPreTurno', 'Osmolalidade no início do turno', 'mOsm/kg', 1],
      ['osmPosTurno', 'Osmolalidade ao fim do turno', 'mOsm/kg', 1],
      ['pressaoSonoInicio', 'Pressão de sono no início do turno', '', 2],
      ['osmFinal', 'Osmolalidade às 08:00 seguintes', 'mOsm/kg', 1],
      ['aguaL', 'Água ingerida no dia', 'L', 1],
    ], pontos);
  grafico('curva', 'variavel', series, diaria, dia(), (i) => `Dia ${i + 1}`);
  atualizarHora();
}

function atualizarComparacao() {
  const curta = el('sono-modo').value === 'curto';
  series = ['a', 'b'].map((id, i) => {
    const chave = el(`escala-${id}`).value;
    const nome = ESCALAS_CALOR[chave];
    for (const campo of ['titulo', 'hora']) el(`${campo}-${id}`).textContent = nome;
    el(`legenda-${id}`).textContent = `${i ? 'Tracejada' : 'Contínua'} · ${nome}`;
    const entrada = curta && chave !== 'diurna' ? `${chave}-curta` : chave;
    if (!cache.has(entrada)) cache.set(entrada, simularEscalaCalor(chave, { encurtarSonoNoturno: curta }));
    return cache.get(entrada);
  });
  atualizarDia();
}

function tabelaEstudos() {
  el('morris').innerHTML = conferirEscalaComMorris().map(({ nome, estudo, motor }) =>
    linha(nome, [numero(estudo, 1, true), numero(motor, 1, true), numero(motor - estudo, 1, true)])).join('');
  el('shafer').innerHTML = conferirEscalaComShafer().map(({ nome, estudo, dp, motor }) =>
    linha(nome, [`${numero(estudo)} ± ${numero(dp)}%`, medicao(motor, '%'), `${numero(motor - estudo, 1, true)} p.p.`])).join('');
}

for (const id of ['escala-a', 'escala-b', 'sono-modo']) el(id).addEventListener('change', atualizarComparacao);
el('variavel').addEventListener('change', atualizarDia);
el('variavel-dia').addEventListener('change', atualizarHora);
el('dia-selecionado').addEventListener('input', atualizarDia);
el('hora-selecionada').addEventListener('input', atualizarHora);
for (const [canvas, range, total, base, atualizar] of [
  ['curva', 'dia-selecionado', 28, 1, atualizarDia], ['curva-dia', 'hora-selecionada', 96, 0, atualizarHora],
]) {
  el(canvas).addEventListener('click', (evt) => {
    el(range).value = base + indiceNaSerie(el(canvas), evt.clientX, total);
    atualizar();
  });
}
for (const botao of document.querySelectorAll('[data-dia]')) botao.addEventListener('click', () => {
  const inicioSemana = Math.floor(dia() / 7) * 7;
  el('dia-selecionado').value = inicioSemana + Number(botao.dataset.dia);
  atualizarDia();
});
atualizarComparacao();
tabelaEstudos();
new ResizeObserver(atualizarDia).observe(el('curva'));
new ResizeObserver(atualizarHora).observe(el('curva-dia'));
