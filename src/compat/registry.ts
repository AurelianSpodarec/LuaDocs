import { compatNodeSchema, type CompatNode } from './schema';
import stringByte from './data/string.byte.json';
import stringChar from './data/string.char.json';
import stringDump from './data/string.dump.json';
import stringFind from './data/string.find.json';
import stringFormat from './data/string.format.json';
import stringGmatch from './data/string.gmatch.json';
import stringLen from './data/string.len.json';
import stringGsub from './data/string.gsub.json';
import stringLibrary from './data/string.library.json';
import stringMatch from './data/string.match.json';
import stringLower from './data/string.lower.json';
import stringPack from './data/string.pack.json';
import stringPackFormats from './data/string.pack-formats.json';
import stringPacksize from './data/string.packsize.json';
import stringPatterns from './data/string.patterns.json';
import stringRep from './data/string.rep.json';
import stringReverse from './data/string.reverse.json';
import stringSub from './data/string.sub.json';
import stringUnpack from './data/string.unpack.json';
import stringUpper from './data/string.upper.json';
import utf8Library from './data/utf8.library.json';
import tableConcat from './data/table.concat.json';
import tableCreate from './data/table.create.json';
import tableLibrary from './data/table.library.json';
import tableForeach from './data/table.foreach.json';
import tableForeachi from './data/table.foreachi.json';
import tableGetn from './data/table.getn.json';
import tableInsert from './data/table.insert.json';
import tableMaxn from './data/table.maxn.json';
import tableMove from './data/table.move.json';
import tablePack from './data/table.pack.json';
import tableRemove from './data/table.remove.json';
import tableSort from './data/table.sort.json';
import tableUnpack from './data/table.unpack.json';
import mathTointeger from './data/math.tointeger.json';
import mathAbs from './data/math.abs.json';
import mathCeil from './data/math.ceil.json';
import mathFloor from './data/math.floor.json';
import mathFmod from './data/math.fmod.json';
import mathModf from './data/math.modf.json';
import mathSqrt from './data/math.sqrt.json';

/**
 * Every compat dataset, keyed by the `lua-compat` value an entry declares in its
 * frontmatter. Parsing at module load, against a strict schema that rejects
 * unknown keys, means malformed version facts (including typos like
 * `version_remved`) fail the build rather than rendering as a silently wrong
 * support strip.
 */
const raw: Record<string, unknown> = {
  'string.byte': stringByte,
  'string.char': stringChar,
  'string.dump': stringDump,
  'string.find': stringFind,
  'string.format': stringFormat,
  'string.gmatch': stringGmatch,
  'string.len': stringLen,
  'string.gsub': stringGsub,
  // A section overview's own node. It describes the *library* — when the table
  // appeared, and when its membership changed — never the union of its members'
  // behaviour, which each member's node already carries.
  'string.library': stringLibrary,
  'string.lower': stringLower,
  'string.match': stringMatch,
  'string.pack': stringPack,
  'string.pack-formats': stringPackFormats,
  'string.packsize': stringPacksize,
  'string.patterns': stringPatterns,
  'string.rep': stringRep,
  'string.reverse': stringReverse,
  'string.sub': stringSub,
  'string.unpack': stringUnpack,
  'string.upper': stringUpper,
  // A stub entry legitimately has no compat key, but a *section overview* is where a
  // reader is sent to find out whether the library is there at all — `string`'s
  // encoding note does exactly that. So this node exists ahead of the entry it belongs
  // to, and says only when the library arrived.
  'utf8.library': utf8Library,
  'table.concat': tableConcat,
  'table.create': tableCreate,
  // The `table` section's own node, on the rule `string.library` set: the library's
  // existence and its *membership*, never the union of its members' behaviour. Its
  // members' raw-versus-metamethod change is therefore absent here and present on each
  // of the five entries where it is observable.
  'table.library': tableLibrary,
  // Four symbols that leave rather than arrive. `version_removed` is the first version
  // *without* the function, so it carries the whole fact and the prose names no version:
  // the replacement each one points at ( `#`, `pairs`, `ipairs` ) is true everywhere.
  'table.foreach': tableForeach,
  'table.foreachi': tableForeachi,
  'table.getn': tableGetn,
  'table.insert': tableInsert,
  'table.maxn': tableMaxn,
  'table.move': tableMove,
  'table.pack': tablePack,
  'table.remove': tableRemove,
  'table.sort': tableSort,
  'table.unpack': tableUnpack,
  'math.tointeger': mathTointeger,
  // The `math` library's version facts are overwhelmingly *language* facts — the integer
  // subtype arriving at 5.3 changes what these five hand back without changing what any
  // of them does. ADR 0009 gives that one site-wide disclosure, driven by a `<Return type>`
  // naming `integer`, so it is deliberately absent from these nodes. Only `fmod` records a
  // change of its own: a behaviour that used to answer, and now refuses.
  'math.abs': mathAbs,
  'math.ceil': mathCeil,
  'math.floor': mathFloor,
  'math.fmod': mathFmod,
  'math.modf': mathModf,
  'math.sqrt': mathSqrt,
};

export const compatNodes: Record<string, CompatNode> = Object.fromEntries(
  Object.entries(raw).map(([key, value]) => [key, compatNodeSchema.parse(value)]),
);

export function compatNodeFor(key: string | undefined | null): CompatNode | null {
  if (!key) return null;
  return compatNodes[key] ?? null;
}
