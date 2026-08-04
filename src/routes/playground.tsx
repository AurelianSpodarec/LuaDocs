import { createFileRoute, Link } from '@tanstack/react-router';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions } from '@/lib/layout.shared';

export const Route = createFileRoute('/playground')({
  component: Playground,
});

/**
 * A placeholder, and it says so rather than pretending to be an early version of the
 * editor.
 *
 * The Playground is a destination in the sidebar (ADR 0007) because that is where a
 * reader will look for it, and a destination that 404s is worse than one that explains
 * itself. The real thing — CodeMirror 6, shareable state in the URL, the same
 * worker-and-timeout runner the inline examples use — is slice 5 of the roadmap.
 */
function Playground() {
  return (
    <HomeLayout {...baseOptions()}>
      <div className="mx-auto flex max-w-xl flex-1 flex-col items-center justify-center px-4 text-center">
        <h1 className="mb-3 text-xl font-medium">Playground</h1>
        <p className="mb-6 text-fd-muted-foreground">
          The standalone editor is not built yet. Until it lands, runnable examples work
          inline on reference entries — open one and press Run.
        </p>
        <Link
          to="/docs/$"
          params={{ _splat: 'standard-library/string/format' }}
          className="mx-auto rounded-lg bg-fd-primary px-3 py-2 text-sm font-medium text-fd-primary-foreground"
        >
          Try one on string.format()
        </Link>
      </div>
    </HomeLayout>
  );
}
