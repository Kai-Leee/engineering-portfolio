import { build } from 'esbuild';
import { readFile, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

const result = await build({
  entryPoints: ['main.tsx'], bundle: true, write: false, outdir: 'bundle',
  minify: true, sourcemap: false, format: 'iife', platform: 'browser',
  target: ['es2020'], jsx: 'automatic', legalComments: 'inline',
  define: { 'process.env.NODE_ENV': '"production"' },
});
const script = result.outputFiles.find(file => file.path.endsWith('.js'))?.text;
const styles = result.outputFiles.find(file => file.path.endsWith('.css'))?.text;
assert(script && styles, 'Both JavaScript and CSS must be built');
let html = await readFile('shell.html', 'utf8');
for (const [marker, text] of [['/*__PORTFOLIO_CSS__*/', styles], ['/*__PORTFOLIO_JS__*/', script]]) {
  assert.equal(html.split(marker).length, 2, `Exactly one ${marker} placeholder is required`);
  html = html.replace(marker, () => text.replace(/<\/(script|style)/gi, '<\\/$1'));
}
assert(!html.includes('__PORTFOLIO_'), 'No build placeholders may remain');
await writeFile('index.html', html);
const notices = [];
for (const name of ['react', 'react-dom', 'scheduler']) {
  notices.push(`${name}\n${await readFile(`node_modules/${name}/LICENSE`, 'utf8')}`);
}
await writeFile('THIRD_PARTY_NOTICES.txt', notices.join('\n\n---\n\n'));
console.log(JSON.stringify({status: 'built', html_bytes: Buffer.byteLength(html), css_bytes: Buffer.byteLength(styles), js_bytes: Buffer.byteLength(script)}));
