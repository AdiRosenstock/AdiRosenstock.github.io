import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { DEFAULT_PARAMETERS, runModel, validateParameters } from '../dist/economics-lab.js';
import { PYTHON_PARAMETERS, parameterCell, pythonScript, createNotebook } from '../dist/economics-notebook.js';

const pythonModel = readFileSync(new URL('../dist/assets/malthusian-rebellion/simulation.py', import.meta.url), 'utf8');

const close = (actual, expected) => assert.ok(
  Math.abs(actual - expected) <= 1e-8 * Math.max(1, Math.abs(expected)),
  `${actual} should be close to ${expected}`
);

test('paper baseline agrees with its analytical transition at every generation', () => {
  const result = runModel(DEFAULT_PARAMETERS);
  const initialPopulation = 100000 * 0.5 ** (1 / 0.35);
  for (const row of result.history) {
    close(row.consumption, 0.7 * 2 ** (0.65 ** row.t));
    close(row.population, initialPopulation * 2 ** ((1 - 0.65 ** row.t) / 0.35));
  }
  close(result.history[0].consumption, 1.4);
  assert.ok(result.history[9].consumptionRatio > 1.01);
  assert.ok(result.history[10].consumptionRatio < 1.01);
});

test('one-time technology and extraction changes converge to the same income', () => {
  for (const patch of [{ newTax: 0.5, technologyBoost: 1.5 }, { newTax: 0.75 },
    { technologyBoost: 1.5 }, { gamma: 0.25, rho: 0.4 }, { initialTax: 0, newTax: 0 }]) {
    const p = { ...DEFAULT_PARAMETERS, ...patch, generations: 120 };
    const result = runModel(p);
    close(result.history.at(-1).income, p.rho / p.gamma);
    close(result.history.at(-1).consumption, (1 - p.gamma) * p.rho / p.gamma);
    close(result.history.at(-1).population, result.longRunPopulation);
    for (let t = 0; t < p.generations; t++) {
      close(result.history[t + 1].population, result.history[t].population * result.history[t].children);
    }
  }
});

test('continual innovation follows the analytical income path and has no stationary population', () => {
  const p = { ...DEFAULT_PARAMETERS, newTax: 0.25, technologyBoost: 1.5, technologyGrowth: 0.02, generations: 120 };
  const result = runModel(p);
  const shock = p.technologyBoost * (1 - p.newTax) / (1 - p.initialTax);
  for (const row of result.history) {
    const logRatio = p.alpha ** row.t * Math.log(shock)
      + (1 - p.alpha ** row.t) / (1 - p.alpha) * Math.log1p(p.technologyGrowth);
    close(row.consumptionRatio, Math.exp(logRatio));
  }
  assert.equal(result.longRunPopulation, null);
  assert.ok(result.longRunIncome > result.initialIncome);
  assert.ok(result.history.at(-1).population > result.history.at(-2).population);
  close(result.history.at(-1).consumption, result.longRunConsumption);
});

test('land scales population while per-worker living standards stay the same', () => {
  const original = runModel(DEFAULT_PARAMETERS);
  const doubled = runModel({ ...DEFAULT_PARAMETERS, land: 200000 });
  original.history.forEach((row, t) => {
    close(doubled.history[t].population, row.population * 2);
    close(doubled.history[t].consumption, row.consumption);
  });
});

test('editable parameters reject invalid equations and all permitted extremes stay finite', () => {
  for (const invalid of [null, [], {}, { ...DEFAULT_PARAMETERS, alpha: 1 },
    { ...DEFAULT_PARAMETERS, newTax: 1 }, { ...DEFAULT_PARAMETERS, gamma: 0 },
    { ...DEFAULT_PARAMETERS, rho: 0 }, { ...DEFAULT_PARAMETERS, generations: 10.5 },
    { ...DEFAULT_PARAMETERS, land: Infinity }, { ...DEFAULT_PARAMETERS, rho: NaN },
    { ...DEFAULT_PARAMETERS, technologyGrowth: '0.02' }, { ...DEFAULT_PARAMETERS, unknown: 1 }]) {
    assert.throws(() => validateParameters(invalid));
  }
  const p = validateParameters({ ...DEFAULT_PARAMETERS, alpha: 0.85, gamma: 0.5, rho: 0.1,
    technologyBoost: 3, technologyGrowth: 0.04, land: 1000000, generations: 120 });
  assert.ok(runModel(p).history.every(row => Object.values(row).every(Number.isFinite)));
});

