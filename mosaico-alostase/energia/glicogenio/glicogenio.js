import { REFEICAO_GLICOGENIO as refeicao, JEJUM_GLICOGENIO as jejum, glicogenioAposRefeicao, variacaoGlicogenioEmJejum, FLUXO_HEPATICO, CONFERENCIA_GLICOGENIO_120, simularFluxoHepatico, simularRegulacaoHepatica } from '../../motor/glicogenio.js?v=3';
import { desenharSerie, indiceNaSerie } from '../../hidratacao/grafico.js?v=4';

const el = (id) => document.getElementById(id);
const fmt = (v) => v.toLocaleString('pt-BR', { maximumFractionDigits: 2 });
const protocolos = {
  refeicao: {
    nome: 'Concentração hepática estimada', fim: refeicao.fim, minutoInicial: refeicao.minutoPico,
    calcular: glicogenioAposRefeicao, hora: (min) => `${min} min`,
    pontos: [
      [0, refeicao.inicial, refeicao.epInicial, 'Antes da refeição'],
      [refeicao.minutoPico, refeicao.pico, refeicao.epPico, 'Pico médio'],
    ],
    legenda: 'Média ± erro-padrão (mmol/L)',
    metodo: `O modelo interpola entre o valor inicial e o pico médio aos ${refeicao.minutoPico} ± ${refeicao.epMinutoPico} min. Do pico até a sexta hora, aplica a taxa média de queda publicada, de 0,26 mmol/L por minuto.`,
    fonte: ['Taylor e colegas, 1996', 'https://doi.org/10.1172/JCI118379'],
  },
  jejum: {
    nome: 'Mudança estimada em relação às 20h', fim: jejum.fim, minutoInicial: jejum.fim,
    calcular: variacaoGlicogenioEmJejum,
    hora: (min) => `${String((jejum.inicioHora + Math.floor(min / 60)) % 24).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`,
    pontos: [[jejum.fim, -jejum.perda, jejum.dispersao, '07h do dia seguinte']],
    legenda: 'Mudança desde as 20h, com dispersão publicada (mmol/L)',
    metodo: 'A referência das 20h corresponde a uma hora após o jantar. O estudo mediu a perda até as 07h em dez jovens adultos sedentários durante o protocolo. A linha reta é uma hipótese para descrever o intervalo entre as duas medidas.',
    fonte: ['Iwayama e colegas, 2020', 'https://doi.org/10.1002/nbm.4289'],
  },
};

const fluxo = simularFluxoHepatico();
const taxa = fluxo.map((ponto) => ponto.taxa);
const pontosFluxo = FLUXO_HEPATICO.filter((p) => p.minuto <= refeicao.fim);
const marcadoresFluxo = pontosFluxo.map(({ minuto, taxa }) => ({ indice: minuto, valor: taxa, serie: 0 }));
el('referencias-fluxo').innerHTML = pontosFluxo.map((p) => {
  const valor = p.aproximado ? 'Próximo de zero' : p.derivado ? 'Queda de 67% do basal' : `${fmt(p.taxa)} ± ${fmt(p.ep)}`;
  return `<tr><th scope="row">${p.minuto} min</th><td>${valor}</td><td>${fmt(taxa[p.minuto])}</td></tr>`;
}).join('');
const check = CONFERENCIA_GLICOGENIO_120;
el('conferencia-120').textContent = `Aos ${check.minuto} min, o glicogênio subiu ${fmt(check.variacao)} mmol/L no estudo. A curva, ajustada pelo basal e pelo pico, estima ${fmt(glicogenioAposRefeicao(check.minuto) - refeicao.inicial)} mmol/L de aumento nesse ponto.`;

