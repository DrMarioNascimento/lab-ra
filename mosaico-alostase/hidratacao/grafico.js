export function desenharSerie(canvas, pares, pontos, selecionado, eixo, casas) {
  const w = canvas.clientWidth, h = canvas.clientHeight;
  const escala = devicePixelRatio || 1;
  canvas.width = Math.round(w * escala);
  canvas.height = Math.round(h * escala);
  const ctx = canvas.getContext('2d');
  ctx.scale(escala, escala);

  const valores = pares.flat();
  const menor = Math.min(...valores), maior = Math.max(...valores);
  const intervalo = Math.max(maior - menor, 10 ** (-casas) * 4);
  const baixo = menor - intervalo * 0.08;
  const alto = baixo + intervalo * 1.16;
  const x = (i) => 58 + (w - 78) * (pontos > 1 ? i / (pontos - 1) : 0.5);
  const y = (v) => h - 28 - (h - 48) * (v - baixo) / (alto - baixo);
  const num = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: casas });

  ctx.font = '11px system-ui';
  ctx.textAlign = 'right';
  ctx.fillStyle = '#bfcde0';
  ctx.strokeStyle = '#3c4e65';
  for (let i = 0; i <= 4; i++) {
    const valor = baixo + (alto - baixo) * i / 4;
    ctx.beginPath();
    ctx.moveTo(58, y(valor));
    ctx.lineTo(w - 20, y(valor));
    ctx.stroke();
    ctx.fillText(num.format(valor), 53, y(valor) + 4);
  }
  ctx.textAlign = 'center';
  for (let i = 0; i <= (pontos > 1 ? 4 : 0); i++) {
    const indice = Math.round((pontos - 1) * i / 4);
    ctx.fillText(eixo(indice), x(indice), h - 9);
  }
  for (const [i, serie] of pares.entries()) {
    ctx.strokeStyle = i === 0 ? '#5ee2de' : '#ffbd7b';
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
}
