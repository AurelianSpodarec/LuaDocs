# Moodboard — visual direction

*Exploratory research, not a decision. This records the visual directions
considered for LuaDocs, the motif vocabulary derived from the language itself, and
the directions rejected with their reasons. Nothing here is binding — the choices
that survive graduate into ADRs, and the terms that survive graduate into
[`CONTEXT.md`](../../../CONTEXT.md), which currently has no vocabulary at all for
the visual layer. Feeds slice 2, page anatomy.*

---

## The problem the moon does not solve

`lua` is Portuguese for moon, and the official logo is a sphere with a tilted
orbital ring and a terminator shadow. That is a genuine, owned asset and it is
where any visual direction starts.

It is also only about ten percent of the work, because it is the part anyone could
copy. A moon over a landscape is transferable — swap the wordmark and the same
artwork sells a meditation app. The test every asset has to pass:

> Could this artwork belong to a different product if you changed the logo?

If yes, it is decoration. The remaining ninety percent has to be derived from what
the language actually *is*, not from what its name happens to mean.

---

## Directions considered

### A. Lunar reference — *leading candidate*

Dark-first, cool, precise. MDN's rigour with the moon as the only ornament.

| Role | Value |
|---|---|
| Page | `#0B1020` |
| Raised | `#161C33` |
| Deep accent | `#2B3A6B` |
| Accent | `#6E8CFF` |
| Accent light | `#A9BEFF` |
| Text | `#E8ECFA` |

Geometric grotesque plus a humanist mono. Hairlines rather than cards. Motifs
limited to crescent, orbit ring, and rules.

**Verdict:** ✅ closest fit. Dark-first suits both the subject and the audience,
and the restraint matches the "small language" positioning.

### B. Observatory — editorial

Light-first, warm paper, serif headings, navy ink, one rust accent
(`#FBF9F4` / `#EFE9DC` / `#16265C` / `#2F5BD9` / `#B4622E`). Reads as a
well-made language spec.

