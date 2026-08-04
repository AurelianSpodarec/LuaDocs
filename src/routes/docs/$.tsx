import { createFileRoute, Link, notFound } from '@tanstack/react-router';
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
import { Suspense, use, useMemo, type FC } from 'react';
import type { BreadcrumbProps } from 'fumadocs-ui/layouts/docs/page';
import { useMDXComponents } from '@/components/mdx';
import { compatNodeFor } from '@/compat/registry';
import { VersionSupportStrip } from '@/version/VersionSupportStrip';
import { VersionSwitcher } from '@/version/VersionSwitcher';
import { VersionNote } from '@/version/VersionNote';
import { createSidebarItem, SidebarFolderNode } from '@/sidebar/Sidebar';
import { groupPageTree } from '@/sidebar/groupPageTree';
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
      <div className="flex flex-row gap-2 items-center border-b -mt-4 pb-6">
        <MarkdownCopyButton markdownUrl={markdownUrl} />
        <ViewOptionsPopover
          markdownUrl={markdownUrl}
          githubUrl={`https://github.com/${gitConfig.user}/${gitConfig.repo}/blob/${gitConfig.branch}/content/docs/${path}`}
        />
        <VersionSwitcher />
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
  // Separators become collapsible groups before the layout ever sees the tree.
  const tree = useMemo(() => groupPageTree(pageTree), [pageTree]);
  // The breadcrumb reads the ungrouped tree: a group is not a level of hierarchy.
  const Breadcrumb = useMemo(() => createBreadcrumb(pageTree), [pageTree]);

  return (
    <DocsLayout
      {...baseOptions()}
      tree={tree}
      sidebar={{ components: { Item: SidebarItem, Folder: SidebarFolderNode } }}
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
  );
}
