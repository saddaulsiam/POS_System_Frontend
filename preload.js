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
  onUpdateAvailable: (callback) =>
    ipcRenderer.on("update-available", (_, info) => callback(info)),
  onUpdateDownloaded: (callback) =>
    ipcRenderer.on("update-downloaded", (_, info) => callback(info)),
  installUpdate: () => ipcRenderer.send("install-update"),
});
