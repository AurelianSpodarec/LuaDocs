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

  it('sends Community off-site in a new tab, and nothing else', async () => {
    await renderAt('/docs');

    const community = screen.getByRole('link', { name: 'Community' });
    expect(community).toHaveAttribute('target', '_blank');
    expect(community).toHaveAttribute('rel', expect.stringContaining('noreferrer'));
    expect(screen.getByRole('link', { name: 'Reference' })).not.toHaveAttribute('target');
  });
});
