# Cover images: the working paper

Every cover is one piece of evidence, taped into an audit file and ticked by the auditor. The palette is already named after that desk (tape, highlighter, redline, pencil, stock), so the images and the interface come from one source.

The system has four layers. Three never change; the evidence is the only thing a topic changes.

| Layer | What it is | Rule |
| --- | --- | --- |
| Ground | A black page with faint ledger ruling: rules, two or three columns, a double rule near the bottom | Always the same |
| Evidence | One real object as a black-and-white halftone cut-out with a clean scissor edge, rotated two or three degrees | Chosen by the topic |
| Fixing | One strip of masking tape in `tape` (#F7D52A) across one top corner | Always exactly one |
| Mark | One red-pencil tick or one circle in `redline` (#A8180F), drawn by hand | Always exactly one, never both |

Yellow and red are the only colours. At least half the frame stays empty, and the evidence takes up no more than half. There is no text, number or logo in any cover.

## Make a cover

1. Print the prompt for a topic. `pnpm cover --list` shows the topics and alternative evidence for each.

   ```bash
   pnpm cover tax
   pnpm cover audit --object "a bulldog clip holding a thin sheaf of papers" --mark circle --where "around the clip"
   ```

2. Paste the prompt into the image model. The references in `assets/covers/` were made with ChatGPT at 1536×1024.
3. Check the result against the list below. Regenerate if any check fails.
4. Export it as WebP at 1536×1024.

To mix topics, keep the system and choose the evidence. A post on AI in audit could tape in the automaton's hand holding a loupe. A new topic is one entry in [covers.json](covers.json).

## Evidence by topic

| Topic | Standard evidence | Reference |
| --- | --- | --- |
| Tax | A receipt spike holding receipts | `assets/covers/tax.webp` |
| Audit | A magnifying loupe on a ledger page | `assets/covers/audit.webp` |
| Finance | A ten-key adding machine | `assets/covers/finance.webp` |
| Data | Fan-fold computer printout | `assets/covers/data.webp` |
| AI | An 18th-century automaton's hand holding a quill | `assets/covers/ai.webp` |
| The practice and its people | A marble bust | `assets/covers/practice.webp` |

Marble is the family for essays, opinion and people.

## Checks

- **One fixing, one mark.** Two strips of tape, or a tick and a circle together, means regenerate.
- **Anatomy.** Count the hands. Poses with two hands often come out with a third.
- **No legible text or numbers.** Realistic keypads tend to show digits, so look closely.
- **The object says the topic** without a caption. An adding machine that reads as a typewriter fails.

## Source of truth

[covers.json](covers.json) holds the layers, rules, topics and checks. `scripts/cover-prompt.mjs` assembles the prompt from it and takes the colours from `tokens/tokens.json`, so a palette change reaches the prompts without editing them. `tests/covers.test.mjs` fails if a topic has no reference cover or the prompt names a colour the tokens lack.
