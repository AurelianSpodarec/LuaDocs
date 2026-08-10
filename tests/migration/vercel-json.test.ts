import { readFileSync } from 'node:fs';
import { describe, it, expect } from 'vitest';
import { renderVercelJson } from '../../scripts/generate-vercel-json';
import { LEGACY_REDIRECTS } from '@/migration/legacyRedirects';

describe('the committed vercel.json', () => {
  it('matches what the generator produces', () => {
    expect(readFileSync('vercel.json', 'utf8')).toBe(renderVercelJson());
  });

  it('marks every redirect permanent', () => {
    const config = JSON.parse(renderVercelJson());
    expect(config.redirects.every((r: { permanent: boolean }) => r.permanent)).toBe(true);
  });

  it('carries one rule per pair in the map', () => {
    const config = JSON.parse(renderVercelJson());
    expect(config.redirects).toHaveLength(LEGACY_REDIRECTS.length);
  });
});
