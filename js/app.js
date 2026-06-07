// ============================================================
//  SUCCESS CHASER STARS — Main App
//  app.js — Navigation, scroll, counters, newsletter
// ============================================================

/* ── NAVIGATION ── */

function toggleMenu() {
  const links = document.getElementById('navLinks');
  if (links) links.classList.toggle('open');
}

// Close mobile menu on link click
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      const links = document.getElementById('navLinks');
      if (links) links.classList.remove('open');
    });
  });
});

// Nav shadow on scroll
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (nav) {
    nav.style.boxShadow = window.scrollY > 60
      ? '0 4px 30px rgba(183,110,121,0.08)'
      : 'none';
  }
});


/* ── SCROLL REVEAL ── */

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

// Expose globally so products.js can use it
window.revealObserver = revealObserver;

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
});


/* ── ANIMATED COUNTERS ── */

function animateCounter(counterEl) {
  const target = parseInt(counterEl.getAttribute('data-target'));
  const suffix = target >= 1000 ? '+' : '';
  let count = 0;
  const step = Math.max(1, Math.ceil(target / 80));

  const timer = setInterval(() => {
    count = Math.min(count + step, target);

    if (count >= 1000) {
      counterEl.textContent = (count / 1000).toFixed(count < 10000 ? 1 : 0) + 'K' + suffix;
    } else {
      counterEl.textContent = count + suffix;
    }

    if (count >= target) clearInterval(timer);
  }, 20);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('[data-target]').forEach(animateCounter);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

document.addEventListener('DOMContentLoaded', () => {
  const section = document.querySelector('.counters-section');
  if (section) counterObserver.observe(section);
});


/* ── NEWSLETTER SUBSCRIPTION ── */

function subscribeNewsletter() {
  const input = document.querySelector('.newsletter-row input');
  if (!input) return;

  if (input.value && input.value.includes('@')) {
    // In production: POST to your email service (Mailchimp, etc.)
    console.log('New subscriber:', input.value);
    input.value = '';
    input.placeholder = '✓ Subscribed! Thank you for joining SCS ✨';
    setTimeout(() => {
      input.placeholder = 'Enter your email for beauty tips...';
    }, 4000);
  } else {
    input.style.outline = '2px solid var(--rose-gold)';
    input.placeholder = 'Please enter a valid email';
    setTimeout(() => {
      input.style.outline = '';
      input.placeholder = 'Enter your email for beauty tips...';
    }, 2500);
  }
}

// Allow Enter key in newsletter input
document.addEventListener('DOMContentLoaded', () => {
  const input = document.querySelector('.newsletter-row input');
  if (input) {
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') subscribeNewsletter();
    });
  }
});


/* ── STAGGER REVEAL DELAYS ── */

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.benefits-grid .benefit-item').forEach((item, i) => {
    item.style.transitionDelay = (i * 0.07) + 's';
  });

  document.querySelectorAll('.opp-cards .opp-card').forEach((card, i) => {
    card.style.transitionDelay = (i * 0.08) + 's';
  });

  document.querySelectorAll('.testimonials-grid .testimonial-card').forEach((card, i) => {
    card.style.transitionDelay = (i * 0.09) + 's';
  });
});


/* ── SMOOTH ANCHOR SCROLLING ── */

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});


/* ── ACTIVE NAV LINK HIGHLIGHT ── */

document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('section[id], div[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + entry.target.id) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(section => sectionObserver.observe(section));
});
