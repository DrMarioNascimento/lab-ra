"""Keep the same transform tracks in four prebuilt native AR variants."""
from bake import GLB,ROOT
from usdz import convert
import copy,re

def kind(name):
 if name in ['membrana_plasmatica','citosol']:return 'cell'
 if re.fullmatch(r'mitocondria_\d+_membrana',name):return 'mito'
 return None

def variants():
 full=GLB(ROOT/'celula-mobile-v2.glb')
 for name,hidden in [('completa',[]),('sem-membrana-celular',['cell']),('sem-membranas-mitocondriais',['mito']),('sem-membranas',['cell','mito'])]:
  model=GLB(ROOT/'celula-mobile-v2.glb')
  for node in model.g['nodes']:
   if kind(node.get('name','')) in hidden:node.pop('mesh',None)
  assert model.g['animations']==full.g['animations']
  dest=ROOT/f'celula-v3-{name}.glb';model.write(dest)
  convert(dest,dest.with_suffix('.usdz'))
  print(name,'GLB',dest.stat().st_size,flush=True)
if __name__=='__main__':variants()
