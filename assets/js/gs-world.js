/* GOLDEN SNITCH world layer: route environments, safe label themes, optional House Cup. Visual only; no routes/data keys changed. */
(function(){'use strict';
var D=document,R=D.documentElement;
/* 1. Environment per route (CSS hooks) */
function env(){var h=(location.hash||'#/').toLowerCase(),e='hall';
 if(/chapter-list\/phy|physics/.test(h))e='tower';else if(/chapter-list\/chem|chemistry/.test(h))e='potions';
 else if(/chapter-list\/math|higher/.test(h))e='arith';
 else if(/#\/(hub|reference|solver|shortcuts|mistakes)/.test(h))e='library';
 else if(/#\/study-space/.test(h))e='common';
 else if(/#\/play/.test(h))e='games';
 else if(/#\/lab|#\/graphs/.test(h))e='observatory';
 else if(/#\/(quiz|smart-practice|daily)/.test(h))e='exam';
 else if(/#\/(progress|analytics|leaderboard)/.test(h))e='cup';
 R.setAttribute('data-gs-env',e)}
addEventListener('hashchange',env);env();
/* 2. Exact-match label themes (nav + headings + buttons only; subjects untouched) */
var MAP={'Home':'Great Hall','Arcade':'Game Room','Simulations':'Enchanted Labs','Leaderboard':'House Cup','My Progress':'Marauder\u2019s Progress','Study Space':'Common Room','Student Hub':'Hogwarts Library','Daily & Missions':'Daily Quests','Smart Practice':'Practice Chamber','Analytics':'Oracle Insights','About':'The Founders','Hub':'Library'};
var LOCK=/^(Physics|Chemistry|Higher Mathematics)$/;
function theme(root){var els=(root||D).querySelectorAll('#nav a,#nav a *,.bottom-nav a,.bottom-nav a *,h1,h2,h3,h4,.pf-link,footer a');
 els.forEach(function(n){for(var c=n.firstChild;c;c=c.nextSibling){if(c.nodeType!==3)continue;var t=c.nodeValue.trim();
  if(!t||LOCK.test(t))continue;if(MAP[t]){c.nodeValue=c.nodeValue.replace(t,MAP[t]);n.setAttribute('data-gs-orig',t);if(!n.title)n.title=t}break}})}
var q=0,mo=new MutationObserver(function(){if(q)return;q=setTimeout(function(){q=0;theme()},120)});
function boot(){theme();mo.observe(D.body,{childList:true,subtree:true})}
/* 3. Optional House Cup (never gates anything). Points = +1 per 10 XP earned locally in small awards (quiz/game/mission),
      house points are separate from XP, never negative, and cloud-sync jumps (>300 XP) are ignored to avoid duplicates. */
var HOUSES={gryffindor:['Gryffindor','#7F0909','#D3A625'],slytherin:['Slytherin','#1A472A','#AAAAAA'],ravenclaw:['Ravenclaw','#0E1A40','#946B2D'],hufflepuff:['Hufflepuff','#ECB939','#1c1c1c']};
function H(){try{return JSON.parse(localStorage.getItem('gs-house')||'{}')}catch(e){return{}}}
function setH(o){try{localStorage.setItem('gs-house',JSON.stringify(o))}catch(e){}}
function xp(){try{return +(JSON.parse(localStorage.getItem('cl2')||'{}').xp||0)}catch(e){return 0}}
var last=xp(),os=Storage.prototype.setItem;
Storage.prototype.setItem=function(k,v){os.apply(this,arguments);if(k!=='cl2')return;var n=xp(),d=n-last;last=n;
 var h=H();if(h.house&&d>0&&d<=300){h.pts=(h.pts||0)+Math.floor(d/10);h.rem=((h.rem||0)+d%10);if(h.rem>=10){h.pts++;h.rem-=10}setH(h);paint()}};
function paint(){var h=H(),b=D.getElementById('gsHouseBtn');if(!b)return;var c=HOUSES[h.house];
 b.textContent=c?c[0]+' \u00b7 '+(h.pts||0):'Choose House';if(c){b.style.setProperty('--hc',c[2]);b.style.setProperty('--hb',c[1])}}
function panel(){var old=D.getElementById('gsHouseModal');if(old){old.remove();return}var h=H(),m=D.createElement('div');m.id='gsHouseModal';m.setAttribute('role','dialog');m.setAttribute('aria-label','House Cup');
 var html='<div class="gs-hm"><button class="gs-x" aria-label="Close">\u00d7</button><h2>House Cup</h2><p>Optional. Pick a house to collect points from quizzes, games and missions. It never locks any subject or feature.</p><div class="gs-hg">';
 Object.keys(HOUSES).forEach(function(k){var c=HOUSES[k];html+='<button data-h="'+k+'" class="'+(h.house===k?'on':'')+'" style="--hb:'+c[1]+';--hc:'+c[2]+'">'+c[0]+'</button>'});
 html+='</div><p class="gs-rule">Rules: every 10 XP you earn = 1 House point. House points are separate from XP and are stored on this device.</p>';
 if(h.house)html+='<p class="gs-pts">Your points: <b>'+(h.pts||0)+'</b></p><button class="gs-leave">Leave house</button>';
 m.innerHTML=html+'</div>';D.body.appendChild(m);
 m.addEventListener('click',function(e){var t=e.target;if(t===m||t.classList.contains('gs-x'))m.remove();
  else if(t.dataset.h){var o=H();if(o.house!==t.dataset.h){o.house=t.dataset.h;o.pts=o.pts||0}setH(o);paint();m.remove()}
  else if(t.classList.contains('gs-leave')){setH({});paint();m.remove()}});
 D.addEventListener('keydown',function f(e){if(e.key==='Escape'){m.remove();D.removeEventListener('keydown',f)}})}
function house(){if(D.getElementById('gsHouseBtn'))return;var hx=D.querySelector('header .hx');if(!hx)return;
 var b=D.createElement('button');b.id='gsHouseBtn';b.type='button';b.setAttribute('aria-label','House Cup (optional)');b.addEventListener('click',panel);hx.insertBefore(b,hx.firstChild);paint();var nv=D.getElementById('nav');if(nv&&!D.getElementById('gsHouseNav')){var a=D.createElement('a');a.id='gsHouseNav';a.className='gs-mhouse';a.href='#';a.textContent='House Cup (optional)';a.addEventListener('click',function(e){e.preventDefault();panel()});nv.appendChild(a)}}
if(D.readyState==='loading')D.addEventListener('DOMContentLoaded',function(){boot();house()});else{boot();house()}
})();
