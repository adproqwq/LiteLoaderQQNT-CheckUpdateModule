import fs from 'node:fs';
import { Readable } from 'node:stream';
import { finished } from 'node:stream/promises';
import { ReadableStream } from 'node:stream/web';
import AdmZip from 'adm-zip';
import { log, logError } from '../utils/log';
import { app } from 'electron';

if(!fs.existsSync(LiteLoader.plugins.LiteLoaderQQNT_CheckUpdateModule.path.data)){
  fs.mkdir(LiteLoader.plugins.LiteLoaderQQNT_CheckUpdateModule.path.data, (err) => {
    if(err) throw err;
  });
}

globalThis.LiteLoader.api.checkUpdate = async (slug: string): Promise<boolean | null> => {
  const targetPluginManifest = await LiteLoader.plugins[slug].manifest;

  if(!targetPluginManifest.repository){
    logError(`No repository is found in the manifest of ${slug}`);
    return null;
  }
  else{
    const currentVer = targetPluginManifest.version;
    const currentVersionNameArray: (string | number)[] = currentVer.split('.');
    for(let i = 0;i < currentVersionNameArray.length;i++){
      currentVersionNameArray[i] = Number(currentVersionNameArray[i]);
    }
    const githubRepoManifest: ILiteLoaderManifestConfig = await (await fetch(`https://raw.gitmirror.com/${targetPluginManifest.repository.repo}/${targetPluginManifest.repository.branch}/manifest.json`)).json();
    const repoVersionNameArray: (string | number)[] = githubRepoManifest.version.split('.');
    for(let i = 0;i < repoVersionNameArray.length;i++){
      repoVersionNameArray[i] = Number(repoVersionNameArray[i]);
    }
    for(let i = 0;i < currentVersionNameArray.length;i++){
      if(currentVersionNameArray[i] < repoVersionNameArray[i]) return true;
    }
    return false;
  }
};

globalThis.LiteLoader.api.downloadUpdate = async (slug: string, url?: string): Promise<boolean | null> => {
  const targetPluginManifest = await LiteLoader.plugins[slug].manifest;
  const githubRepoManifest: ILiteLoaderManifestConfig = await (await fetch(`https://raw.gitmirror.com/${targetPluginManifest.repository!.repo}/${targetPluginManifest.repository!.branch}/manifest.json`)).json();

  if(!targetPluginManifest.repository){
    logError(`No repository is found in the manifest of ${slug}`);
    return null;
  }

  url = url ?
    url :
    (targetPluginManifest.repository.release && targetPluginManifest.repository.release.file ?
      url = `https://mirror.ghproxy.com/https://github.com/${targetPluginManifest.repository.repo}/releases/download/${githubRepoManifest!.repository!.release!.tag}/${githubRepoManifest!.repository!.release!.file}` :
      url = `https://mirror.ghproxy.com/https://github.com/${targetPluginManifest.repository.repo}/archive/refs/heads/${targetPluginManifest.repository.branch}.zip`
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
    return true;
  } catch(err){
    logError(`Download update zip failed. Error log: ${err}`);
    return false;
  }
};

app.whenReady().then(async () => {
  const isHaveUpdate = await LiteLoader.api.checkUpdate('LiteLoaderQQNT_CheckUpdateModule');
  if(isHaveUpdate){
    const updateResult = await LiteLoader.api.downloadUpdate('LiteLoaderQQNT_CheckUpdateModule');
    if(updateResult) log('LiteLoaderQQNT_CheckUpdateModule has updated.');
  }
});