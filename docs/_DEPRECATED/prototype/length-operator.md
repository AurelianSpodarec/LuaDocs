<!-- PROTOTYPE — plain Markdown to stress-test page-structure.md. Not final content. -->
<!-- Entry type: LANGUAGE CONSTRUCT / OPERATOR (no Parameters/Return values) -->

`Language` › `Operators` › **`#` (length)**

> **Version support** &nbsp; 5.1 ✓ · 5.2 ⚠ · 5.3 ✓ · 5.4 ✓ · 5.5 ✓ &nbsp; *(⚠ = `__len` added)*

Returns the length of a string or the size of a sequence.

```lua runnable
print(#"hello")          -- 5
print(#{10, 20, 30})     -- 3
```

## Syntax

```lua-signature
#v
```

Where `v` is a string or a table.

## Description

For a **string**, `#s` is its length in **bytes** (not characters — a UTF-8
string may report more bytes than glyphs).

For a **table**, `#t` returns a *border*: an index `n` where `t[n]` is non-`nil`
and `t[n+1]` is `nil`. For a **sequence** (a table whose keys are `1..n` with no
gaps), that border is exactly its length.

> [!NOTE]
> **(5.2+)** A table's `__len` metamethod, if present, overrides the default
> border computation. Strings always use their byte length.

## Examples

```lua runnable
-- A clean sequence: length is unambiguous
local t = {"a", "b", "c"}
print(#t)   -- 3
```

```lua runnable
-- Bytes, not characters
print(#"café")   -- 5  (the é is two bytes in UTF-8)
```

## Gotchas

> [!CALLOUT]
>
> **Gotcha: `#` on tables with holes is undefined**
>
> If a table is *not* a sequence — it has a `nil` "hole", like
> `{[1]="a", [3]="c"}` — then `#t` may return **any** valid border (here `1` or
> `3`), and the choice is not guaranteed. Never rely on `#` for tables that might
> contain `nil` gaps; track the count yourself instead.

## Version support (details)

| Version | Status | Notes |
|---|---|---|
| 5.1 | ✓ | Length of strings and tables; no `__len` for tables. |
| 5.2 | ⚠ changed | `__len` metamethod now respected for tables. |
| 5.3 | ✓ | — |
| 5.4 | ✓ | — |
| 5.5 | ✓ | — |

## See also

- [`table.insert`](./table.md) — appends at `#list + 1`
- [`string.format`](./string.format.md)

## Source

Rewritten from the [Lua 5.5 manual — The Length Operator](https://www.lua.org/manual/5.5/manual.html#3.4.7).
