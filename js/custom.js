/* =====================================================================
   PHONE SCREEN NAVIGATION
   ===================================================================== */
const sidebarOverlay = document.getElementById('sidebarOverlay');
const sidebarPanel   = document.getElementById('sidebarPanel');
const screenSettings = document.getElementById('screenSettings');

function openSidebar()  { sidebarOverlay.classList.add('active'); sidebarPanel.classList.add('open'); }
function closeSidebar() { sidebarOverlay.classList.remove('active'); sidebarPanel.classList.remove('open'); }
function openSettings() { closeSidebar(); screenSettings.classList.remove('hidden'); }
function closeSettings(){ screenSettings.classList.add('hidden'); }

document.getElementById('btnSidebar').addEventListener('click', openSidebar);
document.getElementById('btnSidebarClose').addEventListener('click', closeSidebar);
sidebarOverlay.addEventListener('click', closeSidebar);
document.getElementById('btnSettings').addEventListener('click', openSettings);
document.getElementById('sidebarToSettings').addEventListener('click', openSettings);
document.getElementById('btnSettingsBack').addEventListener('click', closeSettings);


/* =====================================================================
   CAROUSEL OVERLAY
   ===================================================================== */
const charOverlay   = document.getElementById('charOverlay');
const charImg       = document.getElementById('charImg');
const charTag       = document.getElementById('charTag');
const charTitle     = document.getElementById('charTitle');
const charBody      = document.getElementById('charBody');
const charList      = document.getElementById('charList');
const charStage     = document.getElementById('charStage');
const charCounter   = document.getElementById('charCounter');
const charTimerFill = document.getElementById('charTimerFill');
const charDots      = document.getElementById('charDots');

const SLIDE_DURATION = 5000;
let allCards   = [];
let currentIdx = 0;
let rafId      = null;
let startTime  = null;

/* build dot indicators */
function buildDots() {
  charDots.innerHTML = '';
  allCards.forEach((_, i) => {
    const d = document.createElement('button');
    d.className = 'char-dot-pip' + (i === currentIdx ? ' active' : '');
    d.setAttribute('aria-label', 'Go to slide ' + (i + 1));
    d.addEventListener('click', (e) => { e.stopPropagation(); goTo(i); });
    charDots.appendChild(d);
  });
}

/* fill overlay with card data */
function fillCard(card, animate) {
  function apply() {
    charImg.src           = card.dataset.img;
    charImg.alt           = card.dataset.title;
    charTag.textContent   = card.dataset.tag;
    charTitle.textContent = card.dataset.title;
    charBody.textContent  = card.dataset.desc;
    charCounter.textContent = (currentIdx + 1) + ' / ' + allCards.length;

    charList.innerHTML = '';
    (card.dataset.bullets || '').split('|').filter(Boolean).forEach(b => {
      const li = document.createElement('li');
      li.innerHTML = '<span class="char-dot"></span>' + b;
      charList.appendChild(li);
    });

    buildDots();
  }

  if (animate) {
    charStage.style.opacity = '0';
    setTimeout(() => {
      apply();
      charStage.style.opacity = '1';
    }, 200);
  } else {
    apply();
  }
}

/* start/restart the auto-advance timer */
function startTimer() {
  cancelAnimationFrame(rafId);
  charTimerFill.style.width = '0%';
  startTime = performance.now();

  function tick(now) {
    const pct = Math.min((now - startTime) / SLIDE_DURATION * 100, 100);
    charTimerFill.style.width = pct + '%';
    if (pct >= 100) {
      goTo((currentIdx + 1) % allCards.length);
    } else {
      rafId = requestAnimationFrame(tick);
    }
  }
  rafId = requestAnimationFrame(tick);
}

/* navigate to a specific index */
function goTo(idx) {
  currentIdx = idx;
  fillCard(allCards[currentIdx], true);
  startTimer();
}

/* open overlay starting at the clicked card */
function openCharPreview(card) {
  allCards   = Array.from(document.querySelectorAll('.feature-card'));
  currentIdx = allCards.indexOf(card);
  fillCard(card, false);
  charOverlay.classList.add('show');
  document.body.style.overflow = 'hidden';
  startTimer();
}

