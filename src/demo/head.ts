/**
 * The `head` every `/demo` page shares.
 *
 * `noindex` is the load-bearing part and it is centralised so a new demo page cannot be
 * added without it. Repeating the meta tag per route is exactly the shape of thing that gets
 * forgotten on the fourth page, and the cost of forgetting is an internal proposal in a
 * search index.
 */
export function demoHead(title: string) {
  return {
    meta: [
      { title: `${title} — LuaDocs internal` },
      { name: 'robots', content: 'noindex' },
    ],
  };
}
