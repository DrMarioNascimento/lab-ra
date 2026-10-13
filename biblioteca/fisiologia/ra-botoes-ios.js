/* BOTÕES NA MESA DO IPHONE · teste
   ---------------------------------------------------------------------------
   O AR Quick Look não aceita controles da página, mas lê "comportamentos" de
   dentro do próprio USDZ — o esquema Preliminary_Behavior da Apple, o mesmo
   que o Reality Composer grava: um TOQUE num objeto dispara uma AÇÃO. Aqui
   cada estado da peça (relaxado, contraído…) ganha uma plaquinha na mesa; o
   toque na placa leva as partes que se movem até a pose daquele estado, com
   uma transição suave. As poses vêm da MESMA função que desenha a tela; este
   módulo só as empacota.

   Como se faz, sem Mac:
     1. cada parte que se move ganha, no topo da cena, um "alvo" vazio por
        estado, com a transformação daquele estado já medida na cena;
     2. o USDZExporter do three escreve a cena (com as placas e os alvos);
     3. abre-se o USDZ, acrescenta-se o bloco "Behaviors" dentro da cena
        (gatilho TapGesture na placa → grupo paralelo de ações Transform,
        tipo "absolute", até os alvos) e o arquivo é refeito com o alinhamento
        de 64 bytes que o Quick Look exige.
   --------------------------------------------------------------------------- */
import * as THREE from 'three';
import { USDZExporter } from 'three/addons/exporters/USDZExporter.js';
import { unzipSync, zipSync, strFromU8, strToU8 } from 'three/addons/libs/fflate.module.js';

function placa(rotulo, larguraM, alturaM) {
  const c = document.createElement('canvas'); c.width = 512; c.height = Math.round(512 * alturaM / larguraM);
  const g = c.getContext('2d');
  g.fillStyle = '#123446'; g.fillRect(0, 0, c.width, c.height);
  g.strokeStyle = '#9ce4ed'; g.lineWidth = 14; g.strokeRect(7, 7, c.width - 14, c.height - 14);
  g.fillStyle = '#ffffff'; g.font = `700 ${Math.round(c.height * .46)}px Inter, Arial, sans-serif`;
  g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(rotulo, c.width / 2, c.height / 2 + 2);
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
  const mat = new THREE.MeshStandardMaterial({ map: tex, roughness: .7, metalness: 0 });
  /* caixa fina: a face de cima mostra o texto, e a placa fica de pé sozinha */
  const geo = new THREE.BoxGeometry(larguraM, .006, alturaM);
  return new THREE.Mesh(geo, mat);
}

/* caminhos dos prims no USDA, pelo nome: acompanha `def … "nome"` e as
   chaves de bloco, ignorando as chaves que ficam dentro dos metadados ( ) */
function caminhosDoUsda(texto) {
  const linhas = texto.split('\n'), pilha = [], mapa = new Map();
  let pendente = null, parenteses = 0, fimDaCena = -1;
  for (let i = 0; i < linhas.length; i++) {
    const l = linhas[i];
    const d = l.match(/^\s*def\s+(?:\w+\s+)?"([^"]+)"/);
    if (d) pendente = d[1];
    for (const ch of l) {
      if (ch === '(') parenteses++;
      else if (ch === ')') parenteses--;
      else if (parenteses === 0 && ch === '{') {
        if (pendente !== null) { pilha.push(pendente); mapa.set(pendente, '/' + pilha.join('/')); pendente = null; }
        else pilha.push(null);
      } else if (parenteses === 0 && ch === '}') {
        const saiu = pilha.pop();
        if (saiu === 'Scene' && pilha.join('/') === 'Root/Scenes') fimDaCena = i;
      }
    }
  }
  return { mapa, fimDaCena, linhas };
}

/**
 * @param {object} o
 * @param {THREE.Object3D} o.peca   peça já preparada para a mesa (escala real, no chão, cores de RA)
 * @param {THREE.Object3D[]} o.moveis  partes da peça que se movem entre os estados
 * @param {{rotulo:string, poses?:THREE.Matrix4[], passos?:{poses:THREE.Matrix4[], duracao:number, ease?:string}[]}[]} o.estados
 *   pose LOCAL de cada parte em cada estado; ou, para um percurso, uma SEQUÊNCIA de passos
 *   (cada passo leva todas as partes juntas até as suas poses, um passo depois do outro)
 * @param {number} [o.duracao=1.2]  segundos da transição
 * @returns {Promise<{usdz:Uint8Array, usda:string}>}
 */
