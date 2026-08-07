import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { createRootRoute, createRouter, createMemoryHistory, RouterProvider } from '@tanstack/react-router';
import type * as PageTree from 'fumadocs-core/page-tree';
import { SelectedVersionProvider } from '@/version/SelectedVersionProvider';
import { VersionSwitcher } from '@/version/VersionSwitcher';
import { VersionPanel } from '@/version/VersionPanel';
import { compatNodeFor } from '@/compat/registry';
import { createSidebarItem } from '@/sidebar/Sidebar';

const node = compatNodeFor('string.format')!;

function Entry() {
  return (
    <SelectedVersionProvider>
      <VersionSwitcher />
      <VersionPanel node={node} />
    </SelectedVersionProvider>
  );
}

function selectVersion(version: string) {
  fireEvent.change(screen.getByLabelText(/lua version/i), { target: { value: version } });
}

/** The strip and the switcher both render every version number — scope to the strip. */
function chip(version: string) {
  return within(screen.getByLabelText('Choose a version')).getByText(version);
}

describe('the assembled string.format entry', () => {
  beforeEach(() => {
    localStorage.clear();
    window.history.replaceState({}, '', '/');
  });

  it('resolves its compat node from the registry', () => {
    expect(node.support.lua.version_added).toBe('5.1');
  });

  it('shows no delta at the default version, and says so', () => {
    // The panel always carries a status. Silence used to be how "nothing to report"
    // was expressed, which meant the only time a reader saw anything was bad news.
    render(<Entry />);
    expect(chip('5.5')).toHaveAttribute('data-state', 'yes');
    expect(document.querySelector('[data-note="changed"]')).toBeNull();
    expect(document.querySelector('[data-note="unavailable"]')).toBeNull();
    expect(document.querySelector('[data-note="available"]')).toHaveTextContent(
      'Available in every documented version.',
    );
  });

  it('surfaces the change note for the selected version', () => {
    render(<Entry />);
    selectVersion('5.3');

    const note = document.querySelector('[data-note="changed"]');
    expect(note).not.toBeNull();
    expect(note).toHaveTextContent(/Changed in Lua 5\.3/);
    expect(note).toHaveTextContent(/integer representation/i);
  });

  it('swaps the note when the selected version changes again', () => {
    render(<Entry />);
    selectVersion('5.3');
    expect(document.querySelector('[data-note="changed"]')).toHaveTextContent(
      /integer representation/i,
    );

    selectVersion('5.4');
    expect(document.querySelector('[data-note="changed"]')).toHaveTextContent(/%q/);
  });

  it('marks a version the entry predates as unavailable, with an availability note', () => {
    // string.format exists in every documented version, so use a node that does not.
    const introducedIn53 = {
      support: { lua: { version_added: '5.3' } },
      changed_in: { '5.4': 'Tightened coercion.' },
    } as const;

    render(
      <SelectedVersionProvider>
        <VersionSwitcher />
        <VersionPanel node={introducedIn53} />
      </SelectedVersionProvider>,
    );

    selectVersion('5.1');
    expect(chip('5.1')).toHaveAttribute('data-state', 'no');

    const note = document.querySelector('[data-note="unavailable"]');
    expect(note).toHaveTextContent(/Not in Lua 5\.1/);
    // The callout names the version the prose below belongs to, rather than reciting
    // an added/removed history the strip beside it already shows.
    expect(note).toHaveTextContent(/describes Lua 5\.3, where it was introduced/);
  });
});

// Renders the REAL sidebar item factory (src/sidebar/Sidebar.tsx) against the
// REAL compat registry (src/compat/registry.ts), rather than hand-assembled
// stand-ins, so the Option-C sidebar behaviour (dimming + version badge) is
// actually exercised end to end.
const compatByUrl: Record<string, string> = {
  '/docs/standard-library/math/tointeger': 'math.tointeger',
  '/docs/standard-library/string/format': 'string.format',
};
const SidebarItem = createSidebarItem(compatByUrl);

const mathItem: PageTree.Item = {
  type: 'page',
  name: 'math.tointeger',
  url: '/docs/standard-library/math/tointeger',
};
const stringItem: PageTree.Item = {
  type: 'page',
  name: 'string.format',
  url: '/docs/standard-library/string/format',
};

function SidebarEntries() {
  return (
    <SelectedVersionProvider>
      <VersionSwitcher />
      <SidebarItem item={mathItem} />
      <SidebarItem item={stringItem} />
    </SelectedVersionProvider>
  );
}

function renderSidebarWithRouter() {
  const rootRoute = createRootRoute({ component: SidebarEntries });
  const router = createRouter({
    routeTree: rootRoute,
    history: createMemoryHistory({ initialEntries: ['/'] }),
  });
  render(<RouterProvider router={router} />);
}

describe('the real sidebar item factory', () => {
  beforeEach(() => {
    localStorage.clear();
    window.history.replaceState({}, '', '/');
  });

  it('dims math.tointeger with a 5.3+ badge at 5.1, leaving string.format untouched', async () => {
    renderSidebarWithRouter();

    const mathLink = await screen.findByRole('link', { name: /math\.tointeger/i });
    const stringLink = screen.getByRole('link', { name: /string\.format/i });

    // At the default version (5.5) both entries exist.
    expect(mathLink).not.toHaveAttribute('data-unavailable');
    expect(stringLink).not.toHaveAttribute('data-unavailable');

    selectVersion('5.1');

    expect(mathLink).toHaveAttribute('data-unavailable');
    expect(within(mathLink).getByText('5.3+')).toBeInTheDocument();

    expect(stringLink).not.toHaveAttribute('data-unavailable');
    expect(within(stringLink).queryByText(/\+$/)).toBeNull();
  });
});
