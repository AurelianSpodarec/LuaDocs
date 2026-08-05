/**
 * Sharing a program, with no server to share it through.
 *
 * Tailwind Play mints a short id and stores the document behind it.
 * [ADR 0004](../../docs/adr/0004-self-hosted-on-github-no-third-parties.md) rules that
 * out — the site is static files on a host of our choosing, with nothing to POST to —
 * so the program travels *inside* the link. That is strictly better in two ways a short
 * link cannot match: nothing to keep running, and nothing to go dead in three years.
 *
 * It rides in the **hash**, not the query string. A hash is never sent to a server, so a
 * reader's half-finished program is not written into somebody's access log on the way to
 * a CDN. The selected version stays in `?v=`, which is where `SelectedVersionProvider`
 * already reads and writes it, so a shared link carries both and neither mechanism has
 * to learn about the other.
 *
 * It is not compressed. A 5 KB program encodes to a 6.7 KB URL, comfortably inside what
 * browsers and chat clients carry, and `CompressionStream` would trade that margin for
 * an async encode path and a fallback branch on every browser that lacks it.
 */

/** The hash key. Short, because it is in every shared link. */
const KEY = 'p';

/**
 * The longest encoded program that still makes a dependable link.
 *
 * Browsers themselves take far more, but a shared URL passes through clients that do
 * not — chat apps, issue trackers, mail — and the failure there is a truncated link that
 * decodes to a broken program rather than an error. Refusing to make the link is the
 * kinder failure, and 8000 characters is around 6 KB of Lua: far past anything a
 * playground is for.
 */
export const MAX_SHARE_LENGTH = 8000;

/** base64url — the `+/=` of ordinary base64 all need escaping inside a URL. */
function toBase64Url(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(encoded: string): string {
  const base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
  // The `=` padding is dropped on the way out and has to be put back, because `atob`
  // rejects a string whose length is not a multiple of four.
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
  const binary = atob(padded);
  return new TextDecoder().decode(Uint8Array.from(binary, (char) => char.charCodeAt(0)));
}

/** The program, encoded for a URL. */
export function encodeProgram(code: string): string {
  return toBase64Url(code);
}

/**
 * The program an encoded string carries, or `null` if it carries nothing usable.
 *
 * Every link arriving here is untrusted — hand-edited, truncated by a chat client,
 * copied without its tail. A playground that throws on arrival is worse than one that
 * opens on the starter program, so this reports failure rather than raising it.
 */
export function decodeProgram(encoded: string): string | null {
  if (!encoded) return null;
  try {
    return fromBase64Url(encoded);
  } catch {
    return null;
  }
}

/** Whether a program still fits in a link. */
export function canShare(code: string): boolean {
  return encodeProgram(code).length <= MAX_SHARE_LENGTH;
}

/** The hash a shared link carries, without its leading `#`. */
export function hashForProgram(code: string): string {
  return `${KEY}=${encodeProgram(code)}`;
}

/**
 * The program in a `location.hash`, or `null` when there is none.
 *
 * Takes the hash with or without its leading `#`, because callers get it both ways —
 * `location.hash` includes it and a hand-built string usually does not.
 */
export function programFromHash(hash: string): string | null {
  const params = new URLSearchParams(hash.replace(/^#/, ''));
  const encoded = params.get(KEY);
  return encoded ? decodeProgram(encoded) : null;
}

/** A link that opens the playground on `code`. */
export function playgroundHref(code: string): string {
  return `/playground#${hashForProgram(code)}`;
}