export async function usdzComBotoes({ peca, moveis, estados, duracao = 1.2 }) {
  const raiz = new THREE.Group(); raiz.name = 'rqbRaiz';
  raiz.add(peca);
  moveis.forEach((m, i) => { m.name = 'rqbMovel_' + i; });
  /* ALVOS NO TOPO DA CENA, COM A POSE JÁ EM COORDENADAS DA CENA.
     Antes, cada alvo ficava ao lado da parte (mesmo pai) com a pose LOCAL. No
     iPhone, o toque fazia outro movimento: as peças se separavam. A pose local
     dos discos Z (±1,2, sem a escala de 0,37 que a peça recebe no pai) foi
     lida como se fosse da cena: os discos iam para longe, maiores, e as
     titinas para o centro. Com o alvo pendurado direto na raiz e a pose
     multiplicada pelas transformações dos pais, pose local e pose na cena
     passam a ser a mesma coisa, e o movimento sai certo nas duas leituras. */
  raiz.updateMatrixWorld(true);
  const novoAlvo = (nome, m, pose) => {
    const alvo = new THREE.Object3D(); alvo.name = nome;
    new THREE.Matrix4().multiplyMatrices(m.parent.matrixWorld, pose)
      .decompose(alvo.position, alvo.quaternion, alvo.scale);
    raiz.add(alvo);
  };
  estados.forEach((e, k) => {
    if (e.passos) e.passos.forEach((ps, j) => moveis.forEach((m, i) => novoAlvo(`rqbAlvo_${k}_${j}_${i}`, m, ps.poses[i])));
    else moveis.forEach((m, i) => novoAlvo(`rqbAlvo_${k}_${i}`, m, e.poses[i]));
  });
  /* placas à frente da peça, no chão, lado a lado */
  raiz.updateMatrixWorld(true);
  const caixa = new THREE.Box3().setFromObject(peca);
  /* placas grandes e afastadas da peça: alvo fácil e nunca encobertas */
  const larg = .16, alt = .065, vao = .05, n = estados.length;
  estados.forEach((e, k) => {
    const p = placa(e.rotulo, larg, alt); p.name = 'rqbBotao_' + k;
    p.position.set((caixa.min.x + caixa.max.x) / 2 + (k - (n - 1) / 2) * (larg + vao), .003, caixa.max.z + alt / 2 + .10);
    raiz.add(p);
  });
  raiz.updateMatrixWorld(true);

  const zip = await new USDZExporter().parseAsync(raiz, {
    quickLookCompatible: true,
    ar: { anchoring: { type: 'plane' }, planeAnchoring: { alignment: 'horizontal' } },
  });
  const arquivos = unzipSync(new Uint8Array(zip));
  const usda = strFromU8(arquivos['model.usda']);
  const { mapa, fimDaCena, linhas } = caminhosDoUsda(usda);
  if (fimDaCena < 0) throw new Error('cena não encontrada no USDA');
  const caminho = nome => { const c = mapa.get(nome); if (!c) throw new Error('prim ausente: ' + nome); return c; };

  /* PERCURSO: grupo em SÉRIE de passos; cada passo é um grupo PARALELO que
     leva todas as partes ao mesmo tempo. Duração zero trava o Quick Look em
     alguns casos, então o menor passo dura 0,01 s. */
  const sequencia = (passos, k) => {
    const l = ['      rel actions = [' + passos.map((_, j) => `<Passo_${k}_${j}>`).join(', ') + ']',
      '      token info:id = "Group"', '      bool loops = 0', '      int performCount = 1', '      token type = "serial"', ''];
    passos.forEach((ps, j) => {
      l.push(`      def Preliminary_Action "Passo_${k}_${j}"`, '      {',
        '        rel actions = [' + moveis.map((_, i) => `<Mover_${k}_${j}_${i}>`).join(', ') + ']',
        '        token info:id = "Group"', '        bool loops = 0', '        int performCount = 1', '        token type = "parallel"', '');
      moveis.forEach((_, i) => l.push(
        `        def Preliminary_Action "Mover_${k}_${j}_${i}"`, '        {',
        `          rel affectedObjects = <${caminho('rqbMovel_' + i)}>`,
        `          double duration = ${Math.max(.01, ps.duracao)}`, `          token easeType = "${ps.ease || 'none'}"`,
        '          token info:id = "Transform"', '          token type = "absolute"',
        `          rel xformTarget = <${caminho(`rqbAlvo_${k}_${j}_${i}`)}>`, '        }'));
      l.push('      }');
    });
    return l;
  };
  const b = ['', 'def Scope "Behaviors"', '{'];
  estados.forEach((e, k) => {
    b.push(`  def Preliminary_Behavior "Comportamento_${k}"`, '  {',
      `    rel triggers = <Toque_${k}>`, `    rel actions = <Grupo_${k}>`, '    uniform bool exclusive = 0', '',
      `    def Preliminary_Trigger "Toque_${k}"`, '    {',
      `      rel affectedObjects = <${caminho('rqbBotao_' + k)}>`, '      token info:id = "TapGesture"', '    }', '',
      `    def Preliminary_Action "Grupo_${k}"`, '    {');
    if (e.passos) { b.push(...sequencia(e.passos, k), '    }', '  }', ''); return; }
    b.push('      rel actions = [' + moveis.map((_, i) => `<Mover_${k}_${i}>`).join(', ') + ']',
      '      token info:id = "Group"', '      bool loops = 0', '      int performCount = 1', '      token type = "parallel"', '');
    moveis.forEach((_, i) => b.push(
      `      def Preliminary_Action "Mover_${k}_${i}"`, '      {',
      `        rel affectedObjects = <${caminho('rqbMovel_' + i)}>`,
      `        double duration = ${duracao}`, '        token easeType = "inout"',
      '        token info:id = "Transform"', '        token type = "absolute"',
      `        rel xformTarget = <${caminho(`rqbAlvo_${k}_${i}`)}>`, '      }'));
    b.push('    }', '  }', '');
  });
  b.push('}');
  linhas.splice(fimDaCena, 0, ...b.map(l => '      ' + l));
  const novo = linhas.join('\n');
  arquivos['model.usda'] = strToU8(novo);
  /* GEOMETRIA COM 4 CASAS. O exportador escreve cada vértice, normal e UV em
     TEXTO com até 16 algarismos, e o USDZ não pode ser comprimido. No osso,
     isso dava 52 MB. Quatro casas na unidade do modelo ficam muito abaixo do
     milímetro na mesa, invisível para o olho e um terço menor no arquivo. */
  for (const nome of Object.keys(arquivos)) {
    if (!nome.startsWith('geometries/')) continue;
    arquivos[nome] = strToU8(strFromU8(arquivos[nome]).replace(/(\d\.\d{4})\d+/g, '$1'));
  }
  /* GEOMETRIAS REPETIDAS VIRAM UMA SÓ. Peças clonadas ganham geometria com
     outro número e o exportador grava uma cópia inteira para cada uma; quando
     o conteúdo é idêntico, todas passam a apontar para o mesmo arquivo. */
  const porConteudo = new Map(), troca = new Map();
  for (const nome of Object.keys(arquivos)) {
    if (!nome.startsWith('geometries/')) continue;
    const chave = strFromU8(arquivos[nome]);
    if (porConteudo.has(chave)) { troca.set(nome, porConteudo.get(chave)); delete arquivos[nome]; }
    else porConteudo.set(chave, nome);
  }
  if (troca.size) {
    let texto = strFromU8(arquivos['model.usda']);
    for (const [de, para] of troca) texto = texto.split('@./' + de + '@').join('@./' + para + '@');
    arquivos['model.usda'] = strToU8(texto);
  }

  /* refaz o zip: model.usda primeiro e cada arquivo alinhado a 64 bytes */
  const ordem = ['model.usda', ...Object.keys(arquivos).filter(f => f !== 'model.usda')];
  /* cabeçalho local do zip = 30 bytes + nome + campo extra (4 + enchimento):
     o enchimento põe o INÍCIO DOS DADOS de cada arquivo num múltiplo de 64 */
  const saida = {}; let pos = 0;
  for (const nome of ordem) {
    const dado = arquivos[nome], base = pos + 30 + nome.length;
    let extra = 0;
    if (base % 64) { const p = (64 - ((base + 4) % 64)) % 64; extra = 4 + p; saida[nome] = [dado, { extra: { 12345: new Uint8Array(p) } }]; }
    else saida[nome] = dado;
    pos = base + extra + dado.length;
  }
  const usdz = zipSync(saida, { level: 0 });
  return { usdz, usda: strFromU8(arquivos['model.usda']), alinhado: alinhamento(usdz) };
}

/* confere: onde começam os dados de cada arquivo dentro do zip */
export function alinhamento(zip) {
  const v = new DataView(zip.buffer, zip.byteOffset, zip.byteLength), lista = [];
  let p = 0;
  while (p + 30 <= zip.length && v.getUint32(p, true) === 0x04034b50) {
    const tam = v.getUint32(p + 18, true), nl = v.getUint16(p + 26, true), el = v.getUint16(p + 28, true);
    const nome = new TextDecoder().decode(zip.subarray(p + 30, p + 30 + nl)), dados = p + 30 + nl + el;
    lista.push({ nome, dados, ok: dados % 64 === 0 });
    p = dados + tam;
  }
  return lista;
}
