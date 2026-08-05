import { describe, it, expect } from 'vitest';
import {
  canShare,
  decodeProgram,
  encodeProgram,
  hashForProgram,
  MAX_SHARE_LENGTH,
  playgroundHref,
  programFromHash,
} from '@/playground/shareUrl';

describe('encoding a program into a link', () => {
  it('round-trips an ordinary program', () => {
    const code = 'local total = 0\nfor index = 1, 3 do\n  total = total + index\nend\nprint(total)';
    expect(decodeProgram(encodeProgram(code))).toBe(code);
  });

  it('round-trips text outside ASCII', () => {
    // Lua strings are bytes and a reader will paste anything into one. Encoding through
    // `btoa` alone would throw on the first character above U+00FF.
    const code = 'print("café — 日本語 — 🌙")';
    expect(decodeProgram(encodeProgram(code))).toBe(code);
  });

  it('round-trips an empty program', () => {
    expect(encodeProgram('')).toBe('');
  });

  it('produces nothing needing escaping in a URL', () => {
    const encoded = encodeProgram('local a = 1 // 2 ~= 3\nprint("~~~???")');
    expect(encoded).toMatch(/^[A-Za-z0-9_-]*$/);
  });

  it('round-trips through a real URL rather than only through itself', () => {
    const code = 'print("a+b/c=d")';
    const url = new URL(`https://example.test${playgroundHref(code)}`);
    expect(programFromHash(url.hash)).toBe(code);
  });
});

describe('reading a program back out of a hash', () => {
  it('reads the hash with its leading #', () => {
    expect(programFromHash(`#${hashForProgram('print(1)')}`)).toBe('print(1)');
  });

  it('reads the hash without its leading #', () => {
    expect(programFromHash(hashForProgram('print(1)'))).toBe('print(1)');
  });

  it('returns null for an empty hash', () => {
    expect(programFromHash('')).toBeNull();
    expect(programFromHash('#')).toBeNull();
  });

  it('returns null for a hash carrying something else', () => {
    expect(programFromHash('#section-heading')).toBeNull();
  });

  it('returns null rather than throwing on a mangled payload', () => {
    // Links get truncated by chat clients and hand-edited by readers. Arriving on the
    // starter program is a recoverable disappointment; a blank page is not.
    expect(programFromHash('#p=!!!not base64!!!')).toBeNull();
  });

  it('survives a truncated payload', () => {
    const full = hashForProgram('print("a reasonably long program here")');
    expect(() => programFromHash(full.slice(0, full.length - 5))).not.toThrow();
  });
});

describe('the length limit', () => {
  it('shares an ordinary program', () => {
    expect(canShare('print("hello")')).toBe(true);
  });

  it('refuses a program too long to make a dependable link', () => {
    // Refusing is the point: a link silently truncated in transit decodes to a broken
    // program, which is a worse outcome than being told it will not fit.
    expect(canShare('print(1)\n'.repeat(MAX_SHARE_LENGTH))).toBe(false);
  });
});
