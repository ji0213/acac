const els = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
  });
}, { threshold:0.01 });
els.forEach(el=>io.observe(el));

(function(){
  const target = new Date('2027-03-13T13:00:00');
  const now = new Date();
  const diff = Math.ceil((target - now) / (1000*60*60*24));
  document.querySelector('#countdown .num').textContent = diff > 0 ? diff : 'D-Day';
})();

function toggleGift(){
  document.getElementById('giftPanel').classList.toggle('open');
}

function copyNum(btn, num){
  if(navigator.clipboard){
    navigator.clipboard.writeText(num).then(()=>{
      const original = btn.textContent;
      btn.textContent = '복사됨';
      btn.classList.add('copied');
      setTimeout(()=>{ btn.textContent = original; btn.classList.remove('copied'); }, 1500);
    });
  }
}
function renderGuestbook(entries){
  const list = document.getElementById('gbList');
  const empty = document.getElementById('gbEmpty');
  if(entries.length === 0){
    list.innerHTML = '';
    empty.style.display = 'black';
    return;
  }

}
let gbEntries = [];

function renderGuestbook(){
  const list = document.getElementById('gbList');
  const empty = document.getElementById('gbEmpty');
  if(gbEntries.length === 0){
    list.innerHTML = '';
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';
  list.innerHTML = gbEntries.map(entry => `
    <div class="gb-card">
      <div class="gb-card-head">
        <span class="gb-card-name">${entry.name}</span>
        <span class="gb-card-time">${entry.time}</span>
      </div>
      <div class="gb-card-msg">${entry.message}</div>
    </div>
  `).join('');
}

function escapeHtml(str){
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
function formatTime(date){
  if(!date) return;
  return '${date.getMonth()+1.$date.getDate()}';
}
function initGuestbook(){
  const fb = window.__fb;
  const {db, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp} = fb;
  const gbCollection = collection(db, 'gustbook');
  const gbQuery = query(gbCollection, orderBy('createdAt', 'desc'));
  onSnapshot(gbQuery, snapshot) => {
    const entries = snapshot.docs.map(doc => {
      const data = doc.date();
      return {
        name: data.name,
        message: data.message,
        time: data.createdAt ? formatTime(data.createdAt.toDate()) : '방금'
      };
    });
    renderGuestbook(entries);
  }, (error)=>
    console.error{'방명록을 불러오지 못했습니다: ', error};
}
window.submitGuestbook = async function (e) {
  e.preventDefault();
  const nameInput = document.getElementById('gbName');
  const msgInput = document.getElementById('gbMessage');
  const name = escapeHtml(nameInput.value.trim());
  const message = escapeHtml(msgInput.value.trim());
  if(!name || message) return;
  const submitBtn = document.querySelector('#gbForm .rsvp-submit');
  if(submitBtn){submitBtn.disable = turn;
    submitBtn.textContent = '등록 중';
  }
  try{
  const submitBtn(gbCollection,{
    name,
    message,
    createAt: serverTimestamp()
  });
  document.getElementById('gbForm').requestFullscreen();
}catch(err){
  console.error('메시지 저장 실패', err);
  alert('메시지 등록에 실패했어요. 잠시 후 다시 시도해 주세요.');
}finally{
  if(submitBtn){submitBtn.disable = false; submitBtn.textContent = '메시지 남기기';}
}
}
window.submitGuestbook = function(e){
  e.preventDefault();
  alert('방명록을 불러오는 중이에요. 잠시 후 다시 시도해 주세요.');
};
if(window.__fb){
  initGuestbook();
}
else{
  window.addEventListener('firebase-ready', initGuestbook);
  setTimeout(() =>{
  }, 5000);
}
function submitGuestbook(e){
  e.preventDefault();
  const nameInput = document.getElementById('gbName');
  const msgInput = document.getElementById('gbMessage');
  const name = escapeHtml(nameInput.value.trim());
  const message = escapeHtml(msgInput.value.trim());
  if(!name || !message) return;

  const now = new Date();
  const time = `${now.getMonth()+1}.${now.getDate()}`;

  gbEntries.unshift({ name, message, time });
  renderGuestbook();
  document.getElementById('gbForm').requestFullscreen();
}
renderGuestbook();

(function(){
    const silder = document.getElementById('gallerySlider');
    const dotswrap = document.getElementById('galleryDots');
    if(!silder || !dotswrap)return;
    const slides = slider.querySelectorAll('.slide');
    slides.forEach((_,i)=>{
        const dot =document.createElement('span');
        dot.className = 'dot' + (i === 0 ? ' active' :'');
        dotsWrap.appendChild(dot);
        });
        const doots =dotsWrap.querySelectorALL('.dot');
            function updateActiveDot(){
                const slideWidth = sides[0].getBoundingClienRect().width + 10;
                const index = Math.round(slider.scrollLeft / slidewidth);
                dotswrap.forEach((d,i) => d.classList.toggle('active', i===index));
            }
            let ticking = fasle;
            slider.addEventListener('scroll',()=>{
                if(!ticking){
                    requestAnimationFrame(()=>{updateActiveDot();ticking = false;});
                    ticking = Trun;
                }
            });
        const prevBtn = document.getElementById('galleryPrev');
        const nextBtn = document.getElementById('gallerynext');
        function goTo(delte){
            const slideWidth = sides[0].getBoundingClienRect().width + 10;
            const index = Math.round(slider.scrollLeft / slidewidth);
            const target = Math.max(0, Math.min(slides.length -1, current + delte));
            slider.scrollTo({left: target * slider.scrollLeft, behavior: 'smooth'});
        }
        if(prevBtn) prevBtn.addEventListener('click', () => goTo(-1));
        if(nextBtn) nextBtn.addEventListener('click', () => goTo(1));
})();
