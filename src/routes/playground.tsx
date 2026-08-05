import { createFileRoute } from '@tanstack/react-router';
import { Playground } from '@/playground/Playground';

/**
 * The playground owns the whole viewport — no sidebar, no table of contents, no docs
 * chrome — which is why it does not sit inside `HomeLayout` as the placeholder it
 * replaces did. It is a destination in the sidebar (ADR 0007) that deliberately does
 * not look like the rest of the site once you are in it.
 */
export const Route = createFileRoute('/playground')({
  component: Playground,
  head: () => ({
    meta: [{ title: 'Playground — LuaDocs' }],
  }),
});
