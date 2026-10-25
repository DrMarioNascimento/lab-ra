const fs=require('fs'),path=require('path'),crypto=require('crypto');
const source=path.resolve(process.argv[2]),root=path.resolve(__dirname,'..'),dest=path.join(root,'biblioteca/fisiologia'),commit=process.argv[3];
if(!/^[a-f0-9]{40}$/.test(commit))throw Error('Revisão de origem inválida');
const hashesPath=path.join(root,'biblioteca/arquivos-originais.json'),originsPath=path.join(root,'biblioteca/origens.json');
const hashes=Object.fromEntries(Object.entries(JSON.parse(fs.readFileSync(hashesPath,'utf8'))).map(([p,h])=>[p.replaceAll('\\','/'),h]));
function hash(file){let b=fs.readFileSync(file);if(/\.(?:js|mjs|cjs|html|css|md|json|txt|py|svg|vtt|rules|gitkeep)$/i.test(file))b=Buffer.from(b.toString('utf8').replace(/\r\n/g,'\n'));return crypto.createHash('sha256').update(b).digest('hex');}
const changed=[];
function registrar(p,origem){const key='biblioteca/fisiologia/'+p,newHash=hash(path.join(dest,p));if(hashes[key]!==newHash)changed.push({arquivo:key,origem:'ra/'+origem,sha256_anterior:hashes[key]||null,sha256:newHash});hashes[key]=newHash;}
function walk(dir,rel=''){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=rel+e.name;if(e.name==='__pycache__')continue;if(e.isDirectory()){fs.mkdirSync(path.join(dest,p),{recursive:true});walk(path.join(dir,e.name),p+'/');}else if(!['index.html','tutor-origem.js'].includes(p)){fs.copyFileSync(path.join(dir,e.name),path.join(dest,p));if(p!=='manifesto.json')registrar(p,p);}}}
walk(source);
const mf=path.join(dest,'manifesto.json'),manifest=JSON.parse(fs.readFileSync(mf,'utf8'));for(const f of manifest.arquivos)f.sha256=hash(path.join(dest,f.path));manifest.adaptacaoLab='Preserva index.html e tutor-origem.js do Lab-RA; hashes conferem com esta instalação.';
fs.writeFileSync(mf,JSON.stringify(manifest,null,2)+'\n');registrar('manifesto.json','manifesto.json');
const origins=JSON.parse(fs.readFileSync(originsPath,'utf8'));origins.atualizacoes.push({data:'2026-10-25',tipo:'atualizacao-da-origem',fonte:'DrMarioNascimento/fisiologia-interativa',commit_fonte:commit,criterio:'Sincronização dos textos e placas em relevo e dos ciclos GLB/USDZ. Preservados os adaptadores index.html e tutor-origem.js do Lab-RA; o manifesto local foi refeito para esses adaptadores.',arquivos:changed});origins.ultima_sincronizacao_fisiologia={data:'2026-10-25',commit};
fs.writeFileSync(hashesPath,JSON.stringify(hashes,null,2)+'\n');fs.writeFileSync(originsPath,JSON.stringify(origins,null,2)+'\n');
const readme=path.join(root,'README.md'),marker='\n## RA de fisiologia — 25/10/2026\n';let read=fs.readFileSync(readme,'utf8'),at=read.indexOf(marker);if(at>=0){const end=read.indexOf('\n## ',at+marker.length);read=read.slice(0,at)+(end>=0?read.slice(end):'');}
fs.writeFileSync(readme,read.trimEnd()+marker+'\nSincronizada a revisão '+commit+' do Fisiologia Interativa: textos e placas extrudados e 27 modelos animados com pares GLB/USDZ. Navegação própria do Lab-RA preservada. Validações e limites em biblioteca/fisiologia/REVISAO-VOLUME-MOVIMENTO.md.\n');console.log('Arquivos atualizados:',changed.length);
