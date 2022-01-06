// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require("electron");
const fs = require("fs");
const path = require("path");

require("dotenv").config();

const getJSONFileDir = () =>
  path.join(app.getPath("pictures"), "mqtt-json-files");

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const logError = (_err) => {};

const mkdir = (dirName) => {
  fs.stat(dirName, (err, stats) => {
    if (err && err.code !== "ENOENT") {
      logError(err);
    }

    if (err || !stats.isDirectory()) {
      fs.mkdir(dirName, logError);
    }
  });
};

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile("./src/index.html");

  mkdir(getJSONFileDir());

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

ipcMain.handle("get-json-obj", (_event, filename) => {
  return new Promise((resolve, reject) => {
    const filePath = path.join(getJSONFileDir(), filename);
    const rawData = fs.readFileSync(filePath).toString();

    if (!rawData) {
      reject(new Error("Could not read file"));
    }

    const data = JSON.parse(rawData);

    if (!data) {
      reject(new Error("Not a valid json"));
    }

    resolve(data);
  });
});
