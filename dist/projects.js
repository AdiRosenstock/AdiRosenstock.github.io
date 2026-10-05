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
