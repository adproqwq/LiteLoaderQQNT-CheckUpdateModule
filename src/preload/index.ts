import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('LLCUM', {
  checkThisUpdate: () => {
    ipcRenderer.send('LLCUM.checkThisUpdate');
  },
  relaunchQQNT: () => {
    ipcRenderer.send('LLCUM.relaunchQQNT');
  }
});