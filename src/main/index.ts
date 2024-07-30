import { BrowserWindow, app, dialog, ipcMain } from 'electron';
import fs from 'node:fs/promises';
import { Readable } from 'node:stream';
import { ReadableStream } from 'node:stream/web';
import AdmZip from 'adm-zip';
import { valid, compare } from 'semver';
import picocolors from 'picocolors';
import { log, logError } from '../utils/log';
import outputChangeLog from '../utils/outputChangeLog';
import { getMirror, mirrorParse } from '../utils/mirror';
import buildUrl from '../utils/buildUrl';
import isNewLL from '../utils/isNewLL';
import { config, ISettingMirrorConfig } from '../config/config';
import getLatest from '../github/getLatest';

const pluginSlug = 'LiteLoaderQQNT_CheckUpdateModule';

const typesMap: Map<string, (currentVer: string, targetVer: string) => boolean> = new Map();
const mirrorsMap: Map<string, ISettingMirrorConfig[]> = new Map();

globalThis.LiteLoader.api.registerCompFunc = (type: string, compFunc: (currentVer: string, targetVer: string) => boolean, force?: boolean) => {
  if(typesMap.get(type)){
    if(!force) return;
  }
  typesMap.set(type, compFunc);
};

globalThis.LiteLoader.api.useMirrors = (slug: string, mirrors: ISettingMirrorConfig[]) => {
  mirrorsMap.set(slug, mirrors);
};

globalThis.LiteLoader.api.checkUpdate = async (slug: string, type?: string): Promise<boolean | null> => {
  log(picocolors.cyan(`${slug} > checkUpdate starts`));

  type = type ? type : 'semVer';

  const targetPluginManifest = await LiteLoader.plugins[slug].manifest;

  if(!targetPluginManifest.repository){
    logError(picocolors.red(`No repository is found in the manifest of ${slug}`));
    return null;
  }
  else{
    const compFunc = typesMap.get(type);
    if(!compFunc) return false;

    const currentVer = targetPluginManifest.version;
    const [mirrorType, mirrorDomain] = await getMirror(slug, mirrorsMap);
    log(picocolors.cyan(`${slug} > Use ${mirrorDomain} mirror`));
    const url = mirrorParse(mirrorType, buildUrl('raw', {
      repo: targetPluginManifest.repository.repo,
      branch: targetPluginManifest.repository.branch,
      file: 'manifest.json',
    }), mirrorDomain);
    const remoteManifest: ILiteLoaderManifestConfig = await (await fetch(url)).json();
    const targetVer = remoteManifest.version;

    return compFunc(currentVer, targetVer);
  }
};

globalThis.LiteLoader.api.downloadUpdate = async (slug: string, url?: string): Promise<boolean | null> => {
  log(picocolors.cyan(`${slug} > downloadUpdate starts`));

  const targetPluginManifest = await LiteLoader.plugins[slug].manifest;
  let isSourceCode = false;

  if(!targetPluginManifest.repository){
    logError(picocolors.red(`No repository is found in the manifest of ${slug}`));
    return null;
  }

  const [mirrorType, mirrorDomain] = await getMirror(slug, mirrorsMap);
  log(picocolors.cyan(`${slug} > Use ${mirrorDomain} mirror`));
  const mirrorUrl = mirrorParse(mirrorType, buildUrl('raw', {
    repo: targetPluginManifest.repository.repo,
    branch: targetPluginManifest.repository.branch,
    file: 'manifest.json',
  }), mirrorDomain);
  const remoteManifest: ILiteLoaderManifestConfig = await (await fetch(mirrorUrl)).json();

  if(!url){
    if(targetPluginManifest.repository.release && targetPluginManifest.repository.release.file){
      let tag: string;
      if(remoteManifest!.repository!.release!.tag == 'latest') tag = await getLatest(targetPluginManifest.repository.repo);
      else tag = remoteManifest!.repository!.release!.tag;
      url = mirrorParse(mirrorType, buildUrl('release', {
        repo: targetPluginManifest.repository.repo,
        tag: tag,
        file: remoteManifest!.repository!.release!.file,
      }), mirrorDomain);
    }
    else{
      url = mirrorParse(mirrorType, buildUrl('code', {
        repo: targetPluginManifest.repository.repo,
        branch: targetPluginManifest.repository.branch,
      }), mirrorDomain);
      isSourceCode = true;
    }
  }

  const zipName = `${slug}.zip`;
  try{
    const res = await fetch(url);
    if(res.status === 200){
      let isZipExist = true;
      try{
        await fs.access(`${LiteLoader.plugins[pluginSlug].path.data}/${zipName}`);
      }
      catch{
        isZipExist = false;
      }
      if(isZipExist) await fs.rm(`${LiteLoader.plugins[pluginSlug].path.data}/${zipName}`);
      await fs.writeFile(`${LiteLoader.plugins[pluginSlug].path.data}/${zipName}`, Readable.fromWeb(res.body! as ReadableStream<any>));
      if(isNewLL() && !isSourceCode){
        LiteLoader.api.plugin.install(`${LiteLoader.plugins[pluginSlug].path.data}/${zipName}`);
        log(picocolors.cyan(`${slug} > LL 1.2.0 API.`));
      }
      else{
        const zip = new AdmZip(`${LiteLoader.plugins[pluginSlug].path.data}/${zipName}`);
        if(isSourceCode) zip.extractAllTo(`${LiteLoader.path.plugins}/`, true);
        else zip.extractAllTo(`${LiteLoader.plugins[slug].path.plugin}/`, true);
        log(picocolors.cyan(`${slug} > Plugin Method.`));
      }
      log(picocolors.cyan(`${slug} > Update successfully`));
      return true;
    }
    else{
      logError(picocolors.red('Github proxy has some wrong. Try to close your VPN or disable the github proxy.'));
      return false;
    }
  } catch(err){
    logError(picocolors.red(`Download plugin failed. Error log: ${err}`));
    return false;
  }
};

