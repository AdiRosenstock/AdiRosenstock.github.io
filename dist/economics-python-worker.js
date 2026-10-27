// The runtime is downloaded only when a visitor explicitly runs a Python cell.
// A module worker keeps Python execution away from the page's UI thread.
let runtime;
self.onmessage = async ({ data }) => {
  const { id, source, model, runCell, parameterNames } = data;
  let globals;
  try {
    if (!runtime) {
      self.postMessage({ id, phase: 'loading' });
      runtime = import('https://cdn.jsdelivr.net/pyodide/v314.0.7/full/pyodide.mjs')
        .then(({ loadPyodide }) => loadPyodide());
    }
    const python = await runtime;
    self.postMessage({ id, phase: 'running' });
    const stdout = [];
    python.setStdout({ batched: line => { if (stdout.join('\n').length < 8000) stdout.push(line); } });
    globals = python.toPy({});
    await python.runPythonAsync(source, { globals });
    const userOutput = stdout.join('\n');
    stdout.length = 0;
    const parametersExpression = '{' + parameterNames.map(([key, name]) => `${JSON.stringify(key)}: ${name}`).join(', ') + '}';
    const output = await python.runPythonAsync(
      `${model}\n\n${runCell}\nimport json as _json\n_json.dumps(dict(parameters=${parametersExpression}, result=result), allow_nan=False)`,
      { globals }
    );
    self.postMessage({ id, phase: 'complete', ...JSON.parse(output), stdout: userOutput });
  } catch (error) {
    if (!globals) runtime = undefined;
    self.postMessage({ id, phase: 'error', error: String(error.message || error).slice(-5000) });
  } finally {
    globals?.destroy();
  }
};
