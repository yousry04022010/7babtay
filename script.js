/* =========================================================
   DESIGN TOKENS
   Background : #170608 (near-black burgundy)
   Panel      : #250A0F
   Rose       : #E63950  (primary accent)
   Deep Rose  : #C1121F  (secondary accent)
   Blush      : #F7C6D0  (soft highlight)
   Gold       : #D4AF37  (luxury accent, used sparingly)
   Text       : #FBEFF0
   Display font : 'Aref Ruqaa' (elegant Arabic calligraphic serif)
   Body font    : 'Tajawal'
   Utility font : 'Cairo' (numerals / timeline)
   ========================================================= */

:root{
  --bg:#170608;
  --panel:#250a0f;
  --rose:#e63950;
  --rose-deep:#c1121f;
  --blush:#f7c6d0;
  --gold:#d4af37;
  --text:#fbeff0;
  --text-dim:#d8b3b8;
  --glass-bg:rgba(37,10,15,0.55);
  --glass-border:rgba(247,198,208,0.18);
  --font-display:'Aref Ruqaa', serif;
  --font-body:'Tajawal', sans-serif;
  --font-num:'Cairo', sans-serif;
}

*{margin:0;padding:0;box-sizing:border-box;}
html{scroll-behavior:smooth;}
body{
  background:var(--bg);
  color:var(--text);
  font-family:var(--font-body);
  overflow-x:hidden;
  cursor:none;
}
@media (hover:none){ body{cursor:auto;} #cursor-rose{display:none;} }

::selection{background:var(--rose); color:#fff;}

/* ---------- Reduced motion ---------- */
@media (prefers-reduced-motion: reduce){
  *{animation-duration:0.01ms !important; animation-iteration-count:1 !important; transition-duration:0.01ms !important; scroll-behavior:auto !important;}
}

/* ---------- Cursor rose ---------- */
#cursor-rose{
  position:fixed; top:0; left:0; width:26px; height:26px;
  pointer-events:none; z-index:9998; font-size:20px;
  transform:translate(-50%,-50%); opacity:0.9;
  transition:transform .05s linear;
}
#cursor-rose::before{content:"🌹";}

/* ---------- Petals canvas (global, fixed) ---------- */
#petals-canvas{
  position:fixed; inset:0; width:100%; height:100%;
  pointer-events:none; z-index:5;
}

/* =========================================================
   LOADING SCREEN
   ========================================================= */
#loading-screen{
  position:fixed; inset:0; z-index:10000;
  background:radial-gradient(ellipse at center, #2b0a10 0%, #0e0304 80%);
  display:flex; flex-direction:column; align-items:center; justify-content:center;
  gap:24px;
  transition:opacity .8s ease, visibility .8s ease;
}
#loading-screen.fade-out{opacity:0; visibility:hidden;}

.loader-heart-wrap{width:90px; height:80px;}
.loader-heart{width:100%; height:100%; filter:drop-shadow(0 0 18px var(--rose));
  animation:heartbeat 1.1s ease-in-out infinite;}
.loader-heart path{fill:var(--rose);}
@keyframes heartbeat{
  0%,100%{transform:scale(1);}
  25%{transform:scale(1.15);}
  40%{transform:scale(0.95);}
  60%{transform:scale(1.1);}
}
.loader-text{font-family:var(--font-body); color:var(--blush); letter-spacing:1px; font-size:15px;}
.dots span{animation:blink 1.4s infinite; opacity:0;}
.dots span:nth-child(1){animation-delay:0s;}
.dots span:nth-child(2){animation-delay:.2s;}
.dots span:nth-child(3){animation-delay:.4s;}
@keyframes blink{0%,100%{opacity:0;}50%{opacity:1;}}

.loader-bar{width:220px; height:3px; background:rgba(255,255,255,.12); border-radius:3px; overflow:hidden;}
.loader-bar-fill{height:100%; width:0%; background:linear-gradient(90deg,var(--rose-deep),var(--rose),var(--gold)); transition:width .3s ease;}

/* =========================================================
   LAYOUT / SECTIONS
   ========================================================= */
