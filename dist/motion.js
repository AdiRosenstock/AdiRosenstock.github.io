// Shared interaction motion. Content and navigation work without this layer.
(() => {
  const body = document.body;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const pageMotionToggle = document.querySelector('#motion-toggle');
  const headerMotionToggle = document.querySelector('.header-motion-toggle');
  const openingPlays = [...document.querySelectorAll('.opening-play')];
  const paused = () => body.classList.contains('motion-paused') || reducedMotion.matches;
  const surfaces = [...document.querySelectorAll('.project-card')];
  const previewAnimations = new Set();
  let activeSurface = null;
  let bounds = null;
  let pointer = null;
  let pointerFrame = 0;

  function resetPointer() {
    cancelAnimationFrame(pointerFrame);
    pointerFrame = 0;
    activeSurface?.style.removeProperty('--art-x');
    activeSurface?.style.removeProperty('--art-y');
    activeSurface = bounds = pointer = null;
  }
  function paintPointer() {
    pointerFrame = 0;
    if (!activeSurface || !pointer || paused()) return;
    const x = Math.max(-1, Math.min(1, (pointer.x - bounds.left) / bounds.width * 2 - 1));
    const y = Math.max(-1, Math.min(1, (pointer.y - bounds.top) / bounds.height * 2 - 1));
    activeSurface.style.setProperty('--art-x', `${(x * 5).toFixed(2)}px`);
    activeSurface.style.setProperty('--art-y', `${(y * 3).toFixed(2)}px`);
  }
  surfaces.forEach(surface => {
    surface.addEventListener('pointerenter', event => {
      if (event.pointerType !== 'mouse' || !finePointer.matches || paused()) return;
      resetPointer();
      activeSurface = surface;
      bounds = surface.getBoundingClientRect();
    });
    surface.addEventListener('pointermove', event => {
      if (activeSurface !== surface || paused()) return;
      pointer = { x: event.clientX, y: event.clientY };
      if (!pointerFrame) pointerFrame = requestAnimationFrame(paintPointer);
    });
    surface.addEventListener('pointerleave', () => {
      if (activeSurface === surface) resetPointer();
    });
  });
  window.addEventListener('scroll', resetPointer, { passive: true });
  window.addEventListener('resize', resetPointer);
  finePointer.addEventListener('change', resetPointer);

  function syncMotion() {
    openingPlays.forEach(play => {
      if (paused() || document.hidden) play.pauseAnimations();
      else play.unpauseAnimations();
    });
    if (headerMotionToggle && pageMotionToggle) {
      const label = pageMotionToggle.querySelector('span').textContent;
      headerMotionToggle.setAttribute('aria-label', label);
      headerMotionToggle.setAttribute('title', label);
      headerMotionToggle.setAttribute('aria-pressed', pageMotionToggle.getAttribute('aria-pressed'));
      headerMotionToggle.disabled = pageMotionToggle.disabled;
      headerMotionToggle.querySelector('path').setAttribute('d', pageMotionToggle.querySelector('path').getAttribute('d'));
    }
    if (!paused()) return;
    resetPointer();
    previewAnimations.forEach(animation => animation.cancel());
    previewAnimations.clear();
    if (!body.classList.contains('motion-intro-complete')) body.classList.add('motion-intro-complete');
  }
  new MutationObserver(syncMotion).observe(body, { attributes: true, attributeFilter: ['class'] });
  reducedMotion.addEventListener('change', syncMotion);
  headerMotionToggle?.addEventListener('click', () => document.dispatchEvent(new Event('portfolio:toggle-motion')));
  body.classList.add('motion-ready');
  syncMotion();
  // Intro motion only runs on arrival, never again after resuming motion.
  setTimeout(() => body.classList.add('motion-intro-complete'), 2400);

  const viewTargets = document.querySelectorAll('.project-card, .featured-project, .project-gallery, .skill-group');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => entry.target.classList.toggle('motion-visible', entry.isIntersecting));
    }, { threshold: 0.12 });
    viewTargets.forEach(target => observer.observe(target));
  } else viewTargets.forEach(target => target.classList.add('motion-visible'));

  function fadePreview(image) {
    if (paused() || !image?.animate) return;
    image.getAnimations().forEach(animation => animation.cancel());
    const animation = image.animate([{ opacity: 0.45 }, { opacity: 1 }], { duration: 320, easing: 'ease-out' });
    previewAnimations.add(animation);
    animation.finished.then(() => previewAnimations.delete(animation), () => previewAnimations.delete(animation));
  }
  const previewControls = [...document.querySelectorAll('[data-banter-view], #portrait-switch')];
  previewControls.forEach(control => control.addEventListener('click', () => {
    const image = document.querySelector(control.id === 'portrait-switch' ? '#hero-portrait' : '#banterboost-fallback');
    if (!image || paused()) return;
    if (image.complete) fadePreview(image);
    else image.addEventListener('load', () => fadePreview(image), { once: true });
  }));

  function syncVisibility() {
    body.classList.toggle('motion-document-hidden', document.hidden);
    if (document.hidden) resetPointer();
    syncMotion();
  }
  document.addEventListener('visibilitychange', syncVisibility);
  syncVisibility();
})();
