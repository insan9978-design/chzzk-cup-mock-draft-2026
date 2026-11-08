const players = [
  ['인간젤리','탑'],['괴물쥐','탑'],['김뿡','탑'],['강소연','탑'],['러너','탑'],['푸린','탑'],
  ['네클릿','정글'],['랄로','정글'],['헤징','정글'],['삼식','정글'],['크캣','정글'],['꼴랑이','정글'],
  ['큐베','미드'],['엠비션','미드'],['플레임','미드'],['피닉스박','미드'],['뱅','미드'],['소우릎','미드'],
  ['순당무','원딜'],['눈꽃','원딜'],['명훈','원딜'],['실프','원딜'],['따효니','원딜'],['정령왕','원딜'],
  ['던','서폿'],['니니아','서폿'],['채현찌','서폿'],['승빠','서폿'],['한동숙','서폿'],['윤가놈','서폿'],
];
const captains = ['큐베','엠비션','플레임','피닉스박','뱅','소우릎'];
const draftPool = players.filter(([name])=>!captains.includes(name));
let order = [], picks = [], filter = '전체';
const roles = ['전체','탑','정글','미드','원딜','서폿'];
const $ = (id) => document.getElementById(id);
function renderSetup(){
 const chosen=new Set(order);
 $('startButton').disabled=order.length!==captains.length;
 $('captainOrder').innerHTML=`<div class="captain-picker-label">팀장을 순서대로 선택 <span>${order.length} / 6</span></div><div class="captain-picker">${captains.map(name=>`<button class="captain-choice ${chosen.has(name)?'chosen':''}" data-captain="${name}" ${chosen.has(name)?'disabled':''}><span class="role-chip role-미드">MID</span><strong>${name}</strong><span class="add-mark">${chosen.has(name)?'✓':'+'}</span></button>`).join('')}</div><div class="order-slots-label">드래프트 순서 <span>칸을 누르면 해당 선택을 취소합니다</span></div><div class="order-slots">${Array.from({length:6},(_,i)=>`<button class="order-slot ${order[i]?'filled':''}" data-remove="${i}"><span class="slot-number">${i+1}</span><span class="slot-captain">${order[i]||'선택 대기'}</span>${order[i]?'<span class="remove-mark">×</span>':''}</button>`).join('')}</div>`;
}
function teamIndexForPick(n){const round=Math.floor(n/6),slot=n%6;return round%2===0?slot:5-slot}
function assigned(){return new Set(picks.map(p=>p.name))}
function renderFilters(){ $('filterBar').innerHTML=roles.map(r=>`<button class="filter-button ${filter===r?'active':''}" data-filter="${r}">${r}</button>`).join(''); }
function renderDraft(){
 const done=picks.length>=24, current=done?-1:teamIndexForPick(picks.length);
 $('turnSummary').textContent=done?'드래프트 완료':`현재 선택 · ${order[current]} 팀 · ${Math.floor(picks.length/6)+1}라운드 ${picks.length%6+1}픽`;
 $('progressText').textContent=`${picks.length} / 24명 선택`;
 $('undoButton').disabled=!picks.length;
 $('playerGrid').innerHTML=draftPool.filter(([name,role])=>(filter==='전체'||filter===role)).map(([name,role])=>{const owner=picks.find(p=>p.name===name);const roleFilled=!done&&picks.some(p=>p.team===order[current]&&p.role===role);const unavailable=Boolean(owner)||done||roleFilled;return `<button class="player-card ${roleFilled&&!owner?'role-filled':''}" data-player="${name}" ${unavailable?'disabled':''} ${roleFilled&&!owner?'title="현재 팀은 이 포지션을 이미 선택했습니다"':''}><span class="role-chip role-${role}">${role}</span><span class="player-name">${name}</span>${owner?`<span class="owner-tag">${owner.team}</span>`:''}</button>`}).join('');
 $('teamGrid').innerHTML=order.map((team,i)=>`<article class="team-card ${i===current?'current':''}"><div class="team-title"><span class="team-order">${String(i+1).padStart(2,'0')}</span>${team}</div>${['탑','정글','미드','원딜','서폿'].map(role=>{const pick=role==='미드'?{name:team}:picks.find(p=>p.team===team&&p.role===role);return `<div class="slot"><span class="slot-label">${role}</span><span class="${pick?'slot-name':'slot-empty'}">${pick?pick.name:'—'}</span></div>`}).join('')}</article>`).join('');
}
$('captainOrder').addEventListener('click',e=>{const captain=e.target.closest('[data-captain]');if(captain){if(order.length<6&&!order.includes(captain.dataset.captain))order.push(captain.dataset.captain);renderSetup();return}const slot=e.target.closest('[data-remove]');if(slot&&order[Number(slot.dataset.remove)]){order.splice(Number(slot.dataset.remove),1);renderSetup()}});
$('startButton').addEventListener('click',()=>{$('setup').hidden=true;$('draft').hidden=false;renderFilters();renderDraft();window.scrollTo({top:0,behavior:'smooth'})});
$('filterBar').addEventListener('click',e=>{const b=e.target.closest('[data-filter]');if(!b)return;filter=b.dataset.filter;renderFilters();renderDraft()});
$('playerGrid').addEventListener('click',e=>{const b=e.target.closest('[data-player]');if(!b||b.disabled)return;const [name,role]=draftPool.find(p=>p[0]===b.dataset.player);picks.push({name,role,team:order[teamIndexForPick(picks.length)]});renderDraft()});
$('undoButton').addEventListener('click',()=>{picks.pop();renderDraft()});
$('resetButton').addEventListener('click',()=>{order=[];picks=[];filter='전체';$('setup').hidden=false;$('draft').hidden=true;renderSetup();window.scrollTo({top:0,behavior:'smooth'})});
renderSetup();

