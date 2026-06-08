bash

cat > /mnt/user-data/outputs/app.js << 'JSEOF'
/* ============================================================
   SCS BEAUTY — js/app.js  (PRODUCTION REWRITE)

   FIXES vs original:
   01. Counter animation: dual-trigger (immediate + observer)
       prevents stuck-at-zero bug when section already in view
   02. Counter uses requestAnimationFrame + ease-out cubic —
       no more janky setInterval
   03. Counter runs in ≤1.5s regardless of target value
   04. Scroll reveal class changed to match CSS: .revealed
       (original used .visible in JS but .reveal.visible in CSS
       — mismatch meant reveals never worked on some pages)
   05. Hamburger logic removed from here (now in index.html
       inline bootstrap block) — keeping toggleMenu() as a
       no-op shim for any old references that remain
   06. Newsletter: real email validation + status message
       + Enter-key support (wired in index.html)
   07. Active nav link: uses IntersectionObserver on sections,
       highlights correct link as user scrolls
   08. Navbar scroll shadow: uses .scrolled class not inline style
   09. Product card stagger delays: applied after grid renders
   10. Marquee: pauses on hover/focus for accessibility
   11. Shop page: filterShop() exposed globally so category
       cards on index.html can call it via sessionStorage
   12. WhatsApp click tracking stub (uncomment for GA4)
   13. All functions that were inline onclick targets kept
       as globals for backward compat with other pages
   ============================================================ */

'use strict';

/* ─────────────────────────────────────────────────────────
   1. NAVBAR — scroll shadow
   ───────────────────────────────────────────────────────── */
(function initNavbarScroll() {
  var navbar = document.getElementById('navbar');
  if (!navbar) return;

  window.addEventListener('scroll', function() {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });
})();


/* ─────────────────────────────────────────────────────────
   2. HAMBURGER — shim (actual logic is in index.html for
   pages that inline it; this covers other pages that load
   only app.js)
   ───────────────────────────────────────────────────────── */
function toggleMenu() {
  var navLinks  = document.getElementById('navLinks');
  var hamburger = document.getElementById('hamburger');
  if (!navLinks) return;

  var isOpen = navLinks.classList.toggle('open');
  if (hamburger) {
    hamburger.setAttribute('aria-expanded', String(isOpen));
    hamburger.setAttribute(
      'aria-label',
      isOpen ? 'Close navigation menu' : 'Open navigation menu'
    );
  }
}

/* Close nav on outside click (covers pages that don't
   have the inline bootstrap block) */
(function initNavOutsideClick() {
  document.addEventListener('click', function(e) {
    var navbar   = document.getElementById('navbar');
    var navLinks = document.getElementById('navLinks');
    if (!navbar || !navLinks) return;
    if (!navbar.contains(e.target)) {
      navLinks.classList.remove('open');
      var hamburger = document.getElementById('hamburger');
      if (hamburger) {
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-label', 'Open navigation menu');
      }
    }
  });
})();


/* ─────────────────────────────────────────────────────────
   3. SCROLL REVEAL
   FIX: original used .visible but CSS defines .reveal.revealed
   We support both to avoid breaking existing pages.
   ───────────────────────────────────────────────────────── */
(function initScrollReveal() {
  var revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        /* Support both class names for compatibility */
        entry.target.classList.add('visible');    /* legacy CSS */
        entry.target.classList.add('revealed');   /* new CSS */
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(function(el) { observer.observe(el); });

  /* Expose observer so products.js can register dynamically
     rendered cards after renderProducts() runs */
  window.revealObserver = observer;
})();


/* ─────────────────────────────────────────────────────────
   4. ACTIVE NAV LINK (scroll-spy)
   ───────────────────────────────────────────────────────── */
(function initScrollSpy() {
  var navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  if (!navLinks.length) return;

  var sections = [];
  navLinks.forEach(function(link) {
    var id = link.getAttribute('href').replace('#', '');
    var el = document.getElementById(id);
    if (el) sections.push({ link: link, el: el });
  });

  if (!sections.length) return;

  var spyObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (!entry.isIntersecting) return;
      var id = entry.target.id;
      navLinks.forEach(function(link) {
        link.classList.toggle(
          'active',
          link.getAttribute('href') === '#' + id
        );
      });
    });
  }, { threshold: 0.35 });

  sections.forEach(function(s) { spyObserver.observe(s.el); });
})();


/* ─────────────────────────────────────────────────────────
   5. COUNTER ANIMATION (FIXED)
   BUG: original used IntersectionObserver only — if the
   counters section was already in the viewport on page load
   (common on wide monitors) the observer never fired and
   all counters stayed at 0.
   FIX: check immediately on DOMContentLoaded AND observe.
   ───────────────────────────────────────────────────────── */
function _formatCounterNum(n) {
  if (n >= 1000) return (n / 1000).toFixed(0) + 'K';
  return n.toString();
}

