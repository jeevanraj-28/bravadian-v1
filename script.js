/**
 * BRAVADIAN | BRAVE INDIAN
 * Premium Streetwear Coming Soon Page Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initCustomCursor();
  initCountdown();
  initTiltEffects();
  initRevealChamber();
  initTeaserTripleClickReveal();
  initNotifyForm();
  initAmbientAudio();
  initScrollAnimations();
});

/* --------------------------------------------------------------------------
   1. PRELOADER & ENTRANCE SEQUENCE
   -------------------------------------------------------------------------- */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;
  const preloaderBar = document.getElementById('preloaderBar');
  const preloaderPercent = document.getElementById('preloaderPercent');
  const body = document.body;

  let progress = 0;
  const interval = setInterval(() => {
    // Variable step increment for natural loading feel
    progress += Math.floor(Math.random() * 8) + 4;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);

      if (preloaderBar) preloaderBar.style.width = '100%';
      if (preloaderPercent) preloaderPercent.textContent = '100%';

      setTimeout(() => {
        if (preloader) preloader.classList.add('fade-out');
        body.classList.remove('is-loading');
        triggerHeroAnimations();
      }, 400);
    } else {
      if (preloaderBar) preloaderBar.style.width = `${progress}%`;
      if (preloaderPercent) preloaderPercent.textContent = `${String(progress).padStart(2, '0')}%`;
    }
  }, 40);
}

function triggerHeroAnimations() {
  const heroFades = document.querySelectorAll('.hero-section .fade-in');
  heroFades.forEach((el, index) => {
    setTimeout(() => {
      el.classList.add('is-visible');
    }, index * 120);
  });
}


/* --------------------------------------------------------------------------
   2. CUSTOM ROUND MAGNETIC CURSOR (Artifact-Free)
   -------------------------------------------------------------------------- */
function initCustomCursor() {
  const cursor = document.getElementById('customCursor');
  if (!cursor) return;

  const dot = cursor.querySelector('.cursor-dot');
  const ring = cursor.querySelector('.cursor-ring');
  if (!dot || !ring) return;

  let mouseX = -100;
  let mouseY = -100;
  let ringX = -100;
  let ringY = -100;
  let isVisible = false;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!isVisible) {
      isVisible = true;
      cursor.classList.remove('is-hidden');
      ringX = mouseX;
      ringY = mouseY;
    }

    dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
  }, { passive: true });

  document.addEventListener('mouseleave', () => {
    cursor.classList.add('is-hidden');
    isVisible = false;
  });

  document.addEventListener('mouseenter', () => {
    cursor.classList.remove('is-hidden');
    isVisible = true;
  });

  // Smooth lerp loop for the trailing round ring
  function renderCursor() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;

    ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  // Hover state for interactive items
  function attachHover() {
    const interactives = document.querySelectorAll(
      'a, button, input, select, textarea, .teaser-card, .pillar-card, .product-card, .btn-primary, .btn-secondary, .reveal-chamber, .cart-trigger, .nav-link, [role="button"]'
    );
    interactives.forEach((el) => {
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('mouseleave', onLeave);
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
    });
  }

  function onEnter() {
    cursor.classList.add('hovering');
  }

  function onLeave() {
    cursor.classList.remove('hovering');
  }

  attachHover();

  window.addEventListener('hashchange', () => {
    setTimeout(attachHover, 150);
  });
}

/* --------------------------------------------------------------------------
   3. DYNAMIC COUNTDOWN TIMER
   -------------------------------------------------------------------------- */
function initCountdown() {
  const daysEl = document.getElementById('cdDays');
  const hoursEl = document.getElementById('cdHours');
  const minsEl = document.getElementById('cdMins');
  const secsEl = document.getElementById('cdSecs');

  if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

  // Set target launch: 14 days, 12 hours from now
  let targetTime = localStorage.getItem('bravadian_launch_target');
  if (!targetTime) {
    targetTime = Date.now() + (14 * 24 * 60 * 60 * 1000) + (12 * 60 * 60 * 1000);
    localStorage.setItem('bravadian_launch_target', targetTime);
  } else {
    targetTime = parseInt(targetTime, 10);
    // If target has passed, roll forward by another 14 days
    if (Date.now() >= targetTime) {
      targetTime = Date.now() + (14 * 24 * 60 * 60 * 1000);
      localStorage.setItem('bravadian_launch_target', targetTime);
    }
  }

  function update() {
    const now = Date.now();
    const distance = Math.max(0, targetTime - now);

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minsEl.textContent = String(minutes).padStart(2, '0');
    secsEl.textContent = String(seconds).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

/* --------------------------------------------------------------------------
   4. 3D TILT EFFECT ON PRODUCT CARDS
   -------------------------------------------------------------------------- */
function initTiltEffects() {
  const cards = document.querySelectorAll('[data-tilt]');

  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });
}

/* --------------------------------------------------------------------------
   5. INTERACTIVE REVEAL CHAMBER (FLASHLIGHT / TOUCH MASK)
   -------------------------------------------------------------------------- */
