"""Usa a mesma conversão com animação da Célula Viva; não gera USDZ no telefone."""
import sys,tempfile
from pathlib import Path
TOOLS=Path(__file__).resolve().parents[2]/'tools'
sys.path.insert(0,str(TOOLS))
import usdz
assets=Path(__file__).resolve().parents[1]/'assets'
with tempfile.TemporaryDirectory(prefix='membrana-usdz-') as scratch:
 usdz.ROOT=Path(scratch)
 for name in ['pelicula','travessias']:
  usdz.convert(assets/(name+'-v1.glb'),assets/(name+'-v1.usdz'))
