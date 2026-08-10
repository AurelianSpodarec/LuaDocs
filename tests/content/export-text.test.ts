import { describe, it, expect } from 'vitest';
import { resolveOnly, unwrapRunnableExamples, resolveExportText } from '@/lib/exportText';
import { DEFAULT_VERSION } from '@/compat/schema';

describe('resolveOnly', () => {
  it('keeps the branch that applies and drops the one that does not', () => {
    // The defect this exists for: both halves used to survive, adjacent and unlabelled,
    // so an entry asserted a thing and then asserted its opposite.
    const text = [
      '<Only before="5.5">',
      '  coroutine.close(co)',
      '</Only>',
      '',
      '<Only since="5.5">',
      '  coroutine.close([co])',
      '</Only>',
    ].join('\n');

    expect(resolveOnly(text, '5.4')).toContain('coroutine.close(co)');
    expect(resolveOnly(text, '5.4')).not.toContain('coroutine.close([co])');

    expect(resolveOnly(text, '5.5')).toContain('coroutine.close([co])');
    expect(resolveOnly(text, '5.5')).not.toContain('coroutine.close(co)\n');
  });

  it('leaves no marker behind either way', () => {
    const text = '<Only since="5.3">integer division</Only>';
    expect(resolveOnly(text, '5.4')).not.toContain('<Only');
    expect(resolveOnly(text, '5.1')).not.toContain('<Only');
  });

  it('treats since as inclusive and before as exclusive', () => {
    const text = '<Only since="5.4">yes</Only>';
    expect(resolveOnly(text, '5.4')).toBe('yes');
    expect(resolveOnly(text, '5.3')).toBe('');

    const before = '<Only before="5.4">yes</Only>';
    expect(resolveOnly(before, '5.3')).toBe('yes');
    expect(resolveOnly(before, '5.4')).toBe('');
  });

  it('closes the outer block on its own tag, not on a nested one', () => {
    // `<Only>` nests inside `<Parameters>` and `<Returns>`; a non-greedy match would end
    // the outer block at the inner block's `</Only>` and leave the tail dangling.
    const text = [
      '<Parameters>',
      '  <Only before="5.4">',
      '    <Param name="a">old</Param>',
      '  </Only>',
      '  <Only since="5.4">',
      '    <Param name="a">new</Param>',
      '  </Only>',
      '</Parameters>',
    ].join('\n');

    const out = resolveOnly(text, '5.4');
    expect(out).toContain('new');
    expect(out).not.toContain('old');
    expect(out).not.toContain('<Only');
    expect(out).toContain('</Parameters>');
  });

  it('leaves unbalanced markup visible rather than eating the rest of the page', () => {
    const text = 'before <Only since="5.4"> and then nothing closes it';
    expect(resolveOnly(text, '5.4')).toBe(text);
  });
});

describe('unwrapRunnableExamples', () => {
  it('gives a program back its fence', () => {
    const text = '<RunnableExample code="`print(1)`" />';
    expect(unwrapRunnableExamples(text)).toBe('```lua\nprint(1)\n```');
  });

  it('decodes the entities and the escaped newlines', () => {
    const text = '<RunnableExample code="`print(&#x22;hi&#x22;)\\nprint(2)`" />';
    expect(unwrapRunnableExamples(text)).toBe('```lua\nprint("hi")\nprint(2)\n```');
  });

  it('survives other props on the tag', () => {
    const text = '<RunnableExample usesEntry code="`print(1)`" />';
    expect(unwrapRunnableExamples(text)).toContain('print(1)');
    expect(unwrapRunnableExamples(text)).not.toContain('RunnableExample');
  });
});

describe('resolveExportText', () => {
  it('leaves neither marker in the output', () => {
    const text = [
      '<Only since="5.4">',
      '<RunnableExample code="`print(&#x22;x&#x22;)`" />',
      '</Only>',
    ].join('\n');

    const out = resolveExportText(text, DEFAULT_VERSION);
    expect(out).not.toContain('<Only');
    expect(out).not.toContain('RunnableExample');
    expect(out).toContain('print("x")');
  });
});