const regulacaoOriginal = simularRegulacaoHepatica();
el('conferencia-regulacao').innerHTML = pontosFluxo.map((p) => {
  const papel = p.minuto === 0 || p.minuto === 60 ? ' · calibração' : '';
  const observado = p.aproximado ? '≈ 0' : fmt(p.taxa);
  return `<tr><th scope="row">${p.minuto} min${papel}</th><td>${observado}</td><td>${fmt(regulacaoOriginal[p.minuto].taxa)}</td></tr>`;
}).join('');
let regulacao = regulacaoOriginal;
let taxaRegulada = regulacao.map((p) => p.taxa);
let protocolo, curva;
function desenhar() {
  const min = Number(el('tempo').value);
  const hora = protocolo.hora(min);
  el('hora').textContent = hora;
  el('tempo').setAttribute('aria-valuetext', hora);
  el('leitura').textContent = `${protocolo.nome} de ${fmt(curva[min])} mmol/L de tecido hepático.`;
  const marcadores = protocolo.pontos.map(([indice, valor]) => ({ indice, valor, serie: 0 }));
  desenharSerie(el('curva'), [curva], curva.length, min, protocolo.hora, 0, marcadores);
  if (!el('fluxo-hepatico').hidden) {
    el('leitura-fluxo').textContent = `${fmt(taxa[min])} mg/kg/min aos ${min} min · ${fmt(fluxo[min].liberadoMgKg)} mg/kg liberados desde a refeição.`;
    desenharSerie(el('curva-fluxo'), [taxa], taxa.length, min, protocolo.hora, 1, marcadoresFluxo);
    const resposta = regulacao[min];
    el('leitura-regulacao').textContent = `Aos ${min} min · razão hormonal ${fmt(resposta.razaoRelativa * 100)}% do jejum · produção calculada de ${fmt(resposta.taxa)} mg/kg/min.`;
    desenharSerie(el('curva-regulacao'), [taxa, taxaRegulada], taxa.length, min, protocolo.hora, 1, marcadoresFluxo);
  }
}

function atualizar() {
  protocolo = protocolos[el('protocolo').value];
  el('fluxo-hepatico').hidden = protocolo !== protocolos.refeicao;
  el('regulacao-hepatica').hidden = el('fluxo-hepatico').hidden;
  curva = Array.from({ length: protocolo.fim + 1 }, (_, min) => protocolo.calcular(min));
  el('tempo').max = protocolo.fim;
  el('tempo').value = protocolo.minutoInicial;
  el('unidade').textContent = `${protocolo.nome} (mmol/L de tecido hepático).`;
  el('legenda').textContent = protocolo.legenda;
  el('referencias').innerHTML = protocolo.pontos.map(([min, media, dispersao, rotulo]) =>
    `<tr><th scope="row">${rotulo}</th><td>${fmt(media)} ± ${fmt(dispersao)}</td><td>${fmt(curva[min])}</td></tr>`).join('');
  el('metodo').textContent = protocolo.metodo;
  const [nome, url] = protocolo.fonte;
  el('fonte').textContent = nome;
  el('fonte').href = url;
  desenhar();
}

el('protocolo').addEventListener('change', atualizar);
el('tempo').addEventListener('input', desenhar);
el('curva').addEventListener('click', (e) => {
  el('tempo').value = indiceNaSerie(el('curva'), e.clientX, curva.length);
  desenhar();
});
for (const id of ['curva-fluxo', 'curva-regulacao']) {
  el(id).addEventListener('click', (e) => {
    el('tempo').value = indiceNaSerie(el(id), e.clientX, taxa.length);
    desenhar();
  });
}
function atualizarSinais() {
  regulacao = simularRegulacaoHepatica(Number(el('sinal-insulina').value), Number(el('sinal-glucagon').value));
  taxaRegulada = regulacao.map((p) => p.taxa);
  desenhar();
}
el('sinal-insulina').addEventListener('change', atualizarSinais);
el('sinal-glucagon').addEventListener('change', atualizarSinais);
atualizar();
const observer = new ResizeObserver(desenhar);
observer.observe(el('curva'));
observer.observe(el('curva-fluxo'));

observer.observe(el('curva-regulacao'));
