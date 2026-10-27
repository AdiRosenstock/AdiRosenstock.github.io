import { PYTHON_PARAMETERS, RUN_CELL, parameterCell, pythonScript, createNotebook, highlightPython } from './economics-notebook.js?v=7301b0cbc5bd';

export const DEFAULT_PARAMETERS = Object.freeze({
  initialTax: 0.5,
  newTax: 0,
  technologyBoost: 1,
  technologyGrowth: 0,
  alpha: 0.65,
  gamma: 0.3,
  rho: 0.3,
  land: 100000,
  generations: 30
});

const BOUNDS = {
  initialTax: [0, 0.75], newTax: [0, 0.75], technologyBoost: [1, 3],
  technologyGrowth: [0, 0.04], alpha: [0.3, 0.85], gamma: [0.1, 0.5],
  rho: [0.1, 0.6], land: [1000, 1000000], generations: [10, 120]
};

export function validateParameters(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Define all of the parameters in the Python cell.');
  for (const key of Object.keys(value)) {
    if (!Object.hasOwn(BOUNDS, key)) throw new Error(`Unknown parameter: ${key}. Use the names shown in the example.`);
  }
  for (const [key, [min, max]] of Object.entries(BOUNDS)) {
    if (typeof value[key] !== 'number' || !Number.isFinite(value[key]) || value[key] < min || value[key] > max) {
      throw new Error(`${key} must be a number between ${min} and ${max}.`);
    }
  }
  if (!Number.isInteger(value.generations)) throw new Error('generations must be a whole number.');
  return { ...value };
}

// An instant slider preview of the Python model. Cross-language tests verify
// both implementations; running the notebook cell uses actual Python results.
export function runModel(p) {
  const { initialTax, newTax, technologyBoost, technologyGrowth,
    alpha, gamma, rho, land, generations } = p;
  const initialPopulation = land * ((1 - initialTax) * gamma / rho) ** (1 / (1 - alpha));
  const initialIncome = rho / gamma;
  const initialConsumption = (1 - gamma) * initialIncome;
  const initialOutput = initialPopulation * initialIncome / (1 - initialTax);
  let population = initialPopulation;
  const history = [];
  for (let t = 0; t <= generations; t++) {
    const technology = technologyBoost * (1 + technologyGrowth) ** t;
    const output = technology * population ** alpha * land ** (1 - alpha);
    const income = (1 - newTax) * output / population;
    const consumption = (1 - gamma) * income;
    const children = gamma * income / rho;
    history.push({ t, population, output, income, consumption, children,
      consumptionRatio: consumption / initialConsumption,
      populationRatio: population / initialPopulation,
      outputRatio: output / initialOutput });
    population *= children;
  }
  const longRunIncome = initialIncome * (1 + technologyGrowth) ** (1 / (1 - alpha));
  const longRunConsumption = (1 - gamma) * longRunIncome;
  const longRunPopulation = technologyGrowth === 0
    ? land * (technologyBoost * (1 - newTax) * gamma / rho) ** (1 / (1 - alpha))
    : null; // With continual innovation, population keeps growing.
  return { history, initialPopulation, initialIncome, initialConsumption,
    longRunIncome, longRunConsumption, longRunPopulation };
}

const lab = typeof document !== 'undefined' && document.querySelector('#economics-lab');
if (lab) mountLab(lab);

