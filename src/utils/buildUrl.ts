export default (type: 'code' | 'release' | 'raw', repo: string, branch?: string, tag?: string, file?: string) => {
  if(type == 'code') return `https://github.com/${repo}/archive/refs/heads/${branch}.zip`;
  else if(type == 'release') return `https://github.com/${repo}/releases/download/${tag}/${file}`;
  else return `https://raw.githubusercontent.com/${repo}/${branch}/${file}`;
};