/* =========================================================
   GLOBAL STATE
   ========================================================= */
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* =========================================================
   1. LOADING SCREEN
   ========================================================= */
function runLoader(){
  const fill = document.getElementById('loaderFill');
  const screen = document.getElementById('loading-screen');
  const experience = document.getElementById('experience');
  let pct = 0;
  const timer = setInterval(()=>{
    pct += Math.random()*18 + 6;
    if(pct >= 100){
      pct = 100;
      fill.style.width = pct + '%';
      clearInterval(timer);
      setTimeout(()=>{
        screen.classList.add('fade-out');
        experience.classList.remove('hidden');
        startExperience();
      }, 350);
      return;
    }
    fill.style.width = pct + '%';
  }, 220);
}
document.addEventListener('DOMContentLoaded', runLoader);

/* =========================================================
   2. GLOBAL PETALS CANVAS (falling + wind + mouse drift)
   ========================================================= */
const petalCanvas = document.getElementById('petals-canvas');
const pctx = petalCanvas.getContext('2d');
let petals = [];
let mouse = {x: window.innerWidth/2, y: window.innerHeight/2};

function resizePetalCanvas(){
  petalCanvas.width = window.innerWidth;
  petalCanvas.height = window.innerHeight;
}
resizePetalCanvas();
window.addEventListener('resize', resizePetalCanvas);

function makePetal(){
  return {
    x: Math.random()*petalCanvas.width,
    y: -20 - Math.random()*200,
    size: 8 + Math.random()*14,
    speedY: 0.6 + Math.random()*1.3,
    speedX: -0.4 + Math.random()*0.8,
    rot: Math.random()*360,
    rotSpeed: -2 + Math.random()*4,
    hue: 340 + Math.random()*20,
    opacity: 0.5 + Math.random()*0.5
  };
}
const PETAL_COUNT = window.innerWidth < 700 ? 22 : 45;
for(let i=0;i<PETAL_COUNT;i++) petals.push(makePetal());

function drawPetal(p){
  pctx.save();
  pctx.translate(p.x, p.y);
  pctx.rotate(p.rot * Math.PI/180);
  pctx.globalAlpha = p.opacity;
  pctx.fillStyle = `hsl(${p.hue}, 75%, 65%)`;
  pctx.beginPath();
  pctx.moveTo(0, -p.size/2);
  pctx.quadraticCurveTo(p.size/2, -p.size/4, 0, p.size/2);
  pctx.quadraticCurveTo(-p.size/2, -p.size/4, 0, -p.size/2);
  pctx.fill();
  pctx.restore();
}

function animatePetals(){
  pctx.clearRect(0,0,petalCanvas.width, petalCanvas.height);
  petals.forEach(p=>{
    // gentle attraction toward mouse x for interactivity
    const dx = (mouse.x - p.x) * 0.0006;
    p.x += p.speedX + dx;
    p.y += p.speedY;
    p.rot += p.rotSpeed;
    if(p.y > petalCanvas.height + 20){
      Object.assign(p, makePetal(), {y:-20});
    }
    if(p.x < -20) p.x = petalCanvas.width + 20;
    if(p.x > petalCanvas.width + 20) p.x = -20;
    drawPetal(p);
  });
  requestAnimationFrame(animatePetals);
}
if(!reduceMotion) animatePetals();

