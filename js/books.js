let foundCoverUrl='';
let coverSearchTimer=null;

function onBookTitleInput(){
  const title=document.getElementById('new-book-title').value.trim();
  const img=document.getElementById('cover-img');
  const ph=document.getElementById('cover-placeholder-el');
  clearTimeout(coverSearchTimer);
  foundCoverUrl='';
  if(!title){img.style.display='none';ph.textContent='?';ph.style.display='';return}
  ph.textContent='...';img.style.display='none';ph.style.display='';
  coverSearchTimer=setTimeout(()=>searchCover(title),600);
}

async function searchCover(title){
  const img=document.getElementById('cover-img');
  const ph=document.getElementById('cover-placeholder-el');
  const show=(url)=>{foundCoverUrl=url;img.src=url;img.style.display='block';ph.style.display='none'};
  const fail=()=>{foundCoverUrl='';img.style.display='none';ph.textContent='?';ph.style.display=''};
  try{
    const res=await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(title)}&maxResults=3`);
    const data=await res.json();
    const item=data.items?.[0];
    const links=item?.volumeInfo?.imageLinks;
    const thumb=links?.thumbnail||links?.smallThumbnail;
    if(thumb){show(thumb.replace('http://','https://'));return}
  }catch{}
  try{
    const res2=await fetch(`https://openlibrary.org/search.json?title=${encodeURIComponent(title)}&limit=1&fields=cover_i`);
    const data2=await res2.json();
    const coverId=data2.docs?.[0]?.cover_i;
    if(coverId){show(`https://covers.openlibrary.org/b/id/${coverId}-M.jpg`);return}
  }catch{}
  fail();
}

function renderAll(){
  buildGrass();
  const el=document.getElementById('book-list');
  const reading=books.filter(b=>!b.finished);
  if(!reading.length){el.innerHTML='<div class="empty">no books yet.<br>tap + to add one.</div>';return}
  el.innerHTML='';
  reading.forEach(b=>{
    const bookLogs=logs.filter(l=>l.bookId===b.id).sort((a,z)=>z.date.localeCompare(a.date));
    const total=bookLogs.reduce((a,l)=>a+(l.value||0),0);

    const wrap=document.createElement('div');wrap.className='swipe-wrap';

    const delBg=document.createElement('div');delBg.className='swipe-del-bg';
    delBg.innerHTML=`<svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>`;
    delBg.onclick=()=>askDelete(b.id);
    wrap.appendChild(delBg);

    const item=document.createElement('div');item.className='book-item';
    item.innerHTML=`
      <div class="book-color-wrap" style="background:${b.color}22">
        <div class="book-color-bar" style="background:${b.color}"></div>
        <input type="color" value="${b.color}" onchange="changeBookColor('${b.id}',this.value)">
      </div>
      ${b.coverUrl?`<img class="book-cover-thumb" src="${esc(b.coverUrl)}" alt="" onerror="this.style.display='none'">` :''}
      <div class="book-main">
        <div class="book-title-row">
          <div class="book-title">${esc(b.title)}</div>
          <div class="book-total">${total} ${b.trackType==='page'?'pg':'min'}</div>
        </div>
        <div class="book-log-list" id="loglist-${b.id}">
          ${bookLogs.length ? bookLogs.map(l=>`
            <div class="book-log-entry">
              ${l.memo?esc(l.memo)+' ':''}
              <span>(${l.date}${l.value?', '+l.value+(b.trackType==='page'?' pg':' min'):''})</span>
            </div>`).join('') : '<div class="book-log-entry" style="color:var(--ink3)">no logs yet.</div>'}
        </div>
      </div>
      <button class="book-log-btn" onclick="openLog('${b.id}')" aria-label="log">
        <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      </button>`;

    item.querySelector('.book-main').addEventListener('click',()=>{
      item.querySelector('.book-log-list').classList.toggle('open');
    });

    setupSwipe(item, wrap);
    wrap.appendChild(item);
    el.appendChild(wrap);
  });
}

function setupSwipe(item, wrap) {
  let startX=0, startY=0, isDragging=false, isHorizontal=null;
  item.addEventListener('touchstart',e=>{
    startX=e.touches[0].clientX;startY=e.touches[0].clientY;isDragging=true;isHorizontal=null;
  },{passive:true});
  item.addEventListener('touchmove',e=>{
    if(!isDragging)return;
    const dx=e.touches[0].clientX-startX;
    const dy=e.touches[0].clientY-startY;
    if(isHorizontal===null){isHorizontal=Math.abs(dx)>Math.abs(dy)}
    if(!isHorizontal)return;
    e.preventDefault();
    const clamped=Math.max(-70,Math.min(0,dx+(item.classList.contains('swiped')?-70:0)));
    item.style.transition='none';item.style.transform=`translateX(${clamped}px)`;
  },{passive:false});
  item.addEventListener('touchend',e=>{
    if(!isHorizontal){isDragging=false;return}
    const dx=e.changedTouches[0].clientX-startX;
    item.style.transition='transform .25s ease';
    if(dx<-30){item.classList.add('swiped');item.style.transform=''}
    else{item.classList.remove('swiped');item.style.transform=''}
    isDragging=false;
  });
}

function openAddBook(){
  document.getElementById('new-book-title').value='';
  foundCoverUrl='';
  clearTimeout(coverSearchTimer);
  const img=document.getElementById('cover-img');
  const ph=document.getElementById('cover-placeholder-el');
  img.style.display='none';img.src='';
  ph.textContent='?';ph.style.display='';
  document.getElementById('cover-url-group').style.display='none';
  document.getElementById('cover-url-input').value='';
  const c=randColor();
  document.getElementById('book-color-input').value=c;
  document.getElementById('color-swatch-wrap').style.background=c;
  document.querySelector('input[name="track-type"][value="page"]').checked=true;
  openOverlay('overlay-add');
}
function toggleCoverUrl(){
  const g=document.getElementById('cover-url-group');
  g.style.display=g.style.display==='none'?'':'none';
  if(g.style.display!=='none')document.getElementById('cover-url-input').focus();
}
function onCoverUrlInput(){
  const url=document.getElementById('cover-url-input').value.trim();
  const img=document.getElementById('cover-img');
  const ph=document.getElementById('cover-placeholder-el');
  if(url){foundCoverUrl=url;img.src=url;img.style.display='block';ph.style.display='none';}
  else{foundCoverUrl='';img.style.display='none';ph.textContent='?';ph.style.display='';}
}
function updateSwatch(){document.getElementById('color-swatch-wrap').style.background=document.getElementById('book-color-input').value}
function addBook(){
  const title=document.getElementById('new-book-title').value.trim();if(!title)return;
  const color=document.getElementById('book-color-input').value||randColor();
  const trackType=document.querySelector('input[name="track-type"]:checked').value;
  books.push({id:uid(),title,color,trackType,coverUrl:foundCoverUrl,finished:false,addedAt:today()});
  save();closeOverlay('overlay-add');renderAll();
}

function changeBookColor(bookId, color){
  const b=books.find(x=>x.id===bookId);if(!b)return;
  b.color=color;save();renderAll();
}

function askDelete(bookId){
  deleteTargetId=bookId;
  const b=books.find(x=>x.id===bookId);
  document.getElementById('confirm-sub').textContent=`"${b.title}" and all its logs will be removed.`;
  openOverlay('overlay-confirm');
}
function confirmDelete(){
  books=books.filter(b=>b.id!==deleteTargetId);
  logs=logs.filter(l=>l.bookId!==deleteTargetId);
  save();closeOverlay('overlay-confirm');renderAll();
}
