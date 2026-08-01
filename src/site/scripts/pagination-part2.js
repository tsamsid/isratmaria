/* ============================================
   PART 5 — PREMIUM STORY PAGINATION CONTROLLER
   Every chapter is a full-screen .story-page. Only one is ever active.
   Navigation happens only via Next/Previous (buttons, dots, or arrow keys) —
   normal page scrolling is disabled; each chapter may still scroll internally
   if its own content runs taller than the screen.
============================================ */
const STORY_PAGE_IDS = ['welcome-screen','hero','timeline','gallery','reasons','scratch','quiz','final-letter','ending'];
const PAGE_TITLES    = ['Welcome','Intro Letter','Our Timeline','Photo Gallery','22 Reasons Why','A Little Surprise','Love Quiz','A Final Letter','Thank You'];
const storyPages = STORY_PAGE_IDS.map(id=>document.getElementById(id)).filter(Boolean);

let currentPageIndex = 0;
let isTransitioning = false;

const chapterLabel = document.getElementById('chapter-label');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const storyDotsEl = document.getElementById('story-dots');

storyPages.forEach((_, i)=>{
  const dot = document.createElement('span');
  dot.className = 'dot' + (i===0 ? ' active' : '');
  dot.setAttribute('role','button');
  dot.setAttribute('aria-label', 'Go to chapter '+(i+1)+' of '+storyPages.length);
  dot.addEventListener('click', ()=> goToPage(i));
  storyDotsEl.appendChild(dot);
});
const storyDots = storyDotsEl.querySelectorAll('.dot');

const NEXT_HTML = '<span class="nav-hand" aria-hidden="true">👇</span><span class="nav-main-text">Click here to see the next part</span><span class="nav-arrow-bounce" aria-hidden="true">↓</span>';
const FINISH_HTML = '<span class="nav-main-text">❤️ Finish Story ❤️</span>';

function updateNav(){
  prevBtn.classList.toggle('is-hidden', currentPageIndex === 0);
  const isLast = currentPageIndex === storyPages.length - 1;
  nextBtn.classList.toggle('is-finish', isLast);
  nextBtn.innerHTML = isLast ? FINISH_HTML : NEXT_HTML;
  nextBtn.setAttribute('aria-label', isLast ? 'Finish the story' : 'Continue to next chapter');
  storyDots.forEach((d,i)=> d.classList.toggle('active', i===currentPageIndex));
  if(chapterLabel) chapterLabel.textContent = `Chapter ${currentPageIndex+1} of ${storyPages.length} · ${PAGE_TITLES[currentPageIndex]}`;
}

function markPageRevealed(page){
  if(page.dataset.revealed) return;
  page.dataset.revealed = '1';
  if(typeof observeReveals === 'function') observeReveals(page);
}

function runPageEnterHooks(page){
  if(page.id === 'quiz' && typeof renderQuizQuestion === 'function' && typeof quizStarted !== 'undefined' && !quizStarted){
    quizStarted = true;
    renderQuizQuestion();
  }
  if(page.id === 'reasons' && typeof checkReasonsFinale === 'function'){
    checkReasonsFinale();
  }
  if(page.id === 'ending' && typeof startFinalMessage === 'function' && !page.dataset.finalMessageStarted){
    page.dataset.finalMessageStarted = '1';
    setTimeout(startFinalMessage, 400);
  }
}

