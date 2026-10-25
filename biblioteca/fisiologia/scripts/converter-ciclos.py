import sys,tempfile,json
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'celula'/'tools'))
import usdz
root=Path(__file__).resolve().parents[1]
files=list(root.glob('*/ciclos/*.glb'))+list((root/'celula'/'visualizador').glob('celula-v3-*.glb'))
for source in files:
 # O conversor grava deformações como UsdSkelBlendShape, além das trilhas TRS.
 if source.with_suffix('.usdz').exists() and source.with_suffix('.usdz').stat().st_mtime>source.stat().st_mtime:continue
 # GLB já comprimido (comprimir-ciclos.mjs): o USDZ saiu do GLB cru, antes da compressão.
 if b'KHR_draco_mesh_compression' in source.read_bytes()[:200000]:continue
 with tempfile.TemporaryDirectory(prefix='ciclo-usdz-') as folder:
  usdz.ROOT=Path(folder);usdz.convert(source,source.with_suffix('.usdz'))

