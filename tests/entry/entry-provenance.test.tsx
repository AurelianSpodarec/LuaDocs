import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EntryProvenance } from '@/entry/EntryProvenance';

const href = (name: RegExp) => screen.getByRole('link', { name }).getAttribute('href') ?? '';
const panel = () => screen.getByRole('region', { name: /about this page/i });

describe('EntryProvenance', () => {
  it('leads with how vetted the entry is', () => {
    // The panel's first line is the one MDN's equivalent box does not have at all, and
    // on a reference written this way it is what a reader needs before anything else.
    render(<EntryProvenance path="standard-library/string/len.mdx" />);
    expect(panel().firstElementChild).toHaveAttribute('data-reviewed', 'no');
  });

  it('offers both a contribute link and a report link', () => {
    render(<EntryProvenance path="standard-library/string/gsub.mdx" />);

    const edit = href(/improve this page/i);
    expect(edit).toContain('/edit/');
    expect(edit).toContain('content/docs/standard-library/string/gsub.mdx');

    const report = href(/report a problem/i);
    expect(report).toContain('/issues/new?');
    expect(decodeURIComponent(report)).toContain('standard-library/string/gsub.mdx');
  });

  it('keeps both links present once the entry has been checked', () => {
    // A checked entry can still be wrong; removing the way to say so would be worse.
    render(<EntryProvenance reviewed="2026-08-05" path="standard-library/string/gsub.mdx" />);
    expect(href(/improve this page/i)).toContain('/edit/');
    expect(href(/report a problem/i)).toContain('/issues/new?');
  });

  it('opens every outbound link safely in a new tab', () => {
    render(
      <EntryProvenance path="x.mdx" lastModified="2026-08-03T09:12:00Z" />,
    );
    for (const link of screen.getAllByRole('link')) {
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'));
    }
  });

  it('points the date at the commits behind it', () => {
    // The date is derived from git, so "what changed" is a real page rather than the
    // unverifiable byline MDN puts here.
    render(<EntryProvenance path="standard-library/string/len.mdx" lastModified="2026-08-03T09:12:00Z" />);
    const history = href(/3 August 2026/);
    expect(history).toContain('/commits/');
    expect(history).toContain('content/docs/standard-library/string/len.mdx');
  });

  it('still states the date when git has none to link', () => {
    render(<EntryProvenance path="x.mdx" />);
    expect(document.querySelector('[data-last-updated]')).toBeNull();
    expect(panel()).toHaveTextContent('Awaiting review');
  });

  it('stays out of the table of contents', () => {
    // `Source` above it is an addressable section with a heading and a rail entry; this
    // is not one. A heading here would put page-maintenance metadata in a rail that
    // otherwise lists what the entry documents (ADR 0011).
    const { container } = render(<EntryProvenance path="x.mdx" />);
    expect(container.querySelector('h1, h2, h3')).toBeNull();
  });
});
