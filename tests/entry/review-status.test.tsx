import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ReviewStatus } from '@/entry/ReviewStatus';

const status = () => document.querySelector('[data-reviewed]');

describe('ReviewStatus', () => {
  it('labels an unread entry as awaiting review', () => {
    render(<ReviewStatus />);
    expect(status()).toHaveAttribute('data-reviewed', 'no');
    expect(status()).toHaveTextContent('Awaiting review');
  });

  it('does not let "checked by machine" read as "checked by a person"', () => {
    // The whole point of the component: an entry can be manual-sourced, agent-reviewed
    // and have its examples executed, and still have had no human read it.
    render(<ReviewStatus />);
    expect(status()).not.toHaveTextContent(/^Reviewed/);
    expect(status()).toHaveTextContent(/checked against the reference manual/i);
  });

  it('labels a read entry and names the date', () => {
    render(<ReviewStatus date="2026-08-05" />);
    expect(status()).toHaveAttribute('data-reviewed', 'yes');
    expect(status()).toHaveTextContent('Reviewed');
    expect(status()).toHaveTextContent('a person read this entry on 5 August 2026');
  });

  it('reads the date as UTC, so it cannot slip a day either side of midnight', () => {
    render(<ReviewStatus date="2026-01-01" />);
    expect(status()).toHaveTextContent('1 January 2026');
  });

  it('says how vetted and nothing else', () => {
    // The contribution links and the last-updated stamp moved to `EntryProvenance`,
    // which arranges all three (ADR 0011). Appending them here made one sentence
    // carry a status, a date and two calls to action at once.
    const { container } = render(<ReviewStatus />);
    expect(container.querySelectorAll('a')).toHaveLength(0);
    expect(container.querySelector('[data-last-updated]')).toBeNull();
  });
});
