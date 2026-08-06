import { Children, Fragment, isValidElement, type ReactElement, type ReactNode } from 'react';
import type { LuaVersion } from '@/compat/schema';
import { useSelectedVersionOrNull } from '@/version/SelectedVersionProvider';
import { appliesTo, assertScope, type VersionScope } from '@/version/versionScope';

/**
 * The licensed way to scope an authored block to a run of versions — the second of them,
 * after `<Since>` on an `<Errors>` bullet, and the one that reaches the rest of an entry.
 *
 * **It shows and hides; it never says.** That is the difference from `<Since>`, and it is
 * deliberate. The dataset is the source of truth for *what* changed and *when*, and a
 * `changed_in` note already reaches the reader on three surfaces — the support strip, the
 * inline note, and the matrix. A chip here would make the same fact arrive a fourth time,
 * in a second voice, next to the block it corrects. So instead the block simply is not
 * there on the versions it is false for, and the reader on any version reads an entry
 * that is true for them. `<Since>` chips because an `<Errors>` list is a list of things
 * that can go wrong and a reader benefits from seeing the ones that cannot yet; a Syntax
 * line, a parameter and a return value are not a list to scan but a statement of what the
 * call *is*, and a statement that is false for the selected version has nothing to offer
 * by being shown.
 *
 * ```mdx
 * <Only before="5.4">
 *
 * ```lua
 * math.randomseed(x)
 * ```
 *
 * </Only>
 * ```
 *
 * It scopes structured entry sections — the Syntax block, `<Param>`s, `<Return>`s, an
 * `<Errors>` bullet that has no version chip to carry. It is not a general
 * version-expression language and there is deliberately no `or`, no list and no `not`:
 * `since` and `before` bound one run, and two blocks cover a change.
 */
export function Only(props: VersionScope & { children: ReactNode }) {
  const version = useSelectedVersionOrNull();
  // After the hook, never before it — a throw must not change the hook order.
  const scope = assertScope(props as unknown as Record<string, unknown>);
  return appliesTo(scope, version) ? <>{props.children}</> : null;
}

/**
 * The children that survive version scoping, flattened.
 *
 * `<Parameters>` and `<Returns>` need this because they place things *around* their
 * children — a heading, and the numeric-type disclosure — and a wrapper that renders
 * `null` is invisible to the parent that has to decide whether to place them. Read off
 * the props rather than off the rendered output, which is the only place the answer
 * exists before React commits.
 *
 * `Fragment` is here for the same reason it was in `namesAnInteger`: MDX hands a list
 * over flat, but a fragment is a shape an author can write and a test does write, and
 * `Children.toArray` counts one as a single child rather than flattening it.
 */
export function inScope(children: ReactNode, version: LuaVersion | null): ReactElement[] {
  return Children.toArray(children).flatMap((child): ReactElement[] => {
    if (!isValidElement(child)) return [];

    const props = child.props as VersionScope & { children?: ReactNode };
    if (child.type === Fragment) return inScope(props.children, version);
    if (child.type === Only) {
      return appliesTo(assertScope(props as unknown as Record<string, unknown>), version)
        ? inScope(props.children, version)
        : [];
    }

    return [child];
  });
}
