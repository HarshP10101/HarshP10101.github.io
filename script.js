(() => {
  const root = document.documentElement;
  const body = document.body;
  const header = document.querySelector('[data-header]');
  const menuButton = document.querySelector('.menu-toggle');
  const primaryNav = document.querySelector('#primary-nav');
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const mobileViewport = window.matchMedia('(max-width: 840px)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const pageRegions = [document.querySelector('main'), document.querySelector('footer')].filter(Boolean);

  const closeMenu = ({ restoreFocus = false } = {}) => {
    if (!header || !menuButton) return;
    header.classList.remove('menu-open');
    body.classList.remove('menu-open');
    menuButton.setAttribute('aria-expanded', 'false');
    const label = menuButton.querySelector('.menu-label');
    if (label) label.textContent = 'Menu';
    pageRegions.forEach(region => { region.inert = false; });
    if (restoreFocus) menuButton.focus();
  };

  if (header && menuButton && primaryNav) {
    root.classList.add('nav-ready');
    menuButton.addEventListener('click', () => {
      const open = !header.classList.contains('menu-open');
      header.classList.toggle('menu-open', open);
      body.classList.toggle('menu-open', open);
      menuButton.setAttribute('aria-expanded', String(open));
      const label = menuButton.querySelector('.menu-label');
      if (label) label.textContent = open ? 'Close' : 'Menu';
      pageRegions.forEach(region => { region.inert = open; });
      if (open) primaryNav.querySelector('a')?.focus();
    });

    primaryNav.addEventListener('click', event => {
      if (event.target.closest('a')) closeMenu();
    });

    document.addEventListener('keydown', event => {
      if (!header.classList.contains('menu-open')) return;
      if (event.key === 'Escape') {
        closeMenu({ restoreFocus: true });
        return;
      }
      if (event.key !== 'Tab') return;
      const links = [...primaryNav.querySelectorAll('a')];
      const first = links[0];
      const last = links[links.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        menuButton.focus();
      } else if (!event.shiftKey && document.activeElement === menuButton) {
        event.preventDefault();
        first?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        menuButton.focus();
      }
    });

    mobileViewport.addEventListener('change', event => {
      if (!event.matches) closeMenu();
    });
  }

  const revealItems = [...document.querySelectorAll('[data-reveal]')];
  let revealObserver;

  const showAll = () => {
    revealObserver?.disconnect();
    revealItems.forEach(item => item.classList.add('is-visible'));
  };

  const setUpReveals = () => {
    if (motionPreference.matches || !('IntersectionObserver' in window)) {
      showAll();
      return;
    }
    revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -7% 0px' });
    revealItems.forEach((item, index) => {
      item.style.setProperty('--reveal-order', String(index));
      revealObserver.observe(item);
    });
  };

  setUpReveals();
  motionPreference.addEventListener('change', event => {
    if (event.matches) showAll();
  });

  const tiltTarget = document.querySelector('[data-tilt]');
  if (tiltTarget) {
    let tiltFrame = 0;
    let lastPointer = null;

    const resetTilt = () => {
      if (tiltFrame) cancelAnimationFrame(tiltFrame);
      tiltFrame = 0;
      lastPointer = null;
      tiltTarget.classList.remove('is-tracking');
      ['--tilt-x', '--tilt-y', '--tilt-rx', '--tilt-ry'].forEach(property => tiltTarget.style.removeProperty(property));
    };

    tiltTarget.addEventListener('pointermove', event => {
      if (!finePointer.matches || motionPreference.matches || event.pointerType === 'touch') return;
      lastPointer = { x: event.clientX, y: event.clientY };
      if (tiltFrame) return;
      tiltFrame = requestAnimationFrame(() => {
        tiltFrame = 0;
        if (!lastPointer) return;
        const rect = tiltTarget.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        const x = Math.max(0, Math.min(1, (lastPointer.x - rect.left) / rect.width));
        const y = Math.max(0, Math.min(1, (lastPointer.y - rect.top) / rect.height));
        tiltTarget.classList.add('is-tracking');
        tiltTarget.style.setProperty('--tilt-x', `${((x - .5) * 8).toFixed(2)}px`);
        tiltTarget.style.setProperty('--tilt-y', `${((y - .5) * 6).toFixed(2)}px`);
        tiltTarget.style.setProperty('--tilt-rx', `${((.5 - y) * 3).toFixed(2)}deg`);
        tiltTarget.style.setProperty('--tilt-ry', `${((x - .5) * 3).toFixed(2)}deg`);
      });
    }, { passive: true });
    tiltTarget.addEventListener('pointerleave', resetTilt);
    finePointer.addEventListener('change', resetTilt);
    motionPreference.addEventListener('change', resetTilt);
    window.addEventListener('blur', resetTilt);
  }

  const progressBar = document.querySelector('.reading-progress');
  const timeline = document.querySelector('.experience-timeline');
  const navLinks = [...document.querySelectorAll('.primary-nav a[href^="#"]')];
  const navSections = navLinks.map(link => document.querySelector(link.getAttribute('href')));
  let scrollFrame = 0;

  const updateScrollState = () => {
    scrollFrame = 0;
    const maximum = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const progress = Math.max(0, Math.min(1, window.scrollY / maximum));
    progressBar?.style.setProperty('--progress', progress.toFixed(4));
    header?.classList.toggle('is-scrolled', window.scrollY > 12);

    if (timeline) {
      const rect = timeline.getBoundingClientRect();
      const travel = Math.max(1, rect.height + window.innerHeight * .55);
      const amount = Math.max(0, Math.min(1, (window.innerHeight * .72 - rect.top) / travel));
      timeline.style.setProperty('--timeline-progress', motionPreference.matches ? '1' : amount.toFixed(4));
    }

    let current = -1;
    navSections.forEach((section, index) => {
      if (section && section.getBoundingClientRect().top <= window.innerHeight * .34) current = index;
    });
    navLinks.forEach((link, index) => {
      if (index === current) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  };

  const requestScrollUpdate = () => {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScrollState);
  };
  window.addEventListener('scroll', requestScrollUpdate, { passive: true });
  window.addEventListener('resize', requestScrollUpdate, { passive: true });
  updateScrollState();
})();
