import { describe, it, expect } from 'vitest';
import { tidy } from '@/playground/tidy';

describe('tidy', () => {
  it('indents a block body and puts `end` back level with what opened it', () => {
    expect(tidy('for index = 1, 3 do\nprint(index)\nend')).toBe(
      'for index = 1, 3 do\n  print(index)\nend',
    );
  });

  it('nests', () => {
    expect(tidy('while true do\nif ready then\nbreak\nend\nend')).toBe(
      'while true do\n  if ready then\n    break\n  end\nend',
    );
  });

  it('keeps `else` and `elseif` level with their `if`', () => {
    const source = [
      'if score > 90 then',
      'grade = "A"',
      'elseif score > 80 then',
      'grade = "B"',
      'else',
      'grade = "C"',
      'end',
    ].join('\n');

    expect(tidy(source)).toBe(
      [
        'if score > 90 then',
        '  grade = "A"',
        'elseif score > 80 then',
        '  grade = "B"',
        'else',
        '  grade = "C"',
        'end',
      ].join('\n'),
    );
  });

  it('handles repeat/until', () => {
    expect(tidy('repeat\ncount = count + 1\nuntil count > 5')).toBe(
      'repeat\n  count = count + 1\nuntil count > 5',
    );
  });

  it('indents a table constructor', () => {
    expect(tidy('local grocery_list = {\n"cocoa",\n"flour",\n}')).toBe(
      'local grocery_list = {\n  "cocoa",\n  "flour",\n}',
    );
  });

  it('dedents by two when a line closes two levels', () => {
    // `})` ends a function passed as an argument, and must come back level with the
    // call that opened both.
    expect(tidy('run(function()\nwork()\nend)')).toBe('run(function()\n  work()\nend)');
  });

  it('leaves a balanced line alone', () => {
    expect(tidy('local point = { x = 1, y = 2 }')).toBe('local point = { x = 1, y = 2 }');
  });

  it('does not treat an index as a block', () => {
    expect(tidy('local first = grocery_list[1]\nprint(first)')).toBe(
      'local first = grocery_list[1]\nprint(first)',
    );
  });

  it('re-indents code that was over-indented, not just under-indented', () => {
    expect(tidy('        local total = 0\n            print(total)')).toBe(
      'local total = 0\nprint(total)',
    );
  });

  it('strips trailing whitespace and blanks out whitespace-only lines', () => {
    expect(tidy('local total = 0   \n   \nprint(total)\t')).toBe('local total = 0\n\nprint(total)');
  });

  it('is idempotent', () => {
    const source = 'for index = 1, 3 do\nif index > 1 then\nprint(index)\nend\nend';
    const once = tidy(source);
    expect(tidy(once)).toBe(once);
  });

  it('never changes the line count, so a reported error line stays valid', () => {
    const source = 'local a = 1\n\n\nfor index = 1, 3 do\nprint(index)\nend\n';
    expect(tidy(source).split('\n')).toHaveLength(source.split('\n').length);
  });
});

describe('what tidy must not touch', () => {
  it('keeps the expected-output comment block exactly where ADR 0008 put it', () => {
    const source = [
      'local product_code = "isbn-0-14-044913-6"',
      'print(string.upper(product_code))',
      '-- Expected output: ISBN-0-14-044913-6',
    ].join('\n');

    expect(tidy(source)).toBe(source);
  });

  it('indents comments inside a block along with the code', () => {
    expect(tidy('function greet()\n-- says hello\nprint("hi")\nend')).toBe(
      'function greet()\n  -- says hello\n  print("hi")\nend',
    );
  });

  it('does not read an `end` inside a comment as closing a block', () => {
    expect(tidy('do\n-- call end when finished\nwork()\nend')).toBe(
      'do\n  -- call end when finished\n  work()\nend',
    );
  });

  it('does not read an `end` inside a string as closing a block', () => {
    expect(tidy('do\nprint("the end")\nend')).toBe('do\n  print("the end")\nend');
  });

  it('leaves the inside of a long string byte for byte', () => {
    // The load-bearing case: this indentation is the string's *value*. Re-indenting it
    // would change what the program prints.
    const source = 'local banner = [[\n   indented on purpose\n   and staying that way\n]]';
    expect(tidy(source)).toBe(source);
  });

  it('leaves the inside of a long comment alone', () => {
    const source = 'do\n--[[\n      spaced out deliberately\n]]\nwork()\nend';
    expect(tidy(source)).toBe('do\n  --[[\n      spaced out deliberately\n]]\n  work()\nend');
  });

  it('resumes indenting on the line after a long string closes', () => {
    expect(tidy('do\nlocal text = [[a\nb]]\nprint(text)\nend')).toBe(
      'do\n  local text = [[a\nb]]\n  print(text)\nend',
    );
  });

  it('adds and removes nothing — the tokens survive untouched', () => {
    const source = 'if a then\nprint("x")  -- note\nelse\nprint("y")\nend';
    const stripped = (text: string) => text.replace(/\s+/g, ' ').trim();
    expect(stripped(tidy(source))).toBe(stripped(source));
  });
});

describe('tidy on a buffer mid-edit', () => {
  it('survives an unterminated string without giving up on the rest of the file', () => {
    expect(tidy('do\nlocal greeting = "oops\nprint(1)\nend')).toBe(
      'do\n  local greeting = "oops\n  print(1)\nend',
    );
  });

  it('never indents negatively when there are more closers than openers', () => {
    expect(tidy('end\nend\nprint(1)')).toBe('end\nend\nprint(1)');
  });

  it('handles an empty buffer', () => {
    expect(tidy('')).toBe('');
  });
});
