import { describe, it, expect } from 'vitest';
import { errorLine } from '@/playground/errorLine';

describe('errorLine', () => {
  it('reads the line out of the bracketed chunk form', () => {
    expect(errorLine('[string "print(nil + 1)"]:1: attempt to perform arithmetic')).toBe(1);
  });

  it('reads the line out of the named chunk form', () => {
    expect(errorLine("input:3: attempt to call a nil value (global 'prnt')")).toBe(3);
  });

  it('reads a multi-digit line', () => {
    expect(errorLine('input:142: unexpected symbol')).toBe(142);
  });

  it('takes the first line number, not one from the message body', () => {
    expect(errorLine('input:7: bad argument #1 to \'sub\' (number expected, got 3:4)')).toBe(7);
  });

  it('is not fooled by a colon and digits inside the message', () => {
    // `error("retry: 3: giving up")` reaches here with no location prefix at all. The
    // anchored pattern is what stops the 3 being marked in the gutter.
    expect(errorLine('retry: 3: giving up')).toBeNull();
  });

  it('returns null when the message carries no location', () => {
    expect(errorLine('Execution timed out after 5000ms')).toBeNull();
    expect(errorLine('')).toBeNull();
  });

  it('rejects a line past the end of the buffer', () => {
    // An error raised inside a library function reports the line in *that* function.
    // Marking line 219 of a four-line program would point at nothing.
    expect(errorLine('input:219: bad argument', 4)).toBeNull();
  });

  it('accepts the last line of the buffer', () => {
    expect(errorLine('input:4: bad argument', 4)).toBe(4);
  });

  it('rejects a zero or negative line', () => {
    expect(errorLine('input:0: something')).toBeNull();
  });
});
