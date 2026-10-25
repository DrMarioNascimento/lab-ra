const fs=require('fs'),path=require('path'),validator=require('gltf-validator'),root=path.resolve(__dirname,'..');
const files=[];for(const d of fs.readdirSync(root,{withFileTypes:true}).filter(x=>x.isDirectory())){const dir=path.join(root,d.name,'ciclos');if(fs.existsSync(dir))for(const f of fs.readdirSync(dir))if(f.endsWith('.glb'))files.push(path.join(dir,f));}
for(const type of ['pelicula','travessias'])files.push(path.join(root,'celula/membrana/assets',type+'-v1.glb'));
for(const v of ['completa','sem-membrana-celular','sem-membranas-mitocondriais','sem-membranas'])files.push(path.join(root,'celula/visualizador','celula-v3-'+v+'.glb'));
(async()=>{let errors=0;for(const file of files){
 const b=fs.readFileSync(file),g=JSON.parse(b.toString('utf8',20,20+b.readUInt32LE(12)));
 if(!g.animations?.length)throw Error('Animação ausente: '+file);
 if(!g.nodes.some(n=>n.extras?.textoRA))throw Error('Texto em relevo ausente: '+file);
 for(const a of g.animations)for(const c of a.channels)if(c.target.node>=g.nodes.length)throw Error('Alvo ausente');
 const r=await validator.validateBytes(new Uint8Array(b),{maxIssues:50});errors+=r.issues.numErrors;
 console.log(path.relative(root,file),b.length,'bytes; erros',r.issues.numErrors);
 if(r.issues.numErrors)console.log(r.issues.messages);
 }if(errors)throw Error(errors+' erros de validação');console.log(files.length,'GLB animados validados.');})().catch(e=>{console.error(e);process.exitCode=1;});

