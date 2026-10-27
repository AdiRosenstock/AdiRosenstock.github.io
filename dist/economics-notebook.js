// Shared by the notebook display, downloadable files, and Python worker.
export const PYTHON_PARAMETERS = [
  ['initialTax', 'tau_before', 'Elite share before the change'],
  ['newTax', 'tau_after', 'Elite share after the change'],
  ['technologyBoost', 'A_jump', 'One-time technology multiplier'],
  ['technologyGrowth', 'tech_growth', 'Technology growth each generation'],
  ['alpha', 'alpha', 'Labor exponent'],
  ['gamma', 'gamma', 'Preference weight on children'],
  ['rho', 'rho', 'Cost per surviving child'],
  ['land', 'H', 'Land stays fixed within each run'],
  ['generations', 'generations', 'Number of generations to simulate']
];

export function parameterCell(parameters) {
  return '# Change a value, then press Shift+Enter to run.\n' + PYTHON_PARAMETERS.map(([key, name, comment]) => {
    const value = Number.isInteger(parameters[key])
      ? ['land', 'generations'].includes(key) ? String(parameters[key]) : parameters[key].toFixed(2)
      : String(parameters[key]);
    return `${name} = ${value}`.padEnd(24) + `# ${comment}`;
  }).join('\n') + '\n';
}

export const RUN_CELL = `result = simulate(\n    tau_before, tau_after, A_jump, tech_growth,\n    alpha, gamma, rho, H, generations,\n)\nhistory = result["history"]\n\nprint(f"{'Generation':>10} {'Population':>14} {'Income':>10} {'Consumption':>13}")\nfor row in history:\n    if row["t"] in {0, 1, 5, 10, generations}:\n        print(f"{row['t']:>10} {row['population']:>14,.0f} "\n              f"{row['income']:>10.3f} {row['consumption']:>13.3f}")\n`;

export function pythonScript(parametersSource, modelSource) {
  return parametersSource.trimEnd() + '\n\n' + modelSource.trimEnd() + '\n\n' + RUN_CELL;
}

export function createNotebook(parametersSource, modelSource) {
  const codeCell = (id, source) => ({ id, cell_type: 'code', metadata: {}, execution_count: null, outputs: [], source });
  return {
    nbformat: 4, nbformat_minor: 5,
    metadata: {
      kernelspec: { display_name: 'Python 3', language: 'python', name: 'python3' },
      language_info: { name: 'python', file_extension: '.py', mimetype: 'text/x-python' }
    },
    cells: [
      { id: 'introduction', cell_type: 'markdown', metadata: {}, source: '# The Paradox of Equality\n\nChange the Python parameters, then run all cells. This deterministic sandbox uses the project’s household and production equations. Continual technology growth extends the original fixed-technology setup. A generation is a model period, not a year.\n\nAdi Rosenstock · Northwestern ECON 324\nhttps://adirosenstock.github.io/projects/malthusian-rebellion/' },
      codeCell('parameters', parametersSource),
      codeCell('model', modelSource),
      codeCell('results', RUN_CELL),
      codeCell('graphs', `# Plot the transition (requires matplotlib).\nimport matplotlib.pyplot as plt\n\nfig, axes = plt.subplots(1, 3, figsize=(14, 4))\nfor ax, key, title in zip(\n    axes,\n    ["consumptionRatio", "populationRatio", "outputRatio"],\n    ["Consumption per worker", "Population", "Total output"],\n):\n    ax.plot([row["t"] for row in history], [row[key] for row in history])\n    ax.axhline(1, color="gray", linestyle="--", label="Starting equilibrium")\n    ax.set(title=title, xlabel="Generations after the change", ylabel="× initial level")\n    ax.legend()\nfig.tight_layout()\nplt.show()\n`)
    ]
  };
}

export function highlightPython(source) {
  const escape = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
  return [...source.matchAll(/(#[^\n]*|"""[\s\S]*?"""|"[^"\n]*"|'[^'\n]*'|\b(?:def|return|for|in|if|else|or|not|import|from|raise|None|True|False)\b|\b\d+(?:_\d+)*(?:\.\d+)?\b)|([\s\S])/g)].map(match => {
    if (!match[1]) return escape(match[2]);
    const token = match[1];
    const kind = token.startsWith('#') ? 'comment' : /^["']/.test(token) ? 'string' : /^\d/.test(token) ? 'number' : 'keyword';
    return `<span class="py-${kind}">${escape(token)}</span>`;
  }).join('');
}
