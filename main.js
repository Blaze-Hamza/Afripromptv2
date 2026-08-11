// main.js — AfriPrompt Studio

document.addEventListener('DOMContentLoaded', () => {

  // ── CUSTOM CURSOR ──
  const cursor = document.getElementById('cursor');
  let cx = window.innerWidth / 2;
  let cy = window.innerHeight / 2;

  window.addEventListener('mousemove', e => {
    cx = e.clientX;
    cy = e.clientY;
  }, { passive: true });

  // Smooth cursor follow
  (function loop() {
    if (cursor) {
      cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%,-50%)`;
    }
    requestAnimationFrame(loop);
  })();

  // Grow on interactive elements
  const interactives = document.querySelectorAll('a, button');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('grow-link'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('grow-link'));
  });

  // Invert cursor to light on dark sections
  const darkSections = document.querySelectorAll('.cta-section');
  darkSections.forEach(section => {
    section.addEventListener('mouseenter', () => {
      cursor.classList.remove('grow-link');
      cursor.classList.add('light');
    });
    section.addEventListener('mouseleave', () => {
      cursor.classList.remove('light');
    });
    // Also handle interactive elements inside dark sections
    section.querySelectorAll('a, button').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.remove('grow-link');
        cursor.classList.add('light');
        cursor.style.width = '44px';
        cursor.style.height = '44px';
      });
      el.addEventListener('mouseleave', () => {
        cursor.style.width = '';
        cursor.style.height = '';
      });
    });
  });

  // ── STICKY NAV ──
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('pinned', window.scrollY > 80);
  }, { passive: true });

  // ── MOBILE WORK EXPANSION ──
  workItems = document.querySelectorAll('.work-item');
  workItems.forEach(item => {
    item.addEventListener('click', (e) => {
      if (window.innerWidth <= 768 && item.getAttribute('href')) {
        if (!item.classList.contains('expanded')) {
          e.preventDefault(); // Stop navigation on first tap
          // Collapse others
          workItems.forEach(other => other.classList.remove('expanded'));
          // Expand this one
          item.classList.add('expanded');
        }
      }
    });
  });

  // ── FAB ──
  const fab = document.getElementById('fab');
  const fabCall = document.getElementById('fab-call');
  window.addEventListener('scroll', () => {
    const show = window.scrollY > window.innerHeight * 0.6;
    if (fab) fab.classList.toggle('show', show);
    if (fabCall) fabCall.classList.toggle('show', show);
  }, { passive: true });

  // ── INTERSECTION OBSERVER ──
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll(
    '.fade-up, .service-cell, .metric-item, .process-row'
  ).forEach((el, i) => {
    // Stagger by index within parent
    if (!el.style.transitionDelay) {
      el.style.transitionDelay = (i % 6) * 80 + 'ms';
    }
    io.observe(el);
  });

  // ── ANIMATED COUNTERS ──
  const counts = document.querySelectorAll('.count');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const to = parseInt(el.dataset.to, 10);
      const duration = 1600;
      const start = performance.now();
      function tick(now) {
        const t = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.floor(ease * to);
        if (t < 1) requestAnimationFrame(tick);
        else el.textContent = to;
      }
      requestAnimationFrame(tick);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });

  counts.forEach(el => counterObserver.observe(el));

  // ── HERO ANIMATION (GSAP if available) ──
  window.addEventListener('load', () => {
    if (typeof gsap === 'undefined') return;
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from('.hero-location',   { y: 20, opacity: 0, duration: .8, delay: .1 })
      .from('.hero-top-right p',{ y: 20, opacity: 0, duration: .8 }, '-=.5')
      .from('#hero-title',      { y: 60, opacity: 0, duration: 1.2 }, '-=.5')
      .from('.hero-bottom',     { y: 30, opacity: 0, duration: .8 }, '-=.7');
  });

  // ── WORK ITEM REVEALS ──
  const workItemRevealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'none';
        workItemRevealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  workItems.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity .6s cubic-bezier(.16,1,.3,1) ${i * 100}ms, transform .6s cubic-bezier(.16,1,.3,1) ${i * 100}ms`;
    workItemRevealObserver.observe(el);
  });

  // ── SMOOTH SCROLL ──
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});
