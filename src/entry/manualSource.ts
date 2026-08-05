/**
 * The inverse of `sourceUrl()` in `src/content-tree/manifest.ts`.
 *
 * It re-derives rather than importing, because the manifest is the whole 292-entry
 * tree and belongs to the build. `tests/entry/manual-source.test.ts` round-trips every
 * source the manifest generates, which is what keeps the pair honest.
 */
const MANUAL_URL = /^https:\/\/www\.lua\.org\/manual\/(\d+\.\d+)\/manual\.html#(.+)$/;

export interface ManualRef {
  /** The manual this anchor is valid in. Section numbers move between versions. */
  version: string;
  anchor: string;
}

export function parseManualUrl(url: string): ManualRef | null {
  const match = MANUAL_URL.exec(url);
  if (!match) return null;

  return { version: match[1], anchor: match[2] };
}

/**
 * How the anchor reads in prose. The manual anchors every standard-library identifier
 * as `pdf-<name>` and every section as its number.
 */
export function citationFor(anchor: string): string {
  return anchor.startsWith('pdf-') ? anchor.slice(4) : `§${anchor}`;
}
