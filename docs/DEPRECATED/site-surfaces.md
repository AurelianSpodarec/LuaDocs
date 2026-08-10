# Site surfaces beyond the docs

*Descriptive research, not a decision. What a landing page, showcase, video
collection, library or mod directory, blog, install guide, history page and
sponsors page would actually cost, what primary evidence exists that each works,
and where each one rubs against the ADRs. Vocabulary is in
[`CONTEXT.md`](../../CONTEXT.md); the scope boundary is
[ADR 0002](../adr/0002-scope-standard-lua-only.md) and the no-backend rule is
[ADR 0004](../adr/0004-self-hosted-on-github-no-third-parties.md). Companion to
[`luadocs-features.md`](luadocs-features.md), which covers the docs surface
itself, and to [`surface-expansion.md`](surface-expansion.md), which records the
decisions; this file is only the evidence.*

## Access note, read this first

**`lua.org` was down for the whole of this research pass.** `www.lua.org` resolves
to `46.175.8.47` and refuses connections on both 80 and 443; `curl` and `WebFetch`
both returned `ECONNREFUSED` or a timeout, while `luarocks.org` returned 200 from
the same machine at the same moment. So this is lua.org itself, not a local
network problem.

Everything below that cites lua.org therefore cites a **Wayback Machine snapshot**,
fetched in raw mode
(`curl -sSL "https://web.archive.org/web/2026id_/https://www.lua.org/<page>"`,
which reports the real snapshot timestamp in its effective URL). Snapshot dates
are given inline. Live-fetch claims and archived-snapshot claims are labelled
differently on purpose.

**This outage is itself a finding.** LuaDocs' entire content model is a rewrite of
lua.org's manual with a per-entry source link back to lua.org
([ADR 0010](../adr/0010-entries-are-written-from-the-manual.md),
[`luadocs-idea.md`](luadocs-idea.md)). Every one of those source links is currently
dead, and so is every "official downloads" link an install page or homepage would
carry. lua.org is a single point of failure with no mirror, no CDN, and no status
page. The archived material is *mostly* complete — `license.html`, `pil/`,
`history.html`, `about.html`, `versions.html`, `download.html`, `start.html`,
`authors.html` and `papers.html` all returned 200 from the August 2026 crawl — but
not entirely: **`https://www.lua.org/wshop.html` is a 404 in the archive**, so the
workshop index could not be read at all, and archive.org rate-limits aggressively
enough that a bulk pass needs backoff.

Two other sources refused automated access: the ACM Digital Library returned
**HTTP 403** for `https://dl.acm.org/doi/10.1145/1238844.1238846`, and
`love2d.org` sits behind a Cloudflare challenge that returns **403** for the wiki,
the forums and the MediaWiki API alike.

Three of the surfaces below already exist as unwritten stubs in the content tree —
`content/docs/guides/history-of-lua.mdx`, `lua-in-the-wild.mdx` and
`luarocks-and-the-ecosystem.mdx` are each about 145 bytes of frontmatter with no
body, and `content/docs/learn/` holds only an index and a `meta.json`.

---

## 1. Marketing landing page

**What it is.** A "what Lua is / who uses it / why" selling page at `/`, in the
style of the four sites the author named.

**Primary evidence — what these pages actually contain.** All four were fetched
live.

