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
