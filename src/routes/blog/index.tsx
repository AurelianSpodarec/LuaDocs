import { createFileRoute } from '@tanstack/react-router';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { blogSource } from '@/blog/source';
import { sortPostsByDate } from '@/blog/posts';
import { PostMeta } from '@/blog/PostMeta';
import { marketingOptions } from '@/lib/layout.shared';
import { Footer } from '@/marketing/Footer';

export const Route = createFileRoute('/blog/')({
  component: BlogIndex,
  head: () => ({
    meta: [{ title: 'Blog — LuaDocs' }],
  }),
});

/**
 * The blog lives in the marketing shell, not the documentation one: it has no content
 * tree, so there is no sidebar for destinations to live in, and
 * [ADR 0007](../../../docs/adr/0007-documentation-shell.md) keeps the documentation
 * navbar to controls. Following a post leaves this shell the same way the landing page
 * does.
 */
function BlogIndex() {
  const posts = sortPostsByDate(
    blogSource.getPages().map((page) => ({
      url: page.url,
      title: page.data.title,
      description: page.data.description,
      date: page.data.date,
      author: page.data.author,
    })),
  );

  return (
    <HomeLayout {...marketingOptions()}>
      <div className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
        <h1 className="text-3xl font-medium">Blog</h1>
        <p className="mt-3 text-fd-muted-foreground">
          Release coverage, notes on how the site is built, and what changes between Lua
          versions.
        </p>

        {posts.length === 0 ? (
          <p className="mt-12 text-fd-muted-foreground">No posts yet.</p>
        ) : (
          <ul className="mt-12 space-y-10">
            {posts.map((post) => (
              <li key={post.url}>
                <article>
                  <h2 className="text-xl font-medium">
                    {/* `to` is typed against the generated route tree, and a post URL is
                        data read from the collection, so this stays an anchor. */}
                    <a href={post.url} className="hover:text-fd-primary">
                      {post.title}
                    </a>
                  </h2>
                  <div className="mt-1">
                    <PostMeta date={post.date} author={post.author} />
                  </div>
                  {post.description ? (
                    <p className="mt-3 text-fd-muted-foreground">{post.description}</p>
                  ) : null}
                </article>
              </li>
            ))}
          </ul>
        )}
      </div>
      <Footer />
    </HomeLayout>
  );
}
