<!-- PROTOTYPE — plain Markdown to stress-test page-structure.md. Not final content. -->
<!-- Entry type: CONSTANT / PROPERTY (Value instead of Parameters/Return values) -->

`Standard Library` › `math` › **math.pi**

> **Version support** &nbsp; 5.1 ✓ · 5.2 ✓ · 5.3 ✓ · 5.4 ✓ · 5.5 ✓

The value of π, the ratio of a circle's circumference to its diameter.

```lua runnable
print(math.pi)   -- 3.1415926535898
```

## Value

A **float** approximately equal to `3.1415926535898`. It is a plain field of the
`math` table, not a function — read it directly, without parentheses.

## Description

`math.pi` is provided at full `double` precision. Because it is always a float, it
carries the float subtype even in versions that distinguish integers from floats
(5.3+).

## Examples

```lua runnable
-- Area of a circle
local r = 2
print(math.pi * r^2)   -- 12.566370614359
```

## Gotchas

> [!CALLOUT]
>
> **Gotcha: it's a value, not a function**
>
> Write `math.pi`, not `math.pi()`. Calling it raises *"attempt to call a number
> value"*.

## Version support (details)

| Version | Status | Notes |
|---|---|---|
| 5.1–5.5 | ✓ | Available unchanged; always a float. |

## See also

- [`string.format`](./string.format.md) — formatting floats for display

## Source

Rewritten from the [Lua 5.5 manual — `math.pi`](https://www.lua.org/manual/5.5/manual.html#pdf-math.pi).
