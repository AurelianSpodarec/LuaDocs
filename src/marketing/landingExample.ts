/**
 * The program the landing page opens on.
 *
 * It is the first Lua most readers will meet, and it is editable and executable rather
 * than a picture of an example — a still of an editor is a claim that the site can run
 * Lua, where the editor itself is the proof.
 *
 * Short on purpose. The playground's starter program
 * ([`seed.ts`](../playground/seed.ts)) can afford twelve lines because a reader who
 * opened the playground came to read code; someone three sections into a front page has
 * not, and the point here is that the box is alive, not what it computes.
 *
 * It obeys [ADR 0008](../../docs/adr/0008-example-conventions.md) exactly as an authored
 * example does, expected-output comment included, and
 * `tests/marketing/landing-example.test.ts` runs it against the real Lua engine and
 * checks that comment. The front page being wrong about its own output is not a mistake
 * worth risking on the one page everybody sees.
 */
export const LANDING_EXAMPLE = `-- Edit anything, then press Run.
local languages = { "lua", "wren", "moon" }

table.sort(languages)

for position, name in ipairs(languages) do
  print(string.format("%d. %s", position, name))
end

print(#languages .. " languages, sorted")
-- Expected output:
-- 1. lua
-- 2. moon
-- 3. wren
-- 3 languages, sorted
`;
