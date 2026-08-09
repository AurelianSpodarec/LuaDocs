import { createFileRoute } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { staticFunctionMiddleware } from '@tanstack/start-static-server-functions';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { marketingOptions } from '@/lib/layout.shared';
import { Footer } from '@/marketing/Footer';
import { Landing } from '@/marketing/Landing';
import { libraryCards } from '@/marketing/landingData';

/**
 * What the page says about the content tree is derived from the content tree, and the
 * derivation happens at build time — the site prerenders and has no server
 * ([ADR 0004](../../docs/adr/0004-self-hosted-on-github-no-third-parties.md)), which is
 * what `staticFunctionMiddleware` is for. The docs route does the same thing.
 */
const landing = createServerFn({ method: 'GET' })
  .middleware([staticFunctionMiddleware])
  .handler(async () => ({ libraries: libraryCards() }));

export const Route = createFileRoute('/')({
  component: Home,
  loader: () => landing(),
});

function Home() {
  const { libraries } = Route.useLoaderData();

  return (
    <HomeLayout {...marketingOptions()}>
      <Landing libraries={libraries} />
      <Footer />
    </HomeLayout>
  );
}
