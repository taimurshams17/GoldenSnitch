/* Golden Snitch v115 — replays the draw-on animation of Graph Tab card previews whenever a card scrolls into view.
   Only touches the small .graph-thumb previews; the interactive graph page, controls and maths are not involved. */
(function(){'use strict';
var reduce=false;try{reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;}catch(e){}
if(reduce||!('IntersectionObserver' in window))return;
var io=new IntersectionObserver(function(entries){entries.forEach(function(e){var t=e.target;
 if(e.isIntersecting){if(!t.classList.contains('gp-draw'))requestAnimationFrame(function(){t.classList.add('gp-draw');});}
 else t.classList.remove('gp-draw');});},{threshold:.35,rootMargin:'0px 0px -6% 0px'});
function scan(){var nodes=document.querySelectorAll('.graph-thumb:not([data-gp])');
 for(var i=0;i<nodes.length;i++){var t=nodes[i],card=t.closest('.graph-card'),idx=0;t.setAttribute('data-gp','1');
  if(card&&card.parentNode){idx=Array.prototype.indexOf.call(card.parentNode.children,card);}
  t.classList.add('gp-arm');io.observe(t);}}
var pending=false;function queue(){if(pending)return;pending=true;requestAnimationFrame(function(){pending=false;scan();});}
function start(){scan();var root=document.getElementById('app')||document.body;
 new MutationObserver(queue).observe(root,{childList:true,subtree:true});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
