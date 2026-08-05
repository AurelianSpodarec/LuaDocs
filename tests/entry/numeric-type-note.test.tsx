import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Return, Returns } from '@/entry/Returns';
import { SelectedVersionProvider } from '@/version/SelectedVersionProvider';
import { VersionSwitcher } from '@/version/VersionSwitcher';
import type { LuaVersion } from '@/compat/schema';

/**
 * ADR 0009: the integer subtype arrived in 5.3, so `integer` in a return list is exact
 * from 5.3 onward and an anachronism before it. The disclosure is the renderer's job —
 * these tests are what stop it becoming an authoring job again.
 */
function renderReturns(children: React.ReactNode, version?: LuaVersion) {
  render(
    <SelectedVersionProvider>
      <VersionSwitcher />
      <Returns>{children}</Returns>
    </SelectedVersionProvider>,
  );
  if (version) {
    fireEvent.change(screen.getByLabelText(/lua version/i), { target: { value: version } });
  }
}

const note = () => document.querySelector('[data-numeric-note]');

describe('the numeric-type disclosure', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('stays silent at the default version, where integer is exact', () => {
    renderReturns(<Return type="integer">a count.</Return>);
    expect(note()).toBeNull();
  });

  it('stays silent from 5.3, the version that introduced the subtype', () => {
    renderReturns(<Return type="integer">a count.</Return>, '5.3');
    expect(note()).toBeNull();
  });

  it('appears at 5.1 and names the selected version', () => {
    renderReturns(<Return type="integer">a count.</Return>, '5.1');
    expect(note()).toHaveTextContent('Lua 5.1 has no integer subtype');
  });

  it('appears at 5.2 as well', () => {
    renderReturns(<Return type="integer">a count.</Return>, '5.2');
    expect(note()).toHaveTextContent('Lua 5.2 has no integer subtype');
  });

  it('says nothing on an entry whose returns name no integer', () => {
    renderReturns(<Return type="string">the formatted copy.</Return>, '5.1');
    expect(note()).toBeNull();
  });

  it('appears when only one of several returns names an integer', () => {
    renderReturns(
      <>
        <Return type="string">the modified copy.</Return>
        <Return type="integer">how many matches were replaced.</Return>
      </>,
      '5.1',
    );
    expect(note()).not.toBeNull();
  });

  it('links to the entry that owns the numeric model', () => {
    renderReturns(<Return type="integer">a count.</Return>, '5.1');
    expect(note()?.querySelector('a')).toHaveAttribute(
      'href',
      '/docs/language/values-and-types/number',
    );
  });
});

describe('the disclosure without a version provider', () => {
  it('stays silent rather than throwing', () => {
    // `<Returns>` renders inside MDX and inside tests that have no reason to mount a
    // version provider. An aside must never be able to take a page down with it.
    expect(() =>
      render(
        <Returns>
          <Return type="integer">a count.</Return>
        </Returns>,
      ),
    ).not.toThrow();
    expect(document.querySelector('[data-numeric-note]')).toBeNull();
  });
});