/* close overlay */
function closeCharPreview() {
  charOverlay.classList.remove('show');
  document.body.style.overflow = '';
  cancelAnimationFrame(rafId);
  charTimerFill.style.width = '0%';
}

/* prev / next buttons */
document.getElementById('charPrev').addEventListener('click', (e) => {
  e.stopPropagation();
  goTo((currentIdx - 1 + allCards.length) % allCards.length);
});
document.getElementById('charNext').addEventListener('click', (e) => {
  e.stopPropagation();
  goTo((currentIdx + 1) % allCards.length);
});

/* close triggers */
charOverlay.addEventListener('click', closeCharPreview);
charStage.addEventListener('click', e => e.stopPropagation());
document.getElementById('charClose').addEventListener('click', closeCharPreview);

/* keyboard navigation */
document.addEventListener('keydown', e => {
  if (!charOverlay.classList.contains('show')) return;
  if (e.key === 'Escape')     closeCharPreview();
  if (e.key === 'ArrowLeft')  { e.preventDefault(); goTo((currentIdx - 1 + allCards.length) % allCards.length); }
  if (e.key === 'ArrowRight') { e.preventDefault(); goTo((currentIdx + 1) % allCards.length); }
});

/* attach click to every feature card */
document.querySelectorAll('.feature-card').forEach(card => {
  card.addEventListener('click', () => openCharPreview(card));
});


/* =====================================================================
   PASSWORD TOGGLE
   ===================================================================== */
document.getElementById('togglePwd').addEventListener('click', function () {
  const pwd = document.getElementById('password');
  const isText = pwd.type === 'text';
  pwd.type = isText ? 'password' : 'text';
  this.textContent = isText ? '👁' : '🙈';
});


/* =====================================================================
   FORM VALIDATION
   ===================================================================== */
const loginForm     = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginSuccess  = document.getElementById('loginSuccess');
const usernameFb    = document.getElementById('usernameFeedback');
const passwordFb    = document.getElementById('passwordFeedback');

usernameInput.addEventListener('input', () => validateField(usernameInput));
passwordInput.addEventListener('input', () => validateField(passwordInput));

function validateField(input) {
  if (input.value.trim() === '') {
    setInvalid(input, input.id === 'username' ? 'Username is required.' : 'Password is required.');
    return false;
  }
  if (input.id === 'username' && input.value.trim().length < 3) {
    setInvalid(input, 'Username must be at least 3 characters.');
    return false;
  }
  if (input.id === 'password' && input.value.length < 6) {
    setInvalid(input, 'Password must be at least 6 characters.');
    return false;
  }
  setValid(input);
  return true;
}

function setInvalid(input, message) {
  input.classList.remove('is-valid');
  input.classList.add('is-invalid');
  const fb = input.id === 'username' ? usernameFb : passwordFb;
  fb.textContent = message;
}

function setValid(input) {
  input.classList.remove('is-invalid');
  input.classList.add('is-valid');
}

loginForm.addEventListener('submit', function (e) {
  e.preventDefault();
  const usernameOk = validateField(usernameInput);
  const passwordOk = validateField(passwordInput);

  if (!usernameOk || !passwordOk) {
    loginForm.style.animation = 'none';
    loginForm.offsetHeight;
    loginForm.style.animation = 'shake 0.4s ease';
    return;
  }

  loginSuccess.style.display = 'block';
  loginForm.querySelector('button[type="submit"]').textContent = '✓ Logged In';
  loginForm.querySelector('button[type="submit"]').disabled = true;

  setTimeout(() => {
    loginSuccess.style.display = 'none';
    loginForm.reset();
    usernameInput.classList.remove('is-valid', 'is-invalid');
    passwordInput.classList.remove('is-valid', 'is-invalid');
    loginForm.querySelector('button[type="submit"]').textContent = 'Login to Vault';
    loginForm.querySelector('button[type="submit"]').disabled = false;
  }, 3000);
});