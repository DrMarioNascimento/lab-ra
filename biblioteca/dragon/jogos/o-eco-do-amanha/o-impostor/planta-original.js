function plantaSVG() {
  var A = D.geo.andares, s = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 640" role="img" aria-label="Corte da Torre de Continuidade, do subsolo à cobertura">';
  s += '<defs><linearGradient id="ceu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a1620"/><stop offset="1" stop-color="#03070b"/></linearGradient></defs>';
  s += '<rect width="360" height="640" fill="url(#ceu)"/>';
  for (var k = 0; k < 40; k++) s += '<line x1="' + (k * 23 % 360) + '" y1="' + (k * 37 % 600) + '" x2="' + (k * 23 % 360 - 6) + '" y2="' + (k * 37 % 600 + 18) + '" stroke="#86e1ea22" stroke-width="1"/>';
  var yChao = yDe(iDe('-1'));
  s += '<rect x="0" y="' + yChao + '" width="360" height="' + (640 - yChao) + '" fill="#071016"/>';
  s += '<line x1="0" y1="' + yChao + '" x2="360" y2="' + yChao + '" stroke="#46667a"/>';
  s += '<text x="8" y="' + (yChao - 4) + '" style="font-size:8px;fill:#8fa9b8">RUA</text>';
  A.forEach(function (a, i) {
    var y = yDe(i), cls = 'andar' + (LACRADOS[a.a] ? ' lacrado' : '');
    s += '<g class="' + cls + '" data-andar="' + a.a + '"><rect class="lage" x="62" y="' + y + '" width="208" height="31" rx="3"/>';
    s += '<text class="num" x="72" y="' + (y + 19) + '">' + a.a + '</text><text x="102" y="' + (y + 19) + '">' + a.nome + '</text></g>';
  });
  /* corta-fogo (direita), elevador (esquerda), poço (centro, cobre) */
  s += '<rect x="274" y="' + yDe(0) + '" width="16" height="' + (yDe(iDe('0')) + 31 - yDe(0)) + '" fill="#0c1b26" stroke="#86e1ea66"/>';
  for (var j = 0; j <= iDe('0'); j++) s += '<path d="M276 ' + (yDe(j) + 26) + ' l12 -8" stroke="#86e1ea88"/>';
  s += '<text x="300" y="' + (yDe(4) + 10) + '" style="font-size:8px;fill:#a6eef5" transform="rotate(90 300 ' + (yDe(4) + 10) + ')">ESCADA CORTA-FOGO · 13 s POR ANDAR</text>';
  s += '<rect x="44" y="' + yDe(0) + '" width="14" height="' + (yDe(iDe('-1')) + 31 - yDe(0)) + '" fill="#0c1b26" stroke="#46667a"/>';
  s += '<rect x="45" y="' + (yDe(iDe('+9')) - 6) + '" width="12" height="16" fill="#efc87855" stroke="#efc878"/>';
  s += '<text x="38" y="' + (yDe(9)) + '" style="font-size:8px;fill:#8fa9b8" transform="rotate(-90 38 ' + yDe(9) + ')">ELEVADOR</text>';
  s += '<line class="torre-poco" x1="248" y1="' + yDe(0) + '" x2="248" y2="' + (yDe(iDe('-1')) + 31) + '"/>';
  s += '<text x="244" y="' + (yDe(10) + 4) + '" style="font-size:7.5px;fill:#f0bf8f" text-anchor="end">poço de cabos</text>';
  if (rotaRevelada) {
    var g = yDe(iDe('+2')) + 16, ar = yDe(iDe('+1')) + 16, ce = yDe(iDe('-1')) + 16;
    s += '<path class="torre-rota" d="M230 ' + g + ' L248 ' + g + ' L248 ' + ar + ' L232 ' + ar + ' M248 ' + ar + ' L248 ' + ce + ' L226 ' + ce + '"/>';
    s += '<circle cx="248" cy="' + g + '" r="4" fill="#efc878"/><circle cx="248" cy="' + ar + '" r="4" fill="#efc878"/><circle cx="248" cy="' + ce + '" r="4" fill="#efc878"/>';
  }
  /* anexos no térreo */
  var y0 = yDe(iDe('0'));
  s += '<rect x="292" y="' + y0 + '" width="62" height="31" rx="3" fill="#0b1d16" stroke="#5fd68a88"/><text x="297" y="' + (y0 + 19) + '" style="font-size:8.5px;fill:#bff5d6">Jardim</text>';
  s += '<text x="300" y="' + (y0 - 6) + '" style="font-size:7.5px;fill:#8fa9b8">passarela →</text>';
  /* você */
  var mi = D.geo.andares.map(function (a) { return a.a; }).indexOf(andarDoJogador());
  if (mi >= 0) { var cy = yDe(mi) + 15; s += '<g id="voceAqui"><circle class="voce-aqui-anel" cx="252" cy="' + cy + '" r="7"/><circle class="voce-aqui" cx="252" cy="' + cy + '" r="5"/></g>'; }
  s += '<text x="352" y="632" text-anchor="end" style="font-size:8px;fill:#f0bf8f">TORRE DE CONTINUIDADE · CORTE</text>';
  return s + '</svg>';
}
