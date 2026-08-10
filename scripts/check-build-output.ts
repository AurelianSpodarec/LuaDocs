import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, posix } from 'node:path';
import { LEGACY_REDIRECTS } from '../src/migration/legacyRedirects';

/**
 * Post-build assertions over the prerendered site.
 *
 * These cannot run against the dev server: it answers every path with the same 200 SPA
 * shell, nonsense routes included, so a crawl of it can never 404 and would pass over a
 * wholly broken set of links. The site prerenders, so a missing page is a missing file.
 */
const OUT = '.output/public';

if (!existsSync(OUT)) {
  console.error(`${OUT} does not exist — run \`npm run build\` first.`);
  process.exit(1);
}

const failures: string[] = [];

// ---------------------------------------------------------------------------
// The redirect map against build output
// ---------------------------------------------------------------------------

for (const to of new Set(LEGACY_REDIRECTS.map((r) => r.to))) {
  if (!existsSync(`${OUT}${to}/index.html`)) failures.push(`target has no page: ${to}`);
}

const config = JSON.parse(readFileSync('vercel.json', 'utf8'));
const sources = new Set(config.redirects.map((r: { source: string }) => r.source));
for (const { from } of LEGACY_REDIRECTS) {
  if (!sources.has(from)) failures.push(`source missing from vercel.json: ${from}`);
  // A source that is also a prerendered file would be served as a page and the rule
  // would never fire.
  if (existsSync(`${OUT}${from}/index.html`)) failures.push(`source is also a page: ${from}`);
}

for (const f of ['robots.txt', 'sitemap.xml']) {
  if (!existsSync(`${OUT}/${f}`)) failures.push(`not prerendered: ${f}`);
}

// ---------------------------------------------------------------------------
// Every internal link resolves
// ---------------------------------------------------------------------------

function htmlFilesIn(dir: string): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) out.push(...htmlFilesIn(full));
    else if (name.endsWith('.html')) out.push(full);
  }
  return out;
}

/** Everything a browser would fetch from this origin, as an absolute path. */
function internalHrefsIn(html: string): string[] {
  const hrefs = [...html.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
  return hrefs
    .map((href) => href.split('#')[0].split('?')[0])
    .filter((href) => href.startsWith('/') && !href.startsWith('//'))
    .map((href) => (href.length > 1 && href.endsWith('/') ? href.slice(0, -1) : href));
}

function resolves(href: string): boolean {
  // A route prerenders to `<path>/index.html`; an asset is the file itself.
  return existsSync(`${OUT}${href}/index.html`) || existsSync(`${OUT}${href}`);
}

const pages = htmlFilesIn(OUT);
const broken = new Map<string, Set<string>>();

for (const file of pages) {
  const from = posix.join('/', file.slice(OUT.length + 1).replace(/\\/g, '/'));
  for (const href of new Set(internalHrefsIn(readFileSync(file, 'utf8')))) {
    if (resolves(href)) continue;
    if (!broken.has(href)) broken.set(href, new Set());
    broken.get(href)!.add(from);
  }
}

for (const [href, from] of [...broken].sort()) {
  const [first] = [...from];
  const more = from.size > 1 ? ` (+${from.size - 1} more)` : '';
  failures.push(`dead link: ${href} — from ${first}${more}`);
}

// ---------------------------------------------------------------------------

if (failures.length > 0) {
  console.error(failures.map((f) => `  x ${f}`).join('\n'));
  console.error(`\n${failures.length} failures`);
  process.exit(1);
}

console.log(
  `OK ${LEGACY_REDIRECTS.length} redirects, all targets prerendered; ` +
    `${pages.length} pages, every internal link resolves`,
);
