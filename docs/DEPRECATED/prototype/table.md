<!-- PROTOTYPE — plain Markdown to stress-test page-structure.md. Not final content. -->
<!-- Entry type: SECTION / LIBRARY OVERVIEW (grouped index of entries) -->

`Standard Library` › **table**

> **Version support** &nbsp; 5.1 ✓ · 5.2 ✓ · 5.3 ✓ · 5.4 ✓ · 5.5 ✓

The `table` library provides functions for working with Lua tables as **lists**
(sequences indexed `1..n`): inserting, removing, reordering, joining, and
packing/unpacking.

```lua runnable
local t = {"a", "b", "c"}
table.insert(t, "d")
print(table.concat(t, "-"))
-- Expected output: a-b-c-d
```

## Functions

### Building and modifying

- [**`table.insert`**](#) — insert an element at the end, or at a given position.
- [**`table.remove`**](#) — remove and return an element by position.
- [**`table.move`**](#) &nbsp;`5.3+` — copy a range of elements within or between tables.

### Ordering and joining

- [**`table.sort`**](./table.sort.md) — sort a list in place, optionally with a comparator.
- [**`table.concat`**](#) — join a list's elements into a string with a separator.

### Packing

- [**`table.pack`**](#) &nbsp;`5.2+` — collect varargs into a new table with an `n` field.
- [**`table.unpack`**](#) &nbsp;`5.2+` — return a list's elements as multiple values *(the global `unpack` in 5.1)*.

## Description

Most functions operate on the **sequence** part of a table — the contiguous range
`1..#t`. Behavior on tables with `nil` holes is generally undefined; see the
[`#` length operator](./length-operator.md).

> [!NOTE]
> `table.unpack` was the global function `unpack` in Lua 5.1. Code targeting
> multiple versions must account for the move.

## Version support (details)

| Version | Notes |
|---|---|
| 5.1 | `insert`, `remove`, `concat`, `sort`; `unpack` is a global. |
| 5.2 | Adds `table.pack` / `table.unpack`. |
| 5.3 | Adds `table.move`. |
| 5.4–5.5 | Unchanged. |

## See also

- [`#` length operator](./length-operator.md)
- [`string.format`](./string.format.md)

## Source

Rewritten from the [Lua 5.5 manual — Table Manipulation](https://www.lua.org/manual/5.5/manual.html#6.6).
