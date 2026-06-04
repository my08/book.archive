function openLog(bookId){
  currentBookId=bookId;
  const b=books.find(x=>x.id===bookId);
  document.getElementById('log-sheet-title').textContent=b.title.length>28?b.title.slice(0,26)+'…':b.title;
  document.getElementById('log-date').value=today();
  document.getElementById('log-type-label').textContent=b.trackType==='page'?'pages (from → to)':'minutes read';
  document.getElementById('log-page-row').style.display=b.trackType==='page'?'flex':'none';
  document.getElementById('log-time-row').style.display=b.trackType==='time'?'block':'none';
  ['log-from','log-to','log-minutes','log-memo'].forEach(id=>{const el=document.getElementById(id);if(el)el.value=''});
  openOverlay('overlay-log');
}
function saveLog(){
  const b=books.find(x=>x.id===currentBookId);
  let value=0;
  if(b.trackType==='page'){value=Math.max(0,(parseInt(document.getElementById('log-to').value)||0)-(parseInt(document.getElementById('log-from').value)||0));}
  else{value=parseInt(document.getElementById('log-minutes').value)||0}
  const memo=document.getElementById('log-memo').value.trim();
  const date=document.getElementById('log-date').value||today();
  logs.push({id:uid(),bookId:currentBookId,date,value,memo,type:b.trackType});
  save();closeOverlay('overlay-log');renderAll();
}
function openFinishRating(){
  currentRating=0;
  document.querySelectorAll('.star-btn').forEach(b=>{b.classList.remove('lit');b.classList.add('dim')});
  closeOverlay('overlay-log');openOverlay('overlay-rating');
}
function setStar(n){currentRating=n;document.querySelectorAll('.star-btn').forEach((b,i)=>{b.classList.toggle('lit',i<n);b.classList.toggle('dim',i>=n)})}
function finishBook(){
  const b=books.find(x=>x.id===currentBookId);
  b.finished=true;b.finishedAt=today();b.rating=currentRating;
  save();closeOverlay('overlay-rating');renderAll();showFireworks();
}

function showFireworks(){
  const el=document.getElementById('firework-overlay');el.innerHTML='';el.classList.add('show');
  const emojis=['🐣','🌸','✨','🎀','🍀','🌷','🦋','🍵','🌙','💌','🫧','🪷'];
  for(let i=0;i<18;i++){
    const s=document.createElement('span');s.className='fw-emoji';
    s.textContent=emojis[Math.floor(Math.random()*emojis.length)];
    const dx=(Math.random()-.5)*300,dy=-(Math.random()*300+60);
    s.style.cssText=`--dx:${dx}px;--dy:${dy}px;animation-delay:${Math.random()*.8}s;left:${20+Math.random()*60}%;top:55%`;
    el.appendChild(s);
  }
  setTimeout(()=>{el.classList.remove('show');el.innerHTML=''},3200);
}
