import { createFileRoute, Link, notFound, useLocation } from '@tanstack/react-router';
import { DocsLayout } from 'fumadocs-ui/layouts/notebook';
import { createServerFn } from '@tanstack/react-start';
import { docs, source } from '@/lib/source';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  // Paired with the notebook layout below — `DocsPage` reads a context its layout
  // provides, and the `docs` build of it throws under a notebook `DocsLayout`.
} from 'fumadocs-ui/layouts/notebook/page';
import { baseOptions } from '@/lib/layout.shared';
import { encodeMarkdownUrl } from '@/lib/shared';
import { staticFunctionMiddleware } from '@tanstack/start-static-server-functions';
import { useFumadocsLoader } from 'fumadocs-core/source/client';
import { Suspense, use, useMemo, useState } from 'react';
import { useMDXComponents } from '@/components/mdx';
import { compatNodeFor } from '@/compat/registry';
import { varies } from '@/compat/resolve';
import { VersionMatrix } from '@/version/VersionMatrix';
import { EntrySource } from '@/entry/EntrySource';
import { EntryProvenance } from '@/entry/EntryProvenance';
import { parseManualUrl } from '@/entry/manualSource';
import { renderInlineCode } from '@/entry/inlineCode';
import { VersionPanel } from '@/version/VersionPanel';
import { VersionSwitcher } from '@/version/VersionSwitcher';
import { EntryAvailabilityProvider } from '@/version/EntryAvailability';
import { buildFullToc, entryTitleClass } from '@/entry/pageToc';
import { createSidebarItem, FilteringContext, SidebarFolderNode } from '@/sidebar/Sidebar';
import { groupPageTree } from '@/sidebar/groupPageTree';
import { scopeToDestination } from '@/sidebar/destinations';
import { countEntries, filterPageTree } from '@/sidebar/filterPageTree';
import { DestinationsBlock, SidebarFilter } from '@/sidebar/SidebarHeader';
import { ThemeSwitch } from 'fumadocs-ui/layouts/shared/slots/theme-switch';

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
      source: page.data.source ?? null,
      reviewed: page.data.reviewed ?? null,
      compatByUrl,
      markdownUrl: encodeMarkdownUrl(page.slugs, page.locale),
      pageTree: await source.serializePageTree(source.getPageTree()),
    };
  });

