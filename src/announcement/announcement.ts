import { gitConfig } from '@/lib/shared';

export type Announcement = {
  /**
   * Scopes the dismissal. A reader who closes one announcement has said nothing about
   * the next, so **every new announcement gets a new id** — reusing one silently hides
   * it from everybody who dismissed its predecessor.
   */
  id: string;
  badge: string;
  /** The whole message. Shown from `sm` up. */
  message: string;
  /** The part of it that survives a phone, where there is one line to spend. */
  shortMessage: string;
  linkText: string;
  href: string;
};

/**
 * The one announcement, or `null` when there is nothing to announce.
 *
 * A single constant rather than a list: two bars stacked above the navbar is not a
 * layout this site has, and a list invites the second one. Retiring this is setting it
 * to `null`; replacing it is editing the fields and **changing the id**.
 */
export const ANNOUNCEMENT: Announcement | null = {
  id: 'v2-beta',
  badge: 'Beta',
  message: 'LuaDocs v2 is here — a full rewrite, and still rough in places',
  shortMessage: 'LuaDocs v2 is here',
  linkText: 'Read more',
  href: `https://github.com/${gitConfig.user}/${gitConfig.repo}/discussions/25`,
};
