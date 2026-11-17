import {PEOPLE,STAGES,optionsForTeams} from './content.js';
import {initial,advance,burden,asksPause,summary,encodeLegacy,decodeLegacy} from './engine.js';
export const ENVIRONMENTS=[
 {id:'current',name:'Manter a estrutura disponível',cost:0,cooling:0,glare:0,pace:1,detail:'Sem custo adicional de apoio. O ambiente mantém a demanda prevista.'},
 {id:'rotate',name:'Revezar espaços e horários',cost:1,cooling:4,glare:18,pace:.9,detail:'1 ficha. Menor produção nesta janela, com menor exposição térmica e visual.'},
 {id:'shade',name:'Transferir para uma área sombreada',cost:2,cooling:9,glare:40,pace:.95,detail:'2 fichas. Reduz a demanda ambiental; não apaga a fadiga acumulada.'}
];
const PARTS={
 physiology:{name:'Respostas fisiológicas',color:'#8fbcae',mission:'Interpretar os indicadores, identificar quem tem menos margem e explicar o mecanismo provável.'},
 care:{name:'Cuidados pessoais',color:'#ee9d76',mission:'Organizar acesso à água, banheiro, proteção visual e recuperação de cada personagem.'},
 voice:{name:'Voz dos participantes',color:'#b6abd2',mission:'Trazer relatos, desejos e limites. Encaminhar pedidos individuais de ajuste ou pausa.'},
 environment:{name:'Ambiente e recursos',color:'#e1c77e',mission:'Escolher uma organização do espaço e conferir quanto apoio restará para a atividade.'},
 coordination:{name:'Coordenação da atividade',color:'#e6b49b',mission:'Reunir as contribuições, justificar a escolha final e registrar os dissensos.'},
 research:{name:'Investigação dos resultados',color:'#9dc0d8',mission:'Prever antes, comparar depois e explicar quem recebeu os benefícios e os custos.'}
};
export {PARTS};
const schema={4:[['physiology'],['care','environment','voice'],['coordination'],['research']],5:[['physiology'],['care','environment'],['voice'],['coordination'],['research']],6:[['physiology'],['care'],['environment'],['voice'],['coordination'],['research']]};
export function teamLayout(count=5,students=35,rotation=0){
 if(![4,5,6].includes(count)||!Number.isInteger(students)||students<count||students>400||!Number.isInteger(rotation)||rotation<0)throw Error('Confira o número de equipes e participantes.');
 return Array.from({length:count},(_,i)=>{const parts=schema[count][(i+rotation)%count];let name=parts.length===3?'Cuidados, ambiente e voz':parts.length===2?'Cuidados e ambiente':PARTS[parts[0]].name;return {id:'e'+(i+1),number:i+1,size:Math.floor(students/count)+(i<students%count?1:0),parts,name,color:PARTS[parts[0]].color};});
}
export function newDraft(){return {parts:{},submitted:[]};}
export function teamInitial(legacy=null){const s=initial(legacy);s.people=s.people.map((p,i)=>({...p,hydration:[22,35,43,16][i],glare:[25,20,38,18][i],glasses:false,bathroom:i===1,bathroomVisits:0}));return s;}
export function newSession(config={},legacy=null){const cfg={count:5,students:35,rotation:0,context:'comunidade',pledge:'autonomy',...config};teamLayout(cfg.count,cfg.students,cfg.rotation);if(!['comunidade','escola','movimento'].includes(cfg.context)||!['inclusion','autonomy','truth'].includes(cfg.pledge))throw Error('Configuração inválida.');return {version:2,config:cfg,initialLegacy:legacy,state:teamInitial(legacy),draft:newDraft(),phase:'collect',reviews:[],reflection:''};}
function note(v){if(typeof v!=='string'||v.trim().length<8)throw Error('Registre uma justificativa de pelo menos 8 caracteres.');return v.trim().slice(0,1200);}
function personId(v){if(!PEOPLE.some(p=>p.id===v))throw Error('Selecione um participante.');return v;}
function validatePart(key,data,state){if(!data||typeof data!=='object')throw Error('Preencha todos os campos deste setor.');const clean={note:note(data.note)};
 if(key==='physiology'){clean.focus=personId(data.focus);if(!['load','heat','recovery','variation'].includes(data.mechanism))throw Error('Selecione o mecanismo a investigar.');clean.mechanism=data.mechanism;}
 if(key==='research'){clean.focus=personId(data.focus);if(!['production','participation','residue'].includes(data.criterion))throw Error('Escolha um critério de sucesso.');clean.criterion=data.criterion;}
 if(key==='care'){clean.orders={};for(const p of PEOPLE){const o=data.orders?.[p.id];if(!o)throw Error('Confira os cuidados de todas as pessoas.');clean.orders[p.id]={};for(const k of ['water','toilet','glasses','rest'])clean.orders[p.id][k]=o[k]===true;}}
 if(key==='voice'){clean.requests={};for(const p of PEOPLE){const v=data.requests?.[p.id];if(!['continue','adjust','pause'].includes(v))throw Error('Registre um encaminhamento para cada pessoa.');if(asksPause(state.people.find(x=>x.id===p.id))&&v!=='pause')throw Error('O pedido explícito de pausa de '+p.name+' precisa ser encaminhado.');clean.requests[p.id]=v;}}
 if(key==='environment'){const env=ENVIRONMENTS.find(e=>e.id===data.choice);if(!env)throw Error('Escolha a organização do ambiente.');if(env.cost>state.budget)throw Error('Apoio insuficiente para essa organização do ambiente.');clean.choice=env.id;}
 return clean;
}
export function submitTeam(session,teamId,input){if(session.phase!=='collect')throw Error('Esta rodada já foi executada.');const t=teamLayout(session.config.count,session.config.students,session.config.rotation).find(t=>t.id===teamId);if(!t||t.parts.includes('coordination'))throw Error('Setor inválido para essa contribuição.');const next=structuredClone(session);for(const k of t.parts)next.draft.parts[k]=validatePart(k,input[k],session.state);if(!next.draft.submitted.includes(teamId))next.draft.submitted.push(teamId);return next;}
export function missingTeams(session){return teamLayout(session.config.count,session.config.students,session.config.rotation).filter(t=>!t.parts.includes('coordination')&&!session.draft.submitted.includes(t.id));}
export function teamCost(session,action){const option=optionsForTeams(session.state.round)?.find(o=>o.id===action),env=ENVIRONMENTS.find(e=>e.id===session.draft.parts.environment?.choice);return (option?.cost??0)+(env?.cost??0);}
export function ordersFromDraft(draft){const p=draft.parts;return {care:p.care.orders,requests:p.voice.requests,environment:p.environment.choice};}
export function executeRound(session,action,reason,dissent=''){
 if(session.phase!=='collect')throw Error('Esta rodada já foi executada.');if(missingTeams(session).length)throw Error('Aguarde a contribuição de todas as equipes.');const justification=note(reason);if(!optionsForTeams(session.state.round)?.some(o=>o.id===action))throw Error('Escolha uma ação para esta etapa.');if(teamCost(session,action)>session.state.budget)throw Error('Apoio insuficiente: some o ambiente e a ação da coordenação.');
 const next=structuredClone(session),orders=ordersFromDraft(next.draft);const meta={prediction:next.draft.parts.research.focus,note:justification,listened:PEOPLE.map(p=>p.id),interventions:orders,teamContributions:structuredClone(next.draft),dissent:String(dissent).trim().slice(0,1200)};
 next.state=advance(next.state,action,meta);next.phase='review';return next;
}
export function finishReview(session,explanation){if(session.phase!=='review')throw Error('Não há uma rodada aguardando análise.');const next=structuredClone(session);next.reviews.push({round:next.state.round-1,note:note(explanation)});next.phase=next.state.round===5?'report':'collect';next.draft=newDraft();return next;}
export function replayTeam(history,legacy=null,replacement=null){let s=teamInitial(legacy);for(let i=0;i<history.length;i++){const e=history[i],id=replacement&&replacement.round===i?replacement.option:e.option;s=advance(s,id,e);}return s;}
export function inheritSession(session){if(session.phase!=='report')throw Error('Conclua a análise final antes de transmitir a herança.');return newSession({...session.config,rotation:(session.config.rotation+1)%session.config.count},decodeLegacy(encodeLegacy(session.state)));}
export function restoreSession(raw){if(!raw||raw.version!==2||!raw.config||!Array.isArray(raw.state?.history)||raw.state.history.length>5)throw Error('Registro de equipes inválido.');const restored=newSession(raw.config,raw.initialLegacy);if(raw.initialLegacy){if(!Array.isArray(raw.initialLegacy)||raw.initialLegacy.length!==4||raw.initialLegacy.some(v=>!Number.isFinite(v)||v<0||v>100))throw Error('Herança inválida.');}
 if(!Array.isArray(raw.reviews)||raw.reviews.length>5)throw Error('Análises inválidas.');
 for(const [i,e] of raw.state.history.entries()){
  const contributions=e.teamContributions;if(!contributions?.parts)throw Error('Contribuições ausentes.');let build=restored;
  for(const t of teamLayout(raw.config.count,raw.config.students,raw.config.rotation).filter(t=>!t.parts.includes('coordination')))build=submitTeam(build,t.id,contributions.parts);
  build=executeRound(build,e.option,e.note,e.dissent);
  if(raw.reviews[i])build=finishReview(build,raw.reviews[i].note);
  else if(i!==raw.state.history.length-1)throw Error('Análise intermediária ausente.');
  Object.assign(restored,build);
 }
 if(restored.phase==='collect'&&raw.draft?.submitted){for(const id of raw.draft.submitted)Object.assign(restored,submitTeam(restored,id,raw.draft.parts));}
 restored.reflection=String(raw.reflection??'').slice(0,3000);return restored;
}
export function sectorSummary(state){return {...summary(state),hydration:Math.round(state.people.reduce((s,p)=>s+(p.hydration??0),0)/4),glare:Math.round(state.people.reduce((s,p)=>s+(p.glare??0),0)/4),bathroomVisits:state.people.reduce((s,p)=>s+(p.bathroomVisits??0),0)};}
export function privateVoice(p,round){if(!p.active)return 'Quero continuar pertencendo à atividade, mesmo que a tarefa precise mudar.';const parts=[];if(asksPause(p))parts.push('Quero fazer uma pausa agora.');else if(burden(p)>32)parts.push('Preciso de um ritmo mais leve.');else parts.push(p.id==='ivo'?'Tenho vontade de avançar, mas só posso falar por mim.':'Quero participar no meu ritmo.');if(p.bathroom)parts.push('Também preciso ir ao banheiro.');if(p.hydration>=40)parts.push('Estou com sede.');if(p.glare>=40&&!p.glasses)parts.push('A luminosidade está me incomodando.');if(p.id==='rui'&&round>=2)parts.push('Tenho receio de sair e não poder voltar.');return parts.join(' ');}
