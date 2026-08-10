import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  createRootRoute,
  createRouter,
  createMemoryHistory,
  RouterProvider,
} from '@tanstack/react-router';
import { DestinationsBlock } from '@/sidebar/SidebarHeader';

async function renderAt(pathname: string) {
  const rootRoute = createRootRoute({ component: DestinationsBlock });
  const router = createRouter({
    routeTree: rootRoute,
    history: createMemoryHistory({ initialEntries: [pathname] }),
  });
  render(<RouterProvider router={router} />);
  await screen.findByRole('link', { name: 'Reference' });
}

describe('the destinations block', () => {
  it('keeps the aria-label that src/styles/app.css selects on', async () => {
    // The notebook layout hides sidebar `links` above `lg`; app.css unhides that one
    // wrapper via `div:has(> nav[aria-label='Sections of the site'])`. Renaming this
    // label makes the block silently vanish on desktop, which has happened once.
    await renderAt('/docs/standard-library/math');

    expect(document.querySelector('nav[aria-label="Sections of the site"]')).not.toBeNull();
  });

  it('lists the destinations in order, with the active one marked', async () => {
    await renderAt('/docs/learn');

    const names = screen.getAllByRole('link').map((a) => a.textContent?.trim());
    expect(names).toEqual(['Reference', 'Learn', 'Guides', 'Playground', 'Community']);
    expect(screen.getByRole('link', { name: 'Learn' })).toHaveAttribute('data-active', 'true');
    expect(screen.getByRole('link', { name: 'Reference' })).not.toHaveAttribute('data-active');
  });

  it('opens the tools in a new tab, and leaves the reading destinations in place', async () => {
    await renderAt('/docs');

    // Community leaves the site; the Playground does not, and still earns a tab —
    // you go to it from a half-read entry and want the entry still there after.
    for (const name of ['Playground', 'Community']) {
      const link = screen.getByRole('link', { name });
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'));
    }

    for (const name of ['Reference', 'Learn', 'Guides']) {
      expect(screen.getByRole('link', { name })).not.toHaveAttribute('target');
    }
  });
});
