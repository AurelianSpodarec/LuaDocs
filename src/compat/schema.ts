import { z } from 'zod';

export const LUA_VERSIONS = ['5.1', '5.2', '5.3', '5.4', '5.5'] as const;
export type LuaVersion = (typeof LUA_VERSIONS)[number];
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
