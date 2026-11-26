import { conferirMorris2016, simularSonoPressao, JANELAS_SONO_PRESSAO } from '../../motor/sono-pressao.js';
import { desenharSerie, indiceNaSerie } from '../../hidratacao/grafico.js?v=4';

const el = (id) => document.getElementById(id);
const numero = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const comSinal = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1, signDisplay: 'exceptZero' });
const horaCivil = (min) => `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`;
const fmt = (x, unidade) => `${numero.format(x)} ${unidade}`;
const linha = (nome, valores) => `<tr><th scope="row">${nome}</th>${valores.map((v) => `<td>${v}</td>`).join('')}</tr>`;
const janela = () => el('janela').value;
const momento = () => Number(el('hora').value);
const tipoMinuto = (p) => p.desperto || p.evento ? 'desperto' : p.naJanela ? 'sono' : 'vigilia';
const estado = (p) => p.desperto ? 'Acordado na janela de sono' : p.evento ? 'Pulso breve' : p.dormindo ? 'Sono' : 'Vigília';
const campos = [
  ['pas24h', 'Sistólica em 24 h', 'mmHg'],
  ['pasVigilia', 'Sistólica fora da janela de sono', 'mmHg'],
  ['pasJanela', 'Sistólica na janela de sono', 'mmHg'],
  ['diferencaJanela', 'Diferença vigília − janela', 'mmHg'],
  ['quedaJanelaPct', 'Queda pela janela de sono', '%'],
  ['pasVigiliaTotal', 'Sistólica em toda a vigília', 'mmHg'],
  ['pasSono', 'Sistólica no sono efetivo', 'mmHg'],
  ['diferencaSono', 'Diferença vigília − sono efetivo', 'mmHg'],
  ['quedaSonoPct', 'Queda pelo sono efetivo', '%'],
  ['tempoAcordadoNaJanela', 'Tempo acordado na janela', 'min'],
  ['sonoEfetivoMin', 'Tempo efetivamente dormido', 'min'],
];

let simulacoes, exibir, faixaEventos;
const bases = new Map();
let curvas;
function grafico() {
  desenharSerie(el('curva'), curvas, exibir.length, momento(), (i) => horaCivil(exibir[i]), 0);
}

function atualizarMomento() {
  const min = exibir[momento()];
  const l = horaCivil(min);
  el('hora-rotulo').textContent = l;
  el('hora').setAttribute('aria-valuetext', l);
  const pontos = simulacoes.map((s) => s.pontos[min]);
  el('momento').innerHTML = linha('Estado', pontos.map(estado))
    + linha('Sistólica', pontos.map((p) => fmt(p.sis, 'mmHg')))
    + linha('Frequência cardíaca', pontos.map((p) => fmt(p.fc, 'bpm')));
  grafico();
}

function atualizarCurvas() {
  const campo = el('variavel').value;
  curvas = simulacoes.map((s) => exibir.map((min) => s.pontos[min][campo]));
  atualizarMomento();
}

function atualizarPeriodo() {
  const minAnterior = exibir?.[momento()] ?? simulacoes[1].minutosDespertares[0] ?? JANELAS_SONO_PRESSAO[janela()][0];
  const soSono = el('periodo').value === 'sono';
  const inicio = soSono ? JANELAS_SONO_PRESSAO[janela()][0] : 0;
  const duracao = soSono ? 480 : 1440;
  exibir = Array.from({ length: duracao }, (_, i) => (inicio + i) % 1440);
  el('hora').max = duracao - 1;
  faixaEventos = simulacoes[1].minutosDespertares.map((min) => exibir.indexOf(min)).filter((m) => m >= 0).sort((a, b) => a - b);
  const pos = exibir.indexOf(minAnterior);
  el('hora').value = pos < 0 ? faixaEventos[0] ?? 0 : pos;

  const segmentos = [];
  for (const min of exibir) {
    const tipo = tipoMinuto(simulacoes[1].pontos[min]);
    const anterior = segmentos.at(-1);
    if (anterior?.tipo === tipo) anterior.minutos++;
    else segmentos.push({ tipo, minutos: 1 });
  }
  el('faixa').innerHTML = segmentos.map(({ tipo, minutos }) => `<span class="${tipo}" style="flex-grow:${minutos}"></span>`).join('');
  el('proximo-evento').disabled = faixaEventos.length === 0;
  atualizarCurvas();
}

function recalcular() {
  const chave = janela();
  const despertares = Number(el('quantidade').value);
  const duracaoMin = Number(el('duracao').value);
  if (!bases.has(chave)) bases.set(chave, simularSonoPressao({ janela: chave }));
  simulacoes = [bases.get(chave), simularSonoPressao({ janela: chave, despertares, duracaoMin })];
  el('quantidade-rotulo').textContent = despertares;
  const [base, fragmentado] = simulacoes.map((s) => s.resumo);
  el('medias').innerHTML = campos.map(([campo, nome, unidade]) =>
    linha(nome, [base, fragmentado].map((p) => fmt(p[campo], unidade)))).join('');
  const delta = fragmentado.pasJanela - base.pasJanela;
  const reducao = base.quedaJanelaPct - fragmentado.quedaJanelaPct;
  el('efeito').textContent = `Com ${despertares} ${despertares === 1 ? 'despertar' : 'despertares'}, a mudança na sistólica dentro da janela foi de ${fmt(delta, 'mmHg')}. A queda pela janela diminuiu em ${fmt(reducao, 'p.p.')}.`;
  atualizarPeriodo();
}

el('comparacao').innerHTML = conferirMorris2016().map(({ nome, unidade, estudo, continuo, fragmentado }) =>
  linha(nome, [estudo, continuo, fragmentado].map((x) => `${comSinal.format(x)} ${unidade}`))).join('');
for (const id of ['janela', 'duracao']) el(id).addEventListener('change', recalcular);
el('quantidade').addEventListener('input', recalcular);
el('variavel').addEventListener('change', atualizarCurvas);
el('periodo').addEventListener('change', atualizarPeriodo);
el('hora').addEventListener('input', atualizarMomento);
el('proximo-evento').addEventListener('click', () => {
  el('hora').value = faixaEventos.find((indice) => indice > momento()) ?? faixaEventos[0];
  atualizarMomento();
});
el('curva').addEventListener('click', (e) => {
  el('hora').value = indiceNaSerie(el('curva'), e.clientX, exibir.length);
  atualizarMomento();
});
recalcular();
new ResizeObserver(grafico).observe(el('curva'));
