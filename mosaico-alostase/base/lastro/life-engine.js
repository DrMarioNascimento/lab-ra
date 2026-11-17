import {FIELDS,METRICS,PROFILES,EVENTS,teams,VERSION} from './life-content.js';
export const clamp=(v,a=0,b=100)=>Math.min(b,Math.max(a,v));
const rounded=v=>Math.round(v*1000)/1000;
export const defaultPlan=()=>Object.fromEntries(FIELDS.map(f=>[f.key,f.default]));
export function validatePlan(p) {
 for(const f of FIELDS){const v=p[f.key];if(f.options){if(!f.options.some(o=>o[0]===v))throw Error('Valor inválido: '+f.label);}else if(typeof v!=='number'||!Number.isFinite(v)||v<f.min||v>f.max)throw Error('Fora da faixa: '+f.label);}
 if(hours(p)>24+.00001)throw Error('A rotina ocupa '+hours(p).toFixed(2)+' h. Ajuste para no máximo 24 h.');
 return true;
}
export function hours(p){return p.work+p.commute+p.sleep+(p.exercise+p.breaks+p.meditation+p.leisure+p.contact)/60+1.5;}
export function eventFor(day,seed=1){const id=((day-1)*17+(seed%10000)*7+Math.floor((day-1)/40)*11)%EVENTS.length;return {...EVENTS[id],id};}
export function workday(day,profile){return PROFILES[profile].shift?(day-1)%6<4:(day-1)%7<5;}
export function workout(day,n){return Math.floor(day*n/7)>Math.floor((day-1)*n/7);}
export function initial(config={}) {
 const c={days:84,profile:'escritorio',mode:'solo',teamCount:5,students:35,seed:31,step:7,rotation:0,...config};
 if(![28,84,180,365].includes(c.days)||!PROFILES[c.profile]||!['solo','teams'].includes(c.mode)||![4,5,6].includes(c.teamCount)||!Number.isInteger(c.students)||c.students<c.teamCount||c.students>400||![1,3,7].includes(c.step)||!Number.isInteger(c.seed)||c.seed<0||c.seed>9999||!Number.isInteger(c.rotation)||c.rotation<0)throw Error('Configuração inválida.');
 const p=PROFILES[c.profile];
 const state={water:0,fuel:80,sleepDebt:0,sleepQuality:90,circadian:0,mental:10,physical:10,tissue:5,arousal:25,wear:5,heat:0,glare:0,comfort:0,fitness:p.fitness,strength:p.strength,heatAdapt:10,regulation:20,support:p.support,backlog:0,caffeine:0,readiness:90,attention:90,perceived:10};
 const plan=defaultPlan();plan.commute=p.commute;
 return {version:VERSION,config:c,day:0,state,baseline:{...state},plan,history:[],turns:[],totals:{target:0,output:0,limited:0,points:0},ended:false};
}
function schedule(plan,day,profile,event,response){
 const p={...plan};const active=workday(day,profile);
 if(!active)p.work=0;
 if(!workout(day,p.exerciseDays))p.exercise=0;
 if(!active)p.commute=0;
 let negotiated=0;
 if(active&&response==='negotiate'){p.work=Math.max(0,p.work-1);negotiated=1;}
 if(active&&response==='recover'){const freed=Math.min(1,p.work);p.work-=freed;p.sleep+=.5*freed;p.meditation+=15*freed;}
 p.commute+=(active?event.travel||0:0);
 let overflow=Math.max(0,hours(p)-24);const cuts=[];
 for(const [key,scale] of [['leisure',60],['contact',60],['meditation',60],['exercise',60],['work',1]]){
  if(overflow<=0)break;const cut=Math.min(p[key]/scale,overflow);p[key]-=cut*scale;overflow-=cut;if(cut>.001)cuts.push({key,hours:rounded(cut)});
 }
 // The maximum imported plan is validated; any remaining overflow is a hard error.
 if(hours(p)>24+.00001)throw Error('Agenda impossível após o evento.');
 return {p,active,negotiated,cuts,rest:Math.max(0,24-hours(p))};
}
export function stepDay(run,plan,response='maintain'){
 validatePlan(plan);if(run.ended||run.day>=run.config.days)throw Error('A campanha já terminou.');
 if(!['maintain','negotiate','recover'].includes(response))throw Error('Resposta inválida.');
 const day=run.day+1, prof=PROFILES[run.config.profile],e=eventFor(day,run.config.seed),before={...run.state},s={...before};
 const {p,active,negotiated,cuts,rest}=schedule(plan,day,run.config.profile,e,response);
 const control=clamp(prof.control+(e.control||0)+p.autonomy*15);
 const night=prof.shift&&Math.floor((day-1)/6)%2===1;
 const mismatch=Math.abs(p.bedtime-(night?27:23))+(night?2:0);
 s.circadian=clamp(before.circadian*.85+mismatch*3.5);
 s.caffeine=clamp(before.caffeine*.18+(p.caffeine===2?55:p.caffeine===1?12:0));
 s.sleepQuality=clamp(98-(e.interrupt||0)*18-s.circadian*.28-Math.max(0,before.arousal-40)*.20-(p.caffeine===2?12:0),30,100);
 const effectiveSleep=p.sleep*(.72+.28*s.sleepQuality/100);
 s.sleepDebt=clamp(before.sleepDebt+(7.6-effectiveSleep)*.65,0,32);
 s.support=clamp(before.support*.98+(p.contact/30)*.7+(e.support||0)*.4);
 const pressure=clamp(18+p.work*p.demand*2.6+(e.pressure||0)+before.backlog*.22+(p.noise+(e.noise||0))*3-control*.14-s.support*.10-negotiated*8);
 const meditationBenefit=(1-Math.exp(-p.meditation/15))*(7+before.regulation*.06);
 s.arousal=clamp(before.arousal*.45+pressure*.55-meditationBenefit-p.leisure/60*2,8,100);
 s.regulation=clamp(before.regulation+Math.min(p.meditation,25)/25*.22*(1-before.regulation/100)-(p.meditation?0:.07));
 const exerciseLoad=p.exercise/60*p.intensity*24;
 const travelLoad=p.commute*p.activeTravel*8;
 const physicalLoad=p.work*prof.physical*2.4+exerciseLoad+travelLoad;
 const environment=Math.max(0,p.temperature+(e.temperature||0)-24);
 const thermalDemand=environment*(1+physicalLoad/22)*(p.shade?.68:1);
 s.heat=clamp(before.heat*.30+thermalDemand*(1-before.heatAdapt*.006));
 s.glare=clamp((e.light||0)*(p.glasses?.18:1)+environment*(p.glasses?.15:.7));
 s.water=clamp(before.water*.45+(p.hydration-1)*(2+thermalDemand*.025+p.exercise/300),-4,4);
 s.fuel=clamp(before.fuel+(p.nutrition-1)*20+7-exerciseLoad*.22-Math.max(0,p.work-8)*1.5-travelLoad*.10);
 s.comfort=clamp(before.comfort*.2+(p.toilet?0:35)+Math.max(0,p.work-7)*(p.breaks?1:3));
 const sleepFactor=clamp((effectiveSleep-4)/4,0,1.25);
 const recovery=clamp(sleepFactor*(1-before.wear/180)*(1-Math.abs(s.water)*.08)*(.65+s.fuel/200),0,1.2);
 s.physical=clamp(before.physical*.76+physicalLoad*(1-before.fitness*.004)-recovery*10-rest*.6-p.breaks*.04);
 s.tissue=clamp(before.tissue*.91+physicalLoad*.22*(1-before.strength*.004)-recovery*3);
 s.mental=clamp(before.mental*.65+p.work*p.demand*prof.cognitive*2.2+s.sleepDebt*.42+s.arousal*.12+s.comfort*.04-recovery*12-p.breaks*.10-p.leisure*.025-meditationBenefit*.35);
 const overload=Math.max(0,s.physical-45)*.025+Math.max(0,s.mental-40)*.025+Math.max(0,s.sleepDebt-4)*.09+Math.max(0,s.arousal-55)*.025+Math.max(0,s.heat-35)*.02+Math.max(0,s.tissue-50)*.015;
 s.wear=clamp(before.wear+overload-recovery*.45);
 const adapt=clamp(recovery*(1-s.wear/120)*(1-s.physical/160),0,1);
 const aerobic=p.exerciseType==='strength'?.2:p.exerciseType==='mixed'?.65:1;
 const strength=p.exerciseType==='aerobic'?.2:p.exerciseType==='mixed'?.65:1;
 s.fitness=clamp(before.fitness+exerciseLoad*.13*aerobic*adapt*(1-before.fitness/100)-Math.max(0,before.fitness-20)*.0018,10,95);
 s.strength=clamp(before.strength+exerciseLoad*.13*strength*adapt*(1-before.strength/100)-Math.max(0,before.strength-20)*.0015,10,95);
 s.heatAdapt=clamp(before.heatAdapt+Math.min(thermalDemand,25)*.035*adapt*(1-before.heatAdapt/100)-before.heatAdapt*(thermalDemand>5?.006:.025));
 s.attention=clamp(100-s.sleepDebt*1.65-s.mental*.35-s.circadian*.12-s.arousal*.10+s.caffeine*.06);
 s.readiness=clamp(100-s.physical*.28-s.tissue*.12-s.wear*.25-s.sleepDebt*.95-s.heat*.15-Math.abs(s.water)*4-Math.max(0,65-s.fuel)*.3);
 s.perceived=clamp(s.physical*.38+s.mental*.36+s.sleepDebt*.55+s.arousal*.1-s.caffeine*.10);
 const limited=s.readiness<30||s.attention<30;
 const available=clamp((s.attention*.55+s.readiness*.45)/100,.12,1);
 const target=active?8*(1+(e.demand||0))*(1-negotiated*(control/100)*.125):0;
 const output=p.work*p.demand*available*(limited?.65:1);
 s.backlog=clamp(before.backlog*.94+(target-output)*1.5);
 for(const key in s)s[key]=rounded(s[key]);
 const delta=Object.fromEntries(METRICS.map(([k])=>[k,rounded(s[k]-before[k])]));
 const entry={day,event:e.id,response,plan:{...plan},effective:p,state:s,delta,output:rounded(output),target:rounded(target),limited,rest:rounded(rest),cuts,mechanisms:{effectiveSleep:rounded(effectiveSleep),recovery:rounded(recovery),physicalLoad:rounded(physicalLoad),pressure:rounded(pressure),overload:rounded(overload)}};
 const totals={target:run.totals.target+target,output:run.totals.output+output,limited:run.totals.limited+(limited?1:0),points:run.totals.points+Math.min(output,target)*10};
 return {...run,day,state:s,plan:{...plan},history:[...run.history,entry],totals,ended:day>=run.config.days};
}
export function advance(run,plan,response='maintain',count=run.config.step,approvals=[]) {
 if(run.ended||run.day>=run.config.days)throw Error('A campanha já terminou.');
 if(!Number.isInteger(count)||count<1||count>7)throw Error('Avance de 1 a 7 dias por decisão.');
 if(run.config.mode==='teams'){
  const ids=teams(run.config.teamCount,run.config.students,run.config.rotation).map(t=>t.id);
  if(!ids.every(id=>approvals.includes(id)))throw Error('Cada setor precisa confirmar sua parte antes de avançar.');
 }
 let next=run;const start=run.day+1;
 for(let i=0;i<count&&next.day<run.config.days;i++)next=stepDay(next,plan,response);
 return {...next,turns:[...run.turns,{start,end:next.day,plan:{...plan},response,approvals:[...approvals]}]};
}
export function benchmark(s){return rounded(clamp(s.fitness*.35+s.strength*.15+s.readiness*.30+s.fuel*.20));}
export function summary(run){
 const achievement=run.totals.target?Math.min(100,run.totals.output/run.totals.target*100):0;
 return {achievement:rounded(achievement),points:Math.round(run.totals.points),limited:run.totals.limited,wear:run.state.wear,benchmark:benchmark(run.state),gain:rounded(benchmark(run.state)-benchmark(run.baseline)),outcome:!run.ended?'Campanha em andamento':achievement>=85&&run.totals.limited<Math.max(1,run.day*.1)?'Rotina sustentada':achievement>=65?'Compromissos parcialmente sustentados':'Rotina precisa de reorganização'};
}
export function replay(run,change=null){
 let next=initial(run.config);
 for(let i=0;i<run.turns.length;i++){
  const t=run.turns[i],p=change&&i===change.turn?{...t.plan,...change.plan}:t.plan,r=change&&i===change.turn?change.response||t.response:t.response;
  next=advance(next,p,r,t.end-t.start+1,t.approvals);
 }
 return next;
}
export function exportSave(run){return JSON.stringify({format:'LASTRO-LIFE-1',version:VERSION,config:run.config,turns:run.turns});}
export function restoreSave(raw){
 if(typeof raw!=='string'||raw.length>2000000)throw Error('Arquivo de campanha inválido ou muito grande.');
 const data=JSON.parse(raw);if(data.format!=='LASTRO-LIFE-1'||data.version!==VERSION||!Array.isArray(data.turns)||data.turns.length>365)throw Error('Formato ou versão de campanha incompatível.');
 let next=initial(data.config);
 for(const t of data.turns){if(t.start!==next.day+1||!Number.isInteger(t.end)||t.end<t.start||t.end>next.config.days)throw Error('Sequência de dias inválida.');next=advance(next,t.plan,t.response,t.end-t.start+1,Array.isArray(t.approvals)?t.approvals:[]);}
 return next;
}
