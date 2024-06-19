import { config } from '../config/config';
import ping from 'ping';

export default async (): Promise<['total' | 'domain' | 'off', string]> => {
  const pluginSlug = 'LiteLoaderQQNT_CheckUpdateModule';

  const userConfig = await LiteLoader.api.config.get(pluginSlug, config);

  if(userConfig.experiment.mirrors[0].type == 'off') return ['off', userConfig.experiment.mirrors[0].domain];

  let pingResult: Map<number, number> = new Map();

  userConfig.experiment.mirrors.forEach(async (m, i) => {
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

  return [userConfig.experiment.mirrors[index].type, userConfig.experiment.mirrors[index].domain];
};