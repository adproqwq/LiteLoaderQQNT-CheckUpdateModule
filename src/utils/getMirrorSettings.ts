import { config } from '../config/config';

export default async (): Promise<['total' | 'domain', string]> => {
  const pluginSlug = 'LiteLoaderQQNT_CheckUpdateModule';

  const userConfig = await LiteLoader.api.config.get(pluginSlug, config);
  if(!userConfig.experiment.mirror){
    userConfig.experiment.mirror = config.experiment.mirror;
    await LiteLoader.api.config.set(pluginSlug, userConfig);
  }
  return [userConfig.experiment.mirror.type, userConfig.experiment.mirror.domain];
};