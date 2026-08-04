<!-- PROTOTYPE — plain Markdown to stress-test page-structure.md. Not final content. -->
<!-- Entry type: FUNCTION (complex: function-valued argument, errors, multiple gotchas) -->

`Standard Library` › [`table`](./table.md) › **table.sort**

> **Version support** &nbsp; 5.1 ✓ · 5.2 ✓ · 5.3 ✓ · 5.4 ⚠ · 5.5 ✓ &nbsp; *(⚠ = stricter error detection)*

Sorts the elements of a list in place, optionally using a custom comparison.

```lua runnable
local t = {"pear", "apple", "cherry"}
table.sort(t)
print(table.concat(t, ", "))
-- Expected output: apple, cherry, pear
```

## Syntax

```lua-signature
table.sort(list [, comp])
```

### Parameters

- **`list`** — a sequence (`list[1]` through `list[#list]`) to sort in place.
- **`comp`** *(optional)* — a function `comp(a, b)` returning `true` when `a` must
  come **before** `b`. When omitted, the `<` operator is used.

### Return values

- **None.** The list is reordered in place; `table.sort` returns nothing.

### Errors

- Raises `"invalid order function for sorting"` if `comp` is not a consistent
  strict order (e.g. it reports both `a < b` and `b < a`).
- Raises if `list` elements are not comparable by `<` and no `comp` is given
  (e.g. comparing a number with a string).

## Description

The sort is performed **in place** and is **not stable** — equal elements may be
reordered relative to each other. `comp` must define a *strict weak ordering*:
`comp(a, a)` must be false, and the ordering must be consistent across all pairs.

## Examples

```lua runnable
-- Descending order with a custom comparator
local n = {3, 1, 4, 1, 5, 9, 2}
table.sort(n, function(a, b) return a > b end)
print(table.concat(n, ", "))
-- Expected output: 9, 5, 4, 3, 2, 1, 1
```

```lua runnable
-- Sorting records by a field
local people = {
  { name = "Ada", age = 36 },
  { name = "Linus", age = 21 },
}
table.sort(people, function(a, b) return a.age < b.age end)
print(people[1].name)   -- Linus
```

## Gotchas

> [!CALLOUT]
>
> **Gotcha: use `<`, not `<=`, in your comparator**
>
> A comparator must be a *strict* order. Writing `return a <= b` makes `comp(a, a)`
> true, which violates the contract — in 5.4+ this raises *"invalid order
> function for sorting"*, and in earlier versions it can corrupt the result
> silently.

> [!CALLOUT]
>
> **Gotcha: only the sequence part is sorted**
>
> `table.sort` sorts `list[1..#list]`. Non-integer keys and anything past the first
> `nil` hole are ignored — see the [`#` length operator](./length-operator.md) for
> why a table with holes has no well-defined length.

## Version support (details)

| Version | Status | Notes |
|---|---|---|
| 5.1 | ✓ | In-place, unstable sort. |
| 5.2 | ✓ | — |
| 5.3 | ✓ | — |
| 5.4 | ⚠ changed | Detects and raises on invalid order functions more reliably. |
| 5.5 | ✓ | — |

## See also

- [`table` library](./table.md) — overview of all table functions
- [`#` length operator](./length-operator.md)

## Source

Rewritten from the [Lua 5.5 manual — `table.sort`](https://www.lua.org/manual/5.5/manual.html#pdf-table.sort).
