export interface IUrlBuildConfig {
  repo: string;
  branch?: string;
  tag?: string;
  file?: string;
};

export default (type: 'release' | 'raw', config: IUrlBuildConfig) => {
  if(type == 'release') return `https://github.com/${config.repo}/releases/download/${config.tag}/${config.file}`;
  else return `https://raw.githubusercontent.com/${config.repo}/${config.branch}/${config.file}`;
};