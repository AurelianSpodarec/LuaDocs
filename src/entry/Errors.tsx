import type { ReactNode } from 'react';
import type { LuaVersion } from '@/compat/schema';
import { VersionChip } from '@/version/VersionChip';
import { subheadingClass } from './Parameters';

/**
 * "Errors", never "Exceptions" — Lua raises, it does not throw. Shown only where an
 * entry has any; `page-structure.md` makes the section conditional.
 */
export function Errors({ children }: { children: ReactNode }) {
  return (
    <>
      <h3 className={subheadingClass}>Errors</h3>
      {/* Both list kinds. Preflight strips `list-style` and padding from `ul` and `ol`
          alike, so an ordered list authored in here would render unmarked and flush
          left — wrong, and silently so, with no error anywhere to say why. */}
      <div className="text-sm [&_li]:mb-1 [&_ol]:list-decimal [&_ol]:ps-5 [&_ul]:list-disc [&_ul]:ps-5">
        {children}
      </div>
    </>
  );
}

/**
 * An error that only exists from a given version onward. It is a pill rather than a
 * parenthesis because a reader scanning this list on 5.1 needs to skip these without
 * reading them.
 */
export function Since({ v }: { v: LuaVersion }) {
  return (
    <span className="me-1.5 inline-block align-middle">
      <VersionChip version={v} state="since" label={`${v}+`} />
    </span>
  );
}
