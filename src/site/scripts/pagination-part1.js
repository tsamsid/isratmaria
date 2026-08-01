/* ============================================
   PART 4 — FINAL CHAPTER
============================================ */
const envelope = document.getElementById('envelope');
const envelopeStage = document.getElementById('envelope-stage');
const letterPaper = document.getElementById('letter-paper');

function openEnvelope(){
  if(envelope.classList.contains('open')) return;
  envelope.classList.add('open');
  envelopeStage.classList.add('opened');
  setTimeout(()=>{
    letterPaper.classList.add('show');
    letterPaper.scrollIntoView({ behavior:'smooth', block:'center' });
  }, 900);
}
envelope.addEventListener('click', openEnvelope);
envelope.addEventListener('keydown', (e)=>{ if(e.key==='Enter' || e.key===' '){ e.preventDefault(); openEnvelope(); } });

/* Final message — reveal one line group at a time */
const finalLines = [
  { lines: ["Happy Birthday,", "Maria ❤️"], cls: "" },
  { lines: ["May your smile", "always stay this beautiful."], cls: "small" },
  { lines: ["May every dream", "come true."], cls: "small" },
  { lines: ["Thank you", "for every memory."], cls: "small" },
  { lines: ["No matter where life takes us,", "you'll always have a special place", "inside my heart."], cls: "small" },
  { lines: ["Made with Endless Love ❤️", "— Samsid"], cls: "gold" }
];
const finalMessageEl = document.getElementById('final-message');
async function startFinalMessage(){
  finalMessageEl.scrollIntoView({ behavior:'smooth', block:'center' });
  for(const group of finalLines){
    const div = document.createElement('div');
    div.className = 'final-line ' + group.cls;
    div.innerHTML = group.lines.join('<br/>');
    finalMessageEl.appendChild(div);
    await new Promise(r=> setTimeout(r, 60));
    div.classList.add('visible');
    await new Promise(r=> setTimeout(r, prefersReducedMotion ? 200 : 1800));
  }
  await new Promise(r=> setTimeout(r, 600));
  launchFinaleFireworks();
}

/* Fireworks finale — ~15 seconds of layered confetti bursts */
function launchFinaleFireworks(){
  if(typeof confetti !== 'function'){ startEnding(); return; }
  const duration = 15000;
  const end = Date.now() + duration;
  const colors = ['#c9737d', '#d4af37', '#f0d78a', '#c98a4f', '#faf3e6'];
  (function frame(){
    confetti({ particleCount: 4, angle: 60, spread: 65, origin: { x: 0 }, colors });
    confetti({ particleCount: 4, angle: 120, spread: 65, origin: { x: 1 }, colors });
    if(Math.random() > 0.7){
      confetti({ particleCount: 30, spread: 100, startVelocity: 35, origin: { x: Math.random(), y: Math.random()*0.3 }, colors });
    }
    if(Date.now() < end){ requestAnimationFrame(frame); }
    else{ setTimeout(startEnding, 800); }
  })();
}

/* Ending scene */
async function startEnding(){
  document.querySelectorAll('.aurora-blob').forEach(b=> b.style.transition='opacity 2s ease');
  document.querySelectorAll('.aurora-blob').forEach(b=> b.style.opacity = '0.08');
  const endingTyped = document.getElementById('ending-typed');
  const endingText = "Some stories never truly end... They simply become beautiful memories.";
  endingTyped.scrollIntoView({ behavior:'smooth', block:'center' });
  await new Promise(r=> setTimeout(r, 600));
  for(let i=0;i<=endingText.length;i++){
    endingTyped.textContent = endingText.slice(0,i);
    await new Promise(r=> setTimeout(r, prefersReducedMotion ? 0 : 32));
  }
  await new Promise(r=> setTimeout(r, 900));
  document.getElementById('ending-heart').classList.add('show');
  await new Promise(r=> setTimeout(r, 900));
  document.getElementById('the-end').classList.add('show');
}
