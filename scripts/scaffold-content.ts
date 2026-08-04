import { scaffoldContent } from '../src/content-tree/scaffold';
import { CONTENT_TREE } from '../src/content-tree/manifest';

const stats = await scaffoldContent('content/docs', CONTENT_TREE);

console.log(
  `scaffold: ${stats.written} written, ${stats.unchanged} unchanged, ` +
    `${stats.kept} authored ${stats.kept === 1 ? 'entry' : 'entries'} kept`,
);
