import { scaffoldContent } from '../src/content-tree/scaffold';
import { CONTENT_TREE } from '../src/content-tree/manifest';

const stats = await scaffoldContent('content/docs', CONTENT_TREE);

console.log(
  `scaffold: ${stats.written} written, ${stats.unchanged} unchanged, ` +
    `${stats.kept} hand-edited ${stats.kept === 1 ? 'file' : 'files'} kept`,
);

// Never deleted automatically — an over-eager delete could eat authored work. Naming
// them turns a silent stale file into something a reader of the summary has to act on.
if (stats.orphans.length > 0) {
  console.log(
    `scaffold: ${stats.orphans.length} ${stats.orphans.length === 1 ? 'file' : 'files'} ` +
      'the manifest no longer calls for — remove by hand if a slug was renamed:',
  );
  for (const rel of stats.orphans) console.log(`  ${rel}`);
}
