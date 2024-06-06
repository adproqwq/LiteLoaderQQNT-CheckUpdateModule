import fs from 'node:fs';
import { Readable } from 'node:stream';
import { finished } from 'node:stream/promises';
import { ReadableStream } from 'node:stream/web';
import AdmZip from 'adm-zip';
import { log, logError } from '../utils/log';
import { BrowserWindow, app, dialog } from 'electron';
import outputChangeLogJs from '../utils/outputChangeLogJs';
import { config } from '../config/config';

const githubRawMirror = 'https://raw.gitmirror.com/';
const githubReleaseMirror = 'https://mirror.ghproxy.com/';
const pluginSlug = 'LiteLoaderQQNT_CheckUpdateModule';

const typesMap: Map<string, (currentVersion: string, targetVersion: string) => boolean> = new Map();

globalThis.LiteLoader.api.registerCompFunc = (type: string, compFunc: (currentVersion: string, targetVersion: string) => boolean) => {
  typesMap.set(type, compFunc);
};

globalThis.LiteLoader.api.checkUpdate = async (slug: string, type?: string): Promise<boolean | null> => {
  log('checkUpdate starts');

  type = type ? type : 'semVer';

  const targetPluginManifest = await LiteLoader.plugins[slug].manifest;

  if(!targetPluginManifest.repository){
    logError(`No repository is found in the manifest of ${slug}`);
    return null;
  }
  else{
    const compFunc = typesMap.get(type);
    if(!compFunc) return false;

    const currentVer = targetPluginManifest.version;
    const remoteManifest: ILiteLoaderManifestConfig = await (await fetch(`${githubRawMirror}${targetPluginManifest.repository.repo}/${targetPluginManifest.repository.branch}/manifest.json`)).json();
    const targetVer = remoteManifest.version;

    return compFunc(currentVer, targetVer);
  }
};

globalThis.LiteLoader.api.downloadUpdate = async (slug: string, url?: string): Promise<boolean | null> => {
  log('downloadUpdate starts');

  const targetPluginManifest = await LiteLoader.plugins[slug].manifest;
  const remoteManifest: ILiteLoaderManifestConfig = await (await fetch(`${githubRawMirror}${targetPluginManifest.repository!.repo}/${targetPluginManifest.repository!.branch}/manifest.json`)).json();
  let isSourceCode = false;

  if(!targetPluginManifest.repository){
    logError(`No repository is found in the manifest of ${slug}`);
    return null;
  }

  if(!url){
    if(targetPluginManifest.repository.release && targetPluginManifest.repository.release.file){
      url = `${githubReleaseMirror}https://github.com/${targetPluginManifest.repository.repo}/releases/download/${remoteManifest!.repository!.release!.tag}/${remoteManifest!.repository!.release!.file}`;
    }
    else{
      url = `${githubReleaseMirror}https://github.com/${targetPluginManifest.repository.repo}/archive/refs/heads/${targetPluginManifest.repository.branch}.zip`;
      isSourceCode = true;
    }
  }

  const splitedUrl = url.split('/');
  const zipName = splitedUrl[splitedUrl.length - 1];
  try{
    const res = await fetch(url);
    if(res.status === 200){
      const fileStream = fs.createWriteStream(`${LiteLoader.plugins[pluginSlug].path.data}/${zipName}`, { flags: 'w' });
      await finished(Readable.fromWeb(res.body! as ReadableStream<any>).pipe(fileStream));
      const zip = new AdmZip(`${LiteLoader.plugins[pluginSlug].path.data}/${zipName}`);
      if(isSourceCode) zip.extractAllTo(`${LiteLoader.path.plugins}/`, true);
      else zip.extractAllTo(`${LiteLoader.plugins[slug].path.plugin}/`, true);
      fs.unlinkSync(`${LiteLoader.plugins[pluginSlug].path.data}/${zipName}`);
      log('Update successfully');
      return true;
    }
    else{
      logError('Github proxy has some wrong. Retry later.');
      return false;
    }
  } catch(err){
    logError(`Download update zip failed. Error log: ${err}`);
    return false;
  }
};

globalThis.LiteLoader.api.showRelaunchDialog = (slug: string, showChangeLog?: boolean, changeLogFile?: string) => {
  const pluginName = LiteLoader.plugins[slug].manifest.name;
  const options: Electron.MessageBoxOptions = {
    title: '插件已更新，需要重启',
    message: `${pluginName} 插件已更新，需要重启。${showChangeLog ? '更新日志在打开的窗口中。' : ''}`,
    type: 'warning',
    buttons: ['现在重启', '稍后自行重启'],
    cancelId: 1,
    defaultId: 0,
  };
  if(showChangeLog){
    const relaunchWindow = new BrowserWindow();
    outputChangeLogJs(slug, changeLogFile ? changeLogFile : 'changeLog');
    relaunchWindow.loadFile(`${LiteLoader.plugins[pluginSlug].path.plugin}/assets/changeLog.html`);
    dialog.showMessageBox(relaunchWindow, options).then((c) => {
      if(c.response == 0){
        app.relaunch();
        app.exit();
      }
    });
  }
  else{
    dialog.showMessageBox(options).then((c) => {
      if(c.response == 0){
        app.relaunch();
        app.exit();
      }
    });
  }
};

const initCompFunc = () => {
  LiteLoader.api.registerCompFunc('increase', (currentVer, targetVer): boolean => {
    if(Number(currentVer) < Number(targetVer)) return true;
    else return false;
  });

  LiteLoader.api.registerCompFunc('semVer', (currentVer, targetVer): boolean => {
    const currentVersionSplitedArray: string[] = currentVer.split('.');
    const targetVersionSplitedArray: string[] = targetVer.split('.');
    for(let i = 0, j = 0;i < currentVersionSplitedArray.length, j < targetVersionSplitedArray.length;i++, j++){
      if(Number(currentVersionSplitedArray[i]) < Number(targetVersionSplitedArray[j])) return true;
    }
    return false;
  });
};

app.whenReady().then(async () => {
  initCompFunc();

  const userConfig = await LiteLoader.api.config.get(pluginSlug, config);

  if(userConfig.experiment.output_compFunc){
    typesMap.forEach((_, types) => {
      log(`${types} is registered.`);
    });
  }

  if(!userConfig.experiment.disable_auto_update){
    const isHaveUpdate = await LiteLoader.api.checkUpdate(pluginSlug);
    if(isHaveUpdate){
      log('The plugin has updated.');
      const updateResult = await LiteLoader.api.downloadUpdate(pluginSlug);
      if(updateResult){
        log('Update successfully.');
        LiteLoader.api.showRelaunchDialog(pluginSlug, true);
      }
    }
  }
});