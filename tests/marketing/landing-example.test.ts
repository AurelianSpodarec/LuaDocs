// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { LANDING_EXAMPLE } from '@/marketing/landingExample';
import { expectedOf, normalise, outputOf } from '../support/expectedOutput';

/**
 * The landing page's example is executable, so it is checked the way an executable
 * example is — run against the real Lua runtime, output compared with the
 * `-- Expected output:` comment it carries.
 *
 * Node environment, not jsdom: this loads the real Lua runtime rather than a stub.
 */
describe('the landing example', () => {
  it('prints exactly what its comment claims', async () => {
    expect(normalise(await outputOf(LANDING_EXAMPLE))).toBe(
      normalise(expectedOf(LANDING_EXAMPLE)),
    );
  }, 120_000);

  it('carries an expected-output comment at all', () => {
    expect(expectedOf(LANDING_EXAMPLE)).not.toBe('');
  });
});
