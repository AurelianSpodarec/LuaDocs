import { compatNodeSchema, type CompatNode } from './schema';
import stringByte from './data/string.byte.json';
import stringChar from './data/string.char.json';
import stringFormat from './data/string.format.json';
import stringLen from './data/string.len.json';
import stringGsub from './data/string.gsub.json';
import stringLower from './data/string.lower.json';
import stringPatterns from './data/string.patterns.json';
import stringRep from './data/string.rep.json';
import stringReverse from './data/string.reverse.json';
import stringUpper from './data/string.upper.json';
import mathTointeger from './data/math.tointeger.json';

/**
 * Every compat dataset, keyed by the `lua-compat` value an entry declares in its
 * frontmatter. Parsing at module load, against a strict schema that rejects
 * unknown keys, means malformed version facts (including typos like
 * `version_remved`) fail the build rather than rendering as a silently wrong
 * support strip.
 */
const raw: Record<string, unknown> = {
  'string.byte': stringByte,
  'string.char': stringChar,
  'string.format': stringFormat,
  'string.len': stringLen,
  'string.gsub': stringGsub,
  'string.lower': stringLower,
  'string.patterns': stringPatterns,
  'string.rep': stringRep,
  'string.reverse': stringReverse,
  'string.upper': stringUpper,
  'math.tointeger': mathTointeger,
};

export const compatNodes: Record<string, CompatNode> = Object.fromEntries(
  Object.entries(raw).map(([key, value]) => [key, compatNodeSchema.parse(value)]),
);

export function compatNodeFor(key: string | undefined | null): CompatNode | null {
  if (!key) return null;
  return compatNodes[key] ?? null;
}
