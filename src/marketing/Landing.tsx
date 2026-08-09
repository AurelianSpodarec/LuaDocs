import type { ReactNode } from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowRight, BookOpen, GitCompareArrows, Play } from 'lucide-react';
import { LUA_VERSIONS } from '@/compat/schema';
import { appName } from '@/lib/shared';
import { RunnableExample } from '@/runner/RunnableExample';
import { LANDING_EXAMPLE } from './landingExample';
import type { LibraryCard } from './landingData';

const SHELL = 'mx-auto w-full max-w-6xl px-6';

/**
 * Software a reader is likely to have used without knowing Lua was inside it. A run of
 * names, deliberately not a gallery of logos: logos mean trademark permission per
 * holder and tens of megabytes of committed screenshots, and lua.org already publishes
 * a rotating showcase — a LuaDocs gallery would be the third such surface, not the
 * first (`docs/research/surface-expansion.md`).
 *
 * It is here to orient a first-time reader, which is why the heading says "some of" and
 * the fuller list is somebody else's to keep.
 */
const USED_BY = [
  'Wikipedia',
  'Neovim',
  'Redis',
  'OpenResty',
  'LÖVE',
  'Adobe Lightroom',
  'Factorio',
  'World of Warcraft',
  'Grim Fandango',
];

const PROMISES: { icon: typeof BookOpen; title: string; body: ReactNode }[] = [
  {
    icon: BookOpen,
    title: 'Written from the manual',
    body: (
      <>
        Every entry is read out of the official reference manual and rewritten in our own
        words, then linked back to the passage it came from. Nothing here is copied, and
        nothing is invented.
      </>
    ),
  },
  {
    icon: GitCompareArrows,
    title: 'Five versions, one page',
    body: (
      <>
        One entry serves Lua 5.1 through 5.5. What a version does not have is marked as
        missing rather than left for you to find out, and behaviour that changed says so
        where it changed.
      </>
    ),
  },
  {
    icon: Play,
    title: 'Examples that run',
    body: (
      <>
        Examples execute in the browser, with no install and no sign-in. Edit one in
        place, or open it in the Playground and keep going.
      </>
    ),
  },
];

export function Landing({ libraries }: { libraries: LibraryCard[] }) {
  return (
    <main className="flex-1">
      <Hero />
      {libraries.length > 0 && <Libraries libraries={libraries} />}
      <Promises />
      <PlaygroundPitch />
      <UsedBy />
    </main>
  );
}

function Hero() {
  return (
    <section className={`${SHELL} pt-16 pb-14 sm:pt-24 sm:pb-20`}>
      {/* The version range stated before anything else. It is the one fact that
          separates this site from every other place a reader could be, and burying it
          under the pitch would be burying the pitch. */}
      <ul aria-label="Documented versions" className="flex flex-wrap items-center gap-1.5">
        {LUA_VERSIONS.map((version) => (
          <li
            key={version}
            className="rounded-md border border-fd-border bg-fd-card px-2 py-1 font-mono text-xs tabular-nums text-fd-muted-foreground"
          >
            {version}
          </li>
        ))}
      </ul>

      <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
        Every version of Lua, in one reference.
      </h1>

      <p className="mt-5 max-w-2xl text-lg text-fd-muted-foreground text-pretty">
        {appName} documents the Lua language the way you actually meet it — one page per
        function, with runnable examples, and the differences between 5.1 and 5.5 marked
        on the page rather than left in a changelog.
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Link
          to="/docs/$"
          params={{ _splat: '' }}
          className="inline-flex items-center gap-2 rounded-lg bg-fd-primary px-4 py-2.5 text-sm font-medium text-fd-primary-foreground transition-opacity hover:opacity-90"
        >
          Open the reference
          <ArrowRight aria-hidden className="size-4" />
        </Link>
        <Link
          to="/playground"
          className="inline-flex items-center gap-2 rounded-lg border border-fd-border bg-fd-card px-4 py-2.5 text-sm font-medium transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground"
        >
          <Play aria-hidden className="size-4" />
          Try the Playground
        </Link>
      </div>
    </section>
  );
}

