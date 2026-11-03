// Motion for the homepage: visible content, short entrances, and gentle scroll depth.
(() => {
  const body = document.body;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const narrowScreen = window.matchMedia('(max-width: 650px)');
  const disabled = () => reducedMotion.matches || body.classList.contains('motion-paused') || document.hidden;
  const active = new Set();
  const entered = new WeakSet();
  const animations = new Map();
  const scenes = new Map();
  let frame = 0;

  function animate(scene, node, keyframes, duration, delay = 0) {
    if (!node?.animate) return;
    const animation = node.animate(keyframes, {
      duration,
      delay,
      easing: 'cubic-bezier(.22,1,.36,1)',
      fill: 'backwards'
    });
    animations.set(animation, scene);
    animation.finished.then(() => animations.delete(animation), () => animations.delete(animation));
  }

  function enter(scene) {
    if (entered.has(scene.root) || document.hidden) return;
    entered.add(scene.root);
    if (disabled()) return;

    if (scene.kind === 'portrait') {
      animate(scene, scene.art, [
        { transform: 'translateY(20px)', opacity: .88 },
        { transform: 'none', opacity: 1 }
      ], 620);
      animate(scene, scene.art.querySelector('img'), [
        { transform: 'scale(1.09)' },
        { transform: 'none' }
      ], 760);
    } else if (scene.kind === 'heading') {
      animate(scene, scene.root, [{ transform: 'translateX(-10px)' }, { transform: 'none' }], 420);
    } else if (scene.kind === 'book') {
      animate(scene, scene.art, [
        { transform: 'translateY(15px) rotate(-6deg)' },
        { transform: 'none' }
      ], 560, scene.delay);
    } else {
      animate(scene, scene.art || scene.root, [
        { transform: 'translateY(22px) scale(.975)', opacity: .94 },
        { transform: 'none', opacity: 1 }
      ], 540);
    }
  }

  function paint() {
    frame = 0;
    if (disabled()) return;
    const height = window.innerHeight;
    const strength = narrowScreen.matches ? .5 : 1;
    const offsets = [];
    active.forEach(scene => {
      if (!scene.art || !scene.drift) return;
      const box = scene.root.getBoundingClientRect();
      // Drift is zero at mid-viewport and peaks as artwork passes either edge.
      const progress = Math.max(-1, Math.min(1, (height - 2 * box.top - box.height) / (height + box.height)));
      offsets.push([scene.art, progress * scene.drift * strength]);
    });
    offsets.forEach(([art, offset]) => art.style.setProperty('--scroll-drift', `${offset.toFixed(2)}px`));
  }

  function schedule() {
    if (!frame && !disabled()) frame = requestAnimationFrame(paint);
  }

  function add(selector, artSelector, kind = 'art', drift = 0) {
    document.querySelectorAll(selector).forEach((root, index) => {
      const art = artSelector ? root.querySelector(artSelector) : null;
      const scene = { root, art, kind, drift, delay: index % 3 * 35 };
      if (art && drift) art.classList.add('scroll-art');
      scenes.set(root, scene);
      const box = root.getBoundingClientRect();
      // Existing content never jumps when loading at a section anchor.
      const arrivingPortrait = kind === 'portrait' && !window.location.hash && window.scrollY === 0;
      if (!arrivingPortrait && box.top < window.innerHeight && box.bottom > 0) entered.add(root);
    });
  }

  add('.hero-portrait', '.hero-photo-frame', 'portrait', 18);
  add('.about-family-scene', '.portrait-frame', 'art', 6);
  add('.experience-row', '.company-logo');
  add('.book-entry', '.book-cover', 'book', 9);
  add('.section-heading h2:not(#projects-title), .about-intro h2, .skills-intro h2, .reading-intro h2, .contact-intro h2', null, 'heading');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const scene = scenes.get(entry.target);
        if (entry.isIntersecting) {
          active.add(scene);
          enter(scene);
        } else {
          active.delete(scene);
          scene.art?.style.removeProperty('--scroll-drift');
          animations.forEach((animationScene, animation) => {
            if (animationScene === scene) animation.cancel();
          });
        }
      });
      schedule();
    }, { threshold: .08, rootMargin: '0px 0px -24px 0px' });
    scenes.forEach(scene => observer.observe(scene.root));
  }

  function sync() {
    if (disabled()) {
      cancelAnimationFrame(frame);
      frame = 0;
      animations.forEach((scene, animation) => animation.cancel());
      animations.clear();
      scenes.forEach(scene => scene.art?.style.removeProperty('--scroll-drift'));
    } else {
      active.forEach(enter);
      schedule();
    }
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
    video.focus({ preventScroll: true });
  });
})();
