const fs=require('fs'),path=require('path'),crypto=require('crypto'),root=path.resolve(__dirname,'..'),primary=path.resolve(process.argv[2]);
const text=fs.readFileSync(primary+'/o-impostor/ra/textos-volume.js','utf8');
const weather=fs.readFileSync(primary+'/o-impostor/ra/clima.js','utf8');
function casa(root){
 for(const f of ['a-mesa/js/ra-clima.js','o-impostor/ra/clima.js','o-impostor/maquete/js/ra-clima.js'])fs.writeFileSync(path.join(root,f),weather);
 for(const f of ['a-mesa/js/textos-volume.js','o-impostor/ra/textos-volume.js','o-impostor/maquete/js/textos-volume.js'])fs.writeFileSync(path.join(root,f),text);
 for(const folder of ['a-mesa/','o-impostor/maquete/']){
  const p=path.join(root,folder+'js/ac-maquete.js');let s=fs.readFileSync(p,'utf8');
  if(!s.includes('clima = RAClima.criar')){
   s=s.replace('var motor = null, mundo = null, ra = null, poeira = null;','var motor = null, mundo = null, ra = null, poeira = null, clima = null;');
   s=s.replace('mundo = m;','mundo = m;\n      clima = RAClima.criar(mundo.raiz,{reduzido:reduzido});').replace('animarCamadas(dt);','animarCamadas(dt);\n      if (clima) clima.update(dt);').replace('if (poeira) poeira.dispose();','if (poeira) poeira.dispose();\n    if (clima) clima.dispose();');fs.writeFileSync(p,s);
  }
  const html=path.join(root,folder+(folder==='a-mesa/'?'AC-maquete.html':'index.html'));s=fs.readFileSync(html,'utf8');if(!s.includes('js/ra-clima.js'))s=s.replace('<script src="js/ac-maquete.js','<script src="js/ra-clima.js?v=20261025"></script><script src="js/ac-maquete.js');fs.writeFileSync(html,s);
 }
 let p=path.join(root,'o-impostor/ra/farol-livro.js'),s=fs.readFileSync(p,'utf8');if(!s.includes('RAClima.criar')){s=s.replace('b.comecar();',"var clima=RAClima.criar(b.raiz,{limites:[[-.5,0,-.4],[.5,.72,.4]]});\n    b.aCadaQuadro(function(dt){clima.update(dt);});\n    addEventListener('pagehide',function(e){if(!e.persisted)clima.dispose();});\n    b.comecar();");fs.writeFileSync(p,s);}
 p=path.join(root,'o-impostor/farol.html');s=fs.readFileSync(p,'utf8');if(!s.includes('ra/clima.js'))s=s.replace('<script src="ra/farol-livro.js">','<script src="ra/clima.js?v=20261025"></script>\n<script src="ra/farol-livro.js">');fs.writeFileSync(p,s);
 function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())walk(p);else if(e.name.endsWith('.html')){let s=fs.readFileSync(p,'utf8');let t=s.replace(/(src=["'][^"']*(?:ac-maquete|farol-livro|maquete|peca3d|objeto)\.js)(?:\?[^"']*)?(["'])/g,'$1?v=volume-20261025$2');if(!s.includes('textos-volume.js'))t=t.replace(/(<script src="((?:[^"]*\/)?)(?:three\.min\.js)(?:\?[^"]*)?"><\/script>)/g,(all,tag,prefix)=>tag+'<script src="'+prefix+'textos-volume.js?v=20261025"></script>');if(s!==t)fs.writeFileSync(p,t);}}}
 walk(path.join(root,'a-mesa'));walk(path.join(root,'o-impostor'));
}
function outros(root,eco){
 const html=path.join(root,'o-impostor/mesa.html');if(fs.existsSync(html)){let h=fs.readFileSync(html,'utf8');h=h.replace(/(src=["'][^"']*(?:maquete|peca3d|objeto)\.js)(?:\?[^"']*)?(["'])/g,'$1?v=volume-20261025$2');fs.writeFileSync(html,h);}
 const dir=path.join(root,'o-impostor');fs.writeFileSync(path.join(dir,'ra-textos-volume.js'),text);
 for(const f of fs.readdirSync(dir).filter(x=>x.endsWith('.js'))){const p=path.join(dir,f);let s=fs.readFileSync(p,'utf8');if(s.includes('SCRIPTS')&&s.includes("'three.min.js'")&&!s.includes('ra-textos-volume.js')){s=s.replace(/([A-Z0-9]+ \+ 'three\.min\.js',)/,"$1 BASE + 'ra-textos-volume.js',");fs.writeFileSync(p,s);}}
 if(eco){
  fs.writeFileSync(path.join(dir,'ra-clima.js'),weather);
  const p=path.join(dir,'maquete.js');let s=fs.readFileSync(p,'utf8');
  if(!s.includes('climaRA')){
   s=s.replace("'use strict';","'use strict';\n var climaRA=null;");
   s=s.replace("BASE + 'ra-textos-volume.js',","BASE + 'ra-textos-volume.js', BASE + 'ra-clima.js',");
   s=s.replace('return carregarTudo().then(function () {',"return carregarTudo().then(function () {\n      if(!climaRA)climaRA=RAClima.criar(raiz,{host:el.querySelector('.maq-ferr')||el});");
   s=s.replace('if (ra) ra.atualizar(dt, quadroXR);',"if (ra) ra.atualizar(dt, quadroXR);\n    if(climaRA){climaRA.grupo.visible=climaRA.estado().ligado&&!dentro;if(!dentro)climaRA.update(dt);}");
   fs.writeFileSync(p,s);
  }
 }
}

const hpath=path.join(root,'biblioteca/arquivos-originais.json'),opath=path.join(root,'biblioteca/origens.json');
const hashes=Object.fromEntries(Object.entries(JSON.parse(fs.readFileSync(hpath,'utf8'))).map(([p,h])=>[p.replaceAll('\\','/'),h])),origins=JSON.parse(fs.readFileSync(opath,'utf8'));
const prefix='biblioteca/dragon/jogos/';
casa(path.join(root,prefix+'casa-da-costa'));outros(path.join(root,prefix+'a-manha-do-carro-forte'),false);outros(path.join(root,prefix+'o-eco-do-amanha'),true);
const testPath=path.join(root,prefix+'casa-da-costa/tests/ra-volume.browser.cjs');fs.mkdirSync(path.dirname(testPath),{recursive:true});fs.copyFileSync(primary+'/tests/ra-volume.browser.cjs',testPath);
fs.copyFileSync(primary+'/RA-VOLUME-MOVIMENTO.md',path.join(root,'biblioteca/dragon/RA-VOLUME-MOVIMENTO.md'));
function hash(file){let b=fs.readFileSync(file);if(/\.(?:js|mjs|cjs|html|css|md|json|txt|py|svg|vtt|rules|gitkeep)$/i.test(file))b=Buffer.from(b.toString('utf8').replace(/\r\n/g,'\n'));return crypto.createHash('sha256').update(b).digest('hex');}
function group(folder,fonte,commit,origem){
 const changed=[];function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const file=path.join(dir,e.name);if(e.isDirectory())walk(file);else{const key=path.relative(root,file).replaceAll('\\','/'),next=hash(file);if(hashes[key]!==next){changed.push({arquivo:key,origem:origem+path.relative(path.join(root,folder),file).replaceAll('\\','/'),sha256_anterior:hashes[key]||null,sha256:next});hashes[key]=next;}}}}
 if(fs.statSync(path.join(root,folder)).isDirectory())walk(path.join(root,folder));else{const key=folder,next=hash(path.join(root,folder));changed.push({arquivo:key,origem:'RA-VOLUME-MOVIMENTO.md',sha256_anterior:hashes[key]||null,sha256:next});hashes[key]=next;}
 origins.atualizacoes.push({data:'2026-10-25',tipo:'atualizacao-da-origem',fonte,commit_fonte:commit,criterio:'Porta os textos extrudados e as movimentações das RA; preserva as adaptações de navegação do Lab-RA. O clima permanece ligado à âncora e não intercepta os toques nas pistas.',arquivos:changed});console.log(fonte,changed.length,'arquivos');
}
group(prefix+'casa-da-costa','DrMarioNascimento/casa-da-costa','33ff5292c6063b0be9995fca636c2cd07a991d42','');
group(prefix+'a-manha-do-carro-forte','DrMarioNascimento/carro-forte','681127128c6042ed50863c41a521044ac949c805','');
group(prefix+'o-eco-do-amanha','DrMarioNascimento/eco-do-amanha','cdfa121ab310334ed40fab6973545888022fc08b','');
group('biblioteca/dragon/RA-VOLUME-MOVIMENTO.md','DrMarioNascimento/Dragon','b749aaab7a15e821a4903230ab692c2d3a53b8c4','');
fs.writeFileSync(hpath,JSON.stringify(hashes,null,2)+'\n');fs.writeFileSync(opath,JSON.stringify(origins,null,2)+'\n');
if(!fs.readFileSync(path.join(root,'README.md'),'utf8').includes('## RA dos jogos — 25/10/2026'))fs.appendFileSync(path.join(root,'README.md'),'\n## RA dos jogos — 25/10/2026\n\nSincronizados textos dinâmicos com relevo, clima das cenas externas da Casa da Costa e da Torre de Continuidade e preservação das animações de investigação. Confira biblioteca/dragon/RA-VOLUME-MOVIMENTO.md. A validação com câmera em iPhone e Android físicos permanece pendente.\n');
