import { createFileRoute } from '@tanstack/react-router';
import { ExampleLabel } from '@/demo/ExampleLabel';
import { demoHead } from '@/demo/head';

export const Route = createFileRoute('/demo/example-label')({
  component: ExampleLabel,
  head: () => demoHead('The example card’s label'),
});
