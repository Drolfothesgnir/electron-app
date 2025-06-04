import { app, BrowserWindow } from "electron";
import { getUiPath, ipcMainHandle, isDev } from "./util.js";
import { getStaticResourcesData, pollResources } from "./resourceManager.js";
import { getPreloadPath } from "./pathResolver.js";

app.on("ready", () => {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: getPreloadPath(),
    },
  });

  if (isDev()) {
    mainWindow.loadURL("http://localhost:5123");
  } else {
    mainWindow.loadFile(getUiPath());
  }

  pollResources(mainWindow);

  ipcMainHandle("getStaticData", getStaticResourcesData);
});
