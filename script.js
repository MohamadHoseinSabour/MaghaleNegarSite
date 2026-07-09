/* ================================================================
   MAGHALE NEGAR — JavaScript
   - Navbar scroll effect
   - Mobile menu toggle
   - Scroll-based reveal animations (IntersectionObserver)
   - Animated counters
   - Tab switching (use-cases)
   - FAQ accordion keyboard support
   ================================================================ */

'use strict';

// ---- DOM Ready ----
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initReveal();
  initCounters();
  initTabs();
  initFAQ();
  initWorkflowAnimation();
});

// ================================================================
// NAVBAR — scroll effect
// ================================================================
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const onScroll = () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
}

// ================================================================
// MOBILE MENU
// ================================================================
function initMobileMenu() {
  const toggle = document.querySelector('.nav-toggle');
  const menu   = document.getElementById('mobile-menu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const isOpen = !menu.hidden;
    menu.hidden = isOpen;
    toggle.setAttribute('aria-expanded', String(!isOpen));
  });

  // Close menu when a link is clicked
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!menu.hidden && !menu.contains(e.target) && !toggle.contains(e.target)) {
      menu.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}

// ================================================================
// REVEAL ANIMATIONS (IntersectionObserver)
// ================================================================
function initReveal() {
  const elements = document.querySelectorAll(
    '.reveal-up, .reveal-right, .reveal-left'
  );

  if (!elements.length) return;

  // Respect reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    elements.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach(el => observer.observe(el));
}

// ================================================================
// ANIMATED COUNTERS
// ================================================================
function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (!counters.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    counters.forEach(el => {
      el.textContent = toFarsiDigits(el.dataset.target);
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(el => observer.observe(el));
}

function animateCounter(el) {
  const target   = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const start    = performance.now();

  const update = (now) => {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = easeOutQuart(progress);
    const value    = Math.round(eased * target);
    el.textContent = toFarsiDigits(String(value));
    if (progress < 1) requestAnimationFrame(update);
  };

  requestAnimationFrame(update);
}

function easeOutQuart(t) {
  return 1 - Math.pow(1 - t, 4);
}

function toFarsiDigits(str) {
  const map = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
  return String(str).replace(/[0-9]/g, d => map[d]);
}

// ================================================================
// TABS (Use Cases)
// ================================================================
function initTabs() {
  const tabBtns    = document.querySelectorAll('.tab-btn');
  const tabPanels  = document.querySelectorAll('.tab-content');
  if (!tabBtns.length) return;

  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('aria-controls');

      // Update buttons
      tabBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      // Update panels
      tabPanels.forEach(panel => {
        if (panel.id === targetId) {
          panel.classList.remove('hidden');
        } else {
          panel.classList.add('hidden');
        }
      });
    });
  });
}

// ================================================================
// FAQ — keyboard support (Enter/Space on summary)
// ================================================================
function initFAQ() {
  const items = document.querySelectorAll('.faq-item summary');
  items.forEach(summary => {
    summary.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        summary.click();
      }
    });
  });
}

// ================================================================
// WORKFLOW CARD — live progress animation
// ================================================================
function initWorkflowAnimation() {
  const steps = [
    { index: 2, targetWidth: 100, nextIndex: 3 },
    { index: 3, targetWidth: 100, nextIndex: 4 },
    { index: 4, targetWidth: 100, nextIndex: 5 },
    { index: 5, targetWidth: 100, nextIndex: 0 },
  ];

  let stepIdx = 0;
  const agentSteps = document.querySelectorAll('.agent-step');

  function getStep(index) {
    return agentSteps[index] || null;
  }

  function activateStep(index) {
    const step = getStep(index);
    if (!step) return;

    step.classList.remove('pending');
    step.classList.add('running');

    const bar = step.querySelector('.progress-bar');
    if (bar) {
      bar.style.width = '0%';
      bar.classList.remove('progress-anim');
      // Animate to 100%
      requestAnimationFrame(() => {
        setTimeout(() => {
          bar.style.transition = 'width 2.5s ease-in-out';
          bar.style.width = '100%';
        }, 50);
      });
    }
  }

  function completeStep(index) {
    const step = getStep(index);
    if (!step) return;

    step.classList.remove('running');
    step.classList.add('active');

    // Add done badge
    let badge = step.querySelector('.agent-badge');
    if (!badge) {
      badge = document.createElement('span');
      badge.className = 'agent-badge done';
      step.appendChild(badge);
    }
    badge.classList.remove('running');
    badge.classList.add('done');
    badge.textContent = '✓';
  }

  function resetAll() {
    agentSteps.forEach((step, i) => {
      if (i < 2) return; // keep first two done
      step.classList.remove('active', 'running');
      step.classList.add('pending');
      const badge = step.querySelector('.agent-badge');
      if (badge) badge.remove();
      const bar = step.querySelector('.progress-bar');
      if (bar) { bar.style.transition = 'none'; bar.style.width = '0%'; }
    });
  }

  function runCycle() {
    resetAll();
    stepIdx = 0;

    function next() {
      if (stepIdx >= steps.length) {
        // Wait 3s then restart
        setTimeout(runCycle, 3000);
        return;
      }

      const { index, nextIndex } = steps[stepIdx];
      stepIdx++;

      activateStep(index);

      setTimeout(() => {
        completeStep(index);
        setTimeout(next, 400);
      }, 2800);
    }

    setTimeout(next, 1000);
  }

  if (agentSteps.length >= 6) {
    setTimeout(runCycle, 1500);
  }
}

// ================================================================
// Smooth scroll for anchor links (polyfill for older browsers)
// ================================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href').slice(1);
    if (!targetId) return;
    const target = document.getElementById(targetId);
    if (target) {
      e.preventDefault();
      const navHeight = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--nav-height') || '70',
        10
      );
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});
