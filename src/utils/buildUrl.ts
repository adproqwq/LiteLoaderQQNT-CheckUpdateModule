export interface IUrlBuildConfig {
  repo: string;
  branch?: string;
  tag?: string;
  file?: string;
};

export default (type: 'code' | 'release' | 'raw', config: IUrlBuildConfig) => {
  if(type == 'code') return `https://github.com/${config.repo}/archive/refs/heads/${config.branch}.zip`;
  else if(type == 'release') return `https://github.com/${config.repo}/releases/download/${config.tag}/${config.file}`;
  else return `https://raw.githubusercontent.com/${config.repo}/${config.branch}/${config.file}`;
};