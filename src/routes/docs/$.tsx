import { createFileRoute, Link, notFound, useLocation } from '@tanstack/react-router';
import { DocsLayout } from 'fumadocs-ui/layouts/notebook';
import { createServerFn } from '@tanstack/react-start';
import { docs, source } from '@/lib/source';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  MarkdownCopyButton,
  ViewOptionsPopover,
  // Paired with the notebook layout below — `DocsPage` reads a context its layout
  // provides, and the `docs` build of it throws under a notebook `DocsLayout`.
} from 'fumadocs-ui/layouts/notebook/page';
import { baseOptions } from '@/lib/layout.shared';
import { encodeMarkdownUrl, gitConfig } from '@/lib/shared';
import { staticFunctionMiddleware } from '@tanstack/start-static-server-functions';
import { useFumadocsLoader } from 'fumadocs-core/source/client';
import { Suspense, use, useMemo, useState, type FC } from 'react';
import type { BreadcrumbProps } from 'fumadocs-ui/layouts/notebook/page';
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
        // A full-width navbar, as Tailwind's docs have: wordmark and the selected
        // version on the left, search in the middle, GitHub on the right. It exists to
        // uncramp the sidebar — five controls were sharing one 30px row inside 268px,
        // wrapping "Lua version 5.4" onto two lines (ADR 0007).
        //
        // The version switcher rides here rather than in a settings menu because it
        // decides which facts on the page are true, and Tailwind's own `v4.3` chip sits
        // in exactly this spot. Theme joins it through `nav.children` rather than
        // through `themeSwitch`, because enabling that option also re-creates the
        // sidebar footer bar this shell deliberately drops.
        nav={{
          ...options.nav,
          mode: 'top',
          children: (
            <>
              <VersionSwitcher />
              <ThemeSwitch mode="light-dark-system" className="border-0 bg-transparent p-0" />
            </>
          ),
        }}
        themeSwitch={{ enabled: false }}
        // The tree's top level is Areas, not product tabs. Left on, fumadocs would
        // derive a tab dropdown from it and offer a second, competing way to switch.
        tabs={false}
        tree={tree}
        sidebar={{
          // Fumadocs collapses the sidebar on desktop by default. The tree is the
          // primary navigation on a reference site; there is no reason to offer to
          // hide it, and the trigger was one more control in a row already crowded.
          collapsible: false,
          // `banner` is the only sidebar slot the notebook layout renders on desktop.
          // Its `links` land in a `lg:hidden` wrapper, because that layout expects
          // links to live in the navbar and shows them in the sidebar only on small
          // screens — which made the destinations invisible above `lg`.
          //
          // So the block is pinned again, above the filter, which is the order ADR
          // 0007 wanted in the first place: the filter acts on the tree, so it sits
          // directly above it. The navbar is what pays for the space now.
          banner: (
            <div className="flex flex-col gap-4">
              <DestinationsBlock />
              <SidebarFilter
                query={query}
                onQueryChange={setQuery}
                resultCount={countEntries(tree)}
              />
            </div>
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
