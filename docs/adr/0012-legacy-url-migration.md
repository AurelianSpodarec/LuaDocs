# Legacy URL migration from the old luadocs.com

The new site **takes over `www.luadocs.com` in place**, and every URL the old site
serves is answered by a permanent redirect to the entry that replaces it. No page
is written for the sake of a redirect, and no redirect is ever retired.

Five rules:

1. **Same domain, same host label.** The new site replaces the old one at
   `www.luadocs.com`. The apex keeps redirecting to `www`, exactly as today.
2. **The version is not in the URL.** One entry, one URL, for all five Lua lines.
   An old 5.4-era URL lands on the entry, and the reader sees the default version.
3. **Every redirect points at a real entry, not at a parent.** Where the old URL
   named something that does not exist, it points at the thing that does.
4. **The map is finite, hand-written and checked in.** Sixty-five paths, listed
   below. There are no pattern rules and no rewrite regexes.
5. **Redirects are permanent.** They are never removed, never expired.

## Why

### The domain is the asset, and it is the only asset

`luadocs.com` has been indexed since 2022, is topically exact, and is already the
canonical answer for several `lua <function>` queries. Nothing else about the old
site is worth carrying: its content is a different site's content, and
[ADR 0010](0010-entries-are-written-from-the-manual.md) means every new entry was
written from the manual rather than ported. So this migration moves **URLs and
ranking, not text**.

That is what makes it cheap. A same-domain takeover needs no change-of-address in
Search Console, resets no domain authority, and turns the whole problem into a
path-to-path map on one host.

### The old site is far smaller than it looks

Its sidebar advertises 127 URLs. **Fifty-seven of them are 404s** — every leaf
under `coroutine`, `io`, `file`, `os`, `package`, `debug` and `utf8`, plus
`table/ipairs` and `math/randomseed`. The live corpus is **70 URLs**: the homepage,
four prose pages, nine section overviews, and the leaves of `string` (17), `table`
(13) and `math` (26).

Seventy is small enough to write out by hand and verify one at a time, which is why
rule 4 forbids pattern rules. A regex from `/docs/functions/(\w+)/(\w+)` to
`/docs/standard-library/$1/$2` would be correct for fifty-five paths and silently
wrong for six — see below.

### `table.setmetatable` does not exist, and the old URL said it did

Six live old URLs sit under `/docs/functions/table/` for symbols that are globals:
`setmetatable`, `getmetatable`, `rawset`, `rawget`, `pairs`, `next`.
[ADR 0006](0006-sidebar-order-and-grouping.md) already settled that these live in
`globals` and are cross-linked from `table` as related, "because `table.setmetatable`
does not exist".

They redirect to `/docs/standard-library/globals/<name>`. A redirect that crosses
sections looks like a mistake in a map that is otherwise mechanical; it is the
opposite. The old URL encoded a false claim about the library, and the redirect is
where that claim gets corrected. The alternative — pointing them at
`/docs/standard-library/table` because that is where the old URL "was" — would land
a reader looking for `setmetatable` on a page that explicitly tells them it is not
there.

### No version segment, and what that costs

The old site documented 5.4 only, and its titles said so: `string.format() - Lua |
Version 5.4 Docs`. The obvious way to preserve that is
`/docs/5.4/standard-library/string/format`, which would give five rankable pages per
entry instead of one.

It is refused. [ADR 0001](0001-single-canonical-docs-with-version-deltas.md) is that
an entry is one canonical document with version deltas layered on it, and a URL per
version is that ADR's rejected alternative wearing a different hat — five URLs whose
content is identical for most entries, needing canonical tags to tell a crawler which
one counts, and a fifth of the site changing shape every time a Lua line is added.

**The cost is real and is accepted**: the site cannot field a distinct page for
"lua 5.1 string.format", and a prerendered page shows a crawler one version's
content. What it has instead is on-page — the version support row and change notes
are in the DOM of every entry, so a version-qualified query can still land on the one
page that answers it, and the page visibly answers it.

Every old URL was checked against the compat data: **all sixty-one function entries
still exist in 5.5**, so no reader arriving from a 5.4-era result lands on an entry
marked unavailable. The exposure this decision creates is zero on the URLs being
migrated today.

### The four prose pages go to `/docs`

`/docs/introduction`, `/docs/faq`, `/docs/governance` and `/docs/contribution-guide`
are indexed and have no successor: there is no FAQ, no governance page, and the
contribution surface is slice 7. All four point at `/docs`.

