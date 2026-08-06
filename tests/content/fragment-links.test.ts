import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { describe, it, expect } from 'vitest';
import { createProcessor } from '@mdx-js/mdx';
import { remarkHeading } from 'fumadocs-core/mdx-plugins/remark-heading';
import { listContentFiles } from '@/content-tree/scaffold';
import { docsRoute } from '@/lib/shared';

const DEST = 'content/docs';

/**
 * The heading ids, from the plugin that writes them.
 *
 * `remarkHeading` is what fumadocs' MDX preset runs, and it slugs with `github-slugger`
 * over the flattened heading — punctuation, inline code and all. Reimplementing that rule
 * here would make a guard that is *worse than none*: it would pass on links the reader
 * finds broken and fail on links that work, and the two rules would drift apart silently
 * the first time either side changed. So this runs the real plugin inside the real MDX
 * compiler, and reads the ids out of what it produced.
 *
 * `@mdx-js/mdx` is `fumadocs-mdx`'s own compiler; it is declared as a devDependency so
 * this file imports something the project asked for rather than something it happens to
 * get from a dependency's dependency.
 */
const processor = createProcessor({ remarkPlugins: [[remarkHeading, { generateToc: true }]] });

/** Frontmatter is stripped before compilation by fumadocs-mdx, so strip it here too. */
const FRONTMATTER = /^---\n[\s\S]*?\n---\n/;

async function headingIdsIn(text: string): Promise<Set<string>> {
  const file = await processor.process(text.replace(FRONTMATTER, ''));
  // `url` is `#the-slug`; the fragment a link carries is everything after the `#`.
  return new Set((file.data.toc ?? []).map((item) => item.url.slice(1)));
}

/** Every `.mdx` in the tree, by the path `listContentFiles` reports, to its heading ids. */
const headings = new Map<string, Set<string>>();

for (const rel of await listContentFiles(DEST)) {
  if (!rel.endsWith('.mdx')) continue;
  headings.set(rel, await headingIdsIn(await readFile(join(DEST, rel), 'utf8')));
}

/**
 * An in-repo link carrying a fragment, in any of the forms an entry writes: a markdown
 * link, or a `href` on a component. Both end at the first character that cannot be in a
 * URL, which is `)` or a quote.
 */
const LINK = new RegExp(`${docsRoute}/[A-Za-z0-9/._-]*#[A-Za-z0-9._-]+`, 'g');

interface FragmentLink {
  /** The file the link is written in. */
  from: string;
  /** The whole link, as authored. */
  href: string;
  /** The `.mdx` it points at, or `null` when no file answers that URL. */
  target: string | null;
  fragment: string;
}

/** `/docs/standard-library/math/floor` → `standard-library/math/floor.mdx`. */
function fileFor(path: string): string | null {
  const rest = path.slice(docsRoute.length + 1);
  for (const candidate of [`${rest}.mdx`, rest ? `${rest}/index.mdx` : 'index.mdx']) {
    if (headings.has(candidate)) return candidate;
  }
  return null;
}

const links: FragmentLink[] = [];

for (const [rel] of headings) {
  const text = await readFile(join(DEST, rel), 'utf8');
  for (const [href] of text.matchAll(LINK)) {
    const [path, fragment] = href.split('#');
    links.push({ from: rel, href, target: fileFor(path), fragment });
  }
}

describe('every in-repo fragment link lands on a heading', () => {
  it('has links to check at all', () => {
    // Not `> 0`: this guard's whole value is that it reads the same links the reader
    // clicks, and a pattern that quietly stopped matching would leave it green and
    // empty. The count is what the `math` section had when this was written.
    expect(links.length).toBeGreaterThanOrEqual(20);

    // The convention says a later entry links to the subtype rule rather than restating
    // it, so this one anchor carries most of the section. If it ever stops appearing
    // here, the pattern above has broken, not the content.
    const subtypeRule = links.filter((link) => link.fragment === 'which-subtype-comes-back');
    expect(subtypeRule.length).toBeGreaterThanOrEqual(10);
  });

  it('points every one of them at a page that exists', () => {
    const missing = links
      .filter((link) => link.target === null)
      .map((link) => `${link.from} → ${link.href} (no page answers that URL)`);

    expect(missing).toEqual([]);
  });

  it('finds the heading each fragment names', () => {
    // Retitling a linked heading is the failure this exists for: nothing else notices.
    // No test fails, no build error — the link simply lands at the top of the page, and
    // the sentence that sent the reader there goes on promising a section by name.
    // One retitled heading breaks every entry that links to it — sixteen of them, for
    // the subtype rule — so the headings the target *does* have are spelled out once per
    // target rather than once per link, and the rest of the failures stay one line each.
    const explained = new Set<string>();

    const broken = links
      .filter((link) => link.target && !headings.get(link.target)!.has(link.fragment))
      .map((link) => {
        const line = `${link.from} → ${link.href}`;
        if (explained.has(link.target!)) return line;

        explained.add(link.target!);
        return `${line}\n    ${link.target} has: ${[...headings.get(link.target!)!].join(', ')}`;
      });

    expect(broken).toEqual([]);
  });

  it('slugs a heading the way the site does, not the way a regex would', async () => {
    // The rule is `github-slugger`'s, and it is not the obvious one: inline code keeps
    // its text, `()` and `.` vanish without leaving a separator, and `#` disappears
    // entirely. A hand-written `toLowerCase().replace(/\W+/g, '-')` would answer
    // `math-floor-and-the-operator` here and be wrong on every heading of this shape.
    expect(
      await headingIdsIn('## Why `math.floor()` and the `#` operator disagree\n'),
    ).toContain('why-mathfloor-and-the--operator-disagree');
  });
});
