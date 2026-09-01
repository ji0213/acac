
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
  if(!entries || entries.length === 0){
    list.innerHTML = '';
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';
  list.innerHTML = entries.map(entry => `
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

const GB_API_URL = window.__GUESTBOOK_API_URL || '';

async function loadGuestbook(){
  if(!GB_API_URL) return;
  try{
    const res = await fetch(GB_API_URL);
    const entries = await res.json();
    renderGuestbook(entries);
  }catch(err){
    console.error('방명록을 불러오지 못했습니다:', err);
  }
}

window.submitGuestbook = async function(e){
  e.preventDefault();
  const nameInput = document.getElementById('gbName');
  const msgInput = document.getElementById('gbMessage');
  const name = escapeHtml(nameInput.value.trim());
  const message = escapeHtml(msgInput.value.trim());
  if(!name || !message) return;

  if(!GB_API_URL){
    alert('방명록 연동이 아직 설정되지 않았어요.');
    return;
  }

  const submitBtn = document.querySelector('#gbForm .rsvp-submit');
  if(submitBtn){ submitBtn.disabled = true; submitBtn.textContent = '전달 중...'; }

  try{
    await fetch(GB_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' }, 
      body: JSON.stringify({ name, message })
    });
    document.getElementById('gbForm').reset();
    setTimeout(loadGuestbook, 600);
  }catch(err){
    console.error('메시지 저장 실패:', err);
    alert('메시지 전송에 실패했어요. 잠시 후 다시 시도해주세요.');
  }finally{
    if(submitBtn){ submitBtn.disabled = false; submitBtn.textContent = '메시지 남기기'; }
  }
};

loadGuestbook();


(function(){
  const slider = document.getElementById('gallerySlider');
  const dotsWrap = document.getElementById('galleryDots');
  if(!slider || !dotsWrap) return;

  const slides = slider.querySelectorAll('.slide');
  slides.forEach((_, i) => {
    const dot = document.createElement('span');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dotsWrap.appendChild(dot);
  });
  const dots = dotsWrap.querySelectorAll('.dot');

  function updateActiveDot(){
    const slideWidth = slides[0].getBoundingClientRect().width + 10; 
    const index = Math.round(slider.scrollLeft / slideWidth);
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
  }

  let ticking = false;
  slider.addEventListener('scroll', () => {
    if(!ticking){
      requestAnimationFrame(() => { updateActiveDot(); ticking = false; });
      ticking = true;
    }
  });


  const prevBtn = document.getElementById('galleryPrev');
  const nextBtn = document.getElementById('galleryNext');
  function goTo(delta){
    const slideWidth = slides[0].getBoundingClientRect().width + 10;
    const current = Math.round(slider.scrollLeft / slideWidth);
    const target = Math.max(0, Math.min(slides.length - 1, current + delta));
    slider.scrollTo({ left: target * slideWidth, behavior:'smooth' });
  }
  if(prevBtn) prevBtn.addEventListener('click', () => goTo(-1));
  if(nextBtn) nextBtn.addEventListener('click', () => goTo(1));

  function waitForKakao(retries){
    if(window.kakao && window.kakao.map){
      initMap();
      return;
    }
    if(retries <= 0){
      showFallback();
      return;
    }
    setTimeout(() => waitForKakao(retries - 1), 300);
  }
  function initMap(){
    try{
      window.kakao.maps.load(function(){
        const address = window.__VENUE_ADDRESS || '';
        const geocoder = new kakao.maps.servers.Geocoder();
        geocoder.addressSearch(address, function(result, status){
          if(status !== kakao.maps.servers.Status.OK || !result[0]){
            showFallback();
            return;
          }
          const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
          const map = new kakao.maps.MAP(mapbox, {
            center: coords,
            level: 3
          });
          const infoWindow = new kakao.maps.InfoWindow({
            content: '<div style="padding:6px 10px; font-size: 12px; white-space:nowrap;"> ${window.__VENUE_NAME || ''} </div>'
          });
          infoWindow.open(map, new kakao.maps.marker({map, paosition: coords}));
        });
      });
    }catch(err){
      console.error('카카오맵 초기화 실패:', err);
      showFallback();
    }
  }
  waitForKakao(15);
})();