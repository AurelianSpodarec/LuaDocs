/**
 * The header of the blog index: a wide gradient panel with the title over it.
 *
 * Fumadocs' equivalent is a commissioned PNG. This is the same device generated
 * instead — layered CSS gradients for the glow and an SVG turbulence filter for the
 * grain — which means there is no binary asset to own, it stays crisp at any width, and
 * the palette is a line of code to change rather than a trip back to a design tool.
 *
 * **The panel is always dark, in both themes.** It is a picture rather than a surface:
 * light text on a deep blue field is the whole look, and re-tinting it for light mode
 * would leave a washed-out rectangle that matches nothing else on the page. Fumadocs
 * forces `dark` on theirs for the same reason.
 */
export function BlogBanner() {
  return (
    <div className="relative mb-10 aspect-[3.2] max-h-[420px] min-h-[220px] w-full overflow-hidden rounded-xl">
      {/* The field. A deep navy base with a bright diagonal band burning through it —
          three stacked gradients, painted back to front. */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage: [
            'radial-gradient(ellipse 26% 78% at 71% 52%, rgba(186,232,255,0.95) 0%, rgba(186,232,255,0) 62%)',
            'radial-gradient(ellipse 62% 120% at 74% 55%, rgba(45,146,255,0.85) 0%, rgba(45,146,255,0) 60%)',
            'radial-gradient(ellipse 90% 140% at 18% 40%, rgba(23,63,140,0.75) 0%, rgba(23,63,140,0) 70%)',
            'linear-gradient(118deg, #04091a 0%, #071634 38%, #0b2557 58%, #050d22 100%)',
          ].join(', '),
        }}
      />

      {/* The grain. `feTurbulence` over the whole panel at low opacity is what stops the
          gradient reading as a flat CSS rectangle — the same texture Fumadocs bakes into
          its image. */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 size-full opacity-[0.22] mix-blend-overlay"
      >
        <filter id="blog-banner-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#blog-banner-grain)" />
      </svg>

      <div className="relative flex h-full flex-col justify-center p-8 md:p-12">
        <h1 className="font-mono text-3xl font-medium text-white md:text-4xl">LuaDocs Blog</h1>
        <p className="mt-4 max-w-md font-mono text-sm text-white/70 md:text-base">
          Release coverage, notes on how the site is built, and what changes between Lua
          versions.
        </p>
      </div>
    </div>
  );
}
