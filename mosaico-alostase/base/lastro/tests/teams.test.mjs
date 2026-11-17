import assert from 'node:assert/strict';
import {PEOPLE,STAGES,optionsForTeams} from '../content.js';
import {advance,asksPause,residue,encodeLegacy,decodeLegacy} from '../engine.js';
import {teamLayout,newSession,submitTeam,missingTeams,teamCost,executeRound,finishReview,replayTeam,inheritSession,restoreSession,teamInitial} from '../team-engine.js';
const note='A menor margem muda o custo da próxima demanda.';
function input(s,policy='none',env='current'){
 const orders=Object.fromEntries(s.state.people.map(p=>[p.id,{water:policy==='care',toilet:policy==='care'&&p.bathroom,glasses:policy==='care',rest:policy==='rest'&&p.id==='rui'}]));
 return {physiology:{note,focus:'noa',mechanism:'recovery'},care:{note,orders},environment:{note,choice:env},voice:{note,requests:Object.fromEntries(s.state.people.map(p=>[p.id,asksPause(p)?'pause':policy==='adjust'?'adjust':'continue']))},research:{note,focus:'noa',criterion:'residue'}};
}
function ready(s,policy='none',env='current'){const data=input(s,policy,env);for(const t of teamLayout(s.config.count,s.config.students,s.config.rotation).filter(t=>!t.parts.includes('coordination')))s=submitTeam(s,t.id,data);return s;}
let layouts=0,completed=0,comparisons=0,budgetFailures=0,restores=0;
for(const count of [4,5,6])for(const students of [30,35,40])for(let rotation=0;rotation<count;rotation++){
 const teams=teamLayout(count,students,rotation);assert.equal(teams.reduce((n,t)=>n+t.size,0),students);assert.ok(Math.max(...teams.map(t=>t.size))-Math.min(...teams.map(t=>t.size))<=1);assert.deepEqual(teams.flatMap(t=>t.parts).sort(),['care','coordination','environment','physiology','research','voice']);layouts++;
}
let s=newSession();assert.equal(missingTeams(s).length,4);assert.throws(()=>executeRound(s,'uniform',note),/Aguarde/);assert.throws(()=>finishReview(s,note),/aguardando/);
s=ready(s);assert.equal(missingTeams(s).length,0);const snapshot=structuredClone(s);s=executeRound(s,'uniform',note,'Investigação prefere calibrar.');assert.deepEqual(snapshot.state.history,[]);assert.equal(s.phase,'review');assert.throws(()=>executeRound(s,'uniform',note),/já foi/);assert.throws(()=>submitTeam(s,'e1',input(s)),/já foi/);assert.deepEqual(restoreSession(JSON.parse(JSON.stringify(s))),s);s=finishReview(s,note);assert.equal(s.phase,'collect');assert.equal(missingTeams(s).length,4);assert.throws(()=>finishReview(s,note),/aguardando/);
const raw=structuredClone(s);raw.state.budget=999;raw.state.people[0].reserve=-999;assert.deepEqual(restoreSession(raw),s);assert.throws(()=>restoreSession({...raw,initialLegacy:[1000]}),/Herança/);
// Each care action has a distinct consequence; no effect accidentally restores all indices.
const start=teamInitial();const no={care:Object.fromEntries(PEOPLE.map(p=>[p.id,{}])),requests:Object.fromEntries(PEOPLE.map(p=>[p.id,'continue'])),environment:'current'};
const normal=advance(start,'uniform',{interventions:no});
function withCare(key){const plan=structuredClone(no);plan.care.rui[key]=true;return advance(start,'uniform',{interventions:plan});}
const glasses=withCare('glasses');assert.ok(glasses.people[1].glare<normal.people[1].glare);for(const key of ['heat','fatigue','reserve','hydration','production'])assert.equal(glasses.people[1][key],normal.people[1][key]);
const water=withCare('water');assert.ok(water.people[1].hydration<normal.people[1].hydration);assert.equal(water.people[1].glare,normal.people[1].glare);assert.equal(water.people[1].heat,normal.people[1].heat);assert.ok(water.people[1].production<normal.people[1].production);
const toilet=withCare('toilet');assert.equal(toilet.people[1].bathroom,false);assert.equal(toilet.people[1].bathroomVisits,1);assert.equal(toilet.people[1].active,true);assert.equal(toilet.people[1].excluded,false);assert.ok(toilet.people[1].production<normal.people[1].production);
const rest=withCare('rest');assert.equal(rest.people[1].production,0);assert.ok(rest.people[1].fatigue<start.people[1].fatigue);assert.equal(rest.people[1].active,true);
const plan=structuredClone(no);plan.requests.rui='pause';const pause=advance(start,'uniform',{interventions:plan});assert.deepEqual(pause.people[1],rest.people[1]);
let exhausted=newSession({},[100,100,100,100]);const bad=input(exhausted);bad.voice.requests.noa='continue';assert.throws(()=>submitTeam(exhausted,'e3',bad),/pausa/);
const expensive=ready(newSession(),'none','shade');assert.equal(teamCost(expensive,'relative'),4);assert.equal(executeRound(expensive,'relative',note).state.budget,4);
// Explore every coordination path for every layout and a mix of care policies.
function walk(s,policy){if(s.phase==='report'){
 completed++;assert.equal(s.reviews.length,5);assert.deepEqual(replayTeam(s.state.history,s.initialLegacy),s.state);const restored=restoreSession(JSON.parse(JSON.stringify(s)));assert.deepEqual(restored,s);restores++;const inherited=inheritSession(s);assert.deepEqual(inherited.initialLegacy,decodeLegacy(encodeLegacy(s.state)));assert.equal(inherited.config.rotation,(s.config.rotation+1)%s.config.count);assert.equal(inherited.state.budget,8);
 for(let i=0;i<5;i++)for(const o of optionsForTeams(i).filter(o=>o.id!==s.state.history[i].option)){try{const cf=replayTeam(s.state.history,s.initialLegacy,{round:i,option:o.id});assert.equal(cf.round,5);assert.ok(cf.budget>=0);comparisons++;}catch(error){assert.match(error.message,/Apoio insuficiente/);budgetFailures++;}}
 return;
 }
 const prepared=ready(s,policy);assert.ok(optionsForTeams(s.state.round).some(o=>teamCost(prepared,o.id)<=s.state.budget));
 for(const o of optionsForTeams(s.state.round)){
  if(teamCost(prepared,o.id)>s.state.budget){assert.throws(()=>executeRound(prepared,o.id,note),/Apoio insuficiente/);budgetFailures++;continue;}
  const after=executeRound(prepared,o.id,note);assert.equal(after.phase,'review');assert.deepEqual(restoreSession(JSON.parse(JSON.stringify(after))),after);restores++;
  for(const p of after.state.people)for(const k of ['reserve','heat','fatigue','hydration','glare'])assert.ok(Number.isFinite(p[k])&&p[k]>=0&&p[k]<=100);
  for(const p of prepared.state.people){if(asksPause(p)){const post=after.state.people.find(x=>x.id===p.id);assert.equal(post.production,p.production);}}
  walk(finishReview(after,note),policy);
 }
}
for(const count of [4,5,6])for(const policy of ['none','care','adjust'])walk(newSession({count}),policy);
// Repeated environment expense cannot deadlock later decisions; revise a contribution before execution.
let envRun=newSession({count:6});for(let i=0;i<5;i++){envRun=ready(envRun,'care',envRun.state.budget>=2?'shade':'current');const action=optionsForTeams(i).find(o=>teamCost(envRun,o.id)<=envRun.state.budget);envRun=finishReview(executeRound(envRun,action.id,note),note);}assert.equal(envRun.phase,'report');
let revised=ready(newSession());let data=input(revised);data.care.orders.lia.water=true;revised=submitTeam(revised,'e2',data);assert.equal(revised.draft.submitted.length,4);assert.equal(revised.draft.parts.care.orders.lia.water,true);
// Partial contributions survive refresh, including 4-sector combined inputs.
for(const count of [4,5,6]){let partial=newSession({count,students:40});partial=submitTeam(partial,'e2',input(partial,'care'));assert.deepEqual(restoreSession(JSON.parse(JSON.stringify(partial))),partial);}
console.log(JSON.stringify({teamLayouts:layouts,completeTeamSessions:completed,restoredStates:restores,feasibleCounterfactuals:comparisons,correctBudgetRejections:budgetFailures,careEffects:'distinct',pauseAndReviewGates:'passed'},null,2));
