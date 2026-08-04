# Scope: standard Lua only

LuaDocs documents **standard Lua the language** (versions 5.1–5.5): its syntax,
semantics, and standard library. **Luau (Roblox), and host-specific embeddings
and mod APIs** (WoW, LÖVE, Garry's Mod, Neovim, etc.) are explicitly **out of
scope** — they are different languages or host environments. They are covered
only as a survey in a single "Lua in the wild" Guide that links outward.

## Why

Luau and each embedding define their own standard libraries and, in Luau's case,
a different type system — documenting them means documenting different languages,
which fragments the mission of being the best reference for the Lua language
itself. Surveying them (rather than ignoring them) still serves newcomers who
arrive via those ecosystems, at near-zero maintenance cost.

## Consequences

- Every reference entry describes behavior in standard Lua; it does not hedge for
  Luau or host variants.
- The homepage links to **official** downloads only; the site never hosts or
  distributes Lua binaries.
- Ecosystem/package coverage (LuaRocks and notable libraries) is a curated Guide
  that links out — the site is not a package registry. This, and a blog, are
  deferred as optional later work.
