const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  send: (channel, data) => {
    ipcRenderer.send(channel, data);
  },
  on: (channel, listener) => {
    ipcRenderer.on(channel, (event, ...args) => listener(...args));
  },
  removeListener: (channel, listener) => {
    ipcRenderer.removeListener(channel, listener);
  },
});

// Expose electron utilities for updates
contextBridge.exposeInMainWorld("electron", {
  getVersion: () => ipcRenderer.invoke("get-version"),
  checkForUpdates: () => ipcRenderer.invoke("check-for-updates"),
  onUpdateStatus: (callback) => {
    const listener = (_, data) => callback(data);
    ipcRenderer.on("update-status", listener);
    return () => ipcRenderer.removeListener("update-status", listener);
  },
  installUpdate: () => ipcRenderer.send("install-update"),
  quitAndInstall: () => ipcRenderer.send("quit-and-install"),
});
