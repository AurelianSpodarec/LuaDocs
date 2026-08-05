import { lexLua, type LuaLexeme } from './lexLua';

/** Two spaces, as the reference manual, *Programming in Lua* and this site's own examples all use. */
const INDENT = '  ';

/**
 * Tidy **re-indents**. It does not pretty-print.
 *
 * A pretty-printer rebuilds the program from a syntax tree: it decides where line breaks
 * go, how a long call wraps, whether `{1,2}` gains spaces. That needs a Lua parser, and
 * it moves comments — which this site cannot afford, because
 * [ADR 0008](../../docs/adr/0008-example-conventions.md) rule 6 makes the trailing
 * `-- Expected output:` block load-bearing on three surfaces that have no runtime.
 *
 * Re-indenting needs only a lexer, and it has two properties worth more here than
 * cleverness:
 *
 * - **It changes leading and trailing whitespace, and nothing else.** No token is
 *   inserted, removed, reordered or reworded, so a comment cannot be lost.
 * - **It never changes the line count**, so an error already reported against line 7
 *   still belongs to line 7 afterwards, and the editor's gutter marker does not have to
 *   be invalidated.
 *
 * Lines inside a long string or long comment are emitted byte for byte. Their leading
 * whitespace is *content* — re-indenting `[[ ... ]]` would quietly rewrite the value the
 * program computes, which is the one thing a formatter must never do.
 */
export function tidy(source: string): string {
  const lines = source.split('\n');
  const starts = lineStarts(source);
  const lexemes = lexLua(source);

  /** Lexemes beginning on each line. A multi-line literal belongs only to the line it opens on. */
  const opening: LuaLexeme[][] = lines.map(() => []);
  /** Lines whose first column sits inside a literal opened earlier, and so cannot be moved. */
  const literal = lines.map(() => false);

  for (const lexeme of lexemes) {
    const from = lineAt(starts, lexeme.start);
    opening[from].push(lexeme);
    if (lexeme.kind !== 'string' && lexeme.kind !== 'comment') continue;
    // `end - 1`, so a literal closing exactly at a newline does not protect the line
    // after it — that line is ordinary code.
    const to = lineAt(starts, Math.max(lexeme.start, lexeme.end - 1));
    for (let line = from + 1; line <= to; line++) literal[line] = true;
  }

  let depth = 0;

  return lines
    .map((text, index) => {
      const effects = opening[index].map(depthEffect);

      // Closers at the *start* of a line pull that line back with them, so `end` sits
      // level with the `function` it closes rather than with the body above it. Counted
      // rather than flagged, because `})` closes two levels and must dedent by two.
      let leading = 0;
      while (leading < effects.length && effects[leading]?.dedents) leading++;

      const indent = Math.max(0, depth - leading);
      const delta = effects.reduce((sum, effect) => sum + (effect?.delta ?? 0), 0);

      // A line may only ever open one level, however many things it opens.
      // `run(function()` opens two — the call and the function — but a reader sees one
      // step, and indenting its body four spaces to match the counting would be wrong
      // in the most ordinary callback in the language. Closing is not capped: `end)`
      // has to come back through both of them in one go, or it lands under its own body.
      depth = Math.max(0, depth + Math.min(delta, 1));

      // Untouched, whitespace included: this line is the inside of a string or comment.
      if (literal[index]) return text;

      const body = text.trim();
      return body ? INDENT.repeat(indent) + body : '';
    })
    .join('\n');
}

/**
 * How a token moves the depth, and whether it pulls its own line back one level.
 * `null` for everything with no bearing on block structure, which is most of a program.
 */
function depthEffect(lexeme: LuaLexeme): { delta: number; dedents: boolean } | null {
  if (lexeme.kind !== 'keyword' && lexeme.kind !== 'operator') return null;

  switch (lexeme.value) {
    case 'then':
    case 'do':
    case 'function':
    case 'repeat':
    case '{':
    case '(':
    case '[':
      return { delta: 1, dedents: false };

    case 'end':
    case 'until':
    case '}':
    case ')':
    case ']':
      return { delta: -1, dedents: true };

    // `else` closes nothing — the matching `end` does that — so it leaves the depth
    // alone and only asks to sit level with its `if`.
    case 'else':
      return { delta: 0, dedents: true };

    // `elseif cond then` is `else` with a fresh `then` on the same line. The `then`
    // adds a level; this takes it back, and the pair nets to zero.
    case 'elseif':
      return { delta: -1, dedents: true };

    default:
      return null;
  }
}

/** The offset each line begins at. Index 0 is always 0, so there is one per line. */
function lineStarts(source: string): number[] {
  const starts = [0];
  for (let index = 0; index < source.length; index++) {
    if (source[index] === '\n') starts.push(index + 1);
  }
  return starts;
}

/** The line `offset` falls on — the last line beginning at or before it. */
function lineAt(starts: number[], offset: number): number {
  let low = 0;
  let high = starts.length - 1;
  while (low < high) {
    const mid = (low + high + 1) >> 1;
    if (starts[mid] <= offset) low = mid;
    else high = mid - 1;
  }
  return low;
}