#experience{position:relative; z-index:2;}
#experience.hidden{display:none;}

.section{
  position:relative;
  min-height:100vh;
  width:100%;
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  padding:80px 20px;
  text-align:center;
  overflow:hidden;
}
.dark-panel{background:linear-gradient(180deg,#0e0304,var(--panel) 40%, #0e0304);}

.section-title{
  font-family:var(--font-display);
  font-size:clamp(2rem,6vw,3.2rem);
  color:var(--blush);
  text-shadow:0 0 24px rgba(230,57,80,.55);
  margin-bottom:10px;
  z-index:2;
}
.section-title.light{color:#fff;}
.section-sub{
  font-size:clamp(.9rem,2.4vw,1.1rem);
  color:var(--text-dim);
  margin-bottom:36px;
  z-index:2;
}
.section-sub.light{color:var(--blush);}

.glass{
  background:var(--glass-bg);
  backdrop-filter:blur(14px);
  -webkit-backdrop-filter:blur(14px);
  border:1px solid var(--glass-border);
  border-radius:20px;
  box-shadow:0 8px 40px rgba(0,0,0,.4);
}

/* ---------- Buttons ---------- */
.btn-primary, .btn-secondary{
  font-family:var(--font-body);
  font-weight:700;
  font-size:1rem;
  border:none;
  border-radius:50px;
  padding:16px 38px;
  cursor:pointer;
  position:relative;
  display:inline-flex;
  align-items:center;
  gap:10px;
  transition:transform .25s ease, box-shadow .25s ease;
}
.btn-primary{
  background:linear-gradient(135deg,var(--rose-deep),var(--rose));
  color:#fff;
  box-shadow:0 0 26px rgba(230,57,80,.55);
}
.btn-primary:hover{transform:translateY(-3px) scale(1.04); box-shadow:0 0 40px rgba(230,57,80,.85);}
.btn-secondary{
  background:transparent;
  color:var(--blush);
  border:1.5px solid var(--rose);
}
.btn-secondary:hover{background:var(--rose); color:#fff; transform:translateY(-2px);}
.btn-icon{
  background:rgba(255,255,255,.06);
  border:1px solid var(--glass-border);
  color:var(--blush);
  padding:10px 18px;
  border-radius:30px;
  cursor:pointer;
  font-family:var(--font-body);
  transition:.2s;
}
.btn-icon:hover{background:var(--rose); color:#fff;}
.btn-icon.round{width:52px; height:52px; border-radius:50%; padding:0; font-size:1.1rem;}
.btn-icon:disabled{opacity:.4; cursor:not-allowed;}
.btn-rose{font-style:normal;}

/* =========================================================
   HERO
   ========================================================= */
#hero{padding-top:60px;}
#hero-3d{position:absolute; inset:0; z-index:1;}
.hero-glow{
  position:absolute; inset:0; z-index:1;
  background:radial-gradient(circle at 50% 55%, rgba(230,57,80,.35), transparent 60%);
  pointer-events:none;
}
.hero-content{position:relative; z-index:3;}
.hero-eyebrow{
  font-family:var(--font-body);
  color:var(--blush);
  font-size:clamp(1rem,3vw,1.3rem);
  min-height:1.6em;
  margin-bottom:12px;
  letter-spacing:.5px;
}
.hero-name{
  font-family:var(--font-display);
  font-size:clamp(3.2rem,14vw,7rem);
  color:#fff;
  text-shadow:0 0 40px rgba(230,57,80,.8), 0 0 90px rgba(230,57,80,.5);
  margin-bottom:34px;
}
.heart-emoji{display:inline-block; animation:heartbeat 1.3s ease-in-out infinite;}
.scroll-hint{
  position:absolute; bottom:26px; left:50%; transform:translateX(-50%);
  color:var(--text-dim); font-size:.85rem; z-index:3;
  animation:bob 2s ease-in-out infinite;
}
@keyframes bob{0%,100%{transform:translate(-50%,0);}50%{transform:translate(-50%,8px);}}

/* =========================================================
   GAME SECTION
   ========================================================= */
.game-box{
  max-width:520px; width:100%;
  padding:34px 26px;
  display:flex; flex-direction:column; align-items:center; gap:20px;
  z-index:2;
}
.hidden{display:none !important;}
.game-question{font-size:1.15rem; color:var(--text); line-height:1.7;}
.game-options{display:flex; flex-direction:column; gap:12px; width:100%;}
.game-option-btn{
  background:rgba(255,255,255,.05);
  border:1px solid var(--glass-border);
  color:var(--text);
  padding:14px 18px;
  border-radius:14px;
  font-family:var(--font-body);
  font-size:1rem;
  cursor:pointer;
  transition:.2s;
  text-align:right;
}
.game-option-btn:hover{background:var(--rose); border-color:var(--rose); transform:translateX(-4px);}
.game-result-line{font-size:1.2rem; color:var(--text-dim);}
.game-winner{
  font-family:var(--font-display);
  font-size:clamp(2.2rem,7vw,3.5rem);
  color:var(--rose);
  text-shadow:0 0 30px rgba(230,57,80,.7);
}
.rose-burst-target{position:relative; width:1px; height:1px; margin:0 auto;}

/* =========================================================
   BOOK SECTION
   ========================================================= */
.book-wrap{z-index:2; display:flex; flex-direction:column; align-items:center; gap:26px; width:100%;}
.book{
  perspective:2200px;
  width:min(88vw,340px);
  height:min(88vw,340px);
  position:relative;
}
.book-page{
  position:absolute; inset:0;
  background:linear-gradient(135deg,#2c0d13,#1a0609);
  border:1px solid var(--glass-border);
  border-radius:10px;
  padding:28px 22px;
  display:flex; flex-direction:column; align-items:center; justify-content:center;
  text-align:center;
  box-shadow:0 10px 40px rgba(0,0,0,.5);
  transform-origin:right center;
  transition:transform .9s cubic-bezier(.65,0,.35,1);
  backface-visibility:hidden;
}
.book-page .page-icon{font-size:2.2rem; margin-bottom:14px;}
.book-page .page-text{font-size:1.05rem; line-height:1.8; color:var(--text);}
.book-page .page-num{position:absolute; bottom:14px; font-size:.75rem; color:var(--text-dim); font-family:var(--font-num);}
.book-page.flipped{transform:rotateY(-160deg); opacity:0; pointer-events:none;}
.book-nav{display:flex; align-items:center; gap:18px; font-family:var(--font-num); color:var(--text-dim);}

/* =========================================================
   SPACE SECTION
   ========================================================= */
#space-section{min-height:130vh;}
#space-canvas{position:absolute; inset:0; z-index:0;}
.space-content{position:relative; z-index:2; width:100%; max-width:640px;}
.space-message{padding:26px 24px; margin-top:20px; font-size:1.05rem; line-height:1.8;}
.space-final{
  font-family:var(--font-display);
  font-size:clamp(2.4rem,8vw,4rem);
  color:#fff;
  margin-top:30px;
  text-shadow:0 0 40px var(--rose);
}
.space-final span{color:var(--rose);}
.star{
  position:absolute; cursor:pointer; font-size:1.4rem;
  filter:drop-shadow(0 0 6px #fff);
  animation:twinkle 2.4s ease-in-out infinite;
  z-index:2;
}
@keyframes twinkle{0%,100%{opacity:.5;}50%{opacity:1;}}

/* =========================================================
   GARDEN SECTION
   ========================================================= */
.garden-grid{
  z-index:2;
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(70px,1fr));
  gap:14px;
  max-width:760px;
  width:100%;
}
.garden-rose{
  font-size:clamp(1.6rem,4vw,2.2rem);
  background:rgba(255,255,255,.04);
  border:1px solid var(--glass-border);
  border-radius:16px;
  padding:14px 0;
  cursor:pointer;
  transition:transform .2s, background .2s;
}
.garden-rose:hover{transform:scale(1.15) rotate(-6deg); background:rgba(230,57,80,.25);}
.garden-rose.opened{opacity:.35; pointer-events:none;}
.garden-final{max-width:600px; margin-top:30px; padding:26px; font-size:1.05rem; line-height:1.8; z-index:2;}

/* =========================================================
   GIFT SECTION
   ========================================================= */
.gift-wrap{z-index:2; display:flex; flex-direction:column; align-items:center; gap:20px;}
.gift-box{width:170px; height:170px; position:relative; cursor:pointer;}
.gift-lid{
  font-size:9rem; line-height:1; text-align:center;
  filter:drop-shadow(0 0 24px rgba(230,57,80,.6));
  transition:transform .5s cubic-bezier(.65,0,.35,1);
}
.gift-box.shake .gift-lid{animation:shake .5s ease-in-out 3;}
.gift-box.opened .gift-lid{transform:translateY(-60px) rotate(-25deg) scale(1.1);}
@keyframes shake{0%,100%{transform:rotate(0);}25%{transform:rotate(-6deg);}75%{transform:rotate(6deg);}}
.gift-contents{display:flex; flex-direction:column; align-items:center; gap:12px; max-width:440px;}
.gift-item{font-size:2.6rem; animation:pop .5s ease;}
.gift-name{font-family:var(--font-display); font-size:2.6rem; color:var(--rose); text-shadow:0 0 20px var(--rose);}
.gift-message{font-size:1rem; color:var(--text-dim); line-height:1.7;}
@keyframes pop{from{transform:scale(0);opacity:0;} to{transform:scale(1);opacity:1;}}
.gift-hint{color:var(--text-dim); font-size:.85rem;}

/* =========================================================
   TIMELINE SECTION
   ========================================================= */
.timeline-grid{
  z-index:2;
  display:grid;
  grid-template-columns:1fr;
  gap:20px;
  max-width:900px;
  width:100%;
  margin-bottom:50px;
}
@media(min-width:720px){ .timeline-grid{grid-template-columns:repeat(2,1fr);} }

.timeline-card{
  perspective:1000px;
  padding:24px 20px;
  text-align:right;
  position:relative;
  overflow:hidden;
}
.timeline-card::before{
  content:"🌹"; position:absolute; top:-10px; left:-10px; font-size:2.6rem; opacity:.12;
}
.timeline-date{font-family:var(--font-num); font-weight:800; color:var(--rose); font-size:1.3rem; margin-bottom:6px;}
.timeline-label{font-size:.95rem; color:var(--text-dim); margin-bottom:16px; line-height:1.6;}
.timeline-counter{
  display:grid; grid-template-columns:repeat(4,1fr); gap:8px;
  font-family:var(--font-num);
}
.tc-box{background:rgba(255,255,255,.05); border-radius:10px; padding:8px 4px; text-align:center;}
.tc-num{font-size:1.3rem; font-weight:800; color:#fff;}
.tc-unit{font-size:.65rem; color:var(--text-dim);}

.full-letter{
  max-width:720px; width:100%;
  padding:40px 26px;
  font-size:1.15rem;
  line-height:2.2;
  z-index:2;
  color:var(--text);
}
.full-letter .word{
  display:inline-block;
  opacity:0;
  transform:translateY(14px);
  filter:blur(3px);
}
.full-letter .rose-inline{display:inline-block; margin:0 3px;}

/* =========================================================
   MUSIC SECTION
   ========================================================= */
.player{z-index:2; max-width:420px; width:100%; padding:36px 26px; display:flex; flex-direction:column; align-items:center; gap:22px;}
.vinyl-wrap{position:relative; width:180px; height:180px;}
.vinyl{
  width:100%; height:100%; border-radius:50%;
  background:repeating-radial-gradient(circle, #111 0 3px, #1c1c1c 3px 6px);
  border:3px solid #000;
  display:flex; align-items:center; justify-content:center;
  box-shadow:0 0 30px rgba(0,0,0,.6);
  animation-name:spin; animation-timing-function:linear; animation-iteration-count:infinite;
  animation-duration:3s; animation-play-state:paused;
}
.vinyl.playing{animation-play-state:running;}
@keyframes spin{from{transform:rotate(0);} to{transform:rotate(360deg);}}
.vinyl-label{
  width:56px; height:56px; border-radius:50%;
  background:radial-gradient(circle,var(--rose-deep),var(--rose));
  color:#fff; font-size:.6rem; font-weight:700;
  display:flex; align-items:center; justify-content:center; text-align:center;
  padding:4px;
}
.tonearm{
  position:absolute; top:-10px; right:-6px; width:70px; height:8px;
  background:linear-gradient(90deg,#888,#ccc);
  border-radius:6px; transform-origin:right center; transform:rotate(-25deg);
  transition:transform .4s ease;
}
.tonearm.playing{transform:rotate(5deg);}
.player-controls{display:flex; align-items:center; gap:14px;}
.file-label{cursor:pointer;}
.player-hint{font-size:.8rem; color:var(--text-dim); text-align:center;}

/* =========================================================
   ENDING SECTION
   ========================================================= */
#ending-section{min-height:120vh;}
#fireworks-canvas{position:absolute; inset:0; z-index:0;}
.ending-content{position:relative; z-index:2; display:flex; flex-direction:column; align-items:center; gap:14px;}
.ending-name{
  font-family:var(--font-display);
  font-size:clamp(3rem,12vw,6rem);
  color:#fff;
  text-shadow:0 0 50px var(--rose);
}
.ending-love{font-size:clamp(1.6rem,6vw,2.4rem); color:var(--rose);}
.ending-sorry{font-size:1.1rem; color:var(--text-dim); margin-bottom:20px;}

.giant-rose{position:relative; width:220px; height:220px; margin:20px auto;}
.giant-rose .petal{
  position:absolute; width:120px; height:120px; left:50px; top:50px;
  background:linear-gradient(135deg,var(--rose),var(--rose-deep));
  border-radius:0 100% 0 100%;
  transform-origin:0% 100%;
  opacity:0;
  transition:opacity .6s ease, transform 1.2s cubic-bezier(.34,1.56,.64,1);
}
.giant-rose.open .petal{opacity:.92;}
.giant-rose .p1{transform:rotate(0deg) scale(1);}
.giant-rose .p2{transform:rotate(45deg) scale(1);}
.giant-rose .p3{transform:rotate(90deg) scale(1);}
.giant-rose .p4{transform:rotate(135deg) scale(1);}
.giant-rose .p5{transform:rotate(180deg) scale(1);}
.giant-rose .p6{transform:rotate(225deg) scale(1);}
.giant-rose .p7{transform:rotate(270deg) scale(1);}
.giant-rose .p8{transform:rotate(315deg) scale(1);}
.giant-rose:not(.open) .petal{transform:scale(0);}
.rose-center{
  position:absolute; width:50px; height:50px; left:85px; top:85px;
  background:radial-gradient(circle,var(--gold),var(--rose-deep));
  border-radius:50%; z-index:2;
  box-shadow:0 0 30px var(--rose);
}
.the-end{font-family:var(--font-display); font-size:1.4rem; color:var(--text-dim); margin-top:30px; letter-spacing:2px;}

/* =========================================================
   FLOATING / EXPLOSION ELEMENTS (spawned by JS)
   ========================================================= */
.floating-rose{
  position:fixed; z-index:50; pointer-events:none; font-size:1.6rem;
  will-change:transform,opacity;
}
.explosion-rose{
  position:absolute; z-index:60; pointer-events:none; font-size:1.4rem;
  will-change:transform,opacity;
}

/* =========================================================
   RESPONSIVE TWEAKS
   ========================================================= */
@media(max-width:600px){
  .section{padding:60px 16px;}
  .book{width:82vw; height:82vw;}
  .timeline-counter{grid-template-columns:repeat(4,1fr); gap:5px;}
  .tc-num{font-size:1.05rem;}
  .giant-rose{width:170px; height:170px;}
  .giant-rose .petal{width:95px; height:95px; left:37px; top:37px;}
  .rose-center{width:40px; height:40px; left:65px; top:65px;}
}
