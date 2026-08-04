# Single canonical docs with version deltas

We document all supported Lua versions (5.1–5.5) from **one canonical set of
entries** rather than a separate copy of the site per version. Each entry is
authored once as a **base** targeting the default (latest) version, and every
version inherits that base unless a **delta** overrides it — a delta being an
availability bound (`introduced`/`removed`), an inline change note, or an
example variant. Entries are never forked into per-version copies.

## Why

The alternative — maintaining a full copy of every entry per version — was
rejected because it multiplies maintenance N-fold, drifts out of sync, and makes
a new Lua release a site-wide rewrite. With the base+delta model a new version is
a small changeset (register the version; author only what changed), which is the
core promise of the project.

## Consequences

- Content must be **structured**, not just prose: entries carry version metadata
  (`introduced`/`removed`) and examples can declare version-specific variants.
- The reader's **selected version** is a first-class rendering input — it filters
  sidebar state (Option C: dim + badge), picks the applicable change notes, and
  chooses which example variant runs.
- There is exactly one place to edit any given fact, at the cost of the base+delta
  authoring discipline being non-obvious to new contributors (hence this record).
