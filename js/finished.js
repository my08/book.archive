function setSortAndRender(mode){
  sortMode=mode;
  document.getElementById('sort-date').classList.toggle('active',mode==='date');
  document.getElementById('sort-stars').classList.toggle('active',mode==='stars');
  renderFinished();
}
function renderFinished(){
  const el=document.getElementById('finished-list');
  let finished=books.filter(b=>b.finished);
  if(sortMode==='date')finished.sort((a,b)=>b.finishedAt>a.finishedAt?1:-1);
  else finished.sort((a,b)=>(b.rating||0)-(a.rating||0));
  if(!finished.length){el.innerHTML='<div class="empty">no finished books yet.</div>';return}
  el.innerHTML='';
  finished.forEach(b=>{
    const bookLogs=logs.filter(l=>l.bookId===b.id&&l.memo);
    const stars='★'.repeat(b.rating||0)+'☆'.repeat(5-(b.rating||0));
    const item=document.createElement('div');item.className='finished-item';
    item.innerHTML=`<div class="finished-header" onclick="toggleFinished(this)">
      <div class="finished-title-wrap">
        <div style="width:3px;height:18px;background:${b.color};border-radius:2px;flex-shrink:0"></div>
        <div class="finished-title">${esc(b.title)}</div>
      </div>
      <div style="display:flex;align-items:center;gap:8px">
        <div class="finished-stars">${stars}</div><div class="finished-chev">▾</div>
      </div>
    </div>
    <div class="finished-notes">
      ${bookLogs.length?bookLogs.map(l=>`<div class="note-entry"><div class="note-text">${esc(l.memo)}</div><div class="note-date">${l.date} · ${l.value} ${b.trackType==='page'?'pg':'min'}</div></div>`).join(''):'<div style="font-size:11px;color:var(--ink3)">no memos.</div>'}
      <div style="font-size:10px;color:var(--ink3);margin-top:8px">finished ${b.finishedAt||'—'}</div>
    </div>`;
    el.appendChild(item);
  });
}
function toggleFinished(header){
  const notes=header.nextElementSibling,chev=header.querySelector('.finished-chev');
  notes.classList.toggle('open');chev.classList.toggle('open');
}
