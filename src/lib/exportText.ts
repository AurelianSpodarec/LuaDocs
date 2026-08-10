import { DEFAULT_VERSION, type LuaVersion } from '@/compat/schema';
import { appliesTo, type VersionScope } from '@/version/versionScope';

/**
 * Turn an entry's processed MDX into text that is true at one stated version.
 *
 * The text surfaces — `llms.txt`, `llms-full.txt` and the `.md` route — serve
 * `getText('processed')`, which is the MDX body with its JSX intact. Two things in it are
 * not fit to hand a reader or a model:
 *
 * 1. **`<Only>` survives, both halves of it.** `<Only before="5.5">` and
 *    `<Only since="5.5">` arrive adjacent and unlabelled, so `error()`'s export states
 *    that `nil` reaches a catcher as `nil` and then states that it does not, with nothing
 *    saying which version either sentence belongs to. That is not missing version data,
 *    it is false version data, on a site whose whole premise is being right about
 *    versions.
 * 2. **Examples arrive as an entity-escaped JSX attribute.** `<RunnableExample code="…">`
 *    carries a Lua program as `&#x22;`-encoded text inside a template literal, which
 *    ADR 0008 rule 6 keeps readable specifically because "the prerendered page, the `.md`
 *    route, and `llms.txt` are all read".
 *
 * The fix for the first is to resolve rather than to strip: one version's coherent text
 * beats five versions' worth of contradictions, and the surface says which version it is.
 * The fix for the second is to give the program back its fence.
 */

/** `<Only since="5.4" before="5.5">` — the attributes, as authored. */
function scopeFromAttributes(attrs: string): VersionScope {
  const read = (name: 'since' | 'before'): LuaVersion | undefined => {
    const match = new RegExp(`${name}\\s*=\\s*"([^"]*)"`).exec(attrs);
    return (match?.[1] as LuaVersion) ?? undefined;
  };

  return { since: read('since'), before: read('before') };
}

/** Strip the common leading indentation a JSX child block carries. */
function dedent(text: string): string {
  const lines = text.split('\n');
  const widths = lines
    .filter((line) => line.trim().length > 0)
    .map((line) => line.length - line.trimStart().length);
  const common = widths.length > 0 ? Math.min(...widths) : 0;
  return lines.map((line) => line.slice(common)).join('\n');
}

/**
 * Keep the `<Only>` blocks that apply at `version`, drop the rest, and unwrap both.
 *
 * Scans rather than regex-replaces because `<Only>` nests inside `<Parameters>` and
 * `<Returns>`, and a non-greedy match would close the outer block on the inner block's
 * `</Only>`.
 */
export function resolveOnly(text: string, version: LuaVersion = DEFAULT_VERSION): string {
  const OPEN = /<Only(\s[^>]*?)?>/;
  let out = text;

  for (;;) {
    const open = OPEN.exec(out);
    if (!open) return out;

    const bodyStart = open.index + open[0].length;

    // Find this block's own `</Only>`, stepping over any nested ones.
    let depth = 1;
    let cursor = bodyStart;
    while (depth > 0) {
      const nextOpen = out.indexOf('<Only', cursor);
      const nextClose = out.indexOf('</Only>', cursor);
      if (nextClose === -1) return out; // Unbalanced markup — leave it visible.
      if (nextOpen !== -1 && nextOpen < nextClose) {
        depth += 1;
        cursor = nextOpen + '<Only'.length;
      } else {
        depth -= 1;
        cursor = nextClose + '</Only>'.length;
      }
    }

    const body = out.slice(bodyStart, cursor - '</Only>'.length);
    const keep = appliesTo(scopeFromAttributes(open[1] ?? ''), version);
    out = out.slice(0, open.index) + (keep ? dedent(body).trim() : '') + out.slice(cursor);
  }
}

const ENTITIES: Array<[RegExp, string]> = [
  [/&#x22;/g, '"'],
  [/&quot;/g, '"'],
  [/&#x27;/g, "'"],
  [/&#39;/g, "'"],
  [/&#x60;/g, '`'],
  [/&lt;/g, '<'],
  [/&gt;/g, '>'],
  // Last, so a literal `&amp;#x22;` in an example does not decode twice.
  [/&amp;/g, '&'],
];

function decodeExampleSource(raw: string): string {
  let code = raw.trim();
  // The prop is authored as a template literal, so the value arrives wrapped in backticks.
  if (code.startsWith('`') && code.endsWith('`')) code = code.slice(1, -1);
  for (const [pattern, replacement] of ENTITIES) code = code.replace(pattern, replacement);
  return code.replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/\\`/g, '`');
}

/** Give every runnable example back the fence ADR 0008 rule 6 assumes it has. */
export function unwrapRunnableExamples(text: string): string {
  return text.replace(
    /<RunnableExample\b[^>]*?\bcode=\{?"([^"]*)"\}?[^>]*?\/>/g,
    (_match, code: string) => `\`\`\`lua\n${decodeExampleSource(code)}\n\`\`\``,
  );
}

/**
 * The whole transformation, plus the line that makes the result honest.
 *
 * Naming the version is not decoration: the text below it is one version's reading of an
 * entry that documents five, and a reader who is not told which one is back where they
 * started.
 */
export function resolveExportText(
  processed: string,
  version: LuaVersion = DEFAULT_VERSION,
): string {
  const resolved = unwrapRunnableExamples(resolveOnly(processed, version));
  // A dropped block leaves the blank lines that surrounded it behind. Collapse them, so
  // the export does not advertise where something used to be.
  return resolved.replace(/[ \t]+$/gm, '').replace(/\n{3,}/g, '\n\n').trim();
}

export function exportHeader(title: string, url: string, version: LuaVersion): string {
  return `# ${title} (${url})\n\n> Describes Lua ${version}. Where this entry differs by version, the text below is the ${version} reading.`;
}
