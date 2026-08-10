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

  it('names the framework, so auto-detection does not', () => {
    // Left out, Vercel decides this is Next.js and fails the build outright with
    // "No Next.js version detected". `null` is Vercel's name for "Other".
    const config = JSON.parse(renderVercelJson());
    expect(config).toHaveProperty('framework', null);
  });

  it('points at the prerendered output', () => {
    const config = JSON.parse(renderVercelJson());
    expect(config.buildCommand).toBe('npm run build');
    expect(config.outputDirectory).toBe('.output/public');
  });

  it('serves paths without a trailing slash, as the canonicals claim', () => {
    const config = JSON.parse(renderVercelJson());
    expect(config.trailingSlash).toBe(false);
  });
});
