let books = JSON.parse(localStorage.getItem('folio_books') || '[]');
let logs  = JSON.parse(localStorage.getItem('folio_logs')  || '[]');
let currentBookId = null, currentRating = 0, sortMode = 'date', deleteTargetId = null;
let calYear = new Date().getFullYear(), calMonth = new Date().getMonth();

function save() {
  localStorage.setItem('folio_books', JSON.stringify(books));
  localStorage.setItem('folio_logs',  JSON.stringify(logs));
}
function uid()   { return Date.now().toString(36) + Math.random().toString(36).slice(2) }
function today() { return new Date().toISOString().slice(0, 10) }
function randColor() { return ['#4A7C4E','#7C4A4A','#4A6A7C','#7C6A4A','#6A4A7C','#4A7C7A'][Math.floor(Math.random()*6)] }
function esc(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') }
