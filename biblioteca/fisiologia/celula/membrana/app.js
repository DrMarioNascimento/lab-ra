import {DURACAO,estadoPelicula,estadoTransporte} from './ciclo.js';
import {nativePlatform} from '../visualizador/ra.js?v=celula-v3-android1';
const $=id=>document.getElementById(id),viewer=$('membrane-model'),launch=$('launch-ar'),status=$('ar-status');
const webgl=(()=>{try{const gl=document.createElement('canvas').getContext('webgl2');if(!gl)return false;gl.getExtension('WEBGL_lose_context')?.loseContext();return true;}catch{return false;}})();
const platform=nativePlatform(),query=new URLSearchParams(location.search);
let mode='',ready=false,requested='',links={},retry=0,playing=!matchMedia('(prefers-reduced-motion: reduce)').matches,active=true,presenting=false;
let frame=0,lastPhase='';
const content={
 pelicula:{title:'Onde está a carga?',subtitle:'Acompanhe a separação das cargas junto à membrana — e veja o que muda quando o potencial se inverte.',alt:'Bicamada lipídica com cargas animadas nas duas faces: repouso, inversão e retorno',legend:'<span class="warm">+ cargas positivas</span><span class="cool">− cargas negativas</span>',cards:[['Duas faces, uma diferença','As cargas se reorganizam junto às superfícies. No repouso, o lado interno é negativo em relação ao externo.'],['O volume continua quase neutro','A animação amplia as cargas para permitir sua observação. A separação envolve apenas uma fração muito pequena dos íons da célula.'],['Inverter não é carregar a célula inteira','Durante a inversão, a diferença de potencial muda de sinal. Observe a redistribuição perto da membrana em cada lado.']],scope:'Demonstração esquemática em câmera lenta: −70 mV → +35 mV → −70 mV. O tempo de 16 segundos é de animação, não fisiológico. Partículas ampliadas e amostragem reduzida; os números de esferas não representam concentrações. Nesta vista, as cargas se redistribuem em cada lado; a passagem pela membrana é explorada em Travessias.'},
 travessias:{title:'Como atravessar a membrana?',subtitle:'Compare quatro caminhos em movimento: pelo lipídio, por canais, por um transportador e pela bomba que usa ATP.',alt:'Transporte pela membrana animado: gases, canais de potássio e sódio, glicose e bomba sódio-potássio',legend:'<span class="warm">Na⁺ laranja · K⁺ amarelo</span><span class="cool">Glicose lilás · ATP azul</span>',cards:[['Pelo lipídio','O₂ entra e CO₂ sai neste exemplo. Moléculas pequenas e apolares atravessam a bicamada sem uma proteína de transporte.'],['Pelos canais','Os poros seletivos permitem a passagem de íons. Aqui, K⁺ sai e Na⁺ entra: os canais estão abertos e os gradientes favorecem esses sentidos.'],['Pelo transportador','A glicose se liga e atravessa por acesso alternado. Observe a fase ocluída: as duas comportas não ficam abertas ao mesmo tempo.'],['Pela bomba Na⁺/K⁺','Cada ciclo usa ATP para transportar três Na⁺ para fora e dois K⁺ para dentro, contra seus gradientes. A proteína muda de conformação.']],scope:'Movimentos, formas, tamanhos e tempos são representações didáticas. Os fluxos passivos dependem dos gradientes; os sentidos mostrados correspondem ao cenário ilustrado. A bomba mantém gradientes ao longo do tempo: não é ela que produz a repolarização rápida de cada potencial de ação. A glicose atravessa por difusão facilitada, sem consumo direto de ATP.'}
};
function syncPlayback(){
 $('play').textContent=playing?'Pausar':'Continuar';
 if(!ready)return;
 viewer.timeScale=Number($('speed').value);
 if(playing&&(active||presenting)&&!document.hidden)viewer.play();else viewer.pause();
}
function showPhase(){
 if(!ready)return;
 const t=Number(viewer.currentTime)||0;
 $('timeline').value=String(Math.min(t,15.99));$('clock').textContent=`${t.toFixed(1).replace('.',',')} / ${DURACAO} s`;
 const e=mode==='pelicula'?estadoPelicula(t):estadoTransporte(t);
 const label=e.rotulo;
 if(label===lastPhase)return;
 lastPhase=label;$('phase').textContent=label;
 $('explanation').textContent=mode==='pelicula'
  ?['Mais cargas negativas junto à face interna; positivas junto à face externa.','As cargas próximas às faces se reorganizam. A diferença de potencial muda de sinal.','Nesta etapa ilustrativa, a face interna fica positiva em relação à externa.','A distribuição retorna à condição inicial; o ciclo volta a começar.'][e.fase]
  :e.bomba<.2?'Três Na⁺ se ligam pelo lado do citoplasma. Observe a bomba à direita.':e.bomba<.5?'O ATP participa da mudança conformacional; três Na⁺ são liberados no exterior.':e.bomba<.7?'Dois K⁺ se ligam pelo lado extracelular. A proteína prepara o retorno.':'A bomba retorna e libera dois K⁺ no citoplasma. Compare com os caminhos passivos ao lado.';
}
function tick(){frame=0;if((active||presenting)&&!document.hidden){showPhase();frame=requestAnimationFrame(tick);}}
function visibility(value){active=value;syncPlayback();if(frame)cancelAnimationFrame(frame);frame=0;if(active||presenting)tick();}
function requestModel(){
 ready=false;lastPhase='';$('phase').textContent='Carregando a animação…';
 ['play','restart','speed','timeline','reset-view'].forEach(id=>$(id).disabled=true);
 launch.disabled=platform!=='ios';$('retry').hidden=true;
 requested=links.glb+(retry?'?tentativa='+retry:'');
 $('model-poster').hidden=false;$('model-poster').src=links.poster;$('model-poster').alt='Prévia do modelo real: '+content[mode].title;
 viewer.setAttribute('poster',links.poster);viewer.setAttribute('ios-src',links.usdz);
 if(!webgl){$('phase').textContent='Prévia do modelo';$('explanation').textContent='Este navegador não disponibilizou a visualização 3D. A imagem mostra o modelo real da experiência.';status.textContent=platform==='ios'?'Toque no botão para abrir a animação em RA no iPhone.':'Para explorar o movimento e a RA, abra em um navegador com suporte a 3D, como o Chrome de um Android compatível.';return;}
 viewer.setAttribute('src',requested);
 status.textContent=platform==='ios'?'O modelo animado já pode ser aberto no iPhone. A prévia está carregando.':'Carregando o modelo animado. Aguarde “Pronto” para abrir a RA.';
}
function updateLab(){
 if(!$('investigate').open)return;
 const lab=$('laboratory'),level=mode==='pelicula'?4:5;
 if(lab.hasAttribute('src'))lab.contentWindow?.postMessage({type:'celula-nivel',nivel:level-1},location.origin);
 else {const url=new URL('../laboratorio-membrana.html',import.meta.url);url.searchParams.set('nivel',level);url.searchParams.set('v','movimento1');if(query.has('percurso'))url.searchParams.set('percurso',query.get('percurso'));lab.src=url.href;}
}
function select(next){
 if(mode===next)return;mode=next;
 const c=content[mode];$('title').textContent=c.title;$('subtitle').textContent=c.subtitle;$('eyebrow').textContent=mode==='pelicula'?'02 / PELÍCULA EM MOVIMENTO':'03 / TRAVESSIAS EM MOVIMENTO';
 viewer.alt=c.alt;$('legend').innerHTML=c.legend;$('scope').textContent=c.scope;
 $('observations').classList.toggle('four',mode==='travessias');
 $('observations').replaceChildren(...c.cards.map(([title,text],i)=>{const a=document.createElement('article'),n=document.createElement('span'),b=document.createElement('b'),p=document.createElement('p');n.className='card-number';n.textContent=String(i+1).padStart(2,'0');b.textContent=title;p.textContent=text;a.append(n,b,p);return a;}));
 links=Object.fromEntries([['glb','glb'],['usdz','usdz'],['poster','webp']].map(([key,ext])=>[key,new URL(`assets/${mode}-v1.${ext}`,import.meta.url).href]));
 retry=0;requestModel();updateLab();
}
function failed(){presenting=false;status.textContent='A RA não abriu. No Android, use o Chrome e confira a permissão de câmera. Toque no botão para tentar novamente.';visibility(active);}
launch.onclick=()=>{
 if(platform==='ios'){
  let doc=document;try{if(window.top.document)doc=window.top.document;}catch{}
  const a=doc.createElement('a');a.rel='ar';a.href=links.usdz;const img=doc.createElement('img');img.alt=content[mode].title;a.append(img);a.style.display='none';doc.body.append(a);a.click();setTimeout(()=>a.remove(),4000);return;
 }
 if(!ready||!viewer.canActivateAR)return;
 // Preserva o gesto: nenhum await ou exportação antes de activateAR().
 viewer.timeScale=1;viewer.play();
 try{const p=viewer.activateAR();if(p?.catch)p.catch(failed);}catch{failed();}
};
viewer.addEventListener('load',event=>{
 if(event.detail?.url&&String(event.detail.url)!==requested)return;
 if(viewer.getAttribute('src')!==requested)return;
 ready=true;$('model-poster').hidden=true;['play','restart','speed','timeline','reset-view'].forEach(id=>$(id).disabled=false);
 launch.disabled=platform!=='ios'&&!viewer.canActivateAR;
 viewer.currentTime=0;syncPlayback();showPhase();
 status.textContent=platform==='ios'||viewer.canActivateAR?'Pronto. Toque em Abrir em realidade aumentada para ver o ciclo em movimento.':'Modelo pronto para explorar aqui. Para RA, abra no Safari do iPhone ou no Chrome de um Android compatível.';
});
viewer.addEventListener('error',()=>{
 ready=false;$('model-poster').hidden=false;launch.disabled=platform!=='ios';['play','restart','speed','timeline','reset-view'].forEach(id=>$(id).disabled=true);
 $('phase').textContent='Prévia 3D indisponível';$('explanation').textContent='A imagem mostra o modelo real. Tente carregar novamente ou abra em um navegador compatível.';
 status.textContent=platform==='ios'?'Você ainda pode abrir o modelo animado em RA no iPhone pelo botão.':'Não foi possível carregar a prévia 3D neste navegador. Tente novamente ou abra no Chrome do Android.';$('retry').hidden=false;
});
viewer.addEventListener('ar-status',event=>{
 const s=event.detail?.status;
 if(s==='failed'){failed();return;}
 presenting=s==='session-started'||s==='object-placed';
 if(presenting){viewer.timeScale=1;viewer.play();}else syncPlayback();
});
$('retry').onclick=()=>{retry++;requestModel();};
$('play').onclick=()=>{playing=!playing;syncPlayback();};
$('restart').onclick=()=>{viewer.currentTime=0;playing=true;syncPlayback();showPhase();};
$('speed').onchange=syncPlayback;
$('timeline').oninput=()=>{playing=false;syncPlayback();viewer.currentTime=Number($('timeline').value);showPhase();};
$('reset-view').onclick=()=>{viewer.cameraOrbit='0deg 84deg auto';viewer.fieldOfView='35deg';viewer.cameraTarget='auto auto auto';viewer.jumpCameraToGoal();};
$('fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.querySelector('.viewport').requestFullscreen();}catch{status.textContent='Este navegador não oferece tela cheia. Use a pinça para aproximar o modelo.';}};
$('investigate').addEventListener('toggle',updateLab);
$('laboratory').addEventListener('load',updateLab);
addEventListener('message',event=>{
 if(event.origin!==location.origin||event.source!==parent)return;
 if(event.data?.type==='celula-nivel'&&[3,4].includes(event.data.nivel)){select(event.data.nivel===3?'pelicula':'travessias');visibility(true);}
 if(event.data?.type==='membrana-visibilidade')visibility(!!event.data.ativa);
});
addEventListener('visibilitychange',()=>visibility(active));
let previousHeight=0;
new ResizeObserver(()=>{const h=Math.ceil(document.querySelector('main').getBoundingClientRect().height);if(h!==previousHeight){previousHeight=h;parent.postMessage({type:'membrana-altura',altura:h},location.origin);}}).observe(document.querySelector('main'));
select(query.get('nivel')==='5'?'travessias':'pelicula');syncPlayback();tick();
