import {doc,collection,getDoc,getDocs,setDoc,writeBatch,onSnapshot,query,where,serverTimestamp} from 'https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js';
import {groupPlan,replay,receipts,apply,snapshot} from './ac-replay.mjs';
const contexts=new Map();
function bridge(){let host=window;for(let i=0;i<4;i++){if(host.DragonSala)return host.DragonSala;if(host.parent===host)break;host=host.parent;}throw Error('Entre na atividade pela sua mesa.');}
function base(){const b=bridge();if(!b.auth.currentUser||!b.codigo)throw Error('Entre novamente na mesa.');return {b,uid:b.auth.currentUser.uid,db:b.db,path:[b.root,b.codigo,'acGrupos']};}
const result=(value,status=200)=>({ok:status>=200&&status<300,status,json:async()=>value});
export async function prepare(code,run,roster,phase,duration){
 const {db,path,uid}=base();const plan=groupPlan(roster,run),batch=writeBatch(db);
 for(const f of plan){const id=run+'_'+f.numero;batch.set(doc(db,...path,id),{id,runId:run,phase,master:uid,players:Object.fromEntries(f.membros.map(m=>[m.papel,m.id])),fragmento:f,endsAt:Date.now()+86400000,createdAt:serverTimestamp()});}
 await batch.commit();return plan;
}
function parseEvents(s){return s.docs.filter(d=>!d.metadata.hasPendingWrites).map(d=>{const v=d.data();return {id:d.id,...v,at:v.at?.toMillis()};});}
async function context(id){
 if(contexts.has(id))return contexts.get(id);
 const {db,path,uid}=base(),ref=doc(db,...path,id),snap=await getDoc(ref);if(!snap.exists())throw Error('Fragmento indisponivel. Reabra pela mesa.');
 const group=snap.data(),role=Object.keys(group.players).find(r=>group.players[r]===uid);if(!role)throw Error('Voce nao pertence a este Fragmento.');
 const c={db,path,uid,ref,group,role,events:[],presence:[],watchers:new Set(),lastSignal:{},serial:Promise.resolve()};contexts.set(id,c);
 c.events=parseEvents(await getDocs(collection(ref,'eventos')));return c;
}
function view(c){const v=snapshot(replay(c.group,c.events),Date.now(),c.role);v.online=c.presence.filter(p=>Date.now()-p.at<40000).map(p=>p.role);return v;}
async function send(c,event,force=false){
 if(event.type==='maquete_mover')c.pendingMotion=event;
 if(event.type==='maquete_encaixar'&&c.pendingMotion)await send(c,c.pendingMotion,true);
 const now=Date.now();if(['feixe','maquete_mover'].includes(event.type)){
   if(!force&&now-(c.lastSignal[event.type]||0)<500)return result({accepted:true});c.lastSignal[event.type]=now;
 }
 if(event.type==='percurso_identificar')return result({accepted:event.jogador===c.uid},event.jogador===c.uid?200:403);
 const room=replay(c.group,c.events);if(!apply(room,c.role,event,now))return result({accepted:false},409);
 const id=crypto.randomUUID(),ref=doc(collection(c.ref,'eventos'),id);
 await setDoc(ref,{uid:c.uid,role:c.role,event,at:serverTimestamp()});
 const saved=await getDoc(ref);const v=saved.data();if(!c.events.some(e=>e.id===id))c.events.push({id,...v,at:v.at.toMillis()});
 return result({accepted:true});
}
export async function request(url,options={}){
 try{
 const u=new URL(url,location.href),q=u.searchParams,{db,path,uid}=base();
 if(u.pathname==='/api/ac/fragmentos/entrar'){
   const {run}=JSON.parse(options.body),groups=await getDocs(query(collection(db,...path),where('runId','==',run)));
   const g=groups.docs.map(d=>d.data()).find(g=>Object.values(g.players).includes(uid));if(!g)throw Error('O mestre ainda nao definiu seu Fragmento.');
   const papel=Object.keys(g.players).find(r=>g.players[r]===uid);return result({sala:g.id,papel,chave:'firebase',fragmento:g.fragmento});
 }
 if(['/api/ac/results','/api/ac/individual'].includes(u.pathname)){
   const groups=await getDocs(query(collection(db,...path),where('runId','==',q.get('run')))),rows=[];
   for(const d of groups.docs){const g=d.data(),events=parseEvents(await getDocs(collection(d.ref,'eventos')));rows.push(...receipts(g,events));}
   return result(rows.filter(r=>u.pathname.endsWith('/individual')?r.kind==='individual':!r.kind));
 }
 if(u.pathname==='/api/ac/rooms')throw Error('Crie a partida na mesa para formar os Fragmentos.');
 const c=await context(q.get('sala'));if(c.role!==q.get('papel'))return result({error:'Papel invalido'},403);
 if(u.pathname==='/api/ac/state'){c.events=parseEvents(await getDocs(collection(c.ref,'eventos')));return result(view(c));}
 if(u.pathname==='/api/ac/action'){
   const event=JSON.parse(options.body);const next=c.serial.then(()=>send(c,event));c.serial=next.catch(()=>{});return await next;
 }return result({error:'Rota ausente'},404);
 }catch(e){return result({error:e.message},503);}
}
export async function listen(url,onState,onOpen,onError){
 const c=await context(new URL(url,location.href).searchParams.get('sala'));
 const stop=onSnapshot(collection(c.ref,'eventos'),s=>{c.events=parseEvents(s);onOpen();onState(view(c));},onError);
 const presence=()=>setDoc(doc(c.ref,'presenca',c.uid),{uid:c.uid,role:c.role,at:serverTimestamp()}).catch(onError);presence();
 const presenceStop=onSnapshot(collection(c.ref,'presenca'),s=>{c.presence=s.docs.map(d=>{const p=d.data();return {...p,at:p.at?.toMillis()||0};});onState(view(c));},onError);
 const heartbeat=setInterval(presence,15000);
 const tick=setInterval(()=>onState(view(c)),500);
 return ()=>{stop();presenceStop();clearInterval(heartbeat);clearInterval(tick);};
}
