import { createFileRoute, Link } from '@tanstack/react-router';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { marketingOptions } from '@/lib/layout.shared';
import { Footer } from '@/marketing/Footer';

export const Route = createFileRoute('/')({
  component: Home,
});

function Home() {
  return (
    <HomeLayout {...marketingOptions()}>
      <div className="flex flex-col items-center justify-center text-center flex-1">
        <h1 className="font-medium text-xl mb-4">LuaDocs — an MDN-style reference for Lua.</h1>
        <Link
          to="/docs/$"
          params={{
            _splat: '',
          }}
          className="px-3 py-2 rounded-lg bg-fd-primary text-fd-primary-foreground font-medium text-sm mx-auto"
        >
          Open Docs
        </Link>
      </div>
      <Footer />
    </HomeLayout>
  );
}