[fumadocs.dev](https://fumadocs.dev/) is implemented as a single React component,
[`apps/docs/app/(home)/page.tsx`](https://github.com/fuma-nama/fumadocs/blob/dev/apps/docs/app/(home)/page.tsx),
with everything hardcoded in JSX. Section order: hero (eyebrow, H1 with one word
emphasised, two CTAs — "Getting Started" and an external StackBlitz link) →
positioning paragraph → a `pnpm create fumadocs-app` code block with an animated
fake terminal → testimonials in a marquee under the heading "A framework people
love" → an aesthetics/customisability section with preview screenshots → an
authoring section → a long "for engineers" section → a "not just engineers"
section → "Open Source Forever." with a live contributor-avatar counter. There is
**no comparison table on the homepage** (that lives at
[`/docs/comparisons`](https://fumadocs.dev/docs/comparisons)) and **no sponsors
logo wall** — the navbar's "Sponsors" link points off-site to
`https://fuma-nama.dev/sponsors`, and `fumadocs.dev/sponsors` is a **404**.

[astro.build](https://astro.build/) runs: hero ("The web framework for
content-driven websites", plus `npm create astro@latest`) → "What is Astro?" with
three pillars → a **Core Web Vitals bar chart** comparing Astro to WordPress,
Gatsby, Next.js and Nuxt → "Maximum Flexibility" with UI-framework logos and a
code sample → merchandise → a 13-item "Fully Featured" grid → a themes gallery →
partner agencies → final CTA → a sponsor logo wall → newsletter signup.

[bun.com](https://bun.com/) runs: hero with a corporate announcement banner and a
platform-specific install command → a "USED BY" logo row → a **benchmark**
("Bundling 10,000 React components", Bun 269.1 ms vs esbuild 571.9 ms) → "Four
tools, one toolkit" → several feature deep-dives, each with its own performance
number → "The APIs you need. Baked in." with interactive code samples →
"Developers love Bun", a carousel of tweets → footer.

[vite.dev](https://vite.dev/) runs: hero ("The Build Tool for the Web", "Get
Started" + "View on GitHub") → install commands across five package managers →
"Trusted by the world's best software teams" with logos → "Redefining developer
experience" with four features → "A shared foundation to build upon" → "Powering
your favorite frameworks and tools" → "Loved by the community" with star and
download counts and creator testimonials → "Free & open source" with a
sponsorship link → final CTA.

**The pattern.** Every one of them is: hero + install/CTA → social proof (logos,
stars, testimonials) → a small number of differentiator sections, each carrying a
*number* or a *code sample* → final CTA. Two of the four lead with a benchmark
chart. Three of the four have a logo wall of adopters, which is the same data a
showcase would need.

**Cost.** This is the cheapest surface on the list: one route, hardcoded content,
no data source, no ongoing curation. Fumadocs proves it — the whole homepage is
one file. The expensive parts are the *assets* (screenshots, illustrations,
animated terminal) and the *claims*: the social-proof sections need either real
adopter logos or real numbers, and LuaDocs has neither on day one. Note also that
LuaDocs would be selling **Lua**, not selling LuaDocs, which is a different pitch
from all four references — closer to a language homepage than a framework
homepage.

**ADR conflict.** None. Static, no third parties. It is already anticipated by
[ADR 0002](../adr/0002-scope-standard-lua-only.md), which puts "a homepage with a
'why Lua' pitch" in scope under "Front door & flavor".

---

## 2. Showcase — "who uses Lua"

**What it is.** A gallery of real projects built with or embedding Lua.

**Primary evidence — how four reference projects run theirs.**

**Astro** is the only fully GitHub-native, self-sustaining model. Submission is a
redirect: `https://astro.build/showcase/submit` returns **302** to
[withastro/roadmap discussion #521](https://github.com/withastro/roadmap/discussions/521),
whose opening post asks only "If you are using Astro at your company or
organization, please share the URL here!" — currently around 2,230 comments. A
weekly GitHub Action
([`.github/workflows/weekly.yaml`](https://github.com/withastro/astro.build/blob/main/.github/workflows/weekly.yaml),
`cron: "0 12 * * Mon"`) reads that discussion over the GraphQL API, runs
[`scripts/update-showcase.mjs`](https://github.com/withastro/astro.build/blob/main/scripts/update-showcase.mjs)
— Playwright Chromium at 1280×720 with `deviceScaleFactor 1.4`, then `sharp`
resize to 1600 px WebP — and opens a PR via `peter-evans/create-pull-request`.
Data is one small YAML per entry in `src/content/showcase/`, named after the
hostname:

```yaml
title: Mattel | About
image: ./about.mattel.com.webp
url: https://about.mattel.com/
dateAdded: 2026-06-29T10:24:48.802Z
```

The inclusion bar is enforced by machine, not prose: an `isAstro(url)` heuristic
looks for `<meta name="generator" content="Astro…">`, `data-astro-cid-*`
attributes, `astro-island` elements, or `/_astro/` asset paths, and anything that
fails is listed in the PR body for a human to check. The
[README](https://github.com/withastro/astro.build/blob/main/README.md) documents
the image spec (WebP, 1600×900, named after the domain).

The price is visible in the repo: **2,881 `.webp` files totalling ~151.7 MB**
against **2,879 `.yml` files totalling ~424 KB**. The text data is trivial; the
screenshots are 150 MB of permanent git history. Commit counts on
`src/content/showcase`: **129 in the last 12 months, 227 in the last 24**. This is
a genuinely live surface.

**Nuxt** hand-edits a single file,
[`content/showcase.yml`](https://github.com/nuxt/nuxt.com/blob/main/content/showcase.yml)
— 5,626 bytes, 40 entries. Screenshots are generated at content-parse time by
`modules/screenshot.ts` and committed (40 files, ~5.6 MB). There is **no
documented submission flow at all**: `CONTRIBUTING.md`, `AGENTS.md` and any issue
template are all 404 on `nuxt/nuxt.com@main`, and the README documents adding a
*template* but says nothing about the showcase. In practice entries arrive as
PRs. Commits on that file: **7 in 12 months, 19 in 24** — roughly one edit every
seven weeks, and nothing since 2025-12-21. Note that nuxt.com is not a static site:
it ships `server/db/schema.ts` with Drizzle migrations, `server/api/**`, GitHub
OAuth, and `isr: 3600` route rules, and `/showcase` is not in the prerender list.

**Vue has no "who uses Vue" showcase.** `https://vuejs.org/showcase`,
`/showcase.html` and `/ecosystem/showcase` all return **404**. The two
showcase-shaped surfaces are commercial:
[`/ecosystem/themes`](https://vuejs.org/ecosystem/themes), whose submission path
is literally `mailto:evan@vuejs.org?subject=Theme+affiliation` and whose entries
carry affiliate parameters (`?affiliate_id=116187` on the Creative Tim links); and
[`/partners/`](https://vuejs.org/partners/), whose intake is an **Airtable form**
and whose seven entries in
[`src/partners/partners.json`](https://github.com/vuejs/docs/blob/main/src/partners/partners.json)
carry a `platinum` tier flag. Themes images are **hotlinked** from third-party
CDNs; partner images (28 files, ~1.36 MB) are committed. Commit counts:
themes.json **5 in 12 months**, partners.json **3 in 12 months**.

**Tailwind's** showcase is a hardcoded TypeScript array at the bottom of
[`src/app/showcase/page.tsx`](https://github.com/tailwindlabs/tailwindcss.com/blob/main/src/app/showcase/page.tsx)
— 57 entries, each `{ name, url, thumbnail, video, description }`. There is **no
submission path**: no form, no discussion, no data file, and the repo's
[README](https://github.com/tailwindlabs/tailwindcss.com/blob/main/README.md)
states the project "is not licensed under an open-source license and is the
intellectual property of Tailwind Labs Inc.", with the source available "only as
an educational resource and to accept fixes for minor mistakes" (`LICENSE` is
404). The curation policy is not written down but is visible as three literal
comments partitioning the array — `// Partners`, `// Ambassadors`, `// Others` —
matching the tiers on the paid
[`/partners`](https://tailwindcss.com/partners) page, and the top entries carry
`utm_medium=sponsor`. Assets: **63 PNGs (~6.8 MB) plus 62 MP4s (~40.5 MB)**, about
830 KB per entry versus Astro's 53 KB, because of the hover-to-play video
treatment.

**lua.org already has one, and it should be checked before building a second.**
This was an unexpected find. `https://www.lua.org/showcase.html` (archived
**2026-08-05**) is a real showcase page: "Lua is used in many products and projects
around the world. Here are some highlights. **A different selection is shown every
day.**" Entries verified in the snapshot include Snort, Hammerspoon, Adobe
Photoshop Lightroom ("mostly written in Lua"), Wikipedia, Grim Fandango and Volvo
instrument panels — each a logo plus a short annotated blurb. Alongside it,
`https://www.lua.org/uses.html` (archived 2026-08-05) takes the opposite approach
and delegates: "The full list is too long for us to keep track. Here are some
lists that are updated regularly", then links out to a community-maintained
"Where Lua Is Used", the lua-users wiki, and five Wikipedia list pages
(Lua applications, Lua-scriptable software, Lua-scripted video games,
Lua-scriptable game engines, Lua-scriptable hardware). Both were last touched in
August 2026, so they are maintained. A LuaDocs showcase would therefore be the
*third* such surface, not the first — which changes the question from "should we
have one?" to "what does ours do that lua.org's daily-rotating highlights and
Wikipedia's lists do not?"

**Cost.** The data format is the cheap part and is trivially copyable: one small
YAML or JSON file per entry, filename keyed to hostname. Two costs dominate.
First, **images** — either 150 MB of committed screenshots and a Playwright job
(Astro), or a manual asset pipeline (Tailwind, ~47 MB for 57 entries). Second,
**ongoing curation**: Astro's 129 commits a year is what a live showcase looks
like; Nuxt's 7 is what a neglected one looks like, and it still reads as neglected.

**Data source.** For LuaDocs there is no scraping heuristic available. Astro can
detect "is this site built with Astro?" from the HTML; there is no way to detect
"does this application embed Lua?" from the outside. Entries would be entirely
hand-asserted, which removes the one mechanism that makes Astro's pipeline
self-policing.

**ADR conflict.** Mild but real. A showcase is static data plus images, so
[ADR 0004](../adr/0004-self-hosted-on-github-no-third-parties.md) is satisfied by
the Astro or Vue-partners shape (GitHub Discussions or PRs as intake; no CMS, no
database). Astro's automation needs GitHub Actions with a token and Playwright,
which ADR 0004 explicitly permits. The tension is with
[ADR 0002](../adr/0002-scope-standard-lua-only.md): a showcase of Roblox, WoW,
Garry's Mod and Neovim is precisely the "host-specific embeddings" material that
ADR 0002 puts out of scope and confines to a single **"Lua in the wild" Guide**
that links outward. A showcase is not a different decision from that Guide so much
as a *different presentation* of it — a gallery instead of prose. Worth deciding
explicitly whether the gallery replaces the Guide, supplements it, or is the
Guide.

---

## 3. Curated video and resource collection

**What it is.** Talks by Roberto Ierusalimschy and other primary Lua material,
collected and annotated.

**Primary evidence — the talks exist, but the corpus is fragmented and mostly
dormant.** Every video below was verified through YouTube's public oEmbed
endpoint (`https://www.youtube.com/oembed?url=…&format=json`), which returns the
canonical title and the uploading channel without authentication.

- [`bjqNK1jA77M`](https://www.youtube.com/watch?v=bjqNK1jA77M) — "Integers in Lua
  5.3, R. Ierusalimschy: Lua Workshop 2014 day 1 talk 1", uploaded by channel
  **"Lua Workshop 2014"** (`@luawshop14`).
- [`QystqRlz6bw`](https://www.youtube.com/watch?v=QystqRlz6bw) — "Lua Workshop
  2016: On the design of Lua - Roberto Ierusalimschy (PUC-Rio)", channel
  **`@luaworkshop`**.
- [`gXdS3IftP0Y`](https://www.youtube.com/watch?v=gXdS3IftP0Y) — "Lua Workshop
  2017: How much does it cost? - Roberto Ierusalimschy (PUC-Rio / Lua.org)",
  channel **`@luaworkshop`**.
- [`-ufBgy044HI`](https://www.youtube.com/watch?v=-ufBgy044HI),
  [`JG5UwhrqMY0`](https://www.youtube.com/watch?v=JG5UwhrqMY0),
  [`RsT85aRWun8`](https://www.youtube.com/watch?v=RsT85aRWun8) — "Workshop Lua
  2023 - …", uploaded by **"Departamento de Informática - PUC-Rio"**
  (`@DIPUCRio`), a third channel.

The fragmentation is the finding. There is no single official Lua video channel.
The channel RSS feeds confirm the dormancy: channel `UCW5AXY0vcX2KZY1pB79C3vQ`
("Lua Workshop") last published in **November 2015**
(`https://www.youtube.com/feeds/videos.xml?channel_id=UCW5AXY0vcX2KZY1pB79C3vQ`),
and `@luaworkshop` (`UCdZ8HO_8ybmeQu6K1kRL0_A`) has **50 videos, the most recent
from December 2017**. The 2023 workshop went up on the university department's
general channel instead. A curated collection is therefore doing genuinely useful
work — nobody else has assembled this — but it is assembling a mostly historical
corpus, not tracking a live stream of new material.

**Licensing and embedding.** The [YouTube Terms of
Service](https://www.youtube.com/t/terms) permit showing "YouTube videos through
the embeddable YouTube player" as part of personal, non-commercial use, and
prohibit accessing, reproducing, downloading or redistributing any part of the
Service except as the Service itself permits. They also prohibit selling
advertising or sponsorship on any page "that only contains Content from the
Service or where Content from the Service is the primary basis for such sales" —
which matters if a video page ever carried sponsor placement. The practical
reading: **linking and embedding the standard player is fine; downloading,
re-hosting, or transcript-scraping is not.** oEmbed returns a ready-made `<iframe>`
snippet, so embedding needs no API key and no quota.

The **HOPL III** paper "The Evolution of Lua" is the other primary artefact. The
ACM DL record at `https://dl.acm.org/doi/10.1145/1238844.1238846` returned **HTTP
403** to automated fetching, so its open-access status is unverified here; the
authors' own copy is conventionally hosted at `https://www.lua.org/doc/hopl.pdf`,
which is also unverified because lua.org was unreachable. Both need a manual
check.

**Cost.** Low to build (a list, some blurbs, an `<iframe>` per entry), and low
ongoing — the corpus barely grows. The real cost is editorial: a bare list of
YouTube links is exactly the sort of thin aggregation discussed in §10 below. The
value has to come from the annotation — what the talk argues, which Lua version it
concerns, which reference entries it illuminates.

**ADR conflict.** Embedding YouTube's player pulls a third-party script and a
third-party tracking surface onto the site. That is not what
[ADR 0004](../adr/0004-self-hosted-on-github-no-third-parties.md) was written to
prevent (it targets backends and paid services, not outbound links), but it is
worth a conscious choice between a real embed and a thumbnail-plus-link. The
material itself is squarely in scope: Roberto Ierusalimschy talking about
designing standard Lua is core, not periphery.

---

## 4. Library discovery — LuaRocks

**What it is.** A browsable directory of Lua libraries fed from LuaRocks.

**Primary evidence — there is a public manifest, and there is no public read
API.** This is the load-bearing finding for this surface.

The manifest is real and unauthenticated:

```
$ curl -sSL -o /dev/null -w "%{http_code} %{content_type} %{size_download}" https://luarocks.org/manifest
200 text/x-lua 4441113
```

It is **4.44 MB of serialized Lua**, not JSON, so consuming it needs a Lua parser
(the site's own [`ext/luarocks/persist.lua`](https://github.com/luarocks/luarocks-site/blob/master/ext/luarocks/persist.lua)
is the reference implementation). A gzipped form exists at
`https://luarocks.org/manifest.zip` (**138 KB**), and per-Lua-version manifests at
`https://luarocks.org/manifest-5.4` (**4.06 MB**). The content is thin:

```lua
commands = {}
modules = {}
repository = {
   ["15puzzle.nvim"] = {
      ["1.4.0-1"] = { { arch = "rockspec" }, { arch = "src" } },
      ...
```

Module name, version strings, and `arch` — that is all. **No description, no
license, no homepage, no download counts, no dates.** `modules` and `commands` are
empty tables. Counting three-space-indented keys in the root manifest gives
**5,354 modules**; the site's own stats page reports **6,680 cumulative modules**
and **43,152 cumulative versions** as of 2026-08-03 (numbers extracted from the
`init_Stats(...)` payload embedded in `https://luarocks.org/stats`). Weekly deltas
from the same series run about **9–17 new modules and 70–216 new versions per
week**, so a nightly or weekly refresh is more than adequate.

Richer metadata means fetching each rockspec individually. They are public:

```
$ curl -sSL https://luarocks.org/manifests/hisham/luafilesystem-1.8.0-1.rockspec
package = "LuaFileSystem"
version = "1.8.0-1"
source = { url = "git://github.com/keplerproject/luafilesystem", tag = "v1_8_0" }
description = {
   summary = "File System Library for the Lua Programming Language",
   detailed = [[ ... ]],
   license = "MIT/X11",
}
dependencies = { "lua >= 5.1" }
```

That is where summary, license and dependencies live — one HTTP request per
module, again in Lua syntax.

**There is no public JSON API.** The site is open source
([luarocks/luarocks-site](https://github.com/luarocks/luarocks-site), OpenResty +
Lapis + MoonScript + PostgreSQL, per its
[README](https://github.com/luarocks/luarocks-site/blob/master/README.md)), and
[`applications/api.moon`](https://github.com/luarocks/luarocks-site/blob/master/applications/api.moon)
defines exactly six routes:

```
"/api/tool_version"
"/api/1/:key/status"
"/api/1/:key/modules"
"/api/1/:key/check_rockspec"
"/api/1/:key/verify_tfa"
"/api/1/:key/upload"
"/api/1/:key/upload_rock/:version_id"
```

Every `/api/1/…` route is wrapped in `api_request`, which looks up
`ApiKeys\find(key: key_str)` and returns `401 Invalid key` otherwise. Confirmed by
probe: `https://luarocks.org/api/1/search?query=json` → **404**,
`https://luarocks.org/api/1/status` → **404**, and the only public endpoint,
`https://luarocks.org/api/tool_version`, returns `{"version":"1.0.0"}`. The site's
own [API documentation](https://luarocks.org/docs/api) confirms it: the whole
documented API is upload-oriented, and the one read endpoint that exists
(`check_rockspec`) still requires a key. There is also **no RSS feed** —
`/feed` and `/rss` both 404.

**How comparable directories do it, for contrast.**

[crates.io](https://crates.io/data-access) publishes a documented hierarchy and
tells you which tier to use: the **sparse index** at `index.crates.io` ("No rate
limits are required to use data from the sparse crate index"), the legacy git
index, direct `static.crates.io` downloads, **RSS feeds** (`crates.xml`,
`updates.xml`, per-crate feeds), a **24-hourly full database dump** at
`https://static.crates.io/db-dump.tar.gz`, and only then the REST API, permitted
"provided you abide by the following limits: A maximum of 1 request per second,
and a user-agent header that identifies your application". That last requirement
is enforced, not advisory:

```
$ curl -sS -A "" -o /dev/null -w "%{http_code}" "https://crates.io/api/v1/crates?q=serde&per_page=1"
403
$ curl -sS -A "LuaDocs-research/0.1" ... 
200 {"crates":[{"id":"serde", … "downloads":1243503585, "description":"A generic serialization/deserialization framework", …}]}
```

Note how much richer one crates.io record is than a LuaRocks manifest entry:
description, homepage, documentation, repository, download counts, version counts.

[npms.io](https://api.npms.io/v2/search?q=react&size=1) still answers **HTTP 200**,
but the data is frozen: it returns `react` at version **18.2.0** dated
**2022-06-14**. The backing analyzer
([npms-io/npms-analyzer](https://github.com/npms-io/npms-analyzer)) was last
pushed **2023-02-27**. A live endpoint serving four-year-old data is a good
reminder that "the API returns 200" is not the same as "the directory is
maintained".

Go has no pkg.go.dev API, but it does publish a first-class **feed**:
[index.golang.org](https://index.golang.org/) describes itself as "an index which
serves a feed of new module versions that become available by proxy.golang.org",
and `https://index.golang.org/index?limit=2` returns newline-delimited JSON
(`{"Path":"golang.org/x/text","Version":"v0.3.0","Timestamp":"…"}`).

[The Ruby Toolbox](https://github.com/rubytoolbox/rubytoolbox) is MIT-licensed and
open, but its category catalog is not where one might expect — there is no
`config/catalog/` directory in the main repo tree, so the catalog lives elsewhere
and was not located in this pass.

**`awesome-lua` is not usable as a data source.** The repo
[LewisJEllis/awesome-lua](https://github.com/LewisJEllis/awesome-lua) is real
(4,545 stars, ~250 link bullets in `readme.md`, a genuinely thoughtful
[`contributing.md`](https://github.com/LewisJEllis/awesome-lua/blob/master/contributing.md)
that states the inclusion bar — "An active maintainer and recent development",
"Is the best library or package of its kind"). But the GitHub API reports
**`"license": null`** and **`"pushed_at": "2024-08-11"`**, with 47 open issues. So
it is *unlicensed* — there is no grant permitting reuse of the list — and *two
years stale*. It is a fine model for a curation policy and a poor source of data.

**Cost.** Building against the manifest plus per-rockspec fetches is a real
crawler: 5,354 rockspec requests for a full cold pass, a Lua parser in the build,
and a cache. Ongoing curation is the larger cost if the directory carries
hand-written blurbs (see §10).

**ADR conflict.** Two, and they point in different directions.
[ADR 0002](../adr/0002-scope-standard-lua-only.md) says outright that
"Ecosystem/package coverage (LuaRocks and notable libraries) is a curated Guide
that links out — the site is not a package registry", and defers it. A browsable,
searchable directory of 5,354 modules **is** a package registry front-end, whatever
it is called. [ADR 0004](../adr/0004-self-hosted-on-github-no-third-parties.md) is
satisfiable — the crawl runs in CI and the output is static JSON — but the
build-time dependency on a third-party service that offers no read API, no rate
limit policy, and no feed is a durability risk that the ADR's spirit is about.

---

## 5. Mod discovery

**What it is.** A directory of mods and plugins across the ecosystems that embed
Lua.

**Primary evidence, ecosystem by ecosystem.** Every endpoint below was called.

**Open and documented:**

- **Factorio.** `https://mods.factorio.com/api/mods` → **200, no auth**. The
  [Mod Portal API wiki page](https://wiki.factorio.com/Mod_portal_API) states
  "Using the API does not require any kind of authentication or account
  information" for reads. Response is HAL-style with pre-built `next`/`last`
  links and reports `"count": 22621`. Crucially, `?page_size=max` returns the
  **entire catalog in one request — 13,384,264 bytes in 1.72 s**. Per-mod detail
  at `/api/mods/{name}/full`. The
  [terms of service](https://factorio.com/terms-of-service) do not address
  scraping or third-party redistribution of metadata at all: no prohibition, but
  no explicit grant either.
- **Luanti (ex-Minetest) ContentDB.** `https://content.luanti.org/api/packages/` →
  **200, no auth, 838,697 bytes, ~3,405 packages, unpaginated**. Per-package
  detail includes `license` as an SPDX string, `downloads`, `dev_state`, and even
  an `ai_disclosure` field. `?fmt=keys` returns a 192 KB projection of
  `{author, name, type}` for cheap diffing. The
  [API help page](https://content.luanti.org/help/api/) confirms reads are
  anonymous, documents filtering semantics, and states there are no rate limits.
  ContentDB itself is **AGPL-3.0**. This is the cleanest dataset in the survey.
- **WoWInterface.** `https://api.mmoui.com/v3/game/WOW/filelist.json` → **200, no
  auth, 5.56 MB, 8,147 addons in one request**, with download counts,
  compatibility arrays and per-addon detail at `/v3/game/WOW/filedetails/{id}.json`.
  Caveat: no published API terms — it is the undocumented backend for the Minion
  client, tolerated rather than licensed.

**Key-gated:**

- **Steam Workshop / Garry's Mod.** Split. `ISteamRemoteStorage/GetPublishedFileDetails/v1/`
  works **with no key** (POST, returns full item metadata; `creator_app_id: 4000`
  is Garry's Mod). But `IPublishedFileService/QueryFiles/v1/` — the only way to
  *enumerate or search* — returns **403 "Access is denied … verify your key="**.
  So hydration is free, discovery needs a key. The
  [Steam Web API Terms of Use](https://steamcommunity.com/dev/apiterms) contain no
  caching limit and no blanket redistribution ban, but do require that you not
  present the data so that it appears "that your Application is endorsed or
  affiliated with Valve or Steam".
- **CurseForge.** `https://api.curseforge.com/v1/mods/search?gameId=1` → **403
  "Forbidden: API Key missing or invalid"**. Per the
  [REST API docs](https://docs.curseforge.com/rest-api/), keys come from an
  approval-gated studio console, and responses carry a per-project
  `allowModDistribution` flag, so even with a key not everything may be mirrored.
- **Wago Addons.** `https://addons.wago.io/api/external/addons/_search?query=…` →
  **401**. Keys require an account.

**Closed or hostile:**

- **Roblox.** The documented API surface is Open Cloud, which has **no marketplace
  browse or search endpoint**; `https://apis.roblox.com/assets/v1/assets/1818`
  returned **403**. Two undocumented internal endpoints do answer 200
  (`catalog.roblox.com/v1/search/items`, `apis.roblox.com/toolbox-service/v1/marketplace/…`)
  but return bare ID stubs and cap `totalResults` at 1000. The
  [Terms of Use](https://en.help.roblox.com/hc/en-us/articles/115004647846-Roblox-Terms-of-Use)
  — retrievable only via the help centre's Zendesk JSON API, since the HTML is
  behind a Cloudflare challenge — states "Roblox reserves the right to text and
  data mining of the Platform and the Services and any kind of other provided
  content", an explicit machine-readable-rights reservation, alongside a bar on
  redistributing any part of the Services. `robots.txt` disallows `/catalog/contents`.
  **This one is blocked**, and it is also Luau rather than Lua.

**No index at all:**

- **LÖVE.** There is no registry, no API, no manifest. The wiki, forums and even
  the MediaWiki API at `love2d.org/w/api.php` all return **403** behind
  Cloudflare; `love2d.org/api` is **404**. The de facto index is a hand-maintained
  awesome-list README. Building a LÖVE directory means *creating* the index, not
  mirroring one.
- **Defold.** No REST API (`defold.com/assets/index.json` → 404), but the asset
  portal's source of truth is public: [defold/asset-portal](https://github.com/defold/asset-portal)
  holds **316 per-asset JSON files** with license strings, platform arrays, tags
  and star counts, refreshed by a bot script. The repo's own `license` field is
  **null**, so reuse rights are unstated.
- **Neovim.** No canonical index. [neovimcraft.com/db.json](https://neovimcraft.com/db.json)
  → **200, 888,243 bytes, 1,339 plugins** with stars and timestamps — but note the
  database is generated at build time and is **not in the repo** (`data/db.json`
  is a 404), so the deployed site is the only source. `awesome-neovim`'s README is
  229 KB of markdown with ~1,399 links: parseable by regex, but not a schema.
  LuaRocks' Neovim manifest at `https://luarocks.org/manifests/neovim/manifest` is
  **3,525 bytes** — a handful of rocks. The rocks.nvim effort exists but has not
  achieved adoption.

**Cost.** Ongoing, and paid in a currency LuaDocs does not otherwise spend: each
ecosystem is a separate integration with a separate schema, separate terms, and
separate breakage. Three sources are one-request-per-refresh (Factorio, ContentDB,
WoWInterface), which is cheap; the rest are not.

**ADR conflict — the sharpest on this list.**
[ADR 0002](../adr/0002-scope-standard-lua-only.md) states that "host-specific
embeddings and mod APIs (WoW, LÖVE, Garry's Mod, Neovim, etc.) are explicitly out
of scope — they are different languages or host environments", covered "only as a
survey in a single 'Lua in the wild' Guide that links outward". A mod discovery
surface is not a survey that links outward; it is a mirrored index of exactly the
material the ADR excludes. Roblox is doubly excluded (Luau, and its ToS forbids
it). This surface cannot be built without either amending ADR 0002 or accepting
that it contradicts it.

---

## 6. Blog

**What it is.** Dated posts alongside the docs.

**Primary evidence — the wiring is genuinely cheap.** Fumadocs documents it at
[fumadocs.dev/docs/mdx/collections](https://fumadocs.dev/docs/mdx/collections),
whose opening example is literally a blog:

```ts
import { defineCollections } from 'fumadocs-mdx/config';

export const blog = defineCollections({
  type: 'doc',
  dir: './content/blog',
  schema: z.object({ /* … */ }),
});
```

The end-to-end walkthrough is not a docs page but a blog post —
[fumadocs.dev/blog/make-a-blog](https://fumadocs.dev/blog/make-a-blog) ("Making a
Blog with Fumadocs", 2024-12-15) — which adds the `loader({ baseUrl: '/blog' })`
call plus an index route and a `[slug]` route. RSS is a separate guide,
[fumadocs.dev/docs/guides/rss](https://fumadocs.dev/docs/guides/rss), using the
`feed` package. Total: roughly ten lines of collection config, five lines of
loader, two routes, and an optional ~30-line RSS route. No backend, fully static.
There is **no dedicated "Blog" docs section** in Fumadocs — only the generic
Collections reference and that one post.

The live site is the proof. `apps/docs/content/blog/` holds **exactly 25 MDX
files**, the collection is declared in
`apps/docs/lib/source/index.tsx` (not `source.config.ts` — the real site has moved
to the newer `fumadocs-mdx/macro` API, which the docs page has not caught up
with), and `/blog/rss.xml` is a route handler with `revalidate = false`, i.e.
static. The blog lives inside the `(home)` route group so it inherits the
marketing navbar.

**Primary evidence — cadence is the hard part, not the wiring.** Counting real
dated posts on the live index pages for the twelve months to 2026-08-07:

| Blog | Posts, last 12 months | Dominant content | Shape |
|---|---|---|---|
| [astro.build/blog](https://astro.build/blog/) | ~36–40 | releases + a **monthly roundup** + partnership announcements | steady |
| [bun.com/blog](https://bun.com/blog) | 24 | release notes ("Fixes 92 issues") + engineering deep-dives | decelerating |
| [fumadocs.dev/blog](https://fumadocs.dev/blog) | 10 | ~85% release notes | bursty, five-month gap Dec 2025 → May 2026 |
| [MDN blog](https://developer.mozilla.org/en-US/blog/) | 5 | editorial and tutorial | near-dormant, five-month gap Nov 2025 → Apr 2026 |

The pattern worth noting: the only blog sustaining a high cadence does so because
it has a **non-release recurring format**. Astro's "What's new in Astro — <Month>"
posts land like clockwork on the last day of every month (2025-09-30, 2025-10-31,
2025-11-30, 2025-12-30, 2026-01-31 … 2026-07-31) and are what keeps its average
up. Blogs that are purely release-driven publish in bursts and then go quiet.
MDN's blog is the cautionary case: it ran 2–5 posts a month in 2023–24 and has
published five posts in the last year.

**Cost.** Build cost: near zero, and it is the same MDX pipeline the docs already
use. Maintenance cost: entirely editorial, and the reference sites show that a
docs project without a release calendar to write about will produce roughly five
to ten posts a year at best.

**ADR conflict.** None mechanically. It is listed as deferred optional work in
[ADR 0002](../adr/0002-scope-standard-lua-only.md) and in
[`luadocs-idea.md`](luadocs-idea.md). Note that LuaDocs has no release calendar of
its own to blog about — Lua's releases belong to lua.org — so the Astro-style
recurring format, or the MDN-style editorial format, is the only shape available.

**What else fumadocs.dev ships, for completeness.** The author asked what
fumadocs.dev actually has beyond docs. Enumerated from the live site and
[fuma-nama/fumadocs](https://github.com/fuma-nama/fumadocs) (the whole site is
`apps/docs`, and `apps/` has exactly one child): landing page, `/showcase`
(hardcoded arrays — **56 showcase entries, 4 blogs, 3 Vercel projects** — with a
"Suggest Yours" button pointing at
[discussion #30](https://github.com/fuma-nama/fumadocs/discussions/30)), `/blog`
plus `/blog/rss.xml`, `/llms.txt` (14.9 KB), `/llms-full.txt` (**948 KB**),
`/llms.mdx/{slug}` serving `text/markdown` per page, `/og/[...slug]` (prerendered
OG images via `generateStaticParams`), `/static.json` (544 KB search index),
`/sitemap.xml`, and `/export/epub` returning `application/epub+zip`. **Negative
results:** `/sponsors` is a **404** (the navbar link is external), and there is
**no standalone playground route** — `/playground` 404s. Three routes do need a
real server: `/api/chat` (AI SDK), `/api/mcp`, and `/api/search`.

---

## 7. Installation guide, version-aware

**What it is.** A docs section telling a reader how to get Lua, keyed to the
selected version.

**Primary evidence — lua.org publishes almost nothing usable here, and nothing at
all for Windows.** All lua.org citations in this section come from Wayback
snapshots taken **2026-08-05**, whose own page footers read `Last update: Tue Aug
4 00:43:17 UTC 2026`, so the archived copy is three days stale at most.

`https://www.lua.org/download.html` (archived 2026-08-05) opens "Lua is free
software distributed in source code." The only artefact offered is
`lua-5.5.1.tar.gz`, dated **2026-07-24, 390K**, sha256 beginning `1c4b4068`. For
binaries it defers entirely: "Pre-compiled Lua libraries and executables are
available at **LuaBinaries**" (`https://luabinaries.sourceforge.net`), and "The
main repository of Lua modules is **LuaRocks**." **LuaDist is not linked from
either page** — a negative result worth recording, since it still circulates in
third-party install advice.

`https://www.lua.org/start.html` (archived 2026-08-05) says "If you use Linux or
macOS, Lua is either already installed on your system or there is a Lua package
for it. Make sure you get the latest release of Lua (currently 5.5.1)." Its
**entire Windows guidance is one sentence**: if you want to build from source,
"there are detailed instructions in the wiki" — two links to
`http://lua-users.org/wiki/BuildingLuaInWindowsForNewbies` and the lua-users wiki,
both over plain HTTP, both third-party. That gap is the strongest argument for
this surface existing at all.

The per-version readmes are real and they **differ between versions in a way a
version-aware page must encode**. `https://www.lua.org/manual/5.4/readme.html` and
`https://www.lua.org/manual/5.5/readme.html` (both archived; the 5.5 one is
footnoted "revised for Lua 5.5.1") both state the build instructions "are for
Unix-like platforms". Their `make` target lists are not the same:

- 5.4: `guess aix bsd c89 freebsd generic ios linux linux-readline macosx mingw posix solaris`
- 5.5: `guess aix bsd c89 freebsd generic ios linux macosx mingw posix solaris`

`linux-readline` is **gone in 5.5**, because 5.5's `lua.c` loads readline
dynamically. The 5.4 readme still tells Linux readers to install
`libreadline-dev`. That is exactly a delta in the sense of
[ADR 0001](../adr/0001-single-canonical-docs-with-version-deltas.md).

**Primary evidence — which version each channel actually ships today.** Every
number below comes from the channel's own manifest, formula or package index.

| Channel | Manifest / index | Version today |
|---|---|---|
| Arch `lua` | `archlinux.org/packages/search/json/?name=lua` | **5.5.1-1**, updated 2026-08-04 |
| Homebrew `lua` | `formulae.brew.sh/api/formula/lua.json` | **5.5.1**, sha256 matches lua.org's tarball |
| MSYS2 `mingw-w64-lua` | `MINGW-packages/.../PKGBUILD` | **5.5.1** |
| Scoop `lua` | `ScoopInstaller/Main/bucket/lua.json` | **5.5.0** (unzips LuaBinaries, gated on it) |
| Fedora Rawhide | `mdapi.fedoraproject.org/rawhide/pkg/lua` | **5.5.0-3.fc45** |
| Debian sid `lua5.5` | `sources.debian.org/api/src/lua5.5/` | **5.5.0-5** |
| Ubuntu 26.04 `lua5.5` | `packages.ubuntu.com` | **5.5.0-3** |
| Fedora 43 | `mdapi.fedoraproject.org/f43/pkg/lua` | 5.4.8-4.fc43 |
| Debian trixie `lua5.4` | `tracker.debian.org/pkg/lua5.4` | 5.4.7-1 |
| Homebrew `lua@5.4` | `formulae.brew.sh/api/formula/lua%405.4.json` | 5.4.8 |
| Ubuntu 24.04 `lua5.4` | `packages.ubuntu.com` | 5.4.6-3build2 |
| **winget `DEVCOM.Lua`** | `winget-pkgs/manifests/d/DEVCOM/Lua/` | **5.4.6** (upstream release tagged 2023-05-15) |
| Ubuntu 22.04 `lua5.4` | `packages.ubuntu.com` | 5.4.4-1 |
| **Chocolatey `lua`** | `community.chocolatey.org/api/v2/FindPackagesById()?id='lua'` | **5.1.5.52, published 2018-12-01** |

Three negative results matter more than the table. **There is no `Lua.Lua` on
winget** — `winget-pkgs/manifests/l/Lua` is a 404; the interpreter lives under
`DEVCOM.Lua` and has exactly three version folders (5.4.4, 5.4.5, 5.4.6), with no
5.5 at all. **Chocolatey's Lua is effectively abandoned** — `lua` is at 5.1.5 from
2018, `lua53` at 5.3.5 from 2019, and `lua54`, `luaforwindows` and `luajit` return
zero packages from the feed. **Homebrew no longer has `lua@5.3` or `lua@5.1`** —
both `formulae.brew.sh/api/formula/lua%405.3.json` and `lua%405.1.json` return
**404**, so any instruction of the form `brew install lua@5.1` is wrong today.

The naming convention is inconsistent in a way that breaks copy-paste
instructions, which is itself a reason for a hand-written page: Debian and Ubuntu
ship five parallel versioned source packages (`lua5.1` … `lua5.5`) and no usable
bare `lua`, so `apt install lua` is the wrong instruction; Arch inverts it, with
bare `lua` meaning the newest and `lua54`/`lua53`/`lua52`/`lua51` meaning the older
lines; Fedora ships `lua` plus `compat-lua` 5.1.5; Homebrew has only `lua` and
`lua@5.4`.

**LuaRocks.** Version **3.13.0**, confirmed both from luarocks.org's front page and
from `program_version` in
[`src/luarocks/core/cfg.lua`](https://github.com/luarocks/luarocks/blob/master/src/luarocks/core/cfg.lua).
The authoritative statement of which Lua versions it supports is its own
[`configure`](https://github.com/luarocks/luarocks/blob/master/configure) script,
which documents `--lua-version=VERSION  Use specific Lua version: 5.1, 5.2, 5.3,
5.4 or 5.5` and validates exactly `5.1|5.2|5.3|5.4|5.5`, detecting newest-first.
The GitHub wiki page is deprecated and says so; the live docs are
`docs/installation_instructions_for_{unix,macos,windows}.md`. The Windows page is
the dated one: its all-in-one bundle "includes Lua 5.1 and LuaRocks in source
format" and the binaries are 32-bit.

**Version managers.** Checked by last commit on each repo.

- **`luarocks/hererocks`** — alive, last commit **2026-08-04**, 86 stars. Its
  hardcoded version table already lists **5.5.0 and 5.5.1** with sha256s matching
  lua.org's. Caveat: the top CHANGELOG entry is still **0.25.1 (2022-04-07)**, so
  `pip install hererocks` lags master.
- **`Stratus3D/asdf-lua`** — alive, last commit **2026-05-01**, 81 stars, and the
  plugin the official asdf index registers for `lua`. Its `bin/list-all` tops out
  at **5.5.0**, so `asdf install lua 5.5.1` fails today.
- **mise** — registers Lua via `registry/lua.toml` (note: the old root
  `registry.toml` is now a 404) with backends `vfox:mise-plugins/vfox-lua` and
  `asdf:mise-plugins/mise-lua`. Both backing repos are low-traffic (1 and 4 stars).
- **`DhavalKapil/luaver`** — **dead.** Last commit **2017-08-15**, nine years ago,
  302 stars, and *not* formally archived, so GitHub shows no warning banner. It
  predates 5.4 entirely. It is the most-starred of the four and therefore the one a
  reader is most likely to find first.

**Cost.** Low to build, moderate and *unavoidable* to maintain: every row of that
table goes stale on its own schedule, and the whole point of the page is that the
numbers are current. A version-aware install page is a standing commitment to
re-check a dozen third-party manifests. All of them are machine-readable, so the
check can be a CI job rather than a human one.

**ADR conflict.** None in principle —
[ADR 0002](../adr/0002-scope-standard-lua-only.md) already puts "links to
**official** downloads (we link, never host binaries)" in scope. Two frictions
worth naming. First, the honest install answer on Windows is *not* an official
download: it is MSYS2 or Scoop, and Scoop is itself repackaging LuaBinaries, a
SourceForge project. Documenting those means recommending third-party
distributions, which is a different thing from linking lua.org. Second, the page's
accuracy depends on ten-plus external indexes, which is the same durability
concern ADR 0004 raises about build-time third-party dependencies.

## 8. History of Lua

**What it is.** The already-stubbed guide at
`content/docs/guides/history-of-lua.mdx`.

**Primary evidence — the sources, and what each actually covers.** All lua.org
citations are Wayback snapshots dated **2026-08-05** unless noted.

- **`https://www.lua.org/history.html`** is not an overview page. It is a full
  reprint of the **SBLP 2001 invited paper**, "The evolution of an extension
  language: a history of Lua" by Ierusalimschy, de Figueiredo and Celes, from the
  *Proceedings of V Brazilian Symposium on Programming Languages* (2001),
  B-14–B-28. Its own abstract says it covers Lua "from its creation as an in-house
  language for two specific projects, until Lua 4.0, released in November 2000".
  Its footer reads `Last update: Mon Mar 30 09:26:04 BRT 2015`. So lua.org's
  "history" is a 25-year-old paper that stops at 4.0 and has not been touched in a
  decade. **That is the gap this guide would fill**, and it is a large one.
- **`https://www.lua.org/versions.html`** is the chronology, listing every version
  from **1.0 through 5.5** with per-version sections. It also carries the
  release-numbering rule that a version-aware site should quote directly: releases
  are `x.y.z`, "Different releases of the same version correspond to bug fixes",
  share a reference manual and are ABI compatible, whereas "Different versions are
  really different" with no ABI compatibility and incompatible precompiled
  bytecode. That is the primary justification for
  [CONTEXT.md](../../CONTEXT.md)'s rule that the site tracks minor lines only.
- **The HOPL III paper**, "The Evolution of Lua", presented at the Third ACM
  SIGPLAN History of Programming Languages Conference in 2007. `versions.html`
  links it and also points to "its continuation published in 2025 in a journal".
  The ACM DL record `https://dl.acm.org/doi/10.1145/1238844.1238846` returned
  **HTTP 403** to automated access, so its open-access status is **unconfirmed**.
  The authors' own copy at `https://www.lua.org/doc/hopl.pdf` *is* in the archive
  and returns `application/pdf`, which makes the paywall question moot in practice:
  link the lua.org PDF. Slides are at
  `https://www.inf.puc-rio.br/~roberto/talks/hopl-slides.pdf`.
- **"The evolution of Lua, continued"**, the successor `versions.html` alludes to:
  same three authors, *Journal of Computer Languages* 83 (2025) 101326, DOI
  `10.1016/j.cola.2025.101326`, author copy archived at
  `https://www.lua.org/doc/cola.pdf`. **This is the most up-to-date primary history
  of Lua that exists.** Alongside it, "A look at the design of Lua",
  *Communications of the ACM* 61 #11 (2018) 114–123, DOI `10.1145/3186277`, author
  copy archived at `https://www.lua.org/doc/cacm2018.pdf` — note lua.org's own
  `docs.html` links the CACM page rather than that PDF, so the direct file is
  undocumented and the DOI is the safer citation.
- **`https://www.lua.org/bugs.html`** is the per-release errata list — "a list of
  all bugs found in each release of Lua since 4.0", indexed by series down to
  individual releases, with reproducing examples and patches. It is more granular
  than any changelog and is the natural source for version-specific gotchas.
- **`https://www.lua.org/papers.html`** is a substantial, curated bibliography —
  book chapters, journal papers, conference papers, technical reports, PhD theses
  and MSc dissertations — including the *Masterminds of Programming* interview
  (O'Reilly, 2009, pp. 161–176), "A text pattern-matching tool based on parsing
  expression grammars" (*Software: Practice & Experience* 39#3, 2009) and
  "Revisiting coroutines" (*ACM TOPLAS* 31#2, 2009). It invites additions by mail.
  This is the single richest primary source for a history guide, and it is
  underused by everyone.
- **`https://www.lua.org/authors.html`** states the team and institution: "The Lua
  language is designed, implemented, and maintained at PUC-Rio in Brazil since
  1993", with Roberto Ierusalimschy as a professor in PUC-Rio's Department of
  Computer Science and head of **LabLua**, Waldemar Celes as Director of
  **Tecgraf**, and Luiz Henrique de Figueiredo as a researcher at **IMPA**.
  `about.html` supplies the institutional arc — "Lua was born and raised in
  Tecgraf … Lua is now housed at LabLua" — and, usefully for a house style guide,
  the naming rule: write "Lua", and "Please do not write it as 'LUA', which is
  both ugly and confusing."
- **`https://www.lua.org/docs.html`** is the better curated entry point than
  `papers.html` for the team's own writing: it frames each paper in one line ("For
  a complete history of Lua, see…") with DOIs and slides.
- **Per-version incompatibilities** live inside each manual (`§8
  Incompatibilities with the Previous Version`), which is where a
  version-delta-driven history would actually source its facts. Those URLs could
  not be checked in this pass because lua.org was down.

**Licensing and reuse.** `https://www.lua.org/license.html` (archived 2026-08-05,
footer `Last update: Sat Jul 25 10:57:08 UTC 2026`) says "Lua is free software
distributed under the terms of the MIT license", grants use "for any purpose,
including commercial purposes, at absolutely no cost", and extends the same terms
retroactively: pre-5.0 releases used a near-zlib licence, but "if you wish to use
those old versions, you may hereby assume that they have all been re-licensed
under the MIT license". The copyright line is "Copyright © 1994–2026 Lua.org,
PUC-Rio."

**The important limit: that licence is on the *software*.** The MIT grant covers
"the Software and associated documentation files"; whether lua.org treats the
website's prose, the reference manual and the papers as falling inside that phrase
is **not stated anywhere I could reach**, and the manual's own copyright notice
could not be checked because lua.org was down. Two things are certain from
archived pages. First, **Programming in Lua's first edition is "freely available
online for personal use"** — a narrower grant than MIT, and not a reuse licence.
Second, `history.html` and the papers are academic publications whose venue
copyright is separate from Lua's MIT licence.

None of this obstructs LuaDocs, because
[ADR 0010](../adr/0010-entries-are-written-from-the-manual.md) and
[`luadocs-idea.md`](luadocs-idea.md) already commit to a full rewrite with a source
link back. Quotation of short passages with attribution is ordinary practice.
Wholesale copying of manual prose is the thing that is not clearly permitted, and
the project already does not do it.

**Cost.** Research-heavy, then near-static. The corpus is closed: a 2001 paper, a
2007 HOPL paper and its 2025 continuation, a version chronology, and a
bibliography. Once written it changes about once per Lua release.

**ADR conflict.** None. A History of Lua guide is explicitly in scope under
[ADR 0002](../adr/0002-scope-standard-lua-only.md)'s "Front door & flavor", and
the stub already exists in the tree.

## 9. Donations and supporting Lua upstream

**What it is.** A page pointing readers at whatever official channel exists for
funding Lua.

**Primary evidence — a channel does exist, and it is more concrete than expected.**
`https://www.lua.org/donations.html` (archived **2026-08-05**) is a real page. It
names three ways to help:

1. **A cash donation through Software in the Public Interest.** The page states
   "Lua is an associated project at Software in the Public Interest (SPI), a
   non-profit organization that manages donations on our behalf", offers a PayPal
   button, and points at SPI's own page for alternative methods. It adds "All
   donations are confidential and remain anonymous." This is confirmed
   independently on SPI's side: [spi-inc.org/projects/lua/](https://www.spi-inc.org/projects/lua/)
   lists Lua as an associated project, with SPI accepting donations, holding funds
   and paying project expenses on its behalf. **So the recipient is a US 501(c)(3),
   not PUC-Rio directly.**
2. **Buying a book published by Lua.org.** The donations page says "All proceeds
   from the sale of these books go directly to support the Lua project", and
   `https://www.lua.org/pil/` (archived 2026-08-05) repeats it: "When you buy a
   copy of this book, you help to support the Lua project." The current edition is
   the **fourth, Lua.org, August 2016, ISBN 8590379868**, updated to **Lua 5.3** —
   note that it is now two versions behind the language it documents.
3. **Buying merchandise at Zazzle**, a third-party print-on-demand store.

The page also states the institutional arrangement plainly: "The Lua project is
housed and developed at **LabLua**, a research laboratory of **PUC-Rio**, a
non-profit philanthropic higher-education institution in Brazil", and that
donations "complement the support we need to keep the Lua project running".

**Negative results.** `https://www.lua.org/donate.html` and
`https://www.lua.org/support.html` are both **404 in the archive** — `donations.html`
is the only spelling. No GitHub Sponsors link appears on the donations page. No
sponsor or funder logos appear on it either; lua.org does not run a sponsors wall.

**Trademark and branding.** Not verified. lua.org's logo page could not be reached
live, and was not fetched from the archive in this pass, so **whether lua.org
publishes any constraint on third-party use of the Lua name or logo is an open
question** — and it is the one that matters most for a site soliciting support on
Lua's behalf.

**Cost.** Trivial to build: it is one short page of links, and the targets are
stable (SPI's relationship with Lua is long-standing infrastructure, not a
campaign). Ongoing cost is near zero.

**ADR conflict.** None with [ADR 0004](../adr/0004-self-hosted-on-github-no-third-parties.md):
LuaDocs would be *linking* to SPI and lua.org, not taking payments, so no backend
and no payment processor. The real risk is presentational rather than technical —
a third-party site raising money "for Lua" must be unmistakably clear that the
money goes to SPI on lua.org's behalf and that LuaDocs is unaffiliated. Until the
trademark question above is answered, that framing is unverified ground.

## 10. Per-library pages as content, and the SEO question

**What it is.** Not a generated directory but a *section* — one page per notable
library, with a hand-written blurb, partly motivated by search traffic.

**Primary evidence — what Google actually says.** The binding document is the
[Search spam policies](https://developers.google.com/search/docs/essentials/spam-policies).
Its definition is about **intent and value**, not volume:

> "Scaled content abuse is when many pages are generated for the primary purpose
> of manipulating search rankings and not helping users."

The listed violations are all failures of added value, not of scale as such:
using generative AI "to generate many pages without adding value for users";
"scraping feeds, search results, or other content to generate many pages
(including through automated transformations like synonymizing, translating, or
other obfuscation techniques), where little value is provided to users";
"stitching or combining content from different web pages without adding value";
and "creating many pages where the content makes little or no sense to a reader
but contains search keywords".

The **thin affiliation** clause is the closest analogue to a library directory —
"publishing content with product affiliate links where the product descriptions
and reviews are copied directly from the original merchant without any original
content or added value" — and the remedy Google names is meaningful original
content, testing, or comparison. The **doorway abuse** clause covers "sites or
pages … created to rank for specific, similar search queries … that are not as
useful as the final destination", which is precisely the risk for a page about
`luafilesystem` that ranks above the project's own README while saying less than
it.

[Creating helpful, reliable, people-first content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
supplies the self-assessment. The questions that bear on this surface: does the
content provide "original information, reporting, research, or analysis"? Is it
"written or reviewed by an expert or enthusiast who demonstrably knows the topic
well"? And the *why*, which Google calls "perhaps the most important question" —
content should exist "primarily to help people", not "primarily to attract search
engine visits". Google also asks authors to disclose automation and explain "why
automation or AI was seen as useful to produce content".

**What distinguishes a useful directory from scaled content abuse, per those
documents.** Three things, all of them editorial rather than technical. First,
**original value per page** — a page that only restates the rockspec `summary` and
links out is the thin-affiliate pattern with the affiliate link removed. Second,
**the page must be at least as useful as the destination** — the doorway test.
Third, **stated intent** — "partly for SEO" is exactly the motive the helpful-content
guidance singles out, and the mitigation is that the page must be one a reader
would want even if search did not exist. Note that none of these scale with the
number of pages; a hundred genuinely annotated library pages are fine and ten
scraped ones are not. That is the useful conclusion: **the constraint is
per-page editorial effort, which is the same constraint that makes the surface
expensive.**

**Cost.** This is the most curation-heavy surface on the list, and unlike §4 it
cannot be automated at all — automation is precisely what makes it fail the test
above. It also inherits the version problem: a library page needs to say which Lua
versions the library supports, which is per-rockspec data
(`dependencies = { "lua >= 5.1" }`) that is not in the manifest.

**ADR conflict.** Same as §4, and more direct. [ADR 0002](../adr/0002-scope-standard-lua-only.md)
scopes ecosystem coverage to "a curated Guide that links out". A section of
per-library pages is not a guide that links out; it is a body of reference content
about software that is not standard Lua. It is also the one surface here whose
stated motivation (SEO) is in tension with
[`luadocs-idea.md`](luadocs-idea.md)'s editorial promises, which are all about
being the best place to *read* about Lua.

---

## 11. Can the reference manual be redistributed, and from where?

Given the outage, this is the section with the most immediate practical weight:
can every version's manual be vendored into this repository as an offline
authoring fallback?

**The manual carries its own licence notice, and it is not the same statement as
lua.org's licence page.** Every manual document, for every version, opens with a
notice of its own. Verified by reading the actual `doc/manual.html` shipped inside
each upstream source tarball, via Debian's unpacked copies:

| Version | Source read | Notice on the manual itself |
|---|---|---|
| 5.1 | [`lua5.1/5.1.5-11/doc/manual.html`](https://sources.debian.org/src/lua5.1/5.1.5-11/doc/manual.html/) | `Copyright © 2006–2012 Lua.org, PUC-Rio.` |
| 5.2 | [`lua5.2/5.2.4-3/doc/manual.html`](https://sources.debian.org/src/lua5.2/5.2.4-3/doc/manual.html/) | `Copyright © 2011–2015 Lua.org, PUC-Rio.` |
| 5.3 | [`lua5.3/5.3.6-2/doc/manual.html`](https://sources.debian.org/src/lua5.3/5.3.6-2/doc/manual.html/) | `Copyright © 2015–2020 Lua.org, PUC-Rio.` |
| 5.4 | [`lua5.4/5.4.7-1/doc/manual.html`](https://sources.debian.org/src/lua5.4/5.4.7-1/doc/manual.html/) | `Copyright © 2020–2024 Lua.org, PUC-Rio.` |
| 5.5 | [`lua5.5/5.5.0-5/doc/manual.html`](https://sources.debian.org/src/lua5.5/5.5.0-5/doc/manual.html/) | `Copyright © 2020–2025 Lua.org, PUC-Rio.` |

All five carry the identical following sentence, verbatim from the 5.4 file:

```html
<SMALL>
Copyright &copy; 2020&ndash;2024 Lua.org, PUC-Rio.
Freely available under the terms of the
<a href="https://www.lua.org/license.html">Lua license</a>.
</SMALL>
```

So the manual is placed under the same licence as the software, **by reference**,
in the document itself. That reference resolves to the MIT text quoted on
`https://www.lua.org/license.html` (archived 2026-08-05), under "Copyright ©
1994–2026 Lua.org, PUC-Rio", granting permission "to deal in the Software without
restriction, including without limitation the rights to use, copy, modify, merge,
publish, distribute, sublicense, and/or sell copies", on one condition: "The above
copyright notice and this permission notice shall be included in all copies or
substantial portions of the Software."

**Where this is and is not ambiguous.** It is *not* ambiguous that lua.org intends
the manual to be redistributable: the document says so on its own face, and MIT's
grant explicitly reaches "this software and **associated documentation files** (the
'Software')" — a phrase the manual, shipped inside the distribution's `doc/`
directory, sits squarely inside. It *is* a grant by reference rather than a
bespoke documentation licence, and MIT's operative vocabulary is software-shaped,
so the strictly conservative reading is that the permission is unambiguous while
the mechanics (what counts as "the above copyright notice and this permission
notice" for an HTML document) are left to the redistributor's judgement. The
practical consequence: **a vendored copy must keep the manual's own copyright line
and its link to the Lua licence, and should carry the MIT text alongside.**

**An independent distributor's formal determination points the same way.** Debian's
machine-readable
[`debian/copyright` for `lua5.4` 5.4.7-1](https://sources.debian.org/src/lua5.4/5.4.7-1/debian/copyright/)
declares `Files: *` — the whole tarball, `doc/` included — as `License: Expat`,
with the note "In the Lua community this license is better known as 'MIT'."
Debian's ftp-masters review licences before accepting a package into the archive,
so this is a third party who examined the tarball and concluded the documentation
is covered.

**Note the distinction the question asks about, kept sharp:** "the Lua software is
MIT-licensed" would not by itself license the manual. The reason the manual is
redistributable is the manual's *own* notice, not lua.org's licence page. Two
things nearby are **not** covered by it: `Programming in Lua`'s first edition is
"freely available online for personal use" (§8 above), which is not a
redistribution grant; and lua.org's ordinary website prose carries no copyright or
licence notice at all, so no grant attaches to it.

**Where the manuals can actually be obtained while lua.org is down.**

The manual ships **inside the source distribution**, not separately. The `doc/`
directory of `lua-5.4.7.tar.gz`, listed from
[`sources.debian.org/api/src/lua5.4/5.4.7-1/doc/`](https://sources.debian.org/api/src/lua5.4/5.4.7-1/doc/),
contains exactly: `manual.html`, `contents.html`, `readme.html`, `lua.1`,
`luac.1`, `lua.css`, `manual.css`, `index.css`, `logo.gif`, and
`OSIApproved_100X125.png`. The same layout holds for 5.1 through 5.5. So vendoring
"the manual" means vendoring `doc/` from each tarball, including its two
stylesheets, or lua.org's rendering will not display correctly.

**`github.com/lua/lua` is authentic but is not a substitute for the tarball.** The
repository is organisation-owned (`"isOrgOwned": true`, `"isFork": false`,
`"isMirror": false`, not archived), lists `lua.org` as its website, and its README
states: "This is the repository of Lua development code, as seen by the Lua team.
It contains the full history of all commits but is mirrored irregularly", "Please
**do not** send pull requests", and "Download official Lua releases from Lua.org."
It has 10.2k stars, 5,855 commits, and 59 tags. But:

- Its tree is the **flat development layout**, not the release layout — the C
  sources sit at the repository root, there is no `src/` and **no `doc/`**.
- The manual it does carry is **`manual/manual.of`** — the source markup, 303,316
  bytes at `master` — plus **`manual/2html`**, the Lua script that renders it.
  `manual/manual.html` is a **404** at every ref checked. So the repository has the
  manual's *source*, not the published document, and reproducing lua.org's HTML
  means running their renderer. (Small wrinkle worth knowing: `2html` emits a
  header linking `http://www.lua.org/copyright.html`, which is not the URL the
  shipped manuals use.)
- **Tag coverage is irregular, exactly as the README warns.** `v5.3.6`, `v5.4.7`
  and `v5.5.1` all resolve (**200**); `v5.1.5` and `v5.2.4` do **not** exist
  (**404**), though `v5.1` and `v5.2.3` do. The GitHub mirror therefore **cannot
  supply the 5.1.5 or 5.2.4 manuals**, which are precisely the final releases of
  the two oldest lines LuaDocs documents.
- `github.com/lua/manual` is a separate repository in the same organisation
  containing only `manual.of`, tagged under an older scheme (`v5-2-1`, `v5-3-0`
  … `v5-3-4`). It stops at 5.3.

**The distribution point that does work, with verification.** Debian carries every
line: `lua5.1` (5.1.5), `lua5.2` (5.2.4), `lua5.3` (5.3.6), `lua5.4` (5.4.7 in
stable, 5.4.8 in unstable) and `lua5.5` (5.5.0). The unmodified upstream tarball is
at `https://deb.debian.org/debian/pool/main/l/lua5.4/lua5.4_5.4.7.orig.tar.gz`,
and the accompanying
[`.dsc`](https://deb.debian.org/debian/pool/main/l/lua5.4/lua5.4_5.4.7-1.dsc)
publishes its SHA-256.

**And it cross-checks against lua.org exactly.** `https://www.lua.org/ftp/`
(archived 2026-08-05) publishes a SHA-256 per tarball and says "Check their
checksums to confirm the integrity of the packages." Its value for
`lua-5.4.7.tar.gz` is:

```
9fbf5e28ef86c69858f6d3d34eccc32e911c1a28b4120ff3e84aaa70cfbf1e30
```

Debian's `.dsc` lists, for `lua5.4_5.4.7.orig.tar.gz` (374,097 bytes):

```
9fbf5e28ef86c69858f6d3d34eccc32e911c1a28b4120ff3e84aaa70cfbf1e30
```

Identical. **Debian's copy is byte-for-byte the upstream tarball, and it can be
verified against a checksum published by lua.org without lua.org being reachable**
— the archived `ftp/` page also carries the SHA-256s for 5.5.1
(`1c4b4068…4373dce`), 5.5.0 and 5.4.8, among others. That closes the loop: an
authentic source, plus an independent authority for the hash.

**Trademark and branding constraints on republishing.** lua.org publishes **no
trademark policy** — no trademark page, no brand-usage guidelines were found. What
exists is a logo grant at `https://www.lua.org/images/` (archived; self-reported
last update 2023-12-10): "Feel free to use the images below when referring to Lua
in your products in web pages, manuals, splash screens, etc… If you use a Lua logo
in a web page, please add a link to our site." The formal terms — "Copyright © 1998
Lua.org. Graphic design by Alexandre Nakonechnyj" — permit use, copying and
distribution "for any purpose, including commercial applications", subject to
three conditions: do not misrepresent the origin or claim you drew it; "the only
modification you can make is to adapt the orbiting text to your product name"; and
keep the relative proportions. Note this matters concretely for a vendored manual,
because `doc/logo.gif` **is** the Lua logo, shipped inside the tarball. Separately,
`license.html` asks that users "give us credit by including the copyright notice
somewhere in your product or its documentation", and calls a logo plus a link back
"a nice, but optional, way to give us further credit". Nothing found constrains
republishing the documentation under a different site's name, beyond the notice
retention MIT already requires.

**Bottom line for the offline-fallback plan.** Vendoring `doc/` from the 5.1.5,
5.2.4, 5.3.6, 5.4.x and 5.5.x tarballs is supported by the manual's own licence
notice and corroborated by Debian's licence review; it requires retaining the
copyright line and the MIT text, and it should come from the Debian pool (or any
mirror) with the hash checked against lua.org's archived `ftp/` listing rather than
from `github.com/lua/lua`, which lacks the rendered manual entirely and lacks tags
for two of the five versions.


---

## Tensions and open questions

**ADR 0002 is the binding constraint, not ADR 0004.** Four of these surfaces are
static files and clear ADR 0004 without argument (landing page, showcase, blog,
donations). The ones that do not clear ADR 0002 are the discovery surfaces: a
LuaRocks directory is the "package registry" the ADR says the site is not, a mod
directory mirrors the host ecosystems the ADR excludes, and per-library pages are
reference content about software that is not standard Lua. None of these can ship
without either amending ADR 0002 or acknowledging that they contradict it.

**Three surfaces already exist upstream.** lua.org publishes a showcase (§2), a
uses page that delegates to Wikipedia and community lists (§2), a papers
bibliography (§8) and a donations channel via SPI (§9). The open question for each
is not "can we build this?" but "what does ours add?"

**Three surfaces already exist as empty stubs in this repo.**
`history-of-lua.mdx`, `lua-in-the-wild.mdx` and `luarocks-and-the-ecosystem.mdx`
are frontmatter-only. Whether the showcase and library-directory ideas are new
surfaces or are simply *how those guides get written* is unresolved, and it is the
cheapest question to answer.

**Curation cost is the real currency, and it is measurable.** Astro's showcase
takes 129 commits a year; Nuxt's takes 7 and looks abandoned. Fumadocs publishes
ten blog posts a year and MDN five. LuaRocks gains 9 to 17 modules a week. Every
surface here is cheap to build and priced in sustained editorial attention
afterwards.

**The manual-vendoring question turns out to be answerable, and favourably.** §11
establishes that the manual carries its own MIT-by-reference notice, that Debian
independently reviewed it as Expat, and that a byte-identical tarball is obtainable
from the Debian pool and verifiable against a lua.org-published SHA-256 without
lua.org being up. The residual ambiguity is mechanical, not permissive: what
counts as retaining "the above copyright notice and this permission notice" for an
HTML document.

**Open questions that could not be answered from primary sources in this pass:**

- Whether the ACM copy of the HOPL III paper is open access (`dl.acm.org` returned
  403). The lua.org author copy at `doc/hopl.pdf` is the practical answer either
  way.
- The exact heading text of `manual/5.4/manual.html#8` ("Incompatibilities with
  the Previous Version"), which is the natural source for change notes — the
  manual is vendorable per §11, so this resolves itself once vendored.
- Whether Ierusalimschy has a personal GitHub Sponsors profile. `github.com/lua`
  has no Sponsor button and no `FUNDING.yml`, and the org's stated position is
  that "All communication should be through the Lua mailing list", so its absence
  is likely but unconfirmed.
- The Ruby Toolbox's category catalog, which is not in `rubytoolbox/rubytoolbox`
  where it was expected.
- How long lua.org's outage lasts, and whether it has happened before. Worth
  noting that per `https://www.lua.org/thanks.html` (archived) lua.org has been
  hosted by **micro systems (msys.ch) since 2023**, after Pepperfish hosted it from
  2004 to 2023 — a single donated host, with no CDN and no status page.
