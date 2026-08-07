import { describe, expect, it } from 'vitest';
import { baseOptions, marketingOptions } from '@/lib/layout.shared';

describe('the two shells', () => {
  it('keeps the documentation navbar free of navigation', () => {
    // ADR 0007 rule 5: the docs navbar holds controls, and rule 1 puts every
    // destination in the sidebar. `DocsLayout` renders `baseOptions()`, so a link added
    // here becomes a row of nav across all 292 entries duplicating the sidebar's own
    // top level. If this fails, fix the code rather than the test.
    expect(baseOptions().links).toBeUndefined();
  });

  it('gives the marketing shell its own links without touching the docs one', () => {
    const marketing = marketingOptions();

    expect(marketing.links?.map((link) => 'text' in link && link.text)).toEqual([
      'Documentation',
      'Playground',
      'Blog',
    ]);
    expect(baseOptions().links).toBeUndefined();
  });
});
