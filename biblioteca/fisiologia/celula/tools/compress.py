from bake import GLB,ROOT
from PIL import Image, ImageFile
ImageFile.MAXBLOCK=16*1024*1024
import io
p=ROOT/'celula-mobile-v2.glb';b=GLB(p)
for img in b.g['images']:
 name=img.get('name','')
 if not name.startswith(('color_','normal_','roughness_')):continue
 v=b.g['bufferViews'][img['bufferView']];data=b.bin[v.get('byteOffset',0):v.get('byteOffset',0)+v['byteLength']];im=Image.open(io.BytesIO(data));im.thumbnail((512,512) if name.startswith('color_') else (256,256),Image.Resampling.LANCZOS);out=io.BytesIO()
 if name.startswith(('color_','normal_')):im.convert('RGB').save(out,format='JPEG',quality=85,subsampling=0);img['mimeType']='image/jpeg'
 else:im.save(out,format='PNG',optimize=True)
 img['bufferView']=b.view(out.getvalue())
b.write(p);print('mobile_bytes',p.stat().st_size)
