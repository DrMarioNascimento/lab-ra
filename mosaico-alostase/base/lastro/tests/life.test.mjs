import assert from 'node:assert/strict';
import {initial,advance,stepDay,summary,defaultPlan,hours,validatePlan,restoreSave,exportSave,replay,eventFor} from '../life-engine.js';
import {PROFILES,METRICS,FIELDS,EVENTS,teams} from '../life-content.js';
let campaigns=0,days=0,restores=0;
function finish(config,change={},response='maintain'){
 let r=initial(config);const plan={...r.plan,...change};validatePlan(plan);
 const approve=teams(r.config.teamCount,r.config.students).map(t=>t.id);
 while(!r.ended){
  const old=r.day;r=advance(r,plan,response,r.config.step,approve);
  assert.equal(r.day,Math.min(old+r.config.step,r.config.days));
 }
 for(const h of r.history){
  assert.ok(hours(h.effective)<=24.000001);
  assert.ok(h.rest>=0&&h.output>=0&&h.target>=0);
  for(const [k,,domain,min,max] of METRICS)assert.ok(Number.isFinite(h.state[k])&&h.state[k]>=min&&h.state[k]<=max,k+' bounded');
 }
 assert.equal(r.history.length,r.config.days);assert.throws(()=>advance(r,plan),/terminou/);
 assert.deepEqual(restoreSave(exportSave(r)),r);restores++;campaigns++;days+=r.day;return r;
}
for(const profile of Object.keys(PROFILES))for(const duration of [28,84,180,365])for(const step of [1,3,7])for(const mode of ['solo',4,5,6]){
 finish({profile,days:duration,step,mode:mode==='solo'?'solo':'teams',teamCount:mode==='solo'?5:mode,students:35});
}
const policies={
 balanced:{},
 work:{work:11,sleep:5,leisure:0,contact:0,exercise:0,meditation:0,demand:1.35},
 rest:{work:0,sleep:9,leisure:90,exercise:0,meditation:20},
 exercise:{work:6,exercise:90,exerciseDays:7,intensity:1.6,sleep:7,leisure:0},
 sleep:{sleep:5,leisure:60,meditation:0},
 heat:{temperature:38,shade:0,hydration:.6,glasses:0,sleep:7}
};
const samples={};
for(const [name,p] of Object.entries(policies))for(const profile of Object.keys(PROFILES))for(const duration of [28,84,180,365]){
 const r=finish({profile,days:duration},p);if(profile==='escritorio'&&duration===84)samples[name]=summary(r);
}
const regular=finish({days:84}),short=finish({days:84},{sleep:5});
assert.ok(short.state.sleepDebt>regular.state.sleepDebt);
assert.ok(short.state.attention<regular.state.attention);
assert.ok(short.state.wear>regular.state.wear);
const breathePlan={...defaultPlan(),meditation:30},nonePlan={...defaultPlan(),meditation:0};
const b=stepDay(initial(),breathePlan),n=stepDay(initial(),nonePlan);
assert.equal(b.state.water,n.state.water);assert.equal(b.state.fuel,n.state.fuel);
assert.ok(b.state.arousal<n.state.arousal);assert.ok(hours(breathePlan)>hours(nonePlan));
const aerobic=finish({days:84},{exerciseType:'aerobic'}),force=finish({days:84},{exerciseType:'strength'});
assert.ok(aerobic.state.fitness>force.state.fitness);assert.ok(force.state.strength>aerobic.state.strength);
const wet=stepDay(initial(),{...defaultPlan(),hydration:1.5}),adequate=stepDay(initial(),defaultPlan());
assert.ok(Math.abs(wet.state.water)>Math.abs(adequate.state.water));assert.ok(wet.state.readiness<adequate.state.readiness);
const shades=stepDay(initial(),{...defaultPlan(),temperature:38,shade:1}),bare=stepDay(initial(),{...defaultPlan(),temperature:38,shade:0});
assert.ok(shades.state.heat<bare.state.heat);
const glasses=stepDay(initial(),{...defaultPlan(),temperature:38,glasses:1}),noglasses=stepDay(initial(),{...defaultPlan(),temperature:38,glasses:0});
assert.equal(glasses.state.heat,noglasses.state.heat);assert.ok(glasses.state.glare<noglasses.state.glare);
let r=initial({days:28});for(let i=0;i<4;i++)r=advance(r,r.plan,'maintain',7);
assert.deepEqual(replay(r),r);
const changed=replay(r,{turn:1,response:'recover'});assert.deepEqual(changed.history.map(h=>h.event),r.history.map(h=>h.event));assert.notDeepEqual(changed.state,r.state);
let group=initial({mode:'teams'});assert.throws(()=>advance(group,group.plan),/setor/);
for(const count of [4,5,6])for(const students of [6,30,35,40,200,400])for(let rotation=0;rotation<count;rotation++){
 const ts=teams(count,students,rotation);assert.equal(ts.reduce((s,t)=>s+t.size,0),students);assert.equal(new Set(ts.map(t=>t.team)).size,count);
 assert.deepEqual(ts.flatMap(t=>t.sectors).sort(),['rotina','movimento','cuidados','regulacao','ambiente','fisiologia'].sort());
}
assert.throws(()=>validatePlan({...defaultPlan(),work:12,sleep:10,exercise:120}),/24/);
assert.throws(()=>initial({days:99999}),/inválida/);
assert.throws(()=>restoreSave('{"format":"INVALID"}'),/Formato/);
const invalid=JSON.parse(exportSave(r));invalid.turns[1].start=1;assert.throws(()=>restoreSave(JSON.stringify(invalid)),/Sequência/);
const forged=JSON.parse(exportSave(r));forged.turns[0].plan.sleep=NaN;assert.throws(()=>restoreSave(JSON.stringify(forged)));
const ids=new Set(Array.from({length:40},(_,i)=>eventFor(i+1).id));assert.equal(ids.size,40);assert.equal(EVENTS.length,40);
// Boundary schedule: a transport delay must produce logged cuts rather than exceed a day.
const busy={...defaultPlan(),work:11,sleep:8,commute:2,exercise:0,meditation:0,contact:0,leisure:70,breaks:20};
validatePlan(busy);let cutRun=initial({days:28});while(!cutRun.ended)cutRun=advance(cutRun,busy);
assert.ok(cutRun.history.some(h=>h.cuts.length));assert.ok(cutRun.history.every(h=>hours(h.effective)<=24.000001));
console.log(JSON.stringify({campaigns,simulatedDays:days,saveRestores:restores,indicators:METRICS.length,inputs:FIELDS.length,events:EVENTS.length,samples},null,2));
