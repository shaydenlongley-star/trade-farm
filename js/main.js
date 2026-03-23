/* ============================================
   TRADE & FARM — Premium Interactions
   ============================================ */
(function () {
  'use strict';

  /* PREVENT SCROLL RESTORE ON REFRESH */
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);

  /* SCROLL PROGRESS BAR */
  const prog = document.createElement('div');
  prog.className = 'scroll-progress';
  document.body.prepend(prog);
  window.addEventListener('scroll', () => {
    const s = document.documentElement;
    prog.style.width = ((window.scrollY / (s.scrollHeight - s.clientHeight)) * 100) + '%';
  }, { passive: true });

  /* PRELOADER */
  const preloader = document.querySelector('.preloader');
  if (preloader) {
    window.addEventListener('load', () => setTimeout(() => preloader.classList.add('done'), 1400));
  }

  /* NAVBAR */
  const navbar = document.getElementById('navbar');
  const toggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  if (navbar) {
    window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 40), { passive: true });
  }
  function lockScroll() {
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';
  }
  function unlockScroll() {
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    document.body.style.touchAction = '';
  }
  if (toggle && navMenu) {
    toggle.addEventListener('click', () => {
      const open = navMenu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
      open ? lockScroll() : unlockScroll();
    });
    document.addEventListener('click', e => {
      if (navbar && !navbar.contains(e.target) && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open'); unlockScroll();
      }
    });
    navMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      navMenu.classList.remove('open'); unlockScroll();
    }));
  }

  /* ACTIVE NAV */
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-menu a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) a.classList.add('active');
    else a.classList.remove('active');
  });

  /* HERO PARALLAX */
  const heroContent = document.querySelector('.hero-content');
  const heroBg = document.querySelector('.hero-photo');
  if (heroContent) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      heroContent.style.transform = `translateY(${y * 0.18}px)`;
      heroContent.style.opacity = String(Math.max(0, 1 - y / 560));
      if (heroBg) heroBg.style.transform = `translateY(${y * 0.3}px)`;
    }, { passive: true });
  }

  /* SCROLL REVEAL */
  const revealEls = document.querySelectorAll('[data-reveal]');
  if (revealEls.length) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); obs.unobserve(e.target); } });
    }, { threshold: 0.1, rootMargin: '0px 0px -48px 0px' });
    revealEls.forEach(el => obs.observe(el));
  }

  /* WORD STAGGER REVEAL */
  document.querySelectorAll('.stagger-words').forEach(el => {
    const words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words.map((w, i) => `<span class="w" style="transition-delay:${i * 0.07}s">${w}</span>`).join(' ');
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); obs.unobserve(e.target); } });
    }, { threshold: 0.2 });
    obs.observe(el);
  });

  /* COUNTER ANIMATION */
  function animCounter(el, end, suffix, dur) {
    const t0 = performance.now();
    (function step(now) {
      const p = Math.min((now - t0) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(end * e) + suffix;
      if (p < 1) requestAnimationFrame(step);
    })(t0);
  }
  const statNums = document.querySelectorAll('.stat-number');
  if (statNums.length) {
    const co = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const el = e.target; const raw = el.textContent.trim(); const m = raw.match(/^(\d+(\.\d+)?)(.*)$/);
          if (m) animCounter(el, parseFloat(m[1]), m[3], 1600);
          co.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    statNums.forEach(el => co.observe(el));
  }

  /* CARD 3D TILT */
  document.querySelectorAll('.service-card, .feature-card, .why-card, .store-card, .news-card').forEach(card => {
    card.classList.add('tiltable');
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      card.style.transform = `perspective(800px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg) translateY(-4px)`;
      card.style.boxShadow = `${-x * 10}px ${-y * 10}px 28px rgba(209,25,36,0.15)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.boxShadow = '';
    });
  });

  /* MAGNETIC BUTTONS */
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      btn.style.transform = `translate(${(e.clientX - r.left - r.width/2) * 0.1}px, ${(e.clientY - r.top - r.height/2) * 0.1}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });

  /* SECTION DOT NAV */
  const sections = document.querySelectorAll('section[id]');
  if (sections.length > 1) {
    const dotNav = document.createElement('nav');
    dotNav.className = 'dot-nav';
    dotNav.setAttribute('aria-label', 'Page sections');
    sections.forEach((sec, i) => {
      const dot = document.createElement('button');
      dot.className = 'dot-nav-dot';
      const label = sec.getAttribute('data-nav-label') || sec.querySelector('h1,h2')?.textContent?.trim().slice(0, 28) || `Section ${i+1}`;
      dot.setAttribute('data-label', label);
      dot.setAttribute('aria-label', `Go to: ${label}`);
      dot.addEventListener('click', () => window.scrollTo({ top: sec.offsetTop - 80, behavior: 'smooth' }));
      dotNav.appendChild(dot);
    });
    document.body.appendChild(dotNav);
    const dots = dotNav.querySelectorAll('.dot-nav-dot');
    const secObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const idx = Array.from(sections).indexOf(e.target);
          dots.forEach((d, i) => d.classList.toggle('active', i === idx));
        }
      });
    }, { threshold: 0.4 });
    sections.forEach(s => secObs.observe(s));
  }

  /* IMAGE LIGHTBOX */
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.innerHTML = `
    <button class="lightbox-close" aria-label="Close">&#x2715;</button>
    <button class="lightbox-prev" aria-label="Previous">&#8592;</button>
    <img class="lightbox-img" src="" alt="">
    <button class="lightbox-next" aria-label="Next">&#8594;</button>
    <span class="lightbox-caption"></span>`;
  document.body.appendChild(lightbox);
  const lbImg = lightbox.querySelector('.lightbox-img');
  const lbCap = lightbox.querySelector('.lightbox-caption');
  let gallery = [], gIdx = 0;
  function openLightbox(imgs, idx) {
    gallery = imgs; gIdx = idx;
    lbImg.src = gallery[gIdx].src;
    lbCap.textContent = `${gIdx + 1} / ${gallery.length}`;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() { lightbox.classList.remove('open'); document.body.style.overflow = ''; }
  lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
  lightbox.querySelector('.lightbox-prev').addEventListener('click', () => {
    gIdx = (gIdx - 1 + gallery.length) % gallery.length;
    lbImg.src = gallery[gIdx].src;
    lbCap.textContent = `${gIdx + 1} / ${gallery.length}`;
  });
  lightbox.querySelector('.lightbox-next').addEventListener('click', () => {
    gIdx = (gIdx + 1) % gallery.length;
    lbImg.src = gallery[gIdx].src;
    lbCap.textContent = `${gIdx + 1} / ${gallery.length}`;
  });
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft')  lightbox.querySelector('.lightbox-prev').click();
    if (e.key === 'ArrowRight') lightbox.querySelector('.lightbox-next').click();
  });
  document.querySelectorAll('.photo-grid').forEach(grid => {
    const imgs = Array.from(grid.querySelectorAll('img'));
    imgs.forEach((img, i) => img.addEventListener('click', () => openLightbox(imgs, i)));
  });

  /* SMOOTH SCROLL */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if (t) { e.preventDefault(); window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 88, behavior: 'smooth' }); }
    });
  });

  /* PAGE TRANSITIONS */
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('http')) return;
    link.addEventListener('click', e => {
      e.preventDefault(); document.body.classList.add('page-exit');
      setTimeout(() => { window.location.href = href; }, 320);
    });
  });

  /* BACK TO TOP */
  const btt = document.querySelector('.back-to-top');
  if (btt) {
    window.addEventListener('scroll', () => btt.classList.toggle('visible', window.scrollY > 400), { passive: true });
    btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* CONTACT FORM */
  const form = document.getElementById('contactForm');
  const succ = document.getElementById('formSuccess');
  if (form && succ) {
    form.addEventListener('submit', e => { e.preventDefault(); form.style.display = 'none'; succ.style.display = 'block'; if (window.renderIcons) window.renderIcons(); });
  }

  /* CATEGORY HOVER */
  document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.querySelector('img')?.classList.add('hovered');
    });
    card.addEventListener('mouseleave', () => {
      card.querySelector('img')?.classList.remove('hovered');
    });
  });

})();