function goToPage(targetIndex){
  if(targetIndex < 0 || targetIndex >= storyPages.length) return;
  if(targetIndex === currentPageIndex || isTransitioning) return;
  if(currentPageIndex === 0 && targetIndex > 0 && typeof tryStartMusic === 'function') tryStartMusic();
  isTransitioning = true;
  const dir = targetIndex > currentPageIndex ? 'forward' : 'backward';
  const outgoing = storyPages[currentPageIndex];
  const incoming = storyPages[targetIndex];

  incoming.classList.remove('leaving-up','leaving-down');
  incoming.classList.add(dir === 'forward' ? 'entering-from-below' : 'entering-from-above');
  void incoming.offsetHeight; /* force reflow so the entering transform is applied before we animate it away */

  requestAnimationFrame(()=>{
    outgoing.classList.remove('active');
    outgoing.classList.add(dir === 'forward' ? 'leaving-up' : 'leaving-down');
    incoming.classList.remove('entering-from-below','entering-from-above');
    incoming.classList.add('active');
    incoming.scrollTop = 0;

    currentPageIndex = targetIndex;
    updateNav();
    markPageRevealed(incoming);
    runPageEnterHooks(incoming);
  });

  setTimeout(()=>{
    outgoing.classList.remove('leaving-up','leaving-down');
    isTransitioning = false;
  }, 1000);
}

prevBtn.addEventListener('click', ()=> goToPage(currentPageIndex - 1));
nextBtn.addEventListener('click', ()=>{
  if(nextBtn.classList.contains('is-finish')){ finishStory(); }
  else { goToPage(currentPageIndex + 1); }
});

/* "Finish Story" gently closes the book and offers to read it again */
function finishStory(){
  if(typeof fireHeartConfetti === 'function') fireHeartConfetti();
  setTimeout(()=>{
    goToPage(0);
    setTimeout(()=>{
      const welcomeTypingEl = document.getElementById('welcome-typing');
      if(welcomeTypingEl) welcomeTypingEl.innerHTML = '';
      if(typeof startWelcomeTyping === 'function') startWelcomeTyping();
    }, 900);
  }, 700);
}

/* Keyboard navigation (disabled while the photo lightbox is open) */
window.addEventListener('keydown', (e)=>{
  const lb = document.getElementById('lightbox');
  if(lb && lb.classList.contains('open')) return;
  if(e.key === 'ArrowRight'){
    if(nextBtn.classList.contains('is-finish')) finishStory(); else goToPage(currentPageIndex + 1);
  }
  if(e.key === 'ArrowLeft'){ goToPage(currentPageIndex - 1); }
});

/* Initialize on the Welcome chapter */
updateNav();
markPageRevealed(storyPages[0]);

/* ============================================
   MOUSE WHEEL / TRACKPAD NAVIGATION
   Lets desktop users move between chapters with the scroll wheel.
   Scrolling down while already at the bottom of a chapter advances
   to the next one; scrolling up at the top goes back. Otherwise the
   wheel just scrolls normally within the current chapter's content.
============================================ */
let wheelLocked = false;
const WHEEL_LOCK_MS = 950; // matches the page-transition duration
const WHEEL_THRESHOLD = 12; // ignore tiny/noisy trackpad deltas

function unlockWheelSoon(){
  setTimeout(()=>{ wheelLocked = false; }, WHEEL_LOCK_MS);
}

window.addEventListener('wheel', (e)=>{
  const lb = document.getElementById('lightbox');
  if(lb && lb.classList.contains('open')) return; // let the lightbox handle its own scrolling

  if(isTransitioning || wheelLocked) { e.preventDefault(); return; }
  if(Math.abs(e.deltaY) < WHEEL_THRESHOLD) return;

  const activePage = storyPages[currentPageIndex];
  if(!activePage) return;

  const atTop = activePage.scrollTop <= 2;
  const atBottom = activePage.scrollTop + activePage.clientHeight >= activePage.scrollHeight - 2;

  if(e.deltaY > 0 && atBottom){
    if(currentPageIndex < storyPages.length - 1){
      e.preventDefault();
      wheelLocked = true;
      goToPage(currentPageIndex + 1);
      unlockWheelSoon();
    } else if(nextBtn.classList.contains('is-finish')){
      e.preventDefault();
      wheelLocked = true;
      finishStory();
      unlockWheelSoon();
    }
  } else if(e.deltaY < 0 && atTop){
    if(currentPageIndex > 0){
      e.preventDefault();
      wheelLocked = true;
      goToPage(currentPageIndex - 1);
      unlockWheelSoon();
    }
  }
  /* otherwise: let the browser scroll the active chapter's own content normally */
}, { passive: false });