globalThis.LiteLoader.api.showRelaunchDialog = async (slug: string, showChangeLog?: boolean, changeLogFile?: string) => {
  const pluginName = LiteLoader.plugins[slug].manifest.name;
  const options: Electron.MessageBoxOptions = {
    title: '插件已更新，需要重启',
    message: `${pluginName} 插件已更新，需要重启。${showChangeLog ? '更新日志在打开的窗口中。' : ''}`,
    type: 'warning',
    buttons: ['现在重启', '稍后自行重启'],
    cancelId: 1,
    defaultId: 0,
  };
  const callback = (c: Electron.MessageBoxReturnValue) => {
    if(c.response == 0){
      app.relaunch();
      app.exit();
    }
  };
  if(showChangeLog){
    const relaunchWindow = new BrowserWindow();
    await outputChangeLog(slug, changeLogFile ? changeLogFile : 'changeLog');
    relaunchWindow.loadFile(`${LiteLoader.plugins[pluginSlug].path.plugin}/assets/changeLog.html`);
    dialog.showMessageBox(relaunchWindow, options).then((c) => callback(c));
  }
  else dialog.showMessageBox(options).then((c) => callback(c));
};

const init = async () => {
  LiteLoader.api.registerCompFunc('semVer', (currentVer, targetVer): boolean => {
    const compResult = compare(valid(currentVer)!, valid(targetVer)!);
    if(compResult === -1) return true;
    else return false;
  }, true);

  LiteLoader.api.useMirrors(pluginSlug, (await LiteLoader.api.config.get(pluginSlug, config)).experiment.mirrors);
};

app.whenReady().then(async () => {
  await init();

  const userConfig = await LiteLoader.api.config.get(pluginSlug, config);

  if(userConfig.experiment.output_compFunc){
    typesMap.forEach((_, type) => {
      log(picocolors.cyan(`${type} is registered.`));
    });
  }

  if(!userConfig.experiment.disable_auto_update){
    if(await LiteLoader.api.checkUpdate(pluginSlug)){
      if(await LiteLoader.api.downloadUpdate(pluginSlug)) await LiteLoader.api.showRelaunchDialog(pluginSlug, true);
    }
  }
});

ipcMain.on('LLCUM.checkThisUpdate', async () => {
  if(await LiteLoader.api.checkUpdate(pluginSlug)){
    if(await LiteLoader.api.downloadUpdate(pluginSlug)) LiteLoader.api.showRelaunchDialog(pluginSlug, true);
  }
  else{
    dialog.showMessageBox({
      title: '插件无更新',
      message: '插件无更新',
      type: 'info',
    });
  }
});

ipcMain.on('LLCUM.relaunchQQNT', () => {
  app.relaunch();
  app.exit();
});

ipcMain.on('LLCUM.mirrorsChange', async () => {
  const userConfig = await LiteLoader.api.config.get(pluginSlug, config);
  LiteLoader.api.useMirrors(pluginSlug, userConfig.experiment.mirrors);
});