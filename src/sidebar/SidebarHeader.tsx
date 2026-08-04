import { Link, useLocation } from '@tanstack/react-router';
import { Filter } from 'lucide-react';
import { destinationFor, destinations } from './destinations';

/**
 * The two things above the tree (ADR 0007), which live in different places because
 * they scroll differently.
 *
 * The **block scrolls with the tree**, Tailwind-style: it is 134px of links a reader
 * clicks about once a session, and pinning it cost a quarter of the panel. The
 * **filter stays pinned**, because a control that scrolls out of reach is useless
 * exactly where it earns its keep, which is deep inside `math`.
 *
 * That splits them across fumadocs's slots — `links` renders inside the scroll
 * viewport, `banner` above it — so the filter now sits above the block rather than
 * below it. It reads as a controls cluster with Search rather than as a header for the
 * destinations, and the scroll boundary is what separates chrome from content.
 */
const destinationClass =
  'flex items-center gap-3 rounded px-2 py-1.5 text-sm transition-colors hover:text-fd-foreground';

function DestinationRow({
  destination,
  active,
}: {
  destination: (typeof destinations)[number];
  active: boolean;
}) {
  const Icon = destination.icon;
  const className = `${destinationClass} ${
    active ? 'font-semibold text-fd-foreground' : 'text-fd-muted-foreground'
  }`;

  const label = (
    <>
      <Icon className="size-4 shrink-0" />
      {destination.name}
    </>
  );

  if (destination.external) {
    return (
      <a href={destination.url} target="_blank" rel="noreferrer noopener" className={className}>
        {label}
      </a>
    );
  }

  return (
    <Link to={destination.url} data-active={active || undefined} className={className}>
      {label}
    </Link>
  );
}

/** Inside the scroll viewport, above the tree — so it scrolls away with it. */
export function DestinationsBlock() {
  const { pathname } = useLocation();
  const active = destinationFor(pathname);

  return (
    <nav aria-label="Sections of the site" className="flex flex-col gap-0.5">
      {destinations.map((destination) => (
        <DestinationRow
          key={destination.name}
          destination={destination}
          active={!destination.external && destination.name === active.name}
        />
      ))}
    </nav>
  );
}

/** Pinned above the viewport, beside Search — the one control that must stay reachable. */
export function SidebarFilter({
  query,
  onQueryChange,
  resultCount,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  resultCount: number;
}) {
  const empty = query.trim().length > 0 && resultCount === 0;

  return (
    <div>
      <div className="relative">
        <Filter className="pointer-events-none absolute start-2.5 top-1/2 size-3.5 -translate-y-1/2 text-fd-muted-foreground" />
        <input
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Filter"
          aria-label="Filter entries"
          className="w-full rounded-lg border bg-fd-background py-1.5 pe-2 ps-8 text-sm outline-none transition-colors placeholder:text-fd-muted-foreground focus-visible:border-fd-ring"
        />
      </div>
      {empty && (
        <p role="status" className="px-2 pt-2 text-xs text-fd-muted-foreground">
          No entries match “{query.trim()}”.
        </p>
      )}
    </div>
  );
}
