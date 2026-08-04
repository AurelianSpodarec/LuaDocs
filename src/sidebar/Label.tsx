import { isValidElement, type ReactNode } from 'react';

/**
 * Is this a name a reader would type into an editor?
 *
 * Three tests, in order. Anything containing whitespace is prose — `Values and
 * types`, `Related globals`, `do … end blocks`, `local declarations`. Anything
 * starting lowercase or with an underscore is a Lua identifier — `math`, `nil`,
 * `goto`, `math.abs()`, `file:read()`, `_G`, `__index`. What is left starts with a
 * capital, so it is code only if it carries a marker no prose label would: a dot,
 * colon, underscore or call parens. That last clause is what keeps `LUA_PATH` in the
 * mono face while leaving `Functions`, `Constants`, `Globals` and `Language` in the
 * UI face.
 */
function looksLikeCode(text: string): boolean {
  if (text.length === 0 || /\s/.test(text)) return false;
  if (/^[a-z_]/.test(text)) return true;

  return /[.:_()]/.test(text);
}

/**
 * A page tree node's `name` is rarely a string. The loader renders titles through the
 * MDX pipeline, so it arrives as a `<span class="fd-page-tree-item-name">` carrying
 * its text in `dangerouslySetInnerHTML` — titles may contain inline markup. Anything
 * that really does contain markup is not a bare identifier, so it is left alone.
 */
export function textOf(name: ReactNode): string | null {
  if (typeof name === 'string') return name;
  if (!isValidElement(name)) return null;

  const props = name.props as {
    children?: ReactNode;
    dangerouslySetInnerHTML?: { __html?: string };
  };

  if (typeof props.children === 'string') return props.children;

  const html = props.dangerouslySetInnerHTML?.__html;
  return typeof html === 'string' && !html.includes('<') ? html : null;
}

export function isCodeName(name: ReactNode): boolean {
  const text = textOf(name);
  return text !== null && looksLikeCode(text);
}

/**
 * MDN separates sidebar levels by *typeface*, not by size or indentation — every row
 * on its `Math` page is 16px, indented 8px per level. Structural labels are set in
 * the UI sans; anything that is an identifier is wrapped in `<code>` and set in the
 * mono face. That single contrast is what makes the hierarchy readable at a glance,
 * and it is what our sidebar was missing.
 */
export function SidebarLabel({ name }: { name: ReactNode }) {
  const text = textOf(name);
  if (text === null || !looksLikeCode(text)) return <>{name}</>;

  return <code className="font-mono">{text}</code>;
}
