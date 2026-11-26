import {
  conferirCardiovascular, MINUTOS_DIA, MODELO_CARDIO, resumirCardiovascular, simularCardiovascular,
} from '../motor/cardiovascular.js';

const campos = document.querySelector('#controles');
const erro = document.querySelector('#erro');
const horario = document.querySelector('#horario');
const horaExata = document.querySelector('#hora-exata');
const horaRotulo = document.querySelector('#hora-rotulo');
const exibirMapa = document.querySelector('#mapa');
const fimB = document.querySelector('#fim-b');
const calculos = document.querySelector('#calculos');
const tabela = document.querySelector('#medias tbody');
const graficos = [...document.querySelectorAll('canvas')];
const series = [
  { id: 'a', cor: '#5ee2de', tracejado: [] },
  { id: 'b', cor: '#ffbd7b', tracejado: [7, 4] },
];
const numero = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const fmt = (valor) => numero.format(valor);
const digitos = (valor) => String(valor).padStart(2, '0');
const hhmm = (min) => `${digitos(Math.floor(min / 60))}:${digitos(min % 60)}`;
const minuto = (hora) => {
  const [h, m] = hora.split(':').map(Number);
  return h * 60 + m;
};

let pontoSelecionado = Number(horario.value);
let rotinas = [];
let resultados = [];

function sessao(id) {
  if (!campos.elements[`exercicio-${id}`].checked) return null;
  return {
    inicio: minuto(campos.elements[`inicio-${id}`].value),
    duracao: Number(campos.elements[`duracao-${id}`].value),
    intensidade: Number(campos.elements[`intensidade-${id}`].value),
  };
}

function estadoVisual(ponto) {
  if (ponto.emEsforco) return 'Exercício';
  if (ponto.emRecuperacao) return 'Recuperação imediata';
  return ponto.dormindo ? 'Sono' : 'Vigília';
}

function mostrarCalculos() {
  const abertos = [...calculos.querySelectorAll('details')].map((el) => el.open);
  calculos.innerHTML = series.map(({ id }, i) => {
    const p = resultados[i][pontoSelecionado];
    const c = p.calculo;
    const exercicio = p.emEsforco || p.emRecuperacao;
    return `<article class="leitura-cardio rotina-${id}">
      <h3>Rotina ${id.toUpperCase()}</h3>
      <p>${estadoVisual(p)}${p.amostraMAPA ? ' · ponto da MAPA simulada' : ''}</p>
      <dl class="valores">
        <div><dt>FC</dt><dd>${fmt(p.fc)} bpm</dd></div>
        <div><dt>PAS / PAD</dt><dd>${fmt(p.sis)} / ${fmt(p.dia)} mmHg</dd></div>
        <div><dt>PAM aprox.</dt><dd>${fmt(p.pam)} mmHg</dd></div>
      </dl>
      <details ${abertos[i] ?? true ? 'open' : ''}>
        <summary>Abrir as contas</summary>
        <ul>
          <li>FC basal = repouso diurno − efeito do sono (${fmt(c.quedaSonoFC)} bpm) − efeito do relógio (${fmt(c.quedaRelogioFC)} bpm) = ${fmt(c.fcBasal)} bpm.</li>
          <li>FC = ${fmt(c.fcBasal)} basal + ${fmt(c.deltaFC)} de resposta = ${fmt(p.fc)} bpm.</li>
          <li>PAS = ${fmt(c.paBasal.sis)} basal + ${fmt(c.deltaPAS)} de resposta = ${fmt(p.sis)} mmHg.</li>
          <li>PAD = ${fmt(c.paBasal.dia)} mmHg da curva basal.</li>
          <li>PAM ≈ PAD + (PAS − PAD) ÷ 3 = ${fmt(p.pam)} mmHg.</li>
          ${exercicio ? `<li>Alvo da FC = FC basal + ${fmt(c.fracReserva * 100)}% da reserva (FCmáx estimada de ${fmt(c.fcMax)} bpm) = ${fmt(c.alvoFC)} bpm.</li>
          <li>Alvo do aumento da PAS ≈ (${fmt(c.mets)} MET − 1) × ${MODELO_CARDIO.pasPorMET} = ${fmt(c.deltaAlvoPAS)} mmHg. Na recuperação, os acréscimos de FC e PAS decaem a partir do fim da sessão.</li>` : ''}
        </ul>
      </details>
    </article>`;
  }).join('');
}

