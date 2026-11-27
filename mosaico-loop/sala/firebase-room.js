import { initializeApp, getApps } from 'https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js';
/* SUBSTITUIDO 03/10: import { getAuth, GoogleAuthProvider, signInWithPopup, getRedirectResult, signInAnonymously, signOut } from '…/firebase-auth.js';
   SUBSTITUIDO 03/10: import { getFirestore, doc, setDoc, getDoc, updateDoc, collection, onSnapshot, serverTimestamp } from '…/firebase-firestore.js';
   (entraram onAuthStateChanged e addDoc, para a volta sem formulário e os ganchos do jogo) */
import { getAuth, GoogleAuthProvider, signInWithPopup, getRedirectResult, signInAnonymously, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js';
import { getFirestore, doc, setDoc, getDoc, updateDoc, collection, onSnapshot, serverTimestamp, addDoc } from 'https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js';

/* Esta folha é carregada com type="module", e em módulo document.currentScript
   é null: a configuração da página — projeto Firebase, coleção, nome do evento
   de liberação — era lida como undefined e caía inteira no padrão da Mesa. A
   página da Noite abria a sala no projeto errado e anunciava um evento que
   ninguém escuta, então o jogo nunca carregava e o botão de entrar não fazia
   nada. Procurar pela própria tag devolve o que o HTML sempre disse. */
const script=document.currentScript||document.querySelector('script[src*="firebase-room.js"]');
const PROJECT=script?.dataset.project||'mesa';
const ROOT=script?.dataset.root||(PROJECT==='noite'?'noite':'mosaico');
const CASE_ID=script?.dataset.case||'caso';
const TITLE=script?.dataset.title||'MOSAICO';
const READY_EVENT=script?.dataset.readyEvent||'mosaico-room-ready';
const TELAO=script?.dataset.telao||'';
/* 03/10 (O Impostor): data-papel-camada="nao" tira da entrada o papel cognitivo e a
   camada; data-retomar="sim" deixa quem já está na sala voltar (recarga, ou a
   página que o jogo reabre depois do sorteio) sem digitar o nome de novo. Sem os
   dois atributos, nada muda para as outras mesas. */
const SEM_PAPEL=script?.dataset.papelCamada==='nao';
const RETOMAR=script?.dataset.retomar==='sim';
const CONFIGS={
  mesa:{apiKey:'AIzaSyDwshZbqaMOKxdRuyLtdpbijPRdrjVOcxE',authDomain:'mosaico-game.firebaseapp.com',projectId:'mosaico-game',storageBucket:'mosaico-game.firebasestorage.app',messagingSenderId:'436141261767',appId:'1:436141261767:web:6a83555a2f7c4ed4550fe2'},
  noite:{apiKey:'AIzaSyA160bkgHBrYBwvIxlENax-aAyLWPMaOU4',authDomain:'mosaico-noite.firebaseapp.com',projectId:'mosaico-noite',storageBucket:'mosaico-noite.firebasestorage.app',messagingSenderId:'703343424116',appId:'1:703343424116:web:e6990b5c00d43aca6e9721'},
  /* O Impostor (03/10/2026): projeto próprio, um por caso. Sem Analytics: não serve ao jogo. */
  impostor:{apiKey:'AIzaSyB_iz5CI0lvml-t7nlgTGmQGGL6i79drjs',authDomain:'oimpostor-c30e0.firebaseapp.com',projectId:'oimpostor-c30e0',storageBucket:'oimpostor-c30e0.firebasestorage.app',messagingSenderId:'182177484646',appId:'1:182177484646:web:48efa34591444c6af1c2a7'},
  /* O Eco do Amanhã: O Impostor (11/10/2026): projeto próprio do VestChip. Sem Analytics. */
  vestchip:{apiKey:'AIzaSyCVFRwufDXTY6qVaBKrToGCHd5CS35obWE',authDomain:'vestchip.firebaseapp.com',projectId:'vestchip',storageBucket:'vestchip.firebasestorage.app',messagingSenderId:'688895060786',appId:'1:688895060786:web:336053a414675f6edc452b'},
  /* Mosaico Loop (19/11/2026): projeto próprio "mosaico-loop". Sem Analytics: não serve ao jogo.
     A chave é pública por desenho; a proteção vem do login do Professor e das regras do Firestore. */
  loop:{apiKey:'AIzaSyABQnyO_Qze1eDgLSPxB6mxiTQaRJF9uOI',authDomain:'mosaico-loop.firebaseapp.com',projectId:'mosaico-loop',storageBucket:'mosaico-loop.firebasestorage.app',messagingSenderId:'872568801702',appId:'1:872568801702:web:f89a9908a1bd7edc7b6767'},
  /* A Manhã do Carro-Forte: O Impostor (11/10/2026): projeto próprio. Sem Analytics. */
  carroforte:{apiKey:'AIzaSyDdrtMf067L1K4v1nTzmyAJ9rbQErKMTYk',authDomain:'o-impostor-carro-forte.firebaseapp.com',projectId:'o-impostor-carro-forte',storageBucket:'o-impostor-carro-forte.firebasestorage.app',messagingSenderId:'62421791853',appId:'1:62421791853:web:0eaec8f768119a14bc3b64'}
};
const app=getApps().find(a=>a.name===`dragon-${PROJECT}`)||initializeApp(CONFIGS[PROJECT],`dragon-${PROJECT}`);
const auth=getAuth(app),db=getFirestore(app);
const ALPH='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const FORMAS={m:{emoji:'👨',label:'Bem-vindo'},f:{emoji:'👩',label:'Bem-vinda'},n:{emoji:'👥',label:'Tanto faz'}};
function casoPapel(){return CASE_ID||'caso'}
function ensurePapelCamada(){
  return new Promise(res=>{
    if(SEM_PAPEL)return res(null);
    if(window.MosaicoPapelCamada)return res(window.MosaicoPapelCamada);
    const s=document.createElement('script');
    s.src=new URL('papel-camada.js',script.src).href;
    s.onload=()=>res(window.MosaicoPapelCamada);
    s.onerror=()=>res(null);
    document.head.appendChild(s);
  });
}
let role='',code='',players=[],room=null,unsubRoom=null,unsubPlayers=null,pendingUser=null;
let unsubTelas=null,telas=[],acaoMestre=null;
let modo='sem-telao',ritmo='automatico',salaAberta=false,gameReleased=false,intencao='sala';
const q=new URLSearchParams(location.search).get('sala');

function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function gerar(){let s='';for(let i=0;i<6;i++)s+=ALPH[Math.floor(Math.random()*ALPH.length)];return s;}
function roomRef(c){return doc(db,ROOT,c)}
function playerRef(c,uid){return doc(db,ROOT,c,'jogadores',uid)}
function joinUrl(c){const u=new URL(location.href);u.search='';u.searchParams.set('sala',c);return u.toString();}
/* O telão é uma página irmã que entra pela MESMA sala e só lê. Ela existe
   apenas onde o HTML declara `data-telao`; sem isso a seção nem aparece, e é
   assim que "não implantar telão onde não há vestígio" fica sendo uma
   propriedade do arquivo, não uma lembrança de quem mexe. */
function telaoUrl(c){
  if(!TELAO)return'';
  const u=new URL(TELAO,location.href);u.searchParams.set('sala',c);return u.toString();
}
function qrDe(url,rotulo){
  if(window.MosaicoQR)return window.MosaicoQR.svg(url,{nivel:'M',margem:4,rotulo});
  return `<div class="room-qr-fallback">${esc(url)}</div>`;
}
function qr(c){const url=joinUrl(c);if(window.MosaicoQR)return window.MosaicoQR.svg(url,{nivel:'M',margem:4,rotulo:'QR para entrar na sala'});return `<div class="room-qr-fallback">${esc(c)}</div>`;}

function css(){const st=document.createElement('style');st.textContent=`
#dragonRoomGate .dr-ent{max-width:420px}
.dr-topo{display:flex;align-items:center;gap:12px}
.dr-topo-ic{width:58px;height:58px;object-fit:contain;filter:drop-shadow(0 5px 4px #000a)}
.dr-kicker{font-size:11px;font-weight:800;letter-spacing:.18em;text-transform:uppercase;color:#a4b2bd}
.dr-titulo{margin:2px 0 0;font:700 24px/1.1 Georgia,serif;color:#f4f9fd}
.dr-rot{margin:0!important;font-size:11px;font-weight:800;letter-spacing:.18em;text-transform:uppercase;color:#83c6ac!important}
.dr-ent .dr-card{display:flex;flex-direction:column;gap:10px}
.dr-ent .dr-card h2{margin:0;font-size:24px}
.dr-ent .dr-input{margin-top:0}
.dr-cod{text-align:center;text-transform:uppercase;font:700 24px ui-monospace,Menlo,monospace!important;letter-spacing:.3em}
.dr-cod::placeholder{letter-spacing:.3em}
.dr-nome{font-weight:600}
.dr-aviso{margin:0;font-size:13px;color:#a4b2bd!important}
.dr-pergunta{margin:2px 0 -4px}
.dr-ent .dr-formas{margin:0}
.dr-ent .dr-forma{min-height:82px}
.dr-ent .dr-forma .lb{font:700 14px system-ui,sans-serif;white-space:nowrap}
.dr-ent .dr-btn{margin-top:0}
.dr-erro{margin:0;min-height:1.2em;font-size:14px;color:#ff9b86!important}
.dr-info{position:absolute;top:max(14px,env(safe-area-inset-top));right:14px;width:44px;height:44px;border-radius:50%;border:1px solid #c9aa7250;background:linear-gradient(180deg,#294051,#172633);color:#e8edf2;font:700 18px Georgia,serif;box-shadow:inset 0 1px 0 #ffffff22,0 3px 0 #05090d;cursor:pointer}
.dr-info:active{transform:translateY(2px);box-shadow:inset 0 1px 0 #ffffff15,0 1px 0 #05090d}
#dragonRoomGate{position:fixed;inset:0;z-index:99999;background:radial-gradient(900px 600px at 50% -10%,#16242a 0,transparent 55%),#061014;color:#f0eadc;font-family:Inter,system-ui,sans-serif;overflow:auto}.dr-shell{width:min(620px,calc(100% - 28px));margin:auto;padding:max(24px,env(safe-area-inset-top)) 0 max(36px,env(safe-area-inset-bottom))}.dr-brand{font-size:12px;letter-spacing:.22em;text-transform:uppercase;color:#e8a94a;font-weight:800}.dr-card{margin-top:18px;padding:20px;border:1px solid rgba(159,228,255,.52);border-radius:14px;background:linear-gradient(165deg,#1a3348,#153044 60%,#102838);box-shadow:inset 0 1px 0 rgba(255,255,255,.10),0 18px 50px rgba(0,0,0,.55),0 0 40px rgba(127,212,255,.10)}.dr-card h1,.dr-card h2{font-family:Georgia,serif;margin:.25rem 0 .6rem;color:#f4f9fd}.dr-card h1{font-size:clamp(38px,10vw,62px);line-height:.95}.dr-card p{color:#afbdc5;line-height:1.5}.dr-btn{width:100%;min-height:52px;margin-top:10px;border:0;border-radius:10px;padding:12px 14px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;cursor:pointer;background:linear-gradient(180deg,#8ee4ad,#3ea86a);color:#062011;box-shadow:inset 0 1px #d4f5e2,0 5px 0 #1b5c38,0 12px 22px #000a}.dr-btn.secondary{background:linear-gradient(180deg,#162a38,#0c1b26);color:#dce8ed;box-shadow:inset 0 1px rgba(255,255,255,.08),0 4px 0 #030709,0 10px 18px #0008;border:1px solid #46667a}.dr-btn.danger{background:linear-gradient(#7d2d2a,#4b1715);color:#fff3ef;box-shadow:inset 0 1px rgba(255,255,255,.08),0 5px 0 #1b0706}.dr-input{width:100%;min-height:50px;margin-top:10px;border-radius:9px;border:1px solid #3a4c56;background:#071014;color:#fff;padding:12px;font-size:17px}.dr-code{font:800 clamp(40px,12vw,70px)/1 monospace;letter-spacing:.13em;color:#ffc46b;text-align:center;margin:12px 0}.dr-qr{width:min(300px,80vw);margin:14px auto;background:white;padding:10px;border-radius:12px}.dr-qr svg{display:block;width:100%;height:auto}.dr-list{display:grid;gap:0;margin-top:14px;padding:6px;border-radius:10px;background:#03080d;border:1px solid rgba(20,36,48,.95);border-left:4px solid #6aa8ca;box-shadow:inset 0 3px 10px rgba(0,0,0,.72),inset 2px 0 6px rgba(0,0,0,.45)}.dr-player{padding:10px 12px;border:0;border-bottom:1px solid rgba(45,63,72,.7);border-radius:0;background:transparent;display:flex;justify-content:space-between;gap:10px}.dr-player:last-child{border-bottom:0}.dr-note{font-size:13px;color:#82959f}.dr-error{margin-top:12px;padding:10px;border-left:3px solid #e56b52;background:#28110e;color:#ffd4ca}.room-qr-fallback{color:#111;font:800 36px monospace;text-align:center;padding:40px 5px}.dr-formas{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:14px 0}.dr-forma{position:relative;min-height:100px;border:1px solid rgba(45,68,82,.75);border-radius:11px;background:#060d14;color:#dce8ed;padding:10px 5px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:7px;cursor:pointer;box-shadow:inset 0 2px 6px rgba(0,0,0,.45)}.dr-forma input{position:absolute;opacity:0}.dr-forma:has(input:checked){border-color:#e8a94a;background:#25190e;color:#ffc46b;box-shadow:inset 0 0 0 2px #e8a94a,inset 0 0 16px rgba(232,169,74,.1)}.dr-forma .em{font-size:28px}.dr-forma .lb{font-family:Georgia,serif;font-size:16px;text-align:center}.dr-ident{font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#e8a94a;font-weight:800;margin-top:15px}.dr-choice{width:100%;margin-top:9px;padding:14px;border:1px solid rgba(45,68,82,.75);border-radius:10px;background:#060d14;color:#dce8ed;text-align:left;cursor:pointer;box-shadow:inset 0 2px 6px rgba(0,0,0,.45)}.dr-choice.on{border-color:#e8a94a;background:#25190e;color:#ffc46b;box-shadow:inset 0 0 0 2px #e8a94a,inset 0 0 16px rgba(232,169,74,.1)}.dr-choice b,.dr-choice span{display:block}.dr-choice span{margin-top:5px;color:#9eafb8;font-size:13px}.dr-master-info{padding:14px;border-left:3px solid #e8a94a;background:#0a1318;border-radius:8px}.dr-master-info p{margin:.45rem 0}
/* O ALERTA DO PROFESSOR. Copiado em espírito da Mesa da Casa (v1/MOSAICO-mesa.html,
   .btn-menu-mestre.acao-necessaria): quando a partida para esperando uma decisão
   dele, o botão da Sala pisca em vermelho — em vez de a mesa ficar olhando para
   uma tela parada sem saber de quem é a vez de agir.
   Vale para o botão flutuante e para qualquer espelho que a página instalar com
   data-dragon-sala-espelho: na Mesa do Carro-Forte o flutuante está escondido e
   quem aparece é o SALA do cabeçalho. */
#dragonSalaBtn.acao-necessaria,[data-dragon-sala-espelho].acao-necessaria{border-color:#e0674f;color:#ff9b8b;animation:dragonAlerta 1.05s ease-in-out infinite}
@keyframes dragonAlerta{0%,100%{box-shadow:0 0 0 0 rgba(224,103,79,.25)}50%{box-shadow:0 0 0 5px rgba(224,103,79,.18),0 0 24px rgba(224,103,79,.8)}}
@media(prefers-reduced-motion:reduce){#dragonSalaBtn.acao-necessaria,[data-dragon-sala-espelho].acao-necessaria{animation:none}}
.dr-acao{margin-top:14px;padding:13px;border:1px solid #e0674f;border-radius:11px;background:#26100c}
.dr-acao b{display:block;color:#ff9b8b;font:800 11px Inter,system-ui,sans-serif;letter-spacing:.14em;text-transform:uppercase}
.dr-acao p{margin:.45rem 0 .65rem;color:#e8cec7;font-size:14px;line-height:1.45}
.dr-telao-status{margin-top:12px;padding:12px;border-left:3px solid #4d6774;background:#0a1318;border-radius:8px;color:#bdeeff;font-weight:700}
.dr-telao-status.on{border-left-color:#70d6a0;color:#8ce4b0}
#dragonSalaBtn{position:fixed;z-index:100002;right:max(14px,env(safe-area-inset-right));bottom:max(14px,env(safe-area-inset-bottom));min-width:140px;height:48px;border:1px solid #4d6774;border-radius:10px;background:#071014;color:#bdeeff;font:800 13px Inter,system-ui,sans-serif;letter-spacing:.04em;text-transform:none;box-shadow:0 6px 22px rgba(0,0,0,.5);cursor:pointer}#dragonSalaPanel{position:fixed;z-index:100003;inset:0;background:rgba(0,0,0,.72);display:flex;align-items:flex-start;justify-content:center;overflow:auto;padding:24px 14px}#dragonSalaPanel .dr-sala-card{width:min(620px,100%);margin:auto;background:linear-gradient(165deg,#1a3348,#153044 60%,#102838);border:1px solid rgba(159,228,255,.52);border-radius:14px;padding:18px;color:#e6edf2;box-shadow:inset 0 1px 0 rgba(255,255,255,.10),0 18px 50px rgba(0,0,0,.55),0 0 40px rgba(127,212,255,.10);font-family:Inter,system-ui,sans-serif}.dr-sala-head{display:flex;justify-content:space-between;gap:12px;align-items:center}.dr-sala-head h2{font:600 34px Georgia,serif;margin:0;color:#f4f9fd}.dr-close{border:1px solid #46667a;background:linear-gradient(180deg,#162a38,#0c1b26);color:#e6edf2;border-radius:8px;padding:10px 14px;cursor:pointer;font-weight:800;box-shadow:inset 0 1px 0 rgba(255,255,255,.08),0 3px 0 #020609}.dr-sala-section{margin-top:14px;padding-top:14px;border-top:1px solid #26343c}.dr-sala-section summary{cursor:pointer;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#afc8d5}.dr-sala-code{font:800 38px monospace;letter-spacing:.15em;text-align:center;color:#ffc46b;margin:12px 0}.dr-sala-qr{width:min(250px,75vw);margin:auto;background:#fff;padding:10px;border-radius:10px}.dr-sala-qr svg{display:block;width:100%;height:auto}.dr-sala-actions{display:grid;gap:8px;margin-top:12px}
`;document.head.appendChild(st)}
function gate(){let el=document.getElementById('dragonRoomGate');if(!el){el=document.createElement('div');el.id='dragonRoomGate';document.body.appendChild(el)}return el}
function formas(selected=''){return `<p class="dr-aviso dr-pergunta">Como o jogo deve receber você?</p><div class="dr-formas" role="radiogroup" aria-label="Como o jogo deve receber você">${Object.entries(FORMAS).map(([id,f])=>`<label class="dr-forma"><input type="radio" name="drForma" value="${id}" ${id===selected?'checked':''}><span class="em">${f.emoji}</span><span class="lb">${f.label}</span></label>`).join('')}</div>`}
function formaAtual(){return document.querySelector('input[name="drForma"]:checked')?.value||''}

function menu(error=''){
  /* Celular gate: só Abrir | Entrar. Ensaiar fica na porta Solo do hub; Telão
     na porta Telão do hub. Sem segundo seletor de modo aqui. */
  gate().innerHTML=`<div class="dr-shell"><div class="dr-brand">${esc(TITLE)}</div><div class="dr-card pf-card"><div data-qr-intro><div data-qr-copy><img class="dr-arte" src="../museu/icones/T01.webp" alt=""><h1>${esc(TITLE)}</h1><p>Você abre a sala neste celular. A turma entra pelo QR code ou pelo código. No PC ou na TV, abra o telão com o mesmo código.</p></div><div data-acesso-qr-slot></div></div>${error?`<div class="dr-error">${esc(error)}</div>`:''}<button class="dr-btn" id="drJoin">Participar com código</button><button class="dr-btn prof" id="drOpen"><span aria-hidden="true">🔒</span> Conduzir como curador</button><span class="dr-chave">Só o Curador tem a chave</span><div class="dr-duo"><a class="dr-btn sec" href="telao/index.html"><img src="../museu/icones/ui/telao.webp" alt="">Abrir telão</a><a class="dr-btn sec" href="../simulador/"><img src="../museu/icones/ui/simulador.webp" alt="">Simulador</a></div></div></div>`;
  document.getElementById('drOpen').onclick=()=>{intencao='sala';renderMasterGate()};
  document.getElementById('drJoin').onclick=()=>formEntrar('');
}
/* A tela grande não escolhe nome nem forma: só precisa saber de que sala é.
   Daqui ela vai para telao.html, que entra anônima e passa a se anunciar. */
function formTelao(err=''){
  gate().innerHTML=`<div class="dr-shell"><div class="dr-brand">${esc(TITLE)} · TELÃO</div><div class="dr-card pf-card"><h2>Abrir a tela grande</h2><p>Digite o código que está no aparelho do Curador da sala. Esta tela só mostra: ninguém joga por ela.</p><input class="dr-input" id="drTelaoCode" maxlength="6" placeholder="CÓDIGO" value="${esc(q||'')}" autocapitalize="characters">${err?`<div class="dr-error">${esc(err)}</div>`:''}<button class="dr-btn" id="drTelaoGo">📺 Abrir o telão</button><button class="dr-btn secondary" id="drTelaoBack">Voltar</button></div></div>`;
  document.getElementById('drTelaoBack').onclick=()=>menu();
  document.getElementById('drTelaoGo').onclick=()=>{
    const c=(document.getElementById('drTelaoCode').value||'').trim().toUpperCase();
    if(c.length!==6)return formTelao('O código tem seis caracteres.');
    location.href=telaoUrl(c);
  };
  setTimeout(()=>document.getElementById('drTelaoCode')?.focus(),20);
}
function renderMasterGate(error=''){
  const ensaio=intencao==='ensaio';
  /* Hub já escolheu Celular (ou Solo via ?soloLab=1). Não reperguntar
     Celular/Telão/Solo nem Com/Sem telão. modo=sem-telao em silêncio;
     a TV entra pela porta Telão do hub + código. */
  modo='sem-telao';
  const corpo=ensaio
    ? `<div class="dr-master-info"><p>Nenhuma sala é aberta e ninguém entra por QR. Percorra a partida neste aparelho.</p></div>`
    : `<div class="dr-ident">Como as voltas avançam?</div><button class="dr-choice ${ritmo==='automatico'?'on':''}" data-rhythm="automatico"><img class="dr-ic" src="../museu/icones/R02.webp" alt=""><b>Automático (melhor)</b><span>O jogo anda quando a turma termina.</span></button><button class="dr-choice ${ritmo==='conduzido'?'on':''}" data-rhythm="conduzido"><img class="dr-ic" src="../museu/icones/ui/conduzir.webp" alt=""><b>Eu libero</b><span>Você toca para passar de volta.</span></button>`;
  gate().innerHTML=`<div class="dr-shell"><div class="dr-brand">${esc(TITLE)} · ÁREA DO CURADOR</div><div class="dr-card pf-card"><h2>${ensaio?'Ensaiar neste aparelho':'Conduzir como curador'}</h2>${corpo}${error?`<div class="dr-error">${esc(error)}</div>`:''}<button class="dr-btn" id="drGoogle">${ensaio?'Ensaiar com Google':'Abrir com Google'}</button><button class="dr-btn secondary" id="drBack">Cancelar</button></div></div>`;
  document.querySelectorAll('[data-rhythm]').forEach(b=>b.onclick=()=>{ritmo=b.dataset.rhythm;renderMasterGate()});
  /* A SENHA SAIU (03/09/2026), e com ela uma tela inteira do caminho do Professor.
     Ela era sha256 de uma constante escrita no próprio arquivo, e o desbloqueio
     ficava num `sessionStorage` que qualquer um define pelo console — não era
     controle, era pedágio. Quem de fato decide se alguém pode abrir mesa é a
     regra do Firestore: `emailMestre()`, que confere o e-mail verificado contra
     a lista em config/mestres, no servidor, onde não há como contornar.
     Duas portas para a mesma pessoa, e só uma delas fechava. */
  document.getElementById('drGoogle').onclick=loginMestre;
  document.getElementById('drBack').onclick=()=>{if(QUER_CONDUZIR)location.href=new URL('../index.html',location.href).href;else menu()};
}
/* O redirect só volta com resultado quando a página e o authDomain estão na
   mesma origem. Aqui a página é drmarionascimento.github.io e o authDomain é
   <projeto>.firebaseapp.com — origens diferentes. Desde o SDK 9.13 todo
   navegador que particiona armazenamento de terceiros (Safari e, por tabela,
   qualquer navegador de iPhone; Firefox; e cada vez mais o Chrome) devolve
   getRedirectResult VAZIO nessa situação: a pessoa vai ao Google, volta, e o
   bootstrap cai no menu. É o login em laço que nunca abre mesa.

   Mandar todo celular direto para o redirect (d21682b, "Abre o Google uma vez
   só no celular") transformou o caso raro em regra: no celular não havia mais
   nenhum caminho que funcionasse.

   O popup funciona nos dois lados — no celular ele abre uma aba e volta
   sozinho, sem sair da página. Ele volta a ser o caminho; o redirect fica só
   para quem realmente bloqueia popup, e nesse caso a volta é anunciada em vez
   de virar menu silencioso. */
async function autorizado(user){
  const cfg=await getDoc(doc(db,'config','mestres'));
  const permitidos=cfg.exists()&&Array.isArray(cfg.data().emails)?cfg.data().emails:[];
  return permitidos.includes((user.email||'').trim());
}
/* Ninguém mais parte para o redirect, mas quem já estava no meio de uma viagem
   antiga volta com esta marca. Ler e apagar limpa o resto e devolve o que o
   Professor havia escolhido antes de sair da página. */
function recuperarEscolhas(){
  let bruto=null;try{bruto=sessionStorage.getItem('dragon.room.open')}catch{}
  if(!bruto)return false;
  try{sessionStorage.removeItem('dragon.room.open')}catch{}
  try{const e=JSON.parse(bruto);if(e?.modo)modo=e.modo;if(e?.ritmo)ritmo=e.ritmo}catch{}
  return true;
}
async function abrirComoMestre(user){
  pendingUser=user;
  if(!(await autorizado(user))){await signOut(auth);pendingUser=null;return renderMasterGate('Esta conta Google não está autorizada a abrir salas.');}
  if(intencao==='ensaio')return liberarEnsaio();
  await criarSalaBase();
}
/* O ensaio passa pela mesma validação e não cria nada: sem documento de sala,
   sem código, sem QR. `role` fica vazio de propósito — é ele que decide se o
   botão flutuante da Sala é instalado, e no ensaio não há sala para abrir. */
async function liberarEnsaio(){
  role='';code='';room=null;
  const MPC=await ensurePapelCamada();
  if(MPC){
    await MPC.mostrarSeletor({caso:casoPapel()});
  }
  liberar({local:true,ensaio:true});
}
/* Solo do hub (`?soloLab=1`): sem Google e sem sala — o mesmo espírito da
   porta `/jogos/casa-da-costa/solo/` da Casa. A abertura toca NESTE aparelho assim que o jogo
   libera. Pedir conta de Professor aqui fazia o ensaio morrer no gate e a
   manhã nunca falava. */
async function iniciarEnsaioLocal(){
  try{
    await liberarEnsaio();
  }catch(e){
    console.error('MOSAICO: não consegui abrir o ensaio local.', e);
    renderMasterGate('Não foi possível ensaiar neste aparelho.');
  }
}
/* A mensagem crua do SDK chegava em inglês e falando de SAML: "Unable to
   process request due to missing initial state…". Quem lê é o Professor com o
   celular na mão, no escuro, com a mesa esperando. Cada erro que a gente sabe
   nomear vira uma frase que diz o que fazer. */
function mensagemLogin(e){
  const c=e?.code||'',txt=String(e?.message||'');
  if(c==='auth/missing-initial-state'||/missing initial state/i.test(txt))
    return 'Este navegador apagou o estado do login no meio do caminho — é o que acontece quando a página volta de um redirecionamento. Toque em “Abrir com Google” de novo: agora a janela abre por cima desta página, sem sair dela.';
  if(c==='auth/popup-blocked')
    return 'O navegador bloqueou a janela do Google. Libere o pop-up para esta página e tente de novo. Se você abriu por dentro de outro aplicativo, abra a página no Safari ou no Chrome.';
  if(c==='auth/popup-closed-by-user'||c==='auth/cancelled-popup-request')
    return 'A janela do Google foi fechada antes de concluir. Toque em “Abrir com Google” para tentar outra vez.';
  if(c==='auth/unauthorized-domain')
    return 'Este endereço não está autorizado no Firebase Auth deste projeto.';
  if(c==='auth/network-request-failed')
    return 'A rede caiu durante o login. Confira a conexão e tente de novo.';
  return txt||'Não foi possível entrar com Google.';
}
/* Sem queda para o redirect. Nesta hospedagem ele nunca conclui — a página sai
   de drmarionascimento.github.io e o authDomain é <projeto>.firebaseapp.com, e
   o navegador que particiona armazenamento devolve missing-initial-state na
   volta. Mandar alguém para lá é tirá-lo da página para trazê-lo de volta com
   um erro. Quando o popup não abre, o caminho é liberar o popup — e a mensagem
   diz isso. */
/* UMA VEZ, E SÓ UMA (03/09/2026).
   Duas coisas faziam o Professor entrar com Google a cada partida.

   A primeira era `prompt:'select_account'`, que ORDENA ao Google mostrar o
   seletor de contas mesmo quando já há sessão — de "escolha uma conta" não se
   escapa nem estando logado. Sem ele, quem já entrou uma vez volta direto.

   A segunda era não olhar para quem já está aqui. O Firebase guarda a sessão
   em browserLocalPersistence por padrão, então `auth.currentUser` costuma
   trazer a conta da última vez; abrir o popup por cima disso é pedir de novo o
   que já se tem. Agora só há popup quando não há conta, ou quando a que existe
   é anônima — a do convidado, que não serve para abrir mesa.

   O que NÃO mudou: a conta continua sendo conferida contra config/mestres, e a
   regra do Firestore continua exigindo isso no servidor. Entrar ficou mais
   fácil; abrir mesa sem autorização, não. */
async function loginMestre(){
  try{
    const atual=auth.currentUser;
    if(atual && !atual.isAnonymous && atual.email){ await abrirComoMestre(atual); return; }
    const provider=new GoogleAuthProvider();
    const {user}=await signInWithPopup(auth,provider);
    await abrirComoMestre(user);
  }catch(e){renderMasterGate(mensagemLogin(e))}
}
async function criarSalaBase(){
  try{
    const u=pendingUser||auth.currentUser;if(!u)throw new Error('Login Google não encontrado.');
    code=gerar();for(let i=0;i<8;i++){if(!(await getDoc(roomRef(code))).exists())break;code=gerar()}
    await setDoc(roomRef(code),{ativa:true,fase:'sala',mestreUid:u.uid,criadaEm:serverTimestamp(),criadaEmMs:Date.now(),modo,ritmo,caseId:CASE_ID});
    role='master';room={ativa:true,fase:'sala',mestreUid:u.uid,modo,ritmo,caseId:CASE_ID};
    /* Telão não é mais etapa do Abrir mesa: o Professor segue para o nome;
       a TV entra pela porta Telão do hub com o código. */
    formEntrar('',true);
  }catch(e){renderMasterGate('Não foi possível criar a sala. '+(e?.message||e))}
}
/* O TELÃO SE IDENTIFICA SOZINHO.
   Ele entra na mesma sala e carimba a própria presença em <sala>/telao/<uid> —
   um documento por aparelho, que é o único lugar onde as regras deixam um
   anônimo escrever. O Professor não confirma nada no lugar dele: quem diz que a
   tela chegou é a tela. */
const TELAO_VIVO_MS=15000;
function telaoPronto(){return telas.some(t=>t.status==='ready'&&Date.now()-Number(t.vistoEmMs||0)<TELAO_VIVO_MS)}
function telaoPresente(){return telas.some(t=>Date.now()-Number(t.vistoEmMs||0)<TELAO_VIVO_MS)}
function ouvirTelas(){
  unsubTelas?.();
  unsubTelas=onSnapshot(collection(db,ROOT,code,'telao'),s=>{
    telas=s.docs.map(d=>d.data()||{});pintarTelao();
  },e=>console.error('MOSAICO: perdi o telão de vista.',e));
  /* A presença expira pelo relógio, não por evento: sem esta batida, um telão
     que fechou a aba continuaria "identificado" na tela do Professor para sempre. */
  clearInterval(pintarTelao.relogio);
  pintarTelao.relogio=setInterval(pintarTelao,3000);
}
function pintarTelao(){
  const alvo=document.getElementById('drTelaoEstado')||document.getElementById('drSalaTelaoEstado');
  if(!alvo)return;
  const pronto=telaoPronto(),presente=telaoPresente();
  alvo.classList.toggle('on',pronto);
  alvo.textContent=pronto
    ?'📺 Telão identificado ✓ · som preparado. A abertura vai rodar nele.'
    :presente
      ?'📺 Telão conectado · falta tocar em "ativar som" na tela grande.'
      :'Aguardando o telão… deixe esta tela aberta enquanto abre a outra.';
}
async function formEntrar(err='',asMaster=false){
  /* Papel cognitivo + camada no mesmo ecrã do nome (não é wizard).
     Persistência local + campos no doc do jogador. Telão não passa por aqui. */
  const aviso=asMaster?`<div class="dr-master-info"><p>Sala criada. Você joga como todo mundo: escolha o seu nome e entre.</p><p>Dentro do jogo, o botão <b>Sala</b> fica no alto da tela, só para você: QR e código, quem entrou, telão, voltas e encerrar.</p></div>`:'';
  const MPC=await ensurePapelCamada();
  MPC?.injetarCss?.();
  const escolha=MPC?MPC.carregar(casoPapel()):{papel:'investigador',camada:'livre'};
  const blocoPapel=MPC?MPC.htmlSeletor(casoPapel(),escolha):'';
  /* Revisão 17 (pedido do autor): a entrada pelo QR segue a dos outros Mosaicos do LAB-RA (Mosaico Vila): ícone e "Sala de jogo" no alto,
     cartão PARTICIPAR · Entrar com o código, código grande, "Seu nome", a pergunta "Como o jogo deve receber você?" sem nada marcado, Entrar,
     linha de erro e "Não precisa de cadastro.". Só a paleta e o nome do jogo mudam. */
  const salvo=(()=>{try{return {n:localStorage.getItem('mosaico-loop-nome')||'',f:localStorage.getItem('mosaico-loop-forma')||''}}catch{return {n:'',f:''}}})();
  gate().innerHTML=`<div class="dr-shell dr-ent"><div class="dr-topo"><img class="dr-topo-ic" src="../museu/icones/T01.webp" alt=""><div><div class="dr-kicker">${asMaster?'Sala de jogo · Curador':'Sala de jogo'}</div><h1 class="dr-titulo">${esc(TITLE)}</h1></div></div><div class="dr-card pf-card"><p class="dr-rot">${asMaster?'SUA SALA ESTÁ ABERTA':'PARTICIPAR'}</p><h2>${asMaster?'Entre também como participante':'Entrar com o código'}</h2>${aviso}<input class="dr-input dr-cod" id="drCode" maxlength="6" placeholder="CÓDIGO" value="${esc(code||q||'')}" autocomplete="off" autocapitalize="characters" aria-label="Código da sala" ${asMaster?'readonly':''}><input class="dr-input dr-nome" id="drName" maxlength="24" placeholder="Seu nome" value="${esc(salvo.n)}" autocomplete="given-name" aria-label="Seu nome">${formas(salvo.f)}${blocoPapel}<button class="dr-btn" id="drEnter">Entrar</button><p class="dr-erro" id="drErro" role="alert">${esc(err||'')}</p><p class="dr-aviso">Não precisa de cadastro.</p></div></div>`;
  gate().querySelector('#drCode')?.addEventListener('input',e=>{e.target.value=e.target.value.toUpperCase().replace(/[^A-Z0-9]/g,'')});
  if(MPC)MPC.ligarSeletor(gate().querySelector('.mpc-bloco'),escolha);
  document.getElementById('drEnter').onclick=()=>entrar(asMaster);
  setTimeout(()=>document.getElementById('drName')?.focus(),20)
}
/* 14/10/2026: toque duplo em Entrar. Enquanto o jogo carrega o caso e sorteia o
   personagem, a tela não reagia; o segundo toque fazia uma segunda gravação, que
   para o Firebase já é ALTERAÇÃO do jogador (nome, moedas, entrouMs) e as regras
   recusam: "Missing or insufficient permissions". Agora o botão trava em
   "Entrando…" e quem já tem lugar na sala volta sem regravar o que é do Professor. */
let entrando=false;
async function entrar(asMaster=false){
  if(entrando)return;entrando=true;
  const btn=document.getElementById('drEnter');
  if(btn){btn.disabled=true;btn.dataset.rotulo=btn.textContent;btn.textContent='Entrando…'}
  try{
    code=(document.getElementById('drCode').value||'').trim().toUpperCase();const nome=(document.getElementById('drName').value||'').trim(),forma=formaAtual();
    const MPC=window.MosaicoPapelCamada;
    const escolha=MPC?MPC.lerSeletor(gate().querySelector('.mpc-bloco'),MPC.carregar(casoPapel())):{papel:'investigador',camada:'livre'};
    if(MPC)MPC.salvar(casoPapel(),escolha);
    const avisar=t=>{const e=document.getElementById('drErro');if(e)e.textContent=t;};
    if(code.length!==6){avisar('Digite o código de 6 letras ou números.');return;}
    if(!nome){avisar('Digite seu nome.');document.getElementById('drName')?.focus();return;}
    if(!forma){avisar('Escolha: Bem-vindo, Bem-vinda ou Tanto faz.');return;}
    try{localStorage.setItem('mosaico-loop-nome',nome);localStorage.setItem('mosaico-loop-forma',forma);}catch{}
    /* Autenticar antes de ler. A regra de `get` exige signedIn(), e um
       aparelho que chega pelo QR não tem sessão nenhuma: lendo primeiro, o
       convidado levava "Missing or insufficient permissions" antes mesmo de
       existir para o Firebase. O Professor nunca viu, porque já entrou com o
       Google. O padrão manda que a autenticação anônima do convidado
       aconteça em segundo plano — é este o lugar dela. */
    let u;
    if(asMaster){u=pendingUser||auth.currentUser;if(!u)throw new Error('Curador não autenticado.');}
    else{
      /* Autenticar antes de ler. Deep link / ponte Celular→Noite: se o Google
         ainda é o mestreUid da sala, mantém a sessão — senão vira anônimo. */
      u=auth.currentUser;
      if(!u)u=(await signInAnonymously(auth)).user;
    }
    const snap=await getDoc(roomRef(code));if(!snap.exists()||snap.data().ativa!==true)return formEntrar('Sala não encontrada ou encerrada.',asMaster);
    if(snap.data().caseId&&snap.data().caseId!==CASE_ID)return formEntrar('Esse código pertence a outro caso do MOSAICO.',asMaster);
    if(!asMaster&&u&&!u.isAnonymous&&snap.data().mestreUid!==u.uid){
      await signOut(auth);
      u=(await signInAnonymously(auth)).user;
    }
    /* SUBSTITUIDO 14/10: gravava sempre o jogador inteiro, mesmo quando ele já existia. */
    const jaTem=asMaster?null:await getDoc(playerRef(code,u.uid)).catch(()=>null);
    if(jaTem&&jaTem.exists()&&jaTem.data().expulso===true)return formEntrar('Você foi retirado desta sala pelo Curador da sala.',false);
    if(!asMaster&&!(jaTem&&jaTem.exists())){
      if(snap.data().aulaEncerrada===true)return formEntrar('Esta sala foi encerrada pelo Curador.',false);
      if(snap.data().entradaLiberada===false)return formEntrar('A entrada ainda não foi liberada pelo Curador da sala.',false);
    }
    if(jaTem&&jaTem.exists()){
      await updateDoc(playerRef(code,u.uid),{forma,pronto:true,papelCognitivo:escolha.papel,camadaAcessibilidade:escolha.camada,atualizadoEmMs:Date.now()});
      role=(snap.data().mestreUid===u.uid)?'master':'guest';ouvir();return;
    }
    const basePlayer={nome:nome.slice(0,24),forma,mestre:!!asMaster,pronto:true,papelCognitivo:escolha.papel,camadaAcessibilidade:escolha.camada,entrouMs:Date.now(),atualizadoEmMs:Date.now()};
    let extraPlayer={};
    try{
      if(typeof window.DragonSalaAoEntrar==='function'){
        const x=await window.DragonSalaAoEntrar({code,asMaster,nome,forma,escolha,uid:u.uid,root:ROOT,caseId:CASE_ID});
        if(x&&typeof x==='object')extraPlayer=x;
      }
    }catch(e){console.warn('MOSAICO: DragonSalaAoEntrar',e)}
    await setDoc(playerRef(code,u.uid),{...basePlayer,...extraPlayer},{merge:true});
    /* Quem manda sobre isto é o documento da sala, não o caminho que a pessoa
       tomou para chegar aqui. O Professor que recarrega, que volta pelo QR ou que
       reconecta entra pelo mesmo formulário do convidado — e saía marcado como
       convidado, perdendo a abertura e o painel Sala na própria mesa que abriu.
       Comparar o uid com mestreUid devolve a verdade em qualquer caminho. */
    role=(asMaster||snap.data().mestreUid===u.uid)?'master':'guest';ouvir();
  }catch(e){formEntrar(e?.message||'Não foi possível entrar.',asMaster)}
  finally{entrando=false;const b2=document.getElementById('drEnter');if(b2&&b2.disabled){b2.disabled=false;b2.textContent=b2.dataset.rotulo||'Entrar'}}
}
/* SUBSTITUIDO 03/10, nos dois onSnapshot abaixo: `else atualizarSalaPersistente();` passou a avisar também
   os ouvintes do jogo (DragonSala.aoMudar). */
function ouvir(){
  unsubRoom?.();unsubPlayers?.();
  unsubRoom=onSnapshot(roomRef(code),s=>{room=s.exists()?s.data():null;if(!room){if(!gameReleased)menu();return;}if(room.fase&&room.fase!=='sala'&&!gameReleased)liberar({code,role,room,players});else if(!gameReleased)renderLobby();else{atualizarSalaPersistente();avisarOuvintes()}});
  unsubPlayers=onSnapshot(collection(db,ROOT,code,'jogadores'),s=>{players=s.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>(a.entrouMs||0)-(b.entrouMs||0));if(!gameReleased)renderLobby();else{atualizarSalaPersistente();avisarOuvintes()}});
}
function renderLobby(){
  if(!code||!room)return;const master=role==='master';
  gate().innerHTML=`<div class="dr-shell"><div class="dr-brand">${esc(TITLE)} · ${master?'Curador':'Sala'}</div><div class="dr-card pf-card"><h2>${master?'Sala aberta':'Você entrou'}</h2><div class="dr-code">${esc(code)}</div>${master?`<div class="dr-qr">${qr(code)}</div><p class="dr-note">QR e código ficam nesta sala durante toda a entrada dos participantes.</p>`:''}<div class="dr-list">${players.map(p=>{const f=FORMAS[p.forma]||FORMAS.n;return `<div class="dr-player"><span>${f.emoji} ${esc(p.nome||'Jogador')}</span><b>${p.mestre?'Curador da sala':'Jogador'}</b></div>`}).join('')||'<div class="dr-player"><span>Aguardando jogadores…</span></div>'}</div>${master?`<button class="dr-btn" id="drStart">Iniciar partida</button>`:`<p class="dr-note">Aguardando o Curador da sala iniciar a partida…</p>`}</div></div>`;
  /* Revisão 17: como nos outros Mosaicos, o manual do jogador abre logo depois de entrar (na espera), com "Entendi"; o "i" reabre. */
  gate().querySelector('.dr-shell')?.insertAdjacentHTML('beforeend','<button class="dr-info" id="drInfo" type="button" aria-label="Como jogar">i</button>');
  document.getElementById('drInfo').onclick=()=>abrirManual();
  manualDaEntrada();
  if(master)document.getElementById('drStart').onclick=async()=>{
    const patch={fase:'jogo',iniciadaEmMs:Date.now()};
    try{
      if(typeof window.DragonSalaAntesDeIniciar==='function'){
        const extra=await window.DragonSalaAntesDeIniciar({code,role,room,players,root:ROOT,caseId:CASE_ID});
        if(extra&&typeof extra==='object')Object.assign(patch,extra);
      }
    }catch(e){console.error('MOSAICO: DragonSalaAntesDeIniciar',e);return}
    await updateDoc(roomRef(code),patch);
  }
}
function abrirManual(){const d=document.getElementById('helpDialog');if(d&&!d.open)d.showModal();}
function manualDaEntrada(){
  const uid=auth.currentUser?.uid;if(!code||!uid)return;
  const chave='mosaico-loop-manual-'+code+'-'+uid;   // a mesma chave que a sala usa: o manual não abre de novo quando a partida começa
  const eu=players.find(p=>p.id===uid)||{},sd=document.getElementById('saudacao'),nome=String(eu.nome||'').trim();
  if(sd&&nome&&!sd.textContent){sd.textContent=({m:'Bem-vindo',f:'Bem-vinda'}[eu.forma]||'Olá')+', '+nome+'.';sd.classList.remove('hidden');}
  try{if(sessionStorage.getItem(chave))return;sessionStorage.setItem(chave,'1');}catch{}
  abrirManual();
}
function liberar(detail){
  gameReleased=true;document.getElementById('dragonRoomGate')?.remove();
  const MPC=window.MosaicoPapelCamada;
  if(MPC){detail.papelCamada=MPC.carregar(casoPapel());}
  window.MOSAICO_ROOM=detail;
  if(role==='master'){instalarSalaPersistente();if(code)ouvirTelas();}
  window.dispatchEvent(new CustomEvent(READY_EVENT,{detail}));
}
/* O PONTO DE EXTENSÃO DA AÇÃO DO PROFESSOR.
   Quem sabe que a mesa parou esperando uma decisão é o jogo, não esta folha —
   e quem tem o botão onde o Professor olha é esta folha. DragonSala.acao costura
   os dois: o jogo declara o que precisa ser deliberado, o painel ganha a seção
   em destaque e o botão da Sala passa a piscar. acao(null) desliga. */
