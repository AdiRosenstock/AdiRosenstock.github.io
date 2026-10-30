// Motion for the homepage: visible content, short entrances, and gentle scroll depth.
(() => {
  const body = document.body;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const narrowScreen = window.matchMedia('(max-width: 650px)');
  const disabled = () => reducedMotion.matches || body.classList.contains('motion-paused') || document.hidden;
  const active = new Set();
  const entered = new WeakSet();
  const animations = new Set();
  const scenes = new Map();
  let frame = 0;

  function animate(node, keyframes, delay = 0) {
    if (!node?.animate || disabled()) return;
    const animation = node.animate(keyframes, {
      duration: 760,
      delay,
      easing: 'cubic-bezier(.2,.7,.2,1)'
    });
    animations.add(animation);
    animation.finished.then(() => animations.delete(animation), () => animations.delete(animation));
  }

  function enter(scene) {
    if (entered.has(scene.root)) return;
    entered.add(scene.root);
    scene.root.dataset.scrollEntered = 'true';
    if (disabled()) return;
    if (scene.kind === 'phone') {
      animate(scene.art, [
        { transform: 'translateY(34px) rotate(-1.5deg)', opacity: .9 },
        { transform: 'none', opacity: 1 }
      ]);
    } else if (scene.kind === 'heading') {
      animate(scene.root, [{ transform: 'translateX(-12px)' }, { transform: 'none' }]);
    } else if (scene.kind === 'book') {
      animate(scene.art, [{ transform: 'translateY(18px) rotate(-3deg)' }, { transform: 'none' }], scene.delay);
    } else {
      animate(scene.art || scene.root, [
        { transform: 'translateY(24px) scale(.98)', opacity: .9 },
        { transform: 'none', opacity: 1 }
      ]);
      if (scene.copy) animate(scene.copy, [{ transform: 'translateY(10px)' }, { transform: 'none' }], 70);
    }
  }

  function paint() {
    frame = 0;
    if (disabled()) return;
    const height = window.innerHeight;
    active.forEach(scene => {
      if (!scene.art || !scene.drift) return;
      const box = scene.root.getBoundingClientRect();
      const progress = Math.max(-1, Math.min(1, (height / 2 - box.top - box.height / 2) / height));
      const drift = scene.art.classList.contains('is-playing') ? 0 : progress * scene.drift * (narrowScreen.matches ? .5 : 1);
      scene.art.style.setProperty('--scroll-drift', `${drift.toFixed(2)}px`);
    });
  }

  function schedule() {
    if (!frame && !disabled()) frame = requestAnimationFrame(paint);
  }

  function add(selector, artSelector, kind = 'art', drift = 0) {
    document.querySelectorAll(selector).forEach((root, index) => {
      const art = artSelector ? root.querySelector(artSelector) : null;
      const scene = { root, art, kind, drift, delay: index % 6 * 35, copy: root.querySelector('.card-copy') };
      if (art && drift) art.classList.add('scroll-art');
      scenes.set(root, scene);
      const box = root.getBoundingClientRect();
      // Existing content never jumps when loading at a section anchor.
      if (box.top < window.innerHeight && box.bottom > 0) entered.add(root);
    });
  }

  add('.hero-portrait', '.hero-photo-frame', 'art', 12);
  add('.featured-preview', '.featured-image', 'phone', 14);
  add('.brief-feature', '.brief-demo-screen', 'art', 10);
  add('.project-card', '.card-visual', 'art', 8);
  add('.about-family-scene', '.portrait-frame', 'art', 6);
  add('.experience-row', '.company-logo');
  add('.book-entry', '.book-cover', 'book', 3);
  add('.section-heading h2, .about-intro h2, .skills-intro h2, .reading-intro h2, .contact-intro h2', null, 'heading');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const scene = scenes.get(entry.target);
        if (entry.isIntersecting) {
          active.add(scene);
          enter(scene);
        } else active.delete(scene);
      });
      schedule();
    }, { threshold: .08, rootMargin: '0px 0px -24px 0px' });
    scenes.forEach(scene => observer.observe(scene.root));
  }

  function sync() {
    if (disabled()) {
      cancelAnimationFrame(frame);
      frame = 0;
      animations.forEach(animation => animation.cancel());
      animations.clear();
      scenes.forEach(scene => scene.art?.style.removeProperty('--scroll-drift'));
    } else schedule();
  }
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  document.addEventListener('visibilitychange', sync);
  reducedMotion.addEventListener('change', sync);
  new MutationObserver(sync).observe(body, { attributes: true, attributeFilter: ['class'] });

  // The real video loads only after an explicit Play action.
  const play = document.querySelector('[data-brief-play]');
  const video = document.querySelector('#brief-home-demo');
  play?.addEventListener('click', () => {
    video.src = 'https://www.youtube-nocookie.com/embed/GVULpFCQ97A?playsinline=1&autoplay=1&rel=0';
    video.hidden = false;
    play.hidden = true;
    video.parentElement.classList.add('is-playing');
    video.parentElement.style.removeProperty('--scroll-drift');
    video.focus({ preventScroll: true });
  });
})();
