import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizar,sortear,PADRAO,nomeGrupo,textoGrupo,novaEntrada,registrarEntrada} from '../dilema-bonde-3d/js/configuracao.js';
import {criarRodada} from '../dilema-bonde-3d/js/rodada.js';
import {resolverQualidade,adaptarResolucao,selecionarArvores} from '../dilema-bonde-3d/js/qualidade.js';
import {refletir} from '../dilema-bonde-3d/js/etica.js';
function setup(c={}){let avancou=0;const m={estado:{rodando:false,travado:false},rota:'principal',reiniciar(){this.estado.rodando=false;this.estado.travado=false;},definirRota(r){if(this.estado.travado)return false;this.rota=r;return true;},partir(){this.estado.rodando=true;},update(dt){if(this.estado.rodando)avancou+=dt;},async configurar(g){this.grupos=g;}};let resultado;const r=criarRodada(m,{...PADRAO,...c},{aoResultado:v=>resultado=v});return {m,r,avancou:()=>avancou,resultado:()=>resultado};}
test('configuração limita entradas e clássico mantém 3/1 desconhecidos',()=>{
 assert.deepEqual(normalizar({nPrincipal:Infinity,nRamal:-2,tempo:900,principal:'<script>'}),{...PADRAO,nRamal:0,tempo:60});
 const c=normalizar({modo:'classico',nPrincipal:5,nRamal:4,principal:'colega'});assert.equal(c.nPrincipal,3);assert.equal(c.nRamal,1);assert.equal(c.principal,'desconhecidos');
});
test('sortear conserva quantidades, velocidade e escolhas de acessibilidade',()=>{const c=normalizar({nPrincipal:5,nRamal:0,velocidade:6,movimentoReduzido:true});for(let i=0;i<20;i++){const s=sortear(c);assert.equal(s.nPrincipal,5);assert.equal(s.nRamal,0);assert.equal(s.velocidade,6);assert(s.movimentoReduzido);assert.notEqual(s.principal,s.ramal);assert.notEqual(s.principal,c.principal);}});
test('pausa manual e menu preservam fração do cronômetro independentemente',()=>{const {r}=setup();r.play();r.atualizar(.6);r.bloquear('menu',true);r.atualizar(8);assert.equal(r.estado().tempo,10);r.bloquear('menu',false);r.atualizar(.5);assert.equal(r.estado().tempo,9);r.play();r.bloquear('menu',true);r.bloquear('menu',false);r.atualizar(8);assert.equal(r.estado().tempo,9);r.play();r.atualizar(1);assert.equal(r.estado().tempo,8);});
test('menu e perda de rastreamento interrompem percurso sem reiniciar a simulação',()=>{const {r,m,avancou}=setup({tempo:0});r.play();r.atualizar(.1);assert(m.estado.rodando);const antes=avancou();r.bloquear('menu',true);r.bloquear('rastreio',true);r.atualizar(2);r.bloquear('menu',false);r.atualizar(2);assert.equal(avancou(),antes);r.bloquear('rastreio',false);r.atualizar(.5);assert.equal(avancou(),antes+.5);});
test('decisão trava na agulha, resultado usa quantidades e não repete sozinho',()=>{const {r,m,resultado}=setup({nPrincipal:2,nRamal:0,loop:true});r.escolher('ramal');m.estado.travado=true;assert(!r.escolher('principal'));m.estado.aoImpacto('ramal');m.estado.aoFim();assert.equal(resultado().atingidos,0);assert.equal(resultado().poupados,2);r.play();r.atualizar(100);assert.equal(r.estado().fase,'resultado');});
test('nova rodada transacional mantém cenário anterior na falha e bloqueia concorrência',async()=>{const {r,m}=setup();let falhar;m.configurar=()=>new Promise((_,rej)=>falhar=rej);const p=r.nova({...PADRAO,nPrincipal:5});assert(r.estado().ocupada);assert.equal(await r.nova(),false);falhar(Error('offline'));await assert.rejects(p,/offline/);assert.equal(r.config().nPrincipal,1);assert(!r.estado().ocupada);});
test('nova configuração restaura principal, zera animação e aplica velocidade',async()=>{const {r,m}=setup();r.escolher('ramal');await r.nova({...PADRAO,velocidade:6,nRamal:5,tempo:25});assert.equal(m.grupos.nRamal,5);assert.equal(m.estado.vMax,6);assert.equal(m.rota,'principal');assert.equal(r.estado().tempo,25);assert.equal(r.estado().fase,'pronta');});
test('pressão usa três segundos; movimento reduzido respeita decisão antes do desfecho',()=>{const {r,m}=setup({pressao:true,movimentoReduzido:true});r.play();r.atualizar(2);assert(!m.estado.rodando);let passos=0;m.update=()=>{if(++passos>5)m.estado.aoFim();};r.atualizar(1);assert.equal(r.estado().fase,'resultado');});
test('indicadores finitos, limitados e ramal vazio não inventa vítimas',()=>{for(const rota of ['principal','ramal'])for(const n of [0,1,5]){const r=refletir({...PADRAO,nRamal:n},rota);assert.equal(r.atingidos,rota==='ramal'?n:1);assert(r.indicadores.every(i=>Number.isFinite(i.valor)&&i.valor>=0&&i.valor<=100));}});
test('qualidade automática respeita aparelho e economia de dados',()=>{assert.equal(resolverQualidade('auto',{movel:true}),'equilibrada');assert.equal(resolverQualidade('auto',{memoria:4}),'economica');assert.equal(resolverQualidade('auto',{saveData:true}),'economica');assert.equal(resolverQualidade('detalhada',{movel:true}),'detalhada');});
test('resolução automática só diminui após janela lenta e não altera framebuffer XR ativo',()=>{let t=0,ratio=1.25;const renderer={xr:{isPresenting:false},getPixelRatio:()=>ratio,setPixelRatio:v=>ratio=v};const tick=adaptarResolucao({automatica:true,renderer,agora:()=>t});for(let i=0;i<5;i++){t+=1000;tick();}assert.equal(ratio,1);renderer.xr.isPresenting=true;t+=6000;tick();assert.equal(ratio,1);});
test('seleção da vegetação prioriza bordas, respeita orçamento e não muta candidatos',()=>{const a=[{x:0,z:0},{x:70,z:0}],b=[{x:1,z:46}];const r=selecionarArvores(a,b,2);assert.equal(r.novas.length,1);assert.equal(r.antigas.length,1);assert.equal(r.novas[0].x,70);assert.equal(a.length,2);});

