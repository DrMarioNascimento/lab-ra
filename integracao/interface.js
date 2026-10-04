// As abas mudam apenas a apresentação; não alteram o instante nem a reprodução.
const tabs=[...document.querySelectorAll('[role="tab"]')];
function selecionar(tab){
 for(const item of tabs){const selected=item===tab;item.setAttribute('aria-selected',String(selected));item.tabIndex=selected?0:-1;document.getElementById(item.getAttribute('aria-controls')).hidden=!selected;}
 document.dispatchEvent(new Event('studychange'));
}
for(const tab of tabs){
 tab.addEventListener('click',()=>selecionar(tab));
 tab.addEventListener('keydown',event=>{
  const index=tabs.indexOf(tab);let next;
  if(event.key==='ArrowRight')next=(index+1)%tabs.length;
  else if(event.key==='ArrowLeft')next=(index+tabs.length-1)%tabs.length;
  else if(event.key==='Home')next=0;
  else if(event.key==='End')next=tabs.length-1;
  else return;
  event.preventDefault();selecionar(tabs[next]);tabs[next].focus();
 });
}
