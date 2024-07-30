import { compare } from 'semver';

export default (minLLVersion: string): boolean => {
  if(compare(LiteLoader.versions.liteloader, minLLVersion) >= 0) return true;
  else return false;
};