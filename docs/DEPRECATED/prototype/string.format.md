<!-- PROTOTYPE — plain Markdown to stress-test page-structure.md. Not final content. -->
<!-- Entry type: FUNCTION (Parameters + Return values + Errors) -->

`Standard Library` › [`string`](./table.md) › **string.format**

> **Version support** &nbsp; 5.1 ✓ · 5.2 ✓ · 5.3 ⚠ · 5.4 ✓ · 5.5 ✓ &nbsp; *(⚠ = behavior changed)*

Builds a string by inserting values into a template, using the same directives as
C's `printf`.

```lua runnable
print(string.format("%s is %d years old", "Ada", 36))
-- Expected output: Ada is 36 years old
```

## Syntax

```lua-signature
string.format(formatstring, ···)
```

### Parameters

- **`formatstring`** — a string containing literal text and `%` directives.
- **`···`** — one value per directive, in order. `%%` consumes no value.

### Return values

- **`string`** — a copy of `formatstring` with each directive replaced by its
  formatted value.

### Errors

- Raises if a directive is invalid (e.g. `%y`).
- Raises `"bad argument"` if a value is missing or the wrong type for its directive.
- **(5.3+)** Raises `"number has no integer representation"` when a float with a
  fractional part is passed to an integer directive such as `%d`.

## Description

Directives mostly follow C: `%d`/`%i` (integer), `%f`/`%g`/`%e` (float),
`%s` (string), `%x` (hex), `%c` (character), `%q` (Lua-safe quoted), `%%` (a
literal `%`). Flags, width, and precision work as in C — e.g. `%5.2f`.

`%s` applies `tostring` to its argument, so any value can be formatted, while
numeric directives require a number.

> [!NOTE]
> `%q` produces a string that can be safely read back by the Lua interpreter —
> useful for serializing simple values.

## Examples

```lua runnable
-- Padding and precision
print(string.format("[%5d]", 42))       -- [   42]
print(string.format("[%-5d]", 42))      -- [42   ]
print(string.format("%.3f", math.pi))   -- 3.142
```

```lua runnable
-- Quoting for safe round-trips
print(string.format("%q", 'he said "hi"\n'))
```

## Gotchas

> [!CALLOUT]
>
> **Gotcha: integers vs floats (5.3+)**
>
> Since 5.3, `%d` needs an *integer*. `string.format("%d", 3.0)` works (3.0 has an
> integer representation) but `string.format("%d", 3.5)` **errors**. Before 5.3
> every number was a float and this never happened. Use `%g` or `math.floor` when
> the value may be fractional.

## Version support (details)

| Version | Status | Notes |
|---|---|---|
| 5.1 | ✓ | No integer subtype; `%d` accepts any number. |
| 5.2 | ✓ | Adds `%a`/`%A` (hexadecimal float). |
| 5.3 | ⚠ changed | Integer directives require an integer representation or raise. |
| 5.4 | ✓ | `%q` handles more value kinds (e.g. floats, `nil`). |
| 5.5 | ✓ | — |

## See also

- [`#` length operator](./length-operator.md)
- [`table.concat`](./table.md) — joining sequences into strings

## Source

Rewritten from the [Lua 5.5 manual — `string.format`](https://www.lua.org/manual/5.5/manual.html#pdf-string.format).
