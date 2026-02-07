/* ============================================================
   Mahmoud S. Y. Abujadallah — Professional Portfolio JS
   Subtle role typing · Scroll nav · Reveals
   ============================================================ */

(function () {
  'use strict';

  // ==========================================================
  // 1. ROLE TYPING — Professional rotating titles
  // ==========================================================
  const roleEl = document.getElementById('roleText');
  if (roleEl) {
    const roles = [
      'PhD Student — ÉTS Montreal',
      'AI for Software Engineering',
      'Agentic AI Researcher',
      'Large Language Models',
      'Data Science & NLP',
    ];
    let idx = 0, charIdx = 0, deleting = false, speed = 70;

    function type() {
      const current = roles[idx];
      if (deleting) {
        roleEl.textContent = current.substring(0, charIdx - 1);
        charIdx--;
        speed = 35;
      } else {
        roleEl.textContent = current.substring(0, charIdx + 1);
        charIdx++;
        speed = 75;
      }

      if (!deleting && charIdx === current.length) {
        speed = 2800;
        deleting = true;
      } else if (deleting && charIdx === 0) {
        deleting = false;
        idx = (idx + 1) % roles.length;
        speed = 500;
      }

      setTimeout(type, speed);
    }
    setTimeout(type, 800);
  }

  // ==========================================================
  // 2. NAVIGATION — Scroll styling + active state
  // ==========================================================
  const navWrap = document.getElementById('navWrap');
  if (navWrap) {
    window.addEventListener('scroll', () => {
      navWrap.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  // Active link tracking
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav__links a, .drawer a');

  if (sections.length && navAnchors.length) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navAnchors.forEach((a) => {
            const section = a.getAttribute('data-section') || a.getAttribute('href')?.replace('#', '');
            a.classList.toggle('active', section === id);
          });
        }
      });
    }, { rootMargin: '-25% 0px -55% 0px' });
    sections.forEach((s) => obs.observe(s));
  }

  // Burger menu
  const burger = document.getElementById('burger');
  const drawer = document.getElementById('drawer');
  if (burger && drawer) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('open');
      drawer.classList.toggle('open');
      document.body.style.overflow = drawer.classList.contains('open') ? 'hidden' : '';
    });
    drawer.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        burger.classList.remove('open');
        drawer.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.length > 1) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          history.pushState(null, '', href);
        }
      }
    });
  });

  // ==========================================================
  // 3. SCROLL REVEAL — Fade-up on intersection
  // ==========================================================
  const revealEls = document.querySelectorAll('[data-reveal]');
  if (revealEls.length) {
    let delay = 0;
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Stagger siblings slightly
          entry.target.style.transitionDelay = '0.08s';
          entry.target.classList.add('revealed');
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    revealEls.forEach((el) => revealObs.observe(el));
  }

})();
