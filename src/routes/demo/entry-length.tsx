import { createFileRoute } from '@tanstack/react-router';
import { EntryLength } from '@/demo/EntryLength';
import { demoHead } from '@/demo/head';

export const Route = createFileRoute('/demo/entry-length')({
  component: EntryLength,
  head: () => demoHead('How long is an entry?'),
});
