import type { ReactElement } from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import type { CompatNode } from '@/compat/schema';
import { varies } from '@/compat/resolve';
import { buildFullToc } from '@/entry/pageToc';
import { EntrySource } from '@/entry/EntrySource';
import { parseManualUrl } from '@/entry/manualSource';
import { VersionMatrix } from '@/version/VersionMatrix';

/**
 * The right rail promises two sections the MDX body does not contain: "Version
 * support" and "Source" are rendered by the route (`src/routes/docs/$.tsx`), so
 * neither heading reaches the MDX-derived TOC and both are appended by
 * `buildFullToc`. That makes the rail a *claim* about what the page contains, and the
 * claim is only true while the flags the route computes agree with what the two
 * components actually do.
 *
 * These tests assert that agreement as a biconditional: for one and the same input,
 * the TOC entry appears exactly when the component renders. `showToc` applies the
 * route's own condition — the point is that the condition and the component are
 * exercised together, so changing one without the other fails here rather than
 * shipping a rail that links to a section that is not on the page.
 */

/** Does the component put anything on the page for this input? */
function rendersAnything(ui: ReactElement): boolean {
  const { container } = render(ui);
  return container.innerHTML !== '';
}

function tocTitles(flags: { showVersionSupport: boolean; showSource: boolean }): string[] {
  // `title` is a `ReactNode` in general; the two synthetic entries are plain strings.
  return buildFullToc([{ title: 'Description', url: '#description', depth: 2 }], flags).map(
    (item) => String(item.title),
  );
}

describe('the Source TOC entry and EntrySource', () => {
  /** Exactly the route's `showSource`. */
  const showToc = (url: string | null) => Boolean(url && parseManualUrl(url));

  const cases: { label: string; url: string | null }[] = [
    { label: 'a manual URL', url: 'https://www.lua.org/manual/5.5/manual.html#pdf-string.format' },
    { label: 'a manual section URL', url: 'https://www.lua.org/manual/5.5/manual.html#6.5.1' },
    { label: 'a well-formed non-manual URL', url: 'https://example.com/lua/string-format' },
    { label: 'no source at all', url: null },
  ];

  for (const { label, url } of cases) {
    it(`agrees with EntrySource for ${label}`, () => {
      const inToc = tocTitles({ showVersionSupport: false, showSource: showToc(url) }).includes(
        'Source',
      );
      // With no URL the route renders no `EntrySource` at all, which is the same
      // nothing as the component declining to render.
      const onPage = url === null ? false : rendersAnything(<EntrySource url={url} />);

      expect(inToc).toBe(onPage);
    });
  }

  it('covers both branches, so the biconditional is not vacuous', () => {
    expect(cases.map(({ url }) => showToc(url))).toContain(true);
    expect(cases.map(({ url }) => showToc(url))).toContain(false);
  });
});

describe('the Version support TOC entry and VersionMatrix', () => {
  /** Exactly the route's `showVersionSupport`. */
  const showToc = (node: CompatNode | null) => Boolean(node && varies(node));

  const unchanged: CompatNode = { support: { lua: { version_added: '5.1' } } };
  const changed: CompatNode = {
    support: { lua: { version_added: '5.1' } },
    changed_in: { '5.4': 'Rejects an empty match ending where the previous match ended.' },
  };
  const addedLate: CompatNode = { support: { lua: { version_added: '5.3' } } };
  const removed: CompatNode = {
    support: { lua: { version_added: '5.1', version_removed: '5.4' } },
  };

  const cases: { label: string; node: CompatNode | null }[] = [
    { label: 'a node changed in one version', node: changed },
    { label: 'a node added after 5.1', node: addedLate },
    { label: 'a node since removed', node: removed },
    { label: 'a node that never varies', node: unchanged },
    { label: 'no compat node at all', node: null },
  ];

  for (const { label, node } of cases) {
    it(`agrees with VersionMatrix for ${label}`, () => {
      const inToc = tocTitles({ showVersionSupport: showToc(node), showSource: false }).includes(
        'Version support',
      );
      // With no node the route renders no `VersionMatrix` at all.
      const onPage = node === null ? false : rendersAnything(<VersionMatrix node={node} />);

      expect(inToc).toBe(onPage);
    });
  }

  it('covers both branches, so the biconditional is not vacuous', () => {
    expect(cases.map(({ node }) => showToc(node))).toContain(true);
    expect(cases.map(({ node }) => showToc(node))).toContain(false);
  });
});
