/* Golden Snitch intro — silent, staged timeline, skippable at every stage. */
(function(){'use strict';
var el=document.getElementById('clIntro'),root=document.documentElement;
if(!el||root.classList.contains('intro-seen')){if(el&&el.parentNode)el.parentNode.removeChild(el);return}
var done=false,timers=[],mq=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches,small=innerWidth<=640,k=small?.8:1;
root.classList.add('intro-on');
function stage(n){el.setAttribute('data-st',n);for(var i=1;i<=n;i++)el.classList.add('s'+i)}
function finish(){if(done)return;done=true;timers.forEach(clearTimeout);
try{localStorage.setItem('gs-intro-seen','1')}catch(e){}
root.classList.add('intro-leaving');el.classList.add('cli-out');
setTimeout(function(){root.classList.remove('intro-on','intro-leaving');root.classList.add('intro-seen');
if(el.parentNode)el.parentNode.removeChild(el);try{dispatchEvent(new Event('cl-intro-done'))}catch(e){}},mq?50:700)}
document.getElementById('gsSkip').addEventListener('click',finish);
document.getElementById('gsEnter').addEventListener('click',finish);
document.addEventListener('keydown',function(e){if(!done&&e.key==='Escape')finish()});
if(mq){el.classList.add('rm');stage(6)}
else{/* ms: sky, owl, letter, train, castle, title */
[0,2000,4800,9400,12000,14800].forEach(function(t,i){timers.push(setTimeout(function(){stage(i+1)},t*k))});
timers.push(setTimeout(function(){var b=document.getElementById('gsEnter');if(b)b.style.opacity=1},(14800+4800)*k))}
timers.push(setTimeout(finish,60000));
})();
