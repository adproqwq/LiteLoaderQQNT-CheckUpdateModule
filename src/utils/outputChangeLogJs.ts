import fs from 'node:fs';

export default (slug: string, changeLogFile: string) => {
  const changeLogBuffer = fs.readFileSync(`${LiteLoader.plugins[slug].path.plugin}/${changeLogFile}.md`, { encoding: 'utf-8' });
  let changeLog = changeLogBuffer.toString();

  changeLog = changeLog.replaceAll('`', '\\`').replaceAll('$', '\\$');

  const showChangeLogJs = `const changeLog = \`${changeLog}\`;
  document.getElementsByClassName('container')[0].innerHTML = DOMPurify.sanitize(marked.parse(changeLog));
  `;

  fs.writeFileSync(`${LiteLoader.plugins.LiteLoaderQQNT_CheckUpdateModule.path.plugin}/assets/showChangeLog.js`, showChangeLogJs, { flag: 'w' });
};