function mostrarMedias() {
  const nomes = { dia: '24 horas', vigilia: 'Vigília', sono: 'Sono' };
  const resumos = resultados.map(resumirCardiovascular);
  tabela.innerHTML = Object.keys(nomes).map((chave) => series.map(({ id }, i) => {
    const linha = resumos[i][chave];
    return `<tr><th scope="row">${nomes[chave]}</th><td>${id.toUpperCase()}</td>
      <td>${fmt(linha.fc)}</td><td>${fmt(linha.sis)}</td><td>${fmt(linha.dia)}</td></tr>`;
  }).join('')).join('');
}

function desenhar(canvas) {
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  const escala = window.devicePixelRatio || 1;
  canvas.width = Math.round(w * escala);
  canvas.height = Math.round(h * escala);
  const ctx = canvas.getContext('2d');
  ctx.scale(escala, escala);
  const chave = canvas.id;
  const v = resultados.flatMap((lista) => lista.map((p) => p[chave]));
  const passo = Math.max(5, Math.ceil((Math.max(...v) - Math.min(...v)) / 30) * 10);
  const baixo = Math.floor(Math.min(...v) / passo) * passo;
  const alto = Math.max(baixo + passo * 2, Math.ceil(Math.max(...v) / passo) * passo);
  const x = (min) => 32 + (w - 47) * min / MINUTOS_DIA;
  const y = (valor) => h - 21 - (h - 29) * (valor - baixo) / (alto - baixo);

  ctx.fillStyle = '#263a59';
  let sonoInicio = null;
  for (let min = 0; min <= MINUTOS_DIA; min++) {
    if (resultados[0][min]?.dormindo) {
      sonoInicio ??= min;
    } else if (sonoInicio !== null) {
      ctx.fillRect(x(sonoInicio), 8, x(min) - x(sonoInicio), h - 29);
      sonoInicio = null;
    }
  }

  ctx.font = '11px system-ui';
  ctx.textAlign = 'right';
  ctx.fillStyle = '#c1cfe2';
  ctx.strokeStyle = '#3c4e65';
  for (let n = baixo; n <= alto; n += passo) {
    ctx.beginPath();
    ctx.moveTo(x(0), y(n));
    ctx.lineTo(x(MINUTOS_DIA), y(n));
    ctx.stroke();
    ctx.fillText(n, 27, y(n) + 4);
  }
  ctx.textAlign = 'center';
  for (let min = 0; min <= MINUTOS_DIA; min += w < 500 ? 360 : 240) {
    ctx.fillText(`${Math.round(min / 60)}h`, x(min), h - 4);
  }

  series.forEach(({ cor, tracejado }, i) => {
    const pontos = resultados[i];
    ctx.strokeStyle = cor;
    ctx.fillStyle = cor;
    ctx.lineWidth = 1.8;
    ctx.setLineDash(tracejado);
    ctx.beginPath();
    pontos.forEach((p, min) => ctx[min === 0 ? 'moveTo' : 'lineTo'](x(min), y(p[chave])));
    ctx.stroke();
    ctx.setLineDash([]);
    if (exibirMapa.checked && chave !== 'fc') {
      ctx.globalAlpha = 0.8;
      for (const p of pontos) if (p.amostraMAPA) {
        ctx.beginPath();
        ctx.arc(x(p.min), y(p[chave]), i === 0 ? 2.1 : 1.3, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
  });

  ctx.strokeStyle = '#f2f5fc';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x(pontoSelecionado), 8);
  ctx.lineTo(x(pontoSelecionado), h - 21);
  ctx.stroke();
}

function selecionar(min) {
  pontoSelecionado = Math.max(0, Math.min(MINUTOS_DIA - 1, min));
  horario.value = pontoSelecionado;
  horaExata.value = hhmm(pontoSelecionado);
  horaRotulo.value = horaExata.value;
  horario.setAttribute('aria-valuetext', horaExata.value);
  graficos.forEach(desenhar);
  mostrarCalculos();
}

function recalcular() {
  const sono = [minuto(campos.elements.dormir.value), minuto(campos.elements.acordar.value)];
  const novas = series.map(({ id }) => ({ sono, exercicio: sessao(id) }));
  const falhas = novas.map(conferirCardiovascular);
  const invalida = falhas.findIndex(Boolean);
  erro.hidden = invalida < 0;
  if (invalida >= 0) {
    erro.textContent = `Rotina ${series[invalida].id.toUpperCase()}. ${falhas[invalida]} As curvas mantêm o último cálculo válido.`;
    return;
  }

  rotinas = novas;
  resultados = rotinas.map(simularCardiovascular);
  fimB.hidden = !rotinas[1].exercicio;
  mostrarMedias();
  selecionar(pontoSelecionado);
}

campos.addEventListener('submit', (evento) => {
  evento.preventDefault();
  recalcular();
});
campos.querySelectorAll('[data-rotina]').forEach((grupo) => {
  const checkbox = grupo.querySelector('input[type=checkbox]');
  const editores = grupo.querySelector('.sessao');
  checkbox.addEventListener('change', () => {
    editores.hidden = !checkbox.checked;
    editores.querySelectorAll('input, select').forEach((el) => { el.disabled = !checkbox.checked; });
  });
});

horario.addEventListener('input', () => selecionar(Number(horario.value)));
horaExata.addEventListener('change', () => {
  if (horaExata.value) selecionar(minuto(horaExata.value));
});
fimB.addEventListener('click', () => {
  const { inicio, duracao } = rotinas[1].exercicio;
  selecionar((inicio + duracao) % MINUTOS_DIA);
});
exibirMapa.addEventListener('change', () => graficos.forEach(desenhar));
graficos.forEach((canvas) => canvas.addEventListener('click', (evento) => {
  const area = canvas.getBoundingClientRect();
  const proporcao = (evento.clientX - area.left - 32) / (area.width - 47);
  selecionar(Math.round(proporcao * MINUTOS_DIA));
}));

document.querySelector('#csv').addEventListener('click', () => {
  const linhas = ['rotina;hora;estado;FC_bpm;PAS_mmHg;PAD_mmHg;PAM_aprox_mmHg;FC_basal_bpm;efeito_sono_FC_bpm;efeito_relogio_FC_bpm;delta_FC_bpm;PAS_basal_mmHg;delta_PAS_mmHg;amostra_MAPA_simulada'];
  resultados.forEach((pontos, i) => pontos.forEach((p) => {
    const c = p.calculo;
    linhas.push([
      series[i].id.toUpperCase(), hhmm(p.min), estadoVisual(p),
      ...[p.fc, p.sis, p.dia, p.pam, c.fcBasal, c.quedaSonoFC, c.quedaRelogioFC,
        c.deltaFC, c.paBasal.sis, c.deltaPAS].map(fmt),
      p.amostraMAPA ? 'sim' : 'não',
    ].join(';'));
  }));
  const link = document.createElement('a');
  const url = URL.createObjectURL(new Blob(['\ufeff', linhas.join('\r\n')], { type: 'text/csv;charset=utf-8' }));
  link.href = url;
  link.download = 'mosaico-cardiovascular-24h.csv';
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});

recalcular();
const observar = new ResizeObserver(() => graficos.forEach(desenhar));
graficos.forEach((canvas) => observar.observe(canvas));
