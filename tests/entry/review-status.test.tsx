import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ReviewStatus } from '@/entry/ReviewStatus';

const status = () => document.querySelector('[data-reviewed]');
const href = (name: RegExp) => screen.getByRole('link', { name }).getAttribute('href') ?? '';

describe('ReviewStatus', () => {
  it('labels an unread entry as awaiting review', () => {
    render(<ReviewStatus path="standard-library/string/len.mdx" />);
    expect(status()).toHaveAttribute('data-reviewed', 'no');
    expect(status()).toHaveTextContent('Awaiting review');
  });

  it('does not let "checked by machine" read as "checked by a person"', () => {
    // The whole point of the component: an entry can be manual-sourced, agent-reviewed
    // and have its examples executed, and still have had no human read it.
    render(<ReviewStatus path="standard-library/string/len.mdx" />);
    expect(status()).not.toHaveTextContent(/^Reviewed/);
    expect(status()).toHaveTextContent(/checked against the reference manual/i);
  });

  it('labels a read entry and names the date', () => {
    render(<ReviewStatus date="2026-08-05" path="standard-library/string/len.mdx" />);
    expect(status()).toHaveAttribute('data-reviewed', 'yes');
    expect(status()).toHaveTextContent('Reviewed');
    expect(status()).toHaveTextContent('a person read this entry on 5 August 2026');
  });

  it('reads the date as UTC, so it cannot slip a day either side of midnight', () => {
    render(<ReviewStatus date="2026-01-01" path="x.mdx" />);
    expect(status()).toHaveTextContent('1 January 2026');
  });

  it('offers both a contribute link and a report link', () => {
    render(<ReviewStatus path="standard-library/string/gsub.mdx" />);

    const edit = href(/improve this page/i);
    expect(edit).toContain('/edit/');
    expect(edit).toContain('content/docs/standard-library/string/gsub.mdx');

    const report = href(/report a problem/i);
    expect(report).toContain('/issues/new?');
    expect(decodeURIComponent(report)).toContain('standard-library/string/gsub.mdx');
  });

  it('keeps both links present once the entry has been checked', () => {
    // A checked entry can still be wrong; removing the way to say so would be worse.
    render(<ReviewStatus date="2026-08-05" path="standard-library/string/gsub.mdx" />);
    expect(href(/improve this page/i)).toContain('/edit/');
    expect(href(/report a problem/i)).toContain('/issues/new?');
  });

  it('opens both links safely in a new tab', () => {
    render(<ReviewStatus path="x.mdx" />);
    for (const link of screen.getAllByRole('link')) {
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'));
    }
  });
});
