import fs from 'node:fs';
import { Readable } from 'node:stream';
import { finished } from 'node:stream/promises';
import { ReadableStream } from 'node:stream/web';
import AdmZip from 'adm-zip';
import { log, logError } from '../utils/log';
import { BrowserWindow, app, dialog } from 'electron';

if(!fs.existsSync(LiteLoader.plugins.LiteLoaderQQNT_CheckUpdateModule.path.data)){
  fs.mkdir(LiteLoader.plugins.LiteLoaderQQNT_CheckUpdateModule.path.data, (err) => {
    if(err) throw err;
  });
}

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
      const fileStream = fs.createWriteStream(`${LiteLoader.plugins.LiteLoaderQQNT_CheckUpdateModule.path.data}/${zipName}`, { flags: 'w' });
      await finished(Readable.fromWeb(res.body! as ReadableStream<any>).pipe(fileStream));
      const zip = new AdmZip(`${LiteLoader.plugins.LiteLoaderQQNT_CheckUpdateModule.path.data}/${zipName}`);
      if(isSourceCode) zip.extractAllTo(`${LiteLoader.path.plugins}/`, true);
      else zip.extractAllTo(`${LiteLoader.plugins[slug].path.plugin}/`, true);
      fs.unlinkSync(`${LiteLoader.plugins.LiteLoaderQQNT_CheckUpdateModule.path.data}/${zipName}`);
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

  const isHaveUpdate = await LiteLoader.api.checkUpdate(pluginSlug);
  if(isHaveUpdate){
    const updateResult = await LiteLoader.api.downloadUpdate(pluginSlug);
    if(updateResult){
      dialog.showMessageBox(new BrowserWindow(), {
        title: '插件已更新，需要重启',
        message: '插件检测更新API 插件已更新，需要重启',
        type: 'warning',
        buttons: ['现在重启', '稍后自行重启'],
        cancelId: 1,
        defaultId: 0,
      }).then((c) => {
        if(c.response == 0){
          app.relaunch();
          app.exit();
        }
      });
    }
  }
});