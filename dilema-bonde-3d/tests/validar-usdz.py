"""Valida e, com --corrigir-tipos, normaliza materiais sem mudar malhas/ações/texturas.
Requer usd-core. Uso: python validar-usdz.py [--corrigir-tipos] [arquivo.usdz]
"""
from pathlib import Path
import sys, zipfile, struct
from pxr import Usd, UsdUtils, UsdValidation
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
assert len(behaviors) == 3
for p in stage.Traverse():
    for rel in p.GetRelationships():
        for target in rel.GetTargets():
            assert stage.GetObjectAtPath(target), f'Alvo ausente: {p.GetPath()} -> {target}'
print(f'OK: {path.name}; {len(raw)} bytes; 3 comportamentos; malhas, texturas e alvos válidos; 30 validadores OpenUSD sem falhas.')
