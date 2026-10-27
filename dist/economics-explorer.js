// Exact deterministic transition from the ECON 324 notebook. t = 0 is rebellion;
// t = -1 shows the stationary economy immediately before extraction is removed.
const ALPHA = 0.65;
const LAND = 100000;
const INITIAL_POPULATION = LAND * 0.5 ** (1 / (1 - ALPHA));
const LAST_GENERATION = 15;

export function stateAt(generation) {
  const before = generation < 0;
  const populationRatio = before ? 1 : 2 ** ((1 - ALPHA ** generation) / (1 - ALPHA));
  const outputRatio = populationRatio ** ALPHA;
  const outputPerWorker = 2 * populationRatio ** (ALPHA - 1);
  const extraction = before ? 0.5 : 0;
  const income = (1 - extraction) * outputPerWorker;
  return {
    population: INITIAL_POPULATION * populationRatio,
    populationRatio, outputRatio, outputPerWorker, extraction, income,
    consumption: 0.7 * income,
    consumptionRatio: income,
    children: income,
    gain: 100 * (income - 1)
  };
}

const board = typeof document !== 'undefined' && document.querySelector('.economics-board');
if (board) mountExplorer(board);

function mountExplorer(root) {
  const number = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const svgNS = 'http://www.w3.org/2000/svg';
  let generation = -1;
  let view = 'village';
  let metric = 'consumption';
  let frame = 0;
  let lastTime = 0;
  let elapsed = 0;
  let playing = false;
  let visible = true;
  let sceneAnimation;
  const paused = () => document.body.classList.contains('motion-paused') || reducedMotion.matches;
  const metrics = {
    consumption: { key: 'consumptionRatio', name: 'Consumption per worker', max: 2, ticks: [0, 1, 2] },
    population: { key: 'populationRatio', name: 'Worker population', max: 8, ticks: [0, 4, 8] },
    output: { key: 'outputRatio', name: 'Total output', max: 4, ticks: [0, 2, 4] }
  };
  root.classList.add('econ-explorer');
  root.innerHTML = `
    <div class="econ-board-heading"><h2>A permanent change.<br>A temporary gain.</h2><span class="econ-model-badge">Explore the model</span></div>
    <div class="econ-view-controls" role="group" aria-label="Explanation view">
      <button type="button" data-econ-view="village" aria-pressed="true" aria-controls="econ-village">The village</button>
      <button type="button" data-econ-view="graph" aria-pressed="false" aria-controls="econ-graph">The graphs</button>
      <button type="button" data-econ-view="math" aria-pressed="false" aria-controls="econ-math">The math</button>
    </div>
    <div class="econ-scenes">
      <div id="econ-village" class="econ-panel" role="region" aria-label="Illustrated economy">
        <div class="econ-scene-heading"><strong id="econ-village-title">Workers keep the harvest.</strong><span>Land stays fixed</span></div>
        <svg class="econ-village-svg" viewBox="0 0 520 254" role="img" aria-labelledby="econ-village-description">
          <title id="econ-village-description">The same land supports more workers after rebellion.</title>
          <defs>
            <pattern id="econ-crops" width="24" height="22" patternUnits="userSpaceOnUse" patternTransform="skewX(-18)"><path d="M10 5v14m0-8-4-4m4 8 4-4" fill="none" stroke="#749479" stroke-width="1.4" stroke-linecap="round"/></pattern>
            <g id="econ-worker" fill="currentColor" stroke="none"><circle cy="-8" r="3.3"/><path d="M-4-2Q0-4 4-2l2 8H3v7H-3V6H-6Z"/></g>
          </defs>
          <path d="M26 83H494" stroke="#c5d7d0" stroke-dasharray="4 6" fill="none"/>
          <g id="econ-elite" fill="none" stroke="#a16e45" stroke-width="1.6" stroke-linejoin="round">
            <path d="M404 65V30l-7-5V13h9v7h8v-7h9v7h8v-7h9v12l-7 5v35m-29-18h29M415 65V52h8v13" fill="#f3e9db"/>
          </g>
          <g fill="none" stroke="#23635b" stroke-width="1.7" stroke-linejoin="round"><path d="m55 44 23-21 23 21M61 40v27h34V40" fill="#fff"/><path d="M74 67V52h10v15M66 44h6v6h-6m20-6h5v6h-5"/></g>
          <text x="116" y="44" class="econ-svg-label">The village</text>
          <text x="116" y="63" class="econ-svg-caption" id="econ-population-label">13,801 workers</text>
          <text x="418" y="80" text-anchor="middle" class="econ-svg-caption" id="econ-elite-label">No extraction</text>
          <path d="m72 101 350 0 31 58H41Z" fill="#e4ecdf" stroke="#a5ba9f" stroke-width="1.5"/>
          <path d="m72 101 350 0 31 58H41Z" fill="url(#econ-crops)" stroke="none"/>
          <path d="m190 101-8 58m124-58 9 58M57 130h381" fill="none" stroke="#b1c2aa"/>
          <text x="248" y="145" text-anchor="middle" class="econ-field-label">Fixed land: 100,000 units</text>
          <g id="econ-workers" color="#23635b"></g>
          <text x="260" y="244" text-anchor="middle" class="econ-svg-caption">Each person represents about 3,500 workers</text>
        </svg>
        <div class="econ-harvest"><div><span>Output per worker</span><strong id="econ-harvest-total">2.00</strong></div><div class="econ-harvest-track" role="img" aria-label="Output split between workers and elite"><span id="econ-worker-share"></span><span id="econ-elite-share"></span></div><div class="econ-harvest-key"><span><i></i>Workers keep <b id="econ-kept">2.00</b></span><span><i></i>Elite takes <b id="econ-taken">0.00</b></span></div></div>
      </div>
      <div id="econ-graph" class="econ-panel" role="region" aria-label="Model graphs" hidden>
        <div class="econ-metric-controls" role="group" aria-label="Graph outcome"><button type="button" data-econ-metric="consumption" aria-pressed="true">Consumption</button><button type="button" data-econ-metric="population" aria-pressed="false">Population</button><button type="button" data-econ-metric="output" aria-pressed="false">Total output</button></div>
        <svg class="econ-live-chart" viewBox="0 0 520 276" role="img" aria-labelledby="econ-chart-title econ-chart-description">
          <title id="econ-chart-title">Consumption per worker after rebellion</title><desc id="econ-chart-description"></desc>
          <text x="47" y="21" class="econ-svg-caption">× pre-rebellion level</text>
          <g id="econ-grid"></g>
          <path d="M47 37V225H490" class="econ-axis"/>
          <path id="econ-counterfactual" class="econ-counterfactual"/>
          <path id="econ-full-curve" class="econ-full-curve"/>
          <path id="econ-progress-curve" class="econ-progress-curve" pathLength="100"/>
          <path id="econ-cursor-line" class="econ-cursor-line"/>
          <circle id="econ-chart-point" r="5.5" class="econ-chart-point"/>
          <g class="econ-chart-x-labels"><text x="75" y="245">0</text><text x="213" y="245">5</text><text x="352" y="245">10</text><text x="490" y="245">15</text></g>
          <text x="270" y="270" text-anchor="middle" class="econ-svg-caption">Generations after rebellion</text>
        </svg>
        <div class="econ-chart-key"><span><i></i>Rebellion</span><span><i></i>Elite remains</span><strong id="econ-graph-reading">2.00× the initial level</strong></div>
      </div>
      <div id="econ-math" class="econ-panel" role="region" aria-label="Equations with current values" hidden>
        <div class="econ-scene-heading"><strong>Follow one worker’s income.</strong><span>α = 0.65</span></div>
        <ol class="econ-math-chain">
          <li><span class="econ-math-label">Output per worker</span><div><span class="econ-formula">Y / L = A (H / L)<sup>0.35</sup></span><strong id="econ-math-output">2.00</strong></div></li>
          <li><span class="econ-math-label">Keep the share left after extraction</span><div><span class="econ-formula">w = (1 − τ) × Y / L</span><strong id="econ-math-income">2.00</strong></div><small id="econ-math-tax">τ = 0 → workers keep 100%</small></li>
          <li><span class="econ-math-label">Split income between consumption and children</span><div><span class="econ-formula">c = 0.70w &nbsp;·&nbsp; n = w</span><strong id="econ-math-household">1.40 · 2.00</strong></div></li>
          <li><span class="econ-math-label">More children become next generation’s workers</span><div><span class="econ-formula">L<sub>t+1</sub> = n<sub>t</sub> × L<sub>t</sub></span><strong id="econ-math-next">27,602</strong></div></li>
        </ol>
        <p class="econ-math-footnote">c: consumption · n: expected surviving children.<br>More workers on fixed land lower Y / L next generation.</p>
      </div>
    </div>
    <div class="econ-time-controls">
      <div class="econ-time-heading"><button type="button" id="econ-play" aria-label="Play the adjustment"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="m7 4 9 6-9 6Z"/></svg><span>Play the story</span></button><label for="econ-generation" id="econ-time-label">At rebellion</label></div>
      <input id="econ-generation" type="range" min="-1" max="15" step="1" value="0" aria-valuetext="At rebellion, consumption gain 100%">
      <div class="econ-milestones" role="group" aria-label="Jump to a generation"><button type="button" data-econ-generation="-1" aria-pressed="false">Before</button><button type="button" data-econ-generation="0" aria-pressed="true">Rebellion</button><button type="button" data-econ-generation="5" aria-pressed="false">+5 gen.</button><button type="button" data-econ-generation="10" aria-pressed="false">+10 gen.</button><button type="button" data-econ-generation="15" aria-pressed="false">+15 gen.</button></div>
    </div>
    <dl class="econ-live-stats"><div><dt>Consumption / worker</dt><dd id="econ-consumption">1.40 <span>+100%</span></dd></div><div><dt>Population</dt><dd id="econ-population">13,801 <span>1.00×</span></dd></div></dl>
    <p class="econ-explanation" id="econ-explanation">The elite’s share drops from 50% to zero. With the same workers and harvest, consumption doubles immediately.</p>
    <p id="econ-announcement" class="econ-sr-only" role="status" aria-live="polite" aria-atomic="true"></p>
  `;
  const find = selector => root.querySelector(selector);
  const slider = find('#econ-generation');
  const playButton = find('#econ-play');
  const workers = find('#econ-workers');
  for (let i = 0; i < 29; i++) {
    const person = document.createElementNS(svgNS, 'use');
    person.setAttribute('href', '#econ-worker');
    person.setAttribute('transform', `translate(${51 + (i % 15) * 30}, ${184 + Math.floor(i / 15) * 30})`);
    person.classList.add('econ-person');
    workers.append(person);
  }
  const put = (selector, text) => { find(selector).textContent = text; };
  const phase = () => generation < 0 ? 'Before rebellion' : generation === 0 ? 'At rebellion' : `Generation ${generation}`;
  function explanation() {
    if (generation < 0) return 'The elite takes half the harvest. Workers retain 1.00 each: 0.70 for consumption and 0.30 for children. One surviving child per worker keeps population stable.';
    if (generation === 0) return 'The elite’s share drops from 50% to zero. With the same workers and harvest, consumption doubles immediately. Population starts growing next generation.';
    if (generation < 5) return 'Higher income means more surviving children. More workers now share the same land, so output per worker falls and the consumption gain begins to fade.';
    if (generation < 10) return 'Total output rises, but population rises faster. Each worker produces less, gradually giving up the initial consumption gain.';
    if (generation < 15) return 'The consumption gain is now below 1%. Workers still keep the entire harvest; a larger population has absorbed almost all the benefit per person.';
    return 'Consumption is nearly back to 0.70. The economy approaches 7.25× the population and 3.62× total output, with no lasting consumption gain per worker.';
  }
  function updateGraph(state) {
    const current = metrics[metric];
    const x = t => 47 + (t + 1) / 16 * 443;
    const y = ratio => 225 - ratio / current.max * 178;
    const pathTo = end => {
      let path = `M${x(-1)},${y(1)}L${x(0)},${y(1)}`;
      if (end < 0) return `M${x(-1)},${y(1)}`;
      path += `L${x(0)},${y(stateAt(0)[current.key])}`;
      const steps = Math.round(end * 10);
      for (let i = 1; i <= steps; i++) path += `L${x(i / 10).toFixed(2)},${y(stateAt(i / 10)[current.key]).toFixed(2)}`;
      return path;
    };
    const grid = find('#econ-grid');
    grid.replaceChildren(...current.ticks.map(tick => {
      const group = document.createElementNS(svgNS, 'g');
      const line = document.createElementNS(svgNS, 'path');
      line.setAttribute('d', `M47 ${y(tick)}H490`);
      line.setAttribute('class', 'econ-grid-line');
      const label = document.createElementNS(svgNS, 'text');
      label.setAttribute('x', '35');
      label.setAttribute('y', String(y(tick) + 4));
      label.setAttribute('text-anchor', 'end');
      label.setAttribute('class', 'econ-svg-caption');
      label.textContent = `${tick}×`;
      group.append(line, label);
      return group;
    }));
    find('#econ-counterfactual').setAttribute('d', `M47 ${y(1)}H490`);
    const fullPath = pathTo(LAST_GENERATION);
    const fullCurve = find('#econ-full-curve');
    const progressCurve = find('#econ-progress-curve');
    fullCurve.setAttribute('d', fullPath);
    progressCurve.setAttribute('d', pathTo(generation));
    const fraction = progressCurve.getTotalLength() / fullCurve.getTotalLength();
    progressCurve.setAttribute('d', fullPath);
    progressCurve.style.strokeDashoffset = String(100 * (1 - fraction));
    find('#econ-chart-point').setAttribute('cx', x(generation));
    find('#econ-chart-point').setAttribute('cy', y(state[current.key]));
    find('#econ-cursor-line').setAttribute('d', 'M0 37V225');
    find('#econ-cursor-line').style.transform = `translateX(${x(generation)}px)`;
    put('#econ-chart-title', `${current.name} after rebellion`);
    put('#econ-chart-description', `${phase()}: ${state[current.key].toFixed(2)} times the pre-rebellion level. Dashed line: the elite remains, at 1 times the initial level. Pale curve: full adjustment to generation 15.`);
    put('#econ-graph-reading', `${state[current.key].toFixed(2)}× the initial level`);
  }
  function render(announce = false) {
    const state = stateAt(generation);
    const gain = state.gain < 0.01 ? '<0.01%' : `${state.gain.toFixed(state.gain >= 10 ? 0 : 2)}%`;
    const gainLabel = generation < 0 ? 'Starting level' : `${gain} gain`;
    slider.value = String(generation);
    slider.setAttribute('aria-valuetext', `${phase()}, consumption ${state.consumption.toFixed(2)}, population ${number.format(state.population)}, ${generation < 0 ? 'no consumption gain' : `consumption gain ${gain}`}`);
    put('#econ-time-label', phase());
    root.querySelectorAll('[data-econ-generation]').forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.econGeneration) === generation)));
    put('#econ-village-title', generation < 0 ? 'The elite takes half.' : generation === 0 ? 'Workers keep the harvest.' : 'Same land. More people.');
    put('#econ-population-label', `${number.format(state.population)} workers`);
    find('#econ-elite').classList.toggle('is-removed', generation >= 0);
    put('#econ-elite-label', generation < 0 ? 'Elite takes 50%' : 'No extraction');
    put('#econ-village-description', `${phase()}. ${number.format(state.population)} workers on 100,000 fixed land units. Workers retain ${state.income.toFixed(2)} of ${state.outputPerWorker.toFixed(2)} output per worker. People icons are rounded illustrations.`);
    const count = Math.round(state.population / 3500);
    [...workers.children].forEach((person, index) => person.classList.toggle('is-present', index < count));
    put('#econ-harvest-total', state.outputPerWorker.toFixed(2));
    find('#econ-worker-share').style.width = `${state.income / 2 * 100}%`;
    find('#econ-elite-share').style.width = `${state.extraction * state.outputPerWorker / 2 * 100}%`;
    find('.econ-harvest-track').setAttribute('aria-label', `Of ${state.outputPerWorker.toFixed(2)} output per worker, workers keep ${state.income.toFixed(2)} and the elite takes ${(state.extraction * state.outputPerWorker).toFixed(2)}`);
    put('#econ-kept', state.income.toFixed(2));
    put('#econ-taken', (state.extraction * state.outputPerWorker).toFixed(2));
    put('#econ-math-output', state.outputPerWorker.toFixed(2));
    put('#econ-math-income', state.income.toFixed(2));
    put('#econ-math-tax', `τ = ${state.extraction.toFixed(2)} → workers keep ${100 * (1 - state.extraction)}%`);
    put('#econ-math-household', `${state.consumption.toFixed(2)} · ${state.children.toFixed(2)}`);
    put('#econ-math-next', number.format(state.children * state.population));
    put('#econ-consumption', state.consumption.toFixed(2) + ' ');
    const gainSpan = document.createElement('span');
    gainSpan.textContent = gainLabel;
    find('#econ-consumption').append(gainSpan);
    put('#econ-population', number.format(state.population) + ' ');
    const ratioSpan = document.createElement('span');
    ratioSpan.textContent = `${state.populationRatio.toFixed(2)}×`;
    find('#econ-population').append(ratioSpan);
    put('#econ-explanation', explanation());
    if (view === 'graph') updateGraph(state);
    if (announce) put('#econ-announcement', `${phase()}. ${explanation()}`);
  }
  function syncPlayButton() {
    const blocked = paused();
    playButton.disabled = blocked;
    playButton.setAttribute('aria-label', blocked ? 'Playback paused by motion preference' : playing ? 'Pause the adjustment' : generation === LAST_GENERATION ? 'Replay the adjustment' : 'Play the adjustment');
    playButton.querySelector('span').textContent = blocked ? 'Motion paused' : playing ? 'Pause story' : generation === LAST_GENERATION ? 'Replay story' : 'Play the story';
    playButton.querySelector('path').setAttribute('d', playing ? 'M7 4v12M13 4v12' : 'm7 4 9 6-9 6Z');
    root.classList.toggle('econ-playing', playing && visible && !document.hidden);
  }
  function stop() {
    playing = false;
    cancelAnimationFrame(frame);
    frame = 0;
    lastTime = 0;
    syncPlayButton();
  }
  // Use the animation clock rather than queued timers; background/offscreen time
  // never advances the economy, and each step remains a whole model generation.
  function tick(time) {
    frame = 0;
    if (!playing) return;
    if (paused()) { stop(); return; }
    if (!visible || document.hidden) { lastTime = 0; return; }
    if (lastTime) elapsed += Math.min(time - lastTime, 100);
    lastTime = time;
    const duration = generation <= 0 ? 1600 : 900;
    if (elapsed >= duration) {
      elapsed = 0;
      generation = Math.min(LAST_GENERATION, generation + 1);
      render();
      if (generation === LAST_GENERATION) {
        stop();
        put('#econ-announcement', `${phase()}. ${explanation()}`);
        return;
      }
    }
    frame = requestAnimationFrame(tick);
  }
  function resumeClock() {
    syncPlayButton();
    if (playing && visible && !document.hidden && !frame) frame = requestAnimationFrame(tick);
  }
  root.querySelectorAll('[data-econ-view]').forEach(button => button.addEventListener('click', () => {
    if (button.dataset.econView === view) return;
    view = button.dataset.econView;
    root.querySelectorAll('[data-econ-view]').forEach(control => control.setAttribute('aria-pressed', String(control === button)));
    root.querySelectorAll('.econ-panel').forEach(panel => { panel.hidden = panel.id !== `econ-${view}`; });
    render();
    sceneAnimation?.cancel();
    if (!paused()) sceneAnimation = find(`#econ-${view}`).animate([{ opacity: 0.35 }, { opacity: 1 }], { duration: 240, easing: 'ease-out' });
  }));
  root.querySelectorAll('[data-econ-metric]').forEach(button => button.addEventListener('click', () => {
    metric = button.dataset.econMetric;
    root.querySelectorAll('[data-econ-metric]').forEach(control => control.setAttribute('aria-pressed', String(control === button)));
    updateGraph(stateAt(generation));
  }));
  root.querySelectorAll('[data-econ-generation]').forEach(button => button.addEventListener('click', () => {
    stop();
    elapsed = 0;
    generation = Number(button.dataset.econGeneration);
    render(true);
    syncPlayButton();
  }));
  slider.addEventListener('input', () => {
    stop();
    elapsed = 0;
    generation = Number(slider.value);
    render();
    syncPlayButton();
  });
  slider.addEventListener('change', () => render(true));
  playButton.addEventListener('click', () => {
    if (playing) { stop(); return; }
    if (paused()) return;
    if (generation === LAST_GENERATION) { generation = -1; render(); }
    playing = true;
    elapsed = 0;
    lastTime = 0;
    resumeClock();
  });
  function syncMotionPreference() {
    if (paused()) { sceneAnimation?.cancel(); stop(); }
    else syncPlayButton();
  }
  new MutationObserver(syncMotionPreference).observe(document.body, { attributes: true, attributeFilter: ['class'] });
  reducedMotion.addEventListener('change', syncMotionPreference);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(frame); frame = 0; lastTime = 0; }
    resumeClock();
  });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      if (!visible) { cancelAnimationFrame(frame); frame = 0; lastTime = 0; }
      resumeClock();
    }, { threshold: 0.15 }).observe(root);
  }
  render();
  syncMotionPreference();
}
