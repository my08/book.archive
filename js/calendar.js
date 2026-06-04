function fitCalendar(){
  const screen=document.getElementById('screen-calendar');
  if(!screen.classList.contains('active'))return;
  const dow=screen.querySelector('.cal-dow');
  const days=document.getElementById('cal-days');
  const nav=document.querySelector('.nav');
  const available=nav.getBoundingClientRect().top-dow.getBoundingClientRect().bottom-8;
  days.style.height=Math.max(available,200)+'px';
}

function renderCalendar(){
  const label=document.getElementById('cal-month-label');
  const daysEl=document.getElementById('cal-days');
  const d=new Date(calYear,calMonth,1);
  label.textContent=d.toLocaleString('en',{month:'long',year:'numeric'});
  daysEl.innerHTML='';
  const firstDow=d.getDay();
  const daysInMonth=new Date(calYear,calMonth+1,0).getDate();
  const todayStr=today();

  for(let i=0;i<firstDow;i++){
    const blank=document.createElement('div');blank.className='cal-day other-month';daysEl.appendChild(blank);
  }

  for(let day=1;day<=daysInMonth;day++){
    const ds=`${calYear}-${String(calMonth+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
    const cell=document.createElement('div');
    cell.className='cal-day'+(ds===todayStr?' today':'');
    const num=document.createElement('div');num.className='cal-day-num';num.textContent=day;
    cell.appendChild(num);

    const dayLogs=logs.filter(l=>l.date===ds);
    const bookIds=[...new Set(dayLogs.map(l=>l.bookId))];
    if(bookIds.length){
      const covers=document.createElement('div');covers.className='cal-covers';
      bookIds.forEach(bid=>{
        const b=books.find(x=>x.id===bid);if(!b)return;
        if(b.coverUrl){
          const img=document.createElement('img');
          img.className='cal-cover';img.src=b.coverUrl;img.alt=b.title;
          img.onerror=()=>{img.replaceWith(makeDot(b.color))};
          covers.appendChild(img);
        } else {
          covers.appendChild(makeDot(b.color));
        }
      });
      cell.appendChild(covers);
    }
    daysEl.appendChild(cell);
  }
  fitCalendar();
}
function makeDot(color){
  const d=document.createElement('div');d.className='cal-cover-dot';d.style.background=color;return d;
}

function calPrev(){calMonth--;if(calMonth<0){calMonth=11;calYear--}renderCalendar()}
function calNext(){calMonth++;if(calMonth>11){calMonth=0;calYear++}renderCalendar()}

let calTouchX=0;
document.getElementById('cal-days').parentElement.addEventListener('touchstart',e=>{calTouchX=e.touches[0].clientX},{passive:true});
document.getElementById('cal-days').parentElement.addEventListener('touchend',e=>{
  const dx=e.changedTouches[0].clientX-calTouchX;
  if(Math.abs(dx)>50){dx<0?calNext():calPrev();}
});
document.getElementById('cal-prev').onclick=calPrev;
document.getElementById('cal-next').onclick=calNext;
