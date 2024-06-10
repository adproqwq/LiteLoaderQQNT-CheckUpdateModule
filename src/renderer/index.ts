import { config, ISettingConfig } from '../config/config';

export const onSettingWindowCreated = async (view: HTMLElement) => {
  const pluginSlug = 'LiteLoaderQQNT_CheckUpdateModule';
  let userConfig: ISettingConfig = await LiteLoader.api.config.get(pluginSlug, config);
  const pluginPath = LiteLoader.plugins[pluginSlug].path.plugin;
  const settingsPage = await (await fetch(`local:///${pluginPath}/pages/settings.html`)).text();

  view.innerHTML = settingsPage;
  (view.querySelector('#pluginVersion') as HTMLParagraphElement).innerHTML = LiteLoader.plugins[pluginSlug].manifest.version;
  if(userConfig.experiment.disable_auto_update){
    (view.querySelector('#disable_auto_update') as HTMLInputElement).setAttribute('is-active', '');
  }
  if(userConfig.experiment.output_compFunc){
    (view.querySelector('#output_compFunc') as HTMLInputElement).setAttribute('is-active', '');
  }

  (view.querySelector('#disable_auto_update') as HTMLInputElement).addEventListener('click', async () => {
    if(userConfig.experiment.disable_auto_update){
      (view.querySelector('#disable_auto_update') as HTMLInputElement).removeAttribute('is-active');
      userConfig.experiment.disable_auto_update = false;
      await LiteLoader.api.config.set(pluginSlug, userConfig);
    }
    else{
      (view.querySelector('#disable_auto_update') as HTMLInputElement).setAttribute('is-active', '');
      userConfig.experiment.disable_auto_update = true;
      await LiteLoader.api.config.set(pluginSlug, userConfig);
    }
  });

  (view.querySelector('#output_compFunc') as HTMLInputElement).addEventListener('click', async () => {
    if(userConfig.experiment.output_compFunc){
      (view.querySelector('#output_compFunc') as HTMLInputElement).removeAttribute('is-active');
      userConfig.experiment.output_compFunc = false;
      await LiteLoader.api.config.set(pluginSlug, userConfig);
    }
    else{
      (view.querySelector('#output_compFunc') as HTMLInputElement).setAttribute('is-active', '');
      userConfig.experiment.output_compFunc = true;
      await LiteLoader.api.config.set(pluginSlug, userConfig);
    }
  });

  (view.querySelector('#set_mirror') as HTMLButtonElement).addEventListener('click', () => {
    LiteLoader.api.openExternal('https://github.com/adproqwq/LiteLoaderQQNT-CheckUpdateModule/blob/main/mirror.md');
  });

  (view.querySelector('#feedback_mirror') as HTMLButtonElement).addEventListener('click', () => {
    LiteLoader.api.openExternal('https://github.com/adproqwq/LiteLoaderQQNT-CheckUpdateModule/issues/new?labels=bug&template=bug-report.yaml&title=[Bug]:+');
  });

  (view.querySelector('#api') as HTMLButtonElement).addEventListener('click', () => {
    LiteLoader.api.openExternal('https://github.com/adproqwq/LiteLoaderQQNT-CheckUpdateModule/blob/main/API.md');
  });

  (view.querySelector('#github') as HTMLButtonElement).addEventListener('click', () => {
    LiteLoader.api.openExternal('https://github.com/adproqwq/LiteLoaderQQNT-CheckUpdateModule');
  });
};