import { cp, mkdir, readdir, rm, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const source = fileURLToPath(new URL('./dist/', import.meta.url));
const output = fileURLToPath(new URL('./.pages/', import.meta.url));
const legacy = join(output, 'AdiRosenstock.io');
const site = 'https://adirosenstock.github.io/';

// The generated artifact retains old asset paths for cached pages and replaces
// old HTML routes with redirects that preserve section anchors and query strings.
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(source, output, { recursive: true });
await cp(source, legacy, { recursive: true });

async function redirectPages(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      await redirectPages(path);
    } else if (entry.name.endsWith('.html')) {
      const route = relative(source, path).split('\\').join('/').replace(/index\.html$/, '');
      const target = site + route;
      await writeFile(join(legacy, relative(source, path)), `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Adi Rosenstock — new address</title>
  <link rel="canonical" href="${target}">
  <script>window.location.replace(${JSON.stringify(target)} + window.location.search + window.location.hash);</script>
  <noscript><meta http-equiv="refresh" content="0; url=${target}"></noscript>
</head>
<body><p>The portfolio has moved. <a href="${target}">Continue to Adi Rosenstock’s portfolio</a>.</p></body>
</html>
`);
    }
  }
}

await redirectPages(source);
console.log('Prepared the root portfolio and redirects for existing portfolio links.');
