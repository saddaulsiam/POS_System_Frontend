const { app, BrowserWindow, dialog, ipcMain, Menu } = require("electron");
const log = require("electron-log");
const { autoUpdater } = require("electron-updater");
const path = require("path");

// Configure logging
log.transports.file.level = "info";
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = "info";

let mainWindow;
let updateAvailable = false;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
    icon: path.join(__dirname, "assets", "icon.png"),
  });

  const isDev =
    process.env.NODE_ENV === "development" || !!process.env.ELECTRON_START_URL;

  if (isDev) {
    const devUrl = process.env.ELECTRON_START_URL || "http://localhost:5173";
    mainWindow.loadURL(devUrl).catch(() => {
      mainWindow.loadFile(path.join(__dirname, "dist", "index.html"));
    });
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, "dist", "index.html"));

    // Check for updates after window is ready (only in production)
    mainWindow.webContents.on("did-finish-load", () => {
      setTimeout(() => {
        autoUpdater.checkForUpdatesAndNotify();
      }, 3000);
    });
  }

  // Create application menu
  createMenu();

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

function createMenu() {
  const isMac = process.platform === "darwin";

  const template = [
    ...(isMac
      ? [
          {
            label: app.name,
            submenu: [
              { role: "about" },
              { type: "separator" },
              { role: "services" },
              { type: "separator" },
              { role: "hide" },
              { role: "hideOthers" },
              { role: "unhide" },
              { type: "separator" },
              { role: "quit" },
            ],
          },
        ]
      : []),
    {
      label: "File",
      submenu: [isMac ? { role: "close" } : { role: "quit" }],
    },
    {
      label: "Edit",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
        ...(isMac
          ? [
              { role: "pasteAndMatchStyle" },
              { role: "delete" },
              { role: "selectAll" },
            ]
          : [{ role: "delete" }, { type: "separator" }, { role: "selectAll" }]),
      ],
    },
    {
      label: "View",
      submenu: [
        { role: "reload" },
        { role: "forceReload" },
        { role: "toggleDevTools" },
        { type: "separator" },
        { role: "resetZoom" },
        { role: "zoomIn" },
        { role: "zoomOut" },
        { type: "separator" },
        { role: "togglefullscreen" },
      ],
    },
    {
      label: "Help",
      submenu: [
        {
          label: "Check for Updates",
          click: () => {
            if (updateAvailable) {
              dialog
                .showMessageBox(mainWindow, {
                  type: "info",
                  title: "Update Available",
                  message: "An update is ready to install!",
                  detail:
                    "Please restart the application to install the update.",
                  buttons: ["Restart Now", "Later"],
                })
                .then((result) => {
                  if (result.response === 0) {
                    autoUpdater.quitAndInstall(false, true);
                  }
                });
            } else {
              autoUpdater.checkForUpdates();
            }
          },
        },
        { type: "separator" },
        {
          label: "About",
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: "info",
              title: "About POS System",
              message: "POS System",
              detail: `Version: ${app.getVersion()}\nElectron: ${process.versions.electron}\nChrome: ${process.versions.chrome}\nNode: ${process.versions.node}`,
              buttons: ["OK"],
            });
          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// Auto Updater Events
autoUpdater.on("checking-for-update", () => {
  log.info("Checking for updates...");
  if (mainWindow) {
    mainWindow.webContents.send("update-status", { status: "checking" });
  }
});

autoUpdater.on("update-available", (info) => {
  log.info("Update available:", info);
  updateAvailable = true;

  if (mainWindow) {
    mainWindow.webContents.send("update-status", {
      status: "available",
      version: info.version,
    });

    dialog.showMessageBox(mainWindow, {
      type: "info",
      title: "Update Available",
      message: `A new version (${info.version}) is available!`,
      detail:
        "The update will be downloaded in the background. You'll be notified when it's ready to install.",
      buttons: ["OK"],
    });
  }
});

autoUpdater.on("update-not-available", (info) => {
  log.info("Update not available:", info);
  updateAvailable = false;

  if (mainWindow) {
    mainWindow.webContents.send("update-status", { status: "not-available" });
  }
});

autoUpdater.on("error", (err) => {
  log.error("Error in auto-updater:", err);
  updateAvailable = false;

  if (mainWindow) {
    mainWindow.webContents.send("update-status", {
      status: "error",
      error: err.message,
    });
  }
});

autoUpdater.on("download-progress", (progressObj) => {
  const log_message = `Download speed: ${progressObj.bytesPerSecond} - Downloaded ${progressObj.percent.toFixed(2)}% (${progressObj.transferred}/${progressObj.total})`;
  log.info(log_message);

  // Send progress to renderer process
  if (mainWindow) {
    mainWindow.webContents.send("update-status", {
      status: "downloading",
      progress: progressObj,
    });
  }
});

autoUpdater.on("update-downloaded", (info) => {
  log.info("Update downloaded:", info);
  updateAvailable = true;

  if (mainWindow) {
    mainWindow.webContents.send("update-status", {
      status: "downloaded",
      version: info.version,
    });

    // Ensure window is focused before showing dialog
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();

    // Show dialog immediately after download completes
    const response = dialog.showMessageBoxSync(mainWindow, {
      type: "info",
      title: "Update Ready",
      message: `Version ${info.version} has been downloaded and is ready to install.`,
      detail: "The application will restart to install the update.",
      buttons: ["Restart Now", "Later"],
      defaultId: 0,
      cancelId: 1,
    });

    if (response === 0) {
      setImmediate(() => {
        app.isQuitting = true;
        autoUpdater.quitAndInstall(false, true);
      });
    } else {
      log.info("User chose to install update later");
    }
  } else {
    log.warn("Main window not available for update dialog");
  }
});

// IPC handlers for manual update checks
ipcMain.handle("check-for-updates", async () => {
  try {
    if (updateAvailable) {
      return {
        available: true,
        message: "An update has already been detected and is being processed.",
      };
    }

    const result = await autoUpdater.checkForUpdates();

    if (result && result.updateInfo) {
      return {
        available: result.updateInfo.version !== app.getVersion(),
        version: result.updateInfo.version,
        message:
          result.updateInfo.version !== app.getVersion()
            ? "A new update is available and will be downloaded."
            : "You are running the latest version.",
      };
    }

    return {
      available: false,
      message: "You are running the latest version.",
    };
  } catch (error) {
    log.error("Error checking for updates:", error);
    return {
      available: false,
      message: "Failed to check for updates. Please try again later.",
    };
  }
});

ipcMain.on("install-update", () => {
  if (updateAvailable) {
    setImmediate(() => {
      app.isQuitting = true;
      autoUpdater.quitAndInstall(false, true);
    });
  }
});

ipcMain.on("quit-and-install", () => {
  setImmediate(() => {
    app.isQuitting = true;
    autoUpdater.quitAndInstall(false, true);
  });
});

// IPC Handlers for version
ipcMain.handle("get-version", () => {
  return app.getVersion();
});

ipcMain.on("get-app-version", (event) => {
  event.reply("app-version", app.getVersion());
});

// App lifecycle events
app.whenReady().then(() => {
  createWindow();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("before-quit", () => {
  app.isQuitting = true;
});
