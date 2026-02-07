/* ============================================================
   Mahmoud Abujadallah — Portfolio JS
   Neural constellation particles + morph text + scroll reveals
   ============================================================ */

(function () {
  'use strict';

  // ==========================================================
  // 1. NEURAL CONSTELLATION — Canvas particle system
  // ==========================================================
  const canvas = document.getElementById('constellation');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let w, h, particles, mouse;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }

    mouse = { x: w / 2, y: h / 2 };

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.radius = Math.random() * 1.8 + 0.5;
        this.opacity = Math.random() * 0.5 + 0.15;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > w) this.vx *= -1;
        if (this.y < 0 || this.y > h) this.vy *= -1;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(124,92,252,${this.opacity})`;
        ctx.fill();
      }
    }

    function init() {
      resize();
      const count = Math.min(Math.floor((w * h) / 12000), 120);
      particles = Array.from({ length: count }, () => new Particle());
    }

    function drawConnections() {
      const maxDist = 140;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.15;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(124,92,252,${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
        // Mouse connection
        const dmx = particles[i].x - mouse.x;
        const dmy = particles[i].y - mouse.y;
        const mouseDist = Math.sqrt(dmx * dmx + dmy * dmy);
        if (mouseDist < 200) {
          const alpha = (1 - mouseDist / 200) * 0.25;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(0,229,199,${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, w, h);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      drawConnections();
      requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => {
      resize();
      // Re-clamp out-of-bounds particles
      particles.forEach((p) => {
        if (p.x > w) p.x = w;
        if (p.y > h) p.y = h;
      });
    });

    document.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    init();
    animate();
  }

  // ==========================================================
  // 2. MORPHING TEXT — Typing + deleting effect
  // ==========================================================
  const morphEl = document.getElementById('morphText');
  if (morphEl) {
    const phrases = [
      'PhD Student @ ÉTS Montreal',
      'AI for Software Engineering',
      'Agentic AI Researcher',
      'LLM Specialist',
      'Data Scientist',
      'Prompt Engineer',
      'University Lecturer',
      'Open Source Contributor',
    ];
    let phraseIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let speed = 80;

    function type() {
      const current = phrases[phraseIdx];
      if (isDeleting) {
        morphEl.textContent = current.substring(0, charIdx - 1);
        charIdx--;
        speed = 40;
      } else {
        morphEl.textContent = current.substring(0, charIdx + 1);
        charIdx++;
        speed = 90;
      }

      if (!isDeleting && charIdx === current.length) {
        speed = 2200; // pause at end
        isDeleting = true;
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        speed = 400; // pause before next word
      }

      setTimeout(type, speed);
    }

    setTimeout(type, 600);
  }

  // ==========================================================
  // 3. NAV — Scroll style + active section + burger
  // ==========================================================
  const glassNav = document.getElementById('glassNav');
  const burger = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobileMenu');

  // Scroll class
  if (glassNav) {
    window.addEventListener('scroll', () => {
      glassNav.classList.toggle('scrolled', window.scrollY > 60);
    });
  }

  // Active nav link
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll(
    '.glass-nav__links a, .mobile-menu a'
  );

  if (sections.length && navAnchors.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navAnchors.forEach((a) => {
              a.classList.toggle(
                'active',
                a.getAttribute('data-section') === id
              );
            });
          }
        });
      },
      { rootMargin: '-30% 0px -55% 0px' }
    );
    sections.forEach((s) => observer.observe(s));
  }

  // Burger toggle
  if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open')
        ? 'hidden'
        : '';
    });
    // Close on link click
    mobileMenu.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        burger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // Smooth scroll for all in-page links
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
  // 4. SCROLL REVEAL — Animate elements on scroll
  // ==========================================================
  const revealEls = document.querySelectorAll('[data-reveal]');
  if (revealEls.length) {
    const revealObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach((el) => revealObs.observe(el));
  }
})();
