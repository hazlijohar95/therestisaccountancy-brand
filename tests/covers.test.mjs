import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { test } from 'node:test';
import { MARKS, coverPrompt, covers } from '../scripts/cover-prompt.mjs';
import { ROOT, read } from './helpers.mjs';

const palette = JSON.parse(read('tokens/tokens.json')).color;

test('a cover prompt carries the palette from the tokens, not a copy of it', () => {
  const prompt = coverPrompt({ topic: 'tax' });
  assert.ok(prompt.includes(palette.tape.$value) && prompt.includes(palette.redline.$value));
  assert.doesNotMatch(prompt, /\{\w+\}/);
});

test('every topic has standard evidence, a mark the system allows, and alternatives', () => {
  for (const [topic, t] of Object.entries(covers.topics)) {
    assert.ok(t.object && t.where, `${topic} lacks evidence`);
    assert.ok(MARKS.includes(t.mark), `${topic} has mark "${t.mark}"`);
    assert.ok(t.alternatives.length > 0, `${topic} has no alternatives`);
    assert.ok(coverPrompt({ topic }).includes(t.object));
  }
});

test('a cover can swap the evidence and keep the system', () => {
  const prompt = coverPrompt({ topic: 'audit', object: 'a bulldog clip', mark: 'circle' });
  assert.ok(prompt.includes('Evidence: a bulldog clip. The mark is a single circle beside the key detail.'));
  assert.ok(prompt.includes(covers.layers.ground));
});

test('an unknown topic or mark is refused', () => {
  assert.throws(() => coverPrompt({ topic: 'crypto' }), /Unknown topic/);
  assert.throws(() => coverPrompt({ topic: 'tax', mark: 'star' }), /tick or a circle/);
});

test('every topic has a reference cover', () => {
  for (const topic of Object.keys(covers.topics)) assert.ok(existsSync(join(ROOT, `assets/covers/${topic}.webp`)), `assets/covers/${topic}.webp is missing`);
});
