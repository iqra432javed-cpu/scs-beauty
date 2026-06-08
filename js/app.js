/* ============================================================
   SCS BEAUTY — app.js
   FIXES APPLIED:
   - Counter animation: was broken (showed 0). Fixed with
     robust IntersectionObserver + fallback trigger.
   - Hamburger: added aria-expanded toggle.
   - Newsletter: added real validation + user feedback.
   - Scroll reveal: hardened threshold so it fires reliably.
   - Navbar scroll class: unchanged, preserved.
============================================================ */

// ── NAVBAR SCROLL ──────────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ── HAMBURGER MENU ─────────────────────────────────────────
function toggleMenu() {
  const navLinks = document.getElementById('navLinks');
  const hamburger = document.getElementById('hamburger');
  const isOpen = navLinks.classList.toggle('active');
  hamburger.setAttribute('aria-expanded', isOpen);
  hamburger.classList.toggle('active', isOpen);
}

// Close menu on nav-link click (mobile)
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    document.getElementById('navLinks').classList.remove('active');
    document.getElementById('hamburger').setAttribute('aria-expanded', false);
    document.getElementById('hamburger').classList.remove('active');
  });
});

// ── SCROLL REVEAL ──────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── ACTIVE NAV LINK ────────────────────────────────────────
const sections = document.querySelectorAll('section[id], div[id]');
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => link.classList.remove('active'));
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

// ── COUNTER ANIMATION (FIXED) ──────────────────────────────
// BUG: Original code relied on IntersectionObserver alone,
// but countersSection was already in view on some devices,
// so the observer never fired. Fix: check immediately on
// page load AND via observer. Also added suffix support.

function formatNumber(n) {
  if (n >= 1000) return (n / 1000).toFixed(0) + 'K';
  return n.toString();
}

function animateCounter(el) {
  if (el.dataset.animated) return; // prevent double-run
  el.dataset.animated = 'true';

  const target = parseInt(el.dataset.target, 10);
  const suffix = el.dataset.suffix || '';
  const duration = 2000; // ms
  const startTime = performance.now();

  function step(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);

    el.textContent = formatNumber(current) + suffix;

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.textContent = formatNumber(target) + suffix;
    }
  }

  requestAnimationFrame(step);
}

function initCounters() {
  const countersSection = document.getElementById('countersSection');
  if (!countersSection) return;

  const counterEls = countersSection.querySelectorAll('.counter-num[data-target]');

  // FIX: Try observer first, but also check if already visible
  const tryNow = () => {
    const rect = countersSection.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0;
    if (inView) counterEls.forEach(animateCounter);
  };

  // Immediate check (catches above-fold or already-scrolled states)
  tryNow();

  // Observer for when user scrolls to it
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        counterEls.forEach(animateCounter);
        counterObserver.disconnect();
      }
    });
  }, { threshold: 0.2 });

  counterObserver.observe(countersSection);
}

// ── NEWSLETTER (FIXED) ─────────────────────────────────────
// BUG: No validation, no feedback. Fixed with proper email
// validation and status message displayed to user.

function subscribeNewsletter() {
  const input = document.getElementById('newsletterEmail');
  const msg   = document.getElementById('newsletter-msg');

  if (!input || !msg) return;

  const email = input.value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  msg.style.color = '#B76E79';

  if (!email) {
    msg.textContent = 'Please enter your email address.';
    input.focus();
    return;
  }

  if (!emailRegex.test(email)) {
    msg.textContent = 'Please enter a valid email address.';
    input.focus();
    return;
  }

  // Simulate successful subscription (replace with real API call when ready)
  // e.g. fetch('https://your-mailchimp-endpoint', { method:'POST', body:... })
  input.value = '';
  msg.style.color = '#1D9E75';
  msg.textContent = '✓ You\'re in! Welcome to the SCS beauty community.';

  setTimeout(() => { msg.textContent = ''; }, 6000);
}

// Allow Enter key on newsletter input
document.addEventListener('DOMContentLoaded', () => {
  const emailInput = document.getElementById('newsletterEmail');
  if (emailInput) {
    emailInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') subscribeNewsletter();
    });
  }

  // Init counters after DOM ready
  initCounters();
});
