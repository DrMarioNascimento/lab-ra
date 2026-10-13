import {apply,snapshot,earnedStages} from './ac-core.mjs';
export const COLORS=[
 {nome:'Fragmento da Névoa',cor:'Vermelho',hex:'#db514d',simbolo:'🟥'},
 {nome:'Fragmento da Tempestade',cor:'Azul',hex:'#478bdd',simbolo:'🟦'},
 {nome:'Fragmento do Farol',cor:'Dourado',hex:'#d5ad43',simbolo:'🟨'},
 {nome:'Fragmento da Noite',cor:'Roxo',hex:'#a179d6',simbolo:'🟪'},
 {nome:'Fragmento do Jardim',cor:'Verde',hex:'#4eab79',simbolo:'🟩'},
 {nome:'Fragmento da Aurora',cor:'Laranja',hex:'#e28c44',simbolo:'🟧'}
];

export function groupPlan(roster,run){
 const members=roster.map(p=>({...p}));
 if(members.length<2||members.length>12||new Set(members.map(p=>p.id)).size!==members.length)throw Error('Elenco invalido');
 const hash=s=>{let h=2166136261;for(const c of s)h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0;};
 members.sort((a,b)=>hash(run+'|'+a.id)-hash(run+'|'+b.id)||a.id.localeCompare(b.id));
 const groups=[];while(members.length){const team=members.splice(0,members.length===3?3:2);groups.push({...COLORS[groups.length],numero:groups.length+1,membros:team.map((p,i)=>({...p,papel:['luz','conhecimento','apoio'][i]}))});}return groups;
}
export function replay(group,events){
 const room={id:group.id,stage:'posicionar',startedAt:null,finishedAt:null,beam:null,peers:new Map(group.fragmento.membros.map(p=>[p.id,{role:p.papel}])),percurso:{runId:group.runId,ready:[],paused:[],players:group.players,fragmento:group.fragmento}};
 for(const e of [...events].sort((a,b)=>a.at-b.at||a.id.localeCompare(b.id))){
   if(group.players[e.role]!==e.uid||!Number.isFinite(e.at)||e.at>group.endsAt)continue;
   apply(room,e.role,e.event,e.at);
 }return room;
}
/* Um recibo por integrante, com o que ELE ganhou em cada tarefa do percurso:
   a sala (individual), a vela e as chaves (da dupla) e os papéis (individual).
   Sai sempre — terminado o percurso ou não: o prazo de uma tarefa só zera
   aquela tarefa (Mario, 18/09/2026). */
export function receipts(group,events){
 const r=replay(group,events),common={version:2,sala:group.id,runId:group.runId,players:group.players};
 return Object.entries(group.players||{}).map(([role,jogador])=>{
  const e=earnedStages(r,role),sala=r.percurso.salaIndividual?.[role]?.pontos||0;
  return {...common,kind:'individual',role,jogador,salaEscura:sala,vela:e.vela,chaves:e.chaves,papeis:e.papeis||0,evidence:e.evidence,velaConcluida:e.velaConcluida};
 });
}
export {apply,snapshot};
