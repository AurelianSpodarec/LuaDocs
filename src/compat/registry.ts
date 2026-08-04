import { compatNodeSchema, type CompatNode } from './schema';
import stringFormat from './data/string.format.json';

/**
 * Every compat dataset, keyed by the `lua-compat` value an entry declares in its
 * frontmatter. Parsing at module load means malformed version facts fail the build
 * rather than rendering as a silently wrong support strip.
 */
const raw: Record<string, unknown> = {
  'string.format': stringFormat,
};

export const compatNodes: Record<string, CompatNode> = Object.fromEntries(
  Object.entries(raw).map(([key, value]) => [key, compatNodeSchema.parse(value)]),
);

export function compatNodeFor(key: string | undefined | null): CompatNode | null {
  if (!key) return null;
  return compatNodes[key] ?? null;
}
