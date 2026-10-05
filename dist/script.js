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
// Supplemental preview copy follows hover or focus; Escape restores the artwork.
const projectPreviews = document.querySelectorAll('.project-card, .featured-project');
projectPreviews.forEach(card => {
  card.addEventListener('pointerleave', () => {
    if (!card.contains(document.activeElement)) card.classList.remove('peek-dismissed');
  });
  card.addEventListener('focusout', event => {
    if (!card.contains(event.relatedTarget) && !card.matches(':hover')) {
      card.classList.remove('peek-dismissed');
    }
  });
});
document.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;
  projectPreviews.forEach(card => {
    if (card.matches(':hover') || card.contains(document.activeElement)) {
      card.classList.add('peek-dismissed');
    }
  });
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menuButton.focus();
  }
});
const portraitSwitch = document.querySelector('#portrait-switch');
portraitSwitch.addEventListener('click', () => {
  const code = portraitSwitch.getAttribute('aria-pressed') !== 'true';
  const portrait = document.querySelector('#hero-portrait');
  portrait.src = code ? 'assets/adi-code-portrait.jpg?v=1d516b193394' : 'assets/adi-matchday.webp';
  portrait.alt = code ? 'Adi Rosenstock working at a laptop in an AI-edited office scene with illustrative market and code screens' : 'Adi Rosenstock supporting Club Sport Cartaginés at Stamford Bridge';
  document.querySelector('#portrait-note').textContent = code ? 'Behind the code.' : 'Football before fantasy.';
  document.querySelector('#portrait-caption').textContent = code ? 'At work.' : 'At the match.';
  document.querySelector('.tactics-note').textContent = code ? 'On the clock' : 'Off the clock';
  portrait.width = code ? 1254 : 1448;
  portrait.height = code ? 1254 : 1086;
  document.querySelector('#portrait-disclaimer').hidden = !code;
  if (code) portrait.setAttribute('aria-describedby', 'portrait-disclaimer');
  else portrait.removeAttribute('aria-describedby');
  portraitSwitch.setAttribute('aria-pressed', String(code));
  portraitSwitch.firstChild.textContent = code ? 'View matchday photo ' : 'View work photo ';
});
const projects = {
  northwestern: {
    category: 'Education · Expected June 2027', title: 'Northwestern University',
    lead: 'B.A. in Computer Science, Data Science, and Economics at the Weinberg College of Arts and Sciences.',
    sections: [
      ['Three ways to think about a problem', 'Computer Science gives me the tools to build. Data Science helps me find patterns and test assumptions. Economics connects those models to the decisions people make.'],
      ['Beyond the classroom', 'Investment research with Northwestern Capital Management and TAMID, quantitative trading in IMC Prosperity 3, and independent software projects.']
    ], outcome: 'Class of 2027 · 3.7 cumulative GPA · 3.9 major GPA.', links: []
  },
  bloomberg: {
    category: 'Bloomberg · Data Engineer Intern · Summer 2026', title: 'Financial data at scale.',
    lead: 'Company Financials – Consumer team, Princeton, New Jersey. June–August 2026.',
    sections: [
      ['Data engineering', 'Built a production Python and SQL pipeline reconciling 2.3 million financial records across 860 companies and 1,489 fields, surfacing more than 21,000 data quality updates.'],
      ['Agentic AI', 'Developed a system to investigate financial data discrepancies, with specialized agents, a custom MCP server, and SEC 10-K/10-Q XBRL extraction for independent verification.'],
      ['The impact', 'The solution automated resolution of 71% of flagged cases, reduced manual review by more than 63%, and saved approximately 200 analyst-hours per month.']
    ], outcome: '2.3M+ records · 860 companies · 71% of flagged cases automated.', links: []
  },
  banterboost: {
    category: 'BanterBoost · Founder & sole engineer', title: 'Football data, with a point of view.',
    lead: 'A personal interest became a product: live Fantasy Premier League analytics built around the rivalries that make a mini-league worth following.',
    sections: [
      ['The problem', 'A league table tells you who is winning, but leaves you to work out why. Captain choices, bench points, transfers, and differentials are scattered across teams and fixtures.'],
      ['What I built', 'An end-to-end platform with FPL data pipelines, live scores, mini-league stories, team comparisons, season analysis, and transfer planning. The Pundit explains league decisions and writes gameweek roasts from actual league data. I also built Google sign-in, subscription payments, and the interface.'],
      ['Forecasts with traceable sources', 'The analytics product estimates expected points, goals, assists, and clean sheets over upcoming matches. Player comparisons and squad-specific transfer suggestions sit alongside available Kalshi, Polymarket, and sportsbook quotes. Every number names its source; experimental model estimates stay separate from market prices.'],
      ['One decision that matters', 'League facts are calculated before they reach The Pundit. Direct statistical questions use typed, league-scoped code; generated stories are grounded in those facts. Forecast methodology and accuracy evidence are visible in the product.']
    ], outcome: 'Built and launched independently in September 2026.', links: [['Explore the product', 'https://fplbanterboost.com'], ['Explore current analytics', 'https://fplbanterboost.com/l/2267404/analytics']]
  },
  career: {
    category: 'Career Agent · Open-source software', title: 'Less application admin. More control.',
    lead: 'A personal application workflow turned into a reusable, local-first workspace for other job seekers.',
    sections: [
      ['The problem', 'Job research, documents, application answers, and submission history easily become disconnected. Automation only helps if it can use accurate facts and keep the candidate in control.'],
      ['What I built', 'A TypeScript application with a React dashboard, an Express API, local SQLite or Supabase storage, and a shared agent workflow. It keeps research, prepared answers, document checks, duplicate checks, and review history together.'],
      ['One decision that matters', 'Preparation and submission are separate steps. Submission needs a current reviewed packet, and an application is only recorded as submitted when there is confirmation evidence. The repository ships with fictional examples.']
    ], outcome: 'Open source under the MIT license. Personal candidate data stays in each user’s own workspace.', links: [['Explore the repository', 'https://github.com/AdiRosenstock/career-agent-public']]
  },
  trading: {
    category: 'IMC Prosperity 3 · Team Literal Zero', title: 'Finding an edge in the noise.',
    lead: 'A fast-paced competition in algorithmic trading, combining statistical modeling with practical decisions about pricing and risk.',
    sections: [
      ['The challenge', 'Develop automated strategies for a simulated market, adapt as new products arrive, and test ideas against historical data.'],
      ['Our approach', 'We explored regression-based price signals, mean reversion, synthetic basket pricing, and Black–Scholes-based options valuation. Volatility analysis and hedging informed how we managed the options positions.'],
      ['What I took away', 'A profitable backtest does not guarantee a good live strategy. The competition made model assumptions, overfitting, and risk management concrete.']
    ], outcome: 'Team result: 1st in Central America and the Caribbean; 3rd in Latin America.', links: [['Read the competition write-up', 'https://github.com/AdiRosenstock/IMC_Prosperity_3']]
  },
  airbnb: {
    category: 'Airbnb Superhost classification · STAT 303-3', title: 'What makes a Superhost?',
    lead: 'A machine learning project predicting Superhost status from real Airbnb listings in Chicago, Asheville, and Kauai.',
    sections: [
      ['The data', 'The training set contained 5,510 listings with numerical, categorical, text, and boolean features. The target was the probability of a host being a Superhost.'],
      ['My approach', 'I cleaned inconsistent fields, handled missing values, and engineered features before comparing tree-based and ensemble models. Five-fold stratified cross-validation guided model selection; CatBoost produced the final submission.'],
      ['The result', 'The submission earned a ROC-AUC of 0.9908 and placed second among 124 participants in Northwestern’s STAT 303-3 competition.']
    ], outcome: '2nd of 124 participants · 0.9908 ROC-AUC.', links: [['View code and methodology', 'https://github.com/AdiRosenstock/Airbnb-Classification-Problem-Kaggle']]
  }
};
const dialog = document.querySelector('#project-dialog');
const dialogContent = document.querySelector('#dialog-content');
let lastProjectButton;
document.querySelectorAll('[data-project]').forEach(button => button.addEventListener('click', () => {
  const project = projects[button.dataset.project];
  if (!project) return;
  lastProjectButton = button;
  dialogContent.replaceChildren();
  function add(tag, className, text, parent = dialogContent) {
    const element = document.createElement(tag);
    element.className = className;
    element.textContent = text;
    parent.append(element);
    return element;
  }
  add('p', 'dialog-kicker', project.category);
  const title = add('h2', '', project.title);
  title.id = 'dialog-title';
  add('p', 'dialog-lead', project.lead);
  project.sections.forEach(([heading, body]) => {
    const section = add('div', 'dialog-section', '');
    add('h3', '', heading, section);
    add('p', '', body, section);
  });
  add('p', 'dialog-outcome', project.outcome);
  if (project.links.length) {
    const links = add('div', 'dialog-links', '');
    project.links.forEach(([label, href]) => {
      const anchor = add('a', '', label, links);
      anchor.href = href;
      anchor.target = '_blank';
      anchor.rel = 'noopener noreferrer';
    });
  }
  dialog.showModal();
  document.body.style.overflow = 'hidden';
}));
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  const box = dialog.getBoundingClientRect();
  if (event.target === dialog && (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom)) dialog.close();
});
dialog.addEventListener('close', () => {
  document.body.style.overflow = '';
  lastProjectButton?.focus();
});
document.querySelector('#copy-email').addEventListener('click', async () => {
  const status = document.querySelector('#copy-status');
  const email = 'adirosenstock2026@u.northwestern.edu';
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText(email);
    status.textContent = 'Email address copied.';
  } catch {
    status.textContent = 'Select the address above to copy it, or use the email link.';
  }
});
const sectionObserver = new IntersectionObserver(entries => {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    navigation.querySelectorAll('a').forEach(link => {
      if (link.hash === '#' + entry.target.id) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
}, { rootMargin: '-18% 0px -58% 0px', threshold: 0 });
document.querySelectorAll('main section[id]').forEach(section => sectionObserver.observe(section));
document.querySelector('#year').textContent = String(new Date().getFullYear());
const localBanterPreview = ['localhost', '127.0.0.1'].includes(location.hostname);
const banterPreview = document.querySelector('#banterboost-preview');
const banterFallback = document.querySelector('#banterboost-fallback');
if (!localBanterPreview) {
  document.body.classList.add('live-banter-preview');
  banterPreview.src = banterPreview.dataset.src;
} else {
  banterPreview.setAttribute('aria-hidden', 'true');
  document.querySelector('#banterboost-preview-caption').textContent = 'Captured view for local preview. Open the full site for live data.';
}
const banterViews = {
  analytics: { src: 'https://fplbanterboost.com/l/2267404/analytics', image: 'assets/banterboost-analytics-current.jpg', alt: 'BanterBoost analytics page with player forecasts and mini-league insights', title: 'BanterBoost live analytics and odds', label: 'Open BanterBoost analytics and odds in a new tab', caption: 'Explore the live analytics. Sign-in opens BanterBoost in a new tab.' },
  league: { src: 'https://fplbanterboost.com/l/2267404', image: 'assets/banterboost-league-current.jpg', alt: 'BanterBoost mini-league page showing live standings and team comparisons', title: 'BanterBoost live mini-league', label: 'Open BanterBoost live league in a new tab', caption: 'Explore the live league. Sign-in opens BanterBoost in a new tab.' }
};
document.querySelectorAll('[data-banter-view]').forEach(button => button.addEventListener('click', () => {
  const view = banterViews[button.dataset.banterView];
  if (localBanterPreview) {
    banterFallback.src = view.image;
    banterFallback.alt = view.alt;
  } else {
    banterPreview.src = view.src;
    banterPreview.title = view.title;
  }
  const openLink = document.querySelector('#banterboost-open');
  openLink.href = view.src;
  openLink.setAttribute('aria-label', view.label);
  document.querySelector('#banterboost-preview-caption').textContent = localBanterPreview ? 'Captured view for local preview. Open the full site for live data.' : view.caption;
  document.querySelectorAll('[data-banter-view]').forEach(option => option.setAttribute('aria-pressed', String(option === button)));
}));

const revealTargets = [];
let revealObserver;
function revealElement(element) {
  element.classList.remove('is-pending');
  element.classList.add('is-revealed');
  revealObserver?.unobserve(element);
}
function revealAll() {
  revealTargets.forEach(revealElement);
  revealObserver?.disconnect();
}
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const motionToggle = document.querySelector('#motion-toggle');
const football = document.querySelector('#kick-football');
let motionPaused = false;
try { motionPaused = localStorage.getItem('adi-motion-paused') === 'true'; } catch { /* Optional preference storage. */ }
function updateMotion() {
  const paused = motionPaused || motionPreference.matches;
  document.body.classList.toggle('motion-paused', paused);
  motionToggle.setAttribute('aria-pressed', String(paused));
  motionToggle.disabled = motionPreference.matches;
  motionToggle.querySelector('span').textContent = motionPreference.matches ? 'Motion reduced' : paused ? 'Resume motion' : 'Pause motion';
  motionToggle.querySelector('path').setAttribute('d', paused ? 'm8 5 11 7-11 7Z' : 'M9 5v14M15 5v14');
  if (paused) {
    football.classList.remove('is-kicking');
    revealAll();
  }
}
updateMotion();
function toggleMotion() {
  motionPaused = !motionPaused;
  try { localStorage.setItem('adi-motion-paused', String(motionPaused)); } catch { /* Motion still works without storage. */ }
  updateMotion();
}
motionToggle.addEventListener('click', toggleMotion);
document.addEventListener('portfolio:toggle-motion', toggleMotion);
motionPreference.addEventListener('change', updateMotion);
let touches = 0;
football.addEventListener('click', () => {
  if (football.classList.contains('is-kicking')) return;
  touches += 1;
  const reactions = ['Nice touch.', 'Still got it.', 'One more before the next project?'];
  const reaction = reactions[(touches - 1) % reactions.length];
  document.querySelector('#football-hint').textContent = reaction;
  document.querySelector('#football-status').textContent = reaction;
  if (!motionPaused && !motionPreference.matches) football.classList.add('is-kicking');
});
football.addEventListener('animationend', event => {
  if (event.target === football) football.classList.remove('is-kicking');
});
const sceneObserver = new IntersectionObserver(([entry]) => {
  document.querySelector('.hero-scene').classList.toggle('motion-offscreen', !entry.isIntersecting);
});
sceneObserver.observe(document.querySelector('.hero-scene'));

// Keep all content visible by default. Only scroll-observed content receives
// the pending class, so a blocked script or unsupported API cannot hide the page.
function initializeReveals() {
  if (motionPaused || motionPreference.matches || !('IntersectionObserver' in window)) return;
  revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) revealElement(entry.target);
    });
  }, { rootMargin: '0px 0px -48px 0px', threshold: 0.08 });
  const groups = [
    ['.projects-section .section-heading, .about-title, .experience-section .section-heading, .skills-intro', 'heading'],
    ['.featured-project', 'feature'],
    ['.project-card', 'card'],
    ['.more-projects > a, .about-copy, .leadership-note', 'copy'],
    ['.experience-row', 'timeline'],
    ['.skill-group', 'toolkit'],
    ['.contact-inner > div', 'contact']
  ];
  groups.forEach(([selector, type]) => {
    document.querySelectorAll(selector).forEach((element, index) => {
      element.classList.add('reveal-target', 'reveal-' + type);
      if (type === 'card' || type === 'contact') element.style.setProperty('--reveal-delay', index * 90 + 'ms');
      if (type === 'toolkit') element.querySelectorAll('.tag-list > span').forEach((tag, tagIndex) => {
        tag.style.setProperty('--tag-delay', tagIndex * 45 + 'ms');
      });
      revealTargets.push(element);
      if (element.getBoundingClientRect().top < window.innerHeight - 48) revealElement(element);
      else {
        element.classList.add('is-pending');
        revealObserver.observe(element);
      }
    });
  });
}
initializeReveals();
// Keyboard navigation reveals a focused block immediately, even before scrolling.
document.addEventListener('focusin', event => {
  const target = event.target.closest('.reveal-target.is-pending');
  if (target) revealElement(target);
});

const experienceTrack = document.querySelector('.experience-list');
let progressFrame = 0;
function updateScrollProgress() {
  progressFrame = 0;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const pageProgress = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
  document.documentElement.style.setProperty('--page-progress', String(pageProgress));
  const timeline = experienceTrack.getBoundingClientRect();
  const experienceProgress = Math.min(1, Math.max(0, (window.innerHeight * 0.76 - timeline.top) / timeline.height));
  experienceTrack.style.setProperty('--experience-progress', String(experienceProgress));
}
function scheduleProgress() {
  if (!progressFrame) progressFrame = requestAnimationFrame(updateScrollProgress);
}
window.addEventListener('scroll', scheduleProgress, { passive: true });
window.addEventListener('resize', scheduleProgress);
updateScrollProgress();
document.querySelectorAll('details').forEach(details => details.addEventListener('toggle', scheduleProgress));