function _animateSingleCounter(el) {
  /* Prevent double-run */
  if (el.dataset.animated) return;
  el.dataset.animated = 'true';

  var target   = parseInt(el.dataset.target, 10);
  var suffix   = el.dataset.suffix  || '';
  /* Cap animation at 1500ms regardless of target value.
     Original had no cap — 50,000 took ~5s and looked bad. */
  var duration = 1500;
  var startTime = null;

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    var elapsed  = timestamp - startTime;
    var progress = Math.min(elapsed / duration, 1);
    /* Ease-out cubic — fast start, gentle finish */
    var eased    = 1 - Math.pow(1 - progress, 3);
    var current  = Math.floor(eased * target);

    el.textContent = _formatCounterNum(current) + suffix;

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.textContent = _formatCounterNum(target) + suffix;
    }
  }

  requestAnimationFrame(step);
}

function initCounters() {
  var section = document.getElementById('countersSection');
  if (!section) return;

  var counterEls = section.querySelectorAll('.counter-num[data-target]');
  if (!counterEls.length) return;

  /* ── Immediate check: section already visible on load ── */
  function tryNow() {
    var rect   = section.getBoundingClientRect();
    var inView = rect.top < window.innerHeight && rect.bottom > 0;
    if (inView) counterEls.forEach(_animateSingleCounter);
  }
  tryNow();

  /* ── Observer: user scrolls to section ── */
  var counterObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        counterEls.forEach(_animateSingleCounter);
        counterObserver.disconnect();
      }
    });
  }, { threshold: 0.2 });

  counterObserver.observe(section);
}


/* ─────────────────────────────────────────────────────────
   6. NEWSLETTER (FIXED)
   BUG: original function had no real validation, no error
   messages, and no backend — emails went nowhere.
   FIX: proper regex validation, status messages, Enter key,
   and a backend stub ready for Mailchimp/Brevo/Formspree.
   ───────────────────────────────────────────────────────── */
function subscribeNewsletter() {
  var input  = document.getElementById('newsletterEmail');
  var msgEl  = document.getElementById('newsletter-msg');
  if (!input || !msgEl) return;

  var email      = input.value.trim();
  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  /* Helper: show a status message */
  function showMsg(text, isError) {
    msgEl.textContent = text;
    msgEl.style.color = isError ? '#B76E79' : '#1D9E75';
    if (!isError) {
      /* Auto-clear success message after 6s */
      setTimeout(function() { msgEl.textContent = ''; }, 6000);
    }
  }

  /* Validation */
  if (!email) {
    showMsg('Please enter your email address.', true);
    input.focus();
    return;
  }
  if (!emailRegex.test(email)) {
    showMsg('Please enter a valid email address.', true);
    input.focus();
    return;
  }

  /* ── BACKEND INTEGRATION STUB ──────────────────────────
     Replace the block below with a real API call.

     Option A — Brevo (free up to 300/day):
       fetch('https://api.brevo.com/v3/contacts', {
         method: 'POST',
         headers: {
           'api-key': 'YOUR_BREVO_API_KEY',
           'Content-Type': 'application/json'
         },
         body: JSON.stringify({
           email: email,
           listIds: [YOUR_LIST_ID],
           updateEnabled: true
         })
       });

     Option B — Formspree (no backend needed):
       fetch('https://formspree.io/f/YOUR_FORM_ID', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ email: email })
       });

     Option C — Google Sheets via Apps Script:
       fetch('YOUR_APPS_SCRIPT_WEB_APP_URL', {
         method: 'POST',
         body: new URLSearchParams({ email: email })
       });
  ─────────────────────────────────────────────────────── */

  /* For now: simulate success */
  input.value = '';
  showMsg("✓ You're in! Welcome to the SCS beauty community. ✨", false);

  /* Track in GA4 (uncomment when analytics is set up) */
  /*
  if (typeof gtag !== 'undefined') {
    gtag('event', 'newsletter_signup', {
      event_category: 'engagement',
      event_label: 'homepage_footer'
    });
  }
  */
}

/* Expose globally for pages that may still reference it */
window.subscribeNewsletter = subscribeNewsletter;


/* ─────────────────────────────────────────────────────────
   7. MARQUEE — pause on hover/focus (accessibility)
   ───────────────────────────────────────────────────────── */
(function initMarqueePause() {
  var track = document.getElementById('marqueeTrack');
  if (!track) return;

  track.addEventListener('mouseenter', function() {
    track.style.animationPlayState = 'paused';
  });
  track.addEventListener('mouseleave', function() {
    track.style.animationPlayState = 'running';
  });
  track.addEventListener('focusin', function() {
    track.style.animationPlayState = 'paused';
  });
  track.addEventListener('focusout', function() {
    track.style.animationPlayState = 'running';
  });
})();


/* ─────────────────────────────────────────────────────────
   8. PRODUCT CARD STAGGER
   Applied after products.js has rendered cards.
   ───────────────────────────────────────────────────────── */
