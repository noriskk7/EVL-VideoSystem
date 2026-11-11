const { app, BrowserWindow, ipcMain, session, shell, Menu, powerSaveBlocker } = require('electron');
const path = require('path');

app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');

if (process.env.EVL_FAKE_DEVICES) {
  app.commandLine.appendSwitch('use-fake-device-for-media-stream');
  app.commandLine.appendSwitch('use-fake-ui-for-media-stream');
}

if (!app.requestSingleInstanceLock()) {
  app.quit();
}

let win = null;
let keepAwakeId = null;

function createWindow() {
  win = new BrowserWindow({
    width: 1280,
    height: 780,
    minWidth: 720,
    minHeight: 460,
    backgroundColor: '#eef1f4',
    title: 'EVL VideoSystem',
    icon: path.join(__dirname, '..', 'build', 'icon.png'),
    titleBarStyle: 'hidden',
    titleBarOverlay: { color: '#eef1f4', symbolColor: '#5b6470', height: 34 },
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      backgroundThrottling: false,
    },
  });

  win.loadFile(path.join(__dirname, 'renderer', 'index.html'));
  win.once('ready-to-show', () => win.show());

  win.on('enter-full-screen', () => win.webContents.send('fullscreen-changed', true));
  win.on('leave-full-screen', () => win.webContents.send('fullscreen-changed', false));

  win.webContents.on('will-navigate', (e) => e.preventDefault());
  win.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
}

app.on('second-instance', () => {
  if (win) {
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

app.whenReady().then(() => {
  Menu.setApplicationMenu(null);

  const allowed = new Set(['media', 'fullscreen', 'speaker-selection']);
  session.defaultSession.setPermissionRequestHandler((_wc, permission, callback) => {
    callback(allowed.has(permission));
  });
  session.defaultSession.setPermissionCheckHandler((_wc, permission) => allowed.has(permission));

  ipcMain.handle('fullscreen:toggle', () => {
    if (!win) return false;
    win.setFullScreen(!win.isFullScreen());
    return win.isFullScreen();
  });
  ipcMain.handle('fullscreen:set', (_e, value) => {
    if (win) win.setFullScreen(!!value);
    return win ? win.isFullScreen() : false;
  });
  ipcMain.handle('fullscreen:get', () => (win ? win.isFullScreen() : false));

  ipcMain.handle('keep-awake', (_e, on) => {
    if (on && keepAwakeId === null) keepAwakeId = powerSaveBlocker.start('prevent-display-sleep');
    if (!on && keepAwakeId !== null) {
      powerSaveBlocker.stop(keepAwakeId);
      keepAwakeId = null;
    }
  });

  ipcMain.handle('open-privacy', (_e, which) => {
    const url = which === 'mic' ? 'ms-settings:privacy-microphone' : 'ms-settings:privacy-webcam';
    shell.openExternal(url);
  });

  ipcMain.handle('app:version', () => app.getVersion());

  ipcMain.handle('titlebar:theme', (_e, theme) => {
    if (!win) return;
    try {
      win.setTitleBarOverlay(theme === 'dark'
        ? { color: '#0b0d10', symbolColor: '#c9d1db' }
        : { color: '#eef1f4', symbolColor: '#5b6470' });
    } catch {  }
  });

  createWindow();
});

app.on('window-all-closed', () => app.quit());
