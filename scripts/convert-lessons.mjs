// One-off converter: legacy JS data files → Markdown content collection.
// Usage: npm run convert
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { lessonMd, phaseEntry } from './convert-lib.mjs';

function loadLegacy(file, globalName) {
  const src = fs.readFileSync(file, 'utf8');
  const sandbox = { window: {} };
  vm.runInNewContext(src, sandbox);
  const data = sandbox.window[globalName];
  if (!data) throw new Error(`${file} did not define window.${globalName}`);
  return data;
}

const root = path.resolve(import.meta.dirname, '..');
const lessonsDir = path.join(root, 'src/content/lessons');
fs.mkdirSync(lessonsDir, { recursive: true });

const sources = [
  [1, loadLegacy(path.join(root, 'assets/js/curriculum.js'), 'CURRICULUM')],
  [2, loadLegacy(path.join(root, 'assets/js/module2.js'), 'MODULE2')],
];

const phases = [];
let count = 0;
for (const [m, data] of sources) {
  data.PHASES.forEach((p, i) => phases.push(phaseEntry(m, i, p)));
  for (const d of data.DAYS) {
    const file = path.join(lessonsDir, `m${m}-${String(d.n).padStart(2, '0')}.md`);
    fs.writeFileSync(file, lessonMd(m, d));
    count++;
  }
}
fs.writeFileSync(path.join(root, 'src/content/phases.json'), JSON.stringify(phases, null, 2) + '\n');
console.log(`Wrote ${count} lessons, ${phases.length} phases.`);
