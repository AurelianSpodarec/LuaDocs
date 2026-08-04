import { createFileRoute, Link, notFound, useLocation } from '@tanstack/react-router';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { createServerFn } from '@tanstack/react-start';
import { docs, source } from '@/lib/source';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  MarkdownCopyButton,
  ViewOptionsPopover,
} from 'fumadocs-ui/layouts/docs/page';
import { baseOptions } from '@/lib/layout.shared';
import { encodeMarkdownUrl, gitConfig } from '@/lib/shared';
import { staticFunctionMiddleware } from '@tanstack/start-static-server-functions';
import { useFumadocsLoader } from 'fumadocs-core/source/client';
import { Suspense, use, useMemo, useState, type FC } from 'react';
import type { BreadcrumbProps } from 'fumadocs-ui/layouts/docs/page';
import { useMDXComponents } from '@/components/mdx';
import { compatNodeFor } from '@/compat/registry';
import { VersionSupportStrip } from '@/version/VersionSupportStrip';
import { VersionSwitcher } from '@/version/VersionSwitcher';
import { VersionNote } from '@/version/VersionNote';
import { createSidebarItem, FilteringContext, SidebarFolderNode } from '@/sidebar/Sidebar';
import { groupPageTree } from '@/sidebar/groupPageTree';
import { scopeToDestination } from '@/sidebar/destinations';
import { countEntries, filterPageTree } from '@/sidebar/filterPageTree';
import { DestinationsBlock, SidebarFilter } from '@/sidebar/SidebarHeader';
import { ThemeSwitch } from 'fumadocs-ui/layouts/shared/slots/theme-switch';
import { createBreadcrumb } from '@/sidebar/Breadcrumb';

export const Route = createFileRoute('/docs/$')({
  component: Page,
  loader: async ({ params }) => {
    const slugs = params._splat?.split('/') ?? [];
    const data = await loader({ data: slugs });
    await docs.getPage(data.path)?.preload();
    return data;
  },
});

const loader = createServerFn({
  method: 'GET',
})
  .validator((slugs: string[]) => slugs)
  .middleware([staticFunctionMiddleware])
  .handler(async ({ data: slugs }) => {
    const page = source.getPage(slugs);
    if (!page) throw notFound();

    // The sidebar needs every entry's compat key, not just this page's, so it can
    // dim entries that don't exist in the selected version.
    const compatByUrl: Record<string, string> = {};
    for (const other of source.getPages()) {
      const key = other.data['lua-compat'];
      if (key) compatByUrl[other.url] = key;
    }

    return {
      path: page.path,
      luaCompat: page.data['lua-compat'] ?? null,
      compatByUrl,
      markdownUrl: encodeMarkdownUrl(page.slugs, page.locale),
      pageTree: await source.serializePageTree(source.getPageTree()),
    };
  });

function Content({
  path,
  markdownUrl,
  luaCompat,
  Breadcrumb,
}: {
  path: string;
  markdownUrl: string;
  luaCompat: string | null;
  Breadcrumb: FC<BreadcrumbProps>;
}) {
  const page = docs.getPage(path);
  if (!page) throw new Error(`unknown page: ${path}`);

  const { toc } = use(page.load());
  const MDX = page.body;
  const node = compatNodeFor(luaCompat);

  return (
    <DocsPage toc={toc} slots={{ breadcrumb: Breadcrumb }}>
      <DocsTitle>{page.title}</DocsTitle>
      <DocsDescription>{page.description}</DocsDescription>
      {/* The version switcher used to sit here. It moved to the header, where it is
          visible on every page rather than only on entries (ADR 0007). */}
      <div className="flex flex-row gap-2 items-center border-b -mt-4 pb-6">
        <MarkdownCopyButton markdownUrl={markdownUrl} />
        <ViewOptionsPopover
          markdownUrl={markdownUrl}
          githubUrl={`https://github.com/${gitConfig.user}/${gitConfig.repo}/blob/${gitConfig.branch}/content/docs/${path}`}
        />
      </div>
      {node && (
        <div className="flex flex-col gap-3">
          <VersionSupportStrip node={node} />
          <VersionNote node={node} name={page.title} />
        </div>
      )}
      <DocsBody>
        <MDX components={useMDXComponents()} />
      </DocsBody>
    </DocsPage>
  );
}

function Page() {
  const { pageTree, path, markdownUrl, luaCompat, compatByUrl } = useFumadocsLoader(
    Route.useLoaderData(),
  );
  const SidebarItem = useMemo(() => createSidebarItem(compatByUrl), [compatByUrl]);
  const { pathname } = useLocation();
  const [query, setQuery] = useState('');

  // Three transforms, in the only order that works (ADR 0007). Scope to the active
  // destination first, so Learn's tree never reaches Reference. Fold separators into
  // collapsible groups next, so the filter sees folders rather than flat labels.
  // Filter last, so a group emptied by the query disappears with it.
  const tree = useMemo(
    () => filterPageTree(groupPageTree(scopeToDestination(pageTree, pathname)), query),
    [pageTree, pathname, query],
  );
  // The breadcrumb reads the ungrouped, unscoped tree: a group is not a level of
  // hierarchy, and a crumb must resolve whichever destination you are in.
  const Breadcrumb = useMemo(() => createBreadcrumb(pageTree), [pageTree]);

  const options = baseOptions();

  return (
    <FilteringContext.Provider value={query.trim().length > 0}>
      <DocsLayout
        {...options}
        // The selected version decides which facts on the page are true, so it is not
        // a preference and does not belong in a settings menu (ADR 0007). Theme joins
        // it here rather than in the sidebar's own footer bar, which is dropped below.
        nav={{
          ...options.nav,
          children: (
            <>
              <VersionSwitcher />
              <ThemeSwitch mode="light-dark-system" className="border-0 bg-transparent p-0" />
            </>
          ),
        }}
        // Both of these exist only to feed fumadocs's sidebar footer bar. GitHub is
        // already the Community destination, and theme moved to the row above, so the
        // bar has nothing left in it — and fumadocs drops the element entirely when
        // all three of githubUrl, themeSwitch and languageSelect are absent.
        githubUrl={undefined}
        themeSwitch={{ enabled: false }}
        // A `custom` link renders *inside* the scroll viewport, above the page tree,
        // which is the only way to make the block scroll with the tree.
        links={[{ type: 'custom', children: <DestinationsBlock /> }]}
        tree={tree}
        sidebar={{
          banner: (
            <SidebarFilter
              query={query}
              onQueryChange={setQuery}
              resultCount={countEntries(tree)}
            />
          ),
          components: { Item: SidebarItem, Folder: SidebarFolderNode },
        }}
      >
        <Link to={markdownUrl} hidden />
        <Suspense>
          <Content
            path={path}
            markdownUrl={markdownUrl}
            luaCompat={luaCompat}
            Breadcrumb={Breadcrumb}
          />
        </Suspense>
      </DocsLayout>
    </FilteringContext.Provider>
  );
}
