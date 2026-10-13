(() => {
  const root = document.documentElement;
  const body = document.body;
  const header = document.querySelector('[data-header]');
  const menuButton = document.querySelector('.menu-toggle');
  const primaryNav = document.querySelector('#primary-nav');
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const mobileViewport = window.matchMedia('(max-width: 840px)');
  const pageRegions = [document.querySelector('main'), document.querySelector('footer')].filter(Boolean);

  // A short entrance lets the original artwork and headline settle into place.
  const hero = document.querySelector('.hero');
  const heroArt = document.querySelector('.hero-art');
  if (hero && heroArt) {
    const playHero = () => {
      if (motionPreference.matches) return;
      hero.classList.remove('hero-motion');
      void hero.offsetWidth;
      hero.classList.add('hero-motion');
    };
    if (heroArt.complete) requestAnimationFrame(playHero);
    else heroArt.addEventListener('load', () => requestAnimationFrame(playHero), { once: true });
    motionPreference.addEventListener('change', () => {
      if (motionPreference.matches) hero.classList.remove('hero-motion');
      else playHero();
    });
  }

  // Explore the existing image. No timers, automatic cycling or scroll capture.
  const heroArtwork = document.querySelector('.hero-artwork');
  if (hero && heroArtwork) {
    const plate = heroArtwork.querySelector('.hero-plate');
    const controls = heroArtwork.querySelector('.hero-stage-controls');
    const labels = heroArtwork.querySelector('.hero-stage-labels');
    const note = heroArtwork.querySelector('.hero-explore-note');
    const buttons = [...heroArtwork.querySelectorAll('[data-hero-stage]')];
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const descriptions = {
      research: 'Ask better questions. Look closer at the evidence.',
      analytics: 'Find the pattern. Turn information into a point of view.',
      engineering: 'Connect the pieces. Build systems people can trust.',
    };
    const stages = Object.keys(descriptions);
    const defaultNote = 'Hover or tap a discipline to explore.';
    let selected = null;
    let displayed = null;
    let pointerFrame = 0;
    let pointerPosition = null;

    if (plate && controls && labels && note && buttons.length === stages.length) {
      controls.hidden = false;
      note.hidden = false;
      labels.hidden = true;

      const sendSignal = () => {
        if (motionPreference.matches) return;
        hero.classList.add('hero-explored');
        hero.classList.remove('hero-linked');
        void plate.offsetWidth;
        hero.classList.add('hero-linked');
      };
      const showStage = (stage) => {
        if (displayed === stage) return;
        displayed = stage;
        hero.dataset.heroFocus = stage || '';
        note.textContent = descriptions[stage] || defaultNote;
        buttons.forEach(button => button.classList.toggle('is-preview', button.dataset.heroStage === stage));
        if (stage) sendSignal();
      };
      const updateSelection = () => {
        buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.heroStage === selected)));
      };
      const resetDepth = () => {
        if (pointerFrame) cancelAnimationFrame(pointerFrame);
        pointerFrame = 0;
        pointerPosition = null;
        hero.classList.remove('hero-tracking');
        ['--hero-x', '--hero-y', '--hero-rx', '--hero-ry'].forEach(name => plate.style.removeProperty(name));
      };
      const restoreStage = () => {
        const focused = buttons.find(button => button === document.activeElement);
        showStage(focused ? focused.dataset.heroStage : selected);
      };

      buttons.forEach(button => {
        const stage = button.dataset.heroStage;
        button.addEventListener('pointerenter', event => {
          if (event.pointerType !== 'touch' && finePointer.matches) showStage(stage);
        });
        button.addEventListener('focus', () => showStage(stage));
        button.addEventListener('click', () => {
          selected = selected === stage ? null : stage;
          updateSelection();
          showStage(selected);
        });
      });
      controls.addEventListener('pointerleave', restoreStage);
      heroArtwork.addEventListener('focusout', event => {
        if (!controls.contains(event.relatedTarget)) showStage(selected);
      });
      heroArtwork.addEventListener('keydown', event => {
        if (event.key !== 'Escape') return;
        selected = null;
        updateSelection();
        showStage(null);
        resetDepth();
        hero.classList.remove('hero-linked');
      });
      plate.addEventListener('pointermove', event => {
        if (event.pointerType === 'touch' || !finePointer.matches) return;
        pointerPosition = { x: event.clientX, y: event.clientY };
        if (pointerFrame) return;
        pointerFrame = requestAnimationFrame(() => {
          pointerFrame = 0;
          if (!pointerPosition || document.hidden) return;
          const bounds = plate.getBoundingClientRect();
          if (!bounds.width || !bounds.height) return;
          const x = Math.max(0, Math.min(1, (pointerPosition.x - bounds.left) / bounds.width));
          const y = Math.max(0, Math.min(1, (pointerPosition.y - bounds.top) / bounds.height));
          showStage(stages[Math.min(2, Math.floor(x * 3))]);
          if (motionPreference.matches) return;
          hero.classList.add('hero-tracking');
          plate.style.setProperty('--hero-x', `${((x - .5) * 8).toFixed(2)}px`);
          plate.style.setProperty('--hero-y', `${((y - .5) * 6).toFixed(2)}px`);
          plate.style.setProperty('--hero-rx', `${((.5 - y) * 4).toFixed(2)}deg`);
          plate.style.setProperty('--hero-ry', `${((x - .5) * 4).toFixed(2)}deg`);
        });
      }, { passive: true });
      plate.addEventListener('pointerleave', () => { resetDepth(); restoreStage(); });
      heroArtwork.addEventListener('animationend', event => {
        if (event.animationName === 'signal-interact') hero.classList.remove('hero-linked');
      });
      const stopMotion = () => {
        resetDepth();
        hero.classList.remove('hero-linked');
      };
      motionPreference.addEventListener('change', stopMotion);
      finePointer.addEventListener('change', stopMotion);
      window.addEventListener('blur', stopMotion);
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) stopMotion();
      });
    }
  }

  // All disciplines remain readable without JavaScript; enhance them into tabs.
  const capabilities = document.querySelector('[data-capabilities]');
  if (capabilities) {
    const tabs = [...capabilities.querySelectorAll('[role="tab"]')];
    const panels = [...capabilities.querySelectorAll('[role="tabpanel"]')];
    const activate = (index, focus = false) => {
      tabs.forEach((tab, position) => {
        tab.setAttribute('aria-selected', String(position === index));
        tab.tabIndex = position === index ? 0 : -1;
      });
      panels.forEach((panel, position) => {
        panel.hidden = position !== index;
        panel.classList.toggle('is-active', position === index);
      });
      if (focus) tabs[index].focus();
    };
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => activate(index));
      tab.addEventListener('keydown', (event) => {
        let next = index;
        if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (index + 1) % tabs.length;
        else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
        else if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = tabs.length - 1;
        else return;
        event.preventDefault();
        activate(next, true);
      });
    });
    if (tabs.length && tabs.length === panels.length) {
      capabilities.classList.add('capabilities-ready');
      activate(0);
    }
  }

  const closeMenu = () => {
    if (!header || !menuButton) return;
    header.classList.remove('menu-open');
    body.classList.remove('menu-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.querySelector('.menu-label').textContent = 'Menu';
    pageRegions.forEach((region) => { region.inert = false; });
  };

  if (header && menuButton && primaryNav) {
    root.classList.add('nav-ready');
    menuButton.addEventListener('click', () => {
      const willOpen = !header.classList.contains('menu-open');
      header.classList.toggle('menu-open', willOpen);
      body.classList.toggle('menu-open', willOpen);
      menuButton.setAttribute('aria-expanded', String(willOpen));
      menuButton.querySelector('.menu-label').textContent = willOpen ? 'Close' : 'Menu';
      pageRegions.forEach((region) => { region.inert = willOpen; });
    });

    primaryNav.addEventListener('click', (event) => {
      if (event.target.closest('a')) closeMenu();
    });

    document.addEventListener('keydown', (event) => {
      if (!header.classList.contains('menu-open')) return;
      if (event.key === 'Escape') {
        closeMenu();
        menuButton.focus();
      }
      if (event.key === 'Tab') {
        const links = [...primaryNav.querySelectorAll('a')];
        const lastLink = links[links.length - 1];
        if (event.shiftKey && document.activeElement === menuButton) {
          event.preventDefault();
          lastLink.focus();
        } else if (!event.shiftKey && document.activeElement === lastLink) {
          event.preventDefault();
          menuButton.focus();
        }
      }
    });

    mobileViewport.addEventListener('change', (event) => {
      if (!event.matches) closeMenu();
    });

    const updateHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 18);
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
  }

  const revealItems = document.querySelectorAll('.reveal');

  document.querySelectorAll('.experience-row').forEach((item, index) => {
    item.style.setProperty('--reveal-delay', `${Math.min(index * 70, 210)}ms`);
  });

  let revealObserver;
  const showAll = () => {
    revealObserver?.disconnect();
    root.classList.remove('motion-ready');
    revealItems.forEach((item) => item.classList.add('is-visible'));
  };

  if (motionPreference.matches || !('IntersectionObserver' in window)) {
    showAll();
  } else {
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.04, rootMargin: '0px 0px -24px 0px' });

    root.classList.add('motion-ready');
    revealItems.forEach((item) => revealObserver.observe(item));
  }

  motionPreference.addEventListener('change', showAll);

  // Mark the last navigable section above the reading line, without scroll effects.
  const sectionLinks = [...document.querySelectorAll('.primary-nav a[href^="#"]')];
  const sections = sectionLinks.map((link) => document.querySelector(link.getAttribute('href')));
  let scrollFrame = 0;
  const updateCurrentSection = () => {
    scrollFrame = 0;
    let current = -1;
    sections.forEach((section, index) => {
      if (section && section.getBoundingClientRect().top <= window.innerHeight * .35) current = index;
    });
    sectionLinks.forEach((link, index) => {
      if (index === current) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  };
  window.addEventListener('scroll', () => {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(updateCurrentSection);
  }, { passive: true });
  updateCurrentSection();

})();
