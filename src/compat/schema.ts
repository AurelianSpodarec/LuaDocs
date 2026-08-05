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

export const compatNodeSchema = z
  .object({
    support: z
      .object({
        lua: z
          .object({
            version_added: z.union([versionEnum, z.literal(false)]),
            version_removed: versionEnum.optional(),
          })
          .strict(),
      })
      .strict(),
    changed_in: z.partialRecord(versionEnum, z.string()).optional(),
    notes: z.string().optional(),
  })
  .strict();

export type CompatNode = z.infer<typeof compatNodeSchema>;
