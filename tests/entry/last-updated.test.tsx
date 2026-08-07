import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { LastUpdated } from '@/entry/LastUpdated';

const stamp = () => document.querySelector('[data-last-updated]');

describe('LastUpdated', () => {
  it('spells the month out, so the date cannot be read two ways', () => {
    // `03/08/2026` is 3 August to one reader and 8 March to another, and nothing on
    // the page says which. The month name is the whole reason for this format.
    render(<LastUpdated at="2026-08-03T09:12:00Z" />);
    expect(stamp()).toHaveTextContent('Last updated on 3 August 2026');
  });

  it('accepts a Date as readily as a string', () => {
    render(<LastUpdated at={new Date('2026-08-03T09:12:00Z')} />);
    expect(stamp()).toHaveTextContent('3 August 2026');
  });

  it('reads the date as UTC, so it cannot slip a day either side of midnight', () => {
    // A commit at 23:30 UTC must not be stamped as the following day for a reader east
    // of it, nor the previous day for one west.
    render(<LastUpdated at="2026-01-01T23:30:00Z" />);
    expect(stamp()).toHaveTextContent('1 January 2026');
  });

  it('does not pull itself away from the text it belongs to', () => {
    // It used to carry `ms-auto`, which pinned it to the far right of the row.
    render(<LastUpdated at="2026-08-03T09:12:00Z" />);
    expect(stamp()).not.toHaveClass('ms-auto');
  });

  it('carries a machine-readable time alongside the display form', () => {
    render(<LastUpdated at="2026-08-03T09:12:00Z" />);
    expect(document.querySelector('time')).toHaveAttribute(
      'dateTime',
      '2026-08-03T09:12:00.000Z',
    );
  });

  it('renders nothing when there is no date', () => {
    // Git has no date for a file it has never seen — an uncommitted entry, or a build
    // from a shallow clone. Better silent than stamped with a lie.
    const { container } = render(<LastUpdated at={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing rather than "Invalid Date"', () => {
    const { container } = render(<LastUpdated at="not a date" />);
    expect(container).toBeEmptyDOMElement();
  });
});
