---
name: render-before-ratifying
description: Use when writing or amending a decision, ADR, spec, or plan that constrains what a reader sees on screen — page anatomy, component shape, field lists, table layout, label wording — or before a migration that rewrites many files to match such a decision.
---

# Render before ratifying

## Overview

A decision about rendered output cannot be validated in prose. Write the rules, render **one** subject under them, and the rules change — usually because a rule stated unconditionally is only right conditionally.

**Core principle:** the artefact is the test. Prose review of a rendering rule reliably passes rules that a single rendered page falsifies in minutes.

## When to use

- Writing or amending a decision about page anatomy, component props, field lists, layout, or label wording
- Before a migration that edits many files to match such a decision
- A reviewer says a spec "looks fine" and nobody has looked at output

**Not for:** decisions with nothing to render — licensing, URL maps, dependency choices, data retention. If there is no pixel, this does not apply.

## The steps

1. **Pick the subject by rule coverage, not by typicality.** Choose the one case that exercises the most rules at once. Not the simplest, not the most common — the most *loaded*. A subject that trips four rules tests four rules.
2. **Render it. One is enough.** Two subjects cost double and find little the first did not.
3. **Real renderer on one side; the proposal copied, not edited.**
   - Real, because a mocked baseline flatters the proposal.
   - Copied, because editing the shipping component makes the proposal the baseline and there is nothing left to compare.
4. **Write down what it falsified, as a list.** This is the step that gets skipped and it is the step that pays. Building the page and admiring it teaches nothing.
5. **Amend the decision before migrating.** The gate.

## Quick reference

| Question | Answer |
|---|---|
| How many subjects? | One, chosen for rule coverage |
| Which side is real? | The current behaviour. Always. |
| Edit the real component? | No — copy it. Delete the copy when the change ships. |
| Skip if the rules are obvious? | The obvious rules are the ones that fail |
| Done when? | Falsifications listed **and** the decision amended |

## Common mistakes

- **Both sides mocked.** The baseline gets drawn as you remember it, not as it is, and it loses on purpose.
- **Editing the real component "just to see".** Now the proposal ships whether or not it was any good.
- **Rendering the easy case.** A rule that survives the simple subject tells you nothing about the loaded one.
- **Building the page and stopping.** No list of falsifications means the exercise was decoration.
- **Deleting the surface afterwards.** The next decision needs it, and rebuilding it is how the lesson gets relearned instead of kept.

## Rationalizations

| Excuse | Reality |
|---|---|
| "The rules are simple, I can see they're right" | Rules that look right in prose are exactly the failure mode. Unconditional rules that need conditions read perfectly. |
| "I'll catch problems during the migration" | You catch them at file 200, with 199 files done wrong and the rule now expensive to change. |
| "There's no time to build a demo page" | One page against real components is under an hour. Re-migrating is not. |
| "A prose review by a second person is equivalent" | A reviewer reading prose shares the author's blind spot. The renderer does not. |
| "The spec already has an example in it" | An example *written* in the spec is the author's imagination. An example *rendered* is evidence. |
| "It's a small change to one field" | A field appears in every row of every page. Small change, large surface. |

## Red flags — stop

- About to migrate many files to match a rule nobody has seen rendered
- About to mark a rendering spec approved with no artefact behind it
- Reaching to edit the shipping component "to try the idea"
- Wrote the comparison, looked at it, listed nothing
- Deleting a proving surface because the decision it served has shipped

**All of these mean: render one loaded subject, list what it breaks, amend, then migrate.**

## Real-world impact

LuaDocs wrote a six-rule ADR on entry anatomy, then rendered one function under it before touching content. **Three of the six rules were wrong** — each stated unconditionally where it was only conditionally right. One would have required inventing 85 labels to fix an ambiguity that existed on none of those 85 pages. Caught in one page instead of at file 200 of 292.

The same project had already learned this twice — every refinement in its page-structure spec came from building rather than deciding — and had deleted the surface that produced them both times.
