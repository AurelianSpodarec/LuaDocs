/**
 * What the playground opens on when the link carries no program of its own.
 *
 * Not an empty buffer. An empty editor asks the reader to think of something, which is
 * a worse first request than "change this and see what happens" — Tailwind Play seeds a
 * working document for the same reason. It is also the only way the page can demonstrate
 * what it does before anybody touches it.
 *
 * It obeys [ADR 0008](../../docs/adr/0008-example-conventions.md) exactly as an authored
 * example does, expected-output comment included, and a test runs it against the real
 * Lua engine and checks that comment. The starter program being wrong about its own
 * output is the one mistake here nobody would forgive.
 *
 * It prints several lines on purpose. A one-line `print` would make the output pane look
 * like the wrong shape for the job on first sight, and iterating a table is what a
 * reader most often arrives wanting to do.
 */
export const SEED_PROGRAM = `-- Welcome to the LuaDocs playground.
-- Edit anything, then press Run — or Ctrl+Enter.

local grocery_list = {
  { name = "cocoa", price = 4.25 },
  { name = "flour", price = 2.10 },
  { name = "butter", price = 3.80 },
}

local total = 0
for position, item in ipairs(grocery_list) do
  print(string.format("%d. %-8s %5.2f", position, item.name, item.price))
  total = total + item.price
end

print(string.format("   %-8s %5.2f", "total", total))
-- Expected output:
-- 1. cocoa     4.25
-- 2. flour     2.10
-- 3. butter    3.80
--    total    10.15
`;
