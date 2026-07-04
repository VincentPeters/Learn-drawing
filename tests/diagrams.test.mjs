import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const ported = fs.readFileSync('src/lib/diagrams.ts', 'utf8');
const keys = [...new Set([...ported.matchAll(/D\["([a-z0-9-]+)"\]/g)].map((m) => m[1]))];

test('diagram library has all 34 diagrams', () => {
  assert.equal(keys.length, 34);
  for (const k of ['line-types', 'glass-box', 'three-views', 'finished-plate', 'value-scale']) {
    assert.ok(keys.includes(k), `missing diagram: ${k}`);
  }
});

test('module exports DIAGRAMS and has no window/global references', () => {
  assert.match(ported, /export const DIAGRAMS/);
  assert.doesNotMatch(ported, /window\.|global\.DIAGRAMS/);
});
