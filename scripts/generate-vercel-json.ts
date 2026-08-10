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
