import { Link, useLocation } from '@tanstack/react-router';
import { Filter } from 'lucide-react';
import { destinationFor, destinations } from './destinations';

/**
 * The two things above the tree (ADR 0007): a block of destinations, then the filter.
 *
 * The filter sits **below** the block rather than at the top of the sidebar, because
 * it acts on the tree and not on the block. MDN puts its filter at the very top, but
 * MDN's sidebar contains nothing except the tree, so top-of-sidebar and top-of-tree
 * are the same pixel there. Copying the reasoning rather than the coordinates puts it
 * here.
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

export function SidebarHeader({
  query,
  onQueryChange,
  resultCount,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  resultCount: number;
}) {
  const { pathname } = useLocation();
  const active = destinationFor(pathname);
  const empty = query.trim().length > 0 && resultCount === 0;

  return (
    <div className="flex flex-col gap-4">
      <nav aria-label="Sections of the site" className="flex flex-col gap-0.5">
        {destinations.map((destination) => (
          <DestinationRow
            key={destination.name}
            destination={destination}
            active={!destination.external && destination.name === active.name}
          />
        ))}
      </nav>

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
    </div>
  );
}
