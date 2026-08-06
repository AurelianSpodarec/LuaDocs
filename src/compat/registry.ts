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
import mathSin from './data/math.sin.json';
import mathCos from './data/math.cos.json';
import mathTan from './data/math.tan.json';
import mathAsin from './data/math.asin.json';
import mathAcos from './data/math.acos.json';
import mathAtan from './data/math.atan.json';
import mathDeg from './data/math.deg.json';
import mathRad from './data/math.rad.json';
import mathExp from './data/math.exp.json';
import mathLog from './data/math.log.json';
import mathMax from './data/math.max.json';
import mathMin from './data/math.min.json';
import mathRandom from './data/math.random.json';
import mathRandomseed from './data/math.randomseed.json';
import mathUlt from './data/math.ult.json';
import mathType from './data/math.type.json';
import mathPi from './data/math.pi.json';
import mathHuge from './data/math.huge.json';
import mathMaxinteger from './data/math.maxinteger.json';
import mathMininteger from './data/math.mininteger.json';
import mathPow from './data/math.pow.json';
import mathAtan2 from './data/math.atan2.json';
import mathCosh from './data/math.cosh.json';
import mathSinh from './data/math.sinh.json';
import mathTanh from './data/math.tanh.json';
import mathLog10 from './data/math.log10.json';
import mathFrexp from './data/math.frexp.json';
import mathLdexp from './data/math.ldexp.json';
import mathLibrary from './data/math.library.json';
import globalsType from './data/globals.type.json';
import globalsTostring from './data/globals.tostring.json';
import globalsTonumber from './data/globals.tonumber.json';
import globalsPairs from './data/globals.pairs.json';
import globalsIpairs from './data/globals.ipairs.json';
import globalsNext from './data/globals.next.json';
import globalsRawequal from './data/globals.rawequal.json';
import globalsRawget from './data/globals.rawget.json';
import globalsRawset from './data/globals.rawset.json';
import globalsRawlen from './data/globals.rawlen.json';

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
  // The `math` section's own node, on the rule `string.library` set and `table.library`
  // followed: the library's existence and its *membership*, never the union of its
  // members' behaviour. So the integer subtype arriving — which changes what a dozen of
  // these functions hand back — is absent here and present on each entry where it shows,
  // and what this node records is only which symbols the table holds.
  'math.library': mathLibrary,
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
  // The trigonometric six are thinner still: every one of them is present from 5.1 and
  // hands back a float in every version, and their manual passages are word-for-word
  // identical across all five. Only `atan` changed — it absorbed the second argument
  // `atan2` used to carry, which is a behaviour change with no error attached to it: an
  // older Lua accepts the same call and quietly ignores the argument.
  'math.sin': mathSin,
  'math.cos': mathCos,
  'math.tan': mathTan,
  'math.asin': mathAsin,
  'math.acos': mathAcos,
  'math.atan': mathAtan,
  // The unit conversions and the two exponential functions. `rad` and `exp` are
  // unchanged across all five lines; `deg` is not, and the difference is a rounding
  // one — the conversion became a multiplication where it used to be a division, which
  // moves the last bit. `log` gained its base argument, and the half that matters is
  // that an older Lua accepts the same two-argument call and ignores the base.
  'math.deg': mathDeg,
  'math.rad': mathRad,
  'math.exp': mathExp,
  'math.log': mathLog,
  // `max` and `min` stopped converting their arguments and started comparing them, so
  // the value that comes back is now one of the arguments rather than a number derived
  // from it. The manual annotated both `integer/float` at 5.3 and dropped the
  // annotation afterwards; that is a correction to the annotation, not a second change,
  // and it is deliberately not recorded here.
  'math.max': mathMax,
  'math.min': mathMin,
  // The busiest pair in the library. `random` moved twice: once when its bounds stopped
  // accepting any number and started demanding an exact integer, and again when the
  // generator itself was replaced, seeded at startup, and taught to read a single `0` as a
  // request for every bit rather than as an empty range. `randomseed` moved with it — it
  // grew a second argument, made both optional, and started handing back the seed it used,
  // which is what makes an unseeded run reproducible after the fact.
  'math.random': mathRandom,
  'math.randomseed': mathRandomseed,
  // `ult` and `type` are pure arrivals: both came in with the integer subtype and neither
  // has changed a line since. Their nodes carry availability and nothing else on purpose —
  // the 5.4 manual's switch from "nil" to "fail" in their descriptions is a change of
  // vocabulary for a value that is still `nil`, not a change of behaviour.
  'math.ult': mathUlt,
  'math.type': mathType,
  // The library's four constants, and the first entries of the constant fork. Their
  // nodes are availability and nothing else, in both directions. `pi` and `huge` are
  // present from 5.1 and hold the same value on every line — `huge`'s manual passage is
  // reworded twice (HUGE_VAL gains the word "float", "larger than or equal to" becomes
  // "greater than") and neither rewording changes what the value does, so neither is a
  // `changed_in`. `maxinteger` and `mininteger` are pure arrivals with the integer
  // subtype; a reader on 5.1 or 5.2 is told the entry is not there at all, which is what
  // makes ADR 0009's numeric disclosure unnecessary on a constant that has no `<Return>`
  // to hang it from.
  'math.pi': mathPi,
  'math.huge': mathHuge,
  'math.maxinteger': mathMaxinteger,
  'math.mininteger': mathMininteger,
  // The eight that leave. Availability here is read off the *manual*, on the rule
  // `table.maxn` set: a version whose manual calls a function deprecated is a version
  // that has it, and the removal is the first version whose manual stops mentioning it
  // at all. So `log10` — deprecated in one Incompatibilities chapter and absent from the
  // next — goes a version before the other seven, which are named together in a single
  // later sentence. A stock build keeps all eight alive one line further still, behind a
  // compatibility switch the manual never mentions; that is a property of a makefile
  // rather than of a Lua version, and the dataset deliberately does not record it.
  'math.pow': mathPow,
  'math.atan2': mathAtan2,
  'math.cosh': mathCosh,
  'math.sinh': mathSinh,
  'math.tanh': mathTanh,
  'math.log10': mathLog10,
  // The two that come back. `version_restored` exists for exactly this pair: documented,
  // dropped from the documentation, then given entries of their own again — and given
  // them unguarded, in the main body of the library rather than in its compatibility
  // block. `ldexp` alone changed while it was away, in what it accepts as an exponent.
  'math.frexp': mathFrexp,
  'math.ldexp': mathLdexp,
  // The `globals` section. These symbols carry no library prefix in the manual — the
  // anchors are `pdf-type`, `pdf-tostring`, `pdf-tonumber` — but a bare `type` here would
  // collide with `math.type` and `io.type`, which are different functions with entries of
  // their own. So the key is the *section* name rather than a library name, matching both
  // the directory the entries live in and the URL a reader sees. `globals.library` is
  // reserved for the section overview, on the shape `string.library` set.
  //
  // Only `tostring` and `tonumber` have anything to record. `type` answers the same eight
  // strings in every version, refuses a missing argument in every version, and consults no
  // metatable in any of them, so its node is availability and nothing else — which is what
  // keeps the matrix off a page where nothing varies.
  'globals.type': globalsType,
  // `tostring` changed once, and the manual documents neither half of it: the check that a
  // `__tostring` result is usable as text arrives at 5.3, and `__name` starts standing in
  // for the type name at 5.3 as well, though no manual mentions `__name` beside `tostring`
  // until 5.4. Both are read off `lauxlib.c` and confirmed against a 5.3 build, on ADR 0010
  // rule 3. The `.0` a float that looks like an integer gains at 5.3 is deliberately absent:
  // that is a fact about how Lua spells numbers, disclosed once site-wide, and recording it
  // here would put it on every entry that ever prints one.
  'globals.tostring': globalsTostring,
  // `tonumber` moved twice, and both moves are in what it accepts rather than in what it
  // answers. `fail` is not one of them — the newest manuals say `fail` where the older ones
  // said `nil`, and the value is still `nil`, which is the ruling `math.ult` and `math.type`
  // already settled. Nor is the integer subtype: what comes back is a float before 5.3 and
  // may be an integer after, and ADR 0009 gives that one site-wide disclosure driven by the
  // `<Return type>` field.
  'globals.tonumber': globalsTonumber,
  // The iteration three. `next` is the primitive and has not moved a line since 5.1 — the
  // 5.4 manual restates its modification rule as advice rather than as undefined behaviour,
  // which is a change of tone about the same prohibition, so its node is availability and
  // nothing else. The other two carry the section's messiest version story, and it is a
  // story about *metamethods* rather than about symbols: `__pairs` arrives at 5.2 and is
  // still consulted on the newest line, while `__ipairs` arrives beside it and is gone two
  // versions later. Neither is a `version_added`/`version_removed` matter — `pairs` and
  // `ipairs` themselves are present throughout — so both are `changed_in` notes on the
  // entry where the metamethod is observable. `version_restored` is for a symbol that
  // leaves and comes back, which `math.frexp` needed and nothing here does.
  //
  // Both entries also record 5.3 loosening what the *call* accepts. `pairs` and `ipairs`
  // used to refuse a non-table on the spot and now hand back a walk for anything, leaving
  // the complaint to the walk's first step. No manual says so in any version; it is read
  // off `lbaselib.c` on ADR 0010 rule 3 and confirmed on a 5.3 build and on the site's 5.4
  // runtime, and it is recorded because the alternative is telling a reader that
  // `pcall(pairs, value)` is a type test, which it stopped being.
  'globals.pairs': globalsPairs,
  'globals.ipairs': globalsIpairs,
  'globals.next': globalsNext,
  // The four ways to reach a value without its metatable getting a say. Three of them are
  // present from 5.1 and have not moved since: `luaB_rawequal`, `luaB_rawget` and
  // `luaB_rawset` are the same handful of lines in every version, at the release tag as
  // well as at the line's final release. Their manual passages *are* reworded at 5.3 —
  // "without invoking any metamethod" becomes the name of the one metamethod each actually
  // bypasses, and 5.4 says "metavalue" where 5.3 said "metamethod" — but the code they
  // describe is unchanged, so none of it is a `changed_in`, on the ruling `math.huge` set
  // for reworded passages.
  //
  // `rawset`'s passage gains a second refused key at 5.2 ("different from nil" becomes
  // "different from nil and NaN"), and that is the same shape: `ltable.c` raises for a
  // not-a-number key in 5.1 too, so 5.2 documented a rule that was already there. Recorded
  // in the entry's Errors list undated, per ADR 0010 rule 3.
  'globals.rawequal': globalsRawequal,
  'globals.rawget': globalsRawget,
  'globals.rawset': globalsRawset,
  // The one arrival. `rawlen` is absent from the 5.1 manual and from 5.1's `lbaselib.c`,
  // and enters with 5.2 alongside the C API's `lua_rawlen` (renamed there from
  // `lua_objlen`, which is the only mention any Incompatibilities chapter makes of any of
  // these four). What it accepts never changed: every version that has it says the value
  // must be a table or a string.
  'globals.rawlen': globalsRawlen,
};

export const compatNodes: Record<string, CompatNode> = Object.fromEntries(
  Object.entries(raw).map(([key, value]) => [key, compatNodeSchema.parse(value)]),
);

export function compatNodeFor(key: string | undefined | null): CompatNode | null {
  if (!key) return null;
  return compatNodes[key] ?? null;
}
