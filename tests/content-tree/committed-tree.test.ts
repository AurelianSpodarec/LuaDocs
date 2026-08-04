import { describe, it, expect } from 'vitest';
import { CONTENT_TREE } from '@/content-tree/manifest';
import { contentTreeFiles, listContentFiles, orphansOf } from '@/content-tree/scaffold';

/**
 * The generator is only a backstop if someone remembers to run it. Nothing else in
 * the suite reads `content/docs/`, so editing the manifest and forgetting
 * `npm run content:scaffold` would leave every test green and only surface in a
 * multi-minute build — and then only in the missing-file direction. This closes both.
 */
const DEST = 'content/docs';

const expected = contentTreeFiles(CONTENT_TREE);
const onDisk = new Set(await listContentFiles(DEST));

describe('the committed content tree', () => {
  it('has every file the manifest calls for', () => {
    const missing = [...expected.keys()].filter((rel) => !onDisk.has(rel));
    expect(missing, 'run `npm run content:scaffold`').toEqual([]);
  });

  it('has no file the manifest does not account for', () => {
    // `content/docs/index.mdx` is the authored site root — it belongs to no section
    // and predates the manifest, so `UNMANAGED` exempts it rather than the generator
    // claiming ownership of a hand-written entry.
    expect(orphansOf([...onDisk], expected)).toEqual([]);
  });

  it('exempts only the authored root entry from the manifest', () => {
    expect(onDisk.has('index.mdx')).toBe(true);
    expect(expected.has('index.mdx')).toBe(false);
  });
});
