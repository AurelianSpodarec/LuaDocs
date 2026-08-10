import { describe, expect, it } from 'vitest';
import { GA_MEASUREMENT_ID, googleAnalyticsScripts } from '@/analytics/googleAnalytics';

describe('googleAnalyticsScripts', () => {
  it('emits nothing outside a production build', () => {
    expect(googleAnalyticsScripts(false)).toEqual([]);
  });

  it('loads gtag.js for the measurement ID', () => {
    const [loader] = googleAnalyticsScripts(true);

    expect(loader.src).toBe(`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`);
    expect(loader.async).toBe(true);
  });

  it('configures the property from an inline snippet', () => {
    const [, inline] = googleAnalyticsScripts(true);
    const snippet = inline.children as string;

    expect(snippet).toContain('window.dataLayer = window.dataLayer || []');
    expect(snippet).toContain(`gtag('config', '${GA_MEASUREMENT_ID}'`);
  });

  it('leaves page views to gtag.js rather than reporting them itself', () => {
    const [, inline] = googleAnalyticsScripts(true);
    const snippet = inline.children as string;

    // Enhanced measurement counts both the landing page and the history changes
    // a router navigation makes. A `page_view` from here would double every one.
    expect(snippet).not.toContain('send_page_view');
    expect(snippet).not.toContain("'event'");
  });
});
