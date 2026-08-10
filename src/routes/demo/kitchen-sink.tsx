import { createFileRoute } from '@tanstack/react-router';
import { KitchenSink } from '@/demo/KitchenSink';
import { demoHead } from '@/demo/head';

export const Route = createFileRoute('/demo/kitchen-sink')({
  component: KitchenSink,
  head: () => demoHead('Kitchen sink'),
});