function applyProductStagger() {
  var cards = document.querySelectorAll('.products-grid .product-card');
  cards.forEach(function(card, i) {
    card.style.transitionDelay = (i * 0.07) + 's';
    /* Re-register with reveal observer if available */
    if (window.revealObserver) window.revealObserver.observe(card);
  });
}

/* Also stagger benefit items and opp cards */
(function staggerOtherGrids() {
  document.querySelectorAll('.benefits-grid .benefit-item').forEach(function(el, i) {
    el.style.transitionDelay = (i * 0.07) + 's';
  });
  document.querySelectorAll('.opp-cards .opp-card').forEach(function(el, i) {
    el.style.transitionDelay = (i * 0.08) + 's';
  });
})();


/* ─────────────────────────────────────────────────────────
   9. WHATSAPP CLICK TRACKING
   ───────────────────────────────────────────────────────── */
(function initWATracking() {
  document.querySelectorAll('a[href*="wa.me"]').forEach(function(link) {
    link.addEventListener('click', function() {
      /*
      if (typeof gtag !== 'undefined') {
        gtag('event', 'whatsapp_click', {
          event_category: 'conversion',
          event_label: link.getAttribute('aria-label') || document.title
        });
      }
      */
      console.log('[SCS] WhatsApp CTA clicked:', link.getAttribute('aria-label') || link.href);
    });
  });
})();


/* ─────────────────────────────────────────────────────────
   10. SHOP PAGE — filterShop() global
   Used by shop.html AND by category card onclick on index.
   ───────────────────────────────────────────────────────── */
var _shopCurrentFilter = 'all';
var _shopCurrentSearch = '';

function filterShop(category, btn) {
  _shopCurrentFilter = category || 'all';

  /* Update active tab button if provided */
  if (btn) {
    document.querySelectorAll('.filter-tab').forEach(function(t) {
      t.classList.remove('active');
    });
    btn.classList.add('active');
  }

  /* Re-render grid if on shop page */
  if (typeof renderShopGrid === 'function') {
    renderShopGrid(getShopFiltered());
  }
}

function getShopFiltered() {
  if (typeof SCS_PRODUCTS === 'undefined') return [];
  return SCS_PRODUCTS.filter(function(p) {
    var matchCat = _shopCurrentFilter === 'all' ||
                   p.category === _shopCurrentFilter;
    var matchSearch = p.name.toLowerCase().includes(_shopCurrentSearch.toLowerCase()) ||
                      p.desc.toLowerCase().includes(_shopCurrentSearch.toLowerCase()) ||
                      p.category.toLowerCase().includes(_shopCurrentSearch.toLowerCase());
    return matchCat && matchSearch;
  });
}

function searchProducts(val) {
  _shopCurrentSearch = val || '';
  if (typeof renderShopGrid === 'function') {
    renderShopGrid(getShopFiltered());
  }
}

/* Expose shop functions globally */
window.filterShop     = filterShop;
window.searchProducts = searchProducts;

/* Check if arriving from index.html with a category pre-filter */
(function checkSessionFilter() {
  try {
    var cat = sessionStorage.getItem('scs_filter_category');
    if (cat && typeof renderShopGrid === 'function') {
      sessionStorage.removeItem('scs_filter_category');
      filterShop(cat, null);
    }
  } catch(e) {}
})();


/* ─────────────────────────────────────────────────────────
   11. ORDER PRODUCT (used on shop.html order buttons)
   ───────────────────────────────────────────────────────── */
function orderProduct(productId) {
  if (typeof SCS_PRODUCTS === 'undefined') return;
  var product = SCS_PRODUCTS.find(function(p) { return p.id === productId; });
  if (!product) return;

  var msg = 'Hi! I want to order the ' + product.name +
            ' (PKR ' + product.price.toLocaleString() + ')';
  var url = 'https://wa.me/923017658679?text=' + encodeURIComponent(msg);
  window.open(url, '_blank', 'noopener,noreferrer');
}

window.orderProduct = orderProduct;


/* ─────────────────────────────────────────────────────────
   12. DOM READY — run init functions
   ───────────────────────────────────────────────────────── */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', onDOMReady);
} else {
  /* DOM already parsed (script is at bottom of body) */
  onDOMReady();
}

function onDOMReady() {
  initCounters();
  applyProductStagger();

  /* Dynamic copyright year (backup — index.html also sets this) */
  var yearEl = document.getElementById('copyright-year');
  if (yearEl && !yearEl.textContent) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* Mark active nav link on page load based on URL hash */
  var hash = window.location.hash;
  if (hash) {
    var activeLink = document.querySelector('.nav-links a[href="' + hash + '"]');
    if (activeLink) activeLink.classList.add('active');
  }
}
JSEOF
echo "Done. $(wc -l < /mnt/user-data/outputs/app.js) lines"
