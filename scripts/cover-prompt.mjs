#!/usr/bin/env node
// Print the image-model prompt for a cover, from imagery/covers.json and the palette in tokens/tokens.json.
// Usage: node scripts/cover-prompt.mjs <topic>                       the topic's standard evidence
//        node scripts/cover-prompt.mjs <topic> --object "..." [--mark tick|circle] [--where "..."]
//        node scripts/cover-prompt.mjs --list                        the topics and their evidence
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
export const covers = JSON.parse(readFileSync(join(root, 'imagery/covers.json'), 'utf8'));
const palette = JSON.parse(readFileSync(join(root, 'tokens/tokens.json'), 'utf8')).color;
export const MARKS = ['tick', 'circle'];

const colour = (text) =>
  text.replace(/\{(\w+)\}/g, (_, name) => {
    const value = palette[name]?.$value;
    if (!value) throw new Error(`covers.json names an unknown colour "{${name}}"`);
    return value;
  });

/** The full prompt for one cover. A topic's standard evidence fills whatever is not given. */
export function coverPrompt({ topic, object, mark, where }) {
  const standard = covers.topics[topic];
  if (!standard) throw new Error(`Unknown topic "${topic}". Topics: ${Object.keys(covers.topics).join(', ')}`);
  const chosenMark = mark ?? standard.mark;
  if (!MARKS.includes(chosenMark)) throw new Error(`The mark is a ${MARKS.join(' or a ')}, not "${chosenMark}"`);
  const { width, height, ratio } = covers.size;
  const { ground, evidence, fixing, mark: markLayer } = covers.layers;
  return colour(
    [
      `Create an image, landscape ${ratio}, ${width}x${height}.`,
      covers.brief,
      `GROUND: ${ground}`,
      `EVIDENCE: ${evidence}`,
      `FIXING: ${fixing}`,
      `MARK: ${markLayer}`,
      ...covers.rules,
      `Topic: ${topic}. Evidence: ${object ?? standard.object}. The mark is a single ${chosenMark} ${where ?? (object ? (chosenMark === 'circle' ? 'around the key detail' : 'beside the key detail') : standard.where)}.`,
    ].join(' '),
  );
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { values, positionals } = parseArgs({ allowPositionals: true, options: { object: { type: 'string' }, mark: { type: 'string' }, where: { type: 'string' }, list: { type: 'boolean' } } });
  if (values.list) {
    for (const [topic, t] of Object.entries(covers.topics)) console.log(`${topic}: ${t.object}\n  also: ${t.alternatives.join('; ')}`);
  } else if (positionals.length !== 1) {
    console.error('Usage: node scripts/cover-prompt.mjs <topic> [--object "..."] [--mark tick|circle] [--where "..."] | --list');
    process.exit(1);
  } else {
    try {
      console.log(coverPrompt({ topic: positionals[0], ...values }));
    } catch (error) {
      console.error(error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  }
}
