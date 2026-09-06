/* Cor fiel na realidade aumentada.
   ---------------------------------------------------------------------------
   O DEFEITO QUE ISTO DESFAZ. As bancadas pintam por VÉRTICE: a sombra de
   contato, o tecido do músculo, a membrana, as nuvens de íons. O caminho do
   iPhone converte o modelo para USDZ, e o USDZ não carrega cor por vértice —
   cada malha assim sai com `diffuseColor = (1, 1, 1)` e chega branca no
   aparelho. Não é detalhe: são 82% dos triângulos no nível 03 da película, e
   o que some é justamente o assunto do nível.

   O CONSERTO É UMA PALETA. Medido nas dez telas, cada malha pintada por
   vértice usa de 80 a 223 cores distintas — cabem todas numa textura de
   dezenas de pixels. Cada cor vira um BLOCO de 4×4 texels e o UV do vértice
   aponta para o centro do bloco. O bloco existe por causa do filtro: o
   Quick Look escolhe como amostrar, e no centro de um bloco uniforme tanto
   faz — bilinear ou mipmap raso devolvem a mesma cor. Um texel solto ficaria
   à mercê do vizinho.

   ONDE ISTO PODE SER USADO. Só no clone que vai para a exportação, NUNCA na
   cena da tela: `clone(true)` compartilha geometria e material com o
   original, então aqui tudo que se altera é clonado antes. Mexer sem clonar
   apagaria a cor da bancada em uso.
   --------------------------------------------------------------------------- */
import * as THREE from 'three';

/* Um mapa qualquer significa que o UV daquela malha já tem dono: assar por
   cima trocaria a textura de lugar. Essas malhas ficam como estão. */
const MAPAS = ['map', 'normalMap', 'roughnessMap', 'metalnessMap', 'emissiveMap',
  'aoMap', 'alphaMap', 'bumpMap', 'displacementMap', 'lightMap',
  'clearcoatMap', 'sheenColorMap', 'specularMap', 'iridescenceMap'];

const temMapa = m => MAPAS.some(k => m[k]);

const BLOCO = 4; // texels por cor

function paletaDe(cor) {
  const c = new THREE.Color();
  const onde = new Map(); const paleta = [];
  const indice = new Uint32Array(cor.count);
  for (let i = 0; i < cor.count; i++) {
    /* o atributo de cor está no espaço de trabalho (linear); a textura é lida
       como sRGB, então a conversão tem de acontecer aqui e não no aparelho */
    c.setRGB(cor.getX(i), cor.getY(i), cor.getZ(i));
    const hex = c.getHex(THREE.SRGBColorSpace);
    let k = onde.get(hex);
    if (k === undefined) { k = paleta.length; onde.set(hex, k); paleta.push(hex); }
    indice[i] = k;
  }
  return { paleta, indice };
}

function texturaDe(paleta) {
  const colunas = Math.ceil(Math.sqrt(paleta.length));
  const lado = colunas * BLOCO;
  const tela = document.createElement('canvas');
  tela.width = tela.height = lado;
  const ctx = tela.getContext('2d');
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, lado, lado);
  paleta.forEach((hex, k) => {
    ctx.fillStyle = '#' + hex.toString(16).padStart(6, '0');
    ctx.fillRect((k % colunas) * BLOCO, Math.floor(k / colunas) * BLOCO, BLOCO, BLOCO);
  });
  const tex = new THREE.CanvasTexture(tela);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.magFilter = tex.minFilter = THREE.NearestFilter;
  tex.generateMipmaps = false;
  tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
  /* o glTF põe a origem da imagem no alto; sem isto o UV cai no bloco espelhado
     e cada peça sai com a cor de outra */
  tex.flipY = false;
  tex.needsUpdate = true;
  return { tex, colunas, lado };
}

/* Assa a cor por vértice numa paleta e devolve o que mudou, para conferência.
   Também joga fora UV que não serve a mapa nenhum: o exportador de USDZ
   escreve tudo em TEXTO, então atributo morto é peso morto. */
export function corParaRA(raiz) {
  const conta = { assadas: 0, cores: 0, tingidas: 0, uvDescartado: 0, ignoradas: 0 };
  raiz.traverse(o => {
    if (!o.isMesh || Array.isArray(o.material)) { if (o.isMesh) conta.ignoradas++; return; }
    const cor = o.geometry.attributes.color;
    const pinta = o.material.vertexColors && cor;

    /* Cor por vértice E textura na mesma malha: o UV já tem dono e assar por
       cima trocaria a textura de lugar. Não dá para salvar o desenho da cor,
       mas dá para salvar o TOM — a média das cores entra no material e
       multiplica a textura, que é o que a cor por vértice fazia. Sem isto a
       peça vai para o aparelho clara demais, com a sombra de contato perdida. */
    if (pinta && temMapa(o.material)) {
      let r = 0, g = 0, b = 0;
      for (let i = 0; i < cor.count; i++) { r += cor.getX(i); g += cor.getY(i); b += cor.getZ(i); }
      o.material = o.material.clone();
      o.material.color = o.material.color.clone().multiply(
        new THREE.Color(r / cor.count, g / cor.count, b / cor.count));
      o.material.vertexColors = false;
      o.geometry = o.geometry.clone();
      o.geometry.deleteAttribute('color');
      o.material.needsUpdate = true;
      conta.tingidas++;
      return;
    }

    if (pinta) {
      const { paleta, indice } = paletaDe(cor);
      const { tex, colunas, lado } = texturaDe(paleta);
      const uv = new Float32Array(indice.length * 2);
      for (let i = 0; i < indice.length; i++) {
        const bx = indice[i] % colunas, by = Math.floor(indice[i] / colunas);
        uv[i * 2]     = (bx * BLOCO + BLOCO / 2) / lado;
        uv[i * 2 + 1] = (by * BLOCO + BLOCO / 2) / lado;
      }
      o.geometry = o.geometry.clone();
      o.geometry.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
      o.geometry.deleteAttribute('color'); // já está na paleta
      o.material = o.material.clone();
      o.material.vertexColors = false;
      o.material.color = new THREE.Color(0xffffff); // a paleta é que pinta
      o.material.map = tex;
      o.material.needsUpdate = true;
      conta.assadas++; conta.cores += paleta.length;
      return;
    }

    if (o.geometry.attributes.uv && !temMapa(o.material)) {
      o.geometry = o.geometry.clone();
      o.geometry.deleteAttribute('uv');
      conta.uvDescartado++;
    }
  });
  return conta;
}
