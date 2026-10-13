/* O Impostor — o quarto do jasmim (Cap. 6), com a mão.

   01/10/2026 (auditoria B5): substitui a peça do quarto da versão anterior
   (quarto_SUBSTITUIDO.html, com ra/quarto-porta.js), que abria fora da mesa e
   trazia e-mails de cartório, porta-comprimidos e uma chave de corda duplicada.
   Agora mostra o quarto como o cânone o descreve depois que a porta cede:

   · a cama, ainda desfeita;
   · a mesa de cabeceira com o caderno escolar de capa azul e a folha dos três
     lembretes presa com grampo;
   · o bocal do teto sem a lâmpada;
   · o carregador pendurado na tomada, sem aparelho na ponta;
   · a janela com o jasmim do lado de fora;
   · a portinha do fundo, para a copa, aberta (?saida=janela abre a janela).

   É para olhar: um toque rápido num objeto diz o que é e manda a foto para o
   inventário. Fala com a mesa por postMessage: {oi:'quarto', evento:'foto', nome, img}. */
(function () {
  'use strict';
  var Q = new URLSearchParams(location.search), SAIDA = Q.get('saida') || 'varanda';
  var b = OIBase.criar({
    vista: { alvo: [0, 0.1, 0], dist: 1.25, distRetrato: 2.1, dir: [0.6, 0.9, 1] },
    raioDoChao: 0.8, alturaDoAparelho: 0.45, miraEscala: 1.3, exposicao: 0.75,
    textoMira: 'Aponte para uma mesa ou o chão e toque em Pôr aqui.',
    textoInicio: 'O quarto do jasmim, depois que a porta cedeu.'
  });
  function cor(h) { return new THREE.Color(h).convertSRGBToLinear(); }
  var M = {
    piso: new THREE.MeshStandardMaterial({ color: cor(0x6b4a30), roughness: 0.8 }),
    parede: new THREE.MeshStandardMaterial({ color: cor(0xd8ccb2), roughness: 0.95 }),
    madeira: new THREE.MeshStandardMaterial({ color: cor(0x5a3a24), roughness: 0.7 }),
    lencol: new THREE.MeshStandardMaterial({ color: cor(0xeee6d4), roughness: 0.9 }),
    coberta: new THREE.MeshStandardMaterial({ color: cor(0x7a5f86), roughness: 0.95 }),
    azul: new THREE.MeshStandardMaterial({ color: cor(0x2f4f8a), roughness: 0.6 }),
    papel: new THREE.MeshStandardMaterial({ color: cor(0xf1ead6), roughness: 0.9 }),
    metal: new THREE.MeshStandardMaterial({ color: cor(0x9a958c), metalness: 0.8, roughness: 0.4 }),
    preto: new THREE.MeshStandardMaterial({ color: cor(0x1a1a1a), roughness: 0.6 }),
    vidro: new THREE.MeshStandardMaterial({ color: cor(0x3a4a55), roughness: 0.15, metalness: 0.3, transparent: true, opacity: 0.7 }),
    folha: new THREE.MeshStandardMaterial({ color: cor(0x2f5a2c), roughness: 0.9 }),
    flor: new THREE.MeshStandardMaterial({ color: cor(0xf4f0e2), roughness: 0.6 }),
    escuro: new THREE.MeshStandardMaterial({ color: cor(0x15110e), roughness: 1 })
  };
  var R = b.raiz, W = 0.5, D = 0.36, H = 0.26;        /* 1:10 de um quarto de 5 m por 3,6 m */
  function caixa(w, h, d, m, x, y, z) { var o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); o.position.set(x, y, z); R.add(o); return o; }
  /* piso e duas paredes (o fundo e a esquerda); as da frente ficam abertas para olhar */
  caixa(W, 0.01, D, M.piso, 0, 0.005, 0);
  caixa(W, H, 0.012, M.parede, 0, H / 2, -D / 2);
  caixa(0.012, H, D, M.parede, -W / 2, H / 2, 0);
  /* a janela, na parede do fundo, com o jasmim do lado de fora */
  var janX = 0.1, janela = new THREE.Group(); janela.position.set(janX, 0.15, -D / 2 + 0.008); R.add(janela);
  var vidroJ = new THREE.Mesh(new THREE.PlaneGeometry(0.1, 0.09), M.vidro); janela.add(vidroJ);
  [[0, 0.046, 0.11, 0.006], [0, -0.046, 0.11, 0.006], [-0.053, 0, 0.006, 0.09], [0.053, 0, 0.006, 0.09], [0, 0, 0.004, 0.09]].forEach(function (q) {
    var f = new THREE.Mesh(new THREE.BoxGeometry(q[2], q[3], 0.006), M.madeira); f.position.set(q[0], q[1], 0.002); janela.add(f);
  });
  if (SAIDA === 'janela') { vidroJ.position.x = -0.03; vidroJ.rotation.y = -0.6; }
  for (var j = 0; j < 30; j++) {
    var fo = new THREE.Mesh(new THREE.SphereGeometry(0.008 + Math.random() * 0.006, 6, 5), M.folha);
    fo.position.set(janX - 0.06 + Math.random() * 0.12, 0.1 + Math.random() * 0.1, -D / 2 - 0.012); R.add(fo);
    if (Math.random() > 0.5) { var fl = new THREE.Mesh(new THREE.SphereGeometry(0.0025, 5, 4), M.flor); fl.position.copy(fo.position).add(new THREE.Vector3(0.004, 0.004, 0.006)); R.add(fl); }
  }
  /* a portinha do fundo, para a copa: aberta */
  var portinha = new THREE.Group(); portinha.position.set(-W / 2 + 0.008, 0, 0.08); R.add(portinha);
  var vao = new THREE.Mesh(new THREE.PlaneGeometry(0.07, 0.15), M.escuro); vao.rotation.y = Math.PI / 2; vao.position.set(0.001, 0.075, 0); portinha.add(vao);
  var folhaP = new THREE.Mesh(new THREE.BoxGeometry(0.006, 0.15, 0.07), M.madeira); folhaP.position.set(0.035, 0.075, 0.035 + 0.03); folhaP.rotation.y = SAIDA === 'janela' ? 0 : -1.2; portinha.add(folhaP);
  /* a cama, desfeita */
  var cama = new THREE.Group(); cama.position.set(-0.08, 0, -0.06); R.add(cama);
  [[-0.11, -0.08], [0.11, -0.08], [-0.11, 0.08], [0.11, 0.08]].forEach(function (p) { var pe = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.05, 0.012), M.madeira); pe.position.set(p[0], 0.025, p[1]); cama.add(pe); });
  var estrado = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.02, 0.18), M.madeira); estrado.position.y = 0.05; cama.add(estrado);
  var colchao = new THREE.Mesh(new THREE.BoxGeometry(0.23, 0.025, 0.17), M.lencol); colchao.position.y = 0.072; cama.add(colchao);
  var coberta = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.012, 0.172), M.coberta); coberta.position.set(0.04, 0.09, 0); coberta.rotation.z = 0.06; cama.add(coberta);
  var trav = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.02, 0.1), M.lencol); trav.position.set(-0.085, 0.095, 0); cama.add(trav);
  var cabeceira = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.1, 0.18), M.madeira); cabeceira.position.set(-0.12, 0.08, 0); cama.add(cabeceira);
  /* a mesa de cabeceira, com o caderno azul e a folha dos três lembretes */
  var mesa = new THREE.Group(); mesa.position.set(-0.08, 0, 0.1); R.add(mesa);
  var tampo = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.008, 0.06), M.madeira); tampo.position.y = 0.07; mesa.add(tampo);
  var corpoM = new THREE.Mesh(new THREE.BoxGeometry(0.064, 0.066, 0.054), M.madeira); corpoM.position.y = 0.034; mesa.add(corpoM);
  var caderno = new THREE.Group(); caderno.position.set(0, 0.0755, 0); caderno.rotation.y = 0.2; mesa.add(caderno);
  var capa = new THREE.Mesh(new THREE.BoxGeometry(0.042, 0.004, 0.03), M.azul); caderno.add(capa);
  var folhaL = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.0008, 0.022), M.papel); folhaL.position.set(0.004, 0.0025, -0.002); folhaL.rotation.y = -0.15; caderno.add(folhaL);
  var grampo = new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.0012, 0.0015), M.metal); grampo.position.set(-0.008, 0.0032, -0.01); caderno.add(grampo);
  /* o bocal do teto, sem a lâmpada */
  var bocal = new THREE.Group(); bocal.position.set(0.02, H - 0.002, 0); R.add(bocal);
  var fio = new THREE.Mesh(new THREE.CylinderGeometry(0.0012, 0.0012, 0.05, 6), M.preto); fio.position.y = -0.025; bocal.add(fio);
  var soquete = new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.006, 0.014, 12, 1, true), M.preto); soquete.position.y = -0.057; bocal.add(soquete);
  /* a tomada com o carregador pendurado, sem aparelho na ponta */
  var tomada = new THREE.Group(); tomada.position.set(-W / 2 + 0.008, 0.04, -0.12); R.add(tomada);
  var espelho = new THREE.Mesh(new THREE.BoxGeometry(0.003, 0.02, 0.014), M.lencol); tomada.add(espelho);
  var plugue = new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.01, 0.008), M.lencol); plugue.position.x = 0.005; tomada.add(plugue);
  var cabo = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(0.008, 0, 0), new THREE.Vector3(0.02, -0.02, 0.01), new THREE.Vector3(0.025, -0.036, 0.03)]), 12, 0.0012, 6, false), M.lencol);
  tomada.add(cabo);

  /* tocar: diz o que é e tira a foto */
  var fotos = {};
  function foto(nome, linhas) {
    if (fotos[nome]) return; fotos[nome] = true;
    var c = document.createElement('canvas'); c.width = 900; c.height = 520; var g = c.getContext('2d');
    g.fillStyle = '#efe4c8'; g.fillRect(0, 0, 900, 520); g.strokeStyle = '#a08458'; g.lineWidth = 3; g.strokeRect(12, 12, 876, 496);
    g.fillStyle = '#3a2a18'; g.font = '34px Georgia, serif'; g.fillText(nome, 50, 80);
    g.font = 'italic 26px Georgia, serif'; linhas.forEach(function (l, i) { g.fillText(l, 50, 150 + i * 46); });
    try { if (parent !== window) parent.postMessage({ oi: 'quarto', evento: 'foto', nome: nome, img: c.toDataURL('image/jpeg', 0.85) }, location.origin); } catch (e) {}
  }
  function pega(rotulo, alvo, txt, fotoNome, linhas) {
    b.pega({ rotulo: rotulo, alvo: function () { return alvo; }, ativa: function () { return true; },
      fim: function (x, y, cancelou) { if (cancelou) return; b.estado(txt); b.vibrar(10); if (fotoNome) foto(fotoNome, linhas); } });
  }
  pega('Caderno', caderno, 'Um caderno escolar de capa azul, cheio até a metade. Uma folha presa com grampo na primeira página.', 'Caderno e folha (foto)', ['Caderno escolar de capa azul, cheio até a metade.', 'Folha presa com grampo, três linhas:', 'mostrar o relógio · a porta de serviço · parar o pêndulo']);
  pega('Bocal', bocal, 'O bocal do teto está vazio: a lâmpada foi tirada.', 'Bocal sem lâmpada', ['O bocal do teto, sem a lâmpada.', 'Alguém a tirou: o quarto ficava no escuro.']);
  pega('Carregador', tomada, 'Um carregador de celular na tomada, sem aparelho na ponta.', 'Carregador sem aparelho', ['Carregador de celular na tomada dos fundos,', 'sem aparelho na ponta.']);
  pega('Cama', cama, 'A cama ainda está desfeita, e o lençol, morno.', null, null);
  pega('Janela', janela, SAIDA === 'janela' ? 'A janela está aberta um palmo. Entra o cheiro do jasmim.' : 'A janela dá para o jardim. O jasmim sobe do lado de fora.', null, null);
  pega('Portinha', portinha, SAIDA === 'janela' ? 'A portinha do fundo, para a copa, está fechada.' : 'A portinha do fundo, para a copa, está aberta. Vem um ar frio.', null, null);

  b.comecar();
  b.estado('O quarto do jasmim.');
  window.OIQuarto = { saida: function () { return SAIDA; } };
})();