function Libraries({ libraries }: { libraries: LibraryCard[] }) {
  return (
    <section aria-labelledby="libraries" className={`${SHELL} py-14 sm:py-16`}>
      <h2 id="libraries" className="text-2xl font-semibold tracking-tight">
        Start with a library
      </h2>
      <p className="mt-2 max-w-2xl text-fd-muted-foreground">
        The standard library, entry by entry. More sections are being written; only the
        ones with something to read are listed.
      </p>

      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {libraries.map((library) => (
          <li key={library.splat}>
            <Link
              to="/docs/$"
              params={{ _splat: library.splat }}
              className="group flex h-full flex-col rounded-xl border border-fd-border bg-fd-card p-5 transition-colors hover:border-fd-primary/40 hover:bg-fd-accent/40"
            >
              <span className="flex items-baseline justify-between gap-3">
                <span className="font-mono text-base font-medium">{library.title}</span>
                <span className="shrink-0 text-xs tabular-nums text-fd-muted-foreground">
                  {library.entries} {library.entries === 1 ? 'entry' : 'entries'}
                </span>
              </span>
              {library.description && (
                <span className="mt-2 text-sm text-fd-muted-foreground">
                  {library.description}
                </span>
              )}
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-fd-muted-foreground transition-colors group-hover:text-fd-foreground">
                Read
                <ArrowRight aria-hidden className="size-3.5" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Promises() {
  return (
    <section aria-labelledby="promises" className="border-y border-fd-border bg-fd-card/40">
      <div className={`${SHELL} py-14 sm:py-16`}>
        <h2 id="promises" className="text-2xl font-semibold tracking-tight">
          What makes an entry here
        </h2>
        <ul className="mt-8 grid gap-8 sm:grid-cols-3">
          {PROMISES.map(({ icon: Icon, title, body }) => (
            <li key={title}>
              <Icon aria-hidden className="size-5 text-fd-primary" />
              <h3 className="mt-3 font-medium">{title}</h3>
              <p className="mt-2 text-sm text-fd-muted-foreground">{body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// Not `Playground` — that name belongs to the real one in `src/playground/`, and a
// stack trace naming the wrong component costs more than the extra word.
function PlaygroundPitch() {
  return (
    <section aria-labelledby="playground" className={`${SHELL} py-14 sm:py-16`}>
      <div className="grid items-center gap-8 lg:grid-cols-2">
        <div>
          <h2 id="playground" className="text-2xl font-semibold tracking-tight">
            Run Lua without installing it
          </h2>
          <p className="mt-3 text-fd-muted-foreground text-pretty">
            A real Lua interpreter, compiled to WebAssembly and running in your browser.
            Write something, press Run, and share the result as a link — the whole program
            travels in the URL, because there is no server to keep it on.
          </p>
          <Link
            to="/playground"
            className="mt-6 inline-flex items-center gap-2 rounded-lg border border-fd-border bg-fd-card px-4 py-2.5 text-sm font-medium transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground"
          >
            <Play aria-hidden className="size-4" />
            Open the Playground
          </Link>
        </div>

        {/* The real component the entries use, not a still of one. A picture of an
            editor is a *claim* that the site runs Lua; the editor is the proof, and it
            is the one demonstration on this page that costs nothing to build because
            the machinery already exists.

            `RunnableExample` works here unchanged: it reads the selected version, which
            the root provides, and the entry-availability context it also reads is
            absent outside an entry and documented to mean "no reason to think
            otherwise". */}
        <RunnableExample code={LANDING_EXAMPLE} />
      </div>
    </section>
  );
}

function UsedBy() {
  return (
    <section aria-labelledby="used-by" className={`${SHELL} pt-6 pb-20`}>
      <h2 id="used-by" className="text-2xl font-semibold tracking-tight">
        You have probably run Lua already
      </h2>
      <p className="mt-3 max-w-2xl text-fd-muted-foreground text-pretty">
        Lua is embedded in far more software than it is written in — it is the scripting
        layer inside editors, databases, servers and games. Some of the places it turns
        up:
      </p>

      <ul className="mt-6 flex flex-wrap gap-2">
        {USED_BY.map((name) => (
          <li
            key={name}
            className="rounded-full border border-fd-border bg-fd-card px-3 py-1.5 text-sm text-fd-muted-foreground"
          >
            {name}
          </li>
        ))}
      </ul>

      <p className="mt-5 text-sm text-fd-muted-foreground">
        Not a definitive list —{' '}
        <a
          href="https://www.lua.org/uses.html"
          target="_blank"
          rel="noreferrer noopener"
          className="underline underline-offset-2 hover:text-fd-foreground"
        >
          lua.org keeps a fuller one
        </a>
        .
      </p>
    </section>
  );
}
