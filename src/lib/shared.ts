export const appName = 'LuaDocs';
export const docsRoute = '/docs';
export const docsImageRoute = '/og/docs';

export const gitConfig = {
  user: 'AurelianSpodarec',
  repo: 'LuaDocs',
  /**
   * `dev`, not `main` — every link built from this points at a file, and `main` does not
   * have the files. All work stays on `dev` (CLAUDE.md), so `main` carries none of
   * `content/docs`, and "Open on GitHub" and "Improve this page" both 404 against it.
   * Change this when, and only when, content reaches `main`.
   */
  branch: 'dev',
};

export function encodeMarkdownUrl(slugs: string[], locale?: string) {
  const segments = [...slugs];
  if (segments.length === 0) {
    segments.push('index.md');
  } else {
    segments[segments.length - 1] += '.md';
  }

  return '/' + [locale, ...docsRoute.split('/'), ...segments].filter(Boolean).join('/');
}

/** @returns page slugs */
export function decodeMarkdownUrl(segments: string[]) {
  if (segments.length === 0) return [];

  const out = [...segments];
  out[out.length - 1] = out[out.length - 1].replace(/\.md$/, '');
  if (out.length === 1 && out[0] === 'index') out.pop();
  return out;
}
