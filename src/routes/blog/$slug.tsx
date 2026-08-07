import { createFileRoute, Link, notFound } from '@tanstack/react-router';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { blogSource } from '@/blog/source';
import { PostMeta } from '@/blog/PostMeta';
import { marketingOptions } from '@/lib/layout.shared';
import { Footer } from '@/marketing/Footer';
import { useMDXComponents } from '@/components/mdx';

export const Route = createFileRoute('/blog/$slug')({
  component: Post,
  loader: ({ params }) => {
    const page = blogSource.getPage([params.slug]);
    if (!page) throw notFound();

    return { slug: params.slug, title: page.data.title };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `${loaderData?.title ?? 'Post'} — LuaDocs` }],
  }),
});

function Post() {
  const { slug } = Route.useLoaderData();
  const page = blogSource.getPage([slug]);
  if (!page) throw notFound();

  // The collection is eager, so the compiled body is here without a `preload()`.
  const Body = page.data.body;

  return (
    <HomeLayout {...marketingOptions()}>
      <article className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
        <h1 className="text-3xl font-medium">{page.data.title}</h1>
        <div className="mt-2">
          <PostMeta date={page.data.date} author={page.data.author} />
        </div>
        <div className="prose mt-10">
          <Body components={useMDXComponents()} />
        </div>
        <p className="mt-16 text-sm">
          <Link to="/blog" className="text-fd-muted-foreground hover:text-fd-primary">
            ← All posts
          </Link>
        </p>
      </article>
      <Footer />
    </HomeLayout>
  );
}
