import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Only } from '@/entry/Only';
import { Param, Parameters } from '@/entry/Parameters';
import { Return, Returns } from '@/entry/Returns';
import { SelectedVersionProvider } from '@/version/SelectedVersionProvider';
import { VersionSwitcher } from '@/version/VersionSwitcher';
import type { LuaVersion } from '@/compat/schema';

/**
 * `<Only>` scopes an authored block to a run of versions. It shows and hides; it never
 * says — the dataset's `changed_in` is what tells a reader *what* changed and *when*, on
 * three surfaces already, and a chip here would be a fourth telling in a second voice.
 */
function renderAt(node: React.ReactNode, version?: LuaVersion) {
  render(
    <SelectedVersionProvider>
      <VersionSwitcher />
      {node}
    </SelectedVersionProvider>,
  );
  if (version) {
    fireEvent.change(screen.getByLabelText(/lua version/i), { target: { value: version } });
  }
}

describe('Only', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('shows a `since` block from that version onward', () => {
    renderAt(<Only since="5.4">two components</Only>, '5.4');
    expect(screen.getByText('two components')).toBeInTheDocument();
  });

  it('hides a `since` block below that version', () => {
    renderAt(<Only since="5.4">two components</Only>, '5.3');
    expect(screen.queryByText('two components')).toBeNull();
  });

  it('shows a `before` block below that version and hides it at and above', () => {
    renderAt(
      <>
        <Only before="5.4">one argument</Only>
        <Only since="5.4">two arguments</Only>
      </>,
      '5.1',
    );
    expect(screen.getByText('one argument')).toBeInTheDocument();
    expect(screen.queryByText('two arguments')).toBeNull();

    fireEvent.change(screen.getByLabelText(/lua version/i), { target: { value: '5.4' } });
    expect(screen.queryByText('one argument')).toBeNull();
    expect(screen.getByText('two arguments')).toBeInTheDocument();
  });

  it('renders no chip, badge or marker of its own', () => {
    // The constraint that shaped the whole component. The dataset owns *what changed*;
    // a reader must not meet the same fact twice in two voices.
    const { container } = render(<Only since="5.4">two components</Only>);
    expect(container.textContent).toBe('two components');
    expect(container.querySelector('[data-state]')).toBeNull();
  });

  it('shows the default version’s reading with no provider above it', () => {
    render(
      <>
        <Only since="5.4">the newer form</Only>
        <Only before="5.4">the older form</Only>
      </>,
    );
    expect(screen.getByText('the newer form')).toBeInTheDocument();
    expect(screen.queryByText('the older form')).toBeNull();
  });

  it('refuses a misspelled attribute rather than rendering unscoped', () => {
    const quiet = vi.spyOn(console, 'error').mockImplementation(() => {});
    // @ts-expect-error — the point of the test is the prop TypeScript would have caught
    // in `src/`, and cannot catch in an `.mdx` file.
    expect(() => render(<Only sinse="5.4">two components</Only>)).toThrow(/`sinse`/);
    quiet.mockRestore();
  });
});

describe('a version-scoped Parameters list', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('lists only the parameters the selected version has', () => {
    const list = (
      <Parameters>
        <Only before="5.4">
          <Param name="x">the seed.</Param>
        </Only>
        <Only since="5.4">
          <Param name="x">the seed’s first component.</Param>
          <Param name="y">a second component.</Param>
        </Only>
      </Parameters>
    );

    renderAt(list, '5.1');
    expect(screen.getAllByRole('term').map((n) => n.textContent)).toEqual(['x']);
    expect(screen.getByText('the seed.')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/lua version/i), { target: { value: '5.4' } });
    expect(screen.getAllByRole('term').map((n) => n.textContent)).toEqual(['x', 'y']);
  });

  it('drops the heading rather than heading an empty list', () => {
    renderAt(
      <Parameters>
        <Only since="5.4">
          <Param name="x">the seed.</Param>
        </Only>
      </Parameters>,
      '5.3',
    );
    expect(screen.queryByRole('heading', { name: 'Parameters' })).toBeNull();
  });

  it('leaves an unscoped list exactly as it was', () => {
    renderAt(
      <Parameters>
        <Param name="formatstring">a template.</Param>
      </Parameters>,
      '5.1',
    );
    expect(screen.getByRole('heading', { name: 'Parameters' })).toBeInTheDocument();
    expect(screen.getByText('formatstring').tagName).toBe('DT');
  });
});

describe('a version-scoped Return values list', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const returns = (
    <Returns>
      <Only before="5.4">
        <Return type="none">nothing comes back.</Return>
      </Only>
      <Only since="5.4">
        <Return type="integer">the first component.</Return>
        <Return type="integer">the second component.</Return>
      </Only>
    </Returns>
  );

  it('lists only the returns the selected version has', () => {
    renderAt(returns, '5.1');
    expect(screen.getAllByRole('term').map((n) => n.textContent)).toEqual(['none']);

    fireEvent.change(screen.getByLabelText(/lua version/i), { target: { value: '5.4' } });
    expect(screen.getAllByRole('term').map((n) => n.textContent)).toEqual(['integer', 'integer']);
  });

  it('does not strand the numeric-type note above returns the version does not have', () => {
    // The note sits *above* the list and presupposes it. On 5.1 the two `integer`
    // returns are not on the page at all, so an explanation of how to read `integer`
    // there is an explanation of nothing (ADR 0009).
    renderAt(returns, '5.1');
    expect(document.querySelector('[data-numeric-note]')).toBeNull();
  });

  it('still places the note when the surviving return is the one naming an integer', () => {
    // The other direction, and the one that fails silently: an integer return that the
    // *older* versions have. Deciding the note from the authored children rather than
    // the surviving ones drops it here — the reader on 5.1 gets `integer` with nothing
    // to say the subtype does not exist for them, which is the defect ADR 0009 exists
    // to prevent.
    renderAt(
      <Returns>
        <Only before="5.3">
          <Return type="integer">the byte count.</Return>
        </Only>
        <Only since="5.3">
          <Return type="string">the code point.</Return>
        </Only>
      </Returns>,
      '5.1',
    );
    expect(screen.getAllByRole('term').map((n) => n.textContent)).toEqual(['integer']);
    expect(document.querySelector('[data-numeric-note]')).toHaveTextContent(
      'Lua 5.1 has no integer subtype',
    );

    fireEvent.change(screen.getByLabelText(/lua version/i), { target: { value: '5.3' } });
    expect(screen.getAllByRole('term').map((n) => n.textContent)).toEqual(['string']);
    expect(document.querySelector('[data-numeric-note]')).toBeNull();
  });

  it('keeps the note on an unscoped list that names an integer', () => {
    renderAt(
      <Returns>
        <Return type="integer">a count.</Return>
      </Returns>,
      '5.1',
    );
    expect(document.querySelector('[data-numeric-note]')).toHaveTextContent(
      'Lua 5.1 has no integer subtype',
    );
  });

  it('drops the heading rather than heading an empty list', () => {
    renderAt(
      <Returns>
        <Only since="5.4">
          <Return type="integer">the first component.</Return>
        </Only>
      </Returns>,
      '5.3',
    );
    expect(screen.queryByRole('heading', { name: 'Return values' })).toBeNull();
  });
});
