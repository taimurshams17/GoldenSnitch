/* Golden Snitch intro — silent, ~8 s: starry night -> castle -> emblem + title + tagline, then enters the site automatically.
   Skippable at every stage (button or Escape). No sound, no Enter button. */
(function(){'use strict';
var el=document.getElementById('clIntro'),root=document.documentElement;
if(!el||root.classList.contains('intro-seen')){if(el&&el.parentNode)el.parentNode.removeChild(el);return}
var done=false,timers=[],mq=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches,small=innerWidth<=640,k=small?.5:.6;
root.classList.add('intro-on');el.style.setProperty('--k',k);
function stage(n){el.setAttribute('data-st',n);for(var i=1;i<=n;i++)el.classList.add('s'+i)}
function finish(){if(done)return;done=true;timers.forEach(clearTimeout);
root.classList.add('intro-leaving');el.classList.add('cli-out');
setTimeout(function(){root.classList.remove('intro-on','intro-leaving');root.classList.add('intro-seen');
if(el.parentNode)el.parentNode.removeChild(el);try{dispatchEvent(new Event('cl-intro-done'))}catch(e){}},mq?50:700)}
var sk=document.getElementById('gsSkip');if(sk)sk.addEventListener('click',finish);
document.addEventListener('keydown',function(e){if(!done&&e.key==='Escape')finish()});
if(mq){el.classList.add('rm');stage(6);timers.push(setTimeout(finish,1600))}
else{/* ms: sky, castle, title (stages 2-4 belonged to the removed owl/letter/train scenes) */
[[0,1],[150,5],[1500,6]].forEach(function(p){timers.push(setTimeout(function(){stage(p[1])},p[0]))});
timers.push(setTimeout(finish,small?6800:7400))}
timers.push(setTimeout(finish,20000));
})();