Writing replacements first was considered and dropped — a page that exists to catch a
redirect is a page nobody maintains. Sending `governance` and `contribution-guide`
off to GitHub was the other option, and loses the traffic outright for two paths that
slice 7 may want back. `/docs` keeps them, and retargeting `contribution-guide` when
a contribution page exists is a one-line change.

### Vercel now, portable later

The old site is on Vercel and so is the new one, so the map ships as `vercel.json`
`redirects` with `"permanent": true`. Nothing about this ADR depends on that: the map
is data, and the same seventy pairs generate a Cloudflare `_redirects` file or a
Netlify `_redirects` file unchanged.

The one hosting constraint this does place on [ADR 0004](0004-self-hosted-on-github-no-third-parties.md)'s
platform-open stance: **the host must issue real 301s.** Bare GitHub Pages cannot —
it offers only a meta-refresh, which Google treats as a weaker signal — so it is out
for as long as these redirects matter, which is forever.

## Consequences

### The cutover gate

Cutover is blocked on one thing: **four section overviews are still 8-line stubs** —
`io`, `os`, `package` and `debug`. Their old counterparts are live and indexed, so
until they are authored, four 301s land on an empty page. `coroutine` and `utf8`
overviews are already written; the overview fork is proven on three sections.

The other sixty-one targets are authored today. This is the whole gate.

### The map is enforced against build output, not trusted

The seventy pairs are a test fixture. CI asserts that every target resolves to a file
that exists in `.output/public` — the same job, and the same reason, as the link check
the roadmap already owes: the dev server answers every path with a 200 SPA shell, so a
check against it can never fail. A later rename that breaks a 301 fails the build.

### Indexing hygiene the old site never had

The old site has **no `robots.txt`, no `sitemap.xml` and no canonical tags**. The new
site ships all three:

- **The sitemap lists authored entries only.** The 291 unwritten stubs are excluded by
  the same predicate that filters the sidebar and the search index — one rule, three
  consumers. Stubs carry `noindex` until they have a body.
- A `robots.txt` pointing at the sitemap.
- A self-referencing canonical on every entry.

