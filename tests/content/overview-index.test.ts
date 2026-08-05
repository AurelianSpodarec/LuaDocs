import { readFile } from 'node:fs/promises';
import { join, posix } from 'node:path';
import { describe, it, expect } from 'vitest';
import { listContentFiles, PLACEHOLDER } from '@/content-tree/scaffold';

/**
 * A section overview's index must list exactly its section's entries.
 *
 * The overview fork chose an **authored** index over one derived from the page tree,
 * because a derived list cannot gloss an entry, cannot say why two entries sit together,
 * and cannot order a group the way a reader works. What it gave up is the one thing a
 * derived list gets for free: it cannot go stale. A sibling added later is simply absent
 * from the front door, and nothing complains.
 *
 * This is that guarantee bought back. It is deliberately not in `entry-anatomy.test.ts`:
 * that file checks a page against its own frontmatter, and this checks a page against
 * its neighbours on disk.
 */
const DEST = 'content/docs';

/** `/docs/standard-library/string/gsub` → `gsub`, for links inside `<dir>`. */
function linkedSlugs(body: string, dir: string): Set<string> {
  const pattern = new RegExp(`/docs/${dir}/([a-z0-9-]+)`, 'g');
  return new Set([...body.matchAll(pattern)].map((match) => match[1]));
}

interface Overview {
  dir: string;
  body: string;
  siblings: Set<string>;
}

const overviews: Overview[] = [];
const files = await listContentFiles(DEST);

for (const rel of files) {
  if (!rel.endsWith('/index.mdx')) continue;

  const text = await readFile(join(DEST, rel), 'utf8');
  if (text.includes(PLACEHOLDER)) continue;

  const frontmatter = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/.exec(text);
  if (!frontmatter) continue;
  if (!/^entry-type: overview$/m.test(frontmatter[1])) continue;

  const dir = posix.dirname(rel);
  const siblings = new Set(
    files
      .filter((other) => posix.dirname(other) === dir && other.endsWith('.mdx'))
      .map((other) => posix.basename(other, '.mdx'))
      .filter((slug) => slug !== 'index'),
  );

  overviews.push({ dir, body: frontmatter[2], siblings });
}

describe('a section overview indexes its section', () => {
  it('has an overview to check at all', () => {
    // Every section but `string` is still a stub, so this is 1 today. It must never be
    // 0 — a guard that silently checks nothing is worse than no guard.
    expect(overviews.length).toBeGreaterThan(0);
  });

  it('links every entry in its section', () => {
    for (const overview of overviews) {
      const linked = linkedSlugs(overview.body, overview.dir);
      const missing = [...overview.siblings].filter((slug) => !linked.has(slug)).sort();
      expect(missing, `${overview.dir}/index.mdx does not link`).toEqual([]);
    }
  });

  it('links nothing in its section that does not exist', () => {
    for (const overview of overviews) {
      const linked = linkedSlugs(overview.body, overview.dir);
      const dangling = [...linked].filter((slug) => !overview.siblings.has(slug)).sort();
      expect(dangling, `${overview.dir}/index.mdx links a missing entry`).toEqual([]);
    }
  });

  it('checks a section with real entries in it', () => {
    // Guards against the pair above passing because both sets were empty.
    for (const overview of overviews) {
      expect(overview.siblings.size, overview.dir).toBeGreaterThan(1);
    }
  });
});
