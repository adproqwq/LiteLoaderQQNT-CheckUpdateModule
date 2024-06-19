import fs from 'node:fs/promises';
import { marked } from 'marked';

export default async (slug: string, changeLogFile: string) => {
  marked.setOptions({
    gfm: true,
    breaks: false,
    pedantic: false,
  });
  const changeLogMd = await fs.readFile(`${LiteLoader.plugins[slug].path.plugin}/${changeLogFile}.md`, 'utf-8');
  await fs.writeFile(`${LiteLoader.plugins.LiteLoaderQQNT_CheckUpdateModule.path.plugin}/assets/changeLog.html`, await marked(changeLogMd));
};