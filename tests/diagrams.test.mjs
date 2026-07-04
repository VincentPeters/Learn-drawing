import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const legacy = fs.readFileSync('assets/js/diagrams.js', 'utf8');
const ported = fs.readFileSync('src/lib/diagrams.ts', 'utf8');

const keysOf = (src) => [...src.matchAll(/D\["([a-z0-9-]+)"\]/g)].map((m) => m[1]).sort();

test('ported diagram library has exactly the legacy keys', () => {
  const legacyKeys = [...new Set(keysOf(legacy))];
  const portedKeys = [...new Set(keysOf(ported))];
  assert.equal(legacyKeys.length, 34);
  assert.deepEqual(portedKeys, legacyKeys);
});

test('ported module is an ES module exporting DIAGRAMS', () => {
  assert.match(ported, /export const DIAGRAMS/);
  assert.doesNotMatch(ported, /window|global\.DIAGRAMS/);
});