function alertaSala(){
  const ligado=!!acaoMestre&&role==='master';
  document.getElementById('dragonSalaBtn')?.classList.toggle('acao-necessaria',ligado);
  document.querySelectorAll('[data-dragon-sala-espelho]').forEach(el=>el.classList.toggle('acao-necessaria',ligado));
}
/* Campos que ownPlayerUpdate aceita no convidado (espelho das regras). */
const PATCH_ME_KEYS=new Set(['pronto','forma','atualizadoEmMs','pistas','personagem','fragmentoPronto','fragmentoProntoMs','papelCognitivo','camadaAcessibilidade','aliasNarrativo','hpcScaffold','pedidoEnvioFragmento','votoEnvioSim','votoEnvioMs']);
async function patchMe(fields){
  try{
    const u=auth.currentUser;
    if(!code||!u||!fields||typeof fields!=='object')return false;
    const patch={};
    for(const k of Object.keys(fields)){
      if(PATCH_ME_KEYS.has(k)&&fields[k]!==undefined)patch[k]=fields[k];
    }
    if(!Object.keys(patch).length)return false;
    patch.atualizadoEmMs=Date.now();
    await updateDoc(playerRef(code,u.uid),patch);
    return true;
  }catch(e){
    console.warn('MOSAICO: patchMe falhou',e);
    return false;
  }
}
window.DragonSala={
  acao(cfg){acaoMestre=cfg&&cfg.rotulo?cfg:null;alertaSala();atualizarSalaPersistente();},
  patchMe,
  telaoPronto,
  get codigo(){return code},
  get papel(){return role},
  get app(){return app},
  get auth(){return auth},
  get db(){return db},
  get root(){return ROOT},
  get caseId(){return CASE_ID},
  get project(){return PROJECT},
  /* 03/10 (O Impostor): acesso genérico para o jogo, sem filtro de campos — quem
     decide o que passa são as regras do projeto do caso. */
  get uid(){return auth.currentUser?.uid||''},
  get sala(){return room},
  get jogadores(){return players},
  atualizarEu(campos){const u=auth.currentUser;if(!code||!u)return Promise.resolve(false);return updateDoc(playerRef(code,u.uid),{...campos,atualizadoEmMs:Date.now()}).then(()=>true,e=>{console.warn('MOSAICO: atualizarEu',e);return false})},
  atualizarJogador(id,campos){if(!code||role!=='master'||!id)return Promise.resolve(false);return updateDoc(playerRef(code,id),{...campos,atualizadoEmMs:Date.now()}).then(()=>true,e=>{console.warn('MOSAICO: atualizarJogador',e);return false})},
  atualizarSala(campos){if(!code||role!=='master')return Promise.resolve(false);return updateDoc(roomRef(code),campos).then(()=>true,e=>{console.warn('MOSAICO: atualizarSala',e);return false})},
  adicionar(colecao,dados){const u=auth.currentUser;if(!code||!u)return Promise.resolve(null);return addDoc(collection(db,ROOT,code,colecao),{...dados,de:u.uid,ms:Date.now()}).catch(e=>{console.warn('MOSAICO: adicionar',e);return null})},
  ouvirColecao(colecao,cb){if(!code)return()=>{};return onSnapshot(collection(db,ROOT,code,colecao),s=>cb(s.docChanges().filter(c=>c.type==='added').map(c=>({id:c.doc.id,...c.doc.data()}))),e=>console.warn('MOSAICO: ouvirColecao',e))},
  aoMudar(cb){ouvintes.push(cb)},
};
const ouvintes=[];
function avisarOuvintes(){ouvintes.forEach(f=>{try{f(room,players)}catch(e){console.warn(e)}})}
function instalarSalaPersistente(){
  if(document.getElementById('dragonSalaBtn'))return;
  const b=document.createElement('button');b.id='dragonSalaBtn';b.type='button';b.textContent='Sala';b.onclick=()=>{salaAberta=!salaAberta;atualizarSalaPersistente()};
  /* Se a página já tem Sala no topo (Caso|Sala / hudSala), o flutuante some —
     o nó fica no DOM para clique programático e alerta. */
  if(document.querySelector('#hudSala,[data-dragon-sala-espelho],[data-dragon-sala-host]'))b.style.display='none';
  document.body.appendChild(b);atualizarSalaPersistente();
}
function atualizarSalaPersistente(){
  if(role!=='master'||!gameReleased)return;
  let p=document.getElementById('dragonSalaPanel');
  if(!salaAberta){p?.remove();return;}
  if(!p){p=document.createElement('div');p.id='dragonSalaPanel';document.body.appendChild(p)}
  /* A ação do Professor entra ANTES do código e do QR, e aberta. Ela é o motivo
     de o botão estar piscando: quem abre o painel por causa do alerta tem de
     encontrar o que fazer no primeiro olhar, não dentro do terceiro acordeão. */
  const bloco=acaoMestre?`<div class="dr-acao"><b>Ação do Curador necessária</b><p>${esc(acaoMestre.texto||'')}</p><button class="dr-btn" id="drAcaoMestre">${esc(acaoMestre.rotulo)}</button></div>`:'';
  p.innerHTML=`<div class="dr-sala-card pf-card"><div class="dr-sala-head"><div><div class="dr-brand">Curador · ${esc(TITLE)}</div><h2>Sala</h2><p class="dr-note">${room?.ritmo==='conduzido'?'Ritmo conduzido pelo Curador':'Ritmo automático'}</p></div><button class="dr-close" id="drSalaClose">Fechar</button></div>${bloco}<details class="dr-sala-section" open><summary>Código e QR</summary><div class="dr-sala-code">${esc(code)}</div><div class="dr-sala-qr">${qr(code)}</div></details><details class="dr-sala-section"><summary>Participantes · ${players.length}</summary><div class="dr-list">${players.map(x=>`<div class="dr-player"><span>${esc(x.nome||'Jogador')}</span><b>${x.mestre?'Professor':'Jogador'}</b></div>`).join('')}</div></details><details class="dr-sala-section"><summary>Controle partida</summary><div class="dr-sala-actions"><p class="dr-note">${room?.ritmo==='conduzido'?'Ritmo conduzido pelo Professor: avance pelo painel quando a turma estiver pronta.':'Ritmo automático: o jogo avança quando todos terminam.'}</p></div></details><details class="dr-sala-section"><summary>Encerrar sala</summary><div class="dr-sala-actions"><button class="dr-btn danger" id="drEndRoom">Encerrar sala</button></div></details></div>`;
  pintarTelao();
  document.getElementById('drSalaClose').onclick=()=>{salaAberta=false;atualizarSalaPersistente()};
  /* Fecha o painel junto: o Professor tocou porque queria voltar para a mesa, e
     deixar o painel aberto por cima do jogo esconde o que ele acabou de soltar. */
  const acao=document.getElementById('drAcaoMestre');
  if(acao)acao.onclick=()=>{const f=acaoMestre?.aoTocar;salaAberta=false;atualizarSalaPersistente();f?.()};
  document.getElementById('drEndRoom').onclick=encerrarSala;
}
async function encerrarSala(){
  if(role!=='master'||!code)return;
  if(!confirm('Encerrar esta sala para todos os participantes?'))return;
  try{await updateDoc(roomRef(code),{ativa:false,encerradaEmMs:Date.now()});location.href=location.pathname;}
  catch(e){alert('Não foi possível encerrar a sala. '+(e?.message||e));}
}
css();
const qsSolo=new URLSearchParams(location.search);
const QUER_CONDUZIR=qsSolo.get('conduzir')==='1';
const menuOuConduzir=()=>{if(QUER_CONDUZIR){intencao='sala';renderMasterGate();}else menu();};
const querEnsaio=qsSolo.get('soloLab')==='1'||qsSolo.has('bots');
if(querEnsaio){intencao='ensaio';}
/* SUBSTITUIDO 03/10, nas duas saídas abaixo: `if(q){code=q.toUpperCase();return formEntrar('',false)}`
   passou a tentar a volta sem formulário quando a página pede (data-retomar). */
