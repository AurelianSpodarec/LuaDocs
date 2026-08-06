import { z } from 'zod';

export const LUA_VERSIONS = ['5.1', '5.2', '5.3', '5.4', '5.5'] as const;
export type LuaVersion = (typeof LUA_VERSIONS)[number];

/**
 * The version a reader sees having expressed no preference — **always the latest** line
 * the site documents (CONTEXT.md).
 *
 * Derived from the list rather than written out again, so adding 5.6 moves it and there
 * is no second place to remember. It lives here, beside the list it comes from, because
 * two things need it now: the selected-version provider, and the playground, which has
 * no selected version to speak of and states the latest instead.
 */
export const DEFAULT_VERSION: LuaVersion = LUA_VERSIONS[LUA_VERSIONS.length - 1];
const versionEnum = z.enum(LUA_VERSIONS);

const order = (v: LuaVersion) => LUA_VERSIONS.indexOf(v);

/**
 * When the entry exists: an opening bound, an optional closing one, and — for the
 * symbol that came back — an optional reopening.
 *
 * `math.frexp` and `math.ldexp` are documented in 5.1 and 5.2, absent from 5.3 and 5.4,
 * and documented again in 5.5. A pair of bounds is one half-open interval, so both of
 * the encodings it allows state something false about two of the five versions: with
 * `version_removed: '5.3'` the entry denies 5.5, and without it the entry claims 5.3 and
 * 5.4. `version_restored` is the smallest field that makes either honest — one more
 * version, reopening the interval the closing bound shut.
 *
 * It is deliberately not a list of intervals. A list would give the ordinary entry two
 * ways to say the same thing, and every dataset in `data/` would have to move to the new
 * one or the two spellings would drift; this leaves all of them untouched. It cannot
 * express a second removal, and nothing in 5.1–5.5 needs one — a symbol that leaves
 * twice would want the list, and would be a schema change made against a real case
 * rather than a hypothetical one.
 *
 * The ordering checks below are the other half of `.strict()`. Unknown keys already fail
 * the build, which is what stopped `version_remved` rendering as a silently wrong support
 * strip; these stop the *values* being wrong in the ways this shape newly allows —
 * `removed` and `restored` transposed, or a `restored` with nothing to reopen. Both would
 * otherwise parse and render four surfaces' worth of confident nonsense.
 */
const luaSupportSchema = z
  .object({
    version_added: z.union([versionEnum, z.literal(false)]),
    /** The first version *without* the entry. */
    version_removed: versionEnum.optional(),
    /** The version that documents it again, after `version_removed` dropped it. */
    version_restored: versionEnum.optional(),
  })
  .strict()
  .superRefine((support, ctx) => {
    const { version_added: added, version_removed: removed, version_restored: restored } = support;

    if (added === false) {
      for (const key of ['version_removed', 'version_restored'] as const) {
        if (support[key]) {
          ctx.addIssue({
            code: 'custom',
            path: [key],
            message: `${key} on an entry no documented version has (version_added: false)`,
          });
        }
      }
      return;
    }

    if (removed && order(removed) <= order(added)) {
      ctx.addIssue({
        code: 'custom',
        path: ['version_removed'],
        message: `version_removed (${removed}) must be after version_added (${added})`,
      });
    }

    if (restored && !removed) {
      ctx.addIssue({
        code: 'custom',
        path: ['version_restored'],
        message: 'version_restored without version_removed — an entry has to leave before it can come back',
      });
    }

    if (restored && removed && order(restored) <= order(removed)) {
      ctx.addIssue({
        code: 'custom',
        path: ['version_restored'],
        message: `version_restored (${restored}) must be after version_removed (${removed})`,
      });
    }
  });

export const compatNodeSchema = z
  .object({
    support: z
      .object({
        lua: luaSupportSchema,
      })
      .strict(),
    changed_in: z.partialRecord(versionEnum, z.string()).optional(),
    notes: z.string().optional(),
  })
  .strict();

export type CompatNode = z.infer<typeof compatNodeSchema>;
