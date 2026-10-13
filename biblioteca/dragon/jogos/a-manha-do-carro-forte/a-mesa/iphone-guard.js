(()=>{
 const guard=document.getElementById('orientationGuard');
 const guarded=new Set(['sensory','evidence','hypothesis','mosaic','final','reveal']);
 function phone(){return matchMedia('(pointer:coarse)').matches&&Math.min(screen.width,screen.height)<600}
 function active(){return document.querySelector('.screen.active')?.dataset.screen||'intro'}
 function check(){const wrong=phone()&&innerWidth>innerHeight&&guarded.has(active());guard?.classList.toggle('hidden',!wrong);document.body.classList.toggle('guard-orientation',wrong);window.dispatchEvent(new CustomEvent('MOSAICO_ORIENTATION_PAUSE',{detail:{paused:wrong}}))}
 addEventListener('resize',check,{passive:true});addEventListener('orientationchange',()=>setTimeout(check,150));document.addEventListener('visibilitychange',()=>{if(!document.hidden)check()});
 document.addEventListener('gesturestart',e=>e.preventDefault(),{passive:false});
 document.addEventListener('dblclick',e=>{if(!e.target.closest?.('button,a,input,select'))e.preventDefault()},{passive:false});
 setTimeout(check,250);
 window.MOSAICO_GUARD={checkOrientation:check};
})();