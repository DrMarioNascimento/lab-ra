const fs=require('fs'),path=require('path'),crypto=require('crypto'),root=path.resolve(__dirname,'..'),file=path.join(root,'manifesto.json'),m=JSON.parse(fs.readFileSync(file,'utf8'));
const hash=p=>{let b=fs.readFileSync(path.join(root,p));if(/\.(js|mjs|cjs|json|html|css|md|txt|py)$/.test(p))b=Buffer.from(b.toString('utf8').replace(/\r\n/g,'\n'));return crypto.createHash('sha256').update(b).digest('hex');};
const entries=new Map(m.arquivos.map(f=>[f.path,f]));
for(const p of ['texto-volume.js','fonte-ra.js','fonte-ra-LICENSE.txt','ciclo-portatil.js','celula/tools/glb_data.py'])entries.set(p,{path:p});
for(const d of fs.readdirSync(root,{withFileTypes:true}).filter(x=>x.isDirectory())){const dir=path.join(root,d.name,'ciclos');if(fs.existsSync(dir))for(const f of fs.readdirSync(dir))if(/\.(glb|usdz)$/.test(f))entries.set(d.name+'/ciclos/'+f,{path:d.name+'/ciclos/'+f});}
m.arquivos=[...entries.values()].map(f=>({...f,sha256:hash(f.path)}));
m.atualizacao={data:'2026-10-25',escopo:'Placas e textos extrudados; ciclos GLB e USDZ derivados dos motores das bancadas; arquivos públicos para Android e iPhone.'};
fs.writeFileSync(file,JSON.stringify(m,null,2)+'\n');console.log('Manifesto:',m.arquivos.length,'arquivos');

