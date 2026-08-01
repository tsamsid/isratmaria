/* ============================================
   GLOBAL STATE / HELPERS
============================================ */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
gsap.registerPlugin(ScrollTrigger);

/* Smooth scroll via Lenis (falls back gracefully if unavailable) */
let lenis;
try{
  lenis = new Lenis({ duration: 1.15, smoothWheel:true, easing: (t)=>1-Math.pow(1-t,3) });
  function raf(time){ lenis.raf(time); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);
  lenis.on('scroll', ScrollTrigger.update);
}catch(e){ /* Lenis not available, native scroll used */ }

/* Cursor glow */
const cursorGlow = document.getElementById('cursor-glow');
window.addEventListener('pointermove', (e)=>{
  cursorGlow.classList.add('active');
  cursorGlow.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%,-50%)`;
});
window.addEventListener('pointerleave', ()=> cursorGlow.classList.remove('active'));

/* Fireflies */
if(!prefersReducedMotion){
  const ffContainer = document.getElementById('fireflies-container');
  for(let i=0;i<18;i++){
    const f = document.createElement('div');
    f.className='firefly';
    f.style.left = Math.random()*100+'%';
    f.style.bottom = (Math.random()*40)+'%';
    f.style.setProperty('--fx', (Math.random()*80-40)+'px');
    f.style.animationDuration = (8+Math.random()*10)+'s';
    f.style.animationDelay = (Math.random()*10)+'s';
    ffContainer.appendChild(f);
  }
}

/* Floating hearts (ambient, subtle, continuous) */
const heartsContainer = document.getElementById('hearts-container');
function spawnAmbientHeart(){
  if(prefersReducedMotion) return;
  const h = document.createElement('div');
  h.className='floating-heart';
  h.textContent = Math.random()>0.5 ? '❤️' : '💕';
  h.style.left = Math.random()*100+'%';
  h.style.setProperty('--hx', (Math.random()*60-30)+'px');
  h.style.fontSize = (12+Math.random()*14)+'px';
  h.style.animationDuration = (10+Math.random()*8)+'s';
  heartsContainer.appendChild(h);
  setTimeout(()=>h.remove(), 20000);
}
setInterval(spawnAmbientHeart, 2200);
for(let i=0;i<5;i++) setTimeout(spawnAmbientHeart, i*500);

/* Generic scroll reveal via IntersectionObserver (covers all future sections too) */
const revealObserver = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){ entry.target.classList.add('visible'); }
  });
}, { threshold: 0.18 });
function observeReveals(root=document){ root.querySelectorAll('.reveal:not(.visible)').forEach(el=>revealObserver.observe(el)); }
/* NOTE: observeReveals() is now called per-chapter by the pagination controller
   (end of document) the first time each chapter becomes active — this keeps every
   fade/slide reveal timed to when the reader actually arrives on that page instead
   of firing while it's still waiting off-screen. The old side progress-rail has
   been replaced by #story-dots + #story-nav, also wired up in that controller. */

/* ============================================
   MUSIC PLAYER
============================================ */
const bgMusic = document.getElementById('bg-music');
const musicToggle = document.getElementById('music-toggle');
const musicVolume = document.getElementById('music-volume');
let musicStarted = false;
bgMusic.volume = 0.5;
function tryStartMusic(){
  if(musicStarted) return;
  bgMusic.play().then(()=>{ musicStarted = true; musicToggle.textContent='🔊'; }).catch(()=>{ /* user gesture required elsewhere */ });
}
musicToggle.addEventListener('click', ()=>{
  if(bgMusic.paused){ bgMusic.play(); musicToggle.textContent='🔊'; musicStarted=true; }
  else { bgMusic.pause(); musicToggle.textContent='🔇'; }
});
musicVolume.addEventListener('input', ()=> bgMusic.volume = musicVolume.value);

/* ============================================
   LOADING SCREEN SEQUENCE
============================================ */
const loadingScreen = document.getElementById('loading-screen');
const loadingPercent = document.getElementById('loading-percent');
let pct = 0;
const loadInterval = setInterval(()=>{
  pct += Math.floor(Math.random()*9)+3;
  if(pct>=100){ pct=100; clearInterval(loadInterval); setTimeout(finishLoading, 500); }
  loadingPercent.textContent = pct+'%';
}, 140);

function finishLoading(){
  loadingScreen.classList.add('hidden');
  startWelcomeTyping();
}

/* ============================================
   WELCOME TYPING SEQUENCE
============================================ */
const welcomeLines = [
  "Happy Birthday, Maria! 💖",
  "Today is all about you.",
  "Every memory...",
  "Every smile...",
  "Every heartbeat...",
  "Leads to this moment."
];
const typingEl = document.getElementById('welcome-typing');

async function typeLine(text){
  return new Promise(resolve=>{
    typingEl.innerHTML = '';
    const cursor = document.createElement('span');
    cursor.className='cursor-blink';
    cursor.textContent='\u00A0';
    let i=0;
    const speed = prefersReducedMotion ? 0 : 45;
    function step(){
      typingEl.textContent = text.slice(0,i);
      typingEl.appendChild(cursor);
      i++;
      if(i<=text.length){ setTimeout(step, speed); }
      else{ setTimeout(resolve, 700); }
    }
    step();
  });
}
async function startWelcomeTyping(){
  for(const line of welcomeLines){
    await typeLine(line);
  }
}

/* Subtle 3D tilt for hero frame */
const heroFrame = document.querySelector('.hero-frame');
if(heroFrame && !prefersReducedMotion){
  heroFrame.addEventListener('mousemove', (e)=>{
    const r = heroFrame.getBoundingClientRect();
    const x = (e.clientX - r.left)/r.width - 0.5;
    const y = (e.clientY - r.top)/r.height - 0.5;
    heroFrame.style.transform = `rotateY(${x*14}deg) rotateX(${-y*14}deg)`;
  });
  heroFrame.addEventListener('mouseleave', ()=> heroFrame.style.transform = '');
}
