import { ISettingMirrorConfig } from '../config/config';
import ping from 'ping';

export default async (slug: string, mirrorsMap: Map<string, ISettingMirrorConfig[]>): Promise<['total' | 'domain' | 'off', string]> => {
  const mirrors = mirrorsMap.get(slug);
  const defaultDomain = 'https://example.com';

  if(!mirrors || mirrors[0].type == 'off') return ['off', defaultDomain];

  const pingResult: Map<number, number> = new Map();

  mirrors.forEach(async (m, i) => {
    if(m.type == 'off') return;

    const host = new URL(m.domain).host;
    const time = (await ping.promise.probe(host)).time;
    if(time != 'unknown') pingResult.set(i, time);
  });
  let min: number = 100000000, index: number = 0;
  pingResult.forEach((t, i) => {
    if(t < min){
      min = t;
      index = i;
    }
  });

  return [mirrors[index].type, mirrors[index].domain];
};