import {PEOPLE,STAGES,optionsForTeams} from './content.js';
export const clamp=(n,min=0,max=100)=>Math.max(min,Math.min(max,n));
const round=n=>Math.round(n*10)/10;
export function initial(legacy=null){return {round:0,budget:8,production:0,people:PEOPLE.map((p,i)=>({...p.initial,id:p.id,active:true,excluded:false,production:0,...(legacy?{reserve:clamp(p.initial.reserve-legacy[i]*.35),fatigue:clamp(p.initial.fatigue+legacy[i]*.45),heat:p.initial.heat}:{} )})),history:[],violations:[],concealed:false};}
export const burden=p=>round(clamp(p.fatigue*.45+p.heat*.30+(100-p.reserve)*.25));
export const asksPause=p=>p.active&&burden(p)>=48;
export function signal(p){if(!p.active)return 'Fora da atividade';if(asksPause(p))return 'Quero uma pausa';if(burden(p)>=32)return 'Preciso de ajuste';return 'Posso continuar';}
export function residue(p){return round(clamp(p.fatigue*.65+(100-p.reserve)*.35));}
export function advance(state,optionId,meta={}){
 const stage=STAGES[state.round];if(!stage)throw Error('A partida já terminou.');
 const plan=meta.interventions;
 const option=(plan?optionsForTeams(state.round):stage.options).find(o=>o.id===optionId);if(!option)throw Error('Decisão inválida.');
 const environments={current:{cost:0,cooling:0,glare:0,pace:1},rotate:{cost:1,cooling:4,glare:18,pace:.9},shade:{cost:2,cooling:9,glare:40,pace:.95}};
 const env=plan?environments[plan.environment]:environments.current;
 if(!env)throw Error('Ambiente inválido.');
 if(state.budget<option.cost+env.cost)throw Error('Apoio insuficiente.');
 const s=structuredClone(state),before=structuredClone(state.people);
 let removed=null;
 if(option.exclude){const candidates=s.people.filter(p=>p.active).sort((a,b)=>burden(b)-burden(a));removed=candidates[0]?.id;if(removed){s.people.find(p=>p.id===removed).active=false;s.people.find(p=>p.id===removed).excluded=true;s.violations.push({round:s.round,kind:'inclusion',person:removed});}}
 s.people=s.people.map((p,i)=>{
  const def=PEOPLE[i],old=before[i];const requested=asksPause(old);
  const care=plan?.care?.[p.id]??{},request=plan?.requests?.[p.id]??'continue';
  let load=option.load;if(option.adaptive)load*=def.capacity;
  if(request==='adjust')load=Math.min(load,8*def.capacity);
  if(care.toilet)load*=.5;
  const rests=!p.active||(option.veto&&requested)||request==='pause'||care.rest===true;
  if(rests)load=0;
  if(requested&&load>8&&!option.listen&&request!=='adjust')s.violations.push({round:s.round,kind:'autonomy',person:p.id});
  const relative=load/def.capacity;
  const hydration=plan?clamp((old.hydration??0)-(care.water?25:0)):0;
  const feedback=1+old.fatigue/170+(100-old.reserve)/220+(plan?Math.max(0,hydration-40)/180:0);
  const recovery=rests?Math.max(12,option.recovery):option.recovery;
  const cooling=(rests?Math.max(10,option.cooling):option.cooling)+env.cooling;
  const fatigue=clamp(old.fatigue+relative*.64*feedback-recovery*.85);
  const heat=clamp(old.heat+relative*.37*def.thermal+stage.heat-cooling);
  const reserve=clamp(old.reserve-relative*.66*feedback+recovery*.8);
  const gain=rests?0:option.gain*def.capacity*clamp(1-old.fatigue/180-old.heat/300,.18,1)*env.pace*(care.toilet?.5:1)*(care.water?.95:1)*(request==='adjust'?.7:1);
  const extras=plan?{hydration:round(clamp(hydration+relative*.35+stage.heat*.45)),glasses:old.glasses||care.glasses===true,bathroom:care.toilet?false:old.bathroom,bathroomVisits:(old.bathroomVisits??0)+(care.toilet?1:0)}:{};
  if(plan){extras.glare=round(clamp(20+stage.heat*5-env.glare)*(extras.glasses?.4:1));if(s.round===0&&p.id==='noa')extras.bathroom=true;}
  return {...p,...extras,fatigue:round(fatigue),heat:round(heat),reserve:round(reserve),production:round(p.production+gain)};
 });
 s.budget-=option.cost+env.cost;s.production=round(s.people.reduce((v,p)=>v+p.production,0));
 if(option.conceal){s.concealed=true;s.violations.push({round:s.round,kind:'truth',person:null});}
 const entry={round:s.round,option:option.id,before,after:structuredClone(s.people),production:s.production,reason:option.reason,prediction:meta.prediction??'',note:String(meta.note??'').slice(0,1200),listened:[...(meta.listened??[])],removed,...(plan?{interventions:structuredClone(plan),teamContributions:structuredClone(meta.teamContributions),dissent:meta.dissent??''}:{} )};s.history.push(entry);s.round++;return s;
}
export function replay(history,replacement=null,legacy=null){let s=initial(legacy);for(let i=0;i<history.length;i++){let id=replacement&&i===replacement.round?replacement.option:history[i].option;s=advance(s,id,history[i]);}return s;}
export function summary(s){return {production:Math.round(s.production),residue:Math.round(s.people.reduce((v,p)=>v+residue(p),0)/4),worst:Math.round(Math.max(...s.people.map(residue))),participation:s.people.filter(p=>!p.excluded).length,requestsIgnored:s.violations.filter(v=>v.kind==='autonomy').length,remaining:s.budget};}
export function encodeLegacy(s){const values=s.people.map(p=>Math.round(residue(p)));const check=values.reduce((a,v,i)=>a+v*(i+3),17)%97;return `L1-${values.join('-')}-${check}`;}
export function decodeLegacy(code){const a=String(code).trim().toUpperCase().split('-');if(a.length!==6||a[0]!=='L1'||a.slice(1).some(v=>!/^\d{1,3}$/.test(v)))throw Error('Código de herança inválido.');const values=a.slice(1,5).map(Number);if(values.some(v=>v<0||v>100)||Number(a[5])!==values.reduce((s,v,i)=>s+v*(i+3),17)%97)throw Error('Código de herança inválido.');return values;}
