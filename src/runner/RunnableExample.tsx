import { useState } from 'react';
import { runLua } from './runLua';
import { useSelectedVersion } from '@/version/SelectedVersionProvider';

/**
 * The Lua version the runtime actually executes. Wasmoon ships a single Lua, so
 * examples run this version whatever the reader has selected — see
 * `docs/plans/2026-08-04-per-version-lua-spike.md`. Until per-version runtimes
 * exist, the mismatch is disclosed rather than hidden.
 */
export const RUNTIME_LUA_VERSION = '5.4';

export function RunnableExample({ code }: { code: string }) {
  const { version } = useSelectedVersion();
  const [source, setSource] = useState(code);
  const [output, setOutput] = useState('');
  const [running, setRunning] = useState(false);

  async function run() {
    setRunning(true);
    try {
      const r = await runLua(source);
      setOutput(r.error ? `error: ${r.error}` : r.output);
    } catch (err) {
      setOutput(`error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="rounded border">
      <textarea value={source} onChange={(e) => setSource(e.target.value)} className="w-full font-mono" rows={4} />
      <div className="flex gap-2 p-2">
        <button onClick={run} disabled={running}>{running ? 'Running…' : 'Run'}</button>
        <button onClick={() => setSource(code)}>Reset</button>
        {version !== RUNTIME_LUA_VERSION && (
          <span role="note" aria-label="Runtime version" className="text-xs opacity-70">
            Runs Lua {RUNTIME_LUA_VERSION}; output may differ from {version}.
          </span>
        )}
      </div>
      {output && <pre className="p-2" aria-label="output">{output}</pre>}
    </div>
  );
}
