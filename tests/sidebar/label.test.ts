import { describe, it, expect } from 'vitest';
import { createElement } from 'react';
import { isCodeName, textOf } from '@/sidebar/Label';

describe('textOf', () => {
  it('reads a plain string name', () => {
    expect(textOf('math.abs()')).toBe('math.abs()');
  });

  it('unwraps the span the loader renders titles into', () => {
    // Titles go through the MDX pipeline, so they arrive as innerHTML.
    const name = createElement('span', {
      className: 'fd-page-tree-item-name',
      dangerouslySetInnerHTML: { __html: 'math.abs()' },
    });
    expect(textOf(name)).toBe('math.abs()');
  });

  it('declines a title that really does contain markup', () => {
    const name = createElement('span', {
      dangerouslySetInnerHTML: { __html: 'see <em>this</em>' },
    });
    expect(textOf(name)).toBeNull();
  });
});

describe('isCodeName', () => {
  it.each([
    'math',
    'string',
    'utf8',
    'math.abs()',
    'math.pi',
    'file:read()',
    'pcall()',
    '_G',
    '_VERSION',
    '__index',
    'LUA_PATH',
    'nil',
    'goto',
    'if',
    'arg',
  ])('sets %s in the mono face', (name) => {
    expect(isCodeName(name)).toBe(true);
  });

  it.each([
    'Functions',
    'Constants',
    'File methods',
    'Related globals',
    'Concepts',
    'Globals',
    'Language',
    'Standard Library',
    'C API',
    'Patterns',
    'Values and types',
    'Numeric for',
    'local declarations',
    'do … end blocks',
    'Coroutines',
    'A history of Lua',
  ])('leaves %s in the UI face', (name) => {
    expect(isCodeName(name)).toBe(false);
  });
});
