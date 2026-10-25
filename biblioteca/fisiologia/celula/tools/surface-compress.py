from bake import GLB,ROOT
from PIL import Image,ImageFile
import io
ImageFile.MAXBLOCK=16*1024*1024
p=ROOT/'celula-mobile-v2.glb';b=GLB(p)
for img in b.g['images']:
 if not img.get('name','').startswith('roughness_'):continue
 v=b.g['bufferViews'][img['bufferView']];im=Image.open(io.BytesIO(b.bin[v.get('byteOffset',0):v.get('byteOffset',0)+v['byteLength']])).convert('RGB');out=io.BytesIO();im.save(out,format='JPEG',quality=86,subsampling=0);img['mimeType']='image/jpeg';img['bufferView']=b.view(out.getvalue())
b.write(p);print('mobile_bytes',p.stat().st_size)
