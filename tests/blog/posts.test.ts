import { describe, expect, it } from 'vitest';
import { formatPostDate, sortPostsByDate } from '@/blog/posts';

describe('sortPostsByDate', () => {
  it('puts the newest post first', () => {
    const posts = [
      { date: '2026-08-01', title: 'Older' },
      { date: '2026-08-07', title: 'Newer' },
    ];

    expect(sortPostsByDate(posts).map((p) => p.title)).toEqual(['Newer', 'Older']);
  });

  it('breaks ties on the same date by title, so the order is deterministic', () => {
    const posts = [
      { date: '2026-08-07', title: 'Beta' },
      { date: '2026-08-07', title: 'Alpha' },
    ];

    expect(sortPostsByDate(posts).map((p) => p.title)).toEqual(['Alpha', 'Beta']);
  });

  it('does not mutate the array it was given', () => {
    const posts = [
      { date: '2026-08-01', title: 'Older' },
      { date: '2026-08-07', title: 'Newer' },
    ];

    sortPostsByDate(posts);

    expect(posts.map((p) => p.title)).toEqual(['Older', 'Newer']);
  });
});

describe('formatPostDate', () => {
  it('spells the month out, so the day is unambiguous either side of the Atlantic', () => {
    expect(formatPostDate('2026-08-07')).toBe('7 August 2026');
  });

  it('reads the date as UTC rather than the runner timezone', () => {
    expect(formatPostDate('2026-01-01')).toBe('1 January 2026');
  });
});
