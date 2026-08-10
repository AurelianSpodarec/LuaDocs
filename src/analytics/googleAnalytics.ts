import type * as React from 'react';

type ScriptTag = React.JSX.IntrinsicElements['script'];

/**
 * The GA4 property the site reports to — the same one the pre-migration site
 * used, so the readership series carries across the URL migration.
 *
 * A measurement ID is public by design: gtag.js sends it to every visitor and it
 * is readable in the page source of any site running GA. It authorises nothing
 * on its own, so it is a plain constant rather than an environment variable.
 */
export const GA_MEASUREMENT_ID = 'G-W6B2W9TT0L';

const GTAG_SRC = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;

/**
 * The gtag.js snippet, shaped as head scripts for the root route.
 *
 * Returns nothing unless the build is a production one, which keeps `vite dev`
 * sessions out of the property. The gate is a parameter so both branches stay
 * reachable from tests.
 *
 * Nothing here subscribes to the router, and whether that is right is **not
 * settled**. Entries read after the landing page are counted only if the
 * property has enhanced measurement's "page changes based on browser history
 * events" switched on, which is a GA4 admin setting this file cannot see. Real
 * journeys through the built site counted those navigations sometimes and
 * missed them other times, so confirm the setting before trusting per-entry
 * numbers.
 *
 * If it turns out to be off, the fix is `send_page_view: false` here plus a
 * component reporting `page_view` from a router subscription. Do not add that
 * component while the setting is on: both would report the same navigation and
 * every entry would count twice. Note also that gtag's own hit lands a second
 * or two behind the navigation, so a page that looks uncounted may just have
 * been looked at too early.
 */
export function googleAnalyticsScripts(enabled: boolean = import.meta.env.PROD): Array<ScriptTag> {
  if (!enabled) return [];

  return [
    { src: GTAG_SRC, async: true },
    {
      children: [
        'window.dataLayer = window.dataLayer || [];',
        'function gtag(){dataLayer.push(arguments);}',
        "gtag('js', new Date());",
        `gtag('config', '${GA_MEASUREMENT_ID}');`,
      ].join('\n'),
    },
  ];
}