function initRevealChamber() {
  const chamber = document.getElementById('revealChamber');
  const shroud = document.getElementById('revealShroud');
  const decryptBtn = document.getElementById('decryptToggleBtn');

  if (!chamber || !shroud) return;

  function updateMask(clientX, clientY) {
    const rect = chamber.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const radius = 150;
    const maskStyle = `radial-gradient(circle ${radius}px at ${x}px ${y}px, transparent 0%, transparent 60%, black 100%)`;

    shroud.style.webkitMaskImage = maskStyle;
    shroud.style.maskImage = maskStyle;
  }

  chamber.addEventListener('mousemove', (e) => {
    updateMask(e.clientX, e.clientY);
  });

  chamber.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      updateMask(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  chamber.addEventListener('mouseleave', () => {
    // Reset mask back to center with small cutout
    const maskStyle = `radial-gradient(circle 0px at 50% 50%, transparent 0%, black 100%)`;
    shroud.style.webkitMaskImage = maskStyle;
    shroud.style.maskImage = maskStyle;
  });

  // Mobile Decrypt Button Toggle
  if (decryptBtn) {
    let isRevealed = false;
    decryptBtn.addEventListener('click', () => {
      isRevealed = !isRevealed;
      if (isRevealed) {
        chamber.classList.add('revealed');
        decryptBtn.querySelector('.decrypt-btn-text').textContent = 'CONCEAL MESSAGE';
      } else {
        chamber.classList.remove('revealed');
        decryptBtn.querySelector('.decrypt-btn-text').textContent = 'TAP TO REVEAL MESSAGE';
      }
    });
  }
}

/* --------------------------------------------------------------------------
   5B. 3-CLICK TEASER OVERRIDE REVEAL
   -------------------------------------------------------------------------- */
function initTeaserTripleClickReveal() {
  const teaserSection = document.getElementById('teaserSection');
  const tracker = document.getElementById('teaserUnlockTracker');
  const trackerText = document.getElementById('unlockText');
  const pips = [
    document.getElementById('pip1'),
    document.getElementById('pip2'),
    document.getElementById('pip3')
  ];
  const chamber = document.getElementById('revealChamber');
  const card4Badge = document.getElementById('card4Badge');
  const decryptBtn = document.getElementById('decryptToggleBtn');

  if (!teaserSection) return;

  let clickCount = 0;
  let isFullyRevealed = false;
  let resetTimer = null;

  function handleTeaserClick() {
    if (isFullyRevealed) return;

    clickCount++;
    clearTimeout(resetTimer);

    // Light up corresponding pips
    pips.forEach((pip, index) => {
      if (pip) {
        if (index < clickCount) {
          pip.classList.add('active');
        }
      }
    });

    if (clickCount === 1) {
      if (trackerText) trackerText.textContent = '[ OVERRIDE: 1/3 CLICKS ]';
      playTone(400, 'sine', 0.12);
      resetTimer = setTimeout(resetClickCount, 6000);
    } else if (clickCount === 2) {
      if (trackerText) trackerText.textContent = '[ OVERRIDE: 2/3 CLICKS — 1 MORE TO REVEAL ]';
      playTone(520, 'sine', 0.12);
      resetTimer = setTimeout(resetClickCount, 6000);
    } else if (clickCount >= 3) {
      triggerFullReveal();
    }
  }

  function resetClickCount() {
    if (isFullyRevealed) return;
    clickCount = 0;
    pips.forEach(p => p && p.classList.remove('active'));
    if (trackerText) trackerText.textContent = 'CLICK 3 TIMES TO REVEAL FULL TEASER';
  }

  function triggerFullReveal() {
    isFullyRevealed = true;
    clearTimeout(resetTimer);

    // Activate all pips
    pips.forEach(p => p && p.classList.add('active'));

    // Update tracker state
    if (tracker) tracker.classList.add('unlocked');
    if (trackerText) trackerText.textContent = '⚡ ARCHIVE OVERRIDE // 100% REVEALED';

    // Add classes to trigger CSS reveal transitions
    teaserSection.classList.add('is-fully-revealed');
    if (chamber) {
      chamber.classList.add('is-fully-revealed');
      chamber.classList.add('revealed');
    }
    if (card4Badge) {
      card4Badge.textContent = 'OVERRIDE UNLOCKED';
      card4Badge.style.color = '#22c55e';
    }
    if (decryptBtn) {
      decryptBtn.querySelector('.decrypt-btn-text').textContent = 'FULL ARCHIVE UNLOCKED';
    }

    // Play cyber unlock audio sequence
    playTone(440, 'triangle', 0.15);
    setTimeout(() => playTone(554, 'triangle', 0.15), 140);
    setTimeout(() => playTone(659, 'triangle', 0.3), 280);
  }

  // Click on tracker pill
  if (tracker) {
    tracker.addEventListener('click', (e) => {
      e.stopPropagation();
      handleTeaserClick();
    });
  }

  // Click on any teaser card
  const teaserCards = teaserSection.querySelectorAll('.teaser-card');
  teaserCards.forEach(card => {
    card.addEventListener('click', handleTeaserClick);
  });

  // Also click on Reveal Chamber
  if (chamber) {
    chamber.addEventListener('click', handleTeaserClick);
  }
}

/* --------------------------------------------------------------------------
   6. EMAIL NOTIFICATION & VIP PASS
   -------------------------------------------------------------------------- */
function initNotifyForm() {
  const form = document.getElementById('notifyForm');
  const emailInput = document.getElementById('emailInput');
  const feedback = document.getElementById('formFeedback');
  const vipTicket = document.getElementById('vipTicket');
  const ticketIdEl = document.getElementById('ticketId');
  const submitBtn = document.getElementById('notifySubmitBtn');

  if (!form || !emailInput) return;

  // Check if previously registered
  const savedVip = localStorage.getItem('bravadian_vip_pass');
  if (savedVip) {
    try {
      const data = JSON.parse(savedVip);
      if (vipTicket && ticketIdEl) {
        ticketIdEl.textContent = data.id;
        vipTicket.style.display = 'block';
        feedback.className = 'form-feedback success';
        feedback.textContent = `Welcome back. Access pass confirmed for ${data.email}.`;
        emailInput.value = data.email;
        emailInput.disabled = true;
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.querySelector('.btn-text').textContent = 'REGISTERED';
        }
      }
    } catch (e) {
      localStorage.removeItem('bravadian_vip_pass');
    }
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      feedback.className = 'form-feedback error';
      feedback.textContent = 'Please provide a valid email address.';
      emailInput.focus();
      return;
    }

    // Simulate submission state
    submitBtn.disabled = true;
    submitBtn.querySelector('.btn-text').textContent = 'TRANSMITTING...';

    setTimeout(() => {
      const randomCode = Math.floor(1000 + Math.random() * 9000);
      const ticketSerial = `#BRVD-${randomCode}`;

      // Save pass
      const passData = {
        email: email,
        id: ticketSerial,
        registeredAt: new Date().toISOString()
      };
      localStorage.setItem('bravadian_vip_pass', JSON.stringify(passData));

      if (ticketIdEl) ticketIdEl.textContent = ticketSerial;
      if (vipTicket) vipTicket.style.display = 'block';

      feedback.className = 'form-feedback success';
      feedback.textContent = 'CONFIRMED: VIP Drop Access Pass Generated.';

      submitBtn.querySelector('.btn-text').textContent = 'REGISTERED';
      emailInput.disabled = true;

      // Play soft confirmation frequency if audio context is active
      playTone(440, 'triangle', 0.2);
    }, 600);
  });
}

