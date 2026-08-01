/* ============================================
   PART 3a — 22 REASONS
============================================ */
const reasons = [
  "Because you taught me what true love really means.",
  "Because you taught me the reality of life and helped me become stronger.",
  "Because you inspired me to work hard instead of just dreaming.",
  "Because you believed in me even when I doubted myself.",
  "Because your smile could instantly make all my worries disappear.",
  "Because every phone call from you became the best part of my day.",
  "Because our little restaurant dates became my favorite memories.",
  "Because every bike ride felt like an unforgettable adventure with you.",
  "Because you trusted me enough to travel outside Dhaka for the first time with me.",
  "Because every walk while holding your hand felt like home.",
  "Because our coaching days turned into the most beautiful love story.",
  "Because you stood by me during both my happiest and hardest moments.",
  "Because you accepted my imperfections instead of trying to change me.",
  "Because every little fight ended with an even bigger smile.",
  "Because you made ordinary moments feel extraordinary.",
  "Because you always encouraged me to become a better version of myself.",
  "Because your happiness always mattered more to me than my own.",
  "Because every sunset looked more beautiful when you were beside me.",
  "Because you gave me memories that I'll carry for the rest of my life.",
  "Because even today, every beautiful place reminds me of you.",
  "Because no matter where life takes us, you'll always be one of the most beautiful chapters of my story.",
  "Because you didn't just become the love of my life—you became the reason I learned how to love, how to grow, and how to become the person I am today. ❤️"
];
const reasonsGrid = document.getElementById('reasons-grid');
reasons.forEach((text, i)=>{
  const card = document.createElement('div');
  card.className = 'reason-card reveal' + (i === reasons.length-1 ? ' final-reason' : '');
  card.style.setProperty('--i', i % 8);
  card.innerHTML = `<span class="heart-pulse">💗</span><span class="reason-num">${String(i+1).padStart(2,'0')}</span><p class="reason-text">${text}</p>`;
  reasonsGrid.appendChild(card);
});

