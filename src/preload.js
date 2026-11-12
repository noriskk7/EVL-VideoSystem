const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('evlNative', {
  toggleFullscreen: () => ipcRenderer.invoke('fullscreen:toggle'),
  setFullscreen: (on) => ipcRenderer.invoke('fullscreen:set', on),
  isFullscreen: () => ipcRenderer.invoke('fullscreen:get'),
  onFullscreenChange: (cb) => ipcRenderer.on('fullscreen-changed', (_e, v) => cb(v)),
  keepAwake: (on) => ipcRenderer.invoke('keep-awake', on),
  openPrivacy: (which) => ipcRenderer.invoke('open-privacy', which),
  version: () => ipcRenderer.invoke('app:version'),
  checkUpdate: () => ipcRenderer.invoke('update:check'),
  openSite: () => ipcRenderer.invoke('open-site'),
  titlebarTheme: (theme) => ipcRenderer.invoke('titlebar:theme', theme),
});
