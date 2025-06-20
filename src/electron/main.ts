import { app, BrowserWindow } from "electron";
import { getUiPath, ipcMainHandle, ipcMainOn, isDev } from "./util.js";
import { getStaticResourcesData, pollResources } from "./resourceManager.js";
import { getPreloadPath } from "./pathResolver.js";
import { createTray } from "./tray.js";
import { createMenu } from "./menu.js";

// Menu.setApplicationMenu(null);

app.on("ready", () => {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: getPreloadPath(),
    },
    frame: isDev(),
  });

  if (isDev()) {
    mainWindow.loadURL("http://localhost:5123");
  } else {
    mainWindow.loadFile(getUiPath());
  }

  pollResources(mainWindow);

  ipcMainHandle("getStaticData", getStaticResourcesData);

  ipcMainOn("sendFrameAction", (action) => {
    switch (action) {
      case "CLOSE":
        mainWindow.close();
        break;

      case "MAXIMIZE":
        mainWindow.maximize();
        break;

      case "MINIMIZE":
        mainWindow.minimize();
        break;
      default:
        break;
    }
  });

  createTray(mainWindow);

  handleCloseEvents(mainWindow);

  createMenu(mainWindow);
});

function handleCloseEvents(mainWindow: BrowserWindow) {
  let willClose = false;

  mainWindow.on("close", (e) => {
    if (willClose) return;

    e.preventDefault();
    mainWindow.hide();
  });

  app.on("before-quit", () => {
    willClose = true;
  });

  mainWindow.on("show", () => {
    willClose = false;
  });
}
