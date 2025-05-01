'use client';

export interface INavLink {
  title: string;
  href: string;
}

export interface INavGroup {
  title: string;
  href?: string;
  links: Array<INavLink | { title: string; links: INavLink[] }>;
}

export const navigation: Array<INavGroup> = [
  {
    title: 'Getting started',
    links: [
      { title: 'Introduction', href: '/docs/introduction' },
      { title: 'FAQ', href: '/docs/faq' },
      { title: "Governance", href: "/docs/governance" },
      { title: "Contributing", href: "/docs/contribution-guide" }
    ],
  },
  {
    title: "Table",
    links: [
      {
        title: "Table Methods",
        links: [
          { title: "Table", href: "/docs/functions/table" },
          { title: "Table.Concat()", href: "/docs/functions/table/concat" },
          { title: "Table.Insert()", href: "/docs/functions/table/insert" },
          { title: "Table.Move()", href: "/docs/functions/table/move" },
          { title: "Table.Pack()", href: "/docs/functions/table/pack" },
          { title: "Table.Remove()", href: "/docs/functions/table/remove" },
          { title: "Table.Sort()", href: "/docs/functions/table/sort" },
          { title: "Table.Unpack()", href: "/docs/functions/table/unpack" }
        ]
      },
      {
        title: "Static Utilities",
        links: [
          { title: "setmetatable()", href: "/docs/functions/table/setmetatable" },
          { title: "getmetatable()", href: "/docs/functions/table/getmetatable" },
          { title: "rawset()", href: "/docs/functions/table/rawset" },
          { title: "rawget()", href: "/docs/functions/table/rawget" },
          { title: "pairs()", href: "/docs/functions/table/pairs" },
          { title: "ipairs()", href: "/docs/functions/table/ipairs" },
          { title: "next()", href: "/docs/functions/table/next" }
        ]
      }
    ]
  },
  {
    title: "String",
    links: [
      { title: "String", href: "/docs/functions/string" },
      { title: "string.byte()", href: "/docs/functions/string/byte" },
      { title: "string.char()", href: "/docs/functions/string/char" },
      { title: "string.dump()", href: "/docs/functions/string/dump" },
      { title: "string.find()", href: "/docs/functions/string/find" },
      { title: "string.format()", href: "/docs/functions/string/format" },
      { title: "string.gmatch()", href: "/docs/functions/string/gmatch" },
      { title: "string.gsub()", href: "/docs/functions/string/gsub" },
      { title: "string.len()", href: "/docs/functions/string/len" },
      { title: "string.lower()", href: "/docs/functions/string/lower" },
      { title: "string.match()", href: "/docs/functions/string/match" },
      { title: "string.pack()", href: "/docs/functions/string/pack" },
      { title: "string.packsize()", href: "/docs/functions/string/packsize" },
      { title: "string.rep()", href: "/docs/functions/string/rep" },
      { title: "string.reverse()", href: "/docs/functions/string/reverse" },
      { title: "string.sub()", href: "/docs/functions/string/sub" },
      { title: "string.unpack()", href: "/docs/functions/string/unpack" },
      { title: "string.upper()", href: "/docs/functions/string/upper" }
    ]
  },
  {
    title: "Math",
    links: [
      { title: "Math", href: "/docs/functions/math" },
      { title: "math.abs()", href: "/docs/functions/math/abs" },
      { title: "math.acos()", href: "/docs/functions/math/acos" },
      { title: "math.asin()", href: "/docs/functions/math/asin" },
      { title: "math.atan()", href: "/docs/functions/math/atan" },
      { title: "math.ceil()", href: "/docs/functions/math/ceil" },
      { title: "math.cos()", href: "/docs/functions/math/cos" },
      { title: "math.deg()", href: "/docs/functions/math/deg" },
      { title: "math.exp()", href: "/docs/functions/math/exp" },
      { title: "math.floor()", href: "/docs/functions/math/floor" },
      { title: "math.fmod()", href: "/docs/functions/math/fmod" },
      { title: "math.huge", href: "/docs/functions/math/huge" },
      { title: "math.log()", href: "/docs/functions/math/log" },
      { title: "math.max()", href: "/docs/functions/math/max" },
      { title: "math.maxinteger", href: "/docs/functions/math/maxinteger" },
      { title: "math.min()", href: "/docs/functions/math/min" },
      { title: "math.mininteger", href: "/docs/functions/math/mininteger" },
      { title: "math.modf()", href: "/docs/functions/math/modf" },
      { title: "math.pi", href: "/docs/functions/math/pi" },
      { title: "math.rad()", href: "/docs/functions/math/rad" },
      { title: "math.random()", href: "/docs/functions/math/random" },
      { title: "math.randomseed()", href: "/docs/functions/math/randomseed" },
      { title: "math.sin()", href: "/docs/functions/math/sin" },
      { title: "math.sqrt()", href: "/docs/functions/math/sqrt" },
      { title: "math.tan()", href: "/docs/functions/math/tan" },
      { title: "math.tointeger()", href: "/docs/functions/math/tointeger" },
      { title: "math.type()", href: "/docs/functions/math/type" },
      { title: "math.ult()", href: "/docs/functions/math/ult" }
    ]
  },
  {
    title: "Coroutine",
    links: [
      { title: "Coroutine", href: "/docs/functions/coroutine" },
      { title: "coroutine.close()", href: "/docs/functions/coroutine/close" },
      { title: "coroutine.create()", href: "/docs/functions/coroutine/create" },
      { title: "coroutine.isyieldable()", href: "/docs/functions/coroutine/isyieldable" },
      { title: "coroutine.resume()", href: "/docs/functions/coroutine/resume" },
      { title: "coroutine.running()", href: "/docs/functions/coroutine/running" },
      { title: "coroutine.status()", href: "/docs/functions/coroutine/status" },
      { title: "coroutine.wrap()", href: "/docs/functions/coroutine/wrap" },
      { title: "coroutine.yield()", href: "/docs/functions/coroutine/yield" }
    ]
  },
  {
    title: "IO",
    links: [
      { title: "io", href: "/docs/functions/io" },
      { title: "io.close()", href: "/docs/functions/io/close" },
      { title: "io.flush()", href: "/docs/functions/io/flush" },
      { title: "io.input()", href: "/docs/functions/io/input" },
      { title: "io.lines()", href: "/docs/functions/io/lines" },
      { title: "io.open()", href: "/docs/functions/io/open" },
      { title: "io.output()", href: "/docs/functions/io/output" },
      { title: "io.popen()", href: "/docs/functions/io/popen" },
      { title: "io.read()", href: "/docs/functions/io/read" },
      { title: "io.stderr()", href: "/docs/functions/io/stderr" },
      { title: "io.stdin()", href: "/docs/functions/io/stdin" },
      { title: "io.stdout()", href: "/docs/functions/io/stdout" },
      { title: "io.tmpfile()", href: "/docs/functions/io/tmpfile" },
      { title: "io.type()", href: "/docs/functions/io/type" },
      { title: "io.write()", href: "/docs/functions/io/write" },
      { title: "file:close()", href: "/docs/functions/file/close" },
      { title: "file:flush()", href: "/docs/functions/file/flush" },
      { title: "file:lines()", href: "/docs/functions/file/lines" },
      { title: "file:read()", href: "/docs/functions/file/read" },
      { title: "file:seek()", href: "/docs/functions/file/seek" },
      { title: "file:setvbuf()", href: "/docs/functions/file/setvbuf" },
      { title: "file:write()", href: "/docs/functions/file/write" }
    ]
  },
  {
    title: "OS",
    links: [
      { title: "os", href: "/docs/functions/os" },
      { title: "os.clock()", href: "/docs/functions/os/clock" },
      { title: "os.date()", href: "/docs/functions/os/date" },
      { title: "os.difftime()", href: "/docs/functions/os/difftime" },
      { title: "os.execute()", href: "/docs/functions/os/execute" },
      { title: "os.exit()", href: "/docs/functions/os/exit" },
      { title: "os.getenv()", href: "/docs/functions/os/getenv" },
      { title: "os.remove()", href: "/docs/functions/os/remove" },
      { title: "os.rename()", href: "/docs/functions/os/rename" },
      { title: "os.setlocale()", href: "/docs/functions/os/setlocale" },
      { title: "os.time()", href: "/docs/functions/os/time" },
      { title: "os.tmpname()", href: "/docs/functions/os/tmpname" }
    ]
  },
  {
    title: "Package",
    links: [
      { title: "Package", href: "/docs/functions/package" },
      { title: "package.config()", href: "/docs/functions/package/config" },
      { title: "package.cpath()", href: "/docs/functions/package/cpath" },
      { title: "package.loaded()", href: "/docs/functions/package/loaded" },
      { title: "package.loadlib()", href: "/docs/functions/package/loadlib" },
      { title: "package.path()", href: "/docs/functions/package/path" },
      { title: "package.preload()", href: "/docs/functions/package/preload" },
      { title: "package.searchers()", href: "/docs/functions/package/searchers" },
      { title: "package.searchpath()", href: "/docs/functions/package/searchpath" }
    ]
  },
  {
    title: "Debug",
    links: [
      { title: "Debug", href: "/docs/functions/debug" },
      { title: "debug.debug()", href: "/docs/functions/debug/debug" },
      { title: "debug.gethook()", href: "/docs/functions/debug/gethook" },
      { title: "debug.getinfo()", href: "/docs/functions/debug/getinfo" },
      { title: "debug.getlocal()", href: "/docs/functions/debug/getlocal" },
      { title: "debug.getmetatable()", href: "/docs/functions/debug/getmetatable" },
      { title: "debug.getregistry()", href: "/docs/functions/debug/getregistry" },
      { title: "debug.getupvalue()", href: "/docs/functions/debug/getupvalue" },
      { title: "debug.getuservalue()", href: "/docs/functions/debug/getuservalue" },
      { title: "debug.sethook()", href: "/docs/functions/debug/sethook" },
      { title: "debug.setlocal()", href: "/docs/functions/debug/setlocal" },
      { title: "debug.setmetatable()", href: "/docs/functions/debug/setmetatable" },
      { title: "debug.setupvalue()", href: "/docs/functions/debug/setupvalue" },
      { title: "debug.setuservalue()", href: "/docs/functions/debug/setuservalue" },
      { title: "debug.traceback()", href: "/docs/functions/debug/traceback" },
      { title: "debug.upvalueid()", href: "/docs/functions/debug/upvalueid" },
      { title: "debug.upvaluejoin()", href: "/docs/functions/debug/upvaluejoin" }
    ]
  },
  {
    title: "UTF8",
    links: [
      { title: "utf8", href: "/docs/functions/utf8" },
      { title: "utf8.char()", href: "/docs/functions/utf8/char" },
      { title: "utf8.charpattern()", href: "/docs/functions/utf8/charpattern" },
      { title: "utf8.codepoint()", href: "/docs/functions/utf8/codepoint" },
      { title: "utf8.codes()", href: "/docs/functions/utf8/codes" },
      { title: "utf8.len()", href: "/docs/functions/utf8/len" },
      { title: "utf8.offset()", href: "/docs/functions/utf8/offset" }
    ]
  }
];
