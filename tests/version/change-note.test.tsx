import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { renderChangeNote } from '@/version/changeNote';
import { compatNodes } from '@/compat/registry';

/** Renders a note and hands back the container, so markup can be asserted on. */
function noteHtml(text: string): HTMLElement {
  const { container } = render(<p>{renderChangeNote(text)}</p>);
  return container;
}

describe('renderChangeNote', () => {
  it('sets a backticked identifier in the mono face', () => {
    const html = noteHtml('Adds `%p` to the directives.');
    const code = html.querySelectorAll('code');
    expect(code).toHaveLength(1);
    expect(code[0]).toHaveTextContent('%p');
    expect(html).toHaveTextContent('Adds %p to the directives.');
  });

  it('marks every span, not only the first', () => {
    const html = noteHtml('Adds `%a`/`%A` and extends `%q`.');
    expect([...html.querySelectorAll('code')].map((c) => c.textContent)).toEqual([
      '%a',
      '%A',
      '%q',
    ]);
  });

  it('leaves a note with no code as plain text', () => {
    const html = noteHtml('Rejects an empty match ending where the previous match ended.');
    expect(html.querySelector('code')).toBeNull();
    expect(html).toHaveTextContent('Rejects an empty match');
  });

  it('keeps the text either side of a span, including at the very end', () => {
    const html = noteHtml('before `code` after');
    expect(html).toHaveTextContent('before code after');
  });

  it('leaves an unmatched backtick as written', () => {
    // A stray tick is a typo worth seeing in the rendered note, not worth swallowing.
    const html = noteHtml('an unclosed ` tick');
    expect(html.querySelector('code')).toBeNull();
    expect(html).toHaveTextContent('an unclosed ` tick');
  });
});

describe('the notes actually in the dataset', () => {
  const all = Object.entries(compatNodes).flatMap(([key, node]) =>
    Object.entries(node.changed_in ?? {}).map(([version, note]) => ({ key, version, note })),
  );

  it('has notes to check at all', () => {
    expect(all.length).toBeGreaterThan(5);
  });

  it('closes every backtick it opens', () => {
    const unbalanced = all
      .filter((entry) => (entry.note.match(/`/g) ?? []).length % 2 !== 0)
      .map((entry) => `${entry.key} ${entry.version}`);
    expect(unbalanced).toEqual([]);
  });

  it('marks Lua identifiers rather than leaving them in prose', () => {
    // `%d`, `%q` and friends are the notes' most common content and the reason this
    // renderer exists. A bare one is the defect it was written to fix.
    const bare = all
      .filter((entry) => /(^|[^`%])%[a-zA-Z]\b(?![^`]*`)/.test(entry.note.replace(/`[^`]*`/g, '')))
      .map((entry) => `${entry.key} ${entry.version}: ${entry.note}`);
    expect(bare).toEqual([]);
  });
});
