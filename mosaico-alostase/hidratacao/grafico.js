const eixos = { esquerda: 58, direita: 20 };
const corDaSerie = (indice) => indice === 0 ? '#5ee2de' : '#ffbd7b';

export function indiceNaSerie(canvas, clientX, pontos) {
  const area = canvas.getBoundingClientRect();
  const largura = area.width - eixos.esquerda - eixos.direita;
  if (largura <= 0 || pontos < 2) return 0;
  const fracao = (clientX - area.left - eixos.esquerda) / largura;
  return Math.round(Math.max(0, Math.min(1, fracao)) * (pontos - 1));
}

export function desenharSerie(canvas, pares, pontos, selecionado, eixo, casas, marcadores = []) {
  const w = canvas.clientWidth, h = canvas.clientHeight;
  const escala = devicePixelRatio || 1;
  canvas.width = Math.round(w * escala);
  canvas.height = Math.round(h * escala);
  const ctx = canvas.getContext('2d');
  ctx.scale(escala, escala);

  const valores = [...pares.flat(), ...marcadores.map((p) => p.valor)];
  const menor = Math.min(...valores), maior = Math.max(...valores);
  const intervalo = Math.max(maior - menor, 10 ** (-casas) * 4);
  const baixo = menor - intervalo * 0.08;
  const alto = baixo + intervalo * 1.16;
  const x = (i) => eixos.esquerda + (w - eixos.esquerda - eixos.direita) * (pontos > 1 ? i / (pontos - 1) : 0.5);
  const y = (v) => h - 28 - (h - 48) * (v - baixo) / (alto - baixo);
  const num = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: casas });

  ctx.font = '11px system-ui';
  ctx.textAlign = 'right';
  ctx.fillStyle = '#bfcde0';
  ctx.strokeStyle = '#3c4e65';
  for (let i = 0; i <= 4; i++) {
    const valor = baixo + (alto - baixo) * i / 4;
    ctx.beginPath();
    ctx.moveTo(eixos.esquerda, y(valor));
    ctx.lineTo(w - eixos.direita, y(valor));
    ctx.stroke();
    ctx.fillText(num.format(valor), 53, y(valor) + 4);
  }
  ctx.textAlign = 'center';
  for (let i = 0; i <= (pontos > 1 ? 4 : 0); i++) {
    const indice = Math.round((pontos - 1) * i / 4);
    ctx.fillText(eixo(indice), x(indice), h - 9);
  }
  for (const [i, serie] of pares.entries()) {
    ctx.strokeStyle = corDaSerie(i);
    ctx.lineWidth = 2;
    ctx.setLineDash(i === 0 ? [] : [7, 4]);
    ctx.beginPath();
    serie.forEach((v, j) => ctx[j ? 'lineTo' : 'moveTo'](x(j), y(v)));
    ctx.stroke();
    if (pontos === 1) {
      ctx.fillStyle = ctx.strokeStyle;
      ctx.beginPath();
      ctx.arc(x(0), y(serie[0]), 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.setLineDash([]);
  ctx.strokeStyle = '#f0f5ff';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x(selecionado), 20);
  ctx.lineTo(x(selecionado), h - 28);
  ctx.stroke();
  for (const { indice, valor, serie } of marcadores) {
    ctx.strokeStyle = corDaSerie(serie);
    ctx.lineWidth = 2;
    ctx.fillStyle = '#121d30';
    ctx.beginPath();
    ctx.arc(x(indice), y(valor), 4, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
  }
}
