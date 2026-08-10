import { Banner } from 'fumadocs-ui/components/banner';
import { ANNOUNCEMENT, type Announcement as AnnouncementData } from './announcement';

/**
 * The site-wide announcement bar, above every shell.
 *
 * **Fumadocs' `Banner` rather than a hand-rolled bar**, because the docs layout is
 * already built for one: `Banner` publishes `--fd-banner-height`, and the notebook
 * container feeds that into `--fd-docs-row-1`, which is what the sticky navbar, the
 * sidebar and the TOC are positioned and sized against. A bar of our own would sit in
 * the right place and leave the sidebar a banner's height too tall, scrolling its last
 * rows under the fold. It also solves the flash: `Banner` writes an inline `<script>`
 * before its own children, so a reader who dismissed the bar never paints it, which a
 * prerendered site (ADR 0004) cannot otherwise avoid — the HTML on disk contains the
 * bar for everyone.
 *
 * Only the layout mechanics are borrowed. The contents are ours, and `variant="normal"`
 * keeps the field itself neutral: the accent is spent on the badge and the link, where
 * it points at the two things worth clicking, rather than on a navy band across the top
 * of every entry.
 *
 * The dismiss button is fumadocs', pinned to the right of the bar — which is why the
 * padding here is asymmetric rather than the `px-4` it ships with. Nothing else in the
 * bar is clickable, so closing it cannot be a misfired navigation.
 */
export function AnnouncementBar({
  announcement = ANNOUNCEMENT,
}: {
  announcement?: AnnouncementData | null;
}) {
  if (!announcement) return null;

  const { id, badge, message, shortMessage, linkText, href } = announcement;

  return (
    <Banner
      // Namespaced because this becomes a DOM id and a `localStorage` key.
      id={`luadocs-announcement-${id}`}
      variant="normal"
      // 2.5rem rather than the 3rem fumadocs ships. This is one line of small text and
      // a pill; at 3rem it read as a strip of empty space with a sentence in it, and it
      // is 8px taken off the top of every entry on the site.
      height="2.5rem"
      className={[
        'z-50 gap-2 border-b',
        // Symmetric padding, wide enough for the close button to sit inside it. The
        // button is positioned against the right edge, so clearing it with `pe` alone
        // would centre the sentence in what is left and leave it visibly off-centre.
        'px-12',
        // Fumadocs draws the close button at half-opacity muted, which on this surface
        // is a grey smudge — the one control in the bar, and the hardest thing in it to
        // see. Full foreground colour, and a hit area that lights up.
        '[&>button]:text-fd-foreground [&>button]:hover:bg-fd-accent',
      ].join(' ')}
    >
      <span className="rounded-full bg-fd-primary px-2 py-0.5 text-xs font-semibold text-fd-primary-foreground">
        {badge}
      </span>
      {/* One sentence, two lengths. The bar is a fixed height, so on a phone the clause
          after the dash would wrap onto a second line and be clipped rather than shown. */}
      <span className="max-sm:hidden">{message}</span>
      <span className="sm:hidden">{shortMessage}</span>
      <a
        href={href}
        // The discussion is off-site and the reader is mid-entry: a new tab is the
        // difference between reading the announcement and losing your place.
        target="_blank"
        rel="noreferrer"
        className="whitespace-nowrap font-medium text-fd-primary underline underline-offset-4 hover:no-underline"
      >
        {linkText} <span aria-hidden>→</span>
      </a>
    </Banner>
  );
}