This is the same constraint the roadmap already records against slice 8 ("deploy must
not ship them"), reached from the other direction.

### What is deliberately not done

- **No content is ported.** ADR 0010 stands; the old prose is not a source.
- **No redirect is written for a path that already 404s.** The fifty-seven dead sidebar
  targets and the Tailwind template leftovers (`/quickstart`, `/sdks`, `/webhooks`,
  `/contacts`, …) 404 on the old site today and will 404 on the new one. A redirect for
  a URL that has never returned 200 preserves nothing.
- **No `/docs/functions/` prefix is kept.** Retaining it would have made fifty-five of
  these redirects unnecessary, and would have left every operator, type, C API page and
  guide sitting under a segment that calls it a function.

## The map

Sixty-five paths, plus the homepage, which does not move.

### Prose pages

| Old | New |
| --- | --- |
| `/docs/introduction` | `/docs` |
| `/docs/faq` | `/docs` |
| `/docs/governance` | `/docs` |
| `/docs/contribution-guide` | `/docs` |

### Section overviews

| Old | New |
| --- | --- |
| `/docs/functions/string` | `/docs/standard-library/string` |
| `/docs/functions/table` | `/docs/standard-library/table` |
| `/docs/functions/math` | `/docs/standard-library/math` |
| `/docs/functions/coroutine` | `/docs/standard-library/coroutine` |
| `/docs/functions/io` | `/docs/standard-library/io` |
| `/docs/functions/os` | `/docs/standard-library/os` |
| `/docs/functions/package` | `/docs/standard-library/package` |
| `/docs/functions/debug` | `/docs/standard-library/debug` |
| `/docs/functions/utf8` | `/docs/standard-library/utf8` |

### Globals mis-scoped under `table`

| Old | New |
| --- | --- |
| `/docs/functions/table/setmetatable` | `/docs/standard-library/globals/setmetatable` |
| `/docs/functions/table/getmetatable` | `/docs/standard-library/globals/getmetatable` |
| `/docs/functions/table/rawset` | `/docs/standard-library/globals/rawset` |
| `/docs/functions/table/rawget` | `/docs/standard-library/globals/rawget` |
| `/docs/functions/table/pairs` | `/docs/standard-library/globals/pairs` |
| `/docs/functions/table/next` | `/docs/standard-library/globals/next` |

### `string`

| Old | New |
| --- | --- |
| `/docs/functions/string/byte` | `/docs/standard-library/string/byte` |
| `/docs/functions/string/char` | `/docs/standard-library/string/char` |
| `/docs/functions/string/dump` | `/docs/standard-library/string/dump` |
| `/docs/functions/string/find` | `/docs/standard-library/string/find` |
| `/docs/functions/string/format` | `/docs/standard-library/string/format` |
| `/docs/functions/string/gmatch` | `/docs/standard-library/string/gmatch` |
| `/docs/functions/string/gsub` | `/docs/standard-library/string/gsub` |
| `/docs/functions/string/len` | `/docs/standard-library/string/len` |
| `/docs/functions/string/lower` | `/docs/standard-library/string/lower` |
| `/docs/functions/string/match` | `/docs/standard-library/string/match` |
| `/docs/functions/string/pack` | `/docs/standard-library/string/pack` |
| `/docs/functions/string/packsize` | `/docs/standard-library/string/packsize` |
| `/docs/functions/string/rep` | `/docs/standard-library/string/rep` |
| `/docs/functions/string/reverse` | `/docs/standard-library/string/reverse` |
| `/docs/functions/string/sub` | `/docs/standard-library/string/sub` |
| `/docs/functions/string/unpack` | `/docs/standard-library/string/unpack` |
| `/docs/functions/string/upper` | `/docs/standard-library/string/upper` |

### `table`

| Old | New |
| --- | --- |
| `/docs/functions/table/concat` | `/docs/standard-library/table/concat` |
| `/docs/functions/table/insert` | `/docs/standard-library/table/insert` |
| `/docs/functions/table/move` | `/docs/standard-library/table/move` |
| `/docs/functions/table/pack` | `/docs/standard-library/table/pack` |
| `/docs/functions/table/remove` | `/docs/standard-library/table/remove` |
| `/docs/functions/table/sort` | `/docs/standard-library/table/sort` |
| `/docs/functions/table/unpack` | `/docs/standard-library/table/unpack` |

### `math`

| Old | New |
| --- | --- |
| `/docs/functions/math/abs` | `/docs/standard-library/math/abs` |
| `/docs/functions/math/acos` | `/docs/standard-library/math/acos` |
| `/docs/functions/math/asin` | `/docs/standard-library/math/asin` |
| `/docs/functions/math/atan` | `/docs/standard-library/math/atan` |
| `/docs/functions/math/ceil` | `/docs/standard-library/math/ceil` |
| `/docs/functions/math/cos` | `/docs/standard-library/math/cos` |
| `/docs/functions/math/deg` | `/docs/standard-library/math/deg` |
| `/docs/functions/math/exp` | `/docs/standard-library/math/exp` |
| `/docs/functions/math/floor` | `/docs/standard-library/math/floor` |
| `/docs/functions/math/fmod` | `/docs/standard-library/math/fmod` |
| `/docs/functions/math/huge` | `/docs/standard-library/math/huge` |
| `/docs/functions/math/log` | `/docs/standard-library/math/log` |
| `/docs/functions/math/max` | `/docs/standard-library/math/max` |
| `/docs/functions/math/maxinteger` | `/docs/standard-library/math/maxinteger` |
| `/docs/functions/math/min` | `/docs/standard-library/math/min` |
| `/docs/functions/math/mininteger` | `/docs/standard-library/math/mininteger` |
| `/docs/functions/math/modf` | `/docs/standard-library/math/modf` |
| `/docs/functions/math/pi` | `/docs/standard-library/math/pi` |
| `/docs/functions/math/rad` | `/docs/standard-library/math/rad` |
| `/docs/functions/math/random` | `/docs/standard-library/math/random` |
| `/docs/functions/math/sin` | `/docs/standard-library/math/sin` |
| `/docs/functions/math/sqrt` | `/docs/standard-library/math/sqrt` |
| `/docs/functions/math/tan` | `/docs/standard-library/math/tan` |
| `/docs/functions/math/tointeger` | `/docs/standard-library/math/tointeger` |
| `/docs/functions/math/type` | `/docs/standard-library/math/type` |
| `/docs/functions/math/ult` | `/docs/standard-library/math/ult` |

## Cutover sequence

1. Author the four stub overviews — `io`, `os`, `package`, `debug`.
2. Add the map, the sitemap, `robots.txt` and canonicals; add the CI assertion.
3. Deploy to a preview URL and verify all sixty-five redirects against build output.
4. Point `www.luadocs.com` at the new deployment; keep apex → `www`.
5. Keep the existing Search Console property — same domain, no change of address —
   and submit the new sitemap.
6. Watch Search Console coverage for four weeks. A 301 that Google reports as a soft
   404 means the target is thin, not that the redirect is wrong.
