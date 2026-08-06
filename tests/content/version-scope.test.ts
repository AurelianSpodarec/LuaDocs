import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { describe, it, expect } from 'vitest';
import { listContentFiles, PLACEHOLDER } from '@/content-tree/scaffold';
import { assertScope } from '@/version/versionScope';

const DEST = 'content/docs';

/**
 * `<Only>` refuses a bad scope when it renders, which is the right place for it — but
 * `.mdx` is the one part of this repo TypeScript never reads, and the throw only reaches
 * an author who happens to load the page at a version that would have shown the block.
 * A misspelled attribute leaves it rendering on all five instead, silently.
 *
 * So the same rule runs over the source text: every `<Only>` in the tree is parsed with
 * the component's own `assertScope`, not with a second copy of its conditions.
 */
const OPENING_TAG = /<Only\b([^>]*?)\/?>/g;
const ATTRIBUTE = /([A-Za-z_][\w-]*)\s*=\s*(?:"([^"]*)"|'([^']*)'|\{([^}]*)\})/g;

interface Marker {
  rel: string;
  tag: string;
  props: Record<string, unknown>;
}

const markers: Marker[] = [];

for (const rel of await listContentFiles(DEST)) {
  if (!rel.endsWith('.mdx')) continue;

  const text = await readFile(join(DEST, rel), 'utf8');
  if (text.includes(PLACEHOLDER)) continue;

  for (const match of text.matchAll(OPENING_TAG)) {
    const props: Record<string, unknown> = {};
    for (const attr of match[1].matchAll(ATTRIBUTE)) {
      props[attr[1]] = attr[2] ?? attr[3] ?? attr[4]?.trim().replace(/^['"]|['"]$/g, '');
    }
    // A bare attribute (`<Only since>`) matches no value pattern at all, so record the
    // name with `true` rather than dropping it and calling the tag well-formed.
    for (const bare of match[1].matchAll(/(?:^|\s)([A-Za-z_][\w-]*)(?=\s|$)/g)) {
      if (!(bare[1] in props)) props[bare[1]] = true;
    }
    markers.push({ rel, tag: match[0], props });
  }
}

describe('every version-scoped block in the content tree', () => {
  it('has markers to check at all', () => {
    // A guard whose pattern quietly stops matching stays green and empty otherwise.
    expect(markers.length).toBeGreaterThan(0);
  });

  it('names attributes and versions the component accepts', () => {
    const bad: string[] = [];
    for (const marker of markers) {
      try {
        assertScope({ ...marker.props, children: null });
      } catch (error) {
        bad.push(`${marker.rel}: ${marker.tag} — ${(error as Error).message}`);
      }
    }
    expect(bad).toEqual([]);
  });
});