getRedirectResult(auth).then(r=>{
  const voltandoDoGoogle=recuperarEscolhas();
  /* Se o Google devolveu usuário, seguimos mesmo sem a marca da viagem: alguns
     navegadores limpam o sessionStorage no salto. O contrário é o que não pode
     passar em silêncio — saiu para o Google, voltou sem nada, e antes disso
     reaparecia o menu como se nada tivesse acontecido. */
  if(r?.user)return abrirComoMestre(r.user);
  if(voltandoDoGoogle)return renderMasterGate('O Google voltou sem concluir o login neste navegador. Toque em “Abrir com Google” de novo: desta vez a janela abre por cima desta página, sem sair dela.');
  if(q){code=q.toUpperCase();return RETOMAR?retomar():formEntrar('',false)}
  if(querEnsaio)return iniciarEnsaioLocal();
  menuOuConduzir();
}).catch(e=>{
  const voltandoDoGoogle=recuperarEscolhas();
  /* O missing-initial-state é justamente o caso em que a marca da viagem some
     junto com o resto do estado — exigir a marca para mostrar o erro deixava a
     falha cair no menu outra vez, calada. O código do erro basta para saber que
     havia um login em curso. */
  const erroDeLogin=/missing initial state|auth\//i.test(String(e?.code||'')+' '+String(e?.message||''));
  if(voltandoDoGoogle||erroDeLogin)return renderMasterGate(mensagemLogin(e));
  if(q){code=q.toUpperCase();return RETOMAR?retomar():formEntrar('',false)}
  if(querEnsaio)return iniciarEnsaioLocal();
  menuOuConduzir();
});
/* 03/10 (O Impostor): a volta sem formulário. Espera o Firebase devolver a sessão
   guardada neste aparelho; se ela já tem um lugar nesta sala (o documento do
   jogador existe) e a sala está aberta, entra direto — Professor continua Professor,
   porque quem decide é o mestreUid. Qualquer outra situação cai no formulário de
   sempre. */
function retomar(){
  gate().innerHTML=`<div class="dr-shell"><div class="dr-brand">${esc(TITLE)}</div><div class="dr-card pf-card"><h2>Voltando à sala…</h2><div class="dr-code">${esc(code)}</div></div></div>`;
  const parar=onAuthStateChanged(auth,async u=>{
    parar();
    try{
      if(!u)return formEntrar('',false);
      const [sala,eu]=await Promise.all([getDoc(roomRef(code)),getDoc(playerRef(code,u.uid))]);
      if(!sala.exists()||sala.data().ativa!==true)return formEntrar('Sala não encontrada ou encerrada.',false);
      if(!eu.exists())return formEntrar('',false);
      role=sala.data().mestreUid===u.uid?'master':'guest';ouvir();
    }catch(e){formEntrar('',false)}
  });
}