function Content({
  path,
  luaCompat,
  sourceUrl,
  reviewed,
}: {
  path: string;
  luaCompat: string | null;
  sourceUrl: string | null;
  reviewed: string | null;
}) {
  const page = docs.getPage(path);
  if (!page) throw new Error(`unknown page: ${path}`);

  // `lastModified` rides with the loaded content rather than the frontmatter: it is
  // derived at build time from git, not authored, so it is not part of the sync entry.
  const { toc, lastModified } = use(page.load());
  const MDX = page.body;
  const node = compatNodeFor(luaCompat);

  // The matrix and the citation are rendered by the route, so neither heading is in
  // the MDX-derived TOC. Without these the right rail claims the page ends at "See
  // also" while two sections follow it. `buildFullToc` also drops the MDX TOC down to
  // H2 — see the comment there for why the rail can't just take what Fumadocs hands it.
  const fullToc = buildFullToc(toc, {
    showVersionSupport: Boolean(node && varies(node)),
    showSource: Boolean(sourceUrl && parseManualUrl(sourceUrl)),
  });

  return (
    // Two of Fumadocs's page furniture pieces are off, both under ADR 0007/0011.
    // `footer` is the previous/next pair, and a reference has no sequence for it to
    // describe; it comes back scoped to Learn, which does. `breadcrumb` restated a path
    // the reader had just clicked, above the one heading that says where they are.
    <DocsPage toc={fullToc} footer={{ enabled: false }} breadcrumb={{ enabled: false }}>
      <DocsTitle className={entryTitleClass}>{page.title}</DocsTitle>
      {/* Through `renderInlineCode`, because frontmatter is not MDX and gets no markdown
          pass of its own — so a description naming `__len` used to set the identifier in
          the same face as the prose around it. The raw string stays the frontmatter's,
          which is what a search index and a meta tag will want. */}
      <DocsDescription>{renderInlineCode(page.description ?? '')}</DocsDescription>
      {/* The version switcher used to sit here. It moved to the header, where it is
          visible on every page rather than only on entries (ADR 0007). */}
      {/*
        Fumadocs's page-actions row sat here — Copy Markdown, plus a popover holding
        View as Markdown, Open in GitHub and four AI deep links. It is removed until
        the content pipeline (slice 3) fixes what it was serving.

        Every item but one pointed at `/docs/**.md`, which `getLLMText` builds from the
        MDX body alone. That body is not a degraded copy of the page, it is a
        contradictory one: both arms of an `<Only before/since>` pair arrive adjacent
        and unlabelled, so `error()` exports one sentence saying `nil` reaches a catcher
        as `nil` and the next saying it does not. Examples arrive as `code={`…\n…`}`
        attributes, and the version matrix and the manual citation are rendered here
        rather than authored, so neither reaches the export — the citation being an
        attribution the licence requires (ADR 0003).

        Handing that to a model, on a site whose whole premise is being right about
        versions, is worse than offering nothing: the reader cannot see what was
        exported, and there is no way to caveat a clipboard.

        The remaining item, Open in GitHub, is sound but duplicates "Improve this page"
        in the provenance panel at the foot, which resolves to the same file.
      */}
      {/* One panel rather than three floating bands — an alert stripe, a bare row of
          pills and sometimes a second stripe, none of which said they were about the
          same subject. Modelled on MDN's Baseline block; see `VersionPanel`. */}
      {node && <VersionPanel node={node} />}
      {/* The body needs to know too: a runnable example that fires on its own and prints
          a result is a demonstration, and a demonstration outweighs a notice the reader
          has already scrolled past. */}
      <EntryAvailabilityProvider node={node}>
        <DocsBody>
          <MDX components={useMDXComponents()} />
        </DocsBody>
      </EntryAvailabilityProvider>
      {/* Derived, not authored — see the amendment in page-structure.md. Both sit
          after "See also" so neither is a thing an author has to remember to place. */}
      {node && <VersionMatrix node={node} />}
      {sourceUrl && <EntrySource url={sourceUrl} />}
      {/* Last on the page, and a panel rather than loose lines: it is about this site's
          copy of the entry rather than about Lua, and with previous/next gone it is what
          gives the page an ending (ADR 0011). */}
      <EntryProvenance reviewed={reviewed} path={path} lastModified={lastModified} />
    </DocsPage>
  );
}

function Page() {
  const { pageTree, path, markdownUrl, luaCompat, compatByUrl, source: sourceUrl, reviewed } =
    useFumadocsLoader(Route.useLoaderData());
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
        // `links` is the only slot rendered inside the sidebar's scroll viewport, so
        // it is what makes the block scroll with the tree rather than pin 168px of a
        // panel it is only occasionally used from. `on: 'menu'` keeps it out of the
        // navbar, and `app.css` unhides the `lg:hidden` wrapper the notebook layout
        // puts around it.
        links={[{ type: 'custom', on: 'menu', children: <DestinationsBlock /> }]}
        // The tree's top level is Areas, not product tabs. Left on, fumadocs would
        // derive a tab dropdown from it and offer a second, competing way to switch.
        tabs={false}
        tree={tree}
        sidebar={{
          // Fumadocs collapses the sidebar on desktop by default. The tree is the
          // primary navigation on a reference site; there is no reason to offer to
          // hide it, and the trigger was one more control in a row already crowded.
          collapsible: false,
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
            luaCompat={luaCompat}
            sourceUrl={sourceUrl}
            reviewed={reviewed}
          />
        </Suspense>
      </DocsLayout>
    </FilteringContext.Provider>
  );
}
