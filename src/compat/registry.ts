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
import utf8Char from './data/utf8.char.json';
import utf8Codepoint from './data/utf8.codepoint.json';
import utf8Len from './data/utf8.len.json';
import utf8Codes from './data/utf8.codes.json';
import utf8Offset from './data/utf8.offset.json';
import utf8Charpattern from './data/utf8.charpattern.json';
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
import globalsGetmetatable from './data/globals.getmetatable.json';
import globalsSetmetatable from './data/globals.setmetatable.json';
import globalsPcall from './data/globals.pcall.json';
import globalsXpcall from './data/globals.xpcall.json';
import globalsError from './data/globals.error.json';
import globalsAssert from './data/globals.assert.json';
import globalsLoad from './data/globals.load.json';
import globalsLoadfile from './data/globals.loadfile.json';
import globalsDofile from './data/globals.dofile.json';
import globalsSelect from './data/globals.select.json';
import globalsPrint from './data/globals.print.json';
import globalsWarn from './data/globals.warn.json';
import globalsCollectgarbage from './data/globals.collectgarbage.json';
import globalsGlobalTable from './data/globals._G.json';
import globalsVersionString from './data/globals._VERSION.json';
import globalsGetfenv from './data/globals.getfenv.json';
import globalsSetfenv from './data/globals.setfenv.json';
import globalsUnpack from './data/globals.unpack.json';
import globalsLoadstring from './data/globals.loadstring.json';
import globalsModule from './data/globals.module.json';
import globalsRequire from './data/globals.require.json';
import globalsLibrary from './data/globals.library.json';
import coroutineCreate from './data/coroutine.create.json';
import coroutineResume from './data/coroutine.resume.json';
import coroutineYield from './data/coroutine.yield.json';
import coroutineStatus from './data/coroutine.status.json';
import coroutineRunning from './data/coroutine.running.json';
import coroutineIsyieldable from './data/coroutine.isyieldable.json';
import coroutineWrap from './data/coroutine.wrap.json';
import coroutineClose from './data/coroutine.close.json';
import coroutineLibrary from './data/coroutine.library.json';
import osTime from './data/os.time.json';
import osDate from './data/os.date.json';
import osDifftime from './data/os.difftime.json';
import osClock from './data/os.clock.json';
import osGetenv from './data/os.getenv.json';
import osTmpname from './data/os.tmpname.json';
import osExecute from './data/os.execute.json';
import osExit from './data/os.exit.json';
import osRemove from './data/os.remove.json';
import osRename from './data/os.rename.json';
import osSetlocale from './data/os.setlocale.json';
import osLibrary from './data/os.library.json';
import ioOpen from './data/io.open.json';
import ioClose from './data/io.close.json';
import ioType from './data/io.type.json';
import ioFileRead from './data/io.file-read.json';
import ioRead from './data/io.read.json';
import ioFileWrite from './data/io.file-write.json';
import ioWrite from './data/io.write.json';
import ioFileFlush from './data/io.file-flush.json';
import ioFlush from './data/io.flush.json';
import ioFileLines from './data/io.file-lines.json';
import ioLines from './data/io.lines.json';
import ioFileSeek from './data/io.file-seek.json';
import ioFileSetvbuf from './data/io.file-setvbuf.json';
import ioInput from './data/io.input.json';
import ioOutput from './data/io.output.json';
import ioStdin from './data/io.stdin.json';
import ioStdout from './data/io.stdout.json';
import ioStderr from './data/io.stderr.json';
import ioFileClose from './data/io.file-close.json';
import ioPopen from './data/io.popen.json';
import ioTmpfile from './data/io.tmpfile.json';
import ioLibrary from './data/io.library.json';
import packagePath from './data/package.path.json';
import packageCpath from './data/package.cpath.json';
import packageConfig from './data/package.config.json';
import packageLoaded from './data/package.loaded.json';
import packagePreload from './data/package.preload.json';
import packageSearchers from './data/package.searchers.json';
import packageLoaders from './data/package.loaders.json';
import packageSearchpath from './data/package.searchpath.json';
import packageLoadlib from './data/package.loadlib.json';
import packageSeeall from './data/package.seeall.json';
import packageLibrary from './data/package.library.json';
import debugGetinfo from './data/debug.getinfo.json';
import debugTraceback from './data/debug.traceback.json';
import debugSethook from './data/debug.sethook.json';
import debugGethook from './data/debug.gethook.json';
import debugGetlocal from './data/debug.getlocal.json';
import debugSetlocal from './data/debug.setlocal.json';
import debugGetupvalue from './data/debug.getupvalue.json';
import debugSetupvalue from './data/debug.setupvalue.json';
import debugUpvalueid from './data/debug.upvalueid.json';
import debugUpvaluejoin from './data/debug.upvaluejoin.json';
import debugGetuservalue from './data/debug.getuservalue.json';
import debugSetuservalue from './data/debug.setuservalue.json';
import debugGetregistry from './data/debug.getregistry.json';
import debugGetmetatable from './data/debug.getmetatable.json';
import debugSetmetatable from './data/debug.setmetatable.json';
import debugDebug from './data/debug.debug.json';
import debugGetfenv from './data/debug.getfenv.json';
import debugSetfenv from './data/debug.setfenv.json';
import debugLibrary from './data/debug.library.json';

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
  // The whole `utf8` library arrives at 5.3 — `passage.py pdf-utf8.char`,
  // `pdf-utf8.codepoint` and `pdf-utf8.len` all report `absent` for 5.1 and 5.2, and
  // `lutf8lib.c` has no ancestor before v5.3.0 — so every entry here repeats
  // `version_added: "5.3"` rather than inheriting it from the section node.
  //
  // The section's one real version fact is a single edit at **5.4**, recorded on each of
  // the three entries from the side it is observable from. The 5.3 manual's UTF-8 Support
  // preamble (§6.5) says nothing at all about ranges; 5.4's and 5.5's (§6.5, §6.6) add two
  // paragraphs that split the library in half:
  //   * *Creating* a sequence — `utf8.char` alone — accepts everything up to `0x7FFFFFFF`,
  //     "as defined in the original UTF-8 specification", which is six bytes wide. v5.3.0
  //     and 5.3.6 both bound `pushutfchar` with `0 <= code && code <= MAXUNICODE` where
  //     `MAXUNICODE` is `0x10FFFF`; v5.4.0 onwards test `(lua_Unsigned)code <= MAXUTF`
  //     with `MAXUTF` `0x7FFFFFFF`. A negative argument still raises on both lines — 5.3
  //     by the explicit `0 <=`, 5.4+ because the unsigned cast makes it enormous.
  //   * *Interpreting* a sequence — `len`, `codepoint` and `codes` — gained the `lax`
  //     argument and, in the same release, a stricter default. 5.3's `utf8_decode` rejects
  //     overlong spellings and anything above `0x10FFFF` and has no surrogate test at all,
  //     so `utf8.len(utf8.char(0xD800))` answers `1` there and `nil, 1` from 5.4. That
  //     tightening is the one thing the manuals record as an incompatibility: 5.4 §8.2,
  //     "By default, the decoding functions in the utf8 library do not accept surrogates
  //     as valid code points." Nothing about `utf8` appears in 5.3's or 5.5's chapter.
  //
  // `lax` is *not* on `utf8.char` and *not* on `utf8.offset`, so those two carry no note of
  // it. What `lax` lifts is only the check on the decoded value; the 5.4 preamble's closing
  // parenthesis — "(Not well formed and overlong sequences are still rejected.)" — is the
  // half that is easy to read past, and both decoder notes are written against it.
  //
  // Nothing in `lutf8lib.c` moved for these three between v5.4.0, 5.4.8 and v5.5.0 beyond
  // renaming `utfint` to `l_uint32` and adding casts. The 5.4.8 and 5.5 edits that *are*
  // behavioural belong to `utf8.codes` and `utf8.offset`, recorded below.
  //
  // The section's other three, and the two things that moved within a line:
  //   * `utf8.codes` takes `lax` from 5.4 like the other two decoders, so its 5.4 note
  //     carries the same pair of facts. It also gained an up-front rejection of a subject
  //     that starts on a continuation byte — `luaL_argcheck(L, !iscontp(s), 1, MSGInvalid)`
  //     in `iter_codes` — which lands at **v5.4.5**, not v5.4.0: checked at every tag of the
  //     line, absent in v5.4.0–v5.4.4 and present in v5.4.5–v5.4.8. Both lines raise on such
  //     a subject; what moved is whether the raise comes from `utf8.codes(s)` itself or from
  //     the loop's first step, so `pcall(utf8.codes, "\x80")` answers `true` on v5.3.6 and
  //     v5.4.0 and `false` from v5.4.5. Recorded at 5.4 on the standing ruling that a line
  //     is credited with what its final release has; the patch boundary is in the U2 report.
  //     (v5.4.0 also dropped 5.3's `iscontp(next)` check and v5.4.5 restored it — the same
  //     boundary — which leaves no minor-line difference and is therefore recorded nowhere.)
  //   * `utf8.offset` returns **two** integers from 5.5 — `byteoffset` pushes the initial
  //     position, then walks the continuation bytes and pushes the final one. The failing
  //     path still pushes one `fail`. 5.3 says "returns nil" and 5.4 says "returns fail" for
  //     that path; both are `lua_pushnil`/`luaL_pushfail`, so that is the `math.huge` wording
  //     case and carries no note. `utf8.offset` has no `lax` in any version, and no version
  //     of it decodes anything — it reads continuation bits only.
  //   * `utf8.charpattern` is the one *value* in the section that changed. `UTF8PATT` is
  //     `"[\0-\x7F\xC2-\xF4][\x80-\xBF]*"` at v5.3.0 and v5.3.6 and
  //     `"[\0-\x7F\xC2-\xFD][\x80-\xBF]*"` from v5.4.0 — the same widening as `utf8.char`'s
  //     ceiling, since a six-byte sequence starts at `0xFC`/`0xFD`. Fourteen bytes on both
  //     lines; confirmed by probe as well as by source. One residual inside the 5.3 line:
  //     **v5.3.0 pushes it with `lua_pushliteral`**, which measures with `strlen`, and the
  //     pattern's second byte is `\0` — so v5.3.0 alone holds the one-byte string `"["`.
  //     v5.3.1 switched to `lua_pushlstring(L, UTF8PATT, sizeof(UTF8PATT) - 1)`. The final
  //     release of the line is what the page documents, so the entry says fourteen bytes.
  //
  // Nothing in any Incompatibilities chapter names `utf8.offset` or `utf8.charpattern`, and
  // 5.5's chapter does not mention the extra return value at all.
  'utf8.char': utf8Char,
  'utf8.codepoint': utf8Codepoint,
  'utf8.len': utf8Len,
  'utf8.codes': utf8Codes,
  'utf8.offset': utf8Offset,
  'utf8.charpattern': utf8Charpattern,
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
  // The metatable pair. Neither function has moved: `luaB_getmetatable` is byte-identical
  // in all five versions and at every release tag, and `luaB_setmetatable` differs only in
  // which argument-check macro it spells and whether the branch carries a hint — the manual
  // passages likewise say the same thing in three arrangements. So `getmetatable` is
  // availability and nothing else, and no matrix renders on its page.
  //
  // `setmetatable` records one change, and the manual files it under garbage collection
  // rather than beside the function: from 5.2 a table is *marked for finalization* by this
  // call, if and only if the metatable it is handed already holds `__gc`. Before that only
  // full userdata could be finalized, and only through the C API. It is recorded here rather
  // than left to the `__gc` entry because it is observable by calling `setmetatable` — the
  // moment of the call is what decides — and because the field arriving late in a metatable
  // that is already attached is a silent failure with nothing to catch it.
  'globals.getmetatable': globalsGetmetatable,
  'globals.setmetatable': globalsSetmetatable,
  // The error four. Their manual passages are reworded more than any other group in this
  // section — "error message" becomes "error object", `pcall` gains a note that a message
  // handler does not run for what it catches — and none of that is a behaviour change, on
  // the `math.huge` ruling. What is recorded here is read off `lbaselib.c` at the release
  // tags as much as off the manuals, because three of the four moved without any passage
  // saying so.
  //
  // `pcall` and `xpcall` both become yieldable at 5.2, when `luaB_pcall` and `luaB_xpcall`
  // switch from `lua_pcall` to `lua_pcallk` with a continuation. 5.1's `lua_yield` refuses
  // outright while a C call is pending, and a protected call is one. No manual states it
  // at the Lua level in any version; it is ADR 0010 rule 3, and it is recorded because a
  // coroutine that wraps its body in a protected call works on four of the five lines.
  'globals.pcall': globalsPcall,
  // `xpcall` is the one whose *signature* moved. 5.1 takes exactly two arguments and calls
  // `f` with none; 5.2 adds the argument list and 5.3 starts insisting `msgh` really is a
  // function, where 5.1 and 5.2 take any value and only trip over it when an error arrives.
  'globals.xpcall': globalsXpcall,
  // `error`'s change is invisible in every manual: 5.1 through 5.3.2 test the message with
  // `lua_isstring`, which a number satisfies, so a number message picked up position
  // information and reached the catcher as a string. 5.3.3 narrowed it to `LUA_TSTRING`.
  // That is a patch-level boundary the site cannot express (CONTEXT.md tracks minor lines),
  // so it is filed at 5.3, which is what a reader on any 5.3 build shipped since 2015 sees.
  // The manual's own move — "if the message is a string" appearing at 5.2 — is *not* the
  // change: 5.1's code already had the test, less strictly.
  'globals.error': globalsError,
  // `assert` stops formatting its message at 5.3, where `luaB_assert` starts delegating to
  // `luaB_error` instead of calling `luaL_error` on a `luaL_optstring`. Before that the
  // message had to be a string or a number; a table was refused as a bad argument, which is
  // a different failure from the one the assertion was written to report.
  'globals.assert': globalsAssert,
  // The three loading calls. `load`'s signature is the most-moved in this section, and it
  // moved in one step: 5.1 takes a supplying function and a chunk name, full stop, and
  // `luaL_checktype(L, 1, LUA_TFUNCTION)` refuses a string outright. 5.2 rewrote
  // `luaB_load` to try `lua_tolstring` on the first argument first, and added `mode` and
  // `env` in the same release — the chunk-name argument is the one that was always there.
  // Checked argument by argument against all five passages rather than assumed to have
  // travelled together.
  'globals.load': globalsLoad,
  // `loadfile` gained `mode` and `env` at 5.2 alongside `load`, and nothing since. 5.2 §8
  // names both functions when it records that bytecode verification was dropped, and
  // points at `mode` as the guard — which is why the two arguments arrive together.
  'globals.loadfile': globalsLoadfile,
  // `dofile`'s passage is the same behaviour in all five manuals; its one delta is
  // invisible there. 5.1's `luaB_dofile` calls `lua_call`, and 5.1's `lua_yield` refuses
  // while a C call is pending, so a chunk run by `dofile` could not suspend. 5.2 switched
  // to `lua_callk` with a `dofilecont` continuation. ADR 0010 rule 3, the same shape as
  // `pcall`'s 5.2 note above, and probed on 5.3 and 5.4 from the positive side.
  'globals.dofile': globalsDofile,
  // Three unrelated functions. `select`'s *structure* is the same at every release tag from
  // v5.1 to v5.5.0 — `if (i < 0) i = n + i;` and the `1 <= i` bounds check are verbatim
  // throughout, so the negative index works in 5.1 even though only the 5.2 manual describes
  // it. That is a documentation change and not a `changed_in`, on the ruling `math.huge` set
  // for reworded passages. Exactly one line of the function did move, and it is the one
  // recorded here: `int i = luaL_checkint(L, 1)` became
  // `lua_Integer i = luaL_checkinteger(L, 1)` at v5.3.0, so from 5.3 an argument standing in
  // for a whole number has to be one where it used to be truncated. That is a language-wide
  // shift rather than a change to this function; `error` and `tonumber` record it on the same
  // reasoning, for their own numeric arguments.
  'globals.select': globalsSelect,
  // `print` carries the only Incompatibilities entry any of the three appears in — 5.4 §8.2,
  // which G1 established belongs here rather than on `tostring`. `luaB_print` opens with
  // `lua_getglobal(L, "tostring")` in 5.1, 5.2 and 5.3 and calls it once per argument; 5.4
  // and 5.5 call `luaL_tolstring` and never touch the global. `tostring` itself is unchanged
  // either way, so the fact is observable by calling *this* function and is absent from
  // `globals.tostring`. Confirmed from both sides: reassigning the global hijacks `print` on
  // a 5.3 build and does nothing on 5.4.
  'globals.print': globalsPrint,
  // The section's only arrival after 5.1. `warn` enters with 5.4 alongside `lua_warning`,
  // `lua_setwarnf` and `lua_WarnFunction`, and has not moved since — the 5.4 and 5.5 passages
  // are word-identical and `luaB_warn` is byte-identical at v5.4.0, v5.4.7 and v5.5.0. The
  // control-message protocol lives in the auxiliary library rather than the core, and its one
  // refactor between v5.4.0 and v5.4.7 — a single `warnf` reading a state integer becomes
  // three functions swapped by `lua_setwarnf` — leaves every observable answer the same.
  'globals.warn': globalsWarn,
  // The section's version minefield. The *symbol* never moves — every line has
  // `collectgarbage` — but its option strings arrive, leave, come back and change meaning,
  // and `version_removed` describes a symbol rather than a string it accepts. So every one of
  // those moves is a `changed_in`: that is the honest encoding of an option's removal, with
  // the surviving option set described undated in the prose per the removal fork's rule.
  // `"generational"` and `"incremental"` are the awkward pair — added at 5.2, dropped at 5.3
  // (5.3 §8.1 says so), back at 5.4 — which no pair of bounds could express even if bounds
  // applied to options. Deliberately *not* recorded: that these two answer with the previous
  // mode as a string, which the 5.5 passage documents and the 5.4 passage does not, because
  // `pushmode` is already there at v5.4.0 and a documentation change is not a `changed_in`.
  'globals.collectgarbage': globalsCollectgarbage,
  // Nothing to record. The passage is word-identical from 5.2 on and 5.1 differs only in
  // where it sends the reader for environments; `_G` appears in no Incompatibilities chapter
  // (all four searched). What moved underneath — per-function environments giving way to an
  // `_ENV` upvalue — is observable through `setfenv` and `load`, not through this variable,
  // whose documented behaviour (it holds the global environment, Lua never reads it back) is
  // the same on all five.
  'globals._G': globalsGlobalTable,
  // The rare entry whose *value* is the version fact. Each manual states the literal string
  // its line reports, and `lua.h` builds it from `LUA_VERSION_MAJOR` and `LUA_VERSION_MINOR`
  // only — never `LUA_VERSION_RELEASE` — so the string is fixed within a line and changes
  // exactly at one. Prose cannot carry it (no version is ever named there) and the constant
  // fork has no `<Errors>` and so no `<Since>`, which leaves `changed_in` as the instrument:
  // the entry describes the shape, the dataset pins the string per line.
  'globals._VERSION': globalsVersionString,
  // The section's removed family, and it leaves in two shapes rather than one. 5.2 §8.2 is the
  // only Incompatibilities passage any of the five appears in, and it says three different
  // things: `setfenv` and `getfenv` "were removed", `unpack` "was moved into the table library
  // and therefore must be called as `table.unpack`", and `loadstring` and `module` are
  // "deprecated". Under the ruling `math.log10` and `table.maxn` already ship — a version has
  // the symbol iff that version's manual asserts its existence, and deprecation asserts it
  // while silence does not — the first three are gone at 5.2 and the last two survive 5.2 as a
  // `changed_in` and go at 5.3, where no manual mentions them again.
  //
  // The build axis agrees everywhere except one place, and it is the one T3 already recorded:
  // 5.2's shipped makefile passes `-DLUA_COMPAT_ALL`, which switches on `LUA_COMPAT_UNPACK`,
  // `LUA_COMPAT_LOADSTRING` and `LUA_COMPAT_MODULE` — so a stock 5.2 build has the bare
  // `unpack` this dataset says it does not. 5.3 puts those three under `LUA_COMPAT_5_1` while
  // its makefile passes only `-DLUA_COMPAT_5_2`, so a stock 5.3 build has none of them, and
  // 5.4 and 5.5 have no such switch at all. `getfenv` and `setfenv` have no compatibility
  // switch in any version: environments stopped being a per-function table, so there was
  // nothing left for the pair to do.
  'globals.getfenv': globalsGetfenv,
  'globals.setfenv': globalsSetfenv,
  'globals.unpack': globalsUnpack,
  'globals.loadstring': globalsLoadstring,
  'globals.module': globalsModule,
  // The one global that is really an interface to the `package` library, and the section's
  // only entry whose *arity* moved: `ll_require` in `loadlib.c` is `return 1` at v5.1 through
  // v5.3.6 and `return 2` from v5.4.0, handing back the searcher's loader data beside the
  // module's value — and `return 1` still, from the already-loaded branch, which is what the
  // 5.4 manual's parenthesis about "the absence of a second result" is describing. The 5.2
  // rename is the one fact a manual states outright (5.2 §8.2, `package.loaders` →
  // `package.searchers`); the loop marker that went with it is source-only, from the sentinel
  // v5.1's `ll_require` writes into `_LOADED[name]` before running the loader and no later
  // version has. What did *not* change is the storage rule: 5.1's manual says "any value"
  // where 5.2's says "any non-nil value", and both implementations test `!lua_isnil`.
  //
  // The C searcher's versioned-name rule belongs to **5.2, not 5.3**, and the 5.3
  // Incompatibilities entry that describes it says so itself — "(Lua 5.2 already worked that
  // way, but it did not document the change.)" `loadfunc` takes the part before the first
  // hyphen and falls back to the part after it on `ERRFUNC` at every tag from v5.2.0 to
  // v5.5.1; the whole 5.1 line, including the shipped 5.1.5, has `mkfuncname` with a bare
  // `if (mark) modname = mark + 1;` and no fallback. A `changed_in` at 5.3 was drafted here
  // and is false for 5.2 — the note is dated where the behaviour moved, not where a manual
  // caught up with it.
  'globals.require': globalsRequire,
  // The section's own node, on the shape `string.library` set and `table.library` and
  // `math.library` followed: the section's existence and its *membership*, never the union
  // of its members' behaviour. Derived from the member datasets and then checked against the
  // manuals independently, by listing every `pdf-` anchor carrying no library prefix in each
  // of the five. Two things about it are worth recording. The 5.2 note says `unpack` was
  // *moved* rather than dropped, because 5.2 §8.2 says exactly that and a reader who has
  // just read "drops" would go looking for a replacement that is sitting under a prefix.
  // And there is no 5.5 note: nothing joins or leaves the section there, even though several
  // members change what they accept.
  'globals.library': globalsLibrary,
  // The `coroutine` section, keyed on the library prefix the manual itself uses
  // (`pdf-coroutine.create`), like `string.*`, `table.*` and `math.*`. `globals.*` is the
  // odd one out only because a global carries no prefix in the manual at all.
  //
  // All three are present from 5.1 and none is named in any Incompatibilities chapter —
  // the only coroutine entries in all four are C API signature changes (`lua_resume` gains
  // `from` at 5.2 and an out parameter at 5.4; `lua_resetthread` is deprecated at 5.5).
  // What did move is where a yield is allowed *from*, and it moved once, at 5.2. The 5.1
  // manual's `coroutine.yield` passage states the restriction outright — a coroutine may
  // not be running a C function, a metamethod or an iterator — and 5.2 drops that sentence
  // and documents the narrower C-API rule in its place (5.2 §4.7: an error whenever Lua
  // tries to yield across an API call, bar `lua_yieldk`, `lua_callk` and `lua_pcallk`).
  // A dropped sentence is not on its own a behaviour change, on the ruling `math.huge`
  // set, so it is corroborated from the source: `luaV_finishOp` does not exist in 5.1 and
  // arrives in v5.2.0's `lvm.c` handling `OP_TFORCALL`, `OP_CALL` and the metamethod-bearing
  // opcodes, and `luaB_pcall`/`luaB_xpcall` switch from `lua_pcall` to `lua_pcallk` with a
  // continuation in the same release. That is the same fact `globals.pcall` records from
  // the protected-call side, dated identically.
  //
  // The fact is carried on **both** `yield` and `resume` because it is observable from
  // either side: the body refuses on 5.1, and the resume that started it therefore comes
  // back `false`. It is deliberately absent from `create`, which runs nothing.
  //
  // `create`'s own note is the one place the manual and the code disagree. Every 5.1 and
  // 5.2 passage says `f` "must be a Lua function" and 5.3 onwards says "must be a
  // function", but 5.1's `luaB_cocreate` is the only one that enforces the stronger claim
  // (`lua_isfunction(L, 1) && !lua_iscfunction(L, 1)`); v5.2.0 and 5.2.4 already spell it
  // `luaL_checktype(L, 1, LUA_TFUNCTION)`, which a C function satisfies. The note is dated
  // where the behaviour moved rather than where the manual caught up, on the ruling
  // `globals.require` set for exactly this shape.
  //
  // What has *not* changed, checked rather than assumed: a comparison handed to
  // `table.sort` is invoked with a bare `lua_call` at v5.2.0 and v5.3.0 as well as later,
  // so that barrier stands on every line; and a coroutine's stack being left standing
  // rather than unwound after a failure is documented on `lua_resume` from 5.1 onwards,
  // which makes 5.4 §2.6 restating it in the Lua-level chapter a documentation move and
  // not a `changed_in`.
  'coroutine.create': coroutineCreate,
  'coroutine.resume': coroutineResume,
  'coroutine.yield': coroutineYield,
  // The three that report on a coroutine rather than drive one. `status` is the flat
  // one: `luaB_costatus` is behaviourally identical at 5.1.5, v5.2.0, 5.2.4, v5.3.0,
  // 5.3.6, v5.4.0, 5.4.8 and v5.5.0 — the same four strings in the same four
  // situations, and a type check on the argument that raises in every version. The
  // 5.4 manual rewrites the `"running"` clause ("it called status" becomes "it is the
  // one that called status") and 5.3 rewrites the library preamble; neither is a
  // behaviour change, on the ruling `math.huge` set. So its node is availability and
  // nothing else, and no matrix renders on the page.
  //
  // `running` is the section's real version fact and it moved once. 5.1's
  // `luaB_corunning` lives in `lbaselib.c` and is `if (lua_pushthread(L))
  // lua_pushnil(L); return 1;` — one value, and `nil` on the main thread, which it
  // declines to treat as a coroutine ("main thread is not a coroutine", its own
  // comment). From v5.2.0 onwards `lcorolib.c` has `int ismain = lua_pushthread(L);
  // lua_pushboolean(L, ismain); return 2;`, byte-identical at every tag through
  // v5.5.0 — two values, a thread in every case including the main one, and a boolean
  // whose polarity is *is this the main one*, not *is this a coroutine*. Both halves
  // of the change are observable from Lua and both are in the note: the count, and
  // what the main line of execution gets. Neither the count nor the main-thread answer
  // can be shown by a card here, because the harness runs every card inside a
  // coroutine — see the authoring context — so both live in prose, in the dataset, and
  // in a `<Only>`-scoped `<Return>` pair.
  //
  // `isyieldable` is a pure arrival at 5.3 with one later change. 5.3's
  // `luaB_yieldable` reads no argument at all (`lua_isyieldable(L)`); v5.4.0's is
  // `lua_isnone(L, 1) ? L : getco(L)` and v5.5.0's spells the same thing as
  // `getoptco`. So the optional argument is 5.4, and with it the argument check that
  // raises — before it, a value passed to this call is silently ignored. What it
  // reports never changed: the manual's rule ("not the main thread and not inside a
  // non-yieldable C function") is word-identical in all three versions that have it.
  //
  // None of the three is named in any Incompatibilities chapter; all four were read in
  // full. The only coroutine-adjacent entries there are C API signature changes, as
  // C1 already recorded.
  'coroutine.status': coroutineStatus,
  'coroutine.running': coroutineRunning,
  'coroutine.isyieldable': coroutineIsyieldable,
  // The two that close the section, and the section node itself.
  //
  // `wrap` carries four notes because four separate things about it moved, and two of
  // them are shared with entries above. Its body goes through `luaB_cocreate`, so
  // `create`'s 5.2 relaxation (a C function is accepted) is observable here too; and a
  // 5.1 body that yields from inside a protected call, a metamethod or a generic `for`
  // iterator makes the *wrapper* raise rather than return, which is `yield`'s 5.2 fact
  // seen from a third side. The two that belong to `wrap` alone are both in
  // `luaB_auxwrap`:
  //
  //   * The position-info guard. 5.1.5, v5.2.0 and 5.2.4 test the error object with
  //     `lua_isstring`, which is true for a **number** as well as a string, so a number
  //     raised inside a wrapped coroutine is concatenated with `luaL_where(L, 1)` and
  //     reaches the caller as a *string*. From `lua_type(L, -1) == LUA_TSTRING` onwards
  //     a number travels through as a number. That spelling arrives at **v5.3.3**, not
  //     at a minor-line edge — v5.3.0 through v5.3.2 still have `lua_isstring` — so the
  //     note is dated 5.3 on the standing ruling that a line is credited with what its
  //     final release (5.3.6) has, and the patch boundary is recorded in the C3 report.
  //   * Closing on failure. v5.4.0 adds `lua_resetthread(co)` before the error is
  //     re-raised, spelled `lua_closethread(co, L)` from 5.4.8; the 5.4 manual records
  //     it in the entry passage ("the function closes the coroutine and propagates the
  //     error") and in §3.3.8, and 5.1–5.3 say only that the error is propagated.
  //
  // What did *not* change on `wrap`, checked rather than assumed: the position of the
  // call to the wrapper is prepended to a string error object at every release read,
  // 5.1.5 through v5.5.0; and a wrapper whose coroutine has nothing left to run raises
  // in every version — 5.1's `auxresume` refuses any non-suspended coroutine itself,
  // 5.2/5.3's test for a dead one and leave the rest to `lua_resume`, and 5.4/5.5 leave
  // all of it to `lua_resume`'s `resume_error`, but the wrapper has no status to report
  // through and raises whichever route the refusal took.
  //
  // `close` arrives at **5.4** — `passage.py pdf-coroutine.close` reports `absent` for
  // 5.1, 5.2 and 5.3, and `luaB_close` first appears in v5.4.0's `lcorolib.c`. Its 5.5
  // note carries three things at once because they are one edit to `luaB_close`:
  // `getco` becomes `getoptco` (the argument is now optional), the `COS_RUN` case stops
  // raising and calls `lua_closethread(co, L)`, which does not return, and a separate
  // `LUA_RIDX_MAINTHREAD` test keeps the main line of execution refused. 5.4's `default:`
  // arm raises for *both* `normal` and `running`, so on that line the coroutine making
  // the call is refused like any other.
  //
  // The `false` path is where 5.4's own releases disagree. v5.4.0's `lua_resetthread`
  // starts the close from `CLOSEPROTECT` rather than from the thread's own status, so
  // closing a coroutine that stopped with an error returns `true` and the error is never
  // handed back; 5.4.8's `lua_closethread` passes `L->status` into `luaE_resetthread`,
  // which returns it, so the same call returns `false` plus the original error object —
  // which is what the 5.4 manual describes. Credited to 5.4 on the final-release ruling;
  // probed on the runtime (5.4.x) and it answers `false` plus the object.
  //
  // Neither `wrap` nor `close` is named in any Incompatibilities chapter. All four were
  // read in full, sliced from `<a name="8">` to end of file. 5.5 §8.1's "In an error, a
  // nil as the error object is replaced by a string message" is the one entry that
  // reaches either of them, and it reaches both — `luaG_errormsg` in v5.5.0's `ldebug.c`
  // is a single funnel with no counterpart at v5.4.8, so it is the same fact
  // `globals.error`, `globals.pcall`, `globals.xpcall`, `globals.assert` and
  // `coroutine.resume` already carry, recorded here from two more sides.
  //
  // `coroutine.library` records membership and nothing else, like the other section
  // nodes. Derived from `co_funcs[]` at 5.1.5, v5.2.0, 5.2.4, v5.3.0, 5.3.6, v5.4.0,
  // 5.4.8 and v5.5.0 and checked against each manual's Coroutine Manipulation section
  // (§5.2 in 5.1, §6.2 in 5.2–5.4, §6.3 in 5.5): six names in 5.1 and 5.2, `isyieldable`
  // added at 5.3, `close` added at 5.4, nothing at 5.5. Nothing has ever left, which is
  // why there is no removal note and no legacy group on the overview.
  'coroutine.wrap': coroutineWrap,
  'coroutine.close': coroutineClose,
  'coroutine.library': coroutineLibrary,

  // The `os` section, keyed on the manual's own prefix (`pdf-os.time`). Operating System
  // Facilities is **§5.8 in 5.1, §6.9 in 5.2, 5.3 and 5.4, and §6.10 in 5.5** — the
  // number moves twice, so `sect.py` needs the right one per version.
  //
  // All three of `time`, `date` and `difftime` are present in every line, and **none of
  // them is named in any Incompatibilities chapter** — 5.2, 5.3, 5.4 and 5.5's §8 were
  // sliced from `<a name="8">` to end of file and searched; the only `os` entry in any of
  // them is `os.execute`'s changed return at 5.2, which belongs to that entry.
  //
  // Almost every delta the three carry is invisible in the manual and was established
  // from `loslib.c`, read at v5.1.1, 5.1.5, v5.2.3, 5.2.4, v5.3.0, v5.3.2, v5.3.6,
  // v5.4.0, v5.4.8 and v5.5.0 and diffed pairwise:
  //
  //   * The **invalid-conversion raise** on `os.date` arrives at 5.2, where `checkoption`
  //     first appears. 5.1 hands each `%` and the character after it straight to
  //     `strftime`. The accepted set is `LUA_STRFTIMEOPTIONS`, chosen at build time and
  //     overridable by an embedder, so no version can be credited with a fixed list; the
  //     C89 core (`a A b B c d H I j m M p S U w W x X y Y %`) is in every shipped
  //     configuration of every line, and `%F`, `%T`, `%z`, `%Z` and the `%E`/`%O` forms
  //     are not. The entry states the mechanism and the portable core rather than
  //     inventing a per-version list, since the manual defers to `strftime` throughout.
  //   * **`l_checktime` arrives at 5.3** and takes `luaL_checkinteger`, which is what
  //     makes `os.date`'s `time` and both of `os.difftime`'s arguments integers-only from
  //     there. 5.1 and 5.2 use `luaL_checknumber` and truncate.
  //   * **`os.difftime`'s `t1` was optional** — `luaL_optnumber(L, 2, 0)` at 5.1.5 and
  //     5.2.4 — and became required at 5.3.
  //   * **`os.time` and `os.date` stopped answering `nil` on failure at 5.3.2**, and
  //     **`os.time` began normalising its table in place at 5.3.3** (`setallfields`),
  //     along with the `field '%s' is not an integer` and `is out-of-bound` checks. Both
  //     are credited to 5.3 under the standing ruling that a line is credited with what
  //     its final release has — 5.3.6 is what `lua.org/source/5.3` serves — and the patch
  //     boundaries are recorded in `task-O1-report.md`. The 5.3 manual documents none of
  //     this; the normalisation is documented only from 5.4, which is a documentation
  //     change and not a behaviour one.
  //   * 5.4 and 5.5 are **behaviourally identical** for all three. The only edits between
  //     them are an error message's wording, `LUA_NUMTIME`, and internal casts.
  //
  // What did *not* change, despite reading as though it did: the required fields, the
  // `hour = 12` / `min = 0` / `sec = 0` defaults (present in 5.1's C, documented only
  // from 5.2), out-of-range fields being taken as offsets (in 5.1's C, documented only
  // from 5.3), other keys being ignored, the `!` prefix, the `*t` form and its nine
  // fields, and `os.difftime` answering with a float on every line.
  'os.time': osTime,
  'os.date': osDate,
  'os.difftime': osDifftime,

  // `os.clock`, `os.getenv` and `os.tmpname` carry **no `changed_in` at all**, and that is
  // a result rather than an omission. `os_clock`, `os_getenv` and `os_tmpname` are
  // byte-for-byte identical in `loslib.c` at v5.1.1, 5.1.5, v5.2.3, 5.2.4, v5.3.0, v5.3.6,
  // v5.4.0, v5.4.8 and v5.5.0, apart from an `l_unlikely` annotation on `os_tmpname`'s
  // error branch from 5.4 — a branch-prediction hint with no observable effect. Each has
  // exactly one `return 1;`, so none of them is the green-and-wrong arity hazard
  // `os.execute` is. None is named in any Incompatibilities chapter (5.2, 5.3, 5.4 and
  // 5.5's §8 sliced to end of file and searched).
  //
  // Three manual edits *look* like deltas and are documentation catching up with code
  // that had not moved:
  //
  //   * **`os.clock`** gains "as returned by the underlying ISO C function `clock`" at
  //     5.4. The implementation has been `clock() / CLOCKS_PER_SEC` since 5.1; the added
  //     clause names the C function the manual was already deferring to. No version
  //     documents where the count starts from, which is why the entry says so rather than
  //     promising seconds-since-program-start.
  //   * **`os.getenv`** changes "or `nil` if the variable is not defined" to "or *fail* if
  //     the variable is not defined" at 5.4, where §6 introduces *fail* as "a false value
  //     representing some kind of failure. (Currently, fail is equal to nil…)". The C is
  //     `lua_pushstring(L, getenv(...))`, which pushes `nil` for a `NULL` in every
  //     release. So the *promise* loosened and the behaviour did not; a `changed_in` here
  //     would mark 5.4 "Changed" on four surfaces for a function that did not change. The
  //     entry states the falsity reading as advice instead, undated.
  //   * **`os.tmpname`** says "On some systems (POSIX)" in 5.1 and "On/In POSIX systems"
  //     from 5.2. Wording only: `lua_tmpnam` is `mkstemp` under `LUA_USE_MKSTEMP` (5.1's
  //     `luaconf.h`, 5.2's `loslib.c`) or `LUA_USE_POSIX` (5.3+), and plain `tmpnam`
  //     otherwise, in every release. Whether a file exists at the name is therefore a
  //     build-and-platform fact and never a version one, which is why the entry splits it
  //     by system rather than by line.
  'os.clock': osClock,
  'os.getenv': osGetenv,
  'os.tmpname': osTmpname,

  // The four that reach past Lua into the machine. `os.execute` is the section's one real
  // arity change and the only `os` symbol named in any Incompatibilities chapter — 5.2 §8.2,
  // "Function `os.execute` now returns true when command terminates successfully and nil plus
  // error information otherwise". All four `loslib.c` bodies were read at v5.1.1, 5.1.5,
  // v5.2.3, 5.2.4, v5.3.0, v5.3.2, v5.3.6, v5.4.0, v5.4.8 and v5.5.0, and `lauxlib.c`'s
  // `luaL_fileresult` and `luaL_execresult` beside them, since three of the four hand their
  // whole answer to one of those two helpers.
  //
  //   * **`os.execute`** is `lua_pushinteger(L, system(cmd)); return 1;` in the whole 5.1
  //     line — **one value in both forms of the call**, and with no command that value is a
  //     *number* (nonzero when a shell is available), not a boolean. From v5.2.0 the body
  //     splits: with a command it is `luaL_execresult(L, stat)`, which returns **3** on every
  //     path, and with no command `lua_pushboolean(L, stat); return 1;`. So the count changes
  //     for a command and the *type* changes for the no-command form, and both halves are in
  //     the note. Nothing moved after 5.2: v5.4.0 added `errno = 0` before the call and
  //     **v5.4.5** routed it through an `l_system` macro (so that a build with no `system`,
  //     iOS being the shipped case, can substitute one) — neither changes what any line
  //     answers, and v5.4.0 through v5.4.4 call `system` directly.
  //     `luaL_execresult`'s own edit at 5.4 — `stat == -1` becomes `stat != 0 && errno != 0`
  //     for the could-not-be-started branch — changes only which failures take that branch,
  //     and both lines take it in the same situations a Lua program can produce, so it is
  //     recorded nowhere. The **manual describes only two of the four answers**: it gives
  //     `"exit"` and `"signal"` and never mentions that the could-not-be-started branch puts
  //     the system's message and error code in those same two positions. That gap is closed in
  //     the entry's prose rather than in a note, because it is true of every version that has
  //     the three-value shape.
  //   * **`os.exit`** moved twice. 5.1 is `exit(luaL_optint(L, 1, EXIT_SUCCESS))` — a number
  //     or a numeric string, and a boolean raises; there is no second argument, and a value
  //     passed in that position is read by nothing. v5.2.0 adds the `lua_isboolean` branch and
  //     `if (lua_toboolean(L, 2)) lua_close(L);`. v5.3.0 changes `luaL_optint` to
  //     `(int)luaL_optinteger`, which is the language-wide tightening `globals.select` and
  //     `os.time` record for their own numeric arguments: a fraction used to be truncated and
  //     now raises. Nothing has moved since — v5.3.0 through v5.5.0 are byte-identical here.
  //     `close` is never type-checked in any version, only read for its truth.
  //   * **`os.remove` and `os.rename` never changed what they answer with**, on any line, and
  //     this is the batch's reversal: every manual reads as though they did. 5.1's own
  //     `os_pushresult` already pushes `true` on success and **three** values on failure —
  //     `nil`, `"%s: %s"` of the name and the system's message, and `errno` — which is exactly
  //     what `luaL_fileresult` does from 5.2 on. The 5.1 manual mentions only `nil` and a
  //     string, 5.2 adds "and the error code", and 5.3 adds "Otherwise, it returns true": three
  //     manual edits, no behaviour change, on the ruling `math.huge` set. `fail` replacing
  //     `nil` at 5.4 is the same non-event `os.getenv` already records.
  //   * The one thing that *did* move is **`os.rename`'s message**. 5.1.1 and 5.1.5 pass
  //     `fromname` to `os_pushresult`, so the message is the old name, a colon and the
  //     system's description; the call becomes `luaL_fileresult(L, ..., NULL)` and the
  //     description arrives alone. That edit lands at **v5.2.2**, not at the line's edge —
  //     v5.2.0 and v5.2.1 still pass `fromname` — so the note is dated 5.2 on the standing
  //     ruling that a line is credited with what its final release has, 5.2.4 being what
  //     `lua.org/source/5.2` serves. `os_remove` keeps passing `filename` at every release,
  //     so its message names the file on all five lines and it carries no note. No manual
  //     states either half. Probed on the runtime: `os.remove` answers
  //     `"…-not-here.txt: No such file or directory"` and `os.rename` answers
  //     `"No such file or directory"`.
  //
  // What the manual says about **directories** narrowed without the code moving: 5.1 promises
  // `os.remove` deletes "the file or directory" and that directories must be empty; from 5.2 it
  // is "the file (or empty directory, on POSIX systems)". The implementation is ISO C `remove`
  // in every release, so 5.1's manual was over-broad rather than describing a different call —
  // a documentation change, recorded nowhere, with the entry stating the POSIX-scoped version.
  // `os.rename`'s passage says "file or directory" unqualified in all five.
  //
  // Neither `os.exit`, `os.remove` nor `os.rename` appears in any Incompatibilities chapter;
  // all four were sliced from `<a name="8">` to end of file and searched for each name.
  //
  // One more patch-level residual, recorded because minor-line granularity cannot hold it:
  // `os_remove` and `os_rename` gain an `errno = 0;` line before the call at **v5.4.7**
  // (v5.4.0 through v5.4.6 do not have it), and v5.4.8's `luaL_fileresult` then reports
  // `"(no extra info)"` with code `0` where a failure left `errno` unset. Both lines of 5.4
  // are credited with 5.4.8's behaviour under the same ruling.
  'os.execute': osExecute,
  'os.exit': osExit,
  'os.remove': osRemove,
  'os.rename': osRename,

  // `os.setlocale` closes the section, and the surprise is that the function itself has
  // **never moved**: `os_setlocale` is byte-for-byte identical at v5.1.1, 5.1.5, v5.2.3,
  // 5.2.4, v5.3.0, v5.3.6, v5.4.0, v5.4.8 and v5.5.0 — `luaL_optstring(L, 1, NULL)`,
  // `luaL_checkoption(L, 2, "all", catnames)`, `lua_pushstring(L, setlocale(cat[op], l))`,
  // one `return 1;`. The six category names are the same six in every manual and in every
  // release, and the manual's own text moves only twice, neither time behaviourally:
  //
  //   * 5.2 adds "system-dependent" to the description of `locale`, and adds the
  //     "may be not thread safe" disclosure — the same non-event `os.date` and `os.time`
  //     record for `gmtime`/`localtime`.
  //   * 5.4 retypes the failing answer from `nil` to *fail*, which is the `os.getenv`
  //     non-event O2 ruled on: `lua_pushstring` with a `NULL` pushes `nil` in every release.
  //
  // The one dated fact is **not about this call at all** — it is about what a locale
  // reaches, and it is recorded here because this entry is the only place in the section
  // where a reader can observe it. From 5.3, `l_str2d` retries a failed conversion with the
  // locale's own radix character (`lua_getlocaledecpoint`), so a string→number conversion
  // accepts a dot *and* the locale's mark; 5.1 and 5.2 hand the text to `strtod` once and
  // take only the mark. 5.3's manual states it in §3.4.3 ("All conversions from strings to
  // numbers accept both a dot and the current locale mark as the radix character. (The Lua
  // lexer, however, accepts only a dot.)") and 5.1's and 5.2's do not.
  //
  // **Patch residual:** the compensation is absent from v5.3.0 and arrives at **v5.3.1**;
  // the lexer's own `trydecpoint`/`decpoint` machinery is still there at v5.3.1 and gone by
  // v5.3.6. `lua.org/source/5.3` serves 5.3.6, so 5.3 as this site means it has the new
  // behaviour and the note is correct at minor-line granularity.
  //
  // Verified across all five shipped lines (5.1.5, 5.2.4, 5.3.6, 5.4.8, 5.5.0) that
  // `setlocale()` is called from `os_setlocale` and nowhere else, and that the only
  // `localeconv()` use reads `decimal_point` — so nothing in the library reads the monetary
  // category, and nothing but this call moves the locale.
  'os.setlocale': osSetlocale,

  // The section overview. Membership records nothing, because **`os` never gained or lost a
  // member**: `grep -o 'pdf-os\.[a-z]*'` over all five manuals returns the same eleven
  // functions every time, so there is no `changed_in` to write and no matrix renders on the
  // overview. That is a result rather than an omission — it makes `os` the first section
  // whose front door is version-invariant while seven of its eleven entries are not.
  'os.library': osLibrary,

  // The `io` section opens here, and it opens with the pair that decides the section's
  // shape: `io.close` and `file:close` are two entries for one operation, and `io.type` is
  // the function that tells an open handle from a closed one. `liolib.c` was read at the
  // **repo root** for every tag in every line — v5.1, v5.1.1, v5.2.0 through v5.2.3, v5.3.0
  // through v5.3.6, v5.4.0 through v5.4.8, v5.5.0 and v5.5.1 — plus the two shipped releases
  // that have no tag, 5.1.5 and 5.2.4, from `www.lua.org/source/5.1` and `/5.2`. Every
  // function body was extracted per release and diffed rather than read by eye, and
  // `lauxlib.c`'s `luaL_fileresult` and `luaL_execresult` beside them.
  //
  //   * **`io.open` never changed what it answers with.** 5.1.5's `pushresult(L, 0, filename)`
  //     already pushes **three** values on the failing path — `nil`, `"%s: %s"` of the name and
  //     the system's description, and `errno` — which is exactly `luaL_fileresult`'s answer
  //     from v5.2.0 to v5.5.1, and one value on the way out when it worked. The 5.1 and 5.2
  //     manuals say only "nil plus an error message"; 5.3 drops the sentence and leaves the
  //     library preamble's three-value rule to cover it. Documentation catching up with code
  //     that had not moved, on the ruling `math.huge` set — no note.
  //   * What **did** move is the mode check. 5.1 has none: `fopen(filename, mode)` gets the
  //     string as written, which is why 5.1's manual adds "This string is exactly what is used
  //     in the standard C function `fopen`" and 5.2's drops that sentence. **v5.2.0** rejects
  //     anything not matching `[rwa]%+?b?`. v5.2.0 and v5.2.1 raise through `luaL_error`,
  //     v5.2.2 onwards through `luaL_argcheck`; both raise, so the note is dated 5.2 either
  //     way. The `b` comes *after* the `+`, which makes Lua's set a strict subset of C's:
  //     `"rb+"` is a valid `fopen` mode and is refused. Probed on the runtime: `"r+b"` opens,
  //     `"rb+"`, `"rt"` and `""` raise `invalid mode`.
  //
  //     **The check then moved again, at v5.3.2**, and the entry must not enumerate a closed
  //     set because of it. The `%+?b?` tail became
  //     `strspn(mode, L_MODEEXT) == strlen(mode)` with `L_MODEEXT` defined as `"b"` — so **any
  //     number of trailing `b`s is accepted**, and, because both `L_MODEEXT` and `l_checkmode`
  //     sit behind `#if !defined`, the extension letters are a compile-time setting a build may
  //     widen. v5.2.4, v5.3.0 and v5.3.1 still have the single-`b` form; v5.3.2 through v5.5.1
  //     have the `strspn` form (a macro until v5.3.5, a static function from v5.3.6). Probed on
  //     the 5.4 runtime: `"rbb"`, `"rbbb"`, `"r+bb"`, `"wbb"`, `"abb"` and `"a+bb"` all open,
  //     while `"rb+"`, `"bb"`, `"rt"`, `"r+t"` and `"rbt"` all raise. **No `changed_in` at 5.3:**
  //     the behaviour is worthless to a real program and dating it would put a *Changed* chip on
  //     the strip for `"rbb"`. What it does forbid is any claim that the six spellings plus one
  //     `b` are *all* a version accepts, which the first draft of this entry made in two places.
  //
  //     **Why this was missed the first time round, because it generalises:** the batch
  //     extracted ten *function bodies* per release and diffed them mechanically. The mode check
  //     is a **macro** through v5.3.5, so the diff never saw it, and `io_open`'s own body reads
  //     identically either side of the change — only the spelling of the macro's name moves
  //     (`lua_checkmode` → `l_checkmode` at 5.3). A per-release diff of whole files, or of the
  //     `#if !defined(...)` blocks, is what catches this class.
  //   * **The 5.4 note is about the handle, not the call.** `metameth` first appears at
  //     v5.4.0 with `{"__close", f_gc}` beside `{"__gc", f_gc}`; 5.1 through 5.3 register
  //     `__gc` alone. The 5.4 and 5.5 library preambles say so outright — "The metatable for
  //     file handles provides metamethods for `__gc` and `__close`" — where 5.1 to 5.3 say
  //     nothing about either, though `io_gc`/`f_gc` is in every release. So the finalizer is
  //     a non-event and `__close` is the delta, recorded on `io.open` because that is where a
  //     reader meets the handle. Probed: `local scoped <close> = io.open(path)` reads
  //     `"file"` inside the block and `"closed file"` after it. **A grep trap:** 5.1.5's
  //     `liolib.c` contains the string `"__close"` three times, and none of them is a
  //     metamethod — 5.1 keeps each handle's closing C function in a field of that name in the
  //     handle's *environment*, which `aux_close` reads. It has nothing to do with
  //     to-be-closed variables, which the language does not have before 5.4.
  //   * **`io.close` and `file:close` are one operation in every version.** Through 5.3 they
  //     are literally the same C function: `io_close` is registered in `iolib` *and* as
  //     `flib`'s `"close"`. **v5.3.5** splits `f_close` out, and `io_close` becomes
  //     `if (lua_isnone(L, 1)) get default output; return f_close(L);` — a refactor, not a
  //     behaviour change, and it lands inside the 5.3 line rather than at 5.4. The default is
  //     the default *output* file in all five (`LUA_ENVIRONINDEX`'s `IO_OUTPUT` slot in 5.1, a
  //     registry field from 5.2), and `tofile` raises `attempt to use a closed file` before
  //     anything else happens, so a second close raises on every line.
  //   * The one dated fact on `io.close` is the **`io.popen` handle**. 5.1's `io_pclose` is
  //     `pushresult(L, lua_pclose(L, *p), NULL)` with `lua_pclose` defined as
  //     `(pclose(file) != -1)` — so the answer is `true` whenever the close itself went
  //     through, whatever status the program exited with, and `nil` plus a message and `errno`
  //     when it did not. From **v5.2.0** it is `luaL_execresult(L, ...)`, the same three values
  //     `os.execute` gained in the same release and the same ones its Incompatibilities entry
  //     describes. The 5.2 manual adds the matching sentence to `file:close`'s passage and 5.1
  //     has none. Recorded here as well as there because it is observable through this call.
  //   * **Refusing to close a standard handle is not a raise**, on any line: `io_noclose`
  //     pushes `nil` and the literal `cannot close standard file` and returns **2**, and the
  //     handle stays open. `luaL_pushfail` replaces `lua_pushnil` at 5.4 and is `lua_pushnil`
  //     in a stock build (`LUA_FAILISFALSE` is off), which is the `os.getenv` non-event again.
  //     **Patch residual:** v5.1 and v5.1.1 have no `io_noclose` at all — their standard
  //     handles close like any other file, guarded only in `io_gc` — and it arrives inside the
  //     5.1 line, by 5.1.5. `lua.org/source/5.1` serves 5.1.5, so 5.1 as this site means it
  //     refuses, and the residual is recorded here rather than in the dataset.
  //   * **`io.type` has not moved at all.** `luaL_checkany` in every release, so no argument
  //     raises and `nil` is answered; the metatable test is `lua_getmetatable` plus
  //     `lua_rawequal` in 5.1 and `luaL_testudata` from v5.2.0, which is the same question
  //     asked through a helper; the three answers are `"file"`, `"closed file"` and `nil` in
  //     all five. `fail` for the third from 5.4 is the same non-event. Its node is
  //     availability and nothing else, which keeps the matrix off a page where nothing varies.
  //
  // Nothing about `io.open`, `io.close`, `io.type` or `file:close` appears in **any**
  // Incompatibilities chapter: 5.2, 5.3, 5.4 and 5.5's §8 were sliced from `<a name="8">` to
  // end of file and searched. The only `io` hits in four chapters are `io.read`'s dropped
  // `*` at 5.3 and `io.lines` returning four values at 5.4, which belong to I2 and I4.
  //
  // Two things found here that belong to later `io` batches rather than to these three, so that
  // nobody has to find them twice. **`__close` enters at v5.4.0 on the *handle*, not on
  // `io.open`**, so it is observable through every call that hands one back — `io.tmpfile`,
  // `io.popen`, `io.input` and `io.output` when they answer with a handle, and the three
  // standard handles. Each of those nodes wants the same 5.4 note `io.open` carries.
  // And **`io.popen` gained a mode check of its own inside the 5.4 line**: `l_checkmodep`
  // ("Windows accepts `[rw][bt]?` as valid modes") is absent at v5.4.0, arrives at **v5.4.1**
  // and is extended at v5.4.3. Before it, `io.popen`'s `mode` reached the system unchecked, so
  // that entry has a 5.4-versus-earlier story of the same shape as `io.open`'s 5.2 one — and it
  // is a *macro*, so a function-body diff will not show it.
  //
  // One more patch residual, recorded because minor-line granularity cannot hold it: `io_open`
  // and `io_fclose` gain an `errno = 0;` line before the call at **v5.4.7**, and v5.4.8's
  // `luaL_fileresult` then reports `"(no extra info)"` with code `0` where a failure left
  // `errno` unset. Both halves of the 5.4 line are credited with v5.4.8's behaviour.
  'io.open': ioOpen,
  'io.close': ioClose,
  'io.type': ioType,

  // The read formats, which are the `io` section's sharpest version hazard and the reason
  // no entry before this one was allowed to spell one. `file:read` and `io.read` are the
  // **same C function on two files**: `f_read` is `g_read(L, tofile(L), 2)` and `io_read` is
  // `g_read(L, getiofile(L, IO_INPUT), 1)`, byte-identical at every release read, so the two
  // datasets carry the same two notes and every fact below holds for both.
  //
  // `liolib.c` read at the **repo root** for every tag in every line — v5.1, v5.1.1, v5.2.0
  // through v5.2.3, v5.3.0 through v5.3.6, v5.4.0 through v5.4.8, v5.5.0 and v5.5.1 — plus
  // the two shipped releases with no tag, 5.1.5 and 5.2.4, from `www.lua.org/source/5.1` and
  // `/5.2` (the *minor* line; `/source/5.1.5/` is a 404). `g_read`, `read_number`,
  // `read_line`, `read_all`, `read_chars`, `test_eof`, `nextc`, `test2` and `readdigits`
  // were extracted per release and diffed pairwise rather than read by eye.
  //
  //   * **The format set, from `g_read`'s own dispatch, at every tag in every line:**
  //     5.1 requires the star (`luaL_argcheck(L, p && p[0] == '*', n, "invalid option")`) and
  //     switches on `p[1]` with cases `'n'`, `'l'`, `'a'` — **no `'L'`**. 5.2 is the same
  //     check with `'L'` added. **v5.3.0** replaces it with `luaL_checkstring` plus
  //     `if (*p == '*') p++;  /* skip optional '*' (for compatibility) */`, and that line is
  //     unchanged through v5.5.1. So the bare spellings are **5.3 and later** and `"*a"` runs
  //     on all five, which no guard can see: the 5.4 runtime every example executes on
  //     accepts both. 5.3 §8.2 states the star half — "Option names in `io.read` do not have
  //     a starting `*` anymore. For compatibility, Lua will continue to accept (and ignore)
  //     this character" — and is the **only** `read` hit in any Incompatibilities chapter;
  //     `"*L"`'s arrival is an addition and appears in none of them.
  //   * **The numeral format changed engine at 5.3.** 5.1 and 5.2 are
  //     `fscanf(f, LUA_NUMBER_SCAN, &d)` with `LUA_NUMBER_SCAN` defined as `"%lf"` in both
  //     `luaconf.h`s and `lua_pushnumber` after it, so the C library decides what counts as a
  //     numeral and the answer is always a float. **v5.3.0** introduces the `RN` scanner —
  //     skip spaces, optional sign, optional `0x`, digits, radix mark, exponent — and hands
  //     the collected run to `lua_stringtonumber`, so the reading is Lua's own and the answer
  //     is an integer or a float. Probed: a run that turns out not to spell a numeral
  //     (`3.4e-`) is discarded and its characters are gone, while text that never looked
  //     numeric costs **only the whitespace in front of it** — the skip loop
  //     `do { rn.c = l_getc(rn.f); } while (isspace(rn.c));` consumes it and only the one
  //     lookahead character is ungot. Probed: `"   cocoa"` answers `nil` and leaves `cocoa`.
  //   * **A numeric format's integer check arrived with it.** 5.1 and 5.2 read it with
  //     `lua_tointeger` (a fraction is cut off); v5.3.0 uses `luaL_checkinteger`, which
  //     raises. Same language-wide tightening `os.exit` and `globals.select` already record.
  //   * **What did *not* move.** The loop condition `for (n = first; nargs-- && success; n++)`
  //     is identical in all five, so a failing format has always ended the call and shortened
  //     the answer — 5.3's manual is the first to say so ("the function does not read
  //     subsequent formats") and the behaviour is 5.1's. `"a"` has always been unfailing:
  //     5.1 calls `read_chars(L, f, ~(size_t)0)` and 5.2 onwards `read_all`, and both set
  //     `success = 1` unconditionally, so 5.4's added "this format never fails" is
  //     documentation catching up. `test_eof` (a count of `0`) is byte-identical from v5.1 to
  //     v5.5.1 apart from `lua_pushlstring(L, NULL, 0)` becoming `lua_pushliteral(L, "")` at
  //     v5.3.1.
  //   * **The 200-character cap on a numeral did arrive with the scanner.** It is `MAXRN`
  //     (v5.3.0–v5.3.2) / `L_MAXLENNUM` (v5.3.3+), **200 at every 5.3+ release**, and 5.1 and
  //     5.2 have no ceiling at all because `fscanf` imposes none. Only 5.4's manual mentions
  //     it, but the boundary is a real 5.3 one and it is in the 5.3 note. Probed: 200 digits
  //     read as a number, 201 answer `nil`.
  //   * **The stream-error path's *shape* is documented; what the entries turn on is not.**
  //     Every I/O chapter preamble states the triple — 5.1 §5.7, 5.2/5.3/5.4 §6.8, 5.5 §6.9:
  //     "Unless otherwise stated, all I/O functions return nil [fail] on failure (plus an
  //     error message as a second result and a system-dependent error code as a third
  //     result)". What no manual states, in any version, is that on this call those three
  //     values **replace** an answer earlier formats had already filled, and that this is how
  //     the end of the file is told from trouble. `if (ferror(f)) return
  //     luaL_fileresult(L, 0, NULL);` returns 3 whatever the formats were, and 5.1's
  //     `pushresult(L, 0, NULL)` pushes the same three. Probed: two formats on a write-only
  //     handle answer 3 values, and `read("a")` alone answers 3 rather than `""`. True on all
  //     five lines and undated; stated in the entries' prose under
  //     `#telling-the-end-of-the-file-from-trouble` rather than in a note.
  //
  // Two wording changes that are **not** deltas: 5.1 says a count reads that many
  // *characters* where 5.2 onwards say *bytes* (a Lua string is bytes in every version), and
  // 5.4 retypes `nil` as *fail*, which is the `os.getenv` non-event — `luaL_pushfail` is
  // `lua_pushnil` unless `LUA_FAILISFALSE` is defined, and it is not in a stock build.
  //
  // Patch residuals, recorded because minor-line granularity cannot hold them: v5.1 and
  // v5.1.1's `read_number` fails **without pushing a placeholder**, so `g_read`'s
  // `lua_pop(L, 1)` removes the wrong value — fixed by 5.1.5, which is what
  // `lua.org/source/5.1` serves and what this site means by 5.1. The numeral scanner accepts
  // a dot *as well as* the locale's radix mark only from **v5.3.3** (`decp[1] = '.'`); v5.3.0
  // through v5.3.2 take the locale's mark alone. And `g_read` gains `errno = 0;` at
  // **v5.4.7**, which changes only what the stream-error path reports when the failure left
  // `errno` unset.
  'io.file-read': ioFileRead,
  'io.read': ioRead,

  // Writing and flushing. As with reading, each pair is **one C function reached from two
  // names**: `f_write` and `io_write` both end in `g_write`, and `f_flush` and `io_flush`
  // both do `fflush` on the file they were handed. So the two write datasets carry the same
  // three notes and the two flush datasets carry none, and every fact below holds for both
  // members of its pair.
  //
  // `liolib.c` read at the **repo root** for every tag in every line — v5.1, v5.1.1, v5.2.0
  // through v5.2.3, v5.3.0 through v5.3.6, v5.4.0 through v5.4.8, v5.5.0 and v5.5.1 — plus
  // the two shipped releases with no tag, 5.1.5 and 5.2.4, from `www.lua.org/source/5.1` and
  // `/5.2` (the *minor* line; `/source/5.1.5/` is a 404). Whole files were diffed and
  // `g_write`, `f_write`, `io_write`, `f_flush`, `io_flush`, `aux_flush`, `pushresult`,
  // `getiofile` and `tofile` extracted per release and diffed pairwise; `lauxlib.c` at
  // v5.2.0, v5.2.3, v5.3.0, v5.3.6, v5.4.0, v5.4.6, v5.4.7, v5.4.8, v5.5.0 and v5.5.1 for
  // `luaL_fileresult`; `luaconf.h` at all five lines for `LUA_NUMBER_FMT`, `LUA_INTEGER_FMT`
  // and `LUA_NUMBER_FMT_N`; `lobject.c` and `lapi.c` at v5.5.1 for `luaO_tostringbuff` and
  // `lua_numbertocstring`; and `lbaselib.c` plus the header holding `lua_writestring` at all
  // five lines, which is how the entries can say that `print` does **not** go through the
  // default output file (it is `fwrite(..., stdout)` in every version).
  //
  //   * **What a write hands back moved at 5.2.** 5.1's `g_write` ends in
  //     `pushresult(L, status, NULL)`, which pushes `lua_pushboolean(L, 1)` — one value,
  //     `true`. **v5.2.0** changes the tail to `if (status) return 1;  /* file handle already
  //     on stack top */`, and `f_write` gains a `lua_pushvalue(L, 1)` above the call to put
  //     the handle there. `io_write` needs no such line because `getiofile` already leaves
  //     the default output handle on the stack, which is also why `g_write` computes
  //     `nargs = lua_gettop(L) - arg` rather than counting the arguments it was given. So
  //     `io.write` hands back the *default output file* from 5.2 and `true` before it.
  //     The manuals record the change on `file:write` only ("In case of success, this
  //     function returns file", added at 5.2); `io.write`'s passage says "Equivalent to
  //     `io.output():write(···)`" in every version and never mentions a return at all.
  //   * **The failing answer gained a fourth value at 5.5.** From v5.2.0 to v5.4.8 the tail
  //     is `luaL_fileresult(L, status, NULL)`, which is three values — `nil`/fail, the
  //     system's description, its code — and 5.1's `pushresult` pushes the same three.
  //     **v5.5.0** rewrites `g_write` to detect a short `fwrite` per argument and return
  //     `luaL_fileresult(...)` plus `lua_pushinteger(L, cast_st2S(totalbytes))`, four values,
  //     where `totalbytes` is summed across all the arguments the call got through. 5.5's
  //     manual states it outright; no earlier manual does.
  //   * **How a number is written moved twice.** 5.1 and 5.2 write every number with
  //     `fprintf(f, LUA_NUMBER_FMT, lua_tonumber(...))`, and `LUA_NUMBER_FMT` is `"%.14g"` in
  //     both `luaconf.h`s — so a whole number large enough reaches the file in exponent form.
  //     **v5.3.0** splits the branch on `lua_isinteger` and writes an integer with
  //     `LUA_INTEGER_FMT`, in full. **v5.5.0** drops `fprintf` entirely for
  //     `lua_numbertocstring`, which is `luaO_tostringbuff` — the same conversion `tostring`
  //     uses, so a whole-valued float now keeps its `.0` and a float is retried at
  //     `LUA_NUMBER_FMT_N` precision when the first attempt does not read back as itself.
  //     Between 5.3 and 5.4, therefore, `io.write(2.0)` and `tostring(2.0)` genuinely
  //     disagree; on 5.1, 5.2 and 5.5 they agree, for two different reasons.
  //     5.5 also moves the default `LUA_NUMBER_FMT` from `"%.14g"` to `"%.15g"`, which is a
  //     language-wide float-printing change rather than a `write` one and is **not** carried
  //     here — it belongs to `tostring`, `print` and `string.format` as much as to this.
  //   * **Flushing did not move at all.** `f_flush` and `io_flush` are `pushresult(L,
  //     fflush(...) == 0, NULL)` at 5.1 and `luaL_fileresult(L, fflush(...) == 0, NULL)` from
  //     v5.2.0, and `luaL_fileresult` pushes `lua_pushboolean(L, 1)` and returns 1 on success
  //     in **every** release read — including v5.5.1, where the flush entries are the only
  //     `io` writes-side calls the four-value change does not touch. v5.4.7 hoists an
  //     `errno = 0;` and **v5.5.0** factors both bodies into `aux_flush`; both are refactors.
  //     No manual in any version says what `file:flush` returns, so this is ADR 0010 rule 3
  //     and it is stated in the entries' `<Returns>` undated. Probed as well: `flush()` is
  //     one value, `true`, and a chain written through it raises on a boolean.
  //   * **A closed default output raises**, in every version — `getiofile`'s `luaL_error`.
  //     Only the wording moved (`standard %s file is closed` through 5.3, `default %s file is
  //     closed` from v5.4.0), and wording is never recorded.
  //
  // Wording changes that are **not** deltas: 5.1's `file:write` passage adds "To write other
  // values, use `tostring` or `string.format` before write", which 5.2 drops without any
  // behaviour moving; 5.1's `io.flush` says "Equivalent to `file:flush` over the default
  // output file" where 5.2 onwards say "Equivalent to `io.output():flush()`"; and 5.4
  // retypes `nil` as *fail*, the `os.getenv` non-event.
  //
  // **None of the four appears in any Incompatibilities chapter.** 5.2's, 5.3's, 5.4's and
  // 5.5's §8 were sliced from `<a name="8">` to end of file and read paragraph by paragraph.
  // Notably 5.5's does **not** mention the fourth return value, though its `file:write`
  // passage states it.
  //
  // Patch residuals, recorded because minor-line granularity cannot hold them: `g_write`
  // gains `errno = 0;` at **v5.4.7** and `f_flush`/`io_flush` do the same, which with
  // v5.4.7's `luaL_fileresult` makes a failure that left `errno` unset report
  // `"(no extra info)"` and code `0` instead of a stale message. `LUAI_UACINT`/`LUAI_UACNUMBER`
  // casts enter `g_write` at **v5.3.4** and `l_likely` at **v5.4.3**; neither changes an
  // answer. v5.5.0 and v5.5.1 are byte-identical for all nine functions read.
  'io.file-write': ioFileWrite,
  'io.write': ioWrite,
  'io.file-flush': ioFileFlush,
  'io.flush': ioFlush,

  // Looping over a file. This is the **one pair in `io` that is not two names for one
  // operation**, and the datasets show it: `file:lines` carries two notes and `io.lines`
  // carries three, because `io.lines` owns a whole subject — the file's life — that the
  // method does not have. `f_lines` is `tofile(L); aux_lines(L, 0);` in all 26 releases;
  // `io_lines` opens by name, passes `toclose = 1`, and from v5.4.0 returns four values.
  // Both funnel each *step* through the same `io_readline`, which is why the two format
  // notes are shared word for word with `io.file-read`/`io.read`.
  //
  // `liolib.c` read at the **repo root** for every tag in every line — v5.1, v5.1.1, v5.2.0
  // through v5.2.3, v5.3.0 through v5.3.6, v5.4.0 through v5.4.8, v5.5.0 and v5.5.1 — plus
  // the two shipped releases with no tag, 5.1.5 and 5.2.4, from `www.lua.org/source/5.1` and
  // `/5.2` (the *minor* line; `/source/5.1.5/` is a 404). **Whole files were diffed
  // consecutively across all 26**, not function bodies, because the cap below lives in a
  // `#define` and a body diff cannot see one — the lesson `io.open`'s mode set cost.
  //
  //   * **Formats arrive at 5.2.** 5.1's `aux_lines(L, idx, toclose)` pushes the file and a
  //     boolean and nothing else, and `io_readline` calls `read_line(L, f)` flat. Arguments
  //     past the first are never read: `io_lines` does `aux_lines(L, lua_gettop(L), 1)` on
  //     the handle it just pushed, and `f_lines` does `aux_lines(L, 1, 0)` on the receiver.
  //     So on 5.1 `file:lines(1)` and `io.lines(name, "*l")` are accepted and **silently
  //     ignored** — not refused. **v5.2.0** rewrites `aux_lines` to copy the arguments into
  //     the closure's upvalues and `io_readline` to hand them to `g_read`.
  //   * **The format spellings move with `io.read`'s**, through the same `g_read`: `"*L"`
  //     joins at **5.2**, and the leading `*` becomes optional at **5.3**. See the
  //     `io.file-read` block above for the C; nothing here re-derives it.
  //   * **How many formats one call may carry, and it is not a delta worth a chip.** 5.1 has
  //     no formats. **v5.2.0** caps at `LUA_MINSTACK - 3` (17) with "too many options";
  //     **v5.3.0 and v5.3.1 have no cap at all**; `MAXARGLINE` (250, "too many arguments")
  //     arrives at **v5.3.2** and is unchanged to v5.5.1. The entries state the cap without a
  //     number, under a `<Since v="5.2" />`, which is true on every line; a `changed_in` would
  //     put a *Changed* chip on 5.3 for a number nobody reaches.
  //   * **Four values at 5.4, and that is `io.lines`' whole delta.** **v5.4.0** adds
  //     `if (toclose) { lua_pushnil; lua_pushnil; lua_pushvalue(L, 1); return 4; }` to
  //     `io_lines`. `f_lines` returns 1 at every release, so the method has no such note. The
  //     4th value is the generic `for`'s to-be-closed variable, which needs the `__close`
  //     metamethod `io.open`'s dataset dates to the same release. **5.4 §8.2 names it** —
  //     the only `io.lines` hit in any Incompatibilities chapter, and the fact `globals/load`
  //     deliberately left here. Probed on the 5.4 runtime: `select("#", io.lines(name))` is
  //     4 and `select("#", io.lines())` is 1; after a `break` the handle reads `closed file`;
  //     `load(io.lines(name, "L"))` compiles and then fails on its first global, because the
  //     handle landed in `load`'s `env`, and `load((io.lines(name, "L")))` runs.
  //
  // Three things the manuals make look like deltas and are not:
  //
  //   * **"returns nil (to finish the loop)" → "returns no values" at 5.3.** `io_readline`
  //     ends `return 0;` in **every** release read, 5.1 included. Documentation catching up.
  //   * **"In case of errors this function raises the error, instead of returning an error
  //     code", added to both passages at 5.2.** 5.1 raises too: `io_lines` calls
  //     `fileerror`, which is `luaL_argerror`, and `io_readline` raises on `ferror`. The
  //     sentence is then dropped from `file:lines`' passage at 5.4 with nothing moving.
  //   * **`io.lines()` versus `io.lines(nil)`.** 5.1 tests `lua_isnoneornil` but then calls
  //     `f_lines`, whose `tofile` reads index 1 — so an explicit `nil` raises there while
  //     `io.lines()` works. From v5.2.0 `lua_replace(L, 1)` makes the two identical. Too
  //     narrow to carry, recorded so it is not rediscovered as a format delta.
  //
  // Patch residuals: none in `io_lines`, `f_lines`, `aux_lines` or `io_readline` beyond the
  // `MAXARGLINE` boundary above. v5.3.0/v5.3.1 are the gap; `luaL_checkstack(L, n, "too many
  // arguments")` inside `io_readline` (v5.3.0+) is the backstop that made the gap survivable.
  // v5.5.0 and v5.5.1 are byte-identical for all four functions.
  'io.file-lines': ioFileLines,
  'io.lines': ioLines,

  // Moving about a file, and choosing when what is written leaves for it. The **first `io`
  // pair with no library-level twin**: there is no `io.seek` and no `io.setvbuf`, so nothing
  // here has to be reconciled with a second page, and both entries state their rule
  // unqualified. `f_seek` and `f_setvbuf` are registered in `flib`/`meth` alone at all 26
  // releases read.
  //
  // `liolib.c` read at the **repo root** for every tag in every line — v5.1, v5.1.1, v5.2.0
  // through v5.2.3, v5.3.0 through v5.3.6, v5.4.0 through v5.4.8, v5.5.0 and v5.5.1 — plus the
  // two shipped releases with no tag, 5.1.5 and 5.2.4, from `www.lua.org/source/5.1` and
  // `/5.2` (the *minor* line; `/source/5.1.5/` is a 404). **All 25 consecutive whole-file
  // diffs were generated and read**, which is what the `l_fseek`/`l_seeknum` block below
  // needs: it is a `#define` block and a body diff cannot see one.
  //
  // **`file:seek`'s one delta is the offset, and it is at 5.2 — not 5.3, where the mechanism
  // moved without the answer moving.** Three forms in order:
  //
  //   * 5.1 (v5.1, v5.1.1, 5.1.5): `long offset = luaL_optlong(L, 3, 0);`. `luaL_optlong` is
  //     `((long)luaL_optinteger(...))` and 5.1's `lua_tointeger` is a plain cast of the
  //     number, so **a fraction is cut off and the whole part used**. There is no range check
  //     of any kind.
  //   * **v5.2.0**: `lua_Number p3 = luaL_optnumber(L, 3, 0); l_seeknum offset = (l_seeknum)p3;
  //     luaL_argcheck(L, (lua_Number)offset == p3, 3, "not an integer in proper range");` —
  //     **the refusal starts here**, and it covers a fraction and an out-of-range value with
  //     one test.
  //   * **v5.3.0**: `luaL_optinteger` replaces `luaL_optnumber` and the argcheck compares in
  //     `lua_Integer`. The language-wide integer-representation tightening `io.read`'s numeric
  //     format and `os.exit` also record — but here it changes only *which* message a raise
  //     carries (`not an integer in proper range` → `number has no integer representation`),
  //     and wording is never recorded. **No 5.3 note is wanted on this entry.**
  //
  // Also at v5.2.0 and deliberately **not** carried: the `l_fseek` / `l_ftell` / `l_seeknum`
  // configuration block, which puts `fseeko`/`off_t` under POSIX and `_fseeki64`/`__int64`
  // under MSVC where 5.1 has plain `fseek` and `long`. On a build whose `long` is 64 bits
  // there is no difference at all, so it is a build fact rather than a version fact and a
  // *Changed* chip would be false for most readers. (The guard is misspelled `lua_fseek` at
  // v5.2.0–v5.2.2 while the body defines `l_fseek`; v5.2.3 adds the missing
  // `#if !defined(l_fseek)` default block and an `&& !defined(LUA_ANSI)`. v5.5.0 adds
  // `LUA_USE_OFF_T` to the POSIX arm. None of it is reachable from Lua.)
  //
  // The returned position is `lua_pushinteger(ftell(f))` on 5.1, `lua_pushnumber((lua_Number)
  // l_ftell(f))` from v5.2.0 and `lua_pushinteger((lua_Integer)l_ftell(f))` from v5.3.0 —
  // **no observable delta**, because 5.1 and 5.2 have no integer subtype and an integral
  // number prints the same either way. `<Return type="integer">` is unscoped and
  // `NumericTypeNote` discloses the gap.
  //
  // **`file:setvbuf`'s one delta is `size`, and it is at 5.3.** `luaL_optinteger(L, 3,
  // LUAL_BUFFERSIZE)` is the line at **all 26 releases**; what moved is `luaL_optinteger`
  // itself, which cut a fraction off before 5.3 and raises from it. Nothing else in the
  // function is reachable-different: `pushresult(L, res == 0, NULL)` becomes
  // `luaL_fileresult(L, res == 0, NULL)` at v5.2.0 and both push `true` on success and
  // `nil` + message + `errno` on failure, and `(size_t)` casts and an `errno = 0;` hoist are
  // the only later edits.
  //
  // **`LUAL_BUFFERSIZE` is the default `size`, and its value moved twice** — `BUFSIZ` (5.1,
  // 5.2), `((int)(0x80 * sizeof(void*) * sizeof(lua_Integer)))` = 8192 on a 64-bit build
  // (5.3), `((int)(16 * sizeof(void*) * sizeof(lua_Number)))` = 1024 (5.4, 5.5). Every
  // manual says only "The default is an appropriate size", the constant is a build knob, and
  // the only way to observe it is to measure when a handover happens — which is the thing no
  // card may assert. **Not carried**, recorded here so it is not later mistaken for a delta.
  //
  // Two manual changes at 5.4 that are **not** deltas. "Sets the buffering mode for an output
  // file" becomes "for a file" — `setvbuf` was always applied to the stream whatever it was
  // opened for, and a read handle accepts the call in every version (probed). And the
  // per-mode descriptions ("the result of any output operation appears immediately", "output
  // is buffered until a newline is output or there is any input from some special files") are
  // **replaced** by "The specific behavior of each mode is non portable; check the underlying
  // ISO C function `setvbuf` in your platform for more details." The C is byte-identical
  // across that boundary, so the manual withdrew a promise it should not have made rather
  // than describing a change. Both entries' prose is written to the weaker claim, which is
  // the one true on all five lines.
  //
  // **Neither symbol appears in any Incompatibilities chapter.** 5.2's, 5.3's, 5.4's and
  // 5.5's §8 were sliced from `<a name="8">` to end of file and searched line by line for
  // `seek`, `setvbuf`, `buffer`, `whence`, `offset` and `position`: zero hits in four
  // chapters.
  //
  // Patch residuals: `l_unlikely` on `f_seek`'s failure branch at **v5.4.3**; `errno = 0;`
  // hoisted into both functions at **v5.4.7**, which with that release's `luaL_fileresult`
  // makes a failure that left `errno` unset report `"(no extra info)"` and code `0` rather
  // than a stale message. v5.5.0 and v5.5.1 are byte-identical for both functions.
  'io.file-seek': ioFileSeek,
  'io.file-setvbuf': ioFileSetvbuf,

  // The two calls that name the default files, and the three handles those files start as.
  // `io.input` and `io.output` are one C function reached from two names — `io_input` is
  // `g_iofile(L, IO_INPUT, "r")` and `io_output` is `g_iofile(L, IO_OUTPUT, "w")` at all 26
  // releases — and `io.stdin`/`io.stdout`/`io.stderr` are three `createstdfile` calls in
  // `luaopen_io`. The manual says as much from its side: `io.output`'s whole passage is
  // "Similar to `io.input`, but operates over the default output file", which is why
  // **`io.input` owns opening by name** and `io.output` links to it and adds the one thing
  // that genuinely differs — the mode is `"w"`, so a name truncates.
  //
  // `liolib.c` read at the **repo root** for every tag in every line — v5.1, v5.1.1, v5.2.0
  // through v5.2.3, v5.3.0 through v5.3.6, v5.4.0 through v5.4.8, v5.5.0 and v5.5.1 — plus
  // the two shipped releases with no tag, 5.1.5 and 5.2.4, from `www.lua.org/source/5.1` and
  // `/5.2` (the *minor* line; `/source/5.1.5/` is a 404). **All 25 consecutive whole-file
  // diffs were generated and read**, not function bodies: `IO_INPUT` and `IO_OUTPUT` are
  // `#define`s and they change *kind* at 5.2, which is exactly the class a body diff misses.
  //
  // **`g_iofile` has not changed behaviour once in 26 releases.** Byte-identical from v5.2.0
  // to v5.5.1, and behaviourally identical to 5.1's:
  //
  //     if (!lua_isnoneornil(L, 1)) {
  //       const char *filename = lua_tostring(L, 1);
  //       if (filename) opencheck(L, filename, mode);
  //       else { tofile(L); lua_pushvalue(L, 1); }
  //       lua_setfield(L, LUA_REGISTRYINDEX, f);
  //     }
  //     lua_getfield(L, LUA_REGISTRYINDEX, f);  return 1;
  //
  // Four facts fall straight out of it and are stated undated on both pages:
  //
  //   * **The call answers with the file it has just set**, not the one it replaced — the
  //     `getfield` runs after the `setfield`. Probed: `io.output(sink) == sink` is `true`.
  //     This is the batch's most useful Gotcha and no manual in any version mentions it.
  //   * **`lua_isnoneornil`**, so `io.input(nil)` is `io.input()` and reports without setting.
  //   * **`lua_tostring`**, so a *number* is read as a file name: `io.input(2024)` opens a
  //     file called `2024`. Anything else falls to `tofile` and raises `FILE* expected`.
  //   * **A failed open raises**, on every line — `fileerror` → `luaL_argerror` at 5.1,
  //     `opencheck` → `luaL_error` from v5.2.0. Message only; both raise. This is the fact
  //     I4 recorded for these two entries and it is confirmed here at every tag.
  //
  // What moved and is **not** a delta: the slot lives in the library's environment table at
  // 5.1 (`lua_rawgeti(L, LUA_ENVIRONINDEX, IO_INPUT)`) and in the registry from v5.2.0
  // (`IO_PREFIX "_IO_"`), which is unreachable from Lua; `getiofile`'s raise text goes from
  // `standard %s file is closed` to `default %s file is closed` at **v5.4.0**; `luaL_pushfail`
  // replaces `lua_pushnil` at 5.4; and "without parameters" becomes "without arguments" in the
  // manual at 5.3. The **no-argument form cannot fail** — it is a bare `getfield` — and it
  // will hand back a *closed* handle where the program closed the default file. Probed.
  //
  // **The three standard handles are `createstdfile(L, stdin, IO_INPUT, "stdin")` and its two
  // neighbours**, so `io.input() == io.stdin` and `io.output() == io.stdout` are `true` on a
  // fresh state *by identity* — the same userdata is stored in the `io` table and in the slot.
  // Nothing points at `io.stderr`; its `k` argument is `0` at 5.1 and `NULL` from v5.2.0.
  // **No manual in any version says the default files start as the standard handles**; it is
  // ADR 0010 rule 3, from `luaopen_io` at all 26 releases plus a probe.
  //
  // **A close is refused and answered rather than raised**: `io_noclose` pushes `nil` (from
  // 5.4 `luaL_pushfail`) plus the literal `cannot close standard file` and returns 2, and from
  // v5.2.0 it puts `p->closef` back so the handle stays open. **Residual: v5.1 and v5.1.1 have
  // no `io_noclose` at all** — their standard handles close like any other file, and only
  // `io_gc` guards `stdin`/`stdout`/`stderr` against the *finalizer*. The protection arrives
  // inside the 5.1 line, by 5.1.5, through `newfenv(L, io_noclose)`; `lua.org/source/5.1`
  // serves 5.1.5, so 5.1 as this site means it refuses and the entries say so unscoped. I1
  // recorded this for `io.close`; it is re-derived here rather than inherited.
  //
  // **The one dated fact on all five is `__close` at v5.4.0**, the propagation duty I1's fix
  // round recorded. `metameth` gains `{"__close", f_gc}` beside `{"__gc", f_gc}` at v5.4.0 and
  // is byte-identical to v5.5.1. On `io.input`/`io.output` it reaches the reader through the
  // handle they hand back, and the note says what a `<close>` over *that* handle costs — it
  // leaves the default file closed, which is the section's worst trap written in new syntax.
  // On the three constants the metamethod is `f_gc`, whose `aux_close` reaches `io_noclose`,
  // so the close is refused and nothing propagates: probed, `local marker <close> = io.stdout`
  // runs clean and leaves `io.type(io.stdout)` reading `file`. The note says the declaration
  // is accepted and does nothing, which is the honest form of the fact.
  //
  // **None of the five appears in any Incompatibilities chapter.** 5.2's, 5.3's, 5.4's and
  // 5.5's §8 sliced from `<a name="8">` to end of file and searched line by line for `io.`,
  // `stdin`, `stdout`, `stderr`, `default input`, `default output`, `input file` and
  // `output file`: the only hits in four chapters are `io.read`'s dropped `*` at 5.3 and
  // `io.lines`' four values at 5.4, which are I2's and I4's.
  //
  // Buffering is **not** carried as a fact about any of the three. Which scheme a standard
  // stream arrives with is the host C library's arrangement, not Lua's, and I1's rule forbids
  // a card asserting one; the entries say the arrangement is inherited and point at
  // `file:setvbuf`, which owns what buffering is.
  'io.input': ioInput,
  'io.output': ioOutput,
  'io.stdin': ioStdin,
  'io.stdout': ioStdout,
  'io.stderr': ioStderr,

  // The four that close the `io` section: `file:close`, the two functions that hand back a
  // handle nobody named, and the section overview. `liolib.c` read at the **repo root** for
  // every tag in every line — v5.1, v5.1.1, v5.2.0–v5.2.3, v5.3.0–v5.3.6, v5.4.0–v5.4.8,
  // v5.5.0, v5.5.1 — plus the two shipped releases with no tag, 5.1.5 and 5.2.4, from
  // `www.lua.org/source/5.1` and `/5.2` (the *minor* line; `/source/5.1.5/` is a 404). All 25
  // consecutive whole-file diffs generated and read, which is what caught the popen mode
  // check below: it is an inline `luaL_argcheck` at one release and a `#define` at the next,
  // and a function-body diff sees only one half of that.
  //
  // **`file:close` and `io.close` are one operation on every line.** Through 5.3.4 they are
  // literally the same C function (`io_close` registered in `iolib` *and* as `flib`'s
  // `"close"`); **v5.3.5** splits `f_close` out and `io_close` becomes a `getfield` on the
  // default output followed by `f_close(L)`. A refactor, not a delta. So `io.close` owns
  // `#what-closing-a-file-does` and `file:close` links to it; what `file:close` carries in its
  // own right is the popen note, because 5.2 added that sentence to **`file:close`'s** passage
  // and to no other.
  //
  // **The popen status note, at 5.2, on all three of `io.close`, `file:close` and `io.popen`.**
  // 5.1's `io_pclose` is `pushresult(L, lua_pclose(L, *p), NULL)` with
  // `#define lua_pclose(L,file) ((void)L, (pclose(file) != -1))` in `luaconf.h` — a *boolean*,
  // so the answer is `true` whenever the close itself went through, whatever status the
  // program exited with, and it is **one** value on that path (`pushresult` returns 1 on
  // success, 3 on failure). From **v5.2.0** it is `luaL_execresult(L, …)`: three values on
  // both paths, and the same four answers `os.execute` gained in that release, the fourth
  // being the one where the program could never be started. Entries must not enumerate three
  // — that was I1's fix round's Important 1, twice.
  //
  // **`io.popen`'s mode check arrives at 5.3, not at 5.4.** This corrects the fact I1's fix
  // round handed forward. Read at every tag:
  //
  //   * v5.1 … v5.3.5, and **v5.4.0**: no check at all. `mode` reaches `popen`/`_popen` as
  //     written, and a spelling the system will not have comes back as a failed *start* —
  //     a false value, a message and a code — rather than as a raise.
  //   * **v5.3.6**: an inline `luaL_argcheck(L, ((mode[0]=='r' || mode[0]=='w') &&
  //     mode[1]=='\0'), 2, "invalid mode")`. It is the **only** change in the whole file
  //     between v5.3.5 and v5.3.6.
  //   * **v5.4.1**: the same test, moved behind `#if !defined(l_checkmodep)`. Absent again at
  //     v5.4.0, which is a one-release regression inside the 5.4 line.
  //   * **v5.4.3** onwards: the Windows arm gains `[rw][bt]?`; the default arm stays `[rw]`.
  //     Both arms sit behind `#if !defined`, so what a build takes past `"r"` and `"w"` is the
  //     build's own setting.
  //
  // A line is credited with what its **final** release has, and 5.3.6 is the last 5.3 — so the
  // observable boundary on this site's granularity is **5.3**, and the note says so. The
  // Windows extension is **not** a second chip: on a POSIX build there is no difference at all
  // between 5.3 and 5.4, which makes it the `l_fseek` shape I5 ruled on — a build fact, not a
  // version fact. Probed at both ends: on the 5.4 wasm runtime and on a native 5.3.6,
  // `io.popen(cmd, "rb")` and `io.popen(cmd, "z")` both raise `invalid mode`, and the check
  // runs *before* anything is started.
  //
  // **`io.popen` is the one name in this library the manual declines to promise is present.**
  // "This function is system dependent and is not available on all platforms" is in all five
  // manuals, and `system dependent` occurs exactly once in each of the five, here. Where the
  // build has no way to start a program the ISO C arm is
  // `luaL_error(L, "'popen' not supported")` (`LUA_QL("popen") " not supported"` before 5.3) —
  // so the call **raises**; it is not absent, and `if io.popen then` is true everywhere.
  // **Probed in a throwaway process, per the brief.** In the harness's own
  // `new LuaFactory().createEngine()` this is exactly what happens: `type(io.popen)` is
  // `function`, `pcall(io.popen, "echo hi")` returns `false, "'popen' not supported"`, and the
  // engine **survives** — ten calls in a row and it is still running. `io.popen` is therefore
  // *not* the `os.execute` hazard: it reaches `popen`, not `system`, and it raises catchably
  // rather than aborting the wasm engine. **No card may call it all the same**, because the
  // answer here is the ISO C arm's refusal, which is a build fact, and an expected-output
  // comment recording it would teach every reader on a POSIX or Windows Lua the opposite of
  // what they get. `os/execute.mdx`'s shape is followed instead: fenced listings for the real
  // idiom, and `usesEntry={false}` cards standing in for it.
  //
  // **Closing a popen handle waits for the program — confirmed, and this discharges the one
  // claim I1 left resting on `pclose`'s contract.** Probed on a native Lua 5.3.6 with a
  // working `popen`: `io.popen("ping -n 3 127.0.0.1 > nul && echo done > marker")` comes back
  // at once and the marker file does **not** exist; the marker exists immediately after
  // `close()` returns, with two wall seconds spent inside the close. A second shape confirms
  // it from the other side — a program that exits 5 after two seconds reports `nil, "exit", 5`,
  // which cannot be known before it has ended. Also probed there: a command the processor
  // cannot carry out still **succeeds** at `io.popen` and disappoints at the close
  // (`nil, "exit", 1`), the program's error stream does not come through the handle, and
  // `io.popen(42)` runs a command called `42` (`luaL_checkstring` coerces a number).
  //
  // **`io.tmpfile` has not moved in 26 releases.** `newfile(L)` plus `tmpfile()` plus
  // `pushresult` / `luaL_fileresult`, with an `errno = 0;` hoisted in at **v5.4.7** and
  // nothing else. The manual gained "In case of success," at 5.3, which is documentation
  // catching up: 5.1's `pushresult(L, 0, NULL)` already answers three values on the failing
  // path. **It works in the sandbox** — probed: the handle reads `"file"`, writing then
  // seeking then reading works, sixty of them can be held open at once, arguments are ignored
  // rather than refused, and `local scratch <close> = io.tmpfile()` runs clean. That is what
  // lets this entry carry ordinary cards where `io.popen` cannot.
  //
  // **`__close` at v5.4.0 is the last of I1's propagation list**, discharged here for
  // `io.popen` and `io.tmpfile`. `metameth` gains `{"__close", f_gc}` beside `{"__gc", f_gc}`
  // at v5.4.0 and is byte-identical to v5.5.1, and both of these calls reach it through the
  // handle they hand back (`newprefile` sets `LUA_FILEHANDLE` on the popen handle too). On a
  // popen handle the note has a cost worth stating: `f_gc` returns **0**, so the three values
  // describing how the program ended are discarded, and the block does not end until the
  // program has. `file:close` deliberately carries **no** 5.4 note, matching its twin
  // `io.close`, which carries none either — the declaration does not go through either call.
  //
  // **None of the four appears in any Incompatibilities chapter.** 5.2's, 5.3's, 5.4's and
  // 5.5's §8 sliced from `<a name="8">` to end of file (head and tail printed to verify the
  // slice) and searched line by line for `popen`, `tmpfile`, `close`, `io.` and `file:`: the
  // only hits in four chapters are `io.read`'s dropped `*` at 5.3, `io.lines`' four values at
  // 5.4, and 5.5's `lua_closethread`, which is a C API item.
  //
  // **`io.library` records membership and there is none to record.** `grep -o 'pdf-io\.[a-z]*'`
  // and `grep -o 'pdf-file:[a-z]*'` over all five manuals return the same fourteen and the same
  // seven every time, so the `io` table's membership has not moved once — the `os.library`
  // shape, `support` only and no matrix on the overview page.
  'io.file-close': ioFileClose,
  'io.popen': ioPopen,
  'io.tmpfile': ioTmpfile,
  'io.library': ioLibrary,

  // ## `package.path`, `package.cpath`, `package.config` — the three search-path strings
  //
  // **These three values are decided by the build, not by the language**, and both paths can
  // be replaced from the environment before a program's first line runs. `luaconf.h` names
  // every default under `CHANGE them if…`, no manual states what any of them holds, and the
  // three entries therefore describe *shape* and never assert a value. The two defaults did
  // move — 5.1 puts `./?.lua` first and 5.2 moves it last, 5.3 adds `?/init.lua` and a shared
  // directory — and none of that is recorded, because recording compile-time configuration as
  // a version fact would mark four surfaces "changed" for something a builder chooses.
  //
  // **Two real boundaries, both on the two paths and both corroborated from both axes.**
  //   1. **5.2 — the versioned environment variable, and `-E`.** `setpath` takes one env name
  //      at `v5.1`, `v5.1.1` and shipped 5.1.5 (`getenv(envname)` alone, no `noenv`), and two
  //      from `v5.2.0` on (versioned name, then plain, then `noenv(L)` — the registry field
  //      `LUA_NOENV` the stand-alone interpreter sets for `-E`). The manuals agree exactly:
  //      `pdf-package.path` names `LUA_PATH` alone in 5.1 and `LUA_PATH_5_x` *or* `LUA_PATH`
  //      from 5.2, and §7 documents `-E` from 5.2 with `package.path`/`package.cpath` named in
  //      the paragraph. The 5.3.4 refactor (five parameters to four, the versioned name built
  //      from `LUA_VERSUFFIX` inside `setpath`) is the same two lookups in the same order.
  //   2. **5.4 — only the first `;;` is spliced.** `v5.1` through `v5.3.6` use
  //      `luaL_gsub(path, ";;", ";AUXMARK;")` and replace *every* occurrence; `v5.4.0` through
  //      `v5.5.1` use one `strstr` and rebuild the string around that single hit. Clean at the
  //      minor boundary — all 15 earlier artefacts gsub, all 11 later ones strstr, no
  //      patch-level residual. The manuals moved with it, from "Any `;;`" (5.1–5.3) to
  //      "A `;;`" (5.4, 5.5), which is the rare case where a wording change *is* the change.
  //
  // **`package.config` is the batch's one disagreement between the two axes.** `loadlib.c`
  // sets the field at `v5.1`, `v5.1.1` and shipped 5.1.5, so a stock 5.1 build has it — but
  // 5.1's manual never mentions it, and the settled ruling is that a version has a symbol iff
  // that version's manual asserts its existence. `version_added: "5.2"`, therefore, the same
  // call T3 made for `unpack` at 5.2 and with the same residual: the 5.1 reader gets a callout
  // their build contradicts. Recorded in the P1 report rather than left to be rediscovered.
  //
  // **No `changed_in` on `package.config`, and the tempting one would be wrong.** The literal
  // is `LUA_DIRSEP "\n" LUA_PATH_SEP "\n" LUA_PATH_MARK "\n" LUA_EXEC_DIR "\n" LUA_IGMARK` at
  // all 26 artefacts — five items, never four and never six — with a trailing `"\n"` added at
  // `v5.2.0`, which is 5.1's undocumented value differing and not a change inside the entry's
  // life. The manual's *description* of the fifth line flips at 5.3, from "ignore all text
  // before it" to "…after it", and that is documentation catching up, not behaviour: `loadfunc`
  // already tries the part before the mark first, with the old form as a fallback, at `v5.2.0`
  // and at shipped 5.2.4. G10's fix round established this from 5.3 §8.2's own closing
  // parenthesis ("Lua 5.2 already worked that way, but it did not document the change"), and
  // `globals.require`'s `changed_in["5.2"]` is where it is dated. A note here would have said
  // the rule changed at a version where it did not.
  //
  // **None of the three is named in any Incompatibilities chapter.** 5.2's, 5.3's, 5.4's and
  // 5.5's §8 searched for `path`, `package`, `template` and `environment variable`: the sole
  // hit across four chapters is 5.2 §8.2's `package.loaders` → `package.searchers`, which is
  // P2's. 5.1 §7.2 mentions `package.path` — "require gets the path from package.path instead
  // of from LUA_PATH" — but that is a 5.0-to-5.1 change, before the range this site documents.
  'package.path': packagePath,
  'package.cpath': packageCpath,
  'package.config': packageConfig,

  // ## `package.loaded`, `package.preload`, `package.searchers`, `package.loaders`
  //
  // ### The rename, and why it is two entries
  //
  // 5.2 §8.2: *"The table `package.loaders` was renamed `package.searchers`."* One sentence,
  // no parenthesis, no compatibility clause — and *renamed* asserts that the old spelling no
  // longer names anything, exactly as `unpack`'s "must be called as `table.unpack`" does. So
  // the settled removal ruling gives `package.loaders` `version_removed: "5.2"` and
  // `package.searchers` `version_added: "5.2"`, and the pair is modelled the way
  // `unpack`/`table.unpack` already is: the retired name takes the removal fork and names its
  // successor undated in prose, the surviving name takes an ordinary `version_added` and names
  // its predecessor undated in a `<Note>`. Each link's target carries the dated surface for the
  // other name, which is what keeps both pages honest without either naming a version.
  //
  // **The build axis disagrees at 5.2 and the manual wins.** `loadlib.c` keeps a
  // `#if defined(LUA_COMPAT_LOADERS)` alias — `package.loaders` pointing at the same table as
  // `package.searchers` — from `v5.2.0` through `v5.3.6`, and it is gone from `v5.4.0` on.
  // 5.2's `luaconf.h` defines that flag under `LUA_COMPAT_ALL` and 5.2's shipped makefile
  // passes `-DLUA_COMPAT_ALL`, so **a stock 5.2 build has `package.loaders`**; 5.3's
  // `luaconf.h` defines it only under `LUA_COMPAT_5_1` while 5.3's makefile passes
  // `-DLUA_COMPAT_5_2`, so a stock 5.3 build does not. No manual in scope names
  // `LUA_COMPAT_LOADERS` (all five grepped for `LUA_COMPAT_[A-Z0-9_]*`: 5.1's six, nothing in
  // 5.2–5.4, `LUA_COMPAT_GLOBAL` in 5.5), so per T4's and M6's precedent the compatibility
  // route stays out of the prose. The residual is `table.maxn`'s, pointing the other way.
  //
  // ### The three real boundaries, each clean at the minor line
  //
  // Established by diffing whole `loadlib.c` files across **26 artefacts** — every release tag
  // from `v5.1` to `v5.5.1` plus shipped 5.1.5 and 5.2.4 from `lua.org/source` — not by
  // extrapolating from the two ends.
  //
  //   1. **5.2 — `package.preload` became a reference.** 5.1's preload searcher reads
  //      `lua_getfield(L, LUA_ENVIRONINDEX, "preload")`, which is the field on the `package`
  //      table, and raises where it is not a table; from `v5.2.0` it reads the registry
  //      (`"_PRELOAD"`, spelled `LUA_PRELOAD_TABLE` from `v5.3.4` with the same value). So
  //      replacing the field worked on 5.1 and does nothing after. The manual states it from
  //      the other side at exactly 5.2 — the *"only a reference to the real table"* sentence
  //      appears on `pdf-package.preload` from 5.2 on. Both axes agree.
  //   2. **5.2 — a searcher hands back a second value.** `lua_call(L, 1, 1)` at all three 5.1
  //      artefacts, `lua_call(L, 1, 2)` at all 23 later ones. This is `globals.require`'s
  //      `changed_in["5.2"]` seen from the table's side, and it is why `package.loaders`'
  //      base prose describes a searcher answering with a loader alone.
  //   3. **5.4 — `":preload:"`.** `searcher_preload` ends `return 1;` through `v5.3.6` and
  //      `return 2;` with `lua_pushliteral(L, ":preload:")` from `v5.4.0`; the manual moves
  //      with it, from *"The first searcher returns no extra value"* to *"always returns the
  //      string `\":preload:\"`"*. It rides in `package.searchers`' one note together with
  //      `require()` gaining a second result, which is the same version and the same sentence
  //      of `pdf-package.searchers`.
  //
  // Patch-level diffs were read rather than assumed: nothing at `v5.2.0`→`v5.2.1` (the CLIBS
  // rewrite), `v5.3.3`→`v5.3.4` (the `_PRELOAD`/`_LOADED` macros, same strings),
  // `v5.4.2`→`v5.4.3` (`l_unlikely`), `v5.4.4`→`v5.4.5` (formatting) or `v5.5.0`→`v5.5.1`
  // (`luaL_loadfilex`) touches any of these four.
  //
  // ### The two `changed_in` notes that are deliberately absent
  //
  // **`package.loaded` carries none.** Its *"only a reference"* sentence also arrives at 5.2,
  // and unlike `preload`'s it is documentation catching up: 5.1's `ll_require` already reads
  // `lua_getfield(L, LUA_REGISTRYINDEX, "_LOADED")` while `luaopen_package` puts that very
  // table into the field, so assigning over `package.loaded` never changed what `require()`
  // reads. A note here would be the `string.gsub` trap ADR 0010 records, and would have told
  // every 5.1 reader that something moved under them that did not.
  //
  // **Nothing dates 5.4's registry-key sentence** (*"stored in the C registry … indexed by the
  // key `LUA_LOADED_TABLE`"*, likewise `LUA_PRELOAD_TABLE`). Both macros are `"_LOADED"` and
  // `"_PRELOAD"` from `v5.3.4` and both strings are what the code used before the macros
  // existed; the sentence is the C API's, not the field's, and no page states the key names.
  //
  // ### What is in the manuals and what is not
  //
  // `package.loaders` is named in exactly two places across all five manuals — 5.1's own entry
  // plus `pdf-require`, and 5.2 §8.2's rename sentence. 5.3's, 5.4's and 5.5's chapter 8 say
  // nothing about any of these four; 5.3 §8.2's one nearby item is the C searcher's versioned
  // names, which `globals.require` already dates at 5.2 on that chapter's own closing
  // parenthesis. Two further wording moves are *not* recorded: `pdf-require`'s preload value
  // goes from *"should be a function"* (5.1, 5.2) to *"must be a function"* (5.3 on) while
  // nothing has ever checked it — a non-function is passed over in silence at all 26 artefacts
  // — and 5.4 rewords `pdf-package.searchers` from *"how to load modules"* to *"how to find
  // modules"* and from file *name* to file *path*.
  'package.loaded': packageLoaded,
  'package.preload': packagePreload,
  'package.searchers': packageSearchers,
  'package.loaders': packageLoaders,

  // ## `package.searchpath`, `package.loadlib`, `package.seeall` — and the section node
  //
  // Established the same way P1 and P2 established theirs: all five manuals on disk, every
  // Incompatibilities chapter from 5.2 on read whole, and **26 artefacts of `loadlib.c`**
  // diffed as whole files — every release tag from `v5.1` to `v5.5.1` plus shipped 5.1.5 and
  // 5.2.4 from `lua.org/source/<line>/`.
  //
  // ### `package.searchpath` — one arrival, and nothing after it
  //
  // Absent from 5.1's manual and from all three 5.1 artefacts; present in every manual and
  // every artefact from `v5.2.0`. **Its four arguments and their two defaults have never
  // moved**: `ll_searchpath` is `luaL_checkstring(L, 1)`, `luaL_checkstring(L, 2)`,
  // `luaL_optstring(L, 3, ".")`, `luaL_optstring(L, 4, LUA_DIRSEP)` at all 23 artefacts that
  // have it, and the manual passage is word-identical in 5.2 and 5.3 and differs in 5.4 and
  // 5.5 only by saying `fail` where the earlier two say `nil` — which is the same value under
  // the vocabulary 5.4 introduced, the ruling `math.ult` and `math.type` already ship.
  //
  // One thing inside it genuinely moved at **5.4** and is deliberately *not* recorded.
  // `v5.2.0`–`v5.3.6` split the path into templates first (`pushnexttemplate`) and substitute
  // the mark into each template; `v5.4.0`–`v5.5.1` substitute the mark into the whole path at
  // once (`luaL_addgsub`) and split afterwards (`getnextfilename`). The two differ only when
  // the *name* being substituted itself contains the separator between templates — probed:
  // `package.searchpath("a;b", "./p-?.lua")` tries one file on the older shape and two on the
  // newer one. No manual states what such a name does, no page here opens the subject, and a
  // note dating it would be G6's "Important 2" — a `changed_in` about something the base prose
  // never says. The empty-template difference P1 recorded (skipped before 5.4, tried and failed
  // from 5.4) is the same class and is likewise absent.
  //
  // ### `package.loadlib` — the `"*"` form arrives at 5.2, and both axes agree
  //
  // `version_added: "5.1"`: `pdf-package.loadlib` is a 5.1 entry, and 5.1 §7.2's
  // "Function `loadlib` was renamed `package.loadlib`" is a 5.0-to-5.1 change, before the range
  // this site documents. The one delta inside the range is the star: `ll_loadfunc` at `v5.1`,
  // `v5.1.1` and shipped 5.1.5 has no `*` branch at all and always looks the symbol up, so
  // `package.loadlib(lib, "*")` there searches the library for a symbol literally called `*`
  // and fails; `*sym == '*'` appears in all 23 artefacts from `v5.2.0` on, and 5.2's manual
  // adds the paragraph describing it. Mechanically scanned across all 26.
  //
  // Nothing else moved. The failing path is three values — a false first value, the system's
  // own description, and a short word for the step that failed — at every one of the 26;
  // `lua_pushnil` becomes `luaL_pushfail` at `v5.4.0`, which is the same `nil`. The 5.4 manual
  // adds a paragraph calling the function inherently insecure and 5.5 rewrites the platform
  // list, neither of which is a behaviour change. **The third value is build-decided, not
  // version-decided**: `LIB_FAIL` is `"open"` under both `LUA_USE_DLOPEN` and `LUA_DL_DLL` and
  // `"absent"` in the stub implementation, in every version — the third axis O4 named, and the
  // reason the entry states the two cases as a property of the build rather than of a Lua line.
  //
  // ### `package.seeall` leaves at 5.2 — a version before `module`, and the reason is one sentence
  //
  // `seeall` occurs in exactly two places in all five manuals, and both are in 5.1: its own
  // entry anchor and its own entry. **5.2's Incompatibilities chapter does not name it.** Under
  // the settled ruling — a version has the symbol iff that version's manual says something
  // asserting its existence, and deprecation asserts it while silence does not — that is a
  // removal at 5.2. `module` is *named* in 5.2 §8.2 ("Function `module` is deprecated"), which
  // asserts existence, so `globals.module` carries `version_removed: "5.3"`. The two therefore
  // leave a version apart although one is the other's option, and the asymmetry rests entirely
  // on which of the two that paragraph happens to mention.
  //
  // **The build axis disagrees at 5.2, and the manual wins.** `pk_funcs` registers `seeall`
  // unguarded at all three 5.1 artefacts, behind `#if defined(LUA_COMPAT_MODULE)` at all twelve
  // 5.2 and 5.3 artefacts including shipped 5.2.4, and not at all from `v5.4.0`. 5.2's
  // `luaconf.h` defines `LUA_COMPAT_MODULE` inside its `LUA_COMPAT_ALL` block and 5.2's shipped
  // `src/Makefile` passes `-DLUA_COMPAT_ALL`, so **a stock 5.2 build has `package.seeall`**;
  // 5.3 puts the flag under `LUA_COMPAT_5_1` alone while its makefile passes
  // `-DLUA_COMPAT_5_2`, so a stock 5.3 build does not. Same residual as `package.loaders` at
  // 5.2 and `globals.unpack` at 5.2, and no manual in scope names `LUA_COMPAT_MODULE`, so the
  // compatibility route stays out of the prose per T4's and M6's precedent.
  //
  // `ll_seeall` itself is behaviourally identical wherever it exists — reuse the table's
  // metatable if it has one, otherwise make one, then set `__index` to the global table. The
  // only edit is `lua_pushvalue(L, LUA_GLOBALSINDEX)` becoming `lua_pushglobaltable(L)` at
  // `v5.2.0`, a C API spelling change one version after the entry's documented life ends.
  //
  // ### `package.library` — membership, and there is one change to record
  //
  // On the rule `string.library` set: the section's existence and its membership, never the
  // union of its members' behaviour. Derived from the member datasets and checked independently
  // against `grep -o 'pdf-package\.[a-z]*'` over all five manuals, which gives 5.1's
  // `cpath loaded loaders loadlib path preload seeall` and, from 5.2 on,
  // `config cpath loaded loadlib path preload searchers searchpath` unchanged through 5.5. So
  // every membership move in this library happens at one version, and there is no 5.3, 5.4 or
  // 5.5 note — even though `require()` grew a second result at 5.4 and a searcher's answer grew
  // one at 5.2, which are behaviour and live on the members.
  'package.searchpath': packageSearchpath,
  'package.loadlib': packageLoadlib,
  'package.seeall': packageSeeall,
  'package.library': packageLibrary,

  // ## `debug` — batch DB1
  //
  // Manuals read from disk for all five versions; C read at **every** tag of `ldblib.c`,
  // `ldebug.c` and `lauxlib.c` (`v5.1`, `v5.1.1`, `v5.2.0`–`v5.2.3`, `v5.3.0`–`v5.3.6`,
  // `v5.4.0`–`v5.4.8`, `v5.5.0`, `v5.5.1`) plus the two shipped finals with no tag, 5.1.5
  // and 5.2.4, from `www.lua.org/source/5.1/…` and `/5.2/…` — the path takes the *minor*
  // line, `/source/5.1.5/` is a 404. Whole files were diffed per release rather than
  // extracted function bodies, which is what the `io.open` mode-set defect asked for.
  //
  // ### The Debug Library's section number moves twice
  //
  // §5.9 in 5.1, §6.10 in 5.2, 5.3 and 5.4, §6.11 in 5.5. (The *Debug Interface* chapter,
  // which is where `lua_getinfo` and `lua_Debug` live, is §3.8 / §4.9 / §4.9 / §4.7 / §4.7.)
  //
  // ### `debug.getinfo`'s `what` letters, per version — the table the entry is written from
  //
  // Read off `db_getinfo` in `ldblib.c` and `auxgetinfo` in `ldebug.c` at every artefact, not
  // off the manual, because the manual documents `lua_getinfo`'s letters and `db_getinfo`
  // decides which of the filled-in fields reach a Lua table.
  //
  // | Letter | 5.1 | 5.2 | 5.3 | 5.4 | 5.5 |
  // |---|---|---|---|---|---|
  // | `S` | `source`, `short_src`, `linedefined`, `lastlinedefined`, `what` | same | same | same | same |
  // | `l` | `currentline` | same | same | same | same |
  // | `n` | `name`, `namewhat` | same | same | same | same |
  // | `u` | `nups` | + `nparams`, `isvararg` | same | same | same |
  // | `t` | — | `istailcall` | `istailcall` | `istailcall` | + `extraargs` |
  // | `r` | — | — | — | `ftransfer`, `ntransfer` | same |
  // | `f` | `func` | same | same | same | same |
  // | `L` | `activelines` | same | same | same | same |
  //
  // **The default `what` is `"flnSu"` at 5.1, `"flnStu"` at 5.2 and 5.3, `"flnSrtu"` at 5.4
  // and 5.5** — so **`f` is in the default set on every version and `L` is not**. A brief
  // asked this batch to establish "why `f` and `L` are not in the default set"; half of that
  // premise is false, and the entry states the asymmetry outright because it is the fact a
  // reader is most likely to have backwards. The manual agrees from the other side — *all
  // information available, except the table of valid lines*.
  //
  // `srclen` is a `lua_Debug` field under `S` from 5.4 and is **never** a field of the Lua
  // table: `db_getinfo` uses it to push `source` with an explicit length instead of as a
  // NUL-terminated string, so a chunk name containing a zero byte survives from 5.4. Not
  // recorded — no manual states it and nothing in a stock host produces such a name.
  //
  // ### The 5.2 tail-call change is a `getinfo` fact, and no Incompatibilities chapter says so
  //
  // 5.1's `lua_getstack` answers `1` for a *lost* tail call with `ar->i_ci = 0`, and
  // `lua_getinfo` then runs `info_tailcall`, which sets `what` to `"tail"`, `source` to
  // `"=(tail call)"`, `name`/`namewhat` to the empty string, `nups` to `0` and all three line
  // numbers to `-1`; `func` comes back `nil` because `f == NULL`. From `v5.2.0` there is no
  // such level and `t`/`istailcall` replaces it. 5.1's `lua_Debug` documents `"tail"` as a
  // value of `what` and 5.2's does not, and 5.2's `debug.getinfo` passage adds *(except for
  // tail calls, which do not count on the stack)*. **5.2 §8.1 mentions only the hook side of
  // it** ("The event `tail return` in debug hooks was removed"), which is D2's; neither
  // `debug.getinfo` nor `debug.traceback` is named in any Incompatibilities chapter of 5.2,
  // 5.3, 5.4 or 5.5, nor in 5.1's §7.
  //
  // ### `namewhat`'s value set widens twice, and only the first is recorded
  //
  // `""`, `global`, `local`, `method`, `field`, `upvalue` at 5.1; `for iterator`,
  // `metamethod` and `constant` from `v5.2.0`; `hook` from `v5.3.0`. The 5.2 note names two
  // of the new ones and deliberately does not claim a complete list; there is **no 5.3 note**,
  // because `hook` is reachable only from inside a hook function and the entry enumerates
  // nothing that a fourth value would contradict. 5.5's manual is the first to admit its own
  // list is partial (*plus some other options*) and is also the first to drop `method` from
  // it — the C still produces `"method"` at `v5.5.1`, so that is a documentation edit and not
  // a delta.
  //
  // ### Patch-level residuals — recorded because minor-line granularity cannot hold them
  //
  // | Edit | First tag | Effect |
  // |---|---|---|
  // | `luaL_argcheck(options[0] != '>')` in `db_getinfo` | **v5.4.3** | the `<Since v="5.4" />` bullet. At `v5.4.0`–`v5.4.2` a `what` of `">S"` with a *function* still raises (the `>` is doubled and the second is an invalid option), and with a *level* it makes `lua_getinfo` treat whatever is on the stack top as a function. Credited to 5.4, which is what its final release does |
  // | `checkstack(L, L1, 3)` in `db_getinfo` | **5.2.4** and **v5.3.1** | raises `stack overflow` instead of corrupting another thread's stack. Absent at `v5.2.0`–`v5.2.3` and `v5.3.0`. Not observable as a behaviour a program relies on |
  // | `luaL_pushfail` replaces `lua_pushnil` for the out-of-range level | v5.4.0 | the same `nil` |
  // | `l_unlikely` wrappers, `lua_pushstring` → `lua_pushliteral` | v5.4.3 | none |
  //
  // ### `debug.traceback` — one behaviour boundary, and the rest is text
  //
  // 5.1's `db_errorfb` and 5.2's `db_traceback` agree on the rule the entry is built around:
  // a message that is present and is not a string is returned untouched. They disagree on
  // exactly one value. 5.1 tests `lua_isstring`, which is **false for `nil`**, so
  // `debug.traceback(nil)` returns `nil`; from `v5.2.0` the test is `lua_tostring == NULL &&
  // !lua_isnoneornil`, so `nil` joins "no message at all". `lua_isstring` and `lua_tostring`
  // both accept a *number*, so a numeric message is converted and prefixed on every version —
  // the case a reader is most likely to guess the other way, and the reason the entry cards it.
  //
  // The second 5.2 clause is the `level` check: 5.1 does `if (lua_isnumber(...))` and silently
  // uses the default otherwise, `v5.2.0` onwards `luaL_optint`, which raises. `luaL_optint`
  // becomes `luaL_optinteger` at `v5.3.0` and that is the 5.3 note — a fractional level is
  // refused rather than truncated, the same boundary `globals.error`, `globals.collectgarbage`
  // and `io.file-seek` record.
  //
  // **Everything else that moved in a traceback is its text, and nothing is recorded for it.**
  // The tail-call marker arrives with `luaL_traceback` at `v5.2.0`; `pushfuncname` tries a
  // global name first from `v5.3.0` and prints `namewhat 'name'` where 5.1 and 5.2 print
  // `function 'name'`; `v5.4.0` rewrites the abbreviation of a deep stack to say how many
  // levels it skipped; `v5.5.0` reorders `pushfuncname` so a name from the code beats a global
  // one. The entry deliberately asserts only the shape — message, an opening line, one line per
  // call innermost first, an abbreviated middle when the stack is deep — and its Gotcha says in
  // as many words that the text is not something to compare against. **No card prints any part
  // of a traceback except a prefix the card itself supplied.**
  //
  // The literal `stack traceback:` is byte-identical at all 26 artefacts, and is still not
  // named in either entry: naming it would be an assertion on wording, which is the rule
  // `io.close` arrived at for `cannot close standard file`.
  'debug.getinfo': debugGetinfo,
  'debug.traceback': debugTraceback,

  // ## `debug` — batch DB2: the hooks and the locals
  //
  // Same reading discipline as DB1. Manuals on disk for all five; `ldblib.c`, `ldebug.c`,
  // `lapi.c` and `lstate.c` diffed **whole** at every tag (`v5.1`, `v5.1.1`, `v5.2.0`–
  // `v5.2.3`, `v5.3.0`–`v5.3.6`, `v5.4.0`–`v5.4.8`, `v5.5.0`, `v5.5.1`) plus the two
  // shipped finals with no tag, 5.1.5 and 5.2.4, from `www.lua.org/source/5.1/…` and
  // `/5.2/…`. Two of the four boundaries below sit in `db_gethook` and `findvararg` and
  // would have been missed by extrapolating from the ends. Every claim that could be run
  // was run on **two** runtimes — a stock `lua` 5.3.6 binary and the harness's own wasmoon
  // 5.4 — and the two agree on everything shipped.
  //
  // ### The hook mask and the events, per version
  //
  // `makemask` and `unmakemask` in `ldblib.c` are **byte-identical from `v5.1` to
  // `v5.5.1`**, and so is `lua_sethook`'s `if (func == NULL || mask == 0) { mask = 0;
  // func = NULL; }`. So all of this holds on every version:
  //
  // - only `c`, `r` and `l` are recognised; any other letter is passed over in silence;
  // - the count is **not** in the mask string — `count > 0` sets `LUA_MASKCOUNT`, and
  //   `unmakemask` never emits a letter for it, so a hook installed with a count and no
  //   letters reads back with an empty mask and a non-zero count;
  // - `gethook`'s mask is rebuilt in the settled order `c`, `r`, `l`, so `"lc"` reads
  //   back as `"cl"` (probed on 5.3.6 and 5.4);
  // - a mask naming no event **and** no count installs nothing at all — the request is
  //   turned into a removal before it lands.
  //
  // The **events** are the one thing that moved:
  //
  // | Word | 5.1 | 5.2 | 5.3 | 5.4 | 5.5 |
  // |---|---|---|---|---|---|
  // | `"call"` | yes | yes | yes | yes | yes |
  // | `"return"` | yes | yes | yes | yes | yes |
  // | `"line"` | yes | yes | yes | yes | yes |
  // | `"count"` | yes | yes | yes | yes | yes |
  // | `"tail return"` | **yes** | — | — | — | — |
  // | `"tail call"` | — | **yes** | yes | yes | yes |
  //
  // `hooknames[]` in `ldblib.c` ends `"tail return"` at 5.1 and `"tail call"` from
  // `v5.2.0`. 5.1.5's `ldo.c` `callrethooks` fires one `LUA_HOOKTAILRET` per tail call the
  // returning frame absorbed; 5.2.4's `ldo.c` `callhook` instead reports `LUA_HOOKTAILCALL`
  // when the caller's opcode was `OP_TAILCALL`, and no return event follows. **This is the
  // only one of the four functions named in any Incompatibilities chapter** — 5.2 §8.1,
  // *"The event `tail return` in debug hooks was removed"*. Nothing in 5.3, 5.4 or 5.5's
  // §8, nor 5.1's §7, names any of the four.
  //
  // ### What a Lua hook is handed — invariant, and the brief's premise was half wrong
  //
  // `hookf` pushes the event word, then `currentline` if `>= 0` and `nil` otherwise, then
  // `lua_call(L, 2, 0)`. Byte-identical in substance at all five. So a hook is called with
  // **exactly two arguments on every version**, and a *return* hook receives nothing the
  // others do not. What a return hook can reach that the others cannot is the values being
  // handed back, and that arrives at **5.4** with `getinfo`'s `r` option, not as an extra
  // argument: `ftransfer`/`ntransfer` name the window and `debug.getlocal(2, ftransfer)`
  // reads it. Probed: a return hook on a two-argument `add_two` reports `ftransfer` `1` and
  // `ntransfer` `2` on the call event and `3` and `1` on the return event, and reading the
  // return window off level `2` yields the value the function was handing back. A call
  // event's `ftransfer` is `1` on every call, as the 5.4 and 5.5 `lua_Debug` passages both
  // state. 5.1's `lua_sethook` passage says *"You have
  // no access to the values to be returned"*, 5.2's and 5.3's say *"There is no standard
  // way"*, and **5.4 deletes the sentence** — both sides manual-established.
  //
  // ### Yielding from a hook — no Lua-level version story at all
  //
  // The C API gained one at 5.2 (*"Only count and line events can yield"* in `lua_Hook`),
  // and it does **not** reach a hook installed from Lua. `ldblib`'s `hookf` calls the Lua
  // function through `lua_call`, which is `luaD_callnoyield` from 5.2 (`nny++` / the
  // non-yieldable half of `nCcalls`), and 5.1 raises through `lua_yield`'s
  // `L->nCcalls > L->baseCcalls`. So `coroutine.yield()` from a Lua hook raises on **every**
  // version, for line and count events as much as for call and return. Probed on 5.3.6 and
  // 5.4 for both a line hook and a call hook; the resume answers `false`. `sethook`'s
  // Description says this undated, and nothing here contradicts `coroutine/yield.mdx` or
  // `coroutine/isyieldable.mdx`, which frame the same rule as a C function that makes no
  // provision for being picked up again.
  //
  // ### `debug.gethook`'s shape — the 5.4 note, and the case it must not over-claim
  //
  // `db_gethook` returns three values on 5.1, 5.2 and 5.3 whatever the state. `v5.3.0`
  // adds `if (hook == NULL) lua_pushnil(L);`, which changes nothing observable — the 5.1
  // and 5.2 path reaches the same `nil` through an empty hook table. `v5.4.0` turns it into
  // `if (hook == NULL) { luaL_pushfail(L); return 1; }`, and **that** is the delta:
  // `select("#", debug.gethook())` is `3` before 5.4 and `1` from it. Confirmed on both
  // runtimes.
  //
  // The note is careful to say *no hook installed at all*, because a `nil` first value does
  // **not** imply that. `lua_newthread` copies `hook`, `hookmask` and `basehookcount` onto a
  // new thread on all five versions (`lstate.c`, identical), while the Lua function lives in
  // a registry table keyed by thread — so a coroutine created under a hook inherits the mask
  // and the count and *not* the function, and `debug.gethook(that_coroutine)` answers
  // `nil, "l", 40` with three values on 5.4 as well. Probed on both runtimes. `gethook.mdx`
  // owns that case under `#when-there-is-no-hook-to-report`.
  //
  // **Deliberately not recorded:** on 5.1 and 5.2 only, `debug.sethook(f, "")` stores `f` in
  // the hook table *before* `lua_sethook` normalises the empty mask to no hook, so
  // `debug.gethook()` afterwards reports a function that is not installed. `v5.3.0`'s
  // `hook == NULL` test closes it. No entry claims the first value is `nil` exactly when
  // nothing is installed, so nothing on either page depends on it.
  //
  // ### `debug.getlocal` / `debug.setlocal` — where the addressing rules moved
  //
  // 5.1's `findlocal` has no `n < 0` branch and `db_getlocal` runs `luaL_checkint` on its
  // first argument, so **both** the function form and negative indices arrive at `v5.2.0`.
  // `findvararg` is rewritten twice more (`v5.3.0` moves the sign inside, `v5.4.0` moves the
  // extra arguments below `func` and tests `p->is_vararg`) with **no** change in which
  // indices answer: `-1` is the first extra argument and `-nextra` the last, on 5.2 through
  // 5.5. Worked through slot by slot against `adjust_varargs` rather than assumed.
  //
  // `db_setlocal` never accepts a function on any version — `luaL_checkint`/
  // `luaL_checkinteger` on the level, and 5.5's `lua_setlocal` passage finally says so
  // outright (*"`ar` cannot be NULL"*). That asymmetry therefore begins at 5.2, which is
  // why `debug.setlocal`'s 5.2 note carries it: the page states the asymmetry, and a
  // borrowed fact needs a dated surface on the page that borrows it.
  //
  // The 5.3 note on all three of `sethook`, `getlocal` and `setlocal` is the standing
  // `luaL_checkint` → `luaL_checkinteger` boundary — the same one `globals.error`,
  // `globals.collectgarbage`, `io.file-seek`, `debug.getinfo` and `debug.traceback` record.
  //
  // 5.4's note is `<const>`: probed, a `local tax_rate <const> = 0.2` is **absent** from the
  // positions while a `<close>` local is present. 5.5's note is the vararg table —
  // `findvararg` tests `PF_VAHID`, which `lparser.c` sets for every variadic function and
  // clears through `needvatab` when a *named* vararg table has to be materialised. An
  // anonymous `...` always keeps it, so the only spelling that exists before 5.5 keeps
  // working; the note exists because the base prose has to be true on 5.5.
  //
  // ### The generic names are version-unstable and are never printed by a card
  //
  // `(*temporary)` / `(*vararg)` at 5.1–5.3; `(temporary)` / `(C temporary)` / `(vararg)`
  // from `v5.4.0`; a `for` loop's internals are `(for index)`, `(for limit)`, `(for step)`
  // at 5.1–5.3 and three `(for state)` from 5.4. The manual promises only the leading `(`,
  // and that is all either entry asserts — every card that meets one prints
  // `name:sub(1, 1)` or filters on it.
  'debug.sethook': debugSethook,
  'debug.gethook': debugGethook,
  'debug.getlocal': debugGetlocal,
  'debug.setlocal': debugSetlocal,

  // ## `debug` — batch DB3: the upvalues
  //
  // Same reading discipline as DB1 and DB2. All five manuals on disk, read at
  // `pdf-debug.getupvalue`, `pdf-debug.setupvalue`, `pdf-debug.upvalueid`,
  // `pdf-debug.upvaluejoin` **and** at the C-API entries several of them defer to
  // (`lua_getupvalue`, `lua_setupvalue`, `lua_upvalueid`, `lua_upvaluejoin`), which is where
  // most of what these four do is actually written down. `lapi.c` and `ldblib.c` diffed whole
  // at every tag of every line — `v5.1`, `v5.1.1`, `v5.2.0`–`v5.2.3`, `v5.3.0`–`v5.3.6`,
  // `v5.4.0`–`v5.4.8`, `v5.5.0`, `v5.5.1` — plus the shipped 5.1.5 and 5.2.4 from
  // `lua.org/source/5.1` and `/5.2`. Everything runnable was run on the harness's wasmoon 5.4
  // and on a stock `lua` 5.3.6 binary; the two agreed on every card.
  //
  // **None of the four is named in any Incompatibilities chapter** (5.1 §7, 5.2–5.5 §8).
  // `debug.upvalueid` and `debug.upvaluejoin` are absent from the 5.1 manual altogether and
  // absent from 5.1's `ldblib.c`; both arrive together at `v5.2.0`, along with
  // `lua_upvalueid`, `lua_upvaluejoin` and the `getupvalref` helper they share.
  //
  // ### The 5.2 note on `getupvalue`/`setupvalue` — two functions with confusingly close names
  //
  // 5.1's **`ldblib.c`** has `auxupvalue` open with
  // `if (lua_iscfunction(L, 1)) return 0;  /* cannot touch C upvalues from Lua */`, and
  // `v5.2.0` deletes that line. 5.1's **`lapi.c`** has `aux_upvalue` (different function, one
  // underscore apart) handling `f->c.isC` and returning `""` the whole time — so the C API
  // could always do this and `debug.getupvalue` could not. Reading only `lapi.c` gives the
  // wrong answer here, and it is the answer this batch was briefed with.
  //
  // The second half of the same note is `_ENV`: from `v5.2.0` a Lua function that mentions a
  // global carries the environment table as a captured variable, and a chunk compiled from
  // source has it as upvalue `1`. On 5.1 the environment is a per-function property and a main
  // chunk has zero upvalues — the fact `globals/load.mdx` and `globals/getfenv.mdx` already
  // carry, restated here because it is observable through these two calls.
  //
  // ### The generic names, and why no entry quotes one
  //
  // What `aux_upvalue` returns for a Lua upvalue whose name was not kept:
  //
  // | | 5.1 | 5.2 | 5.3 | 5.4 | 5.5 |
  // |---|---|---|---|---|---|
  // | nameless Lua upvalue | *unreachable* | `""` | `(*no name)` | `(no name)` | `(no name)` |
  // | any upvalue of a C function | *unreachable* | `""` | `""` | `""` | `""` |
  //
  // On 5.1 a stripped chunk's `sizeupvalues` is `0`, so every index answers nothing, and
  // `string.dump` there takes no `strip` argument and refuses a function with upvalues at all.
  // **The 5.4 and 5.5 manuals say the stand-in is `'?'`. It is not** — `aux_upvalue` returns
  // `"(no name)"` at every 5.4 and 5.5 tag, and a probe on the 5.4 runtime prints exactly that.
  // No entry quotes any of these, and no entry says an empty name implies a C function, because
  // at 5.2 a nameless Lua upvalue answers with the empty string too.
  //
  // ### `debug.upvalueid` — the 5.4 note
  //
  // `db_upvalueid` answered a bad index by raising through `checkupval` at 5.2 and 5.3;
  // `v5.4.2` rewrites `checkupval` to return `lua_upvalueid`'s result and `db_upvalueid` to
  // push `luaL_pushfail` when it is `NULL`, and `lua_upvalueid` gains the `LUA_VLCF` fallthrough
  // that answers `NULL` for a light C function instead of tripping `api_check`. Credited to 5.4
  // per the standing rule that a line is credited with what its final release has; `v5.4.0` and
  // `v5.4.1` still raise. `debug.upvaluejoin` keeps the raise on every version, which is why the
  // two entries differ on this one point.
  //
  // ### The 5.3 note on all four
  //
  // The standing `luaL_checkint` → `luaL_checkinteger` boundary — `auxupvalue` for the first
  // two, `checkupval` for the other two — the same one `globals.error`,
  // `globals.collectgarbage`, `io.file-seek`, `debug.getinfo`, `debug.traceback`,
  // `debug.sethook`, `debug.getlocal` and `debug.setlocal` record.
  'debug.getupvalue': debugGetupvalue,
  'debug.setupvalue': debugSetupvalue,
  'debug.upvalueid': debugUpvalueid,
  'debug.upvaluejoin': debugUpvaluejoin,

  // ## `debug` — batch DB4: the user values and the registry
  //
  // Same reading discipline as DB1–DB3. All five manuals on disk, read at
  // `pdf-debug.getuservalue`, `pdf-debug.setuservalue` and `pdf-debug.getregistry`, at the
  // C-API entries they defer to (`lua_getuservalue`/`lua_setuservalue` at 5.2 and 5.3,
  // `lua_getiuservalue`/`lua_setiuservalue`/`lua_newuserdatauv` at 5.4 and 5.5), at the
  // Registry section (**§3.5 in 5.1, §4.5 in 5.2 and 5.3, §4.3 in 5.4 and 5.5**), at §2.1's
  // userdata paragraph, at the Debug Library preamble in each, and at every Incompatibilities
  // chapter end to end. `ldblib.c`, `lapi.c`, `lstate.c`, `lauxlib.c`, `lauxlib.h`, `lua.h`,
  // `liolib.c` and `loadlib.c` diffed whole at every tag of every line — `v5.1`, `v5.1.1`,
  // `v5.2.0`–`v5.2.3`, `v5.3.0`–`v5.3.6`, `v5.4.0`–`v5.4.8`, `v5.5.0`, `v5.5.1` — plus the
  // shipped 5.1.5 and 5.2.4 from `lua.org/source/5.1` and `/5.2`. Everything runnable was run
  // on the harness's wasmoon 5.4 and on a stock `lua` 5.3.6 binary.
  //
  // **None of the three is named in any Incompatibilities chapter** (5.1 §7, 5.2–5.5 §8).
  // What *is* named is the C API on both sides of each move: 5.2 §8.1 introduces
  // `lua_getuservalue`/`lua_setuservalue` for what used to be a userdata's *environment*, and
  // 5.4 §8.3 replaces them with `lua_getiuservalue`/`lua_setiuservalue`/`lua_newuserdatauv`.
  // 5.4 §8.3's *"the old names still work as macros assuming one single user value"* is about
  // C source compatibility and says nothing about the Lua-level calls, which really did change
  // shape.
  //
  // ### The user-value pair, per version
  //
  // | | 5.1 | 5.2 | 5.3 | 5.4 | 5.5 |
  // |---|---|---|---|---|---|
  // | values per full userdata | *(no such call)* | exactly one, a table or absent | exactly one, any value | however many it was created with, possibly none | same as 5.4 |
  // | `getuservalue` signature | — | `(u)` | `(u)` | `(u, n)`, `n` defaults to `1` | same |
  // | `getuservalue` returns | — | one value | one value | value, `true` — or one value alone | same |
  // | `getuservalue` on a non-userdata | — | `nil` | `nil` | `nil` | `nil` |
  // | `setuservalue` signature | — | `(udata, value)` | `(udata, value)` | `(udata, value, n)` | same |
  // | `setuservalue` value | — | table or `nil`, optional | any, required | any, required | same |
  // | `setuservalue` returns | — | `udata` | `udata` | `udata`, or `nil` for a missing position | same |
  //
  // `db_getuservalue` and `db_setuservalue` in `ldblib.c` are byte-stable across each line —
  // one edit each, at `v5.4.0`, plus `setuservalue`'s `v5.3.0` `luaL_checkany`. **No
  // patch-level residual anywhere in these three.**
  //
  // **The manual is wrong about the second value.** 5.4 and 5.5 say `debug.getuservalue`
  // returns the value *"plus a boolean, false if the userdata does not have that value"*.
  // `db_getuservalue` pushes `true` and returns `2` when `lua_getiuservalue` answers anything
  // but `LUA_TNONE`, and otherwise returns `1` — so the absent case answers with **one value**
  // and no boolean at all. `select("#", …)` is `2` and `1`; probed on the 5.4 runtime. Both
  // entries state the implication in the safe direction and neither mentions a `false`.
  //
  // **A file handle is the full userdata a Lua program can reach, and it is the wrong shape
  // to demonstrate a write on.** `newprefile` in `liolib.c` calls `lua_newuserdata` at 5.2 and
  // 5.3 — one user value, holding `nil` — and `lua_newuserdatauv(L, sizeof(LStream), 0)` from
  // `v5.4.0`, which is **zero**. So the same card that reads `nil` on every version reads it
  // for two different reasons, and a *successful* write cannot be carded at all on the 5.4
  // runtime. Every card here works on the shape of the answer; the successful path is a
  // fenced listing on both pages, per `package.loadlib`'s precedent.
  //
  // ### `debug.getregistry` — the function never changed, the table did
  //
  // `db_getregistry` is `lua_pushvalue(L, LUA_REGISTRYINDEX); return 1;`, byte-identical at
  // all 28 artefacts. Both notes are about what `init_registry` in `lstate.c` puts in the
  // table, which is where the change hid — in `lua.h` macros rather than in any function:
  //
  // | | 5.1 | 5.2 | 5.3 | 5.4 | 5.5 |
  // |---|---|---|---|---|---|
  // | `LUA_RIDX_GLOBALS` | *(none)* | `2` | `2` | `2` | `2` |
  // | `LUA_RIDX_MAINTHREAD` | *(none)* | `1` | `1` | `1` | **`3`** |
  // | `LUA_RIDX_LAST` | — | `2` | `2` | `2` | **`3`** |
  // | key `1` of a fresh registry | absent | main thread | main thread | main thread | **`false`** |
  // | `luaL_ref`'s free-list head | key `0` | key `0` | key `0` | key `0`, then key `3` from `v5.4.3` | key `1` |
  //
  // 5.1's `f_luaopen` creates an **empty** registry and keeps the global environment in
  // `gt(L)`, reachable from C through the `LUA_GLOBALSINDEX` pseudo-index that 5.2 §8.3
  // removed. So `debug.getregistry()[2] == _G` is false on 5.1 and true on 5.2 through 5.5,
  // which is the 5.2 note. `luaL_ref`'s `freelist` moving to `LUA_RIDX_LAST + 1` at **v5.4.3**
  // is a patch-level residual the site cannot express and no entry depends on.
  //
  // `registry["_LOADED"]` is `package.loaded` at every artefact — `luaL_findtable` at 5.1,
  // `luaL_getsubtable` from `v5.2.0`, `LUA_LOADED_TABLE` from `v5.3.4` — and it is the one
  // named entry the page's cards use. `_PRELOAD` is deliberately **not** used: 5.1's
  // `luaopen_package` makes `package.preload` a fresh table that is not in the registry.
  //
  // Neither the reservation of `_UPPERCASE` string keys (5.2's wording; 5.1 says only "choose
  // keys different from those used by other libraries") nor 5.5's "good practice to require
  // this library" gets a note: both are advice about how to write code, not behaviour a
  // program can observe.
  'debug.getuservalue': debugGetuservalue,
  'debug.setuservalue': debugSetuservalue,
  'debug.getregistry': debugGetregistry,

  // ## `debug` — batch DB5: the metatable pair, the prompt, and the environment pair
  //
  // Same reading discipline as DB1–DB4. All five manuals on disk, read at
  // `pdf-debug.getmetatable`, `pdf-debug.setmetatable`, `pdf-debug.debug`,
  // `pdf-debug.getfenv` and `pdf-debug.setfenv`, at §2.4/§2.8 (Metatables), at 5.1 §2.1 and
  // §2.9 (Environments), at the Debug Library preamble in each, and at every
  // Incompatibilities chapter end to end. `ldblib.c`, `lapi.c` and `lbaselib.c` diffed whole
  // at every tag of every line — `v5.1`, `v5.1.1`, `v5.2.0`–`v5.2.3`, `v5.3.0`–`v5.3.6`,
  // `v5.4.0`–`v5.4.8`, `v5.5.0`, `v5.5.1` — plus the shipped 5.1.5 and 5.2.4 from
  // `lua.org/source/5.1` and `/5.2`, and `luaconf.h` at five tags. Everything runnable was run
  // on the harness's wasmoon 5.4 and on a stock `lua` 5.3.6 binary.
  //
  // **None of the five is named in any Incompatibilities chapter.** 5.2 §8.2's *"Functions
  // `setfenv` and `getfenv` were removed, because of the changes in environments"* names the
  // **basic library's** pair, and §8.3's *"Pseudoindex `LUA_ENVIRONINDEX` and functions
  // `lua_getfenv`/`lua_setfenv` were removed"* names the C API's. The `debug.*` pair is
  // removed by silence — DB1 flagged this and it holds: no manual from 5.2 on contains the
  // string `fenv` at all.
  //
  // ### `debug.getfenv` / `debug.setfenv` — the removal, and how it compares with the globals
  //
  // Both axes agree, at the same version, and it is the **same version the globals pair
  // leaves at** (`globals.getfenv`/`globals.setfenv`, `version_removed: "5.2"`):
  //
  // | | manual | `ldblib.c` | `lbaselib.c` |
  // |---|---|---|---|
  // | 5.1 | entries `pdf-debug.getfenv`, `pdf-debug.setfenv` | `db_getfenv`, `db_setfenv` registered unguarded | `getfenv`, `setfenv` registered unguarded |
  // | 5.2 | no mention of either anywhere in the file | absent from `v5.2.0` on, in any form | absent from `v5.2.0` on |
  //
  // There is **no compatibility switch** for either pair: `luaconf.h` at `v5.2.0` names
  // `LUA_COMPAT_UNPACK`, `LUA_COMPAT_LOADERS`, `LUA_COMPAT_LOG10`, `LUA_COMPAT_LOADSTRING`,
  // `LUA_COMPAT_MAXN` and `LUA_COMPAT_MODULE`, and nothing `fenv`-shaped at any tag of any
  // line. So this is not the `package.seeall`/`module` shape, where the two axes part company
  // — checked rather than assumed, per the standing rule.
  //
  // `lua_getfenv` answers for a function (C or Lua), a full userdata and a thread, and pushes
  // `nil` for everything else; `lua_setfenv` writes the same three and returns `0` otherwise,
  // which `db_setfenv` turns into a raise. Shipped 5.1.5's `db_getfenv` opens with
  // `luaL_checkany(L, 1)`; `v5.1` and `v5.1.1` do not, which is a patch-level residual the
  // site cannot express — the line is credited with what its final release has.
  //
  // ### `debug.getmetatable` — nothing moved
  //
  // `db_getmetatable` is **byte-identical at all 28 artefacts**, and so is the shape of
  // `lua_getmetatable` behind it (the edits are `ttype`→`ttypenv`→`ttnov`→`ttype` and
  // `L->top`→`L->top.p`, none Lua-visible). A table and a full userdata carry their own; every
  // other type reads `G(L)->mt[type]`, one metatable per basic type on every version. No
  // `changed_in`.
  //
  // The difference from the basic library's call is exactly one thing: `luaB_getmetatable`
  // ends with `luaL_getmetafield(L, 1, "__metatable")` and `db_getmetatable` does not. Both
  // open with `luaL_checkany(L, 1)`, so both take any value and both refuse an empty call.
  //
  // ### `debug.setmetatable` — the return moved at 5.2, and that is the pair's one delta
  //
  // ```c
  // lua_pushboolean(L, lua_setmetatable(L, 1)); return 1;   /* v5.1 → shipped 5.1.5 */
  // lua_setmetatable(L, 1); return 1;  /* return 1st argument */   /* v5.2.0 → v5.5.1 */
  // ```
  //
  // `lua_setmetatable` returns `1` unconditionally at every tag, so the 5.1 answer is `true`
  // whatever happened — it is not a success report. `v5.4.0`'s `luaL_argcheck` →
  // `luaL_argexpected` is message text only and is not recorded.
  //
  // **Deliberately not recorded: the 5.2 finalizer change.** `lua_setmetatable` gains
  // `luaC_checkfinalizer` at `v5.2.0`, so from 5.2 a metatable carrying `__gc` attached from
  // here marks a table for finalization, and a userdata's finalizer becomes set-time rather
  // than collection-time. Both halves are observable through this call. Neither is stated in
  // this entry's prose — `globals.setmetatable`'s 5.2 note owns the table half and no page
  // yet owns the userdata half — and DB2's decision 2 is the precedent for carrying a chip
  // only for a fact the page states. (`v5.2.0`/`v5.2.1` also call `luaC_checkfinalizer`
  // outside the `if (mt)` guard; with a `NULL` metatable it returns immediately, so nothing
  // is observable. Fixed at `v5.2.2`.)
  //
  // ### `debug.debug` — what changed is what it does with an error
  //
  // `db_debug` is a `fgets`/`luaL_loadbuffer`/`lua_pcall` loop, ended by a line that is
  // exactly `cont` plus a newline or by end-of-input, with `lua_settop(L, 0)` discarding
  // whatever a line returned. The **only** Lua-visible edit is at `v5.4.0`:
  // `lua_tostring(L, -1)` becomes `luaL_tolstring(L, -1, NULL)`, so the reported text is
  // produced the way `tostring()` produces it and a `__tostring` field is consulted. Before
  // that, `lua_tostring` answers `NULL` for anything that is not already a string or a number.
  //
  // Two edits are **not** recorded. `fputs`/`luai_writestringerror`/`lua_writestringerror`
  // (5.2, 5.3) are the same write to the error stream under three spellings. `v5.5.1` changes
  // `luaL_loadbuffer` to `luaL_loadbufferx(..., "t")`, so a typed line is read as text only;
  // it is patch-level inside 5.5, nothing on the page depends on it, and DB1 saw the same edit
  // and left it alone.
  'debug.getmetatable': debugGetmetatable,
  'debug.setmetatable': debugSetmetatable,
  'debug.debug': debugDebug,
  'debug.getfenv': debugGetfenv,
  'debug.setfenv': debugSetfenv,

  // ## `debug.library` — batch DB6: the section's own node, and the last of the library
  //
  // On the rule `string.library` set and every section since has followed: the library's
  // existence and its **membership**, never the union of its members' behaviour. This
  // section is where that rule is easiest to break — twelve of the nineteen entries carry a
  // `changed_in` of their own, and the temptation is to summarise them here. None of it is
  // here; each fact lives on the entry where it is observable.
  //
  // ### Membership, derived twice
  //
  // `grep -o 'pdf-debug\.[a-z]*' <each>.html | sort -u`, over all five manuals on disk. DB1
  // did this first and DB5 reproduced it; this batch reproduced it a third time, and the
  // result is unchanged:
  //
  // | Manual | The `debug` table |
  // |---|---|
  // | 5.1 | `debug` `getfenv` `gethook` `getinfo` `getlocal` `getmetatable` `getregistry` `getupvalue` `setfenv` `sethook` `setlocal` `setmetatable` `setupvalue` `traceback` — 14 |
  // | 5.2 | the 14, less `getfenv` and `setfenv`, plus `getuservalue` `setuservalue` `upvalueid` `upvaluejoin` — 16 |
  // | 5.3 / 5.4 / 5.5 | identical to 5.2 |
  //
  // **Every membership move in this library happens at 5.2**, which is why there is one
  // `changed_in` and no other. Two leave and four arrive in the same release, so the note
  // carries both halves — the strip cannot express two chips on one version, and DB3's
  // decision 3 is the precedent for folding them together.
  //
  // The removal ruling gives 5.2 for the two departures directly: 5.1's manual asserts their
  // existence with an entry each, and no later manual mentions either. **Do not cite 5.2
  // §8.2 as the evidence** — its *"Functions `setfenv` and `getfenv` were removed"* is about
  // the basic library's pair, and §8.3's `lua_getfenv`/`lua_setfenv` sentence is about the C
  // API's. Those two sentences are the only occurrences of the string `fenv` in the 5.2
  // manual, and 5.3, 5.4 and 5.5 contain none at all. (DB5's report says no manual from 5.2
  // on contains the string anywhere; that is right for 5.3–5.5 and overstated for 5.2, where
  // the count is two. The two `debug` entries' datasets were derived from `ldblib.c` rather
  // than from that sentence, so nothing shipped depends on the overstatement.)
  //
  // ### The preamble's five facts, and why none of them is a note
  //
  // Read in all five (§5.9 in 5.1, §6.10 in 5.2–5.4, §6.11 in 5.5). Identical in 5.2, 5.3 and
  // 5.4; 5.1 words it differently; 5.5 adds one sentence.
  //
  // 1. **The care warning** — several of these functions violate basic assumptions about Lua
  //    code (that a function's locals cannot be reached from outside; that userdata metatables
  //    cannot be changed from Lua; that Lua programs do not crash) and can therefore
  //    compromise otherwise secure code. 5.1 names the first two and not the crashing, and
  //    adds *"Please resist the temptation to use them as a usual programming tool."* The
  //    overview states the warning undated: it is a description of what the library can do,
  //    true on every line, and the third assumption is breakable on 5.1 too — only 5.1's
  //    manual is silent about it.
  // 2. **Speed** — 5.1 *"they can be very slow"*, 5.2+ *"some functions in this library may be
  //    slow"*. A caution, not a behaviour. DB1's judgement, unchanged.
  // 3. **Everything is in the table `debug`.** True on all five.
  // 4. **The optional first `thread` argument.** The preamble says *all* functions that
  //    operate over a thread take one; that is six of the nineteen (`getinfo`, `traceback`,
  //    `sethook`, `gethook`, `getlocal`, `setlocal`), and the other thirteen take none.
  //    `debug.getinfo#looking-at-another-thread` owns the rule; the overview links it.
  // 5. **5.5 only:** *"It is good practice to always require this library explicitly before
  //    using it."* Advice about how to write code, not behaviour a program can observe —
  //    DB1's, DB4's and DB5's ruling on the same sentence, and G11's precedent for dropping a
  //    claim supported by one manual out of five.
  //
  // **No `debug` function is documented as a security risk in its own passage.** Grepped all
  // five for `secur|risk|insecure|unsafe`: the only hits are `package.loadlib`'s *"This
  // function is inherently insecure"* (5.4, 5.5) and `os.tmpname`'s *"to avoid security
  // risks"*. The security statement for this library is the preamble's *"can compromise
  // otherwise secure code"*, and it is library-wide.
  'debug.library': debugLibrary,
};

export const compatNodes: Record<string, CompatNode> = Object.fromEntries(
  Object.entries(raw).map(([key, value]) => [key, compatNodeSchema.parse(value)]),
);

export function compatNodeFor(key: string | undefined | null): CompatNode | null {
  if (!key) return null;
  return compatNodes[key] ?? null;
}