function mountLab(root) {
  const presets = {
    rebellion: { title: 'Remove extraction', values: {} },
    technology: { title: 'Better technology', values: { newTax: 0.5, technologyBoost: 1.5 } },
    both: { title: 'Change both', values: { technologyBoost: 1.5 } },
    growth: { title: 'Continual innovation', values: { newTax: 0.5, technologyGrowth: 0.02 } }
  };
  const fields = [
    { key: 'newTax', label: 'Extraction after the change', step: 0.01, percent: true, hint: 'The share of output taken from workers.' },
    { key: 'technologyBoost', label: 'One-time technology improvement', step: 0.05, multiple: true, hint: 'A permanent increase in productivity at generation 0.' },
    { key: 'technologyGrowth', label: 'Technology growth each generation', step: 0.001, percent: true, hint: 'New improvements continue after the initial change.' },
    { key: 'alpha', label: 'Labor exponent α', step: 0.01, hint: 'Higher α means diminishing returns set in more slowly.' },
    { key: 'initialTax', label: 'Initial extraction', step: 0.01, percent: true, hint: 'Determines the equilibrium before the experiment.', advanced: true },
    { key: 'gamma', label: 'Preference weight on children γ', step: 0.01, percent: true, hint: 'The share of retained income spent raising children.', advanced: true },
    { key: 'rho', label: 'Cost per surviving child ρ', step: 0.01, hint: 'Higher costs reduce children at a given income.', advanced: true }
  ];
  const fieldHTML = field => `<div class="lab-field"><label for="lab-${field.key}">${field.label}<output id="lab-${field.key}-value" for="lab-${field.key}"></output></label><input id="lab-${field.key}" data-lab-parameter="${field.key}" type="range" min="${BOUNDS[field.key][0]}" max="${BOUNDS[field.key][1]}" step="${field.step}" aria-describedby="lab-${field.key}-hint"><p id="lab-${field.key}-hint">${field.hint}</p></div>`;
  root.innerHTML = `
    <div class="lab-presets" role="group" aria-label="Experiment presets">${Object.entries(presets).map(([key, preset]) => `<button type="button" data-lab-preset="${key}" aria-pressed="${key === 'rebellion'}">${preset.title}</button>`).join('')}</div>
    <div class="lab-workbench">
      <div class="lab-parameters" role="group" aria-label="Simulation parameters">
        <h3>Change an assumption</h3>
        ${fields.filter(field => !field.advanced).map(fieldHTML).join('')}
        <details class="lab-advanced"><summary>Households & starting conditions</summary>${fields.filter(field => field.advanced).map(fieldHTML).join('')}</details>
        <button class="lab-reset" data-lab-reset type="button">Restore original values</button>
      </div>
      <div class="lab-results">
        <div class="lab-results-heading"><h3>Your simulated economy</h3><span id="lab-current-time">Generation 60</span></div>
        <dl class="lab-stats"><div><dt>Consumption / worker</dt><dd id="lab-consumption"></dd><span id="lab-consumption-change"></span></div><div><dt>Worker population</dt><dd id="lab-population"></dd><span id="lab-population-change"></span></div><div><dt>Long-run consumption</dt><dd id="lab-equilibrium"></dd><span id="lab-equilibrium-note"></span></div></dl>
        <div class="lab-metric-controls" role="group" aria-label="Simulation graph outcome"><button type="button" data-lab-metric="consumptionRatio" aria-pressed="true">Consumption / worker</button><button type="button" data-lab-metric="populationRatio" aria-pressed="false">Population</button><button type="button" data-lab-metric="outputRatio" aria-pressed="false">Total output</button></div>
        <svg class="lab-chart" viewBox="0 0 520 270" role="img" aria-labelledby="lab-chart-title lab-chart-description"><title id="lab-chart-title">Consumption per worker</title><desc id="lab-chart-description"></desc><text x="50" y="22" class="lab-svg-caption">× level before the change</text><g id="lab-grid"></g><path d="M52 36V216H500" class="lab-axis"/><path id="lab-baseline" class="lab-baseline"/><path id="lab-series" class="lab-series"/><path id="lab-cursor" class="lab-cursor"/><circle id="lab-point" r="5" class="lab-point"/><g id="lab-x-ticks"></g><text x="276" y="262" text-anchor="middle" class="lab-svg-caption">Generations after the change</text></svg>
        <div class="lab-legend"><span><i></i>Your experiment</span><span><i></i>Starting equilibrium</span></div>
        <div class="lab-time"><button id="lab-play" type="button">▶ Replay transition</button><label for="lab-time">Inspect generation <output id="lab-time-value" for="lab-time">60</output></label><input id="lab-time" type="range" min="0" max="60" step="1" value="60"></div>
        <p class="lab-reading" id="lab-reading"></p>
        <p class="lab-scope">This sandbox runs the deterministic model. Continual innovation extends the paper’s fixed-technology setup. The original 5,000-run Monte Carlo experiment, including harvest and demographic shocks, is shown below. Model generations are not years.</p>
      </div>
    </div>
    <details class="lab-code" id="lab-notebook" open><summary>A Python notebook you can experiment with.</summary>
      <p>Change a Python variable, then run the cell with Shift+Enter. Python runs in your browser and updates the graphs above. Sliders give an instant preview of the same model.</p>
      <div class="lab-notebook-toolbar"><span class="lab-notebook-name">malthusian_experiment.ipynb</span><span class="lab-kernel" id="lab-kernel">Python · ready to load</span><button class="lab-copy" type="button" disabled>Copy Python</button><button class="lab-download" type="button" disabled>Download .ipynb</button></div>
      <div class="lab-notebook-cells">
        <form id="lab-code-form" class="lab-notebook-cell"><span class="lab-cell-prompt" id="lab-input-prompt" aria-hidden="true">In [ ]:</span><div class="lab-cell-body"><label for="lab-config">Choose the parameters</label><textarea id="lab-config" wrap="off" spellcheck="false" autocapitalize="off" autocomplete="off" aria-describedby="lab-code-help lab-code-status"></textarea><p id="lab-code-help">Use decimals for rates: 0.50 means 50%. The first run loads Python; later runs reuse it.</p><div class="lab-code-actions"><button class="button button-primary" id="lab-run-python" type="submit" disabled>▶ Run cell</button><button class="button button-outline" data-lab-reset type="button">Restore original values</button><button id="lab-stop-python" type="button" hidden>Stop</button><span class="lab-shortcut">Shift+Enter</span></div><pre id="lab-code-status" role="status" aria-live="polite"></pre></div></form>
        <div class="lab-notebook-cell"><span class="lab-cell-prompt" id="lab-model-prompt" aria-hidden="true">In [ ]:</span><div class="lab-cell-body lab-model-code"><p>The model · executed with your parameters</p><pre tabindex="0" aria-label="Python simulation code"><code>Loading the Python model…</code></pre></div></div>
        <div class="lab-notebook-cell lab-notebook-output"><span class="lab-cell-prompt" id="lab-output-prompt" aria-hidden="true">Out [ ]:</span><div class="lab-cell-body"><p id="lab-output-label">Preview · run the cell for Python output</p><div class="lab-output-table" tabindex="0" role="region" aria-label="Notebook simulation output"><table><thead><tr><th scope="col">Generation</th><th scope="col">Population</th><th scope="col">Income</th><th scope="col">Consumption</th></tr></thead><tbody id="lab-output-rows"></tbody></table></div><pre id="lab-stdout" hidden></pre></div></div>
      </div>
    </details>
    <p id="lab-status" class="econ-sr-only" role="status" aria-live="polite" aria-atomic="true"></p>
  `;
  const find = selector => root.querySelector(selector);
  const put = (selector, text) => { find(selector).textContent = text; };
  const editor = find('#lab-config');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const paused = () => reducedMotion.matches || document.body.classList.contains('motion-paused');
  const format = value => new Intl.NumberFormat('en-US', { maximumFractionDigits: value < 10 ? 2 : 0 }).format(value);
  const compact = value => new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(value);
  const ratio = value => value < 100 ? value.toFixed(2) : compact(value);
  let parameters = { ...DEFAULT_PARAMETERS };
  let result = runModel(parameters);
  let time = parameters.generations;
  let metric = 'consumptionRatio';
  let playing = false;
  let frame = 0;
  let lastTime = 0;
  let elapsed = 0;
  let visible = true;
  let fade;
  let pythonSource = '';
  let pythonWorker;
  let pythonRunning = false;
  let pythonRunId = 0;
  let pythonExecutionCount = 0;
  let pythonTimeout;
  let currentRunSource = '';
  const metricNames = { consumptionRatio: 'Consumption per worker', populationRatio: 'Worker population', outputRatio: 'Total output' };
  const pointX = t => 82 + t / parameters.generations * 418;
  let pointY = () => 0;
  function drawChart() {
    const maximum = Math.max(1, ...result.history.map(row => row[metric]));
    pointY = value => 216 - value / maximum * 174;
    const grid = find('#lab-grid');
    grid.replaceChildren();
    for (const value of [0, maximum / 2, maximum]) {
      const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      line.setAttribute('d', `M52 ${pointY(value)}H500`);
      line.setAttribute('class', 'lab-grid-line');
      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', '42');
      label.setAttribute('y', pointY(value) + 4);
      label.setAttribute('text-anchor', 'end');
      label.setAttribute('class', 'lab-svg-caption');
      label.textContent = `${compact(value)}×`;
      group.append(line, label);
      grid.append(group);
    }
    find('#lab-baseline').setAttribute('d', `M52 ${pointY(1)}H500`);
    find('#lab-series').setAttribute('d', `M52 ${pointY(1)}L82 ${pointY(1)}` + result.history.map(row => `L${pointX(row.t).toFixed(2)} ${pointY(row[metric]).toFixed(2)}`).join(''));
    const ticks = find('#lab-x-ticks');
    ticks.replaceChildren();
    for (const value of [0, Math.round(parameters.generations / 2), parameters.generations]) {
      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', pointX(value));
      label.setAttribute('y', '238');
      label.setAttribute('text-anchor', 'middle');
      label.setAttribute('class', 'lab-svg-caption');
      label.textContent = String(value);
      ticks.append(label);
    }
    put('#lab-chart-title', `${metricNames[metric]} in your experiment`);
  }
  function renderTime() {
    const row = result.history[time];
    const rawChange = 100 * (row.consumptionRatio - 1);
    const change = Math.abs(rawChange) < 0.005 ? 0 : rawChange;
    put('#lab-current-time', `Generation ${time}`);
    put('#lab-consumption', row.consumption.toFixed(2));
    put('#lab-consumption-change', `${change >= 0 ? '+' : '−'}${Math.abs(change).toFixed(2)}% vs. before`);
    put('#lab-population', format(row.population));
    put('#lab-population-change', `${ratio(row.populationRatio)}× the initial population`);
    put('#lab-equilibrium', result.longRunConsumption.toFixed(2));
    put('#lab-equilibrium-note', parameters.technologyGrowth > 0 ? 'With continual innovation' : 'Same as before the change');
    find('#lab-time').value = String(time);
    find('#lab-time').max = String(parameters.generations);
    put('#lab-time-value', time);
    find('#lab-time').setAttribute('aria-valuetext', `Generation ${time}, consumption ${row.consumption.toFixed(2)}, population ${format(row.population)}`);
    find('#lab-point').setAttribute('cx', pointX(time));
    find('#lab-point').setAttribute('cy', pointY(row[metric]));
    find('#lab-cursor').setAttribute('d', `M${pointX(time)} 36V216`);
    put('#lab-chart-description', `${metricNames[metric]}. At generation ${time}, ${compact(row[metric])} times its initial level. The dashed line holds the starting equilibrium at 1 times its initial level. Your experiment initially changes consumption by ${(100 * (result.history[0].consumptionRatio - 1)).toFixed(1)} percent.`);
  }
  function reading() {
    const shock = 100 * (result.history[0].consumptionRatio - 1);
    const initial = Math.abs(shock) < 0.01 ? 'There is no immediate change in consumption.' : `Consumption ${shock >= 0 ? 'rises' : 'falls'} ${Math.abs(shock).toFixed(1)}% immediately.`;
    if (parameters.technologyGrowth > 0) {
      const gain = 100 * (result.longRunConsumption / result.initialConsumption - 1);
      return `${initial} With technology improving ${(100 * parameters.technologyGrowth).toFixed(1)}% each generation, long-run consumption approaches ${result.longRunConsumption.toFixed(2)}, ${gain.toFixed(1)}% above its initial level. Population keeps growing; it does not settle at a fixed size.`;
    }
    const populationRatio = result.longRunPopulation / result.initialPopulation;
    return `${initial} With no further technology growth, consumption returns to ${result.initialConsumption.toFixed(2)} as population adjusts. The eventual population is ${ratio(populationRatio)}× its initial size. A permanent change in extraction or technology changes how many people the economy supports.`;
  }
  function setPreset(selected) {
    root.querySelectorAll('[data-lab-preset]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.labPreset === selected)));
  }
  function updateInputs(keepSource = false) {
    for (const field of fields) {
      const value = parameters[field.key];
      find(`#lab-${field.key}`).value = String(value);
      const label = field.percent ? `${(100 * value).toFixed(1)}%` : field.multiple ? `${value.toFixed(2)}×` : value.toFixed(2);
      put(`#lab-${field.key}-value`, label);
      find(`#lab-${field.key}`).setAttribute('aria-valuetext', label);
    }
    if (!keepSource) editor.value = parameterCell(parameters);
    editor.removeAttribute('aria-invalid');
    put('#lab-code-status', '');
  }
  function apply(next, preset = '', pythonResult = null) {
    if (pythonRunning) cancelPython();
    stop();
    parameters = validateParameters(next);
    result = pythonResult || runModel(parameters);
    time = parameters.generations;
    setPreset(preset);
    updateInputs(Boolean(pythonResult));
    drawChart();
    renderTime();
    put('#lab-reading', reading());
    renderNotebookOutput(Boolean(pythonResult));
    fade?.cancel();
    if (!paused()) fade = find('.lab-chart').animate([{ opacity: 0.4 }, { opacity: 1 }], { duration: 240, easing: 'ease-out' });
  }
  function syncPlay() {
    const button = find('#lab-play');
    button.disabled = paused();
    button.textContent = paused() ? 'Motion paused' : playing ? 'Ⅱ Pause transition' : '▶ Replay transition';
  }
  function stop() {
    playing = false;
    cancelAnimationFrame(frame);
    frame = 0;
    lastTime = 0;
    elapsed = 0;
    syncPlay();
  }
  function tick(now) {
    frame = 0;
    if (!playing) return;
    if (paused()) { stop(); return; }
    if (!visible || document.hidden) { lastTime = 0; return; }
    if (lastTime) elapsed += Math.min(now - lastTime, 100);
    lastTime = now;
    if (elapsed >= 12000 / parameters.generations) {
      elapsed = 0;
      time++;
      renderTime();
      if (time >= parameters.generations) { stop(); put('#lab-status', `Transition complete. ${reading()}`); return; }
    }
    frame = requestAnimationFrame(tick);
  }
  function resumeClock() {
    if (playing && visible && !document.hidden && !frame) frame = requestAnimationFrame(tick);
  }
  root.querySelectorAll('[data-lab-parameter]').forEach(input => input.addEventListener('input', () => {
    apply({ ...parameters, [input.dataset.labParameter]: Number(input.value) });
  }));
  root.querySelectorAll('[data-lab-parameter]').forEach(input => input.addEventListener('change', () => put('#lab-status', reading())));
  root.querySelectorAll('[data-lab-preset]').forEach(button => button.addEventListener('click', () => {
    const preset = button.dataset.labPreset;
    apply({ ...DEFAULT_PARAMETERS, ...presets[preset].values }, preset);
    put('#lab-status', `${presets[preset].title}. ${reading()}`);
  }));
  root.querySelectorAll('[data-lab-metric]').forEach(button => button.addEventListener('click', () => {
    metric = button.dataset.labMetric;
    root.querySelectorAll('[data-lab-metric]').forEach(control => control.setAttribute('aria-pressed', String(control === button)));
    drawChart();
    renderTime();
  }));
  root.querySelectorAll('[data-lab-reset]').forEach(button => button.addEventListener('click', () => {
    apply({ ...DEFAULT_PARAMETERS }, 'rebellion');
    const message = 'Original values restored. The Python code, sliders, and graphs match the paper’s baseline.';
    put('#lab-code-status', message);
    put('#lab-status', message);
    put('#lab-kernel', pythonSource ? 'Python · ready to run' : 'Python · ready to load');
  }));
  find('#lab-time').addEventListener('input', event => { stop(); time = Number(event.target.value); renderTime(); });
  find('#lab-play').addEventListener('click', () => {
    if (playing) { stop(); return; }
    if (paused()) return;
    time = 0;
    renderTime();
    playing = true;
    syncPlay();
    resumeClock();
  });
  function renderNotebookOutput(fromPython = false) {
    const count = pythonExecutionCount;
    put('#lab-input-prompt', fromPython ? `In [${count - 1}]:` : 'In [ ]:');
    put('#lab-model-prompt', fromPython ? `In [${count}]:` : 'In [ ]:');
    put('#lab-output-prompt', fromPython ? `Out [${count}]:` : 'Out [ ]:');
    put('#lab-output-label', fromPython ? `Python output · ${parameters.generations} generations calculated` : 'Preview · run the cell for Python output');
    const rows = [0, 1, 5, 10, parameters.generations].filter((value, index, all) => value <= parameters.generations && all.indexOf(value) === index);
    find('#lab-output-rows').replaceChildren(...rows.map(t => {
      const row = result.history[t];
      const element = document.createElement('tr');
      for (const value of [t, format(row.population), row.income.toFixed(3), row.consumption.toFixed(3)]) {
        const cell = document.createElement('td');
        cell.textContent = String(value);
        element.append(cell);
      }
      return element;
    }));
    find('#lab-stdout').hidden = true;
  }
  function setPythonBusy(busy) {
    pythonRunning = busy;
    editor.readOnly = busy;
    find('#lab-code-form').setAttribute('aria-busy', String(busy));
    find('#lab-run-python').disabled = busy || !pythonSource;
    find('#lab-run-python').textContent = busy ? 'Running…' : '▶ Run cell';
    find('#lab-stop-python').hidden = !busy;
  }
  function cancelPython(message = 'Python stopped. Your previous results are still shown.') {
    clearTimeout(pythonTimeout);
    pythonWorker?.terminate();
    pythonWorker = undefined;
    pythonRunId++;
    setPythonBusy(false);
    put('#lab-kernel', 'Python · ready to load');
    put('#lab-input-prompt', 'In [ ]:');
    put('#lab-model-prompt', 'In [ ]:');
    put('#lab-code-status', message);
  }
  function setPythonTimeout(duration) {
    clearTimeout(pythonTimeout);
    pythonTimeout = setTimeout(() => cancelPython('Python took too long. Your code is preserved; try again or download the notebook.'), duration);
  }
  function pythonFailed(message) {
    clearTimeout(pythonTimeout);
    setPythonBusy(false);
    editor.setAttribute('aria-invalid', 'true');
    put('#lab-kernel', 'Python · check cell');
    put('#lab-input-prompt', 'In [ ]:');
    put('#lab-model-prompt', 'In [ ]:');
    put('#lab-code-status', message);
  }
  function getPythonWorker() {
    if (pythonWorker) return pythonWorker;
    pythonWorker = new Worker(new URL('./economics-python-worker.js?v=d2c48db4408a', import.meta.url), { type: 'module' });
    pythonWorker.onmessage = ({ data }) => {
      if (data.id !== pythonRunId || !pythonRunning) return;
      if (data.phase === 'loading') {
        put('#lab-kernel', 'Python · loading');
        put('#lab-code-status', 'Loading Python for the first run. This can take a moment.');
      } else if (data.phase === 'running') {
        put('#lab-kernel', 'Python · running');
        put('#lab-code-status', 'Executing the Python cells…');
        setPythonTimeout(15000);
      } else if (data.phase === 'error') {
        put('#lab-kernel', 'Python · check cell');
        pythonFailed(data.error);
      } else if (data.phase === 'complete') {
        try {
          const next = validateParameters(data.parameters);
          if (data.result?.history?.length !== next.generations + 1 || !data.result.history.every((row, t) => row.t === t && Object.values(row).every(Number.isFinite))) throw new Error('The model must return finite simulation results for every generation.');
          clearTimeout(pythonTimeout);
          setPythonBusy(false);
          pythonExecutionCount += 2;
          apply(next, '', data.result);
          editor.value = currentRunSource;
          put('#lab-kernel', 'Python · ready');
          put('#lab-code-status', `Python ran successfully. The graphs now show your ${next.generations}-generation simulation.`);
          put('#lab-stdout', data.stdout || '');
          find('#lab-stdout').hidden = !data.stdout;
        } catch (error) { pythonFailed(error.message); }
      }
    };
    pythonWorker.onerror = event => {
      event.preventDefault();
      cancelPython('Python could not load. Try Run cell again, or download the notebook to run it in Jupyter.');
    };
    return pythonWorker;
  }
  find('#lab-code-form').addEventListener('submit', event => {
    event.preventDefault();
    if (pythonRunning || !pythonSource) return;
    stop();
    currentRunSource = editor.value;
    editor.removeAttribute('aria-invalid');
    setPythonBusy(true);
    put('#lab-input-prompt', 'In [*]:');
    put('#lab-model-prompt', 'In [*]:');
    put('#lab-code-status', 'Starting Python…');
    setPythonTimeout(60000);
    const id = ++pythonRunId;
    try {
      getPythonWorker().postMessage({ id, source: currentRunSource, model: pythonSource, runCell: RUN_CELL, parameterNames: PYTHON_PARAMETERS });
    } catch { cancelPython('Python could not start. Try again or download the notebook.'); }
  });
  editor.addEventListener('keydown', event => {
    if (event.key === 'Enter' && (event.shiftKey || event.ctrlKey) && !event.isComposing) {
      event.preventDefault();
      find('#lab-code-form').requestSubmit();
    }
  });
  find('#lab-stop-python').addEventListener('click', () => cancelPython());
  find('.lab-copy').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(pythonScript(editor.value, pythonSource));
      put('#lab-code-status', 'Python copied, including your parameter cell and the simulation model.');
    } catch { put('#lab-code-status', 'Copy is unavailable here. Select the parameters and model code to copy them manually.'); }
  });
  find('.lab-download').addEventListener('click', () => {
    const notebook = createNotebook(editor.value, pythonSource);
    const url = URL.createObjectURL(new Blob([JSON.stringify(notebook, null, 2)], { type: 'application/x-ipynb+json' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'malthusian_experiment.ipynb';
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    put('#lab-code-status', 'Notebook downloaded. Open it in Jupyter and run all cells, including the Matplotlib graphs.');
  });
  function syncMotion() {
    if (paused()) { fade?.cancel(); stop(); }
    else syncPlay();
  }
  new MutationObserver(syncMotion).observe(document.body, { attributes: true, attributeFilter: ['class'] });
  reducedMotion.addEventListener('change', syncMotion);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(frame); frame = 0; lastTime = 0; }
    else resumeClock();
  });
  if ('IntersectionObserver' in window) new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    if (!visible) { cancelAnimationFrame(frame); frame = 0; lastTime = 0; }
    else resumeClock();
  }, { threshold: 0.12 }).observe(find('.lab-workbench'));
  fetch(new URL('./assets/malthusian-rebellion/simulation.py?v=98160d8cd678', import.meta.url), { cache: 'no-cache' })
    .then(response => { if (!response.ok) throw new Error('Python model unavailable.'); return response.text(); })
    .then(source => {
      pythonSource = source;
      find('.lab-model-code code').innerHTML = highlightPython(source + '\n\n' + RUN_CELL);
      find('#lab-run-python').disabled = false;
      find('.lab-copy').disabled = false;
      find('.lab-download').disabled = false;
    })
    .catch(() => { put('#lab-code-status', 'The Python model could not load. Reload to try again; the slider preview still works.'); });
  updateInputs();
  drawChart();
  renderTime();
  put('#lab-reading', reading());
  renderNotebookOutput();
  syncMotion();
}
