globalThis.LiteLoader.api.checkUpdate = async (slug: string): Promise<boolean | null> => {
  const targetPluginManifest = await LiteLoader.plugins[slug].manifest;

  if(!targetPluginManifest.repository){
    console.error(`[CheckUpdate] No repository is found in the manifest in ${slug}`);
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