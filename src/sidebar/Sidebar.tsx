import { Link, useLocation } from '@tanstack/react-router';
import type * as PageTree from 'fumadocs-core/page-tree';
import { ChevronDown } from 'lucide-react';
import {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { compatNodeFor } from '@/compat/registry';
import { isAvailable } from '@/compat/resolve';
import { useSelectedVersion } from '@/version/SelectedVersionProvider';
import { SidebarLabel, textOf } from './Label';

/**
 * True while the sidebar filter has a query in it.
 *
 * The filter keeps matches in place rather than flattening them into a result list
 * (ADR 0007), which only works if every ancestor of a match is open. Collapse state is
 * therefore suspended while filtering rather than cleared: a Section you shut by hand
 * is still shut when you empty the box.
 */
export const FilteringContext = createContext(false);

/**
 * Modelled on MDN's sidebar, measured from its `Math` page, with one deliberate
 * departure.
 *
 * What is copied: identifiers are mono and structural labels are sans (see `Label`),
 * rows breathe, and each level indents only 8px — MDN leans on type, not on
 * indentation.
 *
 * What is not: MDN sets every row at 16px, because its sidebar is scoped to one
 * built-in object and never shows more than a couple of levels at once. Ours is
 * unscoped and four deep — Area → Section → Group → Entry — so the two levels that
 * are *labels* rather than content take a smaller size, and the Area takes small
 * caps. Each level is then unmistakable on its own, without reading its neighbours.
 */
const row = 'flex items-center gap-2 rounded transition-colors';

/** An Area — `Standard Library`, `Language`. The spine, styled as a header. */
const areaClass = `${row} mt-6 mb-1 px-2 py-1 text-xs font-semibold uppercase tracking-wider text-fd-muted-foreground`;

/** A Section — `math`, `table`. The anchor: the largest, heaviest thing here. */
const sectionClass = `${row} px-2 py-1 text-[0.9375rem] font-semibold leading-6 text-fd-foreground`;

/** A Group — `Functions`, `Related globals`. A label with no page behind it. */
const groupClass = `${row} px-2 py-1 text-xs font-medium text-fd-muted-foreground`;

/**
 * Option C: entries unavailable in the selected version are dimmed and badged with
 * the version that introduced them — but stay clickable, so a reader can always
 * reach the page and find out why it is greyed out.
 */
const itemClassName = `${row} px-2 py-1 text-sm leading-6 text-fd-muted-foreground hover:bg-fd-accent/50 hover:text-fd-foreground data-[unavailable]:opacity-50 data-[status=active]:bg-fd-primary/10 data-[status=active]:font-medium data-[status=active]:text-fd-primary`;

export function createSidebarItem(compatByUrl: Record<string, string>) {
  return function SidebarItem({ item }: { item: PageTree.Item }) {
    const { version } = useSelectedVersion();
    const { pathname } = useLocation();
    const node = compatNodeFor(compatByUrl[item.url]);
    const unavailable = node ? !isAvailable(node, version) : false;
    const addedIn = node?.support.lua.version_added;

    // The tree is ~295 entries and no longer scoped to one Section, so landing on
    // `debug.sethook` can leave the highlighted row far below the fold. `nearest`
    // scrolls only when it has to, so arriving at an already-visible row does not
    // jolt the sidebar.
    const active = pathname === item.url;
    const ref = useRef<HTMLAnchorElement>(null);
    useEffect(() => {
      if (active) ref.current?.scrollIntoView({ block: 'nearest' });
    }, [active]);

    const label = (
      <>
        {item.icon}
        <SidebarLabel name={item.name} />
        {unavailable && addedIn !== false && addedIn !== undefined && (
          <span className="rounded border px-1 text-xs">{addedIn}+</span>
        )}
      </>
    );

    if (item.external) {
      return (
        <a
          href={item.url}
          target="_blank"
          rel="noreferrer noopener"
          data-unavailable={unavailable || undefined}
          className={itemClassName}
        >
          {label}
        </a>
      );
    }

    return (
      <Link
        ref={ref}
        to={item.url}
        activeOptions={{ exact: true }}
        data-unavailable={unavailable || undefined}
        className={itemClassName}
      >
        {label}
      </Link>
    );
  };
}

/**
 * A folder is one of two things, and they must not look alike:
 *
 * - A **section** (`math`, `table`) has an overview, so its label is the link to it,
 *   set at weight 600 — the heaviest thing in the sidebar.
 * - A **group** (`Functions`, `Related globals`) has no page at all. Its label is a
 *   collapse trigger at weight 400, sans-serif, with the chevron hanging to its left
 *   exactly as MDN's `Static methods` does.
 */
/**
 * A group has no page, so collapsing is the only thing it can do — MDN's `Static
 * methods`, and this is MDN's markup: a native `<details>`/`<summary>`. Fumadocs's
 * collapsible is driven by an exit transition that left the panel at full height when
 * toggled shut, and none of its machinery buys anything here — `<summary>` already
 * carries the disclosure semantics, the keyboard handling and the toggling.
 *
 * Two things here look redundant and are not. The flex layout sits on an inner span,
 * never on the `<summary>` itself — giving a summary a `display` other than its
 * default stops the browser hiding the panel at all. And the panel is hidden by an
 * explicit rule rather than left to the user agent, because even with that fixed,
 * something in this stack kept a closed `<details>`'s content laid out at full
 * height. Both were found by clicking the thing and measuring it.
 */
function SidebarGroup({ item, children }: { item: PageTree.Folder; children: ReactNode }) {
  const filtering = useContext(FilteringContext);
  const [collapsed, setCollapsed] = useState(!(item.defaultOpen ?? true));
  const open = filtering || !collapsed;

  return (
    <details
      open={open}
      onToggle={(e) => setCollapsed(!e.currentTarget.open)}
      className="[&:not([open])>div]:hidden [&::-webkit-details-marker]:hidden"
    >
      <summary className="cursor-pointer list-none marker:content-['']">
        <span className={groupClass}>
          <ChevronDown className={`size-3 transition-transform ${open ? '' : '-rotate-90'}`} />
          {item.icon}
          <SidebarLabel name={item.name} />
        </span>
      </summary>
      {/* 8px per level, as MDN indents: typeface and weight already say which level
          you are on. */}
      <div className="ps-2">{children}</div>
    </details>
  );
}

/**
 * An Area or a Section has an overview, so its row is two controls, not one: the
 * label is a link to that overview, and a chevron beside it opens and closes the
 * children.
 *
 * It is deliberately not a `<details>`, which a group can afford to be. Putting the
 * link inside a `<summary>` makes one target do two jobs — the browser toggles on
 * any click within the summary — so the two are kept as separate controls sharing a
 * row, which is also what lets the chevron carry `aria-expanded` while the link
 * stays a plain link.
 *
 * **Navigation opens; a click overrides; navigation resets the override.** Being
 * inside a Section opens it, so arriving at `math.abs()` reveals `math`. Clicking
 * the chevron overrides that either way, so a Section can be opened while you read
 * elsewhere and closed while you read inside it. Crossing the boundary — entering
 * or leaving — drops the override, so the next arrival behaves like the first.
 *
 * The one place those two rules collide is the row you are already on: navigating
 * to it does nothing, and arriving is what opens it, so a second click on the label
 * would appear dead. There the label toggles instead of navigating.
 *
 * This replaces scoping the tree to one Section. The defect that motivated scoping
 * was real and is fixed here at its source: a Section expanded on navigation while
 * its row said nothing about being expandable, so the tree appeared to accordion on
 * its own. The chevron is the missing affordance. Removing the siblings was a way
 * to hide the symptom, and it cost every reader the ability to see `string` from
 * `math`.
 */
function SidebarSection({
  item,
  index,
  children,
}: {
  item: PageTree.Folder;
  index: PageTree.Item;
  children: ReactNode;
}) {
  const { pathname } = useLocation();
  const panelId = useId();
  const filtering = useContext(FilteringContext);
  const inside = pathname === index.url || pathname.startsWith(`${index.url}/`);

  const [override, setOverride] = useState<boolean | null>(null);
  const [wasInside, setWasInside] = useState(inside);
  if (wasInside !== inside) {
    setWasInside(inside);
    setOverride(null);
  }
  // A filter only shows what matched, so everything left is worth seeing. Collapse
  // state is suspended, not discarded — emptying the box restores it.
  const open = filtering || (override ?? inside);

  const isArea = index.url.split('/').filter(Boolean).length === 2;
  const name = textOf(item.name);
  const onOverview = pathname === index.url;

  return (
    <div>
      <div className={isArea ? areaClass : sectionClass}>
        {/* 24px, not the 12px the icon draws: this sits beside a ~190px label, and a
            chevron smaller than the minimum target is one the reader hits the label
            instead of. */}
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          aria-label={`${open ? 'Collapse' : 'Expand'} ${name ?? 'section'}`}
          onClick={() => setOverride(!open)}
          className="-ms-1 -my-1 flex size-6 shrink-0 cursor-pointer items-center justify-center rounded hover:bg-fd-accent"
        >
          <ChevronDown className={`size-3 transition-transform ${open ? '' : '-rotate-90'}`} />
        </button>
        <Link
          to={index.url}
          data-active={onOverview || undefined}
          // Clicking the label of the overview you are already reading navigates
          // nowhere, so it toggles instead — otherwise a second click on the row
          // appears to do nothing, since arriving at a Section is what opens it.
          // Modified clicks are left alone: they still open the page in a new tab.
          onClick={(e) => {
            if (!onOverview || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
            e.preventDefault();
            setOverride(!open);
          }}
          className="flex flex-1 items-center gap-2"
        >
          {item.icon}
          <SidebarLabel name={item.name} />
        </Link>
      </div>
      {/* Rendered only when open, not hidden with CSS: the tree is ~295 entries, and
          every closed Section that still rendered its children would be paying for
          them in the DOM. 8px per level, as MDN indents. */}
      {open && (
        <div id={panelId} className="ps-2">
          {children}
        </div>
      )}
    </div>
  );
}

export function SidebarFolderNode({
  item,
  children,
}: {
  item: PageTree.Folder;
  children: ReactNode;
}) {
  const index = item.index;

  // A group has no page, so collapsing is the only thing it can do — MDN's `Static
  // methods`, and this is MDN's markup: a native `<details>`/`<summary>`. Fumadocs's
  // collapsible is driven by an exit transition that left the panel at full height
  // when toggled shut, and none of its machinery buys anything here: `<summary>`
  // already gives us the disclosure semantics, keyboard support and toggling.
  if (!index) {
    return <SidebarGroup item={item}>{children}</SidebarGroup>;
  }

  return (
    <SidebarSection item={item} index={index}>
      {children}
    </SidebarSection>
  );
}
