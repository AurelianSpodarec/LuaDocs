import { useState } from 'react';
import { runLua } from './runLua';

export function RunnableExample({ code }: { code: string }) {
  const [source, setSource] = useState(code);
  const [output, setOutput] = useState('');
  const [running, setRunning] = useState(false);

  async function run() {
    setRunning(true);
    const r = await runLua(source);
    setOutput(r.error ? `error: ${r.error}` : r.output);
    setRunning(false);
  }

  return (
    <div className="rounded border">
      <textarea value={source} onChange={(e) => setSource(e.target.value)} className="w-full font-mono" rows={4} />
      <div className="flex gap-2 p-2">
        <button onClick={run} disabled={running}>{running ? 'Running…' : 'Run'}</button>
        <button onClick={() => setSource(code)}>Reset</button>
      </div>
      {output && <pre className="p-2" aria-label="output">{output}</pre>}
    </div>
  );
}
