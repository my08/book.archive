function hexToRgb(hex) {
  hex = hex.replace('#','');
  if (hex.length===3) hex=hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
  return [parseInt(hex.slice(0,2),16),parseInt(hex.slice(2,4),16),parseInt(hex.slice(4,6),16)];
}
function cellColor(dayLogs) {
  const bv={};
  dayLogs.forEach(l=>{bv[l.bookId]=(bv[l.bookId]||0)+l.value});
  const total=Object.values(bv).reduce((a,b)=>a+b,0);
  if(!total)return null;
  let rr=0,gg=0,bb=0;
  Object.entries(bv).forEach(([id,w])=>{
    const bk=books.find(x=>x.id===id);
    const [r,g,b]=hexToRgb(bk?bk.color:'#4A7C4E');
    rr+=r*(w/total);gg+=g*(w/total);bb+=b*(w/total);
  });
  const t=total<15?.18:total<40?.38:total<70?.58:total<120?.78:.95;
  const bg=[226,221,208];
  const fr=Math.round(bg[0]+(rr-bg[0])*t);
  const fg=Math.round(bg[1]+(gg-bg[1])*t);
  const fb=Math.round(bg[2]+(bb-bg[2])*t);
  if(t>.7){const ex=(t-.7)/.3,dk=[44,74,46];return`rgb(${Math.round(fr+(dk[0]-fr)*ex*.4)},${Math.round(fg+(dk[1]-fg)*ex*.4)},${Math.round(fb+(dk[2]-fb)*ex*.4)})`}
  return`rgb(${fr},${fg},${fb})`;
}

function drawPie(canvas, segments) {
  const ctx=canvas.getContext('2d'),size=canvas.width,cx=size/2,cy=size/2,r=size/2-1;
  ctx.clearRect(0,0,size,size);
  const total=segments.reduce((a,s)=>a+s.value,0);
  if(!total)return;
  let angle=-Math.PI/2;
  segments.forEach(s=>{
    const sweep=(s.value/total)*Math.PI*2;
    ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,r,angle,angle+sweep);ctx.closePath();
    ctx.fillStyle=s.color;ctx.fill();angle+=sweep;
  });
  ctx.beginPath();ctx.arc(cx,cy,r*.46,0,Math.PI*2);ctx.fillStyle='#F5F0E8';ctx.fill();
}

function buildGrass() {
  const grid=document.getElementById('grass-grid'),monthsEl=document.getElementById('grass-months');
  grid.innerHTML='';monthsEl.innerHTML='';
  const now=new Date();
  document.getElementById('grass-year').textContent=now.getFullYear();
  const wrap=document.querySelector('.grass-wrap');
  const availW=wrap.clientWidth-16;
  const cols=Math.max(14,Math.floor(availW/12));
  const cellSz=Math.floor((availW-(cols-1)*2)/cols);
  grid.style.gridTemplateColumns=`repeat(${cols},${cellSz}px)`;
  monthsEl.style.gridTemplateColumns=`repeat(${cols},${cellSz}px)`;
  const totalDays=cols*7;
  const startDate=new Date(now);startDate.setDate(startDate.getDate()-totalDays+1);
  for(let col=0;col<cols;col++){
    const span=document.createElement('span');
    span.style.cssText='font-size:8px;color:var(--ink3);display:block;text-align:center;overflow:hidden';
    const d=new Date(startDate);d.setDate(startDate.getDate()+col*7);
    const p=new Date(startDate);p.setDate(startDate.getDate()+(col-1)*7);
    const mo=d.toLocaleString('en',{month:'short'}),pm=p.toLocaleString('en',{month:'short'});
    if(col===0||mo!==pm)span.textContent=mo.toUpperCase();
    monthsEl.appendChild(span);
  }
  for(let i=0;i<totalDays;i++){
    const d=new Date(startDate);d.setDate(startDate.getDate()+i);
    const ds=d.toISOString().slice(0,10);
    const dayLogs=logs.filter(l=>l.date===ds);
    const total=dayLogs.reduce((a,l)=>a+(l.value||0),0);
    const color=cellColor(dayLogs);
    const cell=document.createElement('div');
    cell.className='grass-cell';cell.style.width=cellSz+'px';cell.style.height=cellSz+'px';
    if(color)cell.style.background=color;
    cell.addEventListener('click',e=>{e.stopPropagation();handleCellClick(e,ds,dayLogs,total)});
    grid.appendChild(cell);
  }
}

function handleCellClick(e,ds,dayLogs,total){
  closeDayPopup();if(!total)return;
  const popup=document.getElementById('day-popup');
  const d=new Date(ds+'T00:00:00');
  document.getElementById('day-popup-date').textContent=d.toLocaleDateString('en',{month:'long',day:'numeric',year:'numeric'});
  const bv={};
  dayLogs.forEach(l=>{
    if(!bv[l.bookId])bv[l.bookId]={value:0,memos:[]};
    bv[l.bookId].value+=l.value;if(l.memo)bv[l.bookId].memos.push(l.memo);
  });
  const entries=Object.entries(bv).map(([bid,data])=>({book:books.find(x=>x.id===bid),value:data.value,memos:data.memos})).filter(e=>e.book);
  const content=document.getElementById('day-popup-content');content.innerHTML='';
  const pieWrap=document.createElement('div');pieWrap.className='pie-wrap';
  const canvas=document.createElement('canvas');canvas.width=60;canvas.height=60;canvas.style.cssText='width:60px;height:60px;flex-shrink:0';
  pieWrap.appendChild(canvas);
  const legend=document.createElement('div');legend.className='pie-legend';
  entries.forEach(en=>{
    const pct=Math.round((en.value/total)*100);
    const row=document.createElement('div');row.className='pie-legend-item';
    row.innerHTML=`<div class="pie-dot" style="background:${en.book.color}"></div><div style="min-width:0"><div style="font-weight:500;color:var(--ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:130px">${esc(en.book.title)}</div><div style="color:var(--ink3)">${en.value} ${en.book.trackType==='page'?'pg':'min'} · ${pct}%</div></div>`;
    legend.appendChild(row);
  });
  pieWrap.appendChild(legend);content.appendChild(pieWrap);
  entries.forEach(en=>{
    if(en.memos.length){const m=document.createElement('div');m.style.cssText='font-size:10px;color:var(--ink2);margin-top:4px;padding-top:5px;border-top:1px dashed var(--border);line-height:1.5';m.textContent=en.memos[0];content.appendChild(m);}
  });
  setTimeout(()=>drawPie(canvas,entries.map(en=>({color:en.book.color,value:en.value}))),0);
  const r=e.target.getBoundingClientRect();
  popup.style.left=Math.min(r.left,window.innerWidth-250)+'px';
  popup.style.top=(r.top-8)+'px';popup.style.transform='translateY(-100%)';
  popup.classList.add('show');
}
function closeDayPopup(){document.getElementById('day-popup').classList.remove('show')}
document.addEventListener('click',()=>closeDayPopup());
