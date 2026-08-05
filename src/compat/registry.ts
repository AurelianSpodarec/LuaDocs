import { compatNodeSchema, type CompatNode } from './schema';
import stringFormat from './data/string.format.json';
import stringLen from './data/string.len.json';
import stringGsub from './data/string.gsub.json';
import stringPatterns from './data/string.patterns.json';
import mathTointeger from './data/math.tointeger.json';

/**
 * Every compat dataset, keyed by the `lua-compat` value an entry declares in its
 * frontmatter. Parsing at module load, against a strict schema that rejects
 * unknown keys, means malformed version facts (including typos like
 * `version_remved`) fail the build rather than rendering as a silently wrong
 * support strip.
 */
const raw: Record<string, unknown> = {
  'string.format': stringFormat,
  'string.len': stringLen,
  'string.gsub': stringGsub,
  'string.patterns': stringPatterns,
  'math.tointeger': mathTointeger,
};

export const compatNodes: Record<string, CompatNode> = Object.fromEntries(
  Object.entries(raw).map(([key, value]) => [key, compatNodeSchema.parse(value)]),
);

export function compatNodeFor(key: string | undefined | null): CompatNode | null {
  if (!key) return null;
  return compatNodes[key] ?? null;
}
