import { createFileRoute } from '@tanstack/react-router';
import { EntryBodyDemo } from '@/demo/EntryBodyDemo';
import { demoHead } from '@/demo/head';

export const Route = createFileRoute('/demo/entry-body')({
  component: EntryBodyDemo,
  head: () => demoHead('Entry body: now vs proposed'),
});
