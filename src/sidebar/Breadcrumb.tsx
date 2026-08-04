import { Link, useLocation } from '@tanstack/react-router';
import { getBreadcrumbItems } from 'fumadocs-core/breadcrumb';
import type * as PageTree from 'fumadocs-core/page-tree';

/**
 * The sidebar's groups ("Functions", "Related globals") are folders in the tree so
 * that they collapse — but they are not levels of the hierarchy: they have no page
 * and no URL (ADR 0006). Fumadocs builds its breadcrumb by walking folders, so the
 * stock one renders "Standard Library › math › Functions › math.abs()", inventing a
 * crumb a reader cannot navigate to.
 *
 * Fumadocs exposes no way to skip a folder, so the breadcrumb is computed here from
 * the *ungrouped* tree instead. Area → Section → Entry, which is the hierarchy.
 */
export function createBreadcrumb(tree: PageTree.Root) {
  return function Breadcrumb() {
    const { pathname } = useLocation();
    const items = getBreadcrumbItems(pathname, tree, { includePage: false });

    if (items.length === 0) return null;

    return (
      <nav aria-label="Breadcrumb" className="flex flex-row items-center gap-1.5 text-sm">
        {items.map((item, i) => (
          <span key={`${item.url ?? item.name}-${i}`} className="flex items-center gap-1.5">
            {i > 0 && <span className="text-fd-muted-foreground">/</span>}
            {item.url ? (
              <Link to={item.url} className="text-fd-muted-foreground hover:text-fd-foreground">
                {item.name}
              </Link>
            ) : (
              <span className="text-fd-muted-foreground">{item.name}</span>
            )}
          </span>
        ))}
      </nav>
    );
  };
}
