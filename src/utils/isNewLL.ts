import { compare } from 'semver';

export default (): boolean => {
  if(compare(LiteLoader.versions.liteloader, '1.2.0') >= 0) return true;
  else return false;
};