const { app, BrowserWindow } = require("electron");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  const isDev =
    process.env.NODE_ENV === "development" || !!process.env.ELECTRON_START_URL;

  if (isDev) {
    const devUrl = process.env.ELECTRON_START_URL || "http://localhost:5173";
    win.loadURL(devUrl).catch(() => {
      win.loadFile(path.join(__dirname, "dist", "index.html"));
    });
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, "dist", "index.html"));
  }

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
}

app.whenReady().then(() => {
  // Determine dev mode and open the window. Backend is intentionally separate
  // from the frontend app; this Electron process will not start the backend.
  createWindow();
});

// Ensure backend is stopped when Electron exits
// Backend lifecycle is not managed here because the backend is a separate
// service. If you want to control an external backend, do it outside of this
// frontend Electron app.

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

/* 
import path from "path";
import { app, BrowserWindow } from "electron";

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Load the React build output
  win.loadFile(path.join(__dirname, "frontend", "dist", "index.html"));
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
*/