**Verdict:** ⚠️ partially useful. The register is wrong for modern Lua — see
[Modern Lua](#modern-lua-is-not-the-1993-manual) — but the warm tone is worth
borrowing for guides and the learn path, where the reader is not in a hurry.

### C. Runtime — terminal-forward

Near-black, mono-heavy, electric (`#07080C` / `#12151D` / `#2E9BFF` / `#4FE3C1`).
Playground-first, embedded, fast.

**Verdict:** ❌ as a whole-site direction. Hostile to the learn path, which is a
stated goal. Salvageable as the playground's own treatment.

### D. Layered silhouette — the illustration technique

Not a competing direction; the illustration system that sits on top of A. Taken
from a reference board of flat-vector night scenes.

The technique, stated so it is reproducible:

- **One hue, five tints.** Sky, far plane, mid plane, near plane, foreground.
  Depth comes entirely from value — never from outline, never from shading.
- **One light source, one accent.** A large disc plus a single comet. Two bright
  things halve the impact of the first.
- **Silhouettes carry meaning, not scenery.** Every object in the dark planes is
  something that means Lua.

**Verdict:** ✅ adopt for the landing page, section landings, and error pages. The
technique is cheap to produce consistently, native to dark mode, and scales from a
badge to a hero.

---

## Semantic palette

Independent of direction, and driven by the version system rather than taste.
These carry the version support row, gotchas, and run state:

| Meaning | Value |
|---|---|
| Available | `#3FB950` |
| Introduced | `#6E8CFF` |
| Changed | `#D9A441` |
| Removed | `#E5534B` |
| Gotcha | `#B07AD9` |
| Runnable | `#2A9D8F` |

Colour is never the sole carrier — each state needs a second cue (shape, fill,
hatching) for the same reason MDN's compatibility data does.

---

## Motifs derived from the language

The list that makes the imagery non-transferable. Each entry is a visual with a
semantic justification, not an ornament.

### The compositional rule: never draw Lua alone

Lua has no `main()`. It is not an application, it is a passenger — it lives inside
a host program and does nothing on its own. So there is always a body it belongs
to: a planet limb filling the lower third, a hull it is bolted to, a surface it
stands on. Every composition is two objects in a relationship, and the Lua object
is always the small one.

This is the single most load-bearing rule on the page. It is why the artwork
cannot be lifted for another product, and it states the value proposition before
anyone reads a word.

### Scale disparity

The interpreter is roughly thirty thousand lines of C and a few hundred kilobytes
built. The Lua object in every composition is therefore not modestly smaller than
its host but absurdly smaller. Contemporary product design keeps everything at even
weight; extreme scale contrast reads as deliberate and happens to be true.

### Eclipse = metatable

When a lookup fails on a table it falls through to another table behind it —
`__index` is literally "look behind this". During totality the only thing visible
is what was behind the disc all along. A mechanically accurate metaphor for the
most-misunderstood feature in the language, and the same eclipse serves as the
error state for a failed example.

### The lattice = tables

Tables are the only data structure, so one grid does every job: solar panel array,
retroreflector grid, star-chart coordinates, the version support matrix, the code
gutter. The repetition *is* the argument.

### The gap = `nil` holes

A `nil` in the middle of an array-style table is the classic Lua gotcha. Visually
it is one missing panel in an otherwise perfect grid. Both the prettiest and the
most precise item in the vocabulary.

### Counting from 1

The single thing every developer associates with Lua, and half of them complain
about. Everything countable on the site starts visibly at `1` — patch numbers,
gutters, footnotes, indices. Owning the most common criticism converts it into a
personality trait.

### Orbit and hand-off = coroutines

Coroutines are cooperative; nothing is preempted, things yield. Carried into the
motion language as a rule: transitions always complete, nothing is cut off
mid-flight.

### Long brackets

`[[ ]]` is syntax no other language has, and it is already bracket-shaped.
Callouts, gotchas, change notes, and pull quotes all want a wrapper.

### Word-shaped syntax → typesetting

`local`, `then`, `end`, no braces, very little punctuation. Lua source has more air
and fewer symbols than almost any language. Consequence: the mono should be
humanist with real letterforms rather than a condensed terminal face, and code
blocks want generous leading. Let it read like the prose it looks like. No other
language's documentation would make the same call.

### Object vocabulary

Drawn from the same world, for the silhouette planes:

- **Surface** — moon rocks (the only irregular shape in a vocabulary of circles),
  regolith, crater rims at low sun angle, ejecta rays, rilles, mare, the
  terminator. Footprints, which do not erode.
- **Hardware** — satellites with solar wings, probes, orbiters, landers, rovers,
  antenna dishes, booms, tethers, docking collars (embedding again), landing legs,
  retroreflector arrays.
- **Events** — comets, meteor streaks, dotted trajectory arcs, gravity assists,
  transits, libration, the phase cycle.
- **Instruments** — orreries, armillary spheres, sextants, star charts, elevation
  contours, wireframe globes.

### Mission patches

Circular, limited palette, bold central symbol, text curved around the rim. One per
section — `string`, `table`, `math`, `io`, `os`, `coroutine`. A format with rules,
so every new one comes out consistent, and it gives each section an identity
without touching the reference entries.

### Two physical rules worth adopting globally

- **Hard shadows, always.** No atmosphere means no soft shadow — every shadow on
  the moon is a knife edge with zero falloff. This is physically true *and* a
  site-wide discipline: no blur anywhere, in illustration or UI.
- **Earthshine.** The dark limb of a crescent is faintly lit by light bounced off
  Earth. So the darkest plane is never pure `#000`; it always carries a trace of
  the blue.

---

## Brazilian modernism

Lua came out of PUC-Rio in 1993 — Tecgraf, Roberto Ierusalimschy, Waldemar Celes,
Luiz Henrique de Figueiredo. One of very few globally significant languages that is
neither American nor European, and the name is Portuguese. Almost nothing in the
Lua ecosystem uses this.

The lineage worth studying: Athos Bulcão's azulejo tile panels in Brasília, which
are modular grids of simple geometric shapes in tightly limited palettes — visually
a table; Niemeyer's curves set against hard modernist grids; Aloísio Magalhães's
identity work; the Noigandres concrete poets, who treated typography as structure;
and Brasília itself as a built object.

It supplies curves-against-grid, warmth without cuteness, and a saturated
confidence that Swiss minimalism lacks. It also pairs with the lunar material more
readily than expected — a Bulcão tile field and a solar panel array are close to
the same drawing.

**Working synthesis:** Brazilian modernist geometry rendered in lunar subject
matter, with the hard rule that Lua is never drawn alone and always drawn small.

---

## Modern Lua is not the 1993 manual

Modern Lua is the configuration language of Neovim, the scripting layer of Roblox,
and the embedded runtime inside Redis, OpenResty, Factorio, and Wireshark. `<const>`
and `<close>`, generational GC, integers since 5.3. Its current audience skews
young and tool-native.

That argues against reverence. The design should be confident rather than bookish,
which is the main reason direction B does not win outright.

---

## Ornament budget

Decoration is inversely proportional to how much of a hurry the reader is in.

| Surface | Budget | Allowed |
|---|---|---|
| Landing page | 5 / 5 | photographic or illustrated moon, depth, motion |
| 404 and error pages | 4 / 5 | eclipse, lost satellite |
| Section landings | 2 / 5 | one static motif, lattice, mission patch |
| Playground | 2 / 5 | event-driven only, never ambient |
| Reference entries | 0 / 5 | version support row and type, nothing else |

### The landing page bookend

Treat the page as one vertical journey rather than two unrelated decorations.

- **Top** — the moon low and large, comet incoming, no figure. Nothing has happened
  yet.
- **Footer** — mirrored. Near plane raised so the viewpoint is higher, moon smaller
  and further, a small figure present, comet gone.

Same five tints, same ratio, read as bookends without being the same picture. Both
static; no parallax, no scroll effects.

---

## Motion

**Motion is feedback, never atmosphere.** If a reader can sit still and watch it
loop, it is decoration and belongs on the landing page or nowhere.

- **Rejected: ambient motion in the table of contents.** Falling asteroids beside
  the ToC were considered and dropped. The ToC sits in permanent peripheral vision
  next to prose, and continuous peripheral motion is the most reliably distracting
  thing that can be put on a reading surface. It also repaints indefinitely, on
  battery, on every entry.
- **Kept, reshaped: the compilation-error impact.** An asteroid *falling* on an
  example error is a wait, and nobody wants to wait to see their own mistake. Fire
  it as an impact instead — a crater mark in the editor gutter at the error line,
  under 200 ms, appearing with the error text and never before it, not repeating on
  consecutive runs.
- **Better still: eclipse on error.** The run indicator is a lit disc; on error it
  goes into eclipse. Something blocked the light. One shape animating, semantically
  exact, and it reuses the metatable motif.
- Every effect respects `prefers-reduced-motion`.
- Transitions complete rather than being interrupted — see coroutines above.

---

## Rejected, with reasons

Kept so they are not re-litigated.

| Rejected | Reason |
|---|---|
| Coffee beans | Java's, literally — the mascot is a cup and the name is a coffee reference. |
| Galaxies, nebulae, starfields | The default "we are technical and cosmic" look worn by every crypto and AI product between 2018 and 2024. Says nothing specific, fights readability, will date first. |
| Purple as the base ramp | The single element that made the reference board read as astrology. Identical compositions in a navy ramp read as space programme instead. |
| Astrology and dream framing | Astrology apps and language references have opposite trust requirements. A developer looking up `pcall` who lands on something resembling a horoscope closes the tab. |
| Scenery silhouettes (deer, cactus, towers, palms) | Passes "moon", fails "Lua". Same technique with spaceflight subjects is kept — see direction D. |
| A mascot | Lua has none. Inventing one fights an MDN-style reference. Recorded as a deliberate choice, not an oversight. |
| Slick — soft shadows, rounded cards, hover lift | Contradicts the small-language positioning on every page, and ages badly. |
| Full brutalism | Tempting, given that `lua.org/manual` has aged better than most sites built since. Rejected because it is hostile to beginners, and the learn path is a stated goal. |
| 3D renders, glassmorphism, isometric people, blob shapes, gradient mesh, generated hero art | All contradict "thirty thousand lines of C". Ruled out now so they do not creep in later. |

---

## Open questions

1. **Navy only, or navy with one violet step?** The reference board leans purple
   hard. A navy base with a single violet mid-plane tint keeps some of that feel
   without landing in astrology. Sets the whole illustration system.
2. **Photographic or drawn?** Does the landing hero use treated high-resolution
   lunar photography, or does the entire site stay in the flat vector register?
   Decides whether assets are sourced and treated, or drawn.
3. **How much reference chrome?** Whether reference entries get any personality
   surface at all, or are pure type and rules down to the favicon.
4. **Guides warm, reference cool?** Whether the two content types get visually
   distinct treatments, or one system covers both.

---

## To research next

- **`typography.md`** — [ADR 0004](../../adr/0004-self-hosted-on-github-no-third-parties.md)
  forbids third-party hosting, which rules out webfont CDNs and means every face
  must be self-hostable and licensed for it. That constrains the type choice more
  than taste does, and it should be settled before anything is chosen.
- **`lua-brand-terms.md`** — what `lua.org` actually permits for the logo and the
  name. LuaDocs is not the official site, and a mark built too close to the
  official one risks reading as impersonation. Needed before any mark is drawn.
- **`docs-site-survey.md`** — how MDN, Rust, Go, Stripe, and Tailwind handle
  reference chrome. [`mdn-case-study.md`](../mdn-case-study.md) covers MDN on
  content; this is the visual half.