/* --------------------------------------------------------------------------
   7. AMBIENT WEB AUDIO SYNTHESIZER
   -------------------------------------------------------------------------- */
let audioCtx = null;
let ambientOsc = null;
let ambientGain = null;
let isAudioPlaying = false;

function initAmbientAudio() {
  const soundToggle = document.getElementById('soundToggle');
  if (!soundToggle) return;

  soundToggle.addEventListener('click', () => {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    if (!isAudioPlaying) {
      startAmbientSound();
      soundToggle.classList.add('playing');
      soundToggle.querySelector('.sound-status-text').textContent = 'AUDIO: ON';
      isAudioPlaying = true;
    } else {
      stopAmbientSound();
      soundToggle.classList.remove('playing');
      soundToggle.querySelector('.sound-status-text').textContent = 'AUDIO: OFF';
      isAudioPlaying = false;
    }
  });
}

function startAmbientSound() {
  if (!audioCtx) return;

  // Deep 55Hz sub-bass ambient texture
  ambientOsc = audioCtx.createOscillator();
  const filter = audioCtx.createBiquadFilter();
  ambientGain = audioCtx.createGain();

  ambientOsc.type = 'sine';
  ambientOsc.frequency.setValueAtTime(55, audioCtx.currentTime); // Low A

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(140, audioCtx.currentTime);

  ambientGain.gain.setValueAtTime(0.001, audioCtx.currentTime);
  ambientGain.gain.exponentialRampToValueAtTime(0.12, audioCtx.currentTime + 2);

  ambientOsc.connect(filter);
  filter.connect(ambientGain);
  ambientGain.connect(audioCtx.destination);

  ambientOsc.start();
}

function stopAmbientSound() {
  if (ambientGain && audioCtx) {
    ambientGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.8);
    setTimeout(() => {
      if (ambientOsc) {
        try { ambientOsc.stop(); } catch(e) {}
      }
    }, 800);
  }
}

function playTone(freq, type = 'sine', duration = 0.15) {
  if (!audioCtx || audioCtx.state !== 'running') return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch(e) {}
}

/* --------------------------------------------------------------------------
   8. SCROLL INTERSECTION OBSERVER
   -------------------------------------------------------------------------- */
function initScrollAnimations() {
  const targets = document.querySelectorAll('.teaser-section .pillar-card, .teaser-section .teaser-card, .reveal-section, .brand-story-section, .notify-section');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  targets.forEach((target) => {
    target.classList.add('fade-in');
    observer.observe(target);
  });
}
