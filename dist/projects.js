const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu() {
  navigation.classList.remove('is-open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation');
}
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  navigation.classList.toggle('is-open', open);
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menuButton.focus();
  }
});
document.querySelector('#copy-project-link').addEventListener('click', async () => {
  const status = document.querySelector('#project-copy-status');
  const url = new URL(window.location.href);
  url.hash = '';
  url.search = '';
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText(url.href);
    status.textContent = 'Project link copied.';
  } catch {
    status.textContent = 'Copy this project link: ' + url.href;
  }
});
const motionToggle = document.querySelector('#motion-toggle');
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
let motionPaused = false;
try { motionPaused = localStorage.getItem('adi-motion-paused') === 'true'; } catch { /* Optional preference. */ }
function updateMotion() {
  const paused = motionPaused || motionPreference.matches;
  document.body.classList.toggle('motion-paused', paused);
  if (paused) {
    document.querySelectorAll('.story-section').forEach(section => section.classList.add('scene-seen'));
    const ball = document.querySelector('.tactic-ball');
    if (ball?.classList.contains('is-playing')) {
      ball.classList.remove('is-playing');
      ball.classList.add('is-finished');
      document.querySelector('#tactics-caption').textContent = 'Move complete. The final pass finds the space.';
    }
  }
  if (!motionToggle) return;
  motionToggle.setAttribute('aria-pressed', String(paused));
  motionToggle.disabled = motionPreference.matches;
  motionToggle.querySelector('span').textContent = motionPreference.matches ? 'Motion reduced' : paused ? 'Resume motion' : 'Pause motion';
  motionToggle.querySelector('path').setAttribute('d', paused ? 'm8 5 11 7-11 7Z' : 'M9 5v14M15 5v14');
}
updateMotion();
motionToggle?.addEventListener('click', () => {
  motionPaused = !motionPaused;
  try { localStorage.setItem('adi-motion-paused', String(motionPaused)); } catch { /* Optional preference. */ }
  updateMotion();
});
motionPreference.addEventListener('change', updateMotion);
if ('IntersectionObserver' in window) {
  const storyNavigation = document.querySelector('.story-nav');
  const observer = new IntersectionObserver(entries => {
    const active = entries.find(entry => entry.isIntersecting);
    if (!active) return;
    storyNavigation.querySelectorAll('a').forEach(link => {
      if (link.hash === '#' + active.target.id) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }, { rootMargin: '-15% 0px -55% 0px', threshold: 0 });
  document.querySelectorAll('.story-section').forEach(section => observer.observe(section));
}
let progressFrame = 0;
function updateProgress() {
  progressFrame = 0;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
  document.documentElement.style.setProperty('--page-progress', String(progress));
}
function scheduleProgress() {
  if (!progressFrame) progressFrame = requestAnimationFrame(updateProgress);
}
window.addEventListener('scroll', scheduleProgress, { passive: true });
window.addEventListener('resize', scheduleProgress);
updateProgress();
document.querySelector('#year').textContent = String(new Date().getFullYear());

// Each hero explains something specific to its project. These are illustrations,
// not live product state, trading returns, or additional model evaluation results.
document.body.classList.add('scene-enhanced');
function animateChange(element) {
  if (!element || motionPaused || motionPreference.matches) return;
  element.classList.remove('scene-change');
  void element.offsetWidth;
  element.classList.add('scene-change');
}
document.querySelectorAll('.desk-packet, .gathering-card').forEach(element => {
  element.addEventListener('animationend', event => {
    if (event.target === element) element.classList.remove('scene-change');
  });
});
function setSelected(selector, selected) {
  document.querySelectorAll(selector).forEach(button => {
    button.setAttribute('aria-pressed', String(button === selected));
  });
}
const packetStages = {
  research: { kind: 'Research notes', title: 'Start with the facts.', checks: ['Role requirements', 'Source links', 'Duplicate checks'], caption: 'A role is assessed against saved preferences, with source evidence kept alongside it.' },
  prepare: { kind: 'Prepared packet', title: 'Bring the pieces together.', checks: ['Saved profile facts', 'Questions to answer', 'Original documents'], caption: 'Answers and document choices become a versioned packet. Missing personal answers stay in the review queue.' },
  review: { kind: 'Candidate review', title: 'Your approval comes next.', checks: ['Review exact answers', 'Approve this version', 'Record confirmation'], caption: 'The candidate reviews the exact packet. Submission is a separate action, and history requires confirmation evidence.' }
};
document.querySelectorAll('[data-career-stage]').forEach(button => button.addEventListener('click', () => {
  const stage = packetStages[button.dataset.careerStage];
  document.querySelector('#packet-kind').textContent = stage.kind;
  document.querySelector('#packet-title').textContent = stage.title;
  const checks = stage.checks.map(text => {
    const item = document.createElement('li');
    item.textContent = text;
    return item;
  });
  document.querySelector('#packet-checks').replaceChildren(...checks);
  document.querySelector('#career-caption').textContent = stage.caption;
  setSelected('[data-career-stage]', button);
  animateChange(document.querySelector('#career-packet'));
}));
const tradingSketches = {
  reversion: { caption: 'Look for a price stretched away from its reference, then test whether it tends to return.', x: 'Time', y: 'Relative price', reference: 'Fair value', label: 'Illustration of prices moving around a fair-value line' },
  basket: { caption: 'Compare a basket’s price with the value of its components. The gap is a research signal to test.', x: 'Time', y: 'Basket and components', reference: '', label: 'Illustrative basket price in blue and component value in orange, showing a temporary gap' },
  volatility: { caption: 'Fit a volatility curve, look for options away from it, and account for the positions needed to hedge.', x: 'Moneyness', y: 'Implied volatility', reference: 'Fitted curve', label: 'Illustrative volatility curve and option observations away from the curve' }
};
document.querySelectorAll('[data-trade]').forEach(button => button.addEventListener('click', () => {
  const mode = button.dataset.trade;
  const sketch = tradingSketches[mode];
  document.querySelectorAll('[data-trade-curve]').forEach(path => path.classList.toggle('is-active', path.dataset.tradeCurve === mode));
  document.querySelectorAll('[data-trade-signal]').forEach(path => path.classList.toggle('is-active', path.dataset.tradeSignal === mode));
  document.querySelector('.plot-fair').style.display = mode === 'reversion' ? '' : 'none';
  const labels = document.querySelectorAll('.plot-text text');
  labels[0].textContent = sketch.y;
  labels[1].textContent = sketch.x;
  labels[2].textContent = sketch.reference;
  document.querySelector('.market-plot').setAttribute('aria-label', sketch.label);
  document.querySelector('#trade-caption').textContent = sketch.caption;
  setSelected('[data-trade]', button);
}));
document.querySelectorAll('[data-fold]').forEach(button => button.addEventListener('click', () => {
  const fold = button.dataset.fold;
  document.querySelectorAll('[data-fold-column]').forEach(column => {
    column.classList.toggle('is-held-out', column.dataset.foldColumn === fold);
  });
  document.querySelector('#fold-caption').textContent = `Fold ${fold} is held out for validation. The other four folds are used for training.`;
  setSelected('[data-fold]', button);
}));
const gatheringJourneys = {
  guest: { title: 'Find a table. Find your people.', steps: ['Browse', 'Request to join', 'Coordinate'], caption: 'Discover a gathering, meet the host through their profile, and ask for a place.' },
  host: { title: 'Make room for a gathering.', steps: ['Create an event', 'Review requests', 'Welcome guests'], caption: 'Share the gathering, review guest profiles and requests, then coordinate with the people joining you.' }
};
document.querySelectorAll('[data-gathering]').forEach(button => button.addEventListener('click', () => {
  const journey = gatheringJourneys[button.dataset.gathering];
  document.querySelector('#gathering-title').textContent = journey.title;
  document.querySelector('#gathering-steps').replaceChildren(...journey.steps.map(text => {
    const step = document.createElement('li');
    step.textContent = text;
    return step;
  }));
  document.querySelector('#gathering-caption').textContent = journey.caption;
  setSelected('[data-gathering]', button);
  animateChange(document.querySelector('#gathering-card'));
}));
const playMove = document.querySelector('#play-the-move');
const tacticBall = document.querySelector('.tactic-ball');
let moveResetFrame = 0;
playMove?.addEventListener('click', () => {
  cancelAnimationFrame(moveResetFrame);
  tacticBall.classList.remove('is-playing', 'is-finished');
  const caption = document.querySelector('#tactics-caption');
  if (motionPaused || motionPreference.matches) {
    tacticBall.classList.add('is-finished');
    caption.textContent = 'Move complete. The final pass finds the space.';
    return;
  }
  caption.textContent = 'One touch. Find the angle. Play the next pass.';
  // A frame with no animation lets a repeated click restart the move cleanly.
  moveResetFrame = requestAnimationFrame(() => {
    moveResetFrame = requestAnimationFrame(() => {
      if (motionPaused || motionPreference.matches) {
        tacticBall.classList.add('is-finished');
        caption.textContent = 'Move complete. The final pass finds the space.';
      } else tacticBall.classList.add('is-playing');
      moveResetFrame = 0;
    });
  });
});
tacticBall?.addEventListener('animationend', () => {
  tacticBall.classList.remove('is-playing');
  tacticBall.classList.add('is-finished');
  document.querySelector('#tactics-caption').textContent = 'Move complete. The final pass finds the space.';
});

// Only observed sections receive pending styles. A blocked script or reduced
// motion never hides the source content. Each section reveals once.
if ('IntersectionObserver' in window && !motionPaused && !motionPreference.matches) {
  const entranceObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('scene-seen');
      entranceObserver.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -35px 0px', threshold: 0.04 });
  document.querySelectorAll('.story-section').forEach(section => {
    section.querySelectorAll('.feature-row, .build-flow li').forEach((element, index) => {
      element.style.setProperty('--scene-delay', `${Math.min(index, 4) * 70}ms`);
    });
    if (section.getBoundingClientRect().top < window.innerHeight - 35) section.classList.add('scene-seen');
    else entranceObserver.observe(section);
  });
  document.body.classList.add('scene-ready');
  document.addEventListener('focusin', event => {
    const section = event.target.closest('.story-section');
    if (section) {
      section.classList.add('scene-seen');
      entranceObserver.unobserve(section);
    }
  });
}
