import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  createRootRoute,
  createRouter,
  createMemoryHistory,
  RouterProvider,
} from '@tanstack/react-router';
import type * as PageTree from 'fumadocs-core/page-tree';
import { SidebarFolderNode } from '@/sidebar/Sidebar';

/**
 * A Section is a link *and* a disclosure. These tests pin the half that is easy to
 * regress: that its siblings stay on screen, and that nothing opens or closes
 * without either a click or a navigation.
 *
 * The sidebar used to scope the tree to the Section being read, which made most of
 * this untestable because the siblings were not rendered at all.
 */
const section = (slug: string): PageTree.Folder => ({
  type: 'folder',
  name: slug,
  index: { type: 'page', name: slug, url: `/docs/standard-library/${slug}` },
  children: [],
});

const entry = (name: string) => <span key={name}>{name}</span>;

function Sections() {
  return (
    <>
      <SidebarFolderNode item={section('math')}>{entry('math.abs()')}</SidebarFolderNode>
      <SidebarFolderNode item={section('string')}>{entry('string.format()')}</SidebarFolderNode>
    </>
  );
}

async function renderAt(pathname: string) {
  const rootRoute = createRootRoute({ component: Sections });
  const router = createRouter({
    routeTree: rootRoute,
    history: createMemoryHistory({ initialEntries: [pathname] }),
  });
  render(<RouterProvider router={router} />);
  await screen.findByRole('link', { name: 'math' });
}

const chevron = (name: RegExp) => screen.getByRole('button', { name });

describe('a Section as a disclosure', () => {
  it('keeps every sibling Section listed while you read one of them', async () => {
    await renderAt('/docs/standard-library/math/abs');

    expect(screen.getByRole('link', { name: 'math' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'string' })).toBeInTheDocument();
  });

  it('links each Section label to its own overview', async () => {
    await renderAt('/docs/standard-library/math/abs');

    expect(screen.getByRole('link', { name: 'string' })).toHaveAttribute(
      'href',
      '/docs/standard-library/string',
    );
  });

  it('opens the Section you are inside and leaves the others shut', async () => {
    await renderAt('/docs/standard-library/math/abs');

    expect(screen.getByText('math.abs()')).toBeInTheDocument();
    expect(screen.queryByText('string.format()')).toBeNull();
  });

  it('says on the row itself which Sections are open — the affordance scoping lacked', async () => {
    await renderAt('/docs/standard-library/math/abs');

    expect(chevron(/collapse math/i)).toHaveAttribute('aria-expanded', 'true');
    expect(chevron(/expand string/i)).toHaveAttribute('aria-expanded', 'false');
  });

  it('opens a sibling without shutting the one you are reading', async () => {
    await renderAt('/docs/standard-library/math/abs');
    fireEvent.click(chevron(/expand string/i));

    expect(screen.getByText('string.format()')).toBeInTheDocument();
    expect(screen.getByText('math.abs()')).toBeInTheDocument();
  });

  it('shuts again on a second chevron click, rather than only opening', async () => {
    await renderAt('/docs/standard-library/math/abs');

    fireEvent.click(chevron(/expand string/i));
    expect(screen.getByText('string.format()')).toBeInTheDocument();

    fireEvent.click(chevron(/collapse string/i));
    expect(screen.queryByText('string.format()')).toBeNull();
  });

  it('toggles from the label when the label would navigate nowhere', async () => {
    // Arriving at a Section is what opens it, so on its own overview a second click
    // on the row has no navigation left to do. It closes the Section instead.
    await renderAt('/docs/standard-library/string');
    expect(screen.getByText('string.format()')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('link', { name: 'string' }));
    expect(screen.queryByText('string.format()')).toBeNull();

    fireEvent.click(screen.getByRole('link', { name: 'string' }));
    expect(screen.getByText('string.format()')).toBeInTheDocument();
  });

  it('leaves a modified click alone, so the overview still opens in a new tab', async () => {
    await renderAt('/docs/standard-library/string');

    fireEvent.click(screen.getByRole('link', { name: 'string' }), { metaKey: true });
    expect(screen.getByText('string.format()')).toBeInTheDocument();
  });

  it('gives the chevron a target big enough not to lose clicks to the label', async () => {
    await renderAt('/docs/standard-library/math/abs');

    // 24px is the minimum; it previously drew at the icon's 12px and readers hit the
    // ~190px label beside it instead.
    expect(chevron(/collapse math/i)).toHaveClass('size-6');
  });

  it('shuts the Section you are inside when you ask it to', async () => {
    await renderAt('/docs/standard-library/math/abs');
    fireEvent.click(chevron(/collapse math/i));

    expect(screen.queryByText('math.abs()')).toBeNull();
    expect(chevron(/expand math/i)).toHaveAttribute('aria-expanded', 'false');
  });

  it('opens the Section on its own overview, not only on an entry beneath it', async () => {
    await renderAt('/docs/standard-library/math');

    expect(screen.getByText('math.abs()')).toBeInTheDocument();
  });

  it('does not treat a prefix match as being inside', async () => {
    // `/docs/standard-library/stringx` must not open `string`.
    await renderAt('/docs/standard-library/stringx');

    expect(screen.queryByText('string.format()')).toBeNull();
  });
});

/**
 * A folder's `meta.json` can ask for it to start open. Standard Library does, because
 * it is the whole Reference tree: shut, the sidebar was one row of small caps over
 * nothing, and the reader had to guess there was a chevron worth clicking.
 */
describe('a Section marked defaultOpen', () => {
  const area: PageTree.Folder = {
    type: 'folder',
    name: 'Standard Library',
    defaultOpen: true,
    index: { type: 'page', name: 'Standard Library', url: '/docs/standard-library' },
    children: [],
  };

  async function renderArea(pathname: string) {
    const rootRoute = createRootRoute({
      component: () => (
        <SidebarFolderNode item={area}>{entry('string')}</SidebarFolderNode>
      ),
    });
    const router = createRouter({
      routeTree: rootRoute,
      history: createMemoryHistory({ initialEntries: [pathname] }),
    });
    render(<RouterProvider router={router} />);
    await screen.findByRole('link', { name: 'Standard Library' });
  }

  it('stands open somewhere else on the site, not only once you are inside it', async () => {
    await renderArea('/docs/guides/metatables');

    expect(screen.getByText('string')).toBeInTheDocument();
    expect(chevron(/collapse standard library/i)).toHaveAttribute('aria-expanded', 'true');
  });

  it('is a starting position, not a pin — the chevron still shuts it', async () => {
    await renderArea('/docs/guides/metatables');
    fireEvent.click(chevron(/collapse standard library/i));

    expect(screen.queryByText('string')).toBeNull();
  });
});