test('real Python matches the browser preview for baseline and changed parameters', () => {
  const scenarios = [{ ...DEFAULT_PARAMETERS },
    { ...DEFAULT_PARAMETERS, newTax: 0.5, technologyBoost: 1.5 },
    { ...DEFAULT_PARAMETERS, technologyGrowth: 0.02, alpha: 0.8 },
    { ...DEFAULT_PARAMETERS, newTax: 0.75, gamma: 0.25, rho: 0.4, land: 200000 },
    { ...DEFAULT_PARAMETERS, alpha: 0.85, gamma: 0.5, rho: 0.1, technologyBoost: 3,
      technologyGrowth: 0.04, generations: 120, land: 1000000 }];
  const argumentNames = PYTHON_PARAMETERS.map(([key]) => key);
  const source = pythonModel + `\nimport json, sys\ndata = json.load(sys.stdin)\nprint(json.dumps([simulate(*[p[key] for key in data["keys"]]) for p in data["scenarios"]]))\n`;
  const results = JSON.parse(execFileSync('python3', ['-c', source], {
    input: JSON.stringify({ keys: argumentNames, scenarios }), encoding: 'utf8', timeout: 5000
  }));
  results.forEach((result, index) => {
    const expected = runModel(scenarios[index]);
    result.history.forEach((row, t) => Object.keys(row).forEach(key => close(row[key], expected.history[t][key])));
    close(result.longRunConsumption, expected.longRunConsumption);
    if (result.longRunPopulation !== null) close(result.longRunPopulation, expected.longRunPopulation);
    else assert.equal(expected.longRunPopulation, null);
  });
});

test('copied Python runs with arithmetic assignments and prints the model output', () => {
  const parameters = parameterCell(DEFAULT_PARAMETERS).replace('tau_after = 0.00', 'tau_after = 1 / 4');
  const copied = pythonScript(parameters, pythonModel);
  const output = execFileSync('python3', ['-c', copied], { encoding: 'utf8', timeout: 5000 });
  assert.match(output, /Generation\s+Population\s+Income\s+Consumption/);
  assert.match(output, /1\.050/); // Initial consumption with extraction cut from 50% to 25%.
  assert.match(output, /0\.700/);
});

test('download is a valid Python notebook with executable cells and Matplotlib plots', () => {
  const notebook = createNotebook(parameterCell(DEFAULT_PARAMETERS), pythonModel);
  assert.equal(notebook.nbformat, 4);
  assert.equal(notebook.metadata.kernelspec.name, 'python3');
  assert.ok(notebook.cells.filter(cell => cell.cell_type === 'code').every(cell => cell.execution_count === null && cell.outputs.length === 0));
  const verify = `import ast, json, sys\nnotebook = json.load(sys.stdin)\nscope = {}\nfor cell in notebook["cells"]:\n    if cell["cell_type"] == "code":\n        ast.parse(cell["source"])\n        if cell["id"] != "graphs":\n            exec(cell["source"], scope)\nassert abs(scope["history"][0]["consumption"] - 1.4) < 1e-9\nassert "matplotlib.pyplot" in notebook["cells"][-1]["source"]\n`;
  execFileSync('python3', ['-c', verify], { input: JSON.stringify(notebook), encoding: 'utf8', timeout: 5000 });
});

test('Python enforces the same parameter limits and identifies invalid values', () => {
  const parameters = parameterCell(DEFAULT_PARAMETERS).replace('alpha = 0.65', 'alpha = 1.0');
  assert.throws(() => execFileSync('python3', ['-c', pythonScript(parameters, pythonModel)], { stdio: 'pipe', timeout: 5000 }), /alpha must be a number/);
});
