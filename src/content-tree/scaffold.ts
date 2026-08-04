import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ROOT_PAGES, sourceUrl, type EntryType, type Section, type Source } from './manifest';

/** The entire body of an unwritten entry. A JSX comment — MDX rejects `<!-- -->`. */
export const PLACEHOLDER = '{/* Not yet written. */}';

export interface ScaffoldStats {
  written: number;
  unchanged: number;
  /** Files left alone because someone had hand-edited them (an entry body or a meta.json). */
  kept: number;
}

function stub(title: string, type: EntryType, source: Source): string {
  return [
    '---',
    `title: ${title}`,
    'description: ""',
    `entry-type: ${type}`,
    `source: ${sourceUrl(source)}`,
    '---',
    '',
    PLACEHOLDER,
    '',
  ].join('\n');
}

function body(text: string): string {
  return text.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '').trim();
}

/**
 * Writing a stub is only ever safe over nothing, or over another stub. Once an
 * entry has a real body the generator must leave it alone — regenerating the tree
 * is a routine operation and must never be able to destroy authored work.
 */
async function writeStub(path: string, contents: string, stats: ScaffoldStats): Promise<void> {
  if (existsSync(path)) {
    const existing = await readFile(path, 'utf8');
    if (body(existing) !== PLACEHOLDER) {
      stats.kept++;
      return;
    }
    if (existing === contents) {
      stats.unchanged++;
      return;
    }
  }
  await writeFile(path, contents, 'utf8');
  stats.written++;
}

/**
 * `meta.json` is where a human hand-orders a section — Fumadocs' `pages` accepts
 * `---Separator---` items, and a section overview can call for authored sub-groups
 * that the manifest doesn't know about. So this gets the same no-clobber treatment
 * as an entry body: a byte-identical file is left alone, and anything that differs
 * is assumed hand-edited and kept as-is rather than overwritten.
 *
 * Consequence: once a section's `meta.json` has been hand-edited, changing that
 * section's `title` or `pages` in the manifest will not propagate to it —
 * regenerating requires deleting the file first. That trade is deliberate: losing
 * a hand-authored section order is worse than a stale title.
 */
async function writeMeta(path: string, contents: string, stats: ScaffoldStats): Promise<void> {
  if (existsSync(path)) {
    const existing = await readFile(path, 'utf8');
    if (existing === contents) {
      stats.unchanged++;
      return;
    }
    stats.kept++;
    return;
  }
  await writeFile(path, contents, 'utf8');
  stats.written++;
}

async function walk(sec: Section, parentDir: string, stats: ScaffoldStats): Promise<void> {
  const dir = join(parentDir, sec.slug);
  await mkdir(dir, { recursive: true });

  const meta = { title: sec.title, pages: sec.pages ?? ['index', '...'] };
  await writeMeta(join(dir, 'meta.json'), `${JSON.stringify(meta, null, 2)}\n`, stats);
  const overview = stub(sec.indexTitle ?? sec.title, 'overview', sec.source);
  await writeStub(join(dir, 'index.mdx'), overview, stats);

  for (const e of sec.entries) {
    await writeStub(join(dir, `${e.slug}.mdx`), stub(e.title, e.type, e.source), stats);
  }
  for (const child of sec.sections) {
    await walk(child, dir, stats);
  }
}

export async function scaffoldContent(destDir: string, tree: Section[]): Promise<ScaffoldStats> {
  const stats: ScaffoldStats = { written: 0, unchanged: 0, kept: 0 };
  await mkdir(destDir, { recursive: true });

  const rootMeta = { pages: ROOT_PAGES };
  await writeMeta(join(destDir, 'meta.json'), `${JSON.stringify(rootMeta, null, 2)}\n`, stats);

  for (const sec of tree) {
    await walk(sec, destDir, stats);
  }
  return stats;
}

/**
 * Every docs URL the tree produces. The prerenderer discovers pages by crawling
 * links, which cannot see inside a collapsed sidebar folder — so the routes are
 * also listed explicitly, generated from the same source as the files themselves.
 */
export function contentTreeUrls(tree: Section[], prefix = '/docs'): string[] {
  return tree.flatMap((sec) => {
    const base = `${prefix}/${sec.slug}`;
    return [
      base,
      ...sec.sections.flatMap((child) => contentTreeUrls([child], base)),
      ...sec.entries.map((e) => `${base}/${e.slug}`),
    ];
  });
}
