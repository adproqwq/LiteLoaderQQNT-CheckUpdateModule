export const config: ISettingConfig = {
  experiment: {
    disable_auto_update: false,
  },
}

export interface ISettingConfig {
  experiment: ISettingExperimentConfig
}

export interface ISettingExperimentConfig {
  disable_auto_update: boolean;
};