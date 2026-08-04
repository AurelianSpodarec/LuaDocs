import { existsSync } from 'node:fs';
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import {
  pagesOf,
  ROOT_PAGES,
  sourceUrl,
  type EntryType,
  type Section,
  type Source,
} from './manifest';

/** The entire body of an unwritten entry. A JSX comment — MDX rejects `<!-- -->`. */
export const PLACEHOLDER = '{/* Not yet written. */}';

/**
 * Files under the destination that the manifest deliberately does not own.
 * `index.mdx` is the site's authored root entry: it predates the manifest, belongs
 * to no section, and must be neither generated nor reported as stale.
 */
export const UNMANAGED = ['index.mdx'];

export interface ScaffoldStats {
  written: number;
  unchanged: number;
  /** Files left alone because they differ from what the generator would write. */
  kept: number;
  /** Files the manifest does not account for — a renamed slug leaves its old file here. */
  orphans: string[];
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

function meta(value: unknown): string {
  return `${JSON.stringify(value, null, 2)}\n`;
}

/**
 * Every file the manifest calls for, as relative POSIX paths mapped to the exact
 * text the generator would write. Pure — nothing here reaches the filesystem, so a
 * caller can use it to check a committed tree against the manifest without writing.
 */
export function contentTreeFiles(tree: Section[]): Map<string, string> {
  const files = new Map<string, string>([['meta.json', meta({ pages: ROOT_PAGES })]]);

  function walk(sec: Section, prefix: string): void {
    const dir = prefix ? `${prefix}/${sec.slug}` : sec.slug;
    files.set(`${dir}/meta.json`, meta({ title: sec.title, pages: pagesOf(sec) }));
    files.set(`${dir}/index.mdx`, stub(sec.title, 'overview', sec.source));
    for (const e of sec.entries) {
      files.set(`${dir}/${e.slug}.mdx`, stub(e.title, e.type, e.source));
    }
    for (const child of sec.sections) walk(child, dir);
  }

  for (const sec of tree) walk(sec, '');
  return files;
}

/**
 * A fresh clone on Windows checks the tree out with CRLF endings, so a byte
 * comparison would see every generated file as hand-edited and freeze the whole
 * tree. The guarantee below must not depend on anyone's git configuration.
 */
function sameText(a: string, b: string): boolean {
  return a.replace(/\r\n/g, '\n') === b.replace(/\r\n/g, '\n');
}

/**
 * The generator creates; it never updates. An absent file is `written`. A file whose
 * text matches what the generator would produce is `unchanged`. A file that differs
 * in any way — its body, its frontmatter, a hand-ordered `meta.json` — has been
 * touched by a human and is `kept`, untouched.
 *
 * Consequence: a manifest change (a corrected `source` anchor, a retitled entry, a
 * reordered section) does not propagate into files that already exist; propagating
 * means deleting them and regenerating. That trade is deliberate. There is no way to
 * tell a pristine stub from one whose frontmatter an author has started filling in —
 * `description` is written last, `lua-compat` only appears once an entry has compat
 * data — so the only safe reading of "differs" is "someone worked on this".
 */
async function write(path: string, contents: string, stats: ScaffoldStats): Promise<void> {
  if (existsSync(path)) {
    const existing = await readFile(path, 'utf8');
    if (sameText(existing, contents)) stats.unchanged++;
    else stats.kept++;
    return;
  }
  await writeFile(path, contents, 'utf8');
  stats.written++;
}

/** Every entry and `meta.json` already under `dir`, as relative POSIX paths. */
export async function listContentFiles(dir: string, prefix = ''): Promise<string[]> {
  if (!existsSync(dir)) return [];
  const found: string[] = [];
  for (const item of await readdir(dir, { withFileTypes: true })) {
    const rel = prefix ? `${prefix}/${item.name}` : item.name;
    if (item.isDirectory()) found.push(...(await listContentFiles(join(dir, item.name), rel)));
    else if (item.name.endsWith('.mdx') || item.name === 'meta.json') found.push(rel);
  }
  return found;
}

/**
 * Files on disk the manifest no longer calls for. Renaming a slug leaves the old
 * file behind, where it keeps showing up in the sidebar, the prerender output, the
 * search index and `llms.txt`. They are reported, never deleted — a stale stub is
 * cheap to remove by hand, and an over-eager delete could eat authored work.
 */
export function orphansOf(onDisk: string[], expected: Map<string, string>): string[] {
  return onDisk.filter((rel) => !expected.has(rel) && !UNMANAGED.includes(rel)).sort();
}

export async function scaffoldContent(destDir: string, tree: Section[]): Promise<ScaffoldStats> {
  const stats: ScaffoldStats = { written: 0, unchanged: 0, kept: 0, orphans: [] };
  const files = contentTreeFiles(tree);

  for (const [rel, contents] of files) {
    const path = join(destDir, rel);
    await mkdir(dirname(path), { recursive: true });
    await write(path, contents, stats);
  }

  stats.orphans = orphansOf(await listContentFiles(destDir), files);
  return stats;
}
