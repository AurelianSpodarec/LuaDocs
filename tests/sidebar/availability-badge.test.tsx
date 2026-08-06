import { describe, it, expect } from 'vitest';
import { availabilityBadge } from '@/sidebar/Sidebar';
import { compatNodes } from '@/compat/registry';
import type { CompatNode } from '@/compat/schema';

/**
 * The badge on a dimmed sidebar row. It was `${version_added}+` for every unavailable
 * entry, which states availability from that version onward — the one claim a removed
 * entry denies.
 */
describe('the availability badge', () => {
  it('keeps the not-yet-added row exactly as it read', () => {
    // `table.pack` at 5.1. This is the case that was already right.
    expect(availabilityBadge(compatNodes['table.pack'])).toBe('5.2+');
  });

  it('never claims a removed entry is available from its first version onward', () => {
    // `table.getn` at 5.5 read "5.1+", beside a row dimmed for not being there.
    expect(availabilityBadge(compatNodes['table.getn'])).not.toContain('+');
  });

  it('names the versions a removed entry is actually in', () => {
    expect(availabilityBadge(compatNodes['table.getn'])).toBe('5.1');

    const spans: CompatNode = {
      support: { lua: { version_added: '5.1', version_removed: '5.4' } },
    };
    expect(availabilityBadge(spans)).toBe('5.1–5.3');
  });

  it('has nothing to say about a symbol no documented version has', () => {
    expect(availabilityBadge({ support: { lua: { version_added: false } } })).toBeNull();
  });
});
