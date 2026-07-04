import { test } from 'node:test';
import assert from 'node:assert/strict';
import { htmlToMd, lessonMd, phaseEntry } from '../scripts/convert-lib.mjs';

test('htmlToMd converts b and i tags to markdown', () => {
  assert.equal(htmlToMd('keep <b>bold</b> and <i>italic</i>.'), 'keep **bold** and *italic*.');
  assert.equal(htmlToMd('no tags'), 'no tags');
});

test('lessonMd emits valid frontmatter with quoted strings and tip as body', () => {
  const md = lessonMd(1, {
    n: 3, phase: 0, title: 'Has "quotes" in it', diagram: 'lettering',
    objective: 'O', warmup: ['w1'], main: ['m1', 'm2'],
    checkpoint: 'C', tip: 'tip with <b>bold</b>',
  });
  assert.match(md, /^---\nmodule: 1\nnumber: 3\nphase: 0\n/);
  assert.match(md, /title: "Has \\"quotes\\" in it"/);
  assert.match(md, /warmup:\n {2}- "w1"\n/);
  assert.match(md, /main:\n {2}- "m1"\n {2}- "m2"\n/);
  assert.match(md, /---\n\ntip with \*\*bold\*\*\n$/);
});

test('phaseEntry builds a stable id', () => {
  const p = phaseEntry(2, 1, { id: 'light', name: 'Light & Form', days: '5–8', color: '#b5502f', blurb: 'B' });
  assert.deepEqual(p, { id: 'm2-p1', module: 2, index: 1, name: 'Light & Form', color: '#b5502f', blurb: 'B', lessons: '5–8' });
});
