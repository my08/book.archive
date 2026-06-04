function showScreen(name){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));
  document.getElementById('screen-'+name).classList.add('active');
  document.getElementById('nav-'+name).classList.add('active');
  if(name==='reading')renderAll();
  if(name==='calendar')renderCalendar();
  if(name==='finished')renderFinished();
}

function openOverlay(id){document.getElementById(id).classList.add('open')}
function closeOverlay(id){document.getElementById(id).classList.remove('open')}
document.querySelectorAll('.overlay').forEach(o=>o.addEventListener('click',e=>{if(e.target===o)o.classList.remove('open')}));

let rt;
window.addEventListener('resize',()=>{clearTimeout(rt);rt=setTimeout(()=>{if(document.getElementById('screen-reading').classList.contains('active'))buildGrass()},100)});

renderAll();
