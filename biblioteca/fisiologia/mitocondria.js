/* MITOCÔNDRIA COMPARTILHADA
   ---------------------------------------------------------------------------
   Um modelo só para todas as experiências de RA, em duas versões:
   • assets/mitocondria-aberta.glb — em corte: membranas externa e interna com o
     espaço intermembranas, cristas contínuas com a membrana interna (junções
     estreitas), ATP sintase em dímeros na borda das cristas, complexos da
     cadeia respiratória, DNA mitocondrial, ribossomos e grânulos da matriz;
   • assets/mitocondria-fechada.glb — só a membrana externa, leve, para quando
     há dezenas delas (fibra muscular) ou quando a organela aparece inteira.
   As duas medem 0,40 × ~0,21 (eixo longo = X) e trazem cor por vértice com a
   oclusão de contato já embutida. O `prepararParaRA` das páginas converte essa
   cor para o iPhone, como nas outras peças.

   Os arquivos de modelo aprovados (`modelos.js`) não mudam: cada página tira a
   mitocôndria antiga e põe esta no MESMO lugar, tamanho e orientação, depois
   que o GLB chega pela rede. Até lá a antiga continua visível. */
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const pasta = new URL('./assets/', import.meta.url);
const cache = {};
export function carregarMitocondria(tipo) {
  cache[tipo] ??= new GLTFLoader().loadAsync(new URL(`mitocondria-${tipo}.glb`, pasta).href).then(g => {
    const cena = g.scene;
    cena.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
    cena.updateMatrixWorld(true);
    const caixa = new THREE.Box3().setFromObject(cena);
    return { cena, caixa };
  });
  return cache[tipo];
}
/* tamanho e centro da peça inteira, medidos na versão fechada (a aberta perde
   uma fatia no corte e mediria menor) */
export async function medidaNativa() {
  const { caixa } = await carregarMitocondria('fechada');
  return { tam: caixa.getSize(new THREE.Vector3()), centro: caixa.getCenter(new THREE.Vector3()) };
}

/**
 * Cria uma mitocôndria pronta para entrar na cena.
 * @param {'aberta'|'fechada'} tipo
 * @param {THREE.Vector3} dims  comprimento (x), altura (y) e profundidade (z) desejados, no espaço do pai
 * @returns {Promise<THREE.Group>} grupo com a peça centrada na origem; quem chama posiciona e gira o grupo
 */
export async function novaMitocondria(tipo, dims) {
  const [{ cena }, nativa] = await Promise.all([carregarMitocondria(tipo), medidaNativa()]);
  const g = new THREE.Group(); g.name = 'mitocondria';
  const peca = cena.clone(true);                       // geometria e material compartilhados entre as cópias
  peca.position.copy(nativa.centro).negate();
  const escala = new THREE.Group();
  escala.scale.set(dims.x / nativa.tam.x, dims.y / nativa.tam.y, dims.z / nativa.tam.z);
  escala.add(peca); g.add(escala);
  return g;
}
