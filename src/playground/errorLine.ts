/**
 * The line a Lua error happened on, pulled out of the message.
 *
 * Lua prefixes a runtime error with the chunk it came from and the line it reached,
 * and wasmoon hands that string through unchanged. Two shapes turn up:
 *
 * ```
 * [string "print(nil + 1)"]:1: attempt to perform arithmetic on a nil value
 * input:3: attempt to call a nil value (global 'prnt')
 * ```
 *
 * Which one depends on how the chunk was loaded, so both are read. The number is what
 * lets the editor point at the line instead of leaving the reader to count.
 */

/** `[string "..."]:3:` — the bracketed form, matched first because it cannot be mistaken. */
const CHUNK = /\]:(\d+):/;

/**
 * `input:3:` — a bare chunk name. Anchored, so a colon-and-digits pattern occurring in
 * the *body* of a message (`error("retry: 3: giving up")`) is not read as a line number.
 */
const NAMED = /^[^\s:]*:(\d+):/;

/**
 * The 1-based line `message` blames, or `null` if it blames none.
 *
 * `lineCount` rejects a line past the end of the buffer. That is not paranoia: an error
 * raised inside a library function reports the line *in that function*, which is a
 * number with no meaning in the reader's program, and a gutter marker on a line that
 * does not exist is worse than no marker at all.
 */
export function errorLine(message: string, lineCount?: number): number | null {
  const match = CHUNK.exec(message) ?? NAMED.exec(message);
  if (!match) return null;

  const line = Number(match[1]);
  if (!Number.isInteger(line) || line < 1) return null;
  if (lineCount !== undefined && line > lineCount) return null;

  return line;
}
