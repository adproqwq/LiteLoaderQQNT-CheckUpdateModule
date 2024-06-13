export const config: ISettingConfig = {
  experiment: {
    disable_auto_update: false,
    output_compFunc: false,
    mirror: {
      type: 'total',
      domain: 'https://mirror.ghproxy.com'
    },
  },
};

export interface ISettingConfig {
  experiment: ISettingExperimentConfig
};

export interface ISettingExperimentConfig {
  disable_auto_update: boolean;
  output_compFunc: boolean;
  mirror: ISettingMirrorConfig;
};

export interface ISettingMirrorConfig {
  type: 'total' | 'domain' | 'off';
  domain: string;
};