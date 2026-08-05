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
      <div className="text-sm [&_li]:mb-1 [&_ul]:list-disc [&_ul]:ps-5">{children}</div>
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
