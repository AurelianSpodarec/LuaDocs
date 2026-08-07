import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { appName, blogRoute, docsRoute, gitConfig } from './shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      // JSX supported
      title: appName,
    },
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
  };
}

/**
 * The marketing shell's header — landing page and, later, the blog.
 *
 * **This is deliberately not `baseOptions()`.** The documentation layout renders that
 * one, and [ADR 0007](../../docs/adr/0007-documentation-shell.md) rule 5 keeps the
 * documentation navbar to controls — wordmark, version, search, theme, GitHub — with
 * every destination in the sidebar instead (rule 1). Adding `links` to `baseOptions()`
 * would put a row of navigation across the docs that duplicates the sidebar's own top
 * level, which is the arrangement that ADR refused. Pages outside the tree have no
 * sidebar to hold destinations, so they carry a conventional header of links, and it
 * lives here where the docs cannot pick it up.
 *
 * The two shells do not nest: following Documentation leaves this header behind, and
 * the wordmark is the way back.
 *
 * Libraries belongs in this row too (see `docs/research/surface-expansion.md`) and is
 * left out until it is a route — a dead link on the front door costs more than a
 * missing one.
 */
export function marketingOptions(): BaseLayoutProps {
  return {
    ...baseOptions(),
    links: [
      { text: 'Documentation', url: docsRoute, active: 'nested-url' },
      // Second because it is the surface a first-time reader is most likely to stay
      // for, and the one no other Lua site offers.
      { text: 'Playground', url: '/playground' },
      { text: 'Blog', url: blogRoute, active: 'nested-url' },
    ],
  };
}
