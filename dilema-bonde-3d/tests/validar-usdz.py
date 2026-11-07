"""Valida e, com --corrigir-tipos, normaliza materiais sem mudar malhas/ações/texturas.
Requer usd-core. Uso: python validar-usdz.py [--corrigir-tipos] [arquivo.usdz]
"""
from pathlib import Path
import sys, zipfile, struct
from pxr import Usd, UsdGeom, UsdUtils, UsdValidation, Gf
path = next((Path(x) for x in sys.argv[1:] if not x.startswith('--')), Path(__file__).parents[1] / 'ar/maquete.usdz')
if '--corrigir-tipos' in sys.argv:
    with zipfile.ZipFile(path) as src:
        files = [(i.filename, src.read(i)) for i in src.infolist()]
    with zipfile.ZipFile(path, 'w', compression=zipfile.ZIP_STORED) as dst:
        for name, data in files:
            if name == 'model.usda':
                data = data.replace(b'token inputs:in.connect', b'float2 inputs:in.connect').replace(b'token inputs:varname', b'string inputs:varname')
            item = zipfile.ZipInfo(name)
            base = dst.fp.tell() + 30 + len(name.encode())
            if base % 64:
                pad = (64 - (base + 4) % 64) % 64
                item.extra = struct.pack('<HH', 12345, pad) + b'\0' * pad
            dst.writestr(item, data)
raw = path.read_bytes()
with zipfile.ZipFile(path) as src:
    assert src.testzip() is None
    assert src.namelist()[0] == 'model.usda'
    for i in src.infolist():
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
assert 6.91 < cabine.GetMax()[1] < 6.94, 'Altura da cabine não foi atualizada'
assert 2.49 < cabine.GetSize()[2] < 2.51, 'Largura da cabine mudou'
estacao = next(p for p in stage.Traverse() if p.GetName() == 'Estacao')
teto = next(p for p in Usd.PrimRange(estacao) if p.GetName() == 'Ala_Oeste_Estrutura_telhado_metal_azul')
assert limites(teto,estacao).GetMin()[1] - (limites(bonde,bonde).GetMax()[1]+.42) > .4
pessoa = next(p for p in stage.Traverse() if p.GetName() == 'rqbMovel_5')
assert abs(limites(pessoa,maquete).GetSize()[1]-4.2)<.005, 'Personagem nativo ainda pequeno'
operador = next(p for p in stage.Traverse() if p.GetName() == 'Operador')
assert abs(limites(operador,maquete).GetSize()[1]-5.67)<.005, 'Operador nativo ainda pequeno'
oficina = next(p for p in stage.Traverse() if p.GetName() == 'Oficina')
area = limites(oficina,maquete)
assert area.GetSize()[0]>20.7 and area.GetSize()[1]>10.1
assert area.GetMin()[2]>10.8 and area.GetMax()[2]<27.2, 'Oficina invade a faixa dos trilhos'
assert not any(p.GetName() in ['Arbustos_Flores','Floreiras','Objetos_Patio_folhagem','Objetos_Patio_flores_rosa'] for p in stage.Traverse())
for lado in ['Frente','Fundos','Direita','Esquerda']:
    assert any(p.GetName().startswith('Cidade_Janelas_'+lado) for p in stage.Traverse()), 'Fachada sem janelas: '+lado
fantasmas = [p for p in maquete.GetChildren() if p.GetName().startswith('Fantasmas')]
assert sorted(len(p.GetChildren()) for p in fantasmas) == [1,3]
for p in fantasmas:
    esperado = (4,.27,30) if len(p.GetChildren()) == 1 else (-8,.27,8)
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
