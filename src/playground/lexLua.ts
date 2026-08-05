/**
 * A Lua tokenizer, small enough to read in one sitting.
 *
 * Shiki already colours Lua, so this is not for highlighting — it is for the questions
 * highlighting cannot answer: *is this `end` real code or the word "end" inside a
 * string?* Tidy needs that to re-indent without corrupting a long string, and the
 * version linter this slice defers will need it to tell `//` the operator from `//`
 * inside a comment.
 *
 * It is a lexer and nothing more. It has no notion of statements, expressions or
 * scope, and it never fails: a playground buffer is read mid-keystroke, so an
 * unterminated string is the ordinary case rather than an error case. Anything left
 * open at the end of the source is returned as a token running to the end of the
 * source, which is exactly what it looks like on screen.
 */

export type LuaTokenKind = 'name' | 'keyword' | 'number' | 'string' | 'comment' | 'operator';

export interface LuaLexeme {
  kind: LuaTokenKind;
  value: string;
  /** Offset of the first character, into the source the lexeme came from. */
  start: number;
  /** Offset one past the last character. */
  end: number;
}

/**
 * Every reserved word in Lua 5.1–5.5. `goto` arrived in 5.2 and is listed
 * unconditionally: the lexer describes the text in front of it, and does not know which
 * version the reader has selected. Treating it as a keyword in 5.1 costs an indent
 * decision on a program that would not run there anyway.
 */
export const LUA_KEYWORDS: ReadonlySet<string> = new Set([
  'and', 'break', 'do', 'else', 'elseif', 'end', 'false', 'for', 'function', 'goto',
  'if', 'in', 'local', 'nil', 'not', 'or', 'repeat', 'return', 'then', 'true',
  'until', 'while',
]);

/**
 * Longest first — the list is tried in order, so `..` must be offered before `.` and
 * `...` before both, or `...` lexes as three separate dots and `a .. b` as two.
 */
const OPERATORS = [
  '...', '..', '::', '<<', '>>', '//', '==', '~=', '<=', '>=',
  '+', '-', '*', '/', '%', '^', '#', '&', '~', '|', '<', '>', '=',
  '(', ')', '{', '}', '[', ']', ';', ':', ',', '.',
];

const WHITESPACE = /\s+/y;
const NAME = /[A-Za-z_]\w*/y;
// Hex first, or `0x` lexes as the number `0` followed by the name `x`. `.5` and `5.`
// are both numbers in Lua, which is why the decimal branch accepts a missing side.
const NUMBER = /0[xX][0-9a-fA-F]*(?:\.[0-9a-fA-F]*)?(?:[pP][+-]?\d+)?|(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?/y;

/**
 * The level of a long bracket opening at `at`, or `null` if one does not.
 *
 * Lua's long brackets carry a level — `[[`, `[=[`, `[==[` — so that a string can
 * contain any shorter closer verbatim. The level is the number of `=` signs, and the
 * closer must match it exactly.
 */
function longBracketLevel(source: string, at: number): number | null {
  if (source[at] !== '[') return null;
  let cursor = at + 1;
  while (source[cursor] === '=') cursor++;
  return source[cursor] === '[' ? cursor - at - 1 : null;
}

/** The offset just past the long bracket closing `level`, or the end of the source. */
function endOfLongBracket(source: string, from: number, level: number): number {
  const closer = `]${'='.repeat(level)}]`;
  const found = source.indexOf(closer, from);
  return found === -1 ? source.length : found + closer.length;
}

/** The offset just past a `'`- or `"`-quoted string that opens at `at`. */
function endOfQuotedString(source: string, at: number): number {
  const quote = source[at];
  let cursor = at + 1;
  while (cursor < source.length) {
    const char = source[cursor];
    // A backslash consumes whatever follows it, including a newline (`\` at end of
    // line is a line continuation) and including another backslash — without this,
    // a string ending in `\\` would be read as running on past its own closing quote.
    if (char === '\\') {
      cursor += 2;
      continue;
    }
    // An unescaped newline ends a short string in Lua whether or not a quote followed.
    // Treating it as still open would make every line below a stray quote look like
    // string content, and Tidy would stop indenting the rest of the file.
    if (char === '\n') return cursor;
    cursor++;
    if (char === quote) return cursor;
  }
  return source.length;
}

/** Matches `pattern` at `at`, returning the matched text or `null`. */
function matchAt(pattern: RegExp, source: string, at: number): string | null {
  pattern.lastIndex = at;
  return pattern.exec(source)?.[0] ?? null;
}

/**
 * Every token in `source`, in order, with whitespace dropped.
 *
 * Offsets are preserved rather than the gaps being reported, so a caller that needs the
 * whitespace back can slice the original source between two lexemes.
 */
export function lexLua(source: string): LuaLexeme[] {
  const lexemes: LuaLexeme[] = [];
  let cursor = 0;

  const push = (kind: LuaTokenKind, start: number, end: number) => {
    lexemes.push({ kind, value: source.slice(start, end), start, end });
    cursor = end;
  };

  while (cursor < source.length) {
    const space = matchAt(WHITESPACE, source, cursor);
    if (space) {
      cursor += space.length;
      continue;
    }

    const start = cursor;

    // Comments before operators: `--` would otherwise lex as two `-` operators, and a
    // long comment's `[[` as an index.
    if (source.startsWith('--', cursor)) {
      const level = longBracketLevel(source, cursor + 2);
      if (level !== null) {
        push('comment', start, endOfLongBracket(source, cursor + 2, level));
      } else {
        const newline = source.indexOf('\n', cursor);
        push('comment', start, newline === -1 ? source.length : newline);
      }
      continue;
    }

    const char = source[cursor];

    if (char === '"' || char === "'") {
      push('string', start, endOfQuotedString(source, cursor));
      continue;
    }

    // A `[` is a long string only when a matching bracket follows; otherwise it is an
    // index, and `list[1]` must not swallow the rest of the file.
    const level = longBracketLevel(source, cursor);
    if (level !== null) {
      push('string', start, endOfLongBracket(source, cursor + level + 2, level));
      continue;
    }

    // Numbers before names, so `0x1f` is one number rather than `0` and `x1f`. The
    // guard keeps `..` and `.field` out of the number branch, where a bare `.` would
    // otherwise match nothing and loop forever.
    if (/\d/.test(char) || (char === '.' && /\d/.test(source[cursor + 1] ?? ''))) {
      const number = matchAt(NUMBER, source, cursor);
      if (number) {
        push('number', start, start + number.length);
        continue;
      }
    }

    const name = matchAt(NAME, source, cursor);
    if (name) {
      push(LUA_KEYWORDS.has(name) ? 'keyword' : 'name', start, start + name.length);
      continue;
    }

    const operator = OPERATORS.find((candidate) => source.startsWith(candidate, cursor));
    if (operator) {
      push('operator', start, start + operator.length);
      continue;
    }

    // Nothing matched — a stray byte such as `$` or `@`. It is reported as an operator
    // rather than skipped, because the cursor has to move: silently dropping it would
    // be indistinguishable from progress right up until a buffer made of nothing else
    // hung the tab.
    push('operator', start, start + 1);
  }

  return lexemes;
}
