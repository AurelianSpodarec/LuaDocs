import { createFileRoute } from '@tanstack/react-router';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { blogSource } from '@/blog/source';
import { groupPostsByYear } from '@/blog/posts';
import { BlogBanner } from '@/blog/BlogBanner';
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
 *
 * **A grid of cards, widening with the viewport.** Posts here are one-line descriptions
 * over a title and a date, which is exactly what a card holds well, and at twenty posts
 * a dense grid shows the whole archive at once where a list would be a long scroll.
 * Columns are added rather than fixed at four so the page does not read as broken while
 * there are only two posts.
 *
 * **Year headings, not pagination.** They cost nothing until there are two years to
 * separate, and they keep the archive on one page — pagination hides posts behind a
 * click, from readers and from crawlers alike.
 */
function BlogIndex() {
  const groups = groupPostsByYear(
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
      <div className="mx-auto w-full max-w-6xl flex-1 px-6 py-12">
        <BlogBanner />

        {groups.length === 0 ? (
          <p className="text-fd-muted-foreground">No posts yet.</p>
        ) : (
          groups.map((group) => (
            <section key={group.year} className="mb-12 last:mb-0">
              {/* One year is the whole archive, so naming it says nothing. */}
              {groups.length > 1 ? (
                <h2 className="mb-4 font-mono text-sm text-fd-muted-foreground">{group.year}</h2>
              ) : null}

              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {group.posts.map((post) => (
                  <li key={post.url} className="flex">
                    <a
                      // `to` is typed against the generated route tree, and a post URL is
                      // data read from the collection, so this stays an anchor.
                      href={post.url}
                      className="flex flex-1 flex-col rounded-xl border bg-fd-card p-4 transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground"
                    >
                      <p className="font-medium">{post.title}</p>
                      {post.description ? (
                        <p className="mt-1 text-sm text-fd-muted-foreground">
                          {post.description}
                        </p>
                      ) : null}
                      {/* `mt-auto` pins the date to the foot of the card, so a row of
                          cards with descriptions of different lengths still lines its
                          dates up. */}
                      <div className="mt-auto pt-4">
                        <PostMeta date={post.date} author={post.author} />
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ))
        )}
      </div>
      <Footer />
    </HomeLayout>
  );
}