window.addEventListener('mousemove', (e)=>{
  mouse.x = e.clientX; mouse.y = e.clientY;
  const cursor = document.getElementById('cursor-rose');
  cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%,-50%)`;
});

/* =========================================================
   3. FLOATING ROSE SPAWN HELPERS (hover / click / transitions)
   ========================================================= */
function spawnFloatingRose(x, y, opts = {}){
  const el = document.createElement('div');
  el.className = 'floating-rose';
  el.textContent = opts.emoji || (Math.random() > 0.5 ? '🌹' : '🌸');
  el.style.left = x + 'px';
  el.style.top = y + 'px';
  document.body.appendChild(el);
  const dx = (Math.random()-0.5) * 120;
  const dy = -(80 + Math.random()*140);
  const rot = (Math.random()-0.5) * 180;
  if(window.gsap){
    gsap.to(el, {
      x: dx, y: dy, rotation: rot, opacity:0, duration: 1.4 + Math.random()*0.6,
      ease:'power1.out',
      onComplete: ()=> el.remove()
    });
  } else {
    el.style.transition = 'transform 1.4s ease, opacity 1.4s ease';
    requestAnimationFrame(()=>{
      el.style.transform = `translate(${dx}px, ${dy}px) rotate(${rot}deg)`;
      el.style.opacity = '0';
    });
    setTimeout(()=> el.remove(), 1500);
  }
}

function spawnRoseExplosion(x, y, count = 14){
  for(let i=0;i<count;i++){
    setTimeout(()=> spawnFloatingRose(x + (Math.random()-0.5)*30, y + (Math.random()-0.5)*30), i*20);
  }
}

// hover roses on interactive buttons
document.addEventListener('mouseover', (e)=>{
  const t = e.target.closest('.btn-primary, .btn-secondary, .btn-icon, .garden-rose');
  if(t && !reduceMotion){
    const r = t.getBoundingClientRect();
    spawnFloatingRose(r.left + r.width/2, r.top);
  }
});

// click explosion on any button
document.addEventListener('click', (e)=>{
  const t = e.target.closest('button');
  if(t) spawnRoseExplosion(e.clientX, e.clientY, 10);
});

/* =========================================================
   4. SECTION TRANSITION ROSE BURST (IntersectionObserver)
   ========================================================= */
function initSectionTransitions(){
  const sections = document.querySelectorAll('.section');
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('in-view');
        if(!reduceMotion){
          const r = entry.target.getBoundingClientRect();
          spawnRoseExplosion(window.innerWidth/2, window.innerHeight*0.15, 8);
        }
      }
    });
  }, {threshold:0.35});
  sections.forEach(s=> io.observe(s));
}

/* =========================================================
   5. HERO — THREE.JS PULSING HEART + TYPED INTRO
   ========================================================= */
function initHero3D(){
  const canvas = document.getElementById('hero-3d');
  if(!window.THREE || !canvas) return;

  const renderer = new THREE.WebGLRenderer({canvas, alpha:true, antialias:true});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, window.innerWidth/window.innerHeight, 0.1, 100);
  camera.position.z = 6;

  // heart shape via 2D shape extrusion
  const heartShape = new THREE.Shape();
  const x=0, y=0;
  heartShape.moveTo(x, y);
  heartShape.bezierCurveTo(x, y-1, x-2, y-1, x-2, y+0.6);
  heartShape.bezierCurveTo(x-2, y+2, x, y+2.6, x, y+3.4);
  heartShape.bezierCurveTo(x, y+2.6, x+2, y+2, x+2, y+0.6);
  heartShape.bezierCurveTo(x+2, y-1, x, y-1, x, y);

  const geometry = new THREE.ExtrudeGeometry(heartShape, {depth:0.6, bevelEnabled:true, bevelThickness:0.15, bevelSize:0.15, bevelSegments:3, curveSegments:24});
  geometry.center();
  geometry.rotateZ(Math.PI);
  geometry.rotateY(0.15);

  const material = new THREE.MeshStandardMaterial({color:0xe63950, emissive:0xc1121f, emissiveIntensity:0.5, metalness:0.3, roughness:0.35});
  const heart = new THREE.Mesh(geometry, material);
  heart.scale.set(0.85,0.85,0.85);
  scene.add(heart);

  const light1 = new THREE.PointLight(0xff8fa3, 3, 20);
  light1.position.set(3,3,4);
  scene.add(light1);
  const light2 = new THREE.PointLight(0xd4af37, 1.5, 20);
  light2.position.set(-3,-2,3);
  scene.add(light2);
  scene.add(new THREE.AmbientLight(0x552028, 1.2));

  // small orbiting particle roses (points)
  const particleGeo = new THREE.BufferGeometry();
  const count = 120;
  const positions = new Float32Array(count*3);
  for(let i=0;i<count;i++){
    const r = 3 + Math.random()*2.5;
    const theta = Math.random()*Math.PI*2;
    const phi = Math.random()*Math.PI;
    positions[i*3] = r*Math.sin(phi)*Math.cos(theta);
    positions[i*3+1] = r*Math.sin(phi)*Math.sin(theta)*0.6;
    positions[i*3+2] = r*Math.cos(phi)*0.6 - 1;
  }
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions,3));
  const particleMat = new THREE.PointsMaterial({color:0xf7c6d0, size:0.05, transparent:true, opacity:0.8});
  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  let t = 0;
  function animate(){
    t += 0.02;
    const beat = 1 + Math.sin(t*2.4)*0.08 + (Math.sin(t*2.4*2)>0.9 ? 0.05:0);
    heart.scale.set(0.85*beat, 0.85*beat, 0.85*beat);
    heart.rotation.y = Math.sin(t*0.3)*0.35;
    particles.rotation.y += 0.0015;
    particles.rotation.x += 0.0005;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  if(!reduceMotion) animate(); else renderer.render(scene, camera);

  window.addEventListener('resize', ()=>{
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // mouse parallax
  window.addEventListener('mousemove', (e)=>{
    const nx = (e.clientX/window.innerWidth - 0.5);
    const ny = (e.clientY/window.innerHeight - 0.5);
    if(window.gsap){
      gsap.to(heart.rotation, {x: ny*0.3, duration:1});
      gsap.to(camera.position, {x: nx*0.6, y: -ny*0.3, duration:1});
    }
  });
}

function initTypedIntro(){
  const el = document.getElementById('typedIntro');
  if(window.Typed && el){
    new Typed('#typedIntro', {
      strings:['في حد يستحق كل الحب...'],
      typeSpeed:55,
      showCursor:false,
      onComplete: ()=>{}
    });
  } else if(el){
    el.textContent = 'في حد يستحق كل الحب...';
  }
}

/* =========================================================
   6. GAME — "اعرفي مين بيحبك"
   ========================================================= */
const gameQuestions = [
  {q:'مين اللي بيفتكر أول مرة اتكلمتوا فيها؟', options:['هو ❤️','محدش فاكر','هي طبعاً']},
  {q:'مين اللي بيفضل يفكر فيكِ طول اليوم؟', options:['هو أكيد','محدش','مش عارفة']},
  {q:'مين المستعد يفضل جنبك في كل الظروف؟', options:['هو ❤️','مش متأكدة','محدش']}
];
let gameIndex = 0;

function initGame(){
  const startBox = document.getElementById('gameStart');
  const startBtn = document.getElementById('gameStartBtn');
  const qBox = document.getElementById('gameQuestions');
  const resultBox = document.getElementById('gameResult');

  startBtn.addEventListener('click', ()=>{
    startBox.classList.add('hidden');
    qBox.classList.remove('hidden');
    gameIndex = 0;
    renderGameQuestion();
  });

  function renderGameQuestion(){
    if(gameIndex >= gameQuestions.length){
      qBox.classList.add('hidden');
      resultBox.classList.remove('hidden');
      const target = resultBox.querySelector('.rose-burst-target');
      const r = target.getBoundingClientRect();
      spawnRoseExplosion(r.left, r.top, 24);
      return;
    }
    const item = gameQuestions[gameIndex];
    qBox.innerHTML = `
      <p class="game-question">${item.q}</p>
      <div class="game-options">
        ${item.options.map(o=>`<button class="game-option-btn">${o}</button>`).join('')}
      </div>
    `;
    qBox.querySelectorAll('.game-option-btn').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        gameIndex++;
        renderGameQuestion();
      });
    });
  }
}

/* =========================================================
   7. 3D BOOK — memories
   ========================================================= */
const bookPages = [
  {icon:'📖', text:'دفتر صغير فيه أحلى ذكريات...'},
  {icon:'🎮', text:'أول مرة لعبنا ببجي سوا... يوم مش هينسى.'},
  {icon:'📞', text:'أول كول بينا... كان بداية كل حاجة حلوة.'},
  {icon:'🌙', text:'يوم 5 رمضان تقريباً... دخلتِ حياتي وغيرتيها.'},
  {icon:'💬', text:'يوم قولتلك بحبك لأول مرة... ما اتنسيش.'},
  {icon:'❤️', text:'بحبك'}
];
let currentPage = 0;

function initBook(){
  const book = document.getElementById('theBook');
  const indicator = document.getElementById('pageIndicator');
  const prevBtn = document.getElementById('prevPageBtn');
  const nextBtn = document.getElementById('nextPageBtn');

  bookPages.forEach((p, i)=>{
    const pageEl = document.createElement('div');
    pageEl.className = 'book-page';
    pageEl.style.zIndex = bookPages.length - i;
    pageEl.innerHTML = `<div class="page-icon">${p.icon}</div><div class="page-text">${p.text}</div><div class="page-num">${i+1} / ${bookPages.length}</div>`;
    book.appendChild(pageEl);
  });

  function update(){
    const pages = book.querySelectorAll('.book-page');
    pages.forEach((p,i)=>{
      p.classList.toggle('flipped', i < currentPage);
    });
    indicator.textContent = `${currentPage+1} / ${bookPages.length}`;
    prevBtn.disabled = currentPage === 0;
    nextBtn.disabled = currentPage === bookPages.length - 1;
  }

  nextBtn.addEventListener('click', ()=>{
    if(currentPage < bookPages.length -1){
      currentPage++;
      update();
      const r = book.getBoundingClientRect();
      spawnFloatingRose(r.left + r.width/2, r.top + r.height/2);
    }
  });
  prevBtn.addEventListener('click', ()=>{
    if(currentPage > 0){ currentPage--; update(); }
  });
  update();
}

/* =========================================================
   8. SPACE JOURNEY — canvas stars + clickable message stars
   ========================================================= */
const spaceMessages = [
  'كل نجمة هنا... بتفكرني بيكِ.',
  'من كتر ما بحبك، حسيت إن السما مش كفاية.',
  'ولا نجمة في السما تقدر تنور زي ما بتنوري حياتي.',
];

function initSpace(){
  const canvas = document.getElementById('space-canvas');
  const ctx = canvas.getContext('2d');
  const section = document.getElementById('space-section');

  function resize(){
    canvas.width = section.offsetWidth;
    canvas.height = section.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const stars = [];
  const bgStarCount = 180;
  for(let i=0;i<bgStarCount;i++){
    stars.push({x:Math.random()*canvas.width, y:Math.random()*canvas.height, r:Math.random()*1.6, tw:Math.random()*Math.PI*2});
  }
  function drawStars(){
    ctx.clearRect(0,0,canvas.width, canvas.height);
    ctx.fillStyle = '#0b0203';
    ctx.fillRect(0,0,canvas.width, canvas.height);
    stars.forEach(s=>{
      s.tw += 0.02;
      ctx.globalAlpha = 0.4 + Math.sin(s.tw)*0.4;
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(drawStars);
  }
  if(!reduceMotion) drawStars(); else drawStars();

  // clickable interactive stars (DOM)
  const content = document.querySelector('.space-content');
  const msgBox = document.getElementById('spaceMessage');
  const finalName = document.getElementById('spaceFinalName');
  let clicked = 0;

  spaceMessages.forEach((msg, i)=>{
    const star = document.createElement('div');
    star.className = 'star';
    star.textContent = '⭐';
    star.style.left = (10 + Math.random()*80) + '%';
    star.style.top = (10 + Math.random()*70) + '%';
    star.style.animationDelay = (Math.random()*2) + 's';
    star.addEventListener('click', (e)=>{
      msgBox.textContent = msg;
      msgBox.classList.remove('hidden');
      spawnRoseExplosion(e.clientX, e.clientY, 10);
      star.style.pointerEvents = 'none';
      star.style.opacity = '0.15';
      clicked++;
      if(clicked >= spaceMessages.length){
        setTimeout(()=> finalName.classList.remove('hidden'), 600);
      }
    });
    content.appendChild(star);
  });
}

/* =========================================================
   9. ROSE GARDEN
   ========================================================= */
const gardenWords = ['أنتِ','هدى','هدية','ربنا','ليا','في','حياتي','بحبك','جداً','أوي','ومش','هزعل','منك','تاني'];

function initGarden(){
  const grid = document.getElementById('gardenGrid');
  const finalMsg = document.getElementById('gardenFinalMsg');
  const revealed = [];

  gardenWords.forEach((word, i)=>{
    const btn = document.createElement('button');
    btn.className = 'garden-rose';
    btn.textContent = '🌹';
    btn.addEventListener('click', ()=>{
      if(btn.classList.contains('opened')) return;
      btn.classList.add('opened');
      btn.textContent = '🌸';
      revealed.push(word);
      const r = btn.getBoundingClientRect();
      spawnFloatingRose(r.left + r.width/2, r.top);
      if(revealed.length === gardenWords.length){
        finalMsg.textContent = revealed.join(' ') + ' ❤️';
        finalMsg.classList.remove('hidden');
        const fr = finalMsg.getBoundingClientRect();
        spawnRoseExplosion(fr.left + fr.width/2, fr.top, 20);
      }
    });
    grid.appendChild(btn);
  });
}

/* =========================================================
   10. GIFT BOX
   ========================================================= */
function initGift(){
  const box = document.getElementById('giftBox');
  const contents = document.getElementById('giftContents');
  let opened = false;

  box.addEventListener('click', ()=>{
    if(opened) return;
    box.classList.add('shake');
    setTimeout(()=>{
      box.classList.remove('shake');
      box.classList.add('opened');
      contents.classList.remove('hidden');
      opened = true;
      const r = box.getBoundingClientRect();
      spawnRoseExplosion(r.left + r.width/2, r.top, 22);
    }, 1500);
  });
}

/* =========================================================
   11. TIMELINE — live counters + verbatim letter reveal
   ========================================================= */
const timelineData = [
  {date:new Date(2026,2,28), title:'28 فبراير', label:'يوم دخلتِ حياتي... يوم من أحلى أيامي.'},
  {date:new Date(2026,3,10,8,), title:'10 أبريل — 8:00 صباحاً', label:'يوم قولتلك بحبك لأول مرة.'},
  {date:new Date(2026,7,2), title:'2 يوليو', label:'يوم من أصعب أيامي.'},
  {date:new Date(2026,7,18), title:'18 يوليو', label:'يوم رجعت فيا الروح تاني.'}
];

function pad(n){ return n.toString().padStart(2,'0'); }

function initTimeline(){
  const grid = document.getElementById('timelineGrid');

  const cards = timelineData.map((item)=>{
    const card = document.createElement('div');
    card.className = 'timeline-card glass';
    card.innerHTML = `
      <div class="timeline-date">${item.title}</div>
      <div class="timeline-label">${item.label}</div>
      <div class="timeline-counter">
        <div class="tc-box"><div class="tc-num" data-unit="d">0</div><div class="tc-unit">يوم</div></div>
        <div class="tc-box"><div class="tc-num" data-unit="h">0</div><div class="tc-unit">ساعة</div></div>
        <div class="tc-box"><div class="tc-num" data-unit="m">0</div><div class="tc-unit">دقيقة</div></div>
        <div class="tc-box"><div class="tc-num" data-unit="s">0</div><div class="tc-unit">ثانية</div></div>
      </div>
    `;
    grid.appendChild(card);
    if(window.VanillaTilt){
      VanillaTilt.init(card, {max:8, speed:400, glare:true, 'max-glare':0.15});
    }
    return card;
  });

  function tick(){
    const now = new Date();
    timelineData.forEach((item, i)=>{
      let diff = now - item.date;
      if(diff < 0) diff = 0;
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      const card = cards[i];
      card.querySelector('[data-unit="d"]').textContent = d;
      card.querySelector('[data-unit="h"]').textContent = pad(h);
      card.querySelector('[data-unit="m"]').textContent = pad(m);
      card.querySelector('[data-unit="s"]').textContent = pad(s);
    });
  }
  tick();
  setInterval(tick, 1000);

  initLetterReveal();
}

// The message below is preserved exactly as provided — not a single word altered, shortened, or removed.
const FULL_LETTER_TEXT = "من يوم 2/28 الي هو يوم تقريبا 5 رمضان كان من احلي ايام حياتي علشان دخل فيه أحسن احلي شخص اخلي حد في حياتي بديت كل صحاب بس بعدها حبيتك اويي لسه فاكر اول كول أو مره لعبنا فيها ببجي سوا لسه فاكر حته يوم جمعه يوم ما قولتك بحبك كان يوم 4/10 ساعه 8 صبح كان احسن يوم في حياتي علشان اعترفت ليكي بي احبي اي احلي حاجه حصلت ليا في حياتي كان يوم 2 في شهر خرا 7 من اوسخ ايام حياتي علشان فكرت خسرت احلي حاجه في الدنيا كان يوم 18/7 رجع فيا الروح تاني علشان اغلي حاجه روحي رجعت فيا تاني عاوز اقولك بحبكككككككك ي هدهدتي ي احلي حاجه حصلت ليا في حياتي ممكن بقا مش تزعلي مني تاني";

function initLetterReveal(){
  const box = document.getElementById('fullLetter');
  const words = FULL_LETTER_TEXT.split(' ');
  box.innerHTML = '🌹 ' + words.map(w => `<span class="word">${w}</span>`).join(' ') + ' 🌹';

  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        const spans = box.querySelectorAll('.word');
        spans.forEach((span, i)=>{
          setTimeout(()=>{
            span.style.transition = 'opacity .5s ease, transform .5s ease, filter .5s ease';
            span.style.opacity = '1';
            span.style.transform = 'translateY(0)';
            span.style.filter = 'blur(0)';
          }, Math.min(i*35, 3000));
        });
        io.disconnect();
      }
    });
  }, {threshold:0.2});
  io.observe(box);
}

/* =========================================================
   12. MUSIC PLAYER (vinyl) — user supplies own audio file
   ========================================================= */
function initMusicPlayer(){
  const upload = document.getElementById('audioUpload');
  const player = document.getElementById('audioPlayer');
  const playBtn = document.getElementById('playPauseBtn');
  const vinyl = document.getElementById('vinylDisc');
  const arm = document.getElementById('tonearm');
  const hint = document.getElementById('playerHint');

  // audio/helaf-el-amar.mp3 is already wired via the <audio> tag's src attribute.
  // Enable the play button once that file is playable, and let the user swap it via upload if they want.
  player.addEventListener('canplay', ()=>{ playBtn.disabled = false; }, {once:true});
  player.addEventListener('error', ()=>{
    hint.textContent = 'الملف audio/helaf-el-amar.mp3 مش موجود جنب الصفحة — استخدمي زر الرفع.';
  });

  upload.addEventListener('change', (e)=>{
    const file = e.target.files[0];
    if(!file) return;
    const url = URL.createObjectURL(file);
    player.src = url;
    playBtn.disabled = false;
    hint.textContent = `تم تحميل: ${file.name}`;
  });

  playBtn.addEventListener('click', ()=>{
    if(player.paused){
      player.play();
      vinyl.classList.add('playing');
      arm.classList.add('playing');
      playBtn.textContent = '⏸';
    } else {
      player.pause();
      vinyl.classList.remove('playing');
      arm.classList.remove('playing');
      playBtn.textContent = '▶';
    }
  });

  player.addEventListener('ended', ()=>{
    vinyl.classList.remove('playing');
    arm.classList.remove('playing');
    playBtn.textContent = '▶';
  });
}

/* =========================================================
   13. ENDING — fireworks + giant rose
   ========================================================= */
function initEnding(){
  const canvas = document.getElementById('fireworks-canvas');
  const ctx = canvas.getContext('2d');
  const section = document.getElementById('ending-section');
  const rose = document.getElementById('giantRose');

  function resize(){
    canvas.width = section.offsetWidth;
    canvas.height = section.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  let fireworks = [];
  function spawnFirework(){
    const x = Math.random()*canvas.width;
    const y = canvas.height*0.2 + Math.random()*canvas.height*0.4;
    const particles = [];
    const n = 26;
    for(let i=0;i<n;i++){
      const angle = (Math.PI*2/n)*i;
      const speed = 1.5 + Math.random()*2;
      particles.push({
        x, y,
        vx: Math.cos(angle)*speed,
        vy: Math.sin(angle)*speed,
        life: 60 + Math.random()*20,
        hue: 335 + Math.random()*30
      });
    }
    fireworks.push(particles);
  }

  let frame = 0;
  let active = false;

  function loop(){
    if(active){
      ctx.fillStyle = 'rgba(14,3,4,0.18)';
      ctx.fillRect(0,0,canvas.width, canvas.height);
      frame++;
      if(frame % 55 === 0) spawnFirework();
      fireworks.forEach(particles=>{
        particles.forEach(p=>{
          p.x += p.vx; p.y += p.vy; p.vy += 0.02; p.life--;
          ctx.globalAlpha = Math.max(p.life/80, 0);
          ctx.fillStyle = `hsl(${p.hue}, 85%, 65%)`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 2.4, 0, Math.PI*2);
          ctx.fill();
        });
      });
      fireworks = fireworks.filter(particles => particles[0].life > 0);
      ctx.globalAlpha = 1;
    }
    requestAnimationFrame(loop);
  }
  loop();

  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        active = !reduceMotion;
        setTimeout(()=> rose.classList.add('open'), 900);
      }
    });
  }, {threshold:0.4});
  io.observe(section);
}

/* =========================================================
   14. START BUTTON — scroll to game section
   ========================================================= */
function initStartButton(){
  const btn = document.getElementById('startJourneyBtn');
  btn.addEventListener('click', ()=>{
    spawnRoseExplosion(window.innerWidth/2, window.innerHeight/2, 20);
    document.getElementById('game').scrollIntoView({behavior:'smooth'});
  });
}

/* =========================================================
   MASTER INIT
   ========================================================= */
function startExperience(){
  initTypedIntro();
  initHero3D();
  initStartButton();
  initGame();
  initBook();
  initSpace();
  initGarden();
  initGift();
  initTimeline();
  initMusicPlayer();
  initEnding();
  initSectionTransitions();
  if(window.AOS) AOS.init({duration:900, once:true});
}
