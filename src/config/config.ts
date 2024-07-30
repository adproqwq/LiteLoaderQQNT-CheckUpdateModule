export const config: ISettingConfig = {
  experiment: {
    disable_auto_update: false,
    output_compFunc: false,
    mirrors: [
      {
        type: 'total',
        domain: 'https://mirror.ghproxy.com'
      },
    ],
  },
  needToShowChangeLog: [],
};

export interface ISettingConfig {
  experiment: ISettingExperimentConfig;
  needToShowChangeLog: string[];
};

export interface ISettingExperimentConfig {
  disable_auto_update: boolean;
  output_compFunc: boolean;
  mirrors: ISettingMirrorConfig[];
};

export interface ISettingMirrorConfig {
  type: 'total' | 'domain' | 'off';
  domain: string;
};