import { writeFileSync } from 'node:fs';
import { LEGACY_REDIRECTS } from '../src/migration/legacyRedirects';

/**
 * `vercel.json` is generated rather than hand-written, for the same reason the content
 * tree is: two hand-maintained copies of one list drift, and this one drifts into a 404
 * on a URL that used to rank.
 *
 * `permanent: true` is a 308, not a 301. Both are permanent and both pass ranking; 308
 * additionally forbids a client from rewriting the method, which is stricter than we
 * need and harmless.
 */
export function renderVercelJson(): string {
  const config = {
    $schema: 'https://openapi.vercel.sh/vercel.json',
    // Without this Vercel runs framework auto-detection, decides this is Next.js, and
    // fails the build with "No Next.js version detected". It is a TanStack Start app
    // built by Vite, which auto-detection has no preset for — `null` is Vercel's name
    // for "Other", and it is the setting that makes the two fields below authoritative.
    framework: null,
    buildCommand: 'npm run build',
    // Nitro writes the prerendered site here. `.output/server` beside it is not deployed:
    // every route on this site is prerendered, so there is nothing for a server to do
    // (ADR 0004).
    outputDirectory: '.output/public',
    // Canonicals, the sitemap and the redirect map all write paths without a trailing
    // slash (ADR 0012). Left to default, Vercel would answer both spellings and the
    // canonical would disagree with the URL that served it.
    trailingSlash: false,
    redirects: LEGACY_REDIRECTS.map(({ from, to }) => ({
      source: from,
      destination: to,
      permanent: true,
    })),
  };

  return `${JSON.stringify(config, null, 2)}\n`;
}

// Only writes when run directly, so importing it from a test has no side effect.
if (process.argv[1]?.endsWith('generate-vercel-json.ts')) {
  writeFileSync('vercel.json', renderVercelJson());
  console.log(`vercel.json: ${LEGACY_REDIRECTS.length} redirects`);
}
