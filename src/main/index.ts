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

  if(!targetPluginManifest.repository){
    logError(`No repository is found in the manifest of ${slug}`);
    return null;
  }

  url = url ?
    url :
    (targetPluginManifest.repository.release && targetPluginManifest.repository.release.file ?
      `${githubReleaseMirror}https://github.com/${targetPluginManifest.repository.repo}/releases/download/${remoteManifest!.repository!.release!.tag}/${remoteManifest!.repository!.release!.file}` :
      `${githubReleaseMirror}https://github.com/${targetPluginManifest.repository.repo}/archive/refs/heads/${targetPluginManifest.repository.branch}.zip`
    );

  const splitedUrl = url.split('/');
  const zipName = splitedUrl[splitedUrl.length - 1];
  try{
    const res = await fetch(url);
    const fileStream = fs.createWriteStream(`${LiteLoader.plugins.LiteLoaderQQNT_CheckUpdateModule.path.data}/${zipName}`, { flags: 'w' });
    await finished(Readable.fromWeb(res.body! as ReadableStream<any>).pipe(fileStream));
    const zip = new AdmZip(`${LiteLoader.plugins.LiteLoaderQQNT_CheckUpdateModule.path.data}/${zipName}`);
    zip.extractAllTo(`${LiteLoader.plugins[slug].path.plugin}/`, true);
    fs.unlinkSync(`${LiteLoader.plugins.LiteLoaderQQNT_CheckUpdateModule.path.data}/${zipName}`);
    log('Update successfully');
    return true;
  } catch(err){
    logError(`Download update zip failed. Error log: ${err}`);
    return false;
  }
};

const registerCompMethod = () => {
  LiteLoader.api.registerCompFunc('increase', (currentVer, targetVer): boolean => {
    if(Number(currentVer) < Number(targetVer)) return true;
    else return false;
  });

  LiteLoader.api.registerCompFunc('semVer', (currentVer, targetVer): boolean => {
    const currentVersionSplitedArray: (string | number)[] = currentVer.split('.');
    for(let i = 0;i < currentVersionSplitedArray.length;i++){
      currentVersionSplitedArray[i] = Number(currentVersionSplitedArray[i]);
    }
    const targetVersionSplitedArray: (string | number)[] = targetVer.split('.');
    for(let i = 0;i < targetVersionSplitedArray.length;i++){
      targetVersionSplitedArray[i] = Number(targetVersionSplitedArray[i]);
    }
    for(let i = 0;i < targetVersionSplitedArray.length;i++){
      if(currentVersionSplitedArray[i] < targetVersionSplitedArray[i]) return true;
    }
    return false;
  });
};

app.whenReady().then(async () => {
  registerCompMethod();

  const isHaveUpdate = await LiteLoader.api.checkUpdate('LiteLoaderQQNT_CheckUpdateModule');
  if(isHaveUpdate){
    const updateResult = await LiteLoader.api.downloadUpdate('LiteLoaderQQNT_CheckUpdateModule');
    if(updateResult){
      dialog.showMessageBox(new BrowserWindow(), {
        title: '插件已更新，需要重启',
        message: '插件检测更新API 已更新，需要重启QQ',
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