test('texturas originais são preservadas byte a byte nas variantes de árvore',async()=>{
 const {NodeIO}=await import('@gltf-transform/core'),{ALL_EXTENSIONS}=await import('@gltf-transform/extensions'),{MeshoptDecoder}=await import('meshoptimizer'),{createHash}=await import('node:crypto');await MeshoptDecoder.ready;
 const io=new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({'meshopt.decoder':MeshoptDecoder});
 const imagens=d=>d.getRoot().listTextures().map(t=>createHash('sha256').update(t.getImage()).digest('hex')).sort();
 for(const nome of ['arvore','arvore_nova1']){const original=await io.read(new URL('../dilema-bonde-3d/assets/'+nome+'_ra.glb',import.meta.url).pathname);for(const perfil of ['mobile','economica']){const d=await io.read(new URL('../dilema-bonde-3d/assets/'+nome+'_'+perfil+'.glb',import.meta.url).pathname);assert.deepEqual(imagens(d),imagens(original));}}
});

test('som, rótulos e qualidade mudam sem reiniciar o tempo ou o percurso',async()=>{const {r,m,avancou}=setup({tempo:0});r.play();r.atualizar(1);const antes=avancou();await r.ajustar({...r.config(),som:true,rotulos:false,qualidade:'economica'});assert.equal(r.estado().fase,'percurso');assert(m.estado.rodando);assert.equal(avancou(),antes);assert.equal(r.config().som,true);});
test('alterar tempo ou personagens prepara nova rodada',async()=>{const {r}=setup();r.play();r.atualizar(3);await r.ajustar({...r.config(),tempo:15,nPrincipal:2});assert.equal(r.estado().fase,'pronta');assert.equal(r.estado().tempo,15);});

test('trava da agulha é publicada imediatamente para desativar os botões',()=>{const {m}=setup();const estados=[];const r=criarRodada(m,{...PADRAO,tempo:0},{aoMudar:e=>estados.push(e)});m.update=()=>{if(m.estado.rodando)m.estado.travado=true;};r.play();r.atualizar(.05);assert.equal(estados.at(-1).travado,true);});

test('singular e plural cobrem todos os papéis; ramal vazio tem texto próprio',()=>{
 const pares={trabalhador:['Trabalhador','Trabalhadores'],idoso:['Idoso','Idosos'],gestante:['Gestante','Gestantes'],criancas:['Criança','Crianças'],estudante:['Estudante','Estudantes'],cientista:['Cientista','Cientistas'],colega:['Colega de turma','Colegas de turma'],vinculo:['Vínculo afetivo','Vínculos afetivos'],desconhecidos:['Desconhecido','Desconhecidos']};
 for(const [p,[singular,plural]] of Object.entries(pares)){assert.equal(nomeGrupo(p,1),singular);assert.equal(nomeGrupo(p,2),plural);assert.equal(textoGrupo(p,1),'1 '+singular);}
 assert.equal(textoGrupo('trabalhador',0),'Ramal livre');
});
test('nova entrada alterna os dois papéis e as duas quantidades sem perder preferências',()=>{
 const antigo=globalThis.localStorage,mem=new Map();globalThis.localStorage={getItem:k=>mem.get(k)||null,setItem:(k,v)=>mem.set(k,v)};
 try{let c=normalizar({som:true,qualidade:'economica',tempo:20});registrarEntrada(c);for(let i=0;i<30;i++){const n=novaEntrada(c);assert(![c.principal,c.ramal].includes(n.principal));assert(![c.principal,c.ramal].includes(n.ramal));assert.notEqual(n.principal,n.ramal);assert.notEqual(n.nPrincipal,c.nPrincipal);assert.notEqual(n.nRamal,c.nRamal);assert(n.nPrincipal>=1&&n.nPrincipal<=5&&n.nRamal>=1&&n.nRamal<=5);assert(n.som);assert.equal(n.qualidade,'economica');assert.equal(n.tempo,20);registrarEntrada(n);c=n;}
 const fixo=novaEntrada({...c,modo:'classico'});assert.equal(fixo.nPrincipal,3);assert.equal(fixo.nRamal,1);assert.equal(fixo.principal,'desconhecidos');assert.equal(fixo.ramal,'desconhecidos');
 }finally{if(antigo===undefined)delete globalThis.localStorage;else globalThis.localStorage=antigo;}
});
