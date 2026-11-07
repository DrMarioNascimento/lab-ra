/* Cópia própria do módulo de lab-ra/biblioteca/fisiologia/ra-botoes-ios.js (texturas a 512 px).
   BOTÕES NA MESA DO IPHONE · teste
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
import {placaVolume} from './texto-volume.js';
import { USDZExporter } from 'three/addons/exporters/USDZExporter.js';
import { comportamentoRelogio } from './relogio-usdz.js?v=20261107-ra7';
import { unzipSync, zipSync, strFromU8, strToU8 } from 'three/addons/libs/fflate.module.js';

function placa(rotulo, larguraM, alturaM) {
 const p=placaVolume(rotulo,{largura:larguraM,altura:alturaM,espessura:.006});
 p.rotation.x=-Math.PI/2; return p;
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
    quickLookCompatible: true, maxTextureSize: 512,
    ar: { anchoring: { type: 'plane' }, planeAnchoring: { alignment: 'horizontal' } },
  });
  const arquivos = unzipSync(new Uint8Array(zip));
  const usda = strFromU8(arquivos['model.usda']);
  const { mapa, fimDaCena, linhas } = caminhosDoUsda(usda);
  if (fimDaCena < 0) throw new Error('cena não encontrada no USDA');
  const caminho = nome => { const c = mapa.get(nome); if (!c) throw new Error('prim ausente: ' + nome); return c; };

  /* PERCURSO: grupo em SÉRIE de passos; cada passo é um grupo PARALELO que
     leva todas as partes…15190 tokens truncated…    for i in src.infolist():
        offset = i.header_offset + 30 + len(i.filename.encode()) + struct.unpack_from('<H', raw, i.header_offset + 28)[0]
        assert offset % 64 == 0 and i.compress_type == 0, i.filename
stage = Usd.Stage.Open(str(path))
assert stage
assert not UsdUtils.ComputeAllDependencies(str(path))[2], 'Referências ausentes'
errors = UsdValidation.ValidationContext(UsdValidation.ValidationRegistry().GetOrLoadAllValidators()).Validate(stage)
for e in errors: print(e.GetErrorAsString())
assert not errors, f'{len(errors)} falhas de validação'
behaviors = [p for p in stage.Traverse() if p.GetTypeName() == 'Preliminary_Behavior']
assert len(behaviors) == 4
relogio = next(p for p in behaviors if p.GetName() == 'Relogio_Continuo')
assert relogio.GetChild('Inicio').GetAttribute('type').Get() == 'enter'
for i, (nome, periodo) in enumerate(zip(['Ponteiro_Horas','Ponteiro_Minutos','Ponteiro_Segundos'],[43200,3600,60])):
    ciclo = relogio.GetChild('Ponteiros').GetChild('Ciclo_'+str(i))
    assert ciclo.GetAttribute('loops').Get()
    girar = ciclo.GetChild('Girar')
    assert girar.GetAttribute('duration').Get() == periodo
    assert girar.GetAttribute('axis').Get() == (0,0,-1)
    alvo = girar.GetRelationship('affectedObjects').GetTargets()
    assert len(alvo) == 1 and alvo[0].name == nome
araucarias = stage.GetPrimAtPath('/Root/Scenes/Scene/Maquete_RA/Maquete/Araucarias')
assert araucarias, 'Araucárias ausentes'
assert len(araucarias.GetChildren()) == 2, 'Esperadas exatamente duas araucárias'
maquete = stage.GetPrimAtPath('/Root/Scenes/Scene/Maquete_RA/Maquete')
cache = UsdGeom.XformCache()
def limites(prim, referencia):
    caixa = Gf.Range3d()
    inversa = cache.GetLocalToWorldTransform(referencia).GetInverse()
    for item in Usd.PrimRange(prim):
        if item.IsA(UsdGeom.Mesh):
            matriz = cache.GetLocalToWorldTransform(item) * inversa
            for ponto in UsdGeom.Mesh(item).GetPointsAttr().Get():
                caixa.UnionWith(matriz.Transform(Gf.Vec3d(ponto)))
    return caixa
bonde = next(p for p in stage.Traverse() if p.GetName() == 'Bonde')
carroceria = bonde.GetChild('Carroceria')
cabine = limites(carroceria, bonde)
assert 5.52 < cabine.GetMax()[1] < 5.55, 'Altura da cabine não foi atualizada'
assert 2.49 < cabine.GetSize()[2] < 2.51, 'Largura da cabine mudou'
estacao = next(p for p in stage.Traverse() if p.GetName() == 'Estacao')
teto = next(p for p in Usd.PrimRange(estacao) if p.GetName() == 'Ala_Oeste_Estrutura_telhado_metal_azul')
assert limites(teto,estacao).GetMin()[1] - (limites(bonde,bonde).GetMax()[1]+.42) > .4
pessoa = next(p for p in stage.Traverse() if p.GetName() == 'rqbMovel_5')
assert abs(limites(pessoa,maquete).GetSize()[1]-4.2)<.005, 'Personagem nativo ainda pequeno'
fantasmas = [p for p in maquete.GetChildren() if p.GetName().startswith('Fantasmas')]
assert sorted(len(p.GetChildren()) for p in fantasmas) == [1,3]
for p in fantasmas:
    esperado = (4,.27,30) if len(p.GetChildren()) == 1 else (-8,.27,14)
    pos = UsdGeom.Xformable(p).GetLocalTransformation().ExtractTranslation()
    assert all(abs(a-b)<1e-8 for a,b in zip(pos,esperado)), 'Fantasmas fora do local do impacto'
    cache = UsdGeom.XformCache()
    cena = maquete.GetParent().GetParent()
    invCena = cache.GetLocalToWorldTransform(cena).GetInverse()
    for f in p.GetChildren():
        indice = f.GetName().removeprefix('rqbMovel_')
        repouso = (cache.GetLocalToWorldTransform(f)*invCena).ExtractTranslation()
        for nome in ['rqbAlvo_0_0_'+indice,'rqbAlvo_1_0_'+indice,'rqbAlvo_2_0_'+indice]:
            alvo = cena.GetChild(nome)
            assert alvo, 'Destino da animação ausente'
            destino = UsdGeom.Xformable(alvo).GetLocalTransformation().ExtractTranslation()
            assert (destino-repouso).GetLength()<1e-8, 'Animação do fantasma volta ao centro'
for p in stage.Traverse():
    for rel in p.GetRelationships():
        for target in rel.GetTargets():
            assert stage.GetObjectAtPath(target), f'Alvo ausente: {p.GetPath()} -> {target}'
print(f'OK: {path.name}; {len(raw)} bytes; 3 percursos/botões e relógio independente; malhas, texturas e alvos válidos; 30 validadores OpenUSD sem falhas.')
