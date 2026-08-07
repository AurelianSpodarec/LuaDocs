import type { ReactNode } from 'react';
import { Link } from '@tanstack/react-router';
import { appName, gitConfig } from '@/lib/shared';

const repo = `https://github.com/${gitConfig.user}/${gitConfig.repo}`;

const linkClass = 'text-fd-muted-foreground transition-colors hover:text-fd-foreground';

function External({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer noopener" className={linkClass}>
      {children}
    </a>
  );
}

/**
 * Links are built here rather than described as data, because the internal ones are
 * typed against the route tree — the documentation route is `/docs/$` and takes a
 * splat, so a plain `/docs` string would not typecheck.
 */
const columns: { heading: string; items: ReactNode[] }[] = [
  {
    heading: 'Docs',
    items: [
      <Link key="docs" to="/docs/$" params={{ _splat: '' }} className={linkClass}>
        Documentation
      </Link>,
      <Link key="playground" to="/playground" className={linkClass}>
        Playground
      </Link>,
      <Link key="blog" to="/blog" className={linkClass}>
        Blog
      </Link>,
    ],
  },
  {
    heading: 'Project',
    items: [
      <External key="repo" href={repo}>
        GitHub
      </External>,
      <External key="issues" href={`${repo}/issues/new`}>
        Report a problem
      </External>,
    ],
  },
  {
    /**
     * The column that points away from this site. `donations.html` routes through
     * Software in the Public Interest and is not linked from lua.org's own homepage, so
     * a reader who wants to support Lua is unlikely to find it without a link like this.
     */
    heading: 'Lua',
    items: [
      <External key="lua" href="https://www.lua.org/">
        lua.org
      </External>,
      <External key="manual" href="https://www.lua.org/manual/5.5/">
        Reference manual
      </External>,
      <External key="donations" href="https://www.lua.org/donations.html">
        Support Lua
      </External>,
    ],
  },
];

/**
 * The foot of the marketing shell — landing page and, later, the blog. It is not
 * rendered under the documentation layout, whose own ending is the per-entry provenance
 * panel ([ADR 0011](../../docs/adr/0011-the-foot-of-an-entry.md)).
 *
 * **The licence line is an obligation, not decoration.**
 * [ADR 0003](../../docs/adr/0003-dual-license-prose-and-code.md) splits the licence —
 * prose CC-BY 4.0 so the writing is credited, examples CC0 so a reader copying two lines
 * owes nothing — and requires the footer to state both terms *and the boundary between
 * them*. Naming the two licences without saying which covers what would leave a reader
 * unable to tell which one applies to the snippet they just took.
 *
 * Supporting Lua is a link here rather than a destination in the header: it points at
 * someone else's channel, and top-level placement would read as this site asking on its
 * own behalf.
 */
export function Footer() {
  return (
    <footer className="mt-auto border-t border-fd-border bg-fd-card/40">
      <div className="mx-auto w-full max-w-6xl px-6 py-12">
        <div className="flex flex-col gap-10 sm:flex-row sm:justify-between">
          <div className="max-w-xs">
            <p className="font-medium">{appName}</p>
            <p className="mt-2 text-sm text-fd-muted-foreground">
              An MDN-style reference for the Lua language, rewritten from the official
              manual with per-version content and runnable examples.
            </p>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-8 text-sm sm:grid-cols-3">
            {columns.map((column) => (
              <div key={column.heading}>
                <h2 className="mb-3 font-medium text-fd-foreground">{column.heading}</h2>
                <ul className="space-y-2">
                  {column.items.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-10 space-y-2 border-t border-fd-border pt-6 text-xs text-fd-muted-foreground">
          <p>
            Prose is licensed{' '}
            <a
              href="https://creativecommons.org/licenses/by/4.0/"
              target="_blank"
              rel="noreferrer noopener"
              className="underline underline-offset-2 hover:text-fd-foreground"
            >
              CC BY 4.0
            </a>
            . Example code is dedicated to the public domain under{' '}
            <a
              href="https://creativecommons.org/publicdomain/zero/1.0/"
              target="_blank"
              rel="noreferrer noopener"
              className="underline underline-offset-2 hover:text-fd-foreground"
            >
              CC0 1.0
            </a>
            , so you can copy an example without attribution.
          </p>
          {/* Every entry carries its own source link; this is the same acknowledgement
              made once for the site. */}
          <p>
            Lua is designed and maintained at PUC-Rio. {appName} is an independent project
            and is not affiliated with Lua.org or PUC-Rio.
          </p>
        </div>
      </div>
    </footer>
  );
}
