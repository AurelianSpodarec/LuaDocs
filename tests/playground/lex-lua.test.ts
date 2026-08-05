import { describe, it, expect } from 'vitest';
import { lexLua, type LuaTokenKind } from '@/playground/lexLua';

/** The token stream as `kind:value` pairs — terse enough to assert a whole line on. */
function kinds(source: string): string[] {
  return lexLua(source).map((lexeme) => `${lexeme.kind}:${lexeme.value}`);
}

/** Only the tokens of one kind, by value. */
function only(source: string, kind: LuaTokenKind): string[] {
  return lexLua(source)
    .filter((lexeme) => lexeme.kind === kind)
    .map((lexeme) => lexeme.value);
}

describe('lexLua', () => {
  it('separates keywords from names', () => {
    expect(kinds('local total = 0')).toEqual([
      'keyword:local',
      'name:total',
      'operator:=',
      'number:0',
    ]);
  });

  it('drops whitespace but keeps offsets pointing into the original source', () => {
    const source = '  local  x';
    const [first, second] = lexLua(source);
    expect(first).toMatchObject({ kind: 'keyword', start: 2, end: 7 });
    expect(source.slice(second.start, second.end)).toBe('x');
  });

  it('takes the longest operator rather than the first that fits', () => {
    expect(only('a .. b', 'operator')).toEqual(['..']);
    expect(only('a ... b', 'operator')).toEqual(['...']);
    expect(only('a // b', 'operator')).toEqual(['//']);
    expect(only('a ~= b', 'operator')).toEqual(['~=']);
    expect(only('::label::', 'operator')).toEqual(['::', '::']);
  });

  it('reads hex, exponent and dot-leading numbers as single numbers', () => {
    expect(only('0xff', 'number')).toEqual(['0xff']);
    expect(only('0x1p4', 'number')).toEqual(['0x1p4']);
    expect(only('1e-3', 'number')).toEqual(['1e-3']);
    expect(only('.5', 'number')).toEqual(['.5']);
    expect(only('5.', 'number')).toEqual(['5.']);
  });

  it('does not mistake a field access for a number', () => {
    expect(kinds('item.price')).toEqual(['name:item', 'operator:.', 'name:price']);
  });
});

describe('strings', () => {
  it('reads both quote styles as one token each', () => {
    expect(only(`print("hi") print('there')`, 'string')).toEqual(['"hi"', "'there'"]);
  });

  it('keeps an escaped quote inside the string', () => {
    expect(only(`"she said \\"no\\""`, 'string')).toEqual(['"she said \\"no\\""']);
  });

  it('does not run past a string ending in a backslash escape', () => {
    // `"a\\"` is the two-character string `a\`. Reading the closing quote as escaped
    // would swallow everything after it.
    expect(only('"a\\\\" .. "b"', 'string')).toEqual(['"a\\\\"', '"b"']);
  });

  it('ends an unterminated short string at the newline, not at the end of the file', () => {
    // A stray quote is a thing a reader types constantly. If it consumed the rest of
    // the buffer, every line below it would look like string content and Tidy would
    // stop indenting the file.
    const source = 'local greeting = "oops\nlocal count = 1';
    expect(only(source, 'string')).toEqual(['"oops']);
    expect(kinds(source)).toContain('keyword:local');
    expect(only(source, 'number')).toEqual(['1']);
  });

  it('reads a long string, including one spanning lines', () => {
    expect(only('local text = [[line one\nline two]]', 'string')).toEqual([
      '[[line one\nline two]]',
    ]);
  });

  it('honours the level of a long bracket', () => {
    // The whole point of `[==[` is that a bare `]]` inside it is content.
    expect(only('local text = [==[has ]] inside]==]', 'string')).toEqual([
      '[==[has ]] inside]==]',
    ]);
  });

  it('does not read an index as a long string', () => {
    expect(kinds('grocery_list[1]')).toEqual([
      'name:grocery_list',
      'operator:[',
      'number:1',
      'operator:]',
    ]);
  });

  it('runs an unterminated long string to the end rather than failing', () => {
    expect(only('local text = [[open', 'string')).toEqual(['[[open']);
  });
});

describe('comments', () => {
  it('reads a line comment to the end of its line only', () => {
    const source = '-- Expected output: 5\nprint(5)';
    expect(only(source, 'comment')).toEqual(['-- Expected output: 5']);
    expect(only(source, 'name')).toEqual(['print']);
  });

  it('reads a long comment across lines', () => {
    expect(only('--[[ still\na comment ]] print(1)', 'comment')).toEqual([
      '--[[ still\na comment ]]',
    ]);
  });

  it('does not read `--` as two minus operators', () => {
    expect(only('1 -- 2', 'operator')).toEqual([]);
  });

  it('keeps subtraction as subtraction', () => {
    expect(only('1 - 2', 'operator')).toEqual(['-']);
  });

  it('sees no code inside a comment', () => {
    // The load-bearing property for Tidy: an `end` in prose is not a block ending.
    expect(only('-- call end when done', 'keyword')).toEqual([]);
  });
});

describe('robustness', () => {
  it('terminates on a buffer of nothing but unknown bytes', () => {
    expect(lexLua('$@$@')).toHaveLength(4);
  });

  it('returns nothing for an empty or blank source', () => {
    expect(lexLua('')).toEqual([]);
    expect(lexLua('   \n\t ')).toEqual([]);
  });

  it('covers the source with no gaps except whitespace', () => {
    const source = 'local sum = 1 + 2 -- adds up\nprint(sum)';
    const lexemes = lexLua(source);
    for (const lexeme of lexemes) {
      expect(source.slice(lexeme.start, lexeme.end)).toBe(lexeme.value);
    }
    // Everything the lexer skipped is whitespace, which is what lets Tidy rebuild a
    // line from its tokens without losing anything that was not indentation.
    let covered = '';
    let at = 0;
    for (const lexeme of lexemes) {
      covered += source.slice(at, lexeme.start);
      at = lexeme.end;
    }
    covered += source.slice(at);
    expect(covered.trim()).toBe('');
  });
});