/* Subtle 3D tilt on reason cards (desktop) */
if(!prefersReducedMotion){
  document.querySelectorAll('.reason-card').forEach(card=>{
    card.addEventListener('mousemove', (e)=>{
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left)/r.width - 0.5;
      const y = (e.clientY - r.top)/r.height - 0.5;
      card.style.transform = `perspective(600px) rotateY(${x*8}deg) rotateX(${-y*8}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', ()=> card.style.transform = '');
  });
}

/* Heart explosion + confetti when the final reason card comes into view.
   Checked on scroll within the Reasons chapter (and once on chapter-enter via
   the pagination controller) rather than a page-wide IntersectionObserver, so it
   can't fire before the reader has actually reached this chapter. */
let reasonsFinaleFired = false;
const finalReasonCard = document.querySelector('.reason-card.final-reason');
function checkReasonsFinale(){
  if(!finalReasonCard || reasonsFinaleFired) return;
  const r = finalReasonCard.getBoundingClientRect();
  if(r.top < window.innerHeight * 0.88){
    reasonsFinaleFired = true;
    fireHeartConfetti();
  }
}
const reasonsPageEl = document.getElementById('reasons');
if(reasonsPageEl) reasonsPageEl.addEventListener('scroll', checkReasonsFinale);
function fireHeartConfetti(){
  if(typeof confetti !== 'function') return;
  const heartShape = confetti.shapeFromText ? confetti.shapeFromText({ text: '❤️', scalar: 3 }) : undefined;
  const defaults = { spread: 70, ticks: 100, gravity: 0.6, decay: 0.94, startVelocity: 22 };
  confetti({ ...defaults, particleCount: 40, origin: { x: 0.5, y: 0.5 }, shapes: heartShape ? [heartShape] : undefined, colors: ['#c9737d','#d4af37','#f0d78a'] });
  setTimeout(()=> confetti({ ...defaults, particleCount: 60, spread:100, origin:{x:0.5,y:0.6} }), 250);
}

/* ============================================
   PART 3b — SCRATCH CARD
============================================ */
const scratchCanvas = document.getElementById('scratch-canvas');
const scratchWrap = document.querySelector('.scratch-wrap');
const scratchMessage = document.getElementById('scratch-message');
const scratchHint = document.getElementById('scratch-hint');
const sctx = scratchCanvas.getContext('2d');
let scratchRevealed = false;

function sizeScratchCanvas(){
  const rect = scratchMessage.getBoundingClientRect();
  scratchCanvas.width = rect.width;
  scratchCanvas.height = rect.height;
  drawScratchSurface();
}
function drawScratchSurface(){
  const w = scratchCanvas.width, h = scratchCanvas.height;
  const grad = sctx.createLinearGradient(0,0,w,h);
  grad.addColorStop(0,'#d9d9e0');
  grad.addColorStop(0.25,'#f4f4f8');
  grad.addColorStop(0.5,'#bfc0c8');
  grad.addColorStop(0.75,'#eef0f4');
  grad.addColorStop(1,'#c7c8d0');
  sctx.globalCompositeOperation = 'source-over';
  sctx.fillStyle = grad;
  sctx.fillRect(0,0,w,h);
  sctx.fillStyle = 'rgba(120,80,160,0.85)';
  sctx.font = `600 ${Math.max(16, w*0.055)}px 'Playfair Display', serif`;
  sctx.textAlign = 'center';
  sctx.textBaseline = 'middle';
  sctx.fillText('Scratch to reveal ✨', w/2, h/2);
}
sizeScratchCanvas();
window.addEventListener('resize', ()=>{ if(!scratchRevealed) sizeScratchCanvas(); });
window.addEventListener('orientationchange', ()=>{ if(!scratchRevealed) setTimeout(sizeScratchCanvas, 150); });
if(document.fonts && document.fonts.ready){ document.fonts.ready.then(()=>{ if(!scratchRevealed) sizeScratchCanvas(); }); }
if(window.ResizeObserver){
  const scratchResizeObserver = new ResizeObserver(()=>{ if(!scratchRevealed) sizeScratchCanvas(); });
  scratchResizeObserver.observe(scratchMessage);
}

let scratching = false;
function scratchAt(x,y){
  sctx.globalCompositeOperation = 'destination-out';
  sctx.beginPath();
  sctx.arc(x,y, scratchCanvas.width*0.06, 0, Math.PI*2);
  sctx.fill();
}
function getPos(e){
  const rect = scratchCanvas.getBoundingClientRect();
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;
  return { x: clientX - rect.left, y: clientY - rect.top };
}
function checkScratchProgress(){
  const w = scratchCanvas.width, h = scratchCanvas.height;
  if(!w || !h) return;
  const sampleStep = 8;
  const data = sctx.getImageData(0,0,w,h).data;
  let cleared = 0, total = 0;
  for(let y=0;y<h;y+=sampleStep){
    for(let x=0;x<w;x+=sampleStep){
      const alpha = data[((y*w+x)*4)+3];
      if(alpha < 60) cleared++;
      total++;
    }
  }
  const pct = cleared/total;
  if(pct > 0.6 && !scratchRevealed){
    revealScratch();
  }
}
function revealScratch(){
  scratchRevealed = true;
  scratchHint.style.display = 'none';
  gsap.to(scratchCanvas, { opacity: 0, duration: 0.9, ease:'power2.out', onComplete: ()=>{ scratchCanvas.style.pointerEvents='none'; } });
  fireHeartConfetti();
  setTimeout(fireHeartConfetti, 400);
}
function handleStart(e){ scratching = true; const p = getPos(e); scratchAt(p.x,p.y); }
function handleMove(e){ if(!scratching || scratchRevealed) return; e.preventDefault(); const p = getPos(e); scratchAt(p.x,p.y); checkScratchProgress(); }
function handleEnd(){ scratching = false; }
scratchCanvas.addEventListener('mousedown', handleStart);
scratchCanvas.addEventListener('mousemove', handleMove);
window.addEventListener('mouseup', handleEnd);
scratchCanvas.addEventListener('touchstart', handleStart, {passive:true});
scratchCanvas.addEventListener('touchmove', handleMove, {passive:false});
scratchCanvas.addEventListener('touchend', handleEnd);

/* ============================================
   PART 3c — LOVE QUIZ
============================================ */
const quizQuestions = [
  { q: "Where did our love story begin?", correct: "At Coaching ❤️", wrong: ["In a Mathematics Book 📚", "At a Wedding Ceremony 😂", "Inside Facebook Marketplace 🤣"] },
  { q: "Who always called after finishing coaching?", correct: "You 📞❤️", wrong: ["My Math Teacher 😂", "The Food Delivery Guy 🍕", "Nobody 😒"] },
  { q: "Who always finished the food last?", correct: "You 😋", wrong: ["Me 😎", "The Waiter 🍽️", "Nobody, we forgot to eat 😂"] },
  { q: "What was our favorite excuse to meet?", correct: "\"I'm going to coaching.\" 🤭❤️", wrong: ["Grocery Shopping 🛒", "Library Study 📚", "Dentist Appointment 🦷😂"] }
];
function shuffle(arr){ return arr.map(v=>[Math.random(),v]).sort((a,b)=>a[0]-b[0]).map(v=>v[1]); }

let quizIndex = 0, quizScore = 0, quizLocked = false;
const quizLive = document.getElementById('quiz-live');
const quizResult = document.getElementById('quiz-result');
const quizProgressFill = document.getElementById('quiz-progress-fill');
const quizCounter = document.getElementById('quiz-counter');

function renderQuizQuestion(){
  quizLocked = false;
  const item = quizQuestions[quizIndex];
  const options = shuffle([item.correct, ...item.wrong]);
  quizProgressFill.style.width = (quizIndex/quizQuestions.length*100)+'%';
  quizCounter.textContent = `Question ${quizIndex+1} of ${quizQuestions.length}`;
  quizLive.innerHTML = `
    <div class="quiz-question">${item.q}</div>
    <div class="quiz-options">
      ${options.map(opt=>`<button class="quiz-option" data-correct="${opt===item.correct}">${opt}</button>`).join('')}
    </div>
  `;
  quizLive.querySelectorAll('.quiz-option').forEach(btn=>{
    btn.addEventListener('click', ()=> handleQuizAnswer(btn));
  });
}
function handleQuizAnswer(btn){
  if(quizLocked) return;
  quizLocked = true;
  const isCorrect = btn.dataset.correct === 'true';
  if(isCorrect){
    btn.classList.add('correct');
    quizScore++;
    fireHeartConfetti();
  } else {
    btn.classList.add('wrong');
  }
  quizLive.querySelectorAll('.quiz-option').forEach(b=>{
    if(b.dataset.correct === 'true') b.classList.add('correct');
    b.disabled = true;
  });
  setTimeout(()=>{
    quizIndex++;
    if(quizIndex < quizQuestions.length){ renderQuizQuestion(); }
    else { finishQuiz(); }
  }, 1100);
}
function finishQuiz(){
  quizProgressFill.style.width = '100%';
  quizCounter.textContent = 'Quiz complete';
  quizLive.style.display = 'none';
  quizResult.style.display = 'block';
  const perfect = quizScore === quizQuestions.length;
  quizResult.innerHTML = perfect
    ? `<h3>❤️ PERFECT SCORE ❤️</h3><p>You remember every little detail of us. Of course you do — you lived it with me.</p>`
    : `<h3>You scored ${quizScore} / ${quizQuestions.length} ❤️</h3><p>It's not about the score — it's that we get to keep making more memories to remember.</p>`;
  if(perfect){
    ['confetti','fireworks'].forEach((_,i)=>{});
    launchQuizFireworks();
  }
}
function launchQuizFireworks(){
  if(typeof confetti !== 'function') return;
  let count = 0;
  const interval = setInterval(()=>{
    confetti({ particleCount: 50, spread: 100, origin: { x: Math.random(), y: Math.random()*0.4 + 0.1 }, colors:['#c9737d','#d4af37','#f0d78a'] });
    count++;
    if(count > 5) clearInterval(interval);
  }, 350);
}

/* The quiz now starts the moment the Love Quiz chapter is first opened —
   see runPageEnterHooks() in the pagination controller at the end of the document. */
let quizStarted = false;
