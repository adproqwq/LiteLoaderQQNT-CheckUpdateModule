import fs from 'node:fs';

export default () => {
  const changeLogBuffer = fs.readFileSync(`${LiteLoader.plugins.LiteLoaderQQNT_CheckUpdateModule.path.plugin}/changeLog.md`, { encoding: 'utf-8' });
  let changeLog = changeLogBuffer.toString();

  changeLog = changeLog.replaceAll('`', '\\`').replaceAll('$', '\\$');

  const showChangeLogJs = `const changeLog = \`${changeLog}\`;
  document.getElementsByClassName('container')[0].innerHTML = DOMPurify.sanitize(marked.parse(changeLog));
  `;

  fs.writeFileSync(`${LiteLoader.plugins.LiteLoaderQQNT_CheckUpdateModule.path.plugin}/assets/showChangeLog.js`, showChangeLogJs, { flag: 'w' });
};