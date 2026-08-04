import type { HighlighterCore } from 'shiki/core';

/** One token of highlighted Lua: its text, and the colours to paint it in each theme. */
export interface LuaToken {
  content: string;
  /** `--shiki-light` / `--shiki-dark` custom properties; `app.css` picks one per theme. */
  style: Record<string, string>;
}

/**
 * Shiki, but only the parts this site needs: the Lua grammar, the two themes fumadocs
 * highlights MDX code blocks with, and the JavaScript regex engine rather than the
 * Oniguruma WASM one. The full `shiki` bundle carries every grammar it ships, which is
 * not a thing to download in order to colour four lines of Lua.
 *
 * Loaded once per session, on demand — an entry with no runnable example never pays
 * for it. The import lives behind a promise rather than a module-level `await` so that
 * the module itself stays synchronous and safe to import during SSR.
 */
let instance: Promise<HighlighterCore> | undefined;

function highlighter(): Promise<HighlighterCore> {
  instance ??= (async () => {
    const [{ createHighlighterCore }, { createJavaScriptRegexEngine }] = await Promise.all([
      import('shiki/core'),
      import('shiki/engine/javascript'),
    ]);

    return createHighlighterCore({
      langs: [import('@shikijs/langs/lua')],
      themes: [import('@shikijs/themes/github-light'), import('@shikijs/themes/github-dark')],
      engine: createJavaScriptRegexEngine(),
    });
  })();

  return instance;
}

/**
 * Tokens rather than HTML: the editor renders them as React elements, so nothing here
 * is ever handed to `dangerouslySetInnerHTML`, and the markup around each line stays
 * ours to line up with the textarea it sits under.
 *
 * `defaultColor: false` is what makes a token carry both themes' colours at once, as
 * custom properties, instead of baking one in.
 */
export async function highlightLua(code: string): Promise<LuaToken[][]> {
  const shiki = await highlighter();

  const { tokens } = shiki.codeToTokens(code, {
    lang: 'lua',
    themes: { light: 'github-light', dark: 'github-dark' },
    defaultColor: false,
  });

  return tokens.map((line) =>
    line.map((token) => ({ content: token.content, style: token.htmlStyle ?? {} })),
  );
